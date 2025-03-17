
import { useState, useEffect } from 'react';
import { PredictionRequest, PredictionResponse } from '@/utils/mockData';
import { AIModelInfo, AIServiceOptions } from '@/services/AIService';
import { aiServiceFactory } from '@/services/AIServiceFactory';
import { useToast } from './use-toast';

export function useAIService() {
  const [isUsingMock, setIsUsingMock] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<AIModelInfo | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check if API is available on mount
  useEffect(() => {
    const checkAPIAvailability = async () => {
      try {
        const available = await aiServiceFactory.isAPIServiceAvailable();
        setApiAvailable(available);
      } catch (error) {
        setApiAvailable(false);
      }
    };

    if (aiServiceFactory.getCurrentServiceType() === 'api') {
      checkAPIAvailability();
    } else {
      setIsUsingMock(true);
      fetchModelInfo();
    }
  }, []);

  // Fetch model info when service changes
  const fetchModelInfo = async () => {
    try {
      const info = await aiServiceFactory.getService().getModelInfo();
      setModelInfo(info);
    } catch (error) {
      console.error("Failed to fetch model info:", error);
      toast({
        title: "Error",
        description: "Failed to load AI model information",
        variant: "destructive",
      });
    }
  };

  // Toggle between mock and API service
  const toggleService = async () => {
    try {
      if (isUsingMock) {
        if (!apiAvailable) {
          // Try to check if API is available now
          const available = await aiServiceFactory.isAPIServiceAvailable();
          if (!available) {
            toast({
              title: "API Unavailable",
              description: "The AI prediction API is not available. Using mock service instead.",
              variant: "warning",
            });
            return;
          }
        }
        aiServiceFactory.useAPIService();
      } else {
        aiServiceFactory.useMockService();
      }
      
      setIsUsingMock(!isUsingMock);
      fetchModelInfo();
      
      toast({
        title: "Service Changed",
        description: `Now using ${!isUsingMock ? "mock" : "AI API"} prediction service`,
      });
    } catch (error) {
      console.error("Error toggling service:", error);
      toast({
        title: "Error",
        description: "Failed to change prediction service",
        variant: "destructive",
      });
    }
  };

  // Predict drug response
  const predictDrugResponse = async (request: PredictionRequest, options?: AIServiceOptions) => {
    setIsLoading(true);
    try {
      const response = await aiServiceFactory.getService().predictDrugResponse(request, options);
      return response;
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Failed to get a prediction. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Configure API service
  const configureAPIService = (endpoint: string, apiKey?: string) => {
    try {
      aiServiceFactory.configureAPIService(endpoint, apiKey);
      toast({
        title: "API Configured",
        description: "The AI prediction API has been configured",
      });
    } catch (error) {
      console.error("Configuration error:", error);
      toast({
        title: "Configuration Failed",
        description: "Failed to configure AI prediction API",
        variant: "destructive",
      });
    }
  };

  return {
    isUsingMock,
    isLoading,
    modelInfo,
    apiAvailable,
    toggleService,
    predictDrugResponse,
    configureAPIService,
  };
}
