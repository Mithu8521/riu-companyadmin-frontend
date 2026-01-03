import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'react-apexcharts';

const BarChart = (props) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Waste Incinerated',
        data: [44, 55, 41, 64, 22, 43, 21],
      },
      {
        name: 'Waste Recycled',
        data: [53, 32, 33, 52, 13, 44, 32],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      // title: {
      //   text: 'Bar View',
      // },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
      },
    },
  });

  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
    }
  }, [props]);

  return (
    <div id="chart" style={{ height: "100%" }}>
      {/* The chart will be rendered here */}
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={"100%"}
      />
    </div>
  );
};

export default BarChart;