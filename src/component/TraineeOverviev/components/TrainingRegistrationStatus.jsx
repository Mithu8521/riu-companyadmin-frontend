import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const TotalWaterWithdrawnSingle = ({ type, financialYearId }) => {
  const userId = Number(JSON.parse(localStorage.getItem("currentUser")).id);
  const [accepteddata, setAcceptedData] = useState(0);
  const [notGenerated, setNotGenerated] = useState(0);
  const [maxValue, setMaxValue] = useState(12);

  const withdrawnWidth = (accepteddata / maxValue) * 100;
  const notWithdrawnWidth = (notGenerated / maxValue) * 100;

  const getTrainingData = async () => {
    if(financialYearId){
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
      {},
      { type: "ALL", financialYearId:financialYearId||1 }
    );

    if (isSuccess && data && Array.isArray(data.data)) {
      const completedEmployeeCount = data.data.filter((training) =>
        type === "registration"
          ? training.acceptedUserId.includes(userId)
          : training.attendantUserId.includes(userId)
      ).length;

      setAcceptedData(completedEmployeeCount);

      const nonCompletedEmployeeCount = data.data.filter((training) =>
        type === "registration"
          ? training.nonAcceptedUserId.includes(userId)
          : training.nonAttendantUserId.includes(userId)
      ).length;

      setNotGenerated(nonCompletedEmployeeCount);
      setMaxValue(
        Math.max(completedEmployeeCount, nonCompletedEmployeeCount) + 5
      );
    } else {
      setAcceptedData(0);
      setNotGenerated(0);
    }
  }
  };

  useEffect(() => {
    getTrainingData();
  }, []);

  const renderTooltipAccepted = (props) => (
    <Tooltip id="accepted-employees-tooltip" {...props}>
      {type === "registration"
        ? `Accepted Employees: ${accepteddata}`
        : `Completed Employees: ${accepteddata}`}
    </Tooltip>
  );

  const renderTooltipRejected = (props) => (
    <Tooltip id="rejected-employees-tooltip" {...props}>
      {type === "registration"
        ? `Rejected Employees: ${notGenerated}`
        : `Not Completed Employees: ${notGenerated}`}
    </Tooltip>
  );

  return (
    <div className="training-registration-status-container">
      <div
        className="training-registration-header"
        style={{ fontWeight: "bold", fontSize: "20px" }}
      >
        {type === "registration"
          ? "Training Registration Status"
          : "Training Completion Status"}
      </div>
      <div className="mt-5 " style={{ fontSize: "12px", color: "#ccc" }}>
        Number Of Trainingss
      </div>
      {/* Scale Labels */}
      <div
        className="training-bar-labels mt-3 mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        {[...Array(6)].map((_, index) => (
          <span key={index} style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
            {((maxValue / 6) * (index + 1)).toFixed(1)}
          </span>
        ))}
      </div>

      <div className="training-bar-dotted-line" style={{ width: "100%" }}></div>

      {/* Bars */}
      <div className="training-bars">
        <OverlayTrigger placement="top" overlay={renderTooltipAccepted}>
          <div
            className="training-bar"
            style={{
              marginBottom: "2%",
              backgroundColor: "rgba(28, 28, 28, 0.05)",
              border: "none",
              width: "100%", // Make the bar take the full width of the parent container
            }}
          >
            <div
              className="training-bar-filled"
              style={{
                width: `${withdrawnWidth}%`, // Use percentage for the bar fill width
                backgroundColor:
                  type === "registration" ? "#3F88A5" : "#3ABEC7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {accepteddata}
            </div>
          </div>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={renderTooltipRejected}>
          <div
            className="training-bar"
            style={{
              marginBottom: "2%",
              backgroundColor: "rgba(28, 28, 28, 0.05)",
              border: "none",
              width: "100%", // Make the bar take the full width of the parent container
            }}
          >
            <div
              className="training-bar-not-generated"
              style={{
                width: `${notWithdrawnWidth}%`, // Use percentage for the bar fill width
                backgroundColor: "#E57373",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {notGenerated}
            </div>
          </div>
        </OverlayTrigger>
      </div>

      {/* Legend */}
      <div
        className="training-legend mt-4"
        style={{ display: "flex", gap: "10%" }}
      >
        <div className="legend-item">
          <span
            className="legend-color"
            style={{
              backgroundColor: type === "registration" ? "#3F88A5" : "#3ABEC7",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "8px",
              borderRadius: "50%",
            }}
          ></span>
          <span className="legend-label">
            {type === "registration" ? "Accepted" : "Completed"}
          </span>
        </div>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{
              backgroundColor: "#E57373",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "8px",
              borderRadius: "50%",
            }}
          ></span>
          <span className="legend-label">
            {type === "registration" ? "Rejected" : "Not Completed"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalWaterWithdrawnSingle;
