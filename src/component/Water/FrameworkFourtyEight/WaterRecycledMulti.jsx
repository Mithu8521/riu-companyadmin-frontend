import React, { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts


const WaterRecycledMulti = ({
  timePeriods,
  locationOption,
  brief,
  timePeriodValues,
}) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {

        horizontal: false,

        columnWidth: "60px",

      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + " GJ"; // Display values inside bars
      },
      offsetY: 0, // Center the label vertically inside the bar
      style: {
        fontSize: "10px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#83bbd5"],
    },
    xaxis: {
      categories: [], // This will be set dynamically based on locationOption
      title: {
        text: timePeriodValues.length > 1 ? "---------- Time Period ----------" : locationOption.length > 1 ? " --------- Locations ---------" : "",
        style: {
          fontSize: '12px',    // Customize the font size
          fontWeight: 400,  // Customize the font weight, e.g., 'bold', 'normal'
          fontFamily: 'Arial', // Customize the font family
          color: '#011627',       // Customize the font color

        },
      },
      labels: {
        style: {
          colors: '#7b91b0',  // Light blue color for the y-axis labels
          fontSize: '12px',   // Adjust the label font size if needed
          fontFamily: 'Poppins',
        },
      },
    },
    yaxis: {
      categories: [], // This will be set dynamically based on locationOption
      title: {
        text: "---------- in KL -----------",
        style: {
          fontSize: '12px',    // Customize the font size
          fontWeight: 400,  // Customize the font weight, e.g., 'bold', 'normal'
          fontFamily: 'Arial', // Customize the font family
          color: '#011627',       // Customize the font color

        },
      },
      max: 1000000,
      min: 0,
      labels: {
        formatter: function (value) {
          return Math.round(value); // Round off to the nearest whole number
        },
        style: {
          colors: '#7b91b0',  // Light blue color for the y-axis labels
          fontSize: '12px',   // Adjust the label font size if needed
          fontFamily: 'Poppins',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} GJ`;
        },
      },
    },
    colors: ["#83bbd5"],
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
  });

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = Object.keys(brief.time);

      // Calculate total energy for each location (M1, M2, etc.) based on "Water recycling/reuse percentage* "
      const series = categories.map((locationKey) => {
        const locationData = brief.time[locationKey]; // Get M1, M2, etc.

        // Only consider the "Water recycling/reuse percentage* " key and sum its values
        const totalEnergy = locationData["Water recycling/reuse percentage* "]
          ? locationData["Water recycling/reuse percentage* "].reduce((sum, value) => {
            const numValue = Number(value); // Convert to a number
            return sum + (isNaN(numValue) ? 0 : numValue); // Add if it's a valid number
          }, 0)
          : 0;

        return totalEnergy; // Total energy for the current location (M1, M2, etc.)
      });

      const maxSeriesValue = Math.max(...series);

      // Update the chart series and options
      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories, // M1, M2, etc.
        },
        yaxis: {
          ...prev.yaxis,
          max: maxSeriesValue + 1000, // Set max value of y-axis based on the total sum + 1000
        },
      }));
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      const categories = Object.keys(brief.location);

      // Calculate total energy for each time period based on "Water recycling/reuse percentage* "
      const series = categories.map((timeKey) => {
        const timeData = brief.location[timeKey]; // Get data for each time period

        const totalEnergy = timeData["Water recycling/reuse percentage* "]
          ? timeData["Water recycling/reuse percentage* "].reduce((sum, value) => {
            const numValue = Number(value); // Convert to a number
            return sum + (isNaN(numValue) ? 0 : numValue); // Add if it's a valid number
          }, 0)
          : 0;

        return totalEnergy; // Total energy for the current time period
      });

      const maxSeriesValue = Math.max(...series);

      // Update the chart series and options
      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories, // Time periods
        },
        yaxis: {
          ...prev.yaxis,
          max: maxSeriesValue + 1000, // Set max value of y-axis based on the total sum + 1000
        },
      }));
    } else {
      const categories = Object.keys(brief.location);

      // Calculate total energy for each time period by summing all elements of "Water recycling/reuse percentage* "
      const series = categories.map((timeKey) => {
        const timeData = brief.location[timeKey]; // Get data for each time period

        const totalEnergy = timeData["Water recycling/reuse percentage* "]
          ? timeData["Water recycling/reuse percentage* "].reduce((sum, value) => {
            const numValue = Number(value); // Convert to a number
            return sum + (isNaN(numValue) ? 0 : numValue); // Add if it's a valid number
          }, 0)
          : 0;

        return totalEnergy; // Total energy for the current time period
      });

      const maxSeriesValue = Math.max(...series);

      // Update the chart series and options
      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories, // Time periods
        },
        yaxis: {
          ...prev.yaxis,
          max: maxSeriesValue + 1000, // Set max value of y-axis based on the total sum + 1000
        },
      }));
    }
  }, [locationOption, timePeriodValues, brief]);


  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ height: "10%", fontSize: "20px", fontWeight: 600, fontColor: "#011627" }}>Water Recycling Percentage</div>
      <div style={{ height: "90%" }}>
      { chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 && <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />}
      
      </div>
    </div>
  );
};

export default WaterRecycledMulti;
