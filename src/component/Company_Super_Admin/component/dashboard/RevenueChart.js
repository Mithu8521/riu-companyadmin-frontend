import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { NavLink } from 'react-router-dom';
const currentUser = authenticationService.currentUserValue;

export default class RevenueChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      reload: false,
      filter: "YEAR",
      groupBy: "MONTH",
      totalAmount: 0,
      series: [
        {
          name: "This Year",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Product Trends by YEAR",
          align: "left",
        },
        markers: {
          hover: {
            sizeOffset: 1,
          },
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
        },
      },
    };

    this.onClick = this.onClick.bind(this)
    this.serverRequest = this.serverRequest.bind(this)
  }




  onClick(filterr) {
    let setFilter
    let setGroupBy
    if (filterr === 'YEAR') {
      setFilter = "YEAR";
      setGroupBy = "MONTH"
    }
    else if (filterr === 'MONTH') {
      setFilter = "MONTH";
      setGroupBy = "WEEK"
    }
    else if (filterr === 'WEEK') {
      setFilter = "WEEK";
      setGroupBy = "DAY"
    }
    this.setState({
      filter: setFilter,
      groupBy: setGroupBy,
      options: {
        title: {
          text: "Product Trends by " + setFilter
        }
      }
    })
    setTimeout(() => {
      this.serverRequest();
    }, 200);
  }



  serverRequest() {
    const {
      filter,
      groupBy,
    } = this.state;

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let parms = `getChartData?filter=${filter}&groupBy=${groupBy}&current_role=${localStorage.getItem("role")}`;
    fetch(config.ADMIN_API_URL + parms, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            series: data?.NewChartdata?.series,
            xaxis: data?.NewChartdata?.xaxis,
            totalAmount: data?.totalAmount
          });
        },

        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }



  componentDidMount() {
    this.serverRequest()
  }

  render() {
    const { series, options } = this.state;
    return (
      <div className="chart">
        <div className="heading my-5 align-item-center">
          <div className="revenue_head">
            <div>
              <h4>${this.state.totalAmount}</h4>
              <h6>Revenue Generated</h6>
            </div>
            <div className="button py-3">
              <button className="btn btn-primary" onClick={() => this.onClick("WEEK")}>
                This Week
              </button>
              <button className="btn btn-primary" onClick={() => this.onClick("MONTH")}>
                This Month
              </button>
              <button className="btn btn-primary" onClick={() => this.onClick("YEAR")}>
                This Year
              </button>
            </div>
          </div>
          <NavLink to="/admin/Revenue" className="anchor">
            View All <i className="fal fa-long-arrow-right" />
          </NavLink>
        </div>
        <div className="Chart_js">
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>

    );
  }
}
