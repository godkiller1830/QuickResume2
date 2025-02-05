import { RichTextEditor } from './RichTextEditor.js';

export class EditorManager {
  constructor(form) {
    this.form = form;
    this.editor = new RichTextEditor();
    this.textareaCounter = 0;
    this.initializeEditors();
    this.setupEventListeners();
  }

  initializeEditors() {
    const textareas = this.form.querySelectorAll('textarea[name="jobDescription[]"], textarea[name="summary"], textarea[name="additionalDescription[]"]');
    textareas.forEach(textarea => {
      if (!textarea.classList.contains('rich-text-editor')) return; // Skip non-RTE textareas
      if (!textarea.id) {
        textarea.id = `editor-${this.textareaCounter++}`;
      }
      textarea.classList.add('rich-text-editor');
    });
  }
  

  setupEventListeners() {
    const addExperienceBtn = this.form.querySelector('[data-field="experience"]');
    if (addExperienceBtn) {
      addExperienceBtn.addEventListener('click', () => {
        setTimeout(() => {
          const newEntry = this.form.querySelector('.experience-entry:last-child');
          if (newEntry) {
            const newTextarea = newEntry.querySelector('textarea');
            if (newTextarea) {
              this.setupNewTextarea(newTextarea);
            }
          }
        }, 0);
      });
    }

    const addAdditionalBtn = this.form.querySelector('[data-field="additional"]');
    if (addAdditionalBtn) {
      addAdditionalBtn.addEventListener('click', () => {
        setTimeout(() => {
          const newEntry = this.form.querySelector('.additional-entry:last-child');
          if (newEntry) {
            const newTextarea = newEntry.querySelector('textarea');
            if (newTextarea) {
              this.setupNewTextarea(newTextarea);
            }
          }
        }, 0);
      });
    }
  }

  setupNewTextarea(textarea) {
    if (!textarea.id) {
      textarea.id = `editor-${this.textareaCounter++}`;
    }
    textarea.classList.add('rich-text-editor');
    this.editor.addEditor(textarea);
  }

  getEditor(elementId) {
    return this.editor.getEditor(elementId);
  }
}