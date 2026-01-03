import React from 'react';
import Chart from 'react-apexcharts';

const OverTheYear = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      background: '#ffffff',
      toolbar: {
        show: false
      },
    },

    stroke: {
      curve: 'straight', // Ensures the line connects the points in straight lines
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: 'Month',
      },
    },
    yaxis: {

    },
    dataLabels: {
      enabled: false,
    },
  };

  const chartSeries = [
    {
      name: 'Energy Consumption',
      data: [450, 470, 510, 520, 540, 580, 600, 620, 630, 650, 660, 680], // Example data, replace with actual data
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ height: "10%", width: "100%", marginBottom: "5%" }}>
        <div style={titleStyle}>Energy Consumption Across The Year</div>

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
  height: "100%",
  width: "100%",
  borderRadius: '15px',
  padding: '20px',
}


const titleStyle = {
  textAlign: 'left',
  fontWeight: "bold",
  marginBottom: '20px',
};

export default OverTheYear;
