import React from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Company Sub Admin/Component/Sector Questions/trandsInputCard.css";

function TradeCards({ questionDetail }) {
    const datepickerRef = React.useRef(null);
    return (
        <>
            <div className="Quantative_Sector">
                <div className="tableOutput__area mb-2">
                    <div >
                        <Table striped bordered>
                            <tbody>
                                <tr>
                                    <td>Date</td>
                                    <td>
                                        <div
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ gap: "5px" }}
                                        >
                                            <div className="d-flex flex-column">
                                                <div className="date-picker-container d-flex flex-column">
                                                    <div className="input-container d-flex">
                                                        <DatePicker
                                                            selected={new Date()}
                                                            showMonthYearPicker
                                                            dateFormat="MM/yyyy"
                                                            className="form-control date-picker-input"
                                                            readOnly={true}
                                                            required
                                                            ref={datepickerRef}
                                                            placeholder="MM/yyyy"
                                                        />
                                                        <div
                                                            className="calendar-i"
                                                            style={{
                                                                margin: "3px -34px 0px -34px",
                                                                zIndex: "100",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <div className="date-picker-container">
                                                    <div className="input-container d-flex">
                                                        <DatePicker
                                                            selected={new Date()}
                                                            showMonthYearPicker
                                                            dateFormat="MM/yyyy"
                                                            className="form-control date-picker-input"
                                                            readOnly={true}
                                                            required
                                                            ref={datepickerRef}
                                                            placeholder="MM/yyyy"
                                                        />
                                                        <div
                                                            className="calendar-i"
                                                            style={{
                                                                margin: "3px -34px 0px -34px",
                                                                zIndex: "100",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Source</td>
                                    <td>
                                        <Form.Select
                                            aria-label="Default select example p-5"
                                            className="form-control"
                                            name="meter_id"
                                            readOnly={true}
                                            required
                                        >
                                            <option value="" hidden>
                                                Please Select the Source
                                            </option>
                                        </Form.Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Process</td>
                                    <td>
                                        <Form.Select
                                            aria-label="Default select example p-5"
                                            className="form-control"
                                            name="process"
                                            readOnly={true}
                                        >
                                            <option value="" hidden>
                                                Please Select the Process
                                            </option>
                                        </Form.Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Reading Value</td>
                                    <td>
                                        <InputGroup>
                                            <Form.Control
                                                style={{
                                                    width: "70%",
                                                }}
                                                aria-label="first_input"
                                                type="number"
                                                name="reading_value"
                                                readOnly={true}
                                                required
                                            />
                                            <Form.Control
                                                style={{
                                                    width: "30%",
                                                }}
                                                aria-label="Last_input"
                                                value={
                                                    questionDetail?.question_detail[0]?.option ?? null
                                                }
                                            />
                                        </InputGroup>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan={2}>Note</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Leave a Note here"
                                            style={{
                                                height: "100px",
                                            }}
                                            name="note"
                                            readOnly={true}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ViewTrendsInputCards({ questionData, initalData }) {
    const [cardAnswers, setCardAnswers] = React.useState();

    React.useEffect(() => {
        setCardAnswers([initalData]);
    }, []);

    return (
        <>
            <div
                style={{
                    width: "100%",
                    display: "grid",
                    margin: "0 auto",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(2, 1fr)",
                }}
            >
                {cardAnswers &&
                    cardAnswers?.map((inputTradeAns, index) => {
                        return (
                            <div
                                key={`${questionData?.id}-${index}`}
                                style={{ width: "100%" }}
                            >
                                <TradeCards
                                    item={inputTradeAns}
                                    questionDetail={questionData}
                                />
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
