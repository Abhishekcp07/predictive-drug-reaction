
import { motion } from 'framer-motion';
import { AlternativeDrug, ResponseType } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { ChevronRight, Award } from 'lucide-react';

interface AlternativesCardProps {
  alternatives: AlternativeDrug[];
  diseaseId: string;
  response: ResponseType;
}

const AlternativesCard = ({ alternatives, diseaseId, response }: AlternativesCardProps) => {
  // Only show alternatives if there are any or if the response was negative/neutral
  if (alternatives.length === 0 || (response === 'positive' && alternatives.length < 2)) {
    return null;
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="border-t px-6 py-5 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Alternative Medications</h3>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {alternatives.map((alt, index) => (
          <motion.div
            key={alt.drugId}
            variants={item}
            className={cn(
              "border rounded-lg p-4 bg-white hover:shadow-md transition-shadow",
              index === 0 && response !== 'positive' && "border-success/30 bg-success/5"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">
                {alt.drugName}
                {index === 0 && response !== 'positive' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-success/20 text-success">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </span>
                )}
              </h4>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-1">
                  {alt.confidence}%
                </span>
                <div className="h-2 w-10 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${alt.confidence}%` }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{alt.description}</p>
            
            <button className="mt-3 text-sm text-primary flex items-center hover:underline">
              View details
              <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AlternativesCard;
