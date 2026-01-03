import React from 'react'

function Welcome() {
  return (
    <div className='text-center'>
      <div style={{ fontSize: '28px' }} >Welcome Back, {JSON.parse(localStorage.getItem("currentUser"))?.first_name}</div>

      <div style={{ fontSize: '16px' }}>Monitor your training portal</div>
    </div>
  )
}

export default Welcome
