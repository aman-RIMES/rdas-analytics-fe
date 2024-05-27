import { Icons } from "./components/ui/icons";
import topology from "./data/topology.json";

export const menus = [
  {
    id: 1,
    category: "Climate, Agriculture and Adaptation Measures",
    title: "Dynamic Graphs",
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
    title: "Correlation Coefficient",
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
    title: "Dynamic Graphs",
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
      {
        id: 4,
        title: "Crop Production",
        indicator: "crop_production",
        icon: Icons.plant,
      },
    ],
  },
  {
    id: 4,
    category: "El Nino, Climate and Agriculture production",
    title: "Correlation Coefficient",
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
    title: "Dynamic Graphs",
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
    title: "Correlation Coefficient",
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

export const chartOptions = {
  chart: { type: "heatmap" },
  title: { text: "Correlation Plot" },
  xAxis: {
    categories: [
      "Rainfall",
      "Crop Production",
      "El Nino Events",
      "Normal Rainfall",
    ],
  },
  yAxis: {
    categories: [
      "Rainfall",
      "Crop Production",
      "El Nino Events",
      "Normal Rainfall",
    ],
    title: null,
  },
  colorAxis: { min: -1, minColor: "#FFFFFF", maxColor: "#000000" },
  legend: {
    align: "right",
    layout: "vertical",
    margin: 0,
    verticalAlign: "top",
    y: 25,
    symbolHeight: 280,
  },
  tooltip: { enabled: false },
  series: [
    {
      data: [
        [0, 0, 1.0],
        [0, 1, -0.07259260352413074],
        [0, 2, -0.08912667845774237],
        [0, 3, -5.738806945293855e-17],
        [1, 0, -0.07259260352413074],
        [1, 1, 1.0],
        [1, 2, -0.3742960530448015],
        [1, 3, -9.78297117456009e-18],
        [2, 0, -0.08912667845774237],
        [2, 1, -0.3742960530448015],
        [2, 2, 1.0],
        [2, 3, -5.3286347721069434e-17],
        [3, 0, -5.738806945293855e-17],
        [3, 1, -9.782971174560088e-18],
        [3, 2, -5.3286347721069434e-17],
        [3, 3, 0.9999999999999998],
      ],
      dataLabels: { enabled: true, format: "{point.value: .4f}" },
    },
  ],
};

export const mapOptions = {
  chart: {
    map: topology,
    height: 700,
  },

  title: {
    text: "Highcharts Maps basic demo",
  },

  subtitle: {
    text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/in-all.topo.json">India</a>',
  },

  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: "bottom",
    },
  },

  colorAxis: {
    min: 0,
  },

  series: [
    {
      data: [
        ["in-py", 10],
        ["in-ld", 11],
        ["in-wb", 12],
        ["in-or", 13],
        ["in-br", 14],
        ["in-sk", 15],
        ["in-ct", 16],
        ["in-tn", 17],
        ["in-mp", 18],
        ["in-2984", 19],
        ["in-ga", 20],
        ["in-nl", 21],
        ["in-mn", 22],
        ["in-ar", 23],
        ["in-mz", 24],
        ["in-tr", 25],
        ["in-3464", 26],
        ["in-dl", 27],
        ["in-hr", 28],
        ["in-ch", 29],
        ["in-hp", 30],
        ["in-jk", 31],
        ["in-kl", 32],
        ["in-ka", 33],
        ["in-dn", 34],
        ["in-mh", 35],
        ["in-as", 36],
        ["in-ap", 37],
        ["in-ml", 38],
        ["in-pb", 39],
        ["in-rj", 40],
        ["in-up", 41],
        ["in-ut", 42],
        ["in-jh", 43],
      ],
      name: "Random data",
      states: {
        hover: {
          color: "#BADA55",
        },
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
      },
    },
  ],
};
