import React, { useMemo } from "react"
import EmissionEntryForm from "./EmissionEntryForm"

const EmissionEntriesList = ({
  emissionEntries,
  filteredEmissionEntries,
  updateEmissionEntry,
  handleSubmitData,
  locations,
  timePeriodOptions,
  activities,
  scope2Data,
  selectedFinancialYear,
  financialYears,
  getEmissionEntries,
  setEmissionEntries,
  onSubmitSuccess,
  onSubmitError,
  identifier,
}) => {

  // Memoize the entries to display to prevent unnecessary recalculations
  const entriesToDisplay = useMemo(() => {
    const filtered = filteredEmissionEntries?.length > 0 
      ? filteredEmissionEntries.filter(entry => !entry?.isNew)
      : emissionEntries?.filter(entry => !entry?.isNew) || [];
    
    return filtered;
  }, [emissionEntries, filteredEmissionEntries]);

  // Memoize the empty state logic
  const emptyStateInfo = useMemo(() => {
    const hasFilteredResults = filteredEmissionEntries?.length === 0;
    const hasOriginalEntries = emissionEntries?.filter(entry => !entry?.isNew).length > 0;
    
    return {
      isFiltered: hasFilteredResults && hasOriginalEntries,
      title: hasFilteredResults && hasOriginalEntries ? "No Matching Entries" : "No Entries Yet",
      message: hasFilteredResults && hasOriginalEntries
        ? "No entries match the selected filters. Try adjusting your filter criteria to see more results."
        : "No emission entries found. Click \"Add New Entry\" to create your first emission record."
    };
  }, [emissionEntries, filteredEmissionEntries]);

  return (
    <div>
      {entriesToDisplay.length > 0 && scope2Data ? (
        entriesToDisplay.map((entry, index) => (
          <EmissionEntryForm
            key={`entry-${entry.id || index}`} // More stable key
            entry={entry}
            index={index + 1}
            updateEmissionEntry={updateEmissionEntry}
            handleSubmitData={handleSubmitData}
            locations={locations}
            timePeriodOptions={timePeriodOptions}
            activities={activities}
            scope2Data={scope2Data}
            selectedFinancialYear={selectedFinancialYear}
            financialYears={financialYears}
            getEmissionEntries={getEmissionEntries}
            setEmissionEntries={setEmissionEntries}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitError={onSubmitError}
            identifier={identifier}
          />
        ))
      ) : (
        <div 
          className="text-center py-5"
          style={{
            backgroundColor: "rgba(248, 250, 252, 0.5)",
            borderRadius: "12px",
            border: "2px dashed #cbd5e1",
            margin: "2rem 0"
          }}
        >
          <div 
            className="mx-auto mb-3"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#f1f5f9",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#64748b" 
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3" />
              <path d="M3 12c1.5 0 3-1 3-3s-1.5-3-3-3-3 1-3 3 1.5 3 3 3" />
              <path d="M12 3c0 1.5-1 3-3 3s-3-1.5-3-3 1-3 3-3 3 1.5 3 3" />
              <path d="M12 21c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3-3-1.5-3-3" />
            </svg>
          </div>
          <h6 
            className="mb-2" 
            style={{ 
              color: "#475569", 
              fontWeight: "600",
              fontSize: "1.1rem"
            }}
          >
            {emptyStateInfo.title}
          </h6>
          <p 
            className="text-muted mb-0" 
            style={{ 
              fontSize: "0.95rem",
              maxWidth: "400px",
              margin: "0 auto"
            }}
          >
            {emptyStateInfo.message}
          </p>
        </div>
      )}
    </div>
  )
}

export default React.memo(EmissionEntriesList)