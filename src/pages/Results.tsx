
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ResultCard from '@/components/ResultCard';
import { PredictionResponse } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { Home, History, FileDown, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this prediction with colleagues."
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy link",
          description: "Please try again or copy the URL manually.",
          variant: "destructive"
        });
      });
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Prediction Results</h1>
            <p className="text-muted-foreground">Pharmacogenetic analysis for {result.patientName}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              title="Share this prediction"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">New</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <History className="h-4 w-4 mr-2" />
              <span>History</span>
            </button>
          </div>
        </div>

        <ResultCard result={result} expanded={true} />

        <div className="mt-12 bg-primary/5 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Clinical Interpretation</h2>
          <div className="space-y-4">
            <p className="text-sm">
              This prediction is based on analysis of the patient's genetic variant 
              ({result.warnings && result.warnings.length > 0 ? 
                <span className="text-destructive font-medium">with significant interaction warnings</span> : 
                "with no major contraindications"
              }) 
              for the selected medication.
            </p>

            {result.response === "positive" && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-sm">
                <p className="font-medium text-success mb-2">Favorable Response Expected</p>
                <p>The genetic profile suggests standard treatment protocols can be followed with regular monitoring.</p>
              </div>
            )}

            {result.response === "negative" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm">
                <p className="font-medium text-destructive mb-2">Unfavorable Response Predicted</p>
                <p>Based on the genetic analysis, consider alternative medications from the suggestions provided.</p>
              </div>
            )}

            {result.response === "neutral" && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-4 text-sm">
                <p className="font-medium text-info mb-2">Variable Response Expected</p>
                <p>Close monitoring recommended with potential need for dosage adjustments.</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This prediction tool provides decision support and should not replace clinical judgment. 
              Always consider the full clinical picture and consult appropriate references before making treatment decisions.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center text-sm px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mx-auto"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Print Results
          </button>
        </div>

        <div className="mt-12 text-center">
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
