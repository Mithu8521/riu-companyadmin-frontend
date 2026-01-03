import React, { useState, useMemo, useEffect } from "react";
import Select, { components } from "react-select";
import noDataImage from "../../../img/no.png";

const VerticalEnergyBarComponent = ({
  renewableEnergy,
  nonRenewableEnergy,
  com,
  triggerValue,
}) => {
  const colors = [
    "#E6594D", // Red
    "#3F822B", // Green
    "#1212F1", // Blue
    "#EEC27F", // Orange
    "#A14D49", // Brown
    "#791E80", // Purple
    "#f4a300", // Gold
    "#D32F2F", // Crimson
    "#7B1FA2", // Violet
    "#1976D2", // Royal Blue
    "#0288D1", // Sky Blue
    "#388E3C", // Forest Green
    "#FBC02D", // Yellow
    "#8E24AA", // Magenta
    "#0288D1", // Cyan
  ];

  // Define total bar color and trigger indicators colors
  const totalBarColor = "#791E80"; // Purple
  const minTriggerColor = "#FF5722"; // Orange-Red for min trigger
  const maxTriggerColor = "#F44336"; // Red for max trigger

  // Get current trigger values
  const getCurrentTriggerValues = () => {
    if (!triggerValue || !Array.isArray(triggerValue) || triggerValue.length === 0) {
      return { minTriggerValue: 0, maxTriggerValue: 0 };
    }
    
    // Sum all trigger values
    const maxSum = triggerValue.reduce((sum, item) => sum + item.maxTriggerValue, 0);
    const minSum = triggerValue.reduce((sum, item) => sum + (parseFloat(item.minTriggerValue) || 0), 0);
    
    return {
      minTriggerValue: minSum,
      maxTriggerValue: maxSum
    };
  };

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [currentTriggerValues, setCurrentTriggerValues] = useState({ minTriggerValue: 0, maxTriggerValue: 0 });
  const maxProductsAllowed = 5;

  // Update current trigger values whenever triggerValue changes
  useEffect(() => {
    setCurrentTriggerValues(getCurrentTriggerValues());
  }, [triggerValue]);

  // Get unit based on energy type
  const getUnit = () => {
    return "tCO2";
  };

  const recoverySeries = useMemo(() => {
    if (nonRenewableEnergy || renewableEnergy) {
      if (com === "non") {
        return ['Grid Electricity'];
      } else {
        return renewableEnergy[0]?.question_details
          .filter((detail) => detail.option_type === "row")
          .slice(1)
          .map((detail) => detail.option)
          .reverse();
      }
    }
  }, [com, nonRenewableEnergy, renewableEnergy]);

  const productOptions = useMemo(() => {
    if (recoverySeries) {
      return recoverySeries.map((product, index) => ({
        value: product,
        label: product,
        color: colors[index % colors.length],
      }));
    }
  }, [recoverySeries]);

  // Initialize with first 5 products
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

      const dataSource = com === "non" ? nonRenewableEnergy : renewableEnergy;

      dataSource.forEach((item) => {
        const answers =
          item.energyAndEmission && Array.isArray(item.energyAndEmission)
            ? item.energyAndEmission
            : [];

        answers.forEach((answerArray, index) => {
          if (Array.isArray(answerArray) && answerArray.length > 0) {
            const recoveryType = recoverySeries[index];
            const value = answerArray[1]; // Use index 1 as specified in second file

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

            // Only aggregate if the recoveryType is in selectedProducts
            if (
              selectedProducts.some((product) => product.label === recoveryType)
            ) {
              aggregated[recoveryType] += numericValue;
            }
          }
        });
      });

      // Calculate the sum WITHOUT any rounding or adjustment
      const sum = Object.values(aggregated).reduce(
        (total, value) => total + value,
        0
      );
      
      // Store actual sum for display 
      setActualSum(sum);
      setTotalSum(sum);

      // Find the appropriate scale for the chart
      const maxProductValue = Math.max(...Object.values(aggregated), 0);
      
      // Consider trigger values in chart scaling
      const { minTriggerValue, maxTriggerValue } = currentTriggerValues;
      const chartMaxValue = Math.max(sum, maxProductValue, maxTriggerValue);
      
      // For scale, use adjusted value to get nice round numbers
      const adjustedMaxValue = adjustAndRoundTotalSum(chartMaxValue);

      setAggregatedData(aggregated);
      setMaxValue(adjustedMaxValue);
    }
  }, [
    selectedProducts,
    com,
    nonRenewableEnergy,
    renewableEnergy,
    recoverySeries,
    currentTriggerValues, // Add current trigger values as dependency
  ]);

  // Function to get nice round numbers for scale
  const adjustAndRoundTotalSum = (totalSum) => {
    const thresholds = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200; // Round to nearest 0.005
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100; // Round to nearest 0.01
      } else {
        return Math.ceil(totalSum * 2) / 2; // Round to nearest 0.5
      }
    }

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to next threshold
      }
    }

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

  if (renewableEnergy?.length === 0 && nonRenewableEnergy?.length === 0) {
    return (
      <div className="container">
        <img
          src={noDataImage}
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
        {com === "non" ? (
          <div style={{ width: "50%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
            Scope2 Emission Product Wise
          </div>
        ) : (
          <div style={{ width: "50%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
            Scope1 Emission Product Wise
          </div>
        )}
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

      {selectedProducts && selectedProducts.length > 0 && (
        <>
          {/* Improved Chart Container with better spacing and Y-axis label */}
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
              left: "-40px", 
              top: "50%", 
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center",
              fontWeight: "400",
              fontSize: "14px",
              color: "#333",
              textAlign: "center",
              whiteSpace: "nowrap"
            }}>
              Emissions in {getUnit()}
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
              height: "100%", 
              alignItems: "flex-end", 
              justifyContent: "space-around",
              position: "relative",
              zIndex: 2
            }}>
              {/* Product bars */}
              {selectedProducts.map((product, index) => {
                const value = aggregatedData[product.value] || 0;
                const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const displayLabel = product.value === "Energy Consumption through other sources" ? "Other Source" : product.value;
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
                          opacity: hoveredBar && hoveredBar !== product.value ? 0.7 : 1
                        }}
                        onMouseEnter={() => {
                          setHoveredBar(product.value);
                        }}
                        onMouseLeave={() => {
                          setHoveredBar(null);
                        }}
                        title={`${displayLabel}: ${value.toFixed(2)} ${getUnit()} (${percentOfTotal.toFixed(1)}% of total)`}
                      ></div>
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

              {/* Total bar with min and max triggers */}
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
                  {/* Max Trigger Value Indicator */}
                  {currentTriggerValues.maxTriggerValue > 0 && (
                    <>
                      <div style={{
                        position: "absolute",
                        top: `calc(100% - ${(currentTriggerValues.maxTriggerValue / maxValue) * 100}%)`,
                        width: "60px",
                        height: "5px",
                        backgroundColor: maxTriggerColor,
                        zIndex: 3
                      }}></div>
                      <div style={{
                        position: "absolute",
                        top: `calc(100% - ${(currentTriggerValues.maxTriggerValue / maxValue) * 100}% - 20px)`,
                        right: "-45px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: maxTriggerColor
                      }}>
                      </div>
                    </>
                  )}
                  
                  {/* Min Trigger Value Indicator */}
                  {currentTriggerValues.minTriggerValue > 0 && (
                    <>
                      <div style={{
                        position: "absolute",
                        top: `calc(100% - ${(currentTriggerValues.minTriggerValue / maxValue) * 100}%)`,
                        width: "60px",
                        height: "2px",
                        backgroundColor: minTriggerColor,
                        zIndex: 3
                      }}></div>
                      <div style={{
                        position: "absolute",
                        top: `calc(100% - ${(currentTriggerValues.minTriggerValue / maxValue) * 100}% - 20px)`,
                        right: "-45px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: minTriggerColor
                      }}>
                      </div>
                    </>
                  )}

                  {/* Value label for actual sum */}
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
                      opacity: hoveredBar && hoveredBar !== 'total' ? 0.7 : 1
                    }}
                    onMouseEnter={() => {
                      setHoveredBar('total');
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                    }}
                    title={`Total: ${actualSum.toFixed(2)} ${getUnit()}
Min Trigger: ${currentTriggerValues.minTriggerValue.toFixed(2)} ${getUnit()}
Max Trigger: ${currentTriggerValues.maxTriggerValue.toFixed(2)} ${getUnit()}`}
                  ></div>
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

export default VerticalEnergyBarComponent;