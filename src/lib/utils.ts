/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const transformProvinceArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.province_id, label: e.province }));

export const transformDistrictArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.district_id, label: e.district }));

export const transfromTehsilArray = (array: Array<object>) =>
  array.map((e: any) => ({ value: e.tehsil_id, label: e.tehsil }));

export const getAverage = (array: any) =>
  array.reduce((a: any, b: any) => a + b) / array.length;
