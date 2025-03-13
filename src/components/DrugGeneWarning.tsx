
import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { variants, drugs } from '@/utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface DrugGeneWarningProps {
  variantId: string;
  drugId: string;
}

const DrugGeneWarning = ({ variantId, drugId }: DrugGeneWarningProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (!variantId || !drugId) return null;
  
  const variant = variants.find(v => v.id === variantId);
  const drug = drugs.find(d => d.id === drugId);
  
  if (!variant || !drug) return null;
  
  // Check for contraindications
  const isContraindicated = drug.contraindicatedVariants?.includes(variant.id);
  
  // Check for metabolism issues
  const isMetabolismIssue = variant.metabolismImpact === "poor" && drug.metabolizedBy?.includes(variant.id);
  
  // Check for sensitivity issues
  const hasSensitivityIssue = 
    (variant.sensitivityRisk === "statins" && drug.name.toLowerCase().includes("statin")) ||
    (variant.sensitivityRisk === "warfarin" && drug.name === "Warfarin") ||
    (variant.sensitivityRisk === "thiopurines" && drug.name === "Azathioprine");
  
  if (!isContraindicated && !isMetabolismIssue && !hasSensitivityIssue) return null;
  
  const warningType = isContraindicated ? "critical" : (isMetabolismIssue || hasSensitivityIssue ? "moderate" : "mild");
  
  let warningTitle = "";
  let warningDescription = "";
  
  if (isContraindicated) {
    warningTitle = `${drug.name} is contraindicated with ${variant.name}`;
    warningDescription = `Patients with ${variant.name} may experience severe adverse reactions to ${drug.name}. Consider alternative medications.`;
  } else if (isMetabolismIssue) {
    warningTitle = `Poor metabolism of ${drug.name} with ${variant.name}`;
    warningDescription = `${variant.name} causes reduced metabolism of ${drug.name}, potentially increasing blood levels. Dosage adjustment may be needed.`;
  } else if (hasSensitivityIssue) {
    if (variant.sensitivityRisk === "statins") {
      warningTitle = `Increased myopathy risk with ${drug.name}`;
      warningDescription = `Patients with ${variant.name} have increased risk of muscle pain and damage when taking statins.`;
    } else if (variant.sensitivityRisk === "warfarin") {
      warningTitle = `Increased warfarin sensitivity`;
      warningDescription = `Patients with ${variant.name} may require lower warfarin doses to avoid bleeding complications.`;
    } else if (variant.sensitivityRisk === "thiopurines") {
      warningTitle = `High risk of thiopurine toxicity`;
      warningDescription = `Patients with ${variant.name} have reduced ability to metabolize thiopurines, leading to potentially severe bone marrow suppression.`;
    }
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={cn(
          "rounded-lg p-4 mb-4",
          {
            "bg-destructive/10 border border-destructive/20": warningType === "critical",
            "bg-warning/10 border border-warning/20": warningType === "moderate",
            "bg-info/10 border border-info/20": warningType === "mild",
          }
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <AlertCircle 
              className={cn(
                "h-5 w-5 mr-2 mt-0.5",
                {
                  "text-destructive": warningType === "critical",
                  "text-warning": warningType === "moderate",
                  "text-info": warningType === "mild",
                }
              )} 
            />
            <div>
              <h4 
                className={cn(
                  "font-medium",
                  {
                    "text-destructive": warningType === "critical",
                    "text-warning": warningType === "moderate",
                    "text-info": warningType === "mild",
                  }
                )}
              >
                {warningTitle}
              </h4>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm"
                  >
                    {warningDescription}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DrugGeneWarning;
