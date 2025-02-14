// 动态生成链接网格
function generateLinkGrid() {
    const container = document.getElementById('linksContainer');
    
    for (const [category, items] of Object.entries(config.links)) {
        const categoryHTML = `
            <div class="category-card">
                <h2>${category}</h2>
                <div class="link-list">
                    ${items.map(item => `
                        <a href="${item.url}" 
                           class="link-item" 
                           style="--hover-color: ${item.color}"
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
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    const currentDisplay = window.getComputedStyle(panel).display;
    panel.style.display = currentDisplay === 'none' ? 'block' : 'none';
}

function updateBackground() {
    const url = document.getElementById('bgImageUrl').value;
    const blur = document.getElementById('bgBlur').value;
    
    // 保存到localStorage
    localStorage.setItem('bgImage', url);
    localStorage.setItem('bgBlur', blur);
    
    applyBackground();
}

function applyBackground() {
    const url = localStorage.getItem('bgImage') || config.defaultBgImage;
    const blur = localStorage.getItem('bgBlur') || 5;
    
    let bgContainer = document.querySelector('.bg-container');
    
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'bg-container';
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
    
    // 如果localStorage中没有保存的背景图，自动填充输入框
    if (!localStorage.getItem('bgImage')) {
        document.getElementById('bgImageUrl').value = config.defaultBgImage;
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
        // 替换为你的 Gist ID
        const gistId = 'your_gist_id';
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        const data = await response.json();
        const config = JSON.parse(data.files['config.json'].content);
        
        // 更新背景
        if (config.bgImage) {
            document.getElementById('bgImageUrl').value = config.bgImage;
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

// 添加分享配置功能
function shareConfig() {
    const url = document.getElementById('bgImageUrl').value;
    const blur = document.getElementById('bgBlur').value;
    
    // 生成带配置的分享链接
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('bg', encodeURIComponent(url));
    shareUrl.searchParams.set('blur', blur);
    
    // 复制链接到剪贴板
    navigator.clipboard.writeText(shareUrl.toString());
    alert('配置链接已复制到剪贴板！');
}

// 从 URL 读取配置
function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const bgUrl = params.get('bg');
    const blur = params.get('blur');
    
    if (bgUrl) {
        document.getElementById('bgImageUrl').value = decodeURIComponent(bgUrl);
        document.getElementById('bgBlur').value = blur || 5;
        updateBackground();
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

// 登出功能
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('credentials');
    window.location.href = '/login.html';
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    generateLinkGrid();
    createSakura();
    
    // 如果 localStorage 中已有背景配置，则直接使用
    if (localStorage.getItem('bgImage')) {
        applyBackground();
    } else if (!new URLSearchParams(window.location.search).has('bg')) {
        // 否则如果 URL 中没有配置，则尝试获取远程配置
        fetchRemoteConfig().catch(() => {
            applyBackground();
        });
    } else {
        // 否则，加载 URL 中的配置（例如通过分享链接加载）
        loadFromUrl();
    }
    
    // 设置背景模糊度的默认显示值
    const savedBlur = localStorage.getItem('bgBlur') || 5;
    const blurInput = document.getElementById('bgBlur');
    blurInput.value = savedBlur;
    document.getElementById('blurValue').textContent = savedBlur + 'px';
}); 