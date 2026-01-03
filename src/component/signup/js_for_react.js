import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

export default class WorldChart extends Component {
  componentDidMount() {
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#233076");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#41C7ED");

    // Remove Antarctica
    polygonSeries.exclude = ["AQ"];

    // Add some data
    polygonSeries.data = [{
      "id": "US",
      "name": "United States",
      "value": 100,
      "fill": am4core.color("#233076")
    }, {
      "id": "FR",
      "name": "France",
      "value": 50,
      "fill": am4core.color("#5C5CFF")
    }];

    // Bind "fill" property to "fill" key in data
    polygonTemplate.propertyFields.fill = "fill";
  }
  render() {
    return (
      <div>
        <div id="chartdiv"></div>
      </div>
    )
  }
} 