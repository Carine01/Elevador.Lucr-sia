import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Zap, Crown } from 'lucide-react';

interface CreditGuardProps {
  children: ReactNode;
  requiredCredits?: number;
  featureName?: string;
}

export function CreditGuard({ 
  children, 
  requiredCredits = 1,
  featureName = 'esta funcionalidade' 
}: CreditGuardProps) {
  const [, navigate] = useLocation();
  const { data: subscription, isLoading } = trpc.subscription.getSubscription.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  // Plano profissional = ilimitado
  if (subscription?.plan === 'profissional' || subscription?.creditsRemaining === -1) {
    return <>{children}</>;
  }

  // Verificar se tem créditos suficientes
  const hasEnoughCredits = (subscription?.creditsRemaining ?? 0) >= requiredCredits;

  if (!hasEnoughCredits) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-center">
              Créditos insuficientes
            </DialogTitle>
            <DialogDescription className="text-center">
              Você precisa de <strong>{requiredCredits} crédito(s)</strong> para usar {featureName}.
              <br />
              <span className="text-slate-500">
                Saldo atual: {subscription?.creditsRemaining ?? 0} créditos
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Plano Essencial */}
            {subscription?.plan === 'free' && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Plano Essencial</span>
                  <span className="ml-auto text-lg font-bold">R$ 57/mês</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  5 créditos por mês para continuar gerando conteúdo
                </p>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Fazer upgrade
                </Button>
              </div>
            )}

            {/* Plano Profissional */}
            <div className="rounded-lg border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-600" />
                <span className="font-semibold">Plano Profissional</span>
                <span className="ml-auto text-lg font-bold">R$ 97/mês</span>
              </div>
              <p className="text-sm text-slate-700 mb-3">
                <strong className="text-amber-700">Créditos ilimitados</strong> + todas as funcionalidades
              </p>
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                Upgrade ilimitado 🚀
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Voltar ao dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
}
