import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import TwoButtonComponent from "./components/twobuttoncomponent";
import AccordionComponent from "./components/accordioncomponent";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";

const OperationalModule = (props) => {
  const { moduleName } = useParams();
  const location = useLocation();
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [dueDateOverrides, setDueDateOverrides] = useState([]);
  const [periodLockData, setPeriodLockData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const [moduleData, setModuleData] = useState(() => {
    const storedData = localStorage.getItem("moduleData");
    return storedData && storedData !== "undefined"
      ? JSON.parse(storedData)
      : null;
  });

  const [sourceData, setSourceData] = useState(() => {
    const storedData = localStorage.getItem("sourceData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [apiData, setApiData] = useState();
  const [allModuleData, setAllModuleData] = useState([]);
  const [filteredModuleData, setFilteredModuleData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [financeObjct, setFinanceObjct] = useState();
  const [startingMonth, setStartingMonth] = useState("");
  const [managementListValue, setManagementListValue] = useState([]);
  const [wholeAssignData, setWholeAssignData] = useState(null);
  const [assignedTo, setAssignedTo] = useState();
  const [correctModuleId, setCorrectModuleId] = useState();
  const [selectedFinancialYearId, setSelectedFinancialYearId] = useState(null);
  const [selectedFinancialYearValue, setSelectedFinancialYearValue] = useState(null);
  const [units, setUnits] = useState([]);
  const [reportingQuestionsMap, setReportingQuestionsMap] = useState(null);
  const [groupedByModuleName, setGroupedByModuleName] = useState(null);

  const [moduleId, setModuleId] = useState(() => {
    const storedData = localStorage.getItem("moduleId");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  const userId = JSON.parse(localStorage.getItem("user_temp_id"));

  useEffect(() => {
    setStartingMonth(
      JSON.parse(localStorage.getItem("currentUser")).starting_month
    );
    setCurrentUserId(JSON.parse(localStorage.getItem("currentUser")).id);
    getFinancialYear();
  }, []);

  // Intersection Observer for infinite scroll
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Function to load more data when scrolling
  const loadMoreData = () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    // Calculate next batch of data
    const nextPage = currentPage + 1;
    const startIndex = (currentPage - 1) * batchSize;
    const endIndex = startIndex + batchSize;

    if (allModuleData && allModuleData.length > startIndex) {
      // Add timeout to prevent UI freezing
      setTimeout(() => {
        const newBatch = allModuleData.slice(0, endIndex);
        setFilteredModuleData(newBatch);
        setCurrentPage(nextPage);
        setIsLoading(false);
      }, 200);
    } else {
      setHasMore(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setActiveIndex(null);

    if (!searchTerm) {
      handleFilteredData(moduleData);
      return;
    }

    const filtered = allModuleData.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    handleFilteredData(filtered);
  }, [searchTerm]);

  const handleAssignedDetails = async () => {
    if (selectedFinancialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getAssignedDetails`,
          {},
          { financialYearId: selectedFinancialYearId },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          setAssignedTo(data.assignedDetails);
          localStorage.setItem(
            "assignedTo",
            JSON.stringify(data.assignedDetails)
          );
        }
      } catch (error) {
        console.error("Error fetching assigned details:", error);
      } finally {
      }
    }
  };

  const fetchFrameworkApi = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
        {},
        { type: "ALL" }
      );
      if (isSuccess && isMounted.current) {
        return data?.data.map((item) => item.id);
      }
    } catch (error) {
      console.error("Error fetching framework:", error);
      return [];
    }
  };

  const getFinancialYear = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem("financialYearData");

      if (storedData && isMounted.current) {
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

        if (isSuccess && isMounted.current) {
          // Store the response in local storage for future use
          localStorage.setItem("financialYearData", JSON.stringify(data.data));

          const lastEntry = data.data[data.data.length - 1];
          setFinanceObjct(lastEntry.id);
          return lastEntry.id;
        }
      }
    } catch (error) {
      console.error("Error fetching financial year:", error);
    } finally {
    }
  };

  const getUnit = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getUnit`,
        {},
        {}
      );

      if (isSuccess && isMounted.current) {
        setUnits(data.data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const getReportingQuestions = async () => {
    try {
      setIsLoading(true);
      if (selectedFinancialYearId) {
        const frameworkIds = await fetchFrameworkApi();
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
          {},
          {
            financialYearId: selectedFinancialYearId,
            frameworkIds: frameworkIds,
          },
          "GET"
        );
        if (response.isSuccess && isMounted.current) {

          handleAssignedDetails();
          getSource();
          const data = response.data;
          const tmpData = data?.data;
            
          const tmpReportingQuestionsMap = {};
          const groupedByModuleName = tmpData.reduce((acc, item) => {
            if (!acc["All Module"]) {
              acc["All Module"] = [];
            }
            acc["All Module"].push(item);
            if (!acc[item.moduleName]) {
              acc[item.moduleName] = [];
            }
            acc[item.moduleName].push(item);

            tmpReportingQuestionsMap[item.questionId] = item;

            return acc;
          }, {});
          setGroupedByModuleName(groupedByModuleName);
          setReportingQuestionsMap(tmpReportingQuestionsMap);
          const path = location.pathname;
          const segment = path.split("/reporting-modules/")[1];

          const formattedName = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          const moduleFullData = groupedByModuleName[formattedName] || [];

          setAllModuleData(moduleFullData);
          setModuleData(moduleFullData);

          const initialBatch = moduleFullData.slice(0, batchSize);
          setFilteredModuleData(initialBatch);
          setCurrentPage(1);
          setHasMore(moduleFullData.length > batchSize);

          const uniqueModuleIds = Array.from(
            new Set(moduleFullData?.map((item) => item.moduleId))
          );

          setCorrectModuleId(uniqueModuleIds);
          const assignedToData = data.assignedDetail;
          setWholeAssignData(assignedToData);
          const qIds = moduleFullData.map((item) => item.questionId);
          const assignModuleData = assignedToData.filter((item) =>
            qIds.includes(item.questionId)
          );

          setAssignedTo(assignModuleData);
        }
      }
    } catch (error) {
      console.error("Error fetching reporting questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSource = async () => {
    const cachedData = localStorage.getItem("sourceData");

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setSourceData(parsedData);
      return; // No need to call API
    }

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );

      if (isSuccess && isMounted.current) {
        setSourceData(data?.data);
        localStorage.setItem("sourceData", JSON.stringify(data?.data)); // Store in localStorage
      }
    } catch (error) {
      console.error("Error fetching source data:", error);
    }
  };

  const getDueDateOverrides = async () => {
    if (!selectedFinancialYearId) return;

    setLoading(true);
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}dueDate/Overrides`,
        {},
        { financialYearId: selectedFinancialYearId },
        "GET"
      );

      if (response.isSuccess) {
        const now = new Date();

        // Group by unique key
        const overrides = (response.data.data || []).reduce((acc, item) => {
          const overrideKey = `${item.financialYearId}-${item.sourceId}-${item.fromDate}-${item.toDate}-${item.questionId}`;
          if (!acc[overrideKey]) acc[overrideKey] = [];
          acc[overrideKey].push(item);
          return acc;
        }, {});

        // Determine the effective override per key
        const effectiveOverrides = Object.entries(overrides).reduce((acc, [key, list]) => {
          const approved = list.filter(o => o.status === "approved");
          const pending = list.filter(o => o.status === "pending");

          const now = new Date();

          // --- Safe filtering for valid dueDateTime ---
          const validApproved = approved
            .filter(o => {
              if (!o.dueDateTime) return false;
              const dueDate = new Date(o.dueDateTime);
              return !isNaN(dueDate.getTime()) && dueDate > now;
            })
            .sort((a, b) => new Date(b.dueDateTime) - new Date(a.dueDateTime))[0];

          if (validApproved) {
            acc[key] = validApproved;
          } else {
            const latestPending = pending
              .sort((a, b) => new Date(b.updatedAt || b.requestDate) - new Date(a.updatedAt || a.requestDate))[0];
            if (latestPending) acc[key] = latestPending;
          }

          return acc;
        }, {});

        setDueDateOverrides(effectiveOverrides);
      }
    } catch (error) {
      console.error("Error fetching due date overrides:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLockData = async () => {
    if (!selectedFinancialYearId) return;

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}periods/locked`,
        {},
        { financialYearId: selectedFinancialYearId },
        "GET"
      );
      if (isSuccess) {
        setPeriodLockData(data?.data)
      } else {
        setPeriodLockData([]);
      }
    } catch (error) {
      setPeriodLockData([]);
    }
  };


  useEffect(() => {
    if (
      groupedByModuleName &&
      wholeAssignData &&
      selectedFrameworks.length > 0 // ✅ Ensures frameworks are ready
    ) {
      const path = location.pathname;
      const segment = path.split("/reporting-modules/")[1];
      const formattedName = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  
      const moduleFullData = groupedByModuleName[formattedName] || [];
  
      // Mark selection based on framework IDs
        moduleFullData.forEach((item) => {
          const frameworkIds = JSON.parse(item.mapFrameworkIds || "[]");
          item.isSelected = frameworkIds.some((id) =>
            selectedFrameworks.includes(id)
          );
        });
        const selectedModules = moduleFullData.filter((item) => item.isSelected);

      setAllModuleData(selectedModules); 
      setModuleData(selectedModules);
  
      const initialBatch = selectedModules.slice(0, batchSize);
      setFilteredModuleData(initialBatch);
      setCurrentPage(1);
      setHasMore(selectedModules.length > batchSize);
  
      const uniqueModuleIds = Array.from(
        new Set(selectedModules.map((item) => item.moduleId))
      );
      setCorrectModuleId(uniqueModuleIds);
  
      const qIds = selectedModules.map((item) => item.questionId);
      const assignModuleData = wholeAssignData.filter((item) =>
        qIds.includes(item.questionId)
      );
      setAssignedTo(assignModuleData);
    }
  }, [location, groupedByModuleName, wholeAssignData, selectedFrameworks]);
  

  const questionIds = moduleData?.map((item) => item?.questionId);

  useEffect(() => {
    if (
      location.state?.reportingQuestion &&
      location.state?.reportingQuestion.length
    ) {
      if (selectedFinancialYearId) {
        getReportingQuestions();
      }
    }
  }, [location.state?.reportingQuestion]);

  const getTargetQuestionAnswer = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTargetQuestionAnswer`,
        {},
        { financialYearId: selectedFinancialYearId },
        "GET"
      );
      if (isSuccess && isMounted.current) {
        setApiData(data.answers);
      }
    } catch (error) {
      console.error("Error fetching target question answers:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (selectedFinancialYearId) {
      getReportingQuestions();
      getTargetQuestionAnswer();
      getDueDateOverrides();
      getPeriodLockData();
    }
  }, [selectedFinancialYearId]);

  const getDesignation = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getMasterData`,
        {},
        { userId: userId },
        "GET"
      );
      if (isSuccess && isMounted.current) {
        const nonAuditorRoles = data?.data.filter(
          (role) =>
            !(
              role.onlyauditor === true ||
              role?.role_name === "Trainee" ||
              role?.role_name === "Trainer"
            )
        );
        setManagementListValue(nonAuditorRoles?.reverse());
      }
    } catch (error) {
      console.error("Error fetching designation:", error);
    }
  };

  // Handle filtered data with lazy loading
  const handleFilteredData = (filteredData) => {
    setModuleData(filteredData || []);
    const initialBatch = filteredData ? filteredData.slice(0, batchSize) : [];
    setFilteredModuleData(initialBatch);
    setCurrentPage(1);
    setHasMore(filteredData ? filteredData.length > batchSize : false);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filteredModuleData && filteredModuleData.length > 0) {
      setLoading(false);
    }
  }, [filteredModuleData]);

  useEffect(() => {
    getDesignation();
    getUnit();
  }, []);

  useEffect(() => {
    handleAssignedDetails();
  }, [selectedFinancialYearId]);

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div
        style={{
          flex: sidebarExpanded ? "0 0 21%" : "0 0 60px",
          position: "sticky",
          top: 0,
          zIndex: 999,
          transition: "flex 0.3s ease",
        }}
      >
        <Sidebar
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper p-3">
          <div
            className="w-100"
            style={{
              paddingRight: "2.5%",
              marginLeft: "2%",
            }}
          >
            <TwoButtonComponent
              handleAssignedDetails={handleAssignedDetails}
              currentUserId={currentUserId}
              questionIds={questionIds}
              financeObjct={selectedFinancialYearId}
              managementListValue={managementListValue}
              moduleName={moduleName}
              onFilteredData={handleFilteredData}
              moduleData={moduleData}
              setSelectedFinancialYearId={setSelectedFinancialYearId}
              setSelectedFinancialYearValue={setSelectedFinancialYearValue}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              reportingQuestionsMap={reportingQuestionsMap}
              groupedByModuleName={groupedByModuleName}
              selectedQuestions={selectedQuestions}
              selectedFrameworks={selectedFrameworks}
              setSelectedFrameworks={setSelectedFrameworks}
              dueDateOverrides={dueDateOverrides}
              periodLockData={periodLockData}
            />
          </div>
          <div className="w-100 p-4">
            {isLoading && filteredModuleData.length === 0 ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading data...</p>
              </div>
            ) : (
              <>
                {filteredModuleData && filteredModuleData.length > 0 && (
                  <AccordionComponent
                    sourceData={sourceData}
                    modId={moduleId}
                    correctModuleId={correctModuleId}
                    assignedTo={assignedTo}
                    currentUserId={currentUserId}
                    apiData={apiData}
                    moduleName={moduleName}
                    moduleData={filteredModuleData}
                    allModuleData={allModuleData}
                    startingMonth={startingMonth}
                    financeObject={selectedFinancialYearId}
                    dueDateOverrides={dueDateOverrides}
                    getDueDateOverrides={getDueDateOverrides}
                    periodLockData={periodLockData}
                    units={units}
                    loading={loading}
                    selectedFrameworks={selectedFrameworks}
                    selectedQuestions={selectedQuestions}
                    setSelectedQuestions={setSelectedQuestions}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                )}

                {/* Loading indicator at bottom for in finite scroll */}
                {hasMore && (
                  <div ref={lastElementRef} className="text-center py-3">
                    {isLoading && (
                      <div className="d-flex justify-content-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Loading more...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {!hasMore && filteredModuleData.length > 0 && (
              <div className="text-center py-3 text-muted">
                <small>End of data</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalModule;
