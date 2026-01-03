import React from "react";
import { Col, Row, Card } from "react-bootstrap";

const SummaryIPCCComponent = ({ data = [] }) => {

  console.log(data,"datadata")
  
  // Format numbers with K, M functionality
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Parse JSON safely
  const parseJsonSafely = (jsonString, fallback = {}) => {
    if (!jsonString) return fallback;
    if (typeof jsonString === 'object') return jsonString;
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON in SummaryIPCCComponent:', error);
      return fallback;
    }
  };

  // Enhanced function to get activity amount based on category and method
  const getActivityAmount = (item) => {
    const { category, method, consumedAmount } = item;
    const inputDetails = parseJsonSafely(item.inputDetails);
    
    if (category === "mobile") {
      if (method === "distance") {
        return parseFloat(inputDetails?.distanceTravelled || consumedAmount || 0);
      } else if (method === "freight") {
        const freightWeight = parseFloat(inputDetails?.freightWeight || 0);
        const distanceTravelled = parseFloat(inputDetails?.distanceTravelled || 0);
        if (freightWeight && distanceTravelled) {
          return freightWeight * distanceTravelled; // tonne-km
        } else {
          return freightWeight || distanceTravelled || parseFloat(consumedAmount || 0);
        }
      } else if (method === "public_transport") {
        const passengerCount = parseFloat(inputDetails?.passengerCount || 1);
        const distanceTravelled = parseFloat(inputDetails?.distanceTravelled || 0);
        if (distanceTravelled) {
          return passengerCount * distanceTravelled; // passenger-km
        }
      } else if (method === "fuel_use") {
        return parseFloat(inputDetails?.activityAmount || consumedAmount || 0);
      }
    } else if (category === "fugitive") {
      // Mass balance approach for fugitive emissions
      const initialQuantity = parseFloat(inputDetails?.initialQuantity || 0);
      const quantityPurchased = parseFloat(inputDetails?.quantityPurchased || 0);
      const quantityRecovered = parseFloat(inputDetails?.quantityRecovered || 0);
      
      if (initialQuantity || quantityPurchased || quantityRecovered) {
        return initialQuantity + quantityPurchased - quantityRecovered;
      }
    } else if (category === "stationary") {
      return parseFloat(inputDetails?.activityAmount || consumedAmount || 0);
    }
    
    // Fallback to consumedAmount or activityAmount
    return parseFloat(
      consumedAmount || 
      inputDetails?.activityAmount || 
      inputDetails?.consumption ||
      inputDetails?.consumedAmount ||
      0
    );
  };

  // FIXED: Get emission factor from actual data structure
  const getEmissionFactor = (item) => {
    const { category, method } = item;
    const inputDetails = parseJsonSafely(item.inputDetails);
    const calculationDetails = parseJsonSafely(item.calculationDetails);
    const calculationResults = parseJsonSafely(item.calculationResults);
    const originalCalculationDetails = item.originalCalculationDetails || {};

    // First, try to get from calculationResults (updated structure)
    if (calculationResults && calculationResults.factor && calculationResults.factor > 0) {
      return parseFloat(calculationResults.factor);
    }

    // Check if emissions are already calculated (but not 0)
    if (calculationResults && calculationResults.co2Emissions && calculationResults.co2Emissions > 0) {
      const activityAmount = getActivityAmount(item);
      if (activityAmount > 0) {
        return parseFloat(calculationResults.co2Emissions) / activityAmount;
      }
    }

    // Try originalCalculationDetails (this is where your actual emission factors are stored)
    if (originalCalculationDetails) {
      // For stationary combustion
      if (category === "stationary" && originalCalculationDetails.factor) {
        return parseFloat(originalCalculationDetails.factor);
      }

      // For mobile combustion
      if (category === "mobile") {
        if (method === "fuel_use") {
          // Use the appropriate fuel emission factor
          const fuelUseCategory = inputDetails?.fuelUseCategory;
          if (fuelUseCategory === "Fossil" && originalCalculationDetails.fuelFossilCo2Ef) {
            return parseFloat(originalCalculationDetails.fuelFossilCo2Ef);
          } else if (originalCalculationDetails.fuelCh4Ef) {
            return parseFloat(originalCalculationDetails.fuelCh4Ef);
          } else if (originalCalculationDetails.fuelN2oEf) {
            return parseFloat(originalCalculationDetails.fuelN2oEf);
          }
        } else if (method === "distance") {
          // Use distance-based emission factor
          if (originalCalculationDetails.distanceCo2Ef) {
            return parseFloat(originalCalculationDetails.distanceCo2Ef);
          }
        } else if (method === "freight") {
          if (originalCalculationDetails.freightCo2Ef) {
            return parseFloat(originalCalculationDetails.freightCo2Ef);
          }
        } else if (method === "public_transport") {
          if (originalCalculationDetails.publicCo2Ef) {
            return parseFloat(originalCalculationDetails.publicCo2Ef);
          }
        }
      }

      // For fugitive emissions
      if (category === "fugitive" && originalCalculationDetails.factor) {
        return parseFloat(originalCalculationDetails.factor);
      }
    }

    // Legacy approach - check calculationDetails
    if (calculationDetails && calculationDetails.factor && calculationDetails.factor > 0) {
      return parseFloat(calculationDetails.factor);
    }

    // Try to get specific emission factors based on category and method
    if (category === "mobile" && method) {
      if (method === "distance") {
        return parseFloat(calculationDetails?.distanceCo2Ef || 0);
      } else if (method === "freight") {
        return parseFloat(calculationDetails?.freightCo2Ef || 0);
      } else if (method === "public_transport") {
        return parseFloat(calculationDetails?.publicCo2Ef || 0);
      } else if (method === "fuel_use") {
        const fuelUseCategory = inputDetails?.fuelUseCategory;
        if (fuelUseCategory === "Fossil") {
          return parseFloat(calculationDetails?.fuelFossilCo2Ef || 0);
        } else if (fuelUseCategory === "Transport") {
          return parseFloat(
            calculationDetails?.fuelCh4Ef || 
            calculationDetails?.fuelN2oEf || 
            0
          );
        }
        // Fallback for fuel_use
        return parseFloat(
          calculationDetails?.fuelFossilCo2Ef || 
          calculationDetails?.fuelCh4Ef || 
          calculationDetails?.fuelN2oEf || 
          0
        );
      }
    }

    // Check emissionFactor field
    if (item.emissionFactor && item.emissionFactor > 0) {
      return parseFloat(item.emissionFactor);
    }

    // Final fallback
    return parseFloat(calculationDetails?.factor || 0);
  };

  // Calculate emissions for each category
  const calculateEmissions = (category) => {
    return data
      .filter(item => item.category === category)
      .reduce((total, item) => {
        // Check if emissions are already calculated in calculationResults (and not 0)
        const calculationResults = parseJsonSafely(item.calculationResults);
        if (calculationResults && calculationResults.co2Emissions && calculationResults.co2Emissions > 0) {
          console.log(`${category} using pre-calculated emissions:`, {
            item: item.id,
            co2Emissions: calculationResults.co2Emissions
          });
          return total + parseFloat(calculationResults.co2Emissions);
        }

        // Legacy check - try calculatedEmissions field
        if (item.calculatedEmissions && item.calculatedEmissions > 0) {
          console.log(`${category} using legacy calculatedEmissions:`, {
            item: item.id,
            calculatedEmissions: item.calculatedEmissions
          });
          return total + parseFloat(item.calculatedEmissions);
        }

        // Calculate emissions if not pre-calculated or if pre-calculated value is 0
        const activityAmount = getActivityAmount(item);
        const emissionFactor = getEmissionFactor(item);
        
        if (activityAmount <= 0 || emissionFactor <= 0) {
          console.warn(`${category} calculation incomplete:`, {
            item: item.id,
            activityAmount,
            emissionFactor,
            inputDetails: parseJsonSafely(item.inputDetails),
            calculationDetails: parseJsonSafely(item.calculationDetails),
            originalCalculationDetails: item.originalCalculationDetails,
            reason: activityAmount <= 0 ? 'No activity amount' : 'No emission factor'
          });
          return total;
        }

        const emissions = activityAmount * emissionFactor;
        
        console.log(`${category} calculation:`, {
          item: item.id,
          method: item.method,
          activityAmount,
          emissionFactor,
          emissions,
          calculation: `${activityAmount} × ${emissionFactor} = ${emissions}`,
          inputDetails: parseJsonSafely(item.inputDetails),
          originalCalculationDetails: item.originalCalculationDetails
        });

        return total + emissions;
      }, 0);
  };

  const stationaryEmissions = calculateEmissions('stationary');
  const mobileEmissions = calculateEmissions('mobile');
  const fugitiveEmissions = calculateEmissions('fugitive');
  const totalScope1Emissions = stationaryEmissions + mobileEmissions + fugitiveEmissions;

  console.log('Summary calculations:', {
    stationaryEmissions,
    mobileEmissions,
    fugitiveEmissions,
    totalScope1Emissions,
    dataCount: data.length,
    dataStructure: data.map(item => ({
      id: item.id,
      category: item.category,
      method: item.method,
      hasCalculationResults: !!parseJsonSafely(item.calculationResults)?.co2Emissions,
      hasCalculatedEmissions: !!item.calculatedEmissions,
      hasOriginalCalculationDetails: !!item.originalCalculationDetails,
      emissionFactor: getEmissionFactor(item)
    }))
  });

  const EmissionCard = ({ title, emission, variant, icon, gradient, accentColor, bgPattern }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <Col lg={3} md={6} className="mb-4">
        <Card 
          className="border-0 h-100 overflow-hidden"
          style={{
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: isHovered 
              ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0px) scale(1)",
            cursor: "pointer"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient Background Overlay */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: gradient,
              opacity: isHovered ? 0.08 : 0.05,
              transition: "opacity 0.4s ease",
              pointerEvents: "none"
            }}
          />

          {/* Decorative Pattern */}
          <div 
            className="position-absolute"
            style={{
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
              borderRadius: "50%",
              opacity: 0.6,
              transform: isHovered ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.4s ease"
            }}
          />

          <Card.Body className="p-4 d-flex flex-column justify-content-between h-100">
            {/* Icon Section */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "56px",
                  height: "56px",
                  background: gradient,
                  boxShadow: `0 8px 20px ${accentColor}25`,
                  transform: isHovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              </div>
              
              {/* Trend Indicator */}
              <div 
                className="d-flex align-items-center px-2 py-1 rounded-pill"
                style={{
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}25`
                }}
              >
                <span style={{ fontSize: "0.7rem", color: accentColor, fontWeight: "600" }}>
                  ↗ LIVE
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow-1">
              <h3 
                className="mb-2"
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  background: gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.2",
                  margin: "0"
                }}
              >
                {formatNumber(emission)}
              </h3>
              
              <div className="d-flex align-items-center mb-3">
                <span 
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#64748b",
                    backgroundColor: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    letterSpacing: "0.5px"
                  }}
                >
                  kgCO₂e
                </span>
              </div>

              <h6 
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "#475569",
                  margin: "0",
                  lineHeight: "1.3"
                }}
              >
                {title}
              </h6>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div 
                className="rounded-pill"
                style={{
                  height: "4px",
                  background: "#e2e8f0",
                  overflow: "hidden"
                }}
              >
                <div 
                  className="h-100 rounded-pill"
                  style={{
                    background: gradient,
                    width: isHovered ? "85%" : "70%",
                    transition: "width 0.6s ease-in-out"
                  }}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const cardConfigs = [
    {
      title: "TOTAL SCOPE 1 EMISSION",
      emission: totalScope1Emissions,
      variant: "total",
      icon: "🌍",
      gradient: "linear-gradient(135deg, #7494a7, #3c8dbb)",
      accentColor: "#7494a7",
      bgPattern: "primary"
    },
    {
      title: "TOTAL STATIONARY EMISSION",
      emission: stationaryEmissions,
      variant: "stationary",
      icon: "🏭",
      gradient: "linear-gradient(135deg, #3b82f6, #1e40af)",
      accentColor: "#3b82f6",
      bgPattern: "blue"
    },
    {
      title: "TOTAL MOBILE EMISSION",
      emission: mobileEmissions,
      variant: "mobile",
      icon: "🚗",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      accentColor: "#10b981",
      bgPattern: "green"
    },
    {
      title: "TOTAL FUGITIVE EMISSION",
      emission: fugitiveEmissions,
      variant: "fugitive",
      icon: "💨",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      accentColor: "#8b5cf6",
      bgPattern: "purple"
    }
  ];

  return (
    <div 
      className="rounded-4 mb-4"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <Row className="g-4">
        {cardConfigs.map((config, index) => (
          <EmissionCard
            key={index}
            title={config.title}
            emission={config.emission}
            variant={config.variant}
            icon={config.icon}
            gradient={config.gradient}
            accentColor={config.accentColor}
            bgPattern={config.bgPattern}
          />
        ))}
      </Row>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .card:hover .card-body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s ease-in-out;
          pointer-events: none;
        }
        
        .progress-bar-animated {
          background-size: 1rem 1rem;
          animation: progress-bar-stripes 1s linear infinite;
        }
        
        @keyframes progress-bar-stripes {
          0% { background-position: 1rem 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};

export default SummaryIPCCComponent;