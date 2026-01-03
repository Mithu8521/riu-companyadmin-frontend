import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import config from "../../config/config.json";
import "./working_progress.css";
import { apiCall } from "../../_services/apiCall";
import Multiselect from "multiselect-react-dropdown";
import Loader from "../loader/Loader";
import ToggleButton from "react-toggle-button";
import shape from "./shape.png";
import mail from "./mail.png";
import PhoneInput from "react-phone-input-2";
import deletee from "./delete.png";
import add from "./add.png";
import "react-phone-input-2/lib/style.css";
import ReAssignQuestions from "../Company Sub Admin/Component/Sector Questions/ReassignUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FiChevronDown } from "react-icons/fi";

const SubUsers = ({ userPermissionList }) => {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [source_ids, setSource_ids] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [useLoader, setUseLoader] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [designationId, setDesignationId] = useState(null);
  const [showSkelton, setshowSkelton] = useState(false);
  const [userList, setUserList] = useState(null);
  const [joiningDate, setJoiningDate] = useState("");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    employeeId: "",
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [usersId, setUsersId] = useState();
  const [removeUserLocationId, setRemoveUserLocationId] = useState();
  const [addNewUserPopup, setAddNewUserPopup] = useState(false);
  const [addNewLocationPopup, setAddNewLOcationPopup] = useState(false);
  const [designationList, setDesignationList] = useState(null);
  const [locationUsedIds, setLocationUsedIds] = useState([]);
  const [roleList, setRoleList] = useState();
  const [onlyAuditor, setOnlyAuditor] = useState(false);
  const [headOfficeTrue, setHeadOfficeTrue] = useState([]);
  const [headOfficeFalse, setHeadOfficeFalse] = useState([]);
  const [enable, setEnable] = useState();
  const [businessUnit, setBusinessUnit] = useState("");
  const [division, setDivision] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [gender, setGender] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [companyName, setCompanyName] = useState(""); // For dropdown selection
  const [activebtnTab, setactivebtnTab] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reassignShow, setReassignShow] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [phone, setPhone] = useState("");

  const companyOptions = [
    {
      label: "Kennametal India Limited (KIL)",
      value: "Kennametal India Limited (KIL)",
    },
    {
      label: "Kennametal Shared Services Private Limited (KSSPL)",
      value: "Kennametal Shared Services Private Limited (KSSPL)",
    },
  ];

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

  const businessUnitOptions = [
    { label: "Metal Cutting Demand Fulfillment", value: "Metal Cutting Demand Fulfillment" },
    { label: "Metal Cutting Demand Generation", value: "Metal Cutting Demand Generation" },
    { label: "Infrastructure Business Group", value: "Infrastructure Business Group" },
    { label: "Administration Office", value: "Administration Office" },
    { label: "Finance", value: "Finance" },
    { label: "Technology", value: "Technology" },
    { label: "Office of General Counsel", value: "Office of General Counsel" },
    { label: "Global Sourcing & Procurement", value: "Global Sourcing & Procurement" },
  ];

  const divisionOptions = [
    { label: "Advanced Material Solutions", value: "Advanced Material Solutions" },
    { label: "Business Finance", value: "Business Finance" },
    { label: "Commercial Field", value: "Commercial Field" },
    { label: "Corporate Finance", value: "Corporate Finance" },
    { label: "Earthcutting", value: "Earthcutting" },
    { label: "Engineered Components", value: "Engineered Components" },
    { label: "Environmental Health and Safety", value: "Environmental Health and Safety" },
    { label: "General", value: "General" },
    { label: "General Counsel", value: "General Counsel" },
    { label: "HR Business Partners", value: "HR Business Partners" },
    { label: "Inserts", value: "Inserts" },
    { label: "Machining Solutions Group", value: "Machining Solutions Group" },
    { label: "Materials Science", value: "Materials Science" },
    { label: "Portfolio Management", value: "Portfolio Management" },
    { label: "Procurement", value: "Procurement" },
    { label: "Product Engineering", value: "Product Engineering" },
    { label: "Quality", value: "Quality" },
    { label: "Strategic Marketing", value: "Strategic Marketing" },
    { label: "Supply Planning & Logistics", value: "Supply Planning & Logistics" },
    { label: "Technology Industrial", value: "Technology Industrial" },
  ];

  const departmentOptions = [
    { label: "MCDG - Sales", value: "MCDG - Sales" },
    { label: "MCDF + Infra Mfg - Manufacturing", value: "MCDF + Infra Mfg - Manufacturing" },
    { label: "MSG", value: "MSG" },
    { label: "Infrastructure", value: "Infrastructure" },
    { label: "Marketing", value: "Marketing" },
    { label: "Finance", value: "Finance" },
    { label: "HR", value: "HR" },
    { label: "Legal", value: "Legal" },
    { label: "R&D", value: "R&D" },
    { label: "Sourcing", value: "Sourcing" },
    { label: "EHS", value: "EHS" },
    { label: "Supply Chain & Distribution", value: "Supply Chain & Distribution" },
    { label: "ESG", value: "ESG" },
    { label: "Technology", value: "Technology" },
    { label: "Admin", value: "Admin" },
    { label: "MCDF", value: "MCDF" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Design", value: "Design" },
    { label: "Supply Planning & Logistics", value: "Supply Planning & Logistics" },
    { label: "Customer Service", value: "Customer Service" },
    { label: "Application Engineering", value: "Application Engineering" },
    { label: "Performance Value", value: "Performance Value" },
    { label: "Field", value: "Field" },
    { label: "Business Partners", value: "Business Partners" },
    { label: "Health and Safety", value: "Health and Safety" },
    { label: "Product Engineering", value: "Product Engineering" },
    { label: "Sales", value: "Sales" },
    { label: "Business Finance", value: "Business Finance" },
    { label: "Business Services", value: "Business Services" },
    { label: "Technology Industrial", value: "Technology Industrial" },
    { label: "Materials Science", value: "Materials Science" },
    { label: "Quality", value: "Quality" },
    { label: "Tax", value: "Tax" },
    { label: "General Counsel", value: "General Counsel" },
    { label: "End Market Strategies", value: "End Market Strategies" },
    { label: "Procurement", value: "Procurement" },
    { label: "General Mgmt/Admin", value: "General Mgmt/Admin" },
    { label: "Product Management Operations", value: "Product Management Operations" },
    { label: "Machine Tool Industry", value: "Machine Tool Industry" },
  ];

  const userId = JSON.parse(localStorage.getItem("user_temp_id"));
  const closeDeleteDesignationPopup = () => setDeleteModal(false);
  const handleReassignClose = () => setReassignShow(false);
  const handleReassignShow = (id) => {
    setUsersId(id);
    setReassignShow(true);
  };
  const handleCloseNewUserPopup = () => {
    setRoleId(null);
    setAddNewUserPopup(false);
  };
  const handleCloseLocationPopup = () => {
    setAddNewLOcationPopup(false);
  };
  const onRemoveSourceHandler = (removedItem) => {
    const updatedSelectedId = source_ids.filter(
      (item) => item !== removedItem[0].id
    );
    setSource_ids(updatedSelectedId);
  };

  const [companyId, setCompanyId] = useState();
  const isMounted = useRef(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("tmpcurrentUser");
    if (currentUser) {
      setCompanyId(String(JSON.parse(currentUser).data.user.dataValues.company_id));
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSelectSourceHandler = (selectedItems) => {
    const selectedItemValues = selectedItems.map((item) => item.id);
    setSource_ids(selectedItemValues);
  };

  const handleShowNewLocationPopup = (id, location) => {
    setAddNewLOcationPopup(true);
    setUsersId(id);
    const locationIds = location.map((obj) => obj.sourceId);
    getLocationById(locationIds);
  };

  const handleShowNewUserPopup = () => {
    setAddNewUserPopup(true);
    getRoleById();
    getDesignationById();
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setUserDetails((userdetails) => {
      return { ...userdetails, [name]: value };
    });
  };

  const handleLocationId = async (inputData) => {
    const sourceIdsArray = [];
    inputData.forEach((item) => {
      if (item.location && Array.isArray(item.location)) {
        item.location.forEach((location) => {
          if (location.sourceId !== undefined) {
            sourceIdsArray.push(location.sourceId);
          }
        });
      }
    });
    return sourceIdsArray;
  };

  const getSubUser = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSubUser`,
      {},
      { userId: userId },
      "GET"
    );
    setshowSkelton(false);
    if (isSuccess) {
      const locationIds = await handleLocationId(data?.data);
      setLocationUsedIds(locationIds);
      setUserList(data?.data?.reverse());
      setFilterListValue(data?.data?.reverse());
    }
  };

  const handleResendCredentials = async (userId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reSendCredicial`,
      {},
      { userId: userId },
      "POST"
    );
    if (isSuccess) {
    }
  };

  const getLocationById = async (locationIds) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      let locationList = data?.data?.reverse();
      const filteredArray = locationList.filter(
        (item) => !locationIds.includes(item.id)
      );
      locationList = filteredArray.map((item) => {
        const locationData = Object.values(item.location).join(", ");
        return { ...item, locationData };
      });
      setLocationList(locationList);
    }
  };
  const getLocation = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      let locationList = data?.data?.reverse();

      setLocationList(locationList);
    }
  };

  const getRoleById = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getMasterData`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      setRoleList(data.data);
    }
  };

  const getDesignationById = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getDesignation`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      setDesignationList(data?.data?.reverse());
    }
  };

  const sendInvite = async (id, e) => {
    setUpdateLoader(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `inviteSubUser`,
      {},
      {
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        emailId: userDetails?.emailId,
        gender: gender,
        categoryId: categoryId,
        companyName: companyName,
        employeeId: userDetails?.employeeId,
        mobileNumber: phone,
        invitedBy: Number(userId),
        designationId: Number(designationId),
        sourceId: JSON.stringify([1]),
        roleId: Number(roleId),
        businessUnit: businessUnit,
        division: division,
        departmentId: departmentId,
        joiningDate: joiningDate || null, // Add joining date

      },
      "POST"
    );
    setUpdateLoader(false);
    if (isSuccess) {
      getSubUser();
      setAddNewUserPopup(false);
      setPhone("");
      setJoiningDate(""); // Reset joining date

      setUserDetails({
        firstName: "",
        lastName: "",
        emailId: "",
        employeeId: "",
      });
    }
  };

  const addLocation = async () => {
    setUpdateLoader(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `addLocationToUser`,
      {},
      {
        sourceId: JSON.stringify(source_ids),
        userId: usersId,
      },
      "POST"
    );
    setUpdateLoader(false);
    if (isSuccess) {
      handleCloseLocationPopup();
      getSubUser();
    }
  };

  const [filterListValue, setFilterListValue] = useState();

  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === "") {
      setFilterListValue([...userList]);
    } else {
      const filteredResult = userList.filter((item) =>
        item.firstName.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterListValue(filteredResult);
    }
  };
  useEffect(() => {
    if (roleList?.length > 0) {
      const role = roleList.filter((role) => role.id === Number(roleId));
      const auditor = role[0]?.onlyauditor;
      setOnlyAuditor(auditor);
    }
  }, [roleId]);

  useEffect(() => {
    getSubUser();
    getLocation();
  }, []);

  useEffect(() => {
    if (userList && userList.length > 0) {
      const initialSelectedItem = userList[0];
      const headOfficeTrue = initialSelectedItem.location.filter(
        (location) => location.headOffice === true
      );
      const headOfficeFalse = initialSelectedItem.location.filter(
        (location) => location.headOffice === false
      );
      setHeadOfficeTrue(headOfficeTrue);
      setHeadOfficeFalse(headOfficeFalse);
      setSelectedRow(initialSelectedItem);
      setRemoveUserLocationId(initialSelectedItem?.userId);
    }
  }, [userList]);
  const [showModalUserDetail, setShowModalUserDetail] = useState(false);

  const handleShowModal = () => setShowModalUserDetail(true);
  const handleCloseModal = () => setShowModalUserDetail(false);
  const handleRowClick = (userData) => {
    const headOfficeTrue = userData.location.filter(
      (location) => location.headOffice === true
    );
    const headOfficeFalse = userData.location.filter(
      (location) => location.headOffice === false
    );
    setSelectedRow(userData);
    setRemoveUserLocationId(userData?.userId);
    setHeadOfficeTrue(headOfficeTrue);
    setHeadOfficeFalse(headOfficeFalse);
  };
  const handleNoClick = () => {
    setShowModal(false);
  };
  const actionUser = async () => {
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `actionOnSubUser`,
      {},
      { userId: currentId, status: enable },
      "POST"
    );
    if (isSuccess) {
      getSubUser();
      setCurrentId(null);
      setShowModal(false);
    }
  };

  const handleToggleTwoFactor = async (email, employeeId, status) => {
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `handleToggleTwoFactor`,
      {},
      { email: email, employeeId: employeeId, status: status },
      "POST"
    );
    if (isSuccess) {
      getSubUser();
    }
  };

  const deleteLocation = async () => {
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `removeLocation`,
      {},
      { userId: removeUserLocationId, locationId: currentId },
      "POST"
    );
    if (isSuccess) {
      getSubUser();
      setCurrentId(null);
      setDeleteModal(false);
    }
  };
  const handleToggle = (id, status) => {
    setEnable(!status);
    setShowModal(true);
    setCurrentId(id);
  };

  const removeLocation = (id) => {
    setDeleteModal(true);
    setCurrentId(id);
  };

  const handleTabClick = (index) => {
    setactivebtnTab(index);
  };

  const [clickedRow, setClickedRow] = useState(null); // Track the clicked row

  const handleImageClick = (data, rowIndex) => {
    handleShowModal();
    setClickedRow(clickedRow === rowIndex ? null : rowIndex);
    const headOfficeTrue = data.location.filter(
      (location) => location.headOffice === true
    );
    const headOfficeFalse = data.location.filter(
      (location) => location.headOffice === false
    );
    setSelectedRow(data);
    setRemoveUserLocationId(data?.userId);
    setHeadOfficeTrue(headOfficeTrue);
    setHeadOfficeFalse(headOfficeFalse); // Toggle clicked row
  };

  const renderUI = () => {
    switch (activebtnTab) {
      case 0:
        return (
          headOfficeTrue.length > 0 && (
            <div>
              <div>
                {selectedRow.location?.map((location, index) => {
                  return (
                    location?.headOffice === true && (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          width: "100%",
                          padding: "20px 0px",
                          borderBottom: "2px solid #3f8aa5",
                        }}
                      >
                        <div
                          style={{
                            width: "90%",
                            color: "#3f8aa5",
                            fontSize: "16px",
                          }}
                        >
                          {`${location?.location?.area}, ${location?.location?.city}, ${location?.location?.state}, ${location?.location?.country}, ${location?.location?.zipCode}`}
                        </div>
                        <div
                          className="text-center"
                          title="Delete Location"
                          style={{
                            width: "10%",
                            color: "#3f8aa5",
                            fontSize: "16px",
                          }}
                        >
                          <img
                            onClick={() => removeLocation(location?.sourceId)}
                            src={deletee}
                            style={{ cursor: "pointer" }}
                          ></img>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          )
        );

      case 1:
        return (
          headOfficeFalse.length > 0 && (
            <div>
              <div>
                {selectedRow.location?.map((location, key) => {
                  return (
                    location?.headOffice === false && (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          width: "100%",
                          padding: "20px 0px",
                          borderBottom: "2px solid #3f8aa5",
                        }}
                      >
                        <div
                          style={{
                            width: "10%",
                            color: "#3f8aa5",
                            fontSize: "16px",
                          }}
                        >
                          {key + 1}
                        </div>
                        <div
                          style={{
                            width: "80%",
                            color: "#3f8aa5",
                            fontSize: "16px",
                          }}
                        >
                          {`${location?.location?.area}, ${location?.location?.city}, ${location?.location?.state}, ${location?.location?.country}, ${location?.location?.zipCode}`}
                        </div>
                        <div
                          className="text-center"
                          title="Delete Location"
                          style={{
                            width: "10%",
                            color: "#3f8aa5",
                            fontSize: "16px",
                          }}
                        >
                          <img
                            src={deletee}
                            onClick={() => removeLocation(location?.sourceId)}
                            style={{ cursor: "pointer" }}
                          ></img>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          )
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div
        className="mb-2"
        style={{ fontSize: "24px", color: "#11546f", fontWeight: 500 }}
      >
        User Details
      </div>
      <section className="forms">
        <Row>
          <Col md={12}>
            <div className="w-100 d-flex justify-content-between mb-3">
              <div style={{ width: "85%" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <span
                    className="search-icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#3f8aa5",
                      pointerEvents: "none",
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </span>

                  <input
                    type="search"
                    className="w-100"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #3f8aa5",
                      padding: "10px 30px 10px 35px",
                    }}
                    placeholder="Search"
                    name="search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {userPermissionList.some(
                (permission) =>
                  permission.permissionCode === "INVITE" && permission.checked
              ) && (
                  <button
                    style={{
                      background: "#3F8AA5",
                      border: "none",
                      padding: "10px 30px",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    onClick={() => {
                      handleShowNewUserPopup();
                    }}
                  >
                    Add User
                  </button>
                )}
            </div>
            <Row>
              <Col md={12} style={{ borderRight: "1px solid #bdc1c9" }}>
                <div className="table_setting">
                  <Table striped bordered>
                    <thead style={{ border: "none" }}>
                      <tr
                        className="fixed_tr_section"
                        style={{
                          border: "none",
                          borderBottom: "2px solid #83BBD5",
                        }}
                      >
                        <th
                          style={{
                            width: "6%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Sr
                        </th>
                        <th
                          style={{
                            width: "22%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          First Name
                        </th>
                        <th
                          style={{
                            width: "22%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Last Name
                        </th>
                        <th
                          style={{
                            width: "20%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Status
                        </th>

                        <th
                          style={{
                            width: "20%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Action
                        </th>
                        <th
                          style={{
                            width: "6%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                  </Table>

                  <div style={{ marginTop: "-16px" }}>
                    {!showSkelton ? (
                      filterListValue && filterListValue?.length > 0 ? (
                        filterListValue?.map((data, index) => {
                          const isRowClicked = clickedRow === index; // Check if this row is clicked
                          return (
                            <div key={index} style={{ width: "100%" }}>
                              {/* Row */}
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  padding: "5px 0px",
                                  borderBottom: "2px solid #3f8aa5",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6%",
                                    marginLeft: "10px",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  {index + 1}
                                </div>
                                <div
                                  style={{
                                    width: "23%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  {data && data?.firstName}
                                </div>
                                <div
                                  style={{
                                    width: "21%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  {data && data?.lastName}
                                </div>

                                <div
                                  style={{
                                    width: "21%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                    display: "flex",
                                  }}
                                >
                                  <button
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      width: "100px",
                                      padding: "10px 25px",
                                      border: "1px solid #ffffff",
                                      borderRadius: "5px",
                                      background:
                                        data?.status === 1
                                          ? "#90ee90"
                                          : "#ffffff",
                                      color: data?.status ? "green" : "red",
                                      cursor: "pointer",
                                      outline: "none",
                                      transition: "background 0.3s",
                                    }}
                                    onClick={() =>
                                      handleToggle(data?.userId, data?.status)
                                    }
                                  >
                                    <span>
                                      {data?.status ? "Activate" : "Inactive"}
                                    </span>
                                    <div
                                      style={{
                                        height: "20px",
                                        width: "20px",
                                        backgroundColor:
                                          data?.status === 1 ? "green" : "red",
                                        borderRadius: "5px",
                                        transition: "transform 0.3s",
                                        transform:
                                          data?.status === 1
                                            ? "translateX(20px)"
                                            : "translateX(0px)",
                                      }}
                                    ></div>
                                  </button>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    width: "24%",
                                  }}
                                >
                                  <div
                                    className="text-center hstack gap-3"
                                    title="Add Location"
                                  >
                                    {userPermissionList.some(
                                      (permission) =>
                                        permission.permissionCode ===
                                        "ADDLOCATION" && permission.checked
                                    ) &&
                                      !data?.auditor && (
                                        <img
                                          src={add}
                                          style={{
                                            cursor:
                                              locationList &&
                                                locationList.length === 1
                                                ? "not-allowed"
                                                : "pointer",
                                            opacity:
                                              locationList &&
                                                locationList.length === 1
                                                ? 0.5
                                                : 1, // Grayed out when disabled
                                          }}
                                          onClick={() => {
                                            if (
                                              !(
                                                locationList &&
                                                locationList.length === 1
                                              )
                                            ) {
                                              handleShowNewLocationPopup(
                                                data?.userId,
                                                data?.location
                                              );
                                            }
                                          }}
                                        ></img>
                                      )}

                                    <img
                                      src={mail}
                                      title="Resend Credentials"
                                      onClick={() =>
                                        handleResendCredentials(data?.userId)
                                      }
                                    ></img>
                                    <i
                                      className={`fa ${data?.twoFactorEnabled
                                        ? "fa-lock"
                                        : "fa-unlock"
                                        }`}
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        color: data?.twoFaStatus
                                          ? "#4CAF50"
                                          : "#FFA500",
                                      }}
                                      title={
                                        data?.twoFaStatus
                                          ? "Disable Two-Factor Authentication"
                                          : "Enable Two-Factor Authentication"
                                      }
                                      onClick={() =>
                                        handleToggleTwoFactor(
                                          data?.emailId,
                                          data?.employeeId,
                                          !data?.twoFaStatus
                                        )
                                      }
                                    ></i>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* Clickable Image */}
                                  <div
                                    style={{
                                      borderRadius: "50%",
                                      height: "40px",
                                      width: "40px",
                                      background: "#E6F1F7",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      transition: "transform 0.3s ease",
                                    }}
                                    onClick={() =>
                                      handleImageClick(data, index)
                                    } // Handle click
                                  >
                                    <FontAwesomeIcon
                                      icon={faEye}
                                      style={{
                                        fontSize: "20px",
                                        color: "#000",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <>
                                <Modal
                                  show={isRowClicked && showModalUserDetail}
                                  onHide={handleCloseModal}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>User Details</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div style={{ padding: "20px" }}>
                                      {/* Name Section */}
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: "10px",
                                          marginBottom: "20px",
                                        }}
                                      >
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: "8px",
                                              color: "#333",
                                            }}
                                          >
                                            First Name
                                          </label>
                                          <input
                                            type="text"
                                            value={data?.firstName || ""}
                                            placeholder="First Name"
                                            style={{
                                              width: "100%",
                                              padding: "10px",
                                              border: "1px solid #ddd",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: "8px",
                                              color: "#333",
                                            }}
                                          >
                                            Last Name
                                          </label>
                                          <input
                                            type="text"
                                            value={data?.lastName || ""}
                                            placeholder="Last Name"
                                            style={{
                                              width: "100%",
                                              padding: "10px",
                                              border: "1px solid #ddd",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Email Address Section */}
                                      <div
                                        style={{
                                          marginBottom: "20px"
                                        }}
                                      >
                                        <label
                                          style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginBottom: "8px",
                                            color: "#333",
                                          }}
                                        >
                                          Email Address
                                        </label>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          <span role="img" aria-label="email">
                                            📧
                                          </span>
                                          <input
                                            type="email"
                                            value={data?.emailId || ""}
                                            placeholder="Email Address"
                                            style={{
                                              border: "none",
                                              outline: "none",
                                              width: "100%",
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Employee ID Section */}
                                      <div>
                                        <label
                                          style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginBottom: "8px",
                                            color: "#333",
                                          }}
                                        >
                                          Employee ID
                                        </label>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          <input
                                            type="employeeId"
                                            value={data?.employeeId || ""}
                                            placeholder="Employee ID"
                                            style={{
                                              border: "none",
                                              outline: "none",
                                              width: "100%",
                                            }}
                                          />
                                        </div>
                                      </div>


                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: "10px",
                                          marginBottom: "20px",
                                        }}
                                        className="mt-3"
                                      >
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: "8px",
                                              color: "#333",
                                            }}
                                          >
                                            Mobile
                                          </label>
                                          <input
                                            type="text"
                                            value={data?.mobileNumber || ""}
                                            placeholder="Mobile Number"
                                            style={{
                                              width: "100%",
                                              padding: "10px",
                                              border: "1px solid #ddd",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            style={{
                                              display: "block",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: "8px",
                                              color: "#333",
                                            }}
                                          >
                                            Role
                                          </label>
                                          <input
                                            type="text"
                                            value={data?.role || ""}
                                            placeholder="Role"
                                            style={{
                                              width: "100%",
                                              padding: "10px",
                                              border: "1px solid #ddd",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label
                                          style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginBottom: "8px",
                                            color: "#333",
                                          }}
                                        >
                                          Designation
                                        </label>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          <input
                                            type="email"
                                            value={data?.designation || ""}
                                            placeholder="Designation"
                                            style={{
                                              border: "none",
                                              outline: "none",
                                              width: "100%",
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label
                                          style={{
                                            display: "block",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginBottom: "8px",
                                            color: "#333",
                                          }}
                                        >
                                          Joining Date
                                        </label>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            fontSize: "14px",
                                          }}
                                        >
                                          <span role="img" aria-label="calendar">
                                            📅
                                          </span>
                                          <input
                                            type="text"
                                            value={data?.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : "Not available"}
                                            placeholder="Joining Date"
                                            style={{
                                              border: "none",
                                              outline: "none",
                                              width: "100%",
                                            }}
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                      {data.location.length > 0 && (
                                        <div
                                          className="d-flex justify-content-between buttoncont mt-4 mb-3"
                                          style={{
                                            width: "35%",
                                            display: "flex",
                                            gap: "10px",
                                          }}
                                        >
                                          <button
                                            className={`btn button ${activebtnTab === 0
                                              ? "activebtn"
                                              : ""
                                              }`}
                                            onClick={() => handleTabClick(0)}
                                            style={{
                                              padding: "8px 16px",
                                              border: "1px solid #3f88a5",
                                              backgroundColor:
                                                activebtnTab === 0
                                                  ? "#3f88a5"
                                                  : "#ffffff",
                                              color:
                                                activebtnTab === 0
                                                  ? "#ffffff"
                                                  : "#3f88a5",
                                              borderRadius: "4px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Corporate Headquarter
                                          </button>
                                          <button
                                            className={`btn button ${activebtnTab === 1
                                              ? "activebtn"
                                              : ""
                                              }`}
                                            onClick={() => handleTabClick(1)}
                                            style={{
                                              padding: "8px 16px",
                                              border: "1px solid #3f88a5",
                                              backgroundColor:
                                                activebtnTab === 1
                                                  ? "#3f88a5"
                                                  : "#ffffff",
                                              color:
                                                activebtnTab === 1
                                                  ? "#ffffff"
                                                  : "#3f88a5",
                                              borderRadius: "4px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Regional Office
                                          </button>
                                        </div>
                                      )}

                                      {/* Render Additional UI */}
                                      {renderUI()}
                                    </div>
                                  </Modal.Body>

                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleCloseModal}
                                    >
                                      Close
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </>
                            </div>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )
                    ) : (
                      <Loader />
                    )}
                  </div>

                  <div className="Page navigation example"></div>
                </div>
              </Col>
              {!showSkelton ? selectedRow && <></> : <Loader />}
            </Row>
          </Col>
        </Row>
      </section>
      {reassignShow === true && (
        <ReAssignQuestions
          usersId={usersId}
          financialYearId={6}
          reassignShow={reassignShow}
          onHide={handleReassignClose}
          type="USERID"
        />
      )}
      <Modal show={addNewUserPopup} onHide={handleCloseNewUserPopup} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Add New User Account</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <div className="forms">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label fw-bold">
                    Enter User information
                  </label>
                  <Row>
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <input
                          className="select_one industrylist"
                          aria-expanded="false"
                          placeholder="First Name*"
                          name="firstName"
                          type="text"
                          onChange={handleChange}
                        />
                        {submitted && !userDetails.firstName && (
                          <div className="help-block">
                            First Name is Required
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <input
                          className="select_one industrylist"
                          aria-expanded="false"
                          placeholder="Last Name"
                          name="lastName"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <input
                          className="select_one industrylist"
                          aria-expanded="false"
                          placeholder="Email*"
                          name="emailId"
                          type="email"
                          onChange={handleChange}
                        />
                        {submitted && !userDetails.emailId && !userDetails.employeeId && (
                          <div className="help-block">
                            At least one of Email or Employee ID (or both) is required
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <input
                          className="select_one industrylist"
                          aria-expanded="false"
                          placeholder="Employee ID*"
                          name="employeeId"
                          type="number"
                          onChange={handleChange}
                        />
                        {submitted && !userDetails.employeeId && !userDetails.emailId && (
                          <div className="help-block">
                            At least one of Email or Employee ID (or both) is required
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <select
                          className="select_one industrylist"
                          onChange={(e) => {
                            setRoleId(e.target.value);
                          }}
                        >
                          <option value="">Select Role</option>
                          {roleList?.length > 0 &&
                            roleList?.map((data, index) => {
                              return (
                                <option key={index} value={data?.id}>
                                  {data?.role_name}
                                </option>
                              );
                            })}
                        </select>
                        {submitted && !userDetails.role_name && (
                          <div className="help-block">Role is Required</div>
                        )}
                      </div>
                    </Col>
                    {roleId == 30 ? (
                      <></>
                    ) : (
                      <>
                        <Col md={6}>
                          <PhoneInput
                            country={"in"}
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                            enableSearch={true}
                          />
                        </Col>
                        <Col md={6}>
                          <div className="form-group pb-3">
                            <select
                              className="select_one industrylist"
                              onChange={(e) => {
                                setDesignationId(e.target.value);
                              }}
                            >
                              <option value="">Select Designation</option>
                              {designationList?.length > 0 &&
                                designationList?.map((data, index) => {
                                  return (
                                    <option key={index} value={data?.id}>
                                      {data?.designation}
                                    </option>
                                  );
                                })}
                            </select>
                            {submitted && !userDetails.designation && (
                              <div className="help-block">
                                Designation is Required
                              </div>
                            )}
                          </div>
                        </Col>{" "}
                      </>
                    )}

                    {/* Updated Gender Field to match input style */}
                    <Col md={6}>
                      <div className="form-group pb-3">
                        <select
                          className="select_one industrylist"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </Col>

                    {companyId == 362 && <>
                      <Col md={6}>
                        <div className="form-group pb-3">
                          <select
                            className="select_one industrylist"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                          >
                            <option value="">Select Category</option>
                            {AudienceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="form-group pb-3">
                          <select
                            className="select_one industrylist"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          >
                            <option value="">Select Company</option>
                            {companyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="form-group pb-3">
                          <select
                            className="select_one industrylist"
                            value={businessUnit}
                            onChange={(e) => setBusinessUnit(e.target.value)}
                          >
                            <option value="">Select Business Unit</option>
                            {businessUnitOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="form-group pb-3">
                          <select
                            className="select_one industrylist"
                            value={division}
                            onChange={(e) => setDivision(e.target.value)}
                          >
                            <option value="">Select Division</option>
                            {divisionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="form-group pb-3">
                          <select
                            className="select_one industrylist"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                          >
                            <option value="">Select Department</option>
                            {departmentOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group pb-3">
                     <div style={{ position: "relative" }}>
  {!joiningDate && (
    <span
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#999",
        fontSize: "14px",
        pointerEvents: "none"
      }}
    >
      Select Joining Date
    </span>
  )}
  <input
    className="select_one industrylist"
    type="date"
    value={joiningDate}
    onChange={(e) => setJoiningDate(e.target.value)}
    style={{
      color: joiningDate ? "#000" : "transparent",
      fontSize: "14px",
      paddingLeft: "10px",
    }}
  />
</div>

                          {/* {!joiningDate && (
                            <label
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '12px',
                                transform: 'translateY(-50%)',
                                color: '#999',
                                pointerEvents: 'none',
                                fontSize: '14px',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              Joining Date
                            </label>
                          )} */}
                        </div>
                      </Col>
                    </>}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            onClick={handleCloseNewUserPopup}
          >
            Cancel
          </button>
          {updateLoader ? (
            <button className="new_button_style" disabled>
              <Spinner animation="border" /> Sending...
            </button>
          ) : (
            <button
              type="submit"
              className="new_button_style"
              disabled={
                !userDetails?.firstName ||
                (!userDetails?.emailId && !userDetails?.employeeId) ||
                !roleId
              }
              onClick={(e) => sendInvite()}
            >
              Add User
            </button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={addNewLocationPopup}
        onHide={handleCloseLocationPopup}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <div className="forms">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label fw-bold">
                    Enter User Location
                  </label>
                  <Row>
                    <Col>
                      <div className="form-group pb-3">
                        <Multiselect
                          placeholder="Select Location"
                          displayValue="locationData"
                          className="multi_select_dropdown w-100"
                          options={locationList}
                          // ref={multiselectRef}
                          onRemove={onRemoveSourceHandler}
                          onSelect={onSelectSourceHandler}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleCloseNewUserPopup}>
            Cancel
          </Button>
          {updateLoader ? (
            <Button variant="info" disabled>
              <Spinner animation="border" /> Adding
            </Button>
          ) : (
            <Button
              variant="info"
              disabled={!source_ids.length}
              onClick={(e) => addLocation()}
            >
              Add Location
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {showModal && (
        <Modal show={showModal} onHide={handleNoClick} size="md">
          <Modal.Header closeButton>
            <Modal.Title>
              {enable ? (
                <>Activate Confirmation?</>
              ) : (
                <>Deactivate Confirmation?</>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {enable ? (
              <div style={{ fontSize: "16px" }}>
                Are you sure you want to Active your user status?
              </div>
            ) : (
              <div style={{ fontSize: "16px" }}>
                Are you sure you want to Deactivate your user status?
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleNoClick}>
              No
            </Button>
            {useLoader ? (
              <Button variant="info" disabled>
                <Spinner animation="border" />
              </Button>
            ) : (
              <Button variant="info" onClick={actionUser}>
                Yes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      <Modal show={deleteModal} onHide={closeDeleteDesignationPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            type="submit"
            onClick={() => deleteLocation()}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default SubUsers;