import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import ellipse from "../../../img/Ellipse 37.png";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import e1 from "../../../img/e1.png";
import e2 from "../../../img/e2.png";
import e3 from "../../../img/e3.png";
import Edit from '../../../../img/edit.png'
import Delete from '../../../../img/delete.png'
import "../../Company Admin/Setting/setting.css";
import config from "../../../config/config.json";
const baseURL = config.baseURL;

export default class SupplierDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      country: false,
      industry: false,
      category: false,
      activeModal: "",
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }
  render() {
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          <div className="color_div_step">
                            <div className="include">
                              <div className="row forms">
                                <div className="heading">
                                  <h4>Sub Admin Details</h4>
                                  <div className="text-right index">
                                    <span>
                                      <img src={Edit} alt="" className="mx-2 icon-image" srcSet="" />
                                    </span>
                                    <span>
                                      <img src={Delete} alt="" className="mx-2 icon-image" srcSet="" />
                                    </span>
                                    <div className="impa ml-3">
                                      <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <hr className="line mt-3"></hr>
                                <div className="col-md-8 col-xs-12">
                                  <form>
                                    <div className="business_detail">
                                      <div className="row my-3">
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              First Name
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="John"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Last Name
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="Doe"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Title or Position
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="CRO"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Corporate Email
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="johndoe@esg.com"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-12 col-xs-12">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Password
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="johndoe@esg.com"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                                <div className="col-lg-4 col-xs-12">
                                  <div className="upload_image">
                                    <img
                                      className="file-upload-image"
                                      src={ellipse}
                                      alt=""
                                    />
                                    <input
                                      className=""
                                      type="file"
                                      onChange="readURL(this);"
                                      accept="image/*"
                                    />
                                  </div>
                                  <div className="text-outside">
                                    <p>ID: 356DS543</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="color_div_step mt-3">
                            <div className="include">
                              <div className="row">
                                <div className="saved_cards business_detail">
                                  <div className="heading">
                                    <div className="heading_wth_text">
                                      <div className="d-flex">
                                        <span className="global_link mx-0">
                                          <button
                                            className="new_button_style"
                                            variant="none"
                                            onClick={() =>
                                              this.handleOpenModal("login")
                                            }
                                          >

                                            ADD NEW COMPANY
                                          </button>
                                        </span>
                                        <span className="global_link mx-3">
                                          <button className="new_button_style">
                                            <i className="fas fa-upload white" />
                                          </button>
                                        </span>
                                        <span className="global_link mx-0">
                                          <button className="new_button_style">
                                            <i className="fas fa-sort-amount-up-alt white" />
                                          </button>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="form-group has-search one">
                                      <span className="fa fa-search form-control-feedback"></span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th>ID</th>
                                        <th>COMPANY NAME</th>
                                        <th>
                                          COUNTRY
                                          <span>
                                            <i
                                              className="fad fa-sort-amount-up mx-3"
                                              variant="none"
                                              onClick={() =>
                                                this.handleOpenModal("country")
                                              }
                                            ></i>
                                          </span>
                                        </th>
                                        <th>BUSINESS NUMBER</th>
                                        <th>
                                          INDUSTRY
                                          <span>
                                            <i
                                              className="fad fa-sort-amount-up mx-3"
                                              variant="none"
                                              onClick={() =>
                                                this.handleOpenModal("industry")
                                              }
                                            ></i>
                                          </span>
                                        </th>
                                        <th>
                                          CATEGORY
                                          <span>
                                            <i
                                              className="fad fa-sort-amount-up mx-3"
                                              variant="none"
                                              onClick={() =>
                                                this.handleOpenModal("category")
                                              }
                                            ></i>
                                          </span>
                                        </th>
                                        <th>STATUS</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>1</td>
                                        <td>Bosch</td>
                                        <td>Denmark</td>
                                        <td>+46 706723440</td>
                                        <td>Legal</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="red"
                                          >
                                            Inactive
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td>Maytag</td>
                                        <td>Belgium</td>
                                        <td>+46 736777790</td>
                                        <td>Manufacturing</td>
                                        <td>Business Account</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td>GE</td>
                                        <td>Tanzania</td>
                                        <td>+46 734569087</td>
                                        <td>Marketing</td>
                                        <td>Business Account</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td>Frigidair</td>
                                        <td>Finland</td>
                                        <td>+46 734569087</td>
                                        <td>Int. Development</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="red"
                                          >
                                            Inactive
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>5</td>
                                        <td>Hair</td>
                                        <td>Marshall Islands</td>
                                        <td>+46 702244779</td>
                                        <td>Environment</td>
                                        <td>Business Account</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>6</td>
                                        <td>Master Forge</td>
                                        <td>Bolivia</td>
                                        <td>+46 702244779</td>
                                        <td>Pharma</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>7</td>
                                        <td>Hotpoint</td>
                                        <td>Spain</td>
                                        <td>+46 737895421</td>
                                        <td>Property</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>8</td>
                                        <td>Allen+Roth</td>
                                        <td>Mali</td>
                                        <td>+46 702244779</td>
                                        <td>Business</td>
                                        <td>Business Account</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>9</td>
                                        <td>Electrolux</td>
                                        <td>Singapore</td>
                                        <td>+46 736777790</td>
                                        <td>Health</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>10</td>
                                        <td>Utilitech</td>
                                        <td>Yemen</td>
                                        <td>+46 706723440</td>
                                        <td>Consumer Tech</td>
                                        <td>Partner</td>
                                        <td>
                                          <NavLink
                                            to="/admin/StatusDetail"
                                            className="green"
                                          >
                                            Active
                                          </NavLink>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <div className="pagination_billing justify-content-between">
                                    <ul>
                                      <li>
                                        <NavLink to="">
                                          <span>
                                            <i className="fal fa-arrow-left mx-3"></i>
                                          </span>
                                          Back
                                        </NavLink>
                                      </li>
                                      <li>
                                        <NavLink to="">
                                          Showing 1-10 of 1023
                                        </NavLink>
                                      </li>
                                      <li className="justify-align-right">
                                        <NavLink to="">
                                          Next
                                          <span>
                                            <i className="fal fa-arrow-right mx-3"></i>
                                          </span>
                                        </NavLink>
                                      </li>
                                    </ul>
                                  </div>
                                  <Modal
                                    animation={true}
                                    size="md"
                                    className="modal_box"
                                    shadow-lg="border"
                                    show={
                                      this.state.showModal &&
                                      this.state.activeModal === "login"
                                    }
                                  >
                                    <div className="modal-lg">
                                      <Modal.Header className="pb-0">
                                        <Button
                                          variant="outline-dark"
                                          onClick={this.handleCloseModal}
                                        >
                                          <i className="fa fa-times"></i>
                                        </Button>
                                      </Modal.Header>
                                      <div className="modal-body vekp pt-0">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="pb3">
                                              <h4>Add New Company</h4>
                                              <div className="dropdown">
                                                <label
                                                  htmlFor="exampleFormControlInput1"
                                                  className="form-label"
                                                >
                                                  Enter user's email address
                                                  below to send sign up invite
                                                </label>
                                                <input
                                                  className="btn btn-secondary dropdown-toggle my-3"
                                                  href="#"
                                                  role="button"
                                                  id="dropdownMenuLink"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                  placeholder="John Cooper"
                                                />
                                                <div
                                                  className="dropdown-menu border-0 shadow"
                                                  aria-labelledby="dropdownMenuLink"
                                                >
                                                  <ul>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e1}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e2}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e3}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e1}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e2}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e3}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                    <li>
                                                      <NavLink
                                                        className="dropdown-item py-2 px-0"
                                                        to="/"
                                                      >
                                                        <div className="form-check check-form d-flex">
                                                          <div className="form-d">
                                                            <img
                                                              src={e1}
                                                              alt=""
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor="exampleRadios1"
                                                            >

                                                              John Cooper
                                                            </label>
                                                          </div>
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="exampleRadios"
                                                            id="exampleRadios1"
                                                            value="option1"
                                                          />
                                                        </div>
                                                      </NavLink>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                              <div className="cenlr">
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  SEND
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>

                                  <Modal
                                    animation={true}
                                    size="md"
                                    className="modal_box"
                                    shadow-lg="border"
                                    show={
                                      this.state.showModal &&
                                      this.state.activeModal === "industry"
                                    }
                                  >
                                    <div className="modal-lg">
                                      <Modal.Header className="pb-0">
                                        <Button
                                          variant="outline-dark"
                                          onClick={this.handleCloseModal}
                                        >
                                          <i className="fa fa-times"></i>
                                        </Button>
                                      </Modal.Header>
                                      <div className="modal-body vekp pt-0">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="pb4">
                                              <div className="py-3">
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: A - Z
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: Z - A
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                              </div>

                                              <div className="input-group mb-3">
                                                <span className="fa fa-search form-control-feedback search-icon"></span>
                                                <input
                                                  type="text"
                                                  className="form-control dropdown-toggle"
                                                  data-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  placeholder="Search"
                                                />
                                                <div className="dropdown-menu">
                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>
                                                      Asset Management & Custody
                                                      Activities
                                                    </span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>

                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>
                                                      Commercial Banks
                                                    </span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>

                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>
                                                      Consumer Finance
                                                    </span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="cenlr">
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  CLEAR
                                                </button>
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  APPLY
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>

                                  <Modal
                                    animation={true}
                                    size="md"
                                    className="modal_box"
                                    shadow-lg="border"
                                    show={
                                      this.state.showModal &&
                                      this.state.activeModal === "category"
                                    }
                                  >
                                    <div className="modal-lg">
                                      <Modal.Header className="pb-0">
                                        <Button
                                          variant="outline-dark"
                                          onClick={this.handleCloseModal}
                                        >
                                          <i className="fa fa-times"></i>
                                        </Button>
                                      </Modal.Header>
                                      <div className="modal-body vekp pt-0">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="pb4">
                                              <div className="py-3">
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: A - Z
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: Z - A
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                              </div>

                                              <div className="input-group mb-3">
                                                <span className="fa fa-search form-control-feedback search-icon"></span>
                                                <input
                                                  type="text"
                                                  className="form-control dropdown-toggle"
                                                  data-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  placeholder="Search"
                                                />
                                                <div className="dropdown-menu">
                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>Partner</span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>

                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>
                                                      Business Account
                                                    </span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="cenlr">
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  CLEAR
                                                </button>
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  APPLY
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>

                                  <Modal
                                    animation={true}
                                    size="md"
                                    className="modal_box"
                                    shadow-lg="border"
                                    show={
                                      this.state.showModal &&
                                      this.state.activeModal === "country"
                                    }
                                  >
                                    <div className="modal-lg">
                                      <Modal.Header className="pb-0">
                                        <Button
                                          variant="outline-dark"
                                          onClick={this.handleCloseModal}
                                        >
                                          <i className="fa fa-times"></i>
                                        </Button>
                                      </Modal.Header>
                                      <div className="modal-body vekp pt-0">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="pb4">
                                              <div className="py-3">
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: A - Z
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                                <div className="form-check-inline">
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckChecked"
                                                  >

                                                    Sort: Z - A
                                                  </label>
                                                  <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    name="inlineRadioOptions"
                                                    id="inlineRadio1"
                                                    value="option1"
                                                  />
                                                </div>
                                              </div>

                                              <div className="input-group mb-3">
                                                <span className="fa fa-search form-control-feedback search-icon"></span>
                                                <input
                                                  type="text"
                                                  className="form-control dropdown-toggle"
                                                  data-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  placeholder="Search"
                                                />
                                                <div className="dropdown-menu">
                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>Afghanistan</span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>

                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>Albania</span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>

                                                  <div className="dropdown-item form d-flex justify-content-between">
                                                    <span>Algeria</span>
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="radioNoLabel"
                                                      id="radioNoLabel1"
                                                      value=""
                                                      aria-label="..."
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="cenlr">
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  CLEAR
                                                </button>
                                                <button
                                                  className="page_save page_width"
                                                  to="#"
                                                >
                                                  APPLY
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>
                                </div>
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
}
