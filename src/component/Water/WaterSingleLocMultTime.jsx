import React from "react";
import WaterHorizontalBar from "./FrameworkFourtyEight/WaterHorizontalBar";
import MultipleBarWater from "./FrameworkOne/MultipleBarWater";
import WaterBarFourtyEight from "./FrameworkFourtyEight/WaterBarFourtyEight";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const WaterSingleLocMultTime = ({
  companyFramework,
  timePeriods,
  matchedDataWater,
  matchedWaterDis,
  brief,
  locationOption,
  timePeriodValues,
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

  return companyFramework.includes(1) ? (
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={matchedDataWater}
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={matchedWaterDis}
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
              <ProductWiseTrendType
                timePeriodValues={timePeriodValues}
                brief={brief}
                type="COMS"
                locationOption={locationOption}
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
                type="TREAT"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaterSingleLocMultTime;
