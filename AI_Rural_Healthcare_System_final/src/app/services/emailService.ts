import emailjs from "@emailjs/browser";
import type { AnalysisResult } from "../App";

// EmailJS Configuration from environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

export interface EmailParams {
    patient_name: string;
    guardian_email: string;
    condition: string;
    severity: string;
    severity_score: number;
    recommendations: string;
    timestamp: string;
    message_html?: string; // Optional if you want to pass full HTML
}

export interface ReportEmailParams {
    patient_name: string;
    to_email: string;
    condition: string;
    severity: string;
    severity_score: number;
    timestamp: string;
    pdf_url: string;
    message_html?: string;
}

/**
 * Sends an emergency email using EmailJS
 */
export const sendEmergencyEmail = async (patientName: string, guardianEmail: string, result: AnalysisResult) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn("EmailJS is not configured. Please set your VITE_EMAILJS_* environment variables.");
        return { success: false, error: "EmailJS not configured" };
    }

    const recommendations = result.firstAid.map(step => `• ${step}`).join("\n");
    const condition = result.conditions?.[0]?.name || "Unspecified Condition";
    const timestamp = new Date().toLocaleString();

    // Professional HTML template styled like SwasthyaAI
    const htmlMessage = `
        <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; padding: 24px; border: 2px solid #ef4444; border-radius: 16px; max-width: 600px; margin: auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #ef4444; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🚨 CRITICAL HEALTH ALERT</h1>
                <p style="color: #64748b; margin: 4px 0 0 0; font-weight: 500;">SwasthyaAI Emergency Response System</p>
            </div>

            <div style="background-color: #fef2f2; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #fee2e2;">
                <h2 style="color: #991b1b; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #fecaca; padding-bottom: 8px;">Patient Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; color: #4b5563; font-weight: 600; width: 40%;">Patient Name:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${patientName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #4b5563; font-weight: 600;">Detected Condition:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${condition}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #4b5563; font-weight: 600;">Severity Level:</td>
                        <td style="padding: 6px 0;"><span style="background-color: #ef4444; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 800;">CRITICAL</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #4b5563; font-weight: 600;">Time Detected:</td>
                        <td style="padding: 6px 0; color: #1e293b;">${timestamp}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 24px;">
                <h3 style="color: #1e3a8a; font-size: 16px; margin: 0 0 12px 0;">Recommended Immediate Actions:</h3>
                <ul style="color: #334155; padding-left: 20px; line-height: 1.6;">
                    ${result.firstAid.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join("")}
                </ul>
            </div>
            
            <div style="text-align: center; background-color: #1e3a8a; color: #ffffff; padding: 16px; border-radius: 12px; margin-top: 30px;">
                <p style="margin: 0; font-weight: bold; font-size: 16px;">
                    PLEASE CONTACT THE PATIENT OR SEEK MEDICAL ATTENTION IMMEDIATELY.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    This alert was triggered automatically by the SwasthyaAI Rural Healthcare triage system. 
                    This is an automated message. Do not reply to this email.
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin-top: 8px;">
                    &copy; 2026 SwasthyaAI Infrastructure. Professional Emergency Services.
                </p>
            </div>
        </div>
    `;

    const templateParams = {
        patient_name: patientName,
        to_email: guardianEmail,
        condition: condition,
        severity: "CRITICAL",
        severity_score: result.severityScore,
        recommendations: recommendations,
        timestamp: timestamp,
        message_html: htmlMessage // User should use {{{message_html}}} in EmailJS template
    };

    try {
        console.log("Sending email to:", guardianEmail); // 👈 ADD THIS

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        console.log("EmailJS Success:", response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error("EmailJS Error:", error);
        return { success: false, error };
    }
};

/**
 * Sends a PDF report link using EmailJS.
 * NOTE: Configure template with variables:
 *  - {{to_email}}, {{patient_name}}, {{condition}}, {{severity}}, {{severity_score}}, {{timestamp}}, {{pdf_url}}
 * Optional rich body with {{{message_html}}}
 */
export const sendPdfReportEmail = async (patientName: string, recipientEmail: string, result: AnalysisResult, pdfUrl: string) => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.warn("EmailJS is not configured. Please set your VITE_EMAILJS_* environment variables.");
        return { success: false, error: "EmailJS not configured" };
    }

    const condition = result.conditions?.[0]?.name || "Unspecified Condition";
    const timestamp = new Date().toLocaleString();

    const htmlMessage = `
        <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="margin: 0 0 8px 0; color: #1e3a8a;">Medical Evaluation Report</h2>
            <p style="margin: 0 0 16px 0; color: #475569;">Patient: <strong>${patientName}</strong></p>
            <p style="margin: 0 0 8px 0; color: #334155;">Condition: <strong>${condition}</strong></p>
            <p style="margin: 0 0 8px 0; color: #334155;">Priority: <strong>${result.priority}</strong> (${result.severityScore}/100)</p>
            <p style="margin: 0 0 16px 0; color: #64748b;">Generated at: ${timestamp}</p>
            <a href="${pdfUrl}" target="_blank" style="display:inline-block; text-decoration:none; background:#2563eb; color:#fff; padding:10px 14px; border-radius:8px; font-weight:600;">Open PDF Report</a>
            <p style="margin-top: 16px; color: #64748b; font-size: 12px;">This is an automated email from SwasthyaAI.</p>
        </div>
    `;

    const templateParams: ReportEmailParams = {
        patient_name: patientName,
        to_email: recipientEmail,
        condition,
        severity: result.priority,
        severity_score: result.severityScore,
        timestamp,
        pdf_url: pdfUrl,
        message_html: htmlMessage
    };

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        console.log("Report EmailJS Success:", response.status, response.text);
        return { success: true, response };
    } catch (error) {
        console.error("Report EmailJS Error:", error);
        return { success: false, error };
    }
};
