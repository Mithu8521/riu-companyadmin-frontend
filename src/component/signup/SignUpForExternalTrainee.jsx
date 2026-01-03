import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { FiChevronDown } from "react-icons/fi";
import "./SignUpTrainee.css";

const SignUpForExternalTrainee = () => {
  const { token } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState(""); // For dropdown selection
  const [otherCompany, setOtherCompany] = useState(""); // For "Other" option text input

  const [title, setTitle] = useState("");
  const [trainerName, setTrainerName] = useState("");

  // Company options for dropdown
  const companyOptions = [
    { label: "Kennametal India Limited (KIL)", value: "Kennametal India Limited (KIL)" },
    { label: "Kennametal Shared Services Private Limited (KSSPL)", value: "Kennametal Shared Services Private Limited (KSSPL)" },
    { label: "Others, please specify", value: "Others, please specify" }
  ];

  const handleFetchToken = async () => {
    const payload = {
      token: token,
    };
    if (token) {
      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}getTraineeData`,
        {},
        payload,
        "GET"
      );

      if (isSuccess) {
        const trainers = Array.isArray(data.data?.trainers)
                        ? data.data?.trainers.map((t) => t.name).join(", ")
                        : data.data?.trainers || ""
   
        setTitle(data.data?.trainingTitle);
        setTrainerName(trainers);
      } else {
        alert("Failed to fetch token. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !phone) {
      setError("First Name and Phone Number are mandatory.");
      return;
    }

    if (!companyName) {
      setError("Company Name is mandatory.");
      return;
    } else if (companyName === "Others, please specify" && !otherCompany) {
      setError("Please specify your company name.");
      return;
    }

    // Determine final company name value based on selection
    const finalCompanyName = companyName === "Others, please specify" ? otherCompany : companyName;

    const result = token.includes("external_register")
      ? token.split("external_register")[0]
      : null;
    const payload = {
      employeeId,
      email,
      firstName,
      lastName,
      mobileNumber: phone,
      gender,
      token: result ? result : token,
      userType: "TRAINEE",
      companyName: finalCompanyName, // Add company name to payload
    };

    const { isSuccess } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}signupExternalTrainee`,
      {},
      { ...payload },
      "POST"
    );

    if (isSuccess) {
      setEmployeeId("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setGender("");
      setCompanyName("");
      setOtherCompany("");
      setError("");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    handleFetchToken();
  }, []);

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="form-title">Joint Event</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* <Form.Group as={Row} controlId="formEmployeeID">
            <Form.Label column sm="12">
              Employee ID
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="text"
                className="form-controll"
                placeholder="Enter Employee Unique ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Col>
          </Form.Group> */}
          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formFirstName">
                <Form.Label>Traing Title</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter first name"
                  value={title}
                  readOnly
                  required
                />
              </Form.Group>
            </Col>
            <Col sm="6">
              <Form.Group controlId="formLastName">
                <Form.Label>Trainer Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter last name"
                  readOnly
                  value={trainerName}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm="6">
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Company Name Row */}
          <Row className="mt-4">
            <Col sm="12">
              <Form.Group controlId="formCompany">
                <Form.Label>Company Name</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  >
                    <option value="">Select Company</option>
                    {companyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Other Company Name Field (conditional) */}
          {companyName === "Others, please specify" && (
            <Row className="mt-3">
              <Col sm="12">
                <Form.Group controlId="formOtherCompany">
                  <Form.Label>Specify Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-controll"
                    placeholder="Enter company name"
                    value={otherCompany}
                    onChange={(e) => setOtherCompany(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row className="mt-4">
            {/* <Col sm="6">
              <Form.Group controlId="formEmail">
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  type="email"
                  className="form-controll"
                  placeholder="Enter email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col> */}
            <Col sm="6">
              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm="6">
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="register-btn mt-4">
            Joint
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForExternalTrainee;