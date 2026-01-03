import React, { useState, useEffect, useRef } from "react";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import ParentExcel from "./parentexcel";
import { AttachMoney } from "@material-ui/icons";

const Analytics = () => {
  const [answers, setAnswers] = useState([]);
  const [questionsById, setQuestionsById] = useState([]);
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [fetchingAnswers, setFetchingAnswers] = useState(false);
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(null);
  const [dotCount, setDotCount] = useState(1);
  const isMounted = useRef(true);

  // Animated dots effect
  useEffect(() => {
    if (loadingQuestions || fetchingAnswers) {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loadingQuestions, fetchingAnswers]);

  useEffect(() => {
    // Load financial years on component mount
    loadFinancialYears();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch data when financial year changes
  useEffect(() => {
    if (financialYearId) {
      fetchData(financialYearId);
    }
  }, [financialYearId]);

  const loadFinancialYears = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearData');
      
      if (storedData && isMounted.current) {
        // Data exists in local storage, parse and use it
        const parsedData = JSON.parse(storedData);
        setFinancialYear(parsedData);
        // Set the latest financial year as default
        const latestYear = parsedData[parsedData.length - 1];
        if (latestYear) {
          setFinancialYearId(latestYear.id);
        }
      } else {
        // Data not in local storage, call API
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        
        if (isSuccess && isMounted.current) {
          // Store the response in local storage for future use
          localStorage.setItem('financialYearData', JSON.stringify(data.data));
          setFinancialYear(data.data);
          
          // Set the latest financial year as default
          const latestYear = data.data[data.data.length - 1];
          if (latestYear) {
            setFinancialYearId(latestYear.id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading financial years:", error);
    }
  };

  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL" }
    );

    if (isSuccess && isMounted.current) {
      const frameworkIds = data?.data.map((item) => item.id);
      return frameworkIds;
    }
    return [];
  };

  const fetchData = async (currentFinancialYearId) => {
    if (!currentFinancialYearId) return;
    
    try {
      setLoadingQuestions(true);
      setAnswers([]); // Clear previous answers
      
      // Step 1: Fetch framework IDs
      const frameworkIds = await fetchFrameworkApi();
  
      // Step 2: Fetch questions
      const questionResponse = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
        {},
        { financialYearId: currentFinancialYearId, frameworkIds },
        "GET"
      );
  
      // Check if the response data is an array or an object
      let tmpData = questionResponse.data;

      if (tmpData != null) {
        // If data is an object, convert to an array
        const questionsArray = Object.values(tmpData.data || {});
        questionsArray.sort((a, b) => {
          if (a.serialNumber == null) return 1;
          if (b.serialNumber == null) return -1;
          return a.serialNumber - b.serialNumber;
        });

        setQuestionsById(questionsArray.reduce((acc, item) => {
          acc[item.questionId] = item;
          return acc;
        }, {}));
        setSortedQuestions(questionsArray);
        setLoadingQuestions(false);

  
        if (questionsArray.length === 0) {
          throw new Error("No questions found");
        }
  
        // Step 3: Fetch all answers in one API call
        setFetchingAnswers(true);
        
        const answerResponse = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestionAnswerBasedFinancialYear`,
          {},
          { financialYearId: currentFinancialYearId },
          "GET"
        );

        if (answerResponse.isSuccess) {
          setAnswers(answerResponse.data?.answers || []);
        }
  
        setFetchingAnswers(false);
      } else {
        console.error("Unexpected data format:", tmpData);
        throw new Error("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingQuestions(false);
      setFetchingAnswers(false);
    }
  };

  const handleFinancialYearChange = async (newFinancialYearId) => {
    setFinancialYearId(newFinancialYearId);
    // Data will be fetched automatically by the useEffect
  };

  const renderLoader = () => {
    const dots = '.'.repeat(dotCount);
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999
      }}>
        <div
          style={{
            width: "4rem",
            height: "4rem",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "24px"
          }}
        ></div>
        <div style={{
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: '600',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          Loading{dots}
        </div>
      </div>
    );
  };

  if (loadingQuestions || fetchingAnswers) {
    return (
      <>
        {renderLoader()}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ParentExcel 
        allAnswers={answers} 
        allQuestionsById={questionsById}
        sortedQuestions={sortedQuestions}
        financialYear={financialYear}
        financialYearId={financialYearId}
        onFinancialYearChange={handleFinancialYearChange}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Analytics;