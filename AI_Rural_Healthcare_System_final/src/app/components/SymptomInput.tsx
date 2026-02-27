import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send, AlertCircle } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { analyzeSymptoms as professionalAnalysis } from '../services/professionalAI';
import { useLanguage } from '../context/LanguageContext';

interface SymptomInputProps {
  onBack: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function SymptomInput({ onBack, onAnalysisComplete }: SymptomInputProps) {
  const { t, language } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const riskFactorOptions = [
    { id: 'diabetes', label: t('diabetes') },
    { id: 'hypertension', label: t('hypertension') },
    { id: 'pregnant', label: t('pregnant') },
    { id: 'elderly', label: t('elderly') },
    { id: 'child', label: t('child') },
    { id: 'heart', label: t('heartDisease') },
    { id: 'asthma', label: t('asthma') },
    { id: 'chronic', label: t('chronicIllness') },
  ];

  const toggleRiskFactor = (id: string) => {
    setRiskFactors(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      // Construct a comprehensive prompt input including metadata
      const fullInput = `
        Symptoms: ${symptoms}
        Patient Age: ${age || 'Not specified'}
        Duration: ${duration || 'Not specified'}
        Risk Factors: ${riskFactors.length > 0 ? riskFactors.join(', ') : 'None'}
      `.trim();

      // Use professional AI analysis with patient data and language
      const result = await professionalAnalysis(fullInput, language);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(result);
      }, 500);
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      alert('Failed to analyze symptoms. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
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
            {t('backToDashboard')}
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('aiSymptomChecker')}</h2>
          <p className="text-gray-600">{t('symptomsDescription')}</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Symptoms Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              {t('symptomsDescription')} *
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t('symptomsPlaceholder')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
              disabled={isAnalyzing}
            />
          </div>

          {/* Age & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('age')}</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('age')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAnalyzing}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('howLongSymptoms')}</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={t('durationPlaceholder')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAnalyzing}
              />
            </div>
          </div>

          {/* Risk Factors */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              {t('riskFactors')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {riskFactorOptions.map((factor) => (
                <motion.button
                  key={factor.id}
                  onClick={() => toggleRiskFactor(factor.id)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${riskFactors.includes(factor.id)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnalyzing}
                >
                  <span className="text-sm font-medium">{factor.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              {t('medicalDisclaimer')}
            </p>
          </div>

          {/* Analyze Button */}
          <motion.button
            onClick={analyzeSymptoms}
            disabled={!symptoms.trim() || isAnalyzing}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 ${!symptoms.trim() || isAnalyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              } shadow-lg transition-all`}
            whileHover={symptoms.trim() && !isAnalyzing ? { scale: 1.02 } : {}}
            whileTap={symptoms.trim() && !isAnalyzing ? { scale: 0.98 } : {}}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('analyzeSymptoms')}
              </>
            )}
          </motion.button>

          {/* Progress Bar */}
          {isAnalyzing && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{t('processingWithAI')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('symptomAnalyzingDetail')}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
