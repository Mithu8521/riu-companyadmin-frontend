import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { FiChevronDown } from "react-icons/fi";
import "./SignUpTrainee.css";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { history } from "../../_helpers/history";
import { NavLink } from "react-router-dom";

const RegisterForm = () => {
  const { token } = useParams();
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [invitedEmail, setInvitedEmail] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [categoryId, setCategoryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [companyName, setCompanyName] = useState(""); // For dropdown selection
  const [otherCompany, setOtherCompany] = useState(""); // For "Other" option text input
  const [businessUnit, setBusinessUnit] = useState("");
  const [division, setDivision] = useState("");
  const [errors, setErrors] = useState({});

  // Company options for dropdown
  const companyOptions = [
    { label: "Kennametal India Limited (KIL)", value: "Kennametal India Limited (KIL)" },
    { label: "Kennametal Shared Services Private Limited (KSSPL)", value: "Kennametal Shared Services Private Limited (KSSPL)" },
    { label: "Others, please specify", value: "Others, please specify" }
  ];

  const categoryOptions = [
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

  const departmentOptions = [
    { label: "MCDG - Sales", value: "MCDG - Sales" },
    { label: "MCDF + Infra Mfg - Manufacturing", value: "MCDF + Infra Mfg - Manufacturing" },
    { label: "MSG", value: "MSG" },
    { label: "Infrastructure", value: "Infrastructure" },
    { label: "Marketing", value: "Marketing" },
    { label: "Finance", value: "Finance" },
    { label: "HR", value: "HR" },
    { label: "Legal", value: "Legal" },
    { label: "R&D", value: "R&D" },
    { label: "Sourcing", value: "Sourcing" },
    { label: "EHS", value: "EHS" },
    { label: "Supply Chain & Distribution", value: "Supply Chain & Distribution" },
    { label: "ESG", value: "ESG" },
    { label: "Technology", value: "Technology" },
    { label: "Admin", value: "Admin" },
    { label: "MCDF", value: "MCDF" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Design", value: "Design" },
    { label: "Supply Planning & Logistics", value: "Supply Planning & Logistics" },
    { label: "Customer Service", value: "Customer Service" },
    { label: "Application Engineering", value: "Application Engineering" },
    { label: "Performance Value", value: "Performance Value" },
    { label: "Field", value: "Field" },
    { label: "Business Partners", value: "Business Partners" },
    { label: "Health and Safety", value: "Health and Safety" },
    { label: "Product Engineering", value: "Product Engineering" },
    { label: "Sales", value: "Sales" },
    { label: "Business Finance", value: "Business Finance" },
    { label: "Business Services", value: "Business Services" },
    { label: "Technology Industrial", value: "Technology Industrial" },
    { label: "Materials Science", value: "Materials Science" },
    { label: "Quality", value: "Quality" },
    { label: "Tax", value: "Tax" },
    { label: "General Counsel", value: "General Counsel" },
    { label: "End Market Strategies", value: "End Market Strategies" },
    { label: "Procurement", value: "Procurement" },
    { label: "General Mgmt/Admin", value: "General Mgmt/Admin" },
    { label: "Product Management Operations", value: "Product Management Operations" },
    { label: "Machine Tool Industry", value: "Machine Tool Industry" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; // Stop submission if validation fails
    
    const result = token.includes("&") ? token.split("&")[0] : null;
    
    // Determine final company name value based on selection
    const finalCompanyName = companyName === "Others, please specify" ? otherCompany : companyName;
    
    const payload = {
      employeeId,
      email,
      firstName,
      lastName,
      gender,
      token: result ? result : token,
      userType: "TRAINEE",
      categoryId: parseInt(categoryId),
      departmentId: parseInt(departmentId),
      companyName: finalCompanyName, // Add company name to payload
      businessUnit,
      division,
    };
    
    const { isSuccess, data } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}signupTrainee`,
      {},
      { ...payload },
      "POST"
    );
    if (isSuccess) {
      history.push(`/#/trainee_invite/${token}`);
      window.location.reload();
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!employeeId) newErrors.employeeId = "Employee ID is required";
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!departmentId) newErrors.departmentId = "Department is required";
    if (!companyName) {
      newErrors.companyName = "Company is required";
    } else if (companyName === "Others, please specify" && !otherCompany) {
      newErrors.otherCompany = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="form-title">Register Now</h2>
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
              </Form.Group>
              {errors.firstName && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.firstName}</p>}
            </Col>
            <Col sm="6" className="ms-2">
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
            <Col sm="6" className="ms-2">
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
                />
              </Form.Group>
              {errors.email && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.email}</p>}
            </Col>
            <Col sm="6" className="ms-2">
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

          <Row className="mt-4 mb-4">
            <Col sm="6">
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select category*</option>
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
              {errors.categoryId && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.categoryId}</p>}
            </Col>
            <Col sm="6" className="ms-2">
              <Form.Group controlId="formDepartment">
                <Form.Label>Business/Department*</Form.Label>
                <div className="select-wrapper">
                  <Form.Control
                    as="select"
                    className="form-controll"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((department) => (
                      <option key={department.value} value={department.value}>
                        {department.label}
                      </option>
                    ))}
                  </Form.Control>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </Form.Group>
              {errors.departmentId && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold", userSelect: "none" }}>{errors.departmentId}</p>}
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="register-btn">
            REGISTER
          </Button>        
        </Form>
      </div>
    </div>
    
  );
};

export default RegisterForm;