import { useState, useEffect } from "react"

export const useFilters = (emissionEntries, getSubFuelTypes) => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([])
  const [selectedFilterPeriod, setSelectedFilterPeriod] = useState([])
  const [filteredEmissionEntries, setFilteredEmissionEntries] = useState([])
  const [fuelError, setFuelError] = useState("")

  const [selectedFilterFuelType, setSelectedFilterFuelType] = useState([])
  const [selectedFilterSubFuel, setSelectedFilterSubFuel] = useState([])
  const [filterSubFuels, setFilterSubFuels] = useState([])

  const [selectedStationaryFuelType, setSelectedStationaryFuelType] = useState([])
  const [stationaryFuelTypes, setStationaryFuelTypes] = useState([])
  const [selectedStationaryFuel, setSelectedStationaryFuel] = useState([])
  const [stationaryFuels, setStationaryFuels] = useState([])

  const [selectedMobileFuel, setSelectedMobileFuel] = useState([])
  const [mobileFuels, setMobileFuels] = useState([])
  const [selectedTransportType, setSelectedTransportType] = useState([])
  const [transportTypes, setTransportTypes] = useState([])
  const [selectedEngineType, setSelectedEngineType] = useState([])
  const [engineTypes, setEngineTypes] = useState([])

  useEffect(() => {
    if (!emissionEntries || emissionEntries.length === 0) return

    const uniqueStationaryFuelTypes = [
      ...new Map(
        emissionEntries
          .filter(entry => entry.category === "stationary" && entry.fuelType)
          .map(entry => [entry.fuelTypeId, { id: entry.fuelTypeId, fuel_type: entry.fuelType }])
      ).values()
    ]
    setStationaryFuelTypes(uniqueStationaryFuelTypes)

    const uniqueStationaryFuels = [
      ...new Map(
        emissionEntries
          .filter(entry => entry.category === "stationary" && entry.subFuelType)
          .map(entry => [entry.subFuelTypeId, { id: entry.subFuelTypeId, fuel_name: entry.subFuelType }])
      ).values()
    ]
    setStationaryFuels(uniqueStationaryFuels)

    const uniqueMobileFuels = [
      ...new Map(
        emissionEntries
          .filter(entry => entry.category === "mobile" && entry.subFuelType)
          .map(entry => [entry.subFuelTypeId, { id: entry.subFuelTypeId, fuel_name: entry.subFuelType }])
      ).values()
    ]
    setMobileFuels(uniqueMobileFuels)

    const uniqueTransportTypes = [
      ...new Map(
        emissionEntries
          .filter(entry => entry.category === "mobile" && entry.transportType)
          .map(entry => [entry.transportTypeId, { id: entry.transportTypeId, transport_type: entry.transportType }])
      ).values()
    ]
    setTransportTypes(uniqueTransportTypes)

    const uniqueEngineTypes = [
      ...new Map(
        emissionEntries
          .filter(entry => entry.category === "mobile" && entry.engineType)
          .map(entry => [entry.engineTypeId, { id: entry.engineTypeId, engine_type: entry.engineType }])
      ).values()
    ]
    setEngineTypes(uniqueEngineTypes)

  }, [emissionEntries])

  const handleFilterApply = () => {
    if (!emissionEntries || emissionEntries.length === 0) {
      setFilteredEmissionEntries([])
      return
    }

    const filtered = emissionEntries.filter(entry => {
      let matchesFilters = true
      if(selectedFilterCategory.length > 0 ){
        matchesFilters = matchesFilters && selectedFilterCategory.includes(entry.category)
      }
      if (selectedLocation && selectedLocation.length > 0) {
        matchesFilters = matchesFilters && selectedLocation.includes(Number(entry.location))
      }

      if (selectedFilterPeriod && selectedFilterPeriod.length > 0) {
        matchesFilters = matchesFilters && selectedFilterPeriod.includes(entry.period)
      }

      if (entry.category === "stationary") {
        if (selectedStationaryFuelType && selectedStationaryFuelType.length > 0) {
          matchesFilters = matchesFilters && selectedStationaryFuelType.includes(entry.fuelTypeId)
        }

        if (selectedStationaryFuel && selectedStationaryFuel.length > 0) {
          matchesFilters = matchesFilters && selectedStationaryFuel.includes(entry.subFuelTypeId)
        }
      } else if (entry.category === "mobile") {
        if (selectedMobileFuel && selectedMobileFuel.length > 0) {
          matchesFilters = matchesFilters && selectedMobileFuel.includes(entry.fuelTypeId)
        }

        if (selectedTransportType && selectedTransportType.length > 0) {
          matchesFilters = matchesFilters && selectedTransportType.includes(entry.transportTypeId)
        }

        if (selectedEngineType && selectedEngineType.length > 0) {
          matchesFilters = matchesFilters && selectedEngineType.includes(entry.engineTypeId)
        }
      }
        
      if (selectedFilterFuelType && selectedFilterFuelType.length > 0) {
        matchesFilters = matchesFilters && selectedFilterFuelType.includes(entry.fuelTypeId)
      }

      if (selectedFilterSubFuel && selectedFilterSubFuel.length > 0) {
        matchesFilters = matchesFilters && selectedFilterSubFuel.includes(entry.subFuelTypeId)
      }

      return matchesFilters
    })

    setFilteredEmissionEntries(filtered)
  }

  const handleFilterReset = () => {
    setSelectedLocation([])
    setSelectedFilterPeriod([])
    setSelectedFilterFuelType([])
    setSelectedFilterSubFuel([])
    setFilterSubFuels([])
    
    setSelectedStationaryFuelType([])
    setSelectedStationaryFuel([])
    
    setSelectedMobileFuel([])
    setSelectedTransportType([])
    setSelectedEngineType([])
    
    setFilteredEmissionEntries([])
    setFuelError("")
  }

  useEffect(() => {
    if (selectedFilterFuelType && selectedFilterFuelType.length > 0 && getSubFuelTypes) {
      try {
        const subFuelTypes = getSubFuelTypes(selectedFilterFuelType[0])
        setFilterSubFuels(subFuelTypes || [])
      } catch (error) {
        console.warn("Error getting sub fuel types:", error)
        setFilterSubFuels([])
      }
    } else {
      setFilterSubFuels([])
    }
    
    setSelectedFilterSubFuel([])
  }, [selectedFilterFuelType])

  return {
    selectedFilterCategory,
    setSelectedFilterCategory,
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    filteredEmissionEntries,
    setFilteredEmissionEntries,
    fuelError,
    setFuelError,

    selectedFilterFuelType,
    setSelectedFilterFuelType,
    selectedFilterSubFuel,
    setSelectedFilterSubFuel,
    filterSubFuels,
    setFilterSubFuels,

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
  }
}