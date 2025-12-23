import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import QuizBio from "@/components/diagnostico/QuizBio";
import ResultadoBio from "@/components/diagnostico/ResultadoBio";
import QuizConsciencia from "@/components/diagnostico/QuizConsciencia";
import QuizFinanceiro from "@/components/diagnostico/QuizFinanceiro";
import { UnlockModal, ProgressBar } from "@/components/UnlockModal";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

type Etapa = 
  | "intro" 
  | "quiz-bio" 
  | "resultado-bio" 
  | "quiz-consciencia" 
  | "resultado-consciencia"
  | "quiz-financeiro" 
  | "resultado-final"
  | "captura-lead";

interface Scores {
  bio: number;
  consciencia: number;
  financeiro: number;
}

export default function DiagnosticoElevare() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [scores, setScores] = useState<Scores>({ bio: 0, consciencia: 0, financeiro: 0 });
  const [diagnosticoIA, setDiagnosticoIA] = useState<string>("");
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [erroIA, setErroIA] = useState<string | null>(null);
  
  // Modal de desbloqueio (gamificação)
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [diagnosticoId, setDiagnosticoId] = useState<number | undefined>();
  
  // Referral tracking
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  // Lead capture
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  // Mutation para gerar diagnóstico com IA
  const gerarDiagnosticoMutation = trpc.diagnostico.gerarDiagnostico.useMutation();
  
  // Mutation para rastrear clique em referral
  const trackReferralClick = trpc.gamification.trackReferralClick.useMutation();
  const trackReferralConversion = trpc.gamification.trackReferralConversion.useMutation();

  // Capturar referral code da URL
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      // Registrar clique
      trackReferralClick.mutate({ referralCode: ref });
    }
  }, [searchString]);

  // Calcular nível da bio
  const getNivelBio = (score: number) => {
    if (score <= 6) return "Bio Invisível";
    if (score <= 9) return "Bio Estética, mas Fraca";
    return "Bio Magnética";
  };

  const getNivelConsciencia = (score: number) => {
    if (score <= 6) return "Desbravadora";
    if (score <= 9) return "Estrategista";
    return "Rainha";
  };

  const getNivelFinanceiro = (score: number) => {
    if (score <= 6) return "Modo Técnica";
    if (score <= 9) return "Em Transição";
    return "Modo CEO";
  };

  // Fase de maturidade geral
  const getFaseMaturidade = (total: number) => {
    if (total <= 15) return "Desbravadora";
    if (total <= 24) return "Estrategista";
    return "Rainha";
  };

  // Gerar diagnóstico com IA REAL
  const gerarDiagnosticoIA = async (scoresFinais: Scores) => {
    setIsLoadingIA(true);
    setErroIA(null);
    
    const nivelBio = getNivelBio(scoresFinais.bio);
    const nivelConsciencia = getNivelConsciencia(scoresFinais.consciencia);
    const nivelFinanceiro = getNivelFinanceiro(scoresFinais.financeiro);

    try {
      const resultado = await gerarDiagnosticoMutation.mutateAsync({
        scoreBio: scoresFinais.bio,
        scoreConsciencia: scoresFinais.consciencia,
        scoreFinanceiro: scoresFinais.financeiro,
        nivelBio,
        nivelConsciencia,
        nivelFinanceiro,
      });
      
      setDiagnosticoIA(resultado.diagnostico);
    } catch (error: any) {
      console.error("Erro ao gerar diagnóstico:", error);
      setErroIA(error?.message || "Não foi possível gerar o diagnóstico. Tente novamente.");
      
      // Fallback: diagnóstico estático se a IA falhar
      const totalScore = scoresFinais.bio + scoresFinais.consciencia + scoresFinais.financeiro;
      let diagnosticoFallback = "";
      
      if (totalScore <= 18) {
        diagnosticoFallback = `**Sua clínica está operando abaixo do potencial.**

Você tem talento e entrega resultados — isso é inegável. Mas seu Instagram não reflete isso. Clientes chegam, olham, e vão embora sem entender por que deveriam escolher você.

**O que está travando seus agendamentos:**
Sua bio não comunica diferencial. Seus destaques não conduzem à decisão. E suas clientes ainda estão no modo "pesquisa de preço".

**O impacto no faturamento:**
Você está deixando dinheiro na mesa todo mês. Não por falta de demanda, mas porque a demanda certa não está chegando até você.

**Prioridade de correção:**
Comece pela bio e pelos destaques. São a porta de entrada.

**Próximo passo:**
O Elevare foi criado exatamente para isso: transformar sua presença digital em uma máquina de agendamentos qualificados.`;
      } else if (totalScore <= 27) {
        diagnosticoFallback = `**Você está no caminho certo, mas falta consistência.**

Seu perfil tem potencial. Você já entende que não é só sobre postar bonito — é sobre estratégia.

**O que está travando seus agendamentos:**
Você atrai interesse, mas não urgência. Suas clientes admiram seu trabalho, mas não sentem que precisam agendar *agora*.

**O impacto no faturamento:**
Você poderia estar faturando 30-50% a mais com a mesma estrutura. O gargalo não é capacidade — é conversão.

**Prioridade de correção:**
Otimize seu funil de conversão. Bio, destaques e CTAs precisam trabalhar juntos.

**Próximo passo:**
Com o Elevare, você automatiza a parte estratégica e foca no que faz de melhor: atender.`;
      } else {
        diagnosticoFallback = `**Você já domina o básico. Agora é hora de escalar.**

Parabéns — você faz parte de uma minoria. Sua bio comunica, suas clientes confiam, e sua gestão tem estrutura.

**O que pode estar limitando sua escala:**
Você ainda é o centro de tudo. Marketing, atendimento, gestão — tudo passa por você.

**O impacto no faturamento:**
Você está próxima do limite do modelo atual. Para faturar mais, precisa de sistemas que multipliquem seu tempo.

**Prioridade de correção:**
Automatize o que pode ser automatizado. Delegue o operacional.

**Próximo passo:**
O Elevare foi pensado para clínicas no seu estágio: ferramentas de IA para conteúdo, CRM para pipeline de vendas, e automações.`;
      }
      
      setDiagnosticoIA(diagnosticoFallback);
    } finally {
      setIsLoadingIA(false);
    }
  };

  // Handlers
  const handleFinishBio = (score: number) => {
    setScores(prev => ({ ...prev, bio: score }));
    setEtapa("resultado-bio");
  };

  const handleFinishConsciencia = (score: number) => {
    setScores(prev => ({ ...prev, consciencia: score }));
    setEtapa("resultado-consciencia");
  };

  const handleFinishFinanceiro = async (score: number) => {
    const newScores = { ...scores, financeiro: score };
    setScores(newScores);
    setEtapa("resultado-final");
    await gerarDiagnosticoIA(newScores);
  };

  const handleSaveLead = () => {
    if (!email && !whatsapp) return;
    // Aqui salvaria o lead no banco
    setLeadSaved(true);
  };

  const totalScore = scores.bio + scores.consciencia + scores.financeiro;
  const porcentagemTotal = Math.round((totalScore / 36) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">E</div>
            <span className="font-semibold text-gray-900">Diagnóstico Elevare</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="pt-24 pb-16 px-6">
        {/* INTRO - Landing Clean */}
        {etapa === "intro" && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-12">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-4">Diagnóstico Estratégico</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Seu Instagram atrai cliente certa ou só curiosa?
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-lg mx-auto">
                Análise em 3 níveis. Sem achismo. Sem métrica vaidosa.
              </p>
            </div>

            {/* Cards silenciosos */}
            <div className="space-y-4 mb-10 text-left">
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-medium text-gray-600">1</div>
                <div>
                  <p className="font-medium text-gray-900">Análise da Bio</p>
                  <p className="text-sm text-gray-500">Posicionamento, clareza e conversão</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-medium text-gray-600">2</div>
                <div>
                  <p className="font-medium text-gray-900">Maturidade Estratégica</p>
                  <p className="text-sm text-gray-500">Em que fase mental você está operando</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-medium text-gray-600">3</div>
                <div>
                  <p className="font-medium text-gray-900">Gestão e Escala</p>
                  <p className="text-sm text-gray-500">Onde o dinheiro está escapando</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEtapa("quiz-bio")}
              className="w-full py-4 px-8 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
            >
              Iniciar Diagnóstico
            </button>
            
            <p className="mt-4 text-sm text-gray-400">
              Menos de 3 minutos. Resultado imediato.
            </p>
          </div>
        )}

        {/* QUIZ BIO */}
        {etapa === "quiz-bio" && (
          <div className="py-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Nível 1 — Bio
              </span>
            </div>
            <QuizBio onFinish={handleFinishBio} />
          </div>
        )}

        {/* RESULTADO BIO */}
        {etapa === "resultado-bio" && (
          <div className="py-8">
            <ResultadoBio 
              score={scores.bio} 
              avancar={() => setEtapa("quiz-consciencia")} 
            />
          </div>
        )}

        {/* QUIZ CONSCIÊNCIA */}
        {etapa === "quiz-consciencia" && (
          <div className="py-8">
            <QuizConsciencia onFinish={handleFinishConsciencia} />
          </div>
        )}

        {/* RESULTADO CONSCIÊNCIA */}
        {etapa === "resultado-consciencia" && (
          <div className="py-8 max-w-2xl mx-auto text-center">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gray-900 mb-6">
                <span className="text-3xl font-bold text-gray-900">{scores.consciencia}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {getNivelConsciencia(scores.consciencia)}
              </h2>
              <p className="text-lg text-gray-600">
                {scores.consciencia <= 6 && "Você ainda opera no modo técnica. Falta mentalidade de empresária."}
                {scores.consciencia > 6 && scores.consciencia <= 9 && "Você está em transição. Já entende, mas ainda não domina."}
                {scores.consciencia > 9 && "Você pensa como CEO. Agora é escalar sem perder qualidade."}
              </p>
            </div>

            {/* Gancho */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <p className="text-gray-700 leading-relaxed">
                Agora que você sabe sua fase mental e estratégica, vamos mapear onde o dinheiro está escapando. O próximo diagnóstico é sobre gestão e escala.
              </p>
            </div>

            <button
              onClick={() => setEtapa("quiz-financeiro")}
              className="w-full py-4 px-8 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
            >
              Avançar para Diagnóstico de Gestão
            </button>
            <p className="mt-4 text-sm text-gray-400">Última etapa</p>
          </div>
        )}

        {/* QUIZ FINANCEIRO */}
        {etapa === "quiz-financeiro" && (
          <div className="py-8">
            <QuizFinanceiro onFinish={handleFinishFinanceiro} />
          </div>
        )}

        {/* RESULTADO FINAL */}
        {etapa === "resultado-final" && (
          <div className="py-8 max-w-3xl mx-auto">
            {/* Score Geral - Minimalista */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-gray-900 mb-6">
                <span className="text-4xl font-bold text-gray-900">{totalScore}</span>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Sua Fase</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{getFaseMaturidade(totalScore)}</h1>
              <p className="text-gray-500">{totalScore} de 36 pontos</p>
            </div>

            {/* Cards dos 3 níveis - Clean */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-lg font-semibold text-gray-900">{getNivelBio(scores.bio)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.bio}/12</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Maturidade</p>
                <p className="text-lg font-semibold text-gray-900">{getNivelConsciencia(scores.consciencia)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.consciencia}/12</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Gestão</p>
                <p className="text-lg font-semibold text-gray-900">{getNivelFinanceiro(scores.financeiro)}</p>
                <p className="text-sm text-gray-500 mt-1">{scores.financeiro}/12</p>
              </div>
            </div>

            {/* Diagnóstico da IA - Elegante */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-10">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Análise LucresIA</p>
              
              {isLoadingIA ? (
                <div className="py-12">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <p className="text-gray-400 mt-6 text-sm text-center">Gerando seu diagnóstico personalizado...</p>
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  {diagnosticoIA.split('\n\n').map((paragrafo, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                      {paragrafo.split('**').map((parte, j) => 
                        j % 2 === 1 ? <strong key={j} className="text-gray-900">{parte}</strong> : parte
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* CTA - Clean */}
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">O caminho está claro.</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                O Elevare transforma diagnóstico em ação. IA aplicada à estratégia, conteúdo e vendas. Sem depender de agência.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="px-8 py-4 rounded-xl font-medium bg-white text-gray-900 hover:bg-gray-100 transition-all"
                >
                  Desbloquear 30 dias grátis
                </button>
                <button
                  onClick={() => setEtapa("captura-lead")}
                  className="px-8 py-4 rounded-xl font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                >
                  Receber por email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CAPTURA DE LEAD */}
        {etapa === "captura-lead" && (
          <div className="py-8 max-w-lg mx-auto text-center">
            {!leadSaved ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Receba seu diagnóstico completo
                </h2>
                <p className="text-gray-600 mb-8">
                  Enviaremos o diagnóstico detalhado + dicas exclusivas para o email ou WhatsApp que preferir.
                </p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveLead}
                  disabled={!email && !whatsapp}
                  className="
                    w-full mt-6 py-4 px-8 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-purple-700
                    hover:from-purple-700 hover:to-purple-800
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Enviar diagnóstico
                </button>
              </>
            ) : (
              <div className="py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Enviado!</h2>
                <p className="text-gray-600 mb-8">
                  Você receberá seu diagnóstico completo em instantes.
                </p>
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="px-8 py-4 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all"
                >
                  Desbloquear 30 dias grátis
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Gamificação */}
      <UnlockModal 
        isOpen={showUnlockModal} 
        onClose={() => setShowUnlockModal(false)}
        diagnosticoId={diagnosticoId}
      />
    </div>
  );
}
