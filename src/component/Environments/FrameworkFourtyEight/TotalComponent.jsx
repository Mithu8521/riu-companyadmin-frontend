import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const TotalComponent = ({ title, brief, unit }) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true, // Enable stacking
      toolbar: {
        enabled: false, show: false
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
      formatter: function (val, { seriesIndex, dataPointIndex }) {
        const logValue = val; // Logarithmic value passed to tooltip
        const originalValue = Math.pow(10, logValue); // Reverse log to get original value
        return `${originalValue.toFixed(0)} `; // Display original value in tooltip
      },
      offsetY: 0, // Center the label vertically inside the bar
      style: {
        fontSize: "12px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: ["#7b91b0"], // Light blue color for the y-axis labels
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      }, // This will be set dynamically based on the location keys
      title: {
        text: "Time Periods",
        style: {
          colors: ['#7b91b0'],  // Light blue color for the y-axis labels
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
        offsetY: -20, // Set vertical offset to -20
      },
    },
    yaxis: {
      title: {
        text: `---------- in ${unit} -----------`,
        style: {
          colors: ["#7b91b0"], // Light blue color for the y-axis labels
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
      labels: {
        formatter: function (val) {
          return (val.toFixed(1)); // Remove decimals by rounding the value
        },
        style: {
          colors: ["#7b91b0"], // Light blue color for the y-axis labels
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
          // Retrieve the log-transformed value and calculate the original value using the inverse of log
          const loggedValue =
            w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const originalValue = Math.pow(10, loggedValue); // Inverse of log10 to get the original value
          return `${originalValue.toFixed(2)} ${unit}`; // Show original un-logged value in tooltip
        },
      },
    },
    colors: ["#83bbd5", "#f3a683", "#e77f67", "#f7d794"], // Different colors for different stacks
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    legend: {
      show: true,
      markers: {
        width: 12, // Custom legend marker width
        height: 12, // Custom legend marker height

        borderRadius: 12, // Keep circular markers

      },
      position: "bottom", // Adjust as necessary (top, right, bottom, left)
      horizontalAlign: "center", // Align legend items in the center
      itemMargin: {
        horizontal: 10, // Space between legend items
        vertical: 0, // Vertical space (if needed)
      },
      formatter: function (seriesName, opts) {
        return `<div style="display: flex; align-items: center;">
                 
                  <span style="color: #7b91b0;">${seriesName}</span>
                </div>`;
      },
    },
  });

  useEffect(() => {
    if (brief && brief.location && brief.time) {
      const categories = Object.keys(brief.location); // X-axis categories (M1, M2, etc.)
      const locationNames = Object.keys(brief.time); // Location names from brief.time (e.g., "Location 1", "Location 2")

      // Initialize an object to accumulate total values for each location
      const locationTotals = locationNames.map(() =>
        Array(categories.length).fill(0)
      );

      // Define the selected categories you want to choose from
      const selectedCategories =
        title === "Total Water Consumption"
          ? ["Total Groundwater consumption* ( in KL)", "Total Tanker Water Consumption* (in KL)"]
          : title === "Total Water Treated"
            ? ["Total treated water reused(Flushing/CT etc.)* (in KL) "]
            : title === "Total Waste Generated"
              ? [
                "Total non-hazardous solid waste generation (black category general waste)* (kg)",
                "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
                "Total packaging waste (Plastic) generated* (Kg)",
                "Total plastic packaging waste generated ",
                "Total food waste generated/Kitchen Waste* (Kgs)",
                "Total e-waste generated",
                "Total hazardous waste (spent oil/lubricants etc)",
              ]
              : title === "Total Waste Disposed"
                ? [
                  "Total e-waste disposed",
                  "Total metal scraps disposed",
                ]
                : []; // Default to an empty array or set a different default

      // Loop through each location (M1, M2, etc.) in brief.location
      Object.entries(brief.location).forEach(
        ([locationKey, productValues], categoryIndex) => {
          // Check if the current location's categories are in the selected list
          const filteredProductValues = Object.entries(productValues).filter(
            ([productKey]) => selectedCategories.includes(productKey)
          );

          // Loop through each product in the filtered list
          filteredProductValues.forEach(([productKey, valueArray]) => {
            valueArray.forEach((value, locationIndex) => {
              const originalValue = Number(value) || 0;
              // Step 1: Accumulate original values instead of log-transformed values
              locationTotals[locationIndex][categoryIndex] += originalValue;
            });
          });
        }
      );

      // Step 2: After accumulating all original values, apply logarithmic transformation if necessary
      locationTotals.forEach((totals, locationIndex) => {
        totals.forEach((total, categoryIndex) => {
          // Apply log10 only after summing original values
          // Add 1 only if total is 0
          locationTotals[locationIndex][categoryIndex] = Math.log10(
            total === 0 ? total + 1 : total
          );
        });
      });

      // Prepare the series data for the chart
      const series = locationNames.map((locationName, index) => ({
        name: locationName,
        data: locationTotals[index],
      }));

      // Update the chart series and options
      setChartSeries(series);
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories, // X-axis categories (M1, M2, etc.)
        },
      }));
    }
  }, [brief]);

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <div
        style={{
          height: "9%",
          fontSize: "20px",
          fontWeight: 600,
          fontColor: "#011627",
        }}
      >
        {title}
      </div>
      <div style={{ height: "90%" }}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default TotalComponent;
