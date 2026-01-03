/* eslint-disable array-callback-return */
import React from "react";

export const Recommendations = (props) => {
  let result = [];

  result = Object.keys(props.items).map((key) => [
    String(key),
    props.items[key],
  ]);

  return (
    <>
      {result.map((item, index) => {
        if (item[1] === true) {
          let final = item[0].replace(/([A-Z])/g, " $1").trim();
          let finalText = "";
          if (final === "governance") {
            finalText = "Governance";
          } else if (final === "board Skills") {
            finalText = "Board Skills";
          } else if (final === "social Capital") {
            finalText = "Social Capital";
          } else if (final === "leadership And Governance") {
            finalText = "Leadership And Governance";
          } else if (final === "business Model And Innovation") {
            finalText = "Business Model And Innovation";
          } else if (final === "human Capital") {
            finalText = "Human Capital";
          } else if (final === "cyber Digital") {
            finalText = "Cyber Digital";
          } else if (final === "environmental Capital") {
            finalText = "Environmental Capital";
          } else if (final === "gresb") {
            finalText = "GRESB";
          } else if (final === "cdp") {
            finalText = "CDP";
          } else if (final === "sasb") {
            finalText = "SASB";
          } else if (final === "gri") {
            finalText = "GRI";
          } else if (final === "generate Report") {
            finalText = "Generate Report";
          } else if (final === "esg Policy") {
            finalText = "ESG Policy";
          } else if (final === "main") {
            finalText = "Main";
          } else if (final === "code Of Conduct") {
            finalText = "Code Of Conduct";
          } else if (final === "high") {
            finalText = "High";
          } else if (final === "medium") {
            finalText = "Medium";
          } else if (final === "environment Topics") {
            finalText = "Environment Topics";
          } else if (final === "social Topics") {
            finalText = "Social Topics";
          } else if (final === "governance Topics") {
            finalText = "Governance Topics";
          } else if (final === "business Model") {
            finalText = "Business Model";
          } else if (final === "building Consumption") {
            finalText = "Building Consumption";
          } else if (final === "green Power") {
            finalText = "Green Power";
          } else if (final === "Emission Two Other") {
            finalText = "Scope Two Emission";
          } else if (final === "Emission Three Other") {
            finalText = "Scope Three Emission";
          } else if (final === "sdg") {
            finalText = "SDG";
          }
          return (
            <span key={index}>
              <span className="skills">{finalText}</span>
            </span>
          );
        }
      })}
    </>
  );
};
