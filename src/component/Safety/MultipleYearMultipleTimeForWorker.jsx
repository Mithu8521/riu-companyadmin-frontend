import React, { useEffect, useRef, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import SafetyMultiBarYear from "./SafetyMultiBarYear";
import SafetyVerticalBarFourtyEight from "./FrameworkFourtyEight/SafetyVerticalBarFourtyEight";
import CompareToPreviousYearProductWise from "../DashboardComponents/CompareToPreviousYearProductWise";

const MultipleYearMultipleTimeForWorker = ({
  keyTab,
  locationOption,
  companyFramework,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  type,
  safetyBrief,
  brief,
}) => {
  const [graphData, setGraphData] = useState(null);
  const isMounted = useRef(true);
  const [permanentEmployeDiversity, setPermanentEmployeDiversity] =
    useState(null);
  const [
    otherThanPermanentEmployeDiversity,
    setOtherThanPermanentEmployeDiversity,
  ] = useState(null);
  const [timePerids, setTimePerids] = useState(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCompareDiversityData = async () => {
    if (financialYear && financialYear.length >= 2) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getCompareSafetyData`,
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
            (item) => item?.questionId === 123
          );
          setPermanentEmployeDiversity(permanentEmployeDiversity);
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
    getCompareDiversityData();
  }, [financialYear]);

  const isCompareLastTimePeriodsValid =
    compareLastTimePeriods && Object.keys(compareLastTimePeriods).length > 0;
  const isCompareTCurrentimePeriodsValid =
    compareTCurrentimePeriods &&
    Object.keys(compareTCurrentimePeriods).length > 0;

  const shouldRenderGraphs =
    isCompareLastTimePeriodsValid && isCompareTCurrentimePeriodsValid;

  return companyFramework && companyFramework.includes(1) ? (
    <div className="d-flex flex-column flex-space-between">
      <div className="d-flex flex-row flex-space-between">
        <div
          className="firsthalfprogressenergy"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            {permanentEmployeDiversity && (
              <CompareToPreviousYearProductWise
                type={type}
                product={permanentEmployeDiversity}
                locationOption={locationOption}
                timePeriodValues={timePerids}
                number={0}
                timePeriods={timePerids}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
                title={`Permanent Male ${type}`}
                unit="Number"
                tab="Safety"
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
          }}
        >
          <div style={{ height: "100%" }} className="my-2 container">
            {permanentEmployeDiversity && (
              <CompareToPreviousYearProductWise
                type={type}
                product={permanentEmployeDiversity}
                locationOption={locationOption}
                timePeriodValues={timePerids}
                number={0}
                timePeriods={timePerids}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
                title={`Permanent Female ${type}`}
                unit="Number"
                tab="Safety"
                indexing={1}
              />
            )}
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
            {permanentEmployeDiversity && (
              <CompareToPreviousYearProductWise
                type={type}
                product={permanentEmployeDiversity}
                locationOption={locationOption}
                timePeriodValues={timePerids}
                number={0}
                timePeriods={timePerids}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
                title={`Other than Permanent Male ${type}`}
                unit="Number"
                tab="Safety"
                indexing={2}
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
          <div style={{ height: "100%" }} className="my-2 container">
            {permanentEmployeDiversity && (
              <CompareToPreviousYearProductWise
                type={type}
                product={permanentEmployeDiversity}
                locationOption={locationOption}
                timePeriodValues={timePerids}
                number={0}
                timePeriods={timePerids}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
                title={`Other than Permanent Female ${type}`}
                unit="Number"
                tab="Safety"
                indexing={3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
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
          <div style={{ height: "100%" }} className="my-3">
            <SafetyVerticalBarFourtyEight
              brief={brief}
              heading="Safety Related Incidents"
              categories={[
                "Fatalities (Number of cases)",
                "High-consequence injuries (Number of cases)",
                "Recordable injuries (Number of cases)",
                "Recordable work-related ill health cases (Number of cases)",
              ]}
              shortenedMap={{
                "Fatalities (Number of cases)": "Fatalities",
                "High-consequence injuries (Number of cases)":
                  "High Consequences",
                "Recordable injuries (Number of cases)": "Recordable",
                "Recordable work-related ill health cases (Number of cases)":
                  "Work Related Ill Health",
              }}
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
            marginBottom: "20px",
          }}
        >
          <div style={{ height: "100%" }} className="my-3">
            <SafetyVerticalBarFourtyEight
              brief={safetyBrief}
              heading="Development & Training"
              categories={[
                "Number of Mock Drills",
                "Number of Safety Trainings",
                "Fire Safety Audits",
                "Number of Safety Committee Meetings",
              ]}
              shortenedMap={{
                "Number of Mock Drills": "Mock Drills",
                "Number of Safety Trainings": "Safety Trainings",
                "Fire Safety Audits": "Fire Safety Audits",
                "Number of Safety Committee Meetings":
                  "Safety Committee Meetings",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleYearMultipleTimeForWorker;
