import React, { useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";

export default function CreateProcess(props) {
  const [meterData, setMeterData] = useState();
  const [process, setProcess] = useState("");
  const [error, setError] = useState("");
  const [alreadyExistsError, setAlreadyExistsError] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!process) {
      setError("This fields are required.");
      return;
    }
    const data = {
      process: process,
      company_id: localStorage.getItem("user_temp_id"),
    };
    const { isSuccess } = await apiCall(
      `${config.API_URL}createProcessId`,
      {},
      data,
      "POST"
    );
    if (isSuccess) {
      window.location.href = config.baseURL + "/#/settings";
    }
  };
  const callApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getProcessId`,
      {},
      { company_id: localStorage.getItem("user_temp_id") },
      "GET"
    );
    if (isSuccess) {
      setMeterData(data?.data);
    }
  };
  const checkProcessExistence = (value) => {
    return meterData?.some((item) => item?.process === value);
  };

  const handleProcessChange = (e) => {
    const newValue = e.target.value;
    setAlreadyExistsError("");
    setError("");
    setProcess(newValue);
    if (checkProcessExistence(newValue)) {
      setAlreadyExistsError("This Process already Created.");
    }
  };
  useEffect(() => {
    callApi();
  }, []);
  return (
    <div>
      <Header />
      <Sidebar dataFromParent={props.location.pathname} />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-12">
                      <div className="color_div_on framwork_2">
                        <div className="business_detail">
                          <div className="">
                            <div className="saved_cards">
                              <form name="form">
                                <div className="business_detail">
                                  <div className="heading">
                                    <h4>Add Process</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          Process
                                        </label>
                                        <input
                                          className="form-control py-3"
                                          value={process}
                                          onChange={(e) => {
                                            handleProcessChange(e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <p className="red">
                                      {alreadyExistsError || error}
                                    </p>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    className="new_button_style"
                                    onClick={submitHandler}
                                    disabled={
                                      alreadyExistsError?.length !== 0 ||
                                      process?.length === 0
                                    }
                                  >
                                    ADD NOW
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
