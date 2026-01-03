import React from "react";
import img from "../../../img/no.png"

const SafetyBarFourtyEight = ({
  shortenedMap,
  brief,
  categories,
  heading
}) => {

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


  // Calculate total sums for each category
  const categoryValues = categories.map((category) => ({
    category,
    totalValue: getCategorySums(category),
  }));

  // Calculate the grand total sum of all categories
  const totalSum = categoryValues.reduce(
    (acc, item) => acc + item.totalValue,
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

  const shortenCategory = (category) => {
  

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

        }}
      >
        {heading}
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
              {categoryValues.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: `${(item.totalValue / totalSum) * 100}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                  title={`${item.category}: ${item.totalValue}`}
                />
              ))}
            </div>
            <div>
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
        </>
        ) : (
          <div style={{ height: "100%", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center' }}>

            <img src={img} style={{ height: "140px", width: "170px" }} />



          </div>

        )}
    </div>
  );
};

export default SafetyBarFourtyEight;
