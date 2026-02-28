import { motion } from 'motion/react';
import { Activity, AlertTriangle, BarChart3, Bell, Camera, Cross, FileText, Heart, HeartPulse, History, LogOut, Mic } from 'lucide-react';
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

type ModeCard = {
  id: 'symptom' | 'voice' | 'image' | 'emergency' | 'history' | 'alerts';
  icon: typeof FileText;
  title: string;
  description: string;
  buttonClass: string;
  iconClass: string;
};

export default function Dashboard({
  user,
  onSelectMode,
  onViewAdmin,
  onViewHistory,
  onViewContacts,
  onLogout,
}: DashboardProps) {
  const { t } = useLanguage();

  const modes: ModeCard[] = [
    {
      id: 'symptom',
      icon: FileText,
      title: t('aiSymptomChecker'),
      description: t('symptomsDescription'),
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
      iconClass: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'voice',
      icon: Mic,
      title: t('voiceConsultation'),
      description: t('speakSymptoms'),
      buttonClass: 'bg-purple-600 hover:bg-purple-700',
      iconClass: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'image',
      icon: Camera,
      title: t('imageAnalysis'),
      description: t('uploadClearPhoto'),
      buttonClass: 'bg-pink-600 hover:bg-pink-700',
      iconClass: 'bg-pink-50 text-pink-600',
    },
    {
      id: 'emergency',
      icon: AlertTriangle,
      title: t('emergency'),
      description: t('fastTrackCritical'),
      buttonClass: 'bg-red-600 hover:bg-red-700',
      iconClass: 'bg-red-50 text-red-600',
    },
  ];

  if (user) {
    modes.push({
      id: 'history',
      icon: History,
      title: t('medicalHistory'),
      description: t('pastReportsDesc'),
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
      iconClass: 'bg-emerald-50 text-emerald-600',
    });
    modes.push({
      id: 'alerts',
      icon: Bell,
      title: t('guardianContacts'),
      description: t('manageContactsDesc'),
      buttonClass: 'bg-orange-600 hover:bg-orange-700',
      iconClass: 'bg-orange-50 text-orange-600',
    });
  }

  return (
    <div className="min-h-screen px-6 py-8 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-4 left-4 h-80 w-80 rounded-full bg-blue-400/28 blur-[110px]"
          animate={{ scale: [1, 1.18, 1], x: [0, 24, 0], y: [0, 12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-8 right-8 h-96 w-96 rounded-full bg-pink-400/22 blur-[120px]"
          animate={{ scale: [1, 1.16, 1], y: [0, -18, 0], x: [0, -12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[20%] right-[16%] opacity-25"
          animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6.5, repeat: Infinity }}
        >
          <HeartPulse className="h-10 w-10 text-blue-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-[24%] left-[12%] opacity-25"
          animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7.5, repeat: Infinity }}
        >
          <Cross className="h-9 w-9 text-emerald-600" />
        </motion.div>
        <motion.div
          className="absolute top-[55%] right-[36%] opacity-20"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Activity className="h-12 w-12 text-fuchsia-500" />
        </motion.div>
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <motion.header
          className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-xl"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="rounded-xl bg-red-50 p-2.5 text-red-600"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="h-5 w-5 fill-red-600" />
            </motion.div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{t('appName')}</h1>
              <p className="text-sm text-slate-600">
                {user ? `${t('welcome')}, ${user.email?.split('@')[0]}` : t('selectDiagnosisMethod')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewAdmin}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <BarChart3 className="h-4 w-4" />
              {t('adminPanel')}
            </button>
            {user && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            )}
          </div>
        </motion.header>

        <motion.section
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {modes.map((mode, index) => (
            <motion.article
              key={mode.id}
              className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.06 * index }}
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <motion.div
                className={`mb-4 inline-flex rounded-xl p-2.5 ${mode.iconClass}`}
                whileHover={{ rotate: -8, scale: 1.08 }}
              >
                <mode.icon className="h-5 w-5" />
              </motion.div>
              <h2 className="text-lg font-semibold text-slate-900">{mode.title}</h2>
              <p className="mt-2 min-h-11 text-sm text-slate-600">{mode.description}</p>
              <button
                onClick={() => {
                  if (mode.id === 'history') onViewHistory();
                  else if (mode.id === 'alerts') onViewContacts();
                  else onSelectMode(mode.id);
                }}
                className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${mode.buttonClass}`}
              >
                {t('start')}
              </button>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{t('medicalDisclaimer')}</h3>
              <p className="mt-1 text-sm text-slate-600">{t('medicalDisclaimer')}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
