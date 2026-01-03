import React from 'react';
import Chart from 'react-apexcharts';

const YearOverYearComparisonChart = ({ chartData = null, loading = false }) => {
  // Default empty state
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
          📅
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Year Comparison Data
        </h3>
        <p style={{
          color: "#6B7280",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: "1.5"
        }}>
          Select multiple financial years to compare performance trends.
        </p>
      </div>
    );
  }

  // Chart configuration - clean and simple
  const chartOptions = {
    chart: {
      type: 'area',
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
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#374151'],
        fontFamily: 'Arial, sans-serif'
      },
      formatter: function (val) {
        return val + '%';
      }
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: '#fff',
      hover: {
        size: 8,
        sizeOffset: 3
      }
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Periods',
        style: {
          fontSize: '14px',
          fontWeight: 500,
          color: '#6B7280',
          fontFamily: 'Arial, sans-serif'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: '#374151',
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
      }
    },
    yaxis: {
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
          return val + '%';
        },
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif'
        }
      },
      min: 0,
      max: 100,
      tickAmount: 5
    },
    colors: ['#06B6D4', '#10B981', '#F59E0B', '#EF4444'], // Teal, Green, Yellow, Red
    legend: {
      show: true,
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
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20
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
          {[1, 2, 3, 4].map(i => (
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
                width: "60px",
                height: "16px",
                background: "#E5E7EB",
                borderRadius: "4px",
                animation: "pulse 1.5s ease-in-out infinite"
              }}></div>
            </div>
          ))}
        </div>

        <div style={{
          height: "300px",
          background: "#F3F4F6",
          borderRadius: "8px",
          marginBottom: "20px",
          animation: "pulse 1.5s ease-in-out infinite"
        }}></div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px"
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: "#F3F4F6",
              borderRadius: "8px",
              padding: "16px",
              animation: "pulse 1.5s ease-in-out infinite"
            }}>
              <div style={{
                height: "16px",
                background: "#E5E7EB",
                borderRadius: "4px",
                marginBottom: "8px"
              }}></div>
              <div style={{
                height: "24px",
                background: "#E5E7EB",
                borderRadius: "4px"
              }}></div>
            </div>
          ))}
        </div>

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
      {/* Header - exact match to other charts */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>📅</span>
        <h2 style={{
          color: "#374151",
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "400",
          margin: 0
        }}>
          Year-over-Year Comparison
        </h2>
      </div>
      <div style={{
        width: "100%",
        background: "#FAFAFA",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        padding: "20px",
      }}>
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="area"
          height={400}
        />
      </div>
    </div>
  );
};

export default YearOverYearComparisonChart;