import React, { useEffect, useState, createContext, useContext, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import foot_Logo from "../../img/logol.png";
import head_Logo from "../../img/Riu_TM_Logo.png";
import { apiCall } from "../../_services/apiCall";
import "./common.css";
import "./sidebar.css";
import config from "../../config/config.json";
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import { authenticationService } from "../../_services/authentication";
import { history } from "../../_helpers/history";
import { FiClipboard, FiLogOut, FiSidebar, FiMessageCircle, FiBarChart2 } from "react-icons/fi";
import { set } from "lodash";
import down from "../../img/DownArrow.svg";

export const AuditContext = createContext();
export const useAudit = () => useContext(AuditContext);
let selectedItem = ""
export const AuditProvider = ({ children }) => {
  const [auditModuleNames, setAuditModuleNames] = useState([]);
  const [auditModule, setAuditModule] = useState([]);
  const [auditAssignedTo, setAuditAssignedTo] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getAuditListing()
  }, [])

    const getFinancialYear = async () => {
      try {
        // Check if data exists in local storage
        const storedData = localStorage.getItem('financialYearData');
        
        if (storedData) {
          // Data exists in local storage, parse and use it
          const parsedData = JSON.parse(storedData);
          const lastEntry = parsedData[parsedData.length - 1];
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
            return lastEntry.id;
          }
        }
      } catch (error) {
        console.error("Error fetching financial year:", error);
      }
    };


  const getAuditListing = async () => {
    let url = window.location.href;
    if (url.includes("audit-listing")) {
      try {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getAuditListing`,
          {},
          {
            financialYearId: await getFinancialYear() 
            // frameworkIds: [1] 
          },
          "GET"
        );
        if (response.isSuccess && isMounted.current) {
          const data = response.data;

          // Set to collect unique module names
          const moduleNamesSet = new Set();

          // Object to group data by module
          const groupedData = data.data.reduce((acc, item) => {
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

          const moduleNamesList = Array.from(moduleNamesSet);

          if (isMounted.current) {
            setAuditModule(groupedData);
          }

          setAuditModuleNames(moduleNamesList);

          const assignedToData = data.getAssignedDetails

          setAuditAssignedTo(assignedToData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <AuditContext.Provider value={{ getAuditListing, auditModule, auditModuleNames, auditAssignedTo }}>
      {children}
    </AuditContext.Provider>
  );
};

const Sidebar = ({ onSidebarToggle }) => {
  const contextType = useContext(PermissionMenuContext);
  const [menuList, setMenuList] = useState([]);
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [moduleNames, setModuleNames] = useState([]);
  const [module, setModule] = useState([]);
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);
  const [isAuditSubmenuVisible, setIsAuditSubmenuVisible] = useState(false);
  const [isAuditListingSubmenuVisible, setIsAuditListingSubmenuVisible] = useState(false);
  const [auditModuleNames, setAuditModuleNames] = useState([]);
  const [auditModule, setAuditModule] = useState([]);
  const [auditAssignedTo, setAuditAssignedTo] = useState([]);
  const [sourceData, setSourceData] = useState();
  const [isRotated, setIsRotated] = useState(false);
  const [isAuditRotated, setIsAuditRotated] = useState(false);
  const [isCarbonRotated, setIsCarbonRotated] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const isMounted = useRef(true);


  const getAuditListing = async () => {
    let url = window.location.href;
    if (url.includes("audit-listing")) {
      try {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getAuditListing`,
          {},
          {
            financialYearId: 30,

            // frameworkIds: [1] 
          },
          "GET"
        );
        if (response.isSuccess && isMounted.current) {
          const data = response.data;

          // Set to collect unique module names
          const moduleNamesSet = new Set();

          // Object to group data by module
          const groupedData = data.data.reduce((acc, item) => {
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

          const moduleNamesList = Array.from(moduleNamesSet);

          if (isMounted.current) {
            setAuditModule(groupedData);
          }

          setAuditModuleNames(moduleNamesList);

          const assignedToData = data.getAssignedDetails

          setAuditAssignedTo(assignedToData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess && isMounted.current) {
      setSourceData(data?.data);
    }
  };



  // Function to toggle submenu visibility
  const toggleSubmenu = async () => {
    const dataExist = JSON.parse(localStorage.getItem("reportingQuestion"));

    if (dataExist) {
      localStorage.removeItem("reportingQuestion");
    }
    selectedItem = "reporting"
    localStorage.setItem("subAuditMenu", JSON.stringify(false));
    const newAuditSubMenuValue = true;
    localStorage.setItem("subMenu", JSON.stringify(newAuditSubMenuValue));
    setIsSubmenuVisible(newAuditSubMenuValue);
    setIsRotated(true);
    setIsSubmenuOpen(!isSubmenuOpen)
  };



  useEffect(() => {
    const storedSubMenu = JSON.parse(localStorage.getItem("subMenu"));

    setIsSubmenuVisible(storedSubMenu !== null ? storedSubMenu : false);

    const storedSubAuditMenu = JSON.parse(localStorage.getItem("subAuditMenu"));

    setIsAuditListingSubmenuVisible(storedSubAuditMenu !== null ? storedSubAuditMenu : false);

    const fetchData = async () => {
      try {
        await getReportingQuestions(); // Call your async function here
      } catch (error) {
        console.error("Error fetching reporting questions:", error);
      }
    };

    fetchData(); // Invoke the async function
    return () => {
      localStorage.removeItem("subMenu");
    };

  }, [])

  const toggleAuditListingSubmenu = () => {
    selectedItem = "audit"
    getSource();
    getAuditListing()
    localStorage.setItem("subMenu", JSON.stringify(false));
    // Retrieve the current value of `subAuditMenu` from localStorage
    const storedAuditSubMenu = JSON.parse(localStorage.getItem("subAuditMenu"));

    // If `storedAuditSubMenu` is `true`, make it `false`, and vice versa
    const newAuditSubMenuValue = true;

    // Update the localStorage value
    localStorage.setItem("subAuditMenu", JSON.stringify(newAuditSubMenuValue));

    // Update the `isSubmenuVisible` state with the toggled value
    setIsSubmenuVisible(newAuditSubMenuValue);

    // Toggle the rotation state
    setIsAuditRotated(!isAuditRotated);
  };

  const [isCarbonSubMenuVisible, setIsCarbonSubMenuVisible] = useState(false)

  const authValue = JSON.parse(localStorage.getItem("currentUser"));

  const toggleCarbonSubmeny = () => {
    selectedItem = "carbon"
    localStorage.removeItem("reportingQuestion")
    // getAuditListing()
    setIsCarbonSubMenuVisible(!isAuditSubmenuVisible);
    toggle()
    // setIsAuditRotated(!isAuditRotated)
  };
  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL" }
    );
    if (isSuccess && isMounted.current) {
      const frameworkIds = data?.data.map((item) => item.id);
      setFrameworkValue(frameworkIds);
      return data?.data.map((item) => item.id);
    }
  };

  const toUrlFriendlyName = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');

    if (storedData && isMounted.current) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      return parsedData[parsedData.length - 1]?.id;
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

        // Return the ID of the last entry
        return data?.data[data.data.length - 1]?.id;
      }
    }
  };


  const getReportingQuestions = async () => {
    let url = window.location.href;
    if (url.includes("reporting-modules")) {
      let financialYearId = await getFinancialYear()
      let frameworkIds = await fetchFrameworkApi()
      if (!(financialYearId && frameworkIds)) {
        return;
      }
      try {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
          {},
          {
            financialYearId, frameworkIds
          },
          "GET"
        );
        if (response.isSuccess && isMounted.current) {
          const data = response.data;

          const moduleNames = [...new Set(data.data.map(item => item.moduleName))];

          setModuleNames(moduleNames);
          const groupedByModuleName = data.data.reduce((acc, item) => {
            if (!acc["All Module"]) {
              acc["All Module"] = [];
            }
            acc["All Module"].push(item);
            if (!acc[item.moduleName]) {
              acc[item.moduleName] = [];
            }
            acc[item.moduleName].push(item);


            return acc;
          }, {});

          setModule(groupedByModuleName);

          const assignedToData = data.assignedDetail
          setAssignedTo(assignedToData); // Assuming `setAssignedTo` is a state sette
          const newAuditSubMenuValue = true;

          // Update the localStorage value
          localStorage.setItem("subMenu", JSON.stringify(newAuditSubMenuValue));
          setIsSubmenuOpen(true)

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };




  useEffect(() => {
    const settingsMenu = JSON.parse(localStorage.getItem("menu"));
    fetchFrameworkApi()
    setMenuList(settingsMenu);
  }, [contextType.state]);

  const chatbot = () => {
    window.location.href = "https://riu-webui.riu.ai";
  };

  const competitorAnalysis = () => {
    window.location.href = "https://brsrdashboard-gba9b3d2h3e4fdfs.centralindia-01.azurewebsites.net/";
  }

  const logoutUser = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}logout`,
      {},
      {},
      'POST'
    );
    if (isSuccess && isMounted.current) {
    }
  };

  const logout = () => {
    logoutUser();
    authenticationService.logout();
    history.push("/");
    localStorage.clear();
  };

  const currentURL = window.location.href;
  const splitURL = currentURL.split("/");
  const activeURL = splitURL[4];
  const isReportingModuleActive =
    activeURL === 'reporting-modules' ||
    activeURL.startsWith('reporting-modules/');

  const toggle = () => {
    selectedItem = "overview"
    setIsSubmenuVisible(false)
    localStorage.setItem("subMenu", JSON.stringify(false));
    localStorage.setItem("subAuditMenu", JSON.stringify(false));
  }

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    // Notify parent component about the sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle(newState);
    }
  };

  return (
    <div style={{ boxSizing: "border-box", width: "100%", height: "100vh", overflowY: "auto" }}>
      <div className="d-flex p-10" id="wrapper" style={{ boxSizing: "border-box", width: "100%", maxWidth: "100%", height: "100%" }}>
        <div className={`bg-white d-flex flex-column h-100 position-relative ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
          style={{
            transition: "width 0.3s ease",
            width: isOpen ? "100%" : "60px",
            overflow: "hidden"
          }}>
          <button
            onClick={toggleSidebar}
            className="toggle-btn"
            style={{
              position: "absolute",
              top: "3px",
              left: "15px",
              zIndex: "1000",
              cursor: "pointer",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#3f88a5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              color: "#fff",
              fontSize: "20px"
            }}
          >
            <FiSidebar />
          </button>
          <div className="logo_text p-3" style={{ width: "100%", overflow: "hidden" }}>
            <NavLink to="/home" style={{ display: "block", maxWidth: "100%" }}>
              <img
                src={head_Logo}
                alt="Logo"
                style={{
                  maxWidth: "100%",
                  transition: "0.3s ease",
                  width: isOpen ? "auto" : "40px"
                }}
              />{" "}
            </NavLink>
          </div>

          <div className={`sidebar-content ${!isOpen && "d-none"}`}>
            {/* Your menu items go here */}

            <div className="list-group list-group-flush">
              <div className="route-dom p-2">
                {menuList?.some(item => item.url === "home") && (
                  <div className="overView">
                    <div
                      style={{
                      paddingLeft: "11%",
                      paddingRight: "5%",
                      paddingBottom: "2%",
                      borderRadius: 8,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        color: "rgba(28, 28, 28, 0.40)",
                        fontSize: 14,
                        fontFamily: "Open Sans",
                        fontWeight: "400",


                        wordWrap: "break-word",
                      }}
                    >
                      Dashboards
                    </div>
                  </div>
                  <ul className="home_icon_img">
                    {menuList?.slice(0, 1).map((data, index) => (
                      <li key={index}>
                        <NavLink
                          activeClassName="active"
                          onClick={toggle}
                          to={`/${data?.url}`}
                          className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                        >
                          {activeURL === data?.url ? (
                            <img
                              src={`${config.BASE_URL}${data?.activeIcon}`}
                              alt=""
                            />
                          ) : (
                            <img
                              src={`${config.BASE_URL}${data?.inactiveIcon}`}
                              alt=""
                            />
                          )}

                          <span className="home_boom">Dashboards</span>
                        </NavLink>
                      </li>

                    ))}

                  </ul>
                  </div>
                )}
                <div className="pages" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                  <div
                    style={{
                      paddingLeft: "11%",
                      paddingRight: "5%",
                      paddingBottom: "2%",
                      borderRadius: 8,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        color: "rgba(28, 28, 28, 0.40)",
                        fontSize: 14,
                        fontFamily: "Open Sans",
                        fontWeight: "400",
                        wordWrap: "break-word",
                      }}
                    >
                      Pages
                    </div>
                  </div>


                  <ul className="home_icon_img">
                    {(menuList?.some(item => item.url === "home") 
                      ? menuList?.slice(1)
                      : menuList
                    )?.map((data, index) => {
                      if (data.caption === "Reporting Module") {
                        return (
                          <li key={index}>
                          <NavLink
                            to={`/reporting-modules/${toUrlFriendlyName('all-module')}`}
                            className={`list-group-item list-group-item-action list-group-item-light nop ${
                              isReportingModuleActive ? 'active' : ''
                            }`}
                            activeClassName="active"
                            onClick={toggle}
                            style={{
                              padding: "0.65rem",
                              paddingTop: "1rem",
                              paddingBottom: "1rem",
                            }}
                          >
                        
                            {activeURL.startsWith('reporting-modules/') ? (
                              <img src={`${config.BASE_URL}${data?.activeIcon}`} alt="" />
                            ) : (
                              <img src={`${config.BASE_URL}${data?.inactiveIcon}`} alt="" />
                            )}
                        
                            <span className="home_boom">{data.caption}</span>
                          </NavLink>
                        </li>
                        );
                      }

                      if (data.caption === "Audit") {
                        return (


                          <li key={index}>
                            <div
                              onClick={toggleAuditListingSubmenu}
                              className="audit-module list-group-item-action list-group-item-light  nop"
                              onMouseEnter={(e) => (e.currentTarget.style.cursor = "pointer")}
                              onMouseLeave={(e) => (e.currentTarget.style.cursor = "default")}
                              style={{
                                display: "flex",
                                padding: "0.65rem",
                                paddingTop: "1rem", paddingBottom: "1rem",

                                borderRadius: "10px",
                                backgroundColor: isAuditRotated ? '#3F88A5' : 'transparent', // Conditionally set the background color
                                color: isAuditRotated ? 'white' : 'inherit', // Optionally, change text color for better visibility
                                transition: 'background-color 0.3s ease', // Smooth transition for background color change
                              }}
                            >
                              <div style={{ width: "5%" }}>
                                <img src={`${config.BASE_URL}${data?.inactiveIcon}`} alt="" />
                              </div>
                              <div style={{ width: "80%" }}>
                                <span className="home_boom">{data?.caption}</span>

                              </div>

                              <div style={{ width: "15%" }}>
                                <div style={{
                                  marginLeft: '60%',
                                  marginTop: "1%",
                                  height: "10px", width: "20px",
                                  color: isAuditRotated ? "white" : "#3F88A5",
                                  transform: isAuditRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease', // Smooth transition for the rotation
                                }}>
                                  <svg width="19" height="10" viewBox="0 0 19 10" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
                                    <path id="Vector" stroke="currentcolor" d="M8.73823 9.70349C9.0194 9.95308 9.33455 10 9.50032 10C9.68532 10 9.97862 9.9545 10.2614 9.70349L18.7262 1.54155C19.1137 1.16804 19.0866 0.58669 18.666 0.242975C18.245 -0.100919 17.5903 -0.0759709 17.2033 0.296641L9.5 7.72292L1.79695 0.296641C1.40913 -0.0770478 0.754206 -0.10074 0.334037 0.242975C-0.0865365 0.58669 -0.113631 1.16804 0.27358 1.54155L8.73823 9.70349Z" fill="#currentcolor" />
                                  </svg>
                                </div>
                              </div>


                            </div>
                            {JSON.parse(localStorage.getItem("subAuditMenu")) && (
                              <ul
                                className="submenu"
                                style={{ marginTop: "10px" }}
                                onClick={(e) => { e.stopPropagation(); toggleAuditListingSubmenu(); }}
                              >
                                <li className="submenu-item">
                                  <NavLink
                                    to={{
                                      pathname: `/audit-listing/${toUrlFriendlyName('All Module')}`,
                                      state: { auditModuleData: auditModule['All Module'], auditAssignedTo: auditAssignedTo, sourceData: sourceData },
                                    }}
                                    className="list-group-item list-group-item-action list-group-item-light p-2 nop"
                                    style={{ background: "#E2EAEC", borderRadius: "5px", width: "100%" }}
                                  >
                                    Audit Listing
                                  </NavLink>
                                </li>
                                <li className="submenu-item">
                                  <NavLink
                                    to="/audit-history"
                                    className="list-group-item list-group-item-action list-group-item-light p-2 nop"
                                    style={{ background: "#E2EAEC", borderRadius: "5px", width: "100%" }}
                                  >
                                    Audit History
                                  </NavLink>
                                </li>
                              </ul>
                            )}
                          </li>

                        )
                      }

                      if (data.caption === "Carbon Footprinting") {
                        return (


                          <li key={index}>
                            <div
                              onClick={toggleCarbonSubmeny}
                              className="audit-module list-group-item-action list-group-item-light  nop"
                              onMouseEnter={(e) => (e.currentTarget.style.cursor = "pointer")}
                              onMouseLeave={(e) => (e.currentTarget.style.cursor = "default")}
                              to={{
                                pathname: `/carbon-footprinting/scope-1`,
                                state: {}
                              }}
                              style={{
                                display: "flex",
                                padding: "0.65rem",
                                paddingTop: "1rem", paddingBottom: "1rem",

                                borderRadius: "10px",
                                backgroundColor: isCarbonRotated ? '#3F88A5' : 'transparent', // Conditionally set the background color
                                color: isCarbonRotated ? 'white' : 'inherit', // Optionally, change text color for better visibility
                                transition: 'background-color 0.3s ease', // Smooth transition for background color change
                              }}
                            >
                              <div style={{ width: "5%" }}>
                                <img src={`${config.BASE_URL}${data?.inactiveIcon}`} alt="" />

                              </div>
                              <div style={{ width: "80%" }}>
                                <span style={{ width: "50%" }} className="home_boom">{data?.caption}</span>

                              </div>

                              <div style={{ width: "15%" }}>
                                <div style={{
                                  width: "100%",
                                  marginTop: "1%",
                                  marginLeft: "30%",
                                  height: "10px",
                                  color: isCarbonRotated ? "white" : "#3F88A5",
                                  transform: isCarbonRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease', // Smooth transition for the rotation
                                }}>
                                  <svg width="19" height="10" viewBox="0 0 19 10" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
                                    <path id="Vector" stroke="currentcolor" d="M8.73823 9.70349C9.0194 9.95308 9.33455 10 9.50032 10C9.68532 10 9.97862 9.9545 10.2614 9.70349L18.7262 1.54155C19.1137 1.16804 19.0866 0.58669 18.666 0.242975C18.245 -0.100919 17.5903 -0.0759709 17.2033 0.296641L9.5 7.72292L1.79695 0.296641C1.40913 -0.0770478 0.754206 -0.10074 0.334037 0.242975C-0.0865365 0.58669 -0.113631 1.16804 0.27358 1.54155L8.73823 9.70349Z" fill="#currentcolor" />
                                  </svg>


                                </div>
                              </div>


                            </div>
                            {isCarbonSubMenuVisible && (
                              <ul className="submenu" style={{ marginTop: "10px" }}>
                                <li key={1} className="submenu-item">
                                  <NavLink
                                    to={{
                                      pathname: `/carbon-footprinting/scope-1`,
                                      state: {}
                                    }}
                                    className="list-group-item list-group-item-action list-group-item-light p-2 nop"
                                    style={{ background: "#E2EAEC", borderRadius: "5px" }}
                                  >
                                    Scope 1
                                  </NavLink>
                                </li>
                                <li key={2} className="submenu-item">
                                  <NavLink
                                    to={{
                                      pathname: `/carbon-footprinting/scope-2`,
                                      state: {}
                                    }}
                                    className="list-group-item list-group-item-action list-group-item-light p-2 nop"
                                    style={{ background: "#E2EAEC", borderRadius: "5px" }}
                                  >
                                    Scope 2
                                  </NavLink>
                                </li>
                                <li key={3} className="submenu-item">
                                  <NavLink
                                    to={{
                                      pathname: `/carbon-footprinting/scope-3`,
                                      state: {}
                                    }}
                                    className="list-group-item list-group-item-action list-group-item-light p-2 nop"
                                    style={{ background: "#E2EAEC", borderRadius: "5px" }}
                                  >
                                    Scope 3
                                  </NavLink>
                                </li>
                              </ul>
                            )}
                          </li>

                        )
                      }
                      return (
                        <li key={index}>
                          <NavLink
                            activeClassName="active"
                            onClick={toggle}
                            to={`/${data?.url}`}
                            className="list-group-item list-group-item-action list-group-item-light nop"
                            style={{
                              padding: "0.65rem",
                              paddingTop: "1rem",
                              paddingBottom: "1rem",
                            }}
                          >
                            {activeURL === data?.url ? (
                              <img src={`${config.BASE_URL}${data?.activeIcon}`} alt="" />
                            ) : (
                              <img src={`${config.BASE_URL}${data?.inactiveIcon}`} alt="" />
                            )}
                            <span className="home_boom">{data.caption}</span>
                          </NavLink>
                        </li>
                      );
                    })}

                    {authValue && (authValue.company_id === 338 || authValue.email === 'abhimanyu@riu.ai') && (
                      <>
                        <li>
                          <NavLink
                            to={{
                              pathname: `/compliance-reporting`,
                              state: {}
                            }}
                            className="list-group-item list-group-item-action list-group-item-light nop"
                            style={{
                              padding: "0.65rem",
                              paddingTop: "1rem", paddingBottom: "1rem",
                            }}
                          >
                            <FiClipboard className="icon-width" />
                            <span className="home_boom">Compliance Reporting</span>
                          </NavLink>
                        </li> 

                        <li>
                          <NavLink
                            to="#"
                            onClick={competitorAnalysis}
                            isActive={() => false}
                            className="list-group-item list-group-item-action list-group-item-light nop"
                            style={{
                              padding: "0.65rem",
                              paddingTop: "1rem", paddingBottom: "1rem",
                            }}
                          >
                            <FiBarChart2 className="icon-width" />
                            <span className="home_boom">Competitor Analysis</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="#"
                            onClick={chatbot}
                            isActive={() => false}
                            className="list-group-item list-group-item-action list-group-item-light nop"
                            style={{
                              padding: "0.65rem",
                              paddingTop: "1rem", paddingBottom: "1rem",
                            }}
                          >
                            <FiMessageCircle className="icon-width" />
                            <span className="home_boom">Chatbot</span>
                          </NavLink>
                        </li>
                      </>
                    )}

                    <li>
                      <NavLink
                        to="/"
                        onClick={logout}
                        isActive={() => false}
                        className="list-group-item list-group-item-action list-group-item-light nop"
                        style={{
                          padding: "0.65rem",
                          paddingTop: "1rem", paddingBottom: "1rem",
                        }}
                      >
                        <FiLogOut className="icon-width" />
                        <span className="home_boom">Logout</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
