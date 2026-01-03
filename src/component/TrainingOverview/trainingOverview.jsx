import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import TrainerOverviewDashboard from "./TrainerOverviewDashboard";

const TrainerOverview = ({ financialYearId, timePeriods }) => {
  const [financeObjct, setFinanceObjct] = useState();
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      try {
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
      } catch (error) {
        console.error("Error fetching financial year:", error);
        setError("Failed to fetch financial year data");
      }
    }
  };

  const getAllTrainingDataForGraphForUser = async (yearId) => {
    if (!yearId) return;

    setLoading(true);
    setError(null);

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAllTrainingDataForGraphForTrainer`,
        {},
        { type: "ALL", financialYearId: yearId }
      );

      if (isSuccess && data && Array.isArray(data.data)) {
        setTrainingData(data.data);
        console.log("Training Data Loaded:", data.data);
      } else {
        setError("No training data available");
        setTrainingData([]);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
      setError("Failed to fetch training data");
      setTrainingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const yearId = await getFinancialYear();
      if (yearId) {
        await getAllTrainingDataForGraphForUser(yearId);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (financialYearId) {
      getAllTrainingDataForGraphForUser(financialYearId);
    }
  }, [financialYearId]);

  // Loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TrainerOverviewDashboard
        trainingData={trainingData}
        financialYearId={financialYearId || financeObjct}
      />
    </div>
  );
};

export default TrainerOverview;
