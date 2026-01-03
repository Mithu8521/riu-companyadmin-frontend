import React, { Component } from "react";
import Governance from "./governance";
import SocialPolicies from "./social_policies";
import CyberTechnology from "./cyber_technology";
import HealthSafetyPolicy from "./health_safety_policy";
import EnviornmentalPolicy from "./enviornmental_policy";
import { Tabs, Tab } from "react-bootstrap";
import "../Sector Questions/tabbing.css";

export default class auditTabbing extends Component {
  render() {
    return (
      <div>
        <div className="steps-step ste-steps">
          <Tabs
            defaultActiveKey="first"
            id="step-9"
            className="mb-3 parent-enviornment2"
          >
            <Tab
              eventKey="first"
              title="Governance Policies"
              className="enviornment"
            >
              <Governance />
            </Tab>
            <Tab eventKey="second" title="Social Policies">
              <SocialPolicies />
            </Tab>
            <Tab eventKey="third" title="Cyber & Technology">
              <CyberTechnology />
            </Tab>
            <Tab eventKey="forth" title="Health and Safety Policy">
              <HealthSafetyPolicy />
            </Tab>
            <Tab eventKey="fifth" title="Environmental Policy">
              <EnviornmentalPolicy />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
