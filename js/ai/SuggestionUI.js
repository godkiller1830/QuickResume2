export class SuggestionUI {
  constructor(container) {
    this.container = container;
    this.createSuggestionPanel();
  }

  createSuggestionPanel() {
    const panel = document.createElement('div');
    panel.className = 'suggestion-panel';
    panel.innerHTML = `
      
   
    `;
    this.container.appendChild(panel);
    
    this.panel = panel;
    this.content = panel.querySelector('.suggestion-content');
    
    panel.querySelector('.close-suggestions').addEventListener('click', () => {
      this.hideSuggestions();
    });
  }

  showSuggestions(suggestions, type) {
    this.content.innerHTML = `
      <div class="suggestion-type">${this.getTypeLabel(type)}</div>
      <div class="suggestion-body">${suggestions}</div>
      <div class="suggestion-actions">
        <button class="apply-suggestion">Apply Suggestion</button>
        <button class="regenerate-suggestion">Regenerate</button>
      </div>
    `;
    this.panel.classList.add('active');
  }

  hideSuggestions() {
    this.panel.classList.remove('active');
  }

  getTypeLabel(type) {
    const labels = {
      summary: 'Professional Summary Suggestions',
      experience: 'Experience Enhancement',
      skills: 'Skills Analysis',
      achievement: 'Achievement Optimization'
    };
    return labels[type] || 'AI Suggestions';
  }

  onApply(callback) {
    this.content.addEventListener('click', (e) => {
      if (e.target.classList.contains('apply-suggestion')) {
        const suggestion = this.content.querySelector('.suggestion-body').textContent;
        callback(suggestion);
      }
    });
  }

  onRegenerate(callback) {
    this.content.addEventListener('click', (e) => {
      if (e.target.classList.contains('regenerate-suggestion')) {
        callback();
      }
    });
  }
}