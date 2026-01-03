import React, { useEffect, useState } from "react";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import "./energy.css";
import EnergyIntensityMulti from "./EnergyIntensity";
import ProductWiseEnergyConsumption from "./ProductWiseEnergyConsumption";
import SingleLocMultTime from "./SingleLocMultTime";
import SingleLocSingleTime from "./SingleLocSingleTime";
import TopComponentEnergy from "./TopComponentEnergy";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import AllLocAllTime from "./AllLocAllTime";

const Energy = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  keyTab,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  energyData
}) => {
  
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [companyFramework, setCompanyFramework] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState([]);
  const [renewableEnergy, setRenewableEnergy] = useState();
  const [nonRenewableEnergy, setNonRenewableEnergy] = useState();
  const [energy, setEnergy] = useState(null);
  const [totalConsumptionRenewable, setTotalConsumptionRenewable] = useState();
  const [totalConsumptionNonRenewable, setTotalConsumptionNonRenewable] =
    useState();
  const [brief, setBrief] = useState();

  const icons = {
    0: done,
    1: updated,
    2: due,
    3: defaulted,
  };

  const getEnergyEmissionComparison = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
          {},
          { financialYearId, key: "ENERGY" },
          "GET"
        );

        if (isSuccess) {
          setEnergy(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };
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

  const mergeFuelData = (data) => {
    const mergedData = {};

    Object.values(data).forEach((monthData) => {
      Object.entries(monthData).forEach(([fuelType, values]) => {
        if (!mergedData[fuelType]) {
          mergedData[fuelType] = Array(values.length).fill(0);
        }
        // Summing values month-wise
        mergedData[fuelType] = mergedData[fuelType].map(
          (sum, index) => sum + values[index]
        );
      });
    });

    return mergedData;
  };

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const energyRenew =
        graphData?.filter(
          (item) => item.title === "Energy Consumption from Renewable Sources"
        ) || [];
      const nonEnergyRenew =
        graphData?.filter(
          (item) =>
            item.title === "Energy Consumption from Non-renewable Sources"
        ) || [];

      const newEnergyRenew = energyRenew.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newNonEnergyRenew = nonEnergyRenew.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalEnergy = newEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonEnergy = newNonEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );
      setRenewableEnergy(finalEnergy);
      setNonRenewableEnergy(finalNonEnergy);

      if (!Array.isArray(finalEnergy) || finalEnergy.length === 0) {
        setTotalConsumptionRenewable(0);
        return;
      }

      const firstObject = finalEnergy[0];

      const rowOptions = firstObject.question_details
        .filter((detail) => detail.option_type === "row") // Filter by "row" option_type
        .slice(1) // Skip the first row
        .map((detail) => detail.option)
        .reverse(); // Extract the "option" values

      const aggregatedValues = rowOptions.map((_, index) =>
        finalEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[0];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
      setTotalConsumptionRenewable(total);

      const firstObjectNon = finalNonEnergy[0];

      // Extract all the rows but skip the first one
      const rowOptionsNon = firstObjectNon.question_details
        .filter((detail) => detail.option_type === "row") // Filter by "row" option_type
        .slice(1) // Skip the first row
        .map((detail) => detail.option)
        .reverse(); // Extract the "option" values

      const aggregatedValuesNon = rowOptionsNon.map((_, index) =>
        finalNonEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[0];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      const totalNon = aggregatedValuesNon.reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalConsumptionNonRenewable(totalNon);
    } else if (companyFramework && companyFramework.includes(48)) {
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
              Diesel: new Array(locationOption.length).fill(0),
              Petrol: new Array(locationOption.length).fill(0),
              CNG: new Array(locationOption.length).fill(0),
              PNG: new Array(locationOption.length).fill(0),
              LPG: new Array(locationOption.length).fill(0),
              "GRID electricity": new Array(locationOption.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(locationOption.length).fill(0),
                "Total electricity consumption from Renewable energy (via PPA)": new Array(locationOption.length).fill(0),
              "Total electricity consumption from Renewable energy (rooftop solar)":
                new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              Diesel: new Array(transformedKeys.length).fill(0),
              Petrol: new Array(transformedKeys.length).fill(0),
              CNG: new Array(transformedKeys.length).fill(0),
              PNG: new Array(transformedKeys.length).fill(0),
              LPG: new Array(transformedKeys.length).fill(0),
              "GRID electricity": new Array(transformedKeys.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(transformedKeys.length).fill(0),
                "Total electricity consumption from Renewable energy (via PPA)": new Array(transformedKeys.length).fill(0),
                "Total electricity consumption from Renewable energy (rooftop solar)":
                  new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (energy) {
        const filteredData = energy;
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
                  item?.fuelType === key &&
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
                  item?.fuelType === key &&
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
  }, [locationOption, energy, timePeriods, companyFramework]);

  useEffect(() => {
    const activityData = {
      "Total Energy": {
        number: `${
          Number(totalConsumptionRenewable) +
          Number(totalConsumptionNonRenewable)
        } GJ`,
        questionId: [],
      },
      "Renewable Energy": {
        number: `${Number(totalConsumptionRenewable || 0)} GJ`,
        questionId: [],
      },
      "Non Renewable Energy": {
        number: `${Number(totalConsumptionNonRenewable || 0)} GJ`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  }, [totalConsumptionRenewable, totalConsumptionNonRenewable]);

  useEffect(() => {
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
    getEnergyEmissionComparison();
  }, [frameworkValue]);

  return (
    <div className="progress-container">
      {companyFramework &&
        companyFramework.length > 0 &&
        companyFramework.includes(1) && (
          <div className="topcompo">
            {lastWeekActivities && (
              <TopComponentEnergy
                lastWeekActivities={lastWeekActivities}
                icons={icons}
              />
            )}
          </div>
        )}
      {keyTab === "combinedAll" ? (
        <AllLocAllTime
          graphData={graphData}
          keyTab={keyTab}
          companyFramework={companyFramework}
          brief={brief}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
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
          <SingleLocSingleTime
            graphData={graphData}
            keyTab={keyTab}
            locationOption={locationOption}
            brief={brief}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            renewableEnergy={renewableEnergy}
            nonRenewableEnergy={nonRenewableEnergy}
            totalConsumptionRenewable={totalConsumptionRenewable}
            totalConsumptionNonRenewable={totalConsumptionNonRenewable}
            companyFramework={companyFramework}
          />
        ) : (locationOption.length > 1 &&
            timePeriodValues.length > 1 &&
            keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length === 1 && timePeriodValues.length > 1) ? (
          <SingleLocMultTime
            graphData={graphData}
            keyTab={keyTab}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            renewableEnergy={renewableEnergy}
            nonRenewableEnergy={nonRenewableEnergy}
            totalConsumptionRenewable={totalConsumptionRenewable}
            totalConsumptionNonRenewable={totalConsumptionNonRenewable}
            companyFramework={companyFramework}
          />
        ) : (
          <MultipleYearMultipleTime
            keyTab={keyTab}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            companyFramework={companyFramework}
            compareLastTimePeriods={compareLastTimePeriods}
            compareTCurrentimePeriods={compareTCurrentimePeriods}
            financialYear={financialYear}
          />
        )
      ) : (timePeriodValues &&
          locationOption.length === 1 &&
          timePeriodValues.length === 1) ||
        (locationOption.length > 1 &&
          timePeriodValues.length === 1 &&
          keyTab === "combined") ? (
        <SingleLocSingleTime
          graphData={graphData}
          keyTab={keyTab}
          companyFramework={companyFramework}
          brief={brief}
        />
      ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
        (locationOption.length > 1 && timePeriodValues.length === 1) ||
        (locationOption.length === 1 && timePeriodValues.length > 1) ? (
        // <div></div>
        <SingleLocMultTime
          graphData={graphData}
          keyTab={keyTab}
          brief={brief}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
          companyFramework={companyFramework}
        />
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
                <EnergyIntensityMulti
                  locationOption={locationOption}
                  timePeriods={timePeriods}
                  brief={brief}
                />
              </div>
              <div className="nothing" style={{ width: "50%" }}>
                <ProductWiseEnergyConsumption
                  locationOption={locationOption}
                  timePeriods={timePeriods}
                  financialYearId={financialYearId}
                  graphData={graphData}
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Energy;
