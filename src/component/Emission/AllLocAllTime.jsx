import React, { useEffect, useState } from "react";
import EnergyConsumptionFourtyEight from "./EnergyConsumptionFourtyEight";
import VerticalBarComponent from "./VerticalBarComponent";
import TotalVerticalBarComonenet from "./TotalVerticalBarComonenet";
import EnergyConsumptionChart from "./FrameworkOne/EnergyConsumptionChart";
import VerticalEnergyBarComponent from "./FrameworkOne/VerticalEnergyBarComonent";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  timePeriods,
  timePeriodValues,
  emission,
  locationOption,
  brief,
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
  renewableEnergy,
  nonRenewableEnergy,
  scope1,
  scope2,
  scope1TiggerValue,
  scope2TiggerValue,
}) => {
  const [quarters, setQuarters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({ time: {}, location: {} });
  const [data1, setData1] = useState({ time: {}, location: {} });

  function convertMixedData(mixedArray) {
    return mixedArray.map((data) => {
      if (Array.isArray(data.answer) && Array.isArray(data.answer[0])) {
        const flattenedAnswer = data.answer.flat();
        const summedValue = flattenedAnswer.reduce(
          (sum, value) => sum + (parseFloat(value) || 0),
          0
        );

        return {
          questionId: data.questionId,
          sourceId: data.sourceId,
          answer: {
            process: 1,
            readingValue: summedValue.toString(),
            unit: "KG",
          },
          title: data.title,
          question_details: data.question_details,
          formDate: data.formDate,
          toDate: data.toDate,
          fuelType: data.fuelType, // Adding fuelType property
        };
      } else {
        return {
          ...data,
          answer: {
            ...data.answer,
            readingValue: data?.answer?.readingValue || "0",
          },
        };
      }
    });
  }

  useEffect(() => {
    if (
      emission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
    ) {
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            Diesel: new Array(locationOption.length).fill(0),
            Petrol: new Array(locationOption.length).fill(0),
            CNG: new Array(locationOption.length).fill(0),
            PNG: new Array(locationOption.length).fill(0),
            LPG: new Array(locationOption.length).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            Diesel: new Array(transformedKeys.length).fill(0),
            Petrol: new Array(transformedKeys.length).fill(0),
            CNG: new Array(transformedKeys.length).fill(0),
            PNG: new Array(transformedKeys.length).fill(0),
            LPG: new Array(transformedKeys.length).fill(0),
          };
        });
      });

      const filteredData =
        emission &&
        emission.filter(
          (item) =>
            item?.questionId === 289 ||
            item?.questionId === 293 ||
            item?.questionId === 294 ||
            item?.questionId === 295 ||
            item?.questionId === 292
        );

      const convertedData = convertMixedData(filteredData);
      const timeKey = [];
      const locationKey = [];

      for (const period in summary.location) {
        timeKey.push(period);
      }

      for (const period in summary.time) {
        locationKey.push(period);
      }

      for (const location in summary.time) {
        const data = summary.time[location];
        for (const key in data) {
          for (let k = 0; k < summary.time[location][key].length; k++) {
            let time = timeKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      for (const time in summary.location) {
        const data = summary.location[time];
        for (const key in data) {
          for (let k = 0; k < summary.location[time][key].length; k++) {
            let location = locationKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission]);

  useEffect(() => {
    if (
      emission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
    ) {
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            "GRID electricity": new Array(locationOption.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(locationOption.length).fill(0),
            "Electricity consumption through DG": new Array(
              locationOption.length
            ).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            "GRID electricity": new Array(transformedKeys.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(transformedKeys.length).fill(0),
            "Electricity consumption through DG": new Array(
              transformedKeys.length
            ).fill(0),
          };
        });
      });

      const filteredData = emission.filter(
        (item) =>
          item?.questionId === 468 ||
          item?.questionId === 426 ||
          item?.questionId === 428
      );

      const convertedData = convertMixedData(filteredData);
      const timeKey = [];
      const locationKey = [];

      for (const period in summary.location) {
        timeKey.push(period);
      }

      for (const period in summary.time) {
        locationKey.push(period);
      }

      for (const location in summary.time) {
        const data = summary.time[location];
        for (const key in data) {
          for (let k = 0; k < summary.time[location][key].length; k++) {
            let time = timeKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      for (const time in summary.location) {
        const data = summary.location[time];
        for (const key in data) {
          for (let k = 0; k < summary.location[time][key].length; k++) {
            let location = locationKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData1({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission]);
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

  // Directly render vertical bar view
  return (
    <div>
      {companyFramework && companyFramework.includes(1) ? (
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
        // <div className="d-flex flex-column flex-space-between">
        //   <div
        //     className="d-flex flex-row flex-space-between"
        //     style={{ marginBottom: "3%" }}
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
        //       {totalConsumptionRenewable && totalConsumptionNonRenewable ? (
        //         <div style={{ height: "55vh", marginBottom: "20px" }}>
        //           <EnergyConsumptionChart
        //             totalConsumptionRenewable={totalConsumptionRenewable}
        //             totalConsumptionNonRenewable={totalConsumptionNonRenewable}
        //           />
        //         </div>
        //       ) : (
        //         <></>
        //       )}
        //       {!areAllObjectsZero(nonRenewableEnergy) && (
        //         <div style={{ height: "55vh" }} className="container">
        //           <VerticalEnergyBarComponent
        //             renewableEnergy={renewableEnergy}
        //             nonRenewableEnergy={nonRenewableEnergy}
        //             com={"non"}
        //             triggerValue={scope1TiggerValue}
        //           />
        //         </div>
        //       )}
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
        //       {!areAllObjectsZero(renewableEnergy) && (
        //         <div style={{ height: "55vh" }} className="container">
        //           <VerticalEnergyBarComponent
        //             renewableEnergy={renewableEnergy}
        //             nonRenewableEnergy={nonRenewableEnergy}
        //             com={"ren"}
        //             triggerValue={scope2TiggerValue}
        //           />
        //         </div>
        //       )}
        //     </div>
        //   </div>
        // </div>
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
                    brief={data}
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
                    brief={data1}
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
                    brief={data}
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
                    brief={data1}
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

export default AllLocAllTime;
