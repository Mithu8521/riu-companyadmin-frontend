import React, { useRef, useEffect, useState } from "react";

const KPIreporting = ({ makerVsChecker }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 }); // Larger default dimensions
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Only update if we have actual dimensions and they're different from current
        if (
          width > 0 &&
          height > 0 &&
          (width !== dimensions.width || height !== dimensions.height)
        ) {
          setDimensions({ width, height });
        }
      }
    };

    // Initial measurement with a slight delay to ensure DOM is ready
    setTimeout(updateDimensions, 100);

    // Also measure on resize
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateDimensions);
  }, [dimensions.width, dimensions.height]);

  // Chart configuration - improved to match the image
  const chartConfig = {
    width: dimensions.width,
    height: dimensions.height,
    paddingTop: 93, // More space for title, legend, and value labels
    paddingBottom: Math.max(dimensions.height * 0.12, 40), // Space for horizontal x-axis labels
    paddingLeft: Math.max(dimensions.width * 0.08, 50),
    paddingRight: Math.max(dimensions.width * 0.05, 30),
    barWidth: Math.min(
      Math.max(dimensions.width / (makerVsChecker.length * 5), 15),
      25
    ), // Wider bars
    barSpacing: 2, // Small gap between maker and checker bars
    groupSpacing: 10, // Space between category groups
    maxYValue: 100,
    yAxisTicks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    colors: {
      maker: "#0000FF", // Blue as in the image
      checker: "#008000", // Green as in the image
    },
  };

  // Calculated values
  const chartInnerWidth =
    chartConfig.width - chartConfig.paddingLeft - chartConfig.paddingRight;
  const chartInnerHeight =
    chartConfig.height - chartConfig.paddingTop - chartConfig.paddingBottom;
  const barGroupWidth =
    chartInnerWidth / makerVsChecker.length - chartConfig.groupSpacing;

  // Render y-axis with grid lines
  const renderYAxis = () => {
    return (
      <div
        className="y-axis"
        style={{
          position: "absolute",
          left: chartConfig.paddingLeft - 5,
          top: chartConfig.paddingTop,
          height: chartInnerHeight,
          width: 30,
        }}
      >
        {chartConfig.yAxisTicks.map((tick) => {
          const yPos = chartInnerHeight - (tick / 100) * chartInnerHeight;
          return (
            <div
              key={tick}
              style={{
                position: "absolute",
                left: -30,
                top: yPos - 6,
                width: "100%",
                textAlign: "right",
                fontSize: "12px", // Slightly larger
                fontWeight: "400",
                color: "#333",
              }}
            >
              {tick}
            </div>
          );
        })}
      </div>
    );
  };

  // Render grid lines
  const renderGridLines = () => {
    return (
      <div
        className="grid-lines"
        style={{
          position: "absolute",
          left: chartConfig.paddingLeft,
          top: chartConfig.paddingTop,
          height: chartInnerHeight,
          width: chartInnerWidth,
        }}
      >
        {chartConfig.yAxisTicks.map((tick) => {
          const yPos = chartInnerHeight - (tick / 100) * chartInnerHeight;
          return (
            <div
              key={tick}
              style={{
                position: "absolute",
                left: 0,
                top: yPos,
                width: "100%",
                borderTop: "1px solid #ddd",
                zIndex: 0,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Custom tooltip component
  const renderTooltip = () => {
    if (!hoveredItem) return null;

    const { item, position } = hoveredItem;

    return (
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -100%)",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 100,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {item.category}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <div>
            <span
              style={{ color: chartConfig.colors.maker, fontWeight: "bold" }}
            >
              Maker:
            </span>{" "}
            {`${item.makerValue} (${item.makerProgress}%)`}
          </div>
          <div>
            <span
              style={{ color: chartConfig.colors.checker, fontWeight: "bold" }}
            >
              Checker:
            </span>{" "}
            {`${item.checkerValue} (${item.checkerProgress}%)`}
          </div>
        </div>
      </div>
    );
  };

  // Render bars - updated to match the image styling with hover effects
  const renderBars = () => {
    return (
      <div
        className="bars"
        style={{
          position: "absolute",
          left: chartConfig.paddingLeft,
          top: chartConfig.paddingTop,
          height: chartInnerHeight,
          width: chartInnerWidth,
          zIndex: 1,
        }}
      >
        {makerVsChecker.map((item, index) => {
          const makerBarHeight = (item.makerProgress / 100) * chartInnerHeight;
          const checkerBarHeight =
            (item.checkerProgress / 100) * chartInnerHeight;

          // Calculate position for the bar group with proper spacing
          const barGroupLeft =
            index * (barGroupWidth + chartConfig.groupSpacing);

          // Calculate widths for consistent sizing
          const makerBarWidth = barGroupWidth / 2 - chartConfig.barSpacing / 2;
          const checkerBarWidth =
            barGroupWidth / 2 - chartConfig.barSpacing / 2;

          return (
            <div
              key={item.category + "-" + index}
              style={{
                position: "absolute",
                left: barGroupLeft,
                bottom: 0,
                width: barGroupWidth,
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const containerRect =
                  containerRef.current.getBoundingClientRect();
                setHoveredItem({
                  item,
                  position: {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y:
                      chartConfig.paddingTop +
                      chartInnerHeight -
                      Math.max(makerBarHeight, checkerBarHeight) -
                      10,
                  },
                });
              }}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Maker Bar - Blue */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: makerBarWidth,
                  height: makerBarHeight,
                  backgroundColor: chartConfig.colors.maker,
                }}
              >
                {/* Maker value label */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                    top: -20, // Position above the bar
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {item.makerValue || item.makerProgress}
                </div>
              </div>

              {/* Checker Bar - Green */}
              <div
                style={{
                  position: "absolute",
                  left: makerBarWidth + chartConfig.barSpacing,
                  bottom: 0,
                  width: checkerBarWidth,
                  height: checkerBarHeight,
                  backgroundColor: chartConfig.colors.checker,
                }}
              >
                {/* Checker value label */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                    top: -20, // Position above the bar
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {item.checkerValue || item.checkerProgress}
                </div>
              </div>

              {/* X-axis label - horizontal display with hover effect */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -30,
                  width: barGroupWidth,
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "500",
                  transform: "none", // No rotation/tilt
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "default",
                }}
                title={item.category} // Native browser tooltip on hover
              >
                {item.category}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render legend - horizontal display with color blocks
  const renderLegend = () => {
    return (
      <div
        className="legend"
        style={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)", // Center horizontally
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          flexDirection: "row", // Ensure horizontal layout
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 15,
              height: 15,
              backgroundColor: chartConfig.colors.maker,
            }}
          ></div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              position: "relative",
            }}
            title="Maker Progress"
          >
            Maker Progress
            <span
              style={{
                visibility: "hidden",
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                zIndex: 100,
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              className="tooltip"
            >
              Maker Progress
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 15,
              height: 15,
              backgroundColor: chartConfig.colors.checker,
            }}
          ></div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              position: "relative",
            }}
            title="Checker Progress"
          >
            Checker Progress
            <span
              style={{
                visibility: "hidden",
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                zIndex: 100,
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              className="tooltip"
            >
              Checker Progress
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render chart title
  const renderTitle = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontSize: "1.29rem",
          fontWeight: "500",
        }}
      >
        Data Entry Progress: Maker vs Checker
      </div>
    );
  };

  // Y-axis label
  const renderYAxisLabel = () => {
    return (
      <div
        style={{
          position: "absolute",
          left: 50,
          top: chartConfig.paddingTop + chartInnerHeight / 2+100,
          transform: "rotate(-90deg) translateX(50%)",
          transformOrigin: "left center",
          fontWeight: "400",
        }}
      >
        Percentage(%)
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "500px", // Ensure minimum height
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      {renderTitle()}
      {renderGridLines()}
      {renderYAxis()}
      {renderYAxisLabel()}
      {renderBars()}
      {renderLegend()}
      {renderTooltip()}
    </div>
  );
};

export default KPIreporting;
