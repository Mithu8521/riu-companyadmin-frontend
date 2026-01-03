import React from "react";
import SafetyMultiBar from "./FrameworkOne/SafetyMultiBar";
import SafetyLine from "./FrameworkFourtyEight/SafetyLine";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const SafetySingleLocMultTime = ({
  timePeriods,
  dataOne,
  dataThree,
  type,
  brief,
  companyFramework,
  locationOption,
  timePeriodValues,
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
    // <div className="d-flex flex-column flex-space-between">
    //   <div
    //     className="d-flex flex-row justify-content-between"
    //     style={{ height: "55vh", marginBottom: "1%" }}
    //   >
    //     <div className="w-50 mx-2 container">
    //       <SafetyMultiBar
    //         type={type}
    //         timePeriods={timePeriods}
    //         matchedDataWater={dataOne}
    //         locationOption={locationOption}
    //         timePeriodValues={timePeriodValues}
    //         number={0}
    //       />
    //     </div>
    //     <div className="w-50 mx-2 container">
    //       <SafetyMultiBar
    //         timePeriods={timePeriods}
    //         matchedDataWater={dataOne}
    //         type={type}
    //         locationOption={locationOption}
    //         timePeriodValues={timePeriodValues}
    //         number={1}
    //       />
    //     </div>
    //   </div>
    //   <div
    //     className="d-flex flex-row justify-content-between"
    //     style={{ height: "55vh", marginBottom: "1%" }}
    //   >
    //     <div className="w-50 mx-2 container">
    //       <SafetyMultiBar
    //         type={type}
    //         timePeriods={timePeriods}
    //         matchedDataWater={dataOne}
    //         locationOption={locationOption}
    //         timePeriodValues={timePeriodValues}
    //         number={2}
    //       />
    //     </div>

    //     <div className="w-50 mx-2 container">
    //       <SafetyMultiBar
    //         timePeriods={timePeriods}
    //         number={3}
    //         locationOption={locationOption}
    //         type={type}
    //         timePeriodValues={timePeriodValues}
    //         matchedDataWater={dataOne}
    //       />
    //     </div>
    //   </div>
    // </div>
    <div className="d-flex flex-column flex-space-between">
      <div className="d-flex flex-row flex-space-between">
        <div
          className="firsthalfprogressenergy"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              title={`Permanent Male ${type}`}
              unit="Number"
              tab="Safety"
              indexing={0}
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
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              title={`Permanent Female ${type}`}
              unit="Number"
              tab="Safety"
              indexing={1}
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
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              title={`Other than Permanent Male ${type}`}
              unit="Number"
              tab="Safety"
              indexing={2}
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
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              title={`Other than Permanent Female ${type}`}
              unit="Number"
              tab="Safety"
              indexing={3}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              brief={brief}
              locationOption={locationOption}
              type="INCIDENT"
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              brief={brief}
              type="TRAINING"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetySingleLocMultTime;
