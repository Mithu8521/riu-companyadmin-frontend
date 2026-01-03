import React from "react";
import { useState } from "react";
import "./topcomponent.css";
import OperationalModal from "./operationalmodal";
import SecondOperationalModal from "./SecondOperationalModule";

const TopComponent = ({ handleAssignedDetails, financeObjct, managementListValue, moduleName, moduleData, getReportingQuestions }) => {

  const questionIds = moduleData?.map(item => item?.questionId);

  const data = "top";
  const [showModal, setShowModal] = useState(false);
  const [showModalSecond, setShowModalSecond] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModalSecond = () => {
    setShowModal(false);
    setShowModalSecond(true);
  };

  const handleCloseModalSecond = () => {
    setShowModalSecond(false);
  }

  return (
    <div className="d-flex bg-white topco">
      <div className="secclass">
        <button className="btn custom-btn" onClick={handleOpenModal} style={{ backgroundColor: "#3F88A5", color: "white" }}>Assign Module</button>
        <button className="btn custom-btn" onClick={handleOpenModalSecond} style={{ backgroundColor: "#3F88A5", color: "white", marginRight: "5px" }}>Reassign Module</button>

      </div>
      <div>

      </div>
      <OperationalModal handleAssignedDetails={handleAssignedDetails} financeObjct={financeObjct} questionIds={questionIds} managementListValue={managementListValue} moduleName={moduleName} data={data} showModal={showModal} handleCloseModal={handleCloseModal} />
      <SecondOperationalModal handleAssignedDetails={handleAssignedDetails} financeObjct={financeObjct} questionIds={questionIds} managementListValue={managementListValue} moduleName={moduleName} data={data} showModal={showModalSecond} handleCloseModal={handleCloseModalSecond} />
    </div>
  );
};

export default TopComponent;
