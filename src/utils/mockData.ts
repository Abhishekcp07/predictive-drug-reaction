
export interface Variant {
  id: string;
  name: string;
  description: string;
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
}

// Mock genetic variants
export const variants: Variant[] = [
  { id: "var1", name: "CYP2D6*1", description: "Normal metabolizer" },
  { id: "var2", name: "CYP2C9*2", description: "Intermediate metabolizer" },
  { id: "var3", name: "CYP2C19*2", description: "Poor metabolizer" },
  { id: "var4", name: "VKORC1-1639G>A", description: "Warfarin sensitivity" },
  { id: "var5", name: "HLA-B*5701", description: "Abacavir hypersensitivity" },
];

// Mock diseases
export const diseases: Disease[] = [
  { id: "dis1", name: "Hypertension", description: "High blood pressure" },
  { id: "dis2", name: "Type 2 Diabetes", description: "Insulin resistance" },
  { id: "dis3", name: "Depression", description: "Major depressive disorder" },
  { id: "dis4", name: "Asthma", description: "Chronic lung condition" },
  { id: "dis5", name: "Epilepsy", description: "Seizure disorder" },
];

// Mock drugs
export const drugs: Drug[] = [
  { id: "drug1", name: "Metoprolol", description: "Beta-blocker for hypertension" },
  { id: "drug2", name: "Metformin", description: "First-line medication for type 2 diabetes" },
  { id: "drug3", name: "Sertraline", description: "SSRI for depression" },
  { id: "drug4", name: "Albuterol", description: "Bronchodilator for asthma" },
  { id: "drug5", name: "Lamotrigine", description: "Anticonvulsant for epilepsy" },
  { id: "drug6", name: "Lisinopril", description: "ACE inhibitor for hypertension" },
  { id: "drug7", name: "Gliclazide", description: "Sulfonylurea for type 2 diabetes" },
  { id: "drug8", name: "Fluoxetine", description: "SSRI for depression" },
  { id: "drug9", name: "Montelukast", description: "Leukotriene modifier for asthma" },
  { id: "drug10", name: "Levetiracetam", description: "Anticonvulsant for epilepsy" },
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

// Prediction history storage
let predictionHistory: PredictionResponse[] = [];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Get alternatives based on disease and current drug
const getAlternatives = (diseaseId: string, currentDrugId: string): AlternativeDrug[] => {
  // Filter drugs for the same disease, excluding current drug
  const diseaseRelatedDrugs = drugs
    .filter(drug => {
      if (diseaseId === "dis1" && ["drug1", "drug6"].includes(drug.id) && drug.id !== currentDrugId) {
        return true;
      }
      if (diseaseId === "dis2" && ["drug2", "drug7"].includes(drug.id) && drug.id !== currentDrugId) {
        return true;
      }
      if (diseaseId === "dis3" && ["drug3", "drug8"].includes(drug.id) && drug.id !== currentDrugId) {
        return true;
      }
      if (diseaseId === "dis4" && ["drug4", "drug9"].includes(drug.id) && drug.id !== currentDrugId) {
        return true;
      }
      if (diseaseId === "dis5" && ["drug5", "drug10"].includes(drug.id) && drug.id !== currentDrugId) {
        return true;
      }
      return false;
    })
    .map(drug => ({
      drugId: drug.id,
      drugName: drug.name,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99
      description: drug.description
    }));

  return diseaseRelatedDrugs;
};

// Simulate an AI prediction
export const predictDrugResponse = (request: PredictionRequest): PredictionResponse => {
  // Generate deterministic but "random-seeming" response based on inputs
  const responseTypeIndex = (
    variants.findIndex(v => v.id === request.patient.variantId) +
    diseases.findIndex(d => d.id === request.patient.diseaseId) +
    drugs.findIndex(d => d.id === request.drugId) +
    request.patient.age
  ) % 3;
  
  const responseTypes: ResponseType[] = ["positive", "negative", "neutral"];
  const response: ResponseType = responseTypes[responseTypeIndex];
  
  // Find drug and disease objects
  const drug = drugs.find(d => d.id === request.drugId);
  const disease = diseases.find(d => d.id === request.patient.diseaseId);
  
  if (!drug || !disease) {
    throw new Error("Invalid drug or disease ID");
  }
  
  // Calculate confidence based on dosage - just for simulation
  let confidence = Math.floor(Math.random() * 20) + 80; // 80-99
  if (response === "negative") {
    confidence = Math.floor(Math.random() * 15) + 85; // Higher confidence for negative responses
  } else if (response === "neutral") {
    confidence = Math.floor(Math.random() * 30) + 60; // Lower confidence for neutral responses
  }
  
  // Generate random side effects
  const numSideEffects = Math.floor(Math.random() * 3) + 1;
  const selectedSideEffects = [...sideEffects[response]]
    .sort(() => 0.5 - Math.random())
    .slice(0, numSideEffects);
  
  // Generate response details
  let details = "";
  if (response === "positive") {
    details = `Patient with ${disease.name} is predicted to respond well to ${drug.name}. Therapeutic effect is expected within standard timeframe with minimal side effects.`;
  } else if (response === "negative") {
    details = `Patient with ${disease.name} is predicted to have an adverse reaction to ${drug.name}. Consider alternative treatments or close monitoring.`;
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
