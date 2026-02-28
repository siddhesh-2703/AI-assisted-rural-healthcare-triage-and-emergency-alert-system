/**
 * SYMPTOM TRANSLATION SERVICE
 * Translates Hindi and Tamil symptoms to English for accurate medical diagnosis
 */

export interface SymptomTranslation {
  original: string;
  english: string;
  language: 'hi' | 'ta' | 'en';
}

/**
 * Comprehensive Hindi to English symptom mapping
 */
const HINDI_SYMPTOM_MAP: Record<string, string> = {
  // Respiratory symptoms
  'खांसी': 'cough',
  'सूखी खांसी': 'dry cough',
  'बलगम': 'phlegm',
  'बलगम वाली खांसी': 'productive cough',
  'सांस लेने में कठिनाई': 'shortness of breath',
  'सांस फूलना': 'breathlessness',
  'घरघराहट': 'wheezing',
  'छाती में दर्द': 'chest pain',
  'छाती में जकड़न': 'chest tightness',

  // Fever and temperature
  'बुखार': 'fever',
  'तेज बुखार': 'high fever',
  'हल्का बुखार': 'mild fever',
  'कंपकंपी': 'chills',
  'ठंड लगना': 'feeling cold',
  'पसीना आना': 'sweating',
  'रात में पसीना': 'night sweats',

  // Headache and neurological
  'सिरदर्द': 'headache',
  'तेज सिरदर्द': 'severe headache',
  'चक्कर आना': 'dizziness',
  'घूमता हुआ महसूस': 'vertigo',
  'कमजोरी': 'weakness',
  'थकान': 'fatigue',
  'सुन्नपन': 'numbness',
  'झुनझुनी': 'tingling',
  'गर्दन में अकड़न': 'neck stiffness',
  'बेहोशी': 'unconsciousness',
  'भ्रम': 'confusion',
  'मानसिक भ्रम': 'mental confusion',

  // Gastrointestinal
  'पेट दर्द': 'stomach pain',
  'पेट में दर्द': 'abdominal pain',
  'उल्टी': 'vomiting',
  'मतली': 'nausea',
  'जी मचलाना': 'nausea',
  'दस्त': 'diarrhea',
  'लूज मोशन': 'loose motion',
  'पतले दस्त': 'watery diarrhea',
  'कब्ज': 'constipation',
  'भूख नहीं लगना': 'loss of appetite',
  'भूख में कमी': 'decreased appetite',
  'गैस': 'gas',
  'पेट फूलना': 'bloating',
  'एसिडिटी': 'acidity',
  'सीने में जलन': 'heartburn',
  'खून की उल्टी': 'vomiting blood',
  'काला मल': 'black stool',
  'खूनी मल': 'bloody stool',

  // Pain
  'दर्द': 'pain',
  'तेज दर्द': 'severe pain',
  'हल्का दर्द': 'mild pain',
  'शरीर में दर्द': 'body ache',
  'मांसपेशियों में दर्द': 'muscle pain',
  'जोड़ों में दर्द': 'joint pain',
  'हड्डी का दर्द': 'bone pain',
  'पीठ दर्द': 'back pain',

  // Throat and ENT
  'गला दर्द': 'sore throat',
  'गले में खराश': 'throat pain',
  'निगलने में कठिनाई': 'difficulty swallowing',
  'कान में दर्द': 'ear pain',
  'नाक बहना': 'runny nose',
  'नाक बंद': 'blocked nose',
  'छींक आना': 'sneezing',

  // Cardiovascular
  'दिल की धड़कन': 'palpitations',
  'दिल तेज धड़कना': 'rapid heartbeat',
  'दिल का दौरा': 'heart attack',
  'बाएं हाथ में दर्द': 'left arm pain',
  'छाती में दबाव': 'chest pressure',

  // Urinary
  'पेशाब में जलन': 'burning urination',
  'बार-बार पेशाब': 'frequent urination',
  'पेशाब में खून': 'blood in urine',
  'पेशाब करने में कठिनाई': 'difficulty urinating',
  'पेशाब रुक रुक कर': 'interrupted urination',

  // Skin
  'दाने': 'rash',
  'खुजली': 'itching',
  'त्वचा पर लाल दाग': 'red spots on skin',
  'पित्ती': 'hives',
  'सूजन': 'swelling',
  'चोट': 'injury',
  'घाव': 'wound',
  'कट': 'cut',
  'जलना': 'burn',
  'जख्म': 'sore',
  'पीलिया': 'jaundice',
  'पीली आंखें': 'yellow eyes',

  // Bleeding and trauma
  'खून बहना': 'bleeding',
  'तेज खून बहना': 'severe bleeding',
  'नाक से खून': 'nosebleed',
  'मसूड़ों से खून': 'bleeding gums',
  'नीला पड़ना': 'bruising',
  'चोट का निशान': 'bruise',
  'हड्डी टूटना': 'fracture',
  'मोच': 'sprain',
  'विकृति': 'deformity',

  // Eye symptoms
  'आंखों में दर्द': 'eye pain',
  'धुंधला दिखना': 'blurred vision',
  'दोहरी दिखना': 'double vision',
  'आंखों में लाली': 'red eyes',
  'आंखों से पानी': 'watery eyes',

  // Systemic symptoms
  'वजन कम होना': 'weight loss',
  'भूख बढ़ना': 'increased appetite',
  'प्यास अधिक लगना': 'excessive thirst',
  'पानी की कमी': 'dehydration',
  'निर्जलीकरण': 'dehydration',

  // Emergency symptoms
  'बेहोश': 'unconscious',
  'चेतना की कमी': 'loss of consciousness',
  'दौरे': 'seizures',
  'ऐंठन': 'convulsions',
  'लकवा': 'paralysis',
  'चेहरा टेढ़ा': 'facial drooping',
  'बोलने में कठिनाई': 'speech difficulty',
  'सांस रुकना': 'stopped breathing',
  'दम घुटना': 'choking',
};

/**
 * Comprehensive Tamil to English symptom mapping
 */
const TAMIL_SYMPTOM_MAP: Record<string, string> = {
  // Respiratory symptoms
  'இருமல்': 'cough',
  'உலர் இருமல்': 'dry cough',
  'சளி': 'phlegm',
  'சளியுடன் இருமல்': 'productive cough',
  'மூச்சு திணறல்': 'shortness of breath',
  'மூச்சு வாங்குதல்': 'breathlessness',
  'மூச்சு விடுவதில் சிரமம்': 'difficulty breathing',
  'விசில் ஒலி': 'wheezing',
  'மார்பு வலி': 'chest pain',
  'மார்பு இறுக்கம்': 'chest tightness',

  // Fever and temperature
  'காய்ச்சல்': 'fever',
  'அதிக காய்ச்சல்': 'high fever',
  'லேசான காய்ச்சல்': 'mild fever',
  'நடுக்கம்': 'chills',
  'குளிர்': 'feeling cold',
  'வியர்வை': 'sweating',
  'இரவு வியர்வை': 'night sweats',

  // Headache and neurological
  'தலைவலி': 'headache',
  'கடுமையான தலைவலி': 'severe headache',
  'தலைச்சுற்றல்': 'dizziness',
  'சுழல் உணர்வு': 'vertigo',
  'பலவீனம்': 'weakness',
  'சோர்வு': 'fatigue',
  'உணர்வின்மை': 'numbness',
  'கூச்ச உணர்வு': 'tingling',
  'கழுத்து விறைப்பு': 'neck stiffness',
  'மயக்கம்': 'unconsciousness',
  'குழப்பம்': 'confusion',
  'மனக் குழப்பம்': 'mental confusion',

  // Gastrointestinal
  'வயிற்று வலி': 'stomach pain',
  'வயிற்றில் வலி': 'abdominal pain',
  'வாந்தி': 'vomiting',
  'குமட்டல்': 'nausea',
  'மனம் மறுதல்': 'nausea',
  'வயிற்றுப்போக்கு': 'diarrhea',
  'தளர்வான மல���்': 'loose stool',
  'நீர்ம மலம்': 'watery stool',
  'மலச்சிக்கல்': 'constipation',
  'பசியின்மை': 'loss of appetite',
  'பசி குறைவு': 'decreased appetite',
  'வாயு': 'gas',
  'வயிறு உப்புசம்': 'bloating',
  'அமிலத்தன்மை': 'acidity',
  'நெஞ்செரிச்சல்': 'heartburn',
  'இரத்த வாந்தி': 'vomiting blood',
  'கருப்பு மலம்': 'black stool',
  'இரத்த மலம்': 'bloody stool',

  // Pain
  'வலி': 'pain',
  'கடுமையான வலி': 'severe pain',
  'லேசான வலி': 'mild pain',
  'உடல் வலி': 'body ache',
  'தசை வலி': 'muscle pain',
  'மூட்டு வலி': 'joint pain',
  'எலும்பு வலி': 'bone pain',
  'முதுகு வலி': 'back pain',

  // Throat and ENT
  'தொண்டை வலி': 'sore throat',
  'தொண்டை புண்': 'throat pain',
  'விழுங்குவதில் சிரமம்': 'difficulty swallowing',
  'காது வலி': 'ear pain',
  'மூக்கு ஒழுகுதல்': 'runny nose',
  'மூக்கு அடைப்பு': 'blocked nose',
  'தும்மல்': 'sneezing',

  // Cardiovascular
  'இதயத் துடிப்பு': 'palpitations',
  'வேகமான இதயத் துடிப்பு': 'rapid heartbeat',
  'மாரடைப்பு': 'heart attack',
  'இடது கை வலி': 'left arm pain',
  'மார்பு அழுத்தம்': 'chest pressure',

  // Urinary
  'சிறுநீர் எரிச்சல்': 'burning urination',
  'அடிக்கடி சிறுநீர்': 'frequent urination',
  'சிறுநீரில் இரத்தம்': 'blood in urine',
  'சிறுநீர் கழிப்பதில் சிரமம்': 'difficulty urinating',
  'தடைபட்ட சிறுநீர்': 'interrupted urination',

  // Skin
  'சொறி': 'rash',
  'அரிப்பு': 'itching',
  'தோலில் சிவப்பு புள்ளிகள்': 'red spots on skin',
  'படை': 'hives',
  'வீக்கம்': 'swelling',
  'காயம்': 'injury',
  'புண்': 'wound',
  'வெட்டு': 'cut',
  'தீக்காயம்': 'burn',
  'புண்கள்': 'sore',
  'மஞ்சள் காமாலை': 'jaundice',
  'மஞ்சள் கண்கள்': 'yellow eyes',

  // Bleeding and trauma
  'இரத்தப்போக்கு': 'bleeding',
  'கடுமையான இரத்தப்போ���்கு': 'severe bleeding',
  'மூக்கில் இரத்தம்': 'nosebleed',
  'ஈறுகளில் இரத்தம்': 'bleeding gums',
  'நீலம் படிதல்': 'bruising',
  'காயம் அடையாளம்': 'bruise',
  'எலும்பு முறிவு': 'fracture',
  'சுளுக்கு': 'sprain',
  'சிதைவு': 'deformity',

  // Eye symptoms
  'கண் வலி': 'eye pain',
  'மங்கலான பார்வை': 'blurred vision',
  'இரட்டை பார்வை': 'double vision',
  'சிவப்பு கண்கள்': 'red eyes',
  'கண்ணீர்': 'watery eyes',

  // Systemic symptoms
  'எடை இழப்பு': 'weight loss',
  'பசி அதிகரிப்பு': 'increased appetite',
  'அதிக தாகம்': 'excessive thirst',
  'நீர்ச்சத்து குறைபாடு': 'dehydration',

  // Emergency symptoms
  'சுயநினைவு இழப்பு': 'loss of consciousness',
  'உணர்வு இழப்பு': 'unconscious',
  'வலிப்பு': 'seizures',
  'இழுப்பு': 'convulsions',
  'பக்கவாதம்': 'paralysis',
  'முகம் தொங்குதல்': 'facial drooping',
  'பேச்சு சிரமம்': 'speech difficulty',
  'ம��ச்சு நிறுத்தம்': 'stopped breathing',
  'மூச்சு அடைப்பு': 'choking',
};

import { grok, GROK_MODEL, USE_GROK } from './aiService';

/**
 * Translate symptoms from Hindi/Tamil to English using AI
 */
export async function translateSymptoms(text: string, language: 'en' | 'hi' | 'ta'): Promise<string> {
  // If already English or empty, return as is
  if (language === 'en' || !text.trim()) {
    return text;
  }

  // Use Grok for high-fidelity medical translation
  if (USE_GROK && grok) {
    try {
      const prompt = `Translate the following medical symptoms from ${language === 'hi' ? 'Hindi' : 'Tamil'} to precise medical English. 
Refine the description for a doctor's understanding while preserving all details.

Symptoms: "${text}"

Respond with ONLY the English translation. No other text.`;

      const completion = await grok.chat.completions.create({
        model: GROK_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      const translated = completion.choices[0]?.message?.content?.trim();
      if (translated) return translated;
    } catch (error) {
      console.error('Grok Translation Error:', error);
      // Fallback to rule-based mapping
    }
  }

  // Select appropriate translation map (Fallback)
  const translationMap = language === 'hi' ? HINDI_SYMPTOM_MAP : TAMIL_SYMPTOM_MAP;

  // Convert to lowercase for matching
  let translatedText = text.toLowerCase();

  // Sort by length (longest first) to match multi-word phrases before single words
  const sortedKeys = Object.keys(translationMap).sort((a, b) => b.length - a.length);

  // Replace each symptom with English equivalent
  for (const nativeSymptom of sortedKeys) {
    const englishSymptom = translationMap[nativeSymptom];
    const regex = new RegExp(nativeSymptom, 'gi');
    translatedText = translatedText.replace(regex, englishSymptom);
  }

  // Clean up extra spaces
  translatedText = translatedText.replace(/\s+/g, ' ').trim();

  return translatedText;
}

/**
 * Extract and translate symptoms with metadata
 */
export async function extractAndTranslateSymptoms(text: string, language: 'en' | 'hi' | 'ta'): Promise<SymptomTranslation> {
  const translatedText = await translateSymptoms(text, language);

  return {
    original: text,
    english: translatedText,
    language: language,
  };
}

/**
 * Check if text contains symptoms in specified language
 */
export function detectLanguageSymptoms(text: string): 'en' | 'hi' | 'ta' | 'unknown' {
  const lowerText = text.toLowerCase();

  // Check for Hindi characters
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    return 'hi';
  }

  // Check for Tamil characters
  const tamilRegex = /[\u0B80-\u0BFF]/;
  if (tamilRegex.test(text)) {
    return 'ta';
  }

  // Check for Hindi keywords in romanized form
  const hindiKeywords = ['bukhar', 'dard', 'pet', 'sir', 'khasi', 'ulti'];
  if (hindiKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'hi';
  }

  // Check for Tamil keywords in romanized form
  const tamilKeywords = ['kaichal', 'vali', 'vayiru', 'thalai', 'irumal', 'vanthi'];
  if (tamilKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'ta';
  }

  // Default to English
  return lowerText.length > 0 ? 'en' : 'unknown';
}
