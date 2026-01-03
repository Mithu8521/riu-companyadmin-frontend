import { useState, useEffect, useMemo, useCallback } from "react"
import { Button, Col, Form, Row, Alert } from "react-bootstrap"
import { FiUpload, FiEdit, FiX, FiPlus } from "react-icons/fi"
import EmissionCalculationResults from "./EmissionCalculationResults"
import { apiCall } from "../../../../_services/apiCall"
import config from "../../../../config/config.json"

const EmissionEntryForm = ({
  entry,
  index,
  updateEmissionEntry,
  handleSubmitData: parentHandleSubmitData,
  locations,
  fuelError,
  categories, 
  scope1Data,
  selectedFinancialYear,
  questionId,
  rowIndex,
  colId,
  getScope1CalculatedEmissionData,
  setEmissionEntries,
  onSubmitSuccess,
  onSubmitError,
  identifier,
  financialYears = [],
}) => {
  const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || null;    
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [mobileFuel, setMobileFuel] = useState([]);
  const [fugitiveFuel, setFugitiveFuel] = useState([]);
  const [level1Option, setLevel1Option] = useState([]);
  const [level2Option, setLevel2Option] = useState([]);
  const [level3Option, setLevel3Option] = useState([]);
  const [fuelOption, setFuelOption] = useState([]);
  const [engineTypeOptions, setEngineTypeOptions] = useState([]);
  const [stationaryFuel, setStationaryFuel] = useState([]);
  const [selectedMobileFuel, setSelectedMobileFuel] = useState(null);
  const [fuelType, setFuelType] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [units, setUnits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [initialPeriodToSet, setInitialPeriodToSet] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const calculateDateRange = useCallback((type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear = year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type - 1) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type - 1) / 12);

    const formatDate = (month, year) => `${year}-${month < 10 ? `0${month}` : month}-01`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  }, []);

  const getPeriodFromDateRange = useCallback((fromDate, toDate, identifier, start) => {
    if (!fromDate || !toDate) return null;
    
    const fromMonth = parseInt(fromDate.split('-')[1]);
    
    if (identifier === "QUARTERLY") {
      let adjustedMonth = fromMonth - start;
      if (adjustedMonth < 0) adjustedMonth += 12;
      return Math.floor(adjustedMonth / 3) + 1;
    } else if (identifier === "MONTHLY") {
      let adjustedMonth = fromMonth - start;
      if (adjustedMonth < 0) adjustedMonth += 12;
      return adjustedMonth + 1;
    } else if (identifier === "HALF_YEARLY") {
      let adjustedMonth = fromMonth - start;
      if (adjustedMonth < 0) adjustedMonth += 12;
      return Math.floor(adjustedMonth / 6) + 1;
    } else if (identifier === "YEARLY") {
      return 1;
    }
    
    return null;
  }, []);

  useEffect(() => {
    if (!identifier || !start) return;
    
    let options = [];
    
    if (identifier === "MONTHLY") {
      const monthOptions = start === 1 ? months : [...months.slice(start - 1), ...months.slice(0, start - 1)];
      const formattedOptions = monthOptions.map((month, index) => ({
        label: month,
        value: ((start + index - 1) % 12) + 1,
      }));
      setTimePeriodOptions(formattedOptions);
    } else if (identifier === "QUARTERLY") {
      for (let i = 0; i < 4; i++) {
        const quarterStartIndex = (start - 1 + i * 3) % 12;
        const quarterEndIndex = (start - 1 + i * 3 + 2) % 12;
        const quarter = `${months[quarterStartIndex]} - ${months[quarterEndIndex]}`;
        options.push({ label: quarter, value: i + 1 });
      }
      setTimePeriodOptions(options);
    } else if (identifier === "HALF_YEARLY") {
      for (let i = 0; i < 2; i++) {
        const halfStartIndex = (start - 1 + i * 6) % 12;
        const halfEndIndex = (start - 1 + i * 6 + 5) % 12;
        const half = `${months[halfStartIndex]} - ${months[halfEndIndex]}`;
        options.push({ label: half, value: i + 1 });
      }
      setTimePeriodOptions(options);
    } else if (identifier === "YEARLY") {
      const yearlyStartIndex = start - 1;
      const yearlyEndIndex = (start - 2 + 12) % 12;
      options = [
        {
          label: `${months[yearlyStartIndex]} - ${months[yearlyEndIndex]}`,
          value: 1,
        },
      ];
      setTimePeriodOptions(options);
    }
  }, [identifier, start]);

  const handlePeriodChange = useCallback((value) => {
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
    const year = parseInt(years.split("-")[0]);

    let dateRange;

    if (identifier === "HALF_YEARLY") {
      dateRange = calculateDateRange(6, value, start, year);
    } else if (identifier === "QUARTERLY") {
      dateRange = calculateDateRange(3, value, start, year);
    } else if (identifier === "MONTHLY") {
      dateRange = calculateDateRange(1, value, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }

    if (dateRange) {
      setFromDate(dateRange.fromDate);
      setToDate(dateRange.toDate);
    }
  }, [selectedFinancialYear, financialYears, identifier, start, calculateDateRange]);

  const convertToDateObject = useCallback((dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  }, []);

  const getCurrentValues = useCallback(() => {
    if (!entry) return {};

    if (entry.isNew) {
      return {
        fuelType: entry.fuelType || "",
        subFuelType: entry.subFuelType || "",
        engineType: entry.engineType || "",
        level1Option: entry.level1Option || "",
        location: entry.location || "",
        period: entry.period || "",
        category: entry.category || "",
        consumption: entry.readingValue || entry.consumption || "",
        calculationDetails: entry.calculationDetails || {},
        firefightingEquipmentCO2Emissions: entry.firefightingEquipmentCO2Emissions || "",
        acRefrigerationHfCEmissions: entry.acRefrigerationHfCEmissions || "",
        substationSf6Emissions: entry.substationSf6Emissions || ""
      };
    }

    let calc = entry.calculationDetails || {};
    
    if (typeof calc === 'string') {
      try {
        calc = JSON.parse(calc);
      } catch (e) {
        console.warn('Failed to parse calculationDetails:', calc);
        calc = {};
      }
    }
    
    let locationValue = "";
    if (entry.subLocationId) {
      locationValue = entry.subLocationId;
    } else if (entry.sourceId) {
      locationValue = entry.sourceId;
    } else if (entry.locationId) {
      locationValue = entry.locationId;
    }

    let periodValue = "";
    if (entry.fromDate && entry.toDate && timePeriodOptions.length > 0) {
      periodValue = getPeriodFromDateRange(entry.fromDate, entry.toDate, identifier, start);
    }
    
    if (entry.category === "mobile") {
      return {
        fuelType: calc.fuel || "",
        subFuelType: calc.transport || "",
        engineType: calc.engine || "",
        level1Option: calc.transport || "",
        location: String(locationValue),
        period: periodValue,
        category: entry.category || "",
        consumption: entry.consumption || "",
        calculationDetails: calc,
        firefightingEquipmentCO2Emissions: entry.firefightingEquipmentCO2Emissions || "",
        acRefrigerationHfCEmissions: entry.acRefrigerationHfCEmissions || "",
        substationSf6Emissions: entry.substationSf6Emissions || ""
      };
    } else if (entry.category === "stationary") {
      return {
        fuelType: calc.fuelType || "",
        subFuelType: calc.fuel || "",
        engineType: "",
        level1Option: "",
        location: String(locationValue),
        period: periodValue,
        category: entry.category || "",
        consumption: entry.consumption || "",
        calculationDetails: calc,
        firefightingEquipmentCO2Emissions: entry.firefightingEquipmentCO2Emissions || "",
        acRefrigerationHfCEmissions: entry.acRefrigerationHfCEmissions || "",
        substationSf6Emissions: entry.substationSf6Emissions || ""
      };
    } else if (entry.category === "fugitive") {
      return {
        fuelType: calc.fuel || "",
        subFuelType: calc.fuel || "",
        engineType: "",
        level1Option: "",
        location: String(locationValue),
        period: periodValue,
        category: entry.category || "",
        consumption: entry.consumption || "",
        calculationDetails: calc,
        firefightingEquipmentCO2Emissions: entry.firefightingEquipmentCO2Emissions || "",
        acRefrigerationHfCEmissions: entry.acRefrigerationHfCEmissions || "",
        substationSf6Emissions: entry.substationSf6Emissions || ""
      };
    }

    return {
      fuelType: "",
      subFuelType: "",
      engineType: "",
      level1Option: "",
      location: String(locationValue),
      period: periodValue,
      category: entry.category || "",
      consumption: entry.consumption || "",
      calculationDetails: calc,
      firefightingEquipmentCO2Emissions: entry.firefightingEquipmentCO2Emissions || "",
      acRefrigerationHfCEmissions: entry.acRefrigerationHfCEmissions || "",
      substationSf6Emissions: entry.substationSf6Emissions || ""
    };
  }, [entry?.id, entry?.category, entry?.isNew, entry?.consumption, entry?.calculationDetails, timePeriodOptions.length, identifier, start]); // More specific dependencies

  const handleEditModeFieldUpdate = useCallback((field, value) => {
    if (!entry || !updateEmissionEntry) return;
    
    // Only allow updates when in edit mode or for new entries
    if (entry.isNew || editingEntryId === entry.id) {
      // Prevent unnecessary updates if value hasn't changed
      const currentValue = entry[field];
      if (currentValue === value) return;
      
      // Update the main field first
      updateEmissionEntry(entry.id, field, value);
      
      // Handle dependent field updates without setTimeout to make dropdowns more responsive
      if (field === 'period') {
        handlePeriodChange(value);
      }
      
      // Clear dependent fields when parent fields change
      if (field === 'category') {
        updateEmissionEntry(entry.id, 'fuelType', '');
        updateEmissionEntry(entry.id, 'subFuelType', '');
        updateEmissionEntry(entry.id, 'engineType', '');
        updateEmissionEntry(entry.id, 'level1Option', '');
      }
      
      if (field === 'fuelType') {
        updateEmissionEntry(entry.id, 'subFuelType', '');
      }
      
      if (field === 'level1Option') {
        updateEmissionEntry(entry.id, 'engineType', '');
      }
      
      if (field === 'subFuelType' && entry.category === 'mobile') {
        updateEmissionEntry(entry.id, 'level1Option', '');
        updateEmissionEntry(entry.id, 'engineType', '');
      }
    }
  }, [entry?.id, entry?.isNew, updateEmissionEntry, editingEntryId, handlePeriodChange]);

  const handleFieldUpdate = useCallback((field, value) => {
    if (entry && updateEmissionEntry && entry[field] !== value) {
      updateEmissionEntry(entry.id, field, value);
    }
  }, [entry, updateEmissionEntry]);

  // Add useEffect to reset editing state when entry changes - with proper dependency management
  useEffect(() => {
    // Reset editing state when switching between entries, but not on first mount
    if (editingEntryId && entry?.id && editingEntryId !== entry.id) {
      setEditingEntryId(null);
      setSubmitError(null);
    }
  }, [entry?.id]); // Only depend on entry.id, not editingEntryId to avoid loops

  useEffect(() => {
    if (initialPeriodToSet && selectedFinancialYear && financialYears.length) {
      handlePeriodChange(initialPeriodToSet);
      setInitialPeriodToSet(null);
      setIsInitialized(true);
    }
  }, [initialPeriodToSet, selectedFinancialYear, financialYears, handlePeriodChange]);

  useEffect(() => {
    if (entry && entry.period && selectedFinancialYear && financialYears.length && !fromDate && !toDate) {
      handlePeriodChange(entry.period);
    }
  }, [entry?.period, selectedFinancialYear, financialYears, fromDate, toDate, handlePeriodChange]);

  useEffect(() => {
    if (entry && !entry.isNew && entry.fromDate && entry.toDate && !fromDate && !toDate) {
      setFromDate(entry.fromDate);
      setToDate(entry.toDate);
    }
  }, [entry, fromDate, toDate]);

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    if (!currentCategory) return;

    const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];   
    
    if (currentCategory === "mobile") {
      const uniqueFuel = [...new Set(categoryData.map(item => item.fuel))];
      const fuel = uniqueFuel.map(type => ({
        id: type,
        fuel: type
      }));
      setMobileFuel(fuel);
    } else if (currentCategory === "stationary") {
      const uniqueFuelTypes = [...new Set(categoryData.map(item => item.fuelType))];
      const fuelTypes = uniqueFuelTypes.map(type => ({
        id: type,
        fuelType: type
      }));
      setFuelType(fuelTypes);
    } else if (currentCategory === "fugitive") {
      const uniqueFuelTypes = [...new Set(categoryData.map(item => item.fuel))];
      const fuelTypes = uniqueFuelTypes.map(type => ({
        id: type,
        fuel: type
      }));
      setFugitiveFuel(fuelTypes);
    }
  }, [entry?.category, scope1Data]);

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    const currentFuelType = entry?.calculationDetails?.fuelType;
    
    if (currentCategory === "stationary" && currentFuelType) {
      const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];
      const filteredData = categoryData.filter(item => item.fuelType === currentFuelType);
      setFuels(filteredData);
    } else {
      setFuels([]);
    }
  }, [entry?.calculationDetails?.fuelType, entry?.category, scope1Data]);

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];
    
    if (currentCategory === "mobile" ) {
      const uniqueFuel = [...new Set(categoryData.map(item => item.level1))];
      const fuel = uniqueFuel.map(type => ({
        id: type,
        level1: type
      }));
      setLevel1Option(fuel);
      
      const seen = new Set();
      const filteredData = categoryData
        .filter(item => item.level1 === entry?.calculationDetails?.level1)
        .filter(item => {
          if (seen.has(item.level2)) {
            return false;
          }
          seen.add(item.level2);
          return true;
        });

        setLevel2Option(filteredData);

        const level2seen = new Set();
        const level2filteredData = categoryData
          .filter(item => item.level2 === entry?.calculationDetails?.level2 && item.level1 === entry?.calculationDetails?.level1)
          .filter(item => {
            if (level2seen.has(item.level3)) {
              return false;
            }
            level2seen.add(item.level3);
            return true;
          });

          setLevel3Option(level2filteredData);

          const level3FilteredData = categoryData.filter(item => item.level3 === entry?.calculationDetails?.level3 && item.level2 === entry?.calculationDetails?.level2 && item.level1 === entry?.calculationDetails?.level1);
          setFuelOption(level3FilteredData);

          const fuelFilteredData = categoryData.filter(item => item.fuel === entry?.calculationDetails?.fuel && item.level3 === entry?.calculationDetails?.level3 && item.level2 === entry?.calculationDetails?.level2 && item.level1 === entry?.calculationDetails?.level1);
          setUnits(fuelFilteredData);

    } else if(currentCategory === "fugitive") {
      const uniqueFuel = [...new Set(categoryData.map(item => item.emission))];
      const fuel = uniqueFuel.map(type => ({
        id: type,
        emission: type
      }));
      setFuelOption(fuel);
      const fuelFilteredData = categoryData.filter(item => item.emission === entry?.calculationDetails?.emission);
      setUnits(fuelFilteredData);
    } else {
      setLevel1Option([]);
    }
  }, [entry?.subFuelType, entry?.category, scope1Data]);

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    const currentFuelType = entry.subFuelType;
    const currentTransportType = entry.level1Option;
    
    if (currentCategory === "mobile" && currentTransportType && currentFuelType) {
      const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];
      const filteredData = categoryData.filter(item => 
        item.transport === currentTransportType && item.fuel === currentFuelType
      );
      const uniqueEngines = [...new Set(filteredData.map(item => item.engine))];
      const engines = uniqueEngines.map(engine => ({
        id: engine,
        engine: engine
      }));
      setEngineTypeOptions(engines);
    } else {
      setEngineTypeOptions([]);
    }
  }, [entry?.level1Option, entry?.subFuelType, entry?.category, scope1Data]);

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    const currentFuelType = entry.subFuelType;
    const currentTransportType = entry.level1Option;
    const currentEngineType = entry.engineType;
    
    if (currentCategory === "mobile" && currentEngineType && currentTransportType && currentFuelType) {
      const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];
      const filteredData = categoryData.find(item => 
        item.engine === currentEngineType && 
        item.transport === currentTransportType && 
        item.fuel === currentFuelType
      );
      setSelectedMobileFuel(filteredData);
    }
  }, [entry?.engineType, entry?.level1Option, entry?.subFuelType, entry?.category, scope1Data]);

  useEffect(() => {
    const currentCategory = entry.category;
    const currentFuelType = entry?.calculationDetails?.fuelType;
    if (currentCategory) {
      const categoryData = scope1Data[currentCategory]['defra']?.data || [];
      if (currentCategory === "mobile") {
        // const filteredData = categoryData.find(item => item.fuel === selectedFinalMobileFuel && item.level3 === selectedEngineType && item.level2 === selectedTransportType && item.level1 === selectedFuelType);
        // setFinalFuel(filteredData);
      } else if (currentCategory === "stationary") {
        const filteredData = categoryData.filter(item => item.fuel == entry?.calculationDetails?.fuel);
        setUnits(filteredData);
      } else if (currentCategory === "fugitive") {
        // const filteredData = categoryData.find(item => item.emission === selectedFugitiveFuel);
        // setFinalFuel(filteredData);
      }
    }
  }, [entry.category, entry?.calculationDetails?.fuel ])

  useEffect(() => {
    if (!entry || !scope1Data) return;
    
    const currentCategory = entry.category;
    const currentSubFuelType = entry.subFuelType;
    
    if (currentCategory === "stationary" && currentSubFuelType) {
      const categoryData = (scope1Data?.[currentCategory]?.defra?.data) ?? [];
      const filteredData = categoryData.find(item => item.fuel === currentSubFuelType);
      setStationaryFuel(filteredData);
    }
  }, [entry?.subFuelType, entry?.category, scope1Data]);

  const handleSubmitData = useCallback(async (entryData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const currentValues = getCurrentValues();
      
      const currentLocation = entryData.location || currentValues.location;
      const currentPeriod = entryData.period || currentValues.period;
      const currentConsumption = entryData.consumption || entryData.readingValue || currentValues.consumption;
      const currentFuelType = entryData.fuelType || currentValues.fuelType;
      const currentSubFuelType = entryData.subFuelType || currentValues.subFuelType;
      const currentCategory = entryData.category || currentValues.category;
      
      if (currentCategory === "fugitive") {
        if (!currentLocation || !currentPeriod || !currentSubFuelType) {
          throw new Error('Please fill all required fields for fugitive emissions');
        }
      } else {
        if (!currentLocation || !currentPeriod || !currentConsumption || 
            !currentFuelType || !currentSubFuelType) {
          throw new Error('Please fill all required fields');
        }
      }

      if (!selectedFinancialYear) {
        throw new Error('Financial year is required');
      }

      if (!fromDate || !toDate) {
        throw new Error('Date range is required. Please select a period.');
      }

      let calculationDetails;
      if (currentCategory === "stationary") {
        calculationDetails = stationaryFuel;
      } else if (currentCategory === "mobile") {
        calculationDetails = selectedMobileFuel;
      } else if (currentCategory === "fugitive") {
        calculationDetails = entryData.calculationDetails || currentValues.calculationDetails || {};
      } else {
        calculationDetails = entryData.calculationDetails || currentValues.calculationDetails || {};
      }

      const fromDateObj = convertToDateObject(fromDate);
      const toDateObj = convertToDateObject(toDate);

      if (!fromDateObj || !toDateObj) {
        throw new Error('Invalid date format. Please select a valid period.');
      }

      const payload = {
        id: entryData.isNew ? undefined : entryData.id,
        financialYearId: Number(selectedFinancialYear),
        sourceId: Number(currentLocation),
        fromDate: fromDateObj,
        toDate: toDateObj,
        questionId: Number(questionId || entryData.questionId),
        rowId: Number(rowIndex || entryData.rowIndex),
        columnId: Number(colId || entryData.colId),
        readingValue: currentCategory === "fugitive" ? 0 : Number(currentConsumption),
        energyGJ: Number(entryData.energyGJ || 0),
        co2Emissions: Number(entryData.co2Emissions || 0),
        ch4Emissions: Number(entryData.ch4Emissions || 0),
        n2oEmissions: Number(entryData.n2oEmissions || 0),
        category: currentCategory,
        calculationDetails: JSON.stringify(calculationDetails),
        notApplicable: false,
        proofDocument: JSON.stringify({}),
        proofDocumentNote: JSON.stringify({}),
        note: JSON.stringify({})
      };

      if (currentCategory === "fugitive") {
        payload.firefightingEquipmentCO2Emissions = Number(entryData.firefightingEquipmentCO2Emissions || currentValues.firefightingEquipmentCO2Emissions || 0);
        payload.acRefrigerationHfCEmissions = Number(entryData.acRefrigerationHfCEmissions || currentValues.acRefrigerationHfCEmissions || 0);
        payload.substationSf6Emissions = Number(entryData.substationSf6Emissions || currentValues.substationSf6Emissions || 0);
      }

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveEmissionCalculation`,
        {},
        payload,
        "POST"
      );

      if (response.isSuccess) {
        if (getScope1CalculatedEmissionData) {
          await getScope1CalculatedEmissionData(Number(selectedFinancialYear));
        }
        
        if (entryData.isNew && setEmissionEntries) {
          setEmissionEntries(prevEntries => 
            prevEntries.filter(e => e.id !== entryData.id)
          );
        }

        setEditingEntryId(null);

        if (onSubmitSuccess) {
          onSubmitSuccess(response, entryData);
        }

        return true;
      } else {
        throw new Error(response.message || 'Failed to save emission calculation');
      }
    } catch (error) {
      setSubmitError(error.message);
      
      if (onSubmitError) {
        onSubmitError(error, entryData);
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    getCurrentValues,
    selectedFinancialYear,
    fromDate,
    toDate,
    convertToDateObject,
    stationaryFuel,
    selectedMobileFuel,
    questionId,
    rowIndex,
    colId,
    getScope1CalculatedEmissionData,
    setEmissionEntries,
    onSubmitSuccess,
    onSubmitError
  ]);

  const isFormValid = useCallback(() => {
    if (!entry) return false;
    
    try {
      const currentValues = getCurrentValues();
      const currentCategory = currentValues.category;
      const currentLocation = currentValues.location;
      const currentPeriod = currentValues.period;
      const currentFuelType = currentValues.fuelType;
      const currentSubFuelType = currentValues.subFuelType;
      const currentConsumption = currentValues.consumption;

      // Basic required fields
      if (!currentLocation || !currentPeriod || !currentCategory) {
        return false;
      }

      if (currentCategory === "fugitive") {
        return !!currentSubFuelType;
      } else {
        return !!(currentConsumption && currentFuelType && currentSubFuelType);
      }
    } catch (error) {
      console.warn('Error in isFormValid:', error);
      return false;
    }
  }, [getCurrentValues, entry?.id]); // More specific dependencies

  if (!entry) {
    return null;
  }

  const currentValues = getCurrentValues();

  return (
    <div
      className="mb-4 p-4 rounded-lg"
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {submitError && (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-dark" style={{ fontWeight: "600" }}>
          {entry.isNew ? 'New Entry' : `Previous Entry #${index}`}
        </h6>
        {!entry.isNew && (
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                const newEditingId = editingEntryId === entry.id ? null : entry.id;
                setEditingEntryId(newEditingId);
                setSubmitError(null);
              }}
              className={`btn d-flex align-items-center justify-content-center`}
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
                fontWeight: "500",
                height: "32px",
                fontSize: "0.85rem",
                minWidth: "110px",
                border: editingEntryId === entry.id ? "1px solid #dc3545" : "1px solid #e2e6ea",
                backgroundColor: editingEntryId === entry.id ? "#fff5f5" : "#fff",
                color: editingEntryId === entry.id ? "#dc3545" : "#666",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
              disabled={isSubmitting}
            >
              {editingEntryId === entry.id ? (
                <>
                  <FiX className="me-1" size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <FiEdit className="me-1" size={14} />
                  Edit
                </>
              )}
            </button>
            {editingEntryId === entry.id && (
              <button
                onClick={() => handleSubmitData(entry)}
                className="btn d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: "6px",
                  padding: "4px 16px",
                  fontWeight: "500",
                  height: "32px",
                  fontSize: "0.85rem",
                  minWidth: "110px",
                  backgroundColor: "#10b981",
                  border: "none",
                  color: "#fff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                  cursor: "pointer"
                }}
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiUpload className="me-1" size={14} />
                    Update
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <Row className="g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="fw-semibold text-muted mb-1">Location</Form.Label>
            <div className="position-relative">
              <Form.Select
                value={entry.location || currentValues.location || ""}
                onChange={(e) => {  
                  handleEditModeFieldUpdate("location", e.target.value);
                }}
                disabled={!entry.isNew && editingEntryId !== entry.id}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                }}
              >
                <option value="">
                  {!entry.isNew && !currentValues.location ? "No location assigned" : "Select Location"}
                </option>
                {Array.isArray(locations) && locations.map((location, idx) => (
                  <option key={idx} value={location.id}>
                    {location?.unitCode || `${location?.location?.area || ""}, ${location?.location?.city || ""}`.trim()}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label className="fw-semibold text-muted mb-1">Period</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Select
                value={entry.period || currentValues.period || ""}
                onChange={(e) => {
                  handleEditModeFieldUpdate("period", e.target.value);
                }}
                disabled={!entry.isNew && editingEntryId !== entry.id}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                }}
              >
                <option value="">Select Frequency</option>
                {Array.isArray(timePeriodOptions) && timePeriodOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>         
            </div>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label className="fw-semibold text-muted mb-1">Category</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Select
                value={entry.category || currentValues.category || ""}
                onChange={(e) => {
                  handleEditModeFieldUpdate("category", e.target.value);              
                }}
                disabled={!entry.isNew && editingEntryId !== entry.id}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                }}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </Col>
        {(entry.category === "stationary" || currentValues.category === "stationary") && (
          <>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel Type</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.fuelType || currentValues.fuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("fuelType", e.target.value);                           
                      handleEditModeFieldUpdate("subFuelType", "");
                    }}
                    disabled={!entry.isNew && editingEntryId !== entry.id}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                    }}
                  >
                    <option value="">Select Fuel Type</option>
                    {Array.isArray(fuelType) && fuelType.map((fuel) => (
                      <option key={fuel.id} value={fuel.id}>
                        {fuel.fuelType}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
        
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.fuel || currentValues.subFuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("subFuelType", e.target.value);
                    }}
                    disabled={!(entry?.calculationDetails?.fuelType || currentValues.fuelType) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry?.calculationDetails?.fuelType || currentValues.fuelType) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      opacity: !(entry?.calculationDetails?.fuelType || currentValues.fuelType) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(entry?.calculationDetails?.fuelType || currentValues.fuelType) ? "Select Sub Fuel Type" : "Select fuel type first"}
                    </option>
                    {Array.isArray(fuels) && fuels.map((subFuel) => (
                      <option key={subFuel.id} value={subFuel.fuel}>
                        {subFuel.fuel}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Consumption</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter consumption value"
                  value={entry.consumption || entry.readingValue || currentValues.consumption || ""}
                  onChange={(e) => {
                    handleEditModeFieldUpdate("readingValue", e.target.value);
                    handleEditModeFieldUpdate("consumption", e.target.value);
                  }}
                  disabled={!!fuelError || (!entry.isNew && editingEntryId !== entry.id)}
                  className="border-2 py-2 px-3"
                  style={{
                    backgroundColor: (!!fuelError || (!entry.isNew && editingEntryId !== entry.id)) ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                />  
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Unit</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.unit || currentValues.subFuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("subFuelType", e.target.value);
                    }}
                    disabled={!(entry.fuelType || currentValues.fuelType) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry.fuelType || currentValues.fuelType) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      opacity: !(entry.fuelType || currentValues.fuelType) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(entry?.calculationDetails?.fuel  || currentValues.fuelType) ? "Select unit Type" : "Select fuel first"}
                    </option>
                    {Array.isArray(units) && units.map((subFuel) => (
                      <option key={subFuel.id} value={subFuel.unit}>
                        {subFuel.unit}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
          </>
        )}

        {(entry.category === 'mobile' || currentValues.category === 'mobile') && (
          <>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Vehicle Category</Form.Label>
                <div className="position-relative">
                  <Form.Select  
                    value={entry?.calculationDetails?.level1 || currentValues.level1Option || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("level1Option", e.target.value);
                      handleEditModeFieldUpdate("engineType", "");
                    }}
                    disabled={!(entry?.calculationDetails?.level1 || currentValues.subFuelType) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry?.calculationDetails?.level1 || currentValues.subFuelType) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      cursor: !(entry.subFuelType || currentValues.subFuelType) ? "not-allowed" : "pointer",
                      opacity: !(entry.subFuelType || currentValues.subFuelType) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(!entry?.calculationDetails?.level1) ? "Choose Vehicle Category type..." : ""}  
                    </option>
                    {Array.isArray(level1Option) && level1Option.map((item) => (
                      <option key={item.id} value={item.level1}>
                        {item.level1}
                      </option>
                    ))}
                  </Form.Select>                
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Vehicle Type</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.level2 || currentValues.engineType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("engineType", e.target.value);
                    }}
                    disabled={!(entry.level1Option || currentValues.level1Option) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry.level1Option || currentValues.level1Option) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      cursor: !(entry.level1Option || currentValues.level1Option) ? "not-allowed" : "pointer",
                      opacity: !(entry.level1Option || currentValues.level1Option) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(entry.level1Option || currentValues.level1Option) ? "Choose Vehicle Type..." : "Select Vehicle Category first"}  
                    </option>
                    {Array.isArray(level2Option) && level2Option.map((item) => (
                      <option key={item.id} value={item.level2}>
                        {item.level2}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Vehicle Specification</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.level3 || currentValues.engineType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("engineType", e.target.value);
                    }}
                    disabled={!(entry.level1Option || currentValues.level1Option) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry.level1Option || currentValues.level1Option) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      cursor: !(entry.level1Option || currentValues.level1Option) ? "not-allowed" : "pointer",
                      opacity: !(entry.level1Option || currentValues.level1Option) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(entry.level1Option || currentValues.level1Option) ? "Choose Vehicle Specification..." : "Select Vehicle Type first"}  
                    </option>
                    {Array.isArray(level3Option) && level3Option.map((item) => (
                      <option key={item.id} value={item.level3}>
                        {item.level3}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.fuel || currentValues.subFuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("subFuelType", e.target.value);
                      handleEditModeFieldUpdate("level1Option", "");
                      handleEditModeFieldUpdate("engineType", "");
                    }}
                    disabled={!entry.isNew && editingEntryId !== entry.id}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px"
                    }}
                  >
                    <option value="">Choose fuel ...</option>
                    {Array.isArray(fuelOption) && fuelOption.map((fuel) => (
                      <option key={fuel.id} value={fuel.fuel}>
                        {fuel.fuel}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Consumption</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter consumption value"
                  value={entry.consumption || entry.readingValue || currentValues.consumption || ""}
                  onChange={(e) => {
                    handleEditModeFieldUpdate("readingValue", e.target.value);
                    handleEditModeFieldUpdate("consumption", e.target.value);
                  }}
                  disabled={!!fuelError || (!entry.isNew && editingEntryId !== entry.id)}
                  className="border-2 py-2 px-3"
                  style={{
                    backgroundColor: (!!fuelError || (!entry.isNew && editingEntryId !== entry.id)) ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                />  
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Unit</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.unit || currentValues.subFuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("subFuelType", e.target.value);
                    }}
                    disabled={!(entry.fuelType || currentValues.fuelType) || (!entry.isNew && editingEntryId !== entry.id)}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: ((entry.fuelType || currentValues.fuelType) && (entry.isNew || editingEntryId === entry.id)) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      opacity: !(entry.fuelType || currentValues.fuelType) ? 0.6 : 1
                    }}
                  >
                    <option value="">
                      {(entry?.calculationDetails?.fuel  || currentValues.fuelType) ? "Select unit Type" : "Select fuel first"}
                    </option>
                    {Array.isArray(units) && units.map((subFuel) => (
                      <option key={subFuel.id} value={subFuel.unit}>
                        {subFuel.unit}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
          </>
        )}

        {(entry.category === 'fugitive' || currentValues.category === 'fugitive') && (
          <>  
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Refrigerant</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={entry?.calculationDetails?.emission || currentValues.subFuelType || ""}
                    onChange={(e) => {
                      handleEditModeFieldUpdate("subFuelType", e.target.value);
                    }}
                    disabled={!entry.isNew && editingEntryId !== entry.id}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: (entry.isNew || editingEntryId === entry.id) ? "white" : "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px"
                    }}
                  >
                    <option value="">Choose fuel ...</option>
                    {Array.isArray(fuelOption) && fuelOption.map((fuel) => (
                      <option key={fuel.id} value={fuel.emission}>
                        {fuel.emission}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fire Fighting Equipment CO2 Emissions</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter CO2 emissions"
                  value={entry.firefightingEquipmentCO2Emissions || currentValues.firefightingEquipmentCO2Emissions || ""}
                  onChange={(e) => {
                    handleEditModeFieldUpdate("firefightingEquipmentCO2Emissions", e.target.value);
                  }}
                  disabled={!entry.isNew && editingEntryId !== entry.id}
                  className="border-2 py-2 px-3"
                  style={{
                    backgroundColor: (!entry.isNew && editingEntryId !== entry.id) ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                />  
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">AC Refrigeration HFC Emissions</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter HFC emissions"
                  value={entry.acRefrigerationHfCEmissions || currentValues.acRefrigerationHfCEmissions || ""}
                  onChange={(e) => {
                    handleEditModeFieldUpdate("acRefrigerationHfCEmissions", e.target.value);
                  }}
                  disabled={!entry.isNew && editingEntryId !== entry.id}
                  className="border-2 py-2 px-3"
                  style={{
                    backgroundColor: (!entry.isNew && editingEntryId !== entry.id) ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                />  
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Substation SF6 Emissions</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter SF6 emissions"
                  value={entry.substationSf6Emissions || currentValues.substationSf6Emissions || ""}
                  onChange={(e) => {
                    handleEditModeFieldUpdate("substationSf6Emissions", e.target.value);
                  }}
                  disabled={!entry.isNew && editingEntryId !== entry.id}
                  className="border-2 py-2 px-3"
                  style={{
                    backgroundColor: (!entry.isNew && editingEntryId !== entry.id) ? "#f8f9fa" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                />  
              </Form.Group>
            </Col>
          </>
        )}
      </Row>

      {/* Add Emission Calculation Results */}
      <EmissionCalculationResults 
        results={entry.calculationDetails || currentValues.calculationDetails} 
        consumption={entry.consumption || entry.readingValue || currentValues.consumption} 
        category={entry.category || currentValues.category}       
        updateEntry={handleEditModeFieldUpdate}   
      />

      {/* Add Save button for new entries */}
      {entry.isNew && (
        <div className="mt-3 d-flex justify-content-end">
          <button
            onClick={() => handleSubmitData(entry)}
            className="btn d-flex align-items-center justify-content-center"
            style={{
              borderRadius: "6px",
              padding: "8px 24px",
              fontWeight: "500",
              height: "40px",
              fontSize: "0.9rem",
              minWidth: "140px",
              backgroundColor: "#10b981",
              border: "none",
              color: "#fff",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
              cursor: "pointer"
            }}
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></div>
                Saving...
              </>
            ) : (
              <>
                <FiUpload className="me-1" size={16} />
                Save Entry
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default EmissionEntryForm