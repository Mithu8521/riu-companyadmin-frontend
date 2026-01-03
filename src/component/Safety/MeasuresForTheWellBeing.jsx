import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Col, Row } from "react-bootstrap";

const MeasuresForTheWellBeing = () => {
  // Data for Permanent Employees
  const permanentData = {
    Time: {
      Q1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
        { name: "Age(25-45)", type: "line", data: [8, 5, 15, 10, 9] },
        { name: "Age(45-65)", type: "line", data: [6, 7, 5, 8, 7] },
      ],
      Q2: [
        { name: "Male", data: [20, 17, 14, 20, 20] },
        { name: "Female", data: [12, 10, 17, 14, 12] },
        // Additional data here...
      ],
      // Add data for Q3 and Q4...
    },
    Location: {
      Location1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        // Additional data here...
      ],
      // Add data for other locations...
    },
  };

  // Data for Non-Permanent Employees
  const nonPermanentData = {
    Time: {
      Q1: [
        { name: "Male", data: [12, 10, 8, 10, 11] },
        { name: "Female", data: [7, 6, 9, 7, 8] },
        // Additional data here...
      ],
      // Add data for Q2, Q3, Q4...
    },
    Location: {
      Location1: [
        { name: "Male", data: [12, 10, 8, 10, 11] },
        { name: "Female", data: [7, 6, 9, 7, 8] },
        // Additional data here...
      ],
      // Add data for other locations...
    },
  };

  const [isPermanent, setIsPermanent] = useState(true);
  const [timeLocation, setTimeLocation] = useState("Time");
  const [selectedSubOption, setSelectedSubOption] = useState("Q1");

  const options = {
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true, // Set to horizontal bar chart
        barHeight: "50%", // Adjust bar height
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

  const toggleData = () => {
    setIsPermanent(!isPermanent);
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

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span className="toggle-arrow">{isPermanent ? "→" : "←"}</span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
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
        series={
          isPermanent
            ? permanentData[timeLocation][selectedSubOption]
            : nonPermanentData[timeLocation][selectedSubOption]
        }
        type="bar"
        height={300}
      />
    </div>
  );
};

export default MeasuresForTheWellBeing;
