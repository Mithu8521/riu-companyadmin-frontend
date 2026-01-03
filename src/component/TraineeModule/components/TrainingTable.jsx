import { faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Table, Tabs } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import NoDataFound from "../../../img/no.png";
import AddTrainee from "./AddTrainee";
import TrainingModal from "./TrainingModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import UploadRegistrationExcel from "./UploadRegistrationExcel";
import UploadTrainingAssignmentExcel from "./UploadTrainingAssignmentExcel";
import RemoveUsersExcel from "./RemoveUsersExcel";
import { NavLink } from "react-router-dom";
import RemoveUsersFromTrainingExcel from "./RemoveUsersFromTrainingExcel";
import { getStartingMonth } from "../../../utils/PeriodCalculationUtils";

const TrainingTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filterTrainings, setfilterTrainings] = useState([]);
  const [traineeList, setTraineeList] = useState([]);
  const [actionId, setActionId] = useState(null);
  const [mode, setMode] = useState(null);
  const [actionModalShow, setActionModalShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAddTraineeModal, setShowAddTraineeModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUserData, setShowUserData] = useState(false);
  const [showTraineeData, setShowTraineeData] = useState(false);
  const [currentTrainingName, setCurrentTrainingName] = useState("");
  let isHead =
    JSON.parse(localStorage.getItem("currentUser") || "{}").is_head || false;
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(0);
  const [key, setKey] = useState("register"); // Default active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserDataUploaded, setIsUserDataUploaded] = useState(false);
  const [isTraineeDataUploaded, setIsTraineeDataUploaded] = useState(false);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [trainingTopicData, setTrainingTopicData] = useState([]);
  const [financialYearDatas, setFinancialYearDatas] = useState([]);
  const [isModalParticipatsOpen, setIModalParticipatsOpen] = useState(false);
  const [isModalRemoveUserOpen, setIsModalRemoveUserOpen] = useState(false);
  const [isModalRemoveUserFromTrainingOpen, setIsModalRemoveUserFromTrainingOpen] = useState(false);
  const openParticipatsModal = () => setIModalParticipatsOpen(true);
  const openRemoveUserModal = () => setIsModalRemoveUserOpen(true);
  const openRemoveUserFromTrainingModal = () => setIsModalRemoveUserFromTrainingOpen(true);
  const closeParticipatsModal = () => setIModalParticipatsOpen(false);
  const closeRemoveUserModal = () => setIsModalRemoveUserOpen(false);
  const closeRemoveUserFromTrainingModal = () => setIsModalRemoveUserFromTrainingOpen(false);
  const [filteredRegisteredUsers, setFilteredRegisteredUsers] = useState([]);
  const [filteredAttendedUsers, setFilteredAttendedUsers] = useState([]);
  const AudienceOptions = [
    { label: "Permanent Employee", value: "EMPLOYEES_PERMANENT" },
    { label: "Other than Permanent Employee", value: "EMPLOYEES_TEMPORARY" },
    { label: "Permanent Worker", value: "WORKERS_PERMANENT" },
    { label: "Other than Permanent Worker", value: "WORKERS_TEMPORARY" },
    { label: "KMP", value: "KMP" },
    { label: "BOD", value: "BOD" },
    { label: "Customer", value: "CUSTOMERS" },
    { label: "Supplier", value: "SUPPLIERS" },
    { label: "Distributor", value: "DISTRIBUTORS" },
  ];

  const handleActionClose = () => {
    setActionId(null);
    setActionModalShow(false);
    setShowAddTraineeModal(false);
  };

  const handleQRActionClose = () => {
    setActionId(null);
    setShowQRModal(false);
  };

  const getUserData = async (id) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTraineeUserData`,
      {},
      { id, financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate },
      "GET"
    );

    if (isSuccess) {
      setUsers(data?.data);
      setFilteredRegisteredUsers(data?.data?.registerUser);
      setFilteredAttendedUsers(data?.data?.attendenceUser);
    }
  };

  const getTrainingData = async (fId, status = 1) => {
    const yearId = fId || financialYearId;
    if (!yearId) return;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTrainingData`,
      {},
      { financialYearId: yearId, status },
      "GET"
    );

    if (isSuccess) {
      const tmpData = data?.data?.length ? data.data.reverse() : [];
      setTrainingData(tmpData);
      const formattedData = tmpData.map((item) => ({
        item,
        id: item.id,
        fromDate: new Date(item.fromDate).toLocaleDateString(),
        toDate: new Date(item.toDate).toLocaleDateString(),
        fromTime: item.fromTime,
        toTime: item.toTime,
        trainer: item?.trainers,
        title: item.trainingTitle,
        trainingLink: item.trainingLink,
        mode: item.modeOfTraining,
        mappingUser: item.userId,
        description: item.description,
        trainingFacilitator: item.trainingFacilitator,
      }));

      setTrainings(formattedData);
      setfilterTrainings(formattedData);
      getFinancialYearRange(yearId, financialYear)
    }
  };

  const handleActionAPI = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}deleteTrainingData`,
      {},
      { trainingId: actionId, status: mode === "Delete" ? 0 : 2 },
      "POST"
    );

    if (isSuccess) {
      handleActionClose();
      getTrainingData();
    }
  };

  const getFinancialYearRange = (fId, financialYearList) => {
    const yearId = fId || financialYearId;
    const startMonthIdx = getStartingMonth() - 1;

    // Find matching year object
    const finYearObj = Array.isArray(financialYearList)
      ? financialYearList.find((fy) => fy.id == yearId)
      : null;

    if (!finYearObj?.financial_year_value) {
      console.warn("⚠️ Financial year not found for id:", yearId);
      return; // stop here, don’t set NaN dates
    }

    const [startY, endY] = finYearObj.financial_year_value.split("-").map(Number);

    if (isNaN(startY) || isNaN(endY)) {
      console.error("⚠️ Invalid financial year value:", finYearObj.financial_year_value);
      return;
    }

    // startMonthIdx is 0-based (0 = Jan, 11 = Dec)
    const startMonth = startMonthIdx;
    const endMonth = (startMonth + 11) % 12;

    const fromDate = new Date(startY, startMonth, 1);
    const toDate = new Date(endY, endMonth + 1, 0);

    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    setFinancialYearDatas({
      startDate: formatDate(fromDate),
      endDate: formatDate(toDate),
    });
  };


  const handleSaveTrainee = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}addTraineeOrInviteTrainee`,
      {},
      {
        trainingId: actionId,
        traineeEmails: selectedEmails.map((item) => item.email),
      },
      "POST"
    );

    if (isSuccess) {
      handleActionClose();
    }
  };

  const handleDelete = (id) => {
    setActionId(id);
    setActionModalShow(true);
  };

  const handleCloseModal = () => {
    getTrainingData();
    setShowModal(false);
    setActionId(null);
    setEditData(null);
  };

  const handleEdit = (id, training) => {
    setShowModal(true);
    setActionId(id);
    setEditData(training.item);
  };

  const handleCopyLink = (link) => {
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setShowToast(true);
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
        });
    } else {
      alert("No link available to copy.");
    }
  };
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM/PM format
    return `${formattedHours}:${minutes < 10 ? "0" + minutes : minutes
      } ${period}`;
  };
  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem("financialYearData");

    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYear(parsedData);

      if (parsedData.length) {
        setFinancialYearId(parsedData[parsedData.length - 1].id);
        getTrainingData(parsedData[parsedData.length - 1].id);
      }
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

        // Set state with the API response
        setFinancialYear(data.data);

        if (data?.data?.length) {
          setFinancialYearId(data.data[data.data.length - 1].id);
          getTrainingData(data.data[data.data.length - 1].id);
        }
      }
    }
  };
  const handleTabSelect = (key) => {
    getTrainingData(financialYearId, key === "new" ? 1 : 2);
  };

  const formatUserDataForExcel = (users, type) => {
    return users.map((user, index) => ({
      "S.No": index + 1,
      Name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      Email: user.email || "",
      Mobile: user.mobile || "",
      "Employee ID": user.employeeId || "",
      Gender: user.gender || "",
      Category: user.categoryId || "",
      Department: user.departmentId || "",
      "Business Unit": user.businessUnit || "",
      Division: user.division || "",
    }));
  };

  const handleDownloadAll = () => {
    const registeredData = users.registerUser || [];
    const attendedData = users.attendenceUser || [];

    if (registeredData.length === 0 && attendedData.length === 0) {
      alert("No user data to download");
      return;
    }

    const wb = XLSX.utils.book_new();

    if (registeredData.length > 0) {
      const formattedRegistered = formatUserDataForExcel(
        registeredData,
        "Registered"
      );
      const wsRegistered = XLSX.utils.json_to_sheet(formattedRegistered);
      XLSX.utils.book_append_sheet(wb, wsRegistered, "Registered Users");
    }

    if (attendedData.length > 0) {
      const formattedAttended = formatUserDataForExcel(
        attendedData,
        "Attended"
      );
      const wsAttended = XLSX.utils.json_to_sheet(formattedAttended);
      XLSX.utils.book_append_sheet(wb, wsAttended, "Attended Users");
    }

    const filename = `${currentTrainingName || "Training"}_All_Users_${new Date().toISOString().split("T")[0]
      }.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const getTrainingTopicMapping = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTrainingTopicMapping`,
        {},
        {},
        "GET"
      );
      if (isSuccess) {
        setTrainingTopicData(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching training topic mapping:", error);
    }
  };

  const getAllRegisteredTrainee = async () => {
    if (financialYearDatas?.startDate && financialYearDatas?.endDate) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAllRegisteredTrainee`,
        {},
        { financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate },
        "GET"
      );

      if (isSuccess) {
        setTraineeList(data?.data);
        setFilteredTrainees(data?.data);
      }
    }

  };

  useEffect(() => {
    if (financialYearDatas) {
      getAllRegisteredTrainee(financialYearDatas);
    }
  }, [financialYearDatas]);


  useEffect(() => {
    getFinancialYear();
    getTrainingTopicMapping();
  }, []);

  useEffect(() => {
    getAllRegisteredTrainee(financialYearDatas);
  }, [isUserDataUploaded]);

  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search input changes
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    setfilterTrainings(
      trainings.filter(
        (item) =>
          (item?.title?.toLowerCase() || "").includes(query) ||
          (item?.fromDate?.toLowerCase() || "").includes(query) ||
          (item?.toDate?.toLowerCase() || "").includes(query) ||
          (item?.fromTime?.toLowerCase() || "").includes(query) ||
          (item?.toTime?.toLowerCase() || "").includes(query) ||
          (item?.trainer?.toString()?.toLowerCase() || "").includes(query) ||
          (item?.mode?.toLowerCase() || "").includes(query) ||
          (item?.description?.toLowerCase() || "").includes(query) ||
          (item?.trainingFacilitator?.toLowerCase() || "").includes(query)
      )
    );
  };

  useEffect(() => {
    getTrainingData();
    getAllRegisteredTrainee();
  }, [financialYearId]);
  const downloadTrainingExcel = () => {
    const processedData = trainingData.map((item) => {
      const topics = (item.trainingTopicID || [])
        .map((t) => trainingTopicData.find((topic) => topic.id === t))
        .filter(Boolean); // remove undefined if any ID doesn't match
      return {
        "Name Of Training": item.trainingTitle,
        Topic: topics.map((topic) => topic.topic).join(", "),
        KPI: topics.map((topic) => topic.principleHeading).join(", "),
        "Training Details": item.description,
        "Training Facilitator": item.trainingFacilitator,
        "Trainers Name": (item.trainers || []).map((t) => t.name).join(", "),
        "From Date": item.fromDate,
        "To Date": item.toDate,
        "From Time": item.fromTime,
        "To Time": item.toTime,
        "Training Link": item.trainingLink,
        "Mode Of Training": item.modeOfTraining,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(processedData);

    // Set all columns to width 50
    worksheet["!cols"] = Array(Object.keys(processedData[0]).length).fill({
      wch: 50,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainings");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Training_List.xlsx");
  };

  const renderTable = () => {
    return (
      <div
        className="training-container"
        style={{
          padding: "24px",
          borderRadius: "12px",
          backgroundColor: "white",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Stats summary and search bar */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          {/* Stats summary */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#f8fafc",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              height: "48px",
              flex: "0 0 auto",
            }}
          >
            <div
              style={{
                padding: "8px",
                backgroundColor: "#3b82f6",
                borderRadius: "6px",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.5C13.81 2.5 15.5 3.24 16.62 4.53L17.3 5.3H20C20.55 5.3 21 5.75 21 6.3V8.5C22.74 8.5 24 10.26 24 12.5C24 14.74 22.74 16.5 21 16.5V18.7C21 19.25 20.55 19.7 20 19.7H17.66L16.92 20.44C15.8 21.66 14.11 22.5 12 22.5C9.89 22.5 8.2 21.66 7.08 20.44L6.34 19.7H4C3.45 19.7 3 19.25 3 18.7V16.5C1.26 16.5 0 14.74 0 12.5C0 10.26 1.26 8.5 3 8.5V6.3C3 5.75 3.45 5.3 4 5.3H6.7L7.38 4.53C8.5 3.24 10.19 2.5 12 2.5ZM12 5.5C10.28 5.5 8.83 6.79 8.62 8.5H15.38C15.17 6.79 13.72 5.5 12 5.5ZM6 11.5H5C4.45 11.5 4 11.95 4 12.5C4 13.05 4.45 13.5 5 13.5H6C6.55 13.5 7 13.05 7 12.5C7 11.95 6.55 11.5 6 11.5ZM18 11.5H19C19.55 11.5 20 11.95 20 12.5C20 13.05 19.55 13.5 19 13.5H18C17.45 13.5 17 13.05 17 12.5C17 11.95 17.45 11.5 18 11.5ZM12 13.5C11.45 13.5 11 13.95 11 14.5V15.5C11 16.05 11.45 16.5 12 16.5C12.55 16.5 13 16.05 13 15.5V14.5C13 13.95 12.55 13.5 12 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginRight: "8px",
                }}
              >
                Total Training Sessions:
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#3b82f6",
                }}
              >
                {filterTrainings?.length || 0}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search training sessions..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              flex: 1,
              height: "48px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.875rem",
              color: "#1e293b",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
        {/* <div className="search-filters mb-4">
          <div className="row align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search training sessions..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                borderRadius: "8px",
                padding: "10px 16px",
                border: "1px solid #ddd",
                backgroundColor: "#bfd7e0",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 4px 6px rgba(0, 0, 0, .1)",
                transition: "transform .2s, box-shadow .2s",
              }}
            />
          </div>
        </div> */}

        {filterTrainings && filterTrainings.length ? (
          <div className="training-list">
            {/* Horizontally scrollable container for the entire table */}
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                borderRadius: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(12, 73, 97)",
              }}
            >
              {/* Set a minimum width to ensure table doesn't collapse too much */}
              <div style={{ minWidth: "1200px" }}>
                <div
                  className="row mb-3"
                  style={{
                    padding: "12px 8px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    backgroundColor: "rgb(63, 136, 165)",
                    fontFamily: "Arial, sans-serif",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, .1)",
                    transition: "transform .2s, box-shadow .2s",
                    color: "white",
                    display: "flex",
                    margin: "0",
                  }}
                >
                  <div style={{ width: "4%" }}>Id</div>
                  <div style={{ width: "10%" }}>From Date</div>
                  <div style={{ width: "9%" }}>To Date</div>
                  <div style={{ width: "10%" }}>From Time</div>
                  <div style={{ width: "9%" }}>To Time</div>
                  <div style={{ width: "8%" }}>Facilitator</div>
                  <div style={{ width: "10%" }}>Trainer</div>
                  <div style={{ width: "13%" }}>Training Title</div>
                  <div style={{ width: "9%" }}>Mode</div>
                  <div style={{ width: "15%" }}>Actions</div>
                </div>
                <div
                  style={{
                    maxHeight: "49vh",
                    overflowY: "auto",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  {filterTrainings.map((item) => (
                    <div
                      key={item.id}
                      className="row mb-3 align-items-center training-card"
                      style={{
                        backgroundColor: "#bfd7e0",
                        padding: "16px",
                        borderRadius: "10px",
                        fontFamily: "Arial, sans-serif",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, .1)",
                        transition: "transform .2s, box-shadow .2s",
                        display: "flex",
                        margin: "0 0 12px 0",
                      }}
                    >
                      <div style={{ width: "4%" }}>{item.id}</div>
                      <div style={{ width: "9%" }}>{item.fromDate}</div>
                      <div style={{ width: "9%" }}>{item.toDate}</div>
                      <div style={{ width: "9%" }}>
                        {formatTime(item.fromTime)}
                      </div>
                      <div style={{ width: "9%" }}>
                        {formatTime(item.toTime)}
                      </div>
                      <div style={{ width: "8%" }}>
                        {item.trainingFacilitator}
                      </div>
                      <div style={{ width: "10%" }}>
                        {Array.isArray(item.trainer)
                          ? item.trainer.map((t) => t.name).join(", ")
                          : item.trainer || ""}
                      </div>
                      <div style={{ width: "13%" }}>{item.title}</div>
                      <div style={{ width: "9%" }}>
                        <span
                          style={{
                            backgroundColor:
                              item.mode === "ONLINE" ? "#e3f2fd" : "#e8f5e9",
                            color:
                              item.mode === "ONLINE" ? "#0d47a1" : "#1b5e20",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {item.mode === "ONLINE" ? "Online" : "Offline"}
                        </span>
                      </div>

                      <div style={{ width: "15%" }}>
                        <div className="d-flex gap-2 action-buttons">
                          {/* Action buttons remain unchanged */}
                          {/* <button
                            className="btn-action"
                            onClick={() => {
                              setMode("Contract Employee Register");
                              setShowQRModal(true);
                              setActionId(item?.item?.registerExternalQrLink);
                            }}
                            style={{
                              backgroundColor: "#e3f2fd",
                              color: "#1565c0",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Contract Employee Register Link"
                          >
                            <i className="fas fa-link"></i>
                          </button> */}

                          <button
                            className="btn-action"
                            onClick={() => {
                              setMode("Internal Employee Register");
                              setShowQRModal(true);
                              setActionId(item?.item?.registerInternalQrLink);
                            }}
                            style={{
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Employee Register Link"
                          >
                            <i className="fas fa-link"></i>
                          </button>

                          {/* <button
                            className="btn-action"
                            onClick={() => {
                              setMode("Contract Employee Attendance");
                              setShowQRModal(true);
                              setActionId(item?.item?.attendenceExternalQrLink);
                            }}
                            style={{
                              backgroundColor: "#fff3e0",
                              color: "#e65100",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Contract Employee Attendance QR"
                          >
                            <i className="fas fa-qrcode"></i>
                          </button> */}

                          <button
                            className="btn-action"
                            onClick={() => {
                              setMode("Internal Employee Attendance");
                              setShowQRModal(true);
                              setActionId(item?.item?.attendenceInternalQrLink);
                            }}
                            style={{
                              backgroundColor: "#f3e5f5",
                              color: "#6a1b9a",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Employee Attendance QR"
                          >
                            <i className="fas fa-qrcode"></i>
                          </button>

                          <button
                            className="btn-action"
                            onClick={() =>
                              handleCopyLink(item?.item?.trainingLink)
                            }
                            style={{
                              backgroundColor: "#e8eaf6",
                              color: "#3949ab",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Copy Training Link"
                          >
                            <i className="fa fa-copy"></i>
                          </button>

                          <button
                            className="btn-action"
                            onClick={() => {
                              setShowAddTraineeModal(true);
                              setActionId(item?.id);
                            }}
                            style={{
                              backgroundColor: "#e0f7fa",
                              color: "#0097a7",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Add Trainee"
                          >
                            <i className="fa fa-user-plus"></i>
                          </button>

                          <button
                            className="btn-action"
                            onClick={() => handleEdit(item.id, item)}
                            style={{
                              backgroundColor: "#f1f8e9",
                              color: "#558b2f",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="Edit Training"
                          >
                            <i className="fa fa-edit"></i>
                          </button>

                          {item.mappingUser.length ? (
                            <button
                              className="btn-action"
                              onClick={() => {
                                handleDelete(item.id);
                                setMode("Cancel");
                              }}
                              style={{
                                backgroundColor: "#ffebee",
                                color: "#c62828",
                                border: "none",
                                padding: "6px",
                                borderRadius: "6px",
                              }}
                              title="Cancel Training"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} />
                            </button>
                          ) : (
                            <button
                              className="btn-action"
                              onClick={() => {
                                handleDelete(item.id);
                                setMode("Delete");
                              }}
                              style={{
                                backgroundColor: "#ffebee",
                                color: "#c62828",
                                border: "none",
                                padding: "6px",
                                borderRadius: "6px",
                              }}
                              title="Delete Training"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}

                          <button
                            className="btn-action"
                            onClick={() => {
                              setShowUserData(true);
                              setCurrentTrainingName(item.title);
                              getUserData(item.id);
                            }}
                            style={{
                              backgroundColor: "#ede7f6",
                              color: "#4527a0",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                            title="View Participants"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <img
              src={NoDataFound}
              alt="No data found"
              style={{ maxWidth: "250px", opacity: "0.7" }}
              className="mb-3"
            />
          </div>
        )}

        <Modal
          show={showUserData}
          onHide={() => setShowUserData(false)}
          size="lg"
          centered
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",

            borderRadius: "16px",
          }}
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: "1px solid #e2e8f0",
              padding: "24px",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Modal.Title
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
                flex: 1,
              }}
            >
              Participants for {currentTrainingName}
            </Modal.Title>

            {/* Download All Button */}
            <button
              onClick={handleDownloadAll}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "12px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15V3M12 15L8 11M12 15L16 11M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download
            </button>
          </Modal.Header>
          <Modal.Body style={{ padding: "0 24px 24px" }}>
            <Tabs
              id="user-data-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-0"
              style={{ borderBottom: "1px solid #e2e8f0" }}
            >
              <Tab
                eventKey="register"
                title={
                  <span style={{ padding: "12px 16px", display: "block" }}>
                    Registered{" "}
                    <span
                      style={{
                        backgroundColor: "#e2e8f0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1e293b",
                      }}
                    >
                      {users.registerUser?.length || 0}
                    </span>
                  </span>
                }
              >
                <div>
                  {/* Stats summary and search bar for Registered */}
                  <div
                    style={{ display: "flex", gap: "24px" }}
                    className="my-3"
                  >
                    {/* Stats summary */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        backgroundColor: "#f8fafc",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        height: "48px",
                        flex: "0 0 auto",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: "#3b82f6",
                          borderRadius: "6px",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 4C16.55 4 17 4.45 17 5V6H20C20.55 6 21 6.45 21 7C21 7.55 20.55 8 20 8H17V19C17 19.55 16.55 20 16 20H8C7.45 20 7 19.55 7 19V8H4C3.45 8 3 7.55 3 7C3 6.45 3.45 6 4 6H7V5C7 4.45 7.45 4 8 4H16ZM15 6H9V18H15V6ZM11 9C11.55 9 12 9.45 12 10V16C12 16.55 11.55 17 11 17C10.45 17 10 16.55 10 16V10C10 9.45 10.45 9 11 9ZM13 9C13.55 9 14 9.45 14 10V16C14 16.55 13.55 17 13 17C12.45 17 12 16.55 12 16V10C12 9.45 12.45 9 13 9Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#1e293b",
                            marginRight: "8px",
                          }}
                        >
                          Registered:
                        </span>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "#3b82f6",
                          }}
                        >
                          {filteredRegisteredUsers?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Search bar for Registered */}
                    <input
                      type="text"
                      placeholder="Search registered participants..."
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filtered = users.registerUser?.filter((user) => {
                          if (!user) return false;

                          return (
                            (user.first_name?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.last_name?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.email?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.mobile?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.employeeId?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.gender?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.categoryId?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (
                              (
                                AudienceOptions.find(
                                  (option) =>
                                    option.value === user?.departmentId
                                )?.label || user?.departmentId
                              )?.toLowerCase() || ""
                            ).includes(searchTerm) ||
                            (user.businessUnit?.toLowerCase() || "").includes(
                              searchTerm
                            ) ||
                            (user.division?.toLowerCase() || "").includes(
                              searchTerm
                            )
                          );
                        });
                        setFilteredRegisteredUsers(filtered || []);
                      }}
                      style={{
                        flex: 1,
                        height: "48px",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.875rem",
                        color: "#1e293b",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Table with custom styling for Registered */}
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        overflowX: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(12, 73, 97)",
                      }}
                    >
                      <Table
                        className="mb-0"
                        style={{ borderSpacing: "0", minWidth: "800px" }}
                      >
                        <thead
                          style={{ position: "sticky", top: 0, zIndex: 1 }}
                        >
                          <tr style={{ backgroundColor: "#f8fafc" }}>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              NAME
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              EMAIL
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              MOBILE
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              EMPLOYEE ID
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              GENDER
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              CATEGORY
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              DEPARTMENT
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              BUSINESS UNIT
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              DIVISION
                            </th>
                          </tr>
                        </thead>
                        {(filteredRegisteredUsers?.length !== undefined
                          ? filteredRegisteredUsers
                          : users.registerUser) &&
                          (filteredRegisteredUsers?.length !== undefined
                            ? filteredRegisteredUsers
                            : users.registerUser
                          ).length ? (
                          <tbody>
                            {(filteredRegisteredUsers?.length !== undefined
                              ? filteredRegisteredUsers
                              : users.registerUser
                            ).map((user, index) => (
                              <tr
                                key={index}
                                style={{
                                  borderBottom:
                                    index <
                                      (filteredRegisteredUsers?.length !==
                                        undefined
                                        ? filteredRegisteredUsers
                                        : users.registerUser
                                      ).length -
                                      1
                                      ? "1px solid #e2e8f0"
                                      : "none",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f1f5f9")
                                }
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                                }
                              >
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    fontWeight: "500",
                                    color: "#1e293b",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {`${user.first_name} ${user.last_name}`}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.email}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.mobile}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.employeeId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <span
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "9999px",
                                      backgroundColor:
                                        user?.gender?.toLowerCase() === "male"
                                          ? "#dbeafe"
                                          : "#fce7f3",
                                      color:
                                        user?.gender?.toLowerCase() === "male"
                                          ? "#1e40af"
                                          : "#be185d",
                                      fontSize: "0.875rem",
                                      fontWeight: "500",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {user.gender}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {AudienceOptions.find(
                                    (option) =>
                                      option.value === user?.categoryId
                                  )?.label || user?.categoryId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.departmentId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.businessUnit}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.division}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  padding: "48px 24px",
                                  textAlign: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#64748b",
                                    fontSize: "1rem",
                                    margin: 0,
                                    fontWeight: "500",
                                  }}
                                >
                                  No registered participants found
                                </p>
                                <p
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: "0.875rem",
                                    margin: "4px 0 0",
                                  }}
                                >
                                  Participants will appear here once they
                                  register
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </Table>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey="attended"
                title={
                  <span style={{ padding: "12px 16px", display: "block" }}>
                    Attended{" "}
                    <span
                      style={{
                        backgroundColor: "#e2e8f0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#1e293b",
                      }}
                    >
                      {filteredAttendedUsers?.length || 0}
                    </span>
                  </span>
                }
              >
                <div>
                  {/* Stats summary and search bar for Attended */}
                  <div
                    style={{ display: "flex", gap: "24px" }}
                    className="my-3"
                  >
                    {/* Stats summary */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        backgroundColor: "#f8fafc",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        height: "48px",
                        flex: "0 0 auto",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: "#10b981",
                          borderRadius: "6px",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#1e293b",
                            marginRight: "8px",
                          }}
                        >
                          Attended:
                        </span>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: "#10b981",
                          }}
                        >
                          {users.attendenceUser?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Search bar for Attended */}
                    <input
                      type="text"
                      placeholder="Search attendees..."
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filtered = users.attendenceUser?.filter(
                          (user) => {
                            if (!user) return false;

                            return (
                              (user.first_name?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.last_name?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.email?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.mobile?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.employeeId?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.gender?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.categoryId?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (
                                (
                                  AudienceOptions.find(
                                    (option) =>
                                      option.value === user?.departmentId
                                  )?.label || user?.departmentId
                                )?.toLowerCase() || ""
                              ).includes(searchTerm) ||
                              (user.businessUnit?.toLowerCase() || "").includes(
                                searchTerm
                              ) ||
                              (user.division?.toLowerCase() || "").includes(
                                searchTerm
                              )
                            );
                          }
                        );
                        setFilteredAttendedUsers(filtered || []);
                      }}
                      style={{
                        flex: 1,
                        height: "48px",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.875rem",
                        color: "#1e293b",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#10b981")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  {/* Table with custom styling for Attended */}
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        overflowX: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(12, 73, 97)",
                      }}
                    >
                      <Table
                        className="mb-0"
                        style={{ borderSpacing: "0", minWidth: "800px" }}
                      >
                        <thead
                          style={{ position: "sticky", top: 0, zIndex: 1 }}
                        >
                          <tr style={{ backgroundColor: "#f8fafc" }}>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              NAME
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              EMAIL
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              MOBILE
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              EMPLOYEE ID
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              GENDER
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              CATEGORY
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              DEPARTMENT
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              BUSINESS UNIT
                            </th>
                            <th
                              style={{
                                padding: "16px 24px",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                                color: "#64748b",
                                borderBottom: "2px solid #e2e8f0",
                                whiteSpace: "nowrap",
                              }}
                            >
                              DIVISION
                            </th>
                          </tr>
                        </thead>
                        {(filteredAttendedUsers?.length !== undefined
                          ? filteredAttendedUsers
                          : users.attendenceUser) &&
                          (filteredAttendedUsers?.length !== undefined
                            ? filteredAttendedUsers
                            : users.attendenceUser
                          ).length ? (
                          <tbody>
                            {(filteredAttendedUsers?.length !== undefined
                              ? filteredAttendedUsers
                              : users.attendenceUser
                            ).map((user, index) => (
                              <tr
                                key={index}
                                style={{
                                  borderBottom:
                                    index <
                                      (filteredAttendedUsers?.length !== undefined
                                        ? filteredAttendedUsers
                                        : users.attendenceUser
                                      ).length -
                                      1
                                      ? "1px solid #e2e8f0"
                                      : "none",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f1f5f9")
                                }
                                onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                                }
                              >
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    fontWeight: "500",
                                    color: "#1e293b",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {`${user.first_name} ${user.last_name}`}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.email}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.mobile}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.employeeId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <span
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "9999px",
                                      backgroundColor:
                                        user?.gender?.toLowerCase() === "male"
                                          ? "#dbeafe"
                                          : "#fce7f3",
                                      color:
                                        user?.gender?.toLowerCase() === "male"
                                          ? "#1e40af"
                                          : "#be185d",
                                      fontSize: "0.875rem",
                                      fontWeight: "500",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {user.gender}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {AudienceOptions.find(
                                    (option) =>
                                      option.value === user?.categoryId
                                  )?.label || user?.categoryId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.departmentId}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.businessUnit}
                                </td>
                                <td
                                  style={{
                                    padding: "16px 24px",
                                    color: "#475569",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {user.division}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  padding: "48px 24px",
                                  textAlign: "center",
                                }}
                              >
                                <p
                                  style={{
                                    color: "#64748b",
                                    fontSize: "1rem",
                                    margin: 0,
                                    fontWeight: "500",
                                  }}
                                >
                                  No attendance records found
                                </p>
                                <p
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: "0.875rem",
                                    margin: "4px 0 0",
                                  }}
                                >
                                  Attendees will appear here once they check in
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </Table>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>

        <Modal
          show={showTraineeData}
          onHide={() => setShowTraineeData(false)}
          size="lg"
          centered
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",

            borderRadius: "16px",
          }}
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: "1px solid #e2e8f0",
              padding: "24px",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Modal.Title
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Registered Trainees
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ padding: "0 24px 24px" }}>
            {/* Stats summary and search bar */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
              {/* Stats summary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#f8fafc",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  height: "48px",
                  flex: "0 0 auto",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "6px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.5C13.81 2.5 15.5 3.24 16.62 4.53L17.3 5.3H20C20.55 5.3 21 5.75 21 6.3V8.5C22.74 8.5 24 10.26 24 12.5C24 14.74 22.74 16.5 21 16.5V18.7C21 19.25 20.55 19.7 20 19.7H17.66L16.92 20.44C15.8 21.66 14.11 22.5 12 22.5C9.89 22.5 8.2 21.66 7.08 20.44L6.34 19.7H4C3.45 19.7 3 19.25 3 18.7V16.5C1.26 16.5 0 14.74 0 12.5C0 10.26 1.26 8.5 3 8.5V6.3C3 5.75 3.45 5.3 4 5.3H6.7L7.38 4.53C8.5 3.24 10.19 2.5 12 2.5ZM12 5.5C10.28 5.5 8.83 6.79 8.62 8.5H15.38C15.17 6.79 13.72 5.5 12 5.5ZM6 11.5H5C4.45 11.5 4 11.95 4 12.5C4 13.05 4.45 13.5 5 13.5H6C6.55 13.5 7 13.05 7 12.5C7 11.95 6.55 11.5 6 11.5ZM18 11.5H19C19.55 11.5 20 11.95 20 12.5C20 13.05 19.55 13.5 19 13.5H18C17.45 13.5 17 13.05 17 12.5C17 11.95 17.45 11.5 18 11.5ZM12 13.5C11.45 13.5 11 13.95 11 14.5V15.5C11 16.05 11.45 16.5 12 16.5C12.55 16.5 13 16.05 13 15.5V14.5C13 13.95 12.55 13.5 12 13.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginRight: "8px",
                    }}
                  >
                    Total Trainees:
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: "#3b82f6",
                    }}
                  >
                    {filteredTrainees?.length || 0}
                    {/* 1404 */}
                  </span>
                </div>
              </div>

              {/* Search bar */}
              <input
                type="text"
                placeholder="Search trainees..."
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = traineeList.filter((trainee) => {
                    if (!trainee) return false;

                    return (
                      (trainee.first_name?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (trainee.last_name?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (trainee.email?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (trainee.employeeId?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (trainee.categoryId?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (
                        (
                          AudienceOptions.find(
                            (option) => option.value === trainee?.departmentId
                          )?.label || trainee?.departmentId
                        )?.toLowerCase() || ""
                      ).includes(searchTerm) ||
                      (trainee.businessUnit?.toLowerCase() || "").includes(
                        searchTerm
                      ) ||
                      (trainee.division?.toLowerCase() || "").includes(
                        searchTerm
                      )
                    );
                  });
                  setFilteredTrainees(filtered);
                }}
                style={{
                  flex: 1,
                  height: "48px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#1e293b",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Table with custom styling */}
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgb(12, 73, 97)",
                }}
              >
                <Table className="mb-0" style={{ borderSpacing: "0" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        EMPLOYEE ID
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        NAME
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        EMAIL
                      </th>

                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        GENDER
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Department
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Business Unit
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          borderBottom: "2px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Division
                      </th>
                    </tr>
                  </thead>
                  {filteredTrainees && filteredTrainees.length ? (
                    <tbody>
                      {[...filteredTrainees].reverse().map((user, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom:
                              index < filteredTrainees.length - 1
                                ? "1px solid #e2e8f0"
                                : "none",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f1f5f9")
                          }
                          onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "16px 24px",
                              fontWeight: "500",
                              color: "#1e293b",
                            }}
                          >
                            {user?.employeeId}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              fontWeight: "500",
                              color: "#1e293b",
                            }}
                          >
                            {`${user.first_name} ${user.last_name}`}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            {user?.email}
                          </td>

                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "9999px",
                                backgroundColor:
                                  user?.gender?.toLowerCase() === "male"
                                    ? "#dbeafe"
                                    : "#fce7f3",
                                color:
                                  user?.gender?.toLowerCase() === "male"
                                    ? "#1e40af"
                                    : "#be185d",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                textTransform: "capitalize",
                              }}
                            >
                              {user?.gender}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            {AudienceOptions.find(
                              (option) => option.value === user?.categoryId
                            )?.label || user?.categoryId}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            {user?.departmentId}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            {user?.businessUnit}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#475569",
                            }}
                          >
                            {user?.division}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td
                          colSpan="4"
                          style={{ padding: "48px 24px", textAlign: "center" }}
                        >
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ margin: "0 auto 16px", opacity: 0.5 }}
                          >
                            <path
                              d="M12 2L2 7L12 12L22 7L12 2Z"
                              stroke="#94a3b8"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 17L12 22L22 17"
                              stroke="#94a3b8"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 12L12 17L22 12"
                              stroke="#94a3b8"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p
                            style={{
                              color: "#64748b",
                              fontSize: "1rem",
                              margin: 0,
                              fontWeight: "500",
                            }}
                          >
                            No registered participants found
                          </p>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: "0.875rem",
                              margin: "4px 0 0",
                            }}
                          >
                            Trainees will appear here once they register
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Add Trainee Modal */}
        <Modal
          show={showAddTraineeModal}
          onHide={handleActionClose}
          centered
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",

          }}
        >
          <Modal.Header
            closeButton
            style={{ borderBottom: "1px solid #eaedf0", padding: "16px 24px" }}
          >
            <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              Add Guest
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "24px" }}>
            <AddTrainee
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
            />
          </Modal.Body>
          <Modal.Footer
            style={{ borderTop: "1px solid #eaedf0", padding: "16px 24px" }}
          >
            <Button
              variant="primary"
              style={{ width: "100%", borderRadius: "8px", padding: "10px" }}
              onClick={handleSaveTrainee}
            >
              Send Invite
            </Button>
          </Modal.Footer>
        </Modal>

        {/* QR Code Modal */}
        <Modal
          show={showQRModal}
          onHide={handleQRActionClose}
          centered
          size="sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",

          }}
        >
          <Modal.Header
            closeButton
            style={{ borderBottom: "1px solid #eaedf0", padding: "16px 24px" }}
          >
            <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              {mode} QR Code
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center" style={{ padding: "24px" }}>
            {actionId ? (
              <div>
                <img
                  src={actionId}
                  alt="QR Code"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
                <div className="mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleCopyLink(actionId)}
                    style={{ borderRadius: "6px" }}
                  >
                    <i className="fas fa-copy me-2"></i> Copy Link
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-muted">No QR Code available</p>
            )}
          </Modal.Body>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          show={actionModalShow}
          onHide={handleActionClose}
          centered
          size="sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",

          }}
        >
          <Modal.Header
            closeButton
            style={{ borderBottom: "1px solid #eaedf0", padding: "16px 24px" }}
          >
            <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "24px" }}>
            <div className="text-center mb-3">
              <i
                className={`fas ${mode === "Delete" || mode === "Cancel"
                  ? "fa-exclamation-triangle"
                  : "fa-question-circle"
                  }`}
                style={{
                  fontSize: "3rem",
                  color:
                    mode === "Delete" || mode === "Cancel"
                      ? "#f44336"
                      : "#2196f3",
                  marginBottom: "16px",
                }}
              ></i>
              <p style={{ fontSize: "1.1rem" }}>
                Are you sure you want to {mode?.toLowerCase()} this training?
              </p>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                {mode === "Delete"
                  ? "This action cannot be undone."
                  : mode === "Cancel"
                    ? "This will cancel the training for all participants."
                    : "Please confirm to proceed."}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: "1px solid #eaedf0",
              padding: "16px 24px",
              display: "flex",
              gap: "8px",
            }}
          >
            <Button
              variant="outline-secondary"
              style={{ flex: "1", borderRadius: "8px" }}
              onClick={handleActionClose}
            >
              Cancel
            </Button>
            <Button
              variant={
                mode === "Delete" || mode === "Cancel" ? "danger" : "primary"
              }
              style={{ flex: "1", borderRadius: "8px" }}
              onClick={handleActionAPI}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notification */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1050,
            minWidth: "250px",
            backgroundColor: "#4caf50",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Toast.Body className="d-flex align-items-center">
            <i className="fas fa-check-circle me-2"></i>
            <span>Link copied to clipboard!</span>
          </Toast.Body>
        </Toast>
      </div>
    );
  };

  return (
    <>
      {/* Fixed Header */}
      <div
        style={{
          overflowX: "auto", // Add horizontal scrolling
          width: "100%",
          backgroundColor: "#f0f4f7",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start", // Changed from space-between to flex-start
            alignItems: "center",
            padding: "15px 20px",
            minWidth: "800px", // Ensure minimum width to prevent squeezing
          }}
        >
          <div
            style={{
              width: "180px",
              flexShrink: 0,
            }}
          >
            <select
              className="sector-question-select"
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
              }}
              value={
                financialYearId ||
                (financialYear.length > 0
                  ? financialYear[financialYear.length - 1].id
                  : "")
              }
              onChange={async (e) => {
                setFinancialYearId(e.target.value);
              }}
            >
              <option value={0}>2024-2025</option>
              {financialYear?.map((item, key) => (
                <option key={key} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            <button
              style={{
                backgroundColor: "#3c8dbc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "12px 15px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setShowModal(true)}
            >
              <i className="fa fa-plus"></i>
              Create new training
            </button>

            <button
              style={{
                backgroundColor: "#3c8dbc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "12px 15px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() =>
                handleCopyLink(
                  `${window.location.origin}/#/trainee_registration`
                )
              }
            >
              <i className="fa fa-link"></i>
              Registration Trainee Link
            </button>

            {isHead ? (
              <button
                style={{
                  backgroundColor: "#3c8dbc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "12px 15px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={openModal}
              >
                <i className="fa fa-upload"></i>
                Upload For Registration
              </button>
            ) : (
              <></>
            )}

            {isHead ? (
              <button
                style={{
                  backgroundColor: "#3c8dbc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "12px 15px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={openRemoveUserModal}
              >
                <i className="fa fa-tasks"></i>
                Disabled User
              </button>
            ) : (
              <></>
            )}

            {isHead ? (
              <button
                style={{
                  backgroundColor: "#3c8dbc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "12px 15px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={openParticipatsModal}
              >
                <i className="fa fa-tasks"></i>
                Upload Training Participates
              </button>
            ) : (
              <></>
            )}

            {isHead ? (
              <button
                style={{
                  backgroundColor: "#3c8dbc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "12px 15px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={openRemoveUserFromTrainingModal}
              >
                <i className="fa fa-tasks"></i>
                Remove Training Participates
              </button>
            ) : (
              <></>
            )}

            {/* <button
              style={{
                backgroundColor: "#3c8dbc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "12px",
                cursor: "pointer",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={downloadTrainingExcel}
              title="Download Trainings"
            >
              <i className="fa fa-download" style={{ fontSize: "18px" }}></i>
            </button> */}
            <NavLink to="/training-filter">
              <button
                style={{
                  backgroundColor: "#3c8dbc",
                  color: "white",
                  border: "none",
                  height: "48px",
                  borderRadius: "4px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                title="Training Filter and Download"
              >
                <i
                  className="fa fa-chart-line"
                  style={{ fontSize: "16px" }}
                ></i>
              </button>
            </NavLink>

            <button
              style={{
                backgroundColor: "#3c8dbc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "12px",
                cursor: "pointer",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setShowTraineeData(true)}
              title="All Trainee"
            >
              <i className="fa fa-users" style={{ fontSize: "18px" }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Container with Scrollable Table */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f4f7fa", // Light background color
          margin: "0 auto", // Center the layout horizontally
        }}
      >
        <Tabs
          defaultActiveKey="new"
          id="training-tabs"
          className="mb-3"
          onSelect={handleTabSelect} // Update active tab on selection
        >
          <Tab eventKey="new" title="New Training">
            <div>{renderTable()}</div>
          </Tab>
          <Tab eventKey="canceled" title="Canceled Training">
            <div>{renderTable()}</div>
          </Tab>
        </Tabs>
      </div>
      {isModalOpen && (
        <UploadRegistrationExcel
          show={isModalOpen}
          onClose={closeModal}
          setIsUserDataUploaded={setIsUserDataUploaded}
        />
      )}

      {isModalRemoveUserOpen && (
        <RemoveUsersExcel
          show={isModalRemoveUserOpen}
          onClose={closeRemoveUserModal}
          financialYear={financialYearDatas}
          userList={traineeList}
          setIsUserDataUploaded={setIsUserDataUploaded}
        />
      )}

      {isModalRemoveUserFromTrainingOpen && (
        <RemoveUsersFromTrainingExcel
          show={isModalRemoveUserFromTrainingOpen}
          onClose={closeRemoveUserFromTrainingModal}
          trainingList={trainingData}
          userList={traineeList}
          setIsUserDataUploaded={setIsUserDataUploaded}
        />
      )}



      {isModalParticipatsOpen && (
        <UploadTrainingAssignmentExcel
          show={isModalParticipatsOpen}
          onClose={closeParticipatsModal}
          trainingData={trainingData}
          userList={traineeList}
          setIsUserDataUploaded={setIsUserDataUploaded}
          setIsTraineeDataUploaded={setIsTraineeDataUploaded}
        />
      )}
      <TrainingModal
        show={showModal}
        handleClose={() => handleCloseModal()}
        actionId={actionId}
        editData={editData}
        financialYearId={financialYearId}
      />
    </>
  );
};

export default TrainingTable;
