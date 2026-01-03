import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import EnviornmentalTopics from "../../Component/Supplier/supplier_enviornmental_topics";
import SocialTopics from "../../Component/Supplier/supplier_social_topics";
import GovernanceTopics from "../../Component/Supplier/governance_topics";
import BusinessModel from "../../Component/Supplier/business_model";

export default class supplier_tabbing extends Component {
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
              title="Environmental Topics"
              className="enviornment"
            >
              <EnviornmentalTopics />
            </Tab>
            <Tab eventKey="second" title="Social Topics">
              <SocialTopics />
            </Tab>
            <Tab eventKey="third" title="Governance Topics">
              <GovernanceTopics />
            </Tab>
            <Tab eventKey="forth" title="Business Model">
              <BusinessModel />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
