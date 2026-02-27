import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TestTube, X } from 'lucide-react';

interface DemoHelperProps {
  onTestCase?: (symptoms: string) => void;
}

export default function DevSimulator({ onTestCase }: DemoHelperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const testCases = [
    {
      category: 'Critical',
      color: 'red',
      cases: [
        { name: 'Heart Attack', text: 'Severe chest pain radiating to left arm, difficulty breathing, sweating profusely' },
        { name: 'Severe Bleeding', text: 'Heavy bleeding from deep wound after accident, blood loss is severe' },
        { name: 'Respiratory Distress', text: 'Cannot breathe properly, gasping for air, lips turning blue' },
      ],
    },
    {
      category: 'High',
      color: 'orange',
      cases: [
        { name: 'High Fever', text: 'High fever 103°F for 3 days with severe vomiting and body ache' },
        { name: 'Accident Injury', text: 'Fell from height, suspected broken leg, severe pain and swelling' },
        { name: 'Snake Bite', text: 'Bitten by snake 1 hour ago, swelling spreading rapidly' },
      ],
    },
    {
      category: 'Medium',
      color: 'yellow',
      cases: [
        { name: 'Common Cold', text: 'Cough and cold for 2 days, mild fever, runny nose, headache' },
        { name: 'Stomach Issue', text: 'Stomach pain and diarrhea since yesterday, mild vomiting' },
        { name: 'Headache', text: 'Persistent headache for 1 day, sensitivity to light' },
      ],
    },
    {
      category: 'Low',
      color: 'green',
      cases: [
        { name: 'Minor Cut', text: 'Small cut on finger while cooking, minimal bleeding' },
        { name: 'Mild Fatigue', text: 'Feeling tired and weak, no other symptoms' },
        { name: 'Skin Rash', text: 'Small rash on arm, mild itching, no pain' },
      ],
    },
  ];

  const colorClasses = {
    red: 'bg-red-100 border-red-300 text-red-800',
    orange: 'bg-orange-100 border-orange-300 text-orange-800',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    green: 'bg-green-100 border-green-300 text-green-800',
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-40 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TestTube className="w-4 h-4" />
        Simulation Utility
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-20 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">Triage Simulation Utility</h3>
                <p className="text-xs opacity-90">Developer tools for diagnostic testing</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <p className="text-xs text-gray-600 mb-4">
                Click any test case to copy symptoms to clipboard, then paste in text input or voice input.
              </p>

              {testCases.map((category) => (
                <div key={category.category} className="mb-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                    {category.category} Priority
                  </h4>
                  <div className="space-y-2">
                    {category.cases.map((testCase, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => {
                          navigator.clipboard.writeText(testCase.text);
                          if (onTestCase) onTestCase(testCase.text);
                        }}
                        className={`w-full text-left p-3 rounded-lg border-2 ${colorClasses[category.color as keyof typeof colorClasses]
                          } hover:shadow-md transition-shadow`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold text-sm mb-1">{testCase.name}</div>
                        <div className="text-xs opacity-75 line-clamp-2">{testCase.text}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>💡 Tip:</strong> Test the chatbot with questions like:
                  <br />• "What are symptoms of dengue?"
                  <br />• "बुखार का इलाज क्या है?" (Hindi)
                  <br />• "காய்ச்சல் என்றால் என்ன?" (Tamil)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
