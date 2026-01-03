import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import image from "../../../img/Close.svg";
import "./operationalmodal.css";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AssignQuestionModal = ({
  handleAssignedDetails,
  financeObjct,
  managementListValue,
  showAssignModal,
  handleAssignClose,
  actionType,
  selectedQuestions,
  moduleName,
  groupedByModuleName,
}) => {
  const today = formatDate(new Date());
  const [answer, setAnswer] = useState({
    financialYearId: financeObjct,
    assignedToIds: [],
    moduleType: "SQ",
    questionnaireType: "CA",
    dueDate: today,
  });

  // For reminder functionality
  const [emailAddresses, setEmailAddresses] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  // Initialize with today's date (runs only once on component mount)
  useEffect(() => {
    // Initialize with today's date
    const currentDate = new Date();
    setDueDate(currentDate);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      dueDate: formatDate(currentDate),
    }));
  }, []);

  const [error, setError] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Store both id and name information for selected users and roles
  const [selectedUsers, setSelectedUsers] = useState([]); // Array of {id, name} objects
  const [selectedRoles, setSelectedRoles] = useState([]); // Array of {id, name} objects
  const [selectedModules, setSelectedModules] = useState([]);

  const handleSave = async () => {
    let questionIds = selectedQuestions;

    if (actionType === "assign") {
      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}assignedQuestionToUser`,
        {},
        { ...answer, questionIds, type: "ASSIGN" },
        "POST"
      );
      if (isSuccess) {
        handleAssignedDetails();
        handleAssignClose();
      }
    } else if (actionType === "reminder") {
      // Call reminder API endpoint
      const reminderData = {
        emailAddresses: emailAddresses.split(",").map((email) => email.trim()),
        message: reminderMessage,
        questionIds: questionIds,
      };

      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}sendReminderEmails`,
        {},
        reminderData,
        "POST"
      );

      if (isSuccess) {
        handleAssignedDetails();
        handleAssignClose();
      }
    }
  };

  const fetchUsers = async (roleId, roleName) => {
    console.log("Fetching users for roleId:", roleId);
    if (roleId) {
      setLoadingUsers(true);
      try {
        // Use consistent string conversion
        const roleIdStr = String(roleId);

        // Log the API call details for debugging
        console.log("Making API call to get users for role:", roleIdStr);

        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSubUserBasedOnRoleId`,
          {},
          { roleId: roleIdStr },
          "GET"
        );

        console.log("API response:", response);

        if (response && response.isSuccess) {
          const data = response.data?.data || [];
          console.log("User data received:", data);

          const users = Array.from(
            new Map(
              data.map(user => [
                String(user.userId),
                {
                  id: String(user.userId),
                  name: `${user.firstName || ""} ${user.lastName || ""} ${
                    user.designation ? `(${user.designation})` : ""
                  }`.trim(),
                },
              ])
            ).values()
          );

          console.log("Processed users:", users);
          setUsers(users);
        } else {
          console.error(
            "Failed to fetch users:",
            response?.message || "Unknown error"
          );
          setUsers([]);

          // Show a temporary error message
          setError(`Could not load users for ${roleName || "selected role"}`);
          setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);

        // Show a temporary error message
        setError("Error loading users. Please try again.");
        setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      } finally {
        setLoadingUsers(false);
      }
    }
  };

  const handleDate = (date) => {
    console.log("Date selected:", date);

    if (date) {
      setDueDate(date);
      const formattedDate = formatDate(date);
      console.log("Formatted date:", formattedDate);

      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        dueDate: formattedDate,
      }));
    }
  };

  useEffect(() => {
    const STORAGE_KEY_SELECTED_MODULES = "selectedModules";
    const savedSelectedModules = localStorage.getItem(
      STORAGE_KEY_SELECTED_MODULES
    );

    if (savedSelectedModules) {
      try {
        const parsedModules = JSON.parse(savedSelectedModules);
        setSelectedModules(parsedModules);
      } catch (error) {
        console.error("Error parsing saved modules:", error);
      }
    }
  }, []);

  const handleCheckbox = (isChecked) => {
    setCheckboxChecked(isChecked);

    // Update answer state based on checkbox state
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserId = currentUser ? currentUser.id : null;

    if (isChecked) {
      setAnswer({
        ...answer,
        assignedToIds: [currentUserId],
      });

      // Reset other selections
      setSelectedUsers([]);
      setSelectedRoles([]);
    } else {
      setAnswer({
        ...answer,
        assignedToIds: [],
      });
    }
  };

  // Handle multiple role selection
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    console.log("Role selected from dropdown:", roleId);

    if (roleId) {
      // Convert to string to ensure consistent comparison
      const roleIdStr = String(roleId);

      // Check if managementListValue is an array before trying to use it
      if (managementListValue && Array.isArray(managementListValue)) {
        // First try exact match
        let selectedRole = managementListValue.find(
          (role) => String(role.id) === roleIdStr
        );

        console.log("Found role by ID:", selectedRole);

        if (!selectedRole) {
          console.log("Role not found by direct ID match, checking all roles:");
          // Log all available roles for debugging
          managementListValue.forEach((role, index) => {
            console.log(`Role ${index}:`, role);
          });
        }

        // If we found a matching role, or we're using the fallback
        if (selectedRole || true) {
          // Always proceed, using fallback name if needed
          // Check if this role is already selected
          if (!selectedRoles.some((role) => String(role.id) === roleIdStr)) {
            const roleName = selectedRole
              ? selectedRole.role_name
              : `Role ${roleIdStr}`;
            console.log("Adding role:", roleName);

            const newRole = {
              id: roleIdStr,
              name: roleName,
            };

            const updatedRoles = [...selectedRoles, newRole];
            setSelectedRoles(updatedRoles);
            fetchUsers(roleIdStr, roleName);
          } else {
            console.log("Role already selected, not adding again");
          }
        }
      } else {
        console.warn(
          "managementListValue is not a valid array:",
          managementListValue
        );

        // Fallback if managementListValue is not available
        const newRole = {
          id: roleIdStr,
          name: `Role ${roleIdStr}`,
        };

        const updatedRoles = [...selectedRoles, newRole];
        setSelectedRoles(updatedRoles);
        fetchUsers(roleIdStr, `Role ${roleIdStr}`);
      }
    }
  };

  // Remove a selected role
  const removeRole = (roleId) => {
    const updatedRoles = selectedRoles.filter((role) => role.id !== roleId);
    setSelectedRoles(updatedRoles);
  };

  // Handle multiple user selection
  const handleUserChange = (e) => {
    const userId = e.target.value;
    console.log("User selected from dropdown:", userId);

    if (userId) {
      // Convert to string for consistent comparison
      const userIdStr = String(userId);

      // Find the selected user to get its name
      const selectedUser = users.find((user) => String(user.id) === userIdStr);
      console.log("Found user:", selectedUser);

      if (
        selectedUser &&
        !selectedUsers.some((user) => String(user.id) === userIdStr)
      ) {
        console.log("Adding new user:", selectedUser.name);

        const newUser = {
          id: userIdStr,
          name: selectedUser.name || `User ${userIdStr}`,
        };

        const updatedUsers = [...selectedUsers, newUser];
        setSelectedUsers(updatedUsers);

        // Update assignedToIds with just the IDs for the API
        const userIds = updatedUsers.map((user) => user.id);
        console.log("Updated assignedToIds:", userIds);

        setAnswer((prevAnswer) => ({
          ...prevAnswer,
          assignedToIds: userIds,
        }));
      } else if (!selectedUser) {
        // Fallback if user not found
        console.log("User not found in users array, using fallback");

        const newUser = {
          id: userIdStr,
          name: `User ${userIdStr}`,
        };

        const updatedUsers = [...selectedUsers, newUser];
        setSelectedUsers(updatedUsers);

        // Update assignedToIds with just the IDs for the API
        setAnswer((prevAnswer) => ({
          ...prevAnswer,
          assignedToIds: updatedUsers.map((user) => user.id),
        }));
      } else {
        console.log("User already selected, not adding again");
      }
    }
  };

  // Remove a selected user
  const removeUser = (userId) => {
    const updatedUsers = selectedUsers.filter((user) => user.id !== userId);
    setSelectedUsers(updatedUsers);

    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      assignedToIds: updatedUsers.map((user) => user.id),
    }));
  };

  useEffect(() => {
    setAnswer((prevAnswer) => {
      return {
        ...prevAnswer,
        financialYearId: financeObjct,
      };
    });
  }, [financeObjct]);

  return (
    <Modal show={showAssignModal} onHide={handleAssignClose} size="xl">
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
          {actionType === "assign" ? "Assign Question" : "Send Reminder"}
        </Modal.Title>
        <img
          src={image}
          alt="Close"
          onClick={handleAssignClose}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "10px 30px 20px",
        }}
      >
        {/* Display error message if present */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {actionType === "assign" ? (
          <div>
            <Form>
              {selectedQuestions && selectedQuestions.length !== 0 ? (
                <></>
              ) : (
                <Form.Group controlId="formModuleName" className="mb-3">
                  <Form.Control
                    type="text"
                    value={selectedModules
                      .map((moduleName) =>
                        moduleName
                          .replace(/-/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      )
                      .join(", ")}
                    readOnly
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px 12px",
                    }}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="selfAssign"
                  label="Self Assign"
                  checked={checkboxChecked}
                  onChange={(e) => handleCheckbox(e.target.checked)}
                  style={{
                    fontSize: "14px",
                  }}
                />
              </Form.Group>

              {!checkboxChecked && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "8px",
                      }}
                    >
                      Select Role
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value=""
                      onChange={handleRoleChange}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px 12px",
                      }}
                    >
                      <option value="">Select a Role</option>
                      {managementListValue &&
                      Array.isArray(managementListValue) ? (
                        managementListValue.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.role_name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No roles available
                        </option>
                      )}
                    </Form.Control>
                  </Form.Group>

                  {/* Display selected roles with actual names */}
                  {selectedRoles.length > 0 && (
                    <div className="mb-3">
                      {selectedRoles.map((role) => (
                        <span
                          key={role.id}
                          className="d-inline-block"
                          style={{
                            background: "#f0f7fa",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            margin: "0 6px 6px 0",
                            fontSize: "14px",
                          }}
                        >
                          {role.name}
                          <span
                            onClick={() => removeRole(role.id)}
                            style={{
                              marginLeft: "8px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "8px",
                      }}
                    >
                      Select User
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value=""
                      onChange={handleUserChange}
                      disabled={selectedRoles.length === 0 || loadingUsers}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px 12px",
                      }}
                    >
                      <option value="">Select a User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                    {loadingUsers && (
                      <Spinner animation="border" size="sm" className="ml-2" />
                    )}
                  </Form.Group>

                  {/* Display selected users with actual names */}
                  {selectedUsers.length > 0 && (
                    <div className="mb-3">
                      {selectedUsers.map((user) => (
                        <span
                          key={user.id}
                          className="d-inline-block"
                          style={{
                            background: "#f0f7fa",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            margin: "0 6px 6px 0",
                            fontSize: "14px",
                          }}
                        >
                          {user.name}
                          <span
                            onClick={() => removeUser(user.id)}
                            style={{
                              marginLeft: "8px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label
                  style={{
                    color: "#333",
                    fontSize: "16px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  {checkboxChecked ? "Choose Due Date" : "Set Due Date"}
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
                  onChange={(e) => e} // Keep as controlled component
                  onClick={() =>
                    document.getElementById("hidden-date-picker").click()
                  }
                  readOnly
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                  }}
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
            </Form>
          </div>
        ) : (
          // Reminder UI
          <Form>
            {selectedQuestions && selectedQuestions.length !== 0 ? (
              <></>
            ) : (
              <Form.Group controlId="formModuleName" className="mb-3">
                <Form.Control
                  type="text"
                  value={selectedModules
                    .map((moduleName) =>
                      moduleName
                        .replace(/-/g, " ")
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                    )
                    .join(", ")}
                  readOnly
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Email Addresses (comma separated)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
                placeholder="Enter email addresses separated by commas"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px 12px",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Reminder Message
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                placeholder="Enter your reminder message"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px 12px",
                }}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "none",
          padding: "15px 30px",
        }}
      >
        <Button
          onClick={handleAssignClose}
          style={{
            border: "1px solid #3F88A5",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: "transparent",
            color: "#333",
            padding: "6px 25px",
            borderRadius: "4px",
          }}
        >
          Clear
        </Button>
        <Button
          onClick={handleSave}
          style={{
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: "#3F88A5",
            color: "white",
            padding: "6px 25px",
            borderRadius: "4px",
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignQuestionModal;
