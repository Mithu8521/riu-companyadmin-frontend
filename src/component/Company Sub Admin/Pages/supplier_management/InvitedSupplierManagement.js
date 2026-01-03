import React, { useEffect, useState } from "react";
import Header from "../../../header/header";
import Sidebar from "../../../sidebar/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import NodataFound from "../../../../img/no.png";
import Loader from "../../../loader/Loader";

const InvitedSupplierManagement = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [supplierList, setSupplierList] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showSkelton, setshowSkelton] = useState(false);
  const [useLoader, setUseLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const sendInvite = async (id, e) => {
    setUseLoader(true);
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `inviteSupplier`,
      {},
      {
        email: email,
        companyName: companyName,
      },
      "POST"
    );
    setUseLoader(false);
    if (isSuccess) {
      getSupplier();
      handleClose();
    }
  };

  const cancelInvite = async () => {
    setUseLoader(true);
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `actionSupplierRequest`,
      {},
      { supplierId: currentId, actionType: currentStatus },
      "POST"
    );
    setUseLoader(false);
    if (isSuccess) {
      getSupplier();
    }
  };

  const getSupplier = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSupplier`,
      {},
      { type: "INVITED" },
      "GET"
    );
    setshowSkelton(false);
    if (isSuccess) {
      setSupplierList(data?.data?.reverse());
      setShowModal(false);
    }
  };

  const handleDeleteClick = (currentId, currentStatus) => {
    setShowModal(true);
    setCurrentId(currentId);
    setCurrentStatus(currentStatus);
  };

  const handleNoClick = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getSupplier();
  }, []);

  return (
    <>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <section className="inner_wraapper pt-3 px-3">
          <div className="hol_rell">
            <div className="steps-form">
              <div className="steps-row setup-panel hstack justify-content-between">
                <div className="tabs-top setting_admin my-0">
                  <ul>
                    <li>
                      <NavLink to="/supplier-management">
                        Registerd Suppliers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/invited-suppliers" className="activee">
                        Invited Suppliers{" "}
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <button
                  className="new_button_style_white me-1"
                  onClick={handleShow}
                >
                  Add Suppliers
                </button>
              </div>
            </div>
          </div>
          <div className="Introduction history__sections">
            {!showSkelton ? (
              supplierList && supplierList?.length > 0 ? (
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
                        <th style={{ width: 55 }}>Sr</th>
                        <th>Email</th>
                        <th>Company Name</th>
                        <th>Invited Date | Time</th>
                        <th style={{ width: 100, textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierList &&
                        supplierList.map((data, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{data?.email}</td>
                              <td>{data?.company_name}</td>
                              <td>
                                {new Date(data?.request_date).toLocaleString()}
                              </td>
                              <td>
                                <div className="hstack gap-3 justify-content-center">
                                  <i
                                    className="fas fa-retweet"
                                    title="Resend Invitation"
                                    onClick={() =>
                                      handleDeleteClick(data?.id, "RESNED")
                                    }
                                  ></i>
                                  {data?.status !== "CANCEL" && (
                                    <i
                                      className="fas fa-window-close"
                                      title="Cancel Invitation"
                                      style={{ color: "red" }}
                                      onClick={() =>
                                        handleDeleteClick(data?.id, "CANCEL")
                                      }
                                    ></i>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    style={{ opacity: 0.2 }}
                    src={NodataFound}
                    className="w-50"
                    alt="No Registered Supplier Here..."
                  />
                </div>
              )
            ) : (
              <Loader />
            )}
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
            <Form.Label>Add Supplier</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            className="mb-2"
            required
            type="email"
            placeholder="Email Id"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            required
            type="text"
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style__reject" onClick={handleClose}>
            Cancel
          </button>
          {useLoader ? (
            <button className="new_button_style" disabled>
              <Spinner animation="border" /> Add Supplier
            </button>
          ) : (
            <button className="new_button_style" onClick={() => sendInvite()}>
              Add Supplier
            </button>
          )}
        </Modal.Footer>
      </Modal>
      {showModal && (
        <Modal show={showModal} onHide={handleNoClick}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Form.Label>
                {currentStatus === "CANCEL" ? (
                  <>Cancel Confirmation?</>
                ) : (
                  <>Resend Confirmation?</>
                )}
              </Form.Label>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentStatus === "CANCEL" ? (
              <h5>Are you sure you want to Cancel the Invitation?</h5>
            ) : (
              <h5>Are you sure you want to Resend the Invitation?</h5>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="new_button_style__reject"
              onClick={handleNoClick}
            >
              No
            </button>
            {useLoader ? (
              <button className="new_button_style" disabled>
                <Spinner animation="border" />
              </button>
            ) : (
              <button
                className="new_button_style"
                onClick={() => cancelInvite()}
              >
                Yes
              </button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default InvitedSupplierManagement;
