import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Import react-select
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

const CompareToPreviousYearProductWise = ({
  timePeriods,
  locationOption,
  product,
  title,
  timePeriodValues,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  unit,
  tab,
  DTYPE,
  type,
  indexing,
  Heading,
}) => {
  console.log(
    timePeriods,
    locationOption,
    product,
    title,
    timePeriodValues,
    "locationOption"
  );
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

  // Function to clean/shorten product titles
  const cleanProductTitle = (title) => {
    // Handle other acronyms
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
          let value;
          if (tab === "Safety") {
            if (item.answer[indexing]) {
              value = item.answer[indexing][index];
            } else {
              value = 0;
            }
          } else {
            if (item.answer[index]) {
              value = item.answer[index][0];
            } else {
              value = 0;
            }
          }

          return (
            sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value))
          );
        }, 0);

        return summedValue;
      });

      initialProductValuesMap[option] = data;
    });

    setProductValuesMap(initialProductValuesMap);
  }, [timePeriods, product, tab, indexing]);
  const calculateMaxValue = (series) => {
    if (!series || series.length === 0) return 0;

    return series.reduce((maxVal, currentSeries) => {
      const seriesMax = Math.max(...currentSeries.data);
      return Math.max(maxVal, seriesMax);
    }, 0);
  };
  const getOptions = (product) => {
    const optionsArray = product
      .flatMap((item) => item.question_details)
      .filter((detail) =>
        Heading === "MAIN" ||  Heading === "PMAIN"||  Heading === "PRIMAIN"
          ? detail.option_type === "row"
          : tab === "Safety" || tab === "Diversity" || tab === "Training"
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
    return getOptions(product).map((option) => ({
      label: cleanProductTitle(option), // Apply cleanProductTitle to labels
      value: option, // Keep original value for data processing
    }));
  }, [product, tab]);

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

  useEffect(() => {
    // First, check if we have both comparison time periods
    if (compareLastTimePeriods && compareTCurrentimePeriods) {
      const categories = [];

      // Create series data structure for all selected products
      const seriesWithValues = selectedProducts.map((selectedProduct) => {
        const data = [];
        const name = cleanProductTitle(selectedProduct.value);
        const optionIndex = getOptions(product).indexOf(selectedProduct.value);

        // Process first period group (last financial year)
        Object.keys(compareLastTimePeriods).forEach((period) => {
          const fromDate = compareLastTimePeriods[period];
          const periodLabel = `${
            financialYear[financialYear.length - 2].financial_year_value
          } (${period})`;

          // If this is the first product, add the category
          if (!categories.includes(periodLabel)) {
            categories.push(periodLabel);
          }

          // Calculate values for this product in this period
          const value = product
            .filter((item) => item.formDate === fromDate)
            .reduce((sum, item) => {
              if (!item.answer) return sum;
              console.log(item.answer[optionIndex], "item.answer");
              let productValue = 0;

              if (
                tab === "Safety" ||
                tab === "Diversity" ||
                tab === "Training"
              ) {
                if (
                  item.answer[indexing] &&
                  item.answer[indexing][optionIndex]
                ) {
                  productValue = Number(item.answer[indexing][optionIndex]);
                }
              } else {
                if (item.answer[optionIndex]) {
                  productValue = Number(item.answer[optionIndex][0]);
                }
              }
              if (Heading === "MAIN") {
                productValue = item.answer[optionIndex][0];
              }
              if (Heading === "PMAIN") {
                productValue =
                  item.answer[optionIndex][item.answer[optionIndex].length - 1];
              }
              if (Heading === "PRIMAIN") {
                productValue = item.answer[optionIndex].filter(
                  (item) =>
                    typeof item === "string" && item.toLowerCase() === "yes"
                ).length;
              }
              return (
                sum +
                (isNaN(productValue) || productValue === "" ? 0 : productValue)
              );
            }, 0);

          data.push(value);
        });

        // Process second period group (current financial year)
        Object.keys(compareTCurrentimePeriods).forEach((period) => {
          const fromDate = compareTCurrentimePeriods[period];
          const periodLabel = `${
            financialYear[financialYear.length - 1].financial_year_value
          } (${period})`;

          // If this is the first product, add the category
          if (!categories.includes(periodLabel)) {
            categories.push(periodLabel);
          }

          // Calculate values for this product in this period
          const value = product
            .filter((item) => item.formDate === fromDate)
            .reduce((sum, item) => {
              if (!item.answer) return sum;

              console.log(item.answer);
              let productValue = 0;
              if (
                tab === "Safety" ||
                tab === "Diversity" ||
                tab === "Training"
              ) {
                if (
                  item.answer[indexing] &&
                  item.answer[indexing][optionIndex]
                ) {
                  productValue = Number(item.answer[indexing][optionIndex]);
                }
              } else {
                if (item.answer[optionIndex]) {
                  productValue = Number(item.answer[optionIndex][0]);
                }
              }

              if (Heading === "MAIN") {
                productValue = item.answer[optionIndex][0];
              }
              if (Heading === "PMAIN") {
                productValue =
                  item.answer[optionIndex][item.answer[optionIndex].length - 1];
              }
              if (Heading === "PRIMAIN") {
                productValue = item.answer[optionIndex].filter(
                  (item) =>
                    typeof item === "string" && item.toLowerCase() === "yes"
                ).length;
              }
              return (
                sum +
                (isNaN(productValue) || productValue === "" ? 0 : productValue)
              );
            }, 0);

          data.push(value);
        });

        return {
          name: name,
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
      const maxDataValue = calculateMaxValue(sortedSeries);

      // Determine if we should fix the max at 4 or let it be dynamic
      const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
      const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
      // Update chart series and options
      setChartSeries(sortedSeries);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        yaxis: {
          ...prev.yaxis,
          min: 0,
          max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
        },
        colors: sortedSeries.length === 1 ? [colorArray[0]] : colorArray,
        plotOptions: {
          ...prev.plotOptions,
          bar: {
            ...prev.plotOptions.bar,
            distributed: sortedSeries.length === 1,
            columnWidth: sortedSeries.length === 1 ? "60%" : "60px",
          },
        },
      }));
    } else if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map((loc) => loc.label);

      // Create series with data for sorting
      const seriesData = selectedProducts.map((selectedProduct) => {
        const optionIndex = getOptions(product).indexOf(selectedProduct.value);

        const data = categories.map((location) => {
          const locationId = locationOption.find(
            (loc) => loc.label === location
          ).id;

          const total = product
            .filter((item) => item.SourceId === locationId)
            .reduce((sum, item) => {
              console.log(item.answer, "item");
              const value =
                tab === "Waste"
                  ? item.answer[0]
                    ? item.answer[0][optionIndex]
                    : 0
                  : tab === "Energy" || tab === "Emission"
                  ? tab === "Emission"
                    ? item.energyAndEmission[optionIndex][1]
                    : item.energyAndEmission[optionIndex][0]
                  : item.answer[optionIndex]
                  ? item.answer[optionIndex][0]
                  : 0;
              const numValue = Number(value);
              return sum + (isNaN(numValue) || value === "" ? 0 : numValue);
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
      const maxDataValue = calculateMaxValue(sortedSeries);

      // Determine if we should fix the max at 4 or let it be dynamic
      const yaxisMax = maxDataValue <= 4 ? 4 : undefined;
      const yaxisTickAmount = maxDataValue <= 4 ? 4 : undefined;
      // Special styling for single series
      if (sortedSeries.length === 1) {
        console.log("Single series detected - enhancing display");
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
            max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
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
            max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
            tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
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
        (key) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
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
          max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
        },
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        colors: colorArray,
      }));
    } else {
      const options =
        selectedProducts.length > 0
          ? selectedProducts.map((p) => p.value)
          : getOptions(product);
      const categories = Object.keys(timePeriods);

      // Create series with data for sorting
      const seriesWithValues = options.map((option, index) => {
        const data = categories.map((key) => {
          return product
            .filter((item) => item.formDate === timePeriods[key])
            .reduce((sum, item) => {
              const value = item.energyAndEmission[index][0];
              return (
                sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value))
              );
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
          max: yaxisMax,          // Will be 4 if max value ≤ 4, otherwise undefined (auto)
          tickAmount: yaxisTickAmount  // Will be 4 if max value ≤ 4, otherwise undefined (auto)
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
    compareLastTimePeriods,
    compareTCurrentimePeriods,
    financialYear,
    tab,
    indexing,
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

  // const CustomOption = (props) => {
  //   const { isSelected, data } = props;

  //   return (
  //     <components.Option {...props}>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             border: "2px solid #3f88a5",
  //             borderRadius: "2px",
  //             backgroundColor: isSelected ? "transparent" : "transparent",
  //             marginRight: "10px",
  //           }}
  //         >
  //           {isSelected && (
  //             <span style={{ color: "white", fontSize: "14px" }}>✔</span>
  //           )}
  //         </div>
  //         <span style={{ fontSize: "14px", fontWeight: 300 }}>
  //           {data.label}
  //         </span>
  //       </div>
  //     </components.Option>
  //   );
  // };

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

export default CompareToPreviousYearProductWise;
