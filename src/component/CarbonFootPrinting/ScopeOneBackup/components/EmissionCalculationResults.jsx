import React from "react";

const EmissionCalculationResults = ({
  consumption,
  category,
  formData = {},
  selectedMethod,
  scope1Data,
  ghgProtocol
}) => {
{console.log(formData,"formDataformData",consumption,category,formData)}
  if (!scope1Data) {
    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="text-muted text-center">
          <small>Loading emission data...</small>
        </div>
      </div>
    );
  }

  let activityAmount = consumption || formData?.activityAmount || formData?.consumption;
  
  if (category === "mobile") {
    if (selectedMethod === "distance") {
      activityAmount = activityAmount || formData?.distanceTravelled;
    } else if (selectedMethod === "freight") {
      const freightWeight = Number(formData?.freightWeight) || 0;
      const distanceTravelled = Number(formData?.distanceTravelled) || 0;
      if (freightWeight && distanceTravelled) {
        activityAmount = freightWeight * distanceTravelled;
      } else {
        activityAmount = freightWeight || distanceTravelled || activityAmount;
      }
    } else if (selectedMethod === "public_transport") {
      const passengerCount = Number(formData?.passengerCount) || 1;
      const distanceTravelled = Number(formData?.distanceTravelled) || 0;
      if (distanceTravelled) {
        activityAmount = passengerCount * distanceTravelled; // Passenger-km
      }
    } else if (selectedMethod === "fuel_use") {
      activityAmount = activityAmount || formData?.activityAmount;
    } else {
      activityAmount = activityAmount || formData?.activityAmount;
    }
  } else if (category === "fugitive") {
    // For fugitive emissions, calculate based on the mass balance approach
    const initialQuantity = Number(formData?.initialQuantity) || 0;
    const quantityPurchased = Number(formData?.quantityPurchased) || 0;
    const quantityRecovered = Number(formData?.quantityRecovered) || 0;
    
    // Mass balance: Initial + Purchased - Recovered = Emissions
    if (initialQuantity || quantityPurchased || quantityRecovered) {
      activityAmount = initialQuantity + quantityPurchased - quantityRecovered;
    }
  }
  
  
  if (!activityAmount || activityAmount <= 0) {
    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="text-muted text-center">
          <small>Enter consumption/activity amount to see emission calculations</small>
        </div>
      </div>
    );
  }

  const formatNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) ? num.toFixed(2) : "0.00";
  };

  const getEmissionFactor = () => {
    try {

      let dataSource;
      let records = [];
      
      if (category === "mobile" && selectedMethod) {
        dataSource = scope1Data[category][ghgProtocol]?.data?.[selectedMethod];
        if (selectedMethod === "fuel_use" && dataSource?.data) {
          const fuelUseCategory = formData?.fuelUseCategory;
          
          if (fuelUseCategory && dataSource.data[fuelUseCategory]?.records) {
            records = dataSource.data[fuelUseCategory].records;
          }
        } else if (dataSource?.records) {
          records = dataSource.records;
        }
      } else if (category === "stationary") {
        dataSource = scope1Data[category][ghgProtocol];
        if (dataSource?.data && Array.isArray(dataSource.data)) {
          records = dataSource.data;
        }
      } else if (category === "fugitive") {
        dataSource = scope1Data[category][ghgProtocol];
        if (dataSource?.data && Array.isArray(dataSource.data)) {
          records = dataSource.data;
        }
      } else{
        dataSource = scope1Data[category][ghgProtocol];
        if (dataSource?.data?.flatRecords) {
          records = dataSource?.data?.flatRecords;
        }
      }

      
      if (!records || records.length === 0) {
        return null;
      }

      let filteredRecords = [...records];
      
      let frontendFields = [];
      if (category === "mobile" && selectedMethod) {
        frontendFields = scope1Data[category][ghgProtocol]?.data?.[selectedMethod]?.frontendFields?.fields || [];
      } else {
        frontendFields = scope1Data[category][ghgProtocol]?.frontendFields?.fields || [];
      }
      
      const activityFields = [
        'activityAmount', 'distanceTravelled', 'freightWeight', 
        'passengerCount', 'initialQuantity', 'quantityPurchased', 'quantityRecovered',
        'consumption', 'unit', 'id', 'location', 'period', 'financialYear', 'isNew',
        'method', 'category', 'initialQuantityUnit', 'quantityPurchasedUnit', 'quantityRecoveredUnit'
      ];
      
      const filterableData = Object.entries(formData || {}).filter(([fieldName, fieldValue]) => {
        return fieldValue && 
               fieldValue !== "" && 
               !activityFields.includes(fieldName) &&
               typeof fieldValue === 'string';
      });

      filterableData.forEach(([fieldName, fieldValue]) => {
        const fieldConfig = frontendFields.find(f => f.name === fieldName);
        const backendField = fieldConfig?.backendField || fieldName;
        
        filteredRecords = filteredRecords.filter(record => {
          const recordValue = record[backendField];
          const matches = recordValue === fieldValue;
          return matches;
        });
        
      });


      if (filteredRecords.length === 0) {
        return null;
      }

      const matchingRecord = filteredRecords[0];

      let emissionFactor = null;
      
      if (category === "mobile" && selectedMethod === "fuel_use") {
        const fuelUseCategory = formData?.fuelUseCategory;
        if (fuelUseCategory === "Fossil") {
          emissionFactor = matchingRecord.fuelFossilCo2Ef;
        } else if (fuelUseCategory === "Transport") {
          emissionFactor = matchingRecord.fuelCh4Ef || matchingRecord.fuelN2oEf;
        }
      } else if (category === "mobile" && selectedMethod === "distance") {
        emissionFactor = matchingRecord.distanceCo2Ef;
      } else if (category === "mobile" && selectedMethod === "freight") {
        emissionFactor = matchingRecord.freightCo2Ef;
      } else if (category === "mobile" && selectedMethod === "public_transport") {
        emissionFactor = matchingRecord.publicCo2Ef;
      } else {
        emissionFactor = matchingRecord.factor || matchingRecord.factorFuel;
      }

      return emissionFactor;

    } catch (error) {
      return null;
    }
  };

  const emissionFactor = getEmissionFactor();
  
  if (!emissionFactor || emissionFactor <= 0) {
    let message = "Complete all required fields to see emission calculations";
    
    if (category === "stationary") {
      if (!formData?.fuelType) {
        message = "Select fuel type to see emission calculations";
      } else if (!formData?.fuel) {
        message = "Select specific fuel to see emission calculations";
      } else {
        message = "No emission factor found for the selected combination";
      }
    } else if (category === "mobile") {
      if (!selectedMethod) {
        message = "Select calculation method to see emission calculations";
      } else if (selectedMethod === "distance") {
        if (!formData?.vehicleType) {
          message = "Select vehicle type to see calculations";
        } else if (!formData?.fuelType) {
          message = "Select fuel type to see calculations";
        } else if (!formData?.vehicleSize) {
          message = "Select vehicle size to see calculations";
        } else {
          message = "No emission factor found for the selected vehicle configuration";
        }
      } else if (selectedMethod === "freight") {
        if (!formData?.vehicle) {
          message = "Select vehicle type to see calculations";
        } else if (!formData?.fuel) {
          message = "Select fuel type to see calculations";
        } else {
          message = "No emission factor found for the selected freight configuration";
        }
      } else if (selectedMethod === "public_transport") {
        if (!formData?.transportType) {
          message = "Select transport type to see calculations";
        } else {
          message = "No emission factor found for the selected transport type";
        }
      } else if (selectedMethod === "fuel_use") {
        if (!formData?.fuelUseCategory) {
          message = "Select fuel use category to see calculations";
        } else if (!formData?.fuel) {
          message = "Select fuel type to see calculations";
        } else {
          message = "No emission factor found for the selected fuel configuration";
        }
      }
    } else if (category === "fugitive") {
      if (!formData?.refrigerant) {
        message = "Select refrigerant type to see emission calculations";
      } else {
        message = "No emission factor found for the selected refrigerant";
      }
    }

    return (
      <div className="mt-3 p-4 rounded-lg bg-light border">
        <div className="text-muted text-center">
          <small>{message}</small>
        </div>
      </div>
    );
  }

  const FC = Number(activityAmount) || 0;
  const factor = Number(emissionFactor) || 0;
  const co2Emissions = FC * factor;


  const getCalculationLabels = () => {
    if (category === "mobile") {
      switch (selectedMethod) {
        case "distance":
          return {
            consumptionLabel: "Distance Travelled",
            consumptionUnit: formData?.unit || "km",
            factorLabel: "Emission Factor",
            factorUnit: "kgCO₂e/km"
          };
        case "freight":
          return {
            consumptionLabel: "Freight Activity",
            consumptionUnit: "tonne-km",
            factorLabel: "Emission Factor", 
            factorUnit: "kgCO₂e/tonne-km"
          };
        case "public_transport":
          return {
            consumptionLabel: "Passenger Distance",
            consumptionUnit: "passenger-km",
            factorLabel: "Emission Factor",
            factorUnit: "kgCO₂e/passenger-km"
          };
        case "fuel_use":
          return {
            consumptionLabel: "Fuel Consumption",
            consumptionUnit: formData?.unit || "L",
            factorLabel: "Emission Factor",
            factorUnit: `kgCO₂e/${formData?.unit || "L"}`
          };
        default:
          return {
            consumptionLabel: "Activity Amount",
            consumptionUnit: formData?.unit || "",
            factorLabel: "Emission Factor",
            factorUnit: "kgCO₂e/unit"
          };
      }
    } else if (category === "fugitive") {
      return {
        consumptionLabel: "Net Emissions",
        consumptionUnit: formData?.initialQuantityUnit || "kg",
        factorLabel: "Global Warming Potential",
        factorUnit: "kgCO₂e/kg"
      };
    } else {
      return {
        consumptionLabel: "Activity Amount", 
        consumptionUnit: formData?.unit || "L",
        factorLabel: "Emission Factor",
        factorUnit: `kgCO₂e/${formData?.unit || "L"}`
      };
    }
  };

  const labels = getCalculationLabels();

  return (
    <div className="mt-3 p-4 rounded-lg bg-light border">
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex flex-column gap-3">                     
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-bold">CO2e Emissions:</span>
                  <span className="fw-bold text-primary fs-5">
                    {formatNumber(co2Emissions)} kgCO₂e
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionCalculationResults;