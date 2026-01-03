/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  getStore,
  getSubscriptionAuth,
  checkIsAuthenticated
} from "./utils/UniversalFunction";

function OtpVerification() {
  useEffect(() => {
    async function fetchData() {
      let data = await checkIsAuthenticated();
      let checkCondition = data.status === false;
      if (checkCondition) {
        localStorage.clear();
        return <Redirect to={{ pathname: "/" }} />;
      } else {
        const auth = getStore("currentUser");
        const statusFor2Fa = getStore("2faStatus");
        if (auth) {
          let status = statusFor2Fa === 0;
          if (status) {
            return <Redirect to={{ pathname: "/OTPVerify" }} />;
          } else {
            const subscriptionAuth = getSubscriptionAuth("subscriptionAuth");

            if (subscriptionAuth === 0) {
              return <Redirect to={{ pathname: "/subscription_plan" }} />;
            } else {
              return (
                <Redirect to={{ pathname: document.URL.split("/").pop() }} />
              );
            }
          }
        } else {
          return <Redirect to={{ pathname: document.URL.split("/").pop() }} />;
        }
      }
    }
    fetchData();
  }, [checkIsAuthenticated]);

  return null;
}

// export function OtpVerification(a, b) {
//   return checkingAllData();
// }

// function checkingAllData() {
//   const auth = getStore("currentUser");
//   const statusFor2Fa = getStore("2faStatus");
//   if (auth) {
//     let status = statusFor2Fa === 0;
//     if (status) {
//       return <Redirect to={{ pathname: "/OTPVerify" }} />;
//     } else {
//       const subscriptionAuth = getSubscriptionAuth("subscriptionAuth");

//       if (subscriptionAuth === 0) {
//         return <Redirect to={{ pathname: "/subscription_plan" }} />;
//       } else {
//         return <Redirect to={{ pathname: document.URL.split("/").pop() }} />;
//       }
//     }
//   } else {
//     return <Redirect to={{ pathname: document.URL.split("/").pop() }} />;
//   }
// }

// async function checkAuthenticate() {
//   let data = await checkIsAuthenticated();
//   let checkCondition = data.status === false;
//   if (checkCondition) {
//     localStorage.clear();
//     return <Redirect to={{ pathname: "/" }} />;
//   } else {
//     return <Redirect to={{ pathname: document.URL.split("/").pop() }} />;
//   }
// }

export default OtpVerification;
