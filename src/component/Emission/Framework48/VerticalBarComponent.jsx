import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { components } from "react-select";

const VerticalBarComponent = ({ brief ,type}) => {
  const [totalSum, setTotalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [legendSums, setLegendSums] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const maxProducts = 5;

  // Define a color map for the bars with more distinct colors
  const colorMap = [
    "#E6594D", // Red
    "#3F822B", // Green
    "#1212F1", // Blue
    "#EEC27F", // Orange
    "#A14D49", // Brown
    "#791E80"  // Purple
  ];
  
  // Default unit is tCO2
  const getUnit = () => "tCO2";

  // No conversion needed since we're not checking type anymore
  const convertValue = (value) => value;
  
  // Extract the list of product options from the data
  const productOptions = useMemo(() => {
    if (!brief || !brief.time) return [];
    
    // Get all unique product keys from the time data
    const productKeys = new Set();
    
    Object.values(brief.time).forEach(timeObj => {
      Object.keys(timeObj).forEach(key => {
        productKeys.add(key);
      });
    });
    
    // Convert the set to options format for the dropdown
    return Array.from(productKeys).map(product => ({
      label: product,
      value: product
    }));
  }, [brief]);

  // Set initial selected products to the first five products
  useEffect(() => {
    if (productOptions.length > 0) {
      const initialProducts = productOptions
        .slice(0, maxProducts)
        .map((item) => item.value);
      
      setSelectedProducts(initialProducts);
    }
  }, [productOptions]);
  
  // Function to calculate the total sum for each legend (key)
  useEffect(() => {
    if (brief && brief.time) {
      let filteredKeys = Object.values(brief.time);
      
      const locationData = filteredKeys;
      const legendTotals = {};

      // Loop through each time object
      locationData.forEach((time) => {
        for (const key in time) {
          if (time.hasOwnProperty(key)) {
            const valueArray = time[key];
            const value = Array.isArray(valueArray) ? (valueArray.reduce((acc, curr) => acc + curr, 0)).toFixed(2) : 0;
            legendTotals[key] = Number(Number((legendTotals[key] || 0) + Number(value)).toFixed(2));
          }
        }
      });

      setLegendSums(legendTotals);
    }
  }, [brief]);

  const adjustAndRoundTotalSum = (totalSum) => {
    // Use the same thresholds for all values
    const thresholds = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200;
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100;
      } else {
        return Math.ceil(totalSum * 2) / 2;
      }
    }

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i];
      }
    }

    return totalSum;
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      let selectedTotal = Object.keys(legendSums)
        .filter((key) => selectedProducts.includes(key))
        .reduce((sum, key) => sum + (legendSums[key] || 0), 0);
      
      // Store the actual sum (without adjustment) for display
      setActualSum(selectedTotal);
      
      // Set the adjusted sum for scale calculation
      const adjustedTotal = adjustAndRoundTotalSum(selectedTotal);
      if (adjustedTotal !== totalSum) {
        setTotalSum(adjustedTotal);
      }
    } else {
      let total = Object.values(legendSums).reduce(
        (sum, val) => sum + val,
        0
      );
      
      // Store the actual sum (without adjustment) for display
      setActualSum(total);
      
      // Set the adjusted sum for scale calculation
      const adjustedTotal = adjustAndRoundTotalSum(total);
      if (adjustedTotal !== totalSum) {
        setTotalSum(adjustedTotal);
      }
    }
  }, [selectedProducts, legendSums]);

  // Filter the legendSums to only include selected products
  const filteredLegendSums = selectedProducts.length
    ? Object.fromEntries(
        Object.entries(legendSums).filter(([key]) =>
          selectedProducts.includes(key)
        )
      )
    : legendSums;

  // Apply conversion to the filtered sums for display
  const displayLegendSums = Object.entries(filteredLegendSums).reduce((acc, [key, value]) => {
    acc[key] = convertValue(value);
    return acc;
  }, {});

  // Custom components for Select
  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div
            style={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
              {isSelected && (
                <span style={{ color: "white", fontSize: "14px" }}>✔</span>
              )}
            </div>
          </div>

          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 300 }}>
              {data.label}
            </div>
          </div>
        </div>
      </components.Option>
    );
  };

  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value } = selectProps;

    return (
      <components.Control {...props}>
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
          </div>
        )}
        {value && value.length > 0 && (
          <div
            style={{
              color: "#3f88a5",
              marginLeft: "5px",
              fontSize: "12px",
              width: "70%",
            }}
          >
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  // Function to truncate product names for labels
  const truncateProductName = (name, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Calculate the actual total sum for all selected products with conversion
  const actualTotalSum = Object.keys(displayLegendSums)
    .reduce((sum, key) => sum + displayLegendSums[key], 0);

  // Calculate total bar height as a percentage of the scale
  const totalBarHeightPercentage = (actualTotalSum / totalSum) * 100;

  // Format value based on size
  const formatValue = (value) => {
    // Format with K suffix for thousands
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="vertical-bar-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className="vertical-bar-header"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          Product Wise {type} Emission
        </div>
        <div style={{ marginBottom: "10px", width: "45%" }}>
          <Select
            isMulti
            options={productOptions}
            value={productOptions.filter((option) =>
              selectedProducts.includes(option.value)
            )}
            onChange={(selected) => {
              const selectedValues = selected.map((item) => item.value);

              if (selectedValues.length < 1) {
                alert("You must select at least one product.");
              } else if (selectedValues.length <= maxProducts) {
                setSelectedProducts(selectedValues);
              } else {
                alert(`You can only select up to ${maxProducts} products.`);
              }
            }}
            placeholder={`Select products`}
            hideSelectedOptions={false}
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

      {/* Chart container with improved Y-axis label */}
      <div style={{ 
        display: "flex", 
        height: "350px", 
        alignItems: "flex-end",
        marginBottom: "40px",
        position: "relative",
        paddingLeft: "70px" // Increased padding to accommodate vertical label
      }}>
        {/* Y-axis vertical label */}
        <div style={{ 
          position: "absolute", 
          left: "-43px", 
          top: "50%", 
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center",
          fontWeight: "400",
          fontSize: "14px",
          color: "#333",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}>
          Emission in {getUnit()}
        </div>

        {/* Y-axis labels with K format */}
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
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(totalSum)}</div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(totalSum * 0.75)}</div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(totalSum * 0.5)}</div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>{formatValue(totalSum * 0.25)}</div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}>0</div>
        </div>

        {/* Grid lines - Dotted for a cleaner look */}
        <div style={{ 
          position: "absolute", 
          left: "70px",
          width: "calc(100% - 70px)", 
          height: "100%", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none"
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
          zIndex: 5
        }}></div>

        {/* Bars */}
        <div style={{ 
          display: "flex", 
          width: "calc(100% - 70px)", 
          height: "100%", 
          alignItems: "flex-end", 
          justifyContent: "space-around",
          position: "relative",
          zIndex: 1
        }}>
          {/* Individual product bars */}
          {Object.keys(displayLegendSums).map((key, index) => {
            const value = displayLegendSums[key];
            // Make sure heightPercentage is never zero, minimum 1% for visibility
            const heightPercentage = Math.max((value / totalSum) * 100, 1);
            
            return (
              <div key={key} style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                width: `${100 / (Object.keys(displayLegendSums).length + 1)}%`, 
                height: "100%",
                position: "relative"
              }}>
                <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  {/* Value label */}
                  <div style={{
                    position: "absolute",
                    top: `calc(100% - ${heightPercentage}% - 25px)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "nowrap"
                  }}>
                    {formatValue(value)}
                  </div>
                  
                  {/* Bar with hover effect */}
                  <div 
                    style={{
                      height: `${heightPercentage}%`,
                      width: "60px",
                      backgroundColor: colorMap[index % colorMap.length],
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      position: "relative",
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                      opacity: hoveredBar && hoveredBar !== key ? 0.7 : 1
                    }}
                    onMouseEnter={() => {
                      setHoveredBar(key);
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                    }}
                    title={`${key}: ${formatValue(value)} ${getUnit()} (${(value/actualTotalSum*100).toFixed(1)}% of total)`}
                  ></div>
                </div>
                
                {/* Label below the bar */}
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
                  color: colorMap[index % colorMap.length]
                }} title={key}>
                  {truncateProductName(key)}
                </div>
              </div>
            );
          })}
          
          {/* Total bar */}
          {Object.keys(displayLegendSums).length > 0 && (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              width: `${100 / (Object.keys(displayLegendSums).length + 1)}%`, 
              height: "100%",
              position: "relative"
            }}>
              <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                {/* Value label */}
                <div style={{
                  position: "absolute",
                  top: `calc(100% - ${totalBarHeightPercentage}% - 25px)`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "nowrap"
                }}>
                  {formatValue(actualTotalSum)}
                </div>
                
                {/* Total Bar */}
                <div 
                  style={{
                    height: `${totalBarHeightPercentage}%`,
                    width: "60px",
                    backgroundColor: "#791E80", // Dark color for total
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
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
                  title={`Total: ${formatValue(actualTotalSum)} ${getUnit()} (Scale max: ${formatValue(totalSum)} ${getUnit()})`}
                ></div>
              </div>
              
              {/* Label below the total bar */}
              <div style={{
                position: "absolute",
                bottom: "-30px", // Position below the bar
                width: "70px",
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#791E80"
              }}>
                Total
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalBarComponent;