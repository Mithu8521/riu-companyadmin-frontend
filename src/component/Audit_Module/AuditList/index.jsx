import React, { useEffect, useState } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import AssignQuestions from "../../Company Sub Admin/Component/Sector Questions/AssignQuestions";
import swal from "sweetalert";
import "./AuditDetails.css";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import QuestionTypeTabSection from "../../Company Sub Admin/Component/Sector Questions/QuestionTypeTabSection";
import AuditListingFilter from "../../Company Sub Admin/Component/Sector Questions/Filter/AuditListingFilter";
import Maximize from "../../../img/sector/maximize.png";
import Minimize from "../../../img/sector/minimize.png";
import AuditCard from "./AuditCard";
import Loader from "../../loader/Loader";
import NoDataFound from "../../../img/no.png";
import AuditAnswers from "./AuditAnswers";
import { Col, Row, Table, Modal, Button, Accordion } from "react-bootstrap";
import QuestionTypeTab from "./QuestionTypeTab";
import { findDOMNode } from "react-dom";

const AuditList = ({ props, listing }) => {
  const [audit_Data, setAudit_Data] = useState([]);
  const [datas, setDatas] = useState([]);
  const [filterAuditData, setFilterAuditData] = useState([]);
  const location = useLocation();
  const [leftWidth, setLeftWidth] = useState(6);
  const [rightWidth, setRightWidth] = useState(6);
  const [hideCol, setHideCol] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState();
  const [financialYearId, setFinancialYearId] = useState(0);
  const [financialYear, setFinancialYear] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [status, setStatus] = useState([]);
  const [update, setUpdate] = useState([]);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState("All");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hideAnswerCol, setHideAnswerCol] = useState(false);
  const [auditAnswer, setAuditAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const [groupedTopicsData, setGroupedTopicsData] = useState(null);
  const [assignedList, setAssignedList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [processingList, setProcessingList] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");
  const [groupData, setGroupData] = useState([]);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const findQuestionIds = (str) => {
    let commaSeparated = str?.split(",") ?? str.trim();

    let questionIds = [];
    let hyphenatedRange = [];

    commaSeparated?.map((data) => {
      data = data.toString().trim();
      if (data.toString().includes("-")) hyphenatedRange.push(data);
      else questionIds.push(parseInt(data));
    });

    hyphenatedRange.map((range) => {
      range = range.split("-");
      let start = range[0];
      let end = range[1];

      for (let i = start; i <= end; i++) {
        questionIds.push(parseInt(i));
      }
    });

    setSelectedQuestionIds(questionIds);
  };
  useEffect(() => {
    if (!filterAuditData?.length) {
      setLeftWidth(12);
      setRightWidth(0);
      setHideAnswerCol(true);
    } else {
      setLeftWidth(6);
      setRightWidth(6);
      setHideAnswerCol(false);
    }
  }, [filterAuditData]);

  const [allQuestionList, setAllAllQuestionList] = useState({
    quantitative: [],
    tabular_question: [],
    qualitative: [],
    yes_no: [],
    quantitative_trends: [],
  });

  const answerWidth = () => {
    setLeftWidth(0);
    setRightWidth(12);
    setHideCol(true);
  };

  const questionWidth = () => {
    setLeftWidth(6);
    setRightWidth(6);
    setHideCol(false);
  };

  const getAuditListing = async (fid, topicId) => {
    setIsLoading(true);
    const { isSuccess, data, error } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAuditListing`,
      {},
      {
        topicIds: topicId,
        kpiIds: [],
        financialYearId: fid,
        question_id: selectedQuestionIds ? `[${selectedQuestionIds}]` : [],
        questionType: selectedQuestionType ? selectedQuestionType : "",
        questionnaire_type: questionnaire ? `[${questionnaire}]` : [],
        update_type: update ? `[${update}]` : [],
        audit_status: status ? `[${status}]` : [],
        supplier_company_id: selectedSupplier ? selectedSupplier : "",
        financial_year: selectedFinancialYear ? selectedFinancialYear : "",
        muduleType: "AUDIT",
      }
    );

    if (isSuccess) {
      const groupedTopicsData = data.data.reduce((acc, obj) => {
        const { report_id, topic_name, ...rest } = obj["question"];
        if (!acc[topic_name]) {
          acc[topic_name] = [];
        }
        acc[topic_name].push({ report_id, topic_name, ...rest });
        return acc;
      }, {});
      setGroupedTopicsData(groupedTopicsData);
      // setGroupData(groupedData);
      setDatas(data?.data);
      // setAudit_Data(data?.data);
      // setFilterAuditData(data?.data);
      // setSelectedRow(data?.data[0]?.questionId);
      // setAuditAnswer(data?.data[0]);
      setAssignedList(data?.getAssignedDetails);
      setIsLoading(false);
      getSource();
      getProcess();
      // setAllAllQuestionList({
      //   quantitative: [],
      //   tabular_question: [],
      //   qualitative: [],
      //   yes_no: [],
      //   quantitative_trends: [],
      // });
      // const responseData = data.data;
      // const newData = {}; // Use a new object to store the updated input fields
      // for (let i = 0; i < responseData.length; i++) {
      //   const item = responseData[i];
      //   const id = item?.questionId;

      //   newData[id] = {
      //     question_id: item?.questionId,
      //     questionType: item?.questionType ?? item?.questionType,
      //     answer: "",
      //     // answer_id: -1,
      //     status: false,
      //   };
      //   if (item.questionType === "tabular_question") {
      //     setAllAllQuestionList((prevState) => ({
      //       ...prevState,
      //       tabular_question: [...prevState.tabular_question, item],
      //     }));
      //   } else if (item.questionType === "quantitative") {
      //     setAllAllQuestionList((prevState) => ({
      //       ...prevState,
      //       quantitative: [...prevState.quantitative, item],
      //     }));
      //   } else if (item.questionType === "qualitative") {
      //     setAllAllQuestionList((prevState) => ({
      //       ...prevState,
      //       qualitative: [...prevState.qualitative, item],
      //     }));
      //   } else if (item.questionType === "yes_no") {
      //     setAllAllQuestionList((prevState) => ({
      //       ...prevState,
      //       yes_no: [...prevState.yes_no, item],
      //     }));
      //   } else if (item.questionType === "quantitative_trends") {
      //     setAllAllQuestionList((prevState) => ({
      //       ...prevState,
      //       quantitative_trends: [...prevState.quantitative_trends, item],
      //     }));
      //   }
      // }
    }
    if (error) {
      setAudit_Data(data);
      setIsLoading(false);
      swal({
        icon: "error",
        title: data?.message,
        timer: 1000,
      });
    }
  };

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYear(parsedData);
      setFinancialYearId(parsedData[parsedData.length - 1].id);
      getAuditListing(parsedData[parsedData.length - 1].id);
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );
      
      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Set state with the API response
        setFinancialYear(data.data);
        setFinancialYearId(data.data[data.data.length - 1].id);
        getAuditListing(data.data[data.data.length - 1].id);
      }
    }
  };
  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      { type: "ALL" },
      "GET"
    );
    if (isSuccess) {
      const locationArray = data?.data?.reverse().map((item) => ({
        id: item.id,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      setProcessList(locationArray);
    }
  };

  const getProcess = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getProcess`,
      {},
      { type: "ALL" },
      "GET"
    );
    if (isSuccess) {
      setProcessingList(data?.data?.reverse());
    }
  };

  const handleSubmit = async (
    questionId,
    answerId,
    remark,
    financialYearId,
    validation,
    questionType
  ) => {
    const { isSuccess, error, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}validateAnswers`,
      {},
      {
        questionId: questionId,
        answerId: answerId,
        questionType: questionType,
        remark: remark,
        validation: validation,
        financialYearId: financialYearId,
      },
      "POST"
    );

    if (isSuccess) {
      getAuditListing(financialYearId);
    }

    if (error) {
      swal({
        icon: "error",
        title: data.message,
        timer: 1000,
      });
    }
  };
  const fetchTopicData = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTopic`,
      {},
      { type: "ESG", frameworkIds: [1] }
    );
    if (isSuccess) {
      const filterSelctedTopics = data?.data;
      setTopicsData(data?.data);
      getFinancialYear();
      // setFilterManTopicListValue(filterSelctedTopics["mandatory_topics"]);
      // let idArray = filterSelctedTopics["mandatory_topics"].map(
      //   (item) => item.id
      // );
      // if (valueExists) {
      //   const uniqueArray = [...new Set([...idArray])];
      //   const sortedArray = uniqueArray.sort((a, b) => a - b);

      //   setEsgReportingData({
      //     ...esgReportingData,
      //     mandatoryTopicsId: sortedArray,
      //   });
      // }

      // setFilterValTopicListValue(filterSelctedTopics["voluntary_topics"]);
      // setFilterCusTopicListValue(filterSelctedTopics["custom_topics"]);

      // if (filterSelctedTopics.length > 0) {
      //   getKpiData();
      // }
    }
  };
  const [activeInnerIndex, setActiveInnerIndex] = useState(null);
  const handleInnerAccordionToggle = async (index, headingName) => {
    setActiveInnerIndex(activeInnerIndex === index ? null : index);
    const questionData = groupData[headingName];
    const groupedQuestions = questionData.reduce((acc, question) => {
      const { report_id } = question;
      if (!acc[report_id]) {
        acc[report_id] = [];
      }
      acc[report_id].push(question);
      return acc;
    }, {});
    const groupedData = questionData.reduce((acc, obj) => {
      if (!acc[obj.report_id]) {
        acc[obj.report_id] = { ...obj };
        acc[obj.report_id].subQuestions = [];
        acc[obj.report_id].subQuestions.push(obj);
      } else {
        if (!acc[obj.report_id].subQuestions) {
          acc[obj.report_id].subQuestions = [];
        }
        acc[obj.report_id].subQuestions.push(obj);
      }
      return acc;
    }, {});

    // Convert the grouped object back to an array
    const result = Object.values(groupedData);
    // datas
    const filteredArray = datas.filter((obj2) => {
      // Check if any object in array1 has the same report_id
      return result.some((obj1) => obj1.id === obj2.questionId);
    });

    // setGroupQuestions(groupedQuestions);
    // setQuestionsDataList(result);
    // setData(questionData);
    setAudit_Data(filteredArray);
    setFilterAuditData(filteredArray);
    setSelectedRow(filteredArray[0]?.questionId);
    setAuditAnswer(filteredArray[0]);
    // setAssignedList(data?.getAssignedDetails);
    setAllAllQuestionList({
      quantitative: [],
      tabular_question: [],
      qualitative: [],
      yes_no: [],
      quantitative_trends: [],
    });
    // setQuestionList(result);
    // setFilterQuestionList(result);
    const data = questionData;
    const newData = {};
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = item.id;
      newData[id] = {
        question_id: item?.id,
        questionType: item?.questionType ?? item?.questionType,
        answer: "",
        status: false,
      };
      if (item.questionType === "tabular_question") {
        const numberofRow = item.question_detail.filter(
          (d) => d.option_type === "row"
        ).length;
        const numberofColumn = item.question_detail.filter(
          (d) => d.option_type === "column"
        ).length;
        if (item && item.answer && item.answer.length > 0) {
          // Perform any necessary operations with item.answer
        }
        const array2D = Array.from({ length: numberofRow }, () =>
          Array.from({ length: numberofColumn }, () => 0)
        );
        newData[item.id]["answer"] = array2D;
        setAllAllQuestionList((prevState) => ({
          ...prevState,
          tabular_question: [...prevState.tabular_question, item],
        }));
      } else if (item.questionType === "quantitative") {
        setAllAllQuestionList((prevState) => ({
          ...prevState,
          quantitative: [...prevState.quantitative, item],
        }));
      } else if (item.questionType === "qualitative") {
        setAllAllQuestionList((prevState) => ({
          ...prevState,
          qualitative: [...prevState.qualitative, item],
        }));
      } else if (item.questionType === "yes_no") {
        setAllAllQuestionList((prevState) => ({
          ...prevState,
          yes_no: [...prevState.yes_no, item],
        }));
      } else if (item.questionType === "quantitative_trends") {
        newData[item.id]["answer"] = [];
        let i = {
          from_date: "",
          to_date: "",
          meter_id: "",
          process: "",
          reading_value: "",
          note: "",
        };
        newData[item.id]["answer"].push(i);
        setAllAllQuestionList((prevState) => ({
          ...prevState,
          quantitative_trends: [...prevState.quantitative_trends, item],
        }));
      }
    }
  };
  const [activeIndex, setActiveIndex] = useState(null);
  const handleAccordionToggle = async (index, topicName) => {
    // await getAuditListing(6, [topicId], []);
    setActiveIndex(activeIndex === index ? null : index);
    const questionData = groupedTopicsData[topicName];
    const groupedData = questionData.reduce((acc, obj) => {
      const { report_id, heading, ...rest } = obj;
      if (!acc[heading]) {
        acc[heading] = [];
      }
      acc[heading].push({ report_id, heading, ...rest });
      return acc;
    }, {});
    setGroupData(groupedData);
  };
  useEffect(() => {
    getFinancialYear();
    // fetchTopicData();
    const settingsMenu = JSON.parse(localStorage.getItem("menu"));
    const settingsObject = settingsMenu.find(
      (item) => item.caption === "Audit"
    );
    const settingsSubMenu = settingsObject ? settingsObject.sub_menu : [];
    setMenuList(settingsSubMenu);
  }, []);

  useEffect(() => {
    if (filterAuditData.length) {
      setSelectedRow(filterAuditData[0]?.questionId);
      setAuditAnswer(filterAuditData[0]);
    }
  }, [filterAuditData]);

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div style={{ flex: "0 0 21%", position: "sticky", top: 0, zIndex: 999 }}>
        <Sidebar />
      </div>
      <div style={{ flex: "1 1 79%" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper">
          <section className="inner_wraapper px-3 pt-3">
            <div className="color_div_on framwork_2 hol_rell">
              <div className="steps-form">
                <div className="steps-row setup-panel hstack justify-content-between">
                  <div className="tabs-top setting_admin my-0">
                    <ul>
                      <li>
                        <NavLink to="/audit-listing" className="activee">
                          Audit Listing
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/audit-history"> Audit History </NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex dropdown align-items-center">
                    <p className="m-0"> Financial Year : </p>
                    {financialYear && financialYear?.length === 1 ? (
                      <select
                        className="select_one_all"
                        onChange={async (e) => {
                          if (e.target.value !== "Select Financial Year") {
                            setFinancialYearId(e.target.value);
                            if (financialYearId) {
                              // getAuditListing(financialYearId);
                            }
                          } else {
                            setFinancialYearId("");
                          }
                        }}
                      >
                        {financialYear?.map((item, key) => (
                          <option key={key} value={item.id}>
                            {item.financial_year_value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="select_one_all"
                        value={
                          financialYearId ||
                          (financialYear.length > 0
                            ? financialYear[financialYear.length - 1].id
                            : "")
                        }
                        // value={financialYear.find(
                        //   (obj) => obj.id === financialYearId
                        // )}
                        onChange={async (e) => {
                          if (e.target.value !== "Select Financial Year") {
                            setFinancialYearId(e.target.value);
                            // getAuditListing(e.target.value);
                          } else {
                            setFinancialYearId("");
                          }
                        }}
                      >
                        <option value={0}>Select Financial Year</option>
                        {financialYear?.map((item, key) => (
                          <option key={key} value={item.id}>
                            {item.financial_year_value}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {audit_Data?.length ? (
                    <div className="hstack gap-2 mx-2">
                      <div className="filter_ICOn">
                        <AuditListingFilter
                          setSelectedFinancialYear={setSelectedFinancialYear}
                          setSelectedSupplier={setSelectedSupplier}
                          status={status}
                          setStatus={setStatus}
                          update={update}
                          setUpdate={setUpdate}
                          questionnaire={questionnaire}
                          setQuestionnaire={setQuestionnaire}
                          findQuestionIds={findQuestionIds}
                        />
                      </div>
                      {menuList
                        .find((item) => item.caption === "Audit Module")
                        ?.permissions.some(
                          (permission) =>
                            permission.permissionCode ===
                            "ASSIGN_QUESTION_TO_AUDITOR" && permission.checked
                        ) && (
                          <button
                            className="new_button_style_white"
                            onClick={handleShow}
                          >
                            Assign Question
                          </button>
                        )}

                      {show === true && (
                        <AssignQuestions
                          questions={filterAuditData}
                          financialYearId={6}
                          fetchquestionApi={"fetchquestionApi"}
                          entity="company"
                          show={show}
                          onHide={handleClose}
                          tabType="AUDIT"
                        />
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="access__section mb-3">
              {groupedTopicsData &&
                Object.keys(groupedTopicsData).length > 0 ? (
                <Accordion>
                  {Object.keys(groupedTopicsData).map((data, index) => (
                    <Accordion.Item
                      key={index}
                      eventKey={index.toString()}
                      style={{
                        position: "relative",
                        border: "4px solid #3f88a5",
                        borderRadius: "5px",
                        backgroundColor: !isLoading
                          ? "rgb(159 65 65 / 5%)"
                          : "white",
                      }}
                      className="my-2"
                    >
                      <Accordion.Header
                        onClick={() => handleAccordionToggle(index, data)}
                        style={{
                          border: "4px solid white",
                          borderRadius: "4px",
                        }}
                      >
                        {data}
                      </Accordion.Header>
                      <Accordion.Body
                        className="p-0"
                        active={activeIndex === index}
                      >
                        <Accordion className="m-3">
                          {Object.keys(groupData).map((heading, innerIndex) => (
                            <Accordion.Item
                              key={innerIndex}
                              eventKey={`${index}-${innerIndex}`}
                              className="my-2"
                              style={{
                                border: "4px solid #3f88a5",
                                borderRadius: "5px",
                              }}
                            >
                              <Accordion.Header
                                onClick={() =>
                                  handleInnerAccordionToggle(
                                    innerIndex,
                                    heading
                                  )
                                }
                                style={{
                                  border: "4px solid white",
                                  borderRadius: "4px",
                                }}
                              >
                                {heading}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="Introduction">
                                  <div className="question_section">
                                    {audit_Data?.length ? (
                                      <div
                                        className="d-flex align-items-center justify-content-between"
                                        style={{
                                          background: "#1f9ed1",
                                          borderBottom: "3px solid #fff",
                                        }}
                                      >
                                        <QuestionTypeTab
                                          setSelectedQuestionType={
                                            setSelectedQuestionType
                                          }
                                          setAuditAnswer={setAuditAnswer}
                                          selectedQuestionType={
                                            selectedQuestionType
                                          }
                                          setFilterAuditData={
                                            setFilterAuditData
                                          }
                                          allQuestionList={allQuestionList}
                                          audit_Data={audit_Data}
                                        />
                                        <div className="resize__tabel">
                                          {hideCol === false ? (
                                            <img
                                              className="mx-2"
                                              src={Maximize}
                                              alt="Maximize"
                                              title="Maximize"
                                              onClick={() => answerWidth()}
                                            />
                                          ) : (
                                            <img
                                              className="mx-2"
                                              src={Minimize}
                                              alt="Minimize"
                                              title="Minimize"
                                              onClick={() => questionWidth()}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}

                                    <Row>
                                      <Col
                                        className="Question__type"
                                        md={leftWidth}
                                        hidden={hideCol}
                                      >
                                        {filterAuditData?.length ? (
                                          <Table
                                            striped
                                            hover
                                            bordered
                                            className="m-0"
                                            style={{ cursor: "pointer" }}
                                          >
                                            <thead>
                                              <tr className="fixed_tr_section">
                                                <td style={{ width: 55 }}>
                                                  Sr No
                                                </td>
                                                <td>Question</td>
                                                <td>Status</td>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {filterAuditData?.map(
                                                (audit_data, index) => (
                                                  <AuditCard
                                                    audit_data={audit_data}
                                                    answerWidth={answerWidth}
                                                    questionWidth={
                                                      questionWidth
                                                    }
                                                    hideCol={hideCol}
                                                    index={
                                                      audit_data?.question
                                                        ?.report_id
                                                    }
                                                    setAuditAnswer={(data) => {
                                                      setAuditAnswer(data);
                                                    }}
                                                    selectedRow={selectedRow}
                                                    setUrl={setUrl}
                                                  />
                                                )
                                              )}
                                            </tbody>
                                          </Table>
                                        ) : (
                                          <div className="hstack justify-content-center">
                                            <img
                                              src={NoDataFound}
                                              alt="No Data Found"
                                              srcSet=""
                                              style={{ opacity: 0.2 }}
                                            />
                                          </div>
                                        )}
                                      </Col>
                                      {auditAnswer && (
                                        <Col
                                          md={rightWidth}
                                          hidden={hideAnswerCol}
                                        >
                                          <AuditAnswers
                                            assignedDeatils={assignedList}
                                            auditAnswer={auditAnswer}
                                            setSelectedRow={setSelectedRow}
                                            processList={processList}
                                            processingList={processingList}
                                            handleValidateSubmit={handleSubmit}
                                            module="LISTING"
                                          />
                                        </Col>
                                      )}
                                    </Row>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                ""
              )}
            </div>

            <Modal show={showModal}>
              <div className="modal-lg">
                <Modal.Header className="justify-content-end">
                  <Button
                    variant="outline-dark"
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fa fa-times"></i>
                  </Button>
                </Modal.Header>
                <div className="modal-body">
                  <img
                    src={url}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            </Modal>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuditList;
