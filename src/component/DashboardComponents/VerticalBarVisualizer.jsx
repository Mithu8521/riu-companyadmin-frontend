import React, { useEffect, useRef, useState } from "react";

// Function to clean up product titles
const cleanProductTitle = (title) => {
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (word) => {
      // Preserve apostrophes and capitalize the first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  if (!title) return "";
  if (title.startsWith("Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)")) {
    return "Non-Plastic-Cardboard waste";
  }
  if (
    title.startsWith(
      "Electricity Power plant (Captive Power Plant - Natural Gas)"
    )
  ) {
    return "Electricity Power Plant";
  }

  if (
    title.startsWith(
      "Current employees by Gender (in %) Male"
    )
  ) {
    return "Current employees by Gender Male";
  }

  if (
    title.startsWith(
      "Current employees by Gender (in %) Female"
    )
  ) {
    return "Current employees by Gender Female";
  }

  if (
    title.startsWith(
      "Revenue (In Cr)"
    )
  ) {
    return "Revenue (In Cr)";
  }

  if (
    title.startsWith(
      "Total Built-up Area (sq. ft)"
    )
  ) {
    return "Built-up Area (sq. ft)";
  }

  if (
    title.startsWith("Electricity consumption from Renewable energy (via PPA)")
  ) {
    return "Renewable Energy (via PPA)";
  }

  if (
    title.startsWith(
      "Electricity consumption from Renewable energy (rooftop solar)"
    )
  ) {
    return "Renewable Energy (Rooftop Solar)";
  }
  if (title.startsWith("Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)")) {
    return "Non-Plastic-Paper waste";
  }

  if (title.startsWith("Total packaging waste (Plastic) generated* (Kg)")) {
    return "Plastic";
  }
  // Special case for specific acronyms
  if (title.startsWith("PF (")) {
    return "PF";
  }

  if (title.startsWith("ESI (")) {
    return "ESI";
  }

  if (title.startsWith("Others (please")) {
    return "Others";
  }

  if (title.startsWith("Groundwater")) {
    return "Ground Water";
  }

  if (title.startsWith("Surface water")) {
    return "Surface Water";
  }

  if (title.startsWith("Third-party water")) {
    return "Third Party Water";
  }

  if (title.startsWith("Municipal water")) {
    return "Municipal Water";
  }

  if (title.startsWith("Seawater / desalinated water")) {
    return "SeaWater/Desalinated Water ";
  }

  if (title.startsWith("Construction and demolition")) {
    return "Construction and Demolition";
  }

  if (title.startsWith("To Surface water")) {
    return "Surface Water";
  }

  if (title.startsWith("To Groundwater")) {
    return "Ground Water";
  }

  if (title.startsWith("To Sea water")) {
    return "Sea Water";
  }

  if (title.startsWith("Sent to other parties")) {
    return "Sent to other Parties";
  }

  if (title.startsWith("Others")) {
    return "Other";
  }

  if (title.startsWith("Other recovery operations")) {
    return "Other Recovery Operation";
  }

  if (title.startsWith("Energy Consumption through other sources")) {
    return "Energy Consumption from Other Source";
  }

  if (title.startsWith("Lost Time Injury Frequency Rate (LTIFR) (per one million-person hours worked)")) {
    return "LTIFR";
  }

  if (title.startsWith("Number of permanent employees who received training on the above topic")) {
    return "Permanent";
  }

  if (title.startsWith("Number of other than permanent employees who received training on the above topic")) {
    return "Other than Permanent";
  }

  if (title.startsWith("Total Recordable Work-Related Injuries")) {
    return "Work Related Injury";
  }

  if (title.startsWith("High Consequence Work-Related Injury or Ill-Health (excluding fatalities)")) {
    return "High Consequence Work Related Injury";
  }

  if (title.startsWith("Filed During the Year")) {
    return "Filed During year";
  }

  if (title.startsWith("Pending Resolution at the End of Year")) {
    return "Pending Resolution at the EOY";
  }

  if (title.startsWith("Total Bed Days Or Occupied Beds")) {
    return "Operating beds";
  }

  // Handle other acronyms
  const acronymMatch = title.match(/^([A-Z]{2,})\s*\(/);
  if (acronymMatch) {
    return acronymMatch[1];
  }

  // Remove "Total" from the beginning if present
  let cleanedTitle = title.replace(/^Total\s+/i, '');

  // Remove "Number of" from the beginning if present
  cleanedTitle = cleanedTitle.replace(/^Number\s+of\s+/i, '');

  // Remove everything after and including parenthesis if present
  cleanedTitle = cleanedTitle.split(/\s*\(/)[0].trim();

  // Remove everything after and including asterisk (*) if present
  cleanedTitle = cleanedTitle.split('*')[0].trim();
  return toTitleCase(cleanedTitle);
};

const VerticalBarVisualizer = ({
  selectedProducts,
  aggregatedData,
  maxValue,
  actualSum,
  currentTriggerValues,
  unit,
  tab,
  minTargets,
  maxTargets,
  type,
  showTotal = true // Add showTotal prop with default value
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Use the showTotal prop instead of the hardcoded logic
  const showTotalBar = showTotal && type !== "GENDERDIV" && type !== "AGEDIV";

  // Define colors for total bar and triggers
  const totalBarColor = "#791E80"; // Purple (original)
  const minTriggerColor = "#4CAF50"; // Green for min trigger dotted line
  const maxTriggerColor = "#F44336"; // Red for max trigger dotted line

  // Format value based on magnitude
  const formatValue = (value) => {
    // For values over 1 million
    if (value >= 1e6) {
      if (value === 1e6 || Math.floor(value / 1e6) === value / 1e6) {
        return `${Math.floor(value / 1e6)}M`;
      } else {
        return `${(value / 1e6).toFixed(1)}M`;
      }
    }

    // For values over 1 thousand
    else if (value >= 1e3) {
      if (value === 1e3 || Math.floor(value / 1e3) === value / 1e3) {
        return `${Math.floor(value / 1e3)}K`;
      } else {
        return `${(value / 1e3).toFixed(1)}K`;
      }
    }

    // Value is exactly zero
    else if (value === 0) {
      return "0";
    }

    // Value is less than 1
    else if (value < 1) {
      return value.toFixed(4).replace(/\.?0+$/, ""); // Remove trailing zeros
    }

    // Value between 1 and 999
    else {
      return Math.round(value).toString();
    }
  };


  // Function to format product name to fit in 3 lines
  const formatMultilineLabel = (name) => {
    if (!name) return "";
    const cleanedName = cleanProductTitle(name);

    // Approximate characters per line (based on average character width)
    const charsPerLine = 12;
    const maxLines = 3;
    const maxTotalChars = charsPerLine * maxLines;

    if (cleanedName.length <= maxTotalChars) {
      return cleanedName;
    } else {
      // Truncate with ellipsis if longer than 3 lines worth
      return cleanedName.substring(0, maxTotalChars - 3) + "...";
    }
  };

  // Calculate the number of grid lines for better control
  const numGridLines = 5;
  const gridLineIntervals = Array.from(
    { length: numGridLines },
    (_, i) => (numGridLines - 1 - i) / (numGridLines - 1)
  );
  const [leftPosition, setLeftPosition] = useState("-28px");
  const labelRef = useRef(null);
  useEffect(() => {
    if (labelRef.current) {
      // Check the combined length of tab and unit
      const combinedText = unit ? `${tab} In ${unit}` : `${tab}`;

      if (combinedText.length > 15) {
        setLeftPosition("-50px");
      } else {
        setLeftPosition("-31px");
      }
    }
  }, [tab, unit]);

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        marginBottom: "60px", // Increased to accommodate 3-line labels
        paddingLeft: "70px", // Space for y-axis and label
        paddingRight: "30px", // Adjusted right padding
        height: "30vh",
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
        {unit ? `${tab} In ${unit}` : tab}
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
            {formatValue(maxValue * interval)}
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
              borderBottom: "1px dashed #ccc", // Return to original dashed grid lines
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
          {/* Create lines between max target points including connecting last product to total */}
          {showTotalBar && selectedProducts.map((product, index) => {
            // Skip if no product or it's invalid
            if (!product || !product.value) return null;

            // Connect the last product to the total bar
            if (index === selectedProducts.length - 1) {
              const segmentWidth = 100 / (selectedProducts.length + 1);
              const x1 = (index * segmentWidth) + (segmentWidth / 2);

              // Calculate current point position (could be 0)
              const maxTargetValue = (maxTargets && maxTargets[product.value]) || 0;
              const y1 = maxTargetValue > 0
                ? 100 - ((maxTargetValue / maxValue) * 100)
                : 100; // Bottom of chart if 0

              // Calculate total bar position
              const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
              const totalMaxValue = Object.values(maxTargets || {}).some(val => val > 0)
                ? Math.max(...Object.values(maxTargets))
                : 0;
              const y2 = totalMaxValue > 0
                ? 100 - ((totalMaxValue / maxValue) * 100)
                : 100;

              return (
                <line
                  key={`max-last-to-total-${index}`}
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
            }

            // Skip if this is the last product
            if (index >= selectedProducts.length - 1) return null;

            // Find next product
            const nextProduct = selectedProducts[index + 1];
            if (!nextProduct || !nextProduct.value) return null;

            // Calculate current point
            const segmentWidth = 100 / (selectedProducts.length + (showTotalBar ? 1 : 0));
            const x1 = (index * segmentWidth) + (segmentWidth / 2);
            // Use 0 if target value doesn't exist or is 0
            const maxTargetValue = (maxTargets && maxTargets[product.value]) || 0;
            const y1 = maxTargetValue > 0
              ? 100 - ((maxTargetValue / maxValue) * 100)
              : 100; // Bottom of chart if 0

            // Calculate next point
            const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
            const nextMaxTargetValue = (maxTargets && maxTargets[nextProduct.value]) || 0;
            const y2 = nextMaxTargetValue > 0
              ? 100 - ((nextMaxTargetValue / maxValue) * 100)
              : 100; // Bottom if 0

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

          {/* Create lines between min target points including connecting last product to total */}
          {showTotalBar && selectedProducts.map((product, index) => {
            // Skip if no product or it's invalid
            if (!product || !product.value) return null;

            // Connect the last product to the total bar
            if (index === selectedProducts.length - 1) {
              const segmentWidth = 100 / (selectedProducts.length + 1);
              const x1 = (index * segmentWidth) + (segmentWidth / 2);

              // Calculate current point position (could be 0)
              const minTargetValue = (minTargets && minTargets[product.value]) || 0;
              const y1 = minTargetValue > 0
                ? 100 - ((minTargetValue / maxValue) * 100)
                : 100; // Bottom of chart if 0

              // Calculate total bar position
              const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
              const totalMinValue = Object.values(minTargets || {}).some(val => val > 0)
                ? Math.max(...Object.values(minTargets))
                : 0;
              const y2 = totalMinValue > 0
                ? 100 - ((totalMinValue / maxValue) * 100)
                : 100;

              return (
                <line
                  key={`min-last-to-total-${index}`}
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
            }

            // Skip if this is the last product
            if (index >= selectedProducts.length - 1) return null;

            // Find next product
            const nextProduct = selectedProducts[index + 1];
            if (!nextProduct || !nextProduct.value) return null;

            // Calculate current point
            const segmentWidth = 100 / (selectedProducts.length + (showTotalBar ? 1 : 0));
            const x1 = (index * segmentWidth) + (segmentWidth / 2);
            // Use 0 if target value doesn't exist or is 0
            const minTargetValue = (minTargets && minTargets[product.value]) || 0;
            const y1 = minTargetValue > 0
              ? 100 - ((minTargetValue / maxValue) * 100)
              : 100; // Bottom of chart if 0

            // Calculate next point
            const x2 = ((index + 1) * segmentWidth) + (segmentWidth / 2);
            const nextMinTargetValue = (minTargets && minTargets[nextProduct.value]) || 0;
            const y2 = nextMinTargetValue > 0
              ? 100 - ((nextMinTargetValue / maxValue) * 100)
              : 100; // Bottom if 0

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
          {selectedProducts.map((product, index) => {
            if (product && product.value) {
              const segmentWidth = 100 / (selectedProducts.length + (showTotalBar ? 1 : 0));
              const xPos = (index * segmentWidth) + (segmentWidth / 2);

              // For max target points - show dots for all products, even with 0 target
              const maxTargetValue = (maxTargets && maxTargets[product.value]) || 0;
              const maxYPos = maxTargetValue > 0
                ? 100 - ((maxTargetValue / maxValue) * 100)
                : 100; // Bottom of chart if 0

              // For min target points - show dots for all products, even with 0 target
              const minTargetValue = (minTargets && minTargets[product.value]) || 0;
              const minYPos = minTargetValue > 0
                ? 100 - ((minTargetValue / maxValue) * 100)
                : 100; // Bottom of chart if 0

              return (
                <React.Fragment key={`dots-${index}`}>
                  {/* Max target dot */}
                  <circle
                    cx={`${xPos}%`}
                    cy={`${maxYPos}%`}
                    r="3"
                    fill="#F44336"
                  />

                  {/* Min target dot */}
                  <circle
                    cx={`${xPos}%`}
                    cy={`${minYPos}%`}
                    r="3"
                    fill="#4CAF50"
                  />
                </React.Fragment>
              );
            }
            return null;
          })}

          {/* Add total max target point only if showing total bar */}
          {showTotalBar && (
            <circle
              key="max-total"
              cx={`${(selectedProducts.length * (100 / (selectedProducts.length + 1))) + ((100 / (selectedProducts.length + 1)) / 2)}%`}
              cy={`${Object.values(maxTargets || {}).some(val => val > 0)
                ? 100 - (Math.max(...Object.values(maxTargets)) / maxValue) * 100
                : 100
                }%`}
              r="3"
              fill="#F44336"
            />
          )}

          {/* Add total min target point only if showing total bar */}
          {showTotalBar && (
            <circle
              key="min-total"
              cx={`${(selectedProducts.length * (100 / (selectedProducts.length + 1))) + ((100 / (selectedProducts.length + 1)) / 2)}%`}
              cy={`${Object.values(minTargets || {}).some(val => val > 0)
                ? 100 - (Math.max(...Object.values(minTargets)) / maxValue) * 100
                : 100
                }%`}
              r="3"
              fill="#4CAF50"
            />
          )}
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
        {Array.from({ length: selectedProducts.length + (showTotalBar ? 2 : 1) }, (_, index) => (
          <div
            key={index}
            style={{
              height: "100%",
              width: "1px",
              borderLeft: "1px dashed #ccc",
              position: "absolute",
              left: `${(index / (selectedProducts.length + (showTotalBar ? 1 : 0))) * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Bar chart area */}
      <div
        className="px-4"
        style={{
          display: "flex",
          height: "100%",
          alignItems: "flex-end",
          justifyContent: "space-around",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Product bars */}
        {selectedProducts.map((product, index) => {
          // Safely handle product values that might be undefined
          if (!product || !product.value) return null;

          const value = aggregatedData[product.value] || 0;
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

          // Safely access min and max target values with null checks for objects
          const minTarget = (minTargets && product.value in minTargets) ? minTargets[product.value] : 0;
          const maxTarget = (maxTargets && product.value in maxTargets) ? maxTargets[product.value] : 0;

          // Get product name for display - cleaned but not truncated
          const displayLabel = cleanProductTitle(
            product.value === "Energy Consumption through other sources"
              ? "Other Source"
              : product.value
          );

          // Calculate percentage of total
          const percentOfTotal = actualSum > 0 ? (value / actualSum) * 100 : 0;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: `${100 / (selectedProducts.length + (showTotalBar ? 1 : 0))}%`,
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
                    backgroundColor: product.color, // Use original product color
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    minHeight: value > 0 ? "2px" : "0",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                    opacity: hoveredBar && hoveredBar !== product.value ? 0.7 : 1,
                  }}
                  onMouseEnter={() => {
                    setHoveredBar(product.value);
                  }}
                  onMouseLeave={() => {
                    setHoveredBar(null);
                  }}
                  title={`${type?.endsWith("Intensity")
                    ? `Intensity: ${value ? value.toFixed(2) : "0"} ${unit} per ${displayLabel}`
                    : `${displayLabel}: ${value ? value.toFixed(2) : "0"} ${unit} ${actualSum && actualSum > 0
                      ? `(${percentOfTotal.toFixed(1)}% of total)`
                      : ""
                    }`
                    }
Min Target: ${minTarget ? minTarget.toFixed(2) + " " + unit : "N/A"}
Max Target: ${maxTarget ? maxTarget.toFixed(2) + " " + unit : "N/A"}`}
                />

              </div>

              {/* X-axis label - MULTI-LINE WITHOUT TILTING */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-50px", // Position below the bar
                  width: "80px", // Fixed width but wider than original
                  fontSize: "11px",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "normal", // Allow text to wrap
                  overflow: "hidden", // Hide overflow
                  color: product.color, // Use original product color
                  height: "40px", // Fixed height for 3 lines
                  lineHeight: "1.2", // Appropriate line height for small text
                  display: "-webkit-box", // Special display for line clamping
                  WebkitLineClamp: 3, // Limit to 3 lines
                  WebkitBoxOrient: "vertical", // Vertical orientation for line clamping
                }}
                title={displayLabel} // Full name as tooltip on hover
              >
                {formatMultilineLabel(product.value)}
              </div>
            </div>
          );
        })}

        {/* Total bar with min and max triggers - Only render if showTotalBar is true */}
        {showTotalBar && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: `${100 / (selectedProducts.length + 1)}%`,
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
              {/* Show min target indicator on total bar */}
              {minTargets && Object.keys(minTargets).length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(100% - ${(Math.max(...Object.values(minTargets)) / maxValue) * 100}%)`,
                    width: "60px",
                    height: "0px",
                    borderTop: "2px dashed #4CAF50",
                    zIndex: 3,
                  }}
                />
              )}

              {/* Value label for actual sum */}
              {actualSum > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(100% - ${(actualSum / maxValue) * 100}% - 25px)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatValue(actualSum)}
                </div>
              )}

              {/* Total Bar */}
              <div
                style={{
                  height: `${(actualSum / maxValue) * 100}%`,
                  width: "60px",
                  backgroundColor: totalBarColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: actualSum > 0 ? "2px" : "0",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  opacity: hoveredBar && hoveredBar !== "total" ? 0.7 : 1,
                }}
                onMouseEnter={() => {
                  setHoveredBar("total");
                }}
                onMouseLeave={() => {
                  setHoveredBar(null);
                }}
                title={`Total: ${actualSum ? actualSum.toFixed(2) : '0'} ${unit}
Min Target: ${minTargets && Object.keys(minTargets).length > 0 ? Math.max(...Object.values(minTargets)).toFixed(2) + ' ' + unit : 'N/A'}
Max Target: ${maxTargets && Object.keys(maxTargets).length > 0 ? Math.max(...Object.values(maxTargets)).toFixed(2) + ' ' + unit : 'N/A'}`}
              ></div>
            </div>

            {/* X-axis label for total */}
            <div
              style={{
                position: "absolute",
                bottom: "-25px",
                width: "80px", // Match width with product labels
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center",
                color: totalBarColor,
              }}
            >
              Total
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default VerticalBarVisualizer;