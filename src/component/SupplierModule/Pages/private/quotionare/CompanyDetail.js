import React from "react";
import Sidebar from "../../../../sidebar/sidebar";
import Header from "../../../../header/header";
import './companyDetail.css';

export default function CompanyDetail() {
  return (
    <div>
      <Sidebar />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  {/* <div className="col-sm-12">bgijuh</div> */}
                  <div className="col-sm-12">
                    <div className="color_div_on framwork_2">
                      <div className="business_detail">
                        <div className="heading"><h4>Company Detail</h4></div>
                        <hr className="line"></hr>
                        <div className="data__section">
                          <div className="Data__Wrapper">
                            <div className="data__label">Company name</div>
                            <div className="data__value">RIU pvt</div>
                          </div>

                          <div className="Data__Wrapper">
                            <div className="data__label">Main Country of Operations</div>
                            <div className="data__value">Iran, India, Japan</div>
                          </div>

                          <div className="Data__Wrapper">
                            <div className="data__label">Business Number</div>
                            <div className="data__value">12345676</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">COUNTRY</div>
                            <div className="data__value">India</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">Number Of User</div>
                            <div className="data__value">50</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">Title of Position</div>
                            <div className="data__value">Founder/Business Owner/CEO</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">Corporate Email</div>
                            <div className="data__value">use@gmail.com</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">User ID</div>
                            <div className="data__value">35646</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">INDUSTRY</div>
                            <div className="data__value">Apparel, Accessories & Footwear</div>
                          </div>
                          <div className="Data__Wrapper">
                            <div className="data__label">CATEGORY</div>
                            <div className="data__value">Business Account</div>
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