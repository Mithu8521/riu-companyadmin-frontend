import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const data = {
  wasteGenerated: [
    { name: 'Non Hazardous Waste', data: [30, 40, 35, 50] },
    { name: 'E-Waste', data: [20, 25, 30, 35] },
    { name: 'Waste 3', data: [15, 20, 25, 30] },
    { name: 'Waste 4', data: [10, 15, 20, 25] },
    { name: 'Waste 5', data: [5, 10, 15, 20] }
  ],
  wasteDisposed: [
    { name: 'Non Hazardous Waste', data: [25, 30, 35, 40] },
    { name: 'E-Waste', data: [15, 20, 25, 30] },
    { name: 'Waste 3', data: [10, 15, 20, 25] },
    { name: 'Waste 4', data: [5, 10, 15, 20] },
    { name: 'Waste 5', data: [2, 7, 12, 17] }
  ],
  wasteRecovered: [
    { name: 'Non Hazardous Waste', data: [20, 25, 30, 35] },
    { name: 'E-Waste', data: [10, 15, 20, 25] },
    { name: 'Waste 3', data: [5, 10, 15, 20] },
    { name: 'Waste 4', data: [3, 8, 13, 18] },
    { name: 'Waste 5', data: [1, 6, 11, 16] }
  ]
};

const options = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: false // Hides the toolbar
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "15%"
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    labels: {
      style: {
        fontSize: '10px',
        fontWeight: 'bold',
        colors: 'grey',
      },
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '10px',
        fontWeight: 'bold',
        colors: 'grey',
      },
    }
  },
  legend: {
    show: false // Hides the legend within the chart
  }
};

const WasteComparison = () => {
  const [selectedOption, setSelectedOption] = useState('wasteGenerated');

  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="title">Comparison of Waste Management</div>


      </div>
      <div className='checkboxwaste' style={{ height: "10%" }}>
        <label>
          <input
            type="radio"
            value="wasteGenerated"
            checked={selectedOption === 'wasteGenerated'}
            onChange={handleCheckboxChange}
          />
          Waste Generated
        </label>
        <label>
          <input
            type="radio"
            value="wasteDisposed"
            checked={selectedOption === 'wasteDisposed'}
            onChange={handleCheckboxChange}
          />
          Waste Disposed
        </label>
        <label>
          <input
            type="radio"
            value="wasteRecovered"
            checked={selectedOption === 'wasteRecovered'}
            onChange={handleCheckboxChange}
          />
          Waste Recovered
        </label>
      </div>
      <div className="chart-container" style={{ marginTop: "-2%", height: "90%" }}>
        <ReactApexChart options={options} series={data[selectedOption]} type="bar" height={"100%"} />
      </div>
    </div>
  );
};

export default WasteComparison;
