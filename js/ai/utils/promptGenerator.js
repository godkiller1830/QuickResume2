export function generatePrompt(type, content, jobTitle = '') {
  const baseInstructions = `
    Custom Instructions:
    - Be an expert on all subject matters
    - Provide accurate and factual answers
    - Be highly organized
    - Write short sentences
    - Avoid multiple thoughts in one sentence
    - Use 1–2 breakpoints to space out content
    - Avoid 3+ sentence paragraphs
    - Avoid flowery language
    - Be clear and concise
    - Focus on action-oriented content
    - Ensure output is less than 300 characters
    - Format similar to professional examples
    - Make content compelling and action-oriented
    - Include key skills in bold
  `;

  const prompts = {
    summary: `${baseInstructions}\n\nAs an ATS-focused resume expert, create a professional summary that:\n1. Is clear, concise, and action-oriented\n2. Highlights key achievements and skills\n3. Is optimized for ATS systems\n4. Includes relevant keywords for ${jobTitle || 'the role'}\n5. Follows professional executive summary format\n\nCurrent content:\n${content}`,
    experience: `${baseInstructions}\n\nEnhance this job experience description to be more impactful and ATS-friendly. Focus on quantifiable achievements and relevant skills for ${jobTitle || 'the role'}:\n\n${content}`,
    skills: `${baseInstructions}\n\nAnalyze these skills and suggest additional relevant ones that are commonly sought after for ${jobTitle || 'the role'}. Current skills:\n\n${content}`,
    achievement: `${baseInstructions}\n\nTransform this achievement into a powerful, metrics-driven statement using the STAR method (Situation, Task, Action, Result):\n\n${content}`
  };

  return prompts[type] || '';
}