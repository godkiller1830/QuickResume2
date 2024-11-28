export class TipsManager {
  constructor() {
    this.tips = {
      summary: {
        title: 'Executive Summary Tips',
        tips: [
          { icon: 'fas fa-compress-alt', text: 'Be Concise: Limit your summary to 3-5 sentences that encapsulate your career highlights.' },
          { icon: 'fas fa-trophy', text: 'Highlight Achievements: Emphasize notable accomplishments and quantifiable results.' },
          { icon: 'fas fa-key', text: 'Use Keywords: Incorporate industry-specific terms to pass Applicant Tracking Systems (ATS).' },
          { icon: 'fas fa-bullseye', text: 'Tailor to the Role: Customize the summary to align with the specific job you\'re applying for.' }
        ],
        link: { text: 'Learn more about executive summaries', url: 'https://www.jobscan.co/blog/how-to-write-an-executive-summary/' }
      },
      experience: {
        title: 'Work Experience Tips',
        tips: [
          { icon: 'fas fa-sort-amount-down', text: 'Reverse Chronological Order: List your most recent position first, followed by previous roles.' },
          { icon: 'fas fa-chart-line', text: 'Quantify Achievements: Use numbers to demonstrate impact (e.g., "Increased sales by 15%").' },
          { icon: 'fas fa-running', text: 'Action-Oriented Language: Begin bullet points with strong action verbs like "Developed," "Managed," or "Implemented."' },
          { icon: 'fas fa-crosshairs', text: 'Relevance: Focus on experiences pertinent to the job you\'re targeting.' }
        ],
        link: { text: 'View Indeed\'s resume writing tips', url: 'https://www.indeed.com/career-advice/resumes-cover-letters/resume-writing-tips' }
      },
      education: {
        title: 'Education Section Tips',
        tips: [
          { icon: 'fas fa-graduation-cap', text: 'List Degrees Appropriately: Start with the highest degree earned, including institution name and graduation date.' },
          { icon: 'fas fa-award', text: 'Include Relevant Details: Mention honors, awards, and certifications that add value.' },
          { icon: 'fas fa-user-graduate', text: 'Omit High School Information: If you have post-secondary education, it\'s generally unnecessary to include high school details.' }
        ],
        link: { text: 'Read Indeed\'s guide on resume sections', url: 'https://www.indeed.com/career-advice/resumes-cover-letters/resume-sections' }
      },
      skills: {
        title: 'Skills Section Tips',
        tips: [
          { icon: 'fas fa-bullseye', text: 'Be Specific: List skills that are directly relevant to the job description.' },
          { icon: 'fas fa-layer-group', text: 'Categorize: Separate technical skills from soft skills for clarity.' },
          { icon: 'fas fa-certificate', text: 'Validate Proficiency: Include certifications or experiences that demonstrate your expertise.' }
        ],
        link: { text: 'Check Resume Genius guidelines', url: 'https://resumegenius.com/resume-formats' }
      },
      additional: {
        title: 'Additional Information Tips',
        tips: [
          { icon: 'fas fa-project-diagram', text: 'Provide Context: Briefly describe the project\'s scope and objectives.' },
          { icon: 'fas fa-user-check', text: 'Highlight Your Role: Specify your contributions and responsibilities.' },
          { icon: 'fas fa-chart-bar', text: 'Showcase Results: Mention outcomes, especially those that are quantifiable.' },
          { icon: 'fas fa-medal', text: 'Be Selective: Include only certifications and awards relevant to the position.' }
        ],
        link: { text: 'View Hiration\'s resume writing guide', url: 'https://www.hiration.com/blog/resume-executive-summary/' }
      }
    };
  }

  createTipsModal(section) {
    const sectionTips = this.tips[section];
    if (!sectionTips) return '';

    return `
      <div class="tips-modal">
        <div class="tips-header">
          <h3><i class="fas fa-lightbulb"></i> ${sectionTips.title}</h3>
          <button class="close-tips" aria-label="Close tips">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tips-content">
          ${sectionTips.tips.map(tip => `
            <div class="tip-item">
              <i class="${tip.icon}"></i>
              <span>${tip.text}</span>
            </div>
          `).join('')}
          ${sectionTips.link ? `
            <a href="${sectionTips.link.url}" target="_blank" rel="noopener noreferrer" class="tips-link">
              <i class="fas fa-external-link-alt"></i>
              ${sectionTips.link.text}
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  showTips(section) {
    const existingModal = document.querySelector('.tips-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.innerHTML = this.createTipsModal(section);
    document.body.appendChild(modal.firstElementChild);

    const closeBtn = document.querySelector('.close-tips');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.querySelector('.tips-modal').remove();
      });
    }
  }
}