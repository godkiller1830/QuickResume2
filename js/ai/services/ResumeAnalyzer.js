import { OpenAIService } from './OpenAIService.js';

export class ResumeAnalyzer {
  constructor() {
    this.openAIService = new OpenAIService();
  }

  async analyzeSection(type, content, context = {}) {
    const messages = this.constructPrompt(type, content, context);
    try {
      const suggestion = await this.openAIService.generateCompletion(messages);
      return this.formatSuggestion(suggestion);
    } catch (error) {
      throw new Error(`Failed to analyze ${type}: ${error.message}`);
    }
  }

  constructPrompt(type, content, context) {
    const basePrompt = {
      summary: "Enhance this professional summary to be more impactful and ATS-friendly:",
      experience: "Improve this job experience description with quantifiable achievements:",
      skills: "Analyze and enhance these skills with industry-relevant keywords:",
      education: "Optimize this education section for better presentation:"
    };

    return [
      {
        role: 'system',
        content: `You are an expert resume writer specializing in ${type} optimization. 
                 Focus on: ATS-friendly keywords, quantifiable achievements, and professional tone.
                 Keep suggestions clear, concise, and impactful.`
      },
      {
        role: 'user',
        content: `${basePrompt[type]}\n\nContent: ${content}\n${
          context.jobTitle ? `Target Job Title: ${context.jobTitle}` : ''
        }`
      }
    ];
  }

  formatSuggestion(suggestion) {
    return suggestion.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/\n{3,}/g, '\n\n'); // Normalize spacing
  }
}