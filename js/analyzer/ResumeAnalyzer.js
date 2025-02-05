import { AIAnalysisService } from './services/AIAnalysisService.js';
import { AnalysisHighlighter } from './components/AnalysisHighlighter.js';
import { SuggestionPanel } from './components/SuggestionPanel.js';

export class ResumeAnalyzer {
  constructor() {
    this.aiService = new AIAnalysisService();
    this.highlighter = new AnalysisHighlighter(document.getElementById('resumePreview'));
    this.suggestionPanel = new SuggestionPanel();
    this.initializeUI();
  }

  initializeUI() {
    const scanButton = document.getElementById('scan-resume-btn');
    if (scanButton) {
      scanButton.addEventListener('click', () => this.analyze());
    }
  }

  async analyze() {
    const scanButton = document.getElementById('scan-resume-btn');
    try {
      scanButton.disabled = true;
      scanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

      const resumeData = this.extractResumeData();
      
      // Validate data before analysis
      if (!this.validateResumeData(resumeData)) {
        throw new Error('Please fill in at least some sections of your resume before analysis');
      }

      const analysis = await this.aiService.analyzeResume(resumeData);
      
      this.highlighter.highlight(analysis);
      this.suggestionPanel.show(analysis);

      scanButton.innerHTML = '<i class="fas fa-check"></i> Analysis Complete';
      setTimeout(() => {
        scanButton.disabled = false;
        scanButton.innerHTML = '<i class="fas fa-search"></i> Scan Resume';
      }, 2000);

    } catch (error) {
      console.error('Resume Analysis Error:', error);
      alert(error.message || 'Analysis failed. Please try again.');
      scanButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Analysis Failed';
      setTimeout(() => {
        scanButton.disabled = false;
        scanButton.innerHTML = '<i class="fas fa-search"></i> Scan Resume';
      }, 2000);
    }
  }

  validateResumeData(data) {
    // Check if at least some content exists
    return (
      (data.summary && data.summary.trim().length > 0) ||
      (data.experience && data.experience.some(exp => exp.description.trim().length > 0)) ||
      (data.education && data.education.some(edu => edu.degree.trim().length > 0)) ||
      (data.skills && data.skills.length > 0)
    );
  }

  extractResumeData() {
    const form = document.getElementById('resumeForm');
    if (!form) throw new Error('Resume form not found');

    const formData = new FormData(form);
    
    // Extract and clean experience data
    const experience = [];
    const jobTitles = formData.getAll('jobTitle[]');
    const companies = formData.getAll('company[]');
    const jobDescriptions = formData.getAll('jobDescription[]');
    
    for (let i = 0; i < jobTitles.length; i++) {
      if (jobTitles[i] || companies[i] || jobDescriptions[i]) {
        experience.push({
          title: jobTitles[i]?.trim() || '',
          company: companies[i]?.trim() || '',
          description: jobDescriptions[i]?.trim() || ''
        });
      }
    }

    // Extract and clean education data
    const education = [];
    const degrees = formData.getAll('degree[]');
    const schools = formData.getAll('school[]');
    const eduLocations = formData.getAll('eduLocation[]');
    
    for (let i = 0; i < degrees.length; i++) {
      if (degrees[i] || schools[i]) {
        education.push({
          degree: degrees[i]?.trim() || '',
          school: schools[i]?.trim() || '',
          location: eduLocations[i]?.trim() || ''
        });
      }
    }

    // Get skills from hidden input and clean them
    const skillsInput = document.getElementById('skillsHidden');
    const skills = skillsInput ? 
      skillsInput.value.split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0) : 
      [];

    return {
      summary: formData.get('summary')?.trim() || '',
      experience: experience,
      education: education,
      skills: skills,
      fullName: formData.get('fullName')?.trim() || '',
      professionalTitle: formData.get('professionalTitle')?.trim() || '',
      email: formData.get('email')?.trim() || '',
      phone: formData.get('phone')?.trim() || '',
      location: formData.get('location')?.trim() || ''
    };
  }
}