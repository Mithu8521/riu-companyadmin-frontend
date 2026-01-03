import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import RowComponent from "./RowComponent";


const TabularComponent = ({
  isReadOnly,
  edit,
  menu,
  currentQuestion,
  matchedAnswer,
  setAnswer,
  emissionData,
  currentPage,
  setCurrentPage,
  handleDoubleClick
}) => {
  const isAudit = (menu === 'audit');
  const [note, setNote] = useState();
  const [ro, setRo] = useState();
  const [co, setCo] = useState();

  const columns = currentQuestion?.details
    ?.filter((detail) => /^column\d*$/.test(detail?.option_type))
    .reverse() || [currentQuestion?.details];

  const [rows, setRows] = useState(
    currentQuestion?.details
      ?.filter((detail) => detail?.option_type === "row")
      .reverse() || []
  );

  const [heading, setHeading] = useState(
    currentQuestion?.details
      ?.filter((detail) => detail?.option_type === "heading")
      .reverse() || []
  );

  const [updatedRows, setUpdatedRows] = useState();
  const [radioValue, setRadioValue] = useState("");

  const initialize2DArray = (data) => {
    // Initialize an empty object to track column counts per row
    let columnCounts = {};

    // Iterate through data to determine maximum columns for each row
    (data || []).forEach((item) => {
      if (item.option_type.startsWith("column")) {
        let rowNumber = parseInt(item.option_type.replace("column", ""));
        columnCounts[rowNumber] = (columnCounts[rowNumber] || 0) + 1;
      }
    });

    // Find maximum columns from columnCounts
    let maxColumns = Math.max(...Object.values(columnCounts));

    // Initialize an empty 2D array
    let result = [];

    // Create each row with the determined number of columns
    for (let i = 0; i < Object.keys(columnCounts).length; i++) {
      let row = new Array(maxColumns).fill("");
      result.push(row);
    }

    return result;
  };

  const initializeArray = (numRows, numCols) => {
    const newArray = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(""); // Initialize each cell with an empty string or any default value
      }
      newArray.push(row);
    }
    return newArray;
  };

  const formatNote = (note) => {
    // Check if note is a string
    if (typeof note === "string") {
      return [[note]]; // Wrap the string in a 2D array
    }

    // Check if note is a 2D array
    if (Array.isArray(note) && Array.isArray(note[0])) {
      return note; // Use it as is
    }

    // If note is not a string or a 2D array, return an empty 2D array
    return [[""]];
  };

  const initializeAnswer = () => {
    if (currentQuestion) {
      if (matchedAnswer) {
        try {
          // Parse the answer as a 2D array
          setNote((prevState) => {
            return formatNote(matchedAnswer.note);
          });

          const answerObject = JSON.parse(matchedAnswer.answer);

          // Ensure that the parsed answer is a 2D array
          if (Array.isArray(answerObject) && Array.isArray(answerObject[0])) {
            const standaloneOption =
              "Disclosures under this report made on a standalone basis (i.e. only for the entity).";
            const consolidatedOption =
              "On a consolidated basis (i.e. for the entity & all the entities which form a part of its consolidated financial statements, taken together)";
            answerObject[0].forEach((answer) => {
              if (
                answer === standaloneOption ||
                answer === consolidatedOption
              ) {
                setRadioValue(answer);
              }
            });
            setUpdatedRows(answerObject);

            setAnswer((prevAnswer) => ({
              ...prevAnswer,
              answer: JSON.stringify(answerObject),
              note: formatNote(matchedAnswer.note)
            }));
          } else {
            console.error(
              "Parsed answer is not a valid 2D array:",
              answerObject
            );
          }
        } catch (error) {
          console.error(
            "Error parsing matchedAnswer.answer:",
            error,
            matchedAnswer,
            currentQuestion
          );
        }
      } else {
        setNote([[""]]);
        const ro =
          currentQuestion?.details
            ?.filter((detail) => detail?.option_type === "row")
            .reverse() || [];
        const colum =
          currentQuestion?.details
            ?.filter((detail) => detail?.option_type === "column")
            .reverse() || [];
        const numRows = ro.length;
        const numCols = colum.length;
        if (numRows > 0 && numCols > 0) {
          const updatedRows = initializeArray(numRows, numCols);
          const note = initializeArray(numRows, numCols);
          setUpdatedRows(updatedRows);
          setNote(note);
          setAnswer((prevState) => ({
            ...prevState,
            note: note,
            answer: JSON.stringify(updatedRows)
          }));
        } else {
          const updatedRows = initialize2DArray(currentQuestion.details || []);
          const note = initialize2DArray(currentQuestion.details || []);
          setUpdatedRows(updatedRows);
          setNote(note);
          setAnswer((prevState) => ({
            ...prevState,
            note: note,
            answer: JSON.stringify(updatedRows)
          }));
        }
      }
    }
  };

  useEffect(() => {
    setRows(
      currentQuestion?.details
        ?.filter((detail) => detail?.option_type === "row")
        .reverse() || []
    );
  }, [currentQuestion]);

  useEffect(() => {
    initializeAnswer();
  }, [matchedAnswer, currentQuestion]);

  const handleInputChange = (rowIndex, colId, value) => {
    setUpdatedRows(prevRows => {
      const newRows = prevRows.map(row => Array.isArray(row) ? [...row] : row);

      if (!Array.isArray(newRows[rowIndex])) {
        newRows[rowIndex] = [];
      }

      newRows[rowIndex][colId] = value;

      setAnswer(prevAnswer => ({
        ...prevAnswer,
        answer: JSON.stringify(newRows),
      }));

      return newRows;
    });
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;

    const updatedNote = [...note];

    // Ensure currentIndex exists in the array
    if (!updatedNote[currentPage]) {
      updatedNote[currentPage] = [];
    }

    // Update the note at currentIndex
    updatedNote[currentPage] = newNote;

    setNote(updatedNote);

    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      note:
        prevAnswer.note &&
          Array.isArray(prevAnswer.note) &&
          Array.isArray(prevAnswer.note[0])
          ? [
            ...prevAnswer.note.slice(0, currentPage),
            [newNote],
            ...prevAnswer.note.slice(currentPage + 1),
          ]
          : [[newNote]], // Convert to 2D array if it's not already
    }));
  };


  const handleNextPage = () => {
    if (updatedRows.length > currentPage + 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePlusPage = () => {
    if (currentQuestion?.details.some((item) => item.option_type == "row" && item.option == 1)) {
      const temp = {
        option_type: "row",
        option: "1",
        rules: null,
      };
      setRows((prevRows) => [...prevRows, temp]);
      if (updatedRows?.length <= currentPage + 1) {
        const tmpupdatedRows = [...updatedRows];
        const tempNote = [...note];
        const ro =
          currentQuestion?.details
            ?.filter((detail) => detail?.option_type === "row")
            .reverse() || [];
        const colum =
          currentQuestion?.details
            ?.filter((detail) => detail?.option_type === "column")
            .reverse() || [];
        const numRows = ro.length;
        const numCols = colum.length;
        const initializeArrays = initializeArray(numRows, numCols);
        tmpupdatedRows.push(initializeArrays[0]);
        setNote(tempNote);
        setUpdatedRows(tmpupdatedRows);
        setAnswer((prevAnswer) => ({
          ...prevAnswer,
          note: tempNote,
          proofDocument: [...(prevAnswer?.proofDocument ?? []), {}],
          answer: JSON.stringify(tmpupdatedRows)
        }));
      }
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      {rows.length > 0 && (
        <RowComponent
          isReadOnly={isReadOnly}
          menu={menu}
          handleNoteChange={handleNoteChange}
          edit={edit}
          rowIndex={currentPage}
          columns={columns}
          heading={heading}
          note={note?.[currentPage]}
          rowData={rows[currentPage]}
          currentQuestion={currentQuestion}
          handleInputChange={handleInputChange}
          updatedRows={updatedRows}
          initialRadioValue={radioValue}
          emissionData={emissionData}
          handleDoubleClick={handleDoubleClick}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex" style={{ justifyContent: "flex-end", gap: "5px", flex: 1 }}>
          {rows[0] &&
            rows[0]?.option === "1" && !isReadOnly &&
             (
                <Button
                  className="btn btn-primary"
                  disabled={!edit || isReadOnly}
                  style={{
                    borderColor: "white",
                    backgroundColor: "#3F88A5",
                    padding: "1%",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                    width: "5%",
                    minWidth: "50px",
                    maxWidth: "150px",
                  }}
                  onClick={handlePlusPage}
                  title="Add more"
                >
                  +
                </Button>
            )}
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 gap-3">
        {/* {rows.length !== 1 && currentPage >= 1 && ( */}
        <div className="arrow-container">
          <Button
            disabled={currentPage <= 0}
            onClick={handlePreviousPage}
            style={{
              borderColor: "white",
              backgroundColor: "#3F88A5",
              padding: "1%",
              paddingLeft: "1.5%",
              paddingRight: "1.5%",
              width: "15%",
              minWidth: "100px",
              maxWidth: "150px",
            }}
          >
            Previous
          </Button>
        </div>
        <div className="arrow-container">
          <Button
            onClick={handleNextPage}
            disabled={(updatedRows?.length ?? 0) <= 1 || currentPage >= (updatedRows?.length ?? 0) - 1}
            style={{
              borderColor: "white",
              backgroundColor: "#3F88A5",
              padding: "1%",
              paddingLeft: "1.5%",
              paddingRight: "1.5%",
              width: "15%",
              minWidth: "100px",
              maxWidth: "150px",
            }}
          >
            Next
          </Button>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default TabularComponent;
