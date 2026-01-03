import { useEffect, useState } from "react";
import { apiCall } from "../_services/apiCall";
import config from "../config/config.json";

// Constants
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get starting month from localStorage
export const getStartingMonth = () => {
  return JSON.parse(localStorage.getItem("currentUser"))?.starting_month || 1;
};

// API call to get frequency/identifier
export const getFrequency = async (financialYearId) => {
  try {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: financialYearId },
      "GET",
    );
    if (isSuccess) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching frequency:", error);
    return null;
  }
};

// Calculate date range based on period type
export const calculateDateRange = (type, period, startingMonth, year) => {
  const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
  const startYear = year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
  const endMonth = ((startMonth - 1 + type) % 12) + 1;
  const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

  const formatDate = (month, year) => `${year}-${month < 10 ? `0${month}` : month}`;

  return {
    fromDate: formatDate(startMonth, startYear),
    toDate: formatDate(endMonth, endYear),
  };
};

/**
 * Deduce the type (number of months in the period) from date strings.
 * Assumes toDate is exclusive.
 *
 * @param {string} fromDateStr - e.g., "2024-07-01"
 * @param {string} toDateStr - e.g., "2024-09-01"
 * @returns {number}
 */
const deduceType = (fromDateStr, toDateStr) => {
  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);

  const fromYear = fromDate.getFullYear();
  const fromMonth = fromDate.getMonth(); // 0-based
  const toYear = toDate.getFullYear();
  const toMonth = toDate.getMonth(); // exclusive

  const monthDiff = (toYear - fromYear) * 12 + (toMonth - fromMonth);
  return monthDiff;
};

export const getPeriodValue = (fromDateStr, toDateStr) => {
  if (!fromDateStr || !toDateStr) return "";

  const [fromYear, fromMonth] = fromDateStr.split("-").map(Number);
  const [toYear, toMonth] = toDateStr.split("-").map(Number);

  const startMonth = MONTHS[fromMonth - 1];
  const endMonth = MONTHS[(toMonth - 1 + 12 - 1) % 12]; // one month before toDate

  if (startMonth === endMonth) {
    return startMonth; // Single month period
  }

  return `${startMonth} - ${endMonth}`;
}

/**
 * Get the period number based on the fromDate and financial year.
 *
 * @param {string} fromDateStr - e.g., "2024-07"
 * @param {string} toDateStr - e.g., "2024-09"
 * @param {string} financialYear - e.g., "2024-2025"
 * @param {number} startingMonth - 1 (Jan) to 12 (Dec), e.g., 4 for April
 * @returns {string} - 1-based period number as string
 */
export const getPeriod = (fromDateStr, toDateStr, financialYear, startingMonth) => {
  if (!fromDateStr || !toDateStr || !financialYear || !startingMonth) {
    console.error(`missing required fields fromDateStr: ${fromDateStr}, toDateStr: ${toDateStr}, financialYear: ${financialYear} and startingMonth: ${startingMonth}`);
    return;
  }
  const type = deduceType(fromDateStr, toDateStr); // 1 (monthly), 3 (quarterly), 6, or 12
  const [fyStartYearStr] = financialYear.split("-");
  const fyStartYear = parseInt(fyStartYearStr, 10);

  const [fromYearStr, fromMonthStr] = fromDateStr.split("-");
  const fromYear = parseInt(fromYearStr, 10);
  const fromMonth = parseInt(fromMonthStr, 10);

  // Actual calendar month offset from FY start
  let monthOffset = (fromYear - fyStartYear) * 12 + (fromMonth - startingMonth);
  if (monthOffset < 0) monthOffset += 12; // handle wraparound for Jan/Feb/March in next calendar year

  const period = Math.floor(monthOffset / type) + 1;

  return String(period);
};

export const generateTimePeriodOptions = (frequency , startingMonth) => {
  const start = startingMonth || getStartingMonth();
  const options = [];

  if (!frequency) return options;

  if (frequency === "MONTHLY") {
    const monthOrder = [...MONTHS.slice(start - 1), ...MONTHS.slice(0, start - 1)];
    return monthOrder.map((month, index) => ({
      label: month,
      value: String(index + 1),
    }));
  }

  if (frequency === "QUARTERLY") {
    for (let i = 0; i < 4; i++) {
      const quarterStartIndex = (start - 1 + i * 3) % 12;
      const quarterEndIndex = (quarterStartIndex + 2) % 12;
      const quarterLabel = `${MONTHS[quarterStartIndex]} - ${MONTHS[quarterEndIndex]}`;
      options.push({ label: quarterLabel, value: String(i + 1) });
    }
    return options;
  }

  if (frequency === "HALF_YEARLY") {
    for (let i = 0; i < 2; i++) {
      const halfStartIndex = (start - 1 + i * 6) % 12;
      const halfEndIndex = (halfStartIndex + 5) % 12;
      const halfLabel = `${MONTHS[halfStartIndex]} - ${MONTHS[halfEndIndex]}`;
      options.push({ label: halfLabel, value: String(i + 1) });
    }
    return options;
  }

  if (frequency === "YEARLY") {
    const startIndex = start - 1;
    const endIndex = (startIndex + 11) % 12;
    options.push({
      label: `${MONTHS[startIndex]} - ${MONTHS[endIndex]}`,
      value: '1',
    });
    return options;
  }

  return options;
};

export const handlePeriodChange = (
  value, 
  financialYearId, 
  financialYearOptions, 
  frequency, 
  setFromDate, 
  setToDate,
) => {
  if (!financialYearId || !financialYearOptions.length) {
    console.error(`Missing financialYearId: ${financialYearId} and financialYearOptions ${financialYearOptions}`);
    return;
  }

  const foundYear = financialYearOptions.find((item) => item.value == financialYearId);
  if (!foundYear) {
    console.error('Financial year not found');
    return;
  }

  const years = foundYear.label;
  const year = parseInt(years.split("-")[0], 10);
  const start = getStartingMonth(); // e.g., 4 for April

  let dateRange;

  if (frequency === "HALF_YEARLY") {
    dateRange = calculateDateRange(6, value, start, year);
  } else if (frequency === "QUARTERLY") {
    dateRange = calculateDateRange(3, value, start, year);
  } else if (frequency === "MONTHLY") {
    dateRange = calculateDateRange(1, value, start, year);
  } else if (frequency === "YEARLY") {
    dateRange = calculateDateRange(12, 1, start, year);
  }

  if (dateRange) {
    const formatToYYYYMM = (date) => {
      const d = new Date(date);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${y}-${m}`;
    };

    const formattedFromDate = formatToYYYYMM(dateRange.fromDate);
    const formattedToDate = formatToYYYYMM(dateRange.toDate);

    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    return {fromDate: formattedFromDate, toDate: formattedToDate};
  }
};


export default {
  getStartingMonth,
  getFrequency,
  getPeriod,
  getPeriodValue,
  calculateDateRange,
  generateTimePeriodOptions,
  handlePeriodChange,
};