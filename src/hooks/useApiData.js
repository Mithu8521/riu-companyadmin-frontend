// src/hooks/useApiData.js
import { useState, useEffect } from "react";
import { apiCall } from "../_services/apiCall";
import config from "../config/config.json";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const useFrameworks = () => {
  const [frameworks, setFrameworks] = useState([]);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const storedFrameworks = safeParse(localStorage.getItem("frameworks"));
        if (storedFrameworks) {
            setFrameworks(storedFrameworks);
            return;
        }

        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
          {},
          { type: "ALL" }
        );
        if (isSuccess && data?.data) {
          setFrameworks(data.data);
          localStorage.setItem('frameworks', JSON.stringify(data.data));
        }
      } catch (error) {
        console.error("Error fetching framework:", error);
      }
    };

    fetchFrameworks();
  }, []);

  return frameworks;
};

export const useSources = () => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      const storedSources = safeParse(localStorage.getItem("sources"));
      if (storedSources) {
        setSources(storedSources);
        return;
      }

      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
          {},
          {},
          "GET"
        );
        if (isSuccess && data?.data) {
          setSources(data.data);
          localStorage.setItem("sources", JSON.stringify(data.data));
        }
      } catch (error) {
        console.error("Error fetching source data:", error);
      }
    };

    fetchSources();
  }, []);

  return sources;
};

export const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState([]);

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const storedFinancialYears = safeParse(localStorage.getItem("financialYears"));

        if (storedFinancialYears) {
            const financialYears = storedFinancialYears.sort((a, b) => b.financial_year_value.localeCompare(a.financial_year_value));
            setFinancialYears(financialYears);
            return;
        }

        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        if (isSuccess && data?.data?.length > 0) {
          localStorage.setItem("financialYears", JSON.stringify(data.data));
          const financialYears = data.data.sort((a, b) => b.financial_year_value.localeCompare(a.financial_year_value));
          setFinancialYears(financialYears);
        }
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    };

    fetchFinancialYears();
  }, []);

  return financialYears;
};
