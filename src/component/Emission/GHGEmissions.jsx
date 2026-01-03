import React from 'react';
import Chart from 'react-apexcharts';

const GHGEmissions = () => {
  const options = {
    chart: {
      type: 'donut', // Set chart type to 'donut'
    },
    labels: ['Topic 1', 'Topic 2'], // Labels for the donut chart
    plotOptions: {
      pie: {
        customScale: 0.8
      }
    },
    legend: {
      show: true,
      position: 'bottom', // Place the legend at the bottom
      horizontalAlign: 'center', // Center the legend horizontally
      offsetY: 0, // Adjust vertical offset if needed
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#3F88A5', '#587B87'], // Set the colors for the donut segments
  };

  const series = [60, 40];


  return (
    <div style={containerStyle}>
      <div style={headingStyle}>GHG Emissions</div>
      <div style={chartContainerStyle}>
          { series.length > 0 && options.xaxis.categories.length > 0 && <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={"100%"}
                      />}
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '15px',
  width: '100%',
  height: '100%',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  height: "15%",
  marginBottom: '20px',
  textAlign: 'left',
};

const chartContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  height: "85%"
};

export default GHGEmissions;
