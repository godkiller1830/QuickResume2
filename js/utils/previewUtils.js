export function isEmptySection(section) {
    if (!section) return true;
    
    // Remove whitespace and check if the section is empty
    const cleanContent = section.replace(/\s+/g, '');
    return cleanContent === '';
  }