import React from 'react';
import Chart from 'react-apexcharts';

const TotalGHGEmissionPercentage = () => {
  const series = [
    {
      name: 'Q1',
      data: [400, 300, 500, 200],
    },
    {
      name: 'Q2',
      data: [300, 200, 400, 150],
    },
    {
      name: 'Q3',
      data: [200, 150, 300, 100],
    },
    {
      name: 'Q4',
      data: [100, 100, 200, 50],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: ['Location 1', 'Location 2', 'Location 3', 'Location 4'],
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'bottom',
    },
    colors: ['#3F88A5', '#9FE2BF', '#87CEEB', '#B0C4DE'], // Custom colors to match the image
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} units`,
      },
    },
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Total GHG Emission Granted</div>
      </div>
      <div className='chart-container'>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={"100%"}
        />

      </div>

    </div>
  );
};

export default TotalGHGEmissionPercentage;
