export class AnalysisHighlighter {
  constructor(previewElement) {
    this.previewElement = previewElement;
  }

  highlight(analysis) {
    this.clearHighlights();
    Object.entries(analysis.sections).forEach(([sectionName, sectionData]) => {
      if (sectionData.suggestions) {
        this.highlightSection(sectionName, sectionData);
      }
    });
  }

  highlightSection(sectionName, sectionData) {
    const sectionElement = this.getSectionElement(sectionName);
    if (!sectionElement) return;

    sectionData.suggestions.forEach(suggestion => {
      const textToHighlight = this.extractTextToHighlight(suggestion.text);
      if (textToHighlight) {
        this.highlightText(sectionElement, textToHighlight, suggestion);
      }
    });
  }

  extractTextToHighlight(suggestionText) {
    // Extract text between quotes
    const quotedMatch = suggestionText.match(/"([^"]+)"/);
    if (quotedMatch) return quotedMatch[1];

    // Extract text after common phrases
    const phrases = ['change ', 'replace ', 'instead of ', 'remove '];
    for (const phrase of phrases) {
      if (suggestionText.toLowerCase().includes(phrase)) {
        const start = suggestionText.toLowerCase().indexOf(phrase) + phrase.length;
        const end = suggestionText.indexOf(' with') > -1 ? 
          suggestionText.indexOf(' with') : 
          suggestionText.indexOf('.') > -1 ?
            suggestionText.indexOf('.') :
            suggestionText.length;
        return suggestionText.slice(start, end).trim();
      }
    }

    return null;
  }

  getSectionElement(sectionName) {
    const selectors = {
      summary: '.about',
      experience: '#experienceSection',
      education: '#educationSection',
      skills: '#skillsList'
    };
    return this.previewElement?.querySelector(selectors[sectionName]);
  }

  highlightText(element, text, suggestion) {
    if (!element || !text) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodesToReplace = [];
    let node;

    while (node = walker.nextNode()) {
      const index = node.textContent.toLowerCase().indexOf(text.toLowerCase());
      if (index !== -1) {
        nodesToReplace.push({
          node,
          index,
          length: text.length,
          originalText: node.textContent.substr(index, text.length),
          suggestion
        });
      }
    }

    nodesToReplace.reverse().forEach(({ node, index, length, originalText, suggestion }) => {
      const before = node.textContent.slice(0, index);
      const after = node.textContent.slice(index + length);

      const span = document.createElement('span');
      span.className = `highlight-${suggestion.severity}`;
      span.textContent = originalText;

      const tooltip = document.createElement('span');
      tooltip.className = 'suggestion-tooltip';
      tooltip.textContent = suggestion.text;
      span.appendChild(tooltip);

      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));
      fragment.appendChild(span);
      if (after) fragment.appendChild(document.createTextNode(after));

      node.parentNode.replaceChild(fragment, node);
    });
  }

  clearHighlights() {
    const highlights = this.previewElement?.querySelectorAll('[class^="highlight-"]');
    if (!highlights) return;

    highlights.forEach(highlight => {
      const text = highlight.childNodes[0].textContent;
      highlight.parentNode.replaceChild(document.createTextNode(text), highlight);
    });
  }
}