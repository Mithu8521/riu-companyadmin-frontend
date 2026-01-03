import React from "react";
import { Table } from "react-bootstrap";

export default function TebularInputCard({ item }) {
    return (
        <>
            <div className="tableOutput__area">
                <Table striped bordered hover>
                    <tbody></tbody>
                </Table>

                <div className="table_width">
                    <table className="table">
                        <thead>
                            <tr className="option_wrapper">
                                <th>
                                    {item?.question_detail &&
                                        item?.question_detail
                                            .filter(function (item) {
                                                return item.optionType == "firstRowAndColumnHead";
                                            })
                                            .map((col, ind) => {
                                                return <th key={ind}>{col.option}</th>;
                                            })}
                                </th>
                                {item?.question_detail &&
                                    item?.question_detail
                                        .filter(function (item) {
                                            return item.optionType == "column";
                                        })
                                        .map((col, ind) => {
                                            return <th key={ind}>{col.option}</th>;
                                        })}
                            </tr>
                        </thead>
                        <tbody>
                            {item?.question_detail &&
                                item?.question_detail
                                    .filter(function (item) {
                                        return item.optionType == "row";
                                    })
                                    .map((row, indRow) => {
                                        return (
                                            <tr
                                                key={indRow}
                                                style={{
                                                    fontSize: "12px",
                                                }}
                                            >
                                                <th
                                                    className={
                                                        row.option.length > 60
                                                            ? "option_wrapper_width"
                                                            : row.option.length > 10
                                                                ? "option_wrapper_width_100"
                                                                : "option_wrapper"
                                                    }
                                                >
                                                    {row.option}
                                                </th>
                                                {item?.question_detail &&
                                                    item?.question_detail
                                                        .filter(function (item) {
                                                            return item.optionType == "column";
                                                        })
                                                        .map((col, indCol) => {
                                                            const startDate =
                                                                col.option.includes("Start date");
                                                            const endDate = col.option.includes("End date");
                                                            const isEmail =
                                                                col.option.includes("E mail") ||
                                                                row.option.includes("E mail");
                                                            const isDate =
                                                                col.option.includes("date") ||
                                                                row.option.includes("date");
                                                            const isYesNo =
                                                                col.option.includes("Yes/ No") ||
                                                                row.option.includes("Yes/ No") ||
                                                                col.option.includes("Yes / No") ||
                                                                row.option.includes("Yes / No") ||
                                                                col.option.includes("Yes/No") ||
                                                                row.option.includes("Yes/No");
                                                            const isYear =
                                                                col.option.includes("year") ||
                                                                (row.option.includes("year") &&
                                                                    !row.option.includes("Yes/No"));
                                                            const isContact =
                                                                col.option.includes("Contact") ||
                                                                row.option.includes("Contact");
                                                            const isNumber =
                                                                (col.option.includes("FY") &&
                                                                    !col.option.includes("Remark")) ||
                                                                col.option.includes("%") ||
                                                                row.option.includes("%") ||
                                                                col.option.includes("Number") ||
                                                                (row.option.includes("Number") &&
                                                                    !col.option.includes("Remarks")) ||
                                                                col.option.includes("total") ||
                                                                col.option.includes("Total") ||
                                                                (row.option.includes("Total") &&
                                                                    !col.option.includes("Unit")) ||
                                                                col.option.includes("No.") ||
                                                                row.option.includes("No.") ||
                                                                col.option.includes("Rate") ||
                                                                row.option.includes("Rate") ||
                                                                col.option.includes("in Rs") ||
                                                                row.option.includes("in Rs") ||
                                                                col.option.includes("Percentage");
                                                            let inputType = "text";
                                                            if (isYesNo) {
                                                                inputType = "radio";
                                                            } else if (isNumber) {
                                                                inputType = "number";
                                                            } else if (isDate || isYear) {
                                                                inputType = "date";
                                                            } else if (isEmail) {
                                                                inputType = "email";
                                                            } else if (isContact) {
                                                                inputType = "tel";
                                                            }

                                                            return (
                                                                <td key={indCol}>
                                                                    {inputType !== "radio" ? (
                                                                        <input
                                                                            checked={false}
                                                                            readOnly={true}
                                                                            type={inputType}
                                                                        />
                                                                    ) : (
                                                                        <div>
                                                                            <label>
                                                                                <input
                                                                                    type="radio"
                                                                                    value="yes"
                                                                                    checked={false}
                                                                                    readOnly={true}
                                                                                />
                                                                                Yes
                                                                            </label>

                                                                            <label>
                                                                                <input
                                                                                    readOnly={true}
                                                                                    type="radio"
                                                                                    value="no"
                                                                                    checked={false}
                                                                                />
                                                                                No
                                                                            </label>
                                                                        </div>
                                                                    )}
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
        </>
    );
}
