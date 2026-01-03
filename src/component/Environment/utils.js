// Configuration for different data types
const DATA_CONFIGS = {
  energy: {
    framework1: {
      renewable: {
        title: "Energy Consumption from Renewable Sources",
        calculateTotal: function (data) {
          if (!Array.isArray(data) || data.length === 0) return 0;

          const firstObject = data[0];
          const rowOptions = firstObject.question_details
            .filter(detail => detail.option_type === "row")
            .slice(1)
            .map(detail => detail.option)
            .reverse();

          const aggregatedValues = rowOptions.map((_, index) =>
            data.reduce((acc, obj) => {
              const value = obj.energyAndEmission?.[index]?.[0];
              return acc + (value === "NA" || !value || value === "No" || value === "Yes"
                ? 0 : parseFloat(value || 0));
            }, 0)
          );

          return aggregatedValues.reduce((sum, value) => sum + value, 0);
        },
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.calculateTotal(periodData);
          });
          return periodTotals;
        }
      },
      nonRenewable: {
        title: "Energy Consumption from Non-renewable Sources",
        calculateTotal: function (data) {
          if (!Array.isArray(data) || data.length === 0) return 0;

          const firstObject = data[0];
          const rowOptions = firstObject.question_details
            .filter(detail => detail.option_type === "row")
            .slice(1)
            .map(detail => detail.option)
            .reverse();

          const aggregatedValues = rowOptions.map((_, index) =>
            data.reduce((acc, obj) => {
              const value = obj.energyAndEmission?.[index]?.[0];
              return acc + (value === "NA" || !value || value === "No" || value === "Yes"
                ? 0 : parseFloat(value || 0));
            }, 0)
          );

          return aggregatedValues.reduce((sum, value) => sum + value, 0);
        },
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.calculateTotal(periodData);
          });
          return periodTotals;
        }
      }
    },
    framework48: {
      fuel: [
        "Diesel", "Petrol", "CNG", "PNG", "LPG"
      ],
      electricity: [
        "GRID electricity",
        "Electricity Power plant (Captive Power Plant - Natural Gas)",
        "Electricity consumption through DG"
      ],
      renewable: [
        "Electricity consumption from Renewable energy (via PPA)",
        "Electricity consumption from Renewable energy (rooftop solar)"
      ],
      fuelTypes: [
        "Diesel", "Petrol", "CNG", "PNG", "LPG", "GRID electricity",
        "Electricity Power plant (Captive Power Plant - Natural Gas)",
        "Electricity consumption through DG",
        "Electricity consumption from Renewable energy (via PPA)",
        "Electricity consumption from Renewable energy (rooftop solar)"
      ],
      questionIds: [289, 293, 294, 295, 292, 495, 497, 499]
    }
  },

  emission: {
    framework1: {
      scope1: {
        title: "Energy Consumption from Non-renewable Sources",
        processData: function (data) {
          return data.map((obj) => {
            // Remove the first row of energyAndEmission
            const energyAndEmission = obj.energyAndEmission.slice(1);

            // Remove all "column1" entries
            const questionDetailsWithoutColumn1 = obj.question_details.filter(
              (q) => q.option_type !== "column1"
            );

            // Remove the last "row" entry
            const rowEntries = questionDetailsWithoutColumn1.filter(
              (q) => q.option_type === "row"
            );
            const lastRowEntry =
              rowEntries.length > 0 ? rowEntries[rowEntries.length - 1] : null;
            const question_details = lastRowEntry
              ? questionDetailsWithoutColumn1.filter((q) => q !== lastRowEntry)
              : questionDetailsWithoutColumn1;

            return {
              ...obj,
              energyAndEmission,
              question_details,
            };
          });
        },
        calculateTotal: function (processedData) {
          return parseFloat(
            processedData
              .reduce((totalSum, item) => {
                return (
                  totalSum +
                  item.energyAndEmission.reduce(
                    (sum, row) => sum + parseFloat(row[1] || 0),
                    0
                  )
                );
              }, 0)
              .toFixed(2)
          );
        },
        calculatePeriodWiseTotals: function (processedData, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = processedData.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.calculateTotal(periodData);
          });
          return periodTotals;
        }
      },
      scope2: {
        title: "Energy Consumption from Non-renewable Sources",
        processData: function (data) {
          return data.map((obj) => {
            // Filter for column1 type
            const column1Entries = obj.question_details.filter(
              (q) => q.option_type === "column1"
            );

            // Find the last "row" type entry
            const rowEntries = obj.question_details.filter(
              (q) => q.option_type === "row"
            );
            const lastRowEntry =
              rowEntries.length > 0 ? rowEntries[rowEntries.length - 1] : null;

            return {
              ...obj,
              energyAndEmission:
                obj.energyAndEmission.length > 0 ? [obj.energyAndEmission[0]] : [],
              question_details: lastRowEntry
                ? [...column1Entries, lastRowEntry]
                : column1Entries,
            };
          });
        },
        calculateTotal: function (processedData) {
          return parseFloat(
            processedData
              .reduce((totalSum, item) => {
                return (
                  totalSum +
                  item.energyAndEmission.reduce(
                    (sum, row) => sum + parseFloat(row[1] || 0),
                    0
                  )
                );
              }, 0)
              .toFixed(2)
          );
        },
        calculatePeriodWiseTotals: function (processedData, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = processedData.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.calculateTotal(periodData);
          });
          return periodTotals;
        }
      }
    },
    framework48: {
      // Updated categorized structure for emissions
      scope1FuelTypes: [
        "Diesel", "Petrol", "CNG", "PNG", "LPG",
      ],
      scope2FuelTypes: [
        "GRID electricity",
        "Electricity Power plant (Captive Power Plant - Natural Gas)",
        "Electricity consumption through DG"
      ],
      scope1QuestionIds: [289, 293, 294, 295, 292, 495, 497, 499],
      scope2QuestionIds: [468, 426]
    }
  },

  water: {
    framework1: {
      withdrawal: {
        title: "Water withdrawal",
        series: [
          "Surface Water", "Ground Water", "Third Party Water",
          "Municipal Water", "Seawater / Desalinated Water", "Others"
        ],
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.series
              .map((_, index) =>
                periodData.reduce((acc, obj) => {
                  const value = obj.answer?.[index]?.[0];
                  return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
                }, 0)
              )
              .reduce((sum, value) => sum + value, 0);
          });
          return periodTotals;
        }
      },
      discharge: {
        title: "Details of Water Discharge",
        series: [
          "To Surface Water", "To Ground Water", "To Sea Water",
          "Sent to other parties", "Others"
        ],
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = this.series
              .map((_, index) =>
                periodData.reduce((acc, obj) => {
                  const value = obj.answer?.[index];
                  return acc + (value ?
                    value.slice(0, 2).reduce((sum, val) =>
                      sum + (val === "NA" || !val ? 0 : parseFloat(val)), 0
                    ) : 0);
                }, 0)
              )
              .reduce((sum, value) => sum + value, 0);
          });
          return periodTotals;
        }
      }
    },
    framework48: {
      categories: [
        "Total Groundwater consumption* ( in KL)",
        "Total Tanker Water Consumption* (in KL)",
        "Total surface water consumption (this includes municipal supply water)* ( in KL)",
        "Total Wastewater treated(STP/ETP)* ( in KL)"
      ],
      questionIds: [391, 469, 474, 394]
    }
  },

  waste: {
    framework1: {
      management: {
        title: "Waste Management",
        series: ["Plastic waste", "E-waste", "Bio-medical waste", "Construction and demolition waste", "Battery waste", "Radioactive waste", "Other Hazardous waste", "Other Non-hazardous waste"],
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = periodData.reduce((sum, item) => {
              const answers = item.answer?.[0] || [];
              return sum + answers.reduce((itemSum, value) => {
                const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
                return itemSum + numericValue;
              }, 0);
            }, 0);
          });
          return periodTotals;
        }
      },
      disposal: {
        title: "Waste Disposal",
        series: ["Incineration", "Landfilling", "Other disposal operations"],
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = periodData.reduce((sum, item) => {
              const answers = item.answer?.[0] || [];
              return sum + answers.reduce((itemSum, value) => {
                const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
                return itemSum + numericValue;
              }, 0);
            }, 0);
          });
          return periodTotals;
        }
      },
      recovery: {
        title: "Waste Recovery",
        series: ["Re-use", "Recycling", "Other recovery operations"],
        calculatePeriodWiseTotals: function (data, timePeriods) {
          const periodTotals = {};
          Object.entries(timePeriods).forEach(([period, formDate]) => {
            const periodData = data.filter(item => item.formDate === formDate);
            periodTotals[formDate] = periodData.reduce((sum, item) => {
              const answers = item.answer?.[0] || [];
              return sum + answers.reduce((itemSum, value) => {
                const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
                return itemSum + numericValue;
              }, 0);
            }, 0);
          });
          return periodTotals;
        }
      }
    },
    framework48: {
      // Non-Hazardous waste categories
      nonHazardous: [
        "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
        "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)", 
        "Total packaging waste (Plastic) generated* (Kg)",
        "Total food waste generated/Kitchen Waste* (Kgs)"
      ],
      // Hazardous waste categories  
      hazardous: [
        "Total e-waste generated* (Kg)",
        "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
        "Total spent formalin solution disposed in Ltrs"
      ],
      // Biomedical waste categories
      bioMedical: {
        categories: ["Yellow", "Red", "White", "Blue", "Cytotoxic"],
        questionId: 409,
        title: "Biomedical Waste"
      },
      // Question IDs for different waste types
      questionIds: {
        nonHazardous: [400, 401, 402, 404], // Cardboard, Paper, Plastic, Food waste
        hazardous: [408, 412, 413], // E-waste, waste oil, formalin
        bioMedical: [409], // Biomedical waste
        additional: [414, 545, 551, 550] // Additional waste categories if any
      },
      // All categories combined for processing
      getAllCategories: function() {
        return [
          ...this.nonHazardous,
          ...this.hazardous,
          ...this.bioMedical.categories
        ];
      },
      // All question IDs combined
      getAllQuestionIds: function() {
        return [
          ...this.questionIds.nonHazardous,
          ...this.questionIds.hazardous,
          ...this.questionIds.bioMedical,
          ...this.questionIds.additional
        ];
      }
    }
  }
};

// Updated EnvironmentalDataProcessor class with enhanced framework48 processing
class EnvironmentalDataProcessor {
  constructor(dataType, framework) {
    this.dataType = dataType;
    this.framework = framework;
    this.config = DATA_CONFIGS[dataType];
    this.state = {
      processedData: {},
      totals: {},
      periodWiseTotals: {},
      timePeriodValues: [],
      locationData: {}
    };
  }

  // Parse numeric values safely
  parseNumericValue(value) {
    if (value === "NA" || value === null || value === undefined || value === "" || value === "No" || value === "Yes") {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Filter data by time periods and locations
  filterData(data, timePeriods, locationOption, title = null) {
    const timePeriodsArray = Object.values(timePeriods || []);

    let filteredByTitle = data;
    if (title) {
      filteredByTitle = data?.filter(item => item.title === title) || [];
    }

    const filteredByTime = filteredByTitle.filter(item =>
      timePeriodsArray.includes(item.formDate)
    );

    return filteredByTime.filter(item =>
      locationOption.some(location => location.id === item.sourceId)
    );
  }

  // Calculate period-wise totals for Framework 48
  calculateFramework48PeriodTotals(summary, timePeriods) {
    const periodTotals = {};
    const periods = Array.isArray(timePeriods) ? timePeriods : Object.entries(timePeriods || {});

    periods.forEach(([period, formDate]) => {
      let periodTotal = 0;
      const locationData = summary.location?.[period];

      if (locationData) {
        Object.keys(locationData).forEach(category => {
          const categoryValues = locationData[category];
          if (Array.isArray(categoryValues)) {
            periodTotal += categoryValues.reduce((sum, value) => sum + (value || 0), 0);
          }
        });
      }

      periodTotals[formDate] = periodTotal;
    });

    return periodTotals;
  }

  // Calculate category-wise period totals for Framework 48 energy
  calculateCategoryWisePeriodTotals(summary, timePeriods, categoryTypes) {
    const categoryTotals = {};

    categoryTypes.forEach(categoryType => {
      categoryTotals[categoryType] = {};
      const periods = Array.isArray(timePeriods) ? timePeriods : Object.entries(timePeriods || {});

      periods.forEach(([period, formDate]) => {
        let categoryTotal = 0;
        const locationData = summary.location?.[period];

        if (locationData) {
          const categoryItems = this.config.framework48[categoryType] || [];
          categoryItems.forEach(item => {
            const categoryValues = locationData[item];
            if (Array.isArray(categoryValues)) {
              categoryTotal += categoryValues.reduce((sum, value) => sum + (value || 0), 0);
            }
          });
        }

        categoryTotals[categoryType][formDate] = categoryTotal;
      });
    });

    return categoryTotals;
  }

  // Convert mixed data format (for framework 48)
  convertMixedData(mixedArray) {
    return mixedArray.map(data => {
      if (Array.isArray(data?.answer) && Array.isArray(data.answer[0])) {
        const flattenedAnswer = data.answer.flat();
        const summedValue = flattenedAnswer.reduce(
          (sum, value) => sum + this.parseNumericValue(value), 0
        );

        return {
          ...data,
          answer: {
            process: 1,
            readingValue: summedValue.toString(),
            unit: data.unit || "KG"
          },
          fuelType: data.fuelType
        };
      }

      return {
        ...data,
        answer: {
          ...data?.answer,
          readingValue: data?.answer?.readingValue || "0"
        }
      };
    });
  }

  // Convert waste data format specifically for framework48
  convertWasteData(wasteArray) {
    return wasteArray.map(data => {
      // Handle biomedical waste differently
      if (data.questionId === 409) {
        return this.convertBiomedicalWasteData(data);
      }
      
      // Handle regular waste data
      if (Array.isArray(data.answer) && data.answer.length > 0) {
        let processedAnswer;
        
        // Check if answer is nested array structure
        if (Array.isArray(data.answer[0])) {
          // Flatten and sum nested arrays
          const flattenedAnswer = data.answer.flat();
          const summedValue = flattenedAnswer.reduce(
            (sum, value) => sum + this.parseNumericValue(value), 0
          );
          processedAnswer = {
            process: 1,
            readingValue: summedValue.toString(),
            unit: data.unit || "KG"
          };
        } else if (typeof data.answer[0] === 'object') {
          // Handle object structure in answer
          const answerObj = data.answer[0];
          processedAnswer = {
            process: answerObj.process || 1,
            readingValue: this.parseNumericValue(answerObj.readingValue || answerObj.value || 0).toString(),
            unit: answerObj.unit || data.unit || "KG"
          };
        } else {
          // Handle simple array structure
          const summedValue = data.answer.reduce(
            (sum, value) => sum + this.parseNumericValue(value), 0
          );
          processedAnswer = {
            process: 1,
            readingValue: summedValue.toString(),
            unit: data.unit || "KG"
          };
        }
        
        return {
          ...data,
          answer: processedAnswer,
          wasteType: data.wasteType || data.title || data.fuelType
        };
      }

      // Handle data that already has proper answer structure
      return {
        ...data,
        answer: {
          process: data.answer?.process || 1,
          readingValue: this.parseNumericValue(data.answer?.readingValue || 0).toString(),
          unit: data.answer?.unit || data.unit || "KG"
        },
        wasteType: data.wasteType || data.title || data.fuelType
      };
    });
  }

  // Convert biomedical waste data specifically
  convertBiomedicalWasteData(data) {
    const bioCategories = DATA_CONFIGS.waste.framework48.bioMedical.categories;
    const results = [];
    
    if (Array.isArray(data.answer) && data.answer.length > 0) {
      // Handle biomedical waste with multiple categories
      bioCategories.forEach((category, index) => {
        const value = Array.isArray(data.answer[0]) 
          ? data.answer[0][index] 
          : data.answer[index];
        
        results.push({
          ...data,
          answer: {
            process: 1,
            readingValue: this.parseNumericValue(value).toString(),
            unit: data.unit || "KG"
          },
          wasteType: category,
          title: category,
          category: 'bioMedical'
        });
      });
    }
    
    return results.length > 1 ? results : results[0] || data;
  }

  // Create summary structure for framework 48
  createSummaryStructure(locationOption, timePeriods, categories) {
    const transformedKeys = Object.keys(timePeriods);
    const summary = { time: {}, location: {} };

    // Initialize location-based structure
    locationOption.forEach(location => {
      transformedKeys.forEach(quarter => {
        if (!summary.location[quarter]) {
          summary.location[quarter] = {};
        }
        categories.forEach(category => {
          summary.location[quarter][category] = new Array(locationOption.length).fill(0);
        });
      });
    });

    // Initialize time-based structure
    transformedKeys.forEach(quarter => {
      locationOption.forEach(location => {
        if (!summary.time[location?.unitCode]) {
          summary.time[location.unitCode] = {};
        }
        categories.forEach(category => {
          summary.time[location.unitCode][category] = new Array(transformedKeys.length).fill(0);
        });
      });
    });

    return { summary, transformedKeys };
  }

  // Populate summary with data
  populateSummary(summary, transformedKeys, locationOption, timePeriods, convertedData, matchBy = 'fuelType') {
    const timeKey = Object.keys(summary.location);
    const locationKey = Object.keys(summary.time);

    // Populate time-based data
    for (const location in summary.time) {
      const data = summary.time[location];
      for (const key in data) {
        for (let k = 0; k < data[key].length; k++) {
          const time = timeKey[k];
          const obj = locationOption.find(item => item.unitCode === location);

          if (obj) {
            const formDate = timePeriods[time];
            const filterData = convertedData.find(item =>
              (matchBy === 'fuelType' ? item.fuelType === key : item.title === key) &&
              item.formDate === formDate &&
              item.sourceId === obj.id
            );
            summary.time[location][key][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    // Populate location-based data
    for (const time in summary.location) {
      const data = summary.location[time];
      for (const key in data) {
        for (let k = 0; k < data[key].length; k++) {
          const location = locationKey[k];
          const obj = locationOption.find(item => item.unitCode === location);

          if (obj) {
            const formDate = timePeriods[time];
            const filterData = convertedData.find(item =>
              (matchBy === 'fuelType' ? item.fuelType === key : item.title === key) &&
              item.formDate === formDate &&
              item.sourceId === obj.id
            );
            summary.location[time][key][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    return summary;
  }

  // Populate waste summary with proper waste type matching
  populateWasteSummary(summary, transformedKeys, locationOption, timePeriods, convertedData) {
    const timeKey = Object.keys(summary.location);
    const locationKey = Object.keys(summary.time);

    // Populate time-based data
    for (const location in summary.time) {
      const data = summary.time[location];
      for (const wasteType in data) {
        for (let k = 0; k < data[wasteType].length; k++) {
          const time = timeKey[k];
          const obj = locationOption.find(item => item.unitCode === location);

          if (obj) {
            const formDate = timePeriods[time];
            const filterData = convertedData.find(item =>
              (item.wasteType === wasteType || item.title === wasteType) &&
              item.formDate === formDate &&
              item.sourceId === obj.id
            );
            summary.time[location][wasteType][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    // Populate location-based data
    for (const time in summary.location) {
      const data = summary.location[time];
      for (const wasteType in data) {
        for (let k = 0; k < data[wasteType].length; k++) {
          const location = locationKey[k];
          const obj = locationOption.find(item => item.unitCode === location);

          if (obj) {
            const formDate = timePeriods[time];
            const filterData = convertedData.find(item =>
              (item.wasteType === wasteType || item.title === wasteType) &&
              item.formDate === formDate &&
              item.sourceId === obj.id
            );
            summary.location[time][wasteType][k] = Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
    }

    return summary;
  }

  // Calculate category-wise totals for waste
  calculateWasteCategoryTotals(summary, timePeriods, config) {
    const categoryTotals = {
      nonHazardous: {},
      hazardous: {},
      bioMedical: {}
    };

    const periods = Object.entries(timePeriods || {});

    periods.forEach(([period, formDate]) => {
      // Non-Hazardous waste totals
      let nonHazTotal = 0;
      config.nonHazardous.forEach(wasteType => {
        const locationData = summary.location?.[period]?.[wasteType];
        if (Array.isArray(locationData)) {
          nonHazTotal += locationData.reduce((sum, value) => sum + (value || 0), 0);
        }
      });
      categoryTotals.nonHazardous[formDate] = nonHazTotal;

      // Hazardous waste totals
      let hazTotal = 0;
      config.hazardous.forEach(wasteType => {
        const locationData = summary.location?.[period]?.[wasteType];
        if (Array.isArray(locationData)) {
          hazTotal += locationData.reduce((sum, value) => sum + (value || 0), 0);
        }
      });
      categoryTotals.hazardous[formDate] = hazTotal;

      // Biomedical waste totals
      let bioTotal = 0;
      config.bioMedical.categories.forEach(wasteType => {
        const locationData = summary.location?.[period]?.[wasteType];
        if (Array.isArray(locationData)) {
          bioTotal += locationData.reduce((sum, value) => sum + (value || 0), 0);
        }
      });
      categoryTotals.bioMedical[formDate] = bioTotal;
    });

    return categoryTotals;
  }

  // Calculate total waste by category
  calculateTotalsByWasteCategory(summary, config) {
    const totals = {
      nonHazardous: 0,
      hazardous: 0,
      bioMedical: 0,
      overall: 0
    };

    // Calculate totals for each category
    Object.keys(summary.location || {}).forEach(period => {
      const locationData = summary.location[period];
      
      // Non-hazardous totals
      config.nonHazardous.forEach(wasteType => {
        const values = locationData[wasteType] || [];
        totals.nonHazardous += values.reduce((sum, value) => sum + (value || 0), 0);
      });

      // Hazardous totals
      config.hazardous.forEach(wasteType => {
        const values = locationData[wasteType] || [];
        totals.hazardous += values.reduce((sum, value) => sum + (value || 0), 0);
      });

      // Biomedical totals
      config.bioMedical.categories.forEach(wasteType => {
        const values = locationData[wasteType] || [];
        totals.bioMedical += values.reduce((sum, value) => sum + (value || 0), 0);
      });
    });

    totals.overall = totals.nonHazardous + totals.hazardous + totals.bioMedical;
    return totals;
  }

  // Enhanced framework48 waste processing
  processFramework48WasteData(data, timePeriods, locationOption) {
    const config = DATA_CONFIGS.waste.framework48;
    
    // Filter data by question IDs
    const allQuestionIds = config.getAllQuestionIds();
    let filteredData = data.filter(item => 
      allQuestionIds.includes(item?.questionId)
    );

    // Convert waste data
    let convertedData = [];
    filteredData.forEach(item => {
      const converted = this.convertWasteData([item]);
      if (Array.isArray(converted[0])) {
        // Handle biomedical waste that returns multiple items
        convertedData.push(...converted[0]);
      } else {
        convertedData.push(converted[0]);
      }
    });

    // Get all categories including biomedical
    const categories = config.getAllCategories();
    
    // Create summary structure
    const { summary, transformedKeys } = this.createSummaryStructure(
      locationOption, timePeriods, categories
    );

    // Populate summary with waste data
    const result = this.populateWasteSummary(
      summary, transformedKeys, locationOption,
      timePeriods, convertedData
    );

    // Calculate category-wise totals
    const categoryWiseTotals = this.calculateWasteCategoryTotals(
      result, timePeriods, config
    );

    return {
      ...result,
      periodWiseTotals: this.calculateFramework48PeriodTotals(result, timePeriods),
      categoryWiseTotals: categoryWiseTotals,
      totalsByCategory: this.calculateTotalsByWasteCategory(result, config)
    };
  }

  // Process framework 1 data
  processFramework1Data(data, timePeriods, locationOption) {
    const results = {};

    if (this.dataType === 'energy') {
      const renewableData = this.filterData(
        data, timePeriods, locationOption,
        this.config.framework1.renewable.title
      );
      results.renewable = {
        data: renewableData,
        total: this.config.framework1.renewable.calculateTotal(renewableData),
        periodWiseTotals: this.config.framework1.renewable.calculatePeriodWiseTotals(renewableData, timePeriods)
      };

      const nonRenewableData = this.filterData(
        data, timePeriods, locationOption,
        this.config.framework1.nonRenewable.title
      );
      results.nonRenewable = {
        data: nonRenewableData,
        total: this.config.framework1.nonRenewable.calculateTotal(nonRenewableData),
        periodWiseTotals: this.config.framework1.nonRenewable.calculatePeriodWiseTotals(nonRenewableData, timePeriods)
      };

    } else if (this.dataType === 'emission') {
      // Process emissions data
      const emissionData = this.filterData(
        data, timePeriods, locationOption,
        this.config.framework1.scope1.title
      );

      // Process Scope 1 (filtered data)
      const scope1ProcessedData = this.config.framework1.scope1.processData(emissionData);
      const scope1FilteredData = scope1ProcessedData.filter((item) =>
        Object.values(timePeriods || []).includes(item.formDate)
      ).filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      results.scope1 = {
        data: scope1FilteredData,
        total: this.config.framework1.scope1.calculateTotal(scope1FilteredData),
        periodWiseTotals: this.config.framework1.scope1.calculatePeriodWiseTotals(scope1FilteredData, timePeriods)
      };

      // Process Scope 2 (filtered data)
      const scope2ProcessedData = this.config.framework1.scope2.processData(emissionData);
      const scope2FilteredData = scope2ProcessedData.filter((item) =>
        Object.values(timePeriods || []).includes(item.formDate)
      ).filter((item) =>
        locationOption.some((location) => location.id === item.sourceId)
      );

      results.scope2 = {
        data: scope2FilteredData,
        total: this.config.framework1.scope2.calculateTotal(scope2FilteredData),
        periodWiseTotals: this.config.framework1.scope2.calculatePeriodWiseTotals(scope2FilteredData, timePeriods)
      };

    } else if (this.dataType === 'water') {
      // Process water withdrawal
      const withdrawalData = this.filterData(
        data, timePeriods, locationOption,
        this.config.framework1.withdrawal.title
      );

      const withdrawalTotal = this.config.framework1.withdrawal.series
        .map((_, index) =>
          withdrawalData.reduce((acc, obj) => {
            const value = obj.answer?.[index]?.[0];
            return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
          }, 0)
        )
        .reduce((sum, value) => sum + value, 0);

      results.withdrawal = {
        data: withdrawalData,
        total: withdrawalTotal,
        periodWiseTotals: this.config.framework1.withdrawal.calculatePeriodWiseTotals(withdrawalData, timePeriods)
      };

      // Process water discharge
      const dischargeData = this.filterData(
        data, timePeriods, locationOption,
        this.config.framework1.discharge.title
      );

      const dischargeTotal = this.config.framework1.discharge.series
        .map((_, index) =>
          dischargeData.reduce((acc, obj) => {
            const value = obj.answer?.[index];
            return acc + (value ?
              value.slice(0, 2).reduce((sum, val) =>
                sum + (val === "NA" || !val ? 0 : parseFloat(val)), 0
              ) : 0);
          }, 0)
        )
        .reduce((sum, value) => sum + value, 0);

      results.discharge = {
        data: dischargeData,
        total: dischargeTotal,
        periodWiseTotals: this.config.framework1.discharge.calculatePeriodWiseTotals(dischargeData, timePeriods)
      };

    } else if (this.dataType === 'waste') {
      // Process waste management, disposal, and recovery
      ['management', 'disposal', 'recovery'].forEach(category => {
        const categoryData = this.filterData(
          data, timePeriods, locationOption,
          this.config.framework1[category].title
        );

        const total = categoryData.reduce((sum, item) => {
          const answers = item.answer?.[0] || [];
          return sum + answers.reduce((itemSum, value) => {
            const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
            return itemSum + numericValue;
          }, 0);
        }, 0);

        results[category] = {
          data: categoryData,
          total: total,
          periodWiseTotals: this.config.framework1[category].calculatePeriodWiseTotals(categoryData, timePeriods)
        };
      });
    }

    return results;
  }

  processFramework48Data(data, timePeriods, locationOption) {
    let categories, questionIds, filteredData;

    if (this.dataType === 'energy') {
      categories = this.config.framework48.fuelTypes;
      questionIds = this.config.framework48.questionIds;
      filteredData = data;

      const convertedData = this.convertMixedData(filteredData);
      const { summary, periodKeys } = this.createSummaryStructure(
        locationOption, timePeriods, categories
      );

      const result = this.populateSummary(
        summary, periodKeys, locationOption,
        timePeriods, convertedData, 'fuelType'
      );

      // Calculate category-wise totals for fuel, electricity, and renewable
      const categoryTypes = ['fuel', 'electricity', 'renewable'];
      const categoryWiseTotals = this.calculateCategoryWisePeriodTotals(
        result, timePeriods, categoryTypes
      );

      return {
        ...result,
        periodWiseTotals: this.calculateFramework48PeriodTotals(result, timePeriods),
        categoryWiseTotals: categoryWiseTotals
      };

    } else if (this.dataType === 'emission') {
      // Handle emissions separately for Scope 1 and Scope 2
      const scope1Data = data.filter(item =>
        this.config.framework48.scope1QuestionIds.includes(item?.questionId)
      );
      const scope2Data = data.filter(item =>
        this.config.framework48.scope2QuestionIds.includes(item?.questionId)
      );

      const scope1ConvertedData = this.convertMixedData(scope1Data);
      const scope2ConvertedData = this.convertMixedData(scope2Data);

      // Process Scope 1
      const { summary: scope1Summary } = this.createSummaryStructure(
        locationOption, timePeriods, this.config.framework48.scope1FuelTypes
      );
      const scope1Result = this.populateSummary(
        scope1Summary, Object.keys(timePeriods), locationOption,
        timePeriods, scope1ConvertedData, 'fuelType'
      );

      // Process Scope 2
      const { summary: scope2Summary } = this.createSummaryStructure(
        locationOption, timePeriods, this.config.framework48.scope2FuelTypes
      );
      const scope2Result = this.populateSummary(
        scope2Summary, Object.keys(timePeriods), locationOption,
        timePeriods, scope2ConvertedData, 'fuelType'
      );

      return {
        scope1: {
          ...scope1Result,
          periodWiseTotals: this.calculateFramework48PeriodTotals(scope1Result, timePeriods)
        },
        scope2: {
          ...scope2Result,
          periodWiseTotals: this.calculateFramework48PeriodTotals(scope2Result, timePeriods)
        }
      };

    } else if (this.dataType === 'water') {
      categories = this.config.framework48.categories;
      questionIds = this.config.framework48.questionIds;
      filteredData = data.filter(item => questionIds.includes(item?.questionId));
    } else if (this.dataType === 'waste') {
      return this.processFramework48WasteData(data, timePeriods, locationOption);
    }

    if (this.dataType === 'water') {
      const convertedData = this.convertMixedData(filteredData);
      const { summary, periodKeys } = this.createSummaryStructure(
        locationOption, timePeriods, categories
      );

      const matchBy = 'title';

      const result = this.populateSummary(
        summary, periodKeys, locationOption,
        timePeriods, convertedData, matchBy
      );

      return {
        ...result,
        periodWiseTotals: this.calculateFramework48PeriodTotals(result, timePeriods)
      };
    }
  }

  process(data, timePeriods, locationOption, companyFramework) {
    this.state.timePeriodValues = Object.values(timePeriods || []);
    if (companyFramework?.includes(1)) {
      return this.processFramework1Data(data, timePeriods, locationOption);
    } else if (companyFramework?.includes(48)) {
      return this.processFramework48Data(data, timePeriods, locationOption);
    }
    return {};
  }
}

class EnvironmentalDataManager {
  constructor() {
    this.processors = {
      energy: new EnvironmentalDataProcessor('energy'),
      water: new EnvironmentalDataProcessor('water'),
      waste: new EnvironmentalDataProcessor('waste'),
      emission: new EnvironmentalDataProcessor('emission')
    };

    this.state = {
      energyData: {},
      waterData: {},
      wasteData: {},
      emissionData: {},
      isLoading: false,
      error: null
    };
  }

  async processAllData(rawData, timePeriods, locationOption, companyFramework) {
    this.state.isLoading = true;
    this.state.error = null;

    try {
      // Process each data type
      const results = {};

      for (const [dataType, processor] of Object.entries(this.processors)) {
        const relevantData = rawData[dataType] || [];
        results[dataType] = processor.process(
          relevantData, timePeriods, locationOption, companyFramework
        );
      }

      // Update state
      this.state = {
        ...this.state,
        energyData: results.energy || {},
        waterData: results.water || {},
        wasteData: results.waste || {},
        emissionData: results.emission || {},
        isLoading: false
      };

      return results;

    } catch (error) {
      this.state.error = error;
      this.state.isLoading = false;
      console.error('Error processing environmental data:', error);
      throw error;
    }
  }

  // Get processed data for a specific type
  getData(dataType) {
    return this.state[`${dataType}Data`] || {};
  }

  // Get totals for a specific data type
  getTotals(dataType) {
    const data = this.getData(dataType);
    const totals = {};

    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key].total !== 'undefined') {
        totals[key] = data[key].total;
      }
    });

    return totals;
  }

  // Get period-wise totals for a specific data type
  getPeriodWiseTotals(dataType) {
    const data = this.getData(dataType);
    const periodWiseTotals = {};

    Object.keys(data).forEach(key => {
      if (data[key] && data[key].periodWiseTotals) {
        periodWiseTotals[key] = data[key].periodWiseTotals;
      }
    });

    return periodWiseTotals;
  }

  // Get category-wise totals for framework48 energy/waste data
  getCategoryWiseTotals(dataType) {
    const data = this.getData(dataType);
    return data.categoryWiseTotals || {};
  }

  // Get all totals (overall and period-wise) for a specific data type
  getAllTotals(dataType) {
    const data = this.getData(dataType);
    const allTotals = {};

    Object.keys(data).forEach(key => {
      if (data[key]) {
        allTotals[key] = {
          overall: data[key].total || 0,
          periodWise: data[key].periodWiseTotals || {}
        };
      }
    });

    return allTotals;
  }

  // Get energy category breakdown for framework48
  getEnergyCategoryBreakdown() {
    const energyData = this.getData('energy');
    if (energyData.categoryWiseTotals) {
      return {
        fuel: energyData.categoryWiseTotals.fuel || {},
        electricity: energyData.categoryWiseTotals.electricity || {},
        renewable: energyData.categoryWiseTotals.renewable || {}
      };
    }
    return { fuel: {}, electricity: {}, renewable: {} };
  }

  // Get waste category breakdown for framework48
  getWasteCategoryBreakdown() {
    const wasteData = this.getData('waste');
    if (wasteData.categoryWiseTotals) {
      return {
        nonHazardous: wasteData.categoryWiseTotals.nonHazardous || {},
        hazardous: wasteData.categoryWiseTotals.hazardous || {},
        bioMedical: wasteData.categoryWiseTotals.bioMedical || {}
      };
    }
    return { nonHazardous: {}, hazardous: {}, bioMedical: {} };
  }

  // Get waste totals by category
  getWasteTotalsByCategory() {
    const wasteData = this.getData('waste');
    return wasteData.totalsByCategory || {
      nonHazardous: 0,
      hazardous: 0,
      bioMedical: 0,
      overall: 0
    };
  }

  // Get summary of all data types with totals
  getSummary() {
    const summary = {};

    Object.keys(this.processors).forEach(dataType => {
      summary[dataType] = {
        data: this.getData(dataType),
        totals: this.getTotals(dataType),
        periodWiseTotals: this.getPeriodWiseTotals(dataType),
        allTotals: this.getAllTotals(dataType)
      };

      // Add category-wise totals for energy if available
      if (dataType === 'energy') {
        summary[dataType].categoryWiseTotals = this.getCategoryWiseTotals(dataType);
        summary[dataType].categoryBreakdown = this.getEnergyCategoryBreakdown();
      }

      // Add category-wise totals for waste if available
      if (dataType === 'waste') {
        summary[dataType].categoryWiseTotals = this.getCategoryWiseTotals(dataType);
        summary[dataType].categoryBreakdown = this.getWasteCategoryBreakdown();
        summary[dataType].totalsByCategory = this.getWasteTotalsByCategory();
      }

      if (dataType === 'water') {
        summary[dataType].categoryWiseTotals = this.getCategoryWiseTotals(dataType);
      }
    });

    return summary;
  }
}

// Helper function to calculate grand totals across all categories
function calculateGrandTotals(results) {
  const grandTotals = {
    overall: {},
    periodWise: {},
    categoryWise: {}
  };

  Object.keys(results).forEach(dataType => {
    const dataResults = results[dataType];
    let overallTotal = 0;
    const periodTotals = {};

    Object.keys(dataResults).forEach(category => {
      if (dataResults[category] && typeof dataResults[category].total === 'number') {
        overallTotal += dataResults[category].total;
      }

      if (dataResults[category] && dataResults[category].periodWiseTotals) {
        Object.keys(dataResults[category].periodWiseTotals).forEach(period => {
          if (!periodTotals[period]) {
            periodTotals[period] = 0;
          }
          periodTotals[period] += dataResults[category].periodWiseTotals[period] || 0;
        });
      }
    });

    grandTotals.overall[dataType] = overallTotal;
    grandTotals.periodWise[dataType] = periodTotals;

    // Add category-wise totals for energy and waste
    if ((dataType === 'energy' || dataType === 'waste') && dataResults.categoryWiseTotals) {
      grandTotals.categoryWise[dataType] = dataResults.categoryWiseTotals;
    }
  });

  return grandTotals;
}

// Helper function to get energy category totals
function getEnergyCategoryTotals(energyResults, timePeriods) {
  if (!energyResults.categoryWiseTotals) {
    return { fuel: {}, electricity: {}, renewable: {} };
  }

  return {
    fuel: energyResults.categoryWiseTotals.fuel || {},
    electricity: energyResults.categoryWiseTotals.electricity || {},
    renewable: energyResults.categoryWiseTotals.renewable || {}
  };
}

// Helper function to get waste category totals
function getWasteCategoryTotals(wasteResults, timePeriods) {
  if (!wasteResults.categoryWiseTotals) {
    return { nonHazardous: {}, hazardous: {}, bioMedical: {} };
  }

  return {
    nonHazardous: wasteResults.categoryWiseTotals.nonHazardous || {},
    hazardous: wasteResults.categoryWiseTotals.hazardous || {},
    bioMedical: wasteResults.categoryWiseTotals.bioMedical || {}
  };
}

// Enhanced example usage function
function exampleUsage() {
  const manager = new EnvironmentalDataManager();

  // Sample waste data structure for framework48
  const wasteData = [
    {
      questionId: 400, // Cardboard waste
      title: "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
      answer: [150], // or nested array [[150]]
      unit: "KG",
      formDate: "2024-01-01",
      sourceId: 1
    },
    {
      questionId: 409, // Biomedical waste
      title: "Biomedical Waste",
      answer: [[10, 20, 5, 15, 8]], // Yellow, Red, White, Blue, Cytotoxic
      unit: "KG",
      formDate: "2024-01-01",
      sourceId: 1
    },
    {
      questionId: 408, // E-waste
      title: "Total e-waste generated* (Kg)",
      answer: [{readingValue: "25", unit: "KG"}],
      formDate: "2024-01-01",
      sourceId: 1
    }
  ];

  // Sample data structure
  const rawData = {
    energy: [/* energy data with fuelType field */],
    water: [/* water data */],
    waste: wasteData,
    emission: [/* emission data */]
  };

  const timePeriods = {
    'Q1': '2024-01-01',
    'Q2': '2024-04-01',
    'Q3': '2024-07-01',
    'Q4': '2024-10-01'
  };

  const locationOption = [
    { id: 1, unitCode: 'LOC001' },
    { id: 2, unitCode: 'LOC002' }
  ];

  const companyFramework = [48]; // Using framework48 for categorized energy and waste

  // Process all data
  manager.processAllData(rawData, timePeriods, locationOption, companyFramework)
    .then(results => {
      // Get overall energy totals
      console.log('Energy Totals:', manager.getTotals('energy'));

      // Get energy category breakdown for framework48
      console.log('Energy Category Breakdown:', manager.getEnergyCategoryBreakdown());

      // Get waste category breakdown for framework48
      console.log('Waste Category Breakdown:', manager.getWasteCategoryBreakdown());

      // Get waste totals by category
      console.log('Waste Totals by Category:', manager.getWasteTotalsByCategory());

      // Get category-wise period totals
      console.log('Energy Category-wise Totals:', manager.getCategoryWiseTotals('energy'));
      console.log('Waste Category-wise Totals:', manager.getCategoryWiseTotals('waste'));

      // Get period-wise totals
      console.log('Energy Period-wise Totals:', manager.getPeriodWiseTotals('energy'));
      console.log('Waste Period-wise Totals:', manager.getPeriodWiseTotals('waste'));

      // Get complete summary with categories
      console.log('Complete Summary:', manager.getSummary());

      // Calculate grand totals including categories
      console.log('Grand Totals with Categories:', calculateGrandTotals(results));

      // Get specific category totals
      console.log('Energy Category Totals:', getEnergyCategoryTotals(results.energy, timePeriods));
      console.log('Waste Category Totals:', getWasteCategoryTotals(results.waste, timePeriods));
    })
    .catch(error => {
      console.error('Processing failed:', error);
    });
}

export {
  EnvironmentalDataProcessor,
  EnvironmentalDataManager,
  DATA_CONFIGS,
  calculateGrandTotals,
  getEnergyCategoryTotals,
  getWasteCategoryTotals,
  exampleUsage
};