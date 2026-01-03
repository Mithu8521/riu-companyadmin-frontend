import React, { useState } from "react";
import ApexCharts from "react-apexcharts";
import { useHistory } from "react-router-dom";


const RadialBarChartWithCheckboxes = ({
  graphData
}) => {
  const [selectedRadialBars, setSelectedRadialBars] = useState([0]);
  const history = useHistory(); // Use useHistory to navigate

  const colorPalette = {
    Accepted: "#11546f", // Light blue for Accepted
    Rejected: "#6fa8dc", // Tomato red for Rejected 
    Unresponded: "#85909a", // Gold for Unresponded
  };



  if (!graphData) return <div>Loading...</div>;

  const radialBarData = [
    {
      name: "Accepted",
      data: Number(graphData?.percentageAccepted),
      route: "/reporting-modules/all-module", // Route for accepted questions
      questionIds: graphData?.acceptedQuestionIds // IDs for accepted questions
    },
    {
      name: "Rejected",
      data: Number(graphData?.percentageRejected),
      route: "/reporting-modules/all-module", // Route for rejected questions
      questionIds: graphData?.rejectedQuestionIds // IDs for rejected questions
    },
    {
      name: "Unresponded",
      data: Number(graphData?.percentageAuditorUnresponded),
      route: "/reporting-modules/all-module", // Route for unresponded questions
      questionIds: graphData?.auditorNotRespondedIds // IDs for unresponded questions
    },
  ];

  const series = radialBarData
    .filter((_, index) => selectedRadialBars.includes(index))
    .map((item) => item.data);

  // Apply the predefined colors to the selected radial bars
  const colors = radialBarData
    .filter((_, index) => selectedRadialBars.includes(index))
    .map((item) => colorPalette[item.name]);

  // Chart options
  const chartOptions = {
    chart: {
      type: "radialBar",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          // Ensure the dataPointIndex is valid
          const index = config.dataPointIndex;
          if (index !== -1) {
            const selectedBar = radialBarData[index];
            const route = selectedBar.route;
            // Set the item in local storage
            localStorage.setItem("reportingQuestions", JSON.stringify(selectedBar.questionIds));
            // Navigate to the route
            history.push(route);
          }
        },
      },
    },
    plotOptions: {
      radialBar: {
        track: {
          strokeWidth: '110%', // Increase the width of each track
        },
        dataLabels: {
          show: false,
          enabled: false,
        },
      },
    },
    tooltip: {
      enabled: true, // Enable tooltips
      y: {
        formatter: (val) => `${val}%`, // Show the exact value on hover
      },
    },
    colors: colors, // Use predefined colors in the radial bars
    labels: radialBarData
      .filter((_, index) => selectedRadialBars.includes(index))
      .map((item) => item.name),
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedRadialBars((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          color: "#011627",
          fontSize: 22,
          height: "10%",
          paddingLeft: "0px",
          fontFamily: "Open Sans",
          fontWeight: "600",
          paddingTop: "0px",
          marginTop: "0%",
        }}
      >
        Auditor Question Status
      </div>
      <div className="chart-container" style={{ height: "80%" }}>
        <ApexCharts
          options={chartOptions}
          series={series}
          type="radialBar"
          height={"100%"}
          width={"100%"}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="checkboxes"
          style={{ height: "10%", display: "flex", gap: "15px" }}
        >
          {radialBarData.map((bar, index) => (
            <label key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                value={index}
                checked={selectedRadialBars.includes(index)}
                onChange={handleCheckboxChange}
                className="circular-checkbox" // Add a class for the checkbox
                style={{
                  borderColor: colorPalette[bar.name], // Use predefined color for the checkbox border
                }}
              />
              <span>{bar.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadialBarChartWithCheckboxes;


