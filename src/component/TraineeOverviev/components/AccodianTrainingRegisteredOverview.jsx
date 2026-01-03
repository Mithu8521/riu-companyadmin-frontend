import React, { useEffect, useState, useRef } from "react";
import { BsDash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button } from "react-bootstrap";
import downloadIcon from "../img/downloadIcon.png";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import "./AccodianTrainingRegisteredOverview.css";

function AccodianTrainingRegisteredOverview({
  index,
  trainingItem,
  training,
  setTraining,
  setTrainings,
  type,
  setUpdateCheck,
  updateCheck,
  financialYearId,
}) {
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (training) => {
    setIsOpen(!isOpen);
    setTraining(training);
  };

  const getTraineeData = async () => {
    if (financialYearId) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
        {},
        { type: type, financialYearId },
        "GET"
      );

      if (isSuccess && isMounted.current) {
        setTrainings(data.data);
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
    <>
      <div>
        <div className="">
          <div key={index} style={styles.trainingItem}>
            <div style={styles.numberBox}>
              <span style={styles.number}>{index + 1}</span>
            </div>
            <div style={styles.details}>
              <h3 style={styles.titleText}>
                {trainingItem.trainingTitle} - {Array.isArray(trainingItem.trainers)
                        ? trainingItem.trainers.map((t) => t.name).join(", ")
                        : trainingItem.trainers || ""}
              </h3>
            </div>

            <span>
              {type === "COMPLETED" ? (
                <div className="w-100">
                  <div className=" d-flex" style={{}}>
                    <div className="ms-4">
                      <button
                        onClick={() => toggleOpen(trainingItem)}
                        style={{
                          border: "2px solid black",
                          borderRadius: "10px",
                          padding: "5px",
                          marginRight: "20px",
                          marginBottom: "10px",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "24px",
                          fontWeight: "bold",
                          transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        {isOpen ? <BsDash /> : <IoMdAdd />}
                      </button>
                    </div>
                    <div className="">
                      <div
                        style={{
                          border: "2px solid black",
                          padding: "6px",
                          borderRadius: "10px",
                        }}
                      >
                        <img src={downloadIcon} alt="download" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => toggleOpen(trainingItem)}
                  style={{
                    border: "2px solid black",
                    borderRadius: "10px",
                    padding: "5px",
                    marginRight: "20px",
                    marginBottom: "10px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "24px",
                    fontWeight: "bold",
                    transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {isOpen ? <BsDash /> : <IoMdAdd />}
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "10px",
            padding: "15px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Link For The Meeting</th>
              </tr>
            </thead>
            <tbody>
              <td>{Array.isArray(training.trainers)
                        ? training.trainers.map((t) => t.name).join(", ")
                        : training.trainers || ""}</td>
              <td>
                {" "}
                {`${new Date(
                  training.fromDate
                ).toLocaleDateString()} to ${new Date(
                  training.toDate
                ).toLocaleDateString()}`}
              </td>
              <td>{`${training.fromTime} to ${training.toTime}`}</td>
              <td>
                {training.modeOfTraining === "OFFLINE" ? "Offline" : "Online"}
              </td>
              <td>
                <a
                  href={training.linkOrVenues}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {training.linkOrVenues}
                </a>
              </td>
            </tbody>
          </table>

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "48%" }}>
              <h6>Training Description</h6>
              <p>{training.description}</p>
            </div>
            {/* <div style={{ width: "48%" }}>
              <h6>Target Audience</h6>
              <p>
                {training.targetAudience &&
                  JSON.parse(training.targetAudience)
                    .map((audience) => {
                      switch (audience) {
                        case "EMPLOYEES_PERMANENT":
                          return "Permanent Employees";
                        case "EMPLOYEES_TEMPORARY":
                          return "Other than Permanent Employees";
                        case "WORKERS_PERMANENT":
                          return "Permanent Workers";
                        case "WORKERS_TEMPORARY":
                          return "Other than Permanent Workers";
                        case "KMP":
                          return "KMP";
                        case "BOD":
                          return "BOD";
                        default:
                          return audience;
                      }
                    })
                    .join(", ")}
              </p>
            </div> */}
          </div>
          {type === "REGISTERED" ? (
            <div className="w-100">
              <div className=" d-flex" style={{}}>
                <div className="">
                  <Button
                    variant="success"
                    onClick={() =>
                      validatedTrainingStatus(training.id, "ATTENDANT")
                    }
                  >
                    Completed
                  </Button>
                </div>

                <div className="ms-4">
                  <Button
                    variant="danger"
                    onClick={() =>
                      validatedTrainingStatus(training.id, "NON_ATTENDANT")
                    }
                  >
                    Not Completed
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  catalogueContainer: {
    border: "1px solid white",
    borderRadius: "10px",
    marginTop: "2em",

    backgroundColor: "white",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
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
    marginTop: "20px",
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
    // height: "max-content",
    borderRadius: "10px",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // marginRight: "15px",
    // marginLeft: "15px",
    padding: "10px",
    cursor: "pointer",
  },
  RejectBox: {
    backgroundColor: "#B80000",
    fontSize: "14px",
    width: "auto",
    // height: "max-content",
    borderRadius: "10px",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // marginRight: "15px",
    // marginLeft:'15px',
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
    marginTop: "8px",
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

export default AccodianTrainingRegisteredOverview;
