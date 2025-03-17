
import { AIService } from "./AIService";
import { MockAIService } from "./MockAIService";
import { APIAIService } from "./APIAIService";

type AIServiceType = "mock" | "api";

/**
 * Factory for creating AI services
 */
export class AIServiceFactory {
  private static instance: AIServiceFactory;
  private services: Map<AIServiceType, AIService> = new Map();
  private currentType: AIServiceType = "mock";

  private constructor() {
    // Initialize with mock service by default
    this.services.set("mock", new MockAIService());
  }

  public static getInstance(): AIServiceFactory {
    if (!AIServiceFactory.instance) {
      AIServiceFactory.instance = new AIServiceFactory();
    }
    return AIServiceFactory.instance;
  }

  /**
   * Get the current AI service
   */
  public getService(): AIService {
    const service = this.services.get(this.currentType);
    if (!service) {
      throw new Error(`No AI service available for type: ${this.currentType}`);
    }
    return service;
  }

  /**
   * Configure the API-based AI service
   */
  public configureAPIService(endpoint: string, apiKey?: string): void {
    this.services.set("api", new APIAIService(endpoint, apiKey));
  }

  /**
   * Switch to using the API service
   */
  public useAPIService(): void {
    if (!this.services.has("api")) {
      throw new Error("API service not configured. Call configureAPIService first.");
    }
    this.currentType = "api";
  }

  /**
   * Switch to using the mock service
   */
  public useMockService(): void {
    this.currentType = "mock";
  }

  /**
   * Get the current service type
   */
  public getCurrentServiceType(): AIServiceType {
    return this.currentType;
  }

  /**
   * Check if the API service is available
   */
  public async isAPIServiceAvailable(): Promise<boolean> {
    const apiService = this.services.get("api");
    if (!apiService) return false;
    return apiService.isAvailable();
  }
}

// Export a singleton instance
export const aiServiceFactory = AIServiceFactory.getInstance();
