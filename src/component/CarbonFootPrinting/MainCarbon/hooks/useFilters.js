import { useState, useEffect, useCallback } from "react"

export const useFilters = (emissionEntries) => {
  // Basic filter states
  const [selectedFilterCategory, setSelectedFilterCategory] = useState([]);
  const [selectedFilterScope3Categories, setSelectedFilterScope3Categories] = useState([]);
  const [selectedFilterDefraScope3Activities, setSelectedFilterDefraScope3Activities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedFilterPeriod, setSelectedFilterPeriod] = useState([]);
  const [filteredEmissionEntries, setFilteredEmissionEntries] = useState([]);

  // Apply filters to emission entries
  const handleFilterApply = useCallback(() => {
    if (!emissionEntries || emissionEntries.length === 0) {
      setFilteredEmissionEntries([]);
      return;
    }

    const filtered = emissionEntries.filter(entry => {
      let matchesFilters = true;

      // Filter by category - Only filter if categories are selected
      if (selectedFilterCategory && selectedFilterCategory.length > 0) {
        const categoryMatch = selectedFilterCategory.includes(entry.inputDetails.category);
        matchesFilters = matchesFilters && categoryMatch;
      }

      // Filter by scope3Categories - Only filter if categories are selected
      if (selectedFilterScope3Categories && selectedFilterScope3Categories.length > 0) {
        const categoryMatch = selectedFilterScope3Categories.includes(entry.inputDetails.scope3CategoryId);
        matchesFilters = matchesFilters && categoryMatch;
      }

      // Filter by defraScope3Activities - Only filter if categories are selected
      if (selectedFilterDefraScope3Activities && selectedFilterDefraScope3Activities.length > 0) {
        const categoryMatch = selectedFilterDefraScope3Activities.includes(entry.inputDetails.defraScope3ActivityType);
        matchesFilters = matchesFilters && categoryMatch;
      }

      // Filter by location - Only filter if locations are selected
      if (selectedLocation && selectedLocation.length > 0) {
        const entryLocationId = entry.sourceId;
        const locationMatch = selectedLocation.includes(entryLocationId);
        matchesFilters = matchesFilters && locationMatch;
      }

      // Filter by period - Only filter if periods are selected
      if (selectedFilterPeriod && selectedFilterPeriod.length > 0) {
        const periodMatch = selectedFilterPeriod.includes(entry.period);
        matchesFilters = matchesFilters && periodMatch;
      }

      return matchesFilters;
    });

    setFilteredEmissionEntries(filtered);
  }, [
    emissionEntries,
    selectedFilterCategory,
    selectedFilterScope3Categories,
    selectedFilterDefraScope3Activities,
    selectedLocation,
    selectedFilterPeriod
  ]);

  // Reset all filters
  const handleFilterReset = useCallback(() => {
    setSelectedFilterCategory([]);
    setSelectedFilterScope3Categories([]);
    setSelectedFilterDefraScope3Activities([]);
    setSelectedLocation([]);
    setSelectedFilterPeriod([]);
    setFilteredEmissionEntries(emissionEntries);
  }, []);

  // Auto-apply filters when filter criteria change
  useEffect(() => {
    if (emissionEntries && emissionEntries.length > 0) {
      handleFilterApply();
    }
  }, [
    selectedFilterCategory,
    selectedLocation,
    selectedFilterPeriod,
    emissionEntries,
    handleFilterApply
  ]);

  return {
    // Basic filter states
    selectedFilterCategory,
    setSelectedFilterCategory,
    selectedFilterScope3Categories,
    setSelectedFilterScope3Categories,
    selectedFilterDefraScope3Activities,
    setSelectedFilterDefraScope3Activities,
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    filteredEmissionEntries,
    setFilteredEmissionEntries,

    // Filter actions
    handleFilterApply,
    handleFilterReset
  };
}