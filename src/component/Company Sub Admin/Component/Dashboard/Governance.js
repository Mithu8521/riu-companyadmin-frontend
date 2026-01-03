import React, { Component } from "react";

export default class GovernanceConsideration extends Component {
  render() {
    return (
      <div>
        {/* <!-- end panel 1 --> */}
        <div id="panel3" className="panel">
          <div className="table_well">
            <p className="actual">
              <strong>Diversity, Equity, and Inclusion (DE&I) - </strong>With shareholders increasing emphasising on higher representation of people across social diversities such as genders, ethnicities, etc. in the workforce of companies and their equitable treatment, this governance factor can greatly influence investor sentiments.
            </p>
            <p className="actual">
              <strong>Compensation Discrepancies - </strong>Factors such as the ratio of CEO-to-median employee pay are becoming high priority topics for shareholder oversight now more than ever. Thereby, compensations of top executives are strong signals of sound governance policies and drive market perceptions considerably.
            </p>
            <p className="actual">
              <strong>Skills of the Board of Directors - </strong>The board of directors are expected to have the right mix of expertise of different domains and having the right set of people on board is critical in maintaining shareholder trust.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
