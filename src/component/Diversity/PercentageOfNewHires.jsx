import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Col, Row } from "react-bootstrap";

const PercentageOfNewHires = () => {
  // Data based on Time and Location
  const data = {
    Time: {
      Q1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
      Q2: [
        { name: "Male", data: [20, 17, 14, 20, 20] },
        { name: "Female", data: [12, 10, 17, 14, 12] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
      // Add data for Q3 and Q4...
    },
    Location: {
      Location1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
      Location2: [
        { name: "Male", data: [20, 17, 14, 20, 20] },
        { name: "Female", data: [12, 10, 17, 14, 12] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
      // Add data for other locations...
    },
  };

  const [timeLocation, setTimeLocation] = useState("Time");
  const [selectedSubOption, setSelectedSubOption] = useState("Q1");

  const options = {
    chart: {
      height: 350,
      type: "bar",
      stacked: false, // Set to false for non-stacked bars
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set to vertical bar chart
        columnWidth: "50%", // Adjust bar width
      },
    },
    stroke: {
      width: [0, 0, 0, 3, 3],
      curve: "smooth",
    },
    fill: {
      opacity: [1, 1, 1, 0.25, 0.25],
      colors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
    },
    legend: {
      show: false,
      enabled: false,
      position: "top",
      markers: {
        fillColors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
      },
    },
    xaxis: {
      categories: [
        "Location 1",
        "Location 2",
        "Location 3",
        "Location 4",
        "Location 5",
      ],
    },
    yaxis: {
      title: {
        text: "Total Employees",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const handleTimeLocationChange = (event) => {
    setTimeLocation(event.target.value);
    setSelectedSubOption(timeLocation === "Time" ? "Q1" : "Location1");
  };

  return (
    <div className="container">
      <h2 style={{ fontSize: "1em" }}>
        Total Employees Including Differently Abled
      </h2>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="Time"
              checked={timeLocation === "Time"}
              onChange={handleTimeLocationChange}
            />{" "}
            Time
          </label>
          <label>
            <input
              type="radio"
              value="Location"
              checked={timeLocation === "Location"}
              onChange={handleTimeLocationChange}
            />{" "}
            Location
          </label>
        </div>
      </div>

      <div className="radio-buttons" style={{ marginTop: "-30px" }}>
        {timeLocation === "Time"
          ? ["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedSubOption === quarter}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />{" "}
              {quarter}
            </label>
          ))
          : [
            "Location1",
            "Location2",
            "Location3",
            "Location4",
            "Location5",
          ].map((location) => (
            <label key={location}>
              <input
                type="radio"
                value={location}
                checked={selectedSubOption === location}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />{" "}
              {location}
            </label>
          ))}
      </div>

      <Chart
        options={options}
        series={data[timeLocation][selectedSubOption]}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default PercentageOfNewHires;
