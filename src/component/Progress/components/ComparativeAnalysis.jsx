import { useState, useEffect } from "react";
import FilterSectionForComparativeAnalysis from "./FilterSectionForComparativeAnalysis";
import LocationPerformanceComparisonChart from "./LocationPerformanceComparisonChart";
import YearOverYearComparisonChart from "./YearOverYearComparisonChart";
import KPIComparisonComponents from "./KPIComparisonComponents";
import CompactFrameworkPerformanceGrid from "./CompactFrameworkPerformanceGrid";
import { Col, Row } from "react-bootstrap";
import { getReportingAnswer } from "../../Training/training-dashboard/services/trainingService";
import { getStartingMonth } from "../../CarbonFootPrinting/utils/PeriodCalculationUtils";

const ComparativeAnalysis = ({
  financialYear,
  frameworkOptions,
  locations,
  reportingQuestions,
  reportingAnswers,
  allUsers,
  periodOptions,
  locationOptions,
  frequency
}) => {
  const [selectedFinancialYears, setSelectedFinancialYears] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedPrimaryLocation, setSelectedPrimaryLocation] = useState('');
  const [selectedCompareLocation, setSelectedCompareLocation] = useState('');

  // New state for storing API data for each financial year
  const [financialYearData, setFinancialYearData] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!selectedPrimaryLocation && locations?.length > 0) {
      setSelectedPrimaryLocation(locations[0].id);
    }
  }, [selectedPrimaryLocation, locations]);

  useEffect(() => {
    if (!selectedCompareLocation && locations?.length > 0) {
      setSelectedCompareLocation(locations[0].id);
    }
  }, [selectedCompareLocation, locations]);

  // State for comparative data
  const [comparativeData, setComparativeData] = useState({
    locationComparison: null,
    yearOverYear: null,
    kpiComparison: null,
    frameworkGrid: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const financialYearOptions = financialYear.map(year => ({
    value: year.id,
    label: year.financial_year_value || year.name || `Year ${year.id}`
  }));

  useEffect(() => {
    const fetchFinancialYearData = async () => {
      if (selectedFinancialYears.length === 0) {
        setFinancialYearData({});
        return;
      }

      try {
        setDataLoading(true);
        const yearDataPromises = selectedFinancialYears.map(async (yearId) => {
          if (!financialYearData[yearId]) {
            const data = await getReportingAnswer(yearId);
            return { yearId, data };
          }
          return { yearId, data: financialYearData[yearId] };
        });

        const results = await Promise.all(yearDataPromises);
        const newYearData = { ...financialYearData };

        results.forEach(({ yearId, data }) => {
          newYearData[yearId] = data || [];
        });

        setFinancialYearData(newYearData);
      } catch (err) {
        console.error('Error fetching financial year data:', err);
        setError('Failed to fetch financial year data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchFinancialYearData();
  }, [selectedFinancialYears]);

  const handleClearFilters = () => {
    setSelectedFinancialYears([]);
    setSelectedFrameworks([]);
    setSelectedPrimaryLocation('');
    setSelectedCompareLocation('');
    setFinancialYearData({});
  };

  useEffect(() => {
    const initializeComparativeData = async () => {
      try {
        setLoading(true);

        if (selectedFrameworks.length === 0 || !selectedPrimaryLocation || !selectedCompareLocation) {
          setComparativeData({
            locationComparison: null,
            yearOverYear: null,
            kpiComparison: null,
            frameworkGrid: null
          });
          return;
        }

        if (dataLoading) {
          return;
        }

        const prepareLocationComparisonData = () => {
          const primaryLocationData = [];
          const compareLocationData = [];
          const frameworkNames = [];

          selectedFrameworks.forEach(frameworkId => {
            const frameworkName = frameworkOptions.find(f => f.value === frameworkId)?.label || `Framework ${frameworkId}`;
            frameworkNames.push(frameworkName.replace(/\s*\([^)]*\)/g, ''));

            const frameworkQuestions = reportingQuestions.filter(q => {
              try {
                const frameworkIds = JSON.parse(q.mapFrameworkIds || '[]');
                return frameworkIds.includes(frameworkId);
              } catch (e) {
                console.warn('Invalid framework IDs:', q.mapFrameworkIds);
                return false;
              }
            });

            if (frameworkQuestions.length === 0) {
              primaryLocationData.push(0);
              compareLocationData.push(0);
              return;
            }

            const allAnswersForPrimaryLocation = getAllAnswersForLocation(selectedPrimaryLocation);
            const allAnswersForSecondaryLocation = getAllAnswersForLocation(selectedCompareLocation);

            const primaryCompleted = calculateFrameworkLocationPerformance(frameworkQuestions, allAnswersForPrimaryLocation);
            const compareCompleted = calculateFrameworkLocationPerformance(frameworkQuestions, allAnswersForSecondaryLocation);

            primaryLocationData.push(primaryCompleted);
            compareLocationData.push(compareCompleted);
          });

          const primaryLocationObj = locations.find(l => l.id === selectedPrimaryLocation);
          const compareLocationObj = locations.find(l => l.id === selectedCompareLocation);

          const primaryLocationName = getLocationDisplayName(primaryLocationObj);
          const compareLocationName = getLocationDisplayName(compareLocationObj);

          return {
            series: [
              {
                name: primaryLocationName,
                data: primaryLocationData
              },
              {
                name: compareLocationName,
                data: compareLocationData
              }
            ],
            categories: frameworkNames,
            primaryLocationName,
            compareLocationName
          };
        };

        const prepareYearOverYearData = () => {
          if (selectedFinancialYears.length === 0) {
            return { series: [], categories: [] };
          }

          const yearSeries = [];

          const lastYearId = selectedFinancialYears[selectedFinancialYears.length - 1];
          const selectedPeriodsValue = calculateRange(lastYearId);
          const quarters = selectedPeriodsValue.map(item => item.showLevel);



          selectedFinancialYears.forEach(yearId => {
            const year = financialYear.find(y => y.id === yearId);
            const yearLabel = year?.financial_year_value || `Year ${yearId}`;
            const yearAnswers = financialYearData[yearId] || [];
            const corrQdata = calculateRange(year.id);


            const yearData = corrQdata.map(quarter => {
              return calculateQuarterlyCompletion(yearAnswers, quarter, yearId);
            });

            yearSeries.push({
              name: yearLabel,
              data: yearData
            });
          });

          return {
            series: yearSeries,
            categories: quarters
          };
        };

        const prepareKPIComparison = () => {
          const primaryKPIs = calculateLocationKPIs(selectedPrimaryLocation);
          const compareKPIs = calculateLocationKPIs(selectedCompareLocation);

          const currentYearKPIs = selectedFinancialYears.length > 0 ?
            calculateYearKPIs(selectedFinancialYears[selectedFinancialYears.length - 1]) : null;
          const previousYearKPIs = selectedFinancialYears.length > 1 ?
            calculateYearKPIs(selectedFinancialYears[selectedFinancialYears.length - 2]) : null;

          const primaryLocationObj = locations.find(l => l.id === selectedPrimaryLocation);
          const compareLocationObj = locations.find(l => l.id === selectedCompareLocation);

          const primaryLocationName = getLocationDisplayName(primaryLocationObj);
          const compareLocationName = getLocationDisplayName(compareLocationObj);

          return {
            locationComparison: {
              primary: {
                name: primaryLocationName,
                overallCompletion: primaryKPIs.overallCompletion,
                submissionTimeliness: primaryKPIs.submissionTimeliness,
                changeFromBaseline: 4
              },
              compare: {
                name: compareLocationName,
                overallCompletion: compareKPIs.overallCompletion,
                submissionTimeliness: compareKPIs.submissionTimeliness,
                changeFromBaseline: 4
              }
            },
            yearComparison: currentYearKPIs && previousYearKPIs ? {
              current: {
                year: financialYear.find(y => y.id === selectedFinancialYears[selectedFinancialYears.length - 1])?.financial_year_value || 'Current Year',
                reviewEfficiency: currentYearKPIs.reviewEfficiency
              },
              previous: {
                year: financialYear.find(y => y.id === selectedFinancialYears[selectedFinancialYears.length - 2])?.financial_year_value || 'Previous Year',
                reviewEfficiency: previousYearKPIs.reviewEfficiency
              }
            } : null
          };
        };

        const prepareFrameworkPerformanceGridData = () => {
          if (selectedFrameworks.length === 0 || !selectedPrimaryLocation || !selectedCompareLocation) {
            return {
              frameworks: [],
              locations: [],
              performanceData: {},
              changeData: {}
            };
          }

          const frameworks = selectedFrameworks.map(fId => ({
            id: fId,
            name: frameworkOptions.find(f => f.value === fId)?.label || `Framework ${fId}`,
            shortName: getFrameworkShortName(fId, frameworkOptions)
          }));

          const primaryLocationObj = locations.find(l => l.id === selectedPrimaryLocation);
          const compareLocationObj = locations.find(l => l.id === selectedCompareLocation);

          const locationsData = [
            {
              id: selectedPrimaryLocation,
              name: getLocationDisplayName(primaryLocationObj)
            },
            {
              id: selectedCompareLocation,
              name: getLocationDisplayName(compareLocationObj)
            }
          ];

          const performanceData = {};
          const changeData = {};

          frameworks.forEach(framework => {
            performanceData[framework.id] = {};
            changeData[framework.id] = {};

            locationsData.forEach(location => {
              const frameworkQuestions = reportingQuestions.filter(q => {
                try {
                  const frameworkIds = JSON.parse(q.mapFrameworkIds || '[]');
                  return frameworkIds.includes(framework.id);
                } catch (e) {
                  console.warn('Invalid framework IDs:', q.mapFrameworkIds);
                  return false;
                }
              });

              if (frameworkQuestions.length === 0) {
                performanceData[framework.id][location.id] = 0;
                changeData[framework.id][location.id] = 0;
                return;
              }

              const currentPerformance = calculateFrameworkLocationPerformance(
                frameworkQuestions,
                getAllAnswersForLocation(location.id)
              );

              performanceData[framework.id][location.id] = currentPerformance;

              const changePercentage = calculateHistoricalChange(framework.id, location.id);
              changeData[framework.id][location.id] = changePercentage;
            });
          });

          return {
            frameworks,
            locations: locationsData,
            performanceData,
            changeData
          };
        };

        const getAllAnswersForLocation = (locationId) => {
          let allAnswers = []; // Current year answers

          selectedFinancialYears.forEach(yearId => {
            if (financialYearData[yearId]) {
              allAnswers = [...allAnswers, ...financialYearData[yearId]];
            }
          });

          return allAnswers.filter(answer =>
            Number(answer.sourceId) === Number(locationId)
          );
        };

        // Helper function to get location display name
        const getLocationDisplayName = (locationObj) => {
          if (!locationObj) return "Unknown Location";

          return locationObj.unitCode ||
            `${locationObj.location?.area || ""}, ${locationObj.location?.city || ""}`.trim() ||
            "Unknown Location";
        };

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


        const calculateDateRange = (type, period, startingMonth, year) => {
          const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
          const startYear =
            year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
          const endMonth = ((startMonth - 1 + type) % 12) + 1;
          const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

          const formatDate = (month, year) =>
            `${year}-${month < 10 ? `0${month}` : month}`;
          const showLevel = periodOptions.find(q => q.value == period)?.label;
          return {
            fromDate: formatDate(startMonth, startYear),
            toDate: formatDate(endMonth, endYear),
            showLevel: showLevel
          };
        };

        const getFinancialYearById = (id) => {
          const result = financialYear.find(item => item.id == id);
          return result ? result.financial_year_value : null;
        }

        const calculateRange = (financialYearId) => {

          const selectedYear = getFinancialYearById(financialYearId);
          const year = parseInt(selectedYear.split("-")[0]);
          const start = getStartingMonth();

          const dateRanges = periodOptions.map(item => item.value).map(item => {
            let dateRange;
            const period = Number(item)

            if (frequency === "HALF_YEARLY") {
              dateRange = calculateDateRange(6, period, start, year);
            } else if (frequency === "QUARTERLY") {
              dateRange = calculateDateRange(3, period, start, year);
            } else if (frequency === "MONTHLY") {
              const startIndex = start - 1;
              const firstMonthAbsoluteIndex = start + period - 2;

              const firstMonthIndex =
                ((firstMonthAbsoluteIndex - startIndex + months.length) %
                  months.length) +
                1;

              dateRange = calculateDateRange(1, firstMonthIndex, start, year);
              const showLevel = periodOptions.find(q => q.value == period)?.label;

              dateRange.showLevel = showLevel
            } else if (frequency === "YEARLY") {
              dateRange = calculateDateRange(12, 1, start, year);
            }
            return dateRange;
          });
          return dateRanges;

        }

        // Helper function to calculate framework location performance
        const calculateFrameworkLocationPerformance = (frameworkQuestions, answers) => {
          if (frameworkQuestions.length === 0) return 0;
          const filteredQuestions = [];
          const totalQuestionForCompany = [];
          const uniqueQuestionSet = new Set();

          frameworkQuestions.forEach((item) => {
            const key = `${item.questionId}-${item.moduleId}-${item.frequency}`;
            if (!uniqueQuestionSet.has(key)) {
              uniqueQuestionSet.add(key);
              totalQuestionForCompany.push({
                questionId: item.questionId,
                moduleId: item.moduleId,
                frequency: item.frequency,
                frameworksIds: JSON.parse(item.mapFrameworkIds)
              });
            }
          });

          for (const q of totalQuestionForCompany) {
            let check1 = periodOptions.length;
            if (q.frequency === "CUSTOM") {
              for (let i = 0; i < check1; i++) {
                filteredQuestions.push(q);
              }
            } else {
              filteredQuestions.push(q);
            }
          }

          const customQuestionIds = filteredQuestions
            .filter(item => item.frequency === "CUSTOM")
            .map(item => item.questionId);

          const questionIdsOthers = filteredQuestions
            .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
            .map(item => item.questionId);


          const uniqueAnswersQuestionIdsForOthers = [
            ...new Set(
              answers
                .filter(item => questionIdsOthers.includes(item.questionId) && item.status === 'ACCEPTED')
                .map(item => item.questionId)
            )
          ];

          // const fromDates = periodOptions.map(p => p.fromDate);

          const answersQuestionIdsForCustum = answers
            .filter(item =>
              customQuestionIds.includes(item.questionId) &&
              //  fromDates.includes(item.fromDate) &&
              item.status === 'ACCEPTED'
            )
            .map(item => item.questionId);



          const totalCompleted = uniqueAnswersQuestionIdsForOthers.length + answersQuestionIdsForCustum.length;
          const totalQuestions = filteredQuestions.length*selectedFinancialYears.length;

          return totalQuestions > 0
            ? ((totalCompleted / totalQuestions) * 100).toFixed(2)
            : "0.00";
        };

        const calculateQuarterlyCompletion = (yearAnswers, quarter, year) => {
          if (!yearAnswers || yearAnswers.length === 0) return 0;


          const filteredQuestions = [];
          const totalQuestionForCompany = [];
          const uniqueQuestionSet = new Set();

          reportingQuestions.forEach((item) => {
            const key = `${item.questionId}-${item.moduleId}-${item.frequency}`;
            if (!uniqueQuestionSet.has(key)) {
              uniqueQuestionSet.add(key);
              totalQuestionForCompany.push({
                questionId: item.questionId,
                moduleId: item.moduleId,
                frequency: item.frequency,
                frameworksIds: JSON.parse(item.mapFrameworkIds)
              });
            }
          });

          for (const q of totalQuestionForCompany) {
            let check1 = locationOptions.length;
            if (q.frequency === "CUSTOM") {
              for (let i = 0; i < check1; i++) {
                filteredQuestions.push(q);
              }
            } else {
              filteredQuestions.push(q);
            }
          }

          const customQuestionIds = filteredQuestions
            .filter(item => item.frequency === "CUSTOM")
            .map(item => item.questionId);

          const questionIdsOthers = filteredQuestions
            .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
            .map(item => item.questionId);


          const uniqueAnswersQuestionIdsForOthers = [
            ...new Set(
              reportingAnswers
                .filter(item => questionIdsOthers.includes(item.questionId) && item.status === 'ACCEPTED')
                .map(item => item.questionId)
            )
          ];

          const answersQuestionIdsForCustum = reportingAnswers
            .filter(item =>
              customQuestionIds.includes(item.questionId) &&
              quarter.fromDate === item.fromDate &&
              item.status === 'ACCEPTED'
            )
            .map(item => item.questionId);

          const totalCompleted = uniqueAnswersQuestionIdsForOthers.length + answersQuestionIdsForCustum.length;
          const totalQuestions = filteredQuestions.length;

          return totalQuestions > 0
            ? ((totalCompleted / totalQuestions) * 100).toFixed(2)
            : "0.00";


        };

        const calculateLocationKPIs = (locationId) => {
          const allAnswers = getAllAnswersForLocation(locationId);
          if (allAnswers.length === 0) {
            return {
              overallCompletion: 0,
              submissionTimeliness: 0,
              changeFromBaseline: 0
            };
          }

          const relevantQuestions = reportingQuestions.filter(q => {
            try {
              const frameworkIds = JSON.parse(q.mapFrameworkIds || '[]');
              return frameworkIds.some(fid => selectedFrameworks.includes(fid));
            } catch (e) {
              return false;
            }
          });

          const overallCompletion = calculateFrameworkLocationPerformance(
            relevantQuestions,
            allAnswers
          );

          const timeliness = calculateSubmissionTimeliness(allAnswers);

          const changeFromBaseline = calculateChangeFromBaseline(locationId, allAnswers);

          return {
            overallCompletion,
            submissionTimeliness: timeliness,
            changeFromBaseline
          };
        };

        const calculateYearKPIs = (yearId) => {
          const yearAnswers = financialYearData[yearId] || [];

          if (yearAnswers.length === 0) {
            return { reviewEfficiency: 0 };
          }

          // Calculate review efficiency based on actual data
          const reviewEfficiency = calculateReviewEfficiency(yearAnswers);

          return {
            reviewEfficiency: Number(reviewEfficiency.toFixed(1))
          };
        };

        // Helper function to calculate submission timeliness
        const calculateSubmissionTimeliness = (answers) => {
          if (answers.length === 0) return 0;

          const timelySusmissions = answers.filter(answer => {
            if (answer.submittedDate && answer.dueDate) {
              return new Date(answer.submittedDate) <= new Date(answer.dueDate);
            }
            return false;
          });

          return answers.length > 0
            ? parseFloat(((timelySusmissions.length / answers.length) * 100).toFixed(2))
            : 0;

        };

        // Helper function to calculate change from baseline
        const calculateChangeFromBaseline = (locationId, currentAnswers) => {
          if (selectedFinancialYears.length < 2) return 0;

          const previousYearId = selectedFinancialYears[selectedFinancialYears.length - 2];
          const previousYearAnswers = financialYearData[previousYearId] || [];

          const previousLocationAnswers = previousYearAnswers.filter(
            answer => Number(answer.sourceId) === Number(locationId)
          );

          if (previousLocationAnswers.length === 0) return 0;

          const currentAccepted = currentAnswers.filter(a => a.status === 'ACCEPTED').length;
          const previousAccepted = previousLocationAnswers.filter(a => a.status === 'ACCEPTED').length;

          if (previousAccepted === 0) return 0;

          return Math.round(((currentAccepted - previousAccepted) / previousAccepted) * 100);
        };

        // Helper function to calculate review efficiency
        const calculateReviewEfficiency = (yearAnswers) => {
          if (yearAnswers.length === 0) return 0;

          const reviewedAnswers = yearAnswers.filter(answer =>
            answer.reviewedDate && answer.submittedDate
          );

          if (reviewedAnswers.length === 0) return 0;

          const totalReviewTime = reviewedAnswers.reduce((total, answer) => {
            const reviewTime = new Date(answer.reviewedDate) - new Date(answer.submittedDate);
            return total + (reviewTime / (1000 * 60 * 60 * 24)); // Convert to days
          }, 0);

          return 4;
        };

        // Helper function to calculate historical change
        const calculateHistoricalChange = (frameworkId, locationId) => {
          if (selectedFinancialYears.length < 2) return 0;

          const currentYearId = selectedFinancialYears[selectedFinancialYears.length - 1];
          const previousYearId = selectedFinancialYears[selectedFinancialYears.length - 2];

          const currentAnswers = financialYearData[currentYearId] || [];
          const previousAnswers = financialYearData[previousYearId] || [];

          const frameworkQuestions = reportingQuestions.filter(q => {
            try {
              const frameworkIds = JSON.parse(q.mapFrameworkIds || '[]');
              return frameworkIds.includes(frameworkId);
            } catch (e) {
              return false;
            }
          }).map(q => q.questionId);

          const currentPerformance = calculatePerformanceForQuestions(
            frameworkQuestions,
            locationId,
            currentAnswers
          );

          const previousPerformance = calculatePerformanceForQuestions(
            frameworkQuestions,
            locationId,
            previousAnswers
          );

          return previousPerformance > 0
            ? parseFloat((((currentPerformance - previousPerformance) / previousPerformance) * 100).toFixed(2))
            : 0;

        };

        // Helper function to calculate performance for specific questions
        const calculatePerformanceForQuestions = (questionIds, locationId, answers) => {
          const locationAnswers = answers.filter(
            answer => Number(answer.sourceId) === Number(locationId) &&
              questionIds.includes(answer.questionId)
          );

          const acceptedAnswers = locationAnswers.filter(answer => answer.status === 'ACCEPTED');

          return questionIds.length > 0
            ? parseFloat(((acceptedAnswers.length / questionIds.length) * 100).toFixed(2))
            : 0;

        };

        // Helper function to get framework short name
        const getFrameworkShortName = (frameworkId, frameworkOptions) => {
          const framework = frameworkOptions.find(f => f.value === frameworkId);
          if (!framework) return `F${frameworkId}`;

          const label = framework.label;

          if (label.includes('BRSR')) return 'BRSR';
          if (label.includes('GRI')) return 'GRI';
          if (label.includes('CDP')) return 'CDP';
          if (label.includes('SASB')) return 'SASB';
          if (label.includes('TCFD')) return 'TCFD';
          if (label.includes('UN Global Compact')) return 'UNGC';

          const abbrevMatch = label.match(/\(([^)]+)\)/);
          if (abbrevMatch) return abbrevMatch[1];

          return label.split(' ')[0];
        };

        // Generate all comparative data
        const locationComparisonData = prepareLocationComparisonData();
        const yearOverYearData = prepareYearOverYearData();
        const kpiComparisonData = prepareKPIComparison();
        const frameworkGridData = prepareFrameworkPerformanceGridData();

        setComparativeData({
          locationComparison: locationComparisonData,
          yearOverYear: yearOverYearData,
          kpiComparison: kpiComparisonData,
          frameworkGrid: frameworkGridData
        });

      } catch (err) {
        setError(err.message);
        console.error('Error in comparative analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeComparativeData();
  }, [selectedFinancialYears, selectedFrameworks, selectedPrimaryLocation, selectedCompareLocation,
    reportingQuestions, reportingAnswers, allUsers, financialYearData, dataLoading]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4">
      {/* Filter Section */}
      <FilterSectionForComparativeAnalysis
        financialYearOptions={financialYearOptions}
        selectedFinancialYears={selectedFinancialYears}
        setSelectedFinancialYears={setSelectedFinancialYears}

        frameworkOptions={frameworkOptions}
        selectedFrameworks={selectedFrameworks}
        setSelectedFrameworks={setSelectedFrameworks}

        primaryLocationOptions={locations}
        selectedPrimaryLocation={selectedPrimaryLocation}
        setSelectedPrimaryLocation={setSelectedPrimaryLocation}

        compareLocationOptions={locations}
        selectedCompareLocation={selectedCompareLocation}
        setSelectedCompareLocation={setSelectedCompareLocation}

        onClearFilters={handleClearFilters}
        activeTab="esg"
      />

      {/* Loading State for Data Fetching */}
      {dataLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">

            <span className="text-blue-800 font-medium">Loading financial year data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">

            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <Row>
          <Col md={6}>
            <LocationPerformanceComparisonChart
              chartData={comparativeData.locationComparison}
              loading={loading || dataLoading}
            />
          </Col>
          <Col md={6}>
            <YearOverYearComparisonChart
              chartData={comparativeData.yearOverYear}
              loading={loading || dataLoading}
            />
          </Col>
        </Row>

        <KPIComparisonComponents
          kpiData={comparativeData.kpiComparison}
          loading={loading || dataLoading}
        />

        {selectedFrameworks.length > 0 && selectedPrimaryLocation && selectedCompareLocation && (
          <CompactFrameworkPerformanceGrid
            key={`${selectedPrimaryLocation}-${selectedCompareLocation}-${selectedFrameworks.join(',')}`}
            gridData={comparativeData.frameworkGrid}
            loading={loading || dataLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ComparativeAnalysis;