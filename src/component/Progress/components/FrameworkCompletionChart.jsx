import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const FrameworkCompletionChart = ({
  chartData = null,
  loading = false,
  title = "Framework Completion by Location",
  icon = "📊",
  description = "Compare framework progress",
  emptyStateMessage = "Select frameworks to view the completion chart.",
  emptyStateIcon = "📍",
  filenamePrefix = "framework-completion"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 locations per page

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [chartData]);

  // Default empty state
  if (!chartData || !chartData.series || chartData.series.length === 0 || !chartData.categories || chartData.categories.length === 0) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "620px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
          {emptyStateIcon}
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Data Available
        </h3>
        <p style={{
          color: "#6B7280",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: "1.5"
        }}>
          {emptyStateMessage}
        </p>
      </div>
    );
  }

  // Calculate pagination for chart data
  const totalItems = chartData.categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Pagination handlers - same pattern as AuditorWorkload
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToLast = () => goToPage(totalPages);

  // Prepare paginated chart data
  const getPaginatedChartData = () => {
    // Slice categories for current page
    const paginatedCategories = chartData.categories.slice(startIndex, endIndex);

    // Slice all series data to match the categories
    const paginatedSeries = chartData.series.map(series => ({
      ...series,
      data: series.data.slice(startIndex, endIndex)
    }));

    return {
      categories: paginatedCategories,
      series: paginatedSeries
    };
  };

  const paginatedChartData = getPaginatedChartData();

  // Enhanced chart configuration - clean and simple
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
            filename: `${filenamePrefix}-page-${currentPage}`,
          },
          svg: {
            filename: `${filenamePrefix}-page-${currentPage}`,
          },
          png: {
            filename: `${filenamePrefix}-page-${currentPage}`,
          }
        }
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
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
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
      show: false,
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: paginatedChartData.categories,
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 500,
          colors: '#374151',
          fontFamily: 'Arial, sans-serif'
        },
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
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
    colors: [
      '#6366F1', // BRSR - Blue
      '#8B5CF6', // GRI - Purple  
      '#10B981', // CDP - Green
      '#F59E0B', // SASB - Amber
      '#EF4444', // Red
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316'  // Orange
    ],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 0,
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
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        },
        xaxis: {
          labels: {
            rotate: 0,
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    }]
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        height: "720px", // Increased height to account for pagination
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px"
        }}>
          <div style={{
            width: "200px",
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
      height: "auto",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {/* Header - exact match to image */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>{icon}</span>
        <h2 style={{
          color: "#374151",
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "400",
          margin: 0
        }}>
          {title}
        </h2>
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
          series={paginatedChartData.series}
          type="bar"
          height={totalPages > 1 ? 412 : 450}
        />
      </div>

      {/* Pagination Info */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <span style={{
          fontSize: "14px",
          color: "#6B7280",
          fontFamily: "Arial, sans-serif"
        }}>
          Showing {startIndex + 1}-{endIndex} of {totalItems} locations
        </span>
      </div>

      {/* Pagination - Only show if more than one page */}
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

export default FrameworkCompletionChart;