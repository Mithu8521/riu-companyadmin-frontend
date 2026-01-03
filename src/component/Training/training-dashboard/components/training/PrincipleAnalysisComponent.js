import React from 'react';
import { usePrincipleCoverageAnalysis } from '../../hooks/useComplianceData';

// Principle Coverage Analysis Component
export const PrincipleCoverageAnalysis = ({ complianceData }) => {
  const { high, medium, low } = usePrincipleCoverageAnalysis(complianceData);

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb"
    }}>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "24px"
      }}>
        {/* High Coverage */}
        <div style={{
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
          padding: "16px",
          border: "1px solid #bbf7d0"
        }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#15803d",
            marginBottom: "12px",
            margin: "0 0 12px 0"
          }}>
            High Coverage Principles
          </h3>
          {high.length > 0 ? (
            high.map((principle, index) => (
              <div key={principle.key} style={{
                fontSize: "14px",
                color: "#166534",
                marginBottom: "4px",
                lineHeight: "1.4"
              }}>
                {principle.key} ({principle.title.split('(')[0].trim()}): {principle.covered} employees covered
              </div>
            ))
          ) : (
            <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
              No high coverage principles
            </div>
          )}
        </div>

        {/* Medium Coverage */}
        <div style={{
          backgroundColor: "#fffbeb",
          borderRadius: "8px",
          padding: "16px",
          border: "1px solid #fed7aa"
        }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#d97706",
            marginBottom: "12px",
            margin: "0 0 12px 0"
          }}>
            Medium Coverage Principles
          </h3>
          {medium.length > 0 ? (
            medium.map((principle, index) => (
              <div key={principle.key} style={{
                fontSize: "14px",
                color: "#92400e",
                marginBottom: "4px",
                lineHeight: "1.4"
              }}>
                {principle.key} ({principle.title.split('(')[0].trim()}): {principle.covered} employees covered
              </div>
            ))
          ) : (
            <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
              No medium coverage principles
            </div>
          )}
        </div>

        {/* Low Coverage */}
        <div style={{
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
          padding: "16px",
          border: "1px solid #fecaca"
        }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#dc2626",
            marginBottom: "12px",
            margin: "0 0 12px 0"
          }}>
            Low Coverage Principles
          </h3>
          {low.length > 0 ? (
            <>
              {low.map((principle, index) => (
                <div key={principle.key} style={{
                  fontSize: "14px",
                  color: "#991b1b",
                  marginBottom: "4px",
                  lineHeight: "1.4"
                }}>
                  {principle.key}, {principle.covered > 0 ? `${principle.covered} employees covered` : 'Need immediate attention'}
                </div>
              ))}
              {low.filter(p => p.covered === 0).length > 0 && (
                <div style={{
                  fontSize: "14px",
                  color: "#991b1b",
                  marginTop: "8px",
                  fontWeight: "500"
                }}>
                  {low.filter(p => p.covered === 0).length} employees covered in these areas
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
              No low coverage principles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};