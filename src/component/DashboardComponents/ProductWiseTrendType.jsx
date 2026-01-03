import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Importing React Select
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

const ProductWiseTrendType = ({
  locationOption,
  brief,
  timePeriodValues,
  type,
  productTypeOptions = null
}) => {
  console.log(brief,"briefbriefbriefbrief",type)
  const colorArray = [
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

  // Function to clean/shorten product titles (from ProductWiseStacked)
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


  // Format value with K (thousand) or M (million) for y-axis and data labels
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return Math.round(value);
    }
  };

  const isElectricityType = type === "ELE" || type === "REW";

  // Convert energyUnit from a function to a useMemo to prevent unnecessary recalculations
  const energyUnit = useMemo(() => {
    if (type === "ELE" || type === "REW") {
      return "kWh";
    } else if (type === "FUEL") {
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
    }

    return "Number";
  }, [type]); // Only recalculate when type changes

  // Get title text based on type
  const getTypeTitle = () => {
    if (type === "FUEL") return "Fuel Energy Consumption";
    if (type === "ELE") return "Electricity Consumption";
    if (type === "REW") return "Renewable Energy Consumption";
    if (type === "COMS") return "Water Consumption";
    if (type === "TREAT") return "Treated Water";
    if (type === "GEN") return "Waste";
    if (type === "DIS") return "Waste Disposed";
    if (type === "BIO") return "Bio Medical Waste";
    if (type === "SCOPE1") return "Scope1 Emission";
    if (type === "SCOPE2") return "Scope2 Emission";
    if (type === "INCIDENT") return "Safety Related Incidents";
    if (type === "TRAINING") return "Development & Training";
    if (type === "ATTRITION") return "Attrition Rate (%)";
    if (type === "OCCUPANCY") return "Occupancy";
    if (type === "EMPLOYEES") return "Employees";
    if (type === "HAZ") return "Hazardous Waste";
    if (type === "NONHAZ") return "Non-hazardous Waste";
    if (type === "GENDERDIV") return "Gender Diversity";
    if (type === "AGEDIV") return "Age Based Diversity";
    if (type.endsWith("Intensity")) return type.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());

    return "";
  };

  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      toolbar: {
        enabled: false,
        show: false,
      },
      stacked: true, // Enable stacking
      responsive: true,
      maintainAspectRatio: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px", // Fixed width of 60px for bars
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatValue(val);
      },
      offsetY: 0, // Center the label vertically inside the bar
      style: {
        fontSize: "12px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [], // This will be set dynamically based on selected products
      labels: {
        style: {
          colors: "#7b91b0",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    yaxis: {
      title: {
        text: `In ${energyUnit}`,
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        formatter: function (value) {
          return formatValue(value);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} ${energyUnit}`;
        },
      },
    },
    grid: {
      strokeDashArray: 4,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: true },
      },
      row: {
        colors: ["transparent", "transparent"],
        opacity: 1,
      },
      column: {
        colors: ["transparent", "transparent"],
        opacity: 1,
      },
      borderColor: "#9e9b9b",
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    colors: colorArray,
    legend: {
      show: true,
      markers: {
        width: 12, // Custom legend marker width
        height: 12, // Custom legend marker height
        borderRadius: 12, // Keep circular markers
      },
      position: "bottom", // Adjust as necessary (top, right, bottom, left)
      horizontalAlign: "center", // Align legend items in the center
      itemMargin: {
        horizontal: 10, // Space between legend items
        vertical: 0, // Vertical space (if needed)
      },
      formatter: function (seriesName, opts) {
        return `<div style="display: flex; align-items: center;">
                 <span style="color: #7b91b0;">${seriesName}</span>
                </div>`;
      },
    },
  });

  // State for product selection
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Update Y-axis title when type changes
  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      yaxis: {
        ...prev.yaxis,
        title: {
          ...prev.yaxis.title,
          text: `In ${energyUnit}`,
        },
      },
      tooltip: {
        ...prev.tooltip,
        y: {
          formatter: function (val) {
            return `${val.toFixed(2)} ${energyUnit}`;
          },
        },
      },
    }));
  }, [type, energyUnit]);
  const calculateMaxValue = (series) => {
    if (!series || series.length === 0) return 0;

    return series.reduce((maxVal, currentSeries) => {
      const seriesMax = Math.max(...currentSeries.data);
      return Math.max(maxVal, seriesMax);
    }, 0);
  };
  useEffect(() => {
    // Process value function - apply conversion if needed, no log transformation
    const processValue = (value) => {
      // Apply conversion if needed based on type, but no log transformation
      if (isElectricityType && value > 0) {
      return (parseFloat(value * 2500) / 9).toFixed(2);
      }
      return value > 0 ? value : 0;
    };

    if (timePeriodValues.length > 1 && locationOption.length == 1) {
      if (brief && brief.location) {
        const productTotals = {};
        const categories = Object.keys(brief.location);

        // Aggregate data based on selected products
        Object.entries(brief.location).forEach(
          ([locationKey, locationValue]) => {
            Object.keys(locationValue).forEach((productKey) => {
              if (
                selectedProducts.length === 0 ||
                selectedProducts.includes(productKey)
              ) {
                if (!productTotals[productKey]) {
                  productTotals[productKey] = Array(categories.length).fill(0);
                }
                const categoryIndex = categories.indexOf(locationKey);
                const valueArray = locationValue[productKey];
                const valueSum = Array.isArray(valueArray)
                  ? valueArray.reduce((sum, val) => sum + Number(val) || 0, 0)
                  : 0;
                productTotals[productKey][categoryIndex] += valueSum;
              }
            });
          }
        );

        // Create series with data for sorting
        const seriesWithValues = Object.entries(productTotals).map(
          ([productKey, data]) => ({
            name: cleanProductTitle(productKey), // Apply cleanProductTitle
            originalName: productKey,
            data: data.map(processValue),
            totalValue: data.reduce((sum, val) => sum + val, 0),
          })
        );

        // Sort the series based on total values
        seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

        // Assign colors based on total value (highest value gets first color)
        const sortedSeries = seriesWithValues.map((series, index) => ({
          name: series.name,
          data: series.data,
          color: colorArray[index % colorArray.length],
        }));
        const maxDataValue = calculateMaxValue(sortedSeries);

        // Determine if we should fix the max at 4 or let it be dynamic
        const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
        const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
        setChartSeries(sortedSeries);
        setChartOptions((prev) => ({
          ...prev,
          yaxis: {
            ...prev.yaxis,
            min: 0,
            max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          },
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: colorArray, // Use the enhanced color array
        }));
      }
    } else if (timePeriodValues.length == 1 && locationOption.length > 1) {
      if (brief && brief.time) {
        const productTotals = {};
        const categories = Object.keys(brief.time);

        // Aggregate data based on selected products
        Object.entries(brief.time).forEach(([locationKey, locationValue]) => {
          Object.keys(locationValue).forEach((productKey) => {
            if (
              selectedProducts.length === 0 ||
              selectedProducts.includes(productKey)
            ) {
              if (!productTotals[productKey]) {
                productTotals[productKey] = Array(categories.length).fill(0);
              }
              const categoryIndex = categories.indexOf(locationKey);
              const valueArray = locationValue[productKey];
              const valueSum = Array.isArray(valueArray)
                ? valueArray.reduce((sum, val) => sum + Number(val) || 0, 0)
                : 0;
              productTotals[productKey][categoryIndex] += valueSum;
            }
          });
        });

        // Create series with data for sorting
        const seriesWithValues = Object.entries(productTotals).map(
          ([productKey, data]) => ({
            name: cleanProductTitle(productKey), // Apply cleanProductTitle
            originalName: productKey,
            data: data.map(processValue),
            totalValue: data.reduce((sum, val) => sum + val, 0),
          })
        );

        // Sort the series based on total values
        seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

        // Assign colors based on total value (highest value gets first color)
        const sortedSeries = seriesWithValues.map((series, index) => ({
          name: series.name,
          data: series.data,
          color: colorArray[index % colorArray.length],
        }));
        const maxDataValue = calculateMaxValue(sortedSeries);

        // Determine if we should fix the max at 4 or let it be dynamic
        const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
        const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
        setChartSeries(sortedSeries);
        setChartOptions((prev) => ({
          ...prev,
          yaxis: {
            ...prev.yaxis,
            min: 0,
            max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          },
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: colorArray, // Use the enhanced color array
        }));
      }
    } else {
      if (brief && brief.location) {
        const productTotals = {};
        const categories = Object.keys(brief.location);

        // Aggregate data based on selected products
        Object.entries(brief.location).forEach(
          ([locationKey, locationValue]) => {
            Object.keys(locationValue).forEach((productKey) => {
              if (
                selectedProducts.length === 0 ||
                selectedProducts.includes(productKey)
              ) {
                if (!productTotals[productKey]) {
                  productTotals[productKey] = Array(categories.length).fill(0);
                }
                const categoryIndex = categories.indexOf(locationKey);
                const valueArray = locationValue[productKey];
                const valueSum = Array.isArray(valueArray)
                  ? valueArray.reduce((sum, val) => sum + Number(val) || 0, 0)
                  : 0;
                productTotals[productKey][categoryIndex] += valueSum;
              }
            });
          }
        );

        // Create series with data for sorting
        const seriesWithValues = Object.entries(productTotals).map(
          ([productKey, data]) => ({
            name: cleanProductTitle(productKey), // Apply cleanProductTitle
            originalName: productKey,
            data: data.map(processValue),
            totalValue: data.reduce((sum, val) => sum + val, 0),
          })
        );

        // Sort the series based on total values
        seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

        // Assign colors based on total value (highest value gets first color)
        const sortedSeries = seriesWithValues.map((series, index) => ({
          name: series.name,
          data: series.data,
          color: colorArray[index % colorArray.length],
        }));
        const maxDataValue = calculateMaxValue(sortedSeries);

        // Determine if we should fix the max at 4 or let it be dynamic
        const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
        const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
        setChartSeries(sortedSeries);
        setChartOptions((prev) => ({
          ...prev,
          yaxis: {
            ...prev.yaxis,
            min: 0,
            max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          },
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: colorArray, // Use the enhanced color array
        }));
      }
    }
  }, [
    selectedProducts,
    brief,
    type,
    isElectricityType,
    energyUnit,
    timePeriodValues.length,
    locationOption.length
  ]); // Added all necessary dependencies

  const typeProducts = useMemo(
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
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
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
      NONHAZ: [
        "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
        "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
        "Total packaging waste (Plastic) generated* (Kg)",
        "Total food waste generated/Kitchen Waste* (Kgs)",
      ],
          OCCUPANCY: [
        "Number of IP days",
        "% of occupancy",
        "Total approved beds",
        "Total operating beds",
        "Total built up area (sq.ft)",
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

  // Options for product selection dropdown
  const productOptions = useMemo(() => {
    // Get allowed products for the current type
    const allowedProducts = productTypeOptions || typeProducts[type] || [];

    // If brief.location exists and has data, use it to get product options but filter by allowed type
    if (brief?.location && Object.keys(brief.location).length > 0) {
      const firstKey = Object.keys(brief.location)[0];
      const locationProducts = Object.keys(brief.location[firstKey] || {});

      // Filter location products to only include ones that match the current type
      const filteredProducts = locationProducts.filter((product) =>
        allowedProducts.includes(product)
      );

      if (filteredProducts.length > 0) {
        return filteredProducts.map((product) => ({
          value: product,
          label: cleanProductTitle(product), // Apply cleanProductTitle for better display
        }));
      }
    }

    // If no matching location products found, fall back to type-based products
    return allowedProducts.map((product) => ({
      value: product,
      label: cleanProductTitle(product), // Apply cleanProductTitle for better display
    }));
  }, [brief, type, typeProducts, productTypeOptions]);

  // Handle product selection
  const handleProductChange = useCallback((selectedOptions) => {
    if (selectedOptions.length > 5) {
      alert("You can only select up to 5 products.");
      return;
    }
    setSelectedProducts(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  }, []);

  // Set initial selection of first 5 products if available
  // Reset selection whenever type changes to ensure we only have valid products selected
  useEffect(() => {
    if (productOptions.length > 0) {
      setSelectedProducts(
        productOptions.slice(0, 5).map((option) => option.value)
      );
    } else {
      // Clear selection if no products available for this type
      setSelectedProducts([]);
    }
  }, [productOptions, type]);

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
          <div
            style={{
              color: "#3f88a5",
              marginLeft: "5px",
              fontSize: "12px",
              width: "55%",
            }}
          >
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  return (
    <div className="container" style={{ height: "50vh" }}>
      <div
        style={{
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          {getTypeTitle()}
        </div>
        <div style={{ width: "45%" }}>
          <Select
            isMulti
            options={productOptions}
            onChange={handleProductChange}
            value={productOptions.filter((option) =>
              selectedProducts.includes(option.value)
            )} // Set selected options
            placeholder="Select Products"
            hideSelectedOptions={false} // Keep selected options in the dropdown
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator,
            }}
            closeMenuOnSelect={false} // Prevent dropdown from closing
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100, // Ensure the menu appears above other elements
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#3f88a5", // Change color of the dropdown arrow
                padding: "0 10px", // Adjust padding for the indicator
                fontSize: "20px", // Increase the font size of the indicator
                minHeight: "20px", // Set a minimum height for the indicator
                minWidth: "20px", // Set a minimum width for the indicator
              }),
              placeholder: (base) => ({
                ...base,
                position: "absolute", // Ensure the placeholder doesn't shift with input
                top: "50%",
                transform: "translateY(-50%)", // Vertically center the placeholder
                pointerEvents: "none", // Disable interaction on the placeholder
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
                  ? "transparent" // Selected option background color
                  : state.isFocused
                    ? "white" // Focused option background color
                    : "white", // Default option background color
                color: state.isSelected ? "black" : "black", // Text color based on state
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      <div style={{ height: "90%", width: "100%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            width="100%"
            height="100%"
            key={`chart-${chartSeries.length}-${JSON.stringify(
              chartOptions.xaxis.categories
            )}`}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "#7b91b0",
            }}
          >
            <p>No data available for the selected criteria.</p>
            <p style={{ fontSize: "12px" }}>
              {productOptions.length === 0
                ? "No product options found in the data."
                : "Try selecting different products, time periods, or locations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductWiseTrendType;