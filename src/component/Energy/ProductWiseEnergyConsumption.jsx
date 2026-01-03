import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { Form } from "react-bootstrap";
import { useState } from "react";

const colorPalette = [
  "#E6594D", // Petrol (Red)
  "#3F822B", // CNG (Green)
  "#1212F1", // LPG (Blue)
  "#EEC27F", // PNG (Orange)
  "#A14D49", // Briquette (Brown)
  "#791E80",
  "#33FFF4",
  "#9DFF33",
  "#FF3333",
  "#3377FF",
  "#FF7F50",
  "#FFD700",
  "#8A2BE2",
  "#D2691E",
  "#00FA9A",
];

const ProductWiseEnergyConsumption = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  type,
}) => {
  const [locations, setLocations] = useState([""]);
  const [quarters, setQuarters] = useState([""]);
  const [view, setView] = useState("time");
  const [selection, setSelection] = useState("Q1");
  const [colors, setColors] = useState([]);
  const [data, setData] = useState({
    time: {},
    location: {},
  });

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
    } else {
      return Math.round(value); // Format normal numbers
    }
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px", // Changed to fixed 60px as requested
        borderRadius: 0, // Removed curve from the bars
      },
    },
    stroke: {
      width: 0, // Set stroke width to 0 for bars without curves
    },
    markers: {
      size: 6,
      shape: "circle",
      strokeColor: "transparent",
      strokeWidth: 2,
      fillColor: "#fff",
      hover: {
        size: 8,
      },
    },
    xaxis: {
      categories: view === "time" ? quarters : locations,
      type: "category",
      tickPlacement: "between",
      labels: {
        style: {
          fontSize: "12px", // Increased month text size as requested
          colors: "#000000",
        },
        trim: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    yaxis: {
      title: {
        text: "Energy in GJ",
      },
      labels: {
        formatter: function (value) {
          return formatValue(value);
        },
        style: {
          fontSize: "12px",
          colors: "#A9A9A9",
          fontWeight: 400,
        },
      },
    },
    fill: {
      type: "solid",
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    legend: {
      show: false, // We'll handle legend manually with horizontal scrolling
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);
    setSelection(newView === "time" ? locations[0] : quarters[0]);
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const location = locationOption ? locationOption.length : 0;

  useEffect(() => {
    const dataType =
      view === "time" ? data.time[selection] : data.location[selection];

    if (!dataType) return;

    const fuelTypes = Object.keys(dataType);

    const colors = fuelTypes.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );
    setColors(colors);

    const newChartSeries = fuelTypes.map((fuelType) => ({
      name: fuelType,
      data: dataType[fuelType] || [],
    }));

    setChartSeries(newChartSeries);
    setChartOptions((prevState) => {
      return {
        ...prevState,
        xaxis: {
          categories: view === "time" ? quarters : locations,
          type: "category",
          labels: {
            style: {
              fontSize: "12px", // Increased month text size
              colors: "#000000",
            },
            trim: false,
          },
        },
        colors: colors,
      };
    });
  }, [view, selection, data]);

  useEffect(() => {
    if (!locationOption || !timePeriods || !graphData) return;
    const typeCate = {
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
     
      ],
      REW: [
        "Electricity consumption from Renewable energy (via PPA)",
        "Electricity consumption from Renewable energy (rooftop solar)",
      ],
    };
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

    // Define fuel types dynamically from graphData if available
    const allFuelTypes = [];
    if (Array.isArray(graphData) && graphData.length > 0) {
      graphData.forEach((item) => {
        if (
          item?.fuelType &&
          !allFuelTypes.includes(item?.fuelType) &&
          typeCate[type].includes(item?.fuelType.trim())
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
  }, [locationOption, timePeriods, graphData]);

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <div
        className="header"
        style={{ height: "10%", width: "100%", marginLeft: "0%" }}
      >
        <div className="title" style={{ marginLeft: "0%" }}>
          Product Wise{" "}
          {type === "FUEL"
            ? "Fuel"
            : type === "ELE"
            ? "Electricity"
            : type === "REW"
            ? "Renewable"
            : ""}{" "}
          Energy Consumption
        </div>
      </div>
      <div
        className="chart-container"
        style={{
          marginTop: "-2%",
          height: "90%",
          width: "100%",
          marginLeft: "0%",
        }}
      >
        {location >= 1 && (
          <div style={{ height: "100%", width: "100%", marginLeft: "0%" }}>
            <div
              className="radio-group horizontal"
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "1%",
                height: "5%",
                width: "100%",
                marginLeft: "0%",
              }}
            >
              <div style={{ width: "20%" }}>
                <Form.Check
                  type="radio"
                  style={{ marginRight: "5%" }}
                  label="Time"
                  value="time"
                  checked={view === "time"}
                  onChange={handleViewChange}
                />
              </div>
              <div style={{ width: "20%" }}>
                <Form.Check
                  type="radio"
                  label="Location"
                  value="location"
                  checked={view === "location"}
                  onChange={handleViewChange}
                />
              </div>
            </div>
            <div
              className="radio-group horizontal"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                overflow: "auto",
                marginLeft: "0%",
                height: "5%",
                width: "100%",
                marginTop: "1%",
              }}
            >
              {view === "time"
                ? locations.map((q) => (
                    <div key={q} style={{ width: "20%" }}>
                      <Form.Check
                        type="radio"
                        style={{ marginRight: "5%" }}
                        label={q}
                        value={q}
                        checked={selection === q}
                        onChange={handleSelectionChange}
                      />
                    </div>
                  ))
                : quarters.map((loc) => (
                    <div key={loc} style={{ width: "20%" }}>
                      <Form.Check
                        type="radio"
                        label={loc}
                        value={loc}
                        style={{ marginRight: "5%" }}
                        checked={selection === loc}
                        onChange={handleSelectionChange}
                      />
                    </div>
                  ))}
            </div>
            <div
              className="chart-container"
              style={{ marginLeft: "0%", height: "75%", width: "100%" }}
            >
              {chartSeries.length > 0 &&
                chartOptions.xaxis.categories.length > 0 && (
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={"100%"}
                  />
                )}
            </div>
            <div
              className="legend-container"
              style={{
                width: "100%",
                marginLeft: "0%",
                height: "11%",
                position: "relative",
                overflowX: "auto", // Enable horizontal scrolling
                overflowY: "hidden", // Prevent vertical scrolling
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  paddingBottom: "10px", // Add space for scrollbar
                  width: "max-content", // Ensure content takes as much space as needed
                }}
              >
                {chartOptions.colors &&
                  chartOptions.colors.length > 0 &&
                  chartSeries.map((series, index) => (
                    <div
                      className="legend-item"
                      style={{
                        minWidth: "180px", // Increased width to prevent overlap
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginRight: "20px", // Increased spacing between items
                      }}
                      key={index}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "8px",
                        }}
                      >
                        <div
                          className="legend-color-box"
                          style={{
                            backgroundColor: chartOptions.colors[index],
                            height: "12px",
                            width: "12px",
                            borderRadius: "0", // Square as requested
                          }}
                        ></div>
                      </div>

                      <div>
                        <div
                          className="legend-text"
                          style={{
                            whiteSpace: "nowrap", // Prevent text wrapping
                            fontSize: "12px",
                          }}
                        >
                          {series.name}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductWiseEnergyConsumption;