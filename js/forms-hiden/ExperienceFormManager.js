export class ExperienceFormManager {
    constructor() {
      this.experienceCounter = 1;
    }
  
    createExperienceEntry() {
      this.experienceCounter++;
      const entryId = `experience-${this.experienceCounter}`;
      
      return `
        <div class="form-group experience-entry">
          <div class="input-group">
            <i class="fas fa-briefcase input-icon"></i>
            <input type="text" name="jobTitle[]" placeholder="Job Title" required>
          </div>
          <div class="input-group">
            <i class="fas fa-building input-icon"></i>
            <input type="text" name="company[]" placeholder="Company" required>
          </div>
          <div class="input-group">
            <i class="fas fa-map-marker-alt input-icon"></i>
            <input type="text" name="location[]" placeholder="Location">
          </div>
          <div class="date-range">
            <div class="input-group">
              <i class="fas fa-calendar input-icon"></i>
              <input type="month" name="startDate[]" required>
            </div>
            <div class="input-group">
              <i class="fas fa-calendar input-icon"></i>
              <input type="month" name="endDate[]">
            </div>
          </div>
          <div class="input-group">
            <i class="fas fa-tasks input-icon"></i>
            <textarea name="jobDescription[]" id="${entryId}" class="rich-text-editor" placeholder="Job Description" rows="4" required></textarea>
          </div>
        </div>
      `;
    }
  
    addExperienceEntry(container) {
      if (!container) return;
      
      const newEntryHtml = this.createExperienceEntry();
      container.insertAdjacentHTML('beforeend', newEntryHtml);
      
      // Return the newly added entry element
      return container.lastElementChild;
    }
  }