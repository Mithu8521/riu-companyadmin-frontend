import React from "react";
import { FavoriteBorder, FiberManualRecordOutlined } from "@material-ui/icons";
import updated from "../../img/updated.svg";

const TopComponent = ({ lastWeekAcitivities, icons }) => {
  const filteredActivities = Object.entries(lastWeekAcitivities)
    ?.filter(([key]) => key !== "message")
    ?.map(([key, value]) => ({ key, value }));

  const onSelect = (data) => {
    localStorage.setItem("questionIds", data);
    window.location.href = "/#/sector_questions";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: "27px",
        marginBottom: "20px",
      }}
    >
      {filteredActivities?.map(({ key, value }, index) => (
        <div
          key={key}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRight:
              index !== filteredActivities?.length - 1
                ? "1px solid #ddd"
                : "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onClick={() => {
            if (value?.questionId?.length !== 0) {
              onSelect(value?.questionId?.length);
            }
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: 0 }}>{value?.number}</h3>
            <h6 style={{ margin: "6px 0" }}>
              {key === "pending"
                ? "Defaulted"
                : key.charAt(0).toUpperCase() + key.slice(1).toUpperCase()}
            </h6>
            <div style={{ fontSize: "12px", color: "#666" }}>
              In the {key !== "Upcoming" ? "last" : "next"} 7 days
            </div>
          </div>
          <div>
            <img
              src={icons[key]}
              alt={updated}
              style={{ height: "20px", width: "20px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopComponent;
