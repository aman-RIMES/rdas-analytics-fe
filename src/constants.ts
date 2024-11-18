import { Icons } from "./components/ui/icons";
import { Country, YearsList } from "./types";

// export const BASE_URL = "http://203.156.108.67:1580";
export const BASE_URL = "https://analytics-api.rimes.int";
export const BODY_PARAMS_URL = `${BASE_URL}/body_params`;

export const IDLE_PREDICTIVE_CHART_MESSAGE =
  "Please Generate A Predictive Model";
export const IDLE_ANALYTICS_CHART_MESSAGE = "Please Start The Analysis";

export enum requestStatus {
  idle = "IDLE",
  isLoading = "LOADING",
  isFinished = "FINISHED",
  isError = "ERROR",
}

export enum predictiveModelDataType {
  linear = "linear",
  logistic = "logistic",
}

export enum analysisType {
  climate = "climate",
  elnino = "elnino",
}

export enum mapDataType {
  normal = "normal",
  anomaly = "anomaly",
}

export const menus = [
  {
    id: 1,
    category: "Climate, Agriculture and Adaptation Measures",
    title: "Analytics",
    datasets: [
      {
        id: 1,
        title: "Seasonal Rainfall",
        icon: Icons.rainfall,
      },
      {
        id: 2,
        title: "Seasonal Crop Production",
        icon: Icons.plant,
      },
      {
        id: 3,
        title: "Seasonal Adaptation measures",
        icon: Icons.extremes,
      },
    ],
  },
  {
    id: 2,
    category: "Climate, Agriculture and Adaptation Measures",
    title: "Predictive Tools",
    datasets: [
      {
        id: 1,
        title: "Seasonal Rainfall",
        icon: Icons.rainfall,
      },
      {
        id: 2,
        title: "Seasonal Crop Production",
        icon: Icons.plant,
      },
      {
        id: 3,
        title: "Seasonal Adaptation measures",
        icon: Icons.extremes,
      },
    ],
  },
  {
    id: 3,
    category: "El Nino Analytics",
    title: "Analytics",
    datasets: [
      {
        id: 1,
        title: "El Nino Events",
        indicator: "el_nino",
        icon: Icons.fog,
      },
      {
        id: 2,
        title: "Normal Rainfall",
        indicator: "normal_rainfall",
        icon: Icons.rainfall,
      },
      {
        id: 3,
        title: "Rainfall",
        indicator: "rainfall",
        icon: Icons.extremes,
      },
      // {
      //   id: 4,
      //   title: "Crop Production",
      //   indicator: "crop_production",
      //   icon: Icons.plant,
      // },
    ],
  },
  {
    id: 4,
    category: "El Nino Analytics",
    title: "Predictive Tools",
    datasets: [
      {
        id: 1,
        title: "El Nino Events",
        icon: Icons.fog,
      },
      {
        id: 2,
        title: "Normal Rainfall",
        icon: Icons.rainfall,
      },
      {
        id: 3,
        title: "Rainfall",
        icon: Icons.extremes,
      },
      {
        id: 4,
        title: "Crop Production",
        icon: Icons.plant,
      },
    ],
  },

  {
    id: 5,
    category: "Climate Variability and Transport Vehicular Accidents",
    title: "Analytics",
    datasets: [
      {
        id: 1,
        title: "Rainfall / Fog",
        icon: Icons.fog,
      },
      {
        id: 2,
        title: "Vehicular Accidents",
        icon: Icons.car,
      },
    ],
  },
  {
    id: 6,
    category: "Climate Variability and Transport Vehicular Accidents",
    title: "Predictive Tools",
    datasets: [
      {
        id: 1,
        title: "Rainfall / Fog",
        icon: Icons.fog,
      },
      {
        id: 2,
        title: "Vehicular Accidents",
        icon: Icons.car,
      },
    ],
  },
];

export const elNinoYearsList = () => {
  const list = [];
  for (let i = 1950; i < new Date().getFullYear(); i++) {
    list.push({ value: i.toString(), label: i.toString() });
  }
  return list;
};

export const yearsList: YearsList[] = [
  {
    value: 2000,
    label: "2000",
  },
  {
    value: 2001,
    label: "2001",
  },
  {
    value: 2002,
    label: "2002",
  },
  {
    value: 2003,
    label: "2003",
  },
  {
    value: 2004,
    label: "2004",
  },
  {
    value: 2005,
    label: "2005",
  },
  {
    value: 2006,
    label: "2006",
  },
  {
    value: 2007,
    label: "2007",
  },
  {
    value: 2008,
    label: "2008",
  },
  {
    value: 2009,
    label: "2009",
  },
  {
    value: 2010,
    label: "2010",
  },
  {
    value: 2011,
    label: "2011",
  },
  {
    value: 2012,
    label: "2012",
  },
  {
    value: 2013,
    label: "2013",
  },
  {
    value: 2014,
    label: "2014",
  },
  {
    value: 2015,
    label: "2015",
  },
  {
    value: 2016,
    label: "2016",
  },
  {
    value: 2017,
    label: "2017",
  },
  {
    value: 2018,
    label: "2018",
  },
  {
    value: 2019,
    label: "2019",
  },
  {
    value: 2020,
    label: "2020",
  },
  {
    value: 2021,
    label: "2021",
  },
  {
    value: 2022,
    label: "2022",
  },
  {
    value: 2023,
    label: "2023",
  },
];

export const monthsList = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const countries = [
  { value: "NPL", label: "Nepal", coordinates: [28.3949, 84.124], zoom: 6 },
  { value: "IND", label: "India", coordinates: [20.5937, 78.9629], zoom: 3 },
  {
    value: "PAK",
    label: "Pakistan",
    coordinates: [31.358464447208497, 70.60622074202406],
    zoom: 5,
  },
  {
    value: "BGD",
    label: "Bangladesh",
    coordinates: [24.051401544067932, 89.94872317279236],
    zoom: 6,
  },
];

export const Indicators = {
  cotton_production: "Crop Production - Cotton",
  crop_price_monthly: "Crop-wise price monthly, yearly",
  crop_price_seasonal: "Crop-wise price seasonal, year wise",
  crop_production_monthly: "Crop production acreage monthly, year wise",
  crop_production_seasonal: "Crop production acreage seasonal year wise",
  crop_yield_seasonal: "Crop-wise yield seasonal, year wise",
  el_nino: "El Nino Events",
  el_nino_moderate: "Moderate El Nino Events",
  el_nino_strong: "Strong El Nino Events",
  el_nino_weak: "Weak El Nino Events",
  maize_production: "Crop Production - Maize",
  normal_rainfall: "Normal Rainfall",
  rainfall: "Rainfall",
  rainfall_cummulative_monthly: "Rainfall cumulative monthly, year wise",
  rainfall_cummulative_seasonal: "Rainfall cumulative seasonal, Year wise",
  rainfall_deviation: "Deviation from Normal Rainfall",
  rainfall_max_monthly: "Rainfall max monthly year wise",
  rainfall_min_monthly: "Rainfall min monthly, year wise",
  rice_production: "Crop Production - Rice",
  temperature: "Temperature",
  temperature_avg_monthly: "Average/ mean temperature monthly, year wise",
  temperature_max_monthly: "Temperature max monthly, year wise",
  temperature_min_monthly: "Temperature min monthly, year wise",
  wheat_production: "Crop Production",
};

export const ElNinoToolDataIndicators = {
  // temperature_max_monthly: "Temperature max monthly, year wise",
  // temperature_min_monthly: "Temperature min monthly, year wise",
  // temperature_avg_monthly: "Average / mean temperature monthly, year wise",
  // rainfall_cummulative_monthly: "Rainfall cumulative monthly, year wise",
  rainfall: "Rainfall cumulative, Year wise",
  temperature: "Temperature, Year wise",
  // rainfall_cummulative_seasonal: "Rainfall cumulative seasonal, Year wise",
  // rainfall_max_monthly: "Rainfall max monthly year wise",
  // rainfall_min_monthly: "Rainfall min monthly, year wise",
  // crop_production_monthly: "Crop production acreage monthly, year wise",
  // crop_production_seasonal: "Crop production acreage seasonal year wise",
  // crop_yield_seasonal: "Crop-wise yield seasonal, year wise",
  // crop_price_monthly: "Crop-wise price monthly, yearly",
  // crop_price_seasonal: "Crop-wise price seasonal, year wise",
};

export const ElNinoCategories = [
  { value: "moderate", label: "Moderate El Nino Events" },
  { value: "weak", label: "Weak El Nino Events" },
  { value: "strong", label: "Strong El Nino Events" },
  { value: "very_strong", label: "Very strong El Nino Events" },
];

export const ElNinoYears = {
  weak: [
    { value: "1980", label: "1980" },
    { value: "1988", label: "1988" },
    { value: "1993", label: "1993" },
    { value: "2004", label: "2004" },
    { value: "2005", label: "2005" },
    { value: "2007", label: "2007" },
  ],
  moderate: [
    { value: "1986", label: "1986" },
    { value: "1994", label: "1994" },
    { value: "2002", label: "2002" },
    { value: "2010", label: "2010" },
  ],
  strong: [
    { value: "1982", label: "1982" },
    { value: "1983", label: "1983" },
    { value: "1987", label: "1987" },
    { value: "1991", label: "1991" },
    { value: "1992", label: "1992" },
    { value: "1997", label: "1997" },
    { value: "1998", label: "1998" },
    { value: "2009", label: "2009" },
  ],
};

export const correlationLegendObject = [
  {
    coefficient: "-1",
    description: "Perfect Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in perfect proportion.",
    style: "bg-blue-700 text-white",
  },
  {
    coefficient: "-1 < r ≤ -0.8",
    description: "Very Strong Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in very strong proportion.",
    style: "bg-blue-600 text-white",
  },
  {
    coefficient: "-0.8 < r ≤ -0.6",
    description: "Strong Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in strong proportion.",
    style: "bg-blue-500 text-white",
  },
  {
    coefficient: "-0.6 < r ≤ 0.4",
    description: "Medium Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in medium proportion.",
    style: "bg-blue-400 text-white",
  },
  {
    coefficient: "-0.4 < r ≤ 0.2",
    description: "Weak Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in weak proportion.",
    style: "bg-blue-300 text-black",
  },
  {
    coefficient: "-0.2 < r < 0",
    description: "Very Weak Negative Correlation",
    interpretation:
      "The variables move in opposite directions. If one increases, the other decreases in very weak proportion.",
    style: "bg-blue-200 text-black",
  },
  {
    coefficient: "0",
    description: "No Correlation",
    interpretation: "There is no linear relationship between the variables.",
    style: "bg-gray-200 text-black",
  },
  {
    coefficient: "0 < r < 0.2",
    description: "Very Weak Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in very weak proportion.",
    style: "bg-red-200 text-black",
  },
  {
    coefficient: "0.2 ≤ r < 0.4",
    description: "Weak Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in weak proportion.",
    style: "bg-red-300 text-black",
  },
  {
    coefficient: "0.4 ≤ r < 0.6",
    description: "Medium Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in medium proportion.",
    style: "bg-red-400 text-white",
  },
  {
    coefficient: "0.6 ≤ r < 0.8",
    description: "Strong Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in strong proportion.",
    style: "bg-red-500 text-white",
  },
  {
    coefficient: "0.8 ≤ r < 1.0",
    description: "Very Strong Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in very strong proportion.",
    style: "bg-red-600 text-white",
  },
  {
    coefficient: "1",
    description: "Perfect Positive Correlation",
    interpretation:
      "Both variables move in same direction. If one increases, the other also increases in perfect proportion.",
    style: "bg-red-700 text-white",
  },
];
