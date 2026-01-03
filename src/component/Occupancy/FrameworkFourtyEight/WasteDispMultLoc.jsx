import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Importing React Select

const WasteDispMultLoc = ({
  timePeriods,
  locationOption,
  brief,
  timePeriodValues,
  type
}) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      toolbar: {
        enabled: false, show: false
      },
      stacked: type !== "GEN", // Disable stacking for GEN type (percentages)
      responsive: true,
      maintainAspectRatio: false
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
        // Format based on type
        if (type === "GEN") {
          return `${val.toFixed(1)}%`;
        }
        return val.toFixed(0);
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
        text: type === "GEN" ? "Attrition Rate (%)" : "Number of Employees",
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
        formatter: (value) => type === "GEN" ? `${value.toFixed(1)}%` : value.toFixed(0),
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          if (type === "GEN") {
            return `${val.toFixed(2)}%`;
          }
          return val.toFixed(0);
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    colors: [],
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

  // Set energy unit based on type
  const energyUnit = type === "GEN" ? "%" : "";

  // Update Y-axis title when type changes
  useEffect(() => {
    setChartOptions(prev => ({
      ...prev,
      yaxis: {
        ...prev.yaxis,
        title: {
          ...prev.yaxis.title,
          text: type === "GEN" ? "Attrition Rate (%)" : "Number of Employees"
        }
      },
      chart: {
        ...prev.chart,
        stacked: type !== "GEN" // Disable stacking for percentage type
      }
    }));
  }, [type]);

  const generateColors = (num) => {
    const colors = type === "BIO" ?[
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
    return colors.slice(0, num); // Return as many colors as the number of products
  };

  useEffect(() => {
    if (timePeriodValues.length > 1 && locationOption.length == 1) {
      if (brief && brief.location) {
        const productTotals = {};
        const productCounts = {}; // For calculating averages for GEN type
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
                  productCounts[productKey] = Array(categories.length).fill(0);
                }
                const categoryIndex = categories.indexOf(locationKey);
                const valueArray = locationValue[productKey];
                
                if (Array.isArray(valueArray)) {
                  // For GEN type, we need to store sum and count separately to calculate average
                  const valueSum = valueArray.reduce((sum, val) => sum + Number(val) || 0, 0);
                  productTotals[productKey][categoryIndex] += valueSum;
                  productCounts[productKey][categoryIndex] += valueArray.length;
                }
              }
            });
          }
        );

        // Process the data - calculate averages for GEN type
        const series = Object.entries(productTotals).map(([productKey, data]) => {
          // For GEN type, calculate averages
          if (type === "GEN") {
            const counts = productCounts[productKey];
            return {
              name: productKey,
              data: data.map((sum, index) => counts[index] > 0 ? sum / counts[index] : 0)
            };
          }
          // For other types, use totals directly
          return {
            name: productKey,
            data
          };
        });

        setChartSeries(series);
        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: generateColors(series.length), // Update colors dynamically
          dataLabels: {
            ...prev.dataLabels,
            formatter: function (val) {
              if (type === "GEN") {
                return `${val.toFixed(1)}%`;
              }
              return val.toFixed(0);
            },
          },
          tooltip: {
            ...prev.tooltip,
            y: {
              formatter: function (val) {
                if (type === "GEN") {
                  return `${val.toFixed(2)}%`;
                }
                return val.toFixed(0);
              },
            },
          }
        }));
      }
    }
    else if (timePeriodValues.length == 1 && locationOption.length > 1) {
      if (brief && brief.time) {
        const productTotals = {};
        const productCounts = {}; // For calculating averages for GEN type
        const categories = Object.keys(brief.time);

        // Aggregate data based on selected products
        Object.entries(brief.time).forEach(
          ([timeKey, timeValue]) => {
            Object.keys(timeValue).forEach((productKey) => {
              if (
                selectedProducts.length === 0 ||
                selectedProducts.includes(productKey)
              ) {
                if (!productTotals[productKey]) {
                  productTotals[productKey] = Array(categories.length).fill(0);
                  productCounts[productKey] = Array(categories.length).fill(0);
                }
                const categoryIndex = categories.indexOf(timeKey);
                const valueArray = timeValue[productKey];
                
                if (Array.isArray(valueArray)) {
                  // For GEN type, we need to store sum and count separately to calculate average
                  const valueSum = valueArray.reduce((sum, val) => sum + Number(val) || 0, 0);
                  productTotals[productKey][categoryIndex] += valueSum;
                  productCounts[productKey][categoryIndex] += valueArray.length;
                }
              }
            });
          }
        );

        // Process the data - calculate averages for GEN type
        const series = Object.entries(productTotals).map(([productKey, data]) => {
          // For GEN type, calculate averages
          if (type === "GEN") {
            const counts = productCounts[productKey];
            return {
              name: productKey,
              data: data.map((sum, index) => counts[index] > 0 ? sum / counts[index] : 0)
            };
          }
          // For other types, use totals directly
          return {
            name: productKey,
            data
          };
        });

        setChartSeries(series);
        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: generateColors(series.length), // Update colors dynamically
          dataLabels: {
            ...prev.dataLabels,
            formatter: function (val) {
              if (type === "GEN") {
                return `${val.toFixed(1)}%`;
              }
              return val.toFixed(0);
            },
          },
          tooltip: {
            ...prev.tooltip,
            y: {
              formatter: function (val) {
                if (type === "GEN") {
                  return `${val.toFixed(2)}%`;
                }
                return val.toFixed(0);
              },
            },
          }
        }));
      }
    }
    else {
      if (brief && brief.location) {
        const productTotals = {};
        const productCounts = {}; // For calculating averages for GEN type
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
                  productCounts[productKey] = Array(categories.length).fill(0);
                }
                const categoryIndex = categories.indexOf(locationKey);
                const valueArray = locationValue[productKey];
                
                if (Array.isArray(valueArray)) {
                  // For GEN type, we need to store sum and count separately to calculate average
                  const valueSum = valueArray.reduce((sum, val) => sum + Number(val) || 0, 0);
                  productTotals[productKey][categoryIndex] += valueSum;
                  productCounts[productKey][categoryIndex] += valueArray.length;
                }
              }
            });
          }
        );

        // Process the data - calculate averages for GEN type
        const series = Object.entries(productTotals).map(([productKey, data]) => {
          // For GEN type, calculate averages
          if (type === "GEN") {
            const counts = productCounts[productKey];
            return {
              name: productKey,
              data: data.map((sum, index) => counts[index] > 0 ? sum / counts[index] : 0)
            };
          }
          // For other types, use totals directly
          return {
            name: productKey,
            data
          };
        });

        setChartSeries(series);
        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories,
          },
          colors: generateColors(series.length), // Update colors dynamically
          dataLabels: {
            ...prev.dataLabels,
            formatter: function (val) {
              if (type === "GEN") {
                return `${val.toFixed(1)}%`;
              }
              return val.toFixed(0);
            },
          },
          tooltip: {
            ...prev.tooltip,
            y: {
              formatter: function (val) {
                if (type === "GEN") {
                  return `${val.toFixed(2)}%`;
                }
                return val.toFixed(0);
              },
            },
          }
        }));
      }
    }
  }, [selectedProducts, brief, type, energyUnit]); // Added dependencies

  // Define type-specific products
  const typeProducts = useMemo(() => ({
    GEN: [
      "Manpower turnover rate(FTE atrition rate) in %"
    ],
    DIS: [
      "Total number of employees (FTE)"
    ]  
  }), []); // This doesn't need to change

  // Options for product selection dropdown
  const productOptions = useMemo(() => {
    // Get allowed products for the current type
    const allowedProducts = typeProducts[type] || [];
    
    // If brief.location exists and has data, use it to get product options but filter by allowed type
    if (brief?.location && Object.keys(brief.location).length > 0) {
      const firstKey = Object.keys(brief.location)[0];
      const locationProducts = Object.keys(brief.location[firstKey] || {});
      
      // Filter location products to only include ones that match the current type
      const filteredProducts = locationProducts.filter(product => 
        allowedProducts.includes(product)
      );
      
      if (filteredProducts.length > 0) {
        return filteredProducts.map((product) => ({
          value: product,
          label: product,
        }));
      }
    }
    
    // If no matching location products found, fall back to type-based products
    return allowedProducts.map(product => ({
      value: product,
      label: product,
    }));
  }, [brief, type, typeProducts]);

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
              {/* Tick mark when selected */}
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
    <div className="container" style={{ height: "100%", width: "100%" }}>
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
            fontSize: "18px",
            fontWeight: 600,
            color: "#011627",
            width: "50%",
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
              ClearIndicator: CustomClearIndicator
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
        <Chart options={chartOptions} series={chartSeries} type="bar" width="100%" height="100%" />
      ) : (
        <p>No data available</p>
      )}
      </div>
    </div>
  );
};

export default WasteDispMultLoc;