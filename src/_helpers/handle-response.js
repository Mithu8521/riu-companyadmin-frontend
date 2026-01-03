import { authenticationService } from "../_services/authentication";

export function handleResponse(response) {
  if (response.statusText !== "OK") {
    if ([401, 403].indexOf(response.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.logout();
      this.props.history.push("/");
    }

    const error = (response && response.data.message) || response.statusText;
    return Promise.reject(error);
  }
  return response;
}
