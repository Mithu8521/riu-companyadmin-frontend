import React from "react";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import EnergyConsumptionChart from "./FrameworkOne/EnergyConsumptionChart";
import VerticalEnergyBarComonent from "./FrameworkOne/VerticalEnergyBarComonent";
import VerticalBarComponent from "./Framework48/VerticalBarComponent";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const SingleLocSingleTime = ({
  companyFramework,
  timePeriods,
  brief,
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriodValues,
  locationOption,
  scope1,
  scope2,
  scope1TiggerValue,
  scope2TiggerValue,
}) => {
  const areAllAnswersZero = (obj) => {
    if (!obj.answer || !Array.isArray(obj.answer)) {
      return false;
    }
    
    return obj.answer.every(item => {
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
    return dataArray.every(obj => areAllAnswersZero(obj));
  };

  return (
    <div>
      {/* Only Bar View Content */}
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
               graphData={renewableEnergy}
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
             width: "100%",
             marginTop: "10px",
           }}
         >
           <div style={{ height: "100" }} className="my-2 container">
             <TabularDataCalculator
               graphData={nonRenewableEnergy}
               title={"Scope2 Emission"}
               type="EMI"
               unit="tCO2"
               tab="Emission"
             />
           </div>
         </div>
       </div>
     </div>
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
                    brief={scope1}
                    timePeriods={timePeriods}
                    type="Scope1"
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
                    brief={scope2}
                    timePeriods={timePeriods}
                    type="Scope2"
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
                    brief={scope1}
                    timePeriods={timePeriods}
                    type="SCOPE1"
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
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={scope2}
                    timePeriods={timePeriods}
                    type="SCOPE2"
                    tab="Emission" 
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

export default SingleLocSingleTime;
