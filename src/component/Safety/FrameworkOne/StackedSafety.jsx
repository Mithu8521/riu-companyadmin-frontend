import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import Select, { components } from "react-select";
import no from "../../../img/no.png";
import CustomOption from "../../Company Sub Admin/Component/ESGDownload/CustomOption";



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

// Define color array outside component to prevent recreation on each render
const CHART_COLORS = [
  "#3366CC", // Rich Blue (Male)
  "#DD4477", // Rust Red (Female)
  "#FF9900", // Amber Orange (Other)
];

export const StackedSafety = ({ title, data, ttype, tttype }) => {
  // Format value with K (thousand) or M (million) for y-axis and data labels
  const formatValue = (value) => {
    if (value === 0) return '0';
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return Math.round(value);
    }
  };

  // States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  
  // Extract categories with useMemo to prevent unnecessary recalculations
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Get all categories from data
    const allCategories = data[0]?.question_details
      ?.filter((detail) => detail.option_type === "column")
      ?.map((detail) => detail.option)
      ?.reverse() || [];
    
    // Remove duplicate categories by converting to Set and back to Array
    const uniqueCategories = [...new Set(allCategories)];
    
    return uniqueCategories;
  }, [data]);

  // Create category options for dropdown
  const categoryOptions = useMemo(() => {
    return categories.map(category => ({
      label: category,
      value: category,
    }));
  }, [categories]);

  // Memoize chart options to prevent recreation on each render
  const chartOptions = useMemo(() => ({
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
        columnWidth: '55%',
        dataLabels: {
          position: 'center',
        },
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
      categories: selectedCategories.map(cat => cat.label),
      title: {
        text: "Categories",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: false,
        trim: false,
        style: {
          colors: "#7b91b0",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        offsetX: -5,
        offsetY: 5,
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
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
        bottom: 25, // Increased bottom padding for x-axis labels
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
        shape: "circle",
        horizontal: 10,
        vertical: 10,
        radius: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
    },
    colors: CHART_COLORS,
    responsive: [{
      breakpoint: 1000,
      options: {
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
          }
        },
        xaxis: {
          labels: {
            rotate: -45,
            maxHeight: 60,
          }
        }
      }
    }]
  }), [selectedCategories]);

  // Reset selected categories when tttype changes
  useEffect(() => {
    if (categoryOptions.length > 0) {
      // Limit to 5 categories maximum
      const initialSelection = categoryOptions.slice(0, 5);
      setSelectedCategories(initialSelection);
    }
  }, [categoryOptions, tttype]); // Add tttype as a dependency to reset when it changes

  // Map selected categories to their original indices in the data
  const getDataIndex = (categoryValue) => {
    // Find the original index in the data array
    const originalCategories = data[0]?.question_details
      ?.filter((detail) => detail.option_type === "column")
      ?.map((detail) => detail.option)
      ?.reverse() || [];
    
    return originalCategories.findIndex(cat => cat === categoryValue);
  };

  // Update chart when selected categories or ttype changes
  useEffect(() => {
    if (!data || data.length === 0 || selectedCategories.length === 0) return;

    // Get selected category indices from the original data
    const selectedIndices = selectedCategories.map(selected => 
      getDataIndex(selected.value)
    ).filter(index => index !== -1);

    if (selectedIndices.length === 0) return;
    
    // Extract values for workers based on ttype
    const maleWorkers = selectedIndices.map(index => {
      const val = ttype === "PER" ? data[0]?.answer?.[0]?.[index] : data[0]?.answer?.[2]?.[index];
      return isNaN(Number(val)) ? 0 : Number(val);
    });
    
    const femaleWorkers = selectedIndices.map(index => {
      const val = ttype === "PER" ? data[0]?.answer?.[1]?.[index] : data[0]?.answer?.[3]?.[index];
      return isNaN(Number(val)) ? 0 : Number(val);
    });

    // Create series data
    const newSeries = [
      {
        name: " Male ",
        data: maleWorkers,
        color: CHART_COLORS[0],
      },
      {
        name: " Female ",
        data: femaleWorkers,
        color: CHART_COLORS[1],
      },
    ];

    setChartSeries(newSeries);
  }, [selectedCategories, data, categories, ttype, tttype]); // Added ttype and tttype as dependencies

  // Handle category selection change
  const handleCategoryChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one category");
      return;
    }
    if (selected.length > 5) {
      alert("You can only select up to 5 categories");
      return;
    }
    setSelectedCategories(selected);
  };

  // Render no data message if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="container">
        <img
          src={no}
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
    <div className="container" style={{ padding: "25px", boxSizing: "border-box", width: "100%", height: "50vh" }}>
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
        {chartSeries.length > 0 && chartSeries[0]?.data?.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
            key={`chart-${selectedCategories.length}-${ttype}-${tttype}`} // Add ttype and tttype to key to force re-render
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