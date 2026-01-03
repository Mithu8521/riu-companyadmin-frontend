import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const SkillUpgradationTraining = ({ trainingEmployee, trainingWorker }) => {
  const [selectedGroup, setSelectedGroup] = useState('employees'); // Default group selection
  const [chartData, setChartData] = useState([0, 0]); // Initialize with zeros for Male, Female

  useEffect(() => {
    const calculateData = () => {
      let totalMales = 0;
      let totalFemales = 0;

      const selectedData = selectedGroup === 'employees' ? trainingEmployee : trainingWorker;

      selectedData.forEach(item => {
        const answers = item.answer || [[], []];
        const maleData = parseInt(answers[1][0], 10) || 0;  // Second element for Male
        const femaleData = parseInt(answers[1][1], 10) || 0;  // Second element for Female

        totalMales += maleData;
        totalFemales += femaleData;
      });

      setChartData([totalMales, totalFemales]);
    };

    calculateData();
  }, [selectedGroup, trainingEmployee, trainingWorker]);

  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Male', 'Female'],
    colors: ['#11546f', '#6fa8dc'],
    plotOptions: {
      pie: {
        donut: {
          size: '55%', // Increase or decrease this value to change the thickness
          labels: {
            show: true,
            total: {
              show: false,
              label: 'Total',
              formatter: () => chartData.reduce((a, b) => a + b, 0), // Display total in the center
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,  // Enable data labels
      formatter: (val, opts) => opts.w.globals.series[opts.seriesIndex],  // Show actual values instead of percentages
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#fff'],  // White text for contrast
      },
    },
    legend: {
      show: false, // Hide the default legend
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
      },
    }],
  };

  // const options = {
  //   chart: {
  //     type: 'donut',
  //   },
  //   labels: ['Male', 'Female'],
  //   colors: ['#11546f', '#6fa8dc'],
  //   plotOptions: {
  //     pie: {
  //       donut: {
  //         size: '55%', // Increase or decrease this value to change the thickness
  //         labels: {
  //           show: true,
  //         },
  //       },
  //     },
  //   },
  //   legend: {
  //     show: false, // Hide the default legend
  //   },

  //   responsive: [{
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 200,
  //       },
  //       legend: {
  //         show: false,
  //       },
  //     },
  //   }],
  // };

  return (
    <div className="container" style={{ height: "100%" }}>
      <div className="header" style={{ height: "10%" }}>
        <div className="title">Skill Upgradation Training</div>
      </div>
      <div className="checkbox-container" style={{ height: "10%" }}>
        <label>
          <input
            type="radio"
            value="employees"
            checked={selectedGroup === 'employees'}
            onChange={() => setSelectedGroup('employees')}
          />
          Employees
        </label>
        <label>
          <input
            type="radio"
            value="workers"
            checked={selectedGroup === 'workers'}
            onChange={() => setSelectedGroup('workers')}
          />
          Workers
        </label>
      </div>
      <div className="chart-container" style={{ height: "70%" }}>
        <Chart
          options={options}
          series={chartData}
          type="donut"
          height="100%"
        />
      </div>
      <div className="legend-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', height: "10%" }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#11546f', marginRight: '5px', borderRadius: "50%" }}></div>
          <span>Male</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#6fa8dc', marginRight: '5px', borderRadius: "50%" }}></div>
          <span>Female</span>
        </div>
      </div>
    </div>
  );
};

export default SkillUpgradationTraining;
