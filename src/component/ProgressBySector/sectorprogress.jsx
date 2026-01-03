import React from "react";
import './sectorprogress.css'

const SectorProgress = ({ fromDate, toDate, financialYearId }) => {
  let obj
  if (financialYearId == 6) {
    obj = {
      Environment: {
        percentage: 100,
        color: "#54787A",
      },
      Energy: {
        percentage: 100,
        color: "#9FC3D2",
      },
      Emission: {
        percentage: 100,
        color: "#88D29E",
      },
      Water: {
        percentage: 100,
        color: "#35C2FD",
      },
      Diversity: {
        percentage: 100,
        color: "#85B9BC",
      },
      Training: {
        percentage: 100,
        color: "lightblue",
      },
      Safety: {
        percentage: 100,
        color: "darkgreen",
      },
    };
  } else {
    obj = {
      Environment: {
        percentage: 100,
        color: "#54787A",
      },
      Energy: {
        percentage: 100,
        color: "#9FC3D2",
      },
      Emission: {
        percentage: 100,
        color: "#88D29E",
      },
      Water: {
        percentage: 100,
        color: "#35C2FD",
      },
      Diversity: {
        percentage: 100,
        color: "#85B9BC",
      },
      Training: {
        percentage: 100,
        color: "lightblue",
      },
      Safety: {
        percentage: 100,
        color: "darkgreen",
      },
    };

  }


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        height: "100%",
        borderRadius: 10,
      }}
    >
      <div style={{ padding: "10px", height: "100%" }}>
        <div style={{ backgroundColor: "white", padding: "10px", height: "10%", paddingTop: "5px", paddingLeft: "5px" }}>
          <p
            style={{
              color: "#011627",
              fontSize: 20,
              fontFamily: "Open Sans",
              fontWeight: "600",
            }}
          >
            KPIwise progress
          </p>

        </div>
        <div
          className="scroll-container"
          style={{
            backgroundColor: "#F9F9F9", // Valid hex color code
            padding: "10px",
            overflowY: "scroll", // Ensure vertical scrolling is enabled
            height: "90%", // Set the height of the scrollable area
            borderRadius: 10,
          }}

        >
          {Object.keys(obj).map((category) => (
            <div
              key={category}
              style={{ marginBottom: "20px", background: "white", padding: "10px", borderRadius: "5px" }}
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
    </div>
  );
};

export default SectorProgress;
