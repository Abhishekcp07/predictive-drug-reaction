
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PatientForm from '@/components/PatientForm';
import { PredictionRequest, predictDrugResponse, PredictionResponse } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { Dna, FlaskConical, Brain, Pill, AlertCircle, Stethoscope } from 'lucide-react';

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
            <Stethoscope className="h-4 w-4 mr-1" />
            Medical Decision Support Tool
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Pharmacogenetic Prediction System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Predict medication responses based on genetic variants, medical conditions, and drug interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Dna,
              title: "Genomic Analysis",
              description: "Analyzes genetic variants to determine how a patient will metabolize medications."
            },
            {
              icon: FlaskConical,
              title: "Personalized Medicine",
              description: "Provides tailored medication and dosage recommendations based on patient's unique profile."
            },
            {
              icon: Pill,
              title: "Drug Interaction Alerts",
              description: "Identifies potential contraindications and drug-gene interactions that may impact safety."
            },
            {
              icon: AlertCircle,
              title: "Risk Assessment",
              description: "Highlights potential adverse reactions and sensitivity based on genetic markers."
            },
            {
              icon: Brain,
              title: "AI-Powered Predictions",
              description: "Employs advanced algorithms to provide accurate response predictions."
            },
            {
              icon: Stethoscope,
              title: "Clinical Decision Support",
              description: "Assists healthcare professionals with evidence-based medication decisions."
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-primary/5 p-6 rounded-xl mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Enter Patient Data</h3>
              <p className="text-sm text-muted-foreground">Input patient details, genetic variant information, and disease diagnosis.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Select Medication</h3>
              <p className="text-sm text-muted-foreground">Choose a medication and dosage for the patient's condition.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Get Predictions</h3>
              <p className="text-sm text-muted-foreground">Receive detailed predictions on medication response, dosage adjustments, and potential interactions.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium">Analyzing patient data...</p>
                <p className="text-sm text-muted-foreground mt-2">Processing genetic markers and medication interactions</p>
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
