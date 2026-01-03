import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import TwoButtonComponent from "../../OperationalModule/components/twobuttoncomponent";
import AccordionComponent from "../../OperationalModule/components/accordioncomponent";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { useAudit } from "../../sidebar/sidebar";


const NewAuditList = (props) => {
  const menu = "audit";
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Lazy loading states
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [batchSize, setBatchSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allModuleData, setAllModuleData] = useState([]);
  const loaderRef = useRef(null);
  const [selectedFinancialYearValue, setSelectedFinancialYearValue] =
  useState(null); 
  const [auditModuleFromRefresh, setAuditModuleFromRefresh] = useState();
  const [auditAssignedTo, setAuditAssignedTo] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const { getAuditListing, auditModule } = useAudit();
  const [auditModuleData, setAuditModuleData] = useState();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedFinancialYearId, setSelectedFinancialYearId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      location.state?.reportingQuestion &&
      location.state?.reportingQuestion.length
    ) {
      getAuditListings();
    } else {
      getAuditListingQuestion();
    }
  }, [location.pathname, auditModule, location?.state?.auditModuleData]);

  const { moduleName } = useParams();

  const [moduleData, setModuleData] = useState(() => {
    // Initial state: Get from localStorage if available
    const storedData = localStorage.getItem("auditModuleData");
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const [sourceData, setSourceData] = useState(() => {
    const storedData = localStorage.getItem("sourceData");
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const [filteredModuleData, setFilteredModuleData] = useState([]);

  const [financeObjct, setFinanceObjct] = useState();
  const [startingMonth, setStartingMonth] = useState("");
  const [correctModuleId, setCorrectModuleId] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [managementListValue, setManagementListValue] = useState([]);
  const [assignedTo, setAssignedTo] = useState();
  const [moduleId, setModuleId] = useState(() => {
    // Initial state: Get from localStorage if available
    const storedData = localStorage.getItem("auditModuleId");
    return storedData ? JSON.parse(storedData) : null;
  });
  
  const userId = JSON.parse(localStorage.getItem("user_temp_id"));
  
  // Optimized handleLoadMore function - appends only new items
  const handleLoadMore = () => {
    // Prevent multiple calls while already loading
    if (isDataFetching || !hasMore || !allModuleData || allModuleData.length === 0) return;
    
    setIsDataFetching(true);
    
    // Calculate next batch of data
    const nextPage = currentPage + 1;
    const endIndex = nextPage * batchSize;    
    
    if (allModuleData.length > filteredModuleData.length) {
      // Get only the new items to add (more efficient)
      allModuleData.forEach((item) => { 
        const frameworkIds = JSON.parse(item.mapFrameworkIds || "[]");
        item.isSelected = frameworkIds.some((id) =>
          selectedFrameworks.includes(id)
        );
      });
      const selectedModules = allModuleData.filter((item) => item.isSelected);
      const newItems = selectedModules.slice(filteredModuleData.length, endIndex);
      
      // Append new items to existing array instead of replacing everything
      setFilteredModuleData(prevData => [...prevData, ...newItems]);
      setCurrentPage(nextPage);
      setIsDataFetching(false);
    } else {
      allModuleData.forEach((item) => { 
        const frameworkIds = JSON.parse(item.mapFrameworkIds || "[]");
        item.isSelected = frameworkIds.some((id) =>
          selectedFrameworks.includes(id)
        );
      });
      const remainingItems = allModuleData.filter((item) => item.isSelected).slice(filteredModuleData.length);
      setFilteredModuleData(prevData => [...prevData, ...remainingItems]);
      setHasMore(false);
      setIsDataFetching(false);
    }
  };
  
  // Setup scroll event listener with debouncing for better performance
  useEffect(() => {
    // Define a debounce function to prevent too many calls
    let scrollTimeout;
    
    const handleScroll = () => {
      if (isDataFetching || !hasMore) return;
      
      // Clear any existing timeout
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Set a new timeout to debounce the scroll event (150ms)
      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        
        // Increase the threshold to load earlier (300px before bottom)
        if (scrollTop + clientHeight >= scrollHeight - 300) {
          console.log('Debounced scroll triggered loadMore');
          handleLoadMore();
        }
      }, 150); // 150ms debounce time
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasMore, isDataFetching, currentPage, allModuleData, filteredModuleData.length]);
  
  // Improved Intersection Observer for better detection
  useEffect(() => {
    if (!loaderRef.current || isDataFetching || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isDataFetching) {
          console.log('Intersection Observer triggered loadMore');
          handleLoadMore();
        }
      },
      { 
        root: null,
        rootMargin: '300px', // Increased from 100px to load earlier
        threshold: 0.1 
      }
    );
    
    observer.observe(loaderRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [loaderRef.current, isDataFetching, hasMore, filteredModuleData.length]);
  
  useEffect(() => {
    setStartingMonth(
      JSON.parse(localStorage.getItem("currentUser")).starting_month
    );
    setCurrentUserId(JSON.parse(localStorage.getItem("currentUser")).id);
    const id = getFinancialYear();
  }, []);
  
  const getAuditListings = async () => {
    try {
      setLoading(true);
      setIsDataFetching(true);

      const dataExist = JSON.parse(localStorage.getItem("reportingQuestion"));
      if ((location.state?.reportingQuestion && location.state?.reportingQuestion.length) || (dataExist && dataExist.length)) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getAuditListing`,
          {},
          {
            financialYearId: await getFinancialYear()
          },
          "GET"
        );
        
        if (response.isSuccess && isMounted.current) {
          handleAssignedDetails();
          getSource();
          const tmpLocalData = location.state?.reportingQuestion || dataExist;
          const data = response.data;
          const tmpData = tmpLocalData.length
            ? data?.data.filter((item) =>
                tmpLocalData.includes(
                  item.question.questionId
                )
              )
            : data?.data;

          const moduleNamesSet = new Set();

          // Object to group data by module
          const groupedData = tmpData.reduce((acc, item) => {
            const moduleName = item.question?.moduleName || "Unknown Module";

            // Add module name to the set
            moduleNamesSet.add(moduleName);

            // Initialize array if not already done
            if (!acc["All Module"]) {
              acc["All Module"] = [];
            }
            acc["All Module"].push(item);
            if (!acc[moduleName]) {
              acc[moduleName] = [];
            }

            // Add item to the module's array
            acc[moduleName].push(item);
            return acc;
          }, {});

          setAuditModuleData(groupedData);
          const path = location.pathname;
          const segment = path.split("/audit-listing/")[1]; // Get the part after /audit-listing/

          if (segment) {
            const formattedName = segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to "General Information" format

            if (groupedData && groupedData[formattedName]) {
              const currentUserId = JSON.parse(
                localStorage.getItem("currentUser")
              )?.id;

            const filteredModules = groupedData[formattedName]
              .map((item) => {
                const matchingAuditors = (item.matchingAuditors || []).filter(
                  (auditor) =>
                    Number(auditor?.auditerId) === Number(currentUserId)
                );

                const frameworkIds = JSON.parse(item.mapFrameworkIds || "[]");
                const isSelected = frameworkIds.some((id) =>
                  selectedFrameworks.includes(id)
                );

                return {
                  ...item,
                  matchingAuditors,
                  isSelected,
                };
              })
              .filter((item) => item.matchingAuditors.length > 0);

              // const selectedModules = filteredModules.filter((item) => item.isSelected);
              // Store all data for lazy loading
              setAllModuleData(filteredModules);
              
              // Only load the first batch (smaller for initial faster display)
              const initialBatch = filteredModules.slice(0, 10);
              setFilteredModuleData(initialBatch);
              setCurrentPage(1);
              setHasMore(filteredModules.length > 10);
            } else {
              setAllModuleData([]);
              setFilteredModuleData([]);
              setHasMore(false);
            }
          }

          const uniqueModuleIds = Array.from(
            new Set(
            groupedData["All Module"].map((item) => item?.question?.moduleId)
            )
          );
          setCorrectModuleId(uniqueModuleIds);
          localStorage.setItem("auditModuleId", JSON.stringify(uniqueModuleIds));

          const assignedToData = data.getAssignedDetails;
          setAuditAssignedTo(assignedToData);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching audit listings:", error);
      setLoading(false);
    } finally {
      if (isMounted.current) {
        setIsDataFetching(false);
      }
    }
  };

  const getAuditListingQuestion = async () => {
    try {
      setLoading(true);
      setIsDataFetching(true);
      
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAuditListing`,
        {},
        {
          financialYearId: await getFinancialYear()
        },
        "GET"
      );
      
      if (response.isSuccess && isMounted.current) {
        handleAssignedDetails();
        getSource();
        const data = response.data;
        const tmpData = data?.data;

        const moduleNamesSet = new Set();

        // Object to group data by module
        const groupedData = tmpData.reduce((acc, item) => {
          const moduleName = item.question?.moduleName || "Unknown Module";

          // Add module name to the set
          moduleNamesSet.add(moduleName);

          // Initialize array if not already done
          if (!acc["All Module"]) {
            acc["All Module"] = [];
          }
          acc["All Module"].push(item);
          if (!acc[moduleName]) {
            acc[moduleName] = [];
          }

          // Add item to the module's array
          acc[moduleName].push(item);
          return acc;
        }, {});

        setAuditModuleData(groupedData);
        const path = location.pathname;
        const segment = path.split("/audit-listing/")[1]; // Get the part after /audit-listing/

        if (segment) {
          const formattedName = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to "General Information" format

          if (groupedData && groupedData[formattedName]) {
            const currentUserId = JSON.parse(
              localStorage.getItem("currentUser")
            )?.id;


            const filteredModules = groupedData[formattedName]
              .map((item) => {
                const matchingAuditors = (item.matchingAuditors || []).filter(
                  (auditor) =>
                    Number(auditor?.auditerId) === Number(currentUserId)
                );

                const frameworkIds = JSON.parse(item.mapFrameworkIds || "[]");
                const isSelected = frameworkIds.some((id) =>
                  selectedFrameworks.includes(id)
                );

                return {
                  ...item,
                  matchingAuditors,
                  isSelected,
                };
              })
              .filter((item) => item.matchingAuditors.length > 0);

            // Store all data for lazy loading
            setAllModuleData(filteredModules);
            
            // Only load the first batch (smaller for faster initial display)
            const initialBatch = filteredModules.slice(0, 10);
            setFilteredModuleData(initialBatch);
            setCurrentPage(1);
            setHasMore(filteredModules.length > 10);
          } else {
            setAllModuleData([]);
            setFilteredModuleData([]);
            setHasMore(false);
          }
        }

        const uniqueModuleIds = Array.from(
          new Set(
            groupedData["All Module"].map((item) => item?.question?.moduleId)
          )
        );
        setCorrectModuleId(uniqueModuleIds);
        localStorage.setItem("auditModuleId", JSON.stringify(uniqueModuleIds));

        const assignedToData = data.getAssignedDetails;
        setAuditAssignedTo(assignedToData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching audit listing questions:", error);
      setLoading(false);
    } finally {
      if (isMounted.current) {
        setIsDataFetching(false);
      }
    }
  };

  const getFinancialYear = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearData');
      
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
        
        if (isSuccess && isMounted.current) {
          // Store the response in local storage for future use
          localStorage.setItem('financialYearData', JSON.stringify(data.data));
          
          const lastEntry = data.data[data.data.length - 1];
          setFinanceObjct(lastEntry.id);
          return lastEntry.id;
        }
      }
    } catch (error) {
      console.error("Error fetching financial year:", error);
    }
  };

  const questionIds = moduleData?.map((item) => item?.questionId);

  // Modified to support lazy loading with optimized approach
  const handleFilteredData = (filteredData) => {
    if (filteredData && filteredData.length > 0) {
      filteredData.forEach((item) => {
        const frameworkIds = JSON.parse(item.question.mapFrameworkIds || "[]");
        item.isSelected = frameworkIds.some((id) =>
          selectedFrameworks.includes(id)
        );
      });
      const selectedModules = filteredData.filter((item) => item.isSelected);
      // Use smaller batch for initial load (10 instead of batchSize)
      const initialBatch = selectedModules.slice(0, 10);
      setFilteredModuleData(initialBatch);
      setCurrentPage(1);
      setHasMore(selectedModules.length > 10);
    } else {
      setFilteredModuleData([]);
      setHasMore(false);
    }
  };

  useEffect(() => {
    setActiveIndex(null);

    if (!searchTerm) {
      handleFilteredData(allModuleData);
      return;
    }

    const filtered = allModuleData.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    handleFilteredData(filtered);
  }, [searchTerm]);

  useEffect(() => {
    handleFilteredData(allModuleData);
  }, [selectedFrameworks]);

  const handleAssignedDetails = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAssignedDetails`,
        {},
        { financialYearId: await getFinancialYear() },
        "GET"
      );
      if (isSuccess && isMounted.current) {
        setAssignedTo(data.assignedDetails);
        localStorage.setItem(
          "auditAssignedTo",
          JSON.stringify(data.assignedDetails)
        );
      }
    } catch (error) {
      console.error("Error fetching assigned details:", error);
    }
  };

  useEffect(() => {
    handleAssignedDetails();
  }, []);

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
  

  useEffect(() => {
    if (
      location.state?.reportingQuestion &&
      location.state?.reportingQuestion.length
    ) {
      getAuditListings();
    }
  }, [location.state?.reportingQuestion,selectedFrameworks]);

  useEffect(() => {
    getAuditListings();
  }, []);

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
          (role) => role.onlyauditor !== true
        );
        setManagementListValue(nonAuditorRoles?.reverse());
      }
    } catch (error) {
      console.error("Error fetching designation:", error);
    }
  };

  useEffect(() => {
    getDesignation();
    getSource();
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("auditModuleData");
    };
  }, []);

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
         transition: "flex 0.3s ease"
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
          overflowY: "auto" 
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
              menu={menu}
              financeObjct={financeObjct}
              managementListValue={managementListValue}
              moduleName={moduleName}
              onFilteredData={handleFilteredData}
              moduleData={filteredModuleData}
              selectedFrameworks={selectedFrameworks}
              setSelectedFrameworks={setSelectedFrameworks}
              selectedFinancialYearValue={selectedFinancialYearValue}
              setSelectedFinancialYearValue={setSelectedFinancialYearValue}
              selectedFinancialYearId={selectedFinancialYearId}
              setSelectedFinancialYearId={setSelectedFinancialYearId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          
          <div className="w-100 p-4">
            {loading && filteredModuleData.length === 0 ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading data...</p>
              </div>
            ) : (
              <>
                <AccordionComponent
                  modId={moduleId}
                  sourceData={sourceData}
                  currentUserId={currentUserId}
                  assignedTo={assignedTo || auditAssignedTo}
                  getAuditListing={getAuditListing}
                  correctModuleId={correctModuleId}
                  menu={menu}
                  moduleName={moduleName}
                  moduleData={filteredModuleData}
                  allModuleData={allModuleData}
                  startingMonth={startingMonth}
                  financeObject={financeObjct}
                  loading={loading}
                  selectedQuestions={selectedQuestions}
                  setSelectedQuestions={setSelectedQuestions}
                  selectedFrameworks={selectedFrameworks}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
                
                {/* Improved loading indicator with manual load button option */}
                {(hasMore || isDataFetching) && (
                  <div 
                    ref={loaderRef} 
                    className="text-center py-4 my-3"
                    style={{ 
                      minHeight: "100px", 
                      display: "block", 
                      width: "100%",
                      margin: "20px 0"
                    }}
                  >
                    {isDataFetching ? (
                      <div className="d-flex flex-column align-items-center">
                        <div className="spinner-border text-primary mb-2" role="status">
                          <span className="visually-hidden">Loading more...</span>
                        </div>
                        <p className="text-primary fw-bold">Loading more items...</p>
                      </div>
                    ) : hasMore ? (
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={handleLoadMore}
                        disabled={isDataFetching}
                      >
                        Load More
                      </button>
                    ) : (
                      <p className="text-muted">End of list</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAuditList;