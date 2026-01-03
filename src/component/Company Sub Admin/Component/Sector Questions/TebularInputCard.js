import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import UploadIcon from "./Icons/uploadIcon";
import GaugeChart from "react-gauge-chart";
import DownloadIcon from "./Icons/downloadIcon";

export default function TebularInputCard({
  subQuestionData,
  filterAssignedDetail,
  item,
  combinedAnswers,
  value,
  handleOnChange,
  filterAnswer,
  handleKeyDown,
  handleAddRow,
  meterListData,
  readOnlyRes,
  reminderToUser,
  requestDueDate,
  setUploadItem,
  uploadFile,
  questionData,
  attatchment,
}) {
  console.log(filterAssignedDetail, "filterAssignedDetailfilterAssignedDetail")
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  const [answer2D, setAnswer2D] = useState([]);
  const [sourcewiseAnsered, setSourceWiseAnswered] = useState({
    answeredDate: "",
    auditorName: "",
    audit_status: "",
    auditedRemark: "",
    performed: false,
  });
  const [formattedDate, setFormattedDate] = useState(null);
  const [auditedDate, setAuditedDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  // const [filterAssignedDetail, setFilterAssignedDetail] =
  //   useState(filterAssignedDetail);
  const [viewAssignedBy, setViewAssignedBy] = useState(null);
  const [viewAssignedTo, setViewAssignedTo] = useState(null);
  const [source, setSource] = useState(meterListData[0]?.id);
  const [show, setShow] = useState(false);
  const [columnValue, setColumnValue] = useState("");
  const [columnValues, setColumnValues] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [remark, setRemark] = useState(false);
  const [showAnswers, setShowAnswers] = useState(null);
  const [performed, setPerformed] = useState(null);
  const [items, setItems] = useState(item);
  const handleShowAddRowClose = () => setShowAddRow(false);
  const handleShowAnswerClose = () => setShowAnswer(false);
  const handleShowRemarkClose = () => setShowRemark(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [nrOfLevels, setNrOfLevels] = useState(2);
  const handleAddExtraRowAndColumn = (value) => {
    setShowAddRow(true);
    setColumnValue(value);
  };
  const handleAddExtraRowAndColumns = () => {
    handleAddRow(item, columnValue, columnValues);
    handleShowAddRowClose();
  };
  const handleShowRemark = (remarkValue) => {
    setShowRemark(true);
    setRemark(remarkValue);
  };
  const handleShowAnswer = (value) => {
    if (value && Number.isNaN(Number(value))) {
      setShowAnswer(true);
      setShowAnswers(value);
    }
  };
  const chartStyle = {
    width: 60,
    height: 20,
  };

  useEffect(() => {
    // if (subQuestionData?.title) {
    setItems(item);
    // }
  }, [subQuestionData, item]);
  useEffect(() => {
    if (filterAssignedDetail) {
      const performed = filterAnswer && filterAnswer[0]?.performed;
      setPerformed(performed);
      const answers =
        combinedAnswers && combinedAnswers.find((obj) => obj.sourceId == source);
      if (answers) {
        setPerformed(answers?.performed ? true : false);
        setSourceWiseAnswered(answers);
        setAnswer2D(answers?.answer);
        const answeredDate = new Date(answers?.answeredDate);
        const formattedDate = answeredDate.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        setFormattedDate(formattedDate);
        const auditedDat = new Date(answers?.auditedDate);
        const auditedDates = auditedDat.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        setAuditedDate(auditedDates);
        const auditedD = new Date(filterAssignedDetail.dueDate);
        const auditedDatesass = auditedD.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        setDueDate(auditedDatesass);
        const viewAssignedBy = filterAssignedDetail?.assignedByDetails.some(
          (item) => item.id == userId
        );
        setViewAssignedBy(viewAssignedBy);
        const viewAssignedTo = filterAssignedDetail?.assignedToDetails.some(
          (item) => item.id == userId
        );
        setViewAssignedTo(viewAssignedTo);
      } else {
        setAnswer2D(value && value.length > 0 ? value : []);
        const auditedDat = new Date(filterAssignedDetail.dueDate);
        const auditedDates = auditedDat.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        setDueDate(auditedDates);
        const viewAssignedBy =
          filterAssignedDetail &&
          filterAssignedDetail?.assignedByDetails.some(
            (item) => item.id == userId
          );
        setViewAssignedBy(viewAssignedBy);
        const viewAssignedTo =
          filterAssignedDetail &&
          filterAssignedDetail?.assignedToDetails.some(
            (item) => item.id == userId
          );
        setViewAssignedTo(viewAssignedTo);
      }
    }
  }, [source, combinedAnswers, filterAssignedDetail, value, filterAnswer]);
  return (
    <>
      <div className="tableOutput__area">
        <Table striped bordered hover>
          <tbody>
            {filterAssignedDetail ? (
              <>
                <tr
                  style={{
                    background: "var(--primaryColor)",
                  }}
                >
                  <td
                    style={{
                      color: "var(--neutralColor)",
                    }}
                  >
                    Attribute
                  </td>
                  <td
                    style={{
                      color: "var(--neutralColor)",
                    }}
                  >
                    Value
                  </td>
                </tr>

                {!viewAssignedBy && (
                  <tr>
                    <td>Assign By</td>
                    <td>
                      {filterAssignedDetail?.assignedByDetails.map(
                        (user, index) => (
                          <div style={{ display: "flex" }}>
                            <span>
                              {user.first_name} {user.last_name}
                            </span>
                            <span style={{ marginLeft: "20px" }}>
                              {formattedDate}
                            </span>
                          </div>
                        )
                      )}
                    </td>
                  </tr>
                )}
                {!viewAssignedTo && (
                  <tr>
                    <td>Assign to</td>
                    <td>
                      <div className="d-flex">
                        {filterAssignedDetail?.assignedToDetails.map(
                          (user, index) => (
                            <span key={index}>
                              <span
                                data-tooltip={filterAssignedDetail?.assignedToDetails
                                  .map((user) => user.email)
                                  .join(", ")}
                              >
                                {user.first_name} {user.last_name}
                              </span>
                              {index <
                                filterAssignedDetail?.assignedToDetails
                                  .length -
                                1 && ", "}
                            </span>
                          )
                        )}
                        {sourcewiseAnsered?.answeredDate && (
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
                                  Due Date
                                </td>
                                <td
                                  style={{
                                    borderLeft: "1px solid gray",
                                    padding: "8px",
                                    borderColor: "#d7cfcfa6",
                                  }}
                                >
                                  <div className="d-flex">
                                    <div className="hstack">
                                      <p className="m-0">{dueDate}</p>
                                      {filterAssignedDetail &&
                                        !readOnlyRes &&
                                        0 ? (
                                        <GaugeChart
                                          style={chartStyle}
                                          id="gauge-chart2"
                                          nrOfLevels={nrOfLevels}
                                          colors={["#FF5F6D", "#FFC371"]}
                                        />
                                      ) : (
                                        <></>
                                      )}
                                      {filterAssignedDetail &&
                                        !readOnlyRes &&
                                        0 ? (
                                        <i
                                          className="fas fa-stopwatch mx-2"
                                          title="Reminder"
                                          onClick={() =>
                                            reminderToUser(item.id)
                                          }
                                        ></i>
                                      ) : (
                                        <></>
                                      )}
                                      {new Date(filterAssignedDetail.dueDate) <
                                        new Date() ? (
                                        filterAssignedDetail?.assignedBy !==
                                        1 && (
                                          <i
                                            className="far fa-calendar-plus mx-2"
                                            title="Request Due Date"
                                            onClick={() =>
                                              requestDueDate(item.id)
                                            }
                                          ></i>
                                        )
                                      ) : (
                                        <></>
                                      )}
                                      {new Date(filterAssignedDetail.dueDate) <
                                        new Date() ? (
                                        filterAssignedDetail?.dueDateRequested && (
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
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </div>
                        )}
                        {sourcewiseAnsered?.answeredDate && (
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
                                  Answered Date
                                </td>
                                <td
                                  style={{
                                    borderLeft: "1px solid gray",
                                    padding: "8px",
                                    borderColor: "#d7cfcfa6",
                                  }}
                                >
                                  {formattedDate}
                                </td>
                              </tr>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {/* <tr>
                  <td>Assign Date</td>
                  <td>
                    {" "}
                    {new Date(filterAssignedDetail.createdAt).toLocaleString()}
                  </td>
                </tr> */}

                {!viewAssignedBy && (
                  <tr>
                    <td>Due Date</td>
                    <td>
                      <div className="d-flex">
                        <div className="hstack">
                          <p className="m-0">{dueDate}</p>
                          {filterAssignedDetail && !readOnlyRes && 0 ? (
                            <GaugeChart
                              style={chartStyle}
                              id="gauge-chart2"
                              nrOfLevels={nrOfLevels}
                              colors={["#FF5F6D", "#FFC371"]}
                            />
                          ) : (
                            <></>
                          )}
                          {filterAssignedDetail && !readOnlyRes && 0 ? (
                            <i
                              className="fas fa-stopwatch mx-2"
                              title="Reminder"
                              onClick={() => reminderToUser(item.id)}
                            ></i>
                          ) : (
                            <></>
                          )}
                          {new Date(filterAssignedDetail.dueDate) <
                            new Date() ? (
                            filterAssignedDetail?.assignedBy !== 1 && (
                              <i
                                className="far fa-calendar-plus mx-2"
                                title="Request Due Date"
                                onClick={() => requestDueDate(item.id)}
                              ></i>
                            )
                          ) : (
                            <></>
                          )}
                          {new Date(filterAssignedDetail.dueDate) <
                            new Date() ? (
                            filterAssignedDetail?.dueDateRequested && (
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
                        {sourcewiseAnsered?.answeredDate && (
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
                                  Answered Date
                                </td>
                                <td
                                  style={{
                                    borderLeft: "1px solid gray",
                                    padding: "8px",
                                    borderColor: "#d7cfcfa6",
                                  }}
                                >
                                  {formattedDate}
                                </td>
                              </tr>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                {sourcewiseAnsered?.auditorName &&
                  sourcewiseAnsered?.auditorName !== "null null" ? (
                  <tr>
                    <td>Audited By</td>
                    <td>
                      <span>{sourcewiseAnsered?.auditorName}</span>
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
                {/* {sourcewiseAnsered?.auditedDate && (
                  <tr>
                    <td>Audited Date</td>
                    <td>
                      {new Date(
                        sourcewiseAnsered?.auditedDate
                      ).toLocaleString()}
                    </td>
                  </tr>
                )} */}
                {sourcewiseAnsered?.audit_status &&
                  (sourcewiseAnsered?.audit_status === "ACCEPTED" ||
                    sourcewiseAnsered?.audit_status === "REJECTED") && (
                    <tr>
                      <td>Audit Status</td>
                      <td>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex" }}>
                            <span>
                              {sourcewiseAnsered?.audit_status === "ACCEPTED"
                                ? "Accepted"
                                : "Rejected"}
                            </span>
                            <span style={{ marginLeft: "20px" }}>
                              {auditedDate}
                            </span>
                          </div>
                          {auditedDate && (
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
                                    Remark
                                  </td>
                                  <td
                                    style={{
                                      borderLeft: "1px solid gray",
                                      padding: "8px",
                                      borderColor: "#d7cfcfa6",
                                    }}
                                  >
                                    <span>
                                      <i
                                        onClick={() =>
                                          handleShowRemark(
                                            sourcewiseAnsered?.auditedRemark
                                          )
                                        }
                                        title={sourcewiseAnsered?.auditedRemark}
                                        className="fa fa-eye"
                                        style={{ marginLeft: "5px" }}
                                      ></i>
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          )}
                          {/* <span style={{ marginLeft: "20px" }}>
                          {auditedDate}
                        </span> */}
                        </div>
                        {/* <span  >{sourcewiseAnsered?.audit_status}</span> */}
                      </td>
                    </tr>
                  )}
              </>
            ) : (
              <div className="table_width">
                <table className="table">
                  <thead>
                    <tr className="option_wrapper">
                      <th>
                        {item?.question_detail &&
                          item?.question_detail
                            .filter(function (item) {
                              return (
                                item.option_type == "firstRowAndColumnHead"
                              );
                            })
                            .map((col, ind) => {
                              return <th key={ind}>{col.option}</th>;
                            })}
                      </th>
                      {items?.question_detail &&
                        items?.question_detail
                          .filter(function (item) {
                            return item.option_type == "column";
                          })
                          .map((col, ind) => {
                            return <th key={ind}>{col.option}</th>;
                          })}
                    </tr>
                  </thead>
                  <tbody>
                    {items?.question_detail &&
                      items?.question_detail
                        .filter(function (item) {
                          return (
                            item.option_type == "row"
                            // subQuestionData?.title === item.option
                          );
                        })
                        .map((row, indRow) => {
                          return (
                            <tr
                              key={indRow}
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              <th
                                className={
                                  row.option.length > 300
                                    ? "option_wrapper_width"
                                    : row.option === "EMPLOYEES" ||
                                      row.option ===
                                      "Water withdrawal by source (in kilolitres)" ||
                                      row.option ===
                                      "Water discharge by destination and level of treatment (in kilolitres)" ||
                                      row.option ===
                                      "Total Waste generated (in metric tonnes)" ||
                                      row.option ===
                                      "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                      // row.option === "Category of waste " ||
                                      row.option ===
                                      "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                      row.option === "WORKERS" ||
                                      row.option ===
                                      "DIFFERENTLY ABLED EMPLOYEES" ||
                                      row.option ===
                                      "DIFFERENTLY ABLED WORKERS" ||
                                      row.option === "Permanent employees" ||
                                      row.option ===
                                      "Other than permanent employees" ||
                                      row.option === "Permanent workers" ||
                                      row.option ===
                                      "Other than permanent workers"
                                      ? "option_wrappers_width_100 text-center"
                                      : "option_wrapper_width_100"
                                }
                                style={
                                  row.option === "EMPLOYEES" ||
                                    row.option ===
                                    "Water withdrawal by source (in kilolitres)" ||
                                    row.option ===
                                    "Water discharge by destination and level of treatment (in kilolitres)" ||
                                    row.option ===
                                    "Total Waste generated (in metric tonnes)" ||
                                    row.option ===
                                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                    row.option === "Category of waste " ||
                                    row.option ===
                                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                    row.option === "WORKERS" ||
                                    row.option ===
                                    "DIFFERENTLY ABLED EMPLOYEES" ||
                                    row.option === "DIFFERENTLY ABLED WORKERS" ||
                                    row.option === "Permanent employees" ||
                                    row.option ===
                                    "Other than permanent employees" ||
                                    row.option === "Permanent workers" ||
                                    row.option === "Other than permanent workers"
                                    ? {
                                      backgroundColor: "#1f9ed1",
                                      color: "white",
                                    }
                                    : {}
                                }
                                colspan={
                                  row.option === "EMPLOYEES" ||
                                    row.option ===
                                    "Water withdrawal by source (in kilolitres)" ||
                                    row.option ===
                                    "Water discharge by destination and level of treatment (in kilolitres)" ||
                                    row.option ===
                                    "Total Waste generated (in metric tonnes)" ||
                                    row.option ===
                                    "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                    row.option === "Category of waste " ||
                                    row.option ===
                                    "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                    row.option === "WORKERS" ||
                                    row.option ===
                                    "DIFFERENTLY ABLED EMPLOYEES" ||
                                    row.option === "DIFFERENTLY ABLED WORKERS" ||
                                    row.option === "Permanent employees" ||
                                    row.option ===
                                    "Other than permanent employees" ||
                                    row.option === "Permanent workers" ||
                                    row.option === "Other than permanent workers"
                                    ? item?.question_detail.filter(
                                      (item) => item.option_type === "column"
                                    ).length + 1
                                    : 1
                                }
                              >
                                {subQuestionData?.title ? null : row.option}
                              </th>
                              {row.option == "EMPLOYEES" ||
                                row.option ===
                                "Water withdrawal by source (in kilolitres)" ||
                                row.option ===
                                "Water discharge by destination and level of treatment (in kilolitres)" ||
                                row.option ===
                                "Total Waste generated (in metric tonnes)" ||
                                row.option ===
                                "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                row.option === "Category of waste" ||
                                row.option ===
                                "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                row.option === "WORKERS" ||
                                row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                                row.option === "DIFFERENTLY ABLED WORKERS" ||
                                row.option === "Permanent employees" ||
                                row.option === "Other than permanent employees" ||
                                row.option === "Permanent workers" ||
                                row.option === "Other than permanent workers" ? (
                                <></>
                              ) : (
                                items?.question_detail &&
                                items?.question_detail
                                  .filter(function (item) {
                                    return item.option_type == "column";
                                  })
                                  .map((col, indCol) => {
                                    const startDate =
                                      col.option.includes("Start date");
                                    const endDate =
                                      col.option.includes("End date");
                                    const isEmail =
                                      col.option.includes("E mail") ||
                                      row.option.includes("E mail");
                                    const isDate =
                                      col.option.includes("date") ||
                                      row.option.includes("date");
                                    const isYesNo =
                                      col.option.includes("Yes/ No") ||
                                      row.option.includes("Yes/ No") ||
                                      col.option.includes("Yes / No") ||
                                      row.option.includes("Yes / No") ||
                                      col.option.includes("Yes/No") ||
                                      row.option.includes("Yes/No");
                                    const isYear =
                                      col.option.includes("year") ||
                                      (row.option.includes("year") &&
                                        !row.option.includes("Yes/No"));
                                    const isContact =
                                      col.option.includes("Contact") ||
                                      row.option.includes("Contact");
                                    const isNumber =
                                      (col.option.includes("FY") &&
                                        !col.option.includes("Remark")) ||
                                      col.option.includes("%") ||
                                      row.option.includes("%") ||
                                      col.option.includes("Number") ||
                                      (row.option.includes("Number") &&
                                        !col.option.includes("Remarks")) ||
                                      col.option.includes("total") ||
                                      col.option.includes("Total") ||
                                      (row.option.includes("Total") &&
                                        !col.option.includes("Unit")) ||
                                      col.option.includes("No.") ||
                                      row.option.includes("No.") ||
                                      col.option.includes("Rate") ||
                                      row.option.includes("Rate") ||
                                      col.option.includes("in Rs") ||
                                      row.option.includes("in Rs") ||
                                      col.option.includes("Percentage");
                                    let inputType = "text";
                                    if (isYesNo) {
                                      inputType = "radio";
                                    } else if (isNumber) {
                                      inputType = "number";
                                    } else if (isDate || isYear) {
                                      inputType = "date";
                                    } else if (isEmail) {
                                      inputType = "email";
                                    } else if (isContact) {
                                      inputType = "tel";
                                    }
                                    const value =
                                      (answer2D &&
                                        answer2D[indRow] &&
                                        answer2D[indRow][indCol]) ||
                                      "";

                                    return (
                                      <td key={indCol}>
                                        {inputType !== "radio" ? (
                                          <input
                                            // readOnly={!filterAssignedDetail}
                                            value={value}
                                            // checked={value}
                                            checked={value === "yes"}
                                            readOnly={readOnlyRes}
                                            type="text"
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? isChecked
                                                    ? "yes"
                                                    : "no"
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                            onKeyDown={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleKeyDown(
                                                tempObj,
                                                inputType === "radio"
                                                  ? isChecked
                                                    ? "yes"
                                                    : "no"
                                                  : event
                                              );
                                            }}
                                          />
                                        ) : (
                                          <div>
                                            <label>
                                              <input
                                                type="radio"
                                                value="yes"
                                                checked={value === "yes"}
                                                readOnly={readOnlyRes}
                                                onChange={(event) => {
                                                  const isChecked =
                                                    event.target.checked;
                                                  const newValue = isChecked
                                                    ? "yes"
                                                    : "no"; // Toggle between "yes" and "no"
                                                  const tempObj = {
                                                    ...item,
                                                    indexRow: indRow,
                                                    indexCol: indCol,
                                                  };
                                                  handleOnChange(
                                                    tempObj,
                                                    inputType === "radio"
                                                      ? newValue
                                                      : event,
                                                    item?.questionType,
                                                    source,
                                                    endDate
                                                  );
                                                }}
                                              />
                                              Yes
                                            </label>

                                            <label>
                                              <input
                                                readOnly={readOnlyRes}
                                                type="radio"
                                                value="no"
                                                checked={value === "no"}
                                                onChange={(event) => {
                                                  const isChecked =
                                                    event.target.checked;
                                                  const newValue = isChecked
                                                    ? "no"
                                                    : "yes"; // Toggle between "yes" and "no"
                                                  const tempObj = {
                                                    ...item,
                                                    indexRow: indRow,
                                                    indexCol: indCol,
                                                  };
                                                  handleOnChange(
                                                    tempObj,
                                                    inputType === "radio"
                                                      ? newValue
                                                      : event,
                                                    item?.questionType,
                                                    source,
                                                    endDate
                                                  );
                                                }}
                                              />
                                              No
                                            </label>
                                          </div>
                                        )}
                                      </td>
                                    );
                                  })
                              )}
                            </tr>
                          );
                        })}
                  </tbody>
                </table>

                {/* <div className="d-flex">
                  
                  <div className="my-2 m-3">
                    <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('row')}>
                      Add new row
                    </button>
                  </div>
                  <div className="my-2">
                    <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('column')}>
                      Add new column
                    </button>
                  </div>
                </div> */}
                {/* {item?.add_row == 1 ? (
                <button className="new_button_style mb-3" onClick={handleAddRow}>
                  Add new row
                </button>
              ) : (
                ""
              )} */}
              </div>
            )}
            {/* {
              !filterAssignedDetail && (
                <tr>
                  <td>Assign To </td>
                  <td onClick={handleShow1}>Assign to me</td>
                </tr>
              )
            } */}
            {filterAssignedDetail && (
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
                    {auditedDate && (
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
                    )}
                    {/* <span style={{ marginLeft: "20px" }}>
                          {auditedDate}
                        </span> */}
                  </div>
                  {/* <span  >{sourcewiseAnsered?.audit_status}</span> */}
                </td>
              </tr>
            )}

            {/* {filterAssignedDetail && (
              <tr>
                <td>History</td>
                <td>
                  <div style={{ cursor: "pointer" }} onClick={handleShow}>
                    {" "}
                    View
                  </div>
                </td>
              </tr>
            )} */}
            {filterAssignedDetail && (
              <>
                <tr>
                  <td>Select Source</td>
                  <td>
                    {meterListData && meterListData.length === 1 ? (
                      meterListData[0]?.location
                    ) : (
                      <Form.Select
                        aria-label="Default select example p-5"
                        className="form-control"
                        name="meter_id"
                        defaultValue={source}
                        onChange={(event) => setSource(event.target.value)}
                        required
                      >
                        <option value="" hidden>
                          Please Select the Source
                        </option>
                        {meterListData &&
                          meterListData?.map((data, index) => {
                            return (
                              <option key={index} value={data.id}>
                                {data.location}
                              </option>
                            );
                          })}
                      </Form.Select>
                    )}
                  </td>
                </tr>

              </>
            )}
            {questionData?.yes_no_option ? <tr>
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
                        // disabled={true}
                        value={"yes"}
                        checked={performed === true}
                        onChange={(value) => {
                          handleOnChange(
                            questionData,
                            true,
                            questionData?.questionType,
                            source,
                            false,
                            "performed"
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
                        // disabled={true}
                        value={"no"}
                        checked={performed === false}
                        onChange={(value) => {
                          handleOnChange(
                            questionData,
                            false,
                            questionData?.questionType,
                            source,
                            false,
                            "performed"
                          );
                        }}
                      />
                      <span className="mx-2">No</span>
                    </div>
                  </div>
                </Form>
              </td>
            </tr> : <></>}
          </tbody>
        </Table>
        {filterAssignedDetail && (!questionData?.yes_no_option ? (
          <div className="table_width">
            <table className="table">
              <thead>
                <tr className="option_wrapper">
                  <th>
                    {item?.question_detail &&
                      item?.question_detail
                        .filter(function (item) {
                          return item.option_type == "firstRowAndColumnHead";
                        })
                        .map((col, ind) => {
                          return <th key={ind}>{col.option}</th>;
                        })}
                  </th>
                  {item?.question_detail &&
                    item?.question_detail
                      .filter(function (item) {
                        return item.option_type == "column";
                      })
                      .map((col, ind) => {
                        return <th key={ind}>{col.option}</th>;
                      })}
                </tr>
              </thead>
              <tbody>
                {subQuestionData?.title
                  ? item?.question_detail &&
                  item?.question_detail
                    .filter(function (item) {
                      return (
                        item.option_type == "row" &&
                        subQuestionData?.title === item.option
                      );
                    })
                    .map((row, indRow) => {
                      return (
                        <tr
                          key={indRow}
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <th
                            className={
                              row.option.length > 60
                                ? "option_wrapper_width"
                                : row.option.length > 4
                                  ? "option_wrapper_width_100"
                                  : "option_wrapper_width"
                            }
                          >
                            {subQuestionData?.title ? null : row.option}
                          </th>

                          {item?.question_detail &&
                            item?.question_detail
                              .filter(function (item) {
                                return item.option_type == "column";
                              })
                              .map((col, indCol) => {
                                const startDate =
                                  col.option.includes("Start date");
                                const endDate =
                                  col.option.includes("End date");
                                const isEmail =
                                  col.option.includes("E mail") ||
                                  row.option.includes("E mail");
                                const isDate =
                                  col.option.includes("date") ||
                                  row.option.includes("date");
                                const isYesNo =
                                  col.option.includes("Yes/ No") ||
                                  row.option.includes("Yes/ No") ||
                                  col.option.includes("Yes / No") ||
                                  row.option.includes("Yes / No") ||
                                  col.option.includes("Yes/No") ||
                                  row.option.includes("Yes/No");
                                const isYear =
                                  col.option.includes("year") ||
                                  (row.option.includes("year") &&
                                    !row.option.includes("Yes/No"));
                                const isContact =
                                  col.option.includes("Contact") ||
                                  row.option.includes("Contact");
                                const isNumber =
                                  (col.option.includes("FY") &&
                                    !col.option.includes("Remark")) ||
                                  col.option.includes("%") ||
                                  row.option.includes("%") ||
                                  col.option.includes("Number") ||
                                  (row.option.includes("Number") &&
                                    !col.option.includes("Remarks")) ||
                                  col.option.includes("total") ||
                                  col.option.includes("Total") ||
                                  (row.option.includes("Total") &&
                                    !col.option.includes("Unit")) ||
                                  col.option.includes("No.") ||
                                  row.option.includes("No.") ||
                                  col.option.includes("Rate") ||
                                  row.option.includes("Rate") ||
                                  col.option.includes("in Rs") ||
                                  row.option.includes("in Rs") ||
                                  col.option.includes("Percentage");
                                let inputType = "text";
                                if (isYesNo) {
                                  inputType = "radio";
                                } else if (isNumber) {
                                  inputType = "number";
                                } else if (isDate || isYear) {
                                  inputType = "date";
                                } else if (isEmail) {
                                  inputType = "email";
                                } else if (isContact) {
                                  inputType = "tel";
                                }
                                const value =
                                  (answer2D &&
                                    answer2D[indRow] &&
                                    answer2D[indRow][indCol]) ||
                                  "";

                                return (
                                  <td key={indCol}>
                                    {inputType !== "radio" ? (
                                      <input
                                        // readOnly={!filterAssignedDetail}
                                        value={value}
                                        // checked={value}
                                        checked={value === "yes"}
                                        readOnly={readOnlyRes}
                                        type={inputType}
                                        onChange={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleOnChange(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event,
                                            item?.questionType,
                                            source,
                                            endDate
                                          );
                                        }}
                                        onKeyDown={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleKeyDown(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div>
                                        <label>
                                          <input
                                            type="radio"
                                            value="yes"
                                            checked={value === "yes"}
                                            readOnly={readOnlyRes}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "yes"
                                                : "no";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                          />
                                          Yes
                                        </label>
                                        <label>
                                          <input
                                            readOnly={readOnlyRes}
                                            type="radio"
                                            value="no"
                                            checked={value === "no"}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "no"
                                                : "yes";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                          />
                                          No
                                        </label>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                        </tr>
                      );
                    })
                  : item?.question_detail &&
                  item?.question_detail
                    .filter(function (item) {
                      return item.option_type == "row";
                    })
                    .map((row, indRow) => {
                      return (
                        <tr
                          key={indRow}
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <th
                            className={
                              row.option.length > 300
                                ? "option_wrapper_width"
                                : row.option === "EMPLOYEES" ||
                                  row.option ===
                                  "Water withdrawal by source (in kilolitres)" ||
                                  row.option ===
                                  "Water discharge by destination and level of treatment (in kilolitres)" ||
                                  row.option ===
                                  "Total Waste generated (in metric tonnes)" ||
                                  row.option ===
                                  "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                  // row.option === "Category of waste" ||
                                  row.option ===
                                  "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                  row.option === "WORKERS" ||
                                  row.option ===
                                  "DIFFERENTLY ABLED EMPLOYEES" ||
                                  row.option ===
                                  "DIFFERENTLY ABLED WORKERS" ||
                                  row.option === "Permanent employees" ||
                                  row.option ===
                                  "Other than permanent employees" ||
                                  row.option === "Permanent workers" ||
                                  row.option ===
                                  "Other than permanent workers"
                                  ? "option_wrappers_width_100 text-center"
                                  : "option_wrapper_width_100"
                            }
                            style={
                              row.option === "EMPLOYEES" ||
                                row.option ===
                                "Water withdrawal by source (in kilolitres)" ||
                                row.option ===
                                "Water discharge by destination and level of treatment (in kilolitres)" ||
                                row.option ===
                                "Total Waste generated (in metric tonnes)" ||
                                row.option ===
                                "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                row.option === "Category of waste" ||
                                row.option ===
                                "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                row.option === "WORKERS" ||
                                row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                                row.option === "DIFFERENTLY ABLED WORKERS" ||
                                row.option === "Permanent employees" ||
                                row.option ===
                                "Other than permanent employees" ||
                                row.option === "Permanent workers" ||
                                row.option === "Other than permanent workers"
                                ? {
                                  backgroundColor: "#1f9ed1",
                                  color: "white",
                                }
                                : {}
                            }
                            colspan={
                              row.option === "EMPLOYEES" ||
                                row.option ===
                                "Water withdrawal by source (in kilolitres)" ||
                                row.option ===
                                "Water discharge by destination and level of treatment (in kilolitres)" ||
                                row.option ===
                                "Total Waste generated (in metric tonnes)" ||
                                row.option ===
                                "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                row.option === "Category of waste" ||
                                row.option ===
                                "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                row.option === "WORKERS" ||
                                row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                                row.option === "DIFFERENTLY ABLED WORKERS" ||
                                row.option === "Permanent employees" ||
                                row.option ===
                                "Other than permanent employees" ||
                                row.option === "Permanent workers" ||
                                row.option === "Other than permanent workers"
                                ? item?.question_detail.filter(
                                  (item) => item.option_type === "column"
                                ).length + 1
                                : 1
                            }
                          >
                            {subQuestionData?.title ? null : row.option}
                          </th>
                          {row.option == "EMPLOYEES" ||
                            row.option ===
                            "Water withdrawal by source (in kilolitres)" ||
                            row.option ===
                            "Water discharge by destination and level of treatment (in kilolitres)" ||
                            row.option ===
                            "Total Waste generated (in metric tonnes)" ||
                            row.option ===
                            "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                            row.option === "Category of waste" ||
                            row.option ===
                            "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                            row.option === "WORKERS" ||
                            row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                            row.option === "DIFFERENTLY ABLED WORKERS" ||
                            row.option === "Permanent employees" ||
                            row.option === "Other than permanent employees" ||
                            row.option === "Permanent workers" ||
                            row.option === "Other than permanent workers" ? (
                            <></>
                          ) : (
                            item?.question_detail &&
                            item?.question_detail
                              .filter(function (item) {
                                return item.option_type == "column";
                              })
                              .map((col, indCol) => {
                                const startDate =
                                  col.option.includes("Start date");
                                const endDate =
                                  col.option.includes("End date");
                                const isEmail =
                                  col.option.includes("E mail") ||
                                  row.option.includes("E mail");
                                const isDate =
                                  col.option.includes("date") ||
                                  row.option.includes("date");
                                const isYesNo =
                                  col.option.includes("Yes/ No") ||
                                  row.option.includes("Yes/ No") ||
                                  col.option.includes("Yes / No") ||
                                  row.option.includes("Yes / No") ||
                                  col.option.includes("Yes/No") ||
                                  row.option.includes("Yes/No");
                                const isYear =
                                  col.option.includes("year") ||
                                  (row.option.includes("year") &&
                                    !row.option.includes("Yes/No"));
                                const isContact =
                                  col.option.includes("Contact") ||
                                  row.option.includes("Contact");
                                const isNumber =
                                  (col.option.includes("FY") &&
                                    !col.option.includes("Remark")) ||
                                  col.option.includes("%") ||
                                  row.option.includes("%") ||
                                  col.option.includes("Number") ||
                                  (row.option.includes("Number") &&
                                    !col.option.includes("Remarks")) ||
                                  col.option.includes("total") ||
                                  col.option.includes("Total") ||
                                  (row.option.includes("Total") &&
                                    !col.option.includes("Unit")) ||
                                  col.option.includes("No.") ||
                                  row.option.includes("No.") ||
                                  col.option.includes("Rate") ||
                                  row.option.includes("Rate") ||
                                  col.option.includes("in Rs") ||
                                  row.option.includes("in Rs") ||
                                  col.option.includes("Percentage");
                                let inputType = "text";
                                if (isYesNo) {
                                  inputType = "radio";
                                } else if (isNumber) {
                                  inputType = "number";
                                } else if (isDate || isYear) {
                                  inputType = "date";
                                } else if (isEmail) {
                                  inputType = "email";
                                } else if (isContact) {
                                  inputType = "tel";
                                }
                                const value =
                                  (answer2D &&
                                    answer2D[indRow] &&
                                    answer2D[indRow][indCol]) ||
                                  "";

                                return (
                                  <td key={indCol}>
                                    {inputType !== "radio" ? (
                                      <input
                                        // readOnly={!filterAssignedDetail}
                                        value={value}
                                        // checked={value}
                                        onClick={() =>
                                          handleShowAnswer(value)
                                        }
                                        checked={value === "yes"}
                                        readOnly={readOnlyRes}
                                        type="text"
                                        onChange={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleOnChange(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event,
                                            item?.questionType,
                                            source,
                                            endDate
                                          );
                                        }}
                                        onKeyDown={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleKeyDown(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div>
                                        <label>
                                          <input
                                            type="radio"
                                            value="yes"
                                            checked={value === "yes"}
                                            readOnly={readOnlyRes}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "yes"
                                                : "no";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                            style={{ marginRight: "4px" }}
                                          />
                                          Yes
                                        </label>
                                        <label className="mx-3">
                                          <input
                                            readOnly={readOnlyRes}
                                            type="radio"
                                            value="no"
                                            checked={value === "no"}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "no"
                                                : "yes";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                            style={{ marginRight: "4px" }}
                                          />
                                          No
                                        </label>
                                      </div>
                                    )}
                                  </td>
                                );
                              })
                          )}
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            <div className="d-flex">
              {questionData?.not_applicable ? (
                <div className="my-2">
                  <input
                    type="checkbox"
                    // checked={true}
                    className="m-2 checkbox-input"
                  // onChange={handleCheckboxChange}
                  />
                  <span>Not Applicable</span>
                </div>
              ) : (
                <></>
              )}
              {/* <div className="my-2 m-2">
                <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('row')}>
                  Add new row
                </button>
              </div>
              <div className="my-2 m-2">
                <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('column')}>
                  Add new column
                </button>
              </div>
              <div className="my-2 m-2">
                <button className="new_button_style mb-3" >
                  Add Note
                </button>
              </div> */}
            </div>
            {/* {item?.add_row == 1 ? (
              <button className="new_button_style mb-3" onClick={handleAddRow}>
                Add new row
              </button>
            ) : (
              ""
            )} */}
          </div>
        ) : performed ?
          <div className="table_width">
            <table className="table">
              <thead>
                <tr className="option_wrapper">
                  <th>
                    {item?.question_detail &&
                      item?.question_detail
                        .filter(function (item) {
                          return item.option_type == "firstRowAndColumnHead";
                        })
                        .map((col, ind) => {
                          return <th key={ind}>{col.option}</th>;
                        })}
                  </th>
                  {item?.question_detail &&
                    item?.question_detail
                      .filter(function (item) {
                        return item.option_type == "column";
                      })
                      .map((col, ind) => {
                        return <th key={ind}>{col.option}</th>;
                      })}
                </tr>
              </thead>
              <tbody>
                {subQuestionData?.title
                  ? item?.question_detail &&
                  item?.question_detail
                    .filter(function (item) {
                      return (
                        item.option_type == "row" &&
                        subQuestionData?.title === item.option
                      );
                    })
                    .map((row, indRow) => {
                      return (
                        <tr
                          key={indRow}
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <th
                            className={
                              row.option.length > 60
                                ? "option_wrapper_width"
                                : row.option.length > 4
                                  ? "option_wrapper_width_100"
                                  : "option_wrapper_width"
                            }
                          >
                            {subQuestionData?.title ? null : row.option}
                          </th>

                          {item?.question_detail &&
                            item?.question_detail
                              .filter(function (item) {
                                return item.option_type == "column";
                              })
                              .map((col, indCol) => {
                                const startDate =
                                  col.option.includes("Start date");
                                const endDate =
                                  col.option.includes("End date");
                                const isEmail =
                                  col.option.includes("E mail") ||
                                  row.option.includes("E mail");
                                const isDate =
                                  col.option.includes("date") ||
                                  row.option.includes("date");
                                const isYesNo =
                                  col.option.includes("Yes/ No") ||
                                  row.option.includes("Yes/ No") ||
                                  col.option.includes("Yes / No") ||
                                  row.option.includes("Yes / No") ||
                                  col.option.includes("Yes/No") ||
                                  row.option.includes("Yes/No");
                                const isYear =
                                  col.option.includes("year") ||
                                  (row.option.includes("year") &&
                                    !row.option.includes("Yes/No"));
                                const isContact =
                                  col.option.includes("Contact") ||
                                  row.option.includes("Contact");
                                const isNumber =
                                  (col.option.includes("FY") &&
                                    !col.option.includes("Remark")) ||
                                  col.option.includes("%") ||
                                  row.option.includes("%") ||
                                  col.option.includes("Number") ||
                                  (row.option.includes("Number") &&
                                    !col.option.includes("Remarks")) ||
                                  col.option.includes("total") ||
                                  col.option.includes("Total") ||
                                  (row.option.includes("Total") &&
                                    !col.option.includes("Unit")) ||
                                  col.option.includes("No.") ||
                                  row.option.includes("No.") ||
                                  col.option.includes("Rate") ||
                                  row.option.includes("Rate") ||
                                  col.option.includes("in Rs") ||
                                  row.option.includes("in Rs") ||
                                  col.option.includes("Percentage");
                                let inputType = "text";
                                if (isYesNo) {
                                  inputType = "radio";
                                } else if (isNumber) {
                                  inputType = "number";
                                } else if (isDate || isYear) {
                                  inputType = "date";
                                } else if (isEmail) {
                                  inputType = "email";
                                } else if (isContact) {
                                  inputType = "tel";
                                }
                                const value =
                                  (answer2D &&
                                    answer2D[indRow] &&
                                    answer2D[indRow][indCol]) ||
                                  "";

                                return (
                                  <td key={indCol}>
                                    {inputType !== "radio" ? (
                                      <input
                                        // readOnly={!filterAssignedDetail}
                                        value={value}
                                        // checked={value}
                                        checked={value === "yes"}
                                        readOnly={readOnlyRes}
                                        type={inputType}
                                        onChange={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleOnChange(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event,
                                            item?.questionType,
                                            source,
                                            endDate
                                          );
                                        }}
                                        onKeyDown={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleKeyDown(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div>
                                        <label>
                                          <input
                                            type="radio"
                                            value="yes"
                                            checked={value === "yes"}
                                            readOnly={readOnlyRes}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "yes"
                                                : "no";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                          />
                                          Yes
                                        </label>
                                        <label>
                                          <input
                                            readOnly={readOnlyRes}
                                            type="radio"
                                            value="no"
                                            checked={value === "no"}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "no"
                                                : "yes";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                          />
                                          No
                                        </label>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                        </tr>
                      );
                    })
                  : item?.question_detail &&
                  item?.question_detail
                    .filter(function (item) {
                      return item.option_type == "row";
                    })
                    .map((row, indRow) => {
                      return (
                        <tr
                          key={indRow}
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <th
                            className={
                              row.option.length > 300
                                ? "option_wrapper_width"
                                : row.option === "EMPLOYEES" ||
                                  row.option ===
                                  "Water withdrawal by source (in kilolitres)" ||
                                  row.option ===
                                  "Water discharge by destination and level of treatment (in kilolitres)" ||
                                  row.option ===
                                  "Total Waste generated (in metric tonnes)" ||
                                  row.option ===
                                  "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                  // row.option === "Category of waste" ||
                                  row.option ===
                                  "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                  row.option === "WORKERS" ||
                                  row.option ===
                                  "DIFFERENTLY ABLED EMPLOYEES" ||
                                  row.option ===
                                  "DIFFERENTLY ABLED WORKERS" ||
                                  row.option === "Permanent employees" ||
                                  row.option ===
                                  "Other than permanent employees" ||
                                  row.option === "Permanent workers" ||
                                  row.option ===
                                  "Other than permanent workers"
                                  ? "option_wrappers_width_100 text-center"
                                  : "option_wrapper_width_100"
                            }
                            style={
                              row.option === "EMPLOYEES" ||
                                row.option ===
                                "Water withdrawal by source (in kilolitres)" ||
                                row.option ===
                                "Water discharge by destination and level of treatment (in kilolitres)" ||
                                row.option ===
                                "Total Waste generated (in metric tonnes)" ||
                                row.option ===
                                "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                row.option === "Category of waste" ||
                                row.option ===
                                "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                row.option === "WORKERS" ||
                                row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                                row.option === "DIFFERENTLY ABLED WORKERS" ||
                                row.option === "Permanent employees" ||
                                row.option ===
                                "Other than permanent employees" ||
                                row.option === "Permanent workers" ||
                                row.option === "Other than permanent workers"
                                ? {
                                  backgroundColor: "#1f9ed1",
                                  color: "white",
                                }
                                : {}
                            }
                            colspan={
                              row.option === "EMPLOYEES" ||
                                row.option ===
                                "Water withdrawal by source (in kilolitres)" ||
                                row.option ===
                                "Water discharge by destination and level of treatment (in kilolitres)" ||
                                row.option ===
                                "Total Waste generated (in metric tonnes)" ||
                                row.option ===
                                "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                                row.option === "Category of waste" ||
                                row.option ===
                                "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                                row.option === "WORKERS" ||
                                row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                                row.option === "DIFFERENTLY ABLED WORKERS" ||
                                row.option === "Permanent employees" ||
                                row.option ===
                                "Other than permanent employees" ||
                                row.option === "Permanent workers" ||
                                row.option === "Other than permanent workers"
                                ? item?.question_detail.filter(
                                  (item) => item.option_type === "column"
                                ).length + 1
                                : 1
                            }
                          >
                            {subQuestionData?.title ? null : row.option}
                          </th>
                          {row.option == "EMPLOYEES" ||
                            row.option ===
                            "Water withdrawal by source (in kilolitres)" ||
                            row.option ===
                            "Water discharge by destination and level of treatment (in kilolitres)" ||
                            row.option ===
                            "Total Waste generated (in metric tonnes)" ||
                            row.option ===
                            "For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)" ||
                            row.option === "Category of waste" ||
                            row.option ===
                            "For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)" ||
                            row.option === "WORKERS" ||
                            row.option === "DIFFERENTLY ABLED EMPLOYEES" ||
                            row.option === "DIFFERENTLY ABLED WORKERS" ||
                            row.option === "Permanent employees" ||
                            row.option === "Other than permanent employees" ||
                            row.option === "Permanent workers" ||
                            row.option === "Other than permanent workers" ? (
                            <></>
                          ) : (
                            item?.question_detail &&
                            item?.question_detail
                              .filter(function (item) {
                                return item.option_type == "column";
                              })
                              .map((col, indCol) => {
                                const startDate =
                                  col.option.includes("Start date");
                                const endDate =
                                  col.option.includes("End date");
                                const isEmail =
                                  col.option.includes("E mail") ||
                                  row.option.includes("E mail");
                                const isDate =
                                  col.option.includes("date") ||
                                  row.option.includes("date");
                                const isYesNo =
                                  col.option.includes("Yes/ No") ||
                                  row.option.includes("Yes/ No") ||
                                  col.option.includes("Yes / No") ||
                                  row.option.includes("Yes / No") ||
                                  col.option.includes("Yes/No") ||
                                  row.option.includes("Yes/No");
                                const isYear =
                                  col.option.includes("year") ||
                                  (row.option.includes("year") &&
                                    !row.option.includes("Yes/No"));
                                const isContact =
                                  col.option.includes("Contact") ||
                                  row.option.includes("Contact");
                                const isNumber =
                                  (col.option.includes("FY") &&
                                    !col.option.includes("Remark")) ||
                                  col.option.includes("%") ||
                                  row.option.includes("%") ||
                                  col.option.includes("Number") ||
                                  (row.option.includes("Number") &&
                                    !col.option.includes("Remarks")) ||
                                  col.option.includes("total") ||
                                  col.option.includes("Total") ||
                                  (row.option.includes("Total") &&
                                    !col.option.includes("Unit")) ||
                                  col.option.includes("No.") ||
                                  row.option.includes("No.") ||
                                  col.option.includes("Rate") ||
                                  row.option.includes("Rate") ||
                                  col.option.includes("in Rs") ||
                                  row.option.includes("in Rs") ||
                                  col.option.includes("Percentage");
                                let inputType = "text";
                                if (isYesNo) {
                                  inputType = "radio";
                                } else if (isNumber) {
                                  inputType = "number";
                                } else if (isDate || isYear) {
                                  inputType = "date";
                                } else if (isEmail) {
                                  inputType = "email";
                                } else if (isContact) {
                                  inputType = "tel";
                                }
                                const value =
                                  (answer2D &&
                                    answer2D[indRow] &&
                                    answer2D[indRow][indCol]) ||
                                  "";

                                return (
                                  <td key={indCol}>
                                    {inputType !== "radio" ? (
                                      <input
                                        // readOnly={!filterAssignedDetail}
                                        value={value}
                                        // checked={value}
                                        onClick={() =>
                                          handleShowAnswer(value)
                                        }
                                        checked={value === "yes"}
                                        readOnly={readOnlyRes}
                                        type="text"
                                        onChange={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleOnChange(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event,
                                            item?.questionType,
                                            source,
                                            endDate
                                          );
                                        }}
                                        onKeyDown={(event) => {
                                          const isChecked =
                                            event.target.checked;
                                          const tempObj = {
                                            ...item,
                                            indexRow: indRow,
                                            indexCol: indCol,
                                          };
                                          handleKeyDown(
                                            tempObj,
                                            inputType === "radio"
                                              ? isChecked
                                                ? "yes"
                                                : "no"
                                              : event
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div>
                                        <label>
                                          <input
                                            type="radio"
                                            value="yes"
                                            checked={value === "yes"}
                                            readOnly={readOnlyRes}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "yes"
                                                : "no";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                            style={{ marginRight: "4px" }}
                                          />
                                          Yes
                                        </label>
                                        <label className="mx-3">
                                          <input
                                            readOnly={readOnlyRes}
                                            type="radio"
                                            value="no"
                                            checked={value === "no"}
                                            onChange={(event) => {
                                              const isChecked =
                                                event.target.checked;
                                              const newValue = isChecked
                                                ? "no"
                                                : "yes";
                                              const tempObj = {
                                                ...item,
                                                indexRow: indRow,
                                                indexCol: indCol,
                                              };
                                              handleOnChange(
                                                tempObj,
                                                inputType === "radio"
                                                  ? newValue
                                                  : event,
                                                item?.questionType,
                                                source,
                                                endDate
                                              );
                                            }}
                                            style={{ marginRight: "4px" }}
                                          />
                                          No
                                        </label>
                                      </div>
                                    )}
                                  </td>
                                );
                              })
                          )}
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            <div className="d-flex">
              {questionData?.not_applicable ? (
                <div className="my-2">
                  <input
                    type="checkbox"
                    // checked={true}
                    className="m-2 checkbox-input"
                  // onChange={handleCheckboxChange}
                  />
                  <span>Not Applicable</span>
                </div>
              ) : (
                <></>
              )}
              {/* <div className="my-2 m-2">
            <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('row')}>
              Add new row
            </button>
          </div>
          <div className="my-2 m-2">
            <button className="new_button_style mb-3" onClick={() => handleAddExtraRowAndColumn('column')}>
              Add new column
            </button>
          </div>
          <div className="my-2 m-2">
            <button className="new_button_style mb-3" >
              Add Note
            </button>
          </div> */}
            </div>
            {/* {item?.add_row == 1 ? (
          <button className="new_button_style mb-3" onClick={handleAddRow}>
            Add new row
          </button>
        ) : (
          ""
        )} */}
          </div> : <></>)}
      </div>
      <Modal show={showAnswer} onHide={handleShowAnswerClose}>
        <Modal.Header closeButton>
          <Modal.Title>Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{showAnswers}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleShowAnswerClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddRow} onHide={handleShowAddRowClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter {columnValue} value</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter ${columnValue} value`}
                onChange={(e) => setColumnValues(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => handleAddExtraRowAndColumns()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showRemark} onHide={handleShowRemarkClose}>
        <Modal.Header closeButton>
          <Modal.Title>Audit Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{remark}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => handleShowRemarkClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>History</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "calc(100vh - 200px)", overflow: "auto" }}>
          <div>
            <hr className="hr-text" data-content="1st History" />
            <Table striped bordered className="m-0">
              <tbody>
                <tr style={{ background: "#ccc" }}>
                  <td style={{ width: 80 }}>Attribute</td>
                  <td>Valve</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
