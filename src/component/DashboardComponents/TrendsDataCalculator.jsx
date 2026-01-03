import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { components } from "react-select";
import PieChartVisualizer from "./PieChartVisualizer";
import VerticalBarVisualizer from "./VerticalBarVisualizer";
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

// Function to clean up product titles
const cleanProductTitle = (title) => {
  // Helper function to convert to title case
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (word) => {
      // Preserve apostrophes and capitalize the first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  if (
    title.startsWith(
      "Electricity Power plant (Captive Power Plant - Natural Gas)"
    )
  ) {
    return "Electricity Power Plant";
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

  if (
    title.startsWith(
      "Current employees by Gender (in %) Male"
    )
  ) {
    return "Current employees by Gender Male";
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
    title.startsWith(
      "Current employees by Gender (in %) Female"
    )
  ) {
    return "Current employees by Gender Female";
  }

  if (title.startsWith("Total Bed Days Or Occupied Beds")) {
    return "Operating beds";
  }

  // Handle specific cases
  if (
    title.startsWith(
      "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)"
    )
  ) {
    return "Non-Plastic-Cardboard Waste";
  }

  if (
    title.startsWith(
      "Electricity Power plant"
    )
  ) {
    return "Electricity Power Plant";
  }

  if (
    title.startsWith(
      "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)"
    )
  ) {
    return "Non-Plastic-Paper Waste";
  }

  if (title.startsWith("Total packaging waste (Plastic) generated* (Kg)")) {
    return "Plastic";
  }

  // Remove "Total" or "Number of" from the beginning
  let cleanedTitle = title.replace(/^Total\s+/i, "");
  cleanedTitle = cleanedTitle.replace(/^Number\s+of\s+/i, "");

  // Remove everything after and including asterisk (*) if present
  cleanedTitle = cleanedTitle.split("*")[0].trim();

  return toTitleCase(cleanedTitle);
};

const TrendsDataCalculator = ({ brief, type = null, productTypeOptions = null, tab, showTotal }) => {
  const [visualizationType, setVisualizationType] = useState("bar");
  const [totalSum, setTotalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [legendSums, setLegendSums] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const maxProducts = 5;

  // Fixed heights configuration
  const heights = {
    container: "460px", // Total container height
    header: "60px", // Header section height
    dropdown: "50px", // Product selection dropdown height
    toggleButtons: "40px", // Chart toggle buttons height
    chart: "350px", // Chart visualization height
  };

  // Define a color map
  const colorMap =
    type === "BIO"
      ? [
        "#FFFF00", // Yellow
        "#FF0000", // Red
        "#FFFFFF", // White
        "#0000FF", // Blue
        "#800080", // Cytotoxic (Purple)
        "#0099C6", // Turquoise Blue (keeping remaining colors)
        "#DD4477", // Rose Pink
        "#66AA00", // Lime Green
        "#B82E2E", // Brick Red
        "#316395", // Navy Blue
      ]
      : [
        "#3366CC", // Rich Blue
        "#DD4477", // Rust Red
        "#FF9900", // Amber Orange
        "#109618", // Forest Green
        "#990099", // Royal Purple
        "#0099C6", // Turquoise Blue
        "#DD4477", // Rose Pink
        "#66AA00", // Lime Green
        "#B82E2E", // Brick Red
        "#316395", // Navy Blue
      ];

  // Get the appropriate unit based on type
  const getUnit = () => {
    if (type === "ELE" || type === "REW") {
      return "kWh";
    }
    if (type === "FUEL") {
      return "GJ";
    } else if (type === "COMS" || type === "TREAT") {
      return "KL";
    } else if (
      type === "BIO" ||
      type === "GEN" ||
      type === "DIS" ||
      type === "HAZ" ||
      type === "NONHAZ"
    ) {
      return "Kg";
    } else if (type === "SCOPE1" || type === "SCOPE2" || type === "DIS") {
      return "tCO2";
    } else if (type === "INCIDENT" || type === "TRAINING") {
      return "Number";
    } else if (tab === "Intensity") {
      switch (type) {
        case "CarbonIntensity":
          return 'kgCO2e'

        case "WaterIntensity":
          return 'KL';

        case "WasteIntensity":
          return 'Kg';

        case "HazardousWasteIntensity":
          return 'Kg';

        case "NonHazardousWasteIntensity":
          return 'Kg';

        case "BioMedicalWasteIntensity":
          return 'Kg';

        case "FuelIntensity":
          return 'GJ';

        case "RenewableEnergyIntensity":
          return 'kWh';

        case "ElectricityIntensity":
          return 'kWh';

        default:
          console.warn(`Unknown intensity type: ${type}`);
      }
    } else if (tab === "Diversity") {
      return 'Percentage';
    }
    return "Number";
  };

  // Conversion function: converts GJ to kWh if needed
  const convertValue = (value) => {
    if (type === "ELE" || type === "REW") {
      return (value * 2500) / 9;
    }
    return value;
  };

  // Define product lists for each type
  const typeProductsMap = useMemo(
    () => ({
      FUEL: [
        "Petrol",
        "PNG",
        "LPG",
        "CNG",
        "Diesel",
      ],
      ELE: [
        "Electricity Power plant (Captive Power Plant - Natural Gas)",
        "GRID electricity",
        "Electricity consumption through DG",
        "Electricity consumption from Renewable energy (via PPA)",
        "Electricity consumption from Renewable energy (rooftop solar)",
      ],
      REW: [
        "Electricity consumption from Renewable energy (via PPA)",
        "Electricity consumption from Renewable energy (rooftop solar)",
      ],
      COMS: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
      ],
      TREAT: [
        "Total Water consumption* ( in KL)",
        "Total Wastewater treated(STP/ETP)* ( in KL)",
      ],
      GEN: [
        "Total e-waste generated",
        "Total hazardous waste (spent oil/lubricants etc)",
        "Total non-hazardous solid waste generation (black category general waste)* (kg)",
        "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
        "Total packaging waste (Plastic) generated* (Kg)",
        "Total plastic packaging waste generated",
      ],
      DIS: [
        "Total e-waste generated",
        "Total hazardous waste (spent oil/lubricants etc)",
        "Total non-hazardous solid waste generation (black category general waste)* (kg)",
        "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
        "Total packaging waste (Plastic) generated* (Kg)",
        "Total plastic packaging waste generated",
      ],
      OCCUPANCY: [
        "Number of IP days",
        "% of occupancy",
        "Total approved beds",
        "Total operating beds",
        "Total built up area (sq.ft)",
      ],
      NONHAZ: [
        "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
        "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
        "Total packaging waste (Plastic) generated* (Kg)",
        "Total food waste generated/Kitchen Waste* (Kgs)",
      ],
      HAZ: [
        "Total e-waste generated* (Kg)",
        "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
        "Total spent formalin solution disposed in Ltrs",
      ],
      BIO: ["Yellow", "Red", "White", "Blue", "Cytotoxic"],
      SCOPE2: [
        "Electricity Power plant (Captive Power Plant - Natural Gas)",
        "Electricity consumption through DG",
        "GRID electricity",
      ],
      SCOPE1: [
        "Petrol",
        "PNG",
        "LPG",
        "CNG",
        "Diesel",
      ],
      INCIDENT: [
        "Fatalities (Number of cases)",
        "High-consequence injuries (Number of cases)",
        "Recordable injuries (Number of cases)",
        "Recordable work-related ill health cases (Number of cases)",
      ],
      TRAINING: [
        "Number of Mock Drills",
        "Number of Safety Trainings",
        "Fire Safety Audits",
        "Number of Safety Committee Meetings",
      ],
      ATTRITION: ["Manpower turnover rate(FTE atrition rate) in %"],
      EMPLOYEES: ["Total number of employees (FTE)"],
      GENDERDIV: [
        "Current employees by Gender (in %) Male",
        "Current employees by Gender (in %) Female",
        // "Number of  New hires by Gender Male",
        // "Number of New hires by Gender Female",
      ],
      AGEDIV: [
        "Employees less than 30 years of age (%)",
        "Employees between 30-50 years of age (%)",
        "Employees more than 50 years of age (%)",
      ],
    }),
    []
  );

  // Extract the list of product options based on the type
  const productOptions = useMemo(() => {
    // Get the product list for the current type
    const products = productTypeOptions || typeProductsMap[type] || [];
    // Convert the list to options format for the dropdown with cleaned titles
    return products.map((product) => ({
      label: cleanProductTitle(product), // Clean the product title for display
      value: product, // Keep original value for data matching
      originalLabel: product, // Store original label for reference
    }));
  }, [type, typeProductsMap, productTypeOptions]);

  // Set initial selected products to the first five products or update when type changes
  useEffect(() => {
    if (productOptions.length > 0) {
      const initialProducts = productOptions
        .slice(0, maxProducts)
        .map((item) => item.value);

      // Always update selected products when type changes
      setSelectedProducts(initialProducts);
    }
  }, [productOptions, maxProducts]);

  // Function to calculate the total sum for each legend (key) from brief data
  useEffect(() => {
    if (brief && brief.time) {
      let filteredKeys = Object.values(brief.time);
      let filteredAnswered = Object.values(brief?.answered || {});

      const currentTypeProducts = productTypeOptions || typeProductsMap[type] || [];

      // For TREAT type, we need to include the original water consumption keys for calculation
      const waterConsumptionKeys = [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)"
      ];

      // Filter data based on type
      filteredKeys = filteredKeys.map((obj) => {
        const filteredObj = {};
        Object.keys(obj).forEach((key) => {
          if (currentTypeProducts.includes(key) || (type === "TREAT" && waterConsumptionKeys.includes(key))) {
            filteredObj[key] = obj[key];
          }
        });
        return filteredObj;
      });

      filteredAnswered =
        filteredAnswered &&
        filteredAnswered.map((obj) => {
          const filteredObj = {};
          Object.keys(obj).forEach((key) => {
            if (currentTypeProducts.includes(key) || (type === "TREAT" && waterConsumptionKeys.includes(key))) {
              filteredObj[key] = obj[key];
            }
          });
          return filteredObj;
        });

      const locationData = filteredKeys;
      const legendTotals = {};
      let NumberOfItem = {};

      filteredAnswered &&
        filteredAnswered.forEach((time) => {
          for (const key in time) {
            if (Object.hasOwn(time, key)) {
              const valueArray = time[key];
              const value = valueArray.filter((value) => value === true).length;
              NumberOfItem[key] = Number(
                Number((NumberOfItem[key] || 0) + Number(value)).toFixed(2)
              );
            }
          }
        });

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

      // Special handling for TREAT type: combine water consumption values
      if (type === "TREAT") {
        const totalWaterConsumption =
          (legendTotals["Total Groundwater consumption* ( in KL)"] || 0) +
          (legendTotals["Total Tanker Water Consumption* (in KL)"] || 0) +
          (legendTotals["Total surface water consumption (this includes municipal supply water)* ( in KL)"] || 0);

        // Set the combined value
        legendTotals["Total Water consumption* ( in KL)"] = Number(totalWaterConsumption.toFixed(2));

        // Remove the individual water consumption keys from the final result
        delete legendTotals["Total Groundwater consumption* ( in KL)"];
        delete legendTotals["Total Tanker Water Consumption* (in KL)"];
        delete legendTotals["Total surface water consumption (this includes municipal supply water)* ( in KL)"];

        // Also handle NumberOfItem for the combined water consumption
        const totalWaterItems =
          (NumberOfItem["Total Groundwater consumption* ( in KL)"] || 0) +
          (NumberOfItem["Total Tanker Water Consumption* (in KL)"] || 0) +
          (NumberOfItem["Total surface water consumption (this includes municipal supply water)* ( in KL)"] || 0);

        if (totalWaterItems > 0) {
          NumberOfItem["Total Water consumption* ( in KL)"] = totalWaterItems;
        }

        // Remove individual items
        delete NumberOfItem["Total Groundwater consumption* ( in KL)"];
        delete NumberOfItem["Total Tanker Water Consumption* (in KL)"];
        delete NumberOfItem["Total surface water consumption (this includes municipal supply water)* ( in KL)"];
      }

      if (
        type === "GENDERDIV" ||
        type === "AGEDIV" ||
        type === "ATTRITION" ||
        type === "OCCUPANCY" ||
        type === "EMPLOYEES"
      ) {
        for (const key in legendTotals) {
          const result = key === 'Number of IP days' ? legendTotals[key] : legendTotals[key] / NumberOfItem[key];
          legendTotals[key] = isNaN(result) ? 0 : parseFloat(result.toFixed(2));
        }
      }
      setLegendSums(legendTotals);
    }
  }, [brief, type, typeProductsMap, productTypeOptions]);

  const adjustAndRoundTotalSum = (totalSum) => {
    // For kWh values (ELE or REW), use different thresholds
    const thresholds =
      type === "ELE" ||
        type === "REW" ||
        type === "COMS" ||
        type === "TREAT" ||
        type === "BIO" ||
        type === "GEN" ||
        type === "DIS" ||
        type === "HAZ" ||
        type === "NONHAZ" ||
        type === "MANUFACTURINGINTENSITY" ||
        type === "HOSPITALINTENSITY"
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

  // Calculate total sum based on selected products
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
      let adjustedTotal = adjustAndRoundTotalSum(convertedTotal);
      if (adjustedTotal !== totalSum) {
        adjustedTotal = adjustedTotal < 4 ? 4 : adjustedTotal;
        setTotalSum(adjustedTotal);
      }
    } else {
      let total = Object.values(legendSums).reduce((sum, val) => sum + val, 0);

      // Convert to kWh if needed
      const convertedTotal = convertValue(total);

      // Store the actual sum (without adjustment) for display
      setActualSum(convertedTotal);

      // Set the adjusted sum for scale calculation
      let adjustedTotal = adjustAndRoundTotalSum(convertedTotal);
      if (adjustedTotal !== totalSum) {
        adjustedTotal = adjustedTotal < 4 ? 4 : adjustedTotal;
        setTotalSum(adjustedTotal);
      }
    }
  }, [selectedProducts, legendSums, type, totalSum]);

  // Filter the legendSums to only include selected products
  const filteredLegendSums = useMemo(() => {
    return selectedProducts.length
      ? Object.fromEntries(
        Object.entries(legendSums).filter(([key]) =>
          selectedProducts.includes(key)
        )
      )
      : legendSums;
  }, [selectedProducts, legendSums]);

  // Apply conversion to the filtered sums for display
  const displayLegendSums = useMemo(() => {
    return Object.entries(filteredLegendSums).reduce((acc, [key, value]) => {
      acc[key] = convertValue(value);
      return acc;
    }, {});
  }, [filteredLegendSums, convertValue]);

  // Calculate actual total sum for all selected products
  const actualTotalSum = useMemo(() => {
    return Object.values(displayLegendSums).reduce(
      (sum, value) => sum + value,
      0
    );
  }, [displayLegendSums]);

  // Sort products by value and assign colors accordingly
  // MODIFIED: For BIO type, use exact color mapping regardless of value
  const getSortedProductsWithColors = useMemo(() => {
    // Create array of [key, value] pairs
    const entries = Object.entries(displayLegendSums);

    // Sort by value in descending order
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

    // For BIO type, use fixed color mapping based on the predefined BIO categories
    if (type === "BIO") {
      // Map of BIO categories to their exact colors
      const bioColorMap = {
        Yellow: "#FFFF00", // Yellow
        Red: "#FF0000", // Red
        White: "#FFFFFF", // White
        Blue: "#0000FF", // Blue
        Cytotoxic: "#800080", // Purple
      };

      return sortedEntries.map(([key, value]) => ({
        value: key,
        label: cleanProductTitle(key), // Clean the product title for display
        color: bioColorMap[key] || "#0099C6", // Fallback color if somehow the key doesn't match
        dataValue: value, // Include the actual value for reference
      }));
    } else {
      // For non-BIO types, assign colors based on sorted order (largest values get first colors)
      return sortedEntries.map(([key, value], index) => ({
        value: key,
        label: cleanProductTitle(key), // Clean the product title for display
        color: colorMap[index % colorMap.length],
        dataValue: value, // Include the actual value for reference
      }));
    }
  }, [displayLegendSums, colorMap, type]);

  // For the pie chart, generate pieData from displayLegendSums - MODIFIED to include zero values
  const pieData = useMemo(() => {
    const data = [];
    let startAngle = 0;

    // Get sorted product array with colors
    const sortedProducts = getSortedProductsWithColors;

    // Create mapping of product to color for quick lookup
    const productColorMap = sortedProducts.reduce((acc, product) => {
      acc[product.value] = product.color;
      return acc;
    }, {});

    // Get all data (including zero values) and assign colors from the sorted map
    const validData = Object.entries(displayLegendSums).map(([key, value]) => {
      return {
        key,
        label: cleanProductTitle(key), // Clean the product title for display
        value,
        percentage: actualTotalSum > 0 ? (value / actualTotalSum) * 100 : 0,
        color: productColorMap[key] || colorMap[0], // Use color from sorted mapping or default
      };
    });

    // Calculate angles for pie segments
    validData.forEach((item) => {
      // Only calculate angle if percentage is greater than 0
      const angle = item.percentage > 0 ? (item.percentage / 100) * 360 : 0;
      const endAngle = startAngle + angle;

      data.push({
        ...item,
        startAngle,
        endAngle,
      });

      // Only update startAngle if this segment takes up space in the pie
      if (angle > 0) {
        startAngle = endAngle;
      }
    });

    return data;
  }, [
    displayLegendSums,
    actualTotalSum,
    getSortedProductsWithColors,
    colorMap,
  ]);

  // Check if we have data to display
  const noDataToDisplay =
    actualTotalSum === 0 || Object.keys(displayLegendSums).length === 0;

  const CustomMultiValue = () => null;
  const CustomClearIndicator = () => null;

  return (
    <div
      className="vertical-bar-container"
      style={{
        width: "100%",
        height: heights.container,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header section with title and dropdown */}
      <div
        className="vertical-bar-header"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          height: heights.header,
          minHeight: heights.header,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          Product Wise{" "}
          {type === "FUEL"
            ? "Fuel Energy Consumption"
            : type === "ELE"
              ? "Electricity Consumption"
              : type === "REW"
                ? "Renewable Energy Consumption"
                : type === "COMS"
                  ? "Water Consumption"
                  : type === "TREAT"
                    ? "Treated Water"
                    : type === "GEN"
                      ? "Waste"
                      : type === "DIS"
                        ? "Waste Disposed"
                        : type === "BIO"
                          ? "Bio medical Waste"
                          : type === "SCOPE1"
                            ? "Scope1 Emission"
                            : type === "SCOPE2"
                              ? "Scope2 Emission"
                              : type === "INCIDENT"
                                ? "Safety Related Incidents"
                                : type === "TRAINING"
                                  ? "Development & Training"
                                  : type === "ATTRITION"
                                    ? "Attrition Rate (%)"
                                    : type === "EMPLOYEES"
                                      ? "Employees"
                                      : type === "HAZ"
                                        ? "Hazardous waste"
                                        : type === "NONHAZ"
                                          ? "Non-hazardous waste"
                                          : type === "OCCUPANCY"
                                            ? "Occupancy"
                                            : type === "GENDERDIV"
                                              ? "Gender Diversity"
                                              : type.endsWith("Intensity")
                                                ? type.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
                                                : type === "EMPLOYEES"
                                                  ? "Age Based Diversity"
                                                  : ""}{" "}
        </div>

        {/* Dropdown for product selection */}
        <div style={{ width: "50%" }}>
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
              Control: ({ children, ...props }) => (
                <components.Control {...props}>
                  {(!props.selectProps.value ||
                    props.selectProps.value.length === 0) && (
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
                  {props.selectProps.value &&
                    props.selectProps.value.length > 0 && (
                      <div
                        style={{
                          color: "#3f88a5",
                          marginLeft: "5px",
                          fontSize: "12px",
                          width: "70%",
                        }}
                      >
                        {/* Display cleaned title here */}
                        {cleanProductTitle(
                          props.selectProps.value[0].originalLabel ||
                          props.selectProps.value[0].label
                        )}
                        {props.selectProps.value.length > 1 &&
                          ` +${props.selectProps.value.length - 1} more`}
                      </div>
                    )}
                  {children}
                </components.Control>
              ),
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator,
            }}
            closeMenuOnSelect={false}
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
                height: heights.dropdown,
                minHeight: heights.dropdown,
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

      {/* Toggle buttons */}
      {type === "TREAT" ? <div
        className="mx-1"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          height: heights.toggleButtons,
          minHeight: heights.toggleButtons,
          // marginTop: "10px",
          marginBottom: "28px",
        }}
      >

      </div> :
        <div
          className="mx-1"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            height: heights.toggleButtons,
            minHeight: heights.toggleButtons,
            // marginTop: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
              cursor: "pointer",
            }}
            onClick={() => setVisualizationType("bar")}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #3f88a5",
                backgroundColor:
                  visualizationType === "bar" ? "#3f88a5" : "transparent",
                marginRight: "8px",
              }}
            />
            <span>Bar View</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setVisualizationType("pie")}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #3f88a5",
                backgroundColor:
                  visualizationType === "pie" ? "#3f88a5" : "transparent",
                marginRight: "8px",
              }}
            />
            <span>Pie View</span>
          </div>
        </div>}

      {/* Visualization container with fixed height */}
      <div
        style={{
          height: heights.chart,
          minHeight: heights.chart,
          position: "relative",
          flex: 1,
        }}
      >
        {visualizationType === "pie" ? (
          <PieChartVisualizer
            pieData={pieData}
            noDataToDisplay={noDataToDisplay}
            unit={getUnit()}
            height={heights.chart}
          />
        ) : (
          <VerticalBarVisualizer
            selectedProducts={getSortedProductsWithColors}
            aggregatedData={displayLegendSums}
            maxValue={totalSum}
            actualSum={actualTotalSum}
            currentTriggerValues={{ minTriggerValue: 0, maxTriggerValue: 0 }}
            unit={getUnit()}
            height={heights.chart}
            tab={tab}
            type={type}
            showTotal={showTotal}
          />
        )}
      </div>
    </div>
  );
};

export default TrendsDataCalculator;