import { useState, useEffect } from "react"
import { apiCall } from "../../../../_services/apiCall"
import config from "../../../../config/config.json"
import { 
  getFrequency, 
  generateTimePeriodOptions, 
  handlePeriodChange as calculatePeriodChange,
  getStartingMonth 
} from "../../utils/PeriodCalculationUtils"

export const useEmissionDefraData = () => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("")
  const [financialYears, setFinancialYears] = useState([])
  const [identifier, setIdentifier] = useState()
  const [locations, setLocations] = useState([])
  const [timePeriodOptions, setTimePeriodOptions] = useState([])
  const [activities, setActivities] = useState([])
  const [units, setUnits] = useState([])
  const [scope2Data, setScope2Data] = useState(null)
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [initialPeriodToSet, setInitialPeriodToSet] = useState(null)
  const [emissionEntries, setEmissionEntries] = useState([
    {
      id: crypto.randomUUID(),
      location: "",
      period: "",
      financialYear: "",
      activity: "",
      unit: "",
      consumption: "",
      isNew: true
    },
  ])

  const start = getStartingMonth();

  // API Functions
  const fetchFrequency = async () => {
    try {
      const frequencyData = await getFrequency(selectedFinancialYear);
      if (frequencyData) {
        setIdentifier(frequencyData);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error)
    }
  }

  const getFinancialYears = async () => {
    try {
      const storedData = localStorage.getItem("financialYearsData")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        if (parsedData.length > 0) {
          setFinancialYears(parsedData)
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id)
        }
      } else {
        const { isSuccess, data } = await apiCall(`${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`, {}, {})
        if (isSuccess && data?.data.length > 0) {
          localStorage.setItem("financialYearsData", JSON.stringify(data.data))
          setFinancialYears(data.data)
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id)
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
    }
  }

  const getSource = async () => {
    try {
      const response = await apiCall(`${config.POSTLOGIN_API_URL_COMPANY}getSource`, {}, {}, "GET")
      if (response.isSuccess) {
        setLocations(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const getActivitiesAndUnits = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/databases/conversionFactors`,
        {},
        { financialYearId: selectedFinancialYear, scope: 'scope2' },
        "GET"
      );
      if (response.isSuccess && response.data) {
        const apiData = response.data.data;
        setScope2Data(apiData); // Store the full scope2 data
        
        const scope2Items = apiData?.scope2?.defra?.data || [];
        
        // Extract unique activities with their details
        const uniqueActivities = [...new Set(scope2Items.map(item => item.activity))]
          .map((activity) => {
            const originalItem = scope2Items.find(item => item.activity === activity);
            return {
              id: originalItem?.id || activity,
              name: activity,
              factor: originalItem?.factor,
              unit: originalItem?.unit,
              ghgDatabaseId: originalItem?.ghgDatabaseId
            };
          });
        
        // Extract unique units
        const uniqueUnits = [...new Set(scope2Items.map(item => item.unit))]
          .map((unit) => ({
            id: unit, // Use unit name as ID for easier matching
            name: unit
          }));

        setActivities(uniqueActivities);
        setUnits(uniqueUnits);
      }
    } catch (error) {
      console.error("Error fetching activities and units:", error)
      setActivities([]);
      setUnits([]);
      setScope2Data(null);
    }
  }

  const getEmissionEntries = async (financialYearId) => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        { financialYearId: financialYearId ,ghgScope:"SCOPE2"},
        "GET"
      );
      if (response.isSuccess) {
        const previousEntries = response.data.data || [];

        const newEntries = [
          {
            id: crypto.randomUUID(),
            location: "",
            period: "",
            financialYear: "",
            activity: "",
            unit: "",
            consumption: "",
            isNew: true
          },
          ...previousEntries.map(entry => ({
            id: entry.id,
            financialYearId: entry.financialYearId,
            location: entry.sourceId?.toString(),
            period: entry.period,
            financialYear: entry.financialYearId?.toString(),
            activity: entry.calculationDetails.activity?.toString(), // Map to conversion factor ID
            activityName: entry.activity, // Store activity name
            unit: entry.calculationDetails.unit,
            consumption: entry.consumedAmount?.toString(),
            emission: entry.totalEmission || entry.emission,
            fromDate: entry.fromDate,
            toDate: entry.toDate,
            calculationDetails: entry.calculationDetails,
            isNew: false
          }))
        ];

        setEmissionEntries(newEntries);

        // Set date range from existing entries
        newEntries.forEach(entry => {
          if (!entry.isNew && entry.fromDate && entry.toDate) {
            setFromDate(entry.fromDate);
            setToDate(entry.toDate);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching emission entries:", error);
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
    setEmissionEntries(prevEntries => {
      return prevEntries.map(entry => {
        if (entry.id !== id) return entry;
        return { ...entry, [field]: value };
      });
    });
  };

  const handleSubmitData = async (entry) => {
    try {
      if (!fromDate || !toDate) {
        console.error('Date range is required');
        return false;
      }

      // Find the matching activity data from scope2Data
      const activityData = scope2Data?.scope2?.defra?.data?.find(item => 
        item.id === Number(entry.activity) || 
        item.activity === entry.activityName
      );

      if (!activityData) {
        console.error('Activity data not found');
        return false;
      }

      const payload = {
        id: entry.isNew ? undefined : entry.id,
        financialYearId: Number(entry.financialYear),
        ghgDatabaseId: Number(activityData.ghgDatabaseId),
        calculationId: Number(activityData.id),
        sourceId: Number(entry.location),
        fromDate: fromDate,
        toDate: toDate,
        period: Number(entry.period),
        consumedAmount: Number(entry.consumption || 0),
        activity: activityData.activity,
        unit: activityData.unit,
        ghgScope:'SCOPE2',
        factor: Number(activityData.factor),
        calculationDetails: JSON.stringify(activityData),
        status: true
      };

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope/emissions`,
        {},
        payload,
        "POST"
      );

      if (response.isSuccess) {
        getEmissionEntries(Number(selectedFinancialYear));
        
        if (entry.isNew) {
          setEmissionEntries(prevEntries =>
            prevEntries.filter(e => e.id !== entry.id)
          );
        }
        return true;
      } else {
        throw new Error('Failed to save emission entry');
      }
    } catch (error) {
      console.error('Error saving emission entry:', error);
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
      isNew: true
    };

    setEmissionEntries(prev => {
      const hasNewEntry = prev.some(entry => entry.isNew);
      if (hasNewEntry) {
        return prev;
      }
      return [...prev, newEntry];
    });

    return newEntry.id;
  };

  // Handle initial period setting
  useEffect(() => {
    if (selectedFinancialYear && financialYears.length > 0 && initialPeriodToSet !== null) {
      handlePeriodChange(initialPeriodToSet);
      setInitialPeriodToSet(null);
    }
  }, [selectedFinancialYear, financialYears, initialPeriodToSet]);

  // Initial data loading
  useEffect(() => {
    getFinancialYears()
    getSource()
  }, [])

  // Load data when financial year changes
  useEffect(() => {
    if (selectedFinancialYear) {
      fetchFrequency();
      getActivitiesAndUnits(); // Combined API call that depends on financialYearId
      getEmissionEntries(Number(selectedFinancialYear))
    }
  }, [selectedFinancialYear])

  return {
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYears,
    identifier,
    locations,
    timePeriodOptions,
    activities,
    units,
    scope2Data,
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
    // API functions for external use if needed
    getFinancialYears,
    getSource,
    getActivitiesAndUnits,
    getEmissionEntries,
  }
}