import React from 'react';
import Chart from 'react-apexcharts';
import './WasteGenerated.css';

const WasteGenerated = () => {

  const legendItems = [
    { name: 'Non Hazardous Waste', color: '#3F88A5' },
    { name: 'E-Waste', color: '#B0C4DE' },
    { name: 'Waste 3', color: '#7D4C92' },
    { name: 'Waste 4', color: '#FF6F61' },
    { name: 'Waste 5', color: '#4CAF50' },
  ];
  const series = [
    {
      name: 'Waste Types',
      data: [4000, 3500, 2500, 3000, 2000] // Single value for each waste type
    }
  ];
  const options = {
    series: series,
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false // Hides the toolbar
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
        distributed: true // Distributes colors among the bars
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000000'] // Color of the data labels
      },
      offsetX: 0,
      offsetY: -20, // Adjusts the position of the data labels
    },
    xaxis: {
      categories: ['Non Hazardous Waste', 'E-Waste', 'Waste 3', 'Waste 4', 'Waste 5'],
      labels: {
        show: true, // Hides x-axis labels
        offsetY: -130 // Sets the offset of x-axis values
      }
    },
    yaxis: {
      labels: {
        show: false // Hides the y-axis labels
      }
    },
    colors: ['#3F88A5', '#B0C4DE', '#7D4C92', '#FF6F61', '#4CAF50'], // Different colors for each bar
    legend: {
      show: false // Hides the legend
    }
  };





  return (
    <div className="container" style={{ paddingLeft: "5px", paddingBottom: "5px" }}>
      <div className="header">
        <div className="title">Waste Generated</div>

      </div>
      <div className="chart-container" style={{ marginTop: "-2%" }}>
        {series.length > 0 && options.xaxis.categories.length > 0 && <Chart options={options} series={series} type="bar" height={"100%"} />}
      </div>
      <div className="legend-container" style={{ marginTop: "-2%" }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
          {legendItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', marginRight: "20px" }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: item.color,
                marginRight: '8px',
                marginTop: "2px"
              }}></div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteGenerated;
