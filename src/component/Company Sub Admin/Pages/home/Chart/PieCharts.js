import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieCharts = (props) => {
  const [chartData, setChartData] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });

  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
    }
  }, [props]);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type={props.type}
        height={340}
      />
    </div>
  );
};

export default PieCharts;
