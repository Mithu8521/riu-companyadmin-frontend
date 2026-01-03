import React from 'react';
import ReactApexChart from 'react-apexcharts';
// import './IndustryStandards.css'; // Import your CSS file for styling

const IndustryStandards = ({ title }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400,
    },

    xaxis: {
      categories: ['Your Company', 'Industry Standards', 'Top Performances'], // One category per bar

    },
    yaxis: {

    },
    legend: {
      show: false, // Hide the legend if not needed
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%', // Adjust the width of the bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value) => value,
      },
    },
  };

  const chartSeries = [
    {
      name: 'Value',
      data: [30, 50, 70], // Values for Your Company, Industry Standards, and Top Performances
    },
  ];

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
          type="bar"
          style={{ width: "100%" }}
          height={"100%"}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default IndustryStandards;
