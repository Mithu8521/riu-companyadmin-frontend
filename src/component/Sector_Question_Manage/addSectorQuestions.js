import React, { Component, Fragment } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { Form, InputGroup } from 'react-bootstrap';
import "./control.css";

export default class AddSectorQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: [{ heading: "", description: "" }]
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleChange1(i, e) {
    let formValues = this.state.formValues;
    formValues[i][e.target.heading] = e.target.value;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState(({
      formValues: [...this.state.formValues, { heading: "", description: "" }]
    }))
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(JSON.stringify(this.state.formValues));
  }

  render() {
    const { value } = this.state;
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
                      <div className="col-sm-12">
                        <div className="color_div_on framwork_2">
                          <div className="business_detail">
                            <div className="">
                              <div className="saved_cards">
                                <form name="form" onSubmit={this.handleSubmit}>
                                  <div className="business_detail">
                                    <div className="heading">
                                      <h4>Add Sector Questions</h4>
                                    </div>
                                    <hr className="line"></hr>
                                    <div className="row">
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Framework* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select Framework</option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Topic* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select Topic</option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select KPI* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select KPI</option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Entity* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select Entity</option>
                                            <option value="" title=""> For Company </option>
                                            <option value="" title=""> For Supplier </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Question Type* </label>
                                          <Fragment>
                                            <select onChange={this.handleChange} className="select_one industrylist">
                                              <option hidden disabled selected> Select Question Type</option>
                                              <option value="" title=""> Qualitative  </option>
                                              <option value="" title=""> Yes/No </option>
                                              <option value="" title=""> Quantitative </option>
                                              <option value="quantitativeTrends"> Quantitative Trands</option>
                                              <option value="" title=""> Tabular Question </option>
                                            </select>
                                            {value === "quantitativeTrends" ?
                                              <div className="Quantative_Sector mt-2">
                                                <div className="Quantative_Sector_one">
                                                  <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                                    <p className="Quantative_Title">DIESEL</p>
                                                    <div>
                                                      <input className="p-2 opacity-50" type="date" id="" name="" />
                                                      <span className="px-2"> to</span>
                                                      <input className="p-2 opacity-50" type="date" id="" name="" />
                                                    </div>
                                                  </div>
                                                  <hr></hr>
                                                  <p className="energy">Source</p>
                                                  <Form.Select aria-label="Default select example p-5" className="mb-3">
                                                    <option hidden>Please Select the Source</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                  </Form.Select>
                                                  <p className="energy">Process</p>
                                                  <Form.Select aria-label="Default select example" className="mb-3">
                                                    <option hidden>Please Select the Process</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                  </Form.Select>
                                                  <p className="energy">Reading value</p>
                                                  <InputGroup className="mb-3">
                                                    <Form.Control type="number" style={{ width: "70%" }} aria-label="first_input" />
                                                    <select name="tab_name" id="" className="select_one industrylist" style={{ width: "30%" }}>
                                                      <option hidden disabled selected> Select Value</option>
                                                      <option value="" title=""> kiloleter (kl)</option>
                                                      <option value="" title=""> kiloleter (kl)</option>
                                                      <option value="" title=""> kiloleter (kl)</option>
                                                      <option value="" title=""> kiloleter (kl)</option>
                                                    </select>
                                                  </InputGroup>
                                                  <p className="energy">Note</p>
                                                  <Form.Control className="mb-3" as="textarea" placeholder="Leave a Note here" style={{ height: '100px' }} />
                                                  <p className="energy">Attachment</p>
                                                  <Form.Group controlId="formFile" className="mb-3">
                                                    <Form.Control type="file" />
                                                  </Form.Group>
                                                </div>
                                              </div>
                                              : ""}
                                          </Fragment>
                                        </div>
                                      </div>
                                    </div>
                                    {this.state.formValues.map((element, index) => (
                                      <div className="form-inline" key={index}>
                                        <label htmlFor="title" className="mb-2 mt-2" > Question Heading </label>
                                        <input type="text" name="text" className="form-control py-3" placeholder="Enter Question Heading or Leave This Options" onChange={e => this.handleChange1(index, e)} />
                                        <label htmlFor="question" className="mb-2 mt-2" > Sector Question* </label>
                                        <textarea type="text" name="text" className="form-control" placeholder="Write Sector Question title" onChange={e => this.handleChange1(index, e)} />
                                        {
                                          index ?
                                            <button type="button" className="remove new_button_style mt-2" onClick={() => this.removeFormFields(index)}>Remove</button>
                                            : null
                                        }
                                      </div>
                                    ))}
                                  </div>
                                  <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                    <div className="global_link mx-0 my-3">
                                      <button type="button" className="new_button_style add" onClick={() => this.addFormFields()}> ADD More </button>
                                    </div>
                                    <div className="global_link mx-0 my-3">
                                      <button type="submit" className="new_button_style" > ADD Now </button>
                                    </div>
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
}
