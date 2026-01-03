import React from 'react';
import Chart from 'react-apexcharts';
import './ComparisonScope.css';

const ComparisonScope = () => {
  const series = [
    {
      name: 'Scope 1',
      data: [4000, 3000, 3500, 2500]
    },
    {
      name: 'Scope 2',
      data: [3500, 3000, 4000, 3000]
    }
  ];
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
      }
    },
    xaxis: {
      categories: ['Q4', 'Q3', 'Q2', 'Q1'],
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          colors: 'grey',
        },
        offsetY: -130,
        offsetX: -0
        // Adjusts the offset of the labels
      }
    },
    yaxis: {
      labels: {
        show: false,


      }
    },
    colors: ['#3F88A5', '#B0C4DE'],
    legend: {
      show: false // Hides the legend
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Scope 1 And Scope 2 Comparison</div>

      </div>
      <div className="chart-container" style={{ marginTop: "-2%" }}>
          { series.length > 0 && options.xaxis.categories.length > 0 && <Chart
                  options={options}
                  series={series}
                  type="bar"
                  height={"100%"}
                />}
      </div>
      <div className="legend-container" style={{ marginTop: "-2%" }}>
        {options.colors.map((color, index) => (
          <div className="legend-item" key={index}>
            <div className="legend-color-box" style={{ backgroundColor: color }}></div>
            <span className="legend-text">{series[index].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonScope;
