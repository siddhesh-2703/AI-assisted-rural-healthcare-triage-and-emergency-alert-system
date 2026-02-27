import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowLeft, Mail, Lock, Loader2, UserPlus, LogIn, User, Microscope, Cross, HeartPulse, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { auth } from '../services/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';

interface LoginScreenProps {
    onBack: () => void;
    onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSignUp, setIsSignUp] = React.useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            let userCredential;
            if (isSignUp) {
                if (!displayName) {
                    setError("Please enter your full name.");
                    setLoading(false);
                    return;
                }
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName });
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }
            onLoginSuccess(userCredential.user);
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password. Please try again.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Try logging in.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen h-[100dvh] flex flex-col bg-white overflow-hidden relative">
            {/* Premium Radiant Background Graphics */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Vibrant Mesh Gradient "Makeup" */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/20 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-400/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Constant Animated Medical Blobs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px]"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[140px]"
                    animate={{ scale: [1.3, 1, 1.3], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Constant Floating Medical Icons */}
                <motion.div className="absolute top-[18%] left-[12%] opacity-40"><Microscope className="w-12 h-12 text-blue-500" /></motion.div>
                <motion.div className="absolute bottom-[25%] left-[18%] opacity-40"><Cross className="w-8 h-8 text-emerald-500" /></motion.div>
                <motion.div className="absolute top-[30%] right-[12%] opacity-40"><HeartPulse className="w-14 h-14 text-blue-400" /></motion.div>
                <motion.div className="absolute bottom-[15%] right-[22%] opacity-40"><Activity className="w-16 h-16 text-emerald-400" /></motion.div>
            </div>

            {/* Radiant Medical Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.06]"
                style={{ backgroundImage: `radial-gradient(#3b82f6 2px, transparent 2px)`, backgroundSize: '50px 50px' }}
            />

            <header className="p-4 sm:p-6 flex items-center justify-between relative z-10">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </Button>
                <motion.div
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <Shield className="w-6 h-6 text-blue-600 relative z-10" />
                    </div>
                    <span className="text-xs font-black text-blue-900 tracking-[0.2em] uppercase">Smart Shield</span>
                </motion.div>
                <div className="w-10" />
            </header>

            <main className="flex-1 w-full overflow-hidden relative z-10 flex flex-col justify-center">
                <div className="max-w-sm mx-auto w-full px-6 flex flex-col items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-4">
                        <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            {isSignUp ? 'Join SwasthyaAI Portal' : 'Access clinical dashboard'}
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 w-full p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border-2 border-red-100 shadow-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            {error}
                        </motion.div>
                    )}

                    <div className="w-full bg-white/40 backdrop-blur-3xl p-5 rounded-[32px] shadow-2xl border-2 border-white/60 relative group">
                        {/* Interior Glow - Click-safe */}
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none" />

                        <Tabs value={isSignUp ? "signup" : "login"} onValueChange={(v) => setIsSignUp(v === "signup")} className="w-full relative z-10">
                            <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100/50 p-1 rounded-2xl mb-4 border border-slate-200/50 backdrop-blur-md">
                                <TabsTrigger value="login" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg transition-all">
                                    <LogIn className="w-3.5 h-3.5 mr-1.5" /> Login
                                </TabsTrigger>
                                <TabsTrigger value="signup" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg transition-all">
                                    <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Sign Up
                                </TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleAuth} className="space-y-3">
                                <AnimatePresence mode="wait">
                                    {isSignUp && (
                                        <motion.div
                                            key="signup-fields"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative">
                                                    <Input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your name" className="h-12 px-4 text-sm font-bold rounded-2xl border-slate-200 focus:border-blue-500 transition-all bg-white/80 shadow-inner" />
                                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-12 px-4 text-sm font-bold rounded-2xl border-slate-200 focus:border-blue-500 transition-all bg-white/80 shadow-inner" />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 px-4 text-sm font-bold rounded-2xl border-slate-200 focus:border-blue-500 transition-all bg-white/80 shadow-inner" />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    </div>
                                </div>

                                {isSignUp && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="h-12 px-4 text-sm font-bold rounded-2xl border-slate-200 focus:border-blue-500 transition-all bg-white/80 shadow-inner" />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" disabled={loading} className="w-full h-12 py-6 text-base font-black bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200/50 border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
                                        <>
                                            {isSignUp ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
                                            {isSignUp ? 'Create Secure Account' : 'Verify & Enter Portal'}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Tabs>
                    </div>
                </div>
            </main>

            <footer className="p-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-white/50 px-5 py-2.5 rounded-full border border-white/40 shadow-xl backdrop-blur-xl"
                >
                    <Shield className="w-4 h-4 text-blue-500" />
                    <p className="text-[10px] sm:text-xs text-slate-600 font-black uppercase tracking-widest">
                        High-Level Patient Data Encryption Active
                    </p>
                </motion.div>
            </footer>
        </div>
    );
}
