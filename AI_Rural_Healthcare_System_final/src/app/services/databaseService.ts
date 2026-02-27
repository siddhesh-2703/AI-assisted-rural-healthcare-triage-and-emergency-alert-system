import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    getDocs,
    limit,
    where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { AnalysisResult } from "../App";

export interface ReportData extends Omit<AnalysisResult, 'timestamp'> {
    timestamp: Date;
}

// Collection reference
const reportsCollection = collection(db, "reports");

/**
 * Safely parses various date/timestamp formats from Firestore
 */
const parseSafeDate = (val: any): Date | null => {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    if (val.seconds) return new Date(val.seconds * 1000);
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
};

/**
 * Sanitizes data for Firestore by removing undefined values
 */
const sanitizeData = (data: any): any => {
    const sanitized = JSON.parse(JSON.stringify(data));
    const removeUndefined = (obj: any) => {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            } else if (obj[key] && typeof obj[key] === 'object') {
                removeUndefined(obj[key]);
            }
        });
    };
    removeUndefined(sanitized);
    return sanitized;
};

/**
 * Saves a new patient report to Firestore
 */
export const saveReport = async (result: AnalysisResult, userId?: string) => {
    try {
        const sanitizedResult = sanitizeData(result);
        const docRef = await addDoc(reportsCollection, {
            ...sanitizedResult,
            userId: userId || 'anonymous',
            timestamp: Timestamp.now()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error saving report: ", e);
        return null;
    }
};

/**
 * Fetches the latest 5 reports for a specific user
 */
export const getUserReports = async (userId: string) => {
    try {
        const q = query(
            reportsCollection,
            where("userId", "==", userId),
            orderBy("timestamp", "desc"),
            limit(20)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: parseSafeDate(data.timestamp)
            };
        });
    } catch (e) {
        console.error("Error fetching user reports: ", e);
        return [];
    }
};

/**
 * Refactored Guardian Notification system
 */
export const saveGuardianAlerts = async (userId: string, contacts: { name: string, phone: string, email: string }[]) => {
    try {
        const guardianDoc = doc(db, "guardian_settings", userId);
        await setDoc(guardianDoc, {
            userId,
            contacts,
            updatedAt: Timestamp.now()
        });
        return true;
    } catch (e) {
        console.error("Error saving guardian alerts: ", e);
        return false;
    }
};

export const getGuardianAlerts = async (userId: string) => {
    try {
        const guardianDoc = doc(db, "guardian_settings", userId);
        const docSnap = await getDoc(guardianDoc);

        if (docSnap.exists()) {
            return docSnap.data().contacts || [];
        }
        return [];
    } catch (e) {
        console.error("Error fetching guardian alerts: ", e);
        return [];
    }
};

/**
 * Subscribes to real-time updates for user reports
 */
export const subscribeToReports = (callback: (reports: any[]) => void, userId?: string) => {
    const q = userId
        ? query(reportsCollection, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(20))
        : query(reportsCollection, orderBy("timestamp", "desc"), limit(100));

    return onSnapshot(q, (querySnapshot) => {
        const reports = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: parseSafeDate(data.timestamp)
            };
        });
        callback(reports);
    });
};

/**
 * Creates an entry in the 'alerts' collection to trigger the Cloud Function
 */
export const createAlert = async (patientName: string, guardianEmail: string, condition: string, result: AnalysisResult) => {
    try {
        const alertsCollection = collection(db, "alerts");
        await addDoc(alertsCollection, {
            patientName,
            guardianEmail,
            condition,
            severity: result.priority.toUpperCase(),
            severityScore: result.severityScore,
            recommendations: result.firstAid,
            timestamp: Timestamp.now()
        });
        return true;
    } catch (e) {
        console.error("Error creating alert: ", e);
        return false;
    }
};

/**
 * @deprecated The email logic has been moved to the frontend using EmailJS (emailService.ts).
 * This function is kept for backward compatibility but is no longer used for emergency triggers.
 */
export const triggerEmergencyEmail = async (patientName: string, guardianEmail: string, guardianName: string, result: AnalysisResult) => {
    console.log("Legacy email trigger called. Skipping as EmailJS is now active.");
    return true;
};

/**
 * Fetches initial analytics data (one-time fetch)
 */
export const getInitialAnalytics = async () => {
    try {
        const q = query(reportsCollection, orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching analytics: ", e);
        return [];
    }
};

/**
 * Uploads an image to Firebase Storage and returns the download URL
 */
export const uploadImage = async (file: File) => {
    try {
        const storageRef = ref(storage, `analysis/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (e) {
        console.error("Error uploading image: ", e);
        return null;
    }
};
