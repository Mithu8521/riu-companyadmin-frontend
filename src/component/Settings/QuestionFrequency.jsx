import React from "react";
import { useEffect, useState } from "react";
import edit from "./edit.png";

import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import { Modal, Dropdown, Button } from "react-bootstrap";

const CompanyGWP = () => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState({});
  const [frequency, setFrequency] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleSave = async () => {
    const financialYearId = await getFinancialYear();

    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `saveFrequencyModule`,
      {},
      {
        financialYearId,
        moduleId: id,
        frequency: frequency,
      },
      "POST"
    );
    if (isSuccess) {
      handleClose();
      getReportingQuestions();
    }
  };

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
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
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Return the ID of the last entry
        return data.data[data.data.length - 1].id;
      }
    }
  };

  const editItem = (id) => {
    setId(id);
    handleShow();
  };
  
  const handleSelect = (selectedKey) => {
    setFrequency(selectedKey);
    setIsDropdownOpen(false);
  };
  
  // Handle dropdown toggle
  const handleDropdownToggle = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const [data, setData] = useState([]);

  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL" }
    );
    if (isSuccess) {
      return data?.data.map((item) => item.id);
    }
  };
  
  const getReportingQuestions = async () => {
    const financialYearId = await getFinancialYear();
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFrequencyModule`,
        {},
        { frameworkIds: await fetchFrameworkApi(), financialYearId },
        "GET"
      );
      if (response.isSuccess) {
        const data = response.data;
        setData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    getReportingQuestions();
  }, []);

  return (
    <div
      className="Introduction framwork_2"
      style={{
        width: "100%",
        borderRadius: "15px",
        background: "white",
        padding: "2rem",
      }}
    >
      <table className="table">
        <thead style={{ border: "none" }}>
          <tr
            className="fixed_tr_section"
            style={{
              border: "none",
              borderBottom: "2px solid #83BBD5",
            }}
          >
            <th
              style={{
                border: "none",
                color: "#11546f",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Title
            </th>
            <th
              style={{
                border: "none",
                color: "#11546f",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Frequency
            </th>
            <th
              style={{
                border: "none",
                color: "#11546f",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
      </table>
      <div style={{ width: "100%" }}>
        {/* Map over the data array and render a table row for each item */}
        {data?.data?.map((item, index) => (
          <div
            key={item?.moduleId}
            style={{
              display: "flex",
              width: "100%",
              padding: "20px 0px",
              borderBottom: "1px solid #3f88a5",
            }}
          >
            <div
              style={{
                width: "23%",
                color: "#3f8aa5",
                fontSize: "16px",
              }}
            >
              {item?.moduleName}
            </div>
            <div
              style={{
                width: "44%",
                color: "#3f8aa5",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {typeof item?.frequencies === "string"
                ? item.frequencies.replace(/_/g, " ").toLowerCase()
                : item?.frequencies}
            </div>
            <div
              style={{
                width: "25%",
                color: "#3f8aa5",
                fontSize: "16px",
              }}
            >
              <img
                src={edit}
                onClick={() => {
                  if (index === data?.data?.length - 1) {
                    editItem(item?.moduleId);
                  }
                }}
                style={{
                  cursor:
                    index === data?.data?.length - 1
                      ? "pointer"
                      : "not-allowed",
                  opacity: index === data?.data?.length - 1 ? 1 : 0.5,
                }}
                title="Edit"
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Frequency</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{ 
            padding: "20px", 
            maxHeight: "80vh",
            height: isDropdownOpen ? "300px" : "100px", // Change height based on dropdown state
            overflowY: "auto",
            transition: "height 0.3s ease" // Smooth transition effect
          }}
        >
          <div>
            <Dropdown 
              onSelect={handleSelect}
              onToggle={handleDropdownToggle} // Add this to track dropdown open state
            >
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  borderColor: "#ced4da",
                  width: "100%",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxShadow: "none",
                }}
              >
                {frequency || "Select Frequency"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  maxHeight: "auto", // Allow the dropdown menu to expand
                  minWidth: "100%", // Ensure the dropdown takes up full width of the button
                  zIndex: "1050", // Ensure dropdown appears above modal content
                  padding: "10px 0", // Optional padding for the dropdown
                }}
              >
                <Dropdown.Item eventKey="MONTHLY">Monthly</Dropdown.Item>
                <Dropdown.Item eventKey="QUARTERLY">Quarterly</Dropdown.Item>
                <Dropdown.Item eventKey="HALF_YEARLY">
                  Half Yearly
                </Dropdown.Item>
                <Dropdown.Item eventKey="YEARLY">Yearly</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              padding: "8px 20px",
              borderRadius: "5px",
              backgroundColor: "#f0f0f0",
              color: "#495057",
              borderColor: "#ced4da",
            }}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            style={{
              padding: "8px 20px",
              borderRadius: "5px",
              backgroundColor: "#3f8aa5",
              color: "white",
              borderColor: "#3f8aa5",
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyGWP;