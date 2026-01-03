import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Modal,
  Button,
  Form,
  ProgressBar,
  Table,
  Alert,
} from "react-bootstrap";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

// Modal component for file upload and processing
const UploadRegistrationExcel = ({ show, onClose, setIsUserDataUploaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  // Helper function to format date
const formatDate = (dateValue) => {
  if (!dateValue) return null;

  try {
    let date;

    // If it's already a Date object (from Excel)
    if (dateValue instanceof Date) {
      date = dateValue;
    }
    // If it's a string, try to parse it
    else if (typeof dateValue === 'string') {
      // Handle common date formats like DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      } else {
        // Try different parsing approaches for various formats
        const dateStr = dateValue.trim();
        const patterns = [
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
          /^(\d{4})-(\d{1,2})-(\d{1,2})$/,   // YYYY-MM-DD
          /^(\d{1,2})-(\d{1,2})-(\d{4})$/,   // DD-MM-YYYY or MM-DD-YYYY
        ];

        for (const pattern of patterns) {
          const match = dateStr.match(pattern);
          if (match) {
            if (pattern === patterns[1]) { // YYYY-MM-DD
              date = new Date(match[1], match[2] - 1, match[3]);
            } else { // Assume DD/MM/YYYY format for others
              date = new Date(match[3], match[2] - 1, match[1]);
            }
            break;
          }
        }
      }
    }
    // If it's a number (Excel serial date)
    else if (typeof dateValue === 'number') {
      // Excel date serial number conversion
      date = new Date((dateValue - 25569) * 86400 * 1000);
    }

    // ✅ Validate and add 1 day
    if (date && !isNaN(date.getTime())) {
      date.setDate(date.getDate() + 1); // increase by 1 day
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    return null;
  } catch (err) {
    console.error('Error parsing date:', dateValue, err);
    return null;
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
          });

          // Get the first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Map the Excel columns to our DTO properties
          const mapGender = (genderValue) => {
            const value = String(genderValue).trim().toUpperCase();
            if (value === "MALE" || value === "M") return "MALE";
            if (value === "FEMALE" || value === "F") return "FEMALE";
            if (value === "OTHER" || value === "O") return "OTHER";
            return "MALE"; // Default value if not matched
          };

          // Map the Excel columns to our DTO properties
          const mappedData = jsonData.map((row, index) => {
            const joiningDate = formatDate(row["Joining Date*"] || row["Joining Date"]);
            
            return {
              employeeId: String(row["Employee ID*"]) || "",
              firstName: row["First Name*"] || "",
              lastName: row["Last Name"] || "",
              email: row["Email ID"] || "",
              gender: mapGender(row["Gender*"]),
              categoryId: row["Category*"] || "",
              departmentId: row["Department*"] || "",
              companyName: row["Company Name"] || "",
              businessUnit: row["Business Unit"] || "",
              division: row["Division"] || "",
              joiningDate: joiningDate,
              _rowIndex: index + 2, // For error reporting (Excel row number)
            };
          });

          // Validate required fields including joining date
          const validationErrors = [];
          mappedData.forEach((row, index) => {
            const errors = [];
            if (!row.employeeId.trim()) errors.push("Employee ID");
            if (!row.firstName.trim()) errors.push("First Name");
            if (!row.joiningDate) errors.push("Joining Date");
            
            if (errors.length > 0) {
              validationErrors.push(`Row ${row._rowIndex}: Missing ${errors.join(", ")}`);
            }
          });

          if (validationErrors.length > 0) {
            setError(`Validation errors:\n${validationErrors.slice(0, 5).join("\n")}${validationErrors.length > 5 ? `\n... and ${validationErrors.length - 5} more errors` : ""}`);
            setLoading(false);
            return;
          }

          setFileData(mappedData);
          setShowPreview(true);
          setCurrentStep(2);
        } catch (err) {
          console.error("Error processing file:", err);
          setError("Failed to process the file. Please check the format and ensure all required fields are present.");
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

const generateTemplate = () => {
  try {
    // Create template data with headers and sample row
    const templateData = [
      [
        "Employee ID*",
        "First Name*",
        "Last Name",
        "Email ID",
        "Gender*",
        "Category*",
        "Department*",
        "Company Name",
        "Business Unit",
        "Division",
        "Joining Date*"
      ],
      [
        "EMP001",
        "John",
        "Doe",
        "john.doe@example.com",
        "MALE",
        "1",
        "1",
        "Acme Corp",
        "Engineering",
        "Software",
        "01/01/2024"
      ]
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 15 }, // Employee ID
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 25 }, // Email ID
      { wch: 10 }, // Gender
      { wch: 12 }, // Category
      { wch: 15 }, // Department
      { wch: 20 }, // Company Name
      { wch: 18 }, // Business Unit
      { wch: 15 }, // Division
      { wch: 15 }  // Joining Date
    ];

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainee Registration");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob and download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trainee_registration_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Template generation failed:", error);
    setError("Failed to generate template. Please try again.");
  }
}

  // Make API call to register trainees in bulk
  const handleSubmit = async () => {
    if (!fileData.length) {
      setError("No data to process");
      return;
    }

    setLoading(true);
    setResults([]);
    setCurrentStep(3);

    try {
      // Update progress to show processing has started
      setProgress(10);

      // Prepare the request payload
      const requestPayload = {
        trainees: fileData.map(({ _rowIndex, ...trainee }) => trainee), // Remove the row index before sending
        userType: "TRAINEE", // You can make this configurable if needed
      };

      // Make API call
      const {
        isSuccess,
        data,
        error: apiError,
      } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}signupBulkTrainee`,
        {},
        requestPayload,
        "POST"
      );
      setIsUserDataUploaded(true);
      // Update progress
      setProgress(100);

      if (isSuccess && data) {
        // Process the actual API response
        if (data.data.results && Array.isArray(data.data.results)) {
          // If API returns results directly
          setResults(data.data.results);
        } else if (data.trainees && Array.isArray(data.trainees)) {
          // Alternative structure
          setResults(
            data.trainees.map((trainee) => ({
              email: trainee.email,
              employeeId: trainee.employeeId,
              success: trainee.success,
              message: trainee.message,
            }))
          );
        } else {
          // Fallback for unexpected response format
          setResults(
            fileData.map((trainee) => ({
              email: trainee.email,
              employeeId: trainee.employeeId,
              success: true,
              message: "Registration processed",
            }))
          );
        }
      } else {
        // Handle API error
        setError(apiError || "Failed to register trainees. Please try again.");
        // Still show the attempted registrations as failed
        setResults(
          fileData.map((trainee) => ({
            email: trainee.email,
            employeeId: trainee.employeeId,
            success: false,
            message: apiError || "API error occurred",
          }))
        );
      }
    } catch (err) {
      console.error("Error during bulk registration:", err);
      setError(`Failed to process users: ${err.message || "Unknown error"}`);
      // Show all as failed
      setResults(
        fileData.map((trainee) => ({
          email: trainee.email,
          employeeId: trainee.employeeId,
          success: false,
          message: "Error during processing",
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Export results to Excel
  const exportResults = () => {
    const csv = [
      ["Employee ID", "Email", "Status", "Message"],
      ...results.map((r) => [
        r.employeeId,
        r.email,
        r.success ? "Success" : "Failed",
        r.message,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csv);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registration_results.xlsx";
    link.click();
  };

  // Render the steps indicator
  const renderStepsIndicator = () => {
    return (
      <div className="d-flex align-items-center mb-4">
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle mr-2 text-center ${
            currentStep >= 1 ? "bg-primary text-white" : "bg-light text-dark"
          }`}
          style={{ width: "30px", height: "30px", marginRight: "8px" }}
        >
          1
        </div>
        <div
          className={`flex-grow-1 ${
            currentStep >= 2 ? "bg-primary" : "bg-light"
          }`}
          style={{ height: "2px" }}
        ></div>
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle mx-2 text-center ${
            currentStep >= 2 ? "bg-primary text-white" : "bg-light text-dark"
          }`}
          style={{ width: "30px", height: "30px", margin: "0 8px" }}
        >
          2
        </div>
        <div
          className={`flex-grow-1 ${
            currentStep >= 3 ? "bg-primary" : "bg-light"
          }`}
          style={{ height: "2px" }}
        ></div>
        <div
          className={`d-flex align-items-center justify-content-center rounded-circle ml-2 text-center ${
            currentStep >= 3 ? "bg-primary text-white" : "bg-light text-dark"
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
        <h5 className="mb-3">Upload Excel File</h5>
        <Alert variant="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={generateTemplate}
            >
              Download Template
            </Button>
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
          <p className="small text-muted">Excel or ODS file</p>
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
          File should contain columns: Employee ID*, First Name*, Last Name,
          Email ID, Gender*, Category*, Department*, Company Name, Business Unit, Division, Joining Date*
          <br />
          <strong>Note:</strong> Joining Date should be in DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD format.
        </p>
      </>
    );
  };

  // Step 2: Preview
  const renderStep2 = () => {
    return (
      <>
        <h5 className="mb-3">Data Preview</h5>

        {/* Data Preview */}
        {showPreview && fileData.length > 0 && (
          <div className="mb-4">
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th className="text-nowrap">Employee ID*</th>
                    <th className="text-nowrap">First Name*</th>
                    <th className="text-nowrap">Last Name</th>
                    <th className="text-nowrap">Email ID</th>
                    <th className="text-nowrap">Gender*</th>
                    <th className="text-nowrap">Category*</th>
                    <th className="text-nowrap">Department*</th>
                    <th className="text-nowrap">Business Unit</th>
                    <th className="text-nowrap">Division</th>
                    <th className="text-nowrap">Joining Date*</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index}>
                      <td className="text-nowrap">{row.employeeId}</td>
                      <td className="text-nowrap">{row.firstName}</td>
                      <td className="text-nowrap">{row.lastName}</td>
                      <td className="text-nowrap">{row.email}</td>
                      <td className="text-nowrap">{row.gender}</td>
                      <td className="text-nowrap">{row.categoryId}</td>
                      <td className="text-nowrap">{row.departmentId}</td>
                      <td className="text-nowrap">{row.businessUnit}</td>
                      <td className="text-nowrap">{row.division}</td>
                      <td className="text-nowrap">
                        <span style={{ 
                          backgroundColor: row.joiningDate ? '#d1edff' : '#ffe6e6',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '0.85em'
                        }}>
                          {row.joiningDate || 'Invalid Date'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <p className="mt-2 text-muted small">
              Showing all {fileData.length} records
            </p>
          </div>
        )}
      </>
    );
  };

  // Step 3: Results
  const renderStep3 = () => {
    return (
      <>
        <h5 className="mb-3">Registration Results</h5>

        {loading && (
          <div className="mb-4">
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              animated
              className="mb-2"
            />
            <p className="text-muted small">
              Processing trainees... {progress}% complete
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            {console.log(results, "results")}
            <div
              style={{ maxHeight: "300px", overflowY: "auto" }}
              className="mb-3"
            >
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>{result.employeeId}</td>
                      <td>{result.email}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor: result.success
                              ? "#198754"
                              : "#dc3545",
                            color: "white",
                          }}
                        >
                          {result.success ? "Success" : "Failed"}
                        </span>
                      </td>
                      <td>{result.message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-muted mb-0">
                Total: {results.length} | Success:{" "}
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
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || !fileData.length}
            >
              Register Trainees
            </Button>
          </Modal.Footer>
        );

      case 3:
        return (
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Start New Upload
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
        <Modal.Title>Bulk Trainee Registration</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-0">
        {error && (
          <Alert variant="danger" className="mb-3" style={{ whiteSpace: 'pre-line' }}>
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

export default UploadRegistrationExcel;