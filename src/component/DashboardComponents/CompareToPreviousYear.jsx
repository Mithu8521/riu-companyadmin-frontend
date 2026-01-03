import React, { useState, useEffect, useRef } from "react";

// Clean chart component that accepts your dynamic props
const CompareToPreviousYear = ({
  compareLastTimePeriods,
  locationOption,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
  title,
  unit,
  Tab,
  columnIndex,
  rowIndex,
}) => {
  const [periodMode, setPeriodMode] = useState("combined"); // 'combined' or 'separate'

  // Embedded CustomChart component
  const CustomChart = ({
    compareLastTimePeriods,
    locationOption,
    compareTCurrentimePeriods,
    graphData,
    financialYear,
    title,
    periodMode,
  }) => {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [chartData, setChartData] = useState({
      categories: [],
      values: [],
      upperLimits: [],
      lowerLimits: [],
      colors: [],
    });

    // Define colors for categories - match the image colors
    const categoryColors = ["#3B82F6", "#E84A86", "#F59E0B", "#8E24AA"];

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
        if (periodMode === "combined") {
          // Combined mode - original implementation
          const categories = [
            `${
              financialYear[financialYear.length - 2].financial_year_value
            } (${Object.keys(compareLastTimePeriods).join(", ")})`,
            `${
              financialYear[financialYear.length - 1].financial_year_value
            } (${Object.keys(compareTCurrentimePeriods).join(", ")})`,
          ];

          const getTotalEnergyForPeriod = (fromDate) => {
            let questionIdToCheck;

            if (
              title === "Non-Renewable Energy Consumption" ||
              title === "Emission"
            ) {
              questionIdToCheck = 452;
            } else if (title === "Water Withdrawal") {
              questionIdToCheck = 301;
            } else if (title === "Water Discharge") {
              questionIdToCheck = 310;
            } else if (title === "Waste Generated") {
              questionIdToCheck = 458;
            } else if (title === "Waste Recovered") {
              questionIdToCheck = 459;
            } else if (Tab === "Diversity") {
              questionIdToCheck = "26_46";
            } else if (Tab === "WDiversity") {
              questionIdToCheck = "28_48";
            } else if (Tab === "Complaint") {
              questionIdToCheck = 211;
            } else {
              questionIdToCheck = 451;
            }

            return graphData
              .filter(
                (data) =>
                  data.formDate === fromDate &&
                  data.questionId === questionIdToCheck
              )
              .map((data) => {
                let dataArray;

                if (Tab === "Water" || Tab === "Waste" || Tab === "Complaint") {
                  dataArray = data.answer;
                } else if (Tab === "Diversity" || Tab === "WDiversity") {
                  dataArray = data.percentage;
                } else {
                  dataArray = data.energyAndEmission;
                }

                return Tab === "Diversity" || Tab === "WDiversity" || Tab === "Complaint" 
                  ? Number(dataArray[rowIndex][columnIndex])
                  : Tab === "Waste"
                  ? dataArray.reduce((innerSum, energyPair) => {
                      return (
                        innerSum +
                        energyPair.reduce((sum, value) => {
                          const numValue = parseFloat(value);
                          return sum + (isNaN(numValue) ? 0 : numValue);
                        }, 0)
                      );
                    }, 0)
                  : dataArray.reduce((innerSum, pair) => {
                      const value =
                        Tab === "Emission" ? Number(pair[1]) : Number(pair[0]);

                      if (isNaN(value) || value === "") {
                        return innerSum;
                      } else {
                        return innerSum + value;
                      }
                    }, 0);
              })
              .reduce((accum, curr) => accum + curr, 0);
          };

          const getTotalTargetEnergyForPeriod = (fromDate) => {
            return graphData
              .filter((data) => data.formDate === fromDate)
              .map((data) => {
                const index =
                  title === "Non-Renewable Energy Consumption" ? 1 : 0;
                return Tab === "Emission"
                  ? 0
                  : Number(data.targetData?.[index]?.[0]) || 0;
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
            aggregatedTargetLastTimeEnergy +=
              getTotalTargetEnergyForPeriod(fromDate);
          });
          actualValues.push(aggregatedLastTimeEnergy);
          upperLimitValues.push((aggregatedTargetLastTimeEnergy / 2) * 1.2); // Multiplied by 1.2 for upper limit
          lowerLimitValues.push((aggregatedTargetLastTimeEnergy / 2) * 0.8); // Multiplied by 0.8 for lower limit

          // Process second time period (current)
          let aggregatedCurrentTimeEnergy = 0;
          let aggregatedTargetCurrentTimeEnergy = 0;

          Object.keys(compareTCurrentimePeriods).forEach((period) => {
            const fromDate = compareTCurrentimePeriods[period];
            aggregatedCurrentTimeEnergy += getTotalEnergyForPeriod(fromDate);
            aggregatedTargetCurrentTimeEnergy +=
              getTotalTargetEnergyForPeriod(fromDate);
          });

          if(Tab==="WDiversity" || Tab==="Diversity"){
            aggregatedTargetCurrentTimeEnergy =24
          }

          actualValues.push(aggregatedCurrentTimeEnergy);
          upperLimitValues.push((aggregatedTargetCurrentTimeEnergy / 2) * 1.2);
          lowerLimitValues.push((aggregatedTargetCurrentTimeEnergy / 2) * 0);

          // Assign colors for each category
          const colors = categories.map(
            (_, index) => categoryColors[index % categoryColors.length]
          );

          // Update chart data
          setChartData({
            categories,
            values: actualValues,
            upperLimits: upperLimitValues,
            lowerLimits: lowerLimitValues,
            colors,
          });
        } else {
          // Separate mode - each period has its own bar
          const categories = [];
          const actualValues = [];
          const upperLimitValues = [];
          const lowerLimitValues = [];
          const colors = [];

          // Process first period group
          Object.keys(compareLastTimePeriods).forEach((period, index) => {
            const fromDate = compareLastTimePeriods[period];
            const periodLabel = `${
              financialYear[financialYear.length - 2].financial_year_value
            } (${period})`;
            categories.push(periodLabel);

            // Determine the correct question ID based on title
            let questionId;
            if (
              title === "Non-Renewable Energy Consumption" ||
              title === "Emission"
            ) {
              questionId = 452;
            } else if (title === "Water Withdrawal") {
              questionId = 301;
            } else if (title === "Water Discharge") {
              questionId = 310;
            } else if (title === "Waste Generated") {
              questionId = 458;
            } else if (title === "Waste Recovered") {
              questionId = 459;
            } else if (Tab === "Diversity") {
              questionId = "26_46";
            }else if (Tab === "WDiversity") {
              questionId = "28_48";
            } else if (Tab === "Complaint") {
              questionId = 122;
            } else {
              questionId = 451;
            }

            // Calculate actual values
            const energy = graphData
              .filter(
                (data) =>
                  data.formDate === fromDate && data.questionId === questionId
              )
              .map((data) => {
                let dataArray;
                if (Tab === "Water" || Tab === "Waste" || Tab === "Complaint" ) {
                  dataArray = data.answer;
                } else if (Tab === "Diversity" || Tab === "WDiversity") {
                  dataArray = data.percentage;
                } else {
                  dataArray = data.energyAndEmission;
                }

                return Tab === "Diversity" || Tab === "WDiversity" || Tab === "Complaint" 
                  ? Number(dataArray[rowIndex][columnIndex])
                  : Tab === "Waste"
                  ? dataArray.reduce((innerSum, energyPair) => {
                      return (
                        innerSum +
                        energyPair.reduce((sum, value) => {
                          const numValue = parseFloat(value);
                          return sum + (isNaN(numValue) ? 0 : numValue);
                        }, 0)
                      );
                    }, 0)
                  : dataArray.reduce((innerSum, pair) => {
                      const value =
                        Tab === "Emission" ? Number(pair[1]) : Number(pair[0]);
                      if (isNaN(value) || value === "") {
                        return innerSum;
                      } else {
                        return innerSum + value;
                      }
                    }, 0);
              })
              .reduce((accum, curr) => accum + curr, 0);

            actualValues.push(energy);

            // Determine index for targetData based on title
            let targetIndex;
            if (title === "Non-Renewable Energy Consumption") {
              targetIndex = 1;
            } else {
              targetIndex = 0;
            }

            // Calculate target values
            const targetEnergy = graphData
              .filter((data) => data.formDate === fromDate)
              .map((data) => {
                const target =
                  Tab === "Emission" ? 0 : data.targetData?.[targetIndex]?.[0];
                const value = Number(target);
                if (isNaN(value)) {
                  return 0;
                } else {
                  return value;
                }
              })
              .reduce((accum, curr) => accum + curr, 0);

            upperLimitValues.push((targetEnergy / 2) * 1.2);
            lowerLimitValues.push((targetEnergy / 2) * 0.8);

            // Assign color
            colors.push("#3B82F6");
          });

          // Process second period group
          Object.keys(compareTCurrentimePeriods).forEach((period, index) => {
            const fromDate = compareTCurrentimePeriods[period];
            const periodLabel = `${
              financialYear[financialYear.length - 1].financial_year_value
            } (${period})`;
            categories.push(periodLabel);

            // Determine the correct question ID
            let questionId;
            if (
              title === "Non-Renewable Energy Consumption" ||
              title === "Emission"
            ) {
              questionId = 452;
            } else if (title === "Water Withdrawal") {
              questionId = 301;
            } else if (title === "Water Discharge") {
              questionId = 310;
            } else if (title === "Waste Generated") {
              questionId = 458;
            } else if (title === "Waste Recovered") {
              questionId = 459;
            } else if (Tab === "Diversity") {
              questionId = "26_46";
            } else if (Tab === "WDiversity") {
              questionId = "28_48";
            } else if (Tab === "Complaint") {
              questionId = 211;
            } else {
              questionId = 451;
            }

            // Calculate actual values
            const energy = graphData
              .filter(
                (data) =>
                  data.formDate === fromDate && data.questionId === questionId
              )
              .map((data) => {
                let dataArray;
                if (Tab === "Water" || Tab === "Waste" || Tab === "Complaint") {
                  dataArray = data.answer;
                } else if (Tab === "Diversity" || Tab === "WDiversity") {
                  dataArray = data.percentage;
                } else {
                  dataArray = data.energyAndEmission;
                }

                return Tab === "Diversity" || Tab === "WDiversity" || Tab === "Complaint"
                  ? Number(dataArray[rowIndex][columnIndex])
                  : Tab === "Waste"
                  ? dataArray.reduce((innerSum, energyPair) => {
                      return (
                        innerSum +
                        energyPair.reduce((sum, value) => {
                          const numValue = parseFloat(value);
                          return sum + (isNaN(numValue) ? 0 : numValue);
                        }, 0)
                      );
                    }, 0)
                  : dataArray.reduce((innerSum, pair) => {
                      const value =
                        Tab === "Emission" ? Number(pair[1]) : Number(pair[0]);
                      if (isNaN(value) || value === "") {
                        return innerSum;
                      } else {
                        return innerSum + value;
                      }
                    }, 0);
              })
              .reduce((accum, curr) => accum + curr, 0);

            actualValues.push(energy);

            // Determine index for targetData
            let targetIndex;
            if (title === "Non-Renewable Energy Consumption") {
              targetIndex = 1;
            } else {
              targetIndex = 0;
            }

            // Calculate target values
            const targetEnergy = graphData
              .filter((data) => data.formDate === fromDate)
              .map((data) => {
                const target =
                  Tab === "Emission" ? 0 : data.targetData?.[targetIndex]?.[0];
                const value = Number(target);
                if (isNaN(value)) {
                  return 0;
                } else {
                  return value;
                }
              })
              .reduce((accum, curr) => accum + curr, 0);

            upperLimitValues.push((targetEnergy / 2) * 1.2);
            lowerLimitValues.push((targetEnergy / 2) * 0.8);

            // Assign color
            colors.push("#E84A86"); // Pink-ish color for this group
          });

          // Update chart data
          setChartData({
            categories,
            values: actualValues,
            upperLimits: upperLimitValues,
            lowerLimits: lowerLimitValues,
            colors,
          });
        }
      }
    }, [
      compareLastTimePeriods,
      compareTCurrentimePeriods,
      graphData,
      title,
      financialYear,
      periodMode,
    ]);

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
        const combinedText = `${Tab} in ${unit}`; // Changed to match the image
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
    const calculatedMaxValue =
      Math.max(
        ...chartData.values,
        ...chartData.upperLimits,
        ...chartData.lowerLimits,
        4
      ) * 1.2 || 1000; // Default to 1000 if no data

    if (!graphData || graphData.length === 0) {
      return (
        <div className="container">
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            No Data Available
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          position: "relative",
          marginBottom: "30px", // Increased from 60px to 75px to accommodate the larger bottom spacing
          paddingLeft: "70px",
          paddingRight: "30px",
          height: "400px",
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
          {Tab} in {unit}
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
          <svg
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
            }}
          >
            {/* Create lines between max target points */}
            {chartData.categories.map((category, index) => {
              if (index >= chartData.categories.length - 1) return null;

              const segmentWidth = 100 / chartData.categories.length;
              const x1 = index * segmentWidth + segmentWidth / 2;
              const y1 =
                chartData.upperLimits[index] > 0
                  ? 100 -
                    (chartData.upperLimits[index] / calculatedMaxValue) * 100
                  : 100;

              const x2 = (index + 1) * segmentWidth + segmentWidth / 2;
              const y2 =
                chartData.upperLimits[index + 1] > 0
                  ? 100 -
                    (chartData.upperLimits[index + 1] / calculatedMaxValue) *
                      100
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
              const x1 = index * segmentWidth + segmentWidth / 2;
              const y1 =
                chartData.lowerLimits[index] > 0
                  ? 100 -
                    (chartData.lowerLimits[index] / calculatedMaxValue) * 100
                  : 100;

              const x2 = (index + 1) * segmentWidth + segmentWidth / 2;
              const y2 =
                chartData.lowerLimits[index + 1] > 0
                  ? 100 -
                    (chartData.lowerLimits[index + 1] / calculatedMaxValue) *
                      100
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
              const xPos = index * segmentWidth + segmentWidth / 2;

              const maxYPos =
                chartData.upperLimits[index] > 0
                  ? 100 -
                    (chartData.upperLimits[index] / calculatedMaxValue) * 100
                  : 100;

              const minYPos =
                chartData.lowerLimits[index] > 0
                  ? 100 -
                    (chartData.lowerLimits[index] / calculatedMaxValue) * 100
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
          {Array.from(
            { length: chartData.categories.length + 1 },
            (_, index) => (
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
            )
          )}
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
            const heightPercent =
              calculatedMaxValue > 0 ? (value / calculatedMaxValue) * 100 : 0;

            const minTarget = chartData.lowerLimits[index] || 0;
            const maxTarget = chartData.upperLimits[index] || 0;

            // Calculate percentage of total
            const percentOfTotal =
              actualSum > 0 ? (value / actualSum) * 100 : 0;

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
                      backgroundColor:
                        index < chartData.colors.length
                          ? chartData.colors[index]
                          : "#791e80",
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
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    title={`${category}: ${
                      typeof value === "number" && !isNaN(value)
                        ? value.toFixed(1)
                        : "N/A"
                    } ${unit}
Min Target: ${
                      typeof minTarget === "number" && !isNaN(minTarget)
                        ? minTarget.toFixed(1) + " " + unit
                        : "N/A"
                    }
Max Target: ${
                      typeof maxTarget === "number" && !isNaN(maxTarget)
                        ? maxTarget.toFixed(1) + " " + unit
                        : "N/A"
                    }
${
  actualSum && actualSum > 0 ? `(${percentOfTotal.toFixed(1)}% of total)` : ""
}`}
                  />
                </div>

                {/* X-axis label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-45px", // Increased gap from -30px to -45px
                    width: "100px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    color:
                      index < chartData.colors.length
                        ? chartData.colors[index]
                        : "#791e80",
                    height: "38px",
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
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header with title and view options in one row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Title taking 65% of space */}
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            width: "65%",
          }}
        >
          {title || "Product Wise Water Consumption"}
        </h2>

        {/* Combined/Separate options taking 35% of space */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "35%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <label
              onClick={() => setPeriodMode("combined")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
                color: periodMode === "combined" ? "#000" : "#666",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor:
                    periodMode === "combined" ? "#3B82F6" : "transparent",
                  border:
                    periodMode === "combined"
                      ? "2px solid white"
                      : "2px solid #666",
                  boxShadow:
                    periodMode === "combined" ? "0 0 0 2px #3B82F6" : "none",
                }}
              ></span>
              Combined
            </label>

            <label
              onClick={() => setPeriodMode("separate")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
                color: periodMode === "separate" ? "#000" : "#666",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor:
                    periodMode === "separate" ? "#3B82F6" : "transparent",
                  border:
                    periodMode === "separate"
                      ? "2px solid white"
                      : "2px solid #666",
                  boxShadow:
                    periodMode === "separate" ? "0 0 0 2px #3B82F6" : "none",
                }}
              ></span>
              Separate
            </label>
          </div>
        </div>
      </div>

      {/* The chart itself */}
      <CustomChart
        compareLastTimePeriods={compareLastTimePeriods}
        locationOption={locationOption}
        compareTCurrentimePeriods={compareTCurrentimePeriods}
        graphData={graphData}
        financialYear={financialYear}
        title={title}
        periodMode={periodMode}
      />
    </div>
  );
};

export default CompareToPreviousYear;
