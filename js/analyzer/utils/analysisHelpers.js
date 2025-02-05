export function calculateSeverity(text, feedback) {
  if (!text || !feedback) return null;

  const lowImpact = ['consider', 'might', 'could'];
  const highImpact = ['critical', 'essential', 'must', 'important'];
  
  text = text.toLowerCase();
  feedback = feedback.toLowerCase();

  if (feedback.includes('[high]') || highImpact.some(word => feedback.includes(word))) {
    return 'high';
  }
  if (feedback.includes('[medium]')) {
    return 'medium';
  }
  if (feedback.includes('[low]') || lowImpact.some(word => feedback.includes(word))) {
    return 'low';
  }
  return null;
}

export function calculateScore(feedback) {
  if (!feedback) return 0;

  const issues = {
    high: (feedback.match(/\[HIGH\]/gi) || []).length,
    medium: (feedback.match(/\[MEDIUM\]/gi) || []).length,
    low: (feedback.match(/\[LOW\]/gi) || []).length
  };

  const baseScore = 100;
  const deductions = {
    high: 10,
    medium: 5,
    low: 2
  };

  return Math.max(0, Math.min(100,
    baseScore - 
    (issues.high * deductions.high) -
    (issues.medium * deductions.medium) -
    (issues.low * deductions.low)
  ));
}

export function extractSuggestions(feedback) {
  if (!feedback) return [];

  return feedback.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*\[(HIGH|MEDIUM|LOW)\]\s*/i, '').trim())
    .filter(line => line.length > 0);
}