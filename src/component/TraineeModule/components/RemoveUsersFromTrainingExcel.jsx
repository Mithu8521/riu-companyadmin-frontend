import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Modal,
  Button,
  Form,
  ProgressBar,
  Table,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const RemoveUsersFromTrainingExcel = ({
  show,
  onClose,
  setIsUserDataUploaded,
  trainingList = [],
  userList = []
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [identifierType, setIdentifierType] = useState(""); // "employeeId" or "email"
  const fileInputRef = useRef(null);

  // Validate if training exists in the provided training list
  const isTrainingFound = (trainingId) => {
    if (!trainingList || trainingList.length === 0) return true; // Skip validation if no training list provided
    return trainingList.some(training =>
      training.trainingId === trainingId ||
      training.training_id === trainingId ||
      training.id === trainingId ||
      String(training.trainingId) === String(trainingId) ||
      String(training.training_id) === String(trainingId) ||
      String(training.id) === String(trainingId)
    );
  };

  // Get training name by ID
  const getTrainingName = (trainingId) => {
    if (!trainingList || trainingList.length === 0) return "Unknown Training";
    const training = trainingList.find(t =>
      t.trainingId === trainingId ||
      t.training_id === trainingId ||
      t.id === trainingId ||
      String(t.trainingId) === String(trainingId) ||
      String(t.training_id) === String(trainingId) ||
      String(t.id) === String(trainingId)
    );
    return training ? (training.trainingTitle || training.training_name || training.name || "Unknown Training") : "Unknown Training";
  };

  // Validate if user exists in the provided user list
  const isUserFound = (identifier, type) => {
    if (!userList || userList.length === 0) return { found: true, user: null }; // Skip validation if no user list provided

    const normalizeId = (val) => String(val || '').replace(/^0+/, '');
    const normalizeEmail = (val) => String(val || '').toLowerCase();

    const user = userList.find(user => {
      if (type === 'employeeId') {
        const identifierNorm = normalizeId(identifier);
        return (
          normalizeId(user.employeeId) === identifierNorm ||
          normalizeId(user.employee_id) === identifierNorm ||
          normalizeId(user.empId) === identifierNorm
        );
      } else if (type === 'email') {
        const identifierNorm = normalizeEmail(identifier);
        return (
          normalizeEmail(user.email) === identifierNorm ||
          normalizeEmail(user.emailId) === identifierNorm ||
          normalizeEmail(user.userEmail) === identifierNorm
        );
      }
      return false;
    });

    return { found: !!user, user };
  };

  // Get user name by identifier
  const getUserName = (identifier, type) => {
    if (!userList || userList.length === 0) return "Unknown User";
    const { user } = isUserFound(identifier, type);
    return user ? (user.firstName || user.first_name || user.name || user.fullName || "Unknown User") : "Unknown User";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const detectIdentifierType = (jsonData) => {
    // Check which column exists and has data
    const hasEmployeeId = jsonData.some(row =>
      (row["Employee ID"] || row["Employee ID*"] || "").toString().trim()
    );
    const hasEmail = jsonData.some(row =>
      (row["Email"] || row["Email*"] || "").toString().trim()
    );

    if (hasEmployeeId && hasEmail) {
      return { type: null, error: "File contains both Employee ID and Email columns. Please use only one identifier type per file." };
    } else if (hasEmployeeId) {
      return { type: "employeeId", error: null };
    } else if (hasEmail) {
      return { type: "email", error: null };
    } else {
      return { type: null, error: "File must contain either Employee ID or Email column with data." };
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError("");
    setResults([]);
    setProgress(0);
    setShowPreview(false);
    setIdentifierType("");

    try {
      setLoading(true);

      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {
            type: "array",
            cellDates: true,
            cellStyles: true,
            raw: false
          });

          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Detect which identifier type is being used
          const { type: detectedType, error: detectionError } = detectIdentifierType(jsonData);

          if (detectionError) {
            setError(detectionError);
            setLoading(false);
            return;
          }

          setIdentifierType(detectedType);

          // Map the Excel columns and validate
          const mappedData = jsonData.map((row, index) => {
            const trainingId = String(row["Training ID*"] || "").trim();

            let identifier = "";
            if (detectedType === "employeeId") {
              identifier = String(row["Employee ID"] || row["Employee ID*"] || "").trim();
            } else if (detectedType === "email") {
              identifier = String(row["Email"] || row["Email*"] || "").trim();
            }

            const trainingExists = isTrainingFound(trainingId);
            const { found: userExists, user } = isUserFound(identifier, detectedType);
            const trainingName = getTrainingName(trainingId);
            const userName = getUserName(identifier, detectedType);

            // Validation logic
            let validationError = null;

            if (!trainingId) {
              validationError = "Training ID is required";
            } else if (!identifier) {
              validationError = `${detectedType === 'employeeId' ? 'Employee ID' : 'Email'} is required`;
            } else if (detectedType === "email" && !validateEmail(identifier)) {
              validationError = "Invalid email format";
            } else if (!trainingExists) {
              validationError = `Training with ID '${trainingId}' not found in the system`;
            } else if (!userExists) {
              validationError = `User with ${detectedType === 'employeeId' ? 'Employee ID' : 'Email'} '${identifier}' not found in the system`;
            }

            return {
              trainingId,
              identifier,
              identifierType: detectedType,
              trainingName,
              userName,
              trainingExists,
              userExists,
              foundUser: user,
              rowIndex: index + 1,
              validationError
            };
          });

          setFileData(mappedData);
          setShowPreview(true);
          setCurrentStep(2);
        } catch (err) {
          console.error("Error processing file:", err);
          setError("Failed to process the file. Please check the format.");
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read the file");
        setLoading(false);
      };

      reader.readAsArrayBuffer(uploadedFile);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload the file");
      setLoading(false);
    }
  };

  // Generate template for training user removal
  const generateTemplate = (type = "employeeId") => {
    let templateData;

    if (type === "employeeId") {
      templateData = [
        ["Training ID*", "Employee ID*"],
        ["TRN001", "EMP001"],
        ["TRN002", "EMP002"],
        ["TRN001", "EMP003"],
      ];
    } else {
      templateData = [
        ["Training ID*", "Email*"],
        ["TRN001", "john.doe@company.com"],
        ["TRN002", "jane.smith@company.com"],
        ["TRN001", "mike.johnson@company.com"],
      ];
    }

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Remove Training Users Template");

    // Auto-size columns
    const colWidths = type === "employeeId" ?
      [{ wch: 15 }, { wch: 15 }] : // Training ID, Employee ID
      [{ wch: 15 }, { wch: 30 }];  // Training ID, Email

    worksheet['!cols'] = colWidths;

    // Create and download file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Remove_Training_Users_Template_${type === 'employeeId' ? 'EmployeeID' : 'Email'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Make API call to remove users from training in bulk
  const handleSubmit = async () => {
    if (!fileData.length) {
      setError("No data to process");
      return;
    }

    // Check if there are any validation errors
    const validData = fileData.filter(row => !row.validationError);
    if (validData.length === 0) {
      setError("No valid records found. Please fix validation errors first.");
      return;
    }

    setLoading(true);
    setResults([]);
    setCurrentStep(3);

    try {
      // Update progress to show processing has started
      setProgress(10);

      // Prepare the request payload with only valid data
      const requestPayload = {
        trainingUsers: validData.map(row => ({
          trainingId: row.trainingId,
          [identifierType]: row.identifier,
        })),
        identifierType: identifierType // Send the type to API for processing
      };

      // Make API call - adjust the endpoint as per your API
      const {
        isSuccess,
        data,
        error: apiError,
      } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}removeUsersFromTrainingInBulk`, // Adjust endpoint
        {},
        requestPayload,
        "POST"
      );

      setIsUserDataUploaded(true);
      setProgress(100);

      if (isSuccess && data) {
        // Process the API response
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          // Create results from processed data
          const processedResults = fileData.map((row) => {
            if (row.validationError) {
              return {
                trainingId: row.trainingId,
                identifier: row.identifier,
                identifierType: row.identifierType,
                trainingName: row.trainingName,
                userName: row.userName,
                success: false,
                message: row.validationError,
              };
            } else {
              return {
                trainingId: row.trainingId,
                identifier: row.identifier,
                identifierType: row.identifierType,
                trainingName: row.trainingName,
                userName: row.userName,
                success: true,
                message: "User removed from training successfully",
              };
            }
          });
          setResults(processedResults);
        }
      } else {
        // Handle API error
        setError(apiError || "Failed to remove users from training. Please try again.");
        setResults(
          fileData.map((row) => ({
            trainingId: row.trainingId,
            identifier: row.identifier,
            identifierType: row.identifierType,
            trainingName: row.trainingName,
            userName: row.userName,
            success: false,
            message: row.validationError || apiError || "API error occurred",
          }))
        );
      }
    } catch (err) {
      console.error("Error during bulk training user removal:", err);
      setError(`Failed to process training users: ${err.message || "Unknown error"}`);
      setResults(
        fileData.map((row) => ({
          trainingId: row.trainingId,
          identifier: row.identifier,
          identifierType: row.identifierType,
          trainingName: row.trainingName,
          userName: row.userName,
          success: false,
          message: row.validationError || "Error during processing",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setFileData([]);
    setResults([]);
    setError("");
    setProgress(0);
    setShowPreview(false);
    setCurrentStep(1);
    setIdentifierType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Export results to Excel
  const exportResults = () => {
    const csv = [
      ["Training ID", "Identifier Type", "Identifier", "Training Name", "User Name", "Status", "Message"],
      ...results.map((r) => [
        r.trainingId,
        r.identifierType === 'employeeId' ? 'Employee ID' : 'Email',
        r.identifier,
        r.trainingName,
        r.userName,
        r.success ? "Success" : "Failed",
        r.message,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csv);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Removal Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "training_user_removal_results.xlsx";
    link.click();
  };

  // Render the steps indicator
  const renderStepsIndicator = () => {
    return (
      <div className="d-flex align-items-center mb-4">
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle mr-2 text-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-light text-dark"
            }`}
          style={{ width: "30px", height: "30px", marginRight: "8px" }}
        >
          1
        </div>
        <div
          className={`flex-grow-1 ${currentStep >= 2 ? "bg-primary" : "bg-light"
            }`}
          style={{ height: "2px" }}
        ></div>
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle mx-2 text-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-light text-dark"
            }`}
          style={{ width: "30px", height: "30px", margin: "0 8px" }}
        >
          2
        </div>
        <div
          className={`flex-grow-1 ${currentStep >= 3 ? "bg-primary" : "bg-light"
            }`}
          style={{ height: "2px" }}
        ></div>
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle ml-2 text-center ${currentStep >= 3 ? "bg-primary text-white" : "bg-light text-dark"
            }`}
          style={{ width: "30px", height: "30px", marginLeft: "8px" }}
        >
          3
        </div>
      </div>
    );
  };

  // Step 1: File Upload
  const renderStep1 = () => {
    return (
      <>
        <h5 className="mb-3">Remove Users from Training - File Upload</h5>

        {/* Training and User Lists Info */}
        <Row className="mb-3">
          <Col md={6}>
            {trainingList && trainingList.length > 0 ? (
              <Alert variant="success">
                <h6>Training Validation</h6>
                <div>
                  <strong>Available Trainings:</strong> {trainingList.length}
                </div>
                <small className="text-muted mt-1 d-block">
                  Training IDs will be validated against this list.
                </small>
              </Alert>
            ) : (
              <Alert variant="warning">
                <strong>Warning:</strong> Training list is not provided. Training validation will be skipped.
              </Alert>
            )}
          </Col>
          <Col md={6}>
            {userList && userList.length > 0 ? (
              <Alert variant="success">
                <h6>User Validation</h6>
                <div>
                  <strong>Available Users:</strong> {userList.length}
                </div>
                <small className="text-muted mt-1 d-block">
                  User identifiers will be validated against this list.
                </small>
              </Alert>
            ) : (
              <Alert variant="warning">
                <strong>Warning:</strong> User list is not provided. User validation will be skipped.
              </Alert>
            )}
          </Col>
        </Row>

        <Alert variant="info" className="mb-3">
          <div>
            <h6>Template Options:</h6>
            <p className="mb-2">Choose one identifier type for your entire file:</p>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => generateTemplate("employeeId")}
              >
                Download Employee ID Template
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => generateTemplate("email")}
              >
                Download Email Template
              </Button>
            </div>
            <small className="text-muted mt-2 d-block">
              <strong>Important:</strong> Use only ONE identifier type per file. Do not mix Employee IDs and Emails in the same file.
            </small>
          </div>
        </Alert>

        <div className="text-center p-4 mb-3 border border-2 border-dashed rounded">
          <Form.Control
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept=".xlsx,.xls,.csv,.ods"
            onChange={handleFileUpload}
          />
          <svg
            className="mb-3 mx-auto"
            style={{ width: "48px", height: "48px", color: "#6c757d" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-1 text-secondary">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className="small text-muted">Excel file with Training ID and consistent user identifier</p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => fileInputRef.current.click()}
          >
            Select File
          </Button>
        </div>

        {file && (
          <Alert variant="success" className="d-flex align-items-center p-2">
            <svg
              className="mr-2"
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{file.name}</span>
          </Alert>
        )}

        <p className="text-muted small mt-3">
          Supported formats: Excel (.xlsx, .xls), CSV (.csv), OpenDocument Spreadsheet (.ods)
          <br />
          Required columns: Training ID*, (Employee ID* OR Email*)
          <br />
          All rows must use the same identifier type (all Employee IDs OR all Emails)
          <br />
          Training ID and user identifiers will be verified against the provided lists.
        </p>
      </>
    );
  };

  // Step 2: Preview with validation
  const renderStep2 = () => {
    const validRecords = fileData.filter(row => !row.validationError);
    const invalidRecords = fileData.filter(row => row.validationError);

    return (
      <>
        <h5 className="mb-3">Data Preview & Validation</h5>

        <Row className="mb-3">
          <Col md={4}>
            {trainingList && trainingList.length > 0 && (
              <Alert variant="info">
                <small>
                  <strong>Training Validation:</strong> {trainingList.length} trainings available
                </small>
              </Alert>
            )}
          </Col>
          <Col md={4}>
            {userList && userList.length > 0 && (
              <Alert variant="info">
                <small>
                  <strong>User Validation:</strong> {userList.length} users available
                </small>
              </Alert>
            )}
          </Col>
          <Col md={4}>
            {identifierType && (
              <Alert variant="success">
                <small>
                  <strong>Detected Identifier:</strong> {identifierType === 'employeeId' ? 'Employee ID' : 'Email'}
                </small>
              </Alert>
            )}
          </Col>
        </Row>

        {invalidRecords.length > 0 && (
          <Alert variant="danger" className="mb-3">
            <strong>Validation Errors Found:</strong> {invalidRecords.length} records have errors and will be skipped.
          </Alert>
        )}

        {showPreview && fileData.length > 0 && (
          <div className="mb-4">
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Training ID</th>
                    <th>Training Found</th>
                    <th>Training Name</th>
                    <th>{identifierType === 'employeeId' ? 'Employee ID' : 'Email'}</th>
                    <th>User Found</th>
                    <th>User Name</th>
                    <th>Status</th>
                    <th>Validation Message</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index} className={row.validationError ? 'table-danger' : 'table-success'}>
                      <td>{row.rowIndex}</td>
                      <td><small>{row.trainingId}</small></td>
                      <td>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: row.trainingExists ? "#198754" : "#dc3545",
                            color: "white",
                          }}
                        >
                          {row.trainingExists ? "Found" : "Not Found"}
                        </span>
                      </td>
                      <td><small>{row.trainingName}</small></td>
                      <td><small>{row.identifier}</small></td>
                      <td>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: row.userExists ? "#198754" : "#dc3545",
                            color: "white",
                          }}
                        >
                          {row.userExists ? "Found" : "Not Found"}
                        </span>
                      </td>
                      <td><small>{row.userName}</small></td>
                      <td>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: row.validationError ? "#dc3545" : "#198754",
                            color: "white",
                          }}
                        >
                          {row.validationError ? "Error" : "Valid"}
                        </span>
                      </td>
                      <td>
                        <small>
                          {row.validationError || "Ready for processing"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Total: {fileData.length} | Valid: {validRecords.length} | Errors: {invalidRecords.length}
                {trainingList && trainingList.length > 0 && (
                  <> | Trainings Found: {fileData.filter(row => row.trainingExists).length} | Training Not Found: {fileData.filter(row => !row.trainingExists).length}</>
                )}
                {userList && userList.length > 0 && (
                  <> | Users Found: {fileData.filter(row => row.userExists).length} | User Not Found: {fileData.filter(row => !row.userExists).length}</>
                )}
              </small>
            </div>
          </div>
        )}
      </>
    );
  };

  // Step 3: Results
  const renderStep3 = () => {
    return (
      <>
        <h5 className="mb-3">Training User Removal Results</h5>

        {loading && (
          <div className="mb-4">
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              animated
              className="mb-2"
            />
            <p className="text-muted small">
              Processing training user removals... {progress}% complete
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="mb-2">
              <small className="text-muted">
                <strong>Processed using:</strong> {identifierType === 'employeeId' ? 'Employee ID' : 'Email'}
              </small>
            </div>

            <div
              style={{ maxHeight: "300px", overflowY: "auto" }}
              className="mb-3"
            >
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Training ID</th>
                    <th>Training Name</th>
                    <th>{identifierType === 'employeeId' ? 'Employee ID' : 'Email'}</th>
                    <th>User Name</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td><small>{result.trainingId}</small></td>
                      <td><small>{result.trainingName}</small></td>
                      <td><small>{result.identifier}</small></td>
                      <td><small>{result.userName}</small></td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor: result.success ? "#198754" : "#dc3545",
                            color: "white",
                          }}
                        >
                          {result.success ? "Removed" : "Failed"}
                        </span>
                      </td>
                      <td><small>{result.message}</small></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-muted mb-0">
                Total: {results.length} | Successfully Removed:{" "}
                {results.filter((r) => r.success).length} | Failed:{" "}
                {results.filter((r) => !r.success).length}
              </p>
              <Button variant="success" size="sm" onClick={exportResults}>
                Export Results
              </Button>
            </div>
          </>
        )}
      </>
    );
  };

  // Render modal footer based on current step
  const renderFooter = () => {
    switch (currentStep) {
      case 1:
        return <Modal.Footer></Modal.Footer>;

      case 2:
        const validRecords = fileData.filter(row => !row.validationError);
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Back
            </Button>
            <Button
              variant="danger"
              onClick={handleSubmit}
              disabled={loading || validRecords.length === 0}
            >
              Remove Users from Training ({validRecords.length})
            </Button>
          </Modal.Footer>
        );

      case 3:
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Process New File
            </Button>
          </Modal.Footer>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove Users from Training - Bulk Upload</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-0">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {renderStepsIndicator()}
        {renderStepContent()}
      </Modal.Body>

      {renderFooter()}
    </Modal>
  );
};

export default RemoveUsersFromTrainingExcel;