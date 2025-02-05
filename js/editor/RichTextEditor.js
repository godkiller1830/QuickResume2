export class RichTextEditor {
  constructor() {
    this.editors = new Map();
    this.initializeTinyMCE();
  }

  async initializeTinyMCE() {
    await this.loadTinyMCE();
    this.setupEditors();
  }

  async loadTinyMCE() {
    return new Promise((resolve) => {
      if (window.tinymce) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.tiny.cloud/1/unl2cbgzijlkr215yq7ia033cs34fqc2j9kicztmydr0i4a1/tinymce/6/tinymce.min.js';
      script.referrerpolicy = "origin";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  setupEditors() {
    const editorConfig = {
      selector: '.rich-text-editor:not(.tinymce-initialized)',
      height: 300,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'charmap',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | formatselect | ' +
        'bold italic | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
      setup: (editor) => {
        editor.on('init', () => {
          editor.getElement().classList.add('tinymce-initialized');
        });
        editor.on('change', () => {
          editor.save();
          editor.getElement().dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    };

    tinymce.init(editorConfig).then(editors => {
      editors.forEach(editor => {
        this.editors.set(editor.getElement().id, editor);
      });
    });
  }

  addEditor(element) {
    if (!element || !element.id || this.editors.has(element.id) || element.classList.contains('tinymce-initialized')) {
      return;
    }

    const editorConfig = {
      target: element,
      height: 300,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'charmap',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | formatselect | ' +
        'bold italic | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
      setup: (editor) => {
        editor.on('init', () => {
          element.classList.add('tinymce-initialized');
        });
        editor.on('change', () => {
          editor.save();
          element.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    };

    tinymce.init(editorConfig).then(editors => {
      const editor = editors[0];
      this.editors.set(element.id, editor);
    });
  }

  removeEditor(element) {
    if (!element || !element.id) return;
    
    const editor = this.editors.get(element.id);
    if (editor) {
      editor.remove();
      this.editors.delete(element.id);
      element.classList.remove('tinymce-initialized');
    }
  }

  setContent(elementId, content) {
    const editor = this.editors.get(elementId);
    if (editor) {
      editor.setContent(content);
      editor.save();
    }
  }

  getEditor(elementId) {
    return this.editors.get(elementId);
  }
}