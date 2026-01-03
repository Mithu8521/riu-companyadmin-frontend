import React, { useEffect, useRef, useState } from "react";

const OrganizationDataStatusChart = ({ 
  data, 
  heading,
  reportingUrl  // Default URL, can be overridden via props
}) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize chart when component mounts
  useEffect(() => {
    if (!containerRef.current || !chartRef.current) return;
    setIsReady(true);

    // Handle window resize
    const handleResize = () => {
      if (isReady) {
        drawPieChart();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw chart when ready
  useEffect(() => {
    if (isReady) {
      drawPieChart();
    }
  }, [isReady, data]);

  const drawPieChart = () => {
    const canvas = chartRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get container dimensions safely
    const rect = container.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 300;

    // Set canvas size to match container
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate radius (leave space for title and legend)
    const titleHeight = 40;
    const legendHeight = 60; // Adjusted for legend space
    const legendGap = 15; // Reduced gap between chart and legend
    const padding = 10; // Reduced padding to use more space
    const usableHeight = height - titleHeight - legendHeight - legendGap - padding;
    const usableWidth = width - (padding * 2);
    
    // Center the chart vertically in the available space, but moved up to create gap for legend
    const verticalOffset = 10; // Adjusted to move chart up slightly
    
    const radius = Math.min(usableWidth / 2, usableHeight / 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw title
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(heading, centerX, 20); // Moved down a bit

    // Draw pie chart
    let startAngle = -0.5 * Math.PI; // Start at top

    data.forEach((item) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + verticalOffset);
      ctx.arc(centerX, centerY + verticalOffset, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Add white border
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      // Calculate position for percentage text
      const textRadius = item.percentage < 5 ? radius * 0.85 : radius * 0.65;
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + verticalOffset + textRadius * Math.sin(midAngle);
      
      // Draw percentage text
      const percentText = `${Math.round(item.percentage)}%`;
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percentText, textX, textY);

      startAngle = endAngle;
    });

    // Draw legend at bottom with increased spacing
    const legendY = height - 25; // Position legend lower on the canvas
    const legendSpacing = width / (data.length + 1);
    
    data.forEach((item, index) => {
      const legendX = (index + 1) * legendSpacing;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX - 30, legendY - 8, 16, 16);
      
      // Draw label
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(item.name, legendX - 10, legendY);
    });
  };

  // Handle click to navigate to report
  const handleClick = () => {
    window.location.href = reportingUrl;
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: "100%", 
        height: "100%",
        minHeight: "370px", // Adjusted to match the reduced gap
        maxWidth: "100%", // Ensure it doesn't exceed parent width
        background: "white",
        borderRadius: "10px",
        padding: "5px", // Reduced padding to use more space
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
      }}
      // onMouseOver={(e) => {
      //   e.currentTarget.style.transform = "scale(1.02)";
      //   e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
      // }}
      // onMouseOut={(e) => {
      //   e.currentTarget.style.transform = "scale(1)";
      //   e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
      // }}
    >
      <canvas
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block", // Important to remove any default spacing
        }}
      />
    </div>
  );
};

export default OrganizationDataStatusChart;