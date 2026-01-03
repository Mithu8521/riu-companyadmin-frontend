import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import config from "../../../src/config/config.json";
import { apiCall } from "../../_services/apiCall";
import DocumentListingComponent from "./DocumentListingComponent";
import { useFrameworks, useSources, useFinancialYears } from "../../hooks/useApiData";
import "./DocumentManagement.css";

const DocumentManagement = (props) => {

  const frameworks = useFrameworks();
  const sources = useSources();
  const financialYears = useFinancialYears();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);


  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  // Fetch documents data without dependency checks initially
  const getDocuments = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents`,
        {},
        {},
        "GET"
      );
      if (isSuccess && data?.documents) {
        setDocuments(data?.documents || []);
      } else {
        console.error("Failed to fetch documents:", data);
        setError("Failed to fetch documents. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("An error occurred while fetching documents.");
    }
  };

  // Initial data loading
  useEffect(() => {
    console.log("Initial data loading useEffect running");

    getDocuments();

    setInitialLoadDone(true);
  }, []);

  const onDocumentUpdate = () => {
    console.log('Call Get DOcuments');
    getDocuments();
  }

  const onDocumentDelete = () => {
    getDocuments();
  }

  return (
    <div className="document-management-page">
      <Row className="flex-nowrap m-0 p-0">
        {/* Sidebar */}
        <Col xs={2} className="sidebar-container p-0">
          <Sidebar activePage="documents" onSidebarToggle={handleSidebarToggle}/>
        </Col>
        
        {/* Main Content */}
        <Col xs={10} className="content-area p-0">
          <div
            style={{
              flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
              transition: "flex 0.3s ease",
              minHeight: "100vh",
              overflowY: "auto",
            }}
          >
            <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
              <Header />
            </div>
            <div className="content-wrapper">
              <div className="page-header">
                <h1>Document Management</h1>
                <p>View and manage uploaded documents</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn btn-outline-danger ms-3"
                    onClick={getDocuments}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!initialLoadDone ? (
                <div className="loading-container">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <div className="mt-3">Loading document data...</div>
                </div>
              ) : (
                <DocumentListingComponent
                  documents={documents}
                  sources={sources}
                  financialYears={financialYears}
                  frameworks={frameworks}
                  loading={!initialLoadDone}
                  onDocumentUpdate={onDocumentUpdate}
                  onDocumentDelete={onDocumentDelete}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentManagement;