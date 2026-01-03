import Chart from 'react-apexcharts';

const LocationPerformanceComparisonChart = ({ chartData = null, loading = false }) => {
  if (!chartData || !chartData.series || chartData.series.length === 0) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          fontSize: "64px",
          marginBottom: "20px",
          opacity: 0.5
        }}>
          🌍
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Comparison Data Available
        </h3>
        <p style={{
          color: "#6B7280",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: "1.5"
        }}>
          Select locations and frameworks to compare performance across different sites.
        </p>
      </div>
    );
  }

  const isSameLocation = chartData.primaryLocationName === chartData.compareLocationName;
  
  let displaySeries = chartData.series;
  let displayColors = ['#3B82F6', '#8B5CF6'];
  
  if (isSameLocation && chartData.series.length > 1) {
    displaySeries = [chartData.series[0]];
    displayColors = ['#3B82F6'];
  }

  // Chart configuration - clean and simple
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false // Remove toolbar completely
      },
      fontFamily: 'Arial, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        barHeight: '60%',
        distributed: false,
        dataLabels: {
          position: 'center'
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#FFFFFF'],
        fontFamily: 'Arial, sans-serif'
      },
      formatter: function (val) {
        return val + '%';
      }
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.categories,
            title: {
        text: 'Completion Percentage (%)',
        style: {
          fontSize: '14px',
          fontWeight: 500,
          color: '#6B7280',
          fontFamily: 'Arial, sans-serif'
        }
      },
      labels: {
        formatter: function (val) {
          return val ;
        },
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif'
        }
      },

      axisBorder: {
        show: true,
        color: '#E5E7EB',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
        show: false
      },
      min: 0,
      max: 100
    },
    yaxis: {

      labels: {
        formatter: function (val) {
          return val ;
        },
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif'
        }
      }
    },
    colors: displayColors,
    fill: {
      opacity: 1,
      type: 'solid'
    },
    legend: {
      show: !isSameLocation, // Hide legend when showing single location
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#374151',
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 2,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      },
      offsetY: 0
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      style: {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif'
      },
      y: {
        formatter: function (val) {
          return val + '%';
        }
      }
    },
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px"
        }}>
          <div style={{
            width: "250px",
            height: "32px",
            background: "#E5E7EB",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite"
          }}></div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                background: "#E5E7EB",
                borderRadius: "2px",
                animation: "pulse 1.5s ease-in-out infinite"
              }}></div>
              <div style={{
                width: "120px",
                height: "16px",
                background: "#E5E7EB",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite"
              }}></div>
            </div>
          ))}
        </div>

        <div style={{
          height: "400px",
          background: "#F3F4F6",
          borderRadius: "8px",
          animation: "pulse 1.5s ease-in-out infinite"
        }}></div>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      background: "white",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    }}>
      {/* Header - updated to show single location when same */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>🌍</span>
        <h2 style={{
          color: "#374151",
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "400",
          margin: 0
        }}>
          Location Performance Comparison
        </h2>
      </div>

      {/* Chart */}
      <div style={{
        width: "100%",
        background: "#FAFAFA",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        padding: "20px"
      }}>
        <Chart
          options={chartOptions}
          series={displaySeries}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default LocationPerformanceComparisonChart;