import React from "react";
import img from "../../img/no.png";

const SafetyMultiBarYear = ({ 
  type, 
  number, 
  timePeriods, 
  matchedDataWater, 
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear 
}) => {
  // Check if we're on a small screen
  const isSmallScreen = window.innerWidth < 768;
  const isVerySmallScreen = window.innerWidth < 480;

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return Math.round(value); // Format normal numbers
    }
  };
  
  // Extract unique categories dynamically based on the specified condition
  const categories = matchedDataWater.reduce((acc, item) => {
    if (item.question_details) {
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "column")
        .map((detail) => detail.option)
        .reverse();

      return acc.concat(filteredOptions);
    }
    return acc;
  }, []);

  // Remove duplicates to get unique categories
  const uniqueCategories = [...new Set(categories)];

  // Prepare data for each time period
  const seriesData = Object.keys(timePeriods).map((timePeriod, timeIndex) => {
    const totalValues = uniqueCategories.map((category, categoryIndex) => {
      // Find the corresponding matchedDataWater object for the time period (H1, H2, etc.)
      const timePeriodData = matchedDataWater[timeIndex];
      if (timePeriodData && timePeriodData.question_details) {
        // Check for the matched detail for the category
        const matchedDetail = timePeriodData.question_details.find(
          (detail) => detail.option === category
        );
        if (
          matchedDetail &&
          timePeriodData.answer &&
          timePeriodData.answer[number]
        ) {
          // Extract the value from the corresponding index in the answer array
          const answerIndex = number === 4 ? 0 : number;
          const answerValue = timePeriodData.answer[answerIndex][categoryIndex]; // Assume answers align with category index
          return answerValue !== undefined && !isNaN(Number(answerValue))
            ? Number(answerValue)
            : 0;
        }
      }
      return 0; // Default to 0 if no data is found
    });

    return {
      name: timeIndex == 0 ? '2023-2024' : '2024-2025',
      data: totalValues,
    };
  });

  const calculateMaxValue = () => {
    // First, get the stacked total for each time period
    const periodTotals = seriesData.map(series => 
      series.data.reduce((sum, value) => sum + value, 0)
    );
    
    // Get maximum total across all time periods
    const maxTotal = Math.max(...periodTotals);
    
    // If no data, return 0
    if (maxTotal <= 0) return 0;
    
    // For the specific case shown in the example with values around 1700
    if (maxTotal > 1500 && maxTotal < 2000) {
      return 2000; // Match the example scale that goes to 2.0K
    }
    
    // For other ranges, use appropriate rounding
    if (maxTotal < 10) {
      return Math.ceil(maxTotal);
    } else if (maxTotal < 100) {
      return Math.ceil(maxTotal / 10) * 10;
    } else if (maxTotal < 1000) {
      return Math.ceil(maxTotal / 100) * 100;
    } else if (maxTotal < 10000) {
      return Math.ceil(maxTotal / 500) * 500;
    } else {
      return Math.ceil(maxTotal / 1000) * 1000;
    }
  };

  // Calculate the maximum value for the y-axis
  const yAxisMax = calculateMaxValue();
  
  // Calculate step size for the scale (5 equal divisions)
  const stepSize = yAxisMax / 5;

  // New colors for each category - using the brighter palette
  const colors = [
    "#3366CC", // Rich Blue
    "#DD4477", // Rust Red
    "#FF9900", // Amber Orange
    "#109618", // Forest Green
    "#990099", // Royal Purple
    "#0099C6", // Turquoise Blue
    "#DD4477", // Rose Pink
    "#66AA00", // Lime Green
    "#B82E2E", // Brick Red
    "#316395", // Navy Blue
  ];

  const categoryShortNames = {
    "Lost Time Injury Frequency Rate (LTIFR) (per one million-person hours worked)":
      "LTIFR",
    "Total Recordable Work-Related Injuries": "Recordable Injuries",
    "Number of Fatalities": "Fatalities",
    "High Consequence Work-Related Injury or Ill-Health (excluding fatalities)":
      "HCWRI",
    // Add more mappings as needed
  };

  // Calculate the actual chart height (excluding title and legend)
  const chartHeight = 300;
  const chartWidth = "100%";
  const barWidth = 60; // Width of each bar
  
  // Calculate legend item width based on screen size
  const legendItemWidth = isVerySmallScreen ? "50%" : (isSmallScreen ? "33%" : "25%");
  const legendFontSize = isVerySmallScreen ? "10px" : (isSmallScreen ? "11px" : "12px");

  return (
    <div className="container" style={{ padding: "15px", boxSizing: "border-box" }}>
      {/* Title */}
      <div style={{ 
        fontSize: "18px", 
        fontWeight: 600, 
        marginBottom: "20px",
        marginTop: "10px",
        textAlign: "center"
      }}>
        {(() => {
          const a = number;
          switch (a) {
            case 0:
              return `Permanent Male ${type}`;
            case 1:
              return `Permanent Female ${type}`;
            case 2:
              return `Other than Permanent Male ${type}`;
            case 3:
              return `Other than Permanent Female ${type}`;
            case 4:
              return `Safety related Incidents`;
            default:
              return "";
          }
        })()}
      </div>

      {/* Main Chart Container */}
      {yAxisMax > 0 ? (
        <div style={{ position: "relative" }}>
          {/* Chart Container */}
          <div style={{ 
            display: "flex",
            height: `${chartHeight}px`,
            position: "relative",
            marginBottom: "30px" // Space for x-axis labels
          }}>
            {/* Y-Axis Labels */}
            <div style={{ 
              width: isSmallScreen ? "35px" : "40px", 
              height: "100%", 
              position: "relative",
              marginRight: isSmallScreen ? "5px" : "10px",
              textAlign: "right"
            }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={`y-label-${i}`}
                  style={{
                    position: "absolute",
                    right: "5px",
                    bottom: `calc(${i * 20}% - 10px)`,
                    fontSize: legendFontSize,
                    fontWeight: "bold"
                  }}
                >
                  {formatValue(stepSize * i)}
                </div>
              ))}
            </div>

            {/* Chart Area with Grid and Bars */}
            <div style={{ 
              position: "relative",
              width: "calc(100% - 50px)", // Account for y-axis width
              height: "100%" 
            }}>
              {/* Grid Container */}
              <div style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                zIndex: 1
              }}>
                {/* Horizontal Grid Lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={`h-grid-${i}`}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "1px",
                      borderTop: "1px dashed #ccc",
                      bottom: `${i * 20}%`,
                      left: 0
                    }}
                  />
                ))}

                {/* Vertical Grid Lines */}
                {Array(seriesData.length + 1).fill(0).map((_, i) => (
                  <div 
                    key={`v-grid-${i}`}
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "1px",
                      borderLeft: "1px dashed #ccc",
                      left: `${(i * (100 / seriesData.length))}%`,
                      top: 0
                    }}
                  />
                ))}
              </div>

              {/* Bars Container */}
              <div style={{ 
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-end",
                height: "100%",
                position: "relative",
                zIndex: 2 // Above grid
              }}>
                {seriesData.map((series, seriesIndex) => {
                  // Calculate total for this time period
                  const periodTotal = series.data.reduce((sum, value) => sum + value, 0);
                  
                  return (
                    <div
                      key={`bar-group-${seriesIndex}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        height: "100%",
                        width: `${100 / seriesData.length}%`
                      }}
                    >
                      {/* Stacked Bar */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column-reverse", // Stack from bottom up
                          width: `${barWidth}px`,
                          height: "100%",
                          position: "relative"
                        }}
                      >
                        {series.data.map((value, valueIndex) => 
                          value > 0 && (
                            <div
                              key={`bar-segment-${seriesIndex}-${valueIndex}`}
                              style={{
                                width: "100%",
                                height: `${(value / yAxisMax) * 100}%`,
                                backgroundColor: colors[valueIndex % colors.length],
                                minHeight: "1px", // Ensure visibility for small values
                                position: "relative"
                              }}
                              title={`${uniqueCategories[valueIndex]}: ${value}`}
                            >
                              {/* Display value on the bar if there's enough space */}
                              {(value / yAxisMax) * 100 > (isSmallScreen ? 10 : 8) && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: legendFontSize,
                                    textAlign: "center"
                                  }}
                                >
                                  {formatValue(value)}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      
                      {/* Time Period Label (X-axis) */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-25px", // Position below chart
                          fontSize: legendFontSize,
                          fontWeight: 500,
                          color: "#7b91b0",
                          textAlign: "center"
                        }}
                      >
                        {series.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Improved Legend - centered with better spacing */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center", // Center the legend
            marginTop: "10px", // Reduced top margin
            marginBottom: "0", // Remove bottom margin to minimize white space
            width: "100%"
          }}>
            {uniqueCategories.map((category, index) => (
              <div
                key={`legend-${index}`}
                style={{
                  width: legendItemWidth, // More compact width
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Center the content within each legend item
                  marginBottom: isSmallScreen ? "4px" : "6px", // Reduced margin
                  padding: isSmallScreen ? "2px 3px" : "2px 5px", // Added padding for better spacing
                }}
              >
                <div
                  style={{
                    width: isSmallScreen ? "10px" : "12px", // Smaller color indicator
                    height: isSmallScreen ? "10px" : "12px",
                    borderRadius: "50%",
                    backgroundColor: colors[index % colors.length],
                    marginRight: isSmallScreen ? "4px" : "6px", // Reduced margin
                    flexShrink: 0
                  }}
                />
                <div style={{ 
                  fontSize: legendFontSize, 
                  lineHeight: "1.2",
                  whiteSpace: "nowrap", // Prevent text wrapping within legend items
                  overflow: "hidden",
                  textOverflow: "ellipsis" // Add ellipsis for overflow text
                }}>
                  {categoryShortNames[category] || category}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // No data view
        <div style={{ textAlign: "center" }}>
          <img
            src={img}
            alt="No data available"
            style={{ maxWidth: "150px", height: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SafetyMultiBarYear;