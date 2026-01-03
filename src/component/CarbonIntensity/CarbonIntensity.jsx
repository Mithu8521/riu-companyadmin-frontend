import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import SingleLocMultTime from "./SingleLocMultTime";
import SingleLocSingleTime from "./SingleLocSingleTime";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import AllLocAllTime from "./AllLocAllTime";
import IntensityBarFourtyEight from "./FrameworkFourtyEight/IntensityBarFourtyEight";
import CompareMultiple from "../DashboardComponents/CompareMultiple";

const CarbonIntensity = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  keyTab,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
}) => {
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [companyFramework, setCompanyFramework] = useState([]);
  const [brief, setBrief] = useState();
  const [carbonIntensity, setCarbonIntensity] = useState([]);
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

  const getCarbonIntensityQuestionAnswer = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getCarbonIntensityQuestionAnswer`,
          {},
          { financialYearId },
          "GET"
        );

        if (isSuccess) {
          setCarbonIntensity(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };
  

  useEffect(() => {   
      getCarbonIntensityQuestionAnswer();
  }, [locationOption, graphData, timePeriods, companyFramework]);
  const [quarters, setQuarters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({ time: {}, location: {} });

  
  useEffect(() => {
    if (
      carbonIntensity &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
    ) {
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            'Revenue (In Cr)': new Array(locationOption.length).fill(0),
            "Total Built-up Area (sq. ft)": new Array(locationOption.length).fill(0),
            'Total Patient Served': new Array(locationOption.length).fill(0),
            'Total Bed Days Or Occupied Beds': new Array(locationOption.length).fill(0),                
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            'Revenue (In Cr)': new Array(transformedKeys.length).fill(0),
            "Total Built-up Area (sq. ft)": new Array(transformedKeys.length).fill(0),
            'Total Patient Served': new Array(transformedKeys.length).fill(0),
            'Total Bed Days Or Occupied Beds': new Array(transformedKeys.length).fill(0),                
          };
        });
      });

      const convertedData = carbonIntensity;
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
                  item.title === key &&
                  item.fromDate === formDate &&
                  item.sourceId === obj.id
              );

              summary.time[location][key][k] =
                Number(filterData?.intensity) || 0;
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
                  item.title === key &&
                  item.fromDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.intensity) || 0;
            }
          }
        }
      }
      setData({
        time: summary.time,
        location: summary.location,
      });
    } else{
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            'Total Units Produced': new Array(locationOption.length).fill(0),
            "Total Output (Tonnes)": new Array(locationOption.length).fill(0),
            'Revenue (In Cr)': new Array(locationOption.length).fill(0),
            'Total Machine Operating Per Hour': new Array(locationOption.length).fill(0),      
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            'Total Units Produced': new Array(transformedKeys.length).fill(0),
            "Total Output (Tonnes)": new Array(transformedKeys.length).fill(0),
            'Revenue (In Cr)': new Array(transformedKeys.length).fill(0),
            'Total Machine Operating Per Hour': new Array(transformedKeys.length).fill(0),      
          };
        });
      });

      const convertedData = carbonIntensity;
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
                  item.title === key &&
                  item.fromDate === formDate &&
                  item.sourceId === obj.id
              );

              summary.time[location][key][k] =
                Number(filterData?.intensity) || 0;
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
                  item.title === key &&
                  item.fromDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.intensity) || 0;
            }
          }
        }
      }

      setData({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, carbonIntensity]);

    // useEffect(() => {
    //   const activityData = {
    //     "Total Emission": {
    //       number: `${
    //         Number(totalConsumptionRenewable) +
    //         Number(totalConsumptionNonRenewable)
    //       } tCO2`,
    //       questionId: [],
    //     },
    //     "Scope 1": {
    //       number: `${Number(totalConsumptionRenewable || 0)} tCO2`,
    //       questionId: [],
    //     },
    //     "Scope 2": {
    //       number: `${Number(totalConsumptionNonRenewable || 0)} tCO2`,
    //       questionId: [],
    //     },
    //     message: "Good Evening, Sunil Kumar",
    //   };
    //   setLastWeekActivities(activityData);
    // }, [totalConsumptionRenewable, totalConsumptionNonRenewable]);

  useEffect(() => {
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue
        .map((value) => value?.id)
        .filter((id) => id !== undefined);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  

  return (
    <div className="progress-container">
      {keyTab === "combinedAll" ? (
        <AllLocAllTime
          keyTab={keyTab}
          locationOption={locationOption}
          brief={data}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}        
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
          brief={data}
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
            <SingleLocSingleTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              brief={data}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
           
              companyFramework={companyFramework}
            />
          </>
        ) : (locationOption.length > 1 &&
            timePeriodValues.length > 1 &&
            keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length == 1 && timePeriodValues.length > 1) ? (
          <>
            <SingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWater={matchedDataWater}
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
          <SingleLocSingleTime
            graphData={graphData}
            keyTab={keyTab}
            companyFramework={companyFramework}
            brief={data}
          />
        </>
      ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
        (locationOption.length > 1 && timePeriodValues.length === 1) ||
        (locationOption.length == 1 && timePeriodValues.length > 1) ? (
        <>
          <SingleLocMultTime
            graphData={graphData}
            keyTab={keyTab}
            brief={data}
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
                  <IntensityBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={data}
                    timePeriods={timePeriods}
                    type={companyFramework.includes(48) ? "TOTALPATIENTSERVED" : "TOTALUNITSPRODUCED"}
                    companyFramework={companyFramework}
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
                  <IntensityBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={data}
                    timePeriods={timePeriods}
                    type={companyFramework.includes(48) ? "TOTALBEDDAYSOROCCUPIEDBEDS" : "TOTALOUTPUTTONNES"}
                    companyFramework={companyFramework}
                  />
                </div>
              </div>
            </div>

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
                  <IntensityBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={data}
                    timePeriods={timePeriods}
                    type={companyFramework.includes(48) ? "REVENUEINTENSITY" : "REVENUEMINTENSITY"}
                    companyFramework={companyFramework}
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
                  <IntensityBarFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={data}
                    timePeriods={timePeriods}
                      type={companyFramework.includes(48) ? "TOTALMACHINEOPERATINGPERHOUR" : "TOTALMACHINEOPERATINGPERHOUR"}
                      companyFramework={companyFramework}
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
                      brief={carbonIntensity}
                      graphData={carbonIntensity}
                      type={companyFramework.includes(48) ? "HOSPITALINTENSITY" : "MANUFACTURINGINTENSITY"}
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
                  <div style={{ height: "100" }} className="my-2 ">
                    
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

export default CarbonIntensity;
