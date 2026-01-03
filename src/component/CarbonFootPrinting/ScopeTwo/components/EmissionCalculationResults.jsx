import React from "react";

const EmissionCalculationResults = ({
  results,
  consumption,
  // updateEntry,
  // category,
}) => {
  if (!results) return null;
  const formatNumber = (value) => {
    const num = Number(value);
    return !isNaN(num) ? num.toFixed(2) : "0.00";
  };

  const FC = consumption;
  const factor = results.factor;



  const co2Emissions =
   Number(FC) *Number(factor);
  // updateEntry("co2Emissions", formatNumber(co2Emissions));

  return (
    <div className="mt-3 p-4 rounded-lg bg-light border">
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">CO2e Emissions:</span>
                  <span className="fw-semibold">
                    {formatNumber(co2Emissions)} kgCO₂e
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionCalculationResults;
