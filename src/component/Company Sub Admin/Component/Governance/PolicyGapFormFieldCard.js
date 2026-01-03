import React, { useRef } from "react";
import { useState } from "react";
import "./GovernancePlicy.css";

export default function PolicyGapFormFieldCard({ plolicyGapValue, title }) {
  const [policyFormField, setPolicyFormField] = useState();
  const [file, setFile] = useState();
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const resetFileInput = () => {
    console.log("nidhi");
    // 👇️ reset input value
    // inputRef.current.value = null;
    // setFile();
    // console.log(file,"emplty file")
  };
  console.log(file?.name, "ftyftyjtf");
  return (
    <div>
      <div
        style={{
          display: "flex",
          columnGap: "10px",
          flexDirection: "row",
          width: "130px",
        }}
      >
        <select
          value={policyFormField}
          style={{
            padding: "5px 10px",
            width: "80px",
            borderRadius: "5px",
            border: "1px solid #E3EBED",
          }}
          onChange={(e) => {
            setPolicyFormField(e.target.value);
            //   plolicyGapValue(e.target.value);
          }}
        >
          <option>select</option>
          <option>yes</option>
          <option>No</option>
        </select>
        {policyFormField === "yes" && !file?.name && (
          <>
            <div
              className="upload_image2 d-flex align-items-center"
              style={{ width: "24px", height: "24px" }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                  fill="#A7ACC8"
                />
                <path
                  d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                  fill="#A7ACC8"
                  stroke="#A7ACC8"
                  strokeWidth="0.5"
                />
              </svg>
              <input
                type="file"
                ref={inputRef}
                name="governancePolicy"
                accept=".doc, .docx, .pdf"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
        {file?.name && (
          <div
            className="attachment_with_icons"
            onClick={() => {
              setFile();
            }}
          >
            <span>
              <a
                href="null"
                target="_blank"
                download=""
                style={{
                  color: "green",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                    fill="#A7ACC8"
                  ></path>
                  <path
                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                    fill="#A7ACC8"
                    stroke="#A7ACC8"
                    stroke-width="0.5"
                  ></path>
                </svg>
              </a>
              <span
                className="delete_attachment"
                data-id="411"
                aria-hidden="true"
              >
                ×
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
