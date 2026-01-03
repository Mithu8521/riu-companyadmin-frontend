import React from 'react';
import Chart from 'react-apexcharts';

const FrameworkPeriodChart = ({ chartData = null, loading = false }) => {
  console.log(chartData,"chartDatachartDatachartData")
  // Default empty state
  if (!chartData || !chartData.series || chartData.series.length === 0) {
    return (
      <>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(63, 136, 165, 0.1); }
              50% { box-shadow: 0 0 30px rgba(63, 136, 165, 0.2); }
            }
            
            .chart-container {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.95),
                rgba(248, 250, 252, 0.9),
                rgba(241, 245, 249, 0.85)
              );
              border: 1px solid rgba(255, 255, 255, 0.2);
              position: relative;
              overflow: hidden;
            }
            
            .chart-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 1px;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(63, 136, 165, 0.3),
                transparent
              );
              animation: shimmer 3s ease-in-out infinite;
            }
            
            .chart-container::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(
                circle,
                rgba(63, 136, 165, 0.03) 0%,
                transparent 50%
              );
              animation: float 6s ease-in-out infinite;
              pointer-events: none;
            }
            
            .decorative-orb {
              position: absolute;
              border-radius: 50%;
              background: linear-gradient(135deg, rgba(63, 136, 165, 0.1), rgba(63, 136, 165, 0.05));
              filter: blur(1px);
              animation: float 8s ease-in-out infinite;
            }
            
            .decorative-orb:nth-child(1) {
              width: 100px;
              height: 100px;
              top: 10%;
              right: 5%;
              animation-delay: -2s;
            }
            
            .decorative-orb:nth-child(2) {
              width: 60px;
              height: 60px;
              bottom: 15%;
              left: 8%;
              animation-delay: -4s;
            }
            
            .title-shimmer {
              background: linear-gradient(
                90deg,
                #1f2937,
                #3f88a5,
                #1f2937
              );
              background-size: 200% 100%;
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 4s ease-in-out infinite;
            }
            
            .chart-inner {
              background: linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.6)
              );
              
              border: 1px solid rgba(255, 255, 255, 0.3);
              position: relative;
              overflow: hidden;
            }
            
            .chart-inner::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                45deg,
                transparent 30%,
                rgba(63, 136, 165, 0.02) 50%,
                transparent 70%
              );
              pointer-events: none;
            }
            
            .stats-badge {
              background: linear-gradient(135deg, #3f88a5, #2e6b7a);
              background-size: 200% 200%;
              animation: shimmer 3s ease-in-out infinite;
            }
            
            .icon-container {
              background: linear-gradient(135deg, rgba(63, 136, 165, 0.1), rgba(63, 136, 165, 0.05));
              animation: pulse-glow 4s ease-in-out infinite;
            }
            
            .empty-state-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #3f88a5, #2e6b7a);
              border-radius: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              color: white;
              margin: 0 auto 24px auto;
              animation: float 3s ease-in-out infinite;
              position: relative;
            }
            
            .empty-state-icon::after {
              content: '';
              position: absolute;
              top: -2px;
              right: -2px;
              width: 16px;
              height: 16px;
              background: #10b981;
              border-radius: 50%;
              border: 2px solid white;
              animation: pulse 2s infinite;
            }
          `}
        </style>
        
        <div className="chart-container w-full rounded-3xl p-8 shadow-2xl transition-all duration-500">
          {/* Decorative Background Orbs */}
          <div className="decorative-orb"></div>
          <div className="decorative-orb"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="icon-container w-14 h-14 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h2 className="title-shimmer text-3xl font-bold mb-1">
                  Framework Completion by Periods
                </h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 text-sm">
                    Track framework progress over different time periods
                  </p>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center h-96">
            <div className="text-center relative z-10">
              <div className="empty-state-icon">
                📈
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Period Data Available</h3>
              <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                Select frameworks and periods to view the completion timeline chart.
              </p>
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Enhanced chart configuration with your theme colors
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 450,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        },
        export: {
          csv: {
            filename: 'framework-completion-by-periods',
          },
          svg: {
            filename: 'framework-completion-by-periods',
          },
          png: {
            filename: 'framework-completion-by-periods',
          }
        }
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 8,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: 600,
          colors: '#374151'
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Completion Percentage (%)',
        style: {
          fontSize: '13px',
          fontWeight: 600,
          color: '#6B7280'
        }
      },
      labels: {
        formatter: function (val) {
          return val + '%';
        },
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 500
        }
      },
      min: 0,
      max: 100
    },
    colors: [
      '#6366F1', // Blue (BRSR style)
      '#8B5CF6', // Purple (GRI style)
      '#10B981', // Green (CDP style)
      '#F59E0B', // Amber (SASB style)
      '#EF4444', // Red
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316'  // Orange
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: [
          '#4F46E5', // Darker blue
          '#7C3AED', // Darker purple
          '#059669', // Darker green
          '#D97706', // Darker amber
          '#DC2626', // Darker red
          '#0891B2', // Darker cyan
          '#65A30D', // Darker lime
          '#EA580C'  // Darker orange
        ],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100]
      }
    },
    
    grid: {
      show: true,
      borderColor: '#F3F4F6',
      strokeDashArray: 2,
      position: 'back',
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
      row: {
        colors: undefined,
        opacity: 0.5
      },
      column: {
        colors: undefined,
        opacity: 0.5
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
  tooltip: {
  enabled: true,
  shared: true,
  intersect: false,
  style: {
    fontSize: '13px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
  },
  y: {
    formatter: function (val) {
      return val + '%';
    }
  }
  // Remove the custom function entirely
},
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        plotOptions: {
          bar: {
            columnWidth: '85%'
          }
        },
        xaxis: {
          labels: {
            rotate: 0,
            style: {
              fontSize: '11px'
            }
          }
        }
      }
    }]
  };

  // Loading state
  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes skeleton-shimmer {
              0% { background-position: -200px 0; }
              100% { background-position: calc(200px + 100%) 0; }
            }
            
            .skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200px 100%;
              animation: skeleton-shimmer 1.5s infinite;
            }
          `}
        </style>
        
        <div className="w-full bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gray-200 rounded-2xl skeleton"></div>
              <div className="space-y-2">
                <div className="h-7 bg-gray-200 rounded-lg w-80 skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-64 skeleton"></div>
              </div>
            </div>
            <div className="w-20 h-10 bg-gray-200 rounded-xl skeleton"></div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-24 skeleton"></div>
              <div className="h-3 bg-gray-200 rounded w-20 skeleton"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 skeleton"></div>
          </div>
          
          <div className="h-96 bg-gray-200 rounded-2xl skeleton"></div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="h-3 bg-gray-200 rounded w-20 skeleton"></div>
              <div className="h-3 bg-gray-200 rounded w-16 skeleton"></div>
              <div className="h-3 bg-gray-200 rounded w-18 skeleton"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-24 skeleton"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(63, 136, 165, 0.1); }
            50% { box-shadow: 0 0 30px rgba(63, 136, 165, 0.2); }
          }
          
          .chart-container {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.95),
              rgba(248, 250, 252, 0.9),
              rgba(241, 245, 249, 0.85)
            );
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
          }
          
          .chart-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(63, 136, 165, 0.3),
              transparent
            );
            animation: shimmer 3s ease-in-out infinite;
          }
          
          .chart-container::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              circle,
              rgba(63, 136, 165, 0.03) 0%,
              transparent 50%
            );
            animation: float 6s ease-in-out infinite;
            pointer-events: none;
          }
          
          .decorative-orb {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(63, 136, 165, 0.1), rgba(63, 136, 165, 0.05));
            filter: blur(1px);
            animation: float 8s ease-in-out infinite;
          }
          
          .decorative-orb:nth-child(1) {
            width: 100px;
            height: 100px;
            top: 10%;
            right: 5%;
            animation-delay: -2s;
          }
          
          .decorative-orb:nth-child(2) {
            width: 60px;
            height: 60px;
            bottom: 15%;
            left: 8%;
            animation-delay: -4s;
          }
          
          .title-shimmer {
            background: linear-gradient(
              90deg,
              #1f2937,
              #3f88a5,
              #1f2937
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s ease-in-out infinite;
          }
          
          .chart-inner {
            background: linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.9),
              rgba(255, 255, 255, 0.6)
            );
            
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
          }
          
          .chart-inner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(63, 136, 165, 0.02) 50%,
              transparent 70%
            );
            pointer-events: none;
          }
          
          .stats-badge {
            background: linear-gradient(135deg, #3f88a5, #2e6b7a);
            background-size: 200% 200%;
            animation: shimmer 3s ease-in-out infinite;
          }
          
          .icon-container {
            background: linear-gradient(135deg, rgba(63, 136, 165, 0.1), rgba(63, 136, 165, 0.05));
            animation: pulse-glow 4s ease-in-out infinite;
          }
        `}
      </style>
      
      <div className="chart-container w-full h-100 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
        {/* Decorative Background Orbs */}
        <div className="decorative-orb"></div>
        <div className="decorative-orb"></div>
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="icon-container w-14 h-14 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            
            <div>
              <h2 className="title-shimmer text-3xl font-bold mb-1">
                Framework Completion by Periods
              </h2>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600 text-sm">
                  Track framework progress over different time periods
                </p>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Chart Container */}
        <div className="chart-inner w-full rounded-2xl p-6 relative z-10">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="bar"
            height={450}
          />
        </div>
        
      </div>
    </>
  );
};

export default FrameworkPeriodChart;