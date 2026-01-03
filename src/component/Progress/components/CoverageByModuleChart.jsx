import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const CoverageByModuleChart = ({ chartData = null, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when chartData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [chartData]);

  // Default empty state
  if (!chartData || !chartData.series || chartData.series.length === 0 || !chartData.moduleDetails) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "620px",
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
          📋
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Module Data Available
        </h3>
        <p style={{
          color: "#6B7280",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: "1.5"
        }}>
          Select modules to view coverage comparison and progress tracking.
        </p>
      </div>
    );
  }

  // Calculate pagination
  const totalModules = chartData.moduleDetails.length;
  const totalPages = Math.ceil(totalModules / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalModules);

  // Get current page data
  const currentPageModules = chartData.moduleDetails.slice(startIndex, endIndex);
  const currentPageCategories = currentPageModules.map(module => module.moduleName);
  const currentPageCurrentData = currentPageModules.map(module => module.currentPercentage);
  const currentPageTargetData = currentPageModules.map(module => module.targetPercentage);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  const goToLast = () => {
    goToPage(totalPages);
  };

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
        barHeight: '65%',
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
        colors: ['#FFFFFF']
      },
      formatter: function (val, { seriesIndex, dataPointIndex }) {
        const moduleDetail = currentPageModules[dataPointIndex];
        if (seriesIndex === 0) {
          return `${val}% (${moduleDetail.currentCompleted})`;
        } else {
          return `${val}% (${moduleDetail.totalQuestions})`;
        }
      }
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: currentPageCategories,
      labels: {
        style: {
          fontSize: '14px',
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
      },
      min: 0,
      max: 100
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
          fontWeight: 400,
          fontFamily: 'Arial, sans-serif'
        }
      }
    },
    colors: ['#6366F1', '#8B5CF6'],
    fill: {
      opacity: 1,
      type: 'solid'
    },
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
      shared: false,
      intersect: true,
      style: {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif'
      },
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex }) {
          const moduleDetail = currentPageModules[dataPointIndex];
          const seriesName = seriesIndex === 0 ? 'Current Coverage' : 'Target Coverage';
          const completed = seriesIndex === 0 ? moduleDetail.currentCompleted : moduleDetail.targetCompleted;
          return `${seriesName}: ${val}% (${completed}/${moduleDetail.totalQuestions} questions)`;
        }
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "620px",
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
          {[1,2].map(i => (
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
          marginBottom: "20px",
          animation: "pulse 1.5s ease-in-out infinite"
        }}></div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px"
        }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: "40px",
              height: "32px",
              background: "#E5E7EB",
              borderRadius: "6px",
              animation: "pulse 1.5s ease-in-out infinite"
            }}></div>
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
      height: "auto",
      minHeight: "620px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}>
          <span style={{ fontSize: "24px", marginRight: "10px" }}>📊</span>
          <h2 style={{
            color: "#374151",
            fontSize: "24px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "400",
            margin: 0
          }}>
            Coverage by Module
          </h2>
        </div>
        
        <div style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
          color: "#475569",
          fontWeight: "500"
        }}>
          Showing {startIndex + 1}-{endIndex} of {totalModules} modules
        </div>
      </div>

      {/* Chart */}
      <div style={{
        width: "100%",
        background: "#FAFAFA",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        marginBottom: "20px"
      }}>
        <Chart
          options={chartOptions}
          series={[
            {
              name: 'Current Coverage',
              data: currentPageCurrentData
            },
            {
              name: 'Target Coverage', 
              data: currentPageTargetData
            }
          ]}
          type="bar"
          height={400}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px"
        }}>
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #D1D5DB",
              backgroundColor: currentPage === 1 ? "#F3F4F6" : "#FFFFFF",
              color: currentPage === 1 ? "#9CA3AF" : "#374151",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif"
            }}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                backgroundColor: currentPage === page ? "#3B82F6" : "#FFFFFF",
                color: currentPage === page ? "#FFFFFF" : "#374151",
                cursor: "pointer",
                fontSize: "14px",
                minWidth: "40px",
                fontFamily: "Arial, sans-serif"
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #D1D5DB",
              backgroundColor: currentPage === totalPages ? "#F3F4F6" : "#FFFFFF",
              color: currentPage === totalPages ? "#9CA3AF" : "#374151",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif"
            }}
          >
            Next
          </button>

          <button
            onClick={goToLast}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #D1D5DB",
              backgroundColor: currentPage === totalPages ? "#F3F4F6" : "#8B5CF6",
              color: currentPage === totalPages ? "#9CA3AF" : "#FFFFFF",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontFamily: "Arial, sans-serif"
            }}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverageByModuleChart;