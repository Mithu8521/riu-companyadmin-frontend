import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Close from "../img/Close.png";

// Default principles data
const defaultPrinciplesData = [
  { id: 1, title: "Principle 1 (Ethics, Integrity, and Transparency)" },
  { id: 2, title: "Principle 2 (Product lifecycle sustainability)" },
  { id: 3, title: "Principle 3 (Employee well-being)" },
  { id: 4, title: "Principle 4 (Stakeholder Engagement)" },
  { id: 5, title: "Principle 5 (Human Rights)" },
  { id: 6, title: "Principle 6 (Environment)" },
  { id: 7, title: "Principle 7 (Public Policy Advocacy)" },
  { id: 8, title: "Principle 8 (Inclusive and equitable growth)" },
  { id: 9, title: "Principle 9 (Customer Value)" },
];

// New Topic Creation Modal Component
const CreateTopicModal = ({
  show,
  onClose,
  onCreateTopic,
  principlesData = defaultPrinciplesData,
  setUpdatedTopics,
  existingTopics = [], // Add this prop to check for duplicates
}) => {
  const [topicName, setTopicName] = useState("");
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const [error, setError] = useState(""); // Add error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  const handlePrincipleChange = (principle) => {
    const isSelected = selectedPrinciples.some((p) => p.id === principle.id);

    if (isSelected) {
      setSelectedPrinciples(
        selectedPrinciples.filter((p) => p.id !== principle.id)
      );
    } else {
      setSelectedPrinciples([...selectedPrinciples, principle]);
    }
  };

  // Function to check if topic name already exists
  const checkTopicExists = (name) => {
    return existingTopics.some(
      (topic) => topic.topic?.toLowerCase().trim() === name.toLowerCase().trim()
    );
  };

  // Handle topic name change with validation
  const handleTopicNameChange = (e) => {
    const value = e.target.value;
    setTopicName(value);
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
    
    // Check for duplicate while typing (debounced effect)
    if (value.trim() && checkTopicExists(value)) {
      setError("A topic with this name already exists. Please choose a different name.");
    }
  };

  const handleCreateTopic = async () => {
    const trimmedTopicName = topicName.trim();
    
    // Validation checks
    if (!trimmedTopicName) {
      setError("Topic name is required.");
      return;
    }
    
    if (selectedPrinciples.length === 0) {
      setError("Please select at least one principle.");
      return;
    }
    
    if (checkTopicExists(trimmedTopicName)) {
      setError("A topic with this name already exists. Please choose a different name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const principleIds = selectedPrinciples.map((principle) => principle.id);

      const { isSuccess, data, error: apiError } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}createNewTopic`,
        {},
        { topic: trimmedTopicName, principles: principleIds },
        "POST"
      );

      if (isSuccess) {
        setUpdatedTopics(Math.floor(Math.random() * 100));
        handleClose();
      } else {
        // Handle API error
        setError(apiError?.message || "Failed to create topic. Please try again.");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTopicName("");
    setSelectedPrinciples([]);
    setError("");
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = topicName.trim() && 
                    selectedPrinciples.length > 0 && 
                    !error && 
                    !checkTopicExists(topicName.trim());

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      backdrop={false}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        
      }}
    >
      <Modal.Header style={modalHeaderStyle()}>
        <Modal.Title style={modalTitleStyle()}>Create New Topic</Modal.Title>
        <Button variant="link" style={closeButtonStyle()} onClick={handleClose}>
          <img
            src={Close}
            alt="close"
            style={{ width: "20px", cursor: "pointer" }}
          />
        </Button>
      </Modal.Header>

      <Modal.Body style={modalBodyStyle()}>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" style={{ marginBottom: "1rem" }}>
            {error}
          </Alert>
        )}

        {/* Topic Name Input */}
        <div style={{ marginBottom: "1.5em" }}>
          <label
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Topic Name <span style={{ color: "red" }}>*</span>
          </label>
          <Form.Control
            type="text"
            placeholder="Enter topic name"
            value={topicName}
            onChange={handleTopicNameChange}
            style={{
              ...searchInputStyle(),
              borderColor: error && error.includes("name") ? "#dc3545" : "#ccc"
            }}
            isInvalid={error && error.includes("name")}
          />
          {/* Real-time validation feedback */}
          {topicName.trim() && checkTopicExists(topicName.trim()) && (
            <div style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              This topic name already exists
            </div>
          )}
        </div>

        {/* Selected Principles Display */}
        {selectedPrinciples.length > 0 && (
          <div style={{ marginBottom: "1.5em" }}>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Selected Principles ({selectedPrinciples.length})
            </label>
            <div style={selectedPrinciplesBoxStyle()}>
              {selectedPrinciples.map((principle) => (
                <div key={principle.id} style={selectedPrincipleItemStyle()}>
                  <span>{principle.title}</span>
                  <button
                    style={removeButtonStyle()}
                    onClick={() => handlePrincipleChange(principle)}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Principles Selection */}
        <div>
          <label
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Select Principles <span style={{ color: "red" }}>*</span>
            <span style={{ fontWeight: "normal", fontSize: "0.9em", color: "#666" }}>
              (Multiple Selection)
            </span>
          </label>
          <div style={principlesContainerStyle()}>
            {principlesData.length > 0 ? (
              principlesData.map((principle) => (
                <div
                  key={principle.id}
                  style={{ marginBottom: "10px", fontSize: "14px" }}
                >
                  <label
                    style={{
                      margin: "4px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      style={checkboxStyle()}
                      checked={selectedPrinciples.some(
                        (p) => p.id === principle.id
                      )}
                      onChange={() => handlePrincipleChange(principle)}
                    />
                    <span style={{ marginLeft: "8px" }}>{principle.title}</span>
                  </label>
                </div>
              ))
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                No principles available
              </p>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={modalFooterStyle()}>
        <Button
          variant="secondary"
          onClick={handleClose}
          style={cancelButtonStyle()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
   
        <Button
          variant="primary"
          onClick={handleCreateTopic}
          disabled={!isFormValid || isSubmitting}
          style={{
            ...saveButtonStyle(),
            opacity: (!isFormValid || isSubmitting) ? 0.6 : 1
          }}
        >
          {isSubmitting ? "Creating..." : "Create Topic"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Main Training Filter Modal Component
const TrainingFilterModal = ({
  show,
  onClose,
  topicMapping,
  setTopicMapping,
  trainingTopicData,
  principlesData = defaultPrinciplesData,
  onCreateTopic,
  setUpdatedTopics,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTopicChange = (topic) => {
    const isAlreadySelected = topicMapping.some(
      (selectedTopic) => selectedTopic.id === topic.id
    );

    let updatedTopics;
    if (isAlreadySelected) {
      updatedTopics = topicMapping.filter(
        (selectedTopic) => selectedTopic.id !== topic.id
      );
    } else {
      updatedTopics = [...topicMapping, topic];
    }

    setTopicMapping(updatedTopics);
  };

  const handleRemoveSelectedTopic = (topicId) => {
    const updatedTopics = topicMapping.filter(
      (selectedTopic) => selectedTopic.id !== topicId
    );
    setTopicMapping(updatedTopics);
  };

  const handleCreateTopic = (newTopic) => {
    if (onCreateTopic) {
      onCreateTopic(newTopic);
    }
  };

  const filteredTopics = trainingTopicData.filter((topic) =>
    topic.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTopicSelected = (topicId) =>
    topicMapping.some((selectedTopic) => selectedTopic.id === topicId);

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        size="md"
        centered
        backdrop={false}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          
        }}
      >
        <Modal.Header style={modalHeaderStyle()}>
          <Modal.Title style={modalTitleStyle()}>
            Topic Filter
            {topicMapping.length > 0 && (
              <span style={{ fontSize: "0.9em", color: "#666", marginLeft: "10px" }}>
                ({topicMapping.length} selected)
              </span>
            )}
          </Modal.Title>
          <Button variant="link" style={closeButtonStyle()} onClick={onClose}>
            <img
              src={Close}
              alt="close"
              style={{ width: "20px", cursor: "pointer" }}
            />
          </Button>
        </Modal.Header>

        <Modal.Body style={modalBodyStyle()}>
          {/* Search Input with Add Button */}
          <div
            style={{
              marginBottom: "1em",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Form.Control
              type="text"
              placeholder="Search topics"
              value={searchTerm}
              onChange={handleSearchChange}
              style={searchInputStyle()}
            />
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              style={addButtonStyle()}
              title="Add new topic"
            >
              +
            </Button>
          </div>

          {/* Selected Topics Box */}
          {topicMapping.length > 0 && (
            <div style={selectedTopicsBoxStyle()}>
              {topicMapping.map((topic) => (
                <div key={topic.id} style={selectedTopicItemStyle()}>
                  <span>{topic.topic}</span>
                  <button
                    style={removeButtonStyle()}
                    onClick={() => handleRemoveSelectedTopic(topic.id)}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Training Topic List */}
          <div style={trainingTopicContainerStyle()}>
            <div
              style={{
                fontSize: "16px",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              Training Topics ({filteredTopics.length} available)
            </div>
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  style={{ marginBottom: "10px", fontSize: "14px" }}
                >
                  <label
                    style={{
                      margin: "4px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      style={checkboxStyle()}
                      checked={isTopicSelected(topic.id)}
                      onChange={() => handleTopicChange(topic)}
                    />
                    <span style={{ marginLeft: "8px" }}>{topic?.topic}</span>
                  </label>
                </div>
              ))
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                {searchTerm ? 
                  `No topics found matching "${searchTerm}"` : 
                  "No topics available"
                }
              </p>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer style={modalFooterStyle()}>
          <Button variant="primary" onClick={onClose} style={saveButtonStyle()}>
            Save Selection
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Topic Modal */}
      <CreateTopicModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTopic={handleCreateTopic}
        principlesData={principlesData}
        setUpdatedTopics={setUpdatedTopics}
        existingTopics={trainingTopicData} // Pass existing topics for validation
      />
    </>
  );
};

// Existing styles (keeping all previous styles)
const modalHeaderStyle = () => ({
  borderBottom: "1px solid #dee2e6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
});

const modalTitleStyle = () => ({
  fontSize: "1.25rem",
  fontWeight: "600",
});

const modalBodyStyle = () => ({
  padding: "1rem",
  maxHeight: "calc(100vh - 210px)",
  overflowY: "auto",
});

const modalFooterStyle = () => ({
  borderTop: "1px solid #dee2e6",
  display: "flex",
  justifyContent: "flex-end",
  padding: "1rem",
});

const closeButtonStyle = () => ({
  background: "transparent",
  border: "none",
  padding: "0",
  cursor: "pointer",
});

const searchInputStyle = () => ({
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
});

const trainingTopicContainerStyle = () => ({
  overflow: "auto",
  marginTop: "20px",
  paddingLeft: "10px",
  maxHeight: "250px",
});

const checkboxStyle = () => ({
  width: "16px",
  height: "16px",
  marginRight: "10px",
  border: "2px solid #3F88A5",
  borderRadius: "4px",
  cursor: "pointer",
});

const selectedTopicsBoxStyle = () => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  backgroundColor: "#f9f9f9",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "15px",
  maxHeight: "200px",
  overflowY: "auto",
});

const selectedTopicItemStyle = () => ({
  backgroundColor: "#3F88A5",
  color: "white",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  height: "2rem",
});

const removeButtonStyle = () => ({
  background: "none",
  border: "none",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  padding: "0",
  marginLeft: "5px",
});

const saveButtonStyle = () => ({
  backgroundColor: "#3F88A5",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
});

const addButtonStyle = () => ({
  backgroundColor: "#3F88A5",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  minWidth: "45px",
  height: "45px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const principlesContainerStyle = () => ({
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  maxHeight: "200px",
  overflowY: "auto",
  backgroundColor: "#f9f9f9",
});

const selectedPrinciplesBoxStyle = () => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  backgroundColor: "#f0f8ff",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
});

const selectedPrincipleItemStyle = () => ({
  backgroundColor: "#007bff",
  color: "white",
  padding: "4px 8px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "12px",
});

const createButtonStyle = () => ({
  backgroundColor: "#28a745",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  color: "white",
});

const cancelButtonStyle = () => ({
  backgroundColor: "#6c757d",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  color: "white",
});

export default TrainingFilterModal;