import React from "react";

const TopComponentEmission = ({ lastWeekAcitivities, icons }) => {
  // Add safety check for null/undefined
  const filteredActivities = lastWeekAcitivities 
    ? Object.entries(lastWeekAcitivities)
        .filter(([key, value]) => key !== "message")
        .map(([key, value]) => ({ key, value }))
    : [];

  const onSelect = (data) => {
    localStorage.setItem("questionIds", data);
    window.location.href = "/#/sector_questions";
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
              {value?.number || 0}
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

export default TopComponentEmission;