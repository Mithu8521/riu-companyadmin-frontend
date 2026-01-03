import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import ViewTrendsInputCards from "./ViewTrendsInputCards";
import TebularInputCard from "./ViewTebularInputCard";

const ViewQuestionDetails = ({ questionData }) => {
  const [hideCol, setShow] = useState(true);
  const handleShow = () => setShow(true);
  const initalData = {
    from_date: "",
    to_date: "",
    meter_id: "",
    process: "",
    reading_value: "",
    note: "",
    status: true,
    id: 123456,
    uploadUrl: undefined,
  };

  return (
    <>
      <div className="question_right_section">
        {questionData.questionType == "qualitative" && (
          <div className="tableOutput__area">
            <Table striped bordered className="m-0">
              <tbody>
                <>
                  <tr>
                    <td colSpan={2}>Answer</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-0">
                      <textarea
                        className="form-control"
                        name="answers"
                        required
                        readOnly={true}
                        placeholder="Leave a Answer here"
                      />
                    </td>
                  </tr>
                </>
              </tbody>
            </Table>
          </div>
        )}
        <div
          className="row align-items-center"
          style={{ position: "relative" }}
        >
          {questionData.questionType === "quantitative_trends" && (
            <div className="col-md-12">
              <div>
                <ViewTrendsInputCards
                  questionData={questionData}
                  initalData={initalData}
                />
              </div>
            </div>
          )}
          <div className="col-md-12">
            {questionData.questionType == "yes_no" && (
              <div className="tableOutput__area">
                <Table striped bordered className="m-0">
                  <tbody>
                    <tr>
                      <td colSpan={2}>Answer</td>
                    </tr>
                    <tr>
                      <td>
                        <Form>
                          <div className="d-flex align-items-center gap-4">
                            <div>
                              <input
                                inline="true"
                                label="Yes"
                                name="group1"
                                type={"radio"}
                                disabled={true}
                                value={"yes"}
                                checked={false}
                              />
                              <span className="mx-2">Yes</span>
                            </div>
                            <div>
                              <input
                                inline="true"
                                label="No"
                                name="group1"
                                type={"radio"}
                                disabled={true}
                                value={"no"}
                                checked={false}
                              />
                              <span className="mx-2">No</span>
                            </div>
                          </div>
                        </Form>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}

            {questionData.questionType == "tabular_question" && (
              <TebularInputCard item={questionData} handleShow1={handleShow} />
            )}

            {questionData.questionType == "quantitative" && (
              <div className="tableOutput__area">
                <Table striped bordered className="m-0">
                  <tbody>
                    <td>Answer</td>
                    <td>
                      <input className="p-2" type="number" readOnly={true} />
                    </td>
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewQuestionDetails;
