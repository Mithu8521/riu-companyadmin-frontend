export const prepareFrameworkLocationChartData = (frameworkProgressData, selectedLocations, locationMap) => {
  if (!frameworkProgressData || frameworkProgressData.length === 0 || !selectedLocations || selectedLocations.length === 0) {
    return { series: [], categories: [] };
  }

  const getLocationName = (locationId) => {
    return locationMap[locationId] || `Location ${locationId}`;
  };

  // Get all locations
  const allLocations = selectedLocations.map(locationId => ({
    locationId,
    locationName: getLocationName(locationId)
  }));

  // Prepare series data for each framework
  const chartSeries = frameworkProgressData.map(framework => {
    const frameworkData = allLocations.map(location => {
      const locationProgress = framework.locationProgress.find(
        loc => loc.locationId === location.locationId
      );
      return locationProgress ? locationProgress.completion : 0;
    });

    return {
      name: framework.frameworkName.replace(/\s*\([^)]*\)/g, ''), // Remove text in parentheses
      data: frameworkData
    };
  });

  return {
    series: chartSeries,
    categories: allLocations.map(location => location.locationName)
  };
};

export const prepareFrameworkPeriodChartData = (selectedFrameworks, selectedPeriodsValue, filteredQuestions, reportingAnswers, filteredUsers, frameworkMap) => {
  if (!selectedFrameworks || selectedFrameworks.length === 0 || !selectedPeriodsValue || selectedPeriodsValue.length === 0) {
    return { series: [], categories: [] };
  }

  const getFrameworkName = (frameworkId) => {
    return frameworkMap[frameworkId] || `Framework ${frameworkId}`;
  };

  // Get period names/labels from selectedPeriodsValue
  const allPeriods = selectedPeriodsValue.map(period => ({
    fromDate: period.fromDate,
    periodName: period?.showLevel || period.label || period.name || period.fromDate // Use label, name, or fromDate as fallback
  }));

  // Prepare series data for each framework
  const chartSeries = selectedFrameworks.map(frameworkId => {
    // Get questions for this framework
    const frameworkQuestions = filteredQuestions.filter(q =>
      q.frameworksIds.includes(frameworkId)
    );

    if (frameworkQuestions.length === 0) {
      return {
        name: getFrameworkName(frameworkId).replace(/\s*\([^)]*\)/g, ''),
        data: new Array(allPeriods.length).fill(0)
      };
    }

    // Calculate completion for each period
    const frameworkData = allPeriods.map(period => {
      // Get custom questions for this framework
      const customQuestionsForFramework = frameworkQuestions
        .filter(item => item.frequency === "CUSTOM")
        .map(item => item.questionId);

      // Get other questions for this framework  
      const othersQuestionsForFramework = frameworkQuestions
        .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
        .map(item => item.questionId);

      // Calculate completed questions for this period
      const completedOthersForPeriod = [
        ...new Set(
          reportingAnswers
            .filter(item =>
              othersQuestionsForFramework.includes(item.questionId) &&
              (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') 
            )
            .map(item => item.questionId)
        )
      ];

      const completedCustomForPeriod = 
          reportingAnswers
            .filter(item =>
              customQuestionsForFramework.includes(item.questionId) &&
              item.fromDate === period.fromDate && // Filter by specific period
              (item.status === 'ACCEPTED' || item.status !== 'ANSWERED') 
            )
            .map(item => item.questionId)

      const totalFrameworkQuestions = frameworkQuestions.length;
      const totalCompletedForPeriod = completedOthersForPeriod.length + completedCustomForPeriod.length;

      return totalFrameworkQuestions > 0
        ? Math.round((totalCompletedForPeriod / totalFrameworkQuestions) * 100)
        : 0;
    });

    return {
      name: getFrameworkName(frameworkId).replace(/\s*\([^)]*\)/g, ''),
      data: frameworkData
    };
  });

  return {
    series: chartSeries,
    categories: allPeriods.map(period => period.periodName)
  };
};

export const prepareProgressTrendsByLocationData = (selectedLocations, selectedPeriodsValue, filteredQuestions, reportingAnswers, filteredUsers, userResult, locationMap) => {
  if (!selectedLocations || selectedLocations.length === 0) {
    return { series: [], categories: [] };
  }
  const getLocationName = (locationId) => {
    return locationMap[locationId] || `Location ${locationId}`;
  };
  // Get location names for x-axis
  const locationCategories = selectedLocations.map(locationId => getLocationName(locationId));

  // Calculate data for each location
  const overallProgressData = [];
  const dataQualityData = [];

  selectedLocations.forEach(locationId => {
    // Get users for this location
    const locationUsers = userResult
      .filter(user => user.sourceId.includes(locationId))
      .map(user => user.id);

    if (locationUsers.length === 0) {
      overallProgressData.push(0);
      dataQualityData.push(0);
      return;
    }

    // Get custom and other questions
    const customQuestionIds = filteredQuestions
      .filter(item => item.frequency === "CUSTOM")
      .map(item => item.questionId);

    const questionIdsOthers = filteredQuestions
      .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
      .map(item => item.questionId);

    const fromDates = selectedPeriodsValue.map(p => p.fromDate);

    // Overall Progress (ANSWERED OR ACCEPTED)
    const answeredOthersForLocation = [
      ...new Set(
        reportingAnswers
          .filter(item =>
            questionIdsOthers.includes(item.questionId) &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            locationId === item.sourceId
          )
          .map(item => item.questionId)
      )
    ];

    const answeredCustomForLocation = 
        reportingAnswers
          .filter(item =>
            customQuestionIds.includes(item.questionId) &&
            fromDates.includes(item.fromDate) &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            locationId === item.sourceId
          )
          .map(item => item.questionId)

    // Data Quality Score (ACCEPTED only)
    const acceptedOthersForLocation = [
      ...new Set(
        reportingAnswers
          .filter(item =>
            questionIdsOthers.includes(item.questionId) &&
            item.status === 'ACCEPTED' &&
            locationId === item.sourceId
          )
          .map(item => item.questionId)
      )
    ];

    const acceptedCustomForLocation =
        reportingAnswers
          .filter(item =>
            customQuestionIds.includes(item.questionId) &&
            fromDates.includes(item.fromDate) &&
            item.status === 'ACCEPTED' &&
            locationId === item.sourceId
          )
          .map(item => item.questionId)

    const totalQuestions = filteredQuestions.length;
    const totalAnswered = answeredOthersForLocation.length + answeredCustomForLocation.length;
    const totalAccepted = acceptedOthersForLocation.length + acceptedCustomForLocation.length;

    const overallProgress = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
    const dataQuality = totalQuestions > 0 ? Math.round((totalAccepted / totalQuestions) * 100) : 0;

    overallProgressData.push(overallProgress);
    dataQualityData.push(dataQuality);
  });

  return {
    series: [

      {
        name: 'Answered',
        data: overallProgressData,
        stroke: { width: 4 },
      },
      {
        name: 'Accepted',
        data: dataQualityData,
        stroke: { width: 4 },
      }

    ],
    categories: locationCategories
  };
};

export const prepareProgressTrendsByPeriodsData = (selectedPeriodsValue, filteredQuestions, reportingAnswers, filteredUsers) => {
  if (!selectedPeriodsValue || selectedPeriodsValue.length === 0) {
    return { series: [], categories: [] };
  }

  const periodCategories = selectedPeriodsValue.map(period =>
    period.showLevel || period.label || period.name || period.fromDate
  );

  const overallProgressData = [];
  const dataQualityData = [];

  selectedPeriodsValue.forEach(period => {
    // Get custom and other questions
    const customQuestionIds = filteredQuestions
      .filter(item => item.frequency === "CUSTOM")
      .map(item => item.questionId);

    const questionIdsOthers = filteredQuestions
      .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
      .map(item => item.questionId);

    // Overall Progress (ANSWERED OR ACCEPTED) - across all locations
    const answeredOthersForPeriod = [
      ...new Set(
        reportingAnswers
          .filter(item =>
            questionIdsOthers.includes(item.questionId) &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)
      )
    ];

    const answeredCustomForPeriod = 
        reportingAnswers
          .filter(item =>
            customQuestionIds.includes(item.questionId) &&
            item.fromDate === period.fromDate &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)

    // Data Quality Score (ACCEPTED only) - across all locations
    const acceptedOthersForPeriod = [
      ...new Set(
        reportingAnswers
          .filter(item =>
            questionIdsOthers.includes(item.questionId) &&
            item.status === 'ACCEPTED' &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)
      )
    ];

    const acceptedCustomForPeriod = 
        reportingAnswers
          .filter(item =>
            customQuestionIds.includes(item.questionId) &&
            item.fromDate === period.fromDate &&
            item.status === 'ACCEPTED' &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)

    const totalQuestions = filteredQuestions.length;
    const totalAnswered = answeredOthersForPeriod.length + answeredCustomForPeriod.length;
    const totalAccepted = acceptedOthersForPeriod.length + acceptedCustomForPeriod.length;

    const overallProgress = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
    const dataQuality = totalQuestions > 0 ? Math.round((totalAccepted / totalQuestions) * 100) : 0;

    overallProgressData.push(overallProgress);
    dataQualityData.push(dataQuality);
  });

  return {
    series: [
      {
        name: 'Answered',
        data: overallProgressData,
        stroke: { width: 4 },
      },
      {
        name: 'Accepted',
        data: dataQualityData,
        stroke: { width: 4 },
      }
    ],
    categories: periodCategories
  };
};

export const prepareCoverageByModuleData = (selectedModules, moduleOptions, filteredQuestions, reportingAnswers, filteredUsers, fromDates) => {
  if (!selectedModules || selectedModules.length === 0) {
    return { series: [], categories: [], moduleDetails: [] };
  }

  // Get module names
  const moduleMap = moduleOptions.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  const getModuleName = (moduleId) => {
    return moduleMap[moduleId] || `Module ${moduleId}`;
  };

  const currentCoverageData = [];
  const targetCoverageData = [];
  const moduleCategories = [];
  const moduleDetails = []; // Store detailed info for each module

  selectedModules.forEach(moduleId => {
    const moduleName = getModuleName(moduleId);
    moduleCategories.push(moduleName);

    // Get questions for this specific module
    const moduleQuestions = filteredQuestions.filter(q => q.moduleId === moduleId);

    if (moduleQuestions.length === 0) {
      currentCoverageData.push(0);
      targetCoverageData.push(100);
      moduleDetails.push({
        moduleId,
        moduleName,
        totalQuestions: 0,
        currentCompleted: 0,
        targetCompleted: 0,
        currentPercentage: 0,
        targetPercentage: 100
      });
      return;
    }

    // Separate questions by frequency type for this module
    const customQuestionsForModule = moduleQuestions
      .filter(item => item.frequency === "CUSTOM")
      .map(item => item.questionId);

    const othersQuestionsForModule = moduleQuestions
      .filter(item => item.frequency === "EVERY_FY" || item.frequency === "ONE_TIME")
      .map(item => item.questionId);

    // Calculate Current Coverage (ANSWERED or ACCEPTED)
    const answeredOthersForModule = [
      ...new Set(
        reportingAnswers
          .filter(item =>
            othersQuestionsForModule.includes(item.questionId) &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)
      )
    ];

    const answeredCustomForModule = 
        reportingAnswers
          .filter(item =>
            customQuestionsForModule.includes(item.questionId) &&
            fromDates.includes(item.fromDate) &&
            ['ANSWERED', 'ACCEPTED'].includes(item.status) &&
            filteredUsers.includes(item.userId)
          )
          .map(item => item.questionId)

    const totalModuleQuestions = moduleQuestions.length;
    const totalAnsweredForModule = answeredOthersForModule.length + answeredCustomForModule.length;

    // Current Coverage Percentage
    const currentCoverage = totalModuleQuestions > 0
      ? Math.round((totalAnsweredForModule / totalModuleQuestions) * 100)
      : 0;

    // Target Coverage - You can customize this logic
    // const targetCoverage = getTargetCoverageForModule(moduleId);
    const targetCoverage = 100;

    const targetCompleted = Math.round((targetCoverage / 100) * totalModuleQuestions);

    currentCoverageData.push(currentCoverage);
    targetCoverageData.push(targetCoverage);

    // Store detailed information
    moduleDetails.push({
      moduleId,
      moduleName,
      totalQuestions: totalModuleQuestions,
      currentCompleted: totalAnsweredForModule,
      targetCompleted: targetCompleted,
      currentPercentage: currentCoverage,
      targetPercentage: targetCoverage
    });
  });

  return {
    series: [
      {
        name: 'Current Coverage',
        data: currentCoverageData
      },
      {
        name: 'Target Coverage',
        data: targetCoverageData
      }
    ],
    categories: moduleCategories,
    moduleDetails: moduleDetails // Include detailed info for pagination
  };
};