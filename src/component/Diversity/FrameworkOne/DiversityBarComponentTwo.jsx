import React, { useState, useEffect } from "react";
import img from "../../../img/no.png";

const DiversityBarComponent = ({
  title,
  dataOne,
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Set up resize listener to make the chart responsive
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.diversity-chart-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };
    
    // Set initial width
    updateWidth();
    
    // Add event listener for resize
    window.addEventListener('resize', updateWidth);
    
    // Clean up
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!dataOne || dataOne.length === 0) {
    return (
      <div className="container">
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  const categories = dataOne.reduce((acc, item) => {
    if (item.question_details) {
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "column1")
        .map((detail) => detail.option);

      if (filteredOptions.length === 0) {
        filteredOptions = item.question_details
          .filter((detail) => detail.option_type === "column")
          .map((detail) => detail.option);
      }

      return acc.concat(filteredOptions);
    }

    return acc;
  }, []);

  const uniqueCategories = [...new Set(categories)].reverse();

  const categoryValues = uniqueCategories.map((category, categoryIndex) => {
    const totalValue = dataOne.reduce((sum, item) => {
      if (item.question_details && item.answer && item.answer[1]) {
        const matchedDetail = item.question_details.find(
          (detail) => detail.option === category
        );
        const answerValue = item.answer[1][categoryIndex];
        if (matchedDetail && answerValue !== undefined) {
          return sum + (isNaN(Number(answerValue)) ? 0 : Number(answerValue));
        }
      }
      return sum;
    }, 0);

    // Add min and max targets for each category
    const minTarget = dataOne.reduce((min, item) => {
      if (item.minTarget && item.minTarget[1] && item.minTarget[1][categoryIndex] !== undefined) {
        const minValue = Number(item.minTarget[1][categoryIndex]);
        return isNaN(minValue) ? min : minValue;
      }
      return min;
    }, 0);

    const maxTarget = dataOne.reduce((max, item) => {
      if (item.maxTarget && item.maxTarget[1] && item.maxTarget[1][categoryIndex] !== undefined) {
        const maxValue = Number(item.maxTarget[1][categoryIndex]);
        return isNaN(maxValue) ? max : maxValue;
      }
      return max;
    }, 0);

    return {
      category,
      totalValue,
      minTarget,
      maxTarget
    };
  });

  // Filter out categories with 0 or NaN values
  const validCategoryValues = categoryValues.filter(
    (item) => !isNaN(Number(item.totalValue)) && Number(item.totalValue) > 0
  );

  // Calculate total value (sum of all categories)
  const totalValue = validCategoryValues.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  );

  // Calculate total min and max values
  const totalMinTarget = validCategoryValues.reduce(
    (sum, item) => sum + Number(item.minTarget || 0),
    0
  );
  
  const totalMaxTarget = validCategoryValues.reduce(
    (sum, item) => sum + Number(item.maxTarget || 0),
    0
  );

  // Create an ordered array with males, females, other, then total
  const orderedData = [];

  // Find male data
  const maleData = validCategoryValues.find(item => 
    item.category === "Number of Males" || 
    item.category === "Males"
  );
  if (maleData) orderedData.push(maleData);

  // Find female data
  const femaleData = validCategoryValues.find(item => 
    item.category === "Number of Females" || 
    item.category === "Females"
  );
  if (femaleData) orderedData.push(femaleData);

  // Find or create other data - if not found in data, use value of 0
  const otherData = validCategoryValues.find(item => 
    item.category === "Other" || 
    item.category === "Others" ||
    item.category === "Number of Others"
  );
  if (otherData) {
    orderedData.push(otherData);
  } else {
    orderedData.push({ category: "Other", totalValue: 0, minTarget: 0, maxTarget: 0 });
  }

  // Add total as the fourth item
  orderedData.push({ 
    category: "Total", 
    totalValue: totalValue,
    minTarget: totalMinTarget,
    maxTarget: totalMaxTarget
  });

  const colors = {
    "Males": "#6fa8dc",
    "Number of Males": "#6fa8dc",
    "Females": "#ffa9d0",
    "Number of Females": "#ffa9d0",
    "Other": "#cccccc",
    "Others": "#cccccc",
    "Number of Others": "#cccccc",
    "Total": "#aaaaaa" // Darker gray for total
  };

  // Chart dimensions
  const chartHeight = 300;
  const barWidth = 60; // Set to 60px as requested
  const targetLineWidth = 70; // Width of the target lines
  
  // Calculate bar spacing based on container width to make it responsive
  const minSpacing = 80; // Minimum spacing
  const itemCount = orderedData.length;
  
  // Calculate actual spacing based on container width
  const barSpacing = containerWidth ? Math.max(minSpacing, (containerWidth - 80) / itemCount) : minSpacing;
  const chartWidth = containerWidth ? containerWidth - 80 : orderedData.length * minSpacing;

  // For vertical scaling - consider min/max targets in the scale calculation
  const maxValueForScale = Math.max(
    totalValue, 
    ...validCategoryValues.map(item => Number(item.totalValue)),
    ...validCategoryValues.map(item => Number(item.maxTarget || 0)),
    totalMaxTarget
  );

  // Calculate a nice round scale (better for display)
  const getScaleIncrement = (value) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    if (value / magnitude < 2) return magnitude / 2;
    if (value / magnitude < 5) return magnitude;
    return magnitude * 2;
  };

  const increment = getScaleIncrement(maxValueForScale / 4);
  const roundedMaxValue = Math.ceil(maxValueForScale / increment) * increment;
  const yAxisSteps = roundedMaxValue / increment;

  return (
    <div className="container" style={{ padding: "25px", boxSizing: "border-box" }}>
      <div className="diversity-bar-header" style={{ 
        fontSize: "16px", 
        fontWeight: "bold", 
        marginBottom: "-10px", 
        textAlign: "center" 
      }}>{title}</div>

      {validCategoryValues.length === 0 || totalValue === 0 ? (
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      ) : (
        <>
          <div className="diversity-chart-container" style={{ 
            width: "100%", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center" 
          }}>
            {/* Chart container with Y-axis */}
            <div style={{ 
              display: "flex", 
              position: "relative",
              height: `${chartHeight + 50}px`, // Extra space for labels
              width: `${chartWidth + 50}px`, // Extra space for y-axis
              marginLeft: "55px" // Increased space for Y-axis labels and title
            }}>
              {/* Y-axis title */}
              <div style={{
                position: "absolute",
                left: "-39px", // Position to the left of the chart
                top: "100%",
                transform: "rotate(-90deg) translateX(50%)",
                transformOrigin: "left bottom",
                fontSize: "14px",
                textAlign: "center"
              }}>
                Number of Individuals
              </div>
              
              {/* Y-axis lines and labels */}
              <div style={{
                position: "absolute",
                left: "0",
                bottom: "0",
                width: "100%",
                height: `${chartHeight}px`,
                borderLeft: "1px solid #ccc"
              }}>
                {Array.from({ length: yAxisSteps + 1 }).map((_, index) => {
                  const value = (yAxisSteps - index) * increment;
                  const positionY = index * (chartHeight / yAxisSteps);

                  return (
                    <React.Fragment key={index}>
                      {/* Y-axis value */}
                      <div style={{ 
                        position: "absolute", 
                        left: "-40px", 
                        top: `${positionY - 10}px`, 
                        fontSize: "12px",
                        textAlign: "right",
                        width: "35px"
                      }}>
                        {value}
                      </div>
                      
                      {/* Horizontal grid line */}
                      <div style={{ 
                        position: "absolute", 
                        left: "0",
                        top: `${positionY}px`, 
                        width: "100%", 
                        borderTop: index === yAxisSteps ? "1px solid #ccc" : "1px dashed #ccc"
                      }}></div>
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Bars */}
              {orderedData.map((item, index) => {
                const value = Number(item.totalValue);
                const minTarget = Number(item.minTarget || 0);
                const maxTarget = Number(item.maxTarget || 0);
                
                const barHeight = Math.round(value * (chartHeight / roundedMaxValue));
                const minHeight = Math.round(minTarget * (chartHeight / roundedMaxValue));
                const maxHeight = Math.round(maxTarget * (chartHeight / roundedMaxValue));
                
                const isTotal = item.category === "Total";
                const shortNames = {
                  "Number of Males": "Males",
                  "Number of Females": "Females",
                  "Number of Others": "Other"
                };
                const displayName = shortNames[item.category] || item.category;
                const barColor = colors[item.category] || colors[displayName];
                const percent = (value / totalValue * 100) || 0;
                
                const isHovered = hoveredBar === `bar-${index}`;

                return (
                  <div key={index} style={{ position: "relative" }}>
                    {/* Bar */}
                    <div 
                      style={{ 
                        position: "absolute",
                        bottom: "0", // This ensures the bar starts from the bottom (0 point)
                        left: `${index * barSpacing + 20}px`,
                        width: `${barWidth}px`,
                        height: `${barHeight}px`,
                        backgroundColor: barColor,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "opacity 0.2s ease",
                        opacity: hoveredBar && hoveredBar !== `bar-${index}` ? 0.7 : 1,
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                      }}
                      onMouseEnter={() => setHoveredBar(`bar-${index}`)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Display value on bar */}
                      {value > 0 && (
                        <div style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: barHeight > 25 ? "#fff" : "#333",
                          position: "absolute",
                          top: barHeight > 25 ? "5px" : "-20px",
                          width: "100%",
                          textAlign: "center",
                        }}>
                          {value}
                        </div>
                      )}
                    </div>
                    
                    {/* Hover tooltip */}
                    {isHovered && (
                      <div style={{
                        position: "absolute",
                        bottom: `${barHeight + 10}px`,
                        left: `${index * barSpacing + barWidth/2 - 75}px`,
                        padding: "8px",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 100,
                        width: "150px",
                        fontSize: "12px",
                      }}>
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                          {displayName}
                        </div>
                        <div>Current: {value} ({percent.toFixed(1)}%)</div>
                        {minTarget > 0 && <div style={{ color: "#00cc00" }}>Min Target: {minTarget}</div>}
                        {maxTarget > 0 && <div style={{ color: "#ff0000" }}>Max Target: {maxTarget}</div>}
                      </div>
                    )}
                    
                    {/* Max Target Marker - always visible */}
                    {maxTarget > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: `${maxHeight}px`,
                        left: `${index * barSpacing + barWidth/2 - targetLineWidth/2 + 20}px`,
                        width: `${targetLineWidth}px`,
                        borderTop: "2px solid #ff0000",
                        zIndex: 2
                      }}></div>
                    )}
                    
                    {/* Min Target Marker - always visible */}
                    {minTarget > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: `${minHeight}px`,
                        left: `${index * barSpacing + barWidth/2 - targetLineWidth/2 + 20}px`,
                        width: `${targetLineWidth}px`,
                        borderTop: "2px solid #00cc00",
                        zIndex: 2
                      }}></div>
                    )}
                    
               
                    
                    {/* X-axis labels */}
                    <div style={{ 
                      position: "absolute",
                      bottom: "-30px", 
                      left: `${index * barSpacing + 20}px`, 
                      width: `${barWidth}px`, 
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: isTotal ? "bold" : "normal",
                    }}>
                      {displayName}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend for min/max indicators */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              gap: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "20px", borderTop: "2px solid #00cc00", marginRight: "5px" }}></div>
                <span style={{ fontSize: "12px" }}>Minimum Target</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "20px", borderTop: "2px solid #ff0000", marginRight: "5px" }}></div>
                <span style={{ fontSize: "12px" }}>Maximum Target</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiversityBarComponent;