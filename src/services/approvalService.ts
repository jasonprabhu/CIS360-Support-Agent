import { ConversationReference } from 'botbuilder';

export interface PendingRequest {
  requestId: string;
  ucCode: string;
  parameters: any;
  requestorUpn: string;
  requestorConversationReference: ConversationReference;
  managerUpn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  managerCardActivityId?: string; // Cache the activity ID of the card sent to manager so we can update it
}

export class ApprovalService {
  private static pendingRequests: Map<string, PendingRequest> = new Map();

  /**
   * Registers a new pending administrative request
   */
  public static createRequest(
    requestId: string,
    ucCode: string,
    parameters: any,
    requestorUpn: string,
    requestorConversationReference: ConversationReference,
    managerUpn: string
  ): PendingRequest {
    const req: PendingRequest = {
      requestId,
      ucCode,
      parameters,
      requestorUpn,
      requestorConversationReference,
      managerUpn,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    this.pendingRequests.set(requestId, req);
    return req;
  }

  /**
   * Retrieves request details by ID
   */
  public static getRequest(requestId: string): PendingRequest | undefined {
    return this.pendingRequests.get(requestId);
  }

  /**
   * Updates status of request
   */
  public static updateStatus(requestId: string, status: 'Approved' | 'Rejected'): void {
    const req = this.pendingRequests.get(requestId);
    if (req) {
      req.status = status;
    }
  }

  /**
   * Caches manager card activity ID to allow updating it in place
   */
  public static setManagerCardActivityId(requestId: string, activityId: string): void {
    const req = this.pendingRequests.get(requestId);
    if (req) {
      req.managerCardActivityId = activityId;
    }
  }
}
