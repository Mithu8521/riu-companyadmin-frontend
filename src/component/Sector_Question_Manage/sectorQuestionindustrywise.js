import React, { useEffect, useState } from "react";
import "../Sector_Question_Manage/control.css";
import config from "../../config/config.json";
import { authenticationService } from "../../_services/authentication";
import { apiCall } from "../../_services/apiCall";
import Maximize from "../../img/sector/maximize.png";
import Minimize from "../../img/sector/minimize.png";
import NoDataFound from "../../img/no.png";
import Loader from "../loader/Loader";
import { Col, Row, Table } from "react-bootstrap";
import ViewQuestion from "./ViewQuestion";
import QuestionCard from "./QuestionCard";
import QuestionTypeTab from "../Audit_Module/AuditList/QuestionTypeTab";

export const SectorQuestionFrameworkWise = (props) => {
  const { viewQuestionList, module, financial_year_id } = props;
  const [audit_Data, setSectorQuestion] = useState([]);
  const [filterData, setFilterAuditData] = useState([]);
  const [menulist, setMenuList] = useState([]);
  const [currentData, setCurrentData] = useState();
  const [selectedRow, setSelectedRow] = useState(false);
  const [hideAnswerCol, setHideAnswerCol] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionType, setSelectedQuestionType] = useState("All");
  const [leftWidth, setLeftWidth] = useState(6);
  const [rightWidth, setRightWidth] = useState(6);
  const [hideCol, setHideCol] = useState(false);
  const [allQuestionList, setAllAllQuestionList] = useState({
    quantitative: [],
    tabular_question: [],
    qualitative: [],
    yes_no: [],
    quantitative_trends: [],
  });
  const getCustomSectorQuestion = async () => {
    setIsLoading(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getCustomSectorQuestion`,
      {},
      {
        frameworkId: viewQuestionList?.frameworkId,
        topicId: viewQuestionList?.topicId,
        kpiId: viewQuestionList?.kpiId,
      },
      "GET"
    );
    setIsLoading(false);
    if (isSuccess) {
      setSectorQuestion(data?.data?.reverse());
      setSelectedRow(data?.data[0]?.id);
      setCurrentData(data?.data[0]);
    }
  };
  const getAssessmentQuestion = async () => {
    setIsLoading(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAssessmentQuestion`,
      {},
      {
        financialYearId:
          module === "VIEW_SUPPLIER_QUESTION_LIST"
            ? financial_year_id?.financialYearId
            : financial_year_id?.id,
        questionIds: financial_year_id?.questionIds,
      },
      "GET"
    );
    setIsLoading(false);
    if (isSuccess) {
      setSectorQuestion(data?.data?.reverse());
      setFilterAuditData(data?.data);
      setSelectedRow(data?.data[0]?.id);
      setCurrentData(data?.data[0]);

      setAllAllQuestionList({
        quantitative: [],
        tabular_question: [],
        qualitative: [],
        yes_no: [],
        quantitative_trends: [],
      });
      const responseData = data.data;
      const newData = {};
      for (let i = 0; i < responseData.length; i++) {
        const item = responseData[i];
        const id = item.id;

        newData[id] = {
          question_id: item?.id,
          questionType: item?.questionType ?? item?.questionType,
          answer: "",
          status: false,
        };
        if (item.questionType === "tabular_question") {
          const numberofRow = item?.question_detail.filter(
            (d) => d.option_type === "row"
          ).length;
          const numberofColumn = item?.question_detail.filter(
            (d) => d.option_type === "column"
          ).length;
          if (item && item.answer && item.answer.length > 0) {
          }
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
          setAllAllQuestionList((prevState) => ({
            ...prevState,
            quantitative_trends: [...prevState.quantitative_trends, item],
          }));
        }
      }
    }
  };
  const deleteSectorQuestion = async (questionId) => {
    const body = {
      questionId: questionId,
    };
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}deleteCustomSectorQuestion`,
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      getCustomSectorQuestion();
    }
  };
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

  useEffect(() => {
    if (!filterData?.length) {
      setLeftWidth(12);
      setRightWidth(0);
      setHideAnswerCol(true);
    } else {
      setLeftWidth(6);
      setRightWidth(6);
      setHideAnswerCol(false);
    }
  }, [filterData]);
  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "global_controls"
    );
    setMenuList(settingsMenu?.permissions);
  }, []);

  useEffect(() => {
    if (filterData.length) {
      setSelectedRow(filterData[0]?.id);
      setCurrentData(filterData[0]);
    }
  }, [filterData]);

  useEffect(() => {
    if (
      module === "SUPPLIER_QUESTION_LIST" ||
      module === "VIEW_SUPPLIER_QUESTION_LIST"
    ) {
      getAssessmentQuestion();
    } else {
      getCustomSectorQuestion();
    }
  }, [viewQuestionList, module]);

  return (
    <div className="sectorQuestion">
      {/* {module !== "SUPPLIER_QUESTION_LIST" && (
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="heading">
            <h4>
              {currentData && currentData?.length > 0 && currentData[0]?.title}
            </h4>
          </div>
        </div>
      )} */}
      <div
        className="d-flex align-items-center justify-content-between"
        style={{
          background: "var(--secondaryColor)",
          borderBottom: "3px solid #fff",
        }}
      >
        <QuestionTypeTab
          setSelectedQuestionType={setSelectedQuestionType}
          selectedQuestionType={selectedQuestionType}
          setFilterAuditData={setFilterAuditData}
          allQuestionList={allQuestionList}
          audit_Data={audit_Data}
          module={module}
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
          <Col className="Question__type" md={leftWidth} hidden={hideCol}>
            {true ? (
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
                  </tr>
                </thead>
                <tbody>
                  {filterData?.map((data, index) => (
                    <QuestionCard
                      data={data}
                      answerWidth={answerWidth}
                      questionWidth={questionWidth}
                      hideCol={hideCol}
                      index={index + 1}
                      setCurrentData={(data) => {
                        setCurrentData(data);
                      }}
                      selectedRow={selectedRow}
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

          {currentData && (
            <Col md={rightWidth} hidden={hideAnswerCol}>
              <ViewQuestion
                assignedDeatils={[]}
                questionData={currentData}
                setSelectedRow={setSelectedRow}
                module={module}
              />
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};
