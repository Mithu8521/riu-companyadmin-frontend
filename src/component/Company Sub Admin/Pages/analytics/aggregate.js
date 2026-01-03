export const aggregate = (allAnswers) => {
    allAnswers.reduce((acc, item) => {
        if (!item.answer) {
          return acc;
        }
  
        try {
          let parsedAnswer = JSON.parse(item.answer);
  
          if (item.questionType === "tabular_question") {
            // Ensure `parsedAnswer` is an array
            if (!Array.isArray(parsedAnswer)) {
              console.warn("Parsed answer for tabular question is not an array:", parsedAnswer);
              return acc;
            }
  
            // Check if this question already exists in accumulator
            const existing = acc.find((a) => a.questionId === item?.questionId);
  
            // Async function to handle the question details and aggregation
            (async function handleTabularQuestion() {
              try {
  
                if (existing) {
                  // Aggregate values at the same index
                  let existingAnswer;
                  try {
                    existingAnswer = JSON.parse(existing.answer[0]);
                  } catch (error) {
                    console.error("Failed to parse existing.answer[0]:", existing.answer[0]);
                    existingAnswer = null; // Or handle the error value appropriately
                  }
  
                  console.log(`Existing answer for question ID ${item?.questionId}: ${existingAnswer}`);
                  parsedAnswer.forEach((row, rowIndex) => {
                    row.forEach((value, colIndex) => {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        existingAnswer[rowIndex] = existingAnswer[rowIndex] || [];
                        existingAnswer[rowIndex][colIndex] =
                          (existingAnswer[rowIndex][colIndex] || 0) + numValue;
                      }
                    });
                  });
                  existing.answer = JSON.stringify(existingAnswer);
                } else {
                  // Add a new entry if it doesn't already exist
                  acc.push({
                    ...item
                  });
                }
              } catch (error) {
                console.error(`Error fetching question ID ${item?.questionId}:`, error);
              }
            })();
          }
          else if (item.questionType === "quantitative_trends") {
            // Handle quantitative_trends question type
            const { questionId, readingValue = 0, fromDate, toDate, ...rest } = parsedAnswer;
  
            if (!questionId) {
              console.warn("Missing questionId in parsedAnswer:", parsedAnswer);
              return acc;
            }
  
            const existing = acc.find((a) => {
              const existingParsedAnswer = JSON.parse(a.answer);
              if (!existingParsedAnswer)
                return;
              else {
                return (
                  existingParsedAnswer.questionId === questionId &&
                  existingParsedAnswer.fromDate === fromDate &&
                  existingParsedAnswer.toDate === toDate
                );
              }
  
            });
  
            if (existing) {
              const existingParsedAnswer = JSON.parse(existing.answer);
              const existingValNum = Number(existingParsedAnswer.readingValue);
              const readingValueNum = Number(readingValue);
  
              if (!isNaN(existingValNum)) {
                if (!isNaN(readingValueNum)) {
                  existingParsedAnswer.readingValue = existingValNum + readingValueNum;
                } else if (!isNaN(parseFloat(readingValue))) {
                  existingParsedAnswer.readingValue = existingValNum + parseFloat(readingValue);
                }
              }
  
              existing.answer = JSON.stringify(existingParsedAnswer);
            } else {
              acc.push({
                ...item,
                answer: JSON.stringify({
                  questionId,
                  readingValue,
                  fromDate,
                  toDate,
                  ...rest,
                }),
              });
            }
          }
          else if (item.questionType === "yes_no") {
            // Handle yes_no question type
            const { questionId, fromDate, toDate, notApplicable, answer } = item;
  
            if (!questionId) {
              console.warn("Missing questionId in yes_no question:", item);
              return acc;
            }
            const parsedAnswer = JSON.parse(answer);
  
            console.log("Parsed answer from yes no question" + parsedAnswer)
  
            // Extract yes or no
            const extractedAnswer = parsedAnswer && parsedAnswer.answer && parsedAnswer.answer.trim().toLowerCase() === "yes" ? "yes" : "no";
  
            // Check if this question already exists in the accumulator
            const existing = acc.find((a) => {
              const existingParsedAnswer = JSON.parse(a.answer || "{}");
              return (
                existingParsedAnswer.questionId === questionId &&
                existingParsedAnswer.fromDate === fromDate &&
                existingParsedAnswer.toDate === toDate
              );
            });
  
            if (existing) {
              let existingParsedAnswer;
              try {
                existingParsedAnswer = JSON.parse(existing.answer || "{}");
              } catch (error) {
                existingParsedAnswer = { answerCounts: { Yes: 0, No: 0 } };
              }
  
              const existingAnswerCounts = existingParsedAnswer.answerCounts || { Yes: 0, No: 0 };
  
              if (typeof extractedAnswer === "string" && extractedAnswer.toLowerCase() === "yes") {
                existingAnswerCounts.Yes += 1;
              } else if (typeof extractedAnswer === "string" && extractedAnswer.toLowerCase() === "no") {
                existingAnswerCounts.No += 1;
              }
  
              existingParsedAnswer.notApplicable = existingParsedAnswer.notApplicable || notApplicable;
              existingParsedAnswer.answerCounts = existingAnswerCounts;
              existingParsedAnswer.answer = `No (${existingAnswerCounts.No}), Yes (${existingAnswerCounts.Yes})`;
  
              existing.answer = JSON.stringify(existingParsedAnswer);
            } else {
              const initialCounts = { Yes: 0, No: 0 };
              if (typeof extractedAnswer === "string" && extractedAnswer.toLowerCase() === "yes") {
                initialCounts.Yes = 1;
              } else if (typeof extractedAnswer === "string" && extractedAnswer.toLowerCase() === "no") {
                initialCounts.No = 1;
              }
  
              existing = {
                notApplicable,
                answer: JSON.stringify({
                  answerCounts: initialCounts,
                  answer: `No (${initialCounts.No}), Yes (${initialCounts.Yes})`,
                }),
              };
            }
  
  
          }
  
        } catch (error) {
          console.error("Error parsing answer:", item.answer, error);
        }
  
        return acc;
      }, [])
}