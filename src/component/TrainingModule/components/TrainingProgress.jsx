import React from 'react';
import './TrainingProgress.css';

function TrainingProgress() {
  return (
    <>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Completed Trainings</div>
          <div > {"<"} June 2024 {">"} </div>
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
            <button className="downloadButton">DOWNLOAD</button>
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
            <button className="downloadButton">DOWNLOAD</button>
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
            <button className="downloadButton">DOWNLOAD</button>
          </div>
        </div>

      </div>

    </>
  );
}

export default TrainingProgress;
