import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Form,
  ProgressBar,
  Table,
  Alert,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

// Custom Modal component to replace React Bootstrap Modal
// Custom Modal component with fixed hook rules
// Custom Modal component with fixed hook rules
const CustomModal = ({ show, onClose, children, title, footerContent }) => {
  // Hooks must be called unconditionally at the top level
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // Early return after hooks are called
  if (!show) return null;

  return (
    <>
      {/* Custom backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Custom modal container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050,
        }}
      >
        {/* Modal content */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
            width: "800px",
            maxWidth: "95%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderBottom: "1px solid #dee2e6",
            }}
          >
            <h5 style={{ margin: 0 }}>{title}</h5>
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                fontWeight: "bold",
                lineHeight: 1,
                color: "#000",
                opacity: 0.5,
                cursor: "pointer",
              }}
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "1rem",
              overflowY: "auto",
              flex: "1 1 auto",
            }}
          >
            {children}
          </div>

          {/* Footer */}
          {footerContent && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "1rem",
                borderTop: "1px solid #dee2e6",
                gap: "0.5rem",
              }}
            >
              {footerContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Modal component for file upload and processing
const UploadTrainingAssignmentExcel = ({
  show,
  onClose,
  trainingData,
  userList,
  setIsTraineeDataUploaded,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileData, setFileData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);
  const [matchError, setMatchError] = useState(null);
  const [userMatchError, setUserMatchError] = useState(null);

  // Status checkboxes
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle file upload with enhanced duplicate detection
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError("");
    setMatchError(null);
    setUserMatchError(null);
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

          // Array to hold all mapped data
          let mappedData = [];
          
          // Track user-training combinations to detect duplicates
          const userTrainingCombinations = new Map();

          // Process each row from the Excel file
          jsonData.forEach((row, rowIndex) => {
            const trainingName = row["Name Of Training"] || "";
            const employeeId = row["Employee ID*"] || "";
            const email = row["Email ID"] || "";

            // Find ALL matching trainings (handle duplicate training names)
            let matchedTrainings = [];

            if (trainingData && trainingData.length > 0 && trainingName) {
              matchedTrainings = trainingData.filter(
                (t) =>
                  t.title?.toLowerCase() === trainingName.toLowerCase() ||
                  t.trainingTitle?.toLowerCase() === trainingName.toLowerCase()
              );
            }

            // Find matching user from userList
            let userId = null;
            let hasUserMatch = false;

            if (userList && userList.length > 0) {
              const normalizedEmployeeId = employeeId?.toString().replace(/^0+/, '');
            
              const matchedUser = userList.find((u) => {
                const userEmployeeId = u.employeeId?.toString().replace(/^0+/, '');
                return normalizedEmployeeId && userEmployeeId === normalizedEmployeeId;
              });
            
              if (matchedUser) {
                userId = matchedUser.id || matchedUser.userId;
                hasUserMatch = true;
              }
            }           

            // If no matching trainings were found, create a single entry with no match
            if (matchedTrainings.length === 0) {
              mappedData.push({
                trainingId: null,
                trainingName,
                employeeId,
                email,
                userId,
                hasMatch: false,
                hasUserMatch,
                isDuplicate: false,
                isUserDuplicate: false,
                rowIndex: rowIndex + 1, // 1-based row number
              });
            } else {
              // Create an entry for each matching training
              matchedTrainings.forEach((training, index) => {
                const trainingId = training.id || training.trainingId;
                const combinationKey = `${userId}-${trainingId}`;
                
                // Check if this user-training combination already exists
                let isUserDuplicate = false;
                let duplicateInfo = null;
                
                if (userId && trainingId && userTrainingCombinations.has(combinationKey)) {
                  isUserDuplicate = true;
                  duplicateInfo = userTrainingCombinations.get(combinationKey);
                  duplicateInfo.count += 1;
                  duplicateInfo.rows.push(rowIndex + 1);
                } else if (userId && trainingId) {
                  // First occurrence, track it
                  userTrainingCombinations.set(combinationKey, {
                    count: 1,
                    rows: [rowIndex + 1],
                    trainingName,
                    employeeId,
                    email
                  });
                }

                mappedData.push({
                  trainingId,
                  trainingName,
                  employeeId,
                  email,
                  userId,
                  hasMatch: true,
                  hasUserMatch,
                  isDuplicate: matchedTrainings.length > 1, // Flag if this is a duplicate training name
                  duplicateIndex: index + 1, // Index of this duplicate (1-based)
                  totalDuplicates: matchedTrainings.length, // Total number of duplicates
                  isUserDuplicate,
                  userDuplicateInfo: duplicateInfo,
                  rowIndex: rowIndex + 1, // 1-based row number
                });
              });
            }
          });

          // Update all entries with user duplicate information
          userTrainingCombinations.forEach((duplicateInfo, combinationKey) => {
            if (duplicateInfo.count > 1) {
              // Mark all entries with this combination as duplicates
              mappedData.forEach(item => {
                const itemKey = `${item.userId}-${item.trainingId}`;
                if (itemKey === combinationKey) {
                  item.isUserDuplicate = true;
                  item.userDuplicateInfo = duplicateInfo;
                }
              });
            }
          });

          // Check if all trainings were matched
          const unmatchedTrainings = mappedData.filter(
            (item) => !item.hasMatch
          );
          if (unmatchedTrainings.length > 0) {
            setMatchError(
              `${unmatchedTrainings.length} training(s) couldn't be matched with the system. Please check training names in your file.`
            );
          }

          // Check if all users were matched
          const unmatchedUsers = mappedData.filter(
            (item) => !item.hasUserMatch
          );
          if (unmatchedUsers.length > 0) {
            setUserMatchError(
              `${unmatchedUsers.length} user(s) couldn't be matched with the system. Please check employee IDs or emails in your file.`
            );
          }

          // Check for duplicate training names
          const hasDuplicates = mappedData.some((item) => item.isDuplicate);
          if (hasDuplicates) {
            const uniqueDuplicateNames = [
              ...new Set(
                mappedData
                  .filter((item) => item.isDuplicate)
                  .map((item) => item.trainingName)
              ),
            ];

            setMatchError((prev) => {
              const baseMessage = prev ? `${prev} ` : "";
              return `${baseMessage}Found ${uniqueDuplicateNames.length} training name(s) that match multiple trainings in the system. All matching training IDs will be included.`;
            });
          }

          // Check for duplicate user-training combinations
          const userDuplicates = mappedData.filter((item) => item.isUserDuplicate);
          if (userDuplicates.length > 0) {
            const uniqueUserDuplicates = new Set();
            userDuplicates.forEach(item => {
              if (item.userDuplicateInfo) {
                uniqueUserDuplicates.add(`${item.employeeId}-${item.trainingName}`);
              }
            });

            setUserMatchError((prev) => {
              const baseMessage = prev ? `${prev} ` : "";
              return `${baseMessage}Found ${uniqueUserDuplicates.size} user(s) assigned multiple times to the same training. Only one assignment per user per training will be processed.`;
            });
          }

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

  // Group data by trainingId
  const groupByTrainingId = (data) => {
    const groupedData = [];
    const trainingMap = new Map();

    // Filter out invalid data (no training match or no user match)
    const validData = data.filter((item) => item.hasMatch && item.hasUserMatch);

    // Group by trainingId
    validData.forEach((item) => {
      if (!trainingMap.has(item.trainingId)) {
        trainingMap.set(item.trainingId, {
          trainingId: item.trainingId,
          userId: [],
        });
        groupedData.push(trainingMap.get(item.trainingId));
      }

      // Add userId to the array if not already included
      if (
        item.userId &&
        !trainingMap.get(item.trainingId).userId.includes(item.userId)
      ) {
        trainingMap.get(item.trainingId).userId.push(item.userId);
      }
    });

    return groupedData;
  };

  // Make API call to assign training in bulk
  const handleSubmit = async () => {
    if (!fileData.length) {
      setError("No data to process");
      return;
    }

    if (!isRegistered && !isCompleted) {
      setError("Please select at least one status (REGISTERED or COMPLETED)");
      return;
    }

    // Filter out unmatched trainings and users
    const validData = fileData.filter(
      (item) => item.hasMatch && item.hasUserMatch
    );
    if (validData.length === 0) {
      setError(
        "No valid data found. Please check your file for matching trainings and users."
      );
      return;
    }

    setLoading(true);
    setResults([]);
    setCurrentStep(3);
    setProgress(10); // Initial progress

    try {
      // Group data by trainingId
      const groupedData = groupByTrainingId(validData);

      // Prepare status array
      const statusArray = [];
      if (isRegistered) statusArray.push("REGISTERED");
      if (isCompleted) statusArray.push("COMPLETED");

      // Make API call
      setProgress(50);

      try {
        // Call the uploadParticipant API with the status array and grouped data
        const {
          isSuccess,
          data,
          error: apiError,
        } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}uploadParticipant`,
          {},
          {
            trainingParticipants: groupedData,
            status: statusArray,
          },
          "POST"
        );
        setIsTraineeDataUploaded(true);
        // Add result
        setResults([
          {
            statusArray,
            trainingCount: groupedData.length,
            userCount: new Set(validData.map((item) => item.userId)).size, // Count unique users
            success: isSuccess,
            message: isSuccess
              ? `Successfully processed ${
                  new Set(validData.map((item) => item.userId)).size
                } participants across ${
                  groupedData.length
                } trainings with Status: ${statusArray.join(", ")}`
              : apiError || "Failed to upload participants",
          },
        ]);
      } catch (err) {
        setResults([
          {
            statusArray,
            trainingCount: groupedData.length,
            userCount: new Set(validData.map((item) => item.userId)).size,
            success: false,
            message: `Error: ${err.message || "Unknown error"}`,
          },
        ]);
      }

      setProgress(100);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        `Failed to process participants: ${err.message || "Unknown error"}`
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
    setMatchError(null);
    setUserMatchError(null);
    setProgress(0);
    setShowPreview(false);
    setCurrentStep(1);
    setIsRegistered(false);
    setIsCompleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Export results to Excel
  const exportResults = () => {
    const csv = [
      ["Status", "Trainings", "Participants", "Result", "Message"],
      ...results.map((r) => [
        r.statusArray.join(", "),
        r.trainingCount,
        r.userCount,
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
    link.download = "training_participant_results.xlsx";
    link.click();
  };

  // Generate sample Excel template for download
  const generateTemplate = () => {
    const filePath = "/Training Assigning.ods"; // your file's public path
    const fileName = "Training Assigning.ods"; // desired download name

    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });
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
        <h5 className="mb-3">Upload Participant Excel File</h5>

        <Alert variant="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Available trainings:</strong> {trainingData?.length || 0}{" "}
              training sessions <br />
              <strong>Available users:</strong> {userList?.length || 0} users
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={generateTemplate}
            >
              Download Template
            </Button>
          </div>
        </Alert>

        {/* File Upload Area */}
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
          File should contain columns: Name Of Training, Employee ID*, Email ID
        </p>
      </>
    );
  };

  // Step 2: Status Selection and Preview
  const renderStep2 = () => {
    return (
      <>
        <h5 className="mb-3">Select Status and Preview</h5>

        {matchError && (
          <Alert variant="warning">
            <svg
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span style={{ verticalAlign: "middle" }}>{matchError}</span>
          </Alert>
        )}

        {userMatchError && (
          <Alert variant="warning">
            <svg
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span style={{ verticalAlign: "middle" }}>{userMatchError}</span>
          </Alert>
        )}

        {/* Status Checkboxes */}
        <Form.Group className="mb-4">
          <Form.Label>Select Status</Form.Label>
          <div className="mb-3 border p-3 rounded">
            <Form.Check
              type="checkbox"
              id="registered-checkbox"
              label="REGISTERED"
              checked={isRegistered}
              onChange={() => setIsRegistered(!isRegistered)}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="completed-checkbox"
              label="COMPLETED"
              checked={isCompleted}
              onChange={() => setIsCompleted(!isCompleted)}
            />
          </div>

          {!isRegistered && !isCompleted && (
            <div className="text-danger small">
              Please select at least one status
            </div>
          )}
        </Form.Group>

        {/* Data Preview */}
        {showPreview && fileData.length > 0 && (
          <div
            className="mb-4 border rounded p-3"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            <h6 className="mb-3">Participant Data Preview</h6>
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th className="text-nowrap">Row #</th>
                    <th className="text-nowrap">Training Name</th>
                    <th className="text-nowrap">Training ID</th>
                    <th className="text-nowrap">Employee ID*</th>
                    <th className="text-nowrap">Email ID</th>
                    <th className="text-nowrap">User ID</th>
                    <th className="text-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        !row.hasMatch || !row.hasUserMatch
                          ? "table-danger"
                          : row.isUserDuplicate
                          ? "table-info"
                          : row.isDuplicate
                          ? "table-warning"
                          : ""
                      }
                    >
                      <td className="text-nowrap">{row.rowIndex}</td>
                      <td className="text-nowrap">
                        {row.trainingName}
                        {row.isDuplicate && (
                          <Badge bg="warning" text="dark" className="ms-2">
                            Training Match {row.duplicateIndex}/{row.totalDuplicates}
                          </Badge>
                        )}
                      </td>
                      <td className="text-nowrap">
                        {row.trainingId || "Not found"}
                      </td>
                      <td className="text-nowrap">
                        {row.employeeId}
                        {row.isUserDuplicate && (
                          <Badge bg="info" text="dark" className="ms-2">
                            Duplicate User
                          </Badge>
                        )}
                      </td>
                      <td className="text-nowrap">{row.email}</td>
                      <td className="text-nowrap">
                        {row.userId || "Not found"}
                      </td>
                      <td>
                        {row.hasMatch && row.hasUserMatch ? (
                          row.isUserDuplicate ? (
                            <Badge bg="info">
                              User Duplicate (Rows: {row.userDuplicateInfo?.rows.join(", ")})
                            </Badge>
                          ) : row.isDuplicate ? (
                            <Badge bg="warning">
                              Training Duplicate
                            </Badge>
                          ) : (
                            <Badge bg="success">
                              Valid
                            </Badge>
                          )
                        ) : (
                          <Badge bg="danger">
                            {!row.hasMatch
                              ? "Training not found"
                              : "User not found"}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <p className="mb-0 text-xs text-gray-500">
                Showing all {fileData.length} records
              </p>

              <div>
                <Badge bg="success">
                  Valid records:{" "}
                  {
                    fileData.filter(
                      (item) => item.hasMatch && item.hasUserMatch && !item.isUserDuplicate
                    ).length
                  }
                </Badge>
                <Badge bg="info" className="ms-2">
                  User duplicates:{" "}
                  {fileData.filter((item) => item.isUserDuplicate).length}
                </Badge>
                <Badge bg="warning" className="ms-2">
                  Training duplicates:{" "}
                  {fileData.filter((item) => item.isDuplicate && !item.isUserDuplicate).length}
                </Badge>
                <Badge bg="danger" className="ms-2">
                  Invalid records:{" "}
                  {
                    fileData.filter(
                      (item) => !item.hasMatch || !item.hasUserMatch
                    ).length
                  }
                </Badge>
              </div>
            </div>
          </div>
        )}

        <Alert variant="info">
          <svg
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span style={{ verticalAlign: "middle" }}>
            All valid participants will be processed with selected statuses:
            {isRegistered && (
              <span className="text-primary fw-bold mx-1">REGISTERED</span>
            )}
            {isCompleted && (
              <span className="text-success fw-bold mx-1">COMPLETED</span>
            )}
            {!isRegistered && !isCompleted && (
              <span className="text-danger fw-bold">NONE SELECTED</span>
            )}
          </span>
        </Alert>

        {fileData.some((item) => item.isDuplicate) && (
          <Alert variant="warning">
            <strong>Training Duplicates:</strong> Some training names match multiple trainings
            in the system. All matches will be processed. Training names with
            multiple matches are highlighted in yellow.
          </Alert>
        )}

        {fileData.some((item) => item.isUserDuplicate) && (
          <Alert variant="info">
            <strong>User Duplicates:</strong> Some users appear multiple times for the same training
            in your file. Only one assignment per user per training will be processed. 
            Duplicate entries are highlighted in blue.
          </Alert>
        )}
      </>
    );
  };

  // Step 3: Results
  const renderStep3 = () => {
    return (
      <>
        <h5 className="mb-3">Processing Results</h5>

        {loading && (
          <div className="mb-4">
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              animated
              className="mb-2"
            />
            <p className="text-muted small">
              Processing participants... {progress}% complete
            </p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div
              style={{ maxHeight: "300px", overflowY: "auto" }}
              className="mb-3"
            >
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Trainings</th>
                    <th>Participants</th>
                    <th>Result</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td>
                        {result.statusArray.map((status) => (
                          <Badge bg="primary" key={status} className="me-1">
                            {status}
                          </Badge>
                        ))}
                      </td>
                      <td>{result.trainingCount}</td>
                      <td>{result.userCount}</td>
                      <td>
                        <Badge bg={result.success ? "success" : "danger"}>
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                      </td>
                      <td>{result.message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="text-muted mb-0">
                Total Participants: {results[0].userCount} | Trainings:{" "}
                {results[0].trainingCount} | Status:{" "}
                {results[0].success ? "Success" : "Failed"}
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

  // Return the custom modal implementation
  return (
    <CustomModal
      show={show}
      onClose={onClose}
      title="Bulk Training Participant Upload"
      footerContent={
        <>
          {currentStep === 2 && (
            <>
              <Button variant="secondary" onClick={resetForm}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  fileData.filter((item) => item.hasMatch && item.hasUserMatch)
                    .length === 0 ||
                  (!isRegistered && !isCompleted)
                }
              >
                Process{" "}
                {
                  fileData.filter((item) => item.hasMatch && item.hasUserMatch)
                    .length
                }{" "}
                Participants
              </Button>
            </>
          )}

          {currentStep === 3 && (
            <Button variant="secondary" onClick={resetForm}>
              Upload New File
            </Button>
          )}
        </>
      }
    >
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {renderStepsIndicator()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </CustomModal>
  );
};

export default UploadTrainingAssignmentExcel;