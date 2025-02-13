document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.querySelector('.theme-switch');
    const body = document.body;
    
    // 从localStorage获取主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateThemeIcon(savedTheme === 'light-theme');
    }

    // 主题切换功能
    themeSwitch.addEventListener('click', () => {
        const isLight = body.classList.contains('light-theme');
        body.className = isLight ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', body.className);
        updateThemeIcon(!isLight);
    });

    // 更新主题图标
    function updateThemeIcon(isLight) {
        const icon = themeSwitch.querySelector('i');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 搜索功能
    const searchInput = document.getElementById('search');
    const navItems = document.querySelectorAll('.nav-item');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // 背景设置功能
    const bgSwitch = document.querySelector('.bg-switch');
    const bgModal = document.getElementById('bgModal');
    const closeModal = document.querySelector('.close-modal');
    const bgUrl = document.getElementById('bgUrl');
    const bgOpacity = document.getElementById('bgOpacity');
    const saveBgBtn = document.getElementById('saveBg');

    // 加载保存的背景设置
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        const bgSettings = JSON.parse(savedBg);
        document.body.style.setProperty('--bg-image', `url(${bgSettings.url})`);
        document.body.style.setProperty('--bg-opacity', bgSettings.opacity);
        bgUrl.value = bgSettings.url;
        bgOpacity.value = bgSettings.opacity;
    }

    bgSwitch.addEventListener('click', () => {
        bgModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        bgModal.style.display = 'none';
    });

    saveBgBtn.addEventListener('click', () => {
        const settings = {
            url: bgUrl.value,
            opacity: bgOpacity.value
        };
        localStorage.setItem('background', JSON.stringify(settings));
        
        document.body.style.setProperty('--bg-image', `url(${settings.url})`);
        document.body.style.setProperty('--bg-opacity', settings.opacity);
        
        bgModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === bgModal) {
            bgModal.style.display = 'none';
        }
    });
}); 