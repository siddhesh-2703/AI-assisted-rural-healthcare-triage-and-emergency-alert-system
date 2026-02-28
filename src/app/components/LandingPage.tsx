import { motion } from 'motion/react';
import { Activity, ArrowRight, Cross, Heart, HeartPulse, MapPin, Microscope, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage, type LanguageType } from '../context/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [liveStats, setLiveStats] = useState({
    lives: 12847,
    cases: 45892,
    users: 8234,
  });

  const stats = [
    { label: t('landingLivesSupported'), key: 'lives', icon: Heart, className: 'text-red-600 bg-red-50' },
    { label: t('landingCasesTriaged'), key: 'cases', icon: Activity, className: 'text-blue-600 bg-blue-50' },
    { label: t('landingActiveUsers'), key: 'users', icon: Users, className: 'text-emerald-600 bg-emerald-50' },
  ] as const;

  const features = [
    { title: t('landingFeatureVoiceTitle'), description: t('landingFeatureVoiceDesc'), icon: Stethoscope },
    { title: t('landingFeaturePhotoTitle'), description: t('landingFeaturePhotoDesc'), icon: Activity },
    { title: t('landingFeatureEmergencyTitle'), description: t('landingFeatureEmergencyDesc'), icon: ShieldCheck },
  ] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        lives: prev.lives + Math.floor(Math.random() * 3),
        cases: prev.cases + Math.floor(Math.random() * 5),
        users: prev.users + Math.floor(Math.random() * 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-8 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 left-8 h-[22rem] w-[22rem] rounded-full bg-blue-400/30 blur-[110px]"
          animate={{ scale: [1, 1.2, 1], y: [0, 20, 0], x: [0, 14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-4 right-10 h-[24rem] w-[24rem] rounded-full bg-emerald-400/24 blur-[120px]"
          animate={{ scale: [1, 1.24, 1], x: [0, -20, 0], y: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-[100px]"
          animate={{ scale: [1, 1.18, 1], rotate: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[18%] left-[10%] opacity-30"
          animate={{ y: [0, -18, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Microscope className="h-10 w-10 text-blue-500" />
        </motion.div>
        <motion.div
          className="absolute top-[26%] right-[12%] opacity-25"
          animate={{ y: [0, -16, 0], scale: [1, 1.14, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <HeartPulse className="h-12 w-12 text-emerald-500" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[18%] opacity-25"
          animate={{ y: [0, 14, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Cross className="h-9 w-9 text-violet-500" />
        </motion.div>
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <motion.header
          className="mb-10 flex items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-xl"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="rounded-xl bg-red-50 p-2.5 text-red-600"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="h-5 w-5 fill-red-600" />
            </motion.div>
            <div>
              <h1 className="text-base font-semibold text-slate-900 md:text-lg">{t('landingBrand')}</h1>
              <p className="text-xs text-slate-600">{t('landingSubBrand')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1">
              {(['en', 'hi', 'ta'] as LanguageType[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    language === lang ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t('landingEnterPlatform')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <MapPin className="h-3.5 w-3.5" />
              {t('landingServingCommunities')}
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              {t('landingHeroTitle')}
            </h2>
            <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
              {t('landingHeroDesc')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                {t('landingStartTriage')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                {t('landingLowBandwidth')}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl md:p-6"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-4 text-sm font-semibold text-slate-500">{t('landingLiveSnapshot')}</p>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((item) => (
                <motion.div
                  key={item.key}
                  className="rounded-2xl border border-slate-100 bg-white p-4"
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className={`mb-3 inline-flex rounded-xl p-2 ${item.className}`}
                    whileHover={{ scale: 1.08, rotate: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {liveStats[item.key].toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.section
          className="mt-12 grid gap-4 md:grid-cols-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.35 }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl"
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <motion.div
                className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-slate-700"
                whileHover={{ rotate: -6, scale: 1.06 }}
              >
                <feature.icon className="h-5 w-5" />
              </motion.div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </motion.article>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
