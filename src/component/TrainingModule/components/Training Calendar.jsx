import React from 'react';
import './TrainingCalendar.css';

function TrainingCalendar() {
  return (
    <div style={{ backgroundColor: 'white', padding: '12px  10px', borderRadius: '10px', width: '100%' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}> Training Calendar</div>
      <div style={{ color: '#ccc', display: 'flex', justifyContent: 'space-between', marginTop: '6px', marginBottom: '7px', fontWeight: 'bold' }}>
        <div> {"<"} June 2024 {">"} </div>
        <div> {"<"} Upcoming {">"}  </div>
      </div>
      <div className="containe">

        <div className="calendar-date">
          <span>24</span>
        </div>
        <div className="training-info">
          <p><strong>Online mandatory trainings (global)</strong> – Arun Pinto</p>
          <a href="https://www.zoom.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>Meeting link</a>
        </div>
      </div>
      <div className="containe mt-4">

        <div className="calendar-date">
          <span>24</span>
        </div>
        <div className="training-info">
          <p><strong>Online mandatory trainings (global)</strong> – Arun Pinto</p>
          <a href="https://www.zoom.com" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>Meeting link</a>
        </div>
      </div>
    </div>
  );
}

export default TrainingCalendar;
