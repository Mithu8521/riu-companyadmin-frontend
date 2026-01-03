import React, { Component } from "react";

export default class enviornmental_consideration extends Component {
  render() {
    return (
      <div>
        <div id="panel1" className="panel">
          <div className="table_well">
            <p className="actual">
              <strong>Direct and Indirect Greenhouse Gas (GHG) Emissions - </strong> Incumbent and imminent regulatory impositions on the GHG emissions by firms, such as trading of emission credits, various forms of ecotax, etc.
            </p>
            <p className="actual">
              <strong>Pollution and Toxic Waste Management - </strong> Discharge of toxic wastes and pollutants invite penalties owing to evolving regulatory mandates.
            </p>
            <p className="actual">
              <strong>Water Scarcity - </strong> Inefficient use of water or insufficient availability of water cause notable operational disruptions. Further, the toll taken on businesses due to improper sewage treatment are also taken into cognisance.
            </p>
            <p className="actual">
              <strong>Weather extremities - </strong> Effects of acute temperature and weather episodes.
            </p>
            <p className="actual">
              <strong>Ecological Impact - </strong> Costs associated with the prevention of any negative ecological impacts of the businesses conducted by companies, along with the considerations of development in areas of ecological interest.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
