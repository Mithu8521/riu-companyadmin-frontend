import React, { Component } from 'react';
import MyProfile from './Settings';
import Billing from './billing';
import SubAdmin from './sub_admin';
import { Tabs, Tab } from "react-bootstrap"

export default class form_tabbing extends Component {
    render() {
        return (
            <div>
                <div className="steps-step ste-steps">
                    <Tabs defaultActiveKey="first" id="step-9" className="mb-3 parent-enviornment">
                        <Tab eventKey="first" title="MY PROFILE" className="enviornment">
                            <MyProfile />
                        </Tab>
                        <Tab eventKey="second" title="BILLING">
                            <Billing />
                        </Tab>
                        <Tab eventKey="third" title="SUB ADMINS">
                            <SubAdmin />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}