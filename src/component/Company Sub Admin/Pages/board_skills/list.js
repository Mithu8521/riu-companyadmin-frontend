/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
function List(props) {
  return (
    <>
      {props.items.map((item, index) => {
        if (item !== '') {
          return <li key={index}><span className="skills">{item}</span></li>
        }
      })}

    </>
  );
}

export default List;