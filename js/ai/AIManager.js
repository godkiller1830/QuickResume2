import { ResumeAnalyzer } from './services/ResumeAnalyzer.js';
import { SuggestionPanel } from './components/SuggestionPanel.js';
import { PreviewManager } from '../preview.js';

export class AIManager {
  constructor(form) {
    this.form = form;
    this.analyzer = new ResumeAnalyzer();
    this.previewManager = new PreviewManager(form);
    this.suggestionPanel = new SuggestionPanel(document.body, {
      onApply: (content) => this.applySuggestion(content),
      onRegenerate: () => this.regenerateSuggestion(),
      onClose: () => this.resetCurrentField()
    });

    this.currentField = null;
    this.currentType = null;
    
    this.initializeAIButtons();
  }

  initializeAIButtons() {
    const aiFields = [
      { selector: '[name="summary"]', type: 'summary' },
      { selector: '[name="jobDescription[]"]', type: 'experience' },
      { selector: '[name="skillInput"]', type: 'skills' }
    ];

    aiFields.forEach(({ selector, type }) => {
      const fields = this.form.querySelectorAll(selector);
      fields.forEach(field => {
        if (!field.parentElement.querySelector('.ai-suggest-btn')) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'ai-suggest-btn';
          button.innerHTML = '<i class="fas fa-magic"></i>';
          button.title = 'Get AI suggestions';
          button.dataset.type = type;
          
          button.addEventListener('click', () => this.generateSuggestion(field, type));
          
          const container = field.closest('.input-group');
          if (container) {
            container.style.position = 'relative';
            container.appendChild(button);
          }
        }
      });
    });
  }

  async generateSuggestion(field, type) {
    this.currentField = field;
    this.currentType = type;
    
    try {
      const context = {
        jobTitle: this.form.querySelector('[name="professionalTitle"]')?.value
      };

      const suggestion = await this.analyzer.analyzeSection(type, field.value, context);
      this.suggestionPanel.show(suggestion, type);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      this.suggestionPanel.showError('Failed to generate suggestion. Please try again.');
    }
  }

  applySuggestion(content) {
    if (!this.currentField) return;

    this.currentField.value = content;
    this.currentField.dispatchEvent(new Event('input', { bubbles: true }));
    this.previewManager.updatePreview();
    this.suggestionPanel.hide();
  }

  async regenerateSuggestion() {
    if (this.currentField && this.currentType) {
      await this.generateSuggestion(this.currentField, this.currentType);
    }
  }

  resetCurrentField() {
    this.currentField = null;
    this.currentType = null;
  }
}