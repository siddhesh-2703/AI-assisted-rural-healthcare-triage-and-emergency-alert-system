import { motion } from 'motion/react';
import { Heart, Activity, Users, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [livesSaved, setLivesSaved] = useState(12847);
  const [casesHandled, setCasesHandled] = useState(45892);
  const [activeUsers, setActiveUsers] = useState(8234);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivesSaved(prev => prev + Math.floor(Math.random() * 3));
      setCasesHandled(prev => prev + Math.floor(Math.random() * 5));
      setActiveUsers(prev => prev + Math.floor(Math.random() * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 pt-6 px-6 md:px-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full blur-md"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-white rounded-full p-3 shadow-lg">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              HealthAI Triage
            </h1>
            <p className="text-sm text-gray-600">Rural Healthcare Revolution</p>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="text-center">
          {/* Animated Heartbeat Line */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <svg width="200" height="60" viewBox="0 0 200 60" className="text-red-500">
              <motion.path
                d="M 0 30 L 40 30 L 50 10 L 60 50 L 70 20 L 80 40 L 90 30 L 200 30"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI That Saves Lives
            </span>
            <br />
            <span className="text-gray-800">
              Before It's Too Late
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Intelligent healthcare triage system powered by AI. 
            Get instant diagnosis, emergency prioritization, and life-saving guidance 
            for rural communities with limited medical access.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full shadow-2xl overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-lg font-semibold">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>

        {/* Statistics */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { icon: Heart, label: 'Lives Saved', value: livesSaved, color: 'red' },
            { icon: Activity, label: 'Cases Handled', value: casesHandled, color: 'blue' },
            { icon: Users, label: 'Active Users', value: activeUsers, color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl" />
              <div className="relative p-6 text-center">
                <motion.div
                  className={`inline-flex p-3 rounded-full bg-${stat.color}-100 mb-3`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </motion.div>
                <motion.div
                  className={`text-3xl font-bold text-${stat.color}-600 mb-1`}
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {[
            { icon: '🗣️', title: 'Voice Diagnosis', desc: 'Speak your symptoms in any language' },
            { icon: '📸', title: 'Image Analysis', desc: 'AI-powered wound & injury detection' },
            { icon: '⚡', title: 'Instant Triage', desc: 'Get priority level in seconds' },
            { icon: '🚑', title: 'Emergency Alert', desc: 'Auto ambulance for critical cases' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg group-hover:shadow-2xl transition-shadow" />
              <div className="relative p-6 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer Badge */}
      <motion.div
        className="relative z-10 text-center pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">Serving 500+ Rural Communities</span>
        </div>
      </motion.div>
    </div>
  );
}
