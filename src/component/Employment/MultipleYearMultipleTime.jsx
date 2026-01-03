import React, { useEffect, useRef, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import SeparateWasteMultTimeMultTime from "./SeparateWasteMultTimeMultTime";
import TotalWasteMultTimeMultTime from "./TotalWasteMultTimeMultTime";
import WasteGenMultLoc from "./FrameworkFourtyEight/WasteMultiLocMultiTimeGen";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight";
import WasteDispMultLoc from "./FrameworkFourtyEight/WasteDispMultLoc";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const MultipleYearMultipleTime = ({
  keyTab,
  locationOption,
  companyFramework,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  brief,
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
          `${config.POSTLOGIN_API_URL_COMPANY}getCompareWasteData`,
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
    if(companyFramework && companyFramework.includes(1)){
      getCompareEnergyData();
    }
  }, [financialYear,companyFramework]);

  const isCompareLastTimePeriodsValid =
    compareLastTimePeriods && Object.keys(compareLastTimePeriods).length > 0;
  const isCompareTCurrentimePeriodsValid =
    compareTCurrentimePeriods &&
    Object.keys(compareTCurrentimePeriods).length > 0;

  const shouldRenderGraphs =
    isCompareLastTimePeriodsValid && isCompareTCurrentimePeriodsValid;
  const [hasGenData, setHasGenData] = useState(false);
  const [hasDisData, setHasDisData] = useState(false);

  // Check if there's data for each waste type
  useEffect(() => {
    if (brief && brief.time) {
      // Function to check if there's data for given categories
      const checkDataForCategories = (categories) => {
        const timeData = Object.values(brief.time);

        for (const period of timeData) {
          for (const category of categories) {
            if (period[category]) {
              if (Array.isArray(period[category])) {
                // If it's an array, sum up all values
                const sum = period[category].reduce(
                  (acc, val) => acc + (Number(val) || 0),
                  0
                );
                if (sum > 0) {
                  return true;
                }
              } else if (Number(period[category]) > 0) {
                // For non-array values, directly check if greater than 0
                return true;
              }
            }
          }
        }

        return false;
      };

      // Check for GEN data
      const genCategories = ["Manpower turnover rate(FTE atrition rate) in %"];

      // Check for DIS data
      const disCategories = ["Total number of employees (FTE)"];

      setHasGenData(checkDataForCategories(genCategories));
      setHasDisData(checkDataForCategories(disCategories));
    }
  }, [brief]);
  return companyFramework && companyFramework.includes(1) ? (
    <div className="d-flex flex-column flex-space-between">
      {/* First Row */}
      <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "120vh", marginBottom: "3%" }}
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
          {shouldRenderGraphs && (
            <div style={{ height: "48%" }}>
              <TotalWasteMultTimeMultTime
                title="generated"
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={graphData}
                financialYear={financialYear}
              />
            </div>
          )}

          <div style={{ height: "48%" }}>
            <TotalWasteMultTimeMultTime
              title="recovered"
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
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
          <div style={{ height: "48%" }}>
            <SeparateWasteMultTimeMultTime
              titles="generated"
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
            />
          </div>
          <div style={{ height: "48%" }}>
            <SeparateWasteMultTimeMultTime
              titles="recovered"
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
            />
          </div>
        </div>
      </div>
      {/* <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "120vh", marginBottom: "3%" }}
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
          {shouldRenderGraphs && (
            <div style={{ height: "48%" }}>
              <TotalWasteMultTimeMultTime
                title="disposed"
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={graphData}
                financialYear={financialYear}
              />
            </div>
          )}

          
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
          <div style={{ height: "48%" }}>
            <SeparateWasteMultTimeMultTime
              titles="disposed"
              compareLastTimePeriods={compareLastTimePeriods}
              locationOption={locationOption}
              compareTCurrentimePeriods={compareTCurrentimePeriods}
              graphData={graphData}
              financialYear={financialYear}
            />
          </div>
         
        </div>
      </div> */}
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
          <div className="my-2" style={{height:"118px"}}>
            <WasteConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={brief}
              timePeriods={timePeriods}
              type="GEN"
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
          <div className="my-2" style={{height:"118px"}}>
            <WasteConsumptionFourtyEight
              timePeriodValues={timePeriodValues}
              brief={brief}
              timePeriods={timePeriods}
              type="DIS"
            />
          </div>
        </div>
      </div>
      {/* <div className="d-flex flex-row flex-space-between">
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
              type="EMPLOYEES"
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
              type="ATTRITION"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MultipleYearMultipleTime;
