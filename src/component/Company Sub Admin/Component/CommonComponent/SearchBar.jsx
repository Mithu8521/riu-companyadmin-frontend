import React from 'react';

const SearchBar = ({ value, onChange, placeholder, icon }) => (
    <div style={{ maxWidth: "400px" }}>
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px 12px 44px",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          fontSize: "14px",
          background: "#fff",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );

  export default SearchBar;