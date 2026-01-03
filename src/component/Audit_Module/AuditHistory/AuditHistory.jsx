import React, { useEffect, useState } from "react";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Form, Table } from "react-bootstrap";
import AuditListingFilter from "../../Company Sub Admin/Component/Sector Questions/Filter/AuditListingFilter";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const AuditHistory = () => {
  const location = useLocation();
  const [financialYear, setFinancialYear] = useState([]);
  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYear(parsedData);
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {},
        "GET"
      );
      
      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Set state with the API response
        setFinancialYear(data.data);
      }
    }
  };
  useEffect(() => {
    getFinancialYear();
  }, []);
  return (
    <>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <section className="inner_wraapper px-3 pt-3">
          <div className="color_div_on framwork_2 hol_rell">
            <div className="steps-form">
              <div className="steps-row setup-panel hstack justify-content-between">
                <div className="tabs-top setting_admin my-0">
                  <ul>
                    <li>
                      <NavLink to="/audit-listing"> Audit Listing </NavLink>
                    </li>
                    <li>
                      <NavLink to="/audit-history" className="activee">
                        Audit History
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="hstack gap-1">
                  <div className="filter_ICOn">
                    <AuditListingFilter />
                  </div>
                  <Form.Select
                    className="mx-2"
                    aria-label="Default select example"
                  >
                    <option>Select Entity</option>
                    <option value="2">Company</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </div>
          <div className="Introduction history__sections">
            <div className="question_section">
              <Table
                striped
                hover
                bordered
                className="m-0"
                style={{ cursor: "pointer" }}
              >
                <thead>
                  <tr className="fixed_tr_section">
                    <td style={{ width: 55 }}>Sr.</td>
                    <td>Financial Year</td>
                    <td style={{ width: 100 }}>Action</td>
                  </tr>
                </thead>
                <tbody>

                  {financialYear &&
                    financialYear.map((data, index) => {
                      return (
                        <tr key={index}>
                          {" "}
                          {/* Added key prop */}
                          <td>{index + 1}</td>
                          <td>{data?.financial_year_value}</td>
                          <td>
                            <div className="hstack gap-3 justify-content-center">
                              <NavLink to={{
                                pathname: "/framework-history",
                                state: {
                                  financialYearId: data.id,
                                },
                              }} >
                                <i
                                  className="fa fa-eye"
                                  title="View Framework"
                                ></i>
                              </NavLink>
                              <NavLink to={"/answer-history"}>
                                <i
                                  className="fas fa-file-invoice"
                                  title="View Question"
                                ></i>
                              </NavLink>
                              <i
                                className="fa fa-download"
                                title="Download Report"
                              ></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {/* <tr>
                    <td>2</td>
                    <td>2022 - 2023</td>
                    <td>
                      <div className="hstack gap-3 justify-content-center">
                        <NavLink  to={{
                                    pathname: "/framework-history",
                                    state: {
                                      questionIds: [notification?.questionId],
                                    },
                                  }} >
                          <i className="fa fa-eye" title="View Framework"></i>
                        </NavLink>
                        <NavLink to={"/answer-history"}>
                          <i
                            className="fas fa-file-invoice"
                            title="View Question"
                          ></i>
                        </NavLink>
                        <i
                          className="fa fa-download"
                          title="Download Report"
                        ></i>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2023 - 2024</td>
                    <td>
                      <div className="hstack gap-3 justify-content-center">
                        <NavLink to={"/framework-history"}>
                          <i className="fa fa-eye" title="View Framework"></i>
                        </NavLink>
                        <NavLink to={"/answer-history"}>
                          <i
                            className="fas fa-file-invoice"
                            title="View Question"
                          ></i>
                        </NavLink>
                        <i
                          className="fa fa-download"
                          title="Download Report"
                        ></i>
                      </div>
                    </td>
                  </tr> */}
                </tbody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AuditHistory;
