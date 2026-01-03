import { useState, useEffect } from "react";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import {
  getFrequency,
  generateTimePeriodOptions,
  handlePeriodChange as calculatePeriodChange,
  getStartingMonth,
  getPeriod
} from "../../utils/PeriodCalculationUtils";

export const useEmissionData = () => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [identifier, setIdentifier] = useState();
  const [locationOptions, setLocationOptions] = useState([]);
  const [ghgProtocol, setGhgProtocol] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [scopeData, setScopeData] = useState(null);
  const [fromDate, setFromDate] = useState();
  const [scopeType, setScopeType] = useState();
  const [scope3Categories, setScope3Categories] = useState([]);
  const [scope2Categories, setScope2Categories] = useState([]);
  const [protocol, setProtocol] = useState();
  const [toDate, setToDate] = useState();
  const [initialPeriodToSet, setInitialPeriodToSet] = useState(null);
  const [emissionEntries, setEmissionEntries] = useState([]);
  const [defraScope3Activities, setDefraScope3Activities] = useState([]);

  const start = getStartingMonth();

  // API Functions
  const fetchFrequency = async () => {
    try {
      const frequencyData = await getFrequency(selectedFinancialYear);
      if (frequencyData) {
        setIdentifier(frequencyData);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  };

  const getFinancialYears = async () => {
    try {
      const storedData = localStorage.getItem("financialYearsData");
      if (storedData) {
        const financialYears = JSON.parse(storedData);
        if (financialYears.length > 0) {
          setFinancialYearOptions(financialYears.map(fy => ({value: String(fy.id), label: fy.financial_year_value})));
          setSelectedFinancialYear(String(financialYears[financialYears.length-1].id));
        }
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        if (isSuccess && data?.data.length > 0) {
          const financialYears = data.data;
          localStorage.setItem("financialYearsData", JSON.stringify(data.data));
          setFinancialYearOptions(financialYears.map(fy => ({value: String(fy.id), label: fy.financial_year_value})));
          setSelectedFinancialYear(String(financialYears[financialYears.length-1].id));
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  const getScope3Categories = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope3/categories`,
        {},
        {}
      );
      if (isSuccess && data?.data) {
        setScope3Categories(data.data);
      }
    } catch (error) {
      console.error("Error fetching scope3 categories:", error);
    }
  };

  const getSource = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        setLocationOptions(response.data.data.map(loc => ({
          value: String(loc.id), 
          label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
        })));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const conversionFactors = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/databases/conversionFactors`,
        {},
        { financialYearId: selectedFinancialYear, scope:scopeType },
        "GET"
      );
      if (response.isSuccess && response.data) {
        const apiData = response.data.data.data;
        const ghgProtocol = response.data.data.protocalConfig;
        setGhgProtocol(ghgProtocol);
        setProtocol(response.data.data.protocal);
        setScopeData(apiData);
        if(scopeType === 'SCOPE2'){
        const scope2Categories = apiData?.scope2?.[ghgProtocol]?.dependencyTrees;
        setScope2Categories(scope2Categories)
        }
  

      }
    } catch (error) {
      setScopeData(null);
    }
  };

  // Generate time period options when identifier changes
  useEffect(() => {
    if (identifier) {
      const options = generateTimePeriodOptions(identifier, start);
      setTimePeriodOptions(options);
    }
  }, [identifier, start]);

  // Handle period change using utility function
  const handlePeriodChange = (value) => {
    calculatePeriodChange(
      value,
      selectedFinancialYear,
      financialYearOptions,
      identifier,
      setFromDate,
      setToDate,
      setInitialPeriodToSet
    );
  };

  const updateEmissionEntry = (id, field, value) => {
    setEmissionEntries((prevEntries) => {
      return prevEntries.map((entry) => {
        if (entry.id !== id) return entry;
        return { ...entry, [field]: value };
      });
    });
  };

  const getEmissionEntries = async (financialYearId) => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        { financialYearId: financialYearId, ghgScope:scopeType },
        "GET"
      );

      if (response.isSuccess) {
        const previousEntries = response.data.data || [];
        const uniqueDefraScope3Activities = new Set();

        // Transform database entries to match the frontend format
        const transformedEntries = previousEntries.map((entry) => {
          // Build the complete entry object with all necessary fields
          const transformedEntry = {
            id: entry.id,
            userId: entry.userId,
            sourceId: String(entry.sourceId),
            subLocationId: String(entry.subLocationId),
            fromDate: entry.fromDate,
            toDate: entry.toDate,
            scope: entry.ghgScope,
            financialYearId: String(entry.financialYearId),
            ghgDatabaseId: entry.ghgDatabaseId,
            questionId: entry.questionId,
            inputDetails: entry.inputDetails, 
            period: getPeriod(entry.fromDate, entry.toDate, financialYearOptions.find(fy => String(entry.financialYearId) === fy.value).label, getStartingMonth()),
          };
          if (entry.inputDetails.defraScope3ActivityType) {
            uniqueDefraScope3Activities.add(entry.inputDetails.defraScope3ActivityType);
          }
          return transformedEntry;
        });

        // Update the emission entries state with existing data
        setEmissionEntries(transformedEntries);
        setDefraScope3Activities([...uniqueDefraScope3Activities]);

        return transformedEntries;
      } else {
        console.error("Failed to fetch emission data:", response.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching calculated emissions:", error);
      return [];
    }
  };

  const handleSubmitData = async (entry) => {
    try {

      // Validate required fields
      if (!entry || !selectedFinancialYear) {
        console.error("Entry data and financial year are required");
        return false;
      }

      // Validate inputDetails is not empty
      if (!entry.inputDetails || Object.keys(entry.inputDetails).length === 0) {
        console.error("Input details cannot be empty");
        return false;
      }

      const payload = {
        id: isNaN(Number(entry.id)) ? undefined : entry.id,
        financialYearId: isNaN(Number(entry.financialYearId)) ? null : entry.financialYearId,
        ghgScope: entry.scope,
        ghgDatabaseId: isNaN(Number(entry.ghgDatabaseId)) ? null : entry.ghgDatabaseId,
        questionId: isNaN(Number(entry.questionId)) ? null : entry.questionId,
        sourceId: isNaN(Number(entry.sourceId)) ? null : entry.sourceId,
        subLocationId: isNaN(Number(entry.subLocation)) ? null : entry.subLocationId,
        fromDate: entry.fromDate,
        toDate: entry.toDate,
        inputDetails: JSON.stringify(entry.inputDetails),
      };

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        payload,
        "POST"
      );

      if (response.isSuccess) {
        getEmissionEntries(Number(selectedFinancialYear));
        return true;
      } else {
        throw new Error(
          response.message || "Failed to save emission calculation"
        );
      }
    } catch (error) {
      console.error("Error saving emission calculation:", error);

      // You might want to show an error message to the user here
      // For example:
      // showErrorMessage('Failed to save emission calculation. Please try again.');

      return false;
    }
  };

  // Handle initial period setting
  useEffect(() => {
    if (
      selectedFinancialYear &&
      financialYearOptions.length > 0 &&
      initialPeriodToSet !== null
    ) {
      handlePeriodChange(initialPeriodToSet);
      setInitialPeriodToSet(null);
    }
  }, [selectedFinancialYear, financialYearOptions, initialPeriodToSet]);

  // Initial data loading
  useEffect(() => {
    getFinancialYears();
    getSource();
    getScope3Categories();
  }, []);

  // Load data when financial year changes
  useEffect(() => {
    if (selectedFinancialYear) {
      fetchFrequency();
      conversionFactors(); // Combined API call that depends on financialYearId
      getEmissionEntries(Number(selectedFinancialYear));
    }
  }, [selectedFinancialYear, scopeType]);

  return {
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYearOptions,
    identifier,
    locationOptions,
    timePeriodOptions,
    scopeData,
    fromDate,
    toDate,
    emissionEntries,
    setEmissionEntries,
    handleSubmitData,
    updateEmissionEntry,
    handlePeriodChange,
    setScopeType,
    scope2Categories,
    // Utility values
    start,
    ghgProtocol,
    protocol,
    // API functions for external use if needed
    getFinancialYears,
    getSource,
    conversionFactors,
    getEmissionEntries,
    scope3Categories,
    defraScope3Activities
  };
};
