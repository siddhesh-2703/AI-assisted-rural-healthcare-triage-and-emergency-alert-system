/**
 * CONDITION-SPECIFIC FIRST AID DATABASE
 * Accurate, tailored first aid steps for each medical condition
 */

export const CONDITION_FIRST_AID: Record<string, string[]> = {
  'Acute Myocardial Infarction (Heart Attack)': [
    '🚨 CALL 108 AMBULANCE IMMEDIATELY - Time is critical!',
    'Have patient sit down and rest in comfortable position (half-sitting recommended)',
    'Loosen tight clothing around neck, chest, and waist',
    'Give Aspirin 300mg - MUST CHEW, not swallow (unless allergic or bleeding disorder)',
    'If prescribed: Give Nitroglycerin tablet under tongue',
    'Keep patient calm - anxiety increases heart workload',
    'Monitor breathing and pulse every 2 minutes',
    'DO NOT give food, water, or other medications',
    'Note exact time symptoms started (critical for hospital treatment)',
    'If patient becomes unconscious and stops breathing: Begin CPR immediately',
    'Stay with patient until ambulance arrives'
  ],

  'Unstable Angina': [
    '⚠️ URGENT - Seek emergency care within 30 minutes',
    'Stop all physical activity immediately - complete rest',
    'Have patient sit or lie down in comfortable position',
    'Loosen tight clothing',
    'If patient has prescribed Nitroglycerin: Give 1 tablet under tongue',
    'Wait 5 minutes - if pain persists, give another tablet (max 3 tablets)',
    'If pain continues after 3 tablets: CALL 108 IMMEDIATELY',
    'Give Aspirin 300mg if available and not contraindicated',
    'Keep patient calm and reassured',
    'Monitor vital signs closely'
  ],

  'Acute Respiratory Distress Syndrome (ARDS)': [
    '🚨 CALL 108 AMBULANCE IMMEDIATELY - Critical condition',
    'Position patient sitting upright or semi-reclined (NOT lying flat)',
    'Open all windows for maximum air circulation',
    'Loosen all tight clothing immediately',
    'If oxygen available: Administer high-flow oxygen',
    'Keep patient calm - panic worsens breathing',
    'Monitor breathing rate and color of lips',
    'If lips/fingers turn blue: Prepare for emergency resuscitation',
    'DO NOT give anything by mouth',
    'Stay with patient - talk calmly to reduce anxiety'
  ],

  'Severe Asthma Attack (Status Asthmaticus)': [
    '🚨 CALL 108 IMMEDIATELY if severe difficulty breathing',
    'Keep patient in upright sitting position (leaning slightly forward)',
    'Help patient use rescue inhaler: 4-6 puffs of Salbutamol with 1 minute gaps',
    'Use spacer if available for better medication delivery',
    'Loosen tight clothing around chest and neck',
    'Ensure good ventilation - open windows',
    'Encourage slow, deep breathing',
    'Keep patient calm - speaking calmly and reassuringly',
    'If no improvement after inhaler: GO TO HOSPITAL IMMEDIATELY',
    'Avoid strong smells, smoke, or allergens',
    'Monitor breathing - if lips turn blue, call ambulance'
  ],

  'Pulmonary Embolism': [
    '🚨 CALL 108 AMBULANCE IMMEDIATELY - Life-threatening emergency',
    'Keep patient in semi-sitting position (45-degree angle)',
    'DO NOT allow patient to move or walk',
    'Loosen all tight clothing',
    'Reassure patient - anxiety worsens condition',
    'Monitor breathing rate and oxygen levels if possible',
    'If oxygen available: Administer high-flow oxygen',
    'Watch for signs of shock: pale skin, cold sweat, rapid pulse',
    'DO NOT give food or water',
    'Keep patient warm but not overheated'
  ],

  'Acute Stroke (Cerebrovascular Accident)': [
    '🚨 CALL 108 IMMEDIATELY - Every minute counts! (Golden Hour: 3-4.5 hours)',
    'Note EXACT time symptoms started - critical for treatment decisions',
    'Keep patient lying down with head slightly elevated (30 degrees)',
    'Turn head to side if vomiting to prevent choking',
    'DO NOT give anything to eat or drink (swallowing may be impaired)',
    'Loosen tight clothing',
    'Check FAST: Face drooping, Arm weakness, Speech difficulty, Time to call',
    'Monitor consciousness level every 2-3 minutes',
    'Keep patient calm and comfortable',
    'Protect from injury if seizure occurs',
    'DO NOT give aspirin until stroke type is confirmed at hospital'
  ],

  'Subarachnoid Hemorrhage': [
    '🚨 CALL 108 IMMEDIATELY - Extreme emergency',
    'Keep patient lying flat or head slightly elevated',
    'Minimize all movement - DO NOT sit patient up',
    'Keep environment quiet and dark (lights off)',
    'DO NOT give pain medications without medical supervision',
    'Monitor consciousness level constantly',
    'If vomiting: Turn head to side carefully',
    'Watch for seizures - protect from injury if they occur',
    'DO NOT give anything by mouth',
    'Keep detailed record of symptom progression'
  ],

  'Meningitis': [
    '🚨 URGENT - Go to hospital immediately',
    'Keep patient in quiet, darkened room (photophobia)',
    'DO NOT give patient neck exercises or try to bend neck',
    'Monitor temperature every 30 minutes',
    'Give paracetamol for fever (NOT aspirin in children)',
    'Keep patient hydrated with small sips of water if conscious',
    'Watch for rash - if appears, note time and spread',
    'If petechial rash (non-blanching red spots): EXTREME EMERGENCY',
    'Monitor consciousness level',
    'Isolate from others until assessed by doctor'
  ],

  'Dengue Fever': [
    '⚠️ Monitor closely - Go to hospital if warning signs appear',
    'Complete bed rest - no physical activity',
    'Drink plenty of fluids: ORS, coconut water, fruit juices (3-4 liters/day)',
    'Give Paracetamol for fever (500-1000mg every 6 hours)',
    '⚠️ NEVER give Aspirin, Ibuprofen, or Diclofenac - causes bleeding!',
    'Monitor platelet count - get blood test every day',
    'Watch for WARNING SIGNS: severe abdominal pain, persistent vomiting, bleeding',
    'Check for bleeding: gums, nose, black stools, blood in vomit',
    'Use mosquito net to prevent spreading to others',
    'Eat light, nutritious food - avoid spicy/oily items',
    'GO TO HOSPITAL if: severe pain, vomiting, bleeding, drowsiness, cold extremities'
  ],

  'Dengue Hemorrhagic Fever': [
    '🚨 CALL 108 IMMEDIATELY - Life-threatening complication',
    'Keep patient lying down - minimize movement',
    'Continuous monitoring of vital signs',
    'DO NOT give any pain medication except paracetamol',
    'Watch for signs of shock: cold extremities, weak pulse, low BP',
    'If bleeding occurs: Apply gentle pressure with clean cloth',
    'Keep patient warm with blankets',
    'Small sips of ORS/water only if conscious',
    'Urgent hospitalization for IV fluids and platelet transfusion required'
  ],

  'Typhoid Fever': [
    '⚠️ Seek medical attention within 24 hours',
    'Complete bed rest mandatory',
    'Drink plenty of fluids - ORS, boiled water, coconut water',
    'Give paracetamol for fever',
    'Eat only easily digestible foods: porridge, khichdi, banana, curd',
    'Avoid spicy, oily, and raw foods',
    'Maintain strict hygiene - wash hands after toilet',
    'Monitor temperature 3 times daily',
    'Complete full antibiotic course even if feeling better',
    'Watch for complications: severe abdominal pain, blood in stool'
  ],

  'Malaria': [
    '⚠️ Start treatment within 24 hours - Go to hospital',
    'Rest completely during fever episodes',
    'Drink plenty of fluids during chills and fever',
    'Give paracetamol for fever and body ache',
    'Keep patient warm during chills phase',
    'Cool with wet cloth during high fever phase (NOT cold bath)',
    'Take antimalarial medication as prescribed - complete full course',
    'Use mosquito nets to prevent further bites',
    'Monitor for severe malaria signs: confusion, seizures, difficulty breathing',
    'If severe symptoms: EMERGENCY HOSPITALIZATION required'
  ],

  'COVID-19': [
    '📋 Isolate immediately - Monitor oxygen levels',
    'Complete home isolation for 10 days',
    'Monitor oxygen saturation with pulse oximeter 3 times daily',
    'If SpO2 < 94%: GO TO HOSPITAL IMMEDIATELY',
    'Lie in prone position (on stomach) for 30 min, 4-5 times daily',
    'Drink warm water frequently - 2-3 liters daily',
    'Steam inhalation 2-3 times daily',
    'Give paracetamol for fever (max 4 times/day)',
    'Vitamin C, D, Zinc supplements as per doctor',
    'Watch for warning signs: difficulty breathing, chest pain, confusion',
    'Wear mask even at home if others present',
    'Separate room, utensils, and towels'
  ],

  'Tuberculosis': [
    '📋 Long-term treatment - Start immediately, never miss doses',
    'Take all TB medications on empty stomach daily',
    'NEVER skip doses or stop treatment early (minimum 6 months)',
    'Cover mouth when coughing - dispose tissues safely',
    'Maintain good ventilation in room - open windows',
    'Ensure adequate nutrition - high protein diet',
    'Avoid alcohol completely during treatment',
    'Get regular sputum tests to monitor progress',
    'Isolate for first 2 weeks of treatment',
    'Watch for drug side effects: yellow eyes, numbness, vision changes'
  ],

  'Pneumonia': [
    '⚠️ Seek medical care - Antibiotics needed',
    'Rest in bed - sitting position better for breathing',
    'Drink plenty of warm fluids',
    'Give paracetamol for fever',
    'If prescribed inhaler: Use as directed',
    'Encourage deep breathing exercises every hour',
    'Use humidifier or steam inhalation for comfort',
    'Monitor oxygen levels if pulse oximeter available',
    'Complete full course of antibiotics',
    'GO TO HOSPITAL if: high fever, breathing difficulty, chest pain, confusion'
  ],

  'Acute Appendicitis': [
    '🚨 URGENT - Go to hospital immediately (Surgery often needed)',
    'DO NOT give food or water (surgery may be needed)',
    'DO NOT give laxatives or enemas',
    'DO NOT apply heat to abdomen',
    'Keep patient lying still - movement increases pain',
    'Note location and progression of pain',
    'DO NOT give pain medication before doctor examination (masks symptoms)',
    'Monitor temperature',
    'Watch for signs of rupture: sudden severe pain followed by relief, then worsening',
    'Surgery is only definitive treatment - do not delay'
  ],

  'Acute Pancreatitis': [
    '🚨 CALL 108 - Severe condition requiring hospitalization',
    'Keep patient lying down with knees bent',
    'DO NOT give anything by mouth - complete NPO (nothing by mouth)',
    'Monitor vital signs closely',
    'Watch for signs of shock',
    'Pain is severe - urgent medical pain management needed',
    'Hospital admission mandatory for IV fluids and monitoring',
    'DO NOT give alcohol or fatty foods'
  ],

  'Acute Gastroenteritis': [
    '📋 Prevent dehydration - Monitor symptoms',
    'Give ORS solution: 200-400ml after each loose stool',
    'Continue normal feeding (especially in children) - do not starve',
    'Avoid milk products temporarily',
    'BRAT diet: Banana, Rice, Applesauce, Toast',
    'Maintain hand hygiene - wash hands frequently',
    'Avoid spicy, oily, and raw foods',
    'Monitor for dehydration: dry mouth, less urine, dizziness',
    'GO TO HOSPITAL if: severe vomiting, blood in stool, high fever, signs of dehydration',
    'Usually resolves in 3-5 days'
  ],

  'Peptic Ulcer Disease': [
    '⚠️ See doctor for proper treatment',
    'Avoid NSAIDs (Ibuprofen, Aspirin) - worsens ulcer',
    'Eat small, frequent meals - every 2-3 hours',
    'Avoid: spicy foods, caffeine, alcohol, smoking',
    'Take antacid 1 hour before or 2 hours after meals',
    'Sleep with head elevated',
    'Reduce stress - practice relaxation',
    'If black stools or vomiting blood: EMERGENCY - GO TO HOSPITAL',
    'Complete treatment course even if pain resolves'
  ],

  'GERD (Acid Reflux)': [
    '📋 Lifestyle changes and medication',
    'Avoid lying down for 3 hours after eating',
    'Elevate head of bed by 6-8 inches',
    'Avoid trigger foods: spicy, citrus, chocolate, caffeine, mint',
    'Eat small meals - avoid large meals',
    'Lose weight if overweight',
    'Quit smoking and avoid alcohol',
    'Wear loose-fitting clothes',
    'Take antacid as needed',
    'If severe or frequent: See doctor for prescription medication'
  ],

  'Severe Hemorrhage': [
    '🚨 CALL 108 IMMEDIATELY - Life-threatening',
    'Apply FIRM, DIRECT pressure on wound with clean cloth',
    'If bleeding through cloth: Add more cloths, DO NOT remove first one',
    'Elevate injured part above heart level if possible',
    'Keep patient lying flat',
    'DO NOT remove embedded objects - stabilize them',
    'Apply pressure to pressure points if direct pressure fails',
    'Keep patient warm with blankets (prevents shock)',
    'Monitor consciousness and breathing',
    'If unconscious: Check airway, breathing, circulation',
    'Continue pressure until ambulance arrives'
  ],

  'Fracture': [
    '⚠️ Immobilize and seek medical care',
    'DO NOT try to realign bone',
    'Immobilize joint above and below fracture',
    'Apply splint using rigid material (stick, rolled newspaper)',
    'If open fracture: Cover wound with clean cloth, DO NOT push bone back',
    'Apply ice pack (wrapped in cloth) for 20 minutes',
    'Elevate injured part if possible',
    'Give paracetamol for pain',
    'Watch for circulation: check fingers/toes for color, warmth, sensation',
    'Transport to hospital carefully - keep injured part stable'
  ],

  'Concussion': [
    '⚠️ Seek medical evaluation - Brain injury requires assessment',
    'Keep patient awake and alert for first few hours',
    'Monitor for worsening symptoms',
    'Apply ice pack to any bumps',
    'Complete rest - no physical or mental exertion',
    'Avoid screens (TV, phone, computer) for 24-48 hours',
    'DO NOT give aspirin (risk of bleeding)',
    'Can give paracetamol for headache',
    'Wake patient every 2-3 hours overnight to check alertness',
    'GO TO HOSPITAL IMMEDIATELY if: severe headache, repeated vomiting, seizure, confusion, weakness, slurred speech, unequal pupils'
  ],

  'Venomous Snake Bite': [
    '🚨 CALL 108 IMMEDIATELY - Antivenom needed urgently',
    'Keep patient calm and still - movement spreads venom',
    'Remove jewelry and tight clothing before swelling',
    'Immobilize bitten limb with splint - keep at heart level',
    'Mark edge of swelling with pen and note time',
    'DO NOT: Cut wound, suck venom, apply tourniquet, ice, or electric shock',
    'Note time of bite and description of snake if possible',
    'Monitor vital signs',
    'If possible, take photo of snake (from safe distance)',
    'Hospital transport URGENTLY for antivenom administration',
    'Watch for breathing difficulty - prepare for rescue breathing'
  ],

  'Diabetic Ketoacidosis': [
    '🚨 CALL 108 - Medical emergency requiring hospitalization',
    'If conscious: Give water or sugar-free fluids',
    'DO NOT give insulin without medical supervision',
    'Monitor blood sugar if glucometer available',
    'Check for fruity breath odor (acetone smell)',
    'Monitor consciousness level',
    'Hospital admission mandatory for IV fluids and insulin',
    'This is NOT simple high blood sugar - it is life-threatening'
  ],

  'Hypoglycemia': [
    '⚠️ URGENT - Treat immediately to prevent complications',
    'If conscious: Give 15g fast-acting sugar immediately',
    '- 3-4 glucose tablets OR',
    '- 4 oz (120ml) fruit juice OR',
    '- 1 tablespoon honey OR',
    '- 3 teaspoons sugar dissolved in water',
    'Wait 15 minutes and recheck blood sugar',
    'If still low: Repeat treatment',
    'After sugar normalizes: Give complex carb (bread, crackers)',
    'If unconscious: DO NOT give anything by mouth - CALL 108',
    'If available: Glucagon injection can be given',
    'Never leave patient alone'
  ],

  'Hypertensive Crisis': [
    '🚨 URGENT - Go to emergency room immediately',
    'Have patient sit or lie down quietly',
    'Keep patient calm - stress raises BP further',
    'If prescribed emergency BP medication: Give as directed',
    'DO NOT give unrescribed medications',
    'Loosen tight clothing',
    'Monitor BP every 10-15 minutes if equipment available',
    'Watch for stroke symptoms: weakness, speech problems, severe headache',
    'Watch for chest pain (heart attack risk)',
    'Hospital evaluation required - may need IV medications'
  ],

  'Common Cold (Viral URTI)': [
    'ℹ️ Self-limiting - Usually resolves in 7-10 days',
    'Rest adequately - get extra sleep',
    'Drink plenty of warm fluids: soup, herbal tea, warm water',
    'Gargle with warm salt water for sore throat (3-4 times/day)',
    'Use saline nasal drops or spray for congestion',
    'Steam inhalation with plain water 2-3 times daily',
    'Take paracetamol for fever/aches',
    'Honey for cough (1 teaspoon, not for infants <1 year)',
    'Maintain good hygiene - wash hands, use tissues',
    'See doctor if: Fever >3 days, difficulty breathing, severe symptoms, no improvement in 10 days'
  ],

  'Influenza': [
    '📋 Rest and symptomatic care - Antiviral if severe',
    'Complete bed rest for at least 3-5 days',
    'Drink plenty of fluids to prevent dehydration',
    'Take paracetamol for fever and body aches (every 6 hours)',
    'Isolate from others - especially elderly and children',
    'Cover mouth when coughing/sneezing',
    'Antiviral medication (Oseltamivir) if prescribed within 48 hours of symptoms',
    'Eat nutritious food when appetite returns',
    'Avoid antibiotics unless bacterial complication occurs',
    'See doctor if: Breathing difficulty, chest pain, persistent high fever, confusion'
  ],

  'Urinary Tract Infection': [
    '📋 See doctor for antibiotics - Drink plenty of fluids',
    'Drink 8-10 glasses of water daily (flushes bacteria)',
    'Urinate frequently - do not hold urine',
    'Take full course of antibiotics as prescribed',
    'Take paracetamol for pain/discomfort',
    'Avoid caffeine and alcohol (bladder irritants)',
    'Use heating pad on lower abdomen for comfort',
    'Wipe front to back after toilet (women)',
    'Cranberry juice may help (unsweetened)',
    'See doctor immediately if: Fever, back pain, vomiting, blood in urine'
  ],

  'Tension Headache': [
    'ℹ️ Usually responds to simple measures',
    'Take paracetamol or ibuprofen',
    'Apply warm or cold compress to head/neck',
    'Rest in quiet, dark room',
    'Gentle neck and shoulder stretches',
    'Massage temples and neck muscles',
    'Practice relaxation techniques - deep breathing',
    'Ensure good posture - especially if working at desk',
    'Stay hydrated',
    'See doctor if: Severe, sudden, or "worst headache ever", associated with fever/stiff neck/vision changes'
  ],

  'Migraine': [
    '📋 Medications work best when taken early',
    'Take prescribed migraine medication at FIRST sign of attack',
    'Lie down in quiet, dark room',
    'Apply cold compress to forehead',
    'Try to sleep if possible',
    'Gentle pressure on temples may help',
    'Avoid bright lights, loud noises, strong smells',
    'Stay hydrated - sip water slowly',
    'Avoid known triggers: certain foods, stress, lack of sleep',
    'GO TO HOSPITAL if: Worst headache ever, with fever/stiff neck/confusion/weakness/double vision'
  ],

  'Allergic Rhinitis': [
    'ℹ️ Avoid allergens and take antihistamines',
    'Identify and avoid triggers: pollen, dust, pet dander',
    'Take antihistamine (Cetirizine 10mg) once daily',
    'Use saline nasal rinse to clear allergens',
    'Keep windows closed during high pollen days',
    'Use air purifier with HEPA filter',
    'Shower before bed to remove allergens from hair/skin',
    'Wash bedding in hot water weekly',
    'Nasal steroid spray if prescribed',
    'See doctor if: Symptoms interfere with sleep/daily activities, not controlled with medications'
  ],

  'Contact Dermatitis': [
    'ℹ️ Identify and avoid irritant',
    'Wash affected area gently with mild soap and water',
    'Apply cool, wet compress for 15-20 minutes several times daily',
    'Use over-the-counter hydrocortisone cream (1%)',
    'Take antihistamine for itching',
    'Avoid scratching - keeps nails short',
    'Wear loose, breathable cotton clothing',
    'Identify and avoid causative agent',
    'Moisturize regularly with fragrance-free lotion',
    'See doctor if: Severe, widespread, infected (pus/increasing pain), not improving in 1 week'
  ]
};

// Symptom-specific additional first aid tips
export function getSymptomSpecificTips(symptoms: string[]): string[] {
  const tips: string[] = [];

  // Chest pain specific
  if (symptoms.some(s => s.includes('chest pain'))) {
    tips.push('For chest pain: Sit upright, loosen clothing, take slow deep breaths');
  }

  // Bleeding specific
  if (symptoms.some(s => s.includes('bleeding'))) {
    tips.push('For bleeding: Apply direct pressure, elevate if possible, do not remove first cloth');
  }

  // Fever specific
  if (symptoms.some(s => s.includes('fever'))) {
    tips.push('For fever: Give paracetamol, lukewarm sponging (not cold bath), keep hydrated');
  }

  // Breathing difficulty
  if (symptoms.some(s => s.includes('breath') || s.includes('breathless'))) {
    tips.push('For breathing difficulty: Sit upright, open windows, loosen clothing, stay calm');
  }

  // Vomiting/Diarrhea
  if (symptoms.some(s => s.includes('vomiting') || s.includes('diarrhea'))) {
    tips.push('For vomiting/diarrhea: Give ORS frequently, avoid solid food initially, watch for dehydration');
  }

  return tips;
}
