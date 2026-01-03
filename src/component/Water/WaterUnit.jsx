import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const WaterStorageTracking = () => {
  const [selectedOption, setSelectedOption] = useState('Time');
  const [selectedCategory, setSelectedCategory] = useState('Q1');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedCategory(event.target.value === 'Time' ? 'Q1' : 'Location 1'); // Reset category selection on option change
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getData = () => {
    if (selectedOption === 'Time') {
      switch (selectedCategory) {
        case 'Q1':
          return [
            {
              name: 'Unit 1',
              data: [1200, 1000, 1100, 600],
            },
            {
              name: 'Unit 2',
              data: [600, 500, 600, 400],
            },
          ];
        case 'Q2':
          return [
            {
              name: 'Unit 1',
              data: [1100, 900, 1000, 700],
            },
            {
              name: 'Unit 2',
              data: [550, 450, 500, 350],
            },
          ];
        case 'Q3':
          return [
            {
              name: 'Unit 1',
              data: [1000, 850, 950, 650],
            },
            {
              name: 'Unit 2',
              data: [500, 400, 450, 300],
            },
          ];
        case 'Q4':
          return [
            {
              name: 'Unit 1',
              data: [950, 800, 900, 600],
            },
            {
              name: 'Unit 2',
              data: [450, 350, 400, 250],
            },
          ];
        default:
          return [];
      }
    } else if (selectedOption === 'Location') {
      switch (selectedCategory) {
        case 'Location 1':
          return [
            {
              name: 'Unit 1',
              data: [1200, 1100, 1000, 900],
            },
            {
              name: 'Unit 2',
              data: [600, 550, 500, 450],
            },
          ];
        case 'Location 2':
          return [
            {
              name: 'Unit 1',
              data: [1000, 950, 900, 850],
            },
            {
              name: 'Unit 2',
              data: [500, 450, 400, 350],
            },
          ];
        case 'Location 3':
          return [
            {
              name: 'Unit 1',
              data: [1100, 1000, 950, 900],
            },
            {
              name: 'Unit 2',
              data: [550, 500, 450, 400],
            },
          ];
        case 'Location 4':
          return [
            {
              name: 'Unit 1',
              data: [950, 900, 850, 800],
            },
            {
              name: 'Unit 2',
              data: [450, 400, 350, 300],
            },
          ];
        default:
          return [];
      }
    }
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    title: {
      text: 'Water Storage Tracking',
      align: 'left',
    },
    xaxis: {
      categories:
        selectedOption === 'Time'
          ? ['Location 1', 'Location 2', 'Location 3', 'Location 4']
          : ['Q1', 'Q2', 'Q3', 'Q4'],
      title: {
        text: selectedOption === 'Time' ? 'Location' : 'Time',
      },
    },
    yaxis: {
      title: {
        text: 'Water Storage',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
    },
  };

  return (
    <div className='container'>
      <div>
        <label>
          <input
            type="radio"
            value="Time"
            checked={selectedOption === 'Time'}
            onChange={handleOptionChange}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="Location"
            checked={selectedOption === 'Location'}
            onChange={handleOptionChange}
          />
          Location
        </label>
      </div>
      <div>
        {selectedOption === 'Time' ? (
          <>
            <label>
              <input
                type="radio"
                value="Q1"
                checked={selectedCategory === 'Q1'}
                onChange={handleCategoryChange}
              />
              Q1
            </label>
            <label>
              <input
                type="radio"
                value="Q2"
                checked={selectedCategory === 'Q2'}
                onChange={handleCategoryChange}
              />
              Q2
            </label>
            <label>
              <input
                type="radio"
                value="Q3"
                checked={selectedCategory === 'Q3'}
                onChange={handleCategoryChange}
              />
              Q3
            </label>
            <label>
              <input
                type="radio"
                value="Q4"
                checked={selectedCategory === 'Q4'}
                onChange={handleCategoryChange}
              />
              Q4
            </label>
          </>
        ) : (
          <>
            <label>
              <input
                type="radio"
                value="Location 1"
                checked={selectedCategory === 'Location 1'}
                onChange={handleCategoryChange}
              />
              Location 1
            </label>
            <label>
              <input
                type="radio"
                value="Location 2"
                checked={selectedCategory === 'Location 2'}
                onChange={handleCategoryChange}
              />
              Location 2
            </label>
            <label>
              <input
                type="radio"
                value="Location 3"
                checked={selectedCategory === 'Location 3'}
                onChange={handleCategoryChange}
              />
              Location 3
            </label>
            <label>
              <input
                type="radio"
                value="Location 4"
                checked={selectedCategory === 'Location 4'}
                onChange={handleCategoryChange}
              />
              Location 4
            </label>
          </>
        )}
      </div>
      <div className="chart-container">
        <ReactApexChart options={options} series={getData()} type="bar" height={350} />
      </div>
    </div>
  );
};

export default WaterStorageTracking;
