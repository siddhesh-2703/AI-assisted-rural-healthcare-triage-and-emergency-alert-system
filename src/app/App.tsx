import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import LoginScreen from './components/LoginScreen';
import HistoryView from './components/HistoryView';
import ManageContacts from './components/ManageContacts';
import Dashboard from './components/Dashboard';
import SymptomInput from './components/SymptomInput';
import VoiceInput from './components/VoiceInput';
import ImageUpload from './components/ImageUpload';
import EmergencyMode from './components/EmergencyMode';
import AdminPanel from './components/AdminPanel';
import ResultsDisplay from './components/ResultsDisplay';
import CriticalAlert from './components/CriticalAlert';
import HealthChatbot from './components/HealthChatbot';
import DevSimulator from './components/DevSimulator';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';

import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';

export type AnalysisResult = {
  symptoms: string[];
  conditions: Array<{
    name: string;
    confidence: number;
    description?: string;
    complications?: string[];
  }>;
  severityScore: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  firstAid: string[];
  medicines?: string[];
  ambulanceRequired: boolean;
  riskFactors?: string[];
  facilityRecommendation?: string;
  clinicalNotes?: string;
  followUpInstructions?: string[];
  warningSignsToWatch?: string[];
  imageAnalysis?: {
    hasInjury: boolean;
    infectionProbability: number;
    bleedingSeverity: string;
  };
  timestamp?: string;
  patientInfo?: {
    age?: number;
    gender?: string;
  };
};

type AppView = 'auth' | 'login' | 'landing' | 'dashboard' | 'symptom' | 'voice' | 'image' | 'emergency' | 'admin' | 'results' | 'history' | 'contacts';

const viewToPath: Record<AppView, string> = {
  landing: '/',
  auth: '/auth',
  login: '/login',
  dashboard: '/dashboard',
  symptom: '/symptom',
  voice: '/voice',
  image: '/image',
  emergency: '/emergency',
  admin: '/admin',
  results: '/results',
  history: '/history',
  contacts: '/contacts',
};

const pathToView = Object.entries(viewToPath).reduce<Record<string, AppView>>((acc, [view, path]) => {
  acc[path] = view as AppView;
  return acc;
}, {});

function getViewFromPath(pathname: string): AppView {
  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  return pathToView[normalized] ?? 'landing';
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromPath(window.location.pathname));
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const navigateTo = (view: AppView, options?: { replace?: boolean }) => {
    const nextPath = viewToPath[view];
    setCurrentView(view);

    if (window.location.pathname !== nextPath) {
      if (options?.replace) {
        window.history.replaceState({ view }, '', nextPath);
      } else {
        window.history.pushState({ view }, '', nextPath);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    // Request location permission on app start
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location permission granted:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('📍 Location permission denied or error:', error.message);
        }
      );
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (window.location.pathname !== viewToPath[currentView]) {
      window.history.replaceState({ view: currentView }, '', viewToPath[currentView]);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!user && (currentView === 'history' || currentView === 'contacts')) {
      navigateTo('auth', { replace: true });
    }
  }, [authReady, user, currentView]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    if (result.priority === 'Critical') {
      setShowCriticalAlert(true);
    } else {
      navigateTo('results');
    }
  };

  const handleCloseCriticalAlert = () => {
    setShowCriticalAlert(false);
    navigateTo('results');
  };

  const resetApp = () => {
    navigateTo('dashboard');
    setAnalysisResult(null);
    setShowCriticalAlert(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigateTo('auth', { replace: true });
  };

  return (
    <LanguageProvider>
      <div className="relative size-full min-h-screen overflow-x-hidden bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-20 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-pink-200/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[length:22px_22px]" />
        </div>
        <div className="relative z-10">
        {showCriticalAlert && analysisResult && (
          <CriticalAlert result={analysisResult} onClose={handleCloseCriticalAlert} />
        )}

        {!showCriticalAlert && (
          <>
            {currentView === 'landing' && (
              <LandingPage onGetStarted={() => navigateTo('auth')} />
            )}

            {currentView === 'auth' && (
              <AuthPage
                onGuestAccess={() => navigateTo('dashboard')}
                onLogin={() => navigateTo('login')}
              />
            )}

            {currentView === 'login' && (
              <LoginScreen
                onBack={() => navigateTo('auth')}
                onLoginSuccess={() => navigateTo('dashboard')}
              />
            )}

            {currentView === 'dashboard' && (
              <Dashboard
                user={user}
                onSelectMode={(mode) => navigateTo(mode)}
                onViewAdmin={() => navigateTo('admin')}
                onViewHistory={() => navigateTo('history')}
                onViewContacts={() => navigateTo('contacts')}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'symptom' && (
              <SymptomInput
                onBack={resetApp}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {currentView === 'voice' && (
              <VoiceInput
                onBack={resetApp}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {currentView === 'image' && (
              <ImageUpload
                onBack={resetApp}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {currentView === 'emergency' && (
              <EmergencyMode
                onBack={resetApp}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {currentView === 'history' && user && (
              <HistoryView
                user={user}
                onBack={() => navigateTo('dashboard')}
                onManageContacts={() => navigateTo('contacts')}
              />
            )}

            {currentView === 'contacts' && user && (
              <ManageContacts
                user={user}
                onBack={() => navigateTo('history')}
              />
            )}

            {currentView === 'results' && analysisResult && (
              <ResultsDisplay
                result={analysisResult}
                userId={user?.uid}
                onBack={resetApp}
              />
            )}

            {currentView === 'admin' && (
              <AdminPanel onBack={() => navigateTo('dashboard')} />
            )}

            {/* Global Health Chatbot - Available on all pages except landing */}
            {currentView !== 'landing' && <HealthChatbot />}

            {/* Simulation Utility for Testing - Shows on input pages */}
            {(currentView === 'symptom' || currentView === 'voice' || currentView === 'image') && (
              <DevSimulator />
            )}
          </>
        )}
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </LanguageProvider>
  );
}
