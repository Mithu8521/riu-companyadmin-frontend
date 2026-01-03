import Select, { components } from "react-select"; // Import react-select
import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts

const MultipleBarWater = ({
  timePeriods,
  locationOption,
  matchedDataWater,
  title,
  timePeriodValues,
}) => {
  const colorMapping = {
    Groundwater: "#E6594D",
    "Third-party water": "#3F822B",
    "Surface water": "#1212F1",
    "Municipal water": "#EEC27F",
    Seawater: "#A14D49",
    "To Surface water": "#791E80",
    "To Groundwater": "#e74c3c",
    "To Sea water": "#3498db",
    "Sent to other parties": "#1abc9c",
    Biomass: "#e67e22",
    "Energy Consumption through other sources": "#95a5a6",
  };

  const [chartSeries, setChartSeries] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // State for selected products
  const [productValuesMap, setProductValuesMap] = useState({});
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false, // Disable the three-line menu (toolbar)
      },
      stackType: "normal",
    },
    tooltip: {
      enabled: true, // Enable tooltip for hover functionality
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return formatValue(val); // Use formatValue to display in K/M format
        },
      },
      theme: "light",
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins',
      },
      fillSeriesColor: false,
      marker: {
        show: false,
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const name = w.globals.seriesNames[seriesIndex];
        const category = w.globals.categoryLabels[dataPointIndex];
        const color = colorMapping[name] || w.globals.colors[seriesIndex];
        
        return (
          '<div class="apexcharts-tooltip-box" style="padding: 8px; border-radius: 5px; background: white; border: 1px solid #e0e0e0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">' +
            '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
              `<div style="width: 10px; height: 10px; background: ${color}; margin-right: 5px;"></div>` +
              `<span style="font-weight: 600; font-size: 13px;">${name}</span>` +
            '</div>' +
            `<div style="font-size: 12px; color: #7b91b0;">Category: ${category}</div>` +
            `<div style="font-size: 14px; font-weight: 600; margin-top: 5px;">Value: ${formatValue(value)} KL</div>` +
          '</div>'
        );
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatValue(val); // Use formatValue to display in K/M format
      },
      offsetY: 0, // Center the label vertically inside the bar
      style: {
        fontSize: "10px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [], // Will be set dynamically
      title: {
        text: "Time Periods",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
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
        text: "Water in KL",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      min: 0, // Set minimum value to avoid zero issue
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        formatter: (value) => formatValue(value), // Use the formatValue function to display values in K/M format
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    tooltip: {
      enabled: true, // Enable tooltip
    },
    legend: {
      show: true,
      position: "bottom", // Keep the legend at the bottom
      horizontalAlign: "center",
      markers: {
        horizontal: 10,
        vertical: 10,
        radius: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
    },

  });

  // Function to format the values with commas and units (K, M)
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return Math.round(value); // Return as is for values below 1000
    }
  };

  useEffect(() => {
    const initialProductValuesMap = {};

    const categories = Object.keys(timePeriods);
    const allOptions = getOptions(matchedDataWater); // Fetch all matchedDataWater options

    allOptions.forEach((option, index) => {
      const data = categories.map((key) => {
        const filteredData = matchedDataWater.filter(
          (item) => item.formDate === timePeriods[key]
        );

        const summedValue = filteredData.reduce((sum, item) => {
          const value = item.answer[index] ? item.answer[index][0] : 0; // Set to 0 if undefined
          return sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value));
        }, 0);

        return summedValue; // Collect summed values for each time period
      });

      initialProductValuesMap[option] = data; // Store the mapped data
    });

    setProductValuesMap(initialProductValuesMap); // Set the permanent mapping
  }, [timePeriods, matchedDataWater]);

  const getOptions = (matchedDataWater) => {
    const optionsArray = matchedDataWater
      .flatMap((item) => item.question_details) // Flatten question_details array
      .filter((detail) => detail.option_type === "row") // Only "row" types
      .map((detail) => detail.option); // Extract the option values

    const uniqueOptions = [...new Set(optionsArray)]; // Remove duplicates
    const modifiedOptions = uniqueOptions.slice(1).reverse(); // Remove the first option and reverse the array

    return modifiedOptions;
  };

  const productOptions = useMemo(() => {
    return getOptions(matchedDataWater).map((option) => ({
      label: option,
      value: option,
    }));
  }, [matchedDataWater]);

  useEffect(() => {
    if (productOptions.length > 0) {
      // Select the first five products
      const firstFiveProducts = productOptions.slice(0, 4);
      setSelectedProducts(firstFiveProducts);
    }
  }, [productOptions]);

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map((loc) => loc.label); // X-axis labels (locations)

      const series = selectedProducts.map((selectedProduct) => {
        const optionIndex = getOptions(matchedDataWater).indexOf(selectedProduct.value);

        const data = categories.map((location) => {
          const locationId = locationOption.find(
            (loc) => loc.label === location
          ).id;

          const total = matchedDataWater
            .filter((item) => item.SourceId === locationId) // Match location
            .reduce((sum, item) => {
              const value = item.answer[optionIndex][0]; // Extract the value for the current option
              const numValue = Number(value);
              return sum + (isNaN(numValue) || value === "" ? 0 : numValue); // Sum values
            }, 0);

          return total; // Return the total for this location and option
        });

        return {
          name: selectedProduct.value,
          data: data, // Raw data without any logarithmic transformation
          color: colorMapping[selectedProduct.value], // Assign color based on option
        };
      });

      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories, // Set x-axis labels (locations)
        },
      }));
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      const series = selectedProducts.map((selectedProduct) => {
        const data = productValuesMap[selectedProduct.value] || [];
        return {
          name: selectedProduct.value,
          data: data, // Use raw data without log transformation
          color: colorMapping[selectedProduct.value],
        };
      });
      const categories = Object.keys(timePeriods).map((key) =>
        key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    } else {
      const options =
        selectedProducts.length > 0
          ? selectedProducts.map((p) => p.value)
          : getOptions(matchedDataWater); // Get selected products or all products
      const categories = Object.keys(timePeriods);

      const series = options.map((option, index) => {
        const data = categories.map((key) => {
          return matchedDataWater
            .filter((item) => item.formDate === timePeriods[key]) // Filter by formDate
            .reduce((sum, item) => {
              const value = item.answer[index][0]; // First element of inner array
              return (
                sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value))
              );
            }, 0);
        });
        return {
          name: option,
          data: data, // Raw data without any logarithmic transformation
          color: colorMapping[option], // Assign color based on option
        };
      });

      setChartSeries(series);
    }
  }, [locationOption, timePeriodValues, matchedDataWater, selectedProducts]);

  const handleProductChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one matchedDataWater");
      return; // Prevent selecting zero products
    }
    if (selected.length > 5) {
      alert("You can only select up to 5 products");
      return; // Prevent selecting more than 5 products
    }
    setSelectedProducts(selected); // Update selected products state
  };

  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
          />
        )}
        {value && value.length > 0 && (
          <div style={{ color: "#3f88a5", marginLeft: "5px" }}>
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          height: "10%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            width: "40%",
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          {title}
        </div>

        <div style={{ width: "40%" }}>
          <Select
            options={productOptions}
            onChange={handleProductChange}
            isMulti
            value={selectedProducts}
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
      {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height="350" />
      ) : (
        <p>No data available</p>
      )}
     
    </div>
  );
};

export default MultipleBarWater;