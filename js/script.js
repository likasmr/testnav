// 导航数据
const navItems = [
    {
        title: "哔哩哔哩",
        url: "https://www.bilibili.com",
        description: "国内最大的二次元视频网站",
        icon: "fa-play"
    },
    {
        title: "MyAnimeList",
        url: "https://myanimelist.net",
        description: "最全面的动漫数据库",
        icon: "fa-list"
    },
    // 可以继续添加更多导航项
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 主题切换功能
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    toggleSwitch.addEventListener('change', switchTheme);

    // 渲染导航项
    renderNavItems(navItems);

    // 搜索功能
    const searchInput = document.querySelector('#search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = navItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        renderNavItems(filteredItems);
    });
});

// 主题切换函数
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// 渲染导航项函数
function renderNavItems(items) {
    const navGrid = document.querySelector('.nav-grid');
    navGrid.innerHTML = items.map(item => `
        <div class="nav-item" onclick="window.open('${item.url}', '_blank')">
            <i class="fas ${item.icon}"></i>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `).join('');
} 