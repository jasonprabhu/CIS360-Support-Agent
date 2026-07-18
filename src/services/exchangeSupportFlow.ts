import { TurnContext, MessageFactory } from 'botbuilder';
import { ExchangeService } from './exchangeService';
import { M365CardBuilder } from '../cards/m365CardBuilder';
import { SettingsService } from './settingsService';

type ExchangeState = 'INIT' | 'AWAITING_USER' | 'AWAITING_MESSAGE';
type ExchangeIntent = 
  | 'CHECK_SIZE' 
  | 'ENABLE_OOF' 
  | 'DISABLE_OOF' 
  | 'UPDATE_OOF_MSG' 
  | 'VIEW_OOF_STATUS' 
  | 'CHECK_FREE_BUSY';

interface ExchangeSession {
  userId: string;
  targetUser: string;
  state: ExchangeState;
  intent: ExchangeIntent;
  requestorUpn: string;
}

export class ExchangeSupportFlow {
  private static sessions: Map<string, ExchangeSession> = new Map();

  public static async handle(context: TurnContext, text: string, requestorUpn: string): Promise<{ handled: boolean }> {
    const userId = context.activity.from.id;
    let session = this.sessions.get(userId);
    const textLower = text.toLowerCase();

    // 1. Detect Intent if no session
    if (!session) {
      let intent: ExchangeIntent | null = null;
      let ucCode = '';

      if (textLower.includes('mailbox size') || textLower.includes('mailbox quota') || textLower.includes('exc037') || textLower.includes('exc038')) {
        intent = 'CHECK_SIZE'; ucCode = 'EXC037';
      } else if (textLower.includes('enable out of office') || textLower.includes('exc031')) {
        intent = 'ENABLE_OOF'; ucCode = 'EXC031';
      } else if (textLower.includes('disable out of office') || textLower.includes('exc032')) {
        intent = 'DISABLE_OOF'; ucCode = 'EXC032';
      } else if (textLower.includes('update oof message') || textLower.includes('configure internal oof') || textLower.includes('configure external oof') || textLower.includes('exc033') || textLower.includes('exc034') || textLower.includes('exc035')) {
        intent = 'UPDATE_OOF_MSG'; ucCode = 'EXC033';
      } else if (textLower.includes('view automatic reply') || textLower.includes('oof status') || textLower.includes('exc036')) {
        intent = 'VIEW_OOF_STATUS'; ucCode = 'EXC036';
      } else if (textLower.includes('free/busy') || textLower.includes('free busy') || textLower.includes('exc126')) {
        intent = 'CHECK_FREE_BUSY'; ucCode = 'EXC126';
      }

      if (intent) {
        const settings = SettingsService.getSettings();
        if (settings.enabledUseCases && settings.enabledUseCases[ucCode] === false) {
          await context.sendActivity(`This automation is turned off - Please contact administrator.`);
          return { handled: true };
        }

        session = { userId, targetUser: '', state: 'AWAITING_USER', intent, requestorUpn };
        this.sessions.set(userId, session);
        await context.sendActivity(`I can help with that. Is this for your own mailbox, or someone else's? Reply 'Mine' or provide the email address.`);
        return { handled: true };
      }
      return { handled: false };
    }

    // 2. Process Session
    switch (session.state) {
      case 'AWAITING_USER': {
        const inputStr = (textLower === 'mine' || textLower === 'me') ? session.requestorUpn : text.trim();
        try {
          const { GraphService } = await import('./graphService');
          const resolvedUpn = await GraphService.resolveUserUpn(inputStr);
          session.targetUser = resolvedUpn;
          
          if (session.intent === 'ENABLE_OOF' || session.intent === 'UPDATE_OOF_MSG') {
            session.state = 'AWAITING_MESSAGE';
            await context.sendActivity(`Please reply with the exact Out of Office message you'd like to set for **${resolvedUpn}**.`);
          } else {
            // Execute immediately for others
            await this.executeAction(context, session);
            this.sessions.delete(userId);
          }
        } catch (err) {
          await context.sendActivity(`❌ Could not find a user matching "${inputStr}". Please try again.`);
        }
        break;
      }
      case 'AWAITING_MESSAGE': {
        const message = text.trim();
        await this.executeAction(context, session, message);
        this.sessions.delete(userId);
        break;
      }
    }
    return { handled: true };
  }

  private static async executeAction(context: TurnContext, session: ExchangeSession, message?: string) {
    const upn = session.targetUser;
    
    try {
      switch (session.intent) {
        case 'CHECK_SIZE': {
          const size = await ExchangeService.getMailboxSize(upn);
          const card = M365CardBuilder.mailboxSizeCard(upn, size.sizeGb, size.maxSizeGb, size.percentUsed);
          await context.sendActivity(MessageFactory.attachment(card));
          break;
        }
        case 'ENABLE_OOF':
        case 'UPDATE_OOF_MSG': {
          await ExchangeService.setAutomaticReplies(upn, true, message || 'I am out of the office.');
          const card = M365CardBuilder.autoReplyStatusCard(upn, true, message || 'I am out of the office.');
          await context.sendActivity(MessageFactory.attachment(card));
          break;
        }
        case 'DISABLE_OOF': {
          await ExchangeService.setAutomaticReplies(upn, false, '');
          const card = M365CardBuilder.autoReplyStatusCard(upn, false, '');
          await context.sendActivity(MessageFactory.attachment(card));
          break;
        }
        case 'VIEW_OOF_STATUS': {
          const status = await ExchangeService.getAutomaticRepliesStatus(upn);
          const card = M365CardBuilder.autoReplyStatusCard(upn, status.isEnabled, status.message);
          await context.sendActivity(MessageFactory.attachment(card));
          break;
        }
        case 'CHECK_FREE_BUSY': {
          const fb = await ExchangeService.getFreeBusySettings(upn);
          const card = M365CardBuilder.freeBusyStatusCard(upn, fb.sharingEnabled, fb.defaultPermission);
          await context.sendActivity(MessageFactory.attachment(card));
          break;
        }
      }
    } catch (err: any) {
      await context.sendActivity(`❌ Failed to execute action on Exchange: ${err.message}`);
    }
  }
}
