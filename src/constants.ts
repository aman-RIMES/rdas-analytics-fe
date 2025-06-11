// export const BASE_URL = "https://analytics-api.rimes.int";
export const BASE_URL = "http://203.156.108.75:11170/";
export const BODY_PARAMS_URL = `${BASE_URL}/body_params`;
export const NEW_BODY_PARAMS_URL = `https://apis.rimes.int/data/get-available-metadata?level=2&period=monthly`;
export const NEW_BODY_PARAMS_URL_LEVEL_1 = `https://apis.rimes.int/data/get-available-metadata?level=1&period=monthly`;
// export const CROP_PARAMS_URL = `https://analytics-api.rimes.int/cropping_calendar/filters`;
// export const CROP_ADMIN_LOGIN_URL = `https://analytics-api.rimes.int/admin/login/?next=/admin/`;
export const CROP_PARAMS_URL = `http://203.156.108.75:11170/cropping_calendar/filters`;
export const CROP_ADMIN_LOGIN_URL = `http://203.156.108.75:11170/admin/login/?next=/admin/`;

export const IDLE_PREDICTIVE_CHART_MESSAGE =
  "Please Generate A Predictive Model";
export const IDLE_ANALYTICS_CHART_MESSAGE = "Please Start The Analysis";
export const DYNAMIC_MAP_ERROR_MESSAGE = `Failed to generate dynamic map. This could be due to missing data for
              the chosen filters. Try changing your filters and start again.`;

export enum requestStatus {
  idle = "IDLE",
  isLoading = "LOADING",
  isFinished = "FINISHED",
  isError = "ERROR",
}

export enum toolType {
  elnino = "el_nino_",
  lanina = "la_nina_",
  mjo = "mjo_",
}

export enum filterType {
  gdd = "gdd",
  rainfallAnomaly = "rainfallAnomaly",
}

export enum mapDataType {
  normal = "normal",
  anomaly = "anomaly",
}

export const elNinoYearsList = (startYear = 1950) => {
  const list = [];
  for (let i = startYear; i < new Date().getFullYear(); i++) {
    list.push({ value: i.toString(), label: i.toString() });
  }
  return list;
};

export const gddYearsList = (startYear = new Date().getFullYear()) => {
  const list = [];
  for (let i = startYear; i <= 2100; i++) {
    list.push({ value: i.toString(), label: i.toString() });
  }
  return list;
};

export const monthsList = [
  { value: "1", label: "January", shortName: "JAN" },
  { value: "2", label: "February", shortName: "FEB" },
  { value: "3", label: "March", shortName: "MAR" },
  { value: "4", label: "April", shortName: "APR" },
  { value: "5", label: "May", shortName: "MAY" },
  { value: "6", label: "June", shortName: "JUN" },
  { value: "7", label: "July", shortName: "JUL" },
  { value: "8", label: "August", shortName: "AUG" },
  { value: "9", label: "September", shortName: "SEP" },
  { value: "10", label: "October", shortName: "OCT" },
  { value: "11", label: "November", shortName: "NOV" },
  { value: "12", label: "December", shortName: "DEC" },
];

export const croppingTimeline = [
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
  { value: "30", label: "30 Years" },
];

export const croppingStageBackground = [
  { color: "bg-cyan-300", image: "src/assets/stage1.png" },
  { color: "bg-pink-300", image: "src/assets/stage2.png" },
  { color: "bg-yellow-300", image: "src/assets/stage3.png" },
  { color: "bg-green-300", image: "src/assets/stage4.png" },
  { color: "bg-purple-300", image: "src/assets/stage5.png" },
];

export const countries = [
  {
    name: "NPL",
    value: "NPL+Nepal",
    label: "Nepal",
    coordinates: [27.3949, 84.124],
    zoom: 6,
  },
  {
    name: "IND",
    value: "IND+India",
    label: "India",
    coordinates: [20.5937, 78.9629],
    zoom: 4.5,
  },
  {
    name: "PAK",
    value: "PAK+Pakistan",
    label: "Pakistan",
    coordinates: [29.358464447208497, 70.60622074202406],
    zoom: 4.9,
  },
  {
    name: "BGD",
    value: "BGD+Bangladesh",
    label: "Bangladesh",
    coordinates: [23.251401544067932, 89.94872317279236],
    zoom: 6.2,
  },
  {
    name: "LKA",
    value: "LKA+Sri Lanka",
    label: "Sri Lanka",
    coordinates: [7.508338, 80.746848],
    zoom: 7,
  },
  {
    name: "AFG",
    value: "AFG+Afghanistan",
    label: "Afghanistan",
    coordinates: [33.227123, 65.816428],
    zoom: 5.3,
  },
  {
    name: "BTN",
    value: "BTN+Bhutan",
    label: "Bhutan",
    coordinates: [27.339435, 90.458761],
    zoom: 7.5,
  },
  {
    name: "MDV",
    value: "MDV+Maldives",
    label: "Maldives",
    coordinates: [2.174771, 73.509845],
    zoom: 5.8,
  },
];

export const geoJsonStructure = {
  LKA: {
    district_code: "GID_1",
    district_name: "NAME_1",
    province_name: "TYPE_1",
  },
  IND: {
    district_code: "GID_2",
    district_name: "NAME_2",
    province_name: "NAME_1",
  },
  BGD: {
    district_code: "admin2Pcod",
    district_name: "admin2Name",
    province_name: "admin1Name",
  },
  PAK: {
    district_code: "ADM2_CODE",
    district_name: "DISTRICT",
    province_name: "ADM1_PROVI",
  },
  NPL: {
    district_code: "SA_Code",
    district_name: "District",
    province_name: "Province",
  },
  AFG: {
    district_code: "GID_2",
    district_name: "NAME_2",
    province_name: "NAME_1",
  },
  BTN: {
    district_code: "GID_1",
    district_name: "NAME_1",
    province_name: "TYPE_1",
  },
  MDV: {
    district_code: "ADM2_PCODE",
    district_name: "ADM2_shape",
    province_name: "ADM1_EN",
  },
};

export const routeDefinitions = {
  "/analytics-crop": "Crop Calendar Suitability to Observed Climate",
  "/predictive-tools": "El Nino Impacts Prediction",
  "/lanina-predictive-tools": "La Nina Impacts Prediction",
  "/elnino-analytics": "El Nino and Local Climate",
  "/analytics-mjo": "MJO and Local Climate",
  "/lanina-analytics": "La Nina and Local Climate",
  "/analytics-land": "Land Use & Land Cover Change",
  "/predictive-temps": "Temperature Sensitivity Alert System (TEMPs)",
  "/predictive-gdd-tools": "Growing Degree Days",
  "/analytics-rainfall-anomaly": "Rainfall Anomaly",
};

export const ElNinoToolDataIndicators = {
  rainfall: "Rainfall",
  tavg: "Average temperature",
  tmin: "Minimum temperature",
  tmax: "Maximum temperature",
};

export const ElNinoCategories = [
  { value: "moderate", label: "Moderate El Nino Events" },
  { value: "weak", label: "Weak El Nino Events" },
  { value: "strong", label: "Strong El Nino Events" },
  { value: "very_strong", label: "Very strong El Nino Events" },
];
