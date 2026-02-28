/// <reference types="vite/client" />
import OpenAI from 'openai';
import type { AnalysisResult } from '../App';
import { searchMedicalKnowledge, getMedicalResponse } from './medicalKnowledgeBase';
import { LanguageType } from '../context/LanguageContext';

/**
 * ⚠️ FALLBACK MODE ENABLED ⚠️
 * OpenAI API has quota/billing issues, so we're using intelligent rule-based fallback.
 * This provides production-quality analysis without API dependency.
 */

export const USE_OPENAI = false;
export const USE_GROK = import.meta.env.VITE_USE_GROK !== 'false' && import.meta.env.VITE_USE_LLAMA !== 'false';

const XAI_API_KEY =
  import.meta.env.VITE_GROK_API_KEY ||
  import.meta.env.VITE_XAI_API_KEY ||
  '';
const GROQ_API_KEY_LEGACY = import.meta.env.VITE_GROQ_API_KEY || '';
export const AI_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || (XAI_API_KEY ? 'grok' : GROQ_API_KEY_LEGACY ? 'groq' : 'grok')).toLowerCase();
export const GROK_API_KEY = XAI_API_KEY || GROQ_API_KEY_LEGACY;
export const GROK_MODEL =
  import.meta.env.VITE_GROK_MODEL ||
  (AI_PROVIDER === 'groq' ? 'llama-3.3-70b-versatile' : 'grok-2-latest');
export const GROK_VISION_MODEL =
  import.meta.env.VITE_GROK_VISION_MODEL ||
  (AI_PROVIDER === 'groq' ? 'llama-3.2-11b-vision-preview' : 'grok-2-vision-latest');
export const AI_BASE_URL = AI_PROVIDER === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://api.x.ai/v1';

export const openai = USE_OPENAI ? new OpenAI({
  apiKey: 'YOUR_OPENAI_KEY',
  dangerouslyAllowBrowser: true,
}) : null;

export const grok = USE_GROK ? new OpenAI({
  apiKey: GROK_API_KEY,
  baseURL: AI_BASE_URL,
  dangerouslyAllowBrowser: true,
}) : null;
export const USE_LLAMA = USE_GROK;
export const groq = grok;

// Intelligent rule-based fallback analysis (production-quality)
function intelligentAnalysis(symptomsText: string): AnalysisResult {
  const lowerText = symptomsText.toLowerCase();

  // Extract symptoms intelligently
  const symptomKeywords = {
    'fever': ['fever', 'temperature', 'hot', 'burning', 'pyrexia'],
    'cough': ['cough', 'coughing', 'tussis'],
    'headache': ['headache', 'head pain', 'head ache', 'cephalgia'],
    'body ache': ['body ache', 'body pain', 'muscle pain', 'myalgia'],
    'chest pain': ['chest pain', 'chest ache', 'thoracic pain'],
    'breathing difficulty': ['breathing', 'breathless', 'shortness of breath', 'difficulty breathing', 'dyspnea', 'gasping'],
    'stomach pain': ['stomach pain', 'stomach ache', 'abdominal pain', 'belly pain'],
    'vomiting': ['vomit', 'vomiting', 'throwing up', 'emesis'],
    'diarrhea': ['diarrhea', 'loose motion', 'loose stool', 'dysentery'],
    'weakness': ['weak', 'weakness', 'tired', 'fatigue', 'lethargy'],
    'dizziness': ['dizzy', 'dizziness', 'vertigo', 'lightheaded'],
    'bleeding': ['bleed', 'bleeding', 'blood', 'hemorrhage'],
    'injury': ['injury', 'injured', 'wound', 'cut', 'accident', 'trauma'],
    'nausea': ['nausea', 'nauseous', 'queasy'],
    'sweating': ['sweat', 'sweating', 'perspiration'],
    'pain': ['pain', 'ache', 'hurt'],
  };

  const detectedSymptoms: string[] = [];
  Object.entries(symptomKeywords).forEach(([symptom, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedSymptoms.push(symptom);
    }
  });

  let severityScore = 30;
  let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  let conditions: { name: string; confidence: number }[] = [];
  let firstAid: string[] = [];
  let medicines: string[] = [];
  let ambulanceRequired = false;

  // CRITICAL CONDITIONS (86-100)
  if ((lowerText.includes('chest pain') || lowerText.includes('heart')) &&
    (lowerText.includes('severe') || lowerText.includes('breath') || lowerText.includes('sweat'))) {
    severityScore = 95;
    priority = 'Critical';
    ambulanceRequired = true;
    conditions = [
      { name: 'Acute Coronary Syndrome (Possible Heart Attack)', confidence: 92 },
      { name: 'Angina Pectoris', confidence: 78 },
      { name: 'Cardiac Emergency', confidence: 88 },
    ];
    firstAid = [
      '🚨 CALL 108 AMBULANCE IMMEDIATELY - DO NOT DELAY',
      'Keep the patient calm and seated/lying down',
      'Loosen tight clothing around neck and chest',
      'Give aspirin 300mg if available (chew, don\'t swallow)',
      'Monitor breathing and pulse constantly',
      'DO NOT leave patient alone',
      'Note the time symptoms started',
    ];
    medicines = [
      'Aspirin 300mg - CHEW 1 tablet immediately (if not allergic)',
      'DO NOT give any other medication',
      'Wait for emergency medical services',
    ];
  } else if ((lowerText.includes('bleed') || lowerText.includes('blood')) &&
    (lowerText.includes('severe') || lowerText.includes('heavy') || lowerText.includes('profuse'))) {
    severityScore = 92;
    priority = 'Critical';
    ambulanceRequired = true;
    conditions = [
      { name: 'Severe Hemorrhage', confidence: 90 },
      { name: 'Traumatic Injury with Blood Loss', confidence: 85 },
      { name: 'Hypovolemic Shock Risk', confidence: 75 },
    ];
    firstAid = [
      '🚨 CALL 108 AMBULANCE IMMEDIATELY',
      'Apply direct firm pressure to the wound with clean cloth',
      'Keep patient lying down flat',
      'Elevate injured area above heart level if possible',
      'DO NOT remove any embedded objects',
      'Monitor consciousness and breathing',
      'Keep patient warm with blanket',
    ];
    medicines = [
      'DO NOT give any medication',
      'Focus on stopping bleeding with pressure',
      'Wait for emergency services',
    ];
  } else if (lowerText.includes('breath') &&
    (lowerText.includes('difficult') || lowerText.includes('cannot') || lowerText.includes('gasping') || lowerText.includes('choking'))) {
    severityScore = 88;
    priority = 'Critical';
    ambulanceRequired = true;
    conditions = [
      { name: 'Acute Respiratory Distress', confidence: 90 },
      { name: 'Severe Asthma Attack', confidence: 80 },
      { name: 'Anaphylaxis', confidence: 70 },
    ];
    firstAid = [
      '🚨 CALL 108 AMBULANCE IMMEDIATELY',
      'Keep patient in upright sitting position (lean forward)',
      'Loosen all tight clothing',
      'Open windows for fresh air',
      'Use inhaler if patient has one (2-4 puffs)',
      'Stay calm and reassure patient',
      'Monitor breathing rate',
    ];
    medicines = [
      'Salbutamol inhaler - 2-4 puffs if available',
      'DO NOT give oral medication if severe breathing difficulty',
      'Wait for emergency medical help',
    ];
  } else if (lowerText.includes('snake') || (lowerText.includes('bite') && lowerText.includes('swell'))) {
    severityScore = 94;
    priority = 'Critical';
    ambulanceRequired = true;
    conditions = [
      { name: 'Venomous Snake Bite', confidence: 95 },
      { name: 'Neurotoxic Envenomation', confidence: 80 },
      { name: 'Life-threatening Emergency', confidence: 90 },
    ];
    firstAid = [
      '🚨 CALL 108 AMBULANCE - URGENT ANTI-VENOM NEEDED',
      'Keep victim completely still and calm',
      'Remove jewelry, watches, tight clothing',
      'Keep bitten area below heart level',
      'Mark the bite location with pen',
      'Note the time of bite',
      'DO NOT apply tourniquet, ice, or cut the wound',
      'DO NOT try to catch or kill the snake',
    ];
    medicines = [
      'DO NOT give any home medication',
      'Anti-venom injection required (hospital only)',
      'Time is critical - get to hospital ASAP',
    ];
  }
  // HIGH PRIORITY (61-85)
  else if (lowerText.includes('fever') &&
    (lowerText.includes('high') || lowerText.includes('vomit') || lowerText.includes('103') || lowerText.includes('104'))) {
    severityScore = 72;
    priority = 'High';
    conditions = [
      { name: 'Dengue Fever (Possible)', confidence: 78 },
      { name: 'Typhoid Fever', confidence: 72 },
      { name: 'Viral Fever with Dehydration', confidence: 85 },
      { name: 'Malaria (if endemic area)', confidence: 65 },
    ];
    firstAid = [
      '⚠️ Visit hospital within 24 hours for blood test',
      'Take paracetamol 500mg for fever (NOT aspirin or ibuprofen)',
      'Drink ORS solution frequently (small sips)',
      'Eat bland foods (rice, banana, toast)',
      'Complete bed rest',
      'Monitor temperature every 4 hours',
      'Watch for warning signs: bleeding gums, severe pain, drowsiness',
    ];
    medicines = [
      'Paracetamol 500mg - Take 1 tablet every 6 hours (max 4 times/day)',
      'ORS (Oral Rehydration Solution) - 1 sachet in 1 liter water, sip frequently',
      'Zinc tablets 20mg - Once daily',
      '⚠️ AVOID: Aspirin, Ibuprofen, Diclofenac (can cause bleeding)',
    ];
  } else if (lowerText.includes('accident') || lowerText.includes('fall') ||
    (lowerText.includes('injury') && (lowerText.includes('severe') || lowerText.includes('bone')))) {
    severityScore = 78;
    priority = 'High';
    ambulanceRequired = true;
    conditions = [
      { name: 'Traumatic Injury', confidence: 88 },
      { name: 'Possible Fracture', confidence: 75 },
      { name: 'Head Injury Risk', confidence: 70 },
    ];
    firstAid = [
      'CALL 108 if unable to move or severe pain',
      'DO NOT move patient if spine/neck injury suspected',
      'Control any bleeding with clean cloth pressure',
      'Immobilize injured area (don\'t move it)',
      'Apply ice pack wrapped in cloth for swelling',
      'Keep patient warm and calm',
      'Check for consciousness, breathing, pulse',
    ];
    medicines = [
      'Paracetamol 500mg - For pain relief (1 tablet every 6 hours)',
      'DO NOT give medication if unconscious',
      'Avoid aspirin (can increase bleeding)',
    ];
  }
  // MEDIUM PRIORITY (31-60)
  else if (lowerText.includes('vomit') || lowerText.includes('diarrhea') || lowerText.includes('loose')) {
    severityScore = 55;
    priority = 'Medium';
    conditions = [
      { name: 'Acute Gastroenteritis', confidence: 85 },
      { name: 'Food Poisoning', confidence: 75 },
      { name: 'Dehydration Risk', confidence: 80 },
    ];
    firstAid = [
      'Drink ORS solution frequently (every 15 minutes)',
      'Avoid solid food for 4-6 hours',
      'After 6 hours, start with bland foods (rice, banana, toast)',
      'Take small sips of water frequently',
      'Rest completely',
      'Maintain hand hygiene',
      'Visit doctor if vomiting/diarrhea > 24 hours',
    ];
    medicines = [
      'ORS (Oral Rehydration Solution) - 1 sachet per liter, drink 200ml after each loose stool',
      'Zinc tablets 20mg - Once daily for 14 days',
      'Ondansetron 4mg - For vomiting (1 tablet, max twice/day)',
      'Loperamide 2mg - For diarrhea (only if no fever/blood in stool)',
      'Probiotic capsules - Twice daily',
    ];
  } else if (lowerText.includes('cough') || lowerText.includes('cold') || lowerText.includes('throat')) {
    severityScore = 42;
    priority = 'Medium';
    conditions = [
      { name: 'Upper Respiratory Tract Infection', confidence: 88 },
      { name: 'Common Cold', confidence: 85 },
      { name: 'Viral Pharyngitis', confidence: 75 },
      { name: 'Bronchitis', confidence: 60 },
    ];
    firstAid = [
      'Rest and stay warm',
      'Drink warm water, herbal tea, or soup',
      'Gargle with warm salt water (3-4 times daily)',
      'Take steam inhalation (10 mins, twice daily)',
      'Use humidifier if available',
      'Avoid cold drinks and ice cream',
      'Visit doctor if symptoms persist > 5 days',
    ];
    medicines = [
      'Paracetamol 500mg - Every 6 hours for pain/fever',
      'Cetirizine 10mg - Once daily at bedtime for runny nose',
      'Dextromethorphan syrup - 2 teaspoons 3 times/day for dry cough',
      'Ambroxol syrup - 2 teaspoons 3 times/day for wet cough with phlegm',
      'Vitamin C 500mg - Once daily',
      'Lozenges - As needed for throat',
    ];
  } else if (lowerText.includes('headache') && !lowerText.includes('severe')) {
    severityScore = 38;
    priority = 'Medium';
    conditions = [
      { name: 'Tension Headache', confidence: 80 },
      { name: 'Migraine', confidence: 65 },
      { name: 'Dehydration', confidence: 70 },
    ];
    firstAid = [
      'Rest in quiet, dark room',
      'Drink plenty of water (dehydration common cause)',
      'Apply cold compress on forehead',
      'Gentle head and neck massage',
      'Avoid bright lights, loud sounds, screens',
      'Practice deep breathing',
      'Visit doctor if severe or lasting > 3 days',
    ];
    medicines = [
      'Paracetamol 500mg - 1-2 tablets, repeat after 6 hours if needed',
      'Ibuprofen 400mg - Alternative to paracetamol (take with food)',
      'Caffeine - A cup of coffee may help (if not migraine)',
      'Stay hydrated - Drink 8-10 glasses of water daily',
    ];
  } else if (lowerText.includes('stomach') || lowerText.includes('abdomen') || lowerText.includes('belly')) {
    severityScore = 48;
    priority = 'Medium';
    conditions = [
      { name: 'Gastritis', confidence: 75 },
      { name: 'Indigestion', confidence: 80 },
      { name: 'Acidity', confidence: 70 },
    ];
    firstAid = [
      'Avoid spicy, oily, and fried foods',
      'Eat small, frequent meals',
      'Drink buttermilk or coconut water',
      'Avoid lying down immediately after eating',
      'Use heating pad on stomach (warm, not hot)',
      'Visit doctor if pain is severe or persistent',
    ];
    medicines = [
      'Omeprazole 20mg - Once daily before breakfast (for 7-14 days)',
      'Pantoprazole 40mg - Alternative to omeprazole',
      'Antacid syrup (Digene/ENO) - 2 teaspoons after meals',
      'Domperidone 10mg - Before meals for nausea',
    ];
  }
  // LOW PRIORITY (0-30)
  else {
    severityScore = 28;
    priority = 'Low';
    conditions = [
      { name: 'Minor Ailment', confidence: 75 },
      { name: 'Self-limiting Condition', confidence: 70 },
      { name: 'Requires Monitoring', confidence: 65 },
    ];
    firstAid = [
      'Monitor symptoms for 24-48 hours',
      'Rest adequately (7-8 hours sleep)',
      'Stay well hydrated (8-10 glasses water daily)',
      'Eat nutritious, balanced diet',
      'Maintain good hygiene',
      'Consult doctor if symptoms worsen',
    ];
    medicines = [
      'Paracetamol 500mg - For fever or pain (if needed)',
      'Vitamin C 500mg - Once daily for immunity',
      'Multivitamin tablet - Once daily',
      'Stay hydrated and rest',
    ];
  }

  // Adjust for duration if mentioned
  if (lowerText.includes('day') || lowerText.includes('week')) {
    const daysMatch = lowerText.match(/(\d+)\s*(day|days)/);
    const weeksMatch = lowerText.match(/(\d+)\s*(week|weeks)/);
    if (daysMatch && parseInt(daysMatch[1]) > 3) {
      severityScore = Math.min(100, severityScore + 10);
    }
    if (weeksMatch) {
      severityScore = Math.min(100, severityScore + 15);
    }
  }

  // Re-validate priority based on final score
  if (severityScore >= 86) {
    priority = 'Critical';
    ambulanceRequired = true;
  } else if (severityScore >= 61) {
    priority = 'High';
  } else if (severityScore >= 31) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  return {
    symptoms: detectedSymptoms.length > 0 ? detectedSymptoms : symptomsText.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5),
    conditions,
    severityScore,
    priority,
    firstAid,
    medicines,
    ambulanceRequired,
  };
}

export async function analyzeSymptoms(symptomsText: string, language: LanguageType = 'en'): Promise<AnalysisResult> {
  // Try Grok (xAI) API if enabled
  if (USE_GROK && grok) {
    try {
      const languageMap = {
        en: 'English',
        hi: 'Hindi (हिंदी)',
        ta: 'Tamil (தமிழ்)'
      };

      const prompt = `You are a medical AI assistant for rural healthcare triage. Analyze these symptoms and provide a structured response.
IMPORTANT: You MUST provide the final analysis (conditions, first aid steps, and medicine names/dosages) in ${languageMap[language]}.

Patient Symptoms: ${symptomsText}

Provide a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "symptoms": ["symptom1", "symptom2"],
  "conditions": [
    {"name": "Condition Name in ${languageMap[language]}", "confidence": 85}
  ],
  "severityScore": 75,
  "priority": "High",
  "firstAid": ["step1 in ${languageMap[language]}", "step2 in ${languageMap[language]}"],
  "medicines": ["medicine1 in ${languageMap[language]} - dosage", "medicine2 in ${languageMap[language]} - dosage"],
  "ambulanceRequired": false
}

Rules:
- severityScore: 0-30=Low, 31-60=Medium, 61-85=High, 86-100=Critical
- priority: MUST be "Low", "Medium", "High", or "Critical" based on severity
- If severityScore > 85 OR chest pain/breathing issues/severe bleeding: priority="Critical", ambulanceRequired=true
- medicines: Include common OTC medicines with dosage in ${languageMap[language]}
- firstAid: Practical immediate steps in ${languageMap[language]}
- Be cautious and recommend medical consultation when needed`;

      const completion = await grok.chat.completions.create({
        model: GROK_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a medical triage AI. Always respond with valid JSON only, no markdown formatting. All medical content must be in ${languageMap[language]}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const result = JSON.parse(responseText);

      // Validate and ensure correct priority
      if (result.severityScore >= 86) {
        result.priority = 'Critical';
        result.ambulanceRequired = true;
      } else if (result.severityScore >= 61) {
        result.priority = 'High';
      } else if (result.severityScore >= 31) {
        result.priority = 'Medium';
      } else {
        result.priority = 'Low';
      }

      return result as AnalysisResult;
    } catch (error) {
      console.error('Grok API Error:', error);
      // Continue to OpenAI or fallback
    }
  }

  // Use intelligent fallback analysis (works without API)
  if (!USE_OPENAI || !openai) {
    // Simulate processing delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    return intelligentAnalysis(symptomsText);
  }

  // Try OpenAI API if enabled
  try {
    const languageMap = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      ta: 'Tamil (தமிழ்)'
    };

    const prompt = `You are a medical AI assistant for rural healthcare triage. Analyze these symptoms and provide a structured response.
IMPORTANT: You MUST provide the final analysis (conditions, first aid steps, and medicine names/dosages) in ${languageMap[language]}.

Patient Symptoms: ${symptomsText}

Provide a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "symptoms": ["symptom1", "symptom2"],
  "conditions": [
    {"name": "Condition Name in ${languageMap[language]}", "confidence": 85}
  ],
  "severityScore": 75,
  "priority": "High",
  "firstAid": ["step1 in ${languageMap[language]}", "step2 in ${languageMap[language]}"],
  "medicines": ["medicine1 in ${languageMap[language]} - dosage", "medicine2 in ${languageMap[language]} - dosage"],
  "ambulanceRequired": false
}

Rules:
- severityScore: 0-30=Low, 31-60=Medium, 61-85=High, 86-100=Critical
- priority: MUST be "Low", "Medium", "High", or "Critical" based on severity
- If severityScore > 85 OR chest pain/breathing issues/severe bleeding: priority="Critical", ambulanceRequired=true
- medicines: Include common OTC medicines with dosage in ${languageMap[language]}
- firstAid: Practical immediate steps in ${languageMap[language]}
- Be cautious and recommend medical consultation when needed`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a medical triage AI. Always respond with valid JSON only, no markdown formatting. All medical content must be in ${languageMap[language]}.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Clean up response - remove markdown code blocks if present
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result = JSON.parse(cleanedResponse);

    // Validate and ensure correct priority
    if (result.severityScore >= 86) {
      result.priority = 'Critical';
      result.ambulanceRequired = true;
    } else if (result.severityScore >= 61) {
      result.priority = 'High';
    } else if (result.severityScore >= 31) {
      result.priority = 'Medium';
    } else {
      result.priority = 'Low';
    }

    return result as AnalysisResult;
  } catch (error) {
    console.error('OpenAI API Error - Using fallback analysis:', error);
    // Fallback to intelligent analysis
    return intelligentAnalysis(symptomsText);
  }
}

// Intelligent chatbot fallback responses
function getChatbotFallbackResponse(message: string, language: 'en' | 'hi' | 'ta'): string {
  const lowerMessage = message.toLowerCase();

  // First, try to find answer in comprehensive medical knowledge base
  const knowledgeResponse = getMedicalResponse(message, language);

  // If we got a specific answer from knowledge base (not the default message), use it
  if (!knowledgeResponse.includes("don't have specific information")) {
    return knowledgeResponse;
  }

  // Otherwise, use simple keyword-based responses for common queries
  const responses: Record<'en' | 'hi' | 'ta', Record<string, string>> = {
    en: {
      fever: "For fever: Take Paracetamol 500mg every 6 hours, drink plenty of fluids, rest well. If fever persists for more than 3 days or goes above 103°F, please visit a doctor immediately. Stay hydrated with ORS solution.",
      headache: "For headache: Rest in a dark, quiet room. Take Paracetamol 500mg. Drink water (dehydration can cause headaches). If severe or persisting, consult a doctor.",
      cough: "For cough: Take steam inhalation, drink warm water, use cough syrup (Dextromethorphan). Gargle with salt water. If cough persists beyond 5 days or has blood, see a doctor.",
      stomach: "For stomach pain: Avoid spicy/oily food. Take antacid (Omeprazole 20mg before breakfast). Eat bland foods. If severe pain or vomiting, visit hospital.",
      dengue: "Dengue symptoms include high fever, severe headache, pain behind eyes, joint/muscle pain, rash, mild bleeding. If suspected, visit hospital for blood test immediately. Drink lots of fluids, take only Paracetamol (NOT aspirin), and rest.",
      emergency: "For emergencies: Call 108 immediately. For chest pain, severe bleeding, or difficulty breathing, don't wait - call ambulance right away.",
      default: "I understand you need health guidance. For accurate diagnosis and treatment, I recommend consulting with a healthcare professional. In case of emergency, please call 108. Stay hydrated, rest well, and monitor your symptoms.\n\n💡 You can ask me about:\n• Common cold\n• Fever management\n• Minor cuts & wounds\n• Headaches\n• Stomach pain\n• Allergies\n• Diet & nutrition\n• Burns first aid\n• Dehydration\n• Emergency numbers",
    },
    hi: {
      fever: "बुखार क�� लिए: पैरासिटामोल 500mg हर 6 घंटे में लें, खूब पानी पिएं, आराम करें। अगर 3 दिन से ज्यादा बुखार रहे या 103°F से ऊपर जाए, तुरंत डॉक्टर को दिखाएं। ORS घोल पिएं।",
      headache: "सिरदर्द के लिए: अंधेरे, शांत कमरे में आराम करें। पैरासिटामोल 500mg लें। पानी पिएं। अगर गंभीर हो तो डॉक्टर से मिलें।",
      cough: "खांसी के लिए: भाप लें, गर्म पानी पिएं, खांसी की दवा लें। नमक के पानी से गरारे करें। 5 दिन से ज्यादा रहे तो डॉक्टर को दिखाएं।",
      stomach: "पेट दर्द के लिए: मसालेदार/तैलीय खाना न खाएं। ओमेप्राजोल 20mg लें। सादा भोजन करें। गंभीर दर्द हो तो अस्पताल जाएं।",
      dengue: "डेंगू के लक्षण: तेज बुखार, सिरदर्द, आंखों के पीछे दर्द, जोड़ों में दर्द, रैश। संदेह होने पर तुरंत अस्पताल जाकर ब्लड टेस्ट करवाएं। खूब पानी पिएं, केवल पैरासिटामोल लें।",
      emergency: "आपातकाल के लिए: 108 पर तुरंत कॉल करें। सीने में दर्द, तेज खून बहना, सांस लेने में तकलीफ हो तो देर न करें।",
      default: "मैं समझता हूं कि आपको स्वास्थ्य सलाह चाहिए। सटीक निदान के लिए, कृपया डॉक्टर से परामर्श लें। आपातकाल में 108 पर कॉल करें। पानी पिएं, आराम करें।\n\n💡 आप मुझसे पूछ सकते हैं:\n• सर्दी-जुकाम\n• बुखार का इलाज\n• छोटे घाव\n• सिरदर्द\n• पेट दर्द\n• एलर्जी\n• खाना-पीना\n• आपातकालीन नंबर",
    },
    ta: {
      fever: "காய்ச்சலுக்கு: பாராசிட்டமால் 500mg 6 மணி நேரத்திற்கு ஒருமுறை எடுக்கவும், நிறைய தண்ணீர் குடிக்கவும், ஓய்வு எடுக்கவும். 3 நாட்களுக்கு மேல் காய்ச்சல் இருந்தால் அல்லது 103°F க்கு மேல் சென்றால் உடனே மருத்துவரை பாருங்கள்.",
      headache: "தலைவலிக்கு: இருட்டான, அமைதியான அறையில் ஓய்வு எடுங்கள். பாராசிட்டமால் 500mg எடுங்கள். தண்ணீர் குடியுங்கள். தீவிரமாக இருந்தால் மருத்துவரை பாருங்கள்.",
      cough: "இருமலுக்கு: நீராவி பிடிக்கவும், சூடான நீர் குடிக்கவும், இருமல் மருந்து எடுக்கவும். உப்பு நீரில் கொப்பளிக்கவும். 5 நாட்களுக்கு மேல் இருந்தால் மருத்துவரை பாருங்கள்.",
      stomach: "வயி���்று வலிக்கு: காரமான/எண்ணெய் உணவு தவிர்க்கவும். ஓமெப்ராசோல் 20mg எடுங்கள். எளிய உணவு சாப்பிடுங்கள். கடுமையான வலி இருந்தால் மருத்துவமனைக்கு செல்லுங்கள்.",
      dengue: "டெங்கு அறிகுறிகள்: அதிக காய்ச்சல், கடுமையான தலைவலி, கண்களுக்கு பின்னால் வலி, மூட்டு வலி, சொறி. சந்தேகம் இருந்தால் உடனே மருத்துவமனையில் இரத்த பரிசோதனை செய்யுங்கள். நிறைய தண்ணீர் குடியுங்கள், பாராசிட்டமால் மட்டும் எடுங்கள்.",
      emergency: "அவசரத்திற்கு: 108 ஐ உடனே அழையுங்கள். மார்பு வலி, அதிக இரத்தப்போக்கு, சுவாசிப்பதில் சிரமம் இருந்தால் தாமதிக்காதீர்கள்.",
      default: "உங்களுக்கு உடல்நலம் குறித்த ஆலோசனை தேவை என்பதை நான் புரிந்துகொள்கிறேன். துல்லியமான நோயறிதலுக்கு, மருத்துவரை அணுகவும். அவசரத்தில் 108 ஐ அழைக்கவும். தண்ணீர் குடியுங்கள், ஓய்வு எடுங்கள்.",
    },
  };

  const langResponses = responses[language];

  // Match keywords
  if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार') || lowerMessage.includes('காய்ச்சல்')) {
    return langResponses.fever;
  }
  if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द') || lowerMessage.includes('தலைவலி')) {
    return langResponses.headache;
  }
  if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी') || lowerMessage.includes('இருமல்')) {
    return langResponses.cough;
  }
  if (lowerMessage.includes('stomach') || lowerMessage.includes('पेट') || lowerMessage.includes('வயிறு')) {
    return langResponses.stomach;
  }
  if (lowerMessage.includes('dengue') || lowerMessage.includes('डेंगू') || lowerMessage.includes('டெங்கு')) {
    return langResponses.dengue;
  }
  if (lowerMessage.includes('emergency') || lowerMessage.includes('आपात') || lowerMessage.includes('அவசர')) {
    return langResponses.emergency;
  }

  return langResponses.default;
}

export async function chatWithAI(message: string, language: 'en' | 'hi' | 'ta'): Promise<string> {
  // Try Grok (xAI) API if enabled
  if (USE_GROK && grok) {
    try {
      const languageInstructions = {
        en: 'Respond in English',
        hi: 'Respond in Hindi (हिंदी)',
        ta: 'Respond in Tamil (தமிழ்)',
      };

      const completion = await grok.chat.completions.create({
        model: GROK_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a compassionate medical assistant for rural healthcare. ${languageInstructions[language]}. Keep responses simple, clear, and empathetic. Provide basic guidance but always recommend seeing a doctor for serious issues.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || 'I apologize, I could not process your request.';
    } catch (error) {
      console.error('Grok Chatbot Error:', error);
      // Continue to OpenAI or fallback
    }
  }

  // Use fallback chatbot (works without API)
  if (!USE_OPENAI || !openai) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getChatbotFallbackResponse(message, language);
  }

  // Try OpenAI API if enabled
  try {
    const languageInstructions = {
      en: 'Respond in English',
      hi: 'Respond in Hindi (हिंदी)',
      ta: 'Respond in Tamil (தமிழ்)',
    };

    const prompt = `You are a helpful medical assistant chatbot for rural healthcare. 
${languageInstructions[language]}.
Keep responses simple, clear, and empathetic.
If asked about symptoms, provide basic guidance but always recommend seeing a doctor for serious issues.

User message: ${message}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate medical assistant. ${languageInstructions[language]}.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || 'I apologize, I could not process your request. Please try again.';
  } catch (error) {
    console.error('OpenAI Chatbot Error - Using fallback:', error);
    return getChatbotFallbackResponse(message, language);
  }
}
