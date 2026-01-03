import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const WaterRevenueIntensity = () => {
  const [selectedOption, setSelectedOption] = useState('Time');
  const [selectedCategory, setSelectedCategory] = useState('Q1');

  const options = {
    chart: {
      type: 'area',
      height: 350,
      stacked: false,
    },
    title: {
      text: 'Water Revenue Intensity',
      align: 'left',
    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      title: {
        text: selectedOption === 'Time' ? 'Time' : 'Location',
      },
    },
    yaxis: {
      title: {
        text: 'Revenue / Intensity',
      },
    },
    stroke: {
      width: [0, 2],
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    markers: {
      size: 5,
    },
    fill: {
      opacity: [0.85, 0.25],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    legend: {
      position: 'bottom',
    },
  };

  const series = [
    {
      name: 'Total Revenue',
      type: 'column',
      data:
        selectedOption === 'Time'
          ? [30, 20, 15, 10]
          : [35, 25, 20, 15], // Example data for Time and Location
    },
    {
      name: 'Revenue Intensity',
      type: 'line',
      data:
        selectedOption === 'Time'
          ? [60, 40, 25, 20]
          : [65, 50, 30, 25], // Example data for Time and Location
    },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedCategory('Q1'); // Reset category selection on option change
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
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
            <label>
              <input
                type="radio"
                value="Location 5"
                checked={selectedCategory === 'Location 5'}
                onChange={handleCategoryChange}
              />
              Location 5
            </label>
          </>
        )}
      </div>
      <div className="chart-container">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default WaterRevenueIntensity;
