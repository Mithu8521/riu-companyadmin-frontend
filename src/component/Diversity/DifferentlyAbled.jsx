import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const data = {
  permanentEmployees: {
    series: [
      {
        name: 'Permanent Employees',
        data: [40, 30, 5] // Values for Male, Female, Others
      }
    ],
    categories: ['Male', 'Female', 'Others']
  },
  nonPermanentEmployees: {
    series: [
      {
        name: 'Non-Permanent Employees',
        data: [20, 25, 10] // Values for Male, Female, Others
      }
    ],
    categories: ['Male', 'Female', 'Others']
  }
};

const options = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false // Hides the toolbar
    }
  },
  plotOptions: {
    bar: {
      horizontal: false, // Ensures vertical bars
      columnWidth: '30%', // Adjust column width to ensure spacing between bars
      endingShape: 'rounded',
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: [], // Categories will be dynamically set
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
      text: 'Count',
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'grey'
      }
    },
    labels: {
      style: {
        fontSize: '10px',
        fontWeight: 'bold',
        colors: 'grey'
      }
    }
  },
  colors: ['#3F88A5', '#FF6F61', '#A4A4A4'], // Different colors for Male, Female, and Others
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center'
  },
  grid: {
    show: false // Optional: hides the grid lines for a cleaner look
  }
};

const DifferentlyAbled = () => {
  const [selectedOption, setSelectedOption] = useState('permanentEmployees');

  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const currentData = data[selectedOption];

  return (
    <div className='container'>
      <div className="header">
        <div className="title">Employees Including Differently Abled</div>


      </div>
      <div className='checkboxwaste' style={{ height: "10%" }}>
        <label>
          <input
            type="radio"
            value="permanentEmployees"
            checked={selectedOption === 'permanentEmployees'}
            onChange={handleCheckboxChange}
          />
          Permanent Employees
        </label>
        <label>
          <input
            type="radio"
            value="nonPermanentEmployees"
            checked={selectedOption === 'nonPermanentEmployees'}
            onChange={handleCheckboxChange}
          />
          Non-Permanent Employees
        </label>
      </div>
      <div className="chart-container" style={{ marginTop: "-2%", height: "80%" }}>
        <ReactApexChart
          options={{
            ...options,
            xaxis: {
              ...options.xaxis,
              categories: currentData.categories // Dynamically set categories
            }
          }}
          series={currentData.series}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default DifferentlyAbled;
