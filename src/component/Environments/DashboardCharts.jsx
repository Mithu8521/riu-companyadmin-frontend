import React from "react";
import ReactApexChart from "react-apexcharts";
import "./DashboardCharts.css";
const DashboardCharts = () => {
  const charts = [
    {
      title: "Top Energy Consuming Sites",
      data: [1000, 700, 500],
      categories: ["Noida", "City-1", "Rohi"],
    },
    {
      title: "Top Emissions Contributing Sites",
      data: [800, 600, 400],
      categories: ["Noida", "City-1", "Rohi"],
    },
    {
      title: "Top Water Consuming Sites",
      data: [500, 400, 300],
      categories: ["Noida", "City-1", "Rohi"],
    },
    {
      title: "Top Waste Disposal Sites",
      data: [120, 90, 60],
      categories: ["Noida", "City-1", "Rohi"],
      type: "line",
    },
  ];
  return (
    <div className="dashboard-charts">
      {charts.map((chart, index) => (
        <div className="chartt-container" key={index}>
          <h3 style={{ fontSize: "1em" }}>{chart.title}</h3>
          <ReactApexChart
            options={{
              chart: {
                id: `chart-${index}`,
                toolbar: { show: false },
                offsetX: -5
              },
              xaxis: {
                categories: chart.categories,
                labels: {
                  style: {
                    fontSize: "10px", // Decrease font size
                    fontWeight: "300", // Set font weight to light
                    colors: "grey", // Optional: color for labels
                  },
                },
              },
              stroke: {
                width: chart.type === "line" ? 2 : 0,
                curve: "smooth",
              },
              fill: {
                opacity: chart.type === "line" ? 0.5 : 1,
              },
              dataLabels: {
                enabled: false,
              },
              yaxis: {
                labels: {
                  formatter: (val) => val.toFixed(0),
                  style: {
                    fontSize: "10px", // Decrease font size
                    fontWeight: "300", // Set font weight to light
                    colors: "grey", // Optional: color for labels
                  },
                },
              },
              tooltip: {
                enabled: true,
              },
            }}
            series={[
              {
                name: chart.title,
                data: chart.data,
                type: chart.type || "bar",
              },
            ]}
            type={chart.type || "bar"}
            height={"80%"}
            width={"100%"}
          />
        </div>
      ))}
    </div>
  );
};
export default DashboardCharts;
