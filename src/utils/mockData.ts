
export interface Variant {
  id: string;
  name: string;
  description: string;
  metabolismImpact?: "normal" | "intermediate" | "poor";
  sensitivityRisk?: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
}

export interface Drug {
  id: string;
  name: string;
  description: string;
  relatedDiseases: string[];
  contraindicatedVariants?: string[];
  metabolizedBy?: string[];
}

export interface Patient {
  id?: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  variantId: string;
  diseaseId: string;
}

export interface PredictionRequest {
  patientId?: string;
  patient: Patient;
  drugId: string;
  dosage: number;
  timestamp?: Date;
}

export type ResponseType = "positive" | "negative" | "neutral";

export interface AlternativeDrug {
  drugId: string;
  drugName: string;
  confidence: number; // 0-100
  description: string;
}

export interface DosageRecommendation {
  standard: number;
  recommended: number;
  unit: string;
  adjustmentReason?: string;
}

export interface Warning {
  type: "critical" | "moderate" | "mild";
  message: string;
  explanation: string;
}

export interface PredictionResponse {
  id: string;
  patientId: string;
  patientName: string;
  drugId: string;
  drugName: string;
  diseaseId: string;
  diseaseName: string;
  response: ResponseType;
  confidence: number; // 0-100
  sideEffects: string[];
  alternatives: AlternativeDrug[];
  timestamp: Date;
  details: string;
  dosageRecommendation?: DosageRecommendation;
  warnings?: Warning[];
  metabolismImpact?: string;
  contraindications?: string[];
}

// Mock genetic variants
export const variants: Variant[] = [
  { id: "var1", name: "CYP2D6*1", description: "Normal metabolizer", metabolismImpact: "normal" },
  { id: "var2", name: "CYP2C9*2", description: "Intermediate metabolizer", metabolismImpact: "intermediate" },
  { id: "var3", name: "CYP2C19*2", description: "Poor metabolizer", metabolismImpact: "poor" },
  { id: "var4", name: "VKORC1-1639G>A", description: "Warfarin sensitivity", sensitivityRisk: "warfarin" },
  { id: "var5", name: "HLA-B*5701", description: "Abacavir hypersensitivity", sensitivityRisk: "abacavir" },
  { id: "var6", name: "CYP3A5*3", description: "Poor metabolizer", metabolismImpact: "poor" },
  { id: "var7", name: "CYP2C9*3", description: "Poor metabolizer", metabolismImpact: "poor" },
  { id: "var8", name: "DPYD*2A", description: "Dihydropyrimidine dehydrogenase deficiency (5-FU toxicity risk)", sensitivityRisk: "5-fluorouracil" },
  { id: "var9", name: "TPMT*3A", description: "Thiopurine methyltransferase deficiency (Azathioprine/6-MP toxicity)", sensitivityRisk: "thiopurines" },
  { id: "var10", name: "SLCO1B1*5", description: "Statin-induced myopathy risk", sensitivityRisk: "statins" }
];

// Mock diseases
export const diseases: Disease[] = [
  { id: "dis1", name: "Hypertension", description: "High blood pressure" },
  { id: "dis2", name: "Type 2 Diabetes", description: "Insulin resistance" },
  { id: "dis3", name: "Depression", description: "Major depressive disorder" },
  { id: "dis4", name: "Asthma", description: "Chronic lung condition" },
  { id: "dis5", name: "Epilepsy", description: "Seizure disorder" },
  { id: "dis6", name: "Rheumatoid Arthritis", description: "Autoimmune joint inflammation" },
  { id: "dis7", name: "Cardiovascular Disease", description: "Increased heart disease risk" },
  { id: "dis8", name: "Schizophrenia", description: "Chronic psychiatric disorder" },
  { id: "dis9", name: "Parkinson's Disease", description: "Neurodegenerative disorder" },
  { id: "dis10", name: "Gout", description: "Uric acid buildup causing joint inflammation" }
];

// Mock drugs
export const drugs: Drug[] = [
  { id: "drug1", name: "Metoprolol", description: "Beta-blocker for hypertension", relatedDiseases: ["dis1", "dis7"], metabolizedBy: ["var1"] },
  { id: "drug2", name: "Metformin", description: "First-line medication for type 2 diabetes", relatedDiseases: ["dis2"] },
  { id: "drug3", name: "Sertraline", description: "SSRI for depression", relatedDiseases: ["dis3"], metabolizedBy: ["var1", "var3"] },
  { id: "drug4", name: "Albuterol", description: "Bronchodilator for asthma", relatedDiseases: ["dis4"] },
  { id: "drug5", name: "Lamotrigine", description: "Anticonvulsant for epilepsy", relatedDiseases: ["dis5"] },
  { id: "drug6", name: "Lisinopril", description: "ACE inhibitor for hypertension", relatedDiseases: ["dis1", "dis7"] },
  { id: "drug7", name: "Gliclazide", description: "Sulfonylurea for type 2 diabetes", relatedDiseases: ["dis2"], metabolizedBy: ["var2", "var7"] },
  { id: "drug8", name: "Fluoxetine", description: "SSRI for depression", relatedDiseases: ["dis3"], metabolizedBy: ["var1", "var3"] },
  { id: "drug9", name: "Montelukast", description: "Leukotriene modifier for asthma", relatedDiseases: ["dis4"] },
  { id: "drug10", name: "Levetiracetam", description: "Anticonvulsant for epilepsy", relatedDiseases: ["dis5"] },
  { id: "drug11", name: "Atorvastatin", description: "Cholesterol-lowering statin", relatedDiseases: ["dis7"], contraindicatedVariants: ["var10"] },
  { id: "drug12", name: "Warfarin", description: "Anticoagulant (VKORC1 sensitivity dependent)", relatedDiseases: ["dis7"], contraindicatedVariants: ["var4"] },
  { id: "drug13", name: "Azathioprine", description: "Immunosuppressant (TPMT deficiency risk)", relatedDiseases: ["dis6"], contraindicatedVariants: ["var9"] },
  { id: "drug14", name: "Allopurinol", description: "Gout treatment", relatedDiseases: ["dis10"], contraindicatedVariants: ["var5"] },
  { id: "drug15", name: "Clopidogrel", description: "Antiplatelet drug", relatedDiseases: ["dis7"], metabolizedBy: ["var3"] }
];

// Side effects by response type
const sideEffects = {
  positive: [
    "Mild drowsiness",
    "Temporary dizziness",
    "Slight fatigue",
    "Dry mouth"
  ],
  negative: [
    "Severe headache",
    "Nausea and vomiting",
    "Skin rash",
    "Insomnia",
    "Significant blood pressure changes"
  ],
  neutral: [
    "Minimal drug effect",
    "Lack of efficacy",
    "Minor gastrointestinal discomfort"
  ]
};

// Drug-gene interaction warnings
const getWarnings = (patient: Patient, drugId: string): Warning[] => {
  const warnings: Warning[] = [];
  const drug = drugs.find(d => d.id === drugId);
  const variant = variants.find(v => v.id === patient.variantId);
  
  if (!drug || !variant) return warnings;
  
  // Check for contraindications
  if (drug.contraindicatedVariants?.includes(variant.id)) {
    warnings.push({
      type: "critical",
      message: `${drug.name} may be contraindicated with ${variant.name}`,
      explanation: `Patients with ${variant.name} may experience severe adverse reactions to ${drug.name}.`
    });
  }
  
  // Check for metabolism impact
  if (drug.metabolizedBy?.includes(variant.id) && variant.metabolismImpact === "poor") {
    warnings.push({
      type: "moderate",
      message: `Reduced ${drug.name} metabolism due to ${variant.name}`,
      explanation: `Patients with ${variant.name} may metabolize ${drug.name} more slowly, potentially leading to increased drug concentration and side effects.`
    });
  }
  
  // Check for sensitivity risk
  if (variant.sensitivityRisk) {
    if (variant.sensitivityRisk === "statins" && drug.name.includes("statin")) {
      warnings.push({
        type: "moderate",
        message: `Increased myopathy risk with ${drug.name}`,
        explanation: `Patients with ${variant.name} have increased risk of muscle pain and damage when taking statins.`
      });
    } else if (variant.sensitivityRisk === "warfarin" && drug.name === "Warfarin") {
      warnings.push({
        type: "moderate",
        message: `Increased warfarin sensitivity`,
        explanation: `Patients with ${variant.name} may require lower warfarin doses to avoid bleeding complications.`
      });
    } else if (variant.sensitivityRisk === "thiopurines" && drug.name === "Azathioprine") {
      warnings.push({
        type: "critical",
        message: `High risk of thiopurine toxicity`,
        explanation: `Patients with ${variant.name} have reduced ability to metabolize thiopurines, leading to potentially severe bone marrow suppression.`
      });
    }
  }
  
  return warnings;
};

// Get dosage recommendations based on variant and drug
const getDosageRecommendation = (patient: Patient, drugId: string, requestedDosage: number): DosageRecommendation | undefined => {
  const drug = drugs.find(d => d.id === drugId);
  const variant = variants.find(v => v.id === patient.variantId);
  
  if (!drug || !variant) return undefined;
  
  let dosageRec: DosageRecommendation = {
    standard: requestedDosage,
    recommended: requestedDosage,
    unit: "mg"
  };
  
  // Poor metabolizers may need lower doses
  if (variant.metabolismImpact === "poor" && drug.metabolizedBy?.includes(variant.id)) {
    dosageRec.recommended = requestedDosage * 0.5;
    dosageRec.adjustmentReason = `Reduced dosage recommended due to ${variant.name} poor metabolizer status`;
  }
  
  // Warfarin sensitivity
  if (variant.id === "var4" && drug.name === "Warfarin") {
    dosageRec.recommended = requestedDosage * 0.4;
    dosageRec.adjustmentReason = `Significant dosage reduction required due to VKORC1 warfarin sensitivity`;
  }
  
  // Only return if there's a change
  if (dosageRec.recommended !== dosageRec.standard) {
    return dosageRec;
  }
  
  return undefined;
};

// Prediction history storage
let predictionHistory: PredictionResponse[] = [];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Get alternatives based on disease and current drug
const getAlternatives = (diseaseId: string, currentDrugId: string): AlternativeDrug[] => {
  // Filter drugs for the same disease, excluding current drug
  const diseaseRelatedDrugs = drugs
    .filter(drug => 
      drug.relatedDiseases.includes(diseaseId) && drug.id !== currentDrugId
    )
    .map(drug => ({
      drugId: drug.id,
      drugName: drug.name,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99
      description: drug.description
    }));

  return diseaseRelatedDrugs;
};

// Get contraindications for a drug-variant pair
const getContraindications = (patient: Patient, drugId: string): string[] => {
  const contraindications: string[] = [];
  const drug = drugs.find(d => d.id === drugId);
  const variant = variants.find(v => v.id === patient.variantId);
  
  if (!drug || !variant) return contraindications;
  
  if (drug.contraindicatedVariants?.includes(variant.id)) {
    contraindications.push(`${drug.name} is contraindicated with the ${variant.name} variant.`);
  }
  
  return contraindications;
};

// Simulate an AI prediction
export const predictDrugResponse = (request: PredictionRequest): PredictionResponse => {
  // Generate deterministic but "random-seeming" response based on inputs
  const variant = variants.find(v => v.id === request.patient.variantId);
  const drug = drugs.find(d => d.id === request.drugId);
  const disease = diseases.find(d => d.id === request.patient.diseaseId);
  
  if (!variant || !drug || !disease) {
    throw new Error("Invalid variant, drug, or disease ID");
  }
  
  // Check if drug is related to the disease
  const isDrugRelatedToDisease = drug.relatedDiseases.includes(disease.id);
  
  // Check for contraindications
  const hasContraindication = drug.contraindicatedVariants?.includes(variant.id);
  
  // Determine response type based on multiple factors
  let response: ResponseType;
  if (hasContraindication) {
    response = "negative";
  } else if (!isDrugRelatedToDisease) {
    response = "neutral";
  } else {
    // For drugs that are related to the disease and not contraindicated:
    // If the patient has a poor metabolizer variant that affects the drug, response is less likely to be positive
    const isPoorMetabolizer = variant.metabolismImpact === "poor" && drug.metabolizedBy?.includes(variant.id);
    
    // Generate a weighted random response
    const responseIndex = isPoorMetabolizer
      ? Math.floor(Math.random() * 10) // 0-9
      : Math.floor(Math.random() * 10) + 5; // 5-14
      
    if (responseIndex < 3) response = "negative";
    else if (responseIndex < 7) response = "neutral";
    else response = "positive";
  }
  
  // Calculate confidence based on various factors
  let confidence = 80;
  if (hasContraindication) {
    confidence = 95; // High confidence for contraindicated drugs
  } else if (!isDrugRelatedToDisease) {
    confidence = 70; // Lower confidence for unrelated drugs
  } else if (variant.metabolismImpact === "poor" && drug.metabolizedBy?.includes(variant.id)) {
    confidence = response === "positive" ? 65 : 85; // Lower confidence for positive outcomes with poor metabolizers
  }
  confidence += Math.floor(Math.random() * 10); // Add a small random factor
  confidence = Math.min(confidence, 99); // Cap at 99%
  
  // Generate random side effects
  const numSideEffects = Math.floor(Math.random() * 3) + 1;
  const selectedSideEffects = [...sideEffects[response]]
    .sort(() => 0.5 - Math.random())
    .slice(0, numSideEffects);
  
  // Get warnings, dosage recommendations, and contraindications
  const warnings = getWarnings(request.patient, request.drugId);
  const dosageRecommendation = getDosageRecommendation(request.patient, request.drugId, request.dosage);
  const contraindications = getContraindications(request.patient, request.drugId);
  
  // Generate metabolism impact info
  let metabolismImpact = "";
  if (variant.metabolismImpact === "poor" && drug.metabolizedBy?.includes(variant.id)) {
    metabolismImpact = `${variant.name} causes reduced metabolism of ${drug.name}, potentially increasing drug concentration in the bloodstream.`;
  } else if (variant.metabolismImpact === "intermediate" && drug.metabolizedBy?.includes(variant.id)) {
    metabolismImpact = `${variant.name} may cause slightly reduced metabolism of ${drug.name}.`;
  }
  
  // Generate response details
  let details = "";
  if (response === "positive") {
    details = `Patient with ${disease.name} is predicted to respond well to ${drug.name}. Therapeutic effect is expected within standard timeframe${dosageRecommendation ? " with adjusted dosing" : ""}.`;
  } else if (response === "negative") {
    details = `Patient with ${disease.name} is predicted to have an adverse reaction to ${drug.name}. Consider alternative treatments${contraindications.length > 0 ? " due to genetic contraindications" : ""}.`;
  } else {
    details = `Patient with ${disease.name} is predicted to have limited response to ${drug.name}. May require dosage adjustment or alternative therapy.`;
  }
  
  // Create response object
  const predictionResponse: PredictionResponse = {
    id: generateId(),
    patientId: request.patientId || generateId(),
    patientName: request.patient.name,
    drugId: request.drugId,
    drugName: drug.name,
    diseaseId: disease.id,
    diseaseName: disease.name,
    response,
    confidence,
    sideEffects: selectedSideEffects,
    alternatives: getAlternatives(disease.id, drug.id),
    timestamp: request.timestamp || new Date(),
    details,
    warnings,
    dosageRecommendation,
    metabolismImpact,
    contraindications
  };
  
  // Add to history
  predictionHistory = [predictionResponse, ...predictionHistory];
  
  return predictionResponse;
};

// Get prediction history
export const getPredictionHistory = (): PredictionResponse[] => {
  return predictionHistory;
};

// Clear history
export const clearPredictionHistory = (): void => {
  predictionHistory = [];
};
