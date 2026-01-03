import React from "react";

const TopComponentWaste = ({ lastWeekActivities, icons }) => {
  // Add safety check for null/undefined
  const filteredActivities = lastWeekActivities
    ? Object.entries(lastWeekActivities)
        .filter(([key, value]) => key !== "message")
        .map(([key, value]) => ({ key, value }))
    : [];

  const onSelect = (data) => {
    localStorage.setItem("questionIds", data);
    window.location.href = "/#/sector_questions";
  };

  const formatNumberWithIndianCommas = (input, key) => {
    if (!input) return '0 mt';
    
    // Check if input contains valid numbers, otherwise return 0
    const numericMatch = input.match(/\d+(\.\d+)?/g); // Extract numeric part with decimals
    if (!numericMatch) {
      return '0 mt'; // If no number is found, return '0 mt'
    }
  
    const number = numericMatch[0]; // First match of number
  
    if (isNaN(number)) {
      return '0 mt'; // If number is NaN, return '0 mt'
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
    return (x.length > 1 ? num + '.' + x[1] : num) + ' mt';
  };
  
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      width: "100%",
    }}>
      {filteredActivities.map(({ key, value }, index) => (
        <div
          key={key}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px 20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            cursor: value?.questionId?.length !== 0 ? "pointer" : "default",
          }}
          onClick={() => {
            if (value?.questionId?.length !== 0) {
              onSelect(value?.questionId?.length);
            }
          }}
        >
          <div>
            <h2 style={{ 
              fontSize: "28px", 
              fontWeight: "500", 
              margin: "0 0 8px 0",
              color: "#333" 
            }}>
              {formatNumberWithIndianCommas(value?.number || '0', key)}
            </h2>
            <h3 style={{ 
              fontSize: "16px", 
              fontWeight: "500", 
              margin: "0 0 6px 0",
              color: "#333" 
            }}>
              {key === "pending"
                ? "Defaulted"
                : key === "completed" ? "Completed" 
                : key === "inprogress" ? "In progress"
                : key === "overdue" ? "Overdue"
                : key === "upcoming" ? "Upcoming"
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
        
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "16px"
          }}>
            {icons && icons[key] && (
              <img 
                src={icons[key]} 
                alt="" 
                style={{ 
                  height: '24px', 
                  width: '24px',
                  color: "#4299e1"
                }} 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopComponentWaste;