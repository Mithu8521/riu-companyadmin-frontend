/* eslint-disable array-callback-return */
import React from "react";
const Listing = (props) => {
  return (
    <>
      {props.items.map((item, index) => {
        if (item !== " ") {
          return <li key={index}>{item}</li>;
        }
      })}
    </>
  );
};

export default Listing;
