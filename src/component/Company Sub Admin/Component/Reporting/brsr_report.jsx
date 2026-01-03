import axios from "axios";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const generateReport = async () => {
    try {
        const response = await axios.get("/BRSR_H1.docx", { responseType: "arraybuffer" });

        // Load the DOCX file as binary
        const zip = new PizZip(response.data);
        const doc = new Docxtemplater(zip);

        // Replace placeholders with actual values
        const fieldValues = {
            company_id: "L2711234309KA1964PLC001546123",
            company_name: "Kennametal India Limited",
            incorporation_year: "September 21, 1964",
            address: "8/9 Mile, Tumkur Road, Bengaluru, Karnataka - 560073, India",
            email: "k-bngs-investor.relation@kennametal.com",
            phone: "080-28394321",
            website: "https://www.kennametal.com/in/en/about-us/kil-financials.html"
        };

        doc.setData(fieldValues);
        doc.render(); // Apply the replacements

        // Generate the updated DOCX file
        const updatedDocx = doc.getZip().generate({ type: "blob" });

        // Trigger download
        saveAs(updatedDocx, "updated_document.docx");

    } catch (error) {
        console.error("Error generating DOCX:", error);
    }
};
