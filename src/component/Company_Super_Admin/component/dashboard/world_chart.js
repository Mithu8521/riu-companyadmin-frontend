import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";

const currentUser = authenticationService.currentUserValue;
export default class WorldChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(
      config.ADMIN_API_URL + `getChartData?filter=MONTH&groupBy=WEEK&current_role=${localStorage.getItem("role")}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          let itemss = [];
          data.birdEyeData?.forEach((element) => {
            let dataaa = {
              id: element.iosCode,
              name: element.country,
              value: element.percent,
              fill: am4core.color("#233076"),
            };
            itemss.push(dataaa);
          });
          this.setState({
            isLoaded: true,
            items: itemss,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    var chart1 = am4core.create("chartdiv1", am4maps.MapChart);

    // Set map definition
    chart1.geodata = am4geodata_worldLow;

    // Set projection
    chart1.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart1.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = `{value}% Users 
    {name}`;
    polygonTemplate.fill = am4core.color("#233076");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#41C7ED");

    // Remove Antarctica
    // polygonSeries.exclude = ["AQ"];
    setTimeout(() => {
      polygonSeries.data = this.state.items;
    }, 2000);

    // Bind "fill" property to "fill" key in data
    polygonTemplate.propertyFields.fill = "fill";
  }
  render() {
    return (
      <div>
        <div id="chartdiv1"></div>
      </div>
    );
  }
}
