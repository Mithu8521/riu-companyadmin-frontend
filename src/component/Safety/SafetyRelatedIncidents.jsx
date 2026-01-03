import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const SafetyRelatedIncidents = () => {


  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      area: {
        fillTo: 'end',
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'monotoneCubic',

    },
    xaxis: {
      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 'light',
          colors: 'grey',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 'light',
          colors: 'grey',
        },
      },
      min: 0,
      max: 1.2,
    },
    colors: ['#1E90FF', '#FF6347', '#32CD32'],
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    fill: {
      opacity: 1,
    },
  };

  const series = [
    {
      name: 'Work - related Injuries',
      data: [0.3, 0.9, 0.2, 1.2],
    },
    {
      name: 'No. of fatalities',
      data: [0.2, 0.8, 0.1, 0.3],
    },
    {
      name: 'Ill - Health',
      data: [0.4, 1.2, 0.3, 0.9],
    },
  ];

  return (
    <div className="container">
      <div className="header">
        <div className="title">Compare details of safety related incidents Of Workers</div>

      </div>
      <div className="chart-container">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
      <div className="legend-container" style={{ width: "100%", display: "flex", alignContent: "center", justifyContent: "center" }} >
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#1E90FF', borderRadius: "50px" }}></span>
          Work - related Injuries
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#FF6347', borderRadius: "50px" }}></span>
          No. of fatalities
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#32CD32', borderRadius: "50px" }}></span>
          Ill - Health
        </div>
      </div>
    </div>
  );
};

export default SafetyRelatedIncidents;
