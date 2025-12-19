import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, Circle } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Digite o @ do Instagram',
    description: 'Cole o @ de um perfil para análise (sem o @)',
    highlight: 'input',
  },
  {
    id: 2,
    title: 'Clique em Analisar',
    description: 'Nossa IA vai analisar a bio em segundos',
    highlight: 'button',
  },
  {
    id: 3,
    title: 'Veja o Diagnóstico',
    description: 'Receba pontuação e recomendações personalizadas',
    highlight: 'results',
  },
  {
    id: 4,
    title: 'Capture o Lead',
    description: 'Salve o contato para follow-up',
    highlight: 'save',
  },
];

interface BioRadarTutorialProps {
  onComplete: () => void;
}

export function BioRadarTutorial({ onComplete }: BioRadarTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const completeStepMutation = trpc.onboarding.completeStep.useMutation();

  const handleComplete = () => {
    completeStepMutation.mutate({ step: 'bioRadarTutorialCompleted' });
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <Card className="p-6 mb-4 border-amber-500 border-2 animate-pulse-slow">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            Tutorial: Como usar o Radar de Bio
          </h3>
          
          <div className="space-y-2">
            {TUTORIAL_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-2 ${
                  index === currentStep ? 'text-amber-600 font-medium' : 'text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {currentStep < TUTORIAL_STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setCurrentStep(currentStep + 1)}>
              Próximo
            </Button>
          ) : (
            <Button size="sm" onClick={handleComplete}>
              Finalizar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleComplete}>
            Pular
          </Button>
        </div>
      </div>
    </Card>
  );
}
