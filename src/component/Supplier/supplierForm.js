import React, { Component } from "react";
import SupplierHeader from "../../component/header/supplierHeader";
import "../Company Admin/Setting/setting.css";
import SupplierFormPage from "./SupplierFormPage";
export default class supplierForm extends Component {
  render() {
    return (
      <div>
        <SupplierHeader />
        <div className="main_wrapper2">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="strp_progess">
                        <div className="hol_rell">
                          <div className="steps-form">
                            <div className="steps-row setup-panel"></div>
                          </div>
                        </div>
                      </div>
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          <div className="color_div_step div-color">
                            <div className="include">
                              <SupplierFormPage />
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
