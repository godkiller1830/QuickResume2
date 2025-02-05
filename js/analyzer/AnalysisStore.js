export class AnalysisStore {
  constructor() {
    this.analysisResults = null;
    this.listeners = new Set();
  }

  setAnalysisResults(results) {
    this.analysisResults = results;
    this.notifyListeners();
  }

  getAnalysisResults() {
    return this.analysisResults;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.analysisResults));
  }
}