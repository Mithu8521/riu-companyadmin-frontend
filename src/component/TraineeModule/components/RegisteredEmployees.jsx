import React from 'react'
import "./RegisteredEmployees.css";

function RegisteredEmployees() {
    return (
        <div className='RegisteredEmployees'>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Registered Employees For selected Training</div>
            <div style={{ marginTop: '1em' }}>
                <select
                    value=""
                    style={{
                        padding: '5px 10px',   /* Adjust padding as needed */
                        fontSize: '16px',      /* Ensure font size matches or is appropriate */
                        border: '1px solid #ccc',
                        borderRadius: '10px',
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


            <div style={{ marginTop: '1em' }}>
                <select style={{
                    padding: '5px 10px',   /* Adjust padding as needed */
                    fontSize: '16px',      /* Ensure font size matches or is appropriate */
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    width: '100%',
                }}>
                    <option value="">Online mandatory trainings (global)</option>
                </select>
            </div>
            <div style={{ marginTop: '1em' }}>
                <table>
                    <thead style={{ color: '#3F88A5', borderBottom: '2px solid #83BBD5' }}>
                        <tr >
                            <th style={{ fontSize: '18px', width: '20%' }} >#</th>
                            <th style={{ fontSize: '18px', width: '50%' }}>Name</th>
                            <th style={{ fontSize: '18px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className='trow' style={{ fontSize: '16px', borderBottom: '1px solid #83BBD5' }}>
                            <td >01</td>
                            <td>Charan</td>
                            <td class="status-registered">Registered</td>
                        </tr>
                        <tr className='trow' style={{ fontSize: '16px', borderBottom: '1px solid #83BBD5' }}>
                            <td>02</td>
                            <td>Lakshman</td>
                            <td class="status-not-registered">Not Registered</td>
                        </tr>
                        <tr className='trow' style={{ fontSize: '16px', borderBottom: '1px solid #83BBD5' }}>
                            <td>03</td>
                            <td>Rakesh</td>
                            <td class="status-registered">Registered</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default RegisteredEmployees
