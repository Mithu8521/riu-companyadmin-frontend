import React from "react";
import img from "../../../img/no.png";

const DiversityMenAndWomen = ({
  brief,
  categories,
  shortenedMap,
  title
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

  // Calculate total sums for each category
  const categoryValues = categories
    .map((category) => ({
      category,
      totalValue: getCategorySums(category),
    }))
    .filter((item) => item.totalValue > 0); // Only include categories with values greater than 0

  const totalSum = categoryValues.reduce(
    (acc, item) => acc + item.totalValue,
    0
  );

  const colors = [
    "#C6CB8D", "#949776", "#ABC4B2", "#6D8B96", "#9CDFE3", "#11546f", "#587b87", "#8CBBCE"
  ];

  const shortenCategory = (category) => shortenedMap[category] || category;

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
              {categoryValues.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: `${(item.totalValue / totalSum) * 100}%`,
                    backgroundColor: colors[index % colors.length],
                    position: "relative",
                  }}
                  title={`${item.category}: ${item.totalValue}`}
                >
                  {/* Positioning the label inside the bar */}
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {item.totalValue} %
                  </span>
                </div>
              ))}
            </div>

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
                (Percentage)
              </div>
            </div>

            <div>
              {/* Split categoryValues into chunks of 3 */}
              {chunkArray(categoryValues, 3).map((chunk, chunkIndex) => (
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
            height: "90%",
            width: "100%",
            display: "flex",
            marginTop: "-2%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={img} style={{ height: "90%", width: "140px" }} />
        </div>
      )}
    </div>
  );
};

export default DiversityMenAndWomen;
