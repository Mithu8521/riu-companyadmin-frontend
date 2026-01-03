import React from 'react';
import "./RescheduleTrainings.css";

function RescheduleTrainings() {
  return (
    <>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
            Reschedule The Trainings
          </div>
          <select
            id="dropdown"
            value=""
            style={{
              padding: '5px 10px',   /* Adjust padding as needed */
              fontSize: '16px',      /* Ensure font size matches or is appropriate */
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              lineHeight: '1.5'      /* Ensure consistent line height */
            }}
          >
            <option value="">Employee</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <div style={{ border: '1px solid white ', width: '100%', display: 'flex', justifyContent: 'space-between', backgroundColor: '#E9F6FB', padding: '10px' }}>

          <div className="leftSection">
            <div className="dateCircle">30</div>
            <div className="textSection">
              <div className="mainText">Online mandatory trainings (global) - Arun Pinto</div>
              <div className="meetingLink"><a href="https://www.zoom.com">Meeting link // www.zoom.com</a></div>
            </div>
          </div>
          <div className="rightSection">
            <button className="downloadButton">Reschedule</button>
          </div>
        </div>
        <div style={{ border: '1px solid white ', width: '100%', display: 'flex', justifyContent: 'space-between', backgroundColor: '#E9F6FB', padding: '10px', marginTop: '10px' }}>

          <div className="leftSection">
            <div className="dateCircle">24</div>
            <div className="textSection">
              <div className="mainText">Induction for new joiners –   Rajesh Naik</div>
              <div className="meetingLink"><a href="https://www.zoom.com">Meeting link // www.zoom.com</a></div>
            </div>
          </div>
          <div className="rightSection">
            <button className="downloadButton">Reschedule</button>
          </div>
        </div>
        <div style={{ border: '1px solid white ', width: '100%', display: 'flex', justifyContent: 'space-between', backgroundColor: '#E9F6FB', padding: '10px', marginTop: '10px' }}>

          <div className="leftSection">
            <div className="dateCircle">20</div>
            <div className="textSection">
              <div className="mainText">Online mandatory trainings (global) - Arun Pinto</div>
              <div className="meetingLink"><a href="https://www.zoom.com">Meeting link // www.zoom.com</a></div>
            </div>
          </div>
          <div className="rightSection">
            <button className="downloadButton">Reschedule</button>
          </div>
        </div>

      </div>

    </>
  )
}

export default RescheduleTrainings
