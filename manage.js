// 检查登录状态
let authToken = null;

async function checkAuth() {
    const savedAuth = localStorage.getItem('authToken');
    if (savedAuth) {
        const { token, expiresAt } = JSON.parse(savedAuth);
        if (Date.now() < expiresAt) {
            authToken = token;
            return;
        }
    }
    window.location.href = '/login.html';
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    loadLinks();
    
    // 处理新建分类的显示/隐藏
    document.getElementById('linkCategory').addEventListener('change', function() {
        document.getElementById('newCategory').style.display = 
            this.value === 'new' ? 'block' : 'none';
    });
});

// 其他函数从script.js中移动过来...
// 包括：loadLinks, addLink, editLink, deleteLink, fetchSiteInfo等 