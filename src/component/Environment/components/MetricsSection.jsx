import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MetricCard from './MetricCard';

// Data calculation utilities
const calculateTotals = (data, companyFramework) => {
  if (!data || Object.keys(data).length === 0) {
    return {
      energy: { renewable: 0, nonRenewable: 0, total: 0 },
      emission: { scope1: 0, scope2: 0, total: 0 },
      water: { withdrawal: 0, discharge: 0, consumption: 0, total: 0 },
      waste: { generated: 0, recovered: 0, disposed: 0, total: 0 }
    };
  }

  // Framework 1 calculations
  if (companyFramework?.includes(1)) {
    return calculateFramework1Totals(data);
  }
  
  // Framework 48 calculations
  if (companyFramework?.includes(48)) {
    return calculateFramework48Totals(data);
  }

  return {
    energy: { renewable: 0, nonRenewable: 0, total: 0 },
    emission: { scope1: 0, scope2: 0, total: 0 },
    water: { withdrawal: 0, discharge: 0, consumption: 0, total: 0 },
    waste: { generated: 0, recovered: 0, disposed: 0, total: 0 }
  };
};

const calculateFramework1Totals = ({ energyData, waterData, wasteData, emissionData }) => {
  const energy = {
    renewable: energyData?.renewable?.total || 0,
    nonRenewable: energyData?.nonRenewable?.total || 0,
    total: 0
  };
  energy.total = energy.renewable + energy.nonRenewable;

  const emission = {
    scope1: emissionData?.scope1?.total || 0,
    scope2: emissionData?.scope2?.total || 0,
    total: 0
  };
  emission.total = emission.scope1 + emission.scope2;

  const water = {
    withdrawal: waterData?.withdrawal?.total || 0,
    discharge: waterData?.discharge?.total || 0,
    consumption: 0,
    total: 0
  };
  water.consumption = water.withdrawal - water.discharge;
  water.total = water.withdrawal;

  const waste = {
    generated: wasteData?.management?.total || 0,
    recovered: wasteData?.recovery?.total || 0,
    disposed: wasteData?.disposal?.total || 0,
    total: 0
  };
  waste.total = waste.generated;

  return { energy, emission, water, waste };
};

const calculateFramework48Totals = ({ energyData, waterData, wasteData, emissionData }) => {
  const energy = calculateFramework48EnergyTotals(energyData);
  const emission = calculateFramework48EmissionTotals(emissionData);
  const water = calculateFramework48WaterTotals(waterData);
  const waste = calculateFramework48WasteTotals(wasteData);

  return { energy, emission, water, waste };
};

const calculateFramework48EnergyTotals = (energyData) => {
  let renewable = 0;
  let nonRenewable = 0;

  if (energyData?.time) {
    Object.keys(energyData.time).forEach(location => {
      Object.keys(energyData.time[location]).forEach(fuelType => {
        const values = energyData.time[location][fuelType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        // Categorize fuel types
        const renewableFuels = [
          'Electricity consumption from Renewable energy (via PPA)',
          'Electricity consumption from Renewable energy (rooftop solar)'
        ];
        
        if (renewableFuels.includes(fuelType)) {
          renewable += total;
        } else {
          nonRenewable += total;
        }
      });
    });
  }

  return {
    renewable,
    nonRenewable,
    total: renewable + nonRenewable
  };
};

const calculateFramework48EmissionTotals = (emissionData) => {
  let scope1 = 0;
  let scope2 = 0;

  if (emissionData?.scope1?.time) {
    Object.keys(emissionData.scope1.time).forEach(location => {
      Object.keys(emissionData.scope1.time[location]).forEach(emissionType => {
        const values = emissionData.scope1.time[location][emissionType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        scope1 += total;
      });
    });
  }

  if (emissionData?.scope2?.time) {
    Object.keys(emissionData.scope2.time).forEach(location => {
      Object.keys(emissionData.scope2.time[location]).forEach(emissionType => {
        const values = emissionData.scope2.time[location][emissionType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        scope2 += total;
      });
    });
  }

  return {
    scope1,
    scope2,
    total: scope1 + scope2
  };
};

const calculateFramework48WaterTotals = (waterData) => {
  let withdrawal = 0;
  let treated = 0;

  if (waterData?.time) {
    Object.keys(waterData.time).forEach(location => {
      Object.keys(waterData.time[location]).forEach(waterType => {
        const values = waterData.time[location][waterType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        if (waterType.includes('consumption') || waterType.includes('Groundwater') || waterType.includes('surface water') || waterType.includes('Tanker')) {
          withdrawal += total;
        } else if (waterType.includes('treated') || waterType.includes('STP') || waterType.includes('ETP')) {
          treated += total;
        }
      });
    });
  }

  return {
    withdrawal,
    discharge: treated,
    consumption: withdrawal - treated,
    total: withdrawal
  };
};

const calculateFramework48WasteTotals = (wasteData) => {
  let generated = 0;
  let hazardous = 0;
  let nonHazardous = 0;

  if (wasteData?.time) {
    Object.keys(wasteData.time).forEach(location => {
      Object.keys(wasteData.time[location]).forEach(wasteType => {
        const values = wasteData.time[location][wasteType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        generated += total;
        
        if (wasteType.toLowerCase().includes('hazardous') && !wasteType.toLowerCase().includes('non-hazardous')) {
          hazardous += total;
        } else {
          nonHazardous += total;
        }
      });
    });
  }

  return {
    generated,
    recovered: 0, // Calculate based on your business logic
    disposed: 0, // Calculate based on your business logic
    total: generated,
    hazardous,
    nonHazardous
  };
};

// Main MetricsSection Component
const MetricsSection = ({
  energyData,
  waterData,
  wasteData,
  emissionData,
  isLoading,
  error,
  financialYearId,
  companyFramework,
  comparisonMode = false,
  previousPeriodData = null
}) => {
  // Calculate totals from dynamic data
  const currentTotals = calculateTotals({
    energyData,
    waterData,
    wasteData,
    emissionData
  }, companyFramework);

  // For comparison mode, calculate previous period totals
  const previousTotals = comparisonMode && previousPeriodData ? calculateTotals(previousPeriodData, companyFramework) : null;

  // Create metrics array
  const metrics = [
    {
      title: "Total Energy Consumption",
      value: currentTotals.energy.total,
      unit: "GJ",
      color: "blue",
      previousValue: comparisonMode ? previousTotals?.energy.total : undefined,
      change: comparisonMode && previousTotals ? 
        currentTotals.energy.total - previousTotals.energy.total : undefined
    },
    {
      title: "Total Emissions",
      value: currentTotals.emission.total,
      unit: "tCO2",
      color: "red",
      previousValue: comparisonMode ? previousTotals?.emission.total : undefined,
      change: comparisonMode && previousTotals ? 
        currentTotals.emission.total - previousTotals.emission.total : undefined
    },
    {
      title: "Water Consumption",
      value: currentTotals.water.consumption,
      unit: "KL",
      color: "teal",
      previousValue: comparisonMode ? previousTotals?.water.consumption : undefined,
      change: comparisonMode && previousTotals ? 
        currentTotals.water.consumption - previousTotals.water.consumption : undefined
    },
    {
      title: "Total Waste Generated",
      value: currentTotals.waste.total,
      unit: "MT",
      color: "orange",
      previousValue: comparisonMode ? previousTotals?.waste.total : undefined,
      change: comparisonMode && previousTotals ? 
        currentTotals.waste.total - previousTotals.waste.total : undefined
    },
    // {
    //   title: "Renewable Energy",
    //   value: currentTotals.energy.renewable,
    //   unit: "GJ",
    //   color: "purple",
    //   previousValue: comparisonMode ? previousTotals?.energy.renewable : undefined,
    //   change: comparisonMode && previousTotals ? 
    //     currentTotals.energy.renewable - previousTotals.energy.renewable : undefined
    // }
  ];

  if (error) {
    return (
      <Row className="mb-4">
        <Col>
          <div className="alert alert-danger" role="alert">
            Error loading metrics: {error}
          </div>
        </Col>
      </Row>
    );
  }

  if (!financialYearId) {
    return (
      <Row className="mb-4">
        <Col>
          <div className="text-center py-5 text-muted">
            <i className="fas fa-filter fa-2x mb-3"></i>
            <p>Please select Financial Year to view environmental metrics</p>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mb-4">
      <Col>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <MetricCard
                key={`loading-${index}`}
                title="Loading..."
                value="--"
                unit=""
                color="blue"
                isLoading={true}
              />
            ))
          ) : (
            metrics.map((metric, index) => (
              <MetricCard
                key={`metric-${index}`}
                {...metric}
              />
            ))
          )}
        </div>

    
      </Col>
    </Row>
  );
};

export default MetricsSection