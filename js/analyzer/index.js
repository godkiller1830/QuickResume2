import { ResumeAnalyzer } from './ResumeAnalyzer.js';

export function initializeResumeAnalyzer(form) {
  const analyzer = new ResumeAnalyzer();
  const scanButton = document.querySelector('.scan-resume-btn');

  if (!scanButton) return;

  scanButton.addEventListener('click', async () => {
    try {
      scanButton.disabled = true;
      scanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

      const resumeData = extractResumeData(form);
      await analyzer.analyzeResume(resumeData);

      scanButton.innerHTML = '<i class="fas fa-check"></i> Analysis Complete';
      setTimeout(() => {
        scanButton.innerHTML = '<i class="fas fa-search"></i> Scan Resume';
        scanButton.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Resume Analysis Error:', error);
      scanButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Analysis Failed';
      alert('Failed to analyze resume. Please try again.');
      
      setTimeout(() => {
        scanButton.innerHTML = '<i class="fas fa-search"></i> Scan Resume';
        scanButton.disabled = false;
      }, 2000);
    }
  });
}

function extractResumeData(form) {
  const formData = new FormData(form);
  
  return {
    summary: formData.get('summary') || '',
    experience: Array.from(formData.getAll('jobDescription[]')).map((description, index) => ({
      title: formData.getAll('jobTitle[]')[index] || '',
      company: formData.getAll('company[]')[index] || '',
      description: description || ''
    })),
    education: Array.from(formData.getAll('degree[]')).map((degree, index) => ({
      degree: degree || '',
      school: formData.getAll('school[]')[index] || '',
      location: formData.getAll('eduLocation[]')[index] || ''
    })),
    skills: document.getElementById('skillsHidden')?.value.split(',').filter(Boolean) || []
  };
}