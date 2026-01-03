import React from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import due from "../../img/Due.svg";
import updated from "../../img/updated.svg";
import done from "../../img/shape.svg";
import defaulted from "../../img/Defaulted.svg";
import { useState } from "react";
import { useEffect } from "react";
import TrainingSingleLocSingleTime from "./TrainingSingleLocSingleTime";
import TrainingSingleLocMultTime from "./TrainingSingleLocMultTime";
import TrainingMultiLocMultiTimeTwo from "./FrameworkFourtyEight/TrainingMultiLocMultiTimeTwo";
import AllLocAllTime from "./AllLocAllTime";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";

const Training = ({
  locationOption,
  timePeriods,
  financialYearId,
  keyTab,
  graphData,
  frameworkValue,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
}) => {
  const location = 2;
  const [lastWeekAcitivities, setLastWeekAcitivities] = useState();
  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
  };
  const [chartData, setChartData] = useState({
    series: [],
    categories: ["Male", "Female"],
  });
  const [chartDataTwo, setChartDataTwo] = useState({
    series: [],
    categories: ["Male", "Female"],
  });

  const [companyFramework, setCompanyFramework] = useState([]);
  const [activebtnTab, setactivebtnTab] = useState(0);

  const lastWeekActivity = async () => {
    if (chartData?.series?.length && chartData.series[0]?.data?.length) {
      const lastWeekData = {
        "Employees Trained on Health and Safety": {
          number: parseInt(chartData.series[0].data[2], 10),
          questionId: [],
        },
        "Employees Trained on Skill Upgradation": {
          number: parseInt(chartDataTwo.series[0]?.data[2], 10),
          questionId: [],
        },
        "Workers Trained on Health and Safety": {
          number: parseInt(chartData.series[1]?.data[2], 10),
          questionId: [],
        },
        "Workers Trained on Skill Upgradation": {
          number: parseInt(chartDataTwo.series[1]?.data[2], 10),
          questionId: [],
        },
        message: "Good Evening, Sunil Kumar",
      };
      setLastWeekAcitivities(lastWeekData);
    }
  };

  const [trainingEmployee, setTrainingEmployee] = useState([]);
  const [trainingWorker, setTrainingWorker] = useState([]);
  const [mainTraining, setMainTraining] = useState([]);
  const [performanceEmployee, setPerformanceEmployee] = useState([]);
  const [performanceWorker, setPerformanceWorker] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState();
  const [healthh, setHealthh] = useState([]);
  const [brief, setBrief] = useState();

  const handleTabClick = (index) => {
    setactivebtnTab(index);
  };

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const trainingMain =
        graphData?.filter(
          (item) => item.title === "Training and awareness programmes"
        ) || [];

      const empDiffIncl =
        graphData?.filter(
          (item) => item.title === "Details of Training Given to Employees"
        ) || [];

      const workDiffIncl =
        graphData?.filter(
          (item) => item.title === "Details of Training Given to workers"
        ) || [];

      const perE =
        graphData?.filter(
          (item) =>
            item.title ===
            "Details of Performance and Career Development Reviews of Employees"
        ) || [];

      const perW =
        graphData?.filter(
          (item) =>
            item.title ===
            "Details of Performance and Career Development Reviews of workers"
        ) || [];

      const health =
        graphData?.filter(
          (item) =>
            item.title === "Training on Human Rights Issues and Policies"
        ) || [];

      const matchedDiffIncl =
        empDiffIncl?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];

      const matchedTrainingMain =
        trainingMain?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];

      const matchedWorkDiffIncl =
        workDiffIncl?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];

      const perEE =
        perE?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];

      const perWW =
        perW?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];
      const healthW =
        health?.filter((item) =>
          Object.values(timePeriods || {}).includes(item.formDate)
        ) || [];

      const finalZeroEnergy = matchedTrainingMain.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergy = matchedDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = matchedWorkDiffIncl.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = perEE.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyFour = perWW.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );
      const finalEnergyFive = healthW.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setMainTraining(finalZeroEnergy);
      setTrainingEmployee(finalEnergy);
      setTrainingWorker(finalEnergyTwo);
      setPerformanceEmployee(finalEnergyThree);
      setPerformanceWorker(finalEnergyFour);
      setHealthh(finalEnergyFive);

      const aggregateData = (data) => {
        let totalMales = 0;
        let totalFemales = 0;

        data?.forEach((item) => {
          const answers = item.answer || [[], []];
          const males = parseInt(answers[0]?.[0], 10) || 0;
          const females = parseInt(answers[0]?.[1], 10) || 0;

          totalMales += males;
          totalFemales += females;
        });

        const total = totalMales + totalFemales;

        return { totalMales, totalFemales, total };
      };

      const employeeData = aggregateData(matchedDiffIncl);
      const TrainingData = aggregateData(matchedTrainingMain);

      const workerData = aggregateData(matchedWorkDiffIncl);

      const employeeTotal = employeeData.totalMales + employeeData.totalFemales;
      const workerTotal = workerData.totalMales + workerData.totalFemales;

      setChartData({
        series: [
          {
            name: "Employees",
            data: [
              employeeData.totalMales,
              employeeData.totalFemales,
              employeeTotal,
            ],
          },
          {
            name: "Workers",
            data: [workerData.totalMales, workerData.totalFemales, workerTotal],
          },
        ],
        categories: ["Male", "Female", "Total"],
      });

      const employeeDataTwo = aggregateData(perEE);
      const workerDataTwo = aggregateData(perWW);

      const employeeTotalTwo =
        employeeDataTwo.totalMales + employeeDataTwo.totalFemales;
      const workerTotalTwo =
        workerDataTwo.totalMales + workerDataTwo.totalFemales;

      setChartDataTwo({
        series: [
          {
            name: "Employees",
            data: [
              employeeDataTwo.totalMales,
              employeeDataTwo.totalFemales,
              employeeTotalTwo,
            ],
          },
          {
            name: "Workers",
            data: [
              workerDataTwo.totalMales,
              workerDataTwo.totalFemales,
              workerTotalTwo,
            ],
          },
        ],
        categories: ["Male", "Female", "Total"],
      });
    } else {
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
              "Safety Trainings": new Array(locationOption.length).fill(0),
              "Safety Committee Meetings": new Array(
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
              "Safety Trainings": new Array(transformedKeys.length).fill(0),
              "Safety Committee Meetings": new Array(
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

      setBrief(summary);
    }
  }, [graphData, timePeriods, companyFramework, locationOption]);

  useEffect(() => {
    if (chartData?.series?.length || chartDataTwo?.series?.length) {
      lastWeekActivity();
    }
  }, [chartData, chartDataTwo]);

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
    const workerDataThree = healthh.map((item) => ({
      ...item,
      answer: item.answer.slice(1),
    }));
    switch (activebtnTab) {
      case 1:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            number={1}
            dataOne={trainingWorker}
            dataTwo={performanceWorker}
            dataThree={workerDataThree}
            companyFramework={companyFramework}
            brief={brief}
            timePeriodValues={timePeriodValues}
            timePeriods={timePeriods}
            locationOption={locationOption}
            dataFour={mainTraining}
          />
        ) : keyTab === "compareToYear" ? (
          <MultipleYearMultipleTime
          number={1}
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
        ) :
        companyFramework.includes(1) ? (
          isSingleLocationSingleTime ? (
            <>
              <TrainingSingleLocSingleTime
                number={1}
                dataOne={trainingWorker}
                dataTwo={performanceWorker}
                dataThree={workerDataThree}
                companyFramework={companyFramework}
                brief={brief}
                timePeriodValues={timePeriodValues}
                timePeriods={timePeriods}
                locationOption={locationOption}
                dataFour={mainTraining}
              />
            </>
          ) : isMultipleLocationsOrTimes ? (
            <>
              <TrainingSingleLocMultTime
                companyFramework={companyFramework}
                dataTwo={performanceWorker}
                dataThree={healthh}
                number={1}
                brief={brief}
                dataOne={trainingWorker}
                timePeriodValues={timePeriodValues}
                timePeriods={timePeriods}
                dataFour={mainTraining}
                locationOption={locationOption}
              />
            </>
          ) : (
            <>{/* Add your fallback content here */}</>
          )
        ) : isSingleLocationSingleTime ? (
          <>
            <TrainingSingleLocSingleTime
              companyFramework={companyFramework}
              brief={brief}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              locationOption={locationOption}
            />
          </>
        ) : isMultipleLocationsOrTimes ? (
          <>
            <TrainingSingleLocMultTime
              companyFramework={companyFramework}
              brief={brief}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              locationOption={locationOption}
              dataFour={mainTraining}
            />
          </>
        ) : (
          timePeriodValues && (
            <div className="d-flex flex-column flex-space-between">
              <div
                className="d-flex flex-row flex-space-between"
                style={{
                  gap: "20px",
                  height: "75vh",
                  marginBottom: "3%",
                  width: "76vw",
                }}
              >
                <div className="nothing" style={{ width: "50%" }}>
                  <TrainingMultiLocMultiTimeTwo
                    brief={brief}
                    categories={["Average training hours per employee"]}
                    shortenedMap={{
                      "Average training hours per employee":
                        "Average training hours per employee",
                    }}
                    title="Average training hours per employee"
                  />
                </div>
                <div className="nothing" style={{ width: "50%" }}>
                  <TrainingMultiLocMultiTimeTwo
                    brief={brief}
                    categories={[
                      "mock drills",
                      "Fire Safety Audits",
                      "Safety Trainings",
                      "Safety Committee Meetings",
                    ]}
                    shortenedCategories={[
                      "mock drills",
                      "Fire Safety Audits",
                      "Safety Trainings",
                      "Safety Committee Meetings",
                    ]}
                    title="Development & Training"
                  />
                </div>
              </div>
            </div>
          )
        );
      case 0:
        return keyTab === "combinedAll" ? (
          <AllLocAllTime
            number={0}
            dataOne={trainingEmployee}
            dataTwo={performanceEmployee}
            dataThree={healthh}
            companyFramework={companyFramework}
            brief={brief}
            timePeriodValues={timePeriodValues}
            timePeriods={timePeriods}
            locationOption={locationOption}
            dataFour={mainTraining}
          />
        ) : keyTab === "compareToYear" ? (
          <MultipleYearMultipleTime
          number={0}
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
        ) :
        companyFramework.includes(1) ? (
          isSingleLocationSingleTime ? (
            <>
              <TrainingSingleLocSingleTime
                number={0}
                dataOne={trainingEmployee}
                dataTwo={performanceEmployee}
                dataThree={healthh}
                companyFramework={companyFramework}
                brief={brief}
                timePeriodValues={timePeriodValues}
                timePeriods={timePeriods}
                locationOption={locationOption}
                dataFour={mainTraining}
              />
            </>
          ) : isMultipleLocationsOrTimes ? (
            <>
              <TrainingSingleLocMultTime
                companyFramework={companyFramework}
                dataTwo={performanceEmployee}
                dataThree={healthh}
                number={0}
                brief={brief}
                dataOne={trainingEmployee}
                timePeriodValues={timePeriodValues}
                timePeriods={timePeriods}
                locationOption={locationOption}
                dataFour={mainTraining}
              />
            </>
          ) : (
            <>{/* Add your fallback content here */}</>
          )
        ) : isSingleLocationSingleTime ? (
          <>
            <TrainingSingleLocSingleTime
              number={0}
              dataOne={trainingEmployee}
              dataTwo={performanceEmployee}
              dataThree={healthh}
              companyFramework={companyFramework}
              brief={brief}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              locationOption={locationOption}
            />
          </>
        ) : isMultipleLocationsOrTimes ? (
          <>
            <TrainingSingleLocMultTime
              companyFramework={companyFramework}
              dataTwo={performanceEmployee}
              dataThree={healthh}
              number={0}
              brief={brief}
              dataOne={trainingEmployee}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
              locationOption={locationOption}
              dataFour={mainTraining}
            />{" "}
          </>
        ) : (
          timePeriodValues && (
            <div className="d-flex flex-column flex-space-between">
              <div
                className="d-flex flex-row flex-space-between"
                style={{
                  gap: "20px",
                  height: "75vh",
                  marginBottom: "3%",
                  width: "76vw",
                }}
              >
                <div className="nothing" style={{ width: "50%" }}>
                  <TrainingMultiLocMultiTimeTwo
                    brief={brief}
                    categories={["Average training hours per employee"]}
                    shortenedMap={{
                      "Average training hours per employee":
                        "Average training hours per employee",
                    }}
                    title="Average training hours per employee"
                  />
                </div>
                <div className="nothing" style={{ width: "50%" }}>
                  <TrainingMultiLocMultiTimeTwo
                    brief={brief}
                    categories={[
                      "mock drills",
                      "Fire Safety Audits",
                      "Safety Trainings",
                      "Safety Committee Meetings",
                    ]}
                    shortenedCategories={[
                      "mock drills",
                      "Fire Safety Audits",
                      "Safety Trainings",
                      "Safety Committee Meetings",
                    ]}
                    title="Development & Training"
                  />
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
    <div  style={{ width: "100%" }}>
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

export default Training;
