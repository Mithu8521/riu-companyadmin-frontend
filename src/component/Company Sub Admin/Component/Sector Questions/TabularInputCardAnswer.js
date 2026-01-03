import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import NotAssign from ".././../../../img/skeletons_types_table.png";

export default function TebularInputCardAnswer({
  filterAssignedDetail,
  item,
  combinedAnswers,
  meterListData,
  auditAnswer,
  handleValidateSubmit,
  listing,
}) {
  const [nrOfLevels, setNrOfLevels] = useState(2);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose1 = () => setShow1(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  const [show2, setShow2] = useState(false);

  function getProcessById(dataArray, inputId) {
    const foundData = dataArray.find((data) => data.id == inputId);
    return foundData ? foundData.location : null;
  }

  const chartStyle = {
    width: 60,
    height: 20,
  };

  return (
    <>
      <div className="table__wrappers">
        {combinedAnswers?.length > 0 &&
          combinedAnswers?.map((combinedAnswers) => {
            return (
              <>
                <hr className="hr-text" data-content="1st Answer" />
                <div className="tableOutput__area">
                  <Table striped bordered hover>
                    <tbody>
                      {filterAssignedDetail ? (
                        <>
                          <tr style={{ background: "#ccc" }}>
                            <td>Attribute</td>
                            <td>Value</td>
                          </tr>
                          {combinedAnswers?.sourceId?.length > 0 && (
                            <tr>
                              <td>Source</td>
                              <td>
                                <span style={{ fontWeight: 100 }}>
                                  {getProcessById(
                                    meterListData,
                                    combinedAnswers?.sourceId
                                  )}
                                </span>
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td>Assign By</td>
                            <td>
                              {filterAssignedDetail?.assignedByDetails &&
                                filterAssignedDetail?.assignedByDetails.map(
                                  (user, index) => (
                                    <span key={index}>
                                      <span
                                        data-tooltip={
                                          filterAssignedDetail?.assignedByDetails &&
                                          filterAssignedDetail?.assignedByDetails
                                            .map((user) => user.email)
                                            .join(", ")
                                        }
                                      >
                                        {user.first_name} {user.last_name}
                                      </span>

                                      {index <
                                        filterAssignedDetail?.assignedByDetails
                                          .length -
                                        1 && ", "}
                                    </span>
                                  )
                                )}
                            </td>
                          </tr>

                          <tr>
                            <td>Assign to</td>
                            <td>
                              {filterAssignedDetail?.assignedToDetails &&
                                filterAssignedDetail?.assignedToDetails.map(
                                  (user, index) => (
                                    <span key={index}>
                                      <span
                                        data-tooltip={filterAssignedDetail?.assignedToDetails
                                          .map((user) => user.email)
                                          .join(", ")}
                                      >
                                        {user.first_name} {user.last_name}
                                      </span>
                                      {index <
                                        filterAssignedDetail?.assignedToDetails
                                          .length -
                                        1 && ", "}
                                    </span>
                                  )
                                )}
                            </td>
                          </tr>
                          <tr>
                            <td>Assign Date</td>
                            <td>
                              {new Date(
                                filterAssignedDetail.createdAt
                              ).toLocaleString()}
                            </td>
                          </tr>

                          <tr>
                            <td>Due Date</td>
                            <td>
                              <div className="hstack">
                                <p className="m-0">
                                  {new Date(
                                    filterAssignedDetail?.dueDate
                                  ).toLocaleString()}
                                </p>
                                <GaugeChart
                                  style={chartStyle}
                                  id="gauge-chart2"
                                  nrOfLevels={nrOfLevels}
                                  colors={["#FF5F6D", "#FFC371"]}
                                // percent={completionPercentage / 100}
                                />
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>History</td>
                            <td>View</td>
                          </tr>
                        </>
                      ) : (
                        <img
                          src={NotAssign}
                          className="w-100"
                          alt="Question Not Assign"
                          title="Question Not Assign"
                        />
                      )}

                    </tbody>
                  </Table>
                  <div className="table_width">
                    <div className="table-wapper">
                      <table className="table">
                        <thead>
                          <tr className="option_wrapper">
                            <th className="p-0">   {item?.question_detail &&
                              item?.question_detail
                                .filter(function (item) {
                                  return (
                                    item.option_type == "firstRowAndColumnHead"
                                  );
                                })
                                .map((col, ind) => {
                                  return <th key={ind}>{col.option}</th>;
                                })} </th>
                            {item?.question_detail &&
                              item?.question_detail
                                .filter(function (item) {
                                  return item?.option_type == "column";
                                })
                                .map((col, ind) => {
                                  return <th key={ind}>{col?.option}</th>;
                                })}
                          </tr>
                        </thead>
                        <tbody>
                          {item?.question_detail &&
                            item?.question_detail
                              .filter(function (item) {
                                return item.option_type == "row";
                              })
                              .map((row, indRow) => {
                                return (
                                  <tr key={indRow} style={{ fontSize: "12px" }}>
                                    <th className="option_wrapper_width_100">
                                      {row?.option}
                                    </th>
                                    {item?.question_detail &&
                                      item?.question_detail
                                        .filter(function (item) {
                                          return item.option_type == "column";
                                        })
                                        .map((col, indCol) => {
                                          const value =
                                            (combinedAnswers?.answer &&
                                              combinedAnswers?.answer[indRow] &&
                                              combinedAnswers?.answer[indRow][
                                              indCol
                                              ]) ||
                                            "";
                                          return (
                                            <td key={indCol}>
                                              <>

                                              </>
                                              <input
                                                value={value}
                                                type={"text"}
                                                readOnly
                                              />
                                            </td>
                                          );
                                        })}
                                  </tr>
                                );
                              })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {listing === "audit" &&
                  auditAnswer?.auditorId?.auditerId === userId && (
                    <div className="hstack gap-3 my-2 justify-content-end">
                      <Button
                        type="submit"
                        name="ACCEPTED"
                        variant="info"
                        onClick={(e) =>
                          handleValidateSubmit(
                            e.target.name,
                            "tabular_question",
                            combinedAnswers?.id,
                            combinedAnswers?.financialYearId
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
                          handleValidateSubmit(
                            e.target.name,
                            "tabular_question",
                            combinedAnswers?.id,
                            combinedAnswers?.financialYearId
                          )
                        }
                      >
                        Reject
                      </Button>
                      {/* <Button variant="warning">History</Button> */}
                    </div>
                  )}
              </>
            );
          })}
      </div>

      <Modal show={show1} onHide={handleClose1} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <hr className="hr-text" data-content="1st History" />
            <Table striped hover bordered className="m-0">
              <tbody>
                <tr style={{ background: "#ccc" }}>
                  <td>Attribute</td>
                  <td>Valve</td>
                </tr>
                <tr>
                  <td>Assign By</td>
                  <td>Satya</td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>
                    <div className="hstack">
                      <p className="m-0">05/Jan/2024 | 23:59</p>
                      <GaugeChart
                        style={chartStyle}
                        id="gauge-chart2"
                        nrOfLevels={nrOfLevels}
                        colors={["#FF5F6D", "#FFC371"]}
                      // percent={completionPercentage / 100}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>Rejected</td>
                </tr>
                <tr>
                  <td>Answer By</td>
                  <td>satya@sapidblue.com</td>
                </tr>
                <tr>
                  <td>Attatchment</td>
                  <td>Uploaded</td>
                </tr>
                <tr>
                  <td colSpan={2}>Answer</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-0 m-0">
                    <textarea className="w-100 form-control"></textarea>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div>
            <hr className="hr-text" data-content="2nd History" />
            <Table striped hover bordered className="m-0">
              <tbody>
                <tr style={{ background: "#ccc" }}>
                  <td>Attribute</td>
                  <td>Valve</td>
                </tr>
                <tr>
                  <td>Assign By</td>
                  <td>Satya</td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>
                    <div className="hstack">
                      <p className="m-0">05/Jan/2024 | 23:59</p>
                      <GaugeChart
                        style={chartStyle}
                        id="gauge-chart2"
                        nrOfLevels={nrOfLevels}
                        colors={["#FF5F6D", "#FFC371"]}
                      // percent={completionPercentage / 100}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>Rejected</td>
                </tr>
                <tr>
                  <td>Answer By</td>
                  <td>satya@sapidblue.com</td>
                </tr>
                <tr>
                  <td>Attatchment</td>
                  <td>Uploaded</td>
                </tr>
                <tr>
                  <td colSpan={2}>Answer</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-0 m-0">
                    <textarea className="w-100 form-control"></textarea>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div>
            <hr className="hr-text" data-content="3rd History" />
            <Table striped hover bordered className="m-0">
              <tbody>
                <tr style={{ background: "#ccc" }}>
                  <td>Attribute</td>
                  <td>Valve</td>
                </tr>
                <tr>
                  <td>Assign By</td>
                  <td>Satya</td>
                </tr>
                <tr>
                  <td>Due Date</td>
                  <td>
                    <div className="hstack">
                      <p className="m-0">05/Jan/2024 | 23:59</p>
                      <GaugeChart
                        style={chartStyle}
                        id="gauge-chart2"
                        nrOfLevels={nrOfLevels}
                        colors={["#FF5F6D", "#FFC371"]}
                      // percent={completionPercentage / 100}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>Accepted</td>
                </tr>
                <tr>
                  <td>Answer By</td>
                  <td>satya@sapidblue.com</td>
                </tr>
                <tr>
                  <td>Attatchment</td>
                  <td>Uploaded</td>
                </tr>
                <tr>
                  <td colSpan={2}>Answer</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-0 m-0">
                    <textarea className="w-100 form-control"></textarea>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
