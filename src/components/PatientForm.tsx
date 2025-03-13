
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, User, Pill, 
  Activity, FlaskConical, Dna, Droplets 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { variants, diseases, drugs, Patient, PredictionRequest } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import DrugGeneWarning from './DrugGeneWarning';

type Step = 'patient' | 'variant' | 'disease' | 'drug';

interface FormData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  variantId: string;
  diseaseId: string;
  drugId: string;
  dosage: string;
}

interface PatientFormProps {
  onSubmit: (request: PredictionRequest) => void;
}

const PatientForm = ({ onSubmit }: PatientFormProps) => {
  const [step, setStep] = useState<Step>('patient');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: 'male',
    variantId: '',
    diseaseId: '',
    drugId: '',
    dosage: '',
  });
  const [filteredDrugs, setFilteredDrugs] = useState(drugs);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter drugs when disease changes
  useEffect(() => {
    if (formData.diseaseId) {
      const relatedDrugs = drugs.filter(drug => 
        drug.relatedDiseases.includes(formData.diseaseId)
      );
      setFilteredDrugs(relatedDrugs);
      
      // Clear drug selection if it's not in the filtered list
      if (formData.drugId && !relatedDrugs.some(d => d.id === formData.drugId)) {
        setFormData(prev => ({ ...prev, drugId: '' }));
      }
    } else {
      setFilteredDrugs(drugs);
    }
  }, [formData.diseaseId]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 'patient') {
      if (!formData.name || !formData.age || !formData.gender) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all patient details',
          variant: 'destructive',
        });
        return;
      }
      setStep('variant');
    } else if (step === 'variant') {
      if (!formData.variantId) {
        toast({
          title: 'Missing information',
          description: 'Please select a genetic variant',
          variant: 'destructive',
        });
        return;
      }
      setStep('disease');
    } else if (step === 'disease') {
      if (!formData.diseaseId) {
        toast({
          title: 'Missing information',
          description: 'Please select a disease',
          variant: 'destructive',
        });
        return;
      }
      setStep('drug');
    } else if (step === 'drug') {
      if (!formData.drugId || !formData.dosage) {
        toast({
          title: 'Missing information',
          description: 'Please select a drug and dosage',
          variant: 'destructive',
        });
        return;
      }
      
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step === 'variant') setStep('patient');
    else if (step === 'disease') setStep('variant');
    else if (step === 'drug') setStep('disease');
  };

  const handleSubmit = () => {
    if (
      !formData.name || 
      !formData.age || 
      !formData.gender || 
      !formData.variantId || 
      !formData.diseaseId || 
      !formData.drugId || 
      !formData.dosage
    ) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient: Patient = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      variantId: formData.variantId,
      diseaseId: formData.diseaseId,
    };

    const request: PredictionRequest = {
      patient,
      drugId: formData.drugId,
      dosage: parseFloat(formData.dosage),
      timestamp: new Date(),
    };

    onSubmit(request);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderStepContent = () => {
    switch (step) {
      case 'patient':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <User className="mr-2 h-6 w-6 text-primary" />
              Patient Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter patient age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => updateFormData('gender', gender as 'male' | 'female' | 'other')}
                      className={cn(
                        'px-4 py-2 border rounded-md transition-colors',
                        formData.gender === gender
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      )}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'variant':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Dna className="mr-2 h-6 w-6 text-primary" />
              Genetic Variant
            </h2>
            <p className="text-muted-foreground">
              Select the patient's genetic variant to help predict drug response.
            </p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {variants.map((variant) => (
                <motion.div
                  key={variant.id}
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => updateFormData('variantId', variant.id)}
                    className={cn(
                      'w-full p-4 border rounded-lg text-left transition-all hover:shadow-md',
                      formData.variantId === variant.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <h3 className="font-medium text-lg">{variant.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{variant.description}</p>
                    {variant.metabolismImpact && (
                      <span className={cn(
                        "inline-block text-xs px-2 py-0.5 rounded-full mt-2",
                        {
                          "bg-success/20 text-success": variant.metabolismImpact === "normal",
                          "bg-warning/20 text-warning": variant.metabolismImpact === "intermediate",
                          "bg-destructive/20 text-destructive": variant.metabolismImpact === "poor"
                        }
                      )}>
                        {variant.metabolismImpact.charAt(0).toUpperCase() + variant.metabolismImpact.slice(1)} metabolizer
                      </span>
                    )}
                    {variant.sensitivityRisk && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-2 bg-destructive/20 text-destructive ml-2">
                        Sensitivity risk
                      </span>
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 'disease':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Activity className="mr-2 h-6 w-6 text-primary" />
              Disease Information
            </h2>
            <p className="text-muted-foreground">
              Select the primary condition for which medication is being prescribed.
            </p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {diseases.map((disease) => (
                <motion.div
                  key={disease.id}
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={() => updateFormData('diseaseId', disease.id)}
                    className={cn(
                      'w-full p-4 border rounded-lg text-left transition-all hover:shadow-md',
                      formData.diseaseId === disease.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <h3 className="font-medium text-lg">{disease.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{disease.description}</p>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 'drug':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Pill className="mr-2 h-6 w-6 text-primary" />
              Medication Details
            </h2>
            
            {formData.variantId && formData.drugId && (
              <DrugGeneWarning 
                variantId={formData.variantId} 
                drugId={formData.drugId} 
              />
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Medication for {diseases.find(d => d.id === formData.diseaseId)?.name}
                </label>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredDrugs.map((drug) => (
                    <motion.div
                      key={drug.id}
                      variants={itemVariants}
                    >
                      <button
                        type="button"
                        onClick={() => updateFormData('drugId', drug.id)}
                        className={cn(
                          'w-full p-4 border rounded-lg text-left transition-all hover:shadow-md',
                          formData.drugId === drug.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <h3 className="font-medium text-lg">{drug.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{drug.description}</p>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <div className="pt-4">
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Droplets className="mr-1 h-4 w-4" />
                  Dosage (mg)
                </label>
                <input
                  type="number"
                  id="dosage"
                  min="0.1"
                  step="0.1"
                  value={formData.dosage}
                  onChange={(e) => updateFormData('dosage', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter dosage in milligrams"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps: Step[] = ['patient', 'variant', 'disease', 'drug'];
  const progress = ((steps.indexOf(step) + 1) / steps.length) * 100;

  return (
    <div className="glass rounded-2xl p-6 shadow-glass border border-white/50">
      <div className="mb-8">
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((s, i) => (
            <div 
              key={s} 
              className={cn(
                "flex flex-col items-center",
                steps.indexOf(step) >= i ? "text-primary" : "text-gray-400"
              )}
            >
              <div 
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs mb-1",
                  steps.indexOf(step) >= i 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {i + 1}
              </div>
              <span className="text-xs capitalize hidden md:block">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        nextStep();
      }}>
        {renderStepContent()}

        <div className="mt-8 flex justify-between">
          {step !== 'patient' ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            className="flex items-center space-x-1 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <span>{step === 'drug' ? 'Predict Response' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
