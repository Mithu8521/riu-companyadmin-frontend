import React from "react";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import CompareMultiple from "../DashboardComponents/CompareMultiple";

const CompareMultipleTime = ({ locationOption, timePeriods, processedDataByType, intensityTypes, intensityQuestions }) => {
  // Function to render graphs in rows of 2
  const renderGraphsInRows = () => {
    if (!intensityTypes || intensityTypes.length === 0) {
      // Fallback to original single graph if no intensity types
      return (
        <div className="d-flex flex-row flex-space-between">
        </div>
      );
    }

    const rows = [];
    
    // Group intensity types into rows of 2
    for (let i = 0; i < intensityTypes.length; i += 2) {
      const firstType = intensityTypes[i];
      const secondType = intensityTypes[i + 1]; // May be undefined if odd number
      
      rows.push(
        <div key={`row-${i}`} className="d-flex flex-row flex-space-between" style={{ marginBottom: "10px" }}>
          {/* First graph in the row */}
          <div
            className="firsthalfprogressenergy"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "49%",
              marginTop: "10px",
              marginRight: secondType ? "1%" : "0%",
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <CompareMultiple
                    timePeriods={timePeriods}
                    graphData={processedDataByType[firstType]}
                    type={firstType}
                    productTypeOptions={intensityQuestions}
                    locationOption={locationOption}
                  />
            </div>
          </div>

          {/* Second graph in the row (if exists) */}
          {secondType && (
            <div
              className="secondhalfprogress"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "49%",
                marginTop: "10px",
                marginLeft: "1%",
              }}
            >
              <div style={{ height: "100%" }} className="my-2 container">
                <CompareMultiple
                    timePeriods={timePeriods}
                    graphData={processedDataByType[secondType]}
                    type={secondType}
                    productTypeOptions={intensityQuestions}
                    locationOption={locationOption}
                  />
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="d-flex flex-column flex-space-between">
      {renderGraphsInRows()}
    </div>
  );
};

export default CompareMultipleTime;