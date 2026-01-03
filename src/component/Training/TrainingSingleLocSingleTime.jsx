import React from "react";
import TrainingBarFourtyEightTwo from "./FrameworkFourtyEight/TrainingBarTwo";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const TrainingSingleLocSingleTime = ({
  companyFramework,
  dataOne,
  dataTwo,
  number,
  dataThree,
  dataFour,
  brief,
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
    // <div className="d-flex flex-column flex-space-between">
    //   <div
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "25vh", marginBottom: "3%" }}
    //   >
    //     <div style={{ width: "100%" }}>
    //       <TrainingBarComponent
    //         number={0}
    //         dataOne={dataOne}
    //         title={"Health & Safety Measures"}
    //       />
    //     </div>
    //   </div>
    //   <div
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "25vh", marginBottom: "3%" }}
    //   >
    //     <div style={{ width: "100%" }}>
    //       <TrainingBarComponent
    //         number={1}
    //         dataOne={dataOne}
    //         title={"On Skill Upgradation"}
    //       />
    //     </div>
    //   </div>
    //   <div
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "25vh", marginBottom: "3%" }}
    //   >
    //     <TrainingBarComponent
    //       number={number}
    //       dataOne={dataThree}
    //       title={"Human Rights"}
    //     />
    //   </div>
    // </div>
    <>
      <div className="d-flex flex-column flex-space-between">
        <div
          className="d-flex flex-row flex-space-between"
          style={{ height: "30vh", marginBottom: "3%" }}
        >
          <div
            className="firsthalfprogressenergy"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "45%",
            }}
          >
            <div style={{ height: "80%" }}>
              {/* <TrainingBarFourtyEight brief={brief} /> */}
              <TrainingBarFourtyEightTwo
                brief={brief}
                categories={["Average training hours per employee"]}
                shortenedMap={{
                  "Average training hours per employee":
                    "Average training hours per employee",
                }}
                title="Average training hours per employee"
              />
            </div>

            <div style={{ height: "0%" }}></div>
          </div>
          <div
            className="secondhalfprogress"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "55%",
            }}
          >
            <div style={{ height: "80%" }}>
              <TrainingBarFourtyEightTwo
                brief={brief}
                categories={[
                  "mock drills",
                  "Fire Safety Audits",
                  "Safety Trainings",
                  "Safety Committee Meetings",
                ]}
                shortenedMap={{
                  "mock drills": "Mock Drills",
                  "Fire Safety Audits": "Fire Safety Audits",
                  "Safety Trainings": "Safety Trainings",
                  "Safety Committee Meetings": "Safety Committee Meetings",
                }}
                title="Development & Training"
              />
            </div>
            <div style={{ height: "0%" }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingSingleLocSingleTime;
