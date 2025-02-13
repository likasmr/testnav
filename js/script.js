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

    // 背景设置相关
    const settingsBtn = document.querySelector('.floating-settings');
    const settingsPanel = document.querySelector('.settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    const bgInput = document.getElementById('bgInput');
    const setBgBtn = document.getElementById('setBg');
    const blurRange = document.getElementById('blurRange');
    const dimRange = document.getElementById('dimRange');
    const backgroundOverlay = document.querySelector('.background-overlay');

    // 从localStorage获取背景设置
    const savedBg = localStorage.getItem('background');
    const savedBlur = localStorage.getItem('blur');
    const savedDim = localStorage.getItem('dim');

    if (savedBg) {
        backgroundOverlay.style.backgroundImage = `url(${savedBg})`;
    }
    if (savedBlur) {
        document.documentElement.style.setProperty('--blur-amount', `${savedBlur}px`);
        blurRange.value = savedBlur;
    }
    if (savedDim) {
        document.documentElement.style.setProperty('--dim-amount', savedDim);
        dimRange.value = savedDim * 100;
    }

    // 设置面板开关
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('active');
    });

    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });

    // 设置背景
    setBgBtn.addEventListener('click', () => {
        const url = bgInput.value;
        if (url) {
            backgroundOverlay.style.backgroundImage = `url(${url})`;
            localStorage.setItem('background', url);
        }
    });

    // 模糊度调节
    blurRange.addEventListener('input', (e) => {
        const blur = e.target.value;
        document.documentElement.style.setProperty('--blur-amount', `${blur}px`);
        localStorage.setItem('blur', blur);
    });

    // 暗度调节
    dimRange.addEventListener('input', (e) => {
        const dim = e.target.value / 100;
        document.documentElement.style.setProperty('--dim-amount', dim);
        localStorage.setItem('dim', dim);
    });

    // 点击外部关闭设置面板
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });
}); 