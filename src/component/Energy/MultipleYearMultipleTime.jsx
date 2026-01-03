import React, { useEffect, useRef, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import RenewableAndNonRenewableMultiYear from "./RenewableAndNonRenewableMultiYear";
import RenewableNonRenewableMultiYear from "./RenewableNonRenewableMultiYear";
import SeparateEnergyMultTimeMultTime from "./SeparateEnergyMultTimeMultTime";
import SeparateEnergyMultTimeMultTimeYear from "./SeparateEnergyMultTimeMultTimeYear";
import TotalEnergyMultTimeMultTime from "./TotalEnergyMultTimeMultTime";
import FourtyEightTotalEnergy from "./Framework48/FourtyEightTotalEnergy";
import ProductWiseFourtyEight from "./Framework48/ProductWiseFourtyEight";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import CompareToPreviousYear from "../DashboardComponents/CompareToPreviousYear";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const MultipleYearMultipleTime = ({
  keyTab,
  locationOption,
  companyFramework,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  graphData48,
  brief,
  renewableEnergy,
  nonRenewableEnergy,
  timePeriods,
  timePeriodValues,
}) => {
  const [graphData, setGraphData] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCompareEnergyData = async () => {
    if (financialYear && financialYear.length >= 2) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getCompareEnergyData`,
          {},
          {
            financialYearIds: [
              financialYear[financialYear.length - 2].id,
              financialYear[financialYear.length - 1].id,
            ],
          },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          setGraphData(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
      }
    }
  };

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      getCompareEnergyData();
    }
  }, [financialYear, companyFramework]);

  const isCompareLastTimePeriodsValid =
    compareLastTimePeriods && Object.keys(compareLastTimePeriods).length > 0;
  const isCompareTCurrentimePeriodsValid =
    compareTCurrentimePeriods &&
    Object.keys(compareTCurrentimePeriods).length > 0;

  const shouldRenderGraphs =
    isCompareLastTimePeriodsValid && isCompareTCurrentimePeriodsValid;

  return companyFramework && companyFramework.includes(1) ? (
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
            <CompareToPreviousYear
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
              title={"Renewable Energy Consumption"}
              unit="GJ"
              Tab="Energy"
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
            <CompareToPreviousYear
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
              title={"Non-Renewable Energy Consumption"}
              unit="GJ"
              Tab="Energy"
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
            width: "50%",
            marginTop: "10px",
          }}
        >
          <div className="my-2">
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={brief}
              timePeriods={timePeriods}
              type="ALL"
            />
          </div>

          <div className="my-2">
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={brief}
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
              brief={brief}
              timePeriods={timePeriods}
              type="ELE"
            />
          </div>
          <div className="my-2">
            <EnergyConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={brief}
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
              brief={brief}
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
              brief={brief}
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
              brief={brief}
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
          <div style={{ height: "100%" }} className="my-2"></div>
        </div>
      </div>
    </div>
  );
};

export default MultipleYearMultipleTime;
