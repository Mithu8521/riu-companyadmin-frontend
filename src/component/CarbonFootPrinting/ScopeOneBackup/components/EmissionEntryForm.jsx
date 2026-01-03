import { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { FiUpload, FiEdit, FiX, FiAlertTriangle } from "react-icons/fi";
import EmissionCalculationResults from "./EmissionCalculationResults";
import {
  FormRow,
  FinancialYearField,
  LocationField,
  PeriodField,
  ConsumptionField,
} from "../../common/FormComponents";

const EmissionEntryForm = ({
  entry,
  index,
  updateEmissionEntry,
  handleSubmitData: parentHandleSubmitData,
  locations,
  timePeriodOptions,
  handlePeriodChange,
  emissionEntries,
  categories,
  financialYears,
  selectedFinancialYear,
  setSelectedFinancialYear,
  scope1Data,
  ghgProtocol,
}) => {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [duplicateEntry, setDuplicateEntry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({});
  const [fuelError, setFuelError] = useState("");

  const existingEntries = emissionEntries.filter((entry) => !entry.isNew);

  // Parse JSON safely with fallback
  const parseJsonSafely = useCallback((jsonString, fallback = {}) => {
    if (!jsonString) return fallback;
    if (typeof jsonString === "object") return jsonString;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn("Failed to parse JSON:", error);
      return fallback;
    }
  }, []);

  // Extract current entry data properly
  const currentEntry = useMemo(() => {
    if (!entry) {
      return {
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
    }

    // Parse inputDetails and calculationDetails if they exist
    let inputDetails = {};
    let calculationDetails = {};

    if (entry.inputDetails) {
      inputDetails = parseJsonSafely(entry.inputDetails);
    }
    if (entry.calculationDetails) {
      calculationDetails = parseJsonSafely(entry.calculationDetails);
    }

    // Merge all data sources with proper precedence
    return {
      // Database fields
      id: entry.id,
      financialYearId: entry.financialYearId,
      sourceId: entry.sourceId,
      subLocationId: entry.subLocationId,
      period: entry.period,
      fromDate: entry.fromDate,
      toDate: entry.toDate,
      consumedAmount: entry.consumedAmount,
      unit: entry.unit,
      category: entry.category,
      method: entry.method,
      calculatedEmissions: entry.calculatedEmissions,
      isNew: entry.isNew || false,

      // Frontend compatibility fields
      location: entry.sourceId?.toString() || "",
      subLocation: entry.subLocationId?.toString() || "",
      financialYear: entry.financialYearId?.toString() || selectedFinancialYear,
      consumption: entry.consumedAmount || "",
      emission: entry.calculatedEmissions || "",

      // Fields from inputDetails (form data)
      ...inputDetails,

      // Fields from calculationDetails (calculation data)
      calculationResults: calculationDetails,

      // Override with any direct entry properties
      ...Object.fromEntries(
        Object.entries(entry).filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
      ),
    };
  }, [entry, parseJsonSafely, selectedFinancialYear]);

  // Initialize form data from existing entry data
  useEffect(() => {
    if (currentEntry && !currentEntry.isNew) {
      // For existing entries, populate formData with saved values
      const inputDetails = parseJsonSafely(entry?.inputDetails);
      setFormData(inputDetails);
      setSelectedCategory(inputDetails.category || currentEntry.category || "");
      setSelectedMethod(inputDetails.method || currentEntry.method || "");
    } else {
      // For new entries, start with empty form
      setFormData({});
      setSelectedCategory("");
      setSelectedMethod("");
    }
  }, [currentEntry?.id, entry?.inputDetails, parseJsonSafely]);

  // Get methods for selected category (mobile has multiple methods)
  const availableMethods = useMemo(() => {
    const inputDetails = parseJsonSafely(entry?.inputDetails);
    const categoryToCheck =
      selectedCategory || inputDetails.category || currentEntry.category;
    if (!categoryToCheck || !scope1Data?.[categoryToCheck]) return [];

    const categoryData = scope1Data[categoryToCheck][ghgProtocol];

    // For mobile category, extract method keys from data
    if (
      categoryToCheck === "mobile" &&
      categoryData.data &&
      typeof categoryData.data === "object"
    ) {
      return Object.keys(categoryData.data).map((methodKey) => ({
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
  }, [
    selectedCategory,
    currentEntry.category,
    scope1Data,
    entry?.inputDetails,
    parseJsonSafely,
  ]);

  // Get form fields dynamically based on selected category and method
  const formFields = useMemo(() => {
    const inputDetails = parseJsonSafely(entry?.inputDetails);
    const categoryToCheck =
      selectedCategory || inputDetails.category || currentEntry.category;
    if (!categoryToCheck || !scope1Data?.[categoryToCheck]) return [];

    let fieldsData;
    const methodToCheck =
      selectedMethod || inputDetails.method || currentEntry.method;

    if (categoryToCheck === "mobile" && methodToCheck) {
      fieldsData =
        scope1Data[categoryToCheck][ghgProtocol].data[methodToCheck]
          ?.frontendFields;
    } else {
      fieldsData = scope1Data[categoryToCheck][ghgProtocol].frontendFields;
    }

    return fieldsData?.fields || [];
  }, [
    selectedCategory,
    selectedMethod,
    currentEntry.category,
    currentEntry.method,
    scope1Data,
    entry?.inputDetails,
    parseJsonSafely,
  ]);

  // Get dropdown options using the backend dependency tree
  const getDropdownOptions = useCallback(
    (fieldName, categoryKey, methodKey = null) => {
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
    },
    [scope1Data, formFields, formData]
  );

  // Enhanced unit options handling for freight and other complex cases
  const getAvailableUnits = useCallback(
    (categoryKey, methodKey = null) => {
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
    },
    [getDropdownOptions, formData.fuel, scope1Data]
  );

  // Fallback method for getting options directly from data (for complex cases)
  const getDropdownOptionsFallback = useCallback(
    (fieldName, categoryKey, methodKey = null) => {
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
    },
    [scope1Data, formFields, formData]
  );

  // Check if field should be shown based on showWhen condition
  const shouldShowField = useCallback((field, currentFormData) => {
    if (!field.showWhen) return true;

    return Object.entries(field.showWhen).every(([key, value]) => {
      return currentFormData[key] === value;
    });
  }, []);

  // Update form data function with cascade reset
  const updateFormData = useCallback(
    (key, value) => {
      setFormData((prev) => {
        const newFormData = { ...prev, [key]: value };

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
    },
    [formFields]
  );

  // Function to check for duplicate entries
  const checkForDuplicate = useCallback(
    (entry) => {
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
      return duplicate;
    },
    [existingEntries]
  );

  const updateEntry = useCallback(
    (field, value) => {
      // Only update if value actually changed to prevent infinite loop
      if (currentEntry[field] !== value) {
        updateEmissionEntry(currentEntry.id, field, value);
      }
    },
    [currentEntry, updateEmissionEntry]
  );

  const handleSubmit = useCallback(async () => {
    if (!parentHandleSubmitData || duplicateEntry) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const entryData = {
        ...currentEntry,
        ...formData,
        category: selectedCategory || currentEntry.category,
        method: selectedMethod || currentEntry.method,
        financialYear: selectedFinancialYear,
      };

      const success = await parentHandleSubmitData(entryData);

      if (success !== false) {
        setEditingEntryId(null);
        setFormData({});
        return true;
      }

      return false;
    } catch (error) {
      setSubmitError(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    parentHandleSubmitData,
    duplicateEntry,
    currentEntry,
    formData,
    selectedCategory,
    selectedMethod,
    selectedFinancialYear,
  ]);

  // Check for duplicates whenever key fields change
  useEffect(() => {
    if (
      currentEntry.location &&
      currentEntry.period &&
      currentEntry.financialYear &&
      (selectedCategory || currentEntry.category)
    ) {
      const duplicate = checkForDuplicate({
        ...currentEntry,
        category: selectedCategory || currentEntry.category,
      });
      setDuplicateEntry(duplicate);
    } else {
      setDuplicateEntry(null);
    }
  }, [
    currentEntry.location,
    currentEntry.period,
    currentEntry.financialYear,
    selectedCategory,
    currentEntry.category,
    checkForDuplicate,
  ]);

  const renderFormField = useCallback(
    (field) => {
      const inputDetails = parseJsonSafely(entry?.inputDetails);
      // Get value from formData first, then from inputDetails, then from currentEntry
      const value =
        formData[field.name] ||
        inputDetails[field.name] ||
        currentEntry[field.name] ||
        "";
      const isDisabled =
        field.dependsOn &&
        !(
          formData[field.dependsOn] ||
          inputDetails[field.dependsOn] ||
          currentEntry[field.dependsOn]
        );
      const isEditable =
        currentEntry.isNew || editingEntryId === currentEntry.id;

      // Check if field should be shown
      if (
        !shouldShowField(field, {
          ...currentEntry,
          ...inputDetails,
          ...formData,
        })
      ) {
        return null;
      }

      const commonStyle = {
        borderRadius: "8px",
        fontSize: "0.9rem",
        height: "44px",
        backgroundColor: !isEditable || isDisabled ? "#f8fafc" : "white",
        cursor: !isEditable || isDisabled ? "not-allowed" : "pointer",
        opacity: !isEditable || isDisabled ? 0.6 : 1,
      };

      switch (field.type) {
        case "dropdown":
          let options = field.options || [];
          const categoryToCheck =
            selectedCategory || inputDetails.category || currentEntry.category;
          const methodToCheck =
            selectedMethod || inputDetails.method || currentEntry.method;

          // Get options based on field dependencies
          if (!field.options && categoryToCheck) {
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
              if (categoryToCheck === "mobile" && methodToCheck === "freight") {
                // For freight, handle specific unit types
                let dependencyTree =
                  scope1Data[categoryToCheck][ghgProtocol].data[methodToCheck]
                    ?.dependencyTree;
                const fuelValue =
                  formData.fuel || inputDetails.fuel || currentEntry.fuel;

                if (dependencyTree && fuelValue) {
                  if (
                    field.name === "weightUnit" &&
                    dependencyTree.weightUnit
                  ) {
                    options = (dependencyTree.weightUnit[fuelValue] || []).map(
                      (value) => ({ value, label: value })
                    );
                  } else if (
                    field.name === "distanceUnit" &&
                    dependencyTree.distanceUnit
                  ) {
                    options = (
                      dependencyTree.distanceUnit[fuelValue] || []
                    ).map((value) => ({ value, label: value }));
                  } else {
                    // Fallback to generic unit handling
                    options = getAvailableUnits(categoryToCheck, methodToCheck);
                  }
                }
              } else if (categoryToCheck === "fugitive") {
                // For fugitive, handle specific unit types
                let dependencyTree =
                  scope1Data[categoryToCheck][ghgProtocol].dependencyTree;
                const refrigerantValue =
                  formData.refrigerant ||
                  inputDetails.refrigerant ||
                  currentEntry.refrigerant;

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
                      dependencyTree.quantityPurchasedUnit[refrigerantValue] ||
                      []
                    ).map((value) => ({ value, label: value }));
                  } else if (
                    field.name === "quantityRecoveredUnit" &&
                    dependencyTree.quantityRecoveredUnit
                  ) {
                    options = (
                      dependencyTree.quantityRecoveredUnit[refrigerantValue] ||
                      []
                    ).map((value) => ({ value, label: value }));
                  } else {
                    // Fallback to generic unit handling
                    options = getAvailableUnits(categoryToCheck, methodToCheck);
                  }
                }
              } else {
                // Standard unit handling for other methods
                options = getAvailableUnits(categoryToCheck, methodToCheck);
              }
            } else if (field.dependsOn) {
              // Check if dependent field has a value
              const dependentValue =
                formData[field.dependsOn] ||
                inputDetails[field.dependsOn] ||
                currentEntry[field.dependsOn];
              if (dependentValue) {
                options = getDropdownOptions(
                  field.name,
                  categoryToCheck,
                  methodToCheck
                );
              } else {
                // If dependent value is not selected, show empty options
                options = [];
              }
            } else {
              // Get all available options for independent fields
              options = getDropdownOptions(
                field.name,
                categoryToCheck,
                methodToCheck
              );
            }
          }

          return (
            <Col md={4} key={field.name}>
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
                    disabled={!isEditable || isDisabled}
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
                        value={
                          typeof option === "string" ? option : option.value
                        }
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
            <Col md={4} key={field.name}>
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
                    disabled={
                      !isEditable ||
                      isDisabled ||
                      !!fuelError ||
                      !!duplicateEntry
                    }
                    className="border-2 py-2 ps-3 pe-4"
                    style={{
                      ...commonStyle,
                      backgroundColor:
                        !!fuelError ||
                        !!duplicateEntry ||
                        !isEditable ||
                        isDisabled
                          ? "#fee2e2"
                          : "white",
                      cursor:
                        !!fuelError ||
                        !!duplicateEntry ||
                        !isEditable ||
                        isDisabled
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
            <Col md={4} key={field.name}>
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
                    disabled={!isEditable || isDisabled}
                    className="border-2 py-2 ps-3 pe-4"
                    style={commonStyle}
                  />
                </div>
              </Form.Group>
            </Col>
          );
      }
    },
    [
      formData,
      currentEntry,
      shouldShowField,
      editingEntryId,
      selectedCategory,
      selectedMethod,
      scope1Data,
      formFields,
      getAvailableUnits,
      getDropdownOptions,
      updateFormData,
      fuelError,
      duplicateEntry,
      entry?.inputDetails,
      parseJsonSafely,
    ]
  );

  const isFormValid = useMemo(() => {
    const inputDetails = parseJsonSafely(entry?.inputDetails);
    const categoryToCheck =
      selectedCategory || inputDetails.category || currentEntry.category;
    return (
      currentEntry.location &&
      currentEntry.period &&
      categoryToCheck &&
      (categoryToCheck !== "mobile" ||
        selectedMethod ||
        inputDetails.method ||
        currentEntry.method) &&
      !duplicateEntry
    );
  }, [
    currentEntry.location,
    currentEntry.period,
    selectedCategory,
    currentEntry.category,
    selectedMethod,
    currentEntry.method,
    duplicateEntry,
    entry?.inputDetails,
    parseJsonSafely,
  ]);

  if (!currentEntry) return null;

  const isEditable = currentEntry.isNew || editingEntryId === currentEntry.id;

  return (
    <div
      className="mb-4 p-4 rounded-lg"
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {submitError && (
        <Alert
          variant="danger"
          className="mb-3"
          dismissible
          onClose={() => setSubmitError(null)}
        >
          {submitError}
        </Alert>
      )}

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

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-dark" style={{ fontWeight: "600" }}>
          {currentEntry.isNew ? "New Entry" : `Entry #${index}`}
        </h6>
        {!currentEntry.isNew && (
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                setEditingEntryId(
                  editingEntryId === currentEntry.id ? null : currentEntry.id
                );
                setSubmitError(null);
                if (editingEntryId === currentEntry.id) {
                  // Reset form data when canceling edit
                  const inputDetails = parseJsonSafely(entry?.inputDetails);
                  setFormData(inputDetails);
                }
              }}
              className={`btn d-flex align-items-center justify-content-center`}
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
                fontWeight: "500",
                height: "32px",
                fontSize: "0.85rem",
                minWidth: "110px",
                border:
                  editingEntryId === entry.id
                    ? "1px solid #dc3545"
                    : "1px solid #e2e6ea",
                backgroundColor:
                  editingEntryId === entry.id ? "#fff5f5" : "#fff",
                color: editingEntryId === entry.id ? "#dc3545" : "#666",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              disabled={isSubmitting}
            >
              {editingEntryId === currentEntry.id ? (
                <>
                  <FiX className="me-1" size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <FiEdit className="me-1" size={14} />
                  Edit
                </>
              )}
            </button>
            {editingEntryId === currentEntry.id && (
              <button
                className="btn d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: "6px",
                  padding: "4px 16px",
                  fontWeight: "500",
                  height: "32px",
                  fontSize: "0.85rem",
                  minWidth: "110px",
                  backgroundColor: "#10b981",
                  border: "none",
                  color: "#fff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiUpload className="me-1" size={14} />
                    Update
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Basic Information Section */}
      <div className="mb-4">
        <h6 className="mb-3" style={{ color: "#374151", fontWeight: "600" }}>
          Basic Information
        </h6>
        <FormRow>
          {/* Financial Year */}
          <FinancialYearField
            value={currentEntry.financialYear}
            onChange={(value) => {
              setSelectedFinancialYear(value);
              updateEntry("financialYear", value);
            }}
            options={financialYears}
            required={true}
            disabled={!isEditable}
          />

          {/* Location */}
          <LocationField
            value={currentEntry.location}
            onChange={(value) => updateEntry("location", value)}
            options={locations}
            required={true}
            disabled={!isEditable}
          />

          {/* Period */}
          <PeriodField
            value={currentEntry.period}
            onChange={(value) => updateEntry("period", value)}
            options={timePeriodOptions}
            required={true}
            onPeriodChange={handlePeriodChange}
            disabled={!isEditable}
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
                value={
                  selectedCategory ||
                  parseJsonSafely(entry?.inputDetails).category ||
                  currentEntry.category ||
                  ""
                }
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedMethod("");
                  setFormData({});
                  updateEntry("category", e.target.value);
                }}
                disabled={!isEditable}
                className="border-2 py-2 ps-3 pe-4"
                style={{
                  backgroundColor: isEditable ? "white" : "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                  cursor: isEditable ? "pointer" : "not-allowed",
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
      {(selectedCategory ||
        parseJsonSafely(entry?.inputDetails).category ||
        currentEntry.category) === "mobile" &&
        availableMethods.length > 0 && (
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
                      value={
                        selectedMethod ||
                        parseJsonSafely(entry?.inputDetails).method ||
                        currentEntry.method ||
                        ""
                      }
                      onChange={(e) => {
                        setSelectedMethod(e.target.value);
                        setFormData({});
                      }}
                      disabled={!isEditable}
                      className="border-2 py-2 ps-3 pe-4"
                      style={{
                        backgroundColor: isEditable ? "white" : "#f8f9fa",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        height: "44px",
                        cursor: isEditable ? "pointer" : "not-allowed",
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

      {/* Dynamic Form Fields */}
      {formFields.length > 0 && (
        <div className="mb-4">
          <h6 className="mb-3" style={{ color: "#374151", fontWeight: "600" }}>
            Emission Details
          </h6>
          <Row className="g-4">
            {formFields.map((field) => renderFormField(field))}
          </Row>
        </div>
      )}

      {/* Calculation Results */}
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
          consumption={
            formData.activityAmount ||
            parseJsonSafely(entry?.inputDetails).activityAmount
          }
          category={
            selectedCategory ||
            parseJsonSafely(entry?.inputDetails).category ||
            currentEntry.category
          }
          selectedMethod={
            selectedMethod ||
            parseJsonSafely(entry?.inputDetails).method ||
            currentEntry.method
          }
          formData={{ ...parseJsonSafely(entry?.inputDetails), ...formData }}
          scope1Data={scope1Data}
          ghgProtocol={ghgProtocol}
        />
      </div>

      {/* Save Button for New Entries */}
      {currentEntry.isNew && (
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            style={{ minWidth: "140px" }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-border spinner-border-sm me-1" />
                Saving...
              </>
            ) : (
              <>
                <FiUpload className="me-1" size={16} />
                Save Entry
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmissionEntryForm;
