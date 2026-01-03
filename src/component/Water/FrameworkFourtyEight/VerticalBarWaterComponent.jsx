import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { components } from "react-select";

const VerticalBarWaterComponent = ({ brief, type = null }) => {
  const [totalSum, setTotalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [legendSums, setLegendSums] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [waterConsumptionTotal, setWaterConsumptionTotal] = useState(0);
  const maxProducts = 5;

  // Define a color map for the bars with more distinct colors
  const colorMap = [
    "#E6594D", // Petrol (Red)
    "#3F822B", // CNG (Green)
    "#1212F1", // LPG (Blue)
    "#EEC27F", // PNG (Orange)
    "#A14D49", // Briquette (Brown)
    "#791E80", // Total (Purple)
  ];

  // Get the appropriate unit based on type
  const getUnit = () => {
    if (type === "ELE" || type === "REW") {
      return "kWh";
    }
    return "KL";
  };

  // Conversion function: converts KL to kWh if needed
  const convertValue = (value) => {
    if (type === "ELE" || type === "REW") {
      // 1 KL = 277.788 kWh, but requirement says multiply by 1000
      return (value * 2500) / 9;
    }
    return value;
  };

  // Function to clean product names by removing "Total" and unit info
  const cleanProductName = (productName) => {
    // Remove "Total " from the beginning and "*( in KL)" from the end
    return productName
      .replace(/^Total\s+/i, '')
      .replace(/\*\s*\(\s*in\s*KL\s*\)/i, '')
      .trim();
  };

  // Define water consumption products
  const waterConsumptionProducts = [
    "Total Groundwater consumption* ( in KL)",
    "Total Tanker Water Consumption* (in KL)",
    "Total surface water consumption (this includes municipal supply water)* ( in KL)",
  ];

  // Define the wastewater product
  const wastewaterProduct = "Total Wastewater treated(STP/ETP)* ( in KL)";

  // Extract the list of product options based on the type
  const productOptions = useMemo(() => {
    // Define the products for each type
    const typeProducts = {
      COMS: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
      ],
      TREAT: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
        "Total Wastewater treated(STP/ETP)* ( in KL)",
      ],
    };

    // Get the product list for the current type
    const products = typeProducts[type] || [];

    // Convert the list to options format for the dropdown with clean display labels
    return products.map((product) => ({
      label: cleanProductName(product), // Clean the display label
      value: product, // Keep the original value for data handling
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
  const typeProductsMap = useMemo(
    () => ({
      COMS: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
      ],
      TREAT: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
        "Total Wastewater treated(STP/ETP)* ( in KL)",
      ],
    }),
    []
  );

  // Function to calculate the total sum for each legend (key)
  useEffect(() => {
    if (brief && brief.time) {
      let filteredKeys = Object.values(brief.time);
      const currentTypeProducts = typeProductsMap[type] || [];

      // Filter data based on type
      filteredKeys = filteredKeys.map((obj) => {
        const filteredObj = {};
        Object.keys(obj).forEach((key) => {
          if (currentTypeProducts.includes(key)) {
            filteredObj[key] = obj[key];
          }
        });
        return filteredObj;
      });

      const locationData = filteredKeys;
      const legendTotals = {};

      // Loop through each time object
      locationData.forEach((time) => {
        for (const key in time) {
          if (time.hasOwnProperty(key)) {
            const valueArray = time[key];
            const value = Array.isArray(valueArray)
              ? valueArray.reduce((acc, curr) => acc + curr, 0).toFixed(2)
              : 0;
            legendTotals[key] = Number(
              Number((legendTotals[key] || 0) + Number(value)).toFixed(2)
            );
          }
        }
      });

      setLegendSums(legendTotals);
    }
  }, [brief, type, typeProductsMap]);

  // Calculate water consumption total (sum of the three water consumption sources)
  useEffect(() => {
    if (type === "TREAT" && Object.keys(legendSums).length > 0) {
      const waterTotal = waterConsumptionProducts.reduce((total, product) => {
        return total + (legendSums[product] || 0);
      }, 0);

      setWaterConsumptionTotal(waterTotal);
    }
  }, [legendSums, type]);

  const adjustAndRoundTotalSum = (totalSum) => {
    // For kWh values (ELE or REW), use different thresholds
    const thresholds =
      type === "ELE" || type === "REW"
        ? [
            10000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000,
            5000000, 10000000, 20000000,
          ]
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
      let total = Object.values(legendSums).reduce((sum, val) => sum + val, 0);

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
  const displayLegendSums = Object.entries(filteredLegendSums).reduce(
    (acc, [key, value]) => {
      acc[key] = convertValue(value);
      return acc;
    },
    {}
  );

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
          ></div>
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
            {/* Show cleaned product names in the dropdown selection too */}
            {cleanProductName(value[0].label)}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  // Function to truncate product names for labels
  const truncateProductName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Format value based on type to handle large kWh values
  const formatValue = (value) => {
    if (type === "ELE" || type === "REW") {
      // For large kWh values, consider using k, M format
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
      }
      return value.toFixed(1);
    }
    // Format KL values with K suffix for thousands
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  // For TREAT type, prepare the special display data
  const prepareDisplayData = () => {
    if (type === "TREAT") {
      // For TREAT, we have 2 specific bars - water consumption total and wastewater
      const displayData = {};

      // Only add Water Consumption if at least one water consumption product is selected
      const hasWaterConsumption = selectedProducts.some((product) =>
        waterConsumptionProducts.includes(product)
      );

      if (hasWaterConsumption) {
        // Calculate total of selected water consumption products
        const waterTotal = waterConsumptionProducts
          .filter((product) => selectedProducts.includes(product))
          .reduce((total, product) => {
            return total + (legendSums[product] || 0);
          }, 0);

        // Add water consumption total to display data
        displayData["Water Consumption"] = convertValue(waterTotal);
      }

      // Add wastewater treated if selected
      if (selectedProducts.includes(wastewaterProduct)) {
        displayData[wastewaterProduct] = convertValue(
          legendSums[wastewaterProduct] || 0
        );
      }

      return displayData;
    }

    // For other types, return the regular display data
    return displayLegendSums;
  };

  // For TREAT type, calculate percentages based on Water Consumption as 100%
  const calculatePercentageForTreat = (value) => {
    if (type === "TREAT") {
      const waterConsumptionValue = dataToDisplay["Water Consumption"] || 1; // Avoid division by zero
      return ((value / waterConsumptionValue) * 100).toFixed(1);
    }

    // For non-TREAT types, calculate percentage based on total
    return ((value / actualTotalSum) * 100).toFixed(1);
  };

  // Get the data to display based on type
  const dataToDisplay =
    type === "TREAT" ? prepareDisplayData() : displayLegendSums;

  // Calculate the actual total sum for display with conversion (no total bar for TREAT)
  const actualTotalSum = Object.keys(dataToDisplay).reduce(
    (sum, key) => sum + dataToDisplay[key],
    0
  );

  // For TREAT type, set the scale based on Water Consumption as reference (100%)
  const treatScaleValue =
    type === "TREAT" && dataToDisplay["Water Consumption"]
      ? dataToDisplay["Water Consumption"]
      : totalSum;

  // For TREAT type, we don't show a total bar
  const shouldShowTotalBar = type !== "TREAT";

  // Create a mapping of original product names to their cleaned versions for display
  const productDisplayNames = {};
  [...waterConsumptionProducts, wastewaterProduct].forEach(product => {
    productDisplayNames[product] = cleanProductName(product);
  });

  return (
    <div
      className="vertical-bar-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
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
          {/* Removed "Total" from title as requested */}
          Product Wise{" "}
          {type === "COMS"
            ? "Water Consumption"
            : type === "TREAT"
            ? "Treated Water"
            : ""}{" "}
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
      <div
        style={{
          display: "flex",
          height: "350px",
          alignItems: "flex-end",
          marginBottom: "40px",
          position: "relative",
          paddingLeft: "70px", // Increased padding to accommodate vertical label
        }}
      >
        {/* Y-axis vertical label */}
        <div
          style={{
            position: "absolute",
            left: "-28px",
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center",
            fontWeight: "400",
            fontSize: "14px",
            color: "#333",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Water in {getUnit()}
        </div>

        {/* Y-axis labels with K format */}
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
          {type === "TREAT" ? (
            // For TREAT type, show both value and percentage on Y-axis
            <>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(treatScaleValue)}{" "}
                {treatScaleValue === dataToDisplay["Water Consumption"] }
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(treatScaleValue * 0.75)}{" "}
                {treatScaleValue === dataToDisplay["Water Consumption"]}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(treatScaleValue * 0.5)}{" "}
                {treatScaleValue === dataToDisplay["Water Consumption"] }
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(treatScaleValue * 0.25)}{" "}
                {treatScaleValue === dataToDisplay["Water Consumption"]}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                0
              </div>
            </>
          ) : (
            // For other types, show regular values
            <>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(totalSum)}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(totalSum * 0.75)}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(totalSum * 0.5)}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                {formatValue(totalSum * 0.25)}
              </div>
              <div
                style={{ fontSize: "12px", fontWeight: "500", color: "#666" }}
              >
                0
              </div>
            </>
          )}
        </div>

        {/* Grid lines - Dotted for a cleaner look */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "calc(100% - 70px)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
          <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
          <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
          <div style={{ width: "100%", borderBottom: "1px dashed #ccc" }}></div>
          <div style={{ width: "100%", borderBottom: "1px solid #ccc" }}></div>
        </div>

        {/* Y-axis vertical line */}
        <div
          style={{
            position: "absolute",
            left: "70px",
            width: "1px",
            height: "100%",
            backgroundColor: "#ccc",
            zIndex: 5,
          }}
        ></div>

        {/* Bars */}
        <div
          style={{
            display: "flex",
            width: "calc(100% - 70px)",
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "space-around",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Individual product bars */}
          {Object.keys(dataToDisplay).map((key, index) => {
            const value = dataToDisplay[key];
            // Make sure heightPercentage is never zero, minimum 1% for visibility
            // For TREAT type, calculate height percentage based on Water Consumption
            const scaleValue = type === "TREAT" ? treatScaleValue : totalSum;
            const heightPercentage = Math.max((value / scaleValue) * 100, 1);
            
            // Get the cleaned display name for the product
            let displayName = key;
            if (key === "Water Consumption") {
              displayName = "Water Consumption";
            } else if (key === wastewaterProduct) {
              displayName = "Wastewater Treated";
            } else {
              displayName = productDisplayNames[key] || cleanProductName(key);
            }

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: `${
                    100 /
                    (Object.keys(dataToDisplay).length +
                      (shouldShowTotalBar ? 1 : 0))
                  }%`,
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
                  {/* Value label with percentage for TREAT type */}
                  <div
                    style={{
                      position: "absolute",
                      top: `calc(100% - ${heightPercentage}% - 25px)`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatValue(value)}{" "}
                    {type === "TREAT"  && key !== "Water Consumption"&&
                      `(${calculatePercentageForTreat(value)}%)`}
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
                      opacity: hoveredBar && hoveredBar !== key ? 0.7 : 1,
                    }}
                    onMouseEnter={() => {
                      setHoveredBar(key);
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                    }}
                    title={`${displayName}: ${formatValue(value)} ${getUnit()} ${
                      type === "TREAT"
                        ? key === "Water Consumption"
                          ? ""
                          : `(${calculatePercentageForTreat(
                              value
                            )}% of Water Consumption)`
                        : `(${((value / actualTotalSum) * 100).toFixed(
                            1
                          )}% of total)`
                    }`}
                  ></div>
                </div>

             

                {/* Label below the bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px", // Position below the bar
                    width: "70px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: colorMap[index],
                  }}
                  title={displayName}
                >
                   {truncateProductName(displayName)}
                </div>
              </div>
            );
          })}

          {/* Total bar - only show for non-TREAT types */}
          {shouldShowTotalBar && Object.keys(dataToDisplay).length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: `${100 / (Object.keys(dataToDisplay).length + 1)}%`,
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
                <div
                  style={{
                    position: "absolute",
                    top: `calc(100% - ${
                      (actualTotalSum / totalSum) * 100
                    }% - 25px)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatValue(actualTotalSum)}
                </div>

                {/* Total Bar */}
                <div
                  style={{
                    height: `${(actualTotalSum / totalSum) * 100}%`,
                    width: "60px",
                    backgroundColor: "#791E80", // Dark color for total
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
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
                  title={`Total: ${formatValue(
                    actualTotalSum
                  )} ${getUnit()} (Scale max: ${formatValue(
                    totalSum
                  )} ${getUnit()})`}
                ></div>
              </div>

              {/* Label below the total bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px", // Position below the bar
                  width: "70px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#791E80",
                }}
              >
                Total
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalBarWaterComponent;
