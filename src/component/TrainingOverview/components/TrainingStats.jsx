import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./TrainingStats.css";
import view from "../img/ViewIcon.png";
import arroweTick from "../img/arroweTick.png";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import CloseIcon from "../img/Frame 1000001937.png";

const TrainingStats = ({ financialYearId }) => {
  const [totalTraining, setTotalTraining] = useState(0);
  const [completedEmployee, setCompletedEmployee] = useState(0);
  const [notCompletedEmployee, setNotCompletedEmployee] = useState(0);

  const getTrainingData = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTrainingData`,
      {},
      { financialYearId:financialYearId||1 }
    );

    if (isSuccess && data && Array.isArray(data.data)) {
      setTotalTraining(data.data.length || 0);

      const completedEmployeeCount = data.data
        .filter((item) => Array.isArray(item.attendantUserId))
        .map((item) => item.attendantUserId)
        .flat().length;

      setCompletedEmployee(completedEmployeeCount);

      const nonCompletedEmployeeCount = data.data
        .filter((item) => Array.isArray(item.nonAttendantUserId))
        .map((item) => item.nonAttendantUserId)
        .flat().length;

      setNotCompletedEmployee(nonCompletedEmployeeCount);
    } else {
      setTotalTraining(0);
      setCompletedEmployee(0);
      setNotCompletedEmployee(0);
    }
  };

  useEffect(() => {
    getTrainingData();
  }, []);
  return (
    // <div className="training-stats-grid " style={{gridTemplateColumns: repeat(3, 1fr);}}>
    <div className="training-stats-grid " style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

      <Card className="training-stat-box " style={{ borderRadius: "10px", }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info " >
              <div>
                <div style={{ fontSize: "20px", fontWeight: "bold", }} className="ms-0">
                  Number Of Total Trainings Created

                  {/* Number Of Trainings Created */}
                </div>
              </div>
              <div className="icon">
                <img src={view} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{totalTraining}</p>
          </div>
        </Card.Body>
      </Card>



      <Card className="training-stat-box" style={{ borderRadius: "10px", }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Number Of Employees Completed Trainings
              </div>
              <div className="icon">
                <img src={CloseIcon} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{completedEmployee}</p>
          </div>
        </Card.Body>
      </Card>

      <Card className="training-stat-box" style={{ borderRadius: "10px", }}>
        <Card.Body>
          <div className="training-stat-content">
            <div className="training-stat-info">
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Number Of Employees Not Completed Trainings
              </div>
              <div className="icon">
                <img src={arroweTick} alt="view" />
              </div>
            </div>
            <p className="training-stat-number">{notCompletedEmployee}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrainingStats;
