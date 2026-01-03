import { EMPLOYEE_CATEGORIES } from '../constants/trainingConstants';

// Helper function to categorize employees
export const categorizeEmployee = (user) => {
  const category = user.categoryId?.toLowerCase();
  
  // You may need to adjust these mappings based on your actual data
  if (category?.includes('bod') || category?.includes('director')) {
    return EMPLOYEE_CATEGORIES.BOARD_OF_DIRECTORS;
  } else if (category?.includes('kmp') || category?.includes('kmp')) {
    return EMPLOYEE_CATEGORIES.KEY_MANAGERIAL_PERSONNEL;
  } else if (category?.includes('permanent employee') || category?.includes('other than permanent employee')) {
    return EMPLOYEE_CATEGORIES.EMPLOYEES_OTHER;
  } else if (category?.includes('permanent worker') || category?.includes('other than permanent worker')) {
    return EMPLOYEE_CATEGORIES.WORKERS;
  } else {
    // Default categorization - you might want to adjust this
    return EMPLOYEE_CATEGORIES.EMPLOYEES_OTHER;
  }
};

// Helper function to calculate training hours
export const calculateTrainingHours = (fromTime, toTime) => {
  if (!fromTime || !toTime) return 0;
  
  const [fromHour, fromMin] = fromTime.split(':').map(Number);
  const [toHour, toMin] = toTime.split(':').map(Number);
  
  const fromTotalMin = fromHour * 60 + fromMin;
  const toTotalMin = toHour * 60 + toMin;
  
  return Math.max(0, (toTotalMin - fromTotalMin) / 60);
};

// Helper function to get current financial year label
export const getCurrentFinancialYearLabel = (financialYear, financialYearId) => {
  const currentFY = financialYear.find(fy => fy.id === financialYearId);
  if (currentFY) {
    const fromDate = new Date(currentFY.fromDate);
    const toDate = new Date(currentFY.toDate);
    
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      const fromYear = fromDate.getFullYear();
      const toYear = toDate.getFullYear();
      return `FY ${fromYear}-${toYear.toString().slice(-2)}`;
    }
  }
  return 'Current FY';
};

// Helper function to format percentage
export const formatPercentage = (count, total) => {
  if (!total || total === 0) return '0%';
  return `${((count / total) * 100).toFixed(2)}%`;
};

// Helper function for safe property access
export const safeGet = (obj, path, defaultValue = 0) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
};