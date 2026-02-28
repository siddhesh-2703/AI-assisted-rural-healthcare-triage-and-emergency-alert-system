import { motion } from 'motion/react';
import { FileText, Mic, Camera, AlertTriangle, BarChart3, ArrowLeft, Heart, LogOut, History, Bell } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  user: User | null;
  onSelectMode: (mode: 'symptom' | 'voice' | 'image' | 'emergency') => void;
  onViewAdmin: () => void;
  onViewHistory: () => void;
  onViewContacts: () => void;
  onLogout: () => void;
}
export default function Dashboard({
  user,
  onSelectMode,
  onViewAdmin,
  onViewHistory,
  onViewContacts,
  onLogout
}: DashboardProps) {
  const { t, language, setLanguage } = useLanguage();

  const modes: any[] = [
    {
      id: 'symptom',
      icon: FileText,
      title: t('aiSymptomChecker'),
      description: t('symptomsDescription'),
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 'voice' as const,
      icon: Mic,
      title: t('voiceConsultation'),
      description: t('speakSymptoms'),
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      id: 'image' as const,
      icon: Camera,
      title: t('imageAnalysis'),
      description: t('uploadClearPhoto'),
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'from-pink-600 to-pink-700',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
    {
      id: 'emergency' as const,
      icon: AlertTriangle,
      title: t('emergency'),
      description: t('fastTrackCritical'),
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  if (user) {
    modes.push({
      id: 'history' as any,
      icon: History,
      title: t('medicalHistory'),
      description: t('pastReportsDesc'),
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    });
    modes.push({
      id: 'alerts' as any,
      icon: Bell,
      title: t('guardianContacts'),
      description: t('manageContactsDesc'),
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    });
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-white rounded-full shadow-lg"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{t('appName')}</h1>
              <p className="text-gray-600 font-medium">
                {user ? `${t('welcome')}, ${user.email?.split('@')[0]}` : t('selectDiagnosisMethod')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={onViewAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium md:inline hidden">{t('adminPanel')}</span>
            </motion.button>

            {user && (
              <motion.button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100 shadow-sm hover:bg-red-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-bold md:inline hidden">{t('logout')}</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (mode.id === 'history') onViewHistory();
                else if (mode.id === 'alerts') onViewContacts();
                else onSelectMode(mode.id);
              }}
              className="cursor-pointer group relative"
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${mode.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}
              />

              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl ${mode.bgColor} mb-6`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <mode.icon className={`w-8 h-8 ${mode.textColor}`} />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {mode.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {mode.description}
                </p>

                {/* Action Button */}
                <motion.div
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${mode.color} text-white rounded-full font-medium shadow-lg`}
                  whileHover={{ x: 5 }}
                >
                  {t('start')}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </motion.div>

                {/* Pulse Animation for Emergency */}
                {mode.id === 'emergency' && (
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { emoji: '⚡', text: t('resultsInSeconds') },
            { emoji: '🌐', text: t('worksLowBandwidth') },
            { emoji: '🔒', text: t('dataPrivacy') },
          ].map((info, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl">{info.emoji}</div>
              <p className="text-gray-700 font-medium">{info.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          className="mt-12 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">{t('medicalDisclaimer')}</h4>
                <p className="text-sm text-gray-600">
                  {t('medicalDisclaimer')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
