import React, { useEffect, useState, useRef } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import NoDataFound from "../../../img/no.png";
import AccodianTraining from "./accodianTraining";

const TrainingCatalogue = ({ updateCheck, setUpdateCheck ,financialYearId}) => {
  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [trainings, setTrainings] = useState([]);
  const [training, setTraining] = useState([]);
  // const [financialYear, setFinancialYear] = useState([]);
  // const [financialYearId, setFinancialYearId] = useState(0);
  const getTraineeData = async (fid) => {
    if(fid){
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeData`,
      {},
      { type: "UPCOMING", financialYearId: fid || financialYearId },
      "GET"
    );

    if (isSuccess) {
      setTrainings(data.data);
    }
  }
  };
  useEffect(() => {
    console.log(financialYearId)
    if(financialYearId){
      getTraineeData(financialYearId);
    }
  }, [financialYearId,updateCheck]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          margin: "auto",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "white",

          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Training Upcoming
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
        ) : (
          <></>
        )}

        {trainings && trainings.length ? (
          <div style={styles.listContainer}>
            {trainings.map((trainingItem, index) => (
              <AccodianTraining
                index={index}
                trainingItem={trainingItem}
                training={training}
                setTraining={setTraining}
                setTrainings={setTrainings}
                setUpdateCheck={setUpdateCheck}
                financialYearId={financialYearId}
              />
            ))}
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
  catalogueContainer: {
    border: "1px solid white",
    borderRadius: "10px",
    // marginTop: "2em",

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
    // marginTop: "20px",
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

export default TrainingCatalogue;

// import React from 'react';
// import calenderIcon from "../img/calenderIcon.png";
// import notificationIcon from "../img/notiIcon.png";

// const TrainingCatalogue = () => {
//   return (
//     <div style={styles.catalogueContainer}>
//     <div style={{display:'flex',justifyContent:'space-between'}} >
//     <div>

//         <h1 style={styles.title}>Training Catalogue</h1>
//            </div>
//          <div>
//            {"<"} June 2024 {">"}
//          </div>

//     </div>
//       <div style={styles.searchContainer}>
//         <div style={styles.searchBox}>
//           <input
//             type="text"
//             placeholder="Search topic name"
//             style={styles.searchInput}
//           />
//         </div>
//         <div style={styles.iconWrapper}>
//           <img src={calenderIcon} alt='calender' style={styles.icon}/>
//           <img src={notificationIcon} alt='notify'/>
//         </div>
//       </div>

//       <div style={styles.listContainer}>
//         {trainings.map((training, index) => (
//           <div key={index} style={styles.trainingItem}>
//             <div style={styles.numberBox}>
//               <span style={styles.number}>{training.number}</span>
//             </div>
//             <div style={styles.details}>
//               <h3 style={styles.titleText}>{training.title}</h3>
//               <p style={styles.meetingLink}>
//                 {training.linkText} - <span>{training.trainer}</span>
//               </p>
//               <p style={styles.location}>{training.location}</p>
//             </div>
//             <div style={styles.timeInfo}>
//               <div style={styles.timeRow}>
//                 <span style={styles.timeDot} />
//                 <span style={styles.time}>{training.time}</span>
//               </div>
//               <span style={styles.status}>{training.status}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const trainings = [
//   {
//     number: '30',
//     title: 'Online mandatory trainings (global)',
//     linkText: 'Meeting link //www.zoom.com',
//     trainer: 'Arun Pinto',
//     location: '',
//     time: '10 A.M - 11 A.M',
//     status: 'Upcoming',
//   },
//   {
//     number: '24',
//     title: 'Induction for new joiners',
//     linkText: 'Meeting link //www.zoom.com',
//     trainer: 'Rajesh Naik',
//     location: '',
//     time: '10 A.M - 11 A.M',
//     status: 'Upcoming',
//   },
// ];

// export default TrainingCatalogue;
