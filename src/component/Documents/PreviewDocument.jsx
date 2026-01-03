import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faDownload, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const PreviewDocument = forwardRef(({ 
  document, 
  onAskQuestion 
}, ref) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide
  }));

  return (
    <Modal show={show} onHide={handleHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Document Preview: {document && (document.document_id || document.id || "N/A")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {document && (
          <div className="document-preview">
            {/* Document preview iframe */}
            <div className="document-preview-placeholder">
              {document.fileMetadata?.url ? (
                <iframe
                  src={document.fileMetadata.url}
                  title="Document Preview"
                  width="100%"
                  height="500px"
                  className="document-preview-frame"
                />
              ) : (
                <div className="preview-not-available">
                  <p>Preview not available for this document.</p>
                </div>
              )}
            </div>

            <div className="document-metadata mt-3">
              <h6>Document Details:</h6>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Document ID:</strong> {document.id || "N/A"}
                  </p>
                  <p>
                    <strong>File Name:</strong> {document.fileMetadata?.fileName || "N/A"}
                  </p>
                  <p>
                    <strong>Upload Date:</strong>{" "}
                    {document.createdAt ? moment(document.createdAt).format("DD MMM YYYY") 
                      : "N/A"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>User ID:</strong> {document.createdById || "N/A"}
                  </p>
                  <p>
                    <strong>Hash:</strong>{" "}
                    <span className="document-hash">{document.fileMetadata?.hash || "N/A"}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>
          Close
        </Button>
        {document && (
          <>
            <Button
              variant="primary"
              onClick={() => onAskQuestion && onAskQuestion(document.fileMetadata?.uuid)}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="me-1" />
              Ask Question
            </Button>
            {document.fileMetadata?.url && (
              <Button 
                variant="outline-secondary"
                href={document.fileMetadata.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                Download
              </Button>
            )}
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
});

PreviewDocument.displayName = "PreviewDocument";

export default PreviewDocument;