export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class StateManager {
  // In-memory conversation history store
  // Map of userId -> ChatMessage[]
  private static historyStore: Map<string, ChatMessage[]> = new Map();
  private static pendingExecutions: Map<string, any> = new Map();

  // Maximum context size to prevent context overflow or high token costs
  private static MAX_HISTORY = 10;

  /**
   * Retrieves the conversation history for a given user.
   * If it doesn't exist, initializes an empty history array.
   */
  public static getHistory(userId: string): ChatMessage[] {
    if (!this.historyStore.has(userId)) {
      this.historyStore.set(userId, []);
    }
    return this.historyStore.get(userId) || [];
  }

  /**
   * Appends a new message (user or assistant) to the user's history log.
   * Truncates oldest entries if length exceeds MAX_HISTORY.
   */
  public static addMessage(userId: string, role: 'user' | 'assistant' | 'system', text: string): void {
    const history = this.getHistory(userId);
    history.push({ role, content: text });

    // Truncate oldest messages if limit is reached (keeping system prompts if any, but since we add system prompts dynamically, we can just slice)
    if (history.length > this.MAX_HISTORY) {
      history.splice(0, history.length - this.MAX_HISTORY);
    }

    this.historyStore.set(userId, history);
  }

  /**
   * Clears the active context log for a user (e.g., when task is executed or canceled)
   */
  public static clearHistory(userId: string): void {
    this.historyStore.delete(userId);
    console.log(`[StateManager] Cleared conversation history for user: ${userId}`);
  }

  public static setPendingExecution(userId: string, execution: any): void {
    this.pendingExecutions.set(userId, execution);
  }

  public static getPendingExecution(userId: string): any {
    return this.pendingExecutions.get(userId);
  }

  public static clearPendingExecution(userId: string): void {
    this.pendingExecutions.delete(userId);
  }
}
