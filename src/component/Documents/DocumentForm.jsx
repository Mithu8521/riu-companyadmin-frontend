import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Form, Alert, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCheckCircle, faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import { getStore } from "../../utils/UniversalFunction";
import { 
  getStartingMonth, 
  getFrequency, 
  getPeriod, 
  generateTimePeriodOptions, 
  handlePeriodChange 
} from "../../utils/PeriodCalculationUtils";

const DocumentForm = ({
  editDocument,
  frameworks,
  sourceOptions,
  financialYearOptions,
  onSave,
  onDelete,
  mode = "edit",
  loading: externalLoading = false,
  error: externalError = null,
  success: externalSuccess = false
}) => {
  // State management
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [financialYearError, setFinancialYearError] = useState();
  const [moduleError, setModuleError] = useState();
  const [locationError, setLocationError] = useState();

  // API data state
  const [reportingQuestionsByModule, setReportingQuestionsByModule] = useState(null);
  const [reportingQuestionsById, setReportingQuestionsById] = useState(null);
  const [moduleOptions, setModuleOptions] = useState(null);
  const [reportingQuestionOptions, setReportingQuestionOptions] = useState(null);
  const [documentKPIs, setDocumentKPIs] = useState();
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([]);
  const [kpiOptions, setKpiOptions] = useState();

  // Reading state
  const [currentReading, setCurrentReading] = useState(0);
  const [currentReadingUnit, setCurrentReadingUnit] = useState('');
  const [canAddReadings, setCanAddReadings] = useState(false);

  // Time period state
  const [answerFrequency, setAnswerFrequency] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);

  const currentUser = getStore("currentUser");
  const financialYearStartMonth = useMemo(() => getStartingMonth(), []);

  const isViewMode = mode === "view";

  // Utility functions
  const safeJsonParse = useCallback((str, fallback = null) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.warn("Invalid JSON string:", e.message);
      return fallback;
    }
  }, []);

  // Form data management
  const resetFormData = useCallback(() => {
    setFormData({});
  }, []);

  const populateFormData = useCallback((document) => {
    console.log('Document', document);
    setFormData({
      id: document?.id,
      documentType: document?.documentType,
      financialYearId: document?.financialYearId,
      frequency: document?.frequency,
      fromDate: document?.fromDate,
      toDate: document?.toDate,
      sourceId: document?.sourceId,
      moduleName: document?.moduleName,
      fileMetadataId: document?.fileMetadataId,
      documentMetadata: document?.documentMetadata || {},
      addToReporting: document?.addToReporting || false,
      reportingQuestionMeta: document?.reportingQuestionMeta || {},
    });
  }, []);

  const handleFormFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubFormFieldChange = useCallback((field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev?.[field] ?? {}),
        [subField]: value
      }
    }));
  }, []);

  // Date setters
  const setFromDate = useCallback((fromDate) => {
    handleFormFieldChange('fromDate', fromDate);
  }, [handleFormFieldChange]);

  const setToDate = useCallback((toDate) => {
    handleFormFieldChange('toDate', toDate);
  }, [handleFormFieldChange]);

  // API calls
  const getReportingQuestions = useCallback(async () => {
    try {
      if (formData.financialYearId && frameworks && frameworks.length > 0) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
          {},
          {
            financialYearId: formData.financialYearId,
            frameworkIds: frameworks.map(item => item.id),
          },
          "GET"
        );
        if (response?.isSuccess && response?.data?.data) {
          const data = response.data.data;
          const groupedById = {};
          const groupedByModuleName = data.reduce((acc, item) => {
            if (!acc[item.moduleName]) {
              acc[item.moduleName] = [];
            }
            acc[item.moduleName].push(item);
            groupedById[item.questionId] = item;
            return acc;
          }, {});

          setReportingQuestionsByModule(groupedByModuleName);
          setReportingQuestionsById(groupedById);
        }
      }
    } catch (error) {
      console.error("Error fetching reporting questions:", error);
    }
  }, [formData?.financialYearId, frameworks]);


  const getDocumentKPIs = useCallback(async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents/kpis`,
        {},
        {},
        "GET"
      );
      if (response?.isSuccess && response?.data) {
        setDocumentKPIs(response?.data);
        
        const kpis = Object.values(response?.data || {});
        const uniqueDocumentTypes = new Set([...kpis.map(kpi => kpi.documentType), 'OTHERS']);

        setDocumentTypeOptions(
          Array.from(uniqueDocumentTypes).map(documentType => ({
            value: documentType,
            label: documentType,
          }))
        );

        const documentSubTypeMap = kpis.reduce((acc, kpi) => {
          if (!acc[kpi.documentType]) {
            acc[kpi.documentType] = new Set();
          }
          acc[kpi.documentType].add(kpi.documentSubType);
          return acc;
        }, {});

        const documentSubTypeOptionsMap = Object.entries(documentSubTypeMap).reduce(
          (acc, [docType, subTypes]) => {
            acc[docType] = Array.from(subTypes).map(subType => ({
              value: subType,
              label: subType,
            }));
            return acc;
          },
          {}
        );

        setDocumentSubTypeOptions(documentSubTypeOptionsMap);
      }
    } catch (error) {
      console.error('Error Fetching documentKPIs:', error);
    }
  }, []);

  const getReportingAnswer = useCallback(async (financialYearId, questionId) => {
    try {
      if (financialYearId && questionId) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingAnswer`,
          {},
          {
            current_role: "company",
            financialYearId: financialYearId,
            questionId: questionId,
          },
          "GET"
        );
        if (response?.isSuccess && response?.data) {
          return response?.data?.answers;
        }
      }
    } catch (error) {
      console.error("Error Fetching ReportingAnswer:", error);
    }
  }, []);

  const getKpiOptions = useCallback(async (questionId) => {

    if (!questionId || !reportingQuestionsById) return null;

    const item = reportingQuestionsById[+questionId];
    if (!item) return null;

    let kpis = item.details
      .slice()
      .reverse()
      .filter((d) => d.option_type === "row")
      .map((d, index) => ({ value: index, label: d.option }));

    if (kpis.length === 0) return null;

    if (kpis.length === 1 && kpis[0].label === "1") {
      const answers = await getReportingAnswer(formData.financialYearId, questionId);

      const reportingAnswer = answers?.find(
        (ans) =>
          ans.questionId === Number(questionId) &&
          ans.financialYearId == formData.financialYearId &&
          ans.sourceId == formData.sourceId &&
          (formData?.frequency !== "CUSTOM" ||
            (ans.fromDate === formData.fromDate && ans.toDate === formData.toDate))
      );

      if (!reportingAnswer) return null;

      const parsedAnswer = safeJsonParse(reportingAnswer.answer);
      kpis = parsedAnswer.map((r, index) => ({
        value: index,
        label: r[0],
      }));
    }

    return kpis;
  }, [reportingQuestionsById, getReportingAnswer, formData]);


  const getDocumentKpiKey = useCallback((reportingQuestionMeta) => {
    const { questionId, row, readingColumn } = reportingQuestionMeta || {};

    if (questionId != null && row != null && readingColumn != null) {
      return `Q${questionId}R${row+1}C${readingColumn+1}`;
    } else if (questionId != null && row != null) {
      return `Q${questionId}R${row+1}`;
    } else if (questionId != null) {
      return `Q${questionId}`;
    }

    return null;
  }, []);

  // Event handlers
  const handleDocumentTypeChange = (documentType) => {
    handleFormFieldChange('documentType', documentType);
    handleFormFieldChange('documentMetadata', {});

    const documentSubType = documentSubTypeOptions?.[documentType]?.[0]?.value;
    handleDocumentSubTypeChange(documentType, documentSubType);
  };

  const handleDocumentSubTypeChange = (documentType, documentSubType) => {
    handleSubFormFieldChange('documentMetadata', 'documentSubType', documentSubType);

    if (!documentType || !documentSubType || !documentKPIs || !reportingQuestionsById) {
      handleFormFieldChange('addToReporting', false);
      handleFormFieldChange('reportingQuestionMeta', {});
      setCanAddReadings(false);
      return;
    }

    const existingKpi = Object.values(documentKPIs).find(kpi => (
      kpi.documentType === documentType &&
      kpi.documentSubType === documentSubType &&
      kpi.questionId in reportingQuestionsById
    ));

    if (existingKpi && existingKpi.operationType === 'SUM') {
      handleFormFieldChange('addToReporting', true);
      handleFormFieldChange('reportingQuestionMeta', existingKpi);
      const newModuleName = reportingQuestionsById[+existingKpi.questionId].moduleName;
      handleFormFieldChange('moduleName', newModuleName);
      setCanAddReadings(true);
      if (areValuesSameAsExistingDocument(formData.financialYearId, formData.sourceId, formData.subLocationId, formData.fromDate, formData.toDate, formData.fileMetadataId, existingKpi)) {
        handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', editDocument?.reportingQuestionMeta?.addReadings);
      }
    } else {
      handleFormFieldChange('addToReporting', false);
      handleFormFieldChange('reportingQuestionMeta', {});
      setCanAddReadings(false);
    }
  };

  const handleFinancialYearChange = (financialYearId) => {
    setFinancialYearError('');
    handleFormFieldChange('financialYearId', financialYearId);
    if (!financialYearId) {
      handleFormFieldChange('moduleName', '');
      handleFormFieldChange('frequency', '');
      handleAddToReportingChange(false);
      setFromDate('');
      setToDate('');
    }
    handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', false);
  };

  const handleModuleChange = (moduleName) => {
    setModuleError('');
    handleFormFieldChange('moduleName', moduleName);
    handleFormFieldChange('addToReporting', false);
    handleFormFieldChange('reportingQuestionMeta', {});
    setCanAddReadings(false);
  };

  const handleLocationChange = (sourceId) => {
    setLocationError('');
    handleFormFieldChange('sourceId', sourceId);
    handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', false);
  }

  const updateTimePeriodOptionsAndHandlePeriodChange = (financialYearId, frequency) => {
    if (!frequency || !financialYearId || !financialYearOptions || !financialYearStartMonth) return;

    if (frequency === 'CUSTOM' && answerFrequency) {
      const timePeriodOpts = generateTimePeriodOptions(answerFrequency, financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
      handlePeriodChange(timePeriodOpts[0].value, financialYearId, financialYearOptions, answerFrequency, setFromDate, setToDate);
    } else if (frequency !== 'CUSTOM') {
      const timePeriodOpts = generateTimePeriodOptions('YEARLY', financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
      handlePeriodChange(timePeriodOpts[0].value, financialYearId, financialYearOptions, 'YEARLY', setFromDate, setToDate);
    }
  }

  const handleFrequencyChange = (frequency) => {
    handleFormFieldChange('frequency', frequency);
    handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', false);
    updateTimePeriodOptionsAndHandlePeriodChange(formData.financialYearId, frequency);
  }

  const handleAddToReportingChange = async (addToReporting) => {
    if (!formData?.financialYearId) {
      handleFormFieldChange('addToReporting', false);
      handleFormFieldChange('reportingQuestionMeta', {});
      setFinancialYearError('Please select a financial year before adding to reporting.');
      return;
    }

    if (!formData?.moduleName) {
      handleFormFieldChange('addToReporting', false);
      handleFormFieldChange('reportingQuestionMeta', {});
      setModuleError('Please select a module before adding to reporting.');
      return;
    }

    handleFormFieldChange('addToReporting', addToReporting);
    if (addToReporting && reportingQuestionsById) {
      const rqMeta = {
        questionId: reportingQuestionOptions[0].value
      };
      const kpis = await getKpiOptions(reportingQuestionOptions[0].value);
      if (kpis && kpis.length > 0) {
        rqMeta['row'] = 0;
      }
      handleFormFieldChange('reportingQuestionMeta', rqMeta);
    } else if (!addToReporting) {
      handleFormFieldChange('reportingQuestionMeta', {});
    }
  };

  const handleAddReadingsChange = (addReadings) => {
    if (addReadings && !formData?.sourceId) {
      setLocationError('Please select a location before adding readings.');
      return;
    }
    handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', addReadings);
  };

  const isSameAsExistingDocument = () => {
    return (
      editDocument?.id != null &&
      editDocument.financialYearId == formData?.financialYearId &&
      editDocument.sourceId == formData?.sourceId &&
      editDocument.subLocationId == formData.subLocationId &&
      editDocument.fromDate == formData.fromDate &&
      editDocument.toDate == formData.toDate &&
      editDocument.fileMetadataId == formData.fileMetadataId &&
      getDocumentKpiKey(editDocument.reportingQuestionMeta) == getDocumentKpiKey(formData.reportingQuestionMeta)
    );
  }

  const areValuesSameAsExistingDocument = (financialYearId, sourceId, subLocationId, fromDate, toDate, fileMetadataId, reportingQuestionMeta) => {
    return (
      editDocument?.id != null &&
      editDocument.financialYearId == financialYearId &&
      editDocument.sourceId == sourceId &&
      editDocument.subLocationId == subLocationId &&
      editDocument.fromDate == fromDate &&
      editDocument.toDate == toDate &&
      editDocument.fileMetadataId == fileMetadataId &&
      getDocumentKpiKey(editDocument.reportingQuestionMeta) == getDocumentKpiKey(reportingQuestionMeta)
    );
  }

  // Save function
  const saveDocumentChanges = async () => {
    try {
      if (formData?.addToReporting && !formData?.sourceId) {
        setLocationError('Please select a location before adding to reporting.');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      const updatedData = {
        documentType: formData.documentType,
        financialYearId: parseInt(formData.financialYearId),
        moduleName: formData.moduleName,
        sourceId: formData.sourceId,
        subLocationId: formData.subLocationId,
        frequency: formData.frequency,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        documentMetadata: formData.documentMetadata,
        fileMetadataId: formData.fileMetadataId,
        addToReporting: formData.addToReporting,
        reportingQuestionMeta: formData.reportingQuestionMeta
      };

      let isSuccess, data;
      if (formData.id) {
        updatedData['id'] = formData.id;
        ({isSuccess, data} = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}documents/${formData.id}`,
          {},
          updatedData,
          "POST"
        ));
      } else {
        ({isSuccess, data} = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}documents`,
          {},
          updatedData,
          "POST"
        ));
      }

      if (isSuccess && data) {
        setSuccess(true);
        setError(null);

        // Call the parent callback if provided
        if (onSave) {
          onSave(data, updatedData);
        }

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError("Failed to save document changes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving document changes:", error);
      setError("An error occurred while saving changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      setSuccess(false);

      let isSuccess, data;
      if (formData.id) {
        ({isSuccess, data} = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}documents/${formData.id}`,
          {},
          {},
          "DELETE"
        ));
      }

      if (isSuccess && data) {
        setSuccess(true);
        setError(null);

        // Call the parent callback if provided
        if (onDelete) {
          onDelete();
        }

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError("Failed to delete document. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("An error occurred while deleting document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Effects
  useEffect(() => {
    if (editDocument) {
      populateFormData(editDocument);
    }
  }, [editDocument, populateFormData]);

  useEffect(() => {
    getDocumentKPIs();
  }, [getDocumentKPIs]);

  useEffect(() => {
    const fetchData = async () => {
      if (formData.financialYearId && frameworks && frameworks.length > 0) {
        await getReportingQuestions();
      }

      if (formData.financialYearId) {
        try {
          const frequency = await getFrequency(formData.financialYearId);
          setAnswerFrequency(frequency);
        } catch (err) {
          console.error("Error fetching frequency", err);
        }
      }
    };

    fetchData();
  }, [formData.financialYearId, frameworks, getReportingQuestions]);

  useEffect(() => {
    if (formData.financialYearId && frameworks && frameworks.length > 0) {
      getReportingQuestions();
    } else {
      // handle empty state (e.g., clear reporting questions)
      setReportingQuestionsByModule(null);
      setReportingQuestionsById(null);
    }
  }, [formData.financialYearId, frameworks]);

  useEffect(() => {
    if (reportingQuestionsByModule) {
      setModuleOptions(Object.keys(reportingQuestionsByModule).map(module => ({ value: module, label: module})));
    } else {
      setModuleOptions([{ value: "", label: "Select Financial Year First" }]);
    }

    if (reportingQuestionsByModule && reportingQuestionsById && formData?.financialYearId && formData?.documentType && formData?.documentMetadata?.documentSubType) {
      handleDocumentSubTypeChange(formData.documentType, formData.documentMetadata.documentSubType);
    }
  }, [reportingQuestionsByModule, reportingQuestionsById]);

  // Time period effect
  useEffect(() => {
    if (!formData?.frequency || !formData?.financialYearId || !financialYearOptions || !financialYearStartMonth) return;

    if (formData?.frequency === 'CUSTOM' && answerFrequency) {
      const timePeriodOpts = generateTimePeriodOptions(answerFrequency, financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
    } else if (formData?.frequency !== 'CUSTOM') {
      const timePeriodOpts = generateTimePeriodOptions('YEARLY', financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
    }
  }, [formData?.frequency, answerFrequency, formData?.financialYearId, financialYearOptions, financialYearStartMonth, setFromDate, setToDate]);

  // Frequency effect
  useEffect(() => {
    if (!formData?.financialYearId || !reportingQuestionsById) return;

    const questionId = formData?.reportingQuestionMeta?.questionId;
    if (formData?.addToReporting && questionId && reportingQuestionsById && questionId in reportingQuestionsById) {
      const frequency = reportingQuestionsById[+questionId]?.frequency || '';
      handleFormFieldChange('frequency', frequency);
      updateTimePeriodOptionsAndHandlePeriodChange(formData.financialYearId, frequency);
    } else {
      handleFormFieldChange('frequency', 'EVERY_FY');
      updateTimePeriodOptionsAndHandlePeriodChange(formData.financialYearId, 'EVERY_FY');
    }
  }, [formData?.financialYearId, formData?.addToReporting, formData?.reportingQuestionMeta?.questionId, reportingQuestionsById]);

  useEffect(() => {
    if (formData.moduleName && reportingQuestionsByModule) {
      setReportingQuestionOptions(reportingQuestionsByModule[formData.moduleName].map(q => ({ value: q.questionId, label: q.title})));
    } else {
      setReportingQuestionOptions();
    }
  }, [formData.moduleName, reportingQuestionsByModule]);

  useEffect(() => {
    if (reportingQuestionsByModule) {
      setModuleOptions(Object.keys(reportingQuestionsByModule).map(module => ({ value: module, label: module})));
    } else {
      setModuleOptions([{ value: "", label: "Select Financial Year First" }]);
    }

    if (reportingQuestionsByModule && reportingQuestionsById && formData?.financialYearId && formData?.documentType && formData?.documentMetadata?.documentSubType) {
      handleDocumentSubTypeChange(formData.documentType, formData.documentMetadata.documentSubType);
    }
  }, [reportingQuestionsByModule, reportingQuestionsById]);

  // Current reading effect
  useEffect(() => {
    const fetchReportingAnswer = async () => {
      if (!formData.financialYearId || !formData?.reportingQuestionMeta?.questionId || 
        !formData?.sourceId || !formData?.fromDate || !formData?.toDate ||
        !formData?.addToReporting || !formData?.reportingQuestionMeta?.addReadings) return;

      const answers = await getReportingAnswer(formData?.financialYearId, formData?.reportingQuestionMeta?.questionId);

      const reportingAnswer = answers?.find(ans => (
        ans.financialYearId == formData.financialYearId &&
        ans.questionId == formData.reportingQuestionMeta.questionId &&
        ans.sourceId == formData.sourceId &&
        (formData?.frequency !== 'CUSTOM' ||
          (ans.fromDate === formData.fromDate && ans.toDate === formData.toDate))
      ));

      const documentKpiKey = getDocumentKpiKey(formData.reportingQuestionMeta);
      let kpiDetails = documentKPIs?.[documentKpiKey];
      const row = kpiDetails?.['row'], readingColumn = kpiDetails?.['readingColumn'];
      let readingValue = 0, readingUnit = kpiDetails?.['readingUnit'];

      if (reportingAnswer) {
        if (reportingAnswer.questionType === 'quantitative') {
          readingValue = Number(reportingAnswer.answer);
        } else if (reportingAnswer.questionType === 'quantitative_trends') {
          const parsedAnswer = safeJsonParse(reportingAnswer.answer);
          readingValue = Number(parsedAnswer?.readingValue);
        } else if (reportingAnswer.questionType === 'tabular_question') {
          const parsedAnswer = safeJsonParse(reportingAnswer.answer);
          if (!isNaN(readingColumn)) {
            readingValue = Number(parsedAnswer[row][readingColumn])
          }
        } else {
          console.error(`Unsupported questionType ${reportingAnswer.questionType}`);
        }
      }

      if (isSameAsExistingDocument() && editDocument?.reportingQuestionMeta?.addReadings) {
        setCurrentReading(Number((readingValue - (editDocument?.reportingQuestionMeta?.readingValue || 0)).toFixed(2)));
      } else {
        setCurrentReading(readingValue);
      }
      setCurrentReadingUnit(readingUnit);
    }

    fetchReportingAnswer();
  }, [formData, getReportingAnswer, getDocumentKpiKey, documentKPIs, safeJsonParse]);

  // KPI options effect
  useEffect(() => {
    const generateKpiOptions = async () => {
      const kpis = await getKpiOptions(formData?.reportingQuestionMeta?.questionId);
      setKpiOptions(kpis);
    };
    
    generateKpiOptions();
  }, [
    formData?.reportingQuestionMeta?.questionId,
    formData?.financialYearId,
    formData?.sourceId,
    formData?.fromDate,
    formData?.toDate,
    formData?.frequency,
    reportingQuestionsById,
    getReportingAnswer,
    safeJsonParse
  ]);

  useEffect(() => {
    const documentKpiKey = getDocumentKpiKey(formData.reportingQuestionMeta);
    setCanAddReadings(documentKpiKey && documentKPIs && documentKpiKey in documentKPIs);
  }, [formData.reportingQuestionMeta, documentKPIs]);

  // Render document metadata form based on type
  const renderDocumentMetadata = useCallback((documentType) => {
    if (documentType === 'BILL') {
      return (
        <div className="parsed-metadata editing">
          <h6>Bill Information:</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bill Type</Form.Label>
                <Form.Select
                  value={formData?.documentMetadata?.documentSubType || ''}
                  onChange={(e) => handleDocumentSubTypeChange(formData?.documentType, e.target.value)}
                  disabled={isViewMode}
                >
                  {documentSubTypeOptions['BILL']?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.documentMetadata?.name || ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'name', e.target.value)}
                  placeholder="Enter name"
                  disabled={isViewMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Billing Month</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.documentMetadata?.billingMonth || ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'billingMonth', e.target.value)}
                  placeholder="Enter billing month"
                  disabled={isViewMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.documentMetadata?.unit || ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'unit', e.target.value)}
                  placeholder="Enter unit"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData?.documentMetadata?.billingStartDate 
                    ? moment(formData?.documentMetadata?.billingStartDate).format("YYYY-MM-DD") 
                    : ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'billingStartDate', e.target.value)}
                  disabled={isViewMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Billing End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData?.documentMetadata?.billingEndDate 
                    ? moment(formData?.documentMetadata?.billingEndDate).format("YYYY-MM-DD") 
                    : ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'billingEndDate', e.target.value)}
                  disabled={isViewMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Units Consumed</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData?.documentMetadata?.unitsConsumed || ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'unitsConsumed', e.target.value)}
                  placeholder="Enter units consumed"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      );
    } else if (documentType === 'OTHERS') {
      return (
        <div className="parsed-metadata editing">
          <h6>Document Information:</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Control
                  type="text"
                  value={formData?.documentMetadata?.documentType || ''}
                  onChange={(e) => handleSubFormFieldChange('documentMetadata', 'documentType', e.target.value)}
                  placeholder="Enter Document Type"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  }, [formData, documentSubTypeOptions, handleSubFormFieldChange]);


  const renderFileMetadata = useCallback((fileMetadata) => {
    if (!fileMetadata) return null;

    return (
      <div className="file-metadata-section mb-4">
        <h6>File Metadata</h6>
        <div className="file-metadata-grid">
          <Row>
            <Col md={6}>
              <div className="metadata-item">
                <strong>File Name:</strong>
                <span className="metadata-value">{fileMetadata.fileName || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>File Size:</strong>
                <span className="metadata-value">
                  {fileMetadata.fileSize
                    ? `${(fileMetadata.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : 'N/A'}
                </span>
              </div>
              <div className="metadata-item">
                <strong>MIME Type:</strong>
                <span className="metadata-value">{fileMetadata.mimeType || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>Provider:</strong>
                <span className="metadata-value">{fileMetadata.provider || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>Temporary:</strong>
                <span className="metadata-value">
                  {fileMetadata.isTemporary ? 'Yes' : 'No'}
                </span>
              </div>
            </Col>
            <Col md={6}>
              <div className="metadata-item">
                <strong>File UUID:</strong>
                <span className="metadata-value uuid-text">{fileMetadata.uuid || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>File Hash:</strong>
                <span className="metadata-value hash-text">{fileMetadata.hash || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>Uploaded By:</strong>
                <span className="metadata-value">{fileMetadata.uploadedById || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <strong>Created At:</strong>
                <span className="metadata-value">
                  {fileMetadata.createdAt
                    ? moment(fileMetadata.createdAt).format("DD MMM YYYY, HH:mm")
                    : 'N/A'}
                </span>
              </div>
              {fileMetadata.url && (
                <div className="metadata-item">
                  <strong>File URL:</strong>
                  <span className="metadata-value">
                    <a
                      href={fileMetadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-url-link"
                    >
                      View File
                    </a>
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }, []);


  // Use external props if provided, otherwise use internal state
  const isLoading = externalLoading || loading;
  const currentError = externalError || error;
  const isSuccess = externalSuccess || success;

  console.log('formData', formData);

  return (
    <div className="document-form">
      {/* File Metadata Display */}
      {editDocument.fileMetadata && renderFileMetadata(editDocument.fileMetadata)}

      {/* Success/Error Messages */}
      {isSuccess && (
        <Alert variant="success">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          Document changes have been saved successfully!
        </Alert>
      )}

      {currentError && (
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {currentError}
        </Alert>
      )}

      {/* Document Type */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select
              value={formData.documentType || ''}
              onChange={(e) => handleDocumentTypeChange(e.target.value)}
              disabled={isViewMode}
            >
              {documentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Document Type-specific metadata */}
      {formData.documentType && renderDocumentMetadata(formData.documentType)}

      {/* Financial Year, Location, and Period */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Financial Year</Form.Label>
            <Form.Select
              value={formData.financialYearId || ''}
              onChange={(e) => handleFinancialYearChange(e.target.value)}
              isInvalid={!!financialYearError}
              disabled={isViewMode}
            >
              <option value="">Select Financial Year</option>
              {financialYearOptions?.map((fy) => (
                <option key={fy.value} value={fy.value}>
                  {fy.label}
                </option>
              ))}
            </Form.Select>
            {financialYearError && <div className="invalid-feedback">{financialYearError}</div>}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Module Name</Form.Label>
            <Form.Select
              value={formData.moduleName || ''}
              onChange={(e) => handleModuleChange(e.target.value)}
              disabled={isViewMode || canAddReadings || !formData.financialYearId}
              isInvalid={!!moduleError}   // Bootstrap validation
            >
              {!formData?.financialYearId && <option value="">Select Financial Year First</option>}
              {formData?.financialYearId && (
                <>
                  <option value="">Select Module</option>
                  {moduleOptions?.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
            {canAddReadings && (
              <small className="text-muted">Preselected for document type</small>
            )}
            {moduleError && <div className="invalid-feedback">{moduleError}</div>}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={formData.sourceId || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              isInvalid={!!locationError}   // Bootstrap validation
              disabled={isViewMode}
            >
              <option value="">Select Location</option>
              {sourceOptions?.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Form.Select>
            {locationError && <div className="invalid-feedback">{locationError}</div>}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Frequency</Form.Label>
            <Form.Select
              value={formData.frequency || ''}
              onChange={(e) => handleFrequencyChange('frequency', e.target.value)}
              disabled={isViewMode || !formData.financialYearId || !formData?.addToReporting || (formData?.addToReporting && formData?.reportingQuestionMeta?.questionId)}
            >
              {!formData?.financialYearId && <option value="">Select Financial Year First</option>}
              {formData?.financialYearId && (
                <>
                  <option value="EVERY_FY">YEARLY</option>
                  <option value="CUSTOM">{answerFrequency}</option>
                </>
              )}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Period</Form.Label>
            <Form.Select
              value={formData.fromDate && 
                formData.toDate &&
                formData.financialYearId &&
                financialYearOptions &&
                financialYearStartMonth &&
                getPeriod(
                  formData.fromDate, 
                  formData.toDate, 
                  financialYearOptions?.find(fy => fy.value == formData.financialYearId)?.label, 
                  financialYearStartMonth
                )
              }
              onChange={(e) => {
                if (formData?.frequency === 'CUSTOM') {
                  handlePeriodChange(e.target.value, formData.financialYearId, financialYearOptions, answerFrequency, setFromDate, setToDate);
                } else {
                  handlePeriodChange(e.target.value, formData.financialYearId, financialYearOptions, 'YEARLY', setFromDate, setToDate);
                }
                handleSubFormFieldChange('reportingQuestionMeta', 'addReadings', false);
              }}
              disabled={isViewMode || !formData?.financialYearId}
            >
              {!formData?.financialYearId && <option value="">Select Financial Year First</option>}
              {formData?.financialYearId && (
                timePeriodOptions?.map((tp) => (
                  <option key={tp.value} value={tp.value}>
                    {tp.label}
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Add to Reporting Section */}
      <div className="add-to-reporting-section mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="addToReportingCheckbox"
            checked={formData?.addToReporting || false}
            onChange={(e) => handleAddToReportingChange(e.target.checked)}
            disabled={isViewMode || canAddReadings}
          />
          <label className="form-check-label" htmlFor="addToReportingCheckbox">
            Add document to a reporting question
            {canAddReadings && (
              <small className="text-muted ms-2">Automatically enabled for document type</small>
            )}
          </label>
        </div>
      </div>

      {/* Reporting Questions */}
      {reportingQuestionOptions && formData?.addToReporting && formData?.reportingQuestionMeta?.questionId && (
        <div>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reporting Question</Form.Label>
                <Form.Select
                  value={formData?.reportingQuestionMeta?.questionId || ''}
                  onChange={(e) => {
                    handleSubFormFieldChange('reportingQuestionMeta', 'questionId', e.target.value);
                    handleSubFormFieldChange('reportingQuestionMeta', 'row', null);
                  }}
                  disabled={isViewMode || canAddReadings}
                >
                  {reportingQuestionOptions.map((rq) => (
                    <option key={rq.value} value={rq.value}>
                      {rq.label}
                    </option>
                  ))}
                </Form.Select>
                {canAddReadings && (
                  <small className="text-muted">Preselected for document type</small>
                )}
              </Form.Group>
            </Col>
            {kpiOptions && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>KPI</Form.Label>
                  <Form.Select
                    value={kpiOptions?.[formData?.reportingQuestionMeta?.row]?.value || ''}
                    onChange={(e) => handleSubFormFieldChange('reportingQuestionMeta', 'row', e.target.value)}
                    disabled={isViewMode || canAddReadings}
                  >
                    {kpiOptions?.map((kpi) => (
                      <option key={kpi.value} value={kpi.value}>
                        {kpi.label}
                      </option>
                    ))}
                  </Form.Select>
                  {canAddReadings && (
                    <small className="text-muted">Preselected for document type</small>
                  )}
                </Form.Group>
              </Col>
            )}
          </Row>
          
          {/* Only show Add Readings for BILL type */}
          {formData?.addToReporting && canAddReadings && (
            <div className="add-readings-section mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="addReadingsCheckbox"
                  checked={formData?.reportingQuestionMeta?.addReadings || false}
                  onChange={(e) => handleAddReadingsChange(e.target.checked)}
                  disabled={isViewMode}
                />
                <label className="form-check-label" htmlFor="addReadingsCheckbox">
                  Add readings to the reporting question
                </label>
              </div>
            </div>
          )}

          {formData?.addToReporting && formData?.reportingQuestionMeta?.addReadings && (
            <div className="readings-calculation mb-3">
              <h6>Reading Calculation:</h6>
              <Row>
                <Col md={4}>
                  <div className="reading-item">
                    <strong>Current Reading</strong>
                    <div className="reading-value">
                      {currentReading} {currentReadingUnit}
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="reading-item">
                    <strong>Document Reading</strong>
                    <div className="reading-value">
                      {formData?.documentMetadata?.unitsConsumed || 0} {currentReadingUnit}
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="reading-item">
                    <strong>New Reading</strong>
                    <div className="reading-value text-primary">
                      {Number(currentReading || 0) + Number(formData?.documentMetadata?.unitsConsumed || 0)} {currentReadingUnit}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      { !isViewMode && (
        <div
          className={`action-buttons mt-4 d-flex ${
            formData?.id ? "justify-content-between" : "justify-content-center"
          }`}
        >
          {formData?.id &&
            <Button
              variant="danger"
              size="lg"
              onClick={deleteDocument}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete
                </>
              )}
            </Button>
          }
          <Button
            variant="success"
            size="lg"
            onClick={saveDocumentChanges}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentForm;