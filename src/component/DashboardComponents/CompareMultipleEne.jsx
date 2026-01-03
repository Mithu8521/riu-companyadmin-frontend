import React, { useEffect, useState, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import Select, { components } from "react-select";
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

// Enhanced color palette from the second file
const colorPalette = [
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

// Function to clean/shorten product titles from the second file
const cleanProductTitle = (title) => {
  // Helper function to convert to title case
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (word) => {
      // Preserve apostrophes and capitalize the first letter of each word
      return word.charAt(0).toUpperCase()+ word.slice(1);
    });
    if (
      title.startsWith(
        "Electricity Power plant (Captive Power Plant - Natural Gas)"
      )
    ) {
      return "Electricity Power Plant";
    }
  // Handle specific cases
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


// Format value for display
const formatValue = (value) => {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
  } else {
    return Math.round(value); // Format normal numbers
  }
};

const CompareMultipleEne = ({
  locationOption,
  timePeriods,
  graphData,
  type,
}) => {
  const [locations, setLocations] = useState([""]);
  const [quarters, setQuarters] = useState([""]);
  const [view, setView] = useState("time");
  const [selection, setSelection] = useState("Q1");
  const [colors, setColors] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [data, setData] = useState({
    time: {},
    location: {},
  });

  const typeCate = useMemo(
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
        "Number of  New hires by Gender Male",
        "Number of New hires by Gender Female",
      ],
      AGEDIV: [
        "Employees less than 30 years of age (%)",
        "Employees between 30-50 years of age (%)",
        "Employees more than 50 years of age (%)",
      ],
    }),
    []
  );

  // Get energy unit based on type
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
    if (type === "EMPLOYEES") return "Employees";
    if (type === "HAZ") return "Hazardous Waste";
    if (type === "NONHAZ") return "Non-hazardous Waste";
    if (type === "GENDERDIV") return "Gender Diversity";
    if (type === "AGEDIV") return "Age Based Diversity";
    return "";
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px", // Fixed 60px as in the second file
        borderRadius: 0,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatValue(val);
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [],
      type: "category",
      tickPlacement: "between",
      labels: {
        style: {
          fontSize: "12px",
          colors: "#7b91b0",
          fontFamily: "Poppins",
        },
        trim: false,
      },
      title: {
        text: "Locations",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
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
        formatter: function (value) {
          return formatValue(value);
        },
        style: {
          fontSize: "12px",
          colors: "#7b91b0",
          fontFamily: "Poppins",
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
      borderColor: "#9e9b9b",
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
    colors: colorPalette,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 12,
        height: 12,
        borderRadius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      formatter: function (seriesName, opts) {
        return `<div style="display: flex; align-items: center;">
                 <span style="color: #7b91b0;">${seriesName}</span>
                </div>`;
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

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
  }, [energyUnit]);

  // Update selection when view changes
  useEffect(() => {
    if (view === "time" && locations.length > 0) {
      setSelection(locations[0]);
    } else if (view === "location" && quarters.length > 0) {
      setSelection(quarters[0]);
    }
  }, [view, locations, quarters]);

  // Process graphData to extract available fuel types
  const fuelTypeOptions = useMemo(() => {
    if (!graphData || !Array.isArray(graphData) || graphData.length === 0)
      return [];

    const allFuelTypes = [];
    graphData.forEach((item) => {
      if (
        item?.fuelType &&
        !allFuelTypes.includes(item?.fuelType) &&
        typeCate[type]?.includes(item?.fuelType.trim())
      ) {
        allFuelTypes.push(item?.fuelType);
      }
    });
    return allFuelTypes.map((fuelType) => ({
      value: fuelType,
      label: cleanProductTitle(fuelType),
    }));
  }, [graphData, typeCate, type]);

  // Set initial fuel type selection
  useEffect(() => {
    if (fuelTypeOptions.length > 0) {
      setSelectedFuelTypes(
        fuelTypeOptions.slice(0, 5).map((option) => option.value)
      );
    } else {
      setSelectedFuelTypes([]);
    }
  }, [fuelTypeOptions]);

  // Handle fuel type selection change
  const handleFuelTypeChange = useCallback((selectedOptions) => {
    if (selectedOptions.length > 5) {
      alert("You can only select up to 5 fuel types.");
      return;
    }
    setSelectedFuelTypes(selectedOptions.map((option) => option.value));
  }, []);

  // Process data for chart when view, selection, or data changes
  useEffect(() => {
    const dataType =
      view === "time" ? data.time[selection] : data.location[selection];

    if (!dataType) return;

    // Filter by selected fuel types or use all if none selected
    const fuelTypes =
      selectedFuelTypes.length > 0
        ? Object.keys(dataType).filter((type) =>
            selectedFuelTypes.includes(type)
          )
        : Object.keys(dataType);

    // Assign colors from palette
    const newColors = fuelTypes.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );
    setColors(newColors);

    // Map data to series format for chart
    const seriesWithValues = fuelTypes.map((fuelType) => ({
      name: cleanProductTitle(fuelType),
      data: dataType[fuelType] || [],
      totalValue: Array.isArray(dataType[fuelType])
        ? dataType[fuelType].reduce((sum, val) => sum + (Number(val) || 0), 0)
        : 0,
    }));

    // Sort series by total value (highest value first)
    seriesWithValues.sort((a, b) => b.totalValue - a.totalValue);

    const newChartSeries = seriesWithValues.map((series, index) => ({
      name: series.name,
      data: series.data,
      color: colorPalette[index % colorPalette.length],
    }));

    setChartSeries(newChartSeries);
    setChartOptions((prevState) => ({
      ...prevState,
      xaxis: {
        ...prevState.xaxis,
        categories: view === "time" ? quarters : locations,
      },
      colors: newColors,
    }));
  }, [view, selection, data, selectedFuelTypes]);

  // Process the graphData to structure it for the chart
  useEffect(() => {
    if (!locationOption || !timePeriods || !graphData) return;

    const valuesArray = locationOption
      ? locationOption.map((item) => item.unitCode || item.value)
      : [];

    const transformedKeys = Object.keys(timePeriods).map((key) => key);

    setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
    setQuarters(transformedKeys);
    setLocations(valuesArray);

    const summary = {
      time: {},
      location: {},
    };

    // Define fuel types dynamically from graphData
    const allFuelTypes = [];
    if (Array.isArray(graphData) && graphData.length > 0) {
      graphData.forEach((item) => {
        if (
          item?.fuelType &&
          !allFuelTypes.includes(item?.fuelType) &&
          typeCate[type]?.includes(item?.fuelType.trim())
        ) {
          allFuelTypes.push(item?.fuelType);
        }
      });
    }

    // Initialize data structures
    locationOption.forEach((location) => {
      transformedKeys.forEach((quarter) => {
        summary.location[quarter] = {};
        allFuelTypes.forEach((fuelType) => {
          summary.location[quarter][fuelType] = new Array(
            locationOption.length
          ).fill(0);
        });
      });
    });

    transformedKeys.forEach((quarter) => {
      locationOption.forEach((location) => {
        summary.time[location?.unitCode] = {};
        allFuelTypes.forEach((fuelType) => {
          summary.time[location?.unitCode][fuelType] = new Array(
            transformedKeys.length
          ).fill(0);
        });
      });
    });

    const filteredData = Array.isArray(graphData) ? graphData : [];
    const timeKey = Object.keys(summary.location);
    const locationKey = Object.keys(summary.time);

    // Populate time data
    for (const location of locationKey) {
      const data = summary.time[location];
      for (const fuelType of allFuelTypes) {
        for (let k = 0; k < timeKey.length; k++) {
          let time = timeKey[k];
          const obj = locationOption.find((item) => item.unitCode === location);
          const formDate = timePeriods[time];

          if (!obj) continue;

          const filterData = filteredData.find(
            (item) =>
              item.fuelType === fuelType &&
              item.formDate === formDate &&
              item.sourceId === obj.id
          );

          if (data[fuelType]) {
            data[fuelType][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    // Populate location data
    for (const time of timeKey) {
      const data = summary.location[time];
      for (const fuelType of allFuelTypes) {
        for (let k = 0; k < locationKey.length; k++) {
          let location = locationKey[k];
          const obj = locationOption.find((item) => item.unitCode === location);
          const formDate = timePeriods[time];

          if (!obj) continue;

          const filterData = filteredData.find(
            (item) =>
              item.fuelType === fuelType &&
              item.formDate === formDate &&
              item.sourceId === obj.id
          );

          if (data[fuelType]) {
            data[fuelType][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    setData({
      time: summary.time,
      location: summary.location,
    });
  }, [locationOption, timePeriods, graphData, typeCate, type, view]);

  // Custom dropdown components
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
            {placeholder}
          </div>
        )}
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
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  const location = locationOption ? locationOption.length : 0;

  return (
    <div className="container" style={{ height: "50vh" }}>
      <div
        style={{
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
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

        {/* View selection (Time/Location) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "20px",
          }}
        >
          <div
            style={{
              marginRight: "10px",
              color: "#3f88a5",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            View by:
          </div>
          <div
            style={{
              display: "inline-flex",
              borderRadius: "5px",
              overflow: "hidden",
              border: "1px solid #3f88a5",
            }}
          >
            <button
              onClick={() => {
                setView("time");
                if (locations.length > 0) {
                  setSelection(locations[0]);
                }
              }}
              style={{
                padding: "5px 15px",
                backgroundColor: view === "time" ? "#3f88a5" : "transparent",
                color: view === "time" ? "white" : "#3f88a5",
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Time
            </button>
            <button
              onClick={() => {
                setView("location");
                if (quarters.length > 0) {
                  setSelection(quarters[0]);
                }
              }}
              style={{
                padding: "5px 15px",
                backgroundColor:
                  view === "location" ? "#3f88a5" : "transparent",
                color: view === "location" ? "white" : "#3f88a5",
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Location
            </button>
          </div>
        </div>
      </div>

      {location >= 1 && (
        <div
          style={{
            height: "90%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {/* Selection for Time/Location based on view */}
            <div
              style={{
                minWidth: "200px",
                maxWidth: "300px",
              }}
            >
              <Select
                options={
                  view === "time"
                    ? locations.map((loc) => ({ value: loc, label: loc }))
                    : quarters.map((q) => ({ value: q, label: q }))
                }
                value={{
                  value: selection,
                  label: selection,
                }}
                onChange={(option) => setSelection(option.value)}
                components={{
                  Option: CustomOption,
                  Control: CustomControl,
                  ClearIndicator: CustomClearIndicator,
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "2px solid #3f88a5",
                    borderRadius: "10px",
                    minHeight: "38px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 100,
                    border: "2px solid #3f88a5",
                    borderRadius: "10px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#3f88a5"
                      : state.isFocused
                      ? "#e6f7ff"
                      : "white",
                    color: state.isSelected ? "white" : "black",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            {/* Multi-select dropdown for fuel types */}
            <div style={{ width: "45%" }}>
              <Select
                isMulti
                options={fuelTypeOptions}
                onChange={handleFuelTypeChange}
                value={fuelTypeOptions.filter((option) =>
                  selectedFuelTypes.includes(option.value)
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

          {/* Chart container */}
          <div
            style={{
              height: "calc(100% - 80px)",
              width: "100%",
            }}
          >
            {chartSeries.length > 0 &&
            chartOptions.xaxis.categories.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="100%"
                width="100%"
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
                  {fuelTypeOptions.length === 0
                    ? "No fuel type options found in the data."
                    : "Try selecting different fuel types, time periods, or locations."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareMultipleEne;
