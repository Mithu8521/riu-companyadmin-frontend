import { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import {
  FinancialYearField,
  LocationField,
  PeriodField,
  createSearchableSelectProps
} from "../../common/FormComponents";
import SearchableSelect from "../../utils/SearchableSelect";

const EmailReminder = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [financialYearData, setFinancialYearData] = useState([]);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
    const [activeTab, setActiveTab] = useState("oneTime");
    const [showModal, setShowModal] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const [periodData, setPeriodData] = useState([]);
    const [reminderList, setReminderList] = useState([]);
    
    // Modal form state
    const [modalForm, setModalForm] = useState({
        locations: [],
        periods: [],
        firstReminderDays: "",
        secondReminderDays: "",
        thirdLockDays: ""
    });

    const getFinancialYearData = async () => {
        try {
            setIsLoading(true);
            const storedData = localStorage.getItem("financialYearData");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setFinancialYearData(parsedData);
            } else {
                const { isSuccess, data } = await apiCall(
                    `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
                    {},
                    {}
                );

                if (isSuccess && data && data.data) {
                    localStorage.setItem("financialYearData", JSON.stringify(data.data));
                    setFinancialYearData(data.data);
                } else {
                    console.error("API call succeeded but no data received");
                    setFinancialYearData([]);
                }
            }
        } catch (error) {
            console.error("Error fetching financial year data:", error);
            setFinancialYearData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Mock data for locations and periods - replace with actual API calls
    const getLocationData = async () => {
        // Replace with actual API call
        const mockLocations = [
            { value: "1", label: "New York Office" },
            { value: "2", label: "London Office" },
            { value: "3", label: "Tokyo Office" },
            { value: "4", label: "Mumbai Office" }
        ];
        setLocationData(mockLocations);
    };

    const getPeriodData = async () => {
        // Replace with actual API call
        const mockPeriods = [
            { value: "Q1", label: "Quarter 1" },
            { value: "Q2", label: "Quarter 2" },
            { value: "Q3", label: "Quarter 3" },
            { value: "Q4", label: "Quarter 4" }
        ];
        setPeriodData(mockPeriods);
    };

    useEffect(() => {
        const loadData = async () => {
            await getFinancialYearData();
            await getLocationData();
            await getPeriodData();
        };
        loadData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleModalSubmit = () => {
        if (!modalForm.locations.length || !modalForm.periods.length || 
            !modalForm.firstReminderDays || !modalForm.secondReminderDays || !modalForm.thirdLockDays) {
            alert("Please fill all required fields");
            return;
        }

        // Create reminder entries for each location-period combination
        const newReminders = [];
        modalForm.locations.forEach(location => {
            modalForm.periods.forEach(period => {
                newReminders.push({
                    id: Date.now() + Math.random(),
                    type: activeTab,
                    financialYear: selectedFinancialYear,
                    location: location,
                    period: period,
                    firstReminderDays: modalForm.firstReminderDays,
                    secondReminderDays: modalForm.secondReminderDays,
                    thirdLockDays: modalForm.thirdLockDays,
                    isActive: true
                });
            });
        });

        setReminderList(prev => [...prev, ...newReminders]);
        setShowModal(false);
        setModalForm({
            locations: [],
            periods: [],
            firstReminderDays: "",
            secondReminderDays: "",
            thirdLockDays: ""
        });
    };

    const handleEditReminder = (id, field, value) => {
        setReminderList(prev => 
            prev.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleDeleteReminder = (id) => {
        setReminderList(prev => prev.filter(item => item.id !== id));
    };

    const handleToggleActive = (id) => {
        setReminderList(prev => 
            prev.map(item => 
                item.id === id ? { ...item, isActive: !item.isActive } : item
            )
        );
    };

    const getLocationLabel = (locationValue) => {
        const location = locationData.find(loc => loc.value === locationValue);
        return location ? location.label : locationValue;
    };

    const getPeriodLabel = (periodValue) => {
        const period = periodData.find(per => per.value === periodValue);
        return period ? period.label : periodValue;
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="Introduction framwork_2 shadow-lg"
            style={{
                width: "100%",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                padding: "2.5rem",
                border: "1px solid #e3f2fd",
            }}
        >
            <h3 className="mb-4 text-primary">Email Reminder Setup</h3>
            
            {/* Financial Year Selection */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Financial Year</label>
                    <select 
                        className="form-select"
                        value={selectedFinancialYear}
                        onChange={(e) => setSelectedFinancialYear(e.target.value)}
                    >
                        <option value="">Select Financial Year</option>
                        {financialYearData.map(year => (
                            <option key={year.id || year.value} value={year.id || year.value}>
                                {year.label || year.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedFinancialYear && (
                <>
                    {/* Tab Navigation */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <ul className="nav nav-tabs nav-justified">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'oneTime' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('oneTime')}
                                    >
                                        One Time
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'everyYear' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('everyYear')}
                                    >
                                        Every Year
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('custom')}
                                    >
                                        Custom
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {(activeTab === 'oneTime' || activeTab === 'everyYear') && (
                            <div className="row mb-4">
                                <div className="col-12 text-center">
                                    <button 
                                        className="btn btn-primary btn-lg"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Set Global Reminder
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'custom' && (
                            <div className="alert alert-info">
                                <h5>Custom Reminder Setup</h5>
                                <p>Custom reminder functionality will be implemented here.</p>
                            </div>
                        )}
                    </div>

                    {/* Reminder List */}
                    {reminderList.length > 0 && (
                        <div className="row">
                            <div className="col-12">
                                <h5 className="mb-3">Configured Reminders</h5>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Type</th>
                                                <th>Location</th>
                                                <th>Period</th>
                                                <th>1st Reminder (Days)</th>
                                                <th>2nd Reminder (Days)</th>
                                                <th>Lock Days</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reminderList.map(reminder => (
                                                <tr key={reminder.id}>
                                                    <td>
                                                        <span className={`badge ${reminder.type === 'oneTime' ? 'bg-info' : 'bg-success'}`}>
                                                            {reminder.type === 'oneTime' ? 'One Time' : 'Every Year'}
                                                        </span>
                                                    </td>
                                                    <td>{getLocationLabel(reminder.location)}</td>
                                                    <td>{getPeriodLabel(reminder.period)}</td>
                                                    <td>
                                                        <input 
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={reminder.firstReminderDays}
                                                            onChange={(e) => handleEditReminder(reminder.id, 'firstReminderDays', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input 
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={reminder.secondReminderDays}
                                                            onChange={(e) => handleEditReminder(reminder.id, 'secondReminderDays', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input 
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={reminder.thirdLockDays}
                                                            onChange={(e) => handleEditReminder(reminder.id, 'thirdLockDays', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input 
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={reminder.isActive}
                                                                onChange={() => handleToggleActive(reminder.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteReminder(reminder.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Set Global Reminder</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Locations *</label>
                                        <select 
                                            multiple
                                            className="form-select"
                                            size="4"
                                            value={modalForm.locations}
                                            onChange={(e) => {
                                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                                setModalForm(prev => ({ ...prev, locations: selectedOptions }));
                                            }}
                                        >
                                            {locationData.map(location => (
                                                <option key={location.value} value={location.value}>
                                                    {location.label}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Periods *</label>
                                        <select 
                                            multiple
                                            className="form-select"
                                            size="4"
                                            value={modalForm.periods}
                                            onChange={(e) => {
                                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                                setModalForm(prev => ({ ...prev, periods: selectedOptions }));
                                            }}
                                        >
                                            {periodData.map(period => (
                                                <option key={period.value} value={period.value}>
                                                    {period.label}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">First Reminder Days *</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g., 30"
                                            value={modalForm.firstReminderDays}
                                            onChange={(e) => setModalForm(prev => ({ ...prev, firstReminderDays: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Second Reminder Days *</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g., 15"
                                            value={modalForm.secondReminderDays}
                                            onChange={(e) => setModalForm(prev => ({ ...prev, secondReminderDays: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Third Lock Days *</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g., 7"
                                            value={modalForm.thirdLockDays}
                                            onChange={(e) => setModalForm(prev => ({ ...prev, thirdLockDays: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleModalSubmit}
                                >
                                    Save Reminder
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