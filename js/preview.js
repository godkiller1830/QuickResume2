import { isEmptySection } from './utils/previewUtils.js';

export class PreviewManager {
  constructor(form) {
    this.form = form;
    this.preview = document.getElementById('resumePreview');
    this.initializeTemplateSelection();
  }

  initializeTemplateSelection() {
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
      const urlParams = new URLSearchParams(window.location.search);
      const templateParam = urlParams.get('template');
      
      if (templateParam) {
        templateSelect.value = templateParam;
      }
      
      this.loadTemplateStyle(templateSelect.value);
      
      templateSelect.addEventListener('change', (event) => {
        this.loadTemplateStyle(event.target.value);
      });
    }
  }

  loadTemplateStyle(templateName) {
    document.querySelectorAll('.template-style').forEach(style => style.remove());
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/template-${templateName}.css`;
    link.classList.add('template-style');
    document.head.appendChild(link);
    this.updatePreview();
  }

  updatePreview() {
    if (!this.preview) return;

    const formData = new FormData(this.form);
    const template = document.getElementById('templateSelect')?.value || 'default';

    // Get section data
    const experienceData = this.getExperienceData(formData);
    const educationData = this.getEducationData(formData);
    const skillsData = document.getElementById('skillsHidden')?.value || '';
    const additionalData = this.getAdditionalData(formData);

    // Generate template HTML based on non-empty sections
    let templateHTML = '';
    if (template === 'elegant') {
      templateHTML = this.generateElegantTemplate(formData, experienceData, educationData, skillsData, additionalData);
    } else if (template === 'modern') {
      templateHTML = this.generateModernTemplate(formData, experienceData, educationData, skillsData, additionalData);
    } else {
      templateHTML = this.generateDefaultTemplate(formData, experienceData, educationData, skillsData, additionalData);
    }

    this.preview.innerHTML = templateHTML;
  }

  getExperienceData(formData) {
    const jobTitles = formData.getAll('jobTitle[]');
    const companies = formData.getAll('company[]');
    const locations = formData.getAll('location[]');
    const startDates = formData.getAll('startDate[]');
    const endDates = formData.getAll('endDate[]');
    const descriptions = formData.getAll('jobDescription[]');

    return jobTitles.map((title, i) => ({
      title: title?.trim(),
      company: companies[i]?.trim(),
      location: locations[i]?.trim(),
      startDate: startDates[i]?.trim(),
      endDate: endDates[i]?.trim(),
      description: descriptions[i]?.trim()
    })).filter(exp => exp.title || exp.company || exp.description);
  }

  getEducationData(formData) {
    const degrees = formData.getAll('degree[]');
    const schools = formData.getAll('school[]');
    const locations = formData.getAll('eduLocation[]');
    const startDates = formData.getAll('eduStartDate[]');
    const endDates = formData.getAll('eduEndDate[]');

    return degrees.map((degree, i) => ({
      degree: degree?.trim(),
      school: schools[i]?.trim(),
      location: locations[i]?.trim(),
      startDate: startDates[i]?.trim(),
      endDate: endDates[i]?.trim()
    })).filter(edu => edu.degree || edu.school);
  }

  getAdditionalData(formData) {
    const types = formData.getAll('additionalType[]');
    const titles = formData.getAll('additionalTitle[]');
    const descriptions = formData.getAll('additionalDescription[]');

    return types.map((type, i) => ({
      type: type?.trim(),
      title: titles[i]?.trim(),
      description: descriptions[i]?.trim()
    })).filter(item => item.title || item.description);
  }

  generateElegantTemplate(formData, experienceData, educationData, skillsData, additionalData) {
    const socialLinksHtml = this.generateSocialLinks(formData);
    const skills = skillsData.split(',').filter(Boolean);

    return `
      <div class="sidebar">
        <div class="profile-section">
          <div class="profile-name">${formData.get('fullName') || 'Your Name'}</div>
          <div class="profile-title">${formData.get('professionalTitle') || 'Professional Title'}</div>
        </div>
        <div class="contact-section">
          <div class="sidebar-heading">Contact</div>
          <div class="contact-list">
            ${formData.get('email') ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${formData.get('email')}</div>` : ''}
            ${formData.get('phone') ? `<div class="contact-item"><i class="fas fa-phone"></i> ${formData.get('phone')}</div>` : ''}
            ${formData.get('location') ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${formData.get('location')}</div>` : ''}
            ${socialLinksHtml}
          </div>
        </div>
        ${skills.length > 0 ? `
          <div class="skills-section">
            <div class="sidebar-heading">Skills</div>
            <div class="skills-list">
              ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      <div class="main-content">
        ${formData.get('summary') ? `
          <div class="section">
            <div class="section__title"><i class="fas fa-user"></i> Professional Summary</div>
            <p>${formData.get('summary')}</p>
          </div>
        ` : ''}
        ${experienceData.length > 0 ? `
          <div class="section">
            <div class="section__title"><i class="fas fa-briefcase"></i> Experience</div>
            <div class="section__list">
              ${this.generateExperienceHTML(experienceData)}
            </div>
          </div>
        ` : ''}
        ${educationData.length > 0 ? `
          <div class="section">
            <div class="section__title"><i class="fas fa-graduation-cap"></i> Education</div>
            <div class="section__list">
              ${this.generateEducationHTML(educationData)}
            </div>
          </div>
        ` : ''}
        ${additionalData.length > 0 ? `
          <div class="section">
            <div class="section__title"><i class="fas fa-plus-circle"></i> Additional Information</div>
            <div class="section__list">
              ${this.generateAdditionalHTML(additionalData)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  generateModernTemplate(formData, experienceData, educationData, skillsData, additionalData) {
    const socialLinksHtml = this.generateSocialLinks(formData);
    const skills = skillsData.split(',').filter(Boolean);

    return `
      <div class="header">
        <div class="full-name">${formData.get('fullName') || 'Your Name'}</div>
        <div id="position">${formData.get('professionalTitle') || 'Professional Title'}</div>
        <div class="contact-info">
          ${formData.get('email') ? `<span><i class="fas fa-envelope"></i> ${formData.get('email')}</span>` : ''}
          ${formData.get('phone') ? `<span><i class="fas fa-phone"></i> ${formData.get('phone')}</span>` : ''}
          ${formData.get('location') ? `<span><i class="fas fa-map-marker-alt"></i> ${formData.get('location')}</span>` : ''}
        </div>
        ${socialLinksHtml ? `<div class="social-links">${socialLinksHtml}</div>` : ''}
        ${formData.get('summary') ? `
          <div class="about">
            <p>${formData.get('summary')}</p>
          </div>
        ` : ''}
      </div>
      <div class="details">
        <div class="main-column">
          ${experienceData.length > 0 ? `
            <div class="section">
              <div class="section__title">Professional Experience</div>
              <div class="section__list">
                ${this.generateExperienceHTML(experienceData)}
              </div>
            </div>
          ` : ''}
          ${educationData.length > 0 ? `
            <div class="section">
              <div class="section__title">Education</div>
              <div class="section__list">
                ${this.generateEducationHTML(educationData)}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="side-column">
          ${skills.length > 0 ? `
            <div class="section">
              <div class="section__title">Skills & Expertise</div>
              <div class="skills-list">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${additionalData.length > 0 ? `
            <div class="section">
              <div class="section__title">Additional Information</div>
              <div class="section__list">
                ${this.generateAdditionalHTML(additionalData)}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateDefaultTemplate(formData, experienceData, educationData, skillsData, additionalData) {
    const socialLinksHtml = this.generateSocialLinks(formData);
    const skills = skillsData.split(',').filter(Boolean);

    return `
      <div class="header">
        <div class="full-name">${formData.get('fullName') || 'Your Name'}</div>
        <div id="position">${formData.get('professionalTitle') || 'Professional Title'}</div>
        <div class="contact-info">
          ${formData.get('email') ? `<span><i class="fas fa-envelope"></i> ${formData.get('email')}</span>` : ''}
          ${formData.get('phone') ? `<span><i class="fas fa-phone"></i> ${formData.get('phone')}</span>` : ''}
          ${formData.get('location') ? `<span><i class="fas fa-map-marker-alt"></i> ${formData.get('location')}</span>` : ''}
        </div>
        ${socialLinksHtml ? `<div class="social-links">${socialLinksHtml}</div>` : ''}
        ${formData.get('summary') ? `
          <div class="about">
            <p>${formData.get('summary')}</p>
          </div>
        ` : ''}
      </div>
      <div class="details">
        ${experienceData.length > 0 ? `
          <div class="section">
            <div class="section__title">Experience</div>
            <div class="section__list">
              ${this.generateExperienceHTML(experienceData)}
            </div>
          </div>
        ` : ''}
        ${educationData.length > 0 ? `
          <div class="section">
            <div class="section__title">Education</div>
            <div class="section__list">
              ${this.generateEducationHTML(educationData)}
            </div>
          </div>
        ` : ''}
        ${skills.length > 0 ? `
          <div class="section">
            <div class="section__title">Skills</div>
            <div class="skills-list">
              ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        ${additionalData.length > 0 ? `
          <div class="section">
            <div class="section__title">Additional Information</div>
            <div class="section__list">
              ${this.generateAdditionalHTML(additionalData)}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  generateSocialLinks(formData) {
    const linkedin = formData.get('linkedin');
    const portfolio = formData.get('portfolio');
    
    const links = [];
    if (linkedin) {
      links.push(`<a href="https://${linkedin}" target="_blank" class="social-link"><i class="fab fa-linkedin"></i> LinkedIn</a>`);
    }
    if (portfolio) {
      links.push(`<a href="https://${portfolio}" target="_blank" class="social-link"><i class="fas fa-globe"></i> Portfolio</a>`);
    }
    
    return links.join('');
  }

  generateExperienceHTML(experiences) {
    return experiences.map(exp => `
      <div class="section__list-item">
        <h3>${exp.title}</h3>
        <p class="light">
          ${exp.company ? `<i class="fas fa-building"></i> ${exp.company}` : ''}
          ${exp.location ? `<i class="fas fa-map-marker-alt"></i> ${exp.location}` : ''}
          ${exp.startDate ? `<i class="fas fa-calendar"></i> ${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}` : ''}
        </p>
        ${exp.description ? `<p>${exp.description}</p>` : ''}
      </div>
    `).join('');
  }

  generateEducationHTML(education) {
    return education.map(edu => `
      <div class="section__list-item">
        <h3>${edu.degree}</h3>
        <p class="light">
          ${edu.school ? `<i class="fas fa-university"></i> ${edu.school}` : ''}
          ${edu.location ? `<i class="fas fa-map-marker-alt"></i> ${edu.location}` : ''}
          ${edu.startDate ? `<i class="fas fa-calendar"></i> ${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}` : ''}
        </p>
      </div>
    `).join('');
  }

  generateAdditionalHTML(additionalItems) {
    const groupedItems = additionalItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    return Object.entries(groupedItems).map(([type, items]) => `
      <div class="additional-group">
        <h3 class="additional-type-title">${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        ${items.map(item => `
          <div class="section__list-item">
            <h3>${item.title}</h3>
            ${item.description ? `<p>${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}