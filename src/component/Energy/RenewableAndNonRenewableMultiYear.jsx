import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import noDataImage from "../../img/no.png";

const RenewableAndNonRenewableMultiYear = ({
    compareLastTimePeriods,
    locationOption,
    compareTCurrentimePeriods,
    graphData,
    financialYear
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
        const totalValue = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
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
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'Arial',
          color: '#011627',
        },
      },
      labels: {
        style: {
          colors: '#7b91b0',
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
      },
    },
    yaxis: {
      title: {
        text: "Energy (GJ)",
        style: {
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'Arial',
          color: '#011627',
        },
      },
      labels: {
        style: {
          colors: ['#7b91b0'],
          fontSize: '12px',
          fontFamily: 'Poppins',
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
    if (!graphData || graphData.length === 0) {
      return; // No data, return early
    }

    // Function to get total renewable or non-renewable energy for a given time period
    const getEnergyForPeriod = (period, energyType) => {
        return graphData
          .filter((item) => item.formDate === period &&  item?.questionId === (energyType === 'renewable' ? 451 :452)) // Filter by the selected time period
          .reduce((sum, item) => {
            // Sum all the first elements in each energyAndEmission array for the selected period
            const totalEnergyForItem = item.energyAndEmission.reduce((innerSum, energyArray) => {
              const value = Number(energyArray[0]); // Get the first element in the inner array (first column)
              return innerSum + (isNaN(value) || value === "" ? 0 : value); // Only add valid numbers
            }, 0);
      
            return sum + totalEnergyForItem; // Accumulate the sum for the given period
          }, 0); // Initialize the sum as 0
      };
      
      

    // Prepare categories for the x-axis, combining both time periods from compareLastTimePeriods and compareTCurrentimePeriods
    const categories = [
      `${financialYear[financialYear.length - 2].financial_year_value} (${Object.keys(compareLastTimePeriods).join(", ")})`, // Label for aggregated periods of compareLastTimePeriods
      `${financialYear[financialYear.length - 1].financial_year_value} (${Object.keys(compareTCurrentimePeriods).join(", ")})`, // Label for aggregated periods of compareTCurrentimePeriods
    ];

    // Create the series for renewable and non-renewable energy
    const series = [
      {
        name: "Renewable Energy",
        data: [
          Object.keys(compareLastTimePeriods).reduce((sum, period) => sum + getEnergyForPeriod(compareLastTimePeriods[period], "renewable"), 0),
          Object.keys(compareTCurrentimePeriods).reduce((sum, period) => sum + getEnergyForPeriod(compareTCurrentimePeriods[period], "renewable"), 0),
        ],
      },
      {
        name: "Non-Renewable Energy",
        data: [
          Object.keys(compareLastTimePeriods).reduce((sum, period) => sum + getEnergyForPeriod(compareLastTimePeriods[period], "non-renewable"), 0),
          Object.keys(compareTCurrentimePeriods).reduce((sum, period) => sum + getEnergyForPeriod(compareTCurrentimePeriods[period], "non-renewable"), 0),
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
  }, [compareLastTimePeriods, compareTCurrentimePeriods, graphData, financialYear]);

  if (!graphData || graphData.length === 0) {
    return (
      <div className="container">
        <img
          src={noDataImage}
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ height: "10%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
        Renewable & Non-Renewable Energy Consumption
      </div>
      <div style={{ height: "90%" }}>
     {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={"100%"}
              />
            )}
      </div>
    </div>
  );
};

export default RenewableAndNonRenewableMultiYear;
