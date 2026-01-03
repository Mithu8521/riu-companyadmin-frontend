import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const DetailsOfMinimumWagesPaid = () => {
  // State to manage selected employee type
  const [selectedType, setSelectedType] = useState('permanent');

  // Data for different employee types
  const data = {
    permanent: {
      series: [
        { name: 'Male', data: [100, 120, 90, 110] }, // Example data for Permanent Employees
        { name: 'Female', data: [80, 70, 60, 90] }
      ],
      categories: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    nonPermanent: {
      series: [
        { name: 'Male', data: [90, 110, 100, 130] }, // Example data for Non-Permanent Employees
        { name: 'Female', data: [70, 90, 80, 100] }
      ],
      categories: ['Q1', 'Q2', 'Q3', 'Q4']
    }
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false, // Not stacked
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: data[selectedType].categories, // X-axis categories
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: 'grey',
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Positions' // Title for the y-axis
      }
    },
    colors: ['#3F88A5', '#B0C4DE'], // Colors for Male and Female bars
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    fill: {
      colors: ['#3F88A5', '#B0C4DE'], // Ensures the same color scheme for the bars
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Details of Minimum Wages Paid</div>
      </div>
      <div className="checkbox-container" style={{ marginBottom: "5%" }}>
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
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default DetailsOfMinimumWagesPaid;
