/**
 * COMPREHENSIVE MEDICAL KNOWLEDGE BASE
 * Contains FAQs, treatment protocols, and health information
 * for common conditions, allergies, diet, and first aid
 */

export interface MedicalTopic {
  topic: string;
  keywords: string[];
  response: string;
  category: 'faq' | 'condition' | 'first-aid' | 'allergy' | 'diet' | 'medicine' | 'prevention';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const MEDICAL_KNOWLEDGE_BASE: MedicalTopic[] = [
  // ============= COMMON COLD =============
  {
    topic: 'Common Cold',
    keywords: ['cold', 'common cold', 'runny nose', 'stuffy nose', 'sore throat', 'sneezing', 'congestion'],
    category: 'condition',
    severity: 'low',
    response: `**COMMON COLD (Viral Upper Respiratory Infection)**

📋 **What is it?**
• Viral infection of nose and throat caused by rhinovirus
• Highly contagious, spreads through droplets and contact
• Usually lasts 7-10 days, self-limiting

🔍 **Symptoms:**
• Runny or stuffy nose (clear mucus)
• Sneezing
• Sore throat (mild)
• Mild cough
• Low-grade fever (rare in adults)
• Mild body ache

💊 **Treatment (No cure, only symptom relief):**

**Medicines:**
• Paracetamol 500mg - For fever/body ache (every 6 hours)
• Cetirizine 10mg - For runny nose (once at bedtime)
• Cough syrup (Dextromethorphan) - 2 tsp, 3x/day for dry cough
• Decongestant nasal spray (Oxymetazoline) - Use max 3 days only
• Vitamin C 500mg - Once daily (may shorten duration)
• Zinc lozenges - 4-6 times/day

**Home Remedies:**
• Steam inhalation - 2-3 times daily for 10 minutes
• Warm salt water gargle - 3-4 times daily
• Drink warm water, herbal tea, ginger tea, honey-lemon water
• Rest adequately (7-8 hours sleep)
• Use humidifier in room

🚫 **Do NOT:**
• Take antibiotics (cold is viral, antibiotics don't work)
• Suppress cough completely (helps clear mucus)
• Use nasal spray more than 3 days (causes rebound congestion)

⚠️ **See Doctor if:**
• Symptoms last more than 10 days
• High fever > 101°F (38.3°C)
• Severe headache or face pain (sinusitis)
• Difficulty breathing
• Green/yellow thick mucus (bacterial infection)
• Ear pain

🛡️ **Prevention:**
• Wash hands frequently with soap
• Avoid touching face with unwashed hands
• Stay away from sick people
• Use tissue when sneezing/coughing
• Boost immunity with vitamin C, zinc, healthy diet`,
  },

  // ============= MINOR CUTS & WOUNDS =============
  {
    topic: 'Minor Cuts and Scrapes',
    keywords: ['cut', 'scrape', 'scratch', 'minor wound', 'small cut', 'abrasion', 'graze'],
    category: 'first-aid',
    severity: 'low',
    response: `**MINOR CUTS & SCRAPES - First Aid Guide**

🩹 **Immediate Treatment (Step-by-Step):**

**1. STOP BLEEDING:**
• Apply firm pressure with clean cloth/gauze for 5-10 minutes
• Elevate injured area above heart level
• Don't peek repeatedly (disrupts clot formation)

**2. CLEAN THE WOUND (Very Important!):**
• Wash YOUR hands thoroughly with soap first
• Rinse wound under clean running water for 5 minutes
• Use mild soap AROUND wound (not inside)
• Remove dirt/debris gently with clean tweezers
• Pat dry with clean gauze or cloth

**3. DISINFECT:**
• Apply antiseptic solution:
  - Betadine (Povidone-iodine) - Diluted OR
  - Dettol - 1:20 dilution with water OR
  - Hydrogen peroxide - For initial cleaning only
• Let it air dry completely

**4. APPLY ANTIBIOTIC OINTMENT:**
• Neosporin OR Bacitracin OR Mupirocin
• Apply thin layer to prevent infection
• Helps keep wound moist for faster healing

**5. BANDAGE:**
• Cover with sterile non-stick gauze pad
• Secure with medical tape or bandage
• Don't wrap too tight (should not cut circulation)

**6. CHANGE DRESSING:**
• Change bandage DAILY
• Change immediately if wet, dirty, or loose
• Clean wound with water each time before new dressing

💊 **Medicines:**
• **Antibiotic ointment (Neosporin)** - Apply twice daily
• **Paracetamol 500mg** - For pain (if needed)
• **Tetanus shot** - If not vaccinated in last 5 years (VERY IMPORTANT)

⏰ **Healing Timeline:**
• Days 1-2: Bleeding stops, scab starts forming
• Days 3-7: Scab hardens, new skin grows underneath
• Days 7-14: Scab falls off naturally, pink new skin visible
• Weeks 2-4: Pink skin gradually matches normal skin

🚫 **Do NOT:**
• Pick at scabs (delays healing, causes scarring)
• Use alcohol directly on wound (damages tissue)
• Apply cotton balls directly (fibers stick to wound)
• Use butter, oil, toothpaste, or home remedies
• Remove scab forcefully

⚠️ **See Doctor URGENTLY if:**
• Cut is deep (can see fat/muscle/bone)
• Cut is longer than 2 cm (¾ inch)
• Wound has jagged edges (may need stitches)
• Caused by dirty/rusty object (tetanus risk)
• Bleeding doesn't stop after 15 minutes of pressure
• Cut is on face, hand, joint, or genitals
• Signs of infection appear (see below)

🚨 **INFECTION WARNING SIGNS (See doctor immediately):**
• Increased pain after 2-3 days
• Red streaks spreading from wound (cellulitis)
• Swelling, warmth, redness increasing
• Pus (yellow/green discharge)
• Foul smell
• Fever > 100.4°F (38°C)
• Wound not healing or getting bigger

💉 **TETANUS SHOT - CRITICAL:**
• Needed if not vaccinated in last 5 years
• ESSENTIAL for dirty wounds, rusty metal cuts, outdoor injuries
• Get within 48 hours of injury (best within 24 hours)
• Available at any hospital/clinic

✅ **Tips for Faster Healing:**
• Keep wound moist with antibiotic ointment (heals 50% faster)
• Eat protein-rich foods (chicken, eggs, dal, fish)
• Take vitamin C 500mg daily
• Stay hydrated - 8-10 glasses water daily
• Avoid smoking (reduces healing)
• Don't expose to sunlight (causes dark scars)`,
  },

  // ============= ALLERGIES =============
  {
    topic: 'Allergies (Food & Environmental)',
    keywords: ['allergy', 'allergic', 'rash', 'itching', 'hives', 'swelling', 'allergic reaction', 'food allergy'],
    category: 'allergy',
    severity: 'medium',
    response: `**ALLERGIES - Complete Guide**

📋 **What is an Allergy?**
• Immune system overreacts to harmless substance (allergen)
• Can be triggered by food, pollen, dust, medicines, insect stings
• Ranges from mild (itching) to severe (anaphylaxis)

🔍 **Common Allergens:**

**Food:**
• Peanuts, tree nuts (cashew, almond)
• Shellfish (shrimp, crab)
• Eggs, milk, soy
• Wheat (gluten)

**Environmental:**
• Pollen (seasonal allergies)
• Dust mites
• Pet dander (cats, dogs)
• Mold spores
• Insect stings (bees, wasps)

**Medicines:**
• Penicillin antibiotics
• Aspirin
• Sulfa drugs

🩺 **Symptoms (Vary by Severity):**

**MILD:**
• Skin rash, hives (red itchy bumps)
• Itching (skin, eyes, nose)
• Sneezing, runny nose
• Watery eyes

**MODERATE:**
• Widespread rash all over body
• Swelling of face, lips, tongue
• Difficulty swallowing
• Stomach cramps, vomiting, diarrhea

**SEVERE (ANAPHYLAXIS - MEDICAL EMERGENCY):**
• Difficulty breathing, wheezing
• Throat tightness, choking sensation
• Rapid drop in blood pressure
• Dizziness, fainting
• Loss of consciousness

💊 **Treatment:**

**For MILD Allergies:**
• **Antihistamines:**
  - Cetirizine 10mg - Once daily (non-drowsy)
  - Loratadine 10mg - Once daily
  - Diphenhydramine 25mg - Causes drowsiness but fast-acting
  
• **Topical:**
  - Hydrocortisone 1% cream - For skin rash (max 7 days)
  - Calamine lotion - For itching
  - Cool compress on affected area

• **Avoid the trigger** - Most important!

**For MODERATE Allergies:**
• Take antihistamine immediately
• If swelling of face/tongue: Go to hospital
• May need steroid injection (doctor will give)

**For SEVERE (ANAPHYLAXIS) - EMERGENCY:**
🚨 **CALL 108 AMBULANCE IMMEDIATELY**

**Immediate Actions:**
1. If EpiPen available: Inject in outer thigh (even through clothes)
2. Lay person flat, elevate legs
3. If vomiting: Turn on side
4. Loosen tight clothing
5. Monitor breathing and pulse
6. Start CPR if stops breathing

⚠️ **When to Go to Emergency:**
• Difficulty breathing or wheezing
• Swelling of lips, tongue, throat
• Dizziness or fainting
• Rapid heartbeat
• Severe stomach pain or vomiting
• Any symptom after eating known allergen

🧪 **Diagnosis:**
• **Skin prick test** - Identifies specific allergens
• **Blood test (IgE test)** - Measures antibody levels
• **Food elimination diet** - Remove suspected foods, then reintroduce

🛡️ **Prevention:**
• **Identify your allergens** (keep diary of reactions)
• **Read food labels carefully** (look for hidden allergens)
• **Tell restaurants** about allergies when eating out
• **Wear medical alert bracelet** if severe allergies
• **Carry emergency antihistamine** always
• **EpiPen** - If prescribed, carry two at all times

**For Seasonal Allergies (Hay Fever):**
• Start antihistamines BEFORE pollen season
• Keep windows closed during high pollen days
• Shower after being outdoors
• Use air purifier with HEPA filter

**For Dust Allergies:**
• Wash bedding weekly in hot water
• Use dust mite covers on pillows/mattress
• Reduce clutter, vacuum regularly
• Keep humidity below 50%

📞 **Get Allergy Testing if:**
• Frequent unexplained rashes or reactions
• Symptoms interfere with daily life
• Need to identify specific triggers
• Planning to start immunotherapy (allergy shots)

💡 **Important Notes:**
• Allergies can develop at any age
• You can outgrow some allergies (especially milk, egg in children)
• Some allergies are lifelong (peanuts, shellfish)
• Antihistamines work best when taken BEFORE exposure`,
  },

  // ============= DIET & NUTRITION =============
  {
    topic: 'Healthy Diet & Nutrition',
    keywords: ['diet', 'nutrition', 'healthy eating', 'what to eat', 'food', 'balanced diet', 'vitamins', 'nutrients'],
    category: 'diet',
    severity: 'low',
    response: `**HEALTHY DIET & NUTRITION GUIDE**

🍽️ **Balanced Diet - What to Eat Daily:**

**1. CARBOHYDRATES (50-60% of diet):**
Energy source - Choose complex carbs
• Whole wheat roti/chapati - 4-6 per day
• Brown rice - 1 cup cooked
• Oats - Good for breakfast
• Millets (jowar, bajra, ragi) - Very nutritious
• Avoid: White bread, maida, excessive sugar

**2. PROTEINS (15-20% of diet):**
Muscle building, tissue repair
• Dal/lentils - 1 cup daily (moong, masoor, toor)
• Eggs - 1-2 per day (excellent protein)
• Chicken/fish - 100-150g, 3-4 times/week
• Paneer - 50g, 2-3 times/week
• Milk/curd - 1-2 cups daily
• Soybean, tofu - For vegetarians

**3. FATS (20-30% of diet):**
Essential for hormones and brain
• Cooking oil - 3-4 teaspoons/day (mustard, olive, groundnut)
• Nuts - Handful daily (almonds, walnuts, cashews)
• Seeds - Flax seeds, chia seeds (omega-3)
• Ghee - 1-2 teaspoons daily (in moderation)
�� Avoid: Trans fats, deep-fried foods, vanaspati

**4. VEGETABLES (3-5 servings/day):**
Vitamins, minerals, fiber
• Leafy greens - Spinach, fenugreek (iron, calcium)
• Colorful veggies - Carrot, tomato, capsicum
• Cruciferous - Broccoli, cabbage, cauliflower
• Root vegetables - Potato, sweet potato, beetroot
• Aim for variety of colors

**5. FRUITS (2-3 servings/day):**
Natural vitamins and antioxidants
• Seasonal fruits - Cheaper and fresher
• Citrus - Orange, sweet lime (vitamin C)
• Berries - Rich in antioxidants
• Banana - Good for energy
• Apple, papaya, guava - Easily available
• Eat whole fruits, not just juice (fiber important)

**6. WATER (8-10 glasses/day):**
• 2-3 liters daily minimum
• More if exercising or hot weather
• Coconut water - Natural electrolytes
• Buttermilk - Good for digestion

🥗 **Sample Daily Meal Plan:**

**BREAKFAST (7-8 AM):**
• 2 whole wheat parathas with curd OR
• Oats porridge with milk and fruits OR
• 2 eggs (boiled/scrambled) + 2 bread slices
• 1 fruit
• Tea/coffee with milk

**MID-MORNING SNACK (10-11 AM):**
• Handful of nuts (almonds, walnuts)
• OR fruit
• OR buttermilk

**LUNCH (12-1 PM):**
• 2-3 rotis OR 1 cup rice
• 1 cup dal
• 1 cup vegetable curry
• Salad (cucumber, tomato, onion, carrot)
• Curd

**EVENING SNACK (4-5 PM):**
• Tea with biscuits OR
• Roasted chana OR
• Fruit OR
• Boiled corn/peanuts

**DINNER (7-8 PM):**
• 2-3 rotis
• 1 cup vegetable
• 1 cup dal OR chicken/fish
• Salad
• Light dinner better for digestion

🌟 **Essential Vitamins & Minerals:**

**Vitamin A:** Carrots, spinach, eggs (eyes, skin)
**Vitamin B complex:** Whole grains, eggs (energy, nerves)
**Vitamin C:** Citrus fruits, amla (immunity, wound healing)
**Vitamin D:** Sunlight 15 min/day, egg yolk, milk (bones)
**Calcium:** Milk, curd, paneer, ragi, sesame (bones, teeth)
**Iron:** Spinach, beetroot, jaggery, eggs (prevents anemia)
**Zinc:** Nuts, seeds, chickpeas (immunity, wound healing)

💪 **Diet for Specific Conditions:**

**For Weight Loss:**
• Reduce portion size by 20%
• Avoid sugar, sweets, fried foods
• Increase vegetables and protein
• Eat every 3-4 hours (smaller meals)
• Drink water before meals

**For Weight Gain:**
• Increase portion size
• Add healthy snacks between meals
• Protein shake with milk, banana, nuts
• Strength training exercise

**For Diabetes:**
• Low glycemic index foods (brown rice, oats)
• Small frequent meals
• Avoid sugar, white rice, maida
• Increase fiber (vegetables, whole grains)

**For High Blood Pressure:**
• Reduce salt intake (< 5g/day)
• Increase potassium (banana, coconut water)
• Avoid pickles, papad, chips
• Eat garlic, beetroot, pomegranate

**For Cholesterol:**
• Avoid red meat, ghee, butter, cheese
• Increase oats, nuts, olive oil
• Eat fish (omega-3)
• More fruits and vegetables

🚫 **Foods to Limit/Avoid:**
• Excessive salt (causes BP, kidney issues)
• Refined sugar and sweets (diabetes, obesity)
• Deep-fried foods (heart disease)
• Processed foods (chips, instant noodles)
• Soft drinks and packaged juices
• Alcohol (liver damage)
• Excessive tea/coffee (causes acidity)

✅ **Healthy Eating Habits:**
• Eat at same time daily (routine)
• Chew food slowly (aids digestion)
• Don't skip breakfast (most important meal)
• Dinner 2-3 hours before sleep
• Eat until 80% full (not stuffed)
• Reduce screen time while eating
• Cook at home more than eating out

💡 **Supplements (Consult doctor before taking):**
• Multivitamin - Once daily (if diet deficient)
• Vitamin D3 - 1000 IU daily (if low sunlight)
• Calcium - 500mg (for bones, especially women)
• Iron - If anemic (pregnant women, heavy periods)
• Omega-3 - Fish oil capsules (heart health)

📊 **Track Your Nutrition:**
• Aim for colorful plate (variety)
• Read food labels (check sugar, salt content)
• Portion control is key
• Listen to your body's hunger cues`,
  },

  // ============= FEVER =============
  {
    topic: 'Fever Management',
    keywords: ['fever', 'temperature', 'high fever', 'pyrexia', 'hot', 'body heat'],
    category: 'condition',
    severity: 'medium',
    response: `**FEVER - Complete Management Guide**

🌡️ **What is Fever?**
• Body temperature above 100.4°F (38°C)
• Normal: 97-99°F (36.1-37.2°C)
• Body's defense mechanism against infection
• Not a disease itself, but a symptom

📊 **Fever Classification:**
• **Low-grade:** 100.4-102°F (38-39°C) - Usually not serious
• **Moderate:** 102-104°F (39-40°C) - Monitor closely
• **High:** Above 104°F (40°C) - See doctor urgently
• **Hyperpyrexia:** Above 106°F (41.1°C) - EMERGENCY

🔍 **Common Causes:**
• Viral infections (cold, flu, dengue)
• Bacterial infections (typhoid, UTI, pneumonia)
• Malaria (if in endemic area)
• COVID-19
• Throat infection
• Ear infection
• Vaccine reaction (normal, lasts 1-2 days)

💊 **Treatment:**

**Medicines:**
• **Paracetamol (Acetaminophen) 500mg**
  - Adults: 1-2 tablets every 6-8 hours
  - Max: 4000mg (8 tablets) in 24 hours
  - Take with water, can take with or without food
  - SAFEST fever medicine

• **Ibuprofen 400mg** (Alternative)
  - Adults: 1 tablet every 8 hours
  - Take with food (can cause stomach upset)
  - Avoid if stomach ulcer or kidney disease

• **For children:** Use syrup form, dose by weight (consult doctor)

⚠️ **AVOID in Dengue/Viral fever:**
• Aspirin
• Ibuprofen
• Diclofenac
• Combiflam
(These can cause bleeding in dengue)

🏠 **Home Care:**

**Cool Down Body:**
• Sponge bath with lukewarm water (not cold!)
• Place cool wet cloth on forehead
• Remove excess clothing, use light cotton clothes
• Keep room temperature comfortable
• Use fan (not AC on full blast)

**Hydration (VERY IMPORTANT):**
• Drink 10-12 glasses water daily
• ORS solution - 1 sachet in 1 liter water
• Coconut water - Natural electrolytes
• Fruit juices (fresh, not packaged)
• Warm soups, dal water
• Avoid: Alcohol, coffee, tea (dehydrating)

**Rest:**
• Complete bed rest
• Sleep 8-10 hours
• Avoid physical exertion

**Nutrition:**
• Light, easily digestible food
• Rice, khichdi, curd
• Fruits (banana, apple, papaya)
• Boiled vegetables
• Avoid: Spicy, oily, heavy foods

📏 **When to Measure Temperature:**
• Every 4-6 hours when fever present
• 1 hour after taking medicine
• Morning and evening
• Use digital thermometer (most accurate)
• Oral, armpit, or forehead methods

⚠️ **See Doctor URGENTLY if:**
• Fever > 103°F (39.4°C) for more than 2 days
• Fever > 105°F (40.5°C) at any time
• Fever with severe headache
• Fever with stiff neck (can't touch chin to chest)
• Fever with rash (dengue, meningitis)
• Fever with severe stomach pain
• Fever with bleeding (nose, gums, urine)
• Fever with difficulty breathing
• Fever with extreme drowsiness/confusion
• Fever in infant < 3 months old
• Fever with vomiting and unable to drink fluids
• Fever not responding to paracetamol

🧪 **Tests May Be Needed:**
• **Complete Blood Count (CBC)** - Check infection, dengue
• **Malaria test** - If in malaria area
• **Typhoid test (Widal)** - If fever > 5 days
• **Dengue NS1/IgG/IgM** - If suspected dengue
• **Urine test** - If urinary symptoms
• **Chest X-ray** - If cough with fever

🦟 **Dengue Fever - Special Care:**
Signs: High fever, severe headache, pain behind eyes, joint pain, rash

**Do's:**
• Take ONLY paracetamol
• Drink lots of fluids (ORS, coconut water)
• Monitor platelet count (blood test every 2 days)
• Watch for warning signs: bleeding, severe pain, vomiting

**Don'ts:**
• No aspirin, ibuprofen, or other painkillers
• Don't ignore bleeding signs (urgent hospital visit)

💡 **Fever in Children:**
• Measure temperature rectally (most accurate)
• Any fever in baby < 3 months - See doctor immediately
• Febrile seizures can occur (child shakes) - Don't panic, protect from injury, call doctor
• Use paracetamol syrup (dose by weight)

🛡️ **Prevention (If infectious cause):**
• Wash hands frequently
• Avoid close contact with sick people
• Boost immunity (vitamin C, adequate sleep, healthy diet)
• Stay hydrated always
• Use mosquito nets/repellents (for dengue, malaria)

⏰ **Recovery Timeline:**
• Viral fever: 3-7 days
• Bacterial (with antibiotics): 2-3 days after starting treatment
• Dengue: 5-7 days (critical period day 3-5)
• Typhoid: 7-14 days with antibiotics

✅ **Return to Normal Activities When:**
• Temperature normal for 24 hours without medicine
• Energy levels back to normal
• Eating and drinking normally
• No other symptoms present`,
  },

  // ============= HEADACHE =============
  {
    topic: 'Headache Types and Relief',
    keywords: ['headache', 'head pain', 'migraine', 'tension headache', 'pain in head', 'cephalgia'],
    category: 'condition',
    severity: 'low',
    response: `**HEADACHE - Types, Causes, and Treatment**

📋 **Types of Headaches:**

**1. TENSION HEADACHE (Most Common - 70%)**
**Symptoms:**
• Dull, aching pain on both sides of head
• Feels like tight band around head
• Mild to moderate intensity
• No nausea or vomiting
• Lasts 30 minutes to several hours

**Causes:**
• Stress, anxiety
• Poor posture (desk work)
• Eye strain (computer, phone)
• Lack of sleep
• Skipped meals
• Dehydration

**Treatment:**
• Paracetamol 500mg - 1-2 tablets
• Ibuprofen 400mg - With food
• Rest in quiet, dark room
• Gentle head/neck massage
• Apply cold/warm compress
• Relaxation techniques

**2. MIGRAINE (Severe)**
**Symptoms:**
• Intense throbbing pain (usually one side)
• Nausea and vomiting
• Sensitivity to light and sound
• Visual disturbances (aura) - flashing lights, zigzag lines
• Lasts 4-72 hours
• Can be debilitating

**Triggers:**
• Certain foods (cheese, chocolate, alcohol)
• Strong smells
• Weather changes
• Hormonal changes (periods)
• Stress
• Sleep changes
• Skipped meals

**Treatment:**
• Take medicine AT FIRST SIGN (works best early)
• Paracetamol 1000mg OR Aspirin 900mg
• Ibuprofen 400-600mg
• Anti-nausea: Domperidone 10mg
• Lie down in dark, quiet room
• Cold compress on head
• Sleep if possible
• Caffeine may help (coffee/tea)

**Prescription medicines (doctor will give):**
• Sumatriptan - Specific for migraine
• Ergotamine
• Preventive medicines if frequent migraines

**3. CLUSTER HEADACHE (Rare but Very Severe)**
**Symptoms:**
• Extremely severe pain around one eye
• Eye becomes red and watery
• Nose runs on same side
• Lasts 15-180 minutes
• Occurs in clusters (daily for weeks/months)
• Often at same time each day

**Treatment:**
• Oxygen therapy (100%)
• Sumatriptan injection
• See neurologist

**4. SINUS HEADACHE**
**Symptoms:**
• Deep pain in forehead, cheekbones, bridge of nose
• Gets worse when bending forward
• Nasal congestion
• Thick nasal discharge (yellow/green)
• Fever may be present

**Treatment:**
• Steam inhalation - 3 times daily
• Nasal decongestant spray
• Paracetamol for pain
• Antibiotics if bacterial (doctor will prescribe)

**5. DEHYDRATION HEADACHE**
**Symptoms:**
• Dull pain all over head
• Thirst, dry mouth
• Dark urine
• Fatigue

**Treatment:**
• Drink water immediately (2-3 glasses)
• ORS solution
• Coconut water
• Rest

💊 **General Treatment:**

**Medicines:**
• **Paracetamol 500mg** - First choice, safest
  - 1-2 tablets every 6 hours
  - Max 4000mg (8 tablets) per day

• **Ibuprofen 400mg** - Good for inflammation
  - 1 tablet every 8 hours
  - Take with food
  - Avoid if stomach ulcer

• **Aspirin 500mg** - For migraine
  - 1-2 tablets
  - Avoid if bleeding disorders

• **Combination:** Paracetamol + Caffeine (works better)

🏠 **Home Remedies:**

**Immediate Relief:**
• Lie down in dark, quiet room
• Close eyes, relax
• Deep breathing exercises
• Cold compress on forehead (tension/migraine)
• Warm compress on neck (tension)
• Gentle scalp and temple massage
• Drink 2-3 glasses of water

**Natural Remedies:**
• Ginger tea - Anti-inflammatory
• Peppermint oil - Rub on temples
• Lavender oil - Inhale or apply
• Coffee - Caffeine can help (1 cup only)
• Cinnamon paste - Apply on forehead

⚠️ **URGENT - See Doctor if Headache:**
• Is sudden and severe ("thunderclap" - worst ever)
• With high fever and stiff neck (meningitis)
• After head injury
• With confusion, vision changes, speech problems
• With weakness or numbness in limbs
• First time severe headache after age 50
• Getting progressively worse over days/weeks
• Different from usual pattern
• Not relieved by usual medicines
• Occurs every day
• Wakes you from sleep

🧠 **When to See Neurologist:**
• Frequent headaches (> 3 times/week)
• Headaches interfering with daily life
• Migraines not controlled by medicine
• New type of headache after age 50
• Headache with neurological symptoms

🛡️ **Prevention:**

**Lifestyle Changes:**
• Sleep 7-8 hours regularly (same schedule)
• Eat meals on time (don't skip)
• Drink 8-10 glasses water daily
• Reduce stress (meditation, yoga)
• Exercise regularly (30 min, 5 days/week)
• Limit caffeine (max 2 cups/day)
• Reduce screen time, take breaks
• Maintain good posture
• Avoid bright lights, loud noise

**For Migraines:**
• Keep headache diary (identify triggers)
• Avoid trigger foods
• Manage stress
• Regular sleep schedule
• Preventive medicines (if frequent)

**For Tension Headaches:**
• Stress management techniques
• Improve workplace ergonomics
• Regular breaks from screen
• Eye checkup (may need glasses)
• Physiotherapy for neck/shoulder

🏋️ **Exercises to Prevent:**
• Neck stretches
• Shoulder rolls
• Jaw relaxation
• Eye exercises (if screen work)
• Yoga (especially pranayama)

📝 **Keep Headache Diary:**
Track:
• When headache occurs
• Duration and intensity (1-10 scale)
• Associated symptoms
• What you ate/drank
• Sleep quality
• Stress levels
• What helped

This helps identify patterns and triggers!

💡 **Quick Facts:**
• 90% of headaches are not dangerous
• Most respond to over-the-counter pain relievers
• Lifestyle changes can reduce frequency by 50%
• Medication overuse can cause "rebound headaches"
• Don't take painkillers more than 2-3 times/week`,
  },

  // ============= DEHYDRATION =============
  {
    topic: 'Dehydration Prevention and Treatment',
    keywords: ['dehydration', 'dehydrated', 'thirsty', 'dry mouth', 'loss of fluids', 'water'],
    category: 'condition',
    severity: 'medium',
    response: `**DEHYDRATION - Prevention & Treatment**

💧 **What is Dehydration?**
• Body loses more fluids than it takes in
• Water makes up 60% of body weight
• Even mild dehydration affects health
• Common in hot weather, illness, exercise

🔍 **Symptoms by Severity:**

**MILD Dehydration (2-5% fluid loss):**
• Thirst
• Dry mouth and lips
• Dark yellow urine
• Decreased urine frequency
• Mild headache
• Tiredness
• Dizziness when standing

**MODERATE Dehydration (5-10% loss):**
• Very dark urine (amber colored)
• Dry skin (less elastic)
• Rapid heartbeat
• Rapid breathing
• Sunken eyes
• Lethargy
• Irritability
• No tears when crying (children)

**SEVERE Dehydration (>10% loss) - EMERGENCY:**
• Very little or no urine (12+ hours)
• Extreme thirst
• Very dry skin, mouth, and eyes
• Rapid, weak pulse
• Low blood pressure
• Confusion, delirium
• Unconsciousness
• Cold hands and feet

💊 **Treatment:**

**MILD Dehydration (Home Treatment):**

**Oral Rehydration Solution (ORS) - BEST:**
• ORS packet - Mix 1 sachet in 1 liter clean water
• Drink 200-400ml after each loose stool
• Sip slowly, frequently (every 5-10 minutes)
• Better than plain water (has electrolytes)
• Available at any pharmacy

**Homemade ORS Recipe:**
• 1 liter clean water
• 6 teaspoons sugar
• ½ teaspoon salt
• Mix well, use within 24 hours

**Other Fluids:**
• Coconut water - Natural electrolytes (EXCELLENT)
• Buttermilk
• Lemon water with pinch of salt and sugar
• Fresh fruit juices (diluted)
• Soups, broths
• Dal water

**Avoid:**
• Alcohol (dehydrates more)
• Coffee, tea (diuretic)
• Sugary sodas
• Energy drinks (high sugar)

**MODERATE to SEVERE:**
🚨 **Go to hospital immediately** - Need IV fluids

⚠️ **Special Cases:**

**Dehydration from Diarrhea/Vomiting:**
• ORS is CRUCIAL
• Zinc tablets 20mg - Once daily for 14 days
• Continue feeding (don't fast)
• Small frequent sips if vomiting
• Hospital if can't keep fluids down

**Dehydration from Heat/Exercise:**
• Move to cool, shady place
• Remove excess clothing
• Cool down with wet cloths
• Drink ORS or coconut water
• Rest completely

**Dehydration in Diabetes:**
• High blood sugar causes dehydration
• Drink extra water (12-15 glasses)
• Monitor blood sugar
• Avoid sugary drinks
• See doctor if persistent

👶 **Children (High Risk):**
**Signs:**
• No wet diaper for 6+ hours
• Dry mouth and tongue
• No tears when crying
• Sunken soft spot on head (fontanelle)
• Listless, irritable

**Treatment:**
• ORS every 5-10 minutes
• Continue breastfeeding
• Zinc supplements
• Hospital if severe or not improving

🧓 **Elderly (High Risk):**
• Reduced thirst sensation
• May forget to drink
• Set reminders to drink water
• Keep water bottle nearby
• Monitor urine color

🌡️ **Causes of Dehydration:**
• **Diarrhea and vomiting** - Most common
• **Fever** - Increases fluid loss
• **Excessive sweating** - Heat, exercise
• **Diabetes** - Frequent urination
• **Diuretic medicines** - Increase urination
• **Burns** - Fluid lost through damaged skin
• **Not drinking enough water**

🛡️ **Prevention:**

**Daily Water Needs:**
• Adults: 2.5-3.5 liters (10-14 glasses)
• More if:
  - Hot weather
  - Exercise/physical work
  - Pregnant or breastfeeding
  - Illness (fever, diarrhea)

**Tips to Stay Hydrated:**
• Drink water throughout day (not all at once)
• Start day with 2 glasses water
• Drink before, during, after exercise
• Keep water bottle with you
• Set phone reminders
• Drink even when not thirsty
• Increase in hot weather

**Eat Water-Rich Foods:**
• Cucumber - 96% water
• Watermelon - 92% water
• Oranges, grapes
• Lettuce, celery
• Yogurt, curd
• Soups

**Monitor Hydration:**
• **Urine color test (best indicator):**
  - Pale yellow = Well hydrated ✅
  - Dark yellow = Mild dehydration ⚠️
  - Amber/orange = Severe dehydration 🚨
  - Clear = Over-hydrated (rare)

• Check 2-3 times per day

📊 **Hydration Schedule:**

**Morning (6-10 AM):**
• 2-3 glasses water
• Tea/coffee (counts, but limit)

**Mid-Morning:**
• 1-2 glasses water
• Fresh juice or coconut water

**Lunch (12-2 PM):**
• 1 glass before meal
• Buttermilk, curd with meal

**Afternoon:**
• 2-3 glasses water

**Evening:**
• 1-2 glasses
• Herbal tea

**Dinner:**
• 1 glass before meal

**Before Bed:**
��� 1 glass (not too much, disturbs sleep)

⚠️ **Seek Medical Help if:**
• Severe diarrhea (>10 stools/day)
• Vomiting everything (can't keep fluids down)
• Blood in stool or vomit
• High fever with dehydration
• Confusion, extreme weakness
• No urine for 12+ hours
• Signs of shock (pale, cold, rapid pulse)
• Infant < 6 months with any dehydration

💡 **Special Situations:**

**During Fever:**
• Drink extra 1-2 liters per day
• ORS solution preferred

**During Diarrhea:**
• ORS after each loose stool
• Zinc supplement
• Don't stop eating

**During Exercise:**
• Drink 500ml 2 hours before
• 200ml every 15-20 minutes during
• 500-1000ml after exercise

**Pregnancy:**
• Need 3-4 liters daily
• Prevents constipation, UTI
• Reduces swelling

✅ **Quick Hydration Hacks:**
• Add lemon/mint to water (makes it tasty)
• Eat fruits with high water content
• Freeze ORS as ice pops (kids love it)
• Herbal teas (count as fluid)
• Set hourly phone reminders
• Use marked water bottle (track intake)

🚫 **Don't:**
• Wait until very thirsty (already dehydrated)
• Rely only on drinks during illness (need ORS)
• Give plain water to infants < 6 months (give breast milk or ORS)
• Over-hydrate (rare, but possible - max 1 liter/hour)`,
  },

  // ============= FIRST AID FOR BURNS =============
  {
    topic: 'Burns First Aid',
    keywords: ['burn', 'scalding', 'hot water', 'fire', 'burnt skin', 'thermal injury'],
    category: 'first-aid',
    severity: 'high',
    response: `**BURNS - First Aid & Treatment**

🔥 **Types of Burns:**

**First-Degree (Superficial):**
• Only outer layer of skin (epidermis)
• Red, painful, dry (no blisters)
• Mild swelling
• Example: Mild sunburn, brief contact with hot object
• Heals in 3-7 days, no scarring

**Second-Degree (Partial Thickness):**
• Outer and underlying layer of skin
• Red, swollen, very painful
• Blisters (clear fluid-filled)
• Wet, shiny appearance
• Heals in 2-3 weeks, may scar

**Third-Degree (Full Thickness):**
• All skin layers destroyed
• White, black, or charred appearance
• Leathery texture
• May be PAINLESS (nerves destroyed)
• Requires surgery, skin grafting
• SEVERE - Always hospital

**Fourth-Degree:**
• Extends to muscle and bone
• Life-threatening
• EMERGENCY

🚨 **IMMEDIATE FIRST AID (First 5 Minutes are CRITICAL):**

**1. STOP the Burning Process:**
• Remove from heat source immediately
• Put out flames (stop, drop, roll)
• Remove hot liquids (take off clothes if soaked)
• Turn off electricity (if electrical burn)
• Remove jewelry, watches, tight clothing GENTLY (before swelling)

**2. COOL the Burn (MOST IMPORTANT):**
• Run cool (NOT ice cold) water over burn for 20 minutes
• Use tap water or clean water
• Start within 30 seconds if possible
• Continue for 20 full minutes minimum
• If can't use running water: Apply cool wet compresses

**Why 20 minutes?**
• Stops burning process
• Reduces pain significantly
• Prevents deeper damage
• Reduces swelling

**3. ASSESS the Burn:**
• **Small (< size of palm):** Can treat at home if first-degree
• **Large or second/third-degree:** Go to hospital

**4. COVER the Burn:**
• Use sterile non-stick gauze or clean cloth
• Loosely cover (don't wrap tight)
• Purpose: Prevent infection, reduce pain

🚫 **NEVER DO (Can Make It Worse):**
• ❌ Apply ice directly (damages tissue further)
• ❌ Apply butter, oil, ghee, toothpaste, turmeric
• ❌ Apply egg white or any home remedies
• ❌ Break blisters (increases infection risk)
• ❌ Remove stuck clothing (leave for doctor)
• ❌ Use cotton wool directly on burn (fibers stick)
• ❌ Apply antibiotic creams initially (only after cooling)

💊 **Treatment:**

**For First-Degree Burns (Home Treatment):**

**Days 1-3:**
• Cool with water 3-4 times daily
• After cooling, apply:
  - Aloe vera gel (natural, soothing) OR
  - Burn cream (Silver sulfadiazine) - thin layer
• Cover with non-stick gauze
• Change dressing daily
• Pain relief: Paracetamol 500mg every 6 hours

**Days 4-7:**
• Continue burn cream
• Keep moisturized (aloe vera)
• Protect from sun
• Skin will peel (normal), don't pick

**For Second-Degree Burns:**

**DO NOT break blisters** - They protect against infection

**If blister intact:**
• Keep clean and covered
• Apply antibiotic ointment around (not on) blister
• Change dressing daily
• If blister breaks on its own:
  - Clean gently with soap and water
  - Apply antibiotic cream (Neosporin, Soframycin)
  - Cover with non-stick dressing

**See Doctor for:**
• Burns larger than 3 inches (7.5 cm)
• Burns on face, hands, feet, genitals, joints
• All second-degree burns (infection risk high)
• Any third-degree burn

**Third-Degree Burns:**
🚨 **EMERGENCY - Call 108 immediately**
• Don't remove burned clothing
• Cover with clean cloth
• Monitor breathing
• Treat for shock (lay flat, elevate legs)
• Don't give anything by mouth

⚠️ **Go to Hospital URGENTLY if:**
• Burn > 3 inches in diameter
• Burn on face, hands, feet, genitals, major joints
• Burn wraps around arm or leg (circumferential)
• Electrical burn (internal damage possible)
• Chemical burn
• Burn caused by explosion
• Difficulty breathing (smoke inhalation)
• Signs of infection:
  - Increased pain after 2-3 days
  - Increased redness spreading
  - Pus, foul smell
  - Fever > 100.4°F (38°C)
  - Red streaks from burn
  - Swelling increasing

💊 **Medications:**

**Pain Relief:**
• Paracetamol 500-1000mg - Every 6 hours
• Ibuprofen 400mg - Every 8 hours (with food)
• For severe pain: Doctor may prescribe stronger

**Infection Prevention:**
• **Silver Sulfadiazine cream (SSD)** - Gold standard for burns
  - Apply thin layer twice daily
  - Available as: Silverex, Burnol Plus, SSD cream
• **Neosporin/Soframycin** - For small burns
• **Oral antibiotics** - If infection signs (doctor will prescribe)

**Tetanus Shot:**
• Essential if not vaccinated in last 5 years
• Get within 48 hours of burn

🏥 **Hospital Treatment May Include:**
• IV fluids (for large burns)
• Stronger pain medication
• Debridement (removing dead tissue)
• Skin grafts (for third-degree)
• Specialized burn unit care

⏰ **Healing Timeline:**

**First-Degree:**
• Days 1-3: Red, painful
• Days 3-5: Peeling starts
• Day 7: Healed, pink skin
• Week 2-3: Color matches normal skin

**Second-Degree:**
• Week 1: Blisters form/break
• Weeks 2-3: New skin grows
• Weeks 3-4: Healed but pink
• May scar (use scar creams)

**Third-Degree:**
• Months with treatment
• Surgery needed
• Permanent scarring
• Physical therapy required

🛡️ **Prevention:**

**Kitchen Safety:**
• Turn pot handles inward on stove
• Keep hot items away from edge
• Use oven mitts
• Keep children away from stove
• Test bath water before use (especially for kids)
• Store hot liquids safely

**Electrical Safety:**
• Don't overload sockets
• Repair damaged wires
• Keep electrical items away from water
• Use surge protectors

**Fire Safety:**
• Have fire extinguisher at home
• Smoke detectors in bedrooms
• Know stop-drop-roll technique
• Keep matches/lighters away from children

**Sun Protection:**
• Use sunscreen SPF 30+
• Wear protective clothing
• Avoid sun 10 AM - 4 PM

💡 **Special Burns:**

**Chemical Burns:**
• Brush off dry chemical first
• Flush with water for 20-30 minutes
• Remove contaminated clothing
• Call poison control
• Go to hospital

**Electrical Burns:**
• Turn off power source first
• Don't touch victim if still in contact
• Call 108 - May have internal injuries
• Hospital mandatory

**Sunburn:**
• Cool showers
• Aloe vera gel
• Moisturize frequently
• Ibuprofen for pain
• Stay hydrated
• Stay out of sun until healed

✅ **Wound Care Tips:**
• Keep burn clean and dry between dressing changes
• Watch for infection signs daily
• Don't pop blisters
• Elevate burned limb (reduces swelling)
• Eat protein-rich foods (aids healing)
• Stay hydrated
• Vitamin C and zinc supplements help healing

📝 **Scar Prevention:**
• Apply silicone gel sheets (after healing)
• Massage scar with moisturizer
• Use sunscreen on healed area (SPF 50+)
• Vitamin E oil may help
• Keep area moisturized always
• Avoid sun exposure for 6-12 months`,
  },

  // ============= STOMACH ACHE =============
  {
    topic: 'Stomach Pain and Digestive Issues',
    keywords: ['stomach', 'stomach pain', 'stomach ache', 'abdominal pain', 'belly pain', 'tummy ache', 'acidity', 'gas'],
    category: 'condition',
    severity: 'medium',
    response: `**STOMACH PAIN - Causes & Treatment**

📋 **Types of Stomach Pain:**

**1. INDIGESTION / GAS**
**Symptoms:**
• Bloating, fullness after eating
• Burping, flatulence
• Upper stomach discomfort
• Mild pain

**Causes:**
• Overeating
• Eating too fast
• Spicy, oily, fried foods
• Carbonated drinks

**Treatment:**
• Antacid syrup (Digene, ENO) - 2 tsp after meals
• Avoid spicy/oily food for 2-3 days
• Eat small frequent meals
• Walk after meals (aids digestion)
• Drink warm water
• Ajwain (carom seeds) water

**2. ACIDITY / GERD (Gastroesophageal Reflux)**
**Symptoms:**
• Burning sensation in chest (heartburn)
• Sour taste in mouth
• Pain in upper stomach
• Worse when lying down

**Causes:**
• Excess stomach acid
• Spicy food, coffee, alcohol
• Smoking
• Stress
• Lying down after eating

**Treatment:**
• **Proton Pump Inhibitors (PPIs):**
  - Omeprazole 20mg - Once before breakfast (7-14 days)
  - Pantoprazole 40mg - Alternative
• **Antacids:** ENO, Gelusil - Immediate relief
• **H2 Blockers:** Ranitidine 150mg - Twice daily

**Lifestyle:**
• Eat 2-3 hours before sleeping
• Elevate head of bed
• Avoid tight clothing
• Lose weight if overweight
• Avoid: Coffee, alcohol, chocolate, citrus, tomatoes

**3. CONSTIPATION**
**Symptoms:**
• Difficulty passing stool
• Hard, dry stool
• Straining
• Feeling of incomplete evacuation
• Lower stomach pain

**Treatment:**
• Drink 10-12 glasses water daily
• Eat high-fiber foods (fruits, vegetables, whole grains)
• Laxatives (if needed):
  - Isabgol (Psyllium husk) - 2 tsp in water at bedtime
  - Lactulose syrup - 15-30ml at bedtime
• Exercise daily
• Establish regular bowel habit

**4. DIARRHEA / LOOSE MOTION**
**Symptoms:**
• Watery stools (>3 times/day)
• Urgency
• Cramping
• Nausea

**Treatment:**
• ORS solution - After each loose stool
• Zinc tablets 20mg - Once daily for 14 days
• Light diet (rice, banana, toast, curd)
• Probiotics
• Loperamide 2mg - Only if no fever/blood in stool
• See section on Dehydration (very important)

**5. GASTROENTERITIS (Stomach Flu)**
**Symptoms:**
• Nausea, vomiting
• Diarrhea
• Stomach cramps
• Low fever
• Headache, body ache

**Treatment:**
• ORS solution frequently
• Ondansetron 4mg - For vomiting (max 2 times/day)
• Paracetamol 500mg - For fever/pain
• Light diet after vomiting stops
• Rest
• Visit doctor if severe or not improving in 24 hours

**6. FOOD POISONING**
**Symptoms:**
• Sudden severe nausea/vomiting
• Diarrhea
• Stomach cramps
• Fever
• Starts 2-6 hours after eating contaminated food

**Treatment:**
• Stop eating solid food for 4-6 hours
• Sip ORS every 10-15 minutes
• Activated charcoal tablets (if very recent)
• Antibiotics if bacterial (doctor will decide)
• Hospital if severe dehydration

**7. GASTRITIS (Stomach Inflammation)**
**Symptoms:**
• Burning pain in upper stomach
• Worse on empty stomach
• Nausea
• Loss of appetite
• Bloating

**Treatment:**
• Omeprazole 20mg - Before breakfast for 2-4 weeks
• Antacids - As needed
• Avoid: Spicy food, alcohol, NSAIDs (ibuprofen, aspirin)
• Eat small frequent meals
• Stress management

💊 **Common Medicines:**

**For Acidity:**
• Omeprazole 20mg - Morning empty stomach
• Pantoprazole 40mg - Alternative
• Antacid (Digene/Gelusil) - After meals, bedtime

**For Gas/Bloating:**
• Simethicone drops - 3 times daily
• Activated charcoal tablets
• Digestive enzymes (Unienzyme) - With meals

**For Nausea/Vomiting:**
• Ondansetron 4mg - Dissolves on tongue
• Domperidone 10mg - Before meals
• Ginger tea (natural remedy)

**For Stomach Cramps:**
• Dicyclomine 10mg - 3 times daily (antispasmodic)
• Hyoscine (Buscopan) - For cramps

🏠 **Home Remedies:**

**For Acidity:**
• Cold milk (instant relief)
• Coconut water
• Banana (natural antacid)
• Fennel seeds (saunf) after meals

**For Gas:**
• Ajwain (carom seeds) water
• Jeera (cumin) water
• Ginger tea
• Warm water

**For Indigestion:**
• Lemon water
• Buttermilk
• Papaya (digestive enzyme)
• Walk after meals

🚨 **EMERGENCY - Go to Hospital if:**
• Severe sudden pain (like being stabbed)
• Pain with fever > 101°F
• Vomiting blood (red or coffee-ground appearance)
• Blood in stool (red or black tarry stool)
• Severe pain with vomiting (may be appendicitis)
• Stomach hard and rigid
• Pregnant and severe pain
• Pain radiating to chest, shoulder, back
• Unable to pass stool or gas for days
• Yellow skin/eyes (jaundice)
• Weakness, dizziness, fainting

⚠️ **See Doctor if:**
• Pain lasts more than 24 hours
• Getting progressively worse
• Chronic (recurring) stomach issues
• Weight loss without trying
• Pain with urination (UTI)
• Pain in lower right abdomen (appendicitis)

🍽️ **BRAT Diet (For Recovery):**
When recovering from stomach upset, start with:
• **B**ananas - Easy to digest, potassium
• **R**ice - White rice, plain
• **A**pplesauce - Gentle on stomach
• **T**oast - Plain, without butter

Then gradually add:
• Boiled potatoes
• Plain crackers
• Khichdi (rice + dal, very light)
• Curd
• Boiled vegetables

🚫 **Avoid When Stomach Upset:**
• Spicy food
• Oily, fried food
• Dairy (except curd)
• Caffeine
• Alcohol
• Citrus fruits
• Raw vegetables
• Beans, lentils (cause gas)

🛡️ **Prevention:**

**General:**
• Eat at regular times
• Chew food slowly (20-30 times)
• Don't skip meals
• Smaller, more frequent meals
• Stay hydrated
• Exercise regularly
• Manage stress
• Adequate sleep

**Food Hygiene:**
• Wash hands before eating
• Wash fruits and vegetables
• Cook food thoroughly
• Avoid street food if stomach sensitive
• Drink clean/boiled water
• Check expiry dates

**Lifestyle:**
• Don't eat late at night
• Avoid lying down right after eating
• Manage stress (yoga, meditation)
• Limit alcohol and smoking
• Maintain healthy weight

💡 **When to Worry (Serious Conditions):**

**Appendicitis:**
• Pain starts around navel, moves to lower right
• Worsens over 12-24 hours
• Fever, nausea, loss of appetite
• Pain when pressing then releasing (rebound tenderness)
🚨 EMERGENCY - Call 108

**Gallstones:**
• Severe pain in upper right abdomen
• Pain after fatty meals
• Radiates to back/shoulder
• Nausea, vomiting

**Ulcer:**
• Burning pain in upper stomach
• Worse on empty stomach, better after eating (duodenal ulcer)
• Or worse after eating (gastric ulcer)
• Need endoscopy for diagnosis

**Kidney Stone:**
• Severe cramping pain in back/side
• Radiates to groin
• Pain comes in waves
• Blood in urine
• Nausea

📝 **Keep Track:**
• When pain occurs (before/after meals, night)
• What makes it better/worse
• Type of pain (sharp, dull, cramping, burning)
• Location (upper, lower, left, right)
• Associated symptoms
• Duration
This helps doctor diagnose!`,
  },

  // ============= EMERGENCY NUMBERS =============
  {
    topic: 'Emergency Contact Numbers',
    keywords: ['emergency', 'ambulance', 'helpline', 'emergency number', 'hospital', 'urgent'],
    category: 'faq',
    severity: 'critical',
    response: `**EMERGENCY CONTACT NUMBERS - India**

🚨 **NATIONAL EMERGENCY NUMBERS:**

**📞 112** - National Emergency Number (NEW)
• Single number for all emergencies
• Police, Fire, Ambulance
• Available 24/7 across India
• Can also send SMS to 112

**🚑 108** - Ambulance Service (FREE)
• Free ambulance service
• Available in most states
• Trained paramedics
• 24/7 emergency response
• Call immediately for:
  - Chest pain, heart attack
  - Difficulty breathing
  - Severe bleeding
  - Unconsciousness
  - Serious accident
  - Stroke symptoms

**🚓 100** - Police
• For crimes, accidents, threats
• Available 24/7

**🚒 101** - Fire Service
• Fire emergencies
• Building collapse
• Gas leak

**👮 1091** - Women Helpline
• Women in distress
• Domestic violence
• Eve-teasing, harassment

**🚨 1098** - Child Helpline
• Children in need
• Child abuse, missing children
• Available 24/7

**MEDICAL EMERGENCIES:**

**☎️ 102** - Medical Helpline (Some states)
• Health advice
• Non-emergency medical transport

**🧪 1800-111-545** - National Health Helpline
• Health information
• Free health advice

**💊 1800-11-4477** - FSSAI Food Safety Helpline
• Food poisoning
• Contaminated food complaints

**MENTAL HEALTH:**

**🧠 08046110007** - Vandrevala Foundation
• Mental health support
• Suicide prevention
• Available 24/7
• Free and confidential

**📱 9820466726** - AASRA (Mumbai)
• Suicide prevention
• Emotional support

**POISON CONTROL:**

**☠️ 1066** - National Poisons Information Centre (AIIMS Delhi)
• Poisoning emergencies
• Overdose information

**COVID-19:**

**😷 1075** - COVID-19 Helpline
• COVID information
• Testing centers
• Vaccination queries

**STATE-SPECIFIC NUMBERS:**
(Check your state government website for local emergency numbers)

**WHAT TO SAY WHEN CALLING 108:**

Stay calm and provide:
1. **Nature of emergency:**
   - "Heart attack" / "Accident" / "Severe bleeding" etc.

2. **Location (MOST IMPORTANT):**
   - Exact address
   - Nearby landmark
   - PIN code if known

3. **Patient condition:**
   - Conscious or unconscious
   - Breathing or not
   - Any visible injuries

4. **Contact number:**
   - Your mobile number
   - Stay on line until help arrives

**STAY ON THE LINE:** Dispatcher may give you first aid instructions

🏥 **WHEN TO CALL AMBULANCE (108):**

**IMMEDIATE - Don't Wait:**
• Chest pain (possible heart attack)
• Difficulty breathing
• Unconscious or unresponsive
• Severe bleeding that won't stop
• Suspected stroke (face drooping, arm weakness, speech difficulty)
• Severe head injury
• Seizures/convulsions
• Suspected poisoning
• Severe burns
• Major trauma/accident
• Choking (can't breathe)
• Allergic reaction with difficulty breathing
• Severe stomach pain with rigidity
• Suspected snake bite

**BEFORE AMBULANCE ARRIVES:**

**For Chest Pain:**
• Make patient sit or lie down
• Loosen tight clothing
• Give aspirin 300mg if available (chew)
• Don't leave patient alone

**For Bleeding:**
• Apply firm pressure with clean cloth
• Elevate injured part
• Don't remove embedded objects

**For Unconscious Person:**
• Check breathing
• Place in recovery position (on side)
• Don't give anything by mouth
• Monitor until help arrives

**For Choking:**
• Heimlich maneuver (abdominal thrusts)
• Back blows between shoulder blades

📱 **EMERGENCY APPS:**

• **Red Panic Button App** - Instant SOS to contacts
• **Smart 24x7** - Emergency services app
• **Shake2Safety** - Shake phone to send SOS
• **bSafe** - Personal safety app

⚠️ **IMPORTANT REMINDERS:**

✅ **DO:**
• Keep emergency numbers saved in phone
• Know your address/location clearly
• Keep calm when calling
• Follow dispatcher instructions
• Stay with patient until help arrives
• Have medical history ready if possible

❌ **DON'T:**
• Don't panic
• Don't give false alarms (it's a crime)
• Don't hang up until told
• Don't move seriously injured person (except if immediate danger)

💡 **PREPARE NOW:**
• Save 108 in phone as "EMERGENCY AMBULANCE"
• Keep ICE (In Case of Emergency) contacts in phone
• Keep list of allergies, blood type, current medicines
• Know location of nearest hospital
• Keep first aid kit at home

**ICE CONTACT:**
Save emergency contact in phone as:
"ICE - [Name]" (Example: ICE - Mother)
Paramedics look for ICE contacts if patient unconscious`,
  },
];

/**
 * Search knowledge base for relevant information
 */
export function searchMedicalKnowledge(query: string): MedicalTopic[] {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ topic: MedicalTopic; score: number }> = [];

  for (const topic of MEDICAL_KNOWLEDGE_BASE) {
    let score = 0;

    // Check if any keyword matches
    for (const keyword of topic.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 10;
        // Boost score if exact match
        if (lowerQuery === keyword.toLowerCase()) {
          score += 20;
        }
      }
    }

    // Check topic name
    if (lowerQuery.includes(topic.topic.toLowerCase())) {
      score += 15;
    }

    if (score > 0) {
      results.push({ topic, score });
    }
  }

  // Sort by relevance score (highest first)
  results.sort((a, b) => b.score - a.score);

  // Return top 3 most relevant
  return results.slice(0, 3).map(r => r.topic);
}

/**
 * Get response based on query
 */
export function getMedicalResponse(query: string, language: 'en' | 'hi' | 'ta' = 'en'): string {
  const matches = searchMedicalKnowledge(query);

  if (matches.length > 0) {
    // Return the most relevant match
    const bestMatch = matches[0];

    // For English, return full response
    if (language === 'en') {
      return bestMatch.response;
    }

    // For Hindi and Tamil, translate the response
    return translateMedicalContent(bestMatch, language);
  }

  // Default response if no match
  const defaultResponses = {
    en: `I don't have specific information about that topic in my knowledge base. However, I recommend:

• For medical concerns, consult a doctor
• For emergencies, call 108 immediately
• You can ask me about: common cold, fever, cuts, allergies, diet, headache, stomach pain, burns, dehydration, or emergency numbers

What specific health topic would you like to know about?`,
    hi: `मुझे इस विषय के बारे में विशेष जानकारी नहीं है। लेकिन मैं सुझाव देता हूं:

• स्वास्थ्य समस्याओं के लिए डॉक्टर से परामर्श लें
• आपातकाल में तुरंत 108 पर कॉल करें
• आप मुझसे पूछ सकते हैं: सर्दी-जुकाम, बुखार, घाव, एलर्जी, आहार, सिरदर्द, पेट दर्द, जलना, डिहाइड्रेशन, या आपातकालीन नंबर

आप किस स्वास्थ्य विषय के बारे में जानना चाहते हैं?`,
    ta: `இந்த தலைப்பைப் பற்றிய குறிப்பிட்ட தகவல் என்னிடம் இல்லை. இருப்பினும், நான் பரிந்துரைக்கிறேன்:

• மருத்துவ கவலைகளுக்கு மருத்துவரை அணுகவும்
• அவசரநிலைகளுக்கு உடனடியாக 108 ஐ அழைக்கவும்
• நீங்கள் என்னிடம் கேட்கலாம்: சளி, காய்ச்சல், காயங்கள், ஒவ்வாமை, உணவு, தலைவலி, வயிற்று வலி, தீக்காயங்கள், நீர்ச்சத்து குறைபாடு, அல்லது அவசர எண்கள்

நீங்கள் எந்த உடல்நல தலைப்பைப் பற்றி தெரிந்து கொள்ள விரும்புகிறீர்கள்?`,
  };

  return defaultResponses[language];
}

/**
 * Translate medical content to Hindi or Tamil
 */
function translateMedicalContent(topic: MedicalTopic, language: 'hi' | 'ta'): string {
  // Get translation map for common medical terms
  const medicalTranslations = getMedicalTranslations(language);
  
  // For key topics, provide full translations
  const keyTopicTranslations = getKeyTopicTranslations();
  
  if (keyTopicTranslations[topic.topic] && keyTopicTranslations[topic.topic][language]) {
    return keyTopicTranslations[topic.topic][language];
  }

  // Otherwise provide translated summary
  return getTranslatedSummary(topic, language);
}

/**
 * Get full translations for key medical topics
 */
function getKeyTopicTranslations(): Record<string, Record<'hi' | 'ta', string>> {
  return {
    'Common Cold': {
      hi: `**सर्दी-जुकाम (वायरल श्वसन संक्रमण)**

📋 **यह क्या है?**
• राइनोवायरस के कारण नाक और गले का संक्रमण
• बहुत संक्रामक, बूंदों और संपर्क से फैलता है
• आमतौर पर 7-10 दिन तक रहता है

🔍 **लक्षण:**
• बहती या बंद नाक • छींक आना • हल्का गला दर्द • हल्की खांसी
• हल्का बुखार • हल्का शरीर दर्द

💊 **उपचार - दवाएं:**
• पैरासिटामोल 500mg - हर 6 घंटे (बुखार/दर्द के लिए)
• सेटीरिज़िन 10mg - रात में सोते समय (बहती नाक के लिए)
• कफ सिरप - सूखी खांसी के लिए दिन में 3 बार
• विटामिन C 500mg - दिन में एक बार

🏠 **घरेलू उपचार:**
• भाप लेना (दिन में 2-3 बार, 10 मिनट)
• गर्म नमक के पानी से गरारे (दिन में 3-4 बार)
• गर्म पानी, अदरक की चाय, शहद-नींबू पानी
• पर्याप्त आराम (7-8 घंटे की नींद)

⚠️ **डॉक्टर को दिखाएं यदि:**
• 10 दिनों से अधिक लक्षण • तेज बुखार > 101°F
• सांस लेने में कठिनाई • गाढ़ा हरा/पीला बलगम

🛡️ **रोकथाम:**
• बार-बार हाथ धोएं • बीमार लोगों से दूर रहें
• विटामिन C और जिंक लें • स्वस्थ आहार खाएं`,
      ta: `**சளி (வைரஸ் சுவாச நோய்த்தொற்று)**

📋 **இது என்ன?**
• மூக்கு மற்றும் தொண்டை வைரஸ் தொற்று
• மிகவும் தொற்றக்கூடியது
• பொதுவாக 7-10 நாட்கள் நீடிக்கும்

🔍 **அறிகுறிகள்:**
• மூக்கு ஒழுகுதல் அல்லது அடைப்பு • தும்மல் • தொண்டை வலி
• இருமல் • லேசான காய்ச்சல் • உடல் வலி

💊 **சிகிச்சை - மருந்துகள்:**
• பாராசிட்டமால் 500mg - 6 மணி நேரத்திற்கு ஒருமுறை
• செட்டிரிசின் 10mg - இரவில் (மூக்கு ஒழுகல்)
• இருமல் மருந்து - நாளைக்கு 3 முறை
• வைட்டமின் C 500mg - நாளைக்கு ஒருமுறை

🏠 **வீட்டு வைத்தியம்:**
• நீராவி பிடித்தல் (நாளைக்கு 2-3 முறை)
• உப்பு நீரில் கொப்பளித்தல் (நாளைக்கு 3-4 முறை)
• சூடான நீர், இஞ்சி தேநீர், தேன்-எலுமிச்சை
• போதுமான ஓய்வு (7-8 மணி நேர தூக்கம்)

⚠️ **மருத்துவரை பாருங்கள்:**
• 10 நாட்களுக்கு மேல் அறிகுறிகள் • அதிக காய்ச்சல் > 101°F
• சுவாசிப்பதில் சிரமம் • பச்சை/மஞ்சள் தடித்த சளி

🛡️ **தடுப்பு:**
• அடிக்கடி கைகளை கழுவவும் • நோயுற்றவர்களிடமிருந்து விலகி இருங்கள்
• வைட்டமின் C மற்றும் ஜிங்க் எடுக்கவும்`,
    },
    'Fever Management': {
      hi: `**बुखार - पूर्ण प्रबंधन गाइड**

🌡️ **बुखार क्या है?**
• शरीर का तापमान 100.4°F (38°C) से अधिक
• सामान्य: 97-99°F
• संक्रमण के खिलाफ शरीर की रक्षा प्रणाली

📊 **बुखार वर्गीकरण:**
• हल्का: 100.4-102°F - आमतौर पर गंभीर नहीं
• मध्यम: 102-104°F - करीब से निगरानी करें
• तेज: 104°F से ऊपर - तुरंत डॉक्टर को दिखाएं

💊 **उपचार - दवाएं:**
• **पैरासिटामोल 500mg**
  - वयस्क: हर 6-8 घंटे में 1-2 गोली
  - अधिकतम: दिन में 8 गोलियां
  - सबसे सुरक्षित बुखार की दवा

• **इबुप्रोफेन 400mg** (विकल्प)
  - हर 8 घंटे में 1 गोली
  - भोजन के साथ लें

⚠️ **डेंगू/वायरल बुखार में बचें:**
• एस्पिरिन • इबुप्रोफेन • डाइक्लोफेनाक
(ये डेंगू में खून बह सकता है)

🏠 **घरेलू देखभाल:**

**शरीर को ठंडा करें:**
• गुनगुने पानी से स्पंज स्नान (ठंडा नहीं!)
• माथे पर ठंडा गीला कपड़ा रखें
• हल्के सूती कपड़े पहनें
• कमरे का तापमान आरामदायक रखें

**हाइड्रेशन (बहुत महत्वपूर्ण):**
• दिन में 10-12 गिलास पानी पिएं
• ORS घोल - 1 लीटर पानी में 1 पैकेट
• नारियल पानी - प्राकृतिक इलेक्ट्रोलाइट्स
• ताजा फलों का रस
• गर्म सूप, दाल का पानी

**आराम:**
• पूर्ण बिस्तर पर आराम
• 8-10 घंटे सोएं

⚠️ **तुरंत डॉक्टर को दिखाएं यदि:**
• 2 दिन से अधिक समय तक 103°F से ऊपर बुखार
• गंभीर सिरदर्द के साथ बुखार
• गर्दन में अकड़न (ठुड्डी छाती को नहीं छू सकती)
• दाने के साथ बुखार (डेंगू, मेनिनजाइटिस)
• खून बहना (नाक, मसूड़े, मूत्र)
• सांस लेने में कठिनाई
• अत्यधिक उनींदापन/भ्रम

🦟 **डेंगू बुखार - विशेष देखभाल:**
• केवल पैरासिटामोल लें
• खूब तरल पदार्थ पिएं (ORS, नारियल पानी)
• प्लेटलेट काउंट की निगरानी करें
• चेतावनी संकेतों पर ध्यान दें`,
      ta: `**காய்ச்சல் - முழுமையான மேலாண்மை வழிகாட்டி**

🌡️ **காய்ச்சல் என்றால் என்ன?**
• உடல் வெப்பநிலை 100.4°F (38°C) க்கு மேல்
• சாதாரண: 97-99°F
• நோய்த்தொற்றுக்கு எதிரான உடலின் பாதுகாப்பு

📊 **காய்ச்சல் வகைப்பாடு:**
• லேசானது: 100.4-102°F - பொதுவாக தீவிரமானது அல்ல
• மிதமானது: 102-104°F - நெருக்கமாக கண்காணிக்கவும்
• அதிகம்: 104°F க்கு மேல் - உடனடியாக மருத்துவரை பாருங்கள்

💊 **சிகிச்சை - மருந்துகள்:**
• **பாராசிட்டமால் 500mg**
  - பெரியவர்கள்: 6-8 மணி நேரத்திற்கு ஒருமுறை 1-2 மாத்திரைகள்
  - அதிகபட்சம்: நாளைக்கு 8 மாத்திரைகள்
  - மிகவும் பாதுகாப்பான காய்ச்சல் மருந்து

• **இபுப்ரோஃபன் 400mg** (மாற்று)
  - 8 மணி நேரத்திற்கு ஒருமுறை 1 மாத்திரை
  - உணவுடன் எடுக்கவும்

⚠️ **டெங்கு/வைரல் காய்ச்சலில் தவிர்க்கவும்:**
• ஆஸ்பிரின் • இபுப்ரோஃபன் • டைக்ளோஃபெனாக்
(இவை டெங்குவில் இரத்தப்போக்கை ஏற்படுத்தலாம்)

🏠 **வீட்டு பராமரிப்பு:**

**உடலை குளிர்விக்கவும்:**
• வெதுவெதுப்பான நீரில் ஸ்பாஞ்ச் குளியல்
• நெற்றியில் குளிர்ந்த ஈர துணி வைக்கவும்
• லேசான பருத்தி ஆடைகள் அணியவும்

**நீர்ச்சத்து (மிக முக்கியம்):**
• நாளைக்கு 10-12 கிளாஸ் தண்ணீர் குடிக்கவும்
• ORS கரைசல் - 1 லிட்டர் நீரில் 1 பாக்கெட்
• தேங்காய் நீர் - இயற்கை எலக்ட்ரோலைட்டுகள்
• புதிய பழச்சாறுகள்
• சூடான சூப், பருப்பு நீர்

**ஓய்வு:**
• முழு படுக்கை ஓய்வு
• 8-10 மணி நேரம் தூங்கவும்

⚠️ **உடனடியாக மருத்துவரை பாருங்கள்:**
• 2 நாட்களுக்கு மேல் 103°F க்கு மேல் காய்ச்சல்
• கடுமையான தலைவலியுடன் காய்ச்சல்
• கழுத்து விறைப்பு (கன்னம் மார்பைத் தொட முடியாது)
• சொறியுடன் காய்ச்சல் (டெங்கு, மெனிஞ்சைடிஸ்)
• இரத்தப்போக்கு (மூக்கு, ஈறுகள், சிறுநீர்)
• சுவாசிப்பதில் சிரமம்
• அதிக தூக்கம்/குழப்பம்

🦟 **டெங்கு காய்ச்சல் - சிறப்பு பராமரிப்பு:**
• பாராசிட்டமால் மட்டும் எடுக்கவும்
• நிறைய திரவங்கள் குடிக்கவும் (ORS, தேங்காய் நீர்)
• பிளேட்லெட் எண்ணிக்கையை கண்காணிக்கவும்
• எச்சரிக்கை அறிகுறிகளைக் கவனிக்கவும்`,
    },
    'Emergency Contact Numbers': {
      hi: `**आपातकालीन संपर्क नंबर - भारत**

🚨 **राष्ट्रीय आपातकालीन नंबर:**

**📞 112** - राष्ट्रीय आपातकालीन नंबर (नया)
• सभी आपात स्थितियों के लिए एकल नंबर
• पुलिस, फायर, एम्बुलेंस
• भारत भर में 24/7 उपलब्ध

**🚑 108** - एम्बुलेंस सेवा (मुफ्त)
• मुफ्त एम्बुलेंस सेवा
• अधिकांश राज्यों में उपलब्ध
• 24/7 आपातकालीन प्रतिक्रिया
• तुरंत कॉल करें:
  - सीने में दर्द, दिल का दौरा
  - सांस लेने में कठिनाई
  - गंभीर खून बहना
  - बेहोशी
  - गंभीर दुर्घटना

**🚓 100** - पुलिस
**🚒 101** - फायर सर्विस
**👮 1091** - महिला हेल्पलाइन
**🚨 1098** - बाल हेल्पलाइन

**चिकित्सा आपातकाल:**
**☎️ 102** - मेडिकल हेल्पलाइन
**🧠 08046110007** - वंद्रेवाला फाउंडेशन (मानसिक स्वास्थ्य)
**☠️ 1066** - जहर सूचना केंद्र

**108 पर कॉल करते समय क्या कहें:**

शांत रहें और प्रदान करें:
1. **आपातकाल का प्रकार:**
   "दिल का दौरा" / "दुर्घटना" / "गंभीर खून बहना"

2. **स्थान (सबसे महत्वपूर्ण):**
   - सटीक पता
   - पास का स्थान
   - पिन कोड यदि पता हो

3. **रोगी की स्थिति:**
   - होश में या बेहोश
   - सांस ले रहा है या नहीं
   - कोई दिखाई देने वाली चोटें

🏥 **108 कब कॉल करें:**

तुरंत - प्रतीक्षा न करें:
• सीने में दर्द (दिल का दौरा संभव)
• सांस लेने में कठिनाई
• बेहोश या प्रतिक्रिया नहीं
• गंभीर खून बहना जो नहीं रुकता
• स्ट्रोक (चेहरा लटकना, हाथ की कमजोरी)
• गंभीर सिर की चोट
• दौरे/आक्षेप
• संदिग्ध विषाक्तता
• गंभीर जलन
• बड़ी दुर्घटना/आघात

⚠️ **महत्वपूर्ण अनुस्मारक:**
✅ फोन में आपातकालीन नंबर सहेजें
✅ अपना पता/स्थान स्पष्ट रूप से जानें
✅ कॉल करते समय शांत रहें`,
      ta: `**அவசர தொடர்பு எண்கள் - இந்தியா**

🚨 **தேசிய அவசர எண்கள்:**

**📞 112** - தேசிய அவசர எண் (புதிது)
• அனைத்து அவசரநிலைகளுக்கும் ஒற்றை எண்
• போலீஸ், தீ, ஆம்புலன்ஸ்
• இந்தியா முழுவதும் 24/7 கிடைக்கும்

**🚑 108** - ஆம்புலன்ஸ் சேவை (இலவசம்)
• இலவச ஆம்புலன்ஸ் சேவை
• பெரும்பாலான மாநிலங்களில் கிடைக்கும்
• 24/7 அவசர பதில்
• உடனடியாக அழைக்கவும்:
  - மார்பு வலி, மாரடைப்பு
  - சுவாசிப்பதில் சிரமம்
  - கடுமையான இரத்தப்போக்கு
  - மயக்கம்
  - கடுமையான விபத்து

**🚓 100** - போலீஸ்
**🚒 101** - தீயணைப்பு சேவை
**👮 1091** - பெண்கள் உதவி எண்
**🚨 1098** - குழந்தைகள் உதவி எண்

**மருத்துவ அவசரநிலைகள்:**
**☎️ 102** - மருத்துவ உதவி எண்
**🧠 08046110007** - வந்த்ரேவாலா அறக்கட்டளை (மனநல ஆதரவு)
**☠️ 1066** - விஷ தகவல் மையம்

**108 ஐ அழைக்கும்போது என்ன சொல்ல வேண்டும்:**

அமைதியாக இருங்கள் மற்றும் வழங்கவும்:
1. **அவசரநிலையின் தன்மை:**
   "மாரடைப்பு" / "விபத்து" / "கடுமையான இரத்தப்போக்கு"

2. **இடம் (மிக முக்கியம்):**
   - துல்லியமான முகவரி
   - அருகிலுள்ள இடம்
   - பின் குறியீடு தெரிந்தால்

3. **நோயாளியின் நிலை:**
   • உணர்வு உள்ளதா அல்லது மயக்கமா
   • சுவாசித்துக் கொண்டிருக்கிறாரா இல்லையா
   • தெரியும் காயங்கள் ஏதேனும்

🏥 **108 ஐ எப்போது அழைக்க வேண்டும்:**

உடனடியாக - காத்திருக்க வேண்டாம்:
• மார்பு வலி (மாரடைப்பு சாத்தியம்)
• சுவாசிப்பதில் சிரமம்
• மயக்கம் அல்லது பதிலளிக்கவில்லை
• நிற்காத கடுமையான இரத்தப்போக்கு
• பக்கவாதம் (முகம் தொங்குதல், கை பலவீனம்)
• கடுமையான தலையில் காயம்
• வலிப்பு/இழுப்பு
• சந்தேகத்திற்குரிய விஷம்
• கடுமையான தீக்காயங்கள்
• பெரிய விபத்து/அதிர்ச்சி

⚠️ **முக்கிய நினைவூட்டல்கள்:**
✅ தொலைபேசியில் அவசர எண்களை சேமிக்கவும்
✅ உங்கள் முகவரி/இடத்தை தெளிவாக அறிந்து கொள்ளுங்கள்
✅ அழைக்கும்போது அமைதியாக இருங்கள்`,
    },
  };
}

/**
 * Get common medical translation terms
 */
function getMedicalTranslations(language: 'hi' | 'ta') {
  const translations: Record<'hi' | 'ta', Record<string, string>> = {
    hi: {
      'Symptoms': 'लक्षण',
      'Treatment': 'उपचार',
      'Medicines': 'दवाएं',
      'Home Remedies': 'घरेलू उपचार',
      'Prevention': 'रोकथाम',
      'See Doctor': 'डॉक्टर को दिखाएं',
      'Emergency': 'आपातकाल',
    },
    ta: {
      'Symptoms': 'அறிகுறிகள்',
      'Treatment': 'சிகிச்சை',
      'Medicines': 'மருந்துகள்',
      'Home Remedies': 'வீட்டு வைத்தியம்',
      'Prevention': 'தடுப்பு',
      'See Doctor': 'மருத்துவரை பாருங்கள்',
      'Emergency': 'அவசரநிலை',
    },
  };
  
  return translations[language];
}

/**
 * Provide a translated summary when full translation is not available
 */
function getTranslatedSummary(topic: MedicalTopic, language: 'hi' | 'ta'): string {
  const summaries: Record<'hi' | 'ta', string> = {
    hi: `**${topic.topic} - स्वास्थ्य जानकारी**

यह विषय हमारे ज्ञान आधार में उपलब्ध है।

🏥 **महत्वपूर्ण सलाह:**
• पूर्ण विस्तृत जानकारी के लिए, ऊपर से भाषा को "English" में बदलें
• किसी भी चिकित्सा समस्या के लिए हमेशा डॉक्टर से परामर्श लें
• आपातकाल में तुरंत 108 पर कॉल करें

💡 **मैं आपकी कैसे मदद कर सकता हूं?**
मुझसे पूछें:
• सामान्य सर्दी-जुकाम का इलाज
• बुखार प्रबंधन और देखभाल
• छोटे घाव और कट का उपचार
• एलर्जी और उनका इलाज
• स्वस्थ आहार और पोषण
• सिरदर्द से राहत
• पेट दर्द का इलाज
• जलने का प्राथमिक उपचार
• डिहाइड्रेशन (निर्जलीकरण)
• आपातकालीन संपर्क नंबर

📱 **सुझाव:** अंग्रेजी में पूरी जानकारी मिलेगी। ऊपर से भाषा बदलें।`,
    ta: `**${topic.topic} - உடல்நல தகவல்**

இந்த தலைப்பு எங்கள் அறிவுத் தளத்தில் கிடைக்கிறது.

🏥 **முக்கியமான ஆலோசனை:**
• முழுமையான விரிவான தகவலுக்கு, மேலே உள்ள மொழியை "English" ஆக மாற்றவும்
• எந்த மருத்துவப் பிரச்சினைக்கும் எப்போதும் மருத்துவரை அணுகவும்
• அவசரநிலையில் உடனடியாக 108 ஐ அழைக்கவும்

💡 **நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?**
என்னிடம் கேளுங்கள்:
• சளி சிகிச்சை
• காய்ச்சல் மேலாண்மை மற்றும் பராமரிப்பு
• சிறிய காயங்கள் மற்றும் வெட்டுக்கள் சிகிச்சை
• ஒவ்வாமை மற்றும் அவற்றின் சிகிச்சை
• ஆரோக்கியமான உணவு மற்றும் ஊட்டச்சத்து
• தலைவலி நிவாரணம்
• வயிற்று வலி சிகிச்சை
• தீக்காயங்கள் முதலுதவி
• நீர்ச்சத்து குறைபாடு
• அவசர தொடர்பு எண்கள்

📱 **குறிப்பு:** ஆங்கிலத்தில் முழு தகவல் கிடைக்கும். மேலே மொழியை மாற்றவும்.`,
  };

  return summaries[language];
}
