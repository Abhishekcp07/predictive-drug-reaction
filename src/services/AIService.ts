
import { PredictionRequest, PredictionResponse } from "@/utils/mockData";

export interface AIServiceOptions {
  modelVersion?: string;
  useEnhancedPrediction?: boolean;
}

export interface AIService {
  predictDrugResponse(request: PredictionRequest, options?: AIServiceOptions): Promise<PredictionResponse>;
  getModelInfo(): Promise<AIModelInfo>;
  isAvailable(): Promise<boolean>;
}

export interface AIModelInfo {
  name: string;
  version: string;
  description: string;
  accuracy: number;
  lastUpdated: Date;
  datasetSize?: number;
  trainingMethod?: string;
}

/**
 * Default model info when no AI service is available
 */
export const DEFAULT_MODEL_INFO: AIModelInfo = {
  name: "Mock Prediction Model",
  version: "1.0.0",
  description: "A simulation model that mimics pharmacogenetic prediction patterns",
  accuracy: 0.85,
  lastUpdated: new Date("2023-07-15"),
};
