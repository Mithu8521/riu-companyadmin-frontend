import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const TotalWaterWithdrawnSingle = ({ type, financialYearId }) => {
  const [trainingData, setTrainingData] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState("EMPLOYEES_PERMANENT");
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [acceptedData, setAcceptedData] = useState(0);
  const [notGenerated, setNotGenerated] = useState(0);
  const [maxValue, setMaxValue] = useState(12);

  // Calculate bar widths as percentage
  const withdrawnWidth = (acceptedData / maxValue) * 100;
  const notWithdrawnWidth = (notGenerated / maxValue) * 100;

  const updateConsumptionData = (training) => {
    const accepted =
      type === "registration" ? training?.acceptedUserId?.length || 0 : training?.attendantUserId?.length || 0;
    const rejected =
      type === "registration" ? training?.nonAcceptedUserId?.length || 0 : training?.nonAttendantUserId?.length || 0;

    setAcceptedData(accepted);
    setNotGenerated(rejected);
    setMaxValue(Math.max(accepted, rejected) + 5 || 12);
  };

  const handleAudienceChange = (event) => {
    const selectedAudience = event.target.value;
    setSelectedAudience(selectedAudience);
    const matchedTrainings = trainingData.filter((training) => {
      const audienceArray = JSON.parse(training.targetAudience);
      return audienceArray.includes(selectedAudience);
    });
    setFilteredTrainings(matchedTrainings);

    if (matchedTrainings.length > 0) {
      setSelectedTraining(matchedTrainings[0]);
      updateConsumptionData(matchedTrainings[0]);
    } else {
      setSelectedTraining(null);
      setAcceptedData(0);
      setNotGenerated(0);
    }
  };

  const handleTrainingChange = (event) => {
    const selectedTitle = event.target.value;
    const selected = filteredTrainings.find((training) => training.trainingTitle === selectedTitle);
    setSelectedTraining(selected);
    if (selected) {
      updateConsumptionData(selected);
    }
  };

  const getTrainingData = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTrainingData`,
      {},
      { financialYearId:financialYearId||1 }
    );

    if (isSuccess) {
      setTrainingData(data?.data);
      const matchedTrainings = data?.data.filter((training) => {
        const audienceArray = JSON.parse(training.targetAudience);
        return audienceArray.includes(selectedAudience);
      });
      setFilteredTrainings(matchedTrainings);

      if (matchedTrainings.length > 0) {
        setSelectedTraining(matchedTrainings[0]);
        updateConsumptionData(matchedTrainings[0]);
      }
    }
  };

  useEffect(() => {
    getTrainingData();
  }, []);

  const renderTooltipAccepted = (props) => (
    <Tooltip id="accepted-employees-tooltip" {...props}>
      {type === "registration" ? `Accepted Employees: ${acceptedData}` : `Completed Employees: ${acceptedData}`}
    </Tooltip>
  );

  const renderTooltipRejected = (props) => (
    <Tooltip id="rejected-employees-tooltip" {...props}>
      {type === "registration" ? `Rejected Employees: ${notGenerated}` : `Not Completed Employees: ${notGenerated}`}
    </Tooltip>
  );

  return (
    <div className="training-registration-status-container " style={{ height: "40vh", overflow: "auto" }}>
      {/* {filteredTrainings && filteredTrainings.length > 0 ? */}
        <> <div style={{ display: 'flex', }}>
          <div className="training-registration-header col-7" style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {type === "registration" ? "Training Registration Status Of Employees" : "Training Status Of Employees"}
          </div>

          <div className="audience-dropdown  text-end">
            <select onChange={handleAudienceChange} value={selectedAudience} className="col-5" style={{ fontWeight: 'bold', border: '1px solid #3F88A5', borderRadius: '10px', padding: '10px', width: "90%" }}>

              <option value="EMPLOYEES_PERMANENT">Permanent Employee</option>
              <option value="EMPLOYEES_TEMPORARY">Other than Permanent Employee</option>
              <option value="WORKERS_PERMANENT">Permanent Worker</option>
              <option value="WORKERS_TEMPORARY">Other than Permanent Worker</option>
              <option value="KMP">KMP</option>
              <option value="BOD">BOD</option>
            </select>
          </div>

        </div>

          <div className="training-category-dropdown">
            {
              filteredTrainings && filteredTrainings.length > 0 ?
                <select onChange={handleTrainingChange} value={selectedTraining?.trainingTitle || ""} className="col-12 mt-3 mb-3" style={{ borderRadius: '10px', padding: '10px', border: '1px solid #3F88A5' }}>
                  {filteredTrainings.map((training) => (
                    <option key={training.id} value={training.trainingTitle}>
                      {training.trainingTitle}
                    </option>
                  ))}
                </select> :
                <>
                  <div>
                    No Options Available
                  </div>
                </>
            }

          </div>
          <div className="training-bar-labels mt-3 mb-3" style={{ display: "flex", justifyContent: "space-between", width: "100%", fontWeight: 'bold' }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
            {[...Array(6)].map((_, index) => (
              <span key={index} style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
                {((maxValue / 6) * (index + 1)).toFixed(1)}
              </span>
            ))}
          </div>

          <div className="training-bar-dotted-line" style={{ width: "100%" }}></div>

          <div className="training-bars">
            <OverlayTrigger placement="top" overlay={renderTooltipAccepted}>
              <div className="training-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none", width: "100%" }}>
                <div
                  className="training-bar-filled"
                  style={{
                    width: `${withdrawnWidth}%`,
                    backgroundColor: "#3ABEC7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {acceptedData}
                </div>
              </div>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={renderTooltipRejected}>
              <div className="training-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none", width: "100%" }}>
                <div
                  className="training-bar-not-generated"
                  style={{
                    width: `${notWithdrawnWidth}%`,
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

          <div className="training-legend mt-4" style={{ display: "flex", gap: "10%" }}>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{
                  backgroundColor: type === "registration" ? "#68D098" : "#3ABEC7",
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  marginRight: "8px",
                  borderRadius: "50%",
                }}
              ></span>
              <span className="legend-label">{type === "registration" ? "Accepted Employees" : "Completed "}</span>
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
              <span className="legend-label">{type === "registration" ? "Rejected Employees" : "Not Completed "}</span>
            </div>
          </div>

        </> 
        {/* // : <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        //   <img src={no} height={"150px"} width={"150px"} />

        // </div> */}
      {/* } */}
    </div>
  );
};

export default TotalWaterWithdrawnSingle;
