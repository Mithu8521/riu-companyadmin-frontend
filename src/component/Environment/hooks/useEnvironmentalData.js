import { EnvironmentalDataManager } from "../utils";

/**
 * Process environmental data (year-wise) using EnvironmentalDataManager
 *
 * @param {Object} rawData          - Raw data { energy, water, waste, emission }
 * @param {Object} timePeriods      - { period_0: "2025-04", ... }
 * @param {Array} locationOptions   - Filtered locations
 * @param {Array} companyFramework  - Framework IDs
 * @returns {Promise<Object>}       - Processed results
 */
export const calculateEnvironmentalData = async (
  rawData,
  timePeriods,
  locationOptions,
  companyFramework
) => {
  const dataManager = new EnvironmentalDataManager();

  try {
    const results = await dataManager.processAllData(
      rawData,
      timePeriods,
      locationOptions,
      companyFramework
    );

    return {
      energyData: results.energy || {},
      waterData: results.water || {},
      wasteData: results.waste || {},
      emissionData: results.emission || {}
    };
  } catch (error) {
    throw new Error(error.message || "Failed to calculate environmental data");
  }
};
