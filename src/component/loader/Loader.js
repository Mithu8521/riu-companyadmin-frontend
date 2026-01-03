import React, { Component } from "react";
import "./loader.css";
export default class Loader extends Component {
  render() {
    return (
      <div id="outer">
        <div id="middle">
          <div id="inner"></div>
        </div>
      </div>
    );
  }
}
