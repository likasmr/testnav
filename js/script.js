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

    // 自定义背景功能
    const customizeToggle = document.querySelector('.customize-toggle');
    const customizePanel = document.querySelector('.customize-panel');
    const bgUrlInput = document.getElementById('bgUrl');
    const setBgButton = document.getElementById('setBg');
    const blurRange = document.getElementById('blurRange');
    const backgroundOverlay = document.querySelector('.background-overlay');
    const presets = document.querySelectorAll('.preset');

    // 从localStorage获取背景设置
    const savedBg = localStorage.getItem('background');
    const savedBlur = localStorage.getItem('blur');
    
    if (savedBg) {
        backgroundOverlay.style.backgroundImage = `url(${savedBg})`;
    }
    
    if (savedBlur) {
        document.documentElement.style.setProperty('--blur-amount', `${savedBlur}px`);
        blurRange.value = savedBlur;
    }

    // 切换自定义面板
    customizeToggle.addEventListener('click', () => {
        customizePanel.classList.toggle('active');
    });

    // 设置自定义背景
    setBgButton.addEventListener('click', () => {
        const url = bgUrlInput.value;
        if (url) {
            setBackground(url);
        }
    });

    // 背景模糊度调整
    blurRange.addEventListener('input', (e) => {
        const blur = e.target.value;
        document.documentElement.style.setProperty('--blur-amount', `${blur}px`);
        localStorage.setItem('blur', blur);
    });

    // 预设背景点击事件
    presets.forEach(preset => {
        // 设置预设背景的预览图
        const bgUrl = preset.dataset.bg;
        preset.style.backgroundImage = `url(${bgUrl})`;
        
        preset.addEventListener('click', () => {
            setBackground(bgUrl);
        });
    });

    function setBackground(url) {
        backgroundOverlay.style.backgroundImage = `url(${url})`;
        localStorage.setItem('background', url);
    }
}); 