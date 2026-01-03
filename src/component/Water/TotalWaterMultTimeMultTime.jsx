import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import img from "../../img/no.png";

const TotalWaterMultTimeMultTime = ({
  compareLastTimePeriods,
  locationOption,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
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
      show: true,
      width: 2,
      colors: ["#791E80"],
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
        text: "Water (KL)",
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
          return `${formatValue(val)} KL`;
        },
      },
    },
    colors: ["#791E80"],
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

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const categories = [
        `${
          financialYear[financialYear.length - 2].financial_year_value
        } (${Object.keys(compareLastTimePeriods).join(", ")})`,
        `${
          financialYear[financialYear.length - 1].financial_year_value
        } (${Object.keys(compareTCurrentimePeriods).join(", ")})`,
      ];

      const getTotalEnergyForPeriod = (fromDate) => {
        console.log(fromDate);
        return graphData
          .filter((data) => data.formDate === fromDate)
          .map((data) => {
            return data.answer.reduce((innerSum, energyPair) => {
              const value = Number(energyPair[0]);
              const unit = energyPair[1];
      
              // Check if the unit is 'liter' or 'liters' and adjust the value
              const adjustedValue = (unit === "liter" || unit === "liters") 
                                    ? value / 1000 
                                    : value;
      
              // Only add if the value is a valid number
              return innerSum + (isNaN(adjustedValue) || adjustedValue === "" ? 0 : adjustedValue);
            }, 0);
          })
          .reduce((accum, curr) => accum + curr, 0);
      };
      

      const getTotalTargetEnergyForPeriod = (fromDate) => {
        return graphData
          .filter((data) => data.formDate === fromDate)
          .map((data) => {
            return (data.targetData || [])
              .flat()
              .reduce((innerSum, value) => {
                const numValue = Number(value);
                return innerSum + (isNaN(numValue) || value === "" ? 0 : numValue);
              }, 0);
          })
          .reduce((accum, curr) => accum + curr, 0);
      };

      const series = [];
      const targetSeries = [];

      let aggregatedLastTimeEnergy = 0;
      let aggregatedTargetLastTimeEnergy = 0;

      Object.keys(compareLastTimePeriods).forEach((period) => {
        const fromDate = compareLastTimePeriods[period];
        aggregatedLastTimeEnergy += getTotalEnergyForPeriod(fromDate);
        // aggregatedTargetLastTimeEnergy += getTotalTargetEnergyForPeriod(fromDate);
      });

      series.push(aggregatedLastTimeEnergy);
      targetSeries.push(aggregatedTargetLastTimeEnergy/2);

      let aggregatedCurrentTimeEnergy = 0;
      let aggregatedTargetCurrentTimeEnergy = 0;

      Object.keys(compareTCurrentimePeriods).forEach((period) => {
        const fromDate = compareTCurrentimePeriods[period];
        aggregatedCurrentTimeEnergy += getTotalEnergyForPeriod(fromDate);
        // aggregatedTargetCurrentTimeEnergy += getTotalTargetEnergyForPeriod(fromDate);
      });

      series.push(aggregatedCurrentTimeEnergy);
      targetSeries.push(aggregatedTargetCurrentTimeEnergy/2);

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
            },
            {
              x: categories[1],
              y: series[1],
              goals: [
                {
                    name: "Trigger",
                    value: targetSeries[1],
                    strokeWidth: 32, // Wider stroke for target bars
                    strokeDashArray: 0,
                    strokeHeight: 5,
                    strokeColor: "red", // Custom color for the target value (e.g., orange)
                    fillColor: "red", // Background color of the target bars
                  },
              ],
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
      }));
    }
  }, [compareLastTimePeriods, compareTCurrentimePeriods, graphData]);

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
        Total Water Withdrawal
      </div>
      <div style={{ height: "90%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 && <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />}
      </div>
    </div>
  );
};

export default TotalWaterMultTimeMultTime;
