/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { Component } from "react";
import { Image } from "react-bootstrap";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import NoData from "../../../../img/no-data.png";

import "../../../sidebar/common.css";

export default class AudioCompaniesNoData extends Component {
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />

        <div className="main_wrapper">
          <div className="inner_wraapper pt-4">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <section className="forms">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="nodata_design">
                                <Image className="img-fluid" src={NoData} />
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
      </div>
    );
  }
}
