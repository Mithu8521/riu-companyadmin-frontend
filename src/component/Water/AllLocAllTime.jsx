import React, { useEffect } from "react";
import VerticalBarComponentWater from "./FrameworkOne/VerticalBarComponentWater";
import WaterBarFourtyEight from "./FrameworkFourtyEight/WaterBarFourtyEight";
import CommonBarComponent from "./FrameworkFourtyEight/CommonBarComponent";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  brief,
  matchedDataWater,
  matchedWaterDis,
  timePeriodValues,
  timePeriods,
}) => {
  const areAllAnswersZero = (obj) => {
    if (!obj.answer || !Array.isArray(obj.answer)) {
      return false;
    }

    return obj.answer.every((item) => {
      if (!Array.isArray(item)) {
        return false;
      }

      for (const element of item) {
        if (typeof element === "number" && element !== 0) {
          return false;
        }
      }

      return true;
    });
  };
  const areAllObjectsZero = (dataArray) => {
    if (!Array.isArray(dataArray)) return false;
    return dataArray.every((obj) => areAllAnswersZero(obj));
  };

  return (
    <div>
      {companyFramework.includes(1) ? (
        <div className="d-flex flex-column flex-space-between">
          <div className="d-flex flex-row flex-space-between">
            <div
              className="firsthalfprogressenergy"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <div style={{ height: "100%" }} className="my-2 container">
                <TabularDataCalculator
                  graphData={matchedDataWater}
                  title={"Water Withdrawal"}
                  unit="KL"
                  tab="Water"
                />
              </div>
            </div>

            <div
              className="secondhalfprogress"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <div style={{ height: "100" }} className="my-2 container">
                <TabularDataCalculator
                  graphData={matchedWaterDis}
                  title={"Water Discharged"}
                  unit="KL"
                  tab="Water"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column flex-space-between">
            <div
              className="d-flex flex-row flex-space-between"
            >
              <div
                className="firsthalfprogressenergy"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "50%",
                  marginTop: "10px",
                }}
              >
                <div className="my-2">
                  <WaterBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="COMS"
                  />
                </div>
              </div>
              <div
                className="secondhalfprogress"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "50%",
                  marginTop: "10px",
                }}
              >
                <div className="my-2">
                  <WaterBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="TREAT"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex flex-row flex-space-between">
              <div
                className="firsthalfprogressenergy"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="COMS"
                    tab="Water" 
                  />
                </div>
              </div>

              <div
                className="secondhalfprogress"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="TREAT"
                    tab="Water" 
                    showTotal={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllLocAllTime;
