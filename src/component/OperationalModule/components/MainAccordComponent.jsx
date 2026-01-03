import { useEffect, useMemo, useRef } from "react";
import { Form, Row, Col, Modal, Button, Table, Card } from "react-bootstrap";
import { FaComments, FaEdit } from "react-icons/fa";
import HistoryAnswerModal from "./HistoryAnswerModal";
import QualitativeComponent from "./QuestionsComponent/QualitativeComponent";
import TabularComponent from "./QuestionsComponent/TabularComponent";
import YesNoComponent from "./QuestionsComponent/YesNoComponent";
import TrendsComponent from "./QuestionsComponent/TrendsComponent";
import { LocationField, PeriodsField } from "../../CarbonFootPrinting/common/FormComponents";
import { handlePeriodChange, generateTimePeriodOptions, getPeriodValue } from "../../../utils/PeriodCalculationUtils";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { useState } from "react";
import ChatModal from "./ChatModal";
import { authenticationService } from "../../../_services/authentication";
import swal from "sweetalert";
import { useFrameworks, useFinancialYears } from "../../../hooks/useApiData";
import DocumentUploadModal from "../../Documents/DocumentUploadModal";
import ViewEditDocument from "../../Documents/ViewEditDocument";
import PreviewDocument from "../../Documents/PreviewDocument";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faEye } from "@fortawesome/free-solid-svg-icons";


const MainAccordComponent = ({
  getAuditListing,
  apiData,
  currentUserId,
  documents,
  getDueDateOverrides,
  dueDateOverrides,
  menu,
  assignedTo,
  allSourceOptions,
  financeObject,
  activeIndex,
  item,
  index,
  handleAccordionClick,
  startingMonth,
  units,
  selectedQuestions,
  setSelectedQuestions,
  scheduledDueDate,
  periodLockData
}) => {

  const QUESTION_TYPE_QUALITATIVE = 'qualitative';
  const QUESTION_TYPE_QUANTITATIVE = 'quantitative';
  const QUESTION_TYPE_QUANTITATIVE_TRENDS = 'quantitative_trends';
  const QUESTION_TYPE_TABULAR = 'tabular_question';
  const QUESTION_TYPE_YES_NO = 'yes_no';

  let currentUser = authenticationService.currentUserSubject.getValue();
  let currentUserName = currentUser.data.user.dataValues.first_name + " " + currentUser.data.user.dataValues.last_name

  const isAudit = (menu === 'audit');

  const currentQuestion = useMemo(() => {
    return isAudit ? item?.question : item;
  }, [isAudit, item]);

  const viewEditDocumentRef = useRef(null);
  const previewDocumentRef = useRef(null);
  const [currentDocument, setCurrentDocument] = useState(null);

  const [updatedAt, setUpdatedAt] = useState("");
  const [edit, setEdit] = useState(false);
  const [showData, setShowData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignIsModalOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [historyAnswer, setHistoryAnswer] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [applicable, setApplicable] = useState(false);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [showChatBox, setshowChatBox] = useState(false);
  const [ansForChat, setAnsForChat] = useState([]);
  const [confirmTarget, setConfirmTarget] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exceedMessage, setExceedMessage] = useState("");
  const [matchedAnswer, setMatchedAnswer] = useState();
  const [answer, setAnswer] = useState({
    financialYearId: financeObject,
    questionId: currentQuestion?.questionId,
    questionTitle: currentQuestion?.title,
    sourceId: null,
    fromDate: "",
    moduleId: currentQuestion?.moduleId,
    toDate: "",
    notApplicable: null,
    answer: "",
    proofDocument: [],
    note: [[]],
    questionType: currentQuestion?.questionType,
    frequency: currentQuestion?.frequency,
    status: "NOT ANSWERED"
  });

  const [matchedTargetAnswer, setMatchedTargetAnswer] = useState();
  const [previousMonthMatchedAnswer, setPreviousMonthMatchedAnswer] = useState();

  const [auditorRemarks, setAuditorRemarks] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [userForRole, setUserForRole] = useState();

  const [ansId, setAnsId] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [flattenedSourceOptions, setFlattenedSourceOptions] = useState();

  const [latestAnswer, setLatestAnswer] = useState();
  const [answersByLocation, setAnswersByLocation] = useState();

  const [targetAnswers, setTargetAnswers] = useState();
  const [targetAnswersByLocation, setTargetAnswersByLocation] = useState();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [auditorId, setAuditorId] = useState();
  const [remark, setRemark] = useState("");
  const [note, setNote] = useState([]);
  const [assignedToDetails, setAssignedToDetails] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedValue, setSelectedValue] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredDocs, setFilteredDocs] = useState();
  const [emissionData, setEmissionData] = useState([]);

  const frameworks = useFrameworks();

  const financialYearOptions = useFinancialYears().map(fy => ({value: fy.id, label: fy.financial_year_value}));

  let allTimePeriodOptions = null;
  if (currentQuestion.frequency === 'CUSTOM') {
    allTimePeriodOptions = generateTimePeriodOptions(currentQuestion.answerFrequency, startingMonth);
  } else {
    allTimePeriodOptions = [{
      value: currentQuestion.frequency,
      label: currentQuestion.frequency
    }]
  }

  const unit =
    units &&
    units.length &&
    units.find((items) => items?.catagoryId == currentQuestion?.categoryId);

  /**
   * Question will be readonly in the following cases
   * 
   * 1. Selected menu is 'Audit'
   * 2. Period is locked by Admin
   * 3. fromDate is not selected for 'CUSTOM' frequency type
   * 4. Question is formula based i.e. auto calculated from other questions
   * 5. Question is not assigned to the current user
   * 6. Due Date has expired
   */
  const isAssigned = (assignedToDetails?.assignedTo?.length > 0 && assignedToDetails.assignedTo.some((id) => parseInt(id, 10) === currentUserId));
  const isExpiredDueDate = (assignedToDetails?.dueDate && new Date(assignedToDetails.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
  const isCustomAndHasFromDate = isAudit && currentQuestion?.frequency === "CUSTOM" && !fromDate;

  const isReadOnly = (
    ['470'].includes(String(currentQuestion?.questionId)) ||
    isAudit || 
    isLocked || 
    isCustomAndHasFromDate || 
    currentQuestion?.isFormulaBased || 
    !isAssigned ||
    isExpiredDueDate
  );

  // Update your existing modal functions:
  const openViewEditModal = async (document) => {
    setCurrentDocument(document);
    viewEditDocumentRef.current?.show();
  };

  const openPreviewModal = (document) => {
    setCurrentDocument(document);
    previewDocumentRef.current?.show();
  };

  const updateLocationAndPeriod = (location, answersByLocation) => {
    setSelectedLocation(location);

    const answersForLocation = getAnswersForLocation(answersByLocation, location);

    const periodOptions = getTimePeriodOptions(answersForLocation);
    const period = periodOptions?.[0];

    setSelectedPeriod(period?.value);
  };


  const handleSourceSelect = (locationId) => {
    const selectedOption = flattenedSourceOptions.find(
      (option) => option.id === locationId
    );

    updateLocationAndPeriod(selectedOption, answersByLocation);
  };

  const handleHistoryClose = () => setShowHistoryModal(false);

  const handleShowAssign = (item, details) => {
    setAssignIsModalOpen(true);
    setDetails(details);
  };

  useEffect(() => {
    if (!periodLockData) return;

    const check = periodLockData.find((item) => item.fromDate === fromDate && item.toDate === toDate);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.id;
    if (check) {
      if (check && check.allowedUsers.includes(userId)) {
        setIsLocked(false);
      }else {
        setIsLocked(true);
      }
    } else {
      setIsLocked(false);
    }
  }, [periodLockData, fromDate, toDate]);

  useEffect(() => {
    if (selectedPeriod &&
        financeObject &&
        financialYearOptions?.length > 0 &&
        currentQuestion?.frequency === 'CUSTOM' &&
        currentQuestion?.answerFrequency &&
        setToDate &&
        setFromDate) {
      handlePeriodChange(selectedPeriod, financeObject, financialYearOptions, currentQuestion?.answerFrequency, setFromDate, setToDate)
    }

  }, [selectedPeriod, financeObject, financialYearOptions, currentQuestion?.answerFrequency, currentQuestion?.frequency]);

  const getReportingAnswer = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getReportingAnswer`,
      {},
      { financialYearId: financeObject, questionId: currentQuestion?.questionId },
      "GET"
    );

    if (isSuccess) {
      let answers = data?.answers;

      if (isAudit) {
        const auditAnswerIds = new Set(item?.matchingAuditors.map(audit => Number(audit?.answerId)).filter(ansId => !isNaN(ansId)));
        answers = answers.filter(ans => auditAnswerIds.has(ans.id));
      }

      const byLocation = answers.reduce((acc, ans) => {
        const key = `${ans.financialYearId}-${ans.questionId}-${ans.sourceId}-${ans.subLocationId ?? 'NULL'}`;

        if (!acc.has(key)) {
          acc.set(key, []);
        }

        acc.get(key).push(ans);

        return acc;
      }, new Map());

      setLatestAnswer(answers);
      setAnswersByLocation(byLocation);
      
      return {
        answers,
        answersByLocation: byLocation
      }
    }

    return {
      answers: [],
      answersByLocation: {}
    }
  };

  const getTargetAnswer = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTargerAnswer`,
      {},
      { financialYearId: financeObject, questionId: currentQuestion?.questionId },
      "GET"
    );

    if (isSuccess) {
      let answers = data?.answers;

      const byLocation = answers.reduce((acc, ans) => {
        const key = `${ans.financialYearId}-${ans.questionId}-${ans.sourceId}-${ans.subLocationId ?? 'NULL'}`;

        if (!acc.has(key)) {
          acc.set(key, []);
        }

        acc.get(key).push(ans);

        return acc;
      }, new Map());

      setTargetAnswers(answers);
      setTargetAnswersByLocation(byLocation);
      
      return {
        answers,
        answersByLocation: byLocation
      }
    }

    return {
      answers: [],
      answersByLocation: {}
    }
  };

  async function getChats() {
    if (!selectedLocation || !financeObject) return;

    let qId = currentQuestion.questionId
   
    let filter = { 
      currentUserId, 
      financialYearId: financeObject, 
      questionId: qId, 
      sourceId: selectedLocation.parentId,
      subLocationId: selectedLocation.subLocationId,
      fromDate,
      toDate,
    }

    if (currentQuestion.frequency !== 'CUSTOM') {
      delete filter.fromDate;
      delete filter.toDate;
    }

    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reporting/chats`,
      {},
      filter,
      "GET"
    );

    if (isSuccess) {
      setAnsForChat(data?.chats);
      setUserForRole(data.user)
    }
  }

  async function getPaticipants() {
    if (!selectedLocation || !financeObject) return;

    let qId = currentQuestion.questionId;
    const dataOwnerId = Array.isArray(assignedToDetails?.assignedToDetails) ? assignedToDetails.assignedTo[0] : [];

    let filter = { 
      dataOwnerId,
      financialYearId: financeObject,
      questionId: qId,
      sourceId:selectedLocation.parentId,
      subLocationId:selectedLocation.subLocationId,
      period:selectedPeriod,
      fromDate,
      toDate
    }
    
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reporting/chats/participants`,
      {},
      filter ,
      "GET"
     
    );
    if(isSuccess){
      setParticipants(data)
    }
  }

  useEffect(()=>{
    getChats();
    getPaticipants();
  },[fromDate, toDate, financeObject, selectedLocation]);

  useEffect(() => {
    const frequency = currentQuestion?.frequency;
    const questionId = currentQuestion?.questionId;
    
    const foundAssigned = assignedTo?.find((d) => d.questionId === questionId);

    const foundSchedule = scheduledDueDate?.find((d) =>
      frequency === "CUSTOM"
        ? d?.periodRecord?.toDate === toDate && d?.periodRecord?.fromDate === fromDate
        : frequency === d?.frequency
    );

    let overrideRequest;
    if (financeObject && selectedLocation && fromDate && toDate && questionId && dueDateOverrides) {
      const key = `${financeObject}-${selectedLocation.parentId}-${fromDate}-${toDate}-${questionId}`;
      overrideRequest = dueDateOverrides[key];
    }

    if (!foundSchedule) {
      setAssignedToDetails(foundAssigned);
      return;
    }

    const now = new Date();
    const dueDate = overrideRequest?.dueDateTime ? new Date(overrideRequest.dueDateTime) : null;

    if (overrideRequest?.status === "approved" && dueDate && !isNaN(dueDate) && dueDate > now) {
      setAssignedToDetails({ ...foundAssigned, dueDate: dueDate });
    } else if (overrideRequest?.status === "pending") {
      setAssignedToDetails({ ...foundAssigned, dueDate: foundSchedule?.fixedDate, overrideRequested: true });
    } else {
      setAssignedToDetails({ ...foundAssigned, dueDate: foundSchedule?.fixedDate });
    }
  }, [assignedTo, item, fromDate, toDate, scheduledDueDate, menu, financeObject, selectedLocation, selectedPeriod, dueDateOverrides]);

  useEffect(() => {
    if (item) {
      if (isAudit) {
        setAuditorId(item?.auditorId?.auditerId);
      } else {
        setAuditorId(undefined);
      }
    }
  }, [item, fromDate, toDate, scheduledDueDate, menu]);

  const normalizeNote = (note) => {
    if (typeof note === "string") return [[note]];
    if (Array.isArray(note) && Array.isArray(note[0])) return note;
    return [[""]];
  };

  const getPreviousMonthRange = (fromDate, toDate) => {
    if (fromDate && toDate) {
      const parseDate = (dateStr) => {
        const [year, month] = dateStr.split("-").map(Number);
        return new Date(year, month - 1); // Month is 0-indexed in JavaScript
      };

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
      };

      const from = parseDate(fromDate);
      const to = parseDate(toDate);

      // Subtract one month
      from.setMonth(from.getMonth() - 1);
      to.setMonth(to.getMonth() - 1);

      return {
        from: formatDate(from),
        to: formatDate(to),
      };
    }
  };

  const buildBaseAnswer = (matchedAnswer) => {
    return {
      financialYearId: financeObject,
      sourceId: selectedLocation?.parentId,
      subLocationId:selectedLocation?.subLocationId,
      fromDate,
      toDate,
      note: normalizeNote(matchedAnswer?.note),
      questionId: currentQuestion?.questionId,
      questionTitle: currentQuestion?.title,
      moduleId: currentQuestion?.moduleId,
      status: matchedAnswer?.status ?? null,
      notApplicable: matchedAnswer?.notApplicable ?? false,
      proofDocument: (() => {
        if (Array.isArray(matchedAnswer?.proofDocument)) {
          return matchedAnswer.proofDocument;
        } else {
          // If matchedAnswer.proofDocument is not an array, set it to an empty 2D array
          return [];
        }
      })(),
    };
  };

  const initializeAnswer = () => {
    const qId = currentQuestion?.questionId;

    if (!qId) {
      setIsDataInitialized(true); // Mark as initialized even if no data
      return;
    }

    const answersForLocation = getAnswersForLocation(answersByLocation, selectedLocation);

    const matchedAnswer = currentQuestion?.frequency === 'CUSTOM' ? 
      answersForLocation?.find(ans => ans.fromDate === fromDate && ans.toDate === toDate) : answersForLocation?.[0];

    setMatchedAnswer(matchedAnswer);

    if (currentQuestion?.questionType === QUESTION_TYPE_QUANTITATIVE_TRENDS) {
      const {from: previousMonthFromDate, to: previousMonthToDate} = getPreviousMonthRange(fromDate, toDate);
      const previousMonthMatchedAnswer = currentQuestion?.frequency === 'CUSTOM' ? 
        answersForLocation?.find(ans => ans.fromDate === previousMonthFromDate && ans.toDate === previousMonthToDate) : answersForLocation?.[0];

      setPreviousMonthMatchedAnswer(previousMonthMatchedAnswer);
      
      if (targetAnswersByLocation) {
        const targetAnswersForLocation = getTargetAnswersForLocation(targetAnswersByLocation, selectedLocation);
        const matchedTargetAnswer = currentQuestion?.frequency === 'CUSTOM' ?
          targetAnswersForLocation?.find(ans => ans.fromDate === fromDate && ans.toDate === toDate) : targetAnswersForLocation?.[0];
        
        setMatchedTargetAnswer(matchedTargetAnswer);
      }
    }

    // Answer Id
    setAnsId(matchedAnswer?.id);

    // Auditor Remarks
    setAuditorRemarks(matchedAnswer?.auditorRemarks);

    // history
    setHistoryAnswer(matchedAnswer?.historyAnswer ?? []);

    // applicable toggle
    setApplicable(!matchedAnswer?.notApplicable);

    // Answer Status
    setStatus(matchedAnswer?.status);

    // final note update
    setNote(normalizeNote(matchedAnswer?.note));

    setUpdatedAt(matchedAnswer?.updatedAt);

    // final answer update
    setAnswer((prev) => ({
      ...prev,
      ...buildBaseAnswer(matchedAnswer),
    }));

    setIsDataInitialized(true);
  };

  useEffect(() => {
    setStatus("Not Answered");
    setAnsId(null);
    setAuditorRemarks(null);
    setIsDataInitialized(false);

    setAnswer((prev) => ({
      ...prev,
      sourceId: selectedLocation?.parentId,
      subLocationId: selectedLocation?.subLocationId
    }));

    if (currentQuestion?.frequency === 'CUSTOM') {
      setAnswer((prev) => ({
        ...prev,
        fromDate: fromDate,
        toDate: toDate
      }));
    }

    if (selectedLocation && (currentQuestion?.frequency !== 'CUSTOM' || (fromDate && toDate)) && financeObject && answersByLocation) {
      initializeAnswer();
    } else {
      setIsDataInitialized(true);
    }
  }, [answersByLocation, targetAnswersByLocation, fromDate, toDate, item, financeObject, selectedLocation]);

  useEffect(() => {
    setFilteredDocs(matchedAnswer?.proofDocument?.[currentPage]);
  }, [matchedAnswer, currentPage]);

  const getSourceOptions = (answers) => {
    if (isAudit) {
      // Find all unique source combinations that have answers
      const answeredSources = new Set();

      answers.forEach((ans) => {
        if (ans.subLocationId) {
          // Add sublocation entry
          answeredSources.add(`${ans.sourceId}-${ans.subLocationId}`);
        } else {
          // Add parent source entry
          answeredSources.add(`${ans.sourceId}`);
        }
      });

      // Filter source options to only include those with answers
      const filtered = allSourceOptions.filter((option) => {
        if (option.isParent) {
          return answeredSources.has(`${option.parentId}`);
        } else {
          return answeredSources.has(`${option.parentId}-${option.subLocationId}`);
        }
      });

      setFlattenedSourceOptions(filtered);
      return filtered;
    } else {
      setFlattenedSourceOptions(allSourceOptions);
      return allSourceOptions;
    }
  };

  const getAnswersForLocation = (answersByLocationMap, location) => {
    const key = `${financeObject}-${currentQuestion.questionId}-${location.parentId}-${location.subLocationId ?? 'NULL'}`;
    return answersByLocationMap.get(key);
  };

  const getTargetAnswersForLocation = (targetAnswersByLocationMap, location) => {
    const key = `${financeObject}-${currentQuestion.questionId}-${location.parentId}-${location.subLocationId ?? 'NULL'}`;
    return targetAnswersByLocationMap.get(key);
  };

  const getTimePeriodOptions = (answers) => {
    if (isAudit && currentQuestion.frequency === 'CUSTOM') {
      const filtered = allTimePeriodOptions.filter((tp) =>
        answers.some((mafl) => {
          const periodValue = getPeriodValue(mafl.fromDate, mafl.toDate);
          return tp.label === periodValue;
        })
      );

      setTimePeriodOptions(filtered);
      return filtered;
    } else {
      setTimePeriodOptions(allTimePeriodOptions);
      return allTimePeriodOptions;
    }
  };

  const cancelTarget = () => {
    setConfirmTarget(false);
  };

  const handleEditClick = () => {
    if (isReadOnly) {
      return;
    }
    setEdit(!edit);
  };

  const handleRemarkChange = (e) => {
    const newRemark = e.target.value;
    setRemark(newRemark);
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await submitAnswer();
  };

  const initialize = async () => {
    const { answers, answersByLocation: byLocation } = await getReportingAnswer();

    if (currentQuestion?.questionType === QUESTION_TYPE_QUANTITATIVE_TRENDS) {
      await getTargetAnswer();
    }

    const sourceOptions = getSourceOptions(answers);
    const location = sourceOptions?.[0];
    updateLocationAndPeriod(location, byLocation);
  }

  useEffect(() => {
    setIsDataInitialized(false);
    if (activeIndex === index && financeObject && currentQuestion) {
      initialize();
    }
  }, [activeIndex, index, financeObject, currentQuestion]);

  useEffect(() => {
    if (assignedToDetails?.assignedToDetails?.length > 0) {
      const assignedDetail = assignedToDetails.assignedToDetails.find(
        (detail) => parseInt(detail.id, 10) === currentUserId
      );
      if (assignedDetail) {
        setSelectedValue(assignedDetail.first_name);
      }
    }
  }, [assignedToDetails, currentUserId]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      financialYearId: financeObject,
      sourceId: selectedLocation?.parentId,
      subLocationId:selectedLocation?.subLocationId,
      fromDate,
      toDate,
      questionId: currentQuestion?.questionId,
      questionTitle: currentQuestion?.title,
      moduleId: currentQuestion?.moduleId,
      status: matchedAnswer?.status,
      notApplicable: matchedAnswer?.notApplicable ?? false,
      note: normalizeNote(matchedAnswer?.note),
      proofDocument: (() => {
        if (Array.isArray(matchedAnswer?.proofDocument)) {
          return matchedAnswer.proofDocument;
        } else {
          // If matchedAnswer.proofDocument is not an array, set it to an empty 2D array
          return [];
        }
      })(),
    }));
  }, [financeObject, currentQuestion, selectedLocation, fromDate, toDate, matchedAnswer]);

  const handleApplicableChange = (value) => {
    setApplicable(value);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      notApplicable: !value,
    }));
  };
 
  const handleAccept = async () => {
    const { isSuccess, error, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}validateAnswers`,
      {},
      {
        questionTitle: currentQuestion?.title,
        questionId: currentQuestion?.questionId,
        answerId: Number(ansId),
        questionType: currentQuestion?.questionType,
        remark: remark,
        validation: "ACCEPTED",
        financialYearId: financeObject,
      },
      "POST"
    );

    if (isSuccess) {
      getAuditListing();
    }

    if (error) {
      swal({
        icon: "error",
        title: data.message,
        timer: 1000,
      });
    }
  };

  const handleReject = async () => {
    if (remark) {
      const { isSuccess, error, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}validateAnswers`,
        {},
        {
          questionTitle: currentQuestion?.title,

          questionId: currentQuestion?.questionId,
          answerId: Number(ansId),
          questionType: currentQuestion?.questionType,
          remark: remark,
          validation: "REJECTED",
          financialYearId: financeObject,
        },
        "POST"
      );

      if (isSuccess) {
        getAuditListing();
      }

      if (error) {
        swal({
          icon: "error",
          title: data.message,
          timer: 1000,
        });
      }
    } else {
      swal({
        icon: "error",
        title: "Please enter remark",
        timer: 1000,
      });
    }
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote([[newNote]]);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      note: [[newNote]],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (answer.status === "ACCEPTED") {
      setShowConfirmModal(true);
      return;
    }

    submitAnswer();
  };

  const submitAnswer = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}saveAnswerReportingQuestion`,
      {},
      answer,
      "POST"
    );
    if (isSuccess) {
      await getReportingAnswer();
      handleEditClick();
    }
  };
  
  const handleSend = async (msgData, sendmailTo) => {
    let qId = currentQuestion.questionId
    const dataOwnerId = Array.isArray(assignedToDetails?.assignedToDetails) ? assignedToDetails.assignedTo[0] : [];
    let questionDetailsForMail = {
      financialYear: financialYearOptions.find(fy => fy.value === financeObject).label,
      title: currentQuestion.title || '',
      answerFrequency: currentQuestion.answerFrequency,
      questionFrequency: currentQuestion.frequency,
      fromDate,
      toDate,
      location: selectedLocation,
    }
    const dataToSend = {
      content: msgData.content,
      mentions: msgData.mentions,
      questionId: qId,
      financialYearId: financeObject,
      sourceId: selectedLocation.parentId,
      subLocationId: selectedLocation.subLocationId,
      fromDate,
      toDate,
      period: selectedPeriod,
      dataOwnerId,
      currentUserName,
      questionDetailsForMail,
    };

    if (item.frequency !== 'CUSTOM') {
      delete dataToSend.fromDate;
      delete dataToSend.toDate;
    }
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reporting/chats`,
      {},
      dataToSend,
      "POST",
      undefined,
      false
    )
  }

  const requestOverride = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}dueDate/requestOverride`,
      {},
      {
        overrideRequests: [
          {
            financialYearId: financeObject,
            questionId: item?.questionId,
            sourceId: selectedLocation.parentId,
            subLocationId: selectedLocation.subLocationId,
            fromDate: fromDate,
            toDate: toDate,
          }
        ]
      },
      "POST"
    );

    if (isSuccess) {
      getDueDateOverrides();
    }
  };  

  const getEmissionCalculation = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getEmissionCalculation`,
      {},
      {
        questionId: currentQuestion.questionId,
        unit: 'KG',
        value: answer?.answer,
        financialYearId: financeObject,
      },
      "GET"
    );
    if (isSuccess) {
      setEmissionData(data?.data);
    }
  };

  useEffect(() => {
    if (currentQuestion?.questionId === 451 || currentQuestion?.questionId === 452)
      if (answer?.answer) {
        getEmissionCalculation();
      }
  }, [answer]);


  const isSelected = selectedQuestions.includes(item?.questionId);

  // Handle checkbox click without triggering accordion
  const handleCheckboxClick = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      // If already selected, remove it (uncheck)
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      // If not selected, add it to the array (check)
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleDoubleClick = (data) => {
    data = String(data);
    if (data?.trim() !== "") {
      // Check if data is not an empty string
      setShowData(data);
      setIsModalOpen(true);
    }
  };

  const matchingAuditors = item?.matchingAuditors?.find(d => d.answerId === ansId);
  const isCurrentAuditor = matchingAuditors?.auditerId === currentUserId;

  return (
    <div className="accordion-item my-3" key={index}>
      <h2 className="accordion-header" id={`heading${index}`}>
        <button
          className="accordion-button d-flex justify-content-between align-items-center"
          type="button"
          style={{
            backgroundColor: "#BFD7E0",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.7rem 1rem",
            width: "100%",
            position: "relative",
          }}
          onClick={() => {
            handleAccordionClick(index);
          }}

          aria-expanded={activeIndex === index}
          aria-controls={`collapse${index}`}
        >
          {/* Left Checkmark */}
          {!isAudit && (
            <div
              style={{
                flex: "0 0 30px",
                marginRight: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCheckboxClick(item?.questionId)}
                style={{
                  position: "relative",
                  width: "20px",
                  height: "20px",
                  backgroundColor: isSelected
                    ? "rgb(63, 136, 165)"
                    : "transparent",
                  borderRadius: "3px",
                  border: isSelected
                    ? "1px solid rgb(63, 136, 165)"
                    : "1px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Title section */}
          <div style={{ flex: "0 0 60%" }}>
            <span style={{ color: "black", marginBottom: "10px" }}>
              {index + 1}. {item.title.replace(/\b(Yes|No)\b/g, "")}
            </span>
          </div>

          {/* Assigned To section */}
          <div style={{ flex: "1", textAlign: "right" }}>
            {assignedToDetails?.assignedToDetails && (
              <div style={{ color: "grey", fontSize: "12px" }}>
                {"Assigned To :- "}
                {assignedToDetails.assignedToDetails.length > 2 ? (
                  <>
                    {assignedToDetails.assignedToDetails
                      .slice(0, 2)
                      .map((detail) => detail?.first_name)
                      .filter((name) => name)
                      .join(", ")}{" "}
                    <a
                      style={{
                        background: "none",
                        border: "none",
                        textDecoration: "underline !important",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "blue",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowAssign(
                          item,
                          assignedToDetails.assignedToDetails
                        );
                      }}
                    >
                      View More
                    </a>
                  </>
                ) : (
                  assignedToDetails.assignedToDetails
                    .map((detail) => detail?.first_name)
                    .filter((name) => name)
                    .join(", ")
                )}
              </div>
            )}
          </div>

          {/* Status and toggle button section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            {/* 
              Status tooltip: 
              TODO: Enable Later 
            */}
            {/* <div style={{ marginRight: "15px" }}>
              <StatusWithTooltip status={status} />
            </div> */}

            {/* Plus/minus button */}
            <div style={{ marginLeft: "10px" }}>
              <span
                className="btn btn-sm btn-outline-secondary"
                style={{
                  fontWeight: "bold",
                  border: "1.5px solid",
                  borderColor: "grey",
                  padding: "0.25rem 0.5rem",
                  minWidth: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
          </div>
        </button>
      </h2>

      <div
        id={`collapse${index}`}
        className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""
          }`}
        aria-labelledby={`heading${index}`}
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div
            className=""
            style={{
              background: "#E3EBED",
              height: "40px",
              width: "107%",
              marginTop: "-4%",
              marginLeft: "-4.5%",
            }}
          ></div>
          <div className="p-3 ">
            {isAssigned && isLocked && (
              <div
                style={{
                  backgroundColor: "#FFF3CD",
                  border: "1px solid #FFD700",
                  borderRadius: "6px",
                  padding: "8px 15px",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                <span style={{ color: "#856404", fontSize: "14px", fontWeight: "500" }}>
                  This period is locked by the administrator. Please contact the admin to unlock it.
                </span>
              </div>
            )}
            <div
              style={{
                border: "1px solid grey",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "2%",
                display: "flex",
                justifyContent: "space-between", // This will space out the child divs
                alignItems: "center", // This will vertically align the child divs in the middle
              }}
            >
              {flattenedSourceOptions?.length > 0 && (
                <Col md={3}>
                  <LocationField
                    value={selectedLocation?.id ?? ''}
                    onChange={handleSourceSelect}
                    options={flattenedSourceOptions}
                    required={true}
                    levelName="Source"
                  />
                </Col>
              )}

              {timePeriodOptions && timePeriodOptions.length > 0 && 
                financialYearOptions && financeObject && startingMonth && 
                <Col md={3}>
                  <PeriodsField
                    value={selectedPeriod}
                    onChange={(value) => setSelectedPeriod(value)}
                    options={timePeriodOptions}
                  />
                </Col>
              }

              <div
                style={{
                  width: "40%",
                  textAlign: "right",
                  marginTop: "25px",
                }}
              >
              
              <Button
                  variant=""
                  style={{
                    padding: "8px 30px",
                    marginRight: 10,
                    backgroundColor: "transparent",
                    borderRadius: "5px",
                    borderColor: "#3F88A5",
                    fontSize: "14px",
                    fontFamily: "Open Sans",
                    fontWeight: "700",
                  }}
                  onClick={() => setshowChatBox(true)}
                >
                  <FaComments size={22} />

                </Button>

                <Button
                  variant=""
                  style={{
                    padding: "8px 30px",
                    marginRight: 0,
                    backgroundColor: "transparent",
                    borderRadius: "5px",
                    borderColor: "#3F88A5",
                    fontSize: "14px",
                    fontFamily: "Open Sans",
                    fontWeight: "700",
                  }}
                  onClick={() => setShowHistoryModal(true)}
                >
                  History
                </Button>
              </div>

              <HistoryAnswerModal
                showHistoryModal={showHistoryModal}
                handleHistoryClose={handleHistoryClose}
                historyAnswer={historyAnswer}
                question={item}
              />

             <ChatModal
                show={showChatBox} 
                onHide={() => setshowChatBox(false)}
                title="Chat"
                participants={participants.length && participants}
                initialMessages={ansForChat}
                ansStatus={status}
                currentUserId={currentUserId}
                onSend={handleSend}
                userForRole={userForRole}
                questionId={currentQuestion?.questionId}
                financialYearId={financeObject}
                sourceId={selectedLocation?.parentId}
                fromDate={fromDate}
                toDate={toDate}
                item={item}
              />

            </div>
            <div
              style={{
                border: "1px solid grey",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "2%",
              }}
            >
              <Form>
                {/* First Row with 5 input texts */}
                <Row className="mb-3">
                  <Col className="col-17">
                    <Form.Group controlId="formInput1">
                      <Form.Label className="custom-label">
                        Assigned By
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        style={{ backgroundColor: "#Dfebef" }}
                        value={
                          assignedToDetails?.assignedByDetails?.[0]
                            ?.first_name || ""
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col className="col-17">
                    <Form.Group controlId="formInput2">
                      <Form.Label className="custom-label">
                        Assigned To
                      </Form.Label>
                      <Form.Control
                        as="select"
                        className="form-control"
                        style={{ backgroundColor: "#Dfebef" }}
                        value={selectedValue}
                        onChange={handleChange}
                        readOnly
                      >
                        {selectedLocation && assignedToDetails?.assignedToDetails?.map(
                          (detail, detailIndex) => {
                            let sourceIdsArray = Array.isArray(
                              detail?.source_ids
                            )
                              ? detail.source_ids
                              : typeof detail?.source_ids === "string"
                                ? JSON.parse(detail.source_ids)
                                : [];

                            if (
                              sourceIdsArray.some((id) => id === selectedLocation.parentId)
                            ) {
                              return (
                                <option key={detailIndex} value={detail?.first_name}>
                                  {detail?.first_name}
                                </option>
                              );
                            }
                            return null; // Return null if the condition is not met
                          }
                        )}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="col-17">
                    <Form.Group controlId="formInput3">
                      <Form.Label className="custom-label">
                        Assign Date
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        style={{ backgroundColor: "#Dfebef" }}
                        value={
                          assignedToDetails?.createdAt
                            ? new Date(
                              assignedToDetails.createdAt
                            ).toLocaleDateString("en-GB")
                            : ""
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col className="col-17">
                    <Form.Group controlId="formInput4">
                      <Form.Label className="custom-label">Due Date</Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        style={{ backgroundColor: "#Dfebef" }}
                        value={
                          assignedToDetails?.dueDate
                            ? new Date(
                              assignedToDetails.dueDate
                            ).toLocaleDateString("en-GB")
                            : ""
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  {isAssigned && isExpiredDueDate && (
                      (() => {
                        const hasPendingOverride = assignedToDetails?.overrideRequested === true;
                        return (
                          <Col className="col-13 d-flex flex-column justify-content-end">
                            <button
                              onClick={requestOverride}
                              className={`esg_button_style ${
                                hasPendingOverride ? "btn-warning" : "btn-primary"
                              }`}
                              disabled={hasPendingOverride}
                            >
                              {hasPendingOverride ? "Override Requested" : "Request Override"}
                            </button>
                          </Col>
                        );
                      })()
                    )}

                  <Col className="col-17">
                    <Form.Group controlId="formInput5">
                      <Form.Label className="custom-label">
                        Answered Date
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        style={{ backgroundColor: "#Dfebef" }}
                        value={
                          updatedAt
                            ? new Date(updatedAt).toLocaleDateString("en-GB")
                            : ""
                        }
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Second Row with 4 input texts */}
                {auditorRemarks &&
                  ansId &&
                  auditorRemarks.map((user, userIndex) => {
                    return (
                      <Row className="mb-3" key={`auditor-${user.id}-${userIndex}`}>
                        <Col>
                          <Form.Group controlId={`formInput6-${user.id}`}>
                            <Form.Label className="custom-label">
                              Audited By
                            </Form.Label>
                            <Form.Control
                              type="text"
                              style={{ backgroundColor: "#Dfebef" }}
                              value={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId={`formInput7-${user.id}`}>
                            <Form.Label className="custom-label">
                              Audited Date
                            </Form.Label>
                            <Form.Control
                              type="text"
                              className="form-control"
                              style={{ backgroundColor: "#Dfebef" }}
                              value={
                                user
                                  ? new Date(
                                    user?.auditedDate
                                  ).toLocaleDateString()
                                  : ""
                              }
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId={`formInput8-${user.id}`}>
                            <Form.Label className="custom-label">
                              Question Status
                            </Form.Label>
                            <Form.Control
                              type="text"
                              style={{ backgroundColor: "#Dfebef" }}
                              value={user?.status || "Accepted"}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId={`formInput9-${user.id}`}>
                            <Form.Label className="custom-label">
                              Auditor Remark
                            </Form.Label>
                            <Form.Control
                              type="text"
                              style={{ backgroundColor: "#Dfebef" }}
                              value={user?.remark}
                              onDoubleClick={() => handleDoubleClick(user?.remark)}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
              </Form>
            </div>
            {isDataInitialized && (currentQuestion?.applicableCheck === 1) && (
                <div className="checkkbox">
                  <div
                    className="checkkbox d-flex mt-4"
                    style={{ marginLeft: "5px" }}
                  >
                    <div className="form-check" style={{ fontSize: "1rem" }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="applicableCheckbox"
                        checked={applicable}
                        onChange={() => {
                          if (!isReadOnly) {
                            handleApplicableChange(true); // Set applicable to true
                          }
                        }} // Set applicable to true
                        style={{ transform: "scale(1.5)" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="applicableCheckbox"
                      >
                        Applicable
                      </label>
                    </div>
                    <div
                      className="form-check"
                      style={{ marginLeft: "1rem", fontSize: "1rem" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notApplicableCheckbox"
                        checked={!applicable}
                        onChange={() => {
                          if (!isReadOnly) {
                            handleApplicableChange(false); // Set applicable to true
                          }
                        }} // Set applicable to false
                        style={{ transform: "scale(1.5)" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="notApplicableCheckbox"
                      >
                        Not Applicable
                      </label>
                    </div>
                  </div>
                  {!applicable && (
                    <div>
                      <Row>
                        <Col md={12}>
                          <Form.Group controlId="formInput12">
                            <Form.Label className="custom-label">Note</Form.Label>
                            <Form.Control
                              style={{ backgroundColor: "#Dfebef" }}
                              type="text"
                              as="textarea"
                              value={note?.[0]?.[0] ?? ''}
                              onChange={handleNoteChange}
                              onDoubleClick={() => handleDoubleClick(note[0][0])}
                              readOnly={isReadOnly}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {isAudit && isCurrentAuditor && ansId && (
                        <Row className="align-items-end mt-4">
                          {/* Remark */}
                          <Col md={8}>
                            <Form.Group>
                              <Form.Label className="custom-label">Remark</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={remark}
                                onChange={handleRemarkChange}
                                style={{ backgroundColor: "#Dfebef" }}
                              />
                            </Form.Group>
                          </Col>

                          {/* Buttons */}
                          <Col
                            md={4}
                            className="d-flex justify-content-end gap-2"
                          >
                            <Button
                              style={{
                                backgroundColor: "#10b981",
                                minWidth: 120,
                              }}
                              onClick={handleAccept}
                            >
                              Accept
                            </Button>

                            <Button
                              style={{
                                backgroundColor: "#ef4444",
                                minWidth: 120,
                              }}
                              onClick={handleReject}
                            >
                              Reject
                            </Button>
                          </Col>
                        </Row>
                      )}

                      {!isAudit && (
                        <Row className="align-items-end mb-3 mt-3">
                          <Col md={8}>
                          </Col>

                          <Col md={4} className="d-flex justify-content-end align-items-end">
                            {!isReadOnly && (
                              <Button
                                style={{ backgroundColor: "#3F88A5", minWidth: 120 }}
                                onClick={handleSubmit}
                              >
                                Submit
                              </Button>
                            )}
                          </Col>
                        </Row>
                      )}
                    </div>
                  )}
                </div>
              )}

            {isDataInitialized && applicable && (
              <div
                style={{
                  border: "1px solid grey",
                  padding: "15px",
                  borderRadius: "10px",
                  marginTop: "2%",
                }}
              >
              <Form>
                {!isReadOnly && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >

                    <FaEdit
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        height: "20px",
                        width: "20px",
                        color: edit && !isReadOnly ? "black" : "#BFD7E0",
                      }}
                      onClick={handleEditClick}
                    />
                  </div>
                )}

                {currentQuestion?.questionType === QUESTION_TYPE_QUALITATIVE && (
                  <QualitativeComponent
                    isReadOnly={isReadOnly}
                    edit={edit}
                    menu={menu}
                    currentQuestion={currentQuestion}
                    answer={answer}
                    setAnswer={setAnswer}
                    matchedAnswer={matchedAnswer}
                    handleDoubleClick={handleDoubleClick}
                  />
                )}
                {currentQuestion?.questionType === QUESTION_TYPE_QUANTITATIVE && (
                  <QualitativeComponent
                    isReadOnly={isReadOnly}
                    edit={edit}
                    menu={menu}
                    currentQuestion={currentQuestion}
                    answer={answer}
                    setAnswer={setAnswer}
                    matchedAnswer={matchedAnswer}
                    handleDoubleClick={handleDoubleClick}
                  />
                )}
                {currentQuestion?.questionType === QUESTION_TYPE_TABULAR && (
                  <TabularComponent
                    isReadOnly={isReadOnly}
                    edit={edit}
                    menu={menu}
                    currentQuestion={currentQuestion}
                    answer={answer}
                    matchedAnswer={matchedAnswer}
                    setAnswer={setAnswer}
                    emissionData={emissionData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleDoubleClick={handleDoubleClick}
                  />
                )}
                {currentQuestion?.questionType === QUESTION_TYPE_YES_NO && (
                  <YesNoComponent
                    isReadOnly={isReadOnly}
                    menu={menu}
                    edit={edit}
                    matchedAnswer={matchedAnswer}
                    answer={answer}
                    setAnswer={setAnswer}
                    currentQuestion={currentQuestion}
                    handleDoubleClick={handleDoubleClick}
                  />
                )}
                {currentQuestion?.questionType === QUESTION_TYPE_QUANTITATIVE_TRENDS && (
                  <TrendsComponent
                    isReadOnly={isReadOnly}
                    menu={menu}
                    edit={edit}
                    answer={answer}
                    setAnswer={setAnswer}
                    unit={unit}
                    currentQuestion={currentQuestion}
                    matchedAnswer={matchedAnswer}
                    previousMonthMatchedAnswer={previousMonthMatchedAnswer}
                    matchedTargetAnswer={matchedTargetAnswer}
                    handleDoubleClick={handleDoubleClick}
                  />
                )}


                <Form.Group>

                  {filteredDocs && Object.keys(filteredDocs).length > 0 && (
                    <div
                      style={{
                        backgroundColor: "#DFEBEF",
                        width: "100%",
                        padding: "20px",
                        borderRadius: "8px",
                        marginTop: "20px"
                      }}
                    >
                      <Row>
                        {Object.entries(filteredDocs).map(([id]) => {
                          const document = documents[id];
                          return (
                            <Col key={id} md={4} className="mb-3">
                              <Card className="h-100">
                                <Card.Body
                                  className="clickable-card-body"
                                  onClick={() => openViewEditModal(document)}
                                  style={{ cursor: "pointer" }}
                                  title="Click to view document details"
                                >
                                  {/* Row 1 */}
                                  <strong className="d-block mb-2">
                                    Document ID: {document.id || "N/A"}
                                  </strong>

                                  {/* Row 2 */}
                                  <div className="d-flex align-items-center justify-content-between">
                                    <span className="me-3">{document.fileMetadata.fileName}</span>
                                    <div>
                                      {!isAudit && (
                                        <Button
                                          variant="outline-info"
                                          size="sm"
                                          className="me-2"
                                          title="View Document"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openViewEditModal(document);
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                      )}
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        title="Preview Document"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openPreviewModal(document);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faFileInvoice} />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>

                      <ViewEditDocument
                        ref={viewEditDocumentRef}
                        document={currentDocument}
                        frameworks={frameworks}
                        sourceOptions={flattenedSourceOptions}
                        financialYearOptions={financialYearOptions}
                        disableEdit={!edit || isReadOnly}
                      />

                      <PreviewDocument
                        ref={previewDocumentRef}
                        document={currentDocument}
                      />
                    </div>
                  )}
                    
                  {/* ROW 2: Document (left) + Submit (right) */}
                  {!isAudit && !isReadOnly && (
                    <Row className="align-items-end mb-3 mt-3">
                      <Col md={8}>
                        <Form.Group className="d-flex flex-column">
                          <div style={{ maxWidth: "300px" }}>
                            <DocumentUploadModal
                              canUploadDocument={edit && !isReadOnly}
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={4} className="d-flex justify-content-end align-items-end">
                        <Button
                          disabled={!edit}
                          style={{ backgroundColor: "#3F88A5", minWidth: 120 }}
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Form.Group>

                {isAudit && item && isCurrentAuditor && (
                  <Row className="align-items-end mt-4">
                    {/* Remark */}
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label className="custom-label">Remark</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={remark}
                          onChange={handleRemarkChange}
                          style={{ backgroundColor: "#Dfebef" }}
                        />
                      </Form.Group>
                    </Col>

                    {/* Buttons */}
                    <Col
                      md={4}
                      className="d-flex justify-content-end gap-2"
                    >
                      <Button
                        style={{
                          backgroundColor: "#10b981",
                          minWidth: 120,
                        }}
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>

                      <Button
                        style={{
                          backgroundColor: "#ef4444",
                          minWidth: 120,
                        }}
                        onClick={handleReject}
                      >
                        Reject
                      </Button>
                    </Col>
                  </Row>
                )}
              </Form>
              </div>
            )}
          </div>
          <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>{showData}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={isAssignModalOpen}
            onHide={() => setAssignIsModalOpen(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>{item.first_name}</td>
                      <td>Answered</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setAssignIsModalOpen(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={confirmTarget} onHide={cancelTarget} size="md" centered>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formComment">
                <Form.Label>
                  {exceedMessage && (
                    <p
                      style={{
                        marginTop: "10px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {exceedMessage}
                    </p>
                  )}

                  <div>Do you want to continue?</div>
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelTarget}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showConfirmModal}
            onHide={handleConfirmClose}
            centered
            size="md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",

            }}
          >
            <Modal.Header
              closeButton
              style={{ borderBottom: "1px solid #eaedf0", padding: "16px 24px" }}
            >
              <Modal.Title style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "24px" }}>
              <div className="text-center mb-3">
                <i
                  className="fas fa-question-circle"
                  style={{
                    fontSize: "3rem",
                    color: "#2196f3",
                    marginBottom: "16px",
                  }}
                ></i>
                <p style={{ fontSize: "1.1rem" }}>
                  Already approved. Do you want to resubmit?
                </p>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  This will resend the answer for verification.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer
              style={{
                borderTop: "1px solid #eaedf0",
                padding: "16px 24px",
                display: "flex",
                gap: "8px",
              }}
            >
              <Button
                variant="outline-secondary"
                style={{ flex: "1", borderRadius: "8px" }}
                onClick={handleConfirmClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{ flex: "1", borderRadius: "8px" }}
                onClick={handleConfirmSubmit}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MainAccordComponent;

