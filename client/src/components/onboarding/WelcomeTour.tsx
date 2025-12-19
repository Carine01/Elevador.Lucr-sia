import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Bem-vindo ao Elevare! 🚀',
    description: 'A plataforma de neurovendas com IA que vai revolucionar suas vendas na estética.',
    icon: Sparkles,
  },
  {
    title: 'Radar de Bio',
    description: 'Analise perfis do Instagram e capture leads qualificados automaticamente.',
    icon: Target,
  },
  {
    title: 'Gerador de Conteúdo',
    description: 'Crie e-books, prompts para imagens e anúncios profissionais em segundos.',
    icon: Zap,
  },
  {
    title: 'Sistema de Créditos',
    description: 'Use seus créditos mensais para acessar todas as funcionalidades premium.',
    icon: TrendingUp,
  },
];

export function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  const completeStepMutation = trpc.onboarding.completeStep.useMutation();
  
  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    completeStepMutation.mutate({ step: 'welcomeTourCompleted' });
    setIsOpen(false);
  };
  
  const currentTourStep = TOUR_STEPS[currentStep];
  const Icon = currentTourStep.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Icon className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold">{currentTourStep.title}</h2>
          <p className="text-muted-foreground">{currentTourStep.description}</p>
          
          {/* Progress dots */}
          <div className="flex gap-2">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2 mt-4">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Voltar
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === TOUR_STEPS.length - 1 ? 'Começar!' : 'Próximo'}
            </Button>
            <Button variant="ghost" onClick={handleComplete}>
              Pular
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
