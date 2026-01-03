import React from "react";
import { useEffect, useState } from "react";
import edit from "./edit.png";

import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import { Modal, Dropdown, Button } from "react-bootstrap";

const GHGProtocol = () => {
    const [show, setShow] = useState(false);
    const [id, setId] = useState({});
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [isDatabaseDropdownOpen, setIsDatabaseDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // State for financial year data (for table mapping)
    const [financialYearData, setFinancialYearData] = useState([]);

    // State for database options - will be populated from API
    const [databaseOptions, setDatabaseOptions] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const handleClose = () => {
        setShow(false);
        setSelectedDatabase("");
        setId({});
    };

    const handleShow = () => setShow(true);

    const handleSave = async () => {
        if (!selectedDatabase) {
            alert("Please select a database");
            return;
        }

        setIsSaving(true);
        try {
            const financialYearId = await getLatestFinancialYearId();

            const payload = {
                financialYearId,
                databaseId: Number(selectedDatabase)
            };

            const { isSuccess, data, error } = await apiCall(
                config.POSTLOGIN_API_URL_COMPANY + `ghh/database`,
                {},
                payload,
                "POST"
            );
            if (isSuccess) {
                handleClose();
                getDatabaseList(); // Refresh the database data
                getFinancialYearData(); // Refresh the table data
            } else {
                console.error("Save failed:", error);
            }
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Modified to get the latest financial year ID only
    const getLatestFinancialYearId = async () => {
        // Check if data exists in local storage
        const storedData = localStorage.getItem("financialYearData");

        if (storedData) {
            // Data exists in local storage, parse and use it
            const parsedData = JSON.parse(storedData);
            return parsedData[parsedData.length - 1].id;
        } else {
            // Data not in local storage, call API
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
                {},
                {}
            );

            if (isSuccess) {
                // Store the response in local storage for future use
                localStorage.setItem("financialYearData", JSON.stringify(data.data));

                // Return the ID of the last entry
                return data.data[data.data.length - 1].id;
            }
        }
    };

    // New function to get financial year data for table mapping
    const getFinancialYearData = async () => {
        try {
            setIsLoading(true);
            console.log("Fetching financial year data..."); // Debug log

            // Check if data exists in local storage
            const storedData = localStorage.getItem("financialYearData");

            if (storedData) {
                // Data exists in local storage, parse and use it
                const parsedData = JSON.parse(storedData);
                console.log("Data from localStorage:", parsedData); // Debug log
                setFinancialYearData(parsedData);
            } else {
                // Data not in local storage, call API
                console.log("Calling API for financial year data..."); // Debug log
                const { isSuccess, data } = await apiCall(
                    `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
                    {},
                    {}
                );

                console.log("API Response:", { isSuccess, data }); // Debug log

                if (isSuccess && data && data.data) {
                    // Store the response in local storage for future use
                    localStorage.setItem("financialYearData", JSON.stringify(data.data));
                    setFinancialYearData(data.data);
                    console.log("Financial year data set:", data.data); // Debug log
                } else {
                    console.error("API call succeeded but no data received");
                    setFinancialYearData([]);
                }
            }
        } catch (error) {
            console.error("Error fetching financial year data:", error);
            setFinancialYearData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const editItem = (id) => {
        setId(id);
        handleShow();
    };

    const handleDatabaseSelect = (selectedKey) => {
        setSelectedDatabase(selectedKey);
        setIsDatabaseDropdownOpen(false);
    };

    // Handle dropdown toggle
    const handleDatabaseDropdownToggle = (isOpen) => {
        setIsDatabaseDropdownOpen(isOpen);
    };

    // Modified to get database list from API
    const getDatabaseList = async () => {
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}ghg/databases`,
                {},
                {},
                "GET"
            );
            if (isSuccess) {
                const result = data.data;
                // Extract database list and selected data from the API response
                setDatabaseOptions(result.dataBaseList || []);
                setSelectedData(result.selectedData || []);
            }
        } catch (error) {
            console.error("Error fetching database list:", error);
        }
    };

    // Get Protocol display info for a financial year
    const getProtocolDisplayByFinancialYear = (financialYearId) => {
        // Find if there's a selected database for this financial year
        const selectedEntry = selectedData.find(entry => 
            entry.financialYearId === financialYearId
        );

        if (!selectedEntry) {
            return "Not Set";
        }

        // Find the database details
        const database = databaseOptions.find(db => 
            db.dataValues.id === selectedEntry.databaseId
        );

        if (!database) {
            return "Unknown Database";
        }

        return database.dataValues.name;
    };

    // Get selected database name for display
    const getSelectedDatabaseName = () => {
        const selected = databaseOptions.find(option => 
            option.dataValues.id === Number(selectedDatabase)
        );
        return selected ? selected.dataValues.name : "Select Database";
    };

    useEffect(() => {
        // Load database data first, then financial year data
        const loadData = async () => {
            await getDatabaseList(); // Wait for database data to load first
            await getFinancialYearData(); // Then load financial year data
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="Introduction framwork_2 shadow-lg"
            style={{
                width: "100%",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                padding: "2.5rem",
                border: "1px solid #e3f2fd",
            }}
        >
            {/* Header Section */}
            <div className="mb-4">
                <h2 className="h3 text-primary fw-bold mb-2" style={{ color: "#11546f" }}>
                    🌍 GHG Protocol Management
                </h2>
                <p className="text-muted mb-0">Manage GHG Protocol database settings for different financial years</p>
            </div>

            {/* Modern Table Container */}
            <div className="d-flex justify-content-center">
                <div style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    width: "100%"
                }}>
                    {/* Enhanced Table Header */}
                    <div
                        className="table-header p-3"
                        style={{
                            background: "linear-gradient(135deg, #11546f 0%, #3f88a5 100%)",
                            color: "white"
                        }}
                    >
                        <div className="row align-items-center text-center">
                            <div className="col-2">
                                <h6 className="mb-0 fw-semibold">
                                    📅 Financial Year
                                </h6>
                            </div>
                            <div className="col-8">
                                <h6 className="mb-0 fw-semibold">
                                    🌍 GHG Protocol Database
                                </h6>
                            </div>
                            <div className="col-2">
                                <h6 className="mb-0 fw-semibold">
                                    ⚙️ Actions
                                </h6>
                            </div>
                        </div>
                    </div>
                    {/* Enhanced Table Body */}
                    <div className="table-body bg-white">
                        {financialYearData && financialYearData.length > 0 ? (
                            financialYearData.map((item, index) => (
                                <div
                                    key={item?.id || index}
                                    className="row align-items-center py-3 px-3 border-bottom"
                                    style={{
                                        borderColor: "#e9ecef !important",
                                        transition: "all 0.2s ease",
                                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#e3f2fd";
                                        e.currentTarget.style.transform = "translateX(5px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8f9fa";
                                        e.currentTarget.style.transform = "translateX(0)";
                                    }}
                                >
                                    {/* Financial Year - Centered */}
                                    <div className="col-2 text-center">
                                        <span
                                            className="fw-medium"
                                            style={{ color: "#11546f", fontSize: "16px" }}
                                        >
                                            {item?.financial_year_value || item?.year || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Protocol Display - Centered */}
                                    <div className="col-8 text-center">
                                        <span
                                            className="badge badge-info px-3 py-2"
                                            style={{
                                                fontSize: "13px",
                                                borderRadius: "20px",
                                                backgroundColor: "#e3f2fd",
                                                color: "#1565c0"
                                            }}
                                        >
                                            {getProtocolDisplayByFinancialYear(item?.id)}
                                        </span>
                                    </div>

                                    {/* Actions - Centered */}
                                    <div className="col-2 text-center">
                                        <button
                                            className={`btn btn-sm ${index === financialYearData?.length - 1
                                                ? "btn-primary"
                                                : "btn-outline-secondary"
                                                } px-3 py-2`}
                                            onClick={() => {
                                                if (index === financialYearData?.length - 1) {
                                                    console.log("Editing item:", item); // Debug log
                                                    editItem(item?.id || item?.moduleId);
                                                }
                                            }}
                                            disabled={index !== financialYearData?.length - 1}
                                            style={{
                                                borderRadius: "10px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                transition: "all 0.2s ease",
                                                opacity: index === financialYearData?.length - 1 ? 1 : 0.5
                                            }}
                                            title={index === financialYearData?.length - 1 ? "Edit GHG Protocol" : "Only latest year can be edited"}
                                        >
                                            <img
                                                src={edit}
                                                alt="Edit"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    marginRight: "5px",
                                                    filter: index === financialYearData?.length - 1 ? "brightness(0) invert(1)" : "none"
                                                }}
                                            />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5">
                                <div className="text-muted">
                                    <h5>No Financial Year Data Found</h5>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            // Clear localStorage and retry
                                            localStorage.removeItem("financialYearData");
                                            getFinancialYearData();
                                        }}
                                    >
                                        🔄 Retry Loading Data
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="custom-modal"
                centered
                backdrop="static"
            >
                <div style={{ borderRadius: "15px", overflow: "hidden" }}>
                    <Modal.Header
                        closeButton
                        style={{
                            background: "linear-gradient(135deg, #11546f 0%, #3f88a5 100%)",
                            color: "white",
                            border: "none"
                        }}
                    >
                        <Modal.Title className="fw-bold">
                            🌍 Update GHG Protocol
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body
                        style={{
                            padding: "20px",
                            maxHeight: "80vh",
                            height: "300px",
                            overflowY: "auto"
                        }}
                    >
                        {/* Database Selection */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-dark mb-2">
                                Select GHG Protocol Database
                            </label>
                            <Dropdown
                                onSelect={handleDatabaseSelect}
                                onToggle={handleDatabaseDropdownToggle}
                            >
                                <Dropdown.Toggle
                                    id="database-dropdown"
                                    className="w-100"
                                    style={{
                                        backgroundColor: "white",
                                        color: "#495057",
                                        borderColor: "#ced4da",
                                        padding: "12px 20px",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        border: "2px solid #e9ecef"
                                    }}
                                >
                                    {getSelectedDatabaseName()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className="w-100 shadow-lg"
                                    style={{
                                        borderRadius: "10px",
                                        border: "none",
                                        padding: "10px 0",
                                        marginTop: "5px"
                                    }}
                                >
                                    {databaseOptions.map((option) => (
                                        <Dropdown.Item
                                            key={option.dataValues.id}
                                            eventKey={option.dataValues.id}
                                            className="px-4 py-3"
                                            style={{
                                                fontSize: "15px",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            {option.dataValues.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {/* Selection Summary */}
                        {selectedDatabase && (
                            <div
                                className="alert alert-info"
                                style={{
                                    borderRadius: "10px",
                                    backgroundColor: "#e3f2fd",
                                    borderColor: "#bbdefb",
                                    color: "#1565c0"
                                }}
                            >
                                <strong>Selected Database:</strong> {getSelectedDatabaseName()}
                                <br />
                                <small>This database will be used for GHG Protocol calculations in the current financial year.</small>
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer
                        style={{
                            padding: "20px 30px",
                            backgroundColor: "white",
                            borderTop: "1px solid #e9ecef"
                        }}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={handleClose}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "10px",
                                fontWeight: "500"
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!selectedDatabase || isSaving}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "10px",
                                backgroundColor: "#11546f",
                                borderColor: "#11546f",
                                fontWeight: "500"
                            }}
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    💾 Save Changes
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default GHGProtocol;