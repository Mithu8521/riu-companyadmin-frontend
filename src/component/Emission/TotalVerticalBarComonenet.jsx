import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

// Import Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

const VerticalTotalBarComponent = ({ consumption, notGenerated }) => {
  // Calculate the total energy and round it to the nearest whole number
  let totalEnergy = consumption + notGenerated;
  totalEnergy = Math.round(totalEnergy); // Round to the nearest whole number

  // Define the maximum value for scaling (use totalEnergy as the reference)
  const maxValue = totalEnergy;

  // Calculate the height percentages for consumption and notGenerated
  const consumptionHeight = (consumption / maxValue) * 100;
  const notGeneratedHeight = (notGenerated / maxValue) * 100;

  // Define tooltips for each bar
  const renderScope1Tooltip = (props) => (
    <Tooltip id="scope1-tooltip" {...props}>
      <div>
        <strong>Scope 1 (Consumption):</strong> {consumption.toFixed(2)} tCO2
      </div>
    </Tooltip>
  );

  const renderScope2Tooltip = (props) => (
    <Tooltip id="scope2-tooltip" {...props}>
      <div>
        <strong>Scope 2 (Not Generated):</strong> {notGenerated.toFixed(2)} tCO2
      </div>
    </Tooltip>
  );

  const renderTotalTooltip = (props) => (
    <Tooltip id="total-tooltip" {...props}>
      <div>
        <strong>Total Emission:</strong> {totalEnergy.toFixed(2)} tCO2
      </div>
      <div>
        <strong>Scope 1:</strong> {consumption.toFixed(2)} tCO2 ({(consumption / totalEnergy * 100).toFixed(1)}%)
      </div>
      <div>
        <strong>Scope 2:</strong> {notGenerated.toFixed(2)} tCO2 ({(notGenerated / totalEnergy * 100).toFixed(1)}%)
      </div>
    </Tooltip>
  );

  return (
    <div className="vertical-energy-container" style={{ 
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <div className="vertical-energy-header" style={{
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        Total Emission Generated
      </div>

      {/* Chart Container */}
      <div style={{ 
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        position: "relative",
        height: "350px",
        marginBottom: "60px"
      }}>
        {/* Y-axis and its labels */}
        <div style={{ 
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #ddd"
        }}>
          {[0, 1, 2, 3, 4, 5].reverse().map((multiplier, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingRight: "10px",
              height: "20px"
            }}>
              <span style={{ fontSize: "12px" }}>
                {Math.round((multiplier / 5) * maxValue)}
              </span>
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div style={{ 
          position: "absolute",
          left: "50px",
          top: 0,
          right: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 1
        }}>
          {[0, 1, 2, 3, 4, 5].map((multiplier, index) => (
            <div key={index} style={{
              width: "100%",
              borderTop: multiplier === 0 ? "none" : "1px dashed #ddd",
              height: "1px"
            }}></div>
          ))}
        </div>

        {/* Bars */}
        <div style={{ 
          display: "flex",
          marginLeft: "50px", 
          height: "100%",
          alignItems: "flex-end",
          flex: 1,
          position: "relative",
          zIndex: 2,
          justifyContent: "space-around"
        }}>
          {/* Scope 1 Bar */}
          <OverlayTrigger placement="top" overlay={renderScope1Tooltip}>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "20%",
              height: "100%",
              position: "relative"
            }}>
              <div style={{ 
                position: "absolute",
                bottom: 0,
                height: `${consumptionHeight}%`,
                width: "70px",
                backgroundColor: "#3F822B",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                color: "white",
                fontSize: "12px",
                paddingTop: "5px"
              }}>
                {consumption > maxValue * 0.1 && (
                  <span>{consumption.toFixed(1)}</span>
                )}
              </div>
              <div style={{ 
                position: "absolute",
                bottom: "-30px",
                textAlign: "center",
                width: "100%"
              }}>
                <span style={{ fontSize: "14px" }}>Scope 1</span>
              </div>
            </div>
          </OverlayTrigger>

          {/* Scope 2 Bar */}
          <OverlayTrigger placement="top" overlay={renderScope2Tooltip}>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "20%",
              height: "100%",
              position: "relative"
            }}>
              <div style={{ 
                position: "absolute",
                bottom: 0,
                height: `${notGeneratedHeight}%`,
                width: "70px",
                backgroundColor: "#808080",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                color: "white",
                fontSize: "12px",
                paddingTop: "5px"
              }}>
                {notGenerated > maxValue * 0.1 && (
                  <span>{notGenerated.toFixed(1)}</span>
                )}
              </div>
              <div style={{ 
                position: "absolute",
                bottom: "-30px",
                textAlign: "center",
                width: "100%"
              }}>
                <span style={{ fontSize: "14px" }}>Scope 2</span>
              </div>
            </div>
          </OverlayTrigger>

          {/* Total Bar */}
          <OverlayTrigger placement="top" overlay={renderTotalTooltip}>
            <div style={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "20%",
              height: "100%",
              position: "relative"
            }}>
              <div style={{ 
                position: "absolute",
                bottom: 0,
                height: "100%",
                width: "70px",
                backgroundColor: "#791E80",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                color: "white",
                fontSize: "12px",
                paddingTop: "10px"
              }}>
                {totalEnergy.toFixed(1)}
              </div>
              <div style={{ 
                position: "absolute",
                bottom: "-30px",
                textAlign: "center",
                width: "100%"
              }}>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>Total</span>
              </div>
            </div>
          </OverlayTrigger>
        </div>
      </div>

      {/* Units label */}
      <div style={{
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "12px"
      }}>
        (in tCO2)
      </div>

      {/* Legend */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginTop: "10px"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginRight: "30px" 
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#3F822B",
            marginRight: "10px",
          }}></div>
          <span>Scope 1</span>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center",
          marginRight: "30px"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#1abc9c",
            marginRight: "10px",
          }}></div>
          <span>Scope 2</span>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center" 
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#791E80",
            marginRight: "10px",
          }}></div>
          <span>Total</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalTotalBarComponent;