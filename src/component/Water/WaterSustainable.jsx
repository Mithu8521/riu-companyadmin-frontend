import React from 'react';
import Chart from 'react-apexcharts';

const WaterSustainable = () => {
  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Composting', 'Recycling', 'Incinerations', 'Landfill'],
    colors: ['#8EC6C5', '#30B0B7', '#576D7A', '#C1E0E9'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  const series = [44, 55, 41, 17]; // Example data for the chart

  return (
    <div className="container">
      <div className="header">
        <div className="title">Water Sustainable Goal Tracking</div>
      </div>
      <Chart options={options} series={series} type="donut" height="300" />
    </div>
  );
};

export default WaterSustainable;
