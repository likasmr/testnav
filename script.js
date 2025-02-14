// 动态生成链接网格
async function generateLinkGrid() {
    const container = document.getElementById('linksContainer');
    let links;
    
    try {
        // 从API获取链接数据
        const response = await fetch('/api/manage-links');
        const data = await response.json();
        links = data.links;
        
        // 如果是首次使用（KV中没有链接），则导入默认链接
        if (Object.keys(links).length === 0) {
            await importDefaultLinks();
            // 重新获取链接
            const newResponse = await fetch('/api/manage-links');
            const newData = await newResponse.json();
            links = newData.links;
        }
    } catch (error) {
        console.error('获取链接失败，使用默认配置');
        links = config.links;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 生成链接网格
    for (const [category, items] of Object.entries(links)) {
        const categoryHTML = `
            <div class="category-card">
                <h2>${category}</h2>
                <div class="link-list">
                    ${items.map(item => `
                        <a href="${item.url}" 
                           class="link-item" 
                           style="--hover-color: ${item.color || '#ff6b9d'}"
                           target="_blank">
                            ${item.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHTML);
    }
}

// 樱花飘落效果
function createSakura() {
    const container = document.getElementById('sakura-container');
    const petalCount = 30; // 增加花瓣数量
    
    function generatePetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura';
        
        // 随机属性
        const left = Math.random() * 100;
        const duration = 10 + Math.random() * 5;
        const size = 8 + Math.random() * 8;
        const opacity = 0.7 + Math.random() * 0.3;
        
        petal.style.cssText = `
            left: ${left}%;
            animation: fall ${duration}s linear infinite;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
        `;
        
        container.appendChild(petal);
        
        // 自动移除超出视窗的花瓣
        setTimeout(() => {
            container.removeChild(petal);
        }, duration * 1000);
    }
    
    // 立即生成一些花瓣
    for(let i = 0; i < petalCount; i++) {
        setTimeout(generatePetal, i * 300);
    }
    
    // 持续生成新花瓣
    setInterval(generatePetal, 300);
}

// 背景设置相关功能
function updateBackground() {
    const url = document.getElementById('bgImageUrl').value;
    const blur = document.getElementById('bgBlur').value;
    
    // 保存到localStorage
    localStorage.setItem('bgImage', url);
    localStorage.setItem('bgBlur', blur);
    
    applyBackground();
}

function applyBackground() {
    const url = localStorage.getItem('bgImage');
    const blur = localStorage.getItem('bgBlur') || 5;
    
    let bgContainer = document.querySelector('.bg-container');
    
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'bg-container';
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
    
    if (url) {
        bgContainer.style.backgroundImage = `url(${url})`;
        bgContainer.style.filter = `blur(${blur}px)`;
    }
}

// 添加模糊度显示更新
document.getElementById('bgBlur').addEventListener('input', function() {
    document.getElementById('blurValue').textContent = this.value + 'px';
    // 实时更新模糊效果
    const bgContainer = document.querySelector('.bg-container');
    if (bgContainer) {
        bgContainer.style.filter = `blur(${this.value}px)`;
    }
});

// 在滑块释放时保存设置
document.getElementById('bgBlur').addEventListener('change', function() {
    localStorage.setItem('bgBlur', this.value);
});

// 添加获取远程配置的功能
async function fetchRemoteConfig() {
    try {
        const response = await fetch('/api/get-config');
        const data = await response.json();
        
        // 更新背景
        if (data.defaultBgImage) {
            document.getElementById('bgImageUrl').value = data.defaultBgImage;
            updateBackground();
        }
    } catch (error) {
        console.log('使用本地配置');
    }
}

async function saveToCloudflare() {
    const url = document.getElementById('bgImageUrl').value;
    const blur = document.getElementById('bgBlur').value;
    
    try {
        await fetch('/api/settings', {
            method: 'POST',
            body: JSON.stringify({ bgImage: url, blur })
        });
    } catch (error) {
        // 如果远程保存失败，回退到本地存储
        localStorage.setItem('bgImage', url);
        localStorage.setItem('bgBlur', blur);
    }
}

// 登录状态检查
let authToken = null;
let autoLoginAttempted = false;

// 检查登录状态
async function checkAuth() {
    // 检查token是否存在且未过期
    const savedAuth = localStorage.getItem('authToken');
    if (savedAuth) {
        const { token, expiresAt } = JSON.parse(savedAuth);
        if (Date.now() < expiresAt) {
            authToken = token;
            return;
        } else {
            // token已过期，清除存储
            localStorage.removeItem('authToken');
            localStorage.removeItem('credentials');
            authToken = null;
        }
    }

    // 如果没有有效的token，重定向到登录页面
    window.location.href = '/login.html';
}

// 显示确认对话框
function showConfirmDialog() {
    const dialog = document.getElementById('confirmDialog');
    dialog.style.display = 'flex';
    // 强制重排以触发动画
    dialog.offsetHeight;
    dialog.classList.add('show');
}

// 隐藏确认对话框
function hideConfirmDialog() {
    const dialog = document.getElementById('confirmDialog');
    dialog.classList.add('hide');
    dialog.classList.remove('show');
    // 等待动画完成后隐藏
    setTimeout(() => {
        dialog.classList.remove('hide');
        dialog.style.display = 'none';
    }, 200);
}

// 确认退出
function confirmLogout() {
    hideConfirmDialog();
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('credentials');
    showToast('已退出登录', 'info');
    
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
}

// 登出功能
function logout() {
    showConfirmDialog();
}

// 修改setAsDefault函数
async function setAsDefault() {
    if (!authToken) {
        showToast('需要登录后才能设置默认背景', 'error');
        return;
    }

    const url = document.getElementById('bgImageUrl').value;
    if (!url) {
        showToast('请输入有效的图片链接', 'error');
        return;
    }

    try {
        const response = await fetch('/api/update-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                defaultBgImage: url
            })
        });

        if (response.ok) {
            showToast('默认背景已更新', 'success');
            config.defaultBgImage = url;
        } else {
            throw new Error('设置失败');
        }
    } catch (error) {
        showToast('设置失败，请检查网络或登录状态', 'error');
        console.error('Error:', error);
    }
}

// 链接管理相关功能
async function loadLinks() {
    try {
        const response = await fetch('/api/manage-links');
        const data = await response.json();
        
        if (data.links) {
            // 更新分类下拉框
            const categorySelect = document.getElementById('linkCategory');
            categorySelect.innerHTML = '<option value="">选择分类...</option><option value="new">新建分类</option>';
            
            Object.keys(data.links).forEach(category => {
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            });
            
            // 更新链接列表
            updateLinksList(data.links);
        }
    } catch (error) {
        showToast('加载链接失败', 'error');
    }
}

function updateLinksList(links) {
    const container = document.getElementById('manageLinksList');
    container.innerHTML = '';
    
    Object.entries(links).forEach(([category, items]) => {
        const categoryHTML = `
            <div class="link-category">
                <h4>${category}</h4>
                ${items.map(item => `
                    <div class="link-item-manage">
                        <div class="link-info">
                            <div>${item.name}</div>
                            <div class="link-url">${item.url}</div>
                        </div>
                        <div class="link-actions">
                            <button class="edit-btn" onclick="editLink('${category}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                ✏️
                            </button>
                            <button class="delete-btn" onclick="deleteLink('${category}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                🗑️
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHTML);
    });
}

async function addLink() {
    let category = document.getElementById('linkCategory').value;
    const newCategory = document.getElementById('newCategory').value;
    const name = document.getElementById('linkName').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const color = document.getElementById('linkColor').value;
    
    // 改进的验证逻辑
    if (category === 'new') {
        if (!newCategory.trim()) {
            showToast('请输入新分类名称', 'error');
            return;
        }
        category = newCategory.trim();
    } else if (!category) {
        showToast('请选择或创建分类', 'error');
        return;
    }
    
    if (!name) {
        showToast('请输入网站名称', 'error');
        return;
    }
    
    if (!url) {
        showToast('请输入网站链接', 'error');
        return;
    }
    
    // 验证URL格式
    try {
        new URL(url);
    } catch {
        showToast('请输入有效的网站链接', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/manage-links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                action: 'add',
                category,
                link: { name, url, color }
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast('添加成功', 'success');
            loadLinks();
            generateLinkGrid();
            
            // 清空输入框
            document.getElementById('linkName').value = '';
            document.getElementById('linkUrl').value = '';
            document.getElementById('newCategory').value = '';
            document.getElementById('linkCategory').value = ''; // 重置分类选择
            document.getElementById('newCategory').style.display = 'none'; // 隐藏新分类输入框
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast('添加失败：' + error.message, 'error');
    }
}

async function deleteLink(category, link) {
    if (!confirm(`确定要删除 ${link.name} 吗？`)) return;
    
    try {
        const response = await fetch('/api/manage-links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                action: 'remove',
                category,
                link
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast('删除成功', 'success');
            loadLinks();
            generateLinkGrid(); // 重新生成链接网格
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast('删除失败：' + error.message, 'error');
    }
}

// 导入默认链接到KV
async function importDefaultLinks() {
    try {
        // 遍历config.js中的每个分类和链接
        for (const [category, items] of Object.entries(config.links)) {
            for (const link of items) {
                await fetch('/api/manage-links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        action: 'add',
                        category,
                        link
                    })
                });
            }
        }
        showToast('默认链接导入成功', 'success');
    } catch (error) {
        console.error('导入默认链接失败:', error);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await generateLinkGrid(); // 等待链接加载完成
    createSakura();
    
    try {
        // 首先尝试获取远程配置
        const response = await fetch('/api/get-config');
        const data = await response.json();
        
        if (data.defaultBgImage) {
            // 如果本地没有保存的背景，使用远程默认背景
            if (!localStorage.getItem('bgImage')) {
                localStorage.setItem('bgImage', data.defaultBgImage);
            }
            // 更新输入框的值
            document.getElementById('bgImageUrl').value = data.defaultBgImage;
        }
    } catch (error) {
        console.error('获取远程配置失败:', error);
    }
    
    // 如果 localStorage 中已有背景配置，则直接使用
    if (localStorage.getItem('bgImage')) {
        applyBackground();
    } else {
        // 如果没有本地配置也没有URL参数，应用默认背景
        applyBackground();
    }
    
    // 设置背景模糊度的默认显示值
    const savedBlur = localStorage.getItem('bgBlur') || 5;
    const blurInput = document.getElementById('bgBlur');
    blurInput.value = savedBlur;
    document.getElementById('blurValue').textContent = savedBlur + 'px';

    // 设置面板交互
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.getElementById('settingsPanel');
    let timeoutId;

    // 鼠标进入按钮或面板时显示
    function showPanel() {
        clearTimeout(timeoutId);
        settingsPanel.classList.add('show');
    }

    // 鼠标离开按钮和面板时延迟隐藏
    function hidePanel() {
        timeoutId = setTimeout(() => {
            settingsPanel.classList.remove('show');
        }, 300); // 300ms延迟，避免鼠标移动到面板时闪烁
    }

    // 绑定事件
    settingsBtn.addEventListener('mouseenter', showPanel);
    settingsBtn.addEventListener('mouseleave', hidePanel);
    settingsPanel.addEventListener('mouseenter', showPanel);
    settingsPanel.addEventListener('mouseleave', hidePanel);

    // 初始化标签页切换
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 切换标签页
            document.querySelector('.tab-btn.active').classList.remove('active');
            tab.classList.add('active');
            
            const tabId = tab.dataset.tab;
            document.querySelector('.tab-content.active').classList.remove('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
            
            // 如果切换到链接管理标签页，加载链接
            if (tabId === 'links') {
                loadLinks();
            }
        });
    });

    // 处理新建分类的显示/隐藏
    document.getElementById('linkCategory').addEventListener('change', function() {
        document.getElementById('newCategory').style.display = 
            this.value === 'new' ? 'block' : 'none';
    });
});

async function resetToDefaultLinks() {
    if (!confirm('确定要恢复默认链接吗？这将删除所有自定义链接！')) return;
    
    try {
        // 清空现有链接
        await fetch('/api/manage-links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                action: 'reset'
            })
        });
        
        // 导入默认链接
        await importDefaultLinks();
        
        // 刷新显示
        await generateLinkGrid();
        loadLinks();
        
        showToast('已恢复默认链接', 'success');
    } catch (error) {
        showToast('恢复默认链接失败', 'error');
    }
} 