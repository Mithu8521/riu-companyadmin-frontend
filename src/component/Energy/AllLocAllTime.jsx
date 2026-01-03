import React, { useEffect, useState } from "react";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import EnergyConsumptionChart from "./FrameworkOne/EnergyConsumptionChart";
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
  renewableTiggerValue,
  nonRenewableTiggerValue,
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
  const [hasFuelData, setHasFuelData] = useState(false);
  const [hasEleData, setHasEleData] = useState(false);
  const [hasRewData, setHasRewData] = useState(false);

  // Check if there's data for each type
  useEffect(() => {
    if (brief && brief.time) {
      // Function to check if there's data for a given type
      const checkDataForType = (type) => {
        const typeProducts = {
          FUEL: [
            "Petrol",
            "PNG",
            "LPG",
            "CNG",
            "Diesel",
          ],
          ELE: [
            "Electricity Power plant (Captive Power Plant - Natural Gas)",
            "GRID electricity",
            "Electricity consumption through DG",
            "Electricity consumption from Renewable energy (via PPA)",
            "Electricity consumption from Renewable energy (rooftop solar)",
          ],
          REW: [
            "Electricity consumption from Renewable energy (via PPA)",
            "Electricity consumption from Renewable energy (rooftop solar)",
          ],
        };

        const currentTypeProducts = typeProducts[type] || [];
        const filteredKeys = Object.values(brief.time).map((obj) => {
          const filteredObj = {};
          Object.keys(obj).forEach((key) => {
            if (currentTypeProducts.includes(key)) {
              filteredObj[key] = obj[key];
            }
          });
          return filteredObj;
        });

        const legendTotals = {};
        filteredKeys.forEach((time) => {
          for (const key in time) {
            if (time.hasOwnProperty(key)) {
              const valueArray = time[key];
              const value = Array.isArray(valueArray)
                ? valueArray.reduce((acc, curr) => acc + curr, 0).toFixed(2)
                : 0;
              legendTotals[key] = Number(
                Number((legendTotals[key] || 0) + Number(value)).toFixed(2)
              );
            }
          }
        });

        return Object.values(legendTotals).some((value) => value > 0);
      };

      // Check for each type
      setHasFuelData(checkDataForType("FUEL"));
      setHasEleData(checkDataForType("ELE"));
      setHasRewData(checkDataForType("REW"));
    }
  }, [brief]);
  return (
    <div>
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
                  title={"Renewable Energy"}
                  type="ENE"
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
                <TabularDataCalculator
                  graphData={nonRenewableEnergy}
                  title={"Non-Renewable Energy"}
                  type="ENE"
                  unit="GJ"
                  tab="Energy"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                  width: hasEleData ? "50%" : "100%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100%" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="FUEL"
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
                  width: hasFuelData ? "50%" : "100%",
                  marginTop: "10px",
                }}
              >
                <div style={{ height: "100" }} className="my-2 container">
                  <TrendsDataCalculator
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="ELE"
                    tab="Energy"
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
                    brief={brief}
                    timePeriods={timePeriods}
                    type="REW"
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
                <div style={{ height: "100" }} className="my-2 "></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllLocAllTime;
