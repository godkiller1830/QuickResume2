import { ExperienceFormManager } from './ExperienceFormManager.js';
import { EditorManager } from '../editor/EditorManager.js';

export class FormManager {
  constructor(form) {
    this.form = form;
    this.experienceManager = new ExperienceFormManager();
    this.editorManager = new EditorManager(form);
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Handle "Add More Experience" button click
    const addExperienceBtn = this.form.querySelector('[data-field="experience"]');
    if (addExperienceBtn) {
      addExperienceBtn.addEventListener('click', () => this.handleAddExperience());
    }

    // Add other form-related event listeners here
  }

  handleAddExperience() {
    const container = document.getElementById('experienceFields');
    if (!container) return;

    const newEntry = this.experienceManager.addExperienceEntry(container);
    if (newEntry) {
      // Initialize rich text editor for the new entry
      const textarea = newEntry.querySelector('.rich-text-editor');
      if (textarea) {
        this.editorManager.setupNewTextarea(textarea);
      }
    }
  }
}