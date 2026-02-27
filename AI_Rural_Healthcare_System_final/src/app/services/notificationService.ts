import { httpsCallable } from 'firebase/functions';
import type { AnalysisResult } from '../App';
import { functions } from './firebase';
import { generateMedicalReportPDFBlob } from '../utils/pdfGenerator';

export interface Contact {
  name?: string;
  email?: string;
  phone?: string;
}

const blobToBase64 = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unable to convert PDF blob to base64.'));
        return;
      }
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read PDF blob.'));
    reader.readAsDataURL(blob);
  });
};

const getPdfPayload = async (result: AnalysisResult) => {
  const pdfBlob = generateMedicalReportPDFBlob(result);
  const pdfBase64 = await blobToBase64(pdfBlob);
  const pdfFileName = `Medical_Triage_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.pdf`;
  return { pdfBase64, pdfFileName };
};

export const sendCriticalAlertNotifications = async (
  patientName: string,
  result: AnalysisResult,
  contacts: Contact[]
) => {
  const callable = httpsCallable(functions, 'sendCriticalAlertNotifications');
  const { pdfBase64, pdfFileName } = await getPdfPayload(result);
  return await callable({
    patientName,
    result,
    contacts,
    pdfBase64,
    pdfFileName,
  });
};
