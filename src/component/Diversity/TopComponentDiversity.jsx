import React from "react";
import "./TopComponentDiversity.css";

const TopComponentDiversity = () => {
  // Updated data to match the image
  const diversityData = {
    "Total Workforce": {
      number: 866,
      subtitle: "Employees: 470 | Workers: 396"
    },
    "Female Representation": {
      number: "4.73%",
      subtitle: "Total Females: 41"
    },
    "Differently Abled": {
      number: "0.35%",
      subtitle: "Total: 3 individuals"
    },
    "Women on Board": {
      number: "22.22%",
      subtitle: "2 out of 9 directors"
    },
  };

  const filteredData = Object.entries(diversityData)
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="topcompcontainer">
      {filteredData.map(({ key, value }, index) => (
        <div
          key={key}
          className={
            index !== filteredData.length - 1 ? "divvWithBorder" : ""
          }
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "15px 20px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            margin: "5px",
            backgroundColor: "white"
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <div style={{ 
              fontSize: "12px", 
              color: "#6b7280", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              {key}
            </div>
            <div style={{ 
              fontSize: "28px", 
              fontWeight: "bold", 
              marginBottom: "5px",
              color: "#111827"
            }}>
              {value.number}
            </div>
            <div style={{ 
              fontSize: "11px", 
              color: "#9ca3af"
            }}>
              {value.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopComponentDiversity;