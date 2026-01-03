import React from 'react';
import Chart from 'react-apexcharts';
import './CircularChartComponent.css';

const ChartComponent = () => {
  const chartOptions = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360, // To make it a full circle
        hollow: {
          margin: 0,
          size: '65%', // Wider inner circle
        },
        track: {
          background: '#B0CFB9', // Color for the rest area
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            show: false, // Hide labels inside the circle
          },
          value: {
            fontSize: '24px',
            show: true,
            offsetY: 5,
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    labels: ['Accepted', 'Rejected'],
    colors: ['#3F88A5', '#3F88A5'], // Use the specific color for covered area
    series: [60, 40], // Series data (Accepted, Rejected)
  };

  return (
    <div className=''>
      <div className="chart-container">
        <h3 className="chart-title text-start">Training Registration Status</h3>
        <div className="chart-content">
          <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="radialBar"
            height="300"
            width="300"
          />
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color accepted" style={{ backgroundColor: '#3F88A5' }}></span>
              Accepted <span className="legend-percentage">60%</span>
            </div>
            <div className="legend-item">
              <span className="legend-color rejected" style={{ backgroundColor: '#B0CFB9' }}></span>
              Rejected <span className="legend-percentage">40%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
