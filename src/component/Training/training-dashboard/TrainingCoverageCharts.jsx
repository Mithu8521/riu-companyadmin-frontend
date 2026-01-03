import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { categorizeEmployee } from './utils/trainingUtils';

const TrainingCoverageCharts = ({ 
  trainingData,
  traineeList,
  categoryOptions,
  principleOptions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions?.[0]?.value ?? null);
  const [selectedPrinciple, setSelectedPrinciple] = useState(principleOptions?.[0]?.value ?? null);
  const [categoryFilter, setCategoryFilter] = useState('total'); // 'total', 'employees', 'workers'
  const [principleFilter, setPrincipleFilter] = useState('total'); // 'total', 'employees', 'workers'

  // Helper function to check if trainee is employee or worker
  const getTraineeType = (trainee) => {
    if (!trainee) return null;
    const category = categorizeEmployee(trainee);
    
    if (category === 'Employees other than BoD and KMPs' || 
        category === 'Board of Directors' || 
        category === 'Key Managerial Personnel') {
      return 'employees';
    } else if (category === 'Workers') {
      return 'workers';
    }
    return null;
  };

  const coverageData = useMemo(() => {
    // Count trainees by type
    let totalTrainees = 0;
    let totalEmployees = 0;
    let totalWorkers = 0;
    const traineeTypeMap = new Map(); // employeeId -> 'employees' | 'workers'
    
    if (traineeList && Array.isArray(traineeList)) {
      traineeList.forEach(trainee => {
        if (!trainee || !trainee.employeeId) return;
        
        const type = getTraineeType(trainee);
        if (type) {
          traineeTypeMap.set(trainee.employeeId, type);
          totalTrainees++;
          if (type === 'employees') {
            totalEmployees++;
          } else if (type === 'workers') {
            totalWorkers++;
          }
        }
      });
    }

    // Initialize coverage tracking
    const categoryCoveredEmployees = new Set();
    const categoryCoveredWorkers = new Set();
    const principleCoveredEmployees = new Set();
    const principleCoveredWorkers = new Set();

    // Process training data
    if (trainingData && Array.isArray(trainingData)) {
      trainingData.forEach(training => {
        if (!training) return;
        
        const attendants = training.attendantUsers || [];
        const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
        const trainingPrinciples = training.principles || [];
        
        attendants.forEach(attendant => {
          if (!attendant || !attendant.employeeId) return;
          
          const employeeId = attendant.employeeId;
          const traineeType = traineeTypeMap.get(employeeId) || getTraineeType(attendant);
          
          // Track category coverage
          if (selectedCategory && trainingCategoryIds.includes(selectedCategory)) {
            if (traineeType === 'employees') {
              categoryCoveredEmployees.add(employeeId);
            } else if (traineeType === 'workers') {
              categoryCoveredWorkers.add(employeeId);
            }
          }
          
          // Track principle coverage
          if (selectedPrinciple) {
            trainingPrinciples.forEach(principle => {
              const principleId = principle?.id || principle;
              if (principleId === selectedPrinciple) {
                if (traineeType === 'employees') {
                  principleCoveredEmployees.add(employeeId);
                } else if (traineeType === 'workers') {
                  principleCoveredWorkers.add(employeeId);
                }
              }
            });
          }
        });
      });
    }

    // Calculate category data based on filter
    const getCategoryFilteredData = () => {
      let coveredCount, totalCount;
      
      if (categoryFilter === 'employees') {
        coveredCount = categoryCoveredEmployees.size;
        totalCount = totalEmployees;
      } else if (categoryFilter === 'workers') {
        coveredCount = categoryCoveredWorkers.size;
        totalCount = totalWorkers;
      } else {
        coveredCount = categoryCoveredEmployees.size + categoryCoveredWorkers.size;
        totalCount = totalTrainees;
      }
      
      const notCoveredCount = totalCount - coveredCount;
      const coveredPercent = totalCount > 0 
        ? Number(((coveredCount / totalCount) * 100).toFixed(2)) 
        : 0;
      const notCoveredPercent = totalCount > 0 
        ? Number(((notCoveredCount / totalCount) * 100).toFixed(2)) 
        : 0;

      const categoryLabel = categoryOptions?.find(c => c.value === selectedCategory)?.label || 'Selected Category';

      return {
        labels: [categoryLabel, 'Not Covered'],
        series: [coveredCount, notCoveredCount],
        counts: [coveredCount, notCoveredCount],
        percentages: [coveredPercent, notCoveredPercent],
        total: totalCount
      };
    };

    // Calculate principle data based on filter
    const getPrincipleFilteredData = () => {
      let coveredCount, totalCount;
      
      if (principleFilter === 'employees') {
        coveredCount = principleCoveredEmployees.size;
        totalCount = totalEmployees;
      } else if (principleFilter === 'workers') {
        coveredCount = principleCoveredWorkers.size;
        totalCount = totalWorkers;
      } else {
        coveredCount = principleCoveredEmployees.size + principleCoveredWorkers.size;
        totalCount = totalTrainees;
      }
      
      const notCoveredCount = totalCount - coveredCount;
      const coveredPercent = totalCount > 0 
        ? Number(((coveredCount / totalCount) * 100).toFixed(2)) 
        : 0;
      const notCoveredPercent = totalCount > 0 
        ? Number(((notCoveredCount / totalCount) * 100).toFixed(2)) 
        : 0;

      const principleLabel = principleOptions?.find(p => p.value === selectedPrinciple)?.label || 'Selected Principle';

      return {
        labels: [principleLabel, 'Not Covered'],
        series: [coveredCount, notCoveredCount],
        counts: [coveredCount, notCoveredCount],
        percentages: [coveredPercent, notCoveredPercent],
        total: totalCount
      };
    };

    return { 
      categoryData: getCategoryFilteredData(), 
      principleData: getPrincipleFilteredData(), 
      totalTrainees,
      totalEmployees,
      totalWorkers
    };
  }, [trainingData, traineeList, selectedCategory, selectedPrinciple, categoryOptions, principleOptions, categoryFilter, principleFilter]);

  const createChartOptions = (labels, counts, percentages, total) => ({
    chart: {
      type: 'donut',
      height: 320,
      fontFamily: 'inherit',
    },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: '14px',
              formatter: (val, opts) => {
                const index = opts?.seriesIndex ?? 0;
                return `${percentages[index]}%`;
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              formatter: () => total,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const index = opts.seriesIndex;
        const count = counts[index];
        const percentage = percentages[index];
        return `${percentage}% (${count})`;
      },
      style: {
        fontSize: '12px',
        fontWeight: 500,
      },
      dropShadow: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      markers: {
        width: 12,
        height: 12,
        radius: 2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      formatter: (seriesName, opts) => {
        const index = opts.seriesIndex;
        const count = counts[index];
        const percentage = percentages[index];
        return `${seriesName}: ${count} (${percentage}%)`;
      }
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const index = opts.seriesIndex;
          const count = counts[index];
          const percentage = percentages[index];
          return `${count} trainees (${percentage}%)`;
        },
      },
    },
    colors: ['#3B82F6', '#BFDBFE'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  });

  const { categoryData, principleData, totalTrainees } = coverageData;

  const selectStyles = {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    backgroundColor: '#fff',
    color: '#374151',
    cursor: 'pointer',
    minWidth: '200px',
    outline: 'none',
  };

  const RadioGroup = ({ value, onChange, name }) => (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '12px'
    }}>
      {[
        { value: 'total', label: 'Total' },
        { value: 'employees', label: 'Employees' },
        { value: 'workers', label: 'Workers' }
      ].map(option => (
        <label 
          key={option.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: value === option.value ? '#3B82F6' : '#6B7280',
            fontWeight: value === option.value ? '600' : '400'
          }}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              accentColor: '#3B82F6',
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <h2 style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#374151",
          margin: 0
        }}>
          Training Coverage Analysis
        </h2>
        
        {/* Summary Stats - Top Right */}
        <div style={{
          display: "flex",
          gap: "16px"
        }}>
          <div style={{
            backgroundColor: "#f0f9ff",
            padding: "12px 20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            border: "1px solid #bfdbfe"
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3B82F6" }}>
              {totalTrainees}
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>Total Trainees</div>
          </div>
          <div style={{
            backgroundColor: "#f0fdf4",
            padding: "12px 20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            border: "1px solid #bbf7d0"
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10B981" }}>
              {trainingData?.length || 0}
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>Total Programs</div>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px"
      }}>
        {/* Category Coverage Chart */}
        <div style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fafafa"
        }}>
          {/* Category Dropdown */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              margin: 0
            }}>
              Coverage by Category
            </h3>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              style={selectStyles}
            >
              <option value="">Select Category</option>
              {categoryOptions?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Radio Buttons */}
          <RadioGroup 
            value={categoryFilter} 
            onChange={setCategoryFilter} 
            name="categoryFilter" 
          />

          {selectedCategory ? (
            <ReactApexChart
              options={createChartOptions(
                categoryData.labels,
                categoryData.counts,
                categoryData.percentages,
                categoryData.total
              )}
              series={categoryData.series}
              type="donut"
              height={320}
            />
          ) : (
            <div style={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div style={{ fontSize: "16px", fontWeight: "500" }}>No category selected</div>
              <div style={{ fontSize: "14px" }}>Please select a category to view coverage</div>
            </div>
          )}
        </div>

        {/* Principle Coverage Chart */}
        <div style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#fafafa"
        }}>
          {/* Principle Dropdown */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              margin: 0
            }}>
              Coverage by Principle
            </h3>
            <select
              value={selectedPrinciple || ''}
              onChange={(e) => setSelectedPrinciple(e.target.value ? Number(e.target.value) : null)}
              style={selectStyles}
            >
              <option value="">Select Principle</option>
              {principleOptions?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Principle Radio Buttons */}
          <RadioGroup 
            value={principleFilter} 
            onChange={setPrincipleFilter} 
            name="principleFilter" 
          />

          {selectedPrinciple ? (
            <ReactApexChart
              options={createChartOptions(
                principleData.labels,
                principleData.counts,
                principleData.percentages,
                principleData.total
              )}
              series={principleData.series}
              type="donut"
              height={320}
            />
          ) : (
            <div style={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div style={{ fontSize: "16px", fontWeight: "500" }}>No principle selected</div>
              <div style={{ fontSize: "14px" }}>Please select a principle to view coverage</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingCoverageCharts;