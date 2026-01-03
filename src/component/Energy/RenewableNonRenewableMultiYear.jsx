import React, { useState, useEffect, useRef } from 'react';

// Clean chart component that accepts your dynamic props
const DynamicChartDemo = ({
  compareLastTimePeriods,
  locationOption,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
  title
}) => {
  // Embedded CustomWasteChart component
  const CustomWasteChart = ({
    compareLastTimePeriods,
    locationOption,
    compareTCurrentimePeriods,
    graphData,
    financialYear,
    title
  }) => {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [chartData, setChartData] = useState({
      categories: [],
      values: [],
      upperLimits: [],
      lowerLimits: [],
      colors: []
    });
    
    // Define colors for categories
    const categoryColors = ["#FFD700", "#FF0000", "#0000FF", "#9400D3", "#800080"];
    
    // Format value based on magnitude
    const formatValue = (value) => {
      if (value >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
      } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
      } else {
        return Math.round(value); // Format normal numbers
      }
    };

    // Process data from props to populate the chart
    useEffect(() => {
      if (graphData && graphData.length > 0) {
        // Generate categories based on the input data
        const categories = [
          `${
            financialYear[financialYear.length - 2].financial_year_value
          } (${Object.keys(compareLastTimePeriods).join(", ")})`,
          `${
            financialYear[financialYear.length - 1].financial_year_value
          } (${Object.keys(compareTCurrentimePeriods).join(", ")})`,
        ];

        const getTotalEnergyForPeriod = (fromDate) => {
          return graphData
          .filter((data) => data.formDate === fromDate && data.questionId === (title === 'Non-Renewable Energy Consumption' ? 452 : 451))
          .map((data) => {
              return data.energyAndEmission.reduce((innerSum, energyPair) => {
                const value = Number(energyPair[0]);
                return innerSum + (isNaN(value) || value === "" ? 0 : value);
              }, 0);
            })
            .reduce((accum, curr) => accum + curr, 0);
        };

        const getTotalTargetEnergyForPeriod = (fromDate) => {
          return graphData
            .filter((data) => data.formDate === fromDate)
            .map((data) => {
              const index = title === 'Non-Renewable Energy Consumption' ? 1 : 0;
              return Number(data.targetData?.[index]?.[0]) || 0;
            })
            .reduce((accum, curr) => accum + curr, 0);
        };

        const actualValues = [];
        const upperLimitValues = [];
        const lowerLimitValues = [];

        // Process first time period (previous)
        let aggregatedLastTimeEnergy = 0;
        let aggregatedTargetLastTimeEnergy = 0;

        Object.keys(compareLastTimePeriods).forEach((period) => {
          const fromDate = compareLastTimePeriods[period];
          aggregatedLastTimeEnergy += getTotalEnergyForPeriod(fromDate);
          aggregatedTargetLastTimeEnergy += getTotalTargetEnergyForPeriod(fromDate);
        });
        actualValues.push(aggregatedLastTimeEnergy);
        upperLimitValues.push(aggregatedTargetLastTimeEnergy/2 * 1.2); // Multiplied by 1.2 for upper limit
        lowerLimitValues.push(aggregatedTargetLastTimeEnergy/2 * 0.8); // Multiplied by 0.8 for lower limit

        // Process second time period (current)
        let aggregatedCurrentTimeEnergy = 0;
        let aggregatedTargetCurrentTimeEnergy = 0;

        Object.keys(compareTCurrentimePeriods).forEach((period) => {
          const fromDate = compareTCurrentimePeriods[period];
          aggregatedCurrentTimeEnergy += getTotalEnergyForPeriod(fromDate);
          aggregatedTargetCurrentTimeEnergy += getTotalTargetEnergyForPeriod(fromDate);
        });

        actualValues.push(aggregatedCurrentTimeEnergy);
        upperLimitValues.push(aggregatedTargetCurrentTimeEnergy/2 * 1.2);
        lowerLimitValues.push(aggregatedTargetCurrentTimeEnergy/2 * 0.8);

        // Assign colors for each category
        const colors = categories.map((_, index) => categoryColors[index % categoryColors.length]);

        // Update chart data
        setChartData({
          categories,
          values: actualValues,
          upperLimits: upperLimitValues,
          lowerLimits: lowerLimitValues,
          colors
        });
      }
    }, [compareLastTimePeriods, compareTCurrentimePeriods, graphData, title, financialYear]);

    // Calculate grid lines
    const numGridLines = 5;
    const gridLineIntervals = Array.from(
      { length: numGridLines },
      (_, i) => (numGridLines - 1 - i) / (numGridLines - 1)
    );
    
    const labelRef = useRef(null);
    const [leftPosition, setLeftPosition] = useState("-28px");
    
    useEffect(() => {
      if (labelRef.current) {
        const combinedText = title + " In GJ";
        if (combinedText.length > 15) {
          setLeftPosition("-50px");
        } else {
          setLeftPosition("-31px");
        }
      }
    }, [title]);

    // Calculate the total sum of all values
    const actualSum = chartData.values.reduce((sum, val) => sum + val, 0);

    // Calculate max value with 20% padding for better visualization
    const calculatedMaxValue = Math.max(
      ...chartData.values, 
      ...chartData.upperLimits,
      ...chartData.lowerLimits
    ) * 1.2 || 1000; // Default to 1000 if no data

    if (!graphData || graphData.length === 0) {
      return (
        <div className="container">
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666"
          }}>
            No Data Available
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          position: "relative",
          marginBottom: "60px",
          paddingLeft: "70px",
          paddingRight: "30px",
          height: "30vh",
          width: "100%",
        }}
      >
        {/* Y-axis vertical label */}
        <div
          ref={labelRef}
          style={{
            position: "absolute",
            left: leftPosition,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center center",
            fontWeight: 400,
            fontSize: "14px",
            color: "#333",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {title} in GJ
        </div>

        {/* Y-axis labels and scale */}
        <div
          style={{
            position: "absolute",
            left: "30px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingRight: "10px",
          }}
        >
          {gridLineIntervals.map((interval, index) => (
            <div
              key={index}
              style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
            >
              {formatValue(calculatedMaxValue * interval)}
            </div>
          ))}
        </div>

        {/* Chart background with border */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "calc(100% - 100px)",
            height: "100%",
            border: "1px solid #ccc",
            zIndex: 0,
          }}
        ></div>

        {/* Horizontal Grid lines */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "calc(100% - 100px)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {gridLineIntervals.map((interval, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                borderBottom: "1px dashed #ccc",
                position: "absolute",
                top: `${interval * 100}%`,
              }}
            ></div>
          ))}
        </div>

        {/* Min and Max Target SVG Lines */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "calc(100% - 100px)",
            height: "100%",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          {/* SVG for min and max target lines */}
          <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
            {/* Create lines between max target points */}
            {chartData.categories.map((category, index) => {
              if (index >= chartData.categories.length - 1) return null;
              
              const segmentWidth = 100 / chartData.categories.length;
              const x1 = (index * segmentWidth) + (segmentWidth / 2);
              const y1 = chartData.upperLimits[index] > 0 
                ? 100 - ((chartData.upperLimits[index] / calculatedMaxValue) * 100) 
                : 100;
              
              const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
              const y2 = chartData.upperLimits[index + 1] > 0 
                ? 100 - ((chartData.upperLimits[index + 1] / calculatedMaxValue) * 100) 
                : 100;
              
              return (
                <line 
                  key={`max-line-${index}`}
                  x1={`${x1}%`} 
                  y1={`${y1}%`} 
                  x2={`${x2}%`} 
                  y2={`${y2}%`} 
                  stroke="#F44336"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
              );
            })}
            
            {/* Create lines between min target points */}
            {chartData.categories.map((category, index) => {
              if (index >= chartData.categories.length - 1) return null;
              
              const segmentWidth = 100 / chartData.categories.length;
              const x1 = (index * segmentWidth) + (segmentWidth / 2);
              const y1 = chartData.lowerLimits[index] > 0 
                ? 100 - ((chartData.lowerLimits[index] / calculatedMaxValue) * 100) 
                : 100;
              
              const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
              const y2 = chartData.lowerLimits[index + 1] > 0 
                ? 100 - ((chartData.lowerLimits[index + 1] / calculatedMaxValue) * 100) 
                : 100;
              
              return (
                <line 
                  key={`min-line-${index}`}
                  x1={`${x1}%`} 
                  y1={`${y1}%`} 
                  x2={`${x2}%`} 
                  y2={`${y2}%`} 
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
              );
            })}
            
            {/* Dots to show target points */}
            {chartData.categories.map((category, index) => {
              const segmentWidth = 100 / chartData.categories.length;
              const xPos = (index * segmentWidth) + (segmentWidth / 2);
              
              const maxYPos = chartData.upperLimits[index] > 0 
                ? 100 - ((chartData.upperLimits[index] / calculatedMaxValue) * 100) 
                : 100;
              
              const minYPos = chartData.lowerLimits[index] > 0 
                ? 100 - ((chartData.lowerLimits[index] / calculatedMaxValue) * 100) 
                : 100;
              
              return (
                <React.Fragment key={`dots-${index}`}>
                  <circle 
                    cx={`${xPos}%`} 
                    cy={`${maxYPos}%`} 
                    r="3" 
                    fill="#F44336" 
                  />
                  
                  <circle 
                    cx={`${xPos}%`} 
                    cy={`${minYPos}%`} 
                    r="3" 
                    fill="#4CAF50" 
                  />
                </React.Fragment>
              );
            })}
          </svg>
        </div>

        {/* Vertical Grid lines */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "calc(100% - 100px)",
            height: "100%",
            display: "flex",
            justifyContent: "space-around",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {Array.from({ length: chartData.categories.length + 1 }, (_, index) => (
            <div
              key={index}
              style={{
                height: "100%",
                width: "1px",
                borderLeft: "1px dashed #ccc",
                position: "absolute",
                left: `${(index / chartData.categories.length) * 100}%`,
              }}
            ></div>
          ))}
        </div>

        {/* Bar chart area */}
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "space-around",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Bars */}
          {chartData.categories.map((category, index) => {
            const value = chartData.values[index] || 0;
            const heightPercent = calculatedMaxValue > 0 ? (value / calculatedMaxValue) * 100 : 0;
            
            const minTarget = chartData.lowerLimits[index] || 0;
            const maxTarget = chartData.upperLimits[index] || 0;
            
            // Calculate percentage of total
            const percentOfTotal = actualSum > 0 ? (value / actualSum) * 100 : 0;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: `${100 / chartData.categories.length}%`,
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* Value label */}
                  {value > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: `calc(100% - ${heightPercent}% - 25px)`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatValue(value)}
                    </div>
                  )}
                  
                  {/* Bar with hover effect */}
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      width: "60px",
                      backgroundColor: index < chartData.colors.length ? chartData.colors[index] : "#791e80",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      minHeight: value > 0 ? "2px" : "0",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                      opacity:
                        hoveredBar !== null && hoveredBar !== index ? 0.7 : 1,
                    }}
                    onMouseEnter={() => {
                      setHoveredBar(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                    }}
                    title={`${category}: ${value.toFixed(1)} GJ ${actualSum && actualSum > 0 ? `(${percentOfTotal.toFixed(1)}% of total)` : ''}
Min Target: ${minTarget ? minTarget.toFixed(1) + ' GJ' : 'N/A'}
Max Target: ${maxTarget ? maxTarget.toFixed(1) + ' GJ' : 'N/A'}`}
                  ></div>
                </div>

                {/* X-axis label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    width: "100px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    color: "#666",
                    height: "32px",
                    lineHeight: "1.2",
                  }}
                  title={category}
                >
                  {category}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div style={{
          position: "absolute",
          bottom: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          fontSize: "11px",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#791e80", marginRight: "5px" }}></div>
            <span>Actual</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "20px", 
              height: "2px", 
              backgroundColor: "#F44336", 
              marginRight: "5px",
              borderStyle: "dashed",
              borderWidth: "1px" 
            }}></div>
            <span>Upper Limit</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "20px", 
              height: "2px", 
              backgroundColor: "#4CAF50", 
              marginRight: "5px",
              borderStyle: "dashed",
              borderWidth: "1px" 
            }}></div>
            <span>Lower Limit</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      height: '100%'
    }}>
      <CustomWasteChart 
        compareLastTimePeriods={compareLastTimePeriods}
        locationOption={locationOption}
        compareTCurrentimePeriods={compareTCurrentimePeriods}
        graphData={graphData}
        financialYear={financialYear}
        title={title}
      />
    </div>
  );
};

export default DynamicChartDemo;