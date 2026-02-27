import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Globe, ArrowRight, Ambulance, History, Cross, HeartPulse, Microscope, Thermometer } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage, LanguageType } from '../context/LanguageContext';

interface AuthPageProps {
    onGuestAccess: () => void;
    onLogin: () => void;
}

export default function AuthPage({ onGuestAccess, onLogin }: AuthPageProps) {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="h-screen h-[100dvh] flex flex-col bg-white overflow-hidden relative">
            {/* Premium Bright Background Graphics */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Vibrant Mesh Gradient "Makeup" */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/20 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/4 right-[5%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />

                {/* High-Intensity Animated Medical Blobs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px]"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0], x: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[140px]"
                    animate={{ scale: [1.3, 1, 1.3], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px]"
                    animate={{ x: [0, 60, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />

                {/* Floating Medical Icons - Brighter & More Distinct */}
                <motion.div
                    className="absolute top-[18%] left-[12%] opacity-60"
                    animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <Microscope className="w-14 h-14 text-blue-500" />
                </motion.div>
                <motion.div
                    className="absolute bottom-[25%] left-[18%] opacity-60"
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity }}
                >
                    <Cross className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <motion.div
                    className="absolute top-[30%] right-[12%] opacity-50"
                    animate={{ y: [0, -40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                >
                    <HeartPulse className="w-16 h-16 text-blue-400" />
                </motion.div>
                <motion.div
                    className="absolute bottom-[15%] right-[22%] opacity-50"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    <Activity className="w-20 h-20 text-emerald-400" />
                </motion.div>
            </div>

            {/* Brighter Medical Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.06]"
                style={{ backgroundImage: `radial-gradient(#3b82f6 2px, transparent 2px)`, backgroundSize: '50px 50px' }}
            />

            {/* Top Header with Language Toggle */}
            <header className="p-6 flex justify-between items-center relative z-10">
                <motion.div
                    className="flex items-center gap-2.5"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <Shield className="w-7 h-7 text-blue-600 relative z-10" />
                    </div>
                    <span className="text-sm font-black text-blue-900 tracking-[0.2em] uppercase">{t('appName')}</span>
                </motion.div>

                <motion.div
                    className="bg-white/60 backdrop-blur-xl p-1.5 rounded-full flex items-center gap-1 border border-white/40 shadow-xl shadow-slate-200/50"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    {(['en', 'hi', 'ta'] as LanguageType[]).map((lang) => (
                        <Button
                            key={lang}
                            variant="ghost"
                            size="sm"
                            onClick={() => setLanguage(lang)}
                            className={`h-9 rounded-full px-4 text-xs font-black transition-all ${language === lang
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-blue-600"
                                }`}
                        >
                            {lang.toUpperCase()}
                        </Button>
                    ))}
                    <Globe className="w-4 h-4 mx-2 text-slate-300" />
                </motion.div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-2 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4 sm:mb-8"
                >
                    <div className="relative inline-block">
                        <motion.div
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.4, 0.8, 0.4]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-[-20px] bg-blue-400/40 rounded-full blur-[40px]"
                        />
                        <div className="relative bg-white p-5 rounded-[28px] shadow-2xl border-4 border-white">
                            <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3 max-w-sm mb-6 sm:mb-10"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                        {language === 'en' ? (
                            <>AI Rural <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                                    Healthcare
                                </span></>
                        ) : (
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                                {t('appSubtitle')}
                            </span>
                        )}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-500 font-bold px-4 leading-relaxed">
                        {t('appDescription')}
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="w-full max-w-sm grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Guest Access Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative group"
                    >
                        {/* Glow Behind */}
                        <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />

                        <Button
                            onClick={onGuestAccess}
                            className="h-24 sm:h-28 w-full bg-white/40 backdrop-blur-3xl hover:bg-white/60 text-emerald-900 rounded-[28px] sm:rounded-[32px] shadow-2xl border-2 border-emerald-100/50 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl -mr-8 -mt-8" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2 sm:p-3 bg-emerald-100/50 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                                    <Ambulance className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xl sm:text-2xl font-black tracking-tight">{t('guestMode')}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {t('fastEmergencyEntry')}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </motion.div>

                    {/* Login Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative group"
                    >
                        {/* Glow Behind */}
                        <div className="absolute inset-0 bg-blue-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />

                        <Button
                            onClick={onLogin}
                            className="h-24 sm:h-28 w-full bg-slate-900/90 text-white rounded-[28px] sm:rounded-[32px] shadow-2xl border-2 border-slate-800 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 blur-2xl -mr-8 -mt-8" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                                    <History className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xl sm:text-2xl font-black tracking-tight text-white">{t('saveHistory')}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest">
                                        {t('guardianProtection')}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-5 sm:p-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="inline-flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/40 shadow-sm"
                >
                    <Shield className="w-3 h-3 text-slate-400" />
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold">
                        {t('secureEncryption')}
                    </p>
                </motion.div>
            </footer>
        </div>
    );
}
