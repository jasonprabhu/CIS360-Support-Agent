import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Filter, Download, Save, RotateCcw, AlertTriangle, Users, Mail, DollarSign, Clock, CheckCircle, Database } from 'lucide-react';
import { mockUsers, SKUS, DEPARTMENTS, COUNTRIES } from '../data/mockLicenseData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const LicenseIntelligence = () => {
  const [dataSource, setDataSource] = useState<'Mock' | 'Production'>('Mock');
  const [prodUsers, setProdUsers] = useState<any[]>([]);
  const [loadingProd, setLoadingProd] = useState(false);

  // Master Filters
  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'allocation' | 'optimization' | 'savings' | 'forecast'>('overview');
  const [skuFilter, setSkuFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All'); // All, Active, Disabled
  const [activityFilter, setActivityFilter] = useState<string>('All'); // All, <30, 30-90, >90

  // Filter Logic
  const currentUsers = dataSource === 'Mock' ? mockUsers : prodUsers;

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Simulator State
  const [simCurrent, setSimCurrent] = useState('E5');
  const [simTarget, setSimTarget] = useState('E3');
  const [simUsers, setSimUsers] = useState(100);

  useEffect(() => {
    if (dataSource === 'Production') {
      setLoadingProd(true);
      fetch('/api/licenses/intelligence')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.users) {
            setProdUsers(data.data.users);
          }
        })
        .catch(err => console.error("Failed to load prod data:", err))
        .finally(() => setLoadingProd(false));
    }
  }, [dataSource]);

  const filteredUsers = useMemo(() => {
    return currentUsers.filter(u => {
      if (skuFilter !== 'All' && !u.assignedLicenses.includes(skuFilter)) return false;
      if (deptFilter !== 'All' && u.department !== deptFilter) return false;
      if (countryFilter !== 'All' && u.country !== countryFilter) return false;
      if (statusFilter !== 'All' && u.status !== statusFilter) return false;
      
      if (activityFilter !== 'All') {
        const daysSinceActivity = (Date.now() - new Date(u.lastActivity).getTime()) / (1000 * 3600 * 24);
        if (activityFilter === '<30' && daysSinceActivity >= 30) return false;
        if (activityFilter === '30-90' && (daysSinceActivity < 30 || daysSinceActivity > 90)) return false;
        if (activityFilter === '>90' && daysSinceActivity <= 90) return false;
      }
      return true;
    });
  }, [skuFilter, deptFilter, countryFilter, statusFilter, activityFilter, currentUsers]);

  const sortedUsers = useMemo(() => {
    let sortableItems = [...filteredUsers];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUsers, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    if (sortedUsers.length === 0) return;
    const headers = ['Name', 'Email', 'Department', 'Country', 'Assigned Licenses', 'Status', 'Utilization Score', 'Monthly Cost'];
    const csvContent = [
      headers.join(','),
      ...sortedUsers.map(u => 
        `"${u.name}","${u.email}","${u.department}","${u.country}","${u.assignedLicenses.join('; ')}","${u.status}","${u.utilizationScore}","${u.monthlyCost}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `license_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSkuFilter('All');
    setDeptFilter('All');
    setCountryFilter('All');
    setStatusFilter('All');
    setActivityFilter('All');
  };

  // KPIs
  const totalPurchased = 800; // Mock total
  const totalAssigned = filteredUsers.filter(u => u.assignedLicenses.length > 0).length;
  const totalUnused = filteredUsers.filter(u => u.assignedLicenses.length > 0 && u.utilizationScore < 20).length;
  const disabledWithLicenses = filteredUsers.filter(u => u.status === 'Disabled' && u.assignedLicenses.length > 0).length;
  const sharedMailboxes = filteredUsers.filter(u => u.userType === 'Shared Mailbox' && u.assignedLicenses.length > 0).length;
  const guestUsers = filteredUsers.filter(u => u.userType === 'Guest' && u.assignedLicenses.length > 0).length;

  const skuDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredUsers.forEach(u => {
      u.assignedLicenses.forEach((sku: string) => {
        counts[sku] = (counts[sku] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredUsers]);

  const deptDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredUsers.forEach(u => {
      if (u.assignedLicenses.length > 0) {
        counts[u.department] = (counts[u.department] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredUsers]);

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">License Distribution by SKU</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={skuDistribution} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                {skuDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" onClick={() => setSkuFilter(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Assigned Licenses by Department</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0f6cbd" radius={[4, 4, 0, 0]} onClick={(data: any) => data?.name && setDeptFilter(data.name)} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderWorkloads = () => {
    if (loadingProd) return <div className="p-10 text-center">Loading Graph API Data...</div>;

    const e5Users = filteredUsers.filter(u => u.assignedLicenses.includes('E5'));
    const totalE5 = e5Users.length || 1; 

    const avgE5Workloads = e5Users.reduce((acc, u) => {
      if(u.workloads) {
        acc.Exchange += (u.workloads.Exchange || 0);
        acc.Teams += (u.workloads.Teams || 0);
        acc.SharePoint += (u.workloads.SharePoint || 0);
        acc.Copilot += (u.workloads.Copilot || 0);
      }
      return acc;
    }, { Exchange: 0, Teams: 0, SharePoint: 0, Copilot: 0 });

    const e5ChartData = [
      { name: 'Exchange', adoption: Math.round(avgE5Workloads.Exchange / totalE5) || 85 },
      { name: 'Teams', adoption: Math.round(avgE5Workloads.Teams / totalE5) || 75 },
      { name: 'SharePoint', adoption: Math.round(avgE5Workloads.SharePoint / totalE5) || 60 },
      { name: 'Copilot', adoption: Math.round(avgE5Workloads.Copilot / totalE5) || 12 },
    ];

    const depts = Array.from(new Set(e5Users.map(u => u.department)));
    const deptCopilotData = depts.map(d => {
      const usersInDept = e5Users.filter(u => u.department === d);
      const totalInDept = usersInDept.length || 1;
      const copilotSum = usersInDept.reduce((sum, u) => sum + (u.workloads?.Copilot || 0), 0);
      return { name: d, adoption: Math.round(copilotSum / totalInDept) };
    }).sort((a, b) => a.adoption - b.adoption);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">E5 Workload Adoption (%)</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={e5ChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="adoption" radius={[4, 4, 0, 0]}>
                  {e5ChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.adoption < 30 ? '#d83b01' : '#0f6cbd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Granular Departmental Copilot Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Copilot Adoption by Department</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Identify low adoption areas for targeted training.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptCopilotData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="adoption" radius={[0, 4, 4, 0]}>
                  {deptCopilotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.adoption < 30 ? '#d83b01' : '#0f6cbd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderAllocation = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in relative">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">User Allocation ({filteredUsers.length})</h3>
        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
          <Download size={16} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 shadow-sm border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>User {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('department')}>Department {sortConfig?.key === 'department' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold">Assigned Licenses</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('status')}>Status {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('utilizationScore')}>Utilization {sortConfig?.key === 'utilizationScore' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100" onClick={() => requestSort('monthlyCost')}>Est. Cost {sortConfig?.key === 'monthlyCost' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-gray-500 text-xs">{u.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{u.department}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {u.assignedLicenses.map((l: string) => (
                      <span key={l} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 text-xs">{l}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                      <div className={`h-2 rounded-full ${u.utilizationScore > 70 ? 'bg-green-500' : u.utilizationScore > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${u.utilizationScore}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-600">{u.utilizationScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">${u.monthlyCost}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedUser(u)} className="text-[#0f6cbd] font-semibold hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-800 font-bold text-xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-semibold">{selectedUser.status}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-md font-semibold border-b pb-2 mb-3">Assigned Licenses</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedUser.assignedLicenses.map((l: string) => (
                    <span key={l} className="bg-[#e6f0fa] text-[#0f6cbd] px-3 py-1 rounded border border-[#0f6cbd] text-sm font-medium">{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOptimization = () => {
    const inactiveUsers = filteredUsers.filter(u => u.status === 'Active' && u.utilizationScore < 10);
    const unusedE5 = filteredUsers.filter(u => u.assignedLicenses.includes('E5') && u.utilizationScore < 30);
    const guestUsers = filteredUsers.filter(u => u.userType === 'Guest' && u.assignedLicenses.length > 0);

    const dynamicInsights = [
      {
        id: 1,
        title: "Dormant Accounts with Active Licenses",
        description: "Accounts that haven't logged in for 90+ days but still hold paid licenses.",
        count: inactiveUsers.length,
        savings: inactiveUsers.reduce((sum, u) => sum + u.monthlyCost, 0),
        action: "Reclaim"
      },
      {
        id: 2,
        title: "Underutilized E5 Licenses",
        description: "Users with E5 licenses showing low workload adoption (ideal candidates for E3 downgrade).",
        count: unusedE5.length,
        savings: unusedE5.length * 15, // Approx diff between E5 and E3
        action: "Downgrade"
      },
      {
        id: 3,
        title: "Guest Accounts with Paid Licenses",
        description: "External guests mistakenly assigned premium M365 licenses instead of free Azure AD Guest tier.",
        count: guestUsers.length,
        savings: guestUsers.reduce((sum, u) => sum + u.monthlyCost, 0),
        action: "Review"
      }
    ];

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {dynamicInsights.map(insight => (
        <div key={insight.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
                <p className="text-sm text-gray-500">{insight.description}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Affected Users</div>
              <div className="text-2xl font-bold text-gray-900">{insight.count}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-700 mb-1">Potential Savings/mo</div>
              <div className="text-2xl font-bold text-green-800">${insight.savings.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">View Details</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#0f6cbd] rounded hover:bg-[#0c5391] transition-colors shadow-sm">{insight.action} All</button>
          </div>
        </div>
      ))}
    </div>
    );
  };

  // Tab: Savings Simulator
  const renderSavings = () => {
    const currentCost = SKUS.find(s => s.id === simCurrent)?.cost || 0;
    const targetCost = SKUS.find(s => s.id === simTarget)?.cost || 0;
    
    const monthlySavings = (currentCost - targetCost) * simUsers;
    const annualSavings = monthlySavings * 12;
    const percentage = currentCost > 0 ? ((currentCost - targetCost) / currentCost) * 100 : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Savings Simulator</h3>
        <p className="text-gray-500 mb-8">Calculate potential ROI for license downgrades and optimizations.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current License</label>
            <select className="w-full p-3 border border-gray-300 rounded-md bg-gray-50" value={simCurrent} onChange={e => setSimCurrent(e.target.value)}>
              {SKUS.map(s => <option key={s.id} value={s.id}>{s.name} (${s.cost}/mo)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target License</label>
            <select className="w-full p-3 border border-gray-300 rounded-md bg-gray-50" value={simTarget} onChange={e => setSimTarget(e.target.value)}>
              <option value="NONE">Remove License ($0/mo)</option>
              {SKUS.map(s => <option key={s.id} value={s.id}>{s.name} (${s.cost}/mo)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Users</label>
            <input type="number" className="w-full p-3 border border-gray-300 rounded-md bg-gray-50" value={simUsers} onChange={e => setSimUsers(Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-6">Projected Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-gray-500 text-sm mb-2">Monthly Savings</div>
              <div className={`text-3xl font-bold ${monthlySavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${monthlySavings.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-gray-500 text-sm mb-2">Annual Savings</div>
              <div className={`text-3xl font-bold ${annualSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-gray-500 text-sm mb-2">Cost Reduction</div>
              <div className={`text-3xl font-bold ${percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {percentage.toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 bg-[#0f6cbd] text-white font-semibold rounded-lg shadow hover:bg-[#0c5391] transition-colors flex items-center gap-2">
              <CheckCircle size={20} /> Create Optimization Campaign
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Tab: Forecast
  const renderForecast = () => {
    // Mock forecast data
    const data = [
      { month: 'Jan', consumed: 600, limit: 800 },
      { month: 'Feb', consumed: 620, limit: 800 },
      { month: 'Mar', consumed: 650, limit: 800 },
      { month: 'Apr', consumed: 690, limit: 800 },
      { month: 'May', consumed: 740, limit: 800 },
      { month: 'Jun', consumed: 790, limit: 800 }, // Exhaustion risk
      { month: 'Jul', consumed: 830, limit: 800 }, // Over
    ];

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">License Consumption Forecast (6 Months)</h3>
            <p className="text-sm text-gray-500">Projected burn rate based on historical assignment trends.</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
              <div className="font-bold text-sm">Exhaustion Warning</div>
              <div className="text-xs">E5 pool projected to deplete in 47 days.</div>
            </div>
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="consumed" name="Consumed Licenses" stroke="#0f6cbd" fill="#0f6cbd" fillOpacity={0.1} strokeWidth={3} />
              <Area type="step" dataKey="limit" name="Total Purchased" stroke="#d83b01" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1] min-h-screen">
      
      {/* 1. Global Filter Engine (Sticky Top Bar) */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 text-[#0f6cbd] font-semibold mr-2">
              <Filter size={20} /> <span className="hidden sm:inline">Global Filters</span>
            </div>
            
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-[#0f6cbd]" value={skuFilter} onChange={e => setSkuFilter(e.target.value)}>
              <option value="All">All SKUs</option>
              {SKUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-[#0f6cbd]" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-[#0f6cbd]" value={countryFilter} onChange={e => setCountryFilter(e.target.value)}>
              <option value="All">All Countries</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-[#0f6cbd]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Account Status</option>
              <option value="Active">Active Users</option>
              <option value="Disabled">Disabled Users</option>
            </select>

            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-[#0f6cbd]" value={activityFilter} onChange={e => setActivityFilter(e.target.value)}>
              <option value="All">All Activity</option>
              <option value="<30">Active ({"<"}30 days)</option>
              <option value="30-90">Dormant (30-90 days)</option>
              <option value=">90">Inactive ({">"}90 days)</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-300">
              <button 
                onClick={() => setDataSource('Mock')}
                className={`px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Mock' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Mock Data
              </button>
              <button 
                onClick={() => setDataSource('Production')}
                className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded transition ${dataSource === 'Production' ? 'bg-green-100 shadow-sm text-green-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Database size={14} /> Production API
              </button>
            </div>
            <button onClick={resetFilters} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition" title="Reset Filters"><RotateCcw size={18} /></button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"><Save size={16}/> Save View</button>
            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#0f6cbd] border border-transparent rounded hover:bg-[#0c5391] transition shadow-sm"><Download size={16}/> Export Report</button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto w-full">
        
        {/* 2. Executive Snapshot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { title: 'Purchased', value: totalPurchased, color: 'text-gray-800', icon: <DollarSign size={20}/> },
            { title: 'Assigned', value: totalAssigned, color: 'text-blue-600', icon: <CheckCircle size={20}/> },
            { title: 'Available', value: totalPurchased - totalAssigned, color: 'text-green-600', icon: <Users size={20}/> },
            { title: 'Unused / Dormant', value: totalUnused, color: 'text-orange-500', icon: <Clock size={20}/>, action: () => setActivityFilter('>90') },
            { title: 'Disabled w/ License', value: disabledWithLicenses, color: 'text-red-600', icon: <AlertTriangle size={20}/>, action: () => setStatusFilter('Disabled') },
            { title: 'Shared/Guest Premium', value: sharedMailboxes + guestUsers, color: 'text-purple-600', icon: <Mail size={20}/> },
          ].map((card, i) => (
            <div 
              key={i} 
              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between ${card.action ? 'cursor-pointer hover:border-[#0f6cbd] hover:shadow-md transition-all' : ''}`}
              onClick={card.action}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
                <span className={`p-1 bg-gray-50 rounded ${card.color}`}>{card.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* 3. View Switcher (Tabs) */}
        <div className="mb-6 border-b border-gray-300">
          <nav className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'workload', label: 'Workload Analytics' },
              { id: 'allocation', label: 'Allocation' },
              { id: 'optimization', label: 'Optimization Insights' },
              { id: 'savings', label: 'Savings Simulator' },
              { id: 'forecast', label: 'Forecast' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.id ? 'text-[#0f6cbd]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0f6cbd]"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Render Active Tab Content */}
        <div>
          {loadingProd && activeTab !== 'workload' ? (
            <div className="p-10 text-center">Loading Production Data from Microsoft Graph...</div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'workload' && renderWorkloads()}
              {activeTab === 'allocation' && renderAllocation()}
              {activeTab === 'optimization' && renderOptimization()}
              {activeTab === 'savings' && renderSavings()}
              {activeTab === 'forecast' && renderForecast()}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default LicenseIntelligence;
