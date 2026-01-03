import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../../../sidebar/sidebar';
import Header from '../../../header/header';
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import {
  generateTimePeriodOptions,
  getFrequency,
  getStartingMonth,
  handlePeriodChange as calculatePeriodChange,
  getPeriod
} from '../../../CarbonFootPrinting/utils/PeriodCalculationUtils';
import { FinancialYearField } from '../../../CarbonFootPrinting/common/FormComponents';
import MultiSelect from '../CommonComponent/MultiSelect';
import { getStore } from '../../../../utils/UniversalFunction';

const RequestApprovalContent = () => {
  const [locationOptions, setLocationOptions] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dueDateOverrides, setDueDateOverrides] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [identifier, setIdentifier] = useState();

  // Missing state variables - ADD THESE
  const [currentAction, setCurrentAction] = useState({ type: '', id: null, isBulk: false });
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [increasedDays, setIncreasedDays] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Period calculation states
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [initialPeriodToSet, setInitialPeriodToSet] = useState("");

  const start = getStartingMonth();
  const currentUser = getStore("currentUser");

  // API Functions
  const fetchFrequency = async () => {
    try {
      const frequencyData = await getFrequency(selectedFinancialYear);
      if (frequencyData) {
        setIdentifier(frequencyData);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  };

  useEffect(() => {
    if (selectedFinancialYear) {
      fetchFrequency();
    }
  }, [selectedFinancialYear]);

  // Generate time period options when identifier changes
  useEffect(() => {
    if (identifier) {
      const options = generateTimePeriodOptions(identifier, start);
      setTimePeriodOptions(options);
    }
  }, [identifier, start]);

  // Handle period change using utility function
  const handlePeriodChange = (value, financialYear, financialYearOptions, identifier, setFromDate, setToDate, startingMonth) => {
    if (value) {
      calculatePeriodChange(
        value,
        financialYear,
        financialYearOptions,
        identifier,
        setFromDate,
        setToDate,
        setInitialPeriodToSet
      );
    } else {
      // Clear dates when no period selected
      setFromDate("");
      setToDate("");
    }
  };

const getUniqueUsers = useCallback(() => {
  const userMap = new Map();

  dueDateOverrides.forEach(item => {
    if (item.userId && item.userName) {
      if (!userMap.has(item.userId)) {
        userMap.set(item.userId, {
          value: String(item.userId),
          label: item.userName.trim(),
        });
      }
    }
  });

  return Array.from(userMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}, [dueDateOverrides]);


  const getFinancialYears = async () => {
    try {
      const storedData = localStorage.getItem('financialYearsData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData.map(fy => ({ value: String(fy.id), label: fy.financial_year_value })));
          setSelectedFinancialYear(String(parsedData[parsedData.length - 1].id));

        }
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );

        if (isSuccess && data?.data.length > 0) {
          localStorage.setItem('financialYearsData', JSON.stringify(data.data));
          setFinancialYears(data.data.map(fy => ({ value: String(fy.id), label: fy.financial_year_value })));
          setSelectedFinancialYear(String(data.data[data.data.length - 1].id));
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  const getSource = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        setLocationOptions(response.data.data.map(loc => ({
          value: String(loc.id),
          label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
        })));
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const getDueDateOverrides = async () => {
    if (!selectedFinancialYear) return;

    setLoading(true);
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}dueDate/Overrides`,
        {},
        { financialYearId: selectedFinancialYear },
        "GET"
      );
      if (response.isSuccess) {
        console.log(response, "responseresponse")
        setDueDateOverrides(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching due date overrides:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and tab logic
  const applyFiltersAndTabs = useCallback(() => {
    let filtered = [...dueDateOverrides];

    // Apply tab filter first
    if (activeTab === "pending") {
      filtered = filtered.filter(item => item.status.toLowerCase() === "pending");
    } else if (activeTab === "approved") {
      filtered = filtered.filter(item => item.status.toLowerCase() === "approved");
    }

    // Apply location filter (multiple locations)
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(item =>
        selectedLocations.some(location => location == item.sourceId.toString())
      );
    }

    // Apply user filter (multiple users)
    if (selectedUsers.length > 0) {
      filtered = filtered.filter(item =>
        selectedUsers.some(user => user == item.userId.toString())
      );
    }

    // Apply period filter (multiple periods)
    // if (selectedPeriods.length > 0) {
    //   filtered = filtered.filter(item => {
    //     const itemFromDate = new Date(item.fromDate);
    //     const itemToDate = new Date(item.toDate);

    //     return selectedPeriods.some(period => {
    //       // For each selected period, we would need to calculate its date range
    //       // This is a simplified approach - you might need to enhance this based on your period calculation logic
    //       return true; // Placeholder logic
    //     });
    //   });
    // }

    setFilteredData(filtered);
  }, [dueDateOverrides, activeTab, selectedLocations, selectedPeriods, selectedUsers]);

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedPeriods([]);
    setSelectedUsers([]);
    setFromDate("");
    setToDate("");
  };

  // Handle single approval action
  const handleApprove = async (overrideId) => {
    setCurrentAction({ type: 'approve', id: overrideId, isBulk: false });
    setShowApprovalPopup(true);
  };


  // Handle bulk approve all
  const handleApproveAll = () => {
    const pendingItems = filteredData.filter(item => item.status.toLowerCase() === 'pending');
    if (pendingItems.length === 0) return;

    setCurrentAction({ type: 'approve', id: null, isBulk: true });
    setShowApprovalPopup(true);
  };


  // Execute approval action
  const executeApproval = async () => {
    if (!increasedDays.trim()) {
      alert('Please enter the number of increased days');
      return;
    }

    setProcessingAction(true);
    try {
      if (currentAction.isBulk) {
        // Bulk approve all pending items
        const pendingItems = filteredData.filter(item => item.status.toLowerCase() === 'pending');
        const ids = pendingItems.map(item =>item.id);
         await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}dueDate/requestOverride/approve`,
          {},
          { increasedDays: parseInt(increasedDays),ids: ids},
          "POST"
        );
      } else {
        // Single approval
        await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}dueDate/requestOverride/approve`,
          {},
          { increasedDays: parseInt(increasedDays),ids: [currentAction.id]},
          "POST"
        );
      }

      // Refresh data
      getDueDateOverrides();
      setShowApprovalPopup(false);
      setIncreasedDays('');
    } catch (error) {
      console.error("Error approving override(s):", error);
      alert('Error occurred while processing approval');
    } finally {
      setProcessingAction(false);
    }
  };

  // Close popups
  const closePopups = () => {
    setShowApprovalPopup(false);
    setShowRejectPopup(false);
    setIncreasedDays('');
    setCurrentAction({ type: '', id: null, isBulk: false });
  };

  // Effects
  useEffect(() => {
    getFinancialYears();
    getSource();
  }, []);

  useEffect(() => {
    if (selectedFinancialYear) {
      getDueDateOverrides();
    }
  }, [selectedFinancialYear]);

  useEffect(() => {
    applyFiltersAndTabs();
  }, [applyFiltersAndTabs]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    // Handle YYYY-MM format
    if (dateString.length === 7 && dateString.includes('-')) {
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    }

    // Handle full date format
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="request-approval-container w-100 h-100">
      {/* Enhanced Styles */}
      <style jsx>{`
        .request-approval-container {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .page-header {
          background: linear-gradient(135deg, #4a90a4 0%, #4a90a4 100%);
          color: white;
          padding: 2.5rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .page-header p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0.5rem 0 0 0;
          font-weight: 300;
        }

        .filters-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.5);
          
        }

        .selection-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          align-items: end;
        }

        .clear-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
          white-space: nowrap;
        }

        .clear-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        }

        .period-range-info {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #2196f3;
        }

        .tabs-container {
          margin-bottom: 2rem;
        }

        .nav-tabs {
          border: none;
          background: white;
          border-radius: 15px;
          padding: 0.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          display: inline-flex;
        }

        .nav-tabs .nav-item {
          margin: 0;
        }

        .nav-tabs .nav-link {
          border: none;
          color: #64748b;
          font-weight: 600;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .nav-tabs .nav-link.active {
          background: linear-gradient(135deg, #4a90a4 0%, #4a90a4 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-tabs .nav-link:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #4a90a4;
        }

        /* Accept All Section Styles - Inside Results Card */
        .accept-all-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 15px;
          border: 2px solid #0ea5e9;
        }

        .accept-all-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-accept-all {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 200px;
        }

        .btn-accept-all:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.6);
        }

        .btn-reject-all {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 200px;
        }

        .btn-reject-all:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.6);
        }

        .btn-accept-all:disabled,
        .btn-reject-all:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .accept-all-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-accept-all,
          .btn-reject-all {
            width: 100%;
            max-width: 300px;
          }
        }

        .results-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .results-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .results-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .modern-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .modern-table thead {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .modern-table th {
          padding: 1.25rem 1rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }

        .modern-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: top;
        }

        .modern-table tbody tr {
          transition: all 0.2s ease;
        }

        .modern-table tbody tr:hover {
          background: rgba(63, 136, 165, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .question-cell {
          max-width: 300px;
        }

        .question-id {
          color: #6b7280;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .question-title {
          margin-top: 0.25rem;
          color: #374151;
          font-weight: 500;
          line-height: 1.4;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .status-pending {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #92400e;
        }

        .status-approved {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .status-rejected {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .btn-approve:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .btn-reject:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .date-cell {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          color: #4b5563;
        }

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-container {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .popup-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .popup-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .popup-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .popup-content {
          padding: 2rem;
        }

        .warning-text, .confirmation-text {
          margin-bottom: 1.5rem;
          color: #4b5563;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .popup-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e5e7eb;
          justify-content: flex-end;
        }

        .btn-popup-cancel {
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-popup-cancel:hover {
          background: #e5e7eb;
        }

        .btn-popup-confirm {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-popup-confirm:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }

        .btn-popup-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* Header Section */}
      <div className="page-header">
        <h1>Due Date Override Requests</h1>
        <p>Manage and approve due date override requests with advanced filtering</p>
      </div>

      {/* Filters Card */}
      <div className="filters-card">
        <div className="selection-fields">
          <div>
            <FinancialYearField
              value={selectedFinancialYear}
              onChange={setSelectedFinancialYear}
              options={financialYears}
              required={true}
              disabled={false}
            />
          </div>

          <div>
            <MultiSelect
              options={locationOptions}
              selectedValues={selectedLocations}
              onChange={setSelectedLocations}
              placeholder="Choose locations..."
              label="Location"
              icon="📍"
              activeTab={activeTab}
            />
          </div>

          <div>
            <MultiSelect
              options={timePeriodOptions}
              selectedValues={selectedPeriods}
              onChange={setSelectedPeriods}
              placeholder="Choose time periods..."
              label="Time Period"
              icon="📅"
              activeTab={activeTab}
            />
          </div>

          <div>
            <MultiSelect
              options={getUniqueUsers()}
              selectedValues={selectedUsers}
              onChange={setSelectedUsers}
              placeholder="Choose users..."
              label="User"
              icon="👤"
              activeTab={activeTab}
            />
          </div>

          <div>
            <button className="clear-button" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Show selected period range */}
      {fromDate && toDate && (
        <div className="period-range-info">
          <strong>Selected Period Range:</strong> {formatDate(fromDate)} - {formatDate(toDate)}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({dueDateOverrides.filter(item => item.status.toLowerCase() === 'pending').length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved ({dueDateOverrides.filter(item => item.status.toLowerCase() === 'approved').length})
            </button>
          </li>
        </ul>
      </div>

      {/* Results Card */}
      <div className="results-card">
        <div
          className="results-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h2 style={{ margin: 0 }}>
            {activeTab === "pending" ? "Pending Requests" : "Approved Requests"} ({filteredData.length})
          </h2>
          <div className="action-buttons">
            { !currentUser?.parent_id && activeTab === 'pending' && (
              <button
                className="btn-approve"
                onClick={() => handleApproveAll()}
                disabled={processingAction || (filteredData && filteredData.length === 0)}
              >
                Approve All
              </button>
            )}
          </div>
        </div>



        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No {activeTab} requests found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>User</th>
                  <th>Location</th>
                  <th>Period</th>
                  <th>Due Date</th>
                  <th>Request Date</th>
                  {!currentUser?.parent_id && activeTab === 'pending' && <th>Actions</th>}
                  {activeTab === 'approved' && <th>Approved By</th>}
                  {activeTab === 'approved' && <th>Approval Date</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div className="question-cell">
                        <div className="question-title" title={item.questionTitle}>
                          {item.questionTitle ?
                            (item.questionTitle.length > 50 ?
                              item.questionTitle.substring(0, 50) + '...' :
                              item.questionTitle
                            ) : 'N/A'
                          }
                        </div>
                      </div>
                    </td>
                    <td><strong>{item.userName || 'N/A'}</strong></td>
                    <td>{item.location || 'N/A'}</td>
                    <td className="date-cell">{formatDate(item.fromDate)} - {formatDate(item.toDate)}</td>
                    <td className="date-cell">{item.dueDateTime ? formatDate(item.dueDateTime) : 'N/A'}</td>
                    <td className="date-cell">{formatDate(item.requestDate)}</td>
                    {!currentUser?.parent_id && activeTab === 'pending' && (
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    )}
                    {activeTab === 'approved' && <td><strong>{item.approverName || 'N/A'}</strong></td>}
                    {activeTab === 'approved' && <td className="date-cell">{item.approvalDate ? formatDate(item.approvalDate) : 'N/A'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Popup */}
      {showApprovalPopup && (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && closePopups()}>
          <div className="popup-container">
            <div className="popup-header">
              <h3 className="popup-title">
                {currentAction.isBulk ? 'Approve All Requests' : 'Approve Request'}
              </h3>
              <button className="popup-close" onClick={closePopups}>×</button>
            </div>
            <div className="popup-content">
              <div className="warning-text">
                {currentAction.isBulk
                  ? `You are about to approve ${filteredData.filter(item => item.status.toLowerCase() === 'pending').length} pending requests.`
                  : 'You are about to approve this request.'
                }
              </div>
              <div className="form-group">
                <label className="form-label">Increased Days *</label>
                <input
                  type="number"
                  className="form-input"
                  value={increasedDays}
                  onChange={(e) => setIncreasedDays(e.target.value)}
                  placeholder="Enter number of days"
                  min="0"
                  max="365"
                />
                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Number of additional days to extend the due date
                </small>
              </div>
            </div>
            <div className="popup-actions">
              <button className="btn-popup-cancel" onClick={closePopups}>
                Cancel
              </button>
              <button
                className="btn-popup-confirm"
                onClick={executeApproval}
                disabled={processingAction || !increasedDays.trim()}
              >
                {processingAction ? 'Processing...' : (currentAction.isBulk ? 'Approve All' : 'Approve')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RequestApproval = (props) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const appSidebarStyle = {
    flex: sidebarExpanded ? "0 0 260px" : "0 0 60px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "flex 0.3s ease",
    height: "100vh",
    backgroundColor: "#fff",
    borderRight: "1px solid #eee"
  };
  const contentContainerStyle = {
    flex: 1,
    transition: "flex 0.3s ease",
    height: "100vh",
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };
  const headerStyle = {
    zIndex: 999,
    flexShrink: 0,
    borderBottom: "1px solid #eee"
  };
  const mainWrapperStyle = {
    flexGrow: 1,
    overflow: 'auto',
    width: '100%',
    display: 'flex',
    position: 'relative'
  };

  return (
    <div className="d-flex flex-row mainclass" style={{ height: "100vh", overflow: "hidden" }}>
      <div style={appSidebarStyle}>
        <Sidebar onSidebarToggle={setSidebarExpanded} isExpanded={sidebarExpanded} />
      </div>
      <div style={contentContainerStyle}>
        <div style={headerStyle}>
          <Header />
        </div>
        <div className="main_wrapper" style={mainWrapperStyle}>
          <RequestApprovalContent />
        </div>
      </div>
    </div>
  );
};

export default RequestApproval;