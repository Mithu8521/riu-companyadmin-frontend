import React from 'react';
import ReactApexChart from 'react-apexcharts';

const series = [78, 22]; // 78% waste disposed, 22% other
const options = {
  chart: {
    type: 'donut',
    height: 350,
    toolbar: {
      show: false // Hides the toolbar
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '50%', // Size of the hollow center
        labels: {
          show: true,
          total: {
            show: false,
            label: 'Waste Disposed',
            formatter: function (w) {
              return series[0] + '%';
            }
          }
        }
      }
    }
  },
  labels: ['Waste Disposed', 'Remaining'],
  legend: {
    show: false // Hides the legend within the chart
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + '%';
    }
  },
  colors: ['#3F88A5', '#D3D3D3'], // Color for waste disposed and grey for the rest
};

const Legend = () => {
  const legendItems = [
    { name: 'Waste Disposed', color: '#3F88A5' },
    { name: 'Remaining', color: '#D3D3D3' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: item.color,
            marginRight: '8px'
          }}></div>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

const WasteDisposed = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="title">Waste Disposed</div>

      </div>
      <div className="chart-container" style={{ marginTop: "-2%", height: "75%" }}>
        <ReactApexChart options={options} series={series} type="donut" height={"100%"} />
      </div>
      <div style={{ height: "10%" }}>
        <Legend />

      </div>

    </div>
  );
}

export default WasteDisposed;
