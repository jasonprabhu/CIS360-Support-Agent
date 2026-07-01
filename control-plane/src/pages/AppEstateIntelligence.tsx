import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Filter, Download, Save, RotateCcw, AlertTriangle, Users, Database, Server, Shield, LayoutDashboard, Clock, DollarSign } from 'lucide-react';
import { mockAppEstate } from '../data/mockAppEstateData';
import type { AppEstateRecord } from '../data/mockAppEstateData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AppEstateIntelligence = () => {
  const [dataSource, setDataSource] = useState<'Mock' | 'Production'>('Mock');
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'risk' | 'optimization' | 'adoption' | 'lifecycle'>('overview');
  
  // Filters
  const [pubFilter, setPubFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [platFilter, setPlatFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [supportFilter, setSupportFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [usageFilter, setUsageFilter] = useState('All');

  // Sorting for Data Grid
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppEstateRecord | null>(null);

  const currentApps = dataSource === 'Mock' ? mockAppEstate : [];

  const filteredApps = useMemo(() => {
    return currentApps.filter(app => {
      if (pubFilter !== 'All' && app.publisher !== pubFilter) return false;
      if (catFilter !== 'All' && app.category !== catFilter) return false;
      if (deptFilter !== 'All' && app.department !== deptFilter) return false;
      if (platFilter !== 'All' && app.platform !== platFilter) return false;
      if (countryFilter !== 'All' && app.country !== countryFilter) return false;
      if (supportFilter !== 'All' && app.supportStatus !== supportFilter) return false;
      if (riskFilter !== 'All' && app.riskLevel !== riskFilter) return false;
      if (usageFilter !== 'All' && app.usageStatus !== usageFilter) return false;
      return true;
    });
  }, [currentApps, pubFilter, catFilter, deptFilter, platFilter, countryFilter, supportFilter, riskFilter, usageFilter]);

  const sortedApps = useMemo(() => {
    let sortable = [...filteredApps];
    if (sortConfig) {
      sortable.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredApps, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setPubFilter('All');
    setCatFilter('All');
    setDeptFilter('All');
    setPlatFilter('All');
    setCountryFilter('All');
    setSupportFilter('All');
    setRiskFilter('All');
    setUsageFilter('All');
  };

  const renderOverview = () => {
    const catData = Object.entries(filteredApps.reduce((acc, app) => {
      acc[app.category] = (acc[app.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

    const pubData = Object.entries(filteredApps.reduce((acc, app) => {
      acc[app.publisher] = (acc[app.publisher] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

    const topInstalled = [...filteredApps].sort((a, b) => b.installations - a.installations).slice(0, 10);

    const platformData = Object.entries(filteredApps.reduce((acc, app) => {
      acc[app.platform] = (acc[app.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {catData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Publishers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pubData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f6cbd" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Installed Applications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-semibold">Application</th>
                  <th className="px-4 py-2 font-semibold">Publisher</th>
                  <th className="px-4 py-2 font-semibold">Installs</th>
                </tr>
              </thead>
              <tbody>
                {topInstalled.map(app => (
                  <tr key={app.id} className="border-b border-gray-100">
                    <td className="px-4 py-2 font-medium">{app.name}</td>
                    <td className="px-4 py-2 text-gray-600">{app.publisher}</td>
                    <td className="px-4 py-2 text-[#0f6cbd] font-semibold">{app.installations.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {platformData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderInventory = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in relative">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Application {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold">Version</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('publisher')}>Publisher {sortConfig?.key === 'publisher' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('category')}>Category {sortConfig?.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('installations')}>Installs {sortConfig?.key === 'installations' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('platform')}>Platform {sortConfig?.key === 'platform' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('supportStatus')}>Support {sortConfig?.key === 'supportStatus' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('riskLevel')}>Risk {sortConfig?.key === 'riskLevel' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedApps.slice(0, 100).map(app => (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                <td className="px-6 py-4 text-gray-500">{app.version}</td>
                <td className="px-6 py-4 text-gray-700">{app.publisher}</td>
                <td className="px-6 py-4 text-gray-700">{app.category}</td>
                <td className="px-6 py-4 font-semibold text-[#0f6cbd]">{app.installations.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-700">{app.platform}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${app.supportStatus === 'Supported' ? 'bg-green-100 text-green-800' : app.supportStatus === 'Deprecated' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                    {app.supportStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${app.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : app.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' : app.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {app.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedApps.length > 100 && (
          <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-100 bg-gray-50">
            Showing 100 of {sortedApps.length} applications. Use export to view full dataset.
          </div>
        )}
      </div>
      
      {/* Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedApp.name}</h2>
                <p className="text-sm text-gray-500">{selectedApp.publisher} • v{selectedApp.version}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-700 font-bold text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 flex-1">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Installations</p>
                  <p className="text-lg font-bold text-gray-900">{selectedApp.installations.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Users</p>
                  <p className="text-lg font-bold text-gray-900">{selectedApp.users.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Business Owner</p>
                  <p className="text-sm font-medium text-gray-900">{selectedApp.businessOwner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Primary Dept</p>
                  <p className="text-sm font-medium text-gray-900">{selectedApp.department}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Risk & Lifecycle</h4>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Support Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${selectedApp.supportStatus === 'Supported' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selectedApp.supportStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${selectedApp.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : selectedApp.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>{selectedApp.riskLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lifecycle Stage</span>
                  <span className="text-sm font-medium text-gray-900">{selectedApp.lifecycleStage}</span>
                </div>
                {selectedApp.eolDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">End of Support</span>
                    <span className="text-sm font-medium text-red-600">{selectedApp.eolDate}</span>
                  </div>
                )}
                {selectedApp.cveCount > 0 && (
                  <div className="flex justify-between items-center bg-red-50 p-2 rounded">
                    <span className="text-sm text-red-700 font-semibold"><Shield size={14} className="inline mr-1" /> Known CVEs</span>
                    <span className="text-sm font-bold text-red-700">{selectedApp.cveCount}</span>
                  </div>
                )}
              </div>

              <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Usage Insights</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Usage Status</span>
                  <span className="text-sm font-medium text-gray-900">{selectedApp.usageStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Est. Cost</span>
                  <span className="text-sm font-medium text-gray-900">${(selectedApp.monthlyCost * selectedApp.installations).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setSelectedApp(null)} className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition">Close</button>
              {selectedApp.riskLevel === 'Critical' && (
                <button className="px-4 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition">Quarantine App</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRisk = () => {
    const unsuppApps = filteredApps.filter(a => a.supportStatus === 'Unsupported' || a.supportStatus === 'Deprecated');
    const vulnApps = filteredApps.filter(a => a.cveCount > 0).sort((a, b) => b.cveCount - a.cveCount);
    const unauthApps = filteredApps.filter(a => a.isUnauthorized);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-red-50 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            <h3 className="text-lg font-semibold text-red-900">Unauthorized Applications</h3>
          </div>
          <div className="p-4 bg-white text-sm text-gray-600">Shadow IT applications explicitly banned by organizational policy.</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Application</th>
                  <th className="px-6 py-3 font-semibold">Installs</th>
                  <th className="px-6 py-3 font-semibold">Platform</th>
                  <th className="px-6 py-3 font-semibold">Risk Level</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unauthApps.slice(0, 10).map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{app.name}</td>
                    <td className="px-6 py-3 font-semibold text-red-600">{app.installations}</td>
                    <td className="px-6 py-3">{app.platform}</td>
                    <td className="px-6 py-3"><span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">{app.riskLevel}</span></td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-red-600 hover:underline font-semibold text-sm">Quarantine</button>
                    </td>
                  </tr>
                ))}
                {unauthApps.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No unauthorized apps detected.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-orange-50 flex items-center gap-2">
            <Shield className="text-orange-600" size={20} />
            <h3 className="text-lg font-semibold text-orange-900">Vulnerable Applications</h3>
          </div>
          <div className="p-4 bg-white text-sm text-gray-600">Applications with known Common Vulnerabilities and Exposures (CVEs).</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Application</th>
                  <th className="px-6 py-3 font-semibold">Version</th>
                  <th className="px-6 py-3 font-semibold">Known CVEs</th>
                  <th className="px-6 py-3 font-semibold">Exposure</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vulnApps.slice(0, 10).map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{app.name}</td>
                    <td className="px-6 py-3 text-gray-500">{app.version}</td>
                    <td className="px-6 py-3 font-bold text-orange-600">{app.cveCount}</td>
                    <td className="px-6 py-3">{app.installations} devices</td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-[#0f6cbd] hover:underline font-semibold text-sm">Deploy Patch</button>
                    </td>
                  </tr>
                ))}
                {vulnApps.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No vulnerable apps detected.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-yellow-50 flex items-center gap-2">
            <Clock className="text-yellow-600" size={20} />
            <h3 className="text-lg font-semibold text-yellow-900">Unsupported & Deprecated Applications</h3>
          </div>
          <div className="p-4 bg-white text-sm text-gray-600">Applications that have passed their End-of-Life date.</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Application</th>
                  <th className="px-6 py-3 font-semibold">Publisher</th>
                  <th className="px-6 py-3 font-semibold">Support Status</th>
                  <th className="px-6 py-3 font-semibold">Installs</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unsuppApps.slice(0, 10).map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{app.name}</td>
                    <td className="px-6 py-3 text-gray-500">{app.publisher}</td>
                    <td className="px-6 py-3"><span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">{app.supportStatus}</span></td>
                    <td className="px-6 py-3">{app.installations} devices</td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-[#0f6cbd] hover:underline font-semibold text-sm">Force Upgrade</button>
                    </td>
                  </tr>
                ))}
                {unsuppApps.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No unsupported apps detected.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderOptimization = () => {
    const duplicateApps = filteredApps.filter(a => a.isDuplicate);
    const premiumUnused = filteredApps.filter(a => (a.usageStatus === 'Rarely Used' || a.usageStatus === 'Unused') && a.monthlyCost > 15);
    const unusedApps = filteredApps.filter(a => a.usageStatus === 'Unused');
    const orphanedApps = filteredApps.filter(a => !a.businessOwner || a.businessOwner.startsWith('Owner 4')); // Simulate some orphans
    
    const rationalizationSavings = duplicateApps.reduce((acc, a) => acc + (a.monthlyCost * a.installations * 12), 0) * 0.3; // Estimate 30% consolidation

    const insights = [
      {
        id: 1, title: 'Duplicate Functional Apps', desc: 'Overlapping collaboration and utility tools (e.g., Zoom/Teams/Webex).', 
        count: duplicateApps.length, savings: rationalizationSavings, action: 'Consolidate', icon: Users, color: 'blue'
      },
      {
        id: 2, title: 'Premium Unused Apps', desc: 'Expensive licenses (Visio, Project) with low usage velocity.', 
        count: premiumUnused.length, savings: premiumUnused.reduce((acc, a) => acc + (a.monthlyCost * a.installations * 12), 0), action: 'Reclaim', icon: DollarSign, color: 'orange'
      },
      {
        id: 3, title: 'Orphaned Applications', desc: 'Active applications with no assigned Business Owner in AD.', 
        count: orphanedApps.length, savings: orphanedApps.reduce((acc, a) => acc + (a.monthlyCost * a.installations * 12), 0), action: 'Assign', icon: AlertTriangle, color: 'red'
      },
      {
        id: 4, title: 'Zero-Usage Installations', desc: 'Applications installed on devices but not launched in 90+ days.', 
        count: unusedApps.length, savings: unusedApps.reduce((acc, a) => acc + (a.monthlyCost * a.installations * 12), 0), action: 'Uninstall', icon: Database, color: 'green'
      }
    ];

    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map(insight => (
            <div key={insight.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${insight.color}-100 text-${insight.color}-600`}>
                    <insight.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
                    <p className="text-sm text-gray-500">{insight.desc}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Affected Apps</div>
                  <div className="text-2xl font-bold text-gray-900">{insight.count}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-700 mb-1">Potential Annual ROI</div>
                  <div className="text-2xl font-bold text-green-800">${insight.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">View Details</button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#0f6cbd] rounded hover:bg-[#0c5391] transition-colors shadow-sm">{insight.action} All</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdoption = () => {
    // Generate some mock trend data for the area chart
    const trendData = [
      { month: 'Jan', activeUsers: 8400, newInstalls: 420 },
      { month: 'Feb', activeUsers: 8900, newInstalls: 510 },
      { month: 'Mar', activeUsers: 9100, newInstalls: 300 },
      { month: 'Apr', activeUsers: 9500, newInstalls: 600 },
      { month: 'May', activeUsers: 10200, newInstalls: 800 },
      { month: 'Jun', activeUsers: 11000, newInstalls: 950 },
    ];

    const topGrowing = [...filteredApps].sort((a, b) => b.installations - a.installations).slice(0, 5);
    const topDeclining = [...filteredApps].filter(a => a.usageStatus === 'Rarely Used').sort((a, b) => b.installations - a.installations).slice(0, 5);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Usage Trends (6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="activeUsers" stroke="#0f6cbd" fill="#c7e0f4" name="Active Users" />
                <Area type="monotone" dataKey="newInstalls" stroke="#00C49F" fill="#bcf5e7" name="New Installations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><LayoutDashboard size={20} className="text-green-600"/> Top Growing Applications</h3>
          <ul className="divide-y divide-gray-100">
            {topGrowing.map((app, i) => (
              <li key={app.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{i + 1}. {app.name}</div>
                  <div className="text-xs text-gray-500">{app.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+{Math.floor(Math.random() * 20) + 5}%</div>
                  <div className="text-xs text-gray-500">{app.users} users</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><LayoutDashboard size={20} className="text-red-600"/> Declining Applications</h3>
          <ul className="divide-y divide-gray-100">
            {topDeclining.map((app, i) => (
              <li key={app.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{i + 1}. {app.name}</div>
                  <div className="text-xs text-gray-500">{app.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">-{Math.floor(Math.random() * 30) + 10}%</div>
                  <div className="text-xs text-gray-500">{app.users} users</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderLifecycle = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in relative">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Application Lifecycle Management</h3>
            <p className="text-sm text-gray-500">Track and plan for End of Life (EOL) software replacements.</p>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Application</th>
                <th className="px-6 py-4 font-semibold">Version</th>
                <th className="px-6 py-4 font-semibold">Vendor</th>
                <th className="px-6 py-4 font-semibold">Current Stage</th>
                <th className="px-6 py-4 font-semibold">EOL Date</th>
                <th className="px-6 py-4 font-semibold text-right">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.slice(0, 100).map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                  <td className="px-6 py-4 text-gray-500">{app.version}</td>
                  <td className="px-6 py-4 text-gray-700">{app.publisher}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${app.lifecycleStage === 'New' ? 'bg-blue-100 text-blue-800' : app.lifecycleStage === 'Active' ? 'bg-green-100 text-green-800' : app.lifecycleStage === 'Aging' ? 'bg-yellow-100 text-yellow-800' : app.lifecycleStage === 'Unsupported' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                      {app.lifecycleStage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{app.eolDate || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#0f6cbd] hover:underline font-semibold text-sm">
                      {app.lifecycleStage === 'Unsupported' || app.lifecycleStage === 'Deprecated' ? 'Plan Migration' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // KPIs
  const totalApps = filteredApps.length;
  const totalInstalls = filteredApps.reduce((sum, app) => sum + app.installations, 0);
  const duplicateApps = filteredApps.filter(a => a.isDuplicate).length;
  const unsupportedApps = filteredApps.filter(a => a.supportStatus === 'Unsupported').length;
  const vulnerableApps = filteredApps.filter(a => a.riskLevel === 'High' || a.riskLevel === 'Critical').length;
  const rarelyUsed = filteredApps.filter(a => a.usageStatus === 'Rarely Used').length;
  const unauthorized = filteredApps.filter(a => a.isUnauthorized).length;
  const optimizationOpps = duplicateApps + rarelyUsed + filteredApps.filter(a => a.usageStatus === 'Unused').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header mb-6">
        <h2 className="page-title text-2xl font-bold text-gray-800">Application Estate Intelligence</h2>
        <p className="page-subtitle text-gray-500">Comprehensive visibility into your software ecosystem.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Filter size={18} /> Global Estate Filters
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-300">
              <button onClick={() => setDataSource('Mock')} className={`px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Mock' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>Mock Data</button>
              <button onClick={() => setDataSource('Production')} className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Production' ? 'bg-green-100 shadow-sm text-green-800' : 'text-gray-500 hover:text-gray-700'}`}>
                <Database size={14} /> Production API
              </button>
            </div>
            <button onClick={resetFilters} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition"><RotateCcw size={18} /></button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"><Save size={16}/> Save View</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#0f6cbd] border border-transparent rounded hover:bg-[#0c5391] transition shadow-sm"><Download size={16}/> Export Report</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: 'Publisher', val: pubFilter, set: setPubFilter, opts: ['All', ...Array.from(new Set(mockAppEstate.map(a => a.publisher)))] },
            { label: 'Category', val: catFilter, set: setCatFilter, opts: ['All', ...Array.from(new Set(mockAppEstate.map(a => a.category)))] },
            { label: 'Department', val: deptFilter, set: setDeptFilter, opts: ['All', ...Array.from(new Set(mockAppEstate.map(a => a.department)))] },
            { label: 'Platform', val: platFilter, set: setPlatFilter, opts: ['All', 'Windows', 'Mac', 'Mobile'] },
            { label: 'Country', val: countryFilter, set: setCountryFilter, opts: ['All', ...Array.from(new Set(mockAppEstate.map(a => a.country)))] },
            { label: 'Support Status', val: supportFilter, set: setSupportFilter, opts: ['All', 'Supported', 'Unsupported', 'Deprecated'] },
            { label: 'Risk Level', val: riskFilter, set: setRiskFilter, opts: ['All', 'Low', 'Medium', 'High', 'Critical'] },
            { label: 'Usage Status', val: usageFilter, set: setUsageFilter, opts: ['All', 'Active', 'Rarely Used', 'Unused'] },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
              <select value={f.val} onChange={e => f.set(e.target.value)} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-gray-50">
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {dataSource === 'Production' ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-8 rounded-lg text-center font-medium shadow-sm flex flex-col items-center justify-center">
          <Server size={48} className="mb-4 text-yellow-600 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Live source integration is not configured yet</h3>
          <p>The Application Estate module is currently running in Mock Data mode for Phase 1 MVP.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => resetFilters()}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Apps</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{totalApps}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Installations</div>
              <div className="text-2xl font-bold text-[#0f6cbd] mt-1">{totalInstalls.toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters();}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Duplicates</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">{duplicateApps}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setSupportFilter('Unsupported');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Unsupported</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{unsupportedApps}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Vulnerable</div>
              <div className="text-2xl font-bold text-red-700 mt-1">{vulnerableApps}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => {resetFilters(); setUsageFilter('Rarely Used');}}>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Rarely Used</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{rarelyUsed}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Unauthorized</div>
              <div className="text-2xl font-bold text-red-800 mt-1">{unauthorized}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Opt. Opps</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{optimizationOpps}</div>
            </div>
          </div>

          <div className="mb-6 border-b border-gray-300">
            <nav className="flex gap-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'inventory', label: 'Inventory' },
                { id: 'risk', label: 'Risk' },
                { id: 'optimization', label: 'Optimization' },
                { id: 'adoption', label: 'Adoption' },
                { id: 'lifecycle', label: 'Lifecycle' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 font-semibold text-sm transition relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#0f6cbd]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0f6cbd]"></span>}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'inventory' && renderInventory()}
            {activeTab === 'risk' && renderRisk()}
            {activeTab === 'optimization' && renderOptimization()}
            {activeTab === 'adoption' && renderAdoption()}
            {activeTab === 'lifecycle' && renderLifecycle()}
          </div>
        </>
      )}
    </div>
  );
};

export default AppEstateIntelligence;
