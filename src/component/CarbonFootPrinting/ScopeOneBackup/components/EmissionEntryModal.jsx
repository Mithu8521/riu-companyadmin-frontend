import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import { FiX, FiPlus, FiChevronDown, FiAlertTriangle } from "react-icons/fi";
import EmissionCalculationResults from "./EmissionCalculationResults";
import {
  FormRow,
  FinancialYearField,
  LocationField,
  PeriodField,
  ConsumptionField,
} from "../../common/FormComponents";

const EmissionEntryModal = ({
  show,
  onHide,
  onSubmit,
  locations,
  timePeriodOptions,
  handlePeriodChange,
  emissionEntries,
  updateEmissionEntry,
  categories,
  financialYears,
  selectedFinancialYear,
  setSelectedFinancialYear,
  scope1Data,
  ghgProtocol,
}) => {
  const [duplicateEntry, setDuplicateEntry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({});
  const [fuelError, setFuelError] = useState("");

  const existingEntries = emissionEntries.filter((entry) => !entry.isNew);
  const currentEntry = emissionEntries.find((entry) => entry.isNew) || {
    id: crypto.randomUUID(),
    location: "",
    period: "",
    consumption: "",
    emission: "",
    unit: "",
    category: "",
    calculationResults: null,
    isNew: true,
  };

  // Get methods for selected category (mobile has multiple methods)
  const availableMethods = useMemo(() => {
    if (!selectedCategory || !scope1Data?.[selectedCategory]) return [];
  
    const categoryData = scope1Data[selectedCategory][ghgProtocol];
  
    // Define the allowed method keys
    const allowedMethodKeys = ['fuel_use', 'distance', 'freight', 'public_transport'];
  
    // For mobile category, extract and filter method keys from data
    if (
      selectedCategory === "mobile" &&
      categoryData.data &&
      typeof categoryData.data === "object"
    ) {
      return Object.keys(categoryData.data)
        .filter((methodKey) => allowedMethodKeys.includes(methodKey))
        .map((methodKey) => ({
          id: methodKey,
          label: methodKey
            .replace("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: categoryData.data[methodKey],
        }));
    }
  
    // For other categories, return single method
    return [
      {
        id: ghgProtocol,
        label: categoryData.frontendFields?.name || "IPCC",
        data: categoryData,
      },
    ];
  }, [selectedCategory, scope1Data]);
  

  // Get form fields dynamically based on selected category and method
  const formFields = useMemo(() => {
    if (!selectedCategory || !scope1Data?.[selectedCategory]) return [];

    let fieldsData;

    if (selectedCategory === "mobile" && selectedMethod) {
      fieldsData =
        scope1Data[selectedCategory][ghgProtocol].data[selectedMethod]?.frontendFields;
    } else {
      fieldsData = scope1Data[selectedCategory][ghgProtocol].frontendFields;
    }

    return fieldsData?.fields || [];
  }, [selectedCategory, selectedMethod, scope1Data]);

  // Get dropdown options using the backend dependency tree
  const getDropdownOptions = (fieldName, categoryKey, methodKey = null) => {
    if (!scope1Data?.[categoryKey]) return [];

    let dependencyTree = null;

    if (categoryKey === "mobile" && methodKey) {
      dependencyTree =
        scope1Data[categoryKey][ghgProtocol].data[methodKey]?.dependencyTree;
    } else {
      dependencyTree = scope1Data[categoryKey][ghgProtocol].dependencyTree;
    }

    if (!dependencyTree || !dependencyTree[fieldName]) return [];

    const fieldOptions = dependencyTree[fieldName];

    // If field has dependencies, filter by current form data
    const fieldConfig = formFields.find((f) => f.name === fieldName);

    if (
      fieldConfig?.dependsOn &&
      typeof fieldOptions === "object" &&
      !Array.isArray(fieldOptions)
    ) {
      // This is a dependent field with parent-child structure
      const parentValue = formData[fieldConfig.dependsOn];
      if (!parentValue) return [];

      return (fieldOptions[parentValue] || []).map((value) => ({
        value,
        label: value,
      }));
    } else if (Array.isArray(fieldOptions)) {
      // This is an independent field with direct array of options
      return fieldOptions.map((value) => ({ value, label: value }));
    }

    return [];
  };

  // Enhanced unit options handling for freight and other complex cases
  const getAvailableUnits = (categoryKey, methodKey = null) => {
    // First try to get unit options from dependency tree
    const unitOptions = getDropdownOptions("unit", categoryKey, methodKey);
    if (unitOptions.length > 0) {
      return unitOptions;
    }

    // Special handling for freight method with multiple unit types
    if (categoryKey === "mobile" && methodKey === "freight") {
      let dependencyTree =
        scope1Data[categoryKey][ghgProtocol].data[methodKey]?.dependencyTree;

      if (dependencyTree) {
        // For freight, we need to determine which unit field based on the field name context
        // This is a fallback for when the generic "unit" field isn't found
        const fuelValue = formData.fuel;

        if (fuelValue) {
          // Try to get weightUnit or distanceUnit based on context
          if (
            dependencyTree.weightUnit &&
            dependencyTree.weightUnit[fuelValue]
          ) {
            return dependencyTree.weightUnit[fuelValue].map((value) => ({
              value,
              label: value,
            }));
          }
          if (
            dependencyTree.distanceUnit &&
            dependencyTree.distanceUnit[fuelValue]
          ) {
            return dependencyTree.distanceUnit[fuelValue].map((value) => ({
              value,
              label: value,
            }));
          }
        }
      }
    }

    // Fallback to direct data filtering if dependency tree doesn't have units
    return getDropdownOptionsFallback("unit", categoryKey, methodKey);
  };

  // Fallback method for getting options directly from data (for complex cases)
  const getDropdownOptionsFallback = (
    fieldName,
    categoryKey,
    methodKey = null
  ) => {
    if (!scope1Data?.[categoryKey]) return [];

    let dataSource;
    if (categoryKey === "mobile" && methodKey) {
      dataSource =
        scope1Data[categoryKey][ghgProtocol].data[methodKey]?.records ||
        scope1Data[categoryKey][ghgProtocol].data[methodKey]?.data;
    } else {
      dataSource = scope1Data[categoryKey][ghgProtocol].data;
    }

    if (!Array.isArray(dataSource)) {
      if (dataSource && typeof dataSource === "object") {
        const allRecords = [];
        Object.values(dataSource).forEach((subData) => {
          if (subData.records) {
            allRecords.push(...subData.records);
          } else if (Array.isArray(subData)) {
            allRecords.push(...subData);
          }
        });
        dataSource = allRecords;
      } else {
        return [];
      }
    }

    // Filter by all current form data to get relevant options
    let filteredData = dataSource;

    // Get field config to understand backend mapping
    const fieldConfig = formFields.find((f) => f.name === fieldName);
    const backendFieldName = fieldConfig?.backendField || fieldName;

    // Apply filters based on current form selections
    formFields.forEach((field) => {
      const formValue = formData[field.name];
      if (formValue && field.backendField) {
        filteredData = filteredData.filter(
          (item) => item[field.backendField] === formValue
        );
      }
    });

    // Extract unique values for the target field
    const uniqueValues = [
      ...new Set(
        filteredData
          .map((item) => item[backendFieldName])
          .filter(
            (value) => value !== null && value !== undefined && value !== ""
          )
      ),
    ];

    return uniqueValues.map((value) => ({ value, label: value }));
  };

  // Check if field should be shown based on showWhen condition
  const shouldShowField = (field, currentFormData) => {
    if (!field.showWhen) return true;

    return Object.entries(field.showWhen).every(([key, value]) => {
      return currentFormData[key] === value;
    });
  };

  // Update form data function with cascade reset
  const updateFormData = (key, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [key]: value };

      // Find the current field to check if it has dependents
      const currentField = formFields.find((f) => f.name === key);

      // Clear dependent fields when parent field changes
      formFields.forEach((field) => {
        if (field.dependsOn === key) {
          newFormData[field.name] = "";
        }
        // Also clear fields that depend on the cleared dependent fields (cascade)
        if (prev[field.dependsOn] && !newFormData[field.dependsOn]) {
          newFormData[field.name] = "";
        }
      });

      return newFormData;
    });
    updateEntry(key, value);
  };

  // Function to check for duplicate entries
  const checkForDuplicate = (entry) => {
    if (!existingEntries || existingEntries.length === 0) return null;

    const duplicate = existingEntries.find((existing) => {
      // Skip if it's the same entry being edited
      if (existing.id === entry.id) return false;

      // Basic duplicate check - can be enhanced based on category specifics
      return (
        existing.location === entry.location &&
        existing.period == entry.period &&
        existing.financialYearId == entry.financialYear &&
        existing.category === entry.category
      );
    });
    return false;
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
      setDuplicateEntry(null);
    } else {
      setDuplicateEntry(null);
    }
  }, [
    currentEntry.location,
    currentEntry.period,
    currentEntry.financialYear,
    currentEntry.category,
    existingEntries,
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFuelError("");
      setDuplicateEntry(null);
      setSelectedCategory("");
      setSelectedMethod("");
      setFormData({});
    }
  }, [show]);

  const updateEntry = (field, value) => {
    // Only update if value actually changed to prevent infinite loop
    if (currentEntry[field] !== value) {
      updateEmissionEntry(currentEntry.id, field, value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && !duplicateEntry) {
      const entryData = {
        ...currentEntry,
        ...formData,
        category: selectedCategory,
        method: selectedMethod,
        financialYear: selectedFinancialYear,
      };
      onSubmit(entryData);
    }
  };

  // Render dynamic form field
  const renderFormField = (field) => {
    const value = formData[field.name] || "";
    const isDisabled = field.dependsOn && !formData[field.dependsOn];

    // Check if field should be shown
    if (!shouldShowField(field, formData)) {
      return null;
    }

    const commonStyle = {
      borderRadius: "8px",
      fontSize: "0.9rem",
      height: "44px",
      backgroundColor: isDisabled ? "#f8fafc" : "white",
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
    };

    switch (field.type) {
      case "dropdown":
        let options = field.options || [];

        // Get options based on field dependencies
        if (!field.options && selectedCategory) {
          if (
            field.name === "unit" ||
            field.name.includes("Unit") ||
            field.name === "weightUnit" ||
            field.name === "distanceUnit" ||
            field.name === "initialQuantityUnit" ||
            field.name === "quantityPurchasedUnit" ||
            field.name === "quantityRecoveredUnit"
          ) {
            // Special handling for unit fields
            if (selectedCategory === "mobile" && selectedMethod === "freight") {
              // For freight, handle specific unit types
              let dependencyTree =
                scope1Data[selectedCategory][ghgProtocol].data[selectedMethod]
                  ?.dependencyTree;
              const fuelValue = formData.fuel;

              if (dependencyTree && fuelValue) {
                if (field.name === "weightUnit" && dependencyTree.weightUnit) {
                  options = (dependencyTree.weightUnit[fuelValue] || []).map(
                    (value) => ({ value, label: value })
                  );
                } else if (
                  field.name === "distanceUnit" &&
                  dependencyTree.distanceUnit
                ) {
                  options = (dependencyTree.distanceUnit[fuelValue] || []).map(
                    (value) => ({ value, label: value })
                  );
                } else {
                  // Fallback to generic unit handling
                  options = getAvailableUnits(selectedCategory, selectedMethod);
                }
              }
            } else if (selectedCategory === "fugitive") {
              // For fugitive, handle specific unit types
              let dependencyTree =
                scope1Data[selectedCategory][ghgProtocol].dependencyTree;
              const refrigerantValue = formData.refrigerant;

              if (dependencyTree && refrigerantValue) {
                if (
                  field.name === "initialQuantityUnit" &&
                  dependencyTree.initialQuantityUnit
                ) {
                  options = (
                    dependencyTree.initialQuantityUnit[refrigerantValue] || []
                  ).map((value) => ({ value, label: value }));
                } else if (
                  field.name === "quantityPurchasedUnit" &&
                  dependencyTree.quantityPurchasedUnit
                ) {
                  options = (
                    dependencyTree.quantityPurchasedUnit[refrigerantValue] || []
                  ).map((value) => ({ value, label: value }));
                } else if (
                  field.name === "quantityRecoveredUnit" &&
                  dependencyTree.quantityRecoveredUnit
                ) {
                  options = (
                    dependencyTree.quantityRecoveredUnit[refrigerantValue] || []
                  ).map((value) => ({ value, label: value }));
                } else {
                  // Fallback to generic unit handling
                  options = getAvailableUnits(selectedCategory, selectedMethod);
                }
              }
            } else {
              // Standard unit handling for other methods
              options = getAvailableUnits(selectedCategory, selectedMethod);
            }
          } else if (field.dependsOn) {
            // Check if dependent field has a value
            const dependentValue = formData[field.dependsOn];
            if (dependentValue) {
              options = getDropdownOptions(
                field.name,
                selectedCategory,
                selectedMethod
              );
            } else {
              // If dependent value is not selected, show empty options
              options = [];
            }
          } else {
            // Get all available options for independent fields
            options = getDropdownOptions(
              field.name,
              selectedCategory,
              selectedMethod
            );
          }
        }

        return (
          <Col md={6} key={field.name}>
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
                    backgroundColor: "#06b6d4",
                  }}
                ></div>
                {field.label} {field.required && "*"}
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={value}
                  onChange={(e) => updateFormData(field.name, e.target.value)}
                  disabled={isDisabled}
                  className="border-2 py-2 ps-3 pe-4"
                  style={commonStyle}
                >
                  <option value="">
                    {isDisabled
                      ? `Select ${
                          field.dependsOn
                            ? formFields
                                .find((f) => f.name === field.dependsOn)
                                ?.label?.toLowerCase() ||
                              field.label.toLowerCase()
                            : field.label.toLowerCase()
                        } first`
                      : `Choose ${field.label.toLowerCase()}...`}
                  </option>
                  {options.map((option) => (
                    <option
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
          </Col>
        );

      case "number":
        return (
          <Col md={6} key={field.name}>
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
                    backgroundColor: "#8b5cf6",
                  }}
                ></div>
                {field.label} {field.required && "*"}
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="number"
                  step="any"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => updateFormData(field.name, e.target.value)}
                  disabled={isDisabled || !!fuelError || !!duplicateEntry}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    ...commonStyle,
                    backgroundColor:
                      !!fuelError || !!duplicateEntry || isDisabled
                        ? "#fee2e2"
                        : "white",
                    cursor:
                      !!fuelError || !!duplicateEntry || isDisabled
                        ? "not-allowed"
                        : "text",
                  }}
                />
              </div>
            </Form.Group>
          </Col>
        );

      default:
        return (
          <Col md={6} key={field.name}>
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
                    backgroundColor: "#64748b",
                  }}
                ></div>
                {field.label} {field.required && "*"}
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => updateFormData(field.name, e.target.value)}
                  disabled={isDisabled}
                  className="border-2 py-2 ps-3 pe-4"
                  style={commonStyle}
                />
              </div>
            </Form.Group>
          </Col>
        );
    }
  };

  const isFormValid =
    currentEntry.location &&
    currentEntry.period 

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
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
                An entry with the same location, period, financial year, and
                category already exists. Please modify the details or update the
                existing entry.
              </div>
            </div>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="mb-4">
          <h6 className="mb-3" style={{ color: "#374151", fontWeight: "600" }}>
            Basic Information
          </h6>
          <FormRow>
            {/* Financial Year */}
            <FinancialYearField
              value={selectedFinancialYear}
              onChange={(value) => {
                setSelectedFinancialYear(value);
                updateEntry("financialYear", value);
              }}
              options={financialYears}
              required={true}
            />

            {/* Location */}
            <LocationField
              value={currentEntry.location}
              onChange={(value) => updateEntry("location", value)}
              options={locations}
              required={true}
            />

            {/* Period */}
            <PeriodField
              value={currentEntry.period}
              onChange={(value) => updateEntry("period", value)}
              options={timePeriodOptions}
              required={true}
              onPeriodChange={handlePeriodChange}
            />

            {/* Category */}
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
                    backgroundColor: "#f59e0b",
                  }}
                ></div>
                Category *
              </Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedMethod("");
                    setFormData({});
                    updateEntry("category", e.target.value);
                  }}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px",
                    cursor: "pointer",
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
          </FormRow>
        </div>
        {/* Method Selection (for mobile category) */}
        {selectedCategory === "mobile" && availableMethods.length > 0 && (
          <div className="mb-4">
            <h6
              className="mb-3"
              style={{ color: "#374151", fontWeight: "600" }}
            >
              Method Selection
            </h6>
            <Row className="g-4">
              <Col md={6}>
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
                        backgroundColor: "#8b5cf6",
                      }}
                    ></div>
                    Method *
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Select
                      value={selectedMethod}
                      onChange={(e) => {
                        setSelectedMethod(e.target.value);
                        setFormData({});
                      }}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Choose method...</option>
                      {availableMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
{console.log(formFields,"formFieldsformFields")}
        {/* Dynamic Form Fields */}
        {formFields.length > 0 && (
          <div className="mb-4">
            <h6
              className="mb-3"
              style={{ color: "#374151", fontWeight: "600" }}
            >
              Emission Details
            </h6>
            <Row className="g-4">
              {formFields.map((field) => renderFormField(field))}
            </Row>
          </div>
        )}

        {/* Calculation Results */}
        {/* {formData.activityAmount && ( */}
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
            {/* <EmissionCalculationResults
              results={{}}
              consumption={formData.activityAmount}
              category={selectedCategory}
              updateEntry={updateEntry}
            /> */}

            <EmissionCalculationResults
              consumption={formData.activityAmount}
              category={selectedCategory}
              selectedMethod={selectedMethod}
              formData={formData}
              scope1Data={scope1Data}
              ghgProtocol={ghgProtocol}
            />
          </div>
        {/* )} */}
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

export default EmissionEntryModal;
