import React, { useEffect, useState } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import AssignQuestions from "../../Company Sub Admin/Component/Sector Questions/AssignQuestions";
import swal from "sweetalert";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import QuestionTypeTabSection from "../../Company Sub Admin/Component/Sector Questions/QuestionTypeTabSection";
import AuditListingFilter from "../../Company Sub Admin/Component/Sector Questions/Filter/AuditListingFilter";
import Maximize from "../../../img/sector/maximize.png";
import Minimize from "../../../img/sector/minimize.png";
import Loader from "../../loader/Loader";
import NoDataFound from "../../../img/no.png";
import { Card, Col, Row, Table, Spinner, Modal, Button } from "react-bootstrap";
import AuditCard from "../AuditList/AuditCard";
import AuditAnswers from "../AuditList/AuditAnswers";

const ViewAnswerHistory = (props) => {
  const [audit_Data, setAudit_Data] = useState([]);
  const [filterAuditData, setFilterAuditData] = useState([]);
  const location = useLocation();
  const [leftWidth, setLeftWidth] = useState(6);
  const [rightWidth, setRightWidth] = useState(6);
  const [hideCol, setHideCol] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState();

  const [selectedQuestionType, setSelectedQuestionType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [hideAnswerCol, setHideAnswerCol] = useState(false);
  const [auditAnswer, setAuditAnswer] = useState();
  const [assignedList, setAssignedList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [url, setUrl] = useState("");

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

  const getAuditListing = async () => {
    const { isSuccess, data, error } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAuditHistory`,
      {},
      {
        topicIds: [],
        kpiIds: [],
        frameworkId: [props.location?.state?.frameworkId] || [],
        financialYearId: props.location?.state?.financialYearId,
      }
    );

    if (isSuccess) {
      setAudit_Data(data?.data);
      setFilterAuditData(data?.data);
      setSelectedRow(data?.data[0]?.id);
      setAuditAnswer(data?.data[0]);
      setAssignedList(data?.getAssignedDetails);
      setIsLoading(false);
      getSource();
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
  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
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

  useEffect(() => {
    const filteredArray = audit_Data.filter(
      (obj) => obj.questionType === selectedQuestionType
    );
    setFilterAuditData(filteredArray);
  }, [selectedQuestionType]);

  useEffect(() => {
    getAuditListing();
    // const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = JSON.parse(localStorage.getItem("menu")).find(
      (item) => item?.url === "sector_questions"
    );
    setMenuList(settingsMenu?.permissions);
  }, [props.location?.state?.financialYearId]);
  return (
    <>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <section className="inner_wraapper px-3 pt-3">
          <div className=" color_div_on framwork_2 hol_rell">
            <div className="steps-form">
              <div className="steps-row setup-panel">
                <div className="tabs-top setting_admin my-0">
                  <ul>
                    <li>
                      <NavLink to="/audit-listing"> Audit Listing </NavLink>
                    </li>
                    <li>
                      <NavLink to="/audit-history"> Audit History </NavLink>
                    </li>
                    <li>
                      <NavLink to="/framework-history"> Framework</NavLink>
                    </li>
                    <li>
                      <NavLink to="/Answers-history" className="activee">
                        {" "}
                        Question List
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="Introduction">
            <div className="question_section">
              <div
                className="d-flex align-items-center justify-content-between"
                style={{
                  background: "#1f9ed1",
                  borderBottom: "3px solid #fff",
                }}
              >
                <QuestionTypeTabSection
                  setSelectedQuestionType={setSelectedQuestionType}
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
              {isLoading ? (
                <Loader />
              ) : (
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
                            <td style={{ width: 55 }}>Sr</td>
                            <td>Question</td>
                            <td>Status</td>
                          </tr>
                        </thead>
                        <tbody>
                          {filterAuditData?.map((audit_data, index) => (
                            <AuditCard
                              audit_data={audit_data}
                              answerWidth={answerWidth}
                              questionWidth={questionWidth}
                              hideCol={hideCol}
                              index={index + 1}
                              setAuditAnswer={(data) => {
                                setAuditAnswer(data);
                              }}
                              selectedRow={selectedRow}
                              setUrl={setUrl}
                            />
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="hstack justify-content-center">
                        <img src={NoDataFound} alt="" srcSet="" />
                      </div>
                    )}
                  </Col>
                  {auditAnswer && (
                    <Col md={rightWidth} hidden={hideAnswerCol}>
                      <AuditAnswers
                        assignedDeatils={assignedList}
                        auditAnswer={auditAnswer}
                        setSelectedRow={setSelectedRow}
                        processList={processList}
                        module="AUDITHISTORY"
                      />
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ViewAnswerHistory;
