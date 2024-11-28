import { AI_CONFIG } from '../config.js';

export class OpenAIService {
  constructor() {
    this.apiKey = AI_CONFIG.apiKey;
  }

  async generateCompletion(messages) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages,
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}