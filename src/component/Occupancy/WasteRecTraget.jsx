import React from 'react';
import ReactApexChart from 'react-apexcharts';

const WasteRecTarget = () => {
  const series = [
    {
      name: 'Water Inflow',
      type: 'column',
      data: [600, 400, 300, 250, 200, 150, 100],
    },
    {
      name: 'Negative Consumption',
      type: 'line',
      data: [200, 400, 300, 200, 150, 100, 50],
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: 'Negative Water Consumption',
      align: 'left',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: ['2023', '2024', '2025', '2026', '2027', '2028', '2029'],
    xaxis: {
      type: 'category',
    },
    yaxis: [
      {
        title: {
          text: 'Water Inflow',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Negative Consumption',
        },
      },
    ],
    colors: ['#5EA4F3', '#F9C9C9'],
    markers: {
      size: 5,
      colors: ['#F9C9C9'],
      strokeColors: '#F9C9C9',
      strokeWidth: 2,
    },
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div className="container">
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default WasteRecTarget;