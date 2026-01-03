import React, { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import noDataImage from "../../../img/no.png";

const RenewableAndNonRenewable = ({
  timePeriods,
  locationOption,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriodValues,
}) => {
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions, e.g., 1.2M
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands, e.g., 1.2K
    } else {
      return Math.round(value); // Format normal numbers
    }
  };

  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true, // Enable stacking
      toolbar: {
        show: false, // Disable the three-line menu (toolbar)
      },
    },
    tooltip: {
      enabled: false, // Disable tooltip
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const totalValue =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
        return formatValue(totalValue); // Display formatted value inside bars
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
      colors: ["#fff"],
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
      y: {
        formatter: function (val) {
          return `${val} GJ`;
        },
      },
    },
    colors: ["#3F822B", "#808080"], // Different colors for renewable and non-renewable
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    legend: {
      show: true,
      position: "bottom", // Keep the legend at the bottom
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

  useEffect(() => {
    if (locationOption.length > 1 && timePeriodValues.length === 1) {
      const categories = locationOption.map((loc) => loc.label);
      const series = [
        {
          name: "Renewable Energy",
          data: categories.map((category) => {
            const locationId = locationOption.find(
              (loc) => loc.label === category
            ).id;

            // Calculate total renewable energy for the location
            return renewableEnergy
              .filter((item) => item.SourceId === locationId)
              .reduce((sum, item) => {
                const value = item.energyAndEmission[0];
                const numValue = Number(value); // Convert to number
                return sum + (isNaN(numValue) || value === "" ? 0 : numValue); // Treat non-numeric and empty strings as 0
              }, 0);
          }),
        },
        {
          name: "Non-Renewable Energy",
          data: categories.map((category) => {
            const locationId = locationOption.find(
              (loc) => loc.label === category
            ).id;

            // Calculate total non-renewable energy for the location
            return nonRenewableEnergy
              .filter((item) => item.SourceId === locationId)
              .reduce((sum, item) => {
                const value = item.energyAndEmission[0];
                const numValue = Number(value); // Convert to number
                return sum + (isNaN(numValue) || value === "" ? 0 : numValue); // Treat non-numeric and empty strings as 0
              }, 0);
          }),
        },
      ];

      // Update the chart series and options
      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    } else if (locationOption.length === 1 && timePeriodValues.length > 1) {
      const categories = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      const categoriesTwo = Object.keys(timePeriods);
      const series = [
        {
          name: "Renewable Energy",
          data: categoriesTwo.map((key) => {
            // Calculate total renewable energy for the specified time period
            return renewableEnergy
              .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key]
              .reduce((sum, item) => {
                const total = item.energyAndEmission.reduce((innerSum, arr) => {
                  const numValue = Number(arr[0]); // Convert to number
                  return (
                    innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
                  );
                }, 0);
                return sum + total; // Accumulate total renewable energy
              }, 0);
          }),
        },
        {
          name: "Non-Renewable Energy",
          data: categoriesTwo.map((key) => {
            // Calculate total non-renewable energy for the specified time period
            return nonRenewableEnergy
              .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key]
              .reduce((sum, item) => {
                const total = item.energyAndEmission.reduce((innerSum, arr) => {
                  const numValue = Number(arr[0]); // Convert to number
                  return (
                    innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
                  );
                }, 0);
                return sum + total; // Accumulate total non-renewable energy
              }, 0);
          }),
        },
      ];

      // Update the chart series and options
      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    } else {
      const categories = Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      );

      const series = [
        {
          name: "Renewable Energy",
          data: categories.map((key) => {
            return renewableEnergy
              .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key]
              .reduce((sum, item) => {
                const total = item.energyAndEmission.reduce((innerSum, arr) => {
                  const numValue = Number(arr[0]); // Convert to number
                  return (
                    innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
                  );
                }, 0);
                return sum + total; // Accumulate total renewable energy
              }, 0);
          }),
        },
        {
          name: "Non-Renewable Energy",
          data: categories.map((key) => {
            return nonRenewableEnergy
              .filter((item) => item.formDate === timePeriods[key]) // Match formDate with timePeriods[key]
              .reduce((sum, item) => {
                const total = item.energyAndEmission.reduce((innerSum, arr) => {
                  const numValue = Number(arr[0]); // Convert to number
                  return (
                    innerSum + (isNaN(numValue) || arr[0] === "" ? 0 : numValue)
                  );
                }, 0);
                return sum + total; // Accumulate total non-renewable energy
              }, 0);
          }),
        },
      ];

      // Update the chart series and options
      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    }
  }, [locationOption, timePeriodValues, renewableEnergy, nonRenewableEnergy]);

  if (!renewableEnergy && !nonRenewableEnergy) {
    return (
      <div className="container">
        <img
          src={noDataImage} // Replace with the actual image path or URL
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
        Renewable & Non-Renewable Energy Consumption
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

export default RenewableAndNonRenewable;
