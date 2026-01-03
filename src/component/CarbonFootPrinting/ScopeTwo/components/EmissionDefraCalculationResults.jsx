import React from 'react';

const EmissionCalculationResults = ({ results, consumption, updateEntry, category, firefightingEquipmentCO2Emissions, acRefrigerationHfCEmissions, substationSf6Emissions }) => {
  if (!results) return null;
      
  const formatNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) ? num.toFixed(2) : '0.00';
  };

  const FC = consumption;
  const NCV = results.net_calorific_value;
  const CC = results.carbon_content;
  const OF = results.oxidation_factor;
  const EFb = results.emission_factor_for_methane;
  const EFc = results.emission_factor_for_nitrous_oxide;
  const HFCGWP = results.gwp_of_hfc;
  const respectiveHFCGWP = results.respective_hfc_gwp;
  const SF6GWP = results.sf6_gwp;
  const density = results.density;
  
  const energyGJ = FC * NCV;
  const co2Emissions = FC * NCV * CC * OF * (44/12);
  const ch4Emissions = FC * NCV * EFb * Math.pow(10, -6);
  const n2oEmissions = FC * NCV * EFc * Math.pow(10, -6);
  const firefightingCO2Emissions = HFCGWP * firefightingEquipmentCO2Emissions;
  const ACRefrigerationHfCEmissions = respectiveHFCGWP * acRefrigerationHfCEmissions;
  const SubstationSf6Emissions = SF6GWP * substationSf6Emissions;

  const totalCO2Equivalent = category === "fugitive" ? firefightingCO2Emissions + ACRefrigerationHfCEmissions + SubstationSf6Emissions : co2Emissions + ch4Emissions + n2oEmissions;
  updateEntry("energyGJ", formatNumber(energyGJ));
  updateEntry("co2Emissions", formatNumber(co2Emissions));
  updateEntry("ch4Emissions", formatNumber(ch4Emissions));
  updateEntry("n2oEmissions", formatNumber(n2oEmissions));
  updateEntry("firefightingCO2Emissions", formatNumber(firefightingCO2Emissions));
  updateEntry("ACRefrigerationHfCEmissions", formatNumber(ACRefrigerationHfCEmissions));
  updateEntry("SubstationSf6Emissions", formatNumber(SubstationSf6Emissions));
  updateEntry("totalCO2Equivalent", formatNumber(totalCO2Equivalent));

  return (
     <div className="mt-3 p-4 rounded-lg bg-light border">
       { category === "fugitive" ? ( <div className="row g-3">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">Calculation Parameters</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="calculation-param p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Density:</span>
                      <span className="fw-semibold">
                        {formatNumber(density)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">GWP of HFC:</span>
                      <span className="fw-semibold">
                        {formatNumber(HFCGWP)}
                      </span>
                    </div>
                    <div className="progress mb-3" style={{ height: '1px', backgroundColor: '#e9ecef' }}></div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Respective HFC GWP:</span>
                      <span className="fw-semibold">
                        {formatNumber(respectiveHFCGWP)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">GWP of SF6:</span>
                      <span className="fw-semibold">
                        {formatNumber(SF6GWP)}
                      </span>
                    </div>               
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">Results</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Firefighting Equipment CO2 Emissions:</span>
                    <span className="fw-semibold">{formatNumber(firefightingCO2Emissions)} tCO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">AC/Refrigeration HFC Emissions:</span>
                    <span className="fw-semibold">{formatNumber(ACRefrigerationHfCEmissions)} tCO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Substation SF6 Emissions:</span>
                    <span className="fw-semibold">{formatNumber(SubstationSf6Emissions)} tCO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Total CO₂ Equivalent:</span>
                    <span className="fw-bold text-primary">{formatNumber(totalCO2Equivalent)} tCO₂e</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>) : (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">Calculation Parameters</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="calculation-param p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Density:</span>
                      <span className="fw-semibold">
                        {formatNumber(density)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Net Calorific Value:</span>
                      <span className="fw-semibold">
                        {formatNumber(NCV)}
                      </span>
                    </div>
                    <div className="progress mb-3" style={{ height: '1px', backgroundColor: '#e9ecef' }}></div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Carbon Content:</span>
                      <span className="fw-semibold">
                        {formatNumber(CC)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Oxidation Factor:</span>
                      <span className="fw-semibold">
                        {formatNumber(OF)}
                      </span>
                    </div>
                    <div className="progress mb-3" style={{ height: '1px', backgroundColor: '#e9ecef' }}></div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">CH₄ Emission Factor:</span>
                      <span className="fw-semibold">
                        {formatNumber(EFb)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">N₂O Emission Factor:</span>
                      <span className="fw-semibold">
                        {formatNumber(EFc)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">Results</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Energy (GJ):</span>
                    <span className="fw-semibold">{formatNumber(energyGJ)} GJ</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">CH₄ Emissions:</span>
                    <span className="fw-semibold">{formatNumber(ch4Emissions)} kg CO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">N₂O Emissions:</span>
                    <span className="fw-semibold">{formatNumber(n2oEmissions)} kg CO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">CO₂ Emissions:</span>
                    <span className="fw-semibold">{formatNumber(co2Emissions)} kg CO₂e</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="text-muted fw-semibold">Total CO₂ Equivalent:</span>
                    <span className="fw-bold text-primary">{formatNumber(totalCO2Equivalent)} kg CO₂e</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
      </div>
  );
};

export default EmissionCalculationResults;