import React from "react";
import img from "../../../img/no.png"

const SafetyBar = ({
  title,
  type,

  matchedDataWaste,
}) => {
  if (!matchedDataWaste || matchedDataWaste.length === 0) {
    return (
      <div className='container'>
        <img
          src={img} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />

      </div>
    )
  }
  // Extract categories dynamically based on the specified condition
  const categories = matchedDataWaste.reduce((acc, item) => {
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

  // Remove duplicates
  const uniqueCategories = [...new Set(categories)].reverse();

  // Map the categories to their corresponding answer values using the first array in answer
  const categoryValues = uniqueCategories.map((category, categoryIndex) => {
    const totalValue = matchedDataWaste.reduce((sum, item) => {
      // Determine whether to use answer[1] for "worker" or answer[0] for "employee"
      const answerArray = type === "worker" ? item.answer[1] : item.answer[0];

      if (item.question_details && answerArray) {
        const matchedDetail = item.question_details.find(
          (detail) => detail.option === category
        );

        const answerValue = answerArray[categoryIndex]; // Use the correct answer array based on type
        if (matchedDetail && answerValue !== undefined) {
          return sum + Number(answerValue); // Sum values for each category
        }
      }

      return sum;
    }, 0);

    return {
      category,
      totalValue,
    };
  });


 

  const totalSum = categoryValues.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  );
  const logTotalSum = categoryValues.reduce(
    (sum, item) => sum + Math.log(item.totalValue + 1),
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

      {categoryValues.length > 0 && totalSum > 0 ? (
        <div>
          <div className="renewable-bar-labels">
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {Math.round(totalSum / 5 / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {Math.round(((totalSum / 5) * 2) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {Math.round(((totalSum / 5) * 3) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {Math.round(((totalSum / 5) * 4) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
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
            {categoryValues.map((item, index) => {
              if (Number(item.totalValue) === 0) return null;
              // Use log values for the width calculation
              const logValue = Math.log(item.totalValue + 1); // log(1) to avoid log(0)
              const widthPercentage = (logValue / logTotalSum) * 100;

              return (
                <div
                  key={index}
                  style={{
                    width: `${widthPercentage}%`, // Use logarithmic width
                    backgroundColor: colors[index % colors.length],
                    position: "relative", // For absolute positioning the true value text
                  }}
                  title={`${item.category}: ${Number(item.totalValue)}`} // Tooltip with the true value
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  >
                    {item.totalValue}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "10px",
              width: "100%",
              overflow: "auto",
            }}
          >
            {categoryValues.map((item, index) => {
              const shortNames = {
                "Construction and demolition": "C&D",
                "Other hazardous wastes": "OHW",
                "Other non-hazardous wastes": "ONHW",
              };

              const displayName = shortNames[item.category] || item.category;

              return (
                <div
                  key={index}
                  style={{
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                  title={item.category} // Title shows full name on hover
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
        // Display image when totalSum is not greater than 0
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

export default SafetyBar;
