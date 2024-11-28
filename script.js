import { SkillsManager } from './js/skills.js';
import { PreviewManager } from './js/preview.js';
import { NavigationManager } from './js/navigation.js';
import { StorageManager } from './js/storage.js';
import { ExportManager } from './js/export.js';
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

  // Add more fields functionality
  document.querySelectorAll('.add-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fieldType = btn.dataset.field;
      const container = document.getElementById(`${fieldType}Fields`);
      if (container) {
        const entry = container.querySelector(`.${fieldType}-entry`);
        if (entry) {
          const newEntry = entry.cloneNode(true);
          newEntry.querySelectorAll('input, textarea').forEach(input => input.value = '');
          container.appendChild(newEntry);
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
        // Update preview after loading data
        previewManager.updatePreview();
      }
    } else {
      window.location.href = 'login.html';
    }
  });
});