import React from 'react';

const StatusIndicator = ({ status }) => {
  let backgroundColor;
  let color;

  switch (status) {
    case 'Answered':
      backgroundColor = 'yellow';
      color = 'black';
      break;
    case 'Accepted':
      backgroundColor = '#43AC70';
      color = 'white';
      break;
    case 'Rejected':
      backgroundColor = '#F2684A';
      color = 'white';
      break;
    default:
      backgroundColor = 'transparent';
      color = 'black';
  }

  return (
    <div
      style={{
        backgroundColor,
        color,
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: "5px",
        paddingRight: "5px",
        whiteSpace: 'nowrap',
        textAlign: "center",
        overflow: 'auto',
        borderRadius: "5px",
        marginRight: "5px",
        marginLeft: "5px",
        // height:"1.9735rem",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: "500",

      }}
    >
      {status}
    </div>
  );
};

export default StatusIndicator;
