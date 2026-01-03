import { useMemo } from 'react';

// Hook to generate dynamic chart configurations based on actual data
export const useDynamicChartConfigs = (financialYear, traineeList) => {
  return useMemo(() => {
    // Get unique fiscal years for labels and ensure they're valid
    const fiscalYearLabels = financialYear.map(fy => {
      const fromDate = new Date(fy.fromDate);
      const toDate = new Date(fy.toDate);
      
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return null;
      
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      return `FY ${fromYear}-${toYear.toString().slice(-2)}`;
    }).filter(Boolean).sort();

    // Get unique genders
    const genders = [...new Set(traineeList.map(t => t.gender).filter(Boolean))];

    return {
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
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      },

      yearOverYear: {
        type: 'bar',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Number of Employees' },
        bars: fiscalYearLabels.map(label => ({
          dataKey: label,
          name: label
        })),
        colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'].slice(0, fiscalYearLabels.length)
      },

      genderDistribution: {
        type: 'bar',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Number of People' },
        bars: genders.map(gender => ({
          dataKey: gender,
          name: gender
        })),
        colors: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'].slice(0, genders.length)
      },

      humanRightsProgress: {
        type: 'line',
        xAxisKey: 'category',
        yAxisLeft: { label: 'Coverage (%)' },
        lines: fiscalYearLabels.map(label => ({
          dataKey: label,
          name: label
        })),
        colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'].slice(0, fiscalYearLabels.length)
      }
    };
  }, [financialYear, traineeList]);
};