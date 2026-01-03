import React from 'react';
import Chart from 'react-apexcharts';

const EnergyEfficiencyImprovement = () => {
  const series = [65]; // The percentage of efficiency improvement

  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            fontWeight: 600,
            offsetY: 10,
          },
          value: {
            offsetY: 5,
            fontSize: '22px',
            fontWeight: 600,
            formatter: function (val) {
              return `${val}%`;
            },
          }
        },
        track: {
          background: '#f0f0f0',
          strokeWidth: '100%',
          margin: 5, // margin is in pixels
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#2a8eca'], // Fill color for the arc
    },
    labels: ['Efficiency Improvement'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          offsetY: 0
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                offsetY: 0,
              },
              value: {
                offsetY: 0,
              }
            }
          }
        },
      },
    }]
  };

  return (
    <div className="energy-bar-container">
      <div className="energy-bar-header">
        Energy Efficiency Improvement
      </div>
      <div className="chart-container">
        <Chart options={options} series={series} type="radialBar" height={250} />
      </div>
    </div>
  );
};

export default EnergyEfficiencyImprovement;
