import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ProgressTowardsESGTargets = () => {
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
              name: 'Target',
              type: 'column',
              data: [40, 55, 45, 80], // Example data for Q1
            },
            {
              name: 'Actual',
              type: 'line',
              data: [45, 60, 50, 85], // Example data for Q1
            },
          ];
        case 'Q2':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [50, 60, 55, 90], // Example data for Q2
            },
            {
              name: 'Actual',
              type: 'line',
              data: [55, 65, 60, 95], // Example data for Q2
            },
          ];
        case 'Q3':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [60, 70, 65, 100], // Example data for Q3
            },
            {
              name: 'Actual',
              type: 'line',
              data: [65, 75, 70, 105], // Example data for Q3
            },
          ];
        case 'Q4':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [70, 80, 75, 110], // Example data for Q4
            },
            {
              name: 'Actual',
              type: 'line',
              data: [75, 85, 80, 115], // Example data for Q4
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
              name: 'Target',
              type: 'column',
              data: [40, 50, 45, 55], // Example data for Location 1
            },
            {
              name: 'Actual',
              type: 'line',
              data: [45, 55, 50, 60], // Example data for Location 1
            },
          ];
        case 'Location 2':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [50, 60, 55, 65], // Example data for Location 2
            },
            {
              name: 'Actual',
              type: 'line',
              data: [55, 65, 60, 70], // Example data for Location 2
            },
          ];
        case 'Location 3':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [60, 70, 65, 75], // Example data for Location 3
            },
            {
              name: 'Actual',
              type: 'line',
              data: [65, 75, 70, 80], // Example data for Location 3
            },
          ];
        case 'Location 4':
          return [
            {
              name: 'Target',
              type: 'column',
              data: [70, 80, 75, 85], // Example data for Location 4
            },
            {
              name: 'Actual',
              type: 'line',
              data: [75, 85, 80, 90], // Example data for Location 4
            },
          ];
        default:
          return [];
      }
    }
  };

  const options = {
    chart: {
      type: 'line',
      height: 350,
      stacked: false,
    },
    stroke: {
      width: [0, 4],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    xaxis: {
      categories: selectedOption === 'Time'
        ? ['Location 1', 'Location 2', 'Location 3', 'Location 4']
        : ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    yaxis: {
      title: {
        text: 'Percentage',
      },
      max: 120,
    },
    fill: {
      opacity: [0.9, 1],
    },
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    colors: ['#C0C4C8', '#0086A5'],
    title: {
      text: 'Progress Towards ESG Targets',
      align: 'left',
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
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
        <ReactApexChart options={options} series={getData()} type="line" height={350} />
      </div>
    </div>
  );
};

export default ProgressTowardsESGTargets;
