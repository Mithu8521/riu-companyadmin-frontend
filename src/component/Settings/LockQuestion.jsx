import { useEffect, useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { FinancialYearField } from "../CarbonFootPrinting/common/FormComponents";
import { generateTimePeriodOptions, getStartingMonth } from "../CarbonFootPrinting/utils/PeriodCalculationUtils";
import { fetchFrequency, getFinancialYear } from "../Training/training-dashboard/services/trainingService";
import "./EmailReminder.css";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";

const LockQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [dataLoading, setDataLoading] = useState({});
    const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
    const [financialYearOptions, setFinancialYearOptions] = useState([]);
    const [financialYear, setFinancialYear] = useState([]);
    const [financialYearId, setFinancialYearId] = useState(null);

    const [timePeriodOptions, setTimePeriodOptions] = useState([]);
    const [frequency, setFrequency] = useState('MONTHLY');

    const [lockedPeriods, setLockedPeriods] = useState(new Set());
    const [periodLockData, setPeriodLockData] = useState([]);
    const [selectedPeriods, setSelectedPeriods] = useState(new Set());

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [selectedUsersForLock, setSelectedUsersForLock] = useState([]);
    const [selectedUsersForUnlock, setSelectedUsersForUnlock] = useState([]);
    const [currentLockingPeriod, setCurrentLockingPeriod] = useState(null);
    const [currentViewingPeriod, setCurrentViewingPeriod] = useState(null);
    const [currentUnlockingPeriod, setCurrentUnlockingPeriod] = useState(null);
    const [currectFromDateToDate, setCurrectFromDateToDate] = useState(null);

    const [modalType, setModalType] = useState(''); // 'lock', 'unlock', 'view'

    // Search states for different modals
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [unlockSearchQuery, setUnlockSearchQuery] = useState('');
    const [allowedUsersSearchQuery, setAllowedUsersSearchQuery] = useState('');
    const [unallowedUsersSearchQuery, setUnallowedUsersSearchQuery] = useState('');

    const getFinancialYearById = (id) => {
        const result = financialYear.find(item => item.id === id);
        return result ? result.financial_year_value : null;
    };

    const calculateDateRange = (type, period, startingMonth, year) => {
        const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
        const startYear =
            year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
        const endMonth = ((startMonth - 1 + type) % 12) + 1;
        const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

        const formatDate = (month, year) =>
            `${year}-${month < 10 ? `0${month}` : month}`;

        return {
            period: Number(period),
            fromDate: formatDate(startMonth, startYear),
            toDate: formatDate(endMonth, endYear),
        };
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}getSubUser`,
                {},
                {},
                "GET"
            );
            if (isSuccess) {
                setUsers(data?.data?.reverse() || []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setUsersLoading(false);
        }
    };

    const openLockModal = (obj) => {
        setCurrentLockingPeriod(obj);
        setCurrectFromDateToDate(obj)
        setSelectedUsersForLock([]);
        setUserSearchQuery(''); // Reset search
        setModalType('lock');
        setShowUserModal(true);
    };

    const openUnlockModal = (obj) => {
        setCurrentUnlockingPeriod(obj);
        setCurrectFromDateToDate(obj)
        setSelectedUsersForUnlock([]);
        setUnlockSearchQuery(''); // Reset search
        setModalType('unlock');
        setShowUnlockModal(true);
    };

    const openViewModal = (obj) => {
        setCurrentViewingPeriod(obj);
        setAllowedUsersSearchQuery(''); // Reset search
        setUnallowedUsersSearchQuery(''); // Reset search
        setModalType('view');
        setShowViewModal(true);
    };

    const handleUserSelect = (userId, isSelected, type = 'lock') => {
        if (type === 'lock') {
            setSelectedUsersForLock(prev =>
                isSelected
                    ? [...prev, userId]
                    : prev.filter(id => id !== userId)
            );
        } else if (type === 'unlock') {
            setSelectedUsersForUnlock(prev =>
                isSelected
                    ? [...prev, userId]
                    : prev.filter(id => id !== userId)
            );
        }
    };

    const handleSelectAllUsers = (type = 'lock') => {
        if (type === 'lock') {
            const filteredUsers = users.filter(user => {
                if (!userSearchQuery) return true;
                const query = userSearchQuery.toLowerCase();
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                return fullName.includes(query) || email.includes(query);
            });
            setSelectedUsersForLock(filteredUsers.map(user => user.userId));
        } else if (type === 'unlock') {
            const filteredUsers = getAllowedUsersForPeriod(currentUnlockingPeriod).filter(user => {
                if (!unlockSearchQuery) return true;
                const query = unlockSearchQuery.toLowerCase();
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                return fullName.includes(query) || email.includes(query);
            });
            setSelectedUsersForUnlock(filteredUsers.map(user => user.userId));
        }
    };

    const handleDeselectAllUsers = (type = 'lock') => {
        if (type === 'lock') {
            setSelectedUsersForLock([]);
        } else if (type === 'unlock') {
            setSelectedUsersForUnlock([]);
        }
    };

    const generateAllPeriodsData = () => {
        if (!financialYearId || !timePeriodOptions.length) return [];

        const selectedYear = getFinancialYearById(financialYearId);
        if (!selectedYear) return [];

        const year = parseInt(selectedYear.split("-")[0]);
        const start = getStartingMonth();

        return timePeriodOptions.map(period => {
            let dateRange;

            if (frequency === "HALF_YEARLY") {
                dateRange = calculateDateRange(6, period.value, start, year);
            } else if (frequency === "QUARTERLY") {
                dateRange = calculateDateRange(3, period.value, start, year);
            } else if (frequency === "MONTHLY") {
                dateRange = calculateDateRange(1, period.value, start, year);
            } else if (frequency === "YEARLY") {
                dateRange = calculateDateRange(12, 1, start, year);
            }

            return {
                periodValue: period.value,
                periodLabel: period.label,
                fromDate: dateRange?.fromDate,
                toDate: dateRange?.toDate,
                isLocked: lockedPeriods.has(period.value)
            };
        });
    };

    const handleLockPeriod = async (obj) => {
        openLockModal(obj);
    };

    const handleSelectiveUnlock = async (obj) => {
        openUnlockModal(obj);
    };

    const confirmLockWithUsers = async (allowedUsers,key) => {
        try {
            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}periods/lock`,
                {},
                {
                    financialYearId,
                    fromDate: currectFromDateToDate.fromDate,
                    toDate: currectFromDateToDate.toDate,
                    reason: 'Manual lock operation',
                    allowedUsers: allowedUsers,
                    type:key
                },
                "POST"
            );

            if (isSuccess) {
                fetchData(financialYearId)
                closeAllModals();
            }
        } catch (err) {
            console.error('Lock error:', err);
        } finally {
            setActionLoading(prev => ({ ...prev, [currentLockingPeriod]: false }));
        }
    };

    const fetchData = async (financialYearId) => {
        setDataLoading(true);
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}periods/locked`,
                {},
                { financialYearId },
                "GET"
            );
            if (isSuccess) {
                setPeriodLockData(data?.data)
            } else {
                setPeriodLockData([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setPeriodLockData([]);
        } finally {
            setDataLoading(false);
        }
    };

    const getAllowedUsersForPeriod = (obj) => {
        return users.filter(user => obj?.allowedUsers.indexOf(user.userId) === -1) || [];
    };

    const getUnallowedUsersForPeriod = (obj) => {
        const allowedUsers = getAllowedUsersForPeriod(obj);
        const allowedUserIds = allowedUsers.map(user => user.userId);
        return users.filter(user => !allowedUserIds.some(id => id === user.userId));
    };

    const closeAllModals = () => {
        setShowUserModal(false);
        setShowViewModal(false);
        setShowUnlockModal(false);
        setCurrentLockingPeriod(null);
        setCurrentViewingPeriod(null);
        setCurrentUnlockingPeriod(null);
        setModalType('');
        // Reset all search queries
        setUserSearchQuery('');
        setUnlockSearchQuery('');
        setAllowedUsersSearchQuery('');
        setUnallowedUsersSearchQuery('');
    };

    // Filter functions for different user lists
    const filterUsers = (userList, searchQuery) => {
        if (!searchQuery) return userList;
        const query = searchQuery.toLowerCase();
        return userList.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user.email?.toLowerCase() || '';
            return fullName.includes(query) || email.includes(query);
        });
    };

    // Search bar component
    const SearchBar = ({ searchQuery, setSearchQuery, placeholder, autoFocus = false }) => (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus={autoFocus}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: '#ffffff'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1.1rem'
                }}>
                    🔍
                </div>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '0.25rem'
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );

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

                    const [frequencyData] = await Promise.all([
                        fetchFrequency(financialYearResult.currentId),
                    ]);
                    await fetchUsers()
                    fetchData(financialYearResult.currentId)

                    setFrequency(frequencyData);
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

    const handleFinancialYearChange = async (newFinancialYearId) => {
        setSelectedFinancialYear(newFinancialYearId);
        setFinancialYearId(newFinancialYearId);
        setSelectedPeriods(new Set());

        try {
            const frequencyData = await fetchFrequency(newFinancialYearId);
            setFrequency(frequencyData);
        } catch (err) {
            console.error('Error fetching frequency:', err);
        }
    };

    const periodsData = generateAllPeriodsData();

    const styles = {
        container: {
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        },
        mainContent: {
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        pageHeader: {
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '2rem 0'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3F88A5, #2c6b84)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
        },
        controlsSection: {
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid #e5e7eb'
        },
        periodsTable: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        tableHeader: {
            background: 'linear-gradient(135deg, #3F88A5 0%, #2c6b84 100%)',
            color: 'white'
        },
        tableHeaderCell: {
            padding: '1.5rem',
            fontWeight: '600',
            fontSize: '0.95rem',
            textAlign: 'left',
            letterSpacing: '0.5px'
        },
        tableRow: {
            transition: 'all 0.3s ease',
            borderBottom: '1px solid #f1f5f9'
        },
        tableCell: {
            padding: '1.5rem',
            verticalAlign: 'middle'
        },
        periodLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#334155'
        },
        periodIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3F88A5, #2c6b84)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
        },
        dateRange: {
            background: 'linear-gradient(135deg, #e0f5f9 0%, #c7ebf0 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #92d3e2',
            textAlign: 'center'
        },
        dateText: {
            fontSize: '0.9rem',
            color: '#2c6b84',
            fontWeight: '500'
        },
        dateConnector: {
            margin: '0.5rem 0',
            color: '#3F88A5',
            fontWeight: '700',
            fontSize: '0.8rem'
        },
        actionButtons: {
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        button: {
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        lockButton: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
        },
        unlockButton: {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
        },
        viewButton: {
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
        },
        userItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            transition: 'all 0.2s ease',
            borderBottom: '1px solid #e5e7eb'
        },
        userAvatar: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3F88A5, #2c6b84)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: '700',
            marginRight: '1rem'
        },
        userInfo: {
            flex: 1
        },
        userName: {
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.25rem'
        },
        userEmail: {
            fontSize: '0.85rem',
            color: '#6b7280'
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: '#6b7280'
        },
        spinner: {
            width: '60px',
            height: '60px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3F88A5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
        },
        errorContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: '#ef4444',
            textAlign: 'center'
        },
        errorIcon: {
            fontSize: '4rem',
            marginBottom: '1rem'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.mainContent}>
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.mainContent}>
                    <div style={styles.errorContainer}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Error: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.mainContent}>
                {/* Controls Section */}
                <div style={styles.controlsSection}>
                    <FinancialYearField
                        value={selectedFinancialYear}
                        onChange={handleFinancialYearChange}
                        options={financialYearOptions}
                        required={true}
                        disabled={false}
                    />
                </div>

                {/* Periods Table */}
                {periodsData.length > 0 && (
                    <div>
                        <table style={styles.periodsTable}>
                            <thead style={styles.tableHeader}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>Period</th>
                                    <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Date Range</th>
                                    <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periodsData.map((period, index) => (
                                    <tr
                                        key={period.periodValue}
                                        style={{
                                            ...styles.tableRow,
                                            background: index % 2 === 0 ? '#fafbfc' : 'white'
                                        }}
                                    >
                                        <td style={styles.tableCell}>
                                            <div style={styles.periodLabel}>
                                                <div style={styles.periodIcon}>📊</div>
                                                {period.periodLabel}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            {period.fromDate && period.toDate && (
                                                <div style={styles.dateRange}>
                                                    <div style={styles.dateText}>{period.fromDate} TO {period.toDate}</div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.actionButtons}>
                                                {!periodLockData.some(item => item.fromDate === period.fromDate && item.toDate === period.toDate) ? (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            const matchedObj = {
                                                                fromDate: period.fromDate,
                                                                toDate: period.toDate
                                                            }
                                                            handleLockPeriod(matchedObj);
                                                        }}
                                                    >
                                                        🔒 Lock
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                const matchedObj = {
                                                                    fromDate: period.fromDate,
                                                                    toDate: period.toDate
                                                                }
                                                                handleLockPeriod(matchedObj);
                                                            }}
                                                        >
                                                            🔒 Lock
                                                        </Button>
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() => {
                                                                const matchedObj = periodLockData.find(
                                                                    item => item.fromDate === period.fromDate && item.toDate === period.toDate
                                                                );
                                                                handleSelectiveUnlock(matchedObj);
                                                            }}
                                                        >
                                                            🔧 Unlock Users
                                                        </Button>
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() => {
                                                                const matchedObj = periodLockData.find(
                                                                    item => item.fromDate === period.fromDate && item.toDate === period.toDate
                                                                );
                                                                openViewModal(matchedObj);
                                                            }}
                                                        >
                                                            👁️ View Users
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Lock Users Modal */}
                <Modal
                    show={showUserModal && modalType === 'lock'}
                    onHide={closeAllModals}
                    size="lg"
                    backdrop="static"
                >
                    <Modal.Header closeButton >
                        <Modal.Title>Select Allowed Users for Period Lock</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Select users who will be allowed to access and modify data for this locked period.
                            Leave empty to lock for all users.
                        </div>

                        {!usersLoading && users.length > 0 && (
                            <>
                                <SearchBar
                                    searchQuery={userSearchQuery}
                                    setSearchQuery={setUserSearchQuery}
                                    placeholder="Search users by name or email..."
                                    autoFocus={true}
                                />

                                {/* Action Buttons */}
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleSelectAllUsers('lock')}
                                    >
                                        Select All {userSearchQuery && '(Filtered)'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleDeselectAllUsers('lock')}
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                            </>
                        )}

                        {usersLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={styles.spinner}></div>
                                <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>No users available</p>
                            </div>
                        ) : (
                            <div style={{
                                maxHeight: '350px',
                                overflowY: 'auto',
                                border: '2px solid #f1f5f9',
                                borderRadius: '16px',
                                background: '#fafbfc'
                            }}>
                                {filterUsers(users, userSearchQuery)
                                    .map((user, index) => (
                                        <div key={user.userId} style={{
                                            ...styles.userItem,
                                            background: selectedUsersForLock.some(id => id === user.userId)
                                                ? 'linear-gradient(135deg, #e0f5f9, #c7ebf0)'
                                                : 'transparent'
                                        }}>
                                            <Form.Check
                                                type="checkbox"
                                                id={`lock-user-${user.userId}`}
                                                checked={selectedUsersForLock.some(id => id === user.userId)}
                                                onChange={(e) => handleUserSelect(user.userId, e.target.checked, 'lock')}
                                                style={{ marginRight: '1rem' }}
                                            />
                                            <label htmlFor={`lock-user-${user.userId}`} style={{
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', flex: 1
                                            }}>
                                                <div style={styles.userAvatar}>
                                                    {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                                </div>
                                                <div style={styles.userInfo}>
                                                    <div style={styles.userName}>
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div style={styles.userEmail}>
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}

                                {/* Show message when no users match search */}
                                {userSearchQuery && filterUsers(users, userSearchQuery).length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                            No users found matching "{userSearchQuery}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!usersLoading && users.length > 0 && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #e0f5f9, #c7ebf0)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '1px solid #92d3e2'
                            }}>
                                <div style={{ fontSize: '0.95rem', color: '#2c6b84', fontWeight: '600' }}>
                                    {selectedUsersForLock.length} of {filterUsers(users, userSearchQuery).length} users selected
                                    {userSearchQuery && ` (${users.length} total)`}
                                </div>
                                {selectedUsersForLock.length === 0 && (
                                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#d32f2f' }}>
                                        No users selected - period will be locked for everyone
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAllModals}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => confirmLockWithUsers(selectedUsersForLock,'locked')}
                            disabled={actionLoading[currentLockingPeriod] || usersLoading}
                        >
                            {actionLoading[currentLockingPeriod] ? 'Locking...' : 'Lock Period'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Unlock User Selection Modal */}
                <Modal
                    show={showUnlockModal && modalType === 'unlock'}
                    onHide={closeAllModals}
                    size="lg"
                    backdrop="static"
                >
                    <Modal.Header closeButton >
                        <Modal.Title>Select Users to Unlock</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            Select users to unlock from this period. They will regain access to modify data.
                        </div>

                        <SearchBar
                            searchQuery={unlockSearchQuery}
                            setSearchQuery={setUnlockSearchQuery}
                            placeholder="Search users to unlock..."
                            autoFocus={true}
                        />

                        {!usersLoading && (
                            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleSelectAllUsers('unlock')}
                                >
                                    Select All {unlockSearchQuery && '(Filtered)'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleDeselectAllUsers('unlock')}
                                >
                                    Deselect All
                                </Button>
                            </div>
                        )}

                        <div style={{
                            maxHeight: '350px',
                            overflowY: 'auto',
                            border: '2px solid #f1f5f9',
                            borderRadius: '16px',
                            background: '#fafbfc'
                        }}>
                            {filterUsers(getAllowedUsersForPeriod(currentUnlockingPeriod) || [], unlockSearchQuery)
                                .map((user, index) => (
                                    <div key={user.userId} style={{
                                        ...styles.userItem,
                                        background: selectedUsersForUnlock.some(id => id === user.userId)
                                            ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                            : 'transparent'
                                    }}>
                                        <Form.Check
                                            type="checkbox"
                                            id={`unlock-user-${user.userId}`}
                                            checked={selectedUsersForUnlock.some(id => id === user.userId)}
                                            onChange={(e) => handleUserSelect(user.userId, e.target.checked, 'unlock')}
                                            style={{ marginRight: '1rem' }}
                                        />
                                        <label htmlFor={`unlock-user-${user.userId}`} style={{
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', flex: 1
                                        }}>
                                            <div style={{ ...styles.userAvatar, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                                {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                            </div>
                                            <div style={styles.userInfo}>
                                                <div style={styles.userName}>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div style={styles.userEmail}>
                                                    {user.email}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))}

                            {/* Show message when no users match search */}
                            {unlockSearchQuery && filterUsers(getAllowedUsersForPeriod(currentUnlockingPeriod) || [], unlockSearchQuery).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                        No users found matching "{unlockSearchQuery}"
                                    </p>
                                </div>
                            )}

                            {(!currentUnlockingPeriod || getAllowedUsersForPeriod(currentUnlockingPeriod).length === 0) && (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                        No locked users available to unlock
                                    </p>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAllModals}>
                            Cancel
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() =>
                                confirmLockWithUsers([
                                    ...selectedUsersForUnlock,
                                    ...getUnallowedUsersForPeriod(currentUnlockingPeriod).map(user => user.userId),
                                ],'unlocked')
                            }
                            disabled={actionLoading[currentUnlockingPeriod] || selectedUsersForUnlock.length === 0}
                        >
                            {actionLoading[currentUnlockingPeriod] ? 'Unlocking...' : 'Unlock Selected Users'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* View Users Modal */}
                <Modal
                    show={showViewModal && modalType === 'view'}
                    onHide={closeAllModals}
                    size="xl"
                    backdrop="static"
                >
                    <Modal.Header closeButton >
                        <Modal.Title>Period Users Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            {/* Allowed Users */}
                            <div>
                                <h5 style={{
                                    color: '#10b981',
                                    marginBottom: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    ✅ Allowed Users ({(getUnallowedUsersForPeriod(currentViewingPeriod) || []).length})
                                </h5>

                                <SearchBar
                                    searchQuery={allowedUsersSearchQuery}
                                    setSearchQuery={setAllowedUsersSearchQuery}
                                    placeholder="Search allowed users..."
                                    autoFocus={true}
                                />

                                <div style={{
                                    border: '2px solid #10b981',
                                    borderRadius: '16px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
                                }}>
                                    {!currentViewingPeriod || getUnallowedUsersForPeriod(currentViewingPeriod).length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                                            <div style={{ fontWeight: '500' }}>No users allowed - completely locked</div>
                                        </div>
                                    ) : (
                                        <>
                                            {filterUsers(getUnallowedUsersForPeriod(currentViewingPeriod), allowedUsersSearchQuery)
                                                .map((user, index) => (
                                                    <div key={user.userId} style={{
                                                        ...styles.userItem,
                                                        background: 'rgba(16, 185, 129, 0.1)',
                                                        borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
                                                    }}>
                                                        <div style={{ ...styles.userAvatar, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                            {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                                        </div>
                                                        <div style={styles.userInfo}>
                                                            <div style={styles.userName}>
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            <div style={styles.userEmail}>
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            {allowedUsersSearchQuery && filterUsers(getUnallowedUsersForPeriod(currentViewingPeriod), allowedUsersSearchQuery).length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                                        No allowed users found matching "{allowedUsersSearchQuery}"
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Unallowed Users */}
                            <div>
                                <h5 style={{
                                    color: '#ef4444',
                                    marginBottom: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    ❌ Unallowed Users ({(getAllowedUsersForPeriod(currentViewingPeriod) || []).length})
                                </h5>

                                <SearchBar
                                    searchQuery={unallowedUsersSearchQuery}
                                    setSearchQuery={setUnallowedUsersSearchQuery}
                                    placeholder="Search unallowed users..."
                                />

                                <div style={{
                                    border: '2px solid #ef4444',
                                    borderRadius: '16px',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    background: 'linear-gradient(135deg, #fef2f2, #fecaca)'
                                }}>
                                    {!currentViewingPeriod || getAllowedUsersForPeriod(currentViewingPeriod).length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔓</div>
                                            <div style={{ fontWeight: '500' }}>All users are allowed</div>
                                        </div>
                                    ) : (
                                        <>
                                            {filterUsers(getAllowedUsersForPeriod(currentViewingPeriod), unallowedUsersSearchQuery)
                                                .map((user, index) => (
                                                    <div key={user.userId} style={{
                                                        ...styles.userItem,
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        borderBottom: '1px solid rgba(239, 68, 68, 0.2)'
                                                    }}>
                                                        <div style={{ ...styles.userAvatar, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                                            {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                                        </div>
                                                        <div style={styles.userInfo}>
                                                            <div style={styles.userName}>
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            <div style={styles.userEmail}>
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            {unallowedUsersSearchQuery && filterUsers(getAllowedUsersForPeriod(currentViewingPeriod), unallowedUsersSearchQuery).length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                                        No unallowed users found matching "{unallowedUsersSearchQuery}"
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={closeAllModals}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                /* Custom Bootstrap modal overrides */
                .modal-header {
                    border-bottom: none;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                
                .modal-footer {
                    border-top: 2px solid #f1f5f9;
                    border-radius: 0 0 0.5rem 0.5rem;
                }
                
                .modal-content {
                    border-radius: 1rem;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    border: none;
                }
                
                .btn {
                    border-radius: 0.5rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.85rem;
                }
                
                .form-check-input:checked {
                    background-color: #3F88A5;
                    border-color: #3F88A5;
                }
            `}</style>
        </div>
    );
};

export default LockQuestion;