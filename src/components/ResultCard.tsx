
import { motion } from 'framer-motion';
import { Check, X, Minus, DownloadCloud, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PredictionResponse } from '@/utils/mockData';
import { useState } from 'react';
import AlternativesCard from './AlternativesCard';

interface ResultCardProps {
  result: PredictionResponse;
  expanded?: boolean;
}

const ResultCard = ({ result, expanded = false }: ResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const responseColor = {
    positive: 'success',
    negative: 'destructive',
    neutral: 'info',
  }[result.response];

  const responseIcon = {
    positive: <Check className="h-6 w-6" />,
    negative: <X className="h-6 w-6" />,
    neutral: <Minus className="h-6 w-6" />,
  }[result.response];

  const responseText = {
    positive: 'Positive Response',
    negative: 'Negative Response',
    neutral: 'Neutral Response',
  }[result.response];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    // This is a mock function for now
    alert('PDF Report download would start here');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{result.patientName}</h3>
            <p className="text-muted-foreground text-sm">{formatDate(result.timestamp)}</p>
          </div>
          
          <div className={cn(
            "flex items-center px-4 py-2 rounded-full",
            {
              'bg-success/10 text-success': result.response === 'positive',
              'bg-destructive/10 text-destructive': result.response === 'negative',
              'bg-info/10 text-info': result.response === 'neutral',
            }
          )}>
            {responseIcon}
            <span className="ml-2 font-medium">{responseText}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Treatment Details</h4>
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Disease</span>
                <p className="font-medium">{result.diseaseName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Medication</span>
                <p className="font-medium">{result.drugName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Confidence</span>
                <div className="mt-1 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${result.confidence}%` }}
                      className={cn(
                        "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center",
                        {
                          'bg-success': result.response === 'positive',
                          'bg-destructive': result.response === 'negative',
                          'bg-info': result.response === 'neutral',
                        }
                      )}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold inline-block text-muted-foreground mt-1">
                    {result.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Prediction Outcome</h4>
            <div className="border rounded-lg p-4">
              <p className="text-sm">{result.details}</p>
              
              {result.sideEffects.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Potential Side Effects</h5>
                  <ul className="space-y-1">
                    {result.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <AlertCircle className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-primary hover:underline text-sm"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Alternatives
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View Alternative Medications
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <DownloadCloud className="h-4 w-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {isExpanded && result.alternatives.length > 0 && (
        <AlternativesCard 
          alternatives={result.alternatives} 
          diseaseId={result.diseaseId}
          response={result.response}
        />
      )}
    </motion.div>
  );
};

export default ResultCard;
