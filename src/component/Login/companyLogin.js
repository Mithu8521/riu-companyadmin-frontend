/* eslint-disable jsx-a11y/anchor-is-valid */
import Swal from "sweetalert2";
import React, { useEffect } from "react";
import axios from "axios";
import "./login.css";
import "./groupadmin.css";
import config from "../../config/config.json";

const baseURL = config.baseURL;

const SignupFor = () => {
  useEffect(() => {
    getCompanyData();
  }, []);

  const getCompanyData = async () => {
    const fragment = window.location.href.split("#")[1];
    const fragments = fragment.split("/");
    const userId = fragments[2];
    const token = fragments[3];
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    let pushToRoute = "";
    await axios
      .get(`${config.API_URL}getCompanyData?current_role=${localStorage.getItem("role")}`, {
        params: {
          user_id: userId,
        },
        headers: headers,
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: response.data.customMessage,
          showConfirmButton: true,
          timer: 1000,
        });
        let setResponse = {};
        setResponse.data = response.data;
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...setResponse,
            is_head: response.data.is_head,
            hasValidPlan: response.data.hasValidPlan,
          })
        );
        localStorage.setItem("menu", JSON.stringify(response?.data?.menu));
        localStorage.setItem(
          "user_temp_id",
          JSON.stringify(response?.data?.user_id)
        );
        localStorage.setItem(
          "role",
          JSON.stringify(response?.data?.user_type_code).toUpperCase()
        );
        localStorage.setItem("subscriptionAuth", JSON.stringify(200));
        pushToRoute = "/#/home";
        window.location.href = baseURL + pushToRoute;
      })
      .catch(function (error) {
        window.location.href = baseURL + pushToRoute;
      });
  };

  return (
    <div>
      <section className="login">
        <div className="login_part">
          <div className="sing_log">
            <div className="text_sing mb-4">
              <h4 className="Account">Login</h4>
              <p className="faster_oval"></p>
              <div id="loader"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignupFor;
