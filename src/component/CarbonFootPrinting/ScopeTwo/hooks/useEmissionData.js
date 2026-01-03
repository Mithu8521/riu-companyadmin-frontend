import { useState, useEffect } from "react"
import { apiCall } from "../../../../_services/apiCall"
import config from "../../../../config/config.json"

export const useEmissionData = () => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("")
  const [financialYears, setFinancialYears] = useState([])
  const [identifier, setIdentifier] = useState()
  const [locations, setLocations] = useState([])
  const [timePeriodOptions, setTimePeriodOptions] = useState([])
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [fuelType, setFuelType] = useState([] || [])
  const [fuels, setFuels] = useState([] || [])
  const [scope1Data, setScope1Data] = useState([])
  const [allFuelType, setAllFuelType] = useState([])
  const [selectedFuelType, setSelectedFuelType] = useState("")
  const [initialPeriodToSet, setInitialPeriodToSet] = useState(null)
  const [fuelError, setFuelError] = useState("")
  const [category, setCategory] = useState("")
  const [mobileFuel, setMobileFuel] = useState([] || [])
  const [transportType, setTransportType] = useState([] || [])
  const [engineTypes, setEngineTypes] = useState([] || [])
  const [categoryData, setCategoryData] = useState([])  
  const [selectedFuelName, setFuelName] = useState("")
  const [stationaryFuel, setStationaryFuel] = useState()
  const [engineTypeOptions, setEngineTypeOptions] = useState([])
  const [selectedStationaryFuelType, setSelectedStationaryFuelType] = useState("")
  const [selectedStationaryFuel, setSelectedStationaryFuel] = useState("")
  const [selectedNewMobileFuel, setSelectedNewMobileFuel] = useState("")
  const [selectedTransportType, setSelectedNewTransportType] = useState("")
  const [selectedEngineType, setSelectedNewEngineType] = useState("")
  const [fugitiveFuel, setFugitiveFuel] = useState([])
  const [selectedFugitiveFuel, setSelectedFugitiveFuel] = useState("")
  const [selectedNewFugitiveFuel, setSelectedNewFugitiveFuel] = useState("")
  const [emissionEntries, setEmissionEntries] = useState([
    {
      id: crypto.randomUUID(),
      location: "",
      period: "",
      consumption: "",
      emission: "",
      unit: "",
      fuelType: "",
      subFuelType: "",
      engineType: "",
      calculationDetails: "",
      category: "",
      co2Emissions: "",
      ch4Emissions: "",
      n2oEmissions: "",
      totalCO2Equivalent: "",
      isNew: true
    },
  ])              

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || null;

  // API Functions
  const getFrequency = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: selectedFinancialYear },
      "GET",
    )
    if (isSuccess) {
      setIdentifier(data.data)
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

  const getScope1CalculatedEmissionData = async (financialYearId) => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getScope1CalculatedEmissionData`, 
        {}, 
        {financialYearId: financialYearId}, 
        "GET"
      );
      if (response.isSuccess) {
        const previousEntries = response.data.data || [];

        const newEntries = [
          {
            id: crypto.randomUUID(),
            location: "",
            period: "",
            consumption: "",
            emission: "",
            unit: "",
            fuelType: "",
            subFuelType: "",
            engineType: "",
            energyGJ: "",
            co2Emissions: "",
            ch4Emissions: "",
            n2oEmissions: "",
            totalCO2Equivalent: "",
            calculationDetails: "",
            category: "",
            isNew: true
          },
          ...previousEntries.map(entry => {     
            const mappedEntry = {
              id: entry.id,
              financialYearId: entry.financialYearId,
              location: entry.sourceId?.toString(),
              period: entry.period,
              consumption: entry.readingValue?.toString(),
              firefightingEquipmentCO2Emissions: entry.firefightingEquipmentConsumption,
              acRefrigerationHfCEmissions: entry.acRefrigerationHfcConsumption,
              substationSf6Emissions: entry.substationSf6Consumption,
              emission: entry.co2Emissions,
              fuelType: entry?.calculationDetails?.fuel_type || "",
              subFuelType: entry?.calculationDetails?.fuel || "",
              transportType: entry?.calculationDetails?.transport || "",
              engineType: entry?.calculationDetails?.engine|| "",
              fromDate: entry.fromDate,
              toDate: entry.toDate,
              energyGJ: entry.energyGJ,
              co2Emissions: entry.co2Emissions,
              ch4Emissions: entry.ch4Emissions,
              n2oEmissions: entry.n2oEmissions,
              totalCO2Equivalent: entry.totalCO2Equivalent,
              calculationDetails: entry.calculationDetails,
              category: entry.category,
              isNew: false
            };

            return mappedEntry;
          })
        ];

        setEmissionEntries(newEntries);
            
        newEntries.forEach(entry => {
          if (!entry.isNew && entry.fromDate && entry.toDate) {
            setFromDate(entry.fromDate);
            setToDate(entry.toDate);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching calculated emissions:", error);
    }
  };

  const getScope1EmissionData = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getScope1EmissionData`,
        {},
        {financialYearId: selectedFinancialYear, category: category},
        "GET"
      );
      if (response.isSuccess && response.data) { 
        setScope1Data(response.data.data);
       
      }
    } catch (error) {
      setFuelType([]);
      setAllFuelType([]);
    }
  }

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1
    const startYear = year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12)
    const endMonth = ((startMonth - 1 + type) % 12) + 1
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12)

    const formatDate = (month, year) => `${year}-${month < 10 ? `0${month}` : month}`

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    }
  }

  useEffect(() => {
    if (identifier) {
      let options = []
      if (identifier === "MONTHLY") {
        const options = start === 1 ? months : [...months.slice(start - 1), ...months.slice(0, start - 1)]
        const formattedOptions = options.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1,
        }))
        setTimePeriodOptions(formattedOptions)
      } else if (identifier === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12
          const quarterEndIndex = (i + 3) % 12
          const quarter = `${months[quarterStartIndex]} - ${months[(quarterEndIndex - 1 + 12) % 12]}`
          options.push({ label: quarter, value: options.length + 1 })
        }
        setTimePeriodOptions(options)
      } else if (identifier === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12
          const halfEndIndex = (i + 6) % 12
          const half = `${months[halfStartIndex]} - ${months[(halfEndIndex - 1 + 12) % 12]}`
          options.push({ label: half, value: options.length + 1 })
          setTimePeriodOptions(options)
        }
      } else if (identifier === "YEARLY") {
        const yearlyStartIndex = start - 1
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${months[(yearlyStartIndex - 1 + 12) % 12]}`,
            value: 1,
          },
        ]
        setTimePeriodOptions(options)
      }
    }
  }, [identifier, start])

  const handlePeriodChange = (value) => {
    if (!selectedFinancialYear || !financialYears.length) {
      setInitialPeriodToSet(value);
      return;
    }

    const foundYear = financialYears.find((item) => item.id === selectedFinancialYear);
    if (!foundYear) {
      console.error('Financial year not found');
      return;
    }

    const years = foundYear.financial_year_value;
    const year = Number.parseInt(years.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;
    let dateRange;

    if (identifier === "HALF_YEARLY") {
      const sixMonthLater = (start + 6) % 12;
      const halfYear = sixMonthLater === (value + 1) % 12 ? 2 : 1;
      dateRange = calculateDateRange(6, value, start, year);
    } else if (identifier === "QUARTERLY") {
      const quarter = Math.floor(value / 3) + 1;
      dateRange = calculateDateRange(3, value, start, year);
    } else if (identifier === "MONTHLY") {
      const startIndex = start - 1;
      const firstMonthIndex = (value - startIndex + months.length) % months.length;
      dateRange = calculateDateRange(1, value, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }

    if (dateRange) {
      if (!earliestFromDate || new Date(dateRange.fromDate) < new Date(earliestFromDate)) {
        earliestFromDate = dateRange.fromDate;
      }
      if (!latestToDate || new Date(dateRange.toDate) > new Date(latestToDate)) {
        latestToDate = dateRange.toDate;
      }
    }

    setFromDate(earliestFromDate);
    setToDate(latestToDate);
  };

  const updateEmissionEntry = (id, field, value) => {
    setFuelError("");

    setEmissionEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => {
        if (entry.id !== id) return entry;

        const updatedEntry = { ...entry, [field]: value };

        if (!entry.isNew && 
            (field === "fuelType" || field === "subFuelType") && 
            updatedEntry.location && 
            updatedEntry.period) {
          
          const isDuplicate = prevEntries.some(existingEntry => 
            existingEntry.id !== id && 
            !existingEntry.isNew &&
            existingEntry.location === updatedEntry.location &&
            existingEntry.period === updatedEntry.period &&
            existingEntry.fuelType === (field === "fuelType" ? value : updatedEntry.fuelType) &&
            existingEntry.subFuelType === (field === "subFuelType" ? value : updatedEntry.subFuelType)
          );

          if (isDuplicate) {
            setFuelError("An entry with this combination of location, period, and fuel already exists");
            return entry; 
          }
        }

        return updatedEntry;
      });

      return updatedEntries;
    });

    if (field === "fuelType") {
      setSelectedFuelType(value);
    }
  };

  const getSubFuelTypes = (selectedFuelType) => {
    if (!selectedFuelType || !allFuelType) return [];    
    const fuelTypeId = Number(selectedFuelType);    
    return allFuelType.filter(fuel => Number(fuel.fuel_type_id) === fuelTypeId);
  }

  const handleSubmitData = async (entry) => {
    try {
 
      if (!fromDate || !toDate) {
        console.error('Date range is required');
        return false;
      }

        const payload = {
          id: entry.isNew ? undefined : entry.id,
          financialYearId: Number(selectedFinancialYear),
          sourceId: Number(entry.location),
          fromDate: fromDate,
          toDate: toDate,
          period: Number(entry.period),
          questionId: Number(entry.questionId),
          rowId: Number(entry.rowIndex),
          columnId: Number(entry.colId),
          readingValue: Number(entry.consumption),
          firefightingEquipmentConsumption: Number(entry.firefightingEquipmentCO2Emissions),
          acRefrigerationHfcConsumption: Number(entry.acRefrigerationHfCEmissions),
          substationSf6Consumption: Number(entry.substationSf6Emissions),
          energyGJ: Number(entry.energyGJ),
          co2Emissions: Number(entry.co2Emissions),
          ch4Emissions: Number(entry.ch4Emissions),
          n2oEmissions: Number(entry.n2oEmissions),
          category: category,
          calculationDetails: JSON.stringify(category === "stationary" ? stationaryFuel : category === "mobile" ? selectedNewMobileFuel : selectedNewFugitiveFuel),
          notApplicable: false,
          proofDocument: JSON.stringify({}),
          proofDocumentNote: JSON.stringify({}),
          note: JSON.stringify({})
        };

        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}saveEmissionCalculation`,
          {},
          payload,
          "POST"
        );

      if (response.isSuccess) {
        getScope1CalculatedEmissionData(Number(selectedFinancialYear));
        
        if (entry.isNew) {
          setEmissionEntries(prevEntries => 
            prevEntries.filter(e => e.id !== entry.id)
          );
        }
        return true;
      } else {
          throw new Error('Failed to save emission calculation');
        }
    } catch (error) {
      console.error('Error saving emission calculation:', error);
      return false;
    }
  };

  const createNewModalEntry = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      location: "",
      period: "",
      consumption: "",
      emission: "",
      unit: "",
      fuelType: "",
      subFuelType: "",
      engineType: "",
      energyGJ: "",
      co2Emissions: "",
      ch4Emissions: "",
      n2oEmissions: "",
      totalCO2Equivalent: "",
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

  useEffect(() => {
    if (selectedFinancialYear && financialYears.length > 0 && initialPeriodToSet !== null) {
      handlePeriodChange(initialPeriodToSet);
      setInitialPeriodToSet(null);
    }
  }, [selectedFinancialYear, financialYears, initialPeriodToSet]);

  useEffect(() => {
    getFinancialYears()
    getSource()
  }, [])

  useEffect(() => {
    if (selectedFinancialYear) {
      getFrequency();
      getScope1EmissionData();
      getScope1CalculatedEmissionData(Number(selectedFinancialYear))
    }
  }, [selectedFinancialYear])

  useEffect(() => {
    if (selectedFinancialYear && category) {
      const categoryData = scope1Data[category]?.data || [];
      setCategoryData(categoryData);
      if(category === "mobile"){
        const uniqueFuel = [...new Set(categoryData.map(item => item.fuel))];
        const fuel = uniqueFuel.map(type => ({
          id: type,
          fuel: type
        }));
        setMobileFuel(fuel);
     
      }else if(category === "stationary"){
        const uniqueFuelTypes = [...new Set(categoryData.map(item => item.fuel_type))];
        const fuelTypes = uniqueFuelTypes.map(type => ({
          id: type,
          fuel_type: type
        }));
        setFuelType(fuelTypes);
      }else if(category === "fugitive"){
        const uniqueFuelTypes = [...new Set(categoryData.map(item => item.fuel))];
        const fuelTypes = uniqueFuelTypes.map(type => ({
          id: type,
          fuel: type
        }));
        setFugitiveFuel(fuelTypes);
      }
    }
  }, [category, selectedFinancialYear, scope1Data])

  useEffect(() => {
    if (selectedFinancialYear && category) {
      const categoryData = scope1Data[category]?.data || [];
      if(category === "mobile"){
        const filteredData = categoryData.filter(item => item.fuel === selectedFuelType);
        setTransportType(filteredData);
      }else if(category === "stationary"){
        const filteredData = categoryData.filter(item => item.fuel_type === selectedFuelType);
        setFuels(filteredData);
      }
    }
  }, [selectedFuelType, category, selectedFinancialYear, scope1Data])

  useEffect(() => {
    if (selectedFinancialYear && category) {
      const categoryData = scope1Data[category]?.data || [];
      if(category === "mobile"){
        const filteredData = categoryData.filter(item => item.transport === selectedTransportType && item.fuel === selectedFuelType);
        setEngineTypeOptions(filteredData);
      }else if(category === "stationary"){
        const filteredData = categoryData.find(item => item.fuel == selectedFuelName);
        setStationaryFuel(filteredData);
      }
    }
  }, [selectedFuelName, selectedTransportType, category, selectedFinancialYear, scope1Data, selectedFuelType])

  useEffect(() => {
    if (selectedFinancialYear && category) {
      const categoryData = scope1Data[category]?.data || [];
      if(category === "mobile"){
        const filteredData = categoryData.find(item => item.engine === selectedEngineType && item.transport === selectedTransportType && item.fuel === selectedFuelType);
        setSelectedNewMobileFuel(filteredData);
      }else if(category === "fugitive"){
        const filteredData = categoryData.find(item => item.fuel === selectedFugitiveFuel);
        setSelectedNewFugitiveFuel(filteredData);
      }
    }
  }, [selectedEngineType, category, selectedFinancialYear, scope1Data, selectedTransportType, selectedFuelType,selectedFugitiveFuel])

  useEffect(() => {
    const navigationDataString = sessionStorage.getItem('scope1NavigationData');
    if (navigationDataString) {
      const navigationData = JSON.parse(navigationDataString);
      const { emissionMapping, fromDate, toDate, selectedSource, questionId, rowIndex, colId } = navigationData;
      
      setFromDate(fromDate);
      setToDate(toDate);

      setEmissionEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        const entryToUpdate = updatedEntries[0] || {
          id: crypto.randomUUID(),
          isNew: true
        };

        const updatedEntry = {
          ...entryToUpdate,
          location: selectedSource?.toString(),
          subFuelType: emissionMapping?.toString(),
          questionId: questionId,
          rowIndex: rowIndex,
          colId: colId 
        };

        const fuelTypeForSubFuel = allFuelType.find(
          fuel => fuel.id.toString() === emissionMapping?.toString()
        );

        if (fuelTypeForSubFuel) {
          updatedEntry.fuelType = fuelTypeForSubFuel.fuel_type_id?.toString();
          setSelectedFuelType(fuelTypeForSubFuel.fuel_type_id?.toString());
        }
        
        if (fromDate && toDate) {
          const startDate = new Date(fromDate);
          const endDate = new Date(toDate);
          const monthDiff = endDate.getMonth() - startDate.getMonth() + 
                           (12 * (endDate.getFullYear() - startDate.getFullYear())) + 1;
          
          let periodValue;
          const startMonth = startDate.getMonth() + 1;

          if (monthDiff === 3) {
            periodValue = Math.ceil((startMonth - start + 12) % 12 / 3);
          } else if (monthDiff === 6) {
            periodValue = Math.ceil((startMonth - start + 12) % 12 / 6);
          } else if (monthDiff === 1) {
            periodValue = ((startMonth - start + 12) % 12) + 1;
          } else {
            periodValue = 1;
          }

          updatedEntry.period = periodValue.toString();
          setInitialPeriodToSet(periodValue);
        }
        
        updatedEntries[0] = updatedEntry;
        return updatedEntries;
      });
    }
  }, [allFuelType, start]);

  return {  
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYears,
    identifier,
    locations,
    timePeriodOptions,
    fromDate,
    toDate,
    fuelType,
    fuels,
    allFuelType,
    selectedFuelType,
    setFuelName,
    setSelectedFuelType,
    emissionEntries,
    setEmissionEntries,
    fuelError,
    setFuelError,
    handleSubmitData,
    updateEmissionEntry,
    getSubFuelTypes,
    handlePeriodChange,
    createNewModalEntry,
    category,
    setCategory,
    mobileFuel,
    transportType,
    stationaryFuel,
    selectedTransportType,
    setSelectedNewTransportType,
    selectedNewMobileFuel,
    setSelectedNewMobileFuel,
    engineTypeOptions,
    selectedEngineType,
    setSelectedNewEngineType,
    scope1Data,
    selectedStationaryFuelType,
    setSelectedStationaryFuelType,
    selectedStationaryFuel,
    setSelectedStationaryFuel,
    engineTypes,
    setEngineTypes,
    categoryData,
    setCategoryData,
    months,
    start,
    identifier,
    getFrequency,
    getFinancialYears,
    getSource,
    getScope1CalculatedEmissionData,
    getScope1EmissionData,
    calculateDateRange,
    handlePeriodChange,
    updateEmissionEntry,
    handleSubmitData,
    fugitiveFuel,
    setFugitiveFuel,
    setSelectedFugitiveFuel,
    selectedNewFugitiveFuel,
    setSelectedNewFugitiveFuel
  }
}