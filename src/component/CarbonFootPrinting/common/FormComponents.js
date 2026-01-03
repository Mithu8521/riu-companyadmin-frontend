import React from "react";
import { Form } from "react-bootstrap";
import SearchableSelect from "../utils/SearchableSelect"; // Import your SearchableSelect component

// Form Row Component for layout
export const FormRow = ({ children, gap = 4, className = "" }) => (
  <div className={`row g-${gap} mb-${gap} ${className}`}>
    {children}
  </div>
);

// Helper function to create SearchableSelect props
export const createSearchableSelectProps = (
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  colorIndicator,
  getOptionLabel,
  getOptionValue,
  dependsOn = null
) => {
  // Transform options to work with SearchableSelect
  const transformedOptions = options.map(option => ({
    value: getOptionValue(option),
    label: getOptionLabel(option)
  }));

  // Create field object for SearchableSelect
  const field = {
    name: label.toLowerCase().replace(/\s+/g, '_'),
    label: label,
    required: required,
    colorIndicator: colorIndicator,
    dependsOn: dependsOn
  };

  // Common style for SearchableSelect
  const commonStyle = {
    backgroundColor: disabled ? "#f8fafc" : "white",
    borderRadius: "8px",
    fontSize: "0.9rem",
    height: "44px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };

  // Update form data function
  const updateFormData = (fieldName, selectedValue) => {
    onChange(selectedValue);
  };

  return {
    field,
    value,
    options: transformedOptions,
    isDisabled: disabled,
    updateFormData,
    formFields: [],
    commonStyle
  };
};

// Financial Year Component
export const FinancialYearField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
}) => {
  const props = createSearchableSelectProps(
    "Financial Year",
    String(value),
    onChange,
    options,
    required,
    disabled,
    "#3b82f6", // blue
    (option) => option.label,
    (option) => option.value
  );

  return <SearchableSelect {...props} />;
};

// Location Component
export const LocationField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
}) => {
  const props = createSearchableSelectProps(
    "Location",
    value,
    onChange,
    options,
    required,
    disabled,
    "#10b981", // green
    (option) => option.label,
    (option) => option.value
  );


  return <SearchableSelect {...props} />;
};

export const PeriodsField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
}) => {
  const props = createSearchableSelectProps(
    "Period",
    value,
    onChange,
    options,
    required,
    disabled,
    "#10b981", // green
    (option) => option.label,
    (option) => option.value
  );


  return <SearchableSelect {...props} />;
};

const BaseSelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Choose",
  required = false,
  disabled = false,
  colorIndicator = "#3b82f6",
  getOptionLabel,
  getOptionValue,
  className = "",
}) => {
  return (
    <Form.Group className={className}>
      <Form.Label
        className="fw-semibold mb-2 d-flex align-items-center"
        style={{ color: "#1e293b", fontSize: "0.9rem" }}
      >
        <div
          className="rounded-circle me-2"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: colorIndicator,
          }}
        ></div>
        {label} {required && "*"}
      </Form.Label>
      <div className="position-relative">
        <Form.Select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="border-2 py-2 ps-3 pe-4"
          style={{
            backgroundColor: disabled ? "#f8fafc" : "white",
            borderRadius: "8px",
            fontSize: "0.9rem",
            height: "44px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <option value="">
            {disabled ? `Select ${label.toLowerCase()} first` : `${placeholder} ${label.toLowerCase()}...`}
          </option>
          {options?.map((option, index) => (
            <option key={getOptionValue(option) || index} value={getOptionValue(option)}>
              {getOptionLabel(option)}
            </option>
          ))}
        </Form.Select>
      </div>
    </Form.Group>
  );
};

export const LocationFields = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  levelName,
}) => (
  <BaseSelectField
    label= {levelName || "Location"}
    value={value}
    onChange={onChange}
    options={options}
    placeholder="Choose"
    required={required}
    disabled={disabled}
    colorIndicator="#10b981" // green
    getOptionLabel={(location) => 
      location?.unitCode || 
      `${location?.location?.area || ""}, ${location?.location?.city || ""}`.trim() ||
      location?.name ||
      "Unknown Location"
    }
    getOptionValue={(location) => location.id}
    className={className}
  />
);

export const CategoryFieldEnhanced = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  onCategoryChange = null,
  isEditable = true, // Add isEditable prop
}) => {
  // Calculate the actual value with fallbacks
  const actualValue = value || "";

  const handleChange = (selectedValue) => {
    onChange(selectedValue);
    if (onCategoryChange) {
      onCategoryChange(selectedValue);
    }
  };

  const props = createSearchableSelectProps(
    "Category",
    actualValue,
    handleChange,
    options,
    required,
    !isEditable || disabled, // Use isEditable logic
    "#f59e0b", // orange/warning
    (option) => option.label,
    (option) => option.id
  );

  return <SearchableSelect {...props} />;
};

// Period Component
export const PeriodField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  onPeriodChange = null, // Additional handler for period-specific logic
}) => {
  const handleChange = (selectedValue) => {
    onChange(selectedValue);
    if (onPeriodChange) {
      onPeriodChange(selectedValue);
    }
  };

  const props = createSearchableSelectProps(
    "Period",
    value,
    handleChange,
    options,
    required,
    disabled,
    "#06b6d4", // cyan
    (option) => option.label,
    (option) => option.value
  );

  return <SearchableSelect {...props} />;
};

// Activity Component
export const ActivityField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  onActivityChange = null, // Additional handler for activity-specific logic
}) => {
  const handleChange = (selectedValue) => {
    onChange(selectedValue);
    if (onActivityChange) {
      onActivityChange(selectedValue);
    }
  };

  const props = createSearchableSelectProps(
    "Activity",
    value,
    handleChange,
    options,
    required,
    disabled,
    "#f59e0b", // orange/warning
    (option) => option.name,
    (option) => option.name
  );

  return <SearchableSelect {...props} />;
};

// Unit Component
export const UnitField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  dependsOn = null, // Field this depends on (e.g., activity)
}) => {
  const props = createSearchableSelectProps(
    "Unit",
    value,
    onChange,
    options,
    required,
    disabled || !dependsOn,
    "#ef4444", // red/danger
    (option) => option.unit,
    (option) => option.unit,
    dependsOn
  );

  return <SearchableSelect {...props} />;
};

// Category Component
export const CategoryField = ({
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  className = "",
  onCategoryChange = null, // Additional handler for category-specific logic
}) => {
  const handleChange = (selectedValue) => {
    onChange(selectedValue);
    if (onCategoryChange) {
      onCategoryChange(selectedValue);
    }
  };

  const props = createSearchableSelectProps(
    "Category",
    value,
    handleChange,
    options,
    required,
    disabled,
    "#f59e0b", // orange/warning
    (option) => option.label,
    (option) => option.id
  );

  return <SearchableSelect {...props} />;
};

// Input Field Component for Consumption
export const ConsumptionField = ({
  value,
  onChange,
  required = true,
  disabled = false,
  className = "",
  dependsOn = null,
  placeholder = "Enter consumption value",
  level = 'Consumption'
}) => {
  return (
    <div className="col-md-6">
      <div className={className}>
        <label
          className="fw-semibold mb-2 d-flex align-items-center"
          style={{ color: "#1e293b", fontSize: "0.9rem" }}
        >
          <div
            className="rounded-circle me-2"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#8b5cf6", // purple
            }}
          ></div>
          {level} {required && "*"}
        </label>
        <input
          type="number"
          className="form-control border-2 py-2 px-3"
          placeholder={dependsOn ? placeholder : "Select unit first"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            backgroundColor: (!disabled) ? "white" : "#f8fafc",
            borderRadius: "8px",
            fontSize: "0.9rem",
            height: "44px",
            cursor: (disabled) ? "not-allowed" : "text",
            opacity: (disabled) ? 0.6 : 1,
          }}
        />
      </div>
    </div>
  );
};