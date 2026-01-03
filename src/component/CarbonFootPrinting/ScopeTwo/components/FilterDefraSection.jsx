import { Button, Col, Form, Row } from "react-bootstrap"
import Select from "react-select"

const FilterSection = ({
  selectedFinancialYear,
  setSelectedFinancialYear,
  financialYears,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedLocation,
  setSelectedLocation,
  locations,
  selectedFilterPeriod,
  setSelectedFilterPeriod,
  timePeriodOptions,
  
  selectedStationaryFuelType,
  setSelectedStationaryFuelType,
  stationaryFuelTypes,
  selectedStationaryFuel,
  setSelectedStationaryFuel,
  stationaryFuels,
  
  selectedMobileFuel,
  setSelectedMobileFuel,
  mobileFuels,
  selectedTransportType,
  setSelectedTransportType,
  transportTypes,
  selectedEngineType,
  setSelectedEngineType,
  engineTypes,
  
  handleFilterApply,
  handleFilterReset,
  fuelError
}) => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderRadius: "8px",
      border: "2px solid #dee2e6",
      fontSize: "0.9rem",
      minHeight: "44px",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13, 110, 253, 0.25)" : "none",
      "&:hover": {
        borderColor: "#86b7fe"
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6c757d",
      fontSize: "0.9rem"
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e7f3ff",
      borderRadius: "4px"
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0d6efd",
      fontSize: "0.85rem"
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0d6efd",
      "&:hover": {
        backgroundColor: "#0d6efd",
        color: "white"
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      border: "1px solid #dee2e6"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#0d6efd" 
        : state.isFocused 
        ? "#f8f9fa" 
        : "white",
      color: state.isSelected ? "white" : "#212529",
      fontSize: "0.9rem"
    })
  }

  const formatCategoryOptions = categories?.map(category => ({
    value: category.id,
    label: category.label
  })) || []

  const formatLocationOptions = locations?.map(location => ({
    value: location.id,
    label: location?.unitCode || `${location?.location?.area || ""}, ${location?.location?.city || ""}`.trim()
  })) || []

  const formatPeriodOptions = timePeriodOptions?.map(option => ({
    value: option.value,
    label: option.label,
    fromDate: option.fromDate,
  })) || []

  const formatStationaryFuelTypeOptions = stationaryFuelTypes?.map(fuel => ({
    value: fuel.id,
    label: fuel.fuel_type
  })) || []

  const formatStationaryFuelOptions = stationaryFuels?.map(fuel => ({
    value: fuel.id,
    label: fuel.fuel_name
  })) || []

  const formatMobileFuelOptions = mobileFuels?.map(fuel => ({
    value: fuel.id,
    label: fuel.fuel_name
  })) || []

  const formatTransportTypeOptions = transportTypes?.map(transport => ({
    value: transport.id,
    label: transport.transport_type
  })) || []

  const formatEngineTypeOptions = engineTypes?.map(engine => ({
    value: engine.id,
    label: engine.engine_type
  })) || []

  const handleCategoryChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedCategory(values)
    
    if (!values.includes("stationary")) {
      setSelectedStationaryFuelType([])
      setSelectedStationaryFuel([])
    }
    if (!values.includes("mobile")) {
      setSelectedMobileFuel([])
      setSelectedTransportType([])
      setSelectedEngineType([])
    }
  }

  const handleLocationChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedLocation(values)
  }

  const handlePeriodChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedFilterPeriod(values)
  }

  const handleStationaryFuelTypeChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedStationaryFuelType(values)
    setSelectedStationaryFuel([])
  }

  const handleStationaryFuelChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedStationaryFuel(values)
  }

  const handleMobileFuelChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedMobileFuel(values)
    setSelectedTransportType([])
    setSelectedEngineType([])
  }

  const handleTransportTypeChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedTransportType(values)
    setSelectedEngineType([])
  }

  const handleEngineTypeChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : []
    setSelectedEngineType(values)
  }

  const getSelectedCategories = () => {
    if (!Array.isArray(selectedCategory)) return []
    return formatCategoryOptions.filter(option => 
      selectedCategory.includes(option.value)
    )
  }

  const getSelectedLocations = () => {
    if (!Array.isArray(selectedLocation)) return []
    return formatLocationOptions.filter(option => 
      selectedLocation.includes(option.value)
    )
  }

  const getSelectedPeriods = () => {
    if (!Array.isArray(selectedFilterPeriod)) return []
    return formatPeriodOptions.filter(option => 
      selectedFilterPeriod.includes(option.value)
    )
  }

  const getSelectedStationaryFuelTypes = () => {
    if (!Array.isArray(selectedStationaryFuelType)) return []
    return formatStationaryFuelTypeOptions.filter(option => 
      selectedStationaryFuelType.includes(option.value)
    )
  }

  const getSelectedStationaryFuels = () => {
    if (!Array.isArray(selectedStationaryFuel)) return []
    return formatStationaryFuelOptions.filter(option => 
      selectedStationaryFuel.includes(option.value)
    )
  }

  const getSelectedMobileFuels = () => {
    if (!Array.isArray(selectedMobileFuel)) return []
    return formatMobileFuelOptions.filter(option => 
      selectedMobileFuel.includes(option.value)
    )
  }

  const getSelectedTransportTypes = () => {
    if (!Array.isArray(selectedTransportType)) return []
    return formatTransportTypeOptions.filter(option => 
      selectedTransportType.includes(option.value)
    )
  }

  const getSelectedEngineTypes = () => {
    if (!Array.isArray(selectedEngineType)) return []
    return formatEngineTypeOptions.filter(option => 
      selectedEngineType.includes(option.value)
    )
  }

  const hasStationaryCategory = Array.isArray(selectedCategory) && selectedCategory.includes("stationary")
  const hasMobileCategory = Array.isArray(selectedCategory) && selectedCategory.includes("mobile")

  return (
    <>
      <div className="bg-light rounded-lg p-4 mb-4">
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold text-muted mb-1">Financial Year</Form.Label>
              <div className="position-relative">
                <Form.Select
                  value={selectedFinancialYear}
                  onChange={(e) => setSelectedFinancialYear(e.target.value)}
                  className="border-2 py-2 ps-3 pe-4"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    height: "44px"
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

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold text-muted mb-1">Category</Form.Label>
              <Select
                isMulti
                value={getSelectedCategories()}
                onChange={handleCategoryChange}
                options={formatCategoryOptions}
                placeholder="Select Categories..."
                styles={customSelectStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isSearchable={true}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold text-muted mb-1">Location</Form.Label>
              <Select
                isMulti
                value={getSelectedLocations()}
                onChange={handleLocationChange}
                options={formatLocationOptions}
                placeholder="Select Locations..."
                styles={customSelectStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isSearchable={true}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold text-muted mb-1">Period</Form.Label>
              <Select
                isMulti
                value={getSelectedPeriods()}
                onChange={handlePeriodChange}
                options={formatPeriodOptions}
                placeholder="Select Periods..."
                styles={customSelectStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                isSearchable={true}
              />
            </Form.Group>
          </Col>
        </Row>

        {hasStationaryCategory && (
          <Row className="g-3 mt-2">
            <Col md={12}>
              <div className="border-start border-primary border-3 ps-3 mb-3">
                <h6 className="text-primary mb-0">Stationary Filters</h6>
              </div>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel Type</Form.Label>
                <Select
                  isMulti
                  value={getSelectedStationaryFuelTypes()}
                  onChange={handleStationaryFuelTypeChange}
                  options={formatStationaryFuelTypeOptions}
                  placeholder="Select Fuel Types..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable={true}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel</Form.Label>
                <Select
                  isMulti
                  value={getSelectedStationaryFuels()}
                  onChange={handleStationaryFuelChange}
                  options={formatStationaryFuelOptions}
                  placeholder="Select Fuels..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable={true}
                  isDisabled={!selectedStationaryFuelType || selectedStationaryFuelType.length === 0}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
    
        {hasMobileCategory && (
          <Row className="g-3 mt-2">
            <Col md={12}>
              <div className="border-start border-success border-3 ps-3 mb-3">
                <h6 className="text-success mb-0">Mobile Filters</h6>
              </div>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Fuel</Form.Label>
                <Select
                  isMulti
                  value={getSelectedMobileFuels()}
                  onChange={handleMobileFuelChange}
                  options={formatMobileFuelOptions}
                  placeholder="Select Fuels..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable={true}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Transport Type</Form.Label>
                <Select
                  isMulti
                  value={getSelectedTransportTypes()}
                  onChange={handleTransportTypeChange}
                  options={formatTransportTypeOptions}
                  placeholder="Select Transport Types..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable={true}
                  isDisabled={!selectedMobileFuel || selectedMobileFuel.length === 0}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold text-muted mb-1">Engine Type</Form.Label>
                <Select
                  isMulti
                  value={getSelectedEngineTypes()}
                  onChange={handleEngineTypeChange}
                  options={formatEngineTypeOptions}
                  placeholder="Select Engine Types..."
                  styles={customSelectStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  isSearchable={true}
                  isDisabled={!selectedTransportType || selectedTransportType.length === 0}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        <Row className="g-3 mt-3">
          <Col md={12} className="d-flex align-items-end">
            <Button
              variant="primary"
              onClick={handleFilterApply}
              className="me-2"
              style={{
                height: "44px",
                padding: "0 20px",
                fontSize: "0.9rem",
                fontWeight: "500",
                background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
                border: "none",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                transform: "translateY(0px)",
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleFilterReset}
              style={{
                height: "44px",
                padding: "0 20px",
                fontSize: "0.9rem",
                fontWeight: "500",
                borderRadius: "8px",
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </div>

      {fuelError && (
        <div className="alert alert-danger py-2 mt-2">
          {fuelError}
        </div>
      )}
    </>
  )
}

export default FilterSection