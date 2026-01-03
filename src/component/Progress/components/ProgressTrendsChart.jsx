import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const ProgressTrendsChart = ({
  chartData = null,
  loading = false,
  title = "Progress Trends",
  icon = "📊",
  description = "Track progress evolution over time",
  chartType = "area",
  emptyStateMessage = "Select data to view progress trends over time",
  enableDataLabels = false,
  useComplexColors = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 time periods per page for better trend visualization

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [chartData]);

  // Color generation logic
  const generateColors = (seriesLength) => {
    // For periods chart - simple color scheme
    return [
      '#6366F1', // Blue (BRSR style)
      '#10B981', // Green (CDP style)
      '#8B5CF6', // Purple (GRI style)
      '#F59E0B', // Amber (SASB style)
      '#EF4444', // Red
      '#06B6D4', // Cyan
      '#84CC16'  // Lime
    ];
  };

  // Default empty state
  if (!chartData || !chartData.series || chartData.series.length === 0 || !chartData.categories || chartData.categories.length === 0) {
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
          📊
        </div>
        <h3 style={{
          fontSize: "24px",
          color: "#374151",
          marginBottom: "12px",
          fontWeight: "600"
        }}>
          No Trend Data Available
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

  // Calculate pagination for time periods
  const totalItems = chartData.categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Pagination handlers - same pattern as previous components
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToLast = () => goToPage(totalPages);

  // Prepare paginated chart data for time series
  const getPaginatedChartData = () => {
    // Slice categories (time periods) for current page
    const paginatedCategories = chartData.categories.slice(startIndex, endIndex);

    // Slice all series data to match the time periods
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

  // Chart configuration - clean and simple
  const chartOptions = {
    chart: {
      type: "area",
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
        shadeIntensity: 0.2,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
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
      categories: paginatedChartData.categories,
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
      }
    },
    yaxis: {
      title: {
        text: 'Progress Percentage (%)',
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
    colors: generateColors(paginatedChartData.series.length),
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
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif'
      },
      y: {
        formatter: function (val, { seriesIndex }) {
          if (chartType === 'area' && paginatedChartData.series[seriesIndex]) {
            const seriesName = paginatedChartData.series[seriesIndex].name;
            return `${seriesName}: ${val}%`;
          }
          return val + '%';
        }
      },
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
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
        height: "620px", // Increased height for pagination
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
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
                width: "100px",
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
      minHeight: "620px", // Increased height to accommodate pagination
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
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
          type="area"
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
          Showing periods {startIndex + 1}-{endIndex} of {totalItems} time periods
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

export default ProgressTrendsChart;