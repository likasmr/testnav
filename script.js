// 链接数据
const linksData = siteConfig.categories;

// 动态生成链接网格
function generateLinkGrid() {
    const container = document.getElementById('linksContainer');
    
    for (const [category, items] of Object.entries(linksData)) {
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
    const url = localStorage.getItem('bgImage') || siteConfig.defaultBackground;
    const blur = localStorage.getItem('bgBlur') || 5;
    
    let bgContainer = document.querySelector('.bg-container');
    
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'bg-container';
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
    
    // 如果没有设置过背景图，使用默认背景图
    if (!localStorage.getItem('bgImage')) {
        localStorage.setItem('bgImage', siteConfig.defaultBackground);
        document.getElementById('bgImageUrl').value = siteConfig.defaultBackground;
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

// 随机背景功能
async function randomBackground() {
    const apis = siteConfig.backgroundApis;
    const randomApi = apis[Math.floor(Math.random() * apis.length)];
    
    try {
        // 更新输入框
        document.getElementById('bgImageUrl').value = randomApi;
        // 应用新背景
        updateBackground();
    } catch (error) {
        console.error('获取随机背景失败:', error);
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 默认使用百度搜索
            window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(query)}`, '_blank');
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    generateLinkGrid();
    createSakura();
    applyBackground();
    initSearch();

    // 设置默认值
    const savedBlur = localStorage.getItem('bgBlur') || 5;
    const blurInput = document.getElementById('bgBlur');
    blurInput.value = savedBlur;
    document.getElementById('blurValue').textContent = savedBlur + 'px';
    
    // 设置背景图片输入框的默认值
    const savedBgImage = localStorage.getItem('bgImage') || siteConfig.defaultBackground;
    document.getElementById('bgImageUrl').value = savedBgImage;
}); 