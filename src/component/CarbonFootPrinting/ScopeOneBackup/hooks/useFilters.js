import { useState, useEffect, useCallback, useMemo } from "react"

export const useFilters = (emissionEntries, scope1Data,ghgProtocol) => {
  // Basic filter states
  const [selectedFilterCategory, setSelectedFilterCategory] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([])
  const [selectedFilterPeriod, setSelectedFilterPeriod] = useState([])
  const [filteredEmissionEntries, setFilteredEmissionEntries] = useState([])
  
  // Dynamic category-specific filters (replaces all hardcoded category filters)
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState({})

  // Safe JSON parsing function
  const safeParseJSON = useCallback((str, fallback = {}) => {
    if (!str) return fallback;
    if (typeof str === 'object') return str;
    if (typeof str !== 'string' || str.trim() === '') return fallback;
    
    try {
      return JSON.parse(str);
    } catch (error) {
      console.warn("Failed to parse JSON:", error);
      return fallback;
    }
  }, []);

  // Helper function to safely get input details
  const getInputDetails = useCallback((entry) => {
    return safeParseJSON(entry.inputDetails, {});
  }, [safeParseJSON]);

  // Helper function to safely get calculation details  
  const getCalculationDetails = useCallback((entry) => {
    return safeParseJSON(entry.calculationDetails, {});
  }, [safeParseJSON]);

  // Get all available filter fields for a category from scope1Data
  const getCategoryFilterFields = useCallback((categoryKey) => {
    if (!scope1Data?.[categoryKey]) return [];

    const categoryData = scope1Data[categoryKey];
    const fields = [];

    // For mobile category with multiple methods
    if (categoryKey === "mobile" && categoryData[ghgProtocol]?.data) {
      const allFields = new Set();
      
      Object.values(categoryData[ghgProtocol].data).forEach(methodData => {
        if (methodData.frontendFields?.fields) {
          methodData.frontendFields.fields.forEach(field => {
            if (field.type === "dropdown" && !field.name.includes("Unit")) {
              allFields.add(JSON.stringify({
                name: field.name,
                label: field.label,
                type: field.type
              }));
            }
          });
        }
      });
      
      return Array.from(allFields).map(fieldStr => JSON.parse(fieldStr));
    }

    // For other categories
    if (categoryData[ghgProtocol]?.frontendFields?.fields) {
      return categoryData[ghgProtocol].frontendFields.fields.filter(field => 
        field.type === "dropdown" && !field.name.includes("Unit")
      );
    }

    return fields;
  }, [scope1Data]);

  // Extract unique filter options from emission entries for each category
  const extractCategoryFilterOptions = useCallback((categoryKey) => {
    if (!emissionEntries || emissionEntries.length === 0) return {};

    const categoryEntries = emissionEntries.filter(entry => entry.category === categoryKey);
    const filterFields = getCategoryFilterFields(categoryKey);
    const options = {};

    filterFields.forEach(field => {
      const uniqueValues = new Set();
      
      categoryEntries.forEach(entry => {
        const inputDetails = getInputDetails(entry);
        const calculationDetails = getCalculationDetails(entry);
        
        // Try to get value from both input and calculation details
        const value = inputDetails[field.name] || calculationDetails[field.name] || entry[field.name];
        
        if (value && value !== null && value !== undefined && value !== '') {
          uniqueValues.add(value);
        }
      });

      options[field.name] = Array.from(uniqueValues).map(value => ({
        value,
        label: value
      }));
    });

    return options;
  }, [emissionEntries, getCategoryFilterFields, getInputDetails, getCalculationDetails]);

  // Get all available filter options for selected categories
  const availableCategoryFilterOptions = useMemo(() => {
    const options = {};
    
    selectedFilterCategory.forEach(categoryKey => {
      options[categoryKey] = extractCategoryFilterOptions(categoryKey);
    });

    return options;
  }, [selectedFilterCategory, extractCategoryFilterOptions]);

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
        const categoryMatch = selectedFilterCategory.includes(entry.category);
        matchesFilters = matchesFilters && categoryMatch;
      }

      // Filter by location - Only filter if locations are selected
      if (selectedLocation && selectedLocation.length > 0) {
        const entryLocationId = entry.subLocationId || entry.sourceId || entry.location;
        const locationMatch = selectedLocation.includes(Number(entryLocationId));
        matchesFilters = matchesFilters && locationMatch;
      }

      // Filter by period - Only filter if periods are selected
      if (selectedFilterPeriod && selectedFilterPeriod.length > 0) {
        const periodMatch = selectedFilterPeriod.includes(entry.period);
        matchesFilters = matchesFilters && periodMatch;
      }

      // Dynamic category-specific filters
      if (selectedCategoryFilters[entry.category]) {
        const categoryFilters = selectedCategoryFilters[entry.category];
        const inputDetails = getInputDetails(entry);
        const calculationDetails = getCalculationDetails(entry);
        
        // Combine all available data sources for filtering
        const entryData = {
          ...entry,
          ...calculationDetails,
          ...inputDetails
        };

        // Check each filter for this category
        Object.entries(categoryFilters).forEach(([filterField, selectedValues]) => {
          if (selectedValues && selectedValues.length > 0) {
            const entryValue = entryData[filterField];
            const fieldMatch = selectedValues.includes(entryValue);
            matchesFilters = matchesFilters && fieldMatch;
          }
        });
      }

      return matchesFilters;
    });

    setFilteredEmissionEntries(filtered);
  }, [
    emissionEntries,
    selectedFilterCategory,
    selectedLocation,
    selectedFilterPeriod,
    selectedCategoryFilters,
    getInputDetails,
    getCalculationDetails
  ]);

  // Reset all filters
  const handleFilterReset = useCallback(() => {
    setSelectedFilterCategory([]);
    setSelectedLocation([]);
    setSelectedFilterPeriod([]);
    setSelectedCategoryFilters({});
    setFilteredEmissionEntries([]);
  }, []);

  // Handle category filter changes with automatic cleanup
  const handleCategoryFilterChange = useCallback((categoryKey, fieldName, values) => {
    setSelectedCategoryFilters(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [fieldName]: values
      }
    }));
  }, []);

  // Handle category selection changes with filter cleanup
  const handleCategoryChange = useCallback((values) => {
    setSelectedFilterCategory(values);
    
    // Clean up category filters for unselected categories
    const newCategoryFilters = {};
    values.forEach(categoryKey => {
      if (selectedCategoryFilters[categoryKey]) {
        newCategoryFilters[categoryKey] = selectedCategoryFilters[categoryKey];
      } else {
        newCategoryFilters[categoryKey] = {};
      }
    });
    setSelectedCategoryFilters(newCategoryFilters);
  }, [selectedCategoryFilters]);

  // Auto-apply filters when filter criteria change
  useEffect(() => {
    if (emissionEntries && emissionEntries.length > 0) {
      handleFilterApply();
    }
  }, [
    selectedFilterCategory,
    selectedLocation,
    selectedFilterPeriod,
    selectedCategoryFilters,
    emissionEntries,
    handleFilterApply
  ]);

  // Helper function to get filter value from entry
  const getFilterValueFromEntry = useCallback((entry, fieldName) => {
    const inputDetails = getInputDetails(entry);
    const calculationDetails = getCalculationDetails(entry);
    
    return inputDetails[fieldName] || 
           calculationDetails[fieldName] || 
           entry[fieldName] || 
           null;
  }, [getInputDetails, getCalculationDetails]);

  // Get formatted options for a specific category and field
  const getCategoryFilterOptions = useCallback((categoryKey, fieldName) => {
    return availableCategoryFilterOptions[categoryKey]?.[fieldName] || [];
  }, [availableCategoryFilterOptions]);

  // Get selected values for a specific category and field
  const getSelectedCategoryFilterValues = useCallback((categoryKey, fieldName) => {
    return selectedCategoryFilters[categoryKey]?.[fieldName] || [];
  }, [selectedCategoryFilters]);

  return {
    // Basic filter states
    selectedFilterCategory,
    setSelectedFilterCategory: handleCategoryChange,
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    filteredEmissionEntries,
    setFilteredEmissionEntries,

    // Dynamic category filters
    selectedCategoryFilters,
    setSelectedCategoryFilters,
    handleCategoryFilterChange,

    // Filter actions
    handleFilterApply,
    handleFilterReset,

    // Helper functions for components
    availableCategoryFilterOptions,
    getCategoryFilterOptions,
    getSelectedCategoryFilterValues,
    getCategoryFilterFields,
    getFilterValueFromEntry,

    // Utility functions
    safeParseJSON,
    getInputDetails,
    getCalculationDetails,

    // Backward compatibility (deprecated - will be removed)
    // These are kept for gradual migration but should not be used in new code
    selectedStationaryFuelType: getSelectedCategoryFilterValues('stationary', 'fuelType'),
    selectedStationaryFuel: getSelectedCategoryFilterValues('stationary', 'fuel'),
    selectedMobileFuel: getSelectedCategoryFilterValues('mobile', 'fuel'),
    selectedFugitiveFuel: getSelectedCategoryFilterValues('fugitive', 'refrigerant'),
    
    // Empty arrays for backward compatibility
    stationaryFuelTypes: getCategoryFilterOptions('stationary', 'fuelType'),
    stationaryFuels: getCategoryFilterOptions('stationary', 'fuel'),
    mobileFuels: getCategoryFilterOptions('mobile', 'fuel'),
    fugitiveFuels: getCategoryFilterOptions('fugitive', 'refrigerant'),
    mobileLevel1Options: getCategoryFilterOptions('mobile', 'level1'),
    mobileLevel2Options: getCategoryFilterOptions('mobile', 'level2'),
    mobileLevel3Options: getCategoryFilterOptions('mobile', 'level3'),
  };
}