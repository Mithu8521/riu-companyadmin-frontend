import React, { Component, useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Loader from "../../../loader/Loader";
import AssignSubWorker from "./AssignSubWorker";
import axios from "axios";
import NumericInput from "react-numeric-input";
import "./SectorQuestion.css";
import config from "../../../../config/config.json";
import { Form, Accordion, Row, Col } from "react-bootstrap";
import SectorQuestionTab from "./SectorQuestionTab";
import QuestionTypeTabSection from "./QuestionTypeTabSection";
import { Button, Modal, Spinner } from "react-bootstrap";
import TebularInputCardAnswer from "./TabularInputCardAnswer";
import TebularInputCard from "./TebularInputCard";
import TrandsInputCard from "./TrandsInputCard";
import swal from "sweetalert";
import { apiCall } from "../../../../_services/apiCall";
import Multiselect from "multiselect-react-dropdown";
import { useRef } from "react";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import { authenticationService } from "../../../../_services/authentication";
import { async } from "rxjs";
import { commonService } from "../../../../_services/common/commonService";
const Filters = ({ type, fetchData }) => {
  const frameWorkRef = useRef(null);
  const topicRef = useRef(null);
  const kpiRef = useRef(null);
  const [frameworkData, setFrameworkData] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState([]);
  const getFramework = async () => {
    frameWorkRef?.current?.resetSelectedValues();
    topicRef?.current?.resetSelectedValues();
    kpiRef?.current?.resetSelectedValues();

    setFrameworkData([]);
    setSelectedFrame([]);
    setTopicsData([]);
    setSelectedTopics([]);
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getSectorQuestionFramework`,
      {},
      {
        type: type,
      }
    );
    if (isSuccess) {
      setFrameworkData(data?.data);
    }
  };
  const getKpi = async (topicId) => {
    const frameworkIds = selectedFrame && selectedFrame?.map(({ id }) => id);
    const topicIds = topicId && topicId?.map(({ id }) => id);
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getSectorQuestionKpi`,
      {},
      {
        type: "QUESTION",
        framework_id: [frameworkIds],
        topic_id: [topicIds],
      }
    );
    if (isSuccess) {
      setKpiData(data?.data);
    }
  };
  const fetchTopicKpi = async (frameWork) => {
    setKpiData([]);
    setSelectedKpi([]);
    if (frameWork.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.API_URL}getSectorQuestionTopic`,
        {},
        {
          type: type === "TOPIC" ? "QUESTION" : "KPI",
          framework_id: [frameWork],
        }
      );
      if (isSuccess) {
        setTopicsData(data?.data);
      }
    }
  };
  const submitHandler = async () => {
    const frameworkIds = selectedFrame && selectedFrame?.map(({ id }) => id);
    const topicIds = selectedTopics && selectedTopics?.map(({ id }) => id);
    const kpiIds = selectedKpi && selectedKpi?.map(({ id }) => id);

    if (type === "QUESTION") {
      fetchData(frameworkIds, [], []);
    }
    if (type === "TOPIC") {
      fetchData(frameworkIds, topicIds, []);
    }
    if (type === "KPI") {
      fetchData(frameworkIds, topicIds, kpiIds);
    }
  };
  const isButtonDisabled = () => {
    if (type === "QUESTION") {
      if (selectedFrame.length > 0) return false;
      else return true;
    }
    if (type === "TOPIC") {
      if (selectedFrame.length > 0 && selectedTopics.length > 0) {
        return false;
      } else {
        return true;
      }
    }
    if (type === "KPI") {
      if (
        selectedFrame.length > 0 &&
        selectedTopics.length > 0 &&
        selectedKpi.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    }
  };
  useEffect(() => {
    setFrameworkData([]);
    setSelectedFrame([]);
    setTopicsData([]);
    setSelectedTopics([]);

    // fetchData([1], [], [])
    getFramework();
  }, [type]);
  return (
    <>
      <Row>
        {type === "QUESTION" ? (
          <Col md={12} className="mb-5">
            <label htmlFor="industryType" className="mb-2">
              {" "}
              Select Framework :
            </label>
            <Multiselect
              placeholder={"Select Framework"}
              displayValue="title"
              style={{ border: "1px solid red" }}
              options={frameworkData}
              // selectedValues={
              //   this.stateframeworkValue
              //     .selectedFramework
              // }
              // ref={this.multiselectRefTracker}
              onRemove={(e) => {
                setSelectedFrame(e || []);
              }}
              onSelect={(e) => {
                setSelectedFrame(e || []);
              }}
            />
          </Col>
        ) : (
          <>
            <Col md={12}>
              <label className="sector_questions_tab"> Framework: </label>
              <Multiselect
                className="mb-4"
                placeholder={"Select Framework"}
                displayValue="title"
                options={frameworkData}
                // selectedValues={
                //   this.stateframeworkValue
                //     .selectedFramework
                // }
                ref={frameWorkRef}
                onRemove={async (e) => {
                  setSelectedFrame(e || []);
                  const frameworkIds = e && e?.map(({ id }) => id);
                  fetchTopicKpi(frameworkIds);
                }}
                onSelect={async (e) => {
                  setSelectedFrame(e || []);

                  const frameworkIds = e && e?.map(({ id }) => id);
                  fetchTopicKpi(frameworkIds);
                }}
              />
              <label className="sector_questions_tab"> Topics:</label>
              <Multiselect
                className="mb-4"
                placeholder={"Select Topics"}
                displayValue="title"
                options={topicsData}
                // selectedValues={
                //   this.stateframeworkValue
                //     .selectedFramework
                // }
                ref={topicRef}
                // ref={this.multiselectRefTracker}
                onRemove={async (e) => {
                  setSelectedTopics(e || []);
                  if (type === "KPI") {
                    getKpi(e);
                  }
                  // fetchTopicKpi(frameworkIds)
                }}
                onSelect={async (e) => {
                  setSelectedTopics(e || []);
                  if (type === "KPI") {
                    getKpi(e);
                  }
                  // fetchTopicKpi(frameworkIds)
                }}
              />
            </Col>
          </>
        )}
        <Col>
          <div className="save_global download_report">
            <button
              className="new_button_style apply-filter-btn"
              onClick={() => {
                let a = isButtonDisabled();

                if (!isButtonDisabled()) {
                  submitHandler();
                }
              }}
            >
              Apply Filter
            </button>
          </div>
        </Col>
      </Row>
      {type === "KPI" ? (
        <Row>
          <Col md={12} className="mb-5">
            <label className="sector_questions_tab"> KPI: </label>
            <Multiselect
              placeholder={"Select Kpi"}
              displayValue="title"
              options={kpiData}
              // selectedValues={
              //   this.stateframeworkValue
              //     .selectedFramework
              // }
              ref={kpiRef}
              // ref={this.multiselectRefTracker}
              onRemove={async (e) => {
                setSelectedKpi(e || []);
              }}
              onSelect={async (e) => {
                setSelectedKpi(e || []);
              }}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}
    </>
  );
};
const SectorQuestion = (props) => {
  const [questionList, setQuestionList] = useState();
  const [sectorQuestionType, setSectorQuestionType] = useState();
  const [refrenceId, setRefrenceID] = useState();
  const [uploadItem, setUploadItem] = useState([]);
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [entity, setEntity] = useState("company");
  const [menuList, setMenuList] = useState([]);
  const [answerChange, setAnswerChange] = useState([]);
  const [AllQuestionList, setAllAllQuestionList] = useState({
    quantitative: [],
    tabular_question: [],
    qualitative: [],
    yes_no: [],
    quantitative_trends: [],
  });
  const [inputFields, setInputFields] = useState({});
  const [renderedCount, setRenderedCount] = useState(0);

  const [filterQuestionList, setFilterQuestionList] = useState();
  const [data, setData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [financialYearId, setFinancialYearId] = useState("");
  const [financialYear, setFinancialYear] = useState([]);
  const authValue = JSON.parse(localStorage.getItem("currentUser"));
  const [initalValue, setInitialValue] = useState({});
  const [user_Is_head, setCopmanyIShead] = useState(authValue?.data?.is_head);
  const [userTypeCode, setUserTypeCode] = useState(
    authValue?.data?.user_type_code
  );
  const [answerChangedData, setAnswerAnswerChangedData] = useState([]);
  const [meterList, setMeterList] = useState([]);
  const [processList, setProcessList] = useState([]);
  let changedData = [];
  useEffect(() => {
    // fetchquestionApi();
    getFinancialYear();
    // getAnswerCompanyWise();
    // fetchStoredData();
  }, [refrenceId, entity]);

  useEffect(() => {
    if (financialYearId && entity) fetchStoredData();
  }, [financialYearId, entity]);
  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFinancialYear`
    );

    if (isSuccess) {
      setFinancialYear(data.data);
      if (data?.data?.length == 1) {
        await setFinancialYearId(data.data[0].id);
        if (financialYearId && entity) {
          fetchStoredData();
        }
      }
    }
    // axios
    //   .get(`${config.API_URL}getFinancialYear`, {
    //     headers: {
    //       Authorization: `Bearer ${authValue?.data?.token}`,
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     setFinancialYear(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.log("error");
    //   });
  };
  useEffect(() => {
    getProfileData();
  }, []);
  const getProfileData = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.API_URL + "getProfileData",
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setInitialValue({
        starting_month: data?.user[0]?.starting_month,
        frequency: data?.user[0]?.frequency,
      });
    } else {
      console.log(error);
    }
  };
  const fetchStoredData = async () => {
    if (user_Is_head == "0") {
      fetchquestionApi();
      return;
    }
    if (financialYearId) {
      const { isSuccess, data } = await apiCall(
        `${config.API_URL}getDataCompanyWise`,
        {},
        { type: "SQ", financial_year_id: financialYearId },
        "GET"
      );
      if (isSuccess) {
        const responseData = data.data;
        const sotoreData = JSON.parse(responseData.framework_topic_kpi || "{}");
        // console.log(sotoreData, "sotoreData");
        if (!sotoreData.framework_id || sotoreData.framework_id.length === 0) {
          swal({
            title: "Please Select Framework from ESG Reporting.",
            text: "",
            icon: "error",
            button: "OK",
          });
        } else {
          fetchquestionApi(
            sotoreData.framework_id,
            sotoreData.topic_id,
            sotoreData.kpi_id
          );
        }
      }
    } else {
      swal({
        title: "Please Select Financial Year",
        text: "",
        icon: "error",
        button: "OK",
      });
    }

    // axios
    //   .get(
    //     `${config.API_URL}getDataCompanyWise?type=SQ`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${authValue?.data?.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     // console.log(response, "id");
    //     const responseData = response.data.data;
    //     const sotoreData = JSON.parse(responseData.framework_topic_kpi || "{}");
    //     // console.log(sotoreData, "sotoreData");
    //     if (!sotoreData.framework_id || sotoreData.framework_id.length === 0) {
    //       swal({
    //         title: "Please Select Framework from ESG Reporting.",
    //         text: "",
    //         icon: "error",
    //         button: "OK",
    //       });
    //     } else {
    //       fetchquestionApi(
    //         sotoreData.framework_id,
    //         sotoreData.topic_id,
    //         sotoreData.kpi_id
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("error",error);
    //   });
  };

  const fetchquestionApi = (framework_ids, topic_ids, kpi_ids) => {
    if (type === "ALL") {
      setLoading(true);
    } else {
      setQuestionLoading(true);
    }

    axios
      .get(
        `${config.API_URL}getSectorQuestion?type=${user_Is_head == "1" ? "CUSTOM" : "USER_BASE"
        }&entity=${entity}${user_Is_head == "1"
          ? `&framework_ids=[${framework_ids}]&topic_ids=[${topic_ids}]&kpi_ids=[${kpi_ids}]`
          : ""
        }&financial_year_id=${financialYearId}`,
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        await getMeterIdData();
        await getProcessIdData();
        await getAnswerCompanyWise();
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setTimeout(() => {
            if (type === "ALL") {
              setLoading(false);
            } else {
              setQuestionLoading(false);
            }
          }, 5000);

          setData(response.data.data);
          setAllAllQuestionList({
            quantitative: [],
            tabular_question: [],
            qualitative: [],
            yes_no: [],
            quantitative_trends: [],
          });
          setQuestionList(response.data.data);
          setFilterQuestionList(response.data.data);
          const data = response.data.data;
          const newData = {}; // Use a new object to store the updated input fields
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const id = item.id;
            newData[id] = {
              question_id: item?.id,
              questionType: item?.questionType,
              answer: "",
              answer_id: -1,
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
          setInputFields((prevState) => ({ ...prevState, ...newData }));
        } else {
          setData([]);
          if (type === "ALL") {
            setLoading(false);
          } else {
            setQuestionLoading(false);
          }
          setFilterQuestionList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAnswerCompanyWise = () => {
    axios
      .get(
        `${config.API_URL
        }getAnswerCompanyWise?financial_year_id=${financialYearId}&questionnaire_type=SQ&current_role=${localStorage.getItem(
          "role"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response?.data?.data;
        if (data && data.length > 0) setAnswers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMeterIdData = () => {
    axios
      .get(
        `${config.API_URL}getMeterId?current_role=${localStorage.getItem("role")}`,
        //company_id=${localStorage.getItem("user_temp_id")}&
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response?.data?.data;
        console.log(data, "datagetMeterIdData");
        setMeterList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getProcessIdData = () => {
    axios
      .get(
        `${config.API_URL}getProcessId?company_id=${localStorage.getItem(
          "user_temp_id"
        )}&current_role=${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response?.data?.data;
        console.log(data, "datagetMeterIdData");
        setProcessList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const uploadFile = (files) => {
    console.log("files", files);
    let tempAnswers = [...answers];
    const selectedFile = files.target.files[0];
    const timestamp = new Date().getTime(); // Generate a timestamp

    const fileName = `${timestamp}_${selectedFile.name}`;
    var formdata = new FormData();
    formdata.append("file", selectedFile);
    formdata.append("fileName", fileName);
    formdata.append("filePath", "yasil/");

    var requestOptions = {
      header: {
        "Content-Type": "multipart/form-data", // Set the Content-Type header
      },
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`${config.AUTH_API_URL_COMPANY}uploadFile?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((response) => response.text())
      .then(async (result) => {
        let index = uploadItem.index;
        let item = uploadItem.item;
        let url = JSON.parse(result);

        if (tempAnswers.length) {
          let check = tempAnswers.findIndex(
            (value) => value.question_id == item.id
          );

          if (check !== -1) {
            tempAnswers[check]["proof_document"] = url?.url;
            tempAnswers[check]["status"] = true;

            await setAnswers(tempAnswers);
          } else {
            let tempObj = {
              question_id: item?.id,
              questionType: item?.questionType,
              answer_id: -1,
              status: true,
              proof_document: url?.url,
            };
            tempAnswers.push(tempObj);

            await setAnswers(tempAnswers);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };
  const handlekeyPress = (item, event) => {
    const str = event?.target?.value?.trim();
    if (str && str.startsWith("=")) {
      if (event.key === "Enter" || event.keyCode === 13) {
        console.log("getting value", str);
        //getting spaced string
        const spacedString = getSpacedString(str.substring(1));
        const strArray = spacedString.split(" ");
        //concating string to evaluate
        const evaluatedString = getEvaluatedString(strArray);
        const regex = /[a-zA-Z]/g;
        if (!evaluatedString.match(regex)) {
          const answer = eval(evaluatedString);
          handleAnswers(item, null, item["questionType"], answer);
        } else {
          handleAnswers(item, null, item["questionType"], "");
          alert("Answer is not a proper number value");
        }
      }
    }
  };

  const getEvaluatedString = (strArray, item, event) => {
    let evaluatedStr = "";
    //Itrating through spaced string array
    for (const value of strArray) {
      let str = value && value.toLowerCase();
      console.log("looping str value", value);
      if (["+", "-", "/", "*"].includes(value)) {
        evaluatedStr = evaluatedStr.concat(value);
      } else if (str) {
        console.log("value exist");
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
              const answerArr = answers.filter((obj) => {
                if (obj["question_id"] == question["id"]) {
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
            const answerArr = answers.filter((obj) => {
              if (obj["question_id"] == question["id"]) {
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
  const handleAnswers = (item, event, questionType, source, value) => {
    const tempAnswers = [...answers];

    const index = tempAnswers.findIndex((obj) => obj?.question_id === item?.id);

    switch (questionType) {
      case "tabular_question": {
        handleTabularAnswers(item, event, index, source, value);
        break;
      }
      case "quantitative_trends": {
        handleQunatativeTreds(item, event, index);
        break;
      }
      case "quantitative": {
        handlequantitativeTypes(item, event, index, value);
        break;
      }
      default: {
        handleOtherTypes(item, event, index);
      }
    }
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
  const handleAddRow = async (item, index) => {
    const lastRow = item.question_detail
      .filter((detail) => detail.option_type === "row")
      .pop();

    axios
      .post(
        `${config.API_URL}addRow`,
        {
          question_id: item.id,
          row_value: lastRow.option,
          current_role: localStorage.getItem("role"),
        },
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const indexToUpdate = filterQuestionList.findIndex(
          (question) => question.id === item.id
        );
        const updatedQuestion = { ...filterQuestionList[indexToUpdate] };

        const newRow = {
          id: response?.data?.data?.id, // Assign a unique ID for the new row
          question_id: 24,
          option_type: "row",
          option: response?.data?.data?.value?.toString(),
          rules: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedQuestion.question_detail.push(newRow);
        const updatedList = [
          ...filterQuestionList.slice(0, indexToUpdate),
          updatedQuestion,
          ...filterQuestionList.slice(indexToUpdate + 1),
        ];
        setFilterQuestionList(updatedList);
        let tempAnswers = [...answers];
        if (tempAnswers.length) {
          let check = tempAnswers.findIndex(
            (value) => value.question_id == item.id
          );
          if (check !== -1) {
            const firstArrayLength = tempAnswers[check]?.answer[0].length;
            const newArray = Array(firstArrayLength).fill("");

            tempAnswers[check]?.answer.push(newArray);

            setAnswers(tempAnswers);
          }
        }
      })
      .catch((error) => {
        swal({
          icon: "error",
          title: error.response.data.message,
          timer: 1000,
        });
      });
  };
  const handleTabularAnswers = (item, event, index, source, qValue) => {
    console.log(source, "diaksjcwsefw");
    let tempAnswers = [...answers];
    if (qValue) {
      const d1 = new Date(
        tempAnswers[index]["answer"][item?.indexRow][item?.indexCol - 1]
      );
      const d2 = new Date(event?.target?.value);
      if (d1 > d2) {
        sweetAlert(
          "error",
          `You need to select end date greater than  ${tempAnswers[index]["answer"][item?.indexRow][item?.indexCol - 1]
          }`
        );
        return;
      }
    }
    const targetValue = event?.target?.value;
    if (index >= 0) {
      //upadte value if index exist
      if (
        tempAnswers[index] &&
        tempAnswers[index]["answer"] &&
        tempAnswers[index]["answer"].length > 0
      ) {
        const value =
          tempAnswers[index]["answer"] &&
          tempAnswers[index]["answer"][item?.indexRow] &&
          tempAnswers[index]["answer"][item?.indexRow][item?.indexCol];
        if (value === 0 || value === "" || value) {
          tempAnswers[index]["answer"][item?.indexRow][item?.indexCol] =
            targetValue;
        } else {
          alert("unexpected question type for answer");
        }
      } else {
        const answer2D = get2DArrayAnswer(item, event);
        tempAnswers[index]["answer"] = answer2D;
        tempAnswers[index]["source_id"] = source;
      }
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      tempAnswers[index]["source_id"] = source;
      setAnswers(tempAnswers);
    } else {
      //update value if index donesn't exist haan kar lo baad main dekg
      const answer2D = get2DArrayAnswer(item, event);
      const tempObj = {
        question_id: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: answer2D,
        source_id: source,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    }
  };
  const handleItemRendered = () => {
    setRenderedCount((prevCount) => prevCount + 1);
  };

  const handleQunatativeTreds = (item, trendsAns, index, formula) => {
    setPreviousData(trendsAns);
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    const changes = changedData?.filter((it) => it !== item?.title);
    changedData = changes;
    setAnswerAnswerChangedData(changes);

    if (index >= 0) {
      //upadte value if index exist
      tempAnswers[index]["answer"] = trendsAns;
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      setAnswers(tempAnswers);
      if (!formula) {
        sweetAlert("success", `${item?.title} Successfully saved`);
      }
    } else {
      //update value if index donesn't exist
      let tempObj = {
        question_id: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: trendsAns,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
      sweetAlert("success", `${item?.title} Successfully saved`);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (changedData?.length > 0) {
      sweetAlert("error", `You need to save ${changedData}`);
    } else if (answerChangedData?.length > 0) {
      sweetAlert("error", `You need to save ${answerChangedData}`);
    } else {
      let updatedAnswers = answers.filter((obj) => obj.status === true);

      await apiCall(
        `${config.API_URL}saveAnswerCompanyWise`,
        {},
        {
          questionnaire_type: "SQ",
          company_id: localStorage.getItem("user_temp_id"),
          financial_year_id: financialYearId,
          // user_id: "399",
          data: updatedAnswers,
        },
        "POST"
      );
      getAnswerCompanyWise();
    }

    // axios
    //   .post(
    //     `${config.API_URL}saveAnswerCompanyWise`,
    //     {
    //       company_id: localStorage.getItem("user_temp_id"),
    //       financial_year_id: financialYearId,
    //       // user_id: "399",
    //       data: updatedAnswers,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${authValue?.data?.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     getAnswerCompanyWise()
    //     swal({
    //       icon: "success",
    //       title: "success",
    //       text: "Data Successfully created",
    //       timer: 1000,
    //     })
    //   })
    //   .catch((error) => {
    //     swal({
    //       icon: "error",
    //       title: error.response.data.message,
    //       timer: 1000,
    //     })
    //   })
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
  const handleAnswerOfFarmula = (item) => {
    let formula = item?.formula;
    let qidValues = formula.match(/Q(\d+)/g).map((qid) => qid.replace("Q", ""));
    let multplyDigit = [];
    let parts = formula.split("+");
    for (let part of parts) {
      if (part.includes("*")) {
        let value = part.split("*")[1];
        multplyDigit.push(parseFloat(value));
      } else {
        multplyDigit.push(1);
      }
    }
    const tempAns = answers?.length ? JSON.parse(JSON.stringify(answers)) : [];
    const result = [];
    let final = [];
    let combinedKeys = [];
    let combinedKey = [];
    let answerFind = [];
    for (const qId of qidValues) {
      for (let i = 0; i < tempAns.length; i++) {
        if (qId == tempAns[i]?.question_id) {
          const tempObj = {
            question_id: tempAns[i].question_id,
            answer: [...tempAns[i].answer],
          };
          answerFind.push(tempAns[i].question_id.toString());
          for (let j = 0; j < tempObj.answer.length; j++) {
            if (tempObj?.answer[j]?.audit_status != "REJECTED") {
              let index = qidValues.indexOf(qId);
              tempObj.answer[j].reading_value =
                parseFloat(tempObj.answer[j].reading_value) *
                parseFloat(multplyDigit[index]);
              result.push(tempObj.answer[j]);
            }
          }
        }
      }
    }
    let mismatchedArray = [];
    mismatchedArray = qidValues
      .filter((element) => !answerFind.includes(element))
      .map((element) => "Q" + element)
      .join(", ")
      .toString();

    for (let j = 0; j < result.length; j++) {
      let key =
        result[j].from_date +
        "-" +
        result[j].to_date +
        "-" +
        result[j].meter_id;

      let keyIndex = combinedKeys.findIndex((item) => item.key === key);

      if (keyIndex !== -1) {
        combinedKeys[keyIndex].answer.reading_value = (
          parseFloat(combinedKeys[keyIndex].answer.reading_value) +
          parseFloat(result[j].reading_value)
        ).toString();
      } else {
        let temp = {
          key: key,
          answer: result[j],
        };

        combinedKeys.push(temp);
      }
    }
    final = combinedKeys.map((item) => item.answer);

    // if(!_.isEqual(final, PreviousData))
    // {
    //   for (let j = 0; j < final?.length; j++) {
    //     handleQunatativeTreds(item, final, j,true);
    //   }

    // }

    let temp = {
      notFindANswer: mismatchedArray,
      answer: final,
      answered_at: "2023-06-14T04:41:50.000Z",
      company_id: 3,
      createdAt: "2023-06-14T04:41:50.000Z",
      financial_year_id: 6,
      id: item?.question_detail[0]?.id,
      proof_document: null,
      question_id: item?.question_detail[0]?.question_id,
      questionType: item?.questionType,
      questionnaire_type: "SQ",
      remark: null,
      reviewd_at: "2023-06-14T08:43:21.000Z",
      status: "IN_REVIEW",
      updatedAt: "2023-06-14T08:43:21.000Z",
      user_id: 3,
    };
    return [temp];
  };
  const handlequantitativeTypes = (item, event, index, qValue) => {
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    let value = qValue || event?.target?.value;
    if (index >= 0) {
      //upadte value if index exist
      tempAnswers[index]["answer"] = value;
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      setAnswers(tempAnswers);
    } else {
      //update value if index donesn't exist
      let tempObj = {
        question_id: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: value,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    }
  };

  const handleOtherTypes = (item, event, index) => {
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    if (index >= 0) {
      //upadte value if index exist
      tempAnswers[index]["answer"] = event?.target?.value;
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      setAnswers(tempAnswers);
    } else {
      //update value if index donesn't exist
      let tempObj = {
        question_id: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: event?.target?.value,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    }
  };
  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "sector_questions"
    );
    setMenuList(settingsMenu?.permissions);
  }, []);
  useEffect(() => {
    if (type === "ALL" && financialYearId) fetchStoredData();
  }, [type]);
  const get2DArrayAnswer = (item, event, qValue) => {
    const numberofRow = item.question_detail.filter(
      (d) => d.option_type === "row"
    ).length;
    const numberofColumn = item.question_detail.filter(
      (d) => d.option_type === "column"
    ).length;
    let answer2D = Array.from({ length: numberofRow }, () =>
      Array.from({ length: numberofColumn }, () => "")
    );
    answer2D[item?.indexRow][item?.indexCol] =
      qValue || event?.target?.value || "";
    return answer2D;
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Header />
      <Sidebar dataFromParent={props.location.pathname} />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <form name="form" onSubmit={fetchStoredData}>
                  <div className="select-reporting-criteria">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="Reporting_heading">
                        {" "}
                        <h1> Please Select Reporting Criteria </h1>{" "}
                      </div>
                      <div className="d-flex dropdown align-items-center">
                        <p className="m-0">Entity :</p>
                        {authValue?.data?.is_head === 1 &&
                          authValue?.data?.user_type_code === "company" ? (
                          <select
                            className="select_one_all"
                            value={entity}
                            onChange={(e) => setEntity(e.target.value)}
                          >
                            {/* <option value="company">Company</option> */}
                          </select>
                        ) : (
                          <select
                            className="select_one_all"
                            value={entity}
                            onChange={(e) => setEntity(e.target.value)}
                          >
                            <option value="">Select Entity</option>
                            <option value="company">Company</option>
                            <option value="supplier">Supplier</option>
                          </select>
                        )}
                      </div>
                      <div className="d-flex dropdown align-items-center">
                        <p className="m-0"> Financial Year : </p>
                        {financialYear && financialYear?.length === 1 ? (
                          <select
                            className="select_one_all"
                            onChange={async (e) => {
                              if (e.target.value !== "Select Financial Year") {
                                await setFinancialYearId(e.target.value);
                                if (financialYearId && entity) {
                                  fetchStoredData();
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
                            onChange={async (e) => {
                              if (e.target.value !== "Select Financial Year") {
                                await setFinancialYearId(e.target.value);
                                if (financialYearId && entity) {
                                  fetchStoredData();
                                }
                              } else {
                                setFinancialYearId("");
                              }
                            }}
                          >
                            <option>Select Financial Year</option>
                            {financialYear?.map((item, key) => (
                              <option key={key} value={item.id}>
                                {item.financial_year_value}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    {/* <div>
                      <button
                        style={{
                          background: "#1f9ed1",
                          border: "none",
                          borderRadius: "5px",
                          height: "50px",
                          color: "#fff",
                          fontWeight: "bold",
                          padding: "10px 20px",
                        }}
                        onClick={fetchStoredData}
                      >
                        Get Question
                      </button>
                    </div> */}
                  </div>
                </form>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <span>Loading Questionnaire</span>
                    <Spinner
                      style={{ marginLeft: "13px" }}
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <>
                    {" "}
                    {data?.length > 0 ? (
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="Introduction pb-4 pt-2 px-4">
                            <div className="col-md-12 question_section">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="Reporting_heading">
                                  <h1>Sector Questions </h1>
                                </div>
                                <div>
                                  {menuList?.includes(
                                    "ASSIGN_QUESTION_TO_COMPANY_SUB_ADMIN"
                                  ) && (
                                      <>
                                        <button
                                          className="new_button_style mx-2"
                                          onClick={handleShow}
                                        >
                                          Assign Question
                                        </button>
                                        <AssignSubWorker
                                          questions={filterQuestionList}
                                          financialYearId={financialYearId}
                                          fetchquestionApi={fetchquestionApi}
                                          entity={entity}
                                          show={show}
                                          onHide={handleClose}
                                        />
                                      </>
                                    )}

                                  {/* <button className="new_button_style">View</button> */}
                                </div>
                              </div>
                              <hr className="mt-0"></hr>
                              <div>
                                <SectorQuestionTab
                                  setType={setType}
                                  type={type}
                                  refrenceId={refrenceId}
                                  setRefrenceID={setRefrenceID}
                                />
                                {type !== "ALL" && (
                                  <Filters
                                    fetchData={fetchquestionApi}
                                    type={type}
                                  />
                                )}

                                {questionLoading ? (
                                  <div className="d-flex align-items-center justify-content-center mt-3">
                                    <span>Loading Questionnaire</span>

                                    <Spinner
                                      style={{ marginLeft: "13px" }}
                                      animation="border"
                                      role="status"
                                    >
                                      <span className="visually-hidden">
                                        Loading...
                                      </span>
                                    </Spinner>
                                  </div>
                                ) : (
                                  <div style={{ marginTop: "10px" }}>
                                    <QuestionTypeTabSection
                                      setSectorQuestionType={
                                        setSectorQuestionType
                                      }
                                      sectorQuestionType={sectorQuestionType}
                                      setFilterQuestionList={
                                        setFilterQuestionList
                                      }
                                      AllQuestionList={AllQuestionList}
                                      questionList={questionList}
                                    />
                                    <div className="form-group">
                                      <Row>
                                        <Col md={12}>
                                          <Accordion defaultActiveKey={["0"]}>
                                            {filterQuestionList &&
                                              filterQuestionList.map(
                                                (item, index) => {
                                                  let value;
                                                  let qualitativeAnswerBy;
                                                  let qualitativeStatus;
                                                  let qualitativeRemark;
                                                  let tabularStatus;
                                                  let tabularRemark;
                                                  let combinedAnswers;
                                                  let proof_document;
                                                  let a = item;
                                                  let quantitativeAnswers = [
                                                    {},
                                                  ];
                                                  const filterAnswer =
                                                    answers.filter(
                                                      (obj) =>
                                                        obj.question_id ==
                                                        item.id
                                                    );

                                                  if (
                                                    filterAnswer &&
                                                    filterAnswer[0] &&
                                                    filterAnswer[0]["answer"] &&
                                                    filterAnswer[0]["answer"] &&
                                                    item.questionType ===
                                                    "quantitative_trends"
                                                  ) {
                                                    quantitativeAnswers =
                                                      filterAnswer[0]["answer"];
                                                  }
                                                  value =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "answer"
                                                      ]) ||
                                                    "";
                                                  qualitativeAnswerBy =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "answered_by_email"
                                                      ]) ||
                                                    "";
                                                  qualitativeStatus =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "audit_status"
                                                      ]) ||
                                                    "";
                                                  qualitativeRemark =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "audit_remark"
                                                      ]) ||
                                                    "";
                                                  combinedAnswers =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "combined_answers"
                                                      ]) ||
                                                    "";
                                                  proof_document =
                                                    (filterAnswer &&
                                                      filterAnswer[0] &&
                                                      filterAnswer[0][
                                                      "proof_document"
                                                      ]) ||
                                                    "";
                                                  return (
                                                    <>
                                                      <Accordion.Item
                                                        eventKey={index}
                                                        className={
                                                          item.questionType ===
                                                            "tabular_question"
                                                            ? "d-block Q_section"
                                                            : "d-flex Q_section"
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            item.questionType ===
                                                              "tabular_question"
                                                              ? "col-md-12"
                                                              : "col-md-6"
                                                          }
                                                        >
                                                          <Accordion.Header>
                                                            <div>
                                                              {index +
                                                                1 +
                                                                ". " +
                                                                item.title}
                                                            </div>
                                                          </Accordion.Header>
                                                        </div>
                                                        <div
                                                          className={
                                                            item.questionType ===
                                                              "tabular_question"
                                                              ? "col-md-12"
                                                              : "col-md-6"
                                                          }
                                                        >
                                                          <Accordion.Body>
                                                            <div
                                                              onLoad={
                                                                handleItemRendered
                                                              }
                                                              className={`${item.assigned_to &&
                                                                user_Is_head !==
                                                                0
                                                                ? "disable__section__wrapper Answer_section row"
                                                                : "row Answer_section"
                                                                }`}
                                                            >
                                                              {item.questionType ===
                                                                "quantitative_trends" && (
                                                                  <div className="col-md-12">
                                                                    <div>
                                                                      <TrandsInputCard
                                                                        item={
                                                                          item
                                                                        }
                                                                        answer={answers.filter(
                                                                          (obj) =>
                                                                            obj?.question_id ===
                                                                            item?.id
                                                                        )}
                                                                        handleSubmit={(
                                                                          item,
                                                                          answer
                                                                        ) =>
                                                                          handleAnswers(
                                                                            item,
                                                                            answer,
                                                                            item?.questionType
                                                                          )
                                                                        }
                                                                        handleDeleteSubmit={(
                                                                          item,
                                                                          answer,
                                                                          tempArray,
                                                                          index
                                                                        ) =>
                                                                          handleDeleteAnswers(
                                                                            item,
                                                                            answer,
                                                                            item?.questionType,
                                                                            tempArray,
                                                                            index
                                                                          )
                                                                        }
                                                                        changeAns={() =>
                                                                          changeAnswer(
                                                                            item?.title
                                                                          )
                                                                        }
                                                                        formula={
                                                                          item?.formula ==
                                                                            null
                                                                            ? false
                                                                            : true
                                                                        }
                                                                        initalValue={
                                                                          initalValue
                                                                        }
                                                                        meterListData={
                                                                          meterList
                                                                        }
                                                                        processListData={
                                                                          processList
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                )}
                                                              <div className="col-md-10">
                                                                {item.questionType ==
                                                                  "yes_no" && (
                                                                    <div>
                                                                      <div className="d-flex align-items-center justify-content-between">
                                                                        {qualitativeAnswerBy?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              ANS
                                                                              By:-{" "}
                                                                              {
                                                                                qualitativeAnswerBy
                                                                              }
                                                                            </div>
                                                                          )}
                                                                        {qualitativeStatus?.length >
                                                                          0 && (
                                                                            <div
                                                                              className={
                                                                                qualitativeStatus ===
                                                                                  "IN_REVIEW"
                                                                                  ? "responce_side_review"
                                                                                  : qualitativeStatus ===
                                                                                    "IN_VERIFICATION"
                                                                                    ? "responce_side_review"
                                                                                    : qualitativeStatus ===
                                                                                      "REJECTED"
                                                                                      ? "responce_side_cass_reject"
                                                                                      : "responce_side_accept"
                                                                              }
                                                                            >
                                                                              Status:-{" "}
                                                                              {qualitativeStatus?.replace(
                                                                                /_/g,
                                                                                " "
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        {qualitativeRemark?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              Auditor
                                                                              Remark:-{" "}
                                                                              {
                                                                                qualitativeRemark
                                                                              }
                                                                            </div>
                                                                          )}
                                                                      </div>
                                                                      <Form>
                                                                        <div>
                                                                          <input
                                                                            inline="true"
                                                                            label="Yes"
                                                                            name="group1"
                                                                            type={
                                                                              "radio"
                                                                            }
                                                                            value={
                                                                              "yes"
                                                                            }
                                                                            checked={
                                                                              value ===
                                                                              "yes"
                                                                            }
                                                                            onChange={(
                                                                              value
                                                                            ) => {
                                                                              handleAnswers(
                                                                                item,
                                                                                value,
                                                                                item?.questionType
                                                                              );
                                                                            }}
                                                                          />
                                                                          <span className="mx-2">
                                                                            Yes
                                                                          </span>
                                                                          <br></br>
                                                                          <input
                                                                            inline="true"
                                                                            label="No"
                                                                            name="group1"
                                                                            type={
                                                                              "radio"
                                                                            }
                                                                            value={
                                                                              "no"
                                                                            }
                                                                            checked={
                                                                              value ===
                                                                              "no"
                                                                            }
                                                                            onChange={(
                                                                              value
                                                                            ) => {
                                                                              handleAnswers(
                                                                                item,
                                                                                value,
                                                                                item?.questionType
                                                                              );
                                                                            }}
                                                                          />
                                                                          <span className="mx-2">
                                                                            No
                                                                          </span>
                                                                        </div>
                                                                      </Form>
                                                                    </div>
                                                                  )}
                                                                {item.questionType ==
                                                                  "qualitative" && (
                                                                    <>
                                                                      <div className="d-flex align-items-center justify-content-between">
                                                                        {qualitativeAnswerBy?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              ANS
                                                                              By:-{" "}
                                                                              {"  "}
                                                                              {
                                                                                qualitativeAnswerBy
                                                                              }
                                                                            </div>
                                                                          )}
                                                                        {qualitativeStatus?.length >
                                                                          0 && (
                                                                            <div
                                                                              className={
                                                                                qualitativeStatus ===
                                                                                  "IN_REVIEW"
                                                                                  ? "responce_side_review"
                                                                                  : qualitativeStatus ===
                                                                                    "IN_VERIFICATION"
                                                                                    ? "responce_side_review"
                                                                                    : qualitativeStatus ===
                                                                                      "REJECTED"
                                                                                      ? "responce_side_cass_reject"
                                                                                      : "responce_side_accept"
                                                                              }
                                                                            >
                                                                              {" "}
                                                                              Status:-{" "}
                                                                              {""}
                                                                              {qualitativeStatus?.replace(
                                                                                /_/g,
                                                                                " "
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        {qualitativeRemark?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              Auditor
                                                                              Remark:-
                                                                              {
                                                                                qualitativeRemark
                                                                              }
                                                                            </div>
                                                                          )}
                                                                      </div>
                                                                      <textarea
                                                                        className="form-control mb-3"
                                                                        name="answers"
                                                                        required
                                                                        value={
                                                                          value
                                                                        }
                                                                        placeholder="Leave a Answer here"
                                                                        onChange={(
                                                                          e
                                                                        ) => {
                                                                          handleAnswers(
                                                                            item,
                                                                            e,
                                                                            item?.questionType
                                                                          );
                                                                        }}
                                                                      ></textarea>
                                                                    </>
                                                                  )}

                                                                {item.questionType ==
                                                                  "tabular_question" && (
                                                                    <TebularInputCard
                                                                      qualitativeStatus={
                                                                        qualitativeStatus
                                                                      }
                                                                      qualitativeRemark={
                                                                        qualitativeRemark
                                                                      }
                                                                      item={item}
                                                                      value={
                                                                        value
                                                                      }
                                                                      handleAddRow={() =>
                                                                        handleAddRow(
                                                                          item,
                                                                          index
                                                                        )
                                                                      }
                                                                      handleOnChange={(
                                                                        item,
                                                                        event,
                                                                        questionType,
                                                                        source,
                                                                        endDate
                                                                      ) =>
                                                                        handleAnswers(
                                                                          item,
                                                                          event,
                                                                          questionType,
                                                                          source,
                                                                          endDate
                                                                        )
                                                                      }
                                                                      handleKeyDown={(
                                                                        item,
                                                                        event
                                                                      ) =>
                                                                        handlekeyPress(
                                                                          item,
                                                                          event
                                                                        )
                                                                      }
                                                                      meterListData={
                                                                        meterList
                                                                      }
                                                                    />
                                                                  )}
                                                                {item.questionType ==
                                                                  "quantitative" && (
                                                                    <>
                                                                      <div className="d-flex align-items-center justify-content-between">
                                                                        {qualitativeAnswerBy?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              ANS
                                                                              By:-{" "}
                                                                              {"  "}
                                                                              {
                                                                                qualitativeAnswerBy
                                                                              }
                                                                            </div>
                                                                          )}
                                                                        {qualitativeStatus?.length >
                                                                          0 && (
                                                                            <div
                                                                              className={
                                                                                qualitativeStatus ===
                                                                                  "IN_REVIEW"
                                                                                  ? "responce_side_review"
                                                                                  : qualitativeStatus ===
                                                                                    "IN_VERIFICATION"
                                                                                    ? "responce_side_review"
                                                                                    : qualitativeStatus ===
                                                                                      "REJECTED"
                                                                                      ? "responce_side_cass_reject"
                                                                                      : "responce_side_accept"
                                                                              }
                                                                            >
                                                                              {" "}
                                                                              Status:-{" "}
                                                                              {""}
                                                                              {qualitativeStatus?.replace(
                                                                                /_/g,
                                                                                " "
                                                                              )}
                                                                            </div>
                                                                          )}
                                                                        {qualitativeRemark?.length >
                                                                          0 && (
                                                                            <div className="responce_side_cass">
                                                                              Auditor
                                                                              Remark:-{" "}
                                                                              {"  "}
                                                                              {
                                                                                qualitativeRemark
                                                                              }
                                                                            </div>
                                                                          )}
                                                                      </div>
                                                                      <div>
                                                                        <input
                                                                          className="p-2 "
                                                                          type="number"
                                                                          value={
                                                                            value
                                                                          }
                                                                          onKeyDown={(
                                                                            e
                                                                          ) => {
                                                                            // handleKeyDown(
                                                                            //   e,
                                                                            //   item["id"]
                                                                            // )
                                                                            handlekeyPress(
                                                                              item,
                                                                              e
                                                                            );
                                                                          }}
                                                                          onChange={(
                                                                            value
                                                                          ) => {
                                                                            handleAnswers(
                                                                              item,
                                                                              value,
                                                                              item?.questionType
                                                                            );
                                                                          }}
                                                                        />
                                                                      </div>
                                                                    </>
                                                                  )}
                                                              </div>
                                                              {item?.questionType !==
                                                                "quantitative_trends" && (
                                                                  <div className="col-md-2">
                                                                    <div
                                                                      style={{
                                                                        textAlign:
                                                                          "center",
                                                                      }}
                                                                    >
                                                                      <div className="attachment_with_icons">
                                                                        <span>
                                                                          <div>
                                                                            <input
                                                                              id="aaaa"
                                                                              type="file"
                                                                              onChange={(
                                                                                e
                                                                              ) => {
                                                                                if (
                                                                                  e
                                                                                    .target
                                                                                    .files
                                                                                    .length >
                                                                                  0
                                                                                ) {
                                                                                  uploadFile(
                                                                                    e,
                                                                                    index,
                                                                                    item
                                                                                  );
                                                                                }
                                                                              }}
                                                                              style={{
                                                                                display:
                                                                                  "none",
                                                                              }}
                                                                            />
                                                                          </div>

                                                                          <div className="file file--upload">
                                                                            <label
                                                                              htmlFor="aaaa"
                                                                              onClick={(
                                                                                e
                                                                              ) => {
                                                                                setUploadItem(
                                                                                  {
                                                                                    index:
                                                                                      index,
                                                                                    item: item,
                                                                                  }
                                                                                );
                                                                              }}
                                                                              data-index={
                                                                                index
                                                                              }
                                                                            >
                                                                              <svg
                                                                                width="34"
                                                                                height="34"
                                                                                viewBox="0 0 34 34"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                style={{
                                                                                  cursor:
                                                                                    "pointer",
                                                                                }}
                                                                              >
                                                                                <path
                                                                                  d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                                  fill="#A7ACC8"
                                                                                ></path>
                                                                                <path
                                                                                  d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                                  fill="#A7ACC8"
                                                                                  stroke="#A7ACC8"
                                                                                  strokeWidth="0.5"
                                                                                ></path>
                                                                              </svg>
                                                                            </label>
                                                                          </div>
                                                                        </span>
                                                                      </div>
                                                                      <span
                                                                        className="Font_flex_var m-0"
                                                                        style={{
                                                                          fontSize:
                                                                            "9px",
                                                                        }}
                                                                      >
                                                                        Upload
                                                                        Attatchment
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                )}
                                                              {item.questionType ==
                                                                "tabular_question" && (
                                                                  <TebularInputCardAnswer
                                                                    item={item}
                                                                    combinedAnswers={
                                                                      combinedAnswers
                                                                    }
                                                                    userIsHead={
                                                                      user_Is_head
                                                                    }
                                                                    userIsHistory={
                                                                      0
                                                                    }
                                                                    meterListData={
                                                                      meterList
                                                                    }
                                                                  />
                                                                )}
                                                              <div>
                                                                {proof_document &&
                                                                  proof_document.startsWith(
                                                                    "http"
                                                                  ) && (
                                                                    <div className="text-center">
                                                                      <div className="attachment_with_icons">
                                                                        <span>
                                                                          <button
                                                                            style={{
                                                                              border:
                                                                                "none",
                                                                              background:
                                                                                "none",
                                                                            }}
                                                                            onClick={() => {
                                                                              setShowModal(
                                                                                true
                                                                              );
                                                                              setUrl(
                                                                                proof_document
                                                                              );
                                                                            }}
                                                                          >
                                                                            <svg
                                                                              width="34"
                                                                              height="34"
                                                                              viewBox="0 0 34 34"
                                                                              fill="none"
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                              <path
                                                                                d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                                fill="#A7ACC8"
                                                                              ></path>
                                                                              <path
                                                                                d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                                fill="#A7ACC8"
                                                                                stroke="#A7ACC8"
                                                                                strokeWidth="0.5"
                                                                              ></path>
                                                                            </svg>
                                                                          </button>
                                                                          <span
                                                                            className="delete_attachment"
                                                                            data-id="411"
                                                                            aria-hidden="true"
                                                                          >
                                                                            {" "}
                                                                            ×{" "}
                                                                          </span>
                                                                        </span>
                                                                      </div>
                                                                      <span
                                                                        className="Font_flex_var m-0"
                                                                        style={{
                                                                          fontSize:
                                                                            "9px",
                                                                        }}
                                                                      >
                                                                        DownLoad
                                                                        Attatchment
                                                                      </span>
                                                                    </div>
                                                                  )}
                                                              </div>
                                                            </div>
                                                          </Accordion.Body>
                                                        </div>
                                                      </Accordion.Item>
                                                    </>
                                                  );
                                                }
                                              )}
                                          </Accordion>
                                        </Col>
                                      </Row>
                                      <Modal show={showModal}>
                                        <div className="modal-lg">
                                          <Modal.Header className="justify-content-end">
                                            <Button
                                              variant="outline-dark"
                                              onClick={() =>
                                                setShowModal(false)
                                              }
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
                                            ></img>
                                          </div>
                                        </div>
                                      </Modal>
                                      <Button
                                        style={{
                                          background: "#1f9ed1",
                                          border: "none",
                                          padding: "10px 30px",
                                          marginTop: "10px",
                                        }}
                                        className="mx-3"
                                        onClick={submitHandler}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : financialYearId ? (
                      <>
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="Introduction framwork_2 d-grid justify-content-center">
                              <div className="col-md-12">
                                <div className="heading align-items-center">
                                  <h4 className="E_capital font-heading">
                                    No Questionnaire Found
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorQuestion;
