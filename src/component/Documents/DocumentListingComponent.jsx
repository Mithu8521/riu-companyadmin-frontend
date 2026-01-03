import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFileInvoice,
  faDownload,
  faQuestionCircle,
  faTimes,
  faSync,
  faUpload,
  faEdit,
  faEye
} from "@fortawesome/free-solid-svg-icons";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { getStore } from "../../utils/UniversalFunction";
import DocumentUploadModal from "./DocumentUploadModal";
import { 
  getStartingMonth, 
  getFrequency, 
  getPeriod,
  getPeriodValue,
  generateTimePeriodOptions, 
  handlePeriodChange 
} from "../../utils/PeriodCalculationUtils";
import ViewEditDocument from "./ViewEditDocument";
import PreviewDocument from "./PreviewDocument";
import "./DocumentListingComponent.css";


const DocumentListingComponent = ({
  documents,
  sources,
  financialYears,
  loading: parentLoading = false,
  frameworks,
  onDocumentUpdate, // Callback to refresh the document list
  onDocumentDelete,
  onFiltersChange, // Callback to apply filters
}) => {

  const history = useHistory();
  const viewEditDocumentRef = useRef(null);
  const previewDocumentRef = useRef(null);

  // Memoized options for DocumentForm
  const sourceOptions = sources.map(s => ({
    value: s.id,
    label: s.unitCode || s.location.area
  }));

  const financialYearOptions = financialYears
    .map(fy => ({
      value: fy.id,
      label: fy.financial_year_value
    }));

  const moduleOptions = [...new Set(documents.map(doc => doc.moduleName))].map(moduleName => ({ value: moduleName, label: moduleName}));  

  const documentTypeToSubTypes = documents.reduce((acc, doc) => {
    const docType = doc.documentType;
    const subType = doc.documentMetadata?.documentSubType;

    if (!acc[docType]) {
      acc[docType] = new Set(); // use Set to avoid duplicates
    }

    if (!subType) return acc; // skip if missing

    acc[docType].add(subType);

    return acc;
  }, {});

  // Convert sets to arrays
  const documentTypeToSubTypesMap = Object.fromEntries(
    Object.entries(documentTypeToSubTypes).map(([docType, subTypes]) => [docType, [...subTypes]])
  );

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  // Filter state
  const [financialYearId, setFinancialYearId] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedDocumentSubType, setSelectedDocumentSubType] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Financial Year to Frequency mapping
  const [financialYearToFrequency, setFinancialYearToFrequency] = useState({});

  // Time period state
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [disablePeriodSelection, setDisablePeriodSelection] = useState(true);

  const financialYearStartMonth = useMemo(() => getStartingMonth(), []);

  // Get all unique frequencies from documents
  const allFrequencies = useMemo(() => {
    if (!financialYearToFrequency) return [];

    const frequencies = new Set(['YEARLY']); // Always include YEARLY
    documents.forEach(doc => {
      if (doc.frequency && doc.frequency !== 'EVERY_FY') {
        frequencies.add(financialYearToFrequency[doc.financialYearId]);
      }
    });
    return Array.from(frequencies);
  }, [documents, financialYearToFrequency]);

  // Document filtering and processing functions
  const filterDocuments = useCallback((documents, filters) => {
    if (!documents || !financialYearToFrequency || !Array.isArray(documents)) {
      return [];
    }

    const {
      financialYearId,
      moduleName,
      locationId,
      frequency,
      fromDate,
      toDate,
      documentType,
      documentSubType,
    } = filters;

    return documents.filter(document => {
      // Financial Year Filter
      if (financialYearId && document.financialYearId !== parseInt(financialYearId)) {
        return false;
      }

      // Financial Year Filter
      if (moduleName && document.moduleName !== moduleName) {
        return false;
      }

      // Location Filter (sourceId)
      if (locationId && document.sourceId !== parseInt(locationId)) {
        return false;
      }

      // Document Type Filter
      if (documentType && document.documentType !== documentType) {
        return false;
      }

      // Document Sub Type Filter
      if (documentSubType && document.documentMetadata?.documentSubType !== documentSubType) {
        return false;
      }

      // Frequency Filter
      if (frequency && ((frequency === 'YEARLY' && document.frequency !== 'EVERY_FY') || financialYearToFrequency[document.financialYearId] !== frequency)) {
        return false;
      }

      // Date Range Filter (when period/dates are selected)
      if (fromDate && toDate) {
        return document.fromDate === fromDate && document.toDate === toDate;
      }

      return true;
    });
  }, [financialYearToFrequency]);

  // Filtered and processed documents
  const filteredDocuments = useMemo(() => {
    let processedDocuments = documents;

    // Apply filters
    const filters = {
      financialYearId,
      locationId: selectedLocation,
      frequency: selectedFrequency,
      moduleName: selectedModule,
      documentType: selectedDocumentType,
      documentSubType: selectedDocumentSubType,
      fromDate: filterFromDate,
      toDate: filterToDate,
    };

    processedDocuments = filterDocuments(processedDocuments, filters);

    return processedDocuments;
  }, [
    documents, 
    financialYearId, 
    selectedModule, 
    selectedDocumentType, 
    selectedDocumentSubType, 
    selectedLocation, 
    selectedFrequency, 
    filterFromDate, 
    filterToDate, 
    filterDocuments
  ]);

  // Modal state
  const [currentDocument, setCurrentDocument] = useState(null);
  const [editError, setEditError] = useState();
  const [editSuccess, setEditSuccess] = useState();

  // Update your existing modal functions:
  const openViewEditModal = async (document) => {
    setCurrentDocument(document);
    viewEditDocumentRef.current?.show();
  };

  const openPreviewModal = (document) => {
    setCurrentDocument(document);
    previewDocumentRef.current?.show();
  };

  // Optional: Only if you need programmatic closing
  const closeViewEditModal = () => {
    setCurrentDocument(null);
    setEditError(null);
    setEditSuccess(false);
    viewEditDocumentRef.current?.hide();
  };

  // Optional: Only if you need programmatic closing
  const closePreviewModal = () => {
    setCurrentDocument(null);
    previewDocumentRef.current?.hide();
  };

  const currentUser = getStore("currentUser");

  // Date setters for period calculation
  const setFromDateFilter = useCallback((fromDate) => {
    setFilterFromDate(fromDate);
  }, []);

  const setToDateFilter = useCallback((toDate) => {
    setFilterToDate(toDate);
  }, []);

  // Handle financial year selection
  const handleFinancialYearChange = useCallback((selectedOption) => {
    setFinancialYearId(selectedOption);
    
    // Reset all other filters when financial year changes
    resetOtherFilters();
  }, [setFinancialYearId]);

  // Reset other filters (not financial year)
  const resetOtherFilters = useCallback(() => {
    setSelectedModule('');
    setSelectedDocumentType('');
    setSelectedDocumentSubType('');
    setSelectedLocation('');
    setSelectedFrequency('');
    setSelectedPeriod('');
    setFilterFromDate('');
    setFilterToDate('');
    setTimePeriodOptions([]);
    setDisablePeriodSelection(true);
  }, []);

  // Handle frequency change
  const handleFrequencyChange = useCallback((frequency) => {
    setSelectedFrequency(frequency);
    
    if (frequency && frequency !== 'EVERY_FY') {
      setDisablePeriodSelection(false);
    } else {
      setDisablePeriodSelection(true);
      setSelectedPeriod('');
    }
  }, []);

  // Handle period change
  const handlePeriodChangeFilter = useCallback((period) => {
    setSelectedPeriod(period);
    
    if (financialYearId && financialYearOptions) {
      const frequency = selectedFrequency === 'EVERY_FY' ? 'YEARLY' : selectedFrequency;
      handlePeriodChange(period, financialYearId, financialYearOptions, frequency, setFromDateFilter, setToDateFilter);
    }
  }, [financialYearId, financialYearOptions, selectedFrequency, setFromDateFilter, setToDateFilter]);

  // Fetch frequency data for all financial years
  useEffect(() => {
    const fetchAllFrequencies = async () => {
      const frequencyMap = {};
      
      for (const fy of financialYears) {
        try {
          const frequency = await getFrequency(fy.id);
          frequencyMap[fy.id] = frequency;
        } catch (err) {
          console.error(`Error fetching frequency for FY ${fy.id}`, err);
        }
      }
      
      setFinancialYearToFrequency(frequencyMap);
    };

    if (financialYears && financialYears.length > 0) {
      fetchAllFrequencies();
    }
  }, [financialYears]);

  // Generate time period options when frequency or financial year changes
  useEffect(() => {
    if (!selectedFrequency || !financialYearId || !financialYearStartMonth) return;

    if (selectedFrequency === 'EVERY_FY') {
      const timePeriodOpts = generateTimePeriodOptions('YEARLY', financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
    } else {
      const timePeriodOpts = generateTimePeriodOptions(selectedFrequency, financialYearStartMonth);
      setTimePeriodOptions(timePeriodOpts);
    }
  }, [selectedFrequency, financialYearId, financialYearStartMonth]);

  // Apply filters
  const applyFilters = useCallback(() => {
    const filters = {
      financialYearId,
      locationId: selectedLocation,
      frequency: selectedFrequency,
      period: selectedPeriod,
      fromDate: filterFromDate,
      toDate: filterToDate,
    };

    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [financialYearId, selectedLocation, selectedFrequency, selectedPeriod, filterFromDate, filterToDate, onFiltersChange]);

  // Reset all filters (excluding financial year)
  const resetFilters = useCallback(() => {
    resetOtherFilters();
    
    // Apply filters with reset values
    const filters = {
      financialYearId: '',
      moduleName: '',
      documentType: '',
      documentSubType: '',
      locationId: '',
      frequency: '',
      period: '',
      fromDate: '',
      toDate: '',
    };

    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [resetOtherFilters, onFiltersChange]);

  // Handle document save from edit form
  const handleDocumentSave = (savedData, updatedData) => {
    setEditSuccess(true);
    setEditError(null);
    
    // Update the current document with the saved data
    setCurrentDocument(prev => ({
      ...prev,
      ...updatedData
    }));

    // Call parent callback to refresh the document list
    if (onDocumentUpdate) {
      onDocumentUpdate();
    }
  };

  const handleDocumentDelete = () => {
    setEditSuccess(true);
    setEditError(null);

    if (onDocumentDelete) {
      onDocumentDelete();
    }
  }

  // Navigate to reporting modules with document ID
  const navigateToReportingModule = (documentId) => {
    history.push(`/reporting-modules?documentId=${documentId}`);
  };

  const navigateToUpload = () => {
    history.push('/upload-document');
  };

  // Helper function to get frequency label for display
  const getFrequencyLabel = (frequency) => {
    if (frequency === 'EVERY_FY') return 'YEARLY';
    return frequency;
  };

  return (
    <div className="document-listing-container">
      {/* Always visible section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Documents</h2>

        {/* Document Upload Modal */}
        <DocumentUploadModal onSave={handleDocumentSave}/>
      </div>

      <Card className="filter-card mb-4">
        <Card.Body>
          <Row>
            {/* Filter and Reset Buttons */}
            <Col md={3} className="mb-3 d-flex">
              <Button variant="primary" className="me-2 flex-grow-1" onClick={applyFilters}>
                <FontAwesomeIcon icon={faFilter} className="me-1" />
                Apply Filters
              </Button>
              <Button variant="outline-secondary" className="flex-grow-1" onClick={resetFilters}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                Reset
              </Button>
            </Col>
          </Row>

          <Row>
            {/* Financial Year Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Financial Year</Form.Label>
                <Form.Select
                  value={financialYearId}
                  onChange={(e) => handleFinancialYearChange(e.target.value)}
                >
                  <option value="">All Financial Years</option>
                  {financialYearOptions && (financialYearOptions.map((fy) => (
                    <option key={fy.value} value={fy.value}>
                      {fy.label}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Module Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Module</Form.Label>
                <Form.Select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  <option value="">All Modules</option>
                  {moduleOptions && (moduleOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Document Type Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                >
                  <option value="">All Document Types</option>
                  {Object.keys(documentTypeToSubTypesMap) && (Object.keys(documentTypeToSubTypesMap).map((docType) => (
                    <option key={docType} value={docType}>
                      {docType}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Document Sub Type Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Document Sub Type</Form.Label>
                <Form.Select
                  value={selectedDocumentSubType}
                  onChange={(e) => setSelectedDocumentSubType(e.target.value)}
                  disabled={!documentTypeToSubTypesMap[selectedDocumentType]}
                >
                  <option value="">All Document Sub Types</option>
                  {selectedDocumentType && documentTypeToSubTypesMap[selectedDocumentType] && (documentTypeToSubTypesMap[selectedDocumentType].map((docSubType) => (
                    <option key={docSubType} value={docSubType}>
                      {docSubType}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* Location Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {sourceOptions && (sourceOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Frequency Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Frequency</Form.Label>
                <Form.Select
                  value={selectedFrequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                >
                  <option value="">All Frequencies</option>
                  {allFrequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {getFrequencyLabel(freq)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Period Filter */}
            <Col md={3} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Period</Form.Label>
                <Form.Select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChangeFilter(e.target.value)}
                  disabled={disablePeriodSelection || !selectedFrequency}
                >
                  <option value="">Select Period</option>
                  {timePeriodOptions && (timePeriodOptions.map((tp) => (
                    <option key={tp.value} value={tp.value}>
                      {tp.label}
                    </option>
                  )))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Date Range Display (when period is selected) */}
          {filterFromDate && filterToDate && (
            <Row>
              <Col md={12}>
                <div className="alert alert-info">
                  <strong>Selected Period:</strong> {moment(filterFromDate).format("DD MMM YYYY")} to {moment(filterToDate).format("DD MMM YYYY")}
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-3"
            onClick={applyFilters}
          >
            <FontAwesomeIcon icon={faSync} className="me-1" /> Retry
          </Button>
        </div>
      )}

      {/* Edit Error Message */}
      {editError && (
        <div className="alert alert-danger" role="alert">
          {editError}
        </div>
      )}

      <div className="documents-container">
        {filteredDocuments.length > 0 ? (
          <Row>
            {filteredDocuments.map((document, index) => {
              const documentFrequency = financialYearToFrequency[document.financialYearId];
              
              return (
                <Col
                  md={4}
                  className="mb-4"
                  key={document.id}
                >
                  <Card className="document-card h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <strong>Document ID: {document.id || "N/A"}</strong>
                      <div>
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
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          title="Preview Document"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreviewModal(document);
                          }}
                        >
                          <FontAwesomeIcon icon={faFileInvoice} />
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          title="Ask Question"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToReportingModule(document.id || document.uuid);
                          }}
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body 
                      className="clickable-card-body"
                      onClick={() => openViewEditModal(document)}
                      style={{ cursor: 'pointer' }}
                      title="Click to view document details"
                    >
                      <div className="document-details">
                        <p>
                          <strong>File Name:</strong> {document.fileMetadata?.fileName || "N/A"}
                        </p>
                        <p>
                          <strong>Upload Date:</strong> {document.createdAt 
                            ? moment(document.createdAt).format("DD MMM YYYY") 
                            : "N/A"}
                        </p>
                        <p>
                          <strong>User:</strong> {`${document.createdBy.first_name} ${document.createdBy.last_name}` || "N/A"}
                        </p>
                        {/* Display additional filter-related info */}
                        {document.moduleName && (
                          <p>
                            <strong>Module:</strong> {document.moduleName}
                          </p>
                        )}
                        {document.documentType && (
                          <p>
                            <strong>Document Type:</strong> {document.documentType}
                          </p>
                        )}
                        {document.documentSubType && (
                          <p>
                            <strong>Document Sub Type:</strong> {document.documentSubType}
                          </p>
                        )}
                        {document.sourceId && (
                          <p>
                            <strong>Location:</strong> {sourceOptions.find(s => s.value === document.sourceId)?.label || "N/A"}
                          </p>
                        )}
                        {document.frequency && (
                          <p>
                            <strong>Frequency:</strong> {document.frequency === 'EVERY_FY' ? 'YEARLY' : documentFrequency}
                          </p>
                        )}
                        {document.fromDate && document.toDate && (
                          <p>
                            <strong>Period:</strong> {getPeriodValue(document.fromDate, document.toDate)}
                          </p>
                        )}
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-end">
                      {document.fileMetadata?.url && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          title="Download Document"
                          href={document.fileMetadata.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon icon={faDownload} /> Download
                        </Button>
                      )}
                      {!document.fileMetadata?.url && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          disabled
                          title="Download not available"
                        >
                          <FontAwesomeIcon icon={faDownload} /> Download
                        </Button>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : parentLoading || loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center p-5">
            <h4>No documents match your filters</h4>
            <p>Try adjusting your search term or filter criteria to find documents.</p>
            <Button 
              variant="outline-primary" 
              onClick={resetFilters}
              className="mt-2 me-3"
            >
              <FontAwesomeIcon icon={faSync} className="me-2" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="text-center p-5">
            <h4>No documents found</h4>
            <p>Get started by uploading your first document.</p>
            <Button 
              variant="primary" 
              onClick={navigateToUpload}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Upload Document
            </Button>
          </div>
        )}

        {/* Loading Spinner for more items */}
        {(loading || parentLoading) && documents.length > 0 && (
          <div className="text-center p-3">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading more documents...</span>
            </Spinner>
          </div>
        )}
      </div>

      <ViewEditDocument
        ref={viewEditDocumentRef}
        document={currentDocument}
        frameworks={frameworks}
        sourceOptions={sourceOptions}
        financialYearOptions={financialYearOptions}
        onSave={handleDocumentSave}
        onDelete={handleDocumentDelete}
        error={editError}
        success={editSuccess}
      />

      <PreviewDocument
        ref={previewDocumentRef}
        document={currentDocument}
        onAskQuestion={navigateToReportingModule}
      />

      {/* Custom Styles */}
      <style jsx>{`
        .metadata-item {
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .metadata-item:last-child {
          border-bottom: none;
        }
        
        .metadata-value {
          display: block;
          margin-left: 1rem;
          color: #495057;
          font-weight: 500;
        }
        
        .hash-text {
          font-family: monospace;
          font-size: 0.85rem;
          word-break: break-all;
        }
        
        .file-url-link {
          color: #007bff;
          text-decoration: none;
        }
        
        .file-url-link:hover {
          text-decoration: underline;
        }
        
        .file-metadata-section {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 0.375rem;
          border: 1px solid #dee2e6;
        }
        
        .file-metadata-section h6 {
          margin-bottom: 1rem;
          color: #495057;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default DocumentListingComponent;