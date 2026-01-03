import React, { useEffect, useState, useMemo } from "react";

const EmissionCalculationResults = ({
  selectedScope,
  ghgProtocol,
  scopeData,
  selectedCategory,
  selectedMethod,
  selectedScope3Category,
  selectedDefraScope3ActivityType,
  formData,
  record,
  calculationResults,
  setCalculationResults
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // State for caching emission factors
  const [cachedEmissionFactor, setCachedEmissionFactor] = useState(null);
  const [lastCalculationKey, setLastCalculationKey] = useState('');

  // Memoize activity amount calculation
  const activityAmount = useMemo(() => {
    let amount = formData?.activityAmount;

    if (selectedScope === "SCOPE1") {
      if (selectedCategory === "mobile") {
        if (selectedMethod === "distance") {
          amount = amount || formData?.distanceTravelled;
        } else if (selectedMethod === "freight") {
          const freightWeight = Number(formData?.freightWeight) || 0;
          const distanceTravelled = Number(formData?.distanceTravelled) || 0;
          if (freightWeight && distanceTravelled) {
            amount = freightWeight * distanceTravelled;
          } else {
            amount = freightWeight || distanceTravelled || amount;
          }
        } else if (selectedMethod === "public_transport") {
          const passengerCount = Number(formData?.passengerCount) || 1;
          const distanceTravelled = Number(formData?.distanceTravelled) || 0;
          if (distanceTravelled) {
            amount = passengerCount * distanceTravelled;
          }
        } else if (selectedMethod === "fuel_use") {
          amount = amount || formData?.activityAmount;
        }
      } else if (selectedCategory === "fugitive") {
        if (selectedMethod === "mass_balance") {
          const initialQuantity = Number(formData?.initialQuantityInEquipmentUnit) || 0;
          const quantityPurchased = Number(formData?.quantityPurchased) || 0;
          const quantityRecovered = Number(formData?.quantityRecovered) || 0;

          if (initialQuantity || quantityPurchased || quantityRecovered) {
            amount = quantityPurchased - quantityRecovered;
          }
        } else {
          amount = Number(formData?.quantityReleased) || 0;
        }
      }
    }

    return amount;
  }, [formData, selectedMethod, selectedScope, selectedCategory, record]);

  // Create a key for caching calculations
  const calculationKey = useMemo(() => {
    return JSON.stringify({
      activityAmount,
      selectedCategory,
      selectedMethod,
      selectedScope,
      formData: formData || {},
      ghgProtocol,
      record
    });
  }, [activityAmount, selectedCategory, selectedMethod, selectedScope, formData, ghgProtocol, record]);

  // Validation effect
  useEffect(() => {
    const errors = [];

    if (!scopeData) {
      errors.push("Scope data is not available");
    }

    if (selectedScope === "SCOPE1") {
      if (selectedCategory === "mobile" && ghgProtocol === 'ipcc' && !selectedMethod) {
        errors.push("Calculation method is required for mobile emissions");
      }
      if (selectedCategory === "fugitive" && ghgProtocol === 'ipcc' && !selectedMethod) {
        errors.push("Calculation method is required for fugitive emissions");
      }
      if (selectedCategory === "stationary" && !formData?.fuelType) {
        errors.push("Fuel type is required for stationary emissions");
      }
      if (selectedCategory === "fugitive" && !formData?.refrigerant) {
        errors.push("Refrigerant type is required for fugitive emissions");
      }
      if(selectedCategory === 'fugitive' && ghgProtocol === 'ipcc' && activityAmount < 0) {
        errors.push('Quantity purchased must be greater than quantity recovered');
      }
    } else if (selectedScope === "SCOPE2") {
      if (selectedCategory === "defra_evs_scope2" && (!formData?.vehicleUseCategory || !formData.vehicleCategory || !formData.vehicleSize ) ) {
        errors.push("Vehicle Use Category/Vehicle Category/Vehicle Size is required for EV calculations");
      }
    } 

    if (!activityAmount || activityAmount <= 0) {
      errors.push("Activity amount must be greater than 0");
    }

    if (!record) {
      errors.push("No emission factor found.");
    }

    setValidationErrors(errors);
  }, [scopeData, activityAmount, selectedScope, selectedCategory, selectedMethod, formData, record]);

  // Emission factor calculation with caching
  useEffect(() => {
    const calculateEmissionFactor = async () => {
      // Skip if validation errors exist
      if (validationErrors.length > 0) {
        setCachedEmissionFactor(null);
        return;
      }

      // Use cached result if calculation key hasn't changed
      if (calculationKey === lastCalculationKey && cachedEmissionFactor !== null) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const emissionFactor = getEmissionFactor();
        setCachedEmissionFactor(emissionFactor);
        setLastCalculationKey(calculationKey);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
        setCachedEmissionFactor(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculateEmissionFactor();
  }, [calculationKey, validationErrors.length, lastCalculationKey, cachedEmissionFactor, record]);

  // Calculate results effect
  useEffect(() => {
    if (cachedEmissionFactor && activityAmount > 0 && validationErrors.length === 0) {      
      const FC = Number(activityAmount) || 0;
      const factor = Number(cachedEmissionFactor.factor) || 0;
      const bioGenicFactor = Number(cachedEmissionFactor.bioGenicFactor) || 0;

      const results = {
        co2Emissions: FC * factor,
        bioGenicEmissions: FC * bioGenicFactor,
        activityAmount: FC,
        emissionFactor: factor,
        bioGenicFactor: bioGenicFactor
      };

      setCalculationResults(results);
    } else {
      setCalculationResults(null);
    }
  }, [cachedEmissionFactor, activityAmount, validationErrors.length, record]);

  const formatNumber = (value) => {
    const num = Number(value);
    
    if (isNaN(num)) {
      return "0.00";
    }
    
    // Format to 4 decimal places
    const formattedNum = num.toFixed(4);
    
    // Split into integer and decimal parts
    const parts = formattedNum.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Apply Indian number formatting to integer part
    let formatted = '';
    const len = integerPart.length;
    
    if (len <= 3) {
      formatted = integerPart;
    } else {
      // Add commas in Indian style (first comma after 3 digits from right, then every 2 digits)
      formatted = integerPart.slice(-3); // Last 3 digits
      let remaining = integerPart.slice(0, -3); // Remaining digits
      
      while (remaining.length > 0) {
        if (remaining.length <= 2) {
          formatted = remaining + ',' + formatted;
          break;
        } else {
          formatted = remaining.slice(-2) + ',' + formatted;
          remaining = remaining.slice(0, -2);
        }
      }
    }
    
    // Return with decimal part
    return formatted + '.' + decimalPart;
  };

  const getEmissionFactor = () => {
    try {
      let emissionBioGenicFactor = null;

      if (!record) {
        throw new Error('No matching record found!');
      }

      if (selectedScope === 'SCOPE3') {
        if (!record.factor) {
          throw new Error('No emission factor found!');
        }
        return {
          factor: (isNaN(Number(record.factor)) ? null : Number(record.factor)),
          bioGenicFactor: null
        };
      }

      let emissionFactor = null;

      // Assign emissionFactor
      if (selectedScope === "SCOPE1") {
        if (selectedCategory === "mobile" && selectedMethod === "fuel_use") {
          const fuelUseCategory = formData?.fuelUseCategory;
          if (fuelUseCategory === "Fossil") {
            emissionFactor = record.fuelFossilCo2Ef;
            emissionBioGenicFactor = record.fuelBiogenicCo2Ef;
          } else if (fuelUseCategory === "Transport") {
            if (!isNaN(Number(record.fuelCh4Ef)) && !isNaN(Number(record.fuelN2oEf))) {
              emissionFactor = Number(record.fuelCh4Ef) + Number(record.fuelN2oEf);
            } else {
              emissionFactor = (isNaN(Number(record.fuelCh4Ef)) ? 0 : Number(record.fuelCh4Ef)) +
                (isNaN(Number(record.fuelN2oEf)) ? 0 : Number(record.fuelN2oEf));
            }
          }
        } else if (selectedCategory === "mobile" && selectedMethod === "distance") {
          emissionFactor = record.distanceCo2Ef;
        } else if (selectedCategory === "mobile" && selectedMethod === "freight") {
          emissionFactor = record.freightCo2Ef;
        } else if (selectedCategory === "mobile" && selectedMethod === "public_transport") {
          emissionFactor = record.publicCo2Ef;
        } else {
          emissionFactor = record.factor || record.factorFuel;
        }
      } else if (selectedScope === "SCOPE2") {
        if (selectedCategory === "defra_evs_scope2") {
          const vehicleType = formData?.vehicleType;
          if (vehicleType === "Hybrid Electric Vehicle") {
            emissionFactor = record.hybridElectricVehicleEf;
          } else if (vehicleType === "Battery Electric Vehicle") {
            emissionFactor = record.batteryElectricVehicleEf;
          } else {
            emissionFactor = record.hybridElectricVehicleEf || record.batteryElectricVehicleEf;
          }
        } else {
          emissionFactor = record.factor;
        }
      }

      if ((!emissionFactor || isNaN(Number(emissionFactor))) && (!emissionBioGenicFactor || isNaN(Number(emissionBioGenicFactor)))){
        throw new Error('No emission factors found.');
      }

      return {
        factor: (isNaN(Number(emissionFactor)) ? null : Number(emissionFactor)),
        bioGenicFactor: (isNaN(Number(emissionBioGenicFactor)) ? null : Number(emissionBioGenicFactor))
      };

    } catch (error) {
      console.error("Error getting emission factor:", error);
      throw error;
    }
  };

  const getCalculationLabels = () => {
    if (selectedScope === "SCOPE1") {
      if (selectedCategory === "mobile") {
        switch (selectedMethod) {
          case "distance":
            return {
              consumptionLabel: "Distance Travelled",
              consumptionUnit: formData?.unit || "km",
              factorLabel: "Emission Factor",
              factorUnit: "kgCO₂e/km",
            };
          case "freight":
            return {
              consumptionLabel: "Freight Activity",
              consumptionUnit: "tonne-km",
              factorLabel: "Emission Factor",
              factorUnit: "kgCO₂e/tonne-km",
            };
          case "public_transport":
            return {
              consumptionLabel: "Passenger Distance",
              consumptionUnit: "passenger-km",
              factorLabel: "Emission Factor",
              factorUnit: "kgCO₂e/passenger-km",
            };
          case "fuel_use":
            return {
              consumptionLabel: "Fuel Consumption",
              consumptionUnit: formData?.unit || "L",
              factorLabel: "Emission Factor",
              factorUnit: `kgCO₂e/${formData?.unit || "L"}`,
            };
          default:
            return {
              consumptionLabel: "Activity Amount",
              consumptionUnit: formData?.unit || "",
              factorLabel: "Emission Factor",
              factorUnit: `kgCO₂e/${formData?.unit || "L"}`,
            };
        }
      } else if (selectedCategory === "fugitive") {
        return {
          consumptionLabel: "Quantity Released",
          consumptionUnit: formData?.initialQuantityInEquipmentUnit || formData?.quantityReleasedUnit || "kg",
          factorLabel: "Global Warming Potential",
          factorUnit: "kgCO₂e/kg",
        };
      } else {
        return {
          consumptionLabel: "Activity Amount",
          consumptionUnit: formData?.unit || "L",
          factorLabel: "Emission Factor",
          factorUnit: `kgCO₂e/${formData?.unit || "L"}`,
        };
      }
    } else if (selectedScope === "SCOPE2") {
      if (selectedCategory === "defra_evs_scope2") {
        return {
          consumptionLabel: "Distance Travelled",
          consumptionUnit: formData?.unit || "km",
          factorLabel: "Emission Factor",
          factorUnit: `kgCO₂e/${formData?.unit || "km"}`,
        };
      } else {
        return {
          consumptionLabel: "Electricity Consumption",
          consumptionUnit: formData?.unit || "kWh",
          factorLabel: "Emission Factor",
          factorUnit: `kgCO₂e/${formData?.unit || "kWh"}`,
        };
      }
    } else if (selectedScope === 'SCOPE3') {
      return {
        consumptionLabel: "Activity Amount",
        consumptionUnit: formData?.unit,
        factorLabel: "Emission Factor",
        factorUnit: `kgCO₂e/${formData?.unit}`,
      };
    }

    return {
      consumptionLabel: "Activity Amount",
      consumptionUnit: formData?.unit || "units",
      factorLabel: "Emission Factor",
      factorUnit: "kgCO₂e/unit",
    };
  };

  const getErrorMessage = () => {
    if (validationErrors.length > 0) {
      return validationErrors[0]; // Show first error
    }
    
    if (error) {
      return error;
    }

    if (selectedScope !== 'SCOPE3' && !scopeData) {
      return "Loading emission data...";
    }

    if (!activityAmount || activityAmount <= 0) {
      return "Enter consumption/activity amount to see emission calculations";
    }

    if (!cachedEmissionFactor) {
      return "Complete all required fields to see emission calculations";
    }

    return null;
  };

  const labels = getCalculationLabels();
  const errorMessage = getErrorMessage();

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="text-muted text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          <small>Calculating emissions...</small>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorMessage) {
    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="text-muted text-center">
          <small>{errorMessage}</small>
        </div>
      </div>
    );
  }

  // Show results
  if (calculationResults) {
    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="row g-3">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">{labels.consumptionLabel}:</span>
                    <span className="fw-semibold">
                      {formatNumber(calculationResults.activityAmount)} {labels.consumptionUnit}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">{labels.factorLabel}:</span>
                    <span className="fw-semibold">
                      {formatNumber(calculationResults.emissionFactor)} {labels.factorUnit}
                    </span>
                  </div>

                  {calculationResults.bioGenicFactor > 0 && (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Bio-Genic Factor:</span>
                      <span className="fw-semibold">
                        {formatNumber(calculationResults.bioGenicFactor)} {labels.factorUnit}
                      </span>
                    </div>
                  )}

                  {selectedScope === "SCOPE2" &&
                    selectedCategory === "defra_evs_scope2" &&
                    formData?.vehicleType && (
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Vehicle Type:</span>
                        <span className="fw-semibold text-info">
                          {formData.vehicleType}
                        </span>
                      </div>
                    )}

                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-bold">
                      {selectedScope?.toUpperCase()} CO₂e Emissions:
                    </span>
                    <span className="fw-bold text-primary fs-5">
                      {formatNumber(calculationResults.co2Emissions)} kgCO₂e
                    </span>
                  </div>

                  {calculationResults.bioGenicEmissions > 0 && (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted fw-bold">
                        {selectedScope?.toUpperCase()} Bio-Genic Emissions:
                      </span>
                      <span className="fw-bold text-primary fs-5">
                        {formatNumber(calculationResults.bioGenicEmissions)} kgCO₂e
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EmissionCalculationResults;