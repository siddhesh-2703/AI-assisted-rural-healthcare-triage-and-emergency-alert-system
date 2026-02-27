import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, X, Camera, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { analyzeImage, type ImageAnalysisResult, combineImageWithSymptomAnalysis } from '../services/imageAnalysis';
import { useLanguage } from '../context/LanguageContext';

interface ImageUploadProps {
  onBack: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function ImageUpload({ onBack, onAnalysisComplete }: ImageUploadProps) {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImageAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const performImageAnalysis = async () => {
    if (!image || !imageFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate realistic processing steps
    const steps = [
      { progress: 15, delay: 400, message: t('loadingImage') },
      { progress: 35, delay: 500, message: t('detectingImageType') },
      { progress: 55, delay: 700, message: t('analyzingVisualPatterns') },
      { progress: 75, delay: 600, message: t('identifyingAbnormalities') },
      { progress: 90, delay: 500, message: t('generatingReport') },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setAnalysisProgress(step.progress);
    }

    try {
      // Perform professional image analysis
      const imgAnalysisResult = await analyzeImage(imageFile, language);
      setImageAnalysis(imgAnalysisResult);
      setAnalysisProgress(100);

      // Convert image analysis to AnalysisResult format
      const priority = imgAnalysisResult.urgency === 'immediate' || imgAnalysisResult.urgency === 'urgent'
        ? (imgAnalysisResult.severity >= 85 ? 'Critical' : 'High')
        : (imgAnalysisResult.severity >= 50 ? 'Medium' : 'Low');

      const result: AnalysisResult = {
        symptoms: [`${imgAnalysisResult.imageType.toUpperCase()} image analyzed`, ...imgAnalysisResult.findings.slice(0, 3)],
        conditions: imgAnalysisResult.detectedAbnormalities.length > 0
          ? imgAnalysisResult.detectedAbnormalities.map(abn => ({
            name: abn.type,
            confidence: abn.severity === 'severe' ? 85 : abn.severity === 'moderate' ? 70 : 55,
          }))
          : [{ name: 'Image Analysis Complete', confidence: 75 }],
        severityScore: imgAnalysisResult.severity,
        priority: priority as 'Low' | 'Medium' | 'High' | 'Critical',
        firstAid: imgAnalysisResult.recommendations,
        medicines: imgAnalysisResult.medicines && imgAnalysisResult.medicines.length > 0
          ? imgAnalysisResult.medicines
          : extractMedicinesFromRecommendations(imgAnalysisResult.recommendations),
        ambulanceRequired: imgAnalysisResult.urgency === 'immediate' || imgAnalysisResult.severity >= 85,
        imageAnalysis: {
          hasInjury: imgAnalysisResult.imageType === 'wound' || imgAnalysisResult.imageType === 'burn' || imgAnalysisResult.imageType === 'cut',
          infectionProbability: calculateInfectionRisk(imgAnalysisResult),
          bleedingSeverity: calculateBleedingLevel(imgAnalysisResult),
        },
      };

      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(result);
      }, 500);
    } catch (error) {
      console.error('Image analysis error:', error);
      setIsAnalyzing(false);
      alert('Failed to analyze image. Please try again.');
    }
  };

  const extractMedicinesFromRecommendations = (recommendations: string[]): string[] => {
    const medicines: string[] = [];
    let inMedicineSection = false;

    for (const line of recommendations) {
      if (line.includes('💊') || line.toLowerCase().includes('medication')) {
        inMedicineSection = true;
        continue;
      }
      if (inMedicineSection && line.trim() && !line.startsWith('•') && !line.startsWith('⚠️')) {
        if (line.includes(':')) break;
        medicines.push(line.replace(/^[•\s-]+/, '').trim());
        if (medicines.length >= 5) break;
      }
    }

    return medicines.length > 0 ? medicines : ['Consult healthcare provider for medication guidance'];
  };

  const calculateInfectionRisk = (analysisResult: ImageAnalysisResult): number => {
    let riskScore = 10; // Base risk for any wound/injury

    // Check for explicit infection detection
    const hasInfection = analysisResult.detectedAbnormalities.some(a =>
      a.type.toLowerCase().includes('infection') || a.type.toLowerCase().includes('necrosis')
    );
    if (hasInfection) riskScore += 60;

    // Check findings for infection indicators
    const findingsText = analysisResult.findings.join(' ').toLowerCase();
    if (findingsText.includes('infection') || findingsText.includes('pus')) riskScore += 40;
    if (findingsText.includes('dark discoloration') || findingsText.includes('necrotic')) riskScore += 35;
    if (findingsText.includes('discharge') || findingsText.includes('oozing')) riskScore += 25;

    // Image type specific risks
    if (analysisResult.imageType === 'wound') {
      riskScore += 15; // Wounds have higher infection risk
      if (analysisResult.severity >= 70) riskScore += 20;
    }
    if (analysisResult.imageType === 'burn') {
      riskScore += 20; // Burns have high infection risk
      if (analysisResult.severity >= 75) riskScore += 15;
    }

    // Severity-based adjustment
    if (analysisResult.severity >= 80) riskScore += 15;
    else if (analysisResult.severity >= 60) riskScore += 10;

    // Cap at 95% (never 100% certain without lab tests)
    return Math.min(95, riskScore);
  };

  const calculateBleedingLevel = (analysisResult: ImageAnalysisResult): string => {
    const hasActiveBleed = analysisResult.detectedAbnormalities.some(a =>
      a.type.toLowerCase().includes('hemorrhage') || a.type.toLowerCase().includes('bleeding')
    );
    const findingsText = analysisResult.findings.join(' ').toLowerCase();

    // Check for bleeding indicators in findings
    if (hasActiveBleed || findingsText.includes('active bleeding') || findingsText.includes('bright red blood')) {
      if (analysisResult.severity >= 75) return 'Severe - Active';
      return 'Moderate - Active';
    }

    // Severity-based bleeding level
    if (analysisResult.severity >= 80) return 'Severe';
    if (analysisResult.severity >= 60) return 'Moderate';
    if (analysisResult.severity >= 40) return 'Minor';
    return 'Minimal';
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
            {t('backToDashboard')}
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('imageAnalysis')}</h2>
          <p className="text-gray-600 text-lg">{t('uploadClearPhoto')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area - Made Larger */}
          <motion.div
            className="lg:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-2xl">
              {!image ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-4 border-dashed border-pink-300 rounded-3xl p-16 text-center hover:border-pink-500 hover:bg-pink-50/50 transition-all cursor-pointer min-h-[500px] flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <motion.div
                    className="inline-flex p-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="w-20 h-20 text-pink-600" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    {t('uploadMedicalImage')}
                  </h3>
                  <p className="text-xl text-gray-600 mb-6 max-w-md">
                    {t('uploadClearPhoto')}
                  </p>
                  <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg mb-4">
                    <Upload className="w-6 h-6" />
                    <span className="text-lg">{t('clickToBrowse')}</span>
                  </div>
                  <p className="text-sm text-gray-500">{t('dragAndDrop')}</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG up to 10MB</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Image Preview with Detection Boxes */}
                  <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl min-h-[500px]">
                    <img
                      src={image}
                      alt="Uploaded medical image"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />

                    {/* Image Analysis Results Overlay */}
                    {imageAnalysis && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                          {imageAnalysis.urgency === 'immediate' || imageAnalysis.urgency === 'urgent' ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                          <span className="font-semibold">
                            {imageAnalysis.imageType.toUpperCase()} detected
                          </span>
                          <span className="ml-auto">
                            Severity: {imageAnalysis.severity}/100
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Scanning Effect */}
                    {isAnalyzing && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                      setImageAnalysis(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Analyze Button */}
              {image && (
                <motion.button
                  onClick={performImageAnalysis}
                  disabled={isAnalyzing}
                  className={`w-full mt-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 ${isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700'
                    } shadow-lg`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                  whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('analyzingImage')}
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      {t('medicalImageAnalysis')}
                    </>
                  )}
                </motion.button>
              )}

              {/* Progress */}
              {isAnalyzing && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{t('analyzing')}</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* AI Capabilities */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('imageAnalysis')}
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '🔍', title: t('woundDetection'), desc: t('woundDetectionDesc') },
                  { icon: '🧪', title: t('infectionAnalysis'), desc: t('infectionAnalysisDesc') },
                  { icon: '📏', title: t('severityAssessment'), desc: t('severityAssessmentDesc') },
                  { icon: '🩸', title: t('bleedingDetection'), desc: t('bleedingDetectionDesc') },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t('photoGuidelines')}</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• {t('guideline1')}</li>
                    <li>• {t('guideline2')}</li>
                    <li>• {t('guideline3')}</li>
                    <li>• {t('guideline4')}</li>
                    <li>• {t('guideline5')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{t('privacyProtected')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('privacyNotice')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}