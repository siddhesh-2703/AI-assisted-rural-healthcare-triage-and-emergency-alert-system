import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, Phone, MapPin, Loader2 } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyModeProps {
  onBack: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function EmergencyMode({ onBack, onAnalysisComplete }: EmergencyModeProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'initial' | 'symptoms' | 'processing'>('initial');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const criticalSymptoms = [
    { id: 'chest-pain', label: `💔 ${t('chestPain')}`, severity: 95 },
    { id: 'breathing', label: `🫁 ${t('difficultyBreathing')}`, severity: 92 },
    { id: 'unconscious', label: `😵 ${t('unconscious')}`, severity: 98 },
    { id: 'bleeding', label: `🩸 ${t('severeBleeding')}`, severity: 90 },
    { id: 'stroke', label: `🧠 ${t('strokeSymptoms')}`, severity: 96 },
    { id: 'seizure', label: `⚡ ${t('seizure')}`, severity: 88 },
    { id: 'accident', label: `🚗 ${t('majorAccident')}`, severity: 94 },
    { id: 'poisoning', label: `☠️ ${t('poisoning')}`, severity: 93 },
    { id: 'snake-bite', label: `🐍 ${t('snakeBite')}`, severity: 95 },
    { id: 'burn', label: `🔥 ${t('severeBurns')}`, severity: 87 },
  ];

  const handleEmergencyProcess = async () => {
    setStep('processing');

    // Simulate emergency processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate severity based on selected symptoms
    const maxSeverity = Math.max(...selectedSymptoms.map(id => {
      const symptom = criticalSymptoms.find(s => s.id === id);
      return symptom?.severity || 85;
    }));

    const result: AnalysisResult = {
      symptoms: selectedSymptoms.map(id => {
        const symptom = criticalSymptoms.find(s => s.id === id);
        return symptom?.label || '';
      }),
      conditions: [
        { name: t('criticalEmergency'), confidence: 98 },
        { name: t('immediateAttention'), confidence: 95 },
        { name: t('lifeThreateningPossible'), confidence: 88 },
      ],
      severityScore: maxSeverity,
      priority: 'Critical',
      firstAid: [
        t('callAmbulanceAction'),
        t('keepPatientCalm'),
        t('noFoodWater'),
        t('monitorBreathing'),
        t('noteTime'),
        t('gatherMeds'),
      ],
      ambulanceRequired: true,
    };

    onAnalysisComplete(result);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      {/* Flashing Background for Emergency */}
      <motion.div
        className="absolute inset-0 bg-red-500/10"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {step === 'initial' && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToDashboard')}
            </button>
          )}
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-red-600">{t('emergencyMode')}</h2>
              <p className="text-gray-600">{t('fastTrackCritical')}</p>
            </div>
          </div>
        </motion.div>

        {/* Initial Warning */}
        {step === 'initial' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border-4 border-red-500 shadow-2xl">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex p-6 bg-red-100 rounded-full mb-4"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone className="w-16 h-16 text-red-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('lifeThreateningWarning')}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('medicalDisclaimer')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <motion.a
                    href="tel:108"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="w-6 h-6" />
                    {t('call')} 108 ({t('ambulanceService')})
                  </motion.a>
                  <motion.a
                    href="tel:102"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="w-6 h-6" />
                    {t('call')} 102 ({t('medicalEmergencyContact')})
                  </motion.a>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-center text-gray-700 mb-4">
                  {t('continueAiAssessment')}
                </p>
                <motion.button
                  onClick={() => setStep('symptoms')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('continueAssessment')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Symptom Selection */}
        {step === 'symptoms' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {t('selectEmergencySymptoms')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {criticalSymptoms.map((symptom) => (
                <motion.button
                  key={symptom.id}
                  onClick={() => {
                    setSelectedSymptoms(prev =>
                      prev.includes(symptom.id)
                        ? prev.filter(s => s !== symptom.id)
                        : [...prev, symptom.id]
                    );
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${selectedSymptoms.includes(symptom.id)
                    ? 'bg-red-100 border-red-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-red-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl">{symptom.label.split(' ')[0]}</div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">
                      {symptom.label.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                  {selectedSymptoms.includes(symptom.id) && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                {t('additionalInfoOptional')}
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder={t('criticalDetailsPlaceholder')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
            </div>

            <motion.button
              onClick={handleEmergencyProcess}
              disabled={selectedSymptoms.length === 0}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 ${selectedSymptoms.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                } shadow-lg`}
              whileHover={selectedSymptoms.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedSymptoms.length > 0 ? { scale: 0.98 } : {}}
            >
              {selectedSymptoms.length > 0 ? (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  {t('processEmergency')}
                </>
              ) : (
                t('selectAtLeastOne')
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16 text-red-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t('analyzing')}
            </h3>
            <p className="text-gray-600">
              {t('analyzing')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
