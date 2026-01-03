import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const OccupationalHealth = () => {
  const [selectedCategory, setSelectedCategory] = useState('employees'); // Default category selection
  const [isPermanent, setIsPermanent] = useState(true); // State for toggling between permanent and non-permanent

  const dataOptions = {
    employees: {
      permanent: [40, 30, 30], // Example data for Male, Female, Others (Permanent)
      nonPermanent: [25, 15, 10], // Example data for Male, Female, Others (Non-Permanent)
    },
    workers: {
      permanent: [50, 20, 30], // Example data for Male, Female, Others (Permanent)
      nonPermanent: [30, 10, 20], // Example data for Male, Female, Others (Non-Permanent)
    },
  };

  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Male', 'Female', 'Others'],
    colors: ['#1E90FF', '#FF6347', '#32CD32'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Occupational Health</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="checkbox-container">
          <label>
            <input
              type="radio"
              value="employees"
              checked={selectedCategory === 'employees'}
              onChange={() => setSelectedCategory('employees')}
            />
            Employees
          </label>
          <label>
            <input
              type="radio"
              value="workers"
              checked={selectedCategory === 'workers'}
              onChange={() => setSelectedCategory('workers')}
            />
            Workers
          </label>
        </div>
        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span className="toggle-arrow">{isPermanent ? "→" : "←"}</span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>

      </div>





      <div className="chart-container">
        <Chart
          options={options}
          series={
            isPermanent
              ? dataOptions[selectedCategory].permanent
              : dataOptions[selectedCategory].nonPermanent
          }
          type="donut"
          height="350"
        />
      </div>
    </div>
  );
};

export default OccupationalHealth;
