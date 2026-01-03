import React from "react";
import img from "../../../img/no.png"

const TotalTreatedWater = ({
  timePeriods,
  timePeriodValues,
  locationOption,
  brief,
}) => {
  // Function to extract and sum category values from the brief
  const getCategorySums = (categoryKey) => {
    let totalForCategory = 0;
    // Loop through each location in the 'time' key
    if (brief && brief.time) {
      // Loop through each location in the 'time' key
      Object.keys(brief.time).forEach((location) => {
        const categoryValues = brief.time[location][categoryKey];
        if (categoryValues) {
          // Sum up values for the category across all time periods
          totalForCategory += categoryValues.reduce(
            (acc, value) => acc + value,
            0
          );
        }
      });
    }

    return totalForCategory;
  };

  // Example categories (replace with actual categories from brief)
  const categories = ["Total treated water reused(Flushing/CT etc.)* (in KL) ",];

  // Calculate total sums for each category
  const categoryValues = categories.map((category) => ({
    category,
    totalValue: getCategorySums(category),
  }));

  const adjustAndRoundTotalSum = (totalSum) => {
    // Define the thresholds or rounding steps
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    // Handle values less than 1 (same logic as before)
    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200; // Round to nearest 0.005
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100; // Round to nearest 0.01
      } else {
        return Math.ceil(totalSum * 2) / 2; // Round to nearest 0.5
      }
    }

    // For values greater than or equal to 1, round based on the defined thresholds
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        // Debugging step: log the threshold and the result of rounding up
        console.log(
          `Rounding ${totalSum} up to the next threshold: ${thresholds[i]}`
        );
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to the next threshold
      }
    }

    // If no threshold is applicable, return the value as is (e.g., for values below 10)
    return totalSum;
  };

  // Calculate the grand total sum of all categories
  const totalSum = adjustAndRoundTotalSum(categoryValues.reduce(
    (acc, item) => acc + item.totalValue,
    0
  ))

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

  const shortenCategory = (category) => {
    const shortenedMap = {
      "Total treated water reused(Flushing/CT etc.)* (in KL) ": "Treated Water Recycled",

    };

    return shortenedMap[category] || category; // Fallback to full category if not found
  };

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  return (
    <div className="container" style={{ width: "100%" }}>
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
          marginBottom: "4.5%",
        }}
      >
        Total  Water Treated
      </div>
      {categoryValues.length > 0 && totalSum > 0 ?
        (<>

          <div className="renewable-bar-labels">
            <span style={{ fontSize: "11px", fontWeight: 600 }}>0</span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {Math.round(totalSum / 5 / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {Math.round(((totalSum / 5) * 2) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {Math.round(((totalSum / 5) * 3) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {Math.round(((totalSum / 5) * 4) / 10) * 10}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {Math.round(totalSum / 10) * 10}
            </span>
          </div>
          <div className="renewable-bar-dotted-line"></div>


          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "30px",
                border: "1px solid #ccc",
              }}
            >
              {categoryValues.map((item, index) =>
                item.totalValue === 0 ? null : ( // Use ternary operator for conditional rendering
                  <div
                    key={index}
                    style={{
                      width: `${(item.totalValue / totalSum) * 100}%`,
                      backgroundColor: colors[index % colors.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 500,
                    }}
                    title={`${item.category}: ${item.totalValue}`}
                  >

                  </div>
                )
              )}
            </div>
            <div
              className="unit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "3%",
                marginBottom: "0.2%",
                marginTop: "1%",
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
                (in KL)
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Split categoryValues into chunks of 3 */}
              {chunkArray(categoryValues, 3).map((chunk, chunkIndex) => (
                <div
                  key={`chunk-${chunkIndex}`} // Use a unique key for each chunk
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    width: "100%",
                  }}
                >
                  {chunk.map((item, index) => (
                    <div
                      key={`item-${chunkIndex}-${index}`} // Use a unique key for each item
                      style={{
                        width: "40%",
                        display: "flex",
                        fontSize: "12px",
                        alignItems: "center",
                        marginRight: "15px",
                      }}
                    >
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor:
                              colors[(chunkIndex * 3 + index) % colors.length],
                            marginRight: "5px",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: "80%",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div style={{ fontSize: "12px" }}>
                          {shortenCategory(item.category)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>) : (
          <div style={{ height: "100%", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center' }}>

            <img src={img} style={{ height: "90px", width: "170px" }} />



          </div>

        )}
    </div>
  );
};

export default TotalTreatedWater;
