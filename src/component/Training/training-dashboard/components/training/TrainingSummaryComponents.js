import React, { useMemo } from 'react';
import { categorizeEmployee, calculateTrainingHours, formatPercentage, safeGet } from '../../utils/trainingUtils';

// Stats Cards Component
export const StatsCards = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Total Training Programs Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Total Training Programs
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#3B82F6",
            marginBottom: "8px",
          }}
        >
          {data.totalTrainingPrograms}
        </div>
      </div>

      {/* Employee Coverage Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Employee Coverage
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#8B5CF6",
            marginBottom: "12px",
          }}
        >
          {data.employeeCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Health & Safety: {data.employeeCoverage.healthSafety}({data.employeeCoverage.healthSafetyPercent}%)</div>
          <div>Skill Development: {data.employeeCoverage.skillDevelopment}({data.employeeCoverage.skillDevPercent}%)</div>
        </div>
      </div>

      {/* Worker Coverage Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Worker Coverage
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#F97316",
            marginBottom: "12px",
          }}
        >
          {data.workerCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Health & Safety: {data.workerCoverage.healthSafety}({data.workerCoverage.healthSafetyPercent}%)</div>
          <div>Skill Development: {data.workerCoverage.skillDevelopment}({data.workerCoverage.skillDevPercent}%)</div>
        </div>
      </div>

      {/* Monthly Participants Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Monthly Participants
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#10B981",
            marginBottom: "12px",
          }}
        >
          {data.monthlyParticipants}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Training Hours: {data.totalTrainingHours}</div>
        </div>
      </div>
    </div>
  );
};

export const EmployeesStatsCards = ({ data }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Board of Directors Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Board of Directors (BOD)
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#DC2626",
            marginBottom: "12px",
          }}
        >
          {data.boardOfDirectorsCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.boardOfDirectorsCoverage.male} ({data.boardOfDirectorsCoverage.malePercent}%)</div>
          <div>Female: {data.boardOfDirectorsCoverage.female} ({data.boardOfDirectorsCoverage.femalePercent}%)</div>
        </div>
      </div>

      {/* Key Managerial Personnel Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Key Managerial Personnel (KMP)
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#7C3AED",
            marginBottom: "12px",
          }}
        >
          {data.keyManagerialPersonnelCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.keyManagerialPersonnelCoverage.male} ({data.keyManagerialPersonnelCoverage.malePercent}%)</div>
          <div>Female: {data.keyManagerialPersonnelCoverage.female} ({data.keyManagerialPersonnelCoverage.femalePercent}%)</div>
        </div>
      </div>

      {/* Permanent Employee Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Permanent Employees
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#3B82F6",
            marginBottom: "12px",
          }}
        >
          {data.permanentEmployeeCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.permanentEmployeeCoverage.male} ({data.permanentEmployeeCoverage.malePercent}%)</div>
          <div>Female: {data.permanentEmployeeCoverage.female} ({data.permanentEmployeeCoverage.femalePercent}%)</div>
        </div>
      </div>

      {/* Other than Permanent Employee Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Other than Permanent Employees
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#0891B2",
            marginBottom: "12px",
          }}
        >
          {data.otherThanPermanentEmployeeCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.otherThanPermanentEmployeeCoverage.male} ({data.otherThanPermanentEmployeeCoverage.malePercent}%)</div>
          <div>Female: {data.otherThanPermanentEmployeeCoverage.female} ({data.otherThanPermanentEmployeeCoverage.femalePercent}%)</div>
        </div>
      </div>

      {/* Permanent Workers Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Permanent Workers
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#F97316",
            marginBottom: "12px",
          }}
        >
          {data.permanentWorkersCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.permanentWorkersCoverage.male} ({data.permanentWorkersCoverage.malePercent}%)</div>
          <div>Female: {data.permanentWorkersCoverage.female} ({data.permanentWorkersCoverage.femalePercent}%)</div>
        </div>
      </div>

      {/* Other than Permanent Workers Coverage Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Other than Permanent Workers
        </h3>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#10B981",
            marginBottom: "12px",
          }}
        >
          {data.otherThanPermanentWorkersCoverage.total}
        </div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <div>Male: {data.otherThanPermanentWorkersCoverage.male} ({data.otherThanPermanentWorkersCoverage.malePercent}%)</div>
          <div>Female: {data.otherThanPermanentWorkersCoverage.female} ({data.otherThanPermanentWorkersCoverage.femalePercent}%)</div>
        </div>
      </div>
    </div>
  );
};

export const TrainingCoverageSummary = ({ trainingData, traineeList, financialYear, financialYearId }) => {
  const summaryData = useMemo(() => {
    // Initialize summary structure
    const summary = {
      employees: {
        total: 0,
        healthSafety: new Set(),
        skillDevelopment: new Set(),
        humanRights: new Set()
      },
      workers: {
        total: 0,
        healthSafety: new Set(),
        skillDevelopment: new Set(),
        humanRights: new Set()
      },
      monthlyPerformance: {
        totalPrograms: 0,
        totalParticipants: 0,
        trainingHours: 0,
        currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    };

    // Early return if no data
    if (!traineeList || !Array.isArray(traineeList)) {
      return summary;
    }

    // Count total employees and workers
    traineeList.forEach(trainee => {
      if (!trainee) return;
      
      const category = categorizeEmployee(trainee);
      
      if (category === 'Employees other than BoD and KMPs' || 
          category === 'Board of Directors' || 
          category === 'Key Managerial Personnel') {
        summary.employees.total++;
      } else if (category === 'Workers') {
        summary.workers.total++;
      }
    });

    // Process training data
    if (trainingData && Array.isArray(trainingData)) {
      // Count total programs for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      trainingData.forEach(training => {
        if (!training) return;
        
        const trainingDate = new Date(training.fromDate);
        const attendants = training.attendantUsers || [];
        const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
        
        // Check if training is in current month
        if (trainingDate.getMonth() === currentMonth && trainingDate.getFullYear() === currentYear) {
          summary.monthlyPerformance.totalPrograms++;
          summary.monthlyPerformance.totalParticipants += attendants.length;
          
          // Calculate training hours
          const hours = calculateTrainingHours(training.fromTime, training.toTime);
          summary.monthlyPerformance.trainingHours += hours;
        }
        
        // Process attendants for training categories
        attendants.forEach(attendant => {
          if (!attendant) return;
          
          const employeeCategory = categorizeEmployee(attendant);
          const employeeId = attendant.employeeId;
          
          if (!employeeId) return;

          // Determine if this is employee or worker
          let targetCategory = null;
          if (employeeCategory === 'Employees other than BoD and KMPs' || 
              employeeCategory === 'Board of Directors' || 
              employeeCategory === 'Key Managerial Personnel') {
            targetCategory = 'employees';
          } else if (employeeCategory === 'Workers') {
            targetCategory = 'workers';
          }

          if (!targetCategory) return;

          // Add to training categories based on category ID
          if (trainingCategoryIds.includes(1)) { // Health & Safety
            summary[targetCategory].healthSafety.add(employeeId);
          } 
          
          if (trainingCategoryIds.includes(2)) { // Skill Development/Skill Upgradation
            summary[targetCategory].skillDevelopment.add(employeeId);
          } 

          if (trainingCategoryIds.includes(3)) { // Human Rights
            summary[targetCategory].humanRights.add(employeeId);
          }
        });
      });
    }

    // Convert Sets to counts and percentages
    ['employees', 'workers'].forEach(category => {
      const total = summary[category].total;
      summary[category].healthSafetyCount = summary[category].healthSafety.size;
      summary[category].healthSafetyPercent = total > 0 ? ((summary[category].healthSafety.size / total) * 100).toFixed(2) : '0.00';
      
      summary[category].skillDevelopmentCount = summary[category].skillDevelopment.size;
      summary[category].skillDevelopmentPercent = total > 0 ? ((summary[category].skillDevelopment.size / total) * 100).toFixed(2) : '0.00';
      
      summary[category].humanRightsCount = summary[category].humanRights.size;
      summary[category].humanRightsPercent = total > 0 ? ((summary[category].humanRights.size / total) * 100).toFixed(2) : '0.00';
      
      // Clean up Sets
      delete summary[category].healthSafety;
      delete summary[category].skillDevelopment;
      delete summary[category].humanRights;
    });

    // Round training hours
    summary.monthlyPerformance.trainingHours = Math.round(summary.monthlyPerformance.trainingHours);

    return summary;
  }, [trainingData, traineeList]);

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb"
    }}>
      <h2 style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#374151",
        margin: "0px 0px 15px 0px"
      }}>
        Training Coverage Summary
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "32px"
      }}>
        {/* Employee Training Numbers */}
        <div>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#4b5563",
            marginBottom: "16px",
            margin: "0 0 16px 0"
          }}>
            Employee Training Numbers
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Total Employees:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                {summaryData.employees.total}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Health & Safety Trained:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#3b82f6" }}>
                {summaryData.employees.healthSafetyCount}({summaryData.employees.healthSafetyPercent}%)
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Skill Development Trained:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>
                {summaryData.employees.skillDevelopmentCount}({summaryData.employees.skillDevelopmentPercent}%)
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Human Rights Trained:</span>
              <span style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: summaryData.employees.humanRightsCount > 0 ? "#f59e0b" : "#ef4444" 
              }}>
                {summaryData.employees.humanRightsCount}({summaryData.employees.humanRightsPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Worker Training Numbers */}
        <div>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#4b5563",
            marginBottom: "16px",
            margin: "0 0 16px 0"
          }}>
            Worker Training Numbers
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Total Workers:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                {summaryData.workers.total}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Health & Safety Trained:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#3b82f6" }}>
                {summaryData.workers.healthSafetyCount}({summaryData.workers.healthSafetyPercent}%)
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Skill Development Trained:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>
                {summaryData.workers.skillDevelopmentCount}({summaryData.workers.skillDevelopmentPercent}%)
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Human Rights Trained:</span>
              <span style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: summaryData.workers.humanRightsCount > 0 ? "#f59e0b" : "#ef4444" 
              }}>
                {summaryData.workers.humanRightsCount}({summaryData.workers.humanRightsPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#4b5563",
            marginBottom: "16px",
            margin: "0 0 16px 0"
          }}>
            Monthly Performance ({summaryData.monthlyPerformance.currentMonth.split(' ')[0]} {summaryData.monthlyPerformance.currentMonth.split(' ')[1]})
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Total Programs:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#8b5cf6" }}>
                {summaryData.monthlyPerformance.totalPrograms}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Total Participants:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>
                {summaryData.monthlyPerformance.totalParticipants}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Training Hours:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#3b82f6" }}>
                {summaryData.monthlyPerformance.trainingHours}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0"
            }}>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Location Focus:</span>
              <span style={{ fontSize: "16px", fontWeight: "600", color: "#f59e0b" }}>
                All
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};