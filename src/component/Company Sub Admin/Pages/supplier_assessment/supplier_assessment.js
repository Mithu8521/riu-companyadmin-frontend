import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import "./supplier_assessment.css";
import Table from "react-bootstrap/Table";
import config from "../../../../config/config.json";
import Multiselect from "multiselect-react-dropdown";
import { apiCall } from "../../../../_services/apiCall";
import Loader from "../../../loader/Loader";
import NoDataFound from "../../../../img/no.png";

export default function Supplier_assessment(props) {
  const location = useLocation();
  const financialYearRef = useRef();
  const multiselectRefTracker = useRef();
  const [assessmentValue, setAssessmentValue] = useState([]);
  const [functionName, setFunctionName] = useState();
  const [modeType, setModeType] = useState();
  const [mode, setMode] = useState("create");
  const handleCloseFrameworkAssessmentPopup = () =>
    setShowFrameworkAssessmentPopup(false);
  const [showFrameworkAssessmentPopup, setShowFrameworkAssessmentPopup] =
    useState(false);
  const [showAddQuestionAssessmentPopup, setShowAddQuestionAssessmentPopup] =
    useState(false);
  const [showSupplierPopup, setShowSupplierPopup] = useState(false);
  const [viewUsersPopup, setViewUsersPopup] = useState(false);

  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [showCreateAssessmentPopup, setShowCreateAssessmentPopup] =
    useState(false);
  const handleCloseSupplierPopup = () => setShowSupplierPopup(false);
  const handleCloseAddQuestionPopup = () => setShowAddQuestionPopup(false);
  const closeConfirmationPopup = () => setConfirmationPopup(false);

  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [financialYearId, setFinancialYearId] = useState(null);
  const [financialYearData, setFinancialYearData] = useState([]);
  const [supplierAssessmentList, setSupplierAssessmentList] = useState([]);
  const [assessmentQuestion, setAssessmentQuestion] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [supplierUserData, setSupplierUserData] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [selectedQuestionData, setSelectedQuestionData] = useState([]);
  const [selectedFrameworkIds, setSelectedFrameworkIds] = useState([]);
  const [selectedFrameworkData, setSelectedFrameworkData] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [selectedTopicData, setSelectedTopicData] = useState([]);
  const [frameworkData, setFrameworkData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [topicsList, setTopicsList] = useState([]);

  const [selectedPreviousAssesmentIds, setSelectedPreviousAssesmentIds] =
    useState([]);
  const [selectedPreviousAssesmentData, setSelectedPreviousAssesmentData] =
    useState([]);
  const handleCloseAssessmentPopup = () => {
    setShowCreateAssessmentPopup(false);
    if ("handleShowAddQuestionAssessmentPopup" === functionName) {
      handleShowAddQuestionAssessmentPopup();
    } else if ("handleShowAddQuestionAssessmentPopup" === functionName) {
      handleShowAddQuestionAssessmentPopup();
    }
  };

  const handleShowCreateAssessmentPopup = (e, name) => {
    e.preventDefault();
    console.log();
    if (name === "CREATE_NEW_ASSSESSMENT") {
      getFinancialYear();
    }
    setFunctionName(name);
    setShowCreateAssessmentPopup(true);
    setShowAddQuestionAssessmentPopup(false);
    setMode("create");
  };
  const handleShowAddQuestionPopup = (fId, id) => {
    setAssessmentId(id);
    getAssessmentQuestion(fId);
    setShowAddQuestionPopup(true);
  };

  const showUpdateTopicPopup = (id) => {
    setAssessmentId(id);
    setMode("edit");
    setShowCreateAssessmentPopup(true);
  };

  const handleConfirmationPopup = (id) => {
    setConfirmationPopup(true);
    setAssessmentId(id);
  };

  const handleViewUserPopup = (ids) => {
    setViewUsersPopup(true);
    const filteredArray = menuList.filter((obj) => ids.includes(obj.id));
    setSupplierUserData(filteredArray);
  };
  const handleShowSupplierPopup = (id) => {
    setShowSupplierPopup(true);
    setAssessmentId(id);
  };

  const closeViewUsersPopup = () => {
    setViewUsersPopup(false);
    setSupplierUserData([]);
  };
  const handleCloseAddQuestionAssessmentPopup = () => {
    setShowFrameworkAssessmentPopup(true);
    setShowAddQuestionAssessmentPopup(false);
  };

  const handleShowAddQuestionAssessmentPopup = () => {
    if (modeType === "ByFrameworks") {
      getFrameworkQuestion();
    } else {
      const questionIdsSet = new Set(
        selectedPreviousAssesmentData.flatMap((obj) =>
          JSON.parse(obj.questionIds)
        )
      );
      getAssessmentQuestion(null, [...questionIdsSet]);
    }

    setShowAddQuestionAssessmentPopup(true);
    setShowFrameworkAssessmentPopup(false);
  };

  const handleShowFrameworkAssessmentPopup = (mode) => {
    setShowFrameworkAssessmentPopup(true);
    if (mode === "ByFrameworks") {
      fetchFramework();
    }
    setModeType(mode);
  };

  const createSupplierAssessment = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createSupplierAssessment`,
      {},
      {
        title: assessmentTitle,
        financialYearId: Number(financialYearId),
        questionIds: selectedQuestionIds,
        mode: modeType,
        questionData: selectedQuestionData,
      },
      "POST"
    );
    if (isSuccess) {
      setAssessmentTitle("");
      setFinancialYearId(null);
      setSelectedQuestionIds([]);
      setSelectedQuestionData([]);
      setShowFrameworkAssessmentPopup(false);
      setShowFrameworkAssessmentPopup(false);
      setShowSupplierPopup(false);
      setShowAddQuestionPopup(false);
      setShowCreateAssessmentPopup(false);
      await getFinancialYear();
      getSupplierAssessment();
    }
  };

  const deleteSupplierAssessment = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `deleteSupplierAssessment`,
      {},
      {
        assessmentId: assessmentId,
      },
      "POST"
    );
    if (isSuccess) {
      setAssessmentId(null);
      closeConfirmationPopup();
      await getFinancialYear();
      getSupplierAssessment();
    }
  };

  const assignAssessment = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `assignAssessment`,
      {},
      {
        assessmentId: assessmentId,
        userIds: selectedUserIds,
      },
      "POST"
    );
    if (isSuccess) {
      setAssessmentId(null);
      setSelectedUserIds([]);
      setSelectedUserData([]);
      handleCloseSupplierPopup();
      await getFinancialYear();
      getSupplierAssessment();
    }
  };

  const updateSupplierAssessment = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updateSupplierAssessment`,
      {},
      {
        assessmentId: assessmentId,
        title: assessmentTitle,
        financialYearId: Number(financialYearId),
        questionIds: selectedQuestionIds,
      },
      "POST"
    );
    if (isSuccess) {
      setAssessmentId(null);
      setAssessmentTitle("");
      setFinancialYearId(null);
      setSelectedQuestionIds([]);
      setSelectedQuestionData([]);
      handleCloseAssessmentPopup();
      handleCloseAddQuestionAssessmentPopup();
      handleCloseFrameworkAssessmentPopup();
      handleCloseAddQuestionPopup();
      handleCloseSupplierPopup();
      handleCloseAssessmentPopup();
      await getFinancialYear();
      getSupplierAssessment();
    }
  };

  const getSupplierAssessment = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSupplierAssessment`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setSupplierAssessmentList(data.data.reverse());
    }
  };

  const getAssessmentQuestion = async (fid, questionIds) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAssessmentQuestion`,
      {},
      { financialYearId: fid, questionIds: questionIds },
      "GET"
    );
    if (isSuccess) {
      setAssessmentQuestion(data.data.reverse());
    }
  };

  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setFinancialYearData(data.data);
    }
  };
  const fetchFramework = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL" }
    );
    if (isSuccess) {
      setFrameworkData(data?.data);
    }
  };

  const fetchTopicData = async (framworkIds) => {
    if (framworkIds && framworkIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTopic`,
        {},
        { type: "ESG", frameworkIds: framworkIds }
      );
      if (isSuccess) {
        const topics = data?.data;
        const mergedArray = topics.mandatory_topics.concat(
          topics.voluntary_topics,
          topics.custom_topics
        );
        setTopicsList(mergedArray);
      }
    }
  };
  const getFrameworkQuestion = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrameworkQuestion`,
      {},
      {
        type: "CUSTOM",
        financialYearId: 6,
        frameworkIds: selectedFrameworkIds,
        topicIds: selectedTopicIds,
      }
    );
    if (isSuccess) {
      setAssessmentQuestion(data?.data);
    }
  };
  const onSelectHandler = (data, type) => {
    const selectedIds = data && data.map(({ id }) => id);
    if (type === "USER") {
      setSelectedUserIds(selectedIds || []);
      setSelectedUserData(data || []);
    } else if (type === "QUESTION") {
      setSelectedQuestionIds(selectedIds || []);
      setSelectedQuestionData(data || []);
    } else if (type === "PREVIOUS_ASSESSMENT") {
      setSelectedPreviousAssesmentIds(selectedIds || []);
      setSelectedPreviousAssesmentData(data || []);
    } else if (type === "FRAMEWORK") {
      setSelectedFrameworkData(data || []);
      setSelectedFrameworkIds(selectedIds || []);
      fetchTopicData(selectedIds);
    } else if (type === "TOPIC") {
      setSelectedTopicData(data || []);
      setSelectedTopicIds(selectedIds || []);
    }
  };

  const onRemoveHandler = (data, type) => {
    if (data && data.length === 0) {
      if (type === "USER") {
        setSelectedUserIds([]);
        setSelectedUserData([]);
      } else if (type === "QUESTION") {
        setSelectedQuestionIds([]);
        setSelectedQuestionData([]);
      } else if (type === "PREVIOUS_ASSESSMENT") {
        setSelectedFrameworkData([]);
      } else if (type === "FRAMEWORK") {
        setSelectedFrameworkData([]);
        setSelectedFrameworkIds([]);
      } else if (type === "TOPIC") {
        setSelectedFrameworkData([]);
        setSelectedTopicIds([]);
      }
    } else {
      onSelectHandler(data, type);
    }
  };

  useEffect(() => {
    getFinancialYear();
    getSupplierAssessment();
  }, []);

  const menuList = [
    {
      id: 1,
      fullName: "Roop Chandra",
      email: "roop@yopmail.com",
      location: {
        area: "Rest area, Rest area, 152 d, National Highway 152D",
        city: "Nidana",
        state: "Haryana",
        country: "India",
        zipCode: "124111",
      },
    },
    {
      id: 2,
      fullName: "Dipak",
      email: "vermadipak@yopmail.com",
      location: {
        area: "Rest area, Rest area, 152 d, National Highway 152D",
        city: "Nidana",
        state: "Haryana",
        country: "India",
        zipCode: "124111",
      },
    },
    {
      id: 3,
      fullName: "Mithilesh Kumar",
      email: "mithilesh@yopmail.com",
      location: {
        area: "Rest area, Rest area, 152 d, National Highway 152D",
        city: "Nidana",
        state: "Haryana",
        country: "India",
        zipCode: "124111",
      },
    },
  ];

  return (
    <div>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <section className="inner_wraapper px-3 pt-3">
          <div className="color_div_on steps-form">
            <div
              className="steps-row setup-panel"
              style={{ overflow: "hidden" }}
            >
              <div className="tabs-top setting_admin my-0">
                <ul>
                  <li>
                    <NavLink to={"/supplier_assessment"} className="activee">
                      Supplier Assesment Lististing
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="dropping_btn">
              <Dropdown className="mx-2">
                <Dropdown.Toggle
                  className="new_button_style_white"
                  id="dropdown-basic"
                >
                  Create Assesment
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) =>
                      handleShowCreateAssessmentPopup(
                        e,
                        "CREATE_NEW_ASSSESSMENT"
                      )
                    }
                  >
                    New Assessment
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      handleShowFrameworkAssessmentPopup("PreviousAssessment")
                    }
                  >
                    Previous Assessment
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      handleShowFrameworkAssessmentPopup("ByFrameworks")
                    }
                  >
                    By Frameworks
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="Introduction">
            {supplierAssessmentList && supplierAssessmentList?.length > 0 ? (
              <div className="table_setting">
                <Table striped bordered>
                  <thead>
                    <tr className="fixed_tr_section">
                      <th style={{ width: 55 }}>Sr</th>
                      <th>Assessment Title</th>
                      <th>Financial Year</th>
                      <th style={{ width: 150, textAlign: "center" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  {!showSkelton ? (
                    <tbody>
                      {supplierAssessmentList?.map((item, key) => (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{item?.title}</td>
                          <td>
                            {
                              financialYearData.find(
                                (obj) => obj.id === item?.financialYearId
                              )?.financial_year_value
                            }
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-3">
                              <i
                                title="Add Question"
                                className="fas fa-plus-square"
                                onClick={() =>
                                  handleShowAddQuestionPopup(
                                    item?.financialYearId,
                                    item?.id
                                  )
                                }
                              ></i>
                              {item?.isEditable && (
                                <i
                                  title="Edit Assessment"
                                  className="fas fa-edit"
                                  onClick={(e) =>
                                    showUpdateTopicPopup(item?.id)
                                  }
                                ></i>
                              )}
                              <NavLink
                                to={{
                                  pathname:
                                    "/supplier_assessment_question_list",
                                  state: {
                                    data: item,
                                  },
                                }}
                              >
                                <i
                                  title="View Question"
                                  className="fas fa-eye"
                                ></i>
                              </NavLink>
                              <i
                                title="View Assign User"
                                onClick={() =>
                                  handleViewUserPopup(JSON.parse(item?.userIds))
                                }
                                className="fas fa-eye"
                              ></i>
                              {item?.isAssignable && (
                                <i
                                  title="Assign"
                                  className="fas fa-sign-in-alt"
                                  onClick={() =>
                                    handleShowSupplierPopup(item?.id)
                                  }
                                ></i>
                              )}
                              {item?.isDeletable && (
                                <i
                                  title="Delete Assessment"
                                  className="fas fa-trash-alt"
                                  style={{ color: "red" }}
                                  onClick={() =>
                                    handleConfirmationPopup(item?.id)
                                  }
                                ></i>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <Loader />
                  )}
                </Table>
              </div>
            ) : (
              <div className="hstack justify-content-center">
                <img src={NoDataFound} alt="" srcSet="" />
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        show={showCreateAssessmentPopup}
        onHide={handleCloseAssessmentPopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <Form.Label>
              {mode === "create" ? "Create" : "Update"} Assessment
            </Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Control
                required
                type="text"
                placeholder="Assessment Title"
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <div>
                <select
                  className="select___year"
                  ref={financialYearRef}
                  placeholder="select financial year"
                  onChange={(e) => setFinancialYearId(e.target.value)}
                >
                  <option value="">Select Financial Year</option>
                  {financialYearData.map((yeardata) => (
                    <option key={yeardata.id} value={yeardata.id}>
                      {yeardata.financial_year_value}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            onClick={
              mode === "create"
                ? createSupplierAssessment
                : updateSupplierAssessment
            }
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddQuestionAssessmentPopup}
        onHide={handleCloseAddQuestionAssessmentPopup}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Add Question</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Select Question</Form.Label>
          <Multiselect
            displayValue="title"
            options={assessmentQuestion}
            ref={multiselectRefTracker}
            selectedValues={selectedQuestionData}
            onRemove={(removedItem) => onRemoveHandler(removedItem, "QUESTION")}
            onSelect={(selectedItems) =>
              onSelectHandler(selectedItems, "QUESTION")
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            onClick={(e) =>
              handleShowCreateAssessmentPopup(
                e,
                modeType === "ByFrameworks"
                  ? "handleShowAddQuestionAssessmentPopup"
                  : "handleShowAddQuestionAssessmentPopup"
              )
            }
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFrameworkAssessmentPopup}
        onHide={handleCloseFrameworkAssessmentPopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>
              {modeType === "ByFrameworks"
                ? "Framework"
                : "Previous Assessment"}
            </Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>
            Select{" "}
            {modeType === "ByFrameworks" ? "Framework" : "Previous Assessment"}
          </Form.Label>
          {modeType === "ByFrameworks" ? (
            <>
              <Col md={12} className="mt-2">
                <div>
                  <Multiselect
                    displayValue="title"
                    options={frameworkData}
                    // selectedValues={selectedFramework}
                    ref={multiselectRefTracker}
                    onRemove={(e) => {
                      onRemoveHandler(e, "FRAMEWORK");
                    }}
                    onSelect={(e) => {
                      onSelectHandler(e, "FRAMEWORK");
                    }}
                  />
                </div>
              </Col>
              <Col md={12} className="mt-2">
                <div>
                  <Form.Label className="m-0">Based on Topic</Form.Label>
                  <Multiselect
                    displayValue="title"
                    options={topicsList}
                    // selectedValues={selectedFramework}
                    ref={multiselectRefTracker}
                    onRemove={(e) => {
                      onRemoveHandler(e, "TOPIC");
                    }}
                    onSelect={(e) => {
                      onSelectHandler(e, "TOPIC");
                    }}
                  />
                </div>
              </Col>
            </>
          ) : (
            <Multiselect
              displayValue="title"
              options={
                modeType === "ByFrameworks"
                  ? assessmentValue
                  : supplierAssessmentList
              }
              selectedValues={
                modeType === "ByFrameworks"
                  ? assessmentValue
                  : selectedQuestionData
              }
              onRemove={(removedItem) =>
                modeType === "ByFrameworks"
                  ? onRemoveHandler(removedItem, "QUESTION")
                  : onRemoveHandler(removedItem, "PREVIOUS_ASSESSMENT")
              }
              onSelect={(selectedItems) =>
                modeType === "ByFrameworks"
                  ? onSelectHandler(selectedItems, "QUESTION")
                  : onSelectHandler(selectedItems, "PREVIOUS_ASSESSMENT")
              }
              ref={multiselectRefTracker}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            onClick={
              modeType === "ByFrameworks"
                ? handleShowAddQuestionAssessmentPopup
                : handleShowAddQuestionAssessmentPopup
            }
          >
            Add Assessment
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddQuestionPopup}
        onHide={handleCloseAddQuestionPopup}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Add Question</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Multiselect
              displayValue="title"
              options={assessmentQuestion}
              ref={multiselectRefTracker}
              selectedValues={selectedQuestionData}
              onRemove={(removedItem) =>
                onRemoveHandler(removedItem, "QUESTION")
              }
              onSelect={(selectedItems) =>
                onSelectHandler(selectedItems, "QUESTION")
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            onClick={updateSupplierAssessment}
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSupplierPopup} onHide={handleCloseSupplierPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Assign Assessment</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Multiselect
              placeholder="Select Supplier"
              displayValue="fullName"
              className="multi_select_dropdown w-100"
              selectedValues={selectedUserData}
              options={menuList}
              onRemove={(removedItem) => onRemoveHandler(removedItem, "USER")}
              onSelect={(selectedItems) =>
                onSelectHandler(selectedItems, "USER")
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style" onClick={assignAssessment}>
            Assign Assessment
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={confirmationPopup} onHide={closeConfirmationPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Confirmation</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            type="submit"
            onClick={() => deleteSupplierAssessment()}
          >
            YES
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={viewUsersPopup} onHide={closeViewUsersPopup} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Assign Supplier</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered striped hover>
            {supplierUserData.length ? (
              <>
                <thead>
                  <tr style={{ background: "#ccc" }}>
                    <th>Sr.</th>
                    <th>
                      <b>Name </b>
                    </th>
                    <th>
                      <b>Email </b>
                    </th>
                    <th>
                      <b>Address </b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supplierUserData?.map((data, key) => {
                    return (
                      <tr>
                        <>
                          <td>{key + 1}</td>
                          <td>{data?.fullName}</td>
                          <td>{data?.email}</td>
                          <td>
                            {`${data.location?.area}, ${data?.location?.city}, ${data?.location?.state}, ${data?.location?.country}, ${data?.location?.zipCode}`}
                          </td>
                        </>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            ) : (
              <div className="hstack justify-content-center">
                <img src={NoDataFound} alt="" srcSet="" />
              </div>
            )}
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}
