import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// import { Image } from "react-bootstrap";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../Pages/management/management.css";
import Table from "react-bootstrap/Table";
// import { Form } from "react-bootstrap";
// import Clip from "../../../../img/clip.svg";
// import edit from "../../../../img/pencil.svg";
// import trash from "../../../../img/trash.svg";
import "../../../sidebar/common.css";
// import AssignSubAdminComponent4 from "../SmallComponents/assignSubAdmin4";
// import { Button, Modal } from "react-bootstrap";
import './audit_section.css';
import View from '../../../../img/view.png'

export default class AuditSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: props.location,
      show: false,
      close: false,
    };
  }
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} Defaults="0" />
        <div className="main_wrapper">
          <div className="question_type_filter">
            <NavLink to="/audit_question_listing" > Company </NavLink>
            <NavLink to="/audit_supplier" className="selected_question_type">Supplier</NavLink>
          </div>
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <section className="forms">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="business_detail">
                                <div className="heading">
                                  <h4>Supplier Listing</h4>
                                  <div className="form-group has-search one">
                                    <span className="fa fa-search form-control-feedback audit_line_height"></span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Search Supplier Name"
                                      name="search"
                                      onChange={(e) =>
                                        this.applyGlobalSearch(e)
                                      }
                                    />
                                  </div>
                                </div>
                                <hr className="line"></hr>
                              </div>
                              <div className="table_f">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th>Sr.</th>
                                      <th>Supplier List</th>
                                      <th>Purpose</th>
                                      <th>Recieve Date</th>
                                      <th style={{ width: "5%" }}>View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Roop Chandra</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink className="non_underline_link bold view_c" to="/audit_supplier_question_listing"><img src={View} alt="" /></NavLink>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* <Modal show={this.state.show} animation={true} size="md" className="modal_box" shadow-lg="border" >
          <div className="modal-lg">
            <Modal.Header className="pb-0">
              <Button variant="outline-dark" onClick={() => this.setState({ show: false })} >
                <i className="fa fa-times"></i>
              </Button>
            </Modal.Header>
            <div className="modal-body vekp pt-0">
              <div className="row">
                <div className="col-md-12">
                  <div className="response">
                    <h4>Add Remarks</h4>
                    <div className="form-group audit-re">
                      <label for="message-text" className="col-form-label">Please submit your remarks here</label>
                      <textarea className="form-control" id="message-text"></textarea>
                    </div>
                    <div className="global_link">
                      <NavLink className="page_save page_width" to={"sector_questions"} > Submit </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal> */}
      </div>
    );
  }
}
