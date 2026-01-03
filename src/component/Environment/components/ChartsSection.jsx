import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EnergyChart from './EnergyChart';
import EmissionsChart from './EmissionsChart';
import WaterChart from './WaterChart';
import WasteChart from './WasteChart';
import FortyEightEnergyChart from './FortyEightEnergyChart';

const ChartsSection = ({
  energyData,
  waterData,
  wasteData,
  emissionData,
  isLoading,
  error,
  companyFramework,
  previousPeriodData,
  comparisonMode = false,
  comparisonData = null
}) => {
  if (error) {
    return (
      <Row className="mb-4">
        <Col>
          <div className="alert alert-danger" role="alert">
            Error loading charts: {error}
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col>
        <EnergyChart
          energyData={energyData}
          isLoading={isLoading}
          companyFramework={companyFramework}
          comparisonMode={comparisonMode}
          comparisonData={previousPeriodData}
          unit={companyFramework?.includes(48) ? 'kWh' : 'GJ'}
        />

        {companyFramework?.includes(48) ? <FortyEightEnergyChart
          energyData={energyData}
          isLoading={isLoading}
          companyFramework={companyFramework}
          comparisonMode={comparisonMode}
          comparisonData={previousPeriodData}
          unit={companyFramework?.includes(48) ? 'kWh' : 'GJ'}
        /> : <></>}

        <EmissionsChart
          emissionData={emissionData}
          isLoading={isLoading}
          companyFramework={companyFramework}
          comparisonMode={comparisonMode}
          comparisonData={previousPeriodData}
        />

        <WaterChart
          waterData={waterData}
          isLoading={isLoading}
          companyFramework={companyFramework}
          comparisonMode={comparisonMode}
          comparisonData={previousPeriodData}
        />

        <WasteChart
          wasteData={wasteData}
          isLoading={isLoading}
          companyFramework={companyFramework}
          comparisonMode={comparisonMode}
          comparisonData={previousPeriodData}
        />
      </Col>
    </Row>
  );
};

export default ChartsSection;