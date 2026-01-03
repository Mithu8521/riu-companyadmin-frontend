import React, { useEffect, useState } from "react";
import DiversityMultiLoc from "./FrameworkOne/DiversityMultiLoc";
import DiversityMultiLocTwo from "./FrameworkOne/DiversityMultiLocTwo";
import DiversityMultiLocSingleForPie from "./FrameworkFourtyEight/DiversityMultiLocSingleForPie";
import TrendsDataCalculator from "../DashboardComponents/TrendsDataCalculator";
import ProductWiseStacked from "../DashboardComponents/ProductWiseStacked";
import ProductWiseTrendType from "../DashboardComponents/ProductWiseTrendType";

const DiversitySingleTimeMultLoc = ({
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              title={titleOne}
              unit="Number"
              tab="Diversity"
              DTYPE="PERMANENT"
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataTwo}
              title={titleTwo}
              DTYPE="PERMANENT"
              unit="Number"
              tab="Diversity"
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
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataOne}
              DTYPE="OPERMANENT"
              title={titleFour}
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
            width: "100%",
            marginTop: "10px",
          }}
        >
          <div style={{ height: "100" }} className="my-2 container">
            <ProductWiseStacked
              timePeriodValues={timePeriodValues}
              locationOption={locationOption}
              timePeriods={timePeriods}
              product={dataTwo}
              title={titleFive}
              DTYPE="OPERMANENT"
              unit="Number"
              tab="Diversity"
            />
          </div>
        </div>
      </div>
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

export default DiversitySingleTimeMultLoc;
