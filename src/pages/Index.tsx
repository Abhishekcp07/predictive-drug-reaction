import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PredictionRequest } from '@/utils/mockData';
import PatientForm from '@/components/PatientForm';
import { useToast } from '@/hooks/use-toast';
import { useAIService } from '@/hooks/useAIService';
import AIModelInfo from '@/components/AIModelInfo';

const Index = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { predictDrugResponse, isLoading: aiLoading } = useAIService();
  
  const handleSubmit = async (request: PredictionRequest) => {
    setIsLoading(true);
    try {
      // Use our AI service hook for predictions now
      const result = await predictDrugResponse(request);
      setResult(result);
      navigate('/results');
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Pharmacogenetic Prediction System
            </h1>
            
            <p className="text-lg mb-6 text-muted-foreground">
              Predict medication responses based on genetic variants and disease profiles
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Personalized Medicine</h3>
                <p className="text-sm text-muted-foreground">Tailor treatments based on genetic profiles to improve efficacy and reduce adverse effects.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Evidence-Based Predictions</h3>
                <p className="text-sm text-muted-foreground">Leverage clinical data and genetic research to make informed treatment decisions.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Reduce Adverse Reactions</h3>
                <p className="text-sm text-muted-foreground">Identify potential drug-gene interactions before prescribing medications.</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2">Alternative Treatments</h3>
                <p className="text-sm text-muted-foreground">Discover alternative medications better suited to a patient's genetic profile.</p>
              </div>
            </div>
            
            <div className="mt-8">
              <PatientForm onSubmit={handleSubmit} />
            </div>
          </div>
          
          <div className="space-y-6">
            <AIModelInfo />
            
            <div className="border rounded-lg p-4 bg-white/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Enter patient information and select their genetic variant</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>Choose the disease and medication to evaluate</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Get a detailed prediction of medication response and recommendations</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
