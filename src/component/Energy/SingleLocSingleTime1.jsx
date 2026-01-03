import React from "react";
import EnergyConsumptionBar from "../Environment/EnergyConsumptionBar";
import ProductWiseSingleLoc from "./ProductWiseSingleLoc";
import Renewable from "../Environment/RenewableAndNoneRenew";
import EnergyConsumptionCard from "./FrameworkOne/TotalEnergyConsumption";
import EnergyConsumptionChart from "./FrameworkOne/EnergyConsumptionChart";
import CommonBarComponent from "./FrameworkOne/CommonBarComponent";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import BarComponent from "./Framework48/BarComponent";

const SingleLocSingleTime = ({
  companyFramework,
  sectorQuestionAnswerDataForGraph,
  timePeriods,
  brief,
  graphData,
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
  locationOption,
  renewableEnergy,
  nonRenewableEnergy,
  keyTab,
  timePeriodValues,

}) => {
  return companyFramework.includes(1) ?
    (
      <div className="d-flex flex-column flex-space-between">
        <div
          className="d-flex flex-row flex-space-between"
          style={{ height: "55vh", marginBottom: "3%" }}
        >
          <div className="firsthalfprogressenergy" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "45%" }}>
            <div style={{ height: "21%" }}>
              <EnergyConsumptionCard timePeriodValues={timePeriodValues} totalConsumptionRenewable={totalConsumptionRenewable} totalConsumptionNonRenewable={totalConsumptionNonRenewable} timePeriods={timePeriods} />

            </div>

            <div style={{ height: "75%" }}>
              <EnergyConsumptionChart totalConsumptionRenewable={totalConsumptionRenewable} totalConsumptionNonRenewable={totalConsumptionNonRenewable} />


            </div>


          </div>
          <div className="secondhalfprogress" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "55%" }}>
            <div style={{ height: "48%" }}>
              <CommonBarComponent
                renewableEnergy={renewableEnergy}
                nonRenewableEnergy={nonRenewableEnergy}
                com={"ren"}
              />

            </div>
            <div style={{ height: "48%" }}>
              <CommonBarComponent
                renewableEnergy={renewableEnergy}
                nonRenewableEnergy={nonRenewableEnergy}
                com={"non"}
              />

            </div>
          </div>
        </div>
        {/* <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "22vh", marginBottom: "3%" }}
      >
      
      </div> */}
      </div>
    ) : (
      <>
        <div className="d-flex flex-column flex-space-between">
          <div
            className="d-flex flex-row flex-space-between"
            style={{ height: "27.5vh", marginBottom: "3%" }}
          >
            <div className="firsthalfprogressenergy" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "45%" }}>
              <div style={{ height: "65%" }}>
                <EnergyConsumptionFourtyEight timePeriodValues={timePeriodValues} brief={brief} timePeriods={timePeriods} />

              </div>

              <div style={{ height: "0%" }}>
                {/* <EnergyConsumptionChart totalConsumptionRenewable={totalConsumptionRenewable} totalConsumptionNonRenewable={totalConsumptionNonRenewable} /> */}


              </div>


            </div>
            <div className="secondhalfprogress" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "55%" }}>
              <div style={{ height: "100%" }}>
                <BarComponent brief={brief} />

              </div>
              <div style={{ height: "0%" }}>
                {/* <CommonBarComponent
            renewableEnergy={renewableEnergy}
            nonRenewableEnergy={nonRenewableEnergy}
            com={"non"}
/> */}

              </div>
            </div>
          </div>
          {/* <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "22vh", marginBottom: "3%" }}
      >
    
      </div> */}
        </div>


      </>
    );
};

export default SingleLocSingleTime;
