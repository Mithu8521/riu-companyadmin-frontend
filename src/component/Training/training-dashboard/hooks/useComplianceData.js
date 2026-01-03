import { useMemo } from 'react';
import { categorizeEmployee } from '../utils/trainingUtils';
import { EMPLOYEE_CATEGORIES } from '../constants/trainingConstants';

export const useTrainingComplianceData = (trainingData, traineeList) => {
  return useMemo(() => {
    if (!traineeList.length) {
      return {
        principles: {},
        trainingPrograms: {}
      };
    }

    // Extract principles from training data
    const principlesMap = {};
    if (trainingData.length > 0 && trainingData[0].allPrinciples) {
      trainingData[0].allPrinciples.forEach((principle, index) => {
        principlesMap[`P${index + 1}`] = principle.title;
      });
    }

    // Define all possible employee categories
    const allCategories = [
      EMPLOYEE_CATEGORIES.BOARD_OF_DIRECTORS,
      EMPLOYEE_CATEGORIES.KEY_MANAGERIAL_PERSONNEL,
      EMPLOYEE_CATEGORIES.EMPLOYEES_OTHER,
      EMPLOYEE_CATEGORIES.WORKERS
    ];

    // Group all trainees by category
    const traineesByCategory = {};

    // Initialize all categories with empty arrays
    allCategories.forEach(category => {
      traineesByCategory[category] = [];
    });

    // Populate categories with actual trainees
    traineeList.forEach(trainee => {
      const category = categorizeEmployee(trainee);
      if (traineesByCategory[category]) {
        traineesByCategory[category].push(trainee);
      }
    });

    const validTraineeIds = new Set(traineeList.map(t => (t.employeeId)));

    // Initialize training programs structure for ALL categories
    const trainingPrograms = {};
    allCategories.forEach(category => {
      trainingPrograms[category] = {
        totalEmployees: traineesByCategory[category].length,
        principleCompliance: {}
      };

      // Initialize all principles with empty Sets to track unique employees
      Object.keys(principlesMap).forEach(principleKey => {
        trainingPrograms[category].principleCompliance[principleKey] = {
          status: "No",
          covered: 0,
          percentage: 0,
          uniqueEmployees: new Set()
        };
      });
    });

    // Process training data to calculate compliance with unique employee tracking
    trainingData.forEach(training => {
      const attendants = training.attendantUsers || [];
      const trainingPrinciples = training.principles || [];

      attendants.forEach(attendant => {
        const category = categorizeEmployee(attendant);
        const employeeId = attendant.employeeId;
        if (trainingPrograms[category] && employeeId && validTraineeIds.has(employeeId)) {
          trainingPrinciples.forEach(principle => {
            const principleIndex = training.allPrinciples?.findIndex(p => p.id === principle.id);
            if (principleIndex !== -1) {
              const principleKey = `P${principleIndex + 1}`;

              if (trainingPrograms[category].principleCompliance[principleKey]) {
                trainingPrograms[category].principleCompliance[principleKey].uniqueEmployees.add(employeeId);
                trainingPrograms[category].principleCompliance[principleKey].status = "Yes";
              }
            }
          });
        }
      });
    });

    // Calculate final counts and percentages from unique employees
    Object.keys(trainingPrograms).forEach(category => {
      const totalEmployees = trainingPrograms[category].totalEmployees;
      Object.keys(trainingPrograms[category].principleCompliance).forEach(principleKey => {
        const compliance = trainingPrograms[category].principleCompliance[principleKey];

        compliance.covered = compliance.uniqueEmployees.size;
        let percentage = totalEmployees > 0 ?
          Math.round((compliance.covered / totalEmployees) * 100 * 100) / 100 : 0;

        compliance.percentage = isNaN(Number(percentage)) ? 0 : percentage;
        delete compliance.uniqueEmployees;
      });
    });

    return {
      principles: principlesMap,
      trainingPrograms
    };
  }, [trainingData, traineeList]);
};


// Hook to analyze principle coverage
export const usePrincipleCoverageAnalysis = (complianceData) => {
  return useMemo(() => {
    if (!complianceData?.trainingPrograms || !complianceData?.principles) {
      return { high: [], medium: [], low: [] };
    }

    const principleStats = {};
    
    // Calculate total coverage for each principle across all employee categories
    Object.keys(complianceData.principles).forEach(principleKey => {
      let totalCovered = 0;
      let totalEmployees = 0;
      
      Object.keys(complianceData.trainingPrograms).forEach(category => {
        const categoryData = complianceData.trainingPrograms[category];
        totalEmployees += categoryData.totalEmployees;
        
        if (categoryData.principleCompliance[principleKey]) {
          totalCovered += categoryData.principleCompliance[principleKey].covered;
        }
      });
      
      // Calculate overall percentage with NaN handling
      let overallPercentage = totalEmployees > 0 ? (totalCovered / totalEmployees) * 100 : 0;
      overallPercentage = isNaN(overallPercentage) ? 0 : overallPercentage;
      
      principleStats[principleKey] = {
        title: complianceData.principles[principleKey],
        covered: totalCovered,
        percentage: isNaN(Math.round(overallPercentage * 100) / 100) ? 0 : Math.round(overallPercentage * 100) / 100
      };
    });

    // Dynamically determine coverage thresholds instead of hardcoded 50% and 20%
    const coverageValues = Object.values(principleStats).map(stat => stat.percentage).sort((a, b) => b - a);
    
    // Handle NaN values in threshold calculations
    let highThreshold = coverageValues.length > 0 ? Math.max(coverageValues[0] * 0.7, 30) : 50;
    highThreshold = isNaN(highThreshold) ? 0 : highThreshold;
    
    let lowThreshold = coverageValues.length > 0 ? Math.max(coverageValues[Math.floor(coverageValues.length * 0.7)] || 0, 5) : 20;
    lowThreshold = isNaN(lowThreshold) ? 0 : lowThreshold;

    // Categorize principles based on dynamic coverage thresholds
    const high = [];
    const medium = [];
    const low = [];

    Object.keys(principleStats).forEach(principleKey => {
      const stat = principleStats[principleKey];
      const percentage = isNaN(stat.percentage) ? 0 : stat.percentage;
      
      if (percentage >= highThreshold) {
        high.push({ key: principleKey, ...stat, percentage });
      } else if (percentage >= lowThreshold) {
        medium.push({ key: principleKey, ...stat, percentage });
      } else {
        low.push({ key: principleKey, ...stat, percentage });
      }
    });

    return {
      high: high.sort((a, b) => b.percentage - a.percentage),
      medium: medium.sort((a, b) => b.percentage - a.percentage),
      low: low.sort((a, b) => b.percentage - a.percentage)
    };
  }, [complianceData]);
};