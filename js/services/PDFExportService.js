export class PDFExportService {
    constructor() {
      this.options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true,
          precision: 3
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break',
          avoid: ['.avoid-break', '.section__list-item']
        }
      };
    }
  
    async exportToPDF(element) {
      try {
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true);
        
        // Add page break prevention classes
        clonedElement.querySelectorAll('.section__list-item').forEach(item => {
          item.classList.add('avoid-break');
        });
  
        // Ensure proper scaling
        clonedElement.style.width = '8.5in';
        clonedElement.style.margin = '0';
        clonedElement.style.padding = '0.5in';
        
        // Generate PDF
        await html2pdf()
          .set(this.options)
          .from(clonedElement)
          .save();
  
        return true;
      } catch (error) {
        console.error('PDF Export Error:', error);
        throw new Error('Failed to export PDF');
      }
    }
  }