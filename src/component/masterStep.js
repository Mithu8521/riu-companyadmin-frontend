// import React, { Component,useState } from 'react';
// Remove This page after verify
import React, { Component } from "react";
import Signup from "./signup/signup";
import Signup2 from "./sign_egs/sign_egs";
import StepZilla from "react-stepzilla";
import "./master.css";

// const steps =
//     [
//         { name: 'Signup', component: <Signup /> },
//         { name: 'Signup2', component: <Signup2 /> },
//     ]
// const MultiSteps = () => {
//     return (
//         <div className='step-progress'>
//             <StepZilla steps={steps} />
//         </div>
//     );
// }
// export default MultiSteps;

export default class MasterStep extends Component {
  render() {
    const steps = [
      { name: "Signup", component: <Signup /> },
      { name: "Signup2", component: <Signup2 /> },
    ];
    return (
      <div className="step-progress">
        <StepZilla steps={steps} />
      </div>
    );
  }
}
