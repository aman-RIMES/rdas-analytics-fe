/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function transformProvinceArray(array: Array<object>) {
  return array.map((e: any) => ({ value: e.province_id, label: e.province }));
}

export const transformDistrictArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.district_id, label: e.district }));

export const transformTehsilArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.tehsil_id, label: e.tehsil }));

export const transformCropArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.crop_id?.toString(), label: e.crop_name }));

export const getAverage = (array: any) =>
  array.reduce((a: any, b: any) => a + b) / array.length;

export const transformDistrictParams = (array: Array<object>) => {
  return array.map((e: any) => ({
    value: e.district_code,
    label: e.district_name,
  }));
};

// export const reformatArrayToObjects = (array1: any, array2: any) => {
//   let result = [];
//   for (element of array1) {
//     result.push({ element:array2[i] });
//   }
//   return result;
// };

export const formatTitle = (title: string) => {
  title = title.replace(/_/g, " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export const calculatePredictiveValue = (
  fields: [],
  coeff: [],
  intercept: string
) => {
  console.log(fields);

  let sum = 0;
  fields.map((e: any, index: any) => {
    sum += e.value * coeff[index];
  });
  return sum + intercept;
};
