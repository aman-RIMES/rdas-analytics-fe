import { LatLngExpression } from "leaflet";
import { analysisType, requestStatus } from "./constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AnalysisTopics {
  id: number;
  name: string;
  title: string;
}

export interface Menu {
  id: number;
  title: string;
  datasets?: Dataset[];
}
export interface YearsList {
  value: number;
  label: string;
}

export interface Dataset {
  id: number;
  title: string;
  icon: any;
}

export interface Menu {
  climate: SubMenu[];
  agriculture: SubMenu[];
  transport: SubMenu[];
}

export interface SubMenu {
  id: number;
  title: string;
  datasets: Dataset[];
}

export interface Crop {
  crop_id: number;
  crop_name: string;
  min_gdd: number;
  max_gdd: number;
  min_period_days: number;
  max_period_days: number;
  base_temp: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface Params {
  source: any;
  district: District[];
  indic: any;
  period: any;
  model: any;
}

export interface District {
  country: string;
  district_name: string;
  district_code: string;
}

export interface Country {
  value: string;
  label: string;
  coordinates: LatLngExpression;
  zoom: number;
}

export interface FilterData {
  dataVariable?: string[];
  dependentVariable?: string;
  elNinoVariable?: string;
  independentVariables?: string[];
  source?: string;
  customDataset?: any;
  districtValue?: string;
  countryValue: string;
  periodValue?: string;
  dateRange?: any;
  districtList?: District[];
  modelType?: string;
  provinceValue?: string;
  tehsilValue?: string;
  cropValue?: string;
  yearsValue?: YearsList[];
  fromYear?: string;
  toYear?: string;
  anomalyYear1?: string;
  anomalyYear2?: string;
  months?: [];
}

export interface CorrelationFilterData {
  correlationVariable1: string;
  correlationVariable2: string;
}

export interface FilterProps {
  filterData: FilterData;
  handleChange?: (name, value) => void;
  selected?: [];
  setSelected?: any;
  params?: any;
  filterType?: string;
  typeOfAnalysis?: analysisType;
}

export interface AnalyticsDataProps {
  filterData: FilterData;
  timeSeriesChartData: any;
  dynamicMapData: any;
  dynamicChartStatus: requestStatus;
  dynamiMapStatus: requestStatus;
  firstAnomalyMapStatus?: requestStatus;
  secondAnomalyMapStatus?: requestStatus;
  handleChange?: (name, value) => void;
  mapFormData?: MapFormData;
}

export interface PredictiveDataProps {
  regressionModelData: any;
  regressionModelStatus: requestStatus;
  predictiveDataType: any;
  modelType: string;
  elNinoCategory?: string;
  filterData?: FilterData;
  handleChange?: (name, value) => void;
}

export interface GDDDataProps {
  gddData: any;
  gddStatus: requestStatus;
}

export interface GDDFilterProps {
  filterData: FilterData;
  handleChange: (name, value) => void;
}

export interface MapFormData {
  countryValue: string;
  fromYear: string;
  toYear: string;
}

export interface PredictiveFilterData {
  elNinoCategory: string;
  predictiveVariable: string;
}
