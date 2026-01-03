import { useState, useEffect } from "react";
import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import { FiX, FiPlus, FiAlertTriangle } from "react-icons/fi";
import EmissionCalculationResults from "./EmissionCalculationResults";

const EmissionDefraEntryModal = ({
  show,
  onHide,
  onSubmit,
  locations,
  timePeriodOptions,
  fuelType,
  fuels,
  mobileLevel1,
  mobileLevel2,
  mobileLevel3,
  setSelectedFinalMobileFuel,
  setSelectedFuelType,
  handlePeriodChange,
  fuelError,
  setFuelError,
  emissionEntries,
  updateEmissionEntry,
  categories,
  category,
  setCategory,
  financialYears,
  setFuelName,
  stationaryFuel,
  setSelectedTransportType,
  selectedMobileFuel,
  setSelectedEngineType,
  fugitiveFuel,
  setSelectedFugitiveFuel,
  selectedNewFugitiveFuel,
  selectedNewMobileFuelForCal,
  finalFuel,
  setSelectedUnit,
}) => {
  const [duplicateEntry, setDuplicateEntry] = useState(null);
  const existingEntries = emissionEntries.filter((entry) => !entry.isNew);
  const currentEntry = emissionEntries.find((entry) => entry.isNew) || {
    id: crypto.randomUUID(),
    location: "",
    period: "",
    consumption: "",
    emission: "",
    unit: "",
    fuelType: "",
    subFuelType: "",
    category: category || "",
    calculationResults: null,
    isNew: true,
  };

  // Function to check for duplicate entries
  const checkForDuplicate = (entry) => {
    if (!existingEntries || existingEntries.length === 0) return null;

    const duplicate = existingEntries.find((existing) => {
      // Skip if it's the same entry being edited
      if (existing.id === entry.id) return false;

      // For stationary category
      if (entry.category === "stationary") {
        return (
          existing.location === entry.location &&
          existing.period == entry.period &&
          existing.financialYearId == entry.financialYear &&
          existing.category === entry.category &&
          existing.fuelType === entry.fuelType &&
          existing.subFuelType === entry.subFuelType
        );
      }

      // For mobile category
      if (entry.category === "mobile") {
        return (
          existing.location === entry.location &&
          existing.period == entry.period &&
          existing.financialYearId == entry.financialYear &&
          existing.category === entry.category &&
          existing.fuelType === entry.fuelType &&
          existing.subFuelType === entry.subFuelType &&
          existing.engineType === entry.engineType
        );
      }
      if (entry.category === "fugitive") {
        return (
          existing.location === entry.location &&
          existing.period == entry.period &&
          existing.financialYearId == entry.financialYear &&
          existing.category === entry.category &&
          existing.fuelType === entry.fuelType
        );
      }

      return false;
    });
    return duplicate;
  };

  // Check for duplicates whenever key fields change
  useEffect(() => {
    if (
      currentEntry.location &&
      currentEntry.period &&
      currentEntry.financialYear &&
      currentEntry.category
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
    currentEntry.category,
    currentEntry.fuelType,
    currentEntry.subFuelType,
    currentEntry.engineType,
    existingEntries,
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFuelError("");
      setDuplicateEntry(null);
    }
  }, [show, setFuelError]);

  const updateEntry = (field, value) => {
    // Only update if value actually changed to prevent infinite loop
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
    currentEntry.category &&
    !duplicateEntry;

  // Helper function to get display names for the duplicate warning
  const getDisplayName = (type, id, options) => {
    const item = options?.find((option) => option.id === id);
    if (type === "location") {
      return (
        item?.unitCode ||
        `${item?.location?.area || ""}, ${item?.location?.city || ""}`.trim()
      );
    }
    if (type === "period") {
      const periodOption = timePeriodOptions?.find(
        (option) => option.value === id
      );
      return periodOption?.label;
    }
    if (type === "financialYear") {
      return item?.financial_year_value;
    }
    if (type === "category") {
      return item?.label;
    }
    return (
      item?.fuel_type || item?.fuel || item?.transport || item?.engine || id
    );
  };

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
        {/* Custom scrollbar styles for webkit browsers */}
        <style jsx>{`
          .modal-body::-webkit-scrollbar {
            width: 8px;
          }
          .modal-body::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .modal-body::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          .modal-body::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>

        {/* Error message */}
        {fuelError && (
          <div
            className="alert mb-4 d-flex align-items-center"
            style={{
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              color: "#dc2626",
              padding: "1rem 1.25rem",
              boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.1)",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            <div
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "24px",
                height: "24px",
                background: "rgba(220, 38, 38, 0.1)",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              <FiX size={14} style={{ color: "#dc2626" }} />
            </div>
            {fuelError}
          </div>
        )}

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
                An entry with the same location, period, financial year,
                category, and fuel details already exists. Please modify the
                details or update the existing entry.
              </div>
            </div>
          </div>
        )}

        {/* Location, Period, and Category */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label
                className="fw-semibold mb-2 d-flex align-items-center"
                style={{ color: "#1e293b", fontSize: "0.9rem" }}
              >
                <div
                  className="w-2 h-2 bg-primary rounded-circle me-2"
                  style={{ width: "6px", height: "6px" }}
                ></div>
                Financial Year *
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={currentEntry.financialYear}
                  onChange={(e) => updateEntry("financialYear", e.target.value)}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                >
                  <option value="">Choose financial year...</option>
                  {financialYears?.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.financial_year_value}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label
                className="fw-semibold mb-2 d-flex align-items-center"
                style={{ color: "#1e293b", fontSize: "0.9rem" }}
              >
                <div
                  className="w-2 h-2 bg-success rounded-circle me-2"
                  style={{ width: "6px", height: "6px" }}
                ></div>
                Location *
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={currentEntry.location}
                  onChange={(e) => updateEntry("location", e.target.value)}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                >
                  <option value="">Choose location...</option>
                  {locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location?.unitCode ||
                        `${location?.location?.area || ""}, ${
                          location?.location?.city || ""
                        }`.trim()}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label
                className="fw-semibold mb-2 d-flex align-items-center"
                style={{ color: "#1e293b", fontSize: "0.9rem" }}
              >
                <div
                  className="w-2 h-2 bg-success rounded-circle me-2"
                  style={{ width: "6px", height: "6px" }}
                ></div>
                Period *
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={currentEntry.period}
                  onChange={(e) => {
                    updateEntry("period", e.target.value);
                    if (handlePeriodChange) {
                      handlePeriodChange(e.target.value);
                    }
                  }}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                >
                  <option value="">Choose period...</option>
                  {timePeriodOptions?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label
                className="fw-semibold mb-2 d-flex align-items-center"
                style={{ color: "#1e293b", fontSize: "0.9rem" }}
              >
                <div
                  className="w-2 h-2 bg-warning rounded-circle me-2"
                  style={{ width: "6px", height: "6px" }}
                ></div>
                Category *
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={currentEntry.category || category}
                  onChange={(e) => {
                    updateEntry("category", e.target.value);
                    setCategory(e.target.value);
                  }}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                  }}
                >
                  <option value="">Choose category...</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* Fuel Type and Fuel */}
        <Row className="g-4 mb-4">
          {currentEntry.category === "stationary" ? (
            <>
              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 bg-info rounded-circle me-2"
                      style={{ width: "6px", height: "6px" }}
                    ></div>
                    Fuel Type *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.fuelType}
                      onChange={(e) => {
                        updateEntry("fuelType", e.target.value);
                        setSelectedFuelType(e.target.value);
                        updateEntry("subFuelType", "");
                      }}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                      }}
                    >
                      <option value="">Choose fuel type...</option>
                      {fuelType?.map((fuel) => (
                        <option key={fuel.id} value={fuel.fuelType}>
                          {fuel.fuelType}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 rounded-circle me-2"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: currentEntry.fuelType
                          ? "#8b5cf6"
                          : "#cbd5e1",
                      }}
                    ></div>
                    Fuel *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.fuel}
                      onChange={(e) => {
                        updateEntry("fuel", e.target.value);
                        setFuelName(e.target.value);
                      }}
                      disabled={!currentEntry.fuelType}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: currentEntry.fuelType
                          ? "white"
                          : "#f8fafc",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: !currentEntry.fuelType
                          ? "not-allowed"
                          : "pointer",
                        opacity: !currentEntry.fuelType ? 0.6 : 1,
                      }}
                    >
                      <option value="">
                        {currentEntry.fuelType
                          ? "Choose fuel..."
                          : "Select fuel type first"}
                      </option>
                      {fuels?.map((subFuel) => (
                        <option key={subFuel.id} value={subFuel.fuel}>
                          {subFuel.fuel}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </>
          ) : currentEntry.category === "mobile" ? (
            <>
              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 bg-info rounded-circle me-2"
                      style={{ width: "6px", height: "6px" }}
                    ></div>
                    Vehicle Category *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.level1}
                      onChange={(e) => {
                        updateEntry("level1", e.target.value);
                        setSelectedFuelType(e.target.value);
                        updateEntry("level2", "");
                      }}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                      }}
                    >
                      <option value="">Choose Vehicle Category ...</option>
                      {mobileLevel1?.map((fuel) => (
                        <option key={fuel.id} value={fuel.level1}>
                          {fuel.level1}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 rounded-circle me-2"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: currentEntry.level1
                          ? "#8b5cf6"
                          : "#cbd5e1",
                      }}
                    ></div>
                    Vehicle Type *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.level2}
                      onChange={(e) => {
                        updateEntry("level2", e.target.value);
                        setSelectedTransportType(e.target.value);
                      }}
                      disabled={!currentEntry.level1}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: currentEntry.level1
                          ? "white"
                          : "#f8fafc",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: !currentEntry.level1
                          ? "not-allowed"
                          : "pointer",
                        opacity: !currentEntry.level1 ? 0.6 : 1,
                      }}
                    >
                      <option value="">
                        {currentEntry.level1
                          ? "Choose Vehicle Type..."
                          : "Select Vehicle Category first"}
                      </option>
                      {mobileLevel2?.map((subFuel) => (
                        <option key={subFuel.id} value={subFuel.level2}>
                          {subFuel.level2}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 rounded-circle me-2"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: currentEntry.level2
                          ? "#8b5cf6"
                          : "#cbd5e1",
                      }}
                    ></div>
                    Vehicle Specification *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.level3}
                      onChange={(e) => {
                        updateEntry("level3", e.target.value);
                        setSelectedEngineType(e.target.value);
                      }}
                      disabled={!currentEntry.level2}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: currentEntry.level2
                          ? "white"
                          : "#f8fafc",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: !currentEntry.level2
                          ? "not-allowed"
                          : "pointer",
                        opacity: !currentEntry.level2 ? 0.6 : 1,
                      }}
                    >
                      <option value="">
                        {currentEntry.level2
                          ? "Choose Vehicle Specification ..."
                          : "Select Vehicle Type first"}
                      </option>
                      {mobileLevel3?.map((subFuel) => (
                        <option key={subFuel.id} value={subFuel.level3}>
                          {subFuel.level3}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 rounded-circle me-2"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: currentEntry.level3
                          ? "#8b5cf6"
                          : "#cbd5e1",
                      }}
                    ></div>
                    Fuel *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.fuel}
                      onChange={(e) => {
                        updateEntry("fuel", e.target.value);
                        setSelectedFinalMobileFuel(e.target.value);
                      }}
                      disabled={!currentEntry.level3}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: currentEntry.level3
                          ? "white"
                          : "#f8fafc",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: !currentEntry.level3
                          ? "not-allowed"
                          : "pointer",
                        opacity: !currentEntry.level3 ? 0.6 : 1,
                      }}
                    >
                      <option value="">
                        {currentEntry.level3
                          ? "Choose fuel ..."
                          : "Select selection 2 first"}
                      </option>
                      {selectedMobileFuel?.map((subFuel) => (
                        <option key={subFuel.id} value={subFuel.fuel}>
                          {subFuel.fuel}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </>
          ) : currentEntry.category === "fugitive" ? (
            <>
              <Col md={4}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 bg-info rounded-circle me-2"
                      style={{ width: "6px", height: "6px" }}
                    ></div>
                    Refrigerant *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.fuel}
                      onChange={(e) => {
                        updateEntry("fuel", e.target.value);
                        setSelectedFugitiveFuel(e.target.value);
                      }}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                      }}
                    >
                      <option value="">Choose Refrigerant Number...</option>
                      {fugitiveFuel?.map((fuel) => (
                        <option key={fuel.id} value={fuel.fuel}>
                          {fuel.fuel}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 bg-danger rounded-circle me-2"
                      style={{ width: "6px", height: "6px" }}
                    ></div>
                    Amount *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="amount (e.g., 1500)"
                    value={currentEntry.consumption}
                    onChange={(e) => updateEntry("consumption", e.target.value)}
                    disabled={!!fuelError || !!duplicateEntry}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor:
                        !!fuelError || !!duplicateEntry ? "#fee2e2" : "white",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      cursor:
                        !!fuelError || !!duplicateEntry
                          ? "not-allowed"
                          : "text",
                      opacity: !!fuelError || !!duplicateEntry ? 0.6 : 1,
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-2 d-flex align-items-center"
                    style={{ color: "#1e293b", fontSize: "0.9rem" }}
                  >
                    <div
                      className="w-2 h-2 rounded-circle me-2"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: currentEntry.level3
                          ? "#8b5cf6"
                          : "#cbd5e1",
                      }}
                    ></div>
                    Unit *
                  </Form.Label>
                  {console.log(
                    selectedNewMobileFuelForCal,
                    "selectedNewMobileFuelForCal"
                  )}
                  <div className="position-relative">
                    <Form.Select
                      value={currentEntry.unit}
                      onChange={(e) => {
                        updateEntry("unit", e.target.value);
                        setSelectedUnit(e.target.value);
                      }}
                      disabled={!currentEntry.fuel}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: currentEntry.fuel
                          ? "white"
                          : "#f8fafc",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: !currentEntry.fuel ? "not-allowed" : "pointer",
                        opacity: !currentEntry.fuel ? 0.6 : 1,
                      }}
                    >
                      <option value="">
                        {currentEntry.fuel
                          ? "Choose Unit ..."
                          : "Select Fuel first"}
                      </option>
                      {selectedNewFugitiveFuel?.map((subFuel) => (
                        <option key={subFuel.id} value={subFuel.unit}>
                          {subFuel.unit}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </>
          ) : (
            <></>
          )}
        </Row>

        {currentEntry.category === "stationary" ||
        currentEntry.category === "mobile" ? (
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className="fw-semibold mb-2 d-flex align-items-center"
                  style={{ color: "#1e293b", fontSize: "0.9rem" }}
                >
                  <div
                    className="w-2 h-2 bg-danger rounded-circle me-2"
                    style={{ width: "6px", height: "6px" }}
                  ></div>
                  Consumption *
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter consumption value (e.g., 1500)"
                  value={currentEntry.consumption}
                  onChange={(e) => updateEntry("consumption", e.target.value)}
                  disabled={!!fuelError || !!duplicateEntry}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor:
                      !!fuelError || !!duplicateEntry ? "#fee2e2" : "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                    cursor:
                      !!fuelError || !!duplicateEntry ? "not-allowed" : "text",
                    opacity: !!fuelError || !!duplicateEntry ? 0.6 : 1,
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  className="fw-semibold mb-2 d-flex align-items-center"
                  style={{ color: "#1e293b", fontSize: "0.9rem" }}
                >
                  <div
                    className="w-2 h-2 rounded-circle me-2"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: currentEntry.level3
                        ? "#8b5cf6"
                        : "#cbd5e1",
                    }}
                  ></div>
                  Unit *
                </Form.Label>
                {console.log(
                  selectedNewMobileFuelForCal,
                  "selectedNewMobileFuelForCal"
                )}
                <div className="position-relative">
                  <Form.Select
                    value={currentEntry.unit}
                    onChange={(e) => {
                      updateEntry("unit", e.target.value);
                      setSelectedUnit(e.target.value);
                    }}
                    disabled={!currentEntry.fuel}
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      backgroundColor: currentEntry.fuel ? "white" : "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      height: "44px",
                      cursor: !currentEntry.fuel ? "not-allowed" : "pointer",
                      opacity: !currentEntry.fuel ? 0.6 : 1,
                    }}
                  >
                    <option value="">
                      {currentEntry.fuel
                        ? "Choose Unit ..."
                        : "Select Fuel first"}
                    </option>
                    {currentEntry.category === "mobile"
                      ? selectedNewMobileFuelForCal?.map((subFuel) => (
                          <option key={subFuel.id} value={subFuel.unit}>
                            {subFuel.unit}
                          </option>
                        ))
                      : stationaryFuel?.map((subFuel) => (
                          <option key={subFuel.id} value={subFuel.unit}>
                            {subFuel.unit}
                          </option>
                        ))}
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
          </Row>
        ) : (
          <></>
        )}
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
              category={currentEntry.category}
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
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px -5px rgba(102, 126, 234, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            {duplicateEntry ? "Entry Already Exists" : "Save"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EmissionDefraEntryModal;
