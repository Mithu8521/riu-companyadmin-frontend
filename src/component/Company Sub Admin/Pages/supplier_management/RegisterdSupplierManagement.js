import React, { useEffect, useState } from "react";
import Header from "../../../header/header";
import Sidebar from "../../../sidebar/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Col, Modal, Row, Spinner, Table } from "react-bootstrap";
import ToggleButton from "react-toggle-button";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import Loader from "../../../loader/Loader";
import NodataFound from "../../../../img/no.png";

const RegisterdSupplierManagement = () => {
  const location = useLocation();
  const [supplierList, setSupplierList] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showSkelton, setshowSkelton] = useState(false);
  const [enable, setEnable] = useState();
  const [showModal, setShowModal] = useState(false);
  const [useLoader, setUseLoader] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleToggle = (id, status) => {
    setEnable(!status);
    setShowModal(true);
    setCurrentId(id);
  };

  const getSupplier = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSupplier`,
      {},
      { type: "REGISTERED" },
      "GET"
    );
    setshowSkelton(false);
    if (isSuccess) {
      setSupplierList(data?.data?.reverse());
      const initialSelectedItem = data?.data[0];
      setSelectedRow(initialSelectedItem);
    }
  };

  const actionSupplierRegistered = async () => {
    setUseLoader(true);
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `actionRegisteredSupplier`,
      {},
      { supplierId: currentId, actionType: enable ? "ACTIVE" : "DEACTIVE" },
      "POST"
    );
    setUseLoader(false);
    if (isSuccess) {
      getSupplier();
      setShowModal(false);
    }
  };
  const handleRowClick = () => {
    setSelectedRow();
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
        <section className="inner_wraapper px-3 pt-3">
          <div className="hol_rell">
            <div className="steps-form">
              <div className="steps-row setup-panel">
                <div className="tabs-top setting_admin my-0">
                  <ul>
                    <li>
                      <NavLink to="/supplier-management" className="activee">
                        Registerd Suppliers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/invited-suppliers">
                        Invited Suppliers
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="Introduction history__sections">
            {!showSkelton ? (
              supplierList && supplierList?.length > 0 ? (
                <Row>
                  <Col md={7} style={{ borderRight: "1px solid #bdc1c9" }}>
                    <div className="table_setting">
                      <Table striped bordered hover className="m-0">
                        <thead>
                          <tr className="fixed_tr_section">
                            <th style={{ width: 55 }}>Sr</th>
                            <th>Company Name</th>
                            <th>Business No.</th>
                            <th>City</th>
                            <th style={{ width: 55 }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplierList &&
                            supplierList.map((data, index) => {
                              return (
                                <tr
                                  key={index}
                                  style={{
                                    background:
                                      selectedRow === data
                                        ? "rgb(31 158 209 / 35%)"
                                        : "",
                                    cursor: "pointer",
                                  }}
                                >
                                  <td
                                    onClick={() => handleRowClick(data)}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td onClick={() => handleRowClick(data)}>
                                    {data?.company_name}
                                  </td>
                                  <td onClick={() => handleRowClick(data)}>
                                    {data?.businessNumber}
                                  </td>
                                  <td onClick={() => handleRowClick(data)}>
                                    {JSON.parse(data?.companyLocation)?.city}
                                  </td>
                                  <td>
                                    <ToggleButton
                                      value={data?.status}
                                      onToggle={() =>
                                        handleToggle(data?.id, data?.status)
                                      }
                                    >
                                      {data?.status === 1
                                        ? "Active"
                                        : "Inactive"}
                                    </ToggleButton>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  <Col md={5}>
                    <div className="table_setting">
                      <Table striped bordered hover>
                        {selectedRow && (
                          <>
                            <thead>
                              <tr className="fixed_tr_section">
                                <th style={{ width: 100 }}>Attribute</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>First name</td>
                                <td>{selectedRow?.firstName}</td>
                              </tr>
                              <tr>
                                <td>Last Name</td>
                                <td>{selectedRow?.lastName}</td>
                              </tr>
                              <tr>
                                <td>Email</td>
                                <td>{selectedRow?.email}</td>
                              </tr>
                              <tr>
                                <td>Designation</td>
                                <td>{selectedRow?.position}</td>
                              </tr>
                            </tbody>
                          </>
                        )}
                      </Table>
                      <Table striped hover bordered className="m-0">
                        {selectedRow && (
                          <>
                            <thead>
                              <tr className="fixed_tr_section">
                                <th>Company Address</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {
                                    JSON.parse(selectedRow?.companyLocation)
                                      ?.area
                                  }
                                  {", "}
                                  {
                                    JSON.parse(selectedRow?.companyLocation)
                                      ?.city
                                  }
                                  {", "}
                                  {
                                    JSON.parse(selectedRow?.companyLocation)
                                      ?.state
                                  }
                                  {", "}
                                  {
                                    JSON.parse(selectedRow?.companyLocation)
                                      ?.country
                                  }
                                  {", "}
                                  {
                                    JSON.parse(selectedRow?.companyLocation)
                                      ?.zipCode
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </>
                        )}
                      </Table>
                    </div>
                  </Col>
                </Row>
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
      {showModal && (
        <Modal show={showModal} onHide={handleNoClick}>
          <Modal.Header closeButton>
            <Modal.Title>
              {console.log(enable)}
              {enable ? (
                <>Activate Confirmation?</>
              ) : (
                <>Deactivate Confirmation?</>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {enable ? (
              <h5>Are you sure you want to Active your supplier status?</h5>
            ) : (
              <h5>Are you sure you want to Deactivate your supplier status?</h5>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleNoClick}>
              No
            </Button>
            {useLoader ? (
              <Button variant="info" disabled>
                <Spinner animation="border" />
              </Button>
            ) : (
              <Button variant="info" onClick={actionSupplierRegistered}>
                Yes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default RegisterdSupplierManagement;
