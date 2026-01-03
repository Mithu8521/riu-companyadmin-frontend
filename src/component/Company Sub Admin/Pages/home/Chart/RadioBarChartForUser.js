import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const RadioBarChartForUser = () => {
  const [chartData] = useState({
    series: [
      [10, 20, 30, 40], // Part 1
      [15, 25, 35, 45], // Part 2
      [20, 30, 40, 50], // Part 3
      [25, 35, 45, 55], // Part 4
    ],
    options: {
      chart: {
        height: 800,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return 100;
              },
            },
          },
        },
      },
      labels: ["Subpart 1", "Subpart 2", "Subpart 3", "Subpart 4"],
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series.flat()}
        type="radialBar"
        height={345}
      />
    </div>
  );
};

export default RadioBarChartForUser;
