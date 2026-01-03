import React, { useEffect, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import SectorAnswer from "../../Company Sub Admin/Component/Sector Questions/SectorAnswer";

const AuditAnswers = ({
  assignedDeatils,
  auditAnswer,
  setSelectedRow,
  processList,
  processingList,
  handleValidateSubmit,
  module,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  const [show, setShow] = useState(false);
  const [remark, setRemark] = useState("");
  const [validation, setValidation] = useState("");
  const [answerId, setAnswerId] = useState("");
  const [assignedDetail, setAssignedDetail] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [financialYearId, setFinancialYearId] = useState("");
  const handleClose = () => setShow(false);
  useEffect(() => {
    setSelectedRow(auditAnswer?.questionId);
  }, [auditAnswer]);
  useEffect(() => {
    const assignedDetail = assignedDeatils && assignedDeatils?.filter((obj) => obj.questionId == auditAnswer?.question?.id);
    setAssignedDetail(assignedDetail && assignedDetail[0]);
  }, [auditAnswer?.question]);
  const handleSubmitRemark = async (
    validation1,
    questionType,
    answerId,
    financialYearId
  ) => {
    setShow(true);
    setValidation(validation1);
    setAnswerId(answerId);
    setQuestionType(questionType);
    setFinancialYearId(financialYearId);
  };
  const handleSubmit = async () => {
    handleValidateSubmit(
      auditAnswer?.questionId,
      answerId,
      remark,
      financialYearId,
      validation,
      questionType
    );
    setShow(false);
  };

  return (
    <>
      <div className="align-items-center justify-content-center gap-4">
        <SectorAnswer
          assignedDetail={assignedDetail}
          questionData={auditAnswer?.question}
          answers={
            auditAnswer?.combined_answers
              ? [
                {
                  ...auditAnswer?.answer_details,
                  combined_answers: auditAnswer?.combined_answers[0],
                },
              ]
              : [auditAnswer?.answer]
          }
          listing={module === "LISTING" ? "audit" : "HISTROY"}
          permission={auditAnswer.validatePermission}
          meterList={processList}
          processList={processingList}
          user_Is_head={1}
          auditAnswer={auditAnswer}
          handleAuditSubmit={handleSubmitRemark}
          SectorAnswer
        />
        {module === "LISTING" &&
          auditAnswer?.questionType != "tabular_question" &&
          auditAnswer?.questionType != "quantitative_trends" &&
          auditAnswer?.auditorId?.auditerId === userId && (
            <div className="hstack gap-3 my-2 justify-content-end">
              <Button
                type="submit"
                name="ACCEPTED"
                variant="info"
                onClick={(e) =>
                  handleSubmitRemark(
                    e.target.name,
                    auditAnswer?.questionType,
                    auditAnswer?.answer?.id,
                    auditAnswer?.answer?.financialYearId
                  )
                }
              >
                Accept
              </Button>
              <Button
                type="submit"
                name="REJECTED"
                variant="danger"
                onClick={(e) =>
                  handleSubmitRemark(
                    e.target.name,
                    auditAnswer?.questionType,
                    auditAnswer?.answer?.id,
                    auditAnswer?.answer?.financialYearId
                  )
                }
              >
                Reject
              </Button>
              {/* <Button variant="warning">History</Button> */}
            </div>
          )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Remark</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remark"
                autoFocus
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="info" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuditAnswers;
