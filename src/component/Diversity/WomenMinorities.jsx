import React from 'react';
import Chart from 'react-apexcharts';

const WomenMinoritiesChart = () => {
  const data = {
    series: [
      {
        name: 'Women',
        data: [40, 35, 50, 55, 45] // Example percentages for Women
      },
      {
        name: 'Minorities',
        data: [25, 30, 20, 40, 35] // Example percentages for Minorities
      }
    ]
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: ['Department A', 'Department B', 'Department C', 'Department D', 'Department E'] // Example departments
    },
    yaxis: {
      title: {
        text: 'Percentage (%)'
      },
      max: 100
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    colors: ['#1E90FF', '#FF6347'] // Example colors for Women and Minorities
  };

  return (
    <div>
      <Chart options={chartOptions} series={data.series} type="bar" height={350} />
    </div>
  );
};

export default WomenMinoritiesChart;
