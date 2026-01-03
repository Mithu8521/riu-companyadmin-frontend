import swal from "sweetalert";
import config from "../../../config/config.json";

export const frameworkService = {
  getFrameworks,
  updateSubscriptionStatus,
  createFramework,
  deleteFramework,
  updateFramework,
  getFrameworkByID
};

async function deleteFramework(uuid) {
  const response = await fetch(
    `${config.API_URL}deleteFramework/${uuid}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("DELETE", localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function getFrameworkByID(path) {
  const response = await fetch(
    `${config.API_URL}getFrameworkByID/${path}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getFrameworks(type) {
  const response = await fetch(
    `${config.API_URL}getFramework?type=${type}&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function updateFramework(userData) {
  const response = await fetch(
    `${config.API_URL}updateFramework?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function createFramework(userData) {
  // userData.company_id=getStore('user_temp_id');
  const response = await fetch(
    `${config.API_URL}createFramework?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}


async function updateSubscriptionStatus(userData) {
  const response = await fetch(
    `${config.API_URL}billing/subscription/update?current_role=${localStorage.getItem("role")}`,
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

function handleResponse(response) {
  return response.statusCode === 200
    ? successAlert(response.customMessage, "", "success")
    : alert(response.message, "", "error");
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
