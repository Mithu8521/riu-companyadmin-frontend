import React, { useState } from "react";
import img from "../../../img/no.png";

const SafetyVerticalBarFourtyEight = ({
  shortenedMap,
  brief,
  categories,
  heading
}) => {
  // State to track hovered bar
  const [hoveredBar, setHoveredBar] = useState(null);
  // State to track hovered category label
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const getCategorySums = (categoryKey) => {
    let totalForCategory = 0;
    // Loop through each location in the 'time' key
    if (brief && brief.time) {
      // Loop through each location in the 'time' key
      Object.keys(brief.time).forEach((location) => {
        const categoryValues = brief.time[location][categoryKey];
        if (categoryValues) {
          // Sum up values for the category across all time periods
          totalForCategory += categoryValues.reduce(
            (acc, value) => acc + value,
            0
          );
        }
      });
    }

    return totalForCategory;
  };

  // Calculate total sums for each category
  const categoryValues = categories.map((category) => ({
    category,
    totalValue: getCategorySums(category),
  }));

  // Calculate the grand total sum of all categories
  const totalSum = categoryValues.reduce(
    (acc, item) => acc + item.totalValue,
    0
  );

  // Colors for each category
  const colors = [
    "#C6CB8D",
    "#949776",
    "#ABC4B2",
    "#6D8B96",
    "#9CDFE3",
    "#11546f",
    "#587b87",
    "#8CBBCE",
  ];

  // Total bar color
  const totalColor = "#2c3e50";

  const shortenCategory = (category) => {
    return shortenedMap[category] || category; // Fallback to full category if not found
  };

  // Function to format value (adding commas for thousands and 1 decimal place)
  const formatValue = (value) => {
    return value.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to get unit (if needed)
  const getUnit = () => {
    return ""; // Can be customized if unit is needed
  };

  return (
    <div className="container" style={{ width: "100%" }}>
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
          marginBottom: "15px"
        }}
      >
        {heading}
      </div>
      
      {categoryValues.length > 0 && totalSum > 0 ? (
        <div style={{ height: "90%" }}>
          {/* Chart container */}
          <div style={{ 
            position: "relative", 
            height: "300px", 
            marginBottom: "80px" 
          }}>
            {/* Y-axis labels */}
            <div style={{ 
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1px solid #ddd"
            }}>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  position: "absolute",
                  bottom: `${ratio * 100}%`,
                  transform: "translateY(50%)",
                  right: 0,
                  left: 0
                }}>
                  {formatValue(Math.round((totalSum * ratio) / 10) * 10)}
                </div>
              ))}
            </div>

            {/* Grid lines */}
            <div style={{ 
              position: "absolute",
              left: "50px",
              right: 0,
              top: 0,
              bottom: 0
            }}>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
                <div key={i} style={{
                  width: "100%",
                  borderTop: "1px dashed #ddd",
                  height: "1px",
                  position: "absolute",
                  bottom: `${ratio * 100}%`,
                  left: 0
                }}></div>
              ))}
            </div>

            {/* Bar chart area */}
            <div style={{ 
              position: "absolute",
              left: "50px",
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "flex-end",
              padding: "0 10px",
              borderBottom: "1px solid #ddd",
              borderLeft: "none"
            }}>
              <div style={{ 
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "flex-end",
                justifyContent: "space-around"
              }}>
                {/* Individual category bars */}
                {categoryValues.map((item, index) => {
                  const barHeight = (item.totalValue / totalSum) * 100;
                  const percentage = (item.totalValue / totalSum * 100).toFixed(1);
                  return (
                    <div key={index} style={{ 
                      width: "80px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative"
                    }}>
                      <div 
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: "60px",
                          height: `${barHeight}%`,
                          backgroundColor: colors[index % colors.length],
                          minHeight: item.totalValue > 0 ? "2px" : "0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          paddingTop: "5px",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          cursor: "pointer",
                          transition: "opacity 0.2s ease",
                          opacity: hoveredBar !== null && hoveredBar !== item.category ? 0.7 : 1
                        }}
                        onMouseEnter={() => setHoveredBar(item.category)}
                        onMouseLeave={() => setHoveredBar(null)}
                        title={`${item.category}: ${formatValue(item.totalValue)} ${getUnit()} (${percentage}% of total)`}
                      >
                        {item.totalValue > 0 && (
                          <span style={{
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                            position: barHeight < 15 ? "absolute" : "static",
                            top: barHeight < 15 ? "-20px" : "auto",
                            color: barHeight < 15 ? "#000" : "#fff"
                          }}>
                            {item.totalValue.toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* X-axis label with tooltip */}
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "-45px",
                          width: "60px",
                          textAlign: "center",
                          fontSize: "11px",
                          fontWeight: 600,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          left: "10px", // Shift to align with the bar
                          cursor: "pointer"
                        }}
                        onMouseEnter={() => setHoveredLabel(item.category)}
                        onMouseLeave={() => setHoveredLabel(null)}
                      >
                        <span style={{
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {shortenCategory(item.category)}
                        </span>
                        
                        {/* Tooltip for full category name */}
                        {hoveredLabel === item.category && (
                          <div style={{
                            position: "absolute",
                            bottom: "25px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 1000,
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                          }}>
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Total bar */}
                <div style={{
                  width: "80px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative"
                }}>
                  <div 
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "60px",
                      height: "100%",
                      backgroundColor: totalColor,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      paddingTop: "5px",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                      opacity: hoveredBar !== null && hoveredBar !== "Total" ? 0.7 : 1
                    }}
                    onMouseEnter={() => setHoveredBar("Total")}
                    onMouseLeave={() => setHoveredBar(null)}
                    title={`Total: ${formatValue(totalSum)} ${getUnit()} (100% of total)`}
                  >
                    <span style={{
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}>
                      {totalSum.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* X-axis label for Total */}
                  <div style={{
                    position: "absolute",
                    bottom: "-45px",
                    width: "60px",
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    left: "10px" // Shift to align with the bar
                  }}>
                    <span>Total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          height: "100%", 
          width: "100%", 
          display: "flex", 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img src={img} style={{ height: "140px", width: "170px" }} alt="No data" />
        </div>
      )}
    </div>
  );
};

export default SafetyVerticalBarFourtyEight;