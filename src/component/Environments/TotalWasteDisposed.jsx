import React from 'react';
import Chart from 'react-apexcharts';

const TotalWasteGenerated = () => {
  const series = [
    {
      name: 'Location 1',
      data: [30000, 40000, 35000, 25000],
    },
    {
      name: 'Location 2',
      data: [20000, 30000, 20000, 15000],
    },
    {
      name: 'Location 3',
      data: [10000, 20000, 40000, 50000],
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
        horizontal: true,
      },
    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
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
    colors: ['#3F88A5', '#9FE2BF', '#87CEEB'], // Customize colors to match the example
    dataLabels: {
      enabled: true,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      show: false,
      enabled: false,
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Total Waste Generated</div>
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

export default TotalWasteGenerated;
