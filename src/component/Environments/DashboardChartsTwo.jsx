import React from "react";
import ReactApexChart from "react-apexcharts";

const chartData = [
  {
    title: "Renewable And Non-Renewable Energy Mix",
    options: {
      labels: ["Renewable", "Non-Renewable"],
      colors: ["#81C784", "#455A64"],
    },
    series: [30, 70],
    type: "pie",
  },
  {
    title: "Scope 1 & Scope 2 Emissions",
    options: {
      labels: ["Scope 1", "Scope 2"],
      colors: ["#29B6F6", "#81D4FA"],
    },
    series: [20, 80],
    type: "donut",
  },
  {
    title: "Total Water Withdrawn And Discharged",
    options: {
      labels: ["Withdrawn", "Discharged"],
      colors: ["#4FC3F7", "#B3E5FC"],
    },
    series: [10, 90],
    type: "pie",
  },
  {
    title: "Waste Disposed By Type",
    options: {
      labels: ["Recycled", "Disposed"],
      colors: ["#546E7A", "#CFD8DC"],
    },
    series: [15, 85],
    type: "donut",
  },
];

const DashboardChartsTwo = () => {
  return (
    <div className="dashboard-charts">
      {chartData.map((chart, index) => (
        <div className="chartt-container" style={{ height: "100%" }} key={index}>
          <h3 style={{ fontSize: "1em" }}>{chart.title}</h3>
          <ReactApexChart
            options={{
              ...chart.options,
              chart: {
                id: `chart-${index}`,
                toolbar: { show: false },
                offsetX: -5,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                width: chart.type === "line" ? 2 : 0,
                curve: "smooth",
              },
              tooltip: {
                enabled: true,
              },
              legend: {
                show: false,  // Hide the legends
              },
            }}
            series={chart.series}
            type={chart.type}
            height={"100%"}
            width={"100%"}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardChartsTwo;
