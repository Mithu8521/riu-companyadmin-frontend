import { HashRouter, Route, Switch } from "react-router-dom"
import AdminRoute from "./AdminRoute"
import "./App.css"
import OtpVerification from "./OtpVerification"
import NotFoundRoute from "./component/Company Sub Admin/Pages/404"
import NewPassword from "./component/Login/NewPassword"
import SignupFor from "./component/Login/companyLogin"
import Login from "./component/Login/login"
import OTPVerify from "./component/Login/otpverify"
import ResetPass from "./component/Login/resetpass"
import EmailVerification from "./component/Verfications/EmailVerfications"
import Massage from "./component/Verfications/massage"
import SocketComponent from "./component/header/SocketComponent"
import SupplierSignup from "./component/signup/SupplierSignup"
import Signup from "./component/signup/signup"
import ScrollToTop from "./scrollToTop"
import SignUpForExternalTrainee from "./component/signup/SignUpForExternalTrainee"
import ExternaTraineelAttendance from "./component/signup/ExternaTraineelAttendance"
import SignUpInternalTrainee from "./component/signup/SignUpInternalTrainee"
import SignUpTrainee from "./component/signup/SignUpTrainee"

export default function App() {

  return (
    <div className="App">
      <HashRouter>
        <OtpVerification />
        <SocketComponent />
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/sign_in/:id/:token" component={SignupFor}></Route>
          <Route exact path="/verify_message" component={Massage}></Route>
          <Route exact path="/Login" component={Login}></Route>
          <Route exact path="/otpverify" component={OTPVerify}></Route>
          <Route exact path="/ResetPass" component={ResetPass}></Route>
          <Route exact path="/verify/:token" component={NewPassword}></Route>
          <Route exact path="/email/verify/:token" component={EmailVerification} ></Route>
          <Route exact path="/signup/:signup?" component={Signup}></Route>
          <Route exact path="/signup/:email?/:token?" component={Signup} ></Route>
          <Route exact path="/company_invite/:email?/:token?/:countryCode?" component={Signup} ></Route>
          <Route exact path="/supplier_invite/:token?" component={SupplierSignup} ></Route>
          <Route exact path="/trainee_invite/:token" component={Login} ></Route>
          <Route exact path="/trainee_registration/:token" component={SignUpTrainee}></Route>
          <Route exact path="/trainee_registration" component={SignUpTrainee}></Route>
          <Route exact path="/trainee_login" component={Login} ></Route>
          {/* <Route exact path="/internal_register/:token" component={SignUpTrainee}></Route> */}
          <Route exact path="/external_register/:token" component={SignUpForExternalTrainee}></Route>
          <Route exact path="/external_attendence/:token" component={ExternaTraineelAttendance}></Route>
          <Route exact path="/internal_register/:token" component={SignUpInternalTrainee}></Route>
          <AdminRoute />
          <Route path="*" component={NotFoundRoute} />
        </Switch>
      </HashRouter>
    </div>
  )
}
