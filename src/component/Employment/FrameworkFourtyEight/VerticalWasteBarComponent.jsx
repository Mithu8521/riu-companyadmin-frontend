import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { components } from "react-select";

const VerticalBarComponent = ({ brief, type = null }) => {
  const [totalSum, setTotalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [legendSums, setLegendSums] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const maxProducts = 5;

  // Define a color map for the bars with more distinct colors
  const colorMap = type === "BIO" ?[
    "#FFFF00", // Petrol (Red)
    "#FF0000", // CNG (Green)
    "#e6e6ff", // LPG (Blue)
    "#EEC27F", // PNG (Orange)
    "#0000FF", // Briquette (Brown)
    "#00FF00"  // Total (Purple)
  ]: [
    "#E6594D", // Petrol (Red)
    "#3F822B", // CNG (Green)
    "#1212F1", // LPG (Blue)
    "#EEC27F", // PNG (Orange)
    "#A14D49", // Briquette (Brown)
    "#791E80"  // Total (Purple)
  ];
  
  // Get the appropriate unit based on type
  const getUnit = () => {
    if (type === "ELE" || type === "REW") {
      return "kWh";
    } else if (type === "GEN") {
      return "%";
    }
    return "";
  };

  // Conversion function: converts to kWh if needed
  const convertValue = (value) => {
    if (type === "ELE" || type === "REW") {
      // 1 = 277.788 kWh, but requirement says multiply by 1000
       return (value * 2500) / 9;
    }
    return value;
  };
  
  // Extract the list of product options based on the type
  const productOptions = useMemo(() => {
    // Define the products for each type
    const typeProducts = {
      GEN: [
        "Manpower turnover rate(FTE atrition rate) in %"
      ],
      DIS: [
        "Total number of employees (FTE)"
      ]   
    };
    
    // Get the product list for the current type
    const products = typeProducts[type] || [];
    
    // Convert the list to options format for the dropdown
    return products.map(product => ({
      label: product,
      value: product
    }));
  }, [type]);

  // Set initial selected products to the first five products or update when type changes
  useEffect(() => {
    if (productOptions.length > 0) {
      const initialProducts = productOptions
        .slice(0, maxProducts)
        .map((item) => item.value);
      
      // Always update selected products when type changes
      setSelectedProducts(initialProducts);
    }
  }, [productOptions, type]);

  // Define product lists for each type
  const typeProductsMap = useMemo(() => ({
    GEN: [
      "Manpower turnover rate(FTE atrition rate) in %"
    ],
    DIS: [
      "Total number of employees (FTE)"
    ]
  }), []);
  
  // Function to calculate the total sum for each legend (key)
  useEffect(() => {
    if (brief && brief.time) {
      let filteredKeys = Object.values(brief.time);
      const currentTypeProducts = typeProductsMap[type] || [];
      
      // Filter data based on type
      filteredKeys = filteredKeys.map(obj => {
        const filteredObj = {};
        Object.keys(obj).forEach(key => {
          if (currentTypeProducts.includes(key)) {
            filteredObj[key] = obj[key];
          }
        });
        return filteredObj;
      });

      const locationData = filteredKeys;
      const legendTotals = {};
      const countMap = {}; // To track count for averaging

      // Loop through each time object
      locationData.forEach((time) => {
        for (const key in time) {
          if (time.hasOwnProperty(key)) {
            const valueArray = time[key];
            
            if (Array.isArray(valueArray)) {
              // Track values and counts differently for GEN type (need average)
              if (type === "GEN") {
                // Add up all values
                const sum = valueArray.reduce((acc, curr) => acc + curr, 0);
                // Initialize if first encounter
                if (!legendTotals[key]) {
                  legendTotals[key] = 0;
                  countMap[key] = 0;
                }
                // Add to running sum
                legendTotals[key] += sum;
                // Count the number of values to calculate average later
                countMap[key] += valueArray.length;
              } else {
                // For non-GEN types, just sum as before
                const value = valueArray.reduce((acc, curr) => acc + curr, 0);
                legendTotals[key] = Number(Number((legendTotals[key] || 0) + Number(value)).toFixed(2));
              }
            }
          }
        }
      });

      // Calculate averages for GEN type
      if (type === "GEN") {
        // Convert sums to averages for percentage values
        for (const key in legendTotals) {
          if (countMap[key] > 0) {
            legendTotals[key] = Number((legendTotals[key] / countMap[key]).toFixed(2));
          }
        }
      }

      setLegendSums(legendTotals);
    }
  }, [brief, type, typeProductsMap]);

  const adjustAndRoundTotalSum = (totalSum) => {
    // For percentage values (GEN), use appropriate thresholds
    if (type === "GEN") {
      const thresholds = [5, 10, 25, 50, 75, 100];
      
      if (totalSum < 1) {
        return Math.ceil(totalSum * 2) / 2;
      }
      
      for (let i = 0; i < thresholds.length; i++) {
        if (totalSum <= thresholds[i]) {
          return thresholds[i];
        }
      }
      
      // If larger than largest threshold
      return Math.ceil(totalSum / 10) * 10;
    }
    
    // For kWh values (ELE or REW), use different thresholds
    const thresholds = type === "ELE" || type === "REW" 
      ? [10000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000]
      : [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

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
      
      // For GEN type with multiple products, we should average the percentages
      if (type === "GEN" && selectedProducts.length > 1) {
        selectedTotal = selectedTotal / selectedProducts.length;
      }
      
      // Convert to kWh if needed before setting the actual sum
      const convertedTotal = convertValue(selectedTotal);
      
      // Store the actual sum (without adjustment) for display
      setActualSum(convertedTotal);
      
      // Set the adjusted sum for scale calculation
      const adjustedTotal = adjustAndRoundTotalSum(convertedTotal);
      if (adjustedTotal !== totalSum) {
        setTotalSum(adjustedTotal);
      }
    } else {
      let total = Object.values(legendSums).reduce(
        (sum, val) => sum + val,
        0
      );
      
      // For GEN type with multiple items, we need to average
      if (type === "GEN" && Object.keys(legendSums).length > 1) {
        total = total / Object.keys(legendSums).length;
      }
      
      // Convert to kWh if needed
      const convertedTotal = convertValue(total);
      
      // Store the actual sum (without adjustment) for display
      setActualSum(convertedTotal);
      
      // Set the adjusted sum for scale calculation
      const adjustedTotal = adjustAndRoundTotalSum(convertedTotal);
      if (adjustedTotal !== totalSum) {
        setTotalSum(adjustedTotal);
      }
    }
  }, [selectedProducts, legendSums, type]);

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

  // Calculate the actual total for all selected products with conversion
  // For GEN type (percentages), calculate the average of the selected products
  const actualTotalSum = Object.keys(displayLegendSums).length > 0
    ? type === "GEN" 
      ? Object.values(displayLegendSums).reduce((sum, val) => sum + val, 0) / Object.keys(displayLegendSums).length
      : Object.values(displayLegendSums).reduce((sum, val) => sum + val, 0)
    : 0;

  // Calculate total bar height as a percentage of the scale
  const totalBarHeightPercentage = (actualTotalSum / totalSum) * 100;

  // Format value based on type to handle large kWh values and percentages
  const formatValue = (value) => {
    if (type === "GEN") {
      // For percentage values, always show with 1 decimal place
      return `${value.toFixed(1)}%`;
    } else if (type === "ELE" || type === "REW") {
      // For large kWh values, consider using k, M format
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toFixed(1);
    }
    // Format other values with K suffix for thousands
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
         Product Wise{" "}
         {type === "GEN"
              ? "Attrition Rate"
              : type === "DIS"
              ? "Employees"
              : ""}{" "}
         {type === "GEN" ? "(%)" : ""}
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
        {/* Y-axis labels with appropriate format */}
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
                      backgroundColor: colorMap[index],
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
                    title={`${key}: ${formatValue(value)} (${type === "GEN" ? "" : 
                      (value/actualTotalSum*100).toFixed(1) + "% of total"})`}
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
                  color: colorMap[index]
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
                  title={`${type === "GEN" ? "Average" : "Total"}: ${formatValue(actualTotalSum)} (Scale max: ${formatValue(totalSum)})`}
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
                {type === "GEN" ? "Average" : "Total"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalBarComponent;