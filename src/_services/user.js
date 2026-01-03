import config from "../config/config.json";
import { authHeader } from '../_services/auth-header';
import { handleResponse } from '../_helpers/handle-response';
export const userService = {
  getAll,
  getById
};

function getAll() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`${config.OLD_API_URL}/users?current_role=${localStorage.getItem("role")}`, requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`${config.OLD_API_URL}/users/${id}?current_role=${localStorage.getItem("role")}`, requestOptions).then(handleResponse);
}

// commonApi('getEnvironmentCapitalAnswers')
function commonApi(endPoint) {
  return fetch(config.API_URL + endPoint, { headers })
    .then((res) => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.answers,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
}