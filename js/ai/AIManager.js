import { AISuggestionService } from './services/AISuggestionService.js';
import { SuggestionPanel } from './components/SuggestionPanel.js';

export class AIManager {
  constructor(form) {
    this.form = form;
    this.suggestionService = new AISuggestionService();
    this.suggestionPanel = new SuggestionPanel(
      (content, type, elementId) => this.applySuggestion(content, type, elementId),
      (type, elementId) => this.regenerateSuggestion(type, elementId)
    );
    
    this.currentField = null;
    this.currentType = null;
    this.currentElementId = null;

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
        const container = field.closest('.input-group');
        if (!container) return;

        // Remove existing AI button if any
        const existingButton = container.querySelector('.ai-suggest-btn');
        if (existingButton) {
          existingButton.remove();
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ai-suggest-btn';
        button.innerHTML = '<i class="fas fa-magic"></i>';
        button.title = 'Get AI suggestions';
        
        button.addEventListener('click', () => this.generateSuggestion(field, type));
        
        container.style.position = 'relative';
        container.appendChild(button);
      });
    });
  }

  async generateSuggestion(field, type) {
    this.currentField = field;
    this.currentType = type;
    this.currentElementId = field.id;
    
    try {
      const content = field.value;
      const jobTitle = this.form.querySelector('[name="professionalTitle"]')?.value;
      
      const suggestion = await this.suggestionService.generateSuggestion(type, content, { jobTitle });
      this.suggestionPanel.show(suggestion, type, field.id);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      this.suggestionPanel.showError('Failed to generate suggestion. Please try again.');
    }
  }

  applySuggestion(content, type, elementId) {
    if (!elementId) return;

    if (type === 'skills') {
      const skillsManager = window.skillsManager;
      const skills = content.split(',').map(skill => skill.trim());
      skills.forEach(skill => skillsManager.addSkill(skill));
    } else {
      const editor = tinymce.get(elementId);
      if (editor) {
        editor.setContent(content);
        editor.save();
      }
    }
  }

  async regenerateSuggestion(type, elementId) {
    const field = document.getElementById(elementId);
    if (field) {
      await this.generateSuggestion(field, type);
    }
  }
}