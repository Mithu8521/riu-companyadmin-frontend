import React, { useEffect, useState } from "react";
import WasteDispMultLoc from "./FrameworkFourtyEight/WasteDispMultLoc";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const SingleLocMultTime = ({
  companyFramework,
  timePeriods,
  brief,
  locationOption,
  timePeriodValues,
}) => {
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
  return companyFramework.includes(1) ? (
    <></>
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

export default SingleLocMultTime;
