import React from 'react';
import { Card } from 'react-bootstrap';

const DataEntriesTable = ({
  entriesData,
  comparisonEntriesData,
  isLoading = false,
  comparisonMode,
  twoYearComparisonMode,
  filters
}) => {
  if (isLoading) {
    return (
      <div>
        <h6 style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Data Entries <span style={{ fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>
            (Loading...)
          </span>
        </h6>
        <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!entriesData || entriesData.length === 0) {
    return (
      <div>
        <h6 style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
          Data Entries <span style={{ fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>
            (No entries available)
          </span>
        </h6>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#6B7280',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          backgroundColor: '#F9FAFB'
        }}>
          <i className="fas fa-table fa-2x mb-3"></i>
          <p>No data entries available for the selected filters</p>
          <small>Try adjusting your filter criteria</small>
        </div>
      </div>
    );
  }

  const formatFilterInfo = () => {
    const year = filters?.year || '2024';
    const totalEntries = entriesData?.length || 0;
    return `(${totalEntries} entries for ${year})`;
  };

  const formatComparisonInfo = () => {
    const year = filters?.comparisonYear || '2023';
    const entries = comparisonEntriesData?.length || 0;
    return `(${entries} entries)`;
  };

  return (
    <div>
      <h6 style={{ color: '#374151', fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        Data Entries <span style={{ fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>
          {formatFilterInfo()}
        </span>
      </h6>

      {/* Main Data Entries Table */}
      <div style={{ overflowX: 'auto', marginBottom: (comparisonMode || twoYearComparisonMode) ? '40px' : '0' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          border: '1px solid #E5E7EB',
          borderRadius: '8px'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th style={{
                padding: '12px 8px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Location
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Frequency
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Period
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Year
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Energy (GJ)
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Emission (tCO2)
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Water (KL)
              </th>
              <th style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#374151'
              }}>
                Waste (MT)
              </th>
            </tr>
          </thead>
          <tbody>
            {entriesData.map((entry, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #F3F4F6',
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                }}
              >
                <td style={{
                  padding: '12px 8px',
                  fontWeight: '500',
                  color: '#374151',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.location}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#6B7280',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.frequency}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#6B7280',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.period}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#6B7280',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.year}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: '500',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.energy?.toLocaleString() || '0'}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: '500',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.emission?.toLocaleString() || '0'}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: '500',
                  borderRight: '1px solid #E5E7EB'
                }}>
                  {entry.water?.toLocaleString() || '0'}
                </td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  {entry.waste?.toLocaleString() || '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Data Table */}
      {(comparisonMode || twoYearComparisonMode) && comparisonEntriesData && comparisonEntriesData.length > 0 && (
        <>
          <h6 style={{
            color: '#374151',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            marginTop: '30px'
          }}>
            Comparison Data for {filters?.comparisonYear || '2023'} <span style={{
              fontSize: '14px',
              fontWeight: '400',
              color: '#6B7280'
            }}>
              {formatComparisonInfo()}
            </span>
          </h6>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F0F9FF' }}>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Location
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Frequency
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Period
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Year
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Energy (GJ)
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Emission (tCO2)
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    Water (KL)
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Waste (MT)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonEntriesData.map((entry, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F0F9FF'
                    }}
                  >
                    <td style={{
                      padding: '12px 8px',
                      fontWeight: '500',
                      color: '#374151',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.location}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#6B7280',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.frequency}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#6B7280',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.period}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#6B7280',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.year}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '500',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.energy?.toLocaleString() || '0'}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '500',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.emission?.toLocaleString() || '0'}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '500',
                      borderRight: '1px solid #E5E7EB'
                    }}>
                      {entry.water?.toLocaleString() || '0'}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {entry.waste?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

function mergeAndSumResponses(response, period = null, selector = "ALL") {
  if (!response || typeof response !== "object") {
    return period ? 0 : { total: 0, periodWiseTotals: {} };
  }

  const keys = Object.keys(response);
  let keysToProcess;

  if (selector === "ALL") {
    keysToProcess = keys; // all categories
  } else if (Array.isArray(selector)) {
    keysToProcess = selector
      .map(i => keys[i - 1]) // 1-based index
      .filter(Boolean);
  } else {
    keysToProcess = [];
  }

  const combined = {
    total: 0,
    periodWiseTotals: {}
  };

  keysToProcess.forEach(key => {
    const section = response[key];
    if (section && section.periodWiseTotals) {
      combined.total += Number(section.total || 0);

      Object.entries(section.periodWiseTotals).forEach(([p, value]) => {
        combined.periodWiseTotals[p] =
          (combined.periodWiseTotals[p] || 0) + Number(value || 0);
      });
    }
  });

  if (period) {
    return combined.periodWiseTotals[period] || 0;
  }

  return combined;
}

// Data transformation utilities
const transformDataToEntries = (
  energyData,
  waterData,
  wasteData,
  emissionData,
  selectedLocations,
  locationOptions,
  selectedPeriodsValue,
  companyFramework,
  frequency
) => {
  const entries = [];

  // Transform based on framework
  if (companyFramework?.includes(1)) {
    // Framework 1 transformation
    const locations = locationOptions.filter(loc => selectedLocations.includes(loc.value));

    locations.forEach(location => {
      selectedPeriodsValue.forEach(period => {
        const entry = {
          location: location.label,
          frequency: frequency || 'Monthly',
          period: period.showLevel || 'Unknown',
          year: new Date(period.fromDate).getFullYear(),
          energy: mergeAndSumResponses(energyData, period.fromDate,'ALL'),
          emission: mergeAndSumResponses(emissionData, period.fromDate,'ALL'),
          water: mergeAndSumResponses(waterData, period.fromDate,[1]),
          waste: mergeAndSumResponses(wasteData, period.fromDate,[1]),
        };
        entries.push(entry);
      });
    });
  } else if (companyFramework?.includes(48)) {
    // Framework 48 transformation
    const locations = locationOptions.filter(loc => selectedLocations.includes(loc.value));

    locations.forEach(location => {
      selectedPeriodsValue.forEach(period => {
        const entry = {
          location: location.label,
          frequency: frequency || 'Monthly',
          period: period.showLevel || 'Unknown',
          year: new Date(period.fromDate).getFullYear(),
          energy: mergeAndSumResponses(energyData, period.fromDate),
          emission: mergeAndSumResponses(emissionData, period.fromDate),
          water: mergeAndSumResponses(waterData, period.fromDate),
          waste: mergeAndSumResponses(wasteData, period.fromDate),
        };
        entries.push(entry);
      });
    });
  }
  return entries;
};
const DataEntriesSection = ({
  energyData,
  waterData,
  wasteData,
  emissionData,
  isLoading,
  error,
  comparisonMode,
  twoYearComparisonMode,
  selectedLocations,
  locationOptions,
  selectedPeriodsValue,
  financialYearId,
  getFinancialYearById,
  companyFramework,
  frequency
}) => {
  // Transform data to entries format
  const entriesData = React.useMemo(() => {
    if (!energyData || !selectedLocations.length || !selectedPeriodsValue.length) {
      return [];
    }

    return transformDataToEntries(
      energyData,
      waterData,
      wasteData,
      emissionData,
      selectedLocations,
      locationOptions,
      selectedPeriodsValue,
      companyFramework,
      frequency
    );
  }, [energyData, waterData, wasteData, emissionData, selectedLocations, locationOptions, selectedPeriodsValue, companyFramework]);

  // Generate comparison entries (implement similar logic for previous period data)
  const comparisonEntriesData = React.useMemo(() => {
    if (!comparisonMode && !twoYearComparisonMode) {
      return [];
    }

    // This would be similar transformation but for previous period data
    // You would pass previous period's environmental data here
    return [];
  }, [comparisonMode, twoYearComparisonMode]);

  if (error) {
    return (
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Data Entries</h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-danger" role="alert">
            Error loading data entries: {error}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Data Entries</h5>
      </Card.Header>
      <Card.Body>
        <DataEntriesTable
          entriesData={entriesData}
          comparisonEntriesData={comparisonEntriesData}
          isLoading={isLoading}
          comparisonMode={comparisonMode}
          twoYearComparisonMode={twoYearComparisonMode}
          filters={{
            year: getFinancialYearById(financialYearId)?.split('-')[0] || '2024',
            comparisonYear: '2023' // Implement based on your comparison logic
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default DataEntriesSection;