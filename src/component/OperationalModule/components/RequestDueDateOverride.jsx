import React, { useEffect, useState, useRef } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { sweetAlert } from "../../../utils/UniversalFunction";
import { getStartingMonth } from "../../../utils/PeriodCalculationUtils";
import { LocationField } from "../../CarbonFootPrinting/common/FormComponents";


const RequestDueDateOverride = ({ 
  financialYearId, 
  financialYear, 
  selectedQuestions,
  showRequestDueDateApprovalModal,
  handleRequestDueDateApprovalModalClose
}) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [months, setMonths] = useState([]);
  const multiselectRef = useRef();
  const [loading, setLoading] = useState(false);
  const [scheduledDateData, setScheduledDateData] = useState([]);

  useEffect(() => {
    if (financialYearId) {
      loadScheduledNotifications(financialYearId);
    }
  }, [financialYearId]);

  const getLocations = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );

      if (isSuccess && data?.data) {
        const locationOptions = [];

        data.data.forEach((item) => {
          const subLocations = item.subLocation || [];

          if (subLocations.length > 0) {
            subLocations.forEach((sub) => {
              locationOptions.push({
                id: `${item.id}-${sub.id}`,
                name: `${item.unitCode}-${sub.subLocation}`,
                subLocations: [],
              });
            });
          } else {
            locationOptions.push({
              id: item.id,
              name: item.unitCode,
              subLocations: [],
            });
          }
        });

        setLocations(locationOptions);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const loadScheduledNotifications = async (financialYearId) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}scheduledNotifications`,
        {},
        {
          financialYearId: financialYearId,
          questionType: 'custom'
        },
        "GET"
      );
      if (isSuccess && data) {
        setScheduledDateData(data.data)
      }
    } catch (error) {
      console.error("Error loading scheduled notifications:", error);
    } finally {
    }
  };

  useEffect(() => {
    const generateMonths = () => {
      const startMonth = getStartingMonth() - 1;
      if (financialYearId) {
        const financialYearValue = financialYear.find(p => p.id === financialYearId).financial_year_value;
        const startYear = financialYearValue.substring(0, 4);
        const monthsArray = [];
        for (let i = 0; i < 12; i++) {
          const date = new Date(startYear, startMonth + i, 1);
          const formattedMonth = date
            .toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })
            .replace(",", "");
          const abbreviatedMonth = date.toLocaleDateString("en-US", {
            month: "short",
          });

          const formatDateKey = (date) => {
            const [year, month] = date.split("-");
            return `${month}/${year}`;
          };

          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const userId = currentUser?.id;

          if (currentUser?.is_head == 1) {
            monthsArray.push({
              name: formattedMonth,
              displayName: abbreviatedMonth,
            });
            continue;
          }

          const crossDate = scheduledDateData.find(
            (p) => formatDateKey(p.periodRecord.fromDate) === formattedMonth
          );

          let isExpired = false;

          // Due Date Expired
          if (crossDate) {
            const fixedDate = new Date(crossDate.fixedDate);
            if (fixedDate <= new Date()) {
              isExpired = true;
            }
          }

          // Add month only if it's expired
          if (isExpired) {
            monthsArray.push({
              name: formattedMonth,
              displayName: abbreviatedMonth,
            });
          }
        }
        setMonths(monthsArray);
      }
    };
    getLocations();
    if (selectedLocation) {
      generateMonths();
    }
  }, [scheduledDateData, selectedLocation]);

  const handleOverrideRequest = async () => {
    // Validation
    if (!selectedLocation) {
      sweetAlert("error", "Please select a location");
      return;
    }

    if (selectedMonths.length === 0) {
      sweetAlert("error", "Please select at least one month");
      return;
    }

    // Trigger the file processing
    await processOverrideRequests();
  };

  const processOverrideRequests = async () => {

    setLoading(true);
  
    const overrides = [];

    for(const selectedMonth of selectedMonths) {
      const [mm, yyyy] = selectedMonth.name.split("/").map(Number);
      const fromDate = `${yyyy}-${String(mm).padStart(2, "0")}`;

      // Calculate next month for toDate
      let nextMonth = mm + 1;
      let nextYear = yyyy;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
      }
      const toDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;

      for(const selectQuestion of selectedQuestions) {
        overrides.push({
            financialYearId: financialYearId,
            questionId: selectQuestion,
            sourceId: selectedLocation,
            fromDate: fromDate,
            toDate: toDate,
        });
      }
    }

    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}dueDate/requestOverride`,
      {},
      {
        overrideRequests: overrides
      },
      "POST"
    );

    if (isSuccess) {
      console.log('Override request suucessfully sent,', data);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex flex-column align-items-center">

      {/* Modal for Selecting Location and Uploading File */}
      <Modal
        show={showRequestDueDateApprovalModal}
        onHide={() => handleRequestDueDateApprovalModalClose()}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark fs-4">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            Select Location & Period
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <Form>
            <div className="mb-4">
              <LocationField
                value={selectedLocation}
                onChange={setSelectedLocation}
                options={locations.map(loc => ({value: loc.id, label: loc.name}))}
                required={true}
                levelName="Choose a Location"
              />
            </div>

            {/* Month Selection */}
            <div className="mb-4">
              <Form.Group controlId="monthSelect">
                <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2 text-primary"></i>
                  Select Month(s)
                </Form.Label>
                <div className="position-relative">
                  <Multiselect
                    placeholder={
                      selectedLocation
                        ? "Choose months to analyze"
                        : "Select a location first"
                    }
                    displayValue="displayName"
                    options={months}
                    selectedValues={selectedMonths}
                    onRemove={setSelectedMonths}
                    onSelect={setSelectedMonths}
                    showCheckbox
                    ref={multiselectRef}
                    disable={!selectedLocation} // 👈 disables the component
                    style={{
                      chips: {
                        background: "#3F88A5",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        margin: "2px",
                        fontSize: "14px",
                      },
                      searchBox: {
                        border: selectedLocation ? "2px solid #e3f2fd" : "2px solid #f8d7da",
                        background: selectedLocation ? "white" : "#f8d7da",
                        borderRadius: "12px",
                        padding: "8px 16px",
                        fontSize: "16px",
                        minHeight: "48px",
                        opacity: selectedLocation ? 1 : 0.6,
                        cursor: selectedLocation ? "text" : "not-allowed",
                      },
                      option: {
                        padding: "12px 16px",
                        fontSize: "15px",
                      },
                      optionContainer: {
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        marginTop: "4px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                </div>

                {/* 👇 Message for guidance */}
                {!selectedLocation && (
                  <div className="text-danger mt-2 fw-medium">
                    Please select a location first to choose months.
                  </div>
                )}
              </Form.Group>
            </div>

          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <div className="w-100 d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                handleRequestDueDateApprovalModalClose();
              }}
              className="px-4 py-2 rounded-3 fw-semibold"
              style={{
                borderColor: "#dee2e6",
                color: "#6c757d",
                transition: "all 0.3s ease",
              }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleOverrideRequest}
              disabled={
                !selectedLocation || selectedMonths.length === 0 || loading
              }
              className="px-4 py-2 rounded-3 fw-semibold shadow-sm"
              style={{
                backgroundColor: "#3F88A5",
                border: "none",
                transition: "all 0.3s ease",
                opacity:
                  !selectedLocation || selectedMonths.length === 0 || loading
                    ? 0.6
                    : 1,
              }}
            >
              <i className="bi bi-save me-1"></i>
              Request Override
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RequestDueDateOverride;