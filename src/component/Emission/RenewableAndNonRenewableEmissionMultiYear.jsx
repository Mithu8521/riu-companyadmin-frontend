import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import noDataImage from "../../img/no.png";

const RenewableAndNonRenewableEmissionMultiYear = ({
  compareLastTimePeriods,
  locationOption,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
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
        text: "Emission (tCO2)",
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
          return `${val} tCO2`;
        },
      },
    },
    colors: ["#791e80", "#11546f"], // Different colors for renewable and non-renewable
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
    if (!graphData || graphData.length === 0) {
      return; // No data, return early
    }

    // Function to get total renewable or non-renewable energy for a given time period
    const getEnergyForPeriod = (period, energyType) => {
      return graphData
        .filter((item) => item.formDate === period && item?.questionId === 452) // Filter by the selected time period
        .reduce((sum, item) => {
          let totalEnergyForItem = 0;

          if (energyType === "scope2") {
            // Only consider the first row of item.energyAndEmission
            if (item.energyAndEmission.length > 0) {
              const value = Number(item.energyAndEmission[0][1]); // First row, second column
              totalEnergyForItem = isNaN(value) || value === "" ? 0 : value;
            }
          } else {
            // Sum all rows except the first row
            totalEnergyForItem = item.energyAndEmission
              .slice(1)
              .reduce((innerSum, energyArray) => {
                const value = Number(energyArray[1]); // Get the second column (index 1)
                return innerSum + (isNaN(value) || value === "" ? 0 : value);
              }, 0);
          }

          return sum + totalEnergyForItem; // Accumulate the sum for the given period
        }, 0); // Initialize the sum as 0
    };

    // Prepare categories for the x-axis, combining both time periods from compareLastTimePeriods and compareTCurrentimePeriods
    const categories = [
      `${
        financialYear[financialYear.length - 2].financial_year_value
      } (${Object.keys(compareLastTimePeriods).join(", ")})`, // Label for aggregated periods of compareLastTimePeriods
      `${
        financialYear[financialYear.length - 1].financial_year_value
      } (${Object.keys(compareTCurrentimePeriods).join(", ")})`, // Label for aggregated periods of compareTCurrentimePeriods
    ];

    // Create the series for renewable and non-renewable energy
    const series = [
      {
        name: "Scope 1",
        data: [
          Object.keys(compareLastTimePeriods).reduce(
            (sum, period) =>
              sum +
              getEnergyForPeriod(compareLastTimePeriods[period], "scope1"),
            0
          ),
          Object.keys(compareTCurrentimePeriods).reduce(
            (sum, period) =>
              sum +
              getEnergyForPeriod(compareTCurrentimePeriods[period], "scope1"),
            0
          ),
        ],
      },
      {
        name: "Scope 2",
        data: [
          Object.keys(compareLastTimePeriods).reduce(
            (sum, period) =>
              sum +
              getEnergyForPeriod(compareLastTimePeriods[period], "scope2"),
            0
          ),
          Object.keys(compareTCurrentimePeriods).reduce(
            (sum, period) =>
              sum +
              getEnergyForPeriod(compareTCurrentimePeriods[period], "scope2"),
            0
          ),
        ],
      },
    ];

    // Update chart series and options
    setChartSeries(series);
    setChartOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        categories: categories,
      },
    }));
  }, [
    compareLastTimePeriods,
    compareTCurrentimePeriods,
    graphData,
    financialYear,
  ]);

  if (!graphData || graphData.length === 0) {
    return (
      <div className="container">
        <img
          src={noDataImage}
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
          color: "#011627",
        }}
      >
        Scope Emission Consumption
      </div>
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

export default RenewableAndNonRenewableEmissionMultiYear;
