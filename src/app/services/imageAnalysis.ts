/**
 * MEDICAL IMAGE ANALYSIS SERVICE
 * Analyzes X-rays, wounds, skin conditions, and other medical images
 */

import { grok, GROK_VISION_MODEL, USE_GROK } from './aiService';

export interface ImageAnalysisResult {
  imageType: 'xray' | 'wound' | 'cut' | 'laceration' | 'skin' | 'burn' | 'rash' | 'fracture' | 'unknown';
  findings: string[];
  severity: number; // 0-100
  recommendations: string[];
  medicines?: string[];
  urgency: 'immediate' | 'urgent' | 'routine' | 'non-urgent';
  suggestedSpecialist?: string;
  detectedAbnormalities: Array<{
    type: string;
    location?: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
  }>;
  imageCharacteristics?: {
    woundDepth?: 'superficial' | 'partial' | 'deep' | 'full-thickness';
    woundSize?: 'small' | 'medium' | 'large';
    edgeType?: 'clean' | 'irregular' | 'jagged';
    tissueCondition?: 'healthy' | 'inflamed' | 'necrotic' | 'infected';
  };
}

// Analyze image based on visual characteristics
export async function analyzeImage(imageFile: File, language: string = 'en'): Promise<ImageAnalysisResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Get image data
  const imageData = await readImageFile(imageFile);

  // Use Grok Vision for advanced interpretation if enabled
  if (USE_GROK && grok) {
    try {
      // Convert image to base64 for vision API
      const base64Image = await fileToBase64(imageFile);
      const languageFullName = language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English';

      const response = await grok.chat.completions.create({
        model: GROK_VISION_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert Medical Diagnostic AI specializing in visual analysis of medical images (X-rays, wounds, skin conditions, burns, etc.). 
            Your goal is to provide highly accurate, clinical-grade analysis for rural healthcare workers.
            Analyze visual patterns, colors, textures, and structures with extreme precision. 
            Respond ONLY in valid JSON matching the ImageAnalysisResult interface.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical image for rural healthcare triage.
                
                LANGUAGE REQUIREMENT:
                - Provide all findings, descriptions, and recommendations in ${languageFullName.toUpperCase()}.
                - Technical fields like 'imageType', 'urgency', and 'severity' must remain in standard English for system compatibility.
                
                DIAGNOSIS GUIDELINES:
                1. Identify the 'imageType' accurately (xray/wound/cut/laceration/skin/burn/rash/fracture).
                2. List specific visual 'findings' (e.g., "3cm jagged laceration with active bleeding").
                3. Detect 'abnormalities' with location and severity (mild/moderate/severe).
                4. For wounds, specify 'imageCharacteristics' like depth, size, and tissue condition.
                5. Provide 5-7 actionable 'recommendations' tailored for low-resource rural settings.
                6. Suggest generic 'medicines' (e.g., "Paracetamol 500mg") only if clinically indicated.
                7. Set 'severity' (0-100) and 'urgency' based on life-threatening potential.
                8. Recommend a 'suggestedSpecialist' for follow-up care.
                
                Respond ONLY with a JSON object. No markdown, no pre-amble.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{}';
      const cleanedJSON = content.replace(/```json\n?|```/g, '').trim();
      const result = JSON.parse(cleanedJSON);
      return result as ImageAnalysisResult;
    } catch (error) {
      console.error('Grok Vision Analysis Error:', error);
      // Fallback to rule-based analysis below
    }
  }

  // Analyze image characteristics (Fallback)
  const analysis = await performImageAnalysis(imageData);
  return analysis;
}

async function readImageFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

async function performImageAnalysis(imageData: ImageData): Promise<ImageAnalysisResult> {
  // Analyze color distribution
  const colorAnalysis = analyzeColorDistribution(imageData);

  // Detect image type based on characteristics
  const imageType = detectImageType(colorAnalysis);

  // Perform type-specific analysis
  switch (imageType) {
    case 'xray':
      return analyzeXRay(colorAnalysis, imageData);
    case 'cut':
      return analyzeCut(colorAnalysis, imageData);
    case 'wound':
      return analyzeWound(colorAnalysis, imageData);
    case 'skin':
      return analyzeSkinCondition(colorAnalysis, imageData);
    case 'burn':
      return analyzeBurn(colorAnalysis, imageData);
    case 'rash':
      return analyzeRash(colorAnalysis, imageData);
    default:
      return analyzeGenericMedicalImage(colorAnalysis, imageData);
  }
}

interface ColorAnalysis {
  avgRed: number;
  avgGreen: number;
  avgBlue: number;
  brightness: number;
  contrast: number;
  grayscale: boolean;
  dominantColors: string[];
  hasRedAreas: boolean;
  hasWhiteAreas: boolean;
  hasDarkAreas: boolean;
  redIntensity: number;
  darkAreaRatio: number;
  redAreaRatio: number;
  skinToneDetected: boolean;
  redDistribution: 'concentrated' | 'scattered' | 'uniform';
  hasBreakInSkin: boolean;
  texturePattern: 'smooth' | 'irregular' | 'patchy';
}

function analyzeColorDistribution(imageData: ImageData): ColorAnalysis {
  const data = imageData.data;
  let totalRed = 0, totalGreen = 0, totalBlue = 0, totalBrightness = 0;
  let redPixels = 0, whitePixels = 0, darkPixels = 0;
  let minBrightness = 255, maxBrightness = 0;
  let skinTonePixels = 0;

  // Track red pixel positions to analyze distribution pattern
  const redPixelPositions: number[] = [];
  const width = imageData.width;
  const height = imageData.height;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    totalRed += r;
    totalGreen += g;
    totalBlue += b;

    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);

    // Detect red areas (blood, inflammation, rash)
    // Lowered threshold to detect lighter rash spots
    if (r > 140 && r > g + 20 && r > b + 20) {
      redPixels++;
      redPixelPositions.push(i / 4);
    }

    // Detect white areas
    if (r > 200 && g > 200 && b > 200) whitePixels++;

    // Detect dark areas (dried blood, necrotic tissue, scabs)
    // For rashes, we need to be more strict - only very dark pixels count
    if (brightness < 40) darkPixels++;

    // Detect skin tone
    if (r > 95 && r < 220 && g > 70 && g < 180 && b > 50 && b < 160 &&
      Math.abs(r - g) < 50 && r > b) {
      skinTonePixels++;
    }
  }

  const pixelCount = data.length / 4;
  const avgRed = totalRed / pixelCount;
  const avgGreen = totalGreen / pixelCount;
  const avgBlue = totalBlue / pixelCount;
  const avgBrightness = totalBrightness / pixelCount;
  const contrast = maxBrightness - minBrightness;

  // Check if grayscale (X-ray characteristic)
  const colorDiff = Math.max(
    Math.abs(avgRed - avgGreen),
    Math.abs(avgGreen - avgBlue),
    Math.abs(avgBlue - avgRed)
  );
  const grayscale = colorDiff < 15;

  const dominantColors: string[] = [];
  if (avgRed > avgGreen + 20 && avgRed > avgBlue + 20) dominantColors.push('red');
  if (avgBrightness > 180) dominantColors.push('white');
  if (avgBrightness < 80) dominantColors.push('dark');
  if (grayscale) dominantColors.push('grayscale');

  const redIntensity = redPixels / pixelCount;
  const darkAreaRatio = darkPixels / pixelCount;
  const redAreaRatio = redPixels / pixelCount;
  const skinToneDetected = skinTonePixels / pixelCount > 0.2;

  // Analyze red pixel distribution pattern
  let redDistribution: 'concentrated' | 'scattered' | 'uniform' = 'uniform';
  let texturePattern: 'smooth' | 'irregular' | 'patchy' = 'smooth';

  if (redPixels > 0) {
    // Calculate clustering of red pixels
    const clusterMetric = calculateRedPixelClustering(redPixelPositions, width, height);

    // CONCENTRATED: Red pixels are tightly grouped in one area (wound/cut)
    // SCATTERED: Red pixels are spread across larger area in multiple spots (rash)
    if (clusterMetric > 0.7 && redAreaRatio < 0.2) {
      redDistribution = 'concentrated';
      texturePattern = 'irregular';
    } else if (clusterMetric < 0.5 || redAreaRatio > 0.2) {
      redDistribution = 'scattered';
      texturePattern = 'patchy';
    }
  }

  // Detect break in skin (concentrated red/dark area indicating wound)
  // Rashes don't have breaks in skin - they are surface level
  // Must have: concentrated pattern + significant dark areas (blood/infection)
  const hasBreakInSkin = redDistribution === 'concentrated' && darkAreaRatio > 0.08;

  return {
    avgRed,
    avgGreen,
    avgBlue,
    brightness: avgBrightness,
    contrast,
    grayscale,
    dominantColors,
    hasRedAreas: redAreaRatio > 0.05,
    hasWhiteAreas: (whitePixels / pixelCount) > 0.2,
    hasDarkAreas: darkAreaRatio > 0.08,
    redIntensity,
    darkAreaRatio,
    redAreaRatio,
    skinToneDetected,
    redDistribution,
    hasBreakInSkin,
    texturePattern,
  };
}

// Helper function to determine if red pixels are clustered or scattered
function calculateRedPixelClustering(positions: number[], width: number, height: number): number {
  if (positions.length < 10) return 1.0; // Too few pixels, assume concentrated

  // Sample subset of red pixels to analyze clustering
  const sampleSize = Math.min(100, positions.length);
  const step = Math.floor(positions.length / sampleSize);

  let totalDistance = 0;
  let comparisons = 0;

  // Calculate average distance between red pixels
  for (let i = 0; i < positions.length; i += step) {
    for (let j = i + step; j < positions.length && comparisons < 50; j += step) {
      const pos1 = positions[i];
      const pos2 = positions[j];

      const x1 = pos1 % width;
      const y1 = Math.floor(pos1 / width);
      const x2 = pos2 % width;
      const y2 = Math.floor(pos2 / width);

      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      totalDistance += distance;
      comparisons++;
    }
  }

  if (comparisons === 0) return 1.0;

  const avgDistance = totalDistance / comparisons;
  const maxPossibleDistance = Math.sqrt(width ** 2 + height ** 2);

  // Return clustering score (1.0 = highly clustered, 0.0 = highly scattered)
  return 1.0 - (avgDistance / maxPossibleDistance) * 2;
}

function detectImageType(colorAnalysis: ColorAnalysis): ImageAnalysisResult['imageType'] {
  // X-ray: Grayscale, high contrast
  if (colorAnalysis.grayscale && colorAnalysis.contrast > 150) {
    return 'xray';
  }

  // Burn: Red/white areas, blistering appearance, high brightness patches
  // Must check BEFORE wound/rash as burns can have similar red patterns
  if (colorAnalysis.hasRedAreas && colorAnalysis.hasWhiteAreas && colorAnalysis.brightness > 140) {
    return 'burn';
  }

  // WOUND DETECTION - HIGHEST PRIORITY for tissue damage
  // Wounds have EITHER:
  // 1. Break in skin (concentrated damage) + dark areas (blood/infection/debris), OR
  // 2. Significant red area (>15%) with ANY dark areas (indicates bleeding/tissue damage), OR
  // 3. Large concentrated red area even without dark spots (fresh open wound)

  // Critical wound indicators:
  const hasSignificantDarkAreas = colorAnalysis.darkAreaRatio > 0.08;
  const hasSignificantRedArea = colorAnalysis.redAreaRatio > 0.15;
  const hasConcentratedDamage = colorAnalysis.redDistribution === 'concentrated';
  const hasLargeDamagedArea = colorAnalysis.redAreaRatio > 0.25; // Large wound area

  // WOUND if:
  // - Break in skin + dark areas (blood, scab, infection, dirt)
  // - Large red area + dark areas (bleeding wound)
  // - Large concentrated area (major tissue damage even if no dark spots yet)
  if ((colorAnalysis.hasBreakInSkin && hasSignificantDarkAreas) ||
    (hasSignificantRedArea && colorAnalysis.hasDarkAreas) ||
    (hasConcentratedDamage && hasLargeDamagedArea)) {
    return 'wound';
  }

  // Cut/Laceration: Small CONCENTRATED red area WITHOUT much dark contamination
  // Clean linear injury with bright red blood, minimal tissue damage
  if (colorAnalysis.redDistribution === 'concentrated' &&
    colorAnalysis.redAreaRatio < 0.15 &&
    colorAnalysis.redAreaRatio > 0.03 &&  // Must have some redness
    colorAnalysis.darkAreaRatio < 0.08 &&
    colorAnalysis.skinToneDetected) {
    return 'cut';
  }

  // Rash: SCATTERED/DISTRIBUTED red pattern WITHOUT dark contamination AND WITHOUT concentration
  // Key differentiators from wound:
  // - Scattered distribution (NOT concentrated in one area)
  // - No break in skin (surface level only)
  // - Texture is PATCHY (multiple small spots)
  // - NO significant dark areas (no bleeding or deep tissue damage)
  // - Red area is distributed, not localized
  if (colorAnalysis.hasRedAreas &&
    !hasSignificantDarkAreas &&  // No dark blood/scabs
    !hasConcentratedDamage &&  // Not localized to one area
    (colorAnalysis.redDistribution === 'scattered' || colorAnalysis.texturePattern === 'patchy') &&
    !colorAnalysis.hasBreakInSkin &&
    colorAnalysis.redAreaRatio < 0.25) {  // Not too much red (would be wound)
    return 'rash';
  }

  // Skin condition: Normal color range without significant red areas
  if (!colorAnalysis.grayscale && colorAnalysis.brightness > 100 && !colorAnalysis.hasRedAreas) {
    return 'skin';
  }

  // Default to wound if uncertain but has red and skin tone (better to be cautious)
  if (colorAnalysis.hasRedAreas && colorAnalysis.skinToneDetected) {
    return 'wound';
  }

  return 'unknown';
}

function analyzeXRay(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 40; // Base severity for X-ray

  // Analyze bone density (brightness patterns)
  if (colorAnalysis.brightness < 80) {
    findings.push('Dense bone structures visible');
    findings.push('Good bone mineralization');
  } else if (colorAnalysis.brightness > 150) {
    findings.push('Reduced bone density detected');
    findings.push('Possible osteoporosis or bone loss');
    abnormalities.push({
      type: 'Osteopenia',
      severity: 'moderate',
      description: 'Lower than normal bone density visible on X-ray',
    });
    severity += 15;
  }

  // Detect fractures (irregular dark lines in bright areas)
  const hasFractureLikePatterns = detectFracturePatterns(imageData);
  if (hasFractureLikePatterns) {
    findings.push('⚠️ POSSIBLE FRACTURE DETECTED');
    findings.push('Irregular bone continuity observed');
    findings.push('Potential bone discontinuity or crack');
    abnormalities.push({
      type: 'Possible Fracture',
      severity: 'severe',
      description: 'Irregular pattern suggesting bone discontinuity',
    });
    severity = 75;
  }

  // Detect fluid accumulation (darker areas in lung fields)
  if (colorAnalysis.hasDarkAreas && !hasFractureLikePatterns) {
    findings.push('Areas of increased opacity visible');
    findings.push('Possible fluid accumulation or consolidation');
    findings.push('Could indicate pneumonia, pleural effusion, or edema');
    abnormalities.push({
      type: 'Lung Opacity',
      location: 'Lung fields',
      severity: 'moderate',
      description: 'Increased density in lung regions',
    });
    severity += 20;
  }

  // Check for joint abnormalities
  if (colorAnalysis.contrast > 200) {
    findings.push('Joint spaces visible');
    findings.push('Check for joint space narrowing or bone spurs');
    findings.push('Possible arthritis if joint space reduced');
  }

  const recommendations: string[] = [
    '🏥 RADIOLOGIST CONSULTATION MANDATORY',
    'This AI analysis is preliminary only',
    'Professional radiologist review required for accurate diagnosis',
    'Bring X-ray to orthopedic surgeon or physician',
    'Do not rely solely on AI interpretation',
    '',
    '📋 Additional tests that may be needed:',
    '• CT scan for detailed bone structure',
    '• MRI for soft tissue evaluation',
    '• Blood tests for bone markers',
    '• Follow-up X-rays to monitor healing',
  ];

  if (hasFractureLikePatterns) {
    recommendations.unshift(
      '🚨 URGENT: Possible fracture detected',
      '���️ Immobilize the affected area',
      '🏥 Visit emergency department or orthopedic clinic immediately',
      '🚫 Avoid putting weight/stress on affected area',
      '❄️ Apply ice pack (wrapped) to reduce swelling',
      ''
    );
  }

  return {
    imageType: 'xray',
    findings,
    severity,
    recommendations,
    urgency: hasFractureLikePatterns ? 'urgent' : 'routine',
    suggestedSpecialist: 'Orthopedic Surgeon / Radiologist',
    detectedAbnormalities: abnormalities,
  };
}

function detectFracturePatterns(imageData: ImageData): boolean {
  // Simplified fracture detection based on edge patterns
  // In real implementation, this would use more sophisticated algorithms

  const data = imageData.data;
  const width = imageData.width;
  let edgeCount = 0;

  // Sample every 10th pixel for performance
  for (let i = width * 4; i < data.length - width * 4; i += 40) {
    const current = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const above = (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3;
    const below = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3;

    // Detect sharp transitions (potential fracture lines)
    if (Math.abs(current - above) > 80 || Math.abs(current - below) > 80) {
      edgeCount++;
    }
  }

  // If more than threshold edges, possible fracture
  const edgeRatio = edgeCount / (data.length / 160);
  return edgeRatio > 0.05;
}

function analyzeCut(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 50;

  // Assess cut characteristics
  findings.push('Cut detected in image');

  // Check for bleeding (bright red)
  if (colorAnalysis.avgRed > 150) {
    findings.push('Active bleeding visible (bright red blood)');
    findings.push('Wound appears fresh and actively bleeding');
    abnormalities.push({
      type: 'Active Hemorrhage',
      severity: 'severe',
      description: 'Fresh bleeding visible in wound',
    });
    severity = 75;
  } else if (colorAnalysis.avgRed > 100) {
    findings.push('Wound with blood present');
    findings.push('Bleeding may be controlled or recent');
    severity = 60;
  }

  // Check for infection signs (dark areas, pus)
  if (colorAnalysis.hasDarkAreas) {
    findings.push('⚠️ POSSIBLE INFECTION SIGNS');
    findings.push('Dark discoloration suggests possible necrotic tissue');
    findings.push('Pus or infected material may be present');
    abnormalities.push({
      type: 'Wound Infection',
      severity: 'severe',
      description: 'Dark areas suggesting infection or necrosis',
    });
    severity = Math.max(severity, 70);
  }

  // Check wound size/severity (based on dark/red pixel ratio)
  const woundPixelRatio = (colorAnalysis.hasRedAreas ? 1 : 0) + (colorAnalysis.hasDarkAreas ? 1 : 0);
  if (woundPixelRatio > 0.3) {
    findings.push('Large wound area detected');
    findings.push('Extensive tissue damage visible');
    severity += 10;
  }

  const recommendations: string[] = [];

  if (severity >= 70) {
    recommendations.push(
      '🚨 URGENT MEDICAL ATTENTION REQUIRED',
      '🏥 Visit emergency department immediately',
      '⚠️ Risk of severe infection or blood loss',
      '',
      '🩹 Immediate care:',
      '• Apply direct pressure with clean cloth to stop bleeding',
      '• Do NOT remove embedded objects',
      '• Cover wound with sterile dressing',
      '• Elevate injured area above heart level',
      '• Monitor for signs of shock (pale, cold, rapid pulse)',
      ''
    );
  } else {
    recommendations.push(
      '📋 Wound care instructions:',
      '• Clean wound gently with normal saline or clean water',
      '• Apply antiseptic solution (Betadine/Dettol diluted)',
      '• Cover with sterile gauze dressing',
      '• Change dressing daily',
      '• Watch for infection signs: increased pain, pus, red streaks, fever',
      '• Tetanus vaccination if not up to date (important!)',
      '',
      '⚠️ Seek medical help if:',
      '• Wound shows signs of infection',
      '• Bleeding doesn\'t stop',
      '• Wound is deep or > 2cm',
      '• Caused by dirty/rusty object',
      '• Fever develops',
      ''
    );
  }

  recommendations.push(
    '💊 Medications:',
    '• Paracetamol 500mg for pain (every 6-8 hours)',
    '• Antibiotic ointment (Neosporin) on wound',
    '• Oral antibiotics may be needed (doctor will prescribe)',
    '',
    '🏥 Follow-up:',
    '• Visit doctor within 24-48 hours',
    '• Wound review in 3-5 days',
    '• Stitch removal (if applicable) in 7-14 days'
  );

  return {
    imageType: 'cut',
    findings,
    severity,
    recommendations,
    urgency: severity >= 70 ? 'urgent' : 'routine',
    suggestedSpecialist: 'General Surgeon / Emergency Medicine',
    detectedAbnormalities: abnormalities,
  };
}

function analyzeWound(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 50;

  // Assess wound characteristics
  findings.push('Open wound detected - Localized tissue damage with break in skin integrity');
  findings.push(`Wound pattern: ${colorAnalysis.redDistribution.toUpperCase()} injury with visible tissue disruption`);

  // Determine wound stage/characteristics
  let woundDepth: 'superficial' | 'partial' | 'deep' | 'full-thickness' = 'superficial';
  let tissueCondition: 'healthy' | 'inflamed' | 'necrotic' | 'infected' = 'inflamed';

  // Calculate combined damage ratio for wound size assessment
  const combinedDamageRatio = colorAnalysis.redAreaRatio + colorAnalysis.darkAreaRatio;

  // CRITICAL WOUND DETECTION - Extensive tissue damage
  if (combinedDamageRatio > 0.35 || (colorAnalysis.redAreaRatio > 0.25 && colorAnalysis.darkAreaRatio > 0.15)) {
    findings.push('🚨 SEVERE TRAUMATIC WOUND - EXTENSIVE TISSUE DAMAGE');
    findings.push('Large open wound with significant tissue loss and exposure');
    findings.push('Deep tissue layers visible - full-thickness injury');
    findings.push('⚠️ HIGH RISK: Severe bleeding, infection, and complications');

    abnormalities.push({
      type: 'Severe Traumatic Wound',
      severity: 'severe',
      description: 'Major tissue damage with extensive open wound requiring immediate emergency care',
    });

    severity = 88; // CRITICAL - Emergency level
    woundDepth = 'full-thickness';
    tissueCondition = 'necrotic';

    // Additional critical findings
    if (colorAnalysis.avgRed > 140) {
      findings.push('🔴 ACTIVE HEMORRHAGE - Significant blood loss visible');
      findings.push('Bright red blood indicates arterial or major venous bleeding');
      severity = 92;
    }

    if (colorAnalysis.darkAreaRatio > 0.25) {
      findings.push('⚫ NECROTIC TISSUE AND CONTAMINATION');
      findings.push('Black/dark areas indicate dead tissue, dirt, or deep infection');
      findings.push('Requires surgical debridement and IV antibiotics');
      severity = Math.max(severity, 90);
    }
  }
  // LARGE WOUND - Significant damage
  else if (combinedDamageRatio > 0.2 || colorAnalysis.redAreaRatio > 0.18) {
    findings.push('⚠️ LARGE WOUND - Significant tissue involvement');
    findings.push('Extensive damage requiring professional medical assessment');

    abnormalities.push({
      type: 'Large Open Wound',
      severity: 'severe',
      description: 'Significant tissue damage with large wound area',
    });

    severity = 75;
    woundDepth = 'deep';

    if (colorAnalysis.avgRed > 150 && colorAnalysis.brightness > 130) {
      findings.push('🔴 Active bleeding visible (bright red blood)');
      findings.push('Wound appears fresh with active hemorrhage');
      severity = 80;
    }
  }
  // MEDIUM WOUND
  else if (combinedDamageRatio > 0.12 || colorAnalysis.redAreaRatio > 0.1) {
    findings.push('Medium-sized wound with moderate tissue damage');

    if (colorAnalysis.avgRed > 120) {
      findings.push('Fresh wound with recent bleeding');
      findings.push('Blood present - injury is recent (within hours)');
      severity = 65;
      woundDepth = 'partial';
    }

    abnormalities.push({
      type: 'Moderate Wound',
      severity: 'moderate',
      description: 'Moderate tissue damage requiring medical attention',
    });
  }
  // SMALL WOUND
  else {
    findings.push('Small to moderate wound size');
    severity = 55;
    woundDepth = 'superficial';
  }

  // Check for dried blood/scabbing (dark red/brown areas)
  if (colorAnalysis.hasDarkAreas && colorAnalysis.darkAreaRatio > 0.08) {
    // If already marked as critical, enhance those findings
    if (severity < 70) {
      findings.push('Dark discoloration visible - Dried blood and scab formation');
      findings.push('Wound is in healing phase with crust/eschar present');
      findings.push('⚠️ Check for infection beneath scab');
    }

    // Severe dark areas indicate infection or necrosis (only if not already critical)
    if (colorAnalysis.darkAreaRatio > 0.20 && severity < 70) {
      findings.push('⚠️ SIGNIFICANT NECROTIC TISSUE OR INFECTION');
      findings.push('Dark areas suggest dead tissue or deep infection');
      findings.push('Purulent discharge may be present');
      abnormalities.push({
        type: 'Wound Infection with Necrosis',
        severity: 'severe',
        description: 'Dark necrotic tissue and possible purulent infection visible',
      });
      tissueCondition = 'necrotic';
      severity = Math.max(severity, 78);
      woundDepth = 'full-thickness';
    } else if (severity < 70) {
      abnormalities.push({
        type: 'Healing Wound with Scab',
        severity: 'moderate',
        description: 'Dried blood and scab formation - normal healing process',
      });
      tissueCondition = 'inflamed';
      severity = Math.max(severity, 55);
    }
  }

  // Check for inflammation around wound (red halo)
  if (colorAnalysis.redAreaRatio > 0.15 && severity < 70) {
    findings.push('Significant erythema (redness) around wound edges');
    findings.push('Inflammatory response present - could be normal healing OR infection');
    findings.push('Monitor for spreading redness (cellulitis warning)');
    severity += 8;
  }

  // Determine wound size classification
  let woundSize: 'small' | 'medium' | 'large' = 'small';
  if (combinedDamageRatio > 0.35) {
    findings.push('Large wound area - Extensive tissue damage visible');
    findings.push('Significant portion of visible skin affected');
    woundSize = 'large';
  } else if (combinedDamageRatio > 0.15) {
    woundSize = 'medium';
  }

  // Assess wound edges
  let edgeType: 'clean' | 'irregular' | 'jagged' = 'irregular';
  if (colorAnalysis.texturePattern === 'irregular' || severity > 75) {
    findings.push('Irregular wound edges - Traumatic injury pattern');
    if (severity > 80) {
      findings.push('Ragged edges indicate high-energy trauma or tissue avulsion');
      findings.push('May require surgical debridement and advanced closure');
    } else {
      findings.push('May require professional closure (sutures/staples)');
    }
    edgeType = 'jagged';
  }

  const recommendations: string[] = [];

  // CRITICAL EMERGENCY RECOMMENDATIONS (Severity >= 85)
  if (severity >= 85) {
    recommendations.push(
      '🚨🚨 CRITICAL EMERGENCY - CALL AMBULANCE IMMEDIATELY 🚨🚨',
      '📞 DIAL EMERGENCY NUMBER NOW: 108 (India) / 911 (US)',
      '',
      '⚠️ LIFE-THREATENING INJURY',
      '⚠️ SEVERE BLOOD LOSS RISK',
      '⚠️ HIGH INFECTION AND SEPSIS RISK',
      '⚠️ POTENTIAL PERMANENT DISABILITY WITHOUT IMMEDIATE CARE',
      '',
      '🩹 CRITICAL FIRST AID (While waiting for ambulance):',
      '',
      '1️⃣ STOP BLEEDING (HIGHEST PRIORITY):',
      '   • Apply FIRM direct pressure with clean cloth/gauze',
      '   • If blood soaks through, ADD more cloth on top (DO NOT REMOVE)',
      '   • Maintain pressure for 10-15 minutes continuously',
      '   • If limb injury: ELEVATE above heart level while applying pressure',
      '   • Use pressure points if bleeding continues (brachial/femoral artery)',
      '',
      '2️⃣ PREVENT SHOCK:',
      '   • Lay patient down flat',
      '   • Elevate legs 12 inches (if no head/spine injury)',
      '   • Keep patient warm with blanket',
      '   • Monitor consciousness, breathing, and pulse',
      '',
      '3️⃣ WOUND PROTECTION:',
      '   • Cover wound with sterile dressing once bleeding controlled',
      '   • DO NOT remove embedded objects (stabilize them instead)',
      '   • DO NOT try to clean the wound - leave for emergency team',
      '   • DO NOT apply ointments, creams, or medications',
      '',
      '4️⃣ MONITOR FOR SHOCK SYMPTOMS:',
      '   • Pale, cold, clammy skin',
      '   • Rapid weak pulse',
      '   • Rapid shallow breathing',
      '   • Confusion or loss of consciousness',
      '   • If shock: keep patient lying down, elevate legs, keep warm',
      '',
      '🏥 REQUIRED EMERGENCY TREATMENT:',
      '• Immediate surgical intervention likely needed',
      '• IV fluids and blood transfusion may be required',
      '• Tetanus immunization (within 6 hours)',
      '• IV antibiotics to prevent sepsis',
      '• Possible skin grafting or reconstructive surgery',
      '• ICU monitoring for complications',
      '',
      '⏱️ TIME CRITICAL: Every minute counts - GET TO HOSPITAL NOW',
      '',
      '🚫 ABSOLUTE DON\'TS:',
      '• DO NOT give food or water (may need surgery)',
      '• DO NOT remove embedded objects',
      '• DO NOT apply ice directly to wound',
      '• DO NOT use hydrogen peroxide on deep wounds',
      '• DO NOT attempt to close wound yourself',
      '• DO NOT move patient if spinal injury suspected'
    );
  }
  // URGENT CARE RECOMMENDATIONS (Severity 70-84)
  else if (severity >= 70) {
    recommendations.push(
      '🚨 URGENT MEDICAL ATTENTION REQUIRED',
      '🏥 Visit emergency department or urgent care immediately',
      '⚠️ Risk of severe infection, blood loss, or permanent scarring',
      '',
      '🩹 Immediate first aid (before hospital):',
      '• Apply direct pressure with clean cloth to control bleeding',
      '• Do NOT remove embedded objects or debris from deep wounds',
      '• Cover wound with sterile/clean dressing',
      '• Elevate injured area above heart level if possible',
      '• Do NOT apply creams, ointments, or home remedies',
      '• Monitor for shock: pale skin, cold sweat, rapid pulse, dizziness',
      ''
    );
  }
  // STANDARD WOUND CARE (Severity < 70)
  else {
    recommendations.push(
      '📋 Wound care protocol:',
      '',
      '🚿 Cleaning (Critical step):',
      '• Wash hands thoroughly before touching wound',
      '• Rinse wound with clean running water for 5-10 minutes',
      '• Use mild soap around (NOT inside) wound',
      '• Remove visible dirt/debris gently with clean tweezers',
      '• Pat dry with clean gauze or towel',
      '',
      '💧 Disinfection:',
      '• Apply antiseptic: Betadine solution (diluted) OR Dettol (1:20 dilution)',
      '• Hydrogen peroxide can be used for initial cleaning only',
      '• Allow antiseptic to air dry',
      '',
      '🩹 Dressing:',
      '• Apply thin layer of antibiotic ointment (Neosporin/Mupirocin)',
      '• Cover with sterile non-stick gauze pad',
      '• Secure with medical tape or bandage',
      '• Change dressing DAILY or when wet/dirty',
      '',
      '⚠️ URGENT - See doctor if you notice:',
      '• Increased pain, redness, warmth, or swelling',
      '• Pus or foul-smelling drainage',
      '• Red streaks spreading from wound (cellulitis)',
      '• Fever above 100.4°F (38°C)',
      '• Wound edges separating or not healing',
      '• Numbness or tingling around wound',
      ''
    );
  }

  // Common recommendations for all wound severities
  if (severity < 85) {
    recommendations.push(
      '💊 Medications:',
      '',
      'Pain management:',
      '• Paracetamol (Acetaminophen) 500-1000mg every 6-8 hours',
      '• Ibuprofen 400-600mg every 8 hours (if no contraindications)',
      '• Avoid aspirin (increases bleeding)',
      '',
      'Infection prevention:',
      '• Antibiotic ointment: Neosporin/Bacitracin (apply twice daily)',
      '• If infection signs: Doctor will prescribe oral antibiotics',
      '  - Common: Amoxicillin-Clavulanate 625mg twice daily',
      '  - Or: Cephalexin 500mg three times daily',
      '',
      '💉 Tetanus vaccination:',
      '• CRITICAL: Get tetanus shot if not vaccinated in last 5 years',
      '• Especially important for dirty wounds or animal bites',
      '• Available at any clinic or emergency department',
      '',
      '🏥 Medical follow-up required:',
      '• Visit doctor within 24-48 hours for wound assessment',
      '• Deep wounds may need stitches/sutures (best within 6-8 hours)',
      '• Wound review in 3-5 days to check healing',
      '• Suture/stitch removal typically in 7-14 days (depends on location)',
      '',
      '📊 Healing timeline (approximate):',
      '• Days 1-5: Inflammation phase - redness, swelling normal',
      '• Days 5-21: New tissue formation - wound contracts and closes',
      '• Weeks 3-24: Remodeling - scar tissue strengthens',
      '',
      '🚫 Do NOT:',
      '• Apply butter, oils, or traditional remedies',
      '• Use cotton balls directly on wound (fibers stick)',
      '• Remove scabs (let them fall off naturally)',
      '• Expose wound to dirt or contaminated water',
      '• Skip antibiotic ointment (helps prevent infection)',
      '',
      '✅ Healing promotion:',
      '• Keep wound moist with antibiotic ointment',
      '• Eat protein-rich foods (aids tissue repair)',
      '• Stay hydrated',
      '• Avoid smoking (delays healing)',
      '• Take vitamin C supplement (500mg daily)',
      ''
    );
  }

  recommendations.push(
    '📝 Wound characteristics detected:',
    `• Depth: ${woundDepth.toUpperCase()}`,
    `• Size: ${woundSize.toUpperCase()}`,
    `• Tissue condition: ${tissueCondition.toUpperCase()}`,
    `• Edge type: ${edgeType.toUpperCase()}`
  );

  return {
    imageType: 'wound',
    findings,
    severity,
    recommendations,
    urgency: severity >= 85 ? 'immediate' : severity >= 70 ? 'urgent' : severity >= 60 ? 'urgent' : 'routine',
    suggestedSpecialist: severity >= 85 ? 'EMERGENCY DEPARTMENT - Trauma Surgery' : severity >= 75 ? 'Emergency Medicine / Trauma Surgery' : 'General Surgeon / Wound Care Specialist',
    detectedAbnormalities: abnormalities,
    imageCharacteristics: {
      woundDepth,
      woundSize,
      edgeType,
      tissueCondition,
    },
  };
}

function analyzeSkinCondition(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 30;

  findings.push('Skin condition visible in image');

  // Check for inflammation (redness)
  if (colorAnalysis.hasRedAreas) {
    findings.push('Skin inflammation/erythema present');
    findings.push('Redness indicates possible infection or allergic reaction');
    abnormalities.push({
      type: 'Erythema',
      severity: 'moderate',
      description: 'Red, inflamed skin visible',
    });
    severity = 45;
  }

  // Check for dark lesions (possible melanoma warning)
  if (colorAnalysis.hasDarkAreas && !colorAnalysis.hasRedAreas) {
    findings.push('⚠️ DARK LESION DETECTED');
    findings.push('Dark pigmented area visible');
    findings.push('URGENT: Could be benign mole OR serious melanoma');
    findings.push('ABCDE rule check needed:');
    findings.push('• Asymmetry');
    findings.push('• Border irregularity');
    findings.push('• Color variation');
    findings.push('• Diameter > 6mm');
    findings.push('• Evolution/changing');
    abnormalities.push({
      type: 'Pigmented Lesion',
      severity: 'severe',
      description: 'Dark lesion requires dermatologist evaluation to rule out melanoma',
    });
    severity = 70;
  }

  const recommendations: string[] = [];

  if (colorAnalysis.hasDarkAreas && !colorAnalysis.hasRedAreas) {
    recommendations.push(
      '🚨 URGENT DERMATOLOGIST CONSULTATION',
      '⚠️ Dark skin lesions must be evaluated for skin cancer',
      '🏥 Book appointment within 1-2 weeks',
      '📸 Take photos to track any changes',
      '🔬 Biopsy may be needed for definitive diagnosis',
      ''
    );
  }

  recommendations.push(
    '📋 Skin care recommendations:',
    '• Keep area clean and dry',
    '• Avoid scratching or picking',
    '• Apply moisturizer if dry',
    '• Protect from sun exposure (SPF 30+ sunscreen)',
    '• Avoid irritants (harsh soaps, chemicals)',
    '',
    '💊 Over-the-counter treatments:',
    '• Hydrocortisone 1% cream for itching (max 7 days)',
    '• Calamine lotion for mild irritation',
    '• Antihistamine (Cetirizine 10mg) if allergic',
    '',
    '⚠️ See dermatologist if:',
    '• Condition worsens or spreads',
    '• Severe itching or pain',
    '• Bleeding or oozing',
    '• No improvement in 2 weeks',
    '• Any mole/lesion that changes shape, size, or color'
  );

  return {
    imageType: 'skin',
    findings,
    severity,
    recommendations,
    urgency: severity >= 65 ? 'urgent' : 'routine',
    suggestedSpecialist: 'Dermatologist',
    detectedAbnormalities: abnormalities,
  };
}

function analyzeBurn(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 55;

  findings.push('Burn injury detected');

  // Assess burn degree
  if (colorAnalysis.hasWhiteAreas && colorAnalysis.hasRedAreas) {
    findings.push('🔥 SEVERE BURN (Likely 2nd or 3rd degree)');
    findings.push('White/charred areas visible - deep tissue damage');
    findings.push('Blistering or skin loss present');
    abnormalities.push({
      type: 'Deep Partial/Full Thickness Burn',
      severity: 'severe',
      description: 'White or charred appearance indicating deep burn',
    });
    severity = 80;
  } else if (colorAnalysis.hasRedAreas) {
    findings.push('Superficial burn (1st degree) OR Partial thickness (2nd degree)');
    findings.push('Red, inflamed skin visible');
    abnormalities.push({
      type: 'Superficial/Partial Thickness Burn',
      severity: 'moderate',
      description: 'Red, inflamed burn injury',
    });
    severity = 60;
  }

  const recommendations: string[] = [];

  if (severity >= 75) {
    recommendations.push(
      '🚨 EMERGENCY - GO TO HOSPITAL IMMEDIATELY',
      '⚠️ Severe burns require specialized burn unit care',
      '',
      '🩹 Before hospital:',
      '• Stop burning process (remove from heat source)',
      '• Cool burn with running water for 20 minutes (NOT ice)',
      '• Remove jewelry/tight clothing gently',
      '• Cover with clean, dry cloth (NOT ointments)',
      '• DO NOT break blisters',
      '• Give pain medication if conscious',
      '• Monitor for shock',
      ''
    );
  } else {
    recommendations.push(
      '🩹 Burn first aid:',
      '• Cool burn under running water for 20 minutes',
      '• Remove jewelry/watches before swelling occurs',
      '• Cover with sterile non-stick dressing',
      '• Take pain medication',
      '• Do NOT apply ice, butter, or oil',
      '• Do NOT break blisters',
      '',
      '💊 Medications:',
      '• Paracetamol 500-1000mg for pain',
      '• Ibuprofen 400mg (if not contraindicated)',
      '• Silver sulfadiazine cream for burns (after doctor consultation)',
      '',
      '🏥 See doctor if:',
      '• Burn > 3 inches (7.5cm) diameter',
      '• Burn on face, hands, feet, genitals, or joints',
      '• Blisters form',
      '• Signs of infection (pus, increased pain, fever)',
      '• Caused by chemicals or electricity',
      ''
    );
  }

  recommendations.push(
    '⚠️ Infection prevention:',
    '• Keep burn clean and dry',
    '• Change dressing daily',
    '• Watch for red streaks, pus, increasing pain',
    '• Tetanus vaccination if not up to date',
    '',
    '💉 Professional treatment may include:',
    '• Debridement (removal of dead tissue)',
    '• Specialized burn dressings',
    '• IV fluids for large burns',
    '• Skin grafting for severe burns',
    '• Physical therapy to prevent scarring'
  );

  return {
    imageType: 'burn',
    findings,
    severity,
    recommendations,
    urgency: severity >= 75 ? 'immediate' : 'urgent',
    suggestedSpecialist: severity >= 75 ? 'Burn Specialist / Emergency Medicine' : 'General Surgeon',
    detectedAbnormalities: abnormalities,
  };
}

function analyzeRash(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  const findings: string[] = [];
  const abnormalities: ImageAnalysisResult['detectedAbnormalities'] = [];
  let severity = 35;

  findings.push('Skin rash detected - Distributed pattern across skin surface');
  findings.push(`Pattern: ${colorAnalysis.texturePattern.toUpperCase()} texture with ${colorAnalysis.redDistribution} distribution`);
  findings.push('No visible break in skin integrity - Surface level condition');

  // Assess rash characteristics
  if (colorAnalysis.avgRed > 140) {
    findings.push('Prominent erythematous (red) rash');
    findings.push('Possibly allergic reaction, viral exanthem, or dermatitis');
    abnormalities.push({
      type: 'Erythematous Rash',
      severity: 'moderate',
      description: 'Red rash covering visible skin area',
    });
    severity = 45;
  }

  // Check for potential severe reactions
  if (colorAnalysis.hasWhiteAreas && colorAnalysis.hasRedAreas) {
    findings.push('⚠️ Possible blistering or severe reaction');
    findings.push('Could indicate Stevens-Johnson syndrome or other serious condition');
    abnormalities.push({
      type: 'Blistering Rash',
      severity: 'severe',
      description: 'Possible bullous eruption - requires urgent evaluation',
    });
    severity = 75;
  }

  const recommendations: string[] = [
    '📋 Rash management:',
    '• Identify and avoid triggers (foods, medications, chemicals)',
    '• Keep area cool and dry',
    '• Avoid scratching',
    '• Wear loose, cotton clothing',
    '• Take lukewarm baths (add colloidal oatmeal)',
    '',
    '💊 Medications:',
    '• Antihistamine: Cetirizine 10mg once daily at bedtime',
    '• Hydrocortisone 1% cream - apply twice daily (max 7 days)',
    '• Calamine lotion for itch relief',
    '• Cool compress for immediate relief',
  ];

  if (severity >= 70) {
    recommendations.unshift(
      '🚨 URGENT MEDICAL ATTENTION',
      '⚠️ Severe rash may indicate serious allergic reaction',
      '🏥 Go to emergency if:',
      '• Difficulty breathing or swelling of face/throat',
      '• Fever with rash',
      '• Rash rapidly spreading',
      '• Blisters or skin peeling',
      '• Recently started new medication',
      ''
    );
  }

  recommendations.push(
    '',
    '🏥 Consult doctor if:',
    '• Rash persists > 1 week',
    '• Severe itching interfering with sleep',
    '• Signs of infection (pus, warmth, spreading redness)',
    '• Fever accompanies rash',
    '• Rash after new medication',
    '',
    '📝 Possible causes to discuss with doctor:',
    '• Allergic reaction (food, medication, contact)',
    '• Viral infection (measles, chickenpox, etc.)',
    '• Bacterial infection (impetigo, cellulitis)',
    '• Fungal infection (ringworm, candida)',
    '• Autoimmune condition',
    '• Drug reaction'
  );

  return {
    imageType: 'rash',
    findings,
    severity,
    recommendations,
    urgency: severity >= 70 ? 'urgent' : 'routine',
    suggestedSpecialist: 'Dermatologist',
    detectedAbnormalities: abnormalities,
  };
}

function analyzeGenericMedicalImage(colorAnalysis: ColorAnalysis, imageData: ImageData): ImageAnalysisResult {
  return {
    imageType: 'unknown',
    findings: [
      'Medical image uploaded',
      'Unable to determine specific image type',
      'Image may require professional interpretation',
    ],
    severity: 40,
    recommendations: [
      '🏥 Professional medical evaluation recommended',
      '📸 Bring this image to your healthcare provider',
      '⚕️ Consult appropriate specialist based on body part/condition',
      '',
      '📋 General advice:',
      '• Keep a record of all medical images',
      '• Note date, location on body, and any symptoms',
      '• Track any changes over time',
      ' Always seek professional medical advice',
    ],
    urgency: 'routine',
    suggestedSpecialist: 'General Physician',
    detectedAbnormalities: [],
  };
}

// Export additional utility function
export function combineImageWithSymptomAnalysis(
  imageResult: ImageAnalysisResult,
  symptomSeverity: number
): number {
  // Combine image severity with symptom severity
  // Weight: 60% image findings, 40% symptoms
  return Math.round((imageResult.severity * 0.6) + (symptomSeverity * 0.4));
}
