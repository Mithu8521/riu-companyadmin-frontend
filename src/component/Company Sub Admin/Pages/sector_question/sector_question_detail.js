import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Loader from "../../../loader/Loader";
import { NavLink } from "react-router-dom";
import DownloadLink from "react-download-link";

export default class sector_question_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        {this.state.isLoaded === true && <Loader />}
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="frameworks framwork_2">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="">
                              <h4 className="E_capital">Sector Question</h4> <hr></hr>
                              <div className="manag">
                                <h3 className="energy">asdgadsfuhsrtiujyt <span className="Font_flex_var" >Assign to: Roop Chandra</span></h3>
                                <textarea type="text" className="form-control form_height" placeholder="answer" value={"asdfasdioghiruefhg"}></textarea>
                                <DownloadLink label="Download Attachment" filename="One.csv" exportFile={""} />
                              </div>
                              <div className="global_link mt-4">
                                <NavLink className="new_button_style" to={"/sector_questions"} type="button" >
                                  Re-Submit Responses
                                </NavLink>
                                <span className="global_link">
                                  <NavLink className="new_button_style" to={"/audit_question_listing"} type="button" >
                                    Submit
                                  </NavLink>
                                </span>
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
