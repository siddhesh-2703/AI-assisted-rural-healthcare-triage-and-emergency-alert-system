import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Activity, AlertCircle, Phone, MapPin, Navigation, Clock, Heart, Download, List, Cloud, CloudOff, Loader2, Check, BellRing, Search, LocateFixed } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { generateMedicalReportPDF, generateMedicalReportPDFBlob } from '../utils/pdfGenerator';
import HospitalMap from './HospitalMap';
import app, { auth, storage } from '../services/firebase';
import { saveReport, getGuardianAlerts, createAlert } from '../services/databaseService';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { fetchNearbyHospitals, filterHospitals, type NearbyHospital } from '../services/hospitalLocator';
import { sendCriticalAlertNotifications } from '../services/notificationService';
import { Input } from './ui/input';
import { FirebaseError } from 'firebase/app';
import { ref, getDownloadURL, uploadBytesResumable, getStorage as getStorageForBucket, type Storage } from 'firebase/storage';
import { sendPdfReportEmail } from '../services/emailService';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onBack: () => void;
  userId?: string;
}

export default function ResultsDisplay({ result, onBack, userId }: ResultsDisplayProps) {
  const { t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'error'>('idle');
  const [locationError, setLocationError] = useState('');
  const [isHospitalsLoading, setIsHospitalsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [contacts, setContacts] = useState<any[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [sendPdfStatus, setSendPdfStatus] = useState('');
  const hasSaved = useRef(false);

  useEffect(() => {
    const performSave = async () => {
      if (!hasSaved.current && result) {
        setSaveStatus('saving');
        const savedId = await saveReport(result, userId);
        if (savedId) {
          setSaveStatus('saved');
          hasSaved.current = true;
        } else {
          setSaveStatus('error');
        }
      }
    };

    const fetchContacts = async () => {
      if (userId && result?.priority === 'Critical') {
        const data = await getGuardianAlerts(userId);
        setContacts(data);

        // Trigger real alerts for each guardian via Cloud Functions
        if (data.length > 0) {
          const patientName = auth.currentUser?.displayName || auth.currentUser?.email || 'A Patient';
          const conditionName = result.conditions?.[0]?.name || 'Critical Condition';

          data.forEach((guardian: any) => {
            if (guardian.email) {
              createAlert(patientName, guardian.email, conditionName, result);
            }
          });

          try {
            const response = await sendCriticalAlertNotifications(patientName, result, data);
            const payload = response.data as { emailsSent: number };
            toast.success('Emergency notifications sent', {
              description: `Email sent: ${payload.emailsSent || 0}.`,
              duration: 5000,
            });
          } catch (error) {
            console.error('Failed to send critical notifications:', error);
            toast.error('Failed to send some emergency notifications', {
              description: 'Please contact guardians manually if needed.',
            });
          }
        }
      }
    };

    performSave();
    fetchContacts();
  }, [result, userId]);

  const priorityColors = {
    Low: { bg: 'from-green-50 to-emerald-50', border: 'border-green-500', text: 'text-green-600', ring: 'bg-green-500' },
    Medium: { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-500', text: 'text-yellow-600', ring: 'bg-yellow-500' },
    High: { bg: 'from-orange-50 to-red-50', border: 'border-orange-500', text: 'text-orange-600', ring: 'bg-orange-500' },
    Critical: { bg: 'from-red-50 to-pink-50', border: 'border-red-500', text: 'text-red-600', ring: 'bg-red-500' },
  };

  // Safe priority resolution to handle potential localization from AI
  const resolvePriority = (p: string): keyof typeof priorityColors => {
    const raw = p?.trim()?.toLowerCase();
    if (raw?.includes('critical') || raw?.includes('गंभीर') || raw?.includes('முக்கிய')) return 'Critical';
    if (raw?.includes('high') || raw?.includes('उच्च') || raw?.includes('அதி')) return 'High';
    if (raw?.includes('medium') || raw?.includes('मध्यम') || raw?.includes('நடுத்தர')) return 'Medium';
    return 'Low';
  };

  const safePriority = resolvePriority(result.priority);
  const colors = priorityColors[safePriority] || priorityColors.Low;

  const requestLocationAndHospitals = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      setLocationError('Location is not supported in this browser.');
      return;
    }

    setLocationStatus('requesting');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const coordsObj = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(coordsObj);
        setLocationStatus('granted');
        setIsHospitalsLoading(true);

        try {
          const nearbyHospitals = await fetchNearbyHospitals(coordsObj.lat, coordsObj.lng);
          setHospitals(nearbyHospitals);
        } catch (error) {
          setLocationStatus('error');
          setLocationError(error instanceof Error ? error.message : 'Failed to load nearby hospitals.');
          setHospitals([]);
        } finally {
          setIsHospitalsLoading(false);
        }
      },
      (error) => {
        setLocationStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Allow location access to see nearby hospitals.');
        } else {
          setLocationError('Unable to access location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  useEffect(() => {
    requestLocationAndHospitals();
  }, []);

  const openGoogleMaps = (hospital: NearbyHospital) => {
    const origin = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
    const url = `https://www.google.com/maps/dir/?api=1${origin}&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, '_blank');
  };

  const filteredHospitals = useMemo(() => {
    return filterHospitals(hospitals, hospitalSearch);
  }, [hospitalSearch, hospitals]);

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
      }, ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const withRetry = async <T,>(fn: () => Promise<T>, attempts: number, label: string): Promise<T> => {
    let lastError: unknown;
    for (let i = 1; i <= attempts; i += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < attempts) {
          setSendPdfStatus(`${label} failed, retrying (${i}/${attempts - 1})...`);
          await sleep(1200);
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error(`${label} failed`);
  };

  const uploadPdfWithTimeout = async (
    storageInstance: Storage,
    reportPath: string,
    pdfBlob: Blob,
    timeoutMs: number
  ) => {
    const reportRef = ref(storageInstance, reportPath);
    const uploadTask = uploadBytesResumable(reportRef, pdfBlob, { contentType: 'application/pdf' });

    const uploadPromise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setSendPdfStatus(`Uploading PDF to cloud storage... ${pct}%`);
        },
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    return await withTimeout(uploadPromise, timeoutMs, 'PDF upload');
  };

  const handleSendReportToEmail = async () => {
    const recipient = shareEmail.trim().toLowerCase();
    if (!recipient) {
      toast.error('Please enter a Gmail address.');
      setSendPdfStatus('Enter recipient Gmail first.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      toast.error('Please enter a valid email address.');
      setSendPdfStatus('Invalid email format.');
      return;
    }

    const patientName = auth.currentUser?.displayName || auth.currentUser?.email || 'A Patient';

    try {
      setIsSendingReport(true);
      setSendPdfStatus('Generating PDF...');

      const pdfBlob = generateMedicalReportPDFBlob(result);
      const reportPath = `report_shares/${auth.currentUser?.uid || 'guest'}/${Date.now()}_report.pdf`;
      let pdfUrl = '';

      try {
        pdfUrl = await withRetry(
          () => uploadPdfWithTimeout(storage, reportPath, pdfBlob, 120000),
          2,
          'Primary bucket upload'
        );
      } catch (primaryError) {
        console.warn('Primary storage upload failed, trying appspot bucket fallback:', primaryError);
        setSendPdfStatus('Primary bucket failed. Trying fallback bucket...');

        const fallbackBucket = `gs://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`;
        const fallbackStorage = getStorageForBucket(app, fallbackBucket);

        pdfUrl = await withRetry(
          () => uploadPdfWithTimeout(fallbackStorage, reportPath, pdfBlob, 120000),
          1,
          'Fallback bucket upload'
        );
      }

      setSendPdfStatus('Sending email via EmailJS...');
      const emailResult = await sendPdfReportEmail(patientName, recipient, result, pdfUrl);
      if (!emailResult.success) {
        throw new Error('EmailJS failed to send PDF email.');
      }

      toast.success('Medical report sent successfully.', {
        description: `PDF report delivered to ${recipient}.`,
      });
      setSendPdfStatus(`Sent to ${recipient}.`);
    } catch (error) {
      console.error('Failed to send report email:', error);
      const description = error instanceof FirebaseError
        ? `${error.code}: ${error.message}`
        : error instanceof Error
          ? error.message
          : 'Check EmailJS and Firebase Storage configuration and try again.';
      toast.error('Failed to send report email.', {
        description,
      });
      setSendPdfStatus(description);
    } finally {
      setIsSendingReport(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('newAnalysis')}
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('analysisResults')}</h2>
          <p className="text-gray-600">{t('analysisResults')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guardian Alert Notification (Simulated) */}
            {userId && result.priority === 'Critical' && contacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-red-400 rounded-full blur-md"
                  />
                  <div className="relative bg-red-500 p-3 rounded-full">
                    <BellRing className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 leading-tight">{t('emergencyContactsNotified')}</h4>
                  <p className="text-sm text-red-800/70">{t('emergencyAlertSentDesc')}</p>
                </div>
                <div className="ml-auto flex -space-x-2">
                  {contacts.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Priority & Severity */}
            <motion.div
              className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-8 border-2 ${colors.border} shadow-xl`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-4 h-4 ${colors.ring} rounded-full`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${priorityColors[safePriority].border} ${priorityColors[safePriority].text} bg-white shadow-sm ring-1 ring-black/5`}>
                      {t(safePriority.toLowerCase())} {t('severityLevel')}
                    </span>

                    {/* Firebase Save Status Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/20 text-xs font-medium text-gray-500 shadow-sm">
                      {saveStatus === 'saving' && (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                          <span>{t('synchronizing')}</span>
                        </>
                      )}
                      {saveStatus === 'saved' && (
                        <>
                          <Cloud className="w-3 h-3 text-green-500" />
                          <Check className="w-2 h-2 text-green-600 -ml-1" />
                          <span className="text-green-600">{t('storedInHistory')}</span>
                        </>
                      )}
                      {saveStatus === 'error' && (
                        <>
                          <CloudOff className="w-3 h-3 text-red-400" />
                          <span className="text-red-500">{t('localSessionOnly')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {result.ambulanceRequired && (
                  <motion.span
                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🚑 {t('ambulanceRequired')}
                  </motion.span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{t('severityLevel')}</span>
                  <span className={`font-bold ${colors.text}`}>{result.severityScore}/100</span>
                </div>
                <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${colors.ring === 'bg-green-500' ? 'from-green-400 to-green-600' : colors.ring === 'bg-yellow-500' ? 'from-yellow-400 to-yellow-600' : colors.ring === 'bg-orange-500' ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${result.severityScore}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {result.riskFactors && result.riskFactors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">{t('riskFactors')}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.riskFactors.map((factor, index) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Probable Conditions */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                {t('probableConditions')}
              </h3>
              <div className="space-y-3">
                {result.conditions.map((condition, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{t(condition.name)}</div>
                        {condition.description && (
                          <div className="text-sm text-gray-600 mt-1">{t(condition.description)}</div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500">{t('confidence')}</div>
                        <div className="text-lg font-bold text-blue-600">{condition.confidence}%</div>
                      </div>
                    </div>

                    {/* Horizontal Progress Bar */}
                    <div className="w-full">
                      <div className="w-full h-2.5 bg-white/50 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className={`h-full rounded-full ${condition.confidence >= 80
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : condition.confidence >= 60
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                              : condition.confidence >= 40
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                : 'bg-gradient-to-r from-orange-400 to-orange-600'
                            }`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${condition.confidence}%` }}
                          transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Accuracy Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-green-700">{t('accuracyNote').split(':')[0]}:</span> {t('accuracyNote').split(':')[1]}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Image Analysis */}
            {result.imageAnalysis && (
              <motion.div
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📸 {t('medicalImageAnalysis')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t('injuryDetected')}</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.imageAnalysis.hasInjury ? `✓ ${t('male')}` : `✗ ${t('none')}`}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t('infectionRisk')}</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {result.imageAnalysis.infectionProbability}%
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">{t('bleedingLevel')}</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.imageAnalysis.bleedingSeverity}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* First Aid Steps */}
            <motion.div
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                {t('recommendedFirstAid')}
              </h3>
              <ol className="space-y-3">
                {result.firstAid
                  .filter(step => step && step.trim().length > 0 && !step.trim().endsWith(':'))
                  .map((step, index) => (
                    <motion.li
                      key={index}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{step}</span>
                    </motion.li>
                  ))}
              </ol>
            </motion.div>

            {/* Suggested Medicines */}
            {result.medicines && result.medicines.filter(m => m && m.trim().length > 0).length > 0 && (
              <motion.div
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-600" />
                  {t('suggestedMedicines')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.medicines
                    .filter(m => m && m.trim().length > 0 && !m.trim().endsWith(':'))
                    .map((med, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.55 + index * 0.05 }}
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-gray-700 font-medium">{med}</span>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Hospital Finder */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <motion.div
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('emergencyMode')}</h3>
              <div className="space-y-3">
                <motion.a
                  href="tel:108"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'tel:108';
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-bold">📞 {t('call')} 108</div>
                    <div className="text-xs opacity-90">{t('ambulanceService')}</div>
                  </div>
                </motion.a>
                <motion.a
                  href="tel:102"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'tel:102';
                  }}
                >
                  <Phone className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-bold">📞 {t('call')} 102</div>
                    <div className="text-xs opacity-90">{t('medicalEmergencyContact')}</div>
                  </div>
                </motion.a>
              </div>

              {/* Facility Recommendation */}
              {result.facilityRecommendation && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('recommendedFacility')}</h4>
                  <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-xl border border-blue-200">
                    🏥 {result.facilityRecommendation}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Nearby Hospitals */}
            <motion.div
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('findNearbyHospitals')}</h3>
                {locationStatus === 'granted' && hospitals.length > 0 && (
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`p-2 rounded-lg transition-colors ${showMap ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    title={showMap ? "Show List View" : "Show Map View"}
                  >
                    {showMap ? <List className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </button>
                )}
              </div>

              {(locationStatus === 'idle' || locationStatus === 'requesting' || isHospitalsLoading) && (
                <div className="mb-4 p-4 rounded-xl border border-blue-100 bg-blue-50 text-sm text-blue-800 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting location and finding nearby hospitals...</span>
                </div>
              )}

              {(locationStatus === 'denied' || locationStatus === 'unsupported' || locationStatus === 'error') && (
                <div className="mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
                  <p className="text-sm text-amber-900 mb-3">{locationError || 'Location access is required to find hospitals near you.'}</p>
                  <button
                    onClick={requestLocationAndHospitals}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
                  >
                    <LocateFixed className="w-4 h-4" />
                    Enable Location
                  </button>
                </div>
              )}

              {locationStatus === 'granted' && !isHospitalsLoading && (
                <div className="mb-4 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    placeholder="Search by hospital, type, or area"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>
              )}

              {locationStatus === 'granted' && !isHospitalsLoading && (
                <div className="relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!showMap ? (
                      <motion.div
                        key="list"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                      >
                        {filteredHospitals.map((hospital, index) => {
                          const hasPhone = Boolean(hospital.phone);

                          return (
                            <motion.div
                              key={index}
                              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 flex-1 text-sm">{hospital.name}</h4>
                                {hospital.emergency && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                                    24/7
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{hospital.address}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {hospital.distance}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {hospital.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                                  {hospital.type}
                                </span>
                                <span className="px-2 py-1 rounded font-medium bg-yellow-100 text-yellow-700">
                                  {hospital.beds} Beds
                                </span>
                              </div>
                              <div className="flex gap-2">
                                {hasPhone ? (
                                  <a
                                    href={`tel:${hospital.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = `tel:${hospital.phone}`;
                                    }}
                                  >
                                    <Phone className="w-4 h-4" />
                                    Call
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                                    disabled
                                  >
                                    <Phone className="w-4 h-4" />
                                    No Number
                                  </button>
                                )}
                                <button
                                  onClick={() => openGoogleMaps(hospital)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                  <Navigation className="w-4 h-4" />
                                  {t('navigate')}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                        {filteredHospitals.length === 0 && (
                          <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600">
                            {hospitals.length === 0 ? 'No nearby hospitals were found for your location.' : 'No hospitals matched your search.'}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="map"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                      >
                        <HospitalMap
                          hospitals={filteredHospitals}
                          onNavigate={openGoogleMaps}
                          onClose={() => setShowMap(false)}
                          center={userLocation}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-orange-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t('medicalDisclaimer')}</h4>
                  <p className="text-xs text-gray-600">
                    This is an AI assessment. Always consult a healthcare professional
                    for accurate diagnosis and treatment.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Download PDF Report */}
            <motion.button
              onClick={() => generateMedicalReportPDF(result)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <div>
                <div className="font-bold">{t('downloadPdf')}</div>
                <div className="text-xs opacity-90">{t('saveForRecords')}</div>
              </div>
            </motion.button>


          </div>
        </div>
      </div>
    </div>
  );
}
