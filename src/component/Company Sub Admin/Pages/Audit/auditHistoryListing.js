import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Sidebar from "../../../sidebar/sidebar";
import { NavLink } from "react-router-dom";
import view from '../../../../img/view.png'
import Header from "../../../header/header";
import "../../../sidebar/common.css";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import {
  Form,
  Accordion,
  InputGroup,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import TebularInputCard from "../../Component/Sector Questions/TebularInputCard";
import { filter } from "lodash";

const AuditCompanyListing = (props) => {
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState("");
  const [auditData, setAuditData] = useState([]);
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [filteredFrameValue, setFilteredFrameValue] = useState([]);
  const [framework_id, setFramework_id] = useState("");
  const [submissionData, setSubmissionData] = useState([]);
  const [noDataAvailable, setNoDataAvailable] = useState(false);
  const getFinancialYear = async (frameworkData) => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFinancialYear`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setFinancialYear(data?.data);
      if (data?.data?.length === 1) {
        await setFinancialYearId(data?.data[0]?.id);
        setFrameworkValue(frameworkData);
        await fetchStoredData(data?.data[0]?.id, frameworkData);
        await getSubmission(data?.data[0]?.id);
      }
    }
  };
  const fetchFrameworkApi = async () => {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "ALL" }
    );
    if (isSuccess) {
      setFrameworkValue(data?.data);
    }
    return data?.data;
  };

  const handleFinancialYearChange = async (e) => {
    setFilteredFrameValue([]);
    if (e.target.value !== "Select Financial Year") {
      const fId = e.target.value;
      setFinancialYearId(fId);
      await fetchStoredData(fId, frameworkValue);
      await getSubmission(fId);
    }
  };
  const getSubmission = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getSubmission`,
      {},
      { questionnaire_type: "SQ", financial_year_id: fId },
      "GET"
    );
    if (isSuccess) {
      setSubmissionData(data?.data);
    }
  };
  const handleFrameworkChange = async (e) => {
    if (e.target.value !== "Select Financial Year") {
      const { isSuccess, data } = await apiCall(
        `${config.API_URL}auditHistory`,
        {},
        {
          questionnaire_type: "SQ",
          financial_year_id: financialYearId,
          framework_id: e.target.value,
        },
        "GET"
      );
      if (isSuccess) {
        setAuditData(data?.data?.questionData[e.target.value]);
      }
    }
  };

  const fetchStoredData = async (fId, frameworkValue) => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getDataCompanyWise`,
      {},
      { type: "SQ", financial_year_id: fId },
      "GET"
    );
    if (isSuccess) {
      const data1 = data?.data?.framework_topic_kpi
        ? JSON.parse(data?.data?.framework_topic_kpi)
        : {};
      if (data1 && data1.framework_id && data1.framework_id.length > 0) {
        // this.handleAutoselectedFramework(data1.framework_id)

        const filteredData = await frameworkValue?.filter((obj) => {
          return data1?.framework_id.find((value) => {
            return value === obj.id;
          });
        });

        if (filteredData && filteredData?.length > 0) {
          setFilteredFrameValue(filteredData);
          // this.fetchTopicData()
        } else {
          setFilteredFrameValue([]);
          setNoDataAvailable(true);
        }
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const frameworkData = await fetchFrameworkApi();
      // getFinancialYear(frameworkData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar dataFromParent={props.location.pathname} Defaults="0" />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="select-reporting-criteria">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="Reporting_heading">
                          <h1>Audit History Listing</h1>
                        </div>
                        <div>
                          <div className="d-flex dropdown align-items-center">
                            <p className="m-0">Entity : </p>
                            <select
                              name="tab_name"
                              // onChange={this.ok}
                              className="select_one_all industrylist"
                            >
                              {/* <option>Select Questionnaire Type</option> */}
                              <option>Sector Question</option>
                              {/* <option>Supplier Assessment</option> */}
                            </select>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex dropdown align-items-center">
                            <p className="m-0"> Financial Year : </p>
                            {financialYear && financialYear?.length === 1 ? (
                              <select
                                name="tab_name"
                                onChange={(e) => {
                                  handleFinancialYearChange(e);
                                }}
                                className="select_one_all industrylist"
                              >
                                {financialYear &&
                                  financialYear?.map((item, key) => (
                                    <option key={key} value={item.id}>
                                      {item.financial_year_value}
                                    </option>
                                  ))}
                              </select>
                            ) : (
                              <select
                                name="tab_name"
                                onChange={(e) => {
                                  handleFinancialYearChange(e);
                                }}
                                className="select_one_all industrylist"
                              >
                                <option>Select Financial Year </option>
                                {financialYear &&
                                  financialYear?.map((item, key) => (
                                    <option key={key} value={item.id}>
                                      {item.financial_year_value}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {filteredFrameValue?.length > 0 ? (
                      <>
                        <div className="Introduction framwork_2">
                          <section className="forms">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "5%" }}>S No.</th>
                                        <th>Framework</th>
                                        <th>Outcome</th>
                                        <th>Remark</th>
                                        <th style={{ width: "5%" }}>View</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredFrameValue?.map((item, key) => {
                                        const matchingObject =
                                          submissionData.find(
                                            (obj) =>
                                              obj.framework_id === item.id
                                          );

                                        return (
                                          <tr key={key + 1}>
                                            <td>{key + 1}</td>
                                            <td>{item?.title}</td>
                                            <td>
                                              {matchingObject?.outcome
                                                ? matchingObject?.outcome
                                                : "--"}
                                            </td>
                                            <td>
                                              {matchingObject?.remark
                                                ? matchingObject?.remark
                                                : "--"}
                                            </td>
                                            {/* <td>{item?.register_company_name}</td> */}
                                            <td>
                                              <NavLink
                                                className="non_underline_link bold view_c"
                                                to={{
                                                  pathname:
                                                    "/audit_history_question_listing",
                                                  state: {
                                                    framework_id: item.id,
                                                    financialYearId:
                                                      financialYearId,
                                                    outcome:
                                                      matchingObject?.outcome
                                                        ? true
                                                        : false,
                                                  },
                                                }}
                                              >
                                                <img src={view} alt="" srcSet="" />
                                              </NavLink>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                    {/*<tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Question List 1</td>
                                      <td>
                                        <NavLink className="non_underline_link bold view_c" to="/audit"><img src={view} alt="" srcSet="" /></NavLink>
                                    </td>
                                    </tr>
                                </tbody>*/}
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </>
                    ) : noDataAvailable ? (
                      <>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="business_detail">
                              <div className="heading align-items-center justify-content-center">
                                <h4> No Questionnaire Found</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCompanyListing;
