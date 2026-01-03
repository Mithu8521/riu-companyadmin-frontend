import React, { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  generateTimePeriodOptions,
  getStartingMonth
} from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import {
  fetchFramework,
  fetchFrequency,
  getEnvironmentData,
  getFinancialYear,
  getSource
} from "../Training/training-dashboard/services/trainingService";
import FilterSection from "./components/FilterSection";
import MetricsSection from "./components/MetricsSection";
import DetailedComparisonSection from "./components/DetailedComparisonSection";
import ChartsSection from "./components/ChartsSection";
import DataEntriesSection from "./components/DataEntriesTable";
import { calculateEnvironmentalData } from "./hooks/useEnvironmentalData";

const ESGEnvironmentDashboard = () => {
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedPeriodsValue, setSelectedPeriodsValue] = useState([]);
  const [selectedSecondPeriodsValue, setSelectedSecondPeriodsValue] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [frequency, setFrequency] = useState("monthly");
  const [companyFramework, setCompanyFramework] = useState([]);
  const [secondYearFrequency, setSecondYearFrequency] = useState("monthly");
  const [secondYearTimePeriodOptions, setSecondYearTimePeriodOptions] = useState([]);

  const [comparisonMode, setComparisonMode] = useState(false);
  const [twoYearComparisonMode, setTwoYearComparisonMode] = useState(false);
  const [firstYearLocation, setFirstYearLocation] = useState([]);
  const [firstYearPeriods, setFirstYearPeriods] = useState([]);
  const [firstFinancialYearId, setFirstFinancialYearId] = useState("");
  const [secondYearLocation, setSecondYearLocation] = useState([]);
  const [secondYearPeriods, setSecondYearPeriods] = useState([]);
  const [secondFinancialYearId, setSecondFinancialYearId] = useState("");

  const [currentPeriodData, setCurrentPeriodData] = useState({
    energyData: {},
    waterData: {},
    wasteData: {},
    emissionData: {}
  });
  const [previousPeriodData, setPreviousPeriodData] = useState({
    energyData: {},
    waterData: {},
    wasteData: {},
    emissionData: {}
  });

  const [environmentLoading, setEnvironmentLoading] = useState(false);
  const [environmentError, setEnvironmentError] = useState(null);

  // Helper function to check if currentPeriodData has meaningful data
  const hasCurrentPeriodData = useMemo(() => {
    const { energyData, waterData, wasteData, emissionData } = currentPeriodData;
    
    // Check if any of the data objects have meaningful content
    const hasEnergyData = energyData && Object.keys(energyData).length > 0;
    const hasWaterData = waterData && Object.keys(waterData).length > 0;
    const hasWasteData = wasteData && Object.keys(wasteData).length > 0;
    const hasEmissionData = emissionData && Object.keys(emissionData).length > 0;
    
    return hasEnergyData || hasWaterData || hasWasteData || hasEmissionData;
  }, [currentPeriodData]);

  // Determine if we should show loader
  const shouldShowLoader = useMemo(() => {
    // Show loader if:
    // 1. Environment is loading
    // 2. We have selected financial year and locations but no current period data
    // 3. Initial loading state is true
    return (
      environmentLoading || 
      loading ||
      (firstFinancialYearId && selectedLocations.length > 0 && !hasCurrentPeriodData)
    );
  }, [environmentLoading, loading, firstFinancialYearId, selectedLocations, hasCurrentPeriodData]);

  // Initialize dropdowns & framework on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const financialYearResult = await getFinancialYear();

        if (financialYearResult) {
          setFirstFinancialYearId(financialYearResult.currentId);

          const [locationsData, frequencyData, frameworkData] = await Promise.all([
            getSource(),
            fetchFrequency(financialYearResult.currentId),
            fetchFramework()
          ]);

          setLocations(locationsData || []);
          setFrequency(frequencyData || "monthly");
          setCompanyFramework(frameworkData.map(item => item.id) || []);
          setFinancialYear(
            financialYearResult.data.map(fy => ({
              value: String(fy.id),
              label: fy.financial_year_value
            }))
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch frequency for second year when secondFinancialYearId changes
  useEffect(() => {
    const fetchSecondYearFrequency = async () => {
      if (secondFinancialYearId && (twoYearComparisonMode || comparisonMode)) {
        try {
          const secondYearFrequencyData = await fetchFrequency(secondFinancialYearId);
          setSecondYearFrequency(secondYearFrequencyData || "monthly");
        } catch (err) {
          console.error("Failed to fetch second year frequency:", err);
          setSecondYearFrequency("monthly"); // fallback
        }
      }
    };

    fetchSecondYearFrequency();
  }, [secondFinancialYearId, twoYearComparisonMode, comparisonMode]);

  // Generate time period options for first year
  useEffect(() => {
    if (frequency) {
      const start = getStartingMonth();
      const options = generateTimePeriodOptions(frequency, start);
      setTimePeriodOptions(options);
    }
  }, [frequency]);

  // Generate time period options for second year
  useEffect(() => {
    if (secondYearFrequency && (twoYearComparisonMode || comparisonMode)) {
      const start = getStartingMonth();
      const options = generateTimePeriodOptions(secondYearFrequency, start);
      setSecondYearTimePeriodOptions(options);
    }
  }, [secondYearFrequency, twoYearComparisonMode, comparisonMode]);

  // Process current year data
  useEffect(() => {
    const processCurrentData = async () => {
      if (firstFinancialYearId && selectedLocations.length > 0) {
        try {
          setEnvironmentLoading(true);
          const environmentalData = await getEnvironmentData(firstFinancialYearId);

          const timePeriods = {};
          selectedPeriodsValue.forEach((period, index) => {
            timePeriods[`period_${index}`] = period.fromDate;
          });

          const locationOptions = locations.filter(loc =>
            selectedLocations.includes(loc.id)
          );

          const rawData = {
            energy: environmentalData,
            water: environmentalData,
            waste: environmentalData,
            emission: environmentalData
          };

          const results = await calculateEnvironmentalData(
            rawData,
            timePeriods,
            locationOptions,
            companyFramework
          );

          setCurrentPeriodData(results);
        } catch (err) {
          setEnvironmentError(err.message);
        } finally {
          setEnvironmentLoading(false);
        }
      }
    };

    processCurrentData();
  }, [
    selectedPeriodsValue,
    selectedLocations,
    companyFramework,
    locations,
    secondFinancialYearId,
    firstFinancialYearId
  ]);

  // Process previous/second year data
  useEffect(() => {
    const fetchPreviousYearData = async () => {
      if (((comparisonMode || twoYearComparisonMode)) && secondFinancialYearId && selectedSecondPeriodsValue.length > 0) {
        try {
          setEnvironmentLoading(true);
          const prevRaw = await getEnvironmentData(secondFinancialYearId);

          const timePeriods = {};
          selectedSecondPeriodsValue.forEach((period, index) => {
            timePeriods[`period_${index}`] = period.fromDate;
          });

          const locationOptions = locations.filter(loc =>
            secondYearLocation.includes(loc.id)
          );

          const rawData = {
            energy: prevRaw,
            water: prevRaw,
            waste: prevRaw,
            emission: prevRaw
          };

          const results = await calculateEnvironmentalData(
            rawData,
            timePeriods,
            locationOptions,
            companyFramework
          );

          setPreviousPeriodData(results);
        } catch (err) {
          setEnvironmentError(err.message);
        } finally {
          setEnvironmentLoading(false);
        }
      }
    };

    fetchPreviousYearData();
  }, [
    twoYearComparisonMode,
    secondFinancialYearId,
    selectedSecondPeriodsValue,
    secondYearLocation,
    companyFramework,
    locations,
    secondYearPeriods,
    firstFinancialYearId
  ]);

  // Memoized dropdowns for first year
  const periodOptions = useMemo(() => {
    return (timePeriodOptions || []).map(period => ({
      value: period.value,
      label: period.label
    }));
  }, [timePeriodOptions]);

  // Memoized dropdowns for second year
  const secondYearPeriodOptions = useMemo(() => {
    return (secondYearTimePeriodOptions || []).map(period => ({
      value: period.value,
      label: period.label
    }));
  }, [secondYearTimePeriodOptions]);

  const locationOptions = useMemo(() => {
    return locations.map(loc => ({
      value: loc.id,
      label:
        loc?.unitCode ||
        `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
    }));
  }, [locations]);

  // Helper function to calculate date ranges
  const calculateDateRange = (type, period, startingMonth, year, periodOptionsArray) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;
    const showLevel = periodOptionsArray.find(q => q.value == period)?.label;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
      showLevel: showLevel
    };
  };

  useEffect(() => {
    if (!secondFinancialYearId || !secondYearTimePeriodOptions?.length) {
      setSecondYearPeriods([]);
      return;
    }
     const valuesArrayl = locationOptions.map(item => (item.value));
    setSecondYearLocation(valuesArrayl)
    const valuesArray = secondYearTimePeriodOptions.map(item => (item.value));
    setSecondYearPeriods(valuesArray);
  }, [secondYearTimePeriodOptions, secondFinancialYearId]);

  // Calculate selectedPeriodsValue for first year
  useEffect(() => {
    if (!firstFinancialYearId || !selectedPeriods?.length) {
      setSelectedPeriodsValue([]);
      return;
    }

    const selectedYear = financialYear.find(
      fy => fy.value == String(firstFinancialYearId)
    );
    if (!selectedYear) {
      setSelectedPeriodsValue([]);
      return;
    }

    const year = parseInt(selectedYear.label.split("-")[0]);
    const start = getStartingMonth();

    const dateRanges = selectedPeriods
      .map(period => {
        if (frequency == "HALF_YEARLY")
          return calculateDateRange(6, period, start, year, periodOptions);
        if (frequency == "QUARTERLY")
          return calculateDateRange(3, period, start, year, periodOptions);
        if (frequency == "MONTHLY")
          return calculateDateRange(1, period, start, year, periodOptions);
        if (frequency == "YEARLY")
          return calculateDateRange(12, 1, start, year, periodOptions);
        return null;
      })
      .filter(Boolean);

    setSelectedPeriodsValue(dateRanges);
  }, [selectedPeriods, firstFinancialYearId, frequency, periodOptions, financialYear]);

  // Calculate selectedSecondPeriodsValue for second year
  useEffect(() => {
    if (!secondFinancialYearId || !secondYearPeriods?.length) {
      setSelectedSecondPeriodsValue([]);
      return;
    }

    const selectedSecondYear = financialYear.find(
      fy => fy.value == String(secondFinancialYearId)
    );
    if (!selectedSecondYear) {
      setSelectedSecondPeriodsValue([]);
      return;
    }

    const year = parseInt(selectedSecondYear.label.split("-")[0]);
    const start = getStartingMonth();

    const dateRanges = secondYearPeriods
      .map(period => {
        if (secondYearFrequency == "HALF_YEARLY")
          return calculateDateRange(6, period, start, year, secondYearPeriodOptions);
        if (secondYearFrequency == "QUARTERLY")
          return calculateDateRange(3, period, start, year, secondYearPeriodOptions);
        if (secondYearFrequency == "MONTHLY")
          return calculateDateRange(1, period, start, year, secondYearPeriodOptions);
        if (secondYearFrequency == "YEARLY")
          return calculateDateRange(12, 1, start, year, secondYearPeriodOptions);
        return null;
      })
      .filter(Boolean);

    setSelectedSecondPeriodsValue(dateRanges);
  }, [
    secondYearPeriods,
    secondFinancialYearId,
    secondYearFrequency,
    secondYearPeriodOptions,
    financialYear,
    twoYearComparisonMode
  ]);

  // Handlers
  const handleFinancialYearChange = event => {
    setFirstFinancialYearId(event);
  };

  const handleSecondFinancialYearChange = event => {
    setSecondFinancialYearId(event);
    // Reset second year periods when financial year changes
    setSecondYearPeriods([]);
    setSelectedSecondPeriodsValue([]);
  };

  const handleClearFilters = () => {
    setFirstFinancialYearId("");
    setSelectedPeriods([]);
    setSelectedLocations([]);
    setComparisonMode(false);
    setTwoYearComparisonMode(false);
    setFirstYearLocation([]);
    setFirstYearPeriods([]);
    setSecondYearLocation([]);
    setSecondYearPeriods([]);
    setSecondFinancialYearId("");
    setSelectedSecondPeriodsValue([]);
    setSecondYearFrequency("monthly");
    setSecondYearTimePeriodOptions([]);
  };

  const getFinancialYearById = id => {
    const result = financialYear.find(item => item.value == String(id));
    return result ? result.label : null;
  };

  // Show loader if currentPeriodData is not available and conditions are met
  if (shouldShowLoader) {
    return (
      <Container
        fluid
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" size="lg">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-3">
            <h5>Loading Environmental Data...</h5>
            <p className="text-muted">Please wait while we fetch your data</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <FilterSection
        financialYear={financialYear}
        onFinancialYearChange={handleFinancialYearChange}
        onSecondFinancialYearChange={handleSecondFinancialYearChange}
        selectedPeriods={selectedPeriods}
        setSelectedPeriods={setSelectedPeriods}
        periodOptions={periodOptions}
        secondYearPeriodOptions={secondYearPeriodOptions}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        locationOptions={locationOptions}
        onClearFilters={handleClearFilters}
        activeTab="esg"
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        twoYearComparisonMode={twoYearComparisonMode}
        setTwoYearComparisonMode={setTwoYearComparisonMode}
        firstYearLocation={firstYearLocation}
        setFirstYearLocation={setFirstYearLocation}
        firstYearPeriods={firstYearPeriods}
        setFirstYearPeriods={setFirstYearPeriods}
        firstFinancialYearId={firstFinancialYearId}
        setFirstFinancialYearId={setFirstFinancialYearId}
        secondYearLocation={secondYearLocation}
        setSecondYearLocation={setSecondYearLocation}
        secondYearPeriods={secondYearPeriods}
        setSecondYearPeriods={setSecondYearPeriods}
        secondFinancialYearId={secondFinancialYearId}
        setSecondFinancialYearId={setSecondFinancialYearId}
        frequency={frequency}
        secondYearFrequency={secondYearFrequency}
        selectedPeriodsValue={selectedPeriodsValue}
        selectedSecondPeriodsValue={selectedSecondPeriodsValue}
        secondYearTimePeriodOptions={secondYearTimePeriodOptions}
      />

      <MetricsSection
        {...currentPeriodData}
        isLoading={environmentLoading}
        error={environmentError}
        financialYearId={firstFinancialYearId}
        companyFramework={companyFramework}
        comparisonMode={comparisonMode || twoYearComparisonMode}
      />

      {(comparisonMode || twoYearComparisonMode) && firstFinancialYearId && (
        <DetailedComparisonSection
          currentPeriodData={currentPeriodData}
          previousPeriodData={previousPeriodData}
          isLoading={environmentLoading}
          comparisonMode={comparisonMode}
          twoYearComparisonMode={twoYearComparisonMode}
          firstYearLabel={getFinancialYearById(firstFinancialYearId)}
          secondYearLabel={getFinancialYearById(secondFinancialYearId)}
          selectedPeriodsValue={selectedPeriodsValue}
          selectedSecondPeriodsValue={selectedSecondPeriodsValue}
        />
      )}

      {firstFinancialYearId && (
        <ChartsSection
          {...currentPeriodData}
          isLoading={environmentLoading}
          error={environmentError}
          companyFramework={companyFramework}
          previousPeriodData={previousPeriodData}
          comparisonMode={comparisonMode || twoYearComparisonMode}
          selectedPeriodsValue={selectedPeriodsValue}
          selectedSecondPeriodsValue={selectedSecondPeriodsValue}
        />
      )}

      {firstFinancialYearId && (
        <DataEntriesSection
          {...currentPeriodData}
          isLoading={environmentLoading}
          error={environmentError}
          comparisonMode={comparisonMode}
          companyFramework={companyFramework}
          frequency={frequency}
          secondYearFrequency={secondYearFrequency}
          twoYearComparisonMode={twoYearComparisonMode}
          selectedLocations={selectedLocations}
          secondYearLocation={secondYearLocation}
          locationOptions={locationOptions}
          selectedPeriodsValue={selectedPeriodsValue}
          selectedSecondPeriodsValue={selectedSecondPeriodsValue}
          financialYearId={firstFinancialYearId}
          secondFinancialYearId={secondFinancialYearId}
          getFinancialYearById={getFinancialYearById}
        />
      )}
    </Container>
  );
};

export default ESGEnvironmentDashboard;