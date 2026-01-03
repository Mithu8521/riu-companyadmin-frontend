import React from "react";
import { Col, Row, Card } from "react-bootstrap";

const SummaryComponent = ({ data = [] }) => {
  // Format numbers with K, M functionality
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Calculate emissions for each category
  const calculateEmissions = (category) => {
    return data
      .filter(item => item.category === category)
      .reduce((total, item) => {
        const consumption = parseFloat(item.consumption || 0);
        let factor = 0;
        
        // Get the appropriate factor based on category
        if (category === 'stationary') {
          factor = parseFloat(item.calculationDetails?.factor || 0);
        } else if (category === 'mobile') {
          factor = parseFloat(item.calculationDetails?.factorFuel || 0);
        } else if (category === 'fugitive') {
          factor = parseFloat(item.calculationDetails?.factor || 0);
        }
        
        return total + (consumption * factor);
      }, 0);
  };

  const stationaryEmissions = calculateEmissions('stationary');
  const mobileEmissions = calculateEmissions('mobile');
  const fugitiveEmissions = calculateEmissions('fugitive');
  const totalScope1Emissions = stationaryEmissions + mobileEmissions + fugitiveEmissions;

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
      {/* Section Header */}
      {/* <div className="d-flex align-items-center mb-4">
        <div 
          className="me-3 p-2 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
            boxShadow: "0 4px 12px rgba(116, 148, 167, 0.3)"
          }}
        >
          <span className="text-white" style={{ fontSize: "1.2rem" }}>📊</span>
        </div>
        <div>
          <h5 
            className="mb-1 fw-bold"
            style={{
              background: "linear-gradient(135deg, #334155, #7494a7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.3rem"
            }}
          >
            Emissions Summary
          </h5>
          <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
            Real-time carbon footprint overview
          </p>
        </div>
      </div> */}

      {/* Cards Row */}
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

      {/* Additional Insights Row */}
      {/* <Row className="mt-4">
        <Col md={12}>
          <div 
            className="rounded-3 p-3 d-flex align-items-center justify-content-between"
            style={{
              background: "linear-gradient(135deg, rgba(116, 148, 167, 0.05), rgba(60, 141, 187, 0.05))",
              border: "1px solid rgba(116, 148, 167, 0.1)"
            }}
          >
            <div className="d-flex align-items-center">
              <span className="me-2" style={{ fontSize: "1.2rem" }}>💡</span>
              <div>
                <small className="fw-semibold text-muted">INSIGHT</small>
                <p className="mb-0" style={{ fontSize: "0.9rem", color: "#475569" }}>
                  {data.length > 0 
                    ? `Tracking ${data.length} emission sources across ${new Set(data.map(item => item.category)).size} categories`
                    : "No emission data available for analysis"
                  }
                </p>
              </div>
            </div>
            
            {totalScope1Emissions > 0 && (
              <div className="text-end">
                <small className="text-muted d-block">AVERAGE PER SOURCE</small>
                <strong style={{ color: "#7494a7", fontSize: "0.9rem" }}>
                  {data.length > 0 ? formatNumber(totalScope1Emissions / data.length) : 0} kgCO₂e
                </strong>
              </div>
            )}
          </div>
        </Col>
      </Row> */}

      {/* Custom Styles */}
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

export default SummaryComponent;