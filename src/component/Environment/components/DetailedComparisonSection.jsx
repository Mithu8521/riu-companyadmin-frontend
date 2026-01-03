import React from 'react';
import { Card } from 'react-bootstrap';

const DetailedComparisonSection = ({
  currentPeriodData,
  previousPeriodData,
  isLoading = false,
  comparisonMode,
  twoYearComparisonMode,
  firstYearLabel = '2024',
  secondYearLabel = '2023'
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
            Detailed Comparison
          </h5>
        </Card.Header>
        <Card.Body style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!currentPeriodData || !previousPeriodData) {
    return null;
  }

  // Calculate totals for current period
  const calculateCurrentTotals = () => {
    const energy = calculateEnergyTotal(currentPeriodData.energyData);
    const emission = calculateEmissionTotal(currentPeriodData.emissionData);
    const water = calculateWaterTotal(currentPeriodData.waterData);
    const waste = calculateWasteTotal(currentPeriodData.wasteData);

    return { energy, emission, water, waste };
  };

  // Calculate totals for previous period
  const calculatePreviousTotals = () => {
    const energy = calculateEnergyTotal(previousPeriodData.energyData);
    const emission = calculateEmissionTotal(previousPeriodData.emissionData);
    const water = calculateWaterTotal(previousPeriodData.waterData);
    const waste = calculateWasteTotal(previousPeriodData.wasteData);

    return { energy, emission, water, waste };
  };

  const currentTotals = calculateCurrentTotals();
  const previousTotals = calculatePreviousTotals();

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? '100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(1)}%`;
  };

  const formatDifference = (current, previous) => {
    const diff = current - previous;
    return diff.toFixed(2);
  };

  const getChangeColor = (current, previous, isGoodWhenHigh = false) => {
    const diff = current - previous;
    if (diff > 0) {
      return isGoodWhenHigh ? '#10B981' : '#EF4444';
    } else if (diff < 0) {
      return isGoodWhenHigh ? '#EF4444' : '#10B981';
    }
    return '#6B7280';
  };

  const metrics = [
    {
      name: 'Total Energy (GJ)',
      currentValue: currentTotals.energy.total,
      previousValue: previousTotals.energy.total,
      isGoodWhenHigh: false
    },
    {
      name: 'Total Emissions (tCO2)',
      currentValue: currentTotals.emission.total,
      previousValue: previousTotals.emission.total,
      isGoodWhenHigh: false
    },
    {
      name: 'Water Consumption (KL)',
      currentValue: currentTotals.water.consumption,
      previousValue: previousTotals.water.consumption,
      isGoodWhenHigh: false
    },
    {
      name: 'Total Waste (MT)',
      currentValue: currentTotals.waste.total,
      previousValue: previousTotals.waste.total,
      isGoodWhenHigh: false
    },
    {
      name: 'Renewable Energy (GJ)',
      currentValue: currentTotals.energy.renewable,
      previousValue: previousTotals.energy.renewable,
      isGoodWhenHigh: true
    }
  ];

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
          Detailed Comparison
        </h5>
      </Card.Header>
      <Card.Body>
        {/* Comparison Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
              Current Period
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#3B82F6',
              marginBottom: '4px'
            }}>
              All Locations • All Periods • {firstYearLabel}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {calculateEntriesCount(currentPeriodData.energyData)} entries
            </div>
          </div>

          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#6B7280',
            margin: '0 30px'
          }}>
            VS
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
              Previous Period
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#3B82F6',
              marginBottom: '4px'
            }}>
              All Locations • All Periods • {secondYearLabel}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {calculateEntriesCount(previousPeriodData.energyData)} entries
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Metric</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#3B82F6' }}>Current Period</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Previous Period</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Difference</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>% Change</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const difference = formatDifference(metric.currentValue, metric.previousValue);
                const percentChange = calculatePercentageChange(metric.currentValue, metric.previousValue);
                const changeColor = getChangeColor(metric.currentValue, metric.previousValue, metric.isGoodWhenHigh);

                return (
                  <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 8px', fontWeight: '500', color: '#374151' }}>{metric.name}</td>
                    <td style={{ padding: '16px 8px', textAlign: 'center', color: '#3B82F6', fontWeight: '600' }}>
                      {metric.currentValue.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'center', color: '#374151' }}>
                      {metric.previousValue.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'center', color: changeColor, fontWeight: '500' }}>
                      {parseFloat(difference) > 0 ? '+' : ''}{difference}
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'center', color: changeColor, fontWeight: '600' }}>
                      {percentChange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#F8F9FA',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6B7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', borderRadius: '50%' }}></div>
              <span>Increase from previous period</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
              <span>Decrease from previous period</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- Helpers ---
const calculateEnergyTotal = (energyData) => {
  if (!energyData) return { renewable: 0, nonRenewable: 0, total: 0 };
  let renewable = 0, nonRenewable = 0;

  if (energyData.renewable?.total) renewable = energyData.renewable.total;
  if (energyData.nonRenewable?.total) nonRenewable = energyData.nonRenewable.total;

  if (energyData.time) {
    Object.keys(energyData.time).forEach(location => {
      Object.keys(energyData.time[location]).forEach(fuelType => {
        const values = energyData.time[location][fuelType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

        const renewableFuels = [
          'Electricity consumption from Renewable energy (via PPA)',
          'Electricity consumption from Renewable energy (rooftop solar)'
        ];

        if (renewableFuels.includes(fuelType)) renewable += total;
        else nonRenewable += total;
      });
    });
  }

  return { renewable, nonRenewable, total: renewable + nonRenewable };
};

const calculateEmissionTotal = (emissionData) => {
  if (!emissionData) return { scope1: 0, scope2: 0, total: 0 };
  let scope1 = 0, scope2 = 0;

  if (emissionData.scope1?.total) scope1 = emissionData.scope1.total;
  if (emissionData.scope2?.total) scope2 = emissionData.scope2.total;

  if (emissionData.time) {
    Object.keys(emissionData.time).forEach(location => {
      Object.keys(emissionData.time[location]).forEach(emissionType => {
        const values = emissionData.time[location][emissionType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

        const scope2Types = ['GRID electricity'];
        if (scope2Types.includes(emissionType)) scope2 += total;
        else scope1 += total;
      });
    });
  }

  return { scope1, scope2, total: scope1 + scope2 };
};

const calculateWaterTotal = (waterData) => {
  if (!waterData) return { withdrawal: 0, discharge: 0, consumption: 0 };
  let withdrawal = 0, discharge = 0;

  if (waterData.withdrawal?.total) withdrawal = waterData.withdrawal.total;
  if (waterData.discharge?.total) discharge = waterData.discharge.total;

  if (waterData.time) {
    Object.keys(waterData.time).forEach(location => {
      Object.keys(waterData.time[location]).forEach(waterType => {
        const values = waterData.time[location][waterType] || [];
        const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

        if (waterType.includes('consumption') || waterType.includes('Groundwater') || waterType.includes('surface water')) withdrawal += total;
        else if (waterType.includes('treated')) discharge += total;
      });
    });
  }

  return { withdrawal, discharge, consumption: withdrawal - discharge };
};

const calculateWasteTotal = (wasteData) => {
  if (!wasteData) return { total: 0 };
  let total = 0;

  if (wasteData.management?.total) total = wasteData.management.total;

  if (wasteData.time) {
    Object.keys(wasteData.time).forEach(location => {
      Object.keys(wasteData.time[location]).forEach(wasteType => {
        const values = wasteData.time[location][wasteType] || [];
        total += values.reduce((sum, val) => sum + (Number(val) || 0), 0);
      });
    });
  }

  return { total };
};

const calculateEntriesCount = (data) => {
  if (!data) return 0;
  if (data.time) return Object.keys(data.time).length;
  return 1;
};

export default DetailedComparisonSection;
