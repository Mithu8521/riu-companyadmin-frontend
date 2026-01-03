import React from "react";

import DateShow from "./datashow";
// import ParentExcel from "./parentexcel";

const Flagvalues = () => {
  return (
    <div className="container mx-auto p-4">
      <DateShow />
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  );
};

export default Flagvalues;
