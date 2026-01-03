import React, { useState } from "react";
import Chart from "react-apexcharts";

const SafetyTrainingCompletionRate = () => {
  const [isPermanent, setIsPermanent] = useState(true); // Toggle between permanent and non-permanent
  const [selectedQuarter, setSelectedQuarter] = useState("Q1"); // Default selection for quarter

  // Data for Permanent Employees
  const permanentData = {
    H1: [
      { name: "Employees", data: 40 },
      { name: "Workers", data: 60 },
      { name: "Employees Not Under Training", data: 20 },
      { name: "Workers Not Under Training", data: 30 },
    ],
    H2: [
      { name: "Employees", data: 45 },
      { name: "Workers", data: 55 },
      { name: "Employees Not Under Training", data: 25 },
      { name: "Workers Not Under Training", data: 35 },
    ],

  };

  // Data for Non-Permanent Employees
  const nonPermanentData = {
    Q1: [
      { name: "Employees", data: 30 },
      { name: "Workers", data: 50 },
      { name: "Employees Not Under Training", data: 15 },
      { name: "Workers Not Under Training", data: 25 },
    ],
    Q2: [
      { name: "Employees", data: 35 },
      { name: "Workers", data: 55 },
      { name: "Employees Not Under Training", data: 20 },
      { name: "Workers Not Under Training", data: 30 },
    ],
    Q3: [
      { name: "Employees", data: 40 },
      { name: "Workers", data: 50 },
      { name: "Employees Not Under Training", data: 25 },
      { name: "Workers Not Under Training", data: 35 },
    ],
    Q4: [
      { name: "Employees", data: 45 },
      { name: "Workers", data: 45 },
      { name: "Employees Not Under Training", data: 30 },
      { name: "Workers Not Under Training", data: 40 },
    ],
  };

  const options = {
    chart: {
      type: "donut",
    },
    labels: [
      "Employees",
      "Workers",
      "Employees Not Under Training",
      "Workers Not Under Training",
    ],
    legend: {
      show: true,
      position: "top",
    },
    colors: ["#3F88A5", "#B0C4DE", "#98D7C2", "#F7B7A3"],
  };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Safety Training Completion Rate</div>
      </div>
      <div
        className="d-flex flex-row"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div className="radio-buttons">
          {["Q1", "Q2", "Q3", "Q4"].map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedQuarter === quarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
              />
              {quarter}
            </label>
          ))}
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
      <div className="chart-container" style={{ marginTop: "-2%" }}>
        <Chart
          options={options}
          series={
            isPermanent
              ? permanentData[selectedQuarter].map((item) => item.data)
              : nonPermanentData[selectedQuarter].map((item) => item.data)
          }
          type="donut"
          height="300"
        />
      </div>
    </div>
  );
};

export default SafetyTrainingCompletionRate;
