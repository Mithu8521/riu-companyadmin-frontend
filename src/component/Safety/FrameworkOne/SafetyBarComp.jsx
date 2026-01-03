import React from "react";
import img from "../../../img/no.png";

const SafetyBarComp = ({
  title,
  type,
  matchedDataWaste,
}) => {
  console.log(matchedDataWaste, "matchedDataWaste");
  
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
  
  // Extract categories - prioritize column type entries
  const categories = matchedDataWaste.reduce((acc, item) => {
    if (item.question_details) {
      // Filter column type entries (but not heading or row types)
      const columnDetails = item.question_details.filter(
        detail => detail.option_type === "column" || detail.option_type === "column1"
      );
      
      // Map to get just the option names
      const options = columnDetails.map(detail => detail.option);
      
      return [...acc, ...options];
    }
    return acc;
  }, []);
  
  // Remove duplicates and exclude 'Remarks' from the visualization
  const uniqueCategories = [...new Set(categories)]
    .filter(category => category !== "Remarks")
    .reverse();
  
  // Map categories to their values
  const categoryValues = uniqueCategories.map(category => {
    // For each item in matchedDataWaste
    const totalValue = matchedDataWaste.reduce((sum, item) => {
      if (!item.question_details || !item.answer) return sum;
      
      // Get all column options in the same order they appear in question_details
      const columnOptions = item.question_details
        .filter(detail => detail.option_type === "column" || detail.option_type === "column1")
        .map(detail => detail.option);
      
      // Find position of this category in the column options
      const columnIndex = columnOptions.indexOf(category);
      
      if (columnIndex === -1) return sum;
      
      // Use answer[1] for "worker" type, answer[0] for "employee" type
      const answerArray = type === "worker" ? item.answer[1] : item.answer[0];
      
      if (!answerArray || columnIndex >= answerArray.length) return sum;
      
      // Get the value directly based on column index
      const value = answerArray[columnIndex];
      const numValue = value === "" ? 0 : Number(value);
      
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);
    
    return {
      category,
      totalValue,
    };
  });
  
  // Filter out categories with zero values
  const nonZeroCategoryValues = categoryValues.filter(item => Number(item.totalValue) > 0);
  
  // Calculate sums for the graph
  const totalSum = nonZeroCategoryValues.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  );
  
  // Colors for each category
  const colors = [
    "#C6CB8D",
    "#949776",
    "#ABC4B2",
    "#6D8B96",
    "#9CDFE3",
    "#11546f",
    "#587b87",
    "#8CBBCE",
  ];
  
  return (
    <div className="container" style={{ width: "100%" }}>
      <div className="renewable-bar-header">{title}</div>
      
      {nonZeroCategoryValues.length > 0 && totalSum > 0 ? (
        <div>
          <div className="renewable-bar-labels">
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>0</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {Math.round(totalSum / 5 / 10) * 10}
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {Math.round(((totalSum / 5) * 2) / 10) * 10}
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {Math.round(((totalSum / 5) * 3) / 10) * 10}
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {Math.round(((totalSum / 5) * 4) / 10) * 10}
            </span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>
              {Math.round(totalSum / 10) * 10}
            </span>
          </div>
          <div className="renewable-bar-dotted-line"></div>
          
          {/* The bar chart */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "30px",
              border: "1px solid #ccc",
            }}
          >
            {nonZeroCategoryValues.map((item, index) => {
              // Use linear scale for more intuitive representation
              const widthPercentage = (Number(item.totalValue) / totalSum) * 100;
              
              return (
                <div
                  key={index}
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: colors[index % colors.length],
                    position: "relative",
                  }}
                  title={`${item.category}: ${Number(item.totalValue)}`}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Number(item.totalValue)}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "10px",
              width: "100%",
            }}
          >
            {nonZeroCategoryValues.map((item, index) => {
              // Abbreviations for long category names
              const shortNames = {
                "Filed During the Year": "Filed",
                "Pending Resolution at the End of Year": "Pending",
                "Construction and demolition": "C&D",
                "Other hazardous wastes": "OHW",
                "Other non-hazardous wastes": "ONHW",
              };
              
              const displayName = shortNames[item.category] || item.category;
              
              return (
                <div
                  key={index}
                  style={{
                    width: "auto",
                    minWidth: "20%",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                    marginBottom: "5px",
                  }}
                  title={item.category} // Title shows full name on hover
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor: colors[index % colors.length],
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px" }}>{displayName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Display image when there's no valid data
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

export default SafetyBarComp;