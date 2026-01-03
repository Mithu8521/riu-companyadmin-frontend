import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import Select, { components } from "react-select";

const TotalWasteGeneratedMukt = ({ timePeriods, locationOption, matchedDataWaste, title, timePeriodValues }) => {
  const colorMapping = {
    "Other non-hazardous wastes": "#E6594D",
    "Other hazardous wastes": "#3F822B",
    "Radioactive": "#1212F1",
    "Battery": "#EEC27F",
    "Construction and demolition": "#A14D49",
    "Biomedical": "#86caea",
    "E-waste": "#65b1b6",
    "Plastic": "#791E80",
    "Recycled": "#E6594D",
    "Re-used": "#3F822B",
    "Other recovery operations": "#1212F1",
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatValue(val);
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
        text: "----------(MT)--------",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      min: 0,
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
          return `${formatValue(val)} MT`;
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
    legend: {
      show: true,
      position: "bottom",
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
    const allOptions = getOptions(matchedDataWaste);

    allOptions.forEach((option, index) => {
      const data = categories.map((key) => {
        const filteredData = matchedDataWaste.filter(
          (item) => item.formDate === timePeriods[key]
        );

        const summedValue = filteredData.reduce((sum, item) => {
          const value = item.answer[0] ? item.answer[0][index] : 0;
          return sum + (isNaN(Number(value)) || value === "" ? 0 : Number(value));
        }, 0);

        return summedValue;
      });

      initialProductValuesMap[option] = data;
    });

    setProductValuesMap(initialProductValuesMap);
  }, [timePeriods, matchedDataWaste]);

  const getOptions = (matchedDataWaste) => {
    const optionsArray = matchedDataWaste
      .flatMap((item) => item.question_details)
      .filter((detail) => (detail.option_type === "column" || detail.option_type === "column1"))
      .map((detail) => detail.option);

    const uniqueOptions = [...new Set(optionsArray)];
    const modifiedOptions = uniqueOptions.reverse();

    return modifiedOptions;
  };

  const productOptions = useMemo(() => {
    return getOptions(matchedDataWaste).map((option) => ({
      label: option,
      value: option,
    }));
  }, [matchedDataWaste]);

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
        const optionIndex = getOptions(matchedDataWaste).indexOf(selectedProduct.value);

        const data = categories.map((location) => {
          const locationId = locationOption.find(
            (loc) => loc.label === location
          ).id;

          const total = matchedDataWaste
            .filter((item) => item.SourceId === locationId)
            .reduce((sum, item) => {
              const value = item.answer[optionIndex][0];
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
          data: data.map(value => (value > 0 ? value : 0)),
        };
      });

      const categories = Object.keys(timePeriods).map((key) =>
        key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      const colors = series.map(item => colorMapping[item.name.trim()] || "#000000");

      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        colors: colors,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));

    } else {
      const options =
        selectedProducts.length > 0
          ? selectedProducts.map((p) => p.value)
          : getOptions(matchedDataWaste);
      const categories = Object.keys(timePeriods);

      const series = options.map((option, index) => {
        const data = categories.map((key) => {
          return matchedDataWaste
            .filter((item) => item.formDate === timePeriods[key])
            .reduce((sum, item) => {
              const value = item.answer[index][0];
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
  }, [locationOption, timePeriodValues, matchedDataWaste, selectedProducts]);

  const handleProductChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one matchedDataWaste");
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
              marginRight: "10px",
            }}
          >
            {isSelected && <span style={{ color: "white", fontSize: "14px" }}>✔</span>}
          </div>
          <span style={{ fontSize: "14px", fontWeight: 300 }}>{data.label}</span>
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
          <div style={{ color: "#3f88a5", fontWeight: 600, fontSize: "13px", position: "absolute", left: "5px" }}>
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
      <div style={{ height: "10%", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "40%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
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
                backgroundColor: state.isSelected ? "transparent" : state.isFocused ? "white" : "white",
                color: state.isSelected ? "black" : "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>
      <div style={{ height: "85%", marginTop: "5%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 && <Chart options={chartOptions} series={chartSeries} type="bar" height={"100%"} />}
      </div>
    </div>
  );
};

export default TotalWasteGeneratedMukt;
