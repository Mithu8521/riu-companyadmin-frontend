import React, { useState, useEffect } from 'react';

const PublishCategoryModal = ({ show, onHide, onConfirm, initialCategory, loading }) => {
    const categories = [
        { value: 'Environment', label: 'Environment', icon: '🌱' },
        { value: 'Energy', label: 'Energy', icon: '⚡' },
        { value: 'Emission', label: 'Emission', icon: '💨' },
        { value: 'Water', label: 'Water', icon: '💧' },
        { value: 'Waste', label: 'Waste', icon: '♻️' },
        { value: 'Intensity', label: 'Intensity', icon: '📊' },
        { value: 'Diversity', label: 'Diversity', icon: '🌈' },
        { value: 'Employment', label: 'Employment', icon: '👥' },
        { value: 'Occupancy', label: 'Occupancy', icon: '🏢' },
        { value: 'Health & Safety', label: 'Health & Safety', icon: '🛡️' },
        { value: 'Training', label: 'Training', icon: '📚' }
    ];

    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Energy');

    useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    const handleConfirm = () => {
        onConfirm(selectedCategory);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            onHide();
        }
    };

    if (!show) return null;

    const styles = {
        backdrop: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '20px'
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            animation: 'modalSlideIn 0.2s ease-out'
        },
        modalHeader: {
            background: 'linear-gradient(135deg, rgba(42, 95, 117, 0.05) 0%, rgba(42, 95, 117, 0.1) 100%)',
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: 'rgb(42, 95, 117)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'all 0.2s',
            fontSize: '20px',
            width: '32px',
            height: '32px'
        },
        modalBody: {
            padding: '24px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px',
            display: 'block'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            border: '2px solid #d1d5db',
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgb(42, 95, 117)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            paddingRight: '44px'
        },
        modalFooter: {
            borderTop: '1px solid #e5e7eb',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#f9fafb'
        },
        button: {
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        cancelButton: {
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #d1d5db'
        },
        publishButton: {
            backgroundColor: 'rgb(42, 95, 117)',
            color: 'white'
        },
        publishButtonDisabled: {
            backgroundColor: '#d1d5db',
            cursor: 'not-allowed',
            opacity: 0.6
        },
        helperText: {
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '8px'
        }
    };

    return (
        <div style={styles.backdrop} onClick={handleBackdropClick}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>
                        <span>📊</span>
                        Publish Graph
                    </h3>
                    <button
                        onClick={onHide}
                        style={styles.closeButton}
                        disabled={loading}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(42, 95, 117, 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.modalBody}>
                    <div>
                        <label style={styles.label}>
                            Select Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={styles.select}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgb(42, 95, 117)';
                                e.target.style.boxShadow = '0 0 0 3px rgba(42, 95, 117, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db';
                                e.target.style.boxShadow = 'none';
                            }}
                            disabled={loading}
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>
                        <div style={styles.helperText}>
                            Choose the category that best describes this graph
                        </div>
                    </div>
                </div>

                <div style={styles.modalFooter}>
                    <button
                        onClick={onHide}
                        style={{
                            ...styles.button,
                            ...styles.cancelButton
                        }}
                        disabled={loading}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            ...styles.button,
                            ...styles.publishButton,
                            ...(loading ? styles.publishButtonDisabled : {})
                        }}
                        disabled={loading}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = 'rgba(42, 95, 117, 0.85)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = 'rgb(42, 95, 117)';
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <span>✓</span>
                                Publish Graph
                            </>
                        )}
                    </button>
                </div>

                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes modalSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default PublishCategoryModal;