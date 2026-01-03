import React, { useEffect } from "react";
import TrainingRegistrationStatus from "./TrainingRegistrationStatus";
import TrainingCatalogueOverview from "./TrainingCatalogueOverview";
import TrainingDetailsOverview from "./TrainingDetailsOverview";

const Training = ({ financialYearId }) => {

  return (
    <div>
      <div
        className="d-flex  flex-space-between mt-5"
        style={{ height: "40vh", marginBottom: "3%" }}
      >
        <div
          className="firsthalfprogressenergy  "
          style={{
            padding: "20px",
            backgroundColor: "white",
            width: "50%",
            borderRadius: "10px",
            height: "40vh",
            overflow: "auto",
          }}
        >
          <TrainingRegistrationStatus
            type="registration"
            financialYearId={financialYearId}
          />
        </div>
        <div
          className="secondhalfprogress "
          style={{
            width: "50%",
            height: "40vh",
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          {/* <TrainingCatalogue /> */}
          <TrainingCatalogueOverview financialYearId={financialYearId} />
        </div>
      </div>

      <div
        className="d-flex  flex-space-between "
        style={{ height: "40vh", marginBottom: "3%", overflow: "auto" }}
      >
        <div
          className="firsthalfprogressenergy "
          style={{
            width: "50%",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            height: "40vh",
            overflow: "auto",
          }}
        >
          <TrainingRegistrationStatus
            type="history"
            financialYearId={financialYearId}
          />
        </div>
        <div
          className="secondhalfprogress "
          style={{
            width: "50%",
            height: "40vh",
            overflow: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          {/* <TrainingDetails type='HISTORY' /> */}
          <TrainingDetailsOverview
            type="HISTORY"
            financialYearId={financialYearId}
          />
        </div>
      </div>
    </div>
  );
};

export default Training;
