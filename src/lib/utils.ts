/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  COLOR_SCALES,
  MJO_COLOR_SCALE,
  requestStatus,
  toolType,
} from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any) {
  return date
    ? new Date(date?.getTime() - date?.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
    : "";
}

export const transformObject = (object: any) =>
  Array.from(Object.entries(object), ([key, value]) => ({
    value: key,
    label: value,
  }));

export const transformSourceObject = (object: any) =>
  Array.from(Object.entries(object), ([key]) => ({
    value: key,
    label: key,
  }));

export const transformNewParamsObject = (object: any) =>
  Array.from(Object.entries(object), ([key, value]) => ({
    value: `${key}+${value}`,
    label: value,
  }));

export const transformMultiNewParamsObject = (object: any) =>
  Array.from(Object.entries(object), ([key, value]) => ({
    value: key,
    label: value || "NULL",
  }));

export const isLoading = (status: requestStatus | undefined) =>
  status === requestStatus.isLoading;

export const isFinished = (status: requestStatus | undefined) =>
  status === requestStatus.isFinished;

export const isError = (status: requestStatus | undefined) =>
  status === requestStatus.isError;

export const isIdle = (status: requestStatus | undefined) =>
  status === requestStatus.idle;

export function transformProvinceArray(array: Array<object>) {
  return array.map((e: any) => ({ value: e.province_id, label: e.province }));
}

export const transformDistrictArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.district_id, label: e.district }));

export const transformTehsilArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.tehsil_id, label: e.tehsil }));

export const transformCropArray = (array: Array<object>) =>
  array?.map((e: any) => ({ value: `${e.uuid}+${e.name}`, label: e.name }));

export const transformGDDCropArray = (array: Array<object>) =>
  array?.map((e: any) => ({
    value: `${e.uuid}+${e.name}`,
    label: e.crop_name,
  }));

export const getAverage = (array: any) =>
  array.reduce((a: any, b: any) => a + b) / array.length;

export const transformDistrictParams = (array: Array<object>) => {
  const districts = array.map((e: any) => ({
    value: `${e.district_code}+${e.district_name}`,
    label: e.district_name,
  }));

  return districts.sort((a, b) =>
    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
  );
};

export const getAllDistrictsOfCountry = (array: Array<object>) => {
  const districts: string[] = [];
  array.map((e: any) => {
    districts.push(e.district_code);
  });
  return districts;
};

export const formatTitle = (title: string) => {
  title = title.toLowerCase().replace(/_/g, " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export const formatStatisticsLabel = (title: string) => {
  const label = formatTitle(title);
  return label;
};

export const calculateLinearPredictiveValue = (
  input: string,
  coeff: number,
  intercept: number,
  std_error: number
) => {
  const predictedValue = parseFloat(input) * coeff + intercept;
  const min = predictedValue * (std_error / 100 - 1);
  const max = predictedValue * (std_error / 100);

  return {
    min: min.toFixed(2),
    max: max.toFixed(2),
    input: input,
  };
};

export const containsCropAnalysis = (dependentVariables) => {
  const cropVariables = [
    "crop_production_monthly",
    "crop_production_seasonal",
    "crop_yield_seasonal",
    "crop_price_monthly",
    "crop_price_seasonal",
  ];

  return cropVariables.some((element) => dependentVariables.includes(element));
};

export const transformPredictionTableData = (predictiveTableData: object) => {
  const newArray = [];
  for (let i = 0; i < Object.values(predictiveTableData)[0].length; i++) {
    let newObject = {};
    Object.entries(predictiveTableData).map((e: any) => {
      newObject = { ...newObject, [e[0]]: e[1][i] };
    });
    newArray.push(newObject);
  }
  return newArray;
};

export const getMetricUnit = (indicator) => {
  return indicator === "tavg" ? "(°C)" : "(mm)";
};

export const getAnalyticsToolType = (path) => {
  const climatePattern =
    path === "/lanina-analytics"
      ? toolType.lanina
      : path === "/analytics-mjo"
      ? toolType.mjo
      : toolType.elnino;

  return climatePattern;
};

export function getFillColor(mapFilter, value, climatePattern) {
  const scale =
    climatePattern === toolType.mjo
      ? MJO_COLOR_SCALE
      : COLOR_SCALES[mapFilter?.dataVariable];

  if (!scale) {
    return "#fff";
  }

  // Handle exact match for 0 first
  const exactZeroMatch = scale.find(
    (item) => item.exact && item.threshold === value
  );
  if (exactZeroMatch) {
    return exactZeroMatch.color;
  }

  // Find the first threshold that the value is less than
  for (let i = 0; i < scale.length; i++) {
    const item = scale[i];
    // Skip exact matches already handled
    if (item.exact) continue;

    if (value < item.threshold) {
      return item.color;
    }
  }

  // If value is greater than or equal to all thresholds,
  // return the color for the last (largest) threshold.
  // This assumes the scale is sorted in ascending order of thresholds.
  const lastThresholdItem = scale[scale.length - 1];
  if (
    lastThresholdItem &&
    !lastThresholdItem.exact &&
    value >= lastThresholdItem.threshold
  ) {
    return lastThresholdItem.color;
  }

  return null;
}
