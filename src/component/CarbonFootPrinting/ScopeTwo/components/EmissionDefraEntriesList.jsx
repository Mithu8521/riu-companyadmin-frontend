import { useState, useEffect, useCallback } from "react"
import EmissionEntryForm from "./EmissionEntryForm"

const EmissionEntriesList = ({
  emissionEntries,
  filteredEmissionEntries,
  updateEmissionEntry,
  handleConsumptionBlur,
  handleSubmitData,
  locations,
  timePeriodOptions,
  fuelType,
  fuelError,
  setFuelError,
  categories,
  category,
  setCategory,
  mobileFuel,
  transportType,
  engineTypeOptions,
  setSelectedTransportType,
  setSelectedEngineType,
  scope1Data,
  identifier,
  fugitiveFuel,
  selectedFinancialYear,
}) => {
  
  const [selectedFuelType, setSelectedFuelType] = useState("")
  const [fuels, setFuels] = useState([])

  // Function to get sub fuel types based on selected fuel type
  const getSubFuelTypes = useCallback((selectedFuelType) => {
    return [];
  }, []);

  const handlePeriodChange = useCallback((field, value) => {
  }, []);

  useEffect(() => {
    if (selectedFuelType) {
      const subFuelTypes = getSubFuelTypes(selectedFuelType);
      setFuels(subFuelTypes);
    }
  }, [selectedFuelType, getSubFuelTypes]);

  const entriesToDisplay = filteredEmissionEntries.length > 0 
    ? filteredEmissionEntries.filter(entry => !entry.isNew)
    : emissionEntries.filter(entry => !entry.isNew);

  return (
    <div>
      {entriesToDisplay.length > 0 ? (
        entriesToDisplay.map((entry, index) => (
          <EmissionEntryForm
            key={entry.id}
            entry={entry}
            index={index + 1}
            updateEmissionEntry={updateEmissionEntry}
            handleConsumptionBlur={handleConsumptionBlur}
            handleSubmitData={handleSubmitData}
            locations={locations}
            timePeriodOptions={timePeriodOptions}
            fuelType={fuelType}
            fuels={fuels}
            fuelError={fuelError}
            setFuelError={setFuelError}
            selectedFuelType={selectedFuelType}
            setSelectedFuelType={setSelectedFuelType}
            handlePeriodChange={handlePeriodChange}
            categories={categories}
            category={category}
            setCategory={setCategory}
            selectedFinancialYear={selectedFinancialYear}
            mobileFuel={mobileFuel}
            transportType={transportType}
            engineTypeOptions={engineTypeOptions}
            setSelectedTransportType={setSelectedTransportType}
            setSelectedEngineType={setSelectedEngineType}
            scope1Data={scope1Data}
            identifier={identifier}
            fugitiveFuel={fugitiveFuel}
          />
        ))
      ) : (
        <div className="text-center py-5">
          <p className="text-muted mb-0">
            {filteredEmissionEntries.length === 0 && emissionEntries.filter(entry => !entry.isNew).length > 0
              ? "No entries match the selected filters. Try adjusting your filter criteria."
              : "No emission entries found. Click \"Add New Entry\" to get started."
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default EmissionEntriesList
