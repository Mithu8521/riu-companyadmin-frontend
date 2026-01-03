import React, { useEffect, useState } from "react";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight";
import VerticalWasteBarComponent from "./FrameworkFourtyEight/VerticalWasteBarComponent";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  timePeriods,
  brief,
  timePeriodValues,
  locationOption,
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
  return (
    <div>
      {companyFramework.includes(1) ? (
        <></>
      ) : (
        <>
          <div className="d-flex flex-column flex-space-between">
            <div
              className="d-flex flex-row flex-space-between"
              style={{ marginBottom: "3%" }}
            >
              <div
                className="firsthalfprogressenergy"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "50%",
                  marginBottom: "20px",
                }}
              >
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator brief={brief} type="OCCUPANCY" tab="Occupancy" showTotal={false}/>
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
