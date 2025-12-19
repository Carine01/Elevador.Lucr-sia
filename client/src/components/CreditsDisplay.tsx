import { trpc } from "@/lib/trpc";
import { Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CreditsDisplay() {
  const [, navigate] = useLocation();
  const { data: credits, isLoading } = trpc.subscription.getCredits.useQuery();

  if (isLoading || !credits) return null;

  const maxCredits = credits.plan === 'free' ? 1 : credits.plan === 'pro' ? 10 : 999999;
  const percentage = credits.isUnlimited ? 100 : (credits.balance / maxCredits) * 100;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="font-semibold">Créditos</span>
        </div>
        <span className="text-2xl font-bold">
          {credits.isUnlimited ? '∞' : credits.balance}
        </span>
      </div>
      
      {!credits.isUnlimited && (
        <>
          <Progress value={percentage} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {credits.balance} de {maxCredits} disponíveis
          </p>
        </>
      )}
      
      {credits.balance === 0 && !credits.isUnlimited && (
        <Button 
          onClick={() => navigate('/pricing')} 
          className="w-full mt-2"
          variant="default"
        >
          Fazer Upgrade
        </Button>
      )}
    </Card>
  );
}
