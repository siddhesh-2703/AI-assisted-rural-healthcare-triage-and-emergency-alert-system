# AI Rural Healthcare Triage System

A high-performance, AI-driven medical triage and emergency prioritization system designed for rural healthcare environments. This platform leverages modern AI modules to provide immediate diagnostic insights, severity scoring, and facility recommendations.

## Core Features

- **Multi-Modal Diagnosis**: Support for symptom-based, voice-driven, and image-based (computer vision) medical assessment.
- **Smart Triage Engine**: Intelligent prioritization (Low to Critical) with real-time severity scoring.
- **Advanced Visualization**: High-fidelity hospital mapping and interactive medical analytics.
- **Real-Time Data Layer**: Fully integrated with Firebase for medical report persistence and live synchronization.
- **Emergency Optimization**: Dedicated emergency mode for rapid assessment of critical conditions.

## Technical Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Animations**: Framer Motion
- **Data Layer**: Firebase (Auth, Firestore, Storage)
- **Analytics**: Recharts, XLSX
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configuration**:
   Update `src/app/services/firebase.ts` with your Firebase project credentials.

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## Development Tools

The project includes a `DevSimulator` utility for rapid testing of various triage scenarios and priority levels during development.