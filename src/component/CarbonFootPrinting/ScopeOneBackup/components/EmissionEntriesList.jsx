import EmissionEntryForm from "./EmissionEntryForm"

const EmissionEntriesList = ({
  emissionEntries,
  filteredEmissionEntries,
  updateEmissionEntry,
  handleSubmitData,
  locations,
  financialYears,
  timePeriodOptions,
  categories,
  scope1Data,
  selectedFinancialYear,
  ghgProtocol
}) => {
  // Determine which entries to display (filtered or all, excluding new entries)
  const entriesToDisplay = filteredEmissionEntries.length > 0 
    ? filteredEmissionEntries.filter(entry => !entry.isNew)
    : emissionEntries.filter(entry => !entry.isNew);

  // Check if we have any existing entries at all
  const hasExistingEntries = emissionEntries.filter(entry => !entry.isNew).length > 0;

  return (
    <div>
      {entriesToDisplay.length > 0 ? (
        <div className="space-y-4">
          {entriesToDisplay.map((entry, index) => (
            <EmissionEntryForm
              key={entry.id}
              financialYears={financialYears}
              entry={entry}
              index={index + 1}
              updateEmissionEntry={updateEmissionEntry}
              handleSubmitData={handleSubmitData}
              locations={locations}
              timePeriodOptions={timePeriodOptions}
              categories={categories}
              emissionEntries={emissionEntries}
              selectedFinancialYear={selectedFinancialYear}
              scope1Data={scope1Data}
              ghgProtocol={ghgProtocol}
            />
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: "12px",
            border: "2px dashed #cbd5e1",
            padding: "3rem 2rem",
            margin: "2rem 0"
          }}
        >
          <div className="mb-3">
            <div 
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                borderRadius: "50%",
                color: "#64748b"
              }}
            >
              📊
            </div>
          </div>
          
          <h4 
            className="mb-2"
            style={{ 
              color: "#475569", 
              fontWeight: "600",
              fontSize: "1.2rem"
            }}
          >
            {hasExistingEntries 
              ? "No entries match your filters" 
              : "No emission entries yet"
            }
          </h4>
          
          <p 
            className="mb-0"
            style={{ 
              color: "#64748b", 
              fontSize: "1rem",
              maxWidth: "400px",
              margin: "0 auto"
            }}
          >
            {hasExistingEntries
              ? "Try adjusting your filter criteria to see more entries."
              : "Start tracking your carbon footprint by adding your first emission entry."
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default EmissionEntriesList