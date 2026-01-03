import React from "react";

const DownloadIcon = ({ attachment }) => {
  // console.log(props)
  //   const { attachment } = props;
  const handleDownload = async (attachment) => {
    const url = attachment;
    try {
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  return (
    <span style={{ position: "relative" }}>
      <button style={{ border: "none", background: "none" }}
        onClick={() => {
          handleDownload(attachment);
        }}
      >
        <svg width="24" height="24" viewBox="0 0 34 34" fill="none" >
          <path d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
            fill="#009933" ></path>
          <path d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
            fill="#009933" stroke="#009933" strokeWidth="0.5" ></path>
        </svg>
      </button>
      <span className="delete_attachment" data-id="411" aria-hidden="true">×</span>
    </span>
  );
};

export default DownloadIcon;
