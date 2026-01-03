import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SafetyStandards = () => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true, // Makes the bars horizontal
      },
    },
    dataLabels: {
      enabled: true, // Hides data labels on bars
    },
    xaxis: {
      categories: ['Internal Safety Standards', 'External Safety Standards'], // Labels for the bars
    },
    title: {
      text: 'Safety Standards Comparison',
      align: 'center',
    },
  };

  const series = [
    {
      name: 'Safety Standards',
      data: [75, 85], // Data values for internal and external safety standards
    },
  ];

  return (
    <div className="container">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default SafetyStandards;
