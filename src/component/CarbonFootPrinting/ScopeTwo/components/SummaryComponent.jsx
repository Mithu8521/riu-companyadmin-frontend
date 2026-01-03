import React from "react";
import { Col, Row, Card } from "react-bootstrap";

const SummaryComponent = ({ data = [] }) => {
  // Format numbers with K, M functionality
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    }
    return num.toFixed(2);
  };

  // Calculate total scope 2 emissions from all activities
  const calculateTotalScope2Emissions = () => {
    return data.reduce((total, item) => {
      const consumption = parseFloat(item.consumption) || 0;
      const factor = parseFloat(item.calculationDetails?.factor) || 0;
      const emission = consumption * factor;
      return total + emission;
    }, 0);
  };

  const totalScope2Emissions = calculateTotalScope2Emissions();

  const EmissionCard = ({ title, emission, icon, gradient, accentColor }) => {
    const [isHovered, setIsHovered] = React.useState(false);
  
    return (
      <Col lg={12} md={12} className="mb-3">
        <Card
          className="border-0 overflow-hidden"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: isHovered
              ? "0 10px 20px rgba(0, 0, 0, 0.1)"
              : "0 4px 12px rgba(0, 0, 0, 0.05)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card.Body className="px-4 py-3 d-flex align-items-center">
            {/* Icon */}
            <div
              className="me-3 d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "48px",
                height: "48px",
                fontSize: "1.5rem",
                background: gradient,
                boxShadow: `0 4px 10px ${accentColor}22`,
              }}
            >
              {icon}
            </div>
  
            {/* Content */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 text-uppercase" style={{ fontSize: "0.75rem", color: "#475569", fontWeight: "600" }}>
                    {title}
                  </h6>
                  <h3
                    className="mb-1"
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      background: gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatNumber(emission)}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      color: "#64748b",
                      backgroundColor: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    kgCO₂e
                  </span>
                </div>
  
                <div
                  style={{
                    fontSize: "3rem",
                    color: `${accentColor}10`,
                    fontWeight: "800",
                    userSelect: "none",
                  }}
                >
                  2
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };
  

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
            boxShadow: "0 4px 12px rgba(116, 148, 167, 0.3)",
          }}
        >
          <span className="text-white" style={{ fontSize: "1.2rem" }}>
            🌍
          </span>
        </div>
        <div>
          <h5
            className="mb-1 fw-bold"
            style={{
              background: "linear-gradient(135deg, #334155, #7494a7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.3rem",
            }}
          >
            Scope 2 Emissions Summary
          </h5>
          <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
            Indirect emissions from purchased energy
          </p>
        </div>
      </div> */}

      {/* Main Emission Card */}
      <Row className="justify-content-center">
        <EmissionCard
          title="TOTAL SCOPE 2 EMISSIONS"
          emission={totalScope2Emissions}
          icon="⚡"
          gradient="linear-gradient(135deg, #7494a7, #3c8dbb)"
          accentColor="#7494a7"
        />
      </Row>

      {/* Custom Styles */}
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
          animation: shimmer 2s ease-in-out;
          pointer-events: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .progress-bar-animated {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SummaryComponent;
