import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Import react-select
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

const ProductWiseStacked = ({
  timePeriods,
  locationOption,
  product,
  title,
  timePeriodValues,
  unit,
  tab,
  DTYPE,
  type,
  indexing,
}) => {
  const colorArray =
    title === "Bio-Medical Waste Ganerated"
      ? [
          "#FF0000", // Red
          "#FFFF00", // Yellow
          "#0000FF", // Blue
          "#C0C0C0", // White
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

  // Function to clean/shorten product titles
  const cleanProductTitle = (title) => {
    if (!title) return "";
    // Special case for specific acronyms
    if (title.startsWith("PF (")) {
      return "PF";
    }

    if (title.startsWith("ESI (")) {
      return "ESI";
    }

    if (title.startsWith("Others (please")) {
      return "Others";
    }

    if (title.startsWith("Groundwater")) {
      return "Ground Water";
    }

    if (title.startsWith("Surface water")) {
      return "Surface Water";
    }

    if (title.startsWith("Third-party water")) {
      return "Third Party Water";
    }

    if (
      title.startsWith(
        "Number of permanent employees who received training on the above topic"
      )
    ) {
      return "Permanent";
    }

    if (
      title.startsWith(
        "Number of other than permanent employees who received training on the above topic"
      )
    ) {
      return "Other than Permanent";
    }

    if (title.startsWith("Municipal water")) {
      return "Municipal Water";
    }

    if (title.startsWith("Seawater / desalinated water")) {
      return "SeaWater/Desalinated Water ";
    }

    if (title.startsWith("Construction and demolition")) {
      return "Construction and Demolition";
    }

    if (title.startsWith("To Surface water")) {
      return "Surface Water";
    }

    if (title.startsWith("To Groundwater")) {
      return "Ground Water";
    }

    if (title.startsWith("To Sea water")) {
      return "Sea Water";
    }

    if (title.startsWith("Sent to other parties")) {
      return "Sent to other Parties";
    }

    if (title.startsWith("Others")) {
      return "Other";
    }

    if (title.startsWith("Other recovery operations")) {
      return "Other Recovery Operation";
    }

    if (title.startsWith("Energy Consumption through other sources")) {
      return "Other Source";
    }

    if (
      title.startsWith(
        "Lost Time Injury Frequency Rate (LTIFR) (per one million-person hours worked)"
      )
    ) {
      return "LTIFR";
    }

    if (title.startsWith("Total Recordable Work-Related Injuries")) {
      return "Work Related Injury";
    }

    if (
      title.startsWith(
        "High Consequence Work-Related Injury or Ill-Health (excluding fatalities)"
      )
    ) {
      return "High Consequence Work Related Injury";
    }

    if (title.startsWith("Filed During the Year")) {
      return "Filed During year";
    }

    if (title.startsWith("Pending Resolution at the End of Year")) {
      return "Pending Resolution at the EOY";
    }

    // Handle other acronyms
    const acronymMatch = title.match(/^([A-Z]{2,})\s*\(/);
    if (acronymMatch) {
      return acronymMatch[1];
    }

    // Remove "Total" from the beginning if present
    let cleanedTitle = title.replace(/^Total\s+/i, "");

    // Remove "Number of" from the beginning if present
    cleanedTitle = cleanedTitle.replace(/^Number\s+of\s+/i, "");

    // Remove everything after and including parenthesis if present
    cleanedTitle = cleanedTitle.split(/\s*\(/)[0].trim();

    // Remove everything after and including asterisk (*) if present
    cleanedTitle = cleanedTitle.split("*")[0].trim();

    return cleanedTitle;
  };

  // Helper function to get value from item based on data type and tab
  const getValueFromItem = (item, optionIndex) => {
    let value;

    if (tab === "Waste" || DTYPE === "TRAINING") {
      if (item.answer[0]) {
        value = item.answer[0][optionIndex];
      } else {
        value = 0;
      }
    } else if (DTYPE === "OPERMANENT" || DTYPE === "STRAINING") {
      if (item.answer[1]) {
        value = item.answer[1][optionIndex];
      } else {
        value = 0;
      }
    } else if (tab === "Safety") {
      if (item.answer[indexing]) {
        value = item.answer[indexing][optionIndex];
      } else {
        value = 0;
      }
    } else if (tab === "Energy" || tab === "Emission") {
      if (item.energyAndEmission[optionIndex]) {
        if (tab === "Emission") {
          value = item.energyAndEmission[optionIndex][1];
        } else {
          value = item.energyAndEmission[optionIndex][0];
        }
      } else {
        value = 0;
      }
    } else if (DTYPE === "PMAINTRAINING") {
      if (item.answer[optionIndex]) {
        value = item.answer[optionIndex][item.answer[optionIndex].length - 1];
      } else {
        value = 0;
      }
    } else if (DTYPE === "PRIMAINTRAINING") {
      if (item.answer[optionIndex]) {
        value = item.answer[optionIndex].filter(
          (item) => typeof item === "string" && item.toLowerCase() === "yes"
        ).length;
      } else {
        value = 0;
      }
    } else {
      if (item.answer[optionIndex]) {
        value = item.answer[optionIndex][0];
      } else {
        value = 0;
      }
    }

    return isNaN(Number(value)) || value === "" ? 0 : Number(value);
  };

  const [chartSeries, setChartSeries] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productValuesMap, setProductValuesMap] = useState({});
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      stackType: "normal",
    },
    tooltip: {
      enabled: true,
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
        const totalValue =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
        return formatValue(totalValue);
      },
      offsetY: 0,
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [],
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
      logarithmic: false,
      title: {
        text: `${tab} in ${unit}`,
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
        formatter: (value) => formatValue(value),
      },
    },
    fill: {
      opacity: 1,
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
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      showForSingleSeries: true,
      showForNullSeries: true,
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
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return Math.round(value);
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
          return sum + getValueFromItem(item, index);
        }, 0);

        return summedValue;
      });

      initialProductValuesMap[option] = data;
    });
    setProductValuesMap(initialProductValuesMap);
  }, [timePeriods, product, locationOption]);

  const getOptions = (product) => {
    const optionsArray = product
      .flatMap((item) => item.question_details)
      .filter((detail) =>
        tab === "Waste" ||
        tab === "Safety" ||
        DTYPE === "PERMANENT" ||
        DTYPE === "OPERMANENT" ||
        DTYPE === "OVERALL" ||
        type === "SAFETY" ||
        DTYPE === "COMPLAINTS" ||
        DTYPE === "TRAINING" ||
        DTYPE === "STRAINING"
          ? detail.option_type === "column1" || detail.option_type === "column"
          : detail.option_type === "row"
      )
      .map((detail) => detail.option);

    // Don't slice if there's only one option
    const uniqueOptions = [...new Set(optionsArray)];

    // Only slice if there are multiple options
    return uniqueOptions.length > 1 ? uniqueOptions.reverse() : uniqueOptions;
  };

  // Apply cleanProductTitle to the labels in the selection options
  const productOptions = useMemo(() => {
    return getOptions(product)
      .filter(
        (option) =>
          option !==
          "Has any independent assessment, evaluation, or assurance been carried out by an external agency?"
      )
      .map((option) => ({
        label: cleanProductTitle(option), // Apply cleanProductTitle to labels
        value: option, // Keep original value for data processing
      }));
  }, [product]);

  useEffect(() => {
    if (productOptions.length > 0) {
      // Take at most 5 products, but at least 1
      const numProducts = Math.min(productOptions.length, 5);
      const firstProducts = productOptions.slice(0, numProducts);
      setSelectedProducts(firstProducts);
    } else {
      console.log("Warning: No product options available for selection");
    }
  }, [productOptions]);

  const calculateMaxValue = (series) => {
    if (!series || series.length === 0) return 0;

    return series.reduce((maxVal, currentSeries) => {
      const seriesMax = Math.max(...currentSeries.data);
      return Math.max(maxVal, seriesMax);
    }, 0);
  };

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map((loc) => loc.label);
      const seriesData = selectedProducts.map((selectedProduct) => {
        const optionIndex = getOptions(product).indexOf(selectedProduct.value);
        const data = categories.map((location) => {
          const locationId = locationOption.find(
            (loc) => loc.label === location
          ).id;
          const total = product
            .filter(
              (item) =>
                item.sourceId === locationId &&
                item.formDate === timePeriodValues[0]
            )
            .reduce((sum, item) => {
              return sum + getValueFromItem(item, optionIndex);
            }, 0);

          return total;
        });

        return {
          name: cleanProductTitle(selectedProduct.value),
          originalName: selectedProduct.value,
          data: data,
          totalValue: data.reduce((sum, val) => sum + val, 0),
        };
      });

      // Sort the series based on total values
      seriesData.sort((a, b) => b.totalValue - a.totalValue);

      // Assign colors based on total value (highest value gets first color)
      const sortedSeries = seriesData.map((series, index) => ({
        name: series.name,
        data: series.data,
        color: colorArray[index % colorArray.length],
      }));

      // Special styling for single series
      if (sortedSeries.length === 1) {
        const maxDataValue = calculateMaxValue(sortedSeries);

        // Determine if we should fix the max at 4 or let it be dynamic
        const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
        const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
        // Set specific colors and styling for single series
        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories: categories,
          },
          yaxis: {
            ...prev.yaxis,
            min: 0,
            max: yaxisMax, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          },
          colors: [colorArray[0]],
          legend: {
            ...prev.legend,
            showForSingleSeries: true,
            showForNullSeries: true,
            onItemClick: {
              toggleDataSeries: false,
            },
            onItemHover: {
              highlightDataSeries: true,
            },
          },
          plotOptions: {
            ...prev.plotOptions,
            bar: {
              ...prev.plotOptions.bar,
              distributed: false,
              columnWidth: "60%",
            },
          },
        }));
      } else {
        const maxDataValue = calculateMaxValue(sortedSeries);

        // Determine if we should fix the max at 4 or let it be dynamic
        const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
        const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
        // Multiple series - use regular styling
        setChartOptions((prev) => ({
          ...prev,
          xaxis: {
            ...prev.xaxis,
            categories: categories,
          },
          yaxis: {
            ...prev.yaxis,
            min: 0,
            max: yaxisMax, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          },
          colors: colorArray,
          legend: {
            ...prev.legend,
            showForSingleSeries: true,
            showForNullSeries: true,
          },
        }));
      }

      setChartSeries(sortedSeries);
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      // Create series with data for sorting
      const seriesWithValues = selectedProducts.map((selectedProduct) => {
        const data = productValuesMap[selectedProduct.value] || [];
        return {
          name: cleanProductTitle(selectedProduct.value),
          originalName: selectedProduct.value,
          data: data,
          totalValue: data.reduce((sum, val) => sum + val, 0),
        };
      });

      // Sort the series based on total values
      seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

      // Assign colors based on total value (highest value gets first color)
      const sortedSeries = seriesWithValues.map((series, index) => ({
        name: series.name,
        data: series.data,
        color: colorArray[index % colorArray.length],
      }));

      const categories = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      );
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
          max: yaxisMax, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          tickAmount: yaxisTickAmount, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
        },
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        colors: colorArray,
      }));
    } else if (locationOption.length > 1 && timePeriodValues.length > 1) {
      // NEW CONDITION: Multiple locations and multiple time periods
      // Aggregate data across all locations for each time period
      const seriesWithValues = selectedProducts.map((selectedProduct) => {
        const optionIndex = getOptions(product).indexOf(selectedProduct.value);
        const data = Object.keys(timePeriods).map((key) => {
          const timeValue = timePeriods[key];
          const ids = locationOption.map((item) => item.id);

          // Sum across all locations for this time period
          const total = product
            .filter(
              (item) =>
                item.formDate === timeValue && ids.includes(item.sourceId)
            )
            .reduce((sum, item) => {
              return sum + getValueFromItem(item, optionIndex);
            }, 0);

          return total;
        });

        return {
          name: cleanProductTitle(selectedProduct.value),
          originalName: selectedProduct.value,
          data: data,
          totalValue: data.reduce((sum, val) => sum + val, 0),
        };
      });

      // Sort the series based on total values
      seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

      // Assign colors based on total value (highest value gets first color)
      const sortedSeries = seriesWithValues.map((series, index) => ({
        name: series.name,
        data: series.data,
        color: colorArray[index % colorArray.length],
      }));

      const categories = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      );
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
          max: yaxisMax,
          tickAmount: yaxisTickAmount,
        },
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        colors: colorArray,
      }));
    } else {
      // Default case - single location, single time period (or other edge cases)
      const options =
        selectedProducts.length > 0
          ? selectedProducts.map((p) => p.value)
          : getOptions(product);
      const categories = Object.keys(timePeriods);

      // Create series with data for sorting
      const seriesWithValues = options.map((option, index) => {
        const optionIndex = getOptions(product).indexOf(option);

        const data = categories.map((key) => {
          return product
            .filter((item) => item.formDate === timePeriods[key])
            .reduce((sum, item) => {
              return sum + getValueFromItem(item, optionIndex);
            }, 0);
        });

        return {
          name: cleanProductTitle(option),
          originalName: option,
          data: data,
          totalValue: data.reduce((sum, val) => sum + val, 0),
        };
      });

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
          max: yaxisMax, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          tickAmount: yaxisTickAmount, // Will be 4 if max value ≤ 4, otherwise undefined (auto)
        },
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        colors: colorArray,
      }));
    }
  }, [
    locationOption,
    timePeriodValues,
    product,
    selectedProducts,
    productValuesMap,
  ]);

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
          ></div>
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
    <div className="container" style={{ height: "50vh" }}>
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
            fontWeight: 500,
            color: "#011627",
          }}
        >
          {title}
        </div>

        <div style={{ width: "45%" }}>
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
      <div style={{ height: "85%", marginTop: "5%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
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

export default ProductWiseStacked;
