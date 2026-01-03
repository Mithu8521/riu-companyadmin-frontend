/* eslint-disable no-useless-escape */
/**
 * Created by Indersein on 15/06/2022.
 */
import Swal from "sweetalert2";
import { commonService } from "../_services/common/commonService";

/**
 * Check is Authenticated
 */

export const checkIsAuthenticated = async () => {
  return await commonService.checkIsAuthenticated();
};

/**
 * Print Sweet Alert
 */
export const sweetAlert = (messageType, message, showIcon = true) => {
  showIcon ?
    Swal.fire({
      icon: messageType,
      title: message,
      showConfirmButton: false,
      timer: 3000
    }) : Swal.fire({
      title: message,
      showConfirmButton: false,
      timer: 3000
    });
};
/**
 * Set localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  return window.localStorage.setItem(name, content);
};

/**
 * Get localStorage
 */
export const getStore = (name) => {
  if (!name) return;
  return JSON.parse(window.localStorage.getItem(name));
};
/**
 * Get localStorage
 */
export const getSubscriptionAuth = (subscriptionAuth) => {
  let data = window.localStorage.getItem(subscriptionAuth);
  if (data) {
    if (data === "400") {
      return false;
    } else {
      return true;
    }
  }
};
/**
 * Clear localStorage
 */
export const removeItem = (name) => {
  if (!name) return;
  return window.localStorage.removeItem(name);
};
/**
 * Email Validation Regular expression
 */
export const isValidEmail = (value) => {
  return !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value));
};

/**
 * Password Validation Regular expression
 */
export const checkPasswordValidation = (value) => {
  const isWhitespace = /^(?=.*\s)/;
  if (isWhitespace.test(value)) {
    return "Password must not contain Whitespaces.";
  }
  const isContainsUppercase = /^(?=.*[A-Z])/;
  if (!isContainsUppercase.test(value)) {
    return "Password must have at least one Uppercase Character.";
  }
  const isContainsLowercase = /^(?=.*[a-z])/;
  if (!isContainsLowercase.test(value)) {
    return "Password must have at least one Lowercase Character.";
  }
  const isContainsNumber = /^(?=.*[0-9])/;
  if (!isContainsNumber.test(value)) {
    return "Password must contain at least one Digit.";
  }
  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
  if (!isContainsSymbol.test(value)) {
    return "Password must contain at least one Special Symbol.";
  }
  const isValidLength = /^.{8,16}$/;
  if (!isValidLength.test(value)) {
    return "Password must be 10-16 Characters Long.";
  }
  return true;
};


export const transformRoleOrder = (role) => {
  let roles = "company"
  roles = roles.toString().split(",");

  let priorityRoles = [];

  if (roles.includes("company")) {
    priorityRoles.push({ id: 1, role: "company" });
  }
  if (roles.includes("supplier")) {
    priorityRoles.push({ id: 3, role: "supplier" });
  }

  return priorityRoles;

}

export const parseReportingQuestionId = (reportingQuestionId) => {
  const regex = /^Q(\d+)(?:R(\d+))?(?:C(\d+))?(?::C(\d+))?$/;
  const match = reportingQuestionId.match(regex);

  if (!match) return null;

  return {
    questionId: match[1] ? Number(match[1]) : null,
    rowId: match[2] ? Number(match[2]) : null,
    colId: match[3] ? Number(match[3]) : null,
    unitId: match[4] ? Number(match[4]) : null,
  };
};
