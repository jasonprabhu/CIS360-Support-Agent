import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import { config } from '../config';

// ----------------------------------------------------
// TypeScript Interfaces for M365 Entities
// ----------------------------------------------------
export interface M365User {
  id: string;
  userPrincipalName: string;
  displayName: string;
  givenName: string;
  surname: string;
  department: string;
  jobTitle: string;
  mobilePhone: string;
  officeLocation: string;
  managerUpn?: string;
  accountEnabled: boolean;
  assignedLicenses: string[];
  onPremisesSyncEnabled?: boolean;
  lastPasswordChangeDateTime?: string;
  otherMails?: string[];
  passwordProfile?: {
    forceChangePasswordNextSignIn: boolean;
  };
}

export interface M365Group {
  id: string;
  displayName: string;
  description: string;
  mailEnabled: boolean;
  securityEnabled: boolean;
  groupTypes: string[]; // ['Unified'] for M365 Groups
  members: string[]; // Array of user UPNs
  owners: string[];  // Array of user UPNs
  showInAddressList: boolean;
}

export interface M365License {
  skuId: string;
  skuPartNumber: string;
  totalUnits: number;
  consumedUnits: number;
}

// ----------------------------------------------------
// Mock Database State for M365 Tenant Simulator
// ----------------------------------------------------
class MockM365Database {
  public static users: Map<string, M365User> = new Map([
    [
      'adele.vance@tenant.onmicrosoft.com',
      {
        id: 'u-adele',
        userPrincipalName: 'adele.vance@tenant.onmicrosoft.com',
        displayName: 'Adele Vance',
        givenName: 'Adele',
        surname: 'Vance',
        department: 'Productivity',
        jobTitle: 'M365 Administrator',
        mobilePhone: '+1 425 555 0109',
        officeLocation: 'Redmond - Building 18',
        managerUpn: 'megan.bowen@tenant.onmicrosoft.com',
        accountEnabled: true,
        assignedLicenses: ['Microsoft 365 E5 (DEVELOPER)'],
        lastPasswordChangeDateTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
      }
    ],
    [
      'alex.wilber@tenant.onmicrosoft.com',
      {
        id: 'u-alex',
        userPrincipalName: 'alex.wilber@tenant.onmicrosoft.com',
        displayName: 'Alex Wilber',
        givenName: 'Alex',
        surname: 'Wilber',
        department: 'Marketing',
        jobTitle: 'Marketing Specialist',
        mobilePhone: '+1 425 555 0120',
        officeLocation: 'Seattle - HQ',
        accountEnabled: true,
        assignedLicenses: ['Microsoft 365 E3'],
        lastPasswordChangeDateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      }
    ],
    [
      'megan.bowen@tenant.onmicrosoft.com',
      {
        id: 'u-megan',
        userPrincipalName: 'megan.bowen@tenant.onmicrosoft.com',
        displayName: 'Megan Bowen',
        givenName: 'Megan',
        surname: 'Bowen',
        department: 'Executive',
        jobTitle: 'VP of Support Services',
        mobilePhone: '+1 206 555 0155',
        officeLocation: 'Seattle - HQ',
        accountEnabled: true,
        assignedLicenses: ['Microsoft 365 E5 (DEVELOPER)']
      }
    ]
  ]);

  public static groups: Map<string, M365Group> = new Map([
    [
      'g-admin',
      {
        id: 'g-admin',
        displayName: 'IT Admins Security Group',
        description: 'Security Group containing all active IT Administrators',
        mailEnabled: false,
        securityEnabled: true,
        groupTypes: [],
        members: ['adele.vance@tenant.onmicrosoft.com'],
        owners: ['megan.bowen@tenant.onmicrosoft.com'],
        showInAddressList: true
      }
    ],
    [
      'g-m365',
      {
        id: 'g-m365',
        displayName: 'CIS360 Support M365 Group',
        description: 'Unified M365 Group for CIS360 support operators',
        mailEnabled: true,
        securityEnabled: false,
        groupTypes: ['Unified'],
        members: ['adele.vance@tenant.onmicrosoft.com', 'alex.wilber@tenant.onmicrosoft.com'],
        owners: ['megan.bowen@tenant.onmicrosoft.com'],
        showInAddressList: true
      }
    ]
  ]);

  public static licenses: M365License[] = [
    { skuId: 'sku-e5', skuPartNumber: 'SPE_E5', totalUnits: 25, consumedUnits: 2 },
    { skuId: 'sku-e3', skuPartNumber: 'SPE_E3', totalUnits: 50, consumedUnits: 1 },
    { skuId: 'sku-ems5', skuPartNumber: 'EMSPREMIUM', totalUnits: 10, consumedUnits: 0 }
  ];
}

// ----------------------------------------------------
// GraphService Client Class
// ----------------------------------------------------
export class GraphService {
  private static graphClient: Client | null = null;

  /**
   * Initializes and returns the active MS Graph API Client using Service Principal
   */
  private static getClient(): Client {
    if (this.graphClient) return this.graphClient;

    if (config.m365Mock) {
      throw new Error('Graph client initialization requested while in M365 mock mode.');
    }

    if (!config.m365TenantId || !config.m365ClientId || !config.m365ClientSecret) {
      throw new Error('M365 Integration credentials missing in environment variables.');
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
  // USER LIFECYCLE MANAGEMENT (UC001 - UC012)
  // ==================================================

  public static async resolveUserUpn(search: string): Promise<string> {
    const cleanSearch = search.trim();
    if (cleanSearch.includes('@')) return cleanSearch.toLowerCase();

    if (config.m365Mock) {
      for (const user of MockM365Database.users.values()) {
        if (user.displayName.toLowerCase() === cleanSearch.toLowerCase() ||
            user.userPrincipalName.toLowerCase() === cleanSearch.toLowerCase()) {
          return user.userPrincipalName;
        }
      }
      throw new Error(`User not found with name: ${cleanSearch}`);
    }

    const client = this.getClient();
    const result = await client.api('/users')
      .header('ConsistencyLevel', 'eventual')
      .filter(`displayName eq '${cleanSearch}' or startswith(displayName, '${cleanSearch}') or startswith(userPrincipalName, '${cleanSearch}')`)
      .select('userPrincipalName')
      .top(1)
      .count(true)
      .get();

    if (result.value && result.value.length > 0) {
      return result.value[0].userPrincipalName;
    }
    throw new Error(`User not found with name: ${cleanSearch}`);
  }

  public static async getUser(upn: string): Promise<M365User | null> {
    const cleanUpn = (await this.resolveUserUpn(upn)).toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      return user ? { ...user } : null;
    }

    const client = this.getClient();
    try {
      const graphUser = await client.api(`/users/${cleanUpn}`)
        .select('id,userPrincipalName,displayName,givenName,surname,department,jobTitle,mobilePhone,officeLocation,accountEnabled,assignedLicenses,onPremisesSyncEnabled,lastPasswordChangeDateTime,otherMails')
        .get();

      // Resolve manager
      let managerUpn: string | undefined;
      try {
        const manager = await client.api(`/users/${cleanUpn}/manager`).select('userPrincipalName').get();
        managerUpn = manager.userPrincipalName;
      } catch (e) {
        // Manager not assigned or not accessible, ignore
      }

      return {
        id: graphUser.id,
        userPrincipalName: graphUser.userPrincipalName,
        displayName: graphUser.displayName,
        givenName: graphUser.givenName,
        surname: graphUser.surname,
        department: graphUser.department || '',
        jobTitle: graphUser.jobTitle || '',
        mobilePhone: graphUser.mobilePhone || '',
        officeLocation: graphUser.officeLocation || '',
        managerUpn,
        accountEnabled: graphUser.accountEnabled,
        assignedLicenses: (graphUser.assignedLicenses || []).map((l: any) => l.skuId),
        onPremisesSyncEnabled: graphUser.onPremisesSyncEnabled,
        lastPasswordChangeDateTime: graphUser.lastPasswordChangeDateTime,
        otherMails: graphUser.otherMails || []
      };
    } catch (err: any) {
      if (err.statusCode === 404) return null;
      throw new Error(`Graph API error: ${err.message}`);
    }
  }

  public static async createUser(
    firstName: string,
    lastName: string,
    upn: string,
    department: string,
    jobTitle: string,
    licenseType: string
  ): Promise<{ user: M365User; tempPassword: string }> {
    const cleanUpn = upn.trim().toLowerCase();
    const tempPassword = 'CIS360!' + Math.random().toString(36).substring(2, 10).toUpperCase();

    if (config.m365Mock) {
      if (MockM365Database.users.has(cleanUpn)) {
        throw new Error(`Conflict: A user with UPN "${cleanUpn}" already exists.`);
      }

      const newUser: M365User = {
        id: 'u-' + Math.random().toString(36).substring(2, 7),
        userPrincipalName: cleanUpn,
        displayName: `${firstName} ${lastName}`,
        givenName: firstName,
        surname: lastName,
        department,
        jobTitle,
        mobilePhone: '',
        officeLocation: 'Not Configured',
        accountEnabled: true,
        assignedLicenses: licenseType ? [licenseType] : [],
        passwordProfile: {
          forceChangePasswordNextSignIn: true
        }
      };

      MockM365Database.users.set(cleanUpn, newUser);

      // Increment license count in mock db
      const license = MockM365Database.licenses.find(l => l.skuPartNumber === licenseType || l.skuId === licenseType);
      if (license) {
        license.consumedUnits++;
      }

      return { user: { ...newUser }, tempPassword };
    }

    const client = this.getClient();

    try {
      const payload = {
        accountEnabled: true,
        displayName: `${firstName} ${lastName}`,
        mailNickname: cleanUpn.split('@')[0],
        userPrincipalName: cleanUpn,
        givenName: firstName,
        surname: lastName,
        department: department,
        jobTitle: jobTitle,
        usageLocation: 'US', // Required for license assignment
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: tempPassword
        }
      };

      const createdUser = await client.api('/users').post(payload);

      // Assign License if selected
      if (licenseType) {
        try {
          await client.api(`/users/${createdUser.id}/assignLicense`).post({
            addLicenses: [{ skuId: licenseType }],
            removeLicenses: []
          });
        } catch (licErr: any) {
          console.error(`User created but license assignment failed: ${licErr.message}`);
        }
      }

      const resolvedUser = await this.getUser(cleanUpn);
      return { user: resolvedUser!, tempPassword };

    } catch (err: any) {
      throw new Error(`Graph API User Creation Failed: ${err.message}`);
    }
  }

  public static async updateUserField(
    upn: string,
    field: 'displayName' | 'jobTitle' | 'department' | 'mobilePhone' | 'officeLocation',
    value: string
  ): Promise<{ before: string; after: string }> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      const before = (user as any)[field] || '';
      (user as any)[field] = value;
      if (field === 'displayName') {
        const parts = value.split(' ');
        user.givenName = parts[0] || '';
        user.surname = parts.slice(1).join(' ') || '';
      }
      
      MockM365Database.users.set(cleanUpn, user);
      return { before, after: value };
    }

    const client = this.getClient();
    const existing = await this.getUser(cleanUpn);
    if (!existing) throw new Error(`User not found: ${cleanUpn}`);

    const before = (existing as any)[field] || '';

    try {
      const payload: any = {};
      payload[field] = value;
      await client.api(`/users/${cleanUpn}`).patch(payload);
      return { before, after: value };
    } catch (err: any) {
      throw new Error(`Graph API User Update Failed: ${err.message}`);
    }
  }

  public static async updateManager(upn: string, managerUpn: string): Promise<{ before: string; after: string }> {
    const cleanUpn = upn.trim().toLowerCase();
    const cleanManagerUpn = managerUpn.trim().toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      const before = user.managerUpn || 'None';

      if (cleanManagerUpn === 'none' || !cleanManagerUpn) {
        user.managerUpn = undefined;
      } else {
        const manager = MockM365Database.users.get(cleanManagerUpn);
        if (!manager) throw new Error(`Manager not found: ${cleanManagerUpn}`);
        user.managerUpn = cleanManagerUpn;
      }

      MockM365Database.users.set(cleanUpn, user);
      return { before, after: cleanManagerUpn };
    }

    const client = this.getClient();
    const existing = await this.getUser(cleanUpn);
    if (!existing) throw new Error(`User not found: ${cleanUpn}`);

    const before = existing.managerUpn || 'None';

    try {
      if (cleanManagerUpn === 'none' || !cleanManagerUpn) {
        await client.api(`/users/${cleanUpn}/manager/$ref`).delete();
      } else {
        const manager = await this.getUser(cleanManagerUpn);
        if (!manager) throw new Error(`Manager not found: ${cleanManagerUpn}`);

        await client.api(`/users/${cleanUpn}/manager/$ref`).put({
          '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${manager.id}`
        });
      }
      return { before, after: cleanManagerUpn };
    } catch (err: any) {
      throw new Error(`Graph API Manager Update Failed: ${err.message}`);
    }
  }

  public static async resetPassword(upn: string, forceChange: boolean): Promise<string> {
    const cleanUpn = (await this.resolveUserUpn(upn)).toLowerCase();
    const tempPassword = 'CIS360!' + Math.random().toString(36).substring(2, 10).toUpperCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User ${cleanUpn} not found in mock database`);
      user.passwordProfile = { forceChangePasswordNextSignIn: forceChange };
      user.lastPasswordChangeDateTime = new Date().toISOString();
      return tempPassword;
    }

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}`)
        .patch({
        passwordProfile: {
          forceChangePasswordNextSignIn: forceChange,
          password: tempPassword
        }
      });
      return tempPassword;
    } catch (err: any) {
      throw new Error(`Graph API Password Reset Failed: ${err.message}`);
    }
  }

  public static async revokeSignInSessions(upn: string): Promise<void> {
    const cleanUpn = (await this.resolveUserUpn(upn)).toLowerCase();
    if (config.m365Mock) return;

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}/revokeSignInSessions`).post({});
    } catch (err: any) {
      throw new Error(`Graph API Revoke Sessions Failed: ${err.message}`);
    }
  }

  public static async clearAuthenticationMethods(upn: string): Promise<void> {
    const cleanUpn = (await this.resolveUserUpn(upn)).toLowerCase();
    
    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (user) {
        user.mobilePhone = '';
        user.otherMails = [];
      }
      return;
    }

    const client = this.getClient();
    try {
      // Simplest way without full AuthMethods API permission is to wipe properties if we just have User.ReadWrite.All
      await client.api(`/users/${cleanUpn}`).patch({
        mobilePhone: null,
        otherMails: []
      });
    } catch (err: any) {
      throw new Error(`Graph API Clear SSPR Failed: ${err.message}`);
    }
  }

  public static async setSignInBlocked(upn: string, block: boolean): Promise<boolean> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      user.accountEnabled = !block;
      MockM365Database.users.set(cleanUpn, user);
      return block;
    }

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}`).patch({
        accountEnabled: !block
      });
      return block;
    } catch (err: any) {
      throw new Error(`Graph API Sign-in status failed: ${err.message}`);
    }
  }

  public static async deleteUser(upn: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      if (!MockM365Database.users.has(cleanUpn)) {
        throw new Error(`User not found: ${cleanUpn}`);
      }
      MockM365Database.users.delete(cleanUpn);
      return;
    }

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}`).delete();
    } catch (err: any) {
      throw new Error(`Graph API User Deletion Failed: ${err.message}`);
    }
  }

  // ==================================================
  // LICENSE MANAGEMENT (UC013 - UC020)
  // ==================================================

  public static async assignLicense(upn: string, skuId: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      const license = MockM365Database.licenses.find(l => l.skuId === skuId || l.skuPartNumber === skuId);
      if (!license) throw new Error(`License SKU "${skuId}" is not available in the tenant.`);

      if (user.assignedLicenses.includes(license.skuPartNumber)) {
        return; // Already assigned
      }

      user.assignedLicenses.push(license.skuPartNumber);
      license.consumedUnits++;
      MockM365Database.users.set(cleanUpn, user);
      return;
    }

    const client = this.getClient();
    try {
      await client.api(`/users/${cleanUpn}/assignLicense`).post({
        addLicenses: [{ skuId: skuId }],
        removeLicenses: []
      });
    } catch (err: any) {
      throw new Error(`Graph API Assign License Failed: ${err.message}`);
    }
  }

  public static async removeLicense(upn: string, skuId: string): Promise<void> {
    const cleanUpn = upn.trim().toLowerCase();

    if (config.m365Mock) {
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      const license = MockM365Database.licenses.find(l => l.skuId === skuId || l.skuPartNumber === skuId);
      if (!license) throw new Error(`License SKU "${skuId}" not found.`);

      const index = user.assignedLicenses.indexOf(license.skuPartNumber);
      if (index === -1) {
        throw new Error(`User does not have license SKU "${license.skuPartNumber}" assigned.`);
      }

      user.assignedLicenses.splice(index, 1);
      license.consumedUnits = Math.max(0, license.consumedUnits - 1);
      MockM365Database.users.set(cleanUpn, user);
      return;
    }

    const client = this.getClient();
    try {
      // Find actual SkuId if Part Number was passed
      let targetSku = skuId;
      if (!skuId.includes('-')) { // SKU IDs are GUIDs
        const skus = await client.api('/subscribedSkus').get();
        const found = skus.value.find((s: any) => s.skuPartNumber === skuId);
        if (found) targetSku = found.skuId;
      }

      await client.api(`/users/${cleanUpn}/assignLicense`).post({
        addLicenses: [],
        removeLicenses: [targetSku]
      });
    } catch (err: any) {
      throw new Error(`Graph API Remove License Failed: ${err.message}`);
    }
  }

  public static async checkAvailableLicenses(): Promise<M365License[]> {
    if (config.m365Mock) {
      return [...MockM365Database.licenses];
    }

    const client = this.getClient();
    try {
      const response = await client.api('/subscribedSkus').get();
      return response.value.map((item: any) => ({
        skuId: item.skuId,
        skuPartNumber: item.skuPartNumber,
        totalUnits: item.enabled,
        consumedUnits: item.consumed
      }));
    } catch (err: any) {
      throw new Error(`Graph API Subscribed SKUs Failed: ${err.message}`);
    }
  }

  public static async findUnlicensedUsers(): Promise<M365User[]> {
    if (config.m365Mock) {
      return Array.from(MockM365Database.users.values())
        .filter(u => u.assignedLicenses.length === 0);
    }

    const client = this.getClient();
    try {
      const users = await client.api('/users')
        .select('id,userPrincipalName,displayName,givenName,surname,department,jobTitle,assignedLicenses,accountEnabled')
        .get();

      const unlicensed = users.value.filter((u: any) => !u.assignedLicenses || u.assignedLicenses.length === 0);
      return unlicensed.map((u: any) => ({
        id: u.id,
        userPrincipalName: u.userPrincipalName,
        displayName: u.displayName,
        givenName: u.givenName || '',
        surname: u.surname || '',
        department: u.department || 'Unknown',
        jobTitle: u.jobTitle || 'Unknown',
        mobilePhone: '',
        officeLocation: '',
        accountEnabled: u.accountEnabled,
        assignedLicenses: []
      }));
    } catch (err: any) {
      throw new Error(`Graph API List Users Failed: ${err.message}`);
    }
  }

  // ==================================================
  // GROUP MANAGEMENT (UC021 - UC028)
  // ==================================================

  public static async createGroup(
    displayName: string,
    description: string,
    isM365Group: boolean
  ): Promise<M365Group> {
    const groupId = 'g-' + Math.random().toString(36).substring(2, 7);

    if (config.m365Mock) {
      const newGroup: M365Group = {
        id: groupId,
        displayName,
        description,
        mailEnabled: isM365Group,
        securityEnabled: !isM365Group,
        groupTypes: isM365Group ? ['Unified'] : [],
        members: [],
        owners: [],
        showInAddressList: true
      };
      MockM365Database.groups.set(groupId, newGroup);
      return newGroup;
    }

    const client = this.getClient();
    try {
      const payload: any = {
        displayName,
        description,
        mailNickname: displayName.replace(/\s+/g, '-').toLowerCase().substring(0, 64),
        mailEnabled: isM365Group,
        securityEnabled: !isM365Group
      };

      if (isM365Group) {
        payload.groupTypes = ['Unified'];
        payload.mailEnabled = true;
        payload.securityEnabled = false;
      } else {
        payload.groupTypes = [];
        payload.mailEnabled = false;
        payload.securityEnabled = true;
      }

      const created = await client.api('/groups').post(payload);
      return {
        id: created.id,
        displayName: created.displayName,
        description: created.description,
        mailEnabled: created.mailEnabled,
        securityEnabled: created.securityEnabled,
        groupTypes: created.groupTypes || [],
        members: [],
        owners: [],
        showInAddressList: true
      };
    } catch (err: any) {
      throw new Error(`Graph API Group Creation Failed: ${err.message}`);
    }
  }

  public static async manageGroupMember(
    groupSearch: string,
    userUpn: string,
    action: 'add' | 'remove'
  ): Promise<void> {
    const cleanUpn = userUpn.trim().toLowerCase();

    if (config.m365Mock) {
      let foundGroup: M365Group | null = null;
      for (const group of MockM365Database.groups.values()) {
        if (group.id === groupSearch || group.displayName.toLowerCase() === groupSearch.toLowerCase()) {
          foundGroup = group;
          break;
        }
      }

      if (!foundGroup) throw new Error(`Group not found: ${groupSearch}`);

      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      const memberIdx = foundGroup.members.indexOf(cleanUpn);

      if (action === 'add') {
        if (memberIdx !== -1) return;
        foundGroup.members.push(cleanUpn);
      } else {
        if (memberIdx === -1) throw new Error(`User is not a member of this group.`);
        foundGroup.members.splice(memberIdx, 1);
      }
      return;
    }

    const client = this.getClient();
    try {
      let groupId = groupSearch;
      if (!groupSearch.includes('-')) {
        const grps = await client.api('/groups').filter(`displayName eq '${groupSearch}'`).get();
        if (grps.value.length === 0) throw new Error(`Group not found: ${groupSearch}`);
        groupId = grps.value[0].id;
      }

      const user = await this.getUser(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      if (action === 'add') {
        await client.api(`/groups/${groupId}/members/$ref`).post({
          '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${user.id}`
        });
      } else {
        await client.api(`/groups/${groupId}/members/${user.id}/$ref`).delete();
      }
    } catch (err: any) {
      throw new Error(`Graph API Group Membership Action failed: ${err.message}`);
    }
  }

  public static async getGroupMembers(groupSearch: string): Promise<{ group: M365Group; members: string[] }> {
    if (config.m365Mock) {
      let foundGroup: M365Group | null = null;
      for (const group of MockM365Database.groups.values()) {
        if (group.id === groupSearch || group.displayName.toLowerCase() === groupSearch.toLowerCase()) {
          foundGroup = group;
          break;
        }
      }

      if (!foundGroup) throw new Error(`Group not found: ${groupSearch}`);
      return { group: foundGroup, members: [...foundGroup.members] };
    }

    const client = this.getClient();
    try {
      let groupId = groupSearch;
      let displayName = groupSearch;
      let description = '';

      if (!groupSearch.includes('-')) {
        const grps = await client.api('/groups').filter(`displayName eq '${groupSearch}'`).get();
        if (grps.value.length === 0) throw new Error(`Group not found: ${groupSearch}`);
        groupId = grps.value[0].id;
        displayName = grps.value[0].displayName;
        description = grps.value[0].description || '';
      }

      const membersRes = await client.api(`/groups/${groupId}/members`).select('userPrincipalName').get();
      const members = membersRes.value.map((m: any) => m.userPrincipalName).filter(Boolean);

      const groupObj: M365Group = {
        id: groupId,
        displayName,
        description,
        mailEnabled: false,
        securityEnabled: true,
        groupTypes: [],
        members: members,
        owners: [],
        showInAddressList: true
      };

      return { group: groupObj, members };
    } catch (err: any) {
      throw new Error(`Graph API Get Group Members failed: ${err.message}`);
    }
  }

  public static async updateGroupOwner(groupSearch: string, ownerUpn: string): Promise<void> {
    const cleanUpn = ownerUpn.trim().toLowerCase();

    if (config.m365Mock) {
      let foundGroup: M365Group | null = null;
      for (const group of MockM365Database.groups.values()) {
        if (group.id === groupSearch || group.displayName.toLowerCase() === groupSearch.toLowerCase()) {
          foundGroup = group;
          break;
        }
      }
      if (!foundGroup) throw new Error(`Group not found: ${groupSearch}`);
      const user = MockM365Database.users.get(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      if (!foundGroup.owners.includes(cleanUpn)) {
        foundGroup.owners.push(cleanUpn);
      }
      return;
    }

    const client = this.getClient();
    try {
      let groupId = groupSearch;
      if (!groupSearch.includes('-')) {
        const grps = await client.api('/groups').filter(`displayName eq '${groupSearch}'`).get();
        if (grps.value.length === 0) throw new Error(`Group not found: ${groupSearch}`);
        groupId = grps.value[0].id;
      }

      const user = await this.getUser(cleanUpn);
      if (!user) throw new Error(`User not found: ${cleanUpn}`);

      await client.api(`/groups/${groupId}/owners/$ref`).post({
        '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${user.id}`
      });
    } catch (err: any) {
      throw new Error(`Graph API Add Group Owner failed: ${err.message}`);
    }
  }

  public static async setGroupVisibility(groupSearch: string, showInGal: boolean): Promise<void> {
    if (config.m365Mock) {
      let foundGroup: M365Group | null = null;
      for (const group of MockM365Database.groups.values()) {
        if (group.id === groupSearch || group.displayName.toLowerCase() === groupSearch.toLowerCase()) {
          foundGroup = group;
          break;
        }
      }
      if (!foundGroup) throw new Error(`Group not found: ${groupSearch}`);
      foundGroup.showInAddressList = showInGal;
      return;
    }

    const client = this.getClient();
    try {
      let groupId = groupSearch;
      if (!groupSearch.includes('-')) {
        const grps = await client.api('/groups').filter(`displayName eq '${groupSearch}'`).get();
        if (grps.value.length === 0) throw new Error(`Group not found: ${groupSearch}`);
        groupId = grps.value[0].id;
      }

      await client.api(`/groups/${groupId}`).patch({
        showInAddressList: showInGal
      });
    } catch (err: any) {
      throw new Error(`Graph API Set Group Visibility failed: ${err.message}`);
    }
  }

  public static async renameGroup(groupSearch: string, newName: string): Promise<{ before: string; after: string }> {
    if (config.m365Mock) {
      let foundGroup: M365Group | null = null;
      for (const group of MockM365Database.groups.values()) {
        if (group.id === groupSearch || group.displayName.toLowerCase() === groupSearch.toLowerCase()) {
          foundGroup = group;
          break;
        }
      }
      if (!foundGroup) throw new Error(`Group not found: ${groupSearch}`);
      const before = foundGroup.displayName;
      foundGroup.displayName = newName;
      return { before, after: newName };
    }

    const client = this.getClient();
    try {
      let groupId = groupSearch;
      let before = groupSearch;
      if (!groupSearch.includes('-')) {
        const grps = await client.api('/groups').filter(`displayName eq '${groupSearch}'`).get();
        if (grps.value.length === 0) throw new Error(`Group not found: ${groupSearch}`);
        groupId = grps.value[0].id;
        before = grps.value[0].displayName;
      }

      await client.api(`/groups/${groupId}`).patch({
        displayName: newName
      });
      return { before, after: newName };
    } catch (err: any) {
      throw new Error(`Graph API Rename Group failed: ${err.message}`);
    }
  }
}
