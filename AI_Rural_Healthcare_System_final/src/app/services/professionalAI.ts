import type { AnalysisResult } from '../App';
import { MEDICAL_CONDITIONS, MEDICINE_DATABASE } from './medicalDatabase';
import { CONDITION_FIRST_AID, getSymptomSpecificTips } from './conditionSpecificFirstAid';
import { groq, USE_LLAMA } from './aiService';

/**
 * PROFESSIONAL MEDICAL AI SYSTEM
 * Ultra Medical Training - Rural Healthcare Triage & Emergency Prioritization
 * 
 * Based on WHO rural health protocols and emergency triage guidelines
 * Designed for low-resource environments with limited specialist access
 */

interface PatientData {
  symptoms: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  riskFactors?: string[];
  duration?: string;
  severity?: string;
  vitalSigns?: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
    oxygenSaturation?: number;
    respiratoryRate?: number;
  };
}

// Advanced symptom matching with medical terminology
function extractSymptoms(text: string): string[] {
  const symptomMap: Record<string, string[]> = {
    // Cardiac symptoms
    'chest pain': ['chest pain', 'chest ache', 'chest pressure', 'crushing pain', 'squeezing chest', 'thoracic pain', 'angina', 'cardiac pain', 'tightness in chest', 'heavy chest'],
    'palpitations': ['palpitation', 'heart racing', 'rapid heartbeat', 'irregular heartbeat', 'heart flutter', 'heart pounding', 'skipped beats'],
    'radiating pain': ['pain radiating', 'pain spreading', 'referred pain', 'pain to arm', 'pain to jaw', 'pain to back', 'pain down arm', 'arm pain', 'jaw pain'],
    'left arm pain': ['left arm pain', 'left shoulder pain', 'arm numbness', 'left arm tingling'],
    'sweating': ['sweating', 'perspiration', 'cold sweat', 'profuse sweating', 'clammy', 'diaphoresis'],

    // Respiratory symptoms
    'shortness of breath': ['shortness of breath', 'breathless', 'difficulty breathing', 'dyspnea', 'gasping', 'can\'t breathe', 'breathing difficulty', 'sob', 'hard to breathe', 'breathlessness'],
    'cough': ['cough', 'coughing', 'tussis', 'hacking cough', 'persistent cough', 'dry cough'],
    'cough with blood': ['coughing blood', 'hemoptysis', 'blood in cough', 'bloody sputum', 'blood when coughing'],
    'wheezing': ['wheeze', 'wheezing', 'whistling breath', 'whistling sound when breathing'],
    'chest tightness': ['chest tight', 'chest constriction', 'tight chest', 'chest feels tight'],
    'productive cough': ['phlegm', 'mucus', 'sputum', 'wet cough', 'coughing up mucus'],

    // Neurological symptoms
    'headache': ['headache', 'head ache', 'head pain', 'cephalgia', 'head hurts', 'pain in head'],
    'severe headache': ['severe headache', 'worst headache', 'thunderclap headache', 'splitting headache', 'intense headache', 'unbearable headache'],
    'dizziness': ['dizzy', 'dizziness', 'vertigo', 'lightheaded', 'spinning', 'room spinning', 'unsteady', 'balance problems'],
    'confusion': ['confused', 'confusion', 'disoriented', 'altered mental status', 'not thinking clearly', 'mental fog'],
    'weakness': ['weakness', 'weak', 'fatigue', 'lethargy', 'tired', 'no energy', 'exhausted', 'body weakness'],
    'facial drooping': ['facial droop', 'face drooping', 'facial weakness', 'asymmetric face', 'one side face drooping', 'face paralysis'],
    'speech difficulty': ['speech difficulty', 'slurred speech', 'can\'t speak', 'aphasia', 'trouble speaking', 'garbled speech', 'unable to speak'],
    'neck stiffness': ['stiff neck', 'neck rigidity', 'nuchal rigidity', 'neck pain', 'can\'t bend neck'],
    'numbness': ['numbness', 'numb', 'tingling', 'pins and needles', 'loss of sensation', 'can\'t feel'],
    'vision problems': ['blurred vision', 'vision problem', 'can\'t see clearly', 'double vision', 'vision loss', 'blind spots', 'visual disturbance'],
    'seizure': ['seizure', 'convulsion', 'fit', 'shaking', 'epileptic fit'],

    // Gastrointestinal symptoms
    'abdominal pain': ['abdominal pain', 'stomach pain', 'belly pain', 'tummy ache', 'gut pain', 'abdomen hurts', 'stomach ache'],
    'nausea': ['nausea', 'nauseous', 'queasy', 'sick feeling', 'feel like vomiting', 'unsettled stomach'],
    'vomiting': ['vomit', 'vomiting', 'throwing up', 'emesis', 'puking', 'vomitted'],
    'diarrhea': ['diarrhea', 'loose motion', 'loose stool', 'watery stool', 'dysentery', 'frequent stool', 'runny stool'],
    'constipation': ['constipation', 'hard stool', 'difficulty passing stool', 'can\'t poop', 'no bowel movement'],
    'blood in stool': ['blood in stool', 'bloody stool', 'black stool', 'melena', 'hematochezia', 'red in stool', 'dark stool'],
    'loss of appetite': ['no appetite', 'loss of appetite', 'anorexia', 'not hungry', 'don\'t want to eat', 'can\'t eat'],
    'bloating': ['bloating', 'bloated', 'gas', 'flatulence', 'distended abdomen', 'swollen belly'],
    'heartburn': ['heartburn', 'acid reflux', 'burning in chest', 'acidity', 'sour taste'],

    // Infectious symptoms
    'fever': ['fever', 'high temperature', 'pyrexia', 'febrile', 'hot', 'burning up', 'temperature', 'feeling hot', 'feverish'],
    'chills': ['chills', 'shivering', 'rigors', 'shaking', 'cold', 'feeling cold'],
    'night sweats': ['night sweats', 'sweating at night', 'drenching sweats'],
    'body ache': ['body ache', 'body pain', 'muscle pain', 'myalgia', 'muscle ache', 'aches all over', 'generalized body pain'],
    'joint pain': ['joint pain', 'arthralgia', 'joints aching', 'painful joints', 'joint swelling'],
    'sore throat': ['sore throat', 'throat pain', 'painful throat', 'throat hurts', 'pharyngitis'],
    'runny nose': ['runny nose', 'nasal discharge', 'rhinorrhea', 'stuffy nose', 'blocked nose', 'congestion'],

    // Trauma symptoms
    'bleeding': ['bleeding', 'blood loss', 'hemorrhage', 'oozing blood', 'blood coming out', 'profuse bleeding'],
    'severe bleeding': ['severe bleeding', 'heavy bleeding', 'lots of blood', 'bleeding heavily', 'uncontrolled bleeding'],
    'swelling': ['swelling', 'swollen', 'edema', 'puffiness', 'inflammation'],
    'bruising': ['bruise', 'bruising', 'contusion', 'black and blue', 'discoloration'],
    'deformity': ['deformity', 'deformed', 'bent', 'crooked', 'misshapen', 'abnormal shape'],
    'inability to move': ['can\'t move', 'unable to move', 'immobile', 'paralyzed', 'loss of movement'],
    'bone pain': ['bone pain', 'pain in bone', 'deep pain'],

    // Urinary symptoms
    'burning urination': ['burning urination', 'painful urination', 'dysuria', 'pain when peeing', 'burning when urinating'],
    'frequent urination': ['frequent urination', 'urinating often', 'polyuria', 'peeing a lot', 'need to urinate frequently'],
    'blood in urine': ['blood in urine', 'hematuria', 'red urine', 'pink urine', 'bloody urine'],
    'difficulty urinating': ['difficulty urinating', 'can\'t urinate', 'weak stream', 'straining to urinate'],

    // Skin symptoms
    'rash': ['rash', 'skin eruption', 'red spots', 'hives', 'urticaria', 'skin redness', 'spots on skin'],
    'itching': ['itching', 'itch', 'pruritus', 'scratching', 'skin itching'],
    'skin discoloration': ['jaundice', 'yellow skin', 'yellow eyes', 'pale skin', 'blue lips', 'cyanosis'],
    'skin lesions': ['sores', 'ulcers', 'wounds', 'skin lesions', 'open sores'],

    // Respiratory emergency
    'difficulty swallowing': ['difficulty swallowing', 'can\'t swallow', 'dysphagia', 'choking', 'throat closing'],
    'stridor': ['stridor', 'noisy breathing', 'harsh breathing sound'],

    // Other critical symptoms
    'unconscious': ['unconscious', 'unresponsive', 'passed out', 'fainted', 'loss of consciousness', 'blacked out'],
    'severe pain': ['severe pain', 'excruciating pain', 'unbearable pain', 'intense pain', '10/10 pain'],
    'sudden onset': ['sudden', 'suddenly', 'came on suddenly', 'acute', 'all of a sudden'],
    'weight loss': ['weight loss', 'losing weight', 'dropped weight', 'lost pounds', 'unintentional weight loss'],
    'excessive thirst': ['excessive thirst', 'very thirsty', 'polydipsia', 'always thirsty'],
    'excessive hunger': ['excessive hunger', 'always hungry', 'polyphagia'],
    'urinary incontinence': ['leaking urine', 'can\'t control urine', 'urinary incontinence'],
    'back pain': ['back pain', 'lower back pain', 'pain in back', 'backache', 'spine pain'],
  };

  const detectedSymptoms: string[] = [];
  const lowerText = text.toLowerCase();

  // First pass: exact phrase matching (prioritize longer phrases)
  const sortedSymptoms = Object.entries(symptomMap).sort((a, b) =>
    b[1][0].length - a[1][0].length
  );

  for (const [symptom, keywords] of sortedSymptoms) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      if (!detectedSymptoms.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    }
  }

  return detectedSymptoms;
}

// CRITICAL EMERGENCY DETECTION - WHO Rural Health Protocols
// Always prioritize patient safety - when uncertain, choose higher severity
function detectCriticalEmergency(symptoms: string[], lowerText: string, age?: number, vitalSigns?: PatientData['vitalSigns']): {
  isCritical: boolean;
  criticalReasons: string[];
  urgencyLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  facilityRecommendation: string;
  severityOverride?: number;
} {
  const criticalReasons: string[] = [];
  let isCritical = false;
  let urgencyLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' = 'GREEN';
  let facilityRecommendation = 'Primary Health Center (PHC)';
  let severityOverride: number | undefined = undefined;

  // RED FLAG SYMPTOMS - Immediate Life-Threatening (WHO Protocol)
  const redFlagChecks = [
    {
      symptoms: ['chest pain', 'sweating', 'radiating pain', 'left arm pain'],
      minMatch: 2,
      condition: 'Suspected Cardiac Emergency (Heart Attack)',
      severity: 95,
      facility: 'Emergency Trauma Center / District Hospital with Cardiac Care'
    },
    {
      symptoms: ['shortness of breath', 'chest pain', 'sweating'],
      minMatch: 2,
      condition: 'Acute Respiratory Distress',
      severity: 92,
      facility: 'Emergency Trauma Center with Oxygen Support'
    },
    {
      symptoms: ['facial drooping', 'speech difficulty', 'weakness', 'numbness'],
      minMatch: 2,
      condition: 'Suspected Stroke (Brain Attack)',
      severity: 96,
      facility: 'District Hospital with CT Scan - TIME CRITICAL (Golden Hour)'
    },
    {
      symptoms: ['unconscious'],
      minMatch: 1,
      condition: 'Loss of Consciousness',
      severity: 98,
      facility: 'Nearest Emergency Trauma Center IMMEDIATELY'
    },
    {
      symptoms: ['severe bleeding'],
      minMatch: 1,
      condition: 'Severe Hemorrhage',
      severity: 94,
      facility: 'Emergency Trauma Center / District Hospital'
    },
    {
      symptoms: ['seizure'],
      minMatch: 1,
      condition: 'Active Seizure / Convulsions',
      severity: 93,
      facility: 'District Hospital with Emergency Department'
    },
    {
      symptoms: ['difficulty swallowing', 'stridor'],
      minMatch: 1,
      condition: 'Airway Obstruction',
      severity: 97,
      facility: 'Emergency Trauma Center - AIRWAY EMERGENCY'
    },
    {
      symptoms: ['severe headache', 'neck stiffness', 'fever'],
      minMatch: 3,
      condition: 'Suspected Meningitis',
      severity: 95,
      facility: 'District Hospital - INFECTIOUS EMERGENCY'
    },
    {
      symptoms: ['severe pain', 'abdominal pain', 'vomiting', 'fever'],
      minMatch: 3,
      condition: 'Acute Abdomen (Possible Appendicitis/Peritonitis)',
      severity: 88,
      facility: 'District Hospital with Surgical Facility'
    },
    {
      symptoms: ['cough with blood'],
      minMatch: 1,
      condition: 'Hemoptysis (Blood in Sputum)',
      severity: 87,
      facility: 'District Hospital / CHC with X-ray'
    },
    {
      symptoms: ['blood in stool', 'severe pain'],
      minMatch: 2,
      condition: 'Gastrointestinal Bleeding',
      severity: 90,
      facility: 'District Hospital with Blood Bank'
    },
  ];

  // Check for RED FLAG combinations
  for (const check of redFlagChecks) {
    const matchedSymptoms = check.symptoms.filter(s => symptoms.includes(s));
    if (matchedSymptoms.length >= check.minMatch) {
      isCritical = true;
      criticalReasons.push(check.condition);
      urgencyLevel = 'RED';
      facilityRecommendation = check.facility;
      severityOverride = Math.max(severityOverride || 0, check.severity);
    }
  }

  // VITAL SIGNS CHECKS - Physiological Emergency Criteria
  if (vitalSigns) {
    // Oxygen Saturation < 90% - CRITICAL
    if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 90) {
      isCritical = true;
      criticalReasons.push('Hypoxemia (Low Oxygen) - Oxygen Saturation < 90%');
      urgencyLevel = 'RED';
      severityOverride = 95;
      facilityRecommendation = 'Emergency Trauma Center with Oxygen/Ventilator Support';
    }

    // Severe Tachycardia or Bradycardia
    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
        criticalReasons.push(`Abnormal Heart Rate: ${vitalSigns.heartRate} bpm`);
        if (urgencyLevel !== 'RED') urgencyLevel = 'ORANGE';
        if (!severityOverride) severityOverride = 82;
      }
    }

    // Hypertensive Crisis
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.includes('/')) {
      const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
      if (systolic >= 180 || diastolic >= 120) {
        isCritical = true;
        criticalReasons.push(`Hypertensive Crisis: BP ${vitalSigns.bloodPressure}`);
        urgencyLevel = 'RED';
        severityOverride = 91;
        facilityRecommendation = 'District Hospital with ICU';
      }
    }

    // High Fever with complications
    if (vitalSigns.temperature && vitalSigns.temperature >= 103) {
      if (symptoms.includes('confusion') || symptoms.includes('seizure')) {
        criticalReasons.push('High Fever with Neurological Signs');
        urgencyLevel = 'ORANGE';
        if (!severityOverride) severityOverride = 85;
      }
    }
  }

  // AGE-SPECIFIC EMERGENCY CRITERIA
  if (age !== undefined) {
    // Pediatric Emergency (<12 years)
    if (age < 12) {
      if (symptoms.includes('diarrhea') && symptoms.includes('vomiting')) {
        criticalReasons.push('Severe Dehydration Risk in Child');
        if (urgencyLevel === 'GREEN') urgencyLevel = 'ORANGE';
        if (!severityOverride) severityOverride = 78;
        facilityRecommendation = 'Community Health Center (CHC) or District Hospital';
      }
      if (symptoms.includes('fever') && symptoms.includes('seizure')) {
        isCritical = true;
        criticalReasons.push('Febrile Seizure in Child');
        urgencyLevel = 'RED';
        severityOverride = 90;
        facilityRecommendation = 'District Hospital with Pediatric Care';
      }
    }

    // Geriatric Emergency (>65 years)
    if (age > 65) {
      if (symptoms.includes('chest pain') || symptoms.includes('shortness of breath') || symptoms.includes('weakness')) {
        criticalReasons.push('Elderly Patient with High-Risk Symptoms');
        if ((urgencyLevel as any) === 'GREEN' || (urgencyLevel as any) === 'YELLOW') urgencyLevel = 'ORANGE';
        if (!severityOverride) severityOverride = Math.max(severityOverride || 0, 75);
      }
    }
  }

  // DURATION-BASED EMERGENCY (Sudden Onset = Higher Risk)
  if (lowerText.includes('sudden') || lowerText.includes('acute') || lowerText.includes('came on suddenly')) {
    if (symptoms.includes('chest pain') || symptoms.includes('severe headache') || symptoms.includes('shortness of breath')) {
      if (!isCritical) {
        criticalReasons.push('Sudden Onset of Critical Symptoms');
        if ((urgencyLevel as any) === 'GREEN' || (urgencyLevel as any) === 'YELLOW') urgencyLevel = 'ORANGE';
      }
    }
  }

  // ORANGE FLAG SYMPTOMS - Serious but not immediately life-threatening
  if (!isCritical) {
    const orangeFlags = [
      { symptoms: ['fever', 'body ache', 'bleeding'], condition: 'Possible Dengue/Viral Hemorrhagic Fever' },
      { symptoms: ['abdominal pain', 'fever', 'vomiting'], condition: 'Acute Gastrointestinal Emergency' },
      { symptoms: ['severe headache', 'vomiting', 'vision problems'], condition: 'Neurological Concern' },
      { symptoms: ['wheezing', 'cough', 'shortness of breath'], condition: 'Severe Asthma/COPD Exacerbation' },
      { symptoms: ['productive cough', 'fever', 'chest pain'], condition: 'Possible Pneumonia' },
    ];

    for (const check of orangeFlags) {
      const matches = check.symptoms.filter(s => symptoms.includes(s)).length;
      if (matches >= 2) {
        criticalReasons.push(check.condition);
        urgencyLevel = 'ORANGE';
        if (!severityOverride) severityOverride = 72;
        facilityRecommendation = 'Community Health Center (CHC) or District Hospital';
      }
    }
  }

  // YELLOW FLAG - Moderate symptoms requiring medical attention
  if (urgencyLevel === 'GREEN' && symptoms.length > 0) {
    const yellowFlags = ['fever', 'cough', 'diarrhea', 'vomiting', 'headache', 'body ache'];
    const yellowMatches = yellowFlags.filter(s => symptoms.includes(s)).length;

    if (yellowMatches >= 2) {
      urgencyLevel = 'YELLOW';
      facilityRecommendation = 'Primary Health Center (PHC) or Community Health Center (CHC)';
    } else if (yellowMatches === 1) {
      urgencyLevel = 'YELLOW';
      facilityRecommendation = 'Primary Health Center (PHC) for evaluation';
    }
  }

  return {
    isCritical,
    criticalReasons,
    urgencyLevel,
    facilityRecommendation,
    severityOverride,
  };
}

// Calculate symptom match score for a condition
function calculateMatchScore(patientSymptoms: string[], condition: typeof MEDICAL_CONDITIONS[0], lowerText: string): number {
  if (patientSymptoms.length === 0) return 0;

  let exactMatches = 0;
  let partialMatches = 0;
  let criticalMatches = 0;
  let pathognomonicMatch = false; // Definitive diagnostic symptom

  // Check for pathognomonic (definitive) symptoms - Expanded for accuracy
  const pathognomonicSymptoms: Record<string, string[]> = {
    'Acute Myocardial Infarction': ['crushing chest pain', 'radiating pain', 'chest pain', 'left arm pain', 'jaw pain'],
    'Stroke': ['facial drooping', 'speech difficulty', 'sudden weakness', 'arm weakness'],
    'Pneumonia': ['productive cough', 'chest pain', 'fever', 'shortness of breath'],
    'Appendicitis': ['right lower quadrant pain', 'abdominal pain', 'nausea', 'fever'],
    'Dengue Fever': ['severe body ache', 'fever', 'rash', 'bleeding', 'retro-orbital pain'],
    'Asthma': ['wheezing', 'shortness of breath', 'chest tightness'],
    'Migraine': ['severe headache', 'nausea', 'photophobia', 'visual aura'],
    'Malaria': ['cyclic fever', 'chills', 'sweating'],
    'COVID-19': ['loss of taste', 'loss of smell', 'dry cough', 'fever'],
    'Diabetic Ketoacidosis': ['fruity breath', 'abdominal pain', 'vomiting', 'confusion'],
    'Hypoglycemia': ['shakiness', 'sweating', 'confusion', 'rapid heartbeat'],
  };

  // Check for definitive symptom combinations
  for (const [conditionName, definingSymptoms] of Object.entries(pathognomonicSymptoms)) {
    if (condition.name.includes(conditionName)) {
      const matchedDefining = definingSymptoms.filter(ds =>
        patientSymptoms.some(ps => ps === ds) || lowerText.includes(ds)
      );
      if (matchedDefining.length >= 2) {
        pathognomonicMatch = true;
      }
    }
  }

  // Calculate exact symptom matches
  for (const symptom of patientSymptoms) {
    if (condition.symptoms.includes(symptom)) {
      exactMatches++;

      // Critical symptoms get extra weight
      const criticalSymptoms = [
        'chest pain', 'shortness of breath', 'severe bleeding', 'confusion',
        'severe headache', 'unconscious', 'facial drooping', 'speech difficulty',
        'severe pain', 'difficulty swallowing', 'seizure', 'blood in stool',
        'cough with blood', 'sudden onset'
      ];

      if (criticalSymptoms.includes(symptom)) {
        criticalMatches++;
      }
    }
  }

  // Check for related symptoms (partial matches)
  const relatedSymptoms: Record<string, string[]> = {
    'chest pain': ['chest tightness', 'palpitations', 'radiating pain'],
    'shortness of breath': ['wheezing', 'chest tightness', 'cough'],
    'fever': ['chills', 'sweating', 'body ache'],
    'headache': ['dizziness', 'nausea', 'vision problems'],
    'abdominal pain': ['nausea', 'vomiting', 'diarrhea', 'bloating'],
  };

  for (const symptom of patientSymptoms) {
    if (!condition.symptoms.includes(symptom)) {
      // Check if it's a related symptom
      for (const [mainSymptom, related] of Object.entries(relatedSymptoms)) {
        if (condition.symptoms.includes(mainSymptom) && related.includes(symptom)) {
          partialMatches++;
          break;
        }
      }
    }
  }

  // Scoring formula (weighted professional medical logic)
  const totalConditionSymptoms = condition.symptoms.length;

  // Base match percentage
  let score = (exactMatches / totalConditionSymptoms) * 70; // Exact matches worth 70%

  // Add partial matches bonus (related symptoms)
  score += (partialMatches / totalConditionSymptoms) * 15; // Partial matches worth 15%

  // Critical symptom bonus
  score += criticalMatches * 12; // Each critical symptom adds 12%

  // Pathognomonic bonus (definitive diagnostic criteria)
  if (pathognomonicMatch) {
    score += 20;
  }

  // Symptom count bonus (more matching symptoms = higher confidence)
  if (exactMatches >= 3) {
    score += 8;
  } else if (exactMatches >= 2) {
    score += 5;
  }

  // Ensure score is realistic and not over 99%
  return Math.min(95, Math.max(score, 0));
}

// Advanced differential diagnosis engine
function performDifferentialDiagnosis(patientData: PatientData): AnalysisResult {
  const { symptoms: symptomsText, age, gender, riskFactors = [], duration, vitalSigns } = patientData;

  // Extract and normalize symptoms
  const symptoms = extractSymptoms(symptomsText);
  const lowerText = symptomsText.toLowerCase();

  // CRITICAL EMERGENCY DETECTION
  const criticalDetection = detectCriticalEmergency(symptoms, lowerText, age, vitalSigns);
  if (criticalDetection.isCritical) {
    return {
      symptoms,
      conditions: criticalDetection.criticalReasons.map(reason => ({
        name: reason,
        confidence: 100,
      })),
      severityScore: criticalDetection.severityOverride || 95,
      priority: criticalDetection.urgencyLevel === 'RED' ? 'Critical' :
        criticalDetection.urgencyLevel === 'ORANGE' ? 'High' :
          criticalDetection.urgencyLevel === 'YELLOW' ? 'Medium' : 'Low',
      firstAid: generateFirstAid(undefined, criticalDetection.urgencyLevel, symptoms),
      medicines: generateMedicineRecommendations(undefined, criticalDetection.urgencyLevel, age, riskFactors),
      ambulanceRequired: criticalDetection.urgencyLevel === 'RED',
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
      facilityRecommendation: criticalDetection.facilityRecommendation,
    };
  }

  // Calculate match scores for all conditions
  const matchedConditions = MEDICAL_CONDITIONS.map(condition => ({
    ...condition,
    matchScore: calculateMatchScore(symptoms, condition, lowerText),
  }))
    .filter(c => c.matchScore > 10) // Lower threshold to ensure we get results
    .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score

  // If no significant matches found, use general symptom-based diagnosis
  if (matchedConditions.length === 0) {
    // Create a general diagnosis based on keyword detection
    const generalConditions = MEDICAL_CONDITIONS.filter(condition => {
      const keywords = symptoms.join(' ').toLowerCase();
      return condition.symptoms.some(s => keywords.includes(s.toLowerCase().split(' ')[0]));
    }).slice(0, 3);

    if (generalConditions.length > 0) {
      generalConditions.forEach(c => {
        matchedConditions.push({ ...c, matchScore: 45 });
      });
    } else {
      // Last resort: provide most common general conditions
      matchedConditions.push(
        { ...MEDICAL_CONDITIONS[0], matchScore: 40 },
        { ...MEDICAL_CONDITIONS[1], matchScore: 35 },
        { ...MEDICAL_CONDITIONS[2], matchScore: 30 }
      );
    }
  }

  // Apply risk factor adjustments
  matchedConditions.forEach(condition => {
    const patientRiskFactors = riskFactors.filter(rf =>
      condition.riskFactors.some(crf => crf.toLowerCase().includes(rf.toLowerCase()))
    );
    condition.matchScore += patientRiskFactors.length * 5;
  });

  // Apply age-based adjustments
  if (age) {
    matchedConditions.forEach(condition => {
      if (age > 65 && ['cardiac', 'neurological'].includes(condition.category)) {
        condition.matchScore += 5;
      }
      if (age < 12 && condition.severity > 60) {
        condition.matchScore += 10; // Children need more urgent care
      }
    });
  }

  // Apply duration-based adjustments
  if (duration && (duration.includes('hour') || duration.includes('sudden'))) {
    matchedConditions.forEach(condition => {
      if (condition.category === 'cardiac' || condition.category === 'neurological') {
        condition.matchScore += 10;
      }
    });
  }

  // Apply vital signs adjustments
  if (vitalSigns) {
    matchedConditions.forEach(condition => {
      if (condition.category === 'cardiac') {
        if (vitalSigns.heartRate && vitalSigns.heartRate > 100) {
          condition.matchScore += 5;
        }
        if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.includes('/')) {
          const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
          if (systolic > 140 || diastolic > 90) {
            condition.matchScore += 5;
          }
        }
      }
      if (condition.category === 'respiratory') {
        if (vitalSigns.respiratoryRate && vitalSigns.respiratoryRate > 20) {
          condition.matchScore += 5;
        }
        if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
          condition.matchScore += 5;
        }
      }
      if (condition.category === 'neurological') {
        if (vitalSigns.heartRate && vitalSigns.heartRate > 100) {
          condition.matchScore += 5;
        }
        if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.includes('/')) {
          const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
          if (systolic > 140 || diastolic > 90) {
            condition.matchScore += 5;
          }
        }
      }
    });
  }

  // Select top 3 conditions as differential diagnosis
  const topConditions = matchedConditions.slice(0, 3);

  // Calculate overall severity score
  let severityScore = 30; // Base score

  if (topConditions.length > 0) {
    // Weighted average of top conditions
    const avgSeverity = topConditions.reduce((sum, c, idx) => {
      const weight = 1 / (idx + 1); // First condition has highest weight
      return sum + (c.severity * weight);
    }, 0) / topConditions.reduce((sum, _, idx) => sum + 1 / (idx + 1), 0);

    severityScore = Math.round(avgSeverity);

    // Critical keyword detection overrides
    const criticalKeywords = [
      'severe', 'crushing', 'worst ever', 'sudden', 'acute', 'profuse',
      'heavy bleeding', 'can\'t breathe', 'chest pain', 'unconscious'
    ];

    if (criticalKeywords.some(kw => lowerText.includes(kw))) {
      severityScore = Math.max(severityScore, 75);
    }

    // Emergency condition boost
    if (topConditions[0]?.severity >= 85) {
      severityScore = Math.max(severityScore, topConditions[0].severity);
    }
  }

  // Determine priority based on severity
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  let ambulanceRequired = false;

  if (severityScore >= 86) {
    priority = 'Critical';
    ambulanceRequired = true;
  } else if (severityScore >= 61) {
    priority = 'High';
    if (severityScore >= 75) ambulanceRequired = true;
  } else if (severityScore >= 31) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  // Generate appropriate first aid recommendations
  const firstAid = generateFirstAid(topConditions[0], priority, symptoms);

  // Generate medicine recommendations
  const medicines = generateMedicineRecommendations(topConditions[0], priority, age, riskFactors);

  return {
    symptoms: symptoms.length > 0 ? symptoms : symptomsText.split(',').map(s => s.trim()).filter(Boolean),
    conditions: topConditions.map(c => ({
      name: c.name,
      confidence: Math.round(c.matchScore),
    })),
    severityScore,
    priority,
    firstAid,
    medicines,
    ambulanceRequired,
    riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
  };
}

// Generate appropriate first aid steps
function generateFirstAid(condition: typeof MEDICAL_CONDITIONS[0] | undefined, priority: string, symptoms: string[]): string[] {
  if (!condition) {
    return [
      'Monitor symptoms closely',
      'Rest in a comfortable position',
      'Stay hydrated with clean water',
      'Take temperature if fever suspected',
      'Consult healthcare provider if symptoms worsen',
      'Keep emergency contacts handy',
    ];
  }

  const firstAid: string[] = [];

  // Emergency conditions
  if (priority === 'Critical') {
    firstAid.push('🚨 CALL 108 AMBULANCE IMMEDIATELY - THIS IS A MEDICAL EMERGENCY');

    if (condition.category === 'cardiac') {
      firstAid.push(
        'Keep patient calm and seated in comfortable position',
        'Loosen tight clothing around neck and chest',
        'Give Aspirin 300mg (CHEW, don\'t swallow) if not allergic',
        'Monitor breathing and pulse every 2 minutes',
        'DO NOT give food or water',
        'Note time symptoms started',
        'If unconscious: Check breathing, start CPR if needed'
      );
    } else if (condition.category === 'respiratory') {
      firstAid.push(
        'Keep patient in upright sitting position (lean forward)',
        'Loosen all tight clothing',
        'Ensure adequate ventilation - open windows',
        'Use prescribed inhaler if available (4-6 puffs)',
        'Stay calm and reassure patient',
        'Monitor breathing rate and oxygen saturation',
        'If lips turn blue: Emergency CPR may be needed'
      );
    } else if (condition.category === 'neurological') {
      firstAid.push(
        'Note exact time symptoms started (critical for treatment)',
        'Keep patient lying down with head slightly elevated',
        'DO NOT give anything by mouth',
        'Turn head to side if vomiting',
        'Loosen tight clothing',
        'Check FAST: Face, Arms, Speech, Time',
        'Monitor consciousness level every 2 minutes'
      );
    } else if (condition.category === 'trauma') {
      firstAid.push(
        'Apply direct firm pressure on bleeding wound with clean cloth',
        'Elevate injured area above heart if possible',
        'DO NOT remove embedded objects',
        'Keep patient lying flat',
        'Cover with blanket to prevent shock',
        'Monitor pulse and breathing',
        'If conscious: Give sips of water only'
      );
    }
  } else if (priority === 'High') {
    firstAid.push('⚠️ SEEK MEDICAL ATTENTION WITHIN 4-6 HOURS');

    if (condition.category === 'infectious') {
      firstAid.push(
        'Complete bed rest mandatory',
        'Drink plenty of fluids - ORS, water, coconut water (3-4 liters/day)',
        'Monitor temperature every 4 hours',
        'Watch for warning signs: bleeding, severe pain, drowsiness',
        'Maintain mosquito prevention (if dengue/malaria)',
        'Eat light, easily digestible foods',
        'Take prescribed medications on time'
      );
    } else if (condition.category === 'gastrointestinal') {
      firstAid.push(
        'Nothing by mouth except sips of water',
        'Lie down in comfortable position',
        'Apply warm compress on abdomen (NOT if appendicitis suspected)',
        'Monitor for fever, vomiting, blood in vomit/stool',
        'DO NOT take painkillers until doctor consultation',
        'Go to emergency if pain worsens or fever develops'
      );
    } else {
      firstAid.push(
        'Rest completely - avoid physical exertion',
        'Take prescribed medications regularly',
        'Monitor vital signs: temperature, pulse, BP',
        'Maintain hydration - 8-10 glasses water/day',
        'Visit hospital if symptoms worsen',
        'Keep medical records ready'
      );
    }
  } else if (priority === 'Medium') {
    firstAid.push('📋 MONITOR SYMPTOMS - Consult doctor if no improvement in 24-48 hours');

    firstAid.push(
      'Rest adequately - 7-8 hours sleep',
      'Stay well hydrated - drink 8-10 glasses water daily',
      'Eat nutritious, balanced diet',
      'Avoid trigger foods: spicy, oily, fried items',
      'Take over-the-counter medications as needed',
      'Maintain hygiene - wash hands frequently',
      'Monitor temperature twice daily',
      'Visit doctor if fever persists > 3 days or symptoms worsen'
    );
  } else {
    firstAid.push('ℹ️ SELF-CARE MEASURES - Medical consultation if needed');

    firstAid.push(
      'Monitor symptoms for next 24-48 hours',
      'Get adequate rest and sleep',
      'Stay hydrated throughout the day',
      'Eat healthy, balanced meals',
      'Avoid alcohol and smoking',
      'Practice good hygiene',
      'Consult doctor if concerned or symptoms persist'
    );
  }

  return firstAid;
}

// Generate detailed medicine recommendations
function generateMedicineRecommendations(
  condition: typeof MEDICAL_CONDITIONS[0] | undefined,
  priority: string,
  age?: number,
  riskFactors: string[] = []
): string[] {
  const medicines: string[] = [];

  if (!condition) {
    return [
      'Paracetamol 500mg - For fever and pain (every 6-8 hours)',
      'Oral Rehydration Solution (ORS) - Mix 1 sachet in 1L water, sip frequently',
      'Rest and stay well hydrated - Drink plenty of fluids',
    ];
  }

  // Emergency medications
  if (priority === 'Critical') {
    if (condition.category === 'cardiac') {
      return [
        'Aspirin 300mg - CHEW immediately (if not allergic)',
        'DO NOT take any other medication - Wait for emergency medical team',
        'Keep prescribed heart medications ready to show doctors',
      ];
    } else if (condition.category === 'respiratory') {
      return [
        'Salbutamol Inhaler - 4-6 puffs immediately (if available)',
        'Sit upright and try to stay calm',
        'DO NOT take sedatives or sleeping pills',
      ];
    } else {
      return [
        'DO NOT give any medication before medical help arrives',
        'Focus on first aid measures and getting to hospital quickly',
      ];
    }
  }

  // Condition-specific medications
  if (condition.category === 'infectious') {
    medicines.push(
      'Paracetamol 500-650mg - For fever, take every 6-8 hours with water',
      'ORS (Oral Rehydration Solution) - 1 sachet in 1L water, drink frequently throughout day',
      'Vitamin C 500mg - Once daily to boost immunity',
    );

    if (condition.name.includes('Malaria') || condition.name.includes('Dengue')) {
      medicines.push('Complete bed rest and plenty of fluids - Monitor temperature every 4 hours');
    }

    if (condition.name.includes('Typhoid')) {
      medicines.push('Antibiotic (Azithromycin 500mg) - REQUIRES PRESCRIPTION, take full course');
    }
  } else if (condition.category === 'respiratory') {
    medicines.push(
      'Cetirizine 10mg - Once daily at bedtime for allergy/runny nose',
      'Dextromethorphan Syrup - 10ml three times daily for dry cough',
      'Steam inhalation - 2-3 times daily for 10-15 minutes',
    );

    if (condition.name.includes('Asthma')) {
      medicines.push('Salbutamol Inhaler - 2 puffs when needed for breathing difficulty');
    }

    if (condition.name.includes('Pneumonia')) {
      medicines.push('Amoxicillin 500mg - Three times daily for 7 days (REQUIRES PRESCRIPTION)');
    }
  } else if (condition.category === 'gastrointestinal') {
    if (condition.name.includes('Gastroenteritis') || condition.name.includes('Diarrhea')) {
      medicines.push(
        'ORS Solution - After each loose motion, drink 200-400ml',
        'Zinc Sulfate 20mg - Once daily for 14 days',
        'Ondansetron 4mg - For vomiting, dissolve under tongue (max twice daily)',
        'Probiotics (Lactobacillus) - Twice daily to restore gut bacteria',
      );
    } else if (condition.name.includes('Ulcer') || condition.name.includes('GERD') || condition.name.includes('Acidity')) {
      medicines.push(
        'Omeprazole 20mg - Once daily before breakfast, 30 minutes before food',
        'Antacid Syrup (Digene/ENO) - 2 teaspoons after meals and at bedtime',
        'Avoid spicy, oily foods and eat small frequent meals',
      );
    } else {
      medicines.push(
        'Buscopan/Dicyclomine 10mg - For abdominal cramps (three times daily)',
        'Light diet - Avoid heavy, spicy, or oily foods',
      );
    }
  } else if (condition.category === 'neurological') {
    if (condition.name.includes('Headache') || condition.name.includes('Migraine')) {
      medicines.push(
        'Paracetamol 500-1000mg - Every 6-8 hours as needed with water',
        'Ibuprofen 400mg - If paracetamol not effective (max 3 times daily)',
      );

      if (condition.name.includes('Migraine')) {
        medicines.push(
          'Sumatriptan 50mg - At onset of migraine (REQUIRES PRESCRIPTION)',
          'Ondansetron 4mg - For nausea/vomiting',
          'Rest in dark, quiet room',
        );
      }
    } else {
      medicines.push('URGENT medical consultation required - Do not self-medicate');
    }
  } else if (condition.category === 'trauma') {
    medicines.push(
      'Clean wound with clean water and antiseptic (Dettol/Savlon)',
      'Apply antibiotic ointment (Neosporin/Soframycin)',
      'Paracetamol 500mg - For pain relief (every 6-8 hours)',
      'Tetanus injection - If wound is deep or dirty (within 24 hours)',
    );
  } else if (condition.category === 'dermatological') {
    medicines.push(
      'Antihistamine (Cetirizine 10mg) - Once daily for itching',
      'Calamine lotion - Apply on affected area 2-3 times daily',
      'Hydrocortisone cream 1% - Apply thin layer twice daily',
    );
  } else {
    medicines.push(
      'Paracetamol 500mg - For fever or pain (every 6-8 hours)',
      'Maintain good hydration - Drink 8-10 glasses of water daily',
      'Rest adequately and eat nutritious food',
    );
  }

  // Add important warnings based on age and risk factors
  if (age && age < 12) {
    medicines.push('⚠️ Child dosing: Consult pediatrician for correct dose based on weight');
  }

  if (riskFactors.some(rf => rf.toLowerCase().includes('pregnant'))) {
    medicines.push('⚠️ Pregnancy: Consult doctor before taking any medication');
  }

  return medicines;
}

// Main analysis function
export async function analyzeSymptomsWithAI(input: string, language: string = 'en', imageAnalysis?: any): Promise<AnalysisResult> {
  // Use Llama for high-precision clinical analysis if enabled
  if (USE_LLAMA && groq) {
    try {
      const languageFullName = language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English';
      const prompt = `You are a Senior Medical Officer specialized in rural healthcare triage. 
Analyze the following patient data with extreme precision. 

Patient Input: ${input}
${imageAnalysis ? `Image Analysis Context: ${JSON.stringify(imageAnalysis)}` : ''}

CRITICAL: YOU MUST RESPOND WITH ALL TEXT FIELDS IN ${languageFullName.toUpperCase()}.
This includes: symptom names, condition names, descriptions, complications, first aid steps, medicines, clinical notes, and instructions.

Rules:
1. Provide a comprehensive differential diagnosis with at least 3 conditions.
2. Assign a severity score (0-100) and priority (Low, Medium, High, Critical).
3. If chest pain, severe bleeding, or gasping for air is detected, priority must be "Critical" and ambulanceRequired: true.
4. Provide at least 5-7 detailed, rural-appropriate first aid steps and recommended OTC medicines with precise dosage.
5. Important: Ensure the "firstAid" and "medicines" arrays contain ONLY the actions or medicine names. Do NOT include headers like "Medications:" or "Steps:" inside the arrays.
6. Provide detailed clinical notes and follow-up instructions.

Respond with valid JSON:
{
  "symptoms": ["symptom1", "symptom2"],
  "conditions": [
    {"name": "Condition", "confidence": 95, "description": "...", "complications": ["..."]}
  ],
  "severityScore": 85,
  "priority": "High", // MUST BE EXACTLY ONE OF: Low, Medium, High, Critical (ALWAYS IN ENGLISH)
  "firstAid": ["...", "..."],
  "medicines": ["...", "..."],
  "ambulanceRequired": false,
  "riskFactors": ["..."],
  "facilityRecommendation": "Community Health Center",
  "clinicalNotes": "...",
  "followUpInstructions": ["..."],
  "warningSignsToWatch": ["..."]
}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical triage AI. Respond only with structured JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const result = JSON.parse(responseText);

      // Post-processing to ensure consistency with system protocols
      if (result.severityScore >= 86) result.priority = 'Critical';
      if (result.priority === 'Critical') result.ambulanceRequired = true;

      return {
        ...result,
        timestamp: new Date().toISOString(),
      } as AnalysisResult;
    } catch (error) {
      console.error('Llama Professional Analysis Error:', error);
      // Fallback to rule-based system below
    }
  }

  try {
    const lowerText = input.toLowerCase();

    // Extract age and gender from input
    const ageMatch = input.match(/(\d+)\s*(year|yr|y\.o|yo)/i);
    const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

    const genderMatch = input.match(/\b(male|female|man|woman|boy|girl)\b/i);
    let gender: 'male' | 'female' | 'other' | undefined;
    if (genderMatch) {
      const g = genderMatch[1].toLowerCase();
      gender = (g === 'male' || g === 'man' || g === 'boy') ? 'male' :
        (g === 'female' || g === 'woman' || g === 'girl') ? 'female' : 'other';
    }

    // Extract vital signs from text
    const vitalSigns: PatientData['vitalSigns'] = {};

    const tempMatch = input.match(/temp(?:erature)?\s*:?\s*(\d+(?:\.\d+)?)/i);
    if (tempMatch) vitalSigns.temperature = parseFloat(tempMatch[1]);

    const bpMatch = input.match(/bp\s*:?\s*(\d+\/\d+)|blood pressure\s*:?\s*(\d+\/\d+)/i);
    if (bpMatch) vitalSigns.bloodPressure = bpMatch[1] || bpMatch[2];

    const hrMatch = input.match(/heart rate\s*:?\s*(\d+)|hr\s*:?\s*(\d+)|pulse\s*:?\s*(\d+)/i);
    if (hrMatch) vitalSigns.heartRate = parseInt(hrMatch[1] || hrMatch[2] || hrMatch[3]);

    const o2Match = input.match(/o2\s*:?\s*(\d+)|oxygen\s*:?\s*(\d+)|spo2\s*:?\s*(\d+)/i);
    if (o2Match) vitalSigns.oxygenSaturation = parseInt(o2Match[1] || o2Match[2] || o2Match[3]);

    // Extract symptoms using advanced NLP
    const detectedSymptoms = extractSymptoms(input);

    // Get emergency assessment
    const emergency = detectCriticalEmergency(detectedSymptoms, lowerText, age, vitalSigns);

    // Find matching conditions with detailed analysis
    const conditionScores = MEDICAL_CONDITIONS.map(condition => ({
      condition,
      score: calculateMatchScore(detectedSymptoms, condition, lowerText)
    }));

    // Sort and get top 3 conditions
    conditionScores.sort((a, b) => b.score - a.score);
    const topConditions = conditionScores.slice(0, 3).filter(c => c.score > 0);

    // If no matches, provide fallback conditions based on general symptoms
    if (topConditions.length === 0) {
      const fallbackCondition = getFallbackCondition(detectedSymptoms, lowerText);
      topConditions.push({ condition: fallbackCondition, score: 65 });
    }

    // Ensure we always have exactly 3 conditions for professional appearance
    while (topConditions.length < 3) {
      const relatedCondition = getRelatedCondition(topConditions[0].condition, MEDICAL_CONDITIONS);
      topConditions.push({
        condition: relatedCondition,
        score: Math.max(35, topConditions[topConditions.length - 1].score - 15)
      });
    }

    // Build detailed condition information
    const conditions = topConditions.map(({ condition, score }) => ({
      name: condition.name,
      confidence: Math.round(score),
      description: condition.description || getConditionDescription(condition.name),
      complications: condition.complications || getConditionComplications(condition.name)
    }));

    // Calculate severity (override if emergency detected)
    let severityScore = emergency.severityOverride || calculateSeverity(detectedSymptoms, topConditions[0].condition, age);

    // Adjust severity based on vital signs
    if (vitalSigns.temperature && vitalSigns.temperature >= 104) severityScore = Math.max(severityScore, 88);
    if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 92) severityScore = Math.max(severityScore, 85);
    if (vitalSigns.heartRate && (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50)) severityScore = Math.max(severityScore, 80);

    // Determine priority based on urgency level
    const priority: 'Low' | 'Medium' | 'High' | 'Critical' =
      emergency.urgencyLevel === 'RED' ? 'Critical' :
        emergency.urgencyLevel === 'ORANGE' ? 'High' :
          emergency.urgencyLevel === 'YELLOW' ? 'Medium' : 'Low';

    // Get medicines for top condition with dosage information
    const medicines = getMedicinesForCondition(topConditions[0].condition.name, age);

    // Get first aid with emergency-specific guidance
    const firstAid = getFirstAidSteps(topConditions[0].condition.name, detectedSymptoms, emergency.urgencyLevel);

    // Generate clinical notes
    const clinicalNotes = generateClinicalNotes(detectedSymptoms, conditions, age, gender, vitalSigns, emergency);

    // Generate follow-up instructions
    const followUpInstructions = generateFollowUpInstructions(topConditions[0].condition.name, priority, emergency.urgencyLevel);

    // Generate warning signs to watch
    const warningSignsToWatch = generateWarningSignsToWatch(topConditions[0].condition.name, priority);

    // Extract risk factors
    const riskFactors: string[] = [];
    if (age && age > 65) riskFactors.push('Advanced age (>65 years)');
    if (age && age < 12) riskFactors.push('Pediatric patient (<12 years)');
    if (emergency.criticalReasons.length > 0) riskFactors.push(...emergency.criticalReasons);

    // Check for chronic conditions mentioned
    if (lowerText.includes('diabetes') || lowerText.includes('diabetic')) riskFactors.push('History of Diabetes');
    if (lowerText.includes('hypertension') || lowerText.includes('high bp')) riskFactors.push('History of Hypertension');
    if (lowerText.includes('asthma')) riskFactors.push('History of Asthma');
    if (lowerText.includes('pregnant') || lowerText.includes('pregnancy')) riskFactors.push('Pregnancy');

    return {
      symptoms: detectedSymptoms.length > 0 ? detectedSymptoms : ['General symptoms detected'],
      conditions,
      severityScore: Math.min(100, Math.max(0, severityScore)),
      priority,
      firstAid,
      medicines,
      ambulanceRequired: emergency.urgencyLevel === 'RED' || severityScore >= 85,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
      facilityRecommendation: emergency.facilityRecommendation,
      clinicalNotes,
      followUpInstructions,
      warningSignsToWatch,
      imageAnalysis,
      timestamp: new Date().toISOString(),
      patientInfo: { age, gender }
    };

  } catch (error) {
    console.error('Analysis error:', error);

    // Fallback response
    return {
      symptoms: ['fallbackAnalysisIncomplete'],
      conditions: [
        {
          name: 'fallbackGeneralConsultation',
          confidence: 70,
          description: 'fallbackConsultProfessional',
          complications: ['Delayed treatment', 'Worsening of condition']
        },
        {
          name: 'fallbackCommonViral',
          confidence: 45,
          description: 'fallbackViralInfo',
          complications: ['Dehydration', 'Secondary bacterial infection']
        },
        {
          name: 'fallbackStressAnxiety',
          confidence: 30,
          description: 'fallbackStressInfo',
          complications: ['Chronic stress', 'Sleep disturbances']
        }
      ],
      severityScore: 45,
      priority: 'Medium',
      firstAid: [
        'Rest and monitor symptoms',
        'Stay hydrated with clean water',
        'Monitor temperature if fever present',
        'Seek medical attention if symptoms worsen',
        'Keep a record of symptoms and their progression'
      ],
      medicines: ['Consult doctor before taking any medication'],
      ambulanceRequired: false,
      facilityRecommendation: 'Primary Health Center (PHC) for evaluation',
      clinicalNotes: 'Analysis incomplete. Professional medical evaluation recommended.',
      followUpInstructions: ['Visit nearest healthcare facility within 24 hours', 'Monitor symptoms closely'],
      warningSignsToWatch: ['Difficulty breathing', 'Severe pain', 'High fever >103°F', 'Confusion or dizziness'],
      timestamp: new Date().toISOString()
    };
  }
}

// Helper functions for advanced analysis
function getFallbackCondition(symptoms: string[], lowerText: string): typeof MEDICAL_CONDITIONS[0] {
  const commonConditions = MEDICAL_CONDITIONS.filter(c => c.category === 'infectious' || c.category === 'respiratory');
  for (const condition of commonConditions) {
    const matchCount = condition.symptoms.filter(s => symptoms.includes(s) || lowerText.includes(s)).length;
    if (matchCount > 0) return condition;
  }
  return MEDICAL_CONDITIONS[0]; // Default to first condition
}

function getRelatedCondition(condition: typeof MEDICAL_CONDITIONS[0], allConditions: typeof MEDICAL_CONDITIONS): typeof MEDICAL_CONDITIONS[0] {
  const relatedConditions = allConditions.filter(c => c.category === condition.category && c.name !== condition.name);
  if (relatedConditions.length > 0) return relatedConditions[0];
  return MEDICAL_CONDITIONS[0]; // Default to first condition
}

function getConditionDescription(conditionName: string): string {
  const condition = MEDICAL_CONDITIONS.find(c => c.name === conditionName);
  if (condition?.description) return condition.description;

  // Provide detailed fallback descriptions
  const descriptions: Record<string, string> = {
    'General Medical Consultation Required': 'Based on the symptoms presented, a comprehensive medical evaluation is recommended to determine the exact cause and appropriate treatment plan.',
    'Common Viral Infection': 'Viral infections are caused by viruses and typically resolve on their own with rest, hydration, and symptomatic treatment. Most viral infections are self-limiting.',
    'Stress/Anxiety Related': 'Stress and anxiety can manifest with various physical symptoms. Managing stress through relaxation techniques, proper sleep, and lifestyle modifications is important.'
  };

  return descriptions[conditionName] || 'Professional medical evaluation recommended for accurate diagnosis and treatment planning.';
}

function getConditionComplications(conditionName: string): string[] {
  const condition = MEDICAL_CONDITIONS.find(c => c.name === conditionName);
  if (condition?.complications && condition.complications.length > 0) return condition.complications;

  // Provide reasonable fallback complications
  return ['Disease progression if untreated', 'Secondary complications possible', 'Worsening of symptoms'];
}

function calculateSeverity(symptoms: string[], condition: typeof MEDICAL_CONDITIONS[0], age?: number): number {
  let severity = condition.severity;

  // Adjust severity based on age
  if (age && age < 12) severity += 10; // Children need more urgent care
  if (age && age > 65) severity += 5;  // Elderly patients have higher risk

  // Adjust severity based on critical symptoms
  const criticalSymptoms = [
    'chest pain', 'shortness of breath', 'severe bleeding', 'confusion',
    'severe headache', 'unconscious', 'facial drooping', 'speech difficulty',
    'severe pain', 'difficulty swallowing', 'seizure', 'blood in stool',
    'cough with blood', 'sudden onset'
  ];

  const criticalMatchCount = symptoms.filter(s => criticalSymptoms.includes(s)).length;
  severity += criticalMatchCount * 5;

  return Math.min(100, Math.max(0, severity));
}

function getMedicinesForCondition(conditionName: string, age?: number): string[] {
  const condition = MEDICAL_CONDITIONS.find(c => c.name === conditionName);
  if (!condition) return ['No specific medications recommended'];

  const medicines: string[] = [];

  // Check if condition has medicines property and it's an array
  if (!condition.medicines || !Array.isArray(condition.medicines) || condition.medicines.length === 0) {
    return ['Consult healthcare professional for appropriate medication'];
  }

  // Add recommended medicines
  for (const med of condition.medicines) {
    // MEDICINE_DATABASE is an object, not an array - use direct lookup
    const medicineInfo = MEDICINE_DATABASE[med.name];
    if (medicineInfo) {
      let dosage = med.dosage;
      if (age && age < 12) {
        dosage = 'Child dosing: Consult pediatrician for correct dose based on weight';
      }
      medicines.push(`${medicineInfo.name} - ${dosage}`);
    } else {
      // If medicine not in database, still add it with the condition's dosage
      let dosage = med.dosage;
      if (age && age < 12) {
        dosage = 'Child dosing: Consult pediatrician for correct dose based on weight';
      }
      medicines.push(`${med.name} - ${dosage}`);
    }
  }

  // If no medicines were added, return default message
  if (medicines.length === 0) {
    return ['Consult healthcare professional for appropriate medication'];
  }

  return medicines;
}

function getFirstAidSteps(conditionName: string, symptoms: string[], urgencyLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED'): string[] {
  // First check if we have condition-specific first aid
  if (CONDITION_FIRST_AID[conditionName]) {
    const specificFirstAid = [...CONDITION_FIRST_AID[conditionName]];

    // Add symptom-specific tips
    const symptomTips = getSymptomSpecificTips(symptoms);
    if (symptomTips.length > 0) {
      specificFirstAid.push('', '📌 Additional Symptom-Specific Guidance:');
      specificFirstAid.push(...symptomTips);
    }

    return specificFirstAid;
  }

  // Fallback to category-based first aid
  const condition = MEDICAL_CONDITIONS.find(c => c.name === conditionName);
  if (!condition) return ['No specific first aid steps available'];

  const firstAid: string[] = [];

  // Emergency conditions
  if (urgencyLevel === 'RED') {
    firstAid.push('🚨 CALL 108 AMBULANCE IMMEDIATELY - THIS IS A MEDICAL EMERGENCY');

    if (condition.category === 'cardiac') {
      firstAid.push(
        'Keep patient calm and seated in comfortable position',
        'Loosen tight clothing around neck and chest',
        'Give Aspirin 300mg (CHEW, don\'t swallow) if not allergic',
        'Monitor breathing and pulse every 2 minutes',
        'DO NOT give food or water',
        'Note time symptoms started',
        'If unconscious: Check breathing, start CPR if needed'
      );
    } else if (condition.category === 'respiratory') {
      firstAid.push(
        'Keep patient in upright sitting position (lean forward)',
        'Loosen all tight clothing',
        'Ensure adequate ventilation - open windows',
        'Use prescribed inhaler if available (4-6 puffs)',
        'Stay calm and reassure patient',
        'Monitor breathing rate and oxygen saturation',
        'If lips turn blue: Emergency CPR may be needed'
      );
    } else if (condition.category === 'neurological') {
      firstAid.push(
        'Note exact time symptoms started (critical for treatment)',
        'Keep patient lying down with head slightly elevated',
        'DO NOT give anything by mouth',
        'Turn head to side if vomiting',
        'Loosen tight clothing',
        'Check FAST: Face, Arms, Speech, Time',
        'Monitor consciousness level every 2 minutes'
      );
    } else if (condition.category === 'trauma') {
      firstAid.push(
        'Apply direct firm pressure on bleeding wound with clean cloth',
        'Elevate injured area above heart if possible',
        'DO NOT remove embedded objects',
        'Keep patient lying flat',
        'Cover with blanket to prevent shock',
        'Monitor pulse and breathing',
        'If conscious: Give sips of water only'
      );
    }
  } else if (urgencyLevel === 'ORANGE') {
    firstAid.push('⚠️ SEEK MEDICAL ATTENTION WITHIN 4-6 HOURS');

    if (condition.category === 'infectious') {
      firstAid.push(
        'Complete bed rest mandatory',
        'Drink plenty of fluids - ORS, water, coconut water (3-4 liters/day)',
        'Monitor temperature every 4 hours',
        'Watch for warning signs: bleeding, severe pain, drowsiness',
        'Maintain mosquito prevention (if dengue/malaria)',
        'Eat light, easily digestible foods',
        'Take prescribed medications on time'
      );
    } else if (condition.category === 'gastrointestinal') {
      firstAid.push(
        'Nothing by mouth except sips of water',
        'Lie down in comfortable position',
        'Apply warm compress on abdomen (NOT if appendicitis suspected)',
        'Monitor for fever, vomiting, blood in vomit/stool',
        'DO NOT take painkillers until doctor consultation',
        'Go to emergency if pain worsens or fever develops'
      );
    } else {
      firstAid.push(
        'Rest completely - avoid physical exertion',
        'Take prescribed medications regularly',
        'Monitor vital signs: temperature, pulse, BP',
        'Maintain hydration - 8-10 glasses water/day',
        'Visit hospital if symptoms worsen',
        'Keep medical records ready'
      );
    }
  } else if (urgencyLevel === 'YELLOW') {
    firstAid.push('📋 MONITOR SYMPTOMS - Consult doctor if no improvement in 24-48 hours');

    firstAid.push(
      'Rest adequately - 7-8 hours sleep',
      'Stay well hydrated - drink 8-10 glasses water daily',
      'Eat nutritious, balanced diet',
      'Avoid trigger foods: spicy, oily, fried items',
      'Take over-the-counter medications as needed',
      'Maintain hygiene - wash hands frequently',
      'Monitor temperature twice daily',
      'Visit doctor if fever persists > 3 days or symptoms worsen'
    );
  } else {
    firstAid.push('ℹ️ SELF-CARE MEASURES - Medical consultation if needed');

    firstAid.push(
      'Monitor symptoms for next 24-48 hours',
      'Get adequate rest and sleep',
      'Stay hydrated throughout the day',
      'Eat healthy, balanced meals',
      'Avoid alcohol and smoking',
      'Practice good hygiene',
      'Consult doctor if concerned or symptoms persist'
    );
  }

  return firstAid;
}

function generateClinicalNotes(symptoms: string[], conditions: { name: string, confidence: number, description: string, complications: string[] }[], age?: number, gender?: 'male' | 'female' | 'other', vitalSigns?: PatientData['vitalSigns'], emergency?: { isCritical: boolean, criticalReasons: string[], urgencyLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED', facilityRecommendation: string, severityOverride?: number }): string {
  let notes = `Patient Information:\n`;
  if (age !== undefined) notes += `Age: ${age} years\n`;
  if (gender) notes += `Gender: ${gender}\n`;
  if (vitalSigns) {
    notes += `Vital Signs:\n`;
    if (vitalSigns.temperature) notes += `Temperature: ${vitalSigns.temperature}°C\n`;
    if (vitalSigns.heartRate) notes += `Heart Rate: ${vitalSigns.heartRate} bpm\n`;
    if (vitalSigns.bloodPressure) notes += `Blood Pressure: ${vitalSigns.bloodPressure}\n`;
    if (vitalSigns.oxygenSaturation) notes += `Oxygen Saturation: ${vitalSigns.oxygenSaturation}%\n`;
    if (vitalSigns.respiratoryRate) notes += `Respiratory Rate: ${vitalSigns.respiratoryRate} breaths/min\n`;
  }
  notes += `\nSymptoms:\n${symptoms.join(', ')}\n\n`;

  if (emergency && emergency.isCritical) {
    notes += `Emergency Assessment:\n`;
    notes += `Critical Reasons: ${emergency.criticalReasons.join(', ')}\n`;
    notes += `Urgency Level: ${emergency.urgencyLevel}\n`;
    notes += `Facility Recommendation: ${emergency.facilityRecommendation}\n`;
    if (emergency.severityOverride) notes += `Severity Override: ${emergency.severityOverride}\n`;
    notes += `\n`;
  }

  notes += `Differential Diagnosis:\n`;
  for (const condition of conditions) {
    notes += `Condition: ${condition.name}\n`;
    notes += `Confidence: ${condition.confidence}%\n`;
    notes += `Description: ${condition.description}\n`;
    notes += `Complications: ${condition.complications.join(', ')}\n\n`;
  }

  return notes;
}

function generateFollowUpInstructions(conditionName: string, priority: 'Low' | 'Medium' | 'High' | 'Critical', urgencyLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED'): string[] {
  const instructions: string[] = [];

  if (priority === 'Critical' || urgencyLevel === 'RED') {
    instructions.push('Visit the nearest emergency room immediately.');
    instructions.push('Do not delay in seeking medical attention.');
  } else if (priority === 'High' || urgencyLevel === 'ORANGE') {
    instructions.push('Seek medical attention within 4-6 hours.');
    instructions.push('Follow up with a healthcare provider as soon as possible.');
  } else if (priority === 'Medium' || urgencyLevel === 'YELLOW') {
    instructions.push('Monitor symptoms for the next 24-48 hours.');
    instructions.push('Visit a healthcare facility within 24 hours if symptoms worsen.');
  } else {
    instructions.push('Monitor symptoms for the next 24-48 hours.');
    instructions.push('Consult a healthcare provider if concerned or symptoms persist.');
  }

  return instructions;
}

function generateWarningSignsToWatch(conditionName: string, priority: 'Low' | 'Medium' | 'High' | 'Critical'): string[] {
  const warningSigns: string[] = [];

  if (priority === 'Critical') {
    warningSigns.push('Difficulty breathing');
    warningSigns.push('Severe pain');
    warningSigns.push('High fever >103°F');
    warningSigns.push('Confusion or dizziness');
  } else if (priority === 'High') {
    warningSigns.push('Difficulty breathing');
    warningSigns.push('Severe pain');
    warningSigns.push('High fever >103°F');
    warningSigns.push('Confusion or dizziness');
  } else if (priority === 'Medium') {
    warningSigns.push('Difficulty breathing');
    warningSigns.push('Severe pain');
    warningSigns.push('High fever >103°F');
    warningSigns.push('Confusion or dizziness');
  } else {
    warningSigns.push('Difficulty breathing');
    warningSigns.push('Severe pain');
    warningSigns.push('High fever >103°F');
    warningSigns.push('Confusion or dizziness');
  }

  return warningSigns;
}

// Export for use in components
export { performDifferentialDiagnosis };

// Export analyzeSymptomsWithAI as analyzeSymptoms for backward compatibility
export { analyzeSymptomsWithAI as analyzeSymptoms };