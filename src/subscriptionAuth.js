import React from "react";
import { Redirect } from "react-router-dom";
import { getSubscriptionAuth } from "./utils/UniversalFunction";

export function SubscriptionAuth(a, b) {
  const subscriptionAuth = getSubscriptionAuth("subscriptionAuth");
  if (subscriptionAuth === 0) {
    return <Redirect to={{ pathname: "/subscription_plan" }} />;
  } else {
    return <Redirect to={{ pathname: document.URL.split("/").pop() }} />;
  }
}

export default SubscriptionAuth;
