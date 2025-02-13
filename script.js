// 导航链接数据
const categories = [
    {
        name: "动漫追番",
        icon: "🎬",
        links: [
            {
                name: "哔哩哔哩",
                url: "https://www.bilibili.com",
                icon: "🎮"
            },
            {
                name: "AcFun",
                url: "https://www.acfun.cn",
                icon: "🎯"
            }
        ]
    },
    {
        name: "图片资源",
        icon: "🎨",
        links: [
            {
                name: "pixiv",
                url: "https://www.pixiv.net",
                icon: "🎨"
            },
            {
                name: "Wallhaven",
                url: "https://wallhaven.cc",
                icon: "🖼️"
            }
        ]
    },
    {
        name: "资讯论坛",
        icon: "📰",
        links: [
            {
                name: "Stage1st",
                url: "https://bbs.saraba1st.com",
                icon: "💭"
            },
            {
                name: "NGA",
                url: "https://bbs.nga.cn",
                icon: "🎮"
            }
        ]
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 渲染分类和链接
    renderCategories(categories);
    
    // 搜索功能
    initSearch();

    // 初始化背景设置
    initBackgroundSettings();
});

// 初始化背景设置
function initBackgroundSettings() {
    const bgToggle = document.getElementById('bgToggle');
    const bgSettings = document.getElementById('bgSettings');
    const bgInput = document.getElementById('bgInput');
    const bgApply = document.getElementById('bgApply');
    const bgReset = document.getElementById('bgReset');

    // 加载保存的背景
    const currentBg = localStorage.getItem('currentBackground');
    const savedBgs = JSON.parse(localStorage.getItem('savedBackgrounds')) || [];
    
    if (currentBg) {
        document.body.style.setProperty('--bg-image', `url('${currentBg}')`);
    }

    // 更新背景列表显示
    function updateBgList() {
        const bgList = document.getElementById('bgList');
        if (!bgList) return;
        
        bgList.innerHTML = savedBgs.map((bg, index) => `
            <div class="bg-item">
                <img src="${bg}" alt="背景预览" class="bg-preview">
                <div class="bg-item-actions">
                    <button class="bg-item-btn" onclick="applyBackground('${bg}')">使用</button>
                    <button class="bg-item-btn delete" onclick="deleteBackground(${index})">删除</button>
                </div>
            </div>
        `).join('');
    }

    // 切换设置面板
    bgToggle.addEventListener('click', () => {
        bgSettings.classList.toggle('active');
    });

    // 应用新背景
    bgApply.addEventListener('click', () => {
        const url = bgInput.value.trim();
        if (url) {
            if (!savedBgs.includes(url)) {
                savedBgs.push(url);
                localStorage.setItem('savedBackgrounds', JSON.stringify(savedBgs));
            }
            applyBackground(url);
            bgInput.value = '';
            updateBgList();
        }
    });

    // 重置背景
    bgReset.addEventListener('click', () => {
        document.body.style.removeProperty('--bg-image');
        localStorage.removeItem('currentBackground');
        bgSettings.classList.remove('active');
    });

    // 点击外部关闭设置面板
    document.addEventListener('click', (e) => {
        if (!bgSettings.contains(e.target) && !bgToggle.contains(e.target)) {
            bgSettings.classList.remove('active');
        }
    });

    // 初始化显示背景列表
    updateBgList();
}

// 应用背景
function applyBackground(url) {
    document.body.style.setProperty('--bg-image', `url('${url}')`);
    localStorage.setItem('currentBackground', url);
}

// 删除背景
function deleteBackground(index) {
    const savedBgs = JSON.parse(localStorage.getItem('savedBackgrounds')) || [];
    const deletedBg = savedBgs[index];
    savedBgs.splice(index, 1);
    localStorage.setItem('savedBackgrounds', JSON.stringify(savedBgs));
    
    // 如果删除的是当前使用的背景，则重置为默认背景
    if (deletedBg === localStorage.getItem('currentBackground')) {
        document.body.style.removeProperty('--bg-image');
        localStorage.removeItem('currentBackground');
    }
    
    // 更新背景列表显示
    const bgList = document.getElementById('bgList');
    if (bgList) {
        bgList.innerHTML = savedBgs.map((bg, i) => `
            <div class="bg-item">
                <img src="${bg}" alt="背景预览" class="bg-preview">
                <div class="bg-item-actions">
                    <button class="bg-item-btn" onclick="applyBackground('${bg}')">使用</button>
                    <button class="bg-item-btn delete" onclick="deleteBackground(${i})">删除</button>
                </div>
            </div>
        `).join('');
    }
}

// 渲染分类和链接
function renderCategories(categories) {
    const navGrid = document.getElementById('navGrid');
    navGrid.innerHTML = categories.map(category => `
        <div class="category">
            <h2 class="category-title">
                <span class="category-icon">${category.icon}</span>
                ${category.name}
            </h2>
            <div class="category-links">
                ${renderCategoryLinks(category.links)}
            </div>
        </div>
    `).join('');
}

function renderCategoryLinks(links) {
    return links.map(link => `
        <a href="${link.url}" class="nav-item" target="_blank">
            <span class="nav-icon">${link.icon}</span>
            <span class="nav-name">${link.name}</span>
        </a>
    `).join('');
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            renderCategories(categories);
            return;
        }

        const filteredCategories = categories.map(category => ({
            ...category,
            links: category.links.filter(link => 
                link.name.toLowerCase().includes(searchTerm)
            )
        })).filter(category => category.links.length > 0);

        renderCategories(filteredCategories);
    });
} 