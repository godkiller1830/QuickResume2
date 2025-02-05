export class ToastService {
    constructor() {
      this.container = this.createContainer();
      this.toasts = new Map();
      this.counter = 0;
    }
  
    createContainer() {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
      return container;
    }
  
    show(options) {
      const { type = 'info', title, message, duration = 3000 } = options;
      const id = `toast-${++this.counter}`;
  
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <i class="toast-icon fas ${this.getIconClass(type)}"></i>
        <div class="toast-content">
          ${title ? `<div class="toast-title">${title}</div>` : ''}
          ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      `;
  
      this.container.appendChild(toast);
      this.toasts.set(id, toast);
  
      // Setup close button
      toast.querySelector('.toast-close').addEventListener('click', () => {
        this.hide(id);
      });
  
      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.hide(id);
        }, duration);
      }
  
      return id;
    }
  
    hide(id) {
      const toast = this.toasts.get(id);
      if (toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
          toast.remove();
          this.toasts.delete(id);
        }, 300);
      }
    }
  
    getIconClass(type) {
      switch (type) {
        case 'success':
          return 'fa-check-circle';
        case 'error':
          return 'fa-exclamation-circle';
        case 'info':
        default:
          return 'fa-info-circle';
      }
    }
  }