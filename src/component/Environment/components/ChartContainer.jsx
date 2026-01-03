import React from 'react';
import { Card } from 'react-bootstrap';

const ChartContainer = ({ title, children, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
            {title}
          </h5>
        </Card.Header>
        <Card.Body style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0" style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>
          {title}
        </h5>
      </Card.Header>
      <Card.Body style={{ height: '350px' }}>
        {children}
      </Card.Body>
    </Card>
  );
};

export default ChartContainer;