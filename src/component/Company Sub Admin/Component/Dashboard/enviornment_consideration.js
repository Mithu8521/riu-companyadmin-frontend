import React, { Component } from 'react';
import Enviornmenttabbing from '../Dashboard/enviornment_tabbing';
import SocialConsideration from '../Dashboard/social_consideration';
import GovernanceConsideration from '../Dashboard/Governance';
import { Tabs, Tab } from "react-bootstrap";
import './enviornment_consideration.css';

export default class enviornment_consideration extends Component {

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="first" id="step-9" className="mb-3 enviornment_consideration">
                    <Tab eventKey="first" title="Environmental Risks" className="enviornment_tab" >
                        <Enviornmenttabbing />
                    </Tab>

                    <Tab eventKey="second" title="Social Risks" className="enviornment_tab">
                        <SocialConsideration />
                    </Tab>
                    <Tab eventKey="third" title="Governance Risks" className="enviornment_tab">
                        <GovernanceConsideration />
                    </Tab>
                </Tabs>
                {/* <ul className="tabs fast">
                    <li><a href="#panel1">Environmental Considerations</a></li>
                    <li><a href="#panel2">Social Considerations</a></li>
                    <li><a href="#panel3">Industry Information</a></li>
                </ul> */}

            </div>
        )
    }
}               