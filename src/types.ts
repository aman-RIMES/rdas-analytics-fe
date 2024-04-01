/* eslint-disable @typescript-eslint/no-explicit-any */
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
  datasets?: any[];
}
export interface AnalysisYear {
  value: number;
  label: string;
}

export interface Dataset {
  id: number;
  title: string;
  icon: string;
}
