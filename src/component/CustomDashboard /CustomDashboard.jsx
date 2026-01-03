import React, { useEffect, useState, useCallback } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { X, Minimize2, Maximize2, Plus, RefreshCw } from 'lucide-react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { ChartFactory, formatSeries } from "../AIDashboard/AIDashboard/utils";

const styles = {
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderBottom: '1px solid #e5e7eb'
    },
    modalHeaderTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: 0
    },
    modalHeaderActions: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    },
    iconButton: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'white',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
    },
    mainContainer: {
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        height: '75vh'
    },
    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    sidebar: {
        width: '30%',
        backgroundColor: 'white',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.05)'
    },
    sidebarHeader: {
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fafafa'
    },
    sidebarTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0
    },
    sidebarContent: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
    },
    chatContainer: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0'
    },
    messagesArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '0'
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f3f4f6'
    },
    chartTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937',
        margin: 0
    },
    chartDescription: {
        fontSize: '13px',
        color: '#6b7280',
        margin: '4px 0 0 0'
    },
    actionButton: {
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    createButton: {
        backgroundColor: '#3f88a5',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
    },
    emptyStateIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    emptyStateTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '8px'
    },
    emptyStateText: {
        fontSize: '15px',
        color: '#6b7280',
        marginBottom: '20px'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '16px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #3f88a5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    errorContainer: {
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        color: '#991b1b',
        fontSize: '14px',
        margin: '16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    formGroup: {
        marginBottom: '16px'
    },
    formLabel: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '6px',
        display: 'block'
    },
    formInput: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    formTextarea: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        minHeight: '80px',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#3f88a5',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    sectionHeader: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#1f2937',
        marginTop: '24px',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '2px solid #e5e7eb'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    checkboxLabel: {
        fontSize: '14px',
        color: '#374151',
        cursor: 'pointer',
        userSelect: 'none'
    },
    infoText: {
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '4px',
        fontStyle: 'italic'
    },
    formInputError: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #dc2626',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    errorMessage: {
        color: '#dc2626',
        fontSize: '12px',
        marginTop: '4px',
        display: 'block',
        fontWeight: '500'
    },
    requiredIndicator: {
        color: '#dc2626',
        marginLeft: '2px'
    }
};

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#3f88a5' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 1px #3f88a5' : 'none',
        '&:hover': {
            borderColor: '#3f88a5'
        }
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e0f2fe'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#0c4a6e'
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#0c4a6e',
        '&:hover': {
            backgroundColor: '#bae6fd',
            color: '#0c4a6e'
        }
    })
};

const getCustomSelectStyles = (hasError) => ({
    control: (provided, state) => ({
        ...provided,
        borderColor: hasError ? '#dc2626' : (state.isFocused ? '#3f88a5' : '#d1d5db'),
        boxShadow: state.isFocused ? `0 0 0 1px ${hasError ? '#dc2626' : '#3f88a5'}` : 'none',
        '&:hover': {
            borderColor: hasError ? '#dc2626' : '#3f88a5'
        }
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#e0f2fe'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#0c4a6e'
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#0c4a6e',
        '&:hover': {
            backgroundColor: '#bae6fd',
            color: '#0c4a6e'
        }
    })
});

const getPeriodsForFinancialYears = (selectedFinancialYears, graphFilters) => {
    if (!selectedFinancialYears || selectedFinancialYears.length === 0 || !graphFilters) {
        return [];
    }
    const financialYearsData = graphFilters['Financial Years'] || {};
    
    if (selectedFinancialYears.length === 1) {
        const fyValue = selectedFinancialYears[0].value || selectedFinancialYears[0];
        const periodsArray = financialYearsData[fyValue];
        if (periodsArray && Array.isArray(periodsArray)) {
            const uniquePeriods = [];
            const seenValues = new Set();
            periodsArray.forEach(period => {
                if (period && period.value && !seenValues.has(period.value)) {
                    uniquePeriods.push(period);
                    seenValues.add(period.value);
                }
            });
            return uniquePeriods;
        }
        return [];
    }
    
    let fyWithMinPeriods = null;
    let minPeriodCount = Infinity;
    
    selectedFinancialYears.forEach(fy => {
        const fyValue = fy.value || fy;
        const periodsArray = financialYearsData[fyValue];
        
        if (periodsArray && Array.isArray(periodsArray)) {
            const periodCount = periodsArray.length;
            
            if (periodCount > 0 && periodCount < minPeriodCount) {
                minPeriodCount = periodCount;
                fyWithMinPeriods = fyValue;
            }
        }
    });
    
    if (fyWithMinPeriods && financialYearsData[fyWithMinPeriods]) {
        const periodsArray = financialYearsData[fyWithMinPeriods];
        const uniquePeriods = [];
        const seenValues = new Set();
        
        periodsArray.forEach(period => {
            if (period && period.value && !seenValues.has(period.value)) {
                uniquePeriods.push(period);
                seenValues.add(period.value);
            }
        });
        
        return uniquePeriods;
    }
    
    return [];
};

// Helper function to get all sublocations from selected locations
const getSubLocationsForLocations = (selectedLocations, allLocations) => {
    if (!allLocations || !Array.isArray(allLocations)) {
        return [];
    }
    
    const subLocationsSet = new Set();
    const subLocationsList = [];
    
    // If no locations are selected, treat it as ALL locations selected
    const locationsToProcess = selectedLocations && selectedLocations.length > 0 
        ? selectedLocations 
        : allLocations;
    
    locationsToProcess.forEach(selectedLoc => {
        // Handle both cases: when it's already a full location object or just a selection
        const locationValue = selectedLoc.value || selectedLoc;
        const locationData = selectedLoc.subLocations 
            ? selectedLoc 
            : allLocations.find(loc => loc.value === locationValue);
        
        if (locationData && locationData.subLocations && Array.isArray(locationData.subLocations)) {
            locationData.subLocations.forEach(subLoc => {
                if (subLoc && subLoc.value && !subLocationsSet.has(subLoc.value)) {
                    subLocationsList.push(subLoc);
                    subLocationsSet.add(subLoc.value);
                }
            });
        }
    });
    
    return subLocationsList;
};

const CreateGraphSidebar = ({ show, onClose, onSubmit, filterOptions, editingGraph }) => {
    const isEditMode = !!editingGraph;
    const [formData, setFormData] = useState({
        title: editingGraph?.title || '',
        description: editingGraph?.description || '',
        chartType: editingGraph?.chartType || 'bar',
        xAxisField: editingGraph?.xAxisField || 'displayPeriods',
        stackByField: editingGraph?.stackByField || null,
        enableStacking: !!editingGraph?.stackByField,
        widgetConfig: editingGraph?.widgetConfig || {
            module: [],
            filters: {
                financial_year: [],
                location_id: [],
                sublocation_id: [],
                category: [],
                sub_category: [],
                kpi: [],
                displayPeriods: []
            },
            group_by: ['displayPeriods'],
            aggregate: { sum: 'value' },
            sort: { field: 'displayPeriods', order: 'asc' },
            aggregateSubLocations: true
        }
    });

    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);
    const [availableKpis, setAvailableKpis] = useState([]);
    const [availablePeriods, setAvailablePeriods] = useState([]);
    const [isPeriodDisabled, setisPeriodDisabled] = useState(false);
    const [availableSubLocations, setAvailableSubLocations] = useState([]);
    
    const [validationErrors, setValidationErrors] = useState({});

    // Check if location is used in axes
    const isLocationInAxes = formData.xAxisField === 'location_id' || formData.stackByField === 'location_id';

    useEffect(() => {
        if (isEditMode && editingGraph && filterOptions.locations) {
            const moduleArray = Array.isArray(editingGraph.widgetConfig?.module)
                ? editingGraph.widgetConfig.module.map(m => typeof m === 'string' ? { value: m, label: m } : m)
                : [];
            const financialYearArray = Array.isArray(editingGraph.widgetConfig?.filters?.financial_year)
                ? editingGraph.widgetConfig.filters.financial_year.map(f => typeof f === 'string' ? { value: f, label: f } : f)
                : [];

            const locationArray = Array.isArray(editingGraph.widgetConfig?.filters?.location_id)
                ? editingGraph.widgetConfig.filters.location_id.map(l => {
                    const locValue = typeof l === 'string' ? l : l.value;
                    const foundLocation = filterOptions.locations.find(loc => loc.value === locValue);
                    return foundLocation || { value: locValue, label: locValue };
                })
                : [];

            const subLocationArray = Array.isArray(editingGraph.widgetConfig?.filters?.sublocation_id)
                ? editingGraph.widgetConfig.filters.sublocation_id.map(sl => {
                    const subLocValue = typeof sl === 'string' ? sl : sl.value;
                    // Search through all locations to find the sublocation
                    let foundSubLocation = null;
                    for (const location of filterOptions.locations) {
                        if (location.subLocations && Array.isArray(location.subLocations)) {
                            foundSubLocation = location.subLocations.find(subLoc => subLoc.value === subLocValue);
                            if (foundSubLocation) break;
                        }
                    }
                    return foundSubLocation || { value: subLocValue, label: subLocValue };
                })
                : [];

            const categoryArray = Array.isArray(editingGraph.widgetConfig?.filters?.category)
                ? editingGraph.widgetConfig.filters.category.map(c => typeof c === 'string' ? { value: c, label: c } : c)
                : [];
            const subCategoryArray = Array.isArray(editingGraph.widgetConfig?.filters?.sub_category)
                ? editingGraph.widgetConfig.filters.sub_category.map(sc => typeof sc === 'string' ? { value: sc, label: sc } : sc)
                : [];
            const kpiArray = Array.isArray(editingGraph.widgetConfig?.filters?.kpi)
                ? editingGraph.widgetConfig.filters.kpi.map(k => typeof k === 'string' ? { value: k, label: k } : k)
                : [];
            const displayPeriodsArray = Array.isArray(editingGraph.widgetConfig?.filters?.displayPeriods)
                ? editingGraph.widgetConfig.filters.displayPeriods.map(p => typeof p === 'string' ? { value: p, label: p } : p)
                : [];

            setFormData({
                title: editingGraph.title || '',
                description: editingGraph.description || '',
                chartType: editingGraph.chartType || 'bar',
                xAxisField: editingGraph.xAxisField || 'displayPeriods',
                stackByField: editingGraph.stackByField || null,
                enableStacking: !!editingGraph.stackByField,
                widgetConfig: {
                    module: moduleArray,
                    filters: {
                        financial_year: financialYearArray,
                        location_id: locationArray,
                        sublocation_id: subLocationArray,
                        category: categoryArray,
                        sub_category: subCategoryArray,
                        kpi: kpiArray,
                        displayPeriods: displayPeriodsArray
                    },
                    group_by: editingGraph.widgetConfig?.group_by || ['displayPeriods'],
                    aggregate: editingGraph.widgetConfig?.aggregate || { sum: 'value' },
                    sort: editingGraph.widgetConfig?.sort || { field: 'displayPeriods', order: 'asc' },
                    aggregateSubLocations: editingGraph.widgetConfig?.aggregateSubLocations !== undefined 
                        ? editingGraph.widgetConfig.aggregateSubLocations 
                        : true
                }
            });
            setValidationErrors({});
        }
    }, [isEditMode, editingGraph, filterOptions.locations]);
    useEffect(() => {
        if (!filterOptions.graphFilters) return;
        const selectedModules = formData.widgetConfig.module.map(m => m.value);
        if (selectedModules.length === 0) {
            setAvailableCategories([]);
            setAvailableSubCategories([]);
            setAvailableKpis([]);
            return;
        }
        const categoriesSet = new Set();
        selectedModules.forEach(module => {
            if (filterOptions.graphFilters[module]) {
                Object.keys(filterOptions.graphFilters[module]).forEach(cat => {
                    categoriesSet.add(cat);
                });
            }
        });
        const categories = Array.from(categoriesSet).map(cat => ({ value: cat, label: cat }));
        setAvailableCategories(categories);
        const selectedCategories = formData.widgetConfig.filters.category.map(c => c.value);
        
        const categoriesToUse = selectedCategories.length > 0 ? selectedCategories : Array.from(categoriesSet);
        
        const subCategoriesSet = new Set();
        selectedModules.forEach(module => {
            if (filterOptions.graphFilters[module]) {
                categoriesToUse.forEach(category => {
                    if (filterOptions.graphFilters[module][category]) {
                        Object.keys(filterOptions.graphFilters[module][category]).forEach(subCat => {
                            subCategoriesSet.add(subCat);
                        });
                    }
                });
            }
        });
        const subCategories = Array.from(subCategoriesSet).map(subCat => ({ value: subCat, label: subCat }));
        setAvailableSubCategories(subCategories);
        
        const selectedSubCategories = formData.widgetConfig.filters.sub_category.map(sc => sc.value);
        
        const subCategoriesToUse = selectedSubCategories.length > 0 ? selectedSubCategories : Array.from(subCategoriesSet);
        
        const kpisSet = new Set();
        selectedModules.forEach(module => {
            if (filterOptions.graphFilters[module]) {
                categoriesToUse.forEach(category => {
                    if (filterOptions.graphFilters[module][category]) {
                        subCategoriesToUse.forEach(subCategory => {
                            if (filterOptions.graphFilters[module][category][subCategory]) {
                                filterOptions.graphFilters[module][category][subCategory].forEach(kpi => {
                                    kpisSet.add(kpi);
                                });
                            }
                        });
                    }
                });
            }
        });
        const kpis = Array.from(kpisSet).map(kpi => ({ value: kpi, label: kpi }));
        setAvailableKpis(kpis);
    }, [
        formData.widgetConfig.module,
        formData.widgetConfig.filters.category,
        formData.widgetConfig.filters.sub_category,
        filterOptions.graphFilters
    ]);

    useEffect(() => {
        const selectedFinancialYears = formData.widgetConfig.filters.financial_year;
        if (selectedFinancialYears.length === 0 || !filterOptions.graphFilters) {
            setAvailablePeriods([]);
            return;
        }
        const periods = getPeriodsForFinancialYears(selectedFinancialYears, filterOptions.graphFilters);
        setAvailablePeriods(periods);
    }, [formData.widgetConfig.filters.financial_year, filterOptions.graphFilters]);

    // Update available sublocations based on selected locations
    useEffect(() => {
        const selectedLocations = formData.widgetConfig.filters.location_id;
        if (!filterOptions.locations) {
            setAvailableSubLocations([]);
            return;
        }
        // If no locations selected, show ALL sublocations (treat as "all locations selected")
        const subLocations = getSubLocationsForLocations(selectedLocations, filterOptions.locations);
        setAvailableSubLocations(subLocations);
    }, [formData.widgetConfig.filters.location_id, filterOptions.locations]);

    const handleFinancialYearChange = (selected) => {
        setFormData(prev => {
            const hasPeriods = prev.widgetConfig.filters.displayPeriods.length > 0;
            const shouldReset = selected && selected.length > 0 && hasPeriods;
            
            return {
                ...prev,
                widgetConfig: {
                    ...prev.widgetConfig,
                    filters: {
                        ...prev.widgetConfig.filters,
                        financial_year: selected || [],
                        displayPeriods: shouldReset ? [] : prev.widgetConfig.filters.displayPeriods
                    }
                }
            };
        });
        if (validationErrors.financial_year) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.financial_year;
                return newErrors;
            });
        }
    };

    const handleLocationChange = (selected) => {
        setFormData(prev => {
            const hasSubLocations = prev.widgetConfig.filters.sublocation_id.length > 0;
            const previousLocationCount = prev.widgetConfig.filters.location_id.length;
            const newLocationCount = selected ? selected.length : 0;
            
            // Reset sublocations if location selection changed and there are sublocations selected
            const shouldReset = hasSubLocations && (previousLocationCount !== newLocationCount);
            
            return {
                ...prev,
                widgetConfig: {
                    ...prev.widgetConfig,
                    filters: {
                        ...prev.widgetConfig.filters,
                        location_id: selected || [],
                        sublocation_id: shouldReset ? [] : prev.widgetConfig.filters.sublocation_id
                    }
                }
            };
        });
    };

    const handleModuleChange = (selected) => {
        const selectedValue = selected?.[0]?.value;
        const isTraining = selectedValue === 'Training';

        // Disable the Period filter selection
        setisPeriodDisabled(isTraining);

        setFormData(prev => {
            const { category, sub_category, kpi } = prev.widgetConfig.filters;
            const shouldReset = selected?.length && (category.length || sub_category.length || kpi.length);

            return {
                ...prev,
                widgetConfig: {
                    ...prev.widgetConfig,
                    module: selected || [],
                    filters: {
                        ...prev.widgetConfig.filters,
                        category: shouldReset ? [] : category,
                        sub_category: shouldReset ? [] : sub_category,
                        kpi: shouldReset ? [] : kpi
                    }
                }
            };
        });

        // ⚠️ INSTANT WARNING: Check if current axis selections conflict with Training module
        setValidationErrors(prev => {
            const copy = { ...prev };
            
            if (isTraining && formData.xAxisField === 'displayPeriods') {
                copy.xAxisField = 'Period option is not available for Training module';
            } else {
                delete copy.xAxisField;
            }

            if (isTraining && formData.stackByField === 'displayPeriods') {
                copy.stackByField = 'Period option is not available for Training module';
            } else {
                delete copy.stackByField;
            }

            delete copy.module;
            return copy;
        });
    };


    const handleCategoryChange = (selected) => {
        setFormData(prev => {
            const hasSubCategory = prev.widgetConfig.filters.sub_category.length > 0;
            const hasKpi = prev.widgetConfig.filters.kpi.length > 0;
            const shouldReset = selected && selected.length > 0 && (hasSubCategory || hasKpi);
            
            return {
                ...prev,
                widgetConfig: {
                    ...prev.widgetConfig,
                    filters: {
                        ...prev.widgetConfig.filters,
                        category: selected || [],
                        sub_category: shouldReset ? [] : prev.widgetConfig.filters.sub_category,
                        kpi: shouldReset ? [] : prev.widgetConfig.filters.kpi
                    }
                }
            };
        });
    };

    const handleSubCategoryChange = (selected) => {
        setFormData(prev => {
            const hasKpi = prev.widgetConfig.filters.kpi.length > 0;
            const shouldReset = selected && selected.length > 0 && hasKpi;
            
            return {
                ...prev,
                widgetConfig: {
                    ...prev.widgetConfig,
                    filters: {
                        ...prev.widgetConfig.filters,
                        sub_category: selected || [],
                        kpi: shouldReset ? [] : prev.widgetConfig.filters.kpi
                    }
                }
            };
        });
    };

    const getAxisFieldOptions = () => {
        const selectedModules = formData.widgetConfig.module.map(m => m.value);
        const isTrainingSelected = selectedModules.includes("Training");

        return [
            {
                value: 'displayPeriods',
                label: 'Period',
                disabled: isTrainingSelected   // 🔑 KEY FIX
            },
            { value: 'financial_year', label: 'Financial Year' },
            { value: 'location_id', label: 'Location' },
            { value: 'module', label: 'Module' },
            { value: 'category', label: 'Category' },
            { value: 'sub_category', label: 'Sub Category' },
            { value: 'kpi', label: 'KPI' }
        ];
    };


    const axisFieldOptions = getAxisFieldOptions();

    const validateForm = () => {
        const errors = {};
        const selectedModules = formData.widgetConfig.module.map(m => m.value);
        const isTraining = selectedModules.includes('Training');

        if (!formData.title || formData.title.trim() === '') {
            errors.title = 'Title is required';
        }
         
        if (isTraining && formData.xAxisField === 'displayPeriods') {
            errors.xAxisField = 'Period option is not available for Training module';
        }
        if (isTraining && formData.stackByField === 'displayPeriods') {
            errors.stackByField = 'Period option is not available for Training module';
        }

        if (!formData.chartType) {
            errors.chartType = 'Chart type is required';
        }

        if (!formData.xAxisField) {
            errors.xAxisField = 'X-Axis field is required';
        }

        if (!formData.widgetConfig.module || formData.widgetConfig.module.length === 0) {
            errors.module = 'Module is required';
        }

        if (!formData.widgetConfig.filters.financial_year || formData.widgetConfig.filters.financial_year.length === 0) {
            errors.financial_year = 'Financial year is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const groupByFields = [formData.xAxisField];
        if (formData.enableStacking && formData.stackByField) {
            groupByFields.push(formData.stackByField);
        }
        const submissionData = {
            ...formData,
            widgetConfig: {
                ...formData.widgetConfig,
                module: formData.widgetConfig.module.map(m => m.value || m),
                filters: {
                    financial_year: formData.widgetConfig.filters.financial_year.map(f => f.value || f),
                    location_id: formData.widgetConfig.filters.location_id.map(l => l.value || l),
                    sublocation_id: formData.widgetConfig.filters.sublocation_id.map(sl => sl.value || sl),
                    category: formData.widgetConfig.filters.category.map(c => c.value || c),
                    sub_category: formData.widgetConfig.filters.sub_category.map(sc => sc.value || sc),
                    kpi: formData.widgetConfig.filters.kpi.map(k => k.value || k),
                    displayPeriods: formData.widgetConfig.filters.displayPeriods.map(p => p.value || p)
                },
                group_by: groupByFields,
                sort: { field: formData.xAxisField, order: 'asc' },
                aggregateSubLocations: formData.widgetConfig.aggregateSubLocations
            }
        };
        onSubmit(submissionData);
    };

    const handleStackingToggle = (checked) => {
        setFormData({
            ...formData,
            enableStacking: checked,
            stackByField: checked ? formData.stackByField : null
        });
    };

    const handleXAxisChange = (value) => {
        const selectedModules = formData.widgetConfig.module.map(m => m.value);
        const isTraining = selectedModules.includes('Training');

        // ⚠️ WARNING: If user tries to select Period while Training is active
        if (isTraining && value === 'displayPeriods') {
            setValidationErrors(prev => ({
                ...prev,
                xAxisField: 'Period option is not available for Training module'
            }));
        } else {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.xAxisField;
                return newErrors;
            });
        }

        const newFormData = { 
            ...formData, 
            xAxisField: value,
            widgetConfig: {
                ...formData.widgetConfig,
                aggregateSubLocations: value === 'location_id' ? true : formData.widgetConfig.aggregateSubLocations
            }
        };

        if (formData.enableStacking && formData.stackByField === value) {
            newFormData.stackByField = null;
        }
        setFormData(newFormData);
    };

    const handleStackByFieldChange = (value) => {
        const selectedModules = formData.widgetConfig.module.map(m => m.value);
        const isTraining = selectedModules.includes('Training');

        // ⚠️ WARNING: If user tries to select Period while Training is active
        if (isTraining && value === 'displayPeriods') {
            setValidationErrors(prev => ({
                ...prev,
                stackByField: 'Period option is not available for Training module'
            }));
        } else {
            setValidationErrors(prev => {
                const copy = { ...prev };
                delete copy.stackByField;
                return copy;
            });
        }

        setFormData(prev => ({
            ...prev,
            stackByField: value,
            widgetConfig: {
                ...prev.widgetConfig,
                aggregateSubLocations: value === 'location_id' ? true : prev.widgetConfig.aggregateSubLocations
            }
        }));
    };


    useEffect(() => {
        if (!show) {
            setValidationErrors({});
        }
    }, [show]);

    if (!show) return null;

    return (
        <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
                <h3 style={styles.sidebarTitle}>
                    {isEditMode ? 'Edit Graph' : 'Create New Graph'}
                </h3>
                <button
                    style={{ ...styles.iconButton, width: '32px', height: '32px' }}
                    onClick={onClose}
                    title="Close"
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.borderColor = '#fecaca';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                >
                    <X size={18} color="#6b7280" />
                </button>
            </div>

            <div style={styles.sidebarContent}>
                <div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                            Title<span style={styles.requiredIndicator}>*</span>
                        </label>
                        <input
                            type="text"
                            style={validationErrors.title ? styles.formInputError : styles.formInput}
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value });
                                if (validationErrors.title) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.title;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                            placeholder="Enter graph title"
                        />
                        {validationErrors.title && (
                            <span style={styles.errorMessage}>{validationErrors.title}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Description</label>
                        <textarea
                            style={styles.formTextarea}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter graph description"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                            Chart Type<span style={styles.requiredIndicator}>*</span>
                        </label>
                        <select
                            style={validationErrors.chartType ? styles.formInputError : styles.formInput}
                            value={formData.chartType}
                            onChange={(e) => {
                                setFormData({ ...formData, chartType: e.target.value });
                                if (validationErrors.chartType) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.chartType;
                                        return newErrors;
                                    });
                                }
                            }}
                            required
                        >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="area">Area Chart</option>
                            <option value="pie">Pie Chart</option>
                        </select>
                        {validationErrors.chartType && (
                            <span style={styles.errorMessage}>{validationErrors.chartType}</span>
                        )}
                    </div>

                    <div style={styles.sectionHeader}>Chart Configuration</div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                            X-Axis Field<span style={styles.requiredIndicator}>*</span>
                        </label>
                        <select
                            style={validationErrors.xAxisField ? styles.formInputError : styles.formInput}
                            value={formData.xAxisField}
                            onChange={(e) => handleXAxisChange(e.target.value)}
                            required
                        >
                            {axisFieldOptions.map(opt => (
                                <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
                            ))}
                        </select>
                        {validationErrors.xAxisField && (
                            <span style={styles.errorMessage}>{validationErrors.xAxisField}</span>
                        )}
                        <div style={styles.infoText}>Select which field to display on the X-axis</div>
                    </div>

                    <div style={styles.formGroup}>
                        <div style={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="enableStacking"
                                style={styles.checkbox}
                                checked={formData.enableStacking}
                                onChange={(e) => handleStackingToggle(e.target.checked)}
                            />
                            <label htmlFor="enableStacking" style={styles.checkboxLabel}>
                                Enable Stacking
                            </label>
                        </div>
                       
                        <div style={styles.infoText}>
                            Stack data by another dimension for comparative analysis
                        </div>
                    </div>

                    {formData.enableStacking && (
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Stack By Field *</label>
                            <select
                                style={styles.formInput}
                                value={formData.stackByField || ''}
                                onChange={(e) => handleStackByFieldChange(e.target.value)}
                                required={formData.enableStacking}
                            >
                                <option value="">Select field to stack by</option>
                                {axisFieldOptions
                                    .filter(opt => opt.value !== formData.xAxisField)
                                    .map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                            </select>
                            {validationErrors.stackByField && (
                                <span style={styles.errorMessage}>{validationErrors.stackByField}</span>
                            )}
                            <div style={styles.infoText}>Data will be grouped and stacked by this field</div>
                        </div>
                    )}

                    {/* Aggregate SubLocations Checkbox - Only shown when Location is in axes */}
                    {isLocationInAxes && (
                        <div style={styles.formGroup}>
                            <div style={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="aggregateSubLocations"
                                    style={styles.checkbox}
                                    checked={formData.widgetConfig.aggregateSubLocations}
                                    onChange={(e) => {
                                        const checked = e.target.checked;

                                        setFormData(prev => ({
                                            ...prev,
                                            widgetConfig: {
                                                ...prev.widgetConfig,
                                                aggregateSubLocations: checked
                                            }
                                        }))}
                                    }
                                />
                                <label htmlFor="aggregateSubLocations" style={styles.checkboxLabel}>
                                    Aggregate SubLocations
                                </label>
                            </div>
                            <div style={styles.infoText}>
                                When enabled, location values will include aggregated data from all sublocations
                            </div>
                        </div>
                    )}

                    <div style={styles.sectionHeader}>Filters</div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                            Module<span style={styles.requiredIndicator}>*</span>
                        </label>
                        <select
                            style={validationErrors.module ? styles.formInputError : styles.formInput}
                            value={formData.widgetConfig.module.length > 0 ? formData.widgetConfig.module[0].value : ''}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (selectedValue) {
                                    if(selectedValue==="Training"){
                                        setisPeriodDisabled(true)
                                    }
                                    handleModuleChange([{ value: selectedValue, label: selectedValue }]);
                                } else {
                                    handleModuleChange([]);
                                }
                            }}
                            required
                        >
                            <option value="">Select a Module</option>
                            {filterOptions.modules && filterOptions.modules.map(module => (
                                <option key={module.value} value={module.value}>
                                    {module.label}
                                </option>
                            ))}
                        </select>
                        {validationErrors.module && (
                            <span style={styles.errorMessage}>{validationErrors.module}</span>
                        )}
                        <div style={styles.infoText}>Select a module to enable category selection</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Category</label>
                        <Select
                            isMulti
                            options={availableCategories}
                            value={formData.widgetConfig.filters.category}
                            onChange={handleCategoryChange}
                            styles={customSelectStyles}
                            placeholder="Select Categories"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>Available based on selected modules</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Sub Category</label>
                        <Select
                            isMulti
                            options={availableSubCategories}
                            value={formData.widgetConfig.filters.sub_category}
                            onChange={handleSubCategoryChange}
                            styles={customSelectStyles}
                            placeholder="Select Sub Categories"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>Available based on selected categories</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>KPI</label>
                        <Select
                            isMulti
                            options={availableKpis}
                            value={formData.widgetConfig.filters.kpi}
                            onChange={(selected) => setFormData({
                                ...formData,
                                widgetConfig: {
                                    ...formData.widgetConfig,
                                    filters: { ...formData.widgetConfig.filters, kpi: selected || [] }
                                }
                            })}
                            styles={customSelectStyles}
                            placeholder="Select KPIs"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>Available based on selected sub categories</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                            Financial Year<span style={styles.requiredIndicator}>*</span>
                        </label>
                        <Select
                            isMulti
                            options={filterOptions.financialYears}
                            value={formData.widgetConfig.filters.financial_year}
                            onChange={handleFinancialYearChange}
                            styles={getCustomSelectStyles(validationErrors.financial_year)}
                            placeholder="Select Financial Years"
                            closeMenuOnSelect={false}
                        />
                        {validationErrors.financial_year && (
                            <span style={styles.errorMessage}>{validationErrors.financial_year}</span>
                        )}
                        <div style={styles.infoText}>Select financial years to enable period selection</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Period</label>
                        <Select
                            isMulti
                            options={availablePeriods}
                            isDisabled={isPeriodDisabled}
                            value={formData.widgetConfig.filters.displayPeriods}
                            onChange={(selected) => setFormData({
                                ...formData,
                                widgetConfig: {
                                    ...formData.widgetConfig,
                                    filters: { ...formData.widgetConfig.filters, displayPeriods: selected || [] }
                                }
                            })}
                            styles={customSelectStyles}
                            placeholder="Select Periods"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>
                            {isPeriodDisabled
                                ? 'Showing unique trainee headcount for the entire financial year'
                                : 'Showing periods based on selected financial years'}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Location</label>
                        <Select
                            isMulti
                            options={filterOptions.locations}
                            value={formData.widgetConfig.filters.location_id}
                            onChange={handleLocationChange}
                            styles={customSelectStyles}
                            placeholder="Select Locations"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>Leave empty to select all locations</div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Sub Locations</label>
                        <Select
                            isMulti
                            options={availableSubLocations}
                            value={formData.widgetConfig.filters.sublocation_id}
                            onChange={(selected) => setFormData({
                                ...formData,
                                widgetConfig: {
                                    ...formData.widgetConfig,
                                    filters: { ...formData.widgetConfig.filters, sublocation_id: selected || [] }
                                }
                            })}
                            styles={customSelectStyles}
                            placeholder="Select Sub Locations"
                            closeMenuOnSelect={false}
                        />
                        <div style={styles.infoText}>
                            {formData.widgetConfig.filters.location_id.length === 0 
                                ? "Showing all sublocations (all locations selected)" 
                                : "Showing sublocations for selected locations"}
                        </div>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="button"
                            style={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            style={styles.submitButton}
                            onClick={handleSubmit}
                        >
                            {isEditMode ? 'Save Changes' : 'Create Graph'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BiDashboard = ({ isOpen, onClose, editingGraph }) => {
    const [graphs, setGraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [showCreateSidebar, setShowCreateSidebar] = useState(false);

    const [filterOptions, setFilterOptions] = useState({
        modules: [],
        financialYears: [],
        locations: [],
        graphFilters: null
    });

    const fetchFilterOptions = useCallback(async () => {
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/filters`,
                {},
                {},
                "GET"
            );

            if (isSuccess && data.data) {
                const graphFilters = data.data;
                const modules = Object.keys(graphFilters)
                    .filter(key => key !== 'Financial Years' && key !== 'Location')
                    .map(module => ({ value: module, label: module }));

                const financialYearsData = graphFilters['Financial Years'] || {};
                const financialYears = Object.keys(financialYearsData).map(fy => ({
                    value: fy,
                    label: fy
                }));

                const locations = graphFilters['Location'] || [];

                setFilterOptions({
                    modules: modules,
                    financialYears: financialYears,
                    locations: locations,
                    graphFilters: graphFilters
                });
            }
        } catch (error) {
            console.error("Failed to load filter options:", error);
        }
    }, []);

    const getGraphData = useCallback(async (graphId, appliedFilters = {}) => {
        try {
            const { isSuccess: dataSuccess, data: {data: graphData} } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graphId}/data`,
                {},
                appliedFilters,
                "GET"
            );

            if (dataSuccess && graphData.data) {
                return graphData;
            }
        } catch (error) {
            console.error("Error fetching graph data:", error);
        }
        return null;
    }, []);

    const syncGraph = useCallback(async (graphId) => {
        setError("");
        try {
            const { isSuccess: dataSuccess, message: message, data: {data: graphData} } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graphId}/sync`,
                {},
                {},
                "POST"
            );
            if (dataSuccess && graphData.data) {
                const graph = graphs.find(graph => graph.id === graphId);
                const chartData = {
                    data: graphData, 
                    chartType: graph.chartType,
                    xAxisField: graph.xAxisField, 
                    stackByField: graph.stackByField, 
                    title: graph.title,
                };
                setGraphs(prev => prev.map(g =>
                    g.id === graphId ? { ...g, chartData: chartData } : g
                ));
            } else {
                setError(message || "Failed to sync graph");
            }
        } catch (error) {
            setError("Failed to sync graph");
        }
    }, [graphs]);

    const publishGraph = useCallback(async (graphId) => {
        setError("");
        try {
            const { isSuccess, data, message } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graphId}/publish`,
                {},
                {},
                "POST"
            );
            if (isSuccess && data.data) {

            } else {
                setError(message || "Failed to publish graph");
            }
        } catch (error) {
            setError("Failed to publish graph");
        }
    }, []);

    const updateGraph = useCallback(async (graphConfig) => {
        setLoading(true);
        setError("");
        try {
            const { isSuccess, data, message } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${editingGraph.id}`,
                {},
                graphConfig,
                "PUT"
            );

            if (isSuccess && data.data) {
                const graphData = await getGraphData(editingGraph.id);
                const chartData = {
                    data: graphData, 
                    chartType: graphConfig.chartType,
                    xAxisField: graphConfig.xAxisField, 
                    stackByField: graphConfig.stackByField, 
                    title: graphConfig.title,
                };
                setGraphs([{ ...data.data, chartData: chartData }]);
                setShowCreateSidebar(false);
            } else {
                setError(message || "Failed to update graph");
            }
        } catch (error) {
            setError("Failed to update graph");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [editingGraph, getGraphData]);

    const createGraph = useCallback(async (graphConfig) => {
        setLoading(true);
        setError("");
        try {
            const { isSuccess, data, message } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph`,
                {},
                graphConfig,
                "POST",
                false
            );

            if (isSuccess && data.data) {
                const graphData = await getGraphData(data.data.id);
                const chartData = {
                    data: graphData, 
                    chartType: graphConfig.chartType,
                    xAxisField: graphConfig.xAxisField, 
                    stackByField: graphConfig.stackByField, 
                    title: graphConfig.title,
                };
                setGraphs([{ ...data.data, chartData: chartData }]);
            } else {
                setError(message || "Failed to create graph");
            }
        } catch (error) {
            setError("Failed to create graph");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [getGraphData]);

    const handleSubmit = useCallback((graphConfig) => {
        if (editingGraph) {
            updateGraph(graphConfig);
        } else {
            createGraph(graphConfig);
        }
    }, [editingGraph, updateGraph, createGraph]);

    useEffect(() => {
        if (isOpen) {
            fetchFilterOptions();
            if (editingGraph) {
                setShowCreateSidebar(true);
                const fetchEditingGraphData = async () => {
                    setLoading(true);
                    try {
                        const graphData = await getGraphData(editingGraph.id);
                        const chartData = {
                            data: graphData, 
                            chartType: editingGraph.chartType,
                            xAxisField: editingGraph.xAxisField, 
                            stackByField: editingGraph.stackByField, 
                            title: editingGraph.title,
                        };
                        const updatedGraph = {
                            ...editingGraph,
                            chartData: chartData
                        };
                        setGraphs([updatedGraph]);
                    } catch (error) {
                        console.error("Error loading graph data:", error);
                        setGraphs([editingGraph]);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchEditingGraphData();
            } else {
                setGraphs([]);
                setShowCreateSidebar(false);
            }
        }
    }, [isOpen, editingGraph, fetchFilterOptions, getGraphData]);

    return (
        <Modal
            show={isOpen}
            onHide={() => {
                if (!isMinimized) {
                    onClose();
                    setIsMinimized(false);
                }
            }}
            size={isMinimized ? "sm" : "xl"}
            centered
            backdrop={isMinimized ? false : true}
        >
            <div style={styles.modalHeader}>
                <h3 style={styles.modalHeaderTitle}>
                    📊 {editingGraph ? 'Edit Graph' : 'BI Dashboard'}
                </h3>
                <div style={styles.modalHeaderActions}>
                    <button
                        style={styles.createButton}
                        onClick={() => setShowCreateSidebar(!showCreateSidebar)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2c6b7f'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3f88a5'}
                    >
                        <Plus size={18} />
                        {editingGraph ? 'Edit' : 'Create'}
                    </button>
                    <button
                        style={styles.iconButton}
                        onClick={() => setIsMinimized(!isMinimized)}
                        title={isMinimized ? "Maximize" : "Minimize"}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                    >
                        {isMinimized ? <Maximize2 size={18} color="#6b7280" /> : <Minimize2 size={18} color="#6b7280" />}
                    </button>
                    <button
                        style={styles.iconButton}
                        onClick={() => {
                            onClose();
                            setIsMinimized(false);
                        }}
                        title="Close"
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.borderColor = '#fecaca';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        <X size={18} color="#6b7280" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <Modal.Body style={{ padding: 0 }}>
                    <div style={styles.mainContainer}>
                        <div style={{ ...styles.contentArea, width: showCreateSidebar ? '70%' : '100%' }}>
                            <Container style={styles.chatContainer}>
                                <div style={styles.messagesArea}>
                                    {loading && graphs.length === 0 ? (
                                        <div style={styles.loadingContainer}>
                                            <div style={styles.spinner} />
                                            <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                                {editingGraph ? 'Updating graph...' : 'Creating graph...'}
                                            </div>
                                        </div>
                                    ) : error && graphs.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <div style={styles.emptyStateIcon}>⚠️</div>
                                            <div style={styles.emptyStateTitle}>
                                                {editingGraph ? 'Error Updating Graph' : 'Error Creating Graph'}
                                            </div>
                                            <div style={styles.emptyStateText}>{error}</div>
                                        </div>
                                    ) : graphs.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <div style={styles.emptyStateIcon}>📊</div>
                                            <div style={styles.emptyStateTitle}>
                                                {editingGraph ? 'Edit Your Graph' : 'No Graph Created'}
                                            </div>
                                            <div style={styles.emptyStateText}>
                                                {editingGraph
                                                    ? 'Update your graph configuration on the right'
                                                    : 'Click "Create" to build your first BI graph'
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <Row>
                                            <Col lg={11} xl={10} className="mx-auto">
                                                {graphs.map((graph) => (
                                                    <div key={graph.id} style={styles.chartContainer}>
                                                        <div style={styles.chartHeader}>
                                                            <div style={{ flex: 1 }}>
                                                                <h3 style={styles.chartTitle}>{graph.title}</h3>
                                                                {graph.description && (
                                                                    <p style={styles.chartDescription}>
                                                                        {graph.description}
                                                                    </p>
                                                                )}
                                                                <div style={{
                                                                    fontSize: '12px',
                                                                    color: '#9ca3af',
                                                                    marginTop: '6px',
                                                                    display: 'flex',
                                                                    gap: '12px',
                                                                    flexWrap: 'wrap'
                                                                }}>
                                                                    <span>Type: {graph.chartType}</span>
                                                                    {graph.xAxisField && (
                                                                        <span>X-Axis: {graph.xAxisField}</span>
                                                                    )}
                                                                    {graph.stackByField && (
                                                                        <span>Stacked By: {graph.stackByField}</span>
                                                                    )}
                                                                    {graph.widgetConfig?.aggregateSubLocations !== undefined && (
                                                                        <span>Aggregate SubLocations: {graph.widgetConfig.aggregateSubLocations ? 'Yes' : 'No'}</span>
                                                                    )}
                                                                    {graph.lastSyncedAt && (
                                                                        <span>
                                                                            Last synced: {new Date(graph.lastSyncedAt).toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div style={styles.chartHeader}>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button
                                                                        onClick={() => syncGraph(graph.id)}
                                                                        style={styles.actionButton}
                                                                        title="Refresh Graph"
                                                                        onMouseOver={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                                                                            e.currentTarget.style.borderColor = '#d1d5db';
                                                                        }}
                                                                        onMouseOut={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                                                        }}
                                                                    >
                                                                        🔄
                                                                    </button>
                                                                    <button
                                                                        onClick={() => publishGraph(graph.id)}
                                                                        style={styles.actionButton}
                                                                        title="Publish Graph"
                                                                        onMouseOver={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                                                                            e.currentTarget.style.borderColor = '#d1d5db';
                                                                        }}
                                                                        onMouseOut={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                                                        }}
                                                                    >
                                                                        📤
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {graph.chartData ? (
                                                            <ChartFactory
                                                                chartData={graph.chartData}
                                                                chartOptions={{
                                                                    height: 450,
                                                                    stacked: !!graph.stackByField,
                                                                    transform: true
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{
                                                                padding: '40px',
                                                                textAlign: 'center',
                                                                color: '#6b7280',
                                                                backgroundColor: '#f9fafb',
                                                                borderRadius: '8px'
                                                            }}>
                                                                <div style={styles.spinner} />
                                                                <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                                                    Loading chart data...
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </Col>
                                        </Row>
                                    )}
                                </div>

                                {error && graphs.length > 0 && (
                                    <div style={styles.errorContainer}>
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}
                            </Container>
                        </div>

                        <CreateGraphSidebar
                            show={showCreateSidebar}
                            onClose={() => setShowCreateSidebar(false)}
                            onSubmit={handleSubmit}
                            filterOptions={filterOptions}
                            editingGraph={editingGraph}
                        />
                    </div>
                </Modal.Body>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Modal>
    );
};

export default BiDashboard;