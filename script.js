import { SkillsManager } from './js/skills.js';
import { PreviewManager } from './js/preview.js';
import { NavigationManager } from './js/navigation.js';
import { StorageManager } from './js/storage.js';
import { ExportManager } from './js/export.js';
import { AIManager } from './js/ai/AIManager.js';
import { initializeResumeAnalyzer } from './js/analyzer/index.js';
import { EditorManager } from './js/editor/EditorManager.js';
import { auth } from './js/firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resumeForm');
  if (!form) return;

  // Initialize managers
  const skillsManager = new SkillsManager();
  const previewManager = new PreviewManager(form);
  const navigationManager = new NavigationManager();
  const storageManager = new StorageManager(form, skillsManager);
  const exportManager = new ExportManager();
  const aiManager = new AIManager(form);
  const editorManager = new EditorManager(form);

  // Initialize Resume Analyzer
  initializeResumeAnalyzer(form);

  // Add more fields functionality
  document.querySelectorAll('.add-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fieldType = btn.dataset.field;
      const container = document.getElementById(`${fieldType}Fields`);
      if (container) {
        const entry = container.querySelector(`.${fieldType}-entry`);
        if (entry) {
          const newEntry = entry.cloneNode(true);
  
          // Clear values of input and textarea fields
          newEntry.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
          });
  
          // Replace RTE with normal textarea in the cloned entry
          newEntry.querySelectorAll('.rich-text-editor').forEach(rte => {
            const normalTextarea = document.createElement('textarea');
            normalTextarea.name = rte.name;
            normalTextarea.placeholder = rte.placeholder || '';
            normalTextarea.rows = rte.rows || 4;
            rte.replaceWith(normalTextarea); // Replace the RTE field with normal textarea
          });
  
          container.appendChild(newEntry);
  
          // Update AI buttons and live preview
          aiManager.initializeAIButtons();
          previewManager.updatePreview();
        }
      }
    });
  });
  
  

  // Real-time preview update
  form.addEventListener('input', () => previewManager.updatePreview());

  // Initialize first section
  navigationManager.showSection(1);
  
  // Wait for auth state before loading draft
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const loaded = await storageManager.loadDraft();
      if (loaded) {
        previewManager.updatePreview();
        // Reinitialize editors after loading draft
        editorManager.initializeEditors();
      }
    } else {
      window.location.href = 'login.html';
    }
  });
});