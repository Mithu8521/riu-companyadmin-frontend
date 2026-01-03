import { useState, useEffect } from "react";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import {
  getFrequency,
  generateTimePeriodOptions,
  handlePeriodChange as calculatePeriodChange,
  getStartingMonth,
} from "../../utils/PeriodCalculationUtils";
import { protocol } from "socket.io-client";

export const useEmissionData = () => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [financialYears, setFinancialYears] = useState([]);
  const [identifier, setIdentifier] = useState();
  const [locations, setLocations] = useState([]);
  const [ghgProtocol, setGhgProtocol] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [scope1Data, setScope1Data] = useState(null);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [initialPeriodToSet, setInitialPeriodToSet] = useState(null);
  const [emissionEntries, setEmissionEntries] = useState([
    {
      id: crypto.randomUUID(),
      location: "",
      period: "",
      financialYear: "",
      activity: "",
      unit: "",
      consumption: "",
      isNew: true,
    },
  ]);

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
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData);
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id);
        }
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        if (isSuccess && data?.data.length > 0) {
          localStorage.setItem("financialYearsData", JSON.stringify(data.data));
          setFinancialYears(data.data);
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id);
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
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
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const conversionFactors = async () => {
    const url = window.location.href;
    let scope;
    if (url.includes('scope-1')) {
      scope = 'SCOPE1'
    } else if (url.includes('scope-2')) {
      scope = 'SCOPE1'
    } else {
      scope = 'SCOPE3'
    }
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/databases/conversionFactors`,
        {},
        { financialYearId: selectedFinancialYear, scope },
        "GET"
      );
      if (response.isSuccess && response.data) {
        const apiData = response.data.data.data;
        const ghgProtocol = response.data.data.protocalConfig;
        setGhgProtocol(ghgProtocol);
        setScope1Data(apiData); // Store the full scope1 data
      }
    } catch (error) {
      setScope1Data(null);
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
      financialYears,
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
    const url = window.location.href;

    let scope;
    if (url.includes('scope-1')) {
      scope = 'SCOPE1'
    } else if (url.includes('scope-2')) {
      scope = 'SCOPE1'
    } else {
      scope = 'SCOPE3'
    }
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        { financialYearId: financialYearId, ghgScope:scope },
        "GET"
      );

      if (response.isSuccess) {
        const previousEntries = response.data.data || [];

        // Transform database entries to match the frontend format
        const transformedEntries = previousEntries.map((entry) => {
          let parsedInputDetails = {};
          let parsedCalculationDetails = {};

          // Parse JSON strings safely
          try {
            if (entry.inputDetails && typeof entry.inputDetails === "string") {
              parsedInputDetails = JSON.parse(entry.inputDetails);
            } else if (
              entry.inputDetails &&
              typeof entry.inputDetails === "object"
            ) {
              parsedInputDetails = entry.inputDetails;
            }
          } catch (error) {
            console.warn(
              `Failed to parse inputDetails for entry ${entry.id}:`,
              error
            );
            parsedInputDetails = {};
          }

          try {
            if (
              entry.calculationDetails &&
              typeof entry.calculationDetails === "string"
            ) {
              parsedCalculationDetails = JSON.parse(entry.calculationDetails);
            } else if (
              entry.calculationDetails &&
              typeof entry.calculationDetails === "object"
            ) {
              parsedCalculationDetails = entry.calculationDetails;
            }
          } catch (error) {
            console.warn(
              `Failed to parse calculationDetails for entry ${entry.id}:`,
              error
            );
            parsedCalculationDetails = {};
          }

          // Build the complete entry object with all necessary fields
          const transformedEntry = {
            // Database fields
            id: entry.id,
            financialYearId: entry.financialYearId,
            sourceId: entry.sourceId,
            subLocationId: entry.subLocationId,
            period: entry.period,
            fromDate: entry.fromDate,
            toDate: entry.toDate,
            consumedAmount: entry.consumedAmount,
            unit: entry.unit,
            category: entry.category,
            method: entry.method,
            ghgScope: entry.ghgScope,
            calculatedEmissions: entry.calculatedEmissions,
            status: entry.status,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
            inputDetails: parsedInputDetails,
            originalCalculationDetails: parsedCalculationDetails,

            // Frontend compatibility fields
            location: entry.sourceId?.toString() || "",
            subLocation: entry.subLocationId?.toString() || "",
            financialYear: entry.financialYearId?.toString() || "",
            consumption: entry.consumedAmount || "",
            emission: entry.calculatedEmissions || "",
            isNew: false, // Existing entries are not new

            // Restore all form fields from inputDetails
            ...parsedInputDetails,

            // Category-specific fields restoration
            ...(entry.category === "stationary" && {
              fuelType: parsedInputDetails.fuelType || "",
              fuel: parsedInputDetails.fuel || "",
              activityAmount:
                parsedInputDetails.activityAmount ||
                parsedInputDetails.consumedAmount ||
                "",
            }),

            ...(entry.category === "mobile" &&
              entry.method === "distance" && {
              vehicleType: parsedInputDetails.vehicleType || "",
              fuelType: parsedInputDetails.fuelType || "",
              vehicleSize: parsedInputDetails.vehicleSize || "",
              distanceTravelled:
                parsedInputDetails.distanceTravelled ||
                parsedInputDetails.consumedAmount ||
                "",
              distanceUnit:
                parsedInputDetails.distanceUnit ||
                parsedInputDetails.unit ||
                "",
            }),

            ...(entry.category === "mobile" &&
              entry.method === "freight" && {
              vehicle: parsedInputDetails.vehicle || "",
              type: parsedInputDetails.type || "",
              weightClass: parsedInputDetails.weightClass || "",
              fuel: parsedInputDetails.fuel || "",
              freightWeight: parsedInputDetails.freightWeight || "",
              weightUnit: parsedInputDetails.weightUnit || "",
              distanceTravelled: parsedInputDetails.distanceTravelled || "",
              distanceUnit: parsedInputDetails.distanceUnit || "",
            }),

            ...(entry.category === "mobile" &&
              entry.method === "public_transport" && {
              transportType: parsedInputDetails.transportType || "",
              class: parsedInputDetails.class || "",
              passengerCount: parsedInputDetails.passengerCount || "",
              distanceTravelled: parsedInputDetails.distanceTravelled || "",
              distanceUnit:
                parsedInputDetails.distanceUnit ||
                parsedInputDetails.unit ||
                "",
            }),

            ...(entry.category === "mobile" &&
              entry.method === "fuel_use" && {
              fuelUseCategory: parsedInputDetails.fuelUseCategory || "",
              fuel: parsedInputDetails.fuel || "",
              transportType: parsedInputDetails.transportType || "",
              vehicleEngineType: parsedInputDetails.vehicleEngineType || "",
              activityAmount:
                parsedInputDetails.activityAmount ||
                parsedInputDetails.consumedAmount ||
                "",
              fuelUnit:
                parsedInputDetails.fuelUnit || parsedInputDetails.unit || "",
            }),

            ...(entry.category === "fugitive" && {
              refrigerant: parsedInputDetails.refrigerant || "",
              initialQuantity: parsedInputDetails.initialQuantity || "",
              initialQuantityUnit: parsedInputDetails.initialQuantityUnit || "",
              quantityPurchased: parsedInputDetails.quantityPurchased || "",
              quantityPurchasedUnit:
                parsedInputDetails.quantityPurchasedUnit || "",
              quantityRecovered: parsedInputDetails.quantityRecovered || "",
              quantityRecoveredUnit:
                parsedInputDetails.quantityRecoveredUnit || "",
            }),



            // Metadata
            ghgDatabaseId: entry.ghgDatabaseId || 5,
            calculationId: entry.calculationId || 1,
            questionId: entry.questionId || null,
            isNew: false
          };

          return transformedEntry;
        });

        console.log(transformedEntries, "transformedEntrytransformedEntry");
        // Update the emission entries state with existing data
        setEmissionEntries((prevEntries) => {
          return [...transformedEntries];
        });

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

  // Helper function to generate calculation formula description
  const getCalculationFormula = (entry) => {
    if (entry.category === "mobile") {
      switch (entry.method) {
        case "distance":
          return `Distance Travelled (${entry.distanceTravelled} ${entry.unit}) × Emission Factor = CO₂e Emissions`;
        case "freight":
          return `Freight Weight (${entry.freightWeight} ${entry.weightUnit}) × Distance (${entry.distanceTravelled} ${entry.distanceUnit}) × Emission Factor = CO₂e Emissions`;
        case "public_transport":
          return `Passengers (${entry.passengerCount}) × Distance (${entry.distanceTravelled} ${entry.unit}) × Emission Factor = CO₂e Emissions`;
        case "fuel_use":
          return `Fuel Consumption (${entry.activityAmount} ${entry.unit}) × Emission Factor = CO₂e Emissions`;
        default:
          return `Activity Amount × Emission Factor = CO₂e Emissions`;
      }
    } else if (entry.category === "fugitive") {
      return `(Initial Quantity + Quantity Purchased - Quantity Recovered) × Global Warming Potential = CO₂e Emissions`;
    } else {
      return `Activity Amount (${entry.activityAmount} ${entry.unit}) × Emission Factor = CO₂e Emissions`;
    }
  };

  const getEmissionFactor = (formData) => {
    try {

      let dataSource;
      let records = [];

      let category = formData.category;
      let selectedMethod = formData.method;

      if (category === "mobile" && selectedMethod) {
        dataSource = scope1Data[category][ghgProtocol]?.data?.[selectedMethod];
        if (selectedMethod === "fuel_use" && dataSource?.data) {
          const fuelUseCategory = formData?.fuelUseCategory;

          if (fuelUseCategory && dataSource.data[fuelUseCategory]?.records) {
            records = dataSource.data[fuelUseCategory].records;
          }
        } else if (dataSource?.records) {
          records = dataSource.records;
        }
      } else if (category === "stationary") {
        dataSource = scope1Data[category][ghgProtocol];
        if (dataSource?.data && Array.isArray(dataSource.data)) {
          records = dataSource.data;
        }
      } else if (category === "fugitive") {
        dataSource = scope1Data[category][ghgProtocol];
        if (dataSource?.data && Array.isArray(dataSource.data)) {
          records = dataSource.data;
        }
      }


      if (!records || records.length === 0) {
        return null;
      }

      let filteredRecords = [...records];

      let frontendFields = [];
      if (category === "mobile" && selectedMethod) {
        frontendFields = scope1Data[category][ghgProtocol]?.data?.[selectedMethod]?.frontendFields?.fields || [];
      } else {
        frontendFields = scope1Data[category][ghgProtocol]?.frontendFields?.fields || [];
      }

      const activityFields = [
        'activityAmount', 'distanceTravelled', 'freightWeight',
        'passengerCount', 'initialQuantity', 'quantityPurchased', 'quantityRecovered',
        'consumption', 'unit', 'id', 'location', 'period', 'financialYear', 'isNew',
        'method', 'category', 'initialQuantityUnit', 'quantityPurchasedUnit', 'quantityRecoveredUnit'
      ];

      const filterableData = Object.entries(formData || {}).filter(([fieldName, fieldValue]) => {
        return fieldValue &&
          fieldValue !== "" &&
          !activityFields.includes(fieldName) &&
          typeof fieldValue === 'string';
      });

      filterableData.forEach(([fieldName, fieldValue]) => {
        const fieldConfig = frontendFields.find(f => f.name === fieldName);
        const backendField = fieldConfig?.backendField || fieldName;

        filteredRecords = filteredRecords.filter(record => {
          const recordValue = record[backendField];
          const matches = recordValue === fieldValue;
          return matches;
        });

      });


      if (filteredRecords.length === 0) {
        return null;
      }
      console.log(filteredRecords, "filteredRecordsfilteredRecords")
      return filteredRecords[0];




    } catch (error) {
      return null;
    }
  };

  const handleSubmitData = async (entry) => {
    try {
      if (!fromDate || !toDate) {
        console.error("Date range is required");
        return false;
      }

      // Validate required fields
      if (!entry || !selectedFinancialYear) {
        console.error("Entry data and financial year are required");
        return false;
      }

      // Get the appropriate consumption amount based on method/category
      let consumedAmount = 0;
      if (entry.category === "mobile") {
        if (entry.method === "distance") {
          consumedAmount = Number(entry.distanceTravelled || 0);
        } else if (entry.method === "freight") {
          // For freight, might need combined calculation
          const freightWeight = Number(entry.freightWeight || 0);
          const distanceTravelled = Number(entry.distanceTravelled || 0);
          consumedAmount = freightWeight * distanceTravelled; // tonne-km
        } else if (entry.method === "public_transport") {
          const passengerCount = Number(entry.passengerCount || 1);
          const distanceTravelled = Number(entry.distanceTravelled || 0);
          consumedAmount = passengerCount * distanceTravelled; // passenger-km
        } else if (entry.method === "fuel_use") {
          consumedAmount = Number(
            entry.activityAmount || entry.consumption || 0
          );
        }
      } else if (entry.category === "fugitive") {
        // For fugitive emissions - mass balance calculation
        const initialQuantity = Number(entry.initialQuantity || 0);
        const quantityPurchased = Number(entry.quantityPurchased || 0);
        const quantityRecovered = Number(entry.quantityRecovered || 0);
        consumedAmount =
          initialQuantity + quantityPurchased - quantityRecovered;
      } else {
        // For stationary and other categories
        consumedAmount = Number(entry.activityAmount || entry.consumption || 0);
      }

      // Get the appropriate unit based on method/category
      let unit = entry.unit;
      if (entry.category === "mobile") {
        if (entry.method === "distance") {
          unit = entry.unit || "km";
        } else if (entry.method === "freight") {
          unit = "tonne-km"; // Combined unit
        } else if (entry.method === "public_transport") {
          unit = "passenger-km"; // Combined unit
        } else if (entry.method === "fuel_use") {
          unit = entry.unit;
        }
      } else if (entry.category === "fugitive") {
        unit = entry.initialQuantityUnit || "kg";
      }

      // Prepare input details object - contains all form input data
      const inputDetails = {
        // Basic information
        financialYear: selectedFinancialYear,
        location: entry.location,
        subLocation: entry.subLocation || null,
        period: entry.period,
        category: entry.category,
        method: entry.method || null,

        // Activity/consumption data
        consumedAmount: consumedAmount,
        unit: unit,

        // Category-specific input fields
        ...(entry.category === "stationary" && {
          fuelType: entry.fuelType,
          fuel: entry.fuel,
          activityAmount: entry.activityAmount,
        }),

        ...(entry.category === "mobile" &&
          entry.method === "distance" && {
          vehicleType: entry.vehicleType,
          fuelType: entry.fuelType,
          vehicleSize: entry.vehicleSize,
          distanceTravelled: entry.distanceTravelled,
          distanceUnit: entry.unit,
        }),

        ...(entry.category === "mobile" &&
          entry.method === "freight" && {
          vehicle: entry.vehicle,
          type: entry.type,
          weightClass: entry.weightClass,
          fuel: entry.fuel,
          freightWeight: entry.freightWeight,
          weightUnit: entry.weightUnit,
          distanceTravelled: entry.distanceTravelled,
          distanceUnit: entry.distanceUnit,
        }),

        ...(entry.category === "mobile" &&
          entry.method === "public_transport" && {
          transportType: entry.transportType,
          class: entry.class,
          passengerCount: entry.passengerCount,
          distanceTravelled: entry.distanceTravelled,
          distanceUnit: entry.unit,
        }),

        ...(entry.category === "mobile" &&
          entry.method === "fuel_use" && {
          fuelUseCategory: entry.fuelUseCategory,
          fuel: entry.fuel,
          transportType: entry.transportType,
          vehicleEngineType: entry.vehicleEngineType,
          activityAmount: entry.activityAmount,
          fuelUnit: entry.unit,
        }),

        ...(entry.category === "fugitive" && {
          refrigerant: entry.refrigerant,
          initialQuantity: entry.initialQuantity,
          initialQuantityUnit: entry.initialQuantityUnit,
          quantityPurchased: entry.quantityPurchased,
          quantityPurchasedUnit: entry.quantityPurchasedUnit,
          quantityRecovered: entry.quantityRecovered,
          quantityRecoveredUnit: entry.quantityRecoveredUnit,
        }),

        // Metadata
        dateRange: {
          fromDate: fromDate,
          toDate: toDate,
        },
        entryId: entry.id,
        isNew: entry.isNew || false,
        timestamp: new Date().toISOString(),
      };

      // Validate inputDetails is not empty
      if (!inputDetails || Object.keys(inputDetails).length === 0) {
        console.error("Input details cannot be empty");
        return false;
      }


      const url = window.location.href;
      let scope;
      if (url.includes('scope-1')) {
        scope = 'SCOPE1'
      } else if (url.includes('scope-2')) {
        scope = 'SCOPE1'
      } else {
        scope = 'SCOPE3'
      }



      const calculationDetail = getEmissionFactor(entry);

      const payload = {
        id: entry.isNew ? undefined : entry.id,
        financialYearId: Number(selectedFinancialYear),
        ghgDatabaseId: Number(calculationDetail.ghgDatabaseId),
        calculationId: Number(calculationDetail.id),
        questionId: entry.questionId ? Number(entry.questionId) : null,
        sourceId: Number(entry.location),
        subLocationId: entry.subLocation ? Number(entry.subLocation) : null,
        fromDate: fromDate,
        toDate: toDate,
        period: Number(entry.period),
        consumedAmount: consumedAmount,
        unit: unit,
        category: entry.category,
        method: entry.method || null,
        ghgScope: scope,
        inputDetails: JSON.stringify(entry),
        calculationDetails: JSON.stringify(calculationDetail),
        status: true,
      };

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        payload,
        "POST"
      );

      if (response.isSuccess) {
        getEmissionEntries(Number(selectedFinancialYear));

        console.log("Emission calculation saved successfully:", response);

        // You might want to update the UI or show a success message here
        // For example:
        // showSuccessMessage('Emission calculation saved successfully');
        // refreshEmissionsList();

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

  const createNewModalEntry = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      location: "",
      period: "",
      financialYear: selectedFinancialYear,
      activity: "",
      unit: "",
      consumption: "",
      isNew: true,
    };

    setEmissionEntries((prev) => {
      const hasNewEntry = prev.some((entry) => entry.isNew);
      if (hasNewEntry) {
        return prev;
      }
      return [...prev, newEntry];
    });

    return newEntry.id;
  };

  // Handle initial period setting
  useEffect(() => {
    if (
      selectedFinancialYear &&
      financialYears.length > 0 &&
      initialPeriodToSet !== null
    ) {
      handlePeriodChange(initialPeriodToSet);
      setInitialPeriodToSet(null);
    }
  }, [selectedFinancialYear, financialYears, initialPeriodToSet]);

  // Initial data loading
  useEffect(() => {
    getFinancialYears();
    getSource();
  }, []);

  // Load data when financial year changes
  useEffect(() => {
    if (selectedFinancialYear) {
      fetchFrequency();
      conversionFactors(); // Combined API call that depends on financialYearId
      getEmissionEntries(Number(selectedFinancialYear));
    }
  }, [selectedFinancialYear,window.location.href]);

  return {
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYears,
    identifier,
    locations,
    timePeriodOptions,
    scope1Data,
    fromDate,
    toDate,
    emissionEntries,
    setEmissionEntries,
    handleSubmitData,
    updateEmissionEntry,
    handlePeriodChange,
    createNewModalEntry,
    // Utility values
    start,
    ghgProtocol,
    // API functions for external use if needed
    getFinancialYears,
    getSource,
    conversionFactors,
    getEmissionEntries,
  };
};
