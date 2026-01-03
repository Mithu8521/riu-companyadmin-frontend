import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall.js";
import config from "../../config/config.json";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import TopComponentWaste from "./TopComponentWaste.jsx";
import WasteMultiLocMultiTime from "./FrameworkFourtyEight/WasteMultiLocMultiTimeGen.jsx";
import WasteSingleLocMultTime from "./WasteSingleLocMultTime.jsx";
import WasteSingleLocSingleTime from "./WasteSingleLocSingleTime.jsx";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime.jsx";
import AllLocAllTime from "./AllLocAllTime.jsx";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight.jsx";
import CompareMultiple from "../DashboardComponents/CompareMultiple.jsx";

const Occupancy = ({
  locationOption,
  timePeriods,
  graphData,
  keyTab,
  frameworkValue,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  lastYearGraphData
}) => {
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalSumTwo, setTotalSumTwo] = useState(0);
  const [companyFramework, setCompanyFramework] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState([]);

  const [totalSumThree, setTotalSumThree] = useState(0);
  const [brief, setBrief] = useState();
  const [bioMedicalBrief, setBioMedicalBrief] = useState();

  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
  };

  const lastWeekActivity = async () => {
    const activityData = {
      "Total Waste Generated": {
        number: `${totalSum} MT`,
        questionId: [],
      },
      "Total Waste Disposed": {
        number: `${totalSumTwo} MT`,
        questionId: [],
      },
      "Total Waste Recovered": {
        number: `${totalSumThree} MT`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  };

  const [matchedDataWaste, setMatchedDataWaste] = useState([]);
  const [wasteRecovered, setWasteRecovered] = useState([]);
  const [wasteDisposal, setWasteDisposal] = useState([]);

  function convertMixedData(mixedArray) {
    return mixedArray.map((data) => {
      if (Array.isArray(data.answer) && Array.isArray(data.answer[0])) {
        const flattenedAnswer = data.answer.flat();
        const summedValue = flattenedAnswer[1];
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
    if (companyFramework && companyFramework.includes(48) && lastYearGraphData && graphData && keyTab === 'compareToYear') {
     const mergeWithYearKeys = (obj1, obj2) => {
        const merged = {};

        const entries1 = Object.entries(obj1);
        const entries2 = Object.entries(obj2);
        const maxLength = Math.max(entries1.length, entries2.length);

        for (let i = 0; i < maxLength; i++) {
          if (i < entries1.length) {
            const [month, value] = entries1[i];
            const year = value.split("-")[0];
            merged[`${month}-${year}`] = value;
          }
          if (i < entries2.length) {
            const [month, value] = entries2[i];
            const year = value.split("-")[0];
            merged[`${month}-${year}`] = value;
          }
        }

        return merged;
      };
      const newTimePeriods = mergeWithYearKeys(compareLastTimePeriods, compareTCurrentimePeriods);
      const newGraphData = [...graphData, ...lastYearGraphData];

    const timePeriodsArray = Object.values(newTimePeriods || []);

      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
        answered: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Number of IP days": new Array(
                locationOption.length
              ).fill(0),
              "% of occupancy": new Array(
                locationOption.length
              ).fill(0),
              "Total approved beds": new Array(
                locationOption.length
              ).fill(0),
              "Total operating beds": new Array(
                locationOption.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                locationOption.length
              ).fill(0),

            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              "Number of IP days": new Array(
                transformedKeys.length
              ).fill(0),
              "% of occupancy": new Array(
                transformedKeys.length
              ).fill(0),
              "Total approved beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total operating beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.answered[location?.unitCode] = {
              "Number of IP days": new Array(
                transformedKeys.length
              ).fill(0),
              "% of occupancy": new Array(
                transformedKeys.length
              ).fill(0),
              "Total approved beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total operating beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (newGraphData) {
        const filteredData = newGraphData.filter(
          (item) => item?.questionId === 582 || item?.questionId === 583 || item?.questionId === 584 || item?.questionId === 585 || item?.questionId === 448
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
              const lowerCaseKey = time;
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
              summary.answered[location][key][k] = filterData ? true : false;
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
              const lowerCaseKey = time;
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }
console.log(summary,"summarysummarysummary")
      setBrief(summary);
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);


    useEffect(() => {
    const timePeriodsArray = Object.values(timePeriods || []);

    if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(timePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
        answered: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Number of IP days": new Array(
                locationOption.length
              ).fill(0),
              "% of occupancy": new Array(
                locationOption.length
              ).fill(0),
              "Total approved beds": new Array(
                locationOption.length
              ).fill(0),
              "Total operating beds": new Array(
                locationOption.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                locationOption.length
              ).fill(0),

            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              "Number of IP days": new Array(
                transformedKeys.length
              ).fill(0),
              "% of occupancy": new Array(
                transformedKeys.length
              ).fill(0),
              "Total approved beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total operating beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.answered[location?.unitCode] = {
              "Number of IP days": new Array(
                transformedKeys.length
              ).fill(0),
              "% of occupancy": new Array(
                transformedKeys.length
              ).fill(0),
              "Total approved beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total operating beds": new Array(
                transformedKeys.length
              ).fill(0),
              "Total built up area (sq.ft)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) => item?.questionId === 582 || item?.questionId === 583 || item?.questionId === 584 || item?.questionId === 585 || item?.questionId === 448
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
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
              summary.answered[location][key][k] = filterData ? true : false;
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
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBrief(summary);
    }
  }, [graphData, timePeriods, companyFramework, keyTab, locationOption]);


  useEffect(() => {
    lastWeekActivity();
  }, [totalSum, totalSumTwo, totalSumThree]);

  useEffect(() => {
    if (Array.isArray(frameworkValue) && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  return (
    <div className="progress-container">
      {companyFramework &&
        companyFramework.length &&
        companyFramework.includes(1) && (
          <div className="topcompo">
            {companyFramework &&
              companyFramework.length &&
              companyFramework.includes(1) &&
              lastWeekActivities && (
                <TopComponentWaste
                  lastWeekActivities={lastWeekActivities}
                  icons={icons}
                />
              )}
          </div>
        )}
      {keyTab === "combinedAll" ? (
        <AllLocAllTime
          graphData={graphData}
          keyTab={keyTab}
          companyFramework={companyFramework}
          brief={brief}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          matchedDataWaste={matchedDataWaste}
          wasteDisposal={wasteDisposal}
          wasteRecovered={wasteRecovered}
          bioMedicalBrief={bioMedicalBrief}
        />
      ) : keyTab === "compareToYear" ? (
        <MultipleYearMultipleTime
          keyTab={keyTab}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          companyFramework={companyFramework}
          compareLastTimePeriods={compareLastTimePeriods}
          compareTCurrentimePeriods={compareTCurrentimePeriods}
          financialYear={financialYear}
          graphData={graphData}
          brief={brief}
          bioMedicalBrief={bioMedicalBrief}
        />
      ) : companyFramework &&
        companyFramework.length &&
        companyFramework.includes(1) ? (
        (timePeriodValues &&
          locationOption.length === 1 &&
          timePeriodValues.length === 1) ||
          (locationOption.length > 1 &&
            timePeriodValues.length === 1 &&
            keyTab === "combined") ? (
          <>
            <WasteSingleLocSingleTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              brief={brief}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWaste={matchedDataWaste}
              wasteDisposal={wasteDisposal}
              wasteRecovered={wasteRecovered}
              companyFramework={companyFramework}
            />
          </>
        ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length == 1 && timePeriodValues.length > 1) ? (
          <>
            <WasteSingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWaste={matchedDataWaste}
              brief={brief}
              wasteDisposal={wasteDisposal}
              wasteRecovered={wasteRecovered}
              companyFramework={companyFramework}
            />
          </>
        ) : (
          <></>
        )
      ) : (timePeriodValues &&
        locationOption.length === 1 &&
        timePeriodValues.length === 1) ||
        (locationOption.length > 1 &&
          timePeriodValues.length === 1 &&
          keyTab === "combined") ? (
        <>
          <WasteSingleLocSingleTime
            graphData={graphData}
            keyTab={keyTab}
            companyFramework={companyFramework}
            brief={brief}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            matchedDataWaste={matchedDataWaste}
            wasteDisposal={wasteDisposal}
            wasteRecovered={wasteRecovered}
            bioMedicalBrief={bioMedicalBrief}
          />
        </>
      ) : (locationOption.length > 1 &&
        timePeriodValues.length > 1 &&
        keyTab === "combined") ||
        (locationOption.length > 1 && timePeriodValues.length === 1) ||
        (locationOption.length == 1 && timePeriodValues.length > 1) ? (
        <>
          {brief && (
            <WasteSingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              brief={brief}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              companyFramework={companyFramework}
              bioMedicalBrief={bioMedicalBrief}
            />
          )}
        </>
      ) : (
        timePeriodValues && (
          <div className="d-flex flex-column flex-space-between">
            {/* <div className="d-flex flex-row flex-space-between">
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
                <div className="my-2" style={{ height: "118px" }}>
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
                <div className="my-2" style={{ height: "118px" }}>
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="DIS"
                  />
                </div>
              </div>
            </div> */}
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
                  <CompareMultiple
                    timePeriodValues={timePeriodValues}
                    timePeriods={timePeriods}
                    graphData={graphData}
                    locationOption={locationOption}
                    type="OCCUPANCY"
                  />
                </div>
              </div>

           
            </div> 
          </div>
        )
      )}
    </div>
  );
};

export default Occupancy;
