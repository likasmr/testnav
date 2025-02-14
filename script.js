// 动态加载链接配置
const linksConfig = {
    "常用网站": [
        { name: "GitHub", icon: "fab fa-github", url: "https://github.com" },
        // 更多链接...
    ],
    // 更多分类...
};

function initLinks() {
    // 动态生成链接卡片
}

// 谷歌搜索功能
function performSearch() {
    const query = document.getElementById('search').value;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
}

// 页面加载完成后初始化
window.onload = () => {
    initLinks();
    // 添加星空背景动画
}; 