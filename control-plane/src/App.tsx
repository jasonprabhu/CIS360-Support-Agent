import { useState, useEffect } from 'react';
import { supportUseCases } from './useCases';
import LicenseIntelligence from './pages/LicenseIntelligence';
import AppEstateIntelligence from './pages/AppEstateIntelligence';
import WorkforceIntelligence from './pages/WorkforceIntelligence';
import MyWorkdayTab from './pages/MyWorkdayTab';
import './index.css';

// Placeholder Pages
const Overview = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h2 className="page-title">Good afternoon, Admin</h2>
      <p className="page-subtitle">The simplified view helps you focus on the most common tasks for organizations like yours.</p>
    </div>
    
    <div className="page-toolbar">
      <button className="toolbar-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
        Simplified view
      </button>
      <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 8px' }}></div>
      <button className="toolbar-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add user
      </button>
      <button className="toolbar-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        Reset password
      </button>
    </div>

    <h3 style={{ marginBottom: '16px' }}>For organizations like yours <a href="#" style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px' }}>Show more</a></h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
      <div className="ms-card" style={{ padding: '20px', borderLeft: '4px solid var(--info)' }}>
        <h4 style={{ marginBottom: '8px' }}>Active Agents</h4>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1</p>
      </div>
      <div className="ms-card" style={{ padding: '20px', borderLeft: '4px solid #8a2be2' }}>
        <h4 style={{ marginBottom: '8px' }}>Tasks Executed</h4>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1,204</p>
      </div>
      <div className="ms-card" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
        <h4 style={{ marginBottom: '8px' }}>Pending Approvals</h4>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>3</p>
      </div>
    </div>
    
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Product Roadmap</h3>
      <div className="ms-card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
          Upcoming features being rolled out for the CIS360 Agent ecosystem:
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <strong>Application Intelligence Dashboard</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>A new module under Workplace Intelligence to monitor application usage, shadow IT, and app-level optimizations.</p>
          </li>
          <li>
            <strong>License Unused Notification to Users</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Automated workflow to email users with dormant licenses, giving them a grace period before the license is reclaimed by the system.</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const AutomationHub = () => {
  const [enabledState, setEnabledState] = useState<Record<string, boolean>>({});
  const [activeUcTab, setActiveUcTab] = useState<'Entra' | 'EXO' | 'SPO' | 'ODFB'>('Entra');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.enabledUseCases && Object.keys(data.enabledUseCases).length > 0) {
          setEnabledState(data.enabledUseCases);
        } else {
          // Initialize defaults if backend has none
          const initial: Record<string, boolean> = {};
          supportUseCases.forEach(uc => initial[uc.id] = true);
          setEnabledState(initial);
        }
      })
      .catch(err => console.error('Failed to load enabledUseCases', err));
  }, []);

  const toggleUc = async (id: string) => {
    const nextState = { ...enabledState, [id]: !enabledState[id] };
    setEnabledState(nextState);
    
    try {
      // First, fetch current settings to preserve them
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      // Update with new enabledUseCases
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, enabledUseCases: nextState })
      });
    } catch (err) {
      console.error('Failed to save enabledUseCases to backend', err);
    }
  };

  const filteredUseCases = supportUseCases.filter(uc => uc.category === activeUcTab);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Automation Hub</h2>
        <p className="page-subtitle">Manage deployed support use cases for your organization.</p>
      </div>
      
      <div className="mb-6 flex border-b border-gray-200">
        {(['Entra', 'EXO', 'SPO', 'ODFB'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveUcTab(tab)}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeUcTab === tab
                ? 'border-[#5C2D91] text-[#5C2D91]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab} Use Cases
          </button>
        ))}
      </div>

      <div className="ms-card">
        <div className="ms-grid-header" style={{ gridTemplateColumns: '80px 100px 2fr 3fr 1fr 1fr' }}>
          <div>Status</div>
          <div>ID</div>
          <div>Name</div>
          <div>Description</div>
          <div>Category</div>
          <div>Actor</div>
        </div>
        {filteredUseCases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No {activeUcTab} use cases available yet.
          </div>
        ) : (
          filteredUseCases.map(uc => (
            <div key={uc.id} className="ms-grid-row" style={{ gridTemplateColumns: '80px 100px 2fr 3fr 1fr 1fr', opacity: enabledState[uc.id] ? 1 : 0.6 }}>
              <div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={!!enabledState[uc.id]} onChange={() => toggleUc(uc.id)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{uc.id}</div>
              <div style={{ fontWeight: 600 }}>{uc.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{uc.description}</div>
              <div><span className="ms-badge">{uc.category}</span></div>
              <div>{uc.actor}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AdminManagement = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h2 className="page-title">Admin Management</h2>
      <p className="page-subtitle">Configure administrator access and roles</p>
    </div>
    <div className="ms-card" style={{ padding: '24px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>No admins configured besides default.</p>
    </div>
  </div>
);

const Approvals = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h2 className="page-title">Approvals</h2>
      <p className="page-subtitle">View and manage pending approval workflows</p>
    </div>
    <div className="ms-card" style={{ padding: '24px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>All caught up.</p>
    </div>
  </div>
);

const AuditLogs = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h2 className="page-title">Audit Logs</h2>
      <p className="page-subtitle">Detailed logs of activity and execution</p>
    </div>
    <div className="ms-card" style={{ padding: '24px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Fetching recent logs...</p>
    </div>
  </div>
);

const SettingsPage = () => {
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [categoryMappings, setCategoryMappings] = useState<Record<string, string>>({});
  const [acsConnectionString, setAcsConnectionString] = useState('');
  const [acsPhoneNumber, setAcsPhoneNumber] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testingSms, setTestingSms] = useState(false);
  const [saving, setSaving] = useState(false);

  // Extract unique categories from support use cases
  const categories = Array.from(new Set(supportUseCases.map(uc => uc.category)));

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setBrandName(data.brandName || '');
        setLogoUrl(data.logoUrl || '');
        setCategoryMappings(data.categoryMappings || {});
        setAcsConnectionString(data.acsConnectionString || '');
        setAcsPhoneNumber(data.acsPhoneNumber || '');
        setSupportEmail(data.supportEmail || '');
        setSupportPhone(data.supportPhone || '');
        setSmtpHost(data.smtpHost || '');
        setSmtpPort(data.smtpPort || '');
        setSmtpUser(data.smtpUser || '');
        setSmtpPass(data.smtpPass || '');
        setSmtpFrom(data.smtpFrom || '');
      })
      .catch(err => console.error('Failed to load settings', err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryMappingChange = (category: string, channelId: string) => {
    setCategoryMappings(prev => ({ ...prev, [category]: channelId }));
  };

  const handleTestSms = async () => {
    if (!testPhoneNumber) {
      alert('Please enter a Test Phone Number.');
      return;
    }
    setTestingSms(true);
    try {
      const res = await fetch('/api/settings/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testPhoneNumber })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Test SMS sent successfully! Please check your phone.');
      } else {
        alert('Failed to send Test SMS: ' + (data.error || 'Unknown error. Check backend logs.'));
      }
    } catch (err) {
      console.error('Test SMS request failed', err);
      alert('Test SMS request failed.');
    }
    setTestingSms(false);
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a Test Email Address.');
      return;
    }
    setTestingEmail(true);
    try {
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Test Email sent successfully! Please check your inbox.');
      } else {
        alert('Failed to send Test Email: ' + (data.error || 'Unknown error. Check backend logs.'));
      }
    } catch (err) {
      console.error('Test Email request failed', err);
      alert('Test Email request failed.');
    }
    setTestingEmail(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, logoUrl, categoryMappings, acsConnectionString, acsPhoneNumber, supportEmail, supportPhone, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom })
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Failed to save settings.');
    }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Configure global bot settings and branding.</p>
      </div>
      <div className="ms-card" style={{ padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Brand / Company Name</label>
          <input 
            type="text" 
            value={brandName} 
            onChange={e => setBrandName(e.target.value)} 
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
            placeholder="e.g. Acme Corp" 
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Bot Logo</label>
          {logoUrl && <img src={logoUrl} alt="Logo Preview" style={{ height: '64px', marginBottom: '12px', display: 'block', objectFit: 'contain' }} />}
          <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleImageUpload} />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Recommended size: 64x64 PNG.</p>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Support Email</label>
          <input 
            type="text" 
            value={supportEmail} 
            onChange={e => setSupportEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
            placeholder="e.g. support@acme.com" 
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Support Phone Number</label>
          <input 
            type="text" 
            value={supportPhone} 
            onChange={e => setSupportPhone(e.target.value)} 
            style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
            placeholder="e.g. +1-800-555-HELP" 
          />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Used when a user requires manual fallback verification or requests a disabled automation.</p>
        </div>

        <div style={{ marginTop: '8px' }}>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '2px', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="ms-card" style={{ padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Email Configuration (SMTP)</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Configure your SMTP server to enable email OTP delivery for users without mobile numbers.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>SMTP Host</label>
              <input 
                type="text" 
                value={smtpHost} 
                onChange={e => setSmtpHost(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="e.g. smtp.gmail.com" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>SMTP Port</label>
              <input 
                type="text" 
                value={smtpPort} 
                onChange={e => setSmtpPort(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="e.g. 587 or 465" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>SMTP Username</label>
              <input 
                type="text" 
                value={smtpUser} 
                onChange={e => setSmtpUser(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="e.g. admin@acme.com" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>SMTP Password / App Password</label>
              <input 
                type="password" 
                value={smtpPass} 
                onChange={e => setSmtpPass(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="••••••••••••" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>From Email Address</label>
              <input 
                type="text" 
                value={smtpFrom} 
                onChange={e => setSmtpFrom(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="e.g. no-reply@acme.com" 
              />
            </div>
            
            <div style={{ marginTop: '16px', padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '4px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Test Email Delivery</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={testEmail} 
                  onChange={e => setTestEmail(e.target.value)} 
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                  placeholder="Enter email to test" 
                />
                <button 
                  onClick={handleTestEmail} 
                  disabled={testingEmail}
                  style={{ background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '8px 16px', borderRadius: '2px', fontWeight: 600 }}>
                  {testingEmail ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '2px', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="ms-card" style={{ padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Support Channel Routing</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Map each Automation Category to a specific Microsoft Teams Channel ID. If left blank, it will fall back to the default support channel.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(category => (
              <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ width: '150px', fontSize: '14px', fontWeight: 600 }}>{category}</label>
                <input 
                  type="text" 
                  value={categoryMappings[category] || ''} 
                  onChange={e => handleCategoryMappingChange(category, e.target.value)} 
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                  placeholder="e.g. 19:xxxxx@thread.v2" 
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '2px', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="ms-card" style={{ padding: '24px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Azure Communication Services (SMS)</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Configure ACS to enable real SMS delivery for OTPs and notifications. Leave blank to use Mock SMS (console logs).
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>ACS Connection String</label>
              <input 
                type="password" 
                value={acsConnectionString} 
                onChange={e => setAcsConnectionString(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="endpoint=https://..." 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>ACS Phone Number</label>
              <input 
                type="text" 
                value={acsPhoneNumber} 
                onChange={e => setAcsPhoneNumber(e.target.value)} 
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                placeholder="e.g. +18005551234" 
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Test Configuration</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={testPhoneNumber} 
                  onChange={e => setTestPhoneNumber(e.target.value)} 
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                  placeholder="Enter your phone number (e.g. +19876543210)" 
                />
                <button 
                  onClick={handleTestSms} 
                  disabled={testingSms || (!acsConnectionString && !acsPhoneNumber)} 
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '2px', fontWeight: 600 }}>
                  {testingSms ? 'Sending...' : 'Test SMS'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>*Make sure to Save Settings before testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const isTeamsTab = window.location.search.includes('view=teams-tab');
  const [activeTab, setActiveTab] = useState('overview');

  if (isTeamsTab) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MyWorkdayTab />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'license-intelligence': return <LicenseIntelligence />;
      case 'app-estate-intelligence': return <AppEstateIntelligence />;
      case 'workforce-intelligence': return <WorkforceIntelligence />;
      case 'my-workday': return <MyWorkdayTab />;
      case 'automation': return <AutomationHub />;
      case 'admins': return <AdminManagement />;
      case 'approvals': return <Approvals />;
      case 'audit': return <AuditLogs />;
      case 'settings': return <SettingsPage />;
      default: return <Overview />;
    }
  };

  return (
    <>
      {/* Top Ribbon */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="app-launcher">
            <div/><div/><div/>
            <div/><div/><div/>
            <div/><div/><div/>
          </div>
          <span className="topbar-title">CIS360 Admin Console</span>
        </div>
        
        <div className="topbar-search">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search" />
        </div>
        
        <div className="topbar-right">
          <div className="topbar-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div className="topbar-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0078d4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>JP</div>
        </div>
      </header>

      <div className="app-body">
        {/* Left Navigation Sidebar */}
        <nav className="sidebar">
          <ul className="nav-links">
            <li className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </li>
            
            <li className="nav-header" style={{ padding: '16px 20px 8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Workplace Intelligence
            </li>

            <li className={`nav-item ${activeTab === 'license-intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('license-intelligence')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              License Intelligence
            </li>
            
            <li className={`nav-item ${activeTab === 'app-estate-intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('app-estate-intelligence')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              App Estate Intelligence
            </li>

            <li className={`nav-item ${activeTab === 'workforce-intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('workforce-intelligence')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Workforce Intelligence
            </li>

            <li className="nav-header" style={{ padding: '16px 20px 8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Teams Extensions
            </li>

            <li className={`nav-item ${activeTab === 'my-workday' ? 'active' : ''}`} onClick={() => setActiveTab('my-workday')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              My Workday (Mock Tab)
            </li>

            <li className="nav-header" style={{ padding: '16px 20px 8px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Operations
            </li>

            <li className={`nav-item ${activeTab === 'automation' ? 'active' : ''}`} onClick={() => setActiveTab('automation')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Automation Hub
            </li>
            <li className={`nav-item ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Admin Management
            </li>
            <li className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Approvals
            </li>
            <li className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Audit Logs
            </li>
            <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default App;
