import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const DataOwnerWorkLoad = ({ user, teamWorkloadData }) => {
  const [activeLegend, setActiveLegend] = useState(() => {
    const baseLegend = ["Submitted", "Approved", "Revision Required", "Drafts"];
    return baseLegend;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [teamWorkloadData]);

  const handleLegendClick = (legendType) => {
    if (activeLegend.includes(legendType)) {
      setActiveLegend(activeLegend.filter((item) => item !== legendType));
    } else {
      setActiveLegend([...activeLegend, legendType]);
    }
  };

  // Filter data to show only items with data
  const filteredData = teamWorkloadData?.filter(item => {
    const isUser = user === "user";
    return isUser ? 
      item?.totalAssignedQuestionForAnswered !== 0 : 
      item?.totalAssignedQuestionForAudit !== 0;
  }) || [];

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToLast = () => goToPage(totalPages);

  // Prepare chart data to match the exact design
  const prepareChartData = () => {
    const categories = currentPageData.map(item => 
      `${item.firstName} ${item.lastName}`
    );

    const isUser = user === "user";
    const series = [];
    let maxValue = 0;

    // Submitted (Blue) - maps to "answered" for users, or can be a calculated field
    if (activeLegend.includes("Submitted")) {
      const submittedData = currentPageData.map(item => {
        if (isUser) {
          return Number(item?.answered) || 0;
        } else {
          // For audit mode, we can use accepted + rejected as submitted
          return (Number(item?.accepted) || 0) + (Number(item?.rejected) || 0);
        }
      });

      maxValue = Math.max(maxValue, ...submittedData);

      series.push({
        name: 'Submitted',
        data: submittedData,
        color: '#6366F1'
      });
    }

    // Approved (Green) - maps to "accepted"
    if (activeLegend.includes("Approved")) {
      const approvedData = currentPageData.map(item => {
        if (isUser) {
          return Number(item?.finalAssignQuesionAccpted) || 0;
        } else {
          return Number(item?.accepted) || 0;
        }
      });

      maxValue = Math.max(maxValue, ...approvedData);

      series.push({
        name: 'Approved',
        data: approvedData,
        color: '#22C55E'
      });
    }

    // Revision Required (Yellow/Orange) - maps to "rejected"
    if (activeLegend.includes("Revision Required")) {
      const revisionData = currentPageData.map(item => {
        if (isUser) {
          return Number(item?.finalAssignQuesionRejected) || 0;
        } else {
          return Number(item?.rejected) || 0;
        }
      });

      maxValue = Math.max(maxValue, ...revisionData);

      series.push({
        name: 'Revision Required',
        data: revisionData,
        color: '#F59E0B'
      });
    }

    // Drafts (Teal) - maps to "not-responded"
    if (activeLegend.includes("Drafts")) {
      const draftsData = currentPageData.map(item => {
        if (isUser) {
          return Number(0);
        } else {
          return Number(item?.notResponded || 0);
        }
      });

      maxValue = Math.max(maxValue, ...draftsData);

      series.push({
        name: 'Drafts',
        data: draftsData,
        color: '#06B6D4'
      });
    }

    // Add some padding to the max value and round to nearest 5 for clean Y-axis
    const paddedMax = Math.ceil(maxValue * 1.1);
    const dynamicMax = Math.ceil(paddedMax / 5) * 5; // Round up to nearest 5

    return { categories, series, dynamicMax };
  };

  const { categories, series, dynamicMax } = prepareChartData();

  // Chart configuration - clean and simple
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: false, // Grouped bars, not stacked
      toolbar: {
        show: false // Remove toolbar completely
      },
      fontFamily: 'Arial, sans-serif',
      background: 'transparent',
      events: {
        dataPointSelection: function(event, chartContext, config) {
          const dataPointIndex = config.dataPointIndex;
          const seriesIndex = config.seriesIndex;
          const selectedItem = currentPageData[dataPointIndex];
          
          // Handle navigation based on the clicked segment
          console.log('Clicked:', { dataPointIndex, seriesIndex, selectedItem });
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '75%',
        borderRadius: 2,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 400,
          colors: '#374151',
          fontFamily: 'Arial, sans-serif'
        },
        rotate: -45,
        rotateAlways: true,
        offsetY: -5,
        maxHeight: 60
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
        text: '',
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
          colors: '#6B7280',
          fontFamily: 'Arial, sans-serif'
        },
        formatter: function (val) {
          return Math.floor(val); // Ensure no decimals on Y-axis
        }
      },
      min: 0,
      max: dynamicMax || 10, // Use dynamic max, fallback to 10 if no data
      forceNiceScale: true, // This helps create nice round numbers
      decimalsInFloat: 0 // No decimal places
    },
    colors: ['#6366F1', '#22C55E', '#F59E0B', '#06B6D4'],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    legend: {
      show: false // We'll use custom legend
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
        bottom: -10,
        left: 20
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif'
      },
      y: {
        formatter: function(val, opts) {
          return val + ' items';
        }
      }
    }
  };

  // Empty state
  if (!teamWorkloadData || teamWorkloadData.length === 0 || filteredData.length === 0) {
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
          📊
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
          Assign tasks to data owners to view performance analytics.
        </p>
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
      {/* Header - exact match to image */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>📋</span>
        <h2 style={{
          color: "#374151",
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "400",
          margin: 0
        }}>
          Data Owner Performance Analytics
        </h2>
      </div>

      {/* Legend - exact match to image */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: activeLegend.includes("Submitted") ? 1 : 0.5
          }}
          onClick={() => handleLegendClick("Submitted")}
        >
          <div style={{
            width: "16px",
            height: "16px",
            backgroundColor: "#6366F1",
            marginRight: "8px",
            borderRadius: "2px"
          }}></div>
          <span style={{ fontSize: "14px", color: "#374151", fontFamily: "Arial, sans-serif" }}>Submitted</span>
        </div>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: activeLegend.includes("Approved") ? 1 : 0.5
          }}
          onClick={() => handleLegendClick("Approved")}
        >
          <div style={{
            width: "16px",
            height: "16px",
            backgroundColor: "#22C55E",
            marginRight: "8px",
            borderRadius: "2px"
          }}></div>
          <span style={{ fontSize: "14px", color: "#374151", fontFamily: "Arial, sans-serif" }}>Approved</span>
        </div>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: activeLegend.includes("Revision Required") ? 1 : 0.5
          }}
          onClick={() => handleLegendClick("Revision Required")}
        >
          <div style={{
            width: "16px",
            height: "16px",
            backgroundColor: "#F59E0B",
            marginRight: "8px",
            borderRadius: "2px"
          }}></div>
          <span style={{ fontSize: "14px", color: "#374151", fontFamily: "Arial, sans-serif" }}>Revision Required</span>
        </div>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: activeLegend.includes("Drafts") ? 1 : 0.5
          }}
          onClick={() => handleLegendClick("Drafts")}
        >
          <div style={{
            width: "16px",
            height: "16px",
            backgroundColor: "#06B6D4",
            marginRight: "8px",
            borderRadius: "2px"
          }}></div>
          <span style={{ fontSize: "14px", color: "#374151", fontFamily: "Arial, sans-serif" }}>Drafts</span>
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
          series={series}
          type="bar"
          height={400}
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
          Showing {startIndex + 1}-{endIndex} of {totalItems} data owners
        </span>
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

export default DataOwnerWorkLoad;