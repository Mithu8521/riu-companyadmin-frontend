import React from 'react';
import Chart from 'react-apexcharts';
import './ProductWiseEmission.css'

const ProductWiseEmission = () => {
  const series = [{
    name: 'Emissions',
    data: [
      { x: 'Bituminous Coal', y: 4000 },
      { x: 'Fuel Oil', y: 3000 },
      { x: 'Diesel', y: 3500 },
      { x: 'Biomass Briquettes', y: 2500 },
      { x: 'Rice Husk', y: 1500 },
      { x: 'Petrol', y: 3500 },
      { x: 'LPG', y: 2000 },
      { x: 'PNG', y: 3000 },
      { x: 'CNG', y: 1000 }
    ]
  }];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        distributed: true,
      }
    },
    xaxis: {
      categories: [
        'Bituminous Coal', 'Fuel Oil', 'Diesel', 'Biomass Briquettes', 'Rice Husk', 'Petrol', 'LPG', 'PNG', 'CNG'
      ],
      labels: {
        style: {
          fontSize: '10px', // Reduce font size
          fontWeight: 'normal',
          colors: 'grey',
        },
        rotate: 0, // Make labels horizontal
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
        }
      }
    },
    colors: ['#3F88A5', '#587B87', '#a8d5e2', '#d3d3d3', '#78C0E0', '#6a959d', '#557a95', '#c1d3e0', '#7f8c8d'],
    legend: {
      show: false
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h3 className="title">Product-Wise Emission Scope1</h3>
      </div>
      <div className="chart-container">
        <div className="chart-inner-container">
          <Chart options={options} series={series} type="bar" height={"100%"} />
        </div>
      </div>
    </div>
  );
}

export default ProductWiseEmission