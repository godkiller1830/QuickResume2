export class SuggestionPanel {
  constructor(onApply, onRegenerate) {
    this.onApply = onApply;
    this.onRegenerate = onRegenerate;
    this.panel = null;
    this.currentType = null;
    this.currentElementId = null;
  }

  show(suggestion, type, elementId) {
    if (this.panel) {
      this.hide();
    }

    this.currentType = type;
    this.currentElementId = elementId;
    this.panel = this.createPanel(suggestion, type);
    document.body.appendChild(this.panel);
    
    setTimeout(() => {
      this.panel.classList.add('active');
    }, 10);

    this.setupEventListeners();
  }

  createPanel(suggestion, type) {
    const panel = document.createElement('div');
    panel.className = 'suggestion-panel';
    panel.innerHTML = `
      <div class="suggestion-header">
        <h3><i class="fas fa-magic"></i> AI Suggestion</h3>
        <div class="panel-controls">
          <button class="close-suggestions" title="Close panel">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="suggestion-content">
        <div class="suggestion-type">${this.getTypeLabel(type)}</div>
        <div class="suggestion-body">
          ${this.formatSuggestionContent(suggestion, type)}
        </div>
        <div class="suggestion-actions">
          <button class="apply-suggestion">
            <i class="fas fa-check"></i> Apply Suggestion
          </button>
          <button class="regenerate-suggestion">
            <i class="fas fa-redo"></i> Regenerate
          </button>
        </div>
      </div>
    `;
    return panel;
  }

  setupEventListeners() {
    this.panel.querySelector('.close-suggestions').addEventListener('click', () => this.hide());
    
    this.panel.querySelector('.apply-suggestion').addEventListener('click', () => {
      const content = this.panel.querySelector('.suggestion-body').textContent;
      this.onApply(content, this.currentType, this.currentElementId);
      this.hide();
    });

    this.panel.querySelector('.regenerate-suggestion').addEventListener('click', () => {
      this.onRegenerate(this.currentType, this.currentElementId);
    });
  }

  formatSuggestionContent(suggestion, type) {
    if (type === 'skills' && Array.isArray(suggestion)) {
      return suggestion.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    }
    return suggestion;
  }

  getTypeLabel(type) {
    const labels = {
      summary: 'Professional Summary Enhancement',
      experience: 'Experience Description Improvement',
      skills: 'Skills Optimization'
    };
    return labels[type] || 'AI Suggestion';
  }

  showError(message) {
    if (!this.panel) {
      this.show('', 'error');
    }
    
    const content = this.panel.querySelector('.suggestion-content');
    content.innerHTML = `
      <div class="suggestion-error">
        <i class="fas fa-exclamation-circle"></i>
        ${message}
      </div>
    `;
  }

  hide() {
    if (this.panel) {
      this.panel.classList.remove('active');
      setTimeout(() => {
        this.panel.remove();
        this.panel = null;
      }, 300);
    }
  }
}