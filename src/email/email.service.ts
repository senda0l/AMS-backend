import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly enabled: boolean;

  constructor(private configService: ConfigService) {
    this.enabled = this.configService.get('EMAIL_ENABLED') === 'true';
    
    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get('EMAIL_PORT') || '587'),
        secure: false,
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASSWORD'),
        },
      });
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.warn('Email sending is disabled. Skipping email to ' + to);
      return;
    }

    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM') || this.configService.get('EMAIL_USER'),
        to,
        subject,
        text: text || this.stripHtml(html),
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      // Don't throw error to prevent breaking the notification flow
    }
  }

  async sendIssueStatusChangeEmail(
    to: string,
    issueTitle: string,
    oldStatus: string,
    newStatus: string,
    issueId: string,
  ): Promise<void> {
    const subject = `Issue Status Updated: ${issueTitle}`;
    const html = `
      <h2>Issue Status Updated</h2>
      <p>Your issue "<strong>${issueTitle}</strong>" status has been updated.</p>
      <p><strong>Previous Status:</strong> ${oldStatus}</p>
      <p><strong>New Status:</strong> ${newStatus}</p>
      <p>Please check the issue details in the system.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendIssueAssignedEmail(
    to: string,
    issueTitle: string,
    issueId: string,
  ): Promise<void> {
    const subject = `New Issue Assigned: ${issueTitle}`;
    const html = `
      <h2>New Issue Assigned</h2>
      <p>A new issue "<strong>${issueTitle}</strong>" has been assigned to you.</p>
      <p>Please check the issue details and take necessary action.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  async sendIssueCreatedEmail(
    to: string,
    issueTitle: string,
    category: string,
    buildingName: string,
  ): Promise<void> {
    const subject = `New Issue Created: ${issueTitle}`;
    const html = `
      <h2>New Issue Created</h2>
      <p>A new ${category} issue "<strong>${issueTitle}</strong>" has been created in ${buildingName}.</p>
      <p>Please review and take necessary action.</p>
    `;

    await this.sendEmail(to, subject, html);
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  }
}

