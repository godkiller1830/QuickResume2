import { marked } from '../lib/marked.esm.js';
import { AIAssistant } from './AIAssistant.js';
import { SuggestionUI } from './SuggestionUI.js';

export class AIIntegration {
  constructor(form) {
    this.form = form;
    this.aiAssistant = new AIAssistant();
    this.suggestionUI = new SuggestionUI(document.body);
    this.currentField = null;
    
    this.initializeAIButtons();
    this.setupEventListeners();
  }

  initializeAIButtons() {
    const aiFields = [
      { selector: '[name="summary"]', type: 'summary' },
      { selector: '[name="jobDescription[]"]', type: 'experience' }
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
          
          const container = field.closest('.input-group');
          if (container) {
            container.style.position = 'relative';
            container.appendChild(button);
          }
        }
      });
    });
  }

  setupEventListeners() {
    this.form.addEventListener('click', async (e) => {
      if (e.target.closest('.ai-suggest-btn')) {
        const button = e.target.closest('.ai-suggest-btn');
        const field = button.previousElementSibling;
        await this.generateSuggestion(field, button.dataset.type);
      }
    });

    this.suggestionUI.onApply((suggestion) => {
      if (this.currentField) {
        this.currentField.value = suggestion;
        this.currentField.dispatchEvent(new Event('input'));
        this.suggestionUI.hideSuggestions();
      }
    });

    this.suggestionUI.onRegenerate(() => {
      if (this.currentField) {
        this.generateSuggestion(this.currentField, this.currentField.dataset.type);
      }
    });
  }

  async generateSuggestion(field, type) {
    this.currentField = field;
    const content = field.value;
    const jobTitle = this.form.querySelector('[name="professionalTitle"]')?.value || '';

    try {
      const { suggestion } = await this.aiAssistant.generateSuggestions(type, content, jobTitle);
      this.suggestionUI.showSuggestions(suggestion, type);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      this.suggestionUI.showError('Failed to generate suggestion. Please try again.');
    }
  }
}