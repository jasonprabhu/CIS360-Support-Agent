export interface AppEstateRecord {
  id: string;
  name: string;
  publisher: string;
  category: string;
  version: string;
  platform: 'Windows' | 'Mac' | 'Mobile';
  installations: number;
  users: number;
  department: string;
  country: string;
  supportStatus: 'Supported' | 'Unsupported' | 'Deprecated';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  usageStatus: 'Active' | 'Rarely Used' | 'Unused';
  lifecycleStage: 'New' | 'Active' | 'Aging' | 'Unsupported' | 'Deprecated';
  cveCount: number;
  isUnauthorized: boolean;
  isDuplicate: boolean; // Flag if it's considered part of a duplicate functional group
  monthlyCost: number; // Cost per user
  eolDate?: string;
  businessOwner: string;
}

const PUBLISHERS = ['Microsoft', 'Adobe', 'Google', 'Zoom', 'Oracle', 'Atlassian', 'Autodesk', 'Salesforce', 'Slack', 'Cisco'];
const CATEGORIES = ['Collaboration', 'Browsers', 'Security', 'Utilities', 'Design', 'Development', 'Finance', 'HR', 'CRM'];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'IT'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Japan', 'India', 'Brazil'];

const UNAUTHORIZED_APPS = ['TeamViewer', 'AnyDesk', 'uTorrent', 'NordVPN', 'BitTorrent', 'WhatsApp Desktop'];
const PREMIUM_RARELY_USED = ['Visio', 'Project', 'Power BI Pro', 'AutoCAD', 'Adobe Creative Cloud'];
const DUPLICATE_GROUPS = [
  ['Zoom', 'Teams', 'Webex'],
  ['Adobe Reader', 'Foxit Reader', 'Nitro PDF']
];

export const generateMockAppEstateData = (): AppEstateRecord[] => {
  const apps: AppEstateRecord[] = [];
  const TOTAL_APPS = 842;
  
  // Seed with some known apps to ensure they appear
  const knownApps = [
    { name: 'Chrome', publisher: 'Google', cat: 'Browsers' },
    { name: 'Teams', publisher: 'Microsoft', cat: 'Collaboration' },
    { name: 'Zoom', publisher: 'Zoom', cat: 'Collaboration' },
    { name: 'Webex', publisher: 'Cisco', cat: 'Collaboration' },
    { name: 'Adobe Reader', publisher: 'Adobe', cat: 'Utilities' },
    { name: 'Foxit Reader', publisher: 'Foxit', cat: 'Utilities' },
    { name: 'Visio', publisher: 'Microsoft', cat: 'Design' },
    { name: 'Project', publisher: 'Microsoft', cat: 'Utilities' },
    { name: 'TeamViewer', publisher: 'TeamViewer', cat: 'Utilities' },
    { name: 'uTorrent', publisher: 'BitTorrent', cat: 'Utilities' },
  ];

  for (let i = 0; i < TOTAL_APPS; i++) {
    const isKnown = i < knownApps.length;
    const known = isKnown ? knownApps[i] : null;

    const name = known ? known.name : `Enterprise App ${i}`;
    const publisher = known ? known.publisher : PUBLISHERS[Math.floor(Math.random() * PUBLISHERS.length)];
    const category = known ? known.cat : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    
    const isUnauthorized = UNAUTHORIZED_APPS.includes(name);
    const isPremium = PREMIUM_RARELY_USED.includes(name);
    const isDuplicate = DUPLICATE_GROUPS.some(group => group.includes(name));

    // Distribute versions
    const majorVer = Math.floor(Math.random() * 20) + 1;
    const minorVer = Math.floor(Math.random() * 10);
    const version = known?.name === 'Chrome' 
      ? `v${120 + Math.floor(Math.random() * 8)}` 
      : `${majorVer}.${minorVer}`;

    const supportRand = Math.random();
    const supportStatus = supportRand > 0.95 ? 'Deprecated' : supportRand > 0.85 ? 'Unsupported' : 'Supported';

    const riskRand = Math.random();
    const riskLevel = isUnauthorized ? 'Critical' : (supportStatus === 'Unsupported' || supportStatus === 'Deprecated') ? 'High' : riskRand > 0.9 ? 'High' : riskRand > 0.7 ? 'Medium' : 'Low';

    const usageRand = Math.random();
    const usageStatus = isPremium ? (usageRand > 0.5 ? 'Rarely Used' : 'Unused') : (usageRand > 0.8 ? 'Rarely Used' : usageRand > 0.95 ? 'Unused' : 'Active');

    const platformRand = Math.random();
    const platform = platformRand > 0.6 ? 'Windows' : platformRand > 0.9 ? 'Mac' : 'Mobile';

    const lifecycleRand = Math.random();
    const lifecycleStage = supportStatus === 'Deprecated' ? 'Deprecated' : supportStatus === 'Unsupported' ? 'Unsupported' : lifecycleRand > 0.8 ? 'Aging' : lifecycleRand > 0.1 ? 'Active' : 'New';

    apps.push({
      id: `app-${i}`,
      name,
      publisher,
      category,
      version,
      platform,
      installations: Math.floor(Math.random() * 2000) + 10,
      users: Math.floor(Math.random() * 1800) + 5,
      department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      supportStatus,
      riskLevel,
      usageStatus,
      lifecycleStage,
      cveCount: riskLevel === 'High' || riskLevel === 'Critical' ? Math.floor(Math.random() * 10) + 1 : 0,
      isUnauthorized,
      isDuplicate,
      monthlyCost: isPremium ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 10),
      eolDate: supportStatus !== 'Supported' ? '2025-12-31' : undefined,
      businessOwner: `Owner ${Math.floor(Math.random() * 50)}`
    });
  }

  return apps;
};

export const mockAppEstate = generateMockAppEstateData();
