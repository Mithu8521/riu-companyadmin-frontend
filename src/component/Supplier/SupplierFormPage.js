import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import LoremPage from "../Supplier/LoremPage";
import DolorPage from "../Supplier/DolorPage";
import ConsecteturPage from "../Supplier/ConsecteturPage";
import NostrudPage from "../Supplier/NostrudPage";
export default class SupplierFormPage extends Component {
  render() {
    return (
      <div>
        <div className="ste-steps">
          <Tabs
            defaultActiveKey="first"
            id="step-9"
            className="mb-3 parent-enviornment2 justify-content-between"
          >
            <Tab eventKey="first" title="Lorem ipsum">
              <LoremPage />
            </Tab>
            <Tab eventKey="second" title="Dolor Sit">
              <DolorPage />
            </Tab>
            <Tab eventKey="third" title="Consectetur Adipiscin">
              <ConsecteturPage />
            </Tab>
            <Tab eventKey="forth" title="Nostrud Exercitation">
              <NostrudPage />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}
