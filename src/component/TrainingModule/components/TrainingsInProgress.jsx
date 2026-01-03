import React from 'react'
import "./TrainingInProgress.css";

function TrainingsInProgress() {
  return (
    <div className='row mt-5'>
      <div className='col-6 pe-4 '>
        <div className='InProgress'>
          <h5 className='mb-4' >Trainings In Progress</h5>
          <div className='rowStyle'> Online mandatory trainings (global) – Arun Pinto </div>
          <div className='rowStyle'>Induction for new joiners –   Rajesh Naik</div>
          <div className='rowStyle'>Induction for new joiners –   Rajesh Naik</div>
        </div>

      </div>
      <div className='col-6 ps-4'>
        <div className='InProgress'>
          <h5 className='mb-4' >Trainings Not Completed</h5>
          <div className='rowStyle'> Online mandatory trainings (global) –     Arun Pinto </div>
          <div className='rowStyle'>Induction for new joiners –   Rajesh Naik</div>
          <div className='rowStyle'>Induction for new joiners –   Rajesh Naik</div>
        </div>
      </div>
    </div>
  )
}

export default TrainingsInProgress
