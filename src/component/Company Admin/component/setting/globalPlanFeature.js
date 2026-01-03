/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
function GlobalPlanFeature(props) {
  return (
    <>
      {props.items.map((item, key) => {
        if (item !== '') {
          return <li key={key}>
            <b>{key + 1 + ". "}</b> {item}

          </li>
        }
      })}

    </>
  );
}

export default GlobalPlanFeature;