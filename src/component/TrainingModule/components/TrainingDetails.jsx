import React, { useEffect, useState, useRef } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import NoDataFound from "../../../img/no.png";
import AccodianTrainingRegistered from "./AccodianTrainingRegistered";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const TrainingDetails = ({ type, updateCheck, setUpdateCheck,financialYearId }) => {
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [trainings, setTrainings] = useState([]);
  const [training, setTraining] = useState([]);
  const [expired, setExpired] = useState([]);
  const [nonResponded, setNonResponded] = useState([]);
  // const [financialYear, setFinancialYear] = useState([]);
  // const [financialYearId, setFinancialYearId] = useState(0);
  const getTraineeData = async (fid) => {
    if(fid){
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
      {},
      { type, financialYearId: fid || financialYearId },
      "GET"
    );

    if (isSuccess) {
      setTrainings(data.data);
      const nonAcceptedArray = data.data.filter((item) =>
        item.nonAcceptedUserId.includes(Number(currentUser.id))
      );

      const otherArray = data.data.filter(
        (item) => !item.nonAcceptedUserId.includes(Number(currentUser.id))
      );
      setExpired(otherArray);

      setNonResponded(nonAcceptedArray);

      setIsOpen(false);
    }
  }
  };

  useEffect(() => {
    if(financialYearId){
      getTraineeData(financialYearId);
    }
  }, [financialYearId,updateCheck]);


  return (
    <div style={{ padding: "20px", marginTop: "1.5em" }}>
      {type === "REGISTERED" ? (
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>My Trainings</div>
      ) : (
        <></>
      )}

      <div
        style={{
          margin: "auto",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "white",
          marginTop: "1.5em",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Training{" "}
            {type === "REGISTERED"
              ? "Registered"
              : type === "COMPLETED"
                ? "Completed"
                : type === "HISTORY"
                  ? "History"
                  : "Not Completed"}
          </p>

          {/* <div className="mx-4">
            <select
              className="sector-question-select"
              value={
                financialYearId ||
                (financialYear.length > 0
                  ? financialYear[financialYear.length - 1].id
                  : "")
              }
              onChange={async (e) => {
                setFinancialYearId(e.target.value);
              }}
            >
              <option value={0}>Select Financial Year</option>
              {financialYear?.map((item, key) => (
                <option key={key} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        {trainings && trainings.length ? (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Search trainings..."
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #3F88A5",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            </div>
            <div style={styles.listContainer}>
              {type === "HISTORY" ? (
                <Tabs
                  defaultActiveKey="Expired Trainings"
                  transition={false}
                  style={{ color: "#3F88A5" }}
                  className="mb-3"
                >
                  <Tab eventKey="Expired Trainings" title="Expired Trainings">
                    {expired.map((trainingItem, index) => (
                      <AccodianTrainingRegistered
                        index={index}
                        trainingItem={trainingItem}
                        training={training}
                        setTraining={setTraining}
                        setTrainings={setTrainings}
                        type={type}
                        updateCheck={updateCheck}
                        setUpdateCheck={setUpdateCheck}
                        financialYearId={financialYearId}
                      />
                    ))}
                  </Tab>
                  <Tab
                    eventKey="Not Responded Trainings"
                    title="Not Responded Trainings"
                  >
                    {nonResponded.map((trainingItem, index) => (
                      <AccodianTrainingRegistered
                        index={index}
                        trainingItem={trainingItem}
                        training={training}
                        setTraining={setTraining}
                        setTrainings={setTrainings}
                        type={type}
                        updateCheck={updateCheck}
                        setUpdateCheck={setUpdateCheck}
                        financialYearId={financialYearId}
                      />
                    ))}
                  </Tab>
                </Tabs>
              ) : (
                <>
                  {trainings.map((trainingItem, index) => (
                    <AccodianTrainingRegistered
                      index={index}
                      trainingItem={trainingItem}
                      training={training}
                      setTraining={setTraining}
                      setTrainings={setTrainings}
                      type={type}
                      updateCheck={updateCheck}
                      setUpdateCheck={setUpdateCheck}
                      financialYearId={financialYearId}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="hstack justify-content-center">
            <img src={NoDataFound} alt="" srcSet="" />
          </div>
        )}
      </div>
    </div>
  );
};
const styles = {
  listContainer: {
    marginTop: "20px",
  },
};
export default TrainingDetails;
