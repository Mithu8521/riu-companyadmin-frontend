import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./AuditDetails.css";
import ConvertTimeStamp from "./../../../utils/ConvertTimeStamp";
import TebularInputCardAnswer from "../../Company Sub Admin/Component/Sector Questions/TabularInputCardAnswer";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import { apiCall } from "../../../_services/apiCall";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import config from "../../../config/config.json";

const AuditDetails = () => {
  const audit_data = JSON.parse(sessionStorage.getItem("audit_data"));
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const location = useLocation();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [validation, setValidation] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let dateTime = audit_data.answer_details.updatedAt
    ? ConvertTimeStamp(audit_data.answer_details.updatedAt)
    : ConvertTimeStamp(audit_data.answer_details.answered_at);

  const handleSubmit = async () => {
    const { isSuccess, error, data } = await apiCall(
      `${config.API_URL}validateAnswers`,
      {},
      {
        question_id: audit_data.question_id,
        questionTitle: audit_data.title,
        answer_id: audit_data.answer_id,
        audit_table_id: audit_data.id,
        validation: validation,
        financial_year: audit_data.financial_year_id,
        questionnaire_type: audit_data.questionnaire_type,
        questionType: audit_data.questionType,
        current_role: localStorage.getItem("role"),
      },
      "POST"
    );

    if (isSuccess) {
      history.push({
        pathname: `${location?.pathname}`,
      });
    }

    if (error) {
      swal({
        icon: "error",
        title: data.message,
        timer: 1000,
      });
    }
  };
  const handleSubmitRemark = async (validation1) => {
    setShow(true);
    setValidation(validation1);
  };
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("audit_data");
    };
  }, []);

  return (
    <>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <section className="d_text">
            <div className="color_div_on">
              <Row>
                <Col md={8} className="profile_column">
                  <div className="profile_details">
                    {" "}
                    <img
                      className="profile-img"
                      src={
                        audit_data.answer_details["zb_users.profile_picture"]
                      }
                      alt="Profile Picture"
                    />
                    <div>
                      <h4>
                        {audit_data.answer_details["zb_users.first_name"]}{" "}
                        {audit_data.answer_details["zb_users.last_name"]}
                      </h4>
                      <Badge className="bg-warning text-dark">
                        {
                          audit_data.answer_details[
                          "zb_users.register_company_name"
                          ]
                        }
                      </Badge>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <h5>
                    {audit_data.update_type}
                    <br></br> {dateTime[0]} <br></br>
                    {dateTime[1].split(".")[0]}
                  </h5>
                </Col>
              </Row>
              <div className="mt-3">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan={2}>ANSWER DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        {audit_data.question_details.completeQuestion.title}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: 150 }}>Question Type</td>
                      <td>{audit_data.questionType}</td>
                    </tr>
                    <tr>
                      <td> Answer</td>
                      <td>
                        {audit_data.questionType === "tabular_question" ||
                          audit_data.questionType === "trends_question" ? (
                          <>See below</>
                        ) : (
                          audit_data.answer_details.answer
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Remark</td>
                      <td>{audit_data.answer_details.remark}</td>
                    </tr>
                  </tbody>
                  {audit_data.questionType === "tabular_question" && (
                    <TebularInputCardAnswer
                      item={{
                        question_detail: audit_data.question_details.quesDets,
                      }}
                      combinedAnswers={[
                        {
                          answered_by_email: `${audit_data.answer_details["zb_users.first_name"]} ${audit_data.answer_details["zb_users.last_name"]}`,
                          audit_status: audit_data.audit_status,
                          audit_remark: audit_data.answer_details.remark,
                          answer: JSON.parse(audit_data.answer_details.answer),
                        },
                      ]}
                      userIsHead={1} // check later
                    // userIsHistory={0}
                    // meterListData={meterList}
                    />
                  )}
                </Table>
              </div>
            </div>
          </section>
          {audit_data.validatePermission && (
            <div style={{ textAlign: "center" }}>
              <Button
                type="submit"
                name="Accepted"
                variant="success"
                className="m-3"
                onClick={(e) => handleSubmitRemark(e.target.name)}
              >
                Accept
              </Button>
              <Button
                type="submit"
                name="Rejected"
                variant="danger"
                className="m-3"
                onClick={(e) => handleSubmitRemark(e.target.name)}
              >
                Reject
              </Button>
            </div>
          )}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Remark</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Enter Remak</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="enter remark"
                    autoFocus
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AuditDetails;
