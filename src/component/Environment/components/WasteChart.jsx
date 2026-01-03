import React from 'react';
import Chart from 'react-apexcharts';
import ChartContainer from './ChartContainer';

const WasteChart = ({ 
  wasteData, 
  isLoading, 
  companyFramework,
  comparisonMode = false,
  comparisonData = null 
}) => {
  console.log(wasteData, "wasteDatawasteDatawasteData");
  
  // Calculate waste totals from dynamic data
  const calculateWasteTotals = (data, framework) => {
    if (!data || Object.keys(data).length === 0) {
      return { generated: 0, disposed: 0, recovered: 0, nonHazardous: 0, hazardous: 0, bioMedical: 0 };
    }

    if (framework?.includes(1)) {
      // Framework 1 calculation - unchanged
      const generated = data.management?.total || 0;
      const disposed = data.disposal?.total || 0;
      const recovered = data.recovery?.total || 0;
      
      return { generated, disposed, recovered, nonHazardous: 0, hazardous: 0, bioMedical: 0 };
    } else if (framework?.includes(48)) {
      // Framework 48 calculation with enhanced category-wise totals
      let nonHazardous = 0;
      let hazardous = 0;
      let bioMedical = 0;
      let total = 0;

      // Check if the new enhanced structure is available
      if (data.totalsByCategory) {
        // Use the totalsByCategory from enhanced processor
        nonHazardous = data.totalsByCategory.nonHazardous || 0;
        hazardous = data.totalsByCategory.hazardous || 0;
        bioMedical = data.totalsByCategory.bioMedical || 0;
        total = data.totalsByCategory.overall || (nonHazardous + hazardous + bioMedical);
      } else if (data.categoryWiseTotals) {
        // Use categoryWiseTotals if available (period-wise totals)
        const periods = Object.keys(data.categoryWiseTotals.nonHazardous || {});
        
        periods.forEach(period => {
          nonHazardous += data.categoryWiseTotals.nonHazardous?.[period] || 0;
          hazardous += data.categoryWiseTotals.hazardous?.[period] || 0;
          bioMedical += data.categoryWiseTotals.bioMedical?.[period] || 0;
        });
        
        total = nonHazardous + hazardous + bioMedical;
      } else if (data.time) {
        // Fallback to old calculation method using enhanced categories
        const nonHazardousTypes = [
          "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
          "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
          "Total packaging waste (Plastic) generated* (Kg)",
          "Total food waste generated/Kitchen Waste* (Kgs)"
        ];
        
        const hazardousTypes = [
          "Total e-waste generated* (Kg)",
          "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
          "Total spent formalin solution disposed in Ltrs"
        ];
        
        const bioMedicalTypes = ["Yellow", "Red", "White", "Blue", "Cytotoxic"];

        Object.keys(data.time).forEach(location => {
          Object.keys(data.time[location]).forEach(wasteType => {
            const values = data.time[location][wasteType] || [];
            const wasteTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
            
            if (nonHazardousTypes.includes(wasteType)) {
              nonHazardous += wasteTotal;
            } else if (hazardousTypes.includes(wasteType)) {
              hazardous += wasteTotal;
            } else if (bioMedicalTypes.includes(wasteType)) {
              bioMedical += wasteTotal;
            }
            total += wasteTotal;
          });
        });
      } else if (data.location) {
        // Alternative calculation using location-based data
        Object.keys(data.location).forEach(period => {
          const locationData = data.location[period];
          
          const nonHazardousTypes = [
            "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
            "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
            "Total packaging waste (Plastic) generated* (Kg)",
            "Total food waste generated/Kitchen Waste* (Kgs)"
          ];
          
          const hazardousTypes = [
            "Total e-waste generated* (Kg)",
            "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
            "Total spent formalin solution disposed in Ltrs"
          ];
          
          const bioMedicalTypes = ["Yellow", "Red", "White", "Blue", "Cytotoxic"];

          Object.keys(locationData || {}).forEach(wasteType => {
            const values = locationData[wasteType] || [];
            const wasteTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
            
            if (nonHazardousTypes.includes(wasteType)) {
              nonHazardous += wasteTotal;
            } else if (hazardousTypes.includes(wasteType)) {
              hazardous += wasteTotal;
            } else if (bioMedicalTypes.includes(wasteType)) {
              bioMedical += wasteTotal;
            }
          });
        });
        
        total = nonHazardous + hazardous + bioMedical;
      }

      return {
        generated: total, // For backward compatibility
        disposed: 0, // Not applicable for framework 48
        recovered: 0, // Not applicable for framework 48
        nonHazardous,
        hazardous,
        bioMedical
      };
    }

    return { generated: 0, disposed: 0, recovered: 0, nonHazardous: 0, hazardous: 0, bioMedical: 0 };
  };

  const getChartConfiguration = (framework) => {
    if (framework?.includes(48)) {
      // Framework 48 - Show 4 categories with enhanced colors
      return {
        categories: ['Non-Hazardous Waste', 'Hazardous Waste', 'Bio-Medical Waste', 'Total Waste Generated'],
        colors: comparisonMode ? 
          ['#10b981', '#ef4444', '#f59e0b', '#6366f1'] : 
          ['#10b981', '#ef4444', '#f59e0b', '#6366f1'],
        dataExtractor: (totals) => [
          Math.round(totals.nonHazardous * 100) / 100, // Round to 2 decimal places
          Math.round(totals.hazardous * 100) / 100,
          Math.round(totals.bioMedical * 100) / 100,
          Math.round(totals.generated * 100) / 100
        ]
      };
    } else {
      // Framework 1 - Show 3 categories (unchanged)
      return {
        categories: ['Waste Generated', 'Waste Disposed', 'Waste Recovered'],
        colors: comparisonMode ? 
          ['#f97316', '#ea580c', '#dc2626'] : 
          ['#f97316', '#ea580c', '#dc2626'],
        dataExtractor: (totals) => [
          Math.round(totals.generated * 100) / 100,
          Math.round(totals.disposed * 100) / 100,
          Math.round(totals.recovered * 100) / 100
        ]
      };
    }
  };

  const config = getChartConfiguration(companyFramework);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: comparisonMode ? '60%' : '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top' // Show data labels on top of bars
        }
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        if (val === 0) return '';
        const unit = companyFramework?.includes(48) ? ' Kg' : ' MT';
        return val.toLocaleString() + unit;
      },
      offsetY: -20,
      style: {
        fontSize: '10px',
        colors: ['#374151']
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: config.categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        },
        rotate: companyFramework?.includes(48) ? -45 : 0, // Rotate labels for Framework 48
        maxHeight: companyFramework?.includes(48) ? 120 : 60
      }
    },
    yaxis: {
      title: {
        text: companyFramework?.includes(48) ? 'Waste (Kg)' : 'Waste (MT)',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
labels: {
  style: { fontSize: '12px', colors: '#6b7280' },
  formatter: (val) => Math.round(val) // no decimals
}
    },
    fill: {
      opacity: comparisonMode ? 0.8 : 1,
      colors: config.colors
    },
    tooltip: {
      y: {
        formatter: function (val) {
          const unit = companyFramework?.includes(48) ? " Kg" : " MT";
          return val.toLocaleString() + unit;
        }
      },
      theme: 'light',
      style: {
        fontSize: '12px'
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: comparisonMode,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    },
    // Ensure proper colors for comparison mode
    colors: comparisonMode ? ['#f97316', '#ea580c'] : config.colors,
    responsive: [{
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        },
        dataLabels: {
          style: {
            fontSize: '9px'
          }
        },
        xaxis: {
          labels: {
            rotate: -45,
            style: {
              fontSize: '10px'
            }
          }
        }
      }
    }]
  };

  // Prepare series data
  let series;

  if (comparisonMode && comparisonData) {
    const currentTotals = calculateWasteTotals(wasteData, companyFramework);
    const previousTotals = calculateWasteTotals(comparisonData.wasteData, companyFramework);

    series = [
      {
        name: 'Current Period',
        data: config.dataExtractor(currentTotals)
      },
      {
        name: 'Previous Period',
        data: config.dataExtractor(previousTotals)
      }
    ];
  } else {
    const totals = calculateWasteTotals(wasteData, companyFramework);
    series = [{
      name: companyFramework?.includes(48) ? 'Waste Categories' : 'Waste',
      data: config.dataExtractor(totals)
    }];
  }

  // Generate title based on framework
  const getChartTitle = () => {
    if (companyFramework?.includes(48)) {
      return "Waste Management by Category";
    }
    return "Waste Management Overview";
  };

  // Calculate summary statistics for display
  const getSummaryStats = () => {
    const totals = calculateWasteTotals(wasteData, companyFramework);
    
    if (companyFramework?.includes(48)) {
      return {
        total: totals.generated,
        breakdown: [
          { label: 'Non-Hazardous', value: totals.nonHazardous, color: '#10b981' },
          { label: 'Hazardous', value: totals.hazardous, color: '#ef4444' },
          { label: 'Bio-Medical', value: totals.bioMedical, color: '#f59e0b' }
        ]
      };
    } else {
      return {
        total: totals.generated,
        breakdown: [
          { label: 'Generated', value: totals.generated, color: '#f97316' },
          { label: 'Disposed', value: totals.disposed, color: '#ea580c' },
          { label: 'Recovered', value: totals.recovered, color: '#dc2626' }
        ]
      };
    }
  };

  const summaryStats = getSummaryStats();

  return (
    <ChartContainer title={getChartTitle()} isLoading={isLoading}>

      <Chart options={chartOptions} series={series} type="bar" height={300} />
    
    </ChartContainer>
  );
};

export default WasteChart;