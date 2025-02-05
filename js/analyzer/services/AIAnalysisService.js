import { OpenAIService } from '../../ai/services/OpenAIService.js';

export class AIAnalysisService {
  constructor() {
    this.openAIService = new OpenAIService();
  }

  async analyzeResume(resumeData) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert resume analyzer. Analyze the resume content and provide specific improvements.
                 Focus on:
                 1. Impact and clarity of statements
                 2. Use of action verbs
                 3. Quantifiable achievements
                 4. ATS optimization
                 5. Professional tone and formatting
                 
                 For each section, provide:
                 1. A score out of 100
                 2. Specific improvements marked with severity:
                    [HIGH] - Critical issues that need immediate attention
                    [MEDIUM] - Important improvements that would strengthen the resume
                    [LOW] - Minor suggestions for polish
                 
                 Format your response as follows:
                 SUMMARY:
                 Score: X/100
                 [Severity] Specific improvement suggestion
                 
                 EXPERIENCE:
                 Score: X/100
                 [Severity] Specific improvement suggestion
                 
                 EDUCATION:
                 Score: X/100
                 [Severity] Specific improvement suggestion
                 
                 SKILLS:
                 Score: X/100
                 [Severity] Specific improvement suggestion`
      },
      {
        role: 'user',
        content: `Analyze this resume data and provide specific improvements for each section:\n${JSON.stringify(resumeData, null, 2)}`
      }
    ];

    try {
      const analysis = await this.openAIService.generateCompletion(messages);
      return this.parseAnalysisResponse(analysis);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  parseAnalysisResponse(response) {
    const sections = {
      summary: this.extractSectionAnalysis(response, 'SUMMARY'),
      experience: this.extractSectionAnalysis(response, 'EXPERIENCE'),
      education: this.extractSectionAnalysis(response, 'EDUCATION'),
      skills: this.extractSectionAnalysis(response, 'SKILLS')
    };

    return {
      sections,
      overallScore: this.calculateOverallScore(sections),
      suggestions: this.extractSuggestions(response)
    };
  }

  extractSectionAnalysis(response, sectionName) {
    const sectionRegex = new RegExp(`${sectionName}:[\\s\\S]*?(?=\\n\\n|$)`);
    const match = response.match(sectionRegex);
    if (!match) return { score: 0, suggestions: [], highlights: [] };

    const content = match[0];
    const scoreMatch = content.match(/Score:\s*(\d+)\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    
    const suggestions = this.extractSuggestions(content);
    const highlights = this.extractHighlights(content);

    return {
      score,
      suggestions,
      highlights
    };
  }

  extractSuggestions(content) {
    const suggestions = [];
    const regex = /\[(HIGH|MEDIUM|LOW)\](.*?)(?=\[|\n|$)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const text = match[2].trim();
      if (text) {
        suggestions.push({
          severity: match[1].toLowerCase(),
          text: text
        });
      }
    }

    return suggestions;
  }

  extractHighlights(content) {
    const highlights = [];
    const lines = content.split('\n');

    lines.forEach(line => {
      const severityMatch = line.match(/\[(HIGH|MEDIUM|LOW)\]/);
      if (severityMatch) {
        const severity = severityMatch[1].toLowerCase();
        const text = line.replace(/\[(HIGH|MEDIUM|LOW)\]/, '').trim();
        if (text) {
          highlights.push({ text, severity });
        }
      }
    });

    return highlights;
  }

  calculateSectionScore(content) {
    const scoreMatch = content.match(/Score:\s*(\d+)\/100/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 0;
  }

  calculateOverallScore(sections) {
    const scores = Object.values(sections).map(section => section.score);
    const validScores = scores.filter(score => !isNaN(score));
    return validScores.length > 0 ? 
      Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length) : 
      0;
  }
}