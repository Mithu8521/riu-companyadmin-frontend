import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from '../component/Login/login';
import Signup from '../component/signup/signup';

function PublicRoute() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login}></Route>
        <Route exact path='/Login' component={Login}></Route>
        <Route exact path='/signup' component={Signup}></Route>
      </Switch>
    </Router>
  );
}

export default PublicRoute;
