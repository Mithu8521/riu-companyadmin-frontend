import { useState, useEffect, useCallback } from "react"
import { Button, Col, Form, Row, Alert } from "react-bootstrap"
import { FiUpload, FiEdit, FiX } from "react-icons/fi"
import {
  FinancialYearField,
  LocationField,
  PeriodField,
  ActivityField,
  UnitField,
  ConsumptionField,
  FormRow,
} from "../../common/FormComponents"
import { handlePeriodChange as calculatePeriodChange } from "../../utils/PeriodCalculationUtils"
import { apiCall } from "../../../../_services/apiCall"
import config from "../../../../config/config.json"
import EmissionCalculationResults from "../../MainCarbon/components/EmissionCalculationResults"

const EmissionEntryForm = ({
  entry,
  index,
  updateEmissionEntry,
  handleSubmitData: parentHandleSubmitData,
  locations,
  timePeriodOptions,
  activities,
  scope2Data,
  selectedFinancialYear,
  financialYears = [],
  getEmissionEntries,
  setEmissionEntries,
  onSubmitSuccess,
  onSubmitError,
  identifier,
}) => {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [units, setUnits] = useState([]);
  const [finalFuel, setFinalFuel] = useState();

  const getCurrentValues = useCallback(() => {
    if (!entry) return {};

    if (entry.isNew) {
      return {
        location: entry.location || "",
        period: entry.period || "",
        financialYear: entry.financialYear || "",
        activity: entry.activity || "",
        unit: entry.unit || "",
        consumption: entry.consumption || "",
      };
    }

    return {
      location: String(entry.sourceId || entry.location || ""),
      period: entry.period || "",
      financialYear: String(entry.financialYearId || entry.financialYear || ""),
      activity: String(entry.activityId || entry.activity || ""),
      unit: String(entry.unitId || entry.unit || ""),
      consumption: entry.consumption || entry.consumedAmount || "",
    };
  }, [entry]);

  const handleEditModeFieldUpdate = useCallback((field, value) => {
    if (!entry || !updateEmissionEntry) return;
    
    // Only allow updates when in edit mode or for new entries
    if (entry.isNew || editingEntryId === entry.id) {
      // Prevent unnecessary updates if value hasn't changed
      const currentValue = entry[field];
      if (currentValue === value) return;
      
      // Update the main field first
      updateEmissionEntry(entry.id, field, value);
      
      // Handle dependent field updates
      if (field === 'period') {
        calculatePeriodChange(
          value,
          selectedFinancialYear,
          financialYears,
          identifier,
          setFromDate,
          setToDate
        );
      }
    }
  }, [entry?.id, entry?.isNew, updateEmissionEntry, editingEntryId, selectedFinancialYear, financialYears, identifier]);


  // Handler functions for form fields
  const handleLocationChange = useCallback((value) => {
    handleEditModeFieldUpdate("location", value);
  }, [handleEditModeFieldUpdate]);

  const handlePeriodSelect = useCallback((value) => {
    handleEditModeFieldUpdate("period", value);
  }, [handleEditModeFieldUpdate]);

  const handleFinancialYearChange = useCallback((value) => {
    handleEditModeFieldUpdate("financialYear", value);
  }, [handleEditModeFieldUpdate]);

  const handleActivityChange = useCallback((value) => {
    handleEditModeFieldUpdate("activity", value);
    // Reset unit when activity changes
    handleEditModeFieldUpdate("unit", "");
  }, [handleEditModeFieldUpdate]);

  const handleUnitChange = useCallback((value) => {
    handleEditModeFieldUpdate("unit", value);
  }, [handleEditModeFieldUpdate]);

  const handleConsumptionChange = useCallback((value) => {
    handleEditModeFieldUpdate("consumption", value);
  }, [handleEditModeFieldUpdate]);

  // Set dates from existing entry
  useEffect(() => {
    if (entry && !entry.isNew && entry.fromDate && entry.toDate && !fromDate && !toDate) {
      setFromDate(entry.fromDate);
      setToDate(entry.toDate);
    }
  }, [entry, fromDate, toDate]);

  // Reset editing state when entry changes
  useEffect(() => {
    if (editingEntryId && entry?.id && editingEntryId !== entry.id) {
      setEditingEntryId(null);
      setSubmitError(null);
    }
  }, [entry?.id, editingEntryId]);

  const handleSubmitData = useCallback(async (entryData,finalFuel) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const currentValues = getCurrentValues();
      
      const currentLocation = entryData.location || currentValues.location;
      const currentPeriod = entryData.period || currentValues.period;
      const currentFinancialYear = entryData.financialYear || currentValues.financialYear;
      const currentActivity = entryData.activity || currentValues.activity;
      const currentUnit = entryData.unit || currentValues.unit;
      const currentConsumption = entryData.consumption || currentValues.consumption;
      
      if (!fromDate || !toDate) {
        throw new Error('Date range is required. Please select a period.');
      }

      if (!currentFinancialYear) {
        throw new Error('Financial year is required');
      }

      if (!currentLocation || !currentPeriod || !currentActivity || !currentUnit) {
        throw new Error('Please fill all required fields');
      }
console.log(finalFuel,"finalFuelfinalFuel")
      const payload = {
        id: entryData.isNew ? undefined : entryData.id,
        financialYearId: Number(currentFinancialYear),
        ghgDatabaseId: Number(finalFuel.ghgDatabaseId),
        calculationId: Number(finalFuel.id),
        sourceId: Number(currentLocation),
        fromDate: fromDate,
        toDate: toDate,
        period: Number(currentPeriod),
        unit: currentUnit,
        consumedAmount: Number(currentConsumption || 0),
        calculationDetails: JSON.stringify(finalFuel),
        status: true
      };

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}ghg/scope2/emissions`,
        {},
        payload,
        "POST"
      );

      if (response.isSuccess) {
        if (getEmissionEntries) {
          await getEmissionEntries(Number(currentFinancialYear));
        }
        
        if (entryData.isNew && setEmissionEntries) {
          setEmissionEntries(prevEntries => 
            prevEntries.filter(e => e.id !== entryData.id)
          );
        }

        setEditingEntryId(null);

        if (onSubmitSuccess) {
          onSubmitSuccess(response, entryData);
        }

        return true;
      } else {
        throw new Error(response.message || 'Failed to save emission entry');
      }
    } catch (error) {
      setSubmitError(error.message);
      
      if (onSubmitError) {
        onSubmitError(error, entryData);
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    getCurrentValues,
    fromDate,
    toDate,
    getEmissionEntries,
    setEmissionEntries,
    onSubmitSuccess,
    onSubmitError
  ]);

  const isFormValid = useCallback(() => {
    if (!entry) return false;
    
    try {
      const currentValues = getCurrentValues();
      const currentLocation = currentValues.location;
      const currentPeriod = currentValues.period;
      const currentFinancialYear = currentValues.financialYear;
      const currentActivity = currentValues.activity;
      const currentUnit = currentValues.unit;
      const currentConsumption = currentValues.consumption;

      // All fields are required
      return !!(currentLocation && currentPeriod && currentFinancialYear && currentActivity && currentUnit && currentConsumption);
    } catch (error) {
      console.warn('Error in isFormValid:', error);
      return false;
    }
  }, [getCurrentValues, entry?.id]);
  const currentValues = getCurrentValues();

  useEffect(() => {

    if (currentValues.activity) {
      const units = scope2Data.filter(
        (entry) => entry.activity === currentValues.activity
      );
      setUnits(units)
    }
  }, [currentValues.activity]);

  useEffect(() => {

    if (currentValues.activity) {
      const fuel = scope2Data.find(
        (entry) => entry.activity === currentValues.activity && entry.unit === currentValues.unit
      );
      setFinalFuel(fuel)
    }
  }, [currentValues.unit]);

  if (!entry) {
    return null;
  }

  const isEditable = entry.isNew || editingEntryId === entry.id;

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
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-dark" style={{ fontWeight: "600" }}>
          {entry.isNew ? 'New Entry' : `Entry #${index}`}
        </h6>
        {!entry.isNew && (
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                const newEditingId = editingEntryId === entry.id ? null : entry.id;
                setEditingEntryId(newEditingId);
                setSubmitError(null);
              }}
              className={`btn d-flex align-items-center justify-content-center`}
              style={{
                borderRadius: "6px",
                padding: "4px 16px",
                fontWeight: "500",
                height: "32px",
                fontSize: "0.85rem",
                minWidth: "110px",
                border: editingEntryId === entry.id ? "1px solid #dc3545" : "1px solid #e2e6ea",
                backgroundColor: editingEntryId === entry.id ? "#fff5f5" : "#fff",
                color: editingEntryId === entry.id ? "#dc3545" : "#666",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
              disabled={isSubmitting}
            >
              {editingEntryId === entry.id ? (
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
            {editingEntryId === entry.id && (
              <button
                onClick={() => handleSubmitData(entry,finalFuel)}
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
                  cursor: "pointer"
                }}
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></div>
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

      {/* Form Fields Using Common Components */}
      <FormRow gap={3}>
        <FinancialYearField
          value={currentValues.financialYear}
          onChange={handleFinancialYearChange}
          options={financialYears}
          required={true}
          disabled={!isEditable}
          className=""
        />

        <LocationField
          value={currentValues.location}
          onChange={handleLocationChange}
          options={locations}
          required={true}
          disabled={!isEditable}
          className=""
        />
      </FormRow>
      <FormRow gap={3}>
        <PeriodField
          value={currentValues.period}
          onChange={handlePeriodSelect}
          options={timePeriodOptions}
          required={true}
          disabled={!isEditable}
          className=""
        />

        <ActivityField
          value={currentValues.activity}
          onChange={handleActivityChange}
          options={activities}
          required={true}
          disabled={!isEditable}
          className=""
        />
      </FormRow>

      <FormRow gap={3}>
        <UnitField
          value={currentValues.unit}
          onChange={handleUnitChange}
          options={units}
          required={true}
          disabled={!isEditable}
          dependsOn={currentValues.activity}
          className=""
        />

        <ConsumptionField
          value={currentValues.consumption}
          onChange={handleConsumptionChange}
          required={true}
          disabled={!isEditable}
          dependsOn={currentValues.activity}
          className=""
        />
      </FormRow>

      {finalFuel && currentValues.consumption &&(
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
              consumption={currentValues.consumption}
            />
          </div>
        )}



    </div>
  )
}

export default EmissionEntryForm