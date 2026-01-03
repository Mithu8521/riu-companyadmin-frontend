import React from "react";
import TrainingDistribution from "./FrameworkFourtyEight/TrainingDistribution";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";

const TrainingSingleLocMultTime = ({
  companyFramework,
  timePeriods,
  dataOne,
  dataTwo,
  number,
  dataThree,
  brief,
  locationOption,
  timePeriodValues,
  dataFour
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
              <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataOne}
                title={"Trained on Health & Safety Measures"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Training"
                indexing={0}
              />
            </div>

            <div style={{ height: "100%" }} className="my-2 container">
              {/* <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataThree}
                title={"Trained on human rights issues and policies"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Training"
                indexing={0}
                numbers={number}
              /> */}
                            <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataFour}
                title={"Principles covered under the training"}
                DTYPE="PRIMAINTRAINING"
                unit="Number"
                tab="Training"
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
              <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataOne}
                title={"Trained on Skill Upgradation"}
                DTYPE="STRAINING"
                unit="Number"
                tab="Training"
                indexing={1}
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 container">
              <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataTwo}
                title={"Performance and career development reviews"}
                DTYPE="TRAINING"
                unit="Number"
                tab="Performance"
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
              <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataFour}
                title={"Total number of training and awareness programmes held"}
                DTYPE="MAINTRAINING"
                unit="Number"
                tab="Training"
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 ">
         
                   {/* <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataThree}
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
              <ProductWiseStacked
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                timePeriods={timePeriods}
                product={dataFour}
                title={"Percentage of persons covered by the awareness program"}
                DTYPE="PMAINTRAINING"
                unit="Percentage"
                tab=""
              />
            </div>
            <div style={{ height: "100%" }} className="my-2 ">
          
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    // <div className="d-flex flex-column flex-space-between">
    //   <div
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "120vh", marginBottom: "3%" }}
    //   >
    //     <div
    //       className="firsthalfprogressenergy"
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "space-between",
    //         width: "50%",
    //       }}
    //     >
    //       <div style={{ height: "49%" }}>
    //         <TrainingMultiLocOne
    //           title={"Health & Safety Measures"}
    //           number={0}
    //           matchedDataWaste={dataOne}
    //           timePeriods={timePeriods}
    //           timePeriodValues={timePeriodValues}
    //           horizontal={false}
    //         />
    //       </div>

    //       <div style={{ height: "49%" }}>
    //         <TrainingMultiLocOne
    //           title={"On Skill Upgradation"}
    //           number={0}
    //           matchedDataWaste={dataTwo}
    //           timePeriods={timePeriods}
    //           timePeriodValues={timePeriodValues}
    //           horizontal={false}
    //         />
    //       </div>
    //     </div>
    //     <div
    //       className="secondhalfprogress"
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "space-between",
    //         width: "50%",
    //       }}
    //     >
    //       <div style={{ height: "49%" }}>
    //         <TrainingMultiLocOne
    //           title={"Human Rights"}
    //           number={number}
    //           matchedDataWaste={dataThree}
    //           timePeriods={timePeriods}
    //           timePeriodValues={timePeriodValues}
    //           horizontal={false}
    //         />
    //       </div>
    //       <div style={{ height: "46%" }}></div>
    //     </div>
    //   </div>
    // </div>
    <div className="d-flex flex-column flex-space-between">
      <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "60vh", marginBottom: "3%" }}
      >
        <div
          className="firsthalfprogressenergy"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <div style={{ height: "100%" }}>
            <TrainingDistribution
              brief={brief}
              locationOption={locationOption}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              categories={["Average training hours per employee"]}
              shortenedCategories={["Average training hours per employee"]}
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
            width: "50%",
          }}
        >
          <div style={{ height: "100%" }}>
            <TrainingDistribution
              brief={brief}
              locationOption={locationOption}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              categories={[
                "mock drills",
                "Fire Safety Audits",
                "Safety Trainings",
                "Safety Committee Meetings",
              ]}
              shortenedCategories={[
                "mock drills",
                "Fire Safety Audits",
                "Safety Trainings",
                "Safety Committee Meetings",
              ]}
              title="Development & Training"
            />
          </div>
          <div style={{ height: "0%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSingleLocMultTime;
