import config from "../../config/config.json";
import { getStore } from "../../utils/UniversalFunction";
import swal from "sweetalert";

export const profileService = {
  getSubscriptionPlans,
  asa,
  updateSubscriptionStatus,
  createSubscription,
};

async function asa(userData, history) {
  let headerSet = getStore("currentUser");
  const headers = {
    authorization: headerSet.Authorization,
    "content-type": "application/json",
  };
  const response = await fetch(
    `${config.API_URL}basicInfo?current_role=${localStorage.getItem("role")}`,
    headersWithAuth("PATCH", userData, headers)
  );
  const data = await response.json();
  let getResponse = handleResponse(data);
  if (getResponse === true) {
    history(`/profile-basic-information`);
  }
}

async function getSubscriptionPlans() {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.ADMIN_API_URL}billing/subscriptions?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function createSubscription(userData) {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.ADMIN_API_URL}billing/subscription/create?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}


async function updateSubscriptionStatus(userData) {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.ADMIN_API_URL}billing/subscription/update?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

function headersWithAuthBody(method, data, token) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);
  let raw = JSON.stringify(data);

  let requestOptions = {
    method: method,
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return requestOptions;
}

function headersWithAuthNew(method, token) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  var requestOptions = {
    method: method,
    headers: myHeaders,
    redirect: "follow",
  };
  return requestOptions;
}

function headersWithAuth(method, userData, auth) {
  return {
    method: method,
    headers: auth,
    body: JSON.stringify(userData),
  };
}

function handleResponse(response) {
  return response.statusCode === 200
    ? successAlert(response.customMessage, "", "success")
    : alert(response.customMessage, "Please try again later..!", "error");
}

function alert(message, message2, statusCode) {
  swal(message, message2, statusCode);
  return false;
}

function successAlert(message, message2, statusCode) {
  swal({
    icon: 'success',
    title: message2,
    text: message,
    timer: 2000
  })
  return true;
}
