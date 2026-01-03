import React from 'react';
import './TotalWaterWithdraw.css'; // Import your CSS file here\
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const WaterWithdraw = ({ consumption, notGenerated, maxConsumption }) => {
  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const filledWidth = (1 / 1) * totalWidth;
  const notGeneratedWidth = (0 / 1) * totalWidth;
  const remainingWidth = totalWidth - (filledWidth + notGeneratedWidth);

  const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">
      {message}
    </Tooltip>
  );
  return (
    <div className="water-withdrawn-container">
      <div className="water-withdrawn-header">
        Total Water Withdrawn
      </div>
      <div className="water-withdrawn-bar-labels">
        <span style={{ fontSize: "11px" }}>0</span>
        <span style={{ fontSize: "11px" }}>{Math.round(consumption / 5 / 10) * 10}</span>
        <span style={{ fontSize: "11px" }}>{Math.round((consumption / 5) * 2 / 10) * 10}</span>
        <span style={{ fontSize: "11px" }}>{Math.round((consumption / 5) * 3 / 10) * 10}</span>
        <span style={{ fontSize: "11px" }}>{Math.round((consumption / 5) * 4 / 10) * 10}</span>
        <span style={{ fontSize: "11px" }}>{Math.round(consumption / 10) * 10}</span>

      </div>
      <div className="water-withdrawn-bar-dotted-line"></div>

      <div className="water-withdrawn-bars">
        <div className="water-withdrawn-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none" }}>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip(`Water Withdrawn: ${consumption} KL`)}
          >
            <div
              className="water-withdrawn-bar-filled"
              style={{ width: `${filledWidth}%`, backgroundColor: '#88D29E', display: "flex", justifyContent: "center", alignItems: 'center', color: "white" }}
            >
              {consumption}
            </div>
          </OverlayTrigger>
        </div>
        <div className="water-withdrawn-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none" }}>
          <OverlayTrigger
            placement="top"
            overlay={renderTooltip(`Not Generated: ${notGenerated} kl`)}
          >
            <div
              className="water-withdrawn-bar-not-generated"
              style={{ width: `${notGeneratedWidth}%`, backgroundColor: '#3F88A5', display: "flex", justifyContent: "center", alignItems: 'center', color: "white" }}
            >
              {notGenerated}
            </div>
          </OverlayTrigger>
        </div>

        <div className="water-withdrawn-legends" style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <span style={{ width: '15px', height: '15px', backgroundColor: '#88D29E', borderRadius: '50%', display: 'inline-block', marginRight: '5px' }}></span>
            <span>Water Withdrawn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '15px', height: '15px', backgroundColor: '#3F88A5', borderRadius: '50%', display: 'inline-block', marginRight: '5px' }}></span>
            <span>Not Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterWithdraw;
