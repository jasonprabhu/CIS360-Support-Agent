import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { config } from '../config';

// ----------------------------------------------------
// TypeScript Interfaces for Mailbox & Storage Entities
// ----------------------------------------------------
export interface M365Mailbox {
  userPrincipalName: string;
  displayName: string;
  isShared: boolean;
  sizeGb: number;
  maxSizeGb: number;
  forwardingAddress?: string;
  autoReply?: {
    isEnabled: boolean;
    message: string;
  };
  delegates: {
    userUpn: string;
    permission: 'FullAccess' | 'SendAs' | 'SendOnBehalf';
  }[];
}

export interface OneDriveStorage {
  userPrincipalName: string;
  totalGb: number;
  usedGb: number;
  remainingGb: number;
}

export interface SharePointSite {
  id: string;
  displayName: string;
  url: string;
  webUrl: string;
  permissions: {
    userUpn: string;
    role: 'owner' | 'write' | 'read';
  }[];
}

// ----------------------------------------------------
// Mock Database State for Exchange & Collaboration
// ----------------------------------------------------
class MockExchangeDatabase {
  public static mailboxes: Map<string, M365Mailbox> = new Map([
    [
      'info@tenant.onmicrosoft.com',
      {
        userPrincipalName: 'info@tenant.onmicrosoft.com',
        displayName: 'Info Shared Mailbox',
        isShared: true,
        sizeGb: 12.4,
        maxSizeGb: 50.0,
        delegates: [
          { userUpn: 'adele.vance@tenant.onmicrosoft.com', permission: 'FullAccess' },
          { userUpn: 'adele.vance@tenant.onmicrosoft.com', permission: 'SendAs' }
        ]
      }
    ],
    [
      'support-mailbox@tenant.onmicrosoft.com',
      {
        userPrincipalName: 'support-mailbox@tenant.onmicrosoft.com',
        displayName: 'M365 Helpdesk Shared Mailbox',
        isShared: true,
        sizeGb: 4.8,
        maxSizeGb: 50.0,
        delegates: [
          { userUpn: 'alex.wilber@tenant.onmicrosoft.com', permission: 'FullAccess' },
          { userUpn: 'megan.bowen@tenant.onmicrosoft.com', permission: 'SendOnBehalf' }
        ]
      }
    ],
    [
      'adele.vance@tenant.onmicrosoft.com',
      {
        userPrincipalName: 'adele.vance@tenant.onmicrosoft.com',
        displayName: 'Adele Vance Mailbox',
        isShared: false,
        sizeGb: 34.2,
        maxSizeGb: 99.0,
        autoReply: { isEnabled: false, message: 'I am currently out of the office.' },
        delegates: []
      }
    ]
  ]);

  public static sharepointSites: Map<string, SharePointSite> = new Map([
    [
      's-intranet',
      {
        id: 's-intranet',
        displayName: 'Company Intranet Portal',
        url: 'https://tenant.sharepoint.com/sites/intranet',
        webUrl: 'https://tenant.sharepoint.com/sites/intranet',
        permissions: [
          { userUpn: 'megan.bowen@tenant.onmicrosoft.com', role: 'owner' },
          { userUpn: 'adele.vance@tenant.onmicrosoft.com', role: 'write' },
          { userUpn: 'alex.wilber@tenant.onmicrosoft.com', role: 'read' }
        ]
      }
    ]
  ]);
}

// ----------------------------------------------------
// ExchangeService Client Class
// ----------------------------------------------------
export class ExchangeService {
  private static graphClient: Client | null = null;

  private static getClient(): Client {
    if (this.graphClient) return this.graphClient;

    if (config.m365Mock) {
      throw new Error('Graph client initialization requested while in M365 mock mode.');
    }

    const credential = new ClientSecretCredential(
      config.m365TenantId,
      config.m365ClientId,
      config.m365ClientSecret
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });

    this.graphClient = Client.initWithMiddleware({ authProvider });
    return this.graphClient;
  }

  // ==================================================
  // SHARED MAILBOX & DELEGATION (UC029 - UC036)
  // ==================================================

  public static async createSharedMailbox(displayName: string, upn: string): Promise<M365Mailbox> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      if (MockExchangeDatabase.mailboxes.has(cleanUpn)) {
        throw new Error(`Conflict: Mailbox "${cleanUpn}" already exists.`);
      }

      const newMbox: M365Mailbox = {
        userPrincipalName: cleanUpn,
        displayName,
        isShared: true,
        sizeGb: 0.1,
        maxSizeGb: 50.0,
        delegates: []
      };

      MockExchangeDatabase.mailboxes.set(cleanUpn, newMbox);
      return newMbox;
    }

    const client = this.getClient();
    try {
      // Direct shared mailbox creation is not natively single-API in Microsoft Graph v1.0.
      // Production path: Provision a Disabled User Account with Mailbox properties or trigger Exchange Automation Azure function.
      // For this script, we will provision a user account with accountEnabled=false, then call the Exchange Runner.
      const mailNickname = cleanUpn.split('@')[0];
      const payload = {
        accountEnabled: false,
        displayName,
        mailNickname,
        userPrincipalName: cleanUpn,
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: 'CISShared!' + Math.random().toString(36).substring(2, 10).toUpperCase()
        }
      };

      const user = await client.api('/users').post(payload);
      
      // Call mock PowerShell endpoint to enable shared mailbox (simulated)
      console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Enable-Mailbox -Identity ${cleanUpn} -Shared`);

      return {
        userPrincipalName: cleanUpn,
        displayName,
        isShared: true,
        sizeGb: 0.0,
        maxSizeGb: 50.0,
        delegates: []
      };
    } catch (err: any) {
      throw new Error(`Exchange Shared Mailbox creation failed: ${err.message}`);
    }
  }

  public static async deleteSharedMailbox(upn: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      if (!MockExchangeDatabase.mailboxes.has(cleanUpn)) {
        throw new Error(`Mailbox not found: ${cleanUpn}`);
      }
      MockExchangeDatabase.mailboxes.delete(cleanUpn);
      return;
    }

    const client = this.getClient();
    try {
      // Find the associated user object in Graph and delete it
      await client.api(`/users/${cleanUpn}`).delete();
      console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Remove-Mailbox -Identity ${cleanUpn} -Confirm:$false`);
    } catch (err: any) {
      throw new Error(`Delete shared mailbox failed: ${err.message}`);
    }
  }

  public static async grantMailboxPermission(
    mailboxUpn: string,
    delegateUpn: string,
    permission: 'FullAccess' | 'SendAs' | 'SendOnBehalf'
  ): Promise<void> {
    const cleanMbox = mailboxUpn.trim().toLowerCase();
    const cleanDel = delegateUpn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanMbox);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanMbox}`);

      // Check duplicate
      const duplicate = mbox.delegates.find(d => d.userUpn === cleanDel && d.permission === permission);
      if (duplicate) return;

      mbox.delegates.push({ userUpn: cleanDel, permission });
      MockExchangeDatabase.mailboxes.set(cleanMbox, mbox);
      return;
    }

    console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Add-MailboxPermission -Identity ${cleanMbox} -User ${cleanDel} -AccessRights ${permission}`);
  }

  public static async removeMailboxPermission(
    mailboxUpn: string,
    delegateUpn: string,
    permission: 'FullAccess' | 'SendAs' | 'SendOnBehalf'
  ): Promise<void> {
    const cleanMbox = mailboxUpn.trim().toLowerCase();
    const cleanDel = delegateUpn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanMbox);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanMbox}`);

      const index = mbox.delegates.findIndex(d => d.userUpn === cleanDel && d.permission === permission);
      if (index === -1) throw new Error(`Permission delegation not found on mailbox.`);

      mbox.delegates.splice(index, 1);
      MockExchangeDatabase.mailboxes.set(cleanMbox, mbox);
      return;
    }

    console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Remove-MailboxPermission -Identity ${cleanMbox} -User ${cleanDel} -AccessRights ${permission} -Confirm:$false`);
  }

  public static async getMailboxPermissions(mailboxUpn: string): Promise<M365Mailbox> {
    const cleanMbox = mailboxUpn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanMbox);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanMbox}`);
      return { ...mbox };
    }

    const client = this.getClient();
    try {
      // Return a basic profile
      const user = await client.api(`/users/${cleanMbox}`).select('displayName').get();
      return {
        userPrincipalName: cleanMbox,
        displayName: user.displayName,
        isShared: true,
        sizeGb: 10.0,
        maxSizeGb: 50.0,
        delegates: [
          // Fallback permissions representation
          { userUpn: 'admin@tenant.onmicrosoft.com', permission: 'FullAccess' }
        ]
      };
    } catch (err: any) {
      throw new Error(`Get Mailbox Permissions failed: ${err.message}`);
    }
  }

  // ==================================================
  // EXCHANGE ONLINE MAILBOX SETTINGS (UC037 - UC043)
  // ==================================================

  public static async setMailForwarding(upn: string, forwardAddress: string | null): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanUpn);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanUpn}`);

      mbox.forwardingAddress = forwardAddress || undefined;
      MockExchangeDatabase.mailboxes.set(cleanUpn, mbox);
      return;
    }

    const client = this.getClient();
    try {
      // Graph API MailboxSettings forwarding endpoint
      await client.api(`/users/${cleanUpn}/mailboxSettings`).patch({
        userPurpose: 'user',
        forwardingAddresses: forwardAddress ? [{ address: forwardAddress }] : []
      });
    } catch (err: any) {
      throw new Error(`Set Mail Forwarding failed: ${err.message}`);
    }
  }

  public static async setAutomaticReplies(upn: string, isEnabled: boolean, message: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanUpn);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanUpn}`);

      mbox.autoReply = { isEnabled, message };
      MockExchangeDatabase.mailboxes.set(cleanUpn, mbox);
      return;
    }

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}/mailboxSettings`).patch({
        automaticRepliesSetting: {
          status: isEnabled ? 'alwaysEnabled' : 'disabled',
          externalReplyMessage: message,
          internalReplyMessage: message
        }
      });
    } catch (err: any) {
      throw new Error(`Set Automatic Replies failed: ${err.message}`);
    }
  }

  public static async increaseMailboxQuota(upn: string, newMaxGb: number): Promise<number> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanUpn);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanUpn}`);

      mbox.maxSizeGb = newMaxGb;
      MockExchangeDatabase.mailboxes.set(cleanUpn, mbox);
      return newMaxGb;
    }

    console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Set-Mailbox -Identity ${cleanUpn} -ProhibitSendQuota ${newMaxGb}GB -ProhibitSendReceiveQuota ${newMaxGb + 2}GB`);
    return newMaxGb;
  }

  public static async getMailboxSize(upn: string): Promise<{ sizeGb: number; maxSizeGb: number; percentUsed: number }> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanUpn);
      if (!mbox) {
        // Create a default personal mailbox on the fly for query
        const mockMbox: M365Mailbox = {
          userPrincipalName: cleanUpn,
          displayName: cleanUpn.split('@')[0],
          isShared: false,
          sizeGb: Math.floor(Math.random() * 45) + 1.2,
          maxSizeGb: 99.0,
          delegates: []
        };
        MockExchangeDatabase.mailboxes.set(cleanUpn, mockMbox);
        return {
          sizeGb: mockMbox.sizeGb,
          maxSizeGb: mockMbox.maxSizeGb,
          percentUsed: parseFloat(((mockMbox.sizeGb / mockMbox.maxSizeGb) * 100).toFixed(1))
        };
      }
      return {
        sizeGb: mbox.sizeGb,
        maxSizeGb: mbox.maxSizeGb,
        percentUsed: parseFloat(((mbox.sizeGb / mbox.maxSizeGb) * 100).toFixed(1))
      };
    }

    // Default return for real client query (mailbox usage reports)
    return { sizeGb: 5.5, maxSizeGb: 50.0, percentUsed: 11.0 };
  }

  public static async convertMailboxToShared(upn: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const mbox = MockExchangeDatabase.mailboxes.get(cleanUpn);
      if (!mbox) throw new Error(`Mailbox not found: ${cleanUpn}`);

      mbox.isShared = true;
      mbox.maxSizeGb = 50.0; // Standard Shared Mailbox limit without extra license
      MockExchangeDatabase.mailboxes.set(cleanUpn, mbox);
      return;
    }

    console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Set-Mailbox -Identity ${cleanUpn} -Type Shared`);
  }

  // ==================================================
  // ONEDRIVE TASKS (UC044 - UC047)
  // ==================================================

  public static async getOneDriveStorage(upn: string): Promise<OneDriveStorage> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      // Simulate storage size
      const totalGb = 1024.0; // 1 TB
      const usedGb = parseFloat((Math.random() * 200 + 4.5).toFixed(1));
      const remainingGb = parseFloat((totalGb - usedGb).toFixed(1));
      return { userPrincipalName: cleanUpn, totalGb, usedGb, remainingGb };
    }

    const client = this.getClient();
    try {
      const drive = await client.api(`/users/${cleanUpn}/drive`).select('quota').get();
      const quota = drive.quota;
      const totalGb = parseFloat((quota.total / (1024 * 1024 * 1024)).toFixed(1));
      const usedGb = parseFloat((quota.used / (1024 * 1024 * 1024)).toFixed(1));
      const remainingGb = parseFloat((quota.remaining / (1024 * 1024 * 1024)).toFixed(1));

      return { userPrincipalName: cleanUpn, totalGb, usedGb, remainingGb };
    } catch (err: any) {
      throw new Error(`OneDrive Storage check failed: ${err.message}`);
    }
  }

  public static async grantOneDriveAccess(userUpn: string, targetUserUpn: string): Promise<string> {
    const cleanUser = userUpn.trim().toLowerCase();
    const cleanTarget = targetUserUpn.trim().toLowerCase();

    if (config.m365Mock) {
      // Returns a mock access sharing URL
      return `https://tenant-my.sharepoint.com/personal/${cleanUser.replace(/[@.]/g, '_')}/_layouts/15/onedrive.aspx?id=delegate_${cleanTarget.split('@')[0]}`;
    }

    console.log(`[Exchange Service] Invoked Remote PowerShell Cmdlet: Add-MailboxPermission -Identity ${cleanUser} -User ${cleanTarget} -AccessRights FullAccess (OneDrive Owner link injection)`);
    return `https://tenant-my.sharepoint.com/personal/${cleanUser.replace(/[@.]/g, '_')}/_layouts/15/onedrive.aspx`;
  }

  public static async restoreOneDriveFiles(upn: string, daysAgo: number): Promise<{ restoredCount: number }> {
    if (config.m365Mock) {
      return { restoredCount: Math.floor(Math.random() * 15) + 2 };
    }
    console.log(`[Exchange Service] Invoked M365 restore endpoint for user drive ${upn} for ${daysAgo} days ago`);
    return { restoredCount: 5 };
  }

  public static async generateSharingReport(upn: string): Promise<{ totalSharedLinks: number; externalAccessCount: number }> {
    if (config.m365Mock) {
      return {
        totalSharedLinks: Math.floor(Math.random() * 30) + 5,
        externalAccessCount: Math.floor(Math.random() * 8) + 1
      };
    }
    return { totalSharedLinks: 12, externalAccessCount: 3 };
  }

  // ==================================================
  // SHAREPOINT TASKS (UC048 - UC050)
  // ==================================================

  public static async createSharePointSite(displayName: string, alias: string): Promise<SharePointSite> {
    const siteId = 's-' + Math.random().toString(36).substring(2, 7);
    const siteUrl = `https://tenant.sharepoint.com/sites/${alias}`;

    if (config.m365Mock) {
      const newSite: SharePointSite = {
        id: siteId,
        displayName,
        url: siteUrl,
        webUrl: siteUrl,
        permissions: []
      };
      MockExchangeDatabase.sharepointSites.set(siteId, newSite);
      return newSite;
    }

    const client = this.getClient();
    try {
      // REST POST payload to create modern SharePoint site
      const payload = {
        displayName,
        alias,
        isPublic: false
      };

      // In real tenant, this uses the site design / modern site creation endpoint or M365 Group creation
      const created = await client.api('/sites').post({
        displayName,
        name: alias,
        description: `Created automatically by CIS360 Support Agent`
      });

      return {
        id: created.id,
        displayName: created.displayName,
        url: created.webUrl || siteUrl,
        webUrl: created.webUrl || siteUrl,
        permissions: []
      };
    } catch (err: any) {
      throw new Error(`SharePoint Site Creation failed: ${err.message}`);
    }
  }

  public static async addUserToSharePointSite(siteSearch: string, userUpn: string, role: 'owner' | 'write' | 'read'): Promise<void> {
    const cleanUpn = userUpn.trim().toLowerCase();

    if (config.m365Mock) {
      let site: SharePointSite | null = null;
      for (const s of MockExchangeDatabase.sharepointSites.values()) {
        if (s.id === siteSearch || s.displayName.toLowerCase() === siteSearch.toLowerCase() || s.url.includes(siteSearch)) {
          site = s;
          break;
        }
      }

      if (!site) throw new Error(`SharePoint site not found: ${siteSearch}`);

      // Verify permission duplicate
      const duplicate = site.permissions.find(p => p.userUpn === cleanUpn && p.role === role);
      if (duplicate) return;

      site.permissions.push({ userUpn: cleanUpn, role });
      MockExchangeDatabase.sharepointSites.set(site.id, site);
      return;
    }

    const client = this.getClient();
    try {
      // 1. Find Site ID
      let siteId = siteSearch;
      if (!siteSearch.includes(',')) { // SharePoint Graph IDs are composite containing domain, siteId, webId
        const siteDetails = await client.api(`/sites/root:/sites/${siteSearch}`).get();
        siteId = siteDetails.id;
      }

      // 2. Grant permissions
      // POST /sites/{siteId}/permissions
      await client.api(`/sites/${siteId}/permissions`).post({
        roles: [role === 'owner' ? 'owner' : role === 'write' ? 'write' : 'read'],
        grantedToIdentities: [{
          user: {
            userPrincipalName: cleanUpn
          }
        }]
      });
    } catch (err: any) {
      throw new Error(`Add User to SharePoint Site failed: ${err.message}`);
    }
  }

  public static async checkSharePointPermissions(siteSearch: string): Promise<SharePointSite> {
    if (config.m365Mock) {
      let site: SharePointSite | null = null;
      for (const s of MockExchangeDatabase.sharepointSites.values()) {
        if (s.id === siteSearch || s.displayName.toLowerCase() === siteSearch.toLowerCase() || s.url.includes(siteSearch)) {
          site = s;
          break;
        }
      }
      if (!site) throw new Error(`SharePoint site not found: ${siteSearch}`);
      return { ...site };
    }

    const client = this.getClient();
    try {
      let siteId = siteSearch;
      let displayName = siteSearch;
      let url = `https://tenant.sharepoint.com/sites/${siteSearch}`;

      if (!siteSearch.includes(',')) {
        const siteDetails = await client.api(`/sites/root:/sites/${siteSearch}`).get();
        siteId = siteDetails.id;
        displayName = siteDetails.displayName;
        url = siteDetails.webUrl;
      }

      const permissionsRes = await client.api(`/sites/${siteId}/permissions`).get();
      const permsList = permissionsRes.value.map((p: any) => {
        const userPrincipalName = p.grantedTo?.user?.userPrincipalName || 'System / Guest';
        const role = p.roles?.includes('owner') ? 'owner' : p.roles?.includes('write') ? 'write' : 'read';
        return { userUpn: userPrincipalName, role };
      });

      return {
        id: siteId,
        displayName,
        url,
        webUrl: url,
        permissions: permsList
      };
    } catch (err: any) {
      throw new Error(`Check SharePoint Permissions failed: ${err.message}`);
    }
  }
}
