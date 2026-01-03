import React, { Component } from "react";
import ScopeEmmision1 from "./scope_emmision_1";
import ScopeEmmision2 from "./scope_emmision_2";
import ScopeEmmision3 from "./scope_emmision_3";
import { Tabs, Tab } from "react-bootstrap";
import "../Sector Questions/tabbing.css";

export default class carbon_footprint_tabbing extends Component {
  render() {
    return (
      <div>
        <div className="steps-step ste-steps">
          <Tabs
            defaultActiveKey="first"
            id="step-9"
            className="mb-3 parent-enviornment2 justify-content-between"
          >
            <Tab eventKey="first" title="Scope 1: Emissions">
              <ScopeEmmision1 />
            </Tab>
            <Tab eventKey="second" title="Scope 2: Emissions">
              <ScopeEmmision2 />
            </Tab>
            <Tab eventKey="third" title="Scope 3: Emissions">
              <ScopeEmmision3 />
            </Tab>
            {/* <Tab eventKey="forth" title="Results">
                            <Result/>
                        </Tab> */}
          </Tabs>
        </div>
      </div>
    );
  }
}
