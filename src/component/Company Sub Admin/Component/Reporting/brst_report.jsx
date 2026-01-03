import axios from "axios";
import { PDFDocument } from "pdf-lib";

export const generateReport = async () => {
    try {
        const response = await axios.get("/BRSR.pdf", { responseType: "arraybuffer" });
        const pdfDoc = await PDFDocument.load(response.data);
        const form = pdfDoc.getForm();

        // Debug: Log available form fields
        console.log("Available Form Fields:", form.getFields().map(field => field.getName()));

        const fieldValues = {
            "1": "L2711234309KA1964PLC001546123",
            "2": "ASDDFFKennametal India Limited",
            "3": "September 21, 1964",
            "4": "8/9 Mile, Tumkur Road, Bengaluru, Karnataka - 560073, India",
            "5": "8/9 Mile, Tumkur Road, Bengaluru, Karnataka - 560073, India",
            "6": "k-bngs-investor.relation@kennametal.com",
            "7": "080-28394321",
            "8": "https://www.kennametal.com/in/en/about-us/kil-financials.html",
        };

        Object.entries(fieldValues).forEach(([id, value]) => {
            const field = form.getTextField(id);
            if (field) {
                field.setText(value);
            } else {
                console.warn(`Field ID ${id} not found`);
            }
        });

        // Flatten the form to make it non-editable
        form.flatten();

        // Save and download the edited PDF
        const editedPdf = await pdfDoc.save(); // No need for updateFieldAppearances
        const blob = new Blob([editedPdf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "edited_document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
