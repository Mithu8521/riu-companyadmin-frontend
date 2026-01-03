import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';

import { generateTimePeriodOptions, getStartingMonth } from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import { fetchFramework, fetchFrequency, getEnvironmentData, getFinancialYear, getSource } from '../Training/training-dashboard/services/trainingService';

import FilterSection from './components/FilterSection';

const MetricCard = ({
  title,
  value,
  unit,
  color,
  previousValue,
  previousUnit,
  change,
  periodLabel = "Previous",
  isLoading = false
}) => {
  const getColorClass = (colorName) => {
    const colors = {
      blue: "#3B82F6",
      red: "#EF4444",
      teal: "#14B8A6",
      orange: "#F97316",
      purple: "#7C3AED"
    };
    return colors[colorName] || colors.blue;
  };

  const formatChange = (changeValue) => {
    if (changeValue === undefined || changeValue === null) return null;
    const sign = changeValue >= 0 ? '+' : '';
    return `(${sign}${changeValue})`;
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
          minHeight: "120px",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        minWidth: "200px",
        height: "fit-content"
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: getColorClass(color),
          marginBottom: previousValue !== undefined ? "12px" : "0",
        }}
      >
        {value} {unit}
      </div>

      {previousValue !== undefined && (
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <span>
            {periodLabel}: {previousValue} {previousUnit || unit}
          </span>
          {change !== undefined && (
            <span
              style={{
                marginLeft: "8px",
                color: change < 0 ? "#10B981" : "#EF4444",
                fontWeight: "500"
              }}
            >
              {formatChange(change)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const ChartContainer = ({ title, children, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
            {title}
          </h5>
        </Card.Header>
        <Card.Body style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
          {title}
        </h5>
      </Card.Header>
      <Card.Body style={{ height: '350px' }}>
        {children}
      </Card.Body>
    </Card>
  );
};

const EnergyChart = ({ data, isLoading, isComparison = false }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isComparison ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Renewable Energy', 'Total Energy Consumption'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Energy in GJ',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: isComparison ? ['#3b82f6', '#1e40af'] : ['#3b82f6']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " GJ"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: isComparison,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  let series;
  if (isComparison && data?.comparison) {
    series = [
      {
        name: data.comparison.firstYearLabel || 'First Year',
        data: [data.comparison.firstYear.renewableEnergy, data.comparison.firstYear.totalEnergyConsumption]
      },
      {
        name: data.comparison.secondYearLabel || 'Second Year',
        data: [data.comparison.secondYear.renewableEnergy, data.comparison.secondYear.totalEnergyConsumption]
      }
    ];
  } else {
    series = [{
      name: 'Energy',
      data: data ? [data.renewableEnergy, data.totalEnergyConsumption] : [0, 0]
    }];
  }

  return (
    <ChartContainer title="Energy Consumption Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

const EmissionsChart = ({ data, isLoading, isComparison = false }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isComparison ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Scope 1 Emission', 'Scope 2 Emission', 'Total Emission'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Emission in tCO2',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: isComparison ? ['#ef4444', '#dc2626'] : ['#ef4444']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tCO2"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: isComparison,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  let series;
  if (isComparison && data?.comparison) {
    series = [
      {
        name: data.comparison.firstYearLabel || 'First Year',
        data: [data.comparison.firstYear.scope1Emission, data.comparison.firstYear.scope2Emission, data.comparison.firstYear.totalEmission]
      },
      {
        name: data.comparison.secondYearLabel || 'Second Year',
        data: [data.comparison.secondYear.scope1Emission, data.comparison.secondYear.scope2Emission, data.comparison.secondYear.totalEmission]
      }
    ];
  } else {
    series = [{
      name: 'Emission',
      data: data ? [data.scope1Emission, data.scope2Emission, data.totalEmission] : [0, 0, 0]
    }];
  }

  return (
    <ChartContainer title="Emissions Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

const WaterChart = ({ data, isLoading, isComparison = false }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isComparison ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Water Withdrawal', 'Water Discharged', 'Water Consumption'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Water in KL',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: isComparison ? ['#14b8a6', '#0d9488'] : ['#14b8a6']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " KL"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: isComparison,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  let series;
  if (isComparison && data?.comparison) {
    series = [
      {
        name: data.comparison.firstYearLabel || 'First Year',
        data: [data.comparison.firstYear.waterWithdrawal, data.comparison.firstYear.waterDischarged, data.comparison.firstYear.waterConsumption]
      },
      {
        name: data.comparison.secondYearLabel || 'Second Year',
        data: [data.comparison.secondYear.waterWithdrawal, data.comparison.secondYear.waterDischarged, data.comparison.secondYear.waterConsumption]
      }
    ];
  } else {
    series = [{
      name: 'Water',
      data: data ? [data.waterWithdrawal, data.waterDischarged, data.waterConsumption] : [0, 0, 0]
    }];
  }

  return (
    <ChartContainer title="Water Management Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

const WasteManagementChart = ({ data, isLoading, isComparison = false }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isComparison ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Total Waste Generated', 'Total Waste Recovered'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Waste in MT',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: isComparison ? ['#f97316', '#ea580c'] : ['#f97316']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " MT"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: isComparison,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  let series;
  if (isComparison && data?.comparison) {
    series = [
      {
        name: data.comparison.firstYearLabel || 'First Year',
        data: [data.comparison.firstYear.totalWasteGenerated, data.comparison.firstYear.totalWasteRecovered]
      },
      {
        name: data.comparison.secondYearLabel || 'Second Year',
        data: [data.comparison.secondYear.totalWasteGenerated, data.comparison.secondYear.totalWasteRecovered]
      }
    ];
  } else {
    series = [{
      name: 'Waste',
      data: data ? [data.totalWasteGenerated, data.totalWasteRecovered] : [0, 0]
    }];
  }

  return (
    <ChartContainer title="Waste Management Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

const WasteTypesChart = ({ data, isLoading, isComparison = false }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isComparison ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Hazardous Waste', 'Non-Hazardous Waste'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Waste in MT',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    fill: {
      opacity: 1,
      colors: isComparison ? ['#7c3aed', '#6d28d9'] : ['#7c3aed']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " MT"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: isComparison,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  let series;
  if (isComparison && data?.comparison) {
    series = [
      {
        name: data.comparison.firstYearLabel || 'First Year',
        data: [data.comparison.firstYear.hazardousWaste, data.comparison.firstYear.nonHazardousWaste]
      },
      {
        name: data.comparison.secondYearLabel || 'Second Year',
        data: [data.comparison.secondYear.hazardousWaste, data.comparison.secondYear.nonHazardousWaste]
      }
    ];
  } else {
    series = [{
      name: 'Waste Types',
      data: data ? [data.hazardousWaste, data.nonHazardousWaste] : [0, 0]
    }];
  }

  return (
    <ChartContainer title="Waste Types Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

const DataEntriesTable = ({
  entriesData,
  comparisonEntriesData,
  isLoading = false,
  comparisonMode,
  twoYearComparisonMode,
  filters
}) => {
  console.log('DataEntriesTable props:', { entriesData, isLoading, entriesDataLength: entriesData?.length });

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
    const filteredEntries = entriesData?.length || 0;
    return `(Filtered: ${filteredEntries} of ${totalEntries} entries for ${year})`;
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

const DetailedComparison = ({
  comparisonData,
  isLoading = false,
  comparisonMode,
  twoYearComparisonMode,
  firstYearData,
  secondYearData
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

  if (!comparisonData) {
    return null;
  }

  const calculatePercentageChange = (firstValue, secondValue) => {
    if (secondValue === 0) return firstValue > 0 ? '100%' : '0%';
    const change = ((firstValue - secondValue) / secondValue) * 100;
    return `${change.toFixed(1)}%`;
  };

  const formatDifference = (firstValue, secondValue) => {
    const diff = firstValue - secondValue;
    return diff.toFixed(2);
  };

  const getChangeColor = (firstValue, secondValue, isGoodWhenHigh = false) => {
    const diff = firstValue - secondValue;
    if (diff > 0) {
      return isGoodWhenHigh ? '#10B981' : '#EF4444'; // Green if good when high, red otherwise
    } else if (diff < 0) {
      return isGoodWhenHigh ? '#EF4444' : '#10B981'; // Red if good when high, green otherwise
    }
    return '#6B7280'; // Gray for no change
  };

  const metrics = [
    {
      name: 'Total Energy (GJ)',
      firstValue: comparisonData.comparison?.firstYear?.totalEnergyConsumption || 0,
      secondValue: comparisonData.comparison?.secondYear?.totalEnergyConsumption || 0,
      isGoodWhenHigh: false
    },
    {
      name: 'Total Emissions (tCO2)',
      firstValue: comparisonData.comparison?.firstYear?.totalEmission || 0,
      secondValue: comparisonData.comparison?.secondYear?.totalEmission || 0,
      isGoodWhenHigh: false
    },
    {
      name: 'Total Water (KL)',
      firstValue: comparisonData.comparison?.firstYear?.waterConsumption || 0,
      secondValue: comparisonData.comparison?.secondYear?.waterConsumption || 0,
      isGoodWhenHigh: false
    },
    {
      name: 'Total Waste (MT)',
      firstValue: comparisonData.comparison?.firstYear?.totalWasteGenerated || 0,
      secondValue: comparisonData.comparison?.secondYear?.totalWasteGenerated || 0,
      isGoodWhenHigh: false
    },
    {
      name: 'Renewable Energy (GJ)',
      firstValue: comparisonData.comparison?.firstYear?.renewableEnergy || 0,
      secondValue: comparisonData.comparison?.secondYear?.renewableEnergy || 0,
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
              First Period
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#3B82F6',
              marginBottom: '4px'
            }}>
              All Locations • All Months • {comparisonData.comparison?.firstYearLabel || '2024'}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {firstYearData?.entries || 7} entries
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
              Second Period
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#3B82F6',
              marginBottom: '4px'
            }}>
              All Locations • All Months • {comparisonData.comparison?.secondYearLabel || '2023'}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {secondYearData?.entries || 3} entries
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
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Metric
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#3B82F6'
                }}>
                  First Period
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Second Period
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Difference
                </th>
                <th style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  % Change
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const difference = formatDifference(metric.firstValue, metric.secondValue);
                const percentChange = calculatePercentageChange(metric.firstValue, metric.secondValue);
                const changeColor = getChangeColor(metric.firstValue, metric.secondValue, metric.isGoodWhenHigh);

                return (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      '&:hover': { backgroundColor: '#F9FAFB' }
                    }}
                  >
                    <td style={{
                      padding: '16px 8px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {metric.name}
                    </td>
                    <td style={{
                      padding: '16px 8px',
                      textAlign: 'center',
                      color: '#3B82F6',
                      fontWeight: '600'
                    }}>
                      {metric.firstValue.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '16px 8px',
                      textAlign: 'center',
                      color: '#374151'
                    }}>
                      {metric.secondValue.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '16px 8px',
                      textAlign: 'center',
                      color: changeColor,
                      fontWeight: '500'
                    }}>
                      {parseFloat(difference) > 0 ? '+' : ''}{difference}
                    </td>
                    <td style={{
                      padding: '16px 8px',
                      textAlign: 'center',
                      color: changeColor,
                      fontWeight: '600'
                    }}>
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
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#EF4444',
                borderRadius: '50%'
              }}></div>
              <span>Increase from previous period</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#10B981',
                borderRadius: '50%'
              }}></div>
              <span>Decrease from previous period</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const ESGEnvironmentDashboard = () => {
  const [financialYearId, setFinancialYearId] = useState('');
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedPeriodsValue, setSelectedPeriodsValue] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [frequency, setFrequency] = useState('monthly');
  const [firstEnvironmentData, setFirstAllEnvironmentData] = useState([]);
  const [SecondEnvironmentData, setSecondAllEnvironmentData] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [twoYearComparisonMode, setTwoYearComparisonMode] = useState(false);
  const [firstYearLocation, setFirstYearLocation] = useState([]);
  const [firstYearPeriods, setFirstYearPeriods] = useState([]);
  const [firstFinancialYearId, setFirstFinancialYearId] = useState('');
  const [secondYearLocation, setSecondYearLocation] = useState([]);
  const [secondYearPeriods, setSecondYearPeriods] = useState([]);
  const [secondFinancialYearId, setSecondFinancialYearId] = useState('');

  const [metricsData, setMetricsData] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);

  const [chartsData, setChartsData] = useState(null);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [chartsError, setChartsError] = useState(null);

  const [entriesData, setEntriesData] = useState([]);
  const [comparisonEntriesData, setComparisonEntriesData] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState(null);

  const calculateEnvironment = async (rowData) => {
    if (companyFramework && companyFramework.includes(1)) {
      // this below code is for energy
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);

      const energyRenew =
        rowData?.filter(
          (item) => item.title === "Energy Consumption from Renewable Sources"
        ) || [];
      const nonEnergyRenew =
        rowData?.filter(
          (item) =>
            item.title === "Energy Consumption from Non-renewable Sources"
        ) || [];

      // Safeguard against undefined timePeriodsArray
      const newEnergyRenew = energyRenew.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newNonEnergyRenew = nonEnergyRenew.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalEnergy = newEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonEnergy = newNonEnergyRenew.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setRenewableEnergy(finalEnergy);
      setNonRenewableEnergy(finalNonEnergy);

      if (!Array.isArray(finalEnergy) || finalEnergy.length === 0) {
        setTotalConsumptionRenewable(0);
        return;
      }

      const firstObject = finalEnergy[0];

      // Extract all the rows but skip the first one
      const rowOptions = firstObject.question_details
        .filter((detail) => detail.option_type === "row") // Filter by "row" option_type
        .slice(1) // Skip the first row
        .map((detail) => detail.option)
        .reverse(); // Extract the "option" values

      const aggregatedValuesEnergy = rowOptions.map((_, index) =>
        finalEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[0];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      const totalEnergy = aggregatedValuesEnergy.reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalConsumptionRenewable(totalEnergy);
      const firstObjectNon = finalNonEnergy[0];

      // Extract all the rows but skip the first one
      const rowOptionsNon = firstObjectNon.question_details
        .filter((detail) => detail.option_type === "row") // Filter by "row" option_type
        .slice(1) // Skip the first row
        .map((detail) => detail.option)
        .reverse(); // Extract the "option" values

      const aggregatedValuesNon = rowOptionsNon.map((_, index) =>
        finalNonEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[0];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      const totalNon = aggregatedValuesNon.reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalConsumptionNonRenewable(totalNon);

      const aggregatedValuesEmission = rowOptionsNon.map((_, index) =>
        finalNonEnergy.reduce((acc, obj) => {
          const value =
            obj.energyAndEmission &&
            Array.isArray(obj.energyAndEmission) &&
            obj.energyAndEmission[index]?.[1];
          return (
            acc +
            (value === "NA" || !value || value === "No" || value === "Yes"
              ? 0
              : parseFloat(value || 0))
          );
        }, 0)
      );

      // Scope 2: Only consider the 0th index
      const totalEmissionScope2 = aggregatedValuesEmission[0] || 0;

      // Scope 1: Sum all other indices (excluding index 0)
      const totalEmissionScope1 = aggregatedValuesEmission
        .slice(1)
        .reduce((sum, value) => sum + value, 0);
      setTotalScope2(totalEmissionScope2);
      setTotalScope1(totalEmissionScope1);
      //this below code is for waste

      const newWasteType =
        rowData?.filter((item) => item.title === "Waste Management") || [];
      const newWasteDischarge =
        rowData?.filter((item) => item.title === "Waste Disposal") || [];
      const newWasteRecovery =
        rowData?.filter((item) => item.title === "Waste Recovery") || [];

      // Update state with filtered data

      // Filter matched data based on time periods
      const newMatchedDataWaste = newWasteType.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const newMatchedDataWasteDischarge = newWasteDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const wasteRecovery = newWasteRecovery.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalWaste = newMatchedDataWaste.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyTwo = newMatchedDataWasteDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalEnergyThree = wasteRecovery.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setWasteDisposal(finalEnergyTwo);
      setMatchedDataWaste(finalWaste);
      setWasteRecovered(finalEnergyThree);

      // Calculate total sum for waste management
      const aggregatedWaste = wasteSeries.reduce((acc, wasteType) => {
        acc[wasteType] = 0; // Initialize each waste type with 0
        return acc;
      }, {});

      let sum = 0;
      finalWaste.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (wasteSeries[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedWaste[wasteSeries[index]] += numericValue;
            sum += numericValue; // Add to total sum
          }
        });
      });

      setTotalSum(sum);

      // Calculate total sum for waste disposal
      const aggregatedTwo = wasteSeriesTwo.reduce((acc, disposalType) => {
        acc[disposalType] = 0; // Initialize each disposal type with 0
        return acc;
      }, {});

      finalEnergyTwo.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (wasteSeriesTwo[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedTwo[wasteSeriesTwo[index]] += numericValue;
          }
        });
      });

      const seriesData = wasteSeriesTwo.map(
        (disposalType) => aggregatedTwo[disposalType] || 0
      );
      const totalSumTwo = seriesData.reduce((sum, value) => sum + value, 0);
      setTotalSumTwo(totalSumTwo);

      // Calculate total sum for waste recovery
      const aggregatedThree = recoverySeries.reduce((acc, recoveryType) => {
        acc[recoveryType] = 0; // Initialize each recovery type with 0
        return acc;
      }, {});

      finalEnergyThree.forEach((item) => {
        const answers = item.answer?.[0] || [];
        answers.forEach((value, index) => {
          if (recoverySeries[index]) {
            const numericValue =
              value === "NA" || !value ? 0 : parseFloat(value);
            aggregatedThree[recoverySeries[index]] += numericValue;
          }
        });
      });

      const totalSumThree = Object.values(aggregatedThree).reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalSumThree(totalSumThree);

      // the below code is for water

      const waterSeries = [
        "Surface Water",
        "Ground Water",
        "Third Party Water",
        "Municipal Water",
        "Seawater / Desalinated Water",
        "Others",
      ];

      const waterSeriesTwo = [
        "To Surface Water",
        "To Ground Water",
        "To Sea Water",
        "Sent to other parties",
        "Others",
      ];

      // Safeguard against undefined rowData or timePeriods
      setTimePeriodValues(timePeriodsArray);

      const newWaterTypeEnv =
        rowData?.filter((item) => item.title === "Water withdrawal") || [];
      const newWaterDischarge =
        rowData?.filter(
          (item) => item.title === "Details of Water Discharge"
        ) || [];
      setWaterType(newWaterTypeEnv);
      setWaterDischarge(newWaterDischarge);

      // Safeguard against undefined timePeriodsArray
      const newMatchedDataWater = newWaterTypeEnv.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );
      const newMatchedDataWaterDischarge = newWaterDischarge.filter((item) =>
        timePeriodsArray.includes(item.formDate)
      );

      const finalWater = newMatchedDataWater.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      const finalNonWater = newMatchedDataWaterDischarge.filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      setMatchedWaterDis(finalNonWater);
      setMatchedDataWater(finalWater);

      if (
        !Array.isArray(newMatchedDataWater) ||
        newMatchedDataWater.length === 0
      ) {
        setTotalConsumption(0);
        return;
      }

      const aggregatedValues = waterSeries.map((_, index) =>
        newMatchedDataWater.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
          return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
        }, 0)
      );

      const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
      setTotalConsumption(total);

      const aggregated = waterSeriesTwo.map((_, index) =>
        newMatchedDataWaterDischarge.reduce((acc, obj) => {
          const value =
            obj.answer && Array.isArray(obj.answer) && obj.answer[index]
              ? obj.answer[index]
                  .slice(0, 2)
                  .reduce(
                    (sum, val) =>
                      sum + (val === "NA" || !val ? 0 : parseFloat(val)),
                    0
                  )
              : 0;
          return acc + value;
        }, 0)
      );

      const totalTwo = aggregated.reduce((sum, value) => sum + value, 0);
      setTotalConsumptionTwo(totalTwo);
    } else if (companyFramework && companyFramework.includes(48)) {
      const timePeriodsArray = Object.values(timePeriods || []);
      setTimePeriodValues(timePeriodsArray);
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) => key);

      // setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
      const summaryEnergy = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryEnergy.location[quarter] = {
              Diesel: new Array(locationOption.length).fill(0),
              Petrol: new Array(locationOption.length).fill(0),
              CNG: new Array(locationOption.length).fill(0),
              PNG: new Array(locationOption.length).fill(0),
              LPG: new Array(locationOption.length).fill(0),
              "GRID electricity": new Array(locationOption.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(locationOption.length).fill(0),
              "Electricity consumption through DG": new Array(
                locationOption.length
              ).fill(0),
              "Electricity consumption from Renewable energy (via PPA)":
                new Array(locationOption.length).fill(0),
              "Electricity consumption from Renewable energy (rooftop solar)":
                new Array(locationOption.length).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryEnergy.time[location?.unitCode] = {
              Diesel: new Array(transformedKeys.length).fill(0),
              Petrol: new Array(transformedKeys.length).fill(0),
              PNG: new Array(transformedKeys.length).fill(0),
              LPG: new Array(transformedKeys.length).fill(0),
              "GRID electricity": new Array(transformedKeys.length).fill(0),
              "Electricity Power plant (Captive Power Plant - Natural Gas)":
                new Array(transformedKeys.length).fill(0),
              "Electricity consumption through DG": new Array(
                transformedKeys.length
              ).fill(0),
              "Electricity consumption from Renewable energy (via PPA)":
                new Array(transformedKeys.length).fill(0),
              "Electricity consumption from Renewable energy (rooftop solar)":
                new Array(transformedKeys.length).fill(0),
            };
          });
        });
      }

      if (energy) {
        const filteredData = energy;
        const convertedData = filteredData;
        const timeKey = [];
        const locationKey = [];

        for (const period in summaryEnergy.location) {
          timeKey.push(period);
        }

        for (const period in summaryEnergy.time) {
          locationKey.push(period);
        }

        for (const location in summaryEnergy.time) {
          const data = summaryEnergy.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryEnergy.time[location][key].length; k++) {
              let time = timeKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item?.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryEnergy.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryEnergy.location) {
          const data = summaryEnergy.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryEnergy.location[time][key].length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item?.fuelType === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryEnergy.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefEnergy(summaryEnergy);

      const summaryWaste = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryWaste.location[quarter] = {
              "Total non-hazardous solid waste generation (black category general waste)* (kg)":
                new Array(locationOption.length).fill(0),
              "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (Kg)":
                new Array(locationOption.length).fill(0),
              "Total packaging waste (Plastic) generated* (Kg)": new Array(
                locationOption.length
              ).fill(0),
              "Total plastic packaging waste generated ": new Array(
                locationOption.length
              ).fill(0),
              "Total e-waste generated* (Kg)": new Array(
                locationOption.length
              ).fill(0),
              "Total hazardous waste ( spent oil/lubricants etc)": new Array(
                locationOption.length
              ).fill(0),
              "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)":
                new Array(locationOption.length).fill(0),

              "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)":
                new Array(locationOption.length).fill(0),

              "Total food waste generated/Kitchen Waste* (Kgs)": new Array(
                locationOption.length
              ).fill(0),

              "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs":
                new Array(locationOption.length).fill(0),

              "Total spent formalin solution disposed in Ltrs": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryWaste.time[location?.unitCode] = {
              "Total non-hazardous solid waste generation (black category general waste)* (kg)":
                new Array(transformedKeys.length).fill(0),
              "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (Kg)":
                new Array(transformedKeys.length).fill(0),
              "Total packaging waste (Plastic) generated* (Kg)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total plastic packaging waste generated ": new Array(
                transformedKeys.length
              ).fill(0),
              "Total food waste generated/Kitchen Waste* (Kgs)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total e-waste generated* (Kg)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total hazardous waste ( spent oil/lubricants etc)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)":
                new Array(transformedKeys.length).fill(0),

              "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)":
                new Array(transformedKeys.length).fill(0),

              "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs":
                new Array(transformedKeys.length).fill(0),

              "Total spent formalin solution disposed in Ltrs": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (rowData) {
        const filteredData = rowData.filter(
          (item) =>
            item?.questionId === 400 ||
            item?.questionId === 401 ||
            item?.questionId === 402 ||
            item?.questionId === 404 ||
            item?.questionId === 408 ||
            item?.questionId === 412 ||
            item?.questionId === 413 ||
            item?.questionId === 414 ||
            item?.questionId === 545 ||
            item?.questionId === 551 ||
            item?.questionId === 550
        );
        const convertedData = convertMixedData(filteredData);
        const timeKey = [];
        const locationKey = [];

        for (const period in summaryWaste.location) {
          timeKey.push(period);
        }

        for (const period in summaryWaste.time) {
          locationKey.push(period);
        }

        for (const location in summaryWaste.time) {
          const data = summaryWaste.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryWaste.time[location][key].length; k++) {
              let time = timeKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryWaste.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryWaste.location) {
          const data = summaryWaste.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryWaste.location[time][key].length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryWaste.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefWaste(summaryWaste);

      const summaryWater = {
        time: {},
        location: {},
      };

      if (locationOption) {
        locationOption.forEach((location) => {
          transformedKeys.forEach((quarter) => {
            summaryWater.location[quarter] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                locationOption.length
              ).fill(0),

              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(locationOption.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });
      }

      if (transformedKeys) {
        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summaryWater.time[location?.unitCode] = {
              "Total Groundwater consumption* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total Tanker Water Consumption* (in KL)": new Array(
                transformedKeys.length
              ).fill(0),
              "Total surface water consumption (this includes municipal supply water)* ( in KL)":
                new Array(transformedKeys.length).fill(0),
              "Total Wastewater treated(STP/ETP)* ( in KL)": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });
      }

      if (rowData) {
        const filteredData = rowData.filter(
          (item) =>
            item?.questionId === 391 ||
            item?.questionId === 469 ||
            item?.questionId === 474 ||
            item?.questionId === 394
        );
        const convertedData = convertMixedData(filteredData);
        const timeKey = [];
        const locationKey = [];

        for (const period in summaryWater.location) {
          timeKey.push(period);
        }

        for (const period in summaryWater.time) {
          locationKey.push(period);
        }

        for (const location in summaryWater.time) {
          const data = summaryWater.time[location];
          for (const key in data) {
            for (let k = 0; k < summaryWater.time[location][key].length; k++) {
              let time = timeKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryWater.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
        for (const time in summaryWater.location) {
          const data = summaryWater.location[time];
          for (const key in data) {
            for (let k = 0; k < summaryWater.location[time][key].length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summaryWater.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }
      }

      setBriefWater(summaryWater);
    }


  };

  useEffect(() => {
    if (frequency) {
      const start = getStartingMonth();
      const options = generateTimePeriodOptions(frequency, start);
      setTimePeriodOptions(options);
    }
  }, [frequency]);

  const periodOptions = useMemo(() => {
    return (timePeriodOptions || []).map(period => ({
      value: period.value,
      label: period.label
    }));
  }, [timePeriodOptions]);

  const locationOptions = useMemo(() => {
    return locations.map(loc => ({
      value: loc.id,
      label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
    }));
  }, [locations]);

  useEffect(() => {
    const initializeData = async () => {
      if (financialYearId) {

        const [environmentData] = await Promise.all([
          getEnvironmentData(financialYearId)
        ]);
        const environmentDatas = await calculateEnvironment(environmentData);
      }
    };

    initializeData();

  }, [financialYearId,]);



  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const financialYearResult = await getFinancialYear();
        if (financialYearResult) {
          setFinancialYearId(financialYearResult.currentId);

          const [locationsData, frequencyData, companyFramework, environmentData] = await Promise.all([
            getSource(),
            fetchFrequency(financialYearResult.currentId),
            fetchFramework(),
            getEnvironmentData(financialYearResult.currentId)
          ]);

          setLocations(locationsData || []);
          setFrequency(frequencyData || 'monthly');
          setFinancialYear(financialYearResult.data.map(fy => ({ value: String(fy.id), label: fy.financial_year_value })));

        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchMetricsData = async () => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);

      const params = {
        financialYearId,
        periods: selectedPeriodsValue,
        locations: selectedLocations,
        comparisonMode,
        twoYearComparisonMode
      };


      const mockData = await new Promise(resolve => {
        setTimeout(() => {
          if (comparisonMode || twoYearComparisonMode) {
            // Return data with comparison
            resolve([
              {
                title: "Total Energy",
                value: "278.50",
                unit: "GJ",
                color: "blue",
                previousValue: "121.50",
                change: 157.00,
                periodLabel: "Previous Period"
              },
              {
                title: "Total Emission",
                value: "3255.00",
                unit: "tCO2",
                color: "red",
                previousValue: "1435.00",
                change: 1820.00,
                periodLabel: "Previous Period"
              },
              {
                title: "Total Water Consumed",
                value: "174.00",
                unit: "KL",
                color: "teal",
                previousValue: "76.50",
                change: 97.50,
                periodLabel: "Previous Period"
              },
              {
                title: "Total Waste Generated",
                value: "2360.00",
                unit: "MT",
                color: "orange",
                previousValue: "1055.00",
                change: 1305.00,
                periodLabel: "Previous Period"
              }
            ]);
          } else {
            // Return simple data without comparison
            resolve([
              {
                title: "Total Energy",
                value: "278.50",
                unit: "GJ",
                color: "blue"
              },
              {
                title: "Total Emission",
                value: "3255.00",
                unit: "tCO2",
                color: "red"
              },
              {
                title: "Total Water Consumed",
                value: "174.00",
                unit: "KL",
                color: "teal"
              },
              {
                title: "Total Waste Generated",
                value: "2360.00",
                unit: "MT",
                color: "orange"
              }
            ]);
          }
        }, 1000);
      });

      setMetricsData(mockData);
    } catch (err) {
      setMetricsError(err.message || 'Failed to load metrics data');
      console.error('Error fetching metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchEntriesData = async () => {
    try {
      setEntriesLoading(true);
      setEntriesError(null);

      // Prepare API parameters based on current filters
      const params = {
        financialYearId,
        periods: selectedPeriodsValue,
        locations: selectedLocations,
        comparisonMode,
        twoYearComparisonMode,
        firstFinancialYearId,
        secondFinancialYearId,
        firstYearLocation,
        firstYearPeriods,
        secondYearLocation,
        secondYearPeriods
      };

      // TODO: Replace with your actual API call
      // const response = await fetchEnvironmentalEntriesData(params);

      // Mock data for demonstration - replace with actual API call
      const mockEntriesData = await new Promise(resolve => {
        setTimeout(() => {
          const mainEntries = [
            {
              location: 'Mumbai',
              frequency: 'Monthly',
              period: 'January',
              year: 2024,
              energy: 45000.00,
              emission: 520.00,
              water: 28000.00,
              waste: 380.00
            },
            {
              location: 'Mumbai',
              frequency: 'Monthly',
              period: 'February',
              year: 2024,
              energy: 47000.00,
              emission: 540.00,
              water: 29000.00,
              waste: 395.00
            },
            {
              location: 'Delhi',
              frequency: 'Monthly',
              period: 'January',
              year: 2024,
              energy: 38000.00,
              emission: 445.00,
              water: 24000.00,
              waste: 325.00
            },
            {
              location: 'Delhi',
              frequency: 'Monthly',
              period: 'February',
              year: 2024,
              energy: 39500.00,
              emission: 465.00,
              water: 25000.00,
              waste: 340.00
            },
            {
              location: 'Bangalore',
              frequency: 'Monthly',
              period: 'January',
              year: 2024,
              energy: 42000.00,
              emission: 485.00,
              water: 26000.00,
              waste: 350.00
            },
            {
              location: 'Chennai',
              frequency: 'Monthly',
              period: 'January',
              year: 2024,
              energy: 35000.00,
              emission: 415.00,
              water: 22000.00,
              waste: 295.00
            },
            {
              location: 'Pune',
              frequency: 'Monthly',
              period: 'January',
              year: 2024,
              energy: 32000.00,
              emission: 385.00,
              water: 20000.00,
              waste: 275.00
            }
          ];

          let comparisonEntries = [];
          if (comparisonMode || twoYearComparisonMode) {
            comparisonEntries = [
              {
                location: 'Mumbai',
                frequency: 'Monthly',
                period: 'January',
                year: 2023,
                energy: 42000.00,
                emission: 495.00,
                water: 26500.00,
                waste: 365.00
              },
              {
                location: 'Mumbai',
                frequency: 'Monthly',
                period: 'February',
                year: 2023,
                energy: 43500.00,
                emission: 510.00,
                water: 27000.00,
                waste: 375.00
              },
              {
                location: 'Delhi',
                frequency: 'Monthly',
                period: 'January',
                year: 2023,
                energy: 36000.00,
                emission: 430.00,
                water: 23000.00,
                waste: 315.00
              }
            ];
          }

          resolve({
            mainEntries,
            comparisonEntries
          });
        }, 1200);
      });

      setEntriesData(mockEntriesData.mainEntries);
      setComparisonEntriesData(mockEntriesData.comparisonEntries);
    } catch (err) {
      setEntriesError(err.message || 'Failed to load entries data');
      console.error('Error fetching entries:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  const fetchChartsData = async () => {
    try {
      setChartsLoading(true);
      setChartsError(null);

      // Prepare API parameters based on current filters
      const params = {
        financialYearId,
        periods: selectedPeriodsValue,
        locations: selectedLocations,
        comparisonMode,
        twoYearComparisonMode,
        firstFinancialYearId,
        secondFinancialYearId,
        firstYearLocation,
        firstYearPeriods,
        secondYearLocation,
        secondYearPeriods
      };

      // TODO: Replace with your actual API call
      // const response = await fetchEnvironmentalChartsData(params);

      // Mock data for demonstration - replace with actual API call
      const mockChartsData = await new Promise(resolve => {
        setTimeout(() => {
          if (comparisonMode || twoYearComparisonMode) {
            // Return comparison data structure
            resolve({
              comparison: {
                firstYearLabel: '2024',
                secondYearLabel: '2023',
                firstYear: {
                  // Energy Data
                  renewableEnergy: 203.95,
                  totalEnergyConsumption: 278.50,

                  // Emissions Data
                  scope1Emission: 150,
                  scope2Emission: 2900,
                  totalEmission: 3255.00,

                  // Water Data
                  waterWithdrawal: 180,
                  waterDischarged: 6,
                  waterConsumption: 174.00,

                  // Waste Management Data
                  totalWasteGenerated: 2360.00,
                  totalWasteRecovered: 2200,

                  // Waste Types Data
                  hazardousWaste: 1200,
                  nonHazardousWaste: 1160
                },
                secondYear: {
                  // Energy Data
                  renewableEnergy: 87.55,
                  totalEnergyConsumption: 121.50,

                  // Emissions Data
                  scope1Emission: 120,
                  scope2Emission: 1315,
                  totalEmission: 1435.00,

                  // Water Data
                  waterWithdrawal: 78,
                  waterDischarged: 1.5,
                  waterConsumption: 76.50,

                  // Waste Management Data
                  totalWasteGenerated: 1055.00,
                  totalWasteRecovered: 980,

                  // Waste Types Data
                  hazardousWaste: 620,
                  nonHazardousWaste: 435
                }
              }
            });
          } else {
            // Return single year data structure
            resolve({
              // Energy Data
              renewableEnergy: 203.95,
              totalEnergyConsumption: 278.50,

              // Emissions Data
              scope1Emission: 150,
              scope2Emission: 2900,
              totalEmission: 3255.00,

              // Water Data
              waterWithdrawal: 180,
              waterDischarged: 6,
              waterConsumption: 174.00,

              // Waste Management Data
              totalWasteGenerated: 2360.00,
              totalWasteRecovered: 2200,

              // Waste Types Data
              hazardousWaste: 1200,
              nonHazardousWaste: 1160
            });
          }
        }, 1500);
      });

      setChartsData(mockChartsData);
    } catch (err) {
      setChartsError(err.message || 'Failed to load charts data');
      console.error('Error fetching charts:', err);
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    if (financialYearId) {
      fetchMetricsData();
      fetchChartsData();
      fetchEntriesData();
    } else {
      // Clear all data when no filters selected
      setMetricsData([]);
      setChartsData(null);
      setEntriesData([]);
      setComparisonEntriesData([]);
    }
  }, [
    financialYearId,
    selectedPeriodsValue,
    selectedLocations,
    comparisonMode,
    twoYearComparisonMode,
    firstFinancialYearId,
    secondFinancialYearId
  ]);

  const getFinancialYearById = (id) => {
    const result = financialYear.find(item => item.id === id);
    return result ? result.financial_year_value : null;
  };

  useEffect(() => {
    if (!financialYearId || !selectedPeriods?.length) {
      setSelectedPeriodsValue([]);
      return;
    }

    const selectedYearValue = getFinancialYearById(financialYearId);
    if (!selectedYearValue) {
      setSelectedPeriodsValue([]);
      return;
    }

    const year = parseInt(selectedYearValue.split("-")[0]);
    const start = getStartingMonth();

    const calculateDateRange = (type, period, startingMonth, year) => {
      const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
      const startYear =
        year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
      const endMonth = ((startMonth - 1 + type) % 12) + 1;
      const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

      const formatDate = (month, year) =>
        `${year}-${month < 10 ? `0${month}` : month}`;
      const showLevel = periodOptions.find(q => q.value === period)?.label;
      return {
        fromDate: formatDate(startMonth, startYear),
        toDate: formatDate(endMonth, endYear),
        showLevel: showLevel
      };
    };

    const dateRanges = selectedPeriods.map(period => {
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        dateRange = calculateDateRange(6, period, start, year);
      } else if (frequency === "QUARTERLY") {
        dateRange = calculateDateRange(3, period, start, year);
      } else if (frequency === "MONTHLY") {
        dateRange = calculateDateRange(1, period, start, year);
      } else if (frequency === "YEARLY") {
        dateRange = calculateDateRange(12, 1, start, year);
      }
      return dateRange;
    });

    setSelectedPeriodsValue(prev => {
      const prevString = JSON.stringify(prev);
      const newString = JSON.stringify(dateRanges);
      if (prevString !== newString) {
        return dateRanges;
      }
      return prev;
    });

  }, [selectedPeriods, financialYearId, frequency, periodOptions]);

  const handleFinancialYearChange = (event) => {
    setFinancialYearId(event);
  };

  const handleClearFilters = () => {
    setFinancialYearId('');
    setSelectedPeriods([]);
    setSelectedLocations([]);
    setMetricsData([]);
    setChartsData(null);
    setEntriesData([]);
    setComparisonEntriesData([]);
    setComparisonMode(false);
    setTwoYearComparisonMode(false);
    setFirstYearLocation([]);
    setFirstYearPeriods([]);
    setFirstFinancialYearId('');
    setSecondYearLocation([]);
    setSecondYearPeriods([]);
    setSecondFinancialYearId('');
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <FilterSection
        financialYear={financialYear}
        financialYearId={financialYearId}
        onFinancialYearChange={handleFinancialYearChange}
        selectedPeriods={selectedPeriods}
        setSelectedPeriods={setSelectedPeriods}
        periodOptions={periodOptions}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        locationOptions={locationOptions}
        onClearFilters={handleClearFilters}
        activeTab="esg"
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        twoYearComparisonMode={twoYearComparisonMode}
        setTwoYearComparisonMode={setTwoYearComparisonMode}
        firstYearLocation={firstYearLocation}
        setFirstYearLocation={setFirstYearLocation}
        firstYearPeriods={firstYearPeriods}
        setFirstYearPeriods={setFirstYearPeriods}
        firstFinancialYearId={firstFinancialYearId}
        setFirstFinancialYearId={setFirstFinancialYearId}
        secondYearLocation={secondYearLocation}
        setSecondYearLocation={setSecondYearLocation}
        secondYearPeriods={secondYearPeriods}
        setSecondYearPeriods={setSecondYearPeriods}
        secondFinancialYearId={secondFinancialYearId}
        setSecondFinancialYearId={setSecondFinancialYearId}
      />

      <Row className="mb-4">
        <Col>
          {metricsError && (
            <div className="alert alert-danger" role="alert">
              Error loading metrics: {metricsError}
            </div>
          )}

          {!financialYearId ? (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-filter fa-2x mb-3"></i>
              <p>Please select Financial Year to view environmental metrics</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
              }}
            >
              {metricsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
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
                metricsData.map((metric, index) => (
                  <MetricCard
                    key={`metric-${index}`}
                    {...metric}
                  />
                ))
              )}
            </div>
          )}

          {metricsData.length === 0 && !metricsLoading && financialYearId && (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-chart-line fa-2x mb-3"></i>
              <p>No environmental metrics data available for the selected filters</p>
            </div>
          )}
        </Col>
      </Row>

      {/* Detailed Comparison Section - Only show when comparison modes are active */}
      {(comparisonMode || twoYearComparisonMode) && financialYearId && (
        <Row className="mb-4">
          <Col>
            <DetailedComparison
              comparisonData={chartsData}
              isLoading={chartsLoading}
              comparisonMode={comparisonMode}
              twoYearComparisonMode={twoYearComparisonMode}
              firstYearData={{ entries: 7 }}
              secondYearData={{ entries: 3 }}
            />
          </Col>
        </Row>
      )}

      {/* Environmental Charts Section */}
      {financialYearId && (
        <Row>
          <Col>
            {chartsError && (
              <div className="alert alert-danger" role="alert">
                Error loading charts: {chartsError}
              </div>
            )}

            <EnergyChart
              data={chartsData}
              isLoading={chartsLoading}
              isComparison={comparisonMode || twoYearComparisonMode}
            />
            <EmissionsChart
              data={chartsData}
              isLoading={chartsLoading}
              isComparison={comparisonMode || twoYearComparisonMode}
            />
            <WaterChart
              data={chartsData}
              isLoading={chartsLoading}
              isComparison={comparisonMode || twoYearComparisonMode}
            />
            <WasteManagementChart
              data={chartsData}
              isLoading={chartsLoading}
              isComparison={comparisonMode || twoYearComparisonMode}
            />
            <WasteTypesChart
              data={chartsData}
              isLoading={chartsLoading}
              isComparison={comparisonMode || twoYearComparisonMode}
            />
          </Col>
        </Row>
      )}

      {/* Data Entries Section */}
      {financialYearId && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Data Entries</h5>
              </Card.Header>
              <Card.Body>
                {entriesError && (
                  <div className="alert alert-danger" role="alert">
                    Error loading data entries: {entriesError}
                  </div>
                )}

                <DataEntriesTable
                  entriesData={entriesData}
                  comparisonEntriesData={comparisonEntriesData}
                  isLoading={entriesLoading}
                  comparisonMode={comparisonMode}
                  twoYearComparisonMode={twoYearComparisonMode}
                  filters={{
                    year: getFinancialYearById(financialYearId)?.split('-')[0] || '2024',
                    comparisonYear: getFinancialYearById(secondFinancialYearId || firstFinancialYearId)?.split('-')[0] || '2023'
                  }}
                />

                {/* Debug info - remove this later */}
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
                  <strong>Debug Info:</strong><br />
                  Financial Year ID: {financialYearId}<br />
                  Entries Data Length: {entriesData.length}<br />
                  Entries Loading: {entriesLoading.toString()}<br />
                  Comparison Mode: {comparisonMode.toString()}<br />
                  Two Year Comparison: {twoYearComparisonMode.toString()}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ESGEnvironmentDashboard;