import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mic, MicOff, Volume2, Languages, Loader2, AlertCircle } from 'lucide-react';
import type { AnalysisResult } from '../App';
import { analyzeSymptoms as professionalAnalysis } from '../services/professionalAI';
import { translateSymptoms } from '../services/symptomTranslation';
import { useLanguage } from '../context/LanguageContext';

interface VoiceInputProps {
  onBack: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function VoiceInput({ onBack, onAnalysisComplete }: VoiceInputProps) {
  const { t, language: appLanguage, setLanguage: setAppLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>(appLanguage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [error, setError] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'hi' as const, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta' as const, name: 'தமிழ்', flag: '🇮🇳' },
  ];

  useEffect(() => {
    // Check microphone permission on mount
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');

      result.addEventListener('change', () => {
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
      });
    } catch (error) {
      console.log('Permission API not supported');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
      setError('');
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      setPermissionStatus('denied');
      setError(t('microphoneAccessDenied'));
      return false;
    }
  };

  useEffect(() => {
    // Initialize speech recognition if browser supports it
    if (('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && permissionStatus === 'granted') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
      };
      recognitionRef.current.lang = langMap[language];

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        // Update transcript with both final and interim results for better UX
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        } else if (interimTranscript) {
          // Show interim results in real-time (will be replaced by final)
          setTranscript(prev => {
            const lastSpaceIndex = prev.lastIndexOf(' ');
            if (lastSpaceIndex === -1 || prev.trim().split(' ').length === 0) {
              return interimTranscript;
            }
            return prev.substring(0, lastSpaceIndex + 1) + interimTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('Microphone access denied. Please allow microphone access.');
          setPermissionStatus('denied');
        } else if (event.error === 'no-speech') {
          setError(t('noSpeechDetected'));
        } else if (event.error === 'audio-capture') {
          setError(t('microphoneNotFound'));
        } else if (event.error === 'network') {
          setError(t('networkError'));
        } else {
          setError(`Error: ${event.error}. Please try again.`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended, isListening:', isListening);
        if (isListening) {
          // Restart if still supposed to be listening
          try {
            recognitionRef.current?.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
            setIsListening(false);
          }
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Recognition started successfully');
        setError('');
      };

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech detected');
      };

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, permissionStatus, isListening]);

  useEffect(() => {
    if (isListening) {
      // Simulate audio level animation
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  // Initialize audio processing with gain control for low volume detection
  const initializeAudioProcessing = async () => {
    try {
      // Request microphone with advanced audio constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // Enable automatic gain control
          sampleRate: 48000, // Higher sample rate for better quality
          channelCount: 1,
        }
      });

      mediaStreamRef.current = stream;

      // Create Web Audio API context for audio amplification
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create nodes for audio processing
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();

      // Configure analyser for better low-volume detection
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3; // Faster response to audio changes
      analyser.minDecibels = -90; // Lower threshold to detect quiet sounds
      analyser.maxDecibels = -10;

      // Set high gain (amplification) for low voices
      // 3.0 = 300% amplification - detects even whispers
      gainNode.gain.value = 3.0;

      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;

      // Connect audio processing chain
      // source → gainNode (amplify) → analyser (monitor) → destination
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      // Start real-time audio level monitoring
      monitorAudioLevel();

      console.log('✅ Audio processing initialized with 300% gain amplification');
      return true;
    } catch (error) {
      console.error('Audio processing initialization failed:', error);
      setError(t('microphoneRequiredDesc'));
      return false;
    }
  };

  // Real-time audio level monitoring for visual feedback
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume level
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Amplify visual representation for better feedback
      const amplifiedLevel = Math.min(100, average * 1.5);
      setAudioLevel(amplifiedLevel);

      // Continue monitoring while listening
      if (isListening) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  };

  // Cleanup audio resources when component unmounts
  useEffect(() => {
    return () => {
      // Stop all audio tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      // Stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Stop audio monitoring
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Stop media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setIsListening(false);
      console.log('Stopped listening');
    } else {
      // Request permission if not granted
      if (permissionStatus !== 'granted') {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }

      setError('');

      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
        return;
      }

      // Initialize advanced audio processing for low-volume detection
      console.log('🎙️ Initializing enhanced audio processing...');
      await initializeAudioProcessing();

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

      // Initialize or reinitialize recognition
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Enhanced settings for better low-volume recognition
        recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives for better accuracy

        const langMap = {
          en: 'en-US',
          hi: 'hi-IN',
          ta: 'ta-IN',
        };
        recognitionRef.current.lang = langMap[language];

        // Set up event handlers
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
            console.log('✅ Final transcript:', finalTranscript);
          } else if (interimTranscript) {
            setTranscript(prev => {
              const lastSpaceIndex = prev.lastIndexOf(' ');
              if (lastSpaceIndex === -1 || prev.trim().split(' ').length === 0) {
                return interimTranscript;
              }
              return prev.substring(0, lastSpaceIndex + 1) + interimTranscript;
            });
          }
        };

        recognitionRef.current.onaudiostart = () => {
          console.log('🎤 Audio capture started - listening for speech...');
        };

        recognitionRef.current.onsoundstart = () => {
          console.log('🔊 Sound detected (including low volume)');
        };

        recognitionRef.current.onspeechstart = () => {
          console.log('🗣️ Speech recognized and being processed');
          setError(''); // Clear any previous "no speech" errors
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setError('Microphone access denied. Please allow microphone access.');
            setPermissionStatus('denied');
          } else if (event.error === 'no-speech') {
            // Don't show error for no-speech - just a temporary silence
            console.log('No speech detected (temporary) - continuing to listen...');
          } else if (event.error === 'audio-capture') {
            setError('Microphone not found. Please check your device.');
          } else if (event.error === 'network') {
            setError('Network error. Speech recognition requires internet connection.');
          } else {
            console.log(`Recognition error: ${event.error} - will retry`);
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Recognition ended');
          if (isListening) {
            try {
              console.log('Auto-restarting recognition...');
              recognitionRef.current?.start();
            } catch (err) {
              console.error('Error restarting recognition:', err);
              setIsListening(false);
            }
          }
        };
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('✅ Started listening with enhanced low-volume detection');
      } catch (error) {
        console.error('Error starting recognition:', error);
        setError('Could not start voice recognition. Please try again.');
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
      };
      utterance.lang = langMap[language];
      window.speechSynthesis.speak(utterance);
    }
  };

  const analyzeVoiceInput = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);

    try {
      // Translate symptoms to English if not already in English
      let symptomsToAnalyze = transcript;

      if (language !== 'en') {
        console.log(`🌍 Translating ${language} symptoms to English using Llama...`);
        console.log('Original:', transcript);

        symptomsToAnalyze = await translateSymptoms(transcript, language);

        console.log('Translated:', symptomsToAnalyze);
      }

      // Use professional AI analysis with translated symptoms and selected language
      const result = await professionalAnalysis(symptomsToAnalyze, language);
      setIsProcessing(false);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsProcessing(false);
      setError(t('error'));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('voiceDiagnosis')}</h2>
          <p className="text-gray-600">{t('speakSymptoms')}</p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Languages className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${language === lang.code
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg mr-2">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Voice Recording Interface */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Permission Request */}
          {permissionStatus === 'denied' && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Microphone Access Denied</h4>
                  <p className="text-sm text-red-700 mb-2">
                    {t('microphoneAccessDenied')}
                  </p>
                  <button
                    onClick={requestMicrophonePermission}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {t('requestPermissionAgain')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {permissionStatus === 'prompt' && !isListening && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
              <div className="flex items-start gap-3">
                <Mic className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Microphone Permission Required</h4>
                  <p className="text-sm text-blue-700">
                    {t('microphoneRequiredDesc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">{error}</p>
              </div>
            </div>
          )}

          {/* Microphone Button */}
          <div className="flex flex-col items-center mb-8">
            <motion.button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-600'
                : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse Animation */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-400"
                    animate={{ scale: [1, 1.3, 1.5], opacity: [0.6, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-400"
                    animate={{ scale: [1, 1.2, 1.4], opacity: [0.6, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}

              {isListening ? (
                <MicOff className="w-12 h-12 text-white relative z-10" />
              ) : (
                <Mic className="w-12 h-12 text-white relative z-10" />
              )}
            </motion.button>

            {/* Audio Level Bars */}
            {isListening && (
              <motion.div
                className="flex items-end gap-1 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-purple-500 rounded-full"
                    animate={{
                      height: [
                        20 + Math.random() * 30,
                        20 + Math.random() * 60,
                        20 + Math.random() * 30,
                      ],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Status Text */}
            <motion.p
              className="mt-6 text-lg font-medium text-gray-700"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isListening ? t('listening') : t('tapToSpeak')}
            </motion.p>
          </div>

          {/* Transcript Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{t('yourSymptoms')}</h3>
              {transcript && (
                <button
                  onClick={() => speakText(transcript)}
                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600">{t('playBack')}</span>
                </button>
              )}
            </div>

            {transcript || isListening ? (
              <motion.div
                className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200 min-h-[120px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-gray-700 leading-relaxed text-lg">
                  {transcript || (isListening && <span className="text-gray-400 italic">{t('startSpeaking')}</span>)}
                </p>
                {isListening && (
                  <motion.div
                    className="mt-3 flex items-center gap-2 text-sm text-purple-600"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    {t('listening')}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  {t('speechRealTime')}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={() => setTranscript('')}
              disabled={!transcript || isProcessing}
              className={`flex-1 py-3 rounded-xl font-medium ${!transcript || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-400'
                }`}
              whileHover={transcript && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={transcript && !isProcessing ? { scale: 0.98 } : {}}
            >
              {t('clear')}
            </motion.button>
            <motion.button
              onClick={analyzeVoiceInput}
              disabled={!transcript || isProcessing}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${!transcript || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                } shadow-lg`}
              whileHover={transcript && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={transcript && !isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('analyzing')}
                </>
              ) : (
                t('analyzeSymptoms')
              )}
            </motion.button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 {t('howToUseVoice').split(' → ')[0]}:</strong> {t('howToUseVoice').split(' → ').slice(1).join(' → ')}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              <strong>{t('examples')}:</strong> {t('voiceExamplesDesc')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}