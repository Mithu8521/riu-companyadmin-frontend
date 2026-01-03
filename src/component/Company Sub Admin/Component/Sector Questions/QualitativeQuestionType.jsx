import React, { useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";

const QualitativeQuestionType = ({ title, answer, note, proofDocuments, documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const documentGridContainerStyle = {
    width: "100%",
    padding: "10px",
    marginLeft: "0px",
    marginTop: "3%",
  };

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  };

  const documentGridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "0"
  };

  const documentColStyle = {
    flex: "0 0 calc(33.333% - 7px)",
    maxWidth: "calc(33.333% - 7px)",
    marginBottom: "10px",
    boxSizing: "border-box"
  };

  const documentItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6f2f5",
    borderRadius: "4px",
    padding: "8px 16px",
    height: "40px",
    overflow: "hidden"
  };

  const handleFileDownload = (url) => {
    const replacedUrl = url.replace(
      "https://riu-bucket.s3.ap-south-1.amazonaws.com",
      "https://copyadatafromawstoazure.blob.core.windows.net/uploads"
    );
    const link = document.createElement("a");
    link.href = replacedUrl;
    link.target = "_blank"; // Opens in a new tab
    link.download = replacedUrl.split("/").pop();
    document.body.appendChild(link); // Append to body
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const getTotalDocuments = () => {
    const urls = (proofDocuments ?? [])
      .flatMap(obj =>
        Object.keys(obj).map(key => documents?.[key]?.fileMetadata?.url || null)
      )
      .filter(Boolean);

    return [...new Set(urls)];
  };


  const processDocuments = () => {
    const totalDocs = getTotalDocuments();
    if (!searchTerm) {
      return totalDocs;
    }

    return totalDocs.filter(doc => {
      const docSegments = doc.split("/");
      const docFileName = decodeURIComponent(docSegments[docSegments.length - 1]);
      return docFileName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const totalDocuments = getTotalDocuments();
  const filteredDocs = processDocuments();
  const shouldShowSearchBar = totalDocuments.length > 10;

  return (
    <div>
      <div
        style={{
          color: "#3F88A5",
          fontSize: "14px",
          fontFamily: "Open Sans",
          marginBottom: "10px",
          fontWeight: "600",
          wordWrap: "break-word",
        }}
      >
        {answer}
      </div>
      {note && (
        <>
          <div
            style={{
              color: "black",
              fontSize: "16px",
              fontFamily: "Open Sans",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {" "}
            Note{" "}
          </div>

          <div
            style={{
              color: "#3F88A5",
              fontSize: "14px",
              fontFamily: "Open Sans",
              marginBottom: "10px",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {note}
          </div>
        </>
      )}
      {filteredDocs.length > 0 && (
        <div style={documentGridContainerStyle}>
          {shouldShowSearchBar && (
            <div style={searchContainerStyle}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px"
                }}
              />
            </div>
          )}

          <div style={documentGridStyle}>
            {filteredDocs.map((rawUrl, index) => {
              let cleanedUrl = rawUrl;
              if (typeof cleanedUrl === 'string') {
                cleanedUrl = cleanedUrl.replace(/^["'\s]+|["'\s]+$/g, '');
              }

              const urlParts = cleanedUrl.split(".pdf");

              if (urlParts.length > 2) {
                cleanedUrl = urlParts[0] + ".pdf";
              }

              const docSegments = cleanedUrl.split("/");
              const docFileName = decodeURIComponent(docSegments[docSegments.length - 1]);

              return (
                <div key={index} style={documentColStyle}>
                  <div style={documentItemStyle}>
                    <span
                      style={{
                        flexGrow: 1,
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={docFileName}
                    >
                      {docFileName}
                    </span>

                    <IoDownloadOutline
                      style={{
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                        color: "#333",
                        flexShrink: 0
                      }}
                      onClick={() => handleFileDownload(rawUrl)}
                      title="Download File"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDocs.length === 0 && searchTerm.length > 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "#6c757d" }}>
              No documents found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QualitativeQuestionType;