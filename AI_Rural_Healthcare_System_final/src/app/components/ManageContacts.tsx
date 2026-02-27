import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Phone, Mail, Save, Plus, Trash2, Loader2, ShieldCheck, Heart, Bell, Shield, LifeBuoy, PhoneCall, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';
import { Input } from './ui/input';
import { saveGuardianAlerts, getGuardianAlerts } from '../services/databaseService';
import type { User as FirebaseUser } from 'firebase/auth';

interface Contact {
    name: string;
    phone: string;
    email: string;
}

interface ManageContactsProps {
    user: FirebaseUser;
    onBack: () => void;
}

export default function ManageContacts({ user, onBack }: ManageContactsProps) {
    const { t } = useLanguage();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            const data = await getGuardianAlerts(user.uid);
            setContacts(data.length > 0 ? data : [{ name: '', phone: '', email: '' }]);
            setLoading(false);
        };
        fetchContacts();
    }, [user]);

    const handleAddContact = () => {
        setContacts([...contacts, { name: '', phone: '', email: '' }]);
    };

    const handleRemoveContact = (index: number) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        setContacts(newContacts.length > 0 ? newContacts : [{ name: '', phone: '', email: '' }]);
    };

    const handleUpdateContact = (index: number, field: keyof Contact, value: string) => {
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    const handleSave = async () => {
        setSaving(true);
        const filteredContacts = contacts.filter(c => c.name || c.phone || c.email);
        const success = await saveGuardianAlerts(user.uid, filteredContacts);
        setSaving(false);
        if (success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <div className="h-screen bg-[#fafbfc] relative overflow-hidden flex flex-col">
            {/* Medical Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
            />
            <div className="absolute inset-0 z-0 opacity-[0.02]"
                style={{ backgroundImage: `linear-gradient(#3b82f6 0.5px, transparent 0.5px), linear-gradient(90deg, #3b82f6 0.5px, transparent 0.5px)`, backgroundSize: '120px 120px' }}
            />

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Large Vibrant Animated Blobs - Guardian Palette */}
                <motion.div
                    className="absolute -top-40 -left-60 w-[700px] h-[700px] bg-indigo-400/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/4 -right-60 w-[800px] h-[800px] bg-cyan-400/20 rounded-full blur-[140px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -60, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 70, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 left-[-10%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.4, 1],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Animated SVG Waves for Side Areas */}
                <svg className="absolute left-0 top-0 h-full w-64 opacity-[0.1] text-indigo-600 hidden lg:block" viewBox="0 0 100 1000" preserveAspectRatio="none">
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
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
                <svg className="absolute right-0 top-0 h-full w-64 opacity-[0.1] text-blue-600 hidden lg:block" viewBox="0 0 100 1000" preserveAspectRatio="none">
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
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>

                {/* Floating Safety Icons */}
                {[
                    { Icon: Shield, top: '15%', left: '8%', size: 45, delay: 0, color: 'text-indigo-400/60' },
                    { Icon: PhoneCall, top: '30%', right: '12%', size: 65, delay: 1, color: 'text-blue-400/50' },
                    { Icon: LifeBuoy, top: '45%', left: '15%', size: 55, delay: 2, color: 'text-cyan-400/50' },
                    { Icon: Bell, bottom: '25%', right: '18%', size: 40, delay: 3, color: 'text-amber-400/60' },
                    { Icon: UserCheck, bottom: '15%', left: '10%', size: 50, delay: 4, color: 'text-slate-400/50' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${item.color}`}
                        style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 15, -15, 0],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{ duration: 6 + i, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
                    >
                        <item.Icon size={item.size} />
                    </motion.div>
                ))}
            </div>

            <header className="p-3 border-b border-indigo-500 flex items-center justify-between sticky top-0 bg-indigo-700 text-white z-20 transition-all shrink-0 shadow-lg shadow-indigo-500/20">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/20 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
                <h2 className="text-lg font-bold tracking-tight">{t('guardianProtection')}</h2>
                <div className="w-10" />
            </header>


            <main className="p-4 max-w-xl mx-auto flex-1 overflow-y-auto w-full pb-24 relative z-10 scrollbar-hide">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 bg-blue-600 text-white rounded-[28px] shadow-lg shadow-blue-500/20 overflow-hidden relative border border-blue-500"
                >
                    <div className="absolute top-[-20%] right-[-10%] opacity-[0.1]">
                        <ShieldCheck size={160} className="text-white" />
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-extrabold text-white text-lg tracking-tight">{t('criticalAlerts')}</h3>
                    </div>
                    <p className="text-blue-50 text-sm font-medium leading-relaxed">{t('criticalAlertsDesc')}</p>
                </motion.div>



                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-bold">{t('loading')}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 ${index === 0 ? 'bg-blue-100/90 border-blue-400/40 shadow-blue-500/10' : index === 1 ? 'bg-indigo-100/90 border-indigo-400/40 shadow-indigo-500/10' : 'bg-cyan-100/90 border-cyan-400/40 shadow-cyan-500/10'} backdrop-blur-md rounded-[32px] border shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveContact(index); }}
                                    className="absolute top-5 right-5 p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20 shadow-sm border border-slate-100 flex items-center justify-center group/del"
                                    title={t('removeGuardian')}
                                >
                                    <Trash2 className="w-5 h-5 transition-transform group-hover/del:scale-110" />
                                </button>

                                <div className="space-y-6 relative z-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('guardianContact')}</label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                value={contact.name}
                                                onChange={(e) => handleUpdateContact(index, 'name', e.target.value)}
                                                placeholder={t('fullName')}
                                                className="h-12 pl-12 rounded-2xl border-none bg-white/60 focus:bg-white transition-all text-slate-900 font-bold text-base"
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] ml-1">{t('phoneNumber')}</label>
                                            <div className="relative">
                                                <Input
                                                    value={contact.phone}
                                                    onChange={(e) => handleUpdateContact(index, 'phone', e.target.value)}
                                                    placeholder={t('phoneNumber')}
                                                    className="h-12 pl-12 rounded-2xl border-none bg-white/60 focus:bg-white transition-all text-slate-900 font-bold"
                                                />
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.15em] ml-1">{t('email')}</label>
                                            <div className="relative">
                                                <Input
                                                    value={contact.email}
                                                    onChange={(e) => handleUpdateContact(index, 'email', e.target.value)}
                                                    placeholder={t('email')}
                                                    className="h-12 pl-12 rounded-2xl border-none bg-white/60 focus:bg-white transition-all text-slate-900 font-bold"
                                                />
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}


                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#1d4ed8' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddContact}
                            className="w-full h-14 bg-blue-600 text-white rounded-[28px] flex items-center justify-center gap-3 transition-all font-black text-lg shadow-xl shadow-blue-500/30 border-none"
                        >
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            {t('addNewGuardian')}
                        </motion.button>


                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-6 z-20">
                <main className="max-w-xl mx-auto">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-14 bg-blue-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    >
                        {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : (showSuccess ? <ShieldCheck className="w-6 h-6" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />)}
                        {showSuccess ? t('dataSecured') : t('finalizeProtection')}
                    </Button>
                </main>
            </div>

        </div>
    );
}
