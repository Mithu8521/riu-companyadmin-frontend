import { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import { FinancialYearField } from "../CarbonFootPrinting/common/FormComponents";
import { getFinancialYear } from "../Training/training-dashboard/services/trainingService";
import "./EmailNotificationsAndDueDate.css";


// Notification Types Enum
const NotificationsTypeEnum = {
    SUSTAINABILITY_INSIGHTS: 'sustainabilityInsights',
    DATA_OWNER: 'dataOwner',
    AUDITOR: 'auditor',
    ADMIN: 'admin',
    DATA_OWNER_APPRECIATION: 'dataOwnerAppreciation',
    AUDITOR_APPRECIATION: 'auditorAppreciation'
};

const EmailNotificationsAndDueDate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
    const [financialYearOptions, setFinancialYearOptions] = useState([]);
    const [financialYearId, setFinancialYearId] = useState(null);
    const [savedConfig, setSavedConfig] = useState();
    const [activeTab, setActiveTab] = useState("custom");
    const [showModal, setShowModal] = useState(false);
    const [showAddNotificationModal, setShowAddNotificationModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingConfiguration, setExistingConfiguration] = useState(null);
    const [notificationList, setNotificationList] = useState([]);
    const [scheduledNotifications, setScheduledNotifications] = useState([]);
    const [expandedAccordions, setExpandedAccordions] = useState(new Set());
    const [activeNotificationTab, setActiveNotificationTab] = useState({});
    const [notificationStatusFilter, setNotificationStatusFilter] = useState({});

    useEffect(() => {
        console.log(activeNotificationTab, "activeNotificationTabactiveNotificationTab")
    }, [activeNotificationTab])

    const [addNotificationData, setAddNotificationData] = useState({
        notificationDays: "",
        recurring: "",
        ruleType: "before", // before or after Due Date
        fixedTime: "",
        fromTime: "00:00",
        toTime: "23:59",
        ccList: "" 
    });

    const [modalForm, setModalForm] = useState({
        dueDateOption: 'applyRule',
        dueDate: "",
        applyRule: "",
        ruleDays: "",
        dataOwnerNotifications: [],
        auditorNotifications: [],
        adminNotifications: [],
        sustainabilityInsightsNotifications: [],
        dataOwnerAppreciationNotifications: [],
        auditorAppreciationNotifications: [],
        adminForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        },
        dataOwnerForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        },
        auditorForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        },
        adminForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        },
        dataOwnerAppreciationForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        },
        auditorAppreciationForm: {
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00",
            toTime: "23:59",
            ccList: "" 
        }
    });

    const loadScheduledNotifications = async (financialYearId) => {
        try {
            setIsLoading(true);
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}scheduledNotifications`,
                {},
                {
                    financialYearId: financialYearId,
                    questionType: activeTab
                },
                "GET"
            );

            if (isSuccess && data) {
                const sortedData = data.data.sort((a, b) => {
                    const dateA = new Date(a.periodRecord.fromDate + "-01"); // YYYY-MM -> YYYY-MM-01
                    const dateB = new Date(b.periodRecord.fromDate + "-01");
                    return dateA.getTime() - dateB.getTime();
                });
                setScheduledNotifications(sortedData || []);

                for (const config of sortedData) {
                    if (config.notifications && config.notifications.length > 0) {
                        const firstNotification = config.notifications[0];
                        const scheduleId = firstNotification.dueDateConfigId;
                        const notificationType = firstNotification.notificationsType;

                        setActiveNotificationTab(prev => ({
                            ...prev,
                            [scheduleId]: notificationType
                        }));
                    }
                }

            }
        } catch (error) {
            console.error("Error loading scheduled notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadExistingConfiguration = async () => {
        try {
            setIsLoading(true);
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailNotificationConfiguration`,
                {},
                {
                    financialYearId: selectedFinancialYear,
                    questionType: activeTab
                },
                "GET"
            );

            if (isSuccess && data) {
                setExistingConfiguration(data.data.configuration);
                return data.data.configuration;
            }
            return null;
        } catch (error) {
            console.error("Error loading existing configuration:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const prefillModalWithExistingData = (configData) => {
        if (!configData) return;

        console.log("Prefilling with data:", configData); // Debug log

        // Prefill due date configuration
        const dueDateConfig = {
            dueDateOption: configData.dueDateConfiguration?.type || configData.dueDateType || "",
            dueDate: configData.dueDateConfiguration?.fixedDate || configData.fixedDate || "",
            applyRule: configData.dueDateConfiguration?.rule || configData.rule || "",
            ruleDays: configData.dueDateConfiguration?.days?.toString() || configData.ruleDays?.toString() || "",
        };

        console.log("Due date config:", dueDateConfig); // Debug log

        // Initialize notifications by type
        const notificationsByType = {
            dataOwnerNotifications: [],
            auditorNotifications: [],
            adminNotifications: [],
            sustainabilityInsightsNotifications: [],
            dataOwnerAppreciationNotifications: [],
            auditorAppreciationNotifications: [],
        };

        // Convert existing notifications to the modal format
        if (configData.notificationsByType || configData.emailsByType) {
            const emailsByType = configData.notificationsByType || configData.emailsByType || {};

            Object.entries(emailsByType).forEach(([type, notifications]) => {
                const notificationKey = `${type}Notifications`;

                if (notificationsByType.hasOwnProperty(notificationKey) && Array.isArray(notifications)) {
                    notificationsByType[notificationKey] = notifications.map((notif, index) => ({
                        id: notif.id || generateId(),
                        days: (notif.daysBeforeDueDate || notif.days || notif.notificationDays || "").toString(),
                        frequency: notif.frequency || "once",
                        type: type,
                        ruleType: notif.ruleType || "before",
                        ccList: notif.ccList || '',
                        ...(notif.frequency === 'hourly'
                            ? { fromTime: notif.fromTime || "", toTime: notif.toTime || "" }
                            : { fixedTime: notif.fixedTime || "" }
                        )
                    }));
                }
            });
        }

        console.log("Notifications by type:", notificationsByType); // Debug log

        // Update modal form with all data
        setModalForm(prev => ({
            ...prev,
            ...dueDateConfig,
            ...notificationsByType,
            // Reset form inputs
            sustainabilityInsightsForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            },
            dataOwnerForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            },
            auditorForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            },
            adminForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            },
            dataOwnerAppreciationForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            },
            auditorAppreciationForm: {
                notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00",
                toTime: "23:59", ccList: "" 
            }
        }));

        // Set saved config if due date is configured
        if (dueDateConfig.dueDateOption) {
            setSavedConfig(dueDateConfig);
            console.log("Setting saved config:", dueDateConfig); // Debug log
        }
    };

    const getCurrentTabScheduledNotifications = () => {
        return scheduledNotifications.filter(notification =>
            notification.questionFrequencyType === activeTab
        );
    };

    const setActiveNotificationTabForSchedule = (scheduleId, notificationType) => {
        setActiveNotificationTab(prev => ({
            ...prev,
            [scheduleId]: notificationType
        }));
    };

    const setNotificationStatusFilterForSchedule = (scheduleId, status) => {
        setNotificationStatusFilter(prev => ({
            ...prev,
            [scheduleId]: status
        }));
    };

    const getFilteredNotificationsByStatus = (notifications, scheduleId) => {
        const filter = notificationStatusFilter[scheduleId];
        if (!filter || filter === 'all') return notifications;
        return notifications.filter(notif => notif.status === filter);
    };

    const getDueDateDisplay = (schedule) => {
        if (schedule.dueDateType === 'selectDate' || schedule.dueDateType === 'fixedDate') {
            return `Fixed Date: ${formatNotificationDate(schedule.fixedDate)}`;
        } else if (schedule.dueDateType === 'applyRule') {
            return `${schedule.ruleDays} days ${schedule.rule} period end (${formatNotificationDate(schedule.fixedDate)})`;
        }
        return 'Due date not configured';
    };

    const validateEmails = (emailString) => {
        if (!emailString || emailString.trim() === '') return true; // Empty is valid (optional field)
        
        const emails = emailString.split(',').map(email => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return emails.every(email => emailRegex.test(email));
    };


    const toggleAccordion = (periodId) => {
        const newExpanded = new Set(expandedAccordions);
        if (newExpanded.has(periodId)) {
            newExpanded.delete(periodId);
        } else {
            newExpanded.add(periodId);
        }
        setExpandedAccordions(newExpanded);
    };

    const getNotificationTypeLabel = (type) => {
        switch (type) {
            case NotificationsTypeEnum.DATA_OWNER:
                return 'Data Owner';
            case NotificationsTypeEnum.AUDITOR:
                return 'Auditor';
            case NotificationsTypeEnum.ADMIN:
                return 'Admin';
            case NotificationsTypeEnum.SUSTAINABILITY_INSIGHTS:
                return 'Sustainability Insights';
            case NotificationsTypeEnum.DATA_OWNER_APPRECIATION:
                return 'Data Owner Appreciation';
            case NotificationsTypeEnum.AUDITOR_APPRECIATION:
                return 'Auditor Appreciation';
            default:
                return type;
        }
    };

    const getNotificationTypeColor = (type) => {
        switch (type) {
            case NotificationsTypeEnum.DATA_OWNER:
                return '#28a745';
            case NotificationsTypeEnum.AUDITOR:
                return '#17a2b8';
            case NotificationsTypeEnum.ADMIN:
                return '#ffc107';
            case NotificationsTypeEnum.DATA_OWNER_APPRECIATION:
                return '#dc3545';
            case NotificationsTypeEnum.AUDITOR_APPRECIATION:
                return '#6610f2';
            case NotificationsTypeEnum.SUSTAINABILITY_INSIGHTS:
                return '#20c997';
            default:
                return '#6c757d';
        }
    };

    const formatNotificationDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    function generateId() {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    }

    const addNotificationByType = (type) => {
        const formKey = `${type}Form`;
        const notificationKey = `${type}Notifications`;
        const currentForm = modalForm[formKey];

        // Validate required fields including time based on frequency
        const timeValidation = currentForm.recurring === 'hourly'
            ? (currentForm.fromTime && currentForm.toTime)
            : (currentForm.recurring !== '' ? currentForm.fixedTime : false);

        // Validate CC List emails
        const ccListValid = validateEmails(currentForm.ccList || '');

        if (!ccListValid) {
            alert("Please enter valid email addresses in CC List (comma-separated)");
            return;
        }

        if (currentForm.notificationDays && currentForm.recurring && timeValidation) {
            const newNotification = {
                id: generateId(),
                days: currentForm.notificationDays,
                frequency: currentForm.recurring,
                type: type,
                ruleType: currentForm.ruleType,
                ccList: currentForm.ccList || '',
                ...(currentForm.recurring === 'hourly'
                    ? { fromTime: currentForm.fromTime, toTime: currentForm.toTime }
                    : { fixedTime: currentForm.fixedTime }
                ),
            };

            setModalForm(prev => ({
                ...prev,
                [notificationKey]: [...(prev[notificationKey] || []), newNotification],
                [formKey]: {
                    notificationDays: '',
                    recurring: '',
                    ruleType: 'before',
                    fixedTime: '',
                    fromTime: "00:00",
                    toTime: "23:59",
                    ccList: ''
                }
            }));
        }
    };

    const removeNotificationByType = (type, index) => {
        const notificationKey = `${type}Notifications`;
        setModalForm(prev => ({
            ...prev,
            [notificationKey]: (prev[notificationKey] || []).filter((_, i) => i !== index)
        }));
    };

    const updateFormByType = (type, field, value) => {
        const formKey = `${type}Form`;
        setModalForm(prev => ({
            ...prev,
            [formKey]: {
                ...prev[formKey],
                [field]: value
            }
        }));
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                const financialYearResult = await getFinancialYear();

                if (financialYearResult) {
                    setFinancialYearId(financialYearResult.currentId);

                    const fyOptions = financialYearResult.data.map(fy => ({
                        value: fy.id,
                        label: fy.financial_year_value
                    }));
                    setFinancialYearOptions(fyOptions);
                    setSelectedFinancialYear(financialYearResult.currentId);

                    await loadScheduledNotifications(financialYearResult.currentId);
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
        if (selectedFinancialYear ) {
            loadScheduledNotifications(selectedFinancialYear);
        }
    }, [selectedFinancialYear]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleEditConfiguration = async () => {
        try {
            setIsLoading(true);
            setIsEditMode(true);

            // Load existing data first
            const existingData = await loadExistingConfiguration();

            if (existingData) {
                console.log("Loaded existing data for edit:", existingData);
                // Prefill the modal with existing data
                prefillModalWithExistingData(existingData);
            } else {
                console.log("No existing data found, using empty form");

                // Reset to empty form if no existing data
                setModalForm({
                    dueDateOption:'applyRule',
                    dueDate: "",
                    applyRule: "",
                    ruleDays: "",
                    dataOwnerNotifications: [],
                    auditorNotifications: [],
                    adminNotifications: [],
                    sustainabilityInsightsNotifications: [],
                    dataOwnerAppreciationNotifications: [],
                    auditorAppreciationNotifications: [],
                    sustainabilityInsightsForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    dataOwnerForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    auditorForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    adminForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    dataOwnerAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    auditorAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" }
                });
                setSavedConfig(null);
            }

        } catch (error) {
            console.error("Error in handleEditConfiguration:", error);
        } finally {
            setIsLoading(false);
            // Show modal after data is loaded and prefilled
            setShowModal(true);
        }
    };

    const handleCreateConfiguration = () => {
        setIsEditMode(false);
        setExistingConfiguration(null);
        // Reset modal form

        setModalForm({
            dueDateOption: 'applyRule',
            dueDate: "",
            applyRule: "",
            ruleDays: "",
            dataOwnerNotifications: [],
            auditorNotifications: [],
            adminNotifications: [],
            sustainabilityInsightsNotifications: [],
            dataOwnerAppreciationNotifications: [],
            auditorAppreciationNotifications: [],
            sustainabilityInsightsForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
            dataOwnerForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
            auditorForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
            adminForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
            dataOwnerAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
            auditorAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" }
        });
        setSavedConfig(null);
        setShowModal(true);
    };

    function formatToAMPM(time24) {
        if (!time24) return '';
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // convert 0 => 12
        return `${hour}:${minute} ${ampm}`;
    }


    const handleModalSubmit = async () => {
        // Check if due date configuration is properly set (if any due date option is selected)
        const isDueDateConfigured = modalForm.dueDateOption && modalForm.dueDateOption !== '' &&
            ((modalForm.dueDateOption === 'selectDate' && modalForm.dueDate) ||
             (modalForm.dueDateOption === 'applyRule' && modalForm.applyRule && modalForm.ruleDays));

        // If due date option is selected but not properly configured, show error (only for new configurations)
        if (!isEditMode && modalForm.dueDateOption && !isDueDateConfigured) {
            alert("Please fill all required due date fields");
            return;
        }
        try {
            setIsLoading(true);
            const notificationsByType = {
                sustainabilityInsights: modalForm.sustainabilityInsightsNotifications,
                dataOwner: modalForm.dataOwnerNotifications,
                auditor: modalForm.auditorNotifications,
                admin: modalForm.adminNotifications,
                dataOwnerAppreciation: modalForm.dataOwnerAppreciationNotifications,
                auditorAppreciation: modalForm.auditorAppreciationNotifications
            };

            const payload = {
                financialYear: parseInt(selectedFinancialYear),
                questionType: activeTab,
                dueDateConfiguration: isDueDateConfigured ? {
                    type: modalForm.dueDateOption,
                    ...(modalForm.dueDateOption === 'selectDate'
                        ? { fixedDate: modalForm.dueDate }
                        : {
                            rule: modalForm.applyRule,
                            days: parseInt(modalForm.ruleDays)
                        }
                    )
                } : null,
                notificationsByType: Object.entries(notificationsByType).reduce((acc, [type, notifications]) => {
                    if (notifications.length > 0) {
                        acc[type] = notifications.map(notification => ({
                            daysBeforeDueDate: parseInt(notification.days),
                            frequency: notification.frequency,
                            notificationType: type,
                            ruleType: notification.ruleType,
                            id: notification.id,
                            ccList: notification.ccList || '',
                            ...(notification.frequency === 'hourly'
                                ? {
                                    fromTime: notification.fromTime,
                                    toTime: notification.toTime
                                }
                                : {
                                    fixedTime: notification.fixedTime
                                }
                            ),
                        }));
                    }
                    return acc;
                }, {}),
                isActive: true,
                createdAt: new Date().toISOString(),
                ...(isEditMode && existingConfiguration && { configurationId: existingConfiguration.id })
            };

            const endpoint = `${config.POSTLOGIN_API_URL_COMPANY}emailNotification`;
            const method = "POST";

            const { isSuccess } = await apiCall(endpoint, {}, payload, method);

            if (isSuccess) {
                await loadScheduledNotifications(selectedFinancialYear);
                setSavedConfig();
                setShowModal(false);
                setIsEditMode(false);
                setExistingConfiguration(null);
                setModalForm({
                    dueDateOption: 'applyRule',
                    dueDate: "",
                    applyRule: "",
                    ruleDays: "",
                    dataOwnerNotifications: [],
                    auditorNotifications: [],
                    adminNotifications: [],
                    sustainabilityInsightsNotifications: [],
                    dataOwnerAppreciationNotifications: [],
                    auditorAppreciationNotifications: [],
                    sustainabilityInsightsForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    dataOwnerForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    auditorForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    adminForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    dataOwnerAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" },
                    auditorAppreciationForm: { notificationDays: "", recurring: "", ruleType: "before", fixedTime: "", fromTime: "00:00", toTime: "23:59", ccList: "" }
                });
            } else {
                throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} notification configuration`);
            }

        } catch (error) {
            console.error("Error saving notification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSingleNotification = async () => {
        const timeValidation = addNotificationData.recurring === 'hourly'
            ? (addNotificationData.fromTime && addNotificationData.toTime)
            : addNotificationData.fixedTime;



        if (!addNotificationData.notificationDays || !addNotificationData.recurring || !timeValidation) {
            alert("Please fill all notification fields including time");
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                daysBeforeDueDate: parseInt(addNotificationData.notificationDays),
                frequency: addNotificationData.recurring,
                notificationType: activeTab,
                ruleType: addNotificationData.ruleType,
                financialYearId: parseInt(selectedFinancialYear),
                // Include time data
                ...(addNotificationData.recurring === 'hourly'
                    ? {
                        fromTime: addNotificationData.fromTime,
                        toTime: addNotificationData.toTime
                    }
                    : {
                        fixedTime: addNotificationData.fixedTime
                    }
                ),
            };

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailNotificationSingle`,
                {},
                payload,
                "POST"
            );

            if (isSuccess) {
                await loadScheduledNotifications(selectedFinancialYear);
                setShowAddNotificationModal(false);
                setAddNotificationData({
                    notificationDays: "",
                    recurring: "",
                    ruleType: "before",
                    fixedTime: "",
                    fromTime: "00:00", toTime: "23:59",
                });
            } else {
                throw new Error("Failed to add notification");
            }

        } catch (error) {
            console.error("Error adding notification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNotification = async (notificationId, tablePKId) => {
        try {
            setIsLoading(true);

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailNotification`,
                {},
                { id: notificationId, tablePKId },
                "DELETE"
            );

            if (isSuccess) {
                await loadScheduledNotifications(selectedFinancialYear);
            } else {
                throw new Error("Failed to delete notification");
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            const notification = notificationList.find(item => item.id === id);

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}emailNotificationStatus`,
                {},
                {
                    id: parseInt(id),
                    isActive: !notification.isActive
                },
                "PUT"
            );

            if (isSuccess) {
                setNotificationList(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, isActive: !item.isActive } : item
                    )
                );
            } else {
                throw new Error("Failed to update notification status");
            }
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    const getCurrentTabNotifications = () => {
        return notificationList.filter(notification => notification.type === activeTab);
    };

    const openAddNotificationModal = () => {
        setAddNotificationData({
            notificationDays: "",
            recurring: "",
            ruleType: "before",
            fixedTime: "",
            fromTime: "00:00", toTime: "23:59",
        });
        setShowAddNotificationModal(true);
    };

    // Helper function to render notification section with rule-based configuration
    const renderNotificationSection = (type, title, iconColor) => {
        const formKey = `${type}Form`;
        const notificationKey = `${type}Notifications`;
        const currentForm = modalForm[formKey];
        const currentNotifications = modalForm[notificationKey] || [];
        
        // Check if CC List is valid for this form
        const isCCListValid = validateEmails(currentForm.ccList || '');

        return (
            <div className="p-4 border-top" style={{ backgroundColor: '#fafbfc' }}>
                <div className="p-4 shadow-sm" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                }}>
                    <div className="pb-0 mb-3">
                        <h5 className="mb-0 d-flex align-items-center gap-2">
                            <div className="p-2 rounded-circle" style={{ backgroundColor: `rgba(${iconColor}, 0.15)` }}>
                                <i className="fas fa-bell" style={{ color: `rgb(${iconColor})` }}></i>
                            </div>
                            {title}
                        </h5>
                    </div>
                    <div className="pt-3">
                        {/* Add Notification Form */}
                        <div className="p-4 mb-4 border-2 border-dashed" style={{ borderColor: '#4a90a4', borderRadius: '12px' }}>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-2">
                                    <label className="form-label fw-semibold">Rule Configuration</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg"
                                        placeholder="e.g., 7"
                                        style={{ borderRadius: '8px' }}
                                        value={currentForm.notificationDays}
                                        onChange={(e) => updateFormByType(type, 'notificationDays', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <div className="gap-2">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id={`${type}_ruleAfter`}
                                                name={`${type}_ruleType`}
                                                value="after"
                                                className="form-check-input"
                                                checked={currentForm.ruleType === 'after'}
                                                onChange={(e) => updateFormByType(type, 'ruleType', e.target.value)}
                                            />
                                            <label htmlFor={`${type}_ruleAfter`} className="form-check-label">
                                                After Due Date
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id={`${type}_ruleBefore`}
                                                name={`${type}_ruleType`}
                                                value="before"
                                                className="form-check-input"
                                                checked={currentForm.ruleType === 'before'}
                                                onChange={(e) => updateFormByType(type, 'ruleType', e.target.value)}
                                            />
                                            <label htmlFor={`${type}_ruleBefore`} className="form-check-label">
                                                Before Due Date
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label fw-semibold">Frequency</label>
                                    <select
                                        className="form-select form-select-lg"
                                        style={{ borderRadius: '8px' }}
                                        value={currentForm.recurring}
                                        onChange={(e) => {
                                            const newFrequency = e.target.value;
                                            updateFormByType(type, 'recurring', newFrequency);
                                            updateFormByType(type, 'fixedTime', '');
                                            updateFormByType(type, 'fromTime', '00:00');
                                            updateFormByType(type, 'toTime', '23:59');
                                        }}
                                    >
                                        <option value="">Choose </option>
                                        <option value="once">Once Only</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>

                                {/* Time Configuration */}
                                {currentForm.recurring && (
                                    <>
                                        {currentForm.recurring === 'hourly' ? (
                                            <>
                                                <div className="col-md-2">
                                                    <label className="form-label fw-semibold">From Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control form-control-lg"
                                                        style={{ borderRadius: '8px' }}
                                                        value={currentForm.fromTime}
                                                        onChange={(e) => updateFormByType(type, 'fromTime', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label fw-semibold">To Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control form-control-lg"
                                                        style={{ borderRadius: '8px' }}
                                                        value={currentForm.toTime}
                                                        onChange={(e) => updateFormByType(type, 'toTime', e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold">Fixed Time</label>
                                                <input
                                                    type="time"
                                                    className="form-control form-control-lg"
                                                    style={{ borderRadius: '8px' }}
                                                    value={currentForm.fixedTime}
                                                    onChange={(e) => updateFormByType(type, 'fixedTime', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* CC List Field - NEW */}
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">
                                        CC List <span className="text-muted small">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="email1@example.com, email2@example.com"
                                        style={{ 
                                            borderRadius: '8px',
                                            borderColor: isCCListValid ? '#dee2e6' : '#dc3545',
                                            borderWidth: isCCListValid ? '1px' : '2px'
                                        }}
                                        value={currentForm.ccList}
                                        onChange={(e) => updateFormByType(type, 'ccList', e.target.value)}
                                    />
                                    {!isCCListValid && (
                                        <small className="text-danger mt-1 d-block">
                                            Please enter valid email addresses separated by commas
                                        </small>
                                    )}
                                </div>

                                <div className="col-md-2">
                                    <button
                                        className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                                        style={{
                                            borderRadius: '8px',
                                            backgroundColor: '#4a90a4',
                                            borderColor: '#4a90a4',
                                            color: 'white'
                                        }}
                                        onClick={() => addNotificationByType(type)}
                                        disabled={
                                            !currentForm.notificationDays ||
                                            !currentForm.recurring ||
                                            !isCCListValid ||
                                            (currentForm.recurring === 'hourly'
                                                ? (!currentForm.fromTime || !currentForm.toTime)
                                                : !currentForm.fixedTime
                                            )
                                        }
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List Display */}
                        {currentNotifications?.length > 0 && (
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <i className="fas fa-list-ul" style={{ color: '#4a90a4' }}></i>
                                    <h6 className="mb-0 fw-semibold">Active Notifications</h6>
                                    <span className="px-2 py-1 rounded-pill text-white" style={{ backgroundColor: '#4a90a4', fontSize: '0.75rem' }}>
                                        {currentNotifications.length}
                                    </span>
                                </div>
                                <div className="row g-3">
                                    {currentNotifications.map((notification, index) => (
                                        <div key={index} className="col-md-6 col-lg-4">
                                            <div className="h-100 p-3 shadow-sm" style={{
                                                borderRadius: '12px',
                                                backgroundColor: 'white',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <div className="d-flex align-items-start justify-content-between">
                                                    <div className="d-flex align-items-start gap-2 flex-grow-1">
                                                        <div className="p-2 rounded-circle bg-light">
                                                            <i className="fas fa-bell" style={{ color: '#4a90a4' }}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-semibold">
                                                                {notification.days} days {notification.ruleType === 'before' ? 'before' : 'after'}
                                                            </div>
                                                            <small className="text-muted">
                                                                {notification.frequency}
                                                            </small>
                                                            {/* Display time information */}
                                                            <div className="small text-muted mt-1">
                                                                {notification.frequency === 'hourly' ? (
                                                                    <span>
                                                                        ⏰ {formatToAMPM(notification.fromTime)} - {formatToAMPM(notification.toTime)}
                                                                    </span>
                                                                ) : (
                                                                    <span>⏰ {formatToAMPM(notification.fixedTime)}</span>
                                                                )}
                                                            </div>
                                                            {/* Display CC List if present */}
                                                            {notification.ccList && (
                                                                <div className="small text-muted mt-1" style={{ 
                                                                    wordBreak: 'break-word',
                                                                    maxWidth: '200px'
                                                                }}>
                                                                    <i className="fas fa-envelope" style={{ fontSize: '0.7rem' }}></i> CC: {notification.ccList}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm rounded-circle"
                                                        style={{ width: '32px', height: '32px' }}
                                                        onClick={() => removeNotificationByType(type, index)}
                                                        aria-label="Remove notification"
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
        );
    };
    if (loading || isLoading) {
        return (
            <div className="email-notification-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="email-notification-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="email-notification-container">
            <div className="email-notification-header">
                <h2 className="header-title">Email Notifications Management</h2>
                <p className="header-subtitle">Manage email notification settings for different financial years</p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-container">
                <div className="tabs-navigation">
                    {/* <button
                        className={`tab-button ${activeTab === 'oneTime' ? 'active' : ''}`}
                        onClick={() => handleTabChange('oneTime')}
                    >
                        <span className="tab-icon">🎯</span>
                        <span className="tab-text">One Time</span>
                    </button> */}
                    <button
                        className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={() => handleTabChange('custom')}
                    >
                        <span className="tab-icon">⚙️</span>
                        <span className="tab-text">Custom</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'everyYear' ? 'active' : ''}`}
                        onClick={() => handleTabChange('everyYear')}
                    >
                        <span className="tab-icon">🔄</span>
                        <span className="tab-text">Every Financial Year</span>
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
                        <span className="btn-icon">Due Date And Email Notifications</span>
                        <div className="d-flex gap-2">
                            <button
                                className="global-notification-btn"
                                onClick={handleEditConfiguration}
                            >
                                <span className="btn-text">✏️ Edit</span>
                            </button>
                            <button
                                className="global-notification-btn"
                                onClick={handleCreateConfiguration}
                            >
                                <span className="btn-text">🔀 Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scheduled Notifications Section - Tab Specific */}
            {getCurrentTabScheduledNotifications().length > 0 && (
                <div className="notifications-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h5 className="section-title d-flex align-items-center gap-2">
                            <i className="fas fa-calendar-alt" style={{ color: '#4a90a4' }}></i>
                            Scheduled Notifications -
                            {activeTab === 'oneTime' ? ' One Time' :
                                activeTab === 'everyYear' ? ' Every Financial Year' : ' Custom'}
                        </h5>
                        <span
                            style={{
                                backgroundColor: '#007bff',
                                color: '#fff',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                display: 'inline-block',
                                minWidth: 'fit-content',
                                textAlign: 'center'
                            }}
                        >
                            {getCurrentTabScheduledNotifications().length} Period
                            {getCurrentTabScheduledNotifications().length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="accordion" style={{ marginTop: '1rem' }}>
                        {getCurrentTabScheduledNotifications().map((schedule, index) => (
                            <div
                                key={schedule.id || index}
                                className="accordion-item"
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden'
                                }}
                            >
                                <h2 className="accordion-header">
                                    <button
                                        className={`accordion-button ${expandedAccordions.has(schedule.id) ? '' : 'collapsed'}`}
                                        type="button"
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            borderBottom: expandedAccordions.has(schedule.id) ? '1px solid #dee2e6' : 'none',
                                            fontWeight: '600',
                                            padding: '1rem 1.25rem'
                                        }}
                                        onClick={() => toggleAccordion(schedule.id)}
                                    >
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 rounded-circle bg-primary bg-opacity-10">
                                                    <i className="fas fa-calendar" style={{ color: '#4a90a4' }}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-primary">
                                                        {schedule.periodRecord?.displayName || `Period ${schedule.periodRecord?.period}`}
                                                    </div>
                                                    <small className="text-muted">
                                                        {schedule.periodRecord?.fromDate} to {schedule.periodRecord?.toDate}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-3">
                                                <div className="text-end">
                                                    <div className="small fw-semibold text-muted">
                                                        Due Date: {getDueDateDisplay(schedule)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </h2>

                                {expandedAccordions.has(schedule.id) && (
                                    <div className="accordion-collapse show">
                                        <div className="accordion-body p-0">
                                            {schedule.emailsByType && Object.keys(schedule.emailsByType).length > 0 ? (
                                                <div>
                                                    {/* Notification Type Tabs */}
                                                    <div className="d-flex border-bottom bg-light" style={{ padding: '0.75rem 1rem' }}>
                                                        <nav className="d-flex gap-2 flex-wrap">
                                                            {Object.entries(schedule.emailsByType).map(([type, notifications]) => (
                                                                <button
                                                                    key={type}
                                                                    className={`btn btn-sm ${activeNotificationTab[schedule.id] === type ? 'btn-primary' : 'btn-outline-secondary'
                                                                        }`}
                                                                    style={{
                                                                        borderRadius: '20px',
                                                                        fontSize: '0.75rem',
                                                                        padding: '0.25rem 0.75rem'
                                                                    }}
                                                                    onClick={() => setActiveNotificationTabForSchedule(schedule.id, type)}
                                                                >
                                                                    {getNotificationTypeLabel(type)}
                                                                    <span>
                                                                        {` (${notifications.length})`}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </nav>

                                                        {/* Status Filter */}
                                                        <div className="ms-auto">
                                                            <select
                                                                className="form-select form-select-sm"
                                                                style={{ fontSize: '0.75rem', minWidth: '100px' }}
                                                                value={notificationStatusFilter[schedule.id] || 'all'}
                                                                onChange={(e) => setNotificationStatusFilterForSchedule(schedule.id, e.target.value)}
                                                            >
                                                                <option value="all">All Status</option>
                                                                <option value="pending">Pending</option>
                                                                <option value="sent">Sent</option>
                                                                <option value="failed">Failed</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Notification Content */}
                                                    <div className="p-3">
                                                        {Object.entries(schedule.emailsByType).map(([type, notifications]) => {
                                                            const isActiveTab = activeNotificationTab[schedule.id] === type ||
                                                                (!activeNotificationTab[schedule.id] && Object.keys(schedule.emailsByType)[0] === type);

                                                            if (!isActiveTab) return null;

                                                            const filteredNotifications = getFilteredNotificationsByStatus(notifications, schedule.id);

                                                            return (
                                                                <div key={type}>
                                                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <div
                                                                                className="p-1 rounded-circle"
                                                                                style={{
                                                                                    backgroundColor: getNotificationTypeColor(type),
                                                                                    width: '24px',
                                                                                    height: '24px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center'
                                                                                }}
                                                                            >
                                                                                <i
                                                                                    className="fas fa-bell"
                                                                                    style={{
                                                                                        color: 'white',
                                                                                        fontSize: '0.7rem'
                                                                                    }}
                                                                                ></i>
                                                                            </div>
                                                                            <h6 className="mb-0 fw-semibold">
                                                                                {getNotificationTypeLabel(type)} Notifications
                                                                            </h6>
                                                                        </div>
                                                                        <div className="d-flex gap-2">
                                                                            <button type="button" className="btn btn-sm btn-outline-secondary me-2" disabled>
                                                                                Total: {notifications.length}
                                                                            </button>
                                                                            <button type="button" className="btn btn-sm btn-outline-primary" disabled>
                                                                                Filtered: {filteredNotifications.length}
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {filteredNotifications.length > 0 ? (
                                                                        <div className="row g-3">
                                                                            {filteredNotifications.map((notification, notifIndex) => (
                                                                                <div key={notification.id || notifIndex} className="col-md-6 col-lg-4">
                                                                                    <div
                                                                                        className="p-3 rounded h-100"
                                                                                        style={{
                                                                                            backgroundColor: 'white',
                                                                                            border: `2px solid ${getNotificationTypeColor(type)}20`,
                                                                                            borderLeft: `4px solid ${getNotificationTypeColor(type)}`
                                                                                        }}
                                                                                    >
                                                                                        <div className="d-flex align-items-start justify-content-between mb-2">
                                                                                            <div className="flex-grow-1">
                                                                                                <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
                                                                                                    <i className="fas fa-clock me-1" style={{ color: '#6c757d' }}></i>
                                                                                                    {formatNotificationDate(notification.notificationsDateTime)}
                                                                                                </div>
                                                                                            </div>
                                                                                            <span
                                                                                                className={`px-2 py-1 small rounded-pill ${notification.status === 'pending'
                                                                                                    ? 'bg-warning text-dark'
                                                                                                    : notification.status === 'sent'
                                                                                                        ? 'bg-success text-white'
                                                                                                        : 'bg-danger text-white'
                                                                                                    }`}
                                                                                                style={{ fontSize: '0.7rem' }}
                                                                                            >
                                                                                                {notification.status}
                                                                                            </span>
                                                                                        </div>

                                                                                        {notification.recipientEmailsStautsId && notification.recipientEmailsStautsId.length > 0 && (
                                                                                            <div className="small text-muted">
                                                                                                <i className="fas fa-users me-1"></i>
                                                                                                Recipients: {notification.recipientEmailsStautsId.length}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-4 text-muted">
                                                                            <i className="fas fa-filter fa-2x mb-2"></i>
                                                                            <div>No notifications match the current filter</div>
                                                                            <small>Try changing the status filter above</small>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-muted">
                                                    <i className="fas fa-inbox fa-2x mb-2"></i>
                                                    <div>No notifications configured for this period</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notification List Display */}
            {getCurrentTabNotifications().length > 0 && (
                <div className="notifications-section">
                    <div className="section-header">
                        <h5 className="section-title">
                            Configured Notifications -
                            {activeTab === 'oneTime' ? ' One Time' :
                                activeTab === 'everyYear' ? ' Every Financial Year' : ' Custom'}
                        </h5>
                        <button
                            className="add-notification-btn"
                            onClick={openAddNotificationModal}
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
                                fontWeight: '500'
                            }}
                        >
                            <span className="btn-icon">
                                <i className="fas fa-plus"></i>
                            </span>
                            <span className="btn-text">Add Notification</span>
                        </button>
                    </div>

                    <div className="notification-table-container" style={{
                        overflowX: 'auto',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                    }}>
                        <table className="notification-table" style={{
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
                                    }}>Due Date Configuration</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        borderBottom: '2px solid #dee2e6',
                                        color: '#495057',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}>Notification Type</th>
                                    <th style={{
                                        padding: '0.75rem',
                                        borderBottom: '2px solid #dee2e6',
                                        color: '#495057',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}>Rule Configuration</th>
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
                                {getCurrentTabNotifications().map(notification =>
                                    notification.notificationList?.map((notif, notifIndex) => (
                                        <tr key={`${notification.id}_${notifIndex}`} style={{
                                            borderBottom: '1px solid #f1f3f4'
                                        }}>
                                            {notifIndex === 0 && (
                                                <>
                                                    <td rowSpan={notification.notificationList.length} style={{
                                                        padding: '0.75rem',
                                                        borderRight: '1px solid #f1f3f4',
                                                        textAlign: 'center'
                                                    }}>
                                                        <span className={`type-text ${notification.type}`} style={{
                                                            backgroundColor: notification.type === 'oneTime' ? '#4a90a4' : '#5a9bd4',
                                                            color: 'white',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            {notification.type === 'oneTime' ? 'One Time' :
                                                                notification.type === 'everyYear' ? 'Every Year' : 'Custom'}
                                                        </span>
                                                    </td>
                                                    <td rowSpan={notification.notificationList.length} style={{
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
                                                            {notification.dueDateOption === 'selectDate'
                                                                ? `Fixed Date: ${notification.dueDate}`
                                                                : `${notification.ruleDays} days ${notification.applyRule} period end`
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
                                                <span
                                                    style={{
                                                        backgroundColor: getNotificationTypeColor(notif.notificationType),
                                                        color: notif.notificationType === 'admin' ? '#000' : '#fff',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        display: 'inline-block',
                                                        minWidth: 'fit-content',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {NotificationsTypeEnum[notif.notificationType]}
                                                </span>
                                            </td>
                                            <td style={{
                                                padding: '0.75rem',
                                                borderRight: '1px solid #f1f3f4',
                                                textAlign: 'center'
                                            }}>
                                                <span className="rule-config-text" style={{
                                                    backgroundColor: notif.ruleType === 'before' ? '#28a745' : '#dc3545',
                                                    color: 'white',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {notif.days || notif.daysBeforeDueDate} days {notif.ruleType === 'before' ? 'before' : 'after'}
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
                                                    {notif.frequency}
                                                </span>
                                            </td>
                                            {notifIndex === 0 && (
                                                <>
                                                    <td rowSpan={notification.notificationList.length} style={{
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
                                                                checked={notification.isActive}
                                                                onChange={() => handleToggleActive(notification.id)}
                                                                style={{ opacity: 0, width: 0, height: 0 }}
                                                            />
                                                            <span className="toggle-slider" style={{
                                                                position: 'absolute',
                                                                cursor: 'pointer',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: notification.isActive ? '#4a90a4' : '#ccc',
                                                                transition: '0.4s',
                                                                borderRadius: '24px'
                                                            }}>
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    content: '',
                                                                    height: '18px',
                                                                    width: '18px',
                                                                    left: notification.isActive ? '29px' : '3px',
                                                                    bottom: '3px',
                                                                    backgroundColor: 'white',
                                                                    transition: '0.4s',
                                                                    borderRadius: '50%'
                                                                }}></span>
                                                            </span>
                                                        </label>
                                                    </td>
                                                    <td rowSpan={notification.notificationList.length} style={{
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
                                                                fontSize: '0.9rem'
                                                            }}
                                                            onClick={() => handleDeleteNotification(notif.id, notification.id)}
                                                            disabled={isLoading}
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

            {/* Global Notification Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            {/* Header */}
                            <div className="modal-header position-relative"
                                style={{
                                    background: 'linear-gradient(135deg, #4a90a4 0%, #357a8a 100%)',
                                    borderBottom: 'none',
                                    padding: '1.25rem 1.5rem'
                                }}>
                                <div className="d-flex align-items-center gap-3 text-white">
                                    <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                        <i className="fas fa-calendar-alt fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="modal-title mb-0 fw-bold fs-5">
                                            {isEditMode ? 'Edit' : 'Set'} Due Date & Notifications
                                        </h4>
                                        <small className="opacity-75 fs-6">
                                            {activeTab === 'oneTime' ? 'One Time Configuration' :
                                                activeTab === 'everyYear' ? 'Annual Financial Year Setup' : 'Custom Configuration'}
                                            {isEditMode && ' (Edit Mode)'}
                                        </small>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white position-absolute"
                                    style={{ top: '1.25rem', right: '1.5rem' }}
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body p-0">
                                {/* Due Date Configuration */}
                                <div className="p-3 border-bottom" style={{ backgroundColor: '#f8fafc' }}>
                                    <div className="bg-white rounded-3 p-3 shadow-sm">
                                        {/* Header */}
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div
                                                className="p-1 rounded-circle"
                                                style={{
                                                    backgroundColor: 'rgba(74, 144, 164, 0.1)',
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <i className="fas fa-calendar-check fs-6" style={{ color: '#4a90a4' }}></i>
                                            </div>
                                            <h6 className="mb-0 fw-semibold text-dark">Due Date Configuration</h6>
                                        </div>

                                        {/* Form */}
                                        <div className="row g-3">
                                            <div className={modalForm.dueDateOption === 'selectDate' ? 'col-md-8' : 'col-md-7'}>
                                                <label className="form-label fw-medium mb-1 small">Due Date Type</label>
                                                <div className="gap-3" style={{ fontSize: '0.9rem' }}>
                                                    {/* Radio: Relative to Period */}
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="applyRule"
                                                            name="dueDateType"
                                                            value="applyRule"
                                                            className="form-check-input"
                                                            checked={modalForm.dueDateOption === 'applyRule'}
                                                            onChange={(e) =>
                                                                setModalForm((prev) => ({
                                                                    ...prev,
                                                                    dueDateOption: e.target.value,
                                                                    dueDate: '',
                                                                    applyRule: '',
                                                                    ruleDays: '',
                                                                }))
                                                            }
                                                        />
                                                        <label htmlFor="applyRule" className="form-check-label">
                                                            Relative to Period
                                                        </label>
                                                    </div>

                                                    {/* Radio: Fixed Date */}
                                                    {/* <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            id="selectDate"
                                                            name="dueDateType"
                                                            value="selectDate"
                                                            className="form-check-input"
                                                            checked={modalForm.dueDateOption === 'selectDate'}
                                                            onChange={(e) =>
                                                                setModalForm((prev) => ({
                                                                    ...prev,
                                                                    dueDateOption: e.target.value,
                                                                    dueDate: '',
                                                                    applyRule: '',
                                                                    ruleDays: '',
                                                                }))
                                                            }
                                                        />
                                                        <label htmlFor="selectDate" className="form-check-label">
                                                            Fixed Date
                                                        </label>
                                                    </div> */}

                                                </div>
                                            </div>

                                            {/* Rule Config */}
                                            {modalForm.dueDateOption === 'applyRule' && (
                                                <div className="col-md-5">
                                                    <label className="form-label fw-medium mb-1 small">Rule Configuration</label>
                                                    <div className="input-group">
                                                        <input
                                                            className="form-control"
                                                            placeholder="Enter Days"
                                                            style={{
                                                                borderRadius: '6px 0 0 6px',
                                                                border: '1px solid #dee2e6',
                                                                fontSize: '0.9rem',
                                                            }}
                                                            value={modalForm.ruleDays}
                                                            onChange={(e) =>
                                                                setModalForm((prev) => ({
                                                                    ...prev,
                                                                    ruleDays: e.target.value,
                                                                }))
                                                            }
                                                        />

                                                        {/* Rule Radios */}
                                                        <div
                                                            className="align-items-center px-3"
                                                            style={{
                                                                border: '1px solid #dee2e6',
                                                                borderLeft: 'none',
                                                                borderRadius: '0 6px 6px 0',
                                                                fontSize: '0.9rem',
                                                                gap: '1rem',
                                                            }}
                                                        >
                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    id="after"
                                                                    name="applyRule"
                                                                    value="after"
                                                                    className="form-check-input"
                                                                    checked={modalForm.applyRule === 'after'}
                                                                    onChange={(e) =>
                                                                        setModalForm((prev) => ({
                                                                            ...prev,
                                                                            applyRule: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                                <label htmlFor="after" className="form-check-label">
                                                                    days after period ends
                                                                </label>
                                                            </div>

                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    id="before"
                                                                    name="applyRule"
                                                                    value="before"
                                                                    className="form-check-input"
                                                                    checked={modalForm.applyRule === 'before'}
                                                                    onChange={(e) =>
                                                                        setModalForm((prev) => ({
                                                                            ...prev,
                                                                            applyRule: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                                <label htmlFor="before" className="form-check-label">
                                                                    days before period ends
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary px-4"
                                                                onClick={() => {
                                                                    setSavedConfig({
                                                                        dueDateOption: modalForm.dueDateOption,
                                                                        dueDate: modalForm.dueDate,
                                                                        applyRule: modalForm.applyRule,
                                                                        ruleDays: modalForm.ruleDays,
                                                                    });
                                                                    setModalForm((prev) => ({
                                                                        ...prev,
                                                                        dueDateOption: modalForm.dueDateOption,
                                                                        dueDate: modalForm.dueDate,
                                                                        applyRule: modalForm.applyRule,
                                                                        ruleDays: modalForm.ruleDays,
                                                                    }));
                                                                }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Select Date */}
                                            {modalForm.dueDateOption === 'selectDate' && (
                                                <>
                                                    <div className="col-md-2">
                                                        <label className="form-label fw-medium mb-1 small">Select Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            style={{
                                                                borderRadius: '6px',
                                                                border: '1px solid #dee2e6',
                                                                fontSize: '0.9rem',
                                                            }}
                                                            value={modalForm.dueDate}
                                                            onChange={(e) =>
                                                                setModalForm((prev) => ({
                                                                    ...prev,
                                                                    dueDate: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-md-1" style={{ marginTop: "37px" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary px-4"
                                                            onClick={() => {
                                                                setSavedConfig({
                                                                    dueDateOption: modalForm.dueDateOption,
                                                                    dueDate: modalForm.dueDate,
                                                                    applyRule: modalForm.applyRule,
                                                                    ruleDays: modalForm.ruleDays,
                                                                });
                                                                setModalForm((prev) => ({
                                                                    ...prev,
                                                                    dueDateOption: modalForm.dueDateOption,
                                                                    dueDate: modalForm.dueDate,
                                                                    applyRule: modalForm.applyRule,
                                                                    ruleDays: modalForm.ruleDays,
                                                                }));
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="row mt-3">
                                            <div className="d-flex justify-content-between align-items-start w-100">
                                                {/* Saved Config Display */}
                                                {savedConfig && (
                                                    <div className="col-md-6 col-lg-4">
                                                        <div
                                                            className="h-100 p-3 shadow-sm"
                                                            style={{
                                                                borderRadius: '12px',
                                                                backgroundColor: 'white',
                                                                border: '1px solid #e9ecef',
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="p-2 rounded-circle bg-light">
                                                                        <i className="fas fa-bell" style={{ color: '#4a90a4' }}></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-semibold">
                                                                            {savedConfig?.dueDateOption === 'applyRule'
                                                                                ? `${savedConfig?.ruleDays} days ${savedConfig?.applyRule} period ends`
                                                                                : `On ${savedConfig?.dueDate}`}
                                                                        </div>
                                                                        <small className="text-muted">Due Date Config</small>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                                    style={{ width: '32px', height: '32px' }}
                                                                    onClick={() => {
                                                                        setSavedConfig(null);
                                                                        // Clear due date configuration
                                                                        setModalForm((prev) => ({
                                                                            ...prev,
                                                                            dueDateOption: '',
                                                                            dueDate: '',
                                                                            applyRule: '',
                                                                            ruleDays: '',
                                                                        }));
                                                                    }}
                                                                    aria-label="Remove due date configuration"
                                                                >
                                                                    <i className="fas fa-trash" style={{ fontSize: '0.75rem' }}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Sections - Compact Layout */}
                                <div className="p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            {renderNotificationSection('sustainabilityInsights', 'Sustainability Insights Notifications', '40, 144, 164')}
                                        </div>
                                        <div className="col-md-12">
                                            {renderNotificationSection('dataOwner', 'Data Owner Notifications', '40, 144, 164')}
                                        </div>
                                        <div className="col-md-12">
                                            {renderNotificationSection('auditor', 'Auditor Notifications', '23, 162, 184')}
                                        </div>
                                        <div className="col-md-12">
                                            {renderNotificationSection('admin', 'Admin Summary', '255, 193, 7')}
                                        </div>
                                        <div className="col-md-12">
                                            {renderNotificationSection('dataOwnerAppreciation', 'Data Owner Appreciation Summary', '220, 53, 69')}
                                        </div>
                                        <div className="col-md-12">
                                            {renderNotificationSection('auditorAppreciation', 'Auditor Appreciation Notifications', '220, 53, 69')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Compact */}
                            <div className="modal-footer border-0 p-3" style={{ backgroundColor: '#f8fafc' }}>
                                <div className="w-100 d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-3 py-2"
                                        style={{
                                            borderRadius: '6px',
                                            fontSize: '0.9rem'
                                        }}
                                        onClick={() => setShowModal(false)}
                                    >
                                        <i className="fas fa-times me-1"></i>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn px-3 py-2"
                                        style={{
                                            borderRadius: '6px',
                                            backgroundColor: '#4a90a4',
                                            borderColor: '#4a90a4',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                        onClick={handleModalSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span>{isEditMode ? 'Updating...' : 'Saving...'}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-1"></i>
                                                {isEditMode ? 'Update Notifications' : 'Save Notifications'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Single Notification Modal - Updated with Time Configuration */}
            {showAddNotificationModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <span>Add Notification</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddNotificationModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Rule based Configuration:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g., 7"
                                        value={addNotificationData.notificationDays}
                                        onChange={(e) => setAddNotificationData(prev => ({
                                            ...prev,
                                            notificationDays: e.target.value
                                        }))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Rule Type:</label>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className={`btn flex-fill ${addNotificationData.ruleType === 'after' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setAddNotificationData(prev => ({
                                                ...prev,
                                                ruleType: 'after'
                                            }))}
                                        >
                                            days after Due Date ends
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn flex-fill ${addNotificationData.ruleType === 'before' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setAddNotificationData(prev => ({
                                                ...prev,
                                                ruleType: 'before'
                                            }))}
                                        >
                                            days before Due Date ends
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Frequency:</label>
                                    <select
                                        className="form-select"
                                        value={addNotificationData.recurring}
                                        onChange={(e) => setAddNotificationData(prev => ({
                                            ...prev,
                                            recurring: e.target.value,
                                            // Reset time fields and day when frequency changes
                                            fixedTime: '',

                                            fromTime: "00:00",
                                            toTime: "23:59",

                                        }))}
                                    >
                                        <option value="">Select Frequency</option>
                                        <option value="once">Once Only</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>

                                {/* Day Selection for Weekly */}
                                {/* {addNotificationData.recurring === 'weekly' && (
                                    <div className="mb-3">
                                        <label className="form-label">Day:</label>
                                        <select
                                            className="form-select"
                                            value={addNotificationData.selectedDay}
                                            onChange={(e) => setAddNotificationData(prev => ({
                                                ...prev,
                                                selectedDay: e.target.value
                                            }))}
                                        >
                                            <option value="">Choose Day</option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                            <option value="saturday">Saturday</option>
                                            <option value="sunday">Sunday</option>
                                        </select>
                                    </div>
                                )} */}

                                {/* Time Configuration for Add Single Notification */}
                                {addNotificationData.recurring && (
                                    <>
                                        {addNotificationData.recurring === 'hourly' ? (
                                            <>
                                                <div className="mb-3">
                                                    <label className="form-label">From Time:</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={addNotificationData.fromTime}
                                                        onChange={(e) => setAddNotificationData(prev => ({
                                                            ...prev,
                                                            fromTime: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">To Time:</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={addNotificationData.toTime}
                                                        onChange={(e) => setAddNotificationData(prev => ({
                                                            ...prev,
                                                            toTime: e.target.value
                                                        }))}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mb-3">
                                                <label className="form-label">Fixed Time:</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={addNotificationData.fixedTime}
                                                    onChange={(e) => setAddNotificationData(prev => ({
                                                        ...prev,
                                                        fixedTime: e.target.value
                                                    }))}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddNotificationModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddSingleNotification}
                                    disabled={
                                        isLoading ||
                                        !addNotificationData.notificationDays ||
                                        !addNotificationData.recurring ||
                                        (addNotificationData.recurring === 'hourly'
                                            ? (!addNotificationData.fromTime || !addNotificationData.toTime)
                                            : !addNotificationData.fixedTime
                                        )
                                    }
                                >
                                    {isLoading ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <span>Adding...</span>
                                        </div>
                                    ) : (
                                        'Add Notification'
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

export default EmailNotificationsAndDueDate;