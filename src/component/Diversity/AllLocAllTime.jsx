import React, { useEffect, useState } from "react";
import DiversityMultiLocSingleForPie from "./FrameworkFourtyEight/DiversityMultiLocSingleForPie";
import DiversityBarComponent from "./FrameworkOne/DiversityBarComponent";
import DiversityBarComponentTwo from "./FrameworkOne/DiversityBarComponentTwo";
import DiversityMultipleBarComponent from "./FrameworkOne/DiversityMultipleBarComponet";
import DiversityBarStackComponent from "./FrameworkOne/DiversityBarStackComponent";
import DiversityBarPieComponent from "./FrameworkOne/DiversityBarPieComponent";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import TabularDataCalculator from "../DashboardComponents/TabularDataCalculator";

const AllLocAllTime = ({
  companyFramework,
  timePeriods,
  dataOne,
  titleOne,
  dataTwo,
  titleTwo,
  diversity,
  titleThree,
  titleFour,
  titleFive,
  brief,
  timePeriodValues,
  locationOption,
  titlesix,
  titleseven,
}) => {
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

  return companyFramework.includes(1) ? (
    <div className="d-flex flex-column flex-space-between">
      <div
        className="d-flex flex-row flex-space-between"
        style={{ marginBottom: "1%" }}
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
          <div style={{ height: "100%" }} className="container">
            <DiversityBarStackComponent
              title={titlesix}
              dataOne={dataOne}
              timePeriodValues={timePeriodValues}
              timePeriods={timePeriods}
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
            width: "50%",
          }}
        >
          <div style={{ height: "100%" }} className="container">
            <TabularDataCalculator
              graphData={dataOne}
              title={titleseven}
              DTYPE="OVERALL"
              type="DIV"
              unit="Number"
              tab="Diversity"
            />
          </div>
        </div>
      </div>
      <div
        className="d-flex flex-row flex-space-between"
        style={{ height: "100vh", marginBottom: "3%" }}
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
          <div style={{ height: "48%" }} className="my-2 container">
            <TabularDataCalculator
              graphData={dataOne}
              title={titleOne}
              DTYPE="PERMANENT"
              type="DIV"
              unit="Number"
              tab="Diversity"
            />
          </div>
          <div style={{ height: "48%" }} className="my-2 container">
            <TabularDataCalculator
              graphData={dataTwo}
              title={titleTwo}
              DTYPE="PERMANENT"
              type="DIV"
              unit="Number"
              tab="Diversity"
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
          <div style={{ height: "48%" }} className="my-2 container">
            <TabularDataCalculator
              graphData={dataOne}
              title={titleFour}
              DTYPE="OPERMANENT"
              type="DIV"
              unit="Number"
              tab="Diversity"
            />
          </div>

          <div style={{ height: "48%" }} className="my-2 container">
            <TabularDataCalculator
              graphData={dataTwo}
              title={titleFive}
              DTYPE="OPERMANENT"
              type="DIV"
              unit="Number"
              tab="Diversity"
            />
          </div>
        </div>
      </div>
      {/* <div className="d-flex flex-row flex-space-between">
        <div
          className="firsthalfprogressenergy"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <DiversityMultipleBarComponent data={diversity} />
        </div>
      </div> */}
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
          <div style={{ height: "100%" }} className="my-2 container">
            <TrendsDataCalculator
              brief={brief}
              type="GENDERDIV"
              tab="Diversity"
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
          <div style={{ height: "100%" }} className="my-2 container">
            <TrendsDataCalculator brief={brief} type="AGEDIV" tab="Diversity" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLocAllTime;
