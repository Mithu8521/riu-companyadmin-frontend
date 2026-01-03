import { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Dropdown,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

import ReassignQuestionModal from "./ReassignQuestionModal";
import "./twobutton.css";
import ExcelUploader from "./ExcelUploader";
import AssignQuestionModal from "./AssignQuestionModal";
import RequestDueDateOverride from "./RequestDueDateOverride";

const TwoButtonComponent = ({
  onFilteredData,
  handleAssignedDetails,
  questionIds,
  financeObjct,
  menu,
  managementListValue,
  moduleName,
  moduleData,
  setSelectedFinancialYearId,
  setSelectedFinancialYearValue,
  searchTerm,
  setSearchTerm,
  reportingQuestionsMap,
  groupedByModuleName,
  selectedQuestions,
  selectedFrameworks,
  setSelectedFrameworks,
  dueDateOverrides,
  periodLockData
}) => {
  const data = "bottom";
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRequestDueDateApprovalModal, setShowRequestDueDateApprovalModal] = useState(false);
  const location = useLocation();
  const [financialYear, setFinancialYear] = useState([]);
  const [actionType, setActionType] = useState(null);

  // Module multiselect state
  const [selectedModules, setSelectedModules] = useState([]);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);

  const [activeModule, setActiveModule] = useState(null);

  // Extract modules from your grouped data
  const modules = groupedByModuleName
    ? Object.keys(groupedByModuleName).map((moduleName) => ({
        name: moduleName,
        count: groupedByModuleName[moduleName]?.length || 0,
      }))
    : [];

  // Local storage keys for persistence
  const STORAGE_KEY_SELECTED_MODULES = "selectedModules";
  const STORAGE_KEY_ACTIVE_MODULE = "activeModule";

  // Load selected modules from localStorage on component mount
  useEffect(() => {
    const savedSelectedModules = localStorage.getItem(
      STORAGE_KEY_SELECTED_MODULES
    );
    const savedActiveModule = localStorage.getItem(STORAGE_KEY_ACTIVE_MODULE);

    if (savedSelectedModules) {
      try {
        const parsedModules = JSON.parse(savedSelectedModules);
        setSelectedModules(parsedModules);
      } catch (error) {
        console.error("Error parsing saved modules:", error);
      }
    }

    if (savedActiveModule) {
      setActiveModule(savedActiveModule);
    }
  }, []);

  const [frameworks, setFrameworks] = useState([]);

  const getFramework = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
        {},
        { type: "ALL" }
      );
      if (isSuccess && isMounted.current) {
        setFrameworks(data?.data);
      }
    } catch (error) {
      console.error("Error fetching framework:", error);
      return [];
    }
  };

  // Initialize with first module selected by default (only if no saved modules)
  useEffect(() => {
    // Only attempt to select the first module if:
    // 1. Modules exist and moduleData exists
    // 2. No modules are already selected (from localStorage or otherwise)
    if (
      modules.length > 0 &&
      selectedModules.length === 0 &&
      moduleData &&
      Array.isArray(moduleData)
    ) {
      const firstModule = modules[0].name;
      setSelectedModules([firstModule]);
      setActiveModule(firstModule);

      // Save to localStorage
      localStorage.setItem(
        STORAGE_KEY_SELECTED_MODULES,
        JSON.stringify([firstModule])
      );
      localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, firstModule);
    }
  }, [modules, moduleData, selectedModules.length]);

  // Update active module based on URL when path changes
  useEffect(() => {
    const currentPath = getCurrentModulePath();
    const matchedModule = selectedModules.find(
      (module) => toUrlFriendlyName(module) === currentPath
    );

    if (matchedModule) {
      setActiveModule(matchedModule);
      localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, matchedModule);
    } else if (selectedModules.length > 0 && !activeModule) {
      // If no active module but we have selected modules, set the first one active
      setActiveModule(selectedModules[0]);
      localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, selectedModules[0]);
    }
  }, [location.pathname, selectedModules]);

  // Handle module selection
  const handleModuleSelect = (moduleName) => {
    const currentPath = getCurrentModulePath();
    const matchedModule = selectedModules.find(
      (module) => toUrlFriendlyName(module) === currentPath
    );

    if (matchedModule === moduleName) {
      return;
    }

    // Check if module is being added or removed
    const isRemoving = selectedModules.includes(moduleName);

    const newSelected = isRemoving
      ? selectedModules.filter((m) => m !== moduleName)
      : [...selectedModules, moduleName];

    setSelectedModules(newSelected);

    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEY_SELECTED_MODULES,
      JSON.stringify(newSelected)
    );

    // If we're removing the active module, set the first remaining module as active
    if (isRemoving && moduleName === activeModule && newSelected.length > 0) {
      setActiveModule(newSelected[0]);
      localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, newSelected[0]);
    }

    // If we're adding a new module, don't change the active module
    // The active module stays the same
  };

  // Remove a specific module
  const removeModule = (moduleToRemove) => {
    const currentPath = getCurrentModulePath();
    const matchedModule = selectedModules.find(
      (module) => toUrlFriendlyName(module) === currentPath
    );
    if (matchedModule === moduleToRemove) {
      return; // Do nothing
    }
    const newSelected = selectedModules.filter((m) => m !== moduleToRemove);
    setSelectedModules(newSelected);

    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEY_SELECTED_MODULES,
      JSON.stringify(newSelected)
    );

    // If we're removing the active module, set the first remaining module as active
    if (moduleToRemove === activeModule && newSelected.length > 0) {
      setActiveModule(newSelected[0]);
      localStorage.setItem(STORAGE_KEY_ACTIVE_MODULE, newSelected[0]);
    }
  };

  // Clear module selection
  const clearModuleSelection = () => {
    const currentPath = getCurrentModulePath();
    const matchedModule = selectedModules.find(
      (module) => toUrlFriendlyName(module) === currentPath
    );

    setSelectedModules([matchedModule]);
    localStorage.setItem(
      STORAGE_KEY_SELECTED_MODULES,
      JSON.stringify([matchedModule])
    );
    // localStorage.removeItem(STORAGE_KEY_ACTIVE_MODULE);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    setSearchTerm("");
  }, [location]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getFinancialYear = async () => {
    const storedData = localStorage.getItem("financialYearData");

    if (storedData && isMounted.current) {
      const parsedData = JSON.parse(storedData);
      const lastEntry = parsedData[parsedData.length - 1];

      setSelectedFinancialYearValue(lastEntry.financial_year_value);
      setSelectedFinancialYearId(lastEntry.id);
      setFinancialYear([...parsedData].reverse());
    } else {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );

      if (isSuccess && isMounted.current) {
        localStorage.setItem("financialYearData", JSON.stringify(data.data));

        const lastEntry = data.data[data.data.length - 1];
        setSelectedFinancialYearValue(lastEntry.financial_year_value);
        setSelectedFinancialYearId(lastEntry.id);
        setFinancialYear(data.data.reverse());
      }
    }
  };

  const toUrlFriendlyName = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  useEffect(() => {
    getFinancialYear();
    getFramework();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (action) => {
    if (action === "reassign") {
      setShowReassignModal(true);
    } else if (action === 'request-due-date-override') {
      setShowRequestDueDateApprovalModal(true);
    } else {
      setShowAssignModal(true);
      setActionType(action);
    }
  };

  useEffect(() => {
    if (frameworks.length > 0) {
      const allIds = frameworks.map((f) => f.id);
      setSelectedFrameworks(allIds);
    }
  }, [frameworks]);

  const handleAssignClose = () => setShowAssignModal(false);
  const handleReassignClose = () => setShowReassignModal(false);
  const handleRequestDueDateApprovalModalClose = () => setShowRequestDueDateApprovalModal(false);

  // Check if the current path is for a specific module
  const getCurrentModulePath = () => {
    const path = location.pathname;
    const parts = path.split("/");
    // Get the last part of the URL path
    return parts[parts.length - 1];
  };

  const currentModulePath = getCurrentModulePath();

  return (
    <div className="position-relative">
      {/* Main container - matching exact design */}
      <div className="bg-white py-3 px-4" style={{ borderRadius: "8px" }}>
        <Container fluid>
          <Row className="align-items-center">
            {/* Left side */}
            <Col
              xs={12}
              lg={6}
              className="d-flex align-items-center gap-3 mb-3 mb-lg-0"
            >
              {menu !== "audit" && (
                <div style={{ minWidth: "140px" }}>
                  <Form.Label
                    className="m-0 mb-1"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Financial Year
                  </Form.Label>
                  <Form.Select
                    style={{
                      height: "37px",
                      fontSize: "14px",
                    }}
                    onChange={(e) => {
                      const selectedOption = financialYear.find(
                        (yeardata) => yeardata.id === parseInt(e.target.value)
                      );
                      if (selectedOption) {
                        setSelectedFinancialYearId(selectedOption.id);
                        setSelectedFinancialYearValue(
                          selectedOption.financial_year_value
                        );
                      }
                    }}
                  >
                    {financialYear.map((yeardata) => (
                      <option key={yeardata.id} value={yeardata.id}>
                        {yeardata.financial_year_value}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              )}

              <div style={{ minWidth: "200px" }}>
                <Form.Label
                  className="m-0 mb-1"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  Frameworks
                </Form.Label>
                <Dropdown
                  show={isFrameworkDropdownOpen}
                  onToggle={(isOpen) => setIsFrameworkDropdownOpen(isOpen)}
                >
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    className="d-flex align-items-center justify-content-between w-100"
                    style={{
                      height: "37px",
                      fontSize: "14px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      backgroundColor: "transparent",
                    }}
                    as="div"
                    onClick={() =>
                      setIsFrameworkDropdownOpen(!isFrameworkDropdownOpen)
                    }
                  >
                    <style>
                      {`
                        .dropdown-toggle::after {
                          display: none !important;
                        }
                      `}
                    </style>
                    <span className="me-auto" style={{ marginLeft: "10px" }}>
                      {selectedFrameworks.length > 0
                        ? `${selectedFrameworks.length} Frameworks Selected`
                        : "Select Frameworks"}
                    </span>
                    <span className="ms-2" style={{ marginRight: "10px" }}>
                      ▼
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      minWidth: "250px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFrameworks([]);
                        }}
                        disabled={selectedFrameworks.length === 0}
                        style={{ fontSize: "13px", color: "#3F88A5" }}
                      >
                        Clear Selection
                      </Button>

                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => setIsFrameworkDropdownOpen(false)}
                        style={{ fontSize: "13px", color: "#6c757d" }}
                      >
                        Close
                      </Button>
                    </div>

                    {/* All Frameworks Option */}
                    <div
                      className="dropdown-item-custom"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const allFrameworkIds = frameworks.map((f) => f.id);
                        if (selectedFrameworks.length === frameworks.length) {
                          setSelectedFrameworks([]);
                        } else {
                          setSelectedFrameworks(allFrameworkIds);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFrameworks.length === frameworks.length
                        }
                        onChange={() => {}}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span>Select All Frameworks</span>
                    </div>

                    {/* Individual framework options */}
                    {frameworks.map((framework) => {
                      const isChecked = selectedFrameworks.includes(
                        framework.id
                      );
                      return (
                        <div
                          key={framework.id}
                          className="dropdown-item-custom"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "8px 16px",
                            fontSize: "14px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = isChecked
                              ? selectedFrameworks.filter(
                                  (id) => id !== framework.id
                                )
                              : [...selectedFrameworks, framework.id];
                            setSelectedFrameworks(updated);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>{framework.title}</span>
                        </div>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {menu !== "audit" && (
                <div style={{ minWidth: "200px" }}>
                  <Form.Label
                    className="m-0 mb-1"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Modules
                  </Form.Label>
                  <Dropdown
                    show={isModuleDropdownOpen}
                    onToggle={(isOpen) => setIsModuleDropdownOpen(isOpen)}
                  >
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      className="d-flex align-items-center justify-content-between w-100"
                      style={{
                        height: "37px",
                        fontSize: "14px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        backgroundColor: "transparent",
                      }}
                      as="div"
                    >
                      <style>
                        {`
          .dropdown-toggle::after {
            display: none !important;
          }
        `}
                      </style>
                      <span className="me-auto" style={{ marginLeft: "10px" }}>
                        {selectedModules.length > 0
                          ? `${selectedModules.length} Modules Selected`
                          : "Select Modules"}
                      </span>
                      <span className="ms-2" style={{ marginRight: "10px" }}>
                        ▼
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        minWidth: "250px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearModuleSelection();
                          }}
                          disabled={selectedModules.length === 0}
                          style={{ fontSize: "13px", color: "#3F88A5" }}
                        >
                          Clear Selection
                        </Button>

                        {/* Close button */}
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => setIsModuleDropdownOpen(false)}
                          style={{ fontSize: "13px", color: "#6c757d" }}
                        >
                          Close
                        </Button>
                      </div>

                      {modules.map((module) => (
                        <div
                          key={module.name}
                          className="dropdown-item-custom"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "8px 16px",
                            fontSize: "14px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // We're using your existing handleModuleSelect function
                            if (typeof handleModuleSelect === "function") {
                              handleModuleSelect(module.name);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(module.name)}
                            onClick={(e) => {
                              // This prevents the checkbox from toggling twice
                              e.stopPropagation();
                            }}
                            onChange={(e) => {
                              // Prevent event bubbling to keep dropdown open
                              e.stopPropagation();
                              // Call the original handler directly on checkbox change
                              if (typeof handleModuleSelect === "function") {
                                handleModuleSelect(module.name);
                              }
                            }}
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>{module.name}</span>
                          <span
                            style={{
                              marginLeft: "auto",
                              color: "#6c757d",
                              fontSize: "12px",
                            }}
                          >
                            ({module.count})
                          </span>
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </Col>

            {/* Right side */}
            <Col
              xs={12}
              lg={6}
              className="d-flex align-items-center justify-content-lg-end gap-3"
            >
              <div className="flex-grow-1" style={{ maxWidth: "400px" }}>
                <InputGroup style={{ height: "37px" }}>
                  <InputGroup.Text
                    id="basic-addon1"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #ced4da",
                      borderRight: "none",
                    }}
                  >
                    <FaSearch style={{ color: "#6c757d" }} />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search Questions"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-describedby="basic-addon1"
                    style={{
                      border: "1px solid #ced4da",
                      borderLeft: "none",
                      fontSize: "14px",
                    }}
                  />
                </InputGroup>
              </div>
              {menu !== "audit" && (
                <div className="relative inline-block" ref={dropdownRef}>
                  <button
                    style={{
                      backgroundColor: "#3F88A5",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      height: "37px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Action
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 2px)",
                        right: 0,
                        width: "200px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        border: "1px solid rgb(63, 136, 165)",
                        zIndex: 100,
                        overflow: "hidden",
                      }}
                    >
                      <Button
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 15px",
                          borderBottom: "1px solid rgb(63, 136, 165)",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#333",
                          transition: "background-color 0.2s ease",
                          borderBottomRightRadius: "0", // Correct syntax
                          borderBottomLeftRadius: "0",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onClick={() => handleOptionClick("assign")}
                      >
                        Assign Question
                      </Button>

                      <Button
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 15px",
                          borderBottom: "1px solid rgb(63, 136, 165)",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#333",
                          transition: "background-color 0.2s ease",
                          borderBottomRightRadius: "0", // Correct syntax
                          borderBottomLeftRadius: "0",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onClick={() => handleOptionClick("reassign")}
                      >
                        Re-Assign Question
                      </Button>

                      <Button
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 15px",
                          borderBottom: "1px solid rgb(63, 136, 165)",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#333",
                          transition: "background-color 0.2s ease",
                          borderBottomRightRadius: "0", // Correct syntax
                          borderBottomLeftRadius: "0",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onClick={() => handleOptionClick("request-due-date-override")}
                      >
                        Request Due Date Override
                      </Button>

                      <Button
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 15px",
                          background: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#333",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onClick={() => handleOptionClick("reminder")}
                      >
                        Send Email Reminder
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {menu === "audit" ? 
                <></> : 
                <ExcelUploader 
                  financialYearId = {financeObjct} 
                  financialYear={financialYear} 
                  dueDateOverrides={dueDateOverrides}
                  reportingQuestionsMap={reportingQuestionsMap}
                />
              }
            </Col>
          </Row>
        </Container>
      </div>

      {/* Selected modules display */}
      {menu !== "audit" && selectedModules.length > 0 && (
        <div
          className="py-3 px-4"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            marginTop: "15px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedModules.map((moduleName, index) => {
              const urlFriendlyName = toUrlFriendlyName(moduleName);
              const isActive = currentModulePath === urlFriendlyName;

              return (
                <NavLink
                  key={index}
                  to={{
                    pathname: `/reporting-modules/${urlFriendlyName}`,
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      borderRadius: "19px",
                      padding: "5px 15px",
                      height: "38px",
                      fontSize: "14px",
                      backgroundColor: isActive ? "rgb(63, 136, 165)" : "white",
                      borderColor: isActive ? "rgb(63, 136, 165)" : "#ced4da",
                      color: isActive ? "white" : "#495057",
                      border: `1px solid ${
                        isActive ? "rgb(63, 136, 165)" : "#ced4da"
                      }`,
                      display: "inline-flex",
                      position: "relative",
                    }}
                  >
                    {moduleName}
                    <div
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        e.stopPropagation(); // Stop click from bubbling to NavLink
                        removeModule(moduleName);
                      }}
                      style={{
                        marginLeft: "8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? "rgba(255, 255, 255, 0.3)"
                          : "#6c757d",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <FaTimes
                        style={{
                          color: "white",
                          fontSize: "12px",
                        }}
                      />
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      <AssignQuestionModal
        handleAssignedDetails={handleAssignedDetails}
        questionIds={questionIds}
        financeObjct={financeObjct}
        managementListValue={managementListValue}
        data={data}
        moduleName={moduleName}
        moduleData={moduleData}
        showAssignModal={showAssignModal}
        handleAssignClose={handleAssignClose}
        actionType={actionType}
        selectedQuestions={selectedQuestions}
        groupedByModuleName={groupedByModuleName}
      />
      <ReassignQuestionModal
        handleAssignedDetails={handleAssignedDetails}
        moduleData={moduleData}
        questionIds={questionIds}
        financeObjct={financeObjct}
        managementListValue={managementListValue}
        moduleName={moduleName}
        showReassignModal={showReassignModal}
        handleReassignClose={handleReassignClose}
      />
      <RequestDueDateOverride 
        financialYearId = {financeObjct} 
        financialYear={financialYear}
        selectedQuestions={selectedQuestions}
        showRequestDueDateApprovalModal={showRequestDueDateApprovalModal}
        handleRequestDueDateApprovalModalClose={handleRequestDueDateApprovalModalClose}
      />
    </div>
  );
};

export default TwoButtonComponent;
