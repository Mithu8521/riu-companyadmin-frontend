import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Speedometer = () => {
  const options = {
    chart: {
      type: 'radialBar',
      height: 350,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 15,
          size: '70%',
        },
        dataLabels: {
          showOn: 'always',
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            formatter: function (val) {
              return `${val}%`;
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          },
        },
        track: {
          background: '#e7e7e7',
          strokeWidth: '100%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    labels: ['Speed'],
  };

  const series = [67]; // Value representing the speed (out of 100)

  return (
    <div className="container">
      <ReactApexChart options={options} series={series} type="radialBar" height={350} />
    </div>
  );
};

export default Speedometer;
