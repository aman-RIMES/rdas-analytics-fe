import { Icons } from "./components/ui/icons";

export const menus = [
  {
    id: 1,
    category: "Climate, Agriculture and Adaptation Measures",
    title: "Climate Dynamic Graphs",
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
    title: "Climate Correlation Coefficient",
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
    category: "El Nino, Climate and Agriculture production",
    title: "Climate Dynamic Graphs",
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
        title: "Seasonal Rainfall",
        icon: Icons.extremes,
      },
      {
        id: 4,
        title: "Seasonal Crop Production",
        icon: Icons.plant,
      },
    ],
  },
  {
    id: 4,
    category: "El Nino, Climate and Agriculture production",
    title: "Climate Correlation Coefficient",
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
        title: "Seasonal Rainfall",
        icon: Icons.extremes,
      },
      {
        id: 4,
        title: "Seasonal Crop Production",
        icon: Icons.plant,
      },
    ],
  },

  {
    id: 5,
    category: "Climate Variability and Transport Vehicular Accidents",
    title: "Climate Dynamic Graphs",
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
    title: "Climate Correlation Coefficient",
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

export const analysisTopics = [
  {
    id: 2,
    name: "climate-variability",
    title: "Climate variability and crops",
    options: [
      {
        id: 1,
        title: "Analyze climate and cropping calendar",
        analysisYears: [
          { value: 30, label: "30 Years" },
          { value: 40, label: "40 Years" },
          { value: 50, label: "50 Years" },
          { value: 0, label: "Others" },
        ],
        datasets: [
          {
            id: 1,
            title: "Observed Rainfall",
            icon: Icons.rainfall,
          },
          {
            id: 2,
            title: "Observed Temperature",
            icon: Icons.temperature,
          },
          {
            id: 3,
            title: "Cropping Calendar",
            icon: Icons.extremes,
          },
        ],
      },
      {
        id: 2,
        title: "Analyze climate and crop production",
        analysisYears: [
          { value: 30, label: "30 Years" },
          { value: 40, label: "40 Years" },
          { value: 50, label: "50 Years" },
          { value: 0, label: "Others" },
        ],
        datasets: [
          {
            id: 1,
            title: "Observed Rainfall",
            icon: Icons.rainfall,
          },
          {
            id: 2,
            title: "Observed Temperature",
            icon: Icons.temperature,
          },
          {
            id: 3,
            title: "Observed Crop Production",
            icon: Icons.temperature,
          },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "enso-and-crops",
    title: "ENSO and Crops",
    options: [
      {
        id: 1,
        title: "El Nino and climate variability",
        analysisYears: [
          { value: 30, label: "30 Years" },
          { value: 40, label: "40 Years" },
        ],
        datasets: [
          {
            id: 1,
            title: "Observed Crop Production",
            icon: Icons.rainfall,
          },
        ],
      },
      {
        id: 2,
        title: "Historical El Nino and crops production",
        analysisYears: [
          { value: 30, label: "30 Years" },
          { value: 40, label: "40 Years" },
        ],
        datasets: [
          {
            id: 1,
            title: "Observed Rainfall",
            icon: Icons.rainfall,
          },
          {
            id: 2,
            title: "Observed Temperature",
            icon: Icons.temperature,
          },
        ],
      },
      {
        id: 3,
        title: "Analysis of Impacts of 2023 El Nino",
        analysisYears: [
          { value: 30, label: "30 Years" },
          { value: 40, label: "40 Years" },
        ],
        datasets: [
          {
            id: 1,
            title: "Observed Crop Production",
            icon: Icons.rainfall,
          },
        ],
      },
    ],
  },
];

export const chartOptions = {
  title: {
    text: "Sample Chart",
  },
  subtitle: {
    text: "Highcharts",
  },
  series: [
    {
      name: "SST",
      data: [
        -0.86, 0.44, 0.17, 0.71, -0.38, -0.95, -0.58, 0.96, 0.83, 0.13, 0.06,
        -0.03, -0.21, 0.66, -0.35, 0.9, 0.38, -0.3, 0.14, 0.74, -0.33, -0.94,
        0.93, -0.63, -0.88, -1.06, -0.05, 0.5, -0.1, 0.24, 0.26, -0.28, 1.01,
        0.48, -0.49, -0.6, 0.24, 1.28, -0.82, -0.61, 0.31, 0.64, 0.64, 0.33,
        0.48, -0.16, -0.47, 1.17, -0.07, -1.23, -0.83, -0.3, 0.63, 0.26, 0.46,
        0.03, 0.06, -0.61, -0.78, 0.3, -0.48, -0.85, -0.15, -0.33, 0.11, 1.46,
        0.33, -0.21, 0.01, 0.48, -0.37, -0.73, -0.94, 0.83,
      ],
    },
  ],
  xAxis: {
    title: {
      text: "Years",
    },
    tickInterval: 1,
    categories: [
      1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962,
      1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974,
      1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986,
      1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998,
      1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
      2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
    ],
  },
  yAxis: {
    title: {
      text: "SST",
    },
    tickInterval: 0.5,
    plotLines: [
      {
        color: "grey",
        dashStyle: "dashdot",
        value: 0,
        width: 2,
      },
      {
        label: {
          text: "Weak El Nino",
          align: "right",
        },
        color: "purple",
        dashStyle: "dashdot",
        value: 0.5,
        width: 2,
      },
      {
        label: {
          text: "Strong El Nino",
          align: "right",
        },
        color: "red",
        dashStyle: "dashdot",
        value: 1,
        width: 2,
      },
    ],
  },
};
