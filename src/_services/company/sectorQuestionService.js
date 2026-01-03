import swal from "sweetalert";
import config from "../../config/config.json";

export const sectorQuestionService = {
  updateSubscriptionStatus,
  createBoardSkills,
  createManagementSkills,
  getSectorQuestionHeadings,
  getSectorQuestion,
};

async function getSectorQuestionHeadings(limit, skip, search) {
  const response = await fetch(
    `${config.API_URL
    }getSectorQuestionHeadings?frameworkId&topicId&kpiId&limit=${limit}&skip=${skip}&search=${search}&current_role=${localStorage.getItem(
      "role"
    )}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function getSectorQuestion(id) {
  const response = await fetch(
    `${API_URL}getSectorQuestions?id=${id}`,
    headersWithAuthNew("GET", localStorage.getItem("token"))
  );
  const data = await response.json();
  return data;
}

async function createManagementSkills(userData) {
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
  const response = await fetch(
    `${config.API_URL
    }createBoardSkillsQuestions?current_role=${localStorage.getItem("role")}`,
    headersWithAuthBody("POST", userData, localStorage.getItem("token"))
  );
  const data = await response.json();
  handleResponse(data);
  return data;
}

async function updateSubscriptionStatus(userData) {
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
