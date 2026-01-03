import { useState, useEffect, useCallback, useMemo } from "react"

export const useFilters = (emissionEntries) => {
  const [selectedLocation, setSelectedLocation] = useState([])
  const [selectedFilterPeriod, setSelectedFilterPeriod] = useState([])
  const [selectedActivity, setSelectedActivity] = useState([])

  // Use useMemo to compute filtered entries instead of useEffect + useState
  // This prevents infinite loops and is more performant
  const filteredEmissionEntries = useMemo(() => {
    console.log('Filtering entries...') // Add this to see how often it runs
    
    if (!emissionEntries || emissionEntries.length === 0) {
      return []
    }

    // If no filters are selected, return all entries (excluding new ones)
    const hasFilters = selectedLocation.length > 0 || 
                      selectedFilterPeriod.length > 0 || 
                      selectedActivity.length > 0

    if (!hasFilters) {
      return []
    }

    return emissionEntries.filter(entry => {
      let matchesFilters = true

      // Filter by location - Only filter if locations are selected
      if (selectedLocation.length > 0) {
        const entryLocationId = entry.sourceId || entry.location;
        const locationMatch = selectedLocation.includes(Number(entryLocationId));
        matchesFilters = matchesFilters && locationMatch;
      }

      // Filter by period - Only filter if periods are selected
      if (selectedFilterPeriod.length > 0) {
        const periodMatch = selectedFilterPeriod.includes(entry.period);
        matchesFilters = matchesFilters && periodMatch;
      }

      // Filter by activity - Only filter if activities are selected
      if (selectedActivity.length > 0) {
        const entryActivityId = entry.activityId || entry.activity || entry.calculationId;
        const activityMatch = selectedActivity.some(actId => {
          // Handle both string and number comparisons
          return Number(actId) === Number(entryActivityId) || 
                 String(actId) === String(entryActivityId);
        });
        matchesFilters = matchesFilters && activityMatch;
      }

      return matchesFilters
    })
  }, [emissionEntries, selectedLocation, selectedFilterPeriod, selectedActivity])

  // Manual filter apply function (for UI buttons if needed)
  const handleFilterApply = useCallback(() => {
    // With useMemo, this is automatically handled
    // This function exists for compatibility but doesn't need to do anything
    console.log('Manual filter apply called')
  }, [])

  const handleFilterReset = useCallback(() => {
    setSelectedLocation([])
    setSelectedFilterPeriod([])
    setSelectedActivity([])
  }, [])

  // For debugging - log when filters change
  useEffect(() => {
    console.log('Filters changed:', {
      location: selectedLocation,
      period: selectedFilterPeriod, 
      activity: selectedActivity,
      filteredCount: filteredEmissionEntries.length
    })
  }, [selectedLocation, selectedFilterPeriod, selectedActivity, filteredEmissionEntries.length])

  return {
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    selectedActivity,
    setSelectedActivity,
    filteredEmissionEntries,
    setFilteredEmissionEntries: () => {}, // Dummy function for compatibility
    handleFilterApply,
    handleFilterReset,
  }
}