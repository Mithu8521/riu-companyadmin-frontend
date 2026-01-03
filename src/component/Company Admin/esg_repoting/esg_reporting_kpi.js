import "./esg_reporting_pie.css";
import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { NavLink } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { DataContext } from "../../../contextApi";
import axios from "axios";
import config from "../../../config/config.json";

export default class esgReportingKpi extends Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: props.location,
      show: false,
      close: false,
      kpiData: [],
      slectedkpiList: [],
      checked: false,
      selectedKpiMappingIds: [this.context?.selectedKpiMappingData],
    };
  }
  componentDidMount = () => {
    this.fetchKpiData();
  };

  fetchKpiData = () => {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    axios
      .get(
        `${config.API_URL
        }admin/getKpi?company_id=${localStorage.getItem(
          "user_temp_id"
        )}&topic_ids=${JSON.stringify(this.context.selectedTopicsData)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        this.setState({ kpiData: response?.data?.data });
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const filteredKPIs = response.data.data.filter((kpiObj) => {
            return this.context.SelectedKpiData.find((value) => {
              return value === kpiObj.id;
            });
          });
          if (filteredKPIs && filteredKPIs.length > 0) {
            const kpiIds = filteredKPIs.map(({ id }) => id);
            this.setState({ slectedkpiList: kpiIds });
            this.context.SelectedKpiData(kpiIds);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSelect = (event, kpiObj) => {
    if (event.target.checked) {
      const kpiIds = [...this.state.slectedkpiList, kpiObj?.id];
      const kpiMappingIds = [
        ...this.context.SelectedKpiData,
        kpiObj?.id,
      ];
      this.setState({
        slectedkpiList: kpiIds,
        selectedKpiMappingIds: kpiMappingIds,
      });
      this.context.setSelectedKpiData(kpiIds);
      this.context.setSelectedKpiMappingData(kpiMappingIds);
    } else {
      const filteredIds = this.state.slectedkpiList.filter(
        (value) => value !== kpiObj.id
      );
      const filteredMappingIds = this.context.selectedKpiMappingData.filter(
        (value) => value !== kpiObj.id
      );
      this.setState({
        slectedkpiList: filteredIds,
        selectedKpiMappingIds: filteredMappingIds,
      });
      this.context.setSelectedKpiData(filteredIds);
      this.context.setSelectedKpiMappingData(filteredMappingIds);
    }
  };
  handleConfirm = () => {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    const data = {
      data: {
        kpi_id: this.context?.SelectedKpiData,
        topic_id: this.context?.selectedTopicsData,
        framework_id: this.context?.selectedFrameworkData,
      },
      company_id: localStorage.getItem("user_temp_id"),
      current_role: localStorage.getItem("role"),
    };
    axios
      .post(`${config.API_URL}saveDataCompanyWise`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((data) => console.log("data", data))
      .catch((error) => console.log("error", error));
  };

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
                      <div className="color_div_on framwork_2">
                        <h5 className="frame">
                          Please select KPIs you want to use:
                        </h5>
                        <div className="Global">
                          <div className="row">
                            <div className="col-sm-12 col-xs-12">
                              <div className="border_box p-3">
                                <div className="wel_fel">
                                  <div className="row">
                                    {this.state.kpiData.map((data, index) => {
                                      const dataFlag =
                                        this.context.SelectedKpiData &&
                                        this.context.SelectedKpiData.some(
                                          (value) =>
                                            value === data.id
                                        );
                                      return (
                                        <div
                                          key={index}
                                          className="col-xxl-6 col-lg-6 col-md-12 col-12"
                                        >
                                          <div className="Global_text">
                                            <div className="form-check form-check-inline clobal_check input-padding">
                                              <input
                                                className="form-check-input input_one "
                                                // name="frameworksUsed[]"
                                                type="checkbox"
                                                checked={dataFlag}
                                                onChange={(e) => {
                                                  this.handleSelect(e, data);
                                                }}
                                              />
                                              <label
                                                className="form-check-label label_one"
                                                htmlFor={"xcfgvldskfjgosdfg"}
                                              >
                                                {data.title}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="Ethics my-3" />
                        <div className="global_link mt-4">
                          <span className="global_link">
                            <button className="link_bal_next"> Back </button>
                          </span>
                          <div className="save_global global_link">
                            <button
                              className="page_save page_width mx-3"
                              variant="none"
                              onClick={() => {
                                this.setState({ show: true });
                                this.handleConfirm();
                              }}
                            >
                              {" "}
                              Confirm{" "}
                            </button>
                          </div>
                          <Modal
                            show={this.state.show}
                            animation={true}
                            size="md"
                            className="modal_box"
                            shadow-lg="border"
                          >
                            <div className="modal-md">
                              <Modal.Header className="pb-0">
                                <Button
                                  variant="outline-dark"
                                  onClick={() => this.setState({ show: false })}
                                >
                                  <i className="fa fa-times"></i>
                                </Button>
                              </Modal.Header>
                              <div className="modal-body vekp pt-0">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="response">
                                      <h4>Response Saved!</h4>
                                      <p className="text-center my-3">
                                        {" "}
                                        To download your ESG Risk Report please
                                        complete the Sector Questions and
                                        download at the completion of that
                                        module.{" "}
                                      </p>
                                      <div className="global_link">
                                        <NavLink
                                          className="page_save page_width"
                                          to={"sector_questions"}
                                        >
                                          {" "}
                                          go to sector questions{" "}
                                        </NavLink>
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
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
