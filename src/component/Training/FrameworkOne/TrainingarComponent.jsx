import React from "react";
import img from "../../../img/no.png"

const TrainingBarComponent = ({
  title,
  number,

  dataOne,
}) => {
  // Extract categories dynamically based on the specified condition
  const categories = dataOne.reduce((acc, item) => {
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
    const totalValue = dataOne.reduce((sum, item) => {
      if (item.question_details && item.answer && item.answer[number]) {
        // Ensure the first array in answer exists
        const matchedDetail = item.question_details.find(
          (detail) => detail.option === category
        );
        const answerValue = item.answer[number][categoryIndex]; // Use the first array in answer
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

    const totalStr = totalSum.toString(); // Convert number to a string
    const firstTwoDigits = parseInt(totalStr.slice(0, 2)); // Extract the first two digits
    const magnitude = Math.pow(10, totalStr.length - 2); // Calculate the magnitude based on the number of digits

    // Apply custom rounding logic based on the first two digits
    if (firstTwoDigits > 75) {
      return 100 * magnitude; // Round to 100
    } else if (firstTwoDigits > 50) {
      return 75 * magnitude; // Round to 75
    } else if (firstTwoDigits > 25) {
      return 50 * magnitude; // Round to 50
    } else if (firstTwoDigits > 10) {
      return 25 * magnitude; // Round to 25
    } else {
      return 10 * magnitude; // Round to 10
    }
  };


  const totalSum = adjustAndRoundTotalSum(categoryValues.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  ));
  const logTotalSum = categoryValues.reduce(
    (sum, item) => sum + Math.log(item.totalValue + 1),
    0
  );

  // Colors for each category
  const colors = [
    "#6fa8dc",
    "#11546f",
    "#9cdfe3",
    "#6D8B96",
    "#9CDFE3",
    "#11546f",
    "#587b87",
    "#8CBBCE",
  ];

  return (
    <div className="container">
      <div className="renewable-bar-header">{title}</div>

      {categoryValues.length > 0 && totalSum > 0 ? (
        <>
          {/* Labels for the bar chart */}
          <div className="renewable-bar-labels">
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {(totalSum / 5 / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {(((totalSum / 5) * 2) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {(((totalSum / 5) * 3) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {(((totalSum / 5) * 4) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
              {(totalSum / 10) * 10}
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
              const logValue = Math.log(item.totalValue + 1); // log(1) to avoid log(0)
              const widthPercentage = (item.totalValue / totalSum) * 100;

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
                  {/* Show the true value in the middle of the bar */}
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

                  </span>
                </div>
              );
            })}
          </div>

          {/* Unit label */}
          <div
            className="unit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3%",
              marginTop: "1%",
              marginBottom: "3%",
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
              (Number of Individuals)
            </div>
          </div>

          {/* Legend for category values */}
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              overflow: "auto",
            }}
          >
            {categoryValues.map((item, index) => {
              // Short names for categories
              const shortNames = {
                "Construction and demolition": "C&D",
                "Other hazardous wastes": "OHW",
                "Other non-hazardous wastes": "ONHW",
                "Number of permanent employees who received training on the above topic": "Permanent",
                "Number of other than permanent employees who received training on the above topic": "Non-Permanent",
                "Number of permanent workers who received training on the above topic": "Permanent",
                "Number of other than permanent employees who received training on the above topic": "Non-Permanent",
              };

              const displayName = shortNames[item.category] || item.category;

              return (
                <div
                  key={index}
                  style={{
                    width: "13%",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                  title={item.category} // Full name on hover
                >
                  <div
                    style={{
                      width: "10%",
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
        </>
      ) : (
        <img
          src={img} // Replace with your image path or URL
          alt="No Data Available"
          style={{ width: "150px", height: "140px", display: "block", margin: "0 auto" }}
        />
      )}
    </div>

  );
};

export default TrainingBarComponent;
