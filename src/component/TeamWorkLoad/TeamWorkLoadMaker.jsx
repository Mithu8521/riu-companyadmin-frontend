import React, { useState, useEffect, useRef } from "react";

// TeamWorkLoadMaker component
const TeamWorkLoadMaker = (props) => {
  const orgMakerOtatusData = props.orgMakerOtatusData || [];
  
  // Add container ref to measure actual width
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // State for tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
    value: 0,
    percentage: 0
  });

  // Calculate the maximum value dynamically for scaling
  const calculateMaxValue = () => {
    if (!orgMakerOtatusData || orgMakerOtatusData.length === 0) {
      return 100; // Default max value set to 100
    }
    
    // Make sure to handle any undefined values
    const values = orgMakerOtatusData.map(item => item.value || 0);
    const maxFromData = Math.max(...values);
    
    // Round up to nearest 20 for clean y-axis values
    return Math.ceil(maxFromData / 20) * 20;
  };

  // Helper function to normalize data names for internal use
  const normalizeDataName = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower === "approved") return "approved";
    if (nameLower.includes("revision")) return "revision";
    if (nameLower === "drafts") return "drafts";
    if (nameLower.includes("submitted") || nameLower.includes("review")) return "pending";
    return nameLower;
  };

  // Helper function to get the display name as provided in the data
  const getDisplayName = (normalizedName) => {
    const dataItem = orgMakerOtatusData.find(
      item => normalizeDataName(item.name) === normalizedName
    );
    return dataItem ? dataItem.name : normalizedName;
  };

  // Helper function to get the bar color based on type
  const getBarColor = (normalizedType) => {
    // First check if we have a matching item in the data with a color
    const dataItem = orgMakerOtatusData.find(
      item => normalizeDataName(item.name) === normalizedType
    );
    
    if (dataItem && dataItem.color) {
      return dataItem.color;
    }
    
    // Fallback colors if not specified in data
    switch(normalizedType) {
      case "pending": return "#0000FF"; // Blue for Pending/Submitted
      case "approved": return "#2e7d32"; // Green for Approved
      case "revision": return "#f0a030"; // Orange for Requires Revision
      case "rejected": return "#f44336"; // Red for Rejected
      case "drafts": return "#808080"; // Gray for Drafts
      default: return "#0000FF"; // Default light blue/gray
    }
  };

  // Get the actual data value for a normalized type
  const getDataForType = (normalizedType) => {
    return orgMakerOtatusData.find(
      item => normalizeDataName(item.name) === normalizedType
    ) || { value: 0, percentage: 0 };
  };

  // Get the label text for first line of multi-line labels
  const getBarLabelFirstLine = (normalizedType) => {
    const displayName = getDisplayName(normalizedType);
    
    // Handle multi-word display names by splitting at first space
    if (displayName.includes(" ")) {
      const parts = displayName.split(" ");
      if (parts.length > 2) {
        // For names with more than 2 words, return first word
        return parts[0];
      } else {
        return parts[0];
      }
    }
    
    return displayName;
  };

  // Get the label text for second line of multi-line labels
  const getBarLabelSecondLine = (normalizedType) => {
    const displayName = getDisplayName(normalizedType);
    
    // Handle multi-word display names
    if (displayName.includes(" ")) {
      const parts = displayName.split(" ");
      if (parts.length > 2) {
        // For names with more than 2 words, return second word
        return parts[1];
      } else if (parts.length === 2) {
        return parts[1];
      }
    }
    
    return "";
  };

  // Get the label text for third line of multi-line labels
  const getBarLabelThirdLine = (normalizedType) => {
    const displayName = getDisplayName(normalizedType);
    
    // Handle multi-word display names
    if (displayName.includes(" ")) {
      const parts = displayName.split(" ");
      if (parts.length > 2) {
        // For names with more than 2 words, return remaining words
        return parts.slice(2).join(" ");
      }
    }
    
    return "";
  };

  // Get full label text for tooltips (use the original name)
  const getFullLabel = (normalizedType) => {
    return getDisplayName(normalizedType);
  };

  // Handler for mouse enter (show tooltip)
  const handleMouseEnter = (event, normalizedType) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dataItem = getDataForType(normalizedType);
    const fullLabel = getFullLabel(normalizedType);
    
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: fullLabel,
      value: dataItem.value,
      percentage: dataItem.percentage
    });
  };

  // Handler for mouse leave (hide tooltip)
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };
  
  // Get reporting URL for the bar type
  const getReportingUrl = (type) => {
    return '/#/reporting-modules/all-module';
  };

  // Handler for bar click - Navigate to the specified URL
  const handleBarClick = (type) => {
    const url = getReportingUrl(type);
    window.location.href = url;
  };

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.clientWidth);
      }
    };

    // Initial measurement
    updateWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateWidth);
    
    // Clean up
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Render the chart with grid lines and y-axis
  const renderBarChart = () => {
    // Fixed chart dimensions
    const chartHeight = 500;
    const leftMargin = 70;
    const rightMargin = 40; // Added right margin
    const bottomMargin = 80;
    const topMargin = 70;
    const barWidth = 50;
    
    // Define the desired order of bars based on normalized names
    // Match the order to the normalized names in your data
    const orderedBarTypes = ["pending", "approved", "revision", "drafts"];
    
    // Create a mapping of normalized names to data items that exist in the provided data
    const existingTypes = orgMakerOtatusData.map(item => normalizeDataName(item.name));
    
    // Filter and sort the data based on the predefined order
    const barTypes = orderedBarTypes.filter(type => 
      // Only include types that exist in the data
      existingTypes.includes(type)
    );
    
    // If there's no data after filtering, use all types that exist in the data
    if (barTypes.length === 0) {
      barTypes.push(...existingTypes);
    }
    
    // Use actual measured container width for responsive layout
    // Fall back to 680px if measurement not available yet
    const chartWidth = (containerWidth || 680) - rightMargin;
    
    // Auto-adjustable gap calculation based on actual container width
    const totalBars = barTypes.length;
    const availableWidth = chartWidth - leftMargin - (barWidth * totalBars);
    const gapBetweenBars = Math.max(20, availableWidth / (totalBars + 1)); // Minimum 20px gap
    
    // Dynamic yAxisMax based on data
    const yAxisMax = calculateMaxValue();
    
    // Create y-axis ticks with 20-unit intervals for cleaner appearance
    const yAxisTicks = [];
    for (let i = 0; i <= yAxisMax; i += 20) {
      yAxisTicks.push(i);
    }
    
    // Calculate scale factor to normalize bar heights
    const scaleFactor = (chartHeight - topMargin - bottomMargin) / yAxisMax;

    return (
      <div 
        className="chart-container" 
        style={{ 
          position: 'relative',
          height: `${chartHeight}px`,
          width: '100%',
          margin: '0 auto',
          paddingRight: `${rightMargin}px`, // Add padding on the right side
        }}
        ref={chartContainerRef}
      >
        {/* Chart Title */}
        <div style={{
          position: 'absolute',
          top: '10px',
          width: '100%',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
        }}>
          Maker (Data Entry/Submission Role)
        </div>

        {/* Y-axis title */}
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'rotate(-90deg) translateX(-50%)',
          transformOrigin: 'left center',
          fontSize: '14px',
          width: '120px',
          textAlign: 'center',
        }}>
          Number of Entries
        </div>

        {/* Y-axis grid lines and labels */}
        <div style={{
          position: 'absolute',
          left: leftMargin,
          top: topMargin,
          height: `${chartHeight - topMargin - bottomMargin}px`,
          width: `${chartWidth - leftMargin}px`,
          background: 'linear-gradient(to bottom, rgba(240, 240, 240, 0.3) 1px, transparent 1px)',
          backgroundSize: `100% ${(chartHeight - topMargin - bottomMargin) / (yAxisTicks.length - 1)}px`,
        }}>
          {/* Grid lines */}
          {yAxisTicks.map((value) => (
            <div key={value} style={{
              position: 'absolute',
              left: '0',
              top: `${chartHeight - bottomMargin - (value * scaleFactor) - topMargin}px`,
              width: '100%',
              borderTop: '1px solid #ddd',
            }}>
              <span style={{
                position: 'absolute',
                left: '-45px',
                top: '-10px',
                fontSize: '14px',
                color: '#666',
                width: '40px',
                textAlign: 'right',
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom border (x-axis) */}
        <div style={{
          position: 'absolute',
          left: leftMargin,
          top: `${chartHeight - bottomMargin}px`,
          width: `${chartWidth - leftMargin}px`,
          borderTop: '1px solid #000',
        }}></div>
        
        {/* Vertical grid lines - UPDATED TO BE MORE BOLD with right border */}
        <div style={{
          position: 'absolute',
          left: leftMargin,
          top: topMargin,
          height: `${chartHeight - topMargin - bottomMargin}px`,
          width: `${chartWidth - leftMargin}px`,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px)',
          backgroundSize: `${(chartWidth - leftMargin) / 10}px 100%`,
          pointerEvents: 'none', // To prevent interference with bar interactions
          zIndex: 5, // Ensure the grid lines appear above other elements
          borderRight: '2px solid rgba(0, 0, 0, 0.2)' // Add right border to close the grid
        }}></div>

        {/* Bars */}
        <div style={{
          position: 'absolute',
          left: leftMargin,
          top: topMargin,
          height: `${chartHeight - topMargin - bottomMargin}px`,
          width: `${chartWidth - leftMargin}px`,
        }}>
          {barTypes.map((normalizedType, index) => {
            // Get data for this type
            const dataItem = getDataForType(normalizedType);
            
            // Use data values
            const value = dataItem.value;
            const percentage = dataItem.percentage;
            
            const barHeight = value * scaleFactor;
            // Calculate position with auto-adjustable gaps
            const leftPosition = gapBetweenBars * (index + 1) + (barWidth * index);
            
            return (
              <div 
                key={normalizedType} 
                style={{
                  position: 'absolute',
                  left: `${leftPosition}px`,
                  bottom: '0',
                  width: `${barWidth}px`,
                  height: `${Math.max(barHeight, 1)}px`, // Minimum height for visibility
                  backgroundColor: getBarColor(normalizedType),
                  cursor: 'pointer',
                  transition: 'left 0.3s ease', // Smooth transition when spacing changes
                }}
                onMouseEnter={(e) => handleMouseEnter(e, normalizedType)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleBarClick(normalizedType)} // Add click handler for navigation
              >
                {/* Value label on top of bar */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels - using multi-line labels */}
        <div style={{
          position: 'absolute',
          left: leftMargin,
          top: `${chartHeight - bottomMargin + 10}px`,
          width: `${chartWidth - leftMargin}px`,
        }}>
          {barTypes.map((normalizedType, index) => {
            // Calculate position with auto-adjustable gaps (same as bars)
            const labelPosition = gapBetweenBars * (index + 1) + (barWidth * index);
            
            return (
              <div key={normalizedType} style={{
                position: 'absolute',
                left: `${labelPosition}px`, 
                width: `${barWidth}px`,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'left 0.3s ease', // Smooth transition when spacing changes
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '1.2',
                }}>
                  {getBarLabelFirstLine(normalizedType)}
                </div>
                {getBarLabelSecondLine(normalizedType) && (
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.2',
                    marginTop: '2px',
                  }}>
                    {getBarLabelSecondLine(normalizedType)}
                  </div>
                )}
                {getBarLabelThirdLine(normalizedType) && (
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.2',
                    marginTop: '2px',
                  }}>
                    {getBarLabelThirdLine(normalizedType)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div 
            style={{
              position: 'fixed',
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              pointerEvents: 'none',
              zIndex: 1000,
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{tooltip.content}</div>
            <div>Value: {tooltip.value}</div>
            <div>Percentage: {tooltip.percentage}%</div>
            <div style={{ fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
              Click to view detailed report
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <div style={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {renderBarChart()}
      </div>
    </div>
  );
};

export default TeamWorkLoadMaker;