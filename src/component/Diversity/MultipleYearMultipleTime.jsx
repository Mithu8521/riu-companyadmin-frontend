import React, { useEffect, useRef, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import DiversityMultiLocYear from "./DiversityMultiYear";
import DiversityMultiYearTwo from "./DiversityMultiYearTwo";
import CustomerMultiBarTurnOver from "./CustomerMultiBarTurnOver";
import DiversityMultiLocSingleForPie from "./FrameworkFourtyEight/DiversityMultiLocSingleForPie";
import CompareToPreviousYear from "../DashboardComponents/CompareToPreviousYear";
import CompareToPreviousYearProductWise from "../DashboardComponents/CompareToPreviousYearProductWise";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const MultipleYearMultipleTime = ({
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
  const [turnOverDataEmployee, setTurnOverDataEmployee] = useState(null);
  const [turnOverDataWorker, setTurnOverDataWorker] = useState(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getTurnOverRate = async () => {
    if (financialYear && financialYear.length >= 2) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getTurnOverRate`,
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
          const datas = data.data;

          // Step 1: Group data by formDate
          const groupedData = datas.reduce((acc, entry) => {
            if (!acc[entry.formDate]) {
              acc[entry.formDate] = { 26: null, 46: null, 28: null, 48: null };
            }

            // Store answers separately for 26, 46, 28, and 48
            if (entry.questionId === 26)
              acc[entry.formDate]["26"] = entry.answer;
            if (entry.questionId === 46)
              acc[entry.formDate]["46"] = entry.answer;
            if (entry.questionId === 28)
              acc[entry.formDate]["28"] = entry.answer;
            if (entry.questionId === 48)
              acc[entry.formDate]["48"] = entry.answer;

            return acc;
          }, {});

          // Step 2: Compute percentage for (46 / 26) * 100 and (48 / 28) * 100
          const mergedData = Object.entries(groupedData)
            .map(([formDate, values]) => {
              const { 26: ans26, 46: ans46, 28: ans28, 48: ans48 } = values;

              // Function to calculate percentage correctly (46/26 and 48/28)
              const calculatePercentage = (numArray, denArray) => {
                if (!numArray || !denArray) return null;
                return denArray.map((denRow, rowIndex) =>
                  denRow.map((den, colIndex) => {
                    const num = numArray[rowIndex]?.[colIndex] || 1; // Avoid division by zero
                    return num !== 0
                      ? ((Number(den) / Number(num)) * 100).toFixed(2)
                      : "N/A";
                  })
                );
              };

              return [
                {
                  questionId: "26_46",
                  formDate,
                  answer26: ans26,
                  answer46: ans46,
                  percentage: calculatePercentage(ans26, ans46),
                },
                {
                  questionId: "28_48",
                  formDate,
                  answer28: ans28,
                  answer48: ans48,
                  percentage: calculatePercentage(ans28, ans48),
                },
              ];
            })
            .flat();
          const filteredDataEmployee = mergedData.filter(
            (entry) => entry.questionId !== "26_46"
          );
          const filteredDataWorker = mergedData.filter(
            (entry) => entry.questionId !== "28_48"
          );
          setTurnOverDataWorker(filteredDataEmployee);
          setTurnOverDataEmployee(filteredDataWorker);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
      }
    }
  };

  const getCompareDiversityData = async () => {
    if (financialYear && financialYear.length >= 2) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getCompareDiversityData`,
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
            (item) => item?.questionId === 26
          );
          const otherThanPermanentEmployeDiversity = data.data.filter(
            (item) => item?.questionId === 30
          );
          setPermanentEmployeDiversity(permanentEmployeDiversity);
          setOtherThanPermanentEmployeDiversity(
            otherThanPermanentEmployeDiversity
          );
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
      getTurnOverRate();
    }
  }, [financialYear, companyFramework]);

  const isCompareLastTimePeriodsValid =
    compareLastTimePeriods && Object.keys(compareLastTimePeriods).length > 0;
  const isCompareTCurrentimePeriodsValid =
    compareTCurrentimePeriods &&
    Object.keys(compareTCurrentimePeriods).length > 0;
  const [hasGenderData, setHasGenderData] = useState(false);
  const [hasAgeData, setHasAgeData] = useState(false);

  // Check if there's data for each diversity type
  useEffect(() => {
    if (brief && brief.time) {
      // Function to check if there's data for given categories
      const checkDataForCategories = (categories) => {
        const timeData = Object.values(brief.time);

        for (const period of timeData) {
          for (const category of categories) {
            if (period[category] && Array.isArray(period[category])) {
              const sum = period[category].reduce(
                (acc, val) => acc + (val || 0),
                0
              );
              if (sum > 0) {
                return true;
              }
            } else if (period[category] && period[category] > 0) {
              return true;
            }
          }
        }

        return false;
      };

      // Check for gender diversity data
      const genderCategories = [
        "Current employees by Gender (in %) Male",
        "Current employees by Gender (in %) Female",
        "New hires by Gender Male",
        "New hires by Gender Female",
      ];

      // Check for age diversity data
      const ageCategories = [
        "Employees less than 30 years of age (%)",
        "Employees between 30-50 years of age (%)",
        "Employees more than 50 years of age (%)",
      ];

      setHasGenderData(checkDataForCategories(genderCategories));
      setHasAgeData(checkDataForCategories(ageCategories));
    }
  }, [brief]);
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
              }}
            >
              <div style={{ height: "100%" }} className="my-2 container">
                <CompareToPreviousYearProductWise
                  product={permanentEmployeDiversity}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Permanant Employees Including Differently Abled`}
                  unit="Number"
                  tab="Diversity"
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
              }}
            >
              <div style={{ height: "100" }} className="my-2 container">
                <CompareToPreviousYearProductWise
                  product={permanentEmployeDiversity}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Non-Permanent Employees Including Differently Abled`}
                  unit="Number"
                  tab="Diversity"
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
                    title={`Differently Abled Permanent Employees`}
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
              }}
            >
              <div style={{ height: "100" }} className="my-2 container">
                <CompareToPreviousYearProductWise
                  product={otherThanPermanentEmployeDiversity}
                  locationOption={locationOption}
                  timePeriodValues={timePerids}
                  number={0}
                  timePeriods={timePerids}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                  title={`Differently Abled Non-Permanent Employees`}
                  unit="Number"
                  tab="Diversity"
                  indexing={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {turnOverDataEmployee && (
        <div
          className="d-flex flex-row flex-space-between"
          style={{ height: "120vh", marginBottom: "3%" ,marginTop: "10px" }}
        >
          <div
            className="firsthalfprogressenergy"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <div style={{ height: "49%" }} className="container">
              <CompareToPreviousYear
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={turnOverDataEmployee}
                financialYear={financialYear}
                title={"Permanant Male Employees TurnOver"}
                unit="Percentage"
                Tab="Diversity"
                columnIndex={0}
                rowIndex={0}
              />
            </div>

            <div style={{ height: "49%" }} className="container">
              <CompareToPreviousYear
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={turnOverDataEmployee}
                financialYear={financialYear}
                title={"Other Than Permanant Male Employees TurnOver"}
                unit="Percentage"
                Tab="Diversity"
                columnIndex={1}
                rowIndex={0}
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
            }}
          >
            <div style={{ height: "49%" }} className="container">
              <CompareToPreviousYear
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={turnOverDataEmployee}
                financialYear={financialYear}
                title={"Permanant Female Employees TurnOver"}
                unit="Percentage"
                Tab="Diversity"
                columnIndex={0}
                rowIndex={1}
              />
            </div>
            <div style={{ height: "49%" }} className="container">
              <CompareToPreviousYear
                compareLastTimePeriods={compareLastTimePeriods}
                locationOption={locationOption}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                graphData={turnOverDataEmployee}
                financialYear={financialYear}
                title={"Other Than Permanant Female Employees TurnOver"}
                unit="Percentage"
                Tab="Diversity"
                columnIndex={1}
                rowIndex={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              brief={brief}
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
            <ProductWiseTrendType
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              brief={brief}
              type="AGEDIV"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleYearMultipleTime;
