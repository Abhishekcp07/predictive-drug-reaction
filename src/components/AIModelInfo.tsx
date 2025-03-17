
import { useState } from 'react';
import { useAIService } from '@/hooks/useAIService';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Server, 
  Calendar, 
  BarChart4, 
  Cog, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';

const AIModelInfo = () => {
  const { 
    isUsingMock, 
    modelInfo, 
    apiAvailable, 
    toggleService,
    configureAPIService 
  } = useAIService();

  const [showConfig, setShowConfig] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com/ai');
  const [apiKey, setApiKey] = useState('');

  const handleSaveConfig = () => {
    configureAPIService(apiEndpoint, apiKey);
    setShowConfig(false);
  };

  if (!modelInfo) {
    return (
      <div className="p-4 border rounded-lg animate-pulse">
        <p className="text-muted-foreground">Loading model information...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">AI Model</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {isUsingMock ? 'Mock' : 'AI API'}
          </span>
          <Switch
            checked={!isUsingMock}
            onCheckedChange={() => toggleService()}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start">
          <Server className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <div>
            <p className="font-medium">{modelInfo.name}</p>
            <p className="text-muted-foreground">{modelInfo.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <BarChart4 className="h-4 w-4 text-muted-foreground mr-2" />
            <span>Accuracy: {(modelInfo.accuracy * 100).toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span>Updated: {new Date(modelInfo.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {!isUsingMock && (
          <div className="flex items-center mt-2">
            {apiAvailable ? (
              <div className="flex items-center text-success text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                API Connected
              </div>
            ) : (
              <div className="flex items-center text-destructive text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                API Unavailable
              </div>
            )}
          </div>
        )}
      </div>

      {!isUsingMock && (
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Cog className="h-3 w-3 mr-1" />
            Configure API
          </Button>
        </div>
      )}

      {showConfig && (
        <div className="mt-4 p-3 border rounded-md bg-muted/20 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              API Endpoint
            </label>
            <Input
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="h-8 text-sm"
              placeholder="https://api.example.com/ai"
            />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              API Key (optional)
            </label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-8 text-sm"
              type="password"
              placeholder="Enter your API key"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              size="sm" 
              className="text-xs" 
              onClick={handleSaveConfig}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelInfo;
