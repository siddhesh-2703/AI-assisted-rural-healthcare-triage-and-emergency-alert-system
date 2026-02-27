import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, FileText, ChevronRight, Calendar, Activity, AlertCircle, Download, X, Heart, Stethoscope, Plus, Microscope } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToReports } from '../services/databaseService';
import { generateMedicalReportPDF } from '../utils/pdfGenerator';
import type { User } from 'firebase/auth';

interface HistoryViewProps {
    user: User;
    onBack: () => void;
    onManageContacts: () => void;
}

export default function HistoryView({ user, onBack, onManageContacts }: HistoryViewProps) {
    const { t } = useLanguage();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToReports((data) => {
            setReports(data);
            setLoading(false);
        }, user.uid);

        return () => unsubscribe();
    }, [user.uid]);

    return (
        <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
            {/* Mesh Gradient "Makeup" Base */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/4 right-[10%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-[100px]" />
            </div>

            {/* Medical Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.05]"
                style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
            />
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: `linear-gradient(#3b82f6 0.5px, transparent 0.5px), linear-gradient(90deg, #3b82f6 0.5px, transparent 0.5px)`, backgroundSize: '120px 120px' }}
            />

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Large Vibrant Animated Blobs - Brighter */}
                <motion.div
                    className="absolute -top-40 -left-60 w-[700px] h-[700px] bg-blue-400/30 rounded-full blur-[140px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/4 -right-60 w-[800px] h-[800px] bg-emerald-400/30 rounded-full blur-[160px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -60, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-purple-400/30 rounded-full blur-[140px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 70, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.4, 1],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Animated SVG Waves for Side Areas - More Visible */}
                <svg className="absolute left-0 top-0 h-full w-64 opacity-[0.08] text-blue-600 hidden lg:block" viewBox="0 0 100 1000" preserveAspectRatio="none">
                    <motion.path
                        d="M 0 0 Q 50 250 0 500 Q 50 750 0 1000"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        animate={{
                            d: [
                                "M 0 0 Q 80 250 0 500 Q 80 750 0 1000",
                                "M 0 0 Q 20 250 0 500 Q 20 750 0 1000",
                                "M 0 0 Q 80 250 0 500 Q 80 750 0 1000"
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
                <svg className="absolute right-0 top-0 h-full w-64 opacity-[0.08] text-emerald-600 hidden lg:block" viewBox="0 0 100 1000" preserveAspectRatio="none">
                    <motion.path
                        d="M 100 0 Q 50 250 100 500 Q 50 750 100 1000"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        animate={{
                            d: [
                                "M 100 0 Q 20 250 100 500 Q 20 750 100 1000",
                                "M 100 0 Q 80 250 100 500 Q 80 750 100 1000",
                                "M 100 0 Q 20 250 100 500 Q 20 750 100 1000"
                            ]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>

                {/* Floating Medical Icons with higher brightness */}
                {[
                    { Icon: Heart, top: '15%', left: '8%', size: 45, delay: 0, color: 'text-red-300/60' },
                    { Icon: Stethoscope, top: '30%', right: '12%', size: 65, delay: 1, color: 'text-blue-300/50' },
                    { Icon: Plus, top: '70%', left: '12%', size: 35, delay: 2, color: 'text-emerald-300/60' },
                    { Icon: Microscope, bottom: '15%', right: '8%', size: 55, delay: 3, color: 'text-purple-300/50' },
                    { Icon: Activity, top: '50%', left: '4%', size: 40, delay: 1.5, color: 'text-slate-300/70' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${item.color}`}
                        style={{
                            top: item.top,
                            left: item.left,
                            right: item.right,
                            bottom: item.bottom
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                    >
                        <item.Icon size={item.size} />
                    </motion.div>
                ))}
            </div>

            {/* Header */}
            <header className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/80 text-white z-20 backdrop-blur-3xl shadow-xl shadow-slate-900/20">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <h2 className="text-xl font-bold text-white tracking-tight">{t('healthHistory')}</h2>
                <div className="w-10" />
            </header>

            <main className="p-6 max-w-2xl mx-auto relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">{t('loading')}</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-20 relative">
                        <div className="bg-slate-50/50 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/50 shadow-sm">
                            <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{t('noReportsYet')}</h3>
                        <p className="text-slate-500 mb-8">{t('noReportsDesc')}</p>
                        <Button onClick={onBack} className="bg-blue-600 text-white rounded-xl px-8 h-12 font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                            {t('startDiagnosis')}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report, idx) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedReport(report)}
                                className={`backdrop-blur-md border rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden ${report.priority === 'Critical' ? 'bg-red-50/90 border-red-100 shadow-red-500/5' :
                                    report.priority === 'High' ? 'bg-orange-50/90 border-orange-100 shadow-orange-500/5' :
                                        report.priority === 'Medium' ? 'bg-yellow-50/90 border-yellow-100 shadow-yellow-500/5' :
                                            'bg-blue-50/90 border-blue-100 shadow-blue-500/5'
                                    }`}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${report.priority === 'Critical' ? 'bg-red-500' :
                                    report.priority === 'High' ? 'bg-orange-500' :
                                        report.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />

                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                                            {report.timestamp ? `${report.timestamp.toLocaleDateString()} ${report.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : t('recent')}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-tighter ${report.priority === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        report.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                            'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}>
                                        {t(report.priority.toLowerCase())}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {report.conditions?.[0]?.name || 'Medical Analysis'}
                                    </h4>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {report.symptoms?.slice(0, 3).map((sym: string) => (
                                        <span key={sym} className="text-[10px] bg-blue-50/50 text-blue-700 px-2 py-1 rounded-full font-bold border border-blue-100">
                                            {sym}
                                        </span>
                                    ))}
                                    {(report.symptoms?.length || 0) > 3 && (
                                        <span className="text-[10px] text-slate-400 font-bold self-center">
                                            +{report.symptoms!.length - 3} {t('more')}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Activity className={`w-4 h-4 ${report.severityScore > 70 ? 'text-red-500' : 'text-blue-500'}`} />
                                        <span className="text-xs font-semibold">{t('triageSeverity')}: {report.severityScore}%</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                                        {t('details')} <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 p-8 bg-blue-50/30 backdrop-blur-sm rounded-3xl border border-blue-100/50 text-center relative overflow-hidden group">
                    <motion.div
                        className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                        <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <AlertCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-blue-900 mb-1 text-lg">{t('guardianAlertsEnabled')}</h4>
                        <p className="text-sm text-blue-700/70 mb-6">{t('guardianAlertsDesc')}</p>
                        <Button onClick={onManageContacts} variant="outline" className="rounded-xl border-blue-200 text-blue-700 font-bold bg-white h-12 px-8 shadow-sm hover:shadow-md transition-all">
                            {t('manageContacts')}
                        </Button>
                    </div>
                </div>

                {/* Detail View Modal */}
                <AnimatePresence>
                    {selectedReport && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20"
                            >
                                <div className={`p-4 border-b flex items-center justify-between ${selectedReport.priority === 'Critical' ? 'bg-red-50/80' :
                                    selectedReport.priority === 'High' ? 'bg-orange-50/80' :
                                        selectedReport.priority === 'Medium' ? 'bg-yellow-50/80' :
                                            'bg-blue-50/80'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-xl shadow-sm">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('reportDetails')}</h3>
                                    </div>
                                    <button onClick={() => setSelectedReport(null)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-bold text-sm tracking-tight">{selectedReport.timestamp ? `${selectedReport.timestamp.toLocaleDateString()} ${selectedReport.timestamp.toLocaleTimeString()}` : 'Recent'}</span>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${selectedReport.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                            selectedReport.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {t(selectedReport.priority.toLowerCase())}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{selectedReport.conditions?.[0]?.name}</h4>
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                                            "{selectedReport.summary || t('defaultSummary')}"
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                            {t('recommendedActions')}
                                        </h5>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedReport.recommendations?.slice(0, 4).map((rec: string, i: number) => (
                                                <div key={i} className="flex gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-blue-50 transition-colors">
                                                    <div className="w-5 h-5 shrink-0 rounded-lg bg-white flex items-center justify-center text-blue-600 font-black text-[10px] shadow-sm group-hover:scale-110 transition-transform">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-xs text-blue-900 font-semibold">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-[24px] border border-slate-100 shadow-sm group">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Severity</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-2xl font-black ${selectedReport.severityScore > 70 ? 'text-red-600' : 'text-slate-900'}`}>{selectedReport.severityScore}%</span>
                                                <span className="text-[10px] text-slate-400 font-bold">/100</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-[24px] border border-slate-100 shadow-sm">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{t('symptomsDescription')}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-slate-900">{selectedReport.symptoms?.length || 0}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{t('found')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border-t flex gap-3">
                                    <Button onClick={() => setSelectedReport(null)} className="flex-1 h-12 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors text-sm">
                                        {t('close')}
                                    </Button>
                                    <Button
                                        onClick={() => generateMedicalReportPDF(selectedReport)}
                                        className="flex-1 h-12 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Download className="w-5 h-5" />
                                        {t('downloadPdfShort')}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
