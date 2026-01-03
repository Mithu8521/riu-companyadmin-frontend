import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import TrainingStats from "./components/TrainingStats";
import Training from "./components/Training";
import TraineeDashboard from "./TraineeDashboard";

const TraineeOverview = ({ financialYearId, timePeriods }) => {
  const [financeObjct, setFinanceObjct] = useState();
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem("financialYearData");

    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      const lastEntry = parsedData[parsedData.length - 1];
      setFinanceObjct(lastEntry.id);
      return lastEntry.id;
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );

      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem("financialYearData", JSON.stringify(data.data));

        // Set state and return value
        setFinanceObjct(data.data[data.data.length - 1].id);
        return data.data[data.data.length - 1].id;
      }
    }
  };
  const getAllTrainingDataForGraphForUser = async () => {
    if (financialYearId) {
      setLoading(true);
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getAllTrainingDataForGraphForUser`,
          {},
          { type: "ALL", financialYearId: financialYearId || 1 }
        );

        if (isSuccess && data && Array.isArray(data.data)) {
          setTrainingData(data.data);
          console.log("Training data loaded:", data.data);
        } else {
          console.error("Failed to load training data");
          setTrainingData([]);
        }
      } catch (error) {
        console.error("Error fetching training data:", error);
        setTrainingData([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getFinancialYear();
  }, []);

  useEffect(() => {
    getAllTrainingDataForGraphForUser();
  }, [financialYearId]);

  return (
    <div>
      <TraineeDashboard
        trainingData={trainingData}
        financialYearId={financialYearId}
        currentUserId={JSON.parse(localStorage.getItem("currentUser")).id}
      />
    </div>
  );
};

export default TraineeOverview;
