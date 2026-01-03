import React from "react";

const UploadIcon = (props) => {
  const { setUploadItem, uploadFile, questionData } = props;

  return (
    <div>
      <input
        id="upload"
        type="file"
        className="d-none"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            uploadFile(e, questionData);
          }
        }}
      />
      <div className="file file--upload hstack">
        <label
          htmlFor="upload"
          onClick={(e) => setUploadItem({ item: questionData })}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 34 34"
            fill="none"
            style={{ cursor: "pointer" }}
          >
            <path
              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
              fill="#3f88a5"
            ></path>
            <path
              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
              fill="#3f88a5"
              stroke="#3f88a5"
              strokeWidth="0.5"
            ></path>
          </svg>
        </label>
      </div>
    </div>
  );
};
export default UploadIcon;
