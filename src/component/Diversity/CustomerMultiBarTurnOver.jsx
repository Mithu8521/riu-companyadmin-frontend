import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import img from "../../img/no.png";

const CustomerMultiBarTurnOver = ({
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
  title,
  columnIndex,
  rowIndex
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
      enabled: true,
      formatter: function (val, opt) {
        const goals =
          opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;
        if (goals && goals.length) {
          return `${formatValue(val)} / ${formatValue(goals[0].value)}`;
        }
        return formatValue(val);
      },
      style: {
        fontSize: "10px",
        fontWeight: "bold",
      },
    },
    stroke: {
      show: false, // Changed from true to false to remove the border
      width: 0,    // Changed from 2 to 0 to remove the border width
      colors: ["transparent"], // Changed color to transparent
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
        text: "Number of individuals",
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
          return `${formatValue(val)} %`;
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
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      customLegendItems: ["Actual", "Trigger"],
      markers: {
        fillColors: ["#00E396", "#775DD0"],
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

  // Function to handle NaN values and replace with 0
  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const categories = [
        `${financialYear[financialYear.length - 2].financial_year_value} (${Object.keys(compareLastTimePeriods).join(", ")})`,
        `${financialYear[financialYear.length - 1].financial_year_value} (${Object.keys(compareTCurrentimePeriods).join(", ")})`,
      ];
  
      const getPercentageForPeriod = (period) => {
        const dataForPeriod = graphData.find((data) => data.formDate === period);
        return dataForPeriod?.percentage ? dataForPeriod.percentage[rowIndex][columnIndex] : 0; // Get the first percentage value
      };
  
      const series = [];
      const targetSeries = [];
  
      // Get data for the last and current comparison periods
      const lastPeriod = Object.keys(compareLastTimePeriods).sort((a, b) => {
        return new Date(compareLastTimePeriods[b]) - new Date(compareLastTimePeriods[a]);
      })[0];
  
      const currentPeriod = Object.keys(compareTCurrentimePeriods).sort((a, b) => {
        return new Date(compareTCurrentimePeriods[b]) - new Date(compareTCurrentimePeriods[a]);
      })[0];
  
      let lastPeriodPercentage = getPercentageForPeriod(compareLastTimePeriods[lastPeriod]);
      let currentPeriodPercentage = getPercentageForPeriod(compareTCurrentimePeriods[currentPeriod]);
  
      // Handle NaN by replacing with 0
      lastPeriodPercentage = handleNaN(lastPeriodPercentage);
      currentPeriodPercentage = handleNaN(currentPeriodPercentage);
  
      // Series to display the actual values
      series.push(lastPeriodPercentage);
      series.push(currentPeriodPercentage);
  
      // Series to display the target values (use the same percentages multiplied by 4)
      targetSeries.push(0); // Adjusting based on your previous code logic
      targetSeries.push(12);
  
      // Apply the conditional bar color based on rowIndex
      const barColors = [rowIndex === 1 ? "rgb(255, 169, 208)" : "#83bbd5", rowIndex === 1 ? "rgb(255, 169, 208)" : "#83bbd5"];
  
      setChartSeries([
        {
          name: "Actual",
          data: [
            {
              x: categories[0],
              y: series[0],
              goals: [
                {
                  name: "Trigger",
                  value: targetSeries[0],
                  strokeWidth: 10,
                  strokeDashArray: 2,
                  strokeColor: "#775DD0",
                },
              ],
              fillColor: barColors[0], // Apply the color for the first bar
            },
            {
              x: categories[1],
              y: series[1],
              goals: [
                {
                  name: "Trigger",
                  value: targetSeries[1],
                  strokeWidth: 32,
                  strokeDashArray: 0,
                  strokeHeight: 5,
                  strokeColor: "red",
                  fillColor: barColors[1], // Apply the color for the second bar
                },
              ],
              fillColor: barColors[1], // Apply the color for the second bar
            },
          ],
        },
      ]);
  
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
        // Also update the stroke property here to ensure it's applied
        stroke: {
          show: false,
          width: 0,
          colors: ["transparent"],
        },
        // Update plotOptions to ensure no border is shown
        plotOptions: {
          ...prev.plotOptions,
          bar: {
            ...prev.plotOptions.bar,
            borderRadius: 0,
            columnWidth: "60px",
            strokeWidth: 0, // Set stroke width to 0
          },
        },
      }));
    }
  }, [compareLastTimePeriods, compareTCurrentimePeriods, graphData, rowIndex]); // Added rowIndex to dependency array
  

  if (!graphData || graphData.length === 0) {
    return (
      <div className="container">
        <img
          src={img}
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
       {title}
      </div>
      <div style={{ height: "90%" }}>
         {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 ? (
                <Chart options={chartOptions} series={chartSeries} type="bar" height={"100%"} />
              ) : (
                <p>No data available</p>
              )}
        
      </div>
    </div>
  );
};

export default CustomerMultiBarTurnOver;