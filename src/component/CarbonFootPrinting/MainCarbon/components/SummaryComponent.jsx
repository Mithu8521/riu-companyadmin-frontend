import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card } from "react-bootstrap";

const SummaryComponent = ({
  data = [],
  selectedScope = "SCOPE2",
  scope3Categories,
  showCombined = false,
  scopeData,
  ghgProtocol,
  scope2Categories
}) => {

  // State to store calculated emission totals
  const [emissionTotals, setEmissionTotals] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Format numbers with K, M functionality
  const formatNumber = useCallback((num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    }
    return num.toFixed(2);
  }, []);

  // Enhanced function to get activity amount based on scope, category and method
  const getActivityAmount = useCallback((item) => {
    const { category, method } = item.inputDetails;
    const formData = item.inputDetails.formData;

    let activityAmount = formData?.activityAmount;

    // Scope 1 specific calculations
    if (selectedScope === "SCOPE1") {
      if (category === "mobile") {
        if (method === "distance") {
          activityAmount = activityAmount || formData?.distanceTravelled;
        } else if (method === "freight") {
          const freightWeight = Number(formData?.freightWeight) || 0;
          const distanceTravelled = Number(formData?.distanceTravelled) || 0;
          if (freightWeight && distanceTravelled) {
            activityAmount = freightWeight * distanceTravelled;
          } else {
            activityAmount = freightWeight || distanceTravelled || activityAmount;
          }
        } else if (method === "public_transport") {
          const passengerCount = Number(formData?.passengerCount) || 1;
          const distanceTravelled = Number(formData?.distanceTravelled) || 0;
          if (distanceTravelled) {
            activityAmount = passengerCount * distanceTravelled;
          }
        } else if (method === "fuel_use") {
          activityAmount = activityAmount || formData?.activityAmount;
        } else {
          activityAmount = activityAmount || formData?.activityAmount;
        }
      } else if (category === "fugitive") {
        if (method === 'mass_balance') {
          const initialQuantity = Number(formData?.initialQuantity) || 0;
          const quantityPurchased = Number(formData?.quantityPurchased) || 0;
          const quantityRecovered = Number(formData?.quantityRecovered) || 0;

          if (initialQuantity || quantityPurchased || quantityRecovered) {
            activityAmount = quantityPurchased - quantityRecovered;
          }
        } else {
          activityAmount = Number(formData?.quantityReleased) || 0;
        }
      }
    }

    return Number(activityAmount) || 0;
  }, [selectedScope]);

  // Enhanced function to get emission factor for both scopes
  const getEmissionFactor = useCallback((item, matchingRecord) => {
    let emissionFactor = null;
    const { category, method, subCategory } = item.inputDetails;

    if (selectedScope === "SCOPE1") {
      if (category === "mobile" && method === "fuel_use") {
        const fuelUseCategory = item?.fuelUseCategory;
        if (fuelUseCategory === "Fossil") {
          emissionFactor = matchingRecord.fuelFossilCo2Ef;
        } else if (fuelUseCategory === "Transport") {
          emissionFactor = matchingRecord.fuelCh4Ef + matchingRecord.fuelN2oEf;
        }
      } else if (category === "mobile" && method === "distance") {
        emissionFactor = matchingRecord.distanceCo2Ef;
      } else if (category === "mobile" && method === "freight") {
        emissionFactor = matchingRecord.freightCo2Ef;
      } else if (category === "mobile" && method === "public_transport") {
        emissionFactor = matchingRecord.publicCo2Ef;
      } else {
        emissionFactor = matchingRecord?.factor || matchingRecord?.factorFuel;
      }
    } else if (selectedScope === "SCOPE2") {
      if (category === "defra_evs_scope2") {
        // Fix: Get vehicle type from inputDetails instead of matchingRecord
        const vehicleUseCategory = item.inputDetails?.formData?.vehicleUseCategory;

        if (vehicleUseCategory === "Hybrid Electric Vehicle" || vehicleUseCategory === "Plug-in Hybrid Electric Vehicle") {
          emissionFactor = matchingRecord?.hybridElectricVehicleEf;
        } else if (vehicleUseCategory === "Battery Electric Vehicle") {
          emissionFactor = matchingRecord?.batteryElectricVehicleEf;
        } else {
          emissionFactor =
            matchingRecord?.hybridElectricVehicleEf ||
            matchingRecord?.batteryElectricVehicleEf;
        }
      } else {
        emissionFactor = matchingRecord?.factor;
      }
    }

    return Number(emissionFactor) || 0;
  }, [selectedScope]);

  // Calculate emissions for each category with scope awareness
  const calculateEmissions = useCallback((filterCategory, scope = selectedScope) => {
    return data
      .filter((item) => {
        const itemScope = item.scope || selectedScope;
        const inputDetails = item?.inputDetails;
        const itemCategory = inputDetails?.category;

        // For SCOPE2, filter by scope and optionally by subcategory
        if (scope === 'SCOPE2') {
          if (filterCategory) {
            return itemScope === scope && itemCategory === filterCategory;
          } else {
            // If no subcategory specified, include all SCOPE2 items
            return itemScope === scope;
          }
        }

        // For SCOPE1, filter by scope and category
        return itemScope === scope && itemCategory === filterCategory;
      })
      .reduce((total, item) => {
        // Check if emissions are already calculated in calculationResults
        let calculationResults;

        // Calculate emissions if not pre-calculated
        const activityAmount = getActivityAmount(item);
        const emissionFactor = getEmissionFactor(item, item?.inputDetails?.record);

        if (activityAmount <= 0 || emissionFactor <= 0) {
          return total;
        }

        const emissions = activityAmount * emissionFactor;
        return total + emissions;
      }, 0);
  }, [data, selectedScope, getActivityAmount, getEmissionFactor]);

  // Calculate totals based on selected scope
  const calculateEmissionTotals = useCallback(() => {
    setIsCalculating(true);

    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      let totals = {};

      if (selectedScope === "SCOPE1" || showCombined) {
        const stationaryEmissions = calculateEmissions("stationary", "SCOPE1");
        const mobileEmissions = calculateEmissions("mobile", "SCOPE1");
        const fugitiveEmissions = calculateEmissions("fugitive", "SCOPE1");
        const biogenicEmissions = calculateEmissions("biogenic", "SCOPE1");
        const totalScope1Emissions =
          stationaryEmissions + mobileEmissions + fugitiveEmissions + biogenicEmissions;

        if (selectedScope === "SCOPE1") {
          totals = {
            SCOPE1: {
              stationary: stationaryEmissions,
              mobile: mobileEmissions,
              fugitive: fugitiveEmissions,
              biogenic: biogenicEmissions,
              total: totalScope1Emissions,
            },
          };
        }

        if (showCombined) {
          // Calculate SCOPE2 emissions for combined view
          let scope2Totals = {};
          let totalScope2Emissions = 0;

          const scope2Keys = scope2Categories && typeof scope2Categories === "object"
            && Object.keys(scope2Categories);

          scope2Keys?.forEach((key) => {
            const value = calculateEmissions(key, "SCOPE2");
            scope2Totals[key] = value;
            totalScope2Emissions += value;
          });

          scope2Totals.total = totalScope2Emissions;

          totals = {
            SCOPE1: {
              stationary: stationaryEmissions,
              mobile: mobileEmissions,
              fugitive: fugitiveEmissions,
              biogenic: biogenicEmissions,
              total: totalScope1Emissions,
            },
            SCOPE2: scope2Totals,
            grandTotal: totalScope1Emissions + totalScope2Emissions,
          };

        }
      }

      if (selectedScope === "SCOPE2") {
        // Fix: Calculate electricity and EVs separately

        const scope2Keys =
          scope2Categories && typeof scope2Categories === "object"
             && Object.keys(scope2Categories);

        const scope2Totals = {};
        let totalEmissions = 0;

        scope2Keys?.forEach((key) => {
          const value = calculateEmissions(key, "SCOPE2");
          scope2Totals[key] = value;
          totalEmissions += value;
        });

        scope2Totals.total = totalEmissions;

        totals = {
          SCOPE2: scope2Totals,
        };
      }

      if (selectedScope === "SCOPE3") {
        const scope3ByCategory = calculateScope3EmissionsByCategory();

        totals = {
          SCOPE3: {
            ...scope3ByCategory,
            total: Object.values(scope3ByCategory).reduce((sum, val) => sum + val, 0),
          },
        };
      }


      setEmissionTotals(totals);
      setIsCalculating(false);
    }, 0);
  }, [selectedScope, showCombined, calculateEmissions]);

  const calculateScope3EmissionsByCategory = useCallback(() => {
    const scope3Data = data.filter((item) => {
      const itemScope = item.scope;
      return itemScope === "SCOPE3";
    });

    const categoryTotals = {};

    for (const item of scope3Data) {
      const inputDetails = item.inputDetails;
      const categoryId = inputDetails.scope3CategoryId;
      const categoryName = `${scope3Categories[categoryId]['name']} (Category ${scope3Categories[categoryId]['category_number']})`;

      // Calculate emissions
      let emissions = 0;
      const activityAmount = Number(inputDetails.formData.activityAmount);
      const emissionFactor = Number(inputDetails.record.factor);
      emissions = activityAmount * emissionFactor;

      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }

      categoryTotals[categoryName] += emissions;
    }

    return categoryTotals;
  }, [data, getActivityAmount, getEmissionFactor]);

  // UseEffect to trigger calculations when data or scope changes
  useEffect(() => {
    if (data && data.length > 0) {
      calculateEmissionTotals();
    } else {
      setEmissionTotals({});
      setIsCalculating(false);
    }
  }, [data, selectedScope, showCombined, calculateEmissionTotals]);

  // Reset calculations when data becomes empty
  useEffect(() => {
    if (!data || data.length === 0) {
      setEmissionTotals({});
      setIsCalculating(false);
    }
  }, [data]);

  const EmissionCard = ({
    title,
    emission,
    variant,
    icon,
    gradient,
    accentColor,
    bgPattern,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Col className="mb-4">
        <Card
          className="border-0 h-100 overflow-hidden"
          style={{
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: isHovered
              ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered
              ? "translateY(-8px) scale(1.02)"
              : "translateY(0px) scale(1)",
            cursor: "pointer",
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
              pointerEvents: "none",
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
              transition: "transform 0.4s ease",
            }}
          />

          <Card.Body className="p-4 d-flex flex-column justify-content-between h-100">
            {/* Loading Indicator */}
            {isCalculating && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Calculating...</span>
                </div>
              </div>
            )}

            {/* Icon Section */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "56px",
                  height: "56px",
                  background: gradient,
                  boxShadow: `0 8px 20px ${accentColor}25`,
                  transform: isHovered
                    ? "scale(1.1) rotate(5deg)"
                    : "scale(1) rotate(0deg)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              </div>

              {/* Scope Indicator */}
              <div
                className="d-flex align-items-center px-2 py-1 rounded-pill"
                style={{
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}25`,
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: accentColor,
                    fontWeight: "600",
                  }}
                >
                  {selectedScope?.toUpperCase() || "SCOPE1"}
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
                  margin: "0",
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
                    letterSpacing: "0.5px",
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
                  lineHeight: "1.3",
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
                  overflow: "hidden",
                }}
              >
                <div
                  className="h-100 rounded-pill"
                  style={{
                    background: gradient,
                    width: isHovered ? "85%" : "70%",
                    transition: "width 0.6s ease-in-out",
                  }}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  // Generate card configurations based on selected scope

  const labelMapping = {
    defra_scope2: "Electricity Emissions",
    defra_evs_scope2: "Electric Vehicles",
    ipcc_scope2: "Electricity Emissions",
  };

  const formatLabel = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const iconMap = {
    defra_scope2: "🔌",
    defra_evs_scope2: "🔋",
    ipcc_scope2: "⚡",
  };

  const colorMap = {
    defra_scope2: {
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      accentColor: "#06b6d4",
      bgPattern: "cyan",
    },
    defra_evs_scope2: {
      gradient: "linear-gradient(135deg, #84cc16, #65a30d)",
      accentColor: "#84cc16",
      bgPattern: "lime",
    },
    ipcc_scope2: {
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      accentColor: "#f59e0b",
      bgPattern: "orange",
    },
  };

  const cards =
    selectedScope === "SCOPE2"
      ? (() => {
        const emissions = emissionTotals?.SCOPE2 || {};

        if (scope2Categories && typeof scope2Categories === "object") {
          return Object.keys(scope2Categories).map((key) => ({
            title: labelMapping[key] || formatLabel(key),
            emission: emissions?.[key] ?? 0,
            variant: key,
            icon: iconMap[key] || "⚡",
            gradient: colorMap[key]?.gradient || "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            accentColor: colorMap[key]?.accentColor || "#94a3b8",
            bgPattern: colorMap[key]?.bgPattern || "slate",
          }));
        }

        return [];
      })()
      : [];

  const getCardConfigs = () => {
    if (selectedScope === "SCOPE1") {
      return [
        {
          title: "TOTAL SCOPE 1 EMISSION",
          emission: emissionTotals.SCOPE1?.total || 0,
          variant: "total",
          icon: "🌍",
          gradient: "linear-gradient(135deg, #7494a7, #3c8dbb)",
          accentColor: "#7494a7",
          bgPattern: "primary",
        },
        {
          title: "TOTAL STATIONARY EMISSION",
          emission: emissionTotals.SCOPE1?.stationary || 0,
          variant: "stationary",
          icon: "🏭",
          gradient: "linear-gradient(135deg, #3b82f6, #1e40af)",
          accentColor: "#3b82f6",
          bgPattern: "blue",
        },
        {
          title: "TOTAL MOBILE EMISSION",
          emission: emissionTotals.SCOPE1?.mobile || 0,
          variant: "mobile",
          icon: "🚗",
          gradient: "linear-gradient(135deg, #10b981, #059669)",
          accentColor: "#10b981",
          bgPattern: "green",
        },
        {
          title: "TOTAL FUGITIVE EMISSION",
          emission: emissionTotals.SCOPE1?.fugitive || 0,
          variant: "fugitive",
          icon: "💨",
          gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          accentColor: "#8b5cf6",
          bgPattern: "purple",
        },
        {
          title: "TOTAL BIO-GENIC EMISSION",
          emission: emissionTotals.SCOPE1?.biogenic || 0,
          variant: "biogenic",
          icon: "🌱",
          gradient: "linear-gradient(135deg, #22c55e, #15803d)",
          accentColor: "#22c55e",
          bgPattern: "green",
        },
      ];
    } else if (selectedScope === "SCOPE2") {
      return [
        {
          title: "Total Scope 2 Emission",
          emission: emissionTotals?.SCOPE2?.total ?? 0,
          variant: "total",
          icon: "⚡",
          gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          accentColor: "#f59e0b",
          bgPattern: "orange",
        },
        ...cards
      ]
        ;
    } else if (showCombined) {
      return [
        {
          title: "TOTAL EMISSIONS",
          emission: emissionTotals.grandTotal || 0,
          variant: "grandTotal",
          icon: "🌎",
          gradient: "linear-gradient(135deg, #dc2626, #991b1b)",
          accentColor: "#dc2626",
          bgPattern: "red",
        },
        {
          title: "SCOPE 1 TOTAL",
          emission: emissionTotals.SCOPE1?.total || 0,
          variant: "scope1Total",
          icon: "🔥",
          gradient: "linear-gradient(135deg, #7494a7, #3c8dbb)",
          accentColor: "#7494a7",
          bgPattern: "primary",
        },
        {
          title: "SCOPE 2 TOTAL",
          emission: emissionTotals.SCOPE2?.total || 0,
          variant: "scope2Total",
          icon: "⚡",
          gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          accentColor: "#f59e0b",
          bgPattern: "orange",
        },
        {
          title: "REDUCTION TARGET",
          emission: 0,
          variant: "target",
          icon: "🎯",
          gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
          accentColor: "#22c55e",
          bgPattern: "green",
        },
      ];
    } else if (selectedScope === "SCOPE3") {
      const scope3 = emissionTotals.SCOPE3 || {};
      const { total, ...categories } = scope3;

      return [
        {
          title: "TOTAL SCOPE 3 EMISSION",
          emission: total || 0,
          variant: "total",
          icon: "🌐",
          gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
          accentColor: "#6366f1",
          bgPattern: "indigo",
        },
        ...Object.entries(categories).map(([categoryName, emission]) => ({
          title: categoryName.toUpperCase(),
          emission,
          variant: categoryName,
          icon: "📦",
          gradient: "linear-gradient(135deg, #f43f5e, #be123c)",
          accentColor: "#f43f5e",
          bgPattern: "rose",
        }))
      ];
    }

    return [];
  };

  const cardConfigs = getCardConfigs();

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
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .card:hover .card-body::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 1.5s ease-in-out;
          pointer-events: none;
        }

        .progress-bar-animated {
          background-size: 1rem 1rem;
          animation: progress-bar-stripes 1s linear infinite;
        }

        @keyframes progress-bar-stripes {
          0% {
            background-position: 1rem 0;
          }
          100% {
            background-position: 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SummaryComponent;