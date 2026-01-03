import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Import react-select

const ProductWiseStacked = ({
  timePeriods,
  locationOption,
  product,
  title,
  timePeriodValues,
}) => {
  const colorMapping = {
    Electricity: "#E6594D",
    Petrol: "#3F822B",
    Fuel: "#1212F1",
    Diesel: "#EEC27F",
    CNG: "#A14D49",
    PNG: "#791E80",
    LPG: "#e74c3c",
    "Natural gas": "#3498db",
    Coal: "#1abc9c",
    LPG: "#e67e22",
    Solar: "#3498db",
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
      enabled: true, // Enable tooltip
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
     dataLabels: {
       enabled: true,
       formatter: function (val, opts) {
         const totalValue = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
         return formatValue(totalValue); // Display formatted value inside bars
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
      logarithmic: false, // Disable logarithmic scale
      title: {
        text: "Emission (tCO2)",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      // min: 1, // Set minimum value to avoid zero values
      // max: 15, // Adjust max value based on your data
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        formatter: (value) => formatValue(value),
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

  // Format value with K (thousand) or M (million) for y-axis and data labels
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return Math.round(value); // Format normal numbers
    }
  };

  useEffect(() => {
    const initialProductValuesMap = {};

    const categories = Object.keys(timePeriods);
    const allOptions = getOptions(product);

    allOptions.forEach((option, index) => {
      const data = categories.map((key) => {
        const filteredData = product.filter(
          (item) => item.formDate === timePeriods[key]
        );

        const summedValue = filteredData.reduce((sum, item) => {
          const value = item.energyAndEmission[index] ? item.energyAndEmission[index][1] : 0;
          return sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value));
        }, 0);

        return summedValue;
      });

      initialProductValuesMap[option] = data;
    });

    setProductValuesMap(initialProductValuesMap);
  }, [timePeriods, product]);

  const getOptions = (product) => {
    const optionsArray = product
      .flatMap((item) => item.question_details)
      .filter((detail) => detail.option_type === "row")
      .map((detail) => detail.option);

    const uniqueOptions = [...new Set(optionsArray)];
    const modifiedOptions = uniqueOptions.length === 1 ? uniqueOptions :uniqueOptions.slice(1).reverse();

    return modifiedOptions;
  };

  const productOptions = useMemo(() => {
    return getOptions(product).map((option) => ({
      label: option,
      value: option,
    }));
  }, [product]);

  useEffect(() => {
    if (productOptions.length > 0) {
      const firstFiveProducts = productOptions.slice(0, 5);
      setSelectedProducts(firstFiveProducts);
    }
  }, [productOptions]);

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map((loc) => loc.label);

      const series = selectedProducts.map((selectedProduct) => {
        const optionIndex = getOptions(product).indexOf(selectedProduct.value);

        const data = categories.map((location) => {
          const locationId = locationOption.find(
            (loc) => loc.label === location
          ).id;

          const total = product
            .filter((item) => item.SourceId === locationId)
            .reduce((sum, item) => {
              const value = item.energyAndEmission[optionIndex][1];
              const numValue = Number(value);
              return sum + (isNaN(numValue) || value === "" ? 0 : numValue);
            }, 0);

          return total;
        });

        return {
          name: selectedProduct.value,
          data: data,
          color: colorMapping[selectedProduct.value],
        };
      });

      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      const series = selectedProducts.map((selectedProduct) => {
        const data = productValuesMap[selectedProduct.value] || [];
        return {
          name: selectedProduct.value,
          data: data, // No logarithmic transformation, use actual data
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
          : getOptions(product);
      const categories = Object.keys(timePeriods);

      const series = options.map((option, index) => {
        const data = categories.map((key) => {
          return product
            .filter((item) => item.formDate === timePeriods[key])
            .reduce((sum, item) => {
              const value = item.energyAndEmission[index][1];
              return (
                sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value))
              );
            }, 0);
        });
        return {
          name: option,
          data: data,
          color: colorMapping[option],
        };
      });

      setChartSeries(series);
    }
  }, [locationOption, timePeriodValues, product, selectedProducts]);

  const handleProductChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one product");
      return;
    }
    if (selected.length > 5) {
      alert("You can only select up to 5 products");
      return;
    }
    setSelectedProducts(selected);
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
          >
          </div>
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

        <div style={{ width: "35%" }}>
          <Select
            isMulti
            options={productOptions}
            value={selectedProducts}
            onChange={handleProductChange}
            placeholder="Select Products"
            hideSelectedOptions={false}
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator
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
      <div style={{ height: "85%", marginTop: "5%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
                          <Chart options={chartOptions} series={chartSeries} type="bar"   height={"100%"} />
                        ) : (
                          <p>No data available</p>
                        )}
    
      </div>
    </div>
  );
};

export default ProductWiseStacked;
