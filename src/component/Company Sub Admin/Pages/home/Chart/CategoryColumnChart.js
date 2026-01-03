import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ProductColumnCharts = (props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 100,
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
            width: 100
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
      if (props?.chartData?.series) {
        const newChartData = { ...props.chartData };
        const numColumns = props?.chartData.series.length;
        const columnWidth = parseInt(
          props?.chartData.options.plotOptions.bar.columnWidth
        );
        const categories = props?.chartData.options.xaxis.categories.length;


        newChartData.options.plotOptions.bar.columnWidth = "30px";

        setChartData(newChartData);


        if (chartRef.current) {
          chartRef.current.style.width =
            numColumns * columnWidth * categories > 200
              ? `${numColumns * columnWidth * categories}px`
              : "200px";
        }
      }
    }
  }, [props]);

  return (

    <div ref={chartRef}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type={props.type}
        height={200}
        width={200}
      />
    </div>
  );
};

export default ProductColumnCharts;
