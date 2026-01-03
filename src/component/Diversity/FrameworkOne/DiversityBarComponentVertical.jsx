import React from "react";
import img from "../../../img/no.png";

const DiversityBarComponentVertical = ({
  title,
  dataOne,
}) => {
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

  // Extract categories from the data
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

  // Calculate values for each category
  const categoryValues = uniqueCategories.map((category, categoryIndex) => {
    const totalValue = dataOne.reduce((sum, item) => {
      if (item.question_details && item.answer && item.answer[0]) {
        const matchedDetail = item.question_details.find(
          (detail) => detail.option === category
        );
        const answerValue = item.answer[0][categoryIndex];
        if (matchedDetail && answerValue !== undefined) {
          return sum + (isNaN(Number(answerValue)) ? 0 : Number(answerValue));
        }
      }
      return sum;
    }, 0);

    return {
      category,
      totalValue,
    };
  });

  const adjustAndRoundTotalSum = (totalSum) => {
    // Define the thresholds or rounding steps
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    // Handle values less than 1
    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200; // Round to nearest 0.005
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100; // Round to nearest 0.01
      } else {
        return Math.ceil(totalSum * 2) / 2; // Round to nearest 0.5
      }
    }

    // For values greater than or equal to 1, round based on the defined thresholds
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to the next threshold
      }
    }

    // If no threshold is applicable, return the value as is
    return totalSum;
  };

  // Calculate the sum of all category values
  const rawSum = categoryValues.reduce(
    (sum, item) => sum + (isNaN(Number(item.totalValue)) ? 0 : Number(item.totalValue)),
    0
  );
  
  const totalSum = adjustAndRoundTotalSum(rawSum);
  const maxValue = totalSum; // Use total sum as the max value for scaling

  // Define colors for each category
  const colors = [
    "#6fa8dc",
    "#ffa9d0",
    "#cccccc",
    "#6fa8dc",
    "#ffa9d0",
    "#cccccc",
    "#6fa8dc",
    "#ffa9d0",
    "#cccccc",
    "#6fa8dc",
    "#ffa9d0",
  ];
  
  // Color for the total bar
  const totalBarColor = "#333333";

  // Format value for display
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return value.toFixed(1);
    }
  };

  // Short names for categories
  const shortNames = {
    "Number of Males": "Males",
    "Number of Females": "Females",
    "Other non-hazardous wastes": "ONHW",
  };

  return (
    <div className="container">
      <div 
        className="renewable-bar-header" 
        style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "bold" }}
      >
        {title}
      </div>

      {categoryValues.length === 0 || totalSum === 0 ? (
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
          {/* Vertical chart container */}
          <div style={{ 
            position: "relative", 
            height: "300px", 
            marginBottom: "60px" 
          }}>
            {/* Y-axis */}
            <div style={{ 
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "50px",
              borderRight: "1px solid #ddd"
            }}>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: `${ratio * 100}%`,
                  transform: "translateY(50%)",
                  right: 0,
                  left: 0
                }}>
                  {formatValue(maxValue * ratio)}
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

            {/* Bars container */}
            <div style={{ 
              position: "absolute",
              left: "50px",
              right: 0,
              top: 0,
              bottom: 0,
              borderBottom: "1px solid #ddd"
            }}>
              <div style={{ 
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "space-around"
              }}>
                {/* Individual category bars */}
                {categoryValues.map((item, index) => {
                  // Skip if value is NaN or 0
                  if (isNaN(Number(item.totalValue)) || Number(item.totalValue) === 0) {
                    return null;
                  }
                  
                  const value = Number(item.totalValue);
                  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const displayName = shortNames[item.category] || item.category;
                  
                  return (
                    <div key={index} style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center",
                      width: `${80 / (categoryValues.length + 1)}%`,
                      height: "100%",
                      position: "relative"
                    }}>
                      {/* Bar */}
                      <div style={{ 
                        position: "absolute",
                        bottom: 0,
                        width: "70%",
                        height: `${heightPercent}%`,
                        backgroundColor: colors[index % colors.length],
                        minHeight: value > 0 ? "2px" : "0px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingTop: "5px"
                      }}>
                        {/* Value label inside/above bar */}
                        {value > 0 && (
                          <span style={{
                            position: heightPercent < 15 ? "absolute" : "static",
                            top: heightPercent < 15 ? "-20px" : "auto",
                            color: heightPercent < 15 ? "#000" : "#fff",
                            fontSize: "12px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap"
                          }}>
                            {value.toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* X-axis label */}
                      <div style={{ 
                        position: "absolute",
                        bottom: "-40px",
                        textAlign: "center",
                        fontSize: "12px",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {displayName}
                      </div>
                    </div>
                  );
                })}
                
                {/* Total bar */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center",
                  width: `${80 / (categoryValues.length + 1)}%`,
                  height: "100%",
                  position: "relative"
                }}>
                  <div style={{ 
                    position: "absolute",
                    bottom: 0,
                    width: "70%",
                    height: "100%",
                    backgroundColor: totalBarColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: "5px"
                  }}>
                    <span style={{
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap"
                    }}>
                      {totalSum.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* X-axis label */}
                  <div style={{ 
                    position: "absolute",
                    bottom: "-40px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    width: "100%"
                  }}>
                    Total
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="unit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3%",
              marginTop: "1%",
              marginBottom: "1%",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                height: "100%",
                padding: "0%",
              }}
            >
              (Number of Individuals)
            </div>
          </div>
          
          {/* Legend */}
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* Category legends */}
            {categoryValues.map((item, index) => {
              if (isNaN(Number(item.totalValue)) || Number(item.totalValue) === 0) {
                return null;
              }
              
              const displayName = shortNames[item.category] || item.category;
              
              return (
                <div
                  key={index}
                  style={{
                    width: "33%",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                  title={item.category}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: colors[index % colors.length],
                      marginRight: "10px",
                    }}
                  />
                  <div style={{ fontSize: "12px" }}>
                    {displayName}
                  </div>
                </div>
              );
            })}
            
            {/* Total legend */}
            <div
              style={{
                width: "33%",
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: totalBarColor,
                  marginRight: "10px",
                }}
              />
              <div style={{ 
                fontSize: "12px",
                fontWeight: "bold" 
              }}>
                Total
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiversityBarComponentVertical;