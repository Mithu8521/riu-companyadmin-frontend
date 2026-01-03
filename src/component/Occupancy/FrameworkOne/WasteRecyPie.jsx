import React from 'react';
import Chart from 'react-apexcharts';
import img from "../../../img/no.png"

const WasteRecyPie = ({ matchedDataWaste }) => {
  if (!matchedDataWaste || matchedDataWaste.length === 0) {
    return (
      <div className='container' >
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
        .filter(detail => detail.option_type === 'column1')
        .map(detail => detail.option);

      // If no 'column1' found, check for 'column'
      if (filteredOptions.length === 0) {
        filteredOptions = item.question_details
          .filter(detail => detail.option_type === 'column')
          .map(detail => detail.option);
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
      if (item.question_details && item.answer && item.answer[0]) { // Ensure the first array in answer exists
        const matchedDetail = item.question_details.find(detail => detail.option === category);
        const answerValue = item.answer[0][categoryIndex]; // Use the first array in answer
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

  const totalSum = categoryValues.reduce((sum, item) => sum + Number(item.totalValue), 0);

  // Prepare data for the Donut chart

  const colors = [
    "#83BBD5",
    "#11546f",
    "#3ABEC7",
    "#3F88A5",
    "#88D29E",
    "#11546f",
  ];

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: categoryValues.map(item => item.category),
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: (val, { seriesIndex }) => {
        // Show the actual number instead of percentage
        return categoryValues[seriesIndex].totalValue;
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val, { seriesIndex }) {
          return `${categoryValues[seriesIndex].totalValue} MT`; // Display value followed by MT
        },
      },
    },
    legend: {
      show: false,
      position: 'bottom',
    },
  };


  const chartSeries = categoryValues.map(item => Number(item.totalValue));

  return (
    <div className="container" style={{ width: "100%" }}>
      <div className="renewable-bar-header" style={{ fontSize: "18px", fontWeight: 600, height: "10%" }}>
        Total Waste Recovered (MT)
      </div>
      <div className='d-flex' style={{ width: "100%", height: "90%" }}>
        {categoryValues.length > 0 && totalSum > 0 ?
          (
            <div className='d-flex' style={{ width: "100%", height: "100%" }}>
              <div style={{ width: "75%" }}>
                {chartSeries.length > 0  &&<Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  width={"100%"}
                  height={"100%"}
                />}
              </div>



              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "12%", height: "100%", width: "25%", overflow: "auto" }}>
                {categoryValues.map((item, index) => (
                  <div key={index} style={{ width: "100%", display: 'flex', alignItems: 'center', }}>
                    <div style={{ width: "40%", display: "flex", alignItems: "center" }}>
                      <div style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: "50%",
                        backgroundColor: chartOptions.colors[index % chartOptions.colors.length],
                        marginRight: '5px'
                      }} />
                    </div>
                    <div style={{ width: "70%" }}>
                      <div style={{ fontSize: "12px" }}>{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No categories available for the selected options.</p>
          )}

      </div>

    </div>
  );
};

export default WasteRecyPie;
