import swal from "sweetalert";
import config from "../../../config/config.json";
import { getStore } from "../../../utils/UniversalFunction";

export const topicService = {
  getTopics,
  updateSubscriptionStatus,
  createTopic,
  deleteTopic,
  updateTopic,
  getTopicByID,
  getTopicsAccordingToFramework,
  getKpisAccordingToFrameworkAndTopics,
};

async function getTopicByID(path) {
  const response = await fetch(
    `${config.API_URL}getTopicByID/${path}?current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function updateTopic(userData) {
  const response = await fetch(
    `${config.API_URL}updateTopiccurrent_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function deleteTopic(uuid) {
  const response = await fetch(
    `${config.API_URL}deleteTopic/${uuid}?current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthNew("DELETE", localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
}

async function getTopics(type) {
  const response = await fetch(
    `${config.API_URL}getTopic?type=${type}&current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getTopicsAccordingToFramework(frameworkId) {
  const response = await fetch(
    `${config.API_URL}getTopic?type=ADD_DATA_AVAILABLE&company_id=${getStore(
      "user_temp_id"
    )}&framework_id=${frameworkId}&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getKpisAccordingToFrameworkAndTopics(topicId) {
  const response = await fetch(
    `${config.ADMIN_API_URL
    }getKpisAccordingToTopics?topic_mapping_id=${topicId}&company_id=${localStorage.getItem(
      "user_temp_id"
    )}&current_role=${localStorage.getItem("role")}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function createTopic(userData) {
  userData.company_id = getStore("user_temp_id");
  const response = await fetch(
    `${config.API_URL}createTopic?current_role=${localStorage.getItem("role")}`,
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
