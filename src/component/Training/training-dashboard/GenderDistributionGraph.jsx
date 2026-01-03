import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const GenderChart = ({ sourceData }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (!Array.isArray(sourceData)) return;

    const genderStats = {
      Employee: { Male: new Set(), Female: new Set() },
      Worker: { Male: new Set(), Female: new Set() },
    };

    sourceData.forEach(training => {
      (training.attendantUsers || []).forEach(user => {
        const group = user.categoryId === 'Worker' ? 'Worker' : 'Employee';
        const gender = user.gender === 'FEMALE' ? 'Female' : 'Male';
        const empId = user.employeeId?.toString().trim();

        if (empId) {
          genderStats[group][gender].add(empId);
        }
      });
    });

    const maleData = [
      genderStats.Employee.Male.size,
      genderStats.Worker.Male.size,
    ];
    const femaleData = [
      genderStats.Employee.Female.size,
      genderStats.Worker.Female.size,
    ];

    const categories = ['Employees', 'Workers'];

    setChartData({
      series: [
        { name: 'Male', data: maleData },
        { name: 'Female', data: femaleData },
      ],
      options: {
        chart: {
          type: 'bar',
          height: 430,
        },
        plotOptions: {
          bar: {
            // horizontal: true,ß
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
        title: {
          text: ' Gender Distribution',
          align: 'left',
        },
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
          categories,
          title: {
            text: 'Category',
          },
        },
        colors: ['#008FFB', '#FF4560'], // Blue for Male, Red for Female
      },
    });
  }, [sourceData]);

  return (
    <div id="chart">
      {chartData.series.length > 0 && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={430}
        />
      )}
    </div>
  );
};

export default GenderChart;
