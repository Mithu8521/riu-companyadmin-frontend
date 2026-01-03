import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const PercentageOfPeopleReceivingMoreThanMinWages = () => {
  // State to manage selected employee type
  const [selectedType, setSelectedType] = useState('permanent');

  // Data for different employee types
  const data = {
    permanent: {
      series: [60, 30, 10], // Example data for Permanent Employees
      labels: ['Male', 'Female', 'Others']
    },
    nonPermanent: {
      series: [50, 40, 10], // Example data for Non-Permanent Employees
      labels: ['Male', 'Female', 'Others']
    }
  };

  const options = {
    chart: {
      type: 'radialBar',
      height: 350
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
            color: undefined,
            offsetY: -10
          },
          value: {
            fontSize: '16px',
            color: 'black',
            offsetY: 10,
            formatter: (val) => `${val}%`
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              // This function can be customized to show the total percentage
              return '100%';
            }
          }
        }
      }
    },
    colors: ['#3F88A5', '#B0C4DE', '#7F8C8D'], // Colors for Male, Female, Others
    legend: {
      show: false // Hides the legend
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Percentage of People Receiving More Than Minimum Wages</div>
      </div>
      <div className="checkboxwaste" style={{ marginTop: "8%" }}>
        <label>
          <input
            type="radio"
            checked={selectedType === 'permanent'}
            onChange={() => setSelectedType('permanent')}
          />
          Permanent Employee
        </label>
        <label>
          <input
            type="radio"
            checked={selectedType === 'nonPermanent'}
            onChange={() => setSelectedType('nonPermanent')}
          />
          Non-Permanent Employee
        </label>
      </div>
      <div className="chart-container">
        <Chart
          options={options}
          series={data[selectedType].series}
          type="radialBar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default PercentageOfPeopleReceivingMoreThanMinWages;