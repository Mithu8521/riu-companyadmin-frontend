/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactPaginate from "react-paginate";
import "./pagination.css";

const Pagination = ({ PageCount, ChangePage }) => {
  return (
    <>
      <ReactPaginate
        pageCount={PageCount}
        pageRange={2}
        marginPagesDisplayed={2}
        onPageChange={ChangePage}
        containerClassName="pagination"
        previousLinkClassName="page"
        breakClassName="page"
        nextLinkClassName="page"
        pageClassName="pages"
        disabledClassName="disabled"
        activeClassName="active"
      />
    </>
  );
};

export default Pagination;
