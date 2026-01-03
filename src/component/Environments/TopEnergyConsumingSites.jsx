import React from 'react';
import ApexCharts from 'react-apexcharts';

const TopEnergyConsumingSites = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Top Contributing Sites',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    xaxis: {
      categories: ['Location 1', 'Location 2', 'Location 3'],
    },
    yaxis: {
      title: {
        text: 'Contribution',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
    },
  };

  const chartSeries = [
    {
      name: 'Contribution',
      data: [30, 40, 50], // Example data, replace with actual values
    },
  ];

  return (
    <div className="container" style={{
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      marginRight: '20px', // Adjust as needed
      backgroundColor: 'white', // Ensure container is white
      padding: '20px',
      height: "80%" // Optional: Add some padding for better spacing
    }}>
      {/* <div className="header">
        <div className="title">Top Energy Consuming Sites</div>
      </div> */}
      <div className='chart-container'>
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />

      </div>

    </div>
  );
};

export default TopEnergyConsumingSites;
