import React, { useState, useEffect } from "react";
import { Form, Dropdown, Button, Row, Col } from "react-bootstrap";


const ScopeFrequency = ({
  handleHistoryClick

}) => {
  // const [fromDate, setFromDate] = useState(null);
  // const [toDate, setToDate] = useState(null);

  const item = {
    frequency: "ONE_TIME",
  }

  //   const [selectedSource, setSelectedSource] = useState("");
  //   const [meterList, setMeterList] = useState([]);
  //   const formatDate = (year, month) => {
  //     const formattedMonth = month.toString().padStart(2, "0"); // Ensure two digits for the month
  //     return `${year}-${formattedMonth}`;
  //   };

  //   useEffect(() => {
  //     if (sourceData) {
  //       const locationArray = sourceData?.reverse().map((item) => ({
  //         id: item.id,
  //         location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
  //         unitCode: item?.unitCode,
  //       }));
  //       if (locationArray && locationArray.length) {
  //         setMeterList(locationArray);
  //         setSelectedSource(
  //           locationArray[0]?.unitCode || locationArray[0]?.location
  //         );
  //         setSourceChange(locationArray[0]?.id);
  //         setAnswer((prevAnswer) => ({
  //           ...prevAnswer,
  //           sourceId: locationArray[0]?.id,
  //         }));
  //       }
  //     }
  //   }, [sourceData]);

  //   const handleSourceSelect = (key) => {
  //     const selectedItem = meterList.find((item) => item.id.toString() === key);
  //     if (selectedItem) {
  //       // Set the selected source to the item's location (name)
  //       setSelectedSource(selectedItem?.unitCode || selectedItem.location);
  //       setSourceChange(selectedItem?.id);
  //       // Update the answer state with the selected item's id
  //       setAnswer((prevAnswer) => ({
  //         ...prevAnswer,
  //         sourceId: Number(key),
  //       }));
  //     }
  //   };

  //   const getDropdownItems = () => {
  //     if (!item?.answerFrequency) return null;

  //     const getCurrentYearMonth = () => {
  //       const now = new Date();
  //       const year = now.getFullYear();
  //       const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  //       return `${year}-${month}`;
  //     };

  //     const isFromDateMatching = (fromDate) => {
  //       try {
  //         return matchingAuditors.some((auditor) => {
  //           const isFromDateMatch = auditor?.fromDate === fromDate;

  //           // Check if any remark contains the currentUserId
  //           let hasMatchingUserId = auditor?.remark?.some(
  //             (remark) => remark?.id == currentUserId 
  //           );

  //            const checker = ( Number(auditor?.auditerId) === Number(currentUserId))

  //           hasMatchingUserId = hasMatchingUserId && checker  ? false : hasMatchingUserId


  //           // Return true if the fromDate matches and no remark contains the currentUserId
  //           return isFromDateMatch && !hasMatchingUserId ;
  //         });
  //       } catch (error) {
  //         console.error("Error in isFromDateMatching:", error);
  //         return false;
  //       }
  //     };

  //     // const isDisabled = (currentYearMonth, fromDate, toDate) => {
  //     //   const fromYearMonth = fromDate.split('-').slice(0, 2).join('-');
  //     //   const toYearMonth = toDate.split('-').slice(0, 2).join('-');
  //     //   return currentYearMonth > fromYearMonth && currentYearMonth <= toYearMonth;
  //     // };

  //     const isDisabled = (currentDate, fromDate, toDate) => {
  //       return currentDate < toDate;
  //     };

  //     const getCurrentDate = () => {
  //       const now = new Date();
  //       const year = now.getFullYear();
  //       const month = (now.getMonth() + 1).toString().padStart(2, "0");
  //       const day = now.getDate().toString().padStart(2, "0");
  //       return `${year}-${month}-${day}`;
  //     };

  //     const currentYearMonth = getCurrentYearMonth();
  //     switch (item.answerFrequency) {
  //       case "MONTHLY":
  //         if (menu === "audit") {
  //           if (financialYear) {
  //             const currentDate = getCurrentDate();
  //             // Generate fromDate for each month and filter them
  //             // return Array.from({ length: 12 }, (_, i) => {
  //             //   const month = `M${i + 1}`;
  //             //   const fromDate = calculateDates(month).fromDate;

  //             //   // Check if the fromDate matches and no matching userId in remarks
  //             //   if (isFromDateMatching(fromDate)) {
  //             //     return (
  //             //       <Dropdown.Item key={month} eventKey={month}>
  //             //         {month}
  //             //       </Dropdown.Item>
  //             //     );
  //             //   }
  //             //   return null; // Exclude the month if conditions are not met
  //             // }).filter(Boolean); // Remove null entries
  //             return Array.from({ length: 12 }, (_, i) => {
  //               const month = `M${i + 1}`;
  //               const { fromDate, toDate } = calculateDates(month);

  //               // Check if the fromDate matches and no matching userId in remarks
  //               if (isFromDateMatching(fromDate)) {
  //                 // Determine if the dropdown item should be disabled based on the current date and date range
  //                 const disabled = isDisabled(currentDate, fromDate, toDate);

  //                 return (
  //                   <Dropdown.Item key={month} eventKey={month} disabled={disabled}>
  //                     {month}
  //                   </Dropdown.Item>
  //                 );
  //               }
  //               return null; // Exclude the month if conditions are not met
  //             }).filter(Boolean); // Remove null entries
  //           }
  //         } else {
  //           // If menu is not "audit", show all months M1 to M12
  //           // return Array.from({ length: 12 }, (_, i) => (
  //           //   <Dropdown.Item key={`M${i + 1}`} eventKey={`M${i + 1}`}>
  //           //     M{i + 1}
  //           //   </Dropdown.Item>
  //           // ));
  //           if(financialYear){
  //             const currentDate = getCurrentDate();
  //             return Array.from({ length: 12 }, (_, i) => {
  //               const month = `M${i + 1}`;
  //               const { fromDate, toDate } = calculateDates(month);

  //               const disabled = isDisabled(currentDate, fromDate, toDate);

  //               return (
  //                 <Dropdown.Item key={month} eventKey={month} disabled={disabled}>
  //                   {month}
  //                 </Dropdown.Item>
  //               );
  //             });

  //           }

  //         }

  //       case "QUARTERLY":
  //         if (menu === "audit") {
  //           if (financialYear) {
  //             // Calculate fromDate for each quarter
  //             const q1FromDate = calculateDates("Q1").fromDate;
  //             const q2FromDate = calculateDates("Q2").fromDate;
  //             const q3FromDate = calculateDates("Q3").fromDate;
  //             const q4FromDate = calculateDates("Q4").fromDate;

  //             const q1Dates = calculateDates("Q1");
  //             const q2Dates = calculateDates("Q2");
  //             const q3Dates = calculateDates("Q3");
  //             const q4Dates = calculateDates("Q4");

  //             const currentDate = getCurrentDate();

  //             return ["Q1", "Q2", "Q3", "Q4"]
  //               .filter((quarter) => {
  //                 // Check if fromDate matches and there is no matching userId in remarks
  //                 if (quarter === "Q1") return isFromDateMatching(q1FromDate);
  //                 if (quarter === "Q2") return isFromDateMatching(q2FromDate);
  //                 if (quarter === "Q3") return isFromDateMatching(q3FromDate);
  //                 if (quarter === "Q4") return isFromDateMatching(q4FromDate);
  //               })
  //               .map((quarter) => {
  //                 const dates =
  //                   quarter === "Q1"
  //                     ? q1Dates
  //                     : quarter === "Q2"
  //                     ? q2Dates
  //                     : quarter === "Q3"
  //                     ? q3Dates
  //                     : q4Dates;

  //                 // Check if the item should be disabled based on the current date and date range
  //                 const disabled = isDisabled(
  //                   currentDate,
  //                   dates.fromDate,
  //                   dates.toDate
  //                 );

  //                 return (
  //                   <Dropdown.Item
  //                     key={quarter}
  //                     eventKey={quarter}
  //                     disabled={disabled}
  //                   >
  //                     {quarter}
  //                   </Dropdown.Item>
  //                 );
  //               });
  //           }
  //         } else {
  //           if(financialYear){
  //             const q1Dates = calculateDates("Q1");
  //           const q2Dates = calculateDates("Q2");
  //           const q3Dates = calculateDates("Q3");
  //           const q4Dates = calculateDates("Q4");

  //           const currentDate = getCurrentDate();
  //           return ["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
  //             const dates =
  //               quarter === "Q1"
  //                 ? q1Dates
  //                 : quarter === "Q2"
  //                 ? q2Dates
  //                 : quarter === "Q3"
  //                 ? q3Dates
  //                 : q4Dates;


  //             const disabled = isDisabled(
  //               currentDate,
  //               dates.fromDate,
  //               dates.toDate
  //             );

  //             return (
  //               <Dropdown.Item
  //                 key={quarter}
  //                 eventKey={quarter}
  //                 disabled={disabled}
  //               >
  //                 {quarter}
  //               </Dropdown.Item>
  //             );
  //           });

  //           }

  //         }

  //       case "HALF_YEARLY":
  //         if (menu === "audit") {
  //           if (financialYear) {
  //             const h1FromDate = calculateDates("H1").fromDate;
  //             const h2FromDate = calculateDates("H2").fromDate;

  //             const h1Date = calculateDates("H1");
  //             const h2Date = calculateDates("H2");

  //             const currentDate = getCurrentDate();

  //             return ["H1", "H2"]
  //               .filter((halfYear) =>
  //                 halfYear === "H1"
  //                   ? isFromDateMatching(h1FromDate)
  //                   : isFromDateMatching(h2FromDate)
  //               )
  //               .map((halfYear) => {
  //                 const dates =
  //                   halfYear === "H1"
  //                     ? h1Date
  //                     : halfYear === "H2"
  //                     ? h2Date

  //                     : [];


  //                 const disabled = isDisabled(
  //                   currentDate,
  //                   dates.fromDate,
  //                   dates.toDate
  //                 );

  //                 return (
  //                   <Dropdown.Item
  //                     key={halfYear}
  //                     eventKey={halfYear}
  //                     disabled={disabled}
  //                   >
  //                     {halfYear}
  //                   </Dropdown.Item>
  //                 );
  //               });
  //           }
  //         } else {
  //           if (financialYear) {
  //             const h1Date = calculateDates("H1");
  //             const h2Date = calculateDates("H2");
  //             // If menu is not "audit", show both H1 and H2

  //             const currentDate = getCurrentDate();
  //             return ["H1", "H2"].map((halfYear) => {
  //               const dates =
  //                 halfYear === "H1"
  //                   ? h1Date
  //                   : halfYear === "H2"
  //                   ? h2Date

  //                   : [];


  //               const disabled = isDisabled(
  //                 currentDate,
  //                 dates.fromDate,
  //                 dates.toDate
  //               );

  //               return (
  //                 <Dropdown.Item
  //                   key={halfYear}
  //                   eventKey={halfYear}
  //                   disabled={disabled}
  //                 >
  //                   {halfYear}
  //                 </Dropdown.Item>
  //               );
  //             });

  //           }

  //         }
  //       case "YEARLY":
  //         return (
  //           <Dropdown.Item key="Y1" eventKey="Y1">
  //             Y1
  //           </Dropdown.Item>
  //         );
  //       default:
  //         return null;
  //     }
  //   };

  //   const calculateMonthYear = (baseYear, baseMonth, monthOffset) => {
  //     const adjustedMonth = ((baseMonth - 1 + monthOffset) % 12) + 1;
  //     const yearOffset = Math.floor((baseMonth - 1 + monthOffset) / 12);
  //     const adjustedYear = baseYear + yearOffset;
  //     return { year: adjustedYear, month: adjustedMonth };
  //   };

  //   const calculateDates = (period) => {
  //     const [startYear, endYear] = financialYear?.split("-").map(Number);
  //     let baseYear = startYear;
  //     let baseMonth = startingMonth;

  //     let fromDate, toDate; // Declare variables to store fromDate and toDate

  //     switch (period) {
  //       // Monthly cases
  //       case "M1":
  //         const m1 = calculateMonthYear(baseYear, baseMonth, 0);
  //         fromDate = formatDate(m1.year, m1.month);
  //         toDate = formatDate(m1.year, m1.month + 1);
  //         break;

  //       case "M2":
  //         const m2 = calculateMonthYear(baseYear, baseMonth, 1);
  //         fromDate = formatDate(m2.year, m2.month);
  //         toDate = formatDate(m2.year, m2.month + 1);
  //         break;

  //       case "M3":
  //         const m3 = calculateMonthYear(baseYear, baseMonth, 2);
  //         fromDate = formatDate(m3.year, m3.month);
  //         toDate = formatDate(m3.year, m3.month + 1);
  //         break;

  //       case "M4":
  //         const m4 = calculateMonthYear(baseYear, baseMonth, 3);
  //         fromDate = formatDate(m4.year, m4.month);
  //         toDate = formatDate(m4.year, m4.month + 1);
  //         break;

  //       case "M5":
  //         const m5 = calculateMonthYear(baseYear, baseMonth, 4);
  //         fromDate = formatDate(m5.year, m5.month);
  //         toDate = formatDate(m5.year, m5.month + 1);
  //         break;

  //       case "M6":
  //         const m6 = calculateMonthYear(baseYear, baseMonth, 5);
  //         fromDate = formatDate(m6.year, m6.month);
  //         toDate = formatDate(m6.year, m6.month + 1);
  //         break;

  //       case "M7":
  //         const m7 = calculateMonthYear(baseYear, baseMonth, 6);
  //         fromDate = formatDate(m7.year, m7.month);
  //         toDate = formatDate(m7.year, m7.month + 1);
  //         break;

  //       case "M8":
  //         const m8 = calculateMonthYear(baseYear, baseMonth, 7);
  //         fromDate = formatDate(m8.year, m8.month);
  //         toDate = formatDate(m8.year, m8.month + 1);
  //         break;

  //       case "M9":
  //         const m9 = calculateMonthYear(baseYear, baseMonth, 8);
  //         fromDate = formatDate(m9.year, m9.month);
  //         toDate = formatDate(m9.year, m9.month + 1);
  //         break;

  //       case "M10":
  //         const m10 = calculateMonthYear(baseYear, baseMonth, 9);
  //         fromDate = formatDate(m10.year, m10.month);
  //         toDate = formatDate(m10.year, m10.month + 1);
  //         break;

  //       case "M11":
  //         const m11 = calculateMonthYear(baseYear, baseMonth, 10);
  //         fromDate = formatDate(m11.year, m11.month);
  //         toDate = formatDate(m11.year, m11.month + 1);
  //         break;

  //       case "M12":
  //         const m12 = calculateMonthYear(baseYear, baseMonth, 11);
  //         fromDate = formatDate(m12.year, m12.month);
  //         toDate = formatDate(m12.year, m12.month + 1);
  //         break;

  //       // Quarterly cases
  //       case "Q1":
  //         fromDate = formatDate(baseYear, baseMonth);
  //         toDate = formatDate(
  //           baseMonth + 3 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 3 > 12 ? baseMonth + 3 - 12 : baseMonth + 3
  //         );
  //         break;

  //       case "Q2":
  //         fromDate = formatDate(
  //           baseMonth + 3 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 3 > 12 ? baseMonth + 3 - 12 : baseMonth + 3
  //         );
  //         toDate = formatDate(
  //           baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
  //         );
  //         break;

  //       case "Q3":
  //         fromDate = formatDate(
  //           baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
  //         );
  //         toDate = formatDate(
  //           baseMonth + 9 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 9 > 12 ? baseMonth + 9 - 12 : baseMonth + 9
  //         );
  //         break;

  //       case "Q4":
  //         fromDate = formatDate(
  //           baseMonth + 9 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 9 > 12 ? baseMonth + 9 - 12 : baseMonth + 9
  //         );
  //         toDate = formatDate(
  //           baseYear + 1,
  //           baseMonth === 1 ? 1 : ((baseMonth - 1 + 12) % 12) + 1
  //         );
  //         break;

  //       // Half-yearly cases
  //       case "H1":
  //         fromDate = formatDate(baseYear, baseMonth);
  //         toDate = formatDate(
  //           baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
  //         );
  //         break;

  //       case "H2":
  //         fromDate = formatDate(
  //           baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
  //           baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
  //         );
  //         toDate = formatDate(
  //           baseYear + 1,
  //           baseMonth === 1 ? 1 : ((baseMonth - 1 + 12) % 12) + 1
  //         );
  //         break;

  //       // Yearly case
  //       case "Y1":
  //         fromDate = formatDate(baseYear, baseMonth);
  //         toDate = formatDate(baseYear + 1, baseMonth);
  //         break;

  //       default:
  //         fromDate = "";
  //         toDate = "";
  //         break;
  //     }

  //     return { fromDate, toDate };
  //   };

  //   useEffect(() => {
  //     if (selectedPeriod && financialYear) {
  //       const { fromDate, toDate } = calculateDates(selectedPeriod);

  //       // Only update the state if the values have changed
  //       setFromDate((prev) => (prev !== fromDate ? fromDate : prev));
  //       setToDate((prev) => (prev !== toDate ? toDate : prev));
  //       setAnswer((prevAnswer) => ({
  //         ...prevAnswer,
  //         fromDate:
  //           prevAnswer.fromDate !== fromDate ? fromDate : prevAnswer.fromDate,
  //         toDate: prevAnswer.toDate !== toDate ? toDate : prevAnswer.toDate,
  //       }));
  //     }
  //   }, [selectedPeriod]);

  const generateRandomItems = (numItems) => {
    const items = [];
    for (let i = 0; i < numItems; i++) {
      const randomItem = `Item ${Math.floor(Math.random() * 100) + 1}`;
      items.push(randomItem);
    }
    return items;
  };

  const randomItems = generateRandomItems(5);

  return (
    <>
      <div style={{ width: "30%" }}>
        <div className="d-flex">

          <div className="mx-1">
            <Form.Group controlId="formInput10">
              <Form.Label className="custom-label">
                Period Selection
              </Form.Label>
              <div className="select-wrapper">
                {item?.frequency === "ONE_TIME" ||
                  item?.frequency === "EVERY_FY" ? (
                  <Form.Control
                    type="text"
                    value={
                      item?.frequency === "ONE_TIME"
                        ? "One Time"
                        : item?.frequency === "EVERY_FY"
                          ? "Every Financial Year"
                          : item?.frequency
                    }
                    readOnly
                    style={{
                      backgroundColor: "#Dfebef",
                      color: "black",
                    }}
                  />
                ) : item?.frequency === "CUSTOM" ? (
                  <Dropdown onSelect={() => {
                    console.log("hi")
                  }}>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      style={{
                        backgroundColor: "#Dfebef",
                        color: "black",
                        borderColor: "white",
                      }}
                    >
                      <span style={{ marginRight: "5%" }}>
                        {"Select Period"}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {randomItems.map((item, index) => (
                        <Dropdown.Item key={index} href="#">
                          {item}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </div>
            </Form.Group>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          textAlign: "right",
          marginTop: "25px",
        }}
      >
        <Button
          variant=""
          style={{
            padding: "8px 30px",
            marginRight: 0,
            backgroundColor: "transparent",
            borderRadius: "5px",
            borderColor: "#3F88A5",
            fontSize: "14px",
            fontFamily: "Open Sans",
            fontWeight: "700",
          }}
          onClick={handleHistoryClick}
        >
          History
        </Button>
      </div>
    </>
  );
};

export default ScopeFrequency;
