import { AI_CONFIG } from './config.js';
import { marked } from '../lib/marked.esm.js';
import { generatePrompt } from './utils/promptGenerator.js';
import { handleAIError } from './utils/errorHandler.js';

export class AIAssistant {
  constructor() {
    this.apiKey = AI_CONFIG.apiKey;
  }

  async generateSuggestions(type, content, jobTitle = '') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [{
            role: 'system',
            content: 'You are an expert resume writer and ATS optimization specialist. Provide specific, actionable improvements.'
          }, {
            role: 'user',
            content: generatePrompt(type, content, jobTitle)
          }],
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        suggestion: marked.parse(data.choices[0].message.content),
        original: content
      };
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      throw error;
    }
  }

  async analyzeResume(resumeData) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [{
            role: 'system',
            content: 'You are an expert resume analyzer. Provide a detailed analysis of the resume focusing on ATS optimization, content strength, and improvement suggestions.'
          }, {
            role: 'user',
            content: `Analyze this resume data and provide specific improvements:\n\n${JSON.stringify(resumeData)}`
          }],
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return marked.parse(data.choices[0].message.content);
    } catch (error) {
      const errorMessage = handleAIError(error, 'analysis');
      throw new Error(errorMessage);
    }
  }
}