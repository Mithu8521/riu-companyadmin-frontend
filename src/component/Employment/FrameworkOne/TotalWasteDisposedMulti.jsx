import React from "react";
import noDataImage from "../../../img/no.png";

const TotalWasteDisposedMulti = ({ timePeriods, wasteDisposal }) => {
  // Extract unique categories dynamically based on the specified condition
  if (!wasteDisposal) {
    return (
      <div className='container'>
        <img
          src={noDataImage} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />
      </div>
    );
  }

  const categories = wasteDisposal.reduce((acc, item) => {
    if (item.question_details) {
      // Check for 'column1' first
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "column1")
        .map((detail) => detail.option);

      // If no 'column1' found, check for 'column'
      if (filteredOptions.length === 0) {
        filteredOptions = item.question_details
          .filter((detail) => detail.option_type === "column")
          .map((detail) => detail.option);
      }

      return acc.concat(filteredOptions);
    }
    return acc;
  }, []);

  // Remove duplicates to get unique categories
  const uniqueCategories = [...new Set(categories)].reverse();

  // Prepare data for each time period
  const seriesData = Object.keys(timePeriods).map((timePeriod, timeIndex) => {
    const totalValues = uniqueCategories.map((category, categoryIndex) => {
      // Find the corresponding wasteDisposal object for the time period (H1, H2, etc.)
      const timePeriodData = wasteDisposal[timeIndex];
      if (timePeriodData && timePeriodData.question_details) {
        // Check for the matched detail for the category
        const matchedDetail = timePeriodData.question_details.find(
          (detail) => detail.option === category
        );
        if (
          matchedDetail &&
          timePeriodData.answer &&
          timePeriodData.answer[0]
        ) {
          // Extract the value from the corresponding index in the answer array
          const answerValue = timePeriodData.answer[0][categoryIndex]; // Assume answers align with category index
          return answerValue !== undefined ? Number(answerValue) : 0;
        }
      }
      return 0; // Default to 0 if no data is found
    });

    return {
      name: timePeriod,
      data: totalValues,
    };
  });

  const adjustAndRoundTotalSum = (totalSum) => {
    if (totalSum < 1) {
      // Handle small decimals
      if (totalSum < 0.01) {
        // Round to nearest 0.005 for values below 0.01
        return Math.ceil(totalSum * 200) / 200; // (0.005 increments)
      } else if (totalSum < 0.1) {
        // Round to nearest 0.01 for values between 0.01 and 0.1
        return Math.ceil(totalSum * 100) / 100; // (0.01 increments)
      } else {
        // Round to nearest 0.5 or 1 for values between 0.1 and 1
        return Math.ceil(totalSum * 2) / 2; // (0.5 increments)
      }
    }

    const totalStr = totalSum.toString(); // Convert the number to a string
    const firstTwoDigits = parseInt(totalStr.slice(0, 2)); // Extract the first two digits
    const magnitude = Math.pow(10, totalStr.length - 2); // Calculate magnitude for larger numbers

    if (firstTwoDigits < 50) {
      return Math.ceil((firstTwoDigits * magnitude) / (5 * magnitude)) * 5 * magnitude;
    } else {
      return Math.ceil((firstTwoDigits * magnitude) / (10 * magnitude)) * 10 * magnitude;
    }
  };

  // Calculate the total sum for labels
  const totalSum = seriesData.reduce(
    (sum, series) => sum + series.data.reduce((a, b) => a + b, 0),
    0
  );

  const adjustedTotalSum = adjustAndRoundTotalSum(totalSum);

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
    <div className="container">
      <div className="renewable-bar-header">Waste Disposed by Type Comparison</div>
      <div className="renewable-bar-labels" style={{ paddingLeft: "5%" }}>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{adjustedTotalSum / 5}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(adjustedTotalSum / 5) * 2}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(adjustedTotalSum / 5) * 3}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(adjustedTotalSum / 5) * 4}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{adjustedTotalSum}</span>
      </div>
      <div className="renewable-bar-dotted-line"></div>

      {seriesData.length > 0 ? (
        <div
          style={{
            display: "flex",
            height: "90%",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {seriesData.map((series, seriesIndex) => (
            <div
              className="d-flex"
              style={{ width: "100%", marginBottom: "3%" }}
            >
              <div
                style={{
                  fontWeight: 500,
                  color: "#7b91b0",
                  marginBottom: "5px",
                  paddingTop: "2%",
                  fontSize: "12px",
                  marginRight: "2%",
                }}
              >
                {series.name.charAt(0).toUpperCase() + series.name.slice(1)}
              </div>
              <div
                key={seriesIndex}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "5px 0",
                  backgroundColor: "#f3f3f3",
                  height: "100%",
                  width: "100%",
                }}
              >
                {series.data.map(
                  (value, index) =>
                    value > 0 && ( // Check if value is greater than 0
                      <div
                        key={index}
                        style={{
                          height: "100%", // Adjust height as necessary
                          width: `${(value / adjustedTotalSum) * 100}%`, // Calculate width based on total
                          backgroundColor: colors[index % colors.length],
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                        title={`${uniqueCategories[index]}: ${value}`}
                      >
                        {/* Display data value inside the bar */}
                        <span style={{ position: "absolute", fontSize: "12px" }}>
                          {value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}

          <div
            className="unit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3%",
              marginTop: "1%",
              marginBottom: "2%",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                height: "100%",
                padding: "0%",
              }}
            >
              (in MT)
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              overflow: "auto",
            }}
          >
            {uniqueCategories.map((category, index) => {
              const shortNames = {
                "Other disposal operations": "Other",
              };

              // Get the short name or default to the full category name
              const displayName = shortNames[category] || category;
              return (
                <div
                  key={index}
                  style={{
                    width: "33%",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
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
                  <div style={{ width: "70%" }}>
                    <div style={{ fontSize: "12px" }}>{displayName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No categories available for the selected options.</p>
      )}
    </div>
  );
};

export default TotalWasteDisposedMulti;
