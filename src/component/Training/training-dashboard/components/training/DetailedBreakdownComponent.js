import React, { useMemo } from 'react';
import { categorizeEmployee, formatPercentage, safeGet } from '../../utils/trainingUtils';

// Detailed Training Coverage Breakdown Component
export const DetailedTrainingCoverageBreakdown = ({ trainingData, traineeList, financialYear, financialYearId }) => {
  const coverageAnalysis = useMemo(() => {
    // Initialize structure with default values
    const analysis = {
      employees: {
        male: { total: 0, healthSafety: new Set(), skillDevelopment: new Set() },
        female: { total: 0, healthSafety: new Set(), skillDevelopment: new Set() }
      },
      workers: {
        male: { total: 0, healthSafety: new Set(), skillDevelopment: new Set() },
        female: { total: 0, healthSafety: new Set(), skillDevelopment: new Set() }
      }
    };

    // Early return if no data
    if (!traineeList || !Array.isArray(traineeList)) {
      return analysis;
    }

    // Count total employees by category and gender
    traineeList.forEach(trainee => {
      if (!trainee) return;
      
      const category = categorizeEmployee(trainee);
      const gender = trainee.gender?.toLowerCase() || 'unknown';
      
      if (category === 'Employees other than BoD and KMPs' || category === 'Board of Directors' || category === 'Key Managerial Personnel') {
        if (gender === 'male') analysis.employees.male.total++;
        else if (gender === 'female') analysis.employees.female.total++;
      } else if (category === 'Workers') {
        if (gender === 'male') analysis.workers.male.total++;
        else if (gender === 'female') analysis.workers.female.total++;
      }
    });

    // Find training category mappings dynamically
    const trainingCategories = {};
    if (trainingData && Array.isArray(trainingData)) {
      trainingData.forEach(training => {
        (training.categories || []).forEach(category => {
          if (category?.id && category?.title) {
            trainingCategories[category.id] = category.title;
          }
        });
      });
    }

    // Find Health & Safety and Skill Development category IDs dynamically
    const healthSafetyCategoryId = "1";
    
    const skillDevelopmentCategoryId = '2';

    // Process training data to count unique participants
    if (trainingData && Array.isArray(trainingData)) {
      trainingData.forEach(training => {
        if (!training) return;
        
        const attendants = training.attendantUsers || [];
        const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
        
        attendants.forEach(attendant => {
          if (!attendant) return;
          
          const employeeCategory = categorizeEmployee(attendant);
          const gender = attendant.gender?.toLowerCase() || 'unknown';
          const employeeId = attendant.employeeId;
          
          if (!employeeId) return;

          // Determine if this is employee or worker category
          let targetCategory = null;
          if (employeeCategory === 'Employees other than BoD and KMPs' || 
              employeeCategory === 'Board of Directors' || 
              employeeCategory === 'Key Managerial Personnel') {
            targetCategory = 'employees';
          } else if (employeeCategory === 'Workers') {
            targetCategory = 'workers';
          }

          if (!targetCategory) return;

          // Add to appropriate training category based on dynamically found category IDs
          if (trainingCategoryIds.includes(Number(healthSafetyCategoryId))) {
            if (gender === 'male') {
              analysis[targetCategory].male.healthSafety.add(employeeId);
            } else if (gender === 'female') {
              analysis[targetCategory].female.healthSafety.add(employeeId);
            }
          } 
          
          if (trainingCategoryIds.includes(Number(skillDevelopmentCategoryId))) {
            if (gender === 'male') {
              analysis[targetCategory].male.skillDevelopment.add(employeeId);
            } else if (gender === 'female') {
              analysis[targetCategory].female.skillDevelopment.add(employeeId);
            }
          }
        });
      });
    }

    // Convert Sets to counts
    ['employees', 'workers'].forEach(category => {
      ['male', 'female'].forEach(gender => {
        if (analysis[category] && analysis[category][gender]) {
          analysis[category][gender].healthSafetyCount = analysis[category][gender].healthSafety?.size || 0;
          analysis[category][gender].skillDevelopmentCount = analysis[category][gender].skillDevelopment?.size || 0;
          delete analysis[category][gender].healthSafety;
          delete analysis[category][gender].skillDevelopment;
        }
      });
    });

    return analysis;
  }, [trainingData, traineeList]);

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid #D1D5DB"
    }}>
      <h2 style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: "24px",
        margin: 0,
        textAlign: "center"
      }}>
        Detailed Training Coverage Breakdown
      </h2>

      {/* Employees Section */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "12px",
          margin: "0 0 12px 0"
        }}>
          Employees
        </h3>
        
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px"
        }}>
          <thead>
            <tr>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "left",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>Category</th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>Total (A)</th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>
                <div>Health & Safety</div>
                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                  No. (B) | % (B/A)
                </div>
              </th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>
                <div>Skill Development</div>
                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                  No. (C) | % (C/A)
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "500" 
              }}>Male</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                {safeGet(coverageAnalysis, 'employees.male.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'employees.male.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.male.healthSafetyCount'), 
                    safeGet(coverageAnalysis, 'employees.male.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount'), 
                    safeGet(coverageAnalysis, 'employees.male.total')
                  )}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "500" 
              }}>Female</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                {safeGet(coverageAnalysis, 'employees.female.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'employees.female.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.female.healthSafetyCount'), 
                    safeGet(coverageAnalysis, 'employees.female.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount'), 
                    safeGet(coverageAnalysis, 'employees.female.total')
                  )}
                </span>
              </td>
            </tr>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "600" 
              }}>Total</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center", 
                fontWeight: "600" 
              }}>
                {safeGet(coverageAnalysis, 'employees.male.total') + safeGet(coverageAnalysis, 'employees.female.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "600" }}>
                  {safeGet(coverageAnalysis, 'employees.male.healthSafetyCount') + safeGet(coverageAnalysis, 'employees.female.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "600" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.male.healthSafetyCount') + safeGet(coverageAnalysis, 'employees.female.healthSafetyCount'),
                    safeGet(coverageAnalysis, 'employees.male.total') + safeGet(coverageAnalysis, 'employees.female.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "600" }}>
                  {safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "600" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount'),
                    safeGet(coverageAnalysis, 'employees.male.total') + safeGet(coverageAnalysis, 'employees.female.total')
                  )}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Workers Section */}
      <div>
        <h3 style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "12px",
          margin: "0 0 12px 0"
        }}>
          Workers
        </h3>
        
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px"
        }}>
          <thead>
            <tr>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "left",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>Category</th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>Total (A)</th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>
                <div>Health & Safety</div>
                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                  No. (B) | % (B/A)
                </div>
              </th>
              <th style={{
                border: "1px solid #D1D5DB",
                padding: "12px",
                textAlign: "center",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#F9FAFB"
              }}>
                <div>Skill Development</div>
                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                  No. (C) | % (C/A)
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "500" 
              }}>Male</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                {safeGet(coverageAnalysis, 'workers.male.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'workers.male.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.male.healthSafetyCount'), 
                    safeGet(coverageAnalysis, 'workers.male.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount'), 
                    safeGet(coverageAnalysis, 'workers.male.total')
                  )}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "500" 
              }}>Female</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                {safeGet(coverageAnalysis, 'workers.female.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'workers.female.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.female.healthSafetyCount'), 
                    safeGet(coverageAnalysis, 'workers.female.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  {safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "500" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount'), 
                    safeGet(coverageAnalysis, 'workers.female.total')
                  )}
                </span>
              </td>
            </tr>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                fontWeight: "600" 
              }}>Total</td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center", 
                fontWeight: "600" 
              }}>
                {safeGet(coverageAnalysis, 'workers.male.total') + safeGet(coverageAnalysis, 'workers.female.total')}
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#2563EB", fontWeight: "600" }}>
                  {safeGet(coverageAnalysis, 'workers.male.healthSafetyCount') + safeGet(coverageAnalysis, 'workers.female.healthSafetyCount')}
                </span>
                <span style={{ color: "#2563EB", fontWeight: "600" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.male.healthSafetyCount') + safeGet(coverageAnalysis, 'workers.female.healthSafetyCount'),
                    safeGet(coverageAnalysis, 'workers.male.total') + safeGet(coverageAnalysis, 'workers.female.total')
                  )}
                </span>
              </td>
              <td style={{ 
                border: "1px solid #D1D5DB", 
                padding: "12px", 
                textAlign: "center" 
              }}>
                <span style={{ color: "#059669", fontWeight: "600" }}>
                  {safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount')}
                </span>
                <span style={{ color: "#059669", fontWeight: "600" }}>
                  |{formatPercentage(
                    safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount'),
                    safeGet(coverageAnalysis, 'workers.male.total') + safeGet(coverageAnalysis, 'workers.female.total')
                  )}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};