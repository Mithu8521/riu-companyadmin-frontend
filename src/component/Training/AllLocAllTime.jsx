import React from "react";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  dataOne,
  dataTwo,
  number,
  dataThree,
  dataFour,
  brief,
  timePeriodValues,
  locationOption,
}) => {
  return companyFramework.includes(1) ? (
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
             
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataOne}
                title={"Trained on Health & Safety Measures"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Training"
                indexing={0}
              />
            </div>

            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataFour}
                title={"Percentage of persons covered by the awareness program"}
                DTYPE="PMAINTRAINING"
                unit="Percentage"
                tab=""
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
             
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataOne}
                title={"Trained on Skill Upgradation"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Training"
                indexing={1}
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataTwo}
                title={"Performance and career development reviews"}
                DTYPE="TRAINING"
                unit="Number"
                tab=""
                indexing={0}
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
             
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataFour}
                title={"Total number of training and awareness programmes held"}
                DTYPE="MAINTRAINING"
                unit="Number"
                tab="Training"
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 ">
              {/* <TabularDataCalculator
                graphData={dataThree}
                title={"Trained on human rights issues and policies"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Training"
                indexing={0}
                numbers={number}
              /> */}
            </div>
          </div>
          <div
            className="secondhalfprogress"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "50%",
             
            }}
          >
            <div style={{ height: "100%" }} className="my-2 container">
              <TabularDataCalculator
                graphData={dataFour}
                title={"Principles covered under the training"}
                DTYPE="PRIMAINTRAINING"
                unit="Number"
                tab="Training"
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 ">
              {/* <TabularDataCalculator
              graphData={wasteDisposal}
              title={"Total Waste Recovered"}
              com="COL"
              unit="mt"
              tab="Waste"
            /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default AllLocAllTime;
