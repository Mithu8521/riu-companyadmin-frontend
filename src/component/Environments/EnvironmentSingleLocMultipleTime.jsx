import React from "react";
import TotalEnergySingLocMultTime from "../Energy/FrameworkOne/TotalEnergySingLocMultTime";
import CombinedBarWaterDynamic from "./FrameworkOne/CombinedBarWater";
import RenewableAndNonRenewable from "../Energy/FrameworkOne/RenewableAndNonRenewable";
import TotalWasteDisposedMulti from "../Waste/FrameworkOne/TotalWasteDisposedMulti";
import FourtyEightTotalEnergy from "../Energy/Framework48/FourtyEightTotalEnergy";
import SingleLocMultTimeBar from "./FrameworkFourtyEight/SingleLocMultTime";
import ProductWiseFourtyEight from "../Energy/Framework48/ProductWiseFourtyEight";
import MultipleBarWater from "../Water/FrameworkOne/MultipleBarWater";
import TotalWasteGeneratedMukt from "../Waste/FrameworkOne/TotalWasteGeneratedMukt";
import WaterHorizontalBar from "../Water/FrameworkFourtyEight/WaterHorizontalBar";
import WasteGenMultLoc from "../Waste/FrameworkFourtyEight/WasteMultiLocMultiTimeGen";
import WasteConsumptionFourtyEight from "../Waste/FrameworkFourtyEight/WasteConsumptionFourtyEight";
import EnergyConsumptionFourtyEight from "../Energy/Framework48/EnergyConsumptionFourtyEight";
import WaterBarFourtyEight from "../Water/FrameworkFourtyEight/WaterBarFourtyEight";
import WasteDispMultLoc from "../Waste/FrameworkFourtyEight/WasteDispMultLoc";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const EnvironmentSingleLocMultipleTime = ({
  companyFramework,
  timePeriods,
  matchedDataWater,
  wasteDisposal,
  renewableEnergy,
  nonRenewableEnergy,
  matchedWaterDis,
  briefEnergy,
  briefWaste,
  briefWater,
  locationOption,
  timePeriodValues,
  matchedDataWaste,
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
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "50vh", marginBottom: "3%" }}
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
    //       {(!areAllObjectsZero(nonRenewableEnergy) || !areAllObjectsZero(renewableEnergy)) && <div style={{ height: "100%" }}>
    //         <TotalEnergySingLocMultTime
    //           timePeriodValues={timePeriodValues}
    //           locationOption={locationOption}
    //           timePeriods={timePeriods}
    //           renewableEnergy={renewableEnergy}
    //           nonRenewableEnergy={nonRenewableEnergy}
    //         />
    //       </div>}
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
    //      {(!areAllObjectsZero(matchedDataWater)) &&  <div style={{ height: "100%" }}>
    //         <MultipleBarWater
    //           locationOption={locationOption}
    //           title={"Water Consumption"}
    //           timePeriodValues={timePeriodValues}
    //           timePeriods={timePeriods}
    //           matchedDataWater={matchedDataWater}
    //         />
    //       </div> }
    //     </div>
    //   </div>
    //   <div
    //     className="d-flex flex-row flex-space-between"
    //     style={{ height: "70vh", marginBottom: "3%" }}
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
    //     { (!areAllObjectsZero(matchedDataWaste)) &&  <div style={{ height: "100%" }}>
    //         <TotalWasteGeneratedMukt
    //           timePeriods={timePeriods}
    //           locationOption={locationOption}
    //           timePeriodValues={timePeriodValues}
    //           title={"Total Waste Generated"}
    //           matchedDataWaste={matchedDataWaste}
    //         />
    //       </div>}
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
    //       {(!areAllObjectsZero(nonRenewableEnergy) || !areAllObjectsZero(renewableEnergy)) && <div style={{ height: "100%" }}>
    //         <RenewableAndNonRenewable
    //           timePeriodValues={timePeriodValues}
    //           locationOption={locationOption}
    //           timePeriods={timePeriods}
    //           renewableEnergy={renewableEnergy}
    //           nonRenewableEnergy={nonRenewableEnergy}
    //         />
    //       </div>}
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
            marginTop: "10px",
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseStacked
              title="Product Wise Renewable Energy"
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={renewableEnergy}
              unit="GJ"
              tab="Energy"
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
              product={matchedDataWaste}
              title={"Total Waste Generated"}
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
            <ProductWiseStacked
              title={"Product Wise Non-Renewable Energy"}
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={nonRenewableEnergy}
              unit="GJ"
              tab="Energy"
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
              product={matchedDataWater}
              title={"Water Withdrawal"}
              unit="KL"
              tab="Water"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
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
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={briefEnergy}
              timePeriods={timePeriods}
              type="ALL"
            />
          </div>

          <div className="my-2">
            <WaterBarFourtyEight
              timePeriodValues={timePeriodValues}
              brief={briefWater}
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
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={briefEnergy}
              timePeriods={timePeriods}
              type="ELE"
            />
          </div>
          <div className="my-2">
            <WasteConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={briefWaste}
              timePeriods={timePeriods}
              type="HAZ"
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
              brief={briefEnergy}
              timePeriods={timePeriods}
              type="FUEL"
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
              brief={briefEnergy}
              timePeriods={timePeriods}
              type="REW"
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
              brief={briefEnergy}
              type="ELE"
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
          <div style={{ height: "100%" }} className="my-2 container">
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              brief={briefWaste}
              type="HAZ"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSingleLocMultipleTime;
