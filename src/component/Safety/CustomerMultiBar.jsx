import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import img from "../../img/no.png";

const CustomerMultiBar = ({
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
}) => {

    console.log(graphData,"graphDatagraphData")
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
      colors: ["#83bbd5"],
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
        text: "Complaints",
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
          return `${formatValue(val)} GJ`;
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

      const getTotalEnergyForPeriod = (financialYearId) => {       
        return graphData
        .filter((data) => data.financialYearId === financialYearId)
          .map((data) => {
            return data.answer[2];
          })
          .reduce((accum, curr) => accum + curr, 0);
      };

      const getTotalTargetEnergyForPeriod = (financialYearId) => {
        return graphData
            .filter((data) => data.financialYearId === financialYearId)
            .map((data) => {
                // Check if targetData is null or undefined, return an empty array if it is
                return data?.targetData?.[0] || 0;  // Use 0 if targetData is null or empty
            })
            .reduce((accum, curr) => accum + curr, 0);
    };
    

      const series = [];
      const targetSeries = [];

      let aggregatedLastTimeEnergy = 0;
      let aggregatedTargetLastTimeEnergy = 0;

      financialYear.slice(-2).forEach((period) => {
        aggregatedLastTimeEnergy = getTotalEnergyForPeriod(period.id);
        aggregatedTargetLastTimeEnergy = getTotalTargetEnergyForPeriod(period.id);
        series.push(aggregatedLastTimeEnergy);
        targetSeries.push(aggregatedTargetLastTimeEnergy*4);
      });

  

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
        Total Customer complaint
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

export default CustomerMultiBar;
