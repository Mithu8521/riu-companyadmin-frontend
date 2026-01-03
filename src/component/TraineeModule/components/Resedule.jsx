import React from 'react'
import RescheduleTrainings from './RescheduleTrainings'
import RegisteredEmployees from './RegisteredEmployees'

function Resedule() {
  return (
    <div className='row mt-5'>
      <div className='col-7'>
        <RescheduleTrainings />
      </div>
      <div className='col-5'>
        <RegisteredEmployees />
      </div>

    </div>
  )
}

export default Resedule
