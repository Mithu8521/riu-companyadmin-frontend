import React from "react";
import img from "../../../img/no.png"

const SafetyBarForRetirement = ({
  title,
  type,
  matchedDataWaste,
}) => {
  
  if (!matchedDataWaste || matchedDataWaste.length === 0) {
    return (
      <div className='container'>
        <img
          src={img}
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />
      </div>
    );
  }

  // Extract row options (benefit types)
  const rowOptions = matchedDataWaste.reduce((acc, item) => {
    if (item.question_details) {
      // Use reversed question_details for correct order
      const filteredOptions = [...item.question_details]
        .reverse()
        .filter((detail) => detail.option_type === "row")
        .map((detail) => detail.option);
      
      return [...acc, ...filteredOptions];
    }
    return acc;
  }, []);
  
  // Remove duplicates and ensure consistent order
  const uniqueRowOptions = [...new Set(rowOptions)];
  
  // Create a mapping of row options to their answer values
  const categoryValuesMap = {};
  
  matchedDataWaste.forEach(item => {
    if (item.question_details && item.answer) {
      // Use reversed question_details for correct order
      const rowDetails = [...item.question_details]
        .reverse()
        .filter(detail => detail.option_type === "row");
      
      // Map each row to its corresponding answer
      rowDetails.forEach((rowDetail, idx) => {
        // Find the answer array index that corresponds to this row
        // In the data structure, it appears that answer[idx] corresponds to the row at the same index
        const answerArray = item.answer[idx];
        
        if (answerArray && answerArray[0]) {
          const value = Number(answerArray[0]) || 0;
          const category = rowDetail.option;
          
          // If this category already exists, use the higher value or add them based on requirements
          // Here we're taking the higher value between existing and new
          if (categoryValuesMap[category]) {
            categoryValuesMap[category] = Math.max(categoryValuesMap[category], value);
          } else {
            categoryValuesMap[category] = value;
          }
        }
      });
    }
  });
  
  // Convert the map to an array for rendering
  const categoryValues = Object.entries(categoryValuesMap).map(([category, totalValue]) => ({
    category,
    totalValue
  }));
  
  // Include all values, including zeros
  const filteredCategoryValues = categoryValues;
  
  // Maximum value for scaling (100% or the highest value if greater)
  const maxValue = Math.max(100, ...filteredCategoryValues.map(item => item.totalValue));
  
  // Colors for each category
  const colors = [
    "#C6CB8D", // Others
    "#949776", // ESI
    "#ABC4B2", // Gratuity
    "#6D8B96", // PF
    "#9CDFE3",
    "#11546f",
    "#587b87",
    "#8CBBCE",
  ];

  // Short names for display
  const shortNames = {
    "PF (Provident Fund)": "PF",
    "ESI (Employee State Insurance)": "ESI",
    "Others (please specify)": "Others",
    "Gratuity": "Gratuity"
  };
  
  // Color mapping
  const colorMapping = {
    "Others (please specify)": colors[0],
    "ESI (Employee State Insurance)": colors[1],
    "Gratuity": colors[2],
    "PF (Provident Fund)": colors[3]
  };

  return (
    <div className="container" style={{ width: "100%", padding: "0 10px" }}>
      <div style={{ 
        textAlign: "center", 
        padding: "20px", 
        fontWeight: "bold",
        fontSize: "16px" 
      }}>
        {title || matchedDataWaste[0]?.title || "Details of Retirement Benefits"}
      </div>

      {filteredCategoryValues.length > 0 ? (
        <div className="my-3" style={{ width: "90%", marginLeft: "20px" }}>
          {/* Chart container */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "300px", 
            position: "relative",
            marginBottom: "40px"
          }}>
            {/* Y-axis labels */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: "10px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>100%</div>
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>50%</div>
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>0%</div>
            </div>
            
            {/* Y-axis grid lines */}
            <div style={{
              position: "absolute",
              left: "30px",
              right: 0,
              top: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div style={{ borderBottom: "1px dashed #ccc", width: "100%" }}></div>
              <div style={{ borderBottom: "1px dashed #ccc", width: "100%" }}></div>
              <div style={{ borderBottom: "1px solid #ccc", width: "100%" }}></div>
            </div>
            
            {/* Chart area */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              position: "relative",
              marginLeft: "40px"
            }}>
              {/* Bars */}
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                width: "100%",
                height: "100%",
              }}>
                {filteredCategoryValues.map((item, index) => {
                  const displayName = shortNames[item.category] || item.category;
                  const color = colorMapping[item.category] || colors[index % colors.length];
                  const heightPercentage = (item.totalValue / maxValue) * 100;
                  
                  return (
                    <div key={index} style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      height: "100%",
                      position: "relative"
                    }}>
                      <div style={{
                        position: "absolute",
                        bottom: "0",
                        width: "60px",
                        height: `${heightPercentage}%`,
                        backgroundColor: color,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: item.totalValue > 0 ? "flex-start" : "center",
                        borderTopLeftRadius: "3px",
                        borderTopRightRadius: "3px",
                        minHeight: item.totalValue === 0 ? "24px" : "auto"
                      }}>
                        <span style={{
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "3px"
                        }}>
                          {item.totalValue}%
                        </span>
                      </div>
                      
                      {/* X-axis labels */}
                      <div style={{
                        position: "absolute",
                        bottom: "-25px",
                        fontSize: "12px",
                        textAlign: "center",
                        width: "100%"
                      }}>
                        {displayName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <img
            src={img}
            alt="No data available"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SafetyBarForRetirement;