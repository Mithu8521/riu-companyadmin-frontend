import React from 'react'
import ReactApexChart from 'react-apexcharts';


const WasteRecovered = () => {
  const series = [
    {
      name: 'Waste Types',
      data: [30, 40, 25] // Values for each waste type
    }
  ];

  const options = {
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
        columnWidth: "60px",
        horizontal: false,
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
      categories: ['Recycled', 'Reused', 'Other Options'],
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          colors: ['#3F88A5', '#B0C4DE', '#FF6F61'] // Colors for each x-axis label
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        enabled: false,
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          colors: '#000000' // Color for y-axis labels
        }
      }
    },
    colors: ['#3F88A5', '#B0C4DE', '#FF6F61'], // Different colors for each bar
    legend: {
      show: false // Hides the legend
    }
  };
  return (
    <div className="container">
      <div className="header">
        <div className="title">Waste Recovered</div>

      </div>
      <div className="chart-container" style={{ marginTop: "-2%", height: "95%" }}>
        <ReactApexChart options={options} series={series} type="bar" height={"100%"} />
      </div>

    </div>
  )
}

export default WasteRecovered