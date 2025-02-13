document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // 从localStorage读取主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });
}); 