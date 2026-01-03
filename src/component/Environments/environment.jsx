import React from "react";
import { apiCall } from "../../_services/apiCall.js";
import config from "../../config/config.json";
import due from "../../img/Due.svg";
import updated from "../../img/updated.svg";
import { Row, Col } from "react-bootstrap";
import done from "../../img/shape.svg";
import defaulted from "../../img/Defaulted.svg";
import { useState } from "react";
import { useEffect } from "react";
import TopComponentEnvironment from "./TopComponentEnvironment.jsx";
import EnvironmentSingleLocSingleTime from "./EnvironmentSingleLocSingleTime.jsx";
import EnvironmentSingleLocMultipleTime from "./EnvironmentSingleLocMultipleTime.jsx";
import EnergyIntensityMulti from "../Energy/EnergyIntensity.jsx";
import ProductWiseEnergyConsumption from "../Energy/ProductWiseEnergyConsumption.jsx";
import WaterRecycledMultiLoc from "../Water/FrameworkFourtyEight/WaterRecycledMultiLoc.jsx";
import AllLocAllTime from "./AllLocAllTime.jsx";
import EnergyConsumptionFourtyEight from "../Energy/Framework48/EnergyConsumptionFourtyEight.jsx";
import WaterBarFourtyEight from "../Water/FrameworkFourtyEight/WaterBarFourtyEight.jsx";
import WasteConsumptionFourtyEight from "../Waste/FrameworkFourtyEight/WasteConsumptionFourtyEight.jsx";
import WasteMultiLocMultiTime from "../Waste/FrameworkFourtyEight/WasteMultiLocMultiTimeGen.jsx";
import WaterComparison from "../Water/WaterComparison.jsx";
import CompareMultiple from "../DashboardComponents/CompareMultiple.jsx";
import CompareMultipleEne from "../DashboardComponents/CompareMultipleEne.jsx";

const Environment = ({
  locationOption,
  timePeriods,
  keyTab,
  sectorQuestionAnswerDataForGraph,
  financialYearId,
  frameworkValue,
  graphData,
}) => {
  const [lastWeekAcitivities, setLastWeekAcitivities] = useState();
  const [companyFramework, setCompanyFramework] = useState();
  const [renewableEnergy, setRenewableEnergy] = useState();
  const [nonRenewableEnergy, setNonRenewableEnergy] = useState();
  const [emissionScope1, setEmissionScope1] = useState();
  const [emissionScope2, setEmissionScope2] = useState();
  const [energy, setEnergy] = useState(null);

  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
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

  const scopeOne = Number(
    JSON.parse(
      sectorQuestionAnswerDataForGraph?.[0]?.["answer"] || "[]"
    )[0]?.[1] || 0
  );

  const scopeTwo = Number(
    JSON.parse(
      sectorQuestionAnswerDataForGraph?.[0]?.["answer"] || "[]"
    )[1]?.[1] || 0
  );

  const totalScope = scopeOne + scopeTwo;
  const [matchedDataWaste, setMatchedDataWaste] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [totalConsumptionRenewable, setTotalConsumptionRenewable] = useState(0);
  const [totalConsumptionNonRenewable, setTotalConsumptionNonRenewable] =
    useState(0);

  const [totalScope1, setTotalScope1] = useState(0);
  const [totalScope2, setTotalScope2] = useState(0);
  const [bioMedicalBrief, setBioMedicalBrief] = useState();

  const [totalConsumption, setTotalConsumption] = useState(0);
  const [timePeriodValues, setTimePeriodValues] = useState([]);
  const [wasteDisposal, setWasteDisposal] = useState();
  const [wasteRecovered, setWasteRecovered] = useState();
  const [totalSumTwo, setTotalSumTwo] = useState();
  const [totalSumThree, setTotalSumThree] = useState();

  const [waterType, setWaterType] = useState();
  const [waterDischarge, setWaterDischarge] = useState();
  const [matchedWaterDis, setMatchedWaterDis] = useState();
  const [matchedDataWater, setMatchedDataWater] = useState();

  const [totalConsumptionTwo, setTotalConsumptionTwo] = useState(0);
  const [briefEnergy, setBriefEnergy] = useState();
  const [briefWaste, setBriefWaste] = useState();
  const [briefWater, setBriefWater] = useState();

  const wasteSeries = [
    "Plastic",
    "E-Waste",
    "Biomedical",
    "Construction and demolition",
    "Battery",
    "Radioactive",
    "Other hazardous wastes",
    "Other non-hazardous wastes",
  ];

  const wasteSeriesTwo = [
    "Incineration",
    "Landfilling",
    "Other disposal operations",
  ];

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

  const recoverySeries = ["Re-cycled", "Re-used", "Other Recovery Options"];
  // const [companyFramework, setCompanyFramework] = useState([]);

  // Effect to filter data based on titles and match time periods
  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      // this below code is for energy
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

      // Safeguard against undefined timePeriodsArray
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

      // Extract all the rows but skip the first one
      const rowOptions = firstObject.question_details
        .filter((detail) => detail.option_type === "row") // Filter by "row" option_type
        .slice(1) // Skip the first row
        .map((detail) => detail.option)
        .reverse(); // Extract the "option" values

      const aggregatedValuesEnergy = rowOptions.map((_, index) =>
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

      const totalEnergy = aggregatedValuesEnergy.reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalConsumptionRenewable(totalEnergy);
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

      const aggregatedValuesEmission = rowOptionsNon.map((_, index) =>
        finalNonEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[1];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      // Scope 2: Only consider the 0th index
      const totalEmissionScope2 = aggregatedValuesEmission[0] || 0;

      // Scope 1: Sum all other indices (excluding index 0)
      const totalEmissionScope1 = aggregatedValuesEmission
        .slice(1)
        .reduce((sum, value) => sum + value, 0);
      setTotalScope2(totalEmissionScope2);
      setTotalScope1(totalEmissionScope1);
      //this below code is for waste

      const newWasteType =
        graphData?.filter((item) => item.title === "Waste Management") || [];
      const newWasteDischarge =
        graphData?.filter((item) => item.title === "Waste Disposal") || [];
      const newWasteRecovery =
        graphData?.filter((item) => item.title === "Waste Recovery") || [];

      // Update state with filtered data

      // Filter matched data based on time periods
      const newMatchedDataWaste = newWasteType.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const newMatchedDataWasteDischarge = newWasteDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const wasteRecovery = newWasteRecovery.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalWaste = newMatchedDataWaste.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = newMatchedDataWasteDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = wasteRecovery.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setWasteDisposal(finalEnergyTwo);
      setMatchedDataWaste(finalWaste);
      setWasteRecovered(finalEnergyThree);

      // Calculate total sum for waste management
      const aggregatedWaste = wasteSeries.reduce((acc, wasteType) => {
        acc[wasteType] = 0; // Initialize each waste type with 0
        return acc;
      }, {});

      let sum = 0;
      finalWaste.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (wasteSeries[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedWaste[wasteSeries[index]] += numericValue;
            sum += numericValue; // Add to total sum
          }
        });
      });

      setTotalSum(sum);

      // Calculate total sum for waste disposal
      const aggregatedTwo = wasteSeriesTwo.reduce((acc, disposalType) => {
        acc[disposalType] = 0; // Initialize each disposal type with 0
        return acc;
      }, {});

      finalEnergyTwo.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (wasteSeriesTwo[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedTwo[wasteSeriesTwo[index]] += numericValue;
          }
        });
      });

      const seriesData = wasteSeriesTwo.map(
        (disposalType) => aggregatedTwo[disposalType] || 0
      );
      const totalSumTwo = seriesData.reduce((sum, value) => sum + value, 0);
      setTotalSumTwo(totalSumTwo);

      // Calculate total sum for waste recovery
      const aggregatedThree = recoverySeries.reduce((acc, recoveryType) => {
        acc[recoveryType] = 0; // Initialize each recovery type with 0
        return acc;
      }, {});

      finalEnergyThree.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (recoverySeries[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedThree[recoverySeries[index]] += numericValue;
          }
        });
      });

      const totalSumThree = Object.values(aggregatedThree).reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalSumThree(totalSumThree);

      // the below code is for water

      const waterSeries = [
        "Surface Water",
        "Ground Water",
        "Third Party Water",
        "Municipal Water",
        "Seawater / Desalinated Water",
        "Others",
      ];

      const waterSeriesTwo = [
        "To Surface Water",
        "To Ground Water",
        "To Sea Water",
        "Sent to other parties",
        "Others",
      ];

      // Safeguard against undefined graphData or timePeriods
      setTimePeriodValues(timePeriodsArray);

      const newWaterTypeEnv =
        graphData?.filter((item) => item.title === "Water withdrawal") || [];
      const newWaterDischarge =
        graphData?.filter(
          (item) => item.title === "Details of Water Discharge"
        ) || [];
      setWaterType(newWaterTypeEnv);
      setWaterDischarge(newWaterDischarge);

      // Safeguard against undefined timePeriodsArray
      const newMatchedDataWater = newWaterTypeEnv.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newMatchedDataWaterDischarge = newWaterDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalWater = newMatchedDataWater.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonWater = newMatchedDataWaterDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setMatchedWaterDis(finalNonWater);
      setMatchedDataWater(finalWater);

      if (
        !Array.isArray(newMatchedDataWater) ||
        newMatchedDataWater.length === 0
      ) {
        setTotalConsumption(0);
        return;
      }

      const aggregatedValues = waterSeries.map((_, index) =>
        newMatchedDataWater.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
          return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
        }, 0)
      );

      const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
      setTotalConsumption(total);

      const aggregated = waterSeriesTwo.map((_, index) =>
        newMatchedDataWaterDischarge.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]
              ? obj.answer[index]
                  .slice(0, 2)
                  .reduce(
                    (sum, val) =>
                      sum + (val === "NA" || !val ? 0 : parseFloat(val)),
                    0
                  )
              : 0;
          return acc + value;
        }, 0)
      );

      const totalTwo = aggregated.reduce((sum, value) => sum + value, 0);
      setTotalConsumptionTwo(totalTwo);
    } else if (companyFramework && companyFramework.includes(48)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
      const summaryEnergy = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryEnergy.location[quarter] = {
              Diesel: new Array(locationOption.length).fill(0),
              Petrol: new Array(locationOption.length).fill(0),
              CNG: new Array(locationOption.length).fill(0),
              PNG: new Array(locationOption.length).fill(0),
              LPG: new Array(locationOption.length).fill(0),
              "GRID electricity": new Array(locationOption.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(locationOption.length).fill(0),
              "Electricity consumption through DG": new Array(
                locationOption.length
              ).fill(0),
              "Electricity consumption from Renewable energy (via PPA)":
                new Array(locationOption.length).fill(0),
              "Electricity consumption from Renewable energy (rooftop solar)":
                new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryEnergy.time[location?.unitCode] = {
              Diesel: new Array(transformedKeys.length).fill(0),
              Petrol: new Array(transformedKeys.length).fill(0),
              PNG: new Array(transformedKeys.length).fill(0),
              LPG: new Array(transformedKeys.length).fill(0),
              "GRID electricity": new Array(transformedKeys.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(transformedKeys.length).fill(0),
              "Electricity consumption through DG": new Array(
                transformedKeys.length
              ).fill(0),
              "Electricity consumption from Renewable energy (via PPA)":
                new Array(transformedKeys.length).fill(0),
              "Electricity consumption from Renewable energy (rooftop solar)":
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

        for (const period in summaryEnergy.location) {
          timeKey.push(period);
        }

        for (const period in summaryEnergy.time) {
          locationKey.push(period);
        }

        for (const location in summaryEnergy.time) {
          const data = summaryEnergy.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryEnergy.time[location][key].length; k++) {
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
              summaryEnergy.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryEnergy.location) {
          const data = summaryEnergy.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryEnergy.location[time][key].length; k++) {
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
              summaryEnergy.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefEnergy(summaryEnergy);

      const summaryWaste = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryWaste.location[quarter] = {
              "Total non-hazardous solid waste generation (black category general waste)* (kg)":
                new Array(locationOption.length).fill(0),
              "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (Kg)":
                new Array(locationOption.length).fill(0),
              "Total packaging waste (Plastic) generated* (Kg)": new Array(
                locationOption.length
              ).fill(0),
              "Total plastic packaging waste generated ": new Array(
                locationOption.length
              ).fill(0),
              "Total e-waste generated* (Kg)": new Array(
                locationOption.length
              ).fill(0),
              "Total hazardous waste ( spent oil/lubricants etc)": new Array(
                locationOption.length
              ).fill(0),
              "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)":
                new Array(locationOption.length).fill(0),

              "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)":
                new Array(locationOption.length).fill(0),

              "Total food waste generated/Kitchen Waste* (Kgs)": new Array(
                locationOption.length
              ).fill(0),

              "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs":
                new Array(locationOption.length).fill(0),

              "Total spent formalin solution disposed in Ltrs": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryWaste.time[location?.unitCode] = {
              "Total non-hazardous solid waste generation (black category general waste)* (kg)":
                new Array(transformedKeys.length).fill(0),
              "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (Kg)":
                new Array(transformedKeys.length).fill(0),
              "Total packaging waste (Plastic) generated* (Kg)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total plastic packaging waste generated ": new Array(
                transformedKeys.length
              ).fill(0),
              "Total food waste generated/Kitchen Waste* (Kgs)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total e-waste generated* (Kg)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total hazardous waste ( spent oil/lubricants etc)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)":
                new Array(transformedKeys.length).fill(0),

              "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)":
                new Array(transformedKeys.length).fill(0),

              "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs":
                new Array(transformedKeys.length).fill(0),

              "Total spent formalin solution disposed in Ltrs": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 400 ||
            item?.questionId === 401 ||
            item?.questionId === 402 ||
            item?.questionId === 404 ||
            item?.questionId === 408 ||
            item?.questionId === 412 ||
            item?.questionId === 413 ||
            item?.questionId === 414 ||
            item?.questionId === 545 ||
            item?.questionId === 551 ||
            item?.questionId === 550
        );
        const convertedData = convertMixedData(filteredData);
        const timeKey = [];
        const locationKey = [];

        for (const period in summaryWaste.location) {
          timeKey.push(period);
        }

        for (const period in summaryWaste.time) {
          locationKey.push(period);
        }

        for (const location in summaryWaste.time) {
          const data = summaryWaste.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryWaste.time[location][key].length; k++) {
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
              summaryWaste.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryWaste.location) {
          const data = summaryWaste.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryWaste.location[time][key].length; k++) {
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
              summaryWaste.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefWaste(summaryWaste);

      const summaryWater = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryWater.location[quarter] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                locationOption.length
              ).fill(0),

              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(locationOption.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryWater.time[location?.unitCode] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(transformedKeys.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) =>
            item?.questionId === 391 ||
            item?.questionId === 469 ||
            item?.questionId === 474 ||
            item?.questionId === 394
        );
        const convertedData = convertMixedData(filteredData);
        const timeKey = [];
        const locationKey = [];

        for (const period in summaryWater.location) {
          timeKey.push(period);
        }

        for (const period in summaryWater.time) {
          locationKey.push(period);
        }

        for (const location in summaryWater.time) {
          const data = summaryWater.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryWater.time[location][key].length; k++) {
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
              summaryWater.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryWater.location) {
          const data = summaryWater.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryWater.location[time][key].length; k++) {
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
              summaryWater.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefWater(summaryWater);
    }
  }, [locationOption, graphData, timePeriods, companyFramework, energy]);

  useEffect(() => {
    if (companyFramework && companyFramework.includes(1)) {
      // this below code is for energy
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const nonEnergyRenew =
        graphData?.filter(
          (item) =>
            item.title === "Energy Consumption from Non-renewable Sources"
        ) || [];

      const filteredDataScope2 = nonEnergyRenew.map((obj) => {
        // Filter for column1 type
        const column1Entries = obj.question_details.filter(
          (q) => q.option_type === "column1"
        );

        // Find the last "row" type entry
        const rowEntries = obj.question_details.filter(
          (q) => q.option_type === "row"
        );
        const lastRowEntry =
          rowEntries.length > 0 ? rowEntries[rowEntries.length - 1] : null;

        return {
          ...obj,
          energyAndEmission:
            obj.energyAndEmission.length > 0 ? [obj.energyAndEmission[0]] : [],
          question_details: lastRowEntry
            ? [...column1Entries, lastRowEntry]
            : column1Entries,
        };
      });

      const filteredDataScope1 = nonEnergyRenew.map((obj) => {
        // Remove the first row of energyAndEmission
        const energyAndEmission = obj.energyAndEmission.slice(1);

        // Remove all "column1" entries
        const questionDetailsWithoutColumn1 = obj.question_details.filter(
          (q) => q.option_type !== "column1"
        );

        // Remove the last "row" entry
        const rowEntries = questionDetailsWithoutColumn1.filter(
          (q) => q.option_type === "row"
        );
        const lastRowEntry =
          rowEntries.length > 0 ? rowEntries[rowEntries.length - 1] : null;
        const question_details = lastRowEntry
          ? questionDetailsWithoutColumn1.filter((q) => q !== lastRowEntry)
          : questionDetailsWithoutColumn1;

        return {
          ...obj,
          energyAndEmission,
          question_details,
        };
      });

      // Safeguard against undefined timePeriodsArray
      const newEnergyRenew = filteredDataScope1.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newNonEnergyRenew = filteredDataScope2.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalEnergy = newEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonEnergy = newNonEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setEmissionScope1(finalEnergy);
      setEmissionScope2(finalNonEnergy);
    }
  }, [locationOption, graphData, timePeriods, companyFramework]);

  const lastWeekActivity = () => {
    const activityData = {
      "Total Energy": {
        number: `${
          Number(totalConsumptionRenewable) +
          Number(totalConsumptionNonRenewable)
        } GJ`,
        questionId: [],
      },
      "Total Emission": {
        number: `${Number(totalScope1) + Number(totalScope2)} tCO2`,
        questionId: [],
      },
      "Total Water Consumed": {
        number: `${totalConsumption} KL`,
        questionId: [],
      },
      "Total Waste Generated": {
        number: `${totalSum.toFixed(2)} MT`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  };

  useEffect(() => {
    lastWeekActivity();
  }, [
    totalConsumptionRenewable,
    totalConsumptionNonRenewable,
    totalSum,
    totalScope,
    totalConsumption,
  ]);

  useEffect(() => {
    if (frameworkValue?.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
      getEnergyEmissionComparison();
    }
  }, [frameworkValue]);

  return (
    <div className="progress-container">
      {companyFramework &&
        companyFramework.length > 0 &&
        companyFramework.includes(1) && (
          <>
            {lastWeekActivities && (
              <TopComponentEnvironment
                lastWeekAcitivities={lastWeekActivities}
                icons={icons}
              />
            )}
          </>
        )}

      {keyTab === "combinedAll" ? (
        <AllLocAllTime
          graphData={graphData}
          keyTab={keyTab}
          companyFramework={companyFramework}
          briefEnergy={briefEnergy}
          briefWater={briefWater}
          briefWaste={briefWaste}
          bioMedicalBrief={bioMedicalBrief}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
          totalConsumption={totalConsumption}
          totalConsumptionTwo={totalConsumptionTwo}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          wasteDisposal={wasteRecovered}
          matchedDataWater={matchedDataWater}
          matchedWaterDis={matchedWaterDis}
          matchedDataWaste={matchedDataWaste}
          emissionScope1={emissionScope1}
          emissionScope2={emissionScope2}
        />
      ) : companyFramework &&
        companyFramework.length &&
        companyFramework.includes(1) ? (
        (timePeriodValues &&
          locationOption.length === 1 &&
          timePeriodValues?.length === 1) ||
        (locationOption.length > 1 &&
          timePeriodValues?.length === 1 &&
          keyTab === "combined") ? (
          <>
            <EnvironmentSingleLocSingleTime
              renewableEnergy={renewableEnergy}
              nonRenewableEnergy={nonRenewableEnergy}
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              briefEnergy={briefEnergy}
              briefWater={briefWater}
              briefWaste={briefWaste}
              totalConsumptionRenewable={totalConsumptionRenewable}
              totalConsumptionNonRenewable={totalConsumptionNonRenewable}
              totalConsumption={totalConsumption}
              totalConsumptionTwo={totalConsumptionTwo}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              wasteDisposal={wasteRecovered}
              matchedDataWater={matchedDataWater}
              matchedWaterDis={matchedWaterDis}
              companyFramework={companyFramework}
              matchedDataWaste={matchedDataWaste}
              emissionScope1={emissionScope1}
              emissionScope2={emissionScope2}
            />
          </>
        ) : (locationOption?.length > 1 &&
            timePeriodValues?.length > 1 &&
            keyTab === "combined") ||
          (locationOption?.length > 1 && timePeriodValues?.length === 1) ||
          (locationOption?.length == 1 && timePeriodValues?.length > 1) ? (
          <>
            <EnvironmentSingleLocMultipleTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWater={matchedDataWater}
              wasteDisposal={wasteDisposal}
              briefEnergy={briefEnergy}
              briefWater={briefWater}
              briefWaste={briefWaste}
              renewableEnergy={renewableEnergy}
              nonRenewableEnergy={nonRenewableEnergy}
              matchedWaterDis={matchedWaterDis}
              companyFramework={companyFramework}
              matchedDataWaste={matchedDataWaste}
            />
          </>
        ) : (
          <></>
        )
      ) : (timePeriodValues &&
          locationOption?.length === 1 &&
          timePeriodValues?.length === 1) ||
        (locationOption?.length > 1 &&
          timePeriodValues?.length === 1 &&
          keyTab === "combined") ? (
        <>
          {briefEnergy && briefWaste && briefWater && (
            <EnvironmentSingleLocSingleTime
              graphData={graphData}
              keyTab={keyTab}
              companyFramework={companyFramework}
              briefEnergy={briefEnergy}
              briefWater={briefWater}
              briefWaste={briefWaste}
            />
          )}
        </>
      ) : (locationOption?.length > 1 &&
          timePeriodValues?.length > 1 &&
          keyTab === "combined") ||
        (locationOption?.length > 1 && timePeriodValues?.length === 1) ||
        (locationOption?.length == 1 && timePeriodValues?.length > 1) ? (
        <>
          {graphData && briefEnergy && briefWaste && briefWater && (
            <EnvironmentSingleLocMultipleTime
              graphData={graphData}
              keyTab={keyTab}
              briefEnergy={briefEnergy}
              briefWater={briefWater}
              briefWaste={briefWaste}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              companyFramework={companyFramework}
            />
          )}
        </>
      ) : (
        timePeriodValues &&
        briefEnergy &&
        briefWaste &&
        briefWater && (
          <>
            <div className="d-flex flex-column flex-space-between">
              <div className="d-flex flex-row flex-space-between">
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
                    <EnergyConsumptionFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={briefEnergy}
                      timePeriods={timePeriods}
                      type="ALL"
                    />
                  </div>

                  <div className="my-2">
                    <WaterBarFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={briefWater}
                      timePeriods={timePeriods}
                      type="COMS"
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
                    <EnergyConsumptionFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={briefEnergy}
                      timePeriods={timePeriods}
                      type="ELE"
                    />
                  </div>
                  <div className="my-2" style={{ height: "118px" }}>
                    <WasteConsumptionFourtyEight
                      timePeriodValues={timePeriodValues}
                      brief={briefWaste}
                      timePeriods={timePeriods}
                      type="HAZ"
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
                    <CompareMultipleEne
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      graphData={energy}
                      timePeriods={timePeriods}
                      type="FUEL"
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
                    <CompareMultipleEne
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      graphData={energy}
                      timePeriods={timePeriods}
                      type="REW"
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
                      graphData={graphData}
                      type="COMS"
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
                  <div style={{ height: "100" }} className="my-2 container">
                    <CompareMultiple
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      graphData={graphData}
                      timePeriods={timePeriods}
                      type="TREAT"
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
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      graphData={graphData}
                      timePeriods={timePeriods}
                      type="HAZ"
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
                  <div style={{ height: "100%" }} className="my-2 container">
                    <CompareMultiple
                      timePeriodValues={timePeriodValues}
                      locationOption={locationOption}
                      timePeriods={timePeriods}
                      graphData={graphData}
                      type="NONHAZ"
                    />
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

export default Environment;
