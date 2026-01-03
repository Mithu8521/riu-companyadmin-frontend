import { Button, Col, Form, Row } from "react-bootstrap"
import { useMemo, useCallback } from "react"
import MultiSelect from "../../../Company Sub Admin/Component/CommonComponent/MultiSelect"

const FilterSection = ({
  selectedFinancialYear,
  setSelectedFinancialYear,
  financialYears,
  selectedFilterCategory,
  setSelectedFilterCategory,
  categories,
  selectedLocation,
  setSelectedLocation,
  locations,
  selectedFilterPeriod,
  setSelectedFilterPeriod,
  timePeriodOptions,
  // Dynamic category-specific filters
  selectedCategoryFilters,
  setSelectedCategoryFilters,
  scope1Data,
  handleFilterApply,
  handleFilterReset,
  activeTab = 0,
  hideActionButtons = false,
  ghgProtocol,
  isModal = false // Add this prop to detect modal mode
}) => {
  
  // Format options for basic dropdowns
  const formatCategoryOptions = useMemo(() => 
    categories?.map(category => ({
      value: category.id,
      label: category.label
    })) || [], [categories]
  )

  const formatLocationOptions = useMemo(() => 
    locations?.map(location => ({
      value: location.id,
      label: location?.unitCode || `${location?.location?.area || ""}, ${location?.location?.city || ""}`.trim()
    })) || [], [locations]
  )

  const formatPeriodOptions = useMemo(() => 
    timePeriodOptions?.map(option => ({
      value: option.value,
      label: option.label,
      fromDate: option.fromDate,
    })) || [], [timePeriodOptions]
  )

  // Safe JSON parsing utility
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

  // Get dynamic filter options for each category using scope1Data
  const getDynamicFilterOptions = useCallback((categoryKey, filterField) => {
    if (!scope1Data?.[categoryKey]) return [];

    const categoryData = scope1Data[categoryKey];
    
    // For mobile category with multiple methods
    if (categoryKey === "mobile" && categoryData[ghgProtocol]?.data) {
      const allOptions = new Set();
      
      Object.values(categoryData[ghgProtocol].data).forEach(methodData => {
        if (methodData.dependencyTree?.[filterField]) {
          const fieldOptions = methodData.dependencyTree[filterField];
          
          if (Array.isArray(fieldOptions)) {
            fieldOptions.forEach(option => allOptions.add(option));
          } else if (typeof fieldOptions === "object") {
            Object.values(fieldOptions).forEach(optionGroup => {
              if (Array.isArray(optionGroup)) {
                optionGroup.forEach(option => allOptions.add(option));
              }
            });
          }
        }
      });
      
      return Array.from(allOptions).map(option => ({
        value: option,
        label: option
      }));
    }

    // For other categories with single method structure
    if (categoryData[ghgProtocol]?.dependencyTree?.[filterField]) {
      const fieldOptions = categoryData[ghgProtocol].dependencyTree[filterField];
      
      if (Array.isArray(fieldOptions)) {
        return fieldOptions.map(option => ({
          value: option,
          label: option
        }));
      } else if (typeof fieldOptions === "object") {
        const allOptions = new Set();
        Object.values(fieldOptions).forEach(optionGroup => {
          if (Array.isArray(optionGroup)) {
            optionGroup.forEach(option => allOptions.add(option));
          }
        });
        return Array.from(allOptions).map(option => ({
          value: option,
          label: option
        }));
      }
    }

    return [];
  }, [scope1Data, ghgProtocol]);

  // Get available filter fields for a category
  const getCategoryFilterFields = useCallback((categoryKey) => {
    if (!scope1Data?.[categoryKey]) return [];

    const categoryData = scope1Data[categoryKey];
    const fields = [];

    // For mobile category with multiple methods
    if (categoryKey === "mobile" && categoryData[ghgProtocol]?.data) {
      const allFields = new Set();
      
      Object.values(categoryData[ghgProtocol].data).forEach(methodData => {
        if (methodData.frontendFields?.fields) {
          methodData.frontendFields.fields.forEach(field => {
            if (field.type === "dropdown" && !field.name.includes("Unit")) {
              allFields.add(JSON.stringify({
                name: field.name,
                label: field.label,
                type: field.type
              }));
            }
          });
        }
      });
      
      return Array.from(allFields).map(fieldStr => JSON.parse(fieldStr));
    }

    // For other categories
    if (categoryData[ghgProtocol]?.frontendFields?.fields) {
      return categoryData[ghgProtocol].frontendFields.fields.filter(field => 
        field.type === "dropdown" && !field.name.includes("Unit")
      );
    }

    return fields;
  }, [scope1Data, ghgProtocol]);

  // Handler for category change with filter reset
  const handleCategoryChange = useCallback((values) => {
    setSelectedFilterCategory(values);
    
    // Reset category-specific filters when categories change
    const newCategoryFilters = {};
    values.forEach(categoryKey => {
      newCategoryFilters[categoryKey] = {};
    });
    setSelectedCategoryFilters(newCategoryFilters);
  }, [setSelectedFilterCategory, setSelectedCategoryFilters]);

  // Handler for dynamic category filter changes
  const handleCategoryFilterChange = useCallback((categoryKey, fieldName, values) => {
    setSelectedCategoryFilters(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [fieldName]: values
      }
    }));
  }, [setSelectedCategoryFilters]);

  // Get selected categories
  const selectedCategories = Array.isArray(selectedFilterCategory) ? selectedFilterCategory : [];

  // Render dynamic category filters
  const renderCategoryFilters = useCallback((categoryKey) => {
    const filterFields = getCategoryFilterFields(categoryKey);
    if (filterFields.length === 0) return null;

    const categoryLabels = {
      stationary: { label: "Stationary Combustion", icon: "🏭", color: "#3b82f6" },
      mobile: { label: "Mobile Combustion", icon: "🚛", color: "#22c55e" },
      fugitive: { label: "Fugitive Emissions", icon: "❄️", color: "#a855f7" }
    };

    const categoryInfo = categoryLabels[categoryKey] || { 
      label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1), 
      icon: "🏷️", 
      color: "#6b7280" 
    };

    return (
      <div className="mt-4" key={categoryKey}>
        <div 
          className="rounded-3 p-4"
          style={{
            background: `linear-gradient(135deg, ${categoryInfo.color}0D 0%, ${categoryInfo.color}05 100%)`,
            border: `1px solid ${categoryInfo.color}1A`,
            position: "relative"
          }}
        >
          <div className="d-flex align-items-center mb-3">
            <div 
              className="me-3 p-2 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${categoryInfo.color}, ${categoryInfo.color}CC)`,
                boxShadow: `0 4px 12px ${categoryInfo.color}4D`
              }}
            >
              <span className="text-white" style={{ fontSize: "1rem" }}>{categoryInfo.icon}</span>
            </div>
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: categoryInfo.color }}>
                {categoryInfo.label} Filters
              </h6>
              <small className="text-muted">Filter by specific attributes</small>
            </div>
          </div>
          
          <Row className="g-4">
            {filterFields.map((field) => {
              const options = getDynamicFilterOptions(categoryKey, field.name);
              const selectedValues = selectedCategoryFilters?.[categoryKey]?.[field.name] || [];
              
              return (
                <Col md={filterFields.length > 2 ? 4 : 6} key={field.name}>
                  <div className="enhanced-multiselect">
                    <MultiSelect
                      options={options}
                      selectedValues={selectedValues}
                      onChange={(values) => handleCategoryFilterChange(categoryKey, field.name, values)}
                      placeholder={`Select ${field.label}...`}
                      label={field.label}
                      icon="🔍"
                      activeTab={activeTab}
                      autoSelectAll={false}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }, [getCategoryFilterFields, getDynamicFilterOptions, selectedCategoryFilters, handleCategoryFilterChange, activeTab]);

  // Modal styles
  const getModalStyles = () => ({
    container: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      backdropFilter: "none",
      padding: "0",
      marginBottom: "0"
    },
    filterRow: {
      marginBottom: "24px"
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    select: {
      height: "44px",
      border: "1px solid #D1D5DB",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "400",
      color: "#374151",
      backgroundColor: "#ffffff",
      padding: "0 12px",
      transition: "all 0.2s ease"
    },
    actionButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "24px",
      paddingTop: "24px",
      borderTop: "1px solid #E5E7EB"
    },
    resetButton: {
      height: "44px",
      padding: "0 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "8px",
      border: "1px solid #D1D5DB",
      backgroundColor: "#ffffff",
      color: "#6B7280",
      cursor: "pointer",
      transition: "all 0.2s ease"
    },
    applyButton: {
      height: "44px",
      padding: "0 24px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#3B82F6",
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }
  });

  const modalStyles = isModal ? getModalStyles() : {};

  return (
    <>
      {/* Filter Container */}
      <div 
        className="filter-container"
        style={isModal ? modalStyles.container : {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "16px"
        }}
      >
    

        {/* Main Filter Row */}
        <Row className="g-4" style={isModal ? modalStyles.filterRow : {}}>
          {/* Financial Year */}
          <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
            <Form.Group>
              <Form.Label style={isModal ? modalStyles.label : {
                color: "#475569",
                fontSize: "0.9rem",
                letterSpacing: "0.025em",
                fontWeight: "600",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📅 Financial Year
              </Form.Label>
              <Form.Select
                value={selectedFinancialYear}
                onChange={(e) => setSelectedFinancialYear(e.target.value)}
                style={isModal ? modalStyles.select : {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  height: "48px",
                  fontWeight: "500",
                  color: "#334155",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  paddingLeft: "16px"
                }}
              >
                <option value="">Choose financial year...</option>
                {financialYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.financial_year_value}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Categories */}
          <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
            <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
              <MultiSelect
                options={formatCategoryOptions}
                selectedValues={selectedFilterCategory || []}
                onChange={handleCategoryChange}
                placeholder="Select Categories..."
                label="Categories"
                icon="🏷️"
                activeTab={activeTab}
                autoSelectAll={false}
                isModal={isModal}
              />
            </div>
          </Col>

          {/* Locations */}
          <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
            <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
              <MultiSelect
                options={formatLocationOptions}
                selectedValues={selectedLocation || []}
                onChange={setSelectedLocation}
                placeholder="Select Locations..."
                label="Locations"
                icon="📍"
                activeTab={activeTab}
                autoSelectAll={false}
                isModal={isModal}
              />
            </div>
          </Col>

          {/* Periods */}
          <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
            <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
              <MultiSelect
                options={formatPeriodOptions}
                selectedValues={selectedFilterPeriod || []}
                onChange={setSelectedFilterPeriod}
                placeholder="Select Periods..."
                label="Periods"
                icon="📅"
                activeTab={activeTab}
                autoSelectAll={false}
                isModal={isModal}
              />
            </div>
          </Col>
        </Row>

        {/* Dynamic Category-Specific Filters */}
        {selectedCategories.map(categoryKey => renderCategoryFilters(categoryKey))}

        {/* Action Buttons */}
        {!hideActionButtons && (
          <div style={isModal ? {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #E5E7EB"
          } : { 
            marginTop: "24px" 
          }}>
            {isModal ? (
              <>
                <Button
                  onClick={() => {
                    console.log('Reset Filters button clicked');
                    handleFilterReset();
                  }}
                  variant="outline-secondary"
                  style={{
                    height: "44px",
                    padding: "0 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#ffffff",
                    color: "#6B7280"
                  }}
                >
                  Reset Filters
                </Button>
                
                <div className="d-flex gap-3">
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent('closeFilterModal'))}
                    variant="secondary"
                    style={{
                      height: "44px",
                      padding: "0 20px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "8px",
                      backgroundColor: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      color: "#374151"
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={() => {
                      console.log('Apply Filters button clicked');
                      handleFilterApply();
                      window.dispatchEvent(new CustomEvent('applyFilterModal'));
                    }}
                    variant="primary"
                    style={{
                      height: "44px",
                      padding: "0 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      borderRadius: "8px",
                      backgroundColor: "#6B9DC0",
                      border: "none"
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </>
            ) : (
              <Row className="g-3">
                <Col md={12} className="d-flex align-items-center justify-content-end">
                  <Button
                    onClick={() => {
                      console.log('Reset Filters button clicked');
                      handleFilterReset();
                    }}
                    style={{
                      height: "48px",
                      padding: "0 24px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      color: "#64748b",
                      marginRight: "12px"
                    }}
                    variant="outline-secondary"
                  >
                    🔄 Reset Filters
                  </Button>
                  
                  <Button
                    onClick={() => {
                      console.log('Apply Filters button clicked');
                      handleFilterApply();
                    }}
                    style={{
                      height: "48px",
                      padding: "0 28px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
                      border: "none",
                      borderRadius: "12px"
                    }}
                    variant="primary"
                  >
                    ✨ Apply Filters
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        )}
      </div>

      {/* Conditional Styles */}
      <style jsx>{`
        ${isModal ? `
          .modal-multiselect {
            position: relative !important;
          }
          
          .modal-multiselect .multiselect-container {
            height: 44px !important;
            border: 1px solid #D1D5DB !important;
            border-radius: 8px !important;
            background: #ffffff !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            color: #374151 !important;
            padding: 0 12px !important;
            box-shadow: none !important;
            transition: all 0.2s ease !important;
            position: relative !important;
            z-index: 1001 !important;
          }
          
          .modal-multiselect .multiselect-dropdown,
          .modal-multiselect .multiselect-dropdown-list,
          .modal-multiselect .dropdown-menu {
            position: absolute !important;
            z-index: 9999 !important;
            background: #ffffff !important;
            border: 1px solid #D1D5DB !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }
          
          .modal-multiselect .multiselect-container:hover {
            border-color: #9CA3AF !important;
            transform: none !important;
            box-shadow: none !important;
          }
          
          .modal-multiselect .multiselect-container:focus-within {
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            transform: none !important;
          }
          
          .modal-multiselect label {
            color: #374151 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            margin-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }
        ` : `
          .enhanced-multiselect {
            position: relative !important;
            z-index: 100 !important;
          }
          
          .enhanced-multiselect .multiselect-container {
            border-radius: 12px !important;
            border: none !important;
            background: rgba(255, 255, 255, 0.9) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            height: 48px !important;
            font-weight: 500 !important;
            position: relative !important;
            z-index: 101 !important;
          }
          
          .enhanced-multiselect .multiselect-dropdown,
          .enhanced-multiselect .multiselect-dropdown-list,
          .enhanced-multiselect .dropdown-menu {
            position: absolute !important;
            z-index: 999 !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 25px rgba(116, 148, 167, 0.25) !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }
          
          .enhanced-multiselect .multiselect-container:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15) !important;
          }
          
          .enhanced-multiselect .multiselect-container:focus-within {
            transform: translateY(-1px) !important;
            box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15), 0 0 0 3px rgba(116, 148, 167, 0.1) !important;
          }
          
          .enhanced-multiselect label {
            color: #475569 !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            letter-spacing: 0.025em !important;
            margin-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }
        `}
        
        /* High z-index for all multiselect dropdowns */
        .multiselect-dropdown,
        .multiselect-dropdown-list,
        .dropdown-menu,
        .multiselect-option-list {
          z-index: 9999 !important;
          position: absolute !important;
        }
        
        /* Ensure filter container has lower z-index than dropdowns */
        .filter-container {
          position: relative !important;
          z-index: 1 !important;
        }
        
        .form-select:focus {
          outline: none !important;
          ${isModal ? `
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          ` : `
            border-color: transparent !important;
            box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15), 0 0 0 3px rgba(116, 148, 167, 0.1) !important;
          `}
        }
        
        /* Specific z-index for modal mode */
        ${isModal ? `
          .modal-multiselect .multiselect-container.open,
          .modal-multiselect .multiselect-container.active {
            z-index: 10000 !important;
          }
          
          .modal-multiselect .multiselect-dropdown.show,
          .modal-multiselect .multiselect-dropdown.open {
            z-index: 10001 !important;
          }
        ` : ''}
      `}</style>
    </>
  )
}

export default FilterSection