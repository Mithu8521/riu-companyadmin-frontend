import React, { useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import AssignQuestions from "./AssignQuestions";
import axios from "axios";
import "./SectorQuestion.css";
import config from "../../../../config/config.json";
import { Row, Col, Table, Form, Accordion } from "react-bootstrap";
import QuestionTypeTabSection from "./QuestionTypeTabSection";
import { Modal } from "react-bootstrap";
import swal from "sweetalert";
import { apiCall } from "../../../../_services/apiCall";
import { useRef } from "react";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import { authenticationService } from "../../../../_services/authentication";
import SectorAnswer from "./SectorAnswer";
import Review from "../../../../img/sector/reviewing.png";
import Verified from "../../../../img/sector/accept.png";
import Reject from "../../../../img/sector/decline.png";
import NotAnswered from "../../../../img/sector/notAnswer.png";
import Maximize from "../../../../img/sector/maximize.png";
import Minimize from "../../../../img/sector/minimize.png";
import SectorQuestionFilter from "./Filter/SectorQuestionFilter";
import { USER_TYPE_CODE_MAPPING } from "../../../../_constants/constants";
import { NavLink } from "react-router-dom";
import Loader from "../../../loader/Loader";
import ReAssignQuestions from "./ReassignUser";

const SectorQuestion = (props) => {
  // const questionsIds = props.location?.state?.questionIds
  const [questionList, setQuestionList] = useState();
  const [questionsIds, setQuestionsIds] = useState([]);
  const [quesWidth, setQuesWidth] = useState(6);
  const [ansWidth, setAnsWidth] = useState(6);
  const [hideCol, setHideCol] = useState(false);
  const [sectorQuestionType, setSectorQuestionType] = useState();
  const [uploadItem, setUploadItem] = useState([]);
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [entity, setEntity] = useState([]);
  const [entityList, setEntityList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [answeredChanges, setAnsweredChanges] = useState(false);
  const [showImport, setShowImport] = useState(false);
 const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleCloseImport = () => setShowImport(false);
  const handleShowImport = () => setShowImport(true);

  const [AllQuestionList, setAllAllQuestionList] = useState({
    quantitative: [],
    tabular_question: [],
    qualitative: [],
    yes_no: [],
    quantitative_trends: [],
  });
  const [auditStatus, setAuditStatus] = useState({});
  const [questionData, setQuestionData] = useState({
    title: "",
    id: "",
    questionType: "",
    frameworkId: "",
    topicId: "",
    kpiId: "",
    title: "",
    question_detail: [],
    audit_status: "",
    add_row: 0,
    formula: null,
    yes_no_option: null,
    add_note_options: null,
  });

  const [subQuestionData, setSubQuestionData] = useState({
    title: "",
    id: "",
  });

  const [filterQuestionList, setFilterQuestionList] = useState([]);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState(false);
  const [companyEsgData, setCompanyEsgData] = useState();
  const [answers, setAnswers] = useState([]);
  const [assignedDetails, setAssignedDetails] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(0);
  const [financialYear, setFinancialYear] = useState([]);
  const authValue = JSON.parse(localStorage.getItem("currentUser"));
  const [initalValue, setInitialValue] = useState({});
  const user_Is_head = authValue?.is_head;
  const [answerChangedData, setAnswerAnswerChangedData] = useState([]);
  const [meterList, setMeterList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const ref = useRef();
  const current_role = localStorage.getItem("role");
  const current_user_type_code = USER_TYPE_CODE_MAPPING[current_role];

  let changedData = [];
  useEffect(() => {
    if (entity[0]) {
      getFinancialYear();
    }
  }, [entity[0]]);
  useEffect(() => {
    getFinancialYear();
  }, []);
  useEffect(() => {
    if (filterQuestionList) {
      setQuestionData(filterQuestionList[0]);
      setSelectedRow(filterQuestionList[0]?.id);
      setIneerRowSelectedRow(false);
    }
  }, [filterQuestionList]);

  useEffect(() => {
    if (financialYearId && entity) fetchStoredData();
  }, [financialYearId, entity]);
  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
      {},
      {}
    );

    if (isSuccess) {
      setFinancialYear(data.data);
      if (data?.data?.length) {
        setFinancialYearId(data.data[data?.data?.length - 1].id);
        if (financialYearId && entity) {
          fetchStoredData();
        }
      }
    }
  };
  useEffect(() => {
    setInitialValue({
      starting_month: JSON.parse(localStorage.getItem("currentUser"))
        .starting_month,
      frequency: JSON.parse(localStorage.getItem("currentUser")).frequency,
    });
  }, []);

  const answerWidth = () => {

    setQuesWidth(0);
    setAnsWidth(12);
    setHideCol(true);
  };

  const questionWidth = () => {
    setQuesWidth(6);
    setAnsWidth(6);
    setHideCol(false);
  };

  // useEffect(() => {
  //   filterQuestionList?.length &&
  //     answers?.length &&
  //     filterQuestionList?.map((item) => {
  //       // setReviewStatus(item)
  //       answers.length &&
  //         answers.filter((answer) => {
  //           if (answer.questionId === item.id) {
  //             setAuditStatus((auditStatus) => ({
  //               ...auditStatus,
  //               [item.id]: answer.status,
  //             }));
  //           }
  //         });
  //     });
  // }, [filterQuestionList?.length, answers?.length]);

  const settingEntities = async () => {
    if (current_user_type_code === "company") {
      setEntity([{ name: "company", id: 1 }]);

      setEntityList([
        { name: "company", id: 1 },
        { name: "supplier", id: 3 },
      ]);
    }
    if (current_user_type_code === "supplier") {
      const { isSuccess, data, error } = await getSupplierEntities();
      if (isSuccess) {
        setEntityList(
          (data?.entities).map((entity) => ({
            name: entity.register_company_name,
            id: entity.companyId,
          }))
        );
        // setEntity([
        //   {
        //     name: data?.entities[0].register_company_name,
        //     id: data?.entities[0].companyId,
        //   },
        // ]);
      }
      if (error) {
        swal({
          icon: "error",
          title: "Could not get entity companies!",
          timer: 1000,
        });
      }
    }
  };
  useEffect(() => {
    settingEntities();

  }, []);


  const setQuestionDataFunction = (e, item) => {
    setQuestionData({
      title: item.title,
      id: item.id,
      frameworkId: item?.frameworkId,
      topicId: item?.topicId,
      kpiId: item.kpiId,
      questionType: item.questionType,
      question_detail: item.question_detail,
      qualitativeAnswerBy: item.qualitativeAnswerBy,
      qualitativeStatus: item.qualitativeStatus,
      qualitativeRemark: item.qualitativeRemark,
      add_row: item?.add_row,
      formula: item?.formula,
      yes_no_option: item?.yes_no_option,
      add_note_options: item?.add_note_options,
    });
  };

  const setSubQuestionDataFunction = (e, item) => {
    setSubQuestionData({
      title: item.option,
      id: item.id,
    });
  };

  const getSupplierEntities = async () => {
    return await apiCall(
      `${config.API_URL}getSupplierEntities`,
      {},
      {
        supplier_id:
          current_role === "SUPPLIER" ? authValue.id : authValue.parent_id,
      }
    );
  };

  const setEntityValue = (value) => {
    let entityName = entityList?.filter((entity) => {
      if (entity.id === parseInt(value)) {
        return entity;
      }
    });

    setEntity([{ name: entityName[0]?.name, id: parseInt(value) }]);
  };

  const fetchStoredData = async () => {
    if (financialYearId) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getESGReport`,
        {},
        {
          type: "SQ",
          financial_year_id: financialYearId ? financialYearId : 6,
        },
        "GET"
      );
      if (isSuccess) {
        const responseData = data?.data;
        if (data?.mainCompany && responseData.length === 0) {
        } else {
          if (!responseData?.mainCompany) {
            getSectorQuestion([], [], []);
          }
          const storeData = responseData[0]?.frameworkTopicKpi || "{}";
          setCompanyEsgData(storeData);
          if (!storeData.frameworkId || storeData.frameworkId.length === 0) {
          } else {
            if (responseData.length === 0 && responseData?.mainCompany) {
            } else {
              getSectorQuestion(
                storeData.frameworkId,
                storeData.mandatoryTopicsId
                  .concat(storeData.voluntaryTopicsId)
                  .concat(storeData.customTopicsId),
                storeData.mandatoryKpiId
                  .concat(storeData.voluntaryKpiId)
                  .concat(storeData.customKpiId)
              );
            }
          }
        }
      }
    } else {
    }
  };
  const getSectorQuestion = (
    frameworkIds,
    topicIds,
    kpiIds,
    selectedDesignationId,
    selectedUserId,
    selectedLocationId,
    fromDate,
    toDate,
    selectedStatusId
  ) => {
    setLoading(true);
    let questionId = props.location?.state?.questionIds;
    if (questionId) {
      setFinancialYearId(6);
    }
    const locatStorageIds = localStorage.getItem("questionIds");
    if (locatStorageIds) {
      questionId = [locatStorageIds];
    }
    axios
      .get(
        `${config.POSTLOGIN_API_URL_COMPANY
        }getSectorQuestion?type=CUSTOM&financialYearId=${financialYearId ? financialYearId : 6
        }&questionnaireType=SQ&frameworkIds=[${frameworkIds}]&topicIds=[${topicIds}]&kpiIds=[${kpiIds}]${questionId ? `&questionIds=[${questionId}]` : "&questionIds=undefined"
        }& roleIds=[${selectedDesignationId}]&userIds=[${selectedUserId}]&locationIds=[${selectedLocationId}]&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            userId: JSON.parse(localStorage.getItem("currentUser")).id,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        setLoading(false);
        getSource();
        // getProcess();
        localStorage.removeItem("questionIds");
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setDatas(true);
          const groupedTopicsData = response.data.data.reduce((acc, obj) => {
            const { report_id, topic_name, ...rest } = obj;
            if (!acc[topic_name]) {
              acc[topic_name] = [];
            }
            acc[topic_name].push({ report_id, topic_name, ...rest });
            return acc;
          }, {});
          setData([1]);
          setGroupedTopicsData(groupedTopicsData);

          setAnswers(response.data.answers);
          setAssignedDetails(response?.data?.assignedDetails);
        } else {
          setData([]);
          setQuestionLoading(false);
          setQuestionList([]);
          setFilterQuestionList([]);
          setAnswers([]);
          setAssignedDetails([]);
          setLoading(false);
          setFilterQuestionList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      setMeterList(locationArray);
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
      setProcessList(data?.data?.reverse());
    }
  };
  const uploadFile = (files) => {
    setAnsweredChanges(true);
    let tempAnswers = [...answers];
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
        let index = uploadItem.index;
        let item = uploadItem.item;
        let url = JSON.parse(result);

        if (tempAnswers.length) {
          let check = tempAnswers.findIndex(
            (value) => value.questionId == item.id
          );

          if (check !== -1) {
            // If proofDocument already exists, update it
            let existingProofDocuments =
              tempAnswers[check]["proofDocument"] || [];
            existingProofDocuments.push(url.url); // Push the new URL
            tempAnswers[check]["proofDocument"] = existingProofDocuments;
            tempAnswers[check]["status"] = true;

            setAnswers(tempAnswers);
          } else {
            // If it's a new proofDocument, create a new entry
            let tempObj = {
              questionId: item?.id,
              questionType: item?.questionType ?? item?.questionType,
              answer_id: -1,
              status: true,
              proofDocument: [url.url], // Store the URL in an array
              frameworkId: item?.frameworkId,
              topicId: item?.topicId,
              kpiId: item?.kpiId,
              title: item?.title,
            };
            tempAnswers.push(tempObj);

            setAnswers(tempAnswers);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };
  const handleAnswers = (item, event, questionType, source, value, performed) => {
    setAnsweredChanges(true);
    const tempAnswers = [...answers];
    const index = tempAnswers.findIndex((obj) => obj?.questionId === item?.id);
    item["questionType"] = questionType;

    switch (questionType) {
      case "tabular_question": {
        handleTabularAnswers(item, event, index, source, value, performed);
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
      case "yes_no": {
        handleYesNoTypes(item, event, index, source);
        break;
      }
      default: {
        handleOtherTypes(item, event, index);
      }
    }
  };

  const handleAssignedDetails = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAssignedDetails`,
      {},
      { financialYearId: financialYearId },
      "GET"
    );
    if (isSuccess) {
      setAssignedDetails(data?.assignedDetails);
    }
  };
  const handleTabularAnswers = (item, event, index, source, qValue, performed) => {
    let tempAnswers = answers ? [...answers] : [];
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
    if (performed === "performed") {
      if (index >= 0) {
        tempAnswers[index]["performed"] = event;
        setAnswers(tempAnswers);
      } else {
        const tempObj = {
          questionId: item?.id,
          questionType: item?.questionType ?? item?.questionType,
          status: true,
          answer: true,
          performed: event,
          source_id: source,
          frameworkId: item?.frameworkId,
          topicId: item?.topicId,
          kpiId: item?.kpiId,
          title: item?.title,
        };
        tempAnswers.push(tempObj);
        setAnswers(tempAnswers);
      }

    } else {
      const isContact =
        typeof event === "string" &&
        (event.includes("yes") || event.includes("no"));
      const targetValue = isContact ? event : event?.target?.value || "";

      if (index >= 0) {
        if (tempAnswers[index] &&
          tempAnswers[index]["combinedAnswers"] &&
          tempAnswers[index]["combinedAnswers"].length > 0 && tempAnswers[index]["combinedAnswers"].find(item => item.sourceId == source)?.answer) {
          tempAnswers[index]["answer"] = tempAnswers[index]["combinedAnswers"].find(item => item.sourceId == source)?.answer;
        }
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
        const id = tempAnswers[index]["questionId"];
        tempAnswers[index]["questionId"] = id || -1;
        tempAnswers[index]["status"] = true;
        tempAnswers[index]["source_id"] = source;
        tempAnswers[index]["questionType"] = item?.questionType;
        tempAnswers[index]["frameworkId"] = item?.frameworkId;
        tempAnswers[index]["topicId"] = item?.topicId;
        tempAnswers[index]["kpiId"] = item?.kpiId;
        tempAnswers[index]["title"] = item?.title;
        setAnswers(tempAnswers);
      } else {

        const answer2D = get2DArrayAnswer(item, event);

        const tempObj = {
          questionId: item?.id,
          questionType: item?.questionType ?? item?.questionType,
          // answer_id: -1,
          status: true,
          answer: answer2D,
          source_id: source,
          frameworkId: item?.frameworkId,
          topicId: item?.topicId,
          kpiId: item?.kpiId,
          title: item?.title,
          // combinedAnswers : [{sourceId:source,answer:answer2D}],
        };
        tempAnswers.push(tempObj);
        setAnswers(tempAnswers);
      }
    }

  };

  const handleQunatativeTreds = (item, trendsAns, index, formula) => {
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    const changes = changedData?.filter((it) => it !== item?.title);
    changedData = changes;
    setAnswerAnswerChangedData(changes);
    if (trendsAns === "N.A") {
      let tempObj = {
        questionId: item?.id,
        questionType: item?.questionType ?? item?.questionType,
        answer_id: -1,
        status: true,
        answer: null,
        notApplicable: trendsAns,
        frameworkId: item?.frameworkId,
        topicId: item?.topicId,
        kpiId: item?.kpiId,
        title: item?.title,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    } else if (index >= 0) {
      tempAnswers[index]["answer"] = trendsAns;
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      tempAnswers[index]["questionType"] = item?.questionType;
      tempAnswers[index]["frameworkId"] = item?.frameworkId;
      tempAnswers[index]["topicId"] = item?.topicId;
      tempAnswers[index]["kpiId"] = item?.kpiId;
      tempAnswers[index]["title"] = item?.title;
      setAnswers(tempAnswers);
      if (!formula) {
        sweetAlert("success", `${item?.title} Successfully saved`);
      }
    } else {
      let tempObj = {
        questionId: item?.id,
        questionType: item?.questionType ?? item?.questionType,
        answer_id: -1,
        status: true,
        answer: trendsAns,
        frameworkId: item?.frameworkId,
        topicId: item?.topicId,
        kpiId: item?.kpiId,
        title: item?.title,
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
      const { isSuccess, data, error } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveAnswerSectorQuestion`,
        {},
        {
          financialYearId: Number(financialYearId),
          data: updatedAnswers,
        },
        "POST"
      );

      if (isSuccess) {
        setAnswers(data?.answers);
      }
      if (error) {
      }
    }
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
      tempAnswers[index]["frameworkId"] = item?.frameworkId;
      tempAnswers[index]["topicId"] = item?.topicId;
      tempAnswers[index]["kpiId"] = item?.kpiId;
      tempAnswers[index]["title"] = item?.title;
      setAnswers(tempAnswers);
    } else {
      //update value if index donesn't exist
      let tempObj = {
        questionId: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: value,
        frameworkId: item?.frameworkId,
        topicId: item?.topicId,
        kpiId: item?.kpiId,
        title: item?.title,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    }
  };
  const handleYesNoTypes = (item, event, index, values) => {
    let tempAnswers = (answers && answers.length > 0 && [...answers]) || [];
    if (index >= 0) {
      const tempAnswer = JSON.parse(tempAnswers[index]["answer"]);
      // const safd= values;
      const updatedAnswers = { ...tempAnswer, [values]: event?.target?.value };
      tempAnswers[index]["answer"] = JSON.stringify(updatedAnswers);
      const id = tempAnswers[index]["id"];
      tempAnswers[index]["answer_id"] = id || -1;
      tempAnswers[index]["status"] = true;
      tempAnswers[index]["frameworkId"] = item?.frameworkId;
      tempAnswers[index]["topicId"] = item?.topicId;
      tempAnswers[index]["kpiId"] = item?.kpiId;
      tempAnswers[index]["title"] = item?.title;
      setAnswers(tempAnswers);
    } else {
      const answers = {
        answer: '', details: '', weblink: ''
      }
      const updatedAnswers = { ...answers, [values]: event?.target?.value };
      let tempObj = {
        questionId: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: JSON.stringify(updatedAnswers),
        frameworkId: item?.frameworkId,
        topicId: item?.topicId,
        kpiId: item?.kpiId,
        title: item?.title,
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
      tempAnswers[index]["frameworkId"] = item?.frameworkId;
      tempAnswers[index]["topicId"] = item?.topicId;
      tempAnswers[index]["kpiId"] = item?.kpiId;
      tempAnswers[index]["title"] = item?.title;
      setAnswers(tempAnswers);
    } else {
      //update value if index donesn't exist
      let tempObj = {
        questionId: item?.id,
        questionType: item?.questionType,
        answer_id: -1,
        status: true,
        answer: event?.target?.value,
        frameworkId: item?.frameworkId,
        topicId: item?.topicId,
        kpiId: item?.kpiId,
        title: item?.title,
      };
      tempAnswers.push(tempObj);
      setAnswers(tempAnswers);
    }
  };
  const [groupData, setGroupData] = useState([]);
  const [groupedTopicsData, setGroupedTopicsData] = useState(null);
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeInnerIndex, setActiveInnerIndex] = useState(null);
  const [questionsDataList, setQuestionsDataList] = useState([]);
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
    setGroupQuestions(groupedQuestions);
    setQuestionsDataList(result);
    // setData(questionData);
    setAllAllQuestionList({
      quantitative: [],
      tabular_question: [],
      qualitative: [],
      yes_no: [],
      quantitative_trends: [],
    });
    setQuestionList(result);
    result?.map((item) => {
      // setReviewStatus(item)
      answers.length &&
        answers.filter((answer) => {
          if (answer.questionId === item.id) {
            setAuditStatus((auditStatus) => ({
              ...auditStatus,
              [item.id]: answer.status,
            }));
          }
        });
    });
    setFilterQuestionList(result);
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
  const handleAccordionToggle = async (index, topicName) => {
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
  const getAuditStatusImage = (id) => {
    switch (auditStatus[id]) {
      case 'IN_VERIFICATION':
        return (
          <img
            src={Review}
            alt="In Verification"
            style={{ width: '80px' }}
            className="notAnsered_question w-25"
            title="In Verification"
          />
        );
      case 'ANSWERED':
        return (
          <img
            src={Review}
            alt="In Review"
            style={{ width: '45%' }}
            title="In Review"
          />
        );
      case 'ACCEPTED':
        return (
          <img
            src={Verified}
            alt="Verified"
            style={{ width: '45%' }}
            title="Verified"
          />
        );
      case 'REJECTED':
        return (
          <img
            src={Reject}
            alt="Rejected"
            style={{ width: '45%' }}
            title="Rejected"
          />
        );
      default:
        return (
          <img
            className="notAnsered_question"
            src={NotAnswered}
            alt="Not Answered"
            title="Not Answered"
          />
        );
    }
  };
  const [submitShow, setSubmitShow] = useState(false);
  const [assignedDetail, setAssignedDetail] = useState(null);
  // const [filterAnswer, setFilterAnswer] = useState(null);
  // const [answersValue, setAnswersValue] = useState(null);
  useEffect(() => {
    setQuestionsDataList(filterQuestionList);
  }, [filterQuestionList]);
  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = JSON.parse(localStorage.getItem("menu")).find(
      (item) => item?.url === "sector_questions"
    );
    setMenuList(settingsMenu?.permissions);
  }, []);
  useEffect(() => {
    if (financialYearId) fetchStoredData();
  }, [entity]);
  useEffect(() => {
    if (questionData) {
      const assignedDetail = assignedDetails && assignedDetails?.filter((obj) => obj.questionId == questionData.id);
      setAssignedDetail(assignedDetail && assignedDetail[0]);
      const assignedTo = assignedDetail && assignedDetail[0]?.assignedTo;
      //  const filterAnswer =  answers && answers?.filter((obj) => obj.questionId == questionData.id);   
      //  setAnswersValue((filterAnswer && filterAnswer[0] && filterAnswer[0]["answer"]) || "");
      //  setFilterAnswer(filterAnswer);
      setSubmitShow(assignedTo && assignedTo.includes(String(JSON.parse(localStorage.getItem("currentUser")).id)));
    }
  }, [questionData, answers, answers?.length]);

  useEffect(() => {
    setQuestionsIds(props.location);
    const locatStorageIds = localStorage.getItem("questionIds");
    if (locatStorageIds || props.location?.state?.questionIds) {
      setFinancialYear([
        {
          id: 6,
          financial_year_value: "2023-2024",
        },
      ]);

      setFinancialYearId(6);
      if (6) fetchStoredData();
    }
  }, [props.location?.state?.questionIds]);
  const get2DArrayAnswer = (item, event, qValue) => {
    const isContact =
      typeof event === "string" &&
      (event.includes("yes") || event.includes("no"));

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
      qValue || isContact ? event : event?.target?.value || "";
    return answer2D;
  };

  const idToLetter = (id) => {
    let base = 97;
    const total = 26;
    const ascii = base + (id % total);

    let char = String.fromCharCode(ascii);
    return char;
  };

  const handleFilterHandler = (
    selectedFrameworkId,
    selectedTopicId,
    selectedKpiId,
    selectedDesignationId,
    selectedUserId,
    selectedLocationId,
    fromDate,
    toDate
  ) => {
    getSectorQuestion(
      selectedFrameworkId,
      selectedTopicId,
      selectedKpiId,
      selectedDesignationId,
      selectedUserId,
      selectedLocationId,
      fromDate,
      toDate
    );
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [reassignShow, setReassignShow] = useState(false);
  const handleReassignClose = () => setReassignShow(false);
  const handleReassignShow = () => setReassignShow(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (index) => {

    setAnsweredChanges(false);
    setSelectedRow(index);
    setIneerRowSelectedRow(false);
  };

  const [selectedInnerRow, setIneerRowSelectedRow] = useState(null);
  const handleInnerRowClick = (index) => {
    setAnsweredChanges(false);
    setSelectedRow(index);
    setIneerRowSelectedRow(index);
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
       <div
        style={{
         flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999,transition: "flex 0.3s ease"
        }}
      >
        <Sidebar
          financeObjct={financeObjct}
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle} 
        />
      </div>

      {/* Main Content */}
      <div style={{flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease" , minHeight: "100vh", overflowY: "auto" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper p-3" >
          {/* <section className="inner_wraapper px-3 pt-3"> */}
          <>
            <div className="w-100 p-4">


            </div>
            {financialYear?.length > 0 ? (
              <div className="Introduction">

                <div className="justify-content-between pb-2">
                  {/* <div className="Reporting_heading">
                        <h1>Please Select Reporting Criteria</h1>
                      </div> */}
                  <div className="dropdown hstack pb-2">
                    {/* <p className="m-0">
                                {current_user_type_code === "company"
                                  ? current_role === "COMPANY"
                                    ? "Entity :"
                                    : ""
                                  : "Company :"}
                              </p> */}
                    {/* {authValue?.is_head === 1 &&
                            authValue?.user_type_code === "company" ? (
                              <select
                                className="select_one_all"
                                value={entity}
                                onChange={(e) => setEntity(e.target.value)}
                              >
                                <option value="company">Company</option>
                              </select>
                            ) : ( */}
                    {((current_user_type_code === "company" &&
                      current_role === "COMPANY") ||
                      current_user_type_code === "supplier") && (
                        <select
                          className="select_one_all"
                          onChange={(e) => {
                            setEntityValue(e.target.value);
                          }}
                          defaultValue={
                            current_user_type_code === "company" &&
                              current_role === "COMPANY"
                              ? 1
                              : 3
                          }
                        >
                          {/* {current_role === "COMPANY" ? (
                                    <option value="1">company</option>
                                  ) : ( */}
                          <option
                            value=""
                            disabled
                            selected={
                              current_user_type_code === "supplier"
                                ? true
                                : false
                            }
                          >
                            {current_user_type_code === "company"
                              ? current_role === "COMPANY"
                                ? "Select Entity"
                                : ""
                              : "Select Company"}
                          </option>
                          {/* )} */}
                          {entityList.map((entity) => (
                            <option
                              value={entity.id}
                              ref={ref}
                              selected={
                                current_user_type_code === "company" &&
                                current_role === "COMPANY" &&
                                entity.name === "company"
                              }
                            >
                              {entity.name}
                            </option>
                          ))}
                          {/* <option value="company">Company</option>
                                  <option value="supplier">Supplier</option> */}
                        </select>
                      )}
                  </div>
                  <div className="d-flex dropdown align-items-center">
                    <div className="Reporting_heading">
                      <h1 className="m-0">Financial Year</h1>
                    </div>
                    {financialYear && financialYear?.length === 1 ? (
                      <select
                        className="select_one_all"
                        onChange={async (e) => {
                          if (e.target.value !== "Select Financial Year") {
                            setFinancialYearId(e.target.value);
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
                        value={
                          financialYearId ||
                          (financialYear.length > 0
                            ? financialYear[financialYear.length - 1].id
                            : "")
                        }
                        onChange={async (e) => {
                          if (e.target.value !== "Select Financial Year") {
                            setFinancialYearId(e.target.value);
                            if (financialYearId && entity) {
                              fetchStoredData();
                            }
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
                  {data.length ? (
                    <div className="d-flex align-tems-center gap-3">
                      <div className="filter_ICOn">
                        <SectorQuestionFilter
                          companyEsgData={companyEsgData}
                          handleFilterHandler={handleFilterHandler}
                        />
                      </div>
                      <>
                        <button
                          className="new_button_style"
                          onClick={handleShow}
                        >
                          Assign Question
                        </button>
                        {show === true && (
                          <AssignQuestions
                            questions={filterQuestionList}
                            financialYearId={financialYearId}
                            fetchquestionApi={getSectorQuestion}
                            entity={entity[0]?.name}
                            show={show}
                            onHide={handleClose}
                            companyEsgData={companyEsgData}
                            handleAssignedDetails={handleAssignedDetails}
                          />
                        )}
                      </>
                      <>
                        <button
                          className="new_button_style"
                          onClick={handleReassignShow}
                        >
                          Reassign Question
                        </button>
                        {reassignShow === true && (
                          <ReAssignQuestions
                            questions={filterQuestionList}
                            financialYearId={financialYearId}
                            fetchquestionApi={getSectorQuestion}
                            entity={entity[0]?.name}
                            reassignShow={reassignShow}
                            onHide={handleReassignClose}
                            companyEsgData={companyEsgData}
                            handleAssignedDetails={handleAssignedDetails}
                          />
                        )}
                      </>
                      {/* )} */}
                      <button
                        className="new_button_style"
                        onClick={() => handleShowImport()}
                      >
                        <i className="fas fa-upload"></i> Import
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {!groupedTopicsData ? (
                    !datas && financialYearId ? (
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="Introduction framwork_2 d-grid justify-content-center">
                            <div className="col-md-12">
                              <div className="heading align-items-center">
                                <h4 className="E_capital font-heading">
                                  No Questionnaire Founddd
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )
                  ) : (
                    <div>
                      <div className="form-group">
                        <div className="access__section mb-3">
                          {groupedTopicsData ? (
                            <Accordion>
                              {Object.keys(groupedTopicsData).map(
                                (data, index) => (
                                  <Accordion.Item
                                    key={index}
                                    eventKey={index.toString()}
                                    style={{
                                      position: "relative",
                                      border: "4px solid #3f88a5",
                                      borderRadius: "5px",
                                      backgroundColor: !loading
                                        ? "rgb(159 65 65 / 5%)"
                                        : "white",
                                    }}
                                    className="my-2"
                                  >
                                    <Accordion.Header
                                      onClick={() =>
                                        handleAccordionToggle(index, data)
                                      }
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
                                      <Accordion className="m-2">
                                        {Object.keys(groupData).map(
                                          (heading, innerIndex) => (
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
                                              <Accordion.Body >

                                                <div className="hstack tab__section_Sector">
                                                  <QuestionTypeTabSection
                                                    setSectorQuestionType={
                                                      setSectorQuestionType
                                                    }
                                                    sectorQuestionType={
                                                      sectorQuestionType
                                                    }
                                                    setFilterQuestionList={
                                                      setFilterQuestionList
                                                    }
                                                    AllQuestionList={
                                                      AllQuestionList
                                                    }
                                                    questionList={
                                                      questionList
                                                    }
                                                  />
                                                  <div className="resize__tabel">
                                                    {hideCol === false ? (
                                                      <img
                                                        className="mx-2"
                                                        src={Maximize}
                                                        alt="Maximize"
                                                        title="Maximize"
                                                        onClick={() =>
                                                          answerWidth()
                                                        }
                                                      />
                                                    ) : (
                                                      <img
                                                        className="mx-2"
                                                        src={Minimize}
                                                        alt="Minimize"
                                                        title="Minimize"
                                                        onClick={() =>
                                                          questionWidth()
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                                <Row>
                                                  <Col
                                                    md={quesWidth}
                                                    hidden={hideCol}
                                                  >
                                                    <div className="Question__type">
                                                      <Table
                                                        striped
                                                        hover
                                                        bordered
                                                        className="m-0"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      >
                                                        <thead>
                                                          <tr className="fixed_tr_section">
                                                            <td
                                                              style={{
                                                                width: 55,
                                                              }}
                                                            >
                                                              Sr No
                                                            </td>
                                                            <td>Question</td>
                                                            <td
                                                              style={{
                                                                width: 55,
                                                              }}
                                                            >
                                                              Status
                                                            </td>
                                                          </tr>
                                                        </thead>
                                                        {questionsDataList &&
                                                          questionsDataList.length >
                                                          0 ? (
                                                          <tbody>
                                                            {questionsDataList &&
                                                              questionsDataList?.map(
                                                                (
                                                                  item,
                                                                  index
                                                                ) => {
                                                                  return (
                                                                    <>
                                                                      <tr
                                                                        className={
                                                                          auditStatus[
                                                                          item
                                                                            .id
                                                                          ]
                                                                        }
                                                                        onClick={(
                                                                          e
                                                                        ) => {
                                                                          if (item['subQuestions'] &&
                                                                            item['subQuestions']
                                                                              .length ===
                                                                            1) {
                                                                            handleRowClick(item.id);
                                                                            setQuestionDataFunction(e, item);
                                                                          } else {
                                                                            // Call another function when item length is zero
                                                                            // anotherFunction();
                                                                          }
                                                                        }}
                                                                        style={{
                                                                          background:
                                                                            (selectedRow ===
                                                                              item.id && !selectedInnerRow)
                                                                              ? "var(--secondaryColor)"
                                                                              : "",
                                                                        }}
                                                                      >
                                                                        <td style={{
                                                                          verticalAlign:
                                                                            "top",
                                                                        }}>
                                                                          <span
                                                                            style={{
                                                                              color:
                                                                                selectedRow ===
                                                                                  item.id
                                                                                  ? "var(--neutralColor)"
                                                                                  : "",
                                                                            }}
                                                                          >

                                                                            {
                                                                              item?.report_id
                                                                            }
                                                                          </span>
                                                                        </td>
                                                                        <td>
                                                                          {
                                                                            item['subQuestions'] &&
                                                                              item['subQuestions']
                                                                                .length >
                                                                              1 ? (
                                                                              <Accordion
                                                                                style={{
                                                                                  margin:
                                                                                    "-8px -11px -8px -7px",
                                                                                }}
                                                                              >
                                                                                <Accordion.Item eventKey="0">
                                                                                  <Accordion.Header>
                                                                                    {item.report_id ==
                                                                                      19 ? "Markets served by the entity" : item.id ==
                                                                                        30 ? "Details of Review of NGRBCs by the Company" : item.id ==
                                                                                          1027 ? "Open-ness of business - Provide details of concentration of purchases and sales with trading houses, dealers, and related parties along-with loans and advances & investments, with related parties, in the following format:" :
                                                                                      item.id == 1040 ? "Water withdrawal, consumption and discharge in areas of water stress (in kilolitres): For each facility / plant located in areas of water stress, provide the following information:" : "Details as at the end of Financial Year:"}
                                                                                  </Accordion.Header>
                                                                                  <Accordion.Body>
                                                                                    <Col
                                                                                      md={
                                                                                        12
                                                                                      }
                                                                                      hidden={
                                                                                        hideCol
                                                                                      }
                                                                                    >
                                                                                      <div className="Question__type">
                                                                                        <Table
                                                                                          striped
                                                                                          hover
                                                                                          bordered
                                                                                          className="m-0"
                                                                                          style={{
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                        >
                                                                                          {/* <thead>
                                                                                            <tr className="fixed_tr_section">
                                                                                              <td
                                                                                                style={{
                                                                                                  width: 55,
                                                                                                }}
                                                                                              >
                                                                                                Sr
                                                                                              </td>
                                                                                              <td>
                                                                                                Question
                                                                                              </td>
                                                                                              <td
                                                                                                style={{
                                                                                                  width: 55,
                                                                                                }}
                                                                                              >
                                                                                                Status
                                                                                              </td>
                                                                                            </tr>
                                                                                          </thead> */}
                                                                                          {item['subQuestions'].length >
                                                                                            1 ? (
                                                                                            <tbody>
                                                                                              {item['subQuestions'].map(
                                                                                                (
                                                                                                  items,
                                                                                                  index
                                                                                                ) => {
                                                                                                  {
                                                                                                    return (
                                                                                                      <>
                                                                                                        <tr
                                                                                                          className={
                                                                                                            auditStatus[
                                                                                                            items
                                                                                                              ?.id
                                                                                                            ]
                                                                                                          }
                                                                                                          onClick={(
                                                                                                            e
                                                                                                          ) => {
                                                                                                            handleInnerRowClick(
                                                                                                              items?.id
                                                                                                            );
                                                                                                            setQuestionDataFunction(
                                                                                                              e,
                                                                                                              items
                                                                                                            );
                                                                                                          }}
                                                                                                          style={{
                                                                                                            background:
                                                                                                              selectedRow ===
                                                                                                                items?.id
                                                                                                                ? "var(--secondaryColor)"
                                                                                                                : "",
                                                                                                          }}
                                                                                                        >
                                                                                                          <td>
                                                                                                            <span
                                                                                                              style={{
                                                                                                                color:
                                                                                                                  selectedInnerRow ===
                                                                                                                    items.id
                                                                                                                    ? "var(--neutralColor)"
                                                                                                                    : "",
                                                                                                                width: 55,
                                                                                                              }}
                                                                                                            >
                                                                                                              {idToLetter(
                                                                                                                index
                                                                                                              )}
                                                                                                            </span>
                                                                                                          </td>
                                                                                                          <td>
                                                                                                            <span
                                                                                                              style={{
                                                                                                                color:
                                                                                                                  selectedRow ===
                                                                                                                    items.id
                                                                                                                    ? "var(--neutralColor)"
                                                                                                                    : "",
                                                                                                              }}
                                                                                                            >
                                                                                                              {
                                                                                                                items?.title
                                                                                                              }
                                                                                                            </span>
                                                                                                          </td>



                                                                                                        </tr>
                                                                                                      </>
                                                                                                    );
                                                                                                  }
                                                                                                }
                                                                                              )}
                                                                                            </tbody>
                                                                                          ) : (
                                                                                            <tbody>
                                                                                              <tr>
                                                                                                <td>
                                                                                                  --
                                                                                                </td>
                                                                                                <td>
                                                                                                  NO
                                                                                                  Questions
                                                                                                  Found
                                                                                                </td>
                                                                                                <td>
                                                                                                  --
                                                                                                </td>
                                                                                              </tr>
                                                                                            </tbody>
                                                                                          )}
                                                                                        </Table>
                                                                                      </div>
                                                                                    </Col>
                                                                                  </Accordion.Body>
                                                                                </Accordion.Item>
                                                                              </Accordion>
                                                                            ) : false ? (
                                                                              <Accordion
                                                                                style={{
                                                                                  margin:
                                                                                    "-8px -11px -8px -7px",
                                                                                }}
                                                                              >
                                                                                <Accordion.Item eventKey="0">
                                                                                  <Accordion.Header>
                                                                                    {
                                                                                      item.title
                                                                                    }
                                                                                  </Accordion.Header>
                                                                                  <Accordion.Body>
                                                                                    <Col
                                                                                      md={
                                                                                        12
                                                                                      }
                                                                                      hidden={
                                                                                        hideCol
                                                                                      }
                                                                                    >
                                                                                      <div className="Question__type">
                                                                                        <Table
                                                                                          striped
                                                                                          hover
                                                                                          bordered
                                                                                          className="m-0"
                                                                                          style={{
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                        >
                                                                                          {item
                                                                                            .question_detail
                                                                                            .length >
                                                                                            0 ? (
                                                                                            <tbody>
                                                                                              {item.question_detail?.map(
                                                                                                (
                                                                                                  items,
                                                                                                  index
                                                                                                ) => {
                                                                                                  if (
                                                                                                    items?.option_type ===
                                                                                                    "row"
                                                                                                  ) {
                                                                                                    return (
                                                                                                      <>
                                                                                                        <tr
                                                                                                          className={
                                                                                                            auditStatus[
                                                                                                            items
                                                                                                              ?.id
                                                                                                            ]
                                                                                                          }
                                                                                                          onClick={(
                                                                                                            e
                                                                                                          ) => {
                                                                                                            handleInnerRowClick(
                                                                                                              items?.id
                                                                                                            );
                                                                                                            // setQuestionDataFunction(
                                                                                                            //   e,
                                                                                                            //   items
                                                                                                            // );
                                                                                                          }}
                                                                                                          style={{
                                                                                                            background:
                                                                                                              selectedRow ===
                                                                                                                items?.id
                                                                                                                ? "var(--secondaryColor)"
                                                                                                                : "",
                                                                                                          }}
                                                                                                        >
                                                                                                          <td>
                                                                                                            <span
                                                                                                              style={{
                                                                                                                color:
                                                                                                                  selectedRow ===
                                                                                                                    items.id
                                                                                                                    ? "var(--neutralColor)"
                                                                                                                    : "",
                                                                                                              }}
                                                                                                            >
                                                                                                              {
                                                                                                                items?.option
                                                                                                              }
                                                                                                            </span>
                                                                                                          </td>
                                                                                                        </tr>
                                                                                                      </>
                                                                                                    );
                                                                                                  }
                                                                                                }
                                                                                              )}
                                                                                            </tbody>
                                                                                          ) : (
                                                                                            <tbody>
                                                                                              <tr>
                                                                                                <td>
                                                                                                  --
                                                                                                </td>
                                                                                                <td>
                                                                                                  NO
                                                                                                  Questions
                                                                                                  Found
                                                                                                </td>
                                                                                                <td>
                                                                                                  --
                                                                                                </td>
                                                                                              </tr>
                                                                                            </tbody>
                                                                                          )}
                                                                                        </Table>
                                                                                      </div>
                                                                                    </Col>
                                                                                  </Accordion.Body>
                                                                                </Accordion.Item>
                                                                              </Accordion>
                                                                            ) : (
                                                                              <span
                                                                                style={{
                                                                                  color:
                                                                                    selectedRow ===
                                                                                      item.id
                                                                                      ? "var(--neutralColor)"
                                                                                      : "",
                                                                                }}
                                                                              >
                                                                                {
                                                                                  item.title
                                                                                }
                                                                              </span>
                                                                            )}
                                                                        </td>
                                                                        <td
                                                                          style={{
                                                                            width: 42,
                                                                          }}
                                                                        >
                                                                          {auditStatus[
                                                                            item
                                                                              .id
                                                                          ] ===
                                                                            "IN_VERIFICATION" ? (
                                                                            <img
                                                                              src={
                                                                                Review
                                                                              }
                                                                              alt="In Verification"
                                                                              srcSet=""
                                                                              style={{
                                                                                width:
                                                                                  "80px",
                                                                              }}
                                                                              className="notAnsered_question w-25"
                                                                              title="In Verification"
                                                                            />
                                                                          ) : auditStatus[
                                                                            item
                                                                              .id
                                                                          ] ===
                                                                            "ANSWERED" ? (
                                                                            <img
                                                                              src={
                                                                                Review
                                                                              }
                                                                              alt="In Review"
                                                                              srcSet=""
                                                                              style={{
                                                                                width:
                                                                                  "45%",
                                                                              }}
                                                                              title="In Review"
                                                                            />
                                                                          ) : auditStatus[
                                                                            item
                                                                              .id
                                                                          ] ===
                                                                            "ACCEPTED" ? (
                                                                            <img
                                                                              src={
                                                                                Verified
                                                                              }
                                                                              alt="Verified"
                                                                              style={{
                                                                                width:
                                                                                  "45%",
                                                                              }}
                                                                              srcSet=""
                                                                              title="Verified"
                                                                            />
                                                                          ) : auditStatus[
                                                                            item
                                                                              .id
                                                                          ] ===
                                                                            "REJECTED" ? (
                                                                            <img
                                                                              src={
                                                                                Reject
                                                                              }
                                                                              alt="Rejected"
                                                                              style={{
                                                                                width:
                                                                                  "45%",
                                                                              }}
                                                                              srcSet=""
                                                                              title="Rejected"
                                                                            />
                                                                          ) : (
                                                                            <img
                                                                              className="notAnsered_question"
                                                                              src={
                                                                                NotAnswered
                                                                              }
                                                                              alt="Not Answered"
                                                                              srcSet=""
                                                                              title="Not Answered"
                                                                            />
                                                                          )}
                                                                        </td>
                                                                      </tr>
                                                                    </>
                                                                  );
                                                                }
                                                              )}
                                                          </tbody>
                                                        ) : (
                                                          <tbody>
                                                            <tr>
                                                              <td>--</td>
                                                              <td>
                                                                NO Questions
                                                                Found
                                                              </td>
                                                              <td>--</td>
                                                            </tr>
                                                          </tbody>
                                                        )}
                                                      </Table>
                                                    </div>
                                                  </Col>
                                                  <Col md={ansWidth}>
                                                    {questionData && (
                                                      <SectorAnswer
                                                        questionData={
                                                          questionData
                                                        }
                                                        handleAnswers={
                                                          handleAnswers
                                                        }
                                                        answers={answers}
                                                        assignedDetail={assignedDetail}

                                                        user_Is_head={
                                                          user_Is_head
                                                        }
                                                        handleOtherTypes={
                                                          handleOtherTypes
                                                        }
                                                        changedData={
                                                          changedData
                                                        }
                                                        meterList={meterList}
                                                        processList={
                                                          processList
                                                        }
                                                        assignedDetails={
                                                          assignedDetails
                                                        }

                                                        // value={answersValue}
                                                        setAnswers={
                                                          setAnswers
                                                        }
                                                        // filterAnswer={filterAnswer}
                                                        setUrl={setUrl}
                                                        setShowModal={
                                                          setShowModal
                                                        }
                                                        setUploadItem={
                                                          setUploadItem
                                                        }
                                                        initalValue={
                                                          initalValue
                                                        }
                                                        questionList={
                                                          questionList
                                                        }
                                                        hideCol={hideCol}
                                                        uploadFile={
                                                          uploadFile
                                                        }
                                                        subQuestionData={
                                                          subQuestionData
                                                        }
                                                      />
                                                    )}

                                                    {submitShow &&
                                                      <div className="Bottom_fooeter">
                                                        {hideCol ? (
                                                          <button
                                                            className="new_button_style"
                                                            style={!answeredChanges ? { backgroundColor: '#d9d9d9' } : {}}
                                                            disabled={!answeredChanges}
                                                            onClick={
                                                              submitHandler
                                                            }
                                                          >
                                                            Submit
                                                          </button>
                                                        ) : (
                                                          <button
                                                            className="new_button_style"
                                                            style={!answeredChanges ? { backgroundColor: '#d9d9d9' } : {}}
                                                            disabled={!answeredChanges}
                                                            onClick={
                                                              submitHandler
                                                            }
                                                          >
                                                            Submit
                                                          </button>
                                                        )}
                                                      </div>}
                                                  </Col>
                                                </Row>
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          )
                                        )}
                                      </Accordion>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                )
                              )}
                            </Accordion>
                          ) : (
                            <Loader />
                          )}
                        </div>

                        <Modal show={showModal}>
                          <div className="modal-lg">
                            <Modal.Header className="justify-content-end">
                              <button
                                variant="outline-dark"
                                onClick={() => setShowModal(false)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
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
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              financialYearId && (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="Introduction framwork_2 d-grid justify-content-center">
                      <div className="col-md-12">
                        <div className="heading align-items-center">
                          <h4 className="E_capital font-heading">
                            No Questionnaire Founddd
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </>
          {/* </section> */}
        </div>
      </div>

      <Modal
        show={showImport}
        onHide={handleCloseImport}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closebutton>
          <Modal.Title>
            <Form.Label>Import Answer</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="formbold-file-input">
            <input type="file" name="file" id="file" />
            <label for="file">
              <div>
                <span className="formbold-drop-file"> Drop files here </span>
                <span className="formbold-or"> Or </span>
                <span className="formbold-browse"> Browse </span>
              </div>
            </label>
          </div>
          <div className="text-end mt-3">
            <NavLink to={"#"}>DownLoad Template</NavLink>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            onClick={handleCloseImport}
          >
            Cancel
          </button>
          <button className="new_button_style">Import</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SectorQuestion;
