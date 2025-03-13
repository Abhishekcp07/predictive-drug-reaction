import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PatientForm from '@/components/PatientForm';
import { PredictionRequest, predictDrugResponse, PredictionResponse } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { Dna, FlaskConical, Brain } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (request: PredictionRequest) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate prediction result using mock data
      const result = predictDrugResponse(request);
      
      // Store result in session storage for the results page
      sessionStorage.setItem('predictionResult', JSON.stringify(result));
      
      // Navigate to results page
      navigate('/results');
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4"
          >
            AI-Powered Drug Response Prediction
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Predict Medication Responses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalized medicine powered by genomic data analysis for better patient outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Dna,
              title: "Genomic Analysis",
              description: "Uses genetic markers to predict how a patient will respond to medications."
            },
            {
              icon: FlaskConical,
              title: "Personalized Medicine",
              description: "Tailored recommendations based on individual patient characteristics."
            },
            {
              icon: Brain,
              title: "AI-Powered Predictions",
              description: "Advanced algorithms to provide accurate response predictions."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="glass p-6 rounded-xl text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium">Analyzing patient data...</p>
              </div>
            </div>
          )}
          <PatientForm onSubmit={handleSubmit} />
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
