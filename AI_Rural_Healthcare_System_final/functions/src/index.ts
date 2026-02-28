import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {emailService} from "./emailService";

admin.initializeApp();

type Priority = "Low" | "Medium" | "High" | "Critical";

interface AnalysisResult {
    severityScore: number;
    priority: Priority;
    firstAid?: string[];
    conditions?: Array<{name: string}>;
    symptoms?: string[];
}

interface Contact {
    name?: string;
    email?: string;
    phone?: string;
}

interface AlertPayload {
    patientName?: string;
    result?: AnalysisResult;
    contacts?: Contact[];
    pdfBase64?: string;
    pdfFileName?: string;
}

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const extractEmails = (contacts: Contact[] = []): string[] => {
    const emails = contacts
        .map((contact) => contact.email || "")
        .map((email) => normalizeEmail(email))
        .filter((email) => email.length > 0);
    return Array.from(new Set(emails));
};

const getSummary = (result?: AnalysisResult): string => {
    const conditionName = result?.conditions?.[0]?.name || "Not specified";
    const severity = result?.priority || "Critical";
    const score = result?.severityScore ?? 0;
    return `${conditionName} | ${severity} | severity score ${score}/100`;
};

const buildEmailHtml = (patientName: string, result?: AnalysisResult): string => {
    const firstAidHtml = (result?.firstAid || [])
        .slice(0, 6)
        .map((step) => `<li>${step}</li>`)
        .join("");

    return `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
        <h2 style="color:#dc2626;">Emergency Medical Alert</h2>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Summary:</strong> ${getSummary(result)}</p>
        <p><strong>Immediate first aid:</strong></p>
        <ul>${firstAidHtml || "<li>Follow medical professional guidance immediately.</li>"}</ul>
        <p style="margin-top: 16px;">This alert was triggered by the SwasthyaAI system.</p>
      </div>
    `;
};

const sendEmailWithOptionalPdf = async (
    to: string,
    subject: string,
    patientName: string,
    result: AnalysisResult | undefined,
    pdfBase64?: string,
    pdfFileName?: string
) => {
    await emailService.sendEmail({
        to,
        subject,
        html: buildEmailHtml(patientName, result),
        pdfBase64,
        pdfFileName,
    });
};

export const testEmailConfiguration = onCall(async () => {
    const result = await emailService.testConnection();
    if (!result.success) {
        throw new HttpsError("failed-precondition", result.message);
    }
    return result;
});

export const sendCriticalAlertNotifications = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in to send alerts.");
    }

    const payload = request.data as AlertPayload;
    const patientName = (payload.patientName || "A Patient").trim();
    const contacts = payload.contacts || [];
    const result = payload.result;

    const emails = extractEmails(contacts);
    if (emails.length === 0) {
        throw new HttpsError("invalid-argument", "No email recipients found in contacts.");
    }

    const emailErrors: string[] = [];
    let emailsSent = 0;

    await Promise.all(emails.map(async (email) => {
        try {
            await sendEmailWithOptionalPdf(
                email,
                `Critical Alert for ${patientName}`,
                patientName,
                result,
                payload.pdfBase64,
                payload.pdfFileName
            );
            emailsSent += 1;
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            emailErrors.push(`${email}: ${msg}`);
        }
    }));

    logger.info("Critical alerts processed.", {
        uid: request.auth.uid,
        emailsAttempted: emails.length,
        emailsSent,
    });

    return {
        ok: emailErrors.length === 0,
        emailsAttempted: emails.length,
        emailsSent,
        emailErrors,
    };
});

export const onAlertCreated = functions
    .firestore.document("alerts/{alertId}")
    .onCreate(async (snap, context) => {
        functions.logger.info("New alert document created in Firestore.", {
            alertId: context.params.alertId,
        });
        return null;
    });
