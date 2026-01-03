import React, { useEffect, useState } from "react";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import DiversitySingleTimeMultLoc from "./DiversitySingleTimeMultLoc";
import DiversitySingleTimeSingleLoc from "./DiversitySingleTimeSingleLoc";
import DiversityMultiLocMultTimeDistri from "./FrameworkFourtyEight/DiversityMultLocMultTimeDistri";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import MultipleYearMultipleTimeForWorker from "./MultipleYearMultipleTimeForWorker";
import AllLocAllTime from "./AllLocAllTime";
import TopComponentDiversity from "./TopComponentDiversity";
import CompareMultiple from "../DashboardComponents/CompareMultiple";

const Diversity = ({
  locationOption,
  timePeriods,
  keyTab,
  graphData,
  frameworkValue,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  lastYearGraphData,
}) => {
  const [timePeriodValues, setTimePeriodValues] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    males: 0,
    females: 0,
    others: 0,
    maxConsumption: 0,
  });
  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
  };

  const [empInclDif, setEmpInclDif] = useState([]);
  const [workInclDif, setWorkInclDif] = useState([]);
  const [empDif, setEmpDif] = useState([]);
  const [workDif, setWorkDif] = useState([]);
  const [diversity, setDiversity] = useState([]);
  const [companyFramework, setCompanyFramework] = useState([]);
  const [activebtnTab, setactivebtnTab] = useState(0);
  const [brief, setBrief] = useState();
  const [employeeDetails, setEmployeeDetails] = useState();

  const handleTabClick = (index) => {
    setactivebtnTab(index);
  };

  useEffect(() => {
    // Update states based on filtered graphData and timePeriods
    if (companyFramework && companyFramework.includes(1)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const empDiffIncl =
        graphData?.filter(
          (item) =>
            item.title ===
            "Gender Diversity (including differently abled employees)"
        ) || [];
      const workDiffIncl =
        graphData?.filter(
          (item) =>
            item.title ===
            "Gender Diversity (including differently abled workers)"
        ) || [];
      const empDiff =
        graphData?.filter(
          (item) =>
            item.title === "Gender Diversity (diffferently abled employees)"
        ) || [];
      const workDiff =
        graphData?.filter(
          (item) =>
            item.title === "Gender Diversity (diffferently abled workers)"
        ) || [];
      const diver =
        graphData?.filter((item) => item.title === "Diversity in Leadership") ||
        [];

      const matchedDiffIncl =
        empDiffIncl.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedWorkDiffIncl =
        workDiffIncl.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedEmpDiff =
        empDiff.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const matchedWorkDiff =
        workDiff.filter((item) => {
          return Object.values(timePeriods || {}).includes(item?.formDate);
        }) || [];

      const finalEnergy = matchedDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = matchedWorkDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = matchedEmpDiff.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyFouur = matchedWorkDiff.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyFive = diver.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setEmpInclDif(finalEnergy);
      setWorkInclDif(finalEnergyTwo);
      setEmpDif(finalEnergyThree);
      setWorkDif(finalEnergyFouur);
      setDiversity(finalEnergyFive);

      let totalMales = 0;
      let totalFemales = 0;
      let totalOthers = 0;

      finalEnergy.forEach((item) => {
        const answers = item.answer || [[], []];

        // Add values from answers[0]
        if (answers[0]?.length === 3) {
          totalMales += parseInt(answers[0][0], 10) || 0;
          totalFemales += parseInt(answers[0][1], 10) || 0;
          totalOthers += parseInt(answers[0][2], 10) || 0;
        }

        // Add values from answers[1]
        if (answers[1]?.length === 3) {
          totalMales += parseInt(answers[1][0], 10) || 0;
          totalFemales += parseInt(answers[1][1], 10) || 0;
          totalOthers += parseInt(answers[1][2], 10) || 0;
        }
      });

      // Set the maximum consumption to the sum of all categories
      const maxConsumption = totalMales + totalFemales + totalOthers;

      setEmployeeData({
        males: totalMales,
        females: totalFemales,
        others: totalOthers,
        maxConsumption: maxConsumption,
      });
    } else if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
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
                readingValue: flattenedAnswer[0].toString(),
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
              "Current employees by Gender (in %) Male": new Array(
                locationOption.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                locationOption.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                locationOption.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
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
              "Current employees by Gender (in %) Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
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
              "Current employees by Gender (in %) Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 432 ||
            item?.questionId === 433 ||
            item?.questionId === 434 ||
            item?.questionId === 435 ||
            item?.questionId === 436 ||
            item?.questionId === 501 ||
            item?.questionId === 502 ||
            item?.questionId === 503 ||
            item?.questionId === 504 ||
            item?.questionId === 505 ||
            item?.questionId === 531
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
              summary.time[location][key][k] = Number(
                filterData?.answer?.readingValue
                  ?.toString()
                  ?.replace("%", "") || 0
              );
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
              summary.location[time][key][k] = Number(
                filterData?.answer?.readingValue
                  ?.toString()
                  ?.replace("%", "") || 0
              );
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
                readingValue: flattenedAnswer[0].toString(),
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
              "Current employees by Gender (in %) Male": new Array(
                locationOption.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                locationOption.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                locationOption.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                locationOption.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                locationOption.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
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
              "Current employees by Gender (in %) Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
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
              "Current employees by Gender (in %) Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Current employees by Gender (in %) Female": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees less than 30 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees between 30-50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Employees more than 50 years of age (%)": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of  New hires by Gender Male": new Array(
                transformedKeys.length
              ).fill(0),
              "Number of New hires by Gender Female": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (<30)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (30-50)": new Array(
                transformedKeys.length
              ).fill(0),
              "New hires by age groups (>50)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (newGraphData) {
        const filteredData = newGraphData.filter(
          (item) =>
            item?.questionId === 432 ||
            item?.questionId === 433 ||
            item?.questionId === 434 ||
            item?.questionId === 435 ||
            item?.questionId === 436 ||
            item?.questionId === 501 ||
            item?.questionId === 502 ||
            item?.questionId === 503 ||
            item?.questionId === 504 ||
            item?.questionId === 505 ||
            item?.questionId === 531
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
              summary.time[location][key][k] = Number(
                filterData?.answer?.readingValue
                  ?.toString()
                  ?.replace("%", "") || 0
              );
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
              summary.location[time][key][k] = Number(
                filterData?.answer?.readingValue
                  ?.toString()
                  ?.replace("%", "") || 0
              );
            }
          }
        }
      }
      setBrief(summary);
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);


  useEffect(() => {
    const data = {
      Workforce: {
        number: 895,
        questionId: [],
        employee: 476,
        worker: 419,
      },
      "Female Represention": {
        number: "9%",
        questionId: [],
        female: 45,
      },
      "Differently Abled": {
        number: "0.03%",
        questionId: [],
        individual: 3,
      },
      "Womens in board": {
        number: `0`,
        questionId: [],
        total: 0,
      },
    };
  }, [frameworkValue]);

  useEffect(() => {
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);

  const renderUI = () => {
    switch (activebtnTab) {
      case 1:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            timePeriodValues={timePeriodValues}
            brief={brief}
            companyFramework={companyFramework}
            titleOne={"Permanant Workers"}
            dataOne={workInclDif}
            titleTwo={"Number Of Differently Abled Permanent Workers"}
            dataTwo={workDif}
            titleThree={"Women and Men in Leadership Roles"}
            titleFour={"Other than-Permanent Workers"}
            titleFive={
              "Number Of Differently Abled Other than-Permanent Workers"
            }
            titlesix={"Workers Gender Distribution"}
            titleseven={"Overall Workers Gender Distribution"}
            diversity={diversity}
            timePeriods={timePeriods}
            locationOption={locationOption}
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
              <DiversitySingleTimeSingleLoc
                titleOne={"Permanant Workers"}
                dataOne={workInclDif}
                titleTwo={"Number Of Differently Abled Permanent Workers"}
                dataTwo={workDif}
                titleThree={"Women and Men in Leadership Roles"}
                titleFour={"Other than-Permanent Workers"}
                titleFive={
                  "Number Of Differently Abled Other than-Permanent Workers"
                }
                titlesix={"Workers Gender Distribution"}
                titleseven={"Overall Workers Gender Distribution"}
                diversity={diversity}
                companyFramework={companyFramework}
                timePeriods={timePeriods}
                timePeriodValues={timePeriodValues}
                locationOption={locationOption}
                brief={brief}
              />
            </>
          ) : (locationOption.length > 1 &&
            timePeriodValues.length > 1 &&
            keyTab === "combined") ||
            (locationOption.length > 1 && timePeriodValues.length === 1) ||
            (locationOption.length === 1 && timePeriodValues.length > 1) ? (
            <>
              <DiversitySingleTimeMultLoc
                titleOne={"Permanant Workers"}
                dataOne={workInclDif}
                titleTwo={"Number Of Differently Abled Permanent Workers"}
                dataTwo={workDif}
                titleThree={"Women and Men in Leadership Roles"}
                titleFour={"Other than-Permanent Workers"}
                titleFive={
                  "Number Of Differently Abled Other than-Permanent Workers"
                }
                diversity={diversity}
                companyFramework={companyFramework}
                timePeriods={timePeriods}
                timePeriodValues={timePeriodValues}
                brief={brief}
                locationOption={locationOption}
              />
            </>
          ) : (
            <>{/* Content goes here */}</>
          )
        ) : (timePeriodValues &&
          locationOption.length === 1 &&
          timePeriodValues.length === 1) ||
          (locationOption.length > 1 &&
            timePeriodValues.length === 1 &&
            keyTab === "combined") ? (
          <>
            <DiversitySingleTimeSingleLoc
              titleOne={"Permanant Workers"}
              dataOne={workInclDif}
              titleTwo={"Number Of Differently Abled Permanent Workers"}
              dataTwo={workDif}
              titleThree={"Percentage of Women and Men in Leadership Roles"}
              titleFour={"Other than-Permanent Workers"}
              titleFive={
                "Number Of Differently Abled Other than-Permanent Workers"
              }
              titlesix={"Workers Gender Distribution"}
              titleseven={"Overall Workers Gender Distribution"}
              brief={brief}
              diversity={diversity}
              companyFramework={companyFramework}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
            />
          </>
        ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length === 1 && timePeriodValues.length > 1) ? (
          <>
            <DiversitySingleTimeMultLoc
              titleOne={"Permanant Workers"}
              dataOne={workInclDif}
              titleTwo={"Number Of Differently Abled Permanent Workers"}
              dataTwo={workDif}
              titleThree={"Women and Men in Leadership Roles"}
              titleFour={"Other than-Permanent Workers"}
              titleFive={
                "Number Of Differently Abled Other than-Permanent Workers"
              }
              brief={brief}
              diversity={diversity}
              companyFramework={companyFramework}
              timePeriods={timePeriods}
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
                      brief={brief}
                      timePeriods={timePeriods}
                      graphData={graphData}
                      locationOption={locationOption}
                      type="GENDERDIV"
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
                      brief={brief}
                      timePeriods={timePeriods}
                      graphData={graphData}
                      type="AGEDIV"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        );

      case 0:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            timePeriodValues={timePeriodValues}
            brief={brief}
            companyFramework={companyFramework}
            titleOne={"Permanant Employees"}
            dataOne={empInclDif}
            titleTwo={"Number Of Differently Abled Permanent Employees"}
            dataTwo={empDif}
            titleThree={"Percentage of Women and Men in Leadership Roles"}
            titleFour={"Other than-Permanent Employees"}
            titleFive={
              "Number Of Differently Abled Other than-Permanent Employees"
            }
            titlesix={"Employees Gender Distribution"}
            titleseven={"Overall Employees Gender Distribution"}
            diversity={diversity}
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
              <DiversitySingleTimeSingleLoc
                titleOne={"Permanant Employees"}
                dataOne={empInclDif}
                titleTwo={"Number Of Differently Abled Permanent Employees"}
                dataTwo={empDif}
                titleThree={"Percentage of Women and Men in Leadership Roles"}
                titleFour={"Other than-Permanent Employees"}
                titleFive={
                  "Number Of Differently Abled Other than-Permanent Employees"
                }
                diversity={diversity}
                companyFramework={companyFramework}
                titlesix={"Employees Gender Distribution"}
                titleseven={"Overall Employees Gender Distribution"}
              />
            </>
          ) : (locationOption.length > 1 &&
            timePeriodValues.length > 1 &&
            keyTab === "combined") ||
            (locationOption.length > 1 && timePeriodValues.length === 1) ||
            (locationOption.length === 1 && timePeriodValues.length > 1) ? (
            <>
              <DiversitySingleTimeMultLoc
                titleOne={"Permanant Employees"}
                dataOne={empInclDif}
                titleTwo={"Number Of Differently Abled Permanent Employees"}
                dataTwo={empDif}
                titleThree={"Women and Men in Leadership Roles"}
                titleFour={"Other than-Permanent Employees"}
                titleFive={
                  "Number Of Differently Abled Other than-Permanent Employees"
                }
                diversity={diversity}
                timePeriods={timePeriods}
                companyFramework={companyFramework}
                locationOption={locationOption}
                timePeriodValues={timePeriodValues}
              />
            </>
          ) : (
            <>{/* Content goes here */}</>
          )
        ) : (timePeriodValues &&
          locationOption.length === 1 &&
          timePeriodValues.length === 1) ||
          (locationOption.length > 1 &&
            timePeriodValues.length === 1 &&
            keyTab === "combined") ? (
          <>
            <DiversitySingleTimeSingleLoc
              timePeriodValues={timePeriodValues}
              brief={brief}
              companyFramework={companyFramework}
            />
          </>
        ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length === 1 && timePeriodValues.length > 1) ? (
          <>
            <DiversitySingleTimeMultLoc
              timePeriodValues={timePeriodValues}
              brief={brief}
              locationOption={locationOption}
              companyFramework={companyFramework}
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
                      brief={brief}
                      timePeriods={timePeriods}
                      graphData={graphData}
                      locationOption={locationOption}
                      type="GENDERDIV"
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
                      brief={brief}
                      timePeriods={timePeriods}
                      graphData={graphData}
                      type="AGEDIV"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        );

      default:
        return null;
    }
  };

  return (
    <div className="progress-container" style={{ width: "100%" }}>
      {/* Only render buttons if companyFramework does not include 48 */}
      {/* {companyFramework &&
        companyFramework.length > 0 &&
        companyFramework.includes(1) && (
          <div className="mb-4">
            <TopComponentDiversity />
          </div>
        )} */}
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

      {/* Render the rest of the UI */}
      {renderUI()}
    </div>
  );
};

export default Diversity;
