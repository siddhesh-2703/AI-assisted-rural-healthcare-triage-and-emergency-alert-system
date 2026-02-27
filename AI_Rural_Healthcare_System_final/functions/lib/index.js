"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAlertCreated = exports.sendCriticalAlertNotifications = exports.testEmailConfiguration = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const emailService_1 = require("./emailService");
admin.initializeApp();
const normalizeEmail = (value) => value.trim().toLowerCase();
const extractEmails = (contacts = []) => {
    const emails = contacts
        .map((contact) => contact.email || "")
        .map((email) => normalizeEmail(email))
        .filter((email) => email.length > 0);
    return Array.from(new Set(emails));
};
const getSummary = (result) => {
    const conditionName = result?.conditions?.[0]?.name || "Not specified";
    const severity = result?.priority || "Critical";
    const score = result?.severityScore ?? 0;
    return `${conditionName} | ${severity} | severity score ${score}/100`;
};
const buildEmailHtml = (patientName, result) => {
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
const sendEmailWithOptionalPdf = async (to, subject, patientName, result, pdfBase64, pdfFileName) => {
    await emailService_1.emailService.sendEmail({
        to,
        subject,
        html: buildEmailHtml(patientName, result),
        pdfBase64,
        pdfFileName,
    });
};
exports.testEmailConfiguration = (0, https_1.onCall)(async () => {
    const result = await emailService_1.emailService.testConnection();
    if (!result.success) {
        throw new https_1.HttpsError("failed-precondition", result.message);
    }
    return result;
});
exports.sendCriticalAlertNotifications = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to send alerts.");
    }
    const payload = request.data;
    const patientName = (payload.patientName || "A Patient").trim();
    const contacts = payload.contacts || [];
    const result = payload.result;
    const emails = extractEmails(contacts);
    if (emails.length === 0) {
        throw new https_1.HttpsError("invalid-argument", "No email recipients found in contacts.");
    }
    const emailErrors = [];
    let emailsSent = 0;
    await Promise.all(emails.map(async (email) => {
        try {
            await sendEmailWithOptionalPdf(email, `Critical Alert for ${patientName}`, patientName, result, payload.pdfBase64, payload.pdfFileName);
            emailsSent += 1;
        }
        catch (error) {
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
exports.onAlertCreated = functions
    .firestore.document("alerts/{alertId}")
    .onCreate(async (snap, context) => {
    functions.logger.info("New alert document created in Firestore.", {
        alertId: context.params.alertId,
    });
    return null;
});
//# sourceMappingURL=index.js.map