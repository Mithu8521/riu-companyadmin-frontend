import React, { useState } from "react";
import Chart from "react-apexcharts";

const IndustryBenchmarkComparison = () => {
  const [timeLocation, setTimeLocation] = useState("Time");
  const [selectedCategory, setSelectedCategory] = useState("Q1");

  const handleOptionChange = (event) => {
    setTimeLocation(event.target.value);
    setSelectedCategory(event.target.value === "Time" ? "Q1" : "Location 1");
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getSeriesData = () => {
    if (timeLocation === "Time") {
      switch (selectedCategory) {
        case "Q1":
          return [53, 80, 65];
        case "Q2":
          return [55, 82, 68];
        case "Q3":
          return [60, 85, 70];
        case "Q4":
          return [63, 88, 73];
        default:
          return [];
      }
    } else if (timeLocation === "Location") {
      switch (selectedCategory) {
        case "Location 1":
          return [60, 85, 70];
        case "Location 2":
          return [65, 87, 75];
        case "Location 3":
          return [58, 83, 68];
        case "Location 4":
          return [62, 86, 72];
        default:
          return [];
      }
    }
  };

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",

      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Your Company", "Industry Average", "Top Performances"],
    },
    yaxis: {
      max: 100,
      title: {
        text: "Percentage",
      },
    },
    fill: {
      opacity: 1,
      colors: ["#3F88A5", "#4FD1C5", "#81E6D9"], // Matching colors from the chart
    },
    title: {
      text: "Comparison with Industry Benchmarks",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "Performance against industry benchmarks",
      align: "left",
      style: {
        fontSize: "14px",
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value="Time"
              checked={timeLocation === "Time"}
              onChange={handleOptionChange}
            />{" "}
            Time
          </label>
          <label>
            <input
              type="radio"
              value="Location"
              checked={timeLocation === "Location"}
              onChange={handleOptionChange}
            />{" "}
            Location
          </label>
        </div>
        <div>
          {timeLocation === "Time" ? (
            <>
              {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
                <label key={quarter}>
                  <input
                    type="radio"
                    value={quarter}
                    checked={selectedCategory === quarter}
                    onChange={handleCategoryChange}
                  />{" "}
                  {quarter}
                </label>
              ))}
            </>
          ) : (
            <>
              {["Location 1", "Location 2", "Location 3", "Location 4"].map((location) => (
                <label key={location}>
                  <input
                    type="radio"
                    value={location}
                    checked={selectedCategory === location}
                    onChange={handleCategoryChange}
                  />{" "}
                  {location}
                </label>
              ))}
            </>
          )}
        </div>
      </div>
      <Chart options={options} series={[{ name: "Performance Percentage", data: getSeriesData() }]} type="bar" height={350} />
    </div>
  );
};

export default IndustryBenchmarkComparison;
