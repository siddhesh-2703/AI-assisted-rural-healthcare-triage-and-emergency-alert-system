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

export default function App() {
  const [currentView, setCurrentView] = useState<'auth' | 'login' | 'landing' | 'dashboard' | 'symptom' | 'voice' | 'image' | 'emergency' | 'admin' | 'results' | 'history' | 'contacts'>('landing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
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

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    if (result.priority === 'Critical') {
      setShowCriticalAlert(true);
    } else {
      setCurrentView('results');
    }
  };

  const handleCloseCriticalAlert = () => {
    setShowCriticalAlert(false);
    setCurrentView('results');
  };

  const resetApp = () => {
    setCurrentView('dashboard');
    setAnalysisResult(null);
    setShowCriticalAlert(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setCurrentView('auth');
  };

  return (
    <LanguageProvider>
      <div className="size-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {showCriticalAlert && analysisResult && (
          <CriticalAlert result={analysisResult} onClose={handleCloseCriticalAlert} />
        )}

        {!showCriticalAlert && (
          <>
            {currentView === 'landing' && (
              <LandingPage onGetStarted={() => setCurrentView('auth')} />
            )}

            {currentView === 'auth' && (
              <AuthPage
                onGuestAccess={() => setCurrentView('dashboard')}
                onLogin={() => setCurrentView('login')}
              />
            )}

            {currentView === 'login' && (
              <LoginScreen
                onBack={() => setCurrentView('auth')}
                onLoginSuccess={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'dashboard' && (
              <Dashboard
                user={user}
                onSelectMode={(mode) => setCurrentView(mode)}
                onViewAdmin={() => setCurrentView('admin')}
                onViewHistory={() => setCurrentView('history')}
                onViewContacts={() => setCurrentView('contacts')}
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
                onBack={() => setCurrentView('dashboard')}
                onManageContacts={() => setCurrentView('contacts')}
              />
            )}

            {currentView === 'contacts' && user && (
              <ManageContacts
                user={user}
                onBack={() => setCurrentView('history')}
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
              <AdminPanel onBack={() => setCurrentView('dashboard')} />
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
      <Toaster richColors position="top-right" />
    </LanguageProvider>
  );
}
