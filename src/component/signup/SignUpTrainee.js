import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FiChevronDown } from "react-icons/fi";
import "./SignUpTrainee.css";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { history } from "../../_helpers/history";
import { NavLink } from "react-router-dom";

const SignUpTrainee = () => {
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [invitedEmail, setInvitedEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [companyName, setCompanyName] = useState(""); // For dropdown selection
  const [otherCompany, setOtherCompany] = useState(""); // For "Other" option text input
  const [businessUnit, setBusinessUnit] = useState("");
  const [division, setDivision] = useState("");
  const [joiningDate, setJoiningDate] = useState(""); // Added joining date state
  const [title, setTitle] = useState("");
  const [trainingToken, setTrainingToken] = useState(null);

  // Company options for dropdown
  const companyOptions = [
    { label: "Kennametal India Limited (KIL)", value: "Kennametal India Limited (KIL)" },
    { label: "Kennametal Shared Services Private Limited (KSSPL)", value: "Kennametal Shared Services Private Limited (KSSPL)" },
    { label: "Others, please specify", value: "Others, please specify" }
  ];

  const AudienceOptions = [
    { label: "Permanent Employee", value: "EMPLOYEES_PERMANENT" },
    { label: "Other than Permanent Employee", value: "EMPLOYEES_TEMPORARY" },
    { label: "Permanent Worker", value: "WORKERS_PERMANENT" },
    { label: "Other than Permanent Worker", value: "WORKERS_TEMPORARY" },
    { label: "KMP", value: "KMP" },
    { label: "BOD", value: "BOD" },
    { label: "Customer", value: "CUSTOMERS" },
    { label: "Supplier", value: "SUPPLIERS" },
    { label: "Distributor", value: "DISTRIBUTORS" },
  ];

  const divisionOptions = [
    { label: "Advanced Material Solutions", value: "Advanced Material Solutions" },
    { label: "Business Finance", value: "Business Finance" },
    { label: "Commercial Field", value: "Commercial Field" },
    { label: "Corporate Finance", value: "Corporate Finance" },
    { label: "Earthcutting", value: "Earthcutting" },
    { label: "Engineered Components", value: "Engineered Components" },
    { label: "Environmental Health and Safety", value: "Environmental Health and Safety" },
    { label: "General", value: "General" },
    { label: "General Counsel", value: "General Counsel" },
    { label: "HR Business Partners", value: "HR Business Partners" },
    { label: "Inserts", value: "Inserts" },
    { label: "Machining Solutions Group", value: "Machining Solutions Group" },
    { label: "Materials Science", value: "Materials Science" },
    { label: "Portfolio Management", value: "Portfolio Management" },
    { label: "Procurement", value: "Procurement" },
    { label: "Product Engineering", value: "Product Engineering" },
    { label: "Quality", value: "Quality" },
    { label: "Strategic Marketing", value: "Strategic Marketing" },
    { label: "Supply Planning & Logistics", value: "Supply Planning & Logistics" },
    { label: "Technology Industrial", value: "Technology Industrial" },
  ];

  const businessUnitOptions = [
    { label: "Metal Cutting Demand Fulfillment", value: "Metal Cutting Demand Fulfillment" },
    { label: "Metal Cutting Demand Generation", value: "Metal Cutting Demand Generation" },
    { label: "Infrastructure Business Group", value: "Infrastructure Business Group" },
    { label: "Administration Office", value: "Administration Office" },
    { label: "Finance", value: "Finance" },
    { label: "Technology", value: "Technology" },
    { label: "Office of General Counsel", value: "Office of General Counsel" },
    { label: "Global Sourcing & Procurement", value: "Global Sourcing & Procurement" },
  ];

  const togglePasswordVisibility = (type) => {
    if (type === "password") {
      setShowPassword(!showPassword);
      if (showConfirmPassword) setShowConfirmPassword(false);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
      if (showPassword) setShowPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    // Determine final company name value based on selection
    const finalCompanyName = companyName === "Others, please specify" ? otherCompany : companyName;

    const payload = {
      employeeId,
      email,
      password,
      firstName,
      lastName,
      gender,
      token: trainingToken ? trainingToken : "direct",
      userType: "TRAINEE",
      categoryId,
      departmentId,
      companyName: finalCompanyName,
      businessUnit,
      division,
      joiningDate: joiningDate || null, // Include joining date in payload
    };

    const { isSuccess, data } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}signupTrainee`,
      {},
      { ...payload },
      "POST"
    );
    if (isSuccess) {
      trainingToken ? history.push(`/#/trainee_invite/${trainingToken}`) : history.push(`/#/trainee_login`);
      window.location.reload();
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!email && !employeeId) {
      newErrors.email = "At least one of Email or Employee ID (or both) is required";
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!departmentId) newErrors.departmentId = "Department is required";
    if (!companyName) {
      newErrors.companyName = "Company is required";
    } else if (companyName === "Others, please specify" && !otherCompany) {
      newErrors.otherCompany = "Company name is required";
    }

    // Validate joining date if provided
    if (joiningDate && joiningDate.trim() !== "") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(joiningDate)) {
        newErrors.joiningDate = "Joining date must be in YYYY-MM-DD format";
      } else {
        const date = new Date(joiningDate);
        if (isNaN(date.getTime())) {
          newErrors.joiningDate = "Please enter a valid date";
        } else if (date > new Date()) {
          newErrors.joiningDate = "Joining date cannot be in the future";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const callFunction = async (result) => {
    if (result) {
      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}getTraineeEmail`,
        {},
        { id: result },
        "GET"
      );
      if (isSuccess) {
        setEmail(data.data[0].email)
        setInvitedEmail(true);
      }
    }
  };

  const callTraineeFunction = async (result) => {
    if (result) {
      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}getTraineeData`,
        {},
        { token: result },
        "GET"
      );
      if (isSuccess) {
        setTitle(data?.data?.trainingTitle)
      }
    }
  };

  useEffect(() => {
    const resultId = token?.includes('&') ? token?.split('&')[1] : null;
    const resultToken = token?.includes('&') ? token?.split('&')[0] : token;

    if (resultId) {
      callFunction(resultId);
    }
    if (resultToken) {
      setTrainingToken(resultToken)
      callTraineeFunction(resultToken);
    }
  }, []);

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="form-title">Register Now</h2>
        {title ? <h4 className="form-title">{title}</h4> : <></>}
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formEmployeeID">
            <Form.Label column sm="12">
              Employee ID*
            </Form.Label>
            <Col sm="12">
              <Form.Control
                type="number"
                className="form-controll"
                placeholder="Enter Employee Unique ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Col>
          </Form.Group>
          {errors.employeeId && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.employeeId}</p>}

          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  className="form-controll"
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                    {errors.firstName}
                  </p>
                )}
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  type="text"
                  className="form-controll"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                    {errors.lastName}
                  </p>
                )}
              </Form.Group>
            </Col>
          </Row>



          {/* Company Name Row */}
          <Row className="mt-4">
            <Col sm="12">
              <Form.Group controlId="formCompany">
                <Form.Label>Company Name*</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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
              {errors.companyName && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.companyName}</p>}
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
                  />
                </Form.Group>
                {errors.otherCompany && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.otherCompany}</p>}
              </Col>
            </Row>
          )}

          {/* Business Unit and Division Row */}
          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formBusinessUnit">
                <Form.Label>Business Unit</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                  >
                    <option value="">Select Business Unit</option>
                    {businessUnitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group controlId="formDivision">
                <Form.Label>Division</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                  >
                    <option value="">Select Division</option>
                    {divisionOptions.map((option) => (
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


          {/* Joining Date Row */}
          <Row className="mt-4">
            <Col sm="12">
              <Form.Group controlId="formJoiningDate">
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  className="form-controll"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  placeholder="Select joining date"
                />
                <Form.Text className="text-muted">
                  Select your date of joining the company
                </Form.Text>
              </Form.Group>
              {errors.joiningDate && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.joiningDate}</p>}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formEmail">
                <Form.Label>Email ID*</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Mail ID"
                  className="form-controll"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={invitedEmail}
                />
              </Form.Group>
              {errors.email && (
                <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                  {errors.email}
                </p>
              )}
            </Col>

            <Col sm="6">
              <Form.Group controlId="formGender">
                <Form.Label>Gender*</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    className="form-controll"
                    as="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
            </Col>
          </Row>


          <Row className="mt-4">
            <Col sm="6">
              <Form.Group controlId="formPassword">
                <Form.Label>Password*</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    className="form-controll"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroup.Text
                    onClick={() => togglePasswordVisibility("password")}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {errors.password && (
                <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                  {errors.password}
                </p>
              )}
            </Col>

            <Col sm="6">
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm Password*</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-controll"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputGroup.Text
                    onClick={() => togglePasswordVisibility("confirm")}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {errors.confirmPassword && (
                <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </Col>
          </Row>


          <Row className="mt-4 mb-4">
            <Col sm="6">
              <Form.Group controlId="formCategory">
                <Form.Label>Category*</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {AudienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
              {errors.categoryId && (
                <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                  {errors.categoryId}
                </p>
              )}
            </Col>

            <Col sm="6">
              <Form.Group controlId="formDepartment">
                <Form.Label>Department*</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="MCDG - Sales">MCDG - Sales</option>
                    <option value="MCDF + Infra Mfg - Manufacturing">MCDF + Infra Mfg - Manufacturing</option>
                    <option value="MSG">MSG</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Legal">Legal</option>
                    <option value="R&D">R&D</option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="EHS">EHS</option>
                    <option value="Supply Chain & Distribution">Supply Chain & Distribution</option>
                    <option value="ESG">ESG</option>
                    <option value="Technology">Technology</option>
                    <option value="Admin">Admin</option>
                    <option value="MCDF">MCDF</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Design">Design</option>
                    <option value="Supply Planning & Logistics">Supply Planning & Logistics</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Application Engineering">Application Engineering</option>
                    <option value="Performance Value">Performance Value</option>
                    <option value="Field">Field</option>
                    <option value="Business Partners">Business Partners</option>
                    <option value="Health and Safety">Health and Safety</option>
                    <option value="Product Engineering">Product Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Business Finance">Business Finance</option>
                    <option value="Business Services">Business Services</option>
                    <option value="Technology Industrial">Technology Industrial</option>
                    <option value="Materials Science">Materials Science</option>
                    <option value="Quality">Quality</option>
                    <option value="Tax">Tax</option>
                    <option value="General Counsel">General Counsel</option>
                    <option value="End Market Strategies">End Market Strategies</option>
                    <option value="Procurement">Procurement</option>
                    <option value="General Mgmt/Admin">General Mgmt/Admin</option>
                    <option value="Product Management Operations">Product Management Operations</option>
                    <option value="Machine Tool Industry">Machine Tool Industry</option>
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
              {errors.departmentId && (
                <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>
                  {errors.departmentId}
                </p>
              )}
            </Col>
          </Row>


          <Button variant="primary" type="submit" className="register-btn">
            REGISTER
          </Button>
          {trainingToken ? <div className="text-center mt-2">
            <h5>
              Already have an account?
              <NavLink
                to={`/trainee_invite/${trainingToken}`}
                style={{ color: "#3F88A5", cursor: "pointer" }}
              >
                Log in
              </NavLink>
            </h5>
          </div> : <div className="text-center mt-2">
            <h5>
              Already have an account?
              <NavLink
                to={`/trainee_login`}
                style={{ color: "#3F88A5", cursor: "pointer" }}
              >
                Log in
              </NavLink>
            </h5>
          </div>}
        </Form>
      </div>
    </div>
  );
};

export default SignUpTrainee;