import React from 'react';

const LegendComponent = ({ color, label, value }) => {
  return (
    <div style={containerStyle}>
      <div style={{ ...colorBoxStyle, backgroundColor: color }}></div>
      <div style={labelContainerStyle}>
        <div style={labelStyle}>{label}</div>
        <div style={valueStyle}>{value}</div>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: 'white',
  borderRadius: '10px',
};

const colorBoxStyle = {
  width: '20px',
  height: '55px',
  borderRadius: '20px',
  marginRight: '10px',
};

const labelContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
};

const valueStyle = {
  fontSize: '12px',
  color: 'grey',
};

export default LegendComponent;
