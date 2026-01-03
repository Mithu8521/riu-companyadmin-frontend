import React from "react";

const PrincipleComplianceMatrix = ({ 
  mockData,
  title = "Principle Compliance Matrix (P1-P9) - Employee Coverage" 
}) => {
  if (!mockData || !mockData.trainingPrograms || !mockData.principles) {
    return <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="text-center text-gray-500">No data available</p>
    </div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-4 text-left font-semibold text-gray-700 bg-gray-50 w-1/3">
                Principle
              </th>
              {Object.entries(mockData.trainingPrograms).map(([category, program]) => (
                <th key={category} className="border border-gray-300 p-3 text-center font-semibold text-gray-700 bg-gray-50 w-1/6">
                  <div className="text-sm">{category}</div>
                  <div className="text-xs font-normal text-gray-500 mt-1">
                    Total: {program.totalEmployees}
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50"></th>
              {Object.keys(mockData.trainingPrograms).map((category) => (
                <th key={category} className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-600 bg-gray-50">
                  No. Covered | %
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mockData.principles).map(([principleKey, principleDescription]) => (
              <tr key={principleKey} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 align-top">
                  <div className="font-bold text-gray-700 text-base mb-2">{principleKey}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{principleDescription}</div>
                </td>
                {Object.entries(mockData.trainingPrograms).map(([category, program]) => {
                  const compliance = program.principleCompliance[principleKey];
                  const isCompliant = compliance.status === "Yes";
                  const totalEmployees = program.totalEmployees;
                  const coveragePercentage = ((compliance.covered / totalEmployees) * 100).toFixed(1);
                  
                  return (
                    <td key={category} className="border border-gray-300 p-3 text-center align-top">
                      <div className={`flex flex-col items-center space-y-1 p-3 rounded ${
                        isCompliant ? "bg-green-100" : "bg-red-100"
                      }`}>
                        <span className={`text-sm font-medium ${
                          isCompliant ? "text-green-700" : "text-red-700"
                        }`}>
                          {compliance.status}
                        </span>
                        <div className="text-sm">
                          <span className={isCompliant ? "text-green-700" : "text-red-700"}>
                            {compliance.covered}
                          </span>
                          <span className="text-gray-500 mx-1">|</span>
                          <span className={isCompliant ? "text-green-700" : "text-red-700"}>
                            {compliance.percentage}%
                          </span>
                        </div>
                        {isCompliant && compliance.covered > 0 && (
                          <div className="text-xs text-gray-500">
                            {coveragePercentage}% coverage
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrincipleComplianceMatrix;