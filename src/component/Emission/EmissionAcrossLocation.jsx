import React from "react";
import Chart from "react-apexcharts";
import "./EmissionAcrossLocation.css";

const EmissionAcrossLocation = () => {
  const series = [
    {
      name: "Rohi",
      data: [70000],
    },
    {
      name: "Noida",
      data: [20000],
    },
    {
      name: "Sector 16",
      data: [10000],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 100,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
      },
    },
    xaxis: {
      max: 100000,
      labels: {
        style: {
          colors: "#000000",
          fontWeight: "bold",
        },
        offsetY: -55,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    colors: ["#587B87", "#a8d5e2", "#d3d3d3"],
    legend: {
      show: false,
    },
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Emission Across The Location</div>
      </div>
      <div className="chartContainer">
            { series.length > 0 && options.xaxis.categories.length > 0 && <Chart
                          options={options}
                          series={series}
                          type="bar"
                          height={"100%"}
                        />}
      </div>
      <div className="legend-container">
        <div className="legend-item">
          <div
            className="legend-color-box"
            style={{ backgroundColor: "#587B87" }}
          ></div>
          <span>Rohi</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color-box"
            style={{ backgroundColor: "#a8d5e2" }}
          ></div>
          <span>Noida</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color-box"
            style={{ backgroundColor: "#d3d3d3" }}
          ></div>
          <span>Sector 16</span>
        </div>
      </div>
    </div>
  );
};

export default EmissionAcrossLocation;
