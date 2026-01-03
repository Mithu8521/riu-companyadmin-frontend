import React from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import due from "../../img/Due.svg";
import updated from "../../img/updated.svg";
import done from "../../img/shape.svg";
import defaulted from "../../img/Defaulted.svg";
import { useState } from "react";
import { useEffect } from "react";
import TopComponentEmission from "./TopComponentEmission";
import LocationWiseEmission from "./LocationWiseEmission";
import GHGEmissions from "./GHGEmissions";
import EmissionAcrossLocation from "./EmissionAcrossLocation";
import ProductWiseEmission from "./ProductWiseEmission";
import ScopeTwo from "./ScopeTwo";
import ComparisonScope from "./ComparisonScope";
import ComparisonAcrossYear from "./ComparisonAcrossYear";
import TotalEmissionGenerated from "./TotalCommissionGranted";
import TotalGHGEmissionPercentage from "./TotalGHGEmission";
import ScopeMultiLocComparison from "./ScopeComMulLoc";
import TotalCarbonEmission from "./TotalCarbonEmission";
import EmissionIntensityOverTime from "./EmissionIIntensityOverTime";
import CarbonEmissionByScope from "./CarbonEmissionByScope";
import LineChartWithOptions from "./LineChartEmission";
import MixedChart from "./MixedChart";
import Speedometer from "./Speedometer";
import DifferentColumnCharts from "../Company Sub Admin/Pages/home/DifferentColumnCharts";
import TotalProductWise from "../Company Sub Admin/Pages/home/TotalProductWise";
import TotalEmissionGeneratedSingle from "./TotalEmissionGenerated";
import ScopeComSingleLoc from "./ScopeComSingleLoc";
import TotalCarbonGeneratedSingle from "./TotalCarbonSingleLoc";
import CarbonEmissionByScopeSingle from "./CarbonEmissionByScopeSingle";
import ProductWiseScopeTwo from "./ProductWiseScopeTwo";
import IntensityOverTime from "./IntensityOverTime";
import ProductWiseEmissionSingle from "./ProductWiseEmissionSingle";
import COTWOReduction from "./COTWOReduction";
import SingleLocMultTime from "./SingleLocMultTime";
import MultipleLocationMultipleTime from "../Energy/MultipleYearMultipleTime";
import MultipleYearMultipleTime from "./MultipleYearMultipleTime";
import AllLocAllTime from "./AllLocAllTime";
import SingleLocSingleTime from "./SingleLocSingleTime";
import EnergyConsumptionFourtyEight from "./Framework48/EnergyConsumptionFourtyEight";
import ProductWiseEnergyConsumption from "./Framework48/ProductWiseEnergyConsumption";
import CompareMultiple from "../DashboardComponents/CompareMultiple";
import CompareMultipleEne from "../DashboardComponents/CompareMultipleEne";

const Emission = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  sectorQuestionAnswerDataForGraph,
  keyTab,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  emissionTriggerData,
}) => {
  const [lastWeekAcitivities, setLastWeekActivities] = useState();
  const [companyFramework, setCompanyFramework] = useState([]);
  const [timePeriodValues, setTimePeriodValues] = useState([]);
  const [totalConsumptionRenewable, setTotalConsumptionRenewable] = useState(0);
  const [totalConsumptionNonRenewable, setTotalConsumptionNonRenewable] =
    useState(0);
  const [renewableEnergy, setRenewableEnergy] = useState();
  const [nonRenewableEnergy, setNonRenewableEnergy] = useState();
  const [emission, setEmission] = useState(null);
  const [lastEmission, setLastEmission] = useState(null);

  const [scope1TiggerValue, setScope1TiggerValue] = useState();
  const [scope2TiggerValue, setScope2TiggerValue] = useState();
  const [brief, setBrief] = useState(true);

  const icons = {
    done: done,
    updated: updated,
    due: due,
    pending: defaulted,
  };
  const getEnergyEmissionComparison = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
          {},
          { financialYearId, key: "EMISSION" },
          "GET"
        );

        if (isSuccess) {
          setEmission(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };

  const getEnergyEmissionLastComparison = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
          {},
          { financialYearId: financialYear[financialYear.length - 2].id, key: "EMISSION" },
          "GET"
        );

        if (isSuccess) {
          setLastEmission(data.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };

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

      setRenewableEnergy(finalEnergy);
      setNonRenewableEnergy(finalNonEnergy);

      if (!Array.isArray(finalEnergy) || finalEnergy.length === 0) {
        // setTotalConsumptionRenewable(0);
        return;
      }
      setTotalConsumptionRenewable(
        parseFloat(
          finalEnergy
            .reduce((totalSum, item) => {
              return (
                totalSum +
                item.energyAndEmission.reduce(
                  (sum, row) => sum + parseFloat(row[1] || 0),
                  0
                )
              );
            }, 0)
            .toFixed(2)
        )
      );

      setTotalConsumptionNonRenewable(
        parseFloat(
          finalNonEnergy
            .reduce((totalSum, item) => {
              return (
                totalSum +
                item.energyAndEmission.reduce(
                  (sum, row) => sum + parseFloat(row[1] || 0),
                  0
                )
              );
            }, 0)
            .toFixed(2)
        )
      );

      const triggerData = emissionTriggerData.filter((item) =>
        timePeriodsArray.includes(item.fromDate)
      );
      const scope1TiggerValue = [];
      const scope2TiggerValue = [];

      triggerData.forEach((item) => {
        const maxData = item.maxTargetData || [];
        const minData = item.minTargetData || [];

        const renewableMaxVal = Number(maxData[0]?.[0]) || 0;
        const nonRenewableMaxVal = Number(maxData[1]?.[0]) || 0;

        const renewableMinVal = Number(minData[0]?.[0]) || 0;
        const nonRenewableMinVal = Number(minData[1]?.[0]) || 0;

        scope1TiggerValue.push({
          fromDate: item.fromDate,
          maxTriggerValue: renewableMaxVal,
          minTriggerValue: renewableMinVal,
        });

        scope2TiggerValue.push({
          fromDate: item.fromDate,
          maxTriggerValue: nonRenewableMaxVal,
          minTriggerValue: nonRenewableMinVal,
        });
      });
      setScope1TiggerValue(scope1TiggerValue);
      setScope2TiggerValue(scope2TiggerValue);
    } else if (companyFramework && companyFramework.includes(48)) {
      getEnergyEmissionComparison();
      getEnergyEmissionLastComparison();
    }
  }, [locationOption, graphData, timePeriods, companyFramework]);



  const [quarters, setQuarters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState({ time: {}, location: {} });
  const [data1, setData1] = useState({ time: {}, location: {} });
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
          fuelType: data.fuelType, // Adding fuelType property
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
    if (
      emission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
      && keyTab !== 'compareToYear'
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
            Diesel: new Array(locationOption.length).fill(0),
            Petrol: new Array(locationOption.length).fill(0),
            CNG: new Array(locationOption.length).fill(0),
            PNG: new Array(locationOption.length).fill(0),
            LPG: new Array(locationOption.length).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            Diesel: new Array(transformedKeys.length).fill(0),
            Petrol: new Array(transformedKeys.length).fill(0),
            CNG: new Array(transformedKeys.length).fill(0),
            PNG: new Array(transformedKeys.length).fill(0),
            LPG: new Array(transformedKeys.length).fill(0),
          };
        });
      });

      const filteredData =
        emission &&
        emission.filter(
          (item) =>
            item?.questionId === 289 ||
            item?.questionId === 293 ||
            item?.questionId === 294 ||
            item?.questionId === 295 ||
            item?.questionId === 292
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
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
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
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission]);

  useEffect(() => {
    if (
      emission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48) &&
      keyTab !== 'compareToYear'

    ) {
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            "GRID electricity": new Array(locationOption.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(locationOption.length).fill(0),
            "Electricity consumption through DG": new Array(
              locationOption.length
            ).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            "GRID electricity": new Array(transformedKeys.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(transformedKeys.length).fill(0),
            "Electricity consumption through DG": new Array(
              transformedKeys.length
            ).fill(0),
          };
        });
      });

      const filteredData = emission.filter(
        (item) => item?.questionId === 468 || item?.questionId === 426
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
            if (obj) {
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
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
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData1({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission]);


  useEffect(() => {
    if (
      emission &&
      lastEmission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
      && keyTab === 'compareToYear'

    ) {

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
      const newGraphData = [...emission, ...lastEmission];

      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);
      const timePeriodsArray = Object.values(newTimePeriods || []);
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
            Diesel: new Array(locationOption.length).fill(0),
            Petrol: new Array(locationOption.length).fill(0),
            CNG: new Array(locationOption.length).fill(0),
            PNG: new Array(locationOption.length).fill(0),
            LPG: new Array(locationOption.length).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            Diesel: new Array(transformedKeys.length).fill(0),
            Petrol: new Array(transformedKeys.length).fill(0),
            CNG: new Array(transformedKeys.length).fill(0),
            PNG: new Array(transformedKeys.length).fill(0),
            LPG: new Array(transformedKeys.length).fill(0),
          };
        });
      });

      const filteredData =
        newGraphData &&
        newGraphData.filter(
          (item) =>
            item?.questionId === 289 ||
            item?.questionId === 293 ||
            item?.questionId === 294 ||
            item?.questionId === 295 ||
            item?.questionId === 292
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
            if (obj) {
              const lowerCaseKey = time;
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
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
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission, lastEmission]);

  useEffect(() => {
    if (
      emission &&
      lastEmission &&
      locationOption &&
      companyFramework &&
      companyFramework.includes(48)
      && keyTab === 'compareToYear'

    ) {
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
      const newGraphData = [...emission, ...lastEmission];

      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];
      const timePeriodsArray = Object.values(newTimePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const transformedKeys = Object.keys(newTimePeriods).map((key) => key);

      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            "GRID electricity": new Array(locationOption.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(locationOption.length).fill(0),
            "Electricity consumption through DG": new Array(
              locationOption.length
            ).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            "GRID electricity": new Array(transformedKeys.length).fill(0),
            "Electricity Power plant (Captive Power Plant - Natural Gas)":
              new Array(transformedKeys.length).fill(0),
            "Electricity consumption through DG": new Array(
              transformedKeys.length
            ).fill(0),
          };
        });
      });

      const filteredData = newGraphData.filter(
        (item) => item?.questionId === 468 || item?.questionId === 426
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
            if (obj) {
              const lowerCaseKey = time;
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
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
              const formDate = newTimePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setData1({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, emission, lastEmission]);


  useEffect(() => {
    const activityData = {
      "Total Emission": {
        number: `${(Number(totalConsumptionRenewable) +
          Number(totalConsumptionNonRenewable)).toFixed(2)
          } tCO2`,
        questionId: [],
      },
      "Scope 1": {
        number: `${Number(totalConsumptionRenewable || 0)} tCO2`,
        questionId: [],
      },
      "Scope 2": {
        number: `${Number(totalConsumptionNonRenewable || 0)} tCO2`,
        questionId: [],
      },
      message: "Good Evening, Sunil Kumar",
    };
    setLastWeekActivities(activityData);
  }, [totalConsumptionRenewable, totalConsumptionNonRenewable]);

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
      {companyFramework &&
        companyFramework.length > 0 &&
        companyFramework.includes(1) && (
          <>
            {lastWeekAcitivities && (
              <TopComponentEmission
                lastWeekAcitivities={lastWeekAcitivities}
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
          emission={emission}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
          brief={brief}
          scope1={data}
          scope2={data1}
          scope1TiggerValue={scope1TiggerValue}
          scope2TiggerValue={scope2TiggerValue}
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
          graphData48={graphData}
          emission={brief}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
          scope1={data}
          scope2={data1}
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
            scope1={data}
            scope2={data1}
            scope1TiggerValue={scope1TiggerValue}
            scope2TiggerValue={scope2TiggerValue}
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
            brief={brief}
            scope1={data}
            scope2={data1}
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
            brief={brief}
            scope1={data}
            scope2={data1}
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
          scope1={data}
          scope2={data1}
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
          emission={brief}
          locationOption={locationOption}
          timePeriods={timePeriods}
          timePeriodValues={timePeriodValues}
          renewableEnergy={renewableEnergy}
          nonRenewableEnergy={nonRenewableEnergy}
          totalConsumptionRenewable={totalConsumptionRenewable}
          totalConsumptionNonRenewable={totalConsumptionNonRenewable}
          companyFramework={companyFramework}
          scope1={data}
          scope2={data1}
        />
      ) : (
        <></>
        // timePeriodValues && (
        //   <div className="d-flex flex-column flex-space-between">
        //     <div
        //       className="d-flex flex-row flex-space-between"
        //     >
        //       <div
        //         className="firsthalfprogressenergy"
        //         style={{
        //           display: "flex",
        //           flexDirection: "column",
        //           justifyContent: "space-between",
        //           width: "50%",
        //           marginTop: "10px",
        //         }}
        //       >
        //         <div className="my-2">
        //           <EnergyConsumptionFourtyEight
        //             timePeriodValues={timePeriodValues}
        //             brief={data}
        //             timePeriods={timePeriods}
        //             type="FUEL"
        //           />
        //         </div>
        //       </div>
        //       <div
        //         className="secondhalfprogress"
        //         style={{
        //           display: "flex",
        //           flexDirection: "column",
        //           justifyContent: "space-between",
        //           width: "50%",
        //           marginTop: "10px",
        //         }}
        //       >
        //         <div className="my-2">
        //           <EnergyConsumptionFourtyEight
        //             timePeriodValues={timePeriodValues}
        //             brief={data1}
        //             timePeriods={timePeriods}
        //             type="ELE"
        //           />
        //         </div>
        //       </div>
        //     </div>

        //     <div className="d-flex flex-row flex-space-between">
        //       <div
        //         className="firsthalfprogressenergy"
        //         style={{
        //           display: "flex",
        //           flexDirection: "column",
        //           justifyContent: "space-between",
        //           width: "100%",
        //           marginTop: "10px",
        //         }}
        //       >
        //         <div style={{ height: "100%" }} className="my-2 container">
        //           <CompareMultipleEne
        //             timePeriods={timePeriods}
        //             graphData={emission}
        //             type="SCOPE1"
        //             locationOption={locationOption}
        //           />
        //         </div>
        //       </div>

        //       <div
        //         className="secondhalfprogress"
        //         style={{
        //           display: "flex",
        //           flexDirection: "column",
        //           justifyContent: "space-between",
        //           width: "100%",
        //           marginTop: "10px",
        //         }}
        //       >
        //         <div style={{ height: "100" }} className="my-2 container">
        //           <CompareMultipleEne
        //             timePeriods={timePeriods}
        //             locationOption={locationOption}
        //             graphData={emission}
        //             type="SCOPE2"
        //           />
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // )
      )}
    </div>
  );
};

export default Emission;
