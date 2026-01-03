import React from 'react';

const CompactFrameworkPerformanceGrid = ({ gridData = null, loading = false }) => {
  // Default empty state
  if (!gridData || !gridData.frameworks || gridData.frameworks.length === 0 || 
      !gridData.locations || gridData.locations.length === 0) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "620px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          fontSize: "64px",
          marginBottom: "20px",
          opacity: 0.5
        }}>
          📊
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Performance Data
        </h3>
        <p style={{
          color: "#6B7280",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: "1.5"
        }}>
          Select frameworks and locations to view performance comparison.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "620px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px"
        }}>
          <div style={{
            width: "300px",
            height: "32px",
            background: "#E5E7EB",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite"
          }}></div>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridData?.frameworks?.length || 4}, 1fr)`,
          gap: "24px",
          marginTop: "40px"
        }}>
          {Array.from({ length: gridData?.frameworks?.length || 4 }).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                height: "24px",
                background: "#E5E7EB",
                borderRadius: "6px",
                animation: "pulse 1.5s ease-in-out infinite"
              }}></div>
              {Array.from({ length: gridData?.locations?.length || 2 }).map((_, j) => (
                <div key={j} style={{
                  height: "80px",
                  background: "#F3F4F6",
                  borderRadius: "8px",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}></div>
              ))}
            </div>
          ))}
        </div>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </div>
    );
  }

  const { frameworks, locations, performanceData, changeData } = gridData;

  // Remove duplicate locations - keep unique locations based on name and id
  const uniqueLocations = locations.filter((location, index, self) => {
    if (!location || !location.id || !location.name) return false;
    
    // Find the first occurrence of this location (by name)
    const firstIndex = self.findIndex(loc => 
      loc && loc.name === location.name
    );
    
    // Only keep if this is the first occurrence
    return index === firstIndex;
  });

  const getChangeColor = (change) => {
    if (change > 0) return { background: '#DCFCE7', color: '#166534' }; // Green
    if (change < 0) return { background: '#FEE2E2', color: '#DC2626' }; // Red
    return { background: '#F3F4F6', color: '#6B7280' }; // Gray
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return '#166534'; // Green
    if (performance >= 75) return '#1D4ED8'; // Blue
    if (performance >= 60) return '#D97706'; // Yellow/Orange
    return '#DC2626'; // Red
  };

  return (
    <div style={{
      width: "100%",
      background: "white",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    }}>
      {/* Header - exact match to other charts */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>📊</span>
        <h2 style={{
          color: "#374151",
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "400",
          margin: 0
        }}>
          Framework-wise Performance Comparison
        </h2>
      </div>

      {/* Grid Content */}
      <div style={{
        width: "100%",
        background: "#FAFAFA",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        padding: "20px"
      }}>
        {/* Grid Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${frameworks.length}, 1fr)`,
          gap: "24px"
        }}>
          {frameworks.map((framework) => (
            <div key={framework.id} style={{ textAlign: "center" }}>
              {/* Framework Header */}
              <div style={{
                background: "#F8F9FA",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #E5E7EB"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#374151",
                  margin: 0,
                  fontFamily: "Arial, sans-serif"
                }}>
                  {framework.shortName}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {uniqueLocations.map((location) => {
                  const performance = performanceData[framework.id]?.[location.id] || 0;
                  const change = changeData[framework.id]?.[location.id] || 0;
                  const changeStyle = getChangeColor(change);
                  
                  return (
                    <div 
                      key={location.id}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        padding: "16px",
                        transition: "background-color 0.2s",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#F9FAFB";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#FFFFFF";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "8px"
                      }}>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#6B7280",
                          fontFamily: "Arial, sans-serif"
                        }}>
                          {location.name}:
                        </span>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: getPerformanceColor(performance),
                          fontFamily: "Arial, sans-serif"
                        }}>
                          {performance}%
                        </div>
                        <div style={{
                          ...changeStyle,
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          fontFamily: "Arial, sans-serif"
                        }}>
                          {0}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactFrameworkPerformanceGrid;