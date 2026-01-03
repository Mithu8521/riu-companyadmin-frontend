import React from 'react';
import ApexCharts from 'react-apexcharts';

const TopWasteDisposal = () => {
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
    <div className="container">
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

export default TopWasteDisposal;
