
import { motion } from 'framer-motion';
import { Check, X, Minus, DownloadCloud, AlertCircle, ChevronDown, ChevronUp, Pill, Zap, BadgePlus, BadgeMinus } from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);

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

  const getWarningColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'mild': return 'text-info bg-info/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  // Check if the dose is risky (above 1000)
  const isDoseRisky = (dose: number) => dose > 1000;

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

        {result.warnings && result.warnings.length > 0 && (
          <div className="mt-6 border border-destructive/20 bg-destructive/5 rounded-lg p-4">
            <h4 className="font-medium flex items-center text-destructive mb-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              Important Warnings
            </h4>
            <div className="space-y-2">
              {result.warnings.map((warning, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-3 rounded-md text-sm",
                    getWarningColor(warning.type)
                  )}
                >
                  <p className="font-medium">{warning.message}</p>
                  <p className="mt-1 text-sm opacity-80">{warning.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
              
              {result.dosageRecommendation && (
                <div className="border-t pt-3">
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Dosage Recommendation</span>
                  </div>
                  <div className="mt-2 ml-6 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Standard dose:</span>
                      <span className={cn(
                        "font-medium",
                        { "text-[#ea384c] font-bold": isDoseRisky(result.dosageRecommendation.standard) }
                      )}>
                        {result.dosageRecommendation.standard} {result.dosageRecommendation.unit}
                        {isDoseRisky(result.dosageRecommendation.standard) && (
                          <span className="ml-2 text-[10px] bg-[#ea384c] text-white px-1.5 py-0.5 rounded uppercase">High dose</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span>Recommended dose:</span>
                      <span className={cn(
                        "font-medium",
                        { "text-primary": !isDoseRisky(result.dosageRecommendation.recommended) },
                        { "text-[#F97316] font-bold": isDoseRisky(result.dosageRecommendation.recommended) }
                      )}>
                        {result.dosageRecommendation.recommended} {result.dosageRecommendation.unit}
                        {isDoseRisky(result.dosageRecommendation.recommended) && (
                          <span className="ml-2 text-[10px] bg-[#F97316] text-white px-1.5 py-0.5 rounded uppercase">High dose</span>
                        )}
                      </span>
                    </div>
                    {result.dosageRecommendation.adjustmentReason && (
                      <p className="mt-2 text-xs text-muted-foreground">{result.dosageRecommendation.adjustmentReason}</p>
                    )}
                    {(isDoseRisky(result.dosageRecommendation.standard) || isDoseRisky(result.dosageRecommendation.recommended)) && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded-md text-xs text-destructive">
                        <strong>Warning:</strong> Doses above 1000 {result.dosageRecommendation.unit} may carry increased risk of adverse effects.
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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
            
            {result.metabolismImpact && (
              <div className="mt-4 border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Zap className="h-4 w-4 text-warning mr-2" />
                  <h5 className="text-sm font-medium">Metabolism Impact</h5>
                </div>
                <p className="text-sm">{result.metabolismImpact}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Prediction Outcome</h4>
            <div className="border rounded-lg p-4">
              <p className="text-sm">{result.details}</p>
              
              {result.contraindications && result.contraindications.length > 0 && (
                <div className="mt-3 p-2 bg-destructive/10 rounded-md">
                  <h5 className="text-xs font-medium text-destructive mb-1">Contraindications</h5>
                  <ul className="space-y-1">
                    {result.contraindications.map((contraindication, index) => (
                      <li key={index} className="flex items-start text-xs text-destructive">
                        <X className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{contraindication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
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
              
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs flex items-center text-primary hover:underline"
                >
                  {showDetails ? (
                    <>
                      <BadgeMinus className="h-3 w-3 mr-1" />
                      Hide technical details
                    </>
                  ) : (
                    <>
                      <BadgePlus className="h-3 w-3 mr-1" />
                      Show technical details
                    </>
                  )}
                </button>
                
                {showDetails && (
                  <div className="mt-3 text-xs text-muted-foreground space-y-2">
                    <p>Response determination is based on genetic variant-drug interactions, disease-specific efficacy data, and known metabolism pathways.</p>
                    <p>Confidence score is calculated from clinical trial data, pharmacogenomic studies, and published literature.</p>
                  </div>
                )}
              </div>
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
