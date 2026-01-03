import EmissionEntryForm from "./EmissionEntryForm";

const EmissionEntriesList = ({
  emissionEntries,
  filteredEmissionEntries,
  handleSubmitData,
  locationOptions,
  financialYearOptions,
  timePeriodOptions,
  categories,
  scopeData,
  selectedFinancialYear,
  setSelectedFinancialYear,
  ghgProtocol,
  scopeType,
  scope3Categories,
  identifier
}) => {
  const allExistingEntries = emissionEntries.filter(entry => !entry.isNew);
  const entriesToDisplay = filteredEmissionEntries.filter(entry => !entry.isNew);
  const hasExistingEntries = allExistingEntries.length > 0;
  const isFilterApplied = allExistingEntries.length > entriesToDisplay.length;

  return (
    <div>
      <div className="mb-3 text-muted small">
        Showing {entriesToDisplay.length} of {allExistingEntries.length} entries
        {isFilterApplied && " (filtered)"}
      </div>

      {entriesToDisplay.length > 0 ? (
        <div className="space-y-4">
          {entriesToDisplay.map((entry, index) => (
            <EmissionEntryForm
              key={entry.id}
              financialYearOptions={financialYearOptions}
              entry={entry}
              index={index + 1}
              handleSubmitData={handleSubmitData}
              locationOptions={locationOptions}
              timePeriodOptions={timePeriodOptions}
              categories={categories}
              emissionEntries={emissionEntries}
              setSelectedFinancialYear={setSelectedFinancialYear}
              selectedFinancialYear={selectedFinancialYear}
              scopeData={scopeData}
              scope3Categories={scope3Categories}
              ghgProtocol={ghgProtocol}
              selectedScope={scopeType}
              identifier={identifier}
            />
          ))}
        </div>
      ) : (
        !isFilterApplied && !hasExistingEntries && (
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
              No emission entries yet
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
              Start tracking your carbon footprint by adding your first emission entry.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default EmissionEntriesList;
