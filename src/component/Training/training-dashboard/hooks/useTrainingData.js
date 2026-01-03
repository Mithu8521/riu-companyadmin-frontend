import { useMemo } from 'react';
import { categorizeEmployee, calculateTrainingHours } from '../utils/trainingUtils';

// Hook for location training data
export const useLocationTrainingData = (trainingData, locations) => {
  return useMemo(() => {
    if (!trainingData.length || !locations.length) return [];

    const locationStats = {};

    // Initialize location stats dynamically from actual locations
    locations.forEach(location => {
      const locationName = location?.unitCode;
      locationStats[location.id] = {
        id: location.id,
        name: locationName,
        totalPrograms: 0,
        totalParticipants: new Set(), // collect unique participant IDs
        completedParticipants: new Set() // collect unique completed IDs
      };
    });

    trainingData.forEach(training => {
      const locationId = training.locationId;
      const locStats = locationStats[locationId];

      if (!locStats) return; // Skip if locationId doesn't match

      locStats.totalPrograms++;

      if (Array.isArray(training.acceptedUsers)) {
        training.acceptedUsers.forEach(user => {
          if (user.employeeId) {
            locStats.totalParticipants.add(user.employeeId);
          }
        });
      }

      if (
        training.status === 1 ||
        training.status === 'Completed' ||
        training.status === 'completed'
      ) {
        if (Array.isArray(training.attendantUsers)) {
          training.attendantUsers.forEach(user => {
            if (user.employeeId) {
              locStats.completedParticipants.add(user.employeeId);
            }
          });
        }
      }
    });

    // Final mapping and calculation
    return Object.values(locationStats)
      .filter(location => location.totalPrograms > 0)
      .map(location => ({
        name: location.name,
        totalPrograms: location.totalPrograms,
        totalParticipants: location.totalParticipants.size,
        completedPrograms: location.completedParticipants.size,
        completionRate:
          location.totalPrograms > 0
            ? Math.round(
              (location.completedParticipants.size / location.totalPrograms) * 100
            )
            : 0
      }));
  }, [trainingData, locations]);
};

// Hook for year over year data
export const useYearOverYearData = (trainingData, traineeList, financialYear) => {
  return useMemo(() => {
    if (!trainingData.length || !traineeList.length || !financialYear.length) return [];

    // Get all unique fiscal years from financial year data and sort them
    const fiscalYears = financialYear.map(fy => {
      const fromDate = new Date(fy.fromDate);
      const toDate = new Date(fy.toDate);
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      return {
        id: fy.id,
        label: `FY ${fromYear}-${toYear.toString().slice(-2)}`,
        fromDate,
        toDate
      };
    }).sort((a, b) => a.fromDate - b.fromDate);

    if (fiscalYears.length === 0) return [];

    // Get all unique training categories dynamically
    const categories = [...new Set(trainingData.flatMap(t => (t.categories || []).map(c => c?.title).filter(Boolean)))];

    // Get all unique employee categories
    const employeeCategories = [...new Set(traineeList.map(t => categorizeEmployee(t)))];

    // Initialize data structure dynamically
    const yearData = {};
    employeeCategories.forEach(empCat => {
      categories.forEach(trainCat => {
        const key = `${empCat} ${trainCat}`;
        yearData[key] = {};
        fiscalYears.forEach(fy => {
          yearData[key][fy.label] = new Set(); // Use Set to track unique employees
        });
      });
    });

    // Process training data
    trainingData.forEach(training => {
      const trainingDate = new Date(training.fromDate);
      const trainingCategories = training.categories || [];

      if (!trainingCategories || isNaN(trainingDate.getTime())) return;

      // Find which fiscal year this training belongs to
      const fiscalYear = fiscalYears.find(fy =>
        trainingDate >= fy.fromDate && trainingDate <= fy.toDate
      );

      if (!fiscalYear) return;

      training.attendantUsers?.forEach(attendant => {
        const employeeCategory = categorizeEmployee(attendant);
        const employeeId = attendant.id || attendant.employeeId;
        trainingCategories.forEach(category => {
          if (!category?.title) return;

          const key = `${employeeCategory} ${category.title}`;

          if (yearData[key] && yearData[key][fiscalYear.label] && employeeId) {
            yearData[key][fiscalYear.label].add(employeeId);
          }
        });
      });
    });

    // Convert Sets to counts and return only categories with data
    return Object.entries(yearData)
      .map(([category, data]) => {
        const result = { category: category.length > 25 ? category.substring(0, 25) + '...' : category };
        fiscalYears.forEach(fy => {
          result[fy.label] = data[fy.label] ? data[fy.label].size : 0;
        });
        return result;
      })
      .filter(item => {
        // Only include categories that have some training data
        return fiscalYears.some(fy => item[fy.label] > 0);
      });
  }, [trainingData, traineeList, financialYear]);
};

// Hook for gender distribution data
export const useGenderDistributionData = (traineeList) => {
  return useMemo(() => {
    if (!traineeList.length) return [];

    // Get all unique employee categories dynamically
    const employeeCategories = [...new Set(traineeList.map(t => categorizeEmployee(t)))];

    // Get all unique genders dynamically
    const genders = [...new Set(traineeList.map(t => t.gender).filter(Boolean))];

    const genderStats = {};

    // Initialize dynamically
    employeeCategories.forEach(category => {
      genderStats[category] = {};
      genders.forEach(gender => {
        genderStats[category][gender] = 0;
      });
    });

    // Count actual data
    traineeList.forEach(trainee => {
      const category = categorizeEmployee(trainee);
      const gender = trainee.gender;

      if (category && gender && genderStats[category]) {
        genderStats[category][gender] = (genderStats[category][gender] || 0) + 1;
      }
    });

    // Convert to chart format and only include categories with data
    return Object.entries(genderStats)
      .map(([category, data]) => ({
        category: category.length > 15 ? category.substring(0, 15) + '...' : category,
        ...data
      }))
      .filter(item => {
        // Only include categories that have people
        return genders.some(gender => item[gender] > 0);
      });
  }, [traineeList]);
};

// Hook for human rights progress data
export const useHumanRightsProgressData = (trainingData, traineeList, financialYear) => {
  return useMemo(() => {
    if (!trainingData.length || !traineeList.length || !financialYear.length) return [];

    // Get all employee categories
    const employeeCategories = [...new Set(traineeList.map(t => categorizeEmployee(t)))];

    // Extract fiscal years and sort them ascending (earliest to latest)
    const fiscalYears = financialYear.map(fy => ({
      id: fy.id,
      label: `FY ${fy.financial_year_value}`,
      raw: fy.financial_year_value
    })).sort((a, b) => {
      const [aStart] = a.raw.split('-').map(Number);
      const [bStart] = b.raw.split('-').map(Number);
      return aStart - bStart;
    });

    if (fiscalYears.length === 0) return [];

    // Get the latest fiscal year
    const latestFY = fiscalYears[fiscalYears.length - 1];

    // Only consider trainings where Category.id === 3 (Human Rights)
    const isHumanRightsTraining = training => (training.categories || []).map(category => category?.id).filter(Boolean).includes(3);

    return employeeCategories.map(category => {
      const result = {
        category: category.length > 15 ? category.substring(0, 15) + '...' : category
      };

      const categoryTrainees = traineeList.filter(trainee => categorizeEmployee(trainee) === category);
      const trainedEmployees = new Set();

      trainingData.forEach(training => {
        if (!isHumanRightsTraining(training)) return;

        training.attendantUsers?.forEach(attendant => {
          if (categorizeEmployee(attendant) === category) {
            const employeeId = attendant.id || attendant.employeeId;
            if (employeeId) {
              trainedEmployees.add(employeeId);
            }
          }
        });
      });

      // Assign training coverage
      fiscalYears.forEach(fy => {
        if (fy.id === latestFY.id) {
          const coverage = categoryTrainees.length > 0
            ? (trainedEmployees.size / categoryTrainees.length) * 100
            : 0;
          result[fy.label] = Math.round(coverage * 100) / 100;
        } else {
          result[fy.label] = 0;
        }
      });

      return result;
    }).filter(item => item[latestFY.label] > 0); // Only include categories with coverage in latest FY
  }, [trainingData, traineeList, financialYear]);
};

export const useProcessedTrainingData = (trainingData) => {
  return useMemo(() => {
    let filteredData = [...trainingData];

    // Apply category filter


    // Calculate stats
    const totalTrainingPrograms = filteredData.length;

    // Calculate total training hours
    const totalTrainingHours = filteredData.reduce((total, item) => {
      const hours = calculateTrainingHours(item.fromTime, item.toTime);
      return total + hours;
    }, 0);

    // Extract dynamic category IDs
    const trainingCategories = {};
    if (trainingData.length > 0) {
      trainingData.forEach(training => {
        (training.categories || []).forEach(category => {
          if (category?.id && category?.title) {
            trainingCategories[category.id] = category.title;
          }
        });
      });
    }

    const healthSafetyCategoryId = Object.keys(trainingCategories).find(id =>
      trainingCategories[id]?.toLowerCase().includes('health') &&
      trainingCategories[id]?.toLowerCase().includes('safety')
    );

    const skillDevelopmentCategoryId = Object.keys(trainingCategories).find(id =>
      trainingCategories[id]?.toLowerCase().includes('skill') &&
      (
        trainingCategories[id]?.toLowerCase().includes('development') ||
        trainingCategories[id]?.toLowerCase().includes('upgradation')
      )
    );

    // Track unique employee stats
    const employeeStats = { total: new Set(), healthSafety: new Set(), skillDevelopment: new Set() };
    const workerStats = { total: new Set(), healthSafety: new Set(), skillDevelopment: new Set() };
    const uniqueMonthlyParticipants = new Set();

    filteredData.forEach(item => {
      const attendants = item.attendantUsers || [];
      const categoryIds = (item.categories || []).map(category => category?.id).filter(Boolean);

      attendants.forEach(user => {
        const userId = user.employeeId || user.id; // Use employeeId if present
        if (!userId) return;

        uniqueMonthlyParticipants.add(userId);

        const userCategory = categorizeEmployee(user);

        const isEmployee = [
          'Employees other than BoD and KMPs',
          'Board of Directors',
          'Key Managerial Personnel'
        ].includes(userCategory);

        const isWorker = userCategory === 'Workers';

        if (isEmployee) {
          employeeStats.total.add(userId);
          if (categoryIds.includes(Number(healthSafetyCategoryId))) {
            employeeStats.healthSafety.add(userId);
          } 
          
          if (categoryIds.includes(Number(skillDevelopmentCategoryId))) {
            employeeStats.skillDevelopment.add(userId);
          }
        } else if (isWorker) {
          workerStats.total.add(userId);
          if (categoryIds.includes(Number(healthSafetyCategoryId))) {
            workerStats.healthSafety.add(userId);
          } 
          
          if (categoryIds.includes(Number(skillDevelopmentCategoryId))) {
            workerStats.skillDevelopment.add(userId);
          }
        }
      });
    });

    const getPercent = (numeratorSet, denominatorSet) =>
      denominatorSet.size > 0
        ? ((numeratorSet.size / denominatorSet.size) * 100).toFixed(2)
        : "0.00";

    const stats = {
      totalTrainingPrograms,
      employeeCoverage: {
        total: employeeStats.total.size,
        healthSafety: employeeStats.healthSafety.size,
        healthSafetyPercent: getPercent(employeeStats.healthSafety, employeeStats.total),
        skillDevelopment: employeeStats.skillDevelopment.size,
        skillDevPercent: getPercent(employeeStats.skillDevelopment, employeeStats.total)
      },
      workerCoverage: {
        total: workerStats.total.size,
        healthSafety: workerStats.healthSafety.size,
        healthSafetyPercent: getPercent(workerStats.healthSafety, workerStats.total),
        skillDevelopment: workerStats.skillDevelopment.size,
        skillDevPercent: getPercent(workerStats.skillDevelopment, workerStats.total)
      },
      monthlyParticipants: uniqueMonthlyParticipants.size,
      totalTrainingHours: Math.round(totalTrainingHours)
    };

    return { filteredData, stats };
  }, [trainingData]);
};

export const useProcessedEmployeeData = (employeeData) => {
  return useMemo(() => {
    if (!employeeData || !Array.isArray(employeeData)) {
      return {
        totalStats: { total: 0, male: 0, female: 0 },
        categoryStats: {},
        filteredData: []
      };
    }

    let filteredData = [...employeeData];

    // Initialize category statistics
    const categoryStats = {
      'BOD': { total: 0, male: 0, female: 0 },
      'KMP': { total: 0, male: 0, female: 0 },
      'Permanent Employee': { total: 0, male: 0, female: 0 },
      'Other than Permanent Employee': { total: 0, male: 0, female: 0 },
      'Permanent Worker': { total: 0, male: 0, female: 0 },
      'Other than Permanent Worker': { total: 0, male: 0, female: 0 }
    };

    // Initialize total statistics
    const totalStats = { total: 0, male: 0, female: 0 };

    // Process each employee
    filteredData.forEach(employee => {
      const { categoryId, gender } = employee;

      // Count total employees
      totalStats.total++;

      // Count by gender for total
      if (gender === 'MALE') {
        totalStats.male++;
      } else if (gender === 'FEMALE') {
        totalStats.female++;
      }

      // Count by category
      if (categoryStats.hasOwnProperty(categoryId)) {
        categoryStats[categoryId].total++;

        // Count by gender for each category
        if (gender === 'MALE') {
          categoryStats[categoryId].male++;
        } else if (gender === 'FEMALE') {
          categoryStats[categoryId].female++;
        }
      }
    });

    // Calculate percentages for each category
    const categoryStatsWithPercentages = Object.keys(categoryStats).reduce((acc, category) => {
      const stats = categoryStats[category];
      acc[category] = {
        ...stats,
        malePercentage: stats.total > 0 ? ((stats.male / stats.total) * 100).toFixed(2) : "0.00",
        femalePercentage: stats.total > 0 ? ((stats.female / stats.total) * 100).toFixed(2) : "0.00",
        totalPercentage: totalStats.total > 0 ? ((stats.total / totalStats.total) * 100).toFixed(2) : "0.00"
      };
      return acc;
    }, {});

    // Calculate total percentages
    const totalStatsWithPercentages = {
      ...totalStats,
      malePercentage: totalStats.total > 0 ? ((totalStats.male / totalStats.total) * 100).toFixed(2) : "0.00",
      femalePercentage: totalStats.total > 0 ? ((totalStats.female / totalStats.total) * 100).toFixed(2) : "0.00"
    };

    // Create coverage objects similar to employeeCoverage structure
    const boardOfDirectorsCoverage = {
      total: categoryStats['BOD'].total,
      male: categoryStats['BOD'].male,
      malePercent: categoryStatsWithPercentages['BOD'].malePercentage,
      female: categoryStats['BOD'].female,
      femalePercent: categoryStatsWithPercentages['BOD'].femalePercentage
    };

    const keyManagerialPersonnelCoverage = {
      total: categoryStats['KMP'].total,
      male: categoryStats['KMP'].male,
      malePercent: categoryStatsWithPercentages['KMP'].malePercentage,
      female: categoryStats['KMP'].female,
      femalePercent: categoryStatsWithPercentages['KMP'].femalePercentage
    };

    const permanentEmployeeCoverage = {
      total: categoryStats['Permanent Employee'].total,
      male: categoryStats['Permanent Employee'].male,
      malePercent: categoryStatsWithPercentages['Permanent Employee'].malePercentage,
      female: categoryStats['Permanent Employee'].female,
      femalePercent: categoryStatsWithPercentages['Permanent Employee'].femalePercentage
    };

    const otherThanPermanentEmployeeCoverage = {
      total: categoryStats['Other than Permanent Employee'].total,
      male: categoryStats['Other than Permanent Employee'].male,
      malePercent: categoryStatsWithPercentages['Other than Permanent Employee'].malePercentage,
      female: categoryStats['Other than Permanent Employee'].female,
      femalePercent: categoryStatsWithPercentages['Other than Permanent Employee'].femalePercentage
    };

    const permanentWorkersCoverage = {
      total: categoryStats['Permanent Worker'].total,
      male: categoryStats['Permanent Worker'].male,
      malePercent: categoryStatsWithPercentages['Permanent Worker'].malePercentage,
      female: categoryStats['Permanent Worker'].female,
      femalePercent: categoryStatsWithPercentages['Permanent Worker'].femalePercentage
    };

    const otherThanPermanentWorkersCoverage = {
      total: categoryStats['Other than Permanent Worker'].total,
      male: categoryStats['Other than Permanent Worker'].male,
      malePercent: categoryStatsWithPercentages['Other than Permanent Worker'].malePercentage,
      female: categoryStats['Other than Permanent Worker'].female,
      femalePercent: categoryStatsWithPercentages['Other than Permanent Worker'].femalePercentage
    };



    return  {
      boardOfDirectorsCoverage,
      keyManagerialPersonnelCoverage,
      permanentEmployeeCoverage,
      otherThanPermanentEmployeeCoverage,
      permanentWorkersCoverage,
      otherThanPermanentWorkersCoverage
    };


  }, [employeeData]);
};
