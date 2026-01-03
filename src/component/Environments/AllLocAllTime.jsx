import React, { useState } from "react";
import EnergyConsumptionFourtyEight from "../Energy/Framework48/EnergyConsumptionFourtyEight";
import VerticalBarComponent from "../Energy/Framework48/VerticalBarComponent";
import VerticalBarWaterComponent from "../Water/FrameworkFourtyEight/VerticalBarWaterComponent";
import ShowTotalValue from "../Water/FrameworkFourtyEight/ShowTotalValue";
import VerticalWasteBarComponent from "../Waste/FrameworkFourtyEight/VerticalWasteBarComponent";
import EnergyConsumptionCard from "../Energy/FrameworkOne/TotalEnergyConsumption";
import EnergyConsumptionChart from "../Energy/FrameworkOne/EnergyConsumptionChart";
import CommonBarComponent from "../Energy/FrameworkOne/CommonBarComponent";
import BarComponentWater from "../Water/FrameworkOne/BarComponentWater";
import VerticalBarComponentWater from "../Water/FrameworkOne/VerticalBarComponentWater";
import TotalWasteGeneratedByVertical from "../Waste/FrameworkOne/TotalWasteGeneratedByVertical";
import WaterBarFourtyEight from "../Water/FrameworkFourtyEight/WaterBarFourtyEight";
import WasteConsumptionFourtyEight from "../Waste/FrameworkFourtyEight/WasteConsumptionFourtyEight";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  timePeriods,
  brief,
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriodValues,
  briefEnergy,
  briefWater,
  bioMedicalBrief,
  briefWaste,
  totalConsumption,
  totalConsumptionTwo,
  wasteDisposal,
  matchedDataWater,
  matchedWaterDis,
  matchedDataWaste,
  emissionScope1,
  emissionScope2,
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
      {/* Bar View - Now always showing this view */}
      {companyFramework && companyFramework.includes(1) ? (
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
                  // marginTop: "10px",
                }}
              >
                <div style={{ height: "100%" }} className="my-2 container">
                  <TabularDataCalculator
                    graphData={renewableEnergy}
                    title={"Renewable Energy"}
                    type="ENE"
                    unit="GJ"
                    tab="Energy"
                  />
                </div>

                <div style={{ height: "100%" }} className="my-2 container">
                  <TabularDataCalculator
                    graphData={emissionScope1}
                    title={"Scope1 Emission"}
                    type="EMI"
                    unit="tCO2"
                    tab="Emission"
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
                  <TabularDataCalculator
                    graphData={nonRenewableEnergy}
                    title={"Non-Renewable Energy"}
                    type="ENE"
                    unit="GJ"
                    tab="Energy"
                  />
                </div>
                <div style={{ height: "100%" }} className="my-2 container">
                  <TabularDataCalculator
                    graphData={emissionScope2}
                    title={"Scope2 Emission"}
                    type="EMI"
                    unit="tCO2"
                    tab="Emission"
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
                    graphData={matchedDataWater}
                    title={"Water Withdrawal"}
                    unit="KL"
                    tab="Water"
                  />
                </div>
                <div style={{ height: "100%" }} className="my-2 container">
                  <TabularDataCalculator
                    graphData={matchedWaterDis}
                    title={"Water Discharged"}
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
                  width: "50%",
                  // marginTop: "10px",
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
                <div style={{ height: "100%" }} className="my-2 container">
                  <TabularDataCalculator
                    graphData={wasteDisposal}
                    title={"Total Waste Recovered"}
                    com="COL"
                    unit="mt"
                    tab="Waste"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
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
                <div className="my-2" style={{height:"118px"}}>
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
                  width: "50%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={briefEnergy}
                    timePeriods={timePeriods}
                    type="FUEL"
                    tab="Energy" 
                  />
                </div>

                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator brief={briefWater} type="COMS" tab="Water"  />
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
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={briefEnergy}
                    timePeriods={timePeriods}
                    type="ELE"
                    tab="Energy" 
                  />
                </div>
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriods={timePeriods}
                    timePeriodValues={timePeriodValues}
                    brief={briefWaste}
                    type="HAZ"
                    tab="Waste" 
                   
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
