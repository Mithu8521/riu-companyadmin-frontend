import React, { useEffect, useState, useRef } from "react";
import { BsDash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import NoDataFound from "../../../img/no.png";
import AccodianTrainingOverview from "./accodianTrainingOverview";

const TrainingCatalogueOverview = ({ financialYearId }) => {
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [training, setTraining] = useState([]);

  const toggleOpen = (training) => {
    setIsOpen(!isOpen);
    setTraining(training);
  };


  const getTraineeData = async () => {
    if(financialYearId){
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
      {},
      { type: "UPCOMING", financialYearId },
      "GET"
    );

    if (isSuccess && isMounted.current) {
      setTrainings(data.data);
    }}
  };

  const validatedTrainingStatus = async (
    trainingId,
    invitationTrainingStatus
  ) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}validatedInvitedTraining`,
      {},
      { trainingId, invitationTrainingStatus },
      "POST"
    );

    if (isSuccess && isMounted.current) {
      getTraineeData();
    }
  };

  useEffect(() => {
    getTraineeData();
  }, []);

  return (
    <div style={{}}>
      <div
        style={{
          margin: "auto",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "white",

          borderRadius: "10px",
        }}
      >
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
          Training Upcoming
        </p>

        {trainings && trainings.length ? (
          <div style={{ marginBottom: "20px" }}>

          </div>
        ) : (
          <></>
        )}

        {trainings && trainings.length ? (
          <div style={{ ...styles.listContainer, overflow: 'auto' }}>
            {trainings.map((trainingItem, index) => (
              <AccodianTrainingOverview index={index} trainingItem={trainingItem} training={training} setTraining={setTraining} setTrainings={setTrainings} financialYearId={financialYearId} />
            ))}
          </div>
        ) : (
          <div className="hstack justify-content-center " style={styles.NoDataLogo} >
            <img src={NoDataFound} alt="" srcSet="" />
          </div>
        )}


      </div>
    </div>
  );
};

const styles = {
  catalogueContainer: {
    border: "1px solid white",
    borderRadius: "10px",

    backgroundColor: "white",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  NoDataLogo: {
    height: '20vh'
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: "20px",
  },
  DateStyle: {
    color: "#FF9924",
    fontSize: "12px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #3F88A5",
    borderRadius: "10px",
    padding: "5px 10px",
    width: "90%",
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    padding: "5px",
  },
  icon: {
    marginRight: "10px",
    color: "#000",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
  },
  dateText: {
    margin: "0 10px",
    fontSize: "14px",
    color: "#000",
  },
  listContainer: {
  },
  trainingItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#E9F6FB",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  numberBox: {
    backgroundColor: "#3F88A5",
    width: "40px",
    height: "40px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "15px",
  },
  buttunBox: {
    backgroundColor: "#3F88A5",
    fontSize: "14px",
    width: "auto",
    borderRadius: "10px",

    padding: "10px",
    cursor: "pointer",
  },
  RejectBox: {
    backgroundColor: "#B80000",
    fontSize: "14px",
    width: "auto",

    borderRadius: "10px",

    padding: "10px",
    cursor: "pointer",
  },
  number: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  details: {
    flex: 1,
  },
  titleText: {
    fontSize: "15px",
    // marginTop: "8px",
    color: "#000",
    fontWeight: "bold",
  },
  meetingLink: {
    fontSize: "12px",
    color: "#0052B4",
  },
  location: {
    fontSize: "12px",
    color: "#000",
  },
  timeInfo: {
    display: "flex",
    flexDirection: "column", // Keep status on a different line
    alignItems: "flex-end",
  },
  timeRow: {
    display: "flex",
    alignItems: "center", // Align dot and time in one line
    marginBottom: "5px", // Add space between time and status
  },
  timeDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#004FA4",
    borderRadius: "50%",
    marginRight: "5px",
  },
  time: {
    fontSize: "12px",
    color: "#000",
  },
  status: {
    fontSize: "12px",
    color: "#FF9924",
  },
};

export default TrainingCatalogueOverview;

