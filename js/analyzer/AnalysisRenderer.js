export class AnalysisRenderer {
  constructor() {
    this.preview = document.getElementById('resumePreview');
    this.setupStyles();
  }

  setupStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .highlight-high {
        background-color: rgba(239, 68, 68, 0.2);
        border-bottom: 2px solid #ef4444;
        cursor: pointer;
        position: relative;
      }

      .highlight-medium {
        background-color: rgba(245, 158, 11, 0.2);
        border-bottom: 2px solid #f59e0b;
        cursor: pointer;
        position: relative;
      }

      .highlight-low {
        background-color: rgba(59, 130, 246, 0.2);
        border-bottom: 2px solid #3b82f6;
        cursor: pointer;
        position: relative;
      }

      .suggestion-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #1f2937;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 50;
        display: none;
      }

      .highlight-high:hover .suggestion-tooltip,
      .highlight-medium:hover .suggestion-tooltip,
      .highlight-low:hover .suggestion-tooltip {
        display: block;
      }

      .analysis-summary {
        position: fixed;
        top: 6rem;
        right: 1rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        width: 300px;
        z-index: 40;
      }

      .dark .analysis-summary {
        background: #1f2937;
        color: #e5e7eb;
      }

      .score-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 1rem 0;
      }

      .improvement-list {
        margin-top: 1rem;
      }

      .improvement-item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(styleElement);
  }

  renderAnalysis(analysis) {
    this.clearHighlights();
    this.highlightSections(analysis.sections);
    this.renderAnalysisSummary(analysis);
  }

  clearHighlights() {
    if (!this.preview) return;
    
    const highlightedElements = this.preview.querySelectorAll(
      '.highlight-high, .highlight-medium, .highlight-low'
    );
    
    highlightedElements.forEach(element => {
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
    });
  }

  highlightSections(sections) {
    Object.entries(sections).forEach(([sectionName, sectionData]) => {
      const sectionElement = this.findSectionElement(sectionName);
      if (sectionElement && sectionData.highlights) {
        this.highlightContent(sectionElement, sectionData.highlights);
      }
    });
  }

  findSectionElement(sectionName) {
    // Find the corresponding section in the preview
    const sectionMap = {
      summary: '.about',
      experience: '#experienceSection',
      education: '#educationSection',
      skills: '#skillsSection'
    };

    return this.preview?.querySelector(sectionMap[sectionName]);
  }

  highlightContent(element, highlights) {
    highlights.forEach(highlight => {
      const text = element.innerHTML;
      const highlightedText = this.createHighlightedElement(
        highlight.text,
        highlight.severity,
        highlight.suggestion
      );
      element.innerHTML = text.replace(
        new RegExp(highlight.text, 'g'),
        highlightedText
      );
    });
  }

  createHighlightedElement(text, severity, suggestion) {
    return `
      
    `;
  }

  renderAnalysisSummary(analysis) {
    const existingSummary = document.querySelector('.analysis-summary');
    if (existingSummary) {
      existingSummary.remove();
    }

    const summary = document.createElement('div');
    summary.className = 'analysis-summary';
    summary.innerHTML = `
      <h3 class="text-lg font-semibold">Resume Analysis</h3>
      <div class="score-indicator">
        Score: ${analysis.overallScore}/100
      </div>
      <div class="improvement-list">
        <h4 class="font-medium mb-2">Key Improvements:</h4>
        ${analysis.improvements.map(improvement => `
          <div class="improvement-item">
            <i class="fas fa-check-circle text-blue-500"></i>
            <span>${improvement}</span>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(summary);
  }
}