import React, { useState, useEffect } from 'react';
import { Container, Card, Modal, Button, Form } from 'react-bootstrap';

const FrameworkProgressCards = ({ frameworkProgress = [], loading = false }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Animate percentages on mount
  useEffect(() => {
    if (!loading && frameworkProgress.length > 0) {
      const timer = setTimeout(() => {
        const animated = {};
        frameworkProgress.forEach(framework => {
          animated[framework.frameworkId] = framework.overallCompletion;
          framework.locationProgress.forEach(location => {
            animated[`${framework.frameworkId}-${location.locationId}`] = location.completion;
          });
        });
        setAnimatedPercentages(animated);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [frameworkProgress, loading]);

  const handleViewAll = (framework) => {
    setSelectedFramework(framework);
    setShowModal(true);
    setSearchTerm('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFramework(null);
    setSearchTerm('');
  };

  const filteredLocations = selectedFramework ?
    selectedFramework.locationProgress.filter(location =>
      location.locationName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  // Calculate dynamic height based on number of locations
  const calculateCardHeight = (locationCount) => {
    const baseHeight = 200; // Header + progress bar + padding
    const locationItemHeight = 45; // Height per location item
    const maxDisplayedLocations = Math.min(locationCount, 3);
    const buttonHeight = locationCount > 3 ? 60 : 0; // View all button
    const summaryHeight = 40; // Completion summary

    return baseHeight + (maxDisplayedLocations * locationItemHeight) + buttonHeight + summaryHeight;
  };

  const ProgressBar = ({ percentage, frameworkId }) => {
    const animatedValue = animatedPercentages[frameworkId] || 0;

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '10px',
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        marginBottom: '24px',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(135deg, #3f88a5 0%, #2e6b7a 100%)',
            borderRadius: '12px',
            width: `${animatedValue}%`,
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(63, 136, 165, 0.3)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: animatedValue > 0 ? 'shimmer 2s infinite' : 'none'
          }} />
        </div>
      </div>
    );
  };

  const LocationItem = ({ location, frameworkId, index }) => {
    const animatedValue = animatedPercentages[`${frameworkId}-${location.locationId}`] || 0;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderBottom: '1px solid #f3f4f6',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          margin: '0 -8px',
          paddingLeft: '8px',
          paddingRight: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${animatedValue >= 80 ? '#10b981, #059669' :
                animatedValue >= 60 ? '#f59e0b, #d97706' :
                  '#ef4444, #dc2626'
                })`,
              marginRight: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <span style={{
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}>
            {location.locationName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1f2937',
            background: animatedValue >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
              animatedValue >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                'linear-gradient(135deg, #ef4444, #dc2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {animatedValue}%
          </span>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <Card style={{
      borderRadius: '24px',
      border: 'solid',
      borderWidth: '1px 1px 1px 5px',
      borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5',
      padding: '2px',
      height: '420px',
      width: '100%',
      maxWidth: '500px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '22px',
        padding: '28px',
        height: '100%'
      }}>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes shimmer {
              0% { left: -100%; }
              100% { left: 100%; }
            }
          `}
        </style>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <div style={{
            height: '60px',
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
            borderRadius: '12px',
            width: '65%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
          <div style={{
            height: '48px',
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
            borderRadius: '12px',
            width: '80px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
        </div>
        <div style={{
          height: '10px',
          background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
          borderRadius: '12px',
          marginBottom: '24px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        {[1, 2, 3].map((item) => (
          <div key={item} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{
              height: '20px',
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              borderRadius: '6px',
              width: '55%',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              height: '20px',
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              borderRadius: '6px',
              width: '50px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
          </div>
        ))}
      </div>
    </Card>
  );

  const getCardStyle = (framework) => ({
    borderRadius: '24px',
    border: 'solid',
    borderWidth: '1px 1px 1px 5px',
    borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5',
    padding: '2px',
    height: `${calculateCardHeight(framework.locationProgress.length)}px`,
    width: '100%',
    boxShadow: '0 10px 30px rgba(63, 136, 165, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  });

  const cardInnerStyle = {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '28px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <Container >
        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'flex-start'
          }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Framework Progress Data */}
        {!loading && frameworkProgress.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'flex-start'
          }}>
            {frameworkProgress.map((framework, index) => (
              <Card
                key={framework.frameworkId}
                style={{
                  ...getCardStyle(framework),
                  animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(63, 136, 165, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(63, 136, 165, 0.2)';
                }}
              >
                <div style={cardInnerStyle}>
                  {/* Framework Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      lineHeight: '1.3',
                      margin: 0,
                      maxWidth: '65%'
                    }}>
                      {framework.frameworkName}
                    </h3>
                    <div style={{
                      background: 'linear-gradient(135deg, #3f88a5 0%, #2e6b7a 100%)',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      boxShadow: '0 4px 12px rgba(63, 136, 165, 0.3)',
                      minWidth: '70px',
                      textAlign: 'center'
                    }}>
                      {animatedPercentages[framework.frameworkId] || 0}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ProgressBar
                    percentage={framework.overallCompletion}
                    frameworkId={framework.frameworkId}
                  />

                  {/* Top 3 Locations */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {framework.locationProgress.length > 0 ? (
                      <>
                        {framework.locationProgress.slice(0, 3).map((location, locationIndex) => (
                          <LocationItem
                            key={location.locationId}
                            location={location}
                            frameworkId={framework.frameworkId}
                            index={locationIndex}
                          />
                        ))}

                        {/* View All Button */}
                        {framework.locationProgress.length > 3 && (
                          <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewAll(framework)}
                              style={{
                                borderRadius: '20px',
                                padding: '8px 20px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: '2px solid #3f88a5',
                                color: '#3f88a5',
                                background: 'transparent',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #3f88a5 0%, #2e6b7a 100%)';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#3f88a5';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              View All {framework.locationProgress.length} Locations
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#9ca3af',
                        fontSize: '14px'
                      }}>
                        <div style={{ marginBottom: '8px' }}>📍</div>
                        No location data available
                      </div>
                    )}
                  </div>

                  {/* Completion Summary */}
                  {framework.locationProgress.length > 0 && (
                    <div style={{
                      marginTop: '20px',
                      padding: '12px',
                     background: 'linear-gradient(135deg, #3f88a5 0%, #f1f5f9 100%)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#64748b',
                      textAlign: 'center'
                    }}>
                      {framework.completedQuestions} of {framework.totalQuestions} questions completed
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && frameworkProgress.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Card style={{
              borderRadius: '24px',
              border: 'solid',
              borderWidth: '1px 1px 1px 5px',
              borderColor: '#dee2e6 #dee2e6 #dee2e6 #3f88a5',
              textAlign: 'center',
              padding: '60px 40px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
              maxWidth: '600px',
              width: '100%'
            }}>
              <Card.Body style={{ padding: 0 }}>
                <div style={{
                  color: '#9ca3af',
                  marginBottom: '24px',
                  fontSize: '48px'
                }}>
                  📊
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  No Framework Data Available
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Select frameworks and locations to view detailed progress information and analytics.
                </p>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>

      {/* Location Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: 'linear-gradient(135deg, #3f88a5 0%, #2e6b7a 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ fontSize: '18px', fontWeight: '600' }}>
            {selectedFramework?.frameworkName} - All Locations
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '24px' }}>
          {/* Search Bar */}
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                padding: '12px 16px',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3f88a5';
                e.target.style.boxShadow = '0 0 0 3px rgba(63, 136, 165, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Form.Group>

          {/* Locations List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <div
                  key={location.locationId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    marginBottom: '8px',
                    background: index % 2 === 0 ? '#f8fafc' : 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #e6f4f7 0%, #d1edf2 100%)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = index % 2 === 0 ? '#f8fafc' : 'white';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${location.completion >= 80 ? '#10b981, #059669' :
                          location.completion >= 60 ? '#f59e0b, #d97706' :
                            '#ef4444, #dc2626'
                          })`,
                        marginRight: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      lineHeight: '1.4'
                    }}>
                      {location.locationName}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: location.completion >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' :
                      location.completion >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                        'linear-gradient(135deg, #ef4444, #dc2626)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    backgroundColor: location.completion >= 80 ? '#ecfdf5' :
                      location.completion >= 60 ? '#fffbeb' : '#fef2f2'
                  }}>
                    {location.completion}%
                  </span>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                <div style={{ marginBottom: '8px' }}>🔍</div>
                {searchTerm ? 'No locations found matching your search' : 'No locations available'}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer style={{ border: 'none', padding: '16px 24px' }}>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{
              borderRadius: '12px',
              padding: '8px 20px',
              fontWeight: '600'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FrameworkProgressCards;