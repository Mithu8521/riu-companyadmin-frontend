import React from 'react';
import ReactApexChart from 'react-apexcharts';

const EnergySavingOverview = () => {
  const options = {
    chart: {
      type: 'line',
      height: 350,
    },
    title: {
      text: 'Energy Saving Overview',
      align: 'center',
    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      title: {
        text: 'Quarters',
      },
    },
    yaxis: {
      title: {
        text: 'Energy Saved',
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 4,
    },
  };

  const series = [
    {
      name: 'Line 1',
      data: [0, 20, 40, 60],
    },
    {
      name: 'Line 2',
      data: [0, 30, 50, 80],
    },
    {
      name: 'Line 3',
      data: [0, 10, 35, 70],
    },
  ];

  return (
    <div className="container">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default EnergySavingOverview;
