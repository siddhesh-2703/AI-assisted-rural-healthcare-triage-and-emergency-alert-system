"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = null;
        this.user = process.env.GMAIL_USER || "";
        this.appPassword = process.env.GMAIL_APP_PASSWORD || "";
        this.senderName = process.env.ALERT_SENDER_NAME || "SwasthyaAI Alerts";
        this.isConfigured = !!this.user && !!this.appPassword;
    }
    getTransporter() {
        if (!this.isConfigured) {
            throw new Error("Email service is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
        }
        if (!this.transporter) {
            this.transporter = nodemailer_1.default.createTransport({
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
            return { success: true, message: "Email service connection verified." };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return { success: false, message };
        }
    }
    async sendEmail(options) {
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
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map