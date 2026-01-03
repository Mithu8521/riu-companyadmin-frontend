import React from "react";
import FourtyEightTotalEnergy from "./Framework48/FourtyEightTotalEnergy";
import ProductWiseFourtyEight from "./Framework48/ProductWiseFourtyEight";
// import ProductWiseStacked from "./FrameworkOne/ProductWiseStacked";
import RenewableAndNonRenewable from "./FrameworkOne/RenewableAndNonRenewable";
import TotalEnergySingLocMultTime from "./FrameworkOne/TotalEnergySingLocMultTime";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const SingleLocMultTime = ({
  companyFramework,
  timePeriods,
  brief,
  locationOption,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriodValues,
  scope1,
  scope2,
}) => {
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
              title="Product Wise Scope1"
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={renewableEnergy}
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
            <ProductWiseStacked
              title={"Product Wise Scope2"}
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={nonRenewableEnergy}
              unit="tCO2"
              tab="Emission"
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
              brief={scope1}
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
            width: "50%",
            marginTop: "10px",
          }}
        >
          <div className="my-2">
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={scope2}
              timePeriods={timePeriods}
              type="ELE"
            />
          </div>
          {/* <div  className="my-2">
          <EnergyConsumptionFourtyEight
            timePeriodValues={timePeriodValues}
            brief={brief}
            timePeriods={timePeriods}
            type="REW"
          />
        </div> */}
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
              brief={scope1}
              type="SCOPE1"
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
              brief={scope2}
              type="SCOPE2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLocMultTime;
