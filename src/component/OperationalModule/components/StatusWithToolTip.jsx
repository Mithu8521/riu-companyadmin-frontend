import React from "react";
import { Tooltip, OverlayTrigger, Image } from "react-bootstrap";
import Review from "../../../img/sector/reviewing.png";
import Verified from "../../../img/sector/accept.png";
import Reject from "../../../img/sector/decline.png";
import NotAnswered from "../../../img/sector/notAnswer.png";


const StatusIcon = ({ status }) => {
  let icon, color, marginLeft;

  switch (status) {
    case "ANSWERED":
      icon = <Image src={Review} />;
      color = "yellow";
      marginLeft = "-78%";
      break;
    case "ACCEPTED":
      icon = <Image src={Verified} />;
      color = "#43AC70";
      marginLeft = "-78%";
      break;
    case "REJECTED":
      icon = <Image src={Reject} />;
      color = "#F2684A";
      marginLeft = "-78%";
      break;
    default:
      icon = <Image src={NotAnswered} />;
      color = "#F2684A";
      marginLeft = "-78%";
      break;
  }

  return (
    <div
      style={{
        color,
        fontSize: "10px",
        height: "25px",
        width: "35px",
        display: "flex",
        marginLeft: "125%",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
  );
};

const StatusWithTooltip = ({ status }) => {
  return (
    <div
      style={{
        flex: "0 0 2%",
        display: "flex",
        // justifyContent: "center",
      }}
    >
      {status && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-${status}`}>
              {status} {/* This is the tooltip content */}
            </Tooltip>
          }
        >
          <div style={{marginLeft:"-60%"}}>
            <StatusIcon status={status} />
          </div>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default StatusWithTooltip;
