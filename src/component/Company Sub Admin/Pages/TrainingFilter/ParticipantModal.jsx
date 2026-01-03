import React from "react";

const ParticipantModal = ({ isOpen, onClose, participants, title }) => {
    if (!isOpen) return null;
  
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <>
        <style>
          {`
            .participant-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            .participant-modal-content {
              background: linear-gradient(135deg, #ffffff, #f8fafc);
              border-radius: 20px;
              padding: 0;
              max-width: 800px;
              width: 95%;
              max-height: 85vh;
              overflow: hidden;
              box-shadow: 
                0 25px 80px rgba(0,0,0,0.25),
                0 0 0 1px rgba(255,255,255,0.05);
              animation: slideUp 0.3s ease-out;
              border: 1px solid rgba(255,255,255,0.2);
            }
            
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(30px) scale(0.95);
              }
              to { 
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            .participant-modal-header {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              color: white;
              padding: 24px 32px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .participant-modal-close {
              background: rgba(255,255,255,0.2);
              border: none;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              color: white;
              font-size: 20px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            }
            
            .participant-modal-close:hover {
              background: rgba(255,255,255,0.3);
              transform: scale(1.1);
            }
            
            .participant-table-container {
              max-height: 500px;
              overflow-y: auto;
              margin: 0;
            }
            
            .participant-table {
              width: 100%;
              border-collapse: collapse;
              background: white;
            }
            
            .participant-table th {
              background: linear-gradient(135deg, #f8fafc, #e2e8f0);
              color: #374151;
              font-weight: 700;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 18px 24px;
              text-align: left;
              border-bottom: 2px solid #e5e7eb;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            
            .participant-table td {
              padding: 20px 24px;
              border-bottom: 1px solid #f1f5f9;
              transition: all 0.2s ease;
            }
            
            .participant-table tr:hover td {
              background: linear-gradient(135deg, #f0f4ff, #faf5ff);
              transform: scale(1.001);
            }
            
            .participant-name {
              font-weight: 600;
              color: #1f2937;
              font-size: 15px;
              margin-bottom: 4px;
            }
            
            .participant-id {
              font-size: 12px;
              color: #6b7280;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 12px;
              display: inline-block;
            }
            
            .participant-email {
              color: #4f46e5;
              font-size: 14px;
              text-decoration: none;
              transition: color 0.2s ease;
            }
            
            .participant-email:hover {
              color: #6366f1;
              text-decoration: underline;
            }
            
            .participant-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 700;
              font-size: 16px;
              margin-right: 12px;
              border: 2px solid rgba(99, 102, 241, 0.1);
            }
            
            .participant-info {
              display: flex;
              align-items: center;
            }
            
            .empty-state {
              text-align: center;
              padding: 60px 20px;
              color: #6b7280;
            }
            
            .empty-state-icon {
              font-size: 48px;
              margin-bottom: 16px;
              opacity: 0.5;
            }
            
            .stats-badge {
              background: rgba(255,255,255,0.2);
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin-left: 12px;
            }
          `}
        </style>
        
        <div className="participant-modal-overlay" onClick={handleBackdropClick}>
          <div className="participant-modal-content">
            <div className="participant-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                  {title}
                  <span className="stats-badge">
                    {participants?.length || 0} Members
                  </span>
                </h3>
              </div>
              <button
                className="participant-modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className="participant-table-container">
              {participants && participants.length > 0 ? (
                <table className="participant-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Participant</th>
                      <th style={{ width: '35%' }}>Email</th>
                      <th style={{ width: '20%' }}>Employee ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => {
                      const initials = `${participant.first_name?.[0] || ''}${participant.last_name?.[0] || ''}`.toUpperCase();
                      const fullName = `${participant.first_name || ''} ${participant.last_name || ''}`.trim();
                      
                      return (
                        <tr key={participant.id || index}>
                          <td>
                            <div className="participant-info">
                              <div className="participant-avatar">
                                {initials || '?'}
                              </div>
                              <div>
                                <div className="participant-name">
                                  {fullName || 'Unknown User'}
                                </div>
                                {participant.department && (
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#8b5cf6',
                                    fontWeight: '500'
                                  }}>
                                    {participant.department}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {participant.email ? (
                              <a 
                                href={`mailto:${participant.email}`}
                                className="participant-email"
                              >
                                {participant.email}
                              </a>
                            ) : (
                              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                No email provided
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="participant-id">
                              {participant.employeeId || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>
                    No Participants Found
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    There are currently no participants in this list.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

export default ParticipantModal;