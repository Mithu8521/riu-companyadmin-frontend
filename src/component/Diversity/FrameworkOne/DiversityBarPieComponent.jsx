import React from "react";
import img from "../../../img/no.png";

const GenderDistributionPieChart = ({
  title = "Overall Employees Gender Distribution",
  dataOne,
}) => {
  console.log(dataOne, title, "sadaedwedwdewq");
  // Initialize state hook at the top level of the function component
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  if (!dataOne || dataOne.length === 0) {
    return (
      <div className="container">
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  // Process data similar to the bar chart component
  const categories = dataOne.reduce((acc, item) => {
    if (item.question_details) {
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "column1")
        .map((detail) => detail.option);

      if (filteredOptions.length === 0) {
        filteredOptions = item.question_details
          .filter((detail) => detail.option_type === "column")
          .map((detail) => detail.option);
      }

      return acc.concat(filteredOptions);
    }

    return acc;
  }, []);

  const uniqueCategories = [...new Set(categories)].reverse();

  // Calculate totals across all employee types
  let maleTotal = 0;
  let femaleTotal = 0;
  let otherTotal = 0;

  // Process the data to extract gender counts
  dataOne.forEach(dataItem => {
    if (dataItem.question_details && dataItem.answer) {
      uniqueCategories.forEach((category, categoryIndex) => {
        // Find if this category is for male, female, or other
        const isMale = category === "Number of Males" || category === "Males";
        const isFemale = category === "Number of Females" || category === "Females";
        const isOther = category === "Other" || category === "Others" || category === "Number of Others";

        // Sum up the values across all answer types (permanent, other-than-permanent)
        dataItem.answer.forEach(answerSet => {
          const value = answerSet[categoryIndex];
          if (value !== undefined) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              if (isMale) maleTotal += numValue;
              if (isFemale) femaleTotal += numValue;
              if (isOther) otherTotal += numValue;
            }
          }
        });
      });
    }
  });

  const total = maleTotal + femaleTotal + otherTotal;
  
  // Calculate percentages
  const malePercentage = total > 0 ? (maleTotal / total * 100).toFixed(1) : 0;
  const femalePercentage = total > 0 ? (femaleTotal / total * 100).toFixed(1) : 0;
  const otherPercentage = total > 0 ? (otherTotal / total * 100).toFixed(1) : 0;

  // Colors matching the screenshot
  const maleColor = "#2D7DE9";  // bright blue
  const femaleColor = "#FF9966"; // orange
  const otherColor = "#AAAAAA";  // gray

  // SVG dimensions - significantly increased size to fill more space
  const size = 350;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 160; // Much larger radius to fill more space

  // For the pie chart slices
  const genderData = [
    { label: "Male", value: maleTotal, percentage: malePercentage, color: maleColor },
    { label: "Female", value: femaleTotal, percentage: femalePercentage, color: femaleColor },
    { label: "Other", value: otherTotal, percentage: otherPercentage, color: otherColor }
  ].filter(item => item.value > 0);

  // Calculate SVG paths for the pie slices
  const calculatePieSlices = () => {
    if (total === 0) return [];
    
    // Special case: if there's only one gender with 100%
    if (genderData.length === 1 && parseFloat(genderData[0].percentage) === 100.0) {
      return [{
        ...genderData[0],
        path: `M ${centerX},${centerY} L ${centerX},${centerY - radius} A ${radius},${radius} 0 1,0 ${centerX},${centerY + radius} A ${radius},${radius} 0 1,0 ${centerX},${centerY - radius} Z`
      }];
    }
    
    let startAngle = 0;
    return genderData.map(item => {
      // Calculate the angle for this slice
      const angle = (item.value / total) * 360;
      const endAngle = startAngle + angle;
      
      // Convert to radians for SVG arc
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate points
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      // Large arc flag is 1 if angle > 180 degrees
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // SVG path for the slice
      const path = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
      
      // Save the current angle as the start for the next slice
      startAngle = endAngle;
      
      return {
        ...item,
        path
      };
    });
  };

  const pieSlices = calculatePieSlices();

  return (
    <div className="container" style={{ 
      boxSizing: "border-box",
      width: "100%",
      height: "100%", // Make container take full height
      margin: "0 auto",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="pie-chart-header" style={{ 
        fontSize: "18px", 
        fontWeight: "bold", 
        marginBottom: "10px", 
        textAlign: "center" 
      }}>{title}</div>

      {total === 0 ? (
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      ) : (
        <>
          <div className="pie-chart" style={{ 
            width: "100%", 
            height: `${size}px`, 
            position: "relative",
            margin: "0 auto",
            paddingBottom: "30px" // Add padding at the bottom to fill more space
          }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* Pie slices */}
              {pieSlices.map((slice, index) => (
                <path
                  key={index}
                  d={slice.path}
                  fill={slice.color}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    transform: hoveredIndex === index ? `scale(1.03)` : "none",
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7
                  }}
                />
              ))}
            </svg>
          </div>
          
          {/* Legend below the chart */}
          <div className="legend" style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "30px"
          }}>
            {pieSlices.map((slice, index) => (
              <div 
                key={`legend-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: slice.color,
                  borderRadius: "2px"
                }}></div>
                <span style={{
                  fontSize: "16px", // Increased font size
                  fontWeight: hoveredIndex === index ? "bold" : "normal",
                  color: "#333"
                }}>
                  {slice.label}: {slice.percentage}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GenderDistributionPieChart;