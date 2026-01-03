import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { CheckCircle, Clock, AlertTriangle, Calendar, FileText, MessageCircle } from 'lucide-react';
import FilterSection from './FilterSection';
import { generateTimePeriodOptions, getStartingMonth } from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import { fetchFramework, fetchFrequency, getAllUsers, getFinancialYear, getReportingAnswer, getReportingModules, getReportingQuestions, getSource, getSummaryData } from '../Training/training-dashboard/services/trainingService';
import FrameworkProgressCards from './components/FrameworkProgressCards';
import { prepareCoverageByModuleData, prepareFrameworkLocationChartData, prepareFrameworkPeriodChartData, prepareProgressTrendsByLocationData, prepareProgressTrendsByPeriodsData } from './utils/progressUtills';
import ProgressTrendsChart from './components/ProgressTrendsChart';
import FrameworkCompletionChart from './components/FrameworkCompletionChart';
import CoverageByModuleChart from './components/CoverageByModuleChart';
import { apiCall } from '../../_services/apiCall';
import config from "../../../src/config/config.json";
import AuditorWorkload from './components/AuditorWorkload';
import DataOwnerWorkLoad from './components/DataownerWorkload';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import TeamWorkLoad from '../TeamWorkLoad/TeamWorkLoad';
import DataProcessing from '../TeamWorkLoad/DataProcessing';
import AIDashboard from '../AIDashboard/AIDashboard/AIDashboard';
import UsersActivity from "../RecentActivity/UserActivity";
import RecentActivity from "../RecentActivity/recentactivity";

const KeyMetrics = ({ metrics }) => {
  const metricCards = [
    { title: 'Total Data Points', value: metrics.totalDataPoints, bgColor: '#0d6efd' },
    { title: 'Overall Completion', value: `${metrics.overallCompletion}%`, bgColor: '#198754' },
    { title: 'Active Contributors', value: metrics.activeContributors, bgColor: '#0dcaf0' },
    { title: 'Pending Reviews', value: metrics.pendingReviews, bgColor: '#ffc107', textColor: '#000' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '16px',
      }}
    >
      {metricCards.map((metric, index) => (
        <div
          key={index}
          style={{
            backgroundColor: metric.bgColor,
            color: metric.textColor || '#fff',
            padding: '20px',
            borderRadius: '10px',
            flex: '1',
            minWidth: '200px',
            maxWidth: 'calc(25% - 12px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
            {metric.value}
          </div>
          <div style={{ fontSize: '0.9rem' }}>{metric.title}</div>
        </div>
      ))}
    </div>
  );
};

const WeeklyActivitySummary = ({ activities }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'completed':
        return { icon: CheckCircle, color: '#198754' };
      case 'progress':
        return { icon: Clock, color: '#0d6efd' };
      case 'overdue':
        return { icon: AlertTriangle, color: '#dc3545' };
      case 'upcoming':
        return { icon: Calendar, color: '#0dcaf0' };
      default:
        return { icon: FileText, color: '#6c757d' };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
        justifyContent: 'space-between',
      }}
    >
      {activities.map((activity, index) => {
        const { icon: Icon, color } = getIconAndColor(activity.type);
        return (
          <div
            key={index}
            style={{
              flex: '1 1 calc(25% - 12px)',
              minWidth: '220px',
              backgroundColor: '#fff',
              border: '1px solid #dee2e6',
              borderLeft: `5px solid ${color}`,
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon style={{ height: '32px', width: '32px', color, marginRight: '16px' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#212529' }}>
                  {activity.count}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  {activity.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{activity.timeframe}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ESGProgressDashboard = () => {
  const [financialYearId, setFinancialYearId] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedPeriodsValue, setSelectedPeriodsValue] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [frameworkOptions, setframeworkOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [reportingQuestions, setReportingQuestions] = useState([]);
  const [reportingAssignDetails, setReportingAssignDetails] = useState([]);
  const [reportingAnswers, setReportingAnswer] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [teamWorksloadData, setTeamWorksloadData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [frequency, setFrequency] = useState('monthly');
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const [usersActivities, setUsersActivities] = useState([]);
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalDataPoints: 1247,
      overallCompletion: 78,
      activeContributors: 24,
      pendingReviews: 156
    },
    weeklyActivities: [
    ],
    frameworks: [
    ],
  });

  useEffect(() => {
    if (frequency) {
      const start = getStartingMonth();
      const options = generateTimePeriodOptions(frequency, start);
      setTimePeriodOptions(options);
    }
  }, [frequency]);

  const locationOptions = useMemo(() => 
    locations.map(loc => ({
      value: loc.id,
      label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
    })),
    [locations]
  );

  const periodOptions = useMemo(() => 
    (timePeriodOptions || []).map(period => ({
      value: period.value,
      label: period.label
    })),
    [timePeriodOptions]
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const financialYearResult = await getFinancialYear();
        if (financialYearResult) {
          setFinancialYear(financialYearResult.data);
          setFinancialYearId(financialYearResult.currentId);

          const [locations, frequencyData, frameworkOptions, moduleOptions, reportingQuestion, reportingAnswer, allUsers] = await Promise.all([
            getSource(),
            fetchFrequency(financialYearResult.currentId),
            fetchFramework(),
            getReportingModules(financialYearResult.currentId),
            getReportingQuestions(financialYearResult.currentId),
            getReportingAnswer(financialYearResult.currentId),
            getAllUsers(),
          ]);
          const options = (frameworkOptions || []).map(item => ({
            value: item.id,
            label: item?.display_name || item?.title
          }));
          setframeworkOptions(options);
          setLocations(locations);
          setFrequency(frequencyData);
          setModuleOptions(moduleOptions);
          setReportingQuestions(reportingQuestion.data);
          setReportingAssignDetails(reportingQuestion.assignedDetail);
          setReportingAnswer(reportingAnswer);
          setAllUsers(allUsers);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        if (financialYearId) {
          const [locations, frequencyData, frameworkOptions, moduleOptions, reportingQuestion, reportingAnswer, allUsers] = await Promise.all([
            getSource(),
            fetchFrequency(financialYearId),
            fetchFramework(),
            getReportingModules(financialYearId),
            getReportingQuestions(financialYearId),
            getReportingAnswer(financialYearId),
            getAllUsers(),
          ]);
          const options = (frameworkOptions || []).map(item => ({
            value: item.id,
            label: item?.display_name || item?.title
          }));
          setframeworkOptions(options);
          setLocations(locations);
          setFrequency(frequencyData);
          setModuleOptions(moduleOptions);
          setReportingQuestions(reportingQuestion.data);
          setReportingAssignDetails(reportingQuestion.assignedDetail);
          setReportingAnswer(reportingAnswer);
          setAllUsers(allUsers);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [financialYearId]);

  const fetchTodaysActivities = useCallback(async () => {
    const locationIds = locationOptions
      .filter(item => item.value !== undefined)
      .map(item => item.value);
    
    if (locationIds.length) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}todaysActivity`,
        {},
        {locationIds},
        "GET"
      );
      if (isSuccess) {
        setTodaysActivities((data?.data).reverse());
      }
    }
  }, [locationOptions]); 

  useEffect(() => {
    if (locationOptions.length) {
      fetchTodaysActivities();
    }
  }, [locationOptions, fetchTodaysActivities]);

  const fetchUsersActivities = useCallback(async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}usersActivity`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setUsersActivities((data?.data));
    }
  }, []);

  useEffect(() => {
    fetchUsersActivities();
  }, [fetchUsersActivities]); 

  const lastParamsRef = useRef(null);

  const teamWorkloadProgess = async (periods, financialYearId, frameworkIds, locationIdsIds, moduleIds) => {
    const currentParams = JSON.stringify({
      periods,
      financialYearId,
      frameworkIds,
      locationIdsIds,
      multiplier: periodOptions.length,
      moduleIds
    });

    if (lastParamsRef.current === currentParams) {
      return;
    }

    lastParamsRef.current = currentParams;
    const finalArr = moduleIds.every(v => v === null || v === undefined || v === "") ? [] : moduleIds;


    if (periods.length && financialYearId && frameworkIds.length && locationIdsIds.length && finalArr.length) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}teamWorkloadProgess`,
        {},
        {
          financialYearId,
          frameworkIds,
          locationIdsIds,
          periods,
          multiplier: periodOptions.length,
          moduleIds
        },
        "GET"
      );

      if (isSuccess) {
        setTeamWorksloadData(data?.data?.teamWorkloadResults);
      }
    }
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
    const showLevel = periodOptions.find(q => q.value === period)?.label;
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


  const styles = {
    floatingButton: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3f88a5 0%, #3f88a5 100%)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 999
    }
  };



  useEffect(() => {
    if (!financialYearId || !selectedPeriods?.length) return;
    const selectedYear = getFinancialYearById(financialYearId);
    const year = parseInt(selectedYear.split("-")[0]);
    const start = getStartingMonth();

    const dateRanges = selectedPeriods.map(period => {
      let dateRange;

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
        const showLevel = periodOptions.find(q => q.value === period)?.label;

        dateRange.showLevel = showLevel
      } else if (frequency === "YEARLY") {
        dateRange = calculateDateRange(12, 1, start, year);
      }
      return dateRange;
    });

    setSelectedPeriodsValue(dateRanges);

  }, [selectedPeriods, financialYearId, frequency]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const uniqueQuestionSet = new Set();
        const totalQuestionForCompany = [];

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

        const userResult = allUsers.map(user => {
          let sourceId = [];
          try {
            if (user.source_ids) {
              sourceId = JSON.parse(user.source_ids);
            }
          } catch (e) {
            console.warn(`Invalid source_ids for user ID ${user.id}: ${user.source_ids}`);
          }

          return {
            id: user.id,
            sourceId
          };
        });

        const filteredUsers = selectedLocations.length === 0
          ? userResult.map(item => item.id)
          : userResult.filter(user =>
            user.sourceId.some(sid => selectedLocations.includes(sid))
          ).map(item => item.id);

        const filteredQuestions = [];

        for (const q of totalQuestionForCompany) {
          const isModuleMatched = selectedModules.length === 0 || selectedModules.includes(q.moduleId);
          const isFrameworkMatched = selectedFrameworks.length === 0 || q.frameworksIds.some(fid => selectedFrameworks.includes(fid));

          if (isModuleMatched && isFrameworkMatched) {
            let check1 = selectedLocations.length === 0 ? locationOptions.length : selectedLocations.length;
            let check2 = selectedPeriodsValue.length === 0 ? periodOptions.length : selectedPeriodsValue.length;

            if (q.frequency === "CUSTOM") {
              for (let i = 0; i < check1 * check2; i++) {
                filteredQuestions.push(q);
              }
            } else {
              filteredQuestions.push(q);
            }
          }
        }

        const customQuestionIds = filteredQuestions
          .filter(item => item.frequency === "CUSTOM")
          .map(item => item.questionId);

        const questionIdsOthers = filteredQuestions
          .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
          .map(item => item.questionId);
        const fromDates = selectedPeriodsValue.map(p => p.fromDate);
        const uniqueAnswersQuestionIdsForOthers = [
          ...new Set(
            reportingAnswers
              .filter(item => questionIdsOthers.includes(item.questionId) && item.status === 'ACCEPTED' && selectedLocations.includes(item.sourceId))
              .map(item => item.questionId)
          )
        ];

        const answersQuestionIdsForCustum = reportingAnswers
          .filter(item =>
            customQuestionIds.includes(item.questionId) &&
            fromDates.includes(item.fromDate) &&
            item.status === 'ACCEPTED' &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId);

        const totalQuestions = filteredQuestions.length;

        const totalCompleted = uniqueAnswersQuestionIdsForOthers.length + answersQuestionIdsForCustum.length;
        const overallCompletion = totalQuestions > 0
          ? ((totalCompleted / totalQuestions) * 100).toFixed(2)
          : "0.00";

        const questionIds = filteredQuestions.map(q => q.questionId);

        const matchingAssignments = reportingAssignDetails.filter(item =>
          questionIds.includes(item.questionId)
        );

        const userIds = allUsers
          .filter(user => {
            try {
              const userSourceIds = JSON.parse(user.source_ids || "[]");
              return userSourceIds.some((id) => selectedLocations.includes(id));
            } catch {
              return false;
            }
          })
          .map(user => user.id);


        const assignedToList = [
          ...new Set(matchingAssignments.flatMap(item => item.assignedTo))
        ];

        const filtered = assignedToList.filter(id => userIds.includes(Number(id)));

        const totalActiveUsers = filtered.length;

        const uniqueAnswersedQuestionIdsForOthers = [
          ...new Set(
            reportingAnswers
              .filter(item =>
                questionIdsOthers.includes(item.questionId) &&
                (item.status === 'ACCEPTED') &&
                filteredUsers.includes(item.userId)
              )
              .map(item => item.questionId)
          )
        ];

        const answersedQuestionIdsForCustum =
          reportingAnswers
            .filter(item =>
              customQuestionIds.includes(item.questionId) &&
              fromDates.includes(item.fromDate) &&
              ['ACCEPTED'].includes(item.status) &&
              filteredUsers.includes(item.userId)
            )
            .map(item => item.questionId)


        const totalPending = totalQuestions - (uniqueAnswersedQuestionIdsForOthers.length + answersedQuestionIdsForCustum.length);

        const now = new Date();
        const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const next7Days = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

        const relevantAnswers = reportingAnswers.filter(item => {
          const isRelevantQuestion = questionIds.includes(item.questionId);
          const isRelevantUser = filteredUsers.includes(item.userId);

          if (customQuestionIds.includes(item.questionId)) {
            return isRelevantQuestion && isRelevantUser && fromDates.includes(item.fromDate);
          }

          return isRelevantQuestion && isRelevantUser;
        });

        const completedInLast7Days = relevantAnswers.filter(item => {
          if (item.status !== 'ACCEPTED' || !item.updatedAt) return false;
          const updatedDate = new Date(item.updatedAt);
          return updatedDate >= last7Days && updatedDate <= now;
        }).length;

        const inProgressLast7Days = relevantAnswers.filter(item => {
          if (item.status !== 'ANSWERED' || !item.updatedAt) return false;
          const updatedDate = new Date(item.updatedAt);
          return updatedDate >= last7Days && updatedDate <= now;
        }).length;

        const overdueItems = matchingAssignments.filter(assignment => {
          if (!assignment.dueDate) return false;

          const dueDate = new Date(assignment.dueDate);
          const isOverdue = dueDate < now;

          if (!isOverdue) return false;

          const hasAcceptedAnswer = relevantAnswers.some(answer =>
            answer.questionId === assignment.questionId &&
            answer.status === 'ACCEPTED'
          );

          return !hasAcceptedAnswer;
        }).length;

        const upcomingItems = matchingAssignments.filter(assignment => {
          if (!assignment.dueDate) return false;

          const dueDate = new Date(assignment.dueDate);
          const isUpcoming = dueDate > now && dueDate <= next7Days;

          if (!isUpcoming) return false;

          const hasAcceptedAnswer = relevantAnswers.some(answer =>
            answer.questionId === assignment.questionId &&
            answer.status === 'ACCEPTED'
          );

          return !hasAcceptedAnswer;
        }).length;

        const weeklyActivities = [
          {
            type: 'completed',
            count: completedInLast7Days,
            label: 'Completed',
            timeframe: 'In the last 7 days'
          },
          {
            type: 'progress',
            count: inProgressLast7Days,
            label: 'In Progress',
            timeframe: 'In the last 7 days'
          },
          {
            type: 'overdue',
            count: overdueItems,
            label: 'Overdue',
            timeframe: 'In the last 7 days'
          },
          {
            type: 'upcoming',
            count: upcomingItems,
            label: 'Upcoming',
            timeframe: 'In the next 7 days'
          }
        ];

        // ================== FRAMEWORK PROGRESS CALCULATION ==================
        const locationMap = locationOptions.reduce((acc, curr) => {
          acc[curr.value] = curr.label;
          return acc;
        }, {});
        const frameworkMap = frameworkOptions.reduce((acc, curr) => {
          acc[curr.value] = curr.label;
          return acc;
        }, {});

        const getLocationName = (locationId) => {
          return locationMap[locationId] || `Location ${locationId}`;
        };

        const getFrameworkName = (frameworkId) => {
          return frameworkMap[frameworkId] || `Framework ${frameworkId}`;
        };

        // UPDATED: Use all frameworks if none selected
        const frameworksToProcess = selectedFrameworks.length === 0
          ? frameworkOptions.map(f => f.value)
          : selectedFrameworks;

        const frameworkProgressData = frameworksToProcess.map(frameworkId => {
          const frameworkQuestions = filteredQuestions.filter(q =>
            q.frameworksIds.includes(frameworkId)
          );

          if (frameworkQuestions.length === 0) {
            return {
              frameworkId,
              frameworkName: getFrameworkName(frameworkId),
              overallCompletion: 0,
              totalQuestions: 0,
              completedQuestions: 0,
              locationProgress: []
            };
          }

          const customQuestionsForFramework = frameworkQuestions
            .filter(item => item.frequency === "CUSTOM")
            .map(item => item.questionId);

          const othersQuestionsForFramework = frameworkQuestions
            .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
            .map(item => item.questionId);

          const completedOthersForFramework = [
            ...new Set(
              reportingAnswers
                .filter(item =>
                  othersQuestionsForFramework.includes(item.questionId) &&
                  (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') &&
                  filteredUsers.includes(item.userId)
                )
                .map(item => item.questionId)
            )
          ];

          const completedCustomForFramework =
            reportingAnswers
              .filter(item =>
                customQuestionsForFramework.includes(item.questionId) &&
                fromDates.includes(item.fromDate) &&
                (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') &&
                filteredUsers.includes(item.userId)
              )
              .map(item => item.questionId)


          const totalFrameworkQuestions = frameworkQuestions.length;
          const totalFrameworkCompleted = completedOthersForFramework.length + completedCustomForFramework.length;
          const overallFrameworkCompletion = totalFrameworkQuestions > 0
            ? Math.round((totalFrameworkCompleted / totalFrameworkQuestions) * 100)
            : 0;

          // UPDATED: Use all locations if none selected
          const locationsToProcess = selectedLocations.length === 0
            ? locations.map(l => l.id)
            : selectedLocations;

          const locationProgress = locationsToProcess.map(locationId => {
            const locationUsers = userResult
              .filter(user => user.sourceId.includes(locationId))
              .map(user => user.id);

            if (locationUsers.length === 0) {
              return {
                locationId,
                locationName: getLocationName(locationId),
                completion: 0
              };
            }

            const completedOthersForLocation = [
              ...new Set(
                reportingAnswers
                  .filter(item =>
                    othersQuestionsForFramework.includes(item.questionId) &&
                    (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') &&
                    locationUsers.includes(item.userId)
                  )
                  .map(item => item.questionId)
              )
            ];

            const completedCustomForLocation =
              reportingAnswers
                .filter(item =>
                  customQuestionsForFramework.includes(item.questionId) &&
                  fromDates.includes(item.fromDate) &&
                  (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') &&
                  locationUsers.includes(item.userId)
                )
                .map(item => item.questionId)

            const totalLocationCompleted = completedOthersForLocation.length + completedCustomForLocation.length;
            const locationCompletion = totalFrameworkQuestions > 0
              ? Math.round((totalLocationCompleted / totalFrameworkQuestions) * 100)
              : 0;

            return {
              locationId,
              locationName: getLocationName(locationId),
              completion: locationCompletion
            };
          })
            .filter(location => location.completion >= 0)
            .sort((a, b) => b.completion - a.completion);

          return {
            frameworkId,
            frameworkName: getFrameworkName(frameworkId),
            overallCompletion: overallFrameworkCompletion,
            totalQuestions: totalFrameworkQuestions,
            completedQuestions: totalFrameworkCompleted,
            locationProgress
          };
        }).filter(framework => framework.totalQuestions > 0);

        const frameworkLocationChartData = prepareFrameworkLocationChartData(
          frameworkProgressData,
          selectedLocations.length === 0 ? locations.map(l => l.id) : selectedLocations,
          locationMap,
        );

        const uniqueAnswersedQuestionIdsForOther = [
          ...new Set(
            reportingAnswers
              .filter(item =>
                questionIdsOthers.includes(item.questionId) &&
                selectedLocations.includes(item.sourceId)
              )
          )
        ];

        const answersedQuestionIdsForCustums =
          reportingAnswers
            .filter(item =>
              customQuestionIds.includes(item.questionId) &&
              fromDates.includes(item.fromDate) &&
              selectedLocations.includes(item.sourceId)
            )

        const mergedFrameworkAnswers = [
          ...uniqueAnswersedQuestionIdsForOther,
          ...answersedQuestionIdsForCustums
        ];


        const filteredQuestionsForProgressTrends = [];

        for (const q of totalQuestionForCompany) {
          const isModuleMatched = selectedModules.length === 0 || selectedModules.includes(q.moduleId);
          const isFrameworkMatched = selectedFrameworks.length === 0 || q.frameworksIds.some(fid => selectedFrameworks.includes(fid));

          if (isModuleMatched && isFrameworkMatched) {
            let check1 = selectedLocations.length === 0 ? locationOptions.length : selectedLocations.length;

            if (q.frequency === "CUSTOM") {
              for (let i = 0; i < check1; i++) {
                filteredQuestionsForProgressTrends.push(q);
              }
            } else {
              filteredQuestionsForProgressTrends.push(q);
            }
          }
        }

        const filteredQuestionsForProgressLocation = [];

        for (const q of totalQuestionForCompany) {
          const isModuleMatched = selectedModules.length === 0 || selectedModules.includes(q.moduleId);
          const isFrameworkMatched = selectedFrameworks.length === 0 || q.frameworksIds.some(fid => selectedFrameworks.includes(fid));

          if (isModuleMatched && isFrameworkMatched) {
            let check1 = selectedPeriods.length === 0 ? periodOptions.length : selectedPeriods.length;

            if (q.frequency === "CUSTOM") {
              for (let i = 0; i < check1; i++) {
                filteredQuestionsForProgressLocation.push(q);
              }
            } else {
              filteredQuestionsForProgressLocation.push(q);
            }
          }
        }

        const frameworkPeriodChartData = prepareFrameworkPeriodChartData(
          frameworksToProcess,
          selectedPeriodsValue,
          filteredQuestionsForProgressTrends,
          mergedFrameworkAnswers,
          filteredUsers,
          frameworkMap
        );

        const progressTrendsByLocationData = prepareProgressTrendsByLocationData(
          selectedLocations.length === 0 ? locations.map(l => l.id) : selectedLocations,
          selectedPeriodsValue,
          filteredQuestionsForProgressLocation,
          mergedFrameworkAnswers,
          filteredUsers,
          userResult,
          locationMap,
          selectedPeriods
        );

        const progressTrendsByPeriodsData = prepareProgressTrendsByPeriodsData(
          selectedPeriodsValue,
          filteredQuestionsForProgressTrends,
          mergedFrameworkAnswers,
          filteredUsers
        );

        const coverageByModuleData = prepareCoverageByModuleData(
          selectedModules.length === 0 ? moduleOptions.map(m => m.id) : selectedModules,
          moduleOptions,
          filteredQuestions,
          mergedFrameworkAnswers,
          filteredUsers,
          fromDates
        );

        // UPDATED: Pass arrays even if empty - let the API handle it
        const frameworkIdsForAPI = selectedFrameworks.length === 0 ? frameworkOptions.map(f => f.value) : selectedFrameworks;
        const locationIdsForAPI = selectedLocations.length === 0 ? locations.map(l => l.id) : selectedLocations;

        teamWorkloadProgess(fromDates, financialYearId, frameworkIdsForAPI, locationIdsForAPI, selectedModules.length === 0 ? moduleOptions.map(m => m.id) : selectedModules)

        setDashboardData(prev => ({
          ...prev,
          metrics: {
            totalDataPoints: totalQuestions,
            overallCompletion: overallCompletion,
            activeContributors: totalActiveUsers,
            pendingReviews: totalPending
          },
          weeklyActivities: weeklyActivities,
          frameworkProgress: frameworkProgressData,
          frameworkLocationChart: frameworkLocationChartData,
          frameworkPeriodChart: frameworkPeriodChartData,
          progressTrendsByLocation: progressTrendsByLocationData,
          progressTrendsByPeriods: progressTrendsByPeriodsData,
          coverageByModule: coverageByModuleData
        }));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [selectedPeriodsValue, financialYearId, selectedFrameworks, selectedLocations, selectedModules, allUsers]);

  // Filter handlers
  const handleFinancialYearChange = (event) => {
    setFinancialYearId(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedPeriods([]);
    setSelectedLocations([]);
    setSelectedModules([]);
  };

  return (
    <>
      <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <FilterSection
          financialYear={financialYear}
          financialYearId={financialYearId}
          onFinancialYearChange={handleFinancialYearChange}
          selectedFrameworks={selectedFrameworks}
          setSelectedFrameworks={setSelectedFrameworks}
          frameworkOptions={frameworkOptions}
          selectedPeriods={selectedPeriods}
          setSelectedPeriods={setSelectedPeriods}
          periodOptions={periodOptions}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          locationOptions={locationOptions}
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
          moduleOptions={moduleOptions}
          onClearFilters={handleClearFilters}
          activeTab="esg"
        />

        <KeyMetrics metrics={dashboardData.metrics} />

        <WeeklyActivitySummary activities={dashboardData.weeklyActivities} />

        <FrameworkProgressCards frameworkProgress={dashboardData.frameworkProgress} />

        {/* Framework Charts */}
        <Row className="my-4">
          <Col md={6}>
            <FrameworkCompletionChart
              chartData={dashboardData.frameworkLocationChart}
              loading={loading}
              title="Framework Completion by Location"
              icon="📊"
              description="Compare framework progress across different locations"
              emptyStateMessage="Select frameworks and locations to view the completion comparison chart."
              emptyStateIcon="📍"
              filenamePrefix="framework-completion-by-location"
            />
          </Col>
          <Col md={6}>
            <FrameworkCompletionChart
              chartData={dashboardData.frameworkPeriodChart}
              loading={loading}
              title="Framework Completion by Periods"
              icon="📅"
              description="Track framework progress over different time periods"
              emptyStateMessage="Select frameworks and periods to view the completion timeline chart."
              emptyStateIcon="📈"
              filenamePrefix="framework-completion-by-periods"
            />
          </Col>
        </Row>

        {/* Progress Trends */}
        <Row className="mb-4">
          <Col md={6}>
            <ProgressTrendsChart
              chartData={dashboardData.progressTrendsByLocation}
              loading={loading}
              title="Progress Trends by Location"
              icon="📈"
              description="Track progress evolution across locations over time"
              chartType="line"
              emptyStateMessage="Select locations and periods to view progress trends over time."
              enableDataLabels={false}
              useComplexColors={true}
            />
          </Col>
          <Col md={6}>
            <ProgressTrendsChart
              chartData={dashboardData.progressTrendsByPeriods}
              loading={loading}
              title="Progress Trends by Periods"
              icon="📅"
              description="Analyze progress evolution across time periods"
              chartType="area"
              emptyStateMessage="Select periods to view progress trends over time."
              enableDataLabels={true}
              useComplexColors={false}
            />
          </Col>
        </Row>

        {/* Coverage Chart - 50% width */}
        <Row className="mb-4">
          <Col md={12}>
            <CoverageByModuleChart
              chartData={dashboardData.coverageByModule}
              loading={loading}
            />
          </Col>
        </Row>

        {/* Workload Charts */}
        {/* <Row className="mb-4">
          <Col md={6}>
            <AuditorWorkload user="audit" teamWorkloadData={teamWorksloadData} />
          </Col>
          <Col md={6}>
            <DataOwnerWorkLoad user="user" teamWorkloadData={teamWorksloadData} />
          </Col>
        </Row> */}
        <Row>
          <Col md={6}>
            <TeamWorkLoad user="audit" teamWorkloadData={teamWorksloadData} />
          </Col>
          <Col md={6}>
            <DataProcessing user="user" teamWorkloadData={teamWorksloadData} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className={`d-flex flex-row flex-space-between mt-4 height-40`}>
              <div className="dashboard-component" style={{ width: "100%" }}>
                <UsersActivity
                  usersActivity={usersActivities}
                  heading="User's activity log"
                />
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className={`d-flex flex-row flex-space-between mt-4 height-40`}>
              <div className="dashboard-component" style={{ width: "100%" }}>
                <RecentActivity
                  todaysActivities={todaysActivities}
                  heading="Data owner's activity log"
                />
              </div>
            </div>
          </Col>
        </Row>

        <ComparativeAnalysis financialYear={financialYear} frameworkOptions={frameworkOptions} locations={locations} reportingQuestions={reportingQuestions}
          reportingAnswers={reportingAnswers} allUsers={allUsers} periodOptions={periodOptions} frequency={frequency} locationOptions={locationOptions} />

                <button
        onClick={() => setShowAIDashboard(true)}
        style={styles.floatingButton}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px #3f88a5';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px #3f88a5';
        }}
        title="AI Lens"
      >
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={48} />
          <span
            style={{
              position: 'absolute',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            AI
          </span>
        </div>
      </button>


      {showAIDashboard && (
        <AIDashboard
          isOpen={showAIDashboard}
          onClose={() => setShowAIDashboard(false)}
        />
      )}

      </Container>
      <style>
        {`
          .dashboard-component {
            height: 100%;
            border-radius: 10px;
            /* Add any existing styling for your component boxes */
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          /* Height classes for different rows */
          .height-60 {
            height: 60vh;
          }

          .height-40 {
            height: 40vh;
          }

          .height-500 {
            height: 500px;
          }

          /* Responsive adjustments for smaller screens */
          @media (max-width: 992px) {
            .d-flex.flex-row {
              flex-direction: column !important;
            }

            .dashboard-component {
              width: 100% !important;
              margin-left: 0 !important;
              margin-bottom: 20px;
            }

            .height-60, .height-40, .height-500 {
              height: auto;
            }
          }

          /* Existing classes - make sure they're compatible */
          .d-flex {
            display: flex;
          }

          .flex-row {
            flex-direction: row;
          }

          .flex-space-between {
            justify-content: space-between;
          }
        `}
      </style>
    </>
  );
};

export default ESGProgressDashboard;