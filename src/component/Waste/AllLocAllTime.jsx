import React from "react";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight";
import VerticalWasteBarComponent from "./FrameworkFourtyEight/VerticalWasteBarComponent";
import TotalWasteGeneratedByVertical from "./FrameworkOne/TotalWasteGeneratedByVertical";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  timePeriods,
  brief,
  timePeriodValues,
  locationOption,
  matchedDataWaste,
  wasteDisposal,
  wasteRecovered,
  bioMedicalBrief,
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
                  graphData={matchedDataWaste}
                  title={"Total Waste Generated"}
                  com="COL"
                  unit="mt"
                  tab="Waste"
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
                  graphData={wasteDisposal}
                  title={"Total Waste Disposed"}
                  com="COL"
                  unit="mt"
                  tab="Waste"
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
                <TabularDataCalculator
                  graphData={wasteRecovered}
                  title={"Total Waste Recovered"}
                  com="COL"
                  unit="mt"
                  tab="Waste"
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
              <div style={{ height: "100" }} className="my-2"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column flex-space-between">
            <div className="d-flex flex-row flex-space-between">
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
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="HAZ"
                  />
                </div>

                {/* <div className="my-2">
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={bioMedicalBrief}
                    timePeriods={timePeriods}
                    type="BIO"
                  />
                </div> */}
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
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="NONHAZ"
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
                    type="HAZ"
                    tab="Waste"
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
                    type="NONHAZ"
                    tab="Waste"
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
                  {/* <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={bioMedicalBrief}
                    timePeriods={timePeriods}
                    type="BIO"
                    tab="Waste" 
                  /> */}
                  <TabularDataCalculator
                    graphData={bioMedicalBrief}
                    title={"Bio-Medical Waste Ganerated"}
                    com="COL"
                    unit="Kg"
                    tab="Waste"
                    type="BIO"
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
                <div style={{ height: "100" }} className="my-2 "></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllLocAllTime;
