import config from "../../../config/config.json";
import swal from "sweetalert";
import { getStore } from "../../../utils/UniversalFunction";

export const sectorQuestionService = {
  getFrameworks,
  updateSubscriptionStatus,
  createFramework,
  createSectorQuestion,
  getallsectorquestiondata,
  deleteSectorQuestion,
  updateSectorQuestions,
  getQuestionByID
};

async function getFrameworks() {
  const response = await fetch(
    `${config.API_URL}framework?skip=0&limit=10&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getQuestionByID(id) {
  const response = await fetch(
    `${config.API_URL}getQuestionByID/${id}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getallsectorquestiondata(kpi_id) {
  const response = await fetch(
    `${config.API_URL}getAllSectorQuestion?company_id=${getStore('user_temp_id')}&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function updateSectorQuestions(userData) {
  const response = await fetch(
    `${config.API_URL}updateSectorQuestions?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function createFramework(userData) {
  const response = await fetch(
    `${config.API_URL}framework?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function deleteSectorQuestion(id) {
  const response = await fetch(
    `${config.API_URL}deleteSectorQuestion/${id}?current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("DELETE", localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function createSectorQuestion(userData) {
  const response = await fetch(
    `${config.API_URL}createSectorQuestion?current_role=${localStorage.getItem("role")}`,
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
    icon: "success",
    title: message2,
    text: message,
    timer: 2000,
  });
  return true;
}
