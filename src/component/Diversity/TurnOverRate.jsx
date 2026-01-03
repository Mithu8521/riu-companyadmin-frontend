import React, { useState } from "react";
import Chart from "react-apexcharts";

const TurnOverRate = () => {
  const [isPermanent, setIsPermanent] = useState(true); // Toggle between permanent and non-permanent
  const [timeLocation, setTimeLocation] = useState("Time"); // Toggle between Time and Location
  const [selectedSubOption, setSelectedSubOption] = useState("Q1"); // Default selection for time/location

  // Data for Permanent Employees
  const permanentData = {
    Time: {
      Q1: [
        { name: "Scope 1", data: [4000, 3000, 3500, 2500] },
        { name: "Scope 2", data: [3500, 3000, 4000, 3000] },
      ],
      Q2: [
        { name: "Scope 1", data: [4200, 3100, 3400, 2600] },
        { name: "Scope 2", data: [3600, 3200, 4100, 3100] },
      ],
      // Add data for Q3 and Q4...
    },
    Location: {
      Location1: [
        { name: "Scope 1", data: [4500, 3200, 3600, 2800] },
        { name: "Scope 2", data: [3700, 3400, 4200, 3200] },
      ],
      // Add data for other locations...
    },
  };

  // Data for Non-Permanent Employees
  const nonPermanentData = {
    Time: {
      Q1: [
        { name: "Scope 3", data: [3000, 2500, 4000, 3500] },
        { name: "Scope 4", data: [2000, 3500, 3000, 4000] },
      ],
      // Add data for Q2, Q3, Q4...
    },
    Location: {
      Location1: [
        { name: "Scope 3", data: [3100, 2600, 4100, 3600] },
        { name: "Scope 4", data: [2100, 3600, 3100, 4100] },
      ],
      // Add data for other locations...
    },
  };

  const options = {
    chart: {
      type: "area",
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Location 1",
        "Location 2",
        "Location 3",
        "Location 4",
        "Location 5",
      ],
      labels: {
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          colors: "grey",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "grey",
        },
      },
    },
    colors: ["#3F88A5", "#B0C4DE"],
    legend: {
      show: true,
      position: "top",
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
      <div className="header">
        <div className="title">Turn Over Rate</div>
      </div>
      <div
        className="d-flex flex-row"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="Time"
              checked={timeLocation === "Time"}
              onChange={handleTimeLocationChange}
            />
            Time
          </label>
          <label>
            <input
              type="radio"
              value="Location"
              checked={timeLocation === "Location"}
              onChange={handleTimeLocationChange}
            />
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

      <div className="radio-buttons">
        {timeLocation === "Time"
          ? ["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedSubOption === quarter}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />
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
              />
              {location}
            </label>
          ))}
      </div>
      <div className="chart-container" style={{ marginTop: "-2%" }}>
        <Chart
          options={options}
          series={
            isPermanent
              ? permanentData[timeLocation][selectedSubOption]
              : nonPermanentData[timeLocation][selectedSubOption]
          }
          type="area"
          height="300"
        />
      </div>
    </div>
  );
};

export default TurnOverRate;
