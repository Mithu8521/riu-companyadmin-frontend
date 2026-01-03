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

const RemoveUsersExcel = ({ show, onClose, setIsUserDataUploaded, financialYear, userList = [] }) => {
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

  const isUserFound = (identifier, type) => {
    if (!userList || userList.length === 0) return { found: true, user: null };

    const user = userList.find(user => {

      const normalizeId = (val) => String(val || '').replace(/^0+/, '');
      const normalizeEmail = (val) => String(val || '').toLowerCase();

      if (type === 'employeeId') {
        return (
          normalizeId(user.employeeId) === normalizeId(identifier) ||
          normalizeId(user.employee_id) === normalizeId(identifier) ||
          normalizeId(user.empId) === normalizeId(identifier)
        );
      } else if (type === 'email') {
        return (
          normalizeEmail(user.email) === normalizeEmail(identifier) ||
          normalizeEmail(user.emailId) === normalizeEmail(identifier) ||
          normalizeEmail(user.userEmail) === normalizeEmail(identifier)
        );
      }

      return false;
    });

    return { found: !!user, user };
  };

  const isDateInFinancialYear = (lastWorkingDate, fyStartDate, fyEndDate) => {
    if (!lastWorkingDate || !fyStartDate || !fyEndDate) return false;

    const normalize = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const lastWorking = normalize(lastWorkingDate);
    const start = normalize(fyStartDate);
    const end = normalize(fyEndDate);

    console.log(
      lastWorking,
      start,
      end,
      lastWorking >= start && lastWorking <= end,
      lastWorking >= start,
      lastWorking <= end
    );

    return lastWorking >= start && lastWorking <= end;
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

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!financialYear?.startDate || !financialYear?.endDate) {
      setError("Financial year dates are not provided. Please ensure financial year is set.");
      return;
    }

    setFile(uploadedFile);
    setError("");
    setResults([]);
    setProgress(0);
    setShowPreview(false);
    setIdentifierType("");

    try {
      setLoading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {
            type: "array",
            cellDates: true,
            cellStyles: true,
            dateNF: "dd/mm/yyyy",
            raw: false,
          });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Detect which identifier type is being used
          const { type: detectedType, error: detectionError } =
            detectIdentifierType(jsonData);

          if (detectionError) {
            setError(detectionError);
            setLoading(false);
            return;
          }

          setIdentifierType(detectedType);

          // Map the Excel columns and validate
          const mappedData = jsonData.map((row, index) => {
            let identifier = "";

            if (detectedType === "employeeId") {
              identifier = String(
                row["Employee ID"] || row["Employee ID*"] || ""
              ).trim();
            } else if (detectedType === "email") {
              identifier = String(row["Email"] || row["Email*"] || "").trim();
            }

            const rawDate = row["Last Working Date*"];
            let parsedDate = null;

            if (rawDate) {
              if (rawDate instanceof Date) {
                parsedDate = rawDate;
              } else {
                const dateStr = String(rawDate).trim();
                const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                const match = dateStr.match(ddmmyyyyPattern);

                if (match) {
                  const [, day, month, year] = match;
                  parsedDate = new Date(
                    parseInt(year, 10),
                    parseInt(month, 10) - 1,
                    parseInt(day, 10)
                  );
                } else {
                  parsedDate = new Date(rawDate);
                }
              }

              // Ensure it's a valid date
              if (!parsedDate || isNaN(parsedDate.getTime())) {
                parsedDate = null;
              } else {
                // ✅ Only add +1 day once (for timezone correction)
                parsedDate.setDate(parsedDate.getDate() + 1);
              }
            }

            const isValidPeriod = parsedDate
              ? isDateInFinancialYear(
                parsedDate,
                financialYear?.startDate,
                financialYear?.endDate
              )
              : false;

            const { found: userExists, user } = isUserFound(
              identifier,
              detectedType
            );

            // Validation logic
            let validationError = null;

            if (!identifier) {
              validationError = `${detectedType === "employeeId" ? "Employee ID" : "Email"
                } is required`;
            } else if (detectedType === "email" && !validateEmail(identifier)) {
              validationError = "Invalid email format";
            } else if (!userExists) {
              validationError = `User with ${detectedType === "employeeId" ? "Employee ID" : "Email"
                } '${identifier}' not found in the system`;
            } else if (!parsedDate) {
              validationError = "Invalid last working date format";
            } else if (!isValidPeriod) {
              validationError = `Last working date is not within financial year (${financialYear?.startDate} to ${financialYear?.endDate})`;
            }

            return {
              identifier,
              identifierType: detectedType,
              lastWorkingDate: parsedDate
                ? parsedDate.toISOString().split("T")[0]
                : "",
              rawLastWorkingDate: rawDate,
              isValidPeriod,
              userExists,
              foundUser: user,
              rowIndex: index + 1,
              validationError,
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

  // Generate template for user removal
  const generateTemplate = (type = "employeeId") => {
    let templateData;

    if (type === "employeeId") {
      templateData = [
        ["Employee ID*", "Last Working Date*"],
        ["EMP001", "01/06/2024"],
        ["EMP002", "15/06/2024"],
        ["EMP003", "30/06/2024"],
      ];
    } else {
      templateData = [
        ["Email*", "Last Working Date*"],
        ["john.doe@company.com", "01/06/2024"],
        ["jane.smith@company.com", "15/06/2024"],
        ["mike.johnson@company.com", "30/06/2024"],
      ];
    }

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Remove Users Template");

    // Auto-size columns
    const colWidths = type === "employeeId" ?
      [{ wch: 15 }, { wch: 18 }] : // Employee ID, Last Working Date
      [{ wch: 30 }, { wch: 18 }];  // Email, Last Working Date

    worksheet['!cols'] = colWidths;

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
    link.download = `Remove_Users_Template_${type === 'employeeId' ? 'EmployeeID' : 'Email'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Make API call to remove users in bulk
  const handleSubmit = async () => {
    if (!fileData.length) {
      setError("No data to process");
      return;
    }

    const validData = fileData.filter(row => !row.validationError);
    if (validData.length === 0) {
      setError("No valid records found. Please fix validation errors first.");
      return;
    }

    setLoading(true);
    setResults([]);
    setCurrentStep(3);

    try {
      setProgress(10);

      const requestPayload = {
        users: validData.map(row => ({
          [identifierType]: row.identifier,
          lastWorkingDate: row.lastWorkingDate,
        })),
        identifierType: identifierType // Send the type to API for processing
      };

      const {
        isSuccess,
        data,
        error: apiError,
      } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}removeUsersInBulk`,
        {},
        requestPayload,
        "POST"
      );
      setProgress(100);
      if (isSuccess && data) {
        setIsUserDataUploaded(true);
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          const processedResults = fileData.map((row) => {
            if (row.validationError) {
              return {
                identifier: row.identifier,
                identifierType: row.identifierType,
                lastWorkingDate: row.lastWorkingDate,
                success: false,
                message: row.validationError,
              };
            } else {
              return {
                identifier: row.identifier,
                identifierType: row.identifierType,
                lastWorkingDate: row.lastWorkingDate,
                success: true,
                message: "User removed successfully",
              };
            }
          });
          setResults(processedResults);
        }
      } else {
        setError(apiError || "Failed to remove users. Please try again.");
        setResults(
          fileData.map((row) => ({
            identifier: row.identifier,
            identifierType: row.identifierType,
            lastWorkingDate: row.lastWorkingDate,
            success: false,
            message: row.validationError || apiError || "API error occurred",
          }))
        );
      }
    } catch (err) {
      console.error("Error during bulk user removal:", err);
      setError(`Failed to process users: ${err.message || "Unknown error"}`);
      setResults(
        fileData.map((row) => ({
          identifier: row.identifier,
          identifierType: row.identifierType,
          lastWorkingDate: row.lastWorkingDate,
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
      ["Identifier Type", "Identifier", "Last Working Date", "Status", "Message"],
      ...results.map((r) => [
        r.identifierType === 'employeeId' ? 'Employee ID' : 'Email',
        r.identifier,
        r.lastWorkingDate,
        r.success ? "Success" : "Failed",
        r.message,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csv);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Removal Results");

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
    link.download = "user_removal_results.xlsx";
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
        <h5 className="mb-3">Remove Users - File Upload</h5>

        {financialYear?.startDate && financialYear?.endDate ? (
          <Alert variant="info" className="mb-3">
            <h6>Current Financial Year Period</h6>
            <div>
              <strong>Start Date:</strong> {financialYear.startDate}
              <br />
              <strong>End Date:</strong> {financialYear.endDate}
            </div>
            <small className="text-muted mt-1 d-block">
              Only users with last working dates within this period will be processed.
            </small>
          </Alert>
        ) : (
          <Alert variant="warning" className="mb-3">
            <strong>Warning:</strong> Financial year dates are not set. Please ensure they are provided before uploading.
          </Alert>
        )}

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
          <p className="small text-muted">Excel file with consistent identifier type and Last Working Date</p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => fileInputRef.current.click()}
            disabled={!financialYear?.startDate || !financialYear?.endDate}
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
          Required columns: (Employee ID* OR Email*), Last Working Date*
          <br />
          Last Working Date format: DD/MM/YYYY (example: 01/06/2024)
          <br />
          All rows must use the same identifier type (all Employee IDs OR all Emails)
          <br />
          Last Working Date must fall within the specified financial year period.
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

        <div className="row mb-3">
          <div className="col-md-6">
            {financialYear?.startDate && financialYear?.endDate && (
              <Alert variant="info" className="mb-2">
                <small>
                  <strong>Financial Year Period:</strong><br />
                  {financialYear.startDate} to {financialYear.endDate}
                </small>
              </Alert>
            )}
          </div>
          <div className="col-md-6">
            {identifierType && (
              <Alert variant="success" className="mb-2">
                <small>
                  <strong>Detected Identifier Type:</strong><br />
                  {identifierType === 'employeeId' ? 'Employee ID' : 'Email'}
                </small>
              </Alert>
            )}
          </div>
        </div>

        {userList && userList.length > 0 && (
          <Alert variant="success" className="mb-3">
            <small>
              <strong>User Verification:</strong> {userList.length} users available for validation
            </small>
          </Alert>
        )}

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
                    <th>{identifierType === 'employeeId' ? 'Employee ID' : 'Email'}</th>
                    <th>User Found</th>
                    <th>Last Working Date</th>
                    <th>Date Valid</th>
                    <th>Status</th>
                    <th>Validation Message</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index} className={row.validationError ? 'table-danger' : 'table-success'}>
                      <td>{row.rowIndex}</td>
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
                      <td><small>{row.lastWorkingDate || row.rawLastWorkingDate}</small></td>
                      <td>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: row.isValidPeriod ? "#198754" : "#dc3545",
                            color: "white",
                          }}
                        >
                          {row.isValidPeriod ? "Valid" : "Invalid"}
                        </span>
                      </td>
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
                {userList && userList.length > 0 && (
                  <> | Users Found: {fileData.filter(row => row.userExists).length} | Not Found: {fileData.filter(row => !row.userExists).length}</>
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
        <h5 className="mb-3">User Removal Results</h5>

        {loading && (
          <div className="mb-4">
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              animated
              className="mb-2"
            />
            <p className="text-muted small">
              Processing user removals... {progress}% complete
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
                    <th>{identifierType === 'employeeId' ? 'Employee ID' : 'Email'}</th>
                    <th>Last Working Date</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td><small>{result.identifier}</small></td>
                      <td><small>{result.lastWorkingDate}</small></td>
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
              Remove Users ({validRecords.length})
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

  // Render modal content based on current step
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
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bulk User Removal</Modal.Title>
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

export default RemoveUsersExcel;