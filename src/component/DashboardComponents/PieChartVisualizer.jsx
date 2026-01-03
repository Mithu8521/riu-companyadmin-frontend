import React, { useState } from "react";

const PieChartVisualizer = ({ pieData, noDataToDisplay, unit }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Format value for display with appropriate units
  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else if (value === 0) {
      return "0";
    } else if (value < 1) {
      return value.toFixed(1);
    } else {
      return value.toFixed(1);
    }
  };

  // Add small gaps between segments (if there's more than one segment)
  const adjustSegmentsWithGaps = (segments, gapDegrees = 1) => {
    if (!segments || segments.length === 0) return [];
    
    // If there's only one segment, return a full circle (360 degrees)
    if (segments.length === 1) {
      return [{
        ...segments[0],
        originalStartAngle: 0,
        originalEndAngle: 360,
        startAngle: 0,
        endAngle: 360
      }];
    }
    
    return segments.map((segment) => {
      // Calculate the size of this segment
      const segmentSize = segment.endAngle - segment.startAngle;
      
      // Use a proportional gap (smaller segments get smaller gaps)
      const proportionalGap = Math.min(gapDegrees, segmentSize * 0.05);
      
      // Create adjusted segment with gaps on both sides
      return {
        ...segment,
        originalStartAngle: segment.startAngle, // save original for reference
        originalEndAngle: segment.endAngle,     // save original for reference
        startAngle: segment.startAngle + proportionalGap/2,
        endAngle: segment.endAngle - proportionalGap/2
      };
    });
  };

  // Generate SVG path for a pie slice
  const generateWedgePath = (centerX, centerY, radius, startAngle, endAngle) => {
    // For full circle (single element case)
    if (startAngle === 0 && endAngle === 360) {
      return `M ${centerX} ${centerY - radius} 
              A ${radius} ${radius} 0 1 1 ${centerX - 0.01} ${centerY - radius} 
              Z`;
    }
    
    // Convert angles from degrees to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate points
    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);
    
    // Determine if the arc is large (> 180 degrees)
    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
    
    // Create the SVG path
    return [
      `M ${centerX},${centerY}`,
      `L ${startX},${startY}`,
      `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
      'Z'
    ].join(' ');
  };

  // Modified to handle 2-line truncation
  const formatLegendText = (text, charsPerLine = 15, maxLines = 2) => {
    if (!text) return [""];
    
    // If text is short enough to fit on one line
    if (text.length <= charsPerLine) {
      return [text];
    }
    
    // Create lines based on word boundaries
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      
      // If adding this word exceeds the line limit
      if (testLine.length > charsPerLine) {
        lines.push(currentLine);
        currentLine = word;
        
        // If we've reached our maximum number of lines
        if (lines.length >= maxLines - 1) {
          // Add the remaining words to the last line
          for (let j = i + 1; j < words.length; j++) {
            currentLine += ' ' + words[j];
          }
          
          // If the last line is too long, truncate it
          if (currentLine.length > charsPerLine) {
            currentLine = currentLine.substring(0, charsPerLine - 3) + '...';
          }
          
          lines.push(currentLine);
          return lines;
        }
      } else {
        currentLine = testLine;
      }
    }
    
    // Add the final line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const normalizedPieData = pieData.length === 1 && !pieData[0].hasOwnProperty('startAngle') ? 
    [{
      ...pieData[0],
      startAngle: 0,
      endAngle: 360,
      percentage: 100
    }] : pieData;
    
  // Process the pie data to add gaps
  const segmentsWithGaps = adjustSegmentsWithGaps(normalizedPieData);
  
  // Calculate chart dimensions dynamically based on container
  const viewBoxSize = 320;
  const centerPoint = viewBoxSize / 2;
  const chartRadius = Math.min(centerPoint * 0.95, 150); // Limit max radius but keep it responsive
  
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row", 
      alignItems: "center", 
      justifyContent: "space-between",
      width: "100%"
    }}>
    { noDataToDisplay ?(
      <div style={{ 
        flex: "1", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            aspectRatio: "1",
            margin: "0 auto",
            position: "relative",
            background: "#f0f0f0",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
        
        </div>
      </div>
    ):
      <div style={{ flex: "0 0 68%" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            aspectRatio: "1",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            style={{
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            {/* White background */}
            <rect x="0" y="0" width={viewBoxSize} height={viewBoxSize} fill="white" />
            
            {/* Pie slices with gaps */}
            {segmentsWithGaps.map((segment, index) => (
              <path
                key={index}
                d={generateWedgePath(centerPoint, centerPoint, chartRadius, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                onMouseEnter={() => setHoveredSegment(segment.key)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{ cursor: "pointer" }}
              />
            ))}
            
            {/* Percentage Labels */}
            {segmentsWithGaps.map((segment, index) => {
              // Always show label for single element
              if (segmentsWithGaps.length > 1 && segment.percentage < 5) return null;
              
              // Calculate the middle angle of the original segment (for label placement)
              const midAngle = segmentsWithGaps.length === 1 ? 
                90 : // Top center for single element
                (segment.originalStartAngle + segment.originalEndAngle) / 2;
              const midAngleRad = (midAngle * Math.PI) / 180;
              const labelDistance = 0.65; // 65% from center to edge
              
              // Calculate the position
              const x = centerPoint + labelDistance * chartRadius * Math.cos(midAngleRad);
              const y = centerPoint + labelDistance * chartRadius * Math.sin(midAngleRad);
              
              return (
                <text
                  key={index}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontWeight="bold"
                  fontSize="14px"
                  style={{ 
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    pointerEvents: "none" 
                  }}
                >
                  {segment.percentage.toFixed(1)}%
                </text>
              );
            })}
          </svg>

          {/* Hover tooltip - only show when hovering */}
          {hoveredSegment && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "14px",
                pointerEvents: "none",
                zIndex: 10,
                textAlign: "center",
                minWidth: "150px",
              }}
            >
              {(() => {
                const segment = normalizedPieData.find(
                  (item) => item.key === hoveredSegment
                );
                if (!segment) return null;
                return (
                  <>
                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                      {segment.label}
                    </div>
                    <div>
                      {formatValue(segment.value)} {unit}
                    </div>
                    <div>({segment.percentage.toFixed(1)}%)</div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>}

    
      <div style={{ 
        flex: "0 0 32%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: "20px"
      }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "100%",
          }}
        >
          {normalizedPieData.map((segment, index) => {
            // Format the label into max 2 lines
            const formattedLines = formatLegendText(segment.label, 15, 2);
            
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start", // Changed from center to flex-start for multi-line text
                  cursor: "pointer",
                  opacity:
                    hoveredSegment && hoveredSegment !== segment.key ? 0.7 : 1,
                  transition: "opacity 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredSegment(segment.key)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: segment.color,
                    marginRight: "12px",
                    marginTop: "4px",
                  }}
                ></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: "14px", fontWeight: "500", lineHeight: "1.2" }}>
                    {formattedLines.map((line, lineIndex) => (
                      <div key={lineIndex}>{line}</div>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                    {formatValue(segment.value)} {unit} ({segment.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChartVisualizer;