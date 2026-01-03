import React from "react";
import img from "../../../img/no.png";

const TrainingBarFourtyEightTwo = ({
  brief,
  categories,
  shortenedMap,
  title,
}) => {
  const getCategorySums = (categoryKey) => {
    let totalForCategory = 0;
    if (brief && brief.time) {
      Object.keys(brief.time).forEach((location) => {
        const categoryValues = brief.time[location][categoryKey];
        if (categoryValues) {
          totalForCategory += categoryValues.reduce(
            (acc, value) => acc + value,
            0
          );
        }
      });
    }
    return totalForCategory;
  }; 

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

  const tmpsum = categoryValues.reduce(
    (sum, item) => sum + (isNaN(Number(item.totalValue)) ? 0 : Number(item.totalValue)),
    0
  );
  
  const totalSum = adjustAndRoundTotalSum(tmpsum);
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
    return shortenedMap[category] || category;
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
          marginBottom: "3%",
        }}
      >
       {title}
      </div>
      {categoryValues.length > 0 && totalSum > 0 ? (
        <>
          <div className="renewable-bar-labels">
            <span style={{ fontSize: "11px", fontWeight: 600 }}>0</span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {totalSum / 5}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {(totalSum / 5) * 2}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {((totalSum / 5) * 3).toFixed(0)}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {(totalSum / 5) * 4}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>
              {totalSum}
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
              {categoryValues
                .filter((item) => item.totalValue > 0) // Filter out zero values
                .map((item, index) => {
                  const widthPercentage = (item.totalValue / totalSum) * 100;
                  return (
                    <div
                      key={index}
                      style={{
                        width: `${widthPercentage}%`,
                        backgroundColor: colors[index % colors.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "12px",
                      }}
                      title={`${item.category}: ${item.totalValue}`}
                    >
                      <span
                        style={{
                          position: "absolute",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {item.totalValue}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div>
              {chunkArray(
                categoryValues.filter((item) => item.totalValue > 0),
                3
              ).map((chunk, chunkIndex) => (
                <div
                  key={`chunk-${chunkIndex}`}
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    width: "100%",
                  }}
                >
                  {chunk.map((item, index) => (
                    <div
                      key={`item-${chunkIndex}-${index}`}
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
        </>
      ) : (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-4%",
          }}
        >
          <img src={img} style={{ height: "120px", width: "170px" }} />
        </div>
      )}
    </div>
  );
};

export default TrainingBarFourtyEightTwo;
