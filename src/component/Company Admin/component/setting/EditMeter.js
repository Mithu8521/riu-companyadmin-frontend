import React, { useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from '../../../../config/config.json'
import swal from "sweetalert";
import { apiCall } from "../../../../_services/apiCall";


export default function EditMeter(props) {
  const location = useLocation();
  const [meterData, setMeterData] = useState();
  const [alreadyExistsError, setAlreadyExistsError] = useState("");
  const [process, setProcess] = useState(location?.state?.item?.process);
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );


  const submitHandler = async (e) => {
    e.preventDefault();
    if (!process) {
      setError('All fields are required.')
      return;
    }
    const data = {
      process: process,
      id: location?.state?.item?.id
    }
    const { isSuccess } = await apiCall(`${config.API_URL}updateMeterId`, {}, data, "POST");
    if (isSuccess) {
      window.location.href = config.baseURL + "/#/settings"
    }
  };
  const callApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getProcessId?company_id=${localStorage.getItem(
        "user_temp_id"
      )}`,
      {},
      {},
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
                                    <h4>Add Source</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    {/* <div className="col-lg-6 col-xs-6">
                                    <div className="form-group">
                                      <label
                                        htmlFor="industryType"
                                        className="mb-2"
                                      >
                                        Source id
                                      </label>
                                      <input
                                        type={"number"}
                                        className="form-control pb-4"
                                        value={meterId}
                                        onChange={(e) =>
                                          setMeterId(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div> */}
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group ">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          Source
                                        </label>
                                        <input
                                          className="form-control pb-4 "
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
                                    {/* <div className="col-lg-6 col-xs-6 form-group">
                                    <label
                                      htmlFor="question"
                                      className="mb-2"
                                    >
                                      unit
                                    </label>
                                    <input
                                      type={"number"}
                                      className="form-control pb-4"
                                      value={unit}
                                      onChange={(e) => {
                                        setUnit(e.target.value);
                                      }}
                                    />
                                  </div> */}
                                  </div>
                                  {error && <>{error}</>}
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
                                    UPDATE NOW
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
