import React, { Component } from "react";
import EnviornmentalCapital from "./Enviornmental_Capital";
import SocialCapital from "./Social_Capital";
import LeadershipGovernance from "./Leadership_&_Governance";
import BusinessModel from "./Business_Model";
import { Tabs, Tab } from "react-bootstrap";
import "./tabbing.css";

export default class Tabbing extends Component {
  render() {
    return (
      <div>
        <div className="steps-step ste-steps">
          <Tabs
            defaultActiveKey="first"
            id="step-9"
            className="mb-3 parent-enviornment"
          >
            <Tab
              eventKey="first"
              title="Environment Capital"
              className="enviornment"
            >
              <EnviornmentalCapital />
            </Tab>

            <Tab eventKey="second" title="Social Capital">
              <SocialCapital />
            </Tab>
            <Tab eventKey="third" title="Leadership & Governance">
              <LeadershipGovernance />
            </Tab>
            <Tab eventKey="forth" title="Business Model & Innovation">
              <BusinessModel />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
