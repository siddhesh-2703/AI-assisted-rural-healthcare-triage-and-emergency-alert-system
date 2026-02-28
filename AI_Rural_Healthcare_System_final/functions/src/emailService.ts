import nodemailer, {Transporter} from "nodemailer";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  pdfBase64?: string;
  pdfFileName?: string;
}

class EmailService {
  private readonly user: string;
  private readonly appPassword: string;
  private readonly senderName: string;
  private readonly isConfigured: boolean;
  private transporter: Transporter | null = null;

  constructor() {
    this.user = process.env.GMAIL_USER || "";
    this.appPassword = process.env.GMAIL_APP_PASSWORD || "";
    this.senderName = process.env.ALERT_SENDER_NAME || "SwasthyaAI Alerts";
    this.isConfigured = !!this.user && !!this.appPassword;
  }

  private getTransporter(): Transporter {
    if (!this.isConfigured) {
      throw new Error("Email service is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
    }
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.user,
          pass: this.appPassword,
        },
      });
    }
    return this.transporter;
  }

  async testConnection() {
    try {
      await this.getTransporter().verify();
      return {success: true, message: "Email service connection verified."};
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {success: false, message};
    }
  }

  async sendEmail(options: SendEmailOptions) {
    const transporter = this.getTransporter();
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    return await transporter.sendMail({
      from: `"${this.senderName}" <${this.user}>`,
      to: recipients.join(", "),
      subject: options.subject,
      html: options.html,
      attachments: options.pdfBase64 ? [{
        filename: options.pdfFileName || `Medical_Triage_Report_${Date.now()}.pdf`,
        content: options.pdfBase64,
        encoding: "base64",
        contentType: "application/pdf",
      }] : [],
    });
  }
}

export const emailService = new EmailService();
