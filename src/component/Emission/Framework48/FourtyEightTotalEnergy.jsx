import React, { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts

const FourtyEightTotalEnergy = ({
  timePeriods,
  locationOption,
  brief,
  timePeriodValues,
}) => {

  const [chartSeries, setChartSeries] = useState([]);

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return Math.round(value); // Format normal numbers
    }
  };

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split('.');
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, num.length - 3);

    if (rest !== '') {
      lastThree = ',' + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + '.' + x[1] : num; // Just format the number without manipulating the input string
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        enabled: false,
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
        return `${formatNumberWithIndianCommas(val)}`; // Display formatted values inside bars
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
      colors: ["#791e80"],
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
        text: "Energy in GJ",
        style: {
          fontSize: '12px',    // Customize the font size
          fontWeight: 400,  // Customize the font weight, e.g., 'bold', 'normal'
          fontFamily: 'Arial', // Customize the font family
          color: '#011627',       // Customize the font color
        },
      },
      min: 0,
      labels: {
        style: {
          colors: ['#7b91b0'],
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
        formatter: (value) => formatValue(value), // Format y-axis labels
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${formatNumberWithIndianCommas(val)} GJ`;
        },
      },
    },
    colors: ["#791e80"],
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
  });

  useEffect(() => {
    if (!brief || !brief.time || !brief.location) return; // Handle missing data

    let categories = [];
    let seriesData = [];

    // Ensure locationOption and timePeriodValues are valid arrays before using them
    if (locationOption && Array.isArray(locationOption) && locationOption.length > 1 && Array.isArray(timePeriodValues) && timePeriodValues.length === 1) {
      categories = Object.keys(brief.time || {});
      seriesData = categories.map(locationKey => {
        return Object.values(brief.time[locationKey] || []).reduce(
          (sum, valArray) => sum + (Array.isArray(valArray) ? Number(valArray[0]) || 0 : 0),
          0
        );
      });
    } else if (Array.isArray(locationOption) && locationOption.length === 1 && Array.isArray(timePeriodValues) && timePeriodValues.length > 1) {
      categories = Object.keys(brief.location || {});
      seriesData = categories.map(locationKey => {
        return Object.values(brief.location[locationKey] || []).reduce(
          (sum, valArray) => sum + (Array.isArray(valArray) ? Number(valArray[0]) || 0 : 0),
          0
        );
      });
    } else {
      categories = Object.keys(brief.location || {});
      seriesData = categories.map(locationKey => {
        return Object.values(brief.location[locationKey] || []).reduce((sum, valArray) => {
          return sum + (Array.isArray(valArray) ? valArray.reduce((s, num) => s + (Number(num) || 0), 0) : 0);
        }, 0);
      });
    }

    setChartSeries([{ name: "Total Energy", data: seriesData }]);
    setChartOptions(prev => ({
      ...prev,
      xaxis: { ...prev.xaxis, categories },
    }));
  }, [JSON.stringify(locationOption), JSON.stringify(timePeriodValues), JSON.stringify(brief)]);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ height: "10%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
        Total Energy Consumption
      </div>
      {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={"100%"} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default FourtyEightTotalEnergy;
