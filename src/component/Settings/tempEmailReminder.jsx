import { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import { FinancialYearField } from "../CarbonFootPrinting/common/FormComponents";
import { generateTimePeriodOptions, getStartingMonth } from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import { fetchFrequency, getFinancialYear, getSource } from "../Training/training-dashboard/services/trainingService";
import MultiSelect from "../Company Sub Admin/Component/CommonComponent/MultiSelect";
import "./EmailReminder.css";

const EmailReminder = () => {
    // Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Financial Year related states
    const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
    const [financialYearOptions, setFinancialYearOptions] = useState([]);
    const [financialYear, setFinancialYear] = useState([]);
    const [financialYearId, setFinancialYearId] = useState(null);

    // Tab and modal states
    const [activeTab, setActiveTab] = useState("oneTime");
    const [showModal, setShowModal] = useState(false);
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);
    const [openAccordions, setOpenAccordions] = useState({});
    const [openPeriodAccordions, setOpenPeriodAccordions] = useState({});

    // Data states
    const [locations, setLocations] = useState([]);
    const [timePeriodOptions, setTimePeriodOptions] = useState([]);
    const [reminderList, setReminderList] = useState([]);
    const [frequency, setFrequency] = useState('MONTHLY');

    // Selection states
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [selectedPeriodsValue, setSelectedPeriodsValue] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    // Add reminder modal states
    const [addReminderData, setAddReminderData] = useState({
        locationId: null,
        period: null,
        reminderDays: "",
        recurring: ""
    });

    const [modalForm, setModalForm] = useState({
        locations: [],
        periods: [],
        dueDateOption: "",
        dueDate: "",
        applyRule: "",
        ruleDays: "",
        reminderDays: "",
        recurring: "",
        reminderList: []
    });

    // Utility function to get financial year by ID
    const getFinancialYearById = (id) => {
        const result = financialYear.find(item => item.id === id);
        return result ? result.financial_year_value : null;
    };

    const getPeriodsLabel = (value) => {
        const period = periodOptions.find(m => m.value === String(value));
        return period ? period.label : null;
    }

    // Calculate date range function
    const calculateDateRange = (type, period, startingMonth, year) => {
        const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
        const startYear =
            year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
        const endMonth = ((startMonth - 1 + type) % 12) + 1;
        const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

        const formatDate = (month, year) =>
            `${year}-${month < 10 ? `0${month}` : month}-01`;
        return {
            period: Number(period),
            periodLevel: getPeriodsLabel(period),
            fromDate: formatDate(startMonth, startYear),
            toDate: formatDate(endMonth, endYear),
        };
    };


    // Helper functions for reminder management
    const addReminder = () => {
        if (modalForm.reminderDays && modalForm.recurring) {
            const newReminder = {
                id: crypto.randomUUID(),
                days: modalForm.reminderDays,
                frequency: modalForm.recurring
            };

            setModalForm(prev => ({
                ...prev,
                reminderList: [...(prev.reminderList || []), newReminder],
                reminderDays: '',
                recurring: ''
            }));
        }
    };


    const removeReminder = (index) => {
        setModalForm(prev => ({
            ...prev,
            reminderList: prev.reminderList.filter((_, i) => i !== index)
        }));
    };

    const loadExistingReminders = async (financialYearId) => {
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailReminders`,
                {},
                { financialYearId: financialYearId },
                "GET"
            );

            if (isSuccess && data) {
                const transformedReminders = data.data.map(item => ({
                    id: item.id,
                    type: item.reminderType,
                    financialYear: item.financialYearId,
                    location: item.locationId,
                    period: item.periodId,
                    periodRecord: item.periodRecord,
                    dueDateOption: item.dueDateType,
                    dueDate: item.fixedDate || "",
                    applyRule: item.rule || "",
                    ruleDays: item.ruleDays || "",
                    reminderList: item.reminders.map(rem => ({
                        id: rem.id,
                        days: rem.daysBeforeDueDate,
                        frequency: rem.frequency
                    })),
                    isActive: item.isActive,
                    status: item.status,
                    remark: item.remark,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }));

                setReminderList(transformedReminders);
            }
        } catch (error) {
            console.error("Error loading reminders:", error);
        }
    };

    useEffect(() => {
        if (!financialYearId || !selectedPeriods?.length) return;

        const selectedYear = getFinancialYearById(financialYearId);
        if (!selectedYear) return;

        const year = parseInt(selectedYear.split("-")[0]);
        const start = getStartingMonth();

        const dateRanges = selectedPeriods.map(period => {
            let dateRange;

            if (frequency === "HALF_YEARLY") {
                dateRange = calculateDateRange(6, period, start, year);
            } else if (frequency === "QUARTERLY") {
                dateRange = calculateDateRange(3, period, start, year);
            } else if (frequency === "MONTHLY") {
                dateRange = calculateDateRange(1, period, start, year);
            } else if (frequency === "YEARLY") {
                dateRange = calculateDateRange(12, 1, start, year);
            }
            return dateRange;
        });

        setSelectedPeriodsValue(dateRanges);

    }, [selectedPeriods, financialYearId, frequency, financialYear]);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                const financialYearResult = await getFinancialYear();

                if (financialYearResult) {
                    setFinancialYear(financialYearResult.data);
                    setFinancialYearId(financialYearResult.currentId);

                    const fyOptions = financialYearResult.data.map(fy => ({
                        value: fy.id,
                        label: fy.financial_year_value
                    }));
                    setFinancialYearOptions(fyOptions);
                    setSelectedFinancialYear(financialYearResult.currentId);

                    const [locationsData, frequencyData] = await Promise.all([
                        getSource(),
                        fetchFrequency(financialYearResult.currentId),
                    ]);

                    setLocations(locationsData);
                    setFrequency(frequencyData);

                    await loadExistingReminders(financialYearResult.currentId);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        if (frequency) {
            const start = getStartingMonth();
            const options = generateTimePeriodOptions(frequency, start);
            setTimePeriodOptions(options);
        }
    }, [frequency]);

    useEffect(() => {
        if (selectedFinancialYear && selectedFinancialYear !== financialYearId) {
            loadExistingReminders(selectedFinancialYear);
        }
    }, [selectedFinancialYear]);

    const locationOptions = locations.map(loc => ({
        value: loc.id,
        label: loc?.unitCode || `${loc?.location?.area || ""}, ${loc?.location?.city || ""}`.trim()
    }));

    const periodOptions = (timePeriodOptions || []).map(period => ({
        value: period.value,
        label: period.label
    }));

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const toggleLocationAccordion = (locationIndex) => {
        setOpenAccordions(prev => ({
            ...prev,
            [locationIndex]: !prev[locationIndex]
        }));
    };

    const togglePeriodAccordion = (locationIndex, periodIndex) => {
        const key = `${locationIndex}_${periodIndex}`;
        setOpenPeriodAccordions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleModalSubmit = async () => {
        if (!selectedLocations.length ||
            !modalForm.dueDateOption ||
            (modalForm.dueDateOption === 'selectDate' && !modalForm.dueDate) ||
            (modalForm.dueDateOption === 'applyRule' && (!modalForm.applyRule || !modalForm.ruleDays)) ||
            !modalForm.reminderList?.length) {
            alert("Please fill all required fields");
            return;
        }

        try {
            setIsLoading(true);
            console.log(periodOptions, selectedPeriodsValue)
            const payload = {
                financialYear: parseInt(selectedFinancialYear),
                reminderType: activeTab,
                dueDateConfiguration: {
                    type: modalForm.dueDateOption,
                    ...(modalForm.dueDateOption === 'selectDate'
                        ? { fixedDate: modalForm.dueDate }
                        : {
                            rule: modalForm.applyRule,
                            days: parseInt(modalForm.ruleDays)
                        }
                    )
                },
                periodRecords: selectedPeriodsValue,
                reminders: modalForm.reminderList.map(reminder => ({
                    daysBeforeDueDate: parseInt(reminder.days),
                    frequency: reminder.frequency,
                    id: reminder.id
                })),
                locations: selectedLocations.map(id => parseInt(id)),
                ...(activeTab === 'custom' && { periods: selectedPeriods.map(id => parseInt(id)) }),
                isActive: true,
                createdAt: new Date().toISOString()
            };

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailReminder`,
                {},
                payload,
                "POST"
            );

            if (isSuccess) {
                await loadExistingReminders(selectedFinancialYear);
                setShowModal(false);
                setModalForm({
                    locations: [],
                    periods: [],
                    dueDateOption: "",
                    dueDate: "",
                    applyRule: "",
                    ruleDays: "",
                    reminderDays: "",
                    recurring: "",
                    reminderList: []
                });
                setSelectedLocations([]);
                setSelectedPeriods([]);
            } else {
                throw new Error("Failed to save reminder configuration");
            }

        } catch (error) {
            console.error("Error saving reminder:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSingleReminder = async () => {
        if (!addReminderData.reminderDays || !addReminderData.recurring) {
            alert("Please fill all reminder fields");
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                locationId: parseInt(addReminderData.locationId),
                ...(activeTab === 'custom' && { periodId: parseInt(addReminderData.periodId) }),
                daysBeforeDueDate: parseInt(addReminderData.reminderDays),
                frequency: addReminderData.recurring,
                reminderType: activeTab,
                financialYearId: parseInt(selectedFinancialYear)
            };

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailReminderSingle`,
                {},
                payload,
                "POST"
            );

            if (isSuccess) {
                await loadExistingReminders(selectedFinancialYear);
                setShowAddReminderModal(false);
                setAddReminderData({
                    locationId: null,
                    periodId: null,
                    reminderDays: "",
                    recurring: ""
                });
            } else {
                throw new Error("Failed to add reminder");
            }

        } catch (error) {
            console.error("Error adding reminder:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReminder = async (reminderId, tablePKId) => {
        try {
            setIsLoading(true);

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailReminder`,
                {},
                { id: reminderId, tablePKId },
                "DELETE"
            );

            if (isSuccess) {
                await loadExistingReminders(selectedFinancialYear);
            } else {
                throw new Error("Failed to delete reminder");
            }
        } catch (error) {
            console.error("Error deleting reminder:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            const reminder = reminderList.find(item => item.id === id);

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailReminderStatus`,
                {},
                {
                    id: parseInt(id),
                    isActive: !reminder.isActive
                },
                "PUT"
            );

            if (isSuccess) {
                setReminderList(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, isActive: !item.isActive } : item
                    )
                );
            } else {
                throw new Error("Failed to update reminder status");
            }
        } catch (error) {
            console.error("Error updating reminder status:", error);
        }
    };

    const getLocationLabel = (locationValue) => {
        const location = locationOptions.find(loc => loc.value === locationValue);
        return location ? location.label : locationValue;
    };

    const getPeriodLabel = (periodValue) => {
        const period = periodOptions.find(per => per.value === periodValue);
        return period ? period.label : periodValue;
    };

    // Group reminders by location for One Time and Every Year tabs
    const groupRemindersByLocationOnly = () => {
        const grouped = {};

        reminderList
            .filter(reminder => reminder.type === activeTab)
            .forEach(reminder => {
                const locationKey = reminder.location;
                if (!grouped[locationKey]) {
                    grouped[locationKey] = {
                        location: locationKey,
                        locationLabel: getLocationLabel(locationKey),
                        reminders: []
                    };
                }
                grouped[locationKey].reminders.push(reminder);
            });

        return Object.values(grouped);
    };

    // Calculate date range for a specific period
    const calculatePeriodDateRange = (periodValue) => {
        if (!financialYearId || !periodValue) return null;

        const selectedYear = getFinancialYearById(financialYearId);
        if (!selectedYear) return null;

        const year = parseInt(selectedYear.split("-")[0]);
        const start = getStartingMonth();

        let dateRange;
        if (frequency === "HALF_YEARLY") {
            dateRange = calculateDateRange(6, periodValue, start, year);
        } else if (frequency === "QUARTERLY") {
            dateRange = calculateDateRange(3, periodValue, start, year);
        } else if (frequency === "MONTHLY") {
            dateRange = calculateDateRange(1, periodValue, start, year);
        } else if (frequency === "YEARLY") {
            dateRange = calculateDateRange(12, 1, start, year);
        }
        return dateRange;
    };

    // Group reminders by location and then by periods for Custom tab
    const groupRemindersByLocationAndPeriod = () => {
        const grouped = {};

        reminderList
            .filter(reminder => reminder.type === 'custom')
            .forEach(reminder => {
                const locationKey = reminder.location;
                if (!grouped[locationKey]) {
                    grouped[locationKey] = {
                        location: locationKey,
                        locationLabel: getLocationLabel(locationKey),
                        periods: {}
                    };
                }

                const periodKey = reminder.period || 'default';
                if (!grouped[locationKey].periods[periodKey]) {
                    const dateRange = calculatePeriodDateRange(reminder.period);
                    grouped[locationKey].periods[periodKey] = {
                        period: periodKey,
                        periodLabel: reminder.period ? reminder?.periodRecord?.periodLevel : 'All Periods',
                        fromDate: reminder?.periodRecord?.fromDate || (dateRange ? dateRange.start : ''),
                        toDate: reminder?.periodRecord?.toDate || (dateRange ? dateRange.end : ''),
                        reminders: [],
                        tablePKId: reminder.id,
                        dueDateOption: reminder.dueDateOption,
                        rule: reminder.dueDateOption === "applyRule" ? `${reminder.ruleDays} days ${reminder.applyRule}` : null,
                        dueDate: reminder.dueDate,
                    };
                }

                grouped[locationKey].periods[periodKey].reminders.push(reminder);
            });

        return Object.values(grouped).map(location => ({
            ...location,
            periods: Object.values(location.periods)
        }));
    };

    const openAddReminderModal = (locationId, period = null) => {
        setAddReminderData({
            locationId,
            period,
            reminderDays: "",
            recurring: ""
        });
        setShowAddReminderModal(true);
    };

    if (loading || isLoading) {
        return (
            <div className="email-reminder-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="email-reminder-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="email-reminder-container">
            <div className="email-reminder-header">
                <h2 className="header-title">🌍 Email Reminder Management</h2>
                <p className="header-subtitle">Manage email reminder database settings for different financial years</p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-container">
                <div className="tabs-navigation">
                    <button
                        className={`tab-button ${activeTab === 'oneTime' ? 'active' : ''}`}
                        onClick={() => handleTabChange('oneTime')}
                    >
                        <span className="tab-icon">🎯</span>
                        <span className="tab-text">One Time</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'everyYear' ? 'active' : ''}`}
                        onClick={() => handleTabChange('everyYear')}
                    >
                        <span className="tab-icon">🔄</span>
                        <span className="tab-text">Every Financial Year</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={() => handleTabChange('custom')}
                    >
                        <span className="tab-icon">⚙️</span>
                        <span className="tab-text">Custom</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                <div className="controls-section">
                    <div className="control-item">
                        <FinancialYearField
                            value={selectedFinancialYear}
                            onChange={setSelectedFinancialYear}
                            options={financialYearOptions}
                            required={true}
                            disabled={false}
                        />
                    </div>

                    <div className="control-item">
                        <button
                            className="global-reminder-btn"
                            onClick={() => setShowModal(true)}
                        >
                            <span className="btn-icon">🌐</span>
                            <span className="btn-text">Set Due Date And Email Reminder</span>
                        </button>
                    </div>


                </div>
            </div>

            {/* Reminder List Display */}
            {reminderList.length > 0 && (
                <div className="reminders-section">
                    <div className="section-header">
                        <h5 className="section-title">
                            Configured Reminders -
                            {activeTab === 'oneTime' ? ' One Time' :
                                activeTab === 'everyYear' ? ' Every Financial Year' : ' Custom'}
                        </h5>
                    </div>

                    <div className="reminders-accordion">
                        {/* For One Time and Every Year - Show Location → Reminders */}
                        {(activeTab === 'oneTime' || activeTab === 'everyYear') &&
                            groupRemindersByLocationOnly().map((locationGroup, locationIndex) => (
                                <div key={locationGroup.location} className="accordion-item">
                                    <div className="accordion-header">
                                        <button
                                            className={`accordion-button ${!openAccordions[locationIndex] ? 'collapsed' : ''}`}
                                            style={{
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '0 1rem',
                                                backgroundColor: openAccordions[locationIndex] ? '#4a90a4' : '#bfd7e0',
                                                color: openAccordions[locationIndex] ? 'white' : '#333',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '8px',
                                                marginBottom: '2px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => toggleLocationAccordion(locationIndex)}
                                        >
                                            <div className="accordion-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span className="location-icon" style={{ fontSize: '1.1rem' }}>📍</span>
                                                <span className="location-name" style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                                    {locationGroup.locationLabel}
                                                </span>
                                                <span className="reminder-count" style={{
                                                    fontSize: '0.85rem',
                                                    opacity: '0.8',
                                                    backgroundColor: openAccordions[locationIndex] ? 'white' : 'white',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px'
                                                }}>
                                                    ({locationGroup.reminders.length} reminder(s))
                                                </span>
                                            </div>
                                            <span className="accordion-arrow" style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: openAccordions[locationIndex] ? 'white' : 'white'
                                            }}>
                                                {openAccordions[locationIndex] ? '−' : '+'}
                                            </span>
                                        </button>
                                    </div>
                                    {openAccordions[locationIndex] && (
                                        <div className="accordion-content" style={{
                                            padding: '1rem',
                                            backgroundColor: '#fafbfc',
                                            borderRadius: '0 0 8px 8px',
                                            border: '1px solid #dee2e6',
                                            borderTop: 'none'
                                        }}>
                                            <div className="content-header" style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '1rem'
                                            }}>
                                                <h6 className="content-title" style={{
                                                    margin: 0,
                                                    color: '#4a90a4',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <i className="fas fa-bell"></i>
                                                    Reminder Details
                                                </h6>
                                                <button
                                                    className="add-reminder-btn"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#4a90a4',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onClick={() => openAddReminderModal(locationGroup.location)}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#357a8a'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#4a90a4'}
                                                >
                                                    <span className="btn-icon">
                                                        <i className="fas fa-plus"></i>
                                                    </span>
                                                    <span className="btn-text">Add Reminder</span>
                                                </button>
                                            </div>

                                            <div className="reminder-table-container" style={{
                                                overflowX: 'auto',
                                                borderRadius: '8px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <table className="reminder-table" style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    backgroundColor: 'white'
                                                }}>
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Type</th>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Due Date</th>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Days Before</th>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Frequency</th>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Status</th>
                                                            <th style={{
                                                                padding: '0.75rem',
                                                                borderBottom: '2px solid #dee2e6',
                                                                color: '#495057',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem'
                                                            }}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {locationGroup.reminders.map(reminder =>
                                                            reminder.reminderList?.map((rem, remIndex) => (
                                                                <tr key={`${reminder.id}_${remIndex}`} style={{
                                                                    borderBottom: '1px solid #f1f3f4'
                                                                }}>
                                                                    {remIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={reminder.reminderList.length} style={{
                                                                                padding: '0.75rem',
                                                                                borderRight: '1px solid #f1f3f4',
                                                                                textAlign: 'center'
                                                                            }}>
                                                                                <span className={`type-text ${reminder.type}`} style={{
                                                                                    backgroundColor: reminder.type === 'oneTime' ? '#4a90a4' : '#5a9bd4',
                                                                                    color: 'white',
                                                                                    padding: '0.25rem 0.75rem',
                                                                                    borderRadius: '12px',
                                                                                    fontSize: '0.8rem',
                                                                                    fontWeight: '500'
                                                                                }}>
                                                                                    {reminder.type === 'oneTime' ? 'One Time' : 'Every Year'}
                                                                                </span>
                                                                            </td>
                                                                            <td rowSpan={reminder.reminderList.length} style={{
                                                                                padding: '0.75rem',
                                                                                borderRight: '1px solid #f1f3f4'
                                                                            }}>
                                                                                <div className="due-date-info" style={{
                                                                                    backgroundColor: '#f8f9fa',
                                                                                    padding: '0.5rem',
                                                                                    borderRadius: '6px',
                                                                                    fontSize: '0.85rem',
                                                                                    color: '#495057'
                                                                                }}>
                                                                                    {reminder.dueDateOption === 'selectDate'
                                                                                        ? reminder.dueDate
                                                                                        : `${reminder.ruleDays} days ${reminder.applyRule} period`
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                    <td style={{
                                                                        padding: '0.75rem',
                                                                        borderRight: '1px solid #f1f3f4',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        <span className="days-text" style={{
                                                                            backgroundColor: '#4a90a4',
                                                                            color: 'white',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '12px',
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: '500'
                                                                        }}>
                                                                            {rem.days} days
                                                                        </span>
                                                                    </td>
                                                                    <td style={{
                                                                        padding: '0.75rem',
                                                                        borderRight: '1px solid #f1f3f4',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        <span className="frequency-text" style={{
                                                                            backgroundColor: '#5a9bd4',
                                                                            color: 'white',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '12px',
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: '500'
                                                                        }}>
                                                                            {rem.frequency}
                                                                        </span>
                                                                    </td>
                                                                    {remIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={reminder.reminderList.length} style={{
                                                                                padding: '0.75rem',
                                                                                borderRight: '1px solid #f1f3f4',
                                                                                textAlign: 'center'
                                                                            }}>
                                                                                <label className="toggle-switch" style={{
                                                                                    position: 'relative',
                                                                                    display: 'inline-block',
                                                                                    width: '50px',
                                                                                    height: '24px'
                                                                                }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={reminder.isActive}
                                                                                        onChange={() => handleToggleActive(reminder.id)}
                                                                                        style={{ opacity: 0, width: 0, height: 0 }}
                                                                                    />
                                                                                    <span className="toggle-slider" style={{
                                                                                        position: 'absolute',
                                                                                        cursor: 'pointer',
                                                                                        top: 0,
                                                                                        left: 0,
                                                                                        right: 0,
                                                                                        bottom: 0,
                                                                                        backgroundColor: reminder.isActive ? '#4a90a4' : '#ccc',
                                                                                        transition: '0.4s',
                                                                                        borderRadius: '24px'
                                                                                    }}>
                                                                                        <span style={{
                                                                                            position: 'absolute',
                                                                                            content: '',
                                                                                            height: '18px',
                                                                                            width: '18px',
                                                                                            left: reminder.isActive ? '29px' : '3px',
                                                                                            bottom: '3px',
                                                                                            backgroundColor: 'white',
                                                                                            transition: '0.4s',
                                                                                            borderRadius: '50%'
                                                                                        }}></span>
                                                                                    </span>
                                                                                </label>
                                                                            </td>
                                                                            <td rowSpan={reminder.reminderList.length} style={{
                                                                                padding: '0.75rem',
                                                                                textAlign: 'center'
                                                                            }}>
                                                                                <button
                                                                                    className="delete-btn"
                                                                                    style={{
                                                                                        backgroundColor: '#dc3545',
                                                                                        color: 'white',
                                                                                        border: 'none',
                                                                                        borderRadius: '6px',
                                                                                        padding: '0.5rem',
                                                                                        cursor: 'pointer',
                                                                                        fontSize: '0.9rem',
                                                                                        transition: 'background-color 0.2s ease'
                                                                                    }}
                                                                                    onClick={() => handleDeleteReminder(rem.id)}
                                                                                    disabled={isLoading}
                                                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                                                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                                                                                >
                                                                                    <i className="fas fa-trash"></i>
                                                                                </button>
                                                                            </td>
                                                                        </>
                                                                    )}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                        { }
                        {/* For Custom - Show Location → Periods → Reminders */}
                        {activeTab === 'custom' &&
                            groupRemindersByLocationAndPeriod().map((locationGroup, locationIndex) => (

                                <div key={locationGroup.location} className="accordion-item">
                                    <div className="accordion-header">
                                        {console.log(groupRemindersByLocationAndPeriod(groupRemindersByLocationAndPeriod, "groupRemindersByLocationAndPeriodgroupRemindersByLocationAndPeriod"))}
                                        <button
                                            className={`accordion-button ${!openAccordions[locationIndex] ? 'collapsed' : ''}`}
                                            style={{
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '0 1rem',
                                                backgroundColor: openAccordions[locationIndex] ? '#4a90a4' : '#bfd7e0',
                                                color: openAccordions[locationIndex] ? 'white' : '#333',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '8px',
                                                marginBottom: '2px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => toggleLocationAccordion(locationIndex)}
                                        >
                                            <div className="accordion-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span className="location-icon" style={{ fontSize: '1.1rem' }}>📍</span>
                                                <span className="location-name" style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                                    {locationGroup.locationLabel}
                                                </span>
                                                <span className="period-count" style={{
                                                    fontSize: '0.85rem',
                                                    opacity: '0.8',
                                                    backgroundColor: openAccordions[locationIndex] ? 'white' : 'white',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px'
                                                }}>
                                                    ({locationGroup.periods.map(p => p.periodLabel).join(', ')})
                                                </span>
                                            </div>
                                            <span className="accordion-arrow" style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: openAccordions[locationIndex] ? 'white' : 'white'
                                            }}>
                                                {openAccordions[locationIndex] ? '−' : '+'}
                                            </span>
                                        </button>
                                    </div>
                                    {openAccordions[locationIndex] && (
                                        <div className="accordion-content" style={{
                                            padding: '1rem',
                                            backgroundColor: '#fafbfc',
                                            borderRadius: '0 0 8px 8px',
                                            border: '1px solid #dee2e6',
                                            borderTop: 'none'
                                        }}>
                                            <h6 className="periods-title" style={{
                                                marginBottom: '1rem',
                                                color: '#4a90a4',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <i className="fas fa-calendar-alt"></i>
                                                Periods for this Location
                                            </h6>

                                            <div className="periods-accordion">
                                                {locationGroup.periods.map((periodGroup, periodIndex) => {
                                                    const periodKey = `${locationIndex}_${periodIndex}`;
                                                    return (
                                                        <div key={periodGroup.period} className="period-accordion-item" style={{ marginBottom: '0.5rem' }}>
                                                            <div className="period-accordion-header">
                                                                <button
                                                                    className={`period-accordion-button ${!openPeriodAccordions[periodKey] ? 'collapsed' : ''}`}
                                                                    style={{
                                                                        height: '50px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        width: '100%',
                                                                        padding: '0 1rem',
                                                                        backgroundColor: openPeriodAccordions[periodKey] ? '#5a9bd4' : '#bfd7e0',
                                                                        color: openPeriodAccordions[periodKey] ? 'white' : '#333',
                                                                        border: '1px solid #dee2e6',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    onClick={() => togglePeriodAccordion(locationIndex, periodIndex)}
                                                                >
                                                                    <div className="period-accordion-title" style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.75rem',
                                                                        flex: 1
                                                                    }}>
                                                                        <span className="period-icon" style={{ fontSize: '1rem' }}>📊</span>
                                                                        <span className="period-name" style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                                            {periodGroup.periodLabel}
                                                                        </span>
                                                                        {periodGroup.fromDate && periodGroup.toDate && (
                                                                            <span className="date-range" style={{
                                                                                fontSize: '0.8rem',
                                                                                backgroundColor: openPeriodAccordions[periodKey] ? 'white' : 'white',
                                                                                padding: '2px 6px',
                                                                                borderRadius: '8px'
                                                                            }}>
                                                                                {new Date(periodGroup.fromDate).toLocaleDateString()} - {new Date(periodGroup.toDate).toLocaleDateString()}
                                                                            </span>
                                                                        )}

                                                                        <span className="date-range" style={{
                                                                            fontSize: '0.8rem',
                                                                            backgroundColor: openPeriodAccordions[periodKey] ? 'white' : 'white',
                                                                            padding: '2px 6px',
                                                                            borderRadius: '8px'
                                                                        }}>
                                                                            Due Date - {new Date(periodGroup.dueDate).toLocaleDateString()}
                                                                            {periodGroup.dueDateOption === 'applyRule' && ` Rule - ${periodGroup.rule}`}

                                                                        </span>

                                                                        <span className="reminder-count" style={{
                                                                            fontSize: '0.8rem',
                                                                            backgroundColor: openPeriodAccordions[periodKey] ? 'white' : 'white',
                                                                            padding: '2px 6px',
                                                                            borderRadius: '8px'
                                                                        }}>
                                                                            {periodGroup.reminders.length} reminder(s)
                                                                        </span>
                                                                    </div>
                                                                    <span className="period-accordion-arrow" style={{
                                                                        fontSize: '1.1rem',
                                                                        fontWeight: 'bold',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: '22px',
                                                                        height: '22px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: openPeriodAccordions[periodKey] ? 'white' : 'white'
                                                                    }}>
                                                                        {openPeriodAccordions[periodKey] ? '−' : '+'}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            {openPeriodAccordions[periodKey] && (
                                                                <div className="period-accordion-content" style={{
                                                                    padding: '1rem',
                                                                    backgroundColor: 'white',
                                                                    border: '1px solid #dee2e6',
                                                                    borderTop: 'none',
                                                                    borderRadius: '0 0 6px 6px'
                                                                }}>
                                                                    <div className="content-header" style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        marginBottom: '1rem'
                                                                    }}>
                                                                        <h6 className="content-title" style={{
                                                                            margin: 0,
                                                                            color: '#5a9bd4',
                                                                            fontWeight: '600',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.5rem'
                                                                        }}>
                                                                            <i className="fas fa-bell"></i>
                                                                            Reminder Details
                                                                        </h6>
                                                                        <button
                                                                            className="add-reminder-btn"
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '0.5rem',
                                                                                padding: '0.5rem 1rem',
                                                                                backgroundColor: '#4a90a4',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '6px',
                                                                                cursor: 'pointer',
                                                                                fontSize: '0.85rem',
                                                                                fontWeight: '500',
                                                                                transition: 'background-color 0.2s ease'
                                                                            }}
                                                                            onClick={() => openAddReminderModal(locationGroup.location, periodGroup.periodLabel)}
                                                                            onMouseOver={(e) => e.target.style.backgroundColor = '#357a8a'}
                                                                            onMouseOut={(e) => e.target.style.backgroundColor = '#4a90a4'}
                                                                        >
                                                                            <span className="btn-icon">
                                                                                <i className="fas fa-plus"></i>
                                                                            </span>
                                                                            <span className="btn-text">Add Reminder</span>
                                                                        </button>
                                                                    </div>

                                                                    <div className="reminder-table-container" style={{
                                                                        overflowX: 'auto',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #dee2e6'
                                                                    }}>
                                                                        <table className="reminder-table" style={{
                                                                            width: '100%',
                                                                            borderCollapse: 'collapse',
                                                                            backgroundColor: 'white'
                                                                        }}>
                                                                            <thead style={{ backgroundColor: '#bfd7e0' }}>
                                                                                <tr>

                                                                                    <th style={{
                                                                                        padding: '0.75rem',
                                                                                        borderBottom: '2px solid #dee2e6',
                                                                                        color: '#495057',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.85rem'
                                                                                    }}>Days Before</th>
                                                                                    <th style={{
                                                                                        padding: '0.75rem',
                                                                                        borderBottom: '2px solid #dee2e6',
                                                                                        color: '#495057',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.85rem'
                                                                                    }}>Frequency</th>

                                                                                    <th style={{
                                                                                        padding: '0.75rem',
                                                                                        borderBottom: '2px solid #dee2e6',
                                                                                        color: '#495057',
                                                                                        fontWeight: '600',
                                                                                        fontSize: '0.85rem'
                                                                                    }}>Actions</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {periodGroup.reminders.map(reminder =>
                                                                                    reminder.reminderList?.map((rem, remIndex) => (
                                                                                        <tr key={`${reminder.id}_${remIndex}`} style={{
                                                                                            borderBottom: '1px solid #f1f3f4'
                                                                                        }}>



                                                                                            <td style={{
                                                                                                padding: '0.75rem',
                                                                                                borderRight: '1px solid #f1f3f4',
                                                                                                textAlign: 'center'
                                                                                            }}>
                                                                                                <span className="days-badge" style={{
                                                                                                    backgroundColor: '#4a90a4',
                                                                                                    color: 'white',
                                                                                                    padding: '0.25rem 0.5rem',
                                                                                                    borderRadius: '12px',
                                                                                                    fontSize: '0.8rem',
                                                                                                    fontWeight: '500'
                                                                                                }}>
                                                                                                    {rem.days} days
                                                                                                </span>
                                                                                            </td>
                                                                                            <td style={{
                                                                                                padding: '0.75rem',
                                                                                                borderRight: '1px solid #f1f3f4',
                                                                                                textAlign: 'center'
                                                                                            }}>
                                                                                                <span className="frequency-badge" style={{
                                                                                                    backgroundColor: '#5a9bd4',
                                                                                                    color: 'white',
                                                                                                    padding: '0.25rem 0.5rem',
                                                                                                    borderRadius: '12px',
                                                                                                    fontSize: '0.8rem',
                                                                                                    fontWeight: '500'
                                                                                                }}>
                                                                                                    {rem.frequency}
                                                                                                </span>
                                                                                            </td>

                                                                                            <td style={{
                                                                                                padding: '0.75rem',
                                                                                                borderRight: '1px solid #f1f3f4',
                                                                                                textAlign: 'center'
                                                                                            }}>
                                                                                                <button
                                                                                                    className="delete-btn"
                                                                                                    style={{
                                                                                                        backgroundColor: '#dc3545',
                                                                                                        color: 'white',
                                                                                                        border: 'none',
                                                                                                        borderRadius: '6px',
                                                                                                        padding: '0.5rem',
                                                                                                        cursor: 'pointer',
                                                                                                        fontSize: '0.9rem',
                                                                                                        transition: 'background-color 0.2s ease'
                                                                                                    }}
                                                                                                    onClick={() => handleDeleteReminder(rem.id, periodGroup.tablePKId)}
                                                                                                    disabled={isLoading}
                                                                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                                                                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                                                                                                >
                                                                                                    <i className="fas fa-trash"></i>
                                                                                                </button>
                                                                                            </td>

                                                                                        </tr>
                                                                                    ))
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Global Reminder Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            {/* Enhanced Header */}
                            <div className="modal-header position-relative"
                                style={{
                                    background: 'linear-gradient(135deg, #4a90a4 0%, #357a8a 100%)',
                                    borderBottom: 'none',
                                    padding: '1.5rem 2rem'
                                }}>
                                <div className="d-flex align-items-center gap-3 text-white">
                                    <div className="p-2 rounded-circle" style={{ backgroundColor: '#357a8a' }}>
                                        <i className="fas fa-calendar-alt fs-4"></i>
                                    </div>
                                    <div>
                                        <h4 className="modal-title mb-1 fw-bold">Set Due Date & Reminders</h4>
                                        <small className="opacity-75">
                                            {activeTab === 'oneTime' ? 'One Time Configuration' :
                                                activeTab === 'everyYear' ? 'Annual Financial Year Setup' : 'Custom Period Configuration'}
                                        </small>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white position-absolute"
                                    style={{ top: '1.5rem', right: '1.5rem' }}
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body p-0">
                                {/* Selection Section */}
                                <div className="p-4" style={{ backgroundColor: '#f8fafc' }}>
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <div className="card border-0 h-100 shadow-sm">
                                                <div className="card-body">

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
                                            </div>
                                        </div>

                                        {activeTab === 'custom' && (
                                            <div className="col-lg-6">
                                                <div className="card border-0 h-100 shadow-sm">
                                                    <div className="card-body">

                                                        <MultiSelect
                                                            options={periodOptions}
                                                            selectedValues={selectedPeriods}
                                                            onChange={setSelectedPeriods}
                                                            placeholder="Choose time periods..."
                                                            label="Time Period"
                                                            icon="📊"
                                                            activeTab={activeTab}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Enhanced Selected Items Display */}
                                    {showModal && (
                                        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
                                            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                                    {/* Enhanced Header */}
                                                    <div className="modal-header position-relative"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #4a90a4 0%, #357a8a 100%)',
                                                            borderBottom: 'none',
                                                            padding: '1.5rem 2rem'
                                                        }}>
                                                        <div className="d-flex align-items-center gap-3 text-white">
                                                            <div className="p-2 rounded-circle" style={{ backgroundColor: '#357a8a' }}>
                                                                <i className="fas fa-calendar-alt fs-4"></i>
                                                            </div>
                                                            <div>
                                                                <h4 className="modal-title mb-1 fw-bold">Set Due Date & Reminders</h4>
                                                                <small className="opacity-75">
                                                                    {activeTab === 'oneTime' ? 'One Time Configuration' :
                                                                        activeTab === 'everyYear' ? 'Annual Financial Year Setup' : 'Custom Period Configuration'}
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn-close btn-close-white position-absolute"
                                                            style={{ top: '1.5rem', right: '1.5rem' }}
                                                            onClick={() => setShowModal(false)}
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>

                                                    <div className="modal-body p-0">
                                                        {/* Selection Section */}
                                                        <div className="p-4" style={{ backgroundColor: '#f8fafc' }}>
                                                            <div className="row g-4">
                                                                <div className="col-lg-6">
                                                                    <div className="h-100 p-4 shadow-sm" style={{
                                                                        backgroundColor: 'white',
                                                                        borderRadius: '12px',
                                                                        border: '1px solid #e9ecef'
                                                                    }}>

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
                                                                </div>

                                                                {activeTab === 'custom' && (
                                                                    <div className="col-lg-6">
                                                                        <div className="h-100 p-4 shadow-sm" style={{
                                                                            backgroundColor: 'white',
                                                                            borderRadius: '12px',
                                                                            border: '1px solid #e9ecef'
                                                                        }}>

                                                                            <MultiSelect
                                                                                options={periodOptions}
                                                                                selectedValues={selectedPeriods}
                                                                                onChange={setSelectedPeriods}
                                                                                placeholder="Choose time periods..."
                                                                                label="Time Period"
                                                                                icon="📊"
                                                                                activeTab={activeTab}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Enhanced Selected Items Display */}
                                                            {(selectedLocations.length > 0 || selectedPeriods.length > 0) && (
                                                                <div className="mt-4">
                                                                    <div className="p-4 shadow-sm" style={{
                                                                        backgroundColor: 'white',
                                                                        borderRadius: '12px',
                                                                        border: '1px solid #e9ecef'
                                                                    }}>
                                                                        <h6 className="mb-3 d-flex align-items-center gap-2">
                                                                            <i className="fas fa-check-circle" style={{ color: '#4a90a4' }}></i>
                                                                            Selected Items
                                                                        </h6>

                                                                        {selectedLocations.length > 0 && (
                                                                            <div className="mb-3">
                                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                                    <i className="fas fa-map-marker-alt" style={{ color: '#4a90a4' }}></i>
                                                                                    <span className="fw-semibold">Locations</span>
                                                                                    <span className="px-2 py-1 rounded-pill text-white" style={{ backgroundColor: '#4a90a4', fontSize: '0.75rem' }}>
                                                                                        {selectedLocations.length}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="d-flex flex-wrap gap-2">
                                                                                    {selectedLocations.slice(0, 8).map(locationId => (
                                                                                        <span
                                                                                            key={locationId}
                                                                                            className="d-flex align-items-center gap-1 px-3 py-2"
                                                                                            style={{
                                                                                                backgroundColor: 'rgba(74, 144, 164, 0.1)',
                                                                                                color: '#357a8a',
                                                                                                border: '1px solid rgba(74, 144, 164, 0.3)',
                                                                                                borderRadius: '12px',
                                                                                                fontSize: '0.85rem'
                                                                                            }}
                                                                                        >
                                                                                            {getLocationLabel(locationId)}
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn p-0 ms-1"
                                                                                                style={{
                                                                                                    fontSize: '0.7rem',
                                                                                                    color: '#357a8a',
                                                                                                    background: 'none',
                                                                                                    border: 'none'
                                                                                                }}
                                                                                                onClick={() =>
                                                                                                    setSelectedLocations(prev =>
                                                                                                        prev.filter(id => id !== locationId)
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <i className="fas fa-times"></i>
                                                                                            </button>
                                                                                        </span>
                                                                                    ))}
                                                                                    {selectedLocations.length > 8 && (
                                                                                        <span
                                                                                            className="px-3 py-2"
                                                                                            style={{
                                                                                                backgroundColor: '#bfd7e0',
                                                                                                color: '#6c757d',
                                                                                                borderRadius: '12px',
                                                                                                fontSize: '0.85rem',
                                                                                                border: '1px solid #dee2e6'
                                                                                            }}
                                                                                        >
                                                                                            +{selectedLocations.length - 8} more
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {activeTab === 'custom' && selectedPeriods.length > 0 && (
                                                                            <div>
                                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                                    <i className="fas fa-chart-bar" style={{ color: '#5a9bd4' }}></i>
                                                                                    <span className="fw-semibold">Time Periods</span>
                                                                                    <span className="px-2 py-1 rounded-pill text-white" style={{ backgroundColor: '#5a9bd4', fontSize: '0.75rem' }}>
                                                                                        {selectedPeriods.length}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="d-flex flex-wrap gap-2">
                                                                                    {selectedPeriods.slice(0, 8).map(periodId => (
                                                                                        <span
                                                                                            key={periodId}
                                                                                            className="d-flex align-items-center gap-1 px-3 py-2"
                                                                                            style={{
                                                                                                backgroundColor: 'rgba(90, 155, 212, 0.1)',
                                                                                                color: '#357a8a',
                                                                                                border: '1px solid rgba(90, 155, 212, 0.3)',
                                                                                                borderRadius: '12px',
                                                                                                fontSize: '0.85rem'
                                                                                            }}
                                                                                        >
                                                                                            {getPeriodLabel(periodId)}
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn p-0 ms-1"
                                                                                                style={{
                                                                                                    fontSize: '0.7rem',
                                                                                                    color: '#357a8a',
                                                                                                    background: 'none',
                                                                                                    border: 'none'
                                                                                                }}
                                                                                                onClick={() =>
                                                                                                    setSelectedPeriods(prev =>
                                                                                                        prev.filter(id => id !== periodId)
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <i className="fas fa-times"></i>
                                                                                            </button>
                                                                                        </span>
                                                                                    ))}
                                                                                    {selectedPeriods.length > 8 && (
                                                                                        <span
                                                                                            className="px-3 py-2"
                                                                                            style={{
                                                                                                backgroundColor: '#bfd7e0',
                                                                                                color: '#6c757d',
                                                                                                borderRadius: '12px',
                                                                                                fontSize: '0.85rem',
                                                                                                border: '1px solid #dee2e6'
                                                                                            }}
                                                                                        >
                                                                                            +{selectedPeriods.length - 8} more
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Due Date Configuration */}
                                                        <div className="p-4 border-top">
                                                            <div className="p-4 shadow-sm" style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: '12px',
                                                                border: '1px solid #e9ecef'
                                                            }}>
                                                                <div className="pb-0 mb-3">
                                                                    <h5 className="mb-0 d-flex align-items-center gap-2">
                                                                        <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(74, 144, 164, 0.15)' }}>
                                                                            <i className="fas fa-calendar-check" style={{ color: '#4a90a4' }}></i>
                                                                        </div>
                                                                        Submission Window Configuration
                                                                    </h5>
                                                                </div>
                                                                <div className="pt-3">
                                                                    <div className="row g-3">
                                                                        <div className="col-md-6">
                                                                            <label className="form-label fw-semibold">Submission Window Type</label>
                                                                            <select
                                                                                className="form-select form-select-lg"
                                                                                style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                                                                                value={modalForm.dueDateOption}
                                                                                onChange={(e) => setModalForm(prev => ({
                                                                                    ...prev,
                                                                                    dueDateOption: e.target.value,
                                                                                    dueDate: '',
                                                                                    applyRule: '',
                                                                                    ruleDays: ''
                                                                                }))}
                                                                            >
                                                                                <option value="">Choose type...</option>
                                                                                <option value="applyRule">📊 Relative</option>
                                                                                <option value="selectDate">📅 Fixed</option>
                                                                            </select>
                                                                        </div>

                                                                        {modalForm.dueDateOption === 'applyRule' && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label fw-semibold">Days</label>
                                                                                <div className="input-group input-group-lg">
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control"
                                                                                        placeholder="30"
                                                                                        style={{ borderRadius: '8px 0 0 8px', border: '2px solid #e9ecef' }}
                                                                                        value={modalForm.ruleDays}
                                                                                        onChange={(e) =>
                                                                                            setModalForm((prev) => ({
                                                                                                ...prev,
                                                                                                ruleDays: e.target.value
                                                                                            }))
                                                                                        }
                                                                                    />
                                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="applyRule"
                                                                                                value="before"
                                                                                                checked={modalForm.applyRule === 'before'}
                                                                                                onChange={() =>
                                                                                                    setModalForm((prev) => ({ ...prev, applyRule: 'before' }))
                                                                                                }
                                                                                                style={{ marginRight: '4px' }}
                                                                                            />
                                                                                            📉 Days Before Window Ends
                                                                                        </label>

                                                                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="applyRule"
                                                                                                value="after"
                                                                                                checked={modalForm.applyRule === 'after'}
                                                                                                onChange={() =>
                                                                                                    setModalForm((prev) => ({ ...prev, applyRule: 'after' }))
                                                                                                }
                                                                                                style={{ marginRight: '4px' }}
                                                                                            />
                                                                                            📈 Days After Window Ends
                                                                                        </label>
                                                                                    </div>



                                                                                </div>
                                                                            </div>
                                                                        )}


                                                                        {modalForm.dueDateOption === 'selectDate' && (
                                                                            <div className="col-md-6">
                                                                                <label className="form-label fw-semibold">Select Date</label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control form-control-lg"
                                                                                    style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                                                                                    value={modalForm.dueDate}
                                                                                    onChange={(e) => setModalForm(prev => ({
                                                                                        ...prev,
                                                                                        dueDate: e.target.value
                                                                                    }))}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Reminder Settings */}
                                                        <div className="p-4 border-top" style={{ backgroundColor: '#fafbfc' }}>
                                                            <div className="p-4 shadow-sm" style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: '12px',
                                                                border: '1px solid #e9ecef'
                                                            }}>
                                                                <div className="pb-0 mb-3">
                                                                    <h5 className="mb-0 d-flex align-items-center gap-2">
                                                                        <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(90, 155, 212, 0.15)' }}>
                                                                            <i className="fas fa-bell" style={{ color: '#5a9bd4' }}></i>
                                                                        </div>
                                                                        Reminder Settings
                                                                    </h5>
                                                                </div>
                                                                <div className="pt-3">
                                                                    {/* Add Reminder Form */}
                                                                    <div className="p-4 mb-4 border-2 border-dashed" style={{ borderColor: '#4a90a4', borderRadius: '12px' }}>
                                                                        <div className="row g-3 align-items-end">
                                                                            <div className="col-md-4">
                                                                                <label className="form-label fw-semibold">Days Before Due Date</label>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-lg"
                                                                                    placeholder="e.g., 7"
                                                                                    style={{ borderRadius: '8px' }}
                                                                                    value={modalForm.reminderDays}
                                                                                    onChange={(e) => setModalForm(prev => ({
                                                                                        ...prev,
                                                                                        reminderDays: e.target.value
                                                                                    }))}
                                                                                />
                                                                            </div>
                                                                            <div className="col-md-5">
                                                                                <label className="form-label fw-semibold">Recurring Frequency</label>
                                                                                <select
                                                                                    className="form-select form-select-lg"
                                                                                    style={{ borderRadius: '8px' }}
                                                                                    value={modalForm.recurring}
                                                                                    onChange={(e) => setModalForm(prev => ({
                                                                                        ...prev,
                                                                                        recurring: e.target.value
                                                                                    }))}
                                                                                >
                                                                                    <option value="">Choose frequency...</option>
                                                                                    <option value="once">🎯 Once Only</option>
                                                                                    <option value="hourly">⏱️ Hourly</option>
                                                                                    <option value="daily">📅 Daily</option>
                                                                                    <option value="weekly">📆 Weekly</option>

                                                                                </select>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <button
                                                                                    className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                                                                                    style={{
                                                                                        borderRadius: '8px',
                                                                                        backgroundColor: '#4a90a4',
                                                                                        borderColor: '#4a90a4',
                                                                                        color: 'white'
                                                                                    }}
                                                                                    onClick={addReminder}
                                                                                    disabled={!modalForm.reminderDays || !modalForm.recurring}
                                                                                >
                                                                                    <i className="fas fa-plus"></i>
                                                                                    Add Reminder
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Added Reminders List */}
                                                                    {modalForm.reminderList && modalForm.reminderList.length > 0 && (
                                                                        <div>
                                                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                                                <i className="fas fa-list-ul" style={{ color: '#4a90a4' }}></i>
                                                                                <h6 className="mb-0 fw-semibold">Active Reminders</h6>
                                                                                <span className="px-2 py-1 rounded-pill text-white" style={{ backgroundColor: '#4a90a4', fontSize: '0.75rem' }}>
                                                                                    {modalForm.reminderList.length}
                                                                                </span>
                                                                            </div>
                                                                            <div className="row g-3">
                                                                                {modalForm.reminderList.map((reminder, index) => (
                                                                                    <div key={index} className="col-md-6 col-lg-4">
                                                                                        <div className="h-100 p-3 shadow-sm" style={{
                                                                                            borderRadius: '12px',
                                                                                            backgroundColor: 'white',
                                                                                            border: '1px solid #e9ecef'
                                                                                        }}>
                                                                                            <div className="d-flex align-items-center justify-content-between">
                                                                                                <div className="d-flex align-items-center gap-2">
                                                                                                    <div className="p-2 rounded-circle bg-light">
                                                                                                        <i className="fas fa-bell" style={{ color: '#4a90a4' }}></i>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <div className="fw-semibold">{reminder.days} days before</div>
                                                                                                        <small className="text-muted">{reminder.frequency}</small>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                                                                    style={{ width: '32px', height: '32px' }}
                                                                                                    onClick={() => removeReminder(index)}
                                                                                                    aria-label="Remove reminder"
                                                                                                >
                                                                                                    <i className="fas fa-trash" style={{ fontSize: '0.75rem' }}></i>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Enhanced Footer */}
                                                    <div className="modal-footer border-0 p-4" style={{ backgroundColor: '#f8fafc' }}>
                                                        <div className="w-100 d-flex justify-content-end gap-3">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-lg px-4"
                                                                style={{ borderRadius: '8px' }}
                                                                onClick={() => setShowModal(false)}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-lg px-4"
                                                                style={{
                                                                    borderRadius: '8px',
                                                                    backgroundColor: '#4a90a4',
                                                                    borderColor: '#4a90a4',
                                                                    color: 'white'
                                                                }}
                                                                onClick={handleModalSubmit}
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                        <span>Saving...</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-save me-2"></i>
                                                                        Save Reminder
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Due Date Configuration */}
                                <div className="p-4 border-top">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white border-0 pb-0">
                                            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                                <div className="p-2 rounded-circle" style={{ backgroundColor: '#e8f5e8' }}>
                                                    <i className="fas fa-calendar-check text-success"></i>
                                                </div>
                                                Due Date Configuration
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Due Date Type</label>
                                                    <select
                                                        className="form-select form-select-lg"
                                                        style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                                                        value={modalForm.dueDateOption}
                                                        onChange={(e) => setModalForm(prev => ({
                                                            ...prev,
                                                            dueDateOption: e.target.value,
                                                            dueDate: '',
                                                            applyRule: '',
                                                            ruleDays: ''
                                                        }))}
                                                    >
                                                        <option value="">Choose type...</option>
                                                        <option value="applyRule">📊 Relative to Period</option>
                                                        <option value="selectDate">📅 Fixed Date</option>
                                                    </select>
                                                </div>

                                                {modalForm.dueDateOption === 'applyRule' && (
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold">Rule Configuration</label>
                                                        <div className="input-group input-group-lg">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="30"
                                                                style={{ borderRadius: '8px 0 0 8px', border: '2px solid #e9ecef' }}
                                                                value={modalForm.ruleDays}
                                                                onChange={(e) => setModalForm(prev => ({
                                                                    ...prev,
                                                                    ruleDays: e.target.value
                                                                }))}
                                                            />
                                                            <select
                                                                className="form-select"
                                                                style={{ borderRadius: '0 8px 8px 0', border: '2px solid #e9ecef', borderLeft: 'none' }}
                                                                value={modalForm.applyRule}
                                                                onChange={(e) => setModalForm(prev => ({
                                                                    ...prev,
                                                                    applyRule: e.target.value
                                                                }))}
                                                            >
                                                                <option value="">Select timing...</option>
                                                                <option value="after">📈 days after period ends</option>
                                                                <option value="before">📉 days before period ends</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}

                                                {modalForm.dueDateOption === 'selectDate' && (
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold">Select Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control form-control-lg"
                                                            style={{ borderRadius: '8px', border: '2px solid #e9ecef' }}
                                                            value={modalForm.dueDate}
                                                            onChange={(e) => setModalForm(prev => ({
                                                                ...prev,
                                                                dueDate: e.target.value
                                                            }))}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reminder Settings */}
                                <div className="p-4 border-top" style={{ backgroundColor: '#fafbfc' }}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white border-0 pb-0">
                                            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                                                <div className="p-2 rounded-circle" style={{ backgroundColor: '#fff3e0' }}>
                                                    <i className="fas fa-bell text-warning"></i>
                                                </div>
                                                Reminder Settings
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            {/* Add Reminder Form */}
                                            <div className="card border-2 border-dashed border-primary mb-4" style={{ borderRadius: '12px' }}>
                                                <div className="card-body">
                                                    <div className="row g-3 align-items-end">
                                                        <div className="col-md-4">
                                                            <label className="form-label fw-semibold">Days Before Due Date</label>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-lg"
                                                                placeholder="e.g., 7"
                                                                style={{ borderRadius: '8px' }}
                                                                value={modalForm.reminderDays}
                                                                onChange={(e) => setModalForm(prev => ({
                                                                    ...prev,
                                                                    reminderDays: e.target.value
                                                                }))}
                                                            />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <label className="form-label fw-semibold">Recurring Frequency</label>
                                                            <select
                                                                className="form-select form-select-lg"
                                                                style={{ borderRadius: '8px' }}
                                                                value={modalForm.recurring}
                                                                onChange={(e) => setModalForm(prev => ({
                                                                    ...prev,
                                                                    recurring: e.target.value
                                                                }))}
                                                            >
                                                                <option value="">Choose frequency...</option>
                                                                <option value="once">🎯 Once Only</option>
                                                                <option value="daily">📅 Daily</option>
                                                                <option value="weekly">📆 Weekly</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <button
                                                                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                                                                style={{ borderRadius: '8px' }}
                                                                onClick={addReminder}
                                                                disabled={!modalForm.reminderDays || !modalForm.recurring}
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                                Add Reminder
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Added Reminders List */}
                                            {modalForm.reminderList && modalForm.reminderList.length > 0 && (
                                                <div>
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <i className="fas fa-list-ul text-success"></i>
                                                        <h6 className="mb-0 fw-semibold">Active Reminders</h6>
                                                        <span className="badge bg-success rounded-pill">{modalForm.reminderList.length}</span>
                                                    </div>
                                                    <div className="row g-3">
                                                        {modalForm.reminderList.map((reminder, index) => (
                                                            <div key={index} className="col-md-6 col-lg-4">
                                                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                                                                    <div className="card-body p-3">
                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <div className="p-2 rounded-circle bg-light">
                                                                                    <i className="fas fa-bell text-primary"></i>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="fw-semibold">{reminder.days} days before</div>
                                                                                    <small className="text-muted">{reminder.frequency}</small>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-outline-danger btn-sm rounded-circle"
                                                                                style={{ width: '32px', height: '32px' }}
                                                                                onClick={() => removeReminder(index)}
                                                                                aria-label="Remove reminder"
                                                                            >
                                                                                <i className="fas fa-trash" style={{ fontSize: '0.75rem' }}></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Footer */}
                            <div className="modal-footer border-0 p-4" style={{ backgroundColor: '#f8fafc' }}>
                                <div className="w-100 d-flex justify-content-end gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-lg px-4"
                                        style={{ borderRadius: '8px' }}
                                        onClick={() => setShowModal(false)}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg px-4"
                                        style={{ borderRadius: '8px' }}
                                        onClick={handleModalSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span>Saving...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Save Reminder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Single Reminder Modal */}
            {showAddReminderModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <span>➕</span>
                                    <span>Add Reminder</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddReminderModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Location:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={getLocationLabel(addReminderData.locationId)}
                                        disabled
                                        style={{ backgroundColor: '#bfd7e0' }}
                                    />
                                </div>

                                {activeTab === 'custom' && addReminderData.periodId && (
                                    <div className="mb-3">
                                        <label className="form-label">Period:</label>
                                        <div className="card bg-light">
                                            <div className="card-body py-2">
                                                <div className="d-flex flex-column">
                                                    <span className="fw-bold">{addReminderData.period}</span>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Days Before Due Date:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g., 7"
                                        value={addReminderData.reminderDays}
                                        onChange={(e) => setAddReminderData(prev => ({
                                            ...prev,
                                            reminderDays: e.target.value
                                        }))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Frequency:</label>
                                    <select
                                        className="form-select"
                                        value={addReminderData.recurring}
                                        onChange={(e) => setAddReminderData(prev => ({
                                            ...prev,
                                            recurring: e.target.value
                                        }))}
                                    >
                                        <option value="">Select Frequency</option>
                                        <option value="once">Once Only</option>
                                        <option value="hourly">⏱️ Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddReminderModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleAddSingleReminder} disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : (
                                        'Add Reminder'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailReminder;