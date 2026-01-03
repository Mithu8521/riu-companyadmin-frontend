import React from "react";
import SafetyBarFourtyEight from "./FrameworkFourtyEight/SafetyBarFourtyEight";
import SafetyBar from "./FrameworkOne/SafetyBar";
import { StackedSafety } from "./FrameworkOne/StackedSafety";
import { StackedSafetyNonPerm } from "./FrameworkOne/StackedSafetyNonPermanant";
import SafetyBarForRetirement from "./FrameworkOne/SafetyBarForRetirement";
import SafetyBarComp from "./FrameworkOne/SafetyBarComp";
import SafetyVerticalBarFourtyEight from "./FrameworkFourtyEight/SafetyVerticalBarFourtyEight";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const SafetySingleLocSingleTime = ({
  companyFramework,
  dataOne,
  titleOne,
  dataThree,
  dataTwo,
  titleTwo,
  titleThree,
  brief,
  type,
  datafour,
  titlefour,
  datafive,
  titlefive,
  safetyBrief,
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
        const numValue = Number(element);

        if (!isNaN(numValue) && numValue !== 0) {
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

  return companyFramework.includes(1) ? (
    <div className="d-flex flex-column flex-space-between">
      <div className="d-flex flex-column flex-space-between">
        <div className="d-flex flex-row flex-space-between">
          <div
            className="firsthalfprogressenergy"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "50%",
              // marginTop: "10px",
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <StackedSafety title={titleOne} data={dataOne} ttype= "PER" tttype = {type}/>
            </div>

            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataThree}
                title={titleThree}
                // DTYPE="OVERALL"
                type="SAFETY"
                unit="Number"
                tab="Safety"
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
              // marginTop: "10px",
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <StackedSafety title={titleTwo} data={dataTwo} ttype= "NPER" tttype = {type}/>
            </div>
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={datafour}
                title={titlefour}
                // DTYPE="OVERALL"
                type="DIV"
                unit="Number"
                tab="Benefit"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-space-between">
        <div className="d-flex flex-row flex-space-between">
          <div
            className="firsthalfprogressenergy"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "50%",
              // marginTop: "10px",
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={datafive}
                title={titlefive}
                DTYPE="COMPLAINTS"
                type="SAFETY"
                unit="Number"
                tab="Complaints"
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
              // marginTop: "10px",
            }}
          >
            <div style={{ height: "100%" }} className="my-2 "></div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="d-flex flex-column flex-space-between">
      <div
        className="d-flex flex-row flex-space-between"
        style={{ marginBottom: "3%" }}
      >
        <div
          className="firsthalfprogressenergy"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "50%",
            marginBottom: "20px",
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <TrendsDataCalculator brief={brief} type="INCIDENT" tab="Safety" />
          </div>
        </div>
        <div
          className="secondhalfprogress"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "50%",
            marginBottom: "20px",
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <TrendsDataCalculator
              brief={safetyBrief}
              heading="Development & Training"
              type="TRAINING"
              tab="Safety"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetySingleLocSingleTime;
