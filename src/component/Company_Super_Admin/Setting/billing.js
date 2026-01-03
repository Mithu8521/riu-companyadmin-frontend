import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./billing.css";
import { profileService } from "../../../_services/admin/settingService";
import BillingFeatures from "./BillingFeatures";

export default class BillingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      activeModal: "",
      items: [],
      title: "",
      price: "",
      tier: "",
      values: [{ value: null }]
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.callApi = this.callApi.bind(this);
    this.callApi2 = this.callApi2.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
  }


  createUI() {
    return this.state.values.map((el, i) => (
      <div key={i}>
        <input
          type="text"
          value={el.value || ""}
          onChange={this.handleChangee.bind(this, i)}
        />
        <input
          type="button"
          value="remove"
          onClick={this.removeClick.bind(this, i)}
        />
      </div>
    ));
  }


  handleChangee(i, event) {
    let values = [...this.state.values];
    values[i].value = event.target.value;
    this.setState({ values });
  }

  addClick() {
    this.setState(prevState => ({
      values: [...prevState.values, { value: null }]
    }));
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }


  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({
      showModal: "",
      title: "",
      price: "",
      tier: "",
    });

  }

  handleChange2(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChange(event) {
    const { checked } = event.target;
    let id = event.target.getAttribute("data-id");
    let obj = {};
    obj._id = id;
    obj.status = checked;
    this.callApi(obj);
    setTimeout(() => {
      this.callApi2();
    }, 1000);
  }

  callApi(data) {
    profileService.updateSubscriptionStatus(data);
  }

  async callApi2() {
    return await profileService.getSubscriptionPlans();
  }

  async componentDidMount() {
    const response = await this.callApi2();
    this.setState({ items: response?.data });
  }

  async serverRequest() {
    const response = await this.callApi2();
    this.setState({ items: response?.data });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    let string = "";
    let ii = 1;
    this.state.values.forEach(element => {
      if (this.state.values.length === ii) {
        string += element.value
      } else {
        string += element.value + ","
      }
      ii++;
    });
    const { title, price, tier, } = this.state;
    let obj = {};
    obj.name = title;
    obj.amount = price;
    obj.plan = tier;
    obj.metaData = string;
    profileService.createSubscription(obj);
    setTimeout(() => {
      this.handleCloseModal()
      this.serverRequest()
    }, 2000);
  }

  render() {
    const { items } = this.state;
    return (
      <div>
        <section className="forms">
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="business_detail">
                <div className="heading pb-5">
                  <h4>Subscription Plan</h4>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-control select_subscription"
                        id="exampleFormControlSelect1"
                        placeholder="Monthly Plans"
                      >
                        <option>Monthly Plans</option>
                        <option>$185/ Month</option>
                        <option>$150/ Month</option>
                        <option>POA</option>
                      </select>
                    </div>
                  </form>
                </div>

                <div className="cards">
                  <div className="row justify-content-center">
                    {items.map((item, key) => (
                      <div key={key} className="col-lg-3 col-xs-12">
                        <div className="card-1">
                          <span className="tag">{item.title}</span>
                          <h4>
                            ${item.price}/ <span>{item.tier}</span>
                          </h4>
                          <h6>Feature Included:</h6>
                          <div className="data_card-1">
                            <ul>
                              <BillingFeatures data={item.metaData} />
                            </ul>
                          </div>
                          <div className="custom-switch">
                            <label className="switch">
                              <input
                                type="checkbox"
                                {...(item.isActive ? { checked: true } : {})}
                                data-id={item.id}
                                onChange={(e) => this.handleChange(e)}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="global_link w-100 my-5 d-flex justify-content-center">
                      <button
                        className="new_button_style"
                        variant="none"
                        onClick={() => this.handleOpenModal("login")}
                      >

                        ADD NEW SUBSCRIPTION PLAN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Modal
          animation={true}
          size="md"
          className="modal_box"
          shadow-lg="border"
          show={this.state.showModal && this.state.activeModal === "login"}
        >
          <div className="modal-lg">
            <Modal.Header className="pb-0">
              <Button variant="outline-dark" onClick={this.handleCloseModal}>
                <i className="fa fa-times"></i>
              </Button>
            </Modal.Header>
            <div className="modal-body vekp pt-0">
              <div className="row">
                <div className="col-md-12">
                  <div className="pb3">
                    <h4>Add Subscription Plan</h4>
                    <div className="forms">
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Subscription Plan Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Basic"
                            name="title"
                            value={this.state.title}
                            onChange={(e) => this.handleChange2(e)}
                          />
                        </div>
                        <div className="row my-3">
                          <div className="col-md-6 col-xs-12">
                            <div className="form-group">
                              <label
                                htmlFor="exampleFormControlInput1"
                                className="form-label"
                              >
                                Price/User
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                name="price"
                                value={this.state.price}
                                onChange={(e) => this.handleChange2(e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-xs-12">
                            <div className="form-group mt-2">
                              <label htmlFor="exampleFormControlSelect1"></label>
                              <select
                                className="form-control biling-menu"
                                id="exampleFormControlSelect1"
                                name="tier"
                                onChange={(e) => this.handleChange2(e)}
                              >
                                <option value={"year"}>Yearly</option>
                                <option value={"month"}>Monthly</option>
                                <option value={"week"}>Weekly</option>
                                <option value={"day"}>Daily</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label p-2"
                          >
                            Add Services Included
                          </label>
                          {this.state.values.map((el, i) => (
                            <div className="d-flex removeMeta" key={i}>
                              <input
                                type="text"
                                className="form-control biling-menu"
                                value={el.value || ""}
                                onChange={e => this.handleChangee(i, e)}
                              />
                              <i className="fa fa-trash" value="remove"
                                onClick={() => this.removeClick(i)}
                              ></i>
                            </div>
                          ))}
                          <input type="button" className="btn btn-primary page-wid" value="add more" onClick={() => this.addClick()} />
                        </div>

                        <div className="global_link mt-3 mx-0">
                          <button
                            type="button"
                            className="link_bal_next page_width"
                            onClick={this.handleCloseModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="page_save page_width mx-3"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
