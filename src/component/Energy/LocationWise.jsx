import React from 'react';
import Chart from 'react-apexcharts';

const LocationWise = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      background: '#ffffff',
      borderRadius: 20,
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true,
        columnWidth: '20%', // Adjust this value to reduce the width of the bars
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Coal', 'PNG', 'LPG'],
    },
    yaxis: {

    },
    colors: ['#11546f', '#6FAAC2', '#5F9699'],
    fill: {
      colors: ['#11546f', '#6FAAC2', '#5F9699'],
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return '<div class="arrow_box">' +
          '<span>' + w.globals.labels[dataPointIndex] + ': ' + series[seriesIndex][dataPointIndex] + '</span>' +
          '</div>'
      }
    },
  };

  const chartSeries = [
    {
      name: 'Units',
      data: [30, 40, 25], // Example data, you can replace it with your actual data
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ height: "10%", width: "100%", marginBottom: "5%" }}>
        <div style={titleStyle}>Location based Product Mix</div>

      </div>
      <div style={{ height: "85%", width: "100%" }}>

 {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
          />
        )}
      </div>

    </div>
  );
};

const containerStyle = {
  backgroundColor: 'white',

  borderRadius: '15px',
  width: "100%",
  height: "100%",
  padding: '20px',

};

const titleStyle = {
  textAlign: 'left',
  fontWeight: "bold",
  marginBottom: '20px',
};

export default LocationWise;
