class Toast {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    show(message, type = 'info') {
        // 添加到队列
        this.queue.push({ message, type });
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const { message, type } = this.queue.shift();
        await this.createToast(message, type);
        this.processQueue();
    }

    async createToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);

        // 动画显示
        await new Promise(resolve => setTimeout(resolve, 100));
        toast.classList.add('show');

        // 进度条动画
        const progress = toast.querySelector('.toast-progress');
        progress.style.width = '0%';

        // 等待动画完成后移除
        await new Promise(resolve => setTimeout(resolve, 3000));
        toast.classList.add('hide');
        await new Promise(resolve => setTimeout(resolve, 300));
        container.removeChild(toast);
    }

    getIcon(type) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>`,
            error: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                    </svg>`,
            info: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>`
        };
        return icons[type] || icons.info;
    }
}

// 创建全局实例
const toast = new Toast();

// 导出便捷方法
function showToast(message, type = 'info') {
    toast.show(message, type);
}

async function processToastQueue() {
    if (toast.queue.length === 0 || toast.isProcessing) return;
    
    toast.isProcessing = true;
    const { message, type } = toast.queue.shift();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${toast.getIcon(type)}</span>
            <span class="toast-message">${message}</span>
        </div>
        <div class="toast-progress"></div>
    `;

    document.body.appendChild(toast);
    
    // 强制重排以触发动画
    toast.offsetHeight;
    toast.classList.add('show');
    
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.classList.remove('show');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    document.body.removeChild(toast);
    toast.isProcessing = false;
    
    // 处理队列中的下一个 toast
    processToastQueue();
}

function getIconForType(type) {
    switch (type) {
        case 'success':
            return '✓';
        case 'error':
            return '✕';
        case 'warning':
            return '⚠';
        default:
            return 'ℹ';
    }
} 