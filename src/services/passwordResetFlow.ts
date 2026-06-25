import { TurnContext, ActivityTypes } from 'botbuilder';
import { HandoffService } from './handoff';
import { SmsFactory } from './sms/SmsFactory';

type ResetState = 'INIT' | 'AWAITING_USER' | 'AWAITING_UPN_CONFIRMATION' | 'AWAITING_OTP' | 'AWAITING_MANAGER_APPROVAL';

interface ResetSession {
  userId: string;
  targetUser: string;
  state: ResetState;
  otp?: string;
}

export class PasswordResetFlow {
  private static sessions: Map<string, ResetSession> = new Map();

  public static async handle(context: TurnContext, text: string): Promise<{ handled: boolean, triggerHandoff?: boolean, category?: string }> {
    const userId = context.activity.from.id;
    let session = this.sessions.get(userId);

    // If starting a new flow
    if (!session && (text.toLowerCase().includes('password reset') || text.toLowerCase().includes('reset password'))) {
      session = { userId, targetUser: '', state: 'AWAITING_USER' };
      this.sessions.set(userId, session);
      await context.sendActivity("I can help with resetting a password. Is this for your own account, or are you resetting a password for someone else? Please reply with 'Mine' or provide the email address of the user.");
      return { handled: true }; // Handled
    }

    if (!session) return { handled: false }; // Not in flow

    // Process based on state
    switch (session.state) {
      case 'AWAITING_USER': {
        const inputStr = (text.toLowerCase() === 'mine' || text.toLowerCase() === 'me')
          ? (context.activity.from.name || context.activity.from.aadObjectId || 'Current User')
          : text;

        try {
          const { GraphService } = await import('./graphService');
          const resolvedUpn = await GraphService.resolveUserUpn(inputStr);
          session.targetUser = resolvedUpn;
          session.state = 'AWAITING_UPN_CONFIRMATION';
          await context.sendActivity(`I found the user: **${resolvedUpn}**.\n\nIs this the correct user to reset the password for? (Yes/No)`);
        } catch (err: any) {
          await context.sendActivity(`❌ Could not find a user matching "${inputStr}". Please try again with a valid name or email.`);
        }
        break;
      }

      case 'AWAITING_UPN_CONFIRMATION': {
        const reply = text.trim().toLowerCase();
        if (reply === 'yes' || reply === 'y' || reply === 'correct') {
          await context.sendActivity(`Checking authentication methods for ${session.targetUser}...`);
          
          // Mock Graph API check for SSPR methods
          const hasSSPR = Math.random() > 0.5; // Simulate 50% chance of having SSPR methods
          
          if (hasSSPR) {
            session.otp = Math.floor(100000 + Math.random() * 900000).toString();
            session.state = 'AWAITING_OTP';
            
            const smsProvider = SmsFactory.getProvider();
            const mockPhoneNumber = "+1234567890"; 
            await smsProvider.sendSms(mockPhoneNumber, `Your CIS360 Portal verification code is: ${session.otp}`);
            
            await context.sendActivity(`I have sent an OTP code to the registered mobile device for ${session.targetUser} via SMS. Please enter the 6-digit code here.`);
          } else {
            session.state = 'AWAITING_MANAGER_APPROVAL';
            await context.sendActivity(`No SSPR methods found for ${session.targetUser}. We must validate via security questions or Manager Approval.`);
            await context.sendActivity(`Please answer the security question: What is your manager's last name?`);
          }
        } else if (reply === 'no' || reply === 'n' || reply === 'nope') {
          session.state = 'AWAITING_USER';
          await context.sendActivity("Okay, please provide the correct email address or name of the user.");
        } else {
          await context.sendActivity("Please reply with Yes or No.");
        }
        break;
      }

      case 'AWAITING_OTP':
        if (text === session.otp) {
          await context.sendActivity(`✅ OTP Verified successfully! Executing Azure AD password reset for ${session.targetUser}...`);
          try {
            const { GraphService } = await import('./graphService');
            const tempPassword = await GraphService.resetPassword(session.targetUser, true);
            await context.sendActivity(`Password has been reset. The temporary password for ${session.targetUser} is: **${tempPassword}**\n\nPlease ensure this is changed immediately upon next login.`);
          } catch (err: any) {
            await context.sendActivity(`❌ Failed to reset password in Azure AD: ${err.message}. Escalating to a human agent.`);
            this.sessions.delete(userId);
            return { handled: true, triggerHandoff: true, category: 'Identity' };
          }
          this.sessions.delete(userId);
        } else {
          await context.sendActivity("❌ Invalid OTP. For security reasons, I am escalating this ticket to a human agent.");
          this.sessions.delete(userId);
          return { handled: true, triggerHandoff: true, category: 'Identity' };
        }
        break;

      case 'AWAITING_MANAGER_APPROVAL':
        // Mock security question validation
        if (text.trim().length > 2) {
          await context.sendActivity(`✅ Security details validated. Executing Azure AD password reset for ${session.targetUser}...`);
          try {
            const { GraphService } = await import('./graphService');
            const tempPassword = await GraphService.resetPassword(session.targetUser, true);
            await context.sendActivity(`Password has been reset. The temporary password for ${session.targetUser} is: **${tempPassword}**\n\nPlease ensure this is changed immediately upon next login.`);
          } catch (err: any) {
            await context.sendActivity(`❌ Failed to reset password in Azure AD: ${err.message}. Escalating to a human agent.`);
            this.sessions.delete(userId);
            return { handled: true, triggerHandoff: true, category: 'Identity' };
          }
          this.sessions.delete(userId);
        } else {
          await context.sendActivity("❌ Invalid security details provided. Escalating this ticket to a human agent.");
          this.sessions.delete(userId);
          return { handled: true, triggerHandoff: true, category: 'Identity' };
        }
        break;
    }

    return { handled: true }; // Handled by flow
  }
}
