import React from "react";
import "../ProgressBySector/sectorprogress.css";

const LocationEnergyConsumption = ({ fromDate, toDate, financialYearId }) => {
  const obj = {
    Environment: {
      percentage: 82,
      color: "#54787A",
    },
    Energy: {
      percentage: 90,
      color: "#9FC3D2",
    },
    Emission: {
      percentage: 70,
      color: "#88D29E",
    },
    Water: {
      percentage: 60,
      color: "#35C2FD",
    },
    Diversity: {
      percentage: 50,
      color: "#85B9BC",
    },
    Sustainibilty: {
      percentage: 50,
      color: "lightblue",
    },
    Greenery: {
      percentage: 50,
      color: "darkgreen",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        borderRadius: 10,
        height: "100%",
        padding: "10px",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "10px", height: "10%", marginBottom: "5%" }}>
        <p
          style={{
            color: "#011627",
            fontSize: 18,
            fontFamily: "Open Sans",
            fontWeight: "600",
          }}
        >
          Location Wise Energy Consumption
        </p>
      </div>

      <div
        className="scroll-container"
        style={{
          backgroundColor: "#F9F9F9", // Valid hex color code
          padding: "10px",
          overflowY: "scroll", // Ensure vertical scrolling is enabled
          height: "85%", // Set the height of the scrollable area
          borderRadius: 10,
        }}
      >
        {Object.keys(obj).map((category) => (
          <div
            key={category}
            style={{
              marginBottom: "20px",
              background: "white",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "space-between",
                justifyContent: "space-between",
              }}
            >
              <span>{category}</span>
              <span
                style={{
                  color: "#77838F",
                  fontSize: 14,
                  fontFamily: "Open Sans",
                  fontWeight: "400",
                }}
              >
                {obj[category].percentage}%
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#e0e0e0",
                height: "10px",
                width: "100%",
                marginTop: "5px",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  backgroundColor: obj[category].color,
                  height: "100%",
                  width: `${obj[category].percentage}%`,
                  borderRadius: "5px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationEnergyConsumption;
