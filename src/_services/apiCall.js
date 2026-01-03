import axios from "axios";
import { sweetAlert } from "../utils/UniversalFunction";

export async function apiCall(url, header = {}, data = {}, method = "GET", showIcon = true, showSweetAlert = true) {
  let currentUser;
  let config;

  // Base headers
  config = {
    headers: {
      ...header,
      Accept: "application/json",
    },
  };

  if (localStorage.getItem("currentUser")) {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    config.headers.userId = currentUser.id;
  }

  try {
    let response;
    const upperMethod = method.toUpperCase();

    if (upperMethod === "GET") {
      const queryParams = Object.entries(data)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=[${value.join(",")}]`;
          }
          return `${key}=${value}`;
        })
        .join("&");
      response = await axios.get(`${url}?${queryParams}`, config);

    } else if (upperMethod === "DELETE") {
      // axios.delete needs data in config object
      response = await axios.delete(url, { ...config, data });

    } else if (upperMethod === "PUT") {
      response = await axios.put(url, data, config);

    } else if (upperMethod === "POST") {
      response = await axios.post(url, data, config);

    } else if (upperMethod === "PATCH") {
      response = await axios.patch(url, data, config);

    } else {
      // ⬇️ detect FormData
      if (!(data instanceof FormData)) {
        // append default role only if data is plain object
        data = { current_role: localStorage.getItem("role"), ...data };
        config.headers["Content-Type"] = "application/json";
      } else {
        // let browser set Content-Type with boundary
        config.headers["Content-Type"] = "multipart/form-data";
        data.append("current_role", localStorage.getItem("role") || "");
      }

      response = await axios[method.toLowerCase()](url, data, config);
    }

    const { status, data: responseData } = response;

    if (status >= 200 && status < 300) {
      if (method.toUpperCase() !== "GET") {
        if (!responseData?.notShowPopUp) {
          showSweetAlert && sweetAlert("success", responseData?.message, showIcon);
        }
      }
      return { isSuccess: true, data: responseData, message: responseData?.message };
    } else {
      throw new Error(`Request failed with status ${status}`);
    }
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "An error occurred";

    console.log(status, message);

    // ✅ Only logout on explicit auth errors
    if (message === "SESSION_EXPIRED") {

      sweetAlert("error", "Your Session has expired. Please log in again.", showIcon);


      localStorage.clear();
      window.location.href = "/";
      return;
    } else {
      const errorMessage = error.response
        ? error.response.data.message
        : "An error occurred";
      sweetAlert("error", errorMessage, showIcon);
      return { isSuccess: false, data: { error: errorMessage }, message: errorMessage };
    }

    // ❌ Otherwise, just show the error but do NOT log out
  showSweetAlert &&  sweetAlert("error", message);
    return { isSuccess: false, data: { error: message }, message };
  }
}
