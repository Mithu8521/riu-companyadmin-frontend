import { useRef, useState, useCallback } from "react";
import { Modal, Row, Col, Card, Button, Form, Alert, ProgressBar, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFileAlt,
  faCheckCircle,
  faExclamationTriangle,
  faEdit,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import DocumentForm from "./DocumentForm";
import { useFrameworks, useSources, useFinancialYears } from "../../hooks/useApiData";

const DocumentUploadModal = ({
  onSave,
  size = "xl",
  centered = true,
  canUploadDocument = true,
}) => {
  const fileInputRef = useRef();

  // API data hooks
  const frameworks = useFrameworks();
  const sources = useSources();
  const financialYears = useFinancialYears();

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  // Memoized options
  const sourceOptions = sources.map(s => ({
    value: s.id,
    label: s.unitCode || s.location.area
  }));

  const financialYearOptions = financialYears.map(fy => ({
    value: fy.id,
    label: fy.financial_year_value
  }));

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedDocument, setParsedDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Event handlers
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);
      setParsedDocument(null);
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    try {
      setUploadLoading(true);
      setUploadError(null);
      setUploadProgress(10);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      setUploadProgress(30);

      // Make API call to parse document
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents/upload`,
        {},
        formData,
        "POST"
      );

      setUploadProgress(80);

      if (isSuccess && data) {
        setUploadProgress(100);
        setParsedDocument(data);
        setUploadSuccess(true);
      } else {
        setUploadError("Failed to parse the document. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("An error occurred while uploading the document. Please try again.");
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
    }
  }, [selectedFile]);

  const handleSave = useCallback((savedData, updatedData) => {
    console.log('Hanlde Save called');
    // Update the parsed document with new data
    setParsedDocument(prevDocument => ({
      ...prevDocument,
      ...updatedData
    }));

    setSaveSuccess(true);
    setSaveError(null);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);

    console.log('Hanlde Hide called');
    handleHide();

    if (onSave) {
      onSave();
    }
  }, []);

  const resetAll = useCallback(() => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    setParsedDocument(null);
    setUploadProgress(0);
    setSaveSuccess(false);
    setSaveError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClose = useCallback(() => {
    resetAll();
    handleHide();
  }, [resetAll, handleHide]);

  const renderUploadSection = useCallback(() => (
    <div className="upload-section">
      <div className="file-upload-container mb-3">
        <div className="file-upload-area p-4 text-center">
          <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-muted mb-3" />
          <h5 className="mb-3">Select a document to upload and parse</h5>
          <p className="text-muted mb-3">
            Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
          </p>
          <div className="file-input-wrapper">
            <Form.Control
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file-input"
              id="file-upload-modal"
            />
            <label htmlFor="file-upload-modal" className="file-input-label">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Choose File
            </label>
          </div>
          {selectedFile && (
            <Alert variant="info" className="text-start mt-3">
              <strong>Selected File:</strong> {selectedFile.name}<br />
              <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Alert>
          )}
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-3">
          <label className="form-label">Upload Progress</label>
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
        </div>
      )}

      {uploadError && (
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {uploadError}
        </Alert>
      )}

      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleFileUpload}
          disabled={!selectedFile || uploadLoading}
        >
          {uploadLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processing...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Upload & Parse Document
            </>
          )}
        </Button>
      </div>
    </div>
  ), [selectedFile, uploadProgress, uploadError, uploadLoading, handleFileSelect, handleFileUpload]);

  const renderSuccessSection = useCallback(() => (
    <div className="upload-success">
      <Alert variant="success">
        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
        Document uploaded and parsed successfully!
      </Alert>

      {parsedDocument.isExisting && (
        <Alert variant="info">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          <strong>File Found:</strong> Great news! We found this file in your system. You're viewing the existing document - feel free to review or update any information as needed.
        </Alert>
      )}

      <Alert variant="info">
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        <strong>Review & Edit:</strong> Please review the parsed information below and make any necessary corrections before saving.
      </Alert>

      <div className="parsed-document-details">
        <h5>Document Information</h5>

        <DocumentForm
          editDocument={parsedDocument}
          frameworks={frameworks}
          sourceOptions={sourceOptions}
          financialYearOptions={financialYearOptions}
          onSave={handleSave}
          loading={saveLoading}
          error={saveError}
          success={saveSuccess}
        />
      </div>
    </div>
  ), [
    parsedDocument, 
    frameworks, 
    sourceOptions, 
    financialYearOptions, 
    handleSave, 
    saveLoading, 
    saveError, 
    saveSuccess, 
    resetAll,
  ]);

  return (
    <>         
      <Button
        variant="primary"
        onClick={handleShow}
        disabled={!canUploadDocument}
      >
        <FontAwesomeIcon icon={faUpload} className="me-2" />
        Upload New Document
      </Button>
      <Modal 
        show={show} 
        onHide={handleClose} 
        size={size} 
        centered={centered}
        className="document-upload-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUpload} className="me-2 text-primary" />
            Upload New Document
          </Modal.Title>
          <Button
            variant="link"
            className="btn-close-custom p-0 border-0"
            onClick={handleClose}
            disabled={uploadLoading || saveLoading}
          >
            <FontAwesomeIcon icon={faTimes} className="text-muted" />
          </Button>
        </Modal.Header>
        
        <Modal.Body className="px-4 pb-4">
          <div className="document-upload-content">
            {!uploadSuccess && !parsedDocument ? 
              renderUploadSection() : 
              renderSuccessSection()
            }
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0">
          <div className="d-flex justify-content-between w-100">
            <Button
              variant="outline-secondary"
              onClick={resetAll}
              disabled={uploadLoading || saveLoading}
            >
              Reset Form
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={uploadLoading || saveLoading}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DocumentUploadModal;