import { LatLngExpression } from "leaflet";

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
export interface AnalysisYear {
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
  dependentVariable: string;
  independentVariables: string[];
  source: string;
  districtValue: string;
  countryValue: string;
  periodValue: string;
  dateRange: any;
}

export interface CorrelationFilterData {
  correlationVariable1: string;
  correlationVariable2: string;
}

export interface FilterProps {
  filterData: FilterData;
  handleChange?: any;
  selected?: [];
  setSelected?: any;
  params?: any;
}
