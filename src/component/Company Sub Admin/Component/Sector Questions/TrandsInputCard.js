import React, { useState } from "react";
import {
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import config from "../../../../config/config.json";
import axios from "axios";
import "./trandsInputCard.css";
import swal from "sweetalert";
import GaugeChart from "react-gauge-chart";
import DownloadIcon from "./Icons/downloadIcon";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = currentUser?.id;
const initalData = {
  from_date: "",
  to_date: "",
  meter_id: "",
  process: "",
  reading_value: "",
  note: "",
  // question: [],
  status: true,
  id: 123456,
  uploadUrl: undefined,
};
function TradeCards({
  handleSubmitHandler,
  item,
  questionDetail,
  deleteTrandsCardData,
  cardAnswers,
  setCardAnswers,
  index,
  formula,
  errorObject,
  changeAnswer,
  meterListData,
  processListData,
  setUploadUrl,
  listing,
  permission,
  handleAuditsSubmit,
  filterAssignedDetail,
  readOnlyRes,
  auditAnswer,
  reminderToUser,
  requestDueDate,
  handleShow2,
}) {
  const [fieldsValue, setFieldsValue] = React.useState(item);
  const [changeValue, setChangeValue] = React.useState(false);
  const [toDateError, setToDateError] = React.useState(false);
  const [fromDateError, setFromDateError] = React.useState(false);
  const [afterCardChanges, setAfterCardChanges] = React.useState(true);
  const [processValue, setProcessValue] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const datepickerRef = React.useRef(null);
  React.useEffect(() => {
    setFieldsValue(item);
  }, [item]);
  React.useEffect(() => {
    if (changeValue) changeAnswer();
  }, [changeValue]);
  React.useEffect(() => {
    setAfterCardChanges(true);
  }, [errorObject]);

  const handleFromDateChange = (date, qid) => {
    setAfterCardChanges(false);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const formattedDate = `${year}-${month}`;

    if (fieldsValue["to_date"] && formattedDate > fieldsValue["to_date"]) {
      setFromDateError("From date should be before the To date.");
    } else {
      const changedData = {
        ...fieldsValue,
        from_date: formattedDate,
      };
      setFieldsValue(changedData);
      setFromDateError(null);
      setChangeValue(true);
    }
  };
  const handleToDateChange = (date, qid) => {
    setAfterCardChanges(false);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const formattedDate = `${year}-${month}`;

    if (fieldsValue["from_date"] && formattedDate < fieldsValue["from_date"]) {
      setToDateError("To date should be after the From date.");
    } else {
      const changedData = {
        ...fieldsValue,
        to_date: formattedDate,
      };
      setFieldsValue(changedData);
      setToDateError(null);
      setChangeValue(true);
    }
  };
  const [selectedValue, setSelectedValue] = useState((meterListData && meterListData.length === 1 ? meterListData[0].id : null));


  const handleOnchange = (event, qId, type) => {
    setAfterCardChanges(false);
    const name = event?.target?.name || "";
    if (type === "date") {
      const str = event?.target?.value;
      const changedData = {
        ...fieldsValue,
        [name.trim()]: moment(str).format("DD-MM-YYYY"),
      };
      setFieldsValue(changedData);
    } else {
      const changedData = {
        ...fieldsValue,
        [name.trim()]: event?.target?.value,
        ...(meterListData.length === 1 && { meter_id: meterListData[0].id }),
        ...(processListData.length === 1 && { process: processListData[0].id }),
      };
      setFieldsValue(changedData);

    }
    setChangeValue(true);
  };
  const handleAuditSubmit = async (
    validation,
    questionType,
    answerId,
    financialYearId
  ) => {
    handleAuditsSubmit(validation, questionType, answerId, financialYearId);
  };
  const getProcessValueById = async (id, data) => {
    const item = data?.find((item) => item["id"] == id);
    item ? setProcessValue(item.process) : setProcessValue("");
  };
  const getSourceValueById = async (id, data) => {
    const item = data?.find((item) => item["id"] == id);
    item ? setSourceValue(item?.location) : setSourceValue("");
  };
  React.useEffect(() => {
    if (formula) {
      getProcessValueById(item?.process, processListData);
      getSourceValueById(item?.meter_id, meterListData);
    }
  }, [item]);

  const handleFileUpload = (files) => {
    const selectedFile = files.target.files[0];
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${selectedFile.name}`;
    var formdata = new FormData();
    formdata.append("file", selectedFile);
    formdata.append("fileName", fileName);
    formdata.append("filePath", "yasil/");

    var requestOptions = {
      header: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${config.AUTH_API_URL_COMPANY
      }uploadFile?current_role=${localStorage.getItem("role")}`,
      requestOptions
    )
      .then((response) => response.text())
      .then(async (result) => {
        let url = JSON.parse(result);
        if (fieldsValue['uploadUrl']) {
          const tmpurl = fieldsValue['uploadUrl'];
          tmpurl.push(url.url);
          const changedData = {
            ...fieldsValue,
            ['uploadUrl']: tmpurl,
          };
          setFieldsValue(changedData);
        } else {
          const changedData = {
            ...fieldsValue,
            ['uploadUrl']: [url.url],
          };
          setFieldsValue(changedData);
        }


      })
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <div className="Quantative_Sector">
        <div className="tableOutput__area mb-2">
          <div className={`${!afterCardChanges ? "custom-border" : ""}`}>
            <Table striped bordered>
              <tbody>
                {filterAssignedDetail && (
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
                )}
                {filterAssignedDetail?.auditedStatus && (
                  <>
                    <tr>
                      <td>Audited Date</td>
                      <td>12/Dec/2023 | 23:59</td>
                    </tr>
                    <tr>
                      <td>Audited By</td>
                      <td>Dipak</td>
                    </tr>
                    <tr>
                      <td>Audited Status</td>
                      <td>Accepted</td>
                    </tr>
                  </>
                )}
                {item?.audit_status?.length > 0 && (
                  <tr>
                    <td>Status</td>
                    <td className={item?.audit_status}>
                      {item?.audit_status?.replace(/_/g, " ")}
                    </td>
                  </tr>
                )}
                {item?.answered_by_email?.length > 0 && (
                  <tr>
                    <td>Answer By</td>
                    <td>{item?.answered_by_email}</td>
                  </tr>
                )}
                <tr>
                  <td>Date</td>
                  <td>
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ gap: "5px" }}
                    >
                      <div className="d-flex flex-column">
                        <div className="date-picker-container d-flex flex-column">
                          <div className="input-container d-flex">
                            <DatePicker
                              selected={
                                fieldsValue["from_date"]
                                  ? new Date(fieldsValue["from_date"])
                                  : null
                              }
                              onChange={(event) =>
                                handleFromDateChange(event, questionDetail?.id)
                              }
                              showMonthYearPicker
                              dateFormat="MM/yyyy"
                              className="form-control date-picker-input"
                              readOnly={formula || readOnlyRes}
                              required
                              ref={datepickerRef}
                              placeholder="MM/yyyy"
                            />
                            <div
                              className="calendar-i"
                              style={{
                                margin: "3px -34px 0px -34px",
                                zIndex: "100",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          {fromDateError && (
                            <div className="red">{fromDateError}</div>
                          )}
                        </div>
                        <div>
                          {!fieldsValue["from_date"] &&
                            errorObject?.index == index &&
                            errorObject?.errors &&
                            errorObject.errors.includes(
                              "Please Select From Date"
                            ) && (
                              <div className="red">Please Select From Date</div>
                            )}
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <div className="date-picker-container">
                          <div className="input-container d-flex">
                            <DatePicker
                              selected={
                                fieldsValue["to_date"]
                                  ? new Date(fieldsValue["to_date"])
                                  : null
                              }
                              onChange={(event) =>
                                handleToDateChange(event, questionDetail?.id)
                              }
                              showMonthYearPicker
                              dateFormat="MM/yyyy"
                              className="form-control date-picker-input"
                              readOnly={formula || readOnlyRes}
                              required
                              ref={datepickerRef}
                              placeholder="MM/yyyy"
                            />
                            <div
                              className="calendar-i"
                              style={{
                                margin: "3px -34px 0px -34px",
                                zIndex: "100",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          {toDateError && (
                            <div className="red">{toDateError}</div>
                          )}
                        </div>
                        <div>
                          {!fieldsValue["to_date"] &&
                            errorObject?.index == index &&
                            errorObject?.errors &&
                            errorObject.errors.includes(
                              "Please Select To Date"
                            ) && (
                              <div className="red"> Please Select To Date</div>
                            )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Source</td>
                  <td>
                    {formula ? (
                      <InputGroup>
                        <Form.Control
                          className="w-100"
                          aria-label="first_input"
                          type="text"
                          name="meter_id"
                          value={sourceValue ?? null}
                          readOnly={readOnlyRes ? true : false}
                          required
                        />
                      </InputGroup>
                    ) : (
                      meterListData && meterListData.length === 1 ? <>
                        <Form.Select
                          aria-label="Default select example p-5"
                          className="form-control"
                          name="meter_id"
                          value={(fieldsValue && fieldsValue["meter_id"]) ?? null}
                          onChange={(event) =>
                            handleOnchange(event, questionDetail?.id)
                          }
                          readOnly={readOnlyRes ? true : false}
                          required
                        >
                          {meterListData && meterListData.map((data, index) => {
                            return (
                              <option
                                key={index}
                                value={data.id}
                                selected={meterListData.length === 1}
                              >
                                {data.location}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </> : <Form.Select
                        aria-label="Default select example p-5"
                        className="form-control"
                        name="meter_id"
                        value={(fieldsValue && fieldsValue["meter_id"]) ?? null}
                        onChange={(event) =>
                          handleOnchange(event, questionDetail?.id)
                        }
                        readOnly={readOnlyRes ? true : false}
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
                    {meterListData?.length === 0 && (
                      <div className="red" style={{ fontSize: 13 }}>
                        Please Create Source On Here
                        {meterListData?.length === 0 && (
                          <a href="/#/settings" style={{ fontSize: 13 }}>
                            <u>Create Source</u>
                          </a>
                        )}
                      </div>
                    )}
                    {meterListData?.length !== 1 && !fieldsValue["meter_id"] &&
                      errorObject?.index == index &&
                      errorObject?.errors &&
                      errorObject.errors.includes("Please Select Source") && (
                        <div className="red"> Please Select Source</div>
                      )}
                  </td>
                </tr>
                <tr>
                  <td>Process</td>
                  <td>
                    {formula ? (
                      <InputGroup>
                        <Form.Control
                          className="w-100"
                          aria-label="first_input"
                          type="text"
                          name="process"
                          value={processValue ?? null}
                          readOnly={formula || readOnlyRes ? true : false}
                          required
                        />
                      </InputGroup>
                    ) : (
                      processListData && processListData.length === 1 ? <>
                        <Form.Select
                          aria-label="Default select example p-5"
                          className="form-control"
                          name="process"
                          value={(fieldsValue && fieldsValue["process"]) ?? null}
                          onChange={(event) =>
                            handleOnchange(event, questionDetail?.id)
                          }
                          readOnly={formula || readOnlyRes ? true : false}
                          required
                        >

                          {processListData &&
                            processListData?.map((data, index) => {
                              return (
                                <option key={index} value={data.id}>
                                  {data.process}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </> : <Form.Select
                        aria-label="Default select example p-5"
                        className="form-control"
                        name="process"
                        value={(fieldsValue && fieldsValue["process"]) ?? null}
                        onChange={(event) =>
                          handleOnchange(event, questionDetail?.id)
                        }
                        readOnly={formula || readOnlyRes ? true : false}
                        required
                      >
                        <option value="" hidden>
                          Please Select the Process
                        </option>
                        {processListData &&
                          processListData?.map((data, index) => {
                            return (
                              <option key={index} value={data.id}>
                                {data.process}
                              </option>
                            );
                          })}
                      </Form.Select>

                    )}
                    {!fieldsValue["process"] &&
                      errorObject?.index == index &&
                      errorObject?.errors &&
                      errorObject.errors.includes("Please Enter Process") && (
                        <div className="red"> Please Enter Process</div>
                      )}
                  </td>
                </tr>
                <tr>
                  <td>Reading Value</td>
                  <td>
                    <InputGroup>
                      <Form.Control
                        style={{
                          width: "70%",
                        }}
                        aria-label="first_input"
                        type="number"
                        name="reading_value"
                        value={
                          (fieldsValue && fieldsValue["reading_value"]) ?? null
                        }
                        onChange={(e) => handleOnchange(e, questionDetail?.id)}
                        readOnly={formula || readOnlyRes ? true : false}
                        required
                      />
                      <Form.Control
                        style={{
                          width: "30%",
                        }}
                        aria-label="Last_input"
                        value={
                          questionDetail?.question_detail[0]?.option ?? null
                        }
                      />
                    </InputGroup>

                    {!fieldsValue["reading_value"] &&
                      errorObject?.index == index &&
                      errorObject?.errors &&
                      errorObject.errors.includes(
                        "Please Enter Reading Value"
                      ) && (
                        <div className="red"> Please Enter Reading Value </div>
                      )}
                  </td>
                </tr>
                {filterAssignedDetail && (
                  <tr>
                    <td>History</td>
                    <td>View</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>Note</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a Note here"
                      style={{
                        height: "100px",
                      }}
                      name="note"
                      value={(fieldsValue && fieldsValue["note"]) ?? null}
                      onChange={(e) => handleOnchange(e, questionDetail?.id)}
                      readOnly={formula || readOnlyRes ? true : false}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            {item?.audit_remark?.length > 0 && (
              <Col md={5} className=" justify-content-end d-flex">
                <>
                  <Button variant="info" onClick={handleShow}>
                    View Remark
                  </Button>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Auditor Remark</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="mb-4">{item?.audit_remark}</div>
                    </Modal.Body>
                  </Modal>
                </>
              </Col>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-between">
            {!formula && (
              <button
                className="new_button_style"
                disabled={
                  (index === errorObject.index && afterCardChanges) ||
                  afterCardChanges
                }
                onClick={() => handleSubmitHandler(fieldsValue, index)}
              >
                Save
              </button>
            )}
            {index > 0 && !formula && (
              <button
                className="new_button_style__reject"
                onClick={() => deleteTrandsCardData(fieldsValue, index)}
              >
                Delete
              </button>
            )}
            <div className="hstack justify-content-between">
              <div>
                <div>
                  <input
                    id="aaaa"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        handleFileUpload(e);
                      }
                    }}
                    style={{
                      display: "none",
                    }}
                  />
                </div>
                <div className="d-flex">
                  <div className="file file--upload hstack">
                    <label htmlFor="aaaa">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 34 34"
                        fill="none"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <path
                          d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                          fill="#3f88a5"
                        ></path>
                        <path
                          d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                          fill="#3f88a5"
                          stroke="#3f88a5"
                          strokeWidth="0.5"
                        ></path>
                      </svg>
                    </label>
                  </div>
                  <div>
                    <div>
                      {fieldsValue && fieldsValue["uploadUrl"] && fieldsValue["uploadUrl"].length && fieldsValue["uploadUrl"].map((attachment, index) => {
                        return <DownloadIcon key={index} attachment={attachment} />;
                      })}
                    </div>
                  </div>
                </div>
                {!afterCardChanges && (
                  <span className="color_div_on red justify-content-center align-content-center d-flex">
                    Save the card
                  </span>
                )}
              </div>
              <div>
                {auditAnswer?.auditorId?.auditerId === userId && listing === "audit" && (
                  <div className="hstack gap-2">
                    <button
                      type="submit"
                      name="ACCEPTED"
                      className="new_button_style"
                      onClick={(e) =>
                        handleAuditSubmit(
                          e.target.name,
                          "quantitative_trends",
                          fieldsValue && fieldsValue["answerId"],
                          fieldsValue && fieldsValue["financialYearId"]
                        )
                      }
                    >
                      Accept
                    </button>
                    <button
                      type="submit"
                      name="REJECTED"
                      className="new_button_style__reject"
                      onClick={(e) =>
                        handleAuditSubmit(
                          e.target.name,
                          "quantitative_trends",
                          fieldsValue && fieldsValue["answerId"],
                          fieldsValue && fieldsValue["financialYearId"]
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TrandsInputCard({
  item,
  answer,
  handleSubmit,
  handleDeleteSubmit,
  formula,
  changeAns,
  initalValue,
  meterListData,
  processListData,
  listing,
  permission,
  handleAuditssSubmit,
  filterAssignedDetail,
  handleShow1,
  readOnlyRes,
  reminderToUser,
  requestDueDate,
  handleShow2,
  auditAnswer
  // setUrl
}) {
  const [id, setID] = React.useState(123456);
  const [cardAnswers, setCardAnswers] = React.useState();
  const [uploadUrl, setUploadUrl] = React.useState();
  const [modifiedInitialData, setModifiedInitialData] = React.useState([]);
  const [questionDetail, setQuestionDetail] = React.useState(item);
  const [isChecked, setIsChecked] = React.useState(false);
  const [errorObject, setErrorObject] = React.useState({
    errors: [],
    index: 0,
  });
  const [nrOfLevels, setNrOfLevels] = useState(2);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  React.useEffect(() => {
    if (item) {
      setQuestionDetail(item);
    }
  }, [item]);
  React.useEffect(() => {
    if (answer && answer[0] && answer[0]["answer"]) {
      if (typeof answer[0]["answer"] === "object") {
        setCardAnswers(answer[0]["answer"]);
      } else setCardAnswers(answer[0]["answer"]);
      let tmpAns = answer[0]["answer"];
      let length = tmpAns?.length;
      const modifiedData = {
        ...modifiedInitialData,
        from_date: tmpAns[length - 1]?.from_date,
        to_date: tmpAns[length - 1]?.to_date,
      };
      setModifiedInitialData(modifiedData);
    } else {
      const modifiedInitialData = {
        ...initalData,
        from_date:
          new Date().getFullYear() +
          "-" +
          ("0" + initalValue?.starting_month).slice(-2),
        to_date: calculateToDate(
          initalValue?.starting_month,
          initalValue?.frequency
        ),
      };
      setModifiedInitialData(modifiedInitialData);
      setCardAnswers([modifiedInitialData]);
    }
  }, [answer]);
  const calculateToDate = (starting_month, frequency) => {
    const year = new Date().getFullYear();
    let nextMonth;
    let newYear = year;
    if (frequency === "MONTHLY") {
      nextMonth = (starting_month + 0) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "QUATERLY") {
      nextMonth = (starting_month + 1) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "YEARLY") {
      nextMonth = (starting_month + 10) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "HALF_YEARLY") {
      nextMonth = (starting_month + 4) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    }
    if (frequency === "MONTHLY") {
      return newYear + "-" + ("0" + nextMonth).slice(-2);
    }
    return newYear + "-" + ("0" + (nextMonth + 1)).slice(-2);
  };
  const calculateAddMoreToDate = (newDate, starting_month, frequency) => {
    const date = new Date(newDate);
    const year = date.getFullYear();
    let nextMonth;
    let newYear = year;
    if (frequency === "MONTHLY") {
      nextMonth = (starting_month + 0) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "QUATERLY") {
      nextMonth = (starting_month + 1) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "YEARLY") {
      nextMonth = (starting_month + 10) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    } else if (frequency === "HALF_YEARLY") {
      nextMonth = (starting_month + 4) % 12;
      if (nextMonth < starting_month) {
        newYear++;
      }
    }
    if (frequency === "MONTHLY") {
      return newYear + "-" + ("0" + nextMonth).slice(-2);
    }
    return newYear + "-" + ("0" + (nextMonth + 1)).slice(-2);
  };
  const handleSubmitHandler = (objItem, index) => {
    let yourObject = [];
    if (!objItem?.from_date || objItem?.from_date?.length === 0) {
      yourObject.push("Please Select From Date");
    }
    if (!objItem?.to_date || objItem?.to_date?.length === 0) {
      yourObject.push("Please Select To Date");
    }
    if (!objItem?.meter_id || objItem?.meter_id?.length === 0) {
      yourObject.push("Please Select Source");
    }
    if (!objItem?.process || objItem?.process?.length === 0) {
      yourObject.push("Please Enter Process");
    }
    if (!objItem?.reading_value || objItem?.reading_value === "") {
      yourObject.push("Please Enter Reading Value");
    }
    setErrorObject({ errors: yourObject, index: index });
    if (yourObject?.length === 0) {
      let tempArray = [...cardAnswers];
      const findIndex = index;
      if (findIndex >= 0) {
        tempArray[findIndex] = { ...objItem, status: false };
        setCardAnswers(tempArray);
        handleSubmit(item, tempArray, item?.questionType);
      } else if (tempArray[index] && tempArray[index].length > 0) {
        tempArray[index] = { ...objItem, status: false };
        handleSubmit(item, tempArray, item?.questionType);
        setCardAnswers(tempArray);
      }
    }
  };
  const deleteTrandsCardData = (fieldsValue, index) => {
    let tempAns = [...cardAnswers];

    handleDeleteSubmit(item, fieldsValue, index);
    setCardAnswers(tempAns.filter((d) => d.id !== fieldsValue.id));
  };
  const handleAuditSubmit = (
    validation,
    questionType,
    answerId,
    financialYearId
  ) => {
    handleAuditssSubmit(validation, questionType, answerId, financialYearId);
  };
  const changeAnswer = () => {
    changeAns();
  };

  const handleCheckboxChange = (isCheckes) => {
    setIsChecked(isCheckes);
    handleSubmit(item, isCheckes ? 'N.A.' : null, item?.questionType);
  };
  const handleAddMore = () => {
    const date = new Date(modifiedInitialData.to_date);
    const month = date.getMonth() + 1;
    const month1 = date.getMonth() + 2;
    const year = date.getFullYear();
    let adjustedMonth = month1;
    let adjustedYear = year;

    if (adjustedMonth > 12) {
      adjustedMonth = adjustedMonth % 12;
      adjustedYear += Math.floor(month1 / 12);
    }
    const currentMonth = ("0" + adjustedMonth).slice(-2);
    const from_date = adjustedYear + "-" + currentMonth;
    const modifiedData = {
      ...modifiedInitialData,
      from_date: from_date,
      to_date: calculateAddMoreToDate(
        modifiedInitialData.to_date,
        month1,
        initalValue?.frequency
      ),
    };
    setModifiedInitialData(modifiedData);
    let tempAns = [...cardAnswers, { ...modifiedData, id: id + 1 }];
    setCardAnswers(tempAns);
    setID((prevValue) => {
      return prevValue + 1;
    });
  };

  const chartStyle = {
    width: 60,
    height: 20,
  };

  return (
    <>
      {filterAssignedDetail && (
        <>
          <Table bordered striped>
            <tbody>
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
              <tr>
                <td>Assign By</td>
                <td>
                  {filterAssignedDetail?.assignedByDetails &&
                    filterAssignedDetail?.assignedByDetails.map(
                      (user, index) => (
                        <span key={index}>
                          <span
                            data-tooltip={
                              filterAssignedDetail?.assignedByDetails &&
                              filterAssignedDetail?.assignedByDetails
                                .map((user) => user.email)
                                .join(", ")
                            }
                          >
                            {user.first_name} {user.last_name}
                          </span>
                          {index <
                            filterAssignedDetail?.assignedByDetails.length -
                            1 && ", "}
                        </span>
                      )
                    )}
                </td>
              </tr>
              <tr>
                <td>Assign to</td>
                <td>
                  {filterAssignedDetail?.assignedToDetails &&
                    filterAssignedDetail?.assignedToDetails.map(
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
                            filterAssignedDetail?.assignedToDetails.length -
                            1 && ", "}
                        </span>
                      )
                    )}
                </td>
              </tr>
              <tr>
                <td>Assign Date</td>
                <td>
                  {new Date(filterAssignedDetail?.createdAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>
                  <div className="hstack">
                    <p className="m-0">
                      {new Date(filterAssignedDetail?.dueDate).toLocaleString()}
                    </p>
                    <GaugeChart
                      style={chartStyle}
                      id="gauge-chart2"
                      nrOfLevels={nrOfLevels}
                      colors={["#FF5F6D", "#FFC371"]}
                    // percent={completionPercentage / 100}
                    />
                    {filterAssignedDetail && readOnlyRes && (
                      <i
                        className="fas fa-stopwatch mx-2"
                        title="Reminder"
                        onClick={() => reminderToUser(item.id)}
                      ></i>
                    )}
                    {new Date(filterAssignedDetail?.dueDate) < new Date() &&
                      filterAssignedDetail?.assignedBy !== 1 && (
                        <i
                          className="far fa-calendar-plus mx-2"
                          title="Request Due Date"
                          onClick={() => requestDueDate(item.id)}
                        ></i>
                      )}
                    {new Date(filterAssignedDetail?.dueDate) < new Date() &&
                      filterAssignedDetail?.dueDateRequested && (
                        <i
                          className="far fa-calendar-plus mx-2"
                          title="Change Due Date"
                          onClick={() => handleShow()}
                        ></i>
                      )}
                  </div>
                </td>
              </tr>
              {questionDetail?.not_applicable && <tr>
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="m-2 checkbox-input"
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
                <span>Not Applicable</span>
              </tr>}
            </tbody>
          </Table>
        </>
      )}
      {filterAssignedDetail?.auditedStatus && (
        <>
          <tr>
            <td>Audited Date</td>
            <td>12/Dec/2023 | 23:59</td>
          </tr>
          <tr>
            <td>Audited By</td>
            <td>Dipak</td>
          </tr>
          <tr>
            <td>Audited Status</td>
            <td>Accepted</td>
          </tr>
        </>
      )}
      {item?.audit_status?.length > 0 && (
        <tr>
          <td>Status</td>
          <td className={item?.audit_status}>
            {item?.audit_status?.replace(/_/g, " ")}
          </td>
        </tr>
      )}
      {item?.answered_by_email?.length > 0 && (
        <tr>
          <td>Answer By</td>
          <td>{item?.answered_by_email}</td>
        </tr>
      )}

      <div
        style={{
          width: "100%",
          display: "grid",
          margin: "0 auto",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {cardAnswers &&
          cardAnswers?.map((inputTradeAns, index) => {
            return (
              <div key={`${item?.id}-${index}`} style={{ width: "100%" }}>
                <TradeCards
                  deleteTrandsCardData={deleteTrandsCardData}
                  item={inputTradeAns}
                  questionDetail={questionDetail}
                  handleSubmitHandler={handleSubmitHandler}
                  cardAnswers={cardAnswers}
                  index={index}
                  setCardAnswers={setCardAnswers}
                  formula={formula}
                  changeAnswer={changeAnswer}
                  errorObject={errorObject}
                  meterListData={meterListData}
                  processListData={processListData}
                  setUploadUrl={setUploadUrl}
                  listing={listing}
                  permission={permission}
                  handleAuditsSubmit={handleAuditSubmit}
                  filterAssignedDetail={filterAssignedDetail}
                  readOnlyRes={readOnlyRes}
                  reminderToUser={reminderToUser}
                  requestDueDate={requestDueDate}
                  handleShow2={handleShow2}
                  auditAnswer={auditAnswer}
                />
              </div>
            );
          })}
      </div>


      {formula || !filterAssignedDetail ? (
        ""
      ) : (
        <div className="Bottom_fooeter">
          <button
            className="new_button_style"
            onClick={() => {
              handleAddMore();
            }}
          >
            Add more
          </button>
        </div>
      )}
    </>
  );
}
