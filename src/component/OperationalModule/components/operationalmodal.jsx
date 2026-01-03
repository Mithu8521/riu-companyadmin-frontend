import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import image from "../../../img/Close.svg";
import "./operationalmodal.css";
import down from "../../../img/DownArrow.svg";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const OperationalModal = ({

  handleAssignedDetails,
  financeObjct,
  questionIds,
  managementListValue,
  moduleName,
  data,
  showModal,
  handleCloseModal,
}) => {
  const [answer, setAnswer] = useState({
    financialYearId: financeObjct,
    assignedToIds: "",
    questionIds: questionIds || [],
    moduleType: "SQ",
    questionnaireType: "CA",
    dueDate: new Date().toISOString().split("T")[0],
  });
  useEffect(() => {
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      questionIds: questionIds || [],
    }));
  }, [questionIds]);
  const [lowNumber, setLowNumber] = useState("");
  const [highNumber, setHighNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assignedDetails, setAssignedDetails] = useState([]);
  const [range, setRange] = useState("");


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
    setAnswer({ ...answer, dueDate: date });
  };

  const handleCheckbox = (isChecked) => {
    setCheckboxChecked(isChecked);
    // Update answer state based on checkbox state
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let currentUserId = currentUser ? currentUser.id : null;
    setAnswer({
      ...answer,
      assignedToIds: isChecked ? [currentUserId] : [selectedUser],
    });
  };

  const handleUserChange = (userId) => {
    setSelectedUser(userId);


    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserId = currentUser ? currentUser.id : null;
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      assignedToIds: checkboxChecked ? [currentUserId] : [userId],
    }));
  };

  const handleSave = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}assignedQuestionToUser`,
      {},
      answer,
      "POST"
    );
    if (isSuccess) {
    }
    handleAssignedDetails();
    handleCloseModal();
  };



  useEffect(() => {
    if (selectedRole) {
      fetchUsers(selectedRole);
    } else {
      setUsers([]);
    }
  }, [selectedRole]);

  useEffect(() => {
    setAnswer((prevAnswer) => {
      return {
        ...prevAnswer,
        financialYearId: financeObjct,
      };
    });
  }, [financeObjct]);
  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal} size="lg" style={{ height: "130vh!important" }}>
        <Modal.Header style={{ borderBottom: "none", padding: "15px 30px" }}>
          <Modal.Title
            style={{
              color: "#3F88A5",
              fontSize: "14px",
              fontFamily: "Open Sans",
              fontWeight: 700,
            }}
          >
            Assign Module
          </Modal.Title>

          <img
            src={image}
            alt="Close"
            onClick={handleCloseModal}
            style={{ cursor: "pointer" }}
          />
        </Modal.Header>
        <Modal.Body
          style={{
            borderBottom: "none",
            marginTop: "-20px",
            padding: " 10px 30px",
          }}
        >
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            {data === "top" && (
              <>
                <Form.Group controlId="formModuleName">
                  <Form.Label
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "black",
                      fontSize: 20,
                      fontFamily: "Open Sans",
                      fontWeight: "400",
                      wordWrap: "break-word",
                      marginBottom: "2px",
                    }}
                  >
                    Module
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={moduleName
                      .replace(/-/g, " ")
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    readOnly
                    style={{
                      border: "1px solid #3F88A5",
                      borderColor: "#3F88A5",
                    }}
                  />
                </Form.Group>
                <Form.Group
                  controlId="formCheckbox"
                  style={{ marginTop: "10px" }}
                >
                  <Form.Check
                    className="greenCheckbox"
                    type="checkbox"
                    label="Assign me"
                    checked={checkboxChecked}
                    onChange={(e) => handleCheckbox(e.target.checked)}
                  />
                </Form.Group>
                {checkboxChecked ? (
                  <Form.Group className="mt-3">
                    <Form.Label
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "black",
                        fontSize: 20,
                        fontFamily: "Open Sans",
                        fontWeight: "400",
                        wordWrap: "break-word",
                        marginBottom: "2px",
                        border: "1px solid #3F88A5",
                      }}
                    >
                      Choose Due Date
                    </Form.Label>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      minDate={new Date()}
                      className="form-control"
                    />
                  </Form.Group>
                ) : (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "black",
                          fontSize: 20,
                          fontFamily: "Open Sans",
                          fontWeight: "400",
                          wordWrap: "break-word",
                          marginBottom: "2px",
                        }}
                      >
                        Select Role1
                      </Form.Label>
                      <div className="gradient-border-only">
                        <Form.Control
                          as="select"
                          className="gradient-border custom-select"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{
                            border: "1px solid #3F88A5",
                            borderColor: "#3F88A5",
                          }}
                        >
                          <option value="">Select a Role</option>
                          {managementListValue?.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.role_name}
                            </option>
                          ))}
                        </Form.Control>
                      </div>
                    </Form.Group>

                    <Form.Group
                      className="mt-3"
                      style={{ width: "100%", borderColor: "#3F88A5" }}
                    >
                      <Form.Label
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "black",
                          fontSize: 20,
                          fontFamily: "Open Sans",
                          fontWeight: "400",
                          wordWrap: "break-word",
                          marginBottom: "2px",
                          borderColor: "#3F88A5",
                        }}
                      >
                        Select User
                      </Form.Label>
                      <div
                        className="gradient-border-only"
                        style={{ width: "100%" }}
                      >
                        <div style={{ position: "relative", width: "100%" }}>
                          <Form.Group controlId="formUserSelect">
                            <Form.Control
                              as="select"
                              value={selectedUser || ""}
                              onChange={(e) => handleUserChange(e.target.value)}
                              disabled={!selectedRole || loadingUsers}
                              className="gradient-border custom-select "
                              style={{
                                border: "1px solid #3F88A5",
                                borderColor: "#3F88A5",
                              }}
                            >
                              <option value="">Select a User</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.fullName}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          {loadingUsers && (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                          )}
                        </div>

                        {loadingUsers && (
                          <Spinner animation="border" size="sm" />
                        )}
                      </div>
                    </Form.Group>


                    <Form.Group className="mt-3">
                      <Form.Label
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "black",
                          fontSize: "20px",
                          fontFamily: "Open Sans",
                          fontWeight: "400",
                          wordWrap: "break-word",
                          marginBottom: "2px",
                        }}
                      >
                        Set Due Date
                      </Form.Label>
                      <div>
                        <DatePicker
                          selected={dueDate}
                          onChange={handleDate}
                          minDate={new Date()}
                          className="form-control"
                          style={{
                            border: "1px solid #3F88A5",
                            borderColor: "#3F88A5",
                          }}
                        />
                      </div>
                    </Form.Group>
                  </>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "none",
            padding: "10px 30px",
          }}
        >
          <Button
            onClick={handleCloseModal}
            style={{
              borderColor: "#3F88A5",
              fontSize: "14px",
              fontFamily: "Open Sans",
              fontWeight: "700",
              backgroundColor: "transparent",
              color: "black",
              padding: "5px 30px",
            }}
          >
            Clear
          </Button>
          <Button
            onClick={handleSave}
            style={{
              borderColor: "white",
              fontSize: "14px",
              fontFamily: "Open Sans",
              fontWeight: "700",
              backgroundColor: "#3F88A5",
              color: "white",
              padding: "5px 30px",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OperationalModal;
