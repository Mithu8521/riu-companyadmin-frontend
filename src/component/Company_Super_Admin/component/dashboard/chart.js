import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default class Chart extends Component {
  componentDidMount() {
    am4core.useTheme(am4themes_animated);

    var chart2 = am4core.create("chartdiv2", am4charts.XYChart);
    chart2.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart2.paddingRight = 20;

    var data = [];
    var open = 100;
    var close = 250;

    for (var i = 1; i < 120; i++) {
      open += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4);
      close = Math.round(
        open +
        Math.random() * 5 +
        i / 5 -
        (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2
      );
      data.push({ date: new Date(2018, 0, i), open: open, close: close });
    }

    chart2.data = data;

    var dateAxis = chart2.xAxes.push(new am4charts.DateAxis());

    var valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    var series = chart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.openValueY = "open";
    series.dataFields.valueY = "close";
    series.tooltipText = "open: {openValueY.value} close: {valueY.value}";
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.3;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;

    var series2 = chart2.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "open";
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart2.colors.getIndex(6);
    series2.tensionX = 0.8;

    chart2.cursor = new am4charts.XYCursor();
    chart2.cursor.xAxis = dateAxis;
    chart2.scrollbarX = new am4core.Scrollbar();
  }
  render() {
    return (
      <div>
        <div id="chartdiv2"></div>
      </div>
    );
  }
}
