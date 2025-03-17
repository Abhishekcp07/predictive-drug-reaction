
import { AIService, AIModelInfo, AIServiceOptions, DEFAULT_MODEL_INFO } from "./AIService";
import { PredictionRequest, PredictionResponse, predictDrugResponse } from "@/utils/mockData";

export class MockAIService implements AIService {
  private modelInfo: AIModelInfo = {
    ...DEFAULT_MODEL_INFO,
    name: "Mock Pharmacogenetic Model",
    description: "Simulated model for predicting drug responses based on genetic variants",
  };

  async predictDrugResponse(
    request: PredictionRequest, 
    options?: AIServiceOptions
  ): Promise<PredictionResponse> {
    console.log("MockAIService: predicting with options", options);
    
    // Add a slight delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Use our existing mock prediction function
    return predictDrugResponse(request);
  }

  async getModelInfo(): Promise<AIModelInfo> {
    return this.modelInfo;
  }

  async isAvailable(): Promise<boolean> {
    return true; // Mock service is always available
  }
}
