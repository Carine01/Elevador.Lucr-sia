import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

export function OnboardingChecklist() {
  const { data: progress } = trpc.onboarding.getProgress.useQuery();
  const [, navigate] = useLocation();

  if (!progress || progress.isComplete) return null;

  const steps = [
    {
      id: 'welcomeTourCompleted',
      title: 'Complete o tour de boas-vindas',
      completed: progress.welcomeTourCompleted,
      action: () => {},
    },
    {
      id: 'bioRadarTutorialCompleted',
      title: 'Experimente o Radar de Bio',
      completed: progress.bioRadarTutorialCompleted,
      action: () => navigate('/dashboard/radar-bio'),
    },
    {
      id: 'firstEbookGenerated',
      title: 'Gere seu primeiro e-book',
      completed: progress.firstEbookGenerated,
      action: () => navigate('/dashboard/ebooks'),
    },
    {
      id: 'firstPromptGenerated',
      title: 'Crie um prompt de imagem',
      completed: progress.firstPromptGenerated,
      action: () => navigate('/dashboard/robo-produtor'),
    },
    {
      id: 'profileCompleted',
      title: 'Complete seu perfil',
      completed: progress.profileCompleted,
      action: () => navigate('/profile'),
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-lg">Primeiros Passos</h3>
      </div>
      
      <Progress value={progress.percentage} className="mb-4" />
      
      <p className="text-sm text-muted-foreground mb-4">
        {progress.completedSteps} de {progress.totalSteps} completos
      </p>
      
      <div className="space-y-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={step.action}
            className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-gray-50 transition"
          >
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
              {step.title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
