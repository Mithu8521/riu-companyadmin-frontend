import { apiCall } from "../../../../_services/apiCall";
import { getFrequency } from "../../../CarbonFootPrinting/utils/PeriodCalculationUtils";
import config from "../../../../config/config.json";
import { getStartingMonth } from "../../../../utils/PeriodCalculationUtils";

// Get Financial Year data
export const getFinancialYear = async () => {
  try {
    // Check if data exists in local storage
    const storedData = localStorage.getItem("financialYearData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const lastEntry = parsedData[parsedData.length - 1];
      return {
        data: parsedData,
        currentId: lastEntry.id
      };
    } else {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );

      if (isSuccess) {
        localStorage.setItem("financialYearData", JSON.stringify(data.data));
        return {
          data: data.data,
          currentId: data.data[data.data.length - 1].id
        };
      }
    }
  } catch (error) {
    console.error("Error fetching financial year:", error);
    throw new Error("Failed to fetch financial year data");
  }
};

// Get all training data
export const getTrainingData = async (financialYearId, financialYear, status = 1) => {
  if (!financialYearId) return [];
    const financialYearDatas = await getFinancialYearRange(financialYearId, financialYear);
    console.log(financialYearId, financialYear, financialYearDatas);
    if(financialYearDatas){
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}graph/Training`,
          {},
          {financialYearId, status ,financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate},
          "GET"
        );

        if (isSuccess && data?.data) {
          const tmpData = data.data.length ? data.data.reverse() : [];

          // Format training data
          const formattedTrainingData = tmpData.map((item) => ({
            item,
            id: item.id,
            fromDate: new Date(item.fromDate).toLocaleDateString(),
            toDate: new Date(item.toDate).toLocaleDateString(),
            fromTime: item.fromTime,
            financialYearId: item.financialYearId,
            toTime: item.toTime,
            trainer: item?.trainers,
            title: item.trainingTitle,
            mode: item.modeOfTraining,
            mappingUser: item.userId,
            description: item.description,
            trainingFacilitator: item.trainingFacilitator,
            status: item.status || "Active",
            totalParticipants: item.totalParticipants || 0,
            completedParticipants: item.completedParticipants || 0,
            rawFromDate: item.fromDate,
            rawToDate: item.toDate,
            categories: item.categories,
            acceptedUsers: item.acceptedUsers,
            attendantUsers: item.attendantUsers,
            counts: item.counts,
            trainers: item.trainers,
            locationId: item.locationId,
            principles: item.principles,
            allPrinciples: item.allPrinciples
          }));

          return formattedTrainingData;
        }
        return [];
      } catch (error) {
        console.error("Error fetching training data:", error);
        throw new Error("Failed to fetch training data");
      }
   }
   

};

const getFinancialYearRange = (fId, financialYearList) => {
  const yearId = fId ;
  const startMonthIdx = getStartingMonth() - 1;

  // Find matching year object
  const finYearObj = Array.isArray(financialYearList)
    ? financialYearList.find((fy) => fy.id == yearId)
    : null;

  if (!finYearObj?.financial_year_value) {
    console.warn("⚠️ Financial year not found for id:", yearId);
    return; // stop here, don’t set NaN dates
  }

  const [startY, endY] = finYearObj.financial_year_value.split("-").map(Number);

  if (isNaN(startY) || isNaN(endY)) {
    console.error("⚠️ Invalid financial year value:", finYearObj.financial_year_value);
    return;
  }

  // startMonthIdx is 0-based (0 = Jan, 11 = Dec)
  const startMonth = startMonthIdx;
  const endMonth = (startMonth + 11) % 12;

  const fromDate = new Date(startY, startMonth, 1);
  const toDate = new Date(endY, endMonth + 1, 0);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return {
    startDate: formatDate(fromDate),
    endDate: formatDate(toDate),
  };
};

export const getAllRegisteredTrainee = async (yearId,financialYear) => {
   const financialYearDatas = await getFinancialYearRange(yearId, financialYear)
  try {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAllRegisteredTrainee`,
      {},
      { companyName: 'Kennametal India Limited (KIL)' ,financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate},
      "GET"
    );

    if (isSuccess) {
      return data?.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching trainees:", error);
    throw new Error("Failed to fetch trainee data");
  }
};

// Get training categories
export const getTrainingCategories = async () => {
  try {
    const apiUrl = `${config.POSTLOGIN_API_URL_COMPANY}getTrainingCategory`;
    const { isSuccess, data } = await apiCall(apiUrl, {}, {}, "GET");

    if (isSuccess && data?.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching training categories:", error);
    throw new Error("Failed to fetch training categories");
  }
};

export const getTrainingPrinciples = async () => {
  try {
    const apiUrl = `${config.POSTLOGIN_API_URL_COMPANY}getTrainingPrinciples`;
    const { isSuccess, data } = await apiCall(apiUrl, {}, {}, "GET");

    if (isSuccess && data?.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching training categories:", error);
    throw new Error("Failed to fetch training categories");
  }
};

// Get frequency data
export const fetchFrequency = async (financialYearId) => {
  try {
    const frequencyData = await getFrequency(financialYearId);
    return frequencyData;
  } catch (error) {
    console.error("Error fetching frequency:", error);
    throw new Error("Failed to fetch frequency data");
  }
};

export const getEnvironmentData = async (financialYearId) => {
  if (!financialYearId) return [];

  try {
    // fetch all in parallel
    const [trainingRes, energyRes, emissionRes] = await Promise.all([
      apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTotalTrainingData`,
        {},
        { financialYearId },
        "GET"
      ),
      apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
        {},
        { financialYearId, key: "ENERGY" },
        "GET"
      ),
      apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
        {},
        { financialYearId, key: "EMISSION" },
        "GET"
      )
    ]);

    // process training data
    let trainingData = [];
    if (trainingRes.isSuccess) {
      trainingData = trainingRes.data?.data
        ?.map((item) => {
          if (!item) return null;

          if (item.questionId === 301 || item.questionId === 310) {
            return {
              ...item,
              answer: item?.answer?.map((answerItem) => {
                const value = answerItem?.[0];
                const unit = answerItem?.[1];

                if (!isNaN(value) && value !== "No") {
                  return [parseFloat(value) / 1000, unit];
                } else {
                  return answerItem;
                }
              }) ?? [],
            };
          }
          return item;
        })
        .filter(Boolean);
    }

    // merge all into one array
    const mergedArray = [
      ...(trainingData || []),
      ...(energyRes.isSuccess ? energyRes.data?.data || [] : []),
      ...(emissionRes.isSuccess ? emissionRes.data?.data || [] : []),
    ];

    return mergedArray;
  } catch (error) {
    console.error("Error fetching environment data:", error);
    return [];
  }
};


// Get locations/sources
export const getSource = async () => {
  try {
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (response.isSuccess) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw new Error("Failed to fetch location data");
  }
};

export const getSummaryData = async (selectedPeriodsValue, financialYearId, selectedFrameworks, selectedLocations, selectedModules) => {
  try {
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}dashbord/progress/summary`,
      {},
      { periodsData: selectedPeriodsValue, financialYearId, frameworkIds: selectedFrameworks, locationIds: selectedLocations, moduleIds: selectedModules },
      "GET"
    );
    if (response.isSuccess) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching Summary:", error);
    throw new Error("Failed to fetch Summary data");
  }
};

export const fetchFramework = async () => {
  try {
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL", userId: JSON.parse(localStorage.getItem("user_temp_id")) },
      "GET"
    );
    if (response.isSuccess) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    throw new Error("Failed to fetch Framework data");
  }
};

export const getReportingModules = async (fid) => {
  try {

    const frameworkIds = await fetchFramework();
    const ids = (frameworkIds || []).map(item => item.id);
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}dashbord/reportingModule`,
      {},
      {
        financialYearId: fid,
        frameworkIds: ids,
      },
      "GET"
    );
    if (response.isSuccess) {
      return response.data.data;

    }
  }
  catch (error) {
    console.error("Error fetching reporting questions:", error);
  }
};

export const getReportingQuestions = async (fid) => {
  try {
    const frameworkIds = await fetchFramework();
    const ids = (frameworkIds || []).map(item => item.id);
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
      {},
      {
        financialYearId: fid,
        frameworkIds: ids,
      },
      "GET"
    );
    if (response.isSuccess) {
      return response.data;

    }
  }
  catch (error) {
    console.error("Error fetching reporting questions:", error);
  }
};

export const getReportingAnswer = async (fid) => {
  try {
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestionAnswerBasedFinancialYear`,
      {},
      {
        financialYearId: fid,
      },
      "GET"
    );
    if (response.isSuccess) {
      return response.data.answers;

    }
  }
  catch (error) {
    console.error("Error fetching reporting questions:", error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}dashbord/allUsers`,
      {},
      {},
      "GET"
    );
    if (response.isSuccess) {
      return response.data.data;

    }
  }
  catch (error) {
    console.error("Error fetching reporting questions:", error);
  }
};

