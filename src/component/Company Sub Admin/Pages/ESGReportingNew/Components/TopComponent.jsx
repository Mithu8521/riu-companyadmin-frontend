import React from "react";
import { apiCall } from "../../../../../_services/apiCall";
import config from "../../../../../config/config.json";
import FrameworkModal from "./FrameworkModal";
import './DropdownStyles.css'
import { useState, useEffect } from "react";

const TopComponent = (
  {
    selectedFrameworks, setSelectedFrameworks,
    financialYear,
    frameworkValue,
    setFinancialYear,
    financialYearId,
    setFinancialYearId,
    handleFinancialYearChange,
    setFrameworkValue,
    selectedFramework,
    setSelectedFramework,
    onSelectFrameworkHandler
  }
) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableFrameworks, setAvailableFrameworks] = useState([]);

  const handleSelectFramework = (framework) => {
    const updatedFrameworks = [...selectedFrameworks, framework];
    setSelectedFrameworks(updatedFrameworks);
    setSelectedFramework(updatedFrameworks);
    setFrameworkValue((prevFrameworks) => [...prevFrameworks, framework]);
    onSelectFrameworkHandler(updatedFrameworks);
    setIsModalOpen(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Filter available frameworks by excluding selected ones
    const updatedAvailableFrameworks = frameworkValue?.filter(framework =>
      !selectedFramework.some(selected => selected.id === framework.id)
    );
    setAvailableFrameworks(updatedAvailableFrameworks);
  }, [selectedFramework, frameworkValue]);

  const handleAddFramework = () => {
    setIsModalOpen(true);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "transparent", paddingTop: "1.5%" }}>
      <div style={{ flex: 1 }}>
        <h2 style={{
          color: "#011627",

          fontFamily: "Open Sans",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "normal",
          marginBottom: "4.5%"
        }}>Subscribed Frameworks</h2>
      </div>
      <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "space-between" }}>
        <div className="dropdown-container">
          {financialYear && financialYear?.length === 1 ? (
            <select
              name="tab_name"
              onChange={handleFinancialYearChange}
              className="custom-dropdown"
            >
              {financialYear?.map((item, key) => (
                <option key={key} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          ) : (
            <select
              name="tab_name"
              value={
                financialYearId ||
                (financialYear?.length > 0
                  ? financialYear[financialYear.length - 1].id
                  : "")
              }
              onChange={handleFinancialYearChange}
              className="custom-dropdown"
            >
              <option>Select Financial Year</option>
              {financialYear?.map((item, key) => (
                <option key={key} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          )}
          <i className="dropdown-icon" style={{ color: "#3f88a5" }}>
            <svg width="19" height="10" viewBox="0 0 19 10" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
              <path id="Vector" stroke="currentcolor" d="M8.73823 9.70349C9.0194 9.95308 9.33455 10 9.50032 10C9.68532 10 9.97862 9.9545 10.2614 9.70349L18.7262 1.54155C19.1137 1.16804 19.0866 0.58669 18.666 0.242975C18.245 -0.100919 17.5903 -0.0759709 17.2033 0.296641L9.5 7.72292L1.79695 0.296641C1.40913 -0.0770478 0.754206 -0.10074 0.334037 0.242975C-0.0865365 0.58669 -0.113631 1.16804 0.27358 1.54155L8.73823 9.70349Z" fill="#currentcolor" />
            </svg>

          </i> {/* Icon inside the dropdown */}
        </div>
        <div>
          <button className="add-framework-button" onClick={handleAddFramework}>
            <span style={{ fontSize: "14px" }} className="mr-1 ms-0" >+</span> ADD FRAMEWORK
          </button>
          {isModalOpen && (
            <FrameworkModal
              frameworks={availableFrameworks}
              onSelectFramework={handleSelectFramework}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopComponent;
