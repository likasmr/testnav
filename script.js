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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    generateLinkGrid();
}); 