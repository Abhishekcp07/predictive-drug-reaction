
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ResultCard from '@/components/ResultCard';
import { PredictionResponse } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { Home, History } from 'lucide-react';

const Results = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get result from session storage
    const storedResult = sessionStorage.getItem('predictionResult');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        // Ensure timestamp is a Date object
        parsedResult.timestamp = new Date(parsedResult.timestamp);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing prediction result:', error);
        navigate('/');
      }
    } else {
      // No result found, redirect to home
      navigate('/');
    }
  }, [navigate]);

  if (!result) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Prediction Results</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              New Prediction
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </button>
          </div>
        </div>

        <ResultCard result={result} expanded={true} />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            The prediction is based on genetic markers, patient history, and medication details.
            Please consult with a healthcare professional before making treatment decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center text-sm px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              New Prediction
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center justify-center text-sm px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <History className="h-4 w-4 mr-2" />
              View All Predictions
            </button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Results;
