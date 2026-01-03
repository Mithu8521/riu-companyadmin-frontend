import React, { useState, useEffect, useMemo } from "react";

// Import services
import {
  getFinancialYear,
  getTrainingData,
  getAllRegisteredTrainee,
  getTrainingCategories,
  getTrainingPrinciples,
  fetchFrequency,
  getSource
} from "./services/trainingService";

// Import components
import FilterSection from "./components/filters/FilterSection";
import { EmployeesStatsCards, StatsCards, TrainingCoverageSummary } from "./components/training/TrainingSummaryComponents";
import { DetailedTrainingCoverageBreakdown } from "./components/training/DetailedBreakdownComponent";
import { PrincipleCoverageAnalysis } from "./components/training/PrincipleAnalysisComponent";
import PrincipleComplianceMatrix from "./components/training/PrincipleComplianceMatrix";
import { HumanRightsTrainingCoverageDetails } from "./components/training/HumanRightsTrainingCoverageDetails";

// Import hooks
import { useProcessedEmployeeData, useProcessedTraineeData, useProcessedTrainingData } from "./hooks/useTrainingData";
import { useTrainingComplianceData } from "./hooks/useComplianceData";
import { generateTimePeriodOptions, getStartingMonth } from "../../CarbonFootPrinting/utils/PeriodCalculationUtils";
import LocationWiseGraph from "./LocationWiseGraph";
import GenderChart from "./GenderDistributionGraph";
import YearlyTrainingGraph from "./YearlyTrainingGraph";
import HumanRightsGraph from "./HumanRightsGraph";
import TrainingCoverageCharts from "./TrainingCoverageCharts";

const TrainingDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("trainings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationType, setVisualizationType] = useState("analysis");

  // Financial Year state
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(null);
  const [financialYearValue, setFinancialYearValue] = useState(null);
  const [previousFinancialYearId, setPreviousFinancialYearId] = useState([]);
  const [previousFinancialYearValue, setPreviousFinancialYearValue] = useState(null);

  // Training data state
  const [trainingData, setTrainingData] = useState([]);
  const [previousTrainingData, setPreviousTrainingData] = useState([]);
  const [trainingCategories, setTrainingCategories] = useState([]);
  const [trainingPrinciples, setTrainingPrinciples] = useState([]);

  // Add trainee list state
  const [traineeList, setTraineeList] = useState([]);
  const [previousTraineeList, setPreviousTraineeList] = useState([]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Other state variables
  const [frequency, setFrequency] = useState(null);
  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);

  const isDateInRange = (dateToCheck, rangeLabel, startMonthIndex, financialYear) => {
    const [startYearStr, endYearStr] = financialYear.split('-');
    const startYear = parseInt(startYearStr);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [labelStartStr, labelEndStr] = rangeLabel.split(' - ').map(m => m.trim());
    const labelStartIndex = monthNames.indexOf(labelStartStr);
    const labelEndIndex = monthNames.indexOf(labelEndStr);

    if (labelStartIndex === -1 || labelEndIndex === -1) {
      throw new Error("Invalid range label. Use short month names like 'Apr', 'Jun'.");
    }

    function getActualYear(monthIndex) {
      return (monthIndex >= startMonthIndex) ? startYear : startYear + 1;
    }

    const startDate = new Date(getActualYear(labelStartIndex), labelStartIndex, 1);
    const endDate = new Date(getActualYear(labelEndIndex), labelEndIndex + 1, 0);  // 0 = last day of previous month

    return dateToCheck >= startDate && dateToCheck <= endDate;
  }


  // Enhanced filtering logic using useMemo for performance
  const filterTrainings = (data, {selectedCategories, selectedLocations, selectedPeriods, timePeriodOptions }) => {
    if (!data || data.length === 0) return [];

    return data.filter(training => {
      // Filter by categories
      // if (selectedCategories.length > 0) {
      //   const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
      //   const categoryMatch = selectedCategories.some(categoryId =>
      //     trainingCategoryIds.includes(categoryId)
      //   );
      //   if (!categoryMatch) return false;
      // }

      // Filter by locations
      if (selectedLocations.length > 0) {
        const locationMatch = selectedLocations.some(locationId =>
          training.locationId === locationId
        );
        if (!locationMatch) return false;
      }

      // Filter by periods
      // if (selectedPeriods.length > 0) {
      //   const trainingDate = new Date(training.fromDate || training.toDate);
      //   const periodMatch = selectedPeriods.some(periodValue => {
      //     // Find the matching period option
      //     const periodOption = timePeriodOptions.find(option => option.value === periodValue);
      //     const finanacialValue = financialYear.find(option => option.id === financialYearId);
      //     const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || null;
      //     const result = isDateInRange(trainingDate, periodOption.label, start, finanacialValue.financial_year_value);
      //     return result;
      //   });
      //   if (!periodMatch) return false;
      // }

      return true;
    });
  };

  const filterArgs = {
    selectedCategories,
    selectedLocations,
    selectedPeriods,
    timePeriodOptions,
  };

  const filteredTrainingData = useMemo(
    () => filterTrainings(trainingData, filterArgs),
    [trainingData, filterArgs]
  );

  const filteredPreviousTrainingData = useMemo(
    () => filterTrainings(previousTrainingData, filterArgs),
    [previousTrainingData, filterArgs]
  );

  // Use custom hooks with filtered data
  const processedData = useProcessedTrainingData(filteredTrainingData, selectedCategories, selectedLocations);
  const processedTraineeData = useProcessedEmployeeData(traineeList);

  const complianceData = useTrainingComplianceData(filteredTrainingData, traineeList);


  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const financialYearResult = await getFinancialYear();
        if (financialYearResult) {
          setFinancialYear(financialYearResult.data);
          setFinancialYearId(financialYearResult.currentId);

          // Fetch other data
          const [categories, principles, locations] = await Promise.all([
            getTrainingCategories(),
            getTrainingPrinciples(),
            getSource()
          ]);

          setTrainingCategories(categories);
          setTrainingPrinciples(principles);
          setLocations(locations);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load training data when financial year changes
  useEffect(() => {
    if (financialYearId) {
      const loadTrainingData = async () => {
        try {
          setLoading(true);
          const currentFYIndex = financialYear.findIndex(item => item.id === financialYearId);
          const previousFY = currentFYIndex > 0 ? financialYear[currentFYIndex - 1] : null;

          setFinancialYearValue(financialYear[currentFYIndex]?.financial_year_value);
          setPreviousFinancialYearId(previousFY?.id);
          setPreviousFinancialYearValue(previousFY?.financial_year_value);

          const [trainingResult, trainees, frequencyData, previousTrainingResult, previousTrainees] = await Promise.all([
            getTrainingData(financialYearId, financialYear),
            getAllRegisteredTrainee(financialYearId, financialYear),
            fetchFrequency(financialYearId),
            getTrainingData(previousFY?.id, financialYear),
            getAllRegisteredTrainee(previousFY?.id, financialYear),
          ]);

          setTraineeList(trainees);
          setTrainingData(trainingResult);
          setFrequency(frequencyData);
          setPreviousTrainingData(previousTrainingResult);
          setPreviousTraineeList(previousTrainees);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadTrainingData();
    }
  }, [financialYearId]);

  // Generate time period options  
  useEffect(() => {
    if (frequency) {
      const start = getStartingMonth();
      const options = generateTimePeriodOptions(frequency, start);
      setTimePeriodOptions(options);
    }
  }, [frequency]);

  // Prepare filter options
  const categoryOptions = trainingCategories.map(cat => ({
    value: cat.id || cat?.title?.toLowerCase(),
    label: cat.title
  }));

  const principleOptions = trainingPrinciples.map(principle => ({
    value: principle.id,
    label: principle.title
  }));

  const locationOptions = locations.map(loc => ({
    value: loc.id,
    label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
  }));

  const periodOptions = (timePeriodOptions || []).map(period => ({
    value: period.value,
    label: period.label
  }));

  // Event handlers
  const handleFinancialYearChange = (e) => {
    setFinancialYearId(parseInt(e.target.value));
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPeriods([]);
    setSelectedLocations([]);
  };

  // Loading and error handling
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading training data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #fecaca"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#fef2f2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <span style={{ fontSize: "24px", color: "#ef4444" }}>⚠️</span>
          </div>
          <div style={{ fontSize: "18px", color: "#EF4444", marginBottom: "8px" }}>Error Loading Data</div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      padding: "32px"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>

        <FilterSection
          financialYear={financialYear}
          financialYearId={financialYearId}
          onFinancialYearChange={handleFinancialYearChange}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categoryOptions={categoryOptions}
          selectedPeriods={selectedPeriods}
          setSelectedPeriods={setSelectedPeriods}
          periodOptions={periodOptions}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          locationOptions={locationOptions}
          onClearFilters={handleClearFilters}
          activeTab={activeTab}
          visualizationType={visualizationType}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "40px",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
              cursor: "pointer",
            }}
            onClick={() => setVisualizationType("analysis")}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #3f88a5",
                backgroundColor:
                  visualizationType === "analysis" ? "#3f88a5" : "transparent",
                marginRight: "8px",
              }}
            />
            <span>Analysis</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setVisualizationType("graph")}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #3f88a5",
                backgroundColor:
                  visualizationType === "graph" ? "#3f88a5" : "transparent",
                marginRight: "8px",
              }}
            />
            <span>Graph</span>
          </div>
        </div>
        {visualizationType === 'analysis' ? <> <div style={{ marginBottom: "32px" }}>
          <StatsCards data={processedData.stats} />
        </div>

         <div style={{ marginBottom: "32px" }}>
          <EmployeesStatsCards data={processedTraineeData} />
        </div>

          <div style={{ marginBottom: "32px" }}>
            <PrincipleComplianceMatrix mockData={complianceData} />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <PrincipleCoverageAnalysis complianceData={complianceData} />
          </div>

          <DetailedTrainingCoverageBreakdown
            trainingData={filteredTrainingData}
            traineeList={traineeList}
            financialYear={financialYear}
            financialYearId={financialYearId}
          />

          <HumanRightsTrainingCoverageDetails
            trainingData={filteredTrainingData}
            previousTrainingData={filteredPreviousTrainingData}
            traineeList={traineeList}
            previousTraineeList={previousTraineeList}
            currentFYLabel={financialYearValue}
            previousFYLabel={previousFinancialYearValue}
          />

          <TrainingCoverageSummary
            trainingData={filteredTrainingData}
            traineeList={traineeList}
            financialYear={financialYear}
            financialYearId={financialYearId}
          />
        </>
          :
          <>   
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <TrainingCoverageCharts 
              trainingData={trainingData}
              traineeList={traineeList}
              categoryOptions={categoryOptions}
              principleOptions={principleOptions}
            />
          </div>
          
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <LocationWiseGraph source={filteredTrainingData} locations={locations} />
          </div>

            <div style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb"
            }}>
              <GenderChart sourceData={filteredTrainingData} locations={locations} />
            </div>

            <div style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb"
            }}>
              <YearlyTrainingGraph trainingData={filteredTrainingData} trainingDataForPreviousYear={previousTrainingData} traineeList={traineeList} financialYear={financialYear} />
            </div>

            <div style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb"
            }}>
              <HumanRightsGraph trainingData={filteredTrainingData} trainingDataForPreviousYear={previousTrainingData} traineeList={traineeList} financialYear={financialYear} />
            </div> </>}


      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TrainingDashboard;