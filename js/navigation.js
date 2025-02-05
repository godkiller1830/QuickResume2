import { TipsManager } from './tips/TipsManager.js';

export class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('.form-section');
    this.progressSteps = document.querySelectorAll('.progress-step');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentSection = 1;
    this.tipsManager = new TipsManager();

    this.initializeEventListeners();
    this.addTipsButtons();
  }

  initializeEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate('prev'));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate('next'));
    }
  }

  addTipsButtons() {
    this.sections.forEach(section => {
      const sectionType = this.getSectionType(section);
      if (sectionType) {
        const container = section.querySelector('.form-group');
        if (container) {
          const tipsBtn = document.createElement('button');
          tipsBtn.type = 'button';
          tipsBtn.className = 'show-tips-btn';
          tipsBtn.innerHTML = '<i class="fas fa-lightbulb"></i>';
          tipsBtn.title = 'Show section tips';
          
          tipsBtn.addEventListener('click', () => {
            this.tipsManager.showTips(sectionType);
          });
          
          container.style.position = 'relative';
          container.appendChild(tipsBtn);
        }
      }
    });
  }

  getSectionType(section) {
    const sectionNumber = section.dataset.section;
    const types = {
      '5': 'summary',
      '2': 'experience',
      '3': 'education',
      '4': 'skills',
      '6': 'additional'
    };
    return types[sectionNumber];
  }

  navigate(direction) {
    if (direction === 'next' && this.currentSection < 6) {
      this.currentSection++;
      this.showSection(this.currentSection);
    } else if (direction === 'prev' && this.currentSection > 1) {
      this.currentSection--;
      this.showSection(this.currentSection);
    }
  }

  showSection(sectionNumber) {
    this.sections.forEach(section => section.classList.remove('active'));
    this.progressSteps.forEach(step => step.classList.remove('active'));
    
    const activeSection = document.querySelector(`[data-section="${sectionNumber}"]`);
    const activeStep = document.querySelector(`[data-step="${sectionNumber}"]`);
    
    if (activeSection) activeSection.classList.add('active');
    if (activeStep) activeStep.classList.add('active');
    
    if (this.prevBtn) {
      this.prevBtn.style.display = sectionNumber === 1 ? 'none' : 'block';
    }
    if (this.nextBtn) {
      this.nextBtn.textContent = sectionNumber === 6 ? 'Finish' : 'Next';
    }
  }
}