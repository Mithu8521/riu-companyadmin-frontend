import config from "../../config/config.json";
import { getStore } from "../../utils/UniversalFunction";
import swal from "sweetalert";

export const supplierManagementService = {
  updateSubscriptionStatus,
  createBoardSkills,
  createManagementSkills,
  getFrameworks,
};

async function getFrameworks() {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.API_URL
    }getSectorQuestionsAnswers?frameworkId&topicId&kpiId&current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function createManagementSkills(userData) {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.API_URL
    }createManagementSkillsQuestions?current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
  return data;
}

async function createBoardSkills(userData) {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.API_URL
    }createBoardSkillsQuestionscurrent_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
  return data;
}

async function updateSubscriptionStatus(userData) {
  let headerSet = getStore("currentUser");
  const response = await fetch(
    `${config.ADMIN_API_URL
    }billing/subscription/update?current_role=${localStorage.getItem("role")}`,
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
    timer: 1000,
  });
  return true;
}
