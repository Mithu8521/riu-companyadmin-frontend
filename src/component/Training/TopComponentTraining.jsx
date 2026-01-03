import React from "react";
import "./TopComponentTraining.css"
const TopComponentTraining = ({ lastWeekAcitivities, icons }) => {
  const filteredActivities = Object.entries(lastWeekAcitivities)
    .filter(([key, value]) => key !== "message")
    .map(([key, value]) => ({ key, value }));

  const onSelect = (data) => {


    localStorage.setItem("questionIds", data);

    window.location.href = "/#/sector_questions";
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
            <h3 className="h3-spacing">{value.number}</h3>
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
          {/* <h3>{key}</h3>
                    <p>{value}</p> */}
        </div>
      ))}
    </div>
  );
};

export default TopComponentTraining;
