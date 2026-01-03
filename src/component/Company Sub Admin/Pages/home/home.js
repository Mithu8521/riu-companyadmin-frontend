import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Moment from "react-moment";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import config from "../../../../config/config.json";
import "./home.css";
import "react-circular-progressbar/dist/styles.css";
import ReactApexChart from "react-apexcharts";
import { apiCall } from "../../../../_services/apiCall";
// import GraphComponent from "./GraphComponent";

export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: [props.location.aboutProps] ?? [],
      isLoaded: true,
      finalIds: [],
      list: [],
      blogs: [],
      innovativeProgram: [],
      subInnovativeProgram: [],
      globalInnovativeProgram: [],
      limit: 10,
      skip: 0,
      seriesDataLength: 2,
      startDate: "",
      endDate: "",
      submitted: false,
      report_type: "",
      csvsubmitted: false,
      firstName: "",
      selectedFramework: [],
      lastName: "",
      graphTitle: "",
      frameworkValue: [],
      show: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      uuid: [],
      email: "",
      report: "STANDARD",
      companyName: "",
      totalPercentage: 0,
      percentageData: [],
      items: [],
      frameworkValueData: [],
      authValue: null,
      businessPerformance: 0,
      esgRiskManagement: 0,
      supplierRiskManagement: 0,
      carbonFootprint: 0,
      sustainableDevelopmentGoals: 0,
      businessPerformanceRecommendation: {},
      esgRiskManagementRecommendation: {},
      supplierRiskManagementRecommendation: {},
      carbonFootprintRecommendation: {},
      sustainableDevelopmentGoalsRecommendation: {},
      esgReportDownloadLink: "",
      // columns: columns,
    };
    this.getPoints = this.getPoints.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  handleClose = () => this.setState({ show: false });
  onFileChange = async (event) => {
    this.setState({ csvsubmitted: true });
    let topicId = event.target.getAttribute("data-id");
    const formData = new FormData();

    formData.append("csv", event.target.files[0], event.target.files[0].name);
    formData.append("supplier_management_criteria_ids", topicId);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    const { isSuccess, data } = await apiCall(
      config.OLD_API_URL + "supplierManagementCSV",
      {},
      formData,
      "POST"
    );
    if (isSuccess) {
      setTimeout(() => {
        const newLocal = "/supplier_management_detail";
        this.props.history.push(newLocal);
      }, 1000);
    }
  };
  async fetchGraphs(selectedOption) {
    const { isSuccess, data } = await apiCall(
      config.API_URL + "fetchGraphs",
      {},
      {
        question_type:
          selectedOption === "quantitative_trends"
            ? "quantitative_trends"
            : "tabular_question",
      },
      "GET"
    );
    if (isSuccess && data && data.data && data.data.length > 0) {
      const seriesData = data?.data;
      this.setState({
        seriesDataLength: seriesData,
      });
    } else {
      this.setState({
        errorMessage: "Invalid response",
      });
    }
  }

  getGraphs = () => {
    if (Array.isArray(this.state.seriesDataLength)) {
      return this.state.seriesDataLength.map((seriesData, index) => {
        const options = {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
              show: true,
            },
            zoom: {
              enabled: true,
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0,
                },
              },
            },
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10,
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: "13px",
                    fontWeight: 900,
                  },
                  formatter: function (val) {
                    return val.toFixed(2);
                  },
                },
              },
            },
          },
          xaxis: {
            categories: seriesData?.xaxis?.range,
            decimalInFloat: 2,
          },

          legend: {
            position: "right",
            offsetY: 40,
          },
          fill: {
            opacity: 1,
          },
        };
        return (
          <Col md={12} className="my-3 px-3" key={index}>
            <div className="box-of-all-chart">
              <div id={`chart-${index}`}>
                <ReactApexChart
                  options={options}
                  series={seriesData.series}
                  type="bar"
                  height={350}
                />
              </div>
              <div className="color_rent mb-0">
                <h6 className="color_rent_form">{seriesData.title}</h6>
              </div>
            </div>
          </Col>
        );
      });
    }
  };
  async getPoints() {
    const { isSuccess, data } = await apiCall(
      config.API_URL + "getTotalPoints",
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({
        businessPerformance: data?.points?.businessPerformance,
        esgRiskManagement: data?.points?.esgRiskManagement,
        supplierRiskManagement: data?.points?.supplierRiskManagement,
        carbonFootprint: data?.points?.carbonFootprint,
        sustainableDevelopmentGoals: data?.points?.sdg,
        businessPerformanceRecommendation: data?.points?.isRecommendated
          ?.businessPerformance
          ? JSON.parse(data?.points?.isRecommendated?.businessPerformance)
          : {},
        esgRiskManagementRecommendation: data?.points?.isRecommendated
          ?.esgRiskManagement
          ? JSON.parse(data?.points?.isRecommendated?.esgRiskManagement)
          : {},
        supplierRiskManagementRecommendation: data?.points?.isRecommendated
          ?.supplierRiskManagement
          ? JSON.parse(data?.points?.isRecommendated?.supplierRiskManagement)
          : {},
        carbonFootprintRecommendation: data?.points?.isRecommendated
          ?.carbonFootprint
          ? JSON.parse(data?.points?.isRecommendated?.carbonFootprint)
          : {},
        sustainableDevelopmentGoalsRecommendation: data?.points?.isRecommendated
          ?.sustainableDevelopmentGoals
          ? JSON.parse(
            data?.points?.isRecommendated?.sustainableDevelopmentGoals
          )
          : {},
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
  }

  getInnovativeProgrammes(uuid) {
    fetch(
      config.API_URL +
      `getInnovativeProgrammesByUUID/${uuid}?current_role=${localStorage.getItem(
        "role"
      )}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            innovativeProgram: result.innovativeProgram,
          });
        },
        (error2) => {
          this.setState({
            isLoaded2: true,
            error2,
          });
        }
      );
  }

  getInnovativeProgrammesbyUserIDForSubUsers(id) {
    fetch(
      config.API_URL +
      `getInnovativeProgrammesbyUserIDForSubUsers/${id}?current_role=${localStorage.getItem(
        "role"
      )}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            subInnovativeProgram: result.innovativeProgram,
          });
        },
        (error2) => {
          this.setState({
            isLoaded2: true,
            error2,
          });
        }
      );
  }
  handleDownload = async (url) => {
    console.log(url);
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      link.download = "filename";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  async downloadFile(pdfFilePath, fileName) {
    try {
      const response = await fetch(process.env.PUBLIC_URL + pdfFilePath);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    } catch (error) {
      console.error(`Error fetching the PDF file (${fileName}):`, error);
    }
  }

  async handleConfirm() {
    console.log(this.state.selectedFramework);
    const pdfFilePath1 = "/BRSR_Report.pdf";
    const pdfFilePath2 = "/Market_Intelligence.pdf";
    const pdfFilePath3 = "/BRSR Report.xlsx";
    // Use await when calling downloadFile
    const desiredId = 2;
    const foundObject = this.state.selectedFramework.find(
      (item) => item.id === desiredId
    );
    console.log();
    if (this.state.report_type === "EXCEL") {
      await this.downloadFile(pdfFilePath3, "BRSR Report.xlsx");
    } else {
      if (foundObject) {
        await this.downloadFile(pdfFilePath2, "Market_Intelligence.pdf");
      } else {
        await this.downloadFile(pdfFilePath1, "BRSR_Report.pdf");
      }
    }

    // ... rest of your code
  }
  getTotalPerformance() {
    let total =
      this.state.businessPerformance +
      this.state.esgRiskManagement +
      this.state.supplierRiskManagement +
      this.state.carbonFootprint +
      this.state.sustainableDevelopmentGoals;
    if (total <= 450) {
      return "Needs Improvement";
    } else if (total <= 800) {
      return "Average";
    } else if (total <= 1000) {
      return "Excellent";
    }
  }

  getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFinancialYear`,
      {},
      { type: "company", entity: "COMPANY" },
      "GET"
    );
    if (isSuccess) {
      this.setState({ financialYear: data.data });
    }
  };
  getFrameworkAnsweredQuestionPercentage = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}frameworkAnsweredQuestionPercentage`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({ percentageData: data.data });
    }
  };
  getAnsweredQuestionPercent = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getAnsweredQuestionPercent`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      console.log(" getAnsweredQuestionPercent", data.data);
      this.setState({ totalPercentage: data.data });
    }
  };
  async componentDidMount() {
    this.cancelPlane();
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    this.setState({ authValue });
    this.getFrameworkAnsweredQuestionPercentage();
    this.getAnsweredQuestionPercent();
    this.fetchGraphs();
    this.getPoints();
    const { isSuccess: isSuccessBlogs, data: blogsData } = await apiCall(
      config.API_URL + "blogs",
      {},
      {},
      "GET"
    );
    if (isSuccessBlogs) {
      this.setState({
        isLoaded: false,
        blogs: blogsData?.result,
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
    const { isSuccess: isSuccessPrograms, data: programsData } = await apiCall(
      config.API_URL + "getGlobalInnovativeProgrammes",
      {},
      {},
      "GET"
    );
    if (isSuccessPrograms) {
      this.setState({
        isLoaded2: true,
        globalInnovativeProgram: programsData.innovativeProgram,
      });
    } else {
      this.setState({
        isLoaded2: true,
      });
    }
  }

  async cancelPlane() {
    {
      const body = {
        email: "harshit@galaxycrop.com",
        company: "galax",
        message: "-",
        name: "Harshit Singh",
      };
      const { isSuccess, data, error } = await apiCall(
        config.AUTH_API_URL + `postContact`,
        { body },
        {},
        "POST"
      );

      // if (isSuccess) {
      //   this.getGlobalSubscriptionPlan();
      // }
    }
  }
  handleFinancialYearChange = async (e) => {
    const fId = e.target.value;
    await this.fetchStoredData(fId);
    this.setState({ financialYearId: fId });
  };
  fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "ALL" }
    );
    if (isSuccess) {
      console.log(data?.data, "data?.data");
      this.setState({
        frameworkValue: data?.data,
      });
      const modifiedOptions = data?.data.map((obj) => ({
        value: obj.id,
        label: obj.title,
      }));
      this.setState({ options: modifiedOptions });
    }
  };
  fetchStoredData = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getDataCompanyWise`,
      {},
      { type: "SQ", financial_year_id: fId },
      "GET"
    );
    if (isSuccess) {
      const companyFremWorkData = JSON.parse(
        data?.data?.framework_topic_kpi
      )?.framework_id;
      const filteredObjects = this.state.frameworkValue?.filter((obj) =>
        companyFremWorkData?.includes(obj.id)
      );
      this.setState({
        frameworkValueData: filteredObjects,
      });
    }
  };
  async downloadESGReport() {
    const { isSuccess, data } = await apiCall(
      config.API_URL + "generateReport",
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({ esgReportDownloadLink: data?.data?.data?.url });
    }
  }

  render() {
    const {
      seriesDataLength,
      percentageData,
      seriesMultiStake,
      businessPerformance,
      esgRiskManagement,
      supplierRiskManagement,
      carbonFootprint,
      sustainableDevelopmentGoals,
    } = this.state;

    const { list } = this.state;
    let weathers =
      list.map((item, keys) => {
        return (
          <tr key={keys}>
            <td>{keys + 1}</td>
            <td>{item.companyName}</td>
            <td>
              <Moment format="DD/MM/YYYY">{item.createdAt}</Moment>
            </td>
            <td>{item.followingCriteria}</td>
            <td>
              <span className="red bold center">
                {item.identified_risk === "High" && "High"}
              </span>
              <span className="green bold center">
                {item.identified_risk === "Low" && "Low"}
              </span>
              <span className="bold center">
                {item.identified_risk === "Medium" && "Medium"}
              </span>
            </td>
          </tr>
        );
      }) || "";

    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper p-3">
            <div className="color_div_Current mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="color_rent mb-0">
                  <h6 className="home_text">Download Your Full ESG Report</h6>
                </div>
                {/* {this.state.authValue?.is_head === 1 && ( */}
                <button
                  onClick={() => {
                    this.setState({ show: true });
                    this.getFinancialYear();
                    this.fetchFrameworkApi();
                    this.setState({ selectedFramework: [] });
                  }}
                  className="new_button_style"
                >
                  Download
                  {/* )} */}
                </button>
              </div>
            </div>
            {/* <GraphComponent /> */}
            <Modal size="md" show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Form.Label> ESG REPORT </Form.Label>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label
                        htmlFor="industryType"
                        className="mb-2 align-items-center"
                      >
                        Select Financial Year
                      </label>
                      <select
                        name="tab_name"
                        className="form-control input-height"
                        onChange={this.handleFinancialYearChange}
                      >
                        <option> Select Financial Year </option>
                        {this.state.financialYear?.map((item, key) => (
                          <option key={key} value={item.id}>
                            {item.financial_year_value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className=" mt-3">
                      <div className="form-group">
                        <label
                          htmlFor="industryType"
                          className="mb-2 align-items-center d-flex w-100"
                        >
                          File Type
                        </label>
                        <select
                          name="tab_name"
                          onChange={(e) =>
                            this.setState({
                              report_type: e.target.value,
                            })
                          }
                          className="form-control input-height"
                        >
                          <option> Select File Type </option>
                          <option value="EXCEL"> EXCEL </option>
                          <option value="PDF">PDF</option>
                        </select>
                      </div>
                    </div>
                    <div className=" mt-3">
                      <div className="form-group">
                        <label
                          htmlFor="industryType"
                          className="mb-2 align-items-center d-flex w-100"
                        >
                          Report Type
                        </label>
                        <select
                          name="tab_name"
                          onChange={(e) =>
                            this.setState({
                              report: e.target.value,
                            })
                          }
                          className="form-control input-height"
                        >
                          <option value="STANDARD"> STANDARD </option>
                          <option value="CUSTOM"> CUSTOM </option>
                        </select>
                      </div>
                    </div>
                    <div className=" mt-3">
                      <div className="form-group pb-3">
                        <label
                          htmlFor="industryType"
                          className="mb-2 align-items-center d-flex w-100"
                        >
                          Select Framework
                        </label>
                        <Multiselect
                          placeholder={"Select Framework"}
                          displayValue="title"
                          options={
                            this.state.report === "STANDARD" &&
                              this.state.frameworkValue.length > 0
                              ? [this.state.frameworkValue[0]]
                              : this.state.frameworkValue
                          }
                          selectedValues={this.state.selectedFramework}
                          // ref={this.multiselectRefTracker}
                          onRemove={(e) => {
                            this.setState({
                              selectedFramework: e || [],
                            });
                          }}
                          onSelect={(e) => {
                            this.setState({
                              selectedFramework: e || [],
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  className="new_button_style"
                  onClick={() => {
                    this.setState({
                      show: false,
                    });

                    this.handleConfirm();
                  }}
                >
                  Download
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
