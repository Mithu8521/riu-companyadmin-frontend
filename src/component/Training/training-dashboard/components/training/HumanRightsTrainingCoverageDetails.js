import React from 'react';
import { safeGet } from '../../utils/trainingUtils';

// Human Rights Training Coverage Details Component
export const HumanRightsTrainingCoverageDetails = ({ 
    trainingData, 
    previousTrainingData, 
    traineeList, 
    previousTraineeList,
    currentFYLabel,
    previousFYLabel
}) => {
    // Helper function to process trainee list and get totals
    const processTraineeList = (list) => {
        const structure = {
            employees: {
                permanent: { total: 0 },
                otherThanPermanent: { total: 0 }
            },
            workers: {
                permanent: { total: 0 },
                otherThanPermanent: { total: 0 }
            }
        };

        if (!list || !Array.isArray(list)) return structure;

        list.forEach((trainee) => {
            if (!trainee) return;

            const categoryValue = trainee.categoryId || trainee.category_name || 
                                 trainee.employeeType || trainee.category || trainee.type;

            let targetCategory = null;
            let traineeEmploymentType = null;

            if (categoryValue) {
                const categoryStr = categoryValue.toString().toLowerCase();

                if (categoryValue === 'Permanent Employee') {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === "Other than Permanent Employee") {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'otherThanPermanent';
                } else if (categoryStr === 'kmp' || categoryStr.includes('kmp')) {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryStr === 'bod' || categoryStr.includes('bod') || 
                          categoryStr.includes('board of directors')) {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === 'Permanent Worker') {
                    targetCategory = 'workers';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === 'Other than Permanent Worker') {
                    targetCategory = 'workers';
                    traineeEmploymentType = 'otherThanPermanent';
                }
            }

            if (targetCategory && traineeEmploymentType) {
                structure[targetCategory][traineeEmploymentType].total++;
            }
        });

        return structure;
    };

    // Helper function to process training data and get covered employees
    const processTrainingData = (data) => {
        const covered = {
            employees: {
                permanent: new Set(),
                otherThanPermanent: new Set()
            },
            workers: {
                permanent: new Set(),
                otherThanPermanent: new Set()
            }
        };

        if (!data || !Array.isArray(data)) return covered;

        data.forEach((training) => {
            if (!training) return;

            // Check if this is Human Rights training (category id = 3)
            const trainingCategoryIds = (training.categories || [])
                .map(category => category?.id)
                .filter(Boolean);

            if (!trainingCategoryIds.includes(3)) {
                return;
            }

            const attendants = training.attendantUsers || [];

            attendants.forEach((attendant) => {
                if (!attendant) return;

                const categoryValue = attendant.categoryId || attendant.category_name || 
                                     attendant.employeeType || attendant.category || attendant.type;
                const employeeId = attendant.employeeId;

                if (!employeeId || !categoryValue) return;

                let targetCategory = null;
                let traineeEmploymentType = null;
                const categoryStr = categoryValue.toString().toLowerCase();

                if (categoryValue === 'Permanent Employee') {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === "Other than Permanent Employee") {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'otherThanPermanent';
                } else if (categoryStr === 'kmp' || categoryStr.includes('kmp')) {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryStr === 'bod' || categoryStr.includes('bod') || 
                          categoryStr.includes('board of directors')) {
                    targetCategory = 'employees';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === 'Permanent Worker') {
                    targetCategory = 'workers';
                    traineeEmploymentType = 'permanent';
                } else if (categoryValue === 'Other than Permanent Worker') {
                    targetCategory = 'workers';
                    traineeEmploymentType = 'otherThanPermanent';
                }

                if (targetCategory && traineeEmploymentType) {
                    covered[targetCategory][traineeEmploymentType].add(employeeId);
                }
            });
        });

        return covered;
    };

    // Process current FY data
    const currentTotals = processTraineeList(traineeList);
    const currentCovered = processTrainingData(trainingData);

    // Process previous FY data
    const previousTotals = processTraineeList(previousTraineeList);
    const previousCovered = processTrainingData(previousTrainingData);

    // Build analysis object
    const analysis = {
        currentFY: {
            employees: {
                permanent: {
                    total: currentTotals.employees.permanent.total,
                    coveredCount: currentCovered.employees.permanent.size
                },
                otherThanPermanent: {
                    total: currentTotals.employees.otherThanPermanent.total,
                    coveredCount: currentCovered.employees.otherThanPermanent.size
                }
            },
            workers: {
                permanent: {
                    total: currentTotals.workers.permanent.total,
                    coveredCount: currentCovered.workers.permanent.size
                },
                otherThanPermanent: {
                    total: currentTotals.workers.otherThanPermanent.total,
                    coveredCount: currentCovered.workers.otherThanPermanent.size
                }
            }
        },
        previousFY: {
            employees: {
                permanent: {
                    total: previousTotals.employees.permanent.total,
                    coveredCount: previousCovered.employees.permanent.size
                },
                otherThanPermanent: {
                    total: previousTotals.employees.otherThanPermanent.total,
                    coveredCount: previousCovered.employees.otherThanPermanent.size
                }
            },
            workers: {
                permanent: {
                    total: previousTotals.workers.permanent.total,
                    coveredCount: previousCovered.workers.permanent.size
                },
                otherThanPermanent: {
                    total: previousTotals.workers.otherThanPermanent.total,
                    coveredCount: previousCovered.workers.otherThanPermanent.size
                }
            }
        }
    };

    const formatDisplayValue = (total, covered) => {
        const percentage = total > 0 ? ((covered / total) * 100).toFixed(2) : '0';
        return {
            display: `${total} | ${covered} | ${percentage}%`,
            color: covered > 0 ? '#059669' : '#DC2626'
        };
    };

    return (
        <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #D1D5DB"
        }}>

            <h2 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: "24px",
                margin: 0,
                textAlign: "center"
            }}>
                Human Rights Training Coverage Details
            </h2>

            {/* Employees Section */}
            <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                    margin: "0 0 12px 0"
                }}>
                    Employees
                </h3>

                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px"
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "left",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>Category</th>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>
                                <div>FY {currentFYLabel}</div>
                                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                                    Total | Covered | %
                                </div>
                            </th>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>
                                <div>FY {previousFYLabel}</div>
                                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                                    Total | Covered | %
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "500"
                            }}>Permanent</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'currentFY.employees.permanent.total'),
                                        safeGet(analysis, 'currentFY.employees.permanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'previousFY.employees.permanent.total'),
                                        safeGet(analysis, 'previousFY.employees.permanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "500"
                            }}>Other than Permanent</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'currentFY.employees.otherThanPermanent.total'),
                                        safeGet(analysis, 'currentFY.employees.otherThanPermanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'previousFY.employees.otherThanPermanent.total'),
                                        safeGet(analysis, 'previousFY.employees.otherThanPermanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "600"
                            }}>Total Employees</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const totalEmployees = safeGet(analysis, 'currentFY.employees.permanent.total') +
                                        safeGet(analysis, 'currentFY.employees.otherThanPermanent.total');
                                    const totalCovered = safeGet(analysis, 'currentFY.employees.permanent.coveredCount') +
                                        safeGet(analysis, 'currentFY.employees.otherThanPermanent.coveredCount');
                                    const result = formatDisplayValue(totalEmployees, totalCovered);
                                    return <span style={{ color: result.color, fontWeight: "600" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const totalEmployees = safeGet(analysis, 'previousFY.employees.permanent.total') +
                                        safeGet(analysis, 'previousFY.employees.otherThanPermanent.total');
                                    const totalCovered = safeGet(analysis, 'previousFY.employees.permanent.coveredCount') +
                                        safeGet(analysis, 'previousFY.employees.otherThanPermanent.coveredCount');
                                    const result = formatDisplayValue(totalEmployees, totalCovered);
                                    return <span style={{ color: result.color, fontWeight: "600" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Workers Section */}
            <div>
                <h3 style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                    margin: "0 0 12px 0"
                }}>
                    Workers
                </h3>

                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px"
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "left",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>Category</th>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>
                                <div>FY {currentFYLabel}</div>
                                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                                    Total | Covered | %
                                </div>
                            </th>
                            <th style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#374151",
                                backgroundColor: "#F9FAFB"
                            }}>
                                <div>FY {previousFYLabel}</div>
                                <div style={{ fontSize: "12px", fontWeight: "normal", marginTop: "4px" }}>
                                    Total | Covered | %
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "500"
                            }}>Permanent</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'currentFY.workers.permanent.total'),
                                        safeGet(analysis, 'currentFY.workers.permanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'previousFY.workers.permanent.total'),
                                        safeGet(analysis, 'previousFY.workers.permanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "500"
                            }}>Other than Permanent</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'currentFY.workers.otherThanPermanent.total'),
                                        safeGet(analysis, 'currentFY.workers.otherThanPermanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const result = formatDisplayValue(
                                        safeGet(analysis, 'previousFY.workers.otherThanPermanent.total'),
                                        safeGet(analysis, 'previousFY.workers.otherThanPermanent.coveredCount')
                                    );
                                    return <span style={{ color: result.color, fontWeight: "500" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                fontWeight: "600"
                            }}>Total Workers</td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const totalWorkers = safeGet(analysis, 'currentFY.workers.permanent.total') +
                                        safeGet(analysis, 'currentFY.workers.otherThanPermanent.total');
                                    const totalCovered = safeGet(analysis, 'currentFY.workers.permanent.coveredCount') +
                                        safeGet(analysis, 'currentFY.workers.otherThanPermanent.coveredCount');
                                    const result = formatDisplayValue(totalWorkers, totalCovered);
                                    return <span style={{ color: result.color, fontWeight: "600" }}>{result.display}</span>;
                                })()}
                            </td>
                            <td style={{
                                border: "1px solid #D1D5DB",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                {(() => {
                                    const totalWorkers = safeGet(analysis, 'previousFY.workers.permanent.total') +
                                        safeGet(analysis, 'previousFY.workers.otherThanPermanent.total');
                                    const totalCovered = safeGet(analysis, 'previousFY.workers.permanent.coveredCount') +
                                        safeGet(analysis, 'previousFY.workers.otherThanPermanent.coveredCount');
                                    const result = formatDisplayValue(totalWorkers, totalCovered);
                                    return <span style={{ color: result.color, fontWeight: "600" }}>{result.display}</span>;
                                })()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};