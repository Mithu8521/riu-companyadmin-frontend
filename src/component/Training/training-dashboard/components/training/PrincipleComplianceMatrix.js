import React from "react";

const PrincipleComplianceMatrix = ({ 
  mockData,
  title = "Principle Compliance Matrix (P1-P9) - Employee Coverage" 
}) => {
  if (!mockData || !mockData.trainingPrograms || !mockData.principles) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <p style={{
          textAlign: 'center',
          color: '#6B7280'
        }}>No data available</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h4 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        {title}
      </h4>

      <div style={{
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{
                border: '1px solid #D1D5DB',
                padding: '16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                backgroundColor: '#F9FAFB',
                width: '33.333333%'
              }}>
                Principle
              </th>
              {Object.entries(mockData.trainingPrograms).map(([category, program]) => (
                <th key={category} style={{
                  border: '1px solid #D1D5DB',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                  backgroundColor: '#F9FAFB',
                  width: '16.666667%'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>{category}</div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 'normal',
                    color: '#6B7280',
                    marginTop: '4px'
                  }}>
                    Total: {program.totalEmployees}
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <th style={{
                border: '1px solid #D1D5DB',
                padding: '8px',
                backgroundColor: '#F9FAFB'
              }}></th>
              {Object.keys(mockData.trainingPrograms).map((category) => (
                <th key={category} style={{
                  border: '1px solid #D1D5DB',
                  padding: '8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#4B5563',
                  backgroundColor: '#F9FAFB'
                }}>
                  No. Covered | %
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mockData.principles).map(([principleKey, principleDescription]) => (
              <tr key={principleKey} style={{
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
                <td style={{
                  border: '1px solid #D1D5DB',
                  padding: '16px',
                  verticalAlign: 'top'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#2563EB',
                    fontSize: '16px',
                    marginBottom: '4px'
                  }}>{principleKey}</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>{principleDescription}</div>
                </td>
                {Object.entries(mockData.trainingPrograms).map(([category, program]) => {
                  const compliance = program.principleCompliance[principleKey];
                  const isCompliant = compliance.status === "Yes";
                  const totalEmployees = program.totalEmployees;
                  const coverageRaw = (compliance.covered / totalEmployees) * 100;
                  const coveragePercentage = isNaN(coverageRaw) ? 0 : coverageRaw.toFixed(1);                  
                  
                  return (
                    <td key={category} style={{
                      border: '1px solid #D1D5DB',
                      padding: '12px',
                      textAlign: 'center',
                      verticalAlign: 'top'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '12px',
                        borderRadius: '4px',
                        backgroundColor: isCompliant ? '#DCFCE7' : '#FEE2E2'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isCompliant ? '#15803D' : '#DC2626'
                        }}>
                          {compliance.status}
                        </span>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <span style={{
                            color: isCompliant ? '#15803D' : '#DC2626'
                          }}>
                            {compliance.covered}
                          </span>
                          <span style={{
                            color: '#6B7280',
                            margin: '0 4px'
                          }}>|</span>
                          <span style={{
                            color: isCompliant ? '#15803D' : '#DC2626'
                          }}>
                            {compliance.percentage}%
                          </span>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {coveragePercentage}% coverage
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrincipleComplianceMatrix;