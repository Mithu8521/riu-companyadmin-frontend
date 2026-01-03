import React, { useEffect, useState, useCallback } from "react";
import { Modal, Form } from "react-bootstrap";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";


// Custom CSS styles
const styles = `
  .report-modal {
    background: white;
    border-radius: 12px;
    max-width: 900px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .report-modal-header {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: white;
    border-bottom: none;
    padding: 20px 25px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .report-modal-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    letter-spacing: 0.5px;
  }

  .report-close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    opacity: 0.8;
  }

  .report-close-button:hover {
    background: rgba(255, 255, 255, 0.15);
    opacity: 1;
  }

  .report-modal-body {
    padding: 25px;
    background: #fafafa;
  }

  .report-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 400;
  }

  .report-container {
    max-width: 750px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #e5e7eb;
  }

  .report-section-title {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 25px;
    text-align: center;
  }

    /* Common button base */
    .action-button {
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: white;
    }

  .report-dropdown-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }

  .report-dropdown-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .report-dropdown-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .report-select {
    font-size: 14px;
    font-weight: 400;
    color: #374151;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    padding: 12px 15px;
    background: white;
    transition: all 0.3s ease;
    width: 100%;
  }

  .report-select:focus {
    outline: none;
    border-color: #9ca3af;
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
  }

  .report-settings-container {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .report-setting-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .report-setting-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .report-setting-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }

  .report-input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    background: white;
  }

  .report-input:focus {
    outline: none;
    border-color: #9ca3af;
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
  }

  .report-checkbox {
    width: 18px;
    height: 18px;
    accent-color: #6b7280;
    cursor: pointer;
  }

  .report-image-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .report-image-preview {
    max-width: 200px;
    max-height: 150px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  }

  .report-image-filename {
    font-size: 12px;
    color: #6b7280;
    font-style: italic;
    margin-top: 4px;
  }

  .report-file-input {
    padding: 12px;
    border: 1.5px dashed #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    color: #6b7280;
  }

  .report-file-input:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .report-no-data {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
    font-style: italic;
    background: #f9fafb;
    border-radius: 12px;
    border: 1.5px dashed #d1d5db;
  }

  .report-save-button {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .report-save-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  }

  .report-modal-footer {
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 20px 25px;
    border-radius: 0 0 12px 12px;
  }

  .report-download-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    width: 100%;
  }

  .report-download-button {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .report-download-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  .report-download-button.pdf {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  .report-download-button.pdf:hover {
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  @media (max-width: 768px) {
    .report-dropdown-container {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .report-container {
      padding: 20px;
    }
    
    .report-download-container {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }

`;

export default function DownloadReportModal({
  show,
  onClose,
  financialYears = [],
  frameworks = [],
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFinancialYearId, setSelectedFinancialYearId] = useState("");
  const [selectedFrameworkId, setSelectedFrameworkId] = useState("");
  const [settings, setSettings] = useState([]);
  const [selectedFrameworkSettings, setSelectedFrameworkSettings] = useState([]);
  const [originalFrameworkSettings, setOriginalFrameworkSettings] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const isEqualSettings = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const fetchSettings = useCallback(async () => {
    if (!frameworks.length) return;
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}generateReport/settings`,
        {},
        { frameworkIds: frameworks.map(f => f.id) }
      );
      if (isSuccess && Array.isArray(data?.reportGenerationSettings)) {
        setSettings(data.reportGenerationSettings);
      }
    } catch (error) {
      console.error("Error fetching settings", error);
    }
  }, [frameworks]);

  useEffect(() => {
    if (financialYears.length) {
      setSelectedFinancialYearId(String(financialYears[0].id));
    }
    if (frameworks.length) {
      setSelectedFrameworkId(String(frameworks[0].id));
      fetchSettings();
    }
  }, [financialYears, frameworks, fetchSettings]);

  // Filter selected settings
  useEffect(() => {
    if (settings.length && selectedFinancialYearId && selectedFrameworkId) {
      const filtered = settings.filter(
        s => String(s.frameworkId) === selectedFrameworkId &&
          String(s.financialYearId) === selectedFinancialYearId
      );
      setSelectedFrameworkSettings(filtered);
      setOriginalFrameworkSettings(JSON.parse(JSON.stringify(filtered))); // deep copy
      setIsDirty(false);
    } else {
      setSelectedFrameworkSettings([]);
      setOriginalFrameworkSettings([]);
    }
  }, [settings, selectedFinancialYearId, selectedFrameworkId]);


  useEffect(() => {
    setIsDirty(!isEqualSettings(selectedFrameworkSettings, originalFrameworkSettings));
  }, [selectedFrameworkSettings, originalFrameworkSettings]);

  const handleValueChange = (index, newValue) => {
    setSelectedFrameworkSettings(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        settingMetaAndAnswer: { ...updated[index].settingMetaAndAnswer, value: newValue }
      };
      return updated;
    });
  };


  const handleImageUpload = (index, file) => {
    const maxSize = 500 * 1024; // 500KB

    if (file.size > maxSize) {
      alert("File size exceeds 500KB. Please upload a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFrameworkSettings(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          settingMetaAndAnswer: {
            ...updated[index].settingMetaAndAnswer,
            fileBody: reader.result,
            fileName: file.name,
            value: undefined
          }
        };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = async () => {
    try {
      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}generateReport/settings`,
        {},
        { reportGenerationSettings: selectedFrameworkSettings },
        "POST"
      );
      if (isSuccess) {
        setOriginalFrameworkSettings(JSON.parse(JSON.stringify(selectedFrameworkSettings)));
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error saving settings", error);
    }
  };

  const resetSettings = () => {
    setSelectedFrameworkSettings(JSON.parse(JSON.stringify(originalFrameworkSettings)));
    setIsDirty(false);
  };

  const generateAndDownloadReport = async (reportType) => {
    try {
      setIsLoading(true);
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}generateReport`,
        {},
        {
          financialYearId: Number(selectedFinancialYearId),
          frameworkId: Number(selectedFrameworkId),
          reportType: reportType
        },
        "POST"
      );
      console.log(data);
      if (isSuccess && data?.reportUrl) {

        const getFileNameFromUrl = (url) => {
          try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1));
          } catch {
            // fallback for invalid URLs
            return url.split('/').pop().split('?')[0];
          }
        };

        const response = await fetch(data.reportUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        console.log('url', url);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = getFileNameFromUrl(data.reportUrl);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error generating report", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFinancialYearChange = (e) => setSelectedFinancialYearId(e.target.value);
  const handleFrameworkChange = (e) => setSelectedFrameworkId(e.target.value);

  if (!frameworks.length || !financialYears.length) return null;

  return (
    <>
      <style>{styles}</style>
      <Modal size="lg" show={show} onHide={onClose}>
        <div className="report-modal">
        {isLoading && (
  <div
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(255,255,255,0.7)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}
  >
    <div className="spinner" />
    <span style={{ marginTop: "10px", fontSize: "16px", fontWeight: "600" }}>
      Generating report...
    </span>

    <style>
      {`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0,0,0,0.1);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
)}
          <div className="report-modal-header">
            <h4 className="report-modal-title">ESG REPORT GENERATOR</h4>
            <button className="report-close-button" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="report-modal-body">
            <p className="report-subtitle">Configure and download your ESG compliance reports</p>

            <div className="report-container">
              <h2 className="report-section-title">Report Configuration</h2>

              {/* Enhanced Dropdowns */}
              <div className="report-dropdown-container">
                <div className="report-dropdown-wrapper">
                  <label className="report-dropdown-label">Financial Year</label>
                  <select
                    className="report-select"
                    onChange={handleFinancialYearChange}
                    value={selectedFinancialYearId}
                  >
                    {financialYears.map(year => (
                      <option key={year.id} value={String(year.id)}>
                        FY – {year.financial_year_value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="report-dropdown-wrapper">
                  <label className="report-dropdown-label">Framework</label>
                  <select
                    className="report-select"
                    onChange={handleFrameworkChange}
                    value={selectedFrameworkId}
                  >
                    {frameworks.map(framework => (
                      <option key={framework.id} value={String(framework.id)}>
                        {framework.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enhanced Settings Rendering */}
              <div className="report-settings-container">
                {selectedFrameworkSettings.length > 0 ? (
                  selectedFrameworkSettings.map((setting, index) => {
                    const meta = setting.settingMetaAndAnswer;
                    return (
                      <div key={setting.settingName} className="report-setting-card">
                        <label className="report-setting-label">
                          {meta.label}
                        </label>

                        {meta.type === "checkbox" && (
                          <input
                            type="checkbox"
                            className="report-checkbox"
                            checked={!!meta.value}
                            onChange={e => handleValueChange(index, e.target.checked)}
                          />
                        )}

                        {meta.type === "text" && (
                          <input
                            type="text"
                            className="report-input"
                            value={meta.value || ""}
                            onChange={e => handleValueChange(index, e.target.value)}
                            placeholder={`Enter ${meta.label.toLowerCase()}`}
                          />
                        )}

                        {meta.type === "image" && (
                          <div className="report-image-container">
                            {(meta.value || meta.fileBody) && (
                              <div>
                                <img
                                  src={meta.value || meta.fileBody}
                                  alt={meta.label}
                                  className="report-image-preview"
                                />
                                {meta.fileName && (
                                  <div className="report-image-filename">
                                    Current file: {meta.fileName}
                                  </div>
                                )}
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="report-file-input"
                              onChange={(e) =>
                                e.target.files && handleImageUpload(index, e.target.files[0])
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="report-no-data">
                    <p>No configuration settings found for the selected year and framework.</p>
                    <small>Please try selecting a different combination or contact support.</small>
                  </div>
                )}
              </div>

              {selectedFrameworkSettings.length > 0 && (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={resetSettings}
                    className="report-save-button"
                    style={{ background: "#6b7280" }}
                    disabled={!isDirty}
                  >
                    Reset
                  </button>
                  <button
                    onClick={saveSettings}
                    className="report-save-button"
                    disabled={!isDirty}
                  >
                    Save Configuration
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="report-modal-footer">
            <div className="report-download-container">
              <button disabled={true} title="Not supported yet" style={{opacity: 0.5}} className="report-download-button" onClick={() => generateAndDownloadReport('DOCX')}>
                📄 Download Word Document
              </button>
              <button className="report-download-button pdf" onClick={() => generateAndDownloadReport('PDF')}>
                📋 Download PDF Report
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}