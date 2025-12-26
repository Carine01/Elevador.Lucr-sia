import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Zap, Infinity } from 'lucide-react';
import { useLocation } from 'wouter';

export function CreditBadge() {
  const [, navigate] = useLocation();
  const { data: subscription } = trpc.subscription.getSubscription.useQuery();

  if (!subscription) return null;

  const isUnlimited = subscription.plan === 'profissional' || subscription.creditsRemaining === -1;
  const isLow = subscription.creditsRemaining <= 2 && subscription.creditsRemaining > 0;
  const isEmpty = subscription.creditsRemaining === 0;

  return (
    <button
      onClick={() => navigate('/pricing')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
    >
      <Zap className={`h-4 w-4 ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-blue-400'}`} />
      
      {isUnlimited ? (
        <div className="flex items-center gap-1">
          <Infinity className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-white">Ilimitado</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
            {subscription.creditsRemaining}
          </span>
          <span className="text-xs text-slate-400">créditos</span>
        </div>
      )}

      {(isEmpty || isLow) && subscription.plan !== 'profissional' && (
        <Badge variant="outline" className="text-xs bg-amber-500/20 border-amber-500/50 text-amber-300">
          {isEmpty ? 'Upgrade!' : 'Baixo'}
        </Badge>
      )}
    </button>
  );
}
