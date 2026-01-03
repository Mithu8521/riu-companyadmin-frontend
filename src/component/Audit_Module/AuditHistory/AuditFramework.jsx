import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";

const AuditFramework = (props) => {
  const location = useLocation();
  const [mode, setMode] = useState("outcome");
  const [show, setShow] = useState(false);
  const [frameworkList, setFrameworkList] = useState([]);
  const getFramework = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setFrameworkList(data.data);
    }
  };
  useEffect(() => {
    getFramework();
  }, []);
  const viewOutcome = () => {
    setMode("outcome");
    setShow(true);
  };

  const viewRemark = () => {
    setMode("remark");
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

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
                      <NavLink to="/audit-history"> Audit History </NavLink>
                    </li>
                    <li>
                      <NavLink to="/framework-history" className="activee">
                        Framework
                      </NavLink>
                    </li>
                  </ul>
                </div>
                {/* <div className="hstack gap-2">
                  <div className="filter_ICOn">
                    <AuditListingFilter />
                  </div>
                  <Form.Select
                    className="me-2"
                    aria-label="Default select example"
                  >
                    <option>Select Entity</option>
                    <option value="1">Supplier</option>
                    <option value="2">Company</option>
                  </Form.Select>
                </div> */}
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
                    <th style={{ width: 55 }}>Sr.</th>
                    <th>Framework</th>
                    <th style={{ width: 120 }} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                {frameworkList && (
                  <tbody>
                    {frameworkList.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data?.title}</td>
                        <td>
                          <div className="hstack gap-3 justify-content-center">
                            <i
                              onClick={() => viewOutcome()}
                              className="fas fa-file-alt"
                              title="View Outcome"
                            ></i>
                            <i
                              onClick={() => viewRemark()}
                              className="fas fa-file"
                              title="View Remark"
                            ></i>
                            <NavLink
                              to={{
                                pathname: "/answer-history",
                                state: { frameworkId: [data?.id], financialYearId: props?.location?.state?.financialYearId, },
                              }}
                            >
                              <i
                                className="fas fa-file-invoice"
                                title="View Answer"
                              ></i>
                            </NavLink>
                            <i
                              className="fa fa-download"
                              title="Download Report"
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          </div>
        </section>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            View{" "}
            {mode === "outcome"
              ? "Outcome"
              : mode === "remark"
                ? "Remark"
                : mode === "answer"
                  ? "Answer"
                  : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuditFramework;
