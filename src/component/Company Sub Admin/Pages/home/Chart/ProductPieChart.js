import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ProductPieCharts = (props) => {
  const [chartData, setChartData] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30px',
          endingShape: 'rounded'
        },
      },
      stroke: {
        curve: 'smooth'
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
        height={props?.size || 490}
      />
    </div>
  );
};

export default ProductPieCharts;
