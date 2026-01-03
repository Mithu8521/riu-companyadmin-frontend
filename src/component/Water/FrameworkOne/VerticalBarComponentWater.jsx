import React, { useEffect, useState, useMemo } from "react";
import Select, { components } from "react-select";
import no from "../../../img/no.png";

const VerticalBarComponentWater = ({ matchedDataWater, title, com }) => {
  const colors = [  
    "#E6594D", // Red
    "#3F822B", // Green
    "#1212F1", // Blue
    "#EEC27F", // Orange
    "#A14D49", // Brown
    "#791E80"  // Purple
  ]; 
  
  // Total bar color
  const totalBarColor = "#791E80"; // Purple
  // Min/Max target indicator colors
  const maxTargetColor = "#FF0000"; // Red for max
  const minTargetColor = "#00AA00"; // Green for min

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({});
  const [minTargets, setMinTargets] = useState({});
  const [maxTargets, setMaxTargets] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalMinTarget, setTotalMinTarget] = useState(0);
  const [totalMaxTarget, setTotalMaxTarget] = useState(0);
  const [actualSum, setActualSum] = useState(0); // Store actual sum for percentage calculations
  const [maxValue, setMaxValue] = useState(0);
  const [hoveredBar, setHoveredBar] = useState(null);
  const maxProductsAllowed = 5;

  // Get unit based on data type
  const getUnit = () => {
    return "KL";
  };

  const recoverySeries = useMemo(() => {
    if (matchedDataWater) {
      if (com === "non") {
        return (
          matchedDataWater[0]?.question_details
            .filter(
              (detail) =>
                detail.option_type === "row" || detail.option_type === "row"
            )
            .map((detail) => detail.option)
            .reverse()
        );
      } else {
        return (
          matchedDataWater[0]?.question_details
            .filter(
              (detail) =>
                detail.option_type === "row" || detail.option_type === "row"
            )
            .map((detail) => detail.option)
            .reverse()
        );
      }
    }
  }, [matchedDataWater, com]);

  const productOptions = useMemo(() => {
    if (recoverySeries) {
      return recoverySeries.map((product, index) => ({
        value: product,
        label: product,
        color: colors[index % colors.length],
      }));
    }
  }, [recoverySeries]);

  // Set selectedProducts to the first 5 options
  useEffect(() => {
    if (productOptions) {
      if (productOptions.length > 0) {
        const firstFiveProducts = productOptions.slice(0, maxProductsAllowed);
        setSelectedProducts(firstFiveProducts);
      }
    }
  }, [productOptions]);

  // Calculate aggregated data when selection changes
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const aggregated = selectedProducts.reduce((acc, product) => {
        acc[product.value] = 0; // Initialize each product value to 0
        return acc;
      }, {});

      const minTargetValues = selectedProducts.reduce((acc, product) => {
        acc[product.value] = 0; // Initialize each product min target to 0
        return acc;
      }, {});

      const maxTargetValues = selectedProducts.reduce((acc, product) => {
        acc[product.value] = 0; // Initialize each product max target to 0
        return acc;
      }, {});

      const dataSource = matchedDataWater;

      dataSource.forEach((item) => {
        const answers = item.answer && Array.isArray(item.answer) ? item.answer : [];
        const minTargetData = item.minTarget && Array.isArray(item.minTarget) ? item.minTarget : [];
        const maxTargetData = item.maxTarget && Array.isArray(item.maxTarget) ? item.maxTarget : [];

        answers.forEach((answerArray, index) => {
          const recoveryType = recoverySeries[index];
          const value = answerArray[0]; // First element corresponds to recoverySeries value

          // Apply conditions to check and parse value
          const numericValue =
            value === "NA" ||
            value === "No" ||
            value === "Yes" ||
            value === "" ||
            value === "KWH" ||
            !value
              ? 0
              : parseFloat(value);

          // Extract min and max targets for this index
          const minTargetValue = minTargetData.length > 0 && minTargetData[0]?.length > index
            ? parseFloat(minTargetData[0][index]) || 0 
            : 0;
            
          const maxTargetValue = maxTargetData.length > 0 && maxTargetData[0]?.length > index
            ? parseFloat(maxTargetData[0][index]) || 0
            : 0;

          // Only aggregate if the recoveryType is in selectedProducts
          if (
            selectedProducts.some((product) => product.label === recoveryType)
          ) {
            aggregated[recoveryType] += numericValue;
            minTargetValues[recoveryType] += minTargetValue;
            maxTargetValues[recoveryType] += maxTargetValue;
          }
        });
      });

      // Calculate the actual sum of the selected products
      const sum = Object.values(aggregated).reduce(
        (total, value) => total + value,
        0
      );
      
      // Calculate total min and max targets
      const totalMin = Object.values(minTargetValues).reduce(
        (total, value) => total + value,
        0
      );
      
      const totalMax = Object.values(maxTargetValues).reduce(
        (total, value) => total + value,
        0
      );
      
      // Store actual sum for display and percentage calculations
      setActualSum(sum);
      setTotalMinTarget(totalMin);
      setTotalMaxTarget(totalMax);

      // Find the appropriate scale for the chart - use max of actual values, min targets, and max targets
      const maxProductValue = Math.max(
        ...Object.values(aggregated),
        ...Object.values(maxTargetValues),
        0
      );
      const chartMaxValue = Math.max(sum, maxProductValue, totalMax);
      
      // For scale, use adjusted value to get nice round numbers
      const adjustedMaxValue = adjustAndRoundTotalSum(chartMaxValue);

      setAggregatedData(aggregated);
      setMinTargets(minTargetValues);
      setMaxTargets(maxTargetValues);
      setTotalSum(sum);
      setMaxValue(adjustedMaxValue);
    }
  }, [selectedProducts, recoverySeries, matchedDataWater, com]);

  // Function to get nice round numbers for scale
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

  // Function to truncate product names for display
  const truncateProductName = (name, maxLength = 12) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Format value based on magnitude
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
    } else if (value >= 10) {
      return value.toFixed(0); // Format larger numbers without decimal
    } else if (value === 0) {
      return "0";
    } else {
      return value.toFixed(2); // Format small numbers with 2 decimals
    }
  };

  const handleProductChange = (selectedOptions) => {
    if (selectedOptions.length > maxProductsAllowed) {
      alert(`You can only select up to ${maxProductsAllowed} products.`);
      return;
    }

    if (selectedOptions.length < 1) {
      alert("You have to select at least 1 option");
      return;
    }

    setSelectedProducts(selectedOptions || []);
  };

  // Custom components for React Select
  const CustomClearIndicator = () => null;

  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Square Box */}
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #3f88a5",
              borderRadius: "2px",
              backgroundColor: isSelected ? "transparent" : "transparent",
              marginRight: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Tick mark when selected */}
            {isSelected && (
              <span style={{ color: "white", fontSize: "14px" }}>✔</span>
            )}
          </div>
          {/* Option Label */}
          <span style={{ fontSize: "14px", fontWeight: 300 }}>
            {data.label}
          </span>
        </div>
      </components.Option>
    );
  };

  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value, placeholder } = selectProps;

    return (
      <components.Control {...props}>
        {/* Placeholder or selected value */}
        {(!value || value.length === 0) && (
          <div
            style={{
              color: "#3f88a5",
              fontWeight: 600,
              fontSize: "13px",
              position: "absolute",
              left: "5px",
              pointerEvents: "none",
            }}
          >
            {/* {placeholder} */}
          </div>
        )}
        {/* Display only the first selected product */}
        {value && value.length > 0 && (
          <div style={{ color: "#3f88a5", marginLeft: "5px" }}>
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  if (!matchedDataWater || matchedDataWater.length === 0) {
    return (
      <div className="container">
        <img
          src={no}
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

  return (
    <div
      className="renewable-bar-container"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="renewable-bar-header"
        style={{
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div style={{ width: "50%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
          {title}
        </div>
        <div style={{ width: "40%" }}>
          <Select
            options={productOptions}
            onChange={handleProductChange}
            isMulti
            value={productOptions?.filter((option) =>
              selectedProducts.some(
                (selectedProduct) => selectedProduct.value === option.value
              )
            )}
            placeholder={`Select products`}
            hideSelectedOptions={false}
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator,
            }}
            closeMenuOnSelect={false}
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#3f88a5",
                padding: "0 10px",
                fontSize: "20px",
                minHeight: "20px",
                minWidth: "20px",
              }),
              placeholder: (base) => ({
                ...base,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }),
              multiValue: (base) => ({
                ...base,
                background: "transparent",
                border: "2px solid #3f88a5",
                borderRadius: "10px",
                marginTop: "0.5em",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "transparent"
                  : state.isFocused
                  ? "white"
                  : "white",
                color: state.isSelected ? "black" : "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      {/* Legend for min/max targets */}
      <div style={{ 
        display: "flex", 
        justifyContent: "flex-end", 
        alignItems: "center", 
        marginBottom: "10px",
        gap: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ 
            width: "15px", 
            height: "3px", 
            backgroundColor: minTargetColor, 
            marginRight: "5px" 
          }}></div>
          <span style={{ fontSize: "12px" }}>Min Target</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ 
            width: "15px", 
            height: "3px", 
            backgroundColor: maxTargetColor, 
            marginRight: "5px" 
          }}></div>
          <span style={{ fontSize: "12px" }}>Max Target</span>
        </div>
      </div>

      {selectedProducts && selectedProducts.length > 0 && (
        <>
          <div
            className="vertical-bar-chart-container"
            style={{
              position: "relative",
              height: "100%",
              marginTop: "20px",
              marginBottom: "40px",
              paddingLeft: "70px" // Space for y-axis and label
            }}
          >
            {/* Y-axis vertical label */}
            <div style={{ 
              position: "absolute", 
              left: "-22px", 
              top: "50%", 
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center",
              fontWeight: "400",
              fontSize: "14px",
              color: "#333",
              textAlign: "center",
              whiteSpace: "nowrap"
            }}>
              Water in {getUnit()}
            </div>

            {/* Y-axis labels and scale */}
            <div style={{ 
              position: "absolute", 
              left: "30px", 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between", 
              alignItems: "flex-end",
              paddingRight: "10px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(maxValue)}</div>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(maxValue * 0.75)}</div>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(maxValue * 0.5)}</div>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(maxValue * 0.25)}</div>
              <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>0</div>
            </div>

            {/* Grid lines */}
            <div style={{ 
              position: "absolute", 
              left: "70px",
              width: "calc(100% - 70px)", 
              height: "100%", 
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
              zIndex: 0
            }}>
              <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
              <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
              <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
              <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
              <div style={{ width: "100%", borderBottom: "1px solid #ccc" }}></div>
            </div>

            {/* Y-axis vertical line */}
            <div style={{
              position: "absolute",
              left: "70px",
              width: "1px",
              height: "100%",
              backgroundColor: "#ccc",
              zIndex: 1
            }}></div>

            {/* Bar chart area */}
            <div style={{ 
              display: "flex", 
              width: "calc(100% - 70px)", 
              height: "100%", 
              alignItems: "flex-end", 
              justifyContent: "space-around",
              position: "relative",
              zIndex: 2
            }}>
              {/* Product bars */}
              {selectedProducts.map((product, index) => {
                const value = aggregatedData[product.value] || 0;
                const minTarget = minTargets[product.value] || 0;
                const maxTarget = maxTargets[product.value] || 0;
                
                const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const minTargetPercent = maxValue > 0 ? (minTarget / maxValue) * 100 : 0;
                const maxTargetPercent = maxValue > 0 ? (maxTarget / maxValue) * 100 : 0;
                
                // Handle long display names
                const displayLabel = product.value === "Seawater / desalinated water" 
                  ? "Seawater" 
                  : product.value === "Sent to other parties"
                  ? "Other Parties"
                  : product.value === "Other disposal operations"
                  ? "Other"
                  : product.value;
                
                // Calculate percentage of total
                const percentOfTotal = actualSum > 0 ? (value / actualSum * 100) : 0;
                
                return (
                  <div 
                    key={index}
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      width: `${100 / (selectedProducts.length + 1)}%`, 
                      height: "100%",
                      position: "relative"
                    }}
                  >
                    <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      {/* Value label */}
                      {value > 0 && (
                        <div style={{
                          position: "absolute",
                          top: `calc(100% - ${heightPercent}% - 25px)`,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "center",
                          whiteSpace: "nowrap"
                        }}>
                          {formatValue(value)}
                        </div>
                      )}
                      
                      {/* Bar with hover effect */}
                      <div 
                        style={{
                          height: `${heightPercent}%`,
                          width: "60px",
                          backgroundColor: product.color,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          minHeight: value > 0 ? "2px" : "0",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          cursor: "pointer",
                          transition: "opacity 0.2s ease",
                          opacity: hoveredBar && hoveredBar !== product.value ? 0.7 : 1,
                          position: "relative"
                        }}
                        onMouseEnter={() => {
                          setHoveredBar(product.value);
                        }}
                        onMouseLeave={() => {
                          setHoveredBar(null);
                        }}
                        title={`${displayLabel}: ${value.toFixed(2)} ${getUnit()} (${percentOfTotal.toFixed(1)}% of total)
Min Target: ${minTarget.toFixed(2)} ${getUnit()}
Max Target: ${maxTarget.toFixed(2)} ${getUnit()}`}
                      >
                        {/* Min Target indicator */}
                        {minTarget > 0 && (
                          <div style={{
                            position: "absolute",
                            bottom: `${minTargetPercent / heightPercent * 100}%`,
                            width: "70px",
                            height: "3px",
                            backgroundColor: minTargetColor,
                            zIndex: 10
                          }}></div>
                        )}
                        
                        {/* Max Target indicator */}
                        {maxTarget > 0 && (
                          <div style={{
                            position: "absolute",
                            bottom: `${maxTargetPercent / heightPercent * 100}%`,
                            width: "70px",
                            height: "3px",
                            backgroundColor: maxTargetColor,
                            zIndex: 10
                          }}></div>
                        )}
                      </div>
                      
                      {/* Standalone Min/Max Target indicators (when value bar is too small or zero) */}
                      {(value === 0 || heightPercent < minTargetPercent) && minTarget > 0 && (
                        <div style={{
                          position: "absolute",
                          bottom: `${minTargetPercent}%`,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "70px",
                          height: "3px",
                          backgroundColor: minTargetColor,
                          zIndex: 5
                        }}></div>
                      )}
                      
                      {(value === 0 || heightPercent < maxTargetPercent) && maxTarget > 0 && (
                        <div style={{
                          position: "absolute",
                          bottom: `${maxTargetPercent}%`,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "70px",
                          height: "3px",
                          backgroundColor: maxTargetColor,
                          zIndex: 5
                        }}></div>
                      )}
                    </div>
                    
                    {/* X-axis label */}
                    <div style={{
                      position: "absolute",
                      bottom: "-30px", // Position below the bar
                      width: "70px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: product.color
                    }} title={displayLabel}>
                      {truncateProductName(displayLabel)}
                    </div>
                  </div>
                );
              })}

              {/* Total bar */}
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  width: `${100 / (selectedProducts.length + 1)}%`, 
                  height: "100%",
                  position: "relative"
                }}
              >
                <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  {/* Value label */}
                  {actualSum > 0 && (
                    <div style={{
                      position: "absolute",
                      top: `calc(100% - ${(actualSum / maxValue) * 100}% - 25px)`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap"
                    }}>
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
                      opacity: hoveredBar && hoveredBar !== 'total' ? 0.7 : 1,
                      position: "relative"
                    }}
                    onMouseEnter={() => {
                      setHoveredBar('total');
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                    }}
                    title={`Total: ${actualSum.toFixed(2)} ${getUnit()}
Min Target: ${totalMinTarget.toFixed(2)} ${getUnit()}
Max Target: ${totalMaxTarget.toFixed(2)} ${getUnit()}`}
                  >
                    {/* Min Target indicator on total bar */}
                    {totalMinTarget > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: `${(totalMinTarget / actualSum) * 100}%`,
                        width: "70px",
                        height: "3px",
                        backgroundColor: minTargetColor,
                        zIndex: 10
                      }}></div>
                    )}
                    
                    {/* Max Target indicator on total bar */}
                    {totalMaxTarget > 0 && (
                      <div style={{
                        position: "absolute",
                        bottom: `${(totalMaxTarget / actualSum) * 100}%`,
                        width: "70px",
                        height: "3px",
                        backgroundColor: maxTargetColor,
                        zIndex: 10
                      }}></div>
                    )}
                  </div>
                  
                  {/* Standalone Min/Max Target indicators for total bar */}
                  {(actualSum === 0 || (actualSum / maxValue) * 100 < (totalMinTarget / maxValue) * 100) && totalMinTarget > 0 && (
                    <div style={{
                      position: "absolute",
                      bottom: `${(totalMinTarget / maxValue) * 100}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70px",
                      height: "3px",
                      backgroundColor: minTargetColor,
                      zIndex: 5
                    }}></div>
                  )}
                  
                  {(actualSum === 0 || (actualSum / maxValue) * 100 < (totalMaxTarget / maxValue) * 100) && totalMaxTarget > 0 && (
                    <div style={{
                      position: "absolute",
                      bottom: `${(totalMaxTarget / maxValue) * 100}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "70px",
                      height: "3px",
                      backgroundColor: maxTargetColor,
                      zIndex: 5
                    }}></div>
                  )}
                </div>
                
                {/* X-axis label for total */}
                <div style={{
                  position: "absolute",
                  bottom: "-30px",
                  width: "70px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: totalBarColor
                }}>
                  Total
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VerticalBarComponentWater;