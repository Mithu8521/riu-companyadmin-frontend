import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { NavLink, useLocation } from "react-router-dom";
import { SectorQuestionFrameworkWise } from "../../../Sector_Question_Manage/sectorQuestionindustrywise";

export default function SupplierAssessmentQuestionList(props) {
  console.log(props?.location?.state?.data, "datadatadata");
  const location = useLocation();

  return (
    <div>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <section className="inner_wraapper px-3 pt-3">
          <div
            className="color_div_on steps-form"
            style={{ overflow: "hidden" }}
          >
            <div className="steps-row setup-panel">
              <div className="tabs-top setting_admin my-0">
                <ul>
                  <li>
                    <NavLink to={"/supplier_assessment"}>
                      Supplier Assesment Lististing
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"/supplier_assessment_question_list"}
                      className="activee"
                    >
                      Supplier Question List
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Introduction">
            <div className="question_section">
              <SectorQuestionFrameworkWise
                module="VIEW_SUPPLIER_QUESTION_LIST"
                financial_year_id={props?.location?.state?.data}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
