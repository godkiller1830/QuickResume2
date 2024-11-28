export function handleAIError(error, type = 'general') {
  console.error(`AI ${type} Error:`, error);
  
  const errorMessages = {
    network: 'Network error. Please check your connection and try again.',
    api: 'Error communicating with AI service. Please try again later.',
    general: 'An error occurred. Please try again.'
  };

  return errorMessages[error.type] || errorMessages.general;
}