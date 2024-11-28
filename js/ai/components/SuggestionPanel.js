export class SuggestionPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onApply: () => {},
      onRegenerate: () => {},
      onClose: () => {},
      ...options
    };
    
    this.panel = this.createPanel();
    this.setupEventListeners();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'suggestion-panel';
    panel.innerHTML = `
      <div class="suggestion-header">
        <h3><i class="fas fa-robot"></i> AI Assistant</h3>
        <button class="close-suggestions" aria-label="Close suggestions">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="suggestion-content"></div>
    `;
    this.container.appendChild(panel);
    return panel;
  }

  setupEventListeners() {
    this.panel.querySelector('.close-suggestions').addEventListener('click', () => {
      this.hide();
      this.options.onClose();
    });

    this.panel.addEventListener('click', (e) => {
      if (e.target.classList.contains('apply-suggestion')) {
        const content = this.panel.querySelector('.suggestion-body').textContent;
        this.options.onApply(content);
      } else if (e.target.classList.contains('regenerate-suggestion')) {
        this.options.onRegenerate();
      }
    });
  }

  show(suggestion, type) {
    this.panel.querySelector('.suggestion-content').innerHTML = `
      <div class="suggestion-type">${this.getTypeLabel(type)}</div>
      <div class="suggestion-body">${suggestion}</div>
      <div class="suggestion-actions">
        <button class="apply-suggestion">
          <i class="fas fa-check"></i> Apply Suggestion
        </button>
        <button class="regenerate-suggestion">
          <i class="fas fa-sync-alt"></i> Regenerate
        </button>
      </div>
    `;
    this.panel.classList.add('active');
  }

  hide() {
    this.panel.classList.remove('active');
  }

  showError(message) {
    this.panel.querySelector('.suggestion-content').innerHTML = `
      <div class="suggestion-error">
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
      </div>
    `;
    this.panel.classList.add('active');
  }

  getTypeLabel(type) {
    const labels = {
      summary: 'Professional Summary Enhancement',
      experience: 'Experience Optimization',
      skills: 'Skills Analysis',
      education: 'Education Section Improvement'
    };
    return labels[type] || 'AI Suggestions';
  }
}