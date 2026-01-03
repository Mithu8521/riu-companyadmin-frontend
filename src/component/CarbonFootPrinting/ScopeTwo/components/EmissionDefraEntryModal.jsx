import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FiX, FiPlus, FiAlertTriangle } from "react-icons/fi";
import {
  FinancialYearField,
  LocationField,
  PeriodField,
  ActivityField,
  UnitField,
  ConsumptionField,
  FormRow,
} from "../../common/FormComponents";
import EmissionCalculationResults from "../../MainCarbon/components/EmissionCalculationResults";

const EmissionDefraEntryModal = ({
  show,
  onHide,
  onSubmit,
  locations,
  timePeriodOptions,
  activities,
  emissionEntries,
  updateEmissionEntry,
  financialYears,
  handlePeriodChange,
  scope2Data,
}) => {
  const [duplicateEntry, setDuplicateEntry] = useState(null);
  const [units, setUnits] = useState([]);
  const [finalFuel, setFinalFuel] = useState();


  const existingEntries = emissionEntries.filter((entry) => !entry.isNew);
  const currentEntry = emissionEntries.find((entry) => entry.isNew) || {
    id: crypto.randomUUID(),
    location: "",
    period: "",
    financialYear: "",
    activity: "",
    unit: "",
    consumption: "",
    isNew: true,
  };

  // Function to check for duplicate entries
  const checkForDuplicate = (entry) => {
    if (!existingEntries || existingEntries.length === 0) return null;

    const duplicate = existingEntries.find((existing) => {
      if (existing.id === entry.id) return false;
      return (
        existing.location === entry.location &&
        existing.period === entry.period &&
        existing.financialYear === entry.financialYear &&
        existing.activity === entry.activity
      );
    });
    return duplicate;
  };

  // Check for duplicates whenever key fields change
  useEffect(() => {
    if (
      currentEntry.location &&
      currentEntry.period &&
      currentEntry.financialYear &&
      currentEntry.activity
    ) {
      const duplicate = checkForDuplicate(currentEntry);
      setDuplicateEntry(duplicate);
    } else {
      setDuplicateEntry(null);
    }
  }, [
    currentEntry.location,
    currentEntry.period,
    currentEntry.financialYear,
    currentEntry.activity,
    existingEntries,
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setDuplicateEntry(null);
    }
  }, [show]);

  useEffect(() => {
    if (currentEntry.activity) {
      const units = scope2Data.filter(
        (entry) => entry.id === Number(currentEntry.activity)
      );
      setUnits(units)
    }
  }, [currentEntry.activity]);

  useEffect(() => {
    if (currentEntry.activity) {
      const fuel = scope2Data.find(
        (entry) => entry.id === Number(currentEntry.activity) && entry.unit === currentEntry.unit
      );
      setFinalFuel(fuel)
    }
  }, [currentEntry.unit]);

  const updateEntry = (field, value) => {
    if (currentEntry[field] !== value) {
      updateEmissionEntry(currentEntry.id, field, value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && !duplicateEntry) {
      onSubmit(currentEntry);
    }
  };

  const isFormValid =
    currentEntry.location &&
    currentEntry.period &&
    currentEntry.financialYear &&
    currentEntry.activity &&
    currentEntry.unit &&
    currentEntry.consumption &&
    !duplicateEntry;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Modal.Header
        className="border-0 pb-0"
        style={{
          background: "linear-gradient(135deg, #3c8dbb, #7494a7)",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center">
          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              
            }}
          >
            <FiPlus size={24} style={{ color: "white" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Modal.Title
              style={{
                fontWeight: "700",
                fontSize: "1.75rem",
                color: "white",
                letterSpacing: "-0.025em",
              }}
            >
              Add Emission Entry
            </Modal.Title>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "400",
              }}
            >
              Track your carbon footprint data
            </p>
          </div>
        </div>
        <Button
          variant="link"
          onClick={onHide}
          className="p-2 border-0"
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.5rem",
            textDecoration: "none",
            transition: "all 0.2s ease",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <FiX />
        </Button>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: "2rem",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          minHeight: "400px",
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
        {/* Duplicate entry warning */}
        {duplicateEntry && (
          <div
            className="alert mb-4 d-flex align-items-start"
            style={{
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #fefbf2 0%, #fef3c7 100%)",
              color: "#92400e",
              padding: "1rem 1.25rem",
              boxShadow: "0 4px 6px -1px rgba(217, 119, 6, 0.1)",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            <div
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "24px",
                height: "24px",
                background: "rgba(217, 119, 6, 0.1)",
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <FiAlertTriangle size={14} style={{ color: "#d97706" }} />
            </div>
            <div>
              <div className="fw-bold mb-1">Entry Already Exists</div>
              <div style={{ fontSize: "0.85rem", color: "#78350f" }}>
                An entry with the same location, period, financial year, and
                activity already exists. Please modify the details or update the
                existing entry.
              </div>
            </div>
          </div>
        )}

        {/* Form Fields Using Focused Components */}
        <FormRow gap={4}>
          <FinancialYearField
            value={currentEntry.financialYear}
            onChange={(value) => updateEntry("financialYear", value)}
            options={financialYears}
            required={true}
          />

          <LocationField
            value={currentEntry.location}
            onChange={(value) => updateEntry("location", value)}
            options={locations}
            required={true}
          />
        </FormRow>

        <FormRow gap={4}>
          <PeriodField
            value={currentEntry.period}
            onChange={(value) => updateEntry("period", value)}
            options={timePeriodOptions}
            required={true}
            onPeriodChange={handlePeriodChange}
          />

          {/* Activity Field - Standard Bootstrap */}
          <Form.Group>
            <Form.Label
              className="fw-semibold mb-2 d-flex align-items-center"
              style={{ color: "#1e293b", fontSize: "0.9rem" }}
            >
              <div
                className="rounded-circle me-2"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#f59e0b", // warning color
                }}
              ></div>
              Activity *
            </Form.Label>
            <div className="position-relative">
              <Form.Select
                value={currentEntry.activity}
                onChange={(e) => {
                  updateEntry("activity", e.target.value);
                  // Reset unit when activity changes
                  updateEntry("unit", "");
                }}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                }}
              >
                <option value="">Choose activity...</option>
                {activities?.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </FormRow>

        <FormRow gap={4}>
          <ConsumptionField
            value={currentEntry.consumption}
            onChange={(value) => updateEntry("consumption", value)}
            required={true}
            disabled={!currentEntry.unit}
          />
          {/* Unit Field - Standard Bootstrap */}
          <Form.Group>
            <Form.Label
              className="fw-semibold mb-2 d-flex align-items-center"
              style={{ color: "#1e293b", fontSize: "0.9rem" }}
            >
              <div
                className="rounded-circle me-2"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#ef4444", // danger color
                }}
              ></div>
              Unit *
            </Form.Label>
            <div className="position-relative">
              <Form.Select
                value={currentEntry.unit}
                onChange={(e) => updateEntry("unit", e.target.value)}
                disabled={!currentEntry.activity}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: currentEntry.activity ? "white" : "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                  cursor: !currentEntry.activity ? "not-allowed" : "pointer",
                  opacity: !currentEntry.activity ? 0.6 : 1,
                }}
              >
                <option value="">
                  {currentEntry.activity
                    ? "Choose unit..."
                    : "Select activity first"}
                </option>
                {units?.map((unit) => (
                  <option key={unit.id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form.Group>
        </FormRow>

        {finalFuel && currentEntry.consumption && !duplicateEntry && (
          <div
            className="mt-5 p-4"
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              borderRadius: "16px",
              border: "2px solid #e0f2fe",
              boxShadow: "0 4px 6px -1px rgba(56, 189, 248, 0.1)",
            }}
          >
            <div className="d-flex align-items-center mb-3">
              <h4
                className="mb-0"
                style={{
                  color: "#0c4a6e",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                }}
              >
                Calculation Results
              </h4>
            </div>
            <EmissionCalculationResults
              results={finalFuel}
              consumption={currentEntry.consumption}
              updateEntry={updateEntry}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        className="border-0"
        style={{
          padding: "1.5rem 2rem 2rem 2rem",
          background: "linear-gradient(to top, #f8fafc, #ffffff)",
        }}
      >
        <div className="d-flex gap-3 w-100 justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            style={{
              height: "52px",
              padding: "0 28px",
              fontSize: "0.95rem",
              fontWeight: "600",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              color: "#64748b",
              background: "linear-gradient(145deg, #ffffff, #f8fafc)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#cbd5e1";
              e.currentTarget.style.background =
                "linear-gradient(145deg, #f8fafc, #f1f5f9)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.08)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background =
                "linear-gradient(145deg, #ffffff, #f8fafc)";
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.02)";
            }}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={{
              height: "52px",
              minWidth: "160px",
              padding: "0 28px",
              fontSize: "0.95rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              border: "none",
              borderRadius: "12px",
              background: isFormValid
                ? "linear-gradient(135deg, #3c8dbb, #7494a7)"
                : "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
              color: "white",
              boxShadow: isFormValid
                ? "0 8px 25px -5px rgba(102, 126, 234, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: isFormValid ? "pointer" : "not-allowed",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px -5px rgba(102, 126, 234, 0.6), 0 8px 10px -2px rgba(0, 0, 0, 0.1)";
              }
            }}
            onMouseOut={(e) => {
              if (isFormValid) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #3c8dbb, #7494a7)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px -5px rgba(102, 126, 234, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            {duplicateEntry ? "Entry Already Exists" : "Save Entry"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EmissionDefraEntryModal;
