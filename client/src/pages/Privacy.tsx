import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-slate-300">
          <h1 className="text-3xl font-bold text-white mb-6">Política de Privacidade</h1>
          
          <p className="mb-4 text-sm text-slate-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">1. Dados Coletados</h2>
            <p className="mb-2">Coletamos apenas os dados essenciais:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nome e e-mail (via OAuth Google/Apple/Microsoft)</li>
              <li>Leads e agendamentos que você criar</li>
              <li>Conteúdo gerado pelas ferramentas de IA</li>
              <li>Dados de assinatura e pagamento (via Stripe)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">2. Uso dos Dados</h2>
            <p>Seus dados são usados exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Autenticação e acesso ao sistema</li>
              <li>Geração de conteúdo personalizado</li>
              <li>Processamento de pagamentos</li>
              <li>Melhorias no serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">3. Compartilhamento</h2>
            <p>
              <strong className="text-white">Nunca vendemos seus dados.</strong> Compartilhamos apenas com:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Stripe (processamento de pagamentos)</li>
              <li>Manus OAuth (autenticação)</li>
              <li>Forge API (geração de conteúdo IA)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">4. Seus Direitos (LGPD)</h2>
            <p className="mb-2">Você tem direito a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Acesso:</strong> Visualizar seus dados no dashboard</li>
              <li><strong>Correção:</strong> Editar suas informações</li>
              <li><strong>Exclusão:</strong> Deletar sua conta em Configurações</li>
              <li><strong>Portabilidade:</strong> Solicitar exportação de dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>
              Usamos cookies essenciais para autenticação (JWT). Você pode gerenciar 
              suas preferências no banner de cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">6. Segurança</h2>
            <p>
              Seus dados são protegidos com criptografia HTTPS, JWT com assinatura 
              criptográfica, e acesso restrito por usuário.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contato</h2>
            <p>
              Dúvidas sobre privacidade? Entre em contato: <br />
              <a href="mailto:contato@lucresia.com" className="text-amber-400 hover:text-amber-300 underline">
                contato@lucresia.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
