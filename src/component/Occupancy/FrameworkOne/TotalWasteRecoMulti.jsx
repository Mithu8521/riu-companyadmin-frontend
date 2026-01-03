import React from "react";

const TotalWasteDisposedMulti = ({ timePeriods, wasteRecovered }) => {

  const categories = wasteRecovered.reduce((acc, item) => {
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

  const uniqueCategories = [...new Set(categories)];

  const seriesData = Object.keys(timePeriods).map((timePeriod, timeIndex) => {
    const totalValues = uniqueCategories.map((category, categoryIndex) => {
      const timePeriodData = wasteRecovered[timeIndex];
      if (timePeriodData && timePeriodData.question_details) {
        const matchedDetail = timePeriodData.question_details.find(
          (detail) => detail.option === category
        );
        if (
          matchedDetail &&
          timePeriodData.answer &&
          timePeriodData.answer[0]
        ) {
          const answerValue = timePeriodData.answer[0][categoryIndex];
          return answerValue !== undefined ? Number(answerValue) : 0;
        }
      }
      return 0;
    });

    return {
      name: timePeriod,
      data: totalValues,
    };
  });

  // Sort each data array in ascending order for each series
  seriesData.forEach((series) => {
    const sortedData = [...series.data];
    sortedData.sort((a, b) => a - b); // Sort in ascending order
    series.data = sortedData;
  });

  const totalSum = seriesData.reduce(
    (sum, series) => sum + series.data.reduce((a, b) => a + b, 0),
    0
  );

  const adjustAndRoundTotalSum = (totalSum) => {
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200;
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100;
      } else {
        return Math.ceil(totalSum * 2) / 2;
      }
    }

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i];
      }
    }

    return totalSum;
  };

  const adjustedTotalSum = adjustAndRoundTotalSum(totalSum);

  const colors = [
    "#C6CB8D", "#949776", "#ABC4B2", "#6D8B96", "#9CDFE3", "#11546f",
    "#587b87", "#8CBBCE",
  ];

  return (
    <div className="container">
      <div className="renewable-bar-header">Total Waste Recovered</div>
      
      {seriesData.length > 0 ? (
        <div style={{ display: "flex", width: "100%", height: "300px" }}>
          {/* Y-axis labels */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginRight: "10px", paddingBottom: "30px" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{(adjustedTotalSum / 10) * 10}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{(((adjustedTotalSum / 5) * 4) / 10) * 10}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{(((adjustedTotalSum / 5) * 3) / 10) * 10}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{(((adjustedTotalSum / 5) * 2) / 10) * 10}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{(adjustedTotalSum / 5 / 10) * 10}</span>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>0</span>
          </div>

          {/* Main chart area */}
          <div style={{ flex: 1, display: "flex", position: "relative" }}>
            {/* Horizontal grid lines */}
            <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "0%", zIndex: 1 }}></div>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "20%", zIndex: 1 }}></div>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "40%", zIndex: 1 }}></div>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "60%", zIndex: 1 }}></div>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "80%", zIndex: 1 }}></div>
              <div style={{ position: "absolute", width: "100%", height: "1px", borderTop: "1px dashed #ccc", top: "100%", zIndex: 1 }}></div>
            </div>

            {/* Bars container */}
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", height: "100%", alignItems: "flex-end", zIndex: 2 }}>
              {seriesData.map((series, seriesIndex) => (
                <div key={seriesIndex} style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", width: `${100 / seriesData.length}%` }}>
                  {/* Stacked bar segments */}
                  <div style={{ display: "flex", flexDirection: "column-reverse", height: "100%", width: "50px" }}>
                    {series.data.map(
                      (value, index) =>
                        value > 0 && (
                          <div
                            key={index}
                            style={{
                              width: "100%",
                              height: `${(value / adjustedTotalSum) * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title={`${uniqueCategories[index]}: ${value}`}
                          >
                            <span
                              style={{
                                color: "white",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}
                            >
                              {value}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                  {/* X-axis labels */}
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#7b91b0",
                      fontSize: "12px",
                      marginTop: "10px",
                      textAlign: "center"
                    }}
                  >
                    {series.name.charAt(0).toUpperCase() + series.name.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No categories available for the selected options.</p>
      )}

      <div
        className="unit"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: 400 }}>
          (in MT)
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "20px",
          width: "100%",
        }}
      >
        {uniqueCategories.map((category, index) => {
          const shortNames = {
            "Other recovery operations": "Other",
          };

          const displayName = shortNames[category] || category;
          return (
            <div
              key={index}
              style={{
                width: "33%",
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
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
              <div style={{ fontSize: "12px" }}>{displayName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalWasteDisposedMulti;