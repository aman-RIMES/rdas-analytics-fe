export interface AnalysisTopics {
  id: number;
  name: string;
  title: string;
  options: AnalysisSubject[];
}

export interface AnalysisSubject {
  id: number;
  title: string;
  analysisYears: AnalysisYear[];
  datasets?: unknown[];
}
export interface AnalysisYear {
  value: number;
  label: string;
}
