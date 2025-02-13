// 密码验证逻辑
const PASSWORD_HASH = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'; // 用实际密码生成

function checkPassword() {
    const input = CryptoJS.SHA256(document.getElementById('password').value).toString();
    if(input === PASSWORD_HASH) {
        localStorage.setItem('authenticated', 'true');
        initApp();
    } else {
        alert('密码错误');
    }
}

// 主题切换
function toggleTheme() {
    document.body.dataset.theme = 
        document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
}

// 初始化应用
function initApp() {
    // 加载导航数据
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderCategories(data));

    // 应用主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;

    // 切换显示内容
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
}

// 首次加载检查认证状态
if(localStorage.getItem('authenticated') === 'true') {
    initApp();
} 