import Swal from 'sweetalert2'
import { BehaviorSubject } from 'rxjs';
import config from "../config/config.json";
import { handleResponse } from '../_helpers/handle-response';
import axios from "axios";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('tmpcurrentUser')));
export const authenticationService = {
  login,
  logout,
  currentUserSubject: currentUserSubject,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() { return currentUserSubject.value }
};

async function login(email, password) {
  return axios.post(config.OLD_API_URL + 'login', {
    email: email,
    password: password,
    current_role: localStorage.getItem("role"),
  }).then(handleResponse).then((response) => {
    Swal.fire(
      'Success',
      response.data.message,
      'success'
    )
    localStorage.setItem('user', JSON.stringify(response));
    const pushToRoute = "/home";
    this.props.history.push(pushToRoute);
  }).catch(function (error) {
    if (error.response) {
      Swal.fire(
        'Error',
        error.response.data.message,
        'error'
      )
    }
  });
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}