import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const GenderPayGapAnalysis = () => {
  const [timeLocation, setTimeLocation] = useState('Time'); // Toggle between Time and Location
  const [selectedSubOption, setSelectedSubOption] = useState('Q1'); // Default selection

  const data = {
    Time: {
      Q1: [
        { name: 'Male', type: 'bar', data: [400] },
        { name: 'Female', type: 'bar', data: [150] },
        { name: 'Others', type: 'bar', data: [50] }
      ],
      Q2: [
        { name: 'Male', type: 'bar', data: [500] },
        { name: 'Female', type: 'bar', data: [200] },
        { name: 'Others', type: 'bar', data: [75] }
      ],
      Q3: [
        { name: 'Male', type: 'bar', data: [400] },
        { name: 'Female', type: 'bar', data: [150] },
        { name: 'Others', type: 'bar', data: [50] }
      ],
      Q4: [
        { name: 'Male', type: 'bar', data: [400] },
        { name: 'Female', type: 'bar', data: [150] },
        { name: 'Others', type: 'bar', data: [50] }
      ],
      // Add data for Q3, Q4...
    },
    Location: {
      Location1: [
        { name: 'Male', type: 'bar', data: [450] },
        { name: 'Female', type: 'bar', data: [200] },
        { name: 'Others', type: 'bar', data: [80] }
      ],
      Location2: [
        { name: 'Male', type: 'bar', data: [480] },
        { name: 'Female', type: 'bar', data: [220] },
        { name: 'Others', type: 'bar', data: [90] }
      ],
      Location3: [
        { name: 'Male', type: 'bar', data: [480] },
        { name: 'Female', type: 'bar', data: [220] },
        { name: 'Others', type: 'bar', data: [90] }
      ],
      Location4: [
        { name: 'Male', type: 'bar', data: [480] },
        { name: 'Female', type: 'bar', data: [220] },
        { name: 'Others', type: 'bar', data: [90] }
      ],
      // Add data for other locations...
    }
  };

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      stacked: false
    },
    stroke: {
      width: [0, 2, 2],

    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    fill: {
      opacity: [1, 0.5, 0.5]
    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: 'grey'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Value'
      },
      labels: {
        style: {
          colors: 'grey'
        }
      }
    },
    colors: ['#3F88A5', '#FFA07A', '#77DD77'],
    legend: {
      show: true,
      markers: {
        fillColors: ['#3F88A5', '#FFA07A', '#77DD77']
      }
    }
  };

  const handleToggleChange = (event) => {
    setTimeLocation(event.target.value);
    setSelectedSubOption(event.target.value === 'Time' ? 'Q1' : 'Location1');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Gender pay gap analysis (median pay ratio between genders)</div>
      </div>
      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            value="Time"
            checked={timeLocation === 'Time'}
            onChange={handleToggleChange}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="Location"
            checked={timeLocation === 'Location'}
            onChange={handleToggleChange}
          />
          Location
        </label>
      </div>
      <div className="radio-buttons">
        {timeLocation === 'Time'
          ? ['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedSubOption === quarter}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />
              {quarter}
            </label>
          ))
          : ['Location1', 'Location2', 'Location3'].map((location) => (
            <label key={location}>
              <input
                type="radio"
                value={location}
                checked={selectedSubOption === location}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />
              {location}
            </label>
          ))}
      </div>
      <div className="chart-container">
        <Chart
          options={options}
          series={data[timeLocation][selectedSubOption]}
          type="bar"
          height="350"
        />
      </div>
    </div>
  );
};

export default GenderPayGapAnalysis;
