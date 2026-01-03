import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Table,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import image from "../../../img/Close.svg";
import "./operationalmodal.css";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEye,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReassignQuestionModal = ({
  handleAssignedDetails,
  financeObjct,
  questionIds,
  managementListValue,
  showReassignModal,
  handleReassignClose,
}) => {
  const today = formatDate(new Date());
  const [answer, setAnswer] = useState({
    financialYearId: financeObjct,
    assignedToIds: [],
    questionIds: questionIds,
    moduleType: "SQ",
    questionnaireType: "CA",
    dueDate: today,
  });
  const [error, setError] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());

  // Arrays for multiple selections
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRolesTwo, setSelectedRolesTwo] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersTwo, setSelectedUsersTwo] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [reAssignedToIds, setReAssignedToIds] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [range, setRange] = useState("");

  // For question details
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);

  const handleSave = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}reassignedQuestionToUser`,
      {},
      {
        ...answer,
        assignedToIds:
          answer.assignedToIds.length > 0
            ? answer.assignedToIds
            : selectedUsers,
        reAssignedToIds: reAssignedToIds,
      },
      "POST"
    );
    if (isSuccess) {
      handleAssignedDetails();
      handleReassignClose();
    }
  };

  const handleRangeInput = (e) => {
    const input = e.target.value;
    setRange(input);
    // Just store the input, don't apply it yet
    setError("");
  };

  // Apply the range when button is clicked
  const applyRange = () => {
    if (!range) {
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: [],
      }));
      return;
    }

    // Split by commas for multiple ranges
    const ranges = range.split(",").map((r) => r.trim());
    const newQuestionIds = [];
    let hasError = false;

    for (const rangeItem of ranges) {
      // Check for single number format
      if (/^\d+$/.test(rangeItem)) {
        const num = parseInt(rangeItem);
        if (num > 0 && num <= (assignedQuestions?.length || 0)) {
          if (assignedQuestions && assignedQuestions[num - 1]?.id) {
            newQuestionIds.push(assignedQuestions[num - 1].id);
          }
        } else {
          hasError = true;
          setError(`Number ${num} is out of valid question range.`);
          break;
        }
        continue;
      }

      // Check for range format "1-3"
      const rangePattern = /^(\d+)\s*-\s*(\d+)$/;
      const match = rangeItem.match(rangePattern);

      if (!match) {
        hasError = true;
        setError(
          "Please use the correct format: single numbers or ranges (e.g. 1-3,5,7-9)"
        );
        break;
      }

      const low = parseInt(match[1]);
      const high = parseInt(match[2]);

      if (low >= high) {
        hasError = true;
        setError("The lower number must be less than the higher number.");
        break;
      }

      if (low < 1 || high > (assignedQuestions?.length || 0)) {
        hasError = true;
        setError(
          `Range ${low}-${high} is outside valid question range (1-${
            assignedQuestions?.length || 0
          }).`
        );
        break;
      }

      // Add all question IDs in the range
      for (let i = low - 1; i < high; i++) {
        if (assignedQuestions && assignedQuestions[i]?.questionId) {
          newQuestionIds.push(assignedQuestions[i].questionId);
        }
      }
    }

    if (!hasError) {
      setError("");
      // Update the answer state with the valid question IDs
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: newQuestionIds,
      }));
    }
  };

  const data = "top";

  const fetchAssignedQuestions = async (userId) => {
    setLoadingUsers(true);
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAssignedReportingQuestionDetails`,
        {},
        { userId: userId },
        "GET"
      );
      if (response.isSuccess) {
        const data = response.data?.data || [];
        setAssignedQuestions(data.data);
      } else {
        console.error("Failed to fetch users:", response.message);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setAssignedQuestions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUsers = async (roleId) => {
    if (roleId) {
      setLoadingUsers(true);
      try {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSubUserBasedOnRoleId`,
          {},
          { roleId: roleId },
          "GET"
        );
        if (response.isSuccess) {
          const data = response.data?.data || [];
          const users = data.map((user) => ({
            id: user.userId,
            fullName: `${user.firstName} ${user.lastName} (${user.designation})`,
          }));
          setUsers(users);
        } else {
          console.error("Failed to fetch users:", response.message);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    }
  };

  const handleDate = (date) => {
    setDueDate(date);
    setAnswer({ ...answer, dueDate: formatDate(date) });
  };

  const handleCheckbox = (isChecked) => {
    setCheckboxChecked(isChecked);
    // Update answer state based on checkbox state
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserId = currentUser ? currentUser.id : null;

    if (isChecked) {
      setSelectedUsers([]);
      setSelectedRoles([]);
      setAnswer({
        ...answer,
        assignedToIds: [currentUserId],
      });
    } else {
      setAnswer({
        ...answer,
        assignedToIds: [],
      });
    }
  };

  // For multiple role selection
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    if (roleId && !selectedRoles.includes(roleId)) {
      const updatedRoles = [...selectedRoles, roleId];
      setSelectedRoles(updatedRoles);
      fetchUsers(roleId);
    }
  };

  // Remove a selected role
  const removeRole = (roleId) => {
    const updatedRoles = selectedRoles.filter((id) => id !== roleId);
    setSelectedRoles(updatedRoles);
  };

  // For multiple role selection in left column
  const handleRoleTwoChange = (e) => {
    const roleId = e.target.value;
    if (roleId && !selectedRolesTwo.includes(roleId)) {
      const updatedRoles = [...selectedRolesTwo, roleId];
      setSelectedRolesTwo(updatedRoles);
      fetchUsers(roleId);
    }
  };

  // Remove a selected role from left column
  const removeRoleTwo = (roleId) => {
    const updatedRoles = selectedRolesTwo.filter((id) => id !== roleId);
    setSelectedRolesTwo(updatedRoles);
  };

  // For multiple user selection
  const handleUserChange = (e) => {
    const userId = e.target.value;
    if (userId && !selectedUsers.includes(userId)) {
      const updatedUsers = [...selectedUsers, userId];
      setSelectedUsers(updatedUsers);

      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        assignedToIds: updatedUsers,
      }));
    }
  };

  // Remove a selected user
  const removeUser = (userId) => {
    const updatedUsers = selectedUsers.filter((id) => id !== userId);
    setSelectedUsers(updatedUsers);

    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      assignedToIds: updatedUsers,
    }));
  };

  // For multiple user selection in left column
  const handleUserTwoChange = (e) => {
    const userId = e.target.value;
    if (userId && !selectedUsersTwo.includes(userId)) {
      const updatedUsers = [...selectedUsersTwo, userId];
      setSelectedUsersTwo(updatedUsers);
      setReAssignedToIds(updatedUsers);

      // Fetch assigned questions for the first selected user
      if (updatedUsers.length === 1) {
        fetchAssignedQuestions(userId);
      } else if (updatedUsers.length > 1) {
        // For multiple users, you might need to merge questions from all users
        fetchAssignedQuestions(userId);
      }
    }
  };

  // Remove a selected user from left column
  const removeUserTwo = (userId) => {
    const updatedUsers = selectedUsersTwo.filter((id) => id !== userId);
    setSelectedUsersTwo(updatedUsers);
    setReAssignedToIds(updatedUsers);

    if (updatedUsers.length === 0) {
      setAssignedQuestions([]);
    } else {
      // Fetch questions for the first remaining user
      fetchAssignedQuestions(updatedUsers[0]);
    }
  };

  // Function to close question details
  const closeQuestionDetails = () => {
    setSelectedQuestion(null);
    setShowQuestionDetails(false);
  };

  useEffect(() => {
    setAnswer((prevAnswer) => {
      return {
        ...prevAnswer,
        financialYearId: financeObjct,
      };
    });
  }, [financeObjct]);

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = managementListValue?.find((role) => role.id == roleId);
    return role ? role.role_name : `Role ${roleId}`;
  };

  // Get user name by ID
  const getUserName = (userId) => {
    if (userId) {
      const user = users.find((user) => user.id == userId);
      return user ? user.fullName : `User ${userId}`;
    }
  };

  const handleCheckboxClick = (questionId) => {
    if (answer.questionIds.includes(questionId)) {
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: answer.questionIds.filter((id) => id !== questionId),
      }));
    } else {
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: [...answer.questionIds, questionId],
      }));
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      const allQuestionIds = assignedQuestions.map((item) => item.questionId);
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: allQuestionIds,
      }));
    } else {
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        questionIds: [],
      }));
    }
  };
  const styles = {
    container: {
      width: "100%",
    },
    header: {
      padding: "20px 30px",
      borderBottom: "1px solid #f0f0f0",
    },
    title: {
      color: "#3F88A5",
      fontSize: "18px",
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#666",
      fontSize: "18px",
      cursor: "pointer",
      transition: "color 0.2s ease",
      padding: "5px",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    body: {
      padding: "20px 30px",
    },
    formLabel: {
      color: "#333",
      fontSize: "16px",
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 500,
      marginBottom: "8px",
    },
    formControl: {
      border: "1px solid #3F88A5",
      borderRadius: "6px",
      padding: "10px 15px",
      fontSize: "14px",
      boxShadow: "none",
      transition: "box-shadow 0.2s ease",
    },
    tagChip: {
      background: "#f0f7fa",
      borderRadius: "20px",
      padding: "6px 12px",
      margin: "0 8px 8px 0",
      fontSize: "13px",
      border: "1px solid #3F88A5",
      display: "inline-flex",
      alignItems: "center",
    },
    removeTag: {
      marginLeft: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      color: "#666",
      fontSize: "14px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#e8e8e8",
      transition: "background 0.2s ease",
    },
    alertBox: {
      padding: "18px",
      backgroundColor: "#f8fcff",
      border: "1px solid #d1e9f3",
      borderRadius: "8px",
      marginTop: "15px",
      display: "flex",
      alignItems: "flex-start",
    },
    alertIcon: {
      color: "#3F88A5",
      marginRight: "12px",
      fontSize: "18px",
      marginTop: "2px",
    },
    alertText: {
      color: "#444",
      fontSize: "14px",
      lineHeight: "1.5",
    },
    viewAllButton: {
      color: "#3F88A5",
      textDecoration: "none",
      padding: "0 0 0 10px",
      fontSize: "14px",
      background: "none",
      border: "none",
      fontWeight: "600",
      transition: "color 0.2s ease",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 30px",
      borderTop: "1px solid #f0f0f0",
    },
    cancelButton: {
      borderColor: "#3F88A5",
      fontSize: "14px",
      fontFamily: "Open Sans, sans-serif",
      fontWeight: "600",
      backgroundColor: "white",
      color: "#3F88A5",
      padding: "8px 25px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    saveButton: {
      borderColor: "#3F88A5",
      fontSize: "14px",
      fontFamily: "Open Sans, sans-serif",
      fontWeight: "600",
      backgroundColor: "#3F88A5",
      color: "white",
      padding: "8px 25px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(63, 136, 165, 0.2)",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "15px",
      marginTop: "20px",
    },
    datePickerInput: {
      border: "1px solid #3F88A5",
      borderRadius: "6px",
      padding: "10px 15px",
      fontSize: "14px",
      backgroundColor: "#f8f9fa",
      cursor: "pointer",
      width: "100%",
    },
    checkboxLabel: {
      fontSize: "14px",
      color: "#444",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    checkboxInput: {
      marginRight: "8px",
      cursor: "pointer",
    },
  };
  return (
    <>
      <Modal
        show={showReassignModal}
        onHide={handleReassignClose}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header style={styles.header}>
          <Modal.Title style={styles.title}>Reassign Question</Modal.Title>

          <Button
            variant="link"
            onClick={handleReassignClose}
            style={styles.closeButton}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>

        <Modal.Body style={styles.body}>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label style={styles.formLabel}>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    className="shadow-sm"
                    value=""
                    style={styles.formControl}
                    onChange={handleRoleTwoChange}
                  >
                    <option value="">Select a Role</option>
                    {managementListValue?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {/* Selected roles display */}
                {selectedRolesTwo.length > 0 && (
                  <div className="mb-4">
                    {selectedRolesTwo.map((roleId) => (
                      <div key={roleId} style={styles.tagChip}>
                        {getRoleName(roleId)}
                        <span
                          onClick={() => removeRoleTwo(roleId)}
                          style={styles.removeTag}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label style={styles.formLabel}>Select User</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      as="select"
                      value=""
                      style={styles.formControl}
                      onChange={(e) => handleUserTwoChange(e)}
                      disabled={selectedRolesTwo.length === 0 || loadingUsers}
                      className="shadow-sm"
                    >
                      <option value="">Select a User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName}
                        </option>
                      ))}
                    </Form.Control>
                    {loadingUsers && (
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#3F88A5",
                        }}
                      />
                    )}
                  </div>
                </Form.Group>

                {/* Selected users display */}
                {selectedUsersTwo.length > 0 && (
                  <div className="mb-4">
                    {selectedUsersTwo.map((userId) => (
                      <div key={userId} style={styles.tagChip}>
                        {getUserName(userId)}
                        <span
                          onClick={() => removeUserTwo(userId)}
                          style={styles.removeTag}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Assigned Questions section */}
                {assignedQuestions?.length > 0 && (
                  <div className="mt-4">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={styles.sectionTitle}>Assigned Questions</h5>
                      <Button
                        variant="link"
                        style={styles.viewAllButton}
                        onClick={() => setShowQuestionDetails(true)}
                      >
                        <FontAwesomeIcon icon={faEye} className="me-1" /> View
                        All
                      </Button>
                    </div>
                    {/* Here you would display questions preview if needed */}
                  </div>
                )}
                <Form.Group className="mb-4">
                  <div style={styles.checkboxLabel}>
                    <Form.Check
                      type="checkbox"
                      id="assignMeCheckbox"
                      label="Assign me"
                      checked={checkboxChecked}
                      onChange={(e) => handleCheckbox(e.target.checked)}
                      style={styles.checkboxInput}
                    />
                  </div>
                </Form.Group>
              </Form>
            </Col>

            <Col md={6}>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form>
                {data === "top" && (
                  <>
                    {selectedUsersTwo.length > 0 ? (
                      <>
                        {checkboxChecked ? (
                          <Form.Group className="mb-4">
                            <Form.Label style={styles.formLabel}>
                              Choose Due Date
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={
                                dueDate
                                  ? dueDate.toLocaleDateString("en-US", {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                    })
                                  : ""
                              }
                              onClick={() =>
                                document
                                  .getElementById("hidden-date-picker")
                                  .click()
                              }
                              readOnly
                              style={styles.datePickerInput}
                            />
                            <div style={{ height: 0, overflow: "hidden" }}>
                              <DatePicker
                                id="hidden-date-picker"
                                selected={dueDate}
                                onChange={handleDate}
                                dateFormat="MM/dd/yyyy"
                                minDate={new Date()}
                              />
                            </div>
                          </Form.Group>
                        ) : (
                          <>
                            <Form.Group className="mb-4">
                              <Form.Label style={styles.formLabel}>
                                Select Role
                              </Form.Label>
                              <Form.Control
                                as="select"
                                className="shadow-sm"
                                value=""
                                style={styles.formControl}
                                onChange={handleRoleChange}
                              >
                                <option value="">Select a Role</option>
                                {managementListValue?.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.role_name}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>

                            {/* Selected roles display */}
                            {selectedRoles.length > 0 && (
                              <div className="mb-4">
                                {selectedRoles.map((roleId) => (
                                  <div key={roleId} style={styles.tagChip}>
                                    {getRoleName(roleId)}
                                    <span
                                      onClick={() => removeRole(roleId)}
                                      style={styles.removeTag}
                                    >
                                      ×
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <Form.Group className="mb-4">
                              <Form.Label style={styles.formLabel}>
                                Select User
                              </Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  as="select"
                                  value=""
                                  style={styles.formControl}
                                  onChange={handleUserChange}
                                  disabled={
                                    selectedRoles.length === 0 || loadingUsers
                                  }
                                  className="shadow-sm"
                                >
                                  <option value="">Select a User</option>
                                  {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                      {user.fullName}
                                    </option>
                                  ))}
                                </Form.Control>
                                {loadingUsers && (
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    style={{
                                      position: "absolute",
                                      right: "15px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      color: "#3F88A5",
                                    }}
                                  />
                                )}
                              </div>
                            </Form.Group>

                            {/* Selected users display */}
                            {selectedUsers.length > 0 && (
                              <div className="mb-4">
                                {selectedUsers.map((userId) => (
                                  <div key={userId} style={styles.tagChip}>
                                    {getUserName(userId)}
                                    <span
                                      onClick={() => removeUser(userId)}
                                      style={styles.removeTag}
                                    >
                                      ×
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <Form.Group className="mb-4">
                              <Form.Label style={styles.formLabel}>
                                Set Due Date
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={
                                  dueDate
                                    ? dueDate.toLocaleDateString("en-US", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                      })
                                    : ""
                                }
                                onClick={() =>
                                  document
                                    .getElementById("hidden-date-picker-2")
                                    .click()
                                }
                                readOnly
                                style={styles.datePickerInput}
                              />
                              <div style={{ height: 0, overflow: "hidden" }}>
                                <DatePicker
                                  id="hidden-date-picker-2"
                                  selected={dueDate}
                                  onChange={handleDate}
                                  dateFormat="MM/dd/yyyy"
                                  minDate={new Date()}
                                />
                              </div>
                            </Form.Group>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={styles.alertBox}>
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={styles.alertIcon}
                        />
                        <p style={styles.alertText}>
                          Please select a user first and then you can reassign
                          questions.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Form>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer style={styles.footer}>
          <Button
            variant="outline-secondary"
            onClick={handleReassignClose}
            style={styles.cancelButton}
            className="hover-effect"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            style={styles.saveButton}
            className="hover-effect"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Question Details Modal with Backdrop Blur */}
      <Modal
        show={showQuestionDetails}
        onHide={closeQuestionDetails}
        size="lg"
        backdrop="static"
        keyboard={false}
        style={{ maxHeight: "90vh" }}
        className="blur-background-modal" // Add a custom class for styling
      >
        <Modal.Header
          style={{
            borderBottom: "none",
            padding: "15px 30px",
          }}
        >
          <Modal.Title
            style={{
              color: "#3F88A5",
              fontSize: "16px",
              fontFamily: "Open Sans",
              fontWeight: 700,
            }}
          >
            All Assigned Questions
          </Modal.Title>
          <span
            onClick={closeQuestionDetails}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            ×
          </span>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: "0px 30px 0px",
          }}
        >
          <div
            className="selection-controls d-flex justify-content-between align-items-center py-2 px-3 mb-2"
            style={{
              backgroundColor: "#f2f7f9",
              borderRadius: "4px",
            }}
          >
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{
                  position: "relative",
                  width: "20px",
                  height: "20px",
                  backgroundColor: selectAll
                    ? "rgb(63, 136, 165)"
                    : "transparent",
                  borderRadius: "3px",
                  border: selectAll
                    ? "1px solid rgb(63, 136, 165)"
                    : "1px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              />
              <label
                onClick={() => setSelectAll(!selectAll)}
                style={{ cursor: "pointer", marginBottom: "0" }}
              >
                Select All Questions
              </label>
            </div>
            <div
              style={{ maxWidth: "450px" }}
              className="d-flex align-items-center"
            >
              <span
                style={{
                  color: "black",
                  fontSize: "16px",
                  fontFamily: "Open Sans",
                  fontWeight: "400",
                  marginRight: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                Enter Range:
              </span>
              <div style={{ flex: "1" }}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="e.g., 1-3,5,7-9"
                    value={range}
                    style={{
                      border: "1px solid #3F88A5",
                      background: "white",
                      borderColor: "#3F88A5",
                    }}
                    onChange={handleRangeInput}
                  />
                  <Button
                    style={{
                      backgroundColor: "#3F88A5",
                      color: "white",
                      borderColor: "#3F88A5",
                      marginLeft: "8px",
                    }}
                    onClick={applyRange}
                  >
                    Apply
                  </Button>
                </div>
                {error && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "2px" }}
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "60vh", // Fixed height
              overflowY: "auto", // Scroll only this area
            }}
          >
            {assignedQuestions && assignedQuestions.length > 0 ? (
              assignedQuestions.map((question, index) => (
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
                      }}
                      aria-controls={`collapse${index}`}
                    >
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
                          checked={
                            Array.isArray(answer.questionIds) &&
                            answer.questionIds.includes(question.questionId)
                          }
                          onChange={() =>
                            handleCheckboxClick(question.questionId)
                          }
                          style={{
                            position: "relative",
                            width: "20px",
                            height: "20px",
                            backgroundColor:
                              Array.isArray(answer.questionIds) &&
                              answer.questionIds.includes(question.questionId)
                                ? "rgb(63, 136, 165)"
                                : "transparent",
                            borderRadius: "3px",
                            border:
                              Array.isArray(answer.questionIds) &&
                              answer.questionIds.includes(question.questionId)
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
                      <div style={{ flex: "0 0 90%" }}>
                        <span style={{ color: "black", marginBottom: "10px" }}>
                          {index + 1}.{" "}
                          {question.title.replace(/\b(Yes|No)\b/g, "")}
                        </span>
                      </div>
                    </button>
                  </h2>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Spinner animation="border" role="status" className="mb-2">
                  <span className="sr-only">Loading...</span>
                </Spinner>
                <p>Loading questions...</p>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: "none",
            justifyContent: "flex-end", // Aligns the button to the right
            marginTop: "20px",
            paddingRight: "30px", // Optional: aligns with Modal.Body padding
          }}
        >
          <Button
            onClick={closeQuestionDetails}
            style={{
              backgroundColor: "#3F88A5",
              borderColor: "#3F88A5",
              padding: "5px 25px",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add this style to your component or to your CSS file */}
      <style>{`
        /* Custom styling for modal backdrop blur */
        .blur-background-modal .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  );
};

export default ReassignQuestionModal;
