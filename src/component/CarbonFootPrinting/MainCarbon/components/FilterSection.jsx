import { Button, Col, Form, Row } from "react-bootstrap"
import { useMemo } from "react"
import MultiSelect from "../../../Company Sub Admin/Component/CommonComponent/MultiSelect"

const FilterSection = ({
  selectedScope,
  selectedFinancialYear,
  setSelectedFinancialYear,
  financialYearOptions,
  selectedFilterCategory,
  setSelectedFilterCategory,
  selectedFilterScope3Categories,
  setSelectedFilterScope3Categories,
  selectedFilterDefraScope3Activities,
  setSelectedFilterDefraScope3Activities,
  categories,
  scope3Categories,
  defraScope3Activities,
  selectedLocation,
  setSelectedLocation,
  locationOptions,
  selectedFilterPeriod,
  setSelectedFilterPeriod,
  timePeriodOptions,
  handleFilterApply,
  handleFilterReset,
  activeTab = 0,
  hideActionButtons = false,
  isModal = false
}) => {
  // Format options for basic dropdowns
  const formatCategoryOptions = useMemo(() =>
    categories?.map(category => ({
      value: String(category.id),
      label: String(category.label)
    })) || [], [categories]
  )

  const formatScope3CategoryOptions = useMemo(() =>
    Object.values(scope3Categories)?.map(category => ({
      value: String(category.id),
      label: `${category.name} (Category ${category.category_number})`
    })) || [], [scope3Categories]
  )

  const formatDefraScope3ActivityOptions = useMemo(() =>
    defraScope3Activities?.map(activity => ({
      value: String(activity),
      label: String(activity)
    })) || [], [defraScope3Activities]
  )

  const formatPeriodOptions = useMemo(() =>
    timePeriodOptions?.map(option => ({
      value: String(option.value),
      label: String(option.label),
      fromDate: option.fromDate,
    })) || [], [timePeriodOptions]
  )

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
        <Row
          className="g-4"
          style={{
            ...(isModal ? modalStyles.filterRow : {}),
            marginBottom: "214px",
          }}
        >

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
                {financialYearOptions?.map((fy) => (
                  <option key={fy.value} value={fy.value}>
                    {fy.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Categories */}
          {selectedScope !== 'SCOPE3' && (
            <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
              <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
                <MultiSelect
                  options={formatCategoryOptions}
                  selectedValues={selectedFilterCategory}
                  onChange={setSelectedFilterCategory}
                  placeholder="Select Categories..."
                  label="Categories"
                  icon="🏷️"
                  activeTab={activeTab}
                  autoSelectAll={false}
                  isModal={isModal}
                />
              </div>
            </Col>
          )}


          {/* Locations */}
          <Col md={isModal ? 6 : 3} lg={isModal ? 3 : 3}>
            <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
              <MultiSelect
                options={locationOptions}
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
           { selectedScope === 'SCOPE3' &&  <><Col md={isModal ? 6 : 3} lg={isModal ? 6 : 3}>
              <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
                <MultiSelect
                  options={formatScope3CategoryOptions}
                  selectedValues={selectedFilterScope3Categories}
                  onChange={setSelectedFilterScope3Categories}
                  placeholder="Select Scope3 Categories..."
                  label="Scope3 Categories"
                  icon="🏷️"
                  activeTab={activeTab}
                  autoSelectAll={false}
                  isModal={isModal}
                />
              </div>
            </Col>
            <Col md={isModal ? 6 : 3} lg={isModal ? 6 : 3}>
              <div className={isModal ? "modal-multiselect" : "enhanced-multiselect"}>
                <MultiSelect
                  options={formatDefraScope3ActivityOptions}
                  selectedValues={selectedFilterDefraScope3Activities}
                  onChange={setSelectedFilterDefraScope3Activities}
                  placeholder="Select Defra Scope3 Activity..."
                  label="Defra Scope3 Activity"
                  icon="🏷️"
                  activeTab={activeTab}
                  autoSelectAll={false}
                  isModal={isModal}
                />
              </div>
            </Col> </>}
        </Row>

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