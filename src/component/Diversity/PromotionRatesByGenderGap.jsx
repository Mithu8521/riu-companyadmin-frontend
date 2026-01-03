import React from "react";
import ReactApexChart from "react-apexcharts";


const PromotionRatesByGenderGap = ({ title, series }) => {
  // Default series data if not provided
  const defaultSeries = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const chartOptions = {
    legend: {
      show: false, // Removes the legends
    },
    chart: {
      type: "area",
      toolbar: {
        show: false, // Removes the toolbar
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "category", // Change type to 'category' if not using datetime
      categories: ["A", "B", "C", "D", "E", "F", "G"],
      labels: {
        style: {
          fontSize: "10px", // Adjust the size as needed
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const chartSeries = series || defaultSeries;

  return (
    <div className="spline-area-chart-container" style={{ width: "100%", height: "100%" }}>
      <div className="spline-area-chart-title" style={{ textAlign: "left", marginBottom: "10px" }}>
        {title}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90%", // Adjust height as needed
        }}
      >
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="area"
          style={{ width: "100%" }}
          height={"100%"}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default PromotionRatesByGenderGap;
