import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { useLocation } from "react-router-dom";
import { Form, Tab, Tabs } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";

const GetQuestionByImport = () => {
  const location = useLocation();
  const [assessmentList, setAssessmentList] = useState([]);

  const [frameworkList, setFrameworkList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("framework");
  const current_role = localStorage.getItem("role");

  // const [selectedAssessmentIds, setSelectedAssessmentIds] = useState([]);
  // const [selectedFrameworkIds, setSelectedFrameworkIds] = useState([]);
  let selectedAssessmentIds, selectedFrameworkIds;
  let assessmentInputRef = useRef();
  let frameworkInputRef = useRef();

  useEffect(() => {
    current_role === "COMPANY" && fetchSupplierAssessment();
    current_role === "COMPANY" && fetchFrameworks();
  }, []);

  const importAssessments = async () => {

    selectedAssessmentIds = assessmentInputRef.current.state.selectedValues.map((value) => (value.id))
    selectedFrameworkIds = frameworkInputRef.current.state.selectedValues.map((value) => (value.id))

    const { isSuccess, data } = await apiCall(
      `${config.API_URL}fetchQuestionsForImport`,
      {},
      {
        type:
          selectedTab === "assessment"
            ? "PREVIOUS_ASSESSMENT"
            : selectedTab === "framework"
              ? "FRAMEWORK"
              : "",
        ids: selectedTab === "assessment"
          ? selectedAssessmentIds
          : selectedTab === "framework"
            ? selectedFrameworkIds
            : "",
      },
      "GET"
    );
    if (isSuccess) {
      console.log("assessments", data.data);
    }
  };

  const fetchFrameworks = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "ALL" },
      "GET"
    );
    if (isSuccess) {
      console.log("frameworks", data?.data);
      setFrameworkList(data?.data);
    }
  };

  const fetchSupplierAssessment = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}fetchSupplierAssessment`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const responseData = data.data;
      setAssessmentList(responseData);
    }
  };

  return (
    <div>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12 color_div_on">
                    <div className="heading heading_wth_text">
                      <div className="d-flex align-items-center justify-content-between">
                        <h4>Questions List</h4>
                        <div className="d-flex align-items-center gap-2">
                          {/* <button
                            className="new_button_style mx-2"
                            onClick={handleShow1}
                          >
                            Assign Assessment
                          </button>
                          <button
                            className="new_button_style w-50"
                            onClick={handleShow}
                          >
                            New Supplier Assessment
                          </button> */}
                        </div>
                      </div>
                    </div>
                    <hr
                      className="mt-2"
                      style={{ color: "rgba(0, 0, 0, 0.27)" }}
                    />
                    <Tabs
                      defaultActiveKey="framework"
                      transition={false}
                      id="noanim-tab-example"
                      className="mb-3"
                      style={{ background: "#1f9ed1" }}
                    >
                      <Tab
                        eventKey="framework"
                        title="By Framework"
                        onClick={() => {
                          setSelectedTab("framework");
                        }}
                      >
                        <Form.Label>Select Framework</Form.Label>
                        <Multiselect
                          displayValue="title"
                          options={frameworkList.map((framework) => ({
                            id: framework.id,
                            title: framework.title,
                          }))}
                          showCheckbox={true}
                          ref={frameworkInputRef}
                        // onSelect={(e) => setSelectedFrameworkIds(e)}
                        />
                      </Tab>
                      <Tab
                        eventKey="assessment"
                        title="By Previous Assessment"
                        onClick={() => {
                          setSelectedTab("assessment");
                        }}
                      >
                        <Form.Label>Select Assessment</Form.Label>
                        <Multiselect
                          displayValue="titleNyear"
                          options={assessmentList.map((assessment) => ({
                            id: assessment.id,
                            titleNyear:
                              assessment.title +
                              "(" +
                              assessment.financial_year_value +
                              ")",
                          }))}
                          showCheckbox={true}
                          ref={assessmentInputRef}
                        // onSelect={(e) => setSelectedAssessmentIds(e)}
                        />
                      </Tab>
                    </Tabs>
                    <div className="mt-3">
                      <button
                        className="new_button_style"
                        onClick={importAssessments}
                      >
                        Get Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default GetQuestionByImport;
