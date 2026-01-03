// PDFReader.jsx
import React, { useState, useEffect } from "react";
import pdfToText from "react-pdftotext";
import { createWorker } from "tesseract.js";
import ChatService from "./AIChatService.jsx";

const PDFReader = ({ file, onValueChange  }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setExtractedValue = (newValue) => {
    // Trigger the parent's callback with the new value
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const readPDF = async (pdfFile) => {
    setLoading(true);
    setError(null);
    try {
      const extractedText = await pdfToText(pdfFile);
      if (extractedText.trim()) {
        console.log("Extracted PDF text:", extractedText);
        let aiOutput = await new ChatService().getResponse(extractedText);
        setText(aiOutput);
        setExtractedValue(aiOutput)
      } else {
        // If no text extracted, perform OCR
        const worker = createWorker({
          logger: (m) => console.log(m),
        });
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const { data: { text: ocrText } } = await worker.recognize(pdfFile);
        console.log("OCR Extracted text:", ocrText);
        setText(ocrText);
        await worker.terminate();
      }
    } catch (err) {
      console.error("Failed to extract text from PDF:", err);
      setError("Failed to extract text from PDF.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      readPDF(file);
    } else {
      setText("");
      setError(null);
    }
  }, [file]);

  return (
    <div>
      {loading && <p>Extracting text from PDF...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Show the extracted text in a read-only textarea */}
      <p
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          fontSize: "16px",
          whiteSpace: "pre-wrap", // Preserve line breaks
          border: "1px solid #ccc", // Optional border for a textarea-like feel
          backgroundColor: "#f9f9f9", // Optional background color for readability
        }}
      >
        {text || "Extracted text will appear here..."}
      </p>
    </div>
  );
};

export default PDFReader;
