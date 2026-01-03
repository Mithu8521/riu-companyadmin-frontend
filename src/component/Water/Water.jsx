import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import WaterRecycledMultiLoc from "./FrameworkFourtyEight/WaterRecycledMultiLoc";
import WaterTreatedMultiLoc from "./FrameworkFourtyEight/WaterTreatedMultiLoc";
import TopComponentWater from "./TopComponentWater";
import WaterComparison from "./WaterComparison";
import WaterSingleLocMultTime from "./WaterSingleLocMultTime";
import WaterSingleLocSingleTime from "./WaterSingleLocSingleTime";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import AllLocAllTime from "./AllLocAllTime";
import WaterBarFourtyEight from "./FrameworkFourtyEight/WaterBarFourtyEight";
import CompareMultiple from "../DashboardComponents/CompareMultiple";

const Water = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  keyTab,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  lastYearGraphData

}) => {
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [companyFramework, setCompanyFramework] = useState([]);
  const [brief, setBrief] = useState();

  const icons = {
    0: done,
    1: updated,
    2: due,
    3: defaulted,
  };

  const [timePeriodValues, setTimePeriodValues] = useState([]);
  const [matchedDataWater, setMatchedDataWater] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalConsumptionTwo, setTotalConsumptionTwo] = useState(0);

  const [matchedWaterDis, setMatchedWaterDis] = useState([]);

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
    if (companyFramework && companyFramework.includes(1)) {
      const waterSeries = [
        "Surface Water",
        "Ground Water",
        "Third Party Water",
        "Municipal Water",
        "Seawater / Desalinated Water",
        "Others",
      ];

      const waterSeriesTwo = [
        "To Surface Water",
        "To Ground Water",
        "To Sea Water",
        "Sent to other parties",
        "Others",
      ];

      // Safeguard against undefined graphData or timePeriods
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const newWaterType =
        graphData?.filter((item) => item.title === "Water withdrawal") || [];
      const newWaterDischarge =
        graphData?.filter(
          (item) => item.title === "Details of Water Discharge"
        ) || [];

      // Safeguard against undefined timePeriodsArray
      const newMatchedDataWater = newWaterType.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newMatchedDataWaterDischarge = newWaterDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalEnergy = newMatchedDataWater.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonEnergy = newMatchedDataWaterDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setMatchedWaterDis(finalNonEnergy);
      setMatchedDataWater(finalEnergy);

      if (
        !Array.isArray(newMatchedDataWater) ||
        newMatchedDataWater.length === 0
      ) {
        setTotalConsumption(0);
        return;
      }

      const aggregatedValues = waterSeries.map((_, index) =>
        newMatchedDataWater.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
          return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
        }, 0)
      );

      const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
      setTotalConsumption(total);

      const aggregated = waterSeriesTwo.map((_, index) =>
        newMatchedDataWaterDischarge.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]
              ? obj.answer[index]
                .slice(0, 2)
                .reduce(
                  (sum, val) =>
                    sum + (val === "NA" || !val ? 0 : parseFloat(val)),
                  0
                )
              : 0;
          return acc + value;
        }, 0)
      );

      const totalTwo = aggregated.reduce((sum, value) => sum + value, 0);
      setTotalConsumptionTwo(totalTwo);
    } else if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                locationOption.length
              ).fill(0),

              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(locationOption.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
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
              "Total Groundwater consumption* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(transformedKeys.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 391 ||
            item?.questionId === 469 ||
            item?.questionId === 474 ||
            item?.questionId === 394
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
  }, [graphData, timePeriods, companyFramework, locationOption]);

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
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                locationOption.length
              ).fill(0),

              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(locationOption.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
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
              "Total Groundwater consumption* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(transformedKeys.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (newGraphData) {
        const filteredData = newGraphData.filter(
          (item) =>
            item?.questionId === 391 ||
            item?.questionId === 469 ||
            item?.questionId === 474 ||
            item?.questionId === 394
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
      setBrief(summary);
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);

  const lastWeekActivity = async () => {
    const activityData = {
      "Total Water Withdrawal": {
        number: `${totalConsumption} KL`,
        questionId: [],
      },
      "Total Water Discharged": {
        number: `${totalConsumptionTwo} KL`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  };

  useEffect(() => {
    lastWeekActivity();
  }, [totalConsumption, totalConsumptionTwo]);

  useEffect(() => {
    if (Array.isArray(frameworkValue) && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);

  return (
    <div className="progress-container">
      {companyFramework &&
        companyFramework.length > 0 &&
        companyFramework.includes(1) && (
          <>
            {lastWeekActivities && (
              <TopComponentWater
                lastWeekActivities={lastWeekActivities}
                icons={icons}
              />
            )}
          </>
        )}

      {keyTab === "combinedAll" ? (
        <AllLocAllTime
          graphData={graphData}
          keyTab={keyTab}
          locationOption={locationOption}
          brief={brief}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          matchedDataWater={matchedDataWater}
          matchedWaterDis={matchedWaterDis}
          companyFramework={companyFramework}
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
            <WaterSingleLocSingleTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              brief={brief}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWater={matchedDataWater}
              matchedWaterDis={matchedWaterDis}
              companyFramework={companyFramework}
            />
          </>
        ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length == 1 && timePeriodValues.length > 1) ? (
          <>
            <WaterSingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWater={matchedDataWater}
              matchedWaterDis={matchedWaterDis}
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
          <WaterSingleLocSingleTime
            graphData={graphData}
            keyTab={keyTab}
            companyFramework={companyFramework}
            brief={brief}
          />
        </>
      ) : (locationOption.length > 1 &&
        timePeriodValues.length > 1 &&
        keyTab === "combined") ||
        (locationOption.length > 1 && timePeriodValues.length === 1) ||
        (locationOption.length == 1 && timePeriodValues.length > 1) ? (
        <>
          <WaterSingleLocMultTime
            graphData={graphData}
            keyTab={keyTab}
            brief={brief}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            companyFramework={companyFramework}
          />
        </>
      ) : (
        timePeriodValues && (
          <>
            <div className="d-flex flex-column flex-space-between">
              <div
                className="d-flex flex-row flex-space-between"
                style={{ marginBottom: "2%" }}
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
                    <WaterBarFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={brief}
                      timePeriods={timePeriods}
                      type="COMS"
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
                    <WaterBarFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={brief}
                      timePeriods={timePeriods}
                      type="TREAT"
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
                    <CompareMultiple
                      timePeriods={timePeriods}
                      brief={brief}
                      graphData={graphData}
                      type="COMS"
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
                    <CompareMultiple
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      graphData={graphData}
                      timePeriods={timePeriods}
                      type="TREAT"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Water;
