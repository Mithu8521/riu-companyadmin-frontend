import swal from "sweetalert";
import config from "../../../config/config.json";

export const KpiService = {
  getKpis,
  deleteKPI,
  updateSubscriptionStatus,
  createKpi,
  getKPIByID,
  updateKPI,
};

async function getKPIByID(uuid) {
  const response = await fetch(
    `${config.API_URL}getKPIByID/${uuid}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getKpis(type) {
  const response = await fetch(
    `${config.API_URL}getKpi?type=${type}&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function deleteKPI(uuid) {
  const response = await fetch(
    `${config.API_URL}deleteKPI/${uuid}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("DELETE", localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function createKpi(userData) {
  const response = await fetch(
    `${config.API_URL}createKpi?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function updateKPI(userData) {
  const response = await fetch(
    `${config.API_URL}updateKpi?current_role=${localStorage.getItem("role")}`,
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
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  let requestOptions = {
    method: method,
    headers: myHeaders,
    redirect: "follow",
  };
  return requestOptions;
}

// function headersWithAuth(method, userData, auth) {
//   return {
//     method: method,
//     headers: auth,
//     body: JSON.stringify(userData),
//   };
// }

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
