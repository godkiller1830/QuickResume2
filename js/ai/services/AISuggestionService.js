import { OpenAIService } from './OpenAIService.js';
import { AIPromptService } from './AIPromptService.js';

export class AISuggestionService {
  constructor() {
    this.openAIService = new OpenAIService();
  }

  async generateSuggestion(type, content, context = {}) {
    try {
      let messages = [this.getPrompt(type, content, context.jobTitle)];
      const suggestion = await this.openAIService.generateCompletion(messages);
      return this.formatSuggestion(suggestion, type);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      throw new Error('Failed to generate suggestion');
    }
  }

  getPrompt(type, content, jobTitle) {
    switch (type) {
      case 'summary':
        return AIPromptService.getSummaryPrompt(content, jobTitle);
      case 'experience':
        return AIPromptService.getExperiencePrompt(content, jobTitle);
      case 'skills':
        return AIPromptService.getSkillsPrompt(content, jobTitle);
      default:
        throw new Error('Invalid suggestion type');
    }
  }

  formatSuggestion(suggestion, type) {
    const cleanedSuggestion = suggestion.trim().replace(/^["']|["']$/g, '');
    
    if (type === 'skills') {
      return cleanedSuggestion.split(',').map(skill => skill.trim());
    }
    
    return cleanedSuggestion;
  }
}