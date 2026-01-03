import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const KPIComparisonComponents = ({ kpiData = null, loading = false }) => {
  // Default empty state
  if (!kpiData) {
    return (
      <Container fluid style={{ padding: '24px' }}>
        <Card style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: '#16a34a', fontSize: '14px' }}>📊</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Key Performance Indicators Comparison
            </h2>
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <div style={{ color: '#9ca3af', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>📊</span>
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
              No KPI Data
            </h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Select locations and years to compare key performance indicators.
            </p>
          </div>
        </Card>
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container fluid style={{ padding: '24px' }}>
        <Card style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: '#16a34a', fontSize: '14px' }}>📊</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Key Performance Indicators Comparison
            </h2>
          </div>
          <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
            <Row>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col md={2} key={item} style={{ marginBottom: '24px' }}>
                  <div style={{ height: '200px', backgroundColor: '#e5e7eb', borderRadius: '8px' }}></div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Container>
    );
  }

  const MetricCard = ({ title, value, change, isPositiveGood = true, showBaseline = false }) => {
    let changeBgColor = '#f3f4f6'; // default gray
    let changeTextColor = '#6b7280';

    if (!showBaseline && change !== undefined && change !== 0) {
      if ((change > 0) === isPositiveGood) {
        changeBgColor = '#dcfce7'; // light green
        changeTextColor = '#166534'; // dark green
      } else {
        changeBgColor = '#fecaca'; // light red
        changeTextColor = '#991b1b'; // dark red
      }
    }

    return (
      <div style={{
        border: '2px solid #9ca3af',
        borderRadius: '12px',
        padding: '20px 16px',
        backgroundColor: '#ffffff',
        border: 'solid',
        borderWidth: '1px 1px 1px 5px',
        borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5',
        height: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '12px',
            lineHeight: '1'
          }}>
            {value}
          </div>
          {(change !== undefined || showBaseline) && (
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: changeBgColor,
              color: changeTextColor
            }}>
              {showBaseline ? 'Baseline' : (change > 0 ? `+${change}` : change)}{!showBaseline && typeof change !== 'string' ? '%' : ''}
            </div>
          )}
        </div>
      </div>
    );
  };

  const { locationComparison, yearComparison } = kpiData;
  
  // Check if both locations are the same
  const isSameLocation = locationComparison?.primary?.name === locationComparison?.compare?.name;

  return (
    <Container fluid style={{ backgroundColor: '#ffffff' }}>

      <div className="my-3" style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
      }}>
        <Row>
          <Col>
            <div className="my-3" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}>
              <span style={{ fontSize: "24px", marginRight: "10px" }}>📈</span>
              <h2 style={{
                color: "#374151",
                fontSize: "24px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "400",
                margin: 0
              }}>
                Key Performance Indicators Comparison
              </h2>
            </div>
          </Col>
        </Row>
        <div>
          <Row style={{ marginBottom: '60px' }}>
            <Col md={6}>
              <Card className="p-3 shadow-sm rounded" style={{
                backgroundColor: '#f8f9fa', border: 'solid',
                borderWidth: '1px 1px 1px 5px',
                borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5',
              }}>
                <h6 className="fw-semibold mb-3">Overall Completion Rate</h6>
                <Row>
                  <Col md={isSameLocation? 12 :6}>
                    <div className="p-3 border rounded" style={{ borderColor: '#3b82f6', borderWidth: '2px' }}>
                      <MetricCard
                        title={`${locationComparison?.primary?.name || 'Primary Location'}${isSameLocation ? '' : ' (Primary)'}`}
                        value={`${locationComparison?.primary?.overallCompletion || 0}%`}
                        change={locationComparison?.primary?.changeFromBaseline}
                      />
                    </div>
                  </Col>
                  {!isSameLocation && (
                    <Col md={6}>
                      <div className="p-3 border rounded" style={{ borderColor: '#8b5cf6', borderWidth: '2px' }}>
                        <MetricCard
                          title={`${locationComparison?.compare?.name || 'Compare Location'} (Compare)`}
                          value={`${locationComparison?.compare?.overallCompletion || 0}%`}
                          change={locationComparison?.compare?.changeFromBaseline}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>

            {/* Section: Submission Timeliness */}
            <Col md={6}>
              <Card className="p-3 shadow-sm rounded" style={{ backgroundColor: '#f8f9fa',  backgroundColor: '#f8f9fa', border: 'solid',
                borderWidth: '1px 1px 1px 5px',
                borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5', }}>
                <h6 className="fw-semibold mb-3">Submission Timeliness</h6>
                <Row>
                  <Col md={isSameLocation? 12 :6}>
                    <div className="p-3 border rounded" style={{ borderColor: '#3b82f6', borderWidth: '2px' }}>
                      <MetricCard
                        title={`${locationComparison?.primary?.name || 'Primary Location'}${isSameLocation ? '' : ' (Primary)'}`}
                        value={`${locationComparison?.primary?.submissionTimeliness || 0}%`}
                        change={0}
                      />
                    </div>
                  </Col>
                  {!isSameLocation && (
                    <Col md={6}>
                      <div className="p-3 border rounded" style={{ borderColor: '#8b5cf6', borderWidth: '2px' }}>
                        <MetricCard
                          title={`${locationComparison?.compare?.name || 'Compare Location'} (Compare)`}
                          value={`${locationComparison?.compare?.submissionTimeliness || 0}%`}
                          change={0}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>

            {/* Section: Review Efficiency */}
            {/* <Col md={4}>
              <Card className="p-3 shadow-sm rounded" style={{ backgroundColor: '#f8f9fa',  backgroundColor: '#f8f9fa', border: 'solid',
                borderWidth: '1px 1px 1px 5px',
                borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5', }}>
                <h6 className="fw-semibold mb-3">Review Efficiency</h6>
                <Row>
                  <Col md={6}>
                    <div className="p-3 border rounded" style={{ borderColor: '#3b82f6', borderWidth: '2px' }}>
                      <MetricCard
                        title="Current Year"
                        value={`${yearComparison?.current?.reviewEfficiency || 0} days`}
                        change="-0.8 days"
                        isPositiveGood={false}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 border rounded" style={{ borderColor: '#8b5cf6', borderWidth: '2px' }}>
                      <MetricCard
                        title="Previous Year"
                        value={`${yearComparison?.previous?.reviewEfficiency || 0} days`}
                        showBaseline={true}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col> */}
          </Row>
        </div>

      </div>

    </Container>
  );
};

export default KPIComparisonComponents;