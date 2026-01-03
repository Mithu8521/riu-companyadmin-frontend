import React from "react";
import "./TopComponentWaste.css"
const TopComponentWaste = ({ lastWeekActivities, icons }) => {
  const filteredActivities = Object.entries(lastWeekActivities)
    .filter(([key, value]) => key !== "message")
    .map(([key, value]) => ({ key, value }));

  const onSelect = (data) => {

    localStorage.setItem("questionIds", data);
    window.location.href = "/#/sector_questions";
  };

  const formatNumberWithIndianCommas = (input, key) => {
    // Check if input contains valid numbers, otherwise return 0
    const numericMatch = input.match(/\d+(\.\d+)?/g); // Extract numeric part with decimals
    if (!numericMatch) {
      return '0'; // If no number is found, return '0'
    }
  
    const number = numericMatch[0]; // First match of number
  
    if (isNaN(number)) {
      return '0'; // If number is NaN, return '0'
    }
  
    // Determine the rounding based on key
    let roundedNumber;
    if (key === "Total Waste Disposed") {
      // Round to 4 decimal places for "Total waste disposed"
      roundedNumber = parseFloat(number).toFixed(4);
    } else {
      // Round to 2 decimal places for other cases
      roundedNumber = parseFloat(number).toFixed(2);
    }
  
    const x = roundedNumber.toString().split('.');
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);
  
    if (rest !== '') {
      lastThree = ',' + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }
  
    // Return formatted number along with any original text after the numeric value (e.g., " GJ")
    return x.length > 1 ? num + '.' + x[1] : num + input.replace(number, '');
  };
  
  
  

  return (
<div className="topcompcontainer">
  {filteredActivities.map(({ key, value }, index) => (
    <div
      key={key}
      className={
        index !== filteredActivities.length - 1 ? "divvWithBorder" : ""
      }
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        marginLeft: "20px",
        cursor: "pointer",
      }}
      onClick={() => {
        if (value.questionId.length !== 0) {
          onSelect(value.questionId.length);
        }
      }}
    >
      <div className="firsthalf" style={{ paddingTop: "5%" }}>
        <h3 className="h3-spacing">
          {formatNumberWithIndianCommas(value.number, key)} MT {/* Pass key to format correctly */}
        </h3>
        <h6 className="h6-spacing">
          {key === "pending"
            ? "Defaulted"
            : key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
        </h6>
      </div>
      <div className="secondhalff">
        {/* <div className="secondhalf">
          <img src={icons[key]} alt="icon" style={{ height: '20px', width: '20px' }}/>
        </div> */}
      </div>
    </div>
  ))}
</div>

  );
};

export default TopComponentWaste;
