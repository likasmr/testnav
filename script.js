// 链接数据
const linksData = {
    "追番平台": [
        { name: "哔哩哔哩", url: "https://www.bilibili.com", color: "#00a1d6" },
        { name: "AcFun", url: "https://www.acfun.cn", color: "#fd4c5b" }
    ],
    "资源社区": [
        { name: "萌娘百科", url: "https://zh.moegirl.org.cn", color: "#f28ead" },
        { name: "Bangumi", url: "https://bgm.tv", color: "#333333" }
    ]
};

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
    const petalCount = 15; // 同时存在的花瓣数量
    
    function generatePetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura';
        
        // 随机属性
        const left = Math.random() * 100;
        const duration = 12 + Math.random() * 8; // 12-20秒
        const delay = Math.random() * -20;
        const size = 8 + Math.random() * 8; // 更小的花瓣
        const opacity = 0.7 + Math.random() * 0.3;
        const rotate = Math.random() * 360; // 初始旋转角度
        
        petal.style.cssText = `
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            transform: rotate(${rotate}deg);
            filter: drop-shadow(0 0 2px rgba(255,182,193,0.3));
        `;
        
        container.appendChild(petal);
        
        // 自动移除旧花瓣
        if (container.children.length > petalCount) {
            container.removeChild(container.firstChild);
        }
    }
    
    // 每0.8秒生成新花瓣，频率稍微降低
    setInterval(generatePetal, 800);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    generateLinkGrid();
    createSakura();
}); 