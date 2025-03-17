
import { AIService, AIModelInfo, AIServiceOptions } from "./AIService";
import { PredictionRequest, PredictionResponse } from "@/utils/mockData";

export class APIAIService implements AIService {
  private apiEndpoint: string;
  private apiKey?: string;
  private modelInfo: AIModelInfo | null = null;

  constructor(apiEndpoint: string, apiKey?: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
  }

  async predictDrugResponse(
    request: PredictionRequest,
    options?: AIServiceOptions
  ): Promise<PredictionResponse> {
    try {
      // This would be replaced with actual API call when implemented
      const response = await fetch(`${this.apiEndpoint}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          request,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in AI prediction:", error);
      throw new Error("Failed to get prediction from AI service");
    }
  }

  async getModelInfo(): Promise<AIModelInfo> {
    if (this.modelInfo) return this.modelInfo;

    try {
      const response = await fetch(`${this.apiEndpoint}/model-info`, {
        headers: {
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      this.modelInfo = await response.json();
      return this.modelInfo;
    } catch (error) {
      console.error("Error fetching model info:", error);
      throw new Error("Failed to get AI model information");
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/health`);
      return response.ok;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }
}
