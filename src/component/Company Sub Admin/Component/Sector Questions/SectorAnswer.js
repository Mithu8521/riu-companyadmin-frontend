import React, { useEffect, useState } from "react";
import TrandsInputCard from "./TrandsInputCard";
import { Form, Modal, Row, Table, Button } from "react-bootstrap";
import TebularInputCard from "./TebularInputCard";
import TebularInputCardAnswer from "./TabularInputCardAnswer";
import config from "../../../../config/config.json";
import NotAnswered from "../../../../img/sector/notAnswer.png";
import UploadIcon from "./Icons/uploadIcon";
import DownloadIcon from "./Icons/downloadIcon";
import "../../../sidebar/common.css";
import { apiCall } from "../../../../_services/apiCall";
import GaugeChart from "react-gauge-chart";
import DatePicker from "react-datepicker";
import { NavLink } from "react-router-dom";
import ConvertDate from "../../../../utils/ConvertDate";
import NotAssign from ".././../../../img/skeletons_types_table.png";
import PhoneInput from "react-phone-input-2";

const SectorAnswer = (props) => {
  const {
    questionData,
    assignedDetail,
    handleAnswers,
    answers,
    user_Is_head,
    handleOtherTypes,
    processList,
    changedData,
    meterList,
    // value,
    // filterAnswer,
    setAnswers,
    initalValue,
    questionList,
    hideCol,
    setUploadItem,
    uploadFile,
    listing,
    permission,
    handleAuditSubmit,
    auditAnswer,
    subQuestionData,
  } = props;
  const [renderedCount, setRenderedCount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  const startDate = new Date("2024-01-04");
  const endDate = new Date("2024-01-20");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [nrOfLevels, setNrOfLevels] = useState(2);
  const [dueDate, setDueDate] = useState(new Date());
  const [editable, setEditable] = useState(false);
  const [show, setShow] = useState(false);
  const [filterAnswers, setfilterAnswers] = useState("");
  const [combinedAnswer, setCombinedAnswer] = useState("");
  const [showRemark, setShowRemark] = useState(false);
  const handleShowRemarkClose = () => setShowRemark(false);
  const [remark, setRemark] = useState(false);

  // const [readOnlyRes, setReadOnlyRes] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // useEffect(() => {
  //   if( answers){
  //     const filterAnswer = answers?.filter((obj) => obj.questionId == questionData.id);
  //     if(filterAnswer && filterAnswer[0]){
  //       setCombinedAnswer(filterAnswer[0]["combinedAnswers"])
  //     }
  //     setfilterAnswers(filterAnswer)
  //   }
  // }, [questionData,answers]);

  let value;
  let answeredData;
  let attatchment;
  // let filterAssignedDetail;
  let auditedDate = null;
  let auditedBy = null;
  let auditStatus = null;
  let auditedRemark = null;
  let tabularStatus;
  let tabularRemark;
  let combinedAnswers;
  let proof_document;
  let quantitativeAnswers = [{}];
  const reportId = questionData?.report_id;
  const filterAnswer =
    answers && answers?.filter((obj) => obj.questionId == questionData.id);
  // const filterAssignedDetails =
  //   assignedDetails &&
  //   assignedDetails?.filter((obj) => obj.questionId == questionData.id);

  if (
    filterAnswer &&
    filterAnswer[0] &&
    filterAnswer[0]["answer"] &&
    filterAnswer[0]["answer"] &&
    questionData.questionType === "quantitative_trends"
  ) {
    quantitativeAnswers = filterAnswer[0]["answer"];
  }
  value = (filterAnswer && filterAnswer[0] && filterAnswer[0]["answer"]) || "";

  answeredData =
    (filterAnswer && filterAnswer[0] && filterAnswer[0]["updatedAt"]) || "";
  attatchment =
    (filterAnswer && filterAnswer[0] && filterAnswer[0]["proofDocument"]) || "";
  // filterAssignedDetail =
  //   (filterAssignedDetails && filterAssignedDetails[0]) || "";
  // console.log(filterAssignedDetail &&
  //   !filterAssignedDetail?.assignedTo.includes(String(userId)) ,
  //   !(new Date(filterAssignedDetail.dueDate) <
  //   new Date(new Date().setDate(new Date().getDate() - 1))), (filterAnswer && filterAnswer[0] && filterAnswer[0]["status"] && filterAnswer[0]["status"] != 'ACCEPTED'),"dfghjygtrdwsefrgt",filterAssignedDetail &&
  //   !filterAssignedDetail?.assignedTo.includes(String(userId)) &&
  //   !(new Date(filterAssignedDetail.dueDate) <
  //   new Date(new Date().setDate(new Date().getDate() - 1))) )
  const readOnlyRes =
    assignedDetail &&
    !assignedDetail?.assignedTo.includes(String(userId)) &&
    new Date(assignedDetail.dueDate) <
    new Date(new Date().setDate(new Date().getDate() - 1))
  // setReadOnlyRes(readsOnly)

  auditStatus = (filterAnswer && filterAnswer[0] && filterAnswer[0]["status"]) || null;
  auditedDate = (filterAnswer && filterAnswer[0] && filterAnswer[0]["auditedDate"]) || null;
  auditedBy =
    (filterAnswer &&
      filterAnswer[0] &&
      filterAnswer[0]["auditorFirstName"] &&
      filterAnswer[0]["auditorFirstName"] +
      " " +
      filterAnswer[0]["auditorLastName"]) ||
    null;
  auditedRemark =
    (filterAnswer && filterAnswer[0] && filterAnswer[0]["auditedRemark"]) ||
    null;
  combinedAnswers =
    (filterAnswer && filterAnswer[0] && filterAnswer[0]["combinedAnswers"]) ||
    "";
  proof_document =
    (filterAnswer && filterAnswer[0] && filterAnswer[0]["proofDocument"]) || "";

  const getSpacedString = (strValue) => {
    let str = "";
    for (const char of strValue) {
      if (["+", "-", "/", "*"].includes(char)) {
        str = str.concat(" ", char, " ");
      } else {
        str = str.concat(char);
      }
    }
    return str;
  };
  const handleShowRemark = (remarkValue) => {
    setShowRemark(true);
    setRemark(remarkValue);
  };
  const getEvaluatedString = (strArray, item, event) => {
    let evaluatedStr = "";
    for (const value of strArray) {
      let str = value && value.toLowerCase();
      if (["+", "-", "/", "*"].includes(value)) {
        evaluatedStr = evaluatedStr.concat(value);
      } else if (str) {
        if (str.includes("r") && str.includes("c") && str.includes("q")) {
          const qIndex = str.indexOf("q");
          const cIndex = str.indexOf("c");
          const rIndex = str.indexOf("r");
          if (cIndex > rIndex > qIndex) {
            const qNum = str.substring(1, rIndex);
            const rNum = str.substring(rIndex + 1, cIndex);
            const cNum = str.substring(cIndex + 1);
            const question = questionList && questionList[+qNum - 1];
            if (
              question &&
              question["id"] &&
              question["questionType"] === "tabular_question"
            ) {
              const answerArr = answers?.filter((obj) => {
                if (obj["questionId"] == question["id"]) {
                  return obj;
                }
              });
              const tabularAns =
                answerArr && answerArr[0] && answerArr[0]["answer"];
              const answer =
                tabularAns &&
                tabularAns[+rNum - 1] &&
                tabularAns[+rNum - 1][+cNum - 1];

              if (isNaN(answer)) {
                //handleAnswers(item, event, item["questionType"], "");
                alert(
                  `For ${value} the answer is not a number type. i.e. ${answer}`
                );
                break;
              } else {
                evaluatedStr = evaluatedStr.concat(answer);
              }
            } else {
              // handleAnswers(item, event, item["questionType"], "");
              alert(
                `${question["id"]
                  ? `${value} is not a tabular type question.`
                  : `No question exist for ${value}`
                }`
              );
              break;
            }
          } else {
            //handleAnswers(item, event, item["questionType"], "");
            alert(
              `Please enter tabluar question ${value} in proper format. eg Q2R1C2`
            );
            break;
          }
          //getting 2D array value
        } else if (str.includes("q")) {
          const index = str.substring(1);
          const question = questionList && questionList[+index - 1];
          if (
            question &&
            question["id"] &&
            question["questionType"] === "quantitative"
          ) {
            const answerArr = answers?.filter((obj) => {
              if (obj["questionId"] == question["id"]) {
                return obj;
              }
            });
            const answer = answerArr && answerArr[0] && answerArr[0]["answer"];

            if (isNaN(answer)) {
              //handleAnswers(item, event, item["questionType"], "");
              alert(
                `For ${value} the answer is not a number type. i.e. ${answer}`
              );
              break;
            } else {
              evaluatedStr = evaluatedStr.concat(answer);
            }
          } else {
            //handleAnswers(item, event, item["questionType"], "");
            alert(
              `${question["id"]
                ? `${value} is not a quantative type question.`
                : `No question exist for ${value}`
              }`
            );
            break;
          }
        }
      }
    }
    return evaluatedStr;
  };

  const handlekeyPress = (item, event) => {
    const str = event?.target?.value?.trim();
    if (str && str.startsWith("=")) {
      if (event.key === "Enter" || event.keyCode === 13) {
        const spacedString = getSpacedString(str.substring(1));
        const strArray = spacedString.split(" ");
        const evaluatedString = getEvaluatedString(strArray);
        const regex = /[a-zA-Z]/g;
        if (!evaluatedString.match(regex)) {
          const answer = eval(evaluatedString);
          handleAnswers(
            item,
            null,
            item.questionType ?? item.questionType,
            answer
          );
        } else {
          handleAnswers(item, null, item.questionType ?? item.questionType, "");
          alert("Answer is not a proper number value");
        }
      }
    }
  };

  const handleAddRow = async (item, value, option) => {
    const lastRow = item.question_detail
      ?.filter((detail) => detail.option_type === "row")
      .pop();
    {
      const { isSuccess, data, error } = await apiCall(
        config.POSTLOGIN_API_URL_COMPANY + `addRow`,
        {},
        {
          question_id: item.id,
          row_value: option,
          type: value,
          current_role: localStorage.getItem("role"),
        },
        "POST"
      );

      if (isSuccess) {
        window.location.reload();
        // const indexToUpdate = filterQuestionList.findIndex(
        //   (question) => question.id === item.id
        // );
        // const updatedQuestion = { ...filterQuestionList[indexToUpdate] };

        // const newRow = {
        //   id: data?.data?.id,
        //   question_id: item.id,
        //   option_type: "row",
        //   option: data?.data?.value?.toString(),
        //   rules: null,
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        // };
        // updatedQuestion.question_detail.push(newRow);
        // const updatedList = [
        //   ...filterQuestionList.slice(0, indexToUpdate),
        //   updatedQuestion,
        //   ...filterQuestionList.slice(indexToUpdate + 1),
        // ];
        // setFilterQuestionList(updatedList);
        // let tempAnswers = [...answers];
        // if (tempAnswers.length) {
        //   let check = tempAnswers.findIndex(
        //     (value) => value.question_id == item.id
        //   );
        //   if (check !== -1) {
        //     const firstArrayLength = tempAnswers[check]?.answer[0].length;
        //     const newArray = Array(firstArrayLength).fill("");

        //     tempAnswers[check]?.answer.push(newArray);

        //     setAnswers(tempAnswers);
        //   }
        // }
      }
    }
  };

  const handleDeleteAnswers = (item, event, questionType, value, ind) => {
    switch (questionType) {
      case "tabular_question": {
        // handleTabularAnswers(item, event, index, value);
        break;
      }
      case "quantitative_trends": {
        handleDeleteQunatativeTreds(item, value);
        break;
      }
      case "quantitative": {
        // handlequantitativeTypes(item, event, index, value);
        break;
      }
      default: {
        handleOtherTypes(item, event, ind);
      }
    }
  };

  const handleDeleteQunatativeTreds = (item, index) => {
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    for (let i = 0; i < tempAnswers.length; i++) {
      if (item.id == tempAnswers[i].question_id) {
        tempAnswers[i].answer.splice(index, 1);
        break;
      }
    }
    setAnswers(tempAnswers);
  };

  const requestDueDate = async (e) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}requestDueDate`,
      {},
      {
        questionId: questionData.id,
      },
      "POST"
    );

    if (isSuccess) {
    }
  };

  const reminderToUser = async (e) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reminderToUser`,
      {},
      {
        questionId: questionData.id,
      },
      "POST"
    );

    if (isSuccess) {
    }
  };

  const updateDueDate = async (e) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}updateDueDate`,
      {},
      {
        questionId: questionData.id,
        dueDate: ConvertDate(dueDate),
      },
      "POST"
    );

    if (isSuccess) {
      handleClose();
    }
  };

  const handleEditClick = async (e) => {
    setEditable(true);
  };

  const handleAuditsSubmit = (
    validation,
    questionType,
    answerId,
    financialYearId
  ) => {
    handleAuditSubmit(validation, questionType, answerId, financialYearId);
  };

  const changeAnswer = (check) => {
    const isValueExists = changedData.includes(check);
    if (!isValueExists) {
      // setAnswerChange((prevState) => {
      //   const updatedChange = Array.isArray(prevState) ? [...prevState] : [];
      //   updatedChange.push(check);
      //   return updatedChange;
      // });
      changedData.push(check);
    }
  };

  const chartStyle = {
    width: 60,
    height: 20,
  };
  const handleItemRendered = () => {
    setRenderedCount((prevCount) => prevCount + 1);
  };
  return (
    <>
      <div className="question_right_section">
        {hideCol && (
          <Table bordered striped hover className="m-0">
            <thead>
              <tr className="fixed_tr_section">
                <td style={{ width: 55 }}>Sr No</td>
                <td>Question</td>
                <td style={{ width: 55 }}>Status</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: 55 }}>{questionData.index + 1}</td>
                <td>{questionData.title}</td>
                <td style={{ width: 55 }}>
                  <img
                    className="notAnsered_question"
                    src={NotAnswered}
                    alt="Not Answered"
                    srcSet=""
                    title="Not Answered"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {questionData.questionType == "qualitative" && (
          <div className="tableOutput__area">
            <Table striped bordered className="m-0">
              <tbody>
                {assignedDetail ? (
                  <>
                    <tr className="fixed_tr_section">
                      <td>Attribute</td>
                      <td>Value</td>
                    </tr>

                    {!assignedDetail?.assignedByDetails.some(
                      (item) => item.id == userId
                    ) && (
                        <tr>
                          <td>Assign By</td>
                          <td>
                            {assignedDetail?.assignedByDetails &&
                              assignedDetail?.assignedByDetails.map(
                                (user, index) => (
                                  <div style={{ display: "flex" }}>
                                    <span>
                                      {user.first_name} {user.last_name}
                                    </span>
                                    <span style={{ marginLeft: "20px" }}>
                                      {new Date(
                                        assignedDetail.createdAt
                                      ).toLocaleString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                )
                              )}
                            <tr></tr>
                          </td>
                        </tr>
                      )}

                    {!assignedDetail?.assignedToDetails.some(
                      (item) => item.id == userId
                    ) && (
                        <tr>
                          <td>Assign to</td>
                          <td>
                            <div className="d-flex">
                              {assignedDetail?.assignedToDetails.map(
                                (user, index) => (
                                  <span key={index}>
                                    <span
                                      data-tooltip={assignedDetail?.assignedToDetails
                                        .map((user) => user.email)
                                        .join(", ")}
                                    >
                                      {user.first_name} {user.last_name}
                                    </span>
                                    {index <
                                      assignedDetail?.assignedToDetails
                                        .length -
                                      1 && ", "}
                                  </span>
                                )
                              )}
                              {assignedDetail?.dueDate && (
                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        Due Date
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        <div className="hstack">
                                          <p className="m-0">
                                            {new Date(
                                              assignedDetail?.dueDate
                                            ).toLocaleString("en-US", {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </p>

                                          {/* {assignedDetail &&
                                          !readOnlyRes &&
                                          0 && (
                                            <>
                                              <GaugeChart
                                                style={chartStyle}
                                                id="gauge-chart2"
                                                nrOfLevels={nrOfLevels}
                                                colors={["#3f88a5", "#1f9ed1"]}
                                              />
                                              <i
                                                className="fas fa-stopwatch mx-2"
                                                title="Reminder"
                                                onClick={() =>
                                                  reminderToUser(
                                                    questionData.id
                                                  )
                                                }
                                              ></i>
                                            </>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.assignedBy !==
                                            1 &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Request Due Date"
                                              onClick={() =>
                                                requestDueDate(questionData.id)
                                              }
                                            ></i>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.dueDateRequested &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Change Due Date"
                                              onClick={() => handleShow()}
                                            ></i>
                                          )} */}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              )}

                              {answeredData && (
                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        Answered Date
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        {new Date(answeredData).toLocaleString(
                                          "en-US",
                                          {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                          }
                                        )}
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}

                    {!assignedDetail?.assignedByDetails.some(
                      (item) => item.id == userId
                    ) && (
                        <tr>
                          <td>Due Date</td>
                          <td>
                            <div className="d-flex">
                              <div className="hstack">
                                <p className="m-0">
                                  {new Date(
                                    assignedDetail?.dueDate
                                  ).toLocaleString("en-US", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                                {assignedDetail && !readOnlyRes && 0 ? (
                                  <GaugeChart
                                    style={chartStyle}
                                    id="gauge-chart2"
                                    nrOfLevels={nrOfLevels}
                                    colors={["#FF5F6D", "#FFC371"]}
                                  />
                                ) : (
                                  <></>
                                )}
                                {assignedDetail && !readOnlyRes && 0 ? (
                                  <i
                                    className="fas fa-stopwatch mx-2"
                                    title="Reminder"
                                    onClick={() =>
                                      reminderToUser(questionData.id)
                                    }
                                  ></i>
                                ) : (
                                  <></>
                                )}
                                {new Date(assignedDetail?.dueDate) <
                                  new Date() ? (
                                  assignedDetail?.assignedBy !== 1 && (
                                    <i
                                      className="far fa-calendar-plus mx-2"
                                      title="Request Due Date"
                                      onClick={() =>
                                        requestDueDate(questionData.id)
                                      }
                                    ></i>
                                  )
                                ) : (
                                  <></>
                                )}
                                {new Date(assignedDetail?.dueDate) <
                                  new Date() ? (
                                  assignedDetail?.dueDateRequested && (
                                    <i
                                      className="far fa-calendar-plus mx-2"
                                      title="Change Due Date"
                                      onClick={() => handleShow()}
                                    ></i>
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                              {answeredData && (
                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        Answered Date
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        {new Date(answeredData).toLocaleString(
                                          "en-US",
                                          {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                          }
                                        )}
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}

                    {auditedBy &&
                      auditedBy !== "null null" && (
                        <tr>
                          <td>Audited By</td>
                          <td>
                            <span>{auditedBy}</span>
                          </td>
                        </tr>
                      )}
                    {auditedDate && (auditStatus === "ACCEPTED" ||
                      auditStatus === "REJECTED") && (
                        <tr>
                          <td>Audit Status</td>
                          <td>
                            <div style={{ display: "flex" }}>
                              <span>
                                {auditStatus === "ACCEPTED"
                                  ? "Accepted"
                                  : "Rejected"}
                              </span>
                              {auditedDate && (
                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        Audited Date
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        <span>
                                          {new Date(auditedDate).toLocaleString(
                                            "en-US",
                                            {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            }
                                          )}
                                          <i
                                            onClick={() => handleShowRemark(auditedRemark)}
                                            title={auditedRemark}
                                            className="fa fa-eye"
                                            style={{ marginLeft: "5px" }}
                                          ></i>
                                        </span>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    {assignedDetail && (
                      <tr>
                        <td>Attatchment</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <div className="d-flex">
                              <div>
                                {" "}
                                <UploadIcon
                                  setUploadItem={setUploadItem}
                                  uploadFile={uploadFile}
                                  questionData={questionData}
                                />
                              </div>
                              <div>
                                {" "}
                                {attatchment &&
                                  attatchment.length &&
                                  attatchment.map((attachment, index) => {
                                    return (
                                      <DownloadIcon
                                        key={index}
                                        attachment={attachment}
                                      />
                                    );
                                  })}
                              </div>
                            </div>

                            <div className="mx-auto" style={{ margin: "-8px" }}>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                }}
                              >
                                <tr>
                                  <td
                                    style={{
                                      borderLeft: "1px solid gray",
                                      padding: "8px",
                                      paddingRight: "33px",
                                      borderColor: "#d7cfcfa6",
                                    }}
                                  >
                                    History
                                  </td>
                                  <td
                                    style={{
                                      borderLeft: "1px solid gray",
                                      padding: "8px",
                                      borderColor: "#d7cfcfa6",
                                    }}
                                  >
                                    <div
                                      style={{ cursor: "pointer" }}
                                      onClick={handleShow}
                                    >
                                      View
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    <tr>
                      <td colSpan={2}>Answer</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="p-0">
                        {/* <PhoneInput
                        country={"in"}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        enableSearch={true}
                      /> */}
                        <textarea
                          className="form-control"
                          name="answers"
                          required
                          value={value}
                          readOnly={true}
                          placeholder="Leave a Answer here"
                          onChange={(e) => {
                            handleAnswers(
                              questionData,
                              e,
                              questionData?.questionType
                            );
                          }}
                        />
                      </td>
                    </tr>
                  </>
                )}

                {assignedDetail && (
                  <>
                    <tr>
                      <td colSpan={2}>Answer</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="p-0 position-relative">
                        {questionData?.title === "Telephone" ? (
                          <PhoneInput
                            name="answers"
                            country={"in"}
                            value={value && value}
                            disabled={readOnlyRes || !editable}
                            onChange={(e) => {
                              handleAnswers(
                                questionData,
                                e,
                                questionData?.questionType
                              );
                            }}
                            disableCountryCode={true}
                            enableSearch={true}
                          />
                        ) : (
                          <textarea
                            className="form-control"
                            name="answers"
                            required
                            value={questionData?.title.includes('Rs') ? '₹ ' + value : value}
                            readOnly={readOnlyRes || !editable}
                            placeholder="Leave an Answer here"
                            onChange={(e) => {
                              handleAnswers(
                                questionData,
                                e,
                                questionData?.questionType
                              );
                            }}
                            style={{ paddingRight: "30px" }}
                          />
                        )}

                        {readOnlyRes ? (
                          <></>
                        ) : (
                          <>
                            <i
                              className="fas fa-pen-square position-absolute"
                              title="Edit Answer"
                              onClick={() => handleEditClick()}
                              style={{
                                right: "5px",
                                top: "5px",
                                cursor: "pointer",
                              }}
                            ></i>
                          </>
                        )}
                      </td>
                    </tr>
                    {questionData?.not_applicable ? (
                      <tr>
                        <input
                          type="checkbox"
                          // checked={true}
                          className="m-2 checkbox-input"
                          onChange={(e) => {
                            handleAnswers(
                              questionData,
                              e.target.checked ? "N.A." : null,
                              questionData?.questionType
                            );
                          }}
                        />
                        <span>Not Applicable</span>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </tbody>
            </Table>
          </div>
        )}
        <div
          onLoad={handleItemRendered}
          className={`${questionData.assigned_to && user_Is_head !== 0
            ? "disable__section__wrapper row align-items-center"
            : "row align-items-center"
            }`}
          style={{ position: "relative" }}
        >
          {questionData.questionType === "quantitative_trends" && (
            <div className="col-md-12">
              <div>
                <TrandsInputCard
                  item={questionData}
                  answer={answers?.filter(
                    (obj) => obj?.questionId === questionData?.id
                  )}
                  handleSubmit={(questionData, answer) =>
                    handleAnswers(
                      questionData,
                      answer,
                      questionData?.questionType ?? questionData?.questionType
                    )
                  }
                  handleDeleteSubmit={(
                    questionData,
                    answer,
                    tempArray,
                    index
                  ) =>
                    handleDeleteAnswers(
                      questionData,
                      answer,
                      questionData?.questionType,
                      tempArray,
                      index
                    )
                  }
                  handleAuditssSubmit={handleAuditsSubmit}
                  changeAns={() => changeAnswer(questionData?.title)}
                  formula={
                    questionData?.formula == null
                      ? listing === "audit"
                        ? true
                        : false
                      : true
                  }
                  listing={listing}
                  initalValue={initalValue}
                  meterListData={meterList}
                  processListData={processList}
                  permission={permission}
                  filterAssignedDetail={assignedDetail}
                  handleShow1={handleShow}
                  readOnlyRes={readOnlyRes}
                  reminderToUser={reminderToUser}
                  requestDueDate={requestDueDate}
                  handleShow2={handleShow}
                  auditAnswer={auditAnswer}
                  setUploadItem={setUploadItem}
                  uploadFile={uploadFile}
                  questionData={questionData}
                  attatchment={attatchment}
                // setUrl={ setUrl}
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            {questionData.questionType == "yes_no" && (
              <div className="tableOutput__area">
                <Table striped bordered className="m-0">
                  <tbody>
                    {assignedDetail ? (
                      <>
                        <tr className="fixed_tr_section">
                          <td>Attribute</td>
                          <td>Value</td>
                        </tr>

                        {!assignedDetail?.assignedByDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Assign By</td>
                              <td>
                                {assignedDetail?.assignedByDetails &&
                                  assignedDetail?.assignedByDetails.map(
                                    (user, index) => (
                                      <div style={{ display: "flex" }}>
                                        <span>
                                          {user.first_name} {user.last_name}
                                        </span>
                                        <span style={{ marginLeft: "20px" }}>
                                          {new Date(
                                            assignedDetail.createdAt
                                          ).toLocaleString("en-US", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                          })}
                                        </span>
                                      </div>
                                    )
                                  )}
                                <tr></tr>
                              </td>
                            </tr>
                          )}

                        {!assignedDetail?.assignedToDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Assign to</td>
                              <td>
                                <div className="d-flex">
                                  {assignedDetail?.assignedToDetails.map(
                                    (user, index) => (
                                      <span key={index}>
                                        <span
                                          data-tooltip={assignedDetail?.assignedToDetails
                                            .map((user) => user.email)
                                            .join(", ")}
                                        >
                                          {user.first_name} {user.last_name}
                                        </span>
                                        {index <
                                          assignedDetail?.assignedToDetails
                                            .length -
                                          1 && ", "}
                                      </span>
                                    )
                                  )}
                                  {assignedDetail?.dueDate && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Due Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            <div className="hstack">
                                              <p className="m-0">
                                                {new Date(
                                                  assignedDetail?.dueDate
                                                ).toLocaleString("en-US", {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                })}
                                              </p>

                                              {/* {assignedDetail &&
                                          !readOnlyRes &&
                                          0 && (
                                            <>
                                              <GaugeChart
                                                style={chartStyle}
                                                id="gauge-chart2"
                                                nrOfLevels={nrOfLevels}
                                                colors={["#3f88a5", "#1f9ed1"]}
                                              />
                                              <i
                                                className="fas fa-stopwatch mx-2"
                                                title="Reminder"
                                                onClick={() =>
                                                  reminderToUser(
                                                    questionData.id
                                                  )
                                                }
                                              ></i>
                                            </>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.assignedBy !==
                                            1 &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Request Due Date"
                                              onClick={() =>
                                                requestDueDate(questionData.id)
                                              }
                                            ></i>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.dueDateRequested &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Change Due Date"
                                              onClick={() => handleShow()}
                                            ></i>
                                          )} */}
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}

                                  {answeredData && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Answered Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            {new Date(
                                              answeredData
                                            ).toLocaleString("en-US", {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                        {!assignedDetail?.assignedByDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Due Date</td>
                              <td>
                                <div className="d-flex">
                                  <div className="hstack">
                                    <p className="m-0">
                                      {new Date(
                                        assignedDetail?.dueDate
                                      ).toLocaleString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </p>
                                    {assignedDetail && !readOnlyRes && 0 ? (
                                      <GaugeChart
                                        style={chartStyle}
                                        id="gauge-chart2"
                                        nrOfLevels={nrOfLevels}
                                        colors={["#FF5F6D", "#FFC371"]}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    {assignedDetail && !readOnlyRes && 0 ? (
                                      <i
                                        className="fas fa-stopwatch mx-2"
                                        title="Reminder"
                                        onClick={() =>
                                          reminderToUser(questionData.id)
                                        }
                                      ></i>
                                    ) : (
                                      <></>
                                    )}
                                    {new Date(assignedDetail?.dueDate) <
                                      new Date() ? (
                                      assignedDetail?.assignedBy !== 1 && (
                                        <i
                                          className="far fa-calendar-plus mx-2"
                                          title="Request Due Date"
                                          onClick={() =>
                                            requestDueDate(questionData.id)
                                          }
                                        ></i>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                    {new Date(assignedDetail?.dueDate) <
                                      new Date() ? (
                                      assignedDetail?.dueDateRequested && (
                                        <i
                                          className="far fa-calendar-plus mx-2"
                                          title="Change Due Date"
                                          onClick={() => handleShow()}
                                        ></i>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  {answeredData && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Answered Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            {new Date(
                                              answeredData
                                            ).toLocaleString("en-US", {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                        {auditedBy && auditedBy !== "null null" && (
                          <tr>
                            <td>Audited By</td>
                            <td>
                              <span>{auditedBy}</span>
                            </td>
                          </tr>
                        )}
                        {auditedDate && (auditStatus === "ACCEPTED" ||
                          auditStatus === "REJECTED") && (
                            <tr>
                              <td>Audit Status</td>
                              <td>
                                <div style={{ display: "flex" }}>
                                  <span>
                                    {auditStatus === "ACCEPTED"
                                      ? "Accepted"
                                      : "Rejected"}
                                  </span>
                                  {auditedDate && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Audited Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            <span>
                                              {new Date(
                                                auditedDate
                                              ).toLocaleString("en-US", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                              })}
                                              <i
                                                onClick={() => handleShowRemark(auditedRemark)}
                                                title={auditedRemark}
                                                className="fa fa-eye"
                                                style={{ marginLeft: "5px" }}
                                              ></i>
                                            </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        {assignedDetail && (
                          <tr>
                            <td>Attatchment</td>
                            <td>
                              <div style={{ display: "flex" }}>
                                <div className="d-flex">
                                  <div>
                                    {" "}
                                    <UploadIcon
                                      setUploadItem={setUploadItem}
                                      uploadFile={uploadFile}
                                      questionData={questionData}
                                    />
                                  </div>
                                  <div>
                                    {" "}
                                    {attatchment &&
                                      attatchment.length &&
                                      attatchment.map((attachment, index) => {
                                        return (
                                          <DownloadIcon
                                            key={index}
                                            attachment={attachment}
                                          />
                                        );
                                      })}
                                  </div>
                                </div>

                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        History
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        <div
                                          style={{ cursor: "pointer" }}
                                          onClick={handleShow}
                                        >
                                          View
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td>Answer</td>
                          <td>
                            <Form>
                              <div className="d-flex align-items-center gap-4">
                                <div>
                                  <input
                                    inline="true"
                                    label="Yes"
                                    name="group1"
                                    type={"radio"}
                                    disabled={true}
                                    value={"yes"}
                                    checked={value === "yes"}
                                    onChange={(value) => {
                                      handleAnswers(
                                        questionData,
                                        value,
                                        questionData?.questionType,
                                        "answer"
                                      );
                                    }}
                                  />
                                  <span className="mx-2">Yes</span>
                                </div>
                                <div>
                                  <input
                                    inline="true"
                                    label="No"
                                    name="group1"
                                    type={"radio"}
                                    disabled={true}
                                    value={"no"}
                                    checked={value === "no"}
                                    onChange={(value) => {
                                      handleAnswers(
                                        questionData,
                                        value,
                                        questionData?.questionType,
                                        "answer"
                                      );
                                    }}
                                  />
                                  <span className="mx-2">No</span>
                                </div>
                              </div>
                            </Form>
                          </td>
                        </tr>
                        <tr>
                          <td>Provide Details</td>
                          <td>
                            <textarea
                              className="w-100 mt-2"
                              style={{ resize: "vertical", overflowY: "auto" }}
                              onChange={(value) => {
                                handleAnswers(
                                  questionData,
                                  value,
                                  questionData?.questionType,
                                  "Deatils"
                                );
                              }}
                            ></textarea>
                          </td>
                        </tr>

                        <tr>
                          <td>Provide Web link</td>
                          <td>
                            <textarea
                              className="w-100 mt-2"
                              style={{ resize: "vertical", overflowY: "auto" }}
                              onChange={(value) => {
                                handleAnswers(
                                  questionData,
                                  value,
                                  questionData?.questionType,
                                  "weblink"
                                );
                              }}
                            ></textarea>
                          </td>
                        </tr>
                      </>
                    )}
                    {assignedDetail && (
                      <>

                        <tr>
                          <td>Answer</td>
                          <td>
                            <Form>
                              <div className="d-flex align-items-center gap-4">
                                <div>
                                  <input
                                    inline="true"
                                    label="Yes"
                                    name="group1"
                                    type={"radio"}
                                    disabled={readOnlyRes}
                                    value={"yes"}
                                    // checked={value &&(JSON.parse(value)).answer === "yes"}
                                    checked={value && questionData?.questionType === "yes_no" && (typeof value === "object" ? false : JSON.parse(value).answer === "yes")}
                                    onChange={(value) => {
                                      handleAnswers(
                                        questionData,
                                        value,
                                        questionData?.questionType,
                                        "answer"
                                      );
                                    }}
                                  />
                                  <span className="mx-2">Yes</span>
                                </div>
                                <div>
                                  <input
                                    inline="true"
                                    label="No"
                                    name="group1"
                                    type={"radio"}
                                    disabled={readOnlyRes}
                                    value={"no"}
                                    // checked={value && (JSON.parse(value)).answer === "no"}
                                    checked={value && questionData?.questionType === "yes_no" && (typeof value === "object" ? false : JSON.parse(value).answer === "no")}
                                    onChange={(value) => {
                                      handleAnswers(
                                        questionData,
                                        value,
                                        questionData?.questionType,
                                        "answer"
                                      );
                                    }}
                                  />
                                  <span className="mx-2">No</span>
                                </div>
                                <div>
                                  {!readOnlyRes && (
                                    <i
                                      className="fas fa-pen-square position-absolute"
                                      title="Edit Answer"
                                      onClick={() => handleEditClick()}
                                      style={{
                                        right: "5px",
                                        top: "5px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  )}
                                </div>
                              </div>
                            </Form>
                          </td>
                        </tr>
                        {value && questionData?.questionType === "yes_no" && (typeof value === "object" ? false : JSON.parse(value).answer === "yes") ? <><tr>
                          <td>Provide Details</td>
                          <td>
                            <textarea
                              className="w-100 mt-2"
                              style={{ resize: "vertical", overflowY: "auto" }}
                              value={value && typeof value !== "object" && (JSON.parse(value))?.details}
                              onChange={(value) => {
                                handleAnswers(
                                  questionData,
                                  value,
                                  questionData?.questionType,
                                  "details"
                                );
                              }}
                            ></textarea>
                          </td>
                        </tr>

                          <tr>
                            <td>Provide Web link</td>
                            <td>
                              <textarea
                                className="w-100 mt-2"
                                style={{ resize: "vertical", overflowY: "auto" }}
                                value={value && typeof value !== "object" && (JSON.parse(value)).weblink}
                                onChange={(value) => {
                                  handleAnswers(
                                    questionData,
                                    value,
                                    questionData?.questionType,
                                    "weblink"
                                  );
                                }}
                              ></textarea>
                            </td>
                          </tr></> : <></>}
                        {questionData?.not_applicable ? (
                          <tr>
                            <input
                              type="checkbox"
                              // checked={true}
                              className="m-2 checkbox-input"
                              onChange={(e) => {
                                handleAnswers(
                                  questionData,
                                  e.target.checked ? "N.A." : null,
                                  questionData?.questionType
                                );
                              }}
                            />
                            <span>Not Applicable</span>
                          </tr>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            )}

            {questionData.questionType == "tabular_question" &&
              listing !== "audit" &&
              listing !== "HISTROY" && (
                <TebularInputCard
                  subQuestionData={subQuestionData}
                  auditedBy={auditedBy}
                  auditedRemark={auditedRemark}
                  item={questionData}
                  filterAssignedDetail={assignedDetail}
                  value={value}
                  handleAddRow={handleAddRow}
                  handleOnChange={(
                    questionData,
                    event,
                    questionType,
                    source,
                    endDate,
                    performed
                  ) =>
                    handleAnswers(
                      questionData,
                      event,
                      "tabular_question",
                      source,
                      endDate,
                      performed
                    )
                  }
                  handleKeyDown={(questionData, event) =>
                    handlekeyPress(questionData, event)
                  }
                  filterAnswer={filterAnswer}
                  combinedAnswers={combinedAnswers}
                  meterListData={meterList}
                  readOnlyRes={readOnlyRes}
                  handleShow1={handleShow}
                  reminderToUser={reminderToUser}
                  requestDueDate={requestDueDate}
                  handleShow2={handleShow}
                  setUploadItem={setUploadItem}
                  uploadFile={uploadFile}
                  questionData={questionData}
                  attatchment={attatchment}
                />
              )}
            {(listing == "audit" || listing == "HISTROY") && (
              <>
                <TebularInputCardAnswer
                  filterAssignedDetail={assignedDetail}
                  item={questionData}
                  combinedAnswers={combinedAnswers}
                  userIsHead={user_Is_head}
                  userIsHistory={0}
                  meterListData={meterList}
                  auditAnswer={auditAnswer}
                  handleValidateSubmit={handleAuditsSubmit}
                  listing={listing}
                  attatchment={attatchment}
                />
              </>
            )}
            {questionData.questionType == "quantitative" && (
              <div className="tableOutput__area">
                <Table striped bordered className="m-0">
                  <tbody>
                    {assignedDetail ? (
                      <>
                        <tr className="fixed_tr_section">
                          <td>Attribute</td>
                          <td>Value</td>
                        </tr>

                        {!assignedDetail?.assignedByDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Assign By</td>
                              <td>
                                {assignedDetail?.assignedByDetails &&
                                  assignedDetail?.assignedByDetails.map(
                                    (user, index) => (
                                      <div style={{ display: "flex" }}>
                                        <span>
                                          {user.first_name} {user.last_name}
                                        </span>
                                        <span style={{ marginLeft: "20px" }}>
                                          {new Date(
                                            assignedDetail.createdAt
                                          ).toLocaleString("en-US", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "short",
                                          })}
                                        </span>
                                      </div>
                                    )
                                  )}
                                <tr></tr>
                              </td>
                            </tr>
                          )}

                        {!assignedDetail?.assignedToDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Assign to</td>
                              <td>
                                <div className="d-flex">
                                  {assignedDetail?.assignedToDetails.map(
                                    (user, index) => (
                                      <span key={index}>
                                        <span
                                          data-tooltip={assignedDetail?.assignedToDetails
                                            .map((user) => user.email)
                                            .join(", ")}
                                        >
                                          {user.first_name} {user.last_name}
                                        </span>
                                        {index <
                                          assignedDetail?.assignedToDetails
                                            .length -
                                          1 && ", "}
                                      </span>
                                    )
                                  )}
                                  {assignedDetail?.dueDate && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Due Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            <div className="hstack">
                                              <p className="m-0">
                                                {new Date(
                                                  assignedDetail.dueDate
                                                ).toLocaleString("en-US", {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                })}
                                              </p>

                                              {/* {assignedDetail &&
                                          !readOnlyRes &&
                                          0 && (
                                            <>
                                              <GaugeChart
                                                style={chartStyle}
                                                id="gauge-chart2"
                                                nrOfLevels={nrOfLevels}
                                                colors={["#3f88a5", "#1f9ed1"]}
                                              />
                                              <i
                                                className="fas fa-stopwatch mx-2"
                                                title="Reminder"
                                                onClick={() =>
                                                  reminderToUser(
                                                    questionData.id
                                                  )
                                                }
                                              ></i>
                                            </>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.assignedBy !==
                                            1 &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Request Due Date"
                                              onClick={() =>
                                                requestDueDate(questionData.id)
                                              }
                                            ></i>
                                          )}
                                        {new Date(
                                          assignedDetail.dueDate
                                        ) < new Date() &&
                                          assignedDetail?.dueDateRequested &&
                                          0 && (
                                            <i
                                              className="far fa-calendar-plus mx-2"
                                              title="Change Due Date"
                                              onClick={() => handleShow()}
                                            ></i>
                                          )} */}
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}

                                  {answeredData && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Answered Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            {new Date(
                                              answeredData
                                            ).toLocaleString("en-US", {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                        {!assignedDetail?.assignedByDetails.some(
                          (item) => item.id == userId
                        ) && (
                            <tr>
                              <td>Due Date</td>
                              <td>
                                <div className="d-flex">
                                  <div className="hstack">
                                    <p className="m-0">
                                      {new Date(
                                        assignedDetail?.dueDate
                                      ).toLocaleString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </p>
                                    {assignedDetail && !readOnlyRes && 0 ? (
                                      <GaugeChart
                                        style={chartStyle}
                                        id="gauge-chart2"
                                        nrOfLevels={nrOfLevels}
                                        colors={["#FF5F6D", "#FFC371"]}
                                      />
                                    ) : (
                                      <></>
                                    )}
                                    {assignedDetail && !readOnlyRes && 0 ? (
                                      <i
                                        className="fas fa-stopwatch mx-2"
                                        title="Reminder"
                                        onClick={() =>
                                          reminderToUser(questionData.id)
                                        }
                                      ></i>
                                    ) : (
                                      <></>
                                    )}
                                    {new Date(assignedDetail?.dueDate) <
                                      new Date() ? (
                                      assignedDetail?.assignedBy !== 1 && (
                                        <i
                                          className="far fa-calendar-plus mx-2"
                                          title="Request Due Date"
                                          onClick={() =>
                                            requestDueDate(questionData.id)
                                          }
                                        ></i>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                    {new Date(assignedDetail?.dueDate) <
                                      new Date() ? (
                                      assignedDetail?.dueDateRequested && (
                                        <i
                                          className="far fa-calendar-plus mx-2"
                                          title="Change Due Date"
                                          onClick={() => handleShow()}
                                        ></i>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  {answeredData && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Answered Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            {new Date(
                                              answeredData
                                            ).toLocaleString("en-US", {
                                              weekday: "short",
                                              day: "numeric",
                                              month: "short",
                                            })}
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                        {auditedBy && auditedBy !== "null null" && (
                          <tr>
                            <td>Audited By</td>
                            <td>
                              <span>{auditedBy}</span>
                            </td>
                          </tr>
                        )}
                        {auditedDate && (auditStatus === "ACCEPTED" ||
                          auditStatus === "REJECTED") && (
                            <tr>
                              <td>Audit Status</td>
                              <td>
                                <div style={{ display: "flex" }}>
                                  <span>
                                    {auditStatus === "ACCEPTED"
                                      ? "Accepted"
                                      : "Rejected"}
                                  </span>
                                  {auditedDate && (
                                    <div
                                      className="mx-auto"
                                      style={{ margin: "-8px" }}
                                    >
                                      <table
                                        style={{
                                          borderCollapse: "collapse",
                                          width: "100%",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              paddingRight: "33px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            Audited Date
                                          </td>
                                          <td
                                            style={{
                                              borderLeft: "1px solid gray",
                                              padding: "8px",
                                              borderColor: "#d7cfcfa6",
                                            }}
                                          >
                                            <span>
                                              {new Date(
                                                auditedDate
                                              ).toLocaleString("en-US", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                              })}
                                              <i
                                                onClick={() => handleShowRemark(auditedRemark)}
                                                title={auditedRemark}
                                                className="fa fa-eye"
                                                style={{ marginLeft: "5px" }}
                                              ></i>
                                            </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        {assignedDetail && (
                          <tr>
                            <td>Attatchment</td>
                            <td>
                              <div style={{ display: "flex" }}>
                                <div className="d-flex">
                                  <div>
                                    {" "}
                                    <UploadIcon
                                      setUploadItem={setUploadItem}
                                      uploadFile={uploadFile}
                                      questionData={questionData}
                                    />
                                  </div>
                                  <div>
                                    {" "}
                                    {attatchment &&
                                      attatchment.length &&
                                      attatchment.map((attachment, index) => {
                                        return (
                                          <DownloadIcon
                                            key={index}
                                            attachment={attachment}
                                          />
                                        );
                                      })}
                                  </div>
                                </div>

                                <div
                                  className="mx-auto"
                                  style={{ margin: "-8px" }}
                                >
                                  <table
                                    style={{
                                      borderCollapse: "collapse",
                                      width: "100%",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          paddingRight: "33px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        History
                                      </td>
                                      <td
                                        style={{
                                          borderLeft: "1px solid gray",
                                          padding: "8px",
                                          borderColor: "#d7cfcfa6",
                                        }}
                                      >
                                        <div
                                          style={{ cursor: "pointer" }}
                                          onClick={handleShow}
                                        >
                                          View
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td>Answer</td>
                        <td>
                          <input
                            className="p-2"
                            type="number"
                            value={value}
                            readOnly={true}
                            onKeyDown={(e) => {
                              handlekeyPress(questionData, e);
                            }}
                            onChange={(value) => {
                              handleAnswers(
                                questionData,
                                value,
                                questionData?.questionType
                              );
                            }}
                          />
                        </td>
                      </tr>
                    )}

                    {/* {
                      !assignedDetail && (
                        <tr>
                          <td>Assign To </td>
                          <td onClick={handleShow}>Assign to me</td>
                        </tr>
                      )
                    } */}

                    {assignedDetail && (
                      <>
                        <tr>
                          <td>Answer</td>

                          <td>
                            <input
                              className="p-2"
                              type="number"
                              value={value}
                              readOnly={readOnlyRes || !editable}
                              onKeyDown={(e) => {
                                handlekeyPress(questionData, e);
                              }}
                              onChange={(value) => {
                                handleAnswers(
                                  questionData,
                                  value,
                                  questionData?.questionType
                                );
                              }}
                              style={{ paddingRight: "30px" }}
                            />
                            {!readOnlyRes && (
                              <i
                                className="fas fa-pen-square position-absolute"
                                title="Edit Answer"
                                onClick={() => handleEditClick()}
                                style={{
                                  right: "5px",
                                  top: "5px",
                                  cursor: "pointer",
                                }}
                              ></i>
                            )}
                          </td>
                        </tr>
                        {questionData?.not_applicable ? (
                          <div>
                            <input
                              type="checkbox"
                              // checked={true}
                              className="m-2 checkbox-input"
                              onChange={(e) => {
                                handleAnswers(
                                  questionData,
                                  e.target.checked ? "N.A." : null,
                                  questionData?.questionType
                                );
                              }}
                            />
                            <span>Not Applicable</span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={showRemark} onHide={handleShowRemarkClose}>
        <Modal.Header closeButton>
          <Modal.Title>Audit Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control value={remark} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleShowRemarkClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Due Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-3">
            <label>Select Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(e) => {
                setDueDate(e);
              }}
              className="form-control date-picker-input"
              required
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <NavLink to={"/"}>Clear</NavLink>
          <Button className="new_button_style w-auto" onClick={updateDueDate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SectorAnswer;
