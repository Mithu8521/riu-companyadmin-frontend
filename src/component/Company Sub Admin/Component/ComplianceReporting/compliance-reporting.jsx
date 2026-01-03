import React, { useState, useEffect, useRef, useCallback } from 'react';
// Assuming Sidebar and Header components exist in these paths
import Sidebar from '../../../sidebar/sidebar';
import Header from '../../../header/header';
// Assuming config file exists
import config from "../../../../config/config.json";

// Define the base URL for API requests from the config file
const BASE_URL = config.COMPLIANCE_BACKEND_BASE_URL;

// Utility functions for formatting and styling
const utils = {
    // Determines color based on score percentage
    getScoreColor: score => score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545',
    // Determines CSS class based on score percentage for styling
    getScoreClass: score => score >= 80 ? 'compliance-success' : score >= 60 ? 'compliance-warning' : 'compliance-danger',
    // Formats text, handling null/empty strings and line breaks
    formatText: text => {
        if (text == null || text === '') return 'N/A'; // Return 'N/A' for null or empty strings
        // Split text by newline and render with <br /> tags
        return String(text).split('\n').map((line, index, arr) => (
            <React.Fragment key={index}>{line}{index < arr.length - 1 && <br />}</React.Fragment>
        ));
    },
    // Formats date strings into a readable format (e.g., May 12, 2025)
    formatDate: dateString => {
        if (!dateString || dateString === 'Unknown Date') return 'Unknown Date';
        try {
            const date = new Date(dateString);
            // Check if the date is valid
            if (isNaN(date.getTime())) return dateString; // Return original string if invalid
            // Format date
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) { console.error("Date formatting error:", e); return dateString; } // Log error and return original string
    }
};

// Generic function for making API requests
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        let data = null;
        // Try parsing response as JSON
        try { data = await response.json(); }
        catch (jsonError) {
            // If JSON parsing fails, try getting text and wrap it in an error object
            const text = await response.text();
            data = { error: text || `HTTP error! status: ${response.status}` };
            console.warn(`API JSON Error (${endpoint}):`, jsonError, 'Response Text:', text);
        }
        // Throw an error if the response status is not OK
        if (!response.ok) throw new Error(data?.detail || data?.error || response.statusText);
        return data;
    } catch (error) { console.error(`API Request Error (${endpoint}):`, error); throw error; } // Log and re-throw error
}

// Memoized component for displaying a single history item
const HistoryItem = React.memo(({ item, onLoadReport, onDeleteReport, isActive, style }) => {
    // Determine report title, using hash as fallback
    const reportTitle = item.report_title || `Report ${item.file_hash?.substring(0, 6) || 'N/A'}`;
    // Format the upload date
    const formattedDate = utils.formatDate(item.upload_date);
    // Format compliance score, handling non-numeric values
    const complianceScore = typeof item.compliance_score === 'number' ? item.compliance_score.toFixed(1) : 'N/A';
    // Get framework type, defaulting to 'Unknown Framework'
    const frameworkType = item.framework_type || 'Unknown Framework';
    // Check if there was an overall error during analysis
    const hasError = item.overall_error === true;

    // Handle click on delete icon
    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent triggering onLoadReport
        // Confirm deletion with the user
        if (window.confirm(`Are you sure you want to delete "${reportTitle}"?`)) onDeleteReport(item.file_hash);
    };

    return (
        // Apply active class if this item is currently selected
        // Add a unique class based on index or some other property for alternating colors if desired
        <div className={`history-item ${isActive ? 'active' : ''}`} data-hash={item.file_hash} style={style}>
            {/* Clickable area to load the report */}
            <div className="history-item-text" title={reportTitle} onClick={() => onLoadReport(item.file_hash)}>
                <div className="history-item-title">{reportTitle}</div>
                <div className="history-item-details">
                    {formattedDate} - {frameworkType} ({complianceScore}%)
                    {/* Show warning icon if there were errors */}
                    {hasError && <span style={{ color: '#dc3545', marginLeft: '5px' }} title="Analysis Errors">⚠️</span>}
                </div>
            </div>
            {/* Delete icon (only shown if file_hash exists) */}
            {item.file_hash && <span className="delete-history-icon" title="Delete Report" onClick={handleDeleteClick}>&times;</span>}
        </div>
    );
});


// Main component for uploading reports and viewing compliance results
const ReportUploader = () => {
    // Get current user ID from local storage, default to 'default_user'
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [userId] = useState(currentUser?.id || 'default_user');
    // State variables
    const [history, setHistory] = useState([]); // Stores report history
    const [isLoadingHistory, setIsLoadingHistory] = useState(true); // Loading state for history
    const [historyError, setHistoryError] = useState(null); // Error state for history fetching
    const [selectedFramework, setSelectedFramework] = useState(''); // Currently selected framework
    const [frameworkStatus, setFrameworkStatus] = useState({ message: '', isError: false }); // Status/error for framework selection
    const [reportFile, setReportFile] = useState(null); // Selected report file
    const [reportTitle, setReportTitle] = useState(''); // Optional title for the report
    const [showReportUpload, setShowReportUpload] = useState(false); // Whether to show the file upload section
    const [complianceResult, setComplianceResult] = useState(null); // Stores the result of the compliance check
    const [isLoadingCompliance, setIsLoadingCompliance] = useState(false); // Loading state for compliance check
    const [complianceError, setComplianceError] = useState(null); // Error state for compliance check
    const [activeHistoryHash, setActiveHistoryHash] = useState(null); // Hash of the currently active/viewed history item
    const [deletingHash, setDeletingHash] = useState(null); // Hash of the history item being deleted
    const reportFileRef = useRef(null); // Ref for the file input element

    // State and refs for the history pop-up
    const [showHistoryPopup, setShowHistoryPopup] = useState(false); // Visibility state of the history popup
    const historyPopupRef = useRef(null); // Ref for the popup container
    const historyIconRef = useRef(null); // Ref for the history icon that triggers the popup

    // State for managing expanded section in detailed analysis
    const [expandedSectionIndex, setExpandedSectionIndex] = useState(null);

    // Effect to close the history popup when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the popup and not on the history icon
            if (historyPopupRef.current && !historyPopupRef.current.contains(event.target) &&
                historyIconRef.current && !historyIconRef.current.contains(event.target)) {
                setShowHistoryPopup(false); // Close the popup
            }
        };
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [historyPopupRef, historyIconRef]); // Dependencies for the effect

    // Function to fetch user's report history
    const fetchHistory = useCallback(async () => {
        // Don't fetch if user is not logged in
        if (!userId || userId === 'default_user') {
            setHistory([]); setIsLoadingHistory(false); setHistoryError("User not logged in."); return;
        }
        // Set loading state and clear errors
        setIsLoadingHistory(true); setHistoryError(null);
        try {
            // Make API request to get history
            const data = await apiRequest(`/user-history/${userId}`);
            // Ensure reports data is an array
            const reportsArray = Array.isArray(data.reports) ? data.reports : [];
            // Sort reports by upload date (newest first), with fallback to hash sorting
            const sortedReports = reportsArray.sort((a, b) => {
                const dateA = new Date(a.upload_date); const dateB = new Date(b.upload_date);
                // Handle invalid dates
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return String(a.file_hash).localeCompare(String(b.file_hash));
                // Sort descending by time
                return dateB.getTime() - dateA.getTime();
            });
            setHistory(sortedReports); // Update history state
        } catch (error) { setHistoryError(error.message); setHistory([]); } // Handle errors
        finally { setIsLoadingHistory(false); } // Reset loading state
    }, [userId]); // Dependency: userId

    // Fetch history when the component mounts or userId changes
    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    // Handler for clicking the "New Report" button
    const handleNewReportClick = () => {
        // Reset all relevant states to start fresh
        setSelectedFramework(''); setReportFile(null); if (reportFileRef.current) reportFileRef.current.value = '';
        setReportTitle(''); setShowReportUpload(false); setComplianceResult(null); setComplianceError(null);
        setFrameworkStatus({ message: '', isError: false }); setActiveHistoryHash(null);
        setShowHistoryPopup(false); // Close history popup
        setExpandedSectionIndex(null); // Reset expanded section
    };

    // Handler for changing the selected framework
    const handleFrameworkChange = async (event) => {
        const framework = event.target.value;
        setSelectedFramework(framework);
        // Reset results and active history item
        setComplianceResult(null); setComplianceError(null); setActiveHistoryHash(null);
        setExpandedSectionIndex(null); // Reset expanded section
        // Handle case where no framework is selected
        if (!framework) {
            setFrameworkStatus({ message: '❌ Please select a framework', isError: true }); setShowReportUpload(false); return;
        }
        // Prepare form data for API request (though not strictly needed if just sending framework name)
        const formData = new FormData(); formData.append('framework', framework);
        setFrameworkStatus({ message: '', isError: false }); // Clear previous status
        try {
            // Simulate selecting framework on backend (adjust endpoint/method if needed)
            await apiRequest('/select-framework/', { method: 'POST', body: formData });
            setShowReportUpload(true); // Show the file upload section
        } catch (error) {
            // Handle errors during framework selection
            setFrameworkStatus({ message: `❌ ${error.message}`, isError: true }); setShowReportUpload(false);
        }
    };

    // Handler for file input change
    const handleFileChange = (event) => { setReportFile(event.target.files[0]); setComplianceError(null); };
    // Handler for report title input change
    const handleReportTitleChange = (event) => { setReportTitle(event.target.value); };

    // Handler for submitting the compliance check form
    const handleComplianceSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setComplianceError(null); // Clear previous errors
        setExpandedSectionIndex(null); // Reset expanded section
        // Basic validation
        if (!selectedFramework) { setComplianceError('❌ Please select a framework'); return; }
        if (!reportFile) { setComplianceError('❌ Please upload a report file'); return; }

        // Prepare form data for API request
        const formData = new FormData();
        formData.append('file', reportFile);
        formData.append('user_id', userId);
        // Add report title if provided
        if (reportTitle.trim()) formData.append('report_title', reportTitle.trim());

        // Set loading state and clear results/active history
        setIsLoadingCompliance(true); setComplianceResult(null); setActiveHistoryHash(null);
        try {
            // Make API request to check compliance
            const result = await apiRequest('/check-compliance/', { method: 'POST', body: formData });
            setComplianceResult(result); // Store the compliance result
            // Refresh history after successful analysis
            await fetchHistory();
            // Set the newly analyzed report as active
            setActiveHistoryHash(result.file_hash);
        } catch (error) {
            // Handle errors during compliance check
            setComplianceError(`❌ Error during compliance check: ${error.message}`); setComplianceResult(null);
        }
        finally { setIsLoadingCompliance(false); } // Reset loading state
    };

    // Function to load a report from the history
    const loadReportFromHistory = useCallback(async (fileHash) => {
        // Check if user is logged in
        if (!userId || userId === 'default_user') { setComplianceError("User not logged in."); return; }
        // Set loading state, clear errors/results, set active hash
        setIsLoadingCompliance(true); setComplianceError(null); setComplianceResult(null); setActiveHistoryHash(fileHash);
        setShowHistoryPopup(false); // Close history popup
        setExpandedSectionIndex(null); // Reset expanded section
        try {
            // Make API request to get specific report data
            const reportData = await apiRequest(`/report/${fileHash}?user_id=${userId}`);
            // Update state with loaded report data
            setComplianceResult(reportData);
            setSelectedFramework(reportData.framework_type || ''); // Set framework
            setReportTitle(reportData.report_title || ''); // Set title
            setShowReportUpload(true); // Ensure upload section is visible
            if (reportFileRef.current) reportFileRef.current.value = ''; // Clear file input visually
            setReportFile(null); // Clear file state
        } catch (error) {
            // Handle errors loading report
            setComplianceError(`❌ Error loading report: ${error.message}`); setComplianceResult(null); setActiveHistoryHash(null);
        }
        finally { setIsLoadingCompliance(false); } // Reset loading state
    }, [userId]); // Dependency: userId

    // Function to delete a report from history
    const deleteReportFromHistory = useCallback(async (fileHash) => {
        // Check if user is logged in
        if (!userId || userId === 'default_user') { alert("User not logged in."); return; }
        setDeletingHash(fileHash); // Set deleting state for visual feedback
        try {
            // Make API request to delete the report
            await apiRequest(`/delete-report/${fileHash}?user_id=${userId}`, { method: 'DELETE' });
            // Update history state by filtering out the deleted item
            setHistory(prevHistory => prevHistory.filter(item => item.file_hash !== fileHash));
            // If the deleted report was the currently active one, clear the results view
            if (activeHistoryHash === fileHash) {
                setComplianceResult(null);
                setActiveHistoryHash(null);
                setExpandedSectionIndex(null); // Reset expanded section
                // Optionally reset the form completely
                // handleNewReportClick();
            }
        } catch (error) {
            // Handle deletion errors
            console.error(`Error deleting history for ${fileHash}:`, error); alert(`Failed to delete: ${error.message}`);
        }
        finally { setDeletingHash(null); } // Reset deleting state
    }, [userId, activeHistoryHash]); // Dependencies

    // Function to render the history list within the popup
    const renderHistory = () => {
        // Show loading indicator
        if (isLoadingHistory) return <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>Loading history...</div>;
        // Show error message
        if (historyError) return <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>Error: {historyError}</div>;
        // Show message if history is empty
        if (!history || !Array.isArray(history) || history.length === 0) return <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>No history.</div>;
        // Map over history items and render HistoryItem components
        return history.map((item, index) => (
            // Add a class based on index for alternating colors
            <HistoryItem key={item.file_hash || `temp-${item.id}`}
                item={item}
                onLoadReport={loadReportFromHistory}
                onDeleteReport={deleteReportFromHistory}
                isActive={activeHistoryHash === item.file_hash}
                style={deletingHash === item.file_hash ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            />
        ));
    };

    // Handler to toggle expanded section
    const toggleSection = (index) => {
        setExpandedSectionIndex(expandedSectionIndex === index ? null : index);
    };

    // Function to render the compliance results section
    const renderComplianceResults = () => {
        // Show loading indicator while analyzing
        if (isLoadingCompliance) return <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Analyzing report...</div>;

        // Show initial message or specific input errors
        if (!complianceResult && (!complianceError || complianceError.includes("Please select") || complianceError.includes("Please upload"))) {
            return (
                <div style={{ textAlign: 'center', padding: '0px', color: '#888' }}>
                    Select framework and upload a report.
                    {/* Display specific input errors if present */}
                    {complianceError && <div style={{ color: '#dc3545', marginTop: '10px' }}>{complianceError.replace("❌ ", "")}</div>}
                </div>
            );
        }
        // Show general compliance check errors
        if (complianceError && !complianceResult) return <div className="summary-card" style={{ color: '#dc3545' }}>{complianceError.replace("❌ ", "")}</div>;

        // Render results if available
        if (complianceResult) {
            const llmSummary = complianceResult.llm_summary || {}; // Get LLM summary, default to empty object
            // Get section analysis results, ensure it's an array
            const allSectionAnalysisResults = Array.isArray(complianceResult.all_section_analysis_results) ? complianceResult.all_section_analysis_results : [];
            // Determine final score, using fallbacks
            const finalScore = complianceResult.final_compliance_score ?? llmSummary.overall_compliance_score ?? 0;
            // Get color based on score
            const scoreColor = utils.getScoreColor(finalScore);
            // Check for overall processing errors
            const overallProcessingError = complianceResult.overall_processing_error === true; // Ensure boolean comparison

            // Helper to format lists (strengths, improvements, recommendations)
            const formatList = (items, className = '') => (!Array.isArray(items) || items.length === 0)
                ? <li className={className || null}>N/A</li>
                : items.map((item, index) => <li key={index} className={className || null}>{utils.formatText(item)}</li>);

            // Calculate overall statistics
            let totalScoreableQuestions = 0, earnedPoints = 0, totalQuestionsFramework = 0;
            allSectionAnalysisResults.forEach(section => {
                totalQuestionsFramework += section.total_questions || 0;
                // Calculate scoreable questions (excluding N/A, Failed)
                const scoreableInSection = (section.questions_compliant || 0) + (section.questions_partially_compliant || 0) + (section.questions_non_compliant || 0);
                totalScoreableQuestions += scoreableInSection;
                // Calculate points earned (1 for compliant, 0.5 for partial)
                earnedPoints += (section.questions_compliant || 0) * 1.0 + (section.questions_partially_compliant || 0) * 0.5;
            });
            // Calculate disclosure percentage based on earned points and scoreable questions
            const disclosurePercentage = totalScoreableQuestions > 0 ? Math.round((earnedPoints / totalScoreableQuestions) * 100) : 0;
            const sectionsCount = allSectionAnalysisResults.length; // Count of analyzed sections
            // Format improvement areas text
            const improvementAreasText = Array.isArray(llmSummary.improvement_areas) ? llmSummary.improvement_areas.join(', ') : utils.formatText(llmSummary.improvement_areas);

            return (
                <>
                    {/* Overall Summary Card */}
                    <div className="summary-card">
                        <div className="summary-header">
                            <h3>Overall Compliance Summary</h3>
                            {/* Display score circle */}
                            <div className="score-circle" style={{ backgroundColor: scoreColor }} title="Overall Score">{finalScore.toFixed(1)}%</div>
                        </div>
                        {/* Show warning if there were processing errors */}
                        {overallProcessingError && <div style={{ color: '#dc3545', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ Errors in one or more sections. Review details.</div>}
                        {/* Display overall summary text */}
                        <p>{utils.formatText(llmSummary.overall_summary)}</p>
                        {/* Key Strengths List */}
                        <div className="list-title">Key Strengths:</div>
                        <ul className="summary-list">{formatList(llmSummary.key_strengths, 'strength-item')}</ul>
                        {/* Areas for Improvement List */}
                        <div className="list-title">Areas for Improvement:</div>
                        <ul className="summary-list">{formatList(llmSummary.improvement_areas, 'improvement-item')}</ul>
                        {/* Recommendations / Top Actions List */}
                        <div className="list-title">Top Actions for Full Compliance:</div> {/* Title as requested */}
                        <ul className="summary-list">{formatList(llmSummary.recommendations, 'action-item')}</ul>
                    </div>

                    {/* Overall Data Table */}
                    <table className="overall-data-table">
                        <thead><tr><th>Category</th><th>Details</th></tr></thead>
                        <tbody>
                            <tr><td>Compliance Score</td><td>{finalScore.toFixed(2)}%</td></tr>
                            <tr><td>Sections Analyzed</td><td>{sectionsCount > 0 ? sectionsCount : 'N/A'}</td></tr>
                            <tr><td>Total Questions in Framework</td><td>{totalQuestionsFramework > 0 ? totalQuestionsFramework : 'N/A'}</td></tr>
                            <tr><td>Scoreable Questions Addressed</td><td>{totalScoreableQuestions > 0 ? totalScoreableQuestions : 'N/A'}</td></tr>
                            <tr><td>Estimated Disclosure Percentage</td><td>{totalScoreableQuestions > 0 ? `${disclosurePercentage}%` : 'N/A'}</td></tr>
                            <tr><td>Improvement Areas Mentioned</td><td>{improvementAreasText || 'None identified'}</td></tr>
                        </tbody>
                    </table>

                    {/* Detailed Section Analysis */}
                    <h3>Detailed Section Analysis</h3>
                    {allSectionAnalysisResults.length > 0 ? allSectionAnalysisResults.map((sectionAnalysis, index) => {
                        // Safely access section properties
                        const sectionScore = sectionAnalysis.section_compliance_score ?? 0;
                        const scoreClass = utils.getScoreClass(sectionScore);
                        const sectionTitle = sectionAnalysis.section || `Section ${index + 1}`;
                        const overallSectionAssessment = sectionAnalysis.overall_section_assessment || 'No assessment.';
                        const questionDetails = Array.isArray(sectionAnalysis.question_details) ? sectionAnalysis.question_details : [];
                        const compliantCount = sectionAnalysis.questions_compliant ?? 0;
                        const partialCount = sectionAnalysis.questions_partially_compliant ?? 0;
                        const nonCompliantCount = sectionAnalysis.questions_non_compliant ?? 0;
                        const analyzedCount = sectionAnalysis.questions_analyzed ?? 0;

                         // Determine simplified status based on counts
                        let simplifiedStatus = 'Not Assessed';
                        let statusClass = 'status-na'; // Default class
                        if (analyzedCount > 0) {
                             if (nonCompliantCount > 0) {
                                simplifiedStatus = 'Non-Compliant';
                                statusClass = 'status-non-compliant';
                            } else if (partialCount > 0) {
                                simplifiedStatus = 'Partially Compliant';
                                statusClass = 'status-partial';
                            } else if (compliantCount > 0) {
                                simplifiedStatus = 'Fully Compliant';
                                statusClass = 'status-compliant';
                            } else {
                                // Handle cases where analyzed but no compliant/partial/non-compliant
                                simplifiedStatus = sectionAnalysis.status || 'Status Unknown';
                            }
                        } else if (sectionAnalysis.status === 'skipped') {
                            simplifiedStatus = 'Skipped';
                            statusClass = 'status-skipped';
                        }

                        // Filter relevant questions (Partial, Non-Compliant, Failed) for detailed view
                        const relevantQuestions = questionDetails.filter(q => ["Partially Compliant", "Non-Compliant", "Analysis Failed"].includes(q.compliance_status));

                        const isExpanded = expandedSectionIndex === index;

                        return (
                            <div key={index} className="section-analysis-container">
                                {/* Section Header - Clickable to toggle expansion */}
                                <button className={`section-header-button ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleSection(index)}>
                                    <div className="section-title-text">{utils.formatText(sectionTitle)}</div>
                                    <div className="section-score-status">
                                        {/* Only show percentage score */}
                                        <span className={`compliance-status ${scoreClass}`}>{sectionScore.toFixed(1)}%</span>
                                    </div>
                                    <span className="accordion-icon">{isExpanded ? '−' : '+'}</span>
                                </button>

                                {/* Section Content (Summary Table and Detailed Findings) - Conditionally rendered */}
                                {isExpanded && (
                                    <div className="section-content-details">
                                        {/* Detailed Section Table */}
                                        <table className="section-summary-table">
                                            <tbody>
                                                {/* Display Score */}
                                                <tr><th>Score</th><td className={scoreClass}>{sectionScore.toFixed(1)}%</td></tr>
                                                {/* Display simplified Status */}
                                                <tr><th>Status</th><td className={statusClass}>{utils.formatText(simplifiedStatus)}</td></tr>
                                                {/* Display question counts */}
                                                <tr><th>Total Qs</th><td>{sectionAnalysis.total_questions ?? 'N/A'}</td></tr>
                                                <tr><th>Analyzed</th><td>{analyzedCount}</td></tr>
                                                <tr><th>Compliant</th><td>{compliantCount}</td></tr>
                                                <tr><th>Partially Compliant</th><td>{partialCount}</td></tr> {/* Changed from Partial to Partially Compliant */}
                                                <tr><th>Non-Compliant</th><td>{nonCompliantCount}</td></tr>
                                                {/* Display Assessment */}
                                                <tr><th>Assessment</th><td><div className="section-content">{utils.formatText(overallSectionAssessment)}</div></td></tr>
                                            </tbody>
                                        </table>
                                        {/* Detailed Findings Section */}
                                        {relevantQuestions.length > 0 && (
                                            <div className="detailed-questions-section">
                                                <h4>Detailed Findings (Non-Compliant, Partially, Failed)</h4>
                                                {relevantQuestions.map((q, q_idx) => (
                                                    <div key={q_idx} className={`question-detail-item ${q_idx % 2 === 0 ? 'odd' : 'even'}`}>
                                                        <div className="question-detail-header">
                                                            {/* Display Question Number and Status on one line */}
                                                            <div className="question-number-status"> {/* Added a div for number and status */}
                                                                <strong>Question {q.q_no || 'N/A'}:</strong>
                                                                {/* Only display status if it's Non-Compliant, Partially Compliant, or Analysis Failed */}
                                                                {["Partially Compliant", "Non-Compliant", "Analysis Failed"].includes(q.compliance_status) && (
                                                                     <span className={`compliance-status ${utils.getScoreClass(q.compliance_status === "Compliant" ? 100 : q.compliance_status === "Partially Compliant" ? 50 : 0)}`} style={{marginLeft: '10px'}}>{q.compliance_status || 'N/A'}</span>
                                                                )}
                                                            </div>
                                                            {/* Display Question Text on the next line */}
                                                            <div>{utils.formatText(q.field_name)}</div>
                                                        </div>
                                                        {/* Display analysis, gap, and action required */}
                                                        <p className="question-analysis"><strong>Analysis:</strong> {utils.formatText(q.analysis)}</p>
                                                        {q.gap_identified && <p className="question-gap"><strong>Gap:</strong> {utils.formatText(q.gap_identified)}</p>}
                                                        {q.action_required && <p className="question-action"><strong>Action:</strong> {utils.formatText(q.action_required)}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Message when no relevant questions are found */}
                                        {relevantQuestions.length === 0 && sectionAnalysis.status !== "skipped" && (
                                            <div className="detailed-questions-section all-clear-message">
                                                <p>No action Required. All questions answered as per BRSR guidelines.</p>
                                            </div>
                                        )}
                                        {/* Message for skipped sections */}
                                        {sectionAnalysis.status === "skipped" && <div className="detailed-questions-section"><p>Section skipped (no framework questions).</p></div>}
                                    </div>
                                )}
                            </div>
                        );
                    }) : <p>Detailed section analysis not available.</p>}
                </>
            );
        }
        // Fallback message if no results are available
        return <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No results.</div>;
    };

    // JSX for the component layout
    return (
        <>
            {/* Inline styles for the component */}
            <style>{`
/* Main container */
.report-uploader-flex-container{display:flex;width:100%;height:100%;overflow:hidden;font-family:'Inter',sans-serif;background-color:#f4f4f4}

/* Hide the original history sidebar (moved to popup) */
.report-uploader-history-sidebar{display: none;}

/* Main content area */
.report-uploader-main-content{flex-grow:1;display:flex;flex-direction:column;align-items:center;overflow-y:auto;height:100%;box-sizing:border-box;padding:15px}
.report-uploader-main-content .upload-container{
    background-color:#fff;
    padding:30px; /* Increased padding */
    border-radius:10px;
    box-shadow:0 4px 12px rgba(0,0,0,.1); /* Softer shadow */
    width:100%;
    max-width:1100px; /* Max width for content */
    margin-bottom:20px;
    display:flex;
    flex-direction:column;
    align-items:center;
    box-sizing:border-box;
    position: relative; /* Needed for absolute positioning of history icon */
}

/* Title area */
.report-uploader-main-content .upload-title-container {
    display: flex;
    align-items: center;
    justify-content: center; /* Center title */
    width: 100%;
    margin-bottom: 25px;
    position: relative; /* Ensure it establishes a stacking context if needed */
}
.report-uploader-main-content .upload-title{
    text-align:center;
    color:#1a3a5f; /* Dark blue */
    font-size:24px;
    font-weight:600;
    text-transform:uppercase;
    letter-spacing:1px;
    border-bottom:3px solid #3a86ff; /* Accent color */
    padding-bottom:12px;
    width:auto; /* Fit content */
    margin: 0; /* Reset margin */
}

/* History Icon */
.history-icon {
    cursor: pointer;
    font-size: 20px;
    color: #1a3a5f;
    transition: color 0.2s ease;
    position: absolute;
    top: 25px; /* Adjusted position */
    right: 25px; /* Adjusted position */
    z-index: 10;
    padding: 5px; /* Add some padding for easier clicking */
    border-radius: 50%; /* Make it circular */
    background-color: #f0f0f0; /* Light background */
    display: flex; /* Center icon */
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.history-icon:hover {
    color: #3a86ff;
    background-color: #e0e0e0;
}
.history-icon svg { /* Ensure SVG scales correctly */
    width: 20px;
    height: 20px;
}


/* History Popup */
.history-popup {
    position: absolute;
    top: 75px; /* Position below the icon + padding */
    right: 25px; /* Align with icon */
    background-color: #e0f7fa; /* Lightest sky blue background for the popup */
    border: 1px solid #b2ebf2; /* Border matching a lighter sky blue */
    border-radius: 8px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
    z-index: 100;
    width: 320px; /* Slightly wider */
    max-height: 450px; /* Increased max height */
    overflow-y: auto;
    padding: 0; /* Remove padding, handle inside */
    box-sizing: border-box;
    transform: translateY(10px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}
.history-popup.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
.history-popup .popup-header {
    padding: 12px 15px; /* More padding */
    border-bottom: 1px solid #b2ebf2; /* Border matching popup background */
    margin-bottom: 0; /* Remove bottom margin */
    font-weight: 600;
    color: #1a3a5f;
    background-color: #b2ebf2; /* Header background matching a lighter sky blue */
    border-radius: 8px 8px 0 0; /* Rounded top corners */
    position: sticky; /* Make header sticky */
    top: 0;
    z-index: 1;
}
.history-popup .new-chat-btn{ /* Style for "New Report" button inside popup */
    display:flex;
    margin: 10px 15px; /* Consistent margin */
    padding: 8px 12px; /* Adjust padding */
    background: #80deea; /* Sky blue background */
    border: 1px solid #4dd0e1; /* Slightly darker sky blue border */
    border-radius: 5px;
    color:#1a3a5f; /* Dark text */
    cursor:pointer;
    align-items:center;
    transition:background .3s, border-color .3s;
    width: calc(100% - 30px); /* Full width minus margins */
    text-align:left;
    font-size: 0.95em; /* Slightly smaller font */
    font-family:inherit;
    font-weight: 500;
}
.history-popup .new-chat-btn svg{margin-right:8px;height:14px;width:14px}
.history-popup .new-chat-btn:hover{background-color:#4dd0e1; border-color: #00bcd4;} /* Darker sky blue on hover */
.history-popup .history-list{
    padding: 0 15px 10px 15px; /* Padding for list items */
    flex-grow:1;
    overflow-y:auto;
    background-color: #e0f7fa; /* Ensure list background is also light sky blue */
}
.history-popup .history-item{
    padding:10px 12px; /* Adjust padding */
    margin-bottom: 6px; /* Space between items */
    border-radius: 5px;
    cursor:default;
    overflow:hidden;
    text-overflow:ellipsis;
    transition:background-color .2s;
    display:flex;
    justify-content:space-between;
    align-items:center;
    /* Removed default background */
    border: 1px solid #b2ebf2; /* Border matching popup theme */
}
/* Sky blue colors for history items */
.history-popup .history-item:nth-child(odd) {
    background-color: #e0f7fa; /* Light sky blue for odd rows */
}
.history-popup .history-item:nth-child(even) {
    background-color: #b2ebf2; /* Slightly darker sky blue for even rows */
}
.history-popup .history-item:hover{background-color:#80deea} /* Hover effect sky blue */
.history-popup .history-item.active{background-color:#4dd0e1; border-left: 3px solid #00bcd4;} /* Active item style (cyan-ish blue) */

.history-popup .history-item-text{flex-grow:1;overflow:hidden;text-overflow:ellipsis;margin-right:8px;cursor:pointer; color: #333;}
.history-popup .history-item-title{font-size:14px;font-weight:500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.history-popup .history-item-details{font-size:11px;color:#666;}
.history-popup .delete-history-icon{
    cursor:pointer;
    color:#888;
    font-size:18px; /* Slightly larger */
    line-height:1;
    margin-left:8px; /* More space */
    flex-shrink:0;
    padding: 4px 6px; /* Padding for click area */
    border-radius: 4px;
    font-weight:700;
    transition: color 0.2s, background-color 0.2s;
}
.history-popup .delete-history-icon:hover{color:#dc3545;background-color:#ffebeb;}

/* Form Styles */
.report-uploader-main-content .form-group{margin-bottom:20px;width:100%} /* Increased margin */
.report-uploader-main-content .form-group label{display:block;margin-bottom:8px;color:#495057;font-weight:500}
.report-uploader-main-content .form-group select,
.report-uploader-main-content .form-group input[type=file],
.report-uploader-main-content .form-group input[type=text]{
    width:100%;padding:12px 15px; /* Increased padding */
    border:1px solid #ced4da;
    border-radius:5px;
    background:#fff;
    font-size:14px;
    box-sizing:border-box;
    transition: border-color 0.2s ease;
}
.report-uploader-main-content .form-group select:focus,
.report-uploader-main-content .form-group input[type=text]:focus {
    border-color: #3a86ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
}
.report-uploader-main-content .form-group input[type=file]{padding:8px 12px} /* Adjusted padding for file input */
.report-uploader-main-content .btn{
    display:inline-flex;align-items:center;justify-content:center;
    padding:12px 25px; /* Increased padding */
    background: linear-gradient(to right, #007bff, #0056b3); /* Gradient background */
    color:#fff;border:none;border-radius:5px;cursor:pointer;
    font-size:15px; /* Slightly larger font */
    transition:background .3s ease, transform 0.1s ease;
    font-weight:500;min-height:42px; /* Increased height */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.report-uploader-main-content .btn:hover{background: linear-gradient(to right, #0069d9, #004085);} /* Darker gradient on hover */
.report-uploader-main-content .btn:active{ transform: translateY(1px); } /* Press effect */
.report-uploader-main-content .btn:disabled{background:#adb5bd; cursor:not-allowed; box-shadow: none;} /* Disabled style */
.report-uploader-main-content .file-status{margin-top:10px;font-size:14px;min-height:20px;text-align:left;width:100%; color: #6c757d;} /* Default status color */
.report-uploader-main-content .report-file-status{text-align:left;margin-left:15px;min-height:20px;font-size:14px;color:#dc3545} /* Error status color */
.report-uploader-main-content .upload-section{border-bottom:1px solid #e0e0e0;padding-bottom:25px;margin-bottom:25px;width:100%}
.report-uploader-main-content .upload-section h3{color:#1a3a5f;font-size:18px;margin-bottom:20px;display:flex;align-items:center; font-weight: 600;}
.report-uploader-main-content #complianceResults{margin-top:20px;background-color:#f8f9fa;padding:25px;border-radius:8px;overflow-y:auto;border:1px solid #e0e0e0;width:100%;box-sizing:border-box;min-height:100px}

/* Common table cell styling for better readability */
.report-uploader-main-content th,
.report-uploader-main-content td {
    padding: 14px 18px; /* Increased padding */
    text-align: left;
    vertical-align: middle; /* Align content vertically in the middle */
    line-height: 1.6;
    font-size: 14.5px; /* Slightly larger font */
}

/* Overall Data Table */
.report-uploader-main-content .overall-data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 30px;
    border: 2px solid #495057; /* Darker border color for a bolder look */
    border-radius: 8px; /* Slightly more rounded corners */
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
}
.report-uploader-main-content .overall-data-table th {
    background-color: #2a64a1; /* Darker blue for header */
    color: #fff;
    font-weight: 600;
    width: 35%;
    border-bottom: 1px solid #3a86ff; /* Consistent header bottom border */
    text-transform: uppercase; /* Uppercase for headers */
    letter-spacing: 0.5px; /* Slight letter spacing */
}
.report-uploader-main-content .overall-data-table td {
    background-color: #fff;
    border-bottom: 1px solid #dee2e6; /* Lighter border for inner rows */
}
.report-uploader-main-content .overall-data-table tbody tr:nth-child(even) td {
    background-color: #e0f2ff; /* Keep zebra striping */
}
.report-uploader-main-content .overall-data-table tbody tr:hover td {
    background-color: #d1ebff; /* Lighter hover effect for zebra-striped table */
    cursor: pointer;
}


/* Section Summary Table Styling */
.report-uploader-main-content .section-summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border: 1px solid #ced4da; /* Lighter border, contained within section-analysis-container */
    border-radius: 8px; /* Consistent rounding */
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    background-color: #e0f7fa; /* Sky blue background for the entire table */
}
.report-uploader-main-content .section-summary-table th,
.report-uploader-main-content .section-summary-table td {
    padding: 12px 18px; /* Increased padding for section summary table cells */
    text-align: left;
    border-bottom: 1px solid #b2ebf2; /* Lighter inner row borders that match sky blue */
    vertical-align: middle;
    line-height: 1.5;
}
.report-uploader-main-content .section-summary-table th {
    background-color: #b2ebf2; /* Header background matching a lighter sky blue */
    color: #1a3a5f; /* Darker text for header */
    font-weight: 600;
    width: 30%;
    border-bottom: 1px solid #80deea; /* Slightly darker border for header bottom */
    text-transform: uppercase; /* Uppercase for headers */
    letter-spacing: 0.5px;
}
.report-uploader-main-content .section-summary-table td {
    background-color: transparent; /* Make cells transparent to show table background */
}
.report-uploader-main-content .section-summary-table tbody tr:hover td {
    background-color: #c4efff; /* Lighter sky blue hover effect */
    cursor: pointer;
}
/* Status cell styling (remains the same, but background will blend with table) */
.report-uploader-main-content .section-summary-table .status-compliant { color: #155724; font-weight: bold; }
.report-uploader-main-content .section-summary-table .status-partial { color: #856404; font-weight: bold; }
.report-uploader-main-content .section-summary-table .status-non-compliant { color: #721c24; font-weight: bold; }
.report-uploader-main-content .section-summary-table .status-na,
.report-uploader-main-content .section-summary-table .status-skipped { color: #6c757d; }


/* Section Header Button for Expandable Sections */
.report-uploader-main-content .section-header-button {
    background-color: #3a86ff; /* Matching section title background */
    color: #fff;
    padding: 12px 18px;
    margin: 10px 0 0; /* Adjusted margin top to reduce space */
    font-weight: 600;
    border: none;
    border-radius: 5px;
    font-size: 17px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: inherit;
}
.report-uploader-main-content .section-header-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
}
.report-uploader-main-content .section-header-button.expanded {
     border-bottom-left-radius: 0; /* Remove bottom radius when expanded */
     border-bottom-right-radius: 0;
}

.report-uploader-main-content .section-title-text {
    flex-grow: 1;
    margin-right: 10px;
}

.report-uploader-main-content .section-score-status {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

/* Styling for the percentage box in the header */
.report-uploader-main-content .section-score-status .compliance-status {
    margin-left: 0; /* Removed left margin */
    width: 60px; /* Fixed width */
    height: 30px; /* Fixed height */
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically */
    font-size: 1em; /* Adjust font size if needed */
    font-weight: bold; /* Keep font bold */
    padding: 0; /* Remove padding */
    border-radius: 4px; /* Keep border radius */
    white-space: nowrap; /* Prevent text wrapping */
}


.report-uploader-main-content .accordion-icon {
    font-size: 20px;
    font-weight: 700;
    margin-left: 10px;
    transition: transform 0.3s ease;
}

/* Section Content Details - Shown when expanded */
.report-uploader-main-content .section-content-details {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-top: none; /* No top border, connects to button */
    border-bottom-left-radius: 8px; /* Rounded bottom corners */
    border-bottom-right-radius: 8px;
    padding: 25px; /* Matching container padding */
    margin-bottom: 30px; /* Matching container margin */
    box-shadow: 0 2px 5px rgba(0,0,0,.07); /* Matching container shadow */
    width: 100%;
    box-sizing: border-box;
    overflow: hidden; /* Ensure content stays within bounds */
    /* Add animation for smooth expansion */
    transition: max-height 0.5s ease-in-out, opacity 0.3s ease;
    max-height: 2000px; /* Sufficiently large value for content */
    opacity: 1;
}

/* Hide content when not expanded */
.report-uploader-main-content .section-analysis-container:not(:has(.section-header-button.expanded)) .section-content-details {
    max-height: 0;
    opacity: 0;
    padding-top: 0; /* Collapse padding */
    padding-bottom: 0; /* Collapse padding */
    border: none; /* Remove borders when collapsed */
    margin-bottom: 0; /* Remove margin when collapsed */
}


/* Summary Card */
.report-uploader-main-content .summary-card{background-color:#fff;border:1px solid #dee2e6;border-radius:8px;padding:25px;margin-bottom:30px;box-shadow:0 2px 5px rgba(0,0,0,.07);width:100%;box-sizing:border-box}
.report-uploader-main-content .summary-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee}
.report-uploader-main-content .summary-header h3 { margin: 0; font-size: 20px; color: #1a3a5f; } /* Style header inside card */
.report-uploader-main-content .score-circle{width:75px;height:75px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;flex-shrink:0; box-shadow: 0 2px 4px rgba(0,0,0,0.2); } /* Added shadow */
.report-uploader-main-content .list-title{font-weight:600;margin:20px 0 10px;color:#3a86ff;font-size:16px} /* Increased font size */
.report-uploader-main-content ul.summary-list{margin:0;padding-left:25px;list-style:disc}
.report-uploader-main-content ul.summary-list li{margin-bottom:10px;line-height:1.7; padding: 5px; border-radius: 4px;} /* Added padding/radius */

/* Background colors for summary list items */
.report-uploader-main-content ul.summary-list li.strength-item { background-color: #d1ecf1; border-left: 3px solid #28a745; } /* Light blue background, green border */
.report-uploader-main-content ul.summary-list li.improvement-item { background-color: #d1ecf1; border-left: 3px solid #ffc107; } /* Light blue background, yellow border */
.report-uploader-main-content ul.summary-list li.action-item { background-color: #d1ecf1; border-left: 3psolid #007bff; } /* Light blue background, blue border */


/* General Text & Compliance Status Styles */
.report-uploader-main-content p{line-height:1.7;margin-bottom:15px;color:#495057}
.report-uploader-main-content .compliance-success{color:#155724; font-weight:700; background-color: #d4edda; padding: 2px 6px; border-radius: 4px;} /* Added background */
.report-uploader-main-content .compliance-warning{color:#856404; font-weight:700; background-color: #fff3cd; padding: 2px 6px; border-radius: 4px;} /* Added background */
.report-uploader-main-content .compliance-danger{color:#721c24; font-weight:700; background-color: #f8d7da; padding: 2px 6px; border-radius: 4px;} /* Added background */
.report-uploader-main-content .compliance-status{font-size:.9em;padding:3px 8px;border-radius:4px;margin-left:10px;white-space:nowrap; display: inline-block; vertical-align: middle;} /* Ensure alignment */
.report-uploader-main-content .section-content{line-height:1.6;margin-bottom:15px;padding:0 15px;color:#495057}

/* Step Number Indicator */
.report-uploader-main-content .step-number{margin-right:12px;font-weight:600;display:inline-flex;width:30px;height:30px;text-align:center;border-radius:50%;background-color:#3a86ff;color:#fff;font-size:14px;align-items:center;justify-content:center;flex-shrink:0}

/* Submit Button Container */
.report-uploader-main-content .report-submit-container{
    display:flex;
    align-items:center;
    margin-top:20px;
    width: 100%; /* Ensure container takes full width */
    justify-content: center; /* Center items horizontally */
}

/* Loader Animation */
.report-uploader-main-content .loader{border:4px solid #f3f3f3;border-top:4px solid #3a86ff;border-radius:50%;width:20px;height:20px;animation:spin 1s linear infinite;display:inline-block;vertical-align:middle; margin-right: 8px;} /* Added margin */
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}

/* Section Analysis Container */
.report-uploader-main-content .section-analysis-container{
    background-color:#fff;
    border:1px solid #e0e0e0; /* Base border */
    border-radius:8px;
    margin-bottom:10px; /* Reduced margin bottom */
    box-shadow:0 2px 5px rgba(0,0,0,.07);
    width:100%;
    box-sizing:border-box;
    overflow: hidden; /* Important for border-radius and content hiding */
}


/* Detailed Questions Section */
.report-uploader-main-content .detailed-questions-section{margin-top:25px;padding-top:20px;border-top:1px solid #eee}
.report-uploader-main-content .detailed-questions-section h4{color:#1a3a5f;font-size:17px;margin-bottom:18px;padding-bottom:8px;border-bottom:1px dashed #ccc}
.report-uploader-main-content .question-detail-item{
    background-color:#f8f9fa; /* Light background for question items */
    border:1px solid #dee2e6;
    border-radius:5px;
    padding:18px;
    margin-bottom:18px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05); /* Subtle shadow for items */
}

/* Alternating light blue backgrounds for question items */
.report-uploader-main-content .question-detail-item.odd {
    background-color: #e3f2fd; /* Very light blue */
}
.report-uploader-main-content .question-detail-item.even {
    background-color: #bbdefb; /* Slightly darker light blue */
}


.report-uploader-main-content .question-detail-header{
    display:flex;
    flex-direction: column; /* Stack items vertically by default */
    align-items: flex-start; /* Align items to the start */
    margin-bottom:12px;
    font-weight:700;
    color:#333;
    border-bottom: 1px dotted #ccc; /* Dotted line under header */
    padding-bottom: 8px;
}

/* Style for the div containing question number and status */
.report-uploader-main-content .question-detail-header .question-number-status {
    display: flex; /* Use flexbox to align number and status inline */
    align-items: center; /* Vertically align number and status */
    margin-bottom: 5px; /* Space between this line and the question text */
    width: 100%; /* Ensure it takes full width for alignment */
    justify-content: space-between; /* Space out number/status and status badge */
}


.report-uploader-main-content .question-detail-header div {
    /* Removed margin-bottom from here as it's now on .question-number-status */
}
.report-uploader-main-content .question-detail-header .compliance-status {
    margin-top: 0; /* Removed top margin as it's now inline */
    margin-left: 10px; /* Keep left margin for spacing */
    align-self: auto; /* Allow flexbox to handle alignment */
}

.report-uploader-main-content .question-detail-item p{
    margin-bottom:10px;
    line-height:1.6;
    color:#495057;
    font-weight:400;
    padding-left: 10px; /* Indent paragraph content */
    border-left: 3px solid #3a86ff; /* Accent border */
    padding-left: 15px; /* Add padding after the border */
}
.report-uploader-main-content .question-detail-item p:last-child {
    margin-bottom: 0; /* Remove bottom margin for the last paragraph */
}

.report-uploader-main-content .question-detail-item p strong{font-weight:700;color:#1a3a5f; margin-right: 5px;}

/* Specific colors for different question details */
.report-uploader-main-content .question-analysis {
    border-left-color: #007bff; /* Blue border for Analysis */
}
.report-uploader-main-content .question-gap {
    border-left-color: #ffc107; /* Yellow/Orange border for Gap */
}
.report-uploader-main-content .question-action {
    border-left-color: #28a745; /* Green border for Action */
}


/* Styling for the "all clear" message */
.report-uploader-main-content .all-clear-message {
    text-align: center;
    padding: 15px;
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    border: 1px solid #c3e6cb; /* Green border */
    border-radius: 5px;
    margin-top: 15px;
    font-weight: 500;
}

/* Responsive adjustments */
@media (max-width:992px){
.report-uploader-flex-container{flex-direction:column;height:auto;overflow:visible}
/* Hide the original history sidebar on small screens too */
.report-uploader-history-sidebar{display: none;}
.report-uploader-main-content{height:auto;overflow-y:visible;padding:15px} /* Adjusted padding */
.report-uploader-main-content .upload-container{padding:20px;max-width:100%} /* Adjusted padding */
.report-uploader-main-content .overall-data-table th,.report-uploader-main-content .overall-data-table td,
.report-uploader-main-content .section-summary-table th,.report-uploader-main-content .section-summary-table td{padding:10px;font-size:13px} /* Adjusted padding/font */
.report-uploader-main-content .overall-data-table th,.report-uploader-main-content .section-summary-table th{width:40%}
.report-uploader-main-content .question-detail-item{padding:15px} /* Adjusted padding */
.report-uploader-main-content .question-detail-header{flex-direction:column;align-items:flex-start}
.report-uploader-main-content .question-detail-header strong{margin-bottom:8px}
.report-uploader-main-content .compliance-status{margin-left:0;margin-top:8px;font-size:.85em}
.history-popup { width: calc(100% - 40px); right: 20px; max-width: 350px; } /* Adjust popup on smaller screens */
.report-uploader-main-content .upload-title { font-size: 20px; }
.report-uploader-main-content .score-circle { width: 60px; height: 60px; font-size: 18px; }
}

@media (max-width: 576px) {
    .report-uploader-main-content .upload-container{ padding: 15px; }
    .report-uploader-main-content .upload-title { font-size: 18px; padding-bottom: 8px; }
    .history-icon { top: 15px; right: 15px; }
    .history-popup { top: 60px; right: 15px; width: calc(100% - 30px); }
    .report-uploader-main-content .btn { padding: 10px 18px; font-size: 14px; }
    .report-uploader-main-content .overall-data-table,
    .report-uploader-main-content .section-summary-table { font-size: 12px; }
     .report-uploader-main-content .overall-data-table th, .report-uploader-main-content .overall-data-table td,
    .report-uploader-main-content .section-summary-table th, .report-uploader-main-content .section-summary-table td { padding: 8px; }
     .report-uploader-main-content .summary-header { flex-direction: column; align-items: flex-start; }
     .report-uploader-main-content .score-circle { margin-top: 10px; }
     .report-uploader-main-content .question-detail-item { padding: 12px; }
}

            `}</style>
            <div className="report-uploader-flex-container">
                {/* The original sidebar is hidden via CSS, content moved to popup */}
                <div className="report-uploader-history-sidebar"></div>

                <div className="report-uploader-main-content">
                    <div className="upload-container">
                        {/* Title Container */}
                        <div className="upload-title-container">
                            <h2 className="upload-title">Compliance Report</h2>
                        </div>
                        {/* History Icon - triggers popup */}
                        <span className="history-icon" onClick={() => setShowHistoryPopup(!showHistoryPopup)} title="View History" ref={historyIconRef}>
                            {/* Replaced clock icon SVG with three-line icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </span>

                        {/* History Pop-up */}
                        {showHistoryPopup && (
                            <div className={`history-popup ${showHistoryPopup ? 'visible' : ''}`} ref={historyPopupRef}>
                                <div className="popup-header">History</div>
                                {/* Button to start a new report */}
                                <button className="new-chat-btn" onClick={handleNewReportClick}>
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    <span>New Report</span>
                                </button>
                                {/* Render the list of history items */}
                                <div className="history-list">{renderHistory()}</div>
                            </div>
                        )}

                        {/* Step 1: Select Framework */}
                        <div className="upload-section">
                            <h3><span className="step-number">1</span>Select Framework</h3>
                            <form>
                                <div className="form-group">
                                    <select id="frameworkSelection" value={selectedFramework} onChange={handleFrameworkChange} required>
                                        <option value="">-- Select a Framework --</option>
                                        {/* Add more framework options here if needed */}
                                        <option value="brsr_basic">BRSR Reporting</option>
                                    </select>
                                </div>
                            </form>
                            {/* Display status/error message for framework selection */}
                            <div className="file-status" style={{ color: frameworkStatus.isError ? '#dc3545' : '#6c757d' }}>{frameworkStatus.message.replace("❌ ", "")}</div>
                        </div>

                        {/* Step 2: Upload Report (shown only after framework selection) */}
                        {showReportUpload && (
                            <div id="reportUploadSection" className="upload-section">
                                <h3><span className="step-number">2</span>Upload Report</h3>
                                <form id="reportUploadForm" onSubmit={handleComplianceSubmit}>
                                    {/* File Input */}
                                    <div className="form-group"><input type="file" id="reportFile" ref={reportFileRef} accept=".pdf,.txt,.md,.docx" onChange={handleFileChange} required /></div>
                                    {/* Optional Report Title Input */}
                                    <div className="form-group">
                                        <label htmlFor="reportTitle">Report Title (Optional):</label>
                                        <input type="text" id="reportTitle" value={reportTitle} onChange={handleReportTitleChange} placeholder="e.g., Q1 Compliance Report" />
                                    </div>
                                    {/* Submit Button and Status */}
                                    <div className="report-submit-container">
                                        <button type="submit" className="btn" id="checkComplianceBtn" disabled={isLoadingCompliance || !selectedFramework || !reportFile}>
                                            {/* Show loader or text based on loading state */}
                                            {isLoadingCompliance ? <><div className="loader"></div> Analyzing...</> : 'Check Compliance'}
                                        </button>
                                        {/* Display specific upload/check errors */}
                                        <div className="report-file-status">
                                            {complianceError && (complianceError.includes("Please upload") || complianceError.includes("check:")) ? complianceError.replace("❌ ", "") : ""}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Compliance Results Section */}
                        <div id="complianceResults">{renderComplianceResults()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Wrapper component that includes Sidebar and Header
const ComplianceReporting = (props) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    // Styles for layout - sidebar is present but hidden by CSS in ReportUploader
    const appSidebarStyle = { flex: sidebarExpanded ? "0 0 260px" : "0 0 60px", position: "sticky", top: 0, zIndex: 1000, transition: "flex 0.3s ease", height: "100vh", backgroundColor: "#fff", borderRight: "1px solid #eee" };
    const contentContainerStyle = { flex: 1, transition: "flex 0.3s ease", height: "100vh", display: 'flex', flexDirection: 'column', overflow: 'hidden' };
    const headerStyle = { zIndex: 999, flexShrink: 0, borderBottom: "1px solid #eee" };
    const mainWrapperStyle = { flexGrow: 1, overflow: 'hidden', width: '100%', display: 'flex', position: 'relative' };

    return (
        <div className="d-flex flex-row mainclass" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar component (rendered but hidden) */}
            <div style={appSidebarStyle}><Sidebar onSidebarToggle={setSidebarExpanded} isExpanded={sidebarExpanded} /></div>
            {/* Main content area including Header and ReportUploader */}
            <div style={contentContainerStyle}>
                <div style={headerStyle}><Header /></div>
                <div className="main_wrapper" style={mainWrapperStyle}><ReportUploader /></div>
            </div>
        </div>
    );
};

export default ComplianceReporting;
