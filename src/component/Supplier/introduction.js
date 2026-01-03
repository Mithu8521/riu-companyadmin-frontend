import React, { Component } from "react";
import SupplierHeader from "../../component/header/supplierHeader";
import { NavLink } from "react-router-dom";
import "../../component/Company Sub Admin/Pages/esg_reporting/esg_reporting.css";
export default class Introduction extends Component {
  render() {
    return (
      <>
        <SupplierHeader />
        <div className="main_wrapper2">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction2">
                        <div className="text_Parts">
                          <div className="d-flex justify-content-between">
                            <h5 className="motor">Introduction</h5>
                          </div>
                          <p className="specialize my-3">
                            Amet minim mollit non deserunt ullamco est sit
                            aliqua dolor do amet sint. Velit officia consequat
                            duis enim velit mollit. Exercitation veniam
                            consequat sunt nostrud amrcitation veniam consequat
                            suet.
                          </p>
                          <p className="specialize">
                            Integer id augue iaculis, iaculis orci ut, blandit
                            quam. Donec in elit auctor, finibus quam in,
                            pharetra ipsum. Duis ac nulla ac ipsum hendrerit
                            posuere vitae sed quam. Integer venenatis lacus
                            erat, nec euismod lorem ullamcorper vel. Donec
                            consectetur velit ante, id bibendum tellus mattis
                            ut. Morbi in lorem facilisis, ornare arcu at,
                            sodales lacus. Donec sollicitudin augue ut leo
                            accumsan, et bibendum metus blandit. Cras ac iaculis
                            felis, vitae pellentesque felis. Etiam scelerisque
                            eros ut nunc finibus ultrices.
                          </p>
                        </div>
                        <div className="text_ntroion">
                          <h5 className="frame">
                            Please click next to fill out the following survey:
                          </h5>
                        </div>
                        <div className="global_link mx-0">
                          <NavLink
                            to="/supplier/supplierForm"
                            className="new_button_style"
                          >
                            NEXT
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
    );
  }
}
