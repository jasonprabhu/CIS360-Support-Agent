const RiskAndAccess = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Intelligence</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Risk Trend & Distribution Visualizations ]
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access & Privilege Intelligence</h3>
        <div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Privilege Trends & Access Anomalies ]
        </div>
      </div>
    </div>
  );
};

export default RiskAndAccess;
