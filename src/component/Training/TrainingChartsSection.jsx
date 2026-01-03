import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

// Reusable Chart Component
const TrainingChart = ({ 
  data, 
  chartConfig, 
  title, 
  height = 300,
  showGrid = true,
  showLegend = true 
}) => {
  const { type, xAxisKey, yAxisLeft, yAxisRight, bars, lines, colors } = chartConfig;

  const renderChart = () => {
    switch (type) {
      case 'combo':
        return (
          <ComposedChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={yAxisLeft ? { value: yAxisLeft.label, angle: -90, position: 'insideLeft' } : undefined}
            />
            {yAxisRight && (
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ value: yAxisRight.label, angle: 90, position: 'insideRight' }}
              />
            )}
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            {showLegend && <Legend />}
            
            {bars?.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                yAxisId={bar.yAxisId || "left"}
                dataKey={bar.dataKey}
                fill={colors[index] || '#8884d8'}
                name={bar.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
            
            {lines?.map((line, index) => (
              <Line
                key={line.dataKey}
                yAxisId={line.yAxisId || "right"}
                type="monotone"
                dataKey={line.dataKey}
                stroke={colors[bars?.length + index] || '#ff7300'}
                strokeWidth={2}
                name={line.name}
                dot={{ r: 4 }}
              />
            ))}
          </ComposedChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={yAxisLeft ? { value: yAxisLeft.label, angle: -90, position: 'insideLeft' } : undefined}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            {showLegend && <Legend />}
            
            {bars?.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={colors[index] || '#8884d8'}
                name={bar.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={yAxisLeft ? { value: yAxisLeft.label, angle: -90, position: 'insideLeft' } : undefined}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            {showLegend && <Legend />}
            
            {lines?.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={colors[index] || '#8884d8'}
                strokeWidth={2}
                name={line.name}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb"
    }}>
      {title && (
        <h3 style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "20px",
          margin: "0 0 20px 0"
        }}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

// Data processing functions for each chart type

// 1. Location-wise Training Performance (Combo Chart)
const useLocationTrainingData = (trainingData, locations) => {
  return useMemo(() => {
    if (!trainingData.length || !locations.length) return [];

    const locationStats = {};
    
    // Initialize location stats
    locations.forEach(location => {
      const locationName = location.location?.city || location.unitCode || 'Unknown';
      locationStats[locationName] = {
        name: locationName,
        totalPrograms: 0,
        totalParticipants: 0,
        completedPrograms: 0
      };
    });

    // Process training data
    trainingData.forEach(training => {
      const locationName = training.location || 'Unknown';
      if (locationStats[locationName]) {
        locationStats[locationName].totalPrograms++;
        locationStats[locationName].totalParticipants += (training.attendantUsers?.length || 0);
        if (training.status === 'Completed') {
          locationStats[locationName].completedPrograms++;
        }
      }
    });

    // Calculate completion rate and format data
    return Object.values(locationStats).map(location => ({
      ...location,
      completionRate: location.totalPrograms > 0 
        ? Math.round((location.completedPrograms / location.totalPrograms) * 100) 
        : 0
    }));
  }, [trainingData, locations]);
};

// 2. Year-over-Year Training Progress (Grouped Bar Chart)
const useYearOverYearData = (trainingData, traineeList) => {
  return useMemo(() => {
    if (!trainingData.length || !traineeList.length) return [];

    const yearData = {
      'Employee Health & Safety': { 'FY 2022-23': 0, 'FY 2023-24': 0 },
      'Employee Skill Development': { 'FY 2022-23': 0, 'FY 2023-24': 0 },
      'Worker Health & Safety': { 'FY 2022-23': 0, 'FY 2023-24': 0 },
      'Worker Skill Development': { 'FY 2022-23': 0, 'FY 2023-24': 0 }
    };

    trainingData.forEach(training => {
      const trainingYear = new Date(training.fromDate).getFullYear();
      const fyKey = trainingYear >= 2023 ? 'FY 2023-24' : 'FY 2022-23';
      const categoryId = training.Category?.id;
      
      training.attendantUsers?.forEach(attendant => {
        const employeeCategory = categorizeEmployee(attendant);
        
        if (categoryId === 1) { // Health & Safety
          if (employeeCategory === 'Workers') {
            yearData['Worker Health & Safety'][fyKey]++;
          } else {
            yearData['Employee Health & Safety'][fyKey]++;
          }
        } else if (categoryId === 2) { // Skill Development
          if (employeeCategory === 'Workers') {
            yearData['Worker Skill Development'][fyKey]++;
          } else {
            yearData['Employee Skill Development'][fyKey]++;
          }
        }
      });
    });

    return Object.entries(yearData).map(([category, data]) => ({
      category,
      ...data
    }));
  }, [trainingData, traineeList]);
};

// 3. Gender Distribution (Grouped Bar Chart)
const useGenderDistributionData = (traineeList) => {
  return useMemo(() => {
    if (!traineeList.length) return [];

    const genderStats = {
      Employees: { Male: 0, Female: 0 },
      Workers: { Male: 0, Female: 0 }
    };

    traineeList.forEach(trainee => {
      const category = categorizeEmployee(trainee);
      const gender = trainee.gender;
      
      if (category === 'Workers') {
        if (gender === 'MALE') genderStats.Workers.Male++;
        else if (gender === 'FEMALE') genderStats.Workers.Female++;
      } else {
        if (gender === 'MALE') genderStats.Employees.Male++;
        else if (gender === 'FEMALE') genderStats.Employees.Female++;
      }
    });

    return Object.entries(genderStats).map(([category, data]) => ({
      category,
      ...data
    }));
  }, [traineeList]);
};

// 4. Human Rights Training Progress (Line Chart)
const useHumanRightsProgressData = (trainingData, traineeList) => {
  return useMemo(() => {
    if (!trainingData.length || !traineeList.length) return [];

    // This would typically come from historical data
    // For demo purposes, creating sample progression data
    const categories = ['Board of Directors', 'Key Managerial Personnel', 'Other Employees', 'Permanent Workers', 'Other Workers'];
    
    return categories.map(category => {
      // Calculate current coverage from actual data
      const categoryTrainees = traineeList.filter(trainee => {
        const empCategory = categorizeEmployee(trainee);
        return empCategory === category || 
               (category === 'Other Employees' && empCategory === 'Employees other than BoD and KMPs') ||
               (category === 'Permanent Workers' && empCategory === 'Workers');
      });

      const trainedCount = trainingData.reduce((count, training) => {
        if (training.principles?.some(p => p.id === 5)) { // Human Rights principle
          const attendants = training.attendantUsers?.filter(attendant => {
            const empCategory = categorizeEmployee(attendant);
            return empCategory === category || 
                   (category === 'Other Employees' && empCategory === 'Employees other than BoD and KMPs') ||
                   (category === 'Permanent Workers' && empCategory === 'Workers');
          }) || [];
          return count + attendants.length;
        }
        return count;
      }, 0);

      const currentCoverage = categoryTrainees.length > 0 ? (trainedCount / categoryTrainees.length) * 100 : 0;
      
      return {
        category,
        'FY 2022-23': Math.max(0, currentCoverage - 20), // Simulated previous year data
        'FY 2023-24': currentCoverage
      };
    });
  }, [trainingData, traineeList]);
};

// Chart configurations for each type
const CHART_CONFIGS = {
  locationPerformance: {
    type: 'combo',
    xAxisKey: 'name',
    yAxisLeft: { label: 'Count' },
    yAxisRight: { label: 'Completion Rate (%)' },
    bars: [
      { dataKey: 'totalPrograms', name: 'Total Programs', yAxisId: 'left' },
      { dataKey: 'totalParticipants', name: 'Total Participants', yAxisId: 'left' }
    ],
    lines: [
      { dataKey: 'completionRate', name: 'Completion Rate', yAxisId: 'right' }
    ],
    colors: ['#3B82F6', '#10B981', '#EF4444']
  },

  yearOverYear: {
    type: 'bar',
    xAxisKey: 'category',
    yAxisLeft: { label: 'Number of Employees' },
    bars: [
      { dataKey: 'FY 2022-23', name: 'FY 2022-23' },
      { dataKey: 'FY 2023-24', name: 'FY 2023-24' }
    ],
    colors: ['#8B5CF6', '#10B981']
  },

  genderDistribution: {
    type: 'bar',
    xAxisKey: 'category',
    yAxisLeft: { label: 'Number of People' },
    bars: [
      { dataKey: 'Male', name: 'Male' },
      { dataKey: 'Female', name: 'Female' }
    ],
    colors: ['#3B82F6', '#EF4444']
  },

  humanRightsProgress: {
    type: 'line',
    xAxisKey: 'category',
    yAxisLeft: { label: 'Coverage (%)' },
    lines: [
      { dataKey: 'FY 2022-23', name: 'FY 2022-23' },
      { dataKey: 'FY 2023-24', name: 'FY 2023-24' }
    ],
    colors: ['#8B5CF6', '#10B981']
  }
};

// Main Training Charts Component
const TrainingChartsSection = ({ trainingData, traineeList, locations }) => {
  // Process data for each chart
  const locationData = useLocationTrainingData(trainingData, locations);
  const yearOverYearData = useYearOverYearData(trainingData, traineeList);
  const genderData = useGenderDistributionData(traineeList);
  const humanRightsData = useHumanRightsProgressData(trainingData, traineeList);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <TrainingChart
        data={locationData}
        chartConfig={CHART_CONFIGS.locationPerformance}
        title="Training Performance by Location"
        height={350}
      />
      
      <TrainingChart
        data={yearOverYearData}
        chartConfig={CHART_CONFIGS.yearOverYear}
        title="Year-over-Year Training Progress"
        height={350}
      />
      
      <TrainingChart
        data={genderData}
        chartConfig={CHART_CONFIGS.genderDistribution}
        title="Gender Distribution (FY 2023-24)"
        height={350}
      />
      
      <TrainingChart
        data={humanRightsData}
        chartConfig={CHART_CONFIGS.humanRightsProgress}
        title="Human Rights Training Progress"
        height={350}
      />
    </div>
  );
};

export default TrainingChartsSection;