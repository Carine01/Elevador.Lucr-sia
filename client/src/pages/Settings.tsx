import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";

export default function Settings() {
  const [, navigate] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success("Conta deletada com sucesso. Redirecionando...");
      
      // Redirecionar para home após 3 segundos para dar tempo de ler a mensagem
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Erro ao deletar conta. Tente novamente.");
      setIsDeleting(false);
    }
  };

  return (
    <ElevareDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Configurações</h1>

        {/* Zona de Perigo */}
        <Card className="bg-red-950/20 border-red-900/50 p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Zona de Perigo</h2>
          <p className="text-slate-400 mb-4">
            Ações irreversíveis. Certifique-se do que está fazendo.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Minha Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Você tem certeza absoluta?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Esta ação é <strong className="text-red-400">IRREVERSÍVEL</strong>. 
                  Todos os seus dados serão permanentemente deletados:
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>Conta e perfil</li>
                    <li>Assinatura ativa</li>
                    <li>Todos os leads e agendamentos</li>
                    <li>Todo o conteúdo gerado</li>
                    <li>Histórico completo</li>
                  </ul>
                  <p className="mt-4 font-semibold text-red-400">
                    Não há como recuperar os dados após a exclusão.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deletando...
                    </>
                  ) : (
                    "Sim, Deletar Permanentemente"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        {/* Informações LGPD */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Seus Direitos (LGPD)
          </h3>
          <ul className="text-slate-400 space-y-2 text-sm">
            <li>✅ <strong>Acesso:</strong> Você pode visualizar todos os seus dados no dashboard</li>
            <li>✅ <strong>Correção:</strong> Você pode editar suas informações a qualquer momento</li>
            <li>✅ <strong>Exclusão:</strong> Você pode deletar sua conta permanentemente</li>
            <li>✅ <strong>Portabilidade:</strong> Entre em contato para exportar seus dados</li>
          </ul>
        </Card>
      </div>
    </ElevareDashboardLayout>
  );
}
