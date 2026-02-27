import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Phone, X, MapPin, Clock } from 'lucide-react';
import type { AnalysisResult } from '../App';

interface CriticalAlertProps {
  result: AnalysisResult;
  onClose: () => void;
}

export default function CriticalAlert({ result, onClose }: CriticalAlertProps) {
  const [countdown, setCountdown] = useState(10);
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(true);

  useEffect(() => {
    if (autoCloseEnabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoCloseEnabled && countdown === 0) {
      onClose();
    }
  }, [countdown, autoCloseEnabled, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Flashing Red Overlay */}
      <motion.div
        className="absolute inset-0 bg-red-600"
        animate={{ opacity: [0.8, 0.95, 0.8] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Animated Border */}
      <motion.div
        className="absolute inset-4 border-8 border-white rounded-3xl"
        animate={{
          borderColor: ['#ffffff', '#ff0000', '#ffffff'],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setAutoCloseEnabled(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Alert Icon */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="relative p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Critical Warning */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            CRITICAL EMERGENCY
          </span>
        </motion.h2>

        <p className="text-xl text-center text-gray-800 font-semibold mb-8">
          SEEK IMMEDIATE MEDICAL ATTENTION
        </p>

        {/* Severity Score */}
        <div className="mb-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-semibold">Severity Score:</span>
            <motion.span
              className="text-4xl font-bold text-red-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {result.severityScore}/100
            </motion.span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-700"
              initial={{ width: '0%' }}
              animate={{ width: `${result.severityScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="space-y-4 mb-8">
          <motion.a
            href="tel:108"
            className="block w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = 'tel:108';
            }}
          >
            <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl shadow-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Phone className="w-8 h-8" />
              </motion.div>
              <div className="text-left flex-1">
                <div className="text-2xl font-bold">📞 CALL 108</div>
                <div className="text-sm opacity-90">Emergency Ambulance</div>
              </div>
            </div>
          </motion.a>

          <motion.a
            href="tel:102"
            className="block w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = 'tel:102';
            }}
          >
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl shadow-lg">
              <Phone className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className="text-xl font-bold">📞 CALL 102</div>
                <div className="text-sm opacity-90">Medical Emergency</div>
              </div>
            </div>
          </motion.a>
        </div>

        {/* Immediate Actions */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Immediate Actions:
          </h3>
          <ul className="space-y-2">
            {result.firstAid.slice(0, 3).map((step, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 text-gray-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-red-600 font-bold">•</span>
                <span>{step}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Auto-close countdown */}
        {autoCloseEnabled && (
          <motion.div
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>
              Auto-closing in {countdown} seconds to show full details...
            </p>
            <button
              onClick={() => setAutoCloseEnabled(false)}
              className="text-blue-600 hover:text-blue-700 underline mt-1"
            >
              Cancel auto-close
            </button>
          </motion.div>
        )}

        {!autoCloseEnabled && (
          <motion.button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Report
          </motion.button>
        )}

        {/* Audio Alert */}
        <audio autoPlay loop>
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGJ0fPTgjMGHGez6+mnUhQJQZ3e8LhlHgU2jdXzzIU2Bhxqtevpp1IUCUGc3vC5ZR4FNo3V88yFNgYcarXr6ahSFAlBnN7wuWUeBTaN1fPMhTYGHGq16+moUhQJQZze8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7wuWUeBTaN1fPMhTYGHGq16+mnUhQJQZ3e8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7wuWUeBTaN1fPMhTYGHGq16+mnUhQJQZ3e8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7wuWUeBTaN1fPMhTYGHGq16+mnUhQJQZ3e8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7wuWUeBTaN1fPMhTYGHGq16+mnUhQJQZ3e8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7wuWUeBTaN1fPMhTYGHGq16+mnUhQJQZ3e8LllHgU2jdXzzIU2Bhxqtevpp1IUCUGd3vC5ZR4FNo3V88yFNgYcarXr6adSFAlBnd7w" type="audio/wav" />
        </audio>
      </motion.div>
    </motion.div>
  );
}
