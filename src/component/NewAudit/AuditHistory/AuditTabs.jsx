import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import QualitativeQuestionType from "../../Company Sub Admin/Component/Sector Questions/QualitativeQuestionType";
import QuantitativeTrendsType from "../../Company Sub Admin/Component/Sector Questions/QuantitativeTrendsType";
import "./AuditTabs.css"; // We'll define some CSS later
import QualitativeAnswer from "./QualitativeAnswer";
import { TabularAnswer } from "./TabularAnswer";
import YesNoAnswer from "./YesNoAnswer";
import NoDataFound from "../../../img/no.png";
import Loader from "../../loader/Loader";

const AuditTabs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("accepted");
  const [auditData, setAuditData] = useState([]);
  const [financialYearId, setFinancialYearId] = useState();
  const [selectedYear, setSelectedYear] = useState("");
  const [financialYear, setFinancialYear] = useState([]);
  const [selectedUser, setSelectedUser] = useState([
    { value: "ALL", label: "All" },
  ]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState([
    { value: "ALL", label: "All" },
  ]);
  const [userData, setUserData] = useState([]);
  const [auditorIds, setAuditorIds] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [item, setItem] = useState();
  const [audiitItem, setAudiitItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [auditShow, setAuditShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setAuditShow(false);
  };
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);  
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);
  const [frameworks, setFrameworks] = useState([]);
  const isMounted = useRef(true);
  const [frequency, setFrequency] = useState(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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
  useEffect(() => { 
    getFramework();
  }, []);
  const [filteredAuditData, setFilteredAuditData] = useState([]);

  const periodOptions = {
    HALF_YEARLY: [
      { value: "ALL", label: "All" },
      { value: "H1", label: "H1" },
      { value: "H2", label: "H2" },
      { value: "ONE_TIME", label: "ONE TIME" },
      { value: "EVERY_FY", label: "EVERY FINANCIAL YEAR" },
    ],
    QUARTERLY: [
      { value: "ALL", label: "All" },
      { value: "Q1", label: "Q1" },
      { value: "Q2", label: "Q2" },
      { value: "Q3", label: "Q3" },
      { value: "Q4", label: "Q4" },
      { value: "ONE_TIME", label: "ONE TIME" },
      { value: "EVERY_FY", label: "EVERY FINANCIAL YEAR" },
    ],
    MONTHLY: [
      { value: "ALL", label: "All" },
      { value: "ONE_TIME", label: "ONE TIME" },
      { value: "EVERY_FY", label: "EVERY FINANCIAL YEAR" },
      ...Array.from({ length: 12 }, (_, i) => ({
        value: `M${i + 1}`,
        label: `M${i + 1}`,
      })),
    ],
    YEARLY: [
      { value: "ALL", label: "All" },
      { value: "Y1", label: "Y1" },
      { value: "ONE_TIME", label: "ONE TIME" },
      { value: "EVERY_FY", label: "EVERY FINANCIAL YEAR" },
    ],
  };

  const getFrequency = async (fid) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: fid },
      "GET"
    );
    if (isSuccess) {
      setFrequency(data.data);
    }
  };

  const getAllUser = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAllUser`,
      {},
      {},
      "GET"
    );
    if (isSuccess && isMounted.current) {
      const formattedData = [
        { value: "ALL", label: "All" }, // Add the "All" option
        ...data.data.map((user) => ({
          value: user.id,
          label: user.first_name,
        })),
      ];
      setUserData(formattedData);
    }
  };

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  };

  const handlePeriodChange = (selectedOption) => {
    setSelectedPeriod(selectedOption);
    const year = parseInt(selectedYear.split("-")[0]);
    const { value } = selectedOption;

    if (value === "ALL") {
      setFilteredAuditData(auditData);
    } else {
      const filteredData = auditData.filter((audit) => {
        if (!selectedOption || !selectedOption.value) return false;

        let dateRange = null;

        if (value.startsWith("H")) {
          const halfYear = value === "H1" ? 1 : 2;
          dateRange = calculateDateRange(
            6,
            halfYear,
            currentUser.starting_month,
            year
          );
        } else if (value.startsWith("Q")) {
          const quarter = parseInt(value.replace("Q", ""));
          dateRange = calculateDateRange(
            3,
            quarter,
            currentUser.starting_month,
            year
          );
        } else if (value.startsWith("M")) {
          const month = parseInt(value.replace("M", ""));
          dateRange = calculateDateRange(
            1,
            month,
            currentUser.starting_month,
            year
          );
        } else if (value === "ONE_TIME" || value === "EVERY_FY") {
          return audit.matchingAuditors[0].auditDetail.some(
            (detail) => detail.frequency === value
          );
        }
        return dateRange && audit.matchingAuditors
          ? audit.matchingAuditors.some(
              (detail) => detail.fromDate === dateRange.fromDate
            )
          : false;
      });
      setFilteredAuditData(filteredData);
    }
  };

  const handleUserChange = async (selectedOption) => {
    const selectedValue = selectedOption.value;

    const selectedUser = userData.find((user) => user.value === selectedValue);

    setSelectedUser(selectedOption);
    setSelectedUserId(selectedUser?.value || "");
    if (selectedValue === "ALL") {
      setFilteredAuditData(auditData);
    } else {
      const filteredData = auditData.map((item) => {
        item.matchingAuditors = item?.matchingAuditors.map((auditor) => ({
          ...auditor,
          auditDetail: auditor.auditDetail.filter((r) => {
            const auditorId = r.id; // Extract the auditor ID
            const isMatchingUserId =
              Number(auditorId) === Number(selectedValue);
            return isMatchingUserId && auditorId > 0; // Only include matching auditor IDs
          }),
        }));
        return item; // Return the filtered item
      });

      // Set the filtered data
      setFilteredAuditData(filteredData);
    }
  };

  const handleYearChange = async (e) => {
    const selectedValue = e.target.value;
    const selectedOption = financialYear.find(
      (year) => year.financial_year_value === selectedValue
    );
    setSelectedYear(selectedValue);
    getFrequency(selectedOption?.id);
    setFinancialYearId(selectedOption?.id || "");
    let status;
    switch (activeTab) {
      case "accepted":
        status = "ACCEPTED";
        break;
      case "rejected":
        status = "REJECTED";
        break;
      case "reassigned":
        status = "REASSIGNED";
        break;
      default:
        status = "ACCEPTED";
    }

    getAuditHistory(selectedOption?.id, status);
  };

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem("financialYearData");

    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYear(parsedData);
      const lastEntry = parsedData[parsedData.length - 1];
      setSelectedYear(lastEntry.financial_year_value);
      getFrequency(lastEntry.id);
      setFinancialYearId(lastEntry.id);
      getAuditHistory(lastEntry.id, "ACCEPTED");
      return lastEntry.id;
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {},
        "GET"
      );

      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem("financialYearData", JSON.stringify(data.data));

        // Set state with the API response
        setFinancialYear(data.data);
        const lastEntry = data.data[data.data.length - 1];
        setSelectedYear(lastEntry.financial_year_value);
        getFrequency(lastEntry.id);
        setFinancialYearId(lastEntry.id);
        getAuditHistory(lastEntry.id, "ACCEPTED");
        return lastEntry.id;
      }
    }
  };

  useEffect(() => {
    if (selectedFrameworks.length > 0) {
      auditData.forEach((item) => { 
        item.matchingAuditors = item?.matchingAuditors.map((auditor) => ({
          ...auditor,
          auditDetail: auditor.auditDetail.filter((r) => {
          return selectedFrameworks.includes(r.frameworkId);
          }),
        }));
      });
      setFilteredAuditData(auditData);
    }
  }, [selectedFrameworks]);

  useEffect(() => {
    getFinancialYear();
    getAllUser();
  }, []);

  const getAuditHistory = async (year, status) => {
    setLoading(true);
    const financialYear = year;
    const { isSuccess, error, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAuditHistory`,
      {},
      {
        status: status,
        financialYearId: financialYear,
      },
      "GET"
    );
    setLoading(false);
    if (isSuccess) {
      const auditorIds = []; // Variable defined in the function scope to store IDs

      const tmpData = location.state?.reportingQuestion.length
        ? data?.data.filter((item) => {
            const isQuestionIncluded =
              location.state?.reportingQuestion.includes(
                item?.question?.questionId
              );

            if (isQuestionIncluded) {
              item.matchingAuditors = item?.matchingAuditors.map((auditor) => ({
                ...auditor,
                auditDetail: auditor.auditDetail.filter((r) => {
                  const auditorId = r.id; // Extract ID
                  auditorIds.push(auditorId); // Add ID to the temporary array
                  // const isMatchingUserId =
                  //   Number(auditorId) === Number(location.state?.userId);
                  // return isMatchingUserId && auditorId > 0;
                  return true;

                }),
              }));
              return true;
            }
            return false;
          })
        : data?.data.map((item) => {
            // When reportingQuestion is empty, still collect auditorIds
            item.matchingAuditors = item?.matchingAuditors.map((auditor) => ({
              ...auditor,
              auditDetail: auditor.auditDetail.filter((r) => {
                const auditorId = r.id; // Extract ID
                auditorIds.push(auditorId); // Add ID to the temporary array
                return auditorId > 0; // Always include if auditorId is valid
              }),
            }));
            return item; // Include the item when reportingQuestion is empty
          });
      auditorIds.push("ALL");
      const filteredUserData = userData.filter((user) =>
        auditorIds.includes(user.value)
      );

      setUserData(filteredUserData);

      if (isMounted.current) {
        setAuditData(tmpData);
        setFilteredAuditData(tmpData);
      }

      return tmpData;
    }

    if (error) {
      console.error("Error fetching audit history", error);
    }
  };

  useEffect(() => {
    let status;
    switch (activeTab) {
      case "accepted":
        status = "ACCEPTED";
        break;
      case "rejected":
        status = "REJECTED";
        break;
      case "reassigned":
        status = "REASSIGNED";
        break;
      default:
        status = "ACCEPTED";
    }
    if (financialYearId) {
      let data = getAuditHistory(financialYearId, status);
    }
  }, [activeTab, financialYearId, location.state?.reportingQuestion]);

  useEffect(() => {
    if (frameworks.length > 0) {
      const allIds = frameworks.map((f) => f.id);
      setSelectedFrameworks(allIds);
    }
  }, [frameworks]);

  const renderTableData = () => {
    if (!filteredAuditData || filteredAuditData.length === 0) {
      return loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      ) : (
        <div className="hstack justify-content-center">
          <img src={NoDataFound} alt="" />
        </div>
      );
    }

    const handleViewClick = (item) => {
      setItem(item);

      setShow(true);
    };
    const handleViewRemarkClick = (item) => {
      setAudiitItem(item);

      setAuditShow(true);
    };
    let rowIndex = 0;

    return filteredAuditData.flatMap(
      (item) =>
        item.matchingAuditors?.flatMap(
          (auditor) =>
            auditor.auditDetail?.map((detail) => (
              <div key={`${item.id}-${rowIndex}`} className="question-card">
                <div className="question-row">
                  {/* Title Section (60%) */}
                  <div className="question-title">
                    <span className="question-index">{++rowIndex}. </span>
                    <span className="question-text">
                      {item?.title ?? "No Title"}
                    </span>
                  </div>

                  {/* Auditor Section (20%) */}
                  <div className="auditor-info">
                    {detail?.first_name ?? "N/A"} -{" "}
                    {detail?.auditedDate
                      ? new Date(detail.auditedDate).toLocaleDateString()
                      : "No Date"}
                  </div>

                  {/* Icons Section (10%) */}
                  <div className="question-actions">
                    <button
                      className="comment-button"
                      onClick={() => handleViewRemarkClick(detail?.remark)}
                      title="Auditor Remark"
                    >
                      <i className="fa fa-comment"></i>
                    </button>
                    <button
                      className="view-button"
                      onClick={() => handleViewClick(item)}
                      title="View Answer"
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            )) ?? []
        ) ?? []
    );
  };

  useEffect(() => {
    if (filteredAuditData) {
      renderTableData();
    }
  }, [filteredAuditData]);

  const renderQuestionType = (item) => {
    switch (item?.question.questionType) {
      case "qualitative":
        return (
          <QualitativeAnswer
            item={item}
            answer={item?.matchingAuditors[0]?.auditDetail[0]?.answer.answer}
          />
        );
      case "tabular_question":
        return <TabularAnswer item={item} />;
      case "quantitative":
        return (
          <QualitativeQuestionType
            note={item?.note}
            title={item?.title}
            answer={item.matchingAuditors[0].auditDetail[0].answer}
          />
        );
      case "yes_no":
        return <YesNoAnswer item={item} />;
      case "quantitative_trends":
        return (
          <QuantitativeTrendsType
            item={item}
            note={item?.note}
            title={item.title}
            answer={item.matchingAuditors[0].auditDetail[0].answer}
          />
        );
      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
       <div style={{ minWidth: "200px" }}>
             
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
                      backgroundColor: "#ffffff",
                    }}
                    as="div"
                    onClick={() => setIsFrameworkDropdownOpen(!isFrameworkDropdownOpen)}
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
      checked={selectedFrameworks.length === frameworks.length}
      onChange={() => {}}
      style={{ width: "16px", height: "16px" }}
    />
    <span>Select All Frameworks</span>
  </div>

  {/* Individual framework options */}
  {frameworks.map((framework) => {
    const isChecked = selectedFrameworks.includes(framework.id);
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
            ? selectedFrameworks.filter((id) => id !== framework.id)
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
        {/* Accepted Tab */}
        <div style={{ width: "15%" }}>
          <button
            style={{
              backgroundColor: activeTab === "accepted" ? "#5b9bd5" : "#f8f9fa",
              color: activeTab === "accepted" ? "white" : "inherit",
              border: `1px solid ${
                activeTab === "accepted" ? "#4a8bc2" : "#dee2e6"
              }`,
              borderRadius: "4px",
              padding: "8px 15px",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
              height: "38px",
            }}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted
          </button>
        </div>

        {/* Rejected Tab */}
        <div style={{ width: "15%" }}>
          <button
            style={{
              backgroundColor: activeTab === "rejected" ? "#5b9bd5" : "#f8f9fa",
              color: activeTab === "rejected" ? "white" : "inherit",
              border: `1px solid ${
                activeTab === "rejected" ? "#4a8bc2" : "#dee2e6"
              }`,
              borderRadius: "4px",
              padding: "8px 15px",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
              height: "38px",
            }}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>

        {/* Financial Year Dropdown */}
        <div style={{ width: "15%" }}>
          <Form.Select
            onChange={handleYearChange}
            value={selectedYear}
            style={{
              height: "38px",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
              padding: ".375rem .75rem",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {financialYear.map((year) => (
              <option key={year.id} value={year.financial_year_value}>
                FY - {year.financial_year_value}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Period Selector - with consistent styling */}
        <div style={{ width: "15%" }}>
          {frequency && (
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              options={periodOptions[frequency] || []}
              placeholder={`Select ${
                frequency === "YEARLY" ? "Period" : "Periods"
              }`}
              styles={{
                control: (base) => ({
                  ...base,
                  height: "38px",
                  minHeight: "38px",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "38px",
                }),
              }}
            />
          )}
        </div>
      </div>
      {/* <div className="tabs-audit" style={{ width: "100%" }}>
        <div style={{ width: "15%" }}>
          <button
            className={activeTab === "accepted" ? "active" : ""}
            onClick={() => setActiveTab("accepted")}
            style={{ width: "100%" }}
          >
            Accepted
          </button>
        </div>
        <div style={{ width: "15%" }}>
          <button
            style={{ width: "100%" }}
            className={activeTab === "rejected" ? "active" : ""}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>

        <div style={{ width: "25%" }}>
          <Form.Group
            as={Row}
            style={{ width: "100%" }}
            controlId="financialYearSelect"
            className="ml-2"
          >
            <Col sm="auto">
              <Form.Select
                className=""
                onChange={handleYearChange}
                value={selectedYear}
                style={{ padding: ".375rem 2.25rem .375rem .75rem" }}
              >
                {financialYear.map((year) => (
                  <option key={year.id} value={year.financial_year_value}>
                    FY - {"           "}
                    {year.financial_year_value}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </div>

        <div style={{ width: "30%" }}>
          <div
            className="color_rent mb-0"
            style={{ width: "100%", padding: "0px" }}
          >
            {frequency === "HALF_YEARLY" && (
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={periodOptions[frequency] || []}
                placeholder="Select Periods"
                className=""
                styles={{
                  control: (base) => ({
                    ...base,
                    width: "100%",
                    paddingLeft: "5px",
                    paddingRight: "00px",
                  }),
                }}
              />
            )}
            {frequency === "QUARTERLY" && (
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={periodOptions[frequency] || []}
                placeholder="Select Periods"
                className="esg_text2"
                styles={{
                  control: (base) => ({
                    ...base,
                    paddingLeft: "5px",
                    paddingRight: "0px",
                  }),
                }}
              />
            )}
            {frequency === "MONTHLY" && (
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={periodOptions[frequency] || []}
                placeholder="Select Periods"
                className="esg_text2"
                styles={{
                  control: (base) => ({
                    ...base,
                    paddingLeft: "5px",
                    paddingRight: "0px",
                  }),
                }}
              />
            )}
            {frequency === "YEARLY" && (
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                options={periodOptions[frequency] || []}
                placeholder="Periods"
                className="esg_text2"
                styles={{
                  control: (base) => ({
                    ...base,
                    paddingLeft: "5px",
                    paddingRight: "0px",
                  }),
                }}
              />
            )}
          </div>
        </div>
      </div> */}
      <div
        className="table-container"
        style={{ borderColor: "white", maxHeight: "80vh", height: "80vh" }}
      >
        <table>
          <tbody>{renderTableData()}</tbody>
        </table>

        <Modal
          size="lg"
          show={auditShow}
          onHide={handleClose}
          style={{ height: "115vh" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Auditor Remark</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              border: "2px solid rgb(105 179 203)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            {audiitItem ? <p>{audiitItem}</p> : <p>No Auditor Remark.</p>}
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          show={show}
          onHide={handleClose}
          style={{ height: "115vh" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Answer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              border: "2px solid rgb(105 179 203)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            {item ? renderQuestionType(item) : <p>No details available.</p>}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AuditTabs;
