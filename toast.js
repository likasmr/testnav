class Toast {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    show(message, type = 'info') {
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
        
        toast.innerHTML = `
            <div class="toast-icon">${this.getIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        container.appendChild(toast);

        await new Promise(resolve => setTimeout(resolve, 100));
        toast.classList.add('show');

        await new Promise(resolve => setTimeout(resolve, 3000));
        if (toast.parentElement) {
            toast.classList.add('hide');
            await new Promise(resolve => setTimeout(resolve, 300));
            toast.remove();
        }
    }

    getIcon(type) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>`,
            error: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>`,
            info: `<svg viewBox="0 0 24 24" width="22" height="22">
                        <path fill="currentColor" d="M13 9h-2V7h2v2zm0 8h-2v-6h2v6z"/>
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