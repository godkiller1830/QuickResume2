export class SuggestionPanel {
  constructor() {
    this.panel = null;
    this.isMinimized = false;
    this.initialize();
  }

  initialize() {
    const existingPanel = document.querySelector('.suggestion-panel');
    if (existingPanel) {
      existingPanel.remove();
    }

    this.panel = this.createPanel();
    this.setupEventListeners();
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.className = 'suggestion-panel';
    panel.innerHTML = `
      <div class="suggestion-header">
        <h3><i class="fas fa-lightbulb"></i> Resume Analysis</h3>
        <div class="panel-controls">
          <button class="minimize-suggestions" title="Minimize panel">
            <i class="fas fa-minus"></i>
          </button>
          <button class="close-suggestions" title="Close panel">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="suggestion-content"></div>
      <div class="expand-handle">
        <i class="fas fa-chevron-left"></i>
      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  setupEventListeners() {
    this.panel.querySelector('.close-suggestions').addEventListener('click', () => {
      this.hide();
    });

    this.panel.querySelector('.minimize-suggestions').addEventListener('click', () => {
      this.toggleMinimize();
    });

    // Add event listener for expand handle
    this.panel.querySelector('.expand-handle').addEventListener('click', () => {
      if (this.isMinimized) {
        this.toggleMinimize();
      }
    });

    // Handle hover effect for minimized state
    this.panel.addEventListener('mouseenter', () => {
      if (this.isMinimized) {
        this.panel.classList.add('hover-peek');
      }
    });

    this.panel.addEventListener('mouseleave', () => {
      if (this.isMinimized) {
        this.panel.classList.remove('hover-peek');
      }
    });
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.panel.classList.toggle('minimized', this.isMinimized);
    
    const minimizeBtn = this.panel.querySelector('.minimize-suggestions i');
    minimizeBtn.className = this.isMinimized ? 'fas fa-expand' : 'fas fa-minus';
    minimizeBtn.parentElement.title = this.isMinimized ? 'Expand panel' : 'Minimize panel';
  }

  show(analysis) {
    const content = `
      <div class="analysis-summary">
        <div class="score-indicator">
          Overall Score: ${analysis.overallScore}/100
        </div>
        ${this.renderSectionScores(analysis.sections)}
        ${this.renderSuggestions(analysis.sections)}
      </div>
    `;

    this.panel.querySelector('.suggestion-content').innerHTML = content;
    this.panel.classList.add('active');
    this.isMinimized = false;
    this.panel.classList.remove('minimized');
  }

  renderSectionScores(sections) {
    return `
      <div class="section-scores">
        ${Object.entries(sections).map(([name, data]) => `
          <div class="section-score">
            <span class="section-name">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
            <span class="score">${data.score}/100</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSuggestions(sections) {
    return `
      <div class="suggestions-list">
        ${Object.entries(sections).map(([sectionName, data]) => `
          <div class="section-suggestions">
            <h4>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Suggestions</h4>
            ${data.suggestions.map(suggestion => `
              <div class="suggestion-item severity-${suggestion.severity}">
                <i class="fas fa-exclamation-circle"></i>
                <span>${suggestion.text}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  hide() {
    this.panel.classList.remove('active');
  }
}