export class AIPromptService {
    static getSummaryPrompt(content, jobTitle) {
      return {
        role: 'system',
        content: `As an expert resume writer, enhance this professional summary for a ${jobTitle || 'professional'} role.
        
        Guidelines:
        - Keep it concise (3-4 sentences)
        - Focus on quantifiable achievements
        - Use strong action verbs
        - Incorporate relevant industry keywords
        - Maintain ATS-friendly formatting
        - Highlight unique value proposition
        
        Original summary:
        ${content}
        
        Provide only the enhanced summary without any explanations or additional text.`
      };
    }
  
    static getExperiencePrompt(content, jobTitle) {
      return {
        role: 'system',
        content: `As an expert resume writer, enhance this job experience description for a ${jobTitle || 'professional'} role.
        
        Guidelines:
        - Start with strong action verbs
        - Include specific metrics and achievements
        - Focus on relevant responsibilities
        - Use industry-standard terminology
        - Maintain professional tone
        - Highlight leadership and initiative
        - Keep each bullet point concise
        
        Original description:
        ${content}
        
        Provide only the enhanced description without any explanations or additional text.`
      };
    }
  
    static getSkillsPrompt(content, jobTitle) {
      return {
        role: 'system',
        content: `As an expert resume writer, analyze and enhance these skills for a ${jobTitle || 'professional'} role.
        
        Guidelines:
        - Use industry-standard terminology
        - Include both technical and soft skills
        - Focus on relevant and in-demand skills
        - Maintain ATS-friendly formatting
        - Prioritize skills based on job relevance
        
        Current skills:
        ${content}
        
        Provide only a comma-separated list of enhanced skills without any explanations or additional text.`
      };
    }
  }