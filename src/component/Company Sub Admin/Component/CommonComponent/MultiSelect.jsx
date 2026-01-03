import React, { useState, useEffect, useRef } from "react";

const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  label,
  icon,
  activeTab,
  autoSelectAll = true, // Default to true for auto-selection
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const hasInitialized = useRef(false);

  // Auto-select all options when component mounts or options change
  useEffect(() => {
    if (
      autoSelectAll &&
      options.length > 0 &&
      selectedValues.length == 0 &&
      !hasInitialized.current
    ) {
      hasInitialized.current = true;
      onChange(options.map((opt) => opt.value));
    }
  }, [options, autoSelectAll]); // Removed selectedValues from dependencies to prevent loops

  // Reset initialization flag when options change significantly
  useEffect(() => {
    if (options.length == 0) {
      hasInitialized.current = false;
    }
  }, [options.length]);

  // Close dropdown when activeTab changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setSearchTerm(""); // Clear search when tab changes
  }, [activeTab]);

  // Filter options based on search term
  const filteredOptions = (options || []).filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const handleOptionToggle = (optionValue) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    if (selectedValues.length == options.length) {
      // If all are selected, deselect all (including unchecking all individual items)
      onChange([]);
    } else {
      // If not all are selected, select all
      onChange(options.map((opt) => opt.value));
    }
  };

  const handleSelectAllFiltered = () => {
    const filteredValues = filteredOptions.map((opt) => opt.value);
    const selectedFromFiltered = selectedValues.filter((val) =>
      filteredValues.includes(val)
    );

    if (selectedFromFiltered.length == filteredOptions.length) {
      // Deselect all filtered options
      onChange(selectedValues.filter((val) => !filteredValues.includes(val)));
    } else {
      // Select all filtered options
      const newSelected = [...new Set([...selectedValues, ...filteredValues])];
      onChange(newSelected);
    }
  };

  const clearSelection = () => {
    onChange([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const isAllSelected =
    selectedValues.length == options.length && options.length > 0;

  const isAllFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => selectedValues.includes(opt.value));

  const getDisplayText = () => {
    if (selectedValues.length == 0) return placeholder;
    
    // Only show "ALL" when there are multiple options AND all are selected
    if (selectedValues.length == options.length && options.length > 1)
      return `🌐 ALL ${label.toUpperCase()}`;
    
    // For single selection, always show the actual label
    if (selectedValues.length == 1) {
      const selectedOption = options.find(
        (opt) => opt.value == selectedValues[0]
      );
      return selectedOption ? selectedOption.label : `1 ${label} Selected`;
    }
    
    return `${selectedValues.length} ${label} Selected`;
  };

  const dropdownStyles = `
    .dropdown-toggle::after {
      display: none !important;
    }
    .dropdown-menu {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
    }
    .dropdown-item-custom:hover {
      background-color: #f9fafb !important;
    }
    .search-input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  `;

  return (
    <div
      style={{
        minWidth: "200px",
        flex: "1",
        position: "relative",
        zIndex: isDropdownOpen ? "9999" : "auto",
      }}
    >
      <style>{dropdownStyles}</style>

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "700",
          color: "#374151",
          fontSize: "14px",
        }}
      >
        {icon} {label}
      </label>

      <div style={{ position: "relative" }}>
        <div
          className={`dropdown ${isDropdownOpen ? "show" : ""}`}
          style={{ width: "100%" }}
        >
          <button
            type="button"
            className={`btn dropdown-toggle d-flex align-items-center justify-content-between w-100 ${
              isDropdownOpen ? "show" : ""
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: isDropdownOpen
                ? "2px solid #6366f1"
                : "2px solid #e5e7eb",
              fontSize: "14px",
              background: "#fff",
              transition: "all 0.2s ease",
              boxShadow: isDropdownOpen
                ? "0 4px 12px rgba(99, 102, 241, 0.15)"
                : "0 2px 8px rgba(0,0,0,0.05)",
              textAlign: "left",
              color: selectedValues.length > 0 ? "#374151" : "#9ca3af",
              position: "relative",
              zIndex: isDropdownOpen ? "9999" : "auto",
            }}
          >
            <span style={{ flex: 1 }}>{getDisplayText()}</span>
            <span
              style={{
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                color: "#6b7280",
                marginLeft: "8px",
              }}
            >
              ▲
            </span>
          </button>

          {isDropdownOpen && (
            <div
              className="dropdown-menu show"
              style={{
                width: "100%",
                maxHeight: "350px",
                overflowY: "auto",
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "4px",
                zIndex: 9998,
                backgroundColor: "#fff",
              }}
            >
              {/* Header with Clear and Close */}
              <div
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f9fafb",
                }}
              >
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  disabled={selectedValues.length == 0}
                  style={{
                    fontSize: "12px",
                    color: selectedValues.length == 0 ? "#9ca3af" : "#6366f1",
                    textDecoration: "none",
                    fontWeight: "500",
                    cursor:
                      selectedValues.length == 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setIsDropdownOpen(false)}
                  style={{
                    fontSize: "12px",
                    color: "#6366f1",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Close
                </button>
              </div>

              {/* Search Bar */}
              <div
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSearchTerm(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "100%",
                      padding: "8px 32px 8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      transition:
                        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    🔍
                  </span>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearch();
                      }}
                      style={{
                        position: "absolute",
                        right: "30px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "none",
                        background: "none",
                        color: "#6b7280",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "0",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Select All Option - Only show when there are more than 1 option */}
              {filteredOptions.length > 1 && (
                <div
                  className="dropdown-item-custom"
                  onClick={(e) => {
                    e.stopPropagation();
                    searchTerm ? handleSelectAllFiltered() : handleSelectAll();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "10px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={searchTerm ? isAllFilteredSelected : isAllSelected}
                    onChange={() => {}}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#6366f1",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    🌐{" "}
                    {searchTerm
                      ? `ALL FILTERED ${label.toUpperCase()}`
                      : `ALL ${label.toUpperCase()}`}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginLeft: "auto",
                    }}
                  >
                    ({searchTerm ? filteredOptions.length : options.length})
                  </span>
                </div>
              )}

              {/* Options List */}
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const optionCount = option.count || 0;

                return (
                  <div
                    key={option.value}
                    className="dropdown-item-custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionToggle(option.value);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      padding: "10px 12px",
                      fontSize: "14px",
                      backgroundColor: isSelected ? "#f0f4ff" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleOptionToggle(option.value);
                      }}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "#6366f1",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        flex: 1,
                      }}
                    >
                      {option.label}
                    </span>
                    {optionCount > 0 && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        ({optionCount})
                      </span>
                    )}
                  </div>
                );
              })}

              {/* No Results Message */}
              {searchTerm && filteredOptions.length == 0 && (
                <div
                  style={{
                    padding: "20px 12px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  No {label.toLowerCase()} found matching "{searchTerm}"
                  <br />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearch();
                    }}
                    style={{
                      marginTop: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      color: "#6366f1",
                      background: "none",
                      border: "1px solid #6366f1",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* No Options Available */}
              {options.length == 0 && (
                <div
                  style={{
                    padding: "20px 12px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  No options available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;