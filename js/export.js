import { PDFExportService } from './services/PDFExportService.js';

export class ExportManager {
  constructor() {
    this.exportBtn = document.querySelector('.export-btn');
    this.pdfService = new PDFExportService();
    
    if (this.exportBtn) {
      this.initializeEventListeners();
    }
  }

  initializeEventListeners() {
    this.exportBtn.addEventListener('click', () => this.exportPDF());
  }

  async exportPDF() {
    const element = document.getElementById('resumePreview');
    if (!element) return;

    try {
      this.exportBtn.disabled = true;
      this.exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
      
      await this.pdfService.exportToPDF(element);
      
      this.exportBtn.innerHTML = '<i class="fas fa-check"></i> Exported!';
      setTimeout(() => {
        this.exportBtn.disabled = false;
        this.exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export PDF';
      }, 2000);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("An error occurred while exporting the resume. Please try again.");
      
      this.exportBtn.disabled = false;
      this.exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export PDF';
    }
  }
}