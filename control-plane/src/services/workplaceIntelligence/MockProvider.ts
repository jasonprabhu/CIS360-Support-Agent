import type { MasterIntelligenceData } from './types';

export const mockWorkplaceData: MasterIntelligenceData = {
  pulse: {
    healthScore: 87,
    domains: [
      { name: 'Identity', health: 92, trend: '+1.2%', signal: 'Stable', alerts: 2 },
      { name: 'Collaboration', health: 89, trend: '+4.2%', signal: 'High Activity', alerts: 0 },
      { name: 'Communication', health: 86, trend: '-0.8%', signal: 'Normal', alerts: 1 },
      { name: 'Content', health: 94, trend: '+0.5%', signal: 'Optimized', alerts: 0 },
      { name: 'Productivity', health: 88, trend: '+7.1%', signal: 'Adoption Growing', alerts: 3 },
      { name: 'AI', health: 96, trend: '+18.4%', signal: 'Accelerating', alerts: 0 },
    ],
  },
  services: [
    { name: 'Identity', health: 92, trend: '↑ 1.2%', signal: 'MFA Success 99%' },
    { name: 'Teams', health: 89, trend: '↑ 4.2%', signal: 'Meetings +12%' },
    { name: 'Exchange', health: 86, trend: '→ 0.8%', signal: 'Mailflow Stable' },
    { name: 'SharePoint', health: 94, trend: '↑ 0.5%', signal: 'Storage Optimized' },
    { name: 'OneDrive', health: 95, trend: '↑ 1.1%', signal: 'Sync Errors < 1%' },
    { name: 'Power Platform', health: 88, trend: '↑ 7.1%', signal: 'Makers +14%' },
    { name: 'Copilot', health: 96, trend: '↑ 18.4%', signal: 'Usage Spiking' },
  ],
  signals: [
    { id: '1', severity: 'ai', domain: 'AI / Copilot', explanation: 'AI adoption accelerating across Sales and Marketing business units.', trend: '↑ 18% WOW', timestamp: '10m ago', actionText: 'View Adoption' },
    { id: '2', severity: 'attention', domain: 'Identity', explanation: 'Failed authentication activity is slightly above the 30-day baseline.', trend: '↑ 4% spikes', timestamp: '1h ago', actionText: 'Investigate Auth' },
    { id: '3', severity: 'healthy', domain: 'Exchange', explanation: 'Repeated mailbox-related support requests have decreased.', trend: '↓ 12% WoW', timestamp: '3h ago', actionText: 'View Tickets' },
    { id: '4', severity: 'critical', domain: 'Teams', explanation: 'Cluster of repeated meeting access issues detected in EMEA region.', trend: 'Warning', timestamp: '4h ago', actionText: 'Analyze Friction' },
  ],
  friction: [
    { name: 'Identity', totalIssues: 124, issues: [{ name: 'MFA Setup', count: 45 }, { name: 'Password Reset', count: 52 }, { name: 'Group Access', count: 27 }] },
    { name: 'Teams', totalIssues: 89, issues: [{ name: 'Meeting Join', count: 41 }, { name: 'Guest Access', count: 32 }, { name: 'Audio/Video', count: 16 }] },
    { name: 'Exchange', totalIssues: 65, issues: [{ name: 'Shared Mailbox', count: 35 }, { name: 'Sync Issues', count: 20 }, { name: 'Spam Filter', count: 10 }] },
    { name: 'Power Platform', totalIssues: 112, issues: [{ name: 'Connector Fails', count: 68 }, { name: 'DLP Blocks', count: 24 }, { name: 'Premium License', count: 20 }] },
  ],
  automation: [
    { domain: 'Identity', recurringRequests: 32, automationsAvailable: 14, effortSaved: '18 hrs/mo' },
    { domain: 'Teams', recurringRequests: 21, automationsAvailable: 11, effortSaved: '12 hrs/mo' },
    { domain: 'Exchange', recurringRequests: 18, automationsAvailable: 8, effortSaved: '9 hrs/mo' },
    { domain: 'SharePoint', recurringRequests: 9, automationsAvailable: 5, effortSaved: '4 hrs/mo' },
  ],
  actions: [
    { id: 'A1', category: 'Critical', domain: 'Teams', issue: 'Repeated Meeting Access Issues', evidence: '47 related requests in the last 7 days.', impact: 'High user friction in EMEA', recommendedStep: 'Investigate Routing' },
    { id: 'A2', category: 'Attention', domain: 'Power Platform', issue: 'Orphaned Premium Flows', evidence: '14 flows failing due to disabled owner accounts.', impact: 'Broken business processes', recommendedStep: 'Reassign Owners' },
    { id: 'A3', category: 'Opportunity', domain: 'Identity', issue: 'Automate Guest Access', evidence: '32 manual guest access requests this week.', impact: 'Save 18 hours per month', recommendedStep: 'Deploy Workflow' },
  ],
  briefing: [
    'Teams collaboration activity increased significantly in the last 24 hours.',
    'Authentication friction is elevated for a subset of users in EMEA.',
    'Several recurring support requests have matching automations available in the Hub.',
  ],
  scenarios: [
    {
      id: 'flow-sap-outage',
      query: 'We are seeing an increase in failed flows and connector incidents. What is driving this?',
      title: 'Power Platform / SAP ERP Connector Authentication Failure',
      domain: 'Power Platform',
      category: 'Critical',
      timestamp: '2 hours ago',
      signal: {
        title: 'Anomaly in Automated Cloud Flows',
        metricBadge: '142 Failed Runs',
        description: 'Sudden spike in execution errors across critical Finance and HR Power Automate flows.',
        timestamp: 'Today, 08:35 AM UTC',
        affectedScope: '14 Production Flows / 48 Users',
        impactSummary: 'Automated SAP Vendor Invoicing & Payroll Exception flows are blocked.'
      },
      pattern: {
        title: '94.3% Correlation with Custom Connector Error 401',
        correlationText: 'Errors concentrated immediately following scheduled Entra ID credential rotation cycle.',
        telemetryPoints: [
          { label: '06:00', value: 2, baseline: 3 },
          { label: '07:00', value: 4, baseline: 3 },
          { label: '08:00', value: 8, baseline: 4 },
          { label: '08:30 (Rotated)', value: 84, baseline: 3 },
          { label: '09:00', value: 128, baseline: 4 },
          { label: '10:00', value: 142, baseline: 5 }
        ],
        relatedComponents: ['Power Automate Cloud', 'SAP-ERP-Sync Connector', 'Azure Key Vault API', 'Finance SP Gateway'],
        affectedUsersCount: 48
      },
      insight: {
        title: 'Root Cause: Service Principal Secret Rotated Without Connector Token Refresh',
        causalExplanation: 'A scheduled password rotation policy executed at 08:00 AM rotated the client secret for Service Principal `sp-sap-erp-prod`. The Power Platform custom connector retained cached credentials, resulting in persistent 401 Unauthorized API rejections.',
        rootCause: 'Expired OAuth Client Secret in Custom Connector Connection Pool',
        confidence: 98.6,
        riskLevel: 'Critical',
        technicalFacts: [
          'Service Principal: sp-sap-erp-prod (AppID: e82b91-4c1)',
          'Error Signature: 401 Unauthorized (InvalidClientSecretToken)',
          'Stalled Queue: 142 invoices totaling $1.84M awaiting approval'
        ]
      },
      recommendation: {
        title: 'Auto-Remediate: Refresh Connection Secret & Auto-Replay Stalled Queue',
        steps: [
          'Retrieve latest Key Vault client secret for sp-sap-erp-prod and rebind connector credentials.',
          'Trigger auto-replay for all 142 failed workflow runs in dependency order.',
          'Broadcast proactive status update to #Finance-Ops Teams channel.'
        ],
        ticketDeflectionForecast: 85,
        downtimeAvoidedHours: 4.5,
        laborHoursSaved: 18.5
      },
      action: {
        label: '⚡ Execute Auto-Heal & Replay 142 Flows',
        executionType: 'auto-replay',
        auditNumber: 'CHG-AUTO-89210',
        successMessage: 'Connector credentials refreshed via Key Vault. All 142 failed flow runs queued for automated replay.',
        affectedResource: 'Custom Connector: SAP-ERP-Sync'
      }
    },
    {
      id: 'exchange-apac-auth',
      query: 'Why is there a spike in Exchange & Identity tickets in APAC today?',
      title: 'APAC Outlook Desktop Modern Authentication Loop',
      domain: 'Exchange & Identity',
      category: 'Attention',
      timestamp: '90 minutes ago',
      signal: {
        title: 'MFA Authentication Failures on Outlook Desktop',
        metricBadge: '320 Auth Failures',
        description: 'Repeated prompt loop on Outlook Desktop client for employees in Singapore & Sydney.',
        timestamp: 'Today, 09:15 AM UTC',
        affectedScope: '85 Affected Employees / APAC Region',
        impactSummary: 'Users unable to sync Exchange Online mailboxes from office network.'
      },
      pattern: {
        title: '100% Policy Match: CAP-Enforce-TrustedLocation',
        correlationText: 'Traffic originated from newly allocated enterprise egress range not yet whitelisted in Entra ID.',
        telemetryPoints: [
          { label: '07:00', value: 12, baseline: 10 },
          { label: '08:00', value: 18, baseline: 14 },
          { label: '09:00 (ISP Shift)', value: 194, baseline: 12 },
          { label: '09:30', value: 280, baseline: 15 },
          { label: '10:00', value: 320, baseline: 14 }
        ],
        relatedComponents: ['Entra Conditional Access', 'Exchange Online Modern Auth', 'Singapore WAN Gateway', 'Outlook Desktop Client'],
        affectedUsersCount: 85
      },
      insight: {
        title: 'Root Cause: ISP Public Egress IP Range Shift Missed in Named Locations',
        causalExplanation: 'The primary ISP for the Singapore regional hub migrated outbound routing to a new IP subnet (165.225.104.0/24). Entra ID Conditional Access evaluated this as an Untrusted Network Location, demanding step-up MFA that desktop Outlook failed to complete.',
        rootCause: 'Missing Subnet in Entra ID Named Locations Whitelist',
        confidence: 99.2,
        riskLevel: 'High',
        technicalFacts: [
          'Triggered Policy: CAP-Enforce-TrustedLocation-M365',
          'Unrecognized Subnet: 165.225.104.0/24 (Singapore Egress 02)',
          'Affected Clients: Outlook for Windows (v2402 Build 17328)'
        ]
      },
      recommendation: {
        title: 'Auto-Remediate: Add Subnet to Named Locations & Clear User Token Caches',
        steps: [
          'Append subnet 165.225.104.0/24 to Entra ID Named Location: "APAC-Corporate-Egress".',
          'Issue non-disruptive PRT token refresh for 85 impacted APAC user sessions.',
          'Log proactive resolution notice to ServiceNow IT Incident Dashboard.'
        ],
        ticketDeflectionForecast: 120,
        downtimeAvoidedHours: 3.2,
        laborHoursSaved: 24.0
      },
      action: {
        label: '🛡️ Update Named Location & Refresh Sessions',
        executionType: 'conditional-access',
        auditNumber: 'CHG-AUTO-89211',
        successMessage: 'Subnet added to Entra ID Named Locations. Token refresh broadcast issued to 85 APAC client devices.',
        affectedResource: 'Entra Named Location: APAC-Corporate-Egress'
      }
    },
    {
      id: 'teams-quality-anomaly',
      query: 'What is causing the sudden drop in call quality across EU offices?',
      title: 'Frankfurt Regional Office Teams Real-Time Media Degradation',
      domain: 'Teams & Collaboration',
      category: 'Opportunity',
      timestamp: '3 hours ago',
      signal: {
        title: 'Audio Jitter & Packet Loss Anomaly',
        metricBadge: '8.4% Packet Loss',
        description: 'Audio dropouts and video freezing detected in 45 concurrent Teams executive calls.',
        timestamp: 'Today, 10:00 AM UTC',
        affectedScope: '45 Active Meetings / 180 Participants',
        impactSummary: 'Executive all-hands and customer meetings degraded in Frankfurt facility.'
      },
      pattern: {
        title: 'WAN Egress Bandwidth Saturated at 99.2%',
        correlationText: 'Heavy background download traffic saturated QoS bandwidth allocation for UDP voice packets.',
        telemetryPoints: [
          { label: '08:00', value: 0.8, baseline: 0.5 },
          { label: '09:00', value: 1.2, baseline: 0.6 },
          { label: '09:45 (Patch Push)', value: 6.4, baseline: 0.8 },
          { label: '10:00', value: 8.4, baseline: 0.7 },
          { label: '10:30', value: 7.9, baseline: 0.6 }
        ],
        relatedComponents: ['Teams Real-Time Media (UDP 3478-3481)', 'Frankfurt SD-WAN Edge', 'Windows Update Delivery Opt (BITS)'],
        affectedUsersCount: 180
      },
      insight: {
        title: 'Root Cause: Unscheduled Windows OS Cumulative Patch Distribution During Business Hours',
        causalExplanation: 'A third-party endpoint patch orchestrator initiated a 4.2 GB OS update package deployment across 350 workstations simultaneously without bandwidth rate-limiting, choking real-time audio/video UDP queues.',
        rootCause: 'Unthrottled Endpoint Software Distribution Saturated Local WAN Pipe',
        confidence: 96.8,
        riskLevel: 'Medium',
        technicalFacts: [
          'Bandwidth Peak: 994 Mbps on 1 Gbps symmetric link',
          'Teams QoS Tag: DSCP 46 (Audio) / DSCP 34 (Video)',
          'Source of Load: BITS / Delivery Optimization (Endpoints 10.14.0.0/16)'
        ]
      },
      recommendation: {
        title: 'Auto-Remediate: Enforce Strict BITS Bandwidth Throttling & Elevate Teams QoS Priority',
        steps: [
          'Issue Intune/GPO policy override capping BITS foreground/background transfer to 15% link capacity.',
          'Dynamically prioritize UDP 3478-3481 media traffic on edge SD-WAN profile.',
          'Post resolution confirmation to Frankfurt Facilities Operations channel.'
        ],
        ticketDeflectionForecast: 60,
        downtimeAvoidedHours: 2.0,
        laborHoursSaved: 12.0
      },
      action: {
        label: '🌐 Enforce Teams Real-Time QoS & Throttle BITS',
        executionType: 'qos-throttle',
        auditNumber: 'CHG-AUTO-89212',
        successMessage: 'BITS distribution bandwidth throttled to 15%. SD-WAN QoS priority applied for Teams voice/video traffic.',
        affectedResource: 'SD-WAN QoS Policy: Frankfurt-Branch-01'
      }
    }
  ]
};

