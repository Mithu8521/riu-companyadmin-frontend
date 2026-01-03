import React, { useEffect } from "react";
import { useState } from "react";
import "../../Company Sub Admin/Component/Sector Questions/SectorQuestion.css";
import All from "../../../img/sector/All.png";
import Quantitative from "../../../img/sector/Quantitative.png";
import Tabular from "../../../img/sector/Tabular.png";
import Qualitative from "../../../img/sector/Qualitative.png";
import Close from "../../../img/sector/yes_no.png";
import Trends from "../../../img/sector/Card.png";
import { Button, Form, Modal } from "react-bootstrap";
import CreateSectorQuestionModal from "../../Sector_Question_Manage/CreateSectorQuestionModal";

export default function QuestionTypeTab({
  audit_Data,
  allQuestionList,
  setSelectedQuestionType,
  module,
  setFilterAuditData,
  financial_year_id,
}) {
  const [questionType, setQuestionType] = useState("All");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setSelectedQuestionType && setSelectedQuestionType(questionType);
  }, [questionType]);
  return (
    <>
      <div className="hol_rell d-flex justify-content-between w-100">
        <div className="question_type_filter__wrapper">
          <div
            className={`${questionType === "All" ? "selected_question_type" : ""
              }`}
            onClick={() => {
              setQuestionType("All");
              setFilterAuditData && setFilterAuditData(audit_Data);
            }}
          >
            <img src={All} style={{ width: 20 }} alt="All" /> All
          </div>
          <div
            className={`${questionType === "quantitative" ? "selected_question_type" : ""
              }`}
            onClick={() => {
              setQuestionType("quantitative");
              setFilterAuditData &&
                setFilterAuditData(allQuestionList?.quantitative);
            }}
          >
            <img src={Quantitative} style={{ width: 18 }} alt="Quantitative" />{" "}
            Quantitative
          </div>
          <div
            className={`${questionType === "tabular_question"
              ? "selected_question_type"
              : ""
              }`}
            onClick={() => {
              setQuestionType("tabular_question");
              setFilterAuditData &&
                setFilterAuditData(allQuestionList?.tabular_question);
            }}
          >
            <img src={Tabular} style={{ width: 18 }} alt="Tabular Question" />{" "}
            Tabular Question
          </div>
          <div
            className={`${questionType === "qualitative" ? "selected_question_type" : ""
              }`}
            onClick={() => {
              setQuestionType("qualitative");
              setFilterAuditData &&
                setFilterAuditData(allQuestionList?.qualitative);
            }}
          >
            <img src={Qualitative} style={{ width: 18 }} alt="Qualitative" />{" "}
            Qualitative
          </div>
          <div
            className={`${questionType === "yes_no" ? "selected_question_type" : ""
              }`}
            onClick={() => {
              setQuestionType("yes_no");
              setFilterAuditData && setFilterAuditData(allQuestionList?.yes_no);
            }}
          >
            <img src={Close} style={{ width: 18 }} alt="Close Range" /> Close
            Range
          </div>
          <div
            className={`${questionType === "quantitative_trends"
              ? "selected_question_type"
              : ""
              }`}
            onClick={() => {
              setQuestionType("quantitative_trends");
              setFilterAuditData &&
                setFilterAuditData(allQuestionList?.quantitative_trends);
            }}
          >
            <img src={Trends} style={{ width: 18 }} alt="Quantitative Trends" />{" "}
            Quantitative Trends
          </div>
        </div>
        {module === "SUPPLIER_QUESTION_LIST" && (
          <button
            className="new_button_style_white"
            onClick={handleShow}
            style={{ margin: 4 }}
          >
            Add Supplier Assessment Question
          </button>
        )}
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Add Question</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <CreateSectorQuestionModal
              module={module}
              financial_year_id={financial_year_id}
            />
          </div>
        </Modal.Body>
        <Modal.Footer style={{ height: 65 }}> </Modal.Footer>
      </Modal>
    </>
  );
}
