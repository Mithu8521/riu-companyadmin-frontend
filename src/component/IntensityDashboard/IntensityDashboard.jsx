import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import SingleLocMultTime from "./SingleLocMultTime";
import SingleLocSingleTime from "./SingleLocSingleTime";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import AllLocAllTime from "./AllLocAllTime";
import CompareMultipleTime from "./CompareMultipleTime";

const IntensityDashboard = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  keyTab,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
}) => {
  const [companyFramework, setCompanyFramework] = useState([]);
  
  // New state for multiple intensity types
  const [intensityTypeToIntensities, setIntensityTypeToIntensities] = useState({});
  const [intensityTypes, setIntensityTypes] = useState([]);
  const [intensityQuestions, setIntensityQuestions] = useState([]);
  const [processedDataByType, setProcessedDataByType] = useState({});
  const [isLoadingIntensities, setIsLoadingIntensities] = useState(true);
  
  const icons = {
    0: done,
    1: updated,
    2: due,
    3: defaulted,
  };

  const [timePeriodValues, setTimePeriodValues] = useState([]);

  const getIntensityQuestions = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}intensity/questions`,
        {},
        {},
        "GET"
      );

      if (response && response.isSuccess && response?.data.length > 0) {
        setIntensityQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching intensity questions:", error);
      setIntensityQuestions([]);
    } finally {
    }
  }; 


  // Updated API call
  const getIntensities = async () => {
    try {
      setIsLoadingIntensities(true);
      if (financialYearId) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}intensity`,
          {},
          {financialYearId},
          "GET"
        );
        
        // Handle different response structures
        let dataArray = null;
        
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response && response.isSuccess && response.data && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response && Array.isArray(response.result)) {
          dataArray = response.result;
        }
        
        if (dataArray && dataArray.length > 0) {
          const intensityTypeToIntensities = dataArray.reduce((acc, intensity) => {
            if (!acc[intensity.type]) {
              acc[intensity.type] = [];
            }
            
            // Check if intensityQuestionAnswers exists and is an array
            const questionAnswers = intensity.intensityQuestionAnswers || [];
            
            for (const intensityQuestionAnswer of questionAnswers) {
              // Handle string values and convert to numbers
              const answer = Number(intensityQuestionAnswer.answer || 0);
              const metricValue = Number(intensityQuestionAnswer.metricValue || 0);

              // Skip if both answer and metricValue are 0 or invalid
              const isValidAnswer = !isNaN(answer) && answer !== 0;
              const isValidMetric = !isNaN(metricValue) && metricValue !== 0;
              
              // Only process if we have at least one valid value
              if (isValidAnswer || isValidMetric) {
                acc[intensity.type].push({
                  financialYearId: intensity.financialYearId,
                  sourceId: intensity.sourceId,
                  subLocationId: intensity.subLocationId,
                  fromDate: intensity.fromDate,
                  toDate: intensity.toDate,
                  type: intensity.type,
                  title: intensityQuestionAnswer.title,
                  answer: answer,
                  metricValue: metricValue,
                  intensity: isValidAnswer && isValidMetric ? (metricValue / answer) : 0,
                });
              }
            }
            return acc;
          }, {});
          
          setIntensityTypeToIntensities(intensityTypeToIntensities);
          setIntensityTypes(Object.keys(intensityTypeToIntensities));
        } else {
          // Handle case where response is empty or invalid
          setIntensityTypeToIntensities({});
          setIntensityTypes([]);
        }
      }
    } catch (error) {
      console.error("Error fetching intensity details:", error);
      setIntensityTypeToIntensities({});
      setIntensityTypes([]);
    } finally {
      setIsLoadingIntensities(false);
    }
  };

  useEffect(() => {   
    getIntensities();
  }, [locationOption, graphData, timePeriods, companyFramework]);

  const [quarters, setQuarters] = useState([]);
  const [locations, setLocations] = useState([]);

  const renderOverallSummary = () => {
    // Helper function to get filtered intensity question answers based on current time and location selections
    // Note: This includes ALL intensity types - only filters by time and location
    const getFilteredIntensityQuestionAnswers = (intensityTypeToIntensities) => {
      const intensityQuestionAnswers = {};
      
      // Get selected location IDs and time periods
      const selectedLocationIds = locationOption.map(loc => loc.id);
      const selectedTimePeriods = Object.values(timePeriods || {});
      
      // Process ALL intensity types (no filtering by intensity type)
      for(const intensityType of Object.keys(intensityTypeToIntensities)) {
        for(const intensity of intensityTypeToIntensities[intensityType]) {
          // Filter ONLY by selected locations and time periods
          const isLocationSelected = selectedLocationIds.includes(intensity.sourceId);
          const isTimePeriodSelected = selectedTimePeriods.includes(intensity.fromDate);
          
          if (isLocationSelected && isTimePeriodSelected) {
            const key = `${intensity.financialYearId}-${intensity.sourceId}-${intensity.subLocationId}-${intensity.fromDate}-${intensity.toDate}-${intensity.title}`;
            intensityQuestionAnswers[key] = intensity;
          }
        }
      }
      return Object.values(intensityQuestionAnswers);
    };

    // Calculate totals for each intensity question (filtered)
    const calculateFilteredQuestionTotals = () => {
      const questionTotals = {};
      const filteredIntensityQuestionAnswers = getFilteredIntensityQuestionAnswers(intensityTypeToIntensities);
      
      filteredIntensityQuestionAnswers.forEach(item => {
        if (!questionTotals[item.title]) {
          questionTotals[item.title] = 0;
        }
        questionTotals[item.title] += item.answer;
      });

      return questionTotals;
    };

    // Calculate filtered intensity metrics
    const calculateFilteredIntensityTotals = () => {
      const intensityTotals = {};
      const filteredIntensityQuestionAnswers = getFilteredIntensityQuestionAnswers(intensityTypeToIntensities);
      
      filteredIntensityQuestionAnswers.forEach(item => {
        if (!intensityTotals[item.title]) {
          intensityTotals[item.title] = {
            totalAnswer: 0,
            totalMetricValue: 0,
            count: 0
          };
        }
        intensityTotals[item.title].totalAnswer += item.answer;
        intensityTotals[item.title].totalMetricValue += item.metricValue;
        intensityTotals[item.title].count += 1;
      });

      return intensityTotals;
    };

    const formatNumberWithIndianCommas = (number) => {
      const x = number.toString().split(".");
      let num = x[0];
      let lastThree = num.slice(-3);
      const rest = num.slice(0, -3);

      if (rest !== "") {
        lastThree = "," + lastThree;
        const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        num = result + lastThree;
      } else {
        num = lastThree;
      }

      return x.length > 1 ? num + "." + x[1] : num;
    };

    const questionTotals = calculateFilteredQuestionTotals();
    const intensityTotals = calculateFilteredIntensityTotals();
    const totalIntensityTypes = intensityTypes.length;

    // Get count of selected locations and time periods for context
    const selectedLocationsCount = locationOption?.length || 0;
    const selectedTimePeriodsCount = Object.keys(timePeriods || {}).length;

    return (
      <div className="overall-summary-section" style={{ 
        padding: "15px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px" 
      }}>
        <h4>
          Summary 
          <span style={{ fontSize: "12px", color: "#666", fontWeight: "normal", marginLeft: "10px" }}>
            ({selectedLocationsCount} location{selectedLocationsCount !== 1 ? 's' : ''}, {selectedTimePeriodsCount} time period{selectedTimePeriodsCount !== 1 ? 's' : ''})
          </span>
        </h4>
        <div className="summary-grid" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "15px",
          marginTop: "10px"
        }}>
          {/* Display totals for each intensity question */}
          {Object.entries(questionTotals).map(([questionTitle, total]) => {
            const intensityData = intensityTotals[questionTitle];
            const averageIntensity = intensityData && intensityData.totalAnswer > 0 
              ? intensityData.totalMetricValue / intensityData.totalAnswer 
              : 0;

            return (
              <div key={questionTitle} className="summary-card" style={{ 
                background: "#e2eafd", 
                padding: "10px", 
                borderRadius: "8px", 
                textAlign: "center" 
              }}>
                <div style={{ fontSize: "14px", color: "#666" }}>{questionTitle}</div>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#0057a7" }}>
                  {formatNumberWithIndianCommas(total.toFixed(2))}
                </div>
                {averageIntensity > 0 && (
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    Avg Intensity: {formatNumberWithIndianCommas(averageIntensity.toFixed(3))}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Always show intensity types count (total available, not filtered) */}
          <div className="summary-card" style={{ 
            background: "#e2eafd", 
            padding: "10px", 
            borderRadius: "8px", 
            textAlign: "center" 
          }}>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Intensity Types</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#0057a7" }}>
              {totalIntensityTypes}
            </div>
          </div>

          {/* Show selected filters info */}
          <div className="summary-card" style={{ 
            background: "#fff3cd", 
            padding: "10px", 
            borderRadius: "8px", 
            textAlign: "center" 
          }}>
            <div style={{ fontSize: "14px", color: "#666" }}>Selected Scope</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#856404" }}>
              {selectedLocationsCount} Location{selectedLocationsCount !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#856404" }}>
              {selectedTimePeriodsCount} Period{selectedTimePeriodsCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getMetricFields = () => {
    if (intensityQuestions) {
      return intensityQuestions.map((intensityQuestion) => intensityQuestion.title);
    } else {
      console.error("No intesity questions found.");
    }
  };

  // Function to process data for a specific intensity type
  const processDataForIntensityType = (intensityData) => {
    if (!intensityData || !locationOption || !timePeriods) {
      return { time: {}, location: {} };
    }

    const valuesArray = locationOption.map((item) => item.unitCode || item.value);
    const transformedKeys = Object.keys(timePeriods);
    const metricFields = getMetricFields(companyFramework.includes(48));

    const summary = {
      time: {},
      location: {},
    };

    // Initialize summary structure
    locationOption.forEach((location) => {
      transformedKeys.forEach((quarter) => {
        summary.location[quarter] = {};
        metricFields.forEach(field => {
          summary.location[quarter][field] = new Array(locationOption.length).fill(0);
        });
      });
    });

    transformedKeys.forEach((quarter) => {
      locationOption.forEach((location) => {
        summary.time[location.unitCode] = {};
        metricFields.forEach(field => {
          summary.time[location.unitCode][field] = new Array(transformedKeys.length).fill(0);
        });
      });
    });

    const timeKey = Object.keys(summary.location);
    const locationKey = Object.keys(summary.time);

    // Process time-based data
    for (const location in summary.time) {
      const data = summary.time[location];
      for (const key in data) {
        for (let k = 0; k < summary.time[location][key].length; k++) {
          let time = timeKey[k];
          const obj = locationOption.find(
            (item) => item.unitCode === location
          );
          if (obj) {
            const fromDate = timePeriods[time];
            const filterData = intensityData.find(
              (item) =>
                item.title === key &&
                item.fromDate === fromDate &&
                item.sourceId === obj.id
            );
            summary.time[location][key][k] = Number(filterData?.intensity) || 0;
          }
        }
      }
    }

    // Process location-based data
    for (const time in summary.location) {
      const data = summary.location[time];
      for (const key in data) {
        for (let k = 0; k < summary.location[time][key].length; k++) {
          let location = locationKey[k];
          const obj = locationOption.find(
            (item) => item.unitCode === location
          );
          if (obj) {
            const fromDate = timePeriods[time];
            const filterData = intensityData.find(
              (item) =>
                item.title === key &&
                item.fromDate === fromDate &&
                item.sourceId === obj.id
            );
            summary.location[time][key][k] = Number(filterData?.intensity) || 0;
          }
        }
      }
    }

    return {
      time: summary.time,
      location: summary.location,
    };
  };

  // Process data for all intensity types
  useEffect(() => {
    if (intensityTypeToIntensities && Object.keys(intensityTypeToIntensities).length > 0) {
      const processedData = {};
      
      Object.keys(intensityTypeToIntensities).forEach(intensityType => {
        processedData[intensityType] = processDataForIntensityType(
          intensityTypeToIntensities[intensityType]
        );
      });
      
      setProcessedDataByType(processedData);
    }
  }, [locationOption, timePeriods, intensityTypeToIntensities, companyFramework]);

  // Set up basic data
  useEffect(() => {
    if (locationOption && timePeriods) {
      const valuesArray = locationOption.map((item) => item.unitCode || item.value);
      const transformedKeys = Object.keys(timePeriods);
      const timePeriodsArray = Object.values(timePeriods || []);
      
      setTimePeriodValues(timePeriodsArray);
      setQuarters(transformedKeys);
      setLocations(valuesArray);
    }
  }, [locationOption, timePeriods]);

  useEffect(() => {
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue
        .map((value) => value?.id)
        .filter((id) => id !== undefined);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);

  useEffect(() => {
    getIntensityQuestions();
  }, []);

  const renderIntensityTypeComponent = (data) => {    
    if (keyTab === "combinedAll") {
      return (
        <AllLocAllTime
          keyTab={keyTab}
          intensityTypes={intensityTypes}
          intensityQuestions={getMetricFields()}
          processedDataByType={data}
        />
      );
    } else if (keyTab === "compareToYear") {
      return (
        <MultipleYearMultipleTime
          locationOption={locationOption}
          timePeriodValues={timePeriodValues}
          intensityTypes={intensityTypes}
          intensityQuestions={getMetricFields()}
          processedDataByType={data}
        />
      );
    } else if (companyFramework?.length && companyFramework.includes(1)) {
      if ((timePeriodValues?.length === 1 && locationOption?.length === 1) ||
          (locationOption?.length > 1 && timePeriodValues?.length === 1 && keyTab === "combined")) {
        return (
          <SingleLocSingleTime
            intensityTypes={intensityTypes}
            intensityQuestions={getMetricFields()}
            processedDataByType={processedDataByType}
          />
        );
      } else if ((locationOption?.length > 1 && timePeriodValues?.length > 1 && keyTab === "combined") ||
                (locationOption?.length > 1 && timePeriodValues?.length === 1) ||
                (locationOption?.length === 1 && timePeriodValues?.length > 1)) {
        return (
          <SingleLocMultTime
            companyFramework={companyFramework}
            locationOption={locationOption}
            timePeriodValues={timePeriodValues}
            intensityTypes={intensityTypes}
            intensityQuestions={getMetricFields()}
            processedDataByType={processedDataByType}
          />
        );
      }
    } else {
      if ((timePeriodValues?.length === 1 && locationOption?.length === 1) ||
          (locationOption?.length > 1 && timePeriodValues?.length === 1 && keyTab === "combined")) {
        return (
          <SingleLocSingleTime
            intensityTypes={intensityTypes}
            intensityQuestions={getMetricFields()}
            processedDataByType={processedDataByType}
          />
        );
      } else if ((locationOption?.length > 1 && timePeriodValues?.length > 1 && keyTab === "combined") ||
                (locationOption?.length > 1 && timePeriodValues?.length === 1) ||
                (locationOption?.length === 1 && timePeriodValues?.length > 1)) {
        return (
          <SingleLocMultTime
            companyFramework={companyFramework}
            locationOption={locationOption}
            timePeriodValues={timePeriodValues}
            intensityTypes={intensityTypes}
            intensityQuestions={getMetricFields()}
            processedDataByType={processedDataByType}
          />
        );
      } else if (timePeriodValues) {
        return (
          <CompareMultipleTime
            locationOption={locationOption}
            timePeriods={timePeriods}
            processedDataByType={processedDataByType}
            intensityTypes={intensityTypes}
            intensityQuestions={getMetricFields()}
          />
        );
      }
    }
    return null;
  };

  return (
    <div className="progress-container">
      {isLoadingIntensities ? (
        <div className="loading-container">
          <div>Loading intensity data...</div>
        </div>
      ) : intensityTypes.length > 0 ? (
        <>
          
          {/* Overall summary section - only show if we have processed data */}
          {Object.keys(processedDataByType).length > 0 && renderOverallSummary()}
          
          {/* All intensity type graphs without individual headings */}
          {Object.keys(processedDataByType).length > 0 && renderIntensityTypeComponent(processedDataByType)}
        </>
      ) : (
        <div>No intensity data available</div>
      )}
    </div>
  );
};

export default IntensityDashboard;