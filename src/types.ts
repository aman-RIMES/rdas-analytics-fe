export interface AnalysisMenu {
  id: number;
  name: string;
  title: string;
  options: AnalysisMenuOptions[];
}

export interface AnalysisMenuOptions {
  id: number;
  title: string;
  analysisYears: AnalysisYear[];
}
export interface AnalysisYear {
  value: number;
  label: string;
}
