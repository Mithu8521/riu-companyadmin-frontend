import React, { useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import TopicDetailComponent from "./components/TopicDetail";
import axios from "axios";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import TopComponentIndex from "./components/TopComponentIndex";
import '../../../../component/ProgressBySector/sectorprogress.css'
import { generateTimePeriodOptions, getFrequency, getStartingMonth } from "../../../../utils/PeriodCalculationUtils";

const Index = (props) => {
  const [entity, setEntity] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIndicatorType, setSelectedIndicatorType] = useState("Essential Indicators");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [answers, setAnswers] = useState([]);
  const [assignedDetails, setAssignedDetails] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(0);
  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [identifier, setIdentifier] = useState();
  const start = getStartingMonth();
  useEffect(() => {
    if (identifier) {
      const options = generateTimePeriodOptions(identifier, start);
      setTimePeriodOptions(options);
    }
  }, [identifier, start]);


  const fetchFrequency = async (financialYearId) => {
    try {
      const frequencyData = await getFrequency(financialYearId);
      if (frequencyData) {
        setIdentifier(frequencyData);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  };
  useEffect(() => {
    if (entity[0]) {
      getFinancialYear();
    }
  }, [entity[0]]);

  useEffect(() => {
    getFinancialYear();
  }, []);

  useEffect(() => {
    if (financialYearId && entity) fetchStoredData();
  }, [financialYearId, entity]);

  const getFinancialYear = async () => {
    setIsLoading(true); // Start loading
    const storedData = localStorage.getItem('financialYearData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.length) {
        setFinancialYearId(parsedData[parsedData.length - 1].id);
        fetchFrequency(parsedData[parsedData.length - 1].id);

        setFinancialYearOptions(parsedData.map(fy => ({ value: String(fy.id), label: fy.financial_year_value })));

        if (financialYearId && entity) {
          fetchStoredData();
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } else {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );

      if (isSuccess) {
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        if (data?.data?.length) {
          setFinancialYearOptions(data.data.map(fy => ({ value: String(fy.id), label: fy.financial_year_value })));

          setFinancialYearId(data.data[data.data.length - 1].id);
          fetchFrequency(data.data[data.data.length - 1].id);

          if (financialYearId && entity) {
            fetchStoredData();
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  const fetchStoredData = async () => {
    if (financialYearId) {
      setIsLoading(true);
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getESGReport`,
        {},
        {
          type: "SQ",
          financial_year_id: financialYearId ? financialYearId : 6,
        },
        "GET"
      );
      if (isSuccess) {
        const responseData = data?.data;
        if (data?.mainCompany && responseData.length === 0) {
          setIsLoading(false);
        } else {
          if (!responseData?.mainCompany) {
            getSectorQuestion([], [], []);
          }
          const storeData = responseData[0]?.frameworkTopicKpi || "{}";
          if (!storeData.frameworkId || storeData.frameworkId.length === 0) {
            setIsLoading(false);
          } else {
            if (responseData.length === 0 && responseData?.mainCompany) {
              setIsLoading(false);
            } else {
              getSectorQuestion(
                storeData.frameworkId,
                storeData.mandatoryTopicsId
                  .concat(storeData.voluntaryTopicsId)
                  .concat(storeData.customTopicsId),
                storeData.mandatoryKpiId
                  .concat(storeData.voluntaryKpiId)
                  .concat(storeData.customKpiId)
              );
            }
          }
        }
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

    const [companyId, setCompanyId] = useState();
    useEffect(() => {
      const currentUser = localStorage.getItem("tmpcurrentUser");
      if (currentUser) {
        setCompanyId(String(JSON.parse(currentUser).data.user.dataValues.company_id));
      }

    }, []);

  const getDocuments = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents`,
        {},
        {
          financialYearId
        },
        "GET"
      );
      if (isSuccess && data?.documents) {
        setDocuments(data.documents.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {}));
      } else {
        console.error("Failed to fetch documents:", data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const getSectorQuestion = (
    frameworkIds,
    topicIds,
    kpiIds,
    selectedDesignationId,
    selectedUserId,
    selectedLocationId,
    fromDate,
    toDate,
  ) => {
    setIsLoading(true);
    axios
      .get(
        `${config.POSTLOGIN_API_URL_COMPANY
        }getSectorQuestion?type=CUSTOM&financialYearId=${financialYearId ? financialYearId : 6
        }&questionnaireType=SQ&frameworkIds=[${frameworkIds}]&topicIds=[${topicIds}]&kpiIds=[${kpiIds}]
        & roleIds=[${selectedDesignationId}]&userIds=[${selectedUserId}]&locationIds=[${selectedLocationId}]&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            userId: JSON.parse(localStorage.getItem("currentUser")).id,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const groupedTopicsData = response.data.data.reduce((acc, obj) => {
            const { report_id, topic_name, ...rest } = obj;
            if (!acc[topic_name]) {
              acc[topic_name] = [];
            }
            acc[topic_name].push({ report_id, topic_name, ...rest });
            return acc;
          }, {});
          setGroupedTopicsData(groupedTopicsData);
          setAnswers(response.data.answers);
          setAssignedDetails(response?.data?.assignedDetails);
        } else {
          setAnswers([]);
          setAssignedDetails([]);
        }
        setIsLoading(false); // Stop loading after data is processed
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Stop loading on error
      });
  };

  const [groupedTopicsData, setGroupedTopicsData] = useState(null);

  useEffect(() => {
    if (financialYearId) {
      fetchStoredData();
      getDocuments(financialYearId)
    }
  }, [financialYearId]);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Filter data based on selected indicator type
  const getFilteredTopicData = () => {
    if (!groupedTopicsData) return null;

    const activeTopicKey = Object.keys(groupedTopicsData)[activeTab];
    const activeTopicData = groupedTopicsData[activeTopicKey];

    if (!activeTopicData) return null;

    // Filter the data based on heading
    const filteredData = activeTopicData.filter(item => {
      if (selectedIndicatorType === "Leadership Indicators") {
        return item.heading === "Leadership Indicators";
      } else {
        return item.heading !== "Leadership Indicators"; // Essential Indicators
      }
    });

    return filteredData;
  };

  const renderUI = () => {
    const filteredData = getFilteredTopicData();
    const activeTopicKey = Object.keys(groupedTopicsData)[activeTab];
    return (
      <TopicDetailComponent
        topicData={filteredData}
        answers={answers}
        assignedDetails={assignedDetails}
        documents={documents}
        groupedTopicsData={groupedTopicsData}
        activeTabName={activeTopicKey}
        selectedIndicatorType={selectedIndicatorType}
        financialYearOptions={financialYearOptions}
        timePeriodOptions={timePeriodOptions}
      />
    );
  };

  // Loading Component
  const renderLoader = () => {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        width: "100%"
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid #f3f4f6",
          borderTop: "4px solid #3f88a5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px"
        }}></div>
        <h3 style={{
          color: "#3f88a5",
          fontSize: "18px",
          fontWeight: "600",
          fontFamily: "'Montserrat', sans-serif",
          margin: "0 0 8px 0"
        }}>
          Loading Data...
        </h3>
        <p style={{
          color: "#6b7280",
          fontSize: "14px",
          fontFamily: "'Montserrat', sans-serif",
          margin: 0
        }}>
          Please wait while we fetch your questionnaire data
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };
  const renderIndicatorTypeSelector = () => {
    return (
      <div style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0px"
      }}>
        <div style={{
          display: "flex",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          padding: "4px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
        }}>
          <button
            onClick={() => setSelectedIndicatorType("Essential Indicators")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "'Montserrat', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedIndicatorType === "Essential Indicators"
                ? "#3f88a5"
                : "transparent",
              color: selectedIndicatorType === "Essential Indicators"
                ? "white"
                : "#64748b",
              boxShadow: selectedIndicatorType === "Essential Indicators"
                ? "0 2px 4px rgba(63, 136, 165, 0.25)"
                : "none"
            }}
            onMouseEnter={(e) => {
              if (selectedIndicatorType !== "Essential Indicators") {
                e.target.style.backgroundColor = "#f1f5f9";
                e.target.style.color = "#475569";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedIndicatorType !== "Essential Indicators") {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#64748b";
              }
            }}
          >
            📊 Essential Indicators
          </button>

         {companyId !== '362' && <button
            onClick={() => setSelectedIndicatorType("Leadership Indicators")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "'Montserrat', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedIndicatorType === "Leadership Indicators"
                ? "#3f88a5"
                : "transparent",
              color: selectedIndicatorType === "Leadership Indicators"
                ? "white"
                : "#64748b",
              boxShadow: selectedIndicatorType === "Leadership Indicators"
                ? "0 2px 4px rgba(63, 136, 165, 0.25)"
                : "none"
            }}
            onMouseEnter={(e) => {
              if (selectedIndicatorType !== "Leadership Indicators") {
                e.target.style.backgroundColor = "#f1f5f9";
                e.target.style.color = "#475569";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedIndicatorType !== "Leadership Indicators") {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#64748b";
              }
            }}
          >
            🎯 Leadership Indicators
          </button>}
        </div>
      </div>
    );
  };
  

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div style={{ flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999, transition: "flex 0.3s ease" }}>
        <Sidebar dataFromParent={props.location.pathname} />
      </div>
      <div style={{
        flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
        transition: "flex 0.3s ease"
      }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper p-3" style={{ width: sidebarExpanded ? "79vw" : "calc(100% - 60px)" }}>
          {isLoading ? (
            renderLoader()
          ) : (
            <>
              <div className="white-container p-3 scroll-container" style={{ background: "transparent", width: "100%", display: "flex", alignItems: "flex-start", flexDirection: "column", borderRadius: "10px" }}>
                <TopComponentIndex groupedTopicsData={groupedTopicsData} setActiveTab={setActiveTab} />
                {groupedTopicsData && renderIndicatorTypeSelector()}
              </div>
              <div style={{ width: sidebarExpanded ? "79vw" : "calc(100% - 60px)" }} className="p-3">
                {groupedTopicsData && renderUI()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;