import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  transformObject,
  isLoading,
  isFinished,
  isError,
  isIdle,
  formatTitle,
  getMetricUnit,
  getAnalyticsToolType,
  getFillColor,
} from "./utils";
import { requestStatus, toolType } from "@/constants";
import { vi, beforeEach } from "vitest";

vi.mock("@/constants", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/constants")>();
  return {
    ...mod,
    COLOR_SCALES: {}, // Will be set in beforeEach
    MJO_COLOR_SCALE: [], // Will be set in beforeEach
  };
});

describe("formatDate", () => {
  it("should format a Date object to YYYY-MM-DD string", () => {
    const date = new Date("2023-01-15T10:00:00Z");
    const expectedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
    expect(formatDate(date)).toBe(expectedDate);
  });

  it("should return an empty string if date is null or undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });
});

describe("transformObject", () => {
  it("should transform an object into an array of { value: key, label: value }", () => {
    const obj = { a: "Apple", b: "Banana" };
    expect(transformObject(obj)).toEqual([
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ]);
  });

  it("should handle empty object", () => {
    expect(transformObject({})).toEqual([]);
  });
});

describe("requestStatus functions", () => {
  it("isLoading should return true for isLoading status", () => {
    expect(isLoading(requestStatus.isLoading)).toBe(true);
    expect(isLoading(requestStatus.isFinished)).toBe(false);
  });

  it("isFinished should return true for isFinished status", () => {
    expect(isFinished(requestStatus.isFinished)).toBe(true);
    expect(isFinished(requestStatus.isLoading)).toBe(false);
  });

  it("isError should return true for isError status", () => {
    expect(isError(requestStatus.isError)).toBe(true);
    expect(isError(requestStatus.idle)).toBe(false);
  });

  it("isIdle should return true for idle status", () => {
    expect(isIdle(requestStatus.idle)).toBe(true);
    expect(isIdle(requestStatus.isError)).toBe(false);
  });

  it("should handle undefined status correctly", () => {
    expect(isLoading(undefined)).toBe(false);
    expect(isFinished(undefined)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isIdle(undefined)).toBe(false);
  });
});

describe("formatTitle", () => {
  it("should format a snake_case string to Title Case", () => {
    expect(formatTitle("crop_production_monthly")).toBe(
      "Crop production monthly"
    );
    expect(formatTitle("temperature_anomaly")).toBe("Temperature anomaly");
    expect(formatTitle("simple_title")).toBe("Simple title");
  });

  it("should handle single word titles", () => {
    expect(formatTitle("rainfall")).toBe("Rainfall");
  });

  it("should handle empty string", () => {
    expect(formatTitle("")).toBe("");
  });
});

describe("getMetricUnit", () => {
  it('should return (°C) for "tavg"', () => {
    expect(getMetricUnit("tavg")).toBe("(°C)");
  });

  it("should return (mm) for other indicators", () => {
    expect(getMetricUnit("rainfall")).toBe("(mm)");
    expect(getMetricUnit("temp")).toBe("(mm)");
  });
});

describe("getAnalyticsToolType", () => {
  it("should return toolType.lanina for /lanina-analytics", () => {
    expect(getAnalyticsToolType("/lanina-analytics")).toBe(toolType.lanina);
  });

  it("should return toolType.mjo for /analytics-mjo", () => {
    expect(getAnalyticsToolType("/analytics-mjo")).toBe(toolType.mjo);
  });

  it("should return toolType.elnino for other paths", () => {
    expect(getAnalyticsToolType("/elnino-analytics")).toBe(toolType.elnino);
    expect(getAnalyticsToolType("/some-other-path")).toBe(toolType.elnino);
  });
});

describe("getFillColor", () => {
  const mockMapFilter = { dataVariable: "rainfall" };

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetModules();
    // Re-mock constants for each test to ensure isolation
    vi.mock("@/constants", async (importOriginal) => {
      const mod = await importOriginal<typeof import("@/constants")>();
      return {
        ...mod,
        COLOR_SCALES: {}, // Default empty mock, will be set per test
        MJO_COLOR_SCALE: [], // Default empty mock, will be set per test
      };
    });
  });

  it("should return the exact match color if available", async () => {
    const { COLOR_SCALES, toolType } = await import("@/constants");
    const { getFillColor } = await import("./utils");

    vi.mocked(COLOR_SCALES).rainfall = [
      { threshold: 0, color: "#000000", exact: true },
      { threshold: 10, color: "#ff0000" },
    ];
    expect(getFillColor(mockMapFilter, 0, toolType.elnino)).toBe("#000000");
  });

  it("should return the correct color based on threshold for non-MJO scales", async () => {
    const { COLOR_SCALES, toolType } = await import("@/constants");
    const { getFillColor } = await import("./utils");

    vi.mocked(COLOR_SCALES).rainfall = [
      { threshold: 10, color: "#ff0000" },
      { threshold: 20, color: "#00ff00" },
      { threshold: 30, color: "#0000ff" },
    ];
    expect(getFillColor(mockMapFilter, 5, toolType.elnino)).toBe("#ff0000");
    expect(getFillColor(mockMapFilter, 15, toolType.elnino)).toBe("#00ff00");
    expect(getFillColor(mockMapFilter, 25, toolType.elnino)).toBe("#0000ff");
    expect(getFillColor(mockMapFilter, 35, toolType.elnino)).toBe("#0000ff"); // Value greater than all thresholds
  });

  it("should return the correct color for MJO scale", async () => {
    const { MJO_COLOR_SCALE, toolType } = await import("@/constants");
    const { getFillColor } = await import("./utils");

    // Clear and push new values to the mocked array
    MJO_COLOR_SCALE.splice(
      0,
      MJO_COLOR_SCALE.length,
      { threshold: 0, color: "#mjo0", exact: true },
      { threshold: 1, color: "#mjo1" },
      { threshold: 2, color: "#mjo2" }
    );
    expect(getFillColor(mockMapFilter, 0, toolType.mjo)).toBe("#mjo0");
    expect(getFillColor(mockMapFilter, 0.5, toolType.mjo)).toBe("#mjo1");
    expect(getFillColor(mockMapFilter, 1.5, toolType.mjo)).toBe("#mjo2");
    expect(getFillColor(mockMapFilter, 2.5, toolType.mjo)).toBe("#mjo2"); // Value greater than all thresholds
  });

  it("should return #fff if scale is not found", async () => {
    const { COLOR_SCALES, toolType } = await import("@/constants");
    const { getFillColor } = await import("./utils");

    vi.mocked(COLOR_SCALES).nonExistent = undefined; // Ensure it's not found
    const mockMapFilter = { dataVariable: "nonExistent" };
    expect(getFillColor(mockMapFilter, 10, toolType.elnino)).toBe("#fff");
  });

  it("should return null if no matching threshold is found and no default", async () => {
    const { COLOR_SCALES, toolType } = await import("@/constants");
    const { getFillColor } = await import("./utils");

    vi.mocked(COLOR_SCALES).emptyScale = [];
    expect(
      getFillColor({ dataVariable: "emptyScale" }, 10, toolType.elnino)
    ).toBeNull();
  });
});
