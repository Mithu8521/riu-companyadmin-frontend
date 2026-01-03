import { Button, Col, Form, Row } from "react-bootstrap"
import {
  FinancialYearField,
  LocationField,
  PeriodField,
  FormRow,
} from "../../common/FormComponents"
import MultiSelect from "../../../Company Sub Admin/Component/CommonComponent/MultiSelect"

const FilterSection = ({
  selectedFinancialYear,
  setSelectedFinancialYear,
  financialYears,
  selectedLocation,
  setSelectedLocation,
  locations,
  selectedFilterPeriod,
  setSelectedFilterPeriod,
  timePeriodOptions,
  selectedActivity,
  setSelectedActivity,
  activities,
  handleFilterApply,
  handleFilterReset,
  hideActionButtons = false, // New prop to hide action buttons
}) => {
  // Format options for dropdowns
  const formatLocationOptions = locations?.map(location => ({
    value: location.id,
    label: location?.unitCode || `${location?.location?.area || ""}, ${location?.location?.city || ""}`.trim()
  })) || []

  const formatPeriodOptions = timePeriodOptions?.map(option => ({
    value: option.value,
    label: option.label,
  })) || []

  const formatActivityOptions = activities?.map(activity => ({
    value: activity.id,
    label: activity.name
  })) || []

  return (
    <>
      {/* Enhanced Filter Container */}
      <div 
        className="rounded-4 p-4 position-relative"
        style={{
          background: hideActionButtons ? "transparent" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: hideActionButtons ? "none" : "blur(20px)",
          border: hideActionButtons ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: hideActionButtons ? "none" : "0 8px 32px rgba(0, 0, 0, 0.1)",
          marginBottom: hideActionButtons ? "0" : "1rem",
        }}
      >
        {/* Subtle gradient overlay - only show when not in modal */}
        {!hideActionButtons && (
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
            style={{
              background: "linear-gradient(135deg, rgba(116, 148, 167, 0.05) 0%, rgba(60, 141, 187, 0.05) 100%)",
              pointerEvents: "none"
            }}
          ></div>
        )}

        {/* Filter Header - only show when not in modal */}
        {!hideActionButtons && (
          <div className="d-flex align-items-center mb-4 position-relative">
            <div className="me-3 p-2 rounded-xl" style={{
              background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
              boxShadow: "0 4px 12px rgba(116, 148, 167, 0.3)"
            }}>
              <span className="text-white" style={{ fontSize: "1.2rem" }}>🔍</span>
            </div>
            <div>
              <h5 className="mb-1 fw-bold" style={{
                background: "linear-gradient(135deg, #334155, #7494a7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.3rem"
              }}>
                Filter Options
              </h5>
              <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                Refine your emission data view
              </p>
            </div>
          </div>
        )}

        {/* Main Filter Row Using Common Components */}
        <div className="position-relative">
          <FormRow gap={4}>
            {/* Financial Year Field */}
            <div className="enhanced-field">
              <FinancialYearField
                value={selectedFinancialYear}
                onChange={setSelectedFinancialYear}
                options={financialYears}
                required={false}
                className=""
              />
            </div>

            {/* Location Multi-Select */}
            <div className="enhanced-multiselect">
              <MultiSelect
                options={formatLocationOptions}
                selectedValues={selectedLocation || []}
                onChange={setSelectedLocation}
                placeholder="Select Locations..."
                label="Location"
                icon="📍"
                autoSelectAll={false}
              />
            </div>
            <div className="enhanced-multiselect">
              <MultiSelect
                options={formatPeriodOptions}
                selectedValues={selectedFilterPeriod || []}
                onChange={setSelectedFilterPeriod}
                placeholder="Select Periods..."
                label="Period"
                icon="📅"
                autoSelectAll={false}
              />
            </div>

            {/* Activity Multi-Select */}
            <div className="enhanced-multiselect">
              <MultiSelect
                options={formatActivityOptions}
                selectedValues={selectedActivity || []}
                onChange={setSelectedActivity}
                placeholder="Select Activities..."
                label="Activity"
                icon="🎯"
                autoSelectAll={false}
              />
            </div>
          </FormRow>
        </div>

        {/* Enhanced Action Buttons - only show when hideActionButtons is false */}
        {!hideActionButtons && (
          <Row className="g-3 mt-4">
            <Col md={12} className="d-flex align-items-center justify-content-end">
              <Button
                onClick={() => {
                  handleFilterReset();
                }}
                className="me-3 shadow-sm"
                style={{
                  height: "48px",
                  padding: "0 24px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#64748b",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                }}
              >
                <span className="me-2">🔄</span>
                Reset Filters
              </Button>
              
              <Button
                onClick={() => {
                  console.log('Apply Filters button clicked');
                  handleFilterApply();
                }}
                className="shadow-lg"
                style={{
                  height: "48px",
                  padding: "0 28px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px) scale(1.02)";
                  e.target.style.boxShadow = "0 12px 35px rgba(116, 148, 167, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0px) scale(1)";
                  e.target.style.boxShadow = "0 8px 25px rgba(116, 148, 167, 0.3)";
                }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.6s ease"
                }}></div>
                <span className="me-2 position-relative">✨</span>
                <span className="position-relative">Apply Filters</span>
              </Button>
            </Col>
          </Row>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .enhanced-field .form-select {
          border-radius: 12px !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          height: 48px !important;
          font-weight: 500 !important;
          color: #334155 !important;
          padding-left: 16px !important;
          padding-right: 40px !important;
        }

        .enhanced-field .form-select:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15) !important;
        }

        .enhanced-field .form-select:focus {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15), 0 0 0 3px rgba(116, 148, 167, 0.1) !important;
          outline: none !important;
          border-color: transparent !important;
        }

        .enhanced-field .form-label {
          color: #475569 !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.025em !important;
          margin-bottom: 8px !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .enhanced-multiselect .multiselect-container {
          border-radius: 12px !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          height: 48px !important;
          font-weight: 500 !important;
        }
        
        .enhanced-multiselect .multiselect-container:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15) !important;
        }
        
        .enhanced-multiselect .multiselect-container:focus-within {
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 25px rgba(116, 148, 167, 0.15), 0 0 0 3px rgba(116, 148, 167, 0.1) !important;
          outline: none !important;
        }
        
        .enhanced-multiselect label {
          color: #475569 !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.025em !important;
          margin-bottom: 8px !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .enhanced-field .form-select option {
          padding: 12px 16px !important;
          font-weight: 500 !important;
          color: #334155 !important;
        }
        
        .enhanced-field .form-select option:first-child {
          color: #94a3b8 !important;
          font-style: italic !important;
        }
        
        /* Custom dropdown styling */
        .enhanced-field,
        .enhanced-multiselect {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        
        /* Placeholder styling */
        .enhanced-multiselect .multiselect-placeholder {
          color: #94a3b8 !important;
          font-style: italic !important;
        }
        
        /* Animation for smooth transitions */
        .enhanced-field .form-select,
        .enhanced-multiselect .multiselect-container {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .enhanced-field .form-select,
          .enhanced-multiselect .multiselect-container {
            height: 44px !important;
            font-size: 0.85rem !important;
          }
          
          .enhanced-field .form-label,
          .enhanced-multiselect label {
            font-size: 0.85rem !important;
          }
        }
        
        /* Focus states for accessibility */
        .enhanced-field .form-select:focus,
        .enhanced-multiselect .multiselect-container:focus-within {
          border-color: transparent !important;
        }
        
        /* Hover effects for buttons */
        .btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .btn:active {
          transform: translateY(0px) !important;
        }
      `}</style>
    </>
  )
}

export default FilterSection