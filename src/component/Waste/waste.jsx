import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import TopComponentWaste from "./TopComponentWaste";
import WasteDisposedMultiLocMultiTime from "./FrameworkFourtyEight/WasteDisposedMultiLocMultiTime.jsx";
import WasteMultiLocMultiTime from "./FrameworkFourtyEight/WasteMultiLocMultiTimeGen.jsx";
import WasteSingleLocMultTime from "./WasteSingleLocMultTime.jsx";
import WasteSingleLocSingleTime from "./WasteSingleLocSingleTime.jsx";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime.jsx";
import AllLocAllTime from "./AllLocAllTime.jsx";
import WasteConsumptionFourtyEight from "./FrameworkFourtyEight/WasteConsumptionFourtyEight.jsx";
import CompareMultiple from "../DashboardComponents/CompareMultiple.jsx";

const Waste = ({
  locationOption,
  timePeriods,
  graphData,
  keyTab,
  frameworkValue,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  lastYearGraphData,
  
}) => {
  const [lastWeekActivities, setLastWeekActivities] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalSumTwo, setTotalSumTwo] = useState(0);
  const [companyFramework, setCompanyFramework] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState([]);

  const [totalSumThree, setTotalSumThree] = useState(0);
  const [brief, setBrief] = useState();
  const [bioMedicalBrief, setBioMedicalBrief] = useState();

  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
  };

  const lastWeekActivity = async () => {
    const activityData = {
      "Total Waste Generated": {
        number: `${totalSum} MT`,
        questionId: [],
      },
      "Total Waste Disposed": {
        number: `${totalSumTwo} MT`,
        questionId: [],
      },
      "Total Waste Recovered": {
        number: `${totalSumThree} MT`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  };

  const [matchedDataWaste, setMatchedDataWaste] = useState([]);
  const [wasteRecovered, setWasteRecovered] = useState([]);
  const [wasteDisposal, setWasteDisposal] = useState([]);
  const [bioMedicalGraphData, setBioMedicalGraphData] = useState([]);

  const wasteSeries = [
    "Plastic",
    "E-Waste",
    "Biomedicals",
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

  const recoverySeries = ["Re-cycled", "Re-used", "Other Recovery Options"];

  function convertMixedData(mixedArray) {
    return mixedArray.map((data) => {
      if (Array.isArray(data.answer) && Array.isArray(data.answer[0])) {
        const flattenedAnswer = data.answer.flat();
        const summedValue =
          parseFloat(flattenedAnswer[flattenedAnswer.length - 1]) || 0;

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

  useEffect(() => {
    const timePeriodsArray = Object.values(timePeriods || []);

    if (companyFramework && companyFramework.includes(1)) {
      const newWaterType =
        graphData?.filter((item) => item.title === "Waste Management") || [];
      const newWasteDischarge =
        graphData?.filter((item) => item.title === "Waste Disposal") || [];
      const newWasteRecovery =
        graphData?.filter((item) => item.title === "Waste Recovery") || [];
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      setWasteRecovered(newWasteRecovery);
      setWasteDisposal(newWasteDischarge);
      setMatchedDataWaste(newWaterType);

      const newMatchedDataWaste = newWaterType.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const newMatchedDataWasteDischarge = newWasteDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const wasteRecovery = newWasteRecovery.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalEnergy = newMatchedDataWaste.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = newMatchedDataWasteDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = wasteRecovery.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setWasteDisposal(finalEnergyTwo);
      setMatchedDataWaste(finalEnergy);
      setWasteRecovered(finalEnergyThree);

      // Calculate total sum for waste management
      const aggregated = wasteSeries.reduce((acc, wasteType) => {
        acc[wasteType] = 0; // Initialize each waste type with 0
        return acc;
      }, {});

      let sum = 0;
      finalEnergy.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (wasteSeries[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregated[wasteSeries[index]] += Number(numericValue);
            sum += Number(numericValue); // Add to total sum
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
    }
    if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(timePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
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
            summary.time[location?.unitCode] = {
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
  }, [graphData, timePeriods, companyFramework, keyTab, locationOption]);

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
      const timePeriodsArray = Object.values(newTimePeriods || []);

      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              Yellow: new Array(locationOption.length).fill(0),
              Red: new Array(locationOption.length).fill(0),
              White: new Array(locationOption.length).fill(0),
              Blue: new Array(locationOption.length).fill(0),
              Cytotoxic: new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              Yellow: new Array(transformedKeys.length).fill(0),
              Red: new Array(transformedKeys.length).fill(0),
              White: new Array(transformedKeys.length).fill(0),
              Blue: new Array(transformedKeys.length).fill(0),
              Cytotoxic: new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = newGraphData.filter(
          (item) => item?.questionId === 409
        );

        

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
              const filterData = filteredData.find(
                (item) => item.formDate === formDate && item.sourceId === obj.id
              );
              let index = 0;
              if (key == "Yellow") index = 0;
              if (key == "Red") index = 1;
              if (key == "White") index = 2;
              if (key == "Blue") index = 3;
              if (key == "Cytotoxic") index = 4;
              summary.time[location][key][k] =
                Number(filterData?.answer?.[0]?.[index]) || 0;
            }
          }
        }
        for (const time in summary.location) {
          const data = summary.location[time];
        
          for (const key in data) {
            for (let k = 0; k < data[key].length; k++) {
              const location = locationKey[k];
              const obj = locationOption.find((item) => item.unitCode === location);
              const lowerCaseKey = time;
              const formDate = newTimePeriods[lowerCaseKey];
        
              if (!obj) continue; // Skip if no matching unitCode found
        
              const filterData = filteredData.find(
                (item) => item.formDate === formDate && item.sourceId === obj.id
              );
        
              let index = 0;
              switch (key) {
                case "Yellow": index = 0; break;
                case "Red": index = 1; break;
                case "White": index = 2; break;
                case "Blue": index = 3; break;
                case "Cytotoxic": index = 4; break;
                default: index = 0;
              }
        
              const readingValue = Number(filterData?.answer?.[0]?.[index]) || 0;
        
              setBioMedicalGraphData(prev => [
                ...prev,
                {
                  questionId: 409,
                  sourceId: obj.id,
                  qIds: 409,
                  title: key,
                  formDate: formDate,
                  toDate: "2025-01",
                  answer: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                  maxTarget: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                  minTarget: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                }
              ]);
              console.log()
        
              summary.location[time][key][k] = readingValue;
            }
          }
        }
        
      }
      setBioMedicalBrief(summary);
      console.log(summary,"summarysummarysummarysummarysummary")
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);


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
      const timePeriodsArray = Object.values(newTimePeriods || []);

      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
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
            summary.time[location?.unitCode] = {
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

      if (newGraphData) {
        const filteredData = newGraphData.filter(
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
              const formDate = newTimePeriods[lowerCaseKey];
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

    }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);
  

  useEffect(() => {
    if (companyFramework && companyFramework.includes(48) && keyTab !== 'compareToYear') {
      const timePeriodsArray = Object.values(timePeriods || []);

      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(timePeriods).map((key) => key);
      const summary = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summary.location[quarter] = {
              Yellow: new Array(locationOption.length).fill(0),
              Red: new Array(locationOption.length).fill(0),
              White: new Array(locationOption.length).fill(0),
              Blue: new Array(locationOption.length).fill(0),
              Cytotoxic: new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              Yellow: new Array(transformedKeys.length).fill(0),
              Red: new Array(transformedKeys.length).fill(0),
              White: new Array(transformedKeys.length).fill(0),
              Blue: new Array(transformedKeys.length).fill(0),
              Cytotoxic: new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (graphData) {
        const filteredData = graphData.filter(
          (item) => item?.questionId === 409
        );

        setBioMedicalBrief(filteredData);

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
              const filterData = filteredData.find(
                (item) => item.formDate === formDate && item.sourceId === obj.id
              );
              let index = 0;
              if (key == "Yellow") index = 0;
              if (key == "Red") index = 1;
              if (key == "White") index = 2;
              if (key == "Blue") index = 3;
              if (key == "Cytotoxic") index = 4;
              summary.time[location][key][k] =
                Number(filterData?.answer?.[0]?.[index]) || 0;
            }
          }
        }
        for (const time in summary.location) {
          const data = summary.location[time];
        
          for (const key in data) {
            for (let k = 0; k < data[key].length; k++) {
              const location = locationKey[k];
              const obj = locationOption.find((item) => item.unitCode === location);
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
        
              if (!obj) continue; // Skip if no matching unitCode found
        
              const filterData = filteredData.find(
                (item) => item.formDate === formDate && item.sourceId === obj.id
              );
        
              let index = 0;
              switch (key) {
                case "Yellow": index = 0; break;
                case "Red": index = 1; break;
                case "White": index = 2; break;
                case "Blue": index = 3; break;
                case "Cytotoxic": index = 4; break;
                default: index = 0;
              }
        
              const readingValue = Number(filterData?.answer?.[0]?.[index]) || 0;
        
              setBioMedicalGraphData(prev => [
                ...prev,
                {
                  questionId: 409,
                  sourceId: obj.id,
                  qIds: 409,
                  title: key,
                  formDate: formDate,
                  toDate: "2025-01",
                  answer: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                  maxTarget: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                  minTarget: {
                    questionId: 409,
                    questionType: "quantitative_trends",
                    questionTitle: key,
                    fromDate: formDate,
                    toDate: "2023-01",
                    frequency: "CUSTOM",
                    readingValue,
                    unit: "KG",
                  },
                }
              ]);
              
        
              summary.location[time][key][k] = readingValue;
            }
          }
        }
        
      }
    }
  }, [graphData, lastYearGraphData, compareLastTimePeriods, compareTCurrentimePeriods, companyFramework, locationOption]);


  useEffect(() => {
    lastWeekActivity();
  }, [totalSum, totalSumTwo, totalSumThree]);

  useEffect(() => {
    if (Array.isArray(frameworkValue) && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  return (
    <div className="progress-container">
      {companyFramework &&
        companyFramework.length &&
        companyFramework.includes(1) && (
          <>
            {companyFramework &&
              companyFramework.length &&
              companyFramework.includes(1) &&
              lastWeekActivities && (
                <TopComponentWaste
                  lastWeekActivities={lastWeekActivities}
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
          brief={brief}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          matchedDataWaste={matchedDataWaste}
          wasteDisposal={wasteDisposal}
          wasteRecovered={wasteRecovered}
          bioMedicalBrief={bioMedicalBrief}
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
          brief={brief}
          bioMedicalBrief={bioMedicalBrief}
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
            <WasteSingleLocSingleTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              brief={brief}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWaste={matchedDataWaste}
              wasteDisposal={wasteDisposal}
              wasteRecovered={wasteRecovered}
              bioMedicalBrief={bioMedicalBrief}
              companyFramework={companyFramework}
            />
          </>
        ) : (locationOption.length > 1 &&
            timePeriodValues.length > 1 &&
            keyTab === "combined") ||
          (locationOption.length > 1 && timePeriodValues.length === 1) ||
          (locationOption.length == 1 && timePeriodValues.length > 1) ? (
          <>
            <WasteSingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              matchedDataWaste={matchedDataWaste}
              brief={brief}
              wasteDisposal={wasteDisposal}
              wasteRecovered={wasteRecovered}
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
          <WasteSingleLocSingleTime
            graphData={graphData}
            keyTab={keyTab}
            companyFramework={companyFramework}
            brief={brief}
            locationOption={locationOption}
            timePeriods={timePeriods}
            timePeriodValues={timePeriodValues}
            matchedDataWaste={matchedDataWaste}
            wasteDisposal={wasteDisposal}
            wasteRecovered={wasteRecovered}
            bioMedicalBrief={bioMedicalBrief}
          />
        </>
      ) : (locationOption.length > 1 &&
          timePeriodValues.length > 1 &&
          keyTab === "combined") ||
        (locationOption.length > 1 && timePeriodValues.length === 1) ||
        (locationOption.length == 1 && timePeriodValues.length > 1) ? (
        <>
          {brief && (
            <WasteSingleLocMultTime
              graphData={graphData}
              keyTab={keyTab}
              brief={brief}
              locationOption={locationOption}
              timePeriods={timePeriods}
              timePeriodValues={timePeriodValues}
              companyFramework={companyFramework}
              bioMedicalBrief={bioMedicalBrief}
            />
          )}
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
                  width: "50%",
                  marginTop: "10px",
                }}
              >
                <div className="my-2">
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="HAZ"
                  />
                </div>

                <div className="my-2">
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={bioMedicalBrief}
                    timePeriods={timePeriods}
                    type="BIO"
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
                  <WasteConsumptionFourtyEight
                    timePeriodValues={timePeriodValues}
                    brief={brief}
                    timePeriods={timePeriods}
                    type="NONHAZ"
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
           { bioMedicalGraphData && bioMedicalGraphData.length && <div className="d-flex flex-row flex-space-between">
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
                    graphData={bioMedicalGraphData}
                    timePeriods={timePeriods}
                    type="BIO"
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
                <div style={{ height: "100%" }} className="my-2">
                 
                </div>
              </div>
            </div>}
          </div>
        )
      )}
    </div>
  );
};

export default Waste;
