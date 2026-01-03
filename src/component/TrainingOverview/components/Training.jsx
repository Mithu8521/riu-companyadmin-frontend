import React from "react";
import TrainingRegistrationStatus from "./TrainingRegistrationStatus";

const Training = ({ financialYearId }) => {
  return (
    <div
      className="d-flex flex-row flex-space-between mt-5"
      style={{ height: "45vh", marginBottom: "3%" }}
    >
      <div
        className="firsthalfprogressenergy "
        style={{ backgroundColor: 'white', width: "50%", borderRadius: '10px', padding: '20px', height: "40vh", overflow: "hidden" }}
      >
        <TrainingRegistrationStatus type="registration" financialYearId={financialYearId} />
      </div>
      <div className="secondhalfprogress " style={{ width: "50%", backgroundColor: 'white', borderRadius: '10px', padding: '20px', height: "40vh", overflow: "auto" }}>
        <TrainingRegistrationStatus type="validation" financialYearId={financialYearId} />
      </div>
    </div>
  );
};

export default Training;
