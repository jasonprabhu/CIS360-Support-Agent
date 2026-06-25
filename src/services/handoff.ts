import { ConversationReference } from 'botbuilder';

export interface HandoffSession {
  userId: string;
  userName: string;
  userConversationReference: ConversationReference;
  state: 'waiting' | 'active' | 'ended';
  agentName?: string;
  agentId?: string;
  agentThreadId?: string; // The thread ID/conversation ID in the support channel
  agentConversationReference?: ConversationReference; // Reference to the support channel
  requestDetails?: string;
  targetChannelId?: string; // Optional dynamically mapped channel ID
  createdAt: Date;
  claimedAt?: Date;
}

export class HandoffService {
  // In-memory session store
  // Map of userId -> HandoffSession
  private static sessions: Map<string, HandoffSession> = new Map();

  // Map of agentThreadId -> userId (to quickly lookup who a channel message belongs to)
  private static threadToUser: Map<string, string> = new Map();

  public static createSession(
    userId: string,
    userName: string,
    userConversationReference: ConversationReference,
    requestDetails: string,
    targetChannelId?: string
  ): HandoffSession {
    const session: HandoffSession = {
      userId,
      userName,
      userConversationReference,
      state: 'waiting',
      requestDetails,
      targetChannelId,
      createdAt: new Date()
    };
    this.sessions.set(userId, session);
    return session;
  }

  public static claimSession(
    userId: string,
    agentThreadId: string,
    agentConversationReference: ConversationReference,
    agentId: string,
    agentName: string
  ): HandoffSession | null {
    const session = this.sessions.get(userId);
    if (!session) return null;

    session.state = 'active';
    session.agentThreadId = agentThreadId;
    session.agentConversationReference = agentConversationReference;
    session.agentId = agentId;
    session.agentName = agentName;
    session.claimedAt = new Date();

    this.sessions.set(userId, session);
    this.threadToUser.set(agentThreadId, userId);

    return session;
  }

  public static endSession(userId: string): HandoffSession | null {
    const session = this.sessions.get(userId);
    if (!session) return null;

    session.state = 'ended';
    this.sessions.delete(userId);
    if (session.agentThreadId) {
      this.threadToUser.delete(session.agentThreadId);
    }

    return session;
  }

  public static getSessionByUserId(userId: string): HandoffSession | undefined {
    return this.sessions.get(userId);
  }

  public static getSessionByThreadId(threadId: string): HandoffSession | undefined {
    const userId = this.threadToUser.get(threadId);
    if (!userId) return undefined;
    return this.sessions.get(userId);
  }

  public static isUserInHandoff(userId: string): boolean {
    const session = this.sessions.get(userId);
    return !!session && (session.state === 'waiting' || session.state === 'active');
  }

  public static isUserActive(userId: string): boolean {
    const session = this.sessions.get(userId);
    return !!session && session.state === 'active';
  }

  public static getAllActiveSessions(): HandoffSession[] {
    return Array.from(this.sessions.values());
  }
}
