import React, { useState, useEffect, useMemo } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { generateTimePeriodOptions, getFrequency, getStartingMonth } from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import FilterSection from "./FilterSection";
import PrincipleComplianceMatrix from "./PrincipleCompliance";

// Enhanced color palette matching the first dashboard
const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
];

const TrainingDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("trainings");
  const [selectedPrinciple, setSelectedPrinciple] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Financial Year state
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(null);
  
  // Training data state
  const [trainingData, setTrainingData] = useState([]);
  const [trainingCategories, setTrainingCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Add trainee list state
  const [traineeList, setTraineeList] = useState([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  
  // Other state variables
  const [frequency, setFrequency] = useState(null);
  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);

  // Helper Functions - Define these FIRST before any useMemo hooks
  const categorizeEmployee = (user) => {
    const category = user.categoryId?.toLowerCase();
    
    // You may need to adjust these mappings based on your actual data
    if (category?.includes('bod') || category?.includes('director')) {
      return 'Board of Directors';
    } else if (category?.includes('kmp') || category?.includes('kmp')) {
      return 'Key Managerial Personnel';
    } else if (category?.includes('permanent employee') || category?.includes('other than permanent employee')) {
      return 'Employees other than BoD and KMPs';
    } else if (category?.includes('permanent worker') || category?.includes('other than permanent worker')) {
      return 'Workers';
    } else {
      // Default categorization - you might want to adjust this
      return 'Employees other than BoD and KMPs';
    }
  };

  const calculateTrainingHours = (fromTime, toTime) => {
    if (!fromTime || !toTime) return 0;
    
    const [fromHour, fromMin] = fromTime.split(':').map(Number);
    const [toHour, toMin] = toTime.split(':').map(Number);
    
    const fromTotalMin = fromHour * 60 + fromMin;
    const toTotalMin = toHour * 60 + toMin;
    
    return Math.max(0, (toTotalMin - fromTotalMin) / 60);
  };

  // Get Financial Year data
  const getFinancialYear = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem("financialYearData");

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFinancialYear(parsedData);
        const lastEntry = parsedData[parsedData.length - 1];
        setFinancialYearId(lastEntry.id);
        return lastEntry.id;
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );

        if (isSuccess) {
          localStorage.setItem("financialYearData", JSON.stringify(data.data));
          setFinancialYear(data.data);
          setFinancialYearId(data.data[data.data.length - 1].id);
          return data.data[data.data.length - 1].id;
        }
      }
    } catch (error) {
      console.error("Error fetching financial year:", error);
      setError("Failed to fetch financial year data");
    }
  };

  // CSS-based Simple Bar Chart Component (Alternative)
  const SimpleBarChart = ({ data, title, dataKey, labelKey, colors = ['#3B82F6'] }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(item => item[dataKey] || 0));

    return (
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        width: "100%"
      }}>
        {title && (
          <h3 style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "24px",
            textAlign: "center"
          }}>
            {title}
          </h3>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((item, index) => {
            const value = item[dataKey] || 0;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const label = item[labelKey] || `Item ${index + 1}`;
            
            return (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  minWidth: '120px',
                  fontSize: '14px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  {label.length > 15 ? label.substring(0, 15) + '...' : label}
                </div>
                
                <div style={{
                  flex: 1,
                  height: '24px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: colors[index % colors.length] || colors[0],
                    borderRadius: '12px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{
                  minWidth: '50px',
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '600',
                  textAlign: 'right'
                }}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Manual Bar Chart Component
  const BarChart = ({ data, chartConfig, title, height = 400, width = 800 }) => {
    const { xAxisKey, bars, colors } = chartConfig;
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) return null;

    const margin = { top: 40, right: 80, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate scale
    const allValues = [];
    data.forEach(item => {
      bars?.forEach(bar => {
        if (typeof item[bar.dataKey] === 'number') {
          allValues.push(item[bar.dataKey]);
        }
      });
    });
    const maxValue = Math.max(...allValues, 0);
    const yScale = (value) => chartHeight - (value / maxValue) * chartHeight;

    return (
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        width: "100%"
      }}>
        {title && (
          <div style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "20px",
            marginBottom: "28px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
              textAlign: "center"
            }}>
              {title}
            </h3>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid lines */}
              {[...Array(6)].map((_, i) => {
                const y = (chartHeight / 5) * i;
                const value = maxValue - (maxValue / 5) * i;
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth={1}
                      strokeDasharray="3,3"
                    />
                    <text
                      x={-10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill="#64748b"
                    >
                      {Math.round(value)}
                    </text>
                  </g>
                );
              })}
              
              {/* Bars */}
              {data.map((item, index) => {
                const x = index * (chartWidth / data.length);
                const groupWidth = chartWidth / data.length;
                const individualBarWidth = (groupWidth / (bars?.length || 1)) - 8;
                
                return bars?.map((bar, barIndex) => {
                  const value = item[bar.dataKey] || 0;
                  const barHeight = chartHeight - yScale(value);
                  const barX = x + (barIndex * (individualBarWidth + 8)) + 8;
                  const barY = yScale(value);
                  
                  return (
                    <rect
                      key={`bar-${index}-${barIndex}`}
                      x={barX}
                      y={barY}
                      width={individualBarWidth}
                      height={barHeight}
                      fill={colors[barIndex] || '#3B82F6'}
                      rx={4}
                      onMouseEnter={(e) => {
                        setHoveredItem({
                          data: item,
                          value: value,
                          label: bar.name,
                          color: colors[barIndex]
                        });
                        const rect = e.target.getBoundingClientRect();
                        setMousePosition({ x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                });
              })}
              
              {/* Axes */}
              <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              
              {/* X-axis labels */}
              {data.map((item, index) => {
                const x = (index + 0.5) * (chartWidth / data.length);
                const label = item[xAxisKey] || '';
                const truncatedLabel = label.length > 12 ? label.substring(0, 12) + '...' : label;
                
                return (
                  <text
                    key={`xlabel-${index}`}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748b"
                    transform={`rotate(-45, ${x}, ${chartHeight + 20})`}
                  >
                    {truncatedLabel}
                  </text>
                );
              })}
              
              {/* Y-axis title */}
              <text
                x={-50}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="14"
                fill="#64748b"
                fontWeight="600"
                transform={`rotate(-90, -50, ${chartHeight / 2})`}
              >
                Count
              </text>
            </g>
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {bars?.map((bar, index) => (
            <div key={`legend-${index}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: colors[index] || '#3B82F6',
                borderRadius: '2px'
              }} />
              <span style={{
                fontSize: '13px',
                color: '#374151',
                fontWeight: '500'
              }}>
                {bar.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Tooltip */}
        {hoveredItem && (
          <div style={{
            position: 'fixed',
            left: mousePosition.x,
            top: mousePosition.y - 60,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontSize: '13px',
            zIndex: 1000,
            pointerEvents: 'none',
            transform: 'translateX(-50%)'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {hoveredItem.data[xAxisKey]}
            </div>
            <div style={{ color: hoveredItem.color }}>
              {hoveredItem.label}: {hoveredItem.value}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Manual Line Chart Component
  const LineChart = ({ data, chartConfig, title, height = 400, width = 800 }) => {
    const { xAxisKey, lines, colors } = chartConfig;
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) return null;

    const margin = { top: 40, right: 80, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate scale
    const allValues = [];
    data.forEach(item => {
      lines?.forEach(line => {
        if (typeof item[line.dataKey] === 'number') {
          allValues.push(item[line.dataKey]);
        }
      });
    });
    const maxValue = Math.max(...allValues, 100);
    const minValue = Math.min(...allValues, 0);
    const valueRange = maxValue - minValue || 1;
    const yScale = (value) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

    return (
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        width: "100%"
      }}>
        {title && (
          <div style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "20px",
            marginBottom: "28px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
              textAlign: "center"
            }}>
              {title}
            </h3>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid lines */}
              {[...Array(6)].map((_, i) => {
                const y = (chartHeight / 5) * i;
                const value = maxValue - (valueRange / 5) * i;
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth={1}
                      strokeDasharray="3,3"
                    />
                    <text
                      x={-10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill="#64748b"
                    >
                      {Math.round(value)}%
                    </text>
                  </g>
                );
              })}
              
              {/* Lines */}
              {lines?.map((line, lineIndex) => {
                const points = data.map((item, index) => {
                  const x = (index * chartWidth) / (data.length - 1);
                  const y = yScale(item[line.dataKey] || 0);
                  return `${x},${y}`;
                }).join(' ');
                
                const dots = data.map((item, index) => {
                  const x = (index * chartWidth) / (data.length - 1);
                  const y = yScale(item[line.dataKey] || 0);
                  const value = item[line.dataKey] || 0;
                  
                  return (
                    <circle
                      key={`dot-${index}-${lineIndex}`}
                      cx={x}
                      cy={y}
                      r={6}
                      fill={colors[lineIndex] || '#8B5CF6'}
                      stroke="#ffffff"
                      strokeWidth={3}
                      onMouseEnter={(e) => {
                        setHoveredItem({
                          data: item,
                          value: value,
                          label: line.name,
                          color: colors[lineIndex]
                        });
                        const rect = e.target.getBoundingClientRect();
                        setMousePosition({ x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                });
                
                return (
                  <g key={`line-${lineIndex}`}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke={colors[lineIndex] || '#8B5CF6'}
                      strokeWidth={4}
                    />
                    {dots}
                  </g>
                );
              })}
              
              {/* Axes */}
              <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              
              {/* X-axis labels */}
              {data.map((item, index) => {
                const x = (index * chartWidth) / (data.length - 1);
                const label = item[xAxisKey] || '';
                const truncatedLabel = label.length > 12 ? label.substring(0, 12) + '...' : label;
                
                return (
                  <text
                    key={`xlabel-${index}`}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748b"
                    transform={`rotate(-45, ${x}, ${chartHeight + 20})`}
                  >
                    {truncatedLabel}
                  </text>
                );
              })}
              
              {/* Y-axis title */}
              <text
                x={-50}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="14"
                fill="#64748b"
                fontWeight="600"
                transform={`rotate(-90, -50, ${chartHeight / 2})`}
              >
                Coverage (%)
              </text>
            </g>
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {lines?.map((line, index) => (
            <div key={`legend-${index}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: colors[index] || '#8B5CF6',
                borderRadius: '50%'
              }} />
              <span style={{
                fontSize: '13px',
                color: '#374151',
                fontWeight: '500'
              }}>
                {line.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Tooltip */}
        {hoveredItem && (
          <div style={{
            position: 'fixed',
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontSize: '13px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {hoveredItem.data[xAxisKey]}
            </div>
            <div style={{ color: hoveredItem.color }}>
              {hoveredItem.label}: {hoveredItem.value}%
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Manual Combo Chart with Dual Axes
  const ComboChart = ({ data, chartConfig, title, height = 400, width = 800 }) => {
    const { xAxisKey, bars, lines, colors } = chartConfig;
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) return null;

    const margin = { top: 40, right: 80, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate scales for bars (left axis)
    const barValues = [];
    data.forEach(item => {
      bars?.forEach(bar => {
        if (typeof item[bar.dataKey] === 'number') {
          barValues.push(item[bar.dataKey]);
        }
      });
    });
    const maxBarValue = Math.max(...barValues, 0);
    const barScale = (value) => chartHeight - (value / maxBarValue) * chartHeight;

    // Calculate scales for lines (right axis)  
    const lineValues = [];
    data.forEach(item => {
      lines?.forEach(line => {
        if (typeof item[line.dataKey] === 'number') {
          lineValues.push(item[line.dataKey]);
        }
      });
    });
    const maxLineValue = Math.max(...lineValues, 0);
    const lineScale = (value) => chartHeight - (value / maxLineValue) * chartHeight;

    // Create dual axis labels
    const createAxes = () => {
      const leftAxisLines = [];
      const rightAxisLines = [];
      const numLines = 5;

      // Left axis (bars)
      for (let i = 0; i <= numLines; i++) {
        const y = (chartHeight / numLines) * i;
        const value = maxBarValue - (maxBarValue / numLines) * i;
        leftAxisLines.push(
          <text
            key={`left-${i}`}
            x={-10}
            y={y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#3B82F6"
            fontWeight="500"
          >
            {Math.round(value)}
          </text>
        );
      }

      // Right axis (lines)
      for (let i = 0; i <= numLines; i++) {
        const y = (chartHeight / numLines) * i;
        const value = maxLineValue - (maxLineValue / numLines) * i;
        rightAxisLines.push(
          <text
            key={`right-${i}`}
            x={chartWidth + 10}
            y={y + 4}
            textAnchor="start"
            fontSize="12"
            fill="#F59E0B"
            fontWeight="500"
          >
            {Math.round(value)}%
          </text>
        );
      }

      return [...leftAxisLines, ...rightAxisLines];
    };

    // Create bars
    const createBars = () => {
      if (!bars) return null;
      
      return data.map((item, index) => {
        const x = index * (chartWidth / data.length);
        const groupWidth = chartWidth / data.length;
        const individualBarWidth = (groupWidth / bars.length) - 5;
        
        return bars.map((bar, barIndex) => {
          const value = item[bar.dataKey] || 0;
          const barHeight = chartHeight - barScale(value);
          const barX = x + (barIndex * (individualBarWidth + 5)) + 5;
          const barY = barScale(value);
          
          return (
            <rect
              key={`bar-${index}-${barIndex}`}
              x={barX}
              y={barY}
              width={individualBarWidth}
              height={barHeight}
              fill={colors[barIndex] || '#3B82F6'}
              rx={4}
              onMouseEnter={(e) => {
                setHoveredItem({
                  type: 'bar',
                  data: item,
                  value: value,
                  label: bar.name,
                  color: colors[barIndex]
                });
                const rect = e.target.getBoundingClientRect();
                setMousePosition({ x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        });
      });
    };

    // Create lines  
    const createLines = () => {
      if (!lines) return null;
      
      return lines.map((line, lineIndex) => {
        const points = data.map((item, index) => {
          const x = (index + 0.5) * (chartWidth / data.length);
          const y = lineScale(item[line.dataKey] || 0);
          return `${x},${y}`;
        }).join(' ');
        
        const dots = data.map((item, index) => {
          const x = (index + 0.5) * (chartWidth / data.length);
          const y = lineScale(item[line.dataKey] || 0);
          const value = item[line.dataKey] || 0;
          
          return (
            <circle
              key={`dot-${index}-${lineIndex}`}
              cx={x}
              cy={y}
              r={6}
              fill={colors[bars?.length + lineIndex] || '#F59E0B'}
              stroke="#ffffff"
              strokeWidth={3}
              onMouseEnter={(e) => {
                setHoveredItem({
                  type: 'line',
                  data: item,
                  value: value,
                  label: line.name,
                  color: colors[bars?.length + lineIndex]
                });
                const rect = e.target.getBoundingClientRect();
                setMousePosition({ x: rect.left, y: rect.top });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        });
        
        return (
          <g key={`line-${lineIndex}`}>
            <polyline
              points={points}
              fill="none"
              stroke={colors[bars?.length + lineIndex] || '#F59E0B'}
              strokeWidth={4}
            />
            {dots}
          </g>
        );
      });
    };

    return (
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        width: "100%"
      }}>
        {title && (
          <div style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "20px",
            marginBottom: "28px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
              textAlign: "center"
            }}>
              {title}
            </h3>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid lines */}
              {[...Array(6)].map((_, i) => {
                const y = (chartHeight / 5) * i;
                return (
                  <line
                    key={`grid-${i}`}
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                );
              })}
              
              {/* Bars and lines */}
              {createBars()}
              {createLines()}
              
              {/* Axes */}
              <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              <line x1={chartWidth} y1={0} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth={2} />
              
              {/* Axis labels */}
              {createAxes()}
              
              {/* X-axis labels */}
              {data.map((item, index) => {
                const x = (index + 0.5) * (chartWidth / data.length);
                const label = item[xAxisKey] || '';
                const truncatedLabel = label.length > 12 ? label.substring(0, 12) + '...' : label;
                
                return (
                  <text
                    key={`xlabel-${index}`}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748b"
                    transform={`rotate(-45, ${x}, ${chartHeight + 20})`}
                  >
                    {truncatedLabel}
                  </text>
                );
              })}
              
              {/* Axis titles */}
              <text
                x={-50}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="14"
                fill="#3B82F6"
                fontWeight="600"
                transform={`rotate(-90, -50, ${chartHeight / 2})`}
              >
                Count
              </text>
              
              <text
                x={chartWidth + 50}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="14"
                fill="#F59E0B"
                fontWeight="600"
                transform={`rotate(90, ${chartWidth + 50}, ${chartHeight / 2})`}
              >
                Completion Rate (%)
              </text>
            </g>
          </svg>
        </div>
        
        {/* Tooltip */}
        {hoveredItem && (
          <div style={{
            position: 'fixed',
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontSize: '13px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {hoveredItem.data[xAxisKey]}
            </div>
            <div style={{ color: hoveredItem.color }}>
              {hoveredItem.label}: {hoveredItem.value}
              {hoveredItem.type === 'line' ? '%' : ''}
            </div>
          </div>
        )}
      </div>
    );
  };
  const ManualChart = ({ 
    data, 
    chartConfig, 
    title, 
    height = 400,
    width = 800 
  }) => {
    const { type, xAxisKey, bars, lines, colors } = chartConfig;
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle empty data
    if (!data || data.length === 0) {
      return (
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f3f4f6",
          minHeight: height + 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          {title && (
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "24px",
              margin: "0 0 24px 0",
              textAlign: "center",
              letterSpacing: "-0.025em"
            }}>
              {title}
            </h3>
          )}
          <div style={{
            textAlign: "center",
            color: "#6b7280"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#f3f4f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <span style={{ fontSize: "24px", color: "#9ca3af" }}>📊</span>
            </div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>No data available</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#9ca3af" }}>
              Chart will appear when data is loaded
            </p>
          </div>
        </div>
      );
    }

    // Chart dimensions and margins
    const margin = { top: 40, right: 80, bottom: 120, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate scales and data ranges
    const getAllValues = () => {
      const allValues = [];
      data.forEach(item => {
        bars?.forEach(bar => {
          if (typeof item[bar.dataKey] === 'number') {
            allValues.push(item[bar.dataKey]);
          }
        });
        lines?.forEach(line => {
          if (typeof item[line.dataKey] === 'number') {
            allValues.push(item[line.dataKey]);
          }
        });
      });
      return allValues;
    };

    const allValues = getAllValues();
    const maxValue = Math.max(...allValues, 0);
    const minValue = Math.min(...allValues, 0);
    const valueRange = maxValue - minValue || 1;

    // Scale functions
    const xScale = (index) => (index * chartWidth) / Math.max(data.length - 1, 1);
    const yScale = (value) => chartHeight - ((value - minValue) / valueRange) * chartHeight;
    const barWidth = Math.max(chartWidth / data.length - 10, 20);

    // Create grid lines
    const createGridLines = () => {
      const lines = [];
      const numLines = 5;
      for (let i = 0; i <= numLines; i++) {
        const y = (chartHeight / numLines) * i;
        const value = maxValue - (valueRange / numLines) * i;
        lines.push(
          <g key={`grid-${i}`}>
            <line
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <text
              x={-10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#64748b"
            >
              {Math.round(value)}
            </text>
          </g>
        );
      }
      return lines;
    };

    // Create X-axis labels
    const createXAxisLabels = () => {
      return data.map((item, index) => {
        const x = (index + 0.5) * (chartWidth / data.length);
        const label = item[xAxisKey] || '';
        const truncatedLabel = label.length > 15 ? label.substring(0, 15) + '...' : label;
        
        return (
          <text
            key={`xlabel-${index}`}
            x={x}
            y={chartHeight + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#64748b"
            transform={`rotate(-45, ${x}, ${chartHeight + 20})`}
          >
            {truncatedLabel}
          </text>
        );
      });
    };

    // Create bars
    const createBars = () => {
      if (!bars) return null;
      
      return data.map((item, index) => {
        const x = index * (chartWidth / data.length);
        const groupWidth = chartWidth / data.length;
        const individualBarWidth = groupWidth / bars.length - 5;
        
        return bars.map((bar, barIndex) => {
          const value = item[bar.dataKey] || 0;
          const barHeight = Math.abs(yScale(value) - yScale(0));
          const barX = x + (barIndex * (individualBarWidth + 5)) + 5;
          const barY = value >= 0 ? yScale(value) : yScale(0);
          
          return (
            <rect
              key={`bar-${index}-${barIndex}`}
              x={barX}
              y={barY}
              width={individualBarWidth}
              height={barHeight}
              fill={colors[barIndex] || '#3B82F6'}
              rx={4}
              onMouseEnter={(e) => {
                setHoveredItem({
                  type: 'bar',
                  data: item,
                  value: value,
                  label: bar.name,
                  color: colors[barIndex]
                });
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        });
      });
    };

    // Create lines
    const createLines = () => {
      if (!lines) return null;
      
      return lines.map((line, lineIndex) => {
        const points = data.map((item, index) => {
          const x = (index + 0.5) * (chartWidth / data.length);
          const y = yScale(item[line.dataKey] || 0);
          return `${x},${y}`;
        }).join(' ');
        
        const dots = data.map((item, index) => {
          const x = (index + 0.5) * (chartWidth / data.length);
          const y = yScale(item[line.dataKey] || 0);
          const value = item[line.dataKey] || 0;
          
          return (
            <circle
              key={`dot-${index}-${lineIndex}`}
              cx={x}
              cy={y}
              r={5}
              fill={colors[bars?.length + lineIndex] || '#F59E0B'}
              stroke="#ffffff"
              strokeWidth={2}
              onMouseEnter={(e) => {
                setHoveredItem({
                  type: 'line',
                  data: item,
                  value: value,
                  label: line.name,
                  color: colors[bars?.length + lineIndex]
                });
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        });
        
        return (
          <g key={`line-${lineIndex}`}>
            <polyline
              points={points}
              fill="none"
              stroke={colors[bars?.length + lineIndex] || '#F59E0B'}
              strokeWidth={3}
            />
            {dots}
          </g>
        );
      });
    };

    // Create legend
    const createLegend = () => {
      const legendItems = [];
      
      bars?.forEach((bar, index) => {
        legendItems.push({
          name: bar.name,
          color: colors[index] || '#3B82F6',
          type: 'bar'
        });
      });
      
      lines?.forEach((line, index) => {
        legendItems.push({
          name: line.name,
          color: colors[bars?.length + index] || '#F59E0B',
          type: 'line'
        });
      });
      
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          {legendItems.map((item, index) => (
            <div key={`legend-${index}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: item.color,
                borderRadius: item.type === 'line' ? '50%' : '2px'
              }} />
              <span style={{
                fontSize: '13px',
                color: '#374151',
                fontWeight: '500'
              }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      );
    };

    // Tooltip component
    const renderTooltip = () => {
      if (!hoveredItem) return null;
      
      return (
        <div style={{
          position: 'fixed',
          left: mousePosition.x + 10,
          top: mousePosition.y - 10,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          fontSize: '13px',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {hoveredItem.data[xAxisKey]}
          </div>
          <div style={{ color: hoveredItem.color }}>
            {hoveredItem.label}: {hoveredItem.value}
          </div>
        </div>
      );
    };

    return (
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #f3f4f6",
        width: "100%"
      }}>
        {title && (
          <div style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "20px",
            marginBottom: "28px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
              textAlign: "center",
              letterSpacing: "-0.025em"
            }}>
              {title}
            </h3>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg
            width={width}
            height={height}
            style={{ overflow: 'visible' }}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid lines */}
              {createGridLines()}
              
              {/* Chart content */}
              {type === 'bar' && createBars()}
              {type === 'line' && createLines()}
              {type === 'combo' && (
                <>
                  {createBars()}
                  {createLines()}
                </>
              )}
              
              {/* X-axis */}
              <line
                x1={0}
                y1={chartHeight}
                x2={chartWidth}
                y2={chartHeight}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              
              {/* Y-axis */}
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={chartHeight}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              
              {/* X-axis labels */}
              {createXAxisLabels()}
            </g>
          </svg>
        </div>
        
        {/* Legend */}
        {createLegend()}
        
        {/* Tooltip */}
        {renderTooltip()}
      </div>
    );
  };

  // Data processing hooks for charts - ALL DYNAMIC, NO HARDCODED VALUES
  const useLocationTrainingData = useMemo(() => {
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
  

  const useYearOverYearData = useMemo(() => {
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
    const categories = [...new Set(trainingData.flatMap(t => (t.categories || []).map(category?.title)).filter(Boolean))];
    
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
      const trainingCategories = (training.categories || []);
      
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

  const useGenderDistributionData = useMemo(() => {
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

  const useHumanRightsProgressData = useMemo(() => {
    if (!trainingData.length || !traineeList.length || !financialYear.length) return [];

    // Get all employee categories dynamically
    const employeeCategories = [...new Set(traineeList.map(t => categorizeEmployee(t)))];
    
    // Get fiscal years dynamically and ensure they're valid
    const fiscalYears = financialYear.map(fy => {
      const fromDate = new Date(fy.fromDate);
      const toDate = new Date(fy.toDate);
      
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return null;
      
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      return {
        id: fy.id,
        label: `FY ${fromYear}-${toYear.toString().slice(-2)}`,
        fromDate,
        toDate
      };
    }).filter(Boolean).sort((a, b) => a.fromDate - b.fromDate);

    if (fiscalYears.length === 0) return [];

    // Find Human Rights principle dynamically
    let humanRightsPrincipleId = null;
    if (trainingData.length > 0 && trainingData[0].allPrinciples) {
      const humanRightsPrinciple = trainingData[0].allPrinciples.find(p => 
        p.title?.toLowerCase().includes('human rights') ||
        p.title?.toLowerCase().includes('principle 5')
      );
      humanRightsPrincipleId = humanRightsPrinciple?.id;
    }

    if (!humanRightsPrincipleId) return [];

    return employeeCategories.map(category => {
      const result = { 
        category: category.length > 15 ? category.substring(0, 15) + '...' : category 
      };
      
      fiscalYears.forEach(fy => {
        // Get trainees in this category
        const categoryTrainees = traineeList.filter(trainee => categorizeEmployee(trainee) === category);
        
        // Get unique trained employees for this fiscal year
        const trainedEmployees = new Set();
        
        trainingData.forEach(training => {
          const trainingDate = new Date(training.fromDate);
          if (isNaN(trainingDate.getTime())) return;
          
          const isInFiscalYear = trainingDate >= fy.fromDate && trainingDate <= fy.toDate;
          const hasHumanRightsPrinciple = training.principles?.some(p => p.id === humanRightsPrincipleId);
          
          if (isInFiscalYear && hasHumanRightsPrinciple) {
            training.attendantUsers?.forEach(attendant => {
              if (categorizeEmployee(attendant) === category) {
                const employeeId = attendant.id || attendant.employeeId;
                if (employeeId) {
                  trainedEmployees.add(employeeId);
                }
              }
            });
          }
        });
        
        const coverage = categoryTrainees.length > 0 ? 
          (trainedEmployees.size / categoryTrainees.length) * 100 : 0;
        
        result[fy.label] = Math.round(coverage * 100) / 100;
      });
      
      return result;
    }).filter(item => {
      // Only include categories that have some coverage in any fiscal year
      return fiscalYears.some(fy => item[fy.label] > 0);
    });
  }, [trainingData, traineeList, financialYear]);

  // Dynamic chart configurations based on actual data
  const getDynamicChartConfigs = useMemo(() => {
    // Get unique fiscal years for labels and ensure they're valid
    const fiscalYearLabels = financialYear.map(fy => {
      const fromDate = new Date(fy.fromDate);
      const toDate = new Date(fy.toDate);
      
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return null;
      
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      return `FY ${fromYear}-${toYear.toString().slice(-2)}`;
    }).filter(Boolean).sort();

    // Get unique genders
    const genders = [...new Set(traineeList.map(t => t.gender).filter(Boolean))];

    return {
      locationPerformance: {
        type: 'combo',
        xAxisKey: 'name',
        yAxisLeft: { label: 'Count' },
        yAxisRight: { label: 'Completion Rate (%)' },
        bars: [
          { dataKey: 'totalPrograms', name: 'Total Programs', yAxisId: 'left' },
          { dataKey: 'totalParticipants', name: 'Total Participants', yAxisId: 'left' }
        ],
        lines: [
          { dataKey: 'completionRate', name: 'Completion Rate', yAxisId: 'right' }
        ],
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      },

      yearOverYear: {
        type: 'bar',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Number of Employees' },
        bars: fiscalYearLabels.map(label => ({
          dataKey: label,
          name: label
        })),
        colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'].slice(0, fiscalYearLabels.length)
      },

      genderDistribution: {
        type: 'bar',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Number of People' },
        bars: genders.map(gender => ({
          dataKey: gender,
          name: gender
        })),
        colors: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'].slice(0, genders.length)
      },

      humanRightsProgress: {
        type: 'line',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Coverage (%)' },
        lines: fiscalYearLabels.map(label => ({
          dataKey: label,
          name: label
        })),
        colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'].slice(0, fiscalYearLabels.length)
      }
    };
  }, [financialYear, traineeList]);

  // Training Charts Section Component with Professional Layout
  const TrainingChartsSection = () => {
    const dynamicConfigs = getDynamicChartConfigs;
    
    // Check if we have enough data to show charts
    const hasLocationData = useLocationTrainingData.length > 0;
    const hasYearOverYearData = useYearOverYearData.length > 0;
    const hasGenderData = useGenderDistributionData.length > 0;
    const hasHumanRightsData = useHumanRightsProgressData.length > 0;
    
    if (!hasLocationData && !hasYearOverYearData && !hasGenderData && !hasHumanRightsData) {
      return (
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "48px",
          marginBottom: "32px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f3f4f6",
          textAlign: "center"
        }}>
          <div style={{
            width: "96px",
            height: "96px",
            backgroundColor: "#f3f4f6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px"
          }}>
            <span style={{ fontSize: "40px", color: "#9ca3af" }}>📈</span>
          </div>
          <h3 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#374151",
            margin: "0 0 12px 0",
            letterSpacing: "-0.025em"
          }}>
            Training Analytics Dashboard
          </h3>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            marginTop: "12px",
            maxWidth: "500px",
            margin: "12px auto 0"
          }}>
            Charts will appear here once you have training data and participants. Start by adding training programs and enrolling participants.
          </p>
        </div>
      );
    }
    
    return (
      <div style={{
        marginBottom: "32px"
      }}>
        {/* Section Header */}
        <div style={{
          marginBottom: "32px",
          textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#1f2937",
            margin: "0 0 8px 0",
            letterSpacing: "-0.025em"
          }}>
            Training Analytics
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            margin: 0
          }}>
            Comprehensive insights into your training programs and participant engagement
          </p>
        </div>

        {/* Charts Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', 
          gap: '32px',
          gridTemplateRows: 'auto'
        }}>
          {hasLocationData && (
            <ComboChart
              data={useLocationTrainingData}
              chartConfig={dynamicConfigs.locationPerformance}
              title="Training Performance by Location"
              height={380}
              width={750}
            />
          )}
          
          {hasYearOverYearData && (
            <BarChart
              data={useYearOverYearData}
              chartConfig={dynamicConfigs.yearOverYear}
              title="Year-over-Year Training Progress"
              height={380}
              width={750}
            />
          )}
          
          {hasGenderData && (
            <BarChart
              data={useGenderDistributionData}
              chartConfig={dynamicConfigs.genderDistribution}
              title={`Gender Distribution (${getCurrentFinancialYearLabel()})`}
              height={380}
              width={750}
            />
          )}
          
          {hasHumanRightsData && (
            <LineChart
              data={useHumanRightsProgressData}
              chartConfig={dynamicConfigs.humanRightsProgress}
              title="Human Rights Training Progress"
              height={380}
              width={750}
            />
          )}
        </div>

        {/* Show info cards for missing data instead of placeholder charts */}
        {(!hasLocationData || !hasYearOverYearData || !hasGenderData || !hasHumanRightsData) && (
          <div style={{
            marginTop: "32px",
            padding: "24px",
            backgroundColor: "#fef3c7",
            border: "1px solid #fcd34d",
            borderRadius: "12px"
          }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#92400e",
              margin: "0 0 8px 0"
            }}>
              ℹ️ Some charts are not available
            </h4>
            <p style={{
              fontSize: "14px",
              color: "#b45309",
              margin: 0,
              lineHeight: "1.5"
            }}>
              {!hasLocationData && "• Location data is missing - add location information to training programs\n"}
              {!hasYearOverYearData && "• Historical data is insufficient - need data from multiple fiscal years\n"}
              {!hasGenderData && "• Gender information is missing from participant profiles\n"}
              {!hasHumanRightsData && "• Human rights training data is not available\n"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Helper function to get current financial year label dynamically
  const getCurrentFinancialYearLabel = () => {
    const currentFY = financialYear.find(fy => fy.id === financialYearId);
    if (currentFY) {
      const fromDate = new Date(currentFY.fromDate);
      const toDate = new Date(currentFY.toDate);
      
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        const fromYear = fromDate.getFullYear();
        const toYear = toDate.getFullYear();
        return `FY ${fromYear}-${toYear.toString().slice(-2)}`;
      }
    }
    return 'Current FY';
  };

    const getFinancialYearRange = (fId, financialYearList) => {
      const yearId = fId ;
      const startMonthIdx = getStartingMonth() - 1;
    
      // Find matching year object
      const finYearObj = Array.isArray(financialYearList)
        ? financialYearList.find((fy) => fy.id == yearId)
        : null;
    
      if (!finYearObj?.financial_year_value) {
        console.warn("⚠️ Financial year not found for id:", yearId);
        return; // stop here, don’t set NaN dates
      }
    
      const [startY, endY] = finYearObj.financial_year_value.split("-").map(Number);
    
      if (isNaN(startY) || isNaN(endY)) {
        console.error("⚠️ Invalid financial year value:", finYearObj.financial_year_value);
        return;
      }
    
      // startMonthIdx is 0-based (0 = Jan, 11 = Dec)
      const startMonth = startMonthIdx;
      const endMonth = (startMonth + 11) % 12;
    
      const fromDate = new Date(startY, startMonth, 1);
      const toDate = new Date(endY, endMonth + 1, 0);
    
      const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };
    
      return {
        startDate: formatDate(fromDate),
        endDate: formatDate(toDate),
      };
    };

  // Get all training data
  const getTrainingData = async (fId, status = 1) => {
    const yearId = fId || financialYearId;
    if (!yearId) return;
    const financialYearDatas = await getFinancialYearRange(yearId, financialYear);


    setLoading(true);
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAllTrainingDataForFilter`,
        {},
        { financialYearId: yearId, status,financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate },
        "GET"
      );

      if (isSuccess && data?.data) {
        const tmpData = data.data.length ? data.data.reverse() : [];
        setTrainingData(tmpData);

        // Format training data
        const formattedTrainingData = tmpData.map((item) => ({
          item,
          id: item.id,
          fromDate: new Date(item.fromDate).toLocaleDateString(),
          toDate: new Date(item.toDate).toLocaleDateString(),
          fromTime: item.fromTime,
          toTime: item.toTime,
          trainer: item?.trainers,
          title: item.trainingTitle,
          mode: item.modeOfTraining,
          mappingUser: item.userId,
          description: item.description,
          trainingFacilitator: item.trainingFacilitator,
          status: item.status || "Active",
          totalParticipants: item.totalParticipants || 0,
          completedParticipants: item.completedParticipants || 0,
          rawFromDate: item.fromDate,
          rawToDate: item.toDate,
          Category: item.Category,
          acceptedUsers: item.acceptedUsers,
          attendantUsers: item.attendantUsers,
          counts: item.counts,
          trainers: item.trainers,
        }));
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllRegisteredTrainee = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAllRegisteredTrainee`,
      {},
      {},
      "GET"
    );

    if (isSuccess) {
      setTraineeList(data?.data || []);
    }
  };

  const getTrainingCategories = async () => {
    setLoadingCategories(true);
    try {
      const apiUrl = `${config.POSTLOGIN_API_URL_COMPANY}getTrainingCategory`;
      const { isSuccess, data } = await apiCall(apiUrl, {}, {}, "GET");

      if (isSuccess && data?.data) {
        setTrainingCategories(data.data);
      } else {
        setTrainingCategories([]);
      }
    } catch (error) {
      console.error("Error fetching training categories:", error);
      setTrainingCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Get frequency data
  const fetchFrequency = async (financialYearId) => {
    try {
      const frequencyData = await getFrequency(financialYearId);
      if (frequencyData) {
        setFrequency(frequencyData);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  };

  // Get locations/sources
  const getSource = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      const yearId = await getFinancialYear();
      await getTrainingCategories();
      await getAllRegisteredTrainee();
      await getSource();
      if (yearId) {
        fetchFrequency(yearId); 
      }
    };

    initializeData();
  }, []);

  // Load training data when financial year changes
  useEffect(() => {
    if (financialYearId) {
      getTrainingData(financialYearId,financialYear);
      fetchFrequency(financialYearId);
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

  // Function to generate dynamic training compliance data
  const generateTrainingComplianceData = useMemo(() => {
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
      'Board of Directors',
      'Key Managerial Personnel', 
      'Employees other than BoD and KMPs',
      'Workers'
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
          uniqueEmployees: new Set() // Track unique employee IDs
        };
      });
    });

    // Process training data to calculate compliance with unique employee tracking
    trainingData.forEach(training => {
      const attendants = training.attendantUsers || [];
      const trainingPrinciples = training.principles || [];
      
      attendants.forEach(attendant => {
        const category = categorizeEmployee(attendant);
        const employeeId = attendant.id || attendant.employeeId;
        
        if (trainingPrograms[category] && employeeId) {
          trainingPrinciples.forEach(principle => {
            // Find the principle index (P1, P2, etc.)
            const principleIndex = training.allPrinciples?.findIndex(p => p.id === principle.id);
            if (principleIndex !== -1) {
              const principleKey = `P${principleIndex + 1}`;
              
              if (trainingPrograms[category].principleCompliance[principleKey]) {
                // Add unique employee ID to the Set
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
        
        // Set covered count to the size of unique employees Set
        compliance.covered = compliance.uniqueEmployees.size;
        
        // Calculate percentage based on unique employees
        compliance.percentage = totalEmployees > 0 ? 
          Math.round((compliance.covered / totalEmployees) * 100 * 100) / 100 : 0;
        
        // Remove the Set from final data (not needed in the UI)
        delete compliance.uniqueEmployees;
      });
    });

    return {
      principles: principlesMap,
      trainingPrograms
    };
  }, [trainingData, traineeList]);

  // Process data based on filters
  const processedData = useMemo(() => {
    let filteredData = [...trainingData];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter(item =>
        (item.categories ?? []).some(cat =>
          selectedCategories.includes(cat?.title?.toLowerCase())
        )
      );
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedLocations.includes(item.location?.toLowerCase())
      );
    }

    // Calculate stats
    const totalTrainingPrograms = filteredData.length;
    
    // Calculate total training hours
    const totalTrainingHours = filteredData.reduce((total, item) => {
      const hours = calculateTrainingHours(item.fromTime, item.toTime);
      return total + hours;
    }, 0);

    // Find training category mappings dynamically
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

    // Find Health & Safety and Skill Development category IDs dynamically
    const healthSafetyCategoryId = Object.keys(trainingCategories).find(id => 
      trainingCategories[id]?.toLowerCase().includes('health') && 
      trainingCategories[id]?.toLowerCase().includes('safety')
    );
    
    const skillDevelopmentCategoryId = Object.keys(trainingCategories).find(id => 
      trainingCategories[id]?.toLowerCase().includes('skill') && 
      (trainingCategories[id]?.toLowerCase().includes('development') || 
       trainingCategories[id]?.toLowerCase().includes('upgradation'))
    );

    // Calculate employee and worker coverage
    let employeeStats = { total: 0, healthSafety: 0, skillDevelopment: 0 };
    let workerStats = { total: 0, healthSafety: 0, skillDevelopment: 0 };
    let monthlyParticipants = 0;

    filteredData.forEach(item => {
      const attendants = item.attendantUsers || [];
      const trainingHours = calculateTrainingHours(item.fromTime, item.toTime);
      
      attendants.forEach(user => {
        monthlyParticipants += 1;
        
        const userCategory = categorizeEmployee(user);
        const trainingCategoryIds = (item.categories || []).map(category => category?.id).filter(Boolean);
        
        // Check if user is employee or worker
        if (userCategory === 'Employees other than BoD and KMPs' || 
            userCategory === 'Board of Directors' || 
            userCategory === 'Key Managerial Personnel') {
          employeeStats.total += 1;
          if (trainingCategoryIds.includes(Number(healthSafetyCategoryId))) {
            employeeStats.healthSafety += 1;
          }
          
          if (trainingCategoryIds.includes(Number(skillDevelopmentCategoryId))) {
            employeeStats.skillDevelopment += 1;
          }
        } else if (userCategory === 'Workers') {
          workerStats.total += 1;
          if (trainingCategoryIds.includes(Number(healthSafetyCategoryId))) {
            workerStats.healthSafety += 1;
          } 
          
          if (trainingCategoryIds.includes(Number(skillDevelopmentCategoryId))) {
            workerStats.skillDevelopment += 1;
          }
        }
      });
    });

    // Calculate percentages
    const employeeHealthSafetyPercent = employeeStats.total > 0 ? 
      ((employeeStats.healthSafety / employeeStats.total) * 100).toFixed(2) : "0.00";
    const employeeSkillDevPercent = employeeStats.total > 0 ? 
      ((employeeStats.skillDevelopment / employeeStats.total) * 100).toFixed(2) : "0.00";
    
    const workerHealthSafetyPercent = workerStats.total > 0 ? 
      ((workerStats.healthSafety / workerStats.total) * 100).toFixed(2) : "0.00";
    const workerSkillDevPercent = workerStats.total > 0 ? 
      ((workerStats.skillDevelopment / workerStats.total) * 100).toFixed(2) : "0.00";

    const stats = {
      totalTrainingPrograms,
      employeeCoverage: {
        total: employeeStats.total,
        healthSafety: employeeStats.healthSafety,
        healthSafetyPercent: employeeHealthSafetyPercent,
        skillDevelopment: employeeStats.skillDevelopment,
        skillDevPercent: employeeSkillDevPercent
      },
      workerCoverage: {
        total: workerStats.total,
        healthSafety: workerStats.healthSafety,
        healthSafetyPercent: workerHealthSafetyPercent,
        skillDevelopment: workerStats.skillDevelopment,
        skillDevPercent: workerSkillDevPercent
      },
      monthlyParticipants,
      totalTrainingHours: Math.round(totalTrainingHours)
    };

    return { filteredData, stats };
  }, [trainingData, selectedCategories, selectedLocations]);

  // Prepare filter options
  const categoryOptions = trainingCategories.map(cat => ({
    value: cat.id || cat?.title?.toLowerCase(),
    label: cat.title
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
    setFinancialYearId(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPeriods([]);
    setSelectedLocations([]);
  };

  // Training Coverage Summary Component
  const TrainingCoverageSummary = ({ trainingData, traineeList, financialYear }) => {
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
          const trainingPrinciples = training.principles || [];
          
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
            const employeeId = attendant.id || attendant.employeeId;
            
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

            // Check for Human Rights training (Principle 5)
            trainingPrinciples.forEach(principle => {
              if (principle.id === 5) { // Human Rights principle
                summary[targetCategory].humanRights.add(employeeId);
              }
            });
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

    const currentFinancialYear = financialYear?.find(fy => fy.id === financialYearId);
    const yearDisplay = currentFinancialYear ? 
      `FY ${new Date(currentFinancialYear.fromDate).getFullYear()}-${new Date(currentFinancialYear.toDate).getFullYear().toString().slice(-2)}` : 
      'Current FY';

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
          marginBottom: "24px",
          margin: 0
        }}>
          Training Coverage Summary ({yearDisplay} • {summaryData.monthlyPerformance.currentMonth} • All)
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

  // Detailed Training Coverage Breakdown Component
  const DetailedTrainingCoverageBreakdown = ({ trainingData, traineeList, financialYear }) => {
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
      const healthSafetyCategoryId = Object.keys(trainingCategories).find(id => 
        trainingCategories[id]?.toLowerCase().includes('health') && 
        trainingCategories[id]?.toLowerCase().includes('safety')
      );
      
      const skillDevelopmentCategoryId = Object.keys(trainingCategories).find(id => 
        trainingCategories[id]?.toLowerCase().includes('skill') && 
        (trainingCategories[id]?.toLowerCase().includes('development') || 
         trainingCategories[id]?.toLowerCase().includes('upgradation'))
      );

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
            const employeeId = attendant.id || attendant.employeeId;
            
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

    const formatPercentage = (count, total) => {
      if (!total || total === 0) return '0%';
      return `${((count / total) * 100).toFixed(2)}%`;
    };

    const currentFinancialYear = financialYear?.find(fy => fy.id === financialYearId);
    const yearDisplay = currentFinancialYear ? 
      `FY ${new Date(currentFinancialYear.fromDate).getFullYear()}-${new Date(currentFinancialYear.toDate).getFullYear().toString().slice(-2)}` : 
      'Current FY';

    // Add safety checks for accessing nested properties
    const safeGet = (obj, path, defaultValue = 0) => {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : defaultValue;
      }, obj);
    };

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
          marginBottom: "24px",
          margin: 0
        }}>
          Detailed Training Coverage Breakdown ({yearDisplay})
        </h2>

        {/* Employees Section */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#4b5563",
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
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Category</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Total (A)</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Health & Safety<br/>No. (B) | % (B/A)</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Skill Development<br/>No. (C) | % (C/A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", fontWeight: "500" }}>Male</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'employees.male.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'employees.male.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'employees.male.healthSafetyCount'), 
                      safeGet(coverageAnalysis, 'employees.male.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount'), 
                      safeGet(coverageAnalysis, 'employees.male.total')
                    )}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", fontWeight: "500" }}>Female</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'employees.female.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'employees.female.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'employees.female.healthSafetyCount'), 
                      safeGet(coverageAnalysis, 'employees.female.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount'), 
                      safeGet(coverageAnalysis, 'employees.female.total')
                    )}
                  </span>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Total</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'employees.male.total') + safeGet(coverageAnalysis, 'employees.female.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6" }}>
                    {safeGet(coverageAnalysis, 'employees.male.healthSafetyCount') + safeGet(coverageAnalysis, 'employees.female.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'employees.male.healthSafetyCount') + safeGet(coverageAnalysis, 'employees.female.healthSafetyCount'),
                      safeGet(coverageAnalysis, 'employees.male.total') + safeGet(coverageAnalysis, 'employees.female.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981" }}>
                    {safeGet(coverageAnalysis, 'employees.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'employees.female.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981" }}>
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
            color: "#4b5563",
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
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Category</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Total (A)</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Health & Safety<br/>No. (B) | % (B/A)</th>
                <th style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                  border: "1px solid #e5e7eb"
                }}>Skill Development<br/>No. (C) | % (C/A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", fontWeight: "500" }}>Male</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'workers.male.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'workers.male.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'workers.male.healthSafetyCount'), 
                      safeGet(coverageAnalysis, 'workers.male.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount'), 
                      safeGet(coverageAnalysis, 'workers.male.total')
                    )}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", fontWeight: "500" }}>Female</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'workers.female.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'workers.female.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'workers.female.healthSafetyCount'), 
                      safeGet(coverageAnalysis, 'workers.female.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    {safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981", fontWeight: "500" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount'), 
                      safeGet(coverageAnalysis, 'workers.female.total')
                    )}
                  </span>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb" }}>Total</td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  {safeGet(coverageAnalysis, 'workers.male.total') + safeGet(coverageAnalysis, 'workers.female.total')}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#3b82f6" }}>
                    {safeGet(coverageAnalysis, 'workers.male.healthSafetyCount') + safeGet(coverageAnalysis, 'workers.female.healthSafetyCount')}
                  </span>
                  <span style={{ color: "#3b82f6" }}>
                    |{formatPercentage(
                      safeGet(coverageAnalysis, 'workers.male.healthSafetyCount') + safeGet(coverageAnalysis, 'workers.female.healthSafetyCount'),
                      safeGet(coverageAnalysis, 'workers.male.total') + safeGet(coverageAnalysis, 'workers.female.total')
                    )}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
                  <span style={{ color: "#10b981" }}>
                    {safeGet(coverageAnalysis, 'workers.male.skillDevelopmentCount') + safeGet(coverageAnalysis, 'workers.female.skillDevelopmentCount')}
                  </span>
                  <span style={{ color: "#10b981" }}>
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

  // Principle Coverage Analysis Component
  const PrincipleCoverageAnalysis = ({ complianceData }) => {
    const analyzeComplianceData = useMemo(() => {
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
        
        const overallPercentage = totalEmployees > 0 ? (totalCovered / totalEmployees) * 100 : 0;
        
        principleStats[principleKey] = {
          title: complianceData.principles[principleKey],
          covered: totalCovered,
          percentage: Math.round(overallPercentage * 100) / 100
        };
      });

      // Dynamically determine coverage thresholds instead of hardcoded 50% and 20%
      const coverageValues = Object.values(principleStats).map(stat => stat.percentage).sort((a, b) => b - a);
      const highThreshold = coverageValues.length > 0 ? Math.max(coverageValues[0] * 0.7, 30) : 50; // 70% of highest or 30%, whichever is higher
      const lowThreshold = coverageValues.length > 0 ? Math.max(coverageValues[Math.floor(coverageValues.length * 0.7)] || 0, 5) : 20; // Bottom 30% or 5%, whichever is higher

      // Categorize principles based on dynamic coverage thresholds
      const high = [];
      const medium = [];
      const low = [];

      Object.keys(principleStats).forEach(principleKey => {
        const stat = principleStats[principleKey];
        if (stat.percentage >= highThreshold) {
          high.push({ key: principleKey, ...stat });
        } else if (stat.percentage >= lowThreshold) {
          medium.push({ key: principleKey, ...stat });
        } else {
          low.push({ key: principleKey, ...stat });
        }
      });

      return {
        high: high.sort((a, b) => b.percentage - a.percentage),
        medium: medium.sort((a, b) => b.percentage - a.percentage),
        low: low.sort((a, b) => b.percentage - a.percentage)
      };
    }, [complianceData]);

    const { high, medium, low } = analyzeComplianceData;

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
          fontSize: "20px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "24px",
          margin: 0
        }}>
          Principle Coverage Analysis
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px"
        }}>
          {/* High Coverage */}
          <div style={{
            backgroundColor: "#f0fdf4",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #bbf7d0"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#15803d",
              marginBottom: "12px",
              margin: "0 0 12px 0"
            }}>
              High Coverage Principles
            </h3>
            {high.length > 0 ? (
              high.map((principle, index) => (
                <div key={principle.key} style={{
                  fontSize: "14px",
                  color: "#166534",
                  marginBottom: "4px",
                  lineHeight: "1.4"
                }}>
                  {principle.key} ({principle.title.split('(')[0].trim()}): {principle.covered} employees covered
                </div>
              ))
            ) : (
              <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
                No high coverage principles
              </div>
            )}
          </div>

          {/* Medium Coverage */}
          <div style={{
            backgroundColor: "#fffbeb",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #fed7aa"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#d97706",
              marginBottom: "12px",
              margin: "0 0 12px 0"
            }}>
              Medium Coverage Principles
            </h3>
            {medium.length > 0 ? (
              medium.map((principle, index) => (
                <div key={principle.key} style={{
                  fontSize: "14px",
                  color: "#92400e",
                  marginBottom: "4px",
                  lineHeight: "1.4"
                }}>
                  {principle.key} ({principle.title.split('(')[0].trim()}): {principle.covered} employees covered
                </div>
              ))
            ) : (
              <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
                No medium coverage principles
              </div>
            )}
          </div>

          {/* Low Coverage */}
          <div style={{
            backgroundColor: "#fef2f2",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #fecaca"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#dc2626",
              marginBottom: "12px",
              margin: "0 0 12px 0"
            }}>
              Low Coverage Principles
            </h3>
            {low.length > 0 ? (
              <>
                {low.map((principle, index) => (
                  <div key={principle.key} style={{
                    fontSize: "14px",
                    color: "#991b1b",
                    marginBottom: "4px",
                    lineHeight: "1.4"
                  }}>
                    {principle.key}, {principle.covered > 0 ? `${principle.covered} employees covered` : 'Need immediate attention'}
                  </div>
                ))}
                {low.filter(p => p.covered === 0).length > 0 && (
                  <div style={{
                    fontSize: "14px",
                    color: "#991b1b",
                    marginTop: "8px",
                    fontWeight: "500"
                  }}>
                    {low.filter(p => p.covered === 0).length} employees covered in these areas
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
                No low coverage principles
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Updated Stats Cards Component
  const StatsCards = ({ data }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
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
          <div style={{ fontSize: "12px", color: "#6B7280" }}>
            {currentMonth} • All
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
            <div>{currentMonth} • All</div>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error handling
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading training data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div style={{ fontSize: "18px", color: "#EF4444" }}>Error: {error}</div>
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
        {/* Dashboard Header */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "900",
            color: "#1f2937",
            margin: "0 0 12px 0",
            letterSpacing: "-0.025em"
          }}>
            Training Dashboard
          </h1>
          <p style={{
            fontSize: "18px",
            color: "#6b7280",
            margin: 0
          }}>
            Monitor and analyze your organization's training programs and compliance
          </p>
        </div>

        {/* Filter Section */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f3f4f6"
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
          />
        </div>

        {/* Stats Cards */}
        <div style={{ marginBottom: "32px" }}>
          <StatsCards data={processedData.stats} />
        </div>
        
        {/* Training Coverage Summary */}
        <TrainingCoverageSummary 
          trainingData={trainingData} 
          traineeList={traineeList} 
          financialYear={financialYear} 
        />
        
        {/* Principle Coverage Analysis */}
        <PrincipleCoverageAnalysis complianceData={generateTrainingComplianceData} />
        
        {/* Detailed Training Coverage Breakdown */}
        <DetailedTrainingCoverageBreakdown 
          trainingData={trainingData} 
          traineeList={traineeList} 
          financialYear={financialYear} 
        />
        
        {/* Principle Compliance Matrix */}
        <PrincipleComplianceMatrix mockData={generateTrainingComplianceData} />
        
        {/* Training Charts Section */}
        <TrainingChartsSection />
      </div>
    </div>
  );
};

export default TrainingDashboard;