import React from 'react';

const MetricCard = ({
  title,
  value,
  unit,
  color,
  previousValue,
  previousUnit,
  change,
  periodLabel = "Previous",
  isLoading = false
}) => {
  const getColorClass = (colorName) => {
    const colors = {
      blue: "#3B82F6",
      red: "#EF4444",
      teal: "#14B8A6",
      orange: "#F97316",
      purple: "#7C3AED"
    };
    return colors[colorName] || colors.blue;
  };

  const formatChange = (changeValue) => {
    if (changeValue === undefined || changeValue === null) return null;
    const sign = changeValue >= 0 ? '+' : '';
    return `(${sign}${changeValue.toFixed(2)})`;
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val || '0';
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
          minHeight: "120px",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        minWidth: "200px",
        height: "fit-content"
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: getColorClass(color),
          marginBottom: previousValue !== undefined ? "12px" : "0",
        }}
      >
        {formatValue(value)} {unit}
      </div>

      {previousValue !== undefined && (
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.4" }}>
          <span>
            {periodLabel}: {formatValue(previousValue)} {previousUnit || unit}
          </span>
          {change !== undefined && (
            <span
              style={{
                marginLeft: "8px",
                color: change < 0 ? "#10B981" : "#EF4444",
                fontWeight: "500"
              }}
            >
              {formatChange(change)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;