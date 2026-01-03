import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts"; // ApexCharts for the chart
import Select, { components } from "react-select"; // For the dropdown
import img from "../../../img/no.png";
import CustomOption from "../../Company Sub Admin/Component/ESGDownload/CustomOption";


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

const DiversityBarStackComponent = ({
  title,
  dataOne,
}) => {
  // Colors for the chart
  const colorArray = [
    "#3366CC", // Rich Blue (Male)
    "#DD4477", // Rust Red (Female)
    "#FF9900", // Amber Orange (Other)
  ];

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

  // State to track selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // State for the chart data
  const [chartSeries, setChartSeries] = useState([]);
  // State for chart options
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
      categories: ["Permanent", "Other-than-Permanent", "Total Employees"],
      title: {
        text: "Employee Categories",
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
        text: "Number of Individuals",
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
    colors: colorArray,
  });

  // Extract categories - moved outside of the return
  const categories = useMemo(() => {
    if (!dataOne || dataOne.length === 0) return [];
    
    return dataOne.reduce((acc, item) => {
      if (item.question_details) {
        let filteredOptions = item.question_details
          .filter((detail) => detail.option_type === "column1")
          .map((detail) => detail.option);

        if (filteredOptions.length === 0) {
          filteredOptions = item.question_details
            .filter((detail) => detail.option_type === "column")
            .map((detail) => detail.option);
        }

        return acc.concat(filteredOptions);
      }

      return acc;
    }, []);
  }, [dataOne]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(categories)].reverse();
  }, [categories]);
  
  // Create category options for dropdown
  const categoryOptions = useMemo(() => {
    return uniqueCategories.map(category => ({
      label: category,
      value: category,
    }));
  }, [uniqueCategories]);

  // Initialize selected categories
  useEffect(() => {
    if (categoryOptions.length > 0) {
      // Take up to 3 categories (Male, Female, Other)
      const initialCategories = categoryOptions.slice(0, 3);
      setSelectedCategories(initialCategories);
    }
  }, [categoryOptions]);

  // Process data for chart series
  useEffect(() => {
    if (selectedCategories.length === 0 || !dataOne || dataOne.length === 0) return;

    // Find index for each gender category
    const maleIndex = uniqueCategories.findIndex(cat => 
      cat === "Number of Males" || cat === "Males");
    const femaleIndex = uniqueCategories.findIndex(cat => 
      cat === "Number of Females" || cat === "Females");
    const otherIndex = uniqueCategories.findIndex(cat => 
      cat === "Other" || cat === "Others" || cat === "Number of Others");

    // Data structure to hold our data items
    const dataItems = [
      { name: "Permanent", answerIndex: 0 },
      { name: "Other-than-Permanent", answerIndex: 1 },
      { name: "Total Employees", answerIndex: null } // This will be calculated from the others
    ];

    // Process and prepare data for each employee type
    dataItems.forEach(item => {
      if (item.answerIndex !== null) {
        // Extract values from dataOne
        const itemData = [dataOne[dataOne.length -1]];
        
        let maleValue = 0;
        let femaleValue = 0; 
        let otherValue = 0;
        
        if (maleIndex >= 0 && itemData[0].answer && itemData[0].answer[item.answerIndex]) {
          maleValue = Number(itemData[0].answer[item.answerIndex][maleIndex]) || 0;
        }
        
        if (femaleIndex >= 0 && itemData[0].answer && itemData[0].answer[item.answerIndex]) {
          femaleValue = Number(itemData[0].answer[item.answerIndex][femaleIndex]) || 0;
        }
        
        if (otherIndex >= 0 && itemData[0].answer && itemData[0].answer[item.answerIndex]) {
          otherValue = Number(itemData[0].answer[item.answerIndex][otherIndex]) || 0;
        }
        
        item.maleValue = isNaN(maleValue) ? 0 : maleValue;
        item.femaleValue = isNaN(femaleValue) ? 0 : femaleValue;
        item.otherValue = isNaN(otherValue) ? 0 : otherValue;
        item.totalValue = item.maleValue + item.femaleValue + item.otherValue;
      }
    });

    // Calculate the total values
    dataItems[2].maleValue = dataItems[0].maleValue + dataItems[1].maleValue;
    dataItems[2].femaleValue = dataItems[0].femaleValue + dataItems[1].femaleValue;
    dataItems[2].otherValue = dataItems[0].otherValue + dataItems[1].otherValue;
    dataItems[2].totalValue = dataItems[2].maleValue + dataItems[2].femaleValue + dataItems[2].otherValue;

    // Create series for the chart
    const series = [
      {
        name: 'Male',
        data: [dataItems[0].maleValue, dataItems[1].maleValue, dataItems[2].maleValue],
        color: colorArray[0],
      },
      {
        name: 'Female',
        data: [dataItems[0].femaleValue, dataItems[1].femaleValue, dataItems[2].femaleValue],
        color: colorArray[1],
      },
      {
        name: 'Other',
        data: [dataItems[0].otherValue, dataItems[1].otherValue, dataItems[2].otherValue],
        color: colorArray[2],
      }
    ];

    setChartSeries(series);

    // If we have data with all zeros, still show the chart structure
    const maxValue = Math.max(...series.flatMap(s => s.data));
    if (maxValue === 0) {
      setChartOptions(prev => ({
        ...prev,
        yaxis: {
          ...prev.yaxis,
          max: 10, // Set a default max so the chart is visible
        }
      }));
    }
  }, [selectedCategories, dataOne, uniqueCategories]);

  // Handle category selection change
  const handleCategoryChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one category");
      return;
    }
    if (selected.length > 3) {
      alert("You can only select up to 3 categories");
      return;
    }
    setSelectedCategories(selected);
  };

  // Render with no data early return
  if (!dataOne || dataOne.length === 0) {
    return (
      <div className="container">
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "25px", boxSizing: "border-box", width: "100%", height: "51vh" }}>
      <div style={{ height: "10%", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "40%", fontSize: "20px", fontWeight: 500, color: "#011627" }}>
          {title}
        </div>

        <div style={{ width: "45%" }}>
          <Select
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={handleCategoryChange}
            placeholder="Select Categories"
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
        {chartSeries.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
            key={`chart-${chartSeries.length}-${JSON.stringify(chartOptions.xaxis.categories)}`}
          />
        ) : (
          <div style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "#7b91b0",
          }}>
            <p>No data available for the selected criteria.</p>
            <p style={{ fontSize: "12px" }}>
              {categoryOptions.length === 0
                ? "No category options found in the data."
                : "Try selecting different categories."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiversityBarStackComponent;