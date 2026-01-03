import React, { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import img from "../../../img/no.png";

const TotalEnergySingLocMultTime = ({
  timePeriods,
  locationOption,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriodValues,
}) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels on bars
      formatter: function (val) {
        return formatValue(val); // Format values using the format function
      },
      style: {
        fontSize: "10px",
        fontWeight: "bold",
        colors: ["#011627"], // Adjust text color for visibility
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#791e80"],
    },
    xaxis: {
      categories: [],
      title: {
        text: "Time Periods",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: "#7b91b0",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    yaxis: {
      title: {
        text: "Energy (GJ)",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        formatter: (value) => formatValue(value),
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
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
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        horizontal: 10,
        vertical: 10,
        radius: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
    },
  });

  // Function to format numbers with K and M suffixes
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
    } else {
      return Math.round(value); // Format normal numbers
    }
  };

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split(".");
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    if (rest !== "") {
      lastThree = "," + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + "." + x[1] : num; // Just format the number without manipulating the input string
  };

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map(
        (loc) =>
          loc.label.charAt(0).toUpperCase() + loc.label.slice(1).toLowerCase()
      );
      const series = categories.map((category) => {
        // Calculate total energy for the current location
        const locationId = locationOption.find(
          (loc) => loc.label === category
        ).id;

        // Sum the total energy from renewable and non-renewable sources
        const renewableTotal = renewableEnergy
          .filter((item) => item.SourceId === locationId)
          .reduce((sum, item) => {
            const value = item.energyAndEmission[0];
            const numValue = Number(value); // Convert to number
            return sum + (isNaN(numValue) || value === "" ? 0 : numValue); // Treat non-numeric and empty strings as 0
          }, 0);

        const nonRenewableTotal = nonRenewableEnergy
          .filter((item) => item.SourceId === locationId)
          .reduce((sum, item) => {
            const value = item.energyAndEmission[0];
            const numValue = Number(value); // Convert to number
            return sum + (isNaN(numValue) || value === "" ? 0 : numValue); // Treat non-numeric and empty strings as 0
          }, 0);

        return renewableTotal + nonRenewableTotal; // Total energy for the location
      });

      const maxSeriesValue = Math.max(...series);
      const yAxisMax = maxSeriesValue + 10000;

      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        yaxis: {
          ...prev.yaxis,
          max: yAxisMax, // Set y-axis max
        },
      }));
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      // Extract keys from timePeriods object for x-axis categories
      const categories = Object.keys(timePeriods);
      const categoriesTwo = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      const series = categories.map((key) => {
        // Filter renewable and non-renewable energy based on formDate matching the current timePeriod key
        const renewableTotal = renewableEnergy
          .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key].h1
          .reduce((sum, item) => {
            // Add values of the first element of each inner array in item.answer
            const total = item.energyAndEmission.reduce((innerSum, arr) => {
              const numValue = Number(arr[0]); // Convert to number
              return (
                innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
              );
            }, 0);
            return sum + total; // Accumulate total energy for the renewable energy
          }, 0);

        const nonRenewableTotal = nonRenewableEnergy
          .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key].h1
          .reduce((sum, item) => {
            // Add values of the first element of each inner array in item.answer
            const total = item.energyAndEmission.reduce((innerSum, arr) => {
              const numValue = Number(arr[0]); // Convert to number
              return (
                innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
              );
            }, 0);
            return sum + total; // Accumulate total energy for the renewable energy
          }, 0);

        return renewableTotal + nonRenewableTotal; // Total energy for the current time period key
      });

      // Update the chart series and options
      const maxSeriesValue = Math.max(...series);
      // const yAxisMax = maxSeriesValue + 10000;

      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categoriesTwo,
        },
        yaxis: {
          ...prev.yaxis,
          // max: yAxisMax, // Set y-axis max
        },
      }));
    } else {
      // Extract keys from timePeriods object for x-axis categories
      const categories = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      const series = categories.map((key) => {
        // Filter renewable and non-renewable energy based on formDate matching the current timePeriod key
        const renewableTotal = renewableEnergy
          .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key].h1
          .reduce((sum, item) => {
            // Add values of the first element of each inner array in item.answer
            const total = item.energyAndEmission.reduce((innerSum, arr) => {
              const numValue = Number(arr[0]); // Convert to number
              return (
                innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
              );
            }, 0);
            return sum + total; // Accumulate total energy for the renewable energy
          }, 0);

        const nonRenewableTotal = nonRenewableEnergy
          .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key].h1
          .reduce((sum, item) => {
            // Add values of the first element of each inner array in item.answer
            const total = item.energyAndEmission.reduce((innerSum, arr) => {
              const numValue = Number(arr[0]); // Convert to number
              return (
                innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
              );
            }, 0);
            return sum + total; // Accumulate total energy for the renewable energy
          }, 0);

        return renewableTotal + nonRenewableTotal; // Total energy for the current time period key
      });

      // Update the chart series and options
      const maxSeriesValue = Math.max(...series);
      // const yAxisMax = maxSeriesValue + 10000;

      setChartSeries([{ name: "Total Energy", data: series }]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        yaxis: {
          ...prev.yaxis,
          // max: yAxisMax, // Set y-axis max
        },
      }));
    }
  }, [locationOption, timePeriodValues, renewableEnergy, nonRenewableEnergy]);

  if (!renewableEnergy && !nonRenewableEnergy) {
    return (
      <div className="container">
        <img
          src={img} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          fontColor: "#011627",
        }}
      >
        Total Energy Consumption
      </div>
      <div style={{ height: "90%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default TotalEnergySingLocMultTime;
