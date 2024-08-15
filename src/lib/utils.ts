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
  const districts = array.map((e: any) => ({
    value: e.district_code,
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

export const calculateLinearPredictiveValue = (
  fields: string[],
  coeff: number[],
  intercept: number
) => {
  let sum = 0;
  fields.map((e: any, index: any) => {
    // sum += parseInt(e.value) * coeff[index];
    sum += parseInt(e) * coeff[index];
  });

  return sum + intercept;
};
