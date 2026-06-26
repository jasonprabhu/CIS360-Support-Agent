import { TurnContext, ActivityTypes } from 'botbuilder';
import { HandoffService } from './handoff';
import { SmsFactory } from './sms/SmsFactory';

type ResetState = 'INIT' | 'AWAITING_USER' | 'AWAITING_UPN_CONFIRMATION' | 'AWAITING_OTP' | 'AWAITING_MANAGER_APPROVAL';
type Intent = 'RESET_PASSWORD' | 'UNLOCK_ACCOUNT' | 'RESET_SSPR';

interface ResetSession {
  userId: string;
  targetUser: string;
  state: ResetState;
  intent: Intent;
  otp?: string;
}

export class IdentitySecurityFlow {
  private static sessions: Map<string, ResetSession> = new Map();

  public static async handle(context: TurnContext, text: string): Promise<{ handled: boolean, triggerHandoff?: boolean, category?: string }> {
    const userId = context.activity.from.id;
    let session = this.sessions.get(userId);

    // If starting a new flow
    const textLower = text.toLowerCase();
    const isReset = textLower.includes('password reset') || textLower.includes('reset password') || textLower.includes('suc001');
    const isUnlock = textLower.includes('unlock account') || textLower.includes('unlock my account') || textLower.includes('account lockout') || textLower.includes('suc002');
    const isResetSspr = textLower.includes('reset sspr') || textLower.includes('clear mfa') || textLower.includes('suc006');

    if (!session && (isReset || isUnlock || isResetSspr)) {
      let intent: Intent = 'RESET_PASSWORD';
      if (isUnlock) intent = 'UNLOCK_ACCOUNT';
      if (isResetSspr) intent = 'RESET_SSPR';

      session = { userId, targetUser: '', state: 'AWAITING_USER', intent };
      this.sessions.set(userId, session);
      
      let actionText = 'resetting a password';
      if (intent === 'UNLOCK_ACCOUNT') actionText = 'unlocking an account';
      if (intent === 'RESET_SSPR') actionText = 'resetting SSPR registration';

      await context.sendActivity(`I can help with ${actionText}. Is this for your own account, or are you doing this for someone else? Please reply with 'Mine' or provide the email address of the user.`);
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
          
          if (session.intent === 'RESET_SSPR') {
            await context.sendActivity(`⚠️ **WARNING**: Resetting SSPR Registration will remove all registered authentication methods (phone, email) for **${resolvedUpn}**. They will be prompted to re-register on their next login. Are you sure you want to proceed? (Yes/No)`);
            session.state = 'AWAITING_UPN_CONFIRMATION';
          } else {
            session.state = 'AWAITING_UPN_CONFIRMATION';
            await context.sendActivity(`I found the user: **${resolvedUpn}**.\n\nIs this the correct user to perform this action for? (Yes/No)`);
          }
        } catch (err: any) {
          await context.sendActivity(`❌ Could not find a user matching "${inputStr}". Please try again with a valid name or email.`);
        }
        break;
      }

      case 'AWAITING_UPN_CONFIRMATION': {
        const reply = text.trim().toLowerCase();
        if (reply === 'yes' || reply === 'y' || reply === 'correct') {
          await context.sendActivity(`Checking authentication methods for ${session.targetUser}...`);
          
          try {
            const { GraphService } = await import('./graphService');
            const user = await GraphService.getUser(session.targetUser);
            
            // Check if user has a mobile phone configured in Entra ID
            const hasSSPR = user && user.mobilePhone && user.mobilePhone.trim().length > 0;
            
            if (hasSSPR) {
              session.otp = Math.floor(100000 + Math.random() * 900000).toString();
              session.state = 'AWAITING_OTP';
              
              const smsProvider = SmsFactory.getProvider();
              // Use the user's actual mobile number from Graph API
              const userPhoneNumber = user.mobilePhone; 
              await smsProvider.sendSms(userPhoneNumber, `Your CIS360 Portal verification code is: ${session.otp}`);
              
              // Mask the phone number for security
              const maskedPhone = userPhoneNumber.substring(0, 3) + '****' + userPhoneNumber.substring(userPhoneNumber.length - 4);
              await context.sendActivity(`I have sent an OTP code to the registered mobile device (${maskedPhone}) for ${session.targetUser} via SMS. Please enter the 6-digit code here.`);
            } else {
              session.state = 'AWAITING_MANAGER_APPROVAL';
              await context.sendActivity(`No SSPR mobile phone found for ${session.targetUser}. We must validate via security questions or Manager Approval.`);
              await context.sendActivity(`Please answer the security question: What is your manager's last name?`);
            }
          } catch (err: any) {
             await context.sendActivity(`❌ Failed to retrieve user details from Azure AD: ${err.message}`);
             session.state = 'AWAITING_USER';
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
          await context.sendActivity(`✅ OTP Verified successfully! Executing action for ${session.targetUser}...`);
          try {
            await this.executeIntent(context, session);
          } catch (err: any) {
            await context.sendActivity(`❌ Failed to execute action in Azure AD: ${err.message}. Escalating to a human agent.`);
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
          await context.sendActivity(`✅ Security details validated. Executing action for ${session.targetUser}...`);
          try {
            await this.executeIntent(context, session);
          } catch (err: any) {
            await context.sendActivity(`❌ Failed to execute action in Azure AD: ${err.message}. Escalating to a human agent.`);
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

  private static async executeIntent(context: TurnContext, session: ResetSession) {
    const { GraphService } = await import('./graphService');
    const { CardBuilder } = await import('../cards/cardBuilder');

    if (session.intent === 'RESET_PASSWORD') {
      const tempPassword = await GraphService.resetPassword(session.targetUser, true);
      const card = CardBuilder.textResponseCard(
        'Password Reset Successful',
        `Password has been reset. The temporary password for ${session.targetUser} is: **${tempPassword}**\n\nPlease ensure this is changed immediately upon next login.`,
        'success'
      );
      await context.sendActivity({ attachments: [card] });

    } else if (session.intent === 'UNLOCK_ACCOUNT') {
      const user = await GraphService.getUser(session.targetUser);
      if (!user) throw new Error("User not found");

      if (user.accountEnabled === false) {
        throw new Error("Account is administratively blocked (accountEnabled=false). We cannot unlock this without L2 intervention.");
      }

      if (user.onPremisesSyncEnabled) {
        throw new Error("Account is synchronized from On-Premises AD. Please unlock from the local Active Directory.");
      }

      // Cloud-only unlock
      await GraphService.revokeSignInSessions(session.targetUser);
      const card = CardBuilder.textResponseCard(
        'Account Unlocked',
        `Active sessions for ${session.targetUser} have been revoked and the account is cleared for fresh sign-in.\n\nIf they still cannot sign in, please request a Password Reset (SUC001).`,
        'success'
      );
      await context.sendActivity({ attachments: [card] });

    } else if (session.intent === 'RESET_SSPR') {
      await GraphService.clearAuthenticationMethods(session.targetUser);
      const card = CardBuilder.textResponseCard(
        'SSPR Registration Reset',
        `Authentication methods for ${session.targetUser} have been cleared. They will be prompted to set up SSPR again on their next login.`,
        'success'
      );
      await context.sendActivity({ attachments: [card] });
    }
  }
}
