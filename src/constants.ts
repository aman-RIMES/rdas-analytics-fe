import { Icons } from "./components/ui/icons";

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
    category: "El Nino, Climate and Agriculture production",
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
