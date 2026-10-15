import { Controller, Post, Roles } from '@ferrox-node/core';

@Controller('/api/v1/mailer')
export class MailerController {
  @Post('/send')
  @Roles('admin', 'user', 'founder')
  sendMail(req: any) {
    const { to, subject, html } = req.body || {};
    return {
      success: true,
      messageId: `msg_${Math.random().toString(36).substring(2, 10)}`,
      recipient: to || 'recipient@ferrox.dev',
      subject: subject || 'Notification',
      status: 'SENT_TO_MAILHOG',
      dispatchedAt: new Date().toISOString(),
    };
  }
}
