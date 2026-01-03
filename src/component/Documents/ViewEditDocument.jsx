import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import DocumentForm from "./DocumentForm";

const ViewEditDocument = forwardRef(({ 
  document, 
  frameworks, 
  sourceOptions, 
  financialYearOptions, 
  onSave,
  onDelete,
  error,
  success,
  disableEdit = false
}, ref) => {
  const [show, setShow] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleShow = (editMode = false) => {
    setIsEditMode(disableEdit ? false : editMode);
    setShow(true);
  };

  const handleHide = () => {
    setShow(false);
    setIsEditMode(false);
  };

  const handleToggleMode = () => {
    if (disableEdit) return;
    setIsEditMode(!isEditMode);
  };

  const handleSave = (savedData, updatedData) => {
    if (onSave) {
      onSave(savedData, updatedData);
    }

    handleHide();

    // Auto-close after successful save with a delay
    if (success) {
      setTimeout(() => {
        handleHide();
      }, 2000);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }

    handleHide();

    if (success) {
      setTimeout(() => {
        handleHide();
      }, 2000);
    }
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    show: handleShow,
    hide: handleHide,
    showView: () => handleShow(false),
    showEdit: () => handleShow(disableEdit ? false : true) // ✅ Prevent edit mode
  }));

  const modalTitle = isEditMode 
    ? `Edit Document: ${document?.id || "N/A"}`
    : `Document Details: ${document?.id || "N/A"}`;

  const titleIcon = isEditMode ? faEdit : faEye;

  return (
    <Modal show={show} onHide={handleHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={titleIcon} className="me-2" />
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {document ? (
          <div className={`document-container ${isEditMode ? 'edit-mode' : 'view-mode'}`}>
            
            {/* Mode Indicator */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="mode-indicator">
                <span className={`badge ${isEditMode ? 'bg-warning' : 'bg-info'}`}>
                  <FontAwesomeIcon icon={isEditMode ? faEdit : faEye} className="me-1" />
                  {isEditMode ? 'Edit Mode' : 'View Mode'}
                </span>
              </div>

              {/* Hide toggle if editing is disabled */}
              {!disableEdit && (
                <Button
                  variant={isEditMode ? "outline-secondary" : "outline-primary"}
                  size="sm"
                  onClick={handleToggleMode}
                >
                  <FontAwesomeIcon icon={isEditMode ? faEye : faEdit} className="me-1" />
                  {isEditMode ? 'Switch to View' : 'Switch to Edit'}
                </Button>
              )}
            </div>

            {/* Document Form */}
            <DocumentForm
              mode={isEditMode ? "edit" : "view"}
              editDocument={document}
              frameworks={frameworks}
              sourceOptions={sourceOptions}
              financialYearOptions={financialYearOptions}
              onSave={isEditMode && !disableEdit ? handleSave : undefined}
              onDelete={!disableEdit ? handleDelete : undefined}
              success={success}
              error={error}
              showModeToggle={false}
            />
          </div>
        ) : (
          <div className="text-center p-5">
            <p>No document data available.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          Close
        </Button>

        {!disableEdit && document && (
          <Button
            variant={isEditMode ? "outline-secondary" : "primary"}
            onClick={handleToggleMode}
          >
            <FontAwesomeIcon icon={isEditMode ? faEye : faEdit} className="me-1" />
            {isEditMode ? 'Switch to View' : 'Edit Document'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
});

ViewEditDocument.displayName = "ViewEditDocument";

export default ViewEditDocument;