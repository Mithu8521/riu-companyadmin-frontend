import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const LeadershipAndMentor = () => {
  const [selectedCategory, setSelectedCategory] = useState('Time');
  const [selectedOption, setSelectedOption] = useState('Location1');

  const dataMap = {
    Time: {
      Location1: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      Location2: [23, 42, 55, 60, 39, 75, 90, 85, 130],
      Location3: [33, 51, 45, 50, 60, 70, 80, 95, 125],
      Location4: [20, 31, 55, 50, 40, 65, 80, 90, 110],
      Location5: [15, 29, 49, 55, 45, 60, 75, 85, 120],
    },
    Location: {
      Q1: [50, 60, 70, 80, 90, 100, 110, 120, 130],
      Q2: [55, 65, 75, 85, 95, 105, 115, 125, 135],
      Q3: [60, 70, 80, 90, 100, 110, 120, 130, 140],
      Q4: [65, 75, 85, 95, 105, 115, 125, 135, 145],
    },
  };

  const seriesData = [
    {
      name: 'Desktops',
      data: dataMap[selectedCategory][selectedOption],
    },
    {
      name: 'Tablets',
      data: dataMap[selectedCategory][selectedOption].map((val) => val - 10),
    },
    {
      name: 'Mobiles',
      data: dataMap[selectedCategory][selectedOption].map((val) => val - 20),
    },
  ];

  const options = {
    series: seriesData,
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // alternating row colors
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedOption(Object.keys(dataMap[category])[0]); // Default to first option in the selected category
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className='container'>
      <div>
        <label>
          <input
            type="radio"
            value="Time"
            checked={selectedCategory === 'Time'}
            onChange={handleCategoryChange}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="Location"
            checked={selectedCategory === 'Location'}
            onChange={handleCategoryChange}
          />
          Location
        </label>
      </div>

      <div>
        {selectedCategory === 'Time' ? (
          <>
            <label>
              <input
                type="radio"
                value="Location1"
                checked={selectedOption === 'Location1'}
                onChange={handleOptionChange}
              />
              Location1
            </label>
            <label>
              <input
                type="radio"
                value="Location2"
                checked={selectedOption === 'Location2'}
                onChange={handleOptionChange}
              />
              Location2
            </label>
            <label>
              <input
                type="radio"
                value="Location3"
                checked={selectedOption === 'Location3'}
                onChange={handleOptionChange}
              />
              Location3
            </label>
            <label>
              <input
                type="radio"
                value="Location4"
                checked={selectedOption === 'Location4'}
                onChange={handleOptionChange}
              />
              Location4
            </label>
            <label>
              <input
                type="radio"
                value="Location5"
                checked={selectedOption === 'Location5'}
                onChange={handleOptionChange}
              />
              Location5
            </label>
          </>
        ) : (
          <>
            <label>
              <input
                type="radio"
                value="Q1"
                checked={selectedOption === 'Q1'}
                onChange={handleOptionChange}
              />
              Q1
            </label>
            <label>
              <input
                type="radio"
                value="Q2"
                checked={selectedOption === 'Q2'}
                onChange={handleOptionChange}
              />
              Q2
            </label>
            <label>
              <input
                type="radio"
                value="Q3"
                checked={selectedOption === 'Q3'}
                onChange={handleOptionChange}
              />
              Q3
            </label>
            <label>
              <input
                type="radio"
                value="Q4"
                checked={selectedOption === 'Q4'}
                onChange={handleOptionChange}
              />
              Q4
            </label>
          </>
        )}
      </div>

      <div id="chart">
        <ReactApexChart options={options} series={seriesData} type="line" height={350} />
      </div>
    </div>
  );
};

export default LeadershipAndMentor;
