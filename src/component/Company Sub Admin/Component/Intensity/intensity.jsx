import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../../../sidebar/sidebar';
import Header from '../../../header/header';
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";

// Intensity Type enum
export const IntensityType = {
  CarbonIntensity: 'CarbonIntensity',
  WaterIntensity: 'WaterIntensity',
  WasteIntensity: 'WasteIntensity',
  HazardousWasteIntensity: 'HazardousWasteIntensity',
  NonHazardousWasteIntensity: 'NonHazardousWasteIntensity',
  BioWasteIntensity: 'BioWasteIntensity',
  FuelIntensity: 'FuelIntensity',
  RenewableEnergyIntensity: 'RenewableEnergyIntensity',
  ElectricityIntensity: 'ElectricityIntensity',
};

export const IntensityUnitMap = {
  [IntensityType.CarbonIntensity]: 'CO2 Emissions (Kg)',
  [IntensityType.WaterIntensity]: 'Water Consumed (KL)',
  [IntensityType.WasteIntensity]: 'Waste Produced (Kg)',
  [IntensityType.HazardousWasteIntensity]: 'Hazardous Waste Produced (Kg)',
  [IntensityType.NonHazardousWasteIntensity]: 'Non Hazardous Waste Produced (Kg)',
  [IntensityType.BioWasteIntensity]: 'Bio Medical Waste Produced (Kg)',
  [IntensityType.FuelIntensity]: 'Fuel Consumed (GJ)',
  [IntensityType.RenewableEnergyIntensity]: 'Renewable Energy Consumed (kWh)',
  [IntensityType.ElectricityIntensity]: 'Electricity Consumed (kWh)',
};

const IntensityContent = () => {
  const [locations, setLocations] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIntensityType, setSelectedIntensityType] = useState("");
  const [identifier, setIdentifier] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [monthValue, setMonthValue] = useState();
  const [intensities, setIntensities] = useState({});
  const [intensityQuestions, setIntensityQuestions] = useState([]);
  // New state for managing answers and save status
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  // Helper function to create composite key for unique answer identification
  const getIntensityKey = (intensityType, financialYearId, sourceId, subLocationId, fromDate, toDate) => {
    return `${intensityType}-${financialYearId}-${sourceId}-${subLocationId}-${fromDate}-${toDate}`;
  };

  const getFrequency = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
        {},
        { financialYearId: selectedFinancialYear },
        "GET"
      );
      if (isSuccess) {
        setIdentifier(data.data);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  };    

  // Fetch Financial Years and set the latest one by default
  const getFinancialYears = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearsData');
      
      if (storedData) {
        // Use data from local storage
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData);
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id); // Auto-select last value
        }
      } else {
        // Call API if data not found in local storage
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        
        if (isSuccess && data?.data.length > 0) {
          // Store data in local storage
          localStorage.setItem('financialYearsData', JSON.stringify(data.data));
          
          // Set state with API response
          setFinancialYears(data.data);
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id); // Auto-select last value
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };    

  // Fetch Locations
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

  const getIntensityQuestions = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}intensity/questions`,
        {},
        {},
        "GET"
      );
      if (response && Array.isArray(response)) {
        setIntensityQuestions(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setIntensityQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching intensity questions:", error);
    }
  }

  const getIntensities = async () => {
    try {
      if (selectedIntensityType && selectedFinancialYear) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}intensity`,
          {},
          {intensityType: selectedIntensityType, financialYearId: selectedFinancialYear},
          "GET"
        );
        
        if (response && Array.isArray(response)) {
          const intensitiesMap = response.reduce((acc, intensity) => {
            const key = getIntensityKey(
              intensity.type, 
              intensity.financialYearId, 
              intensity.sourceId, 
              intensity.subLocationId, 
              intensity.fromDate, 
              intensity.toDate
            );
            acc[key] = intensity;
            return acc;
          }, {});
          setIntensities(intensitiesMap);
          
          // Load saved answers into local state for editing
          loadSavedAnswersToState(intensitiesMap);
        } else if (response?.data && Array.isArray(response.data)) {
          const intensitiesMap = response.data.reduce((acc, intensity) => {
            const key = getIntensityKey(
              intensity.type, 
              intensity.financialYearId, 
              intensity.sourceId, 
              intensity.subLocationId, 
              intensity.fromDate, 
              intensity.toDate
            );
            acc[key] = intensity;
            return acc;
          }, {});
          setIntensities(intensitiesMap);
          
          // Load saved answers into local state for editing
          loadSavedAnswersToState(intensitiesMap);
        }
      }
    } catch (error) {
      console.error("Error fetching intensity details:", error);
    }
  }

  // Load saved answers into local state for editing
  const loadSavedAnswersToState = (intensitiesMap) => {
    const intensityKey = getIntensityKey(
      selectedIntensityType,
      selectedFinancialYear,
      selectedLocation,
      null,
      fromDate,
      toDate
    );
    
    const currentIntensity = intensitiesMap[intensityKey];
    
    if (currentIntensity?.intensityQuestionAnswers) {
      const savedAnswersObj = {};
      currentIntensity.intensityQuestionAnswers.forEach(answer => {
        if (answer.isAnswerEditable) {
          savedAnswersObj[answer.questionId] = answer.answer || '';
        }
      });
      setAnswers(savedAnswersObj);
    }
  };

  const saveIntensity = async () => {
    try {
      setLoadingAnswers(true);

      // Prepare intensity data for saving
      const intensityData = {
        intensity: JSON.stringify(Object.keys(answers).map(questionIdStr => {
          const questionId = parseInt(questionIdStr);
          const answer = parseFloat(answers[questionId])

          if (!answer) return undefined;

          return {
            financialYearId: selectedFinancialYear,
            sourceId: selectedLocation,
            subLocationId: null,
            fromDate,
            toDate,
            questionId: parseInt(questionId),
            answer: parseFloat(answers[questionId]) || 0
          }
        }).filter(Boolean))
      }

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}intensity`,
        {},
        intensityData,
        "POST"
      );

      console.log("Save Intensity Response: ", response);

      if (response.isSuccess) {
        // Refresh intensities after saving
        await getIntensities();
      }
    } catch (error) {
      console.error("Error saving intensity:", error);
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Handle input change for answers
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || 1;

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  };

  useEffect(() => {
    setMonthValue();
    setFromDate();
    setToDate();
    setTimePeriodOptions([]);

    if (identifier) {
      let options = [];
      if (identifier === "MONTHLY") {
        const monthOptions =
          start === 1
            ? months
            : [...months.slice(start - 1), ...months.slice(0, start - 1)];

        // Map options to { label, value } format
        const formattedOptions = monthOptions.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1, // Ensures values cycle correctly from 1 to 12
        }));

        setTimePeriodOptions(formattedOptions);
      } else if (identifier === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${
            months[(quarterEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (identifier === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${
            months[(halfEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: half, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (identifier === "YEARLY") {
        const yearlyStartIndex = start - 1;
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${
              months[(yearlyStartIndex - 1 + 12) % 12]
            }`,
            value: 1,
          },
        ];
        setTimePeriodOptions(options);
      }
    }
  }, [identifier, start]);

  const handlePeriodChange = (value) => {
    const years = financialYears.find(
      (item) => item.id == selectedFinancialYear
    )?.financial_year_value;
  
    const year = parseInt(years.split("-")[0]);
  
    let earliestFromDate = null;
    let latestToDate = null;
  
    let dateRange;
  
    if (identifier === "HALF_YEARLY") {
      const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary
      const halfYear = sixMonthLater === (value + 1) % 12 ? 2 : 1;
      dateRange = calculateDateRange(6, value, start, year);
    } else if (identifier === "QUARTERLY") {
      dateRange = calculateDateRange(3, value, start, year);
    } else if (identifier === "MONTHLY") {
      const startIndex = start - 1;
      const firstMonthIndex =
        (value - startIndex + months.length) % months.length;
      dateRange = calculateDateRange(1, value, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }
    
    if (dateRange) {
      if (
        !earliestFromDate ||
        new Date(dateRange.fromDate) < new Date(earliestFromDate)
      ) {
        earliestFromDate = dateRange.fromDate;
      }
      if (
        !latestToDate ||
        new Date(dateRange.toDate) > new Date(latestToDate)
      ) {
        latestToDate = dateRange.toDate;
      }
    }
    setFromDate(earliestFromDate);
    setToDate(latestToDate);
    setMonthValue(value);
  };

  // Initial data loading
  useEffect(() => {
    getFinancialYears();
    getSource();
    getIntensityQuestions();
  }, []);

  // Handle Financial Year selection - RESET ALL other filters
  useEffect(() => {
    if (selectedFinancialYear) {
      // Reset ALL dependent filters when financial year changes
      setSelectedLocation("");
      setSelectedIntensityType("");
      setAnswers({});
      setIntensities({});
      
      // Load frequency for the new financial year
      getFrequency();
    }
  }, [selectedFinancialYear]);

  // Call getIntensities when any filter changes (but all must be selected)
  useEffect(() => {
    const allFiltersSelected = selectedFinancialYear && 
                              selectedLocation && 
                              selectedIntensityType && 
                              fromDate && 
                              toDate;

    if (allFiltersSelected) {
      // Clear previous data before loading new
      setAnswers({});
      setIntensities({});
      
      // Call getIntensities when all filters are selected
      getIntensities();
    }
  }, [selectedFinancialYear, selectedLocation, selectedIntensityType, fromDate, toDate]);

  // Load saved answers when period changes and we have intensities data
  useEffect(() => {
    if (fromDate && toDate && Object.keys(intensities).length > 0) {
      loadSavedAnswersToState(intensities);
    }
  }, [fromDate, toDate, selectedLocation, intensities]);

  // Get intensity type options with proper labels
  const getIntensityTypeOptions = () => {
    return Object.entries(IntensityType).map(([key, value]) => ({
      value,
      label: key.replace(/([A-Z])/g, ' $1').trim() // Convert CamelCase to readable format
    }));
  };

  // Helper function to get answer value for a question
  const getAnswerValue = (questionId) => {
    // Always return from local answers state for editable fields
    if (isAnswerEditable(questionId)) {
      return answers[questionId] || '';
    }
    
    // For non-editable fields, get from saved data
    const intensityKey = getIntensityKey(
      selectedIntensityType,
      selectedFinancialYear,
      selectedLocation,
      null,
      fromDate,
      toDate
    );
    const currentIntensity = intensities[intensityKey];

    if (currentIntensity?.intensityQuestionAnswers) {
      const intensityAnswer = currentIntensity.intensityQuestionAnswers.find(
        answer => answer.questionId === questionId
      );
      return intensityAnswer?.answer || '';
    }

    return '';
  };

  const isAnswerEditable = (questionId) => {
    const intensityKey = getIntensityKey(
      selectedIntensityType,
      selectedFinancialYear,
      selectedLocation,
      null,
      fromDate,
      toDate
    );
    const currentIntensity = intensities[intensityKey];
    
    if (currentIntensity?.intensityQuestionAnswers) {
      const intensityAnswer = currentIntensity.intensityQuestionAnswers.find(
        answer => answer.questionId === questionId
      );
      return intensityAnswer && intensityAnswer.isAnswerEditable !== false;
    }
    
    return false;
  }

  // Helper function to get metric value for a question
  const getMetricValue = (questionId) => {
    const intensityKey = getIntensityKey(
      selectedIntensityType,
      selectedFinancialYear,
      selectedLocation,
      null,
      fromDate,
      toDate
    );
    const currentIntensity = intensities[intensityKey];
    
    if (currentIntensity?.intensityQuestionAnswers) {
      const intensityAnswer = currentIntensity.intensityQuestionAnswers.find(
        answer => answer.questionId === questionId
      );
      return intensityAnswer?.metricValue ?? '';
    }
    
    return '';
  };

  // Helper function to calculate intensity
  const calculateIntensity = (questionId) => {
    const answer = getAnswerValue(questionId);
    const metricValue = getMetricValue(questionId);

    if (answer === null || answer === undefined || metricValue === null || metricValue === undefined) return '';

    const answerNum = parseFloat(answer);
    const metricNum = parseFloat(metricValue);

    if (isNaN(answerNum) || isNaN(metricNum)) return '';

    if (answerNum === 0) return '0.00';

    return (metricNum / answerNum);
  };

  return (
    <div className="carbon-intensity-container">
      {/* Filter Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h2>Configuration</h2>
          <p>Select parameters for intensity analysis</p>
        </div>
        
        <div className="row g-4">
          {/* Financial Year Filter - Step 1 */}
          <div className="col-md-3">
            <div className="filter-card h-100">
              <div className="filter-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="filter-content">
                <label className="form-label">
                  Financial Year <span className="step-indicator">Step 1</span>
                </label>
                <select
                  value={selectedFinancialYear}
                  onChange={(e) => setSelectedFinancialYear(e.target.value)}
                  className="form-select custom-select"
                >
                  <option value="">Select Financial Year</option>
                  {financialYears.map((year, index) => (
                    <option key={index} value={year.id}>
                      {year.financial_year_value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Filter - Step 2 */}
          <div className="col-md-3">
            <div className="filter-card h-100">
              <div className="filter-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="filter-content">
                <label className="form-label">
                  Location <span className="step-indicator">Step 2</span>
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="form-select custom-select"
                  disabled={!selectedFinancialYear}
                >
                  <option value="">Select Location</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location.id}>
                      {location?.unitCode ||
                        `${location?.location?.area || ""}, ${
                          location?.location?.city || ""
                        }, ${location?.location?.state || ""}, ${
                          location?.location?.country || ""
                        }`.trim()}
                    </option>
                  ))}
                </select>
                {!selectedFinancialYear && (
                  <small className="text-muted">Select Financial Year first</small>
                )}
              </div>
            </div>
          </div>

          {/* Frequency Filter - Step 3 */}
          <div className="col-md-3">
            <div className="filter-card h-100">
              <div className="filter-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="filter-content">
                <label className="form-label">
                  Reporting Frequency <span className="step-indicator">Step 3</span>
                </label>
                <select
                  className="form-select custom-select"
                  value={monthValue || ''}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  disabled={!selectedFinancialYear || !selectedLocation}
                >
                  <option value="">Select Frequency</option>
                  {timePeriodOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {(!selectedFinancialYear || !selectedLocation) && (
                  <small className="text-muted">Complete previous steps first</small>
                )}
              </div>
            </div>
          </div>

          {/* Intensity Type Filter - Step 4 */}
          <div className="col-md-3">
            <div className="filter-card h-100">
              <div className="filter-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <div className="filter-content">
                <label className="form-label">
                  Intensity Type <span className="step-indicator final">Step 4</span>
                </label>
                <select
                  value={selectedIntensityType}
                  onChange={(e) => setSelectedIntensityType(e.target.value)}
                  className="form-select custom-select"
                  disabled={!selectedFinancialYear || !selectedLocation || !monthValue}
                >
                  <option value="">Select Intensity Type</option>
                  {getIntensityTypeOptions().map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {(!selectedFinancialYear || !selectedLocation || !monthValue) && (
                  <small className="text-muted">Complete previous steps first</small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Intensity Questions */}
      {selectedLocation && monthValue && selectedIntensityType && (
        <div className="questions-section">
          <div className="section-header text-center mb-5">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-start">
                <h2>Intensity Metrics</h2>
                <p>Enter consumption data to calculate intensity values</p>
                {fromDate && toDate && (
                  <div className="period-info">
                    <i className="fas fa-calendar-alt me-1"></i>
                    Period: <strong>{fromDate}</strong> to <strong>{toDate}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loadingAnswers && (
            <div className="loading-overlay">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Loading saved answers for selected period...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!intensityQuestions || intensityQuestions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3 className="empty-state-title">No Intensity Questions Found</h3>
              <p className="empty-state-description">
                There are no intensity questions configured for the selected filters.
                Please check your configuration or contact your administrator.
              </p>
            </div>
          ) : (
            <>
              <div className="questions-grid">
                {intensityQuestions.map((question, index) => (
                  <div key={question.id || index} className="mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label fw-semibold" htmlFor={`answer-${question.id}`}>
                              {question.title}
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                name={`answer-${question.id}`}
                                id={`answer-${question.id}`}
                                className={`form-control custom-input ${!isAnswerEditable(question.id) ? 'readonly-input' : ''}`}
                                placeholder="Enter value..."
                                value={isAnswerEditable(question.id) ? (answers[question.id] || '') : parseFloat(getAnswerValue(question.id) || 0).toFixed(2)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (!/[eE]/.test(value)) { // Prevent 'e' character
                                    handleAnswerChange(question.id, value);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'e' || e.key === 'E') {
                                    e.preventDefault();
                                  }
                                }}
                                readOnly={!isAnswerEditable(question.id)}
                              />
                            </div>
                            {!isAnswerEditable(question.id) && (
                              <small className="text-muted">This value is locked and cannot be edited</small>
                            )}
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fw-semibold" htmlFor={`metric-value-${question.id}`}>
                              {IntensityUnitMap[selectedIntensityType] || 'Metric Value'}
                            </label>
                            <div className="input-group intensity-container">
                              <input
                                type="text"
                                name={`metric-value-${question.id}`}
                                id={`metric-value-${question.id}`}
                                className="form-control custom-input intensity-input"
                                placeholder="Will be calculated automatically"
                                value={parseFloat(getMetricValue(question.id) || 0).toFixed(2)}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fw-semibold" htmlFor={`intensity-${question.id}`}>
                              {selectedIntensityType ? 
                                getIntensityTypeOptions().find(opt => opt.value === selectedIntensityType)?.label || 'Intensity' 
                                : 'Intensity'}
                            </label>
                            <div className="input-group intensity-container">
                              <input
                                type="text"
                                name={`intensity-${question.id}`}
                                id={`intensity-${question.id}`}
                                className="form-control custom-input intensity-input"
                                placeholder="Will be calculated automatically"
                                value={parseFloat(calculateIntensity(question.id) || 0).toFixed(2)}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-save text-end mb-5">
                <button
                  className="btn btn-success btn-lg save-all-btn"
                  onClick={saveIntensity}
                  disabled={!selectedFinancialYear || !selectedLocation || !selectedIntensityType || !fromDate || !toDate}
                >
                  <i className="fas fa-save me-2"></i>
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      )}


      <style>{`
        .carbon-intensity-container {
          width: 100%;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .filters-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .filters-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
        }

        .filters-header p {
          margin: 0.5rem 0 0 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .filter-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(229, 231, 235, 0.5);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-card:hover {
          transform: translateY(-3px);
        }

        .filter-icon {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.2rem;
        }

        .filter-content {
          flex: 1;
        }

        .filter-content .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .step-indicator {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .step-indicator.final {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .custom-select {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          padding: 0.75rem;
          background: white;
          color: #374151;
          transition: all 0.2s ease;
        }

        .custom-select:focus {
          border-color: #3b82f6;
        }

        .custom-select:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .questions-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          z-index: 10;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .loading-spinner i {
          font-size: 2rem;
          color: #3b82f6;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .period-info {
          color: #3b82f6;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .save-all-btn {
          border-radius: 12px;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          transition: all 0.3s ease;
        }

        .save-all-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .save-all-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .card {
          border: none;
          border-radius: 16px;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .custom-input {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          padding: 0.75rem;
          transition: all 0.3s ease;
        }

        .custom-input:focus {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .readonly-input {
          background: linear-gradient(135deg, #f9fafb, #f3f4f6) !important;
          border-color: #d1d5db !important;
          cursor: not-allowed;
        }

        .intensity-input {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
          cursor: not-allowed;
          border: 2px solid #10b981 !important;
        }

        .intensity-container {
          border-radius: 10px;
        }

        .intensity-container .form-control {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        }

        .text-muted {
          color: #6b7280 !important;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          min-height: 400px;
        }

        .empty-state-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .empty-state-icon i {
          font-size: 3rem;
          color: #9ca3af;
        }

        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .empty-state-description {
          font-size: 1rem;
          color: #6b7280;
          max-width: 500px;
          line-height: 1.6;
          margin: 0;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @media (max-width: 768px) {
          .carbon-intensity-container {
            padding: 1rem;
          }

          .filter-card {
            flex-direction: column;
            text-align: center;
          }

          .section-header .d-flex {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mb-4 {
          animation: fadeInUp 0.6s ease forwards;
        }

        .mb-4:nth-child(2) {
          animation-delay: 0.1s;
        }

        .mb-4:nth-child(3) {
          animation-delay: 0.2s;
        }

        .mb-4:nth-child(4) {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

// Wrapper component that includes Sidebar and Header
const Intensity = (props) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const appSidebarStyle = { 
    flex: sidebarExpanded ? "0 0 260px" : "0 0 60px", 
    position: "sticky", 
    top: 0, 
    zIndex: 1000, 
    transition: "flex 0.3s ease", 
    height: "100vh", 
    backgroundColor: "#fff", 
    borderRight: "1px solid #eee" 
  };
  const contentContainerStyle = { 
    flex: 1, 
    transition: "flex 0.3s ease", 
    height: "100vh", 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden' 
  };
  const headerStyle = { 
    zIndex: 999, 
    flexShrink: 0, 
    borderBottom: "1px solid #eee" 
  };
  const mainWrapperStyle = { 
    flexGrow: 1, 
    overflow: 'auto', 
    width: '100%', 
    display: 'flex', 
    position: 'relative' 
  };

  return (
    <div className="d-flex flex-row mainclass" style={{ height: "100vh", overflow: "hidden" }}>
      <div style={appSidebarStyle}>
        <Sidebar onSidebarToggle={setSidebarExpanded} isExpanded={sidebarExpanded} />
      </div>
      <div style={contentContainerStyle}>
        <div style={headerStyle}>
          <Header />
        </div>
        <div className="main_wrapper" style={mainWrapperStyle}>
          <IntensityContent />
        </div> 
      </div>
    </div>
  );
};

export default Intensity;