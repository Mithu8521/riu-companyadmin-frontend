import React, { useEffect, useRef, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import CompareToPreviousYear from "../DashboardComponents/CompareToPreviousYear";
import CompareToPreviousYearProductWise from "../DashboardComponents/CompareToPreviousYearProductWise";

const MultipleYearMultipleTime = ({
  number,
  keyTab,
  locationOption,
  companyFramework,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  brief,
  timePeriodValues,
}) => {
  const [graphData, setGraphData] = useState(null);
  const isMounted = useRef(true);
  const [permanentEmployeDiversity, setPermanentEmployeDiversity] = useState(
    []
  );
  const [
    otherThanPermanentEmployeDiversity,
    setOtherThanPermanentEmployeDiversity,
  ] = useState([]);
  const [timePerids, setTimePerids] = useState({});

  const [performance, setPerformance] = useState([]);
  const [mainTraing, setMainTraing] = useState([]);

  const [permanentEmployeDiversityW, setPermanentEmployeDiversityW] = useState(
    []
  );
  const [
    otherThanPermanentEmployeDiversityW,
    setOtherThanPermanentEmployeDiversityW,
  ] = useState([]);

  const [performanceW, setPerformanceW] = useState([]);
  const [mainTraingW, setMainTraingW] = useState([]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCompareDiversityData = async () => {
    if (financialYear && financialYear.length >= 2) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getCompareTrainingData`,
          {},
          {
            financialYearIds: [
              financialYear[financialYear.length - 2].id,
              financialYear[financialYear.length - 1].id,
            ],
          },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          const permanentEmployeDiversity = data.data.filter(
            (item) => item?.questionId === 190
          );
          const otherThanPermanentEmployeDiversity = data.data.filter(
            (item) => item?.questionId === 236
          );
          setPermanentEmployeDiversity(permanentEmployeDiversity);
          setOtherThanPermanentEmployeDiversity(
            otherThanPermanentEmployeDiversity
          );
          const performance = data.data.filter(
            (item) => item?.questionId === 198
          );
          const mainTraing = data.data.filter(
            (item) => item?.questionId === 75
          );

          console.log()
          setPerformance(performance);

          const permanentEmployeDiversityW = data.data.filter(
            (item) => item?.questionId === 191
          );
          setPermanentEmployeDiversityW(permanentEmployeDiversityW);

          const performanceW = data.data.filter(
            (item) => item?.questionId === 200
          );
          setPerformanceW(performanceW);

          setMainTraing(mainTraing);
          setGraphData(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
      }
    }
  };

  useEffect(() => {
    // Helper function to extract the year and month from a date
    const getYearMonth = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}`; // Format as "YYYY-MM"
    };

    // Get the latest date based on year and month from compareLastTimePeriods
    const latestLastPeriodDate = Object.values(compareLastTimePeriods)
      .map((date) => getYearMonth(date))
      .sort((a, b) => b.localeCompare(a))[0]; // Sort and get the latest year-month

    // Get the corresponding key for the latest year-month in compareLastTimePeriods
    const latestLastPeriodKey = Object.keys(compareLastTimePeriods).find(
      (key) =>
        getYearMonth(compareLastTimePeriods[key]) === latestLastPeriodDate
    );

    // Create an object with the key-value pair of the latest year-month
    const latestLastPeriodObj = {
      [latestLastPeriodKey]: latestLastPeriodDate,
    };

    // Extract the latest year-month from compareTCurrentimePeriods
    const latestCurrentPeriodDate = Object.values(compareTCurrentimePeriods)
      .map((date) => getYearMonth(date))
      .sort((a, b) => b.localeCompare(a))[0]; // Sort and get the latest year-month

    // Get the corresponding key for the latest year-month in compareTCurrentimePeriods
    const latestCurrentPeriodKey = Object.keys(compareTCurrentimePeriods).find(
      (key) =>
        getYearMonth(compareTCurrentimePeriods[key]) === latestCurrentPeriodDate
    );

    // Create an object with the key-value pair of the latest year-month
    const latestCurrentPeriodObj = {
      [latestLastPeriodKey]: latestLastPeriodDate,
      [latestCurrentPeriodKey]: latestCurrentPeriodDate,
    };

    setTimePerids(latestCurrentPeriodObj);
  }, [compareLastTimePeriods, compareTCurrentimePeriods]);

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      getCompareDiversityData();
    }
  }, [financialYear, companyFramework]);

  return companyFramework && companyFramework.includes(1) ? (
    <div className="d-flex flex-column flex-space-between">
      {permanentEmployeDiversity && (
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
                <CompareToPreviousYearProductWise
                  product={number ===1 ? permanentEmployeDiversityW:permanentEmployeDiversity}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Trained on Health & Safety Measures`}
                  unit="Number"
                  tab="Training"
                  indexing={0}
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
                <CompareToPreviousYearProductWise
                  product={number ===1 ? permanentEmployeDiversityW:permanentEmployeDiversity}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Trained On Skill Upgradation`}
                  unit="Number"
                  tab="Training"
                  indexing={1}
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
                {otherThanPermanentEmployeDiversity && (
                  <CompareToPreviousYearProductWise
                    product={otherThanPermanentEmployeDiversity}
                    locationOption={locationOption}
                    timePeriodValues={timePerids}
                    number={0}
                    timePeriods={timePerids}
                    compareLastTimePeriods={compareLastTimePeriods}
                    compareTCurrentimePeriods={compareTCurrentimePeriods}
                    financialYear={financialYear}
                    title={`Trained on human rights issues and policies`}
                    unit="Number"
                    tab="Diversity"
                    indexing={0}
                  />
                )}
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
                <CompareToPreviousYearProductWise
                  product={number ===1 ? performanceW:performance}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Performance and career development reviews`}
                  unit="Number"
                  tab="Diversity"
                  indexing={0}
                />
              </div>
            </div>
          </div>
        </div>
      )}

{permanentEmployeDiversity && (
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
                <CompareToPreviousYearProductWise
                  product={mainTraing}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Total number of training and awareness programmes held`}
                  unit="Number"
                  tab="Training"
                  Heading= "MAIN"
                  indexing={0}
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
              <CompareToPreviousYearProductWise
                  product={mainTraing}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Percentage of persons covered by the awareness program`}
                  unit="Number"
                  tab="Training"
                  Heading= "PMAIN"
                  indexing={0}
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
                {otherThanPermanentEmployeDiversity && (
                  <CompareToPreviousYearProductWise
                  product={mainTraing}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Principles covered under the training`}
                  unit="Number"
                  tab="Training"
                  Heading= "PRIMAIN"
                  indexing={0}
                />
                )}
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
      )}
    </div>
  ) : (
    <></>
  );
};

export default MultipleYearMultipleTime;
