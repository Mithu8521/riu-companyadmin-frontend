import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import "./TrainingStats.css";
import view from "../img/ViewIcon.png";
import arroweTick from "../img/arroweTick.png";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import TrainingAcceptedIcon from "../img/Frame 1000001937.png";
import TrainingRejectedIcon from "../img/Frame 1000001937 (1).png";

const TrainingStats = ({ financialYearId }) => {
  const userId = Number(JSON.parse(localStorage.getItem("currentUser")).id);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [notCompletedCount, setNotCompletedCount] = useState(0);

  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);


  const getTraineeData = async () => {
    if(financialYearId){
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
      {},
      { type: "ALL", financialYearId }
    );

    if (isSuccess && data && Array.isArray(data.data) && isMounted.current) {
      const acceptedCount = data.data.filter((training) =>
        training.acceptedUserId.includes(userId)
      ).length;
      setAcceptedCount(acceptedCount);

      const rejectedCount = data.data.filter((training) =>
        training.nonAcceptedUserId.includes(userId)
      ).length;
      setRejectedCount(rejectedCount);
      const completedCount = data.data.filter((training) =>
        training.attendantUserId.includes(userId)
      ).length;
      setCompletedCount(completedCount);
      const notCompletedCount = data.data.filter((training) =>
        training.nonAttendantUserId.includes(userId)
      ).length;

      setNotCompletedCount(notCompletedCount);
    } else {
      setAcceptedCount(0);
      setRejectedCount(0);
      setCompletedCount(0);
      setNotCompletedCount(0);
    }
  }
  };

  useEffect(() => {
    getTraineeData();
  }, []);
  return (
    <div className="training-stats-grid ">
      <Card className="training-stat-box " style={{ borderRadius: "10px" }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Number Of Training Accepted
                </div>
              </div>
              <div className="icon">
                <img src={TrainingAcceptedIcon} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{acceptedCount}</p>
          </div>
        </Card.Body>
      </Card>

      <Card className="training-stat-box" style={{ borderRadius: "10px" }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Number Of Training Rejected
              </div>
              <div className="icon">
                <img src={TrainingRejectedIcon} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{rejectedCount}</p>
          </div>
        </Card.Body>
      </Card>

      <Card className="training-stat-box" style={{ borderRadius: "10px" }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Number Of Training Completed
              </div>
              <div className="icon">
                <img src={arroweTick} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{completedCount}</p>
          </div>
        </Card.Body>
      </Card>
      <Card className="training-stat-box" style={{ borderRadius: "10px" }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Number Of Training Not Completed
              </div>
              <div className="icon">
                <img src={TrainingRejectedIcon} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{notCompletedCount}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrainingStats;
