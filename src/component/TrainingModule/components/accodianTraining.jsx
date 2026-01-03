import React, { useEffect, useState, useRef } from "react";
import { BsDash, BsEye, BsEyeSlash } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

function AccodianTraining({
  index,
  trainingItem,
  training,
  setTraining,
  setTrainings,
  setUpdateCheck,
  financialYearId,
}) {
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

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
        { type: "UPCOMING", financialYearId },
        "GET"
      );

      if (isSuccess && isMounted.current) {
        setTrainings(data.data);
      }
    }
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

    if (isSuccess) {
      getTraineeData();
      setUpdateCheck(false);
    }
  };

  useEffect(() => {
    getTraineeData();
  }, []);

  return (
    <>
      <div>
        <div className="d-flex ">
          <div
            key={index}
            style={styles.trainingItem}
            className={
              trainingItem.acceptedUserId.includes(Number(currentUser.id)) ||
              trainingItem.nonAcceptedUserId.includes(Number(currentUser.id))
                ? "col-12"
                : "col-12"
            }
          >
            <div style={styles.numberBox}>
              <span style={styles.number}>{index + 1}</span>
            </div>
            <div style={styles.details}>
              <h3 style={styles.titleText}>
                {trainingItem.trainingTitle} - {Array.isArray(trainingItem.trainers)
                        ? trainingItem.trainers.map((t) => t.name).join(", ")
                        : trainingItem.trainers || ""}
              </h3>
              <p style={styles.meetingLink}>
                <a
                  href={trainingItem.linkOrVenues}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {trainingItem.linkOrVenues}
                </a>
              </p>
            </div>

            {/* <button
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
            </button> */}
            <div style={styles.timeInfo}>
              <div style={styles.timeRow}>
                <span style={styles.timeDot} />
                <span
                  style={styles.time}
                >{`${trainingItem.fromTime} to ${trainingItem.toTime}`}</span>
              </div>
              <span style={styles.DateStyle}>
              {" "}
                {`${new Date(
                  trainingItem.fromDate
                ).toLocaleDateString()} to ${new Date(
                  trainingItem.toDate
                ).toLocaleDateString()}`}
              </span>
            </div>
            {trainingItem.acceptedUserId.includes(Number(currentUser.id)) ||
            trainingItem.nonAcceptedUserId.includes(Number(currentUser.id)) ? (
              <></>
            ) : (
              <div
                className=" d-flex align-items-center "
                style={{ justifyContent: "space-around" }}
              >
                <div style={styles.buttunBox} className="ms-3 me-3">
                  <span
                    style={styles.number}
                    onClick={() =>
                      validatedTrainingStatus(trainingItem.id, "ACCEPTED")
                    }
                  >
                    {" "}
                    Accept
                  </span>
                </div>
                <div style={styles.RejectBox} className="me-3">
                  <span
                    style={styles.number}
                    onClick={() =>
                      validatedTrainingStatus(trainingItem.id, "REJECTED")
                    }
                  >
                    Reject
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => toggleOpen(trainingItem)}
              style={{
                border: "2px solid black",
                borderRadius: "10px",
                className: " align-items-center",
                padding: "5px",
                marginRight: "20px",
                // marginBottom: "px",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "bold",
                transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
               {isOpen ? <BsEye /> : <BsEyeSlash />}
            </button>
          </div>

          {trainingItem.acceptedUserId.includes(Number(currentUser.id)) ||
          trainingItem.nonAcceptedUserId.includes(Number(currentUser.id)) ? (
            <></>
          ) : (
            <>
              {/* <div
              className="col-2 d-flex align-items-center "
              style={{ justifyContent: "space-around" }}
            >
              <div style={styles.buttunBox}>
                <span
                  style={styles.number}
                  onClick={() =>
                    validatedTrainingStatus(trainingItem.id, "ACCEPTED")
                  }
                >
                  {" "}
                  Accept
                </span>
              </div>
              <div style={styles.RejectBox}>
                <span
                  style={styles.number}
                  onClick={() =>
                    validatedTrainingStatus(trainingItem.id, "REJECTED")
                  }
                >
                  Reject
                </span>
              </div>
            </div> */}
            </>
          )}
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
              marginBottom: "5px",
            }}
          >
            <thead>
              <tr style={styles.tableheadaccodian}>
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
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#3F88A5",
                }}
              >
                Training Description
              </span>
              <p>{training.description}</p>
            </div>
            {/* <div style={{ width: "48%" }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: "#3F88A5" }}>Target Audience</span>
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
  tableheadaccodian: {
    fontWeight: "bold",
    fontSize: "16px",
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
    cursor: "pointer",
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

export default AccodianTraining;
