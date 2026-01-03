import React from "react";
import WasteDispMultLoc from "./FrameworkFourtyEight/WasteDispMultLoc";
import WasteGenMultLoc from "./FrameworkFourtyEight/WasteGenMultLoc";
import TotalWasteDisposedMulti from "./FrameworkOne/TotalWasteDisposedMulti";
import TotalWasteGeneratedMukt from "./FrameworkOne/TotalWasteGeneratedMukt";
import TotalWasteRecoMulti from "./FrameworkOne/TotalWasteRecoMulti";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const SingleLocMultTime = ({
  companyFramework,
  timePeriods,
  matchedDataWaste,
  wasteDisposal,
  wasteRecovered,
  brief,
  locationOption,
  timePeriodValues,
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
              product={matchedDataWaste}
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={wasteRecovered}
              title={"Total Waste Recovered"}
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={wasteDisposal}
              title={"Total Waste Disposed"}
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
          <div style={{ height: "100" }} className="my-2 "></div>
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

          <div className="my-2">
            <WasteConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={bioMedicalBrief}
              timePeriods={timePeriods}
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              brief={brief}
              timePeriods={timePeriods}
              type="HAZ"
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
            {/* <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
               brief={bioMedicalBrief}
              type="BIO"
            /> */}
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={bioMedicalBrief}
              title={"Bio-Medical Waste Ganerated"}
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              brief={brief}
              type="NONHAZ"
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
          <div style={{ height: "100%" }} className="my-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SingleLocMultTime;
