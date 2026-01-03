import React, { useEffect, useState } from "react";
import no from "../../img/no.png";
import SafetyMultiLocMultiTime from "./FrameworkFourtyEight/SafetyMultiLocMultiTime";
import SafetySingleLocMultTime from "./SafetySingleLocMultTime";
import SafetySingleLocSingleTime from "./SafetySingleLocSingleTime";
import MultipleYearMultipleTimeForWorker from "./MultipleYearMultipleTimeForWorker";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import AllLocAllTime from "./AllLocAllTime";
import CompareMultiple from "../DashboardComponents/CompareMultiple";

const Safety = ({
  locationOption,
  timePeriods,
  keyTab,
  graphData,
  frameworkValue,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  lastYearGraphData
}) => {
  const [companyFramework, setCompanyFramework] = useState([]);
  const [wellBeingEmployee, setWellBeingEmployee] = useState([]);
  const [wellBeingWorker, setWellBeingWorker] = useState([]);
  const [retirementBeneﬁtsEmployees, setRetirementBeneﬁtsEmployees] = useState(
    []
  );
  const [retirementBeneﬁtsWorkers, setRetirementBeneﬁtsWorkers] = useState([]);
  const [finalMatchedComplaintsEmployee, setFinalMatchedComplaintsEmployee] =
    useState([]);
  const [finalMatchedComplaintsWorker, setFinalMatchedComplaintsWorker] =
    useState([]);

  const [safetyMeasure, setSafetyMeasure] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState();
  const [activebtnTab, setactivebtnTab] = useState(0);

  const [brief, setBrief] = useState();
  const [safetyBrief, setSafetyBrief] = useState();

  const handleTabClick = (index) => {
    setactivebtnTab(index);
  };

  useEffect(() => {
    if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
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
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Number of Mock Drills": new Array(locationOption.length).fill(0),
              "Number of Safety Trainings": new Array(
                locationOption.length
              ).fill(0),
              "Fire Safety Audits": new Array(locationOption.length).fill(0),
              "Number of Safety Committee Meetings": new Array(
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
              "Number of Mock Drills": new Array(transformedKeys.length).fill(
                0
              ),
              "Number of Safety Trainings": new Array(
                transformedKeys.length
              ).fill(0),
              "Fire Safety Audits": new Array(transformedKeys.length).fill(0),
              "Number of Safety Committee Meetings": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 438 ||
            item?.questionId === 439 ||
            item?.questionId === 440 ||
            item?.questionId === 441 ||
            item?.questionId === 442
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

      setSafetyBrief(summary);
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
      const timePeriodsArray = Object.values(newTimePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Number of Mock Drills": new Array(locationOption.length).fill(0),
              "Number of Safety Trainings": new Array(
                locationOption.length
              ).fill(0),
              "Fire Safety Audits": new Array(locationOption.length).fill(0),
              "Number of Safety Committee Meetings": new Array(
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
              "Number of Mock Drills": new Array(transformedKeys.length).fill(
                0
              ),
              "Number of Safety Trainings": new Array(
                transformedKeys.length
              ).fill(0),
              "Fire Safety Audits": new Array(transformedKeys.length).fill(0),
              "Number of Safety Committee Meetings": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (newGraphData) {
        const filteredData = newGraphData.filter(
          (item) =>
            item?.questionId === 438 ||
            item?.questionId === 439 ||
            item?.questionId === 440 ||
            item?.questionId === 441 ||
            item?.questionId === 442
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
console.log(summary,"summarysummarysummarysummary")
      setSafetyBrief(summary);
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);

  useEffect(() => {
    if (companyFramework && companyFramework.includes(48) && lastYearGraphData && graphData && keyTab === 'compareToYear') {
      const mergeWithYearKeys = (...objects) => {
        const merged = {};
        objects.forEach(obj => {
          Object.entries(obj).forEach(([month, value]) => {
            const year = value.split("-")[0];
            const newKey = `${month}-${year}`;
            merged[newKey] = value;
          });
        });
        return merged;
      };
      const newTimePeriods = mergeWithYearKeys(compareLastTimePeriods, compareTCurrentimePeriods);
      const newGraphData = [...graphData, ...lastYearGraphData];
      const timePeriodsArray = Object.values(newTimePeriods || []);
      setTimePeriodValues(timePeriodsArray);
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

      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Fatalities (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "High-consequence injuries (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "Recordable injuries (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "Recordable work-related ill health cases (Number of cases)":
                new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              "Fatalities (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "High-consequence injuries (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "Recordable injuries (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "Recordable work-related ill health cases (Number of cases)":
                new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (newGraphData) {
        const filteredData = newGraphData.filter(
          (item) =>
            item?.questionId === 443 ||
            item?.questionId === 444 ||
            item?.questionId === 445 ||
            item?.questionId === 446
        );
        const convertedData = filteredData;
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

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const empDiffIncl =
        graphData?.filter(
          (item) =>
            item.title === "Details of measures for the well-being of employees"
        ) || [];
      const workDiffIncl =
        graphData?.filter(
          (item) =>
            item.title === "Details of measures for the well-being of workers"
        ) || [];
      const safety =
        graphData?.filter(
          (item) => item.title === "Details of Safety-Related Incidents"
        ) || [];

      const retirementBeneﬁtsEmployee =
        graphData?.filter(
          (item) =>
            item.title === "Details of Retirement Benefits for Employees"
        ) || [];

      const retirementBeneﬁtsWorker =
        graphData?.filter(
          (item) => item.title === "Details of Retirement Benefits for Workers"
        ) || [];

      const complaintsEmployee =
        graphData?.filter(
          (item) =>
            item.title ===
            "Number of Complaints Filed by Employees in Current Financial Year"
        ) || [];

      const complaintsWorker =
        graphData?.filter(
          (item) =>
            item.title ===
            "Number of Complaints Filed by worker in Current Financial Year"
        ) || [];

      const matchedDiffIncl =
        empDiffIncl?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedWorkDiffIncl =
        workDiffIncl?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedSafety =
        safety?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedretiRementBeneﬁtsEmployee =
        retirementBeneﬁtsEmployee?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedRetirementBeneﬁtsWorker =
        retirementBeneﬁtsWorker?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedComplaintsEmployee =
        complaintsEmployee?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedComplaintsWorker =
        complaintsWorker?.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const finalEnergy = matchedDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = matchedWorkDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = matchedSafety.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalMatchedretiRementBeneﬁtsEmployee =
        matchedretiRementBeneﬁtsEmployee.filter((item) =>
          locationOption.some((location) => location.id === item.sourceId)
        );

      const finalMatchedRetirementBeneﬁtsWorker =
        matchedRetirementBeneﬁtsWorker.filter((item) =>
          locationOption.some((location) => location.id === item.sourceId)
        );

      const finalMatchedComplaintsEmployee = matchedComplaintsEmployee.filter(
        (item) =>
          locationOption.some((location) => location.id === item.sourceId)
      );

      const finalMatchedComplaintsWorker = matchedComplaintsWorker.filter(
        (item) =>
          locationOption.some((location) => location.id === item.sourceId)
      );

      setWellBeingEmployee(finalEnergy);
      setWellBeingWorker(finalEnergyTwo);
      setRetirementBeneﬁtsEmployees(finalMatchedretiRementBeneﬁtsEmployee);
      setRetirementBeneﬁtsWorkers(finalMatchedRetirementBeneﬁtsWorker);
      setFinalMatchedComplaintsEmployee(finalMatchedComplaintsEmployee);
      setFinalMatchedComplaintsWorker(finalMatchedComplaintsWorker);
      setSafetyMeasure(finalEnergyThree);
    } else if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
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

      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);

      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              "Fatalities (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "High-consequence injuries (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "Recordable injuries (Number of cases)": new Array(
                locationOption.length
              ).fill(0),
              "Recordable work-related ill health cases (Number of cases)":
                new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              "Fatalities (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "High-consequence injuries (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "Recordable injuries (Number of cases)": new Array(
                transformedKeys.length
              ).fill(0),
              "Recordable work-related ill health cases (Number of cases)":
                new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 443 ||
            item?.questionId === 444 ||
            item?.questionId === 445 ||
            item?.questionId === 446
        );
        const convertedData = filteredData;
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
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);

  const renderUI = () => {
    if (!companyFramework || !companyFramework.length) return null;
    if (!timePeriodValues || !timePeriodValues.length) return null;

    // Early return if companyFramework is invalid

    const isSingleLocationSingleTime =
      (locationOption.length === 1 && timePeriodValues.length === 1) ||
      (locationOption.length > 1 &&
        timePeriodValues.length === 1 &&
        keyTab === "combined");

    const isMultipleLocationsOrTimes =
      (locationOption.length > 1 &&
        timePeriodValues.length > 1 &&
        keyTab === "combined") ||
      (locationOption.length > 1 && timePeriodValues.length === 1) ||
      (locationOption.length === 1 && timePeriodValues.length > 1);

    switch (activebtnTab) {
      case 1:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            type={"Worker"}
            titleThree={"Details of Safety-Related Incidents"}
            dataThree={safetyMeasure}
            dataTwo={wellBeingWorker}
            titleTwo={"Measure Of Well-Being  For other than-Permanent Worker"}
            dataOne={wellBeingWorker}
            titleOne={"Measure Of Well-Being  For Permanent Workers"}
            companyFramework={companyFramework}
            brief={brief}
            datafour={retirementBeneﬁtsWorkers}
            titlefour="Details of Retirement Benefits for Workers"
            datafive={finalMatchedComplaintsWorker}
            titlefive="Details of Complaints for Workers"
          />
        ) : keyTab === "compareToYear" ? (
          <MultipleYearMultipleTimeForWorker
            keyTab={keyTab}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            companyFramework={companyFramework}
            compareLastTimePeriods={compareLastTimePeriods}
            compareTCurrentimePeriods={compareTCurrentimePeriods}
            financialYear={financialYear}
            type={"Worker"}
            safetyBrief={safetyBrief}
            brief={brief}
          />
        ) : wellBeingWorker.length > 0 ||
          (brief && Object.keys(brief).length > 0) ? (
          companyFramework.includes(1) ? (
            isSingleLocationSingleTime ? (
              <>
                <SafetySingleLocSingleTime
                  type={"Worker"}
                  titleThree={"Details of Safety-Related Incidents"}
                  dataThree={safetyMeasure}
                  dataTwo={wellBeingWorker}
                  titleTwo={
                    "Measure Of Well-Being  For other than-Permanent Worker"
                  }
                  dataOne={wellBeingWorker}
                  titleOne={"Measure Of Well-Being  For Permanent Workers"}
                  companyFramework={companyFramework}
                  datafour={retirementBeneﬁtsWorkers}
                  titlefour="Details of Retirement Benefits for Workers"
                  datafive={finalMatchedComplaintsWorker}
                  titlefive="Details of Complaints for Workers"
                  safetyBrief={safetyBrief}
                  brief={brief}
                />
              </>
            ) : isMultipleLocationsOrTimes ? (
              <>
                <SafetySingleLocMultTime
                  dataOne={wellBeingWorker}
                  timePeriods={timePeriods}
                  dataTwo={wellBeingWorker}
                  timePeriodValues={timePeriodValues}
                  locationOption={locationOption}
                  type={"Worker"}
                  dataThree={safetyMeasure}
                  companyFramework={companyFramework}
                  safetyBrief={safetyBrief}
                />
              </>
            ) : (
              <>{/* Add your fallback content here */}</>
            )
          ) : isSingleLocationSingleTime ? (
            <>
              <SafetySingleLocSingleTime
                type={"Worker"}
                titleThree={"Details of Safety-Related Incidents"}
                dataThree={safetyMeasure}
                timePeriodValues={timePeriodValues}
                brief={brief}
                dataTwo={wellBeingWorker}
                titleTwo={
                  "Measure Of Well-Being  For other than-Permanent Worker"
                }
                dataOne={wellBeingWorker}
                titleOne={"Measure Of Well-Being  For Permanent Workers"}
                companyFramework={companyFramework}
                datafour={retirementBeneﬁtsWorkers}
                titlefour="Details of Retirement Benefits for Workers"
                datafive={finalMatchedComplaintsWorker}
                titlefive="Details of Complaints for Workers"
                safetyBrief={safetyBrief}
              />
            </>
          ) : isMultipleLocationsOrTimes ? (
            <>
              <SafetySingleLocMultTime
                dataOne={wellBeingWorker}
                timePeriods={timePeriods}
                dataTwo={wellBeingWorker}
                timePeriodValues={timePeriodValues}
                brief={brief}
                type={"Worker"}
                dataThree={safetyMeasure}
                companyFramework={companyFramework}
                safetyBrief={safetyBrief}
                locationOption={locationOption}
              />
            </>
          ) : (
            timePeriodValues && (
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
                      <CompareMultiple
                        timePeriodValues={timePeriodValues}
                        timePeriods={timePeriods}
                        graphData={graphData}
                        locationOption={locationOption}
                        type="INCIDENT"
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
                        timePeriods={timePeriods}
                        graphData={graphData}
                        type="TRAINING"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <>
            <div className="container">
              <img
                src={no} // Replace with the actual image path or URL
                alt="No Data Available"
                style={{
                  width: "150px",
                  height: "125px",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </>
        );

      case 0:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            type={"Employee"}
            titleThree={"Details of Safety-Related Incidents"}
            dataThree={safetyMeasure}
            dataTwo={wellBeingEmployee}
            titleTwo={
              "Measure Of Well-Being  For other than-Permanent Employees"
            }
            dataOne={wellBeingEmployee}
            titleOne={"Measure Of Well-Being  For Permanent Employees"}
            companyFramework={companyFramework}
            brief={brief}
            safetyBrief={safetyBrief}
            datafour={retirementBeneﬁtsEmployees}
            titlefour="Details of Retirement Benefits for Employees"
            datafive={finalMatchedComplaintsEmployee}
            titlefive="Details of Complaints for Employees"
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
            type={"Employee"}
            safetyBrief={safetyBrief}
            brief={brief}
          />
        ) : wellBeingEmployee.length > 0 ||
          (brief && Object.keys(brief).length > 0) ? (
          companyFramework.includes(1) ? (
            isSingleLocationSingleTime ? (
              <>
                <SafetySingleLocSingleTime
                  type={"Employee"}
                  titleThree={"Details of Safety-Related Incidents"}
                  dataThree={safetyMeasure}
                  dataTwo={wellBeingEmployee}
                  titleTwo={
                    "Measure Of Well-Being  For other than-Permanent Employees"
                  }
                  dataOne={wellBeingEmployee}
                  titleOne={"Measure Of Well-Being  For Permanent Employees"}
                  companyFramework={companyFramework}
                  brief={brief}
                  datafour={retirementBeneﬁtsEmployees}
                  titlefour="Details of Retirement Benefits for Employees"
                  datafive={finalMatchedComplaintsEmployee}
                  titlefive="Details of Complaints for Employees"
                  safetyBrief={safetyBrief}
                />
              </>
            ) : isMultipleLocationsOrTimes ? (
              <>
                <SafetySingleLocMultTime
                  dataOne={wellBeingEmployee}
                  timePeriods={timePeriods}
                  dataTwo={wellBeingEmployee}
                  type={"Employee"}
                  dataThree={safetyMeasure}
                  companyFramework={companyFramework}
                  brief={brief}
                  safetyBrief={safetyBrief}
                  timePeriodValues={timePeriodValues}
                  locationOption={locationOption}
                />
              </>
            ) : (
              <>{/* Add your fallback content here */}</>
            )
          ) : isSingleLocationSingleTime ? (
            <>
              <SafetySingleLocSingleTime
                type={"Employee"}
                titleThree={"Details of Safety-Related Incidents"}
                dataThree={safetyMeasure}
                dataTwo={wellBeingWorker}
                titleTwo={
                  "Measure Of Well-Being  For other than-Permanent Employees"
                }
                dataOne={wellBeingWorker}
                titleOne={"Measure Of Well-Being  For Permanent Employees"}
                companyFramework={companyFramework}
                brief={brief}
                datafour={retirementBeneﬁtsEmployees}
                datafive={finalMatchedComplaintsEmployee}
                titlefive="Details of Complaints for Employees"
                safetyBrief={safetyBrief}
              />
            </>
          ) : isMultipleLocationsOrTimes ? (
            <>
              {" "}
              <SafetySingleLocMultTime
                dataOne={wellBeingEmployee}
                timePeriods={timePeriods}
                dataTwo={wellBeingEmployee}
                type={"Employee"}
                dataThree={safetyMeasure}
                companyFramework={companyFramework}
                brief={brief}
                safetyBrief={safetyBrief}
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
              />
            </>
          ) : (
            timePeriodValues && (
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
                      <CompareMultiple
                        timePeriodValues={timePeriodValues}
                        timePeriods={timePeriods}
                        graphData={graphData}
                        locationOption={locationOption}
                        type="INCIDENT"
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
                        timePeriods={timePeriods}
                        graphData={graphData}
                        type="TRAINING"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <>
            <div className="container">
              <img
                src={no} // Replace with the actual image path or URL
                alt="No Data Available"
                style={{
                  width: "150px",
                  height: "125px",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="progress-container" style={{ width: "100%" }}>
      {!companyFramework.includes(48) && (
        <div
          className="d-flex justify-content-between buttoncont"
          style={{ marginBottom: "25px", width: "25%", height: "6vh" }}
        >
          <button
            className={`btn button ${activebtnTab === 0 ? " activebtn" : ""}`}
            onClick={() => handleTabClick(0)}
            style={{
              paddingLeft: "5vw",
              paddingRight: "5vw",
              width: "45%",
              height: "100%",
            }}
          >
            Employee
          </button>
          <button
            className={`btn button ${activebtnTab === 1 ? " activebtn" : ""}`}
            onClick={() => handleTabClick(1)}
            style={{
              paddingLeft: "5vw",
              paddingRight: "5vw",
              width: "45%",
              height: "100%",
            }}
          >
            Worker
          </button>
        </div>
      )}
      {renderUI()}
    </div>
  );
};

export default Safety;
