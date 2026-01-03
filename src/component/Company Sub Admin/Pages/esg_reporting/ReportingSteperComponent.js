import React from "react";
import { Col, Row } from "react-bootstrap";

const ReportingSteperComponent = (props) => {
  return (
    <div>
      <div className="color_div_on">
        <h5 className="frame pt-4 pb-3">{props.title}</h5>
        <div className="Global">
          <div className="border_box p-3">
            <div className="wel_fel">
              <Row>

              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingSteperComponent;
