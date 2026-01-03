import React, { useEffect, useState, useRef } from "react";
import { BsDash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button } from "react-bootstrap";
import NoDataFound from "../../../img/no.png";
import AccodianTrainingRegisteredOverview from "./AccodianTrainingRegisteredOverview.jsx";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const TrainingDetailsOverview = ({ type, updateCheck, setUpdateCheck, financialYearId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [training, setTraining] = useState([]);

  const toggleOpen = (training) => {
    setIsOpen(!isOpen);
    setTraining(training);
  };

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
      { type, financialYearId },
      "GET"
    );

    if (isSuccess && isMounted.current) {
      setTrainings(data.data);
      setIsOpen(false);
    }
  } 
  };

  const validatedTrainingStatus = async (trainingId, trainingStatus) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}validatedTrainingStatus`,
      {},
      { trainingId, trainingStatus },
      "POST"
    );

    if (isSuccess && isMounted.current) {
      getTraineeData();
      setUpdateCheck(false);
    }
  };

  useEffect(() => {
    getTraineeData();
  }, []);

  useEffect(() => {
    getTraineeData();
  }, [updateCheck]);

  return (
    <div style={{}}>
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

        {trainings && trainings.length ? (
          <div>
            <div style={{ marginBottom: "20px" }}></div>
            <div style={{ ...styles.listContainer, overflow: "auto" }}>
              {type === "HISTORY" ? (
                <Tabs
                  defaultActiveKey="Expired Trainings"
                  transition={false}
                  style={{ color: "#3F88A5", overflow: "auto", width: "100%", marginLeft: "0", textAlign: "left" }}
                  className="mb-3"
                >
                  <Tab
                    style={{ overflow: "auto" }}
                    eventKey="Expired Trainings"
                    title="Expired Trainings"
                  >
                    {trainings.map((trainingItem, index) => (
                      <AccodianTrainingRegisteredOverview
                        index={index}
                        trainingItem={trainingItem}
                        training={training}
                        setTraining={setTraining}
                        setTrainings={setTrainings}
                        type={type}
                        updateCheck={updateCheck}
                        financialYearId={financialYearId}
                      />
                    ))}
                  </Tab>
                  <Tab
                    eventKey="Not Responded Trainings"
                    title="Not Responded Trainings"
                  >
                    Tab content for Profile
                  </Tab>
                </Tabs>
              ) : (
                <>
                  {trainings.map((trainingItem, index) => (
                    <AccodianTrainingRegisteredOverview
                      index={index}
                      trainingItem={trainingItem}
                      training={training}
                      setTraining={setTraining}
                      setTrainings={setTrainings}
                      type={type}
                      updateCheck={updateCheck}
                      financialYearId={financialYearId}
                    />
                  ))}
                </>
              )}
              {/* {trainings.map((trainingItem, index) => (
                <AccodianTrainingRegisteredOverview
                  index={index}
                  trainingItem={trainingItem}
                  training={training}
                  setTraining={setTraining}
                  setTrainings={setTrainings}
                  type={type}
                  updateCheck={updateCheck}
                />
              ))} */}
            </div>
          </div>
        ) : (
          <div
            className="hstack justify-content-center"
            style={styles.NoDataLogo}
          >
            <img src={NoDataFound} alt="" style={{ height: '270px', marginTop: '50px' }} />
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

  NoDataLogo: {
    height: '15vh '
  },
};
export default TrainingDetailsOverview;
