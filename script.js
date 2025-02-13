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
async function initBackgroundSettings() {
    const bgToggle = document.getElementById('bgToggle');
    const bgSettings = document.getElementById('bgSettings');
    const bgInput = document.getElementById('bgInput');
    const bgApply = document.getElementById('bgApply');
    const bgReset = document.getElementById('bgReset');

    // 从服务器加载背景设置
    try {
        const response = await fetch('/api/background');
        const data = await response.json();
        if (data) {
            const settings = JSON.parse(data);
            if (settings.currentBackground) {
                document.body.style.setProperty('--bg-image', `url('${settings.currentBackground}')`);
            }
            updateBgList(settings.savedBackgrounds || []);
        }
    } catch (error) {
        console.error('Failed to load background settings:', error);
    }

    // 更新背景列表显示
    function updateBgList(savedBgs = []) {
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
    bgApply.addEventListener('click', async () => {
        const url = bgInput.value.trim();
        if (url) {
            try {
                const response = await fetch('/api/background');
                const data = await response.json();
                const settings = data ? JSON.parse(data) : { savedBackgrounds: [] };
                
                if (!settings.savedBackgrounds.includes(url)) {
                    settings.savedBackgrounds.push(url);
                }
                settings.currentBackground = url;
                
                await fetch('/api/background', {
                    method: 'POST',
                    body: JSON.stringify(settings)
                });

                document.body.style.setProperty('--bg-image', `url('${url}')`);
                bgInput.value = '';
                updateBgList(settings.savedBackgrounds);
            } catch (error) {
                console.error('Failed to save background:', error);
            }
        }
    });

    // 重置背景
    bgReset.addEventListener('click', async () => {
        try {
            const settings = { savedBackgrounds: [], currentBackground: null };
            await fetch('/api/background', {
                method: 'POST',
                body: JSON.stringify(settings)
            });
            
            document.body.style.removeProperty('--bg-image');
            updateBgList([]);
            bgSettings.classList.remove('active');
        } catch (error) {
            console.error('Failed to reset background:', error);
        }
    });

    // 点击外部关闭设置面板
    document.addEventListener('click', (e) => {
        if (!bgSettings.contains(e.target) && !bgToggle.contains(e.target)) {
            bgSettings.classList.remove('active');
        }
    });
}

// 应用背景
async function applyBackground(url) {
    try {
        const response = await fetch('/api/background');
        const data = await response.json();
        const settings = data ? JSON.parse(data) : { savedBackgrounds: [] };
        
        settings.currentBackground = url;
        
        await fetch('/api/background', {
            method: 'POST',
            body: JSON.stringify(settings)
        });

        document.body.style.setProperty('--bg-image', `url('${url}')`);
    } catch (error) {
        console.error('Failed to apply background:', error);
    }
}

// 删除背景
async function deleteBackground(index) {
    try {
        const response = await fetch('/api/background');
        const data = await response.json();
        const settings = data ? JSON.parse(data) : { savedBackgrounds: [] };
        
        const deletedBg = settings.savedBackgrounds[index];
        settings.savedBackgrounds.splice(index, 1);
        
        if (deletedBg === settings.currentBackground) {
            settings.currentBackground = null;
            document.body.style.removeProperty('--bg-image');
        }
        
        await fetch('/api/background', {
            method: 'POST',
            body: JSON.stringify(settings)
        });

        const bgList = document.getElementById('bgList');
        if (bgList) {
            bgList.innerHTML = settings.savedBackgrounds.map((bg, i) => `
                <div class="bg-item">
                    <img src="${bg}" alt="背景预览" class="bg-preview">
                    <div class="bg-item-actions">
                        <button class="bg-item-btn" onclick="applyBackground('${bg}')">使用</button>
                        <button class="bg-item-btn delete" onclick="deleteBackground(${i})">删除</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to delete background:', error);
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